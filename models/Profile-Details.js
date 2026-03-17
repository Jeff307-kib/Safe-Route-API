import pool from "../config/db-config.js";

class ProfileDetails {
    static async upsert(userId, details, db = pool) {
        const { date_of_birth, blood_type, medical_note } = details;

        const sql = `
            INSERT INTO profile_details (user_id, date_of_birth, blood_type, medical_note, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                date_of_birth = COALESCE(EXCLUDED.date_of_birth, profile_details.date_of_birth),
                blood_type = COALESCE(EXCLUDED.blood_type, profile_details.blood_type),
                medical_note = COALESCE(EXCLUDED.medical_note, profile_details.medical_note),
                updated_at = NOW()
            RETURNING *;
        `;

        const values = [userId, date_of_birth, blood_type, medical_note];
        const result = await db.query(sql, values);
        return result.rows[0];
    }
}

export default ProfileDetails;