const express = require('express');
const router = express.Router();
const multer = require("multer");
const Faculty = require('../models/Faculty');
const HOD = require('../models/HOD');
const Admin = require('../models/Admin');
const Research = require('../models/Research');
const path = require('path');
// File upload setup (remains the same)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const phoneRegex = /^\d{10}$/;
// In your backend route file (e.g., routes/api.js)
router.get("/faculty/department/:department", async (req, res) => {
  try {
    const department = req.params.department;
    const faculties = await Faculty.find({
      department: { $regex: new RegExp(`^${department}$`, "i") }, // Corrected regex
    }).select("facultyId name designation email");
    if (faculties.length === 0) {
      return res.status(404).json({ message: `No faculties found in the ${department} department` });
    }
    res.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties by department:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Get research submissions for a specific faculty (remains the same)
router.get("/researches/faculty/:facultyId", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const researches = await Research.find({ facultyId });
    if (researches.length === 0) {
      return res.status(404).json({ message: "No research submissions found for this faculty" });
    }
    res.json(researches);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//HOD: Get all research submissions (with faculty names) for their department (remains the same)
router.get("/:department/researches", async (req, res) => {
  try {
    const department = req.params.department;
    const faculties = await Faculty.find({
      department: { $regex: new RegExp(department, "i") },
    }).select("facultyId name");
    if (faculties.length === 0) {
      return res.status(404).json({ message: "No faculties found in this department" });
    }
    const facultyIdToName = {};
    faculties.forEach(f => facultyIdToName[f.facultyId] = f.name);
    const facultyIds = faculties.map(f => f.facultyId);
    const researches = await Research.find({ facultyId: { $in: facultyIds } }).sort({ date: -1 });
    const enriched = researches.map(r => ({
      _id: r._id,
      title: r.title,
      type: r.type,
      score: r.score,
      date: r.date,
      fileUrl: r.fileUrl,
      facultyId: r.facultyId,
      facultyName: facultyIdToName[r.facultyId] || "Unknown",
      status: r.status // Ensure status is included
    }));
    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Error fetching researches for HOD:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put('/review/:id', async (req, res) => {
  try {
    const updated = await Research.findByIdAndUpdate(
      req.params.id,
      { status: 'Reviewed' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating status' });
  }
});
// Other existing routes for handling CRUD operations, etc. (remain the same)
router.post("/add", upload.single("file"), async (req, res) => {
  try {
    const { title, type, score, date, facultyId, impactFactor, journalQuality, isbn } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const newResearch = new Research({
      title,
      type,
      score,
      date,
      fileUrl,
      facultyId,
      impactFactor: impactFactor || undefined, // Handle optional fields
      journalQuality: journalQuality || undefined,
      isbn: isbn || undefined,
    });
    await newResearch.save();
    res.status(201).json({ message: "Research entry added successfully", research: newResearch });
  } catch (error) {
    console.error("Error adding research:", error);
    res.status(500).json({ message: "Failed to add research" });
  }
});
// 📍 2. Faculty Research CRUD (remains the same, but ensure they also handle the new fields if you allow editing)
router.get("/faculty/:faculty_id", async (req, res) => {
  try {
    const entries = await Research.find({ facultyId: req.params.faculty_id });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const { title, type, score, date, impactFactor, journalQuality, isbn } = req.body;
    const updatedResearch = await Research.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          type,
          score,
          date,
          impactFactor,
          journalQuality,
          isbn,
        },
      },
      { new: true }
    );
    if (!updatedResearch) return res.status(404).send("Research not found");
    res.status(200).json(updatedResearch);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedResearch = await Research.findByIdAndDelete(req.params.id);
    if (!deletedResearch) {
      return res.status(404).json({ message: "Research entry not found" });
    }
    res.status(200).json({ message: "Research entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// 📍 3. Admin Faculty and HOD Management (remains the same)
router.get("/admin/faculties", async (req, res) => {
  try {
    const faculties = await Faculty.find().sort({ facultyId: 1 });
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching faculties", error: err.message });
  }
});
router.get("/admin/hods", async (req, res) => {
  try {
    const hods = await HOD.find().sort({ hodId: 1 });
    res.json(hods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching HODs", error: err.message });
  }
});
router.post("/admin/add/faculty", async (req, res) => {
  const { facultyId, name, dob, department, designation, email, phone } = req.body;
  if (!facultyId || !name || !dob || !department || !designation || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
  }
  try {
    const newFaculty = new Faculty({ facultyId, name, dob, department, designation, email, phone });
    await newFaculty.save();
    res.json({ message: "Faculty added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding faculty", error: err.message });
  }
});
router.post("/admin/add/hod", async (req, res) => {
  const { hodId, name, dob, department, designation, email, phone } = req.body;
  if (!hodId || !name || !dob || !department || !designation || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
  }
  try {
    const newHod = new HOD({ hodId, name, dob, department, designation, email, phone });
    await newHod.save();
    res.json({ message: "HOD added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding HOD", error: err.message });
  }
});
router.delete('/delete/faculty/:id', async (req, res) => {
  try {
    const deleted = await Faculty.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/delete/hod/:id', async (req, res) => {
  try {
    const deleted = await HOD.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "HOD not found" });
    res.json({ message: "HOD deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { id, dob } = req.body;
  try {
    let user = null;
    let role = null;
    let notifications = [];
    // 1. Check Faculty
    user = await Faculty.findOne({ facultyId: parseInt(id), dob });
    if (user) {
      notifications = user.notifications.reverse(); // Send all notifications, newest first
      return res.status(200).json({
        success: true,
        message: "Faculty login success",
        name: user.name,
        role: 'faculty',
        notifications: notifications,
        facultyId: user.facultyId,
      });
    }
    // 2. Check HOD
    user = await HOD.findOne({ hodId: parseInt(id), dob });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "HOD login success",
        name: user.name,
        role: 'hod',
        department: user.department
      });
    }
    // 3. Check Admin
    user = await Admin.findOne({ adminId: parseInt(id), dob });
    if (user) {
      return res.status(200).json({ success: true, message: "Admin login success", name: user.name, role: 'admin' });
    }
    // If no match found
    return res.status(401).json({ success: false, message: "Invalid User ID or Date of Birth" });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;