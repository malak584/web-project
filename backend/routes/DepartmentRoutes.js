const express = require("express");
const router = express.Router();

// Assuming you have a Department model
const Department = require("../models/Department");

// Route to fetch all departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments." });
  }
});

// Route to add a new department
router.post("/departments", async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.status(201).json({ success: true, id: newDepartment._id });
  } catch (error) {
    res.status(500).json({ message: "Error adding department." });
  }
});

module.exports = router;
    