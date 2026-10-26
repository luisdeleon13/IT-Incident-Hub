# Estrategia de release

## Ambientes

| Ambiente | Propósito | Control |
|----------|-----------|---------|
| dev | Primer destino del artefacto tras un build en verde sobre main | Automático |
| qa | Validación del artefacto | Automático (puede exigir aprobación) |
| produccion | Liberación final | Aprobación manual obligatoria |

Los ambientes se definen en Azure Pipelines (Pipelines → Environments). El despliegue es una simulación: el artefacto se recibe y valida en cada etapa, sin publicarse en un servidor.

## Flujo de liberación

1. Todo cambio entra a `main` mediante Pull Request aprobado.
2. El pipeline construye, audita dependencias, prueba, empaqueta y publica el artefacto `incident-hub`.
3. Sobre `main`, el mismo artefacto avanza por Dev, QA y Producción.
4. Antes de Producción, un aprobador revisa y aprueba manualmente.

## Controles de validación

- Pruebas Jest y auditoría `npm audit --omit=dev --audit-level=high` en cada ejecución.
- Secretos en el Variable Group `incident-hub-secretos`, nunca en el repositorio.
- Paquete revisado: `backend/` solo incluye `.env.example`.
- `main` protegida: 1 revisor distinto del autor y Work Item vinculado.

## Versionado (Semantic Versioning)

| Versión | Contenido |
|---------|-----------|
| v0.1.0 | Semana 1: registro, consulta y asignación de incidentes |
| v0.5.0 | Semana 2: pipeline, pruebas, seguridad y artefacto |
| v0.9.0 | Semana 3: funcionalidades completas (estados, comentarios, filtros, dashboard) |
| v1.0.0 | Release final con ambientes y documentación |

Los tags se crean solo sobre commits de `main` con el pipeline en verde.

## Reversión

Para revertir, se crea una rama `fix/*` con `git revert` del commit problemático, se abre un PR y se vuelve a liberar. También puede volver a desplegarse el artefacto de una ejecución anterior en verde.