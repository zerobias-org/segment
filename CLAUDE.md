# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The **ZeroBias Segment Repository** contains product/service categorization segments used for organizing the vendor/product catalog. Segments create a hierarchical taxonomy for classifying products by domain, category, tool type, service type, and feature groups.

**Repository Role:** Product Taxonomy - Categorization system for vendor catalog

Segments are published as NPM packages and loaded into the platform via the dataloader to enable product search, filtering, and discovery.

## Architecture

### Segment Hierarchy

```
Domain (d_*)
  └── Category (c_*)
        ├── Tool (t_*)
        ├── Service (s_*)
        └── Feature Group (fg_*)
```

**Segment Types:**
- **Domain (d_)** - High-level technology domains (e.g., Cybersecurity, DevOps)
- **Category (c_)** - Product categories within domains (e.g., Application Security, Network Security)
- **Tool (t_)** - Specific tool types (e.g., SAST, DAST)
- **Service (s_)** - Service types (e.g., Managed Security Service)
- **Feature Group (fg_)** - Feature groupings

### Repository Structure

```
segment/
├── package/zerobias/          # All segment packages
│   ├── d_cs/                  # Domain: Cybersecurity
│   ├── c_as/                  # Category: Application Security
│   ├── c_ns/                  # Category: Network Security
│   ├── t_sast/                # Tool: Static Analysis
│   ├── s_mss/                 # Service: Managed Security
│   └── [130+ more segments]
├── templates/                  # Templates for new segments
├── scripts/                    # Automation scripts
│   ├── createNewSegment.sh    # Create new segment from template
│   ├── validate.ts            # Validate segment structure
│   ├── publish.sh             # Publish segment to NPM
│   └── correctDeps.ts         # Fix dependencies
├── segmentTypes/              # Segment type definitions
├── bundle/                    # Bundle artifacts
└── lerna.json                 # Monorepo configuration
```

## Segment Package Structure

Each segment is an NPM package:

```
package/zerobias/c_as/
├── index.yml                  # Segment metadata
├── logo.svg                   # Segment icon
├── package.json               # NPM package definition
├── npm-shrinkwrap.json        # Locked dependencies
└── CHANGELOG.md               # Version history
```

### index.yml Format

```yaml
id: 546180f3-2f2c-4183-ae62-f04a97eb51bf  # UUID
name: Application Security                 # Display name
description: Application Security          # Description
segmentType: category                      # Type: domain, category, tool, service, feature_group
ownerId: 00000000-0000-0000-0000-000000000000
imageUrl: https://cdn.auditmation.io/logos/zerobias-c_as-segment.svg
code: c_as                                 # Package code
externalId: Application Security           # External identifier
status: published                          # Status: published, draft
parents:                                   # Parent segments
  - d_cs                                   # Parent: Cybersecurity domain
created: '2025-04-09T22:33:51.136417Z'
updated: '2025-04-09T22:33:51.136417Z'
tags: []
environment: prod
hostname: https://api.app.zerobias.com
aliases: []                                # Alternative names
```

### package.json Format

```json
{
  "name": "@zerobias-org/segment-zerobias-c_as",
  "version": "1.0.4",
  "description": "Application Security segment artifact",
  "author": "team@zerobias.com",
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "git@github.com:zerobias-org/segment.git",
    "directory": "package/zerobias/c_as/"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  },
  "files": [
    "index.yml",
    "logo.svg"
  ],
  "auditmation": {
    "dataloader-version": "3.4.5",
    "import-artifact": "segment",
    "package": "zerobias.c_as.segment"
  },
  "dependencies": {
    "@auditlogic/vendor-zerobias": "latest",
    "@zerobias-org/segment-zerobias-d_cs": "latest",
    "@zerobias-org/segment_type-zerobias": "latest"
  }
}
```

## Naming Conventions

### Segment Codes

Format: `{type}_{abbreviation}[_{increment}]`

**Examples:**
- `d_cs` - Domain: Cybersecurity
- `c_as` - Category: Application Security
- `c_ns` - Category: Network Security
- `t_sast` - Tool: Static Application Security Testing
- `s_mss` - Service: Managed Security Service

**Type Abbreviations:**
- `d` - Domain
- `c` - Category
- `t` - Tool
- `s` - Service
- `fg` - Feature Group

**Name Abbreviation Rules:**
- Use first letter of each word in lowercase
- Example: "Business Application Development" → `bad`
- If duplicate exists, add increment: `bad_2`, `bad_3`

### Package Names

Format: `@zerobias-org/segment-zerobias-{code}`

**Examples:**
- `@zerobias-org/segment-zerobias-d_cs`
- `@zerobias-org/segment-zerobias-c_as`

## Development Workflow

### Creating a New Segment

**1. Set up environment:**
```bash
# Set ZB_TOKEN for npm authentication
export ZB_TOKEN="your-api-key"

# Clone and install
git clone git@github.com:zerobias-org/segment.git
cd segment
git checkout dev  # Always work on dev branch
npm install
```

**2. Create segment folder:**
```bash
cd package/zerobias

# Create folder with naming convention
# Example: c_bad (Category: Business Application Development)
mkdir c_bad
```

**3. Run creation script:**
```bash
# From repository root
sh scripts/createNewSegment.sh package/zerobias/c_bad
```

This copies templates and creates:
- `index.yml` (with placeholders)
- `package.json` (with placeholders)
- `logo.svg` (default icon)

**4. Edit index.yml:**
```yaml
id: <generate-new-uuid>  # Use uuidgen or online generator
name: Business Application Development
description: Tools and services for business application development
segmentType: category
code: c_bad
externalId: Business Application Development
status: published
parents:
  - d_itg  # Parent domain: IT & Governance (example)
aliases:
  - BAD
  - Business Apps
```

**5. Edit package.json:**
```json
{
  "name": "@zerobias-org/segment-zerobias-c_bad",
  "version": "0.0.0",  // Start at 0.0.0
  "description": "Business Application Development segment",
  ...
  "dependencies": {
    "@auditlogic/vendor-zerobias": "latest",
    "@zerobias-org/segment-zerobias-d_itg": "latest",  // Parent dependency
    "@zerobias-org/segment_type-zerobias": "latest"
  }
}
```

**6. Install and shrinkwrap:**
```bash
cd package/zerobias/c_bad
npm install
npm shrinkwrap
```

**7. Validate:**
```bash
# From repository root
npm run validate

# Fix any errors and re-validate
```

**8. Commit:**
```bash
git add package/zerobias/c_bad
git commit -m "feat(segment): add Business Application Development category segment"
git push origin dev
```

**9. Open Pull Request:**
- Create PR against `dev` branch (not main!)
- PR will run validation checks
- After review and merge, segment will be published automatically

---

## Version Management

### Lerna Versioning

Segments use **Lerna** with **Conventional Commits** for automatic versioning:

**Version Bumps:**
- `feat:` commits → minor version bump (0.1.0 → 0.2.0)
- `fix:` commits → patch version bump (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → major version bump (0.1.0 → 1.0.0)

**Initial Version:**
- All new segments start at `0.0.0`
- First commit bumps to `0.1.0` or `0.0.1` depending on type

**Graduating to 1.0.0:**
1. Assign PR to `premajor` label
2. Lerna creates release candidate (`1.0.0-rc.0`)
3. Merge PR
4. Lerna graduates to `1.0.0` via `conventional-graduation`

### Dry Run

Test version changes before committing:
```bash
npm run lerna:dry-run
```

This shows:
- Which packages will be versioned
- What the new versions will be
- Generated CHANGELOG entries

---

## Publishing Workflow

### Automatic Publishing (via GitHub Actions)

**Trigger:** Merge to `main` branch

**Workflow:**
1. `lerna_publish.yml` runs
2. Lerna detects changed segments
3. Bootstraps dependencies
4. Bumps versions based on conventional commits
5. Updates CHANGELOG.md
6. Commits version changes
7. Publishes to GitHub Packages (NPM registry)
8. Creates git tags
9. Triggers `lerna_post_publish.yml`
10. Sends Slack notification

**Scripts Called:**
- `version`: Before commit (includes `index.yml` in version commit)
- `postpublish`: After publish (triggers post-publish workflow)

### Manual Publishing

```bash
# Publish all changed segments
npm run lerna:publish

# Publish from package (if already versioned)
npm run lerna:publish-from-package
```

---

## Git Hooks (Husky)

### Pre-commit Checks

Husky validates before allowing commits:

**1. Commit Message Format:**
- Must follow Conventional Commits
- Format: `<type>(<scope>): <subject>`
- Example: `feat(segment): add new cybersecurity category`

**2. Build Validation:**
- Affected segments are built
- Unit tests run (if present)
- ESLint checks for linting errors

**Example - Bad commit:**
```bash
git commit -m "added segment"
# ✖ type may not be empty
# ✖ found 2 problems
```

**Example - Good commit:**
```bash
git commit -m "feat(c_bad): add Business Application Development segment"
# ✓ Commit validated
# ✓ Build passed
```

---

## Common Development Commands

### Root Level

```bash
# Install dependencies
npm install

# Validate all segments
npm run validate

# Build all segments (if applicable)
npm run build

# Test all segments
npm run lerna:test

# Dry run versioning
npm run lerna:dry-run

# Publish segments
npm run lerna:publish
```

### Segment-Specific

```bash
cd package/zerobias/c_as

# Install dependencies
npm install

# Create shrinkwrap
npm shrinkwrap

# Validate segment
npm run validate

# Publish (usually via lerna)
npm run nx:publish
```

---

## Integration with Platform

### Dataloader Import

Segments are imported into AuditgraphDB via dataloader:

**Import Process:**
1. Segment package published to NPM
2. Dataloader detects new version
3. Downloads package
4. Parses `index.yml`
5. Creates/updates Segment object in AuditgraphDB
6. Links parent/child relationships
7. Updates product associations

**Dataloader Configuration:**
```json
{
  "import-artifact": "segment",
  "package": "zerobias.c_as.segment",
  "dataloader-version": "3.4.5"
}
```

### Product Association

Products reference segments for categorization:

**Example Product:**
```yaml
name: GitHub Advanced Security
segments:
  - c_as   # Application Security
  - t_sast # SAST Tool
  - t_sca  # Software Composition Analysis
```

### Search and Filtering

Segments enable portal search:
- Filter products by segment
- Browse catalog by hierarchy
- Discover related products
- Tag-based recommendations

---

## Best Practices

### Creating Segments

1. **Check for duplicates:** Search existing segments before creating new ones
2. **Use clear names:** Names should be descriptive and unambiguous
3. **Proper hierarchy:** Choose correct segment type and parent
4. **Consistent naming:** Follow abbreviation conventions
5. **Add aliases:** Include common alternative names

### Parent-Child Relationships

1. **Logical hierarchy:**
   - Domains at top level
   - Categories under domains
   - Tools/services under categories

2. **Dependency management:**
   - Add parent segments to package.json dependencies
   - Use `latest` version for dependencies
   - Run `npm shrinkwrap` after adding dependencies

3. **Avoid circular dependencies:**
   - Never make parent depend on child
   - Keep hierarchy unidirectional

### Version Control

1. **Work on dev branch:** Never commit directly to main
2. **Conventional commits:** Always use proper commit format
3. **One segment per commit:** Don't mix multiple segment changes
4. **Test before PR:** Run `npm run validate` before pushing

---

## Common Issues and Solutions

### Validation Fails

**Problem:** `npm run validate` shows errors

**Solutions:**
1. Check index.yml format (YAML syntax)
2. Verify all required fields present
3. Ensure parent segments exist
4. Check UUID format is valid
5. Verify segment code follows naming convention

### Shrinkwrap Conflicts

**Problem:** npm-shrinkwrap.json has conflicts

**Solutions:**
```bash
cd package/zerobias/your-segment
rm npm-shrinkwrap.json
npm install
npm shrinkwrap
```

### Commit Rejected

**Problem:** Husky pre-commit hook fails

**Solutions:**
1. Fix commit message format
2. Check for linting errors
3. Ensure segment builds successfully
4. Run `npm run validate` first

### Publishing Fails

**Problem:** Lerna publish fails

**Solutions:**
1. Check NPM authentication (ZB_TOKEN)
2. Verify publishConfig in package.json
3. Ensure version is bumped correctly
4. Check GitHub Packages permissions

---

## Related Documentation

- **[Root CLAUDE.md](../../CLAUDE.md)** - Meta-repo guidance
- **[ContentArtifacts.md](../../ContentArtifacts.md)** - Content catalog system
- **[zerobias-org/product/CLAUDE.md](../product/CLAUDE.md)** - Product definitions
- **[zerobias-org/vendor/CLAUDE.md](../vendor/CLAUDE.md)** - Vendor catalog
- **[auditmation/platform/dataloader/CLAUDE.md](../../auditmation/platform/dataloader/CLAUDE.md)** - Dataloader import
- **[README.md](README.md)** - Repository overview
- **[Conventional Commits](https://www.conventionalcommits.org/)** - Commit message format

---

## Support

For segment development:
1. Review existing segments for examples
2. Check validation errors carefully
3. Follow naming conventions strictly
4. Test with dry-run before publishing
5. Ask in community channels for help

---

**Last Updated:** 2025-11-11
**Maintainers:** ZeroBias Community
