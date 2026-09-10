# Finsight

A personal expense tracker with AI-generated spending insights.

## Stack

- **Frontend:** Next.js (App Router) + React, Tailwind CSS
- **Backend:** Node.js + Express (plain JavaScript)
- **Database:** PostgreSQL, accessed with raw parameterized SQL via `pg` (no ORM)
- **AI:** Google Gemini API for a monthly spending-insights summary

## Project structure

```
finsight/
  backend/     Express REST API
  frontend/    Next.js app
```

## Local setup

### 1. Database

Create a Postgres database (e.g. a free [Neon](https://neon.tech) project) and note its connection string.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, GEMINI_MODEL
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

## Status

🚧 Work in progress.
