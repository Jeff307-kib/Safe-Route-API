import { query } from "express-validator";
import pool from "../config/db-config.js";

class User {
  static async create(userData) {
    const { fullName, email, phoneNumber, password } = userData;

    const query = `
      INSERT INTO users (full_name, email, phone_number, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, full_name, email, phone_number, created_at, updated_at;
    `;

    const values = [fullName, email, phoneNumber, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll({ limit, sortBy, offset }) {
    const query = `
      SELECT user_id, full_name, email, phone_number, created_at
      FROM users 
      ORDER BY ${sortBy ? sortBy : 'created_at'} DESC
      LIMIT $1 OFFSET $2
    `;

    const values = [
      limit,
      offset
    ];

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT user_id, full_name, email, phone_number, created_at, updated_at
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
      SELECT user_id, full_name, email, phone_number, password_hash FROM users WHERE phone_number = $1;
    `;

    const result = await pool.query(query, [phoneNumber]);
    return result.rows[0];
  }

  static async updateUser(id, updateData) {

    const allowedFields = [
      "full_name",
      "email",
      "phone_number"
    ];

    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${values.length + 1}`);
        values.push(updateData[key]);
      }
    }

    fields.push("updated_at = NOW()")

    if (fields.length === 1) return null;

    values.push(id);

    const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE user_id = $${values.length}
      RETURNING user_id, full_name, email, phone_number, created_at, updated_at;
    `;

    const result = await pool.query(sql, values);
    console.log('HELLO FROM USER MODEL');
    return result.rows[0];
  }

  static async deleteUser(id) {
    const query = 'DELETE FROM users WHERE user_id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default User;