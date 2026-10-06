# SowGo / Champion Life partner form integration

## October 2, 2026: link-only interim correction

Dave requested that all SowGo partnership and Join the Mission actions use the existing Champion Life Become an Outreach Partner form, eventually with SowGo branding and the shared Champion Life/SowGo backend.

The five existing partnership/mission/contact CTAs in public/index.html and the partnerUrl in public/site-data.js now use:

https://championlifefwb.com/outreach?source=sowgo.org

This is an INTERIM PAGE LINK, not a direct popup URL. Visitors currently must click Become a Partner on the Champion Life outreach page. Its existing global script then opens the native popup shown in Dave's screenshots. No query/hash-driven auto-open handler was found in the current production modal implementation. Do not claim the new link opens the popup automatically or has SowGo-themed form styling.

The old Jotform partnership URL was removed from SowGo's HTML and configuration. Current event-specific Jotform signups, prayer, discipleship, sowing links, website appearance, and images remain unchanged. No Champion Life code, Supabase state, merchant routing, DNS, or Netlify settings were changed by this correction.

## Verified existing intake

Read from eaglevisiondigital/championlife main:
- assets/js/site.js: native popup and submission logic.
- README-OUTREACH-PARTNER-GIVING.txt: field and giving flow documentation.

The native form is named outreach-partner, uses Netlify Forms, POSTs URL-encoded fields to the Champion Life site root, and redirects to /outreach-giving.html after an OK response. Netlify's project forms metadata confirms the outreach-partner form exists on Champion Life project 2b2af9ba-7001-4e96-9aef-44f012cc4397. No submissions were read or created in this review.

source-page is populated from the current full page URL, so the interim source query can be included in that field. It is descriptive attribution, never authorization or payment routing. No onward Supabase sync was verified. Do not equate Netlify acceptance or an HTTP OK response with verified persistence in the developing Supabase platform.

## Required shared-form design

Use one canonical partner intake with configurable presentation, not another operational database or permanent independent form collection. Preserve the existing Champion Life form and user journeys. Add a supported direct-launch URL for the existing popup or an accessible standalone form route. A SowGo presentation should use the approved logo, navy/orange palette, and Submit & Continue to Sow wording without changing the legal recipient or payment destination.

Record source brand/site separately from the organization receiving the outreach relationship. Keep the existing first/last name, email, address, phone, intended commitment amount, and frequency. Preserve guest access. A declared commitment is not a charge, active recurring subscription, or permission grant. Do not grant church membership, staff access, or marketing consent from submission, and do not attach an existing account based only on a typed email.

The shared backend phase must reuse reviewed organization-scoped partner/contact/commitment structures and the authorized financial destination. Validate submissions server-side, prevent duplicate submissions, protect private records, and verify the actual write and subsequent staff view using approved synthetic testing. Audit whether Netlify intake already has an onward integration before creating any bridge. Avoid uncoordinated dual writes. Do not release migrations, change payment processing, merge the existing backend PR, or interrupt the current acceptance gates merely to expose this form.

Return the exact supported public form URL, allowed branding/source options, optional embed contract, persistence destination, and test results to the SowGo frontend work. Only then replace the interim page links with the verified direct form entry.

## Validation and status

Local static checks confirmed all five partner links changed together, all visible page copy and images were preserved, and every non-partner link remained unchanged. site-data.js passed node --check. GitHub content hashes were verified (index.html also lost its final newline, with no rendered effect). Full live browser/form submission and the deployed SowGo update are not verified by these checks. No actual financial or partner data was submitted.

## Shared intake development integration — October 4, 2026

The explicitly authorized shared intake is implemented in Champion Life development PR #2. This isolated `codex/shared-outreach-partner` branch replaces only the five partner/mission/contact anchors and `partnerUrl` with:

https://deploy-preview-2--championlifechurch.netlify.app/outreach-partner.html?brand=sowgo

This is a **shared direct form on acceptance preview**, not a production destination or popup. It uses the approved SowGo logo/navy/orange, guest fields and Submit & Continue to Sow, storing one SowGo-owned canonical intake. The existing outreach giving continuation is unchanged.

Production main/SowGo.org remain unchanged. Do not merge this preview-target integration. Production rollout requires a separately authorized, deployed and tested shared production form URL and coordinated CTA cutover. No new form database, payment processing, DNS or merchant changes. Local checks prove only these six links changed; JS syntax passed. Hosted shared-form validation is tracked in Champion Life's package report.

## Main synchronization — October 4, 2026

Current main `650eb88e935c11ffa17a52922552941733fff8a8` is integrated by normal merge. The Partner-card conflict retains main's approved photos, overlay/logo, dimensions and current wording; only the intended five hrefs plus `partnerUrl` differ across the public website. Main's four card names remain Sow / Go / Pray / Partner. No production destination is activated.

See [coordinated cutover plan](OUTREACH-PARTNER-CUTOVER-PLAN.md). Champion Life release isolation is **NEEDS ADDITIONAL ANALYSIS**, because shared People/Staff authorization and the operational staff/build dependency boundary need a selective production-baseline test. Do not merge all of PR #2 to obtain Outreach. Both PRs remain draft/unmerged; no production or backend changes are part of this sync.
