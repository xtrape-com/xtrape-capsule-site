# Quick Start

This guide gets Opstage CE running locally in about 5 minutes.

## What you'll have at the end

- An Opstage CE control plane running on `http://localhost:8080`
- A persistent SQLite database under `/app/data` inside the container
- A bootstrap admin account ready to sign in
- A console where you can create registration tokens for your Capsule Services

## Prerequisites

- Docker 20.10+ (or Docker Desktop)
- 200 MB free disk for the image, ~50 MB for the SQLite data volume
- A free local port (default `8080`)

::: tip You do **not** need Node.js, a database server, or a reverse proxy to
run Opstage CE. The container is self-contained. :::

::: info Public Docker image is planned Public Docker images are planned for the
v0.1.0 Public Preview release. Until then, the recommended path is the local
Docker Compose build below. :::

## Recommended - Docker Compose from source

```bash
git clone https://github.com/xtrape-com/xtrape-capsule-ce.git
cd xtrape-capsule-ce
cp .env.example .env
# edit OPSTAGE_ADMIN_PASSWORD and OPSTAGE_SESSION_SECRET in .env
docker compose -f deploy/compose/docker-compose.yml up --build -d
```

The compose file builds Opstage CE locally, mounts a `data` volume, and exposes
port `8080`.

![Opstage CE source-build architecture](/diagrams/architecture.svg)

## Default access

| Item     | Value                                                           |
| -------- | --------------------------------------------------------------- |
| URL      | `http://localhost:8080`                                         |
| Username | `OPSTAGE_ADMIN_USERNAME` (default: `admin@example.local`)       |
| Password | `OPSTAGE_ADMIN_PASSWORD` (default: `ChangeMeBeforeRunning123!`) |

::: warning The bootstrap username and password are used **only** when the
database is empty. Changing the env vars later does **not** reset an existing
admin account. Rotate `OPSTAGE_SESSION_SECRET` and the admin password before
exposing Opstage to anything beyond `localhost`. :::

## Data persistence

All state lives in `/app/data` inside the container:

```text
/app/data/
└── opstage.db      # SQLite database
```

Mount a named volume (or a host directory) to keep your data across container
restarts:

```bash
-v opstage-data:/app/data        # named volume
-v /opt/opstage:/app/data        # host bind mount
```

## Next steps

- [Build your first Capsule Service](./first-capsule-service)
- [Configure Opstage CE](../opstage-ce/configuration)
- [Token model](../security/token-model)

## Stop and clean up

```bash
# stop
docker stop opstage-ce && docker rm opstage-ce

# wipe data (irreversible)
docker volume rm opstage-data
```

## Common issues

**Port `8080` is in use.** Map a different host port: `-p 9090:8080`.

**Forgot the bootstrap password.** It cannot be re-derived from env vars after
first start. The simplest reset path in CE is to wipe the SQLite volume and
start over.

**Container restarts in a loop.** Check `docker logs opstage-ce` — usually a
missing or too-short `OPSTAGE_SESSION_SECRET`.

**Cannot reach `/api/admin/auth/me`.** Make sure cookies are accepted (the Admin
UI relies on session cookies + CSRF tokens).
