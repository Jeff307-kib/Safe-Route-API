import express from 'express';
import { notificationController } from '../controllers/notification-controller.js';
import { protect } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:notificationId/read', notificationController.markAsRead);

router.delete('/delete-all', notificationController.clearAll);
// router.delete('/:notificationId', notificationController.deleteNotifications); // Single
router.delete('/', notificationController.deleteNotifications); // Bulk (ids in body)

export default router;