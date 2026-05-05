# Roadmap

Xtrape Capsule is shipped in incremental milestones. We avoid promising specific dates; status labels reflect the **current intent**.

| Status | Meaning |
| --- | --- |
| **Current** | Available today |
| **Planned** | Committed for the next milestone |
| **Future** | On the roadmap; not yet committed |
| **Experimental** | Available for trial; shape may change |

## Current status

**v0.1 Public Preview** is the first publicly usable release. Recommended for local evaluation, small private deployments, demo Capsule Services, and early integration experiments. Not recommended for business-critical HA production yet.

## v0.1 — Public Preview

**Status:** Current

**Scope**

- Opstage backend (Fastify + SQLite via Prisma)
- React 18 + Ant Design admin console
- Node Embedded Agent SDK (`@xtrape/capsule-agent-node`)
- Capsule Management Contract v0.1
- Registration tokens and agent tokens, hash-only storage
- Inventory: Agents, Capsule Services, Audit Events, Commands
- Health, configs, actions, command lifecycle
- Single-container Docker deployment, Compose option
- SQLite backup download, audit export
- RBAC: owner / operator / viewer

**Not included**

- HA / clustering
- SSO / SCIM
- Public ghcr.io image with signed releases (planned for v0.1.0 release)
- Cross-language Agent SDKs

## v0.2 — Basic Ops

**Status:** Planned

**Scope**

- Public ghcr.io image and signed releases
- First-class observability (`/metrics`, structured logs)
- Maintenance dashboard improvements
- Better recovery flows (admin password reset, session invalidation)
- More opinionated audit views and filters

**Not included**

- HA / clustering
- Cross-language Agents

## v0.3 — Capsule Spec

**Status:** Planned

**Scope**

- Frozen v1 OpenAPI for the Agent ↔ Backend API
- Versioned manifest schema
- Compatibility tests across SDK versions
- Reference contract pages on this site, generated from the spec

**Not included**

- New runtime features beyond what's required for the freeze

## v0.4 — Agent Expansion

**Status:** Future

**Scope**

- Python embedded agent
- Sidecar / standalone agent for non-language-specific use
- Optional gRPC / streaming transport

**Not included**

- Major UI changes; this milestone is SDK-shaped

## v1.0 — CE Stable

**Status:** Future

**Scope**

- Long-term-support promise for v1.x
- Migration tooling and documented upgrade paths
- Production-grade backup/restore tooling

**Not included**

- Multi-node CE; HA remains an EE concern

## EE — Enterprise Edition

**Status:** Future · Planned

**Scope**

- Org-level RBAC, SSO, SCIM
- HA / clustered deployment
- Centralized logs / Secret Vault integration
- Tenant isolation, advanced audit and approval workflows
- Cross-fleet operator dashboards

**Not included**

- Hosted SaaS — that's Cloud

## Cloud

**Status:** Future · Planned

**Scope**

- Hosted, multi-tenant Opstage
- Region-pinned data
- Free tier for hobby usage; paid tiers for teams

**Not included**

- Storing customer-side secrets — those continue to live next to your services

::: info
Roadmap items that are **Future** may shift in scope or order based on community usage and feedback. If you're considering adopting EE or Cloud, please open a discussion on [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce).
:::
