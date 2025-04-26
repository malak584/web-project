const express = require("express");
const router = express.Router();
const { auth, isHR } = require("../middleware/auth");
const {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateEvaluation,
  scheduleInterview,
  updateInterviewStatus,
  getUpcomingInterviews,
  deleteCandidateById,
} = require("../controllers/candidateController");

// Get all candidates
router.get("/", auth, isHR, getAllCandidates);

// Get candidate by ID
router.get("/:id", auth, isHR, getCandidateById);

// Create new candidate
router.post("/", auth, isHR, createCandidate);

router.delete("/:id", auth, isHR, deleteCandidateById);

// Update candidate evaluation
router.patch("/:id/evaluation", auth, isHR, updateEvaluation);

// Schedule interview
router.post("/:id/interviews", auth, isHR, scheduleInterview);

// Update interview status
router.patch("/:id/interviews/:interviewId", auth, isHR, updateInterviewStatus);

// Get upcoming interviews
router.get("/interviews/upcoming", auth, isHR, getUpcomingInterviews);

module.exports = router;
