# Node Embedded Agent

The **Node Embedded Agent** is a small library you import directly into your Node.js Capsule Service. It speaks the Capsule Management Contract to the Opstage backend on your behalf.

- Repository: [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
- Package: `@xtrape/capsule-agent-node`
- Runtime: Node.js 18+

## When to use it

Use the embedded agent when your service is itself a Node.js process — a CAPI bridge, a Playwright worker, an AI Agent runtime, or any worker you can `import` into.

For non-Node services, run the Node agent as a sidecar process or use a future language-specific agent.

## Install

```bash
pnpm add @xtrape/capsule-agent-node
```

## Minimal example

```ts
import { CapsuleAgent } from "@xtrape/capsule-agent-node";

const agent = new CapsuleAgent({
  backendUrl: process.env.OPSTAGE_BACKEND_URL!,
  registrationToken: process.env.OPSTAGE_REGISTRATION_TOKEN,
  tokenFile: "./data/agent-token.json",
});

agent.registerService({
  code: "capi-chatgpt",
  name: "ChatGPT CAPI",
  version: "0.3.1",
});

await agent.start();
```

`registrationToken` is required only on first start. After the agent token has been persisted to `tokenFile`, restarting the process just re-uses it.

## Health reporting

```ts
agent.registerHealthCheck("capi-chatgpt", async () => {
  const ok = await ping();
  return ok
    ? { status: "HEALTHY" }
    : { status: "UNHEALTHY", message: "vendor API unreachable" };
});
```

Health is sampled on the heartbeat cadence and surfaced in the Opstage console. See [Health Reporting](./health-reporting).

## Config reporting

```ts
agent.registerConfigSource("capi-chatgpt", async () => ({
  upstream: process.env.UPSTREAM_URL,
  timeoutMs: Number(process.env.UPSTREAM_TIMEOUT_MS ?? 15000),
}));
```

Configuration is **observed**, not pushed. The service remains the source of truth. See [Config Reporting](./config-reporting).

## Action model

```ts
agent.registerAction("capi-chatgpt", {
  name: "rotateKey",
  label: "Rotate API key",
  requiresConfirmation: true,
  inputSchema: {
    type: "object",
    required: ["newKey"],
    properties: { newKey: { type: "string", minLength: 8 } },
  },
  handler: async (payload) => {
    await rotate(payload.newKey);
    return { rotatedAt: new Date().toISOString() };
  },
});
```

See [Action Model](./action-model) for the full lifecycle (`ACTION_PREPARE` → `ACTION_EXECUTE`, confirmation, schema-driven UI).

## Command polling

The agent maintains a long-poll against `GET /api/agents/commands` and dispatches incoming commands to the registered action handlers. You don't have to manage the polling loop yourself — `agent.start()` runs it for you.

## Security notes

- Treat the registration token like a one-time secret. After first start, **do not** keep it in the environment.
- Persist `agent-token.json` with restrictive file permissions (`chmod 600`).
- The agent only makes **outbound** connections; you do not need to expose any inbound port to Opstage.
- A leaked agent token can be revoked from the Opstage console — see [Token Model](../security/token-model).

## Relationship to other repos

| Repo | Purpose |
| --- | --- |
| [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node) | This SDK |
| [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node) | Shared Zod schemas / types used by SDK and backend |
| [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce) | The Opstage CE backend the SDK talks to |

→ Continue with the [Capsule Management Contract](../concepts/management-contract) for the wire-level view.
