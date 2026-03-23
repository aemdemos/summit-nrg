# Problems Reference

> Auto-maintained by excat-problem-tracker skill.
> Extracted from project journal entries.

## Active Problems

*(No active problems — all resolved)*

## Resolved Problems

### P-001: Scene7 Images Return 403 from Localhost
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: content
- **Root cause**: CDN referrer policy blocks non-nrg.com origins
- **Resolution**: Accepted as expected behavior; images render correctly in production
- **Avoidance**: When using external CDN images, expect hotlink restrictions from localhost. Don't treat 403s as code bugs.

### P-002: Effra Font Loading Requires Project ID
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: styling
- **Root cause**: fast.fonts.net uses project-based licensing
- **Resolution**: Used project ID `c292c16d-9556-4a15-9654-8047adf34ec2` from NRG source
- **Avoidance**: Always extract the font project/kit ID from the source site's HTML head.

### P-003: Header Logo Extraction Returned Wrong Element
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: tooling
- **Root cause**: `querySelector('a[href="/"] img')` matched an arrow icon SVG, not the NRG logo (which is an inline `<svg>`)
- **Resolution**: Queried `header.querySelector('svg')` directly
- **Avoidance**: Inline SVGs are not `<img>` elements. When extracting logos, check for both `<img>` and inline `<svg>`.

### P-004: Hidden Element Measurement Returning Zero
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: tooling
- **Root cause**: First DOM match was a hidden/off-screen instance
- **Resolution**: Filtered results for `getBoundingClientRect().width > 0`
- **Avoidance**: Always filter for visible elements when measuring dimensions.

### P-005: Nav Tools Stacking Vertically
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: styling
- **Root cause**: Flex on parent `.nav-tools` but child `.default-content-wrapper` was block display
- **Resolution**: Added `display: flex` to `.nav-tools .default-content-wrapper`
- **Avoidance**: In EDS, block content is wrapped in `.default-content-wrapper`. Target this wrapper, not just the parent block element.

### P-006: Header/Footer Not Loading on Navigation
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: rendering
- **Root cause**: Fragments load during lazy phase (after loadEager)
- **Resolution**: Wait 3+ seconds after navigation before inspecting header/footer
- **Avoidance**: EDS loads header/footer fragments during lazy phase. Always add wait time when testing header/footer rendering.

### P-007: gh CLI Auth Missing read:org Scope
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: tooling
- **Root cause**: PAT token lacked `read:org` scope required by `gh auth login`
- **Resolution**: Used `GH_TOKEN` environment variable instead of `gh auth login --with-token`
- **Avoidance**: Prefer `export GH_TOKEN=...` over `gh auth login` when token has limited scopes.

### P-008: NRG.com SPA Hydration Failure After Viewport Resize
- **First seen**: 2026-03-19
- **Resolved**: 2026-03-19
- **Category**: tooling
- **Root cause**: React SPA on NRG.com sometimes fails to render after viewport resize + reload
- **Resolution**: Fresh navigation with `page.goto()` and 5-second wait
- **Avoidance**: For SPA sites, use fresh navigations instead of resize+reload. Add generous wait times.

## Patterns

### Recurring Categories
| Category | Open | Resolved | Total |
|----------|------|----------|-------|
| styling | 0 | 2 | 2 |
| tooling | 0 | 4 | 4 |
| content | 0 | 1 | 1 |
| rendering | 0 | 1 | 1 |

### Avoidance Checklist
- [x] Filter for visible elements when measuring (getBoundingClientRect > 0)
- [x] Target `.default-content-wrapper` for flex layout in EDS blocks
- [x] Wait 3+ seconds for header/footer fragment loading
- [x] Use `GH_TOKEN` env var for GitHub CLI authentication
- [x] Check for both `<img>` and inline `<svg>` when extracting images
- [x] Expect CDN hotlink restrictions from localhost
- [x] Use fresh navigations for SPA sites, not resize+reload
