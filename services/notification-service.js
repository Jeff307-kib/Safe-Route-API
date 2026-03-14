import Notification from '../models/Notification.js';
import AppError from '../utils/app-error.js';

class NotificationService {
    async createNotification(data, db) {
        return await Notification.create(data, db);
    }

    async getUserNotifications(userId, { page = 1, limit = 20 }) {
        const offset = (page - 1) * limit;
        return await Notification.getAllByUser(userId, limit, offset);
    }

    async getUnreadCount(userId) {
        return await Notification.getUnreadCount(userId);
    }

    async markAsRead(notificationId, userId) {
        const notification = await Notification.markAsRead(notificationId, userId);
        
        if (!notification) {
            throw new AppError('Notification not found or already read', 404);
        }
        
        return notification;
    }

    async markAllAsRead(userId) {
        return await Notification.markAllAsRead(userId);
    }


    async deleteNotifications(notificationIds, userId) {
        const idsArray = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
        
        if (idsArray.length === 0) {
            throw new AppError('No notification IDs provided', 400);
        }

        const deleted = await Notification.deleteSelected(idsArray, userId);
        
        if (deleted.length === 0) {
            throw new AppError('No notifications found to delete', 404);
        }

        return deleted;
    }

    async clearAllNotifications(userId) {
        return await Notification.deleteAll(userId);
    }
}

export default new NotificationService();