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
