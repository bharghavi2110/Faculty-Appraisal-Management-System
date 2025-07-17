const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");

// Faculty login route
router.post("/login/faculty", async (req, res) => {
  const { id, dob } = req.body;
  const facultyId = parseInt(id);  // Convert to number

  try {
    const faculty = await Faculty.findOne({ facultyId, dob });

    if (faculty) {
      res.status(200).json({ success: true, message: "Faculty login success" });
    } else {
      res.status(401).json({ success: false, message: "Invalid Faculty ID or DOB" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 1. Get faculties by department (Modified regex)
router.get("/department/:department", async (req, res) => {
  try {
    const department = req.params.department;
    // Modified regex for case-insensitive search that includes the department
    const faculties = await Faculty.find({
      department: { $regex: new RegExp(department, "i") },
    }).select("facultyId name designation email"); // Added designation

    if (faculties.length === 0) {
      return res.status(404).json({ message: "No faculties found in this department" });
    }
    res.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties by department:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
