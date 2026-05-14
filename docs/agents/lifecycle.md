# Agent lifecycle

This page traces an Agent through its full lifecycle — from first boot to
re-registration to revocation — and shows where each state transition is
written. It complements the [Node Embedded Agent](./node-embedded-agent)
SDK reference; this page is the **conceptual** view that applies to any
SDK in any language.

## States

An Agent record in Opstage has one of five `status` values:

| Status | Meaning | Set by |
| --- | --- | --- |
| `PENDING` | Default for a freshly inserted row before the first heartbeat lands. Rare in practice — `/api/agents/register` already sets `ONLINE` on the same insert. | Schema default |
| `ONLINE` | The agent has registered and its last heartbeat is fresh (within `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS`, default 90s). | `/api/agents/register`, heartbeat handler |
| `OFFLINE` | The agent registered but has not heartbeat in the freshness window. | Maintenance sweep (default interval 60s) |
| `DISABLED` | Operator clicked **Disable** in the console. The agent token is *not* revoked — re-enabling restores access. | `POST /api/admin/agents/:id/disable` |
| `REVOKED` | Operator clicked **Revoke** in the console. All ACTIVE agent tokens for this agent are revoked at the same time. The agent cannot resume without a fresh registration. | `POST /api/admin/agents/:id/revoke` |

## States, observed externally

Operators see a derived service-level state that folds in agent freshness
([`effectiveStatus`](../concepts/management-contract#effective-service-status)),
but the **Agent row** itself is what the lifecycle is keyed on:

```text
        ┌──────────────────────────────┐
        │            PENDING           │  (rare; transient on insert)
        └───────────────┬──────────────┘
                        │
                        │ first /api/agents/register
                        ▼
        ┌──────────────────────────────┐
        │            ONLINE            │◀─── heartbeat keeps it fresh
        └──┬─────┬─────────────┬───────┘
           │     │             │
 stale     │     │ operator    │ operator
 heartbeat │     │ Disable     │ Revoke
           ▼     ▼             ▼
        ┌──────┐ ┌────────┐ ┌─────────┐
        │ OFF  │ │DISABLED│ │ REVOKED │  (REVOKED is terminal)
        │ LINE │ └───┬────┘ └─────────┘
        └──┬───┘     │
heartbeat  │         │ operator Enable
           │         ▼
           │      back to ONLINE
           └─────────────────►
            heartbeat resumes
```

## Step by step

### 1. Operator creates a registration token

In the console: **Registration Tokens → Create**. A one-time
`opstage_reg_...` string is shown once; only its SHA-256 hash is stored.
Tokens have an optional `expiresAt` and become `USED` on the first
successful `/api/agents/register` call.

### 2. Agent starts with the registration token

The Agent SDK POSTs to `/api/agents/register` with:

- the registration token,
- an agent identity (`code`, optional `name`, `mode: "embedded"`, optional
  `runtime`),
- an optional initial service manifest.

If the token is invalid, expired, revoked, or already used, the call
fails with `401 REGISTRATION_TOKEN_INVALID`. The SDK surfaces this as a
[`RegistrationError`](./node-embedded-agent#typed-errors); the agent
cannot proceed without a fresh registration token.

### 3. Backend issues an agent token

On success the backend:

- creates the agent row (or reuses an existing row with the same
  `workspaceId + code`) and sets `status = ONLINE`,
- generates an agent token `opstage_agent_...`, hashes it, stores
  *only the hash* in `agent_tokens`,
- **if the agent already existed**, revokes any previously ACTIVE agent
  tokens for that agent and writes an `agent.token.rotated` audit event
  with `{ revokedTokens: N }`,
- marks the registration token as `USED`,
- returns the plaintext agent token to the caller **exactly once**.

The SDK persists the agent token to its token store (`tokenStore.file`
by default; `./data/agent-token.txt`). The registration token is not
needed again after this point.

### 4. Agent heartbeats

Every `intervals.heartbeatMs` (default 30s) the SDK POSTs to
`/api/agents/:id/heartbeat` with the agent token as a Bearer credential.
The backend:

- updates `lastHeartbeatAt` unconditionally,
- updates `status` to `ONLINE` only on the OFFLINE → ONLINE transition
  (v0.2+),
- writes an `agent.heartbeat.received` audit event **at most once per
  agent per 5 minutes** (sampled).

### 5. Agent reports its services

Every `intervals.serviceReportMs` (default 60s) the SDK POSTs to
`/api/agents/:id/services/report`. Each reported service is upserted by
`(workspaceId, code)`; the `agentId` column is updated to the reporting
agent. This is what lets a service migrate between agents without losing
its identity in audit and history.

### 6. Agent polls for commands

Every `intervals.commandPollMs` (default 5s) the SDK polls
`/api/agents/:id/commands`. The backend returns up to `limit` PENDING
commands; each one is atomically flipped to `RUNNING` and dispatched. If
two pollers race, the second sees `changes === 0` on its UPDATE and the
command is delivered only once (v0.2 race fix).

### 7. Agent reports command results

The SDK calls each registered action handler and POSTs the result to
`/api/agents/:id/commands/:cmdId/result`. On failure, the backend lifts
the most-actionable fields (`error.code`, `error.message`) onto the
`commands` row directly (v0.2+) so the failure reason is visible in the
list view without joining `command_results`. The full body still lands in
`command_results.errorJson`.

## What happens when things go wrong

| Symptom | Likely cause | Recovery |
| --- | --- | --- |
| `REGISTRATION_TOKEN_INVALID` on first start | Token expired, revoked, already used, or never existed. | Operator mints a fresh registration token; agent restarts with it. |
| `UNAUTHORIZED` on subsequent call | The agent token was revoked (explicitly, or implicitly by re-registration). | Re-register the agent. |
| `AGENT_DISABLED` | Operator clicked Disable. | Operator clicks Enable; the agent's existing token resumes working. |
| `AGENT_REVOKED` | Operator clicked Revoke. **All tokens already revoked.** | Re-register with a fresh registration token. |
| Agent silent → `OFFLINE` | Network outage, process crash, host shutdown. | Restart the agent; the cached agent token still works (unless revoked). The next heartbeat flips it back to `ONLINE`. |

## Auditing the lifecycle

Each transition is recorded:

| Audit action | When |
| --- | --- |
| `registration_token.consumed` | After `/api/agents/register` succeeds |
| `agent.registered` | After the agent row is upserted |
| `agent.token.rotated` (v0.2+) | When re-registration revokes prior agent tokens |
| `agent.heartbeat.received` | Sampled, ≤ 1 per agent per 5 minutes |
| `agent.disabled` / `agent.enabled` | Operator Disable / Enable |
| `agent.revoked` | Operator Revoke |
| `system.agent.offline` | Maintenance sweep flipped agents to `OFFLINE` |

See [Audit Events](https://xtrape-com.github.io/xtrape-capsule-site/security/overview#audit)
for the full set.

→ Continue with [Agent Registration](../concepts/agent-registration) for
the wire-level view, or [Health Reporting](./health-reporting) for what
the agent should report on every heartbeat.
