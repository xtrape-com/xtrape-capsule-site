# Errors

Every non-2xx response from Opstage carries a stable **error envelope**. Codes are identifiers; messages are human-readable.

## Envelope

```ts
type ErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
```

HTTP status codes follow the usual semantics:

| Status | Meaning |
| --- | --- |
| `400` | Validation failure |
| `401` | Missing/invalid credentials |
| `403` | Authenticated but not allowed (RBAC, CSRF, disabled agent) |
| `404` | Resource does not exist |
| `409` | Conflict (e.g. duplicate `code`) |
| `410` | Gone (e.g. command expired) |
| `5xx` | Server-side error |

## Common codes

| Code | When |
| --- | --- |
| `VALIDATION_FAILED` | Body fails Zod validation; `details.issues` enumerates them |
| `UNAUTHORIZED` | No / invalid session or agent token |
| `CSRF_INVALID` | UI mutation without a valid `X-CSRF-Token` |
| `FORBIDDEN_ROLE` | RBAC denied |
| `AGENT_DISABLED` | Agent is disabled by an operator |
| `AGENT_NOT_FOUND` | The agent record no longer exists |
| `REGISTRATION_TOKEN_EXPIRED` | Registration token past `expiresAt` |
| `REGISTRATION_TOKEN_REVOKED` | Registration token revoked |
| `SERVICE_NOT_FOUND` | Capsule Service does not exist in this workspace |
| `ACTION_NOT_FOUND` | Action is not declared in the catalog |
| `ACTION_REQUIRES_CONFIRMATION` | Execute body lacks `confirmation: true` |
| `COMMAND_NOT_FOUND` | Command id unknown |
| `COMMAND_EXPIRED` | Command past its TTL before the agent picked it up |
| `INTERNAL_ERROR` | Unhandled server error |

## Client-side handling

UIs should:

- treat `401` as "log in again";
- transparently refresh CSRF and retry once on `403 CSRF_INVALID`;
- display a friendly mapping of `error.code` to human copy (with `error.message` as fallback);
- never assume an unrecognized code is safe to ignore — surface it to the user.

## Adding new codes

New codes are additive (minor version bumps in the contracts package). Removing or renaming an existing code is a breaking change.
