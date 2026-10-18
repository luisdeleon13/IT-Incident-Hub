const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /usuarios?rol=TECNICO -> lista usuarios, opcionalmente filtrados por rol
router.get('/', async (req, res) => {
  const { rol } = req.query;
  const ROLES = ['USUARIO', 'TECNICO', 'COORDINADOR'];

  // Si mandan un rol, debe ser uno valido
  if (rol && !ROLES.includes(rol)) {
    return res.status(400).json({ error: 'Rol no valido' });
  }

  try {
    const resultado = rol
      ? await pool.query('SELECT id, nombre, rol FROM usuarios WHERE rol = $1 ORDER BY nombre', [rol])
      : await pool.query('SELECT id, nombre, rol FROM usuarios ORDER BY nombre');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

module.exports = router;