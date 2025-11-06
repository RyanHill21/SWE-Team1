# Smart Study Planner 

This is a **half-done** front-end prototype for a study planner. It logs study sessions to `localStorage`, shows basic stats, and has **stubbed** AI insights & assignments.

## How to Start
1. Open the folder in **VS Code**.
3. Right‑click `index.html` → **Open with Live Server**.

> Or, just double‑click `index.html` to open in your browser.

## What works
- Add/delete study sessions (persisted in `localStorage`).
- Quick stats: total time, sessions this week, average focus.
- Fake progress chart (canvas) as placeholder.
- “AI Insights” button generates tips using simple heuristics.

## TODO (for later sprints)
- Replace canvas with real charts (Chart.js or Recharts).
- Real **Assignments** CRUD (title, course, due, estimate, status).
- Auth & cloud sync.
- **AI**: replace prototype with real endpoint.
- Mobile polish, dark/light theme switch.
