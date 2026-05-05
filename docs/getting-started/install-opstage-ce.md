# Install Opstage CE

Three supported install paths, in order of recommendation.

## 1. Docker (recommended)

See [Docker Deployment](../opstage-ce/docker-deployment) for the full reference. The shortest path:

```bash
docker run -d -p 8080:8080 \
  -v opstage-data:/app/data \
  -e OPSTAGE_ADMIN_USERNAME="admin@example.local" \
  -e OPSTAGE_ADMIN_PASSWORD="ChangeMeBeforeRunning123!" \
  -e OPSTAGE_SESSION_SECRET="rotate-me" \
  ghcr.io/xtrape-com/xtrape-capsule-ce:latest
```

## 2. Local build from source

Useful while public images are still pending, or when you want to develop against Opstage CE.

```bash
git clone https://github.com/xtrape-com/xtrape-capsule-ce
cd xtrape-capsule-ce
cp .env.example .env
# edit OPSTAGE_ADMIN_PASSWORD and OPSTAGE_SESSION_SECRET
docker compose -f deploy/compose/docker-compose.yml up --build -d
```

Open `http://localhost:8080`.

## 3. Local development (no Docker)

```bash
pnpm install
pnpm dev:backend     # http://localhost:8080
pnpm dev:ui          # http://localhost:5173 (Vite proxies /api to :8080)
```

The dev backend uses the same SQLite file (`./data/opstage.db`) and the same env conventions as the container.

## Verifying the install

After Opstage is up:

1. Browse to the URL.
2. Sign in with the bootstrap admin.
3. Confirm the dashboard loads (no agents and no services yet — that is expected).
4. Open **Settings** → **Diagnostics** to confirm the maintenance scheduler is running.

## Next

- [Build your first Capsule Service](./first-capsule-service)
- [Configuration reference](../opstage-ce/configuration)
