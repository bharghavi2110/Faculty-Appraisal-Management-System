const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const Research = require('../models/Research');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all research entries of a particular faculty
router.get("/faculty/:faculty_id", async (req, res) => {
  try {
    const entries = await Research.find({ facultyId: req.params.faculty_id });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add Research Entry
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

// Update Research Entry (with file support)
router.put("/update/:id", upload.single("file"), async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);
    if (!research) {
      return res.status(404).json({ message: "Research entry not found" });
    }

    // If a new file is uploaded, delete old file
    if (req.file) {
      if (research.fileUrl) {
        const oldFilePath = path.join(__dirname, "..", research.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      research.fileUrl = `/uploads/${req.file.filename}`;
    }

    // Update other fields
    research.title = req.body.title;
    research.type = req.body.type;
    research.score = req.body.score;
    research.date = req.body.date;
    research.impactFactor = req.body.impactFactor;
    research.journalQuality = req.body.journalQuality;
    research.isbn = req.body.isbn;

    await research.save();

    res.status(200).json({ message: "Research entry updated successfully", research });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating" });
  }
});

// Delete Research Entry
router.delete("/delete/:id", async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);
    if (!research) {
      return res.status(404).json({ message: "Research entry not found" });
    }

    // Delete file from uploads if exists
    if (research.fileUrl) {
      const filePath = path.join(__dirname, "..", research.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await research.deleteOne();
    res.json({ message: "Research entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting" });
  }
});

// Get all research submissions for a department (you might need to adjust this based on your needs)
router.get("/department/:dept/researches", async (req, res) => {
  try {
    const faculties = await Faculty.find({ department: { $regex: new RegExp(req.params.dept, "i") } }).select('facultyId');
    const facultyIds = faculties.map(f => f.facultyId);
    const researches = await Research.find({ facultyId: { $in: facultyIds } });
    res.json(researches);
  } catch (error) {
    console.error("Error fetching researches:", error);
    res.status(500).send("Server error");
  }
});

// Update research status to "Reviewed"
router.put("/review/:id", async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);

    if (!research) {
      return res.status(404).send("Research not found");
    }

    research.status = "Reviewed";
    await research.save();

    res.json({ message: "Research marked as reviewed" });
  } catch (error) {
    console.error("Error reviewing research:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;