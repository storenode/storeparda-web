# Task specs

One file per module/task, written **before** work starts, checked off as work happens.
This is the primary task record for the project — GitHub issues (when used) just link
back here rather than duplicating the content.

## Workflow

1. Before starting a task: create `specs/tasks/<id>-<slug>.md` using the template below.
2. Work the checklist. Commit the spec update alongside the code that satisfies it.
3. When done, set `Status: Completed` in the frontmatter and check every box (or note
   why an item was intentionally skipped/deferred).

## Naming

`M0-foundation.md`, `M1-auth.md`, etc. — module id matches Constitution §5's module list.
Non-module ad-hoc tasks can use a short slug instead, e.g. `hotfix-gst-rounding.md`.

## Template

```markdown
# <Module id> — <Title>

**Status:** Planned | In Progress | Completed
**Est:** <hours> hrs (Constitution §5)

## Definition of Done
- [ ] ...

## Notes
...
```
