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

## GitHub token — `read:packages` (required for EVERY zbb/gradle command)

This repo resolves its gradle plugins (`zb.workspace`, `zb.base`,
`zb.content`) from **GitHub Packages Maven**, so the token gates the whole
zbb toolchain — compile, validation, tests, `gate`, publish — not one task.

`com.zerobias.build-tools` is a **public** package, but GitHub Packages Maven
refuses **anonymous** reads. This is a registry requirement, not a permission
one: nothing has to be granted to anyone and no org membership is involved.
Any GitHub account whose token carries `read:packages` can read it.

**Being logged in to `gh` is NOT enough — the scope is separate, and an
authenticated-but-unscoped token is the usual false pass.** Assert the scope,
not the login:

```bash
gh auth status 2>&1 | grep -q 'read:packages' && echo OK || echo 'MISSING read:packages'
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)   # the fix
```

Definitive check — proves the read (200 = ready, 401 = scope missing):

```bash
curl -s -o /dev/null -w '%{http_code}\n' -u "x:$(gh auth token)" \
  https://maven.pkg.github.com/zerobias-org/util/zb/workspace/zb.workspace.gradle.plugin/maven-metadata.xml
```

**Agent rule — do not report this as a blocker.** A 401 from
`maven.pkg.github.com`, `Plugin [id: 'zb.workspace'] was not found`, or
`Could not resolve com.zerobias.build-tools` is a KNOWN, SELF-FIXABLE state.
It lands on the very first request (plugins pin `1.+`, so `maven-metadata.xml`
is fetched before any package file is read). Run the refresh above and retry.
Never present it as an environment limitation, never silently downgrade to
`validateContent`-only, and never write "validation deferred to CI" — a
package whose gate never ran cannot publish.

⚠ Machines that have run `publishToMavenLocal` on build-tools are silently
exempt (`mavenLocal()` is first in the resolution order). Clean, CI and
container environments have no `~/.m2` and always need the scope — never
conclude it is unnecessary because a developer machine worked. An INVALID
`GITHUB_TOKEN` also silently shadows a valid keyring login (`gh auth status`
exposes it).
