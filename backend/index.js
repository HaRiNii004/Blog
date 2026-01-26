const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const postRoutes = require('./routes/journalRoutes.js');

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());              // Allow cross-origin requests
app.use(express.json());       // Parse JSON body

/* ---------- Test Route ---------- */
app.get("/", (req, res) => {
  res.send("Journal API is running");
});

/* ---------- API Routes ---------- */
app.use('/api/posts', postRoutes);

/* ---------- MongoDB Connection ---------- */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
