# Version compatibility

This page is the authoritative cross-package matrix during Public Review
and Public Preview.

**The general rule:** pin matching **minor** versions of `xtrape-capsule-ce`,
`@xtrape/capsule-agent-node`, `@xtrape/capsule-contracts-node`, and
`xtrape-capsule-demo`. Mixing minors across packages is not a supported path.

Currently active lines:

- [`v0.1` — Public Review](#v0-1-public-review)
- [`v0.2` — Public Preview (release candidate)](#v0-2-public-preview-release-candidate)

## v0.1 Public Review {#v0-1-public-review}

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

## v0.2 Public Preview (release candidate) {#v0-2-public-preview-release-candidate}

Release-candidate cut on the `v0.2` branches; final `0.2.0` tag pending the
release-train review checklist. Track the open PRs:
[CE #16](https://github.com/xtrape-com/xtrape-capsule-ce/pull/16),
[agent-node #7](https://github.com/xtrape-com/xtrape-capsule-agent-node/pull/7),
[contracts-node #9](https://github.com/xtrape-com/xtrape-capsule-contracts-node/pull/9).

| Package | RC version | Distribution |
| --- | --- | --- |
| `xtrape-capsule-ce` | `0.2.0-rc.1` | source build from `v0.2` branch; final cut will publish `ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0` (and `:0.2` minor alias) |
| `@xtrape/capsule-agent-node` | `0.2.0-rc.1` | npm `next` dist-tag during rc; `latest` after final cut |
| `@xtrape/capsule-contracts-node` | `0.2.0-rc.1` | npm `next` dist-tag during rc; `latest` after final cut |
| `xtrape-capsule-demo` | `0.2.0-rc.1` | source clone; tracks the v0.2 train via [demo PR #14](https://github.com/xtrape-com/xtrape-capsule-demo/pull/14) |
| `xtrape-capsule-site` | matches | this site |

The wire schemas in `@xtrape/capsule-contracts-node@0.2.x` are unchanged
from `0.1.x` — existing `0.1.x` agents continue to validate against a
`0.2.x` backend — but the **recommended supported path** is matching
`0.2.x` across the published packages. Don't document mixed `0.1.x` /
`0.2.x` usage.

### Recommended install (rc)

```bash
# CE backend + UI — source build from the v0.2 branch during rc
git clone --branch v0.2 https://github.com/xtrape-com/xtrape-capsule-ce.git
cd xtrape-capsule-ce
docker compose -f deploy/compose/docker-compose.yml up --build -d

# Agent SDK + Contracts — rc on the next dist-tag
pnpm add @xtrape/capsule-agent-node@next \
         @xtrape/capsule-contracts-node@next \
         zod
```

After the final `0.2.0` cut, install switches to:

```bash
# CE backend + UI — pinned semver tag
docker pull ghcr.io/xtrape-com/xtrape-capsule-ce:0.2.0

# Agent SDK + Contracts — npm latest
pnpm add @xtrape/capsule-agent-node@^0.2.0 \
         @xtrape/capsule-contracts-node@^0.2.0 \
         zod
```

The CE Docker workflow does **not** publish a `latest` tag. Always pin
to a semver tag (`0.2.0`, `0.2`) for reproducible deployments; use
`edge` only for experimentation against `main`.

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
