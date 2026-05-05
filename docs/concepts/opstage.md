# Opstage

> **Opstage is an agent-based runtime governance control plane for Capsule Services.**
>
> Opstage 是面向 Capsule Service 的 Agent-based 运行态治理控制面。

## What Opstage is

Opstage is the control plane that operators interact with. It owns:

- the **inventory** of agents and Capsule Services,
- the **identity** of agents (via tokens),
- the **state model** for online/offline/healthy/stale,
- the **action catalog** declared by services,
- the **commands** dispatched to agents,
- the **audit trail** of operator and system events.

An Opstage deployment has three pieces:

```text
Opstage UI       ←→   Opstage Backend   ←→   Agent (in your service)
React + antd          Fastify + SQLite        Node/JS/Python/...
```

## What Opstage is not

### Not a configuration center

Opstage is not a replacement for Nacos, Apollo, or Consul. It does not push config values out as the source of truth. Instead, services **declare what config they are running with**, and Opstage **shows it back to operators**. The service remains the source of truth.

### Not a monitoring system

Opstage is not a replacement for Prometheus / Grafana / DataDog. It does not store metrics time-series. It tracks coarse health (`HEALTHY` / `UNHEALTHY` / `STALE` / `OFFLINE`) so operators can answer "is this Capsule Service okay right now?".

### Not a generic admin panel

Opstage is not a Backstage, Retool, or hand-built admin. It has a fixed, opinionated surface area built around the Capsule Management Contract — registration, health, configs, actions, commands, audit — and it does not try to host arbitrary internal tools.

### Not a service mesh

Opstage does not route traffic, terminate TLS, or load-balance requests between services. Agents make outbound connections and pull commands; there is no inbound mesh.

## The three layers

### UI

A React 18 + Ant Design SPA. It is the operator's window into the fleet. Read more in [Admin UI](../opstage-ce/admin-ui).

### Backend

A Fastify + TypeScript service backed by SQLite (CE) via Prisma. It owns:

- token issuance and verification,
- session and CSRF for the UI,
- the API consumed by both UI and Agents,
- maintenance sweeps (offline detection, expiry).

### Agent

The piece that lives **inside or next to** your Capsule Service. The Agent talks the [Capsule Management Contract](./management-contract) to the Backend and performs whatever work the operator asks for. See [Agent](./agent).

## CE / EE / Cloud

Opstage ships as three editions, all speaking the same contract.

| Edition | Status | Highlight |
| --- | --- | --- |
| **CE** | Public Preview | Single-node, SQLite, self-hosted |
| **EE** | Planned | RBAC++, SSO, HA, Secret Vault |
| **Cloud** | Future | Hosted Opstage; Agents connect outbound |

→ See [Editions](../editions/ce).
