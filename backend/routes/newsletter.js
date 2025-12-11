const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Newsletter Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// Create Subscription Model
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }

    // Create new subscription
    const subscription = new Subscription({ email });
    await subscription.save();

    res.status(200).json({
      message: 'Subscription successful',
      email: email
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      message: 'Failed to process subscription',
      error: error.message
    });
  }
});

// Get all subscriptions (for admin use)
router.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ subscribedAt: -1 });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
});

module.exports = router; 