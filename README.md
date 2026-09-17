# Worklog

Record work once, organise it automatically, reuse it everywhere.

A single work entry feeds the timesheet, the service usage log and the invoice,
so the same activity is never retyped.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · PostgreSQL ·
Prisma · Auth.js v5 (Google OAuth)

---

## Phase 1 — what exists now

| Area | State |
| --- | --- |
| Project structure, TypeScript, Tailwind v4, component system | Done |
| PostgreSQL + Prisma, full schema for every entity in the spec | Done |
| Environment variables | Done |
| Application shell: sidebar, header, mobile drawer, quick action | Done |
| Authentication (Google OAuth + local dev sign-in) | Done |
| Route protection, server-side ownership checks | Done |
| User profile: read, edit, validate, persist, audit | Done |
| Dashboard statistics from real database rows | Done |
| Light/dark theme, loading, empty and error states | Done |
| Seed data: the real 13 Aug – 12 Sep 2026 PUSKAPA period | Done |

Calendar, work log, timesheet, service log, invoices, clients, projects and
reports are routed and navigable, and each states which phase builds it. None of
them pretend to work.

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in `DATABASE_URL`, then generate a secret:

```bash
npx auth secret          # writes AUTH_SECRET
```

### 3. Database

Any Postgres instance works — local, Supabase, Neon or Railway.

```bash
# local Postgres via Docker
docker run --name worklog-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=worklog -p 5432:5432 -d postgres:16

npm run db:migrate       # creates the schema
npm run db:seed          # loads the PUSKAPA demo period
```

Supabase and Neon poolers need both `DATABASE_URL` (pooled, port 6543 on
Supabase) and `DIRECT_URL` (direct, port 5432) — migrations run over the direct
connection.

### 4. Run

```bash
npm run dev              # http://localhost:3000
```

With `ENABLE_DEV_LOGIN="true"` you can sign in with just the seeded email
(`rian@example.com` unless you changed `SEED_USER_EMAIL`) and skip Google
entirely. That provider is compiled out when `NODE_ENV=production`.

---

## Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → create or pick a project.
2. **APIs & Services → OAuth consent screen** → External → add your email as a
   test user while the app is unverified.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID →
   Web application**.
4. Authorised JavaScript origin: `http://localhost:3000`
   Authorised redirect URI: `http://localhost:3000/api/auth/callback/google`
   Add the production equivalents before you deploy.
5. Copy the client ID and secret into `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

Phase 1 requests `openid email profile` only. Phase 4 adds
`https://www.googleapis.com/auth/calendar.readonly` and enables the Google
Calendar API; the scope lives in one place, `src/lib/auth.config.ts`. The
`access_type: "offline"` grant is already set so a refresh token is issued on
first consent and calendar sync keeps working without re-prompting.

Passwords are never stored. OAuth tokens live in the `Account` table, which only
the server reads.

---

## Project layout

```
prisma/
  schema.prisma          every entity in the spec, so later phases add
                         features rather than destructive migrations
  seed.ts                the real PUSKAPA period: 78h, 9.75 days, 3,900,000
src/
  app/
    (app)/               authenticated shell — every page under here is
                         guarded in layout.tsx before it renders
    login/               sign-in
    api/                 route handlers; each checks the session first
  components/
    ui/                  buttons, cards, fields, badges, skeletons
    shell/               sidebar, header, quick action, page headers
  lib/
    auth.config.ts       edge-safe auth config (middleware runs this)
    auth.ts              full auth with Prisma adapter + requireUser()
    calc.ts              the one place duration and billing maths lives
    format.ts            dates, times, durations, currency — Asia/Jakarta, 24h
    db.ts                Prisma client singleton
middleware.ts            route protection
```

### The rule worth keeping

`src/lib/calc.ts` is the only place duration, day units and billing amounts are
calculated. The dashboard already uses it; the timesheet, service log and invoice
must use the same functions rather than growing their own copies. That is what
keeps the three documents agreeing with each other.

Day units divide exactly by default (78h ÷ 8 = 9.75). Rounding each entry to a
quarter day first would give 10.5 — which is why `calculateWorkDayUnits` takes
rounding as an opt-in parameter rather than applying it by default.

---

## Commands

```bash
npm run dev          # development server
npm run build        # prisma generate + production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run db:migrate   # create and apply a migration
npm run db:deploy    # apply migrations in production
npm run db:studio    # browse the database
npm run db:seed      # reload demo data
```

---

## Deployment

**Vercel + Supabase/Neon**

1. Push the repository and import it into Vercel.
2. Add every variable from `.env.example` to the Vercel project.
   Set `AUTH_URL` to the production URL and leave `ENABLE_DEV_LOGIN` unset.
3. Add the production callback URL to the Google OAuth client:
   `https://your-domain/api/auth/callback/google`
4. Run `npm run db:deploy` against the production database (locally with the
   production `DIRECT_URL`, or as a build step).

`npm run build` runs `prisma generate` first, so the client is always in step
with the schema.

---

## Next phase

**Phase 2 — clients and projects.** CRUD for both, the client–project
relationship, billing defaults and rate history, on top of the schema that is
already migrated. After that, phase 3 builds the work log, which is the module
everything else reads from.
