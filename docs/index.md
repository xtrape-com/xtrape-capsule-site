---
layout: home

hero:
  name: Xtrape Capsule
  text: A lightweight control plane for AI-era Capsule Services.
  tagline: Connect small services, automation workers, integration services, and agent runtimes to a unified Opstage console through an embedded Agent SDK.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/quick-start
    - theme: alt
      text: Build Your First Capsule Service
      link: /getting-started/first-capsule-service
    - theme: alt
      text: Install Opstage CE
      link: /getting-started/install-opstage-ce
    - theme: alt
      text: View on GitHub
      link: https://github.com/xtrape-com/xtrape-capsule-ce

features:
  - title: Capsule Services
    details: Lightweight, self-registering, observable, configurable, and auditable service units — built for the AI era.
    link: /concepts/capsule-service
    linkText: Learn more
  - title: Opstage Control Plane
    details: An agent-based runtime governance console for inventory, health, configs, actions, commands, and audit.
    link: /concepts/opstage
    linkText: Learn more
  - title: Embedded Agent SDK
    details: Drop a Node.js Agent into your service to register, heartbeat, report, and execute commands.
    link: /agents/node-embedded-agent
    linkText: Learn more
---

::: warning Public Preview · v0.1
Xtrape Capsule CE is currently in **v0.1 Public Preview**.

**Recommended for**

- local evaluation;
- small private deployments;
- demo Capsule Services;
- early integration experiments.

**Not recommended for**

- business-critical high-availability production;
- public-internet exposure without additional protection;
- regulated environments requiring full compliance controls.

See the [Roadmap](/roadmap) for what's planned next.
:::

## What is Xtrape Capsule?

**Xtrape Capsule** is an open governance system for the long tail of small services that power modern AI products — integration adapters, Playwright workers, account pools, OTP readers, proxy checkers, and AI Agent runtimes.

Instead of stitching together a service mesh, a config center, a monitoring stack, and a backstage, you get **one lightweight control plane** that speaks to your services through an embedded Agent.

```text
Capsule Service  ──[Agent SDK]──▶  Opstage Backend  ◀──  Opstage UI
```

## Why Capsule Services?

Most "services" in an AI product are not classic microservices. They are:

- short-lived workers
- automation scripts
- API bridges
- per-account or per-session runtimes
- experimental connectors

These deserve **runtime governance**, not heavy platform engineering. Capsule Services are designed to be **registered, observed, configured, operated, and audited** — without giving up their lightweight nature.

## What is Opstage?

> Opstage is an agent-based runtime governance control plane for Capsule Services.
>
> Opstage 是面向 Capsule Service 的 Agent-based 运行态治理控制面。

Opstage gives you a clear, single-pane view of every Capsule Service across your fleet — what's online, what's healthy, what config it's running with, what actions it exposes, and what commands have been executed against it.

## How it works

```text
+---------------------+
|     Opstage UI      |   ← human operator
+----------+----------+
           |
           v
+---------------------+
|  Opstage Backend    |   ← control plane
+----------+----------+
           ^
           |  outbound only
           |
+----------+----------+
|  Embedded Agent     |   ← data-plane agent
+----------+----------+
           |
           v
+---------------------+
|  Capsule Service    |   ← the thing being governed
+---------------------+
```

1. The administrator creates a **registration token** in Opstage.
2. The Capsule Service starts with an embedded **Agent SDK** and registers using that token.
3. The Agent receives a long-lived **agent token**, sends heartbeats, and reports its services.
4. Opstage tracks **inventory, health, configs, and actions** through the contract.
5. Operators trigger **actions** from the UI; Opstage queues commands; the Agent polls and executes them.
6. Every meaningful event lands in the **audit log**.

The Backend never opens a socket to your services. All connections are initiated outbound by the Agent, which is what makes Opstage runnable behind NAT, on a laptop, or inside customer environments.

## Quick Start

```bash
git clone https://github.com/xtrape-com/xtrape-capsule-ce.git
cd xtrape-capsule-ce
docker compose -f deploy/compose/docker-compose.yml up --build -d
```

Open `http://localhost:8080` and sign in with the bootstrap admin account.

::: info
Public Docker images are planned for the v0.1.0 Public Preview release; until then, build locally with the command above.
:::

→ [Full Quick Start guide](/getting-started/quick-start)

## Developer SDK

```ts
import { CapsuleAgent } from "@xtrape/capsule-agent-node";

const agent = new CapsuleAgent({
  backendUrl: process.env.OPSTAGE_BACKEND_URL!,
  registrationToken: process.env.OPSTAGE_REGISTRATION_TOKEN,
  tokenStore: { file: "./data/agent-token.txt" },
  service: {
    code: "my-capsule",
    name: "My Capsule Service",
    version: "0.1.0",
    runtime: "nodejs",
  },
});

await agent.start();
```

→ [Build your first Capsule Service](/getting-started/first-capsule-service)

## Editions

| Edition | Status | Audience |
| --- | --- | --- |
| **CE — Community Edition** | Public Preview | Individuals, small teams, self-hosted private services |
| **EE — Enterprise Edition** | Planned | Companies needing RBAC, SSO, HA, secret vault, central logs |
| **Cloud** | Future | Teams who don't want to self-host |

→ [Compare editions](/editions/ce)

## Use Cases

- [Integration Services](/use-cases/integration-services)
- [Playwright Workers](/use-cases/playwright-workers)
- [Account Pool](/use-cases/account-pool)
- [AI Agent Runtime](/use-cases/ai-agent-runtime)

## Roadmap

`v0.1` Public Preview is **Current**. See the full [roadmap](/roadmap) for what's planned next.

## Repositories

- [xtrape-capsule-ce](https://github.com/xtrape-com/xtrape-capsule-ce) — Opstage CE backend, UI, deploy
- [xtrape-capsule-agent-node](https://github.com/xtrape-com/xtrape-capsule-agent-node) — Node.js embedded Agent SDK
- [xtrape-capsule-contracts-node](https://github.com/xtrape-com/xtrape-capsule-contracts-node) — Shared contracts & Zod schemas
- [xtrape-capsule-site](https://github.com/xtrape-com/xtrape-capsule-site) — This site
