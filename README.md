# IT Incident Hub

Sistema web para registrar, asignar y dar seguimiento a incidentes de TI. Reemplaza los reportes dispersos en llamadas, mensajería y correo por una solución trazable y preparada para entrega continua.

## Arquitectura

Frontend (React + Vite) → API REST (Node.js + Express) → Base de datos (PostgreSQL)

## Estructura del repositorio

- `backend/` : API REST
- `frontend/` : interfaz web
- `database/` : scripts SQL
- `tests/` : pruebas
- `devops/` : scripts y configuración DevOps
- `docs/` : documentación
- `.github/workflows/` : workflows de GitHub Actions
- `azure-pipelines.yml` : pipeline de Azure

## Requisitos

- Node.js 20 o superior (LTS)
- PostgreSQL 14 o superior
- Git

## Instalación

1. Clonar el repositorio:
```
   git clone https://dev.azure.com/ldeleons13/IT-Incident-Hub/_git/IT-Incident-Hub
   cd IT-Incident-Hub
```
2. Crear la base de datos y cargar los scripts:
```
   psql -U postgres -c "CREATE DATABASE incident_hub;"
   psql -U postgres -d incident_hub -f database/schema.sql
   psql -U postgres -d incident_hub -f database/datos_iniciales.sql
```
3. Configurar el backend: copiar `backend/.env.example` como `backend/.env` y escribir la contraseña real de PostgreSQL en `DB_PASSWORD`. El archivo `.env` no se sube al repositorio.
4. Instalar dependencias:
```
   cd backend && npm install
   cd ../frontend && npm install
```

## Ejecución

En dos terminales:

```
cd backend
npm run dev
```
La API queda en `http://localhost:3000`.

```
cd frontend
npm run dev
```
La web queda en la dirección que muestre Vite (normalmente `http://localhost:5173`).

## Flujo de trabajo

Work Item (Azure Boards) → rama `feature/*`, `fix/*`, `refactor/*` o `docs/*` → commit con `AB#ID` → Pull Request → revisión → `main`. Más detalle en `docs/`.

## Entrega

Por indicación del docente, el proyecto se entrega en un único repositorio, con entregas parciales marcadas mediante tags de versión.

## Responsables

| Integrante | Rol |
|---|---|
| Luis Reynaldo de León Sopón | Desarrollo y DevOps |
| pendiente de revision de usuario | Revisión de Pull Requests |