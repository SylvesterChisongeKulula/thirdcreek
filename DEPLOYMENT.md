# Deployment (Dokploy)

This app deploys as a single Docker Compose service (`docker-compose.yml` + `Dockerfile` in the repo root) — a Nuxt/Nitro server backed by an embedded SQLite (libSQL) database file, persisted on a named volume.

## Setting up the Dokploy app

1. In Dokploy, create a new application using the **Docker Compose** deployment type.
2. Point it at this GitHub repo and the branch you want to deploy (e.g. `main` for staging).
3. Dokploy will build from the existing `docker-compose.yml`/`Dockerfile` as-is — no changes needed there. The `db-data` volume it declares persists both the SQLite database and any uploaded product images across redeploys.
4. Set the container port to `3000` and configure your domain in Dokploy's domain settings (SSL is handled by Dokploy/Traefik — no app-side config needed).

## Environment variables

Set these in Dokploy's environment variables UI for the app (they're interpolated into `docker-compose.yml` the same way `SESSION_PASSWORD` already is):

| Variable | Required | Notes |
|---|---|---|
| `SESSION_PASSWORD` | **Yes** | A real secret, 32+ chars — e.g. `openssl rand -base64 32`. The app refuses to boot in production without it. |
| `SEED_ON_BOOT` | Staging only | Set to `true` to auto-seed the database on first boot if it's empty. **Never set this in production.** |
| `OWNER_DEV_PASSWORD` / `STAFF_DEV_PASSWORD` | Recommended for staging | Overrides the seeded dev login passwords. If unset, the seed falls back to the defaults visible in this repo's git history (`owner-dev-password` / `staff-dev-password`) — fine for a private staging site, not something to leave as-is anywhere more exposed. |
| `DATABASE_URL` | No | Defaults to `file:.data/thirdcreek.db`. No reason to override for a single-instance deploy. |

## First deploy checklist

1. Confirm the deploy is healthy: `GET /api/health` should return `{"status":"ok"}`.
2. Check the app's runtime logs in Dokploy for `[seed] Database was empty — seeded ...` — confirms the auto-seed ran (only appears once, on the first boot against an empty database).
3. Log in at `/login` with the owner/staff credentials you configured (or the defaults above).
4. Spot-check `/admin` (dashboard, contacts, pipeline, products) and the public `/products` page.

## Resetting staging

Delete the `db-data` volume in Dokploy and redeploy — the app starts with an empty database, and (with `SEED_ON_BOOT=true` still set) auto-seeds fresh on that next boot.

## Later, for production

Leave `SEED_ON_BOOT` unset (it defaults to off). Set a unique `SESSION_PASSWORD`. Prefer granting real staff logins via `npm run db:studio` against the production database rather than relying on the seeded dev accounts.
