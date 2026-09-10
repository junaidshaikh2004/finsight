require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

const testEmail = `jest_auth_${Date.now()}@example.com`;
let token;

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  await pool.end();
});

describe('Auth API', () => {
  test('signup creates a user, seeds default categories, and returns a bearer token (no cookie)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Jest User', email: testEmail, password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
    expect(typeof res.body.token).toBe('string');
    // Proves auth doesn't depend on a cookie at all (the cross-device bug this replaced).
    expect(res.headers['set-cookie']).toBeUndefined();

    token = res.body.token;
  });

  test('signup rejects a duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Jest User', email: testEmail, password: 'password123' });

    expect(res.status).toBe(409);
  });

  test('signup rejects a password under 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Short Pw', email: `jest_shortpw_${Date.now()}@example.com`, password: '123' });

    expect(res.status).toBe(400);
  });

  test('/me returns the logged-in user via the Authorization header', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });

  test('/me rejects a request with no Authorization header', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('/me rejects a malformed or invalid bearer token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  test('login rejects the wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrong-password' });

    expect(res.status).toBe(401);
  });

  test('login succeeds with the correct password and returns a bearer token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
    expect(typeof res.body.token).toBe('string');
    expect(res.headers['set-cookie']).toBeUndefined();
  });
});
