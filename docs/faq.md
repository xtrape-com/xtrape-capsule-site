# FAQ

::: tip Positioning in one sentence
Opstage is **not** a traditional config center, monitoring dashboard, or developer portal. It is an **agent-based runtime governance control plane for Capsule Services** — and it is designed to **co-exist** with whatever metrics, logs, configs, and developer-portal stack you already run.
:::

## What is Xtrape Capsule?

Xtrape Capsule is a lightweight runtime governance system for the long tail of small services that power AI products — integration adapters, Playwright workers, account pools, AI Agent runtimes. Services embed an [Agent SDK](./agents/node-embedded-agent), which talks to the [Opstage](./concepts/opstage) control plane: inventory, health, configs, actions, commands, and audit.

## What's the difference between a Capsule Service and a microservice?

A microservice is about **business domain decomposition** at the platform-engineering scale. A Capsule Service is about **lightweight runtime governance** for small specialized runtimes. See the [Capsule Service](./concepts/capsule-service) page for the full comparison table.

## How is Opstage different from Nacos / Apollo?

Nacos and Apollo are **configuration centers**: they push config values out as the source of truth. Opstage is a **governance control plane**: services remain the source of truth for their own config, and Opstage **observes** what they're running. See [Opstage](./concepts/opstage).

## How is Opstage different from Prometheus / Grafana?

Prometheus is a **time-series metrics system**. Opstage is **not**. It tracks coarse health (`HEALTHY` / `UNHEALTHY` / `STALE` / `OFFLINE`) and answers "is this Capsule Service okay right now?" — not "what's the p99 latency?". They are complementary: run both.

## How is Opstage different from Backstage?

Backstage is a **developer portal** — software catalog, scaffolding, plugin platform. Opstage is a **runtime control plane** — what's running, what's healthy, what action can I trigger right now. They solve different problems and can coexist.

## Can Opstage integrate with my existing stack?

Yes — Opstage is intentionally narrow. It focuses on Capsule Services and leaves the rest of the platform to the tools you already use:

- **Metrics:** keep using Prometheus / Grafana / DataDog. Opstage tracks coarse health, not time-series.
- **Logs:** keep using your existing log pipeline. Opstage's audit log is an *operator-action* log, not a system log.
- **Configs / secrets:** keep using your existing config or secret system. Opstage observes what services *report*, it does not push values.
- **Developer portal:** keep using Backstage / your portal. Opstage links to it, doesn't replace it.

Future integrations (OpenTelemetry context propagation, SIEM bridges, vault-backed secret injection in EE/Cloud) build on this stance.

## Does Opstage store my account passwords, cookies, or API tokens?

**No.** Opstage stores only what your service chooses to report. Customer-side secrets stay in the service. Inside the database, registration tokens and agent tokens are kept as **SHA-256 hashes**, never plaintext. See [Token Model](./security/token-model).

## Why does the Agent register itself instead of Opstage provisioning it?

Capsule Services are diverse and dynamic. Pre-provisioning every service into a central registry doesn't scale. Outbound-initiated registration also means agents work behind NAT, on laptops, and in customer environments without inbound exposure. See [Agent Registration](./concepts/agent-registration).

## Can I use CE commercially?

Yes. CE is Apache-2.0. You can use it internally or in commercial products.

## When will EE and Cloud be available?

After CE v1.0 stabilizes. We don't promise dates. See [Roadmap](./roadmap).

## Is the current version production-ready?

CE v0.1 is **Public Preview**. It's suitable for individuals, small teams, and private deployments where you control the failure domain. For business-critical production with HA / SSO / SIEM requirements, wait for CE v1.0 or EE.

## What language can my Capsule Service be in?

Today: any language that can run the [Node Embedded Agent](./agents/node-embedded-agent) — either as an embedded Node module or as a sidecar process. A Python agent and a standalone agent are on the [Roadmap](./roadmap).

## How do I report an issue?

Open an issue on the relevant repo:

- Backend / UI / Docker: [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce)
- Agent SDK: [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
- Contracts: [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node)
- This site: [`xtrape-capsule-site`](https://github.com/xtrape-com/xtrape-capsule-site)
