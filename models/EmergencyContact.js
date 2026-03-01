import pool from "../config/db-config.js";

class EmergencyContact {
    static async create(contactData) {
        const { userId, name, phone, email, relationship } = contactData;
        const query = `
            INSERT INTO emergency_contacts (user_id, name, phone, email, relationship)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(query, [userId, name, phone, email, relationship]);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = `SELECT * FROM emergency_contacts WHERE user_id = $1`;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }
}

export default EmergencyContact;