---
name: migrate-packages
description: Migrate the next batch of segment packages onto the gradle pipeline. Drops per-package build.gradle.kts marker, ensures .npmrc, runs full ./gradlew :<path>:gate, fixes drift, major-bumps the version, commits per-package.
argument-hint: "[<vendor>/<code>...] [--batch=N] [--dry-run]"
---

# Migrate Segment Packages

Per-repo companion to `/migrate-content-to-zbb`. Migrate segment (product-category) packages within `org/segment`.

**Depth 2** (`package/<vendor>/<code>/`):

| Path | Sample | npm name | `zerobias.package` |
|---|---|---|---|
| `package/<v>/<c>/` | `zerobias/t_waf` | `@zerobias-org/segment-<v>-<c>` | `<v>.<c>.segment` |

Identity is **verbatim** (underscores in `<code>` preserved). The validator (`build.gradle.kts`) enforces it.

## Per-package loop

1. Drop `package/<v>/<c>/build.gradle.kts` = `plugins { id("zb.content") }`.
2. Ensure `.npmrc` — byte-identical to the repo-root `.npmrc` (`cp .npmrc package/<v>/<c>/.npmrc`; never from a sibling). Set every `dependencies` spec to `"*"` (`npm run correct:deps`), then regenerate `npm-shrinkwrap.json` with zero `"resolved"` entries — `npm install --package-lock-only --no-workspaces && mv package-lock.json npm-shrinkwrap.json` inside the package — and make sure it is listed in `package.json` `files[]`. `git add` all of it BEFORE the gate (untracked files are invisible to the stamp's `sourceHash`).
3. `./gradlew :<v>:<c>:gate` (writes the mandatory `gate-stamp.json`).
4. Major-bump (`1.x → 2.0.0`, `0.x → 1.0.0`, `2.x → no-op`).
5. Commit per package: `feat(segment-<v>-<c>)!: migrate to gradle pipeline (<old> → <new>)`. Stage marker + `gate-stamp.json` + `package.json` + `.npmrc` + `npm-shrinkwrap.json` + drift fixes.

Common drift: `package.json name` not `@zerobias-org/segment-<v>-<c>`; `zerobias.package` not `<v>.<c>.segment`; `zerobias.import-artifact` not `segment`; duplicate `id` UUID (`:validateUniqueIds`).

## See also

- Root `build.gradle.kts` — verbatim validator.
- `/migrate-content-to-zbb` — meta-repo bootstrap skill.
