const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  coverUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['current', 'recommendation'],
    required: true
  },
  quote: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reading', readingSchema);
