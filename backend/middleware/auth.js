const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, isActive: true });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const isHR = (req, res, next) => {
  if (['HR', 'Admin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. HR only.' });
  }
};

const isManager = (req, res, next) => {
  if (['Manager', 'HR', 'Admin'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Managers only.' });
  }
};

module.exports = { auth, isHR, isManager };