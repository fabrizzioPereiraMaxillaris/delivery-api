import mysql from "mysql2/promise";
import { getDatabaseConfig } from "./config/environments";

const dbConfig = getDatabaseConfig();

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;