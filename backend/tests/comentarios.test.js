const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const pool = require('../src/db');

beforeEach(() => {
  pool.query.mockReset();
});

describe('GET /incidentes/:id/comentarios', () => {
  test('responde 400 si el id no es numerico', async () => {
    const res = await request(app).get('/incidentes/abc/comentarios');
    expect(res.status).toBe(400);
  });
});

describe('POST /incidentes/:id/comentarios', () => {
  test('rechaza si falta el texto (400)', async () => {
    const res = await request(app).post('/incidentes/1/comentarios').send({ usuario_id: 2 });
    expect(res.status).toBe(400);
  });

  test('crea el comentario con datos validos (201)', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1, texto: 'Revisado' }] });
    const res = await request(app)
      .post('/incidentes/1/comentarios')
      .send({ texto: 'Revisado', usuario_id: 2 });
    expect(res.status).toBe(201);
    expect(res.body.texto).toBe('Revisado');
  });
});