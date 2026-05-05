# Configuration

Opstage CE is configured exclusively through environment variables. There is no config file.

## Required

| Variable | Purpose |
| --- | --- |
| `OPSTAGE_SESSION_SECRET` | Signs admin session cookies. Must be a strong random string. |
| `OPSTAGE_ADMIN_USERNAME` | Bootstrap admin username (used only for the very first admin). |
| `OPSTAGE_ADMIN_PASSWORD` | Bootstrap admin password (used only for the very first admin). |

## Networking

| Variable | Default | Notes |
| --- | --- | --- |
| `OPSTAGE_PORT` | `8080` | HTTP listen port |
| `OPSTAGE_HOST` | `0.0.0.0` | Listen address |

## Storage

| Variable | Default | Notes |
| --- | --- | --- |
| `OPSTAGE_DATA_DIR` | `/app/data` | Holds `opstage.db` and optional backups |

## Sessions

| Variable | Default | Notes |
| --- | --- | --- |
| `OPSTAGE_SESSION_TTL_SECONDS` | `28800` | Session lifetime (8h) |

## Agent / Service freshness

| Variable | Default | Notes |
| --- | --- | --- |
| `OPSTAGE_AGENT_HEARTBEAT_INTERVAL_SECONDS` | `30` | Suggested heartbeat cadence (advisory) |
| `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS` | `90` | Heartbeat-miss threshold before an agent is marked OFFLINE |
| `OPSTAGE_SERVICE_STALE_THRESHOLD_SECONDS` | `120` | Service report freshness threshold |

## Maintenance

| Variable | Default | Notes |
| --- | --- | --- |
| `OPSTAGE_MAINTENANCE_INTERVAL_SECONDS` | `60` | How often the maintenance sweeper runs |
| `OPSTAGE_AUDIT_RETENTION_DAYS` | `90` | Audit pruning window |

## Backups (optional)

| Variable | Default | Notes |
| --- | --- | --- |
| `OPSTAGE_BACKUP_DIR` | `${OPSTAGE_DATA_DIR}/backups` | Where SQLite backup files are written |

## Tips

- Keep `OPSTAGE_SESSION_SECRET` rotation in mind: rotating it invalidates **all** active admin sessions.
- For Docker Compose, set bootstrap admin variables via `.env` and exclude `.env` from version control.
- All variables can be set per-deployment; Opstage does not look at any global file.

→ See [Docker Deployment](./docker-deployment) for the deployment-side view.
