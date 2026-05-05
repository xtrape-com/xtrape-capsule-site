# Enterprise Edition (EE)

> **Status: Planned · Future**

EE is the future **self-hosted, commercial edition** of Opstage, aimed at companies running larger Capsule fleets with stronger security, scalability, and process requirements.

::: warning
EE is on the roadmap. The capabilities listed here are the intent, not a feature list available today.
:::

## Planned capabilities

- **Org-level RBAC** — fine-grained roles, team-scoped access, approval workflows.
- **SSO / SCIM** — OIDC and SAML-based sign-in; SCIM-driven provisioning.
- **HA deployment** — clustered backend, primary/replica database, no single point of failure.
- **Centralized logs** — structured log shipping to your existing pipeline.
- **Secret Vault integration** — keep credentials out of services entirely; agents fetch on demand.
- **Enterprise audit** — extended retention, immutable export, SIEM bridges.
- **Operations dashboards** — across many Capsule fleets, with cross-team rollups.
- **Long-term support** — pinned versions with extended security backports.

## Who EE will be for

- Companies running Opstage as a shared internal platform.
- Teams that need SSO and SCIM as a hard requirement.
- Operators who must demonstrate compliance audit trails to internal/external auditors.

## Cadence

EE follows CE — when CE v1.0 is stable, EE will be released against it. The exact timeline depends on community adoption and feedback.

## Interest

If your company is considering EE, please open a discussion on [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce). Concrete requirements help shape the roadmap.
