# Token Model

Opstage uses two token types and one cookie. Understanding the difference is the foundation of running Opstage safely.

## The three credentials

| Credential | Used by | Lifetime | Storage on backend |
| --- | --- | --- | --- |
| **Registration token** (`opstage_reg_...`) | An Agent during first start | Short, single-use (configurable) | SHA-256 hash only |
| **Agent token** (`opstage_agent_...`) | An Agent for every subsequent call | Long-lived, revocable | SHA-256 hash only |
| **Session cookie** | The Admin UI | Default 8h, sliding | Server-side session record |

## Registration token

A short-lived, single-use credential the operator hands to a new agent.

- Generated in the Opstage UI; **the plaintext value is shown exactly once**.
- Stored in the database **only as a SHA-256 hash**.
- Has an optional `expiresAt`. v0.1 treats every registration token as **single-use**: the first successful register call marks it `USED` and a second register attempt with the same token fails.
- Can be revoked at any time from the UI; revoked tokens fail with `REGISTRATION_TOKEN_REVOKED`.
- Used by the agent **once**, against `POST /api/agents/register`, to obtain an agent token.

## Agent token

A long-lived, revocable credential that identifies a specific Agent install.

- Issued only as the result of a successful registration.
- Returned to the agent **once** in the register response — never retrievable again.
- Stored on the backend **only as a SHA-256 hash**.
- Used as `Authorization: Bearer ...` on every authenticated agent call (heartbeat, report, poll, command result).
- Can be revoked from the UI; revoked tokens fail with `UNAUTHORIZED`.
- An Agent in `DISABLED` state has its token rejected with `AGENT_DISABLED`; re-enabling the Agent restores access.

## Session cookie (Admin UI)

A standard server-side session, plus a CSRF token for non-GET requests.

- The session cookie is `HttpOnly` and `Secure` (when served over HTTPS).
- The CSRF token is held in memory by the React app and sent as `X-CSRF-Token`.
- The session and CSRF token come from the server on every page load via `GET /api/admin/auth/me`.
- The session is **never** persisted to `localStorage` or `sessionStorage`.

## Token lifecycle

```text
Registration token   ──register──▶   Agent token   ──heartbeat / report / poll──▶
       │                                  │
       └─ revoke / expire                  └─ revoke / disable
```

## Why hashes only?

The Backend never needs the plaintext after issuance. By hashing:

- a database leak does not yield usable credentials;
- the system can verify tokens but cannot impersonate other systems with them;
- there is no surface for "forgot my token; can you re-show it" — the only path is to issue a new one, which forces a clean rotation.

## Why outbound-only Agent connections?

Agents always **call** the Backend; the Backend never opens a socket to the Agent. This means:

- Capsule Services can run behind NAT, on laptops, or in customer environments without inbound exposure.
- Opstage does not require credentials to reach the customer's network.
- A Cloud-hosted Opstage can govern self-hosted Agents without a VPN.

## What to do if a token leaks

| Token | Action |
| --- | --- |
| Registration token | Revoke from the UI immediately. If it was already used, also revoke the resulting agent token. |
| Agent token | Revoke from the UI; the Agent must be re-registered. |
| Admin password | Change it from the Users page; existing sessions remain valid until the user logs out. To force-logout, rotate `OPSTAGE_SESSION_SECRET` (invalidates all sessions). |

## How Cloud will avoid storing customer secrets

The future Opstage Cloud will hold:

- inventory metadata (agent identity, service code, version),
- coarse health and audit,
- declared action catalogs.

It will **not** hold customer-side secrets such as upstream API keys, cookies, or account credentials. Those continue to live next to the Capsule Service. The Agent fetches its own secrets from a customer-controlled source; Opstage only sees what the service chooses to report.
