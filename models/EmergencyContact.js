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

    static async findById(id) {
        const sql = `SELECT * FROM emergency_contacts WHERE id = $1;`;
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    }

    static async findByUserId(userId, db = pool) {
        const sql = `SELECT * FROM emergency_contacts WHERE user_id = $1;`;
        const result = await db.query(sql, [userId]);
        return result.rows;
    }

    static async update(id, data) {
        const { name, phone, email, relationship } = data;
        const sql = `
            UPDATE emergency_contacts 
            SET name = $1, phone = $2, email = $3, relationship = $4, updated_at = NOW()
            WHERE id = $5
            RETURNING *;
        `;
        const values = [name, phone, email, relationship, id];
        const result = await pool.query(sql, values);
        return result.rows[0];
    }

    static async delete(id) {
        const sql = `DELETE FROM emergency_contacts WHERE id = $1 RETURNING *;`;
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    }
}

export default EmergencyContact;