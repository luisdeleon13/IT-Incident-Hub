-- =====================================================
-- IT Incident Hub - Esquema de base de datos
-- Task 15 (AB#15)
-- =====================================================

-- Tabla de usuarios: quien reporta, quien atiende y quien coordina
CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL PRIMARY KEY,                 -- Identificador automatico
    nombre      VARCHAR(100) NOT NULL,
    correo      VARCHAR(150) NOT NULL UNIQUE,       -- No se puede repetir
    rol         VARCHAR(20)  NOT NULL
                CHECK (rol IN ('USUARIO', 'TECNICO', 'COORDINADOR')),
    creado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de incidentes: el reporte principal del sistema
CREATE TABLE IF NOT EXISTS incidentes (
    id              SERIAL PRIMARY KEY,
    titulo          VARCHAR(150) NOT NULL,
    descripcion     TEXT NOT NULL,
    categoria       VARCHAR(30) NOT NULL
                    CHECK (categoria IN ('HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTRO')),
    prioridad       VARCHAR(10) NOT NULL
                    CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    -- Los estados validos vienen del documento del proyecto
    estado          VARCHAR(15) NOT NULL DEFAULT 'NUEVO'
                    CHECK (estado IN ('NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO')),
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id),  -- Quien reporta
    tecnico_id      INTEGER REFERENCES usuarios(id),           -- Quien atiende (puede ser nulo al inicio)
    fecha_creacion  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indices para que los filtros del futuro sean rapidos
CREATE INDEX IF NOT EXISTS idx_incidentes_estado    ON incidentes(estado);
CREATE INDEX IF NOT EXISTS idx_incidentes_prioridad ON incidentes(prioridad);
CREATE INDEX IF NOT EXISTS idx_incidentes_tecnico   ON incidentes(tecnico_id);