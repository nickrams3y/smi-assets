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

`/troubleshoot` loads `troubleshoot/tool.js` and `troubleshoot/tool.css` through the small route-specific loader at the end of `site.js`. It mounts beneath Ecwid's existing `tile-text-ohZTvt` introduction. No navigation or homepage links are added. The page is publicly reachable by its URL; this is not access control or a search-indexing restriction.

The five paths mirror the approved interactive mockup: audio, screen, touch, Sync stability, and phone connectivity. This first version provides next checks and a contact link, not a validated parts-selection engine. Most results are category-level guidance; answers are retained for support review. The amplifier branch is provisional and appears only for all-source audio failure with a reported premium system and an ACM replacement that left symptoms unchanged. No repair outcome or replacement purchase is implied. Broader diagnosis and vehicle-specific routing need separate evidence and review.

Answers stay in the current page's memory; there is no form submission, persistent answer storage, or automatic message. Customers can copy a plain-text summary or manually select it if clipboard access is unavailable. Reloading starts over. Asset failures offer a retry and a support link. Shared DOM-runner mounting supports Ecwid navigation without duplicate instances. For changes to the tool files, bump their `v` query in the loader.

Validation: all five paths at 1280, 390, and 320px; previous answers, restart, copy/fallback, and unrelated-page asset isolation. Re-run live verification after GitHub Pages deployment.

The sound path includes the published Speaker Walk Around Self Test PDF in a new tab, with answers for every speaker, some speakers, silence, not yet tested, unable to start, and uncertainty. The answer is included in copied results and changes the next checks. The provisional amplifier path also requires reported silence during the self test; tones heard or inability to start never confirm a failed module.
