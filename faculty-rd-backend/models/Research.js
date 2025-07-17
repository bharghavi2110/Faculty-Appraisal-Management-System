const mongoose = require("mongoose");
const researchSchema = new mongoose.Schema({
  facultyId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String },
  score: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "Pending" },
  impactFactor: { type: String }, // Optional for Journal Publications
  journalQuality: { type: String }, // Optional for Journal Publications (e.g., Q1, Q2, None)
  isbn: { type: String }, // Optional for specific Conference types
});
const Research = mongoose.model("Research", researchSchema);
module.exports = Research;