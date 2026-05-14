# Docker Deployment

Opstage CE is designed to run as a **single container** with a SQLite volume.
This page covers the production-style deployment paths.

::: warning Public Preview Docker path
Through `v0.2 rc.1`, the source-build Docker Compose path remains the
canonical deployment path. The CE workflow publishes the following GHCR
tags (see `.github/workflows/docker-publish.yml`):

- on each `v*` git tag — `:<semver>` (e.g. `0.2.0`) and `:<major>.<minor>` (e.g. `0.2`);
- on every `main` push — `:edge`, `:main`, and `:sha-<long>`.

It intentionally does **not** publish `latest`. Operators should always pin
to a semver tag for reproducible deployments; the `edge` and `sha-*` tags
are for experimentation and exact-commit pinning only.

After the `v0.2.0` cut, `ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0`
becomes the primary documented image.
:::

## Build and run from source (current path)

```bash
git clone https://github.com/xtrape-com/xtrape-capsule-ce.git
cd xtrape-capsule-ce
cp .env.example .env
# edit OPSTAGE_ADMIN_PASSWORD and OPSTAGE_SESSION_SECRET in .env
docker compose -f deploy/compose/docker-compose.yml up --build -d
```

The compose file builds the image locally, mounts a `data` volume, and exposes
port `8080`.

## Single image (after v0.2.0 cut)

After the `v0.2.0 Public Preview` cut, use a pinned semver tag.
The expected shape is:

```bash
docker run -d \
  --name opstage-ce \
  -p 8080:8080 \
  -v opstage-data:/app/data \
  -e OPSTAGE_ADMIN_USERNAME="admin@example.local" \
  -e OPSTAGE_ADMIN_PASSWORD="ChangeMeBeforeRunning123!" \
  -e OPSTAGE_SESSION_SECRET="rotate-me-at-least-32-characters" \
  ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0
```

## Docker Compose against the pinned image

```yaml
# docker-compose.yml
services:
  opstage:
    image: ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0
    ports:
      - "8080:8080"
    environment:
      OPSTAGE_ADMIN_USERNAME: "admin@example.local"
      OPSTAGE_ADMIN_PASSWORD: "ChangeMeBeforeRunning123!"
      OPSTAGE_SESSION_SECRET: "${OPSTAGE_SESSION_SECRET}"
      OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS: "90"
      OPSTAGE_AUDIT_RETENTION_DAYS: "90"
    volumes:
      - opstage-data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "/app/healthcheck.js"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  opstage-data:
```

```bash
docker compose up -d
```

## Data directory

| Path inside container  | Contents                                   |
| ---------------------- | ------------------------------------------ |
| `/app/data/opstage.db` | SQLite database                            |
| `/app/data/backups/`   | (Optional) SQLite backups, when configured |

Mount a named volume or a host directory:

```bash
-v opstage-data:/app/data         # named volume (recommended)
-v /opt/opstage:/app/data         # bind mount
```

::: warning CE is **single-node**. Running two backend containers against the
same SQLite file is unsupported. :::

## Environment variables

The most relevant variables for a Docker deployment:

| Variable                                  | Required  | Default     | Description                      |
| ----------------------------------------- | :-------: | ----------- | -------------------------------- |
| `OPSTAGE_ADMIN_USERNAME`                  | bootstrap | —           | Username for the bootstrap admin |
| `OPSTAGE_ADMIN_PASSWORD`                  | bootstrap | —           | Password for the bootstrap admin |
| `OPSTAGE_SESSION_SECRET`                  |    yes    | —           | Signs admin session cookies      |
| `OPSTAGE_PORT`                            |    no     | `8080`      | HTTP listen port                 |
| `OPSTAGE_DATA_DIR`                        |    no     | `/app/data` | Where SQLite + backups live      |
| `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS` |    no     | `90`        | Heartbeat-miss threshold         |
| `OPSTAGE_SESSION_TTL_SECONDS`             |    no     | `28800`     | Admin session TTL (8h)           |
| `OPSTAGE_AUDIT_RETENTION_DAYS`            |    no     | `90`        | Audit pruning window             |

A complete reference is in [Configuration](./configuration).

## Ports

A single HTTP port (default `8080`) serves both the API (`/api`) and the static
console.

If you put Opstage behind a reverse proxy:

- terminate TLS at the proxy,
- preserve cookies,
- preserve `X-CSRF-Token`,
- forward the original host (the UI builds same-origin URLs).

## Logs

The backend logs to stdout/stderr in JSON-friendly form. Stream with:

```bash
docker logs -f opstage-ce
```

## Backups

For SQLite backup options (consistent online snapshots, owner-only download from
the console, scheduled file copies), see
[Backup and Upgrade](./backup-and-upgrade).

## Upgrades

1. **Back up `/app/data`.**
2. Pull the new image: `docker pull ghcr.io/xtrape-com/xtrape-capsule-ce:<tag>`.
3. Recreate the container: `docker compose up -d`.
4. The backend runs Prisma migrations on start.

::: tip Pin a specific tag in your compose file. CE follows semver - read the
changelog before adopting a new minor. :::
