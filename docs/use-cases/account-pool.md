# Use Case: Account Pool

## Problem

Many AI products own a pool of accounts (vendor accounts, mailbox accounts, exchange accounts). Each account has:

- a credential (password, cookie, refresh token),
- a state (logged in, locked out, in cool-down),
- a "who's using it" claim,
- a "last used at" timestamp.

Operators need to know which accounts are healthy, retire bad ones, and add new ones — without exposing the credentials in any central admin panel.

## How Capsule helps

Run the pool as a Capsule Service:

- Health: count of healthy/in-cooldown/locked accounts.
- Configs: pool size, cool-down policy, account label list — **never the secrets**.
- Actions: `addAccount`, `disableAccount`, `forceRefreshSession`, `clearCooldown`.

The credentials never leave the pool service. Opstage only sees labels and counts.

## Typical Architecture

```text
[ AI workers ] → [ Account Pool service ] → [ Vendor accounts ]
                            │
                     Agent (embedded)
                            │
                            ▼
                     Opstage Backend
```

## What Opstage can show

- Pool size and health buckets.
- Per-account label and last state (without credentials).
- Audit of every add/disable/refresh.

## What Opstage can do

- Trigger `disableAccount` for a label.
- Add a new account with credentials submitted via an action payload — those credentials flow to the pool service and are not persisted by Opstage.
- Inspect command results to confirm a refresh succeeded.

## CE scope

- Pool size and health buckets visible at a glance.
- Per-account label and last state — credentials stay in the pool service.
- Operator actions: `addAccount`, `disableAccount`, `forceRefreshSession`, `clearCooldown`.
- Audit of every add/disable/refresh.

## Future EE / Cloud enhancements

- Secret Vault integration so account credentials are fetched from a vault, never seen by Opstage at all.
- Cross-pool views and quotas (e.g. minimum healthy count per region).
- Hosted Cloud Opstage with strong tenant isolation.

## Next steps

- [Token Model](../security/token-model) — why Opstage doesn't store your account secrets.
- [Action Model](../agents/action-model) — how to model `addAccount` safely.
