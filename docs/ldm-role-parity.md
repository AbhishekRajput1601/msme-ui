# Lead District Manager

The six routes in `angular/ldm/LdmRouting.js` are implemented under `/department/ldm`:

| Route | Reference |
| --- | --- |
| dashboard | ldm/dashboard.html |
| verification | ldm/verification.html |
| batches | ldm/batches.html |
| detail/:applicationNo | ldm/detail.html |
| fa/viewfaapplicantdetailunitnew/:applicationId | applicant/fa/viewFADetailUnitNew2.html |
| fa/viewfaapplicantHistory/:applicationId/:establishmentType | applicant/fa/faHistory.html |

`scripts/compile-ldm.py` compiles the source templates, expressions, LdmController and shared FaViewController into static React metadata and JavaScript. No Angular runtime or fetched template execution is used. Source hashes, field/event inventory and action coverage are in `artifacts/ldm`. The existing portal colors and shared layout are retained. Invalid legacy table heading nesting is repaired without removing content.

The implementation preserves status-21 selection locking, search, verification and query confirmations, 2,000-character remarks and presets, verification history, all detail sections and document types, batch defaults, Agree/Disagree options, mandatory Disagree notes, 1,000-character note limits, assistance comments and zero-amount display rules. Batch drafts remain in the authenticated layout while viewing details/history and clear after successful forwarding or returning to the batch list. Rejected submissions retain the draft. All workflow and document requests use `/ldm/` endpoints.

The shared view's three calculation helpers are sourced from the applicant controller. Common document downloads use the existing LDM `downloadDoc` resolver because the legacy `downloadDocumentById` URL is not mapped for LDM. The optional sector-name lookup retains the source's nonfatal behavior: the supplied CommonController does not map `/ldm/fetchAllIndustryCategory`. Resolving that backend omission requires a server change; this UI does not switch to another role's endpoint.

Validation:

- `python scripts/compile-ldm.py`: six routes, six templates, no missing template actions.
- `python scripts/audit-industrial-reference.py`: 17 Industrial Unit templates, 544 field occurrences, no missing fields or actions.
- `node scripts/check-ldm-model.mjs`: status restrictions, request payloads, decision validation, successful/rejected batch handling, document inventory and read-only null guards.
- `node scripts/check-ldm-browser.mjs`: isolated authenticated API fixtures covering all six pages, modals, verification/query, forwarding, downloads, mobile overflow and return-to-batch draft preservation. Screenshots and request results are in `artifacts/ldm/browser`.
- `npm.cmd run build`: production compilation.

Browser checks use fixture data and do not submit real applications. They do not establish pixel-for-pixel comparison against a running AngularJS server or verify live authenticated backend transactions. Existing build warnings concern legacy font/watermark URLs and bundle size.
