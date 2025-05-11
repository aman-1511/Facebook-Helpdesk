const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    ref: 'Page'
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPicture: {
    type: String,
    default: null
  },
  lastMessageTimestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Compound index for faster customer lookup within a page
conversationSchema.index({ pageId: 1, customerId: 1 });
// Index for sorting by last message timestamp
conversationSchema.index({ lastMessageTimestamp: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation; 