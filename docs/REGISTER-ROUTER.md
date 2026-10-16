# Permanent preregistration QR router — release candidate

Build review only, October 16, 2026. No live cutover or deployment is authorized.

## Isolated hosted acceptance correction — October 16, 2026

Hosted review found the original Deploy Preview redirected `/register` to the production native origin. Unpublished deploy-preview/branch-deploy builds now copy the approved public artifact and replace only the two `/register` destination origins with `https://codex-huntsville-registration-2026--championlifechurch.netlify.app`. Path/campaign query, temporary 302 status, both slash forms, QR bytes and `/go` remain unchanged. Production still publishes the original `public/` artifact with no build command. The preview builder rejects production/unknown contexts and unexpected destination origins. No production routing change or merge is authorized.

For a future campaign, update the two reviewed source destinations as described below and set the corresponding isolated preview origin in `tools/build-register-preview.mjs` before its acceptance. The permanent printed QR stays unchanged. Preview configuration is never used by production.

- Permanent preregistration URL: **https://sowgo.org/register**.
- `/register` and `/register/` use explicit temporary `302!` Netlify rules targeting `https://championlifefwb.com/outreach-register.html?campaign=huntsville-2026`.
- `/go` and `/go/` remain byte-for-byte unchanged, targeting Bessemer's existing outreach decision/follow-up page. These routes are independent, never aliases.
- No new site, backend, credentials, DNS, payment, or normal website navigation changes.

The QR in `collateral/register/sowgo-register-qr.png` and `.svg` encodes only the permanent SowGo URL, not the current campaign destination. Black on white, error correction Q, four-module quiet zone; PNG 740×740. Generated using qrcode 8.2 and independently decoded using zxing-cpp 2.3.0. Collateral is outside `public/` and is not automatically published. Do not alter the flyer or distribute a live registration QR before release approval.

## Switching campaigns

Keep the printed URL and QR bytes stable. After separate acceptance and release approval for the new native campaign, change only the two `/register` destination fields, retain 302, and test both slash variants. Confirm event/date/venue, active registration and approved legal version, exact CORS/Turnstile deployment configuration, public submission, canonical staff totals/CSV, and phone scanning before cutover. Do not edit `/go` unless that independent router receives separate authorization. Avoid adding tracking parameters or a wildcard.

## Huntsville release gate

CITY HANGOUT, October 24, 2026; registration opens 1 PM, event 2–4 PM America/Chicago, Cornerstone Word of Life Church, 3783 Sullivan St, Madison AL 35758. The native Champion Life release candidate prepares disabled settings and a draft campaign. This router must not go live ahead of the native migration, exact legal publication, configuration, and hosted acceptance.

Retain the current JotForm `https://form.jotform.com/241026266712046` as source/fallback. No deletion or alteration. If approved cutover later fails, use an explicitly approved temporary fallback/rollback; do not silently change printed QR content.

Local check: `node tools/register-router.test.mjs`. Browser/Netlify hosted acceptance remains a separate gate; these source rules are not a claim that the live domain currently redirects.
