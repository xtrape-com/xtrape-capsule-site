# Health

Health is a small enum carried inside each service report. See [Health Reporting](../agents/health-reporting) for how to produce it; this page is the contract-side view.

## Reported shape

```ts
type ReportedHealth = {
  status: "HEALTHY" | "UNHEALTHY" | "UNKNOWN";
  message?: string;
  details?: Record<string, unknown>;
  observedAt: string;     // ISO timestamp
};
```

## Effective status (server-side)

Opstage combines the reported health with agent state and report freshness to compute `effectiveStatus`:

| Inputs | `effectiveStatus` |
| --- | --- |
| Agent online + recent report + `HEALTHY` | `HEALTHY` |
| Agent online + recent report + `UNHEALTHY` | `UNHEALTHY` |
| Agent online + recent report + `UNKNOWN` | `UNKNOWN` |
| Agent online + report older than `OPSTAGE_SERVICE_STALE_THRESHOLD_SECONDS` | `STALE` |
| Agent offline | `STALE` (and eventually suppressed) |

## Audit

Opstage writes audit events on transitions: `service.health.healthy`, `service.health.unhealthy`, `service.health.stale`. The audit captures the transition, not every reported sample.

## Don't use health as a metric

Health is **coarse**. It exists to answer "is this Capsule Service okay right now?". For latency histograms, request rates, or saturation curves, use a metrics system. Opstage CE intentionally does not store time-series.
