# Introducing Xtrape Capsule

> _Drafted during Public Review before the v0.1.0 Public Preview._

Modern AI products quietly accumulate dozens of small services: integration adapters, Playwright workers, account pools, OTP readers, AI Agent runtimes. They are too small for a service mesh and too important to leave unmanaged. **Xtrape Capsule** is built for that gap.

## The shape of the problem

Pick any AI product mid-development and look at what's actually running:

- A handful of integration adapters in front of OpenAI / Anthropic / vendor-X.
- A pool of Playwright workers, each holding a logged-in session.
- A pool of accounts, each with a credential and a state.
- One or two AI Agent runtimes, looping with tools and memory.
- A scrap of cron jobs and a few "scheduler" scripts.

Each is small. Each has its own vendor key, its own crash mode, its own "is it up?" question. Operators end up SSH-ing around or chasing logs, because nothing is built for this scale.

## What Capsule changes

Make each of those a **Capsule Service** — embed an Agent, declare a manifest, expose a few actions, and report health and configs. The control plane (**Opstage**) then gives you:

- live online/offline state across the fleet,
- coarse health per service,
- a button list of safe operator actions per service,
- an audit trail of who did what,
- one place to revoke a leaked credential.

No metrics system. No service mesh. No config center. Just the smallest control plane that answers operator questions.

## What CE includes today

CE v0.1 ships:

- Single-container Opstage (Fastify + SQLite + React 18 + Ant Design).
- The Node embedded Agent SDK.
- The Capsule Management Contract v0.1 with shared Zod schemas.
- RBAC, audit, maintenance sweeps, SQLite backups, audit export.
- A Docker Compose deployment path.

→ [Quick Start](/getting-started/quick-start)
→ [Build your first Capsule Service](/getting-started/first-capsule-service)

## What's next

CE v0.2 hardens the operational story (public ghcr.io image, observability), v0.3 freezes the contract for cross-language agents, v0.4 adds Python and standalone agents, and v1.0 locks the long-term contract. EE and Cloud follow.

→ [Full roadmap](/roadmap)

## Try it

```bash
git clone https://github.com/xtrape-com/xtrape-capsule-ce.git
cd xtrape-capsule-ce
cp .env.example .env
# edit OPSTAGE_ADMIN_PASSWORD and OPSTAGE_SESSION_SECRET in .env
docker compose -f deploy/compose/docker-compose.yml up --build -d
```

Then follow the [first Capsule Service guide](/getting-started/first-capsule-service) to wire your first service in 10 minutes.

If you build something with Capsule, open an issue or discussion on [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce). We'd like to hear what you're running.
