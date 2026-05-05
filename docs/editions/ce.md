# Community Edition (CE)

> **Status: Public Preview · v0.1**

CE is the **open-source self-hosted** edition of Opstage. It is the right starting point for individuals, small teams, and private-deployment use cases.

## What CE includes

- Fastify + TypeScript backend
- React 18 + Ant Design admin console
- SQLite via Prisma (single-node)
- Node Embedded Agent SDK
- Agent registration, hash-only token storage
- Inventory: Agents, Capsule Services, Audit Events, Commands
- Health, configs, actions, command lifecycle, and audit
- RBAC: owner / operator / viewer
- Maintenance scheduler (offline detection, expiry, audit pruning)
- Metrics, diagnostics, audit CSV/JSON export, SQLite backup download
- Docker single-container and Compose deployment

## Who CE is for

- An individual developer running a few Capsule Services on a laptop or VM.
- A small team operating a private fleet (CAPI bridges, Playwright workers, account pools).
- Anyone evaluating Capsule before committing to EE/Cloud.

## Limitations (by design)

CE is **single-node**. Running multiple backend containers against the same SQLite file is unsupported. CE also intentionally does not include:

- HA / clustering
- SSO, SCIM, multi-tenant org model
- Secret Vault integration
- Centralized log shipping
- Org-wide cross-Opstage rollups

If you need any of those, see [EE](./ee) or [Cloud](./cloud).

## License

Apache-2.0. CE is suitable for both internal and commercial use.

## Repositories

- [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce)
- [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
- [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node)

## Get started

→ [Quick Start](../getting-started/quick-start)
