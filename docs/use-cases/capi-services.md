# Use Case: CAPI Services

## Problem

Most AI products end up running a small army of **CAPI services** — thin bridges that translate between an internal contract and a vendor API (OpenAI, Anthropic, vendor-X). Each one:

- holds a vendor key,
- has its own rate limits and outages,
- needs careful version control of "which model" or "which API version" it's pinned to,
- is too small to deserve its own admin panel.

Operators end up with 10–50 of them and no good way to answer "which one is up, what is it pinned to, who rotated its key, when".

## How Capsule helps

Make each CAPI service a Capsule Service:

- Embed the Node Agent.
- Report version + pinned model + upstream URL via [config reporting](../agents/config-reporting).
- Expose a `rotateKey` action with a confirmation gate.
- Expose a `runHealthCheck` action that calls the vendor.

## Typical Architecture

```text
[ Internal client ] → [ CAPI Service ] → [ Vendor API ]
                              │
                       Agent (embedded)
                              │
                              ▼
                       Opstage Backend ← Opstage UI
```

## What Opstage can show

- All CAPI services in one list, with `effectiveStatus`.
- Per-service: which model, which upstream, last health, last key rotation.
- Audit trail of every key rotation and every action invocation.

## What Opstage can do

- Trigger `rotateKey` from the console (with confirmation).
- Disable an agent (and therefore the CAPI bridge) when a vendor key is suspected leaked.
- Show recent commands and their results inline.

## CE scope

In CE today you get:

- live inventory of every CAPI bridge and its `effectiveStatus`,
- health probes per bridge,
- audited operator actions (`rotateKey`, `runHealthCheck`, etc.),
- audited config drift between reports.

## Future EE / Cloud enhancements

- Secret Vault integration so vendor keys can be fetched on demand instead of pinned in env.
- Cross-team RBAC on which bridges an operator can rotate.
- Aggregated quota / cost views across bridges.
- Hosted Cloud Opstage so multiple environments (dev/stage/prod) share one console.

## Next steps

- [First Capsule Service](../getting-started/first-capsule-service)
- [Action Model](../agents/action-model)
- [Token Model](../security/token-model) — why your vendor key never leaves the service.
