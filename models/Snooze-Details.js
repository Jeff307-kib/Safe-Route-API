import pool from "../config/db-config.js";

class SnoozeDetail {
    static async create({ userId, tripId, snoozeDurationMinutes, reason, timeLimit }, db = pool) {
        const query = `
      INSERT INTO snooze_details (user_id, trip_id, snooze_duration_minutes, reason, time_limit, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING *;
    `;

        const values = [userId, tripId, snoozeDurationMinutes, reason || null, timeLimit];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findActiveByTripId(tripId, db = pool) {
        const query = `
      SELECT * FROM snooze_details
      WHERE trip_id = $1 AND is_active = TRUE
      ORDER BY start_time DESC
      LIMIT 1;
    `;

        const result = await db.query(query, [tripId]);
        return result.rows[0] || null;
    }

    static async deactivateByTripId(tripId, db = pool) {
        const query = `
      UPDATE snooze_details
      SET is_active = FALSE
      WHERE trip_id = $1 AND is_active = TRUE
      RETURNING *;
    `;

        const result = await db.query(query, [tripId]);
        return result.rows;
    }

    static async countByTripId(tripId, db = pool) {
        const query = `
      SELECT COUNT(*) AS snooze_count FROM snooze_details
      WHERE trip_id = $1;
    `;

        const result = await db.query(query, [tripId]);
        return parseInt(result.rows[0].snooze_count, 10);
    }

    static async getTotalSnoozedMinutes(tripId, db = pool) {
        const query = `
      SELECT COALESCE(SUM(snooze_duration_minutes), 0) AS total_minutes
      FROM snooze_details
      WHERE trip_id = $1;
    `;

        const result = await db.query(query, [tripId]);
        return parseInt(result.rows[0].total_minutes, 10);
    }
}

export default SnoozeDetail;
