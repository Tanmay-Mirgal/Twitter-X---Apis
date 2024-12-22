import { Router } from 'express';
import { followUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { protectedRoute } from '../middlewares/protectRoute.js';

const router = Router();

router.get('/profile/:username',protectedRoute,getUserProfile);
router.get('/suggested',protectedRoute,getSuggestedUsers);
router.post('/follow/:id',protectedRoute,followUser);
router.post('/update',protectedRoute,updateUserProfile);

export default router;