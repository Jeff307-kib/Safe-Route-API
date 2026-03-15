import notificationService from '../services/notification-service.js';
import catchAsync from '../utils/catch-async.js';
import ApiResponse from '../utils/api-response.js';

export const notificationController = {
    getMyNotifications: catchAsync(async (req, res) => {
        const { page, limit } = req.query;
        const notifications = await notificationService.getUserNotifications(req.user.user_id, { page, limit });
        ApiResponse.success(res, notifications, 'Notifications retrieved successfully');
    }),

    getUnreadCount: catchAsync(async (req, res) => {
        const count = await notificationService.getUnreadCount(req.user.user_id);
        ApiResponse.success(res, { unread_count: count }, 'Unread count retrieved');
    }),

    markAsRead: catchAsync(async (req, res) => {
        const { notificationId } = req.params;
        await notificationService.markAsRead(notificationId, req.user.user_id);
        ApiResponse.success(res, null, 'Notification marked as read');
    }),

    markAllAsRead: catchAsync(async (req, res) => {
        await notificationService.markAllAsRead(req.user.user_id);
        ApiResponse.success(res, null, 'All notifications marked as read');
    }),

    deleteNotifications: catchAsync(async (req, res) => {
        const ids = req.body.notificationIds || [req.params.notificationId];
        await notificationService.deleteNotifications(ids, req.user.user_id);
        ApiResponse.success(res, null, 'Notifications deleted successfully');
    }),

    clearAll: catchAsync(async (req, res) => {
        await notificationService.clearAllNotifications(req.user.user_id);
        ApiResponse.success(res, null, 'Notification history cleared');
    })
};