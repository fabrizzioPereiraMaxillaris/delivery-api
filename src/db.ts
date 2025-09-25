import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",      // cambia según tu config
  user: "root",           // tu usuario MySQL
  password: "root", // tu contraseña
  database: "delivery_db" // tu base de datos
});

export default pool;
