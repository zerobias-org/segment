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
