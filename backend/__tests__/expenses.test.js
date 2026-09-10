require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

const testEmail = `jest_expenses_${Date.now()}@example.com`;
const agent = request.agent(app);
let categoryId;
let expenseId;

beforeAll(async () => {
  await agent.post('/api/auth/signup').send({ name: 'Expense Tester', email: testEmail, password: 'password123' });
  const categoriesRes = await agent.get('/api/categories');
  categoryId = categoriesRes.body.categories[0].id;
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  await pool.end();
});

describe('Expenses API', () => {
  test('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(401);
  });

  test('creates an expense', async () => {
    const res = await agent
      .post('/api/expenses')
      .send({ category_id: categoryId, amount: 25.5, description: 'Test lunch', date: '2026-09-05' });

    expect(res.status).toBe(201);
    expect(res.body.expense.description).toBe('Test lunch');
    expect(res.body.expense.amount).toBe('25.50');
    expenseId = res.body.expense.id;
  });

  test('rejects a non-positive amount', async () => {
    const res = await agent
      .post('/api/expenses')
      .send({ category_id: categoryId, amount: -5, date: '2026-09-05' });

    expect(res.status).toBe(400);
  });

  test('rejects a category that does not belong to the user', async () => {
    const res = await agent
      .post('/api/expenses')
      .send({ category_id: 999999, amount: 10, date: '2026-09-05' });

    expect(res.status).toBe(400);
  });

  test('lists expenses filtered by month, including the one just created', async () => {
    const res = await agent.get('/api/expenses?month=2026-09');

    expect(res.status).toBe(200);
    expect(res.body.expenses.some((e) => e.id === expenseId)).toBe(true);
  });

  test('updates an expense', async () => {
    const res = await agent
      .put(`/api/expenses/${expenseId}`)
      .send({ category_id: categoryId, amount: 30, description: 'Updated lunch', date: '2026-09-05' });

    expect(res.status).toBe(200);
    expect(res.body.expense.amount).toBe('30.00');
    expect(res.body.expense.description).toBe('Updated lunch');
  });

  test('404s updating an expense that does not exist', async () => {
    const res = await agent
      .put('/api/expenses/999999')
      .send({ category_id: categoryId, amount: 30, date: '2026-09-05' });

    expect(res.status).toBe(404);
  });

  test('deletes an expense', async () => {
    const res = await agent.delete(`/api/expenses/${expenseId}`);
    expect(res.status).toBe(200);
  });

  test('404s deleting an already-deleted expense', async () => {
    const res = await agent.delete(`/api/expenses/${expenseId}`);
    expect(res.status).toBe(404);
  });
});
