# Infrastructure Development: five applicant sections

These are the five sidebar sections requested in the screenshot, separate from the Financial Assistance infrastructure permission form.

| Section | React route | Original template | Columns |
| --- | --- | --- | --- |
| Developed Land Allotment | `/applicant/land-allotment/new` | `vacantLandList.html` | 23 |
| Undeveloped Land Allotment | `/applicant/land-allotment/explore` | `vacantLandListUN.html` | 18 |
| Applications List | `/applicant/land-allotment/` | `applicationList.html` | 10 |
| Annual Payments | `/applicant/land-allotment/annual` | `annualPayments.html` | 9 |
| Notice and Appeal | `/applicant/land-allotment/notices` | `noticeAppealList.html` | 8 |

Reference: adjacent `mpindustry-web/src/main/webapp/pages/applicant/id`, applicant ID controller and routing. No backend files were changed.

`scripts/compile-land-reference.py` compiles 24 original templates and 266 bindings into static React metadata. It preserves original labels, markup, scoped styles, table columns, and DataTables conditional action branches. The field/event inventory is `artifacts/land-allotment/reference-inventory.json`. Runtime rendering does not execute legacy scripts or evaluate source strings.

Linked reference templates cover developed/undeveloped instructions, annual entry/history/details, compliance entry/history, ZO/IC appeals and hearing details, conditional compliance and decisions, LOC and possession signing. Server-resolved payment reviews and LOC/tender pages are rendered through an allowlisted React renderer, retaining resolved amounts, hidden fields and submission actions. Payment CAPTCHA, required remarks, confirmation dialogs, downloads, pagination, search, and legacy hash links are wired to the existing workflows.

Existing application entry/edit, document upload, application detail/history, query reply, and general signing components remain connected through the original action routes. They were not recompiled from their original templates in this change; this change alone does not establish exhaustive visual parity for those existing components.

Verification:

- `node scripts/check-land-model.mjs`: passed.
- `node scripts/check-land-services.mjs`: passed (API paths, payloads, multipart fields, rejected saves, downloads and signing contracts).
- `node scripts/check-land-reference-browser.mjs`: passed for all five lists, pagination, developed/undeveloped filters, old hashes, annual save rejection/success, review hidden token, history/details, compliance save, ten appeal/decision modes, both letter eSign requests, both instruction acknowledgement gates, and payment CAPTCHA/remarks validation.
- `npm.cmd run build`: passed; bundle-size warning remains.
- `npm.cmd run lint`: exits successfully with warnings, including adapter mutation and Fast Refresh warnings.

Browser fixtures intercept backend traffic; they do not make live submissions, payments or signatures. Screenshots and check results are in `artifacts/land-allotment`. Live backend persistence, real eSign/DSC completion, and pixel comparison against a running legacy application remain unverified. No claim of exhaustive application-wide parity is made by these checks.
