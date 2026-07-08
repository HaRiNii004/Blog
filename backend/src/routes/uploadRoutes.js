const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

// upload.single('image') means: expect ONE file, sent under the form field name "image"
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url: fileUrl });
});

module.exports = router;