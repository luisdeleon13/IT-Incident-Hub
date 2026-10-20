const express = require('express');
const cors = require('cors');
const incidentesRoutes = require('./routes/incidentes');

const app = express();

app.use(cors());          
app.use(express.json());  

// Ruta simple para comprobar que la API esta viva
app.get('/salud', (req, res) => res.json({ estado: 'ok' }));

// Todas las rutas de incidentes cuelgan de /incidentes
app.use('/incidentes', incidentesRoutes);

module.exports = app;