// TiDB Cloud serverless connection pool (MySQL wire protocol, TLS required).
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: Number(process.env.TIDB_PORT ?? 4000),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  waitForConnections: true,
  connectionLimit: 4,
  enableKeepAlive: true,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
})

/** Run a query and return rows. */
export async function q(sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return rows
}
