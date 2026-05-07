# Agent Registration

Agents are not provisioned ahead of time. They **register themselves** to
Opstage on first start, using a one-time **registration token** that the
administrator created in advance.

## Why "Agent registration" instead of "service provisioning"?

Capsule Services are diverse and often dynamic — a worker can be spun up per
task, an account-pool worker can run on a laptop, a Cloud customer's agent runs
inside the customer's environment. Pre-provisioning every service into a central
registry doesn't scale.

Instead:

- The administrator creates **registration tokens**: short-lived, single-use
  credentials.
- The Agent uses a registration token **once** to bootstrap.
- Opstage issues a long-lived **agent token** in exchange.
- The agent stores the agent token locally and uses it for every subsequent
  call.

This means the **Agent** is the active party. The Backend never needs inbound
access to the service.

![Agent registration flow](/diagrams/agent-registration-flow.svg)

## End-to-end flow

```text
   Admin creates registration token
                 │
                 ▼
   Agent starts with registration token
                 │
                 ▼
   Agent registers to Backend
                 │
                 ▼
   Backend issues agent token
                 │
                 ▼
   Agent sends heartbeats and service reports
                 │
                 ▼
   Backend displays Agent and Capsule Service state
                 │
                 ▼
   Operator triggers an action in the UI
                 │
                 ▼
   Backend creates a command
                 │
                 ▼
   Agent polls and executes the command
                 │
                 ▼
   Agent reports result; Backend writes audit
```

## Step by step

1. **Operator creates a registration token.** In Opstage UI → _Registration
   Tokens_ → _Create_. The one-time token (`opstage_reg_...`) is shown **once**.
   Only its hash is persisted.

2. **Agent boots with the registration token.** Typically passed as
   `OPSTAGE_REGISTRATION_TOKEN`. The agent posts it to
   `POST /api/agents/register` together with its agent identity (`code`,
   `name`, `runtime`) and the initial Capsule Service manifest. Hostname and
   SDK version are planned for v0.2 and are not reported in v0.1.

3. **Backend validates the token.** Looks up the token by hash, checks
   `expiresAt`, `revokedAt`, and remaining uses. If invalid → `401`.

4. **Backend issues an agent token.** A new agent record is created. A fresh
   agent token (`opstage_agent_...`) is generated, hashed, and stored. The
   plaintext token is returned to the agent **once**.

5. **Agent persists the agent token.** Saved to a token file (e.g.
   `./data/agent-token.json`). All subsequent calls (heartbeat, report, poll)
   use this token.

6. **Agent heartbeats.** Every ~30s the agent sends a heartbeat. If the backend
   hasn't seen a heartbeat in `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS` (default
   90), the agent is marked `OFFLINE`.

7. **Agent reports services.** On register and on change, the agent publishes
   its Capsule Service manifests (code, name, version, declared actions, health,
   configs).

8. **Backend computes effectiveStatus per service.** `HEALTHY` / `UNHEALTHY` /
   `STALE` / `OFFLINE` based on agent state plus last-report freshness.

Agent health providers return protocol-level `HealthStatus` values: `UP`,
`DEGRADED`, `DOWN`, `UNKNOWN`.

Opstage may derive an operator-facing `effectiveStatus`: `HEALTHY`, `UNHEALTHY`,
`STALE`, `OFFLINE`.

## What happens when things go wrong

- **Registration token expired** → register call fails with
  `REGISTRATION_TOKEN_EXPIRED`.
- **Registration token revoked** → register call fails with
  `REGISTRATION_TOKEN_REVOKED`.
- **Agent token revoked** → all authenticated calls fail with `UNAUTHORIZED`;
  the agent must be re-registered.
- **Agent disabled** → calls fail with `AGENT_DISABLED`; operator can re-enable
  from the console.
- **Agent silent for too long** → marked `OFFLINE`; its services move to
  `STALE`.

## Security properties

- The Backend stores **only hashes** of registration tokens and agent tokens.
- The Agent always initiates the connection; the Backend never opens a socket to
  the agent.
- A leaked agent token can be revoked from the console; the agent must then
  re-register.

→ See [Token Model](../security/token-model) for the full security story.
