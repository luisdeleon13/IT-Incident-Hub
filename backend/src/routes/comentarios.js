const express = require('express');
const pool = require('../db');

// mergeParams permite leer :id de la ruta padre (/incidentes/:id/comentarios)
const router = express.Router({ mergeParams: true });

// GET /incidentes/:id/comentarios -> historial, del mas reciente al mas antiguo
router.get('/', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Id no valido' });
  }
  try {
    const resultado = await pool.query(
      `SELECT c.*, u.nombre AS autor
       FROM comentarios c
       JOIN usuarios u ON u.id = c.usuario_id
       WHERE c.incidente_id = $1
       ORDER BY c.fecha DESC`,
      [id]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

// POST /incidentes/:id/comentarios -> agrega un comentario
router.post('/', async (req, res) => {
  const id = Number(req.params.id);
  const { texto, usuario_id } = req.body || {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Id no valido' });
  }
  if (!texto || !texto.trim() || !usuario_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO comentarios (incidente_id, usuario_id, texto)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, usuario_id, texto.trim()]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
});

module.exports = router;