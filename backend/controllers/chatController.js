const Chat = require('../models/Chat');
const PDF = require('../models/PDF');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key',
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'BeyondChat Study Assistant'
    }
});

const chatController = {
    // Create new chat
    createChat: async (req, res) => {
        try {
            const { userId = 'anonymous', title = 'New Chat', pdfIds = [] } = req.body;

            const chat = new Chat({
                userId: userId,
                title: title,
                pdfContext: pdfIds,
                messages: []
            });

            await chat.save();

            res.json({
                message: 'Chat created successfully',
                chat: chat
            });
        } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).json({ error: 'Failed to create chat' });
        }
    },

    // Get user chats
    getUserChats: async (req, res) => {
        try {
            const { userId = 'anonymous' } = req.query;

            const chats = await Chat.find({ userId })
                .select('title lastUpdated createdDate')
                .sort({ lastUpdated: -1 });

            res.json(chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).json({ error: 'Failed to fetch chats' });
        }
    },

    // Get chat by ID
    getChat: async (req, res) => {
        try {
            const chat = await Chat.findById(req.params.id)
                .populate('pdfContext', 'originalName');

            if (!chat) {
                return res.status(404).json({ error: 'Chat not found' });
            }

            res.json(chat);
        } catch (error) {
            console.error('Error fetching chat:', error);
            res.status(500).json({ error: 'Failed to fetch chat' });
        }
    },

    // Send message
    sendMessage: async (req, res) => {
        try {
            const { chatId, message, userId = 'anonymous' } = req.body;

            const chat = await Chat.findById(chatId).populate('pdfContext');
            if (!chat) {
                return res.status(404).json({ error: 'Chat not found' });
            }

            // Add user message
            chat.messages.push({
                role: 'user',
                content: message
            });

            // Prepare context from PDFs
            let pdfContext = '';
            let citations = [];

            if (chat.pdfContext.length > 0) {
                // Get relevant content from PDFs (simplified RAG)
                for (const pdf of chat.pdfContext) {
                    const relevantChunks = pdf.chunks.filter(chunk => 
                        chunk.text.toLowerCase().includes(message.toLowerCase().split(' ')[0]) ||
                        chunk.text.toLowerCase().includes(message.toLowerCase().split(' ')[1]) ||
                        message.toLowerCase().split(' ').some(word => word.length > 3 && chunk.text.toLowerCase().includes(word))
                    ).slice(0, 3); // Limit to 3 most relevant chunks

                    relevantChunks.forEach(chunk => {
                        pdfContext += `Page ${chunk.pageNumber}: ${chunk.text.substring(0, 300)}...\n\n`;
                        citations.push({
                            pageNumber: chunk.pageNumber,
                            snippet: chunk.text.substring(0, 150) + '...',
                            pdfId: pdf._id
                        });
                    });
                }
            }

            let assistantContent = '';

            // Check if OpenRouter API key is available
            if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || process.env.OPENROUTER_API_KEY === 'dummy-key') {
                // Provide a helpful response without AI
                assistantContent = `I understand you're asking about: "${message}"\n\n`;
                
                if (pdfContext) {
                    assistantContent += `Based on the uploaded materials, here are some relevant excerpts:\n\n${pdfContext}\n\n`;
                    assistantContent += `Note: AI-powered responses are not available without a valid OpenRouter API key. The above content is directly from your uploaded materials.`;
                } else {
                    assistantContent += `I'd be happy to help, but I need access to your study materials first. Please upload some PDFs and add them to this chat context for me to provide relevant information.\n\nNote: AI-powered responses require a valid OpenRouter API key.`;
                }
            } else {
                // Use OpenRouter for intelligent responses
                const systemPrompt = `You are a helpful AI tutor assistant. ${pdfContext ? 'Use the provided context from educational materials to answer questions. Always cite page numbers when referencing the material.' : 'Answer educational questions to the best of your ability.'}

${pdfContext ? `Context from uploaded materials:\n${pdfContext}` : ''}`;

                try {
                    const completion = await openai.chat.completions.create({
                        model: "openai/gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: message }
                        ],
                        temperature: 0.7,
                        max_tokens: 1000
                    });

                    assistantContent = completion.choices[0].message.content;
                } catch (aiError) {
                    console.error('OpenRouter API Error:', aiError);
                    
                    // Handle quota exceeded error specifically
                    if (aiError.status === 429 && aiError.code === 'insufficient_quota') {
                        assistantContent = `I understand you're asking about: "${message}"\n\n`;
                        assistantContent += `**OpenRouter quota exceeded** - AI features are temporarily unavailable.\n\n`;
                        if (pdfContext) {
                            assistantContent += `However, I can still help you with information from your uploaded materials:\n\n${pdfContext}\n\n`;
                            assistantContent += `**Study Tip**: Review the above content carefully and try to understand the key concepts. You can also ask more specific questions about the material.`;
                        } else {
                            assistantContent += `Please upload study materials (PDFs) to get context-specific help even without AI features.`;
                        }
                    } else {
                        // Fallback response for other AI errors
                        assistantContent = `I encountered an issue with the AI service. However, I can still help you with the information from your materials:\n\n${pdfContext || 'Please upload study materials to get context-specific help.'}`;
                    }
                }
            }

            const assistantMessage = {
                role: 'assistant',
                content: assistantContent,
                citations: citations.slice(0, 3) // Limit citations
            };

            chat.messages.push(assistantMessage);
            chat.lastUpdated = new Date();

            await chat.save();

            res.json({
                message: 'Message sent successfully',
                response: assistantMessage
            });

        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    }
};

module.exports = chatController;
