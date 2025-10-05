import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// POST /carrito - Agregar producto al carrito
router.post("/", async (req: Request, res: Response) => {
  const { usuario_id, producto_id, cantidad } = req.body;
  
  try {
    // Verificar si el producto ya está en el carrito del usuario
    const [existingItem]: any = await pool.query(
      "SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?",
      [usuario_id, producto_id]
    );

    if (existingItem.length > 0) {
      // Si ya existe, actualizar la cantidad
      const newQuantity = existingItem[0].cantidad + (cantidad || 1);
      await pool.query(
        "UPDATE carrito SET cantidad = ? WHERE id = ?",
        [newQuantity, existingItem[0].id]
      );
      res.json({ message: "Cantidad actualizada en el carrito" });
    } else {
      // Si no existe, crear nuevo item
      const [result] = await pool.query(
        "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
        [usuario_id, producto_id, cantidad || 1]
      );
      res.json({ message: "Producto agregado al carrito", result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /carrito - Ver carrito del usuario
router.get("/", async (req: Request, res: Response) => {
  const { usuario_id } = req.query;
  
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        c.id,
        c.usuario_id,
        c.producto_id,
        c.cantidad,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.stock,
        p.categoria
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = ?
    `, [usuario_id]);
    
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /carrito/:id - Actualizar cantidad de item en carrito
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  
  try {
    await pool.query(
      "UPDATE carrito SET cantidad = ? WHERE id = ?",
      [cantidad, id]
    );
    res.json({ message: "Carrito actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /carrito/:id - Quitar producto del carrito
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    await pool.query("DELETE FROM carrito WHERE id = ?", [id]);
    res.json({ message: "Producto eliminado del carrito" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /carrito/usuario/:usuario_id - Limpiar carrito completo
router.delete("/usuario/:usuario_id", async (req: Request, res: Response) => {
  const { usuario_id } = req.params;
  
  try {
    await pool.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id]);
    res.json({ message: "Carrito vaciado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
