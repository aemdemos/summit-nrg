# NRG Homepage Parity Audit

**Date:** 2026-03-25
**Viewport:** 1440x900 (desktop)
**Original:** https://www.nrg.com/
**Migrated:** https://main--summit-nrg--aemdemos.aem.page/

---

## Executive Summary

The migrated page reproduces the original NRG homepage at approximately 85-90% visual fidelity. Major structural elements (hero, feature panels, product grids, news carousel, CTA banner) are all present and functional. However, 9 distinct deltas were identified across typography, spacing, layout, and content completeness.

**Breakdown:** 6 × P1 (high), 3 × P2 (medium), 0 × P0 (critical)

---

## Delta Inventory

### D1 — Sub-bar text font and size (P1) — Issue #35

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Font family | "Effra W01 Light" | "Effra W01 Regular" | Wrong weight |
| Font size | 24px | 16px | 33% smaller |
| Line height | 32px | 24px | 25% smaller |

**Problem:** The sub-bar descriptive text ("Our customer-first approach...") is dramatically smaller and uses the wrong font weight, reducing visual prominence.
**Root cause:** `styles.css` line 327-328 hardcodes `font-size: 16px` instead of matching original 24px "Effra W01 Light".
**Fix:** Update sub-bar paragraph styles to use `font-family: 'Effra W01 Light'`, `font-size: 24px`, `line-height: 32px`.
**Resolution criteria:** Sub-bar text renders at 24px in "Effra W01 Light" with 32px line-height.

---

### D2 — Footer layout structure (P1) — Issue #33

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Column count | 2 (dark left + light right) | 3 (CTA + newsletter + nav) | Structural mismatch |
| Left column width | 720px | 532px | 26% narrower |
| "Get the latest" position | Inside dark left column | Separate middle column | Misplaced |

**Problem:** The footer renders as 3 columns instead of 2. The "Get the latest from NRG" section and email signup are separated from the dark CTA column, breaking the original's two-column layout.
**Root cause:** The `<hr>` in `footer.plain.html` line 6 causes EDS to split the first content `<div>` into two sections. Footer.js expects 2 sections but receives 3, so only sections[0] gets `footer-cta` and sections[1] gets `footer-nav` (incorrectly applied to the "Get the latest" section instead of the nav columns).
**Fix:** Remove the `<hr>` from footer content, handle the divider purely in CSS. Update footer.js to properly assign classes.
**Resolution criteria:** Footer renders as two equal-width columns (dark left, light right) with "Get the latest" and email form in the dark left column.

---

### D3 — Footer nav link colors, bullets, and heading font (P1) — Issue #34

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Nav link color | rgb(0,30,46) dark navy | rgb(184,0,107) magenta | Wrong color |
| List bullet style | none | disc | Unwanted bullets |
| Column heading font | "Effra W01 Light" 28px | "Effra W01 Regular" 24px | Wrong font/size |

**Problem:** The footer nav column (About, Our offerings) has magenta links with disc bullets and smaller headings—all inconsistent with the original's dark navy, no-bullet, 28px Light style.
**Root cause:** Cascades from D2—the nav columns section gets no class, so it inherits global `a:any-link { color: var(--link-color) }` and default `list-style: disc`.
**Fix:** Will be resolved when D2 is fixed (nav columns get proper `.footer-nav` class and styling).
**Resolution criteria:** Nav links are dark navy, lists have no bullets, headings are 28px "Effra W01 Light".

---

### D4 — Missing social media icons (P1) — Issue #36

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Social icons | 5 (FB, IG, LinkedIn, X, YT) | 0 | Missing entirely |

**Problem:** The "Follow us on" section has the heading but no social media icons are rendered.
**Root cause:** The footer content contains `<span class="icon icon-facebook">` etc. but the corresponding SVG files may be missing from `/icons/`, or EDS icon decoration isn't loading in the footer fragment context. Also cascades from D2—the icons section is in the un-styled third section.
**Fix:** Ensure SVG icon files exist in `/icons/` (facebook.svg, instagram.svg, linkedin.svg, twitter.svg, youtube.svg). Verify EDS icon decoration runs on footer fragments.
**Resolution criteria:** All 5 social media icons render with proper styling (32px, circular border, dark navy fill).

---

### D5 — Product grid info box dimensions (P1) — Issue #37

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Width | 564px | 475px | 16% narrower |
| Height | 248px | 199px | 20% shorter |
| Padding | 0 24px | 32px 40px | More padding |
| Position | absolute | relative + margin-top: -80px | Different technique |

**Problem:** The product grid info box (white card overlaying the panel image) is noticeably smaller on the migrated site, reducing the visual weight of the product description text.
**Root cause:** CSS values in `product-grid.css` line 220-227 use `width: 60%` and generous padding instead of matching the original's absolute positioning with specific pixel widths.
**Fix:** Update to `width: 564px` (or ~67%) with `padding: 0 24px` and `min-height: 248px`. Consider switching to absolute positioning to match original.
**Resolution criteria:** Info box renders at approximately 564x248px, closely matching original proportions.

---

### D6 — News carousel category text styling (P1) — Issue #38

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Font family | "Effra W01 Medium" | "Effra W01 Regular" | Wrong weight |
| Font size | 14px | 18px | 29% larger |
| Color | #5E6972 (gray) | #001E2E (dark navy) | Wrong color |

**Problem:** The category/date line above each article (e.g. "PEOPLE AND COMMUNITY • INSIGHTS FEB 27, 2026") appears larger and darker than the original's subtle gray treatment.
**Root cause:** CSS specificity issue—`.news-carousel-slide-content p` (specificity 0,2,2) overrides `.news-carousel-meta` (specificity 0,2,1) since the meta element is a `<p>` inside `.news-carousel-slide-content`.
**Fix:** Increase `.news-carousel-meta` selector specificity, e.g. `main .news-carousel .news-carousel-slide-content .news-carousel-meta`.
**Resolution criteria:** Category text renders at 14px "Effra W01 Medium" in #5E6972 gray.

---

### D7 — Feature panel body text font mismatch (P2) — Issue #39

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Font family | "Effra W01 Light" | "Effra W01 Regular" | Wrong weight |
| Font size | 20px | 18px | 10% smaller |
| Line height | 28px | 27px | 4% smaller |

**Problem:** Feature panel description text is slightly smaller and uses a heavier font weight than the original, which used the Light variant for a more elegant appearance.
**Root cause:** CSS in `feature-panel.css` line 52-53 uses `var(--body-font-family)` (Regular) and 18px instead of Light/20px.
**Fix:** Update to `font-family: 'Effra W01 Light'`, `font-size: 20px`, `line-height: 28px`.
**Resolution criteria:** Feature panel body text matches original at 20px "Effra W01 Light".

---

### D8 — Feature panel images 60px taller (P2) — Issue #40

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| Image height | 480px | 540px | 12.5% taller |
| Row height | 480px | 540px | 12.5% taller |

**Problem:** Feature panel images are 60px taller than the original, making the panels slightly oversized.
**Root cause:** `feature-panel.css` sets `min-height: 480px` but flex layout stretches images to match the content column's natural height (which includes padding and content).
**Fix:** Set explicit `max-height: 480px` on `.feature-panel-image` or constrain the row height.
**Resolution criteria:** Feature panel rows render at 480px height, matching original.

---

### D9 — Section separator color (P2) — Issue #41

| Property | Original | Migrated | Delta |
|----------|----------|----------|-------|
| HR color | rgb(197,198,201) / #C5C6C9 | rgb(209,209,209) / #D1D1D1 | Slightly lighter |

**Problem:** Horizontal rule separators between product grids are a subtly different shade of gray.
**Root cause:** CSS uses `#d1d1d1` while original uses `#c5c6c9`.
**Fix:** Update HR border-color to `#c5c6c9` across relevant block CSS files.
**Resolution criteria:** Separators match original color exactly.

---

## Items That Match Well (No Action Needed)

- Header layout and "Contact us" pill button (25px border-radius matches)
- Hero section: h1 typography, CTA button shapes, image overlay
- Hero CTA buttons: both use 25px pill shape
- Product grid tab layout and icon sizes
- News carousel card layout (horizontal image + text)
- CTA banner ("Join our talented") typography and overlay
- Design tokens: colors, fonts, and spacing variables are well-configured

---

## Phased Remediation Plan

### Phase 3A — Footer Structural Fix (P1 × 3 issues)
**Issues:** #33, #34, #36
**Scope:** Footer content restructure + JS update + icon verification
**Effort:** Medium
**Risk:** Low (footer is isolated component)

1. Remove `<hr>` from footer.plain.html content (both `/workspace/footer.plain.html` and `/workspace/content/footer.plain.html`)
2. Update `footer.js` to handle the "newsletter" content as part of CTA section (or restructure content into proper 2 sections)
3. Add/verify social media SVG icons in `/icons/` (facebook.svg, instagram.svg, linkedin.svg, twitter.svg, youtube.svg)
4. Fix `buildPrivacyButton` selector — currently looks for `a[href*="legal.html"]` but links use `/legal` without `.html`
5. Test footer renders as 2-column layout with proper styling

### Phase 3B — Typography and Sizing Fixes (P1 × 3 issues)
**Issues:** #35, #37, #38
**Scope:** CSS-only changes
**Effort:** Low
**Risk:** Very low (cosmetic CSS changes)

1. Fix sub-bar text: update `styles.css` sub-bar paragraph to 24px "Effra W01 Light"
2. Fix product grid info box: update `product-grid.css` dimensions to ~564x248px with less padding
3. Fix news carousel meta: increase `.news-carousel-meta` selector specificity to override `p` rule

### Phase 3C — Polish (P2 × 3 issues)
**Issues:** #39, #40, #41
**Scope:** CSS-only tweaks
**Effort:** Very low
**Risk:** Very low

1. Fix feature panel body text to 20px "Effra W01 Light"
2. Constrain feature panel image height to 480px
3. Update HR separator color from #d1d1d1 to #c5c6c9

---

## Phase 3.3 — Major Parity Issues (2026-03-25 continued)

Issues #42–#50 identified from second comprehensive review.

### D10 — Feature panel missing content (P1) — Issue #42

The feature panel block is missing content compared to the original's FeaturedContent component at XPath section[2].

### D11 — Feature panel too wide / margins (P1) — Issue #43

Feature panel content spans full 1440px without the 24px side margins that align with the NRG logo and hero text on the original.

### D12 — Missing HR separators (P1) — Issue #44

Original has `<hr>` elements (1392px wide, 24px offset, gray) between feature panels and product grids. Our version has none.

### D13 — Product grid heading spacing (P1) — Issue #45

Product grid H2 has `margin-bottom: 32px` (should be 8px) and section padding doesn't match original.

### D14 — Product grid image doesn't reach bottom (P1) — Issue #46

Image stops 168px short of panel bottom. Original image fills the full panel height; text card creates a bottom-left cut-in.

### D15 — News carousel navigation broken (P1) — Issue #47

Carousel sometimes starts on slide 5; forward button stuck after slide 2; backward button navigates in random order. Root cause: IntersectionObserver race condition and scroll position detection issues in slider.js.

### D16 — CTA banner wrong overlay color (P1) — Issue #48

CSS overlay uses `rgb(0 30 46 / 40%)` (navy tint). Original uses NO CSS overlay — image is pre-darkened. Fix: change to neutral `rgba(0, 0, 0, 0.45)`.

### D17 — Footer left column wrong background (P1) — Issue #49

Uses solid `#001E2E` (var(--dark-color)). Original uses dark indigo `#1D1B53` with repeating SVG wave pattern (`bg-footer.svg`).

### D18 — Footer right column misaligned (P1) — Issue #50

Multiple sub-issues: heading font weight (Light vs Regular), social icon size/style, legal links wrapping to two lines, vertical rhythm/spacing throughout.

---

## Root Cause Analysis — Why These Issues Keep Getting Missed

### Problem Statement

After three audit passes (initial migration, Phase 3.1, Phase 3.2), significant visual parity issues remain. This section analyzes WHY these defects recur and HOW the audit process must change.

### Category 1: Structural/Content Gaps (Issues #42, #44)

**Why missed:** The audit process compared visual CSS properties (font sizes, colors, spacing) but did NOT systematically compare the DOM structure section-by-section. Missing content and missing HR elements are structural gaps that CSS-focused audits cannot detect. The feature panel was checked for font/size/color but nobody verified "does this section have the same NUMBER of elements?"

**Pattern:** Audits measured properties of elements that DO exist, rather than checking whether all elements EXIST.

### Category 2: Layout Geometry (Issues #43, #45, #46, #50)

**Why missed:** The audit extracted individual element dimensions (width, height, margin) but did NOT compare how those elements relate to each other spatially. Checking "is the feature panel 1440px wide?" returns TRUE for both sites — but the CONTENT alignment within that 1440px was never compared. Similarly, checking "does the product grid image exist?" misses the fact that it doesn't fill the panel height.

**Pattern:** Audits measured absolute values of isolated elements, not their relative positioning within the layout flow.

### Category 3: Behavioral/Interactive Bugs (Issue #47)

**Why missed:** Parity audits have been purely visual (screenshots, computed styles). The news carousel was visually correct in static screenshots but broken in interactive use. Nobody clicked the navigation buttons to verify carousel advancement.

**Pattern:** Static audit methodology cannot detect dynamic/interactive defects.

### Category 4: Asset/Resource Gaps (Issues #48, #49)

**Why missed:** The footer background SVG and CTA banner overlay were evaluated by looking at the rendered visual result, not by inspecting WHAT CSS/assets produce that result. The footer "looked dark" in both versions so it passed visual comparison, but the actual implementation (solid color vs SVG pattern, navy overlay vs pre-darkened image) was never inspected.

**Pattern:** Audits compared visual output at a macro level without decomposing HOW the visual output is produced (inspecting background-image vs background-color, CSS overlay vs baked-in image processing).

### Remediation Plan for Future Audits

1. **Structural audit phase**: Before any CSS comparison, walk the DOM section-by-section and verify every element EXISTS in both versions. Count children, count HRs, count images, count headings. A missing element cannot be caught by CSS inspection.

2. **Spatial relationship audit**: Don't just measure individual elements. Measure how they relate: "Does the feature panel content left-edge align with the hero left-edge?" "Does the image fill its parent container?" Use relative measurements, not just absolute ones.

3. **Interactive audit phase**: After visual checks, manually test every interactive element: click every button, advance every carousel, expand every accordion, hover every link. Record behavior, not just appearance.

4. **Implementation decomposition**: For every visual section, inspect not just the COMPUTED STYLE but the SOURCE of that style. Is the background a solid color, a gradient, an SVG, or an image? Is the overlay a CSS pseudo-element or baked into the image? Is the font weight coming from the font-family name or the font-weight property?

5. **Section-by-section sign-off**: Instead of spot-checking properties, create a checklist for EVERY section on the page. Each section must pass: (a) correct content, (b) correct layout geometry, (c) correct styling, (d) correct interactivity, (e) correct asset implementation.
