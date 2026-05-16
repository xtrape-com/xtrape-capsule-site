# Capsule Bus (Experimental)

Capsule Bus is an experimental v0.4 coordination surface. It lets a Capsule Service publish a governed event to Opstage CE, where an operator-managed route may create an action command for a target service.

It is **not** a workflow engine, service mesh, or message broker replacement.

## Minimal flow

1. A service publishes an event envelope such as `demo.item.created`.
2. CE stores the event and writes audit records.
3. CE matches enabled or dry-run route rules.
4. An enabled route creates an `ACTION_EXECUTE` command for the target service/action.
5. Existing Agent SDK or OpHub command polling executes the action.

## Safety posture

- Routes are disabled by default.
- `DRY_RUN` routes should be used before enabling command creation.
- Event and route APIs are marked `v0.4-experimental`.
- Avoid event/action loops; v0.4 is for controlled trials only.

## Enabling the experiment

In CE, Capsule Bus is disabled by default. Enable it only in controlled environments:

```bash
OPSTAGE_CAPSULE_BUS_ENABLED=true
```

Current CE endpoints follow the existing admin/agent API conventions:

- `GET /api/admin/bus/routes`
- `POST /api/admin/bus/routes`
- `GET /api/admin/bus/routes/:routeId`
- `PUT /api/admin/bus/routes/:routeId`
- `DELETE /api/admin/bus/routes/:routeId`
- `GET /api/admin/bus/events`
- `POST /api/agents/:agentId/bus/events`
