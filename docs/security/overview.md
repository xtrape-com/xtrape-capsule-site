# Security Overview

This page is a tour of how Opstage CE handles identity, secrets, and the surface
area between operators, services, and the control plane.

## Two identities

Opstage has two kinds of identity:

| Identity       | Used by               | How it authenticates                                          |
| -------------- | --------------------- | ------------------------------------------------------------- |
| **Admin user** | Humans in the console | Username + password → server-side session cookie + CSRF token |
| **Agent**      | Capsule Services      | Bearer **agent token** issued at registration                 |

There is no other authentication path. The console **never** uses an agent
token; agents **never** use admin credentials.

## Token storage

The backend stores **only SHA-256 hashes** of:

- registration tokens (one-time, short-lived),
- agent tokens (long-lived, revocable).

Plaintext is generated, returned to the caller **once**, and never stored. A
database leak does not yield usable credentials.

→ Full details in [Token Model](./token-model).

## Network model

- Agents make **outbound** connections only. The backend never opens a socket to
  an agent.
- The console is same-origin with the API. Cookies and CSRF tokens never cross
  origins.
- A reverse proxy in front of Opstage should terminate TLS, preserve cookies,
  and forward `X-CSRF-Token`.

## What Opstage does not store

- Your vendor API keys.
- Your account passwords or cookies.
- Anything your service explicitly excludes from its
  [config reporting](../agents/config-reporting).

If your service does not report a secret, Opstage does not see it. Period.

## Audit

Every meaningful event is recorded:

- registration token creation / revocation / consumption,
- agent registration / heartbeat (sampled) / disable / revoke,
- service report changes,
- command lifecycle (created / dispatched / completed / failed / cancelled /
  expired),
- session login / logout,
- maintenance sweeps,
- backups.

Audit can be exported (CSV / JSON) and is pruned per
`OPSTAGE_AUDIT_RETENTION_DAYS`.

## RBAC

CE includes three roles:

| Role       | Capabilities                                                         |
| ---------- | -------------------------------------------------------------------- |
| `owner`    | Everything, including user management and SQLite backup download.    |
| `operator` | Mutating actions on agents, registration tokens, services, commands. |
| `viewer`   | Read-only.                                                           |

## Safe-deployment checklist

Before exposing Opstage CE beyond `localhost`:

- [ ] Set a strong `OPSTAGE_SESSION_SECRET` (long random string, rotated
      periodically).
- [ ] Change the bootstrap admin password from the `.env.example` default.
- [ ] Put Opstage behind HTTPS — terminate TLS at a reverse proxy and forward
      `X-CSRF-Token` and the session cookie.
- [ ] **Do not expose Opstage to the public internet without an additional
      layer** (VPN, IP allow-list, SSO at the proxy). CE v0.1 has no built-in IP
      allow-list, no rate limit on the admin login, no SSO.
- [ ] Restrict the agent token file's permissions on every agent host
      (`chmod 600`).
- [ ] Keep registration tokens out of long-lived environment variables — pass
      them on first start only.
- [ ] Treat `command` and `action` invocation surface as an authority boundary:
      every action your service exposes is something an operator can trigger
      remotely. Validate payloads server-side, model destructive actions with
      `requiresConfirmation`, and audit the result.
- [ ] Never report secrets in [config reporting](../agents/config-reporting) —
      surface "configured / not configured", not the value.
- [ ] Have a documented response plan for token leaks (revoke from the console,
      re-register the agent).

For the future Cloud edition: customer-side secrets remain at the customer.
Cloud holds inventory metadata, coarse health, declared action catalogs, and
audit only.

→ Continue with [Token Model](./token-model) and
[Agent Security](./agent-security).
