import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// Listar todos los productos
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM productos ORDER BY nombre");
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Ver detalle de producto
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear producto
router.post("/", async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;
  try {
    const [result]: any = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, stock, categoria, imagen_url]
    );
    res.json({ message: "Producto creado", id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Editar producto
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;
  try {
    await pool.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?, imagen_url = ? WHERE id = ?",
      [nombre, descripcion, precio, stock, categoria, imagen_url, id]
    );
    res.json({ message: "Producto actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
