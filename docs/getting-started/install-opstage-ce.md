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

::: info Pinned Docker tag for v0.2 Public Preview
The primary documented install is
`ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0` — see
[Docker Deployment](../opstage-ce/docker-deployment) for the full set
of tags the CE workflow publishes (`:<semver>`, `:<major>.<minor>`,
`:edge`, `:main`, `:sha-<long>`). The workflow does **not** publish
`latest`; always pin to a semver tag for reproducible deployments.
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
