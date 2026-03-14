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
    
    static async exists(userId, contactUserId, client = pool) {
    const query = `
        SELECT 1 FROM emergency_contacts 
        WHERE user_id = $1 AND emergency_contact_id = $2 
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

    static async update(id, updateData, db = pool) {
        
        const allowedFields = [
            "emergency_contact_id",
            "relationship",
            "notes"
        ];

        const fields = [];
        const values = [];

        
        for (const key of allowedFields) {
            if (updateData[key] !== undefined) {
                
                fields.push(`${key} = $${values.length + 1}`);
                values.push(updateData[key]);
            }
        }

        
        fields.push("updated_at = NOW()");

        
        if (fields.length === 1) return null;

        
        values.push(id);

        const sql = `
            UPDATE emergency_contacts
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `;

        const result = await db.query(sql, values);
        return result.rows[0];
    }

    static async findAllByUserId(userId, db = pool) {
    const sql = `
        SELECT 
            ec.id,
            ec.user_id,
            ec.emergency_contact_id,
            ec.relationship,
            ec.notes,
            ec.created_at,
            u.full_name AS contact_name,
            u.email AS contact_email,
            u.phone_number AS contact_phone
        FROM emergency_contacts ec
        JOIN users u ON ec.emergency_contact_id = u.user_id
        WHERE ec.user_id = $1
        ORDER BY ec.created_at DESC;
    `;
    
    const result = await db.query(sql, [userId]);
    return result.rows;
}


    static async delete(id, db = pool) {
        const sql = `DELETE FROM emergency_contacts WHERE id = $1 RETURNING *;`;
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }
}

export default EmergencyContact;