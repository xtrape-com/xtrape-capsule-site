# Contributing to xtrape-capsule-site

Thanks for helping improve the public Xtrape Capsule documentation site.

## Development environment

Requirements:

- Node.js 20+
- pnpm 9+

```bash
pnpm install
```

## Local development

```bash
pnpm docs:dev
```

Open the local URL printed by VitePress.

## Required check

Run before opening a PR:

```bash
pnpm docs:build
```

## Documentation style

- Keep pages concrete, technical, and operator-focused.
- Prefer runnable examples over abstract claims.
- Do not claim npm or Docker availability until packages/images are actually published.
- Mark EE/Cloud features as planned/future unless they exist.
- Avoid exposing private strategy, internal customer details, or sensitive screenshots.
- Keep terminology consistent with the public docs: Capsule Service, Opstage, Agent, Registration Token, Agent Token, Command, Action.

## Navigation changes

When adding a page:

1. Add the Markdown file under `docs/`.
2. Add it to `docs/.vitepress/config.ts` if it belongs in top nav or sidebar.
3. Add links from related pages.
4. Run `pnpm docs:build` to catch broken links and syntax errors.

## Screenshots and diagrams

Place static assets under:

```text
docs/public/screenshots/
docs/public/diagrams/
```

Before committing screenshots, remove tokens, usernames, private URLs, account emails, API keys, and environment names.

## PR guidance

Include:

- what pages changed;
- whether navigation changed;
- `pnpm docs:build` result;
- screenshots for visual changes when useful.
