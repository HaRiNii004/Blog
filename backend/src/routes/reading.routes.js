const express = require("express");
const { getReadingItems, createOrUpdateReadingItem, deleteReadingItem } = require("../controllers/reading.controller.js");

const router = express.Router();

router.get("/", getReadingItems);
router.post("/", createOrUpdateReadingItem);
router.delete("/:id", deleteReadingItem);

module.exports = router;
