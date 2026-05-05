# Manifest

A **Capsule Service manifest** is the small, stable identity record a service publishes to Opstage when its agent reports.

## Required fields

```ts
type CapsuleServiceManifest = {
  code: string;          // stable identifier, unique within the workspace
  name: string;          // human label
  version: string;       // semver
  description?: string;
  actions?: ActionDeclaration[];   // action catalog (see Actions)
  configs?: ConfigGroupDeclaration[];
};
```

## `code`

`code` is the stable identifier across restarts and across agents. Two services with the same `code` in the same workspace are treated as the **same service**, regardless of which agent reports them. This lets a service migrate between agents without losing identity in audit and history.

## `version`

Use semver. Opstage surfaces the version in the UI and writes audit when it changes.

## `actions` and `configs`

The manifest carries a **catalog** — labels, descriptions, declared input schemas. The runtime values (current state, dynamic schemas, current configs) come at request time via separate calls. See [Actions](./actions) and the [Action Model](../agents/action-model).

## Lifecycle

- **First report:** Opstage creates the service record.
- **Subsequent reports:** Opstage updates fields; if `code` matches an existing record (even on a different agent), the record is reused.
- **Stale:** if no report arrives within `OPSTAGE_SERVICE_STALE_THRESHOLD_SECONDS`, `effectiveStatus` becomes `STALE`.
- **Offline:** if the owning agent is offline, services move to `STALE` (and eventually surface as offline in the UI).

## Don't put secrets in the manifest

The manifest is *visible to every operator*. Treat it like a public README: useful labels, schema-shaped action declarations, version metadata — never credentials.
