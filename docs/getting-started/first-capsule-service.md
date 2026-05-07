# Build Your First Capsule Service

This walks you through wiring a minimal Node.js Capsule Service into Opstage in
about 10 minutes.

::: info This guide targets the current `main` branch of
[`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node).
When the SDK is published to npm as `@xtrape/capsule-agent-node` v0.1.x, this
page will be pinned to a verified release. :::

## What you'll build

A tiny service that:

- registers itself with Opstage on first start,
- declares one Capsule Service called `my-capsule`,
- reports its health,
- exposes one action (`echo`),
- executes commands dispatched from the Opstage console.

## 1. Have Opstage CE running

Follow the [Quick Start](./quick-start) first. You should be able to sign in to
`http://localhost:8080`.

## 2. Create a registration token

In the Opstage console:

1. Go to **Registration Tokens**.
2. Click **Create Token**.
3. Copy the one-time `opstage_reg_...` value. **It is shown only once.**

## 3. Set up a Node project

```bash
mkdir my-capsule && cd my-capsule
pnpm init
pnpm add @xtrape/capsule-agent-node@public-review
pnpm add -D typescript tsx @types/node
```

::: tip Full runnable demo
For a complete service with health, configs, search/list actions, row actions,
and detail results, use
[`xtrape-capsule-demo`](https://github.com/xtrape-com/xtrape-capsule-demo).
:::

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

## 4. Write the agent bootstrap

`src/main.ts`:

```ts
import { CapsuleAgent } from "@xtrape/capsule-agent-node";

const agent = new CapsuleAgent({
  backendUrl: process.env.OPSTAGE_BACKEND_URL ?? "http://localhost:8080",
  registrationToken: process.env.OPSTAGE_REGISTRATION_TOKEN,
  tokenStore: {
    file: process.env.OPSTAGE_AGENT_TOKEN_FILE ?? "./data/agent-token.txt",
  },
  agent: {
    code: "my-capsule-agent",
    name: "My Capsule Agent",
    runtime: "nodejs",
  },
  service: {
    code: "my-capsule",
    name: "My Capsule Service",
    version: "0.1.0",
    runtime: "nodejs",
    description: "A minimal Capsule Service used as a Hello-World example.",
  },
});

// Health reporting
agent.health(async () => ({
  status: "UP",
  message: "ok",
  details: { uptimeSeconds: Math.floor(process.uptime()) },
}));

// Config reporting (optional)
agent.configs(() => [
  {
    key: "GREETING",
    type: "string",
    sensitive: false,
    editable: false,
    valuePreview: process.env.GREETING ?? "hello",
  },
]);

// Action — server-callable operation
agent.action({
  name: "echo",
  label: "Echo",
  description: "Return the submitted message.",
  dangerLevel: "LOW",
  requiresConfirmation: false,
  inputSchema: {
    type: "object",
    required: ["message"],
    properties: {
      message: { type: "string", default: "hello" },
    },
  },
  handler: async (payload) => ({
    success: true,
    data: { echo: payload.message },
  }),
});

await agent.start();
console.log("Capsule Service started.");
```

## 5. Run the service

```bash
OPSTAGE_BACKEND_URL=http://localhost:8080 \
OPSTAGE_REGISTRATION_TOKEN=opstage_reg_... \
pnpm exec tsx src/main.ts
```

On first start the agent:

1. exchanges the registration token for an agent token,
2. saves the issued credentials under `./data/agent-token.txt`,
3. starts heartbeating and reporting `my-capsule`.

::: tip Subsequent restarts use the cached agent token. The registration token
can be revoked from the Opstage console once your service is online. :::

## 6. Verify in the console

In Opstage CE you should now see:

- **Agents** — your new agent listed as `ONLINE`.
- **Capsule Services** — `my-capsule` with health `HEALTHY`.
- **Audit Events** — `agent.registered`, `service.reported`,
  `agent.heartbeat.received`.

## 7. Trigger an action

1. Open `my-capsule` → **Actions** tab.
2. Click **Run** on `echo`.
3. Fill the form (`message: "hi"`) and confirm.
4. Opstage creates a `command`; your agent picks it up via long-poll and runs
   the handler.
5. The command result appears in **Commands** with `status = SUCCEEDED` and
   `result = { "echo": "hi" }`.

## 8. Inspect the audit trail

Every meaningful event is recorded:

- `command.created` (operator triggered the action)
- `command.dispatched` (agent picked it up)
- `command.completed` (agent reported success)

::: tip Match versions across the four packages
Pin matching `0.1.x` versions across `xtrape-capsule-ce`,
`@xtrape/capsule-agent-node`, `@xtrape/capsule-contracts-node`, and
`xtrape-capsule-demo`. During Public Review the npm packages live under the
`public-review` dist-tag — see the [v0.1.0 release notes](../releases/v0.1.0)
for the matching matrix.
:::

→ Continue with [Node Embedded Agent](../agents/node-embedded-agent) for the
full SDK surface.
