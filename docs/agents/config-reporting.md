# Config Reporting

Configuration in Opstage is **observed, not pushed**. Each Capsule Service tells Opstage what config it is currently running with. The service is the source of truth.

## Why observe instead of push?

Opstage is not a configuration center (see [Opstage](../concepts/opstage)). Real services already get their config from the right places — env vars, secret managers, vendor APIs, on-disk files. Trying to centralize config in Opstage would either duplicate or fight those sources.

Observing instead means:

- operators can **see** what config a service is using right now;
- the audit trail records when reported config changed;
- Opstage stays out of the path of secret distribution.

## Declaring a config source (Node SDK)

```ts
agent.registerConfigSource("capi-chatgpt", async () => ({
  upstream: process.env.UPSTREAM_URL,
  timeoutMs: Number(process.env.UPSTREAM_TIMEOUT_MS ?? 15000),
  modelDefault: process.env.MODEL_DEFAULT ?? "gpt-4o-mini",
}));
```

The function is called when the agent prepares a service report. Returned values are sent verbatim.

## What to report — and what not to

**Do report:**

- non-secret toggles, model names, timeouts, feature flags;
- upstream identifiers (URLs, account IDs);
- versioned input parameters that affect behavior.

**Do not report:**

- API keys, tokens, passwords, cookies;
- raw credentials of any kind;
- PII.

If you must surface that a secret *exists*, report something like `{ apiKey: "***configured***" }` — never the actual value.

## Multiple config groups

Larger services can expose multiple named config groups. Operators see them as tabs in the **Configs** tab of the service drawer. (The exact API for grouped configs is part of the v0.1 contract; see [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node).)

## Change auditing

When the reported config changes between two consecutive reports, Opstage writes an audit event (`service.config.changed`). The audit captures *that* it changed, not the secret values themselves.
