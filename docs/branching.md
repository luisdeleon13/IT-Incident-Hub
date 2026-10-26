# Estrategia de ramas (branching)

## Rama principal

- `main` es la rama estable. Nunca se trabaja directamente sobre ella.
- Está protegida con política de rama en Azure Repos:
  - Mínimo 1 revisor aprobador.
  - El autor no puede aprobar sus propios cambios.
  - Todo PR debe tener un Work Item vinculado.

## Ramas de trabajo

Cada cambio sale de `main` actualizada y se nombra según su tipo:

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `feature/*` | Funcionalidad nueva | `feature/api-crear-incidente` |
| `fix/*` | Corrección de errores | `fix/prueba-fallo-controlado` |
| `refactor/*` | Mejora interna sin cambiar el comportamiento | `refactor/api-url-env` |
| `docs/*` | Documentación | `docs/documentacion-tecnica` |

## Flujo de trabajo

1. Se crea o elige una Task en Azure Boards y se pasa a Active.
2. Se crea la rama desde `main`.
3. Se hacen commits cuyo mensaje incluye `AB#ID` de la Task.
4. Se sube la rama y se abre un Pull Request hacia `main`, con descripción, Work Item vinculado y evidencia de validación.
5. El pipeline de Azure corre automáticamente sobre las ramas `feature/*`, `fix/*`, `docs/* refactor/*` y `main`.
6. El revisor lee los cambios, comenta y aprueba.
7. Se completa el PR con **Merge (no fast forward)** para conservar todos los commits y su trazabilidad.
8. La Task se cierra con un comentario que indica rama y PR.

## Convención de commits

```
AB#<id> Descripción corta en presente
```

Ejemplo: `AB#39 Agrega pruebas automaticas con Jest para la API`

## Versionado

Se usa Semantic Versioning con tags anotados sobre `main`: `v0.1.0` (semana 1), `v0.5.0` (semana 2) hasta `v1.0.0`.

## Lecciones del proyecto

- En la semana 1 se encadenaron ramas (cada una salía de la anterior). Algunos PR se mezclaron en ramas intermedias y no llegaron a `main`, por lo que fue necesario un PR adicional para llevarlos. Desde entonces, cada rama sale de `main`.
- Cuando dos PR modifican el mismo archivo (por ejemplo `README.md` o `azure-pipelines.yml`), se completan de uno en uno y los conflictos se resuelven conservando los cambios de ambos.