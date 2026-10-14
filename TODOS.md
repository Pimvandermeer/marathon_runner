# TODOS

## Data packs

### Approach B: GPX pack pipeline

**What:** A script that takes a GPX and a buffer distance, pulls stations and stops from OpenStreetMap once at build time, projects each stop onto the route (every pass for loops), and writes a verified pack per edition. Includes the start-time fallback mode cut from Approach A, the PMTiles or tile-provider decision, and the Rotterdam 2027 pack.

**Why:** Each new race currently costs an evening of hand-typed kilometre marks and stop coordinates; the pipeline makes a race one command plus verification.

**Context:** Design doc docs/designs/marathon-supporter-multi-marathon.md, Approach B and Data Verification. Decision D2 (2026-10-14) cut the start-time fallback from A and parked it here. Start after Amsterdam 2026 has run and at least one runner has been observed. Deadline in the design doc: 2026-11-15.

**Effort:** L
**Priority:** P1
**Depends on:** Approach A shipped; Den Haag and Rotterdam 2027 dates confirmed

## Product

### Analytics and GDPR decision before Approach C

**What:** Decide whether to add a cookie-free analytics provider (or none), what is retained, and the privacy line in the footer.

**Why:** Approach C (runner share card) needs shares-per-runner and opens-per-share; GDPR applies the moment analytics appear.

**Context:** Design doc Constraints and Approach C; reviewer concern R3-9. Revisit after the tip count on 2026-10-26.

**Effort:** S
**Priority:** P2
**Depends on:** Tip count known (2026-10-26)

### Organiser contact about names and course maps

**What:** Ask NN Marathon Rotterdam and TCS Amsterdam Marathon whether the planner may use their names and course maps.

**Why:** The site uses official names and asks for tips; without an agreement it must say "unofficial" and carry no organiser artwork (decision D9, 2026-10-14).

**Context:** Design doc Open Questions. A yes also opens the organiser-paid path in Target User & Narrowest Wedge.

**Effort:** S
**Priority:** P2
**Depends on:** None

## Completed
