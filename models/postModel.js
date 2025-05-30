const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  category: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array of user IDs
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post
