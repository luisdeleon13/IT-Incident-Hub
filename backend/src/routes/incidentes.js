const express = require('express');
const pool = require('../db');

const router = express.Router();

// Valores permitidos (los mismos que valida la base de datos)
const CATEGORIAS = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTRO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

// POST /incidentes -> crea un incidente nuevo en estado NUEVO
router.post('/', async (req, res) => {
  const { titulo, descripcion, categoria, prioridad, usuario_id } = req.body || {};

  // 1. Validar que lleguen todos los campos obligatorios
  if (!titulo || !descripcion || !categoria || !prioridad || !usuario_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // 2. Validar que categoria y prioridad sean valores permitidos
  if (!CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: 'Categoria no valida' });
  }
  if (!PRIORIDADES.includes(prioridad)) {
    return res.status(400).json({ error: 'Prioridad no valida' });
  }

  try {
    // 3. Guardar en la base de datos. Los $1, $2... evitan inyeccion SQL.
    //    El estado NUEVO y la fecha los pone la base de datos por defecto.
    const resultado = await pool.query(
      `INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, descripcion, categoria, prioridad, usuario_id]
    );

    // 4. 201 = "creado". Devolvemos el incidente guardado.
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el incidente' });
  }
});

module.exports = router;