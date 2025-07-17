const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  facultyId: { type: Number, required: true, unique: true },
  dob: { type: String, required: true },
  name: { type: String, required: true },
});
module.exports = mongoose.model("Admin", adminSchema);

