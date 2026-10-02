# Approved hero deployment verified — October 2, 2026

## Result

Dave's approved original outreach photograph is published on the existing standalone SowGo review site: https://sowgosite.netlify.app.

- Netlify project: `sowgosite`
- Site ID: `690f7d62-e122-4c3e-8bb9-617f81b29847`
- Verified source commit: `b9c2c3be944eb64da255aada8164c689837e3e04`
- Verified deploy: `6abfe0e98085470009fa95ff`
- Netlify state: `ready`, published October 2, 2026 at 16:50:55 UTC.
- Actions run: https://github.com/eaglevisiondigital/sowgo/actions/runs/37036439235
- Preparation, responsive tests, reviewed main promotion, hosted checks, and evidence uploads all succeeded.

This supersedes the earlier statement that no authentic hero replacement was published. It does not mean the separate broader photo-replacement package has been applied. The other temporary photographs remain unchanged.

## Authentic source

User upload: `Edited-202 (1)(2).jpg`, 1264 x 600 pixels. It is byte-identical to the original already in Champion Life's repository.

Original SHA-256: `d93749a6ab182973493de6c3f97060a35210e6f18424cc857be8780880f91b49`.

Published WebP SHA-256: `3d033ab71ad5e7df393039beb0e9d6f761f193b03407cb0bc3032a3763b16dd1`.

Published asset: `public/assets/images/hero-outreach-approved-20261002.webp`, 159824 bytes. No generative editing, face replacement, retouching, or source cropping was performed. CSS provides the responsive crop and navy overlay.

## Verification

Local browser checks passed at widths 320, 375, 390, 768, 1024, 1440 and 1920, including image loading, no horizontal overflow, no page errors, and mobile menu toggling.

The actual hosted page returned HTTP 200. Its HTML referenced the approved asset, and the downloaded image bytes matched the expected SHA-256. Hosted browser checks and screenshots passed at 1440, 768 and 375 pixels. The desktop and tablet hero screenshots were pixel-identical to the reviewed local renders. The mobile capture had a slight scroll-position difference; its framing, text, and controls were visually reviewed without a layout defect.

Evidence artifacts:

- Local: `sowgo-hero-local-review`, artifact `11240576407`.
- Hosted: `sowgo-hero-hosted-review`, artifact `11241305286`.

Screenshots and JSON evidence were also downloaded into the project conversation. GitHub artifact retention is 30 days, so retain the conversation copies for long-term reference.

## Scope preserved

The lower page content is byte-identical to the prior version. All existing anchor destinations, navigation, logo, hero wording and calls to action, event data, registration/partner/sowing links, and other photographs are unchanged. Only the hero asset/preload/alt text, hero-scoped responsive CSS, and the photography review notice were updated.

No Champion Life production, shared backend, acceptance project, merchant/payment routing, DNS, domain cutover, or earlier empty Netlify-project changes were made. App and backend launch disclosures and noindex remain. These checks validate the hero update; they do not certify external form submissions, payment processing, app availability, or a complete public launch.

The original preparation workflow was removed before the source was promoted. Normal hosting does not depend on a ChatGPT file, temporary download link, or that one-time workflow.
