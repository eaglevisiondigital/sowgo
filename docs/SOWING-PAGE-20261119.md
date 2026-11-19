# SowGo sowing page — November 19, 2026

## Requested result

Provide the SowGo-branded route `/sow/` with the existing, user-supplied GiveHub form embedded. Route all donor-facing Sow actions from the header, hero, participation card, event cards, full schedule, footer, and successful SowGo partner-form continuation to that page. Keep the current shared registration and partner-intake systems.

Corporate HQ: 650 Denton Blvd NW, Fort Walton Beach, FL 32547. Office Location: 27 Warwick, Shalimar, FL. The office address is reproduced as supplied; no street suffix, suite, or postal code was invented.

## Implementation

- `public/sow/index.html`, `sow.css`, `sow.js`: responsive branded page; user-selected payment acceptance image; exact GiveHub form URL; direct GiveHub fallback for browser trouble; existing contact number and both locations.
- Homepage donor links are ordinary same-site anchors. Event links include only an existing public event ID. The SowGo page shows that reference using textContent and explains that the donor must choose the correct fund; it never guesses a GiveHub fund identifier or modifies the payment URL.
- `public/_headers` permits frames only from `https://www.community.givehub.com`. Existing script, connection, object, form-action and frame-ancestor restrictions remain.
- Homepage address displays both labeled locations. Registration QR redirects, event records, sign-up links, discipleship links, and backend configuration are retained.
- A companion candidate in `eaglevisiondigital/championlife`, `assets/js/outreach-partner.js`, routes only the SowGo brand's accepted-submission fallback link and timer to `https://sowgo.org/sow/`. Church and unknown-brand paths retain `/outreach-giving.html`. Publish the SowGo page first, then the narrow partner continuation patch.

## Payment presentation and verification limits

Exact form: https://www.community.givehub.com/forms/outreach-main-giving

Read-only browser observation on November 19 showed: Partner With SowGo Outreach; preset amounts; Outreach Monthly Partner, Outreach One Time Offering, and St Lucia School Supplies funds; one-time/weekly/monthly frequency; and a DAFpay option. Continuing with a selected amount/fund led to email/mobile verification. No code was requested, donor identity entered, or transaction submitted. Full merchant card-brand acceptance and successful payments are not claimed.

The four-network image is the exact, unmodified PNG supplied and selected by the user on November 19: American Express, Mastercard, Visa, and Discover. The uploaded file is 986 × 212 pixels and is stored as `public/assets/payments/accepted-cards.png`. File SHA-256: `83d082627d5b2b6bb17291e93b473ab4a79f178ca35ff6fd31df0d45246069b0`. It replaces the earlier Discover-hosted strip at the user's request. Display fulfills the requested visual addition; it is not a statement that underwriting approval has been granted. DAFpay uses the provider's own button when available. No Apple Pay, PayPal or ACH marks were invented.

## Review and release

New-page preview is prepared for the user's mockup-first review. Production release requires that page review; do not describe the preview as the live `sowgo.org/sow/` page. Keep this work separate from broader backend rollout and payment-activation packages.

Focused check: with jsdom available on NODE_PATH, run `node tools/sowing-page.test.cjs`. Also run `node --check public/site.js`, `node --check public/site-data.js`, `node --check public/sow/sow.js`, and the existing preview build. The historical register-router test still expects the pre-existing Bessemer `/go` destination; current main uses Huntsville. Do not change the QR destination to satisfy that stale assertion.

Hosted page, payment-embed, responsive and screenshot results are recorded after preview inspection. Real donation acceptance remains untested.

## Focused review revision

On November 19 the user approved the remainder of the design and requested that the payment-symbol block and its explanatory note move below the giving form. The block now follows the unchanged GiveHub iframe and precedes form help, with a top divider and 20px of spacing. Short titles, labels and actions use initial capitals; full-sentence messaging and explanations remain in sentence case. The outreach reference label follows the same capitalization rule.

The prior hosted preview was inspected at desktop, tablet and narrow phone CSS widths (1363, 779 and 340px), including mobile navigation, the internal event link and the embedded form through its verification step. No donor identity or code was submitted. The revision preserves the iframe, links, images, addresses, responsive breakpoints and all other approved content. Current revision validation uses independent source review and the hosted Netlify build; a fresh browser screenshot is not available in the present runtime. This remains a preview update, with the companion partner-form change prepared separately.

## User-selected payment image revision

The user subsequently selected their uploaded four-card image for all four brands. Only the payment image bytes, its intrinsic dimensions and matching accessible description change in the page. The existing test expectation follows the new image order. The payment section remains below the form, and the approved capitalization, responsive styles, form integration, addresses and links are unchanged.
