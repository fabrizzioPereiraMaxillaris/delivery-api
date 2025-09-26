import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import usuariosRoutes from "./routes/usuarios";
import productosRoutes from "./routes/productos";

// Configurar variables de entorno
dotenv.config();

const app: Application = express();
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
