const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Uploads static folder
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));
// DB connection
mongoose.connect("mongodb://localhost:27017/faculty_rnd_evaluation", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
// Routes
const authRoutes = require("./routes/authRoutes");
const researchRoutes = require("./routes/research");
const hodResearchRoutes = require("./routes/hod");
const facultyRoutes = require("./routes/faculty");
app.use("/api/auth", authRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/hod", hodResearchRoutes);
app.use("/api/faculty", facultyRoutes);
// Default root route to avoid 404 on /
app.get("/", (req, res) => {
  res.send("Welcome to the Faculty R&D Evaluation API");
});
// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
