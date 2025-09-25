import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// Listar todos los usuarios
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Ver detalle
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Editar usuario
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, password, rol_id } = req.body;
  try {
    await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol_id = ? WHERE id = ?",
      [nombre, email, password, rol_id, id]
    );
    res.json({ message: "Usuario actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ message: "Usuario eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
