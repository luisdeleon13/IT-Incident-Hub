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

// GET /incidentes -> devuelve la lista de incidentes (los mas recientes primero)
router.get('/', async (req, res) => {
  try {
    // LEFT JOIN: trae tambien el nombre de quien reporta y del tecnico.
    // Es LEFT para los incidentes que aun no tienen tecnico asignado.
    const resultado = await pool.query(
      `SELECT i.*,
              u.nombre AS usuario_nombre,
              t.nombre AS tecnico_nombre
       FROM incidentes i
       JOIN usuarios u ON u.id = i.usuario_id
       LEFT JOIN usuarios t ON t.id = i.tecnico_id
       ORDER BY i.fecha_creacion DESC`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los incidentes' });
  }
});

// GET /incidentes/:id -> devuelve el detalle de un incidente
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Validar que el id sea un numero entero valido
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Id no valido' });
  }

  try {
    const resultado = await pool.query(
      `SELECT i.*,
              u.nombre AS usuario_nombre,
              t.nombre AS tecnico_nombre
       FROM incidentes i
       JOIN usuarios u ON u.id = i.usuario_id
       LEFT JOIN usuarios t ON t.id = i.tecnico_id
       WHERE i.id = $1`,
      [id]
    );

    // Si no hay filas, el incidente no existe
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el incidente' });
  }
});

module.exports = router;