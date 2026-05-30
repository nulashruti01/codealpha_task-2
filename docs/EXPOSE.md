Expose options for making the app accessible from any device

Quick temporary option (tunnel your localhost):

1) Install ngrok: https://ngrok.com/download
2) Start the frontend locally (or via Docker compose):

```powershell
# if using docker-compose
docker-compose up -d --build

# or run locally
cd apps/web
npm install
npm run dev
```

3) Start ngrok to forward the frontend port (3000):

```powershell
ngrok http 3000
```

4) Copy the generated public URL (https://xxxx.ngrok.io) and paste it into any device or search bar — it will open the frontend.

Notes:
- For a production-ready public site that appears in Google search, deploy the frontend to Vercel and backend to Railway/Render, configure a proper domain, and allow search engines to index the site.
- Quick deploy suggestions:
  - Frontend: Vercel (connect this repo, set `NEXT_PUBLIC_API_URL` to your backend URL)
  - Backend: Railway / Render (deploy Dockerfile or Node app, set `DATABASE_URL` and `JWT_SECRET` env vars)
  - Database: Use managed Postgres (Neon, Supabase, Railway) or keep Docker Compose for local dev.
