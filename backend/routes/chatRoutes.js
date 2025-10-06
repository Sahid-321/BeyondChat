const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Create new chat
router.post('/create', chatController.createChat);

// Get user chats
router.get('/user', chatController.getUserChats);

// Get chat by ID
router.get('/:id', chatController.getChat);

// Send message
router.post('/message', chatController.sendMessage);

module.exports = router;
