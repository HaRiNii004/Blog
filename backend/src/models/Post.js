const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String], // Array of strings for multiple tags
        default: []
    },
    postingDate: {
        type: Date,
        default: Date.now // Defaults to the current time
    },
    isDraft: {
        type: Boolean,
        default: true // Safer to default to draft until ready to publish
    },
    isPublic: {
        type: Boolean,
        default: false // false = Private, true = Public
    },
    category: {
        type: String,
        trim: true
    },
    content: {
        type: String, // Stores the blog body (Text, HTML for images/videos)
        required: true
    }
}, {
    // This option automatically adds 'createdAt' and 'updatedAt' fields
    // 'updatedAt' will update whenever you edit the post
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);