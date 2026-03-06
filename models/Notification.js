import pool from '../config/db-config.js';

class Notification {
    static async create(data, db = pool) {
        const { recipientId, referenceId, referenceType, message } = data;
        const sql = `
            INSERT INTO notifications (recipient_id, reference_id, reference_type, notification_message)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await db.query(sql, [recipientId, referenceId, referenceType, message]);
        return result.rows[0];
    }

    static async getAllByUser(userId, limit = 20, offset = 0, db = pool) {
        const sql = `
            SELECT * FROM notifications 
            WHERE recipient_id = $1 
            ORDER BY sent_at DESC 
            LIMIT $2 OFFSET $3;
        `;
        const result = await db.query(sql, [userId, limit, offset]);
        return result.rows;
    }

    static async getUnreadCount(userId, db = pool) {
        const sql = `SELECT COUNT(*) FROM notifications WHERE recipient_id = $1 AND read_at IS NULL`;
        const result = await db.query(sql, [userId]);
        return parseInt(result.rows[0].count);
    }

    static async markAsRead(notificationId, userId, db = pool) {
        const sql = `
            UPDATE notifications 
            SET read_at = NOW() 
            WHERE notification_id = $1 AND recipient_id = $2 AND read_at IS NULL
            RETURNING *;
        `;
        const result = await db.query(sql, [notificationId, userId]);
        return result.rows[0];
    }

    static async markAllAsRead(userId, db = pool) {
        const sql = `
            UPDATE notifications 
            SET read_at = NOW() 
            WHERE recipient_id = $1 AND read_at IS NULL
            RETURNING notification_id;
        `;
        const result = await db.query(sql, [userId]);
        return result.rows;
    }

    static async deleteSelected(notificationIds, userId, db = pool) {
        const sql = `
            DELETE FROM notifications 
            WHERE notification_id = ANY($1) AND recipient_id = $2
            RETURNING notification_id;
        `;
        const result = await db.query(sql, [notificationIds, userId]);
        return result.rows;
    }

    static async deleteAll(userId, db = pool) {
        const sql = `
            DELETE FROM notifications 
            WHERE recipient_id = $1;
        `;
        await db.query(sql, [userId]);
        return true;
    }
}

export default Notification;