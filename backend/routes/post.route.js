import {Router} from 'express';
import {createPost,deletePost,likePost,commentPost} from '../controllers/post.controller.js';
import {protectedRoute} from '../middlewares/protectRoute.js';

const router = Router();

router.post('/create',protectedRoute,createPost);
router.delete('/delete/:id',protectedRoute,deletePost);
router.post('/like/:id',protectedRoute,likePost);
router.post('/comment/:id',protectedRoute,commentPost);

export default router;