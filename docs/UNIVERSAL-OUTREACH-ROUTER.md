# Permanent SowGo outreach QR router

The banner always encodes **https://sowgo.org/go**. Only the stored active destination changes. Public navigation is a server-side HTTP 302 with `Cache-Control: no-store`; no query parameter influences campaign selection or destination.

## Architecture and boundaries

`netlify/edge-functions/outreach-router.js` handles only `/go`, `/go/`, `/go/admin` and its descendants, and `/api/outreach-router-config`. Existing static SowGo pages are unchanged. Publish remains **public/**. SQL, test fixtures and private audit material are never published.

The candidate's single new migration is `supabase/migrations/20261006185414_sowgo_universal_outreach_router_v1.sql`. It relies only on the released Organizations/People/Staff baseline from Champion Life production `e1f75f917f9a1e6e16e0b8f9bc5d7b52fbf0a424`. CI pins those 22 existing migration files from that public repository for synthetic local testing; it does not apply them to a hosted database. No unfinished PR #5 tables/functions are required.

Four private RLS tables hold routing catalog, active pointer, counters and admin audit. They are an independent routing configuration, not another Outreach intake/campaign engine. Future campaign-core integration can populate this catalog through an approved adapter; it must preserve tenant ownership, URL approval and runtime activation semantics. The fallback links to the existing SowGo outreach section; campaign listing is deferred to that integration.

Existing verified staff permissions are checked on every RPC: `outreach.view` to inspect, plus `outreach.manage` to edit. Existing active/account/expiry/revocation rules apply. No grants are created by this migration. Optimistic router revision plus row locking rejects stale edits. Auth uses the existing account email-code protocol with `create_user:false`. There is no signup, callback change, persistent browser token, service credential or second identity system. The page-only token is discarded on denial/expiry/end session.

The admin entry point is `/go/admin/`. Its static login shell may be downloaded publicly; protected catalog, analytics and mutations require server authorization. No protected information is embedded in HTML.

## Destination safety

Both SQL and edge enforce literal absolute HTTPS URLs under exactly `championlifefwb.com` or `sowgo.org`, with simple paths only. Userinfo, ports, query, fragment, encoded separators, dot segments, repeated slashes, third-party hosts and `/go`/descendant loops are rejected. An authorized administrator must also confirm the chosen page is approved, live and does not itself redirect back to `/go` before marking it eligible. Indirect redirects controlled by destination hosting cannot be inferred from a stored string.

The initial catalog contains Bessemer, Alabama 2026 at `https://championlifefwb.com/bessemer/`, eligible but **not activated**. Missing config, missing/disabled campaign, invalid URL, backend errors or timeouts produce the branded fallback. The router never forwards cookies, visitor IP, user-agent or referrer to its RPC.

Future Huntsville can be saved as a catalog record and activated with the same admin controls after separate page approval. No QR, code or schema change is needed. Tests exercise a synthetic local Huntsville record only.

## Analytics and privacy

GET resolution increments an atomic hourly aggregate: timestamp bucket, campaign ID or fallback, router/QR identifier, outcome, count and first/last timestamps. HEAD does not increment. No name, email, phone, IP, user-agent, browser ID, cookie, fingerprint or consent field is stored. These are request counts, not unique people; bots/repeated requests and direct calls to the public RPC can increment them. Hosting infrastructure can have its own access logs independently of this application counter.

Admin audit records the authenticated staff actor/action/revision separately; public scans have no actor. Telemetry failure does not break navigation. Admin shows the last 30 days of aggregates. No destructive retention schedule or new consent policy is introduced.

## Runtime configuration

Two Netlify environment values, scoped to **Functions** (includes Edge Functions), supply the existing backend:

- `SOWGO_ROUTER_SUPABASE_URL`: exact approved existing project HTTPS origin.
- `SOWGO_ROUTER_PUBLISHABLE_KEY`: existing **publishable** key (`sb_publishable_…`), never secret/service-role credentials.

These public client settings are returned by the scoped config endpoint; all data authorization remains in RPCs. The admin receives a scoped CSP permitting only its exact backend origin. Other pages retain their existing CSP. Missing values produce a safe fallback and an explicit unconfigured admin state.

Do not inherit production values into a preview for acceptance. Preview Auth/database verification requires a separately approved isolated environment with only the released baseline plus this candidate; do not alter the PR #5 Phase A fixtures or configuration. Public fallback/QR/edge packaging can be inspected without any backend values.

## Validation and print assets

`npm ci --ignore-scripts`, `npm run check`, `npm test`. Local database tests use `CHAMPION_LIFE_BASELINE` or the neighboring released-baseline checkout. CI fetches the pinned production source solely for local replay. Seven focused tests include many security/behavior assertions.

`node tools/generate-outreach-qr.mjs` deterministically generates:

- `public/assets/qr/sowgo-universal-outreach.svg`
- `public/assets/qr/sowgo-universal-outreach.png` — 4096 × 4096, opaque black/white, four-module quiet zone, error correction M.

Independent ZXing decoding verifies the exact permanent URL. SVG bytes match deterministic generation of that same decoded payload; no image/logo/script is embedded. Use the SVG for large-format print. Preserve the square aspect ratio and full quiet zone; optional printed text below: **SOWGO.ORG/GO**. Actual phone-camera and printed-banner scans must still be checked; no physical-device PASS is claimed.

## Exact release sequence — separate authorization required

1. Review the isolated SowGo draft PR and candidate commit. Keep Champion Life PR #5 and PR #2 unchanged. Confirm the current production heads and existing configuration before any write.
2. Obtain approval for isolated hosted router acceptance, including the environment and migration scope. Apply **only this new migration** there; never replay released migrations or point preview testing at production. Use synthetic authorized/view-only/unauthorized staff fixtures and clean up only those fixtures.
3. Configure the two public runtime values for that preview environment in the existing `sowgosite` project; scope to Functions/deploy-preview. Verify its exact commit/context and run hosted active-Bessemer, malformed/no-active, permission denial/revocation, no-deploy switch, counter and admin-CSP checks. Do not send real email or activate real campaigns without authorization. Test a phone camera with the QR asset and confirm its decoded destination.
4. Obtain separate production release authorization for the exact reviewed commit, migration, runtime values, merge and Bessemer activation. The target backend remains the existing shared production project; no new operational database, Auth/SMTP/DNS or staff grants are needed. Confirm the released baseline and SowGo organization before applying **only** `20261006185414` through the existing approved migration mechanism. A generic `db push` from this partial-migration repository is not a release procedure.
5. Set the two public values for the production Functions context on existing `sowgosite`. Preserve all other variables. Merge only the approved SowGo PR through the normal Git/Netlify workflow; publish directory stays `public/`. Confirm a ready production deploy at the reviewed commit. Check `/go` fallback and `/go/admin/` CSP/login before activation.
6. With an existing authorized SowGo administrator, verify Bessemer's approved page is live and does not loop, then select **Bessemer, Alabama 2026 → Activate selected campaign**. Confirm `/go` is an uncached 302 to exactly `https://championlifefwb.com/bessemer/`; repeat scans increment counters; page/form/giving behavior at the destination is unchanged.
7. Record exact deployment/config/activation results. Production URL is permanent; all subsequent approved city switches occur through admin without a deploy.

Rollback: authorized admin selects **Use fallback page** immediately. If the edge deploy is defective, restore the previous known-good SowGo deployment through the established release process. Preserve catalog, counters and audit; do not drop tables, rewrite history, change DNS or modify other products.
