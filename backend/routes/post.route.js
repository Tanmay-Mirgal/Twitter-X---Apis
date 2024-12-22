import {Router} from 'express';
import {createPost,deletePost,likePost,commentPost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts} from '../controllers/post.controller.js';
import {protectedRoute} from '../middlewares/protectRoute.js';

const router = Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.post('/create',protectedRoute,createPost);
router.delete('/delete/:id',protectedRoute,deletePost);
router.post('/like/:id',protectedRoute,likePost);
router.post('/comment/:id',protectedRoute,commentPost);

export default router;