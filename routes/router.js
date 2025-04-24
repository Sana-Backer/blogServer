const express = require('express');
const userController = require('../controllers/userControllers');
const jwtMiddleware = require('../middlewares/jwt');
const postController = require('../controllers/postController');
const multerMiddleware = require('../middlewares/multer');

const router = new express.Router();


router.post('/register', userController.registerController);
// login
router.post('/login', userController.loginController);
// all userss
router.get('/users', userController.getAllUsers);
// Add a new post
router.post('/add-post', multerMiddleware.single('image'), postController.addPost);
// get all posts
router.get('/posts', postController.getAllPosts);
// get a post by user
router.get('/posts/:id',jwtMiddleware, postController.getPostByUserId);


// Edit a post
router.put('/posts/:id',jwtMiddleware,multerMiddleware.single('image'), postController.editPost);

// Delete a post
router.delete('/posts/:id',jwtMiddleware, postController.deletePost);
// Top post
router.get('/top-post', postController.topPosts)

// Like post
router.put('/posts/:id/like', postController.likePost);

module.exports = router;
