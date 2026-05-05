# Glossary

**Action**
A named, operator-callable operation declared by a Capsule Service. Triggered from Opstage, executed by the Agent. See [Action Model](./agents/action-model).

**Agent**
The piece of software that speaks the Capsule Management Contract to Opstage on behalf of one or more Capsule Services. See [Agent](./concepts/agent).

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

**Workspace**
The single-tenant scope of Opstage CE. All resources (agents, services, audit) belong to the default workspace. EE will introduce multi-tenant org/workspace separation.
