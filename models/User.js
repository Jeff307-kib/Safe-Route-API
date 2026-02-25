import pool from "../config/db-config.js";

class User {
  static async create(userData) {
    const { fullName, email, phoneNumber, passwordHash } = userData;

    const query = `
      INSERT INTO users (full_name, email, phone_number, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, full_name, email, phone_number, created_at;
    `;

    const values = [fullName, email, phoneNumber, passwordHash];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT user_id, full_name, email, phone_number, created_at
      FROM users 
      WHERE user_id = $1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `
      SELECT * FROM users WHERE email = $1;
    `;

    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByPhoneNumber(phoneNumber) {
    const query = `
      SELECT * FROM users WHERE phone_number = $1;
    `;

    const result = await pool.query(query, [phoneNumber]);
    return result.rows[0];
  }
}

export default User;