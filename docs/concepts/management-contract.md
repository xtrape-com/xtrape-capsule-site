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
register   →  { hostname, sdkVersion, services[] }
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

## Versioning

The contract follows semver:

- additive fields are always backward-compatible;
- breaking changes ship in a major version with a clear migration note;
- the wire format is fixed by an OpenAPI document maintained in [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node).

→ Browse the type-level view in [Contracts](../contracts/overview).
