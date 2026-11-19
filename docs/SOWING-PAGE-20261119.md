# SowGo sowing page — November 19, 2026

## Requested result

Provide the SowGo-branded route `/sow/` with the existing, user-supplied GiveHub form embedded. Route all donor-facing Sow actions from the header, hero, participation card, event cards, full schedule, footer, and successful SowGo partner-form continuation to that page. Keep the current shared registration and partner-intake systems.

Corporate HQ: 650 Denton Blvd NW, Fort Walton Beach, FL 32547. Office Location: 27 Warwick, Shalimar, FL. The office address is reproduced as supplied; no street suffix, suite, or postal code was invented.

## Implementation

- `public/sow/index.html`, `sow.css`, `sow.js`: responsive branded page; official payment acceptance artwork; exact GiveHub form URL; direct GiveHub fallback for browser trouble; existing contact number and both locations.
- Homepage donor links are ordinary same-site anchors. Event links include only an existing public event ID. The SowGo page shows that reference using textContent and explains that the donor must choose the correct fund; it never guesses a GiveHub fund identifier or modifies the payment URL.
- `public/_headers` permits frames only from `https://www.community.givehub.com`. Existing script, connection, object, form-action and frame-ancestor restrictions remain.
- Homepage address displays both labeled locations. Registration QR redirects, event records, sign-up links, discipleship links, and backend configuration are retained.
- A companion candidate in `eaglevisiondigital/championlife`, `assets/js/outreach-partner.js`, routes only the SowGo brand's accepted-submission fallback link and timer to `https://sowgo.org/sow/`. Church and unknown-brand paths retain `/outreach-giving.html`. Publish the SowGo page first, then the narrow partner continuation patch.

## Payment presentation and verification limits

Exact form: https://www.community.givehub.com/forms/outreach-main-giving

Read-only browser observation on November 19 showed: Partner With SowGo Outreach; preset amounts; Outreach Monthly Partner, Outreach One Time Offering, and St Lucia School Supplies funds; one-time/weekly/monthly frequency; and a DAFpay option. Continuing with a selected amount/fund led to email/mobile verification. No code was requested, donor identity entered, or transaction submitted. Full merchant card-brand acceptance and successful payments are not claimed.

The four-network artwork is unmodified Discover-hosted acceptance art: Discover, Visa, Mastercard, and American Express. Source: https://www.discoversignage.com/free-signage-logos/ — All Acceptance Marks, 4-logo, RGB PNG. File SHA-256: `9e852377f24d115cd3af124e93df950bfb52065f0392c75c2841a8522629b0d2`. Display fulfills the requested visual addition; it is not a statement that underwriting approval has been granted. DAFpay uses the provider's own button when available. No Apple Pay, PayPal or ACH marks were invented.

## Review and release

New-page preview is prepared for the user's mockup-first review. Production release requires that page review; do not describe the preview as the live `sowgo.org/sow/` page. Keep this work separate from broader backend rollout and payment-activation packages.

Focused check: with jsdom available on NODE_PATH, run `node tools/sowing-page.test.cjs`. Also run `node --check public/site.js`, `node --check public/site-data.js`, `node --check public/sow/sow.js`, and the existing preview build. The historical register-router test still expects the pre-existing Bessemer `/go` destination; current main uses Huntsville. Do not change the QR destination to satisfy that stale assertion.

Hosted page, payment-embed, responsive and screenshot results are recorded after preview inspection. Real donation acceptance remains untested.
