// Ticket Model - Stores support tickets in database
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'general', 'complaint', 'feature-request'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  slaDeadline: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  messages: [{
    senderName: String,
    senderRole: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Set SLA deadline before saving (Simple version)
ticketSchema.pre('save', async function() {
  if (this.isNew) {
    const slaHours = {
      critical: 2,
      high: 8,
      medium: 24,
      low: 72
    };
    const hours = slaHours[this.priority] || 24;
    this.slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);