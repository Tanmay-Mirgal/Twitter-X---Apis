import {Router} from 'express';
import { loginController, signupController,logoutController,getuserController } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/protectRoute.js';

const router = Router();

router.post('/signup',signupController);
router.post('/login',loginController);
router.post('/logout',logoutController);
router.get('/me',protectedRoute,getuserController);

export default router;