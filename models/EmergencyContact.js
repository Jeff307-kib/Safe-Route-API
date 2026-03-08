import pool from "../config/db-config.js";

class EmergencyContact {
    static async create(data, db = pool) {
        const { userId, emergencyContactId, relationship, notes } = data;

        const sql = `
            INSERT INTO emergency_contacts (user_id, emergency_contact_id, relationship, notes)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [userId, emergencyContactId, relationship, notes];
        const result = await db.query(sql, values);
        return result.rows[0];
    }
    // Checking duplicates 
static async exists(userId, contactUserId, client = pool) {
    const query = `
        SELECT 1 FROM emergency_contacts 
        WHERE user_id = $1 AND contact_user_id = $2 
        LIMIT 1
    `;
    const result = await client.query(query, [userId, contactUserId]);
    return result.rows.length > 0;
}

    static async findById(id, db = pool) {
        const sql = `SELECT * FROM emergency_contacts WHERE id = $1;`;
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }

    static async findByUserId(userId, db = pool) {
        const sql = `SELECT * FROM emergency_contacts WHERE user_id = $1;`;
        const result = await db.query(sql, [userId]);
        return result.rows;
    }

    static async update(id, data, db = pool) {
        const { emergencyContactId, relationship, notes } = data;
        const sql = `
            UPDATE emergency_contacts 
            SET emergency_contact_id = $1, relationship = $2, notes = $3, updated_at = NOW()
            WHERE id = $4
            RETURNING *;
        `;
        const values = [emergencyContactId, relationship, notes, id];
        const result = await db.query(sql, values);
        return result.rows[0];
    }

    static async delete(id, db = pool) {
        const sql = `DELETE FROM emergency_contacts WHERE id = $1 RETURNING *;`;
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }
}

export default EmergencyContact;