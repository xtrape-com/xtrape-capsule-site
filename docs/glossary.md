# Glossary

**Action**
A named, operator-callable operation declared by a Capsule Service. Triggered from Opstage, executed by the Agent. See [Action Model](./agents/action-model).

**Action Prepare**
The first phase of action execution. The console issues `GET .../actions/:name`, which creates an `ACTION_PREPARE` command. The Agent returns the dynamic `inputSchema`, `initialPayload`, and current state used to render the form.

**Action Execute**
The second phase of action execution. The console issues `POST .../actions/:name` with a validated payload, which creates an `ACTION_EXECUTE` command. The Agent runs the handler and reports the result.

**Agent**
The piece of software that speaks the Capsule Management Contract to Opstage on behalf of one or more Capsule Services. See [Agent](./concepts/agent).

**Embedded Agent**
An Agent imported as a library directly into a service process (current first-class form for Node.js).

**Sidecar Agent**
An Agent running as a separate process alongside a non-Node service.

**External Agent (Standalone)**
An Agent process that owns multiple services from outside (e.g. one agent driving a fleet of Playwright workers).

**Agent token**
The long-lived credential issued at registration. Stored on the backend as a SHA-256 hash. Used as a bearer token on every authenticated agent call.

**Audit event**
A record of a meaningful operator or system action — login, registration, command lifecycle, maintenance sweep, backup. Pruned per `OPSTAGE_AUDIT_RETENTION_DAYS`.

**Capsule Management Contract**
The wire-level agreement between an Agent and Opstage. See [Management Contract](./concepts/management-contract).

**Capsule Service**
A lightweight, self-contained service unit that exposes the Capsule governance surface — registration, health, configs, actions, audit. See [Capsule Service](./concepts/capsule-service).

**CE / EE / Cloud**
The three editions of Opstage. CE is open-source self-hosted (current). EE is the future commercial self-hosted edition. Cloud is the future hosted SaaS. See [Editions](./editions/ce).

**Command**
A unit of work dispatched from Opstage to an Agent — typically the execute phase of an action, or a system command (e.g. `ACTION_PREPARE`). Has a lifecycle: `PENDING → RUNNING → SUCCEEDED / FAILED / CANCELLED / EXPIRED`.

**Control plane**
The piece of Opstage that holds inventory, identity, state, and audit — the UI + Backend. Operators interact with it; agents talk to it.

**Data plane**
The pieces that actually do work — the Capsule Services and their Agents. The control plane never executes service work itself.

**CSRF token**
A short-lived token the Admin UI sends as `X-CSRF-Token` on non-GET requests. Held in memory by the React app; never persisted to `localStorage`/`sessionStorage`.

**Effective status**
The server-computed state of a Capsule Service, combining agent online/offline, report freshness, and reported health. One of `HEALTHY / UNHEALTHY / STALE / OFFLINE / UNKNOWN`.

**Heartbeat**
A periodic outbound signal from Agent to Opstage proving the agent is alive. Default cadence ~30s; the offline threshold defaults to 90s.

**Manifest**
The identity record a Capsule Service publishes — `code`, `name`, `version`, action catalog, config catalog. See [Manifest](./contracts/manifest).

**Opstage**
The control plane: UI + Backend. The single pane of glass operators interact with. See [Opstage](./concepts/opstage).

**Registration token**
A short-lived, single-use credential created by an operator and used by an Agent on first start to obtain an agent token. Stored as a SHA-256 hash.

**Reported status**
The latest health value the service itself reported (`HEALTHY` / `UNHEALTHY` / `UNKNOWN`). Distinct from the server-computed `effectiveStatus`, which folds in agent state and freshness.

**Service report**
The payload an agent sends with `POST /api/agents/services` — the manifest, current health, and current configs of the Capsule Services it owns. Sent on register and on change.

**State freshness**
How recently a piece of state (heartbeat, service report, health) was updated. Drives transitions to `STALE` and `OFFLINE` based on configurable thresholds.

**Workspace**
The single-tenant scope of Opstage CE. All resources (agents, services, audit) belong to the default workspace. EE will introduce multi-tenant org/workspace separation.
