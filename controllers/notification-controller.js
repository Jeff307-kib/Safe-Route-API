import notificationService from '../services/notification-service.js';
import catchAsync from '../utils/catch-async.js';
import ApiResponse from '../utils/api-response.js';

export const notificationController = {
    // 1. Get all notifications for the logged-in user
    getMyNotifications: catchAsync(async (req, res) => {
        const { page, limit } = req.query;
        const notifications = await notificationService.getUserNotifications(req.user.user_id, { page, limit });
        ApiResponse.success(res, notifications, 'Notifications retrieved successfully');
    }),

    // 2. Get unread count for the UI badge
    getUnreadCount: catchAsync(async (req, res) => {
        const count = await notificationService.getUnreadCount(req.user.user_id);
        ApiResponse.success(res, { unread_count: count }, 'Unread count retrieved');
    }),

    // 3. Mark one notification as read
    markAsRead: catchAsync(async (req, res) => {
        const { notificationId } = req.params;
        await notificationService.markAsRead(notificationId, req.user.user_id);
        ApiResponse.success(res, null, 'Notification marked as read');
    }),

    // 4. Mark all as read
    markAllAsRead: catchAsync(async (req, res) => {
        await notificationService.markAllAsRead(req.user.user_id);
        ApiResponse.success(res, null, 'All notifications marked as read');
    }),

    // 5. Delete selected or single notification
    deleteNotifications: catchAsync(async (req, res) => {
        // Look for IDs in body (for bulk) or params (for single)
        const ids = req.body.notificationIds || [req.params.notificationId];
        await notificationService.deleteNotifications(ids, req.user.user_id);
        ApiResponse.success(res, null, 'Notifications deleted successfully');
    }),

    // 6. Delete all (Clear History)
    clearAll: catchAsync(async (req, res) => {
        await notificationService.clearAllNotifications(req.user.user_id);
        ApiResponse.success(res, null, 'Notification history cleared');
    })
};