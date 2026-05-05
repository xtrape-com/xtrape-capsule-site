# Security Policy

This repository hosts public documentation. It should not contain secrets, private deployment details, customer data, unpublished credentials, or sensitive screenshots.

## Reporting a vulnerability

Do not open a public issue with exploit details, raw tokens, or sensitive screenshots. Report suspected vulnerabilities privately through the project maintainer channel until a public security contact is published.

## Documentation safety rules

- Never commit raw Registration Tokens, Agent Tokens, admin passwords, API keys, cookies, OTPs, browser session files, or real secret references.
- Use placeholders such as `opstage_reg_...`, `opstage_agent_...`, `[REDACTED]`, or `env://UPSTREAM_API_KEY`.
- Do not document a deployment as internet-safe unless TLS, reverse proxy, auth, and network controls are explicitly described.
- Do not claim npm/Docker artifacts are available until they are published and verified.
- Do not publish screenshots with private hostnames, account emails, customer names, or internal environment names.

## Security-related docs

Security guidance should remain consistent across:

- `docs/security/overview.md`
- `docs/security/token-model.md`
- `docs/security/agent-security.md`
- CE `SECURITY.md`
- Agent SDK `SECURITY.md`
