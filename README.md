# FloodResponse — Flood Rescue Resource Optimization Platform

A full-stack academic demonstration built with Next.js App Router, TypeScript, Prisma, SQLite and React Leaflet. Citizens can register, sign in and submit geolocated rescue requests. Operators can review requests, view map markers and clusters, update request status, and manage rescue resources.

> **Safety notice:** This is an academic demonstration, not a certified emergency dispatch system. It does not contact emergency services or guarantee rescue. In a real emergency, contact the appropriate local emergency number and verify all information with trained responders.

## Requirements

- Node.js 20.9+ (Node.js 22 LTS recommended)
- npm 10+
- Git (for GitHub upload)

## Windows / VS Code quick start

1. Extract the ZIP and open the `flood-rescue-platform` folder in VS Code.
2. Open **Terminal → New Terminal**. Confirm the terminal is inside the folder containing `package.json`.
3. Install dependencies:

   ```powershell
   npm install
   ```

   The `postinstall` script automatically generates Prisma Client.

4. Create the local environment file (only once):

   ```powershell
   Copy-Item .env.example .env
   ```

5. Open `.env` and replace `JWT_SECRET` with a unique random secret. Keep `.env` private; never upload it to GitHub.
6. Prepare the local database:

   ```powershell
   npm run db:setup
   ```

7. Optional: add sample users, requests and resources:

   ```powershell
   npm run db:seed
   ```

8. Start the app:

   ```powershell
   npm run dev
   ```

9. Visit http://localhost:3000.

**Convenience:** Running `npm run dev` also runs Prisma `db push` automatically before Next.js starts. If registration reports a database setup error, stop the server with `Ctrl+C`, run `npm run db:setup`, then start it again.

### Demo accounts (only after running the seed command)

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@floodrescue.demo` | `Rescue@123` |
| Citizen | `citizen@floodrescue.demo` | `Rescue@123` |

These are public demo credentials. Do not use them for a real deployment. The seed script creates these local demo accounts; it does not create an account automatically on a fresh database.

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install packages and generate Prisma Client |
| `npm run dev` | Prepare local SQLite database and start Next.js |
| `npm run db:setup` | Generate Prisma Client and create/update local database tables |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Sync Prisma schema to the configured database |
| `npm run db:seed` | Insert local demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | TypeScript type-check |
| `npm run build` | Generate Prisma Client and build Next.js |
| `npm run start` | Start the production build |

## Main routes

- `/` — home page
- `/register` — citizen registration
- `/login` — sign in
- `/dashboard` — rescue operations dashboard
- `/requests/new` — submit a rescue request
- `/resources` — resource inventory

## GitHub upload

Create an empty repository on GitHub, then run these commands from the project folder:

```powershell
git init
git add .
git status
git commit -m "Initial FloodResponse platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flood-rescue-platform.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Check `git status` before committing. `.env`, local SQLite databases, `node_modules` and `.next` are ignored. Never commit secrets or production database credentials.

For later updates:

```powershell
git add .
git commit -m "Update FloodResponse platform"
git push origin main
```

## Deployment notes (Vercel)

The included configuration uses **SQLite for local development**. A local SQLite file is not a suitable persistent database for a serverless Vercel deployment. Before deploying, provision a managed PostgreSQL database (for example, a hosted PostgreSQL service), change the Prisma datasource provider in `prisma/schema.prisma` from `sqlite` to `postgresql`, set the provider's PostgreSQL connection URL as `DATABASE_URL` in Vercel, and create/apply production migrations. Then push the deployment-ready database configuration to GitHub and import the repository into Vercel.

Do not copy the local SQLite `DATABASE_URL` to Vercel. Set a unique production `JWT_SECRET` in Vercel environment variables. The application has not been deployed by this ZIP; deployment still requires your GitHub repository, hosted PostgreSQL credentials and Vercel project configuration.

## Project structure

```text
flood-rescue-platform/
├── app/                 # Pages and API route handlers
├── components/          # Auth form, sidebar and map
├── lib/                 # Prisma client, auth and clustering helpers
├── prisma/              # Prisma schema and seed script
├── public/              # Static assets
├── .env.example         # Safe environment template
├── .gitignore
├── package.json
└── README.md
```

## Important security and operational limitations

This is an educational prototype. Before real-world use, add rate limiting, monitoring, audit logs, backups, stronger role/record-level authorization, privacy controls, abuse reporting and operational validation. Do not treat demo map data, resource availability or clustering output as verified emergency information.


## Quick start (Windows / VS Code)

1. Extract this ZIP file.
2. Open the extracted `flood-rescue-platform-complete` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Confirm the terminal is inside the project folder (the folder containing `package.json`).
5. Run:

   ```powershell
   npm install
   npm run dev
   ```

   The `predev` script creates/updates the local SQLite database automatically.
6. Open http://localhost:3000.

If you want sample dashboard data, stop the server with `Ctrl+C`, then run:

```powershell
npm run db:seed
npm run dev
```

### Demo accounts

- Admin: `admin@floodrescue.demo`
- Citizen: `citizen@floodrescue.demo`
- Password for both: `Rescue@123`

These are demo credentials for local development only. Change them before deploying publicly.

### Environment

A local `.env` file is included for this extracted copy. It configures SQLite at `prisma/dev.db` and a development JWT signing secret. Do not publish this `.env` file or reuse the demo credentials in production.

### If `npm` or `node` is not recognized

Install the current Node.js LTS release, restart VS Code, and verify with `node -v` and `npm -v`.
