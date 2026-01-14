import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    database: "safe_route",
    port: 5433, // default postgres port is 5432
});

export default pool;