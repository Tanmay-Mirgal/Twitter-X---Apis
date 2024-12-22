import { Router } from 'express';
import { protectedRoute } from '../middlewares/protectRoute.js';
import { deleteNotifications, getNotifications } from '../controllers/notification.controller.js';

const router = Router();
router.get("/", protectedRoute, getNotifications);
router.delete("/", protectedRoute, deleteNotifications);


export default router;