# RENA TRADING COUPLE — local development notes

Full-stack app: **client/** (React 18 + Vite + Tailwind) and **server/** (Express + PostgreSQL + JWT
cookie sessions). Everything runs through `docker-compose.base44.yml`; never install Node or Postgres
on the sandbox host.

## Run

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web entry: host port **3000** → Vite dev server (5173) with `/api` proxied to the `api` service.
- API: `http://api:4000` (internal only, single-origin wiring so the httpOnly session cookie works).
- DB: `postgres:16` in the `db` service. Schema and seed run automatically on API start (`server/src/schema.sql`, `server/src/seed.js`) and are idempotent.

## Seeded accounts (development only)

| Role  | Login              | Password      |
|-------|--------------------|---------------|
| Admin | `admin@rena.gold`  | `Admin@12345` |
| User  | `demo@rena.gold`   | `Demo@12345`  |

Delete or rotate these before any production deployment.

## Things worth knowing

- **Money moves only through admin review.** Deposits credit `balance`/`available` and withdrawals or
  investments reserve `available` at request time; approve/reject applies the ledger change inside a
  Postgres transaction (`review()` in `server/src/routes/admin.js`). Never patch balances directly.
- **Pool1 is enforced server-side**: `plans.is_public` is forced to `false` for code `POOL1`, and every
  public plan endpoint filters `is_public = true AND code <> 'POOL1'`. `allocation_notes` is returned
  only by `/api/admin/plans`.
- **RBAC is backend-enforced** (`requireAuth` / `requireAdmin` in `server/src/auth.js`). Hiding UI is not
  a control; `/api/admin/*` always re-checks the role.
- **Market ticker is honest by design**: `/api/market/ticker` tries CoinGecko + open.er-api.com and falls
  back to a payload with `source: "demo"` that the UI labels “داده نمایشی”. Admin can force demo mode via
  `site_settings.market_source`.
- Sandbox-only overrides are gated on `BASE44_PREVIEW_MODE === '1'` (Vite HMR over `wss:443`). With the
  flag unset the config is untouched.
- Vite's host allowlist comes from the platform-provided `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`
  environment variable (Vite ≥ 6.1 appends it); no host is hardcoded.

## Reference homepage

- Homepage-only styling is scoped under `.reference-shell` in `client/src/reference-theme.css`;
  account and content screens keep their original layout. Do not move these overrides into global tokens.
- `ReferenceArt.jsx` clips artwork from the user-provided `client/public/images/reference.jpg` (1536×1024).
  Keep the master image dimensions and crop coordinates together. Navigation, cards, slider controls and
  calls to action are real React controls, not a flattened screenshot.
- Missing `client/index.html` makes Vite return 404 and fail its existing healthcheck, even while the
  dev process is running. Restore the entry and its imports; do not weaken the healthcheck.

## Checks

There is no test runner. Verify with `curl` against `http://localhost:3000/api/...` and by driving the UI;
logs: `docker compose -f docker-compose.base44.yml logs -f web api`.
