# Install Opstage CE

Two supported install paths, in order of recommendation.

## 1. Docker Compose from source (recommended)

See [Docker Deployment](../opstage-ce/docker-deployment) for the full reference.
The current Public Review path builds the image locally:

```bash
git clone https://github.com/xtrape-com/xtrape-capsule-ce
cd xtrape-capsule-ce
cp .env.example .env
# edit OPSTAGE_ADMIN_PASSWORD and OPSTAGE_SESSION_SECRET
docker compose -f deploy/compose/docker-compose.yml up --build -d
```

Open `http://localhost:8080`.

::: info Docker path during Public Preview rc
Through `v0.2 rc.1`, the source-build Docker Compose path remains the
canonical install path. The CE workflow publishes GHCR images on every
`main` push (`:edge`, `:main`, `:sha-<long>`) and on every `v*` git tag
(`:<semver>`, `:<major>.<minor>`); it does **not** publish `latest`.
After the `v0.2.0` cut, `ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0`
becomes the primary documented install path — see
[Docker Deployment](../opstage-ce/docker-deployment).
:::

## 2. Local development (no Docker)

```bash
pnpm install
pnpm dev:backend     # http://localhost:8080
pnpm dev:ui          # http://localhost:5173 (Vite proxies /api to :8080)
```

The dev backend uses the same SQLite file (`./data/opstage.db`) and the same env
conventions as the container.

## Verifying the install

After Opstage is up:

1. Browse to the URL.
2. Sign in with the bootstrap admin.
3. Confirm the dashboard loads (no agents and no services yet — that is
   expected).
4. Open **Settings** → **Diagnostics** to confirm the maintenance scheduler is
   running.

## Next

- [Build your first Capsule Service](./first-capsule-service)
- [Configuration reference](../opstage-ce/configuration)
