# Deployment & CI/CD

This document explains how to deploy FlowBoard with PostgreSQL, Render backend, Vercel frontend, and GitHub Actions.

## 1) Provision PostgreSQL

Use a managed PostgreSQL provider such as Render Postgres, Railway, Supabase, or Neon. Copy the connection string and set it as `DATABASE_URL`.

Example:

```
postgresql://username:password@host:5432/flowboard
```

## 2) Set GitHub Secrets

Under GitHub Settings → Secrets → Actions, configure:

- `DATABASE_URL`
- `JWT_SECRET`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`
- `FRONTEND_URL` (e.g. `https://flowboard.vercel.app`)

## 3) Render backend setup

In Render environment variables, configure:

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

Render can use the `backend/Dockerfile` to build:

- install dependencies
- generate Prisma client
- compile the NestJS API

## 4) Vercel frontend setup

In Vercel project settings, add:

- `NEXT_PUBLIC_API_URL` = `https://<your-render-backend-url>`

The frontend uses this variable to call the API from browser clients.

## 5) Local testing flow

1. Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:generate
npm run start:dev
```

2. Frontend:

```bash
cd frontend
npm install
npm run dev
```

If you need a public URL, use a forwarding tool such as ngrok or a cloud deployment.

## 6) Important notes

- The backend requires `DATABASE_URL` for PostgreSQL.
- The frontend requires `NEXT_PUBLIC_API_URL`.
- `JWT_SECRET` must be set in the backend environment.
- Run `npm install` inside `backend` and `frontend` separately for reliable installs.
