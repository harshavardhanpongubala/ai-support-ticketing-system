// Auth Middleware - Checks if user is logged in before allowing actions
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function 1: Check if user is logged in
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from request header
    // Format: "Bearer eyJhbGc..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, block access
    if (!token) {
      return res.status(401).json({ 
        message: 'Please login first' 
      });
    }

    // Verify token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Save user info to request (so other code can use it)
    req.user = user;
    next();  // Continue to next step

  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
};

// Function 2: Check if user has correct role (admin/agent/customer)
const checkRole = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission' 
      });
    }
    next();
  };
};

module.exports = { protect, checkRole };