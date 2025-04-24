const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  category: String,
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);