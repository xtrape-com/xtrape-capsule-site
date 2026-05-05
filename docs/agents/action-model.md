# Action Model

An **Action** is an operator-callable operation declared by a Capsule Service. Actions are how operators "do something" to a service from the Opstage console.

## Two-phase lifecycle

Actions in Opstage v0.1 are two-phase to allow **schema-driven UIs without trusting stale catalogs**:

```text
ACTION_PREPARE   →  agent returns dynamic inputSchema + initialPayload + current state
ACTION_EXECUTE   →  agent runs the action with the operator-supplied payload
```

The Capsule Service report contains a static **Action Catalog** (button list, labels, descriptions). The dynamic form schema, defaults, and current state come **only at panel-open time** via `ACTION_PREPARE`.

## Endpoints

```text
GET   /api/admin/capsule-services/:serviceId/actions/:actionName    # prepare
POST  /api/admin/capsule-services/:serviceId/actions/:actionName    # execute
```

## Declaring an action (Node SDK)

```ts
agent.action({
  name: "rotateKey",
  label: "Rotate API key",
  dangerLevel: "HIGH",
  requiresConfirmation: true,
  timeoutSeconds: 30,
  inputSchema: {
    type: "object",
    required: ["newKey"],
    properties: { newKey: { type: "string", minLength: 8 } },
  },
  prepare: async () => ({
    initialPayload: { newKey: "" },
    currentState: { service: { code: "integration-worker", status: "HEALTHY" } },
  }),
  handler: async (payload) => {
    await rotate(payload.newKey as string);
    return { success: true, data: { rotatedAt: new Date().toISOString() } };
  },
});
```

`prepare` is optional. If omitted, the SDK returns a default prepare payload built from the catalog `inputSchema` defaults.

## Confirmation

Setting `requiresConfirmation: true` requires the operator to explicitly tick a confirmation box; the backend rejects executions without `confirmation: true` in the body.

## Result shape

```ts
type ActionResult =
  | { success: true; output?: unknown }
  | { success: false; error: { code: string; message: string; details?: unknown } };
```

The agent reports the result via `POST /api/agents/commands/:id/result`; Opstage updates the command and writes audit events (`command.completed` / `command.failed`).

## Cancellation

Pending or running commands can be cancelled from the console. Cancellation flips the command to `CANCELLED`; if the agent has already started, the agent's handler is allowed to finish (or to detect the cancellation in its own time) — Opstage does **not** kill processes.

## Best practices

- Keep actions **idempotent** when possible — a second click should be safe.
- Validate the payload server-side in your handler, even though Opstage validated it against your schema.
- Return enough output to make the audit trail meaningful — operators rely on it.
