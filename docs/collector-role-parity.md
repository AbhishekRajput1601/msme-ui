# District Collector

The eight routes in `angular/collector/CollectorRouting.js` are implemented under `/department/collector`:

| Route | Reference |
| --- | --- |
| dashboard | CollectorDashboard (executive overview matching Secretary/LDM) |
| processed | collector/dashboard.html (Processed Applications table with search and downloads) |
| batches | collector/batches.html |
| batchSign/:batchId | collector/batchSign.html |
| approved | collector/approved.html |
| detail/:applicationNo | collector/detail.html |
| esignApproval | collector/esignApproval.html |
| fa/viewfaapplicantdetailunitnew/:applicationId | applicant/fa/viewFADetailUnitNew2.html |
| fa/viewfaapplicantHistory/:applicationId/:establishmentType | applicant/fa/faHistory.html |

`scripts/compile-collector.py` compiles the source templates, expressions, CollectorController and shared FaViewController into static React metadata and JavaScript. No Angular runtime or fetched template execution is used. Source hashes, field/event inventory and action coverage are in `artifacts/collector`. The existing portal colors, side menu and shared layout are retained.

The implementation preserves:
- Status-22 selection locking and processed list display on the Dashboard (`loadProcessed()` via `/collector/fetchProcessed`).
- Search filtering across processed applications and approved applications.
- Card layout on the batch processing screen (`batches.html`), alternating card styles (`.appcard-alt`), DTIC/Secretary/LDM comment displays, and Chairman Decision selection (`Approved`, `Rejected`, `Queried`).
- Dynamic amount cascading: selecting `Rejected` resets application and assistance sanctioned amounts to 0, while selecting `Approved` or `Queried` restores the full eligible amounts.
- Assistance splitting: separating assistances into the numeric amounts table (with live `subtotalProposed` and `subtotalApproved` calculation) and the comments-only table.
- Clickable assistance comments overlay modal with backdrop and clean close handlers.
- Mandatory note validation when a sanctioned amount differs from eligible amount, or when the decision is not `Approved`.
- Sanctioned amount boundaries: non-null, non-negative, and cannot exceed eligible amount.
- Pre-approval actions: `saveSanctionedAmounts`, `saveBatchAmounts`, and `applyCollectorDecisions` before navigating to consolidated Batch PDF review.
- Consolidated Batch PDF review (`batchSign.html`) with Print Preview, confirmation checkbox, `approveBatchWithoutSign` submission, and downloaded signed Batch PDF.
- Approved applications screen (`approved.html`) with signed document downloads (`downloadSignedDocument/{applicationNo}`) and progress tracking.
- Full application details (`detail.html`) covering all industrial unit sections, contact info, capital investments, DTIC recommendations, and document downloads.
- Legacy eSign approval workflow (`esignApproval.html`) for Aadhaar eSign and local DSC utility integration.
- All requests use `/collector/` endpoints.

Validation:

- `python scripts/compile-collector.py`: eight routes, eight templates, zero missing template actions.
- `node scripts/check-collector-model.mjs`: status locking, batch decision cascading, sanction validation, mandatory remark notes, review confirmations, document lists, and view calculations.
- `npm run build`: successful production compilation with zero errors.

