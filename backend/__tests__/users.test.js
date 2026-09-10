require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

const testEmail = `jest_users_${Date.now()}@example.com`;
let token;

function auth(req) {
  return req.set('Authorization', `Bearer ${token}`);
}

beforeAll(async () => {
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Currency Tester', email: testEmail, password: 'password123' });
  token = signupRes.body.token;
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  await pool.end();
});

describe('Users API', () => {
  test('signup defaults currency to USD', async () => {
    const res = await auth(request(app).get('/api/auth/me'));
    expect(res.body.user.currency).toBe('USD');
  });

  test('rejects an unsupported currency code', async () => {
    const res = await auth(request(app).patch('/api/users/me').send({ currency: 'XYZ' }));
    expect(res.status).toBe(400);
  });

  test('rejects a missing currency', async () => {
    const res = await auth(request(app).patch('/api/users/me').send({}));
    expect(res.status).toBe(400);
  });

  test('rejects an unauthenticated request', async () => {
    const res = await request(app).patch('/api/users/me').send({ currency: 'EUR' });
    expect(res.status).toBe(401);
  });

  test('updates the currency and it sticks', async () => {
    const patchRes = await auth(request(app).patch('/api/users/me').send({ currency: 'INR' }));
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.user.currency).toBe('INR');

    const meRes = await auth(request(app).get('/api/auth/me'));
    expect(meRes.body.user.currency).toBe('INR');
  });
});
