const express = require('express');
const router = express.Router();
const Research = require('../models/Research');
const Faculty = require('../models/Faculty');

router.put('/review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedResearch = await Research.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedResearch) {
      return res.status(404).json({ message: "Research submission not found" });
    }

    if (status === "Reviewed") {
      const research = await Research.findById(id);
      const faculty = await Faculty.findOne({ facultyId: research.facultyId });
      if (faculty) {
        const notificationMessage = {
          message: `Your research submission titled "${research.title}" has been reviewed by the HOD. Please check the dashboard for any updates.`,
        };
        faculty.notifications.push(notificationMessage);
        await faculty.save();
        console.log(`Notification saved for faculty ID: ${faculty.facultyId}, research ID: ${id}`);
      }
    }

    res.json(updatedResearch);
  } catch (err) {
    console.error("Error updating research status:", err);
    res.status(500).json({ error: 'Error updating status' });
  }
});

// HOD: Get all research submissions (with faculty names and emails) for their department
router.get("/:department/researches", async (req, res) => {
  try {
    const department = req.params.department;
    const faculties = await Faculty.find({
      department: { $regex: new RegExp(department, "i") },
    }).select("facultyId name email"); // Include email

    if (faculties.length === 0) {
      return res.status(404).json({ message: "No faculties found in this department" });
    }

    const facultyIdToInfo = {};
    faculties.forEach(f => facultyIdToInfo[f.facultyId] = { name: f.name, email: f.email });
    const facultyIds = Object.keys(facultyIdToInfo);

    const researches = await Research.find({ facultyId: { $in: facultyIds } }).sort({ date: -1 });

    const enriched = researches.map(r => ({
      _id: r._id,
      title: r.title,
      type: r.type,
      score: r.score,
      date: r.date,
      fileUrl: r.fileUrl,
      facultyId: r.facultyId,
      facultyName: facultyIdToInfo[r.facultyId]?.name || "Unknown",
      facultyEmail: facultyIdToInfo[r.facultyId]?.email, // Include faculty email in the response
      status: r.status,
      impactFactor: r.impactFactor,
      journalQuality: r.journalQuality,
      isbn: r.isbn,
    }));

    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Error fetching researches for HOD:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;