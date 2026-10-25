const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const pool = require('../src/db');

beforeEach(() => {
  pool.query.mockReset();
});

describe('GET /incidentes con filtros', () => {
  test('rechaza un estado no valido (400)', async () => {
    const res = await request(app).get('/incidentes?estado=XYZ');
    expect(res.status).toBe(400);
  });

  test('rechaza un tecnico no numerico (400)', async () => {
    const res = await request(app).get('/incidentes?tecnico_id=abc');
    expect(res.status).toBe(400);
  });

  test('aplica los filtros validos como parametros (200)', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/incidentes?estado=NUEVO&prioridad=ALTA');
    expect(res.status).toBe(200);
    expect(pool.query.mock.calls[0][1]).toEqual(['NUEVO', 'ALTA']);
  });
});