# Simply Michigan Infotainment website assets

Small browser-side assets used by the Simply Michigan Infotainment Ecwid storefront.

Ecwid loads the complete production bundle from:

`https://nickrams3y.github.io/smi-assets/site.js?v=0306e05`

Ecwid loads the complete production stylesheet from:

`https://nickrams3y.github.io/smi-assets/site.css?v=2719ee4` (header link; the custom CSS theme also imports `site.css?v=eb6e7e4`)

## Compatibility checker

The shared finder implementation in `site.js` powers the homepage, upgrade guide, Sync 2 to Sync 3 upgrades landing page, and APIM replacements landing page. `sync-3-compatibility-checker.js` and `c.js` are legacy snapshots, not the script used by these live finders. When a shopper follows a recommended product link, the current browser tab temporarily retains the vehicle selections so matching product fields can be prefilled.

All finders use the same selectable model/year catalog, built from replacement hardware ranges (`A`) plus Lite applications (`L`). The older Sync 2 conversion ranges (`D`) must not limit which years a replacement customer can select. System selection controls the recommendation; a listed year alone does not establish compatibility. Models without existing display guidance get a display-fitment contact link rather than an assumed screen.

The 2019–2023 Ford Ranger with the factory 4-inch Base Sync system offers both the Sync 3 Lite APIM replacement and the Ranger 4-inch-to-8-inch complete conversion kit in all finders. The conversion link does not appear for existing 8-inch systems or uncertain system selections.

The 2017–2019 F-250, F-350 and F-450 factory 4-inch systems route to the dedicated 2017–2019 Super Duty conversion kit. The 2020–2022 Super Duty kit remains separate. F-450 is included in the published product fitment, but does not receive a 12-inch upgrade recommendation. This does not expand Sync 3 Lite replacement eligibility.

The `L` table in `site.js` lists the published U.S. factory 4-inch SYNC 3 Lite replacement model/year ranges. It expands the selectable catalog without changing the original `D` table used for Sync 2 conversion eligibility. For the 4-inch system choice, eligible vehicles receive a Lite replacement link alongside existing conversion kits where available. VIN verification and the Transit/Expedition equipment qualifiers remain in the result. Do not add conditional applications omitted from the published product listing.

`site.js` is the production bundle. It contains the product-option enhancements and the compatibility checker, allowing Ecwid to use one short external loader instead of storing the application code in its limited editor.

`site.css` contains the corresponding product-option and compatibility-checker styles. Ecwid loads it through a single `@import` line in the active custom CSS theme.

The four optimized images in `images/system-selector/` power the visual current-system choices used by both compatibility checkers.

## Checkout review reminder

`checkout/review-note.js` is bundled at the end of `site.js`. Keep the source and bundled copy synchronized. On the active payment step it places the approved optional Google survey reminder immediately after Ecwid's order-comments section. Its small scoped stylesheet is installed with the markup, avoiding another request or an unstyled note. A matching rule in `site.css` puts 20px bottom padding on the containing comments section and zeroes the note's bottom margin, preserving the Pay gap with older loaded scripts as well. Native comments, payment controls, submission, and Google's actual post-order opt-in are unchanged. Repeated checkout renders reuse the note, and earlier checkout steps remove it. Verification lives in `work/2026-10-21-checkout-review` in the parent workspace; the test cart stops before Pay.

## Product card image delivery

Small Instant Site product cards (`.ins-tile__product-card .ins-picture--full`) use the existing Ecwid 800px derivative when their oversized image is still loading. The code reads the current image's medium breakpoint URL from Ecwid's markup; there is no fixed product/image mapping to maintain when a cover photo changes. Cards wider than 400 CSS pixels retain the native sources.

This runs early in `site.js` so browsers can cancel pending oversized downloads. Already-loaded images are left alone to avoid a redundant request, so savings depend on cache and script timing. A failed replacement restores the native sources. Product detail galleries, zoom images, cart images, uploaded originals, and mobile gallery navigation are outside this selector. No CSS or catalog edits are required.

## Troubleshooting guide (early version)

`/troubleshoot` loads `troubleshoot/tool.js` and `troubleshoot/tool.css` through the route-specific loader at the end of `site.js`. It mounts beneath Ecwid's existing `tile-text-ohZTvt` introduction. No navigation or homepage links are added. The page is publicly reachable by URL; this is not access control or a search-indexing restriction.

Four paths cover sound, screen/touchscreen, Sync stability, and phone connectivity. October 18 review tightened the symptom rules: outcomes identify checks rather than establish a failed component. The amplifier theory is unconfirmed. No sound path has a purchase link. APIM results retain a secondary catalog link for Sync 3 only, alongside the primary contact handoff, and explicitly call for software/power/connection review before ordering.

Sound observations separately collect Audio/station operation, volume-display movement, affected sources, affected speakers, and audio package. Volume movement is not an ACM/amplifier discriminator. Unknown systems receive identification help. The current speaker PDF is limited to compatible Sync 3 controls and requires Audio/FM access; Sync 2/Lite, unavailable Audio, or uncertain test results lead to support. Completed tests produce distinct outcomes: silent positions require circuit checks; no tones require system/power/module checks; working tones require normal-playback checks. An unknown source answer never becomes a phone-only diagnosis.

Screen and Sync-stability checks for 8-inch Sync 2 and Sync 3 use one combined reset question. Only the approved original Sync 3 reset PDF is linked; Sync 2 directs customers to support for help with the procedure until its draft is approved. Screen symptoms are collected first so physical damage bypasses resets. A successful reset ends the path without a replacement recommendation. Unavailable/unfinished resets lead to support. Black screens, flickering, frozen systems, and touch problems lead to checks that preserve software, power, and connection uncertainty. No reset guide is repeated on the results page.

Phone checks collect feature, connection type, and whether it previously worked. Compatibility/permissions, a direct wired connection, a verified data cable, the phone port, restarting phone/Sync, and another phone precede hub/APIM access. If another phone is unavailable, support comes before dashboard access. Charging and data remain distinct. Each attempted fix records fixed, still failing, not attempted, or unable.

Context supports original, Simply Michigan, elsewhere, and unknown system history. Optional fields capture an SM order number for Simply Michigan purchases, vehicle year/model, when symptoms began, and installation/update/battery-work context. No VIN field is required. Four picture choices reuse the compatibility images; dead-screen identification can use year/model and dashboard controls. Desktop has four picture columns, mobile two. Next check buttons move focus and scroll to the following question.

Validated progress is saved to same-tab sessionStorage for up to 24 hours (schema v2); Back and reload recover it. Start over clears progress and the separate contact handoff. Changing earlier answers clears downstream answers. Storage denial is caught so the tool remains usable. Progress never enters a URL, cookie, or analytics event.

Get personalized help saves a separate summary/order handoff for 30 minutes and navigates to `/contact-us?troubleshooting=<random-id>`. No message is sent automatically. `troubleshoot/contact.js` validates that token, fills the optional order field, shows the green notice, and combines the visible customer comment with results in Ecwid's native message field. The concise summary includes context, answers, result title/description, and one uncertainty note; it omits the checklist and tool URL. Remove results restores the native field. Normal contact visits, mismatched/expired tokens, or disabled storage cannot silently attach old results. The fixed-size SVG check and native validation are retained. Bump tool asset queries in `site.js` after changes.

The instruction catalog publishes Nick's original Sync 3 reset and speaker-test PDFs. The Sync 2 reset entry has been removed. Published PDFs live in the `smi-instructions` repository; matching copies are in `instructions/pdfs`. Revised reset and speaker-test drafts are held locally in `work/2026-10-18-guide-drafts-for-review` pending Nick's review and approval.

Run `node troubleshoot/tests/routing.cjs` for the pure decision-flow checks, including all terminal answer sequences. Browser verification covers representative results for all four paths, stale-answer clearing, copied summaries, linked PDFs, and 1280/390/320px layouts. Re-run against the live page after GitHub Pages deployment.

Contact-handoff validation intercepts the real `https://vuega.ecwid.com/contact-us` request before network transmission and asserts its message contains comments, system history, order number, answers, and recommendation. This validates request composition without sending a test email; inbox delivery still depends on Ecwid.

## Contact page design

The contact enhancement source is `troubleshoot/contact.js`, bundled near the start of `site.js` so `/contact-us` no longer waits for a second script download. Keep that bundled copy synchronized with the source. `site.css` targets both native Ecwid contact markup (form ZNGYK5) and the enhanced markup, so the card, columns, and fields are styled before JavaScript decoration. The script includes the same CSS as a fallback. It restyles Ecwid's existing form, preserves its controls, validation, honeypot, privacy text, and submit handler, and keeps the optional troubleshooting handoff. Desktop uses an introduction/sidebar beside the form; mobile stacks the fields. The upload mockup was not implemented: a note tells customers they can attach photos or military-discount proof when replying to our email. There is no upload input or new delivery service.

If the enhancement cannot load, Ecwid's original form remains available. Missing or expired troubleshooting tokens still show handoff-specific guidance. The submit button's inherited contrast filter is explicitly disabled to retain readable white text. Verification is in `work/2026-10-19-contact-redesign` in the parent workspace; test submissions were intercepted before delivery.

The heading, description, labels, placeholders, submit label, and photo-reply note are saved directly in Ecwid contact section `contact-us-ZNGYK5`. The photo note is the Message field note, styled from native markup. Do not overwrite this copy in JavaScript: that caused the old text to flash and move the layout. The response time and three quick-answer links also live in that native description so they do not wait for JavaScript. Native CSS styles their paragraphs and suppresses the older injected fallback. Early CSS supplies matching eyebrow and form-heading slots until accessible HTML enhancements mount; the description selector excludes the heading container. Delayed-script checks at 1280, 760, 390, and 320px compare heading and field positions before and after mounting.

## Support library

`/support` now includes `support/ecwid-custom-code.html` in Ecwid's Support custom-code section (`custom-code-mkH2aG`). It contains inline scoped CSS, the initial hero/search/quick links, and a versioned bootstrap for `support/hub.js`. The old title tile `tile-text-3SJuj7` is hidden by that initial CSS, preventing the plain Ecwid layout from appearing while assets load. The route loader in `site.js` skips a native `#sm-support[data-native]` root and remains a fallback for pages without the snippet. Search is disabled until the catalog arrives; loading failures offer retry and Contact Us. Keep the snippet CSS in sync with `support/hub.css` when changing styles, and repaste/publish the snippet after updating it. Other routes do not download the article catalog. Article images are lazy-loaded from `support/media` and no longer depend on HelpSite hosting.

All 74 source articles were copied on October 20, 2026. Four substantive changes were approved by Nick: current USB-C hub availability, wireless adapter/hub choices, ACM replacement service, and uncertain rather than definitive ACM diagnosis for no audio. Other article text is preserved; changing technical guidance or policies substantially requires Nick's review. Source backups and import scripts are in the parent workspace `work/2026-10-20-support-hub`.

Search, topic filters, article permalinks, recommended/related articles, and copy-link controls use URL hashes so browser Back works without another Ecwid document navigation. No customer information, search analytics, accounts, or third-party search service are added. `/troubleshoot` is not promoted. The original HelpSite service remains available pending cutover/redirect decisions. The standalone `support/index.html` is a review preview; the production page uses the existing Ecwid header/footer.

Run `node support/tests/catalog.cjs` for catalog, link, media and search checks. Bump the loader asset query after changes, and the catalog version in `hub.js` when changing article content.

Support search offers up to five desktop suggestions or ten mobile suggestions after two characters, debounced by 150 ms. Below 620 px, focusing search opens a native full-screen dialog with larger article links, a Close button, visual-viewport sizing for the keyboard, and scroll-position restoration. Empty mobile searches show five featured articles. Suggestions use the loaded catalog, support partial title words and the active topic filter, and provide keyboard navigation and a full-results link. The suggestion styles ship inside `support/hub.js` so the existing Ecwid snippet receives the complete feature together.

All 83 articles have curated `searchTerms` for alternate wording, symptoms, abbreviations and selected partial words (for example, `flick`, `refurb` and `prog`). Keep terms specific to the question answered; they supplement the title and body without changing article copy. Both the support hub and homepage widget consume this catalog. Metadata-only term updates do not require replacing the Ecwid snippets; verify both public catalog URLs and freshly loaded search boxes after deployment. Already-open pages retain their loaded catalog.

Run `node support/tests/search.cjs` for 249 editorial discovery queries across all articles. An optional path to the complete homepage widget HTML also checks its actual ranker: `node support/tests/search.cjs ../copy-paste/homepage-support-widget/ecwid-support-widget.html`. Each intended article must appear in the first five results; the suite also checks empty matches, key existing searches and unrelated-result exclusions.

## Shared floating-badge panels (October 25, 2026)

The final blocks in `site.css` and `site.js` apply the approved soft gray panel and orange floating-badge design to existing notices, benefit cards, policy disclosures and support prompts. The shared home/category/guide finders, homepage support widget and checkout review reminder use the same treatment. Product order fields retain their native DOM parents: adjacent backgrounds and section-end classes create one numbered panel per section without moving Ecwid-owned controls. The 2017–2019 Super Duty kit now participates in the existing order-section enhancement.

The decorator is idempotent and adds classes/attributes only; product descriptions, links, form values, pricing and policy wording are untouched. Existing image promos keep their photographs. The Facebook promotional banner and product tiles retain their distinct purposes and styling. Evidence and desktop/mobile screenshots are in `../work/2026-10-25-floating-badges`. The catalog audit preserved text, links and controls in all 52 saved descriptions (219 matching panels).

### Scope refinement

Nick retained the floating-badge order sections and vehicle finders. Policy disclosures (processing, shipping, returns, warranty, SimplyCare), kit contents, 12-inch and ACM promos, green benefit cards, and military discount notes keep their original styles. The homepage support widget also keeps its original appearance without a floating question mark. Category eligibility notices are included via Ecwid's actual `.grid__description` container. The wireless USB hub's description-only Back in Stock banner is hidden; catalog stock ribbons remain unchanged. Military discount alternatives are preview-only pending selection.

The military discount notice now uses Nick's approved Star tab design (navy square star, thin red base, light panel) via its exact aria-label. The homepage Facebook banner uses the brand/logo row as its only heading; the old “A little more Simply Michigan” heading is hidden before scripts run and removed by the shared enhancer. Product benefit cards remain in their original green design while alternatives are reviewed.

SimplyCare/SimplyCare+ description disclosures now reuse the upgrade-card thumbnail layout, retaining their existing copy and native expansion behavior. `images/product-upgrades/simplycare-protection.webp` is the supplied 5000px illustration resized to 320px (5.6 KB).

## Shared product presentation

All existing four-feature `Product highlights` panels use the compact white layout with aligned round green checks. Feature descriptions use concise copy with product-specific fitment, hardware generation, programming requirements and qualifiers preserved. The concise copy is saved directly in each product's Ecwid HTML; JavaScript no longer rewrites it. The two standard kits retain their approved copy. Existing Android Auto/Apple CarPlay artwork is moved below pricing on desktop and into the gallery on mobile. The side-by-side pair fills the price column on desktop and gallery content width on mobile. Coupon and PayPal notices fill the same price-column width, with compact 8px spacing; coupon text wraps on narrow screens. Pages without these logos do not gain compatibility claims. Source anchors discard moved logos when Ecwid replaces a description during navigation.

Ordering cards follow the first highlight bullet list, ahead of installation videos or subsequent product sections. The wireless USB-C hub keeps its requested position below Contact us. The existing disclosure preserves each product's warranty, processing estimates, shipping and return terms. Accessories and service pages without those components retain their content. The shared discount rectangle, file-upload styling and full-card upgrade interactions already apply wherever present.

Catalog and responsive evidence: `../work/2026-10-25-product-consistency`. Audit all public product sitemap entries; check the 16 feature-panel products at 1440, 1024, 768, 767, 390 and 320px. Verify saved Ecwid loader references and live pages separately.

Concise feature-copy evidence and the before/after copy list: `../work/2026-10-25-concise-highlights`. Verify unchanged headings and description text outside the feature panel, exact product-specific short copy, and aligned checks/text at 1440, 390 and 320px.

Full-width pricing and logo layout evidence: `../work/2026-10-25-even-price-column`, covering all 16 feature-panel products at 1440, 1024, 767, 390 and 320px. PayPal visibility remains controlled by its native SDK.

## Product HTML ownership (2026-10-26 migration)

Ecwid is the source of truth for the 16 enhanced product descriptions: K3-NON, K3-NAV, K3-FT, K12, K48-F13, K48-F15, K48-F18, K48-FS17, K48-SD20, K48-M19, K48-R19, AP3-NON, AP3-NAV, AP3-LITE, ACM, HUB-CW. Their compact highlights, full ordering policies, video galleries, promos, SimplyCare panels and upgrade dialogs are stored in the individual Description fields. Edit those fields for future content changes. Do not reinstate JavaScript content builders or duplicate policy sources. The earlier decorator and copy-replacement notes above describe historical implementation.

Shared CSS remains hosted here because of Ecwid's character limit. JavaScript retains necessary storefront interactions, responsive placement of Ecwid-authored compatibility artwork, option logic, and video/dialog/disclosure handlers. Product description layout/content builders were removed in 0306e05. Categories, finders, homepage and support are outside this migration.

Migration backup, prepared HTML, exported catalog and verification reports are in `../work/2026-10-25-ecwid-content-migration`. CSV imports use only name, SKU and description. Ecwid converts formatting newlines to BR and decodes HTML entities: flatten formatting whitespace and use single-quoted attributes for inch-mark labels. Verify persisted HTML semantically against the intended DOM and compare all exported fields after import. Never select Delete all products and categories.
