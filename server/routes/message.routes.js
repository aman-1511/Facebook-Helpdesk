const express = require('express');
const messageController = require('../controllers/message.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validateMessage, handleValidationErrors } = require('../middlewares/validations');

const router = express.Router();

// Get all conversations for a page
router.get(
  '/pages/:pageId/conversations',
  verifyToken,
  messageController.getConversations
);

// Get a single conversation with messages
router.get(
  '/conversations/:conversationId',
  verifyToken,
  messageController.getConversation
);

// Send a message to a customer
router.post(
  '/conversations/:conversationId/messages',
  verifyToken,
  validateMessage,
  handleValidationErrors,
  messageController.sendMessage
);

module.exports = router; 