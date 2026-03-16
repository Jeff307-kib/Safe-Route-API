import pool from "../config/db-config.js";

class EmergencyContact {

    static async create(data, db = pool) {
        const { requesterId, addresseeId, relationship, notes } = data;

        const sql = `
            INSERT INTO emergency_contacts (requester_id, addressee_id, requester_relationship, requester_notes, status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *;
        `;

        const result = await db.query(sql, [requesterId, addresseeId, relationship, notes]);
        return result.rows[0];
    }

    // Checks if a relationship exists in EITHER direction
    static async existsSymmetric(idA, idB, db = pool) {
        const sql = `
            SELECT 1 FROM emergency_contacts 
            WHERE (requester_id = $1 AND addressee_id = $2) 
               OR (requester_id = $2 AND addressee_id = $1)
            LIMIT 1;
        `;
        const result = await db.query(sql, [idA, idB]);
        return result.rows.length > 0;
    }

    /**
 * Get Single Partner Details
 * Ensures the person requesting is either the requester or addressee
 */
    static async findContactById(id, myId, db = pool) {
        const sql = `
        SELECT 
            ec.id,
            ec.status,
            ec.created_at,
            CASE WHEN ec.requester_id = $2 THEN ec.requester_relationship ELSE ec.addressee_relationship END AS my_label_for_them,
            CASE WHEN ec.requester_id = $2 THEN ec.requester_notes ELSE ec.addressee_notes END AS my_private_notes,

            u.user_id AS contact_id,
            u.full_name AS contact_name,
            u.phone_number AS contact_phone,
            u.email AS contact_email
        FROM emergency_contacts ec
        JOIN users u ON u.user_id = (
            CASE WHEN ec.requester_id = $2 THEN ec.addressee_id ELSE ec.requester_id END
        )
        WHERE ec.id = $1 AND (ec.requester_id = $2 OR ec.addressee_id = $2);
    `;
        const result = await db.query(sql, [id, myId]);
        return result.rows[0];
    }

    static async findById(id, db = pool) {
        const sql = `SELECT * FROM emergency_contacts WHERE id = $1;`;
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }

    static async acceptRequest(id, db = pool) {
        const sql = `
            UPDATE emergency_contacts 
            SET 
                status = 'accepted', 
                updated_at = NOW()
            WHERE id = $1 
            RETURNING *;
        `;
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }

    /**
 * Decline Request
 * Only the addressee can decline an incoming request.
 */
    static async declineRequest(id, addresseeId, db = pool) {
        const sql = `
        UPDATE emergency_contacts 
        SET status = 'declined', updated_at = NOW() 
        WHERE id = $1 AND addressee_id = $2 AND status = 'pending'
        RETURNING *;
    `;
        const result = await db.query(sql, [id, addresseeId]);
        return result.rows[0];
    }

    static async findAllContacts(userId, db = pool) {
        const sql = `
            SELECT 
                ec.id,
                ec.status,
                ec.created_at,
                CASE WHEN ec.requester_id = $1 THEN ec.requester_relationship ELSE ec.addressee_relationship END AS my_label_for_them,
                CASE WHEN ec.requester_id = $1 THEN ec.requester_notes ELSE ec.addressee_notes END AS my_private_notes,
                u.user_id AS contact_id,
                u.full_name AS contact_name,
                u.email AS contact_email,
                u.phone_number AS contact_phone
            FROM emergency_contacts ec
            JOIN users u ON u.user_id = (
                CASE WHEN ec.requester_id = $1 THEN ec.addressee_id ELSE ec.requester_id END
            )
            WHERE (ec.requester_id = $1 OR ec.addressee_id = $1)
            AND ec.status = 'accepted'
            ORDER BY ec.updated_at DESC;
        `;
        const result = await db.query(sql, [userId]);
        return result.rows;
    }

    static async findPendingRequests(userId, db = pool) {
        const sql = `
            SELECT ec.*, u.full_name AS sender_name 
            FROM emergency_contacts ec
            JOIN users u ON ec.requester_id = u.user_id
            WHERE ec.addressee_id = $1 AND ec.status = 'pending';
        `;
        const result = await db.query(sql, [userId]);
        return result.rows;
    }

    static async updateMyDetails(id, userId, updateData, db = pool) {
        const { relationship, notes } = updateData;

        // We use a CASE inside the UPDATE to ensure Alice only updates requester_ columns
        // and Bob only updates addressee_ columns.
        const sql = `
            UPDATE emergency_contacts
            SET 
                requester_relationship = CASE WHEN requester_id = $1 THEN $2 ELSE requester_relationship END,
                requester_notes = CASE WHEN requester_id = $1 THEN $3 ELSE requester_notes END,
                addressee_relationship = CASE WHEN addressee_id = $1 THEN $2 ELSE addressee_relationship END,
                addressee_notes = CASE WHEN addressee_id = $1 THEN $3 ELSE addressee_notes END,
                updated_at = NOW()
            WHERE id = $4 AND (requester_id = $1 OR addressee_id = $1)
            RETURNING *;
        `;
        const result = await db.query(sql, [userId, relationship, notes, id]);
        return result.rows[0];
    }

    static async delete(id, userId, db = pool) {
        const sql = `
            DELETE FROM emergency_contacts 
            WHERE id = $1 AND (requester_id = $2 OR addressee_id = $2) 
            RETURNING *;
        `;
        const result = await db.query(sql, [id, userId]);
        return result.rows[0];
    }
}

export default EmergencyContact;