import pool from "../config/db-config.js";

class EmergencyContact {
    static async create(data) {
        const { userId, name, phone, email, relationship } = data;

        const sql = `
            INSERT INTO emergency_contacts (user_id, name, phone, email, relationship)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [userId, name, phone, email, relationship];
        const result = await pool.query(sql, values);
        return result.rows[0];
    }
}

export default EmergencyContact;