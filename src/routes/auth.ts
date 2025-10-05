import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { nombre, email, password, rol_id } = req.body;
  try {
    // Si no se especifica rol_id, usar 2 (usuario normal) por defecto
    const userRoleId = rol_id || 2;
    
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
      [nombre, email, password, userRoleId]
    );
    res.json({ message: "Usuario registrado", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? AND password = ?",
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ message: "Login exitoso", usuario: rows[0] });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
