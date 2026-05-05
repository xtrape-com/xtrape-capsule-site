# Health Reporting

Health is a coarse, operator-facing signal — not a metrics system. Each Capsule Service reports one of a small set of states; Opstage shows it back in the console and stores it in audit.

## Health states

| State | Meaning |
| --- | --- |
| `HEALTHY` | The service believes it can do its job right now. |
| `UNHEALTHY` | The service cannot do its job (e.g. upstream unreachable). |
| `UNKNOWN` | The service has not yet computed a health value. |
| (derived) `STALE` | The service has not reported recently. |
| (derived) `OFFLINE` | The owning agent is offline. |

`STALE` and `OFFLINE` are computed by the backend, not reported by the agent.

## Declaring a health check (Node SDK)

```ts
agent.registerHealthCheck("integration-worker", async () => {
  try {
    await fetch(process.env.UPSTREAM_URL!, { method: "HEAD" });
    return { status: "HEALTHY" };
  } catch (err) {
    return { status: "UNHEALTHY", message: String(err) };
  }
});
```

The check runs on the heartbeat cadence; the result is reported with the next service report.

## Optional fields

```ts
return {
  status: "HEALTHY",
  message: "ok",            // short human-readable summary
  details: {                // arbitrary JSON, surfaced in the UI Health tab
    upstreamLatencyMs: 42,
    sessions: 3,
  },
};
```

## What good health checks look like

- **Cheap.** They run on every heartbeat; treat them as `HEAD`-style probes, not load tests.
- **Local.** They check the dependencies *your service* depends on, not the broader network.
- **Honest.** A "shallow" healthy status that ignores a known broken dependency is worse than `UNHEALTHY`.
- **Fast to time out.** A health check stuck for 30s blocks the heartbeat. Wrap calls with short timeouts.

## What Opstage does with health

- Surfaces it in **Capsule Services** lists and detail drawers.
- Combines it with agent state to compute `effectiveStatus`.
- Writes audit events when the state transitions.
- **Does not** auto-restart or auto-page. CE is a control plane, not a watchdog.
