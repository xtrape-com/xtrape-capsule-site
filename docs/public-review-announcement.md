# Public Review Announcement

> **Status:** Public Review · pre-`v0.1.0 Public Preview`.
> APIs, contracts, deployment instructions, and SDK interfaces may still
> change before the `v0.1.0` cut.

## What this is

**Xtrape Capsule** is a lightweight, self-hosted, agent-based runtime
governance control plane for Capsule Services — small services, automation
workers, integration adapters, background jobs, private tools, and AI Agent
runtimes that connect to a single **Opstage** console through an embedded
**Agent SDK**.

We're inviting **Public Review** before the `v0.1.0 Public Preview` release
cut. This means:

- The four public repositories are open and runnable.
- Contracts and SDK packages are published to npm under the
  `public-review` dist-tag.
- Docker images are built on every push to `main` and pushed to GHCR.
- Documentation, README content, and deployment guides are stable enough
  to follow end-to-end.

The pieces that are still moving:

- Wire protocol may shift in additive minor versions before `v1.0`.
- The agent token cache and a handful of helpers (`newId`, `apiList`) are
  marked **provisional** in the
  [Schema Stability table](https://xtrape-com.github.io/xtrape-capsule-site/contracts/overview).
- A few v0.2 polish items are tracked as open issues across the repos.

## What we're asking from reviewers

1. **Run the Quick Start.** Build CE from source via Docker Compose,
   sign in, and create a registration token. See
   [Quick Start](./getting-started/quick-start).
2. **Connect a service.** Either follow the
   [first Capsule Service guide](./getting-started/first-capsule-service)
   or clone `xtrape-capsule-demo` and run it as-is.
3. **Try a full action lifecycle.** Trigger the demo `echo` action,
   watch the command transition `PENDING → RUNNING → SUCCEEDED`, then
   inspect the audit trail.
4. **Tell us what broke.** File issues against the relevant repository:
   - CE backend / UI / deployment → [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce)
   - Agent SDK behavior → [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
   - Contract / Zod schema mismatches → [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node)
   - Docs / site → [`xtrape-capsule-site`](https://github.com/xtrape-com/xtrape-capsule-site)

We are particularly interested in feedback on:

- Quick Start friction in fresh environments (Docker / port / env-var
  surprises).
- Cases where the SDK API doesn't match the docs.
- Public-facing wording — we want the site to be technically accurate and
  free of internal-engineering shorthand.
- Security model edge cases — see [Security Overview](./security/overview)
  for the deployment checklist; if you find a path we missed, please file
  a private security report per each repo's `SECURITY.md`.

## What we are explicitly **not** ready for

- **Business-critical HA production.** CE is single-node with SQLite. HA
  belongs to the future Enterprise Edition.
- **Public-internet exposure without a hardening layer.** No built-in IP
  allow-list, no rate-limit on admin login, no SSO. Put Opstage behind a
  reverse proxy with SSO / VPN.
- **Regulated environments requiring compliance controls.** Audit and
  RBAC are present but not certified.

## Cross-package compatibility

| Package | This release | npm dist-tag |
| --- | --- | --- |
| `xtrape-capsule-ce` | `0.1.0` | n/a (Docker image) |
| `@xtrape/capsule-agent-node` | `0.1.0-public-review.0` | `public-review` |
| `@xtrape/capsule-contracts-node` | `0.1.0-public-review.0` | `public-review` |
| `xtrape-capsule-demo` | matches | n/a |
| `xtrape-capsule-site` | matches | n/a |

Pin matching `0.1.x` minors across the four during Public Review.

## What changes between Public Review and Public Preview

When the `v0.1.0 Public Preview` cut lands, expect:

1. The npm `latest` dist-tag will start tracking the matching version
   (today `latest` and `public-review` point at the same prerelease).
2. The git tag `v0.1.0` and the GHCR image tag `0.1.0` will be promoted
   from the current pre-release artifacts.
3. The site will switch [Quick Start](./getting-started/quick-start) and
   [Install](./getting-started/install-opstage-ce) to the published image
   path as the primary instruction.
4. A changelog entry per repo will pin the cut.

## Get started

- [Quick Start](./getting-started/quick-start)
- [Build your first Capsule Service](./getting-started/first-capsule-service)
- [Demo](./getting-started/demo)
- [Roadmap](./roadmap)
- [v0.1.0 release notes](./releases/v0.1.0)
