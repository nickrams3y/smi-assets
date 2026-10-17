# Simply Michigan Infotainment website assets

Small browser-side assets used by the Simply Michigan Infotainment Ecwid storefront.

Ecwid loads the complete production bundle from:

`https://nickrams3y.github.io/smi-assets/site.js?v=eb6e7e4`

Ecwid loads the complete production stylesheet from:

`https://cdn.jsdelivr.net/gh/nickrams3y/smi-assets@main/site.css`

## Compatibility checker

The shared finder implementation in `site.js` powers the homepage, Sync 2 to Sync 3 upgrades landing page, and APIM replacements landing page. `sync-3-compatibility-checker.js` and `c.js` are legacy snapshots, not the script used by these live finders. When a shopper follows a recommended product link, the current browser tab temporarily retains the vehicle selections so matching product fields can be prefilled.

All three finders use the same selectable model/year catalog, built from replacement hardware ranges (`A`) plus Lite applications (`L`). The older Sync 2 conversion ranges (`D`) must not limit which years a replacement customer can select. System selection controls the recommendation; a listed year alone does not establish compatibility. Models without existing display guidance get a display-fitment contact link rather than an assumed screen.

The `L` table in `site.js` lists the published U.S. factory 4-inch SYNC 3 Lite replacement model/year ranges. It expands the selectable catalog without changing the original `D` table used for Sync 2 conversion eligibility. For the 4-inch system choice, eligible vehicles receive a Lite replacement link alongside existing conversion kits where available. VIN verification and the Transit/Expedition equipment qualifiers remain in the result. Do not add conditional applications omitted from the published product listing.

`site.js` is the production bundle. It contains the product-option enhancements and the compatibility checker, allowing Ecwid to use one short external loader instead of storing the application code in its limited editor.

`site.css` contains the corresponding product-option and compatibility-checker styles. Ecwid loads it through a single `@import` line in the active custom CSS theme.

The four optimized images in `images/system-selector/` power the visual current-system choices used by both compatibility checkers.
