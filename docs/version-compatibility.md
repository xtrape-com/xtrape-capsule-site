# Version compatibility

This page is the authoritative cross-package matrix during Public Review
and Public Preview. Pin matching `0.1.x` versions across the four
packages.

## v0.1 Public Review (current)

| Package | Version | Distribution | Where it runs |
| --- | --- | --- | --- |
| `xtrape-capsule-ce` | `0.1.0` | source build via Docker Compose; GHCR image is for validation only | The Opstage backend + UI |
| `@xtrape/capsule-agent-node` | `0.1.0-public-review.1` | npm dist-tag `public-review` | Inside your Capsule Service process |
| `@xtrape/capsule-contracts-node` | `0.1.0-public-review.1` | npm dist-tag `public-review` | Build-time dep of CE and the Agent SDK; runtime dep wherever you validate the wire shape |
| `xtrape-capsule-demo` | matches `0.1.x` | source clone | Optional reference Capsule Service |
| `xtrape-capsule-site` | matches | <https://xtrape-com.github.io/xtrape-capsule-site/> | This site |

### Recommended install

```bash
# CE backend + UI (source build, current path)
git clone https://github.com/xtrape-com/xtrape-capsule-ce.git
cd xtrape-capsule-ce
docker compose -f deploy/compose/docker-compose.yml up --build -d

# Agent SDK + Contracts (npm, public-review dist-tag)
pnpm add @xtrape/capsule-agent-node@public-review \
         @xtrape/capsule-contracts-node@public-review \
         zod
```

## v0.2 Public Preview (planned)

When the `v0.2.0 Public Preview` cut lands, the table shifts to:

| Package | Version | Distribution |
| --- | --- | --- |
| `xtrape-capsule-ce` | `0.2.0` | GHCR image `ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0` becomes the primary documented path; source build remains supported |
| `@xtrape/capsule-agent-node` | `0.2.0` | npm `latest` (still also tagged on the rolling stream during transition) |
| `@xtrape/capsule-contracts-node` | `0.2.0` | npm `latest` |
| `xtrape-capsule-demo` | matches `0.2.x` | source clone, optional GHCR image |
| `xtrape-capsule-site` | matches | this site |

Do not mix `0.1.x` and `0.2.x` across the four packages; the wire protocol
may still add fields between v0.1 and v0.2.

## Wire protocol stability

See the [Contracts overview](./contracts/overview) for the per-schema
stability rating (Stable / Evolving / Provisional) and the additive-vs-
breaking-change policy. Until `v1.0`, expect minor versions to introduce
additive optional fields freely. Required-field changes will be staged
through a deprecation cycle.

## Upgrading

- **`0.1.x` → `0.1.y`** (same minor): pull the new package versions; no
  data migration required. Read the per-repo `CHANGELOG.md`.
- **`0.1.x` → `0.2.x`**: pin versions, read the v0.2 release notes
  (will land at `docs/releases/v0.2.0.md` when cut), and run the
  upgrade workflow documented in [Backup and Upgrade](./opstage-ce/backup-and-upgrade).

## Where to look first when versions disagree

If you see schema-validation errors at the agent ↔ backend boundary, the
fastest diagnostic step is to check the Contracts version on both sides.
A CE built from `0.1.x` source will reject `agent.register` calls that
include fields only introduced in `0.2.x` — and vice versa, a `0.2.x`
agent may not produce all the fields a `0.2.x` CE expects.

```bash
pnpm list @xtrape/capsule-contracts-node --depth 0
```

If the version is unexpectedly low, your lockfile may have pinned an
older one; re-run with `pnpm install --force` after correcting the
package.json range.
