const Comment = require('../models/commentModel')

exports.addComment = async (req, res)=>{
    console.log("inisde addCommentController");
    const { postId, userId, comment } = req.body;
    console.log(postId, userId, comment);
    
    try {
        const  newComment = new Comment({
            postId,
            userId,
            comment
        })
        newComment.save()
        console.log("comment added successfully", newComment);
        res.status(200).json({message: "comment added successfully", newComment})
    } catch (error) {
        console.log("error occured while adding comment", error);
        res.status(500).json("INternal server error occured while adding comment")
        
    }
}

exports.getCommentByPostid = async(req,res)=>{
    console.log("inside getCommentByPostidController");
    const postId = req.params.id;
    try {
        const comments = await Comment.find({postId})
        // .populate('userId', 'username email')
        if(comments.length === 0){
            return res.status(404).json( "No comments found for this post")
        }
        res.status(200).json({comments})
        
    } catch (error) {
        log.error("error occured while getting comment by post id", error);
        res.status(500).json("Internal server error occured while getting comment by post id")
        
    } 
}