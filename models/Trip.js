import pool from "../config/db-config.js";

class Trip {
  static async create(tripData, db = pool) {
    const {
      startLocation: { latitude: startLat, longitude: startLng },
      destinationLocation: { latitude: destLat, longitude: destLng },
      durationMinutes,
      currentStatus,
      maxExtensionMinutes,
      user_id
    } = tripData;

    const query = `
      INSERT INTO trips (start_location, destination_location, duration_minutes, current_status, max_extension_minutes, user_id)
      VALUES (
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
        $5, $6, $7, $8
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
      maxExtensionMinutes,
      user_id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id, db = pool) {
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
        created_at,
        updated_at,
        user_id
      FROM trips WHERE trip_id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // later we would have to check the userId to in the query if the trip is owned by user or not
  static async findAll({ status, limit, sortBy, offset }, db = pool) {
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
        created_at,
        user_id
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
    const result = await db.query(query, values);
    return result.rows;
  }

  static async complete(id, db = pool) {
    const query = `
      UPDATE trips 
      SET current_status = $1, actual_arrival_time = NOW(), updated_at = NOW() 
      WHERE trip_id = $2 AND current_status IN ('Active', 'Snoozed', 'Emergency')
      RETURNING 
        trip_id,
        ST_X(start_location::geometry) AS start_lng,
        ST_Y(start_location::geometry) AS start_lat,
        ST_X(destination_location::geometry) AS dest_lng,
        ST_Y(destination_location::geometry) AS dest_lat,
        duration_minutes,
        actual_arrival_time,
        current_status,
        total_extended_minutes,
        created_at,
        updated_at,
        user_id
    `;
    const values = ['Completed', id];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByUserId(userId, db = pool) {
    const sql = `
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
        created_at,
        updated_at,
        user_id
      FROM trips WHERE user_id = $1
    `;

    const result = await db.query(sql, [userId]);
    return result.rows;
  }

  
static async linkEmergencyContacts(tripId, contactId, db = pool) {
    const query = `
        INSERT INTO trip_emergency_contacts (trip_id, contact_id)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const result = await db.query(query, [tripId, contactId]);
    return result.rows[0];
}
}


export default Trip;