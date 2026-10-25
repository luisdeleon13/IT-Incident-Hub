const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const pool = require('../src/db');

beforeEach(() => {
    pool.query.mockReset();
});

describe('GET /dashboard/resumen', () => {
    test('devuelve abiertos, cerrados y criticos como numeros', async () => {
        pool.query.mockResolvedValue({ rows: [{ abiertos: '3', cerrados: '2', criticos: '1' }] });
        const res = await request(app).get('/dashboard/resumen');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ abiertos: 3, cerrados: 2, criticos: 1 });
    });
});

describe('GET /dashboard/distribucion', () => {
    test('devuelve la distribucion por categoria y por tecnico', async () => {
        pool.query
            .mockResolvedValueOnce({ rows: [{ nombre: 'RED', total: 2 }] })
            .mockResolvedValueOnce({ rows: [{ nombre: 'Sin asignar', total: 2 }] });
        const res = await request(app).get('/dashboard/distribucion');
        expect(res.status).toBe(200);
        expect(res.body.porCategoria).toEqual([{ nombre: 'RED', total: 2 }]);
        expect(res.body.porTecnico).toEqual([{ nombre: 'Sin asignar', total: 2 }]);
    });
});