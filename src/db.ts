import mysql from "mysql2/promise";

// Configuración de la conexión a la BD remota por IP privada
const pool = mysql.createPool({
  host: "172.17.0.4",        // IP privada de tu VM BD
  user: "adminmysqlecommerce", // usuario MySQL que creaste
  password: "password",  // reemplaza por tu contraseña real
  database: "delivery_db",     // nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
