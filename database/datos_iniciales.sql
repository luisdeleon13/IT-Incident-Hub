-- Datos de prueba (no son datos reales ni contienen secretos)
INSERT INTO usuarios (nombre, correo, rol) VALUES
    ('Ana Lopez',    'ana@empresa.com',    'USUARIO'),
    ('Carlos Perez', 'carlos@empresa.com', 'TECNICO'),
    ('Marta Ruiz',   'marta@empresa.com',  'TECNICO'),
    ('Jorge Diaz',   'jorge@empresa.com',  'COORDINADOR')
ON CONFLICT (correo) DO NOTHING;   -- Si ya existen, no los duplica