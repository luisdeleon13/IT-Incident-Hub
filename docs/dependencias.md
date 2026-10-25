# Análisis de dependencias

Auditoría ejecutada con `npm audit` el 22/10/2026 (Task 41).

## Resultados

| Componente | Vulnerabilidades | Detalle |
|------------|------------------|---------|
| frontend | 0 | Sin hallazgos |
| backend | 22 (19 moderate, 3 high) | Todas en dependencias de desarrollo |

## Hallazgos y decisión

| Paquete | Severidad | Origen | ¿Llega a producción? | Decisión |
|---------|-----------|--------|----------------------|----------|
| braces | Alta | nodemon → chokidar → braces | No (solo desarrollo) | Aceptada temporalmente |
| sprintf-js | Moderada | jest → ... → js-yaml → argparse → sprintf-js | No (solo pruebas) | Aceptada temporalmente |

## Justificación

- Ambos paquetes son devDependencies: no se empaquetan ni se ejecutan en producción.
- La corrección sugerida (`npm audit fix --force`) instalaría nodemon 1.14.10 y jest 25.0.0, versiones antiguas con cambios incompatibles que podrían romper las 9 pruebas. Se descartó.
- Dependencias de producción (express, pg, dotenv, cors): sin hallazgos.

## Control en el pipeline

El pipeline ejecuta `npm audit --omit=dev --audit-level=high` sobre el backend. Falla si aparece una vulnerabilidad alta o crítica en una dependencia de producción.

## Seguimiento

Revisar cuando haya versiones nuevas de nodemon y Jest que resuelvan los avisos, y repetir la auditoría antes del release v1.0.0.

| body-parser | Alta | express → body-parser | Sí | Corregida (AB#48) con npm audit fix |