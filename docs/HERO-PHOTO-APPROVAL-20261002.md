# Approved hero photograph replacement

Dave approved the hero photograph on October 2, 2026.

## Source and authenticity

- User upload: `Edited-202 (1)(2).jpg`, 1264 x 600 pixels.
- The upload is byte-identical to Champion Life's existing `assets/images/outreach-hero-20260807.jpg`.
- Original SHA-256: `d93749a6ab182973493de6c3f97060a35210e6f18424cc857be8780880f91b49`.
- Original Git blob: `6aad12c5b17647cc79404735ad179a0c31ea4a7b`.
- Source: https://raw.githubusercontent.com/eaglevisiondigital/championlife/main/assets/images/outreach-hero-20260807.jpg
- Website asset: `public/assets/images/hero-outreach-approved-20261002.webp`.
- Website asset SHA-256: `3d033ab71ad5e7df393039beb0e9d6f761f193b03407cb0bc3032a3763b16dd1`.
- The photograph was encoded as WebP without cropping, retouching, redrawing, generative fill, or changes to people. Only website CSS supplies the framing and navy overlay. The original remains in the Champion Life repository and conversation upload.

## Scope

Base: `f40e34c24f93b9609020f95c5d6f860b69b5f650`. Preserve the existing SowGo logo, navigation, hero wording and buttons, all lower page sections, event data, partner and sowing links, review notices, and noindex protection. The gallery's separate temporary image is not replaced in this package.

The new asset, hero image metadata/preload, hero-only responsive CSS, and qualified photography review notice are the only public changes. Champion Life production, the shared backend, acceptance work, payment routing, DNS and the empty earlier Netlify project are unchanged.

## Validation and release

Local browser screenshots and checks run at widths 320, 375, 390, 768, 1024, 1440 and 1920. Checks include the real hero image dimensions, no horizontal overflow, no browser errors, unchanged links, and byte-identical content below the hero. Evidence is retained in the `sowgo-hero-local-review` Actions artifact.

The preparation job commits to an isolated review branch, not main. Promotion is a separate non-forced main update after screenshot review. After promotion, the same run verifies HTML and image bytes on the existing `sowgosite.netlify.app` review site and records actual hosted screenshots in the `sowgo-hero-hosted-review` artifact. A failed or incomplete hosted check is not a passed launch. No custom-domain cutover is included.
