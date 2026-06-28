// Seed Script - Creates demo accounts and sample tickets
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Ticket = require('./models/Ticket');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    console.log('🗑️ Cleared old data');

    // Create demo users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
    });

    const agent = await User.create({
      name: 'Sarah Agent',
      email: 'agent@demo.com',
      password: 'agent123',
      role: 'agent',
    });

    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@demo.com',
      password: 'customer123',
      role: 'customer',
    });

    console.log('✅ Created 3 demo users');

    // Create sample tickets
    const tickets = [
      {
        title: 'Cannot login to my account',
        description: 'I forgot my password and the reset email is not working. Please help urgently!',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        customer: customer._id,
        assignedAgent: agent._id,
      },
      {
        title: 'Charged twice this month',
        description: 'I see two payment charges on my credit card for the same subscription. Need refund.',
        category: 'billing',
        priority: 'high',
        status: 'open',
        customer: customer._id,
      },
      {
        title: 'Please add dark mode feature',
        description: 'It would be nice to have a dark mode option. Working at night hurts my eyes.',
        category: 'feature-request',
        priority: 'low',
        status: 'open',
        customer: customer._id,
      },
      {
        title: 'System completely down - URGENT',
        description: 'Nothing is working. Emergency situation. Cannot access anything!',
        category: 'technical',
        priority: 'critical',
        status: 'in-progress',
        customer: customer._id,
        assignedAgent: agent._id,
      },
      {
        title: 'How to export my data?',
        description: 'I need help understanding how to export my data to CSV format.',
        category: 'general',
        priority: 'medium',
        status: 'resolved',
        customer: customer._id,
        assignedAgent: agent._id,
        rating: 5,
      },
      {
        title: 'Very disappointed with service',
        description: 'I waited 3 days for a response. This is terrible and unacceptable.',
        category: 'complaint',
        priority: 'high',
        status: 'resolved',
        customer: customer._id,
        assignedAgent: agent._id,
        rating: 3,
      },
    ];

    await Ticket.create(tickets);
    console.log('✅ Created 6 sample tickets');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('   Admin:    admin@demo.com    / admin123');
    console.log('   Agent:    agent@demo.com    / agent123');
    console.log('   Customer: customer@demo.com / customer123');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();