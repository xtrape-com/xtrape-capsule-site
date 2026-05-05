# Agent

An **Agent** is the piece of software that speaks the [Capsule Management Contract](./management-contract) to the Opstage backend on behalf of one or more Capsule Services.

## Where the Agent lives

Three deployment shapes are supported:

- **Embedded** — imported as a library into a Node.js service (current first-class form). See [Node Embedded Agent](../agents/node-embedded-agent).
- **Sidecar** — a separate process running alongside a non-Node service.
- **Standalone** — a long-running process owning multiple services (e.g. a fleet of Playwright workers driven by one agent).

## What the Agent does

- **Registers** itself with Opstage using a one-time registration token (see [Agent Registration](./agent-registration)).
- **Heartbeats** on a fixed cadence so Opstage can compute online/offline.
- **Reports** Capsule Services: manifest, version, declared actions, health, configs.
- **Polls** for commands (long-poll) and dispatches them to action handlers.
- **Reports command results** — success or failure with details.

## Agent identity

Every running agent is a distinct entity in Opstage with:

- a stable `agentId`,
- an agent token (issued at registration),
- a hostname and SDK version (reported on register),
- a status: `ONLINE`, `OFFLINE`, `DISABLED`, or `REVOKED`.

A single host can run multiple agents (e.g. one per service group); they each get their own `agentId`.

## Failure semantics

| Situation | Effect |
| --- | --- |
| Agent process exits | After `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS` (default 90), the agent is marked `OFFLINE`; its services move to `STALE`. |
| Agent token revoked | Subsequent calls fail with `UNAUTHORIZED`. The agent must be re-registered. |
| Agent disabled by an operator | Calls fail with `AGENT_DISABLED`. Re-enabling restores access. |
| Network partition | The agent retries with backoff; on reconnect, it resumes heartbeats and re-reports services. |

→ Continue with [Agent Registration](./agent-registration) and [Management Contract](./management-contract).
