# Madhavan — Full-Stack Portfolio (Next.js + MongoDB)

Portfolio for Madhavan, Full-Stack Developer. Neon cyan (#00f3ff) / neon violet (#7000ff) dark theme, glassmorphic cards, and a real admin dashboard backed by MongoDB.

## Stack

- **Next.js 14 (App Router)** + React 18
- **MongoDB** via Mongoose
- **Tailwind CSS** with custom neon design tokens

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Configure `.env.local`:

   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/madhavan-portfolio   # or your Atlas URI
   ADMIN_PASS=madhavan-admin                                   # change this!
   ```

3. Make sure MongoDB is running (or paste an Atlas connection string), then:

   ```
   npm run dev
   ```

4. Open http://localhost:3000 — the project collection auto-seeds with 6 sample projects on first load.

## Admin Dashboard

- Visit **`/admin`** (also linked in the navbar)
- Log in with the `ADMIN_PASS` passphrase
- Add / edit / delete projects — all changes go straight to MongoDB via the REST API
- All admin API routes require the `Authorization: Bearer <ADMIN_PASS>` header

## API

| Method | Route               | Auth   | Description                             |
| ------ | ------------------- | ------ | --------------------------------------- |
| GET    | `/api/projects`     | public | List all projects (auto-seeds if empty) |
| POST   | `/api/projects`     | admin  | Create project                          |
| PUT    | `/api/projects/:id` | admin  | Update project                          |
| DELETE | `/api/projects/:id` | admin  | Delete project                          |
| POST   | `/api/auth`         | public | Verify passphrase → returns token       |
