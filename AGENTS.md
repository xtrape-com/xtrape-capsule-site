# AGENTS.md

## Repository Role

This repository owns the public documentation and site for Xtrape Capsule.

Primary responsibilities:

- public docs
- getting-started guides
- version compatibility
- release notes
- roadmap
- troubleshooting
- architecture/concept docs
- edition descriptions
- deployment docs
- marketing-facing technical guidance

The site should accurately reflect implemented and released behavior.

## Non-goals

Do not implement product runtime behavior here.

Do not add:

- CE backend logic
- Agent SDK implementation
- OpHub implementation
- demo service code
- contract schemas
- unpublished claims presented as released facts

This repository documents the product. It should not define protocol behavior without corresponding implementation in the proper repository.

## Documentation Accuracy Rules

Docs must not promise features that are not implemented or not released.

Before documenting a feature as available, verify the related implementation exists in the appropriate repository.

If a feature is planned but not shipped, mark it clearly as:

```text
planned
experimental
release candidate
not included
future
```

## Version / Release Train Rules

Xtrape Capsule uses matching minor versions across public packages.

During development:
- Before starting implementation, run `git fetch --all --prune` and check whether the current branch is behind its upstream. Pull or rebase the latest upstream code before editing, unless local uncommitted work must first be stashed or committed.
- Do not assume unpublished npm versions exist.
- Do not set dependencies to versions such as `^0.3.0` before that version is published.
- Use GitHub branch dependencies, local workspace linking, or npm prerelease packages when needed.
- Release candidates should use `0.3.0-rc.x` with the `next` npm dist-tag.
- Final releases should use semver versions with the `latest` npm dist-tag.

Recommended release order:

```text
1. contracts-node
2. agent-node
3. CE
4. OpHub
5. demo
6. site
```


## Roadmap Rules

Current roadmap direction:

```text
v0.2 Developer Experience & Runtime Maturity
v0.3 OpHub Runtime, Capsule Events and Capability Metadata
v0.4 Capsule Bus Experimental
v0.5 Capsule Catalog
v0.6 Capsule Registry
v0.7 Private Capsule Marketplace
v1.0 CE Stable and Ecosystem Foundation
```

If roadmap naming changes, update all affected pages consistently.

## Dependency Policy

This is a documentation site.

Keep dependencies limited to documentation/site tooling.

Avoid:

- importing runtime packages just to document them
- depending on CE internals
- depending on demo code
- generating docs from unpublished runtime branches unless explicitly part of a docs task

## Development Commands

Common commands:

```bash
pnpm install
pnpm docs:dev
pnpm docs:build
```

Before claiming site changes are complete, run:

```bash
pnpm docs:build
```

## Review Expectations

When changing docs, check:

- internal links
- nav visibility
- release status wording
- version compatibility matrix
- Docker tag accuracy
- npm dist-tag accuracy
- code block correctness
- whether screenshots/placeholders are clearly marked
- whether CE/SDK/contracts/demo behavior is accurately represented

## Documentation Style

Prefer:

- concrete commands
- exact version numbers
- explicit release status
- tables for compatibility
- warnings for unstable features
- clear distinction between CE/EE/Cloud
- clear distinction between Embedded Agent and OpHub-managed mode

Avoid:

- vague “coming soon” claims without version context
- overpromising commercial features
- calling experimental features stable
- referencing unavailable Docker/npm artifacts
- copying implementation details that may drift quickly

## AI Safety Rules

When working in this repository:

- Do not invent product behavior.
- Do not document future behavior as shipped.
- Do not claim `latest` Docker image is published unless verified.
- Do not claim npm `latest` release exists before publish.
- Do not describe OpHub as stable before it is accepted as stable.
- Do not remove release-candidate warnings prematurely.
- Do not change version compatibility rules without checking the release train.
- Keep docs consistent with implementation PRs.

## PR Checklist

- [ ] `pnpm docs:build` passes.
- [ ] Version compatibility is accurate.
- [ ] Release notes match actual implementation.
- [ ] Docker/npm tag claims are accurate.
- [ ] Roadmap wording is consistent.
- [ ] Internal links resolve.
- [ ] Experimental/planned features are clearly marked.
- [ ] Site docs are merged after implementation PRs when release facts matter.
