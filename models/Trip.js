import pool from "../config/dbConfig.js";

class Trip {
  static async create(tripData) {
    const {
      startLocation: { latitude: startLat, longitude: startLng },
      destinationLocation: { latitude: destLat, longitude: destLng },
      durationMinutes,
      currentStatus,
    } = tripData;

    let maxExtensionMinutes = 10 // will be replace with function later

    const query = `
      INSERT INTO trips (start_location, destination_location, duration_minutes, current_status, max_extension_minutes)
      VALUES (
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
        $5, $6, $7
      )
      RETURNING *;
    `;

    const values = [
      startLng,
      startLat,
      destLng,
      destLat,
      durationMinutes,
      currentStatus,
      maxExtensionMinutes
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default Trip;