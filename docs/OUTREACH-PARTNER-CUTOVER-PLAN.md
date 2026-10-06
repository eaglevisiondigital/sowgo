# Coordinated Outreach Partner cutover plan — October 4, 2026

**Planning only. No production release, PR merge, database/configuration change or Champion Life repository edit is authorized by this document.** SowGo PR #1 must stay open/draft/unmerged while it targets acceptance. Champion Life PR #2 must not be merged wholesale to obtain this feature.

## Reviewed versions and current behavior

- SowGo integration starting head: `d40cd52125b3684633d3fc7b1a92b91856969a13`.
- SowGo main integrated by normal merge: `650eb88e935c11ffa17a52922552941733fff8a8`.
- Champion Life development inspected read-only: `3f2316d4e575a538d7fb5866dc9c0390f66cc471`.
- Champion Life main inspected: `4af2bb9f9f0634850e6a6ad3f00193fe27d95a31`.
- Current shared destination, unchanged by this sync: `https://deploy-preview-2--championlifechurch.netlify.app/outreach-partner.html?brand=sowgo`.
- Current SowGo production/interim destination: `https://championlifefwb.com/outreach?source=sowgo.org`.
- Intended future direct production destination, **proposed and not deployed/verified by this task**: `https://championlifefwb.com/outreach-partner.html?brand=sowgo`. Activate only after the canonical Champion Life origin serves the approved production implementation and passes the gates below.

The sole merge conflict was `public/index.html`, on the Partner card. Resolution starts with current main's complete HTML and replaces exactly the five partner hrefs. Main's actual approved card headings are **Sow / Go / Pray / Partner**. Its current images, dimensions, Partner photo overlay/logo and wording are preserved, as are every other public asset, stylesheet, script and unrelated link. The task's reference to PREACH cards was not used to rename the current approved main cards.

## Release isolation verdict: NEEDS ADDITIONAL ANALYSIS

Source inspection identifies a plausible isolated release boundary; it does **not** establish that cherry-picking the Outreach commit is production-safe. No extraction or isolated release branch was made here.

Concrete blockers:

1. Outreach requires `20260928172557_people_staff_v1.sql`, not only its own intake migration. People/Staff introduces person identity anchors, relationships, assignment/date/scope rules and replaces existing private permission readers through `private.effective_staff_permissions`. It also changes existing People RLS/guards and the legacy `set_staff_access` adapter. This affects established staff paths and needs regression against an isolated reconstruction of the actual production baseline.
2. Current `staff-people.html` does not exist on the inspected production main. The intake review UI links back to that page, links a reviewed Person there and relies on it for follow-up task management. The development People page includes unrelated Events, Dream Track and Dream Team navigation and `staff-person-dream-team.js`. Copying the whole development staff page would bring broken/unreleased dependencies. A separately reviewed minimal operational staff surface is needed.
3. Existing Outreach backend tests replay **all development migrations**, including Events, registration, Dream Track and Dream Team. Their earlier success does not prove a baseline + People/Staff + Outreach-only migration chain. Run the selective chain and legacy permission/People/follow-up tests in a separately authorized isolation task.
4. Production main publishes `.`; development publishes a manifest-built `dist`. Copying development docs/tests/migrations into a release that still publishes the repository root risks exposing nonpublic files. A production-safe artifact boundary and selective manifest must be reviewed, preserving all current main pages/assets (including Christmas Dinner/Bessemer). Do not copy the full development manifest or deploy the audit workspace.
5. Current production migration/configuration/permissions parity and external Netlify intake notifications/automation were not inspected live here. Historical documentation records 17 applied migrations through `20260926040812`, but that is not a substitute for a release-time inventory. Existing capture must not be silently interrupted or dual-written.

There is no direct Outreach SQL requirement for Events, registration, Dream Track, Dream Team, grading, videos, mail templates or their workers. That narrows the candidate set below, but does not remove these release gates.

## Candidate Champion Life dependency set to review

These are exact source dependencies identified at the inspected development head, **not a certified minimal deploy manifest**.

### Database (existing production baseline plus two candidate forward migrations)

- Retain and verify the 17 already-applied historical versions documented in `docs/MIGRATION-BASELINE.md`, ending at `20260926040812_participant_portals.sql`. Never replay or rewrite those versions against production. `supabase/bootstrap/automatic-rls.sql` is for fresh/failed-prefix isolated provisioning only, never an established production cutover step.
- `supabase/migrations/20260928172557_people_staff_v1.sql`: supplies `private.people`, person anchors, `person_organization_relationships`, staff assignment/scope/date rules, `private.has_staff_permission`, private/public `people_workspace`, private/public `staff_workspace_context`, and compatibility changes described above. Audit the complete migration and its effects; do not hand-extract only a helper and bypass its authority model.
- `supabase/migrations/20261004055336_outreach_partner_intake_v1.sql`: creates `public.outreach_partner_intakes`, `private.outreach_partner_audit`, private/public `outreach_partner_submit(jsonb)`, and private/public `outreach_partner_workspace(uuid,text,jsonb)` with their RLS/ACL/index/validation/idempotency/audit definitions. Uses existing `organizations` (server-resolved `sowgo`), `organization_people`, `followup_tasks`, relationships, verified Auth identity and People/Staff authorization. It grants no staff rights to users.
- Keep private excluded from Data API. Guest submit is narrowly exposed by the public invoker RPC; no direct intake/audit table access. Workspace needs authenticated, active, verified organization-wide staff permissions. Named operational grants require a separate approved provisioning step; no bootstrap is implicit.
- No new Edge Function, Netlify function, SMTP worker, storage bucket or payment provider is required by the intake implementation. Existing hosted Auth remains a prerequisite for staff sign-in; do not change its templates, SMTP or ordinary callback.

### Public/shared renderer and existing Champion Life modal

- `outreach-partner.html`
- `assets/css/outreach-partner.css`
- `assets/js/outreach-partner.js`
- `assets/images/sowgo-logo-light.png` (approved existing SowGo asset)
- Existing `assets/images/logo-gold.png` (preserve approved Champion Life asset)
- Existing `assets/js/supabase-config.js`: retain the authorized production public URL/key in production; preview must retain isolated configuration. Do not copy acceptance values or expose privileged keys.
- `assets/js/site.js`: port **only** the shared Outreach renderer/modal loader and Partner-link interception/fallback changes onto current main, preserving every unrelated behavior. Do not overwrite with the whole development file.
- `outreach.html`: only intended partner direct-route fallback attributes/links, preserving current main content.
- `netlify-forms.html`: remove only the old `outreach-partner` detection declaration when switching the Champion Life modal to canonical storage. Retain Christmas Dinner and all unrelated form definitions. Retire old capture only after external notification/automation reconciliation; preserve historical Netlify records.
- Keep `outreach-giving.html`, its GiveHub destination and all merchant/giving settings exactly unchanged. Both brands continue there only after successful storage.

### Operational staff review/authentication dependencies

- `staff-outreach-partners.html`, `assets/js/staff-outreach-partners.js` including the current denied-access state repair.
- `assets/js/events-common.js`: currently supplies the `PropelEvents.el` DOM helper used by review. Including this helper file does not require an Events database release; any future extraction must be separately tested.
- Existing `assets/css/styles.css`, `assets/js/champion-life-auth.js`, public Supabase configuration and the existing Supabase JS browser library; reconcile differences with current main rather than copying unrelated Auth changes.
- `discipleship-login.html`: narrowly preserve/add the same-origin allowlist returns for `/staff-outreach-partners.html` and `/staff-people.html`, without importing Dream invitation logic or changing Auth/SMTP settings.
- Candidate People/follow-up shell dependencies: `staff-people.html`, `assets/css/staff-people.css`, `assets/js/staff-people.js`, `assets/js/staff-people-v1.js`, `assets/js/staff-person-detail.js`, `assets/js/staff-overview.js`, `assets/js/staff-admin.js`, `assets/js/staff-households.js`, `assets/js/staff-tags.js`, `assets/js/staff-workflows.js`, `assets/js/staff-giving.js`, `assets/js/staff-portals.js`. These are current shell imports, not permission to release unrelated modules. The isolation task must reduce/reconcile that surface and audit its remaining links/imports; do not include Dream Team solely to satisfy a development script tag.

### Build, docs and verification dependencies

- Review `tools/site-build/build.mjs`, a **selective** `tools/site-build/public-files.json`, and `netlify.toml` so only reviewed public assets publish and previews stay isolated. Preserve current main headers, redirects and unrelated functions; do not ship the full PR #2 application through its manifest.
- Carry scoped release notes/decisions, `docs/OUTREACH-PARTNER-INTAKE-V1.md` and baseline documentation outside the published artifact. Update the relevant continuity/security/build documents during the separately authorized isolation task.
- Carry/adapt the relevant existing tests: `tools/backend-tests/outreach-partner.test.mjs`, `outreach-partner.acceptance.sql`, `outreach-partner.dom.mjs`, `outreach-partner-staff.dom.mjs`; People/Staff and historical permission/follow-up regressions; redirect, syntax and site-build tests. Their test bootstrap/fixtures/package dependencies stay outside public output. Adapt the migration test inventory for the selected chain explicitly; do not auto-approve an entire development schema.

## Exact future SowGo substitution

Only after the production form is deployed, verified and approved, replace the current preview URL with the verified canonical production URL in:

| File | Location | CTA/config |
| --- | --- | --- |
| `public/index.html` | `#primary-navigation .nav-cta` | Join the Mission |
| `public/index.html` | `.hero .actions` | Join the Mission |
| `public/index.html` | Partner participation card | Become a Partner |
| `public/index.html` | `#mission .mission-copy` | Be Part of the Mission |
| `public/index.html` | `.footer-updates` | Connect With SowGo |
| `public/site-data.js` | `window.SOWGO_CONFIG.partnerUrl` | Shared Partner destination |

Retain `_blank` and `noopener noreferrer`. Exactly five href substitutions plus one config substitution. Preserve all other source bytes relative to the then-current approved main. Re-sync newer main changes if present. Update release docs separately from the published website. Never merge PR #1 while any of these six references still points to acceptance.

## Ordered future cutover (requires explicit release approval)

1. Approve a separate Champion Life isolation/release assignment resolving the blockers above. Pin fresh main/development revisions and record current production Netlify deploy IDs, artifact/config hashes and database migration/ACL inventory. Verify an appropriate recoverable backup. Obtain an explicit decision about current Netlify notifications, automation and intake record retention; do not infer consent from repository code.
2. Build and test the scoped Champion Life candidate in an isolated environment, with baseline + only required forward migrations. Prove current legacy staff behavior, People/follow-up compatibility, shared modal, both brands, revoked access, idempotency, tenant denial and artifact isolation. Provide the exact final manifest/migration set for review. Do not substitute acceptance project migration history wholesale.
3. Once separately authorized for production, apply only reviewed missing forward migration(s) in dependency order; verify functions, owners/search paths, grants, RLS and private-schema exclusion. Do not rerun historical migrations, reset the database, change ordinary Auth/SMTP or grant new staff permissions implicitly.
4. Deploy the reviewed Champion Life frontend/artifact first. Verify the canonical direct production URL and existing Champion Life modal serve the same native renderer and production backend; preserve giving continuation. Production copy must not call acceptance. Read back deployment/config identities without logging credentials.
5. Using explicitly approved synthetic data, validate successful submit, exact persisted owner/source/raw fields/commitment, retry idempotency, denied guest reads, wrong-organization/revoked-staff denial, approved staff review/link/follow-up and redirect to the unchanged giving page. No payment. Use approved disposable fixtures/cleanup only; no real-person grants. Check operational notification/automation retirement and no dual write. Record desktop/mobile screenshots and approvals. If any gate fails, stop before changing SowGo.
6. Only after that pass and explicit SowGo release approval, make the six production URL substitutions above on a current-main-synchronized branch. Verify all intended links on its preview, confirm no other visuals/links change, then release that reviewed SowGo commit. Do not accidentally merge the current acceptance URL version.
7. Verify the five CTAs from live SowGo, exact brand/logo/navy-orange and `Submit & Continue to Sow`, mobile menu, canonical production backend, unrelated links and unchanged giving/merchant destinations. Record both release SHAs/deploy IDs. Do not add production synthetic writes beyond the approved validation plan.

## Safe rollback

1. If Champion Life fails before SowGo cutover, **do not change SowGo**. Its current interim link remains valid only while the previous Champion Life outreach/modal is healthy; verify that before claiming recovery.
2. If failure follows SowGo cutover, make a normal reviewed rollback commit replacing only those same six destination values with the pre-cutover approved interim URL `https://championlifefwb.com/outreach?source=sowgo.org` (or the exact previously recorded healthy production destination). Never roll production CTAs back to the acceptance preview. Preserve any newer unrelated main changes; use a recorded prior deploy only if it contains those approved changes. Verify all five links again.
3. For Champion Life frontend regression, restore the recorded last-good **production** artifact or reverse only the scoped frontend changes on current main. Restore the prior native modal/Netlify detection behavior together if needed, and reconcile notifications/automation before re-enabling old capture. No dual-writing fallback. Preserve Christmas Dinner/Bessemer/unrelated releases, Auth, SMTP, DNS and giving.
4. Retain accepted intake/audit/People/follow-up data. Do not drop tables, erase history, remove applied migration records or automatically reverse People/Staff permission changes. Those changes affect shared authority and need a reviewed forward repair. If intake must be disabled, use a separately authorized maintenance/ACL plan with a visible failure state, then validate staff access; never silently redirect visitors as though data saved.
5. Record partial-write/operational impact and reconcile records through an approved process before retrying cutover. Never restore a whole database backup over newer valid data as an automatic rollback.

## Sync validation boundary

The sync compares all 28 tracked public files to main: only the five hrefs and one config value differ; no public files were added/removed. JavaScript syntax and local HTML/resource checks are run. Hosted preview navigation/responsive results and the final head/PR status are recorded in the private engineering handoff after push. No new partner records or payments are needed for this task. This plan is not production approval.
