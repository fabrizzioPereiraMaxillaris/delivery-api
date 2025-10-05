import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { getDatabaseConfig } from "../config/environments";

const execAsync = promisify(exec);

const dbConfig = getDatabaseConfig();
const DB_HOST = dbConfig.host;
const DB_USER = dbConfig.user;
const DB_PASSWORD = dbConfig.password;
const DB_NAME = dbConfig.database;

export async function initializeDatabase(): Promise<void> {
  let connection: mysql.Connection | null = null;
  
  try {
    console.log("🔄 Inicializando base de datos...");
    
    // Conectar sin especificar base de datos para poder crearla
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Leer el script de migración
    const migrationPath = path.join(__dirname, "../../database_migration.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Ejecutar el script usando mysql CLI
    console.log("📝 Ejecutando script de migración...");
    
    try {
      const migrationPath = path.join(__dirname, "../../database_migration.sql");
      const command = `mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} < "${migrationPath}"`;
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes("Warning")) {
        console.error("❌ Error ejecutando script de migración:", stderr);
        throw new Error(stderr);
      }
      
      console.log("✅ Script de migración ejecutado correctamente");
    } catch (error: any) {
      console.error("❌ Error ejecutando script de migración:", error.message);
      throw error;
    }

    console.log("✅ Base de datos inicializada correctamente");
    
  } catch (error: any) {
    console.error("❌ Error inicializando base de datos:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Función para eliminar la base de datos
export async function dropDatabase(): Promise<void> {
  let connection: mysql.Connection | null = null;
  
  try {
    console.log("🗑️  Eliminando base de datos existente...");
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await connection.execute(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    console.log("✅ Base de datos eliminada correctamente");
    
  } catch (error: any) {
    console.error("❌ Error eliminando base de datos:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Función para verificar si la base de datos ya existe
export async function checkDatabaseExists(): Promise<boolean> {
  let connection: mysql.Connection | null = null;
  
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    const [rows]: any = await connection.execute(
      `SHOW DATABASES LIKE '${DB_NAME}'`
    );

    return rows.length > 0;
  } catch (error) {
    console.error("Error verificando base de datos:", error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
