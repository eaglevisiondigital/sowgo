# Minden route preparation — SOURCE-ONLY DRAFT

Minden's canonical pages and guarded backend are prepared in the separate
Champion Life source-only draft PR #149:
https://github.com/eaglevisiondigital/championlife/pull/149

New **non-overlapping** SowGo shortcuts:
- `/minden/register` and `/minden/register/` -> native Minden household
  pre-registration at `https://championlifefwb.com/minden/register/`.
- `/minden/go` and `/minden/go/` -> Minden decision and free King Kind
  book at `https://championlifefwb.com/minden/`.

Each uses a temporary 302! redirect, without changing current shared
`/register`, `/register/`, `/go`, `/go/` or any previously printed QR.
These four additional shortcuts are held in an unmerged draft until the
Champion Life Minden routes and their backend are fully published and
genuinely tested.

**Before live activation:** exact approved event details and Louisiana
waiver; activated campaign; verified genuine household submissions,
decisions, assigned staff and city-specific reporting; audited fallback
and privacy/consent controls; QR scans and browser tests; final owner
authorization of SowGo + Champion Life production deployments. If a
future campaign needs the **shared** permanent QR route re-pointed,
that is a separate exact-scope release decision. Do not silently
redirect today's Huntsville or Bessemer printed materials.

SowGo does not host a second registration form, backend or donor database.
No credentials, donations, subscribers, or direct SQL are added.
Source check: `node tools/register-router.test.mjs`.
