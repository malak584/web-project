const express = require("express");
const router = express.Router();

// Example Route
router.get("/", (req, res) => {
  res.send("Auth API is working!");
});

module.exports = router;
