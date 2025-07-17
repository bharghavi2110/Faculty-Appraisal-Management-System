const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema({
  hodId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  department: { type: String, required: true }, 
  designation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model("HOD", hodSchema);
