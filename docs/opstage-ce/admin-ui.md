# Admin UI

The Opstage CE console is a React 18 SPA built with Ant Design. It is the operator-facing surface of the control plane.

## Pages

| Page | What you do here |
| --- | --- |
| **Dashboard** | At-a-glance counts of agents, services, commands; recent audit events. |
| **Agents** | Inventory; filter by status; enable/disable/revoke; inspect heartbeat freshness. |
| **Capsule Services** | Inventory across all agents; per-service drawer with Overview / Manifest / Health / Configs / Actions / Commands / Audit tabs. |
| **Registration Tokens** | Create / revoke. The plaintext value is shown **once** at create time. |
| **Commands** | Filter, inspect, cancel pending/running commands; view results. |
| **Audit Events** | Paginated audit with filters; CSV/JSON export. |
| **Users** *(owner only)* | Create / edit / disable users; reset passwords. |
| **Settings** | Maintenance settings (with live scheduler reload), diagnostics, SQLite backup download. |

## Roles

| Role | Capabilities |
| --- | --- |
| `owner` | Everything in CE, including user management and SQLite backup download. |
| `operator` | Mutating operations on agents, registration tokens, services, commands. |
| `viewer` | Read-only. |

## Actions and Commands

When you click **Run** on a service action:

1. The console opens the action panel by issuing `GET /api/admin/capsule-services/:id/actions/:name`. This creates an `ACTION_PREPARE` command, dispatched to the agent, which returns the dynamic `inputSchema`, `initialPayload`, and current state.
2. You fill the form (auto-generated from the schema) or use the JSON override.
3. Submitting issues `POST` on the same URL, which creates an `ACTION_EXECUTE` command.
4. The command status streams into the modal until it terminates (`SUCCEEDED` / `FAILED` / `CANCELLED`).

## Internationalization

The console ships with `en-US` and `zh-CN`. The selected language is stored in `localStorage` under `opstage.language`. No session data is stored in `localStorage` or `sessionStorage`.

## Browser support

Modern evergreen browsers (Chromium, Firefox, Safari, Edge). The UI relies on session cookies + CSRF, so third-party cookie restrictions are irrelevant — Opstage is same-origin.

→ See [Configuration](./configuration) for the variables driving freshness/offline behavior surfaced in the UI.
