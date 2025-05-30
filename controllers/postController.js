const Post = require('../models/postModel');

// Create a new post
exports.addPost = async (req, res) => {
  console.log("inside addPostController");
  try {
    const { title, content, category, author } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({ title, content, image, category, author, });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error("Error while adding post:", err);
    res.status(500).json({ error: 'Failed to create a post', details: err });
  }
};
// get all post
exports.getAllPosts = async (req, res) => {
  console.log("inside getAllPostsController");
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.status(200).json(posts);
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
// get post by id

exports.getPostById = async (req, res) => {
  console.log("inside getPostByIdController");
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('author', 'username email');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error("Get Post by ID Error:", err);
    res.status(500).json({ error: 'Failed to fetch post', details: err });
  }
}
// get post by user id  

exports.getPostByUserId = async (req, res) => {
  console.log("inside getPostByUserIdController");
  try {
    const userId = req.params.id;
    // Gets all posts where author matches the given user ID.
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username email');

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found for this user' });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Get Post by User ID Error:", err);
    res.status(500).json({ error: 'Failed to fetch posts', details: err });
  }
};

// Update a post
exports.editPost = async (req, res) => {
  console.log(">>> inside editPostController");

  try {
    const postId = req.params.id;
    const userId = req.user?.id;
    const uploadImg = req.file ? req.file.filename : null;

    console.log("req.body:", req.body);
    console.log("uploadImg:", uploadImg);
    console.log("userId from JWT:", userId);

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      console.log("Unauthorized access");
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      ...(uploadImg && { image: uploadImg })
    };

    console.log("Updates to apply:", updates);

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true });
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (err) {
    console.error("Edit Post Error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    res.status(500).json({ error: 'Failed to update post', details: err.message || err });
  }
};




// Delete a post
exports.deletePost = async (req, res) => {
  console.log("inside deletePostController");
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You are not the author of this post' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ error: 'Failed to delete post', details: err });
  }
};
// Like post
exports.likePost = async (req, res) => {
  log("inside likePostController");
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming user info from middleware (auth)

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user already liked the post
    const hasLiked = post.likes.some(id => id.toString() === userId);

    if (hasLiked) {
      // If already liked → Unlike → Remove userId
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // If not yet liked → Like → Add userId
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: hasLiked ? 'Post unliked' : 'Post liked',
      post: post  // ✅ return full updated post
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};



// exports.likePost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );

//     if (!updatedPost) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.status(200).json(updatedPost);
//   } catch (error) {
//     console.error("Error liking post:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// }
// exports.likePost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.user.id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     const hasLiked = post.likes.includes(userId);

//     if (hasLiked) {
//       post.likes = post.likes.filter(id => id.toString() !== userId);
//     } else {
//       post.likes.push(userId);
//     }
//     await post.save();

//     res.status(200).json({
//       message: hasLiked ? 'Post unliked' : 'Post liked',
//       likesCount: post.likes.length,
//       post,
//     });
//   } catch (error) {
//     console.error("Error toggling like:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// Top post
exports.topPosts = async (req, res) => {
  try {
    const topPosts = await Post.find()
      .sort({ likes: -1 })
      .limit(5)
      .populate('author', 'username email');

    res.status(200).json(topPosts);
  } catch (error) {
    console.error("Error fetching top posts:", error);
    res.status(500).json({ message: "Failed to fetch top posts." });
  }
}
