import pool from "../config/db-config.js";

class EmergencyContact {
    static async create({ userId, emergencyContactId, relationship, notes }) {
        const query = `
            INSERT INTO emergency_contacts (user_id, emergency_contact_id, relationship, notes)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [userId, emergencyContactId, relationship, notes];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findByUserId(userId) {
        const query = `
            SELECT ec.*, u.full_name, u.phone_number 
            FROM emergency_contacts ec
            JOIN users u ON ec.emergency_contact_id = u.user_id
            WHERE ec.user_id = $1;
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }
}

export default EmergencyContact;