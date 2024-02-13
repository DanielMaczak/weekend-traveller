import 'dotenv/config';

import request from 'supertest';

import { app } from '../index.js';

beforeAll(done => {
  done();
});

afterAll(done => {
  // TODO close server and DB and everything
  done();
});

describe('GET /currencies', () => {
  it('should return all currencies', async () => {
    const res = await request(await app).get('/currencies');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
