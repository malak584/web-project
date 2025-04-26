const Candidate = require("../models/Candidate");
const User = require("../models/User");

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate("evaluation.evaluatedBy", "name email")
      .populate("interviews.interviewers", "name email");
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Error fetching candidates" });
  }
};

// Get a single candidate
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate("evaluation.evaluatedBy", "name email")
      .populate("interviews.interviewers", "name email");

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    res.status(500).json({ message: "Error fetching candidate" });
  }
};

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    if (error.code === 11000) {
      res.status(409).json({ message: "Email already exists" });
    } else if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error creating candidate" });
    }
  }
};

// Update candidate evaluation
exports.updateEvaluation = async (req, res) => {
  console.log("Données reçues", req.body);
  try {
    const { scores, notes } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const technicalScore = scores.technical * 10;
    const softSkillsScore =
      ((scores.communication + scores.cultureFit) / 2) * 10;

    // Update evaluation data
    candidate.evaluation = {
      ...candidate.evaluation,
      technicalScore,
      softSkillsScore,
      notes,
      evaluatedBy: req.user._id,
      evaluatedAt: new Date(),
    };

    await candidate.save();
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error updating evaluation:", error);
    res.status(500).json({ message: "Error updating evaluation" });
  }
};

// Schedule an interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { date, time, type, interviewers } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Validate interviewers
    const validInterviewers = await User.find({ _id: { $in: interviewers } });
    if (validInterviewers.length !== interviewers.length) {
      return res.status(400).json({ message: "Invalid interviewers" });
    }

    candidate.interviews.push({
      date,
      time,
      type,
      interviewers,
      status: "Scheduled",
    });

    candidate.status = "Interview Scheduled";
    await candidate.save();
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ message: "Error scheduling interview" });
  }
};

// Update interview status
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId, status, feedback, notes } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const interview = candidate.interviews.id(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.status = status;
    interview.feedback = feedback;
    interview.notes = notes;

    if (status === "Completed") {
      candidate.status = "Interviewed";
    }

    await candidate.save();
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ message: "Error updating interview" });
  }
};

// Get upcoming interviews
exports.getUpcomingInterviews = async (req, res) => {
  try {
    const today = new Date();
    const interviews = await Candidate.find({
      "interviews.date": { $gte: today },
      "interviews.status": "Scheduled",
    })
      .select("firstName lastName position department interviews")
      .populate("interviews.interviewers", "name email")
      .sort({ "interviews.date": 1 });

    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching upcoming interviews:", error);
    res.status(500).json({ message: "Error fetching upcoming interviews" });
  }
};

exports.deleteCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.deleteOne();
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Error deleting candidate" });
  }
};