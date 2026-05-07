# Node Embedded Agent

The **Node Embedded Agent** is a small library you import directly into your
Node.js Capsule Service. It speaks the Capsule Management Contract to the
Opstage backend on your behalf.

- Repository:
  [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
- Package: `@xtrape/capsule-agent-node`
- Runtime: Node.js 18+

## When to use it

Use the embedded agent when your service is itself a Node.js process — an
integration adapter, a Playwright worker, an AI Agent runtime, or any worker you
can `import` into.

Other runtimes can integrate through custom wrappers today, while dedicated
sidecar and standalone agents are planned on the roadmap.

## Install

::: info Public Review npm package
During Public Review, install `@xtrape/capsule-agent-node` from the `public-review` npm dist-tag. Pin an explicit prerelease version if you need reproducible builds.
:::

```bash
pnpm add @xtrape/capsule-agent-node@public-review
```

## Minimal example

```ts
import { CapsuleAgent } from "@xtrape/capsule-agent-node";

const agent = new CapsuleAgent({
  backendUrl: process.env.OPSTAGE_BACKEND_URL!,
  registrationToken: process.env.OPSTAGE_REGISTRATION_TOKEN,
  tokenStore: { file: "./data/agent-token.txt" },
  service: {
    code: "integration-worker",
    name: "Example integration service",
    version: "0.3.1",
    runtime: "nodejs",
  },
});

await agent.start();
```

`registrationToken` is required only on first start. After the agent token has
been persisted to `tokenStore.file`, restarting the process just re-uses it.

## Health reporting

```ts
agent.health(async () => {
  const ok = await ping();
  return ok
    ? { status: "UP" }
    : { status: "DOWN", message: "vendor API unreachable" };
});
```

Health is sampled on the heartbeat cadence and surfaced in the Opstage console.
See [Health Reporting](./health-reporting).

Agent health providers return protocol-level `HealthStatus` values: `UP`,
`DEGRADED`, `DOWN`, `UNKNOWN`.

Opstage may derive an operator-facing `effectiveStatus`: `HEALTHY`, `UNHEALTHY`,
`STALE`, `OFFLINE`.

## Config reporting

```ts
agent.configs(() => [
  {
    key: "UPSTREAM_URL",
    type: "string",
    sensitive: false,
    editable: false,
    valuePreview: process.env.UPSTREAM_URL,
  },
  {
    key: "UPSTREAM_TIMEOUT_MS",
    type: "number",
    sensitive: false,
    editable: false,
    valuePreview: String(process.env.UPSTREAM_TIMEOUT_MS ?? 15000),
  },
]);
```

Configuration is **observed**, not pushed. The service remains the source of
truth. See [Config Reporting](./config-reporting).

## Action model

```ts
agent.action({
  name: "rotateKey",
  label: "Rotate API key",
  dangerLevel: "HIGH",
  requiresConfirmation: true,
  inputSchema: {
    type: "object",
    required: ["newKey"],
    properties: { newKey: { type: "string", minLength: 8 } },
  },
  handler: async (payload) => {
    await rotate(payload.newKey as string);
    return { success: true, data: { rotatedAt: new Date().toISOString() } };
  },
});
```

See [Action Model](./action-model) for the full lifecycle (`ACTION_PREPARE` →
`ACTION_EXECUTE`, confirmation, schema-driven UI).

## Command polling

The agent maintains a long-poll against `GET /api/agents/commands` and
dispatches incoming commands to the registered action handlers. You don't have
to manage the polling loop yourself — `agent.start()` runs it for you.

## Security notes

- Treat the registration token like a one-time secret. After first start, **do
  not** keep it in the environment.
- Persist the agent token file with restrictive file permissions (`chmod 600`).
- The agent only makes **outbound** connections; you do not need to expose any
  inbound port to Opstage.
- A leaked agent token can be revoked from the Opstage console — see
  [Token Model](../security/token-model).

## Relationship to other repos

| Repo                                                                                           | Purpose                                            |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)         | This SDK                                           |
| [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node) | Shared Zod schemas / types used by SDK and backend |
| [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce)                         | The Opstage CE backend the SDK talks to            |

→ Continue with the
[Capsule Management Contract](../concepts/management-contract) for the
wire-level view.
