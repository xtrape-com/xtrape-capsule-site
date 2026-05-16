# Roadmap

Xtrape Capsule is shipped in incremental milestones. We avoid promising specific dates; status labels reflect the **current intent**.

| Status | Meaning |
| --- | --- |
| **Current** | Available today or being validated in Public Review |
| **Planned** | Committed for a near-term milestone |
| **Future** | On the roadmap; not yet committed |
| **Experimental** | Planned as a trial; shape may change |

## Current status

**v0.4 Capsule Bus Experimental** is the active experimental milestone on the v0.4 branch. It validates Opstage CE, the Node Agent SDK, Contracts, Demo, and public docs end-to-end for local evaluation, small private deployments, demo Capsule Services, and early integration experiments. It is not recommended for business-critical HA production.

During Public Review, the source-build Docker Compose path remains the canonical quick-start path. GHCR images may be produced from `main` for validation, but the stable `ghcr.io/xtrape-com/xtrape-capsule-ce:0.1.0` image becomes the primary documented path only after the `v0.1.0 Public Preview` cut.

## Roadmap Snapshot

- **v0.1 Public Review Foundation** — CE, Agent SDK, Contracts, Demo, and public docs are validated end-to-end.
- **v0.2 Developer Experience & Runtime Maturity** — Docker/release maturity, SDK reliability, demo polish, command/action/audit improvements.
- **v0.3 Capsule Events and Capability Metadata** — capability, event, and permission metadata foundations.
- **v0.4 Capsule Bus Experimental** — governed event-to-command routing for controlled service coordination.
- **v0.5 Capsule Catalog** — read-first catalog for discoverable Capsule Packages.
- **v0.6 Capsule Registry** — machine-readable package index, versions, compatibility, and trust metadata.
- **v0.7 Private Capsule Marketplace** — internal/private marketplace workflows for package approval, install requests, and governance.
- **v1.0 CE Stable and Ecosystem Foundation** — stable CE deployment, stable contracts/SDK, upgrade path, and ecosystem baseline.

Catalog, Registry, Marketplace, and AI-assisted governance remain future roadmap items. Capsule Bus is experimental in v0.4 and should not be presented as stable.

## v0.1 — Public Review Foundation

**Status:** Current

**Scope**

- Opstage backend (Fastify + SQLite via Prisma)
- React 18 + Ant Design admin console
- Node Embedded Agent SDK (`@xtrape/capsule-agent-node`)
- Capsule Management Contract v0.1
- Registration tokens and agent tokens, hash-only storage
- Inventory: Agents, Capsule Services, Audit Events, Commands
- Health, configs, actions, command lifecycle
- Source-build Docker Compose deployment
- SQLite backup download, audit export
- RBAC: owner / operator / viewer

**Not included**

- HA / clustering
- SSO / SCIM
- Stable `v0.1.0` GHCR image as the primary path before the Public Preview cut
- Cross-language Agent SDKs
- Catalog, Registry, Marketplace, Capsule Bus, or AI-assisted governance implementation

## v0.2 — Developer Experience & Runtime Maturity

**Status:** Planned

**Scope**

- Docker and release maturity, including the pinned Public Preview image path
- SDK reliability and troubleshooting improvements
- Demo polish for common integration flows
- Command, action, and audit improvements informed by Public Review feedback
- Better operational diagnostics and recovery guidance

**Not included**

- HA / clustering
- Cross-language Agents
- Catalog, Registry, Marketplace, or Capsule Bus implementation

## v0.3 — Capsule Events and Capability Metadata

**Status:** Future

**Scope**

- Capability metadata foundations
- Event metadata foundations
- Permission metadata foundations
- Compatibility guidance for services and SDKs that report these fields

**Not included**

- Governed event routing or marketplace workflows

## v0.4 — Capsule Bus Experimental

**Status:** Experimental

**Scope**

- Experimental event envelope and route-rule contracts
- CE event ingestion, route storage, diagnostics, and audit records
- Event-to-command routing from `eventType` plus optional `sourceServiceCode` to target service/action commands
- OpHub forwarding from optional local adapter `GET /capsule/bus/events`
- Embedded Agent `publishBusEvent()` hook for controlled trials
- Demo adapter endpoint for a minimal event example

**Not included**

- Stable public API guarantees before v1.0
- Workflow engine, service mesh, or broker replacement semantics
- Public marketplace or registry workflows

## v0.5 — Capsule Catalog

**Status:** Future

**Scope**

- Read-first catalog for discoverable Capsule Packages
- Package metadata presentation
- Documentation and discovery flows

**Not included**

- Machine-readable registry guarantees
- Install request and approval workflows

## v0.6 — Capsule Registry

**Status:** Future

**Scope**

- Machine-readable package index
- Versions, compatibility, and trust metadata
- Foundations for automated compatibility checks

**Not included**

- Marketplace governance workflows

## v0.7 — Private Capsule Marketplace

**Status:** Future

**Scope**

- Internal/private marketplace workflows
- Package approval and install requests
- Governance hooks for private ecosystems

**Not included**

- Public SaaS marketplace commitments

## v1.0 — CE Stable and Ecosystem Foundation

**Status:** Future

**Scope**

- Stable CE deployment and documented upgrade path
- Stable contracts and SDK baseline
- Migration tooling and compatibility policy
- Ecosystem baseline across CE, SDKs, Contracts, Demo, and docs

**Not included**

- Multi-node CE; HA remains an Enterprise Edition concern

## Enterprise Edition and Cloud

**Status:** Future

Enterprise Edition and Cloud remain future tracks for organization RBAC, SSO, SCIM, HA/clustered deployment, centralized logs, tenant isolation, advanced audit and approval workflows, hosted operations, and region-pinned data. They should guide extension-point design, but they are not part of the current Public Review build.

::: info
Roadmap items marked **Future** or **Experimental** may shift in scope or order based on community usage and feedback. If you're considering adopting future Enterprise Edition or Cloud capabilities, please open a discussion on [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce).
:::
