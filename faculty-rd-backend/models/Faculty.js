const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
  facultyId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  notifications: [{
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }]
});
module.exports = mongoose.model("Faculty", facultySchema);