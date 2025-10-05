import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET /dashboard/stats - Obtener estadísticas del dashboard
router.get("/stats", async (req: Request, res: Response) => {
  try {
    // Obtener estadísticas usando el procedimiento almacenado
    const [stats]: any = await pool.query("CALL obtener_estadisticas_dashboard()");
    
    // El procedimiento devuelve un array con un objeto
    const result = stats[0][0];
    
    res.json({
      total_usuarios: result.total_usuarios,
      total_productos: result.total_productos,
      pedidos_pendientes: result.pedidos_pendientes,
      pedidos_hoy: result.pedidos_hoy,
      ventas_hoy: parseFloat(result.ventas_hoy) || 0,
      ventas_mes: parseFloat(result.ventas_mes) || 0
    });
  } catch (error: any) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
