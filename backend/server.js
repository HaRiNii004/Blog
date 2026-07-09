const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./src/config/db.js"); // Adjust the path if needed
const postRoutes = require("./src/routes/posts.routes.js");
const uploadRoutes = require("./src/routes/uploadRoutes.js");
const errorHandler = require("./src/middleware/errorHandler.js");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Journal API is running");
});

app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// Error handler (should be after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});