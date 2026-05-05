# Actions

This page is the **contract-side** description of actions. For the operational view, see [Action Model](../agents/action-model).

## Catalog declaration (in the manifest)

```ts
type ActionDeclaration = {
  name: string;                    // unique within a service
  label: string;
  description?: string;
  requiresConfirmation?: boolean;
  inputSchema?: JSONSchema;        // catalog-time schema
};
```

## Prepare response (`GET .../actions/:name`)

```ts
type ActionPrepareResponse = {
  action: {
    name: string;
    label: string;
    requiresConfirmation: boolean;
    inputSchema: JSONSchema;       // dynamic; may refine the catalog schema
  };
  initialPayload: unknown;
  currentState: {
    service: { code: string; status: ServiceStatus };
    [key: string]: unknown;
  };
  prepareCommand: {
    id: string;
    type: "ACTION_PREPARE";
    status: "SUCCEEDED";
  };
};
```

## Execute request (`POST .../actions/:name`)

```ts
type ActionExecuteRequest = {
  payload: unknown;          // validated against the dynamic schema
  confirmation?: boolean;    // required when requiresConfirmation === true
};
```

## Execute response

```ts
type ActionExecuteResponse = {
  command: {
    id: string;
    type: "ACTION_EXECUTE";
    status: "PENDING" | "RUNNING";
  };
};
```

The console then polls the command until it reaches a terminal state (`SUCCEEDED`, `FAILED`, `CANCELLED`).

## Command result envelope

```ts
type CommandResult =
  | { success: true; output?: unknown }
  | { success: false; error: { code: string; message: string; details?: unknown } };
```

See [Errors](./errors) for the error envelope used across the API.
