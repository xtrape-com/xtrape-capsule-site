# Use Case: AI Agent Runtime

## Problem

Modern AI agents are long-lived loops: a planner, some tools, some memory, occasional human-in-the-loop. Operators need to know:

- is the agent alive,
- is it stuck (no progress in N minutes),
- which tools are wired up,
- can I pause it,
- can I send it a one-off instruction,
- what's in its audit trail.

Bare scripts don't answer those questions. Heavy platforms are overkill.

## How Capsule helps

Wrap the runtime as a Capsule Service:

- Health: alive + last-progress timestamp.
- Configs: which model, which toolset, current goal.
- Actions: `pause`, `resume`, `cancelTask`, `injectInstruction`, `dumpMemory`.
- Audit: every operator intervention is recorded.

## Typical Architecture

```text
[ AI Agent Runtime ]
   ├─ Planner / loop
   ├─ Tools
   ├─ Memory
   └─ Agent (outbound to Opstage)
```

## What Opstage can show

- Online status and last progress timestamp.
- Current goal / task summary (whatever the runtime chooses to report).
- Recent actions and their results.

## What Opstage can do

- Pause and resume the loop with confirmation.
- Inject a one-off instruction (via an action with a freeform string field).
- Cancel a stuck task; the agent reports the cancellation result back.

## CE scope

- Online status and last-progress timestamp.
- Current goal / task summary, surfaced from whatever the runtime chooses to report.
- Operator actions: `pause`, `resume`, `cancelTask`, `injectInstruction`, `dumpMemory`.
- Audit of every operator intervention.

## Future EE / Cloud enhancements

- Approval workflows for high-impact actions (e.g. `injectInstruction` requires a second approver).
- Cross-runtime rollups for fleets of agents.
- Hosted Cloud Opstage so runtimes deployed across customer environments share one console.

## Next steps

- [Action Model](../agents/action-model)
- [Health Reporting](../agents/health-reporting)
