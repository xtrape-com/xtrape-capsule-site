# Demo

The `xtrape-capsule-ce` repository ships with a demo Capsule Service so you can see the full register → report → action → audit loop end-to-end without writing any code.

## What the demo gives you

- An in-process Backend running against a fresh SQLite DB.
- A registration token created automatically.
- A demo Agent that registers, heartbeats, and reports a `demo-capsule-service`.
- Two callable actions (`echo`, `runHealthCheck`) that you can trigger from the UI.
- A populated audit log you can browse to see every step.

## Run the smoke test

From a clone of [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce):

```bash
pnpm install
pnpm smoke:demo
```

The smoke test:

1. starts the Backend on a random port,
2. creates a registration token,
3. spawns the demo Agent flow,
4. triggers `echo` and `runHealthCheck`,
5. verifies the CommandResults end up in the database.

A green run confirms your local environment can register agents, dispatch commands, and write audit events.

## Run it interactively in the UI

```bash
pnpm dev:backend          # http://localhost:8080
pnpm dev:ui               # http://localhost:5173 (Vite proxies /api to :8080)
```

Then in another terminal, after creating a registration token in the UI:

```bash
OPSTAGE_BACKEND_URL=http://localhost:8080 \
OPSTAGE_REGISTRATION_TOKEN=opstage_reg_... \
OPSTAGE_AGENT_TOKEN_FILE=./data/demo-agent-token.txt \
pnpm --filter @xtrape/demo-capsule-service start
```

## What you should see

- **Agents** — `demo-agent` listed as `ONLINE`.
- **Capsule Services** — `demo-capsule-service` with health `HEALTHY`.
- **Audit Events** — `agent.registered`, `service.reported`, `agent.heartbeat.received` (sampled).
- **Actions tab** — `echo` and `runHealthCheck` buttons.

Trigger `echo` with `{ "message": "hi" }` and confirm; the command transitions through `PENDING → RUNNING → SUCCEEDED` with `result = { "echoed": "hi" }`.

## Troubleshooting

**The agent stays `OFFLINE` in the UI.** Make sure `OPSTAGE_BACKEND_URL` matches the URL the backend is actually serving on, and that the registration token hasn't expired.

**`echo` action stuck in `PENDING`.** The agent isn't polling. Check the demo service logs and verify the agent token file at `OPSTAGE_AGENT_TOKEN_FILE` exists and is non-empty.

**No audit events in the UI.** Audit pruning runs on a schedule but doesn't drop fresh events — confirm you're looking at the workspace your demo agent registered into (CE has a single default workspace).

## Next steps

- [Build your own first Capsule Service](./first-capsule-service)
- [Action Model](../agents/action-model) — what makes an action "good".
