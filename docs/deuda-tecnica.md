# Registro de deuda técnica

| ID | Deuda | Ubicación | Impacto | Prioridad | Estado |
|----|-------|-----------|---------|-----------|--------|
| DT-1 | usuario_id fijo en el formulario | frontend/src/components/FormularioIncidente.jsx | Todos los incidentes se reportan como el mismo usuario | Alta | Pendiente |
| DT-2 | URL de la API escrita en el código | frontend/src/api.js | Cambiar de ambiente exige modificar código | Media | Resuelta (AB#45) |
| DT-3 | Sin pruebas automáticas | Proyecto completo | No hay red de seguridad ante cambios | Alta | Resuelta (AB#39) |
| DT-4 | Sin autenticación ni autorización | backend | Cualquier persona puede ejecutar cualquier operación | Alta | Pendiente |
| DT-5 | Sin paginación en GET /incidentes | backend/src/routes/incidentes.js | Lentitud con muchos registros | Baja | Pendiente |

Nota: la bitácora de comentarios (AB#24) también usa un usuario fijo, por lo que DT-1 incluye ese caso.

## Plan de resolución

Se resolvieron DT-2 (AB#45, variable de entorno VITE_API_URL) y DT-3 (AB#39, pruebas con Jest) mediante trabajo trazable: Work Item, rama, commit con AB#ID y Pull Request. DT-1, DT-4 y DT-5 quedan pendientes y se evaluarán en la semana 3 según el tiempo disponible.