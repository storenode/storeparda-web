# Task specs

One file per module/task, written **before** work starts, checked off as work happens.
This is the primary task record for the project — GitHub issues (when used) just link
back here rather than duplicating the content.

## Workflow

1. Before starting a task: create `specs/tasks/<id>-<slug>.md` using the template below.
2. Work the checklist. Commit the spec update alongside the code that satisfies it.
3. When done, set `Status: Completed` in the frontmatter, check every box (or note why
   an item was intentionally skipped/deferred), and set `Version` to `1.0.0`.
4. If a module is revisited later (a follow-up change, a bug fix, a scope addition),
   don't start a new file — bump the `Version` and add a dated entry under that file's
   own `## Changelog`. Each module/feature keeps its own version history this way, e.g.
   M0 stays at whatever version its own changes have earned, independent of M0.5's.

Write every spec assuming the reader has **zero prior context** on this project — no
familiarity with the codebase, the constitution, or earlier modules. Explain what the
feature is, why it exists, and what's explicitly out of scope, not just a checklist.

## Naming

`M0-foundation.md`, `M1-auth.md`, etc. — module id matches Constitution §5's module list.
Non-module ad-hoc tasks can use a short slug instead, e.g. `hotfix-gst-rounding.md`.

## Template

```markdown
# <Module id> — <Title>

**Status:** Planned | In Progress | Completed
**Version:** 1.0.0
**Est:** <hours> hrs (Constitution §5)

## What this is
Plain-language summary for a reader with no prior context: what the feature does,
who sees it, why it exists.

## Scope
What's included — and, just as importantly, what's explicitly NOT included (deferred
to a later module, or out of scope entirely).

## Definition of Done
- [ ] ...

## Changelog
- **v1.0.0** — initial implementation.

## Notes
...
```
