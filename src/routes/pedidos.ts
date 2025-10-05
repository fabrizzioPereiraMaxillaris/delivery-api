import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// POST /pedidos - Crear nuevo pedido
router.post("/", async (req: Request, res: Response) => {
  const { usuario_id, direccion_entrega, telefono_contacto, notas, items } = req.body;
  
  try {
    // Calcular total
    let total = 0;
    for (const item of items) {
      const [producto]: any = await pool.query(
        "SELECT precio FROM productos WHERE id = ?",
        [item.producto_id]
      );
      if (producto.length > 0) {
        total += producto[0].precio * item.cantidad;
      }
    }

    // Crear pedido
    const [pedidoResult]: any = await pool.query(
      "INSERT INTO pedidos (usuario_id, direccion_entrega, telefono_contacto, notas, total) VALUES (?, ?, ?, ?, ?)",
      [usuario_id, direccion_entrega, telefono_contacto, notas, total]
    );

    const pedidoId = pedidoResult.insertId;

    // Crear detalles del pedido
    for (const item of items) {
      const [producto]: any = await pool.query(
        "SELECT precio FROM productos WHERE id = ?",
        [item.producto_id]
      );
      
      if (producto.length > 0) {
        await pool.query(
          "INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
          [pedidoId, item.producto_id, item.cantidad, producto[0].precio, producto[0].precio * item.cantidad]
        );
      }
    }

    // Limpiar carrito del usuario
    await pool.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id]);

    res.json({ 
      message: "Pedido creado exitosamente", 
      pedido_id: pedidoId,
      total: total
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pedidos - Listar pedidos
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.id,
        p.usuario_id,
        p.direccion_entrega,
        p.telefono_contacto,
        p.notas,
        p.total,
        p.fecha as created_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha DESC
    `);
    
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pedidos/:id - Ver detalle de pedido
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Obtener información del pedido
    const [pedido]: any = await pool.query(`
      SELECT 
        p.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (pedido.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Obtener detalles del pedido
    const [detalles]: any = await pool.query(`
      SELECT 
        pd.*,
        pr.nombre as producto_nombre,
        pr.descripcion as producto_descripcion,
        pr.imagen_url as producto_imagen_url
      FROM pedido_detalle pd
      JOIN productos pr ON pd.producto_id = pr.id
      WHERE pd.pedido_id = ?
    `, [id]);

    res.json({
      ...pedido[0],
      items: detalles
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /pedidos/:id - Actualizar estado del pedido
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  try {
    await pool.query(
      "UPDATE pedidos SET estado = ? WHERE id = ?",
      [estado, id]
    );
    res.json({ message: "Pedido actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /pedidos/:id - Cancelar pedido
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Verificar que el pedido existe y está en estado pendiente
    const [pedido]: any = await pool.query(
      "SELECT estado FROM pedidos WHERE id = ?",
      [id]
    );

    if (pedido.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    if (pedido[0].estado !== 'pendiente') {
      return res.status(400).json({ error: "Solo se pueden cancelar pedidos pendientes" });
    }

    await pool.query("UPDATE pedidos SET estado = 'cancelado' WHERE id = ?", [id]);
    res.json({ message: "Pedido cancelado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
