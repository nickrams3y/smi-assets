# Simply Michigan Infotainment website assets

Small browser-side assets used by the Simply Michigan Infotainment Ecwid storefront.

Ecwid loads the complete production bundle from:

`https://nickrams3y.github.io/smi-assets/site.js?v=eb6e7e4`

Ecwid loads the complete production stylesheet from:

`https://cdn.jsdelivr.net/gh/nickrams3y/smi-assets@main/site.css`

## Compatibility checker

The shared finder implementation in `site.js` powers the homepage, Sync 2 to Sync 3 upgrades landing page, and APIM replacements landing page. `sync-3-compatibility-checker.js` and `c.js` are legacy snapshots, not the script used by these live finders. When a shopper follows a recommended product link, the current browser tab temporarily retains the vehicle selections so matching product fields can be prefilled.

All three finders use the same selectable model/year catalog, built from replacement hardware ranges (`A`) plus Lite applications (`L`). The older Sync 2 conversion ranges (`D`) must not limit which years a replacement customer can select. System selection controls the recommendation; a listed year alone does not establish compatibility. Models without existing display guidance get a display-fitment contact link rather than an assumed screen.

The 2019–2023 Ford Ranger with the factory 4-inch Base Sync system offers both the Sync 3 Lite APIM replacement and the Ranger 4-inch-to-8-inch complete conversion kit in all three finders. The conversion link does not appear for existing 8-inch systems or uncertain system selections.

The `L` table in `site.js` lists the published U.S. factory 4-inch SYNC 3 Lite replacement model/year ranges. It expands the selectable catalog without changing the original `D` table used for Sync 2 conversion eligibility. For the 4-inch system choice, eligible vehicles receive a Lite replacement link alongside existing conversion kits where available. VIN verification and the Transit/Expedition equipment qualifiers remain in the result. Do not add conditional applications omitted from the published product listing.

`site.js` is the production bundle. It contains the product-option enhancements and the compatibility checker, allowing Ecwid to use one short external loader instead of storing the application code in its limited editor.

`site.css` contains the corresponding product-option and compatibility-checker styles. Ecwid loads it through a single `@import` line in the active custom CSS theme.

The four optimized images in `images/system-selector/` power the visual current-system choices used by both compatibility checkers.

## Product card image delivery

Small Instant Site product cards (`.ins-tile__product-card .ins-picture--full`) use the existing Ecwid 800px derivative when their oversized image is still loading. The code reads the current image's medium breakpoint URL from Ecwid's markup; there is no fixed product/image mapping to maintain when a cover photo changes. Cards wider than 400 CSS pixels retain the native sources.

This runs early in `site.js` so browsers can cancel pending oversized downloads. Already-loaded images are left alone to avoid a redundant request, so savings depend on cache and script timing. A failed replacement restores the native sources. Product detail galleries, zoom images, cart images, uploaded originals, and mobile gallery navigation are outside this selector. No CSS or catalog edits are required.

## Troubleshooting guide (early version)

`/troubleshoot` loads `troubleshoot/tool.js` and `troubleshoot/tool.css` through the route-specific loader at the end of `site.js`. It mounts beneath Ecwid's existing `tile-text-ohZTvt` introduction. No navigation or homepage links are added. The page is publicly reachable by URL; this is not access control or a search-indexing restriction.

Five paths cover sound, screen, touch, Sync stability, and phone connectivity. The decision rules reflect the owner's October 17 symptom guidance. They provide likely next steps, not independently validated diagnoses. The amplifier theory remains provisional, requires a reported separate amplifier, and does not recommend a purchase. Speaker-test failures include wiring and amplifier-output caveats. ACM and APIM results link to the relevant catalog pages and request fitment verification.

Sound checks link to the published speaker self-test PDF and distinguish all, some, or no speakers playing, an unattempted test, inability to start, and uncertainty. Call-audio complaints with failed speaker positions suggest a speaker or circuit check. Radio-wide symptoms suggest ACM review; radio-on/no-sound/no-volume-effect symptoms lead to amplifier investigation when the reported hardware and test results support it.

Screen and Sync-stability checks for an 8-inch Sync 3 system start with the soft reset, followed by a master reset if symptoms remain. Both link to the reset PDF. A successful reset ends the path without a replacement recommendation. The master-reset question warns that saved settings and paired phones are erased and accommodates a black/frozen screen that prevents menu access. Black screen plus no audio suggests APIM review; display-only flicker suggests screen review, while whole-system restarts suggest APIM review. Visible picture with failed or phantom touch suggests digitizer review. Other systems receive support guidance instead of these Sync 3-specific steps.

Phone connectivity checks proceed in order: direct wired connection, verified data cable, phone port, charging/power, hub data cable, APIM USB port, then another compatible phone. No power branches to the hub power connection. A fix ends the path; another working phone points toward the customer's device. If neither phone works after all checks, support reviews the hub, cabling, and possible APIM fault before any purchase recommendation.

The first step asks whether the system is original or from Simply Michigan, with an optional SM-number for purchased systems. Picture choices reuse the compatibility checker's images. Changing an earlier answer clears later answers; changing systems clears all checks. Reloading the guide starts over.

Answers remain in page memory until the customer chooses Get help with my results. That action stores a timestamped summary and optional order number in same-tab session storage for a 30-minute handoff to `/contact-us?troubleshooting=<random-id>`. No customer details are placed in the URL or cookies, and no message is sent automatically. `troubleshoot/contact.js` loads only for that explicit contact-page handoff. It fills the existing order field if empty, shows a green results notice with view/remove controls, and uses a separate visible comment box. The existing Ecwid message field carries the comment plus results so Ecwid's normal email submission receives both. Input events keep Ecwid's model synchronized. Remove results restores the native message box and clears the stored handoff. Normal contact visits, mismatched tokens, expired data, and disabled storage do not silently attach old results; failure notices or a copy fallback are provided. Customers can also copy a summary or manually select it if clipboard access is unavailable. Asset failures offer retry/support. The shared DOM runner supports Ecwid navigation without duplicate instances. Bump both tool-file `v` queries in the loader when updating them.

Run `node troubleshoot/tests/routing.cjs` for the pure decision-flow checks, including all terminal answer sequences. Browser verification covers representative results for all five paths, stale-answer clearing, copied summaries, linked PDFs, and 1280/390/320px layouts. Re-run against the live page after GitHub Pages deployment.

Contact-handoff validation intercepts the real `https://vuega.ecwid.com/contact-us` request before network transmission and asserts its message contains comments, system history, order number, answers, and recommendation. This validates request composition without sending a test email; inbox delivery still depends on Ecwid.
