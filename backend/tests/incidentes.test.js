const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const pool = require('../src/db');

beforeEach(() => {
  pool.query.mockReset();
});

describe('GET /salud', () => {
  test('responde ok', async () => {
    const res = await request(app).get('/salud');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ estado: 'caido' });
  });
});

describe('POST /incidentes', () => {
  const valido = {
    titulo: 'No hay internet',
    descripcion: 'Sin red en el piso 2',
    categoria: 'RED',
    prioridad: 'ALTA',
    usuario_id: 1,
  };

  test('crea un incidente con datos validos (201)', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1, ...valido, estado: 'NUEVO' }] });
    const res = await request(app).post('/incidentes').send(valido);
    expect(res.status).toBe(201);
    expect(res.body.estado).toBe('NUEVO');
  });

  test('rechaza si falta el titulo (400)', async () => {
    const { titulo, ...sinTitulo } = valido;
    const res = await request(app).post('/incidentes').send(sinTitulo);
    expect(res.status).toBe(400);
  });

  test('rechaza una categoria no valida (400)', async () => {
    const res = await request(app).post('/incidentes').send({ ...valido, categoria: 'XYZ' });
    expect(res.status).toBe(400);
  });
});

describe('GET /incidentes/:id', () => {
  test('responde 400 si el id no es numerico', async () => {
    const res = await request(app).get('/incidentes/abc');
    expect(res.status).toBe(400);
  });

  test('responde 404 si no existe', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/incidentes/999');
    expect(res.status).toBe(404);
  });

  test('responde 200 con el detalle', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1, titulo: 'Prueba' }] });
    const res = await request(app).get('/incidentes/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });
});

describe('PUT /incidentes/:id/asignar', () => {
  test('rechaza si falta el tecnico (400)', async () => {
    const res = await request(app).put('/incidentes/1/asignar').send({});
    expect(res.status).toBe(400);
  });

  test('rechaza si el usuario no es tecnico (400)', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).put('/incidentes/1/asignar').send({ tecnico_id: 1 });
    expect(res.status).toBe(400);
  });
});