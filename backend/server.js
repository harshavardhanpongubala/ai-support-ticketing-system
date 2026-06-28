// Main Server File - Starts our backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

// Create express app
const app = express();

// Middleware
app.use(cors());  // Allow frontend to connect
app.use(express.json());  // Read JSON from requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Test route - check if server is running
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 AI Support Ticketing API is running!',
    status: 'OK'
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});