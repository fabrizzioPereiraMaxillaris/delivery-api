import express, { Application } from "express";
import authRoutes from "./routes/auth";

const app: Application = express();
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
