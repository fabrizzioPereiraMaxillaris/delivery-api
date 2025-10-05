import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { getDatabaseConfig } from "../config/environments";

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

    // Procesar el script SQL para manejar DELIMITER correctamente
    let processedSQL = migrationSQL;
    
    // Reemplazar DELIMITER // con ; para que funcione con mysql2
    processedSQL = processedSQL.replace(/DELIMITER \/\/\s*/g, '');
    processedSQL = processedSQL.replace(/\/\/\s*DELIMITER\s*;/g, ';');
    
    // Dividir el script en comandos individuales
    const commands = processedSQL
      .split(";")
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith("--"));

    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`);

    // Ejecutar cada comando
    for (const command of commands) {
      if (command.trim()) {
        try {
          await connection.execute(command);
          console.log(`✅ Comando ejecutado: ${command.substring(0, 50)}...`);
        } catch (error: any) {
          // Ignorar errores de "ya existe" para tablas, vistas, etc.
          if (!error.message.includes("already exists") && 
              !error.message.includes("Duplicate entry") &&
              !error.message.includes("Table") && 
              !error.message.includes("View") &&
              !error.message.includes("Procedure") &&
              !error.message.includes("Trigger")) {
            console.warn(`⚠️  Advertencia: ${error.message}`);
          }
        }
      }
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
