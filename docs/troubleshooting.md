# Troubleshooting

Common failures and how to diagnose them. Grouped by where the symptom
shows up first.

## Opstage CE won't start

### `Invalid environment: { "OPSTAGE_SESSION_SECRET": [...] }`

```text
Error: Invalid environment: {"OPSTAGE_SESSION_SECRET":["OPSTAGE_SESSION_SECRET is required (>=32 chars)"]}
```

The session secret is mandatory from v0.1.0-public-review.1 onward. Set it
in `.env`:

```bash
OPSTAGE_SESSION_SECRET=$(openssl rand -base64 48)
```

The shipped `.env.example` placeholder passes the length check but is
publicly known — replace it before exposing Opstage to anything beyond
`localhost`. See [Security Overview](./security/overview).

### `NODE_MODULE_VERSION X. This version of Node.js requires NODE_MODULE_VERSION Y`

The native `better-sqlite3` binding was built for a different Node ABI.
Force a rebuild against your current Node:

```bash
pnpm install --force
# or:
pnpm rebuild better-sqlite3
```

This typically happens when switching Node major versions on the same
checkout.

### Container restarts in a loop

```bash
docker logs -f opstage-ce
```

Most common causes (in order):

1. Missing or too-short `OPSTAGE_SESSION_SECRET`.
2. SQLite file in `/app/data` is owned by a different UID — fix the
   bind-mount permissions.
3. The container was upgraded to a newer minor with an unrun migration
   while `/app/data` was held open by another container. Stop both, run
   the new container once to migrate, then resume.

## Admin UI

### Login spins forever / cookies missing

Symptoms: login form submits but the page never advances. DevTools shows
no `opstage_session` cookie.

- The browser is rejecting a `Secure` cookie served over plain HTTP. If
  you're testing without TLS, set `NODE_ENV=development` (or `test`) on
  the backend so the cookie's `Secure` flag is dropped.
- A reverse proxy is stripping `Set-Cookie`. Forward both `Set-Cookie`
  and `X-CSRF-Token` headers.

### All requests fail with `403 CSRF_INVALID` after sitting idle

The CSRF token expired alongside the session. The Admin UI auto-refreshes
once — if you still see the error, the session itself has expired.
Log out and log back in. (Tracked in
[xtrape-capsule-ce#13](https://github.com/xtrape-com/xtrape-capsule-ce/issues/13)
for the 401 → /login auto-redirect.)

### Agent appears `OFFLINE` even though the agent process is running

Check, in order:

1. **Heartbeat path.** `curl -i $OPSTAGE_BACKEND_URL/api/agents/<agent-id>/heartbeat` with the agent's Bearer token. If you get `401`, the agent token is wrong or has been rotated by a re-register.
2. **Clock drift.** `OPSTAGE_AGENT_OFFLINE_THRESHOLD_SECONDS` (default 90) compares against `lastHeartbeatAt`. If the backend's clock is far ahead of wall-clock (containers without NTP), all agents look stale.
3. **Maintenance sweep timing.** The sweep runs at most every `OPSTAGE_MAINTENANCE_INTERVAL_SECONDS` (default 60s). From v0.2 the service `effectiveStatus` is computed at query time, so the UI catches up immediately; for v0.1 it can lag one sweep.

## Agent SDK (`@xtrape/capsule-agent-node`)

### `REGISTRATION_TOKEN_INVALID` on first start

The registration token is single-use and short-lived.

- The token has already been consumed by an earlier successful start.
- The token is expired (`expiresInSeconds` at creation time).
- The token was revoked from the Opstage console.

Create a fresh token in the console and restart the agent with it.

### `ECONNREFUSED` / cannot reach backend

- `OPSTAGE_BACKEND_URL` is unreachable from inside the agent process.
  `http://localhost:8080` only works if the agent runs on the same host
  as Opstage. From a container or a remote host, point at the public URL.
- Corporate proxy: set `HTTPS_PROXY` and `NO_PROXY` env vars; the SDK's
  `undici` fetch dispatcher respects them.

### Token file rejected on second start (`401 UNAUTHORIZED`)

- File permissions: agent process must be able to read `tokenStore.file`.
  Run `chmod 600` and check the file owner.
- The agent was revoked, disabled, or re-registered from another host.
  Inspect the agent's row in the Opstage console.
- File contents corrupted. Delete it and re-register with a fresh
  registration token.

### Heartbeats succeed but action results never arrive

- The action `name` registered with `agent.action({ name: ... })` must
  match the `actionName` the backend dispatches. Mismatch produces an
  `ACTION_HANDLER_NOT_FOUND` result.
- Two `CapsuleAgent` instances with the same agent code on the same host
  will fight over command polling. Run only one.
- `intervals.commandPollMs` (default 5000) was set too high in testing.

## Capsule Service action execution

### Action stuck in `PENDING` forever

The command was created in the database but no agent has polled for it.
Likely causes:

- The owning agent is `OFFLINE` (heartbeat stopped after the command was
  created).
- The command has an `expiresAt` in the past — the maintenance sweep
  will flip it to `EXPIRED` on the next pass.
- The agent process is running but firewalled outbound from
  `GET /api/agents/<id>/commands`.

### Action returns `COMMAND_ALREADY_COMPLETED` when retried

The command transitioned to a terminal state (`SUCCEEDED`, `FAILED`,
`EXPIRED`, `CANCELLED`) between the moment the operator clicked "retry"
and the moment the new command was queued. Retry from the command list
view, not from a stale detail view. From v0.2, retry is only valid for
`ACTION_EXECUTE` commands — `ACTION_PREPARE` retries are rejected with
`COMMAND_NOT_RETRYABLE`.

### Action result is missing the `generatedKey` field after a refresh

By design. Action results may include a one-time secret (e.g. a freshly
generated API key) that lives in the backend's in-process cache for 5
minutes and is delivered to **the first read** of the command detail.
Subsequent reads see only the redacted value persisted in SQLite. See
[ADR 0001](https://github.com/xtrape-com/xtrape-capsule-ce/blob/main/docs/adr/0001-ephemeral-action-secrets.md).

## Audit

### Audit event `metadata` field shows `"[REDACTED]"` for a numeric value

Should not happen as of v0.2 (the audit redactor moved from key-based to
value-based; field names like `tokenCount` survive). If you see this on
v0.1, you've hit the original bug — upgrade or rename the field.

### `agent.heartbeat.received` not appearing in audit

By design — heartbeats are sampled at one event per agent per 5 minutes
(`HEARTBEAT_AUDIT_INTERVAL_MS`). The first heartbeat after a backend
restart produces an audit event regardless.

## Reporting an issue

If your symptom isn't above, please file an issue on the relevant repo:

- CE backend / UI / deployment → [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce)
- Agent SDK → [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
- Contracts → [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node)
- Docs / site → [`xtrape-capsule-site`](https://github.com/xtrape-com/xtrape-capsule-site)

Include: CE version, Agent SDK version, Contracts version, Node version,
the failing request method + URL, and the relevant logs with secrets
redacted.
