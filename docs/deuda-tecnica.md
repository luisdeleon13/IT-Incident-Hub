# Registro de deuda técnica

Deudas identificadas durante el desarrollo de la semana 1.

| ID | Deuda | Ubicación | Impacto | Prioridad | Estado |
|----|-------|-----------|---------|-----------|--------|
| DT-1 | usuario_id fijo en el formulario | frontend/src/components/FormularioIncidente.jsx | Todos los incidentes se reportan como el mismo usuario | Alta | Pendiente |
| DT-2 | URL de la API escrita en el código | frontend/src/api.js | Cambiar de ambiente exige modificar código | Media | Pendiente |
| DT-3 | Sin pruebas automáticas | Proyecto completo | No hay red de seguridad ante cambios | Alta | Pendiente |
| DT-4 | Sin autenticación ni autorización | backend | Cualquier persona puede ejecutar cualquier operación | Alta | Pendiente |
| DT-5 | Sin paginación en GET /incidentes | backend/src/routes/incidentes.js | Lentitud con muchos registros | Baja | Pendiente |

## Plan de resolución

Se resolverán al menos DT-2 y DT-3 mediante trabajo trazable (Work Item, rama, commit con AB#ID y Pull Request) durante la semana 2.