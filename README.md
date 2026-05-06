# xtrape-capsule-site

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./docs/legal.md)
[![Status: Public Review](https://img.shields.io/badge/status-Public%20Review-orange.svg)](https://xtrape-com.github.io/xtrape-capsule-site/roadmap)
[![Live site](https://img.shields.io/badge/site-xtrape--com.github.io-blue.svg)](https://xtrape-com.github.io/xtrape-capsule-site/)
[![Built with VitePress](https://img.shields.io/badge/built%20with-vitepress-646cff.svg)](https://vitepress.dev/)

Public website and documentation for **Xtrape Capsule** — a lightweight control
plane for AI-era Capsule Services.

🌐 Live site: <https://xtrape-com.github.io/xtrape-capsule-site/>

This is the public docs site. Source for the platform itself lives in:

- [`xtrape-capsule-ce`](https://github.com/xtrape-com/xtrape-capsule-ce) —
  Opstage CE (backend, UI, deploy)
- [`xtrape-capsule-agent-node`](https://github.com/xtrape-com/xtrape-capsule-agent-node)
  — Node embedded Agent SDK
- [`xtrape-capsule-contracts-node`](https://github.com/xtrape-com/xtrape-capsule-contracts-node)
  — Shared Zod / TS contracts

## Stack

VitePress + TypeScript + Markdown.

## Local development

```bash
pnpm install
pnpm docs:dev          # http://localhost:5173
```

## Build

```bash
pnpm docs:build        # output: docs/.vitepress/dist
pnpm docs:preview      # serve the built site locally
```

## Deploy

The site is deployed by the GitHub Actions workflow in
`.github/workflows/deploy.yml`. Pushing to `main` rebuilds and publishes to
GitHub Pages.

To deploy manually:

```bash
pnpm docs:build
# upload docs/.vitepress/dist to your hosting target
```

## Layout

```text
docs/
├── index.md                 # homepage (hero + module overview)
├── getting-started/         # quick start, install, first capsule service
├── concepts/                # capsule service / opstage / agent / registration / contract
├── opstage-ce/              # CE-specific deployment, configuration, admin UI, backup
├── agents/                  # agent SDK pages
├── contracts/               # contract-level reference
├── use-cases/               # integration services / Playwright workers / account pool / AI agent runtime
├── editions/                # CE / EE / Cloud
├── security/                # token model, agent security, overview
├── roadmap.md
├── faq.md
└── glossary.md

blog/                        # release posts
docs/public/                 # static assets copied by VitePress
.github/workflows/deploy.yml # CI deploy to GitHub Pages
```

## Contributing docs

1. Fork or branch.
2. Edit Markdown under `docs/`.
3. Run `pnpm docs:dev` and check your changes.
4. Run `pnpm docs:build` before opening a PR.
5. Open a PR; CI will rebuild on merge.

Style guidance:

- Lean technical, not marketing.
- Concrete examples beat abstract definitions.
- Don't expose internal naming, business strategy, or non-public roadmaps.

## License and trademarks

Code snippets and technical documentation in this site are licensed under
**Apache-2.0**, the same license as the rest of the Xtrape Capsule repositories.

**Xtrape**, **Xtrape Capsule**, **Opstage**, and related logos or marks are
trademarks or planned trademarks of their respective owners. The open-source
license does **not** grant trademark rights — see
[docs/legal.md](./docs/legal.md) for the full statement.
