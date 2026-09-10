# Finsight

A personal expense tracker with AI-generated spending insights. Built as a
fullstack portfolio project.

## What it does

- Email/password auth with hashed passwords and JWT sessions in an httpOnly cookie
- Add, edit, and delete expenses; filter by month/category, search by description, paginate
- Recurring expenses (weekly/monthly) that auto-generate their next instance on load — no cron job
- Custom categories on top of eight seeded defaults
- Monthly budgets per category with a progress bar that shifts green → yellow → red
- A dashboard: total spent this month, spend-by-category chart, 6-month spending trend
- One-click AI insights: the backend aggregates the month's category totals and sends only
  that summary (never raw transactions) to Gemini for a plain-English read on spending patterns
- CSV export of the currently filtered expense list
- Light/dark mode, responsive down to mobile, loading and empty states throughout

## Stack

- **Frontend:** Next.js (App Router) + React, Tailwind CSS, Recharts
- **Backend:** Node.js + Express, plain JavaScript
- **Database:** PostgreSQL, raw parameterized SQL via `pg` — no ORM
- **AI:** Google Gemini API
- **Tests:** Jest + Supertest (backend), Jest + React Testing Library (frontend)
- **CI:** GitHub Actions, running both test suites on every push/PR to `main`

## Project structure

```
finsight/
  backend/
    src/
      app.js              Express app, middleware, route mounting
      db/                 pg pool, schema.sql, migration script, default categories
      middleware/auth.js  JWT cookie verification
      routes/              auth, categories, expenses, budgets, insights
      utils/                CSV export, recurring-expense generation
    __tests__/            Jest + Supertest
  frontend/
    src/
      app/                 routes: landing, login, signup, dashboard/*
      components/          ui/, layout/, landing/, dashboard/, expenses/, budgets/
      context/              AuthContext, ThemeContext
      lib/                   API client, formatters, chart color tokens
  .github/workflows/ci.yml
```

## Local setup

### 1. Database

Create a Postgres database (e.g. a free [Neon](https://neon.tech) project) and note its connection string.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, GEMINI_MODEL
npm run migrate         # creates the tables
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points to the backend URL
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Environment variables

**backend/.env**

| Variable | Description |
| --- | --- |
| `PORT` | Port the Express server listens on |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret used to sign session JWTs |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model name to use for insights |
| `FRONTEND_URL` | Frontend origin, used for CORS |
| `NODE_ENV` | Set to `production` in deployment — switches the auth cookie to `SameSite=None; Secure` for the cross-domain frontend/backend split |

**frontend/.env.local**

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

## Testing

```bash
cd backend && npm test    # Jest + Supertest: auth and expense CRUD
cd frontend && npm test   # Jest + React Testing Library: ExpenseForm
```

Backend tests run against whatever `DATABASE_URL` is in `backend/.env` — they create a
uniquely-named test user per run and delete it afterward. CI instead spins up a throwaway
Postgres service container, so it never touches the real database.

## Deployment

- **Database:** Neon (already set up for local dev — the same instance can back production)
- **Backend:** Render (or any Node host) — set the env vars above, with `NODE_ENV=production`
  and `FRONTEND_URL` set to the deployed frontend's URL
- **Frontend:** Vercel — set `NEXT_PUBLIC_API_URL` to the deployed backend's URL

The auth cookie is `httpOnly` and cross-domain (frontend and backend live on different
domains in this setup), so it requires `SameSite=None; Secure`, which only applies when
`NODE_ENV=production` — see `backend/src/routes/auth.js`.
