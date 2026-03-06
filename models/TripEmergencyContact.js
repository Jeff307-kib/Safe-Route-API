import pool from "../config/db-config.js";

class TripEmergencyContact {
    static async bulkCreate(tripId, selectedContactIds, db = pool) {
        if (!selectedContactIds || selectedContactIds.length === 0) {
            return [];
        }

        // First validate that all contact IDs exist in emergency_contacts table
        const validationQuery = `
            SELECT id 
            FROM emergency_contacts 
            WHERE id = ANY($1)
        `;
        const validationResult = await db.query(validationQuery, [selectedContactIds]);
        
        const existingContactIds = validationResult.rows.map(row => row.id);
        
        // Check if all provided contact IDs exist
        const missingContactIds = selectedContactIds.filter(id => !existingContactIds.includes(id));
        if (missingContactIds.length > 0) {
            throw new Error(`The following emergency contact IDs do not exist: ${missingContactIds.join(', ')}`);
        }

        // Insert all contacts for the trip
        const insertQuery = `
            INSERT INTO trip_emergency_contacts (trip_id, contact_id)
            VALUES ${selectedContactIds.map((_, index) => `($1, $${index + 2})`).join(', ')}
            RETURNING *;
        `;

        const values = [tripId, ...selectedContactIds];
        const result = await db.query(insertQuery, values);
        return result.rows;
    }

    static async findByTripId(tripId) {
        const query = `
            SELECT tec.*, ec.name, ec.phone, ec.email, ec.relationship
            FROM trip_emergency_contacts tec
            JOIN emergency_contacts ec ON tec.contact_id = ec.id
            WHERE tec.trip_id = $1
        `;
        const result = await pool.query(query, [tripId]);
        return result.rows;
    }

    static async deleteByTripId(tripId) {
        const query = `DELETE FROM trip_emergency_contacts WHERE trip_id = $1 RETURNING *;`;
        const result = await pool.query(query, [tripId]);
        return result.rows;
    }

    static async delete(tripId, contactId) {
        const query = `
            DELETE FROM trip_emergency_contacts 
            WHERE trip_id = $1 AND contact_id = $2 
            RETURNING *;
        `;
        const result = await pool.query(query, [tripId, contactId]);
        return result.rows[0];
    }
}

export default TripEmergencyContact;
