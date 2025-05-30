const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId : {type: mongoose.Schema.Types.ObjectId, ref:'Post', required: true},
    userId : {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    comment : {type: String, required: true}
},{timestamps: true});

const Comment = mongoose.model('Comments', commentSchema);
module.exports = Comment;

