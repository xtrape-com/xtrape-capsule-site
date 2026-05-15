# Roadmap

Xtrape Capsule is shipped in incremental milestones. We avoid promising specific dates; status labels reflect the **current intent**.

| Status | Meaning |
| --- | --- |
| **Current** | Available today or being validated in Public Review |
| **Planned** | Committed for a near-term milestone |
| **Future** | On the roadmap; not yet committed |
| **Experimental** | Planned as a trial; shape may change |

## Current status

**v0.1 Public Review Foundation** is the current Public Review / pre-`v0.1.0 Public Preview` milestone. It validates Opstage CE, the Node.js Embedded Agent SDK, Contracts, Demo, and public docs end-to-end for local evaluation, small private deployments, demo Capsule Services, and early integration experiments. It is not recommended for business-critical HA production.

During Public Review, the source-build Docker Compose path remains the canonical quick-start path. GHCR images may be produced from `main` for validation, but the stable `ghcr.io/xtrape-com/xtrape-capsule-ce:0.1.0` image becomes the primary documented path only after the `v0.1.0 Public Preview` cut.

## Roadmap Snapshot

- **v0.1 Public Review Foundation** — basic embedded agent mode, health reporting, config items, actions.
- **v0.2 Developer Experience & Runtime Maturity** — Docker/release maturity, SDK reliability, demo polish, command/action/audit improvements.
- **v0.3 OpHub Runtime, Capsule Events and Capability Metadata** — experimental OpHub Runtime mode and metadata foundations.
- **v0.4 Capsule Bus Experimental** — Capsule Bus foundations, security policies, cross-service communication.
- **v0.5 Capsule Catalog** — read-first catalog for discoverable Capsule Packages.
- **v0.6 Capsule Registry** — machine-readable package index, versions, compatibility, and trust metadata.
- **v0.7 Private Capsule Marketplace** — internal/private marketplace workflows for package approval, install requests, and governance.
- **v1.0 CE Stable and Ecosystem Foundation** — stable CE deployment, stable contracts/SDK, upgrade path, and ecosystem baseline.

Catalog, Registry, Marketplace, Capsule Bus, and AI-assisted governance are future roadmap items. They are not implemented in the current Public Review build.

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

## v0.3 OpHub Runtime, Capsule Events and Capability Metadata

v0.3 introduces the **OpHub Runtime** – a local operations hub that can manage
multiple Capsule Services on the same host. This replaces the earlier node-level agent concept with an experimental Go-based OpHub implementation.

### Key Features

- **Embedded Agent mode**: Single Capsule Service connects directly to Opstage
- **OpHub-managed mode**: OpHub discovers and manages local Capsule Services through adapter endpoints  
- **OpHub Self Service**: OpHub reports itself as an infrastructure/system service
- **Capability metadata**: Services declare available actions with rich metadata
- **Event metadata**: Design-only event definitions for future Capsule Bus work
- **Multi-service management**: One OpHub can manage multiple local services

### Deployment Modes

OpHub can run in various deployment forms:

- **Service mode**: System service managed by systemd/init
- **Sidecar mode**: Container sidecar in Kubernetes or Docker Compose  
- **Base-image mode**: Built into application Docker images
- **Standalone mode**: Direct process execution

### Architecture

```
Embedded Agent mode:
  Opstage CE <----polling---- Capsule Service
                                embeds agent-*

OpHub-managed mode:
  Opstage CE <----polling---- OpHub <----local adapter---- Capsule Service A
                                   <----local adapter---- Capsule Service B

OpHub Self Service:
  OpHub reports itself as an infrastructure/system service through a built-in adapter.
```

### Tracking

- [xtrape-capsule-ophub-go#1](https://github.com/xtrape-com/xtrape-capsule-ophub-go/issues/1) - OpHub Runtime implementation
- [xtrape-capsule-contracts-node#10](https://github.com/xtrape-com/xtrape-capsule-contracts-node/issues/10) - Protocol contracts for v0.3
- [xtrape-capsule-agent-node#8](https://github.com/xtrape-com/xtrape-capsule-agent-node/issues/8) - Node.js Embedded Agent SDK
- [xtrape-capsule-demo#8](https://github.com/xtrape-com/xtrape-capsule-demo/issues/8) - Reference demo implementation

> **Note**: Capsule Bus (real-time event streaming) is not implemented in v0.3.
> Event metadata is design-only and prepares the contract surface for future work.

### Non-goals

- Production-ready multi-tenant support
- Advanced security policies  
- Complex workflow orchestration
- Real-time event bus implementation

The `agent-node` package remains the **Node.js Embedded Agent SDK** for single
Capsule Services, not a node-level agent runtime.

## v0.4 — Capsule Bus Experimental

**Status:** Future · Experimental

**Scope**

- Governed event-to-command routing for controlled service coordination
- Operator-visible routing and audit foundations
- Experimental guardrails for service-to-service coordination

**Not included**

- Public marketplace or registry workflows
- Full workflow engine
- Service mesh replacement
- General-purpose message broker replacement

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
