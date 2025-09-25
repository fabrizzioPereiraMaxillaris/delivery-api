import express, { Application } from "express";
import authRoutes from "./routes/auth";
import usuariosRoutes from "./routes/usuarios";
import productosRoutes from "./routes/productos";

const app: Application = express();
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
