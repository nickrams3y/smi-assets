# Simply Michigan Infotainment website assets

Small browser-side assets used by the Simply Michigan Infotainment Ecwid storefront.

Ecwid loads the complete production bundle from:

`https://cdn.jsdelivr.net/gh/nickrams3y/smi-assets@main/site.js`

Ecwid loads the complete production stylesheet from:

`https://cdn.jsdelivr.net/gh/nickrams3y/smi-assets@main/site.css`

## Compatibility checker

`sync-3-compatibility-checker.js` powers the vehicle compatibility checker on the Sync 2 to Sync 3 upgrades landing page. It runs entirely in the shopper's browser. When a shopper follows a recommended product link, the current browser tab temporarily retains the vehicle selections so the matching product fields can be prefilled.

`site.js` is the production bundle. It contains the product-option enhancements and the compatibility checker, allowing Ecwid to use one short external loader instead of storing the application code in its limited editor.

`site.css` contains the corresponding product-option and compatibility-checker styles. Ecwid loads it through a single `@import` line in the active custom CSS theme.
