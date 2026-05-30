# FlowBoard

FlowBoard is now an enterprise-grade SaaS project management platform built with a NestJS backend, Prisma PostgreSQL database, and Next.js frontend.

## What’s included

- Multi-workspace support with role-based access control
- Project, board, and task management with real-time collaboration
- Executive dashboards, sprint analytics, and team workload insights
- Notifications, comments, workspace member invitations, and activity tracking
- Cloud-ready deployment for Render / Vercel / Docker and managed PostgreSQL

## Repository structure

- `backend` - NestJS API, Prisma schema, auth, workspaces, projects, tasks, notifications, and real-time gateway
- `frontend` - Next.js app router frontend with auth, dashboard, project board, and workspace experience
- `docs` - deployment and architecture notes
- `docker-compose.yml` - local development services for Postgres, backend, and frontend

## Local setup

1. Install dependencies for backend and frontend:

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Copy environment variables for the backend:

```bash
cp backend/.env.example backend/.env
```

3. Start PostgreSQL and run Prisma migration:

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

4. Start backend and frontend:

```bash
cd backend
npm run start:dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

5. Open the frontend at `http://localhost:3000`.

## Local docker setup

If you want Docker-based local development, use:

```bash
docker compose up --build
```

## Notes

- Set `DATABASE_URL` and `JWT_SECRET` in `backend/.env`
- Set `NEXT_PUBLIC_API_URL` in `frontend/.env` for local or cloud backend URLs
- The frontend uses bearer token auth from local storage and the backend enforces workspace membership for projects and tasks
