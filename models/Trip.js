import pool from "../config/db-config.js";

class Trip {
  static async create(tripData) {
    const {
      startLocation: { latitude: startLat, longitude: startLng },
      destinationLocation: { latitude: destLat, longitude: destLng },
      durationMinutes,
      currentStatus,
      maxExtensionMinutes,
    } = tripData;

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

  static async findById(id) {
    const query = `
      SELECT 
        trip_id,
        ST_X(start_location::geometry) AS start_lng,
        ST_Y(start_location::geometry) AS start_lat,
        ST_X(destination_location::geometry) AS dest_lng,
        ST_Y(destination_location::geometry) AS dest_lat,
        duration_minutes,
        actual_arrival_time,
        current_status,
        total_extended_minutes,
        created_at
      FROM trips WHERE trip_id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // later we would have to check the userId to in the query if the trip is owned by user or not
  static async findAll({ status, limit, sortBy, offset }) {
    const query = `
      SELECT 
        trip_id,
        ST_X(start_location::geometry) AS start_lng,
        ST_Y(start_location::geometry) AS start_lat,
        ST_X(destination_location::geometry) AS dest_lng,
        ST_Y(destination_location::geometry) AS dest_lat,
        duration_minutes,
        actual_arrival_time,
        current_status,
        total_extended_minutes,
        created_at
      FROM trips 
      WHERE current_status = $1
      ORDER BY ${sortBy ? sortBy : 'created_at'} DESC
      LIMIT $2 OFFSET $3
    `;

    const values = [
      status,
      limit,
      offset
    ];
    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default Trip;