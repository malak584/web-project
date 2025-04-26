const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  technicalScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  softSkillsScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluatedAt: {
    type: Date,
    default: Date.now
  }
});

const interviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  interviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  feedback: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,


















    
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'evaluated', 'interviewed', 'hired', 'rejected'],
    default: 'new'
  },
  resume: {
    type: String,
    required: true
  },
  evaluation: evaluationSchema,
  interviews: [interviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
candidateSchema.index({ email: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ 'interviews.date': 1 });

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate; 