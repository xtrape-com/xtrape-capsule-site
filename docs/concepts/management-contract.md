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

## Versioning

The contract follows semver:

- additive fields are always backward-compatible;
- breaking changes ship in a major version with a clear migration note;
- the wire format is fixed by an OpenAPI document maintained in [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node).

→ Browse the type-level view in [Contracts](../contracts/overview).
