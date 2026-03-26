# Phase 4 Parity Audit — NRG.com Homepage

**Date**: 2026-03-25
**Auditor**: Pixel-level parity comparison
**Original**: https://www.nrg.com/
**Migrated**: http://localhost:3000/content/index (branch: phase4-updates)
**Viewport**: 1440x900 (desktop), 375x812 (mobile)

---

## Executive Summary

This audit identified **12 new deltas** beyond the 18 issues already tracked in Phase 3 (PR #51, issues #33–#50). The Phase 3 PR addresses the majority of structural and high-impact issues (footer layout, feature panel dimensions, product grid positioning, carousel navigation logic, etc.).

The new findings fall into three categories:
1. **Header behavior** — The header is not fixed/sticky on scroll (P0), plus nav typography mismatches
2. **Carousel refinements** — Top bar layout, section height, arrow styling, and font inconsistencies
3. **Minor spacing/typography** — Footer button width, text sizes, mobile responsive patterns

**Prerequisite**: Merge Phase 3 PR #51 before beginning Phase 4 work. Phase 3 resolves 18 foundational issues that Phase 4 builds upon.

---

## Delta Inventory — New Issues (#52–#63)

### P0 — Parity-Breaking

| # | Title | Component | Type |
|---|-------|-----------|------|
| #52 | Header is not fixed/sticky on scroll | Header | functional, visual |

### P1 — Noticeable UX Issues

| # | Title | Component | Type |
|---|-------|-----------|------|
| #53 | Nav link letter-spacing too narrow (0.5px vs 1.5px) | Header | visual |
| #54 | Header utility links and Contact button font-sizes are swapped | Header | visual |
| #55 | Product grid tab container missing gradient background | Product Grid | visual |
| #56 | News carousel section too tall — 841px vs 660px | News Carousel | visual |
| #57 | News carousel nav arrows wrong style | News Carousel | visual |
| #60 | Footer "Contact us" button too narrow (221px vs 306px) | Footer | visual |
| #62 | Mobile: Product grid should use accordion instead of tabs | Product Grid | responsive |
| #63 | News carousel top bar layout doesn't match original | News Carousel | visual |

### P2 — Minor Issues

| # | Title | Component | Type |
|---|-------|-----------|------|
| #58 | News carousel "See article" button uses wrong font family | News Carousel | visual |
| #59 | CTA banner section 19px too tall (619px vs 600px) | CTA Banner | visual |
| #61 | Footer left column body text size wrong (18px vs 16px) | Footer | visual |

---

## Phased Remediation Plan

### Phase 0: Merge Phase 3 (Prerequisite)

**Goal**: Resolve all 18 previously-identified issues
**Action**: Merge PR #51 (`phase3-updates` → `main`), then rebase `phase4-updates` on `main`
**Exit criteria**: Issues #33–#50 resolved in production

### Phase 1: Header Sticky Behavior (#52)

**Goal**: Fix the single P0 parity-breaking issue
**Issues**: #52
**Rationale**: The sticky header is the highest-impact behavioral gap — it affects every page scroll interaction
**Dependencies**: None (header code is independent)
**Exit criteria**:
- Header stays fixed at top on scroll
- Background transitions transparent → white
- No layout shift or content overlap

### Phase 2: Header Typography (#53, #54)

**Goal**: Fix nav link letter-spacing and font-size inconsistencies
**Issues**: #53, #54
**Rationale**: Grouped with header work since they affect the same component
**Dependencies**: Complete after #52 (sticky header may affect nav layout)
**Exit criteria**:
- Nav links: letter-spacing 1.5px
- Utility links: 15px
- Contact button: 18px, 44px height

### Phase 3: News Carousel Refinements (#56, #57, #63, #58)

**Goal**: Fix carousel layout, height, arrow styling, and top bar structure
**Issues**: #56, #57, #63, #58
**Rationale**: These are interrelated carousel issues — the top bar layout (#63) directly affects section height (#56)
**Dependencies**: Phase 3 PR must be merged first (carousel nav logic from #47)
**Exit criteria**:
- Section height matches ~660px
- Category text in top bar with counter and arrows
- White-filled 36px arrow circles
- Partial-width right-aligned separator
- "See article" in Effra Medium

### Phase 4: Product Grid + CTA Polish (#55, #59)

**Goal**: Add gradient background to product grid, fix CTA banner height
**Issues**: #55, #59
**Dependencies**: Phase 3 PR merged (product grid changes from #45–#46)
**Exit criteria**:
- Gradient visible on product grid tab container
- CTA banner exactly 600px tall

### Phase 5: Footer Fine-Tuning (#60, #61)

**Goal**: Fix Contact button width and text sizing
**Issues**: #60, #61
**Dependencies**: Phase 3 PR merged (footer structural fixes from #33, #49, #50)
**Exit criteria**:
- Contact us button: 306x48px with 1px letter-spacing
- Body text: 16px/24px

### Phase 6: Mobile Responsive (#62)

**Goal**: Implement accordion pattern for product grid on mobile
**Issues**: #62
**Dependencies**: Desktop product grid must be finalized first (Phases 3–4)
**Exit criteria**:
- At 375px, product categories show as accordion rows
- Tap to expand/collapse
- Visual match with original mobile layout

---

## Assumptions and Constraints

1. **Phase 3 merge is prerequisite** — 18 issues (#33–#50) must be resolved before Phase 4 work begins
2. **Effra fonts are loaded** — All three weights (Regular, Medium, Light) are available and rendering correctly
3. **Content parity is complete** — All text, links, and images match; this audit focuses on visual/behavioral delta
4. **EDS platform constraints** — Some original features (React SPA routing, third-party analytics, OneTrust banner) are intentionally not replicated
5. **Demo scope** — This is an Adobe Summit demo; perfection at edge cases (e.g., ultra-wide 4K viewports, RTL, older browsers) is lower priority than core parity

## Open Risks

1. **Sticky header + EDS fragment loading** — The header is loaded via `loadFragment()`. Making it `position: fixed` requires careful z-index and layout shift management.
2. **Mobile accordion complexity** — Converting the product grid to an accordion on mobile requires new JS logic and CSS breakpoint rules. This is the most complex new feature.
3. **Carousel top bar restructure** — Moving category text to the top bar requires DOM restructuring in the block's `decorate()` function, not just CSS changes.
