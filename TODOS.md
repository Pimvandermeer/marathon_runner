# TODOS

## Data packs

### Fill the Amsterdam stop gaps (km 12-26 and 28-37)

**What:** Find and verify transit stops for the Amstel stretch and the Ouderkerk turn (km 12-26) and for Galileiplantsoen/Molukkenstraat (km 28-37), and re-issue the four fixable candidates listed in docs/designs/amsterdam-2026-verification.md (Amstelveenseweg/Zeilstraat, Ouderkerk West bus, Hugo de Vrieslaan, a Molukkenstraat tram stop).

**Why:** The published pack has seven verified stops; supporters get no suggestion for two long stretches of the course.

**Context:** A second verification pass was started on 2026-10-14 and stopped to save tokens before it wrote anything. Every new stop needs the finder-plus-independent-verifier rule from the design doc's Data Verification section. Must land before 2026-10-17 to help Amsterdam; otherwise it becomes part of Approach B.

**Effort:** M
**Priority:** P1
**Depends on:** None

### Approach B: GPX pack pipeline

**What:** A script that takes a GPX and a buffer distance, pulls stations and stops from OpenStreetMap once at build time, projects each stop onto the route (every pass for loops), and writes a verified pack per edition. Includes the start-time fallback mode cut from Approach A, the PMTiles or tile-provider decision, and the Rotterdam 2027 pack.

**Why:** Each new race currently costs an evening of hand-typed kilometre marks and stop coordinates; the pipeline makes a race one command plus verification.

**Context:** Design doc docs/designs/marathon-supporter-multi-marathon.md, Approach B and Data Verification. Decision D2 (2026-10-14) cut the start-time fallback from A and parked it here. Start after Amsterdam 2026 has run and at least one runner has been observed. Deadline in the design doc: 2026-11-15.

**Effort:** L
**Priority:** P1
**Depends on:** Approach A shipped; Den Haag and Rotterdam 2027 dates confirmed

## Product

### Race pages for search and AI answers

**What:** At build time, generate a static page per published pack (`/amsterdam-2026/`, `/en/amsterdam-2026/`) with race name and date, wave start times, the stops with km, passes, lines and descriptions, the spectator tips, the unofficial line, source links and a link to the planner. Link the pages from the footer and add them to sitemap.xml. Optionally generate `llms.txt` from the same data (cheap, but the benefit is unproven).

**Why:** The app renders in JavaScript, so AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see only the head tags; they have nothing to quote for "where to watch the Amsterdam marathon by metro". Content inside `#root` or in `<noscript>` would flash before the app paints, and several extractors drop `noscript`.

**Context:** The packs are JSON and `vite-node` is available, so a script can import `@/data/marathonConfig`; check first that nothing touches `window` at module load. The URL scheme collides with plan.md step 6, which wants `/amsterdam-2026/` as a race path for the app, so choose one scheme before either ships. Start after Amsterdam 2026; aim to have it before the Rotterdam 2027 pack.

**Effort:** M
**Priority:** P2
**Depends on:** Approach B pack pipeline (more races); URL scheme decision

### Organiser contact about names and course maps

**What:** Ask NN Marathon Rotterdam and TCS Amsterdam Marathon whether the planner may use their names and course maps.

**Why:** The site uses official names and asks for tips; without an agreement it must say "unofficial" and carry no organiser artwork (decision D9, 2026-10-14).

**Context:** Design doc Open Questions. A yes also opens the organiser-paid path in Target User & Narrowest Wedge.

**Effort:** S
**Priority:** P2
**Depends on:** None

## Completed

### Analytics and GDPR decision before Approach C (done 2026-10-16)

GoatCounter (cyclerunner.goatcounter.com), no cookies, added ahead of the 2026-10-26 tip count. client/src/lib/analytics.ts sends the hit itself instead of count.js, because count.js always forwards the query string and share links carry the runner's name. Sent: path `/` or `/en/`, plus `?marathon=<id>` for link opens per edition; the channel tag of a ref link (`ref`, `utm_source`, `utm_campaign`, ...) as `q`; referring site without path; screen width; no Referer header. Ref tags are removed from the address bar after counting, so a forwarded copy does not count for the original channel. Footer links to GoatCounter's privacy page. Shares per runner (Approach C) are not measured.
