import express from 'express';
import { notificationController } from '../controllers/notification-controller.js';
import { protect } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Apply protect to all notification routes
router.use(protect);

// Retrieval
router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

// Updating Status
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:notificationId/read', notificationController.markAsRead);

// Deletion
router.delete('/delete-all', notificationController.clearAll);
// router.delete('/:notificationId', notificationController.deleteNotifications); // Single
router.delete('/', notificationController.deleteNotifications); // Bulk (ids in body)

export default router;