# Cloud

> **Status: Future**

Cloud is the future **hosted SaaS edition** of Opstage. Agents continue to live next to your services; the Opstage control plane runs on managed infrastructure.

::: warning
Cloud is on the roadmap and not yet available. The shape below describes the intent.
:::

## Why a hosted Opstage

- Skip the self-host: no container to run, no DB to back up.
- Get upgrades automatically.
- Use the same Agent SDK and the same contracts as CE/EE — just point at a different backend.

## Architecture

```text
[ Your Capsule Services + Agents ]   ── outbound only ──▶   [ Opstage Cloud ]
                                                                  │
                                                                  ▼
                                                         [ Cloud Console ]
```

- Agents call **outbound** to Cloud. No inbound exposure of your services.
- Cloud holds inventory metadata, coarse health, declared action catalogs, and audit.
- **Cloud does not store customer-side secrets.** Vendor keys, account credentials, cookies, and any other sensitive material remain inside your services. Opstage Cloud only sees what your service chooses to report.

## Who Cloud will be for

- Teams that don't want to operate Opstage themselves.
- Multi-environment setups where a single hosted control plane is more convenient than several self-hosted ones.

## Cadence

Cloud follows CE/EE. Expect a closed alpha after v1.0 CE is stable. If you'd be interested, open a discussion on [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce).
