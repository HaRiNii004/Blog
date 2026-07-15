const Reading = require("../models/Reading.js");
const asyncHandler = require("../utils/asyncHandler");

// Get all reading items (current reads & recommendations)
exports.getReadingItems = asyncHandler(async (req, res) => {
  const items = await Reading.find().sort({ createdAt: -1 });
  res.json(items);
});

// Create or update a reading item
exports.createOrUpdateReadingItem = asyncHandler(async (req, res) => {
  const { title, author, coverUrl, type, quote } = req.body;
  if (!title || !coverUrl || !type) {
    return res.status(400).json({ error: "Title, coverUrl, and type are required" });
  }

  if (type === "current") {
    // Delete any previous current reads so only one current read exists
    await Reading.deleteMany({ type: "current" });
  }

  const item = new Reading({ title, author, coverUrl, type, quote });
  await item.save();
  res.status(201).json(item);
});

// Delete a reading item by ID
exports.deleteReadingItem = asyncHandler(async (req, res) => {
  await Reading.findByIdAndDelete(req.params.id);
  res.json({ message: "Reading item deleted successfully" });
});
