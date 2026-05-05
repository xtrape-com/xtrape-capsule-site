# Opstage CE Overview

Opstage CE is the Community Edition of Xtrape Capsule. It is the **same control plane** described in [What is Opstage?](../concepts/opstage), packaged for self-hosting in a single container.

## What CE includes

- Fastify backend
- React 18 + Ant Design admin console
- SQLite via Prisma (single-node)
- Token-based agent identity (hash-only storage)
- Inventory: Agents, Capsule Services, Audit Events, Commands
- Health, configs, actions, command lifecycle, and audit
- RBAC: owner / operator / viewer
- Maintenance scheduler (offline detection, expiry, audit pruning)
- Metrics, diagnostics, audit CSV/JSON export, SQLite backup download

## What CE intentionally does **not** include

These belong to EE / Cloud and are out of scope for v0.x CE:

- HA / clustering
- SSO, SCIM, multi-tenant org model
- Secret Vault integration
- Centralized log shipping
- Org-wide cross-Opstage rollups

If you need any of those today, see [Editions](../editions/ce).

## Topology

```text
┌────────────────────┐         ┌────────────────────┐
│   Opstage UI       │  ──→    │   Opstage Backend  │
│   (React)          │         │   (Fastify+SQLite) │
└────────────────────┘         └────────────────────┘
                                          ▲
                                          │ outbound
                              ┌───────────┴────────────┐
                              │   Capsule Services     │
                              │   with embedded Agent  │
                              └────────────────────────┘
```

The backend serves both the API (`/api`) and the static UI on a single HTTP port.

## Sizing

CE is comfortable with:

- a few hundred agents,
- a few thousand Capsule Services,
- millions of audit events (with retention pruning).

Beyond that, EE/Cloud are the right answer.

## Next

- [Docker Deployment](./docker-deployment)
- [Configuration](./configuration)
- [Admin UI](./admin-ui)
- [Backup and Upgrade](./backup-and-upgrade)
