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

All admin / system JSON endpoints below return the standard
`{ "success": true, "data": { ... } }` envelope. Schemas show only the
`data` payload.

### `GET /api/system/health`

```jsonc
{
  "status": "UP",            // "UP" | "DEGRADED" | "DOWN"
  "timestamp": "2026-05-14T12:34:56Z",
  "version": "0.2.0",
  "edition": "ce",
  "database": {
    "status": "UP",          // "UP" | "DEGRADED" | "DOWN"
    "kind": "sqlite",
    "latencyMs": 1
  },
  "uptimeSeconds": 123456
}
```

`status` follows `database.status`: the SQLite probe round-trips fast → `UP`; over 250 ms → `DEGRADED`; throws → `DOWN`. Probes are cheap (a `SELECT 1`) and safe to scrape on a 10s+ cadence.

### `GET /api/system/version`

```jsonc
{
  "version": "0.2.0",        // build-injected OPSTAGE_VERSION, or "0.2.0-dev" in pnpm dev
  "edition": "ce",
  "commit": "0c7ab99...",    // OPSTAGE_COMMIT; undefined in pnpm dev
  "buildTime": "2026-05-13T11:08:47Z"  // OPSTAGE_BUILD_TIME; undefined in pnpm dev
}
```

`commit` and `buildTime` are baked into the Docker image at build time via OCI labels (`org.opencontainers.image.revision`, `org.opencontainers.image.created`). When CE runs from source they pass through as `undefined`, and `version` falls back to `"0.2.0-dev"` so a local dev box is never mistaken for a tagged release.

## Admin metrics endpoint (v0.2+)

`GET /api/admin/metrics` (owner-only) reports operational counters and timings used by the SettingsPage diagnostics card. v0.2 enriches the shape with command-duration percentiles, top error codes, and a stale-agent counter:

```jsonc
{
  "operational": {
    "agentCommandPolls": 12034,
    "commandsDispatched": 482,
    "commandsCompleted": 461,
    "commandsFailed": 21,
    "actionPrepareRequested": 480,
    "actionPrepareTimeouts": 0,
    "actionPrepareFailures": 2,
    "oversizedCommandResultsRejected": 0,
    "staleOnlineAgents": 0
  },
  "commandDurations": {
    "sampleSize": 461,        // rolling window of the last 1000 completed commands
    "p50Ms": 240,
    "p95Ms": 1820,
    "maxMs": 7400,
    "meanMs": 410
  },
  "topCommandErrors": [
    { "code": "ACTION_FAILED", "count": 12 },
    { "code": "ACTION_PREPARE_TIMEOUT", "count": 6 }
  ],
  "byStatus": {
    "agents":             { "ONLINE": 7, "OFFLINE": 1 },
    "capsuleServices":    { "HEALTHY": 5, "UNHEALTHY": 1 },
    "registrationTokens": { "ACTIVE": 1, "USED": 4 },
    "commands":           { "SUCCEEDED": 461, "FAILED": 21 }
  },
  "totals": {
    "users": 3, "agents": 8, "capsuleServices": 6,
    "registrationTokens": 5, "commands": 503, "auditEvents": 9821
  },
  "workspace": { /* workspace identity */ }
}
```

`commandDurations.sampleSize` reflects a bounded window (the last 1000 commands with both `startedAt` and `completedAt`), not the full audit history — the endpoint is meant to stay cheap on long-running CE instances. `operational.staleOnlineAgents` counts agents whose row says `ONLINE` but whose `lastHeartbeatAt` is older than `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS`; if non-zero, the maintenance sweep hasn't run recently. `byStatus.agents` carries the underlying row status (`ONLINE` / `OFFLINE` / etc.); operator-facing `effectiveStatus` for individual services is computed at query time on the services endpoint, not summarised here.

## Versioning

The contract follows semver:

- additive fields are always backward-compatible;
- breaking changes ship in a major version with a clear migration note;
- the wire format is fixed by an OpenAPI document maintained in [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node).

→ Browse the type-level view in [Contracts](../contracts/overview).
