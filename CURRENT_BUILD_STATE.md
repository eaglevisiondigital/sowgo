# Universal outreach QR router candidate — October 6, 2026

Isolated SowGo branch `codex/sowgo-universal-outreach-router`, based on production `9a4c55aa89c932e3a5639e5eef97f210dbee0756`. This package is prepared for review, **not released or activated**.

Implemented: permanent `/go` edge resolver, runtime campaign configuration, existing staff permission checks, branded fallback, anonymous aggregate request counts, print QR SVG/4096px PNG. Bessemer is prepared at `https://championlifefwb.com/bessemer/`; active campaign starts null. No Huntsville page is published or production record created.

Tested locally: released 22-migration staff baseline plus only the new router migration; public/unauthorized/tenant/verified-email/revocation boundaries; approved URL validation; no-deploy switching; repeated counters; email-code admin DOM; edge fallback/302/HEAD/query handling; independent QR decode and asset integrity. Chrome fallback checks passed at 390/768/1440 with loaded logo, 48px CTA, no horizontal overflow or warning/error logs.

Not applied: new database migration, router runtime environment configuration, production deployment, live activation. Hosted Auth/database/admin end-to-end and physical camera/printed QR acceptance remain release gates. Normal PR preview can validate edge fallback without connecting to any database. Do not configure it against production merely to test this candidate.

Champion Life PR #5 / PR #2 and production, Phase A acceptance, existing SowGo website files, giving, Auth settings, SMTP, DNS and merchant routing are outside this package. See [architecture, security and release procedure](docs/UNIVERSAL-OUTREACH-ROUTER.md).
