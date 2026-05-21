# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Monorepo of ZeroBias **segment** artifacts — product categorization (taxonomy). Each `package/<vendor>/<code>/` directory is one publishable segment (e.g. `zerobias/t_waf`).

On the **gradle + zbb publish reusable workflow** pipeline. Lerna/nx removed. Sibling reference repos: `org/vendor`, `org/suite`, `org/product`, `org/framework`, `org/standard`, `org/crosswalk`.

## Development Commands

```bash
./gradlew :<vendor>:<code>:validateContent   # file-shape only
./gradlew :<vendor>:<code>:gate              # full gate
./gradlew validateUniqueIds                  # repo-wide id cross-cut
cd package/<vendor>/<code> && npm run correct:deps   # reset deps to latest (tsx)
```

`gate` writes `gate-stamp.json` (publish preflight requires it).

## Package Structure & Naming (depth 2, verbatim)

| | value |
|---|---|
| dir | `package/<vendor>/<code>/` → `zerobias/t_waf` |
| npm `name` | `@zerobias-org/segment-<vendor>-<code>` (verbatim) |
| `zerobias.package` | `<vendor>.<code>.segment` |

Each package carries real `dependencies` (its vendor, parent segment, and segment_type), so per-package `npm-shrinkwrap.json` is kept (mirrors `org/product`).

### Required files per package
- `index.yml` — segment metadata
- `package.json` (with `dependencies` + `zerobias` block), `.npmrc`, `npm-shrinkwrap.json`
- `build.gradle.kts` (`plugins { id("zb.content") }`), `gate-stamp.json`

## Validator philosophy

Dataloader is the source of truth for schema rules. The gate validator only enforces: (1) filesystem ↔ npm-name ↔ `zerobias.package` triangulation (verbatim), and (2) repo-wide unique `id` UUIDs across `package/**/*.yml`.

## Migrating packages

`/migrate-packages` — see `.claude/skills/migrate-packages/SKILL.md`.

## Branches & commits

`main` canonical; `dev`/`qa`/`uat` synced downstream. [Conventional Commits](https://www.conventionalcommits.org/), commitlint-enforced (husky `commit-msg`). Scope: `segment-<vendor>-<code>`.

## CI/CD

`.github/workflows/publish.yml` wraps `zerobias-org/devops/.github/workflows/zbb-publish-reusable.yml@main` (detect → version → publish matrix → update-bundle → sync).

## Related Documentation

- [Root CLAUDE.md](../../CLAUDE.md)
- [org/segment is referenced by product taxonomy] — see [org/product/CLAUDE.md](../product/CLAUDE.md)
- [com/platform/dataloader/CLAUDE.md](../../com/platform/dataloader/CLAUDE.md)
