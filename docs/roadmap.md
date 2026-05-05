# Roadmap

Xtrape Capsule is shipped in incremental milestones. We avoid promising specific dates; status labels below reflect the **current intent**.

| Status | Meaning |
| --- | --- |
| **Current** | Available today |
| **Planned** | Committed for the next milestone |
| **Future** | On the roadmap; not yet committed |
| **Experimental** | Available for trial; shape may change |

## v0.1 — Public Preview · *Current*

The first publicly usable Opstage CE.

- Opstage backend (Fastify + SQLite via Prisma)
- React 18 + Ant Design admin console
- Node Embedded Agent SDK (`@xtrape/capsule-agent-node`)
- Capsule Management Contract v0.1
- Registration tokens, agent tokens (hash-only storage)
- Inventory: Agents, Capsule Services, Audit Events, Commands
- Health, configs, actions, command lifecycle
- Single-container Docker deployment, Compose option
- SQLite backup download, audit export
- RBAC: owner / operator / viewer

## v0.2 — Basic Ops · *Planned*

Hardening for small-team self-hosting.

- Public ghcr.io image and signed releases
- First-class observability (`/metrics`, structured logs)
- Maintenance dashboard improvements
- Better recovery flows (admin password reset, session invalidation)
- More opinionated audit views and filters

## v0.3 — Capsule Spec · *Planned*

Stabilize the wire-level contract for cross-language agents.

- Frozen v1 OpenAPI for the Agent ↔ Backend API
- Versioned manifest schema
- Compatibility tests across SDK versions
- Reference contract pages on this site, generated from the spec

## v0.4 — Agent Expansion · *Future*

Agents beyond Node.js.

- Python embedded agent
- Sidecar/standalone agent for non-language-specific use
- Optional gRPC/streaming transport

## v1.0 — CE Stable · *Future*

A locked, semver-stable CE.

- Long-term support promise for v1.x
- Migration tooling and documented upgrade paths
- Production-grade backup/restore tooling

## EE — Enterprise Edition · *Future*

Self-hosted, commercial edition for companies. Planned scope:

- Org-level RBAC, SSO, SCIM
- HA / clustered deployment, central logs, Secret Vault integration
- Tenant isolation, advanced audit and approval workflows
- Operator dashboards across many Capsule fleets

## Cloud · *Future*

Hosted Opstage as a SaaS. Agents continue to make outbound connections to the Cloud control plane; **customer-side secrets remain at the customer**.

- Multi-tenant Opstage backend
- Region-pinned data
- Free tier for hobby usage; paid tiers for teams

::: info
Roadmap items that are **Future** may shift in scope or order based on community usage and feedback. If you're considering adopting EE or Cloud, please open an issue on [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce).
:::
