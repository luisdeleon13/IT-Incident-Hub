const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /dashboard/resumen -> incidentes abiertos, cerrados y criticos
router.get('/resumen', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT
         COUNT(*) FILTER (WHERE estado <> 'CERRADO') AS abiertos,
         COUNT(*) FILTER (WHERE estado = 'CERRADO') AS cerrados,
         COUNT(*) FILTER (WHERE prioridad = 'CRITICA' AND estado <> 'CERRADO') AS criticos
       FROM incidentes`
        );
        const fila = resultado.rows[0];
        // COUNT llega como texto desde PostgreSQL: se convierte a numero
        res.json({
            abiertos: Number(fila.abiertos),
            cerrados: Number(fila.cerrados),
            criticos: Number(fila.criticos),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el resumen' });
    }
});
// GET /dashboard/distribucion -> conteo de incidentes por categoria y por tecnico
router.get('/distribucion', async (req, res) => {
    try {
        const porCategoria = await pool.query(
            `SELECT categoria AS nombre, COUNT(*)::int AS total
       FROM incidentes
       GROUP BY categoria
       ORDER BY categoria`
        );
        // Los incidentes sin tecnico se agrupan como "Sin asignar"
        const porTecnico = await pool.query(
            `SELECT COALESCE(t.nombre, 'Sin asignar') AS nombre, COUNT(*)::int AS total
       FROM incidentes i
       LEFT JOIN usuarios t ON t.id = i.tecnico_id
       GROUP BY COALESCE(t.nombre, 'Sin asignar')
       ORDER BY nombre`
        );
        res.json({ porCategoria: porCategoria.rows, porTecnico: porTecnico.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la distribucion' });
    }
});

module.exports = router;