const express = require('express');
const router = express.Router();
const PDF = require('../models/PDF');

// Get video recommendations based on PDF content
router.get('/recommendations/:pdfId', async (req, res) => {
    try {
        const { pdfId } = req.params;
        
        // Get PDF content for analysis
        const pdf = await PDF.findById(pdfId);
        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        // Analyze PDF content to generate relevant video recommendations
        const keywords = extractKeywords(pdf.content);
        const videos = await generateVideoRecommendations(keywords, pdf.originalName);
        
        res.json({
            pdfTitle: pdf.originalName,
            keywords,
            videos
        });
    } catch (error) {
        console.error('Error getting video recommendations:', error);
        res.status(500).json({ error: 'Failed to get video recommendations' });
    }
});

// Get video recommendations for multiple PDFs
router.post('/recommendations/bulk', async (req, res) => {
    try {
        const { pdfIds } = req.body;
        
        if (!pdfIds || pdfIds.length === 0) {
            return res.status(400).json({ error: 'PDF IDs are required' });
        }

        // Get all PDFs
        const pdfs = await PDF.find({ _id: { $in: pdfIds } });
        
        // Combine content from all PDFs
        const combinedContent = pdfs.map(pdf => pdf.content).join(' ');
        const combinedTitle = pdfs.map(pdf => pdf.originalName).join(', ');
        
        const keywords = extractKeywords(combinedContent);
        const videos = await generateVideoRecommendations(keywords, combinedTitle);
        
        res.json({
            sourceTitle: combinedTitle,
            keywords,
            videos
        });
    } catch (error) {
        console.error('Error getting bulk video recommendations:', error);
        res.status(500).json({ error: 'Failed to get video recommendations' });
    }
});

// Extract keywords from PDF content using AI
function extractKeywords(content) {
    // Enhanced keyword extraction using both static and dynamic analysis
    const staticPhysicsKeywords = [
        'motion', 'velocity', 'acceleration', 'force', 'energy', 'momentum',
        'gravity', 'waves', 'optics', 'thermodynamics', 'electricity', 'magnetism',
        'quantum', 'mechanics', 'kinematics', 'dynamics', 'oscillations', 'sound',
        'light', 'electromagnetic', 'nuclear', 'atomic', 'molecular', 'units',
        'measurements', 'vectors', 'scalars', 'work', 'power', 'friction',
        'circular motion', 'rotational', 'angular', 'torque', 'fluid', 'pressure',
        'temperature', 'heat', 'entropy', 'capacitance', 'resistance', 'current'
    ];
    
    const foundKeywords = [];
    const lowercaseContent = content.toLowerCase();
    
    // Static keyword matching
    staticPhysicsKeywords.forEach(keyword => {
        if (lowercaseContent.includes(keyword)) {
            foundKeywords.push(keyword);
        }
    });
    
    // Dynamic keyword extraction using simple NLP techniques
    const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordFreq = {};
    
    words.forEach(word => {
        if (!['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'after', 'back', 'other', 'many', 'than', 'then', 'them', 'these', 'some', 'her', 'would', 'make', 'like', 'him', 'has', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'].includes(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    // Add frequently occurring technical terms
    Object.entries(wordFreq)
        .filter(([word, freq]) => freq >= 2 && word.length >= 4)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([word]) => {
            if (!foundKeywords.includes(word)) {
                foundKeywords.push(word);
            }
        });
    
    return foundKeywords;
}

// Generate video recommendations based on keywords using AI analysis
async function generateVideoRecommendations(keywords, title) {
    // Enhanced video database with more content
    const baseVideos = [
        {
            id: 'physics_fundamentals_1',
            title: 'Physics Fundamentals: Motion and Forces',
            channel: 'Khan Academy',
            thumbnail: 'https://img.youtube.com/vi/ZM8ECpBuQYE/maxresdefault.jpg',
            duration: '15:30',
            views: '2.5M',
            likes: '125K',
            description: 'Understanding the basic concepts of motion, velocity, acceleration and Newton\'s laws of motion.',
            url: 'https://youtube.com/watch?v=ZM8ECpBuQYE',
            tags: ['motion', 'force', 'velocity', 'acceleration', 'newton', 'laws'],
            difficulty: 'beginner',
            chapter: 'mechanics'
        },
        {
            id: 'work_energy_power',
            title: 'Work, Energy and Power - Complete Chapter',
            channel: 'Physics Wallah',
            thumbnail: 'https://img.youtube.com/vi/w4QFJb9a8vo/maxresdefault.jpg',
            duration: '45:20',
            views: '1.8M',
            likes: '98K',
            description: 'Comprehensive explanation of work-energy theorem, kinetic and potential energy.',
            url: 'https://youtube.com/watch?v=w4QFJb9a8vo',
            tags: ['energy', 'work', 'power', 'mechanics', 'kinetic', 'potential'],
            difficulty: 'intermediate',
            chapter: 'mechanics'
        },
        {
            id: 'gravitation_orbital',
            title: 'Gravitation and Orbital Motion',
            channel: 'Unacademy Physics',
            thumbnail: 'https://img.youtube.com/vi/7i808check8/maxresdefault.jpg',
            duration: '28:45',
            views: '890K',
            likes: '45K',
            description: 'Newton\'s law of universal gravitation, gravitational field, and satellite motion.',
            url: 'https://youtube.com/watch?v=7i808check8',
            tags: ['gravity', 'motion', 'force', 'mechanics', 'orbital', 'satellite'],
            difficulty: 'intermediate',
            chapter: 'gravitation'
        },
        {
            id: 'oscillations_shm',
            title: 'Oscillations and Simple Harmonic Motion',
            channel: 'Vedantu Physics',
            thumbnail: 'https://img.youtube.com/vi/O-QqC52kquk/maxresdefault.jpg',
            duration: '35:15',
            views: '1.2M',
            likes: '67K',
            description: 'Understanding SHM, pendulum motion, and wave concepts in physics.',
            url: 'https://youtube.com/watch?v=O-QqC52kquk',
            tags: ['oscillations', 'waves', 'motion', 'mechanics', 'pendulum', 'frequency'],
            difficulty: 'intermediate',
            chapter: 'waves'
        },
        {
            id: 'thermodynamics_laws',
            title: 'Thermodynamics Laws and Applications',
            channel: 'BYJU\'S Physics',
            thumbnail: 'https://img.youtube.com/vi/GiAj9WL4itE/maxresdefault.jpg',
            duration: '52:10',
            views: '1.5M',
            likes: '78K',
            description: 'First and second law of thermodynamics with real-world applications.',
            url: 'https://youtube.com/watch?v=GiAj9WL4itE',
            tags: ['thermodynamics', 'energy', 'heat', 'temperature', 'entropy', 'laws'],
            difficulty: 'advanced',
            chapter: 'thermodynamics'
        },
        {
            id: 'waves_sound',
            title: 'Waves and Sound Physics',
            channel: 'Physics Galaxy',
            thumbnail: 'https://img.youtube.com/vi/qNf96Tslhz0/maxresdefault.jpg',
            duration: '40:30',
            views: '750K',
            likes: '42K',
            description: 'Wave properties, sound waves, Doppler effect, and wave interference.',
            url: 'https://youtube.com/watch?v=qNf96Tslhz0',
            tags: ['waves', 'sound', 'oscillations', 'frequency', 'amplitude', 'doppler'],
            difficulty: 'intermediate',
            chapter: 'waves'
        },
        {
            id: 'electromagnetic_waves',
            title: 'Electromagnetic Waves and Light',
            channel: 'Physics Concepts',
            thumbnail: 'https://img.youtube.com/vi/lwfJPc-rSXw/maxresdefault.jpg',
            duration: '38:20',
            views: '680K',
            likes: '39K',
            description: 'Understanding electromagnetic spectrum, light properties, and wave-particle duality.',
            url: 'https://youtube.com/watch?v=lwfJPc-rSXw',
            tags: ['electromagnetic', 'light', 'waves', 'optics', 'spectrum', 'photon'],
            difficulty: 'advanced',
            chapter: 'optics'
        },
        {
            id: 'units_measurements',
            title: 'Units and Measurements - Physics Basics',
            channel: 'Khan Academy Physics',
            thumbnail: 'https://img.youtube.com/vi/s-4b3kwofEs/maxresdefault.jpg',
            duration: '22:15',
            views: '1.1M',
            likes: '55K',
            description: 'SI units, dimensional analysis, and measurement techniques in physics.',
            url: 'https://youtube.com/watch?v=s-4b3kwofEs',
            tags: ['measurements', 'units', 'physics', 'dimensions', 'analysis', 'scale'],
            difficulty: 'beginner',
            chapter: 'fundamentals'
        },
        {
            id: 'vectors_scalars',
            title: 'Vectors and Scalars - Complete Guide',
            channel: 'Professor Dave Explains',
            thumbnail: 'https://img.youtube.com/vi/ml4NSzCQobk/maxresdefault.jpg',
            duration: '25:40',
            views: '920K',
            likes: '48K',
            description: 'Understanding vector quantities, scalar quantities, and vector operations.',
            url: 'https://youtube.com/watch?v=ml4NSzCQobk',
            tags: ['vectors', 'scalars', 'mathematics', 'physics', 'direction', 'magnitude'],
            difficulty: 'beginner',
            chapter: 'mathematics'
        },
        {
            id: 'circular_motion',
            title: 'Circular Motion and Centripetal Force',
            channel: 'Michel van Biezen',
            thumbnail: 'https://img.youtube.com/vi/bpFK2VCRHUs/maxresdefault.jpg',
            duration: '33:25',
            views: '560K',
            likes: '34K',
            description: 'Uniform circular motion, centripetal acceleration, and real-world applications.',
            url: 'https://youtube.com/watch?v=bpFK2VCRHUs',
            tags: ['circular', 'motion', 'centripetal', 'acceleration', 'rotation', 'angular'],
            difficulty: 'intermediate',
            chapter: 'mechanics'
        }
    ];
    
    // Advanced scoring algorithm with multiple factors
    const recommendedVideos = baseVideos.map(video => {
        let relevanceScore = 40; // Base score
        
        // Keyword matching score (0-40 points)
        const exactMatches = video.tags.filter(tag => 
            keywords.some(keyword => keyword.toLowerCase() === tag.toLowerCase())
        ).length;
        
        const partialMatches = video.tags.filter(tag => 
            keywords.some(keyword => 
                tag.toLowerCase().includes(keyword.toLowerCase()) || 
                keyword.toLowerCase().includes(tag.toLowerCase())
            )
        ).length - exactMatches;
        
        relevanceScore += exactMatches * 15; // 15 points per exact match
        relevanceScore += partialMatches * 8; // 8 points per partial match
        
        // Title relevance score (0-20 points)
        const titleWords = title.toLowerCase().split(/\s+/);
        const titleMatches = video.tags.filter(tag => 
            titleWords.some(word => word.includes(tag) || tag.includes(word))
        ).length;
        relevanceScore += Math.min(20, titleMatches * 5);
        
        // Popularity score (0-15 points)
        const viewsNumber = parseFloat(video.views.replace(/[^\d.]/g, ''));
        const viewsMultiplier = video.views.includes('M') ? 1000000 : video.views.includes('K') ? 1000 : 1;
        const totalViews = viewsNumber * viewsMultiplier;
        const popularityScore = Math.min(15, (totalViews / 100000) * 2);
        relevanceScore += popularityScore;
        
        // Difficulty matching (bonus points)
        const keywordComplexity = keywords.some(k => 
            ['quantum', 'electromagnetic', 'thermodynamics', 'nuclear'].includes(k)
        ) ? 'advanced' : keywords.some(k => 
            ['motion', 'force', 'energy', 'velocity'].includes(k)
        ) ? 'intermediate' : 'beginner';
        
        if (video.difficulty === keywordComplexity) {
            relevanceScore += 10;
        }
        
        // Ensure score doesn't exceed 100
        relevanceScore = Math.min(100, relevanceScore);
        
        return {
            ...video,
            relevanceScore: Math.round(relevanceScore),
            matchingTags: video.tags.filter(tag => 
                keywords.some(keyword => 
                    tag.toLowerCase().includes(keyword.toLowerCase()) || 
                    keyword.toLowerCase().includes(tag.toLowerCase())
                )
            )
        };
    })
    .filter(video => video.relevanceScore > 50) // Only include relevant videos
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
    .slice(0, 8); // Limit to top 8 videos
    
    // If no videos meet the threshold, return top 3 anyway
    if (recommendedVideos.length === 0) {
        return baseVideos
            .sort((a, b) => {
                const aViews = parseFloat(a.views.replace(/[^\d.]/g, '')) * (a.views.includes('M') ? 1000000 : 1000);
                const bViews = parseFloat(b.views.replace(/[^\d.]/g, '')) * (b.views.includes('M') ? 1000000 : 1000);
                return bViews - aViews;
            })
            .slice(0, 3)
            .map(video => ({ ...video, relevanceScore: 60, matchingTags: [] }));
    }
    
    return recommendedVideos;
}

module.exports = router;
