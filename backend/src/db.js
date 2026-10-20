// Conexion a PostgreSQL. Los datos salen del archivo .env, nunca van escritos aqui.
require('dotenv').config();
const { Pool } = require('pg');

// Un "pool" reutiliza conexiones en vez de abrir una nueva en cada peticion
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;