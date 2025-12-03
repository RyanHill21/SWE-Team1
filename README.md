# Developer 5 — Analytics Dashboard + Recommendations

This folder contains a drop-in **analytics service** and a simple **dashboard UI** to satisfy the scope:

- **Schemas**: `Analytics` and `Tip`
- **Aggregations**: demo pipeline for time series
- **GET endpoints**: `/analytics/*`, `/tips/*`
- **Dashboard**: charts + recommendations (uses Chart.js CDN)

---

## 1) Run the backend (Node + Express + MongoDB)

**Requirements**: Node 18+, MongoDB running locally

```bash
cd backend
cp .env.example .env   # adjust if needed
npm install
npm run seed           # loads demo user + tips
npm run dev            # or: npm start
# server on http://localhost:4005
```

### Endpoints

- `GET /analytics/summary?userId=<ObjectId>` → `{ totalStudyMinutes, completionRate, productivityScore }`
- `GET /analytics/series?userId=<ObjectId>&range=14` → time-series for charts
- `GET /tips?userId=<ObjectId>` → personalized study tips based on productivity score

The seed script uses this **demo user id**:
```
656c0f7a3b1b3a2f9a5e1111
```

---

## 2) Open the dashboard

Open `frontend/index.html` in your browser **after** the backend is running.
It fetches from `http://localhost:4005` and renders:
- 3 KPI cards
- Bar chart of last 14 days
- 3–5 tailored tips

---

## 3) Integration notes (into your SWE-Team1-main)

If your repo already has an Express server:
- Copy `models/Analytics.js`, `models/Tip.js` into your models folder.
- Mount routes:
  ```js
  import analyticsRouter from './routes/analytics.js';
  import tipsRouter from './routes/tips.js';
  app.use('/analytics', analyticsRouter);
  app.use('/tips', tipsRouter);
  ```
- Run the `seed/seed.js` once to generate demo data (adjust paths).

If you have separate services, keep this as a microservice on port **4005**.

Frontend: replicate `frontend/index.html` as a page or convert into React component(s).
The API contract stays the same.

---

## 4) Quick test with curl

```bash
curl "http://localhost:4005/analytics/summary?userId=656c0f7a3b1b3a2f9a5e1111"
curl "http://localhost:4005/analytics/series?userId=656c0f7a3b1b3a2f9a5e1111&range=14"
curl "http://localhost:4005/tips?userId=656c0f7a3b1b3a2f9a5e1111"
```

---

## 5) VS Code workflow + Git branch

In VS Code terminal:

```bash
# create feature branch
git checkout -b feature/analytics-dashboard

# copy this folder into your repo (e.g., under services/analytics or server/)
# add & commit
git add .
git commit -m "feat(analytics): add Analytics & Tip models, endpoints, dashboard"

# push
git push -u origin feature/analytics-dashboard
```

---

