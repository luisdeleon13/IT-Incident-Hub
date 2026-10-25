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

module.exports = router;