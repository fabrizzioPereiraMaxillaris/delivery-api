import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import usuariosRoutes from "./routes/usuarios";
import productosRoutes from "./routes/productos";
import carritoRoutes from "./routes/carrito";
import pedidosRoutes from "./routes/pedidos";
import dashboardRoutes from "./routes/dashboard";
import { initializeDatabase, checkDatabaseExists } from "./database/init";
import { getConfig, getCorsConfig, displayConfig } from "./config/environments";

const app: Application = express();

// Configurar CORS
app.use(cors(getCorsConfig()));

app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/dashboard", dashboardRoutes);

const config = getConfig();

// Función para iniciar el servidor
async function startServer() {
  try {
    // Mostrar configuración actual
    displayConfig();
    
    // Verificar si la base de datos existe
    const dbExists = await checkDatabaseExists();
    
    if (!dbExists) {
      console.log("📊 Base de datos no encontrada, inicializando...");
      await initializeDatabase();
    } else {
      console.log("✅ Base de datos ya existe, continuando...");
    }

    // Iniciar servidor
    app.listen(config.PORT, () => {
      const protocol = config.NODE_ENV === 'production' ? 'https' : 'http';
      const host = config.NODE_ENV === 'production' 
        ? (config.FRONTEND_URL ? config.FRONTEND_URL.replace('https://', '') : 'tu-dominio.com')
        : `${config.DB_HOST}:${config.PORT}`;
      const url = `${protocol}://${host}`;
      
      console.log(`🚀 Servidor corriendo en ${url}`);
    });
  } catch (error) {
    console.error("❌ Error iniciando servidor:", error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();
