# Capsule Management Contract

The **Capsule Management Contract** is the wire-level agreement between an Agent and Opstage. It is intentionally small.

## Endpoints (Agent ↔ Backend)

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/agents/register` | Exchange a registration token for an agent token |
| `POST` | `/api/agents/heartbeat` | Periodic liveness signal |
| `POST` | `/api/agents/services` | Report Capsule Service manifests, health, configs |
| `GET` | `/api/agents/commands` | Long-poll for dispatched commands |
| `POST` | `/api/agents/commands/:id/result` | Report a command's result |

## Payload shape (high-level)

```text
register   →  { agent: { code, name?, mode, runtime? }, service?: ReportedService }
heartbeat  →  { timestamp }
services   →  { agentId, services: [ { code, name, version, healthStatus, configs[], actions[] } ] }
commands   →  { commands: [ { id, type, serviceCode, action, payload, expiresAt } ] }
result     →  { success, error?, output? }
```

## Effective service status

Opstage derives `effectiveStatus` per Capsule Service from:

1. the agent's online/offline state,
2. the freshness of the last service report,
3. the most recent reported `healthStatus`.

| State | Meaning |
| --- | --- |
| `HEALTHY` | Agent online, recent report, healthy probe |
| `UNHEALTHY` | Agent online, recent report, unhealthy probe |
| `STALE` | Agent online but service report is stale, **or** agent went offline |
| `OFFLINE` | Agent has been offline long enough to suppress the service entirely |
| `UNKNOWN` | Not enough information yet (e.g. just registered, no health yet) |

::: tip Stored vs effective status (v0.2+)
Service responses now include both `status` (the **effective** status computed at request time, folding in agent state and heartbeat freshness) and `storedStatus` (the value last written by `upsertReportedService`). These usually match; they diverge briefly when an agent goes offline between maintenance sweeps. UIs should display `status`; tooling that inspects historical state can read `storedStatus`.
:::

### Command failure surface (v0.2+)

When an agent reports `success: false` on `/api/agents/:id/commands/:id/result`, the backend lifts the most actionable fields out of the result envelope and onto the **command row itself**, so list endpoints and the UI can show *why* a command failed without joining `command_results`:

- `command.errorCode` — copied from `body.error.code`, capped at 80 chars; falls back to `"ACTION_FAILED"` when the agent didn't provide a code.
- `command.errorMessage` — copied from `body.error.message` or top-level `body.message`, capped at 500 chars.
- `command.durationMs` — computed at serialize time as `completedAt - startedAt`; `null` for commands that never started or never finished.

The full agent-reported envelope still lands in `command_results.errorJson` unredacted-by-key (subject to the standard wire-boundary [`redactSecrets`](https://github.com/xtrape-com/xtrape-capsule-ce/blob/main/packages/shared/src/index.ts) pass).

## System endpoints (v0.2+)

Two unauthenticated endpoints expose operator-facing process metadata.
They were spelled in the v0.1 contract but only fully materialized in
v0.2 (SQLite round-trip probe, OCI labels, build commit/timestamp).

### `GET /api/system/health`

```json
{
  "status": "ok",
  "uptimeSeconds": 123456,
  "version": "0.2.0",
  "edition": "ce",
  "database": { "status": "ok", "latencyMs": 1 }
}
```

`status` is `"ok"` iff the SQLite probe round-trips; otherwise `"degraded"` with `database.status: "error"`. Probes are cheap (a `SELECT 1`) and safe to scrape on a 10s+ cadence.

### `GET /api/system/version`

```json
{
  "version": "0.2.0",
  "edition": "ce",
  "commit": "0c7ab99",
  "buildTimestamp": "2026-05-13T11:08:47Z"
}
```

`commit` and `buildTimestamp` are baked into the Docker image at build time via OCI labels (`org.opencontainers.image.revision`, `org.opencontainers.image.created`). When CE runs from source they fall back to `"dev"` and the process start time.

## Admin metrics endpoint (v0.2+)

`GET /api/admin/metrics` (owner-only) reports operational counters and timings used by the SettingsPage diagnostics card. v0.2 enriches the shape with command-duration percentiles, top error codes, and stale-agent counts:

```jsonc
{
  "operational": {
    "agentCommandPolls": 12034,
    "commandsDispatched": 482,
    "commandsCompleted": 461,
    "commandsFailed": 21,
    "actionPrepareTimeouts": 0,
    "actionPrepareFailures": 2,
    "oversizedCommandResultsRejected": 0
  },
  "commandDurations": {
    "p50Ms": 240, "p95Ms": 1820, "maxMs": 7400, "meanMs": 410,
    "sampleSize": 461
  },
  "topErrorCodes": [
    { "code": "ACTION_FAILED", "count": 12 },
    { "code": "ACTION_PREPARE_TIMEOUT", "count": 6 }
  ],
  "agents": {
    "total": 8,
    "online": 7,
    "offline": 1,
    "stale": 0
  }
}
```

Numeric counters use the same names the agent code emits to the in-memory metrics registry; `commandDurations.sampleSize` reflects the rolling window the backend keeps, not the full audit history.

## Versioning

The contract follows semver:

- additive fields are always backward-compatible;
- breaking changes ship in a major version with a clear migration note;
- the wire format is fixed by an OpenAPI document maintained in [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node).

→ Browse the type-level view in [Contracts](../contracts/overview).
