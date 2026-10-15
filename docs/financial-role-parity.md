# Financial role migration

Entry point: `/department/fa/dashboard`, protected by `ROLE_FA`. The screenshot's Dashboard, PowerBi Dashboard, Financial Assistance group (Industrial Unit, Disbursement Calculator, Infrastructure Development Permission), and all four Report entries are connected. Profile and password links stay within the Financial role. Legacy `/fa/home#...` URLs preserve the Financial route, including IDs and calculator selections.

`compile-financial.py` reads FARouting.js, FAController.java, FAController.js, shared applicant/DTIC actions, all reachable templates and report scripts. It produces static React view metadata, controller functions, status-dependent row actions, report row builders and source inventories. No Angular runtime or evaluation of downloaded scripts is used. The existing portal date-picker adapter is reused for the legacy date format and calendar.

Implemented workflows include the officer list, acceptance, queries, progress/history, committee decisions, supporting documents, sanction and disbursement forms/downloads, calculator filtering/selection/allocation/save/export, infrastructure list/detail/print, report filters/pagination/totals/drill-downs/Excel export, PowerBI link, and account pages. Financial IO uses `/mpmsme/fa/`; the existing shared shell statistics endpoint supplies dashboard counts.

## Source gaps and substitutions

The checked-in legacy Financial router refers to files absent from both the source and built legacy checkout. `artifacts/financial/missing-source.json` records these. With the user's instruction to migrate everything, the available related legacy templates are used:

| Missing Financial template | Available reference used |
| --- | --- |
| fa/dashboard | Existing portal dashboard tiles, using Financial service counter keys |
| fa/detailList | fa/report, with dashboardReportData |
| fa/viewfaacceptanceamountdetailunit | dtic/viewfaacceptanceamountdetailunit |
| fa/faDisbursementUnit_new | fa/faDisbursementUnit_new1 |
| dtic/faApparelInstituteList | dtic/fapendingapplicantsapparel |
| fa/faCommitteeStatusUnit | dtic/faCommitteeStatusUnit |
| fa/viewfaCommitteeStatusUnit | dtic/viewfaCommitteeStatusUnit |

These substitutions provide the routes but cannot establish exact visual parity with unavailable Financial templates. The source's malformed void-element nesting was repaired so date controls and adjacent fields are not lost. Applicant/DTIC shared functions referenced but absent from FAController were included explicitly. Report export parameters use the selected end date and scheme rather than the legacy misspelled selectors.

## Verification

- `npm.cmd run build`
- `node scripts/check-financial-model.mjs`: 27 templates, 216 fields, 84 action bindings, 28 status/committee combinations, 7 report builders; selection and capped proportional calculator allocation.
- `node scripts/check-financial-browser.mjs`: isolated headless browser, mocked Financial API; all generated routes, report-filter request, date controls, desktop screenshots and mobile calculator.
- `artifacts/financial/reference-audit.json`: source hashes and compiled field/option/condition/table counts.

Live Financial credentials and backend data were not used. Successful real submissions, authorization, document generation and download contents require integration verification. Source gaps prevent a claim of exact parity for every page.
