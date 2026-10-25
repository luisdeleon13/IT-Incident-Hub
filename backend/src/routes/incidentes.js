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

// GET /incidentes -> lista con filtros opcionales: estado, prioridad, categoria, tecnico_id
router.get('/', async (req, res) => {
  const { estado, prioridad, categoria, tecnico_id } = req.query;
  const ESTADOS = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

  // Validar cada filtro que venga
  if (estado && !ESTADOS.includes(estado)) {
    return res.status(400).json({ error: 'Estado no valido' });
  }
  if (prioridad && !PRIORIDADES.includes(prioridad)) {
    return res.status(400).json({ error: 'Prioridad no valida' });
  }
  if (categoria && !CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: 'Categoria no valida' });
  }
  let tecnicoNum = null;
  if (tecnico_id) {
    tecnicoNum = Number(tecnico_id);
    if (!Number.isInteger(tecnicoNum) || tecnicoNum <= 0) {
      return res.status(400).json({ error: 'Tecnico no valido' });
    }
  }

  // Se arma el WHERE solo con los filtros presentes, usando parametros $1, $2...
  const condiciones = [];
  const valores = [];
  if (estado) { valores.push(estado); condiciones.push(`i.estado = $${valores.length}`); }
  if (prioridad) { valores.push(prioridad); condiciones.push(`i.prioridad = $${valores.length}`); }
  if (categoria) { valores.push(categoria); condiciones.push(`i.categoria = $${valores.length}`); }
  if (tecnicoNum) { valores.push(tecnicoNum); condiciones.push(`i.tecnico_id = $${valores.length}`); }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  try {
    const resultado = await pool.query(
      `SELECT i.*,
              u.nombre AS usuario_nombre,
              t.nombre AS tecnico_nombre
       FROM incidentes i
       JOIN usuarios u ON u.id = i.usuario_id
       LEFT JOIN usuarios t ON t.id = i.tecnico_id
       ${where}
       ORDER BY i.fecha_creacion DESC`,
      valores
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

// PUT /incidentes/:id/asignar -> asigna un tecnico y cambia el estado a ASIGNADO
router.put('/:id/asignar', async (req, res) => {
  const id = Number(req.params.id);
  const { tecnico_id } = req.body || {};

  // Validar el id del incidente y que venga el tecnico
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Id no valido' });
  }
  if (!tecnico_id) {
    return res.status(400).json({ error: 'Falta el tecnico' });
  }

  try {
    // 1. Comprobar que el usuario existe y que realmente es TECNICO
    const tecnico = await pool.query(
      'SELECT id FROM usuarios WHERE id = $1 AND rol = $2',
      [tecnico_id, 'TECNICO']
    );
    if (tecnico.rows.length === 0) {
      return res.status(400).json({ error: 'El tecnico no existe o no tiene rol TECNICO' });
    }

    // 2. Asignar y pasar a ASIGNADO. Solo se permite si el incidente esta en NUEVO o ASIGNADO.
    const resultado = await pool.query(
      `UPDATE incidentes
       SET tecnico_id = $1, estado = 'ASIGNADO'
       WHERE id = $2 AND estado IN ('NUEVO', 'ASIGNADO')
       RETURNING *`,
      [tecnico_id, id]
    );

    // Si no se actualizo nada: o no existe, o ya esta en proceso/cerrado
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado o ya no se puede reasignar' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asignar el tecnico' });
  }
});

// Transiciones permitidas: de cada estado, a cuales se puede pasar
const TRANSICIONES = {
  NUEVO: ['ASIGNADO'],
  ASIGNADO: ['EN_PROCESO'],
  EN_PROCESO: ['RESUELTO'],
  RESUELTO: ['CERRADO', 'EN_PROCESO'], // se puede reabrir si no quedo resuelto
  CERRADO: [],
};

// PUT /incidentes/:id/estado -> cambia el estado validando la transicion
router.put('/:id/estado', async (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body || {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Id no valido' });
  }
  if (!Object.keys(TRANSICIONES).includes(estado)) {
    return res.status(400).json({ error: 'Estado no valido' });
  }

  try {
    const actual = await pool.query('SELECT estado FROM incidentes WHERE id = $1', [id]);
    if (actual.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    const estadoActual = actual.rows[0].estado;
    if (!TRANSICIONES[estadoActual].includes(estado)) {
      return res.status(400).json({
        error: `Transicion no permitida: de ${estadoActual} a ${estado}`,
      });
    }

    const resultado = await pool.query(
      'UPDATE incidentes SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado' });
  }
});

module.exports = router;