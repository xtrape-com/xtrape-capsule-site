# Contracts Overview

The **Capsule Contracts** are the shared schemas, error envelopes, and OpenAPI specifications that govern every interaction between Agents, Capsule Services, and Opstage.

- Repository: [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node)
- Package: `@xtrape/capsule-contracts-node`
- Format: TypeScript types + Zod schemas, generated from / aligned with the OpenAPI document.

## What's in the contract

| Area | Pages |
| --- | --- |
| Service identity | [Manifest](./manifest) |
| Health | [Health](./health) |
| Operations | [Actions](./actions) |
| Failures | [Errors](./errors) |

## Why a separate package

Both Opstage and the Agent SDK depend on the same shapes — request bodies, response envelopes, enum values, error codes. Pulling them into one package means:

- the backend, UI, and SDK all import the same Zod schemas;
- breaking changes are visible at version-bump time;
- third-party SDKs (future Python/Go agents) can target a stable, documented spec instead of reverse-engineering responses.

## Versioning

The contracts package follows semver:

- **patch** — additive optional fields, doc fixes;
- **minor** — additive endpoints / fields, new enum values gated by feature flags;
- **major** — wire-incompatible changes, with a migration note.

Opstage CE and the Agent SDK declare a compatible contracts range; mismatches surface at startup.

## Stability today

Contracts are at v0.x while we stabilize Opstage CE. Frozen v1 is part of [Roadmap → v0.3 Capsule Events and Capability Metadata](../roadmap).
