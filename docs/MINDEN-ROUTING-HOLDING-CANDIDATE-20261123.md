# SowGo Minden routing holding candidate — November 23, 2026

**Local candidate only. No deployment or public cutover performed.** Publication remains held for David's one-word **go**. This is an interim routing correction, not activation of Minden attendee registration or a spiritual-response workflow.

## Source

- Repository: `eaglevisiondigital/sowgo`.
- Starting source: `0277451f9b41c90bc1209ffee7b8bff6d6a87a67` (`main`).
- Local candidate branch: `codex/minden-routing-holding-20261123`.
- Existing active project: `sowgosite`; no new project, function, backend, environment setting, or DNS configuration is introduced.

The source routing files pointed `/register` at the Huntsville attendee journey and `/go` at the Huntsville decision journey. `/registration` had no explicit route. The approved Minden volunteer URL in `public/site-data.js` is a distinct application, not attendee registration. No approved Minden attendee or decision workflow is activated here.

## Candidate routes

| Entry path | New temporary destination | Purpose |
| --- | --- | --- |
| `/register` and `/register/` | `/minden/attendee-info/` | Minden attendee information; no registration form |
| `/registration` and `/registration/` | `/minden/attendee-info/` | Explicit alias for the same attendee information |
| `/go` and `/go/` | `/next-steps/` | Separate public discipleship and prayer resources; no spiritual-response collection |

All six rules use `302!`, with no wildcard or permanent redirect. The forced registration routes take precedence over the preserved old static registration directory. The destination paths are local to the current site, so previews cannot send these routes into a production registration or decision form.

## Page content

The attendee information page states **Minden, Louisiana — Saturday, December 19, 2026** and **Registration details to be confirmed**. It clearly states that attendee registration is not open on that page. The volunteer link is separately labeled **Minden volunteer application**, points exactly to `https://championlifefwb.com/minden-serve`, and explains that applications are pending team selection and do not register someone as an attendee. No venue, time, attendee waiver, bicycle entitlement, or opening date is invented.

The independent next-steps page uses the existing public resource URLs from `public/site-data.js`:

- Discipleship: `https://championlifefwb.com/getting-a-grip.html`.
- Prayer: `https://championlifefwb.com/prayer.html`.

Both pages use the existing SowGo stylesheet and logo. They contain no form, input, iframe, script, new data collection, automatic account action, or submission/response confirmation. No follow-up or resource delivery is promised.

## Preserved source and scope

Only `public/_redirects` changes among pre-existing public files. Two static HTML pages are added. The preview builder and its existing router test are updated, and this candidate note is added.

All other 46 tracked public and QR collateral files match the starting source byte for byte. This includes the home page and navigation, `site-data.js`, giving, partner files, all assets, QR bytes, `public/register/index.html`, `public/register/register.css`, and `public/registration-thank-you/index.html`. The Netlify configuration and production partner build script are unchanged.

The historical Huntsville files remain present, including their direct static paths. This candidate does not delete, migrate, close, or alter historical form records, submissions, or provider configuration. It corrects the named routers only.

## Preview safety

`tools/build-register-preview.mjs` accepts deploy-preview and branch-deploy contexts only. It validates the six local destinations, rejects malformed/missing/duplicate routes, and copies the public source into `preview-public`. The copied partner settings are then explicitly set to `window.CHAMPION_LIFE_SUPABASE = null`, even if a source fixture contains settings. No production environment values are read and the source configuration is not mutated.

The production partner builder was inspected as source only; it was not executed. No production build, remote environment read, push, deployment, database change, payment activation, NMI migration/cutover, GiveHub change, or external contact occurred.

## Verification and remaining release check

- `node tools/register-router.test.mjs` passed. It covers the six exact temporary routes, the separate attendee/resources destinations, absence of collection elements, approved date/links, invalid and production-context rejection, source preservation, and disabled partner intake in a built preview even when the test's source configuration is non-null.
- The local preview builder completed successfully with the `deploy-preview` context.
- Comparison against the starting Git source verified the 46 unchanged existing public/QR files and unchanged production configuration.
- Browser rendering was attempted but could not run. The bundled Playwright browser was unavailable; installed Chromium was blocked by the environment's socket permission. Desktop/mobile visual acceptance and hosted Netlify route acceptance are therefore **not claimed**.

The routing rules are part of the static deploy artifact. They will change publicly only through a deployment of this reviewed candidate. Before declaring the correction live, verify the published six routes, both holding pages on mobile/desktop, and the existing giving/partner journeys. That deployment remains held for **go**.
