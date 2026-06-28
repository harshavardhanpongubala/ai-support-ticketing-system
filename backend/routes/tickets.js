// Ticket Routes - Create, View, Update tickets
const express = require('express');
const axios = require('axios');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, checkRole } = require('../middleware/auth');

const router = express.Router();

// All routes need login
router.use(protect);

// ============================================
// Route 1: CREATE new ticket (Customer)
// POST /api/tickets
// ============================================
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Step 1: Call Python AI service to get category and priority
    let aiResult = {
      category: 'general',
      priority: 'medium'
    };

    try {
      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/classify`,
        { title, description }
      );
      aiResult = response.data;
    } catch (error) {
      console.log('AI service not available, using defaults');
    }

    // Step 2: Find an agent to assign (one with least tickets)
    const agents = await User.find({ role: 'agent' });
    let assignedAgent = null;
    if (agents.length > 0) {
      // Pick first agent (simple approach)
      assignedAgent = agents[0]._id;
    }

    // Step 3: Create ticket in database
    const ticket = await Ticket.create({
      title,
      description,
      category: aiResult.category,
      priority: aiResult.priority,
      customer: req.user._id,
      assignedAgent: assignedAgent,
      status: assignedAgent ? 'in-progress' : 'open'
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket,
      aiInfo: {
        category: aiResult.category,
        priority: aiResult.priority
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating ticket', 
      error: error.message 
    });
  }
});

// ============================================
// Route 2: GET all tickets (based on role)
// GET /api/tickets
// ============================================
router.get('/', async (req, res) => {
  try {
    let query = {};

    // Customer sees only their tickets
    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    }
    // Agent sees tickets assigned to them
    else if (req.user.role === 'agent') {
      query.assignedAgent = req.user._id;
    }
    // Admin sees all tickets (no filter)

    const tickets = await Ticket.find(query)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });  // Newest first

    res.json({ tickets });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching tickets', 
      error: error.message 
    });
  }
});

// ============================================
// Route 3: GET single ticket by ID
// GET /api/tickets/:id
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching ticket', 
      error: error.message 
    });
  }
});

// ============================================
// Route 4: UPDATE ticket status (Agent/Admin)
// PUT /api/tickets/:id
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ 
      message: 'Ticket updated', 
      ticket 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating ticket', 
      error: error.message 
    });
  }
});

// ============================================
// Route 5: ADD message to ticket
// POST /api/tickets/:id/messages
// ============================================
router.post('/:id/messages', async (req, res) => {
  try {
    const { content } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Add new message
    ticket.messages.push({
      senderName: req.user.name,
      senderRole: req.user.role,
      content
    });

    await ticket.save();

    res.json({ 
      message: 'Message added', 
      ticket 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding message', 
      error: error.message 
    });
  }
});

// ============================================
// Route 6: SUBMIT rating (Customer)
// POST /api/tickets/:id/rating
// ============================================
router.post('/:id/rating', async (req, res) => {
  try {
    const { rating } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ 
      message: 'Rating submitted', 
      ticket 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error submitting rating', 
      error: error.message 
    });
  }
});

// ============================================
// Route 7: GET analytics data (Admin)
// GET /api/tickets/stats/analytics
// ============================================
router.get('/stats/analytics', checkRole('admin', 'agent'), async (req, res) => {
  try {
    // Count tickets by status
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });

    // Count by category
    const categoryStats = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Count by priority
    const priorityStats = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Average rating
    const ratingData = await Ticket.aggregate([
      { $match: { rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = ratingData.length > 0 ? ratingData[0].avgRating.toFixed(1) : 0;

    res.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      categoryStats,
      priorityStats,
      avgRating
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching analytics', 
      error: error.message 
    });
  }
});

module.exports = router;