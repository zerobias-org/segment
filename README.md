# Segment monorepo

ZeroBias segment artifacts — product categorization. Each `package/<vendor>/<code>/` directory is one publishable segment (e.g. `zerobias/t_waf`).

## Authentication

Set `ZB_TOKEN` in your environment to authenticate with the npm registry.

## Build & validate

This repo is on the gradle + [zbb](https://github.com/zerobias-org/devops) publish pipeline.

```bash
./gradlew :<vendor>:<code>:validateContent   # file-shape only
./gradlew :<vendor>:<code>:gate              # full gate (writes gate-stamp.json)
```

## Naming (depth 2, verbatim)

- dir: `package/<vendor>/<code>/` → `zerobias/t_waf`
- npm: `@zerobias-org/segment-<vendor>-<code>` (verbatim, underscores preserved)
- `zerobias.package`: `<vendor>.<code>.segment`

## Creating a new segment

```bash
sh scripts/createNewSegment.sh ...
```

Then fill `index.yml`, drop the gradle marker (`echo 'plugins { id("zb.content") }' > package/<v>/<c>/build.gradle.kts`), and `./gradlew :<v>:<c>:gate`.

## Publishing

`.github/workflows/publish.yml` invokes `zerobias-org/devops/.github/workflows/zbb-publish-reusable.yml@main` on push to `main`/`qa`/`dev`/`uat`.

## Commit format

[Conventional Commits](https://www.conventionalcommits.org/), commitlint-enforced. Scope: `segment-<vendor>-<code>`.

## Prerequisites — GitHub token with `read:packages`

Required before **any** gradle / `zbb` command (compile, validation, tests,
`gate`, publish): the `zb.*` gradle plugins resolve from GitHub Packages
Maven, which refuses anonymous reads even though `com.zerobias.build-tools`
is public. Nothing needs granting to you and no org membership is involved —
but **being logged in to `gh` is not enough, the scope is separate**:

```bash
gh auth status 2>&1 | grep -q 'read:packages' && echo OK || echo 'MISSING read:packages'
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)   # the fix
```

Without it the build fails on its first request with a 401 /
`Plugin [id: 'zb.workspace'] was not found`, before any package file is read.
See `CLAUDE.md` for the full note.
