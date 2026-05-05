# Agent Security

This page covers practical security guidance for running Agents alongside your Capsule Services.

## Treat the registration token as one-time

A registration token is the bootstrap credential. After first start, the agent token has been issued and the registration token is no longer needed. Recommendations:

- Pass it via env (`OPSTAGE_REGISTRATION_TOKEN`) and **remove it from subsequent starts**.
- Revoke it from the Opstage console once the agent is online.
- Don't bake registration tokens into container images.

## Protect the agent token file

The agent token file (`./data/agent-token.json` by default) is the long-lived credential.

- Set restrictive permissions: `chmod 600 data/agent-token.json`.
- Mount the data dir on a host filesystem you control; avoid bind-mounting it into images you ship.
- Treat its leak with the same severity as a vendor API key.

## On a leak — agent token

1. Open Opstage console → **Agents** → the affected agent.
2. Click **Revoke**.
3. Re-issue a registration token, redeploy the agent with it on first start.
4. Inspect the audit trail (`session.login.*`, `command.*`) for unexpected activity.

## Outbound network only

The Agent SDK only initiates outbound HTTPS requests. There is no listener.

- No inbound port to expose, no firewall rule to open.
- Behind NAT, on a laptop, in a customer environment — all fine.
- If your environment requires an HTTP proxy, configure it via standard `HTTPS_PROXY` / `NO_PROXY` env vars.

## Don't report secrets

Config reporting is a developer's eye view of "what config am I running with". Make it useful — but never include secrets.

```ts
// 👍 OK — preview is a non-secret display string
agent.configs(() => [
  { key: "UPSTREAM_URL", type: "string", sensitive: false, editable: false,
    valuePreview: process.env.UPSTREAM_URL },
  { key: "MODEL", type: "string", sensitive: false, editable: false,
    valuePreview: process.env.MODEL },
  { key: "API_KEY", type: "secret", sensitive: true, editable: false,
    valuePreview: "[REDACTED]", secretRef: "env://API_KEY" },
]);

// 🚫 Never — putting secret material in valuePreview
agent.configs(() => [
  { key: "API_KEY", type: "secret", sensitive: true, editable: false,
    valuePreview: process.env.API_KEY },  // <-- don't
]);
```

Opstage operators should never see plaintext secrets in any tab. Mark every secret-bearing key with `sensitive: true` and use `[REDACTED]` (or a similar non-revealing placeholder) for `valuePreview`.

## Validate action payloads server-side

Opstage validates payloads against the schema you declared, but your handler is the last line of defense. Never trust the payload blindly:

```ts
agent.action({
  name: "rotateKey",
  inputSchema: { /* ... */ },
  handler: async (payload) => {
    if (!isStrongKey(payload.newKey as string)) {
      return { success: false, error: { code: "WEAK_KEY", message: "key too weak" } };
    }
    await rotate(payload.newKey as string);
    return { success: true };
  },
});
```

## Don't share an agent token across hosts

Each agent install should register itself and own its own agent token. Sharing one token across hosts collapses identity in audit and makes targeted revocation impossible.
