# Capsule Service

A **Capsule Service** is a small, self-contained service unit that exposes a standard runtime governance surface — registration, heartbeat, health, configuration, actions, and audit — without becoming a heavyweight platform citizen.

> 一个 Capsule Service 是轻量、自治、可注册、可观测、可配置、可操作、可审计的小型服务单元。

## What a Capsule Service is

- **Registerable** — announces itself to a control plane (Opstage) and gets a stable identity.
- **Observable** — reports health, version, and runtime metadata on a regular cadence.
- **Configurable** — declares what configuration it exposes; configuration changes are observable to operators.
- **Operable** — declares actions that operators can trigger from the control plane.
- **Auditable** — every meaningful event becomes an audit record.

## Why "Capsule" instead of "Microservice"?

Most "services" in an AI product are not classic microservices. They are short-lived workers, automation scripts, API bridges, per-account or per-session runtimes, or experimental connectors. They are **too small for a full service mesh**, but **too important to leave unmanaged**.

Capsule Services are designed to fill that gap.

| Dimension | Microservice | Capsule Service |
| --- | --- | --- |
| Primary goal | Business domain decomposition | Lightweight capability governance |
| Runtime | Long-running service | Service / worker / connector / agent runtime |
| Management | Service mesh / platform engineering | Agent-based runtime governance |
| Typical stack | Java/Spring, Go, Node | Node, Python, Java, scripts, workers |
| Deployment | Cluster-managed | Anywhere with outbound network |
| Identity | Cluster service account | Agent token issued by Opstage |

## Why the AI era produces many Capsule Services

AI products tend to multiply small, specialized runtimes:

- **Integration adapters** translating between vendor APIs and your internal contracts;
- **Playwright workers** that drive a browser session per task;
- **Account pools** that own a credential, a cookie jar, or an OTP reader;
- **AI Agent runtimes** — long-lived loops that need observable state and safe operator controls;
- **Proxy checkers**, **scrapers**, **OCR workers**, **LLM tool runtimes**, **scheduled jobs**.

A typical AI product ends up with **dozens** of these. Each is too small to deserve its own admin panel, but the fleet as a whole needs one.

## Typical examples

- Integration service — fronts an external API with a stable internal contract
- Playwright Worker — runs a browser session, often with credentials
- Account Pool — owns and rotates accounts/cookies
- Session Pool — owns long-lived authenticated sessions
- AI Agent Runtime — runs an autonomous loop with tools
- OTP Reader — reads one-time passwords from inboxes
- Proxy Checker — verifies and curates outbound proxies

## Minimum requirements to be a Capsule Service

To be governed by Opstage, a service must:

1. Embed (or sit behind) an Agent that can speak the [Capsule Management Contract](./management-contract).
2. Have a stable `code` and a manifest (name, version, description, declared actions).
3. Expose a health probe — even a synchronous "I'm alive" suffices.
4. Optionally declare configuration sources and actions.

That's it. There is no requirement to use a specific framework, runtime, or deployment model.

## What a Capsule Service is not

- It is not a microservice with a different name.
- It is not required to be stateless.
- It is not required to be HTTP-facing.
- It is not required to be containerized.

→ Continue with [Opstage](./opstage) and [Agent](./agent).
