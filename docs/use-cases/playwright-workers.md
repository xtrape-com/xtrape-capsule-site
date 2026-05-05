# Use Case: Playwright Workers

## Problem

Browser-based workers (Playwright, Puppeteer) drive long-lived sessions on behalf of automation tasks. Each worker:

- often holds a logged-in browser session,
- crashes occasionally,
- needs operators to "restart this one", "re-login this one", or "rotate the proxy",
- runs on a laptop, a small VM, or behind NAT — nothing inbound-routable.

Without a control plane, operators SSH around or chase logs.

## How Capsule helps

Run each worker (or each pool of workers) as a Capsule Service with an embedded Agent:

- The Agent makes outbound calls to Opstage; no inbound port required.
- Health reflects browser session state (logged in / logged out / crashed).
- Actions: `restartBrowser`, `relogin`, `rotateProxy`, `dumpScreenshot`.
- Configs report current proxy, current account label (never the password).

## Typical Architecture

```text
Laptop / small VM:
  ┌───────────────────────────┐
  │  Playwright Worker        │
  │   ├─ Agent (outbound)     │
  │   └─ Browser session      │
  └────────────┬──────────────┘
               │ outbound only
               ▼
        Opstage Backend
```

## What Opstage can show

- Live online/offline status of every worker.
- Health: is the browser session alive and logged in?
- Recent actions and their results (e.g. last `relogin`).
- Audit of who triggered what.

## What Opstage can do

- Restart / re-login / rotate proxy from the console.
- Disable a worker that's misbehaving.
- Compare config across the fleet.

## Next steps

- [Build your first Capsule Service](../getting-started/first-capsule-service)
- [Health Reporting](../agents/health-reporting)
