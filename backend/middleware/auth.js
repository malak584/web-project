const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findOne({ _id: decoded.id, isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const isHR = async (req, res, next) => {
  try {
    if (req.user.role !== 'hr' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. HR personnel only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, isHR }; 