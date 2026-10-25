-- Bitacora de comentarios por incidente (Task 23)
CREATE TABLE IF NOT EXISTS comentarios (
    id            SERIAL PRIMARY KEY,
    incidente_id  INTEGER NOT NULL REFERENCES incidentes(id) ON DELETE CASCADE,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id),
    texto         TEXT NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comentarios_incidente ON comentarios(incidente_id);