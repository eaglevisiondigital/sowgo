# SowGo standalone website

Standalone frontend for **sowgo.org**, based on Dave Fowler's approved responsive mission website design. This repository is separate from `eaglevisiondigital/championlife`.

## Deployment checkpoint — October 2, 2026

The website source is committed and connected to its own Netlify project. No manual website upload or new GitHub repository is required.

**Use the active linked Netlify project `sowgosite`, not the earlier empty `sowgo` project.**

- Active project: `sowgosite`
- Active project ID: `690f7d62-e122-4c3e-8bb9-617f81b29847`
- Review URL: https://sowgosite.netlify.app
- Dashboard: https://app.netlify.com/projects/sowgosite
- Repository: `eaglevisiondigital/sowgo`
- Branch: `main`
- Base directory: repository root (leave blank)
- Build command: none; `netlify.toml` explicitly sets an empty command
- Publish directory: `public`

Netlify's deployment API confirmed deploy `6abfc1608085470009f0ffb6` as `ready`, published October 2, 2026 at 14:36:26 UTC, with source commit `5ef0ee93a1a462830ac57e00c5c34e633b566040` and no reported deployment error. This verifies hosting/build status, **not full hosted browser acceptance**. The current Chat browsing environment could not retrieve the public page or Netlify screenshot; do not mark menus, links, external forms, or payments as hosted-tested based on the deployment status alone.

The earlier `sowgo` project (`6895fac9-d4bb-413f-a585-889442f212dd`) is separate and was not renamed or deleted. Do not provision another duplicate or change that project while working on the active site.

Custom-domain/DNS cutover for `sowgo.org` has not been performed by this work. Confirm its existing DNS provider and records before connecting it. Preserve email and unrelated DNS records.

## Website files recovered — October 2, 2026

All 27 public files were imported in commit `96a2425aea1e144b7213565581a35b54edd07f86` through successful GitHub Actions import run `36974232842`.

- Approved ZIP SHA-256: `2173b694a4674a039c465197fe8083edb14be8af02e2cfd7821328302d1355e8`.
- Imported public Git tree: `1d7f74effb0eee64efb23d9e29efbe1a3d95a849`.
- The approved archive and imported public Git tree matched exactly: paths, bytes, and modes.
- JavaScript syntax checks passed in the import job.
- The one-time importer/workflow and temporary Netlify archive variable were removed. Normal builds do not depend on ChatGPT files, Google Drive, or expiring download links.

No backend credentials or environment variables are required for this static review frontend. Publish only `public/`, not repository documentation.

## Preserve the approved design

Preserve the navy/orange brand, original God's Love Compels Us hero, Sow terminology, equal-height event cards, 50,000+ salvations / 16 years ministry-reported figure, Gospel of the Kingdom messaging, and What Happens After Salvation discipleship section. Do not substitute intervening alternative mockups.

## Integration boundaries and remaining review gates

- Champion Life's website, repository, acceptance work, and shared backend remain unchanged.
- Reuse the existing Champion Life/SowGo backend for approved signup, outreach, and financial integrations. Do not create a duplicate operational database.
- Existing form, partnership, discipleship, and outreach sowing destinations are preserved. No new processor or merchant routing is activated by this frontend deployment. See `docs/PARTNER-FORM-INTEGRATION.md` for the current interim partner entry point and shared-form requirements.
- Funding bars remain labeled design placeholders, not actual financial totals.
- The authentic-photo replacement package has been prepared and locally tested, but it is **not in the deployed source commit identified above**. Do not describe those replacement photos as published. The prepared patch baseline is `5ef0ee93a1a462830ac57e00c5c34e633b566040`; reconcile later source changes before applying it.
- App availability and unreleased backend integrations must not be represented as live. Do not invent app-store links or credentials.
- Keep review disclosures and noindex settings until their corresponding launch checks pass.
- Complete hosted desktop/tablet/mobile browser checks and capture actual deployed screenshots before declaring full acceptance. Offline screenshots and local test reports are not live-site verification.

Approved mockups, source delivery files, the pending photo patch, and local test evidence are retained with the project conversation. This documentation update changes no public website files, giving destination, backend configuration, or DNS record.
