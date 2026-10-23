# Arquitectura de IT Incident Hub

## Visión general

Aplicación web de tres capas para registrar, asignar y dar seguimiento a incidentes de TI.

```
Usuario → Frontend (React + Vite) → API REST (Node.js + Express) → PostgreSQL
```

| Capa | Tecnología | Carpeta | Puerto local |
|------|------------|---------|--------------|
| Frontend | React + Vite | `frontend/` | 5173 |
| API REST | Node.js + Express | `backend/` | 3000 |
| Base de datos | PostgreSQL | `database/` | 5432 |

El stack coincide con la arquitectura de referencia del proyecto (React, API REST en Node, PostgreSQL).

## Frontend

- `src/api.js`: funciones que llaman a la API. La URL base sale de la variable `VITE_API_URL` (con `http://localhost:3000` por defecto).
- `src/App.jsx`: pantalla principal; carga la lista y controla el incidente seleccionado.
- `src/components/FormularioIncidente.jsx`: formulario para reportar incidentes.
- `src/components/ListaIncidentes.jsx`: tabla de incidentes.
- `src/components/DetalleIncidente.jsx`: detalle y selector para asignar técnico.

## Backend

- `src/server.js`: levanta el servidor.
- `src/app.js`: configura Express, CORS, JSON y las rutas. Está separado de `server.js` para poder probarlo con Jest sin abrir un puerto.
- `src/db.js`: conexión a PostgreSQL con un pool; las credenciales vienen de variables de entorno.
- `src/routes/incidentes.js` y `src/routes/usuarios.js`: endpoints.

### Endpoints implementados

| Método | Ruta | Función |
|--------|------|---------|
| GET | `/salud` | Comprueba que la API está activa |
| POST | `/incidentes` | Crea un incidente en estado NUEVO |
| GET | `/incidentes` | Lista incidentes con nombre de usuario y técnico |
| GET | `/incidentes/:id` | Detalle de un incidente |
| PUT | `/incidentes/:id/asignar` | Asigna un técnico y pasa a ASIGNADO |
| GET | `/usuarios?rol=TECNICO` | Lista usuarios, filtrable por rol |

Todas las consultas usan parámetros (`$1`, `$2`...) para evitar inyección SQL.

## Base de datos

Definida en `database/schema.sql`.

- **usuarios**: id, nombre, correo (único), rol (USUARIO, TECNICO, COORDINADOR), creado_en.
- **incidentes**: id, titulo, descripcion, categoria, prioridad, estado, usuario_id (quien reporta), tecnico_id (puede ser nulo), fecha_creacion.

Restricciones `CHECK` validan categoría (HARDWARE, SOFTWARE, RED, ACCESOS, OTRO), prioridad (BAJA, MEDIA, ALTA, CRITICA) y estado (NUEVO, ASIGNADO, EN_PROCESO, RESUELTO, CERRADO). Hay índices sobre estado, prioridad y técnico para los filtros.

## Integración y entrega continua

- Código y PR en **Azure Repos**; rama `main` protegida con revisión obligatoria.
- **Azure Pipelines** en agente autohospedado: instalación, auditoría de dependencias, pruebas Jest, build, empaquetado y publicación del artefacto.
- **GitHub Actions** (workflow complementario en un espejo del repositorio): pruebas, auditoría, lint y build.

## Pendiente (semana 3)

Cambio de estado con validación de transiciones, comentarios por incidente, filtros y dashboard.