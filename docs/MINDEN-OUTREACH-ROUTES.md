# Minden shared QR router cutover — DRAFT, NOT LIVE

Owner direction (November 12, 2026): after separate acceptance and release
approval, send these existing public SowGo entry points to Minden:

| SowGo path | Exact destination |
|---|---|
| `/registration`, `/registration/` | `https://championlifefwb.com/minden/register/` |
| `/register`, `/register/` (existing printed registration QR) | same Minden native preregistration |
| `/go`, `/go/` (existing printed decision QR) | `https://championlifefwb.com/minden/` |
| `/minden/register`, `/minden/register/` | same Minden native preregistration |
| `/minden/go`, `/minden/go/` | same Minden decision / free-book page |

The destination decision page offers the free **King Kind** reader and
free online discipleship resources, as prepared in the separate Champion Life
source-only draft PR #149:
https://github.com/eaglevisiondigital/championlife/pull/149

The source uses explicit `302!` temporary redirects. Neither the printed QR
destination text nor any QR artwork changes. Previous Huntsville links cease
to be the **shared router's** destination only after authorized cutover;
historical `/huntsville/` pages and records remain untouched.

## Safety and preview checks

- This draft is NOT merged or deployed. Existing live routing is not asserted
  here. No database/merchant/tenant or login operation performed.
- `tools/build-register-preview.mjs` deliberately refuses to run unless
  `MINDEN_CHAMPIONLIFE_PREVIEW_ORIGIN` is set to an exact verified HTTPS
  `<name>--championlifechurch.netlify.app` preview origin. Do NOT use the
  historical Huntsville preview or guess a new URL. This variable is a
  nonsecret reviewed preview binding, not a production authorization.
- Preview builder maps all 10 exact SowGo routes to that one preview origin,
  preserving path. It rejects missing, duplicate or drifting destinations and
  production context. No live fallback substitution is implied.
- Unit contract: `node tools/register-router.test.mjs`.
- Before cutover, confirm the chosen Minden destination for BOTH QR campaigns,
  scan physical QR codes, test slash and no-slash forms and mobile browsers,
  and establish owner-approved fallback/rollback for routing.

## Remaining shared launch gates

Minden Family Fun Day is Saturday, December 19, 2026 at Victory Park,
Park Highway, Minden, LA 71055. On-site registration begins 11 AM CST;
Family Fun Day noon–2 PM, with 100 bicycles being given away (individual
eligibility and distribution rules remain unapproved). Confirm the exact
legal local host and approved Louisiana-specific waiver/media consent; accepted campaign migration and
registration activation; genuine end-to-end household and decision submissions;
verified city-scoped staff role, reports and signed-in Auth/RLS; and separate
Champion Life and SowGo production release authorization.

Do not merge the SowGo redirects ahead of those requirements. Do not delete
Huntsville historical registrations or create another donor/People database.
