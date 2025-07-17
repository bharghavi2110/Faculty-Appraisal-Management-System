const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { id, dob } = req.body;
    const adminId = parseInt(id);  // 🔄 Convert to integer

    const admin = await Admin.findOne({ adminId, dob });
    if (admin) {
      res.status(200).json({ success: true, message: "Admin login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid ID or DOB" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
