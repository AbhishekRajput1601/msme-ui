# Applicant menu migration

The screenshot's Online NOCs on MPIDC, MSME Award, Add Bank Details and Banks List entries now have dedicated React routes. The existing Java backend is unchanged.

| Menu / workflow | React route | Legacy template |
| --- | --- | --- |
| MPIDC services | `/applicant/online-nocs` | `applicant/mpidcServices.html` |
| Add bank | `/applicant/bank-details/new` | `bank/addBankDetails.html` |
| Bank list | `/applicant/bank-details` | `bank/banksList.html` |
| Award list | `/applicant/msme-award` | `msme/applicantAwardList.html` |
| Apply | `/applicant/msme-award/applyMsmeAward/:id` | `msme/applyMsmeAwardForm.html` |
| Edit / draft | `/applicant/msme-award/editMsmeAward/:id/:applicationId` | `msme/editMsmeAwardForm.html` |
| View / print / download | `/applicant/msme-award/viewMsmeAwardForm/:id/:applicationId` | `msme/viewMsmeAwardForm.html` |
| Documents / submission | `/applicant/msme-award/uploadMsmeAwardDocs/:id/:applicationId` | `msme/msmeAwardDocUploadForm.html` |

The source checkout is `E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE`. `scripts/compile-applicant-services.py` compiles the original markup, inline CSS, conditions, options, validation messages and bindings into static metadata for the existing React reference renderer. It ports all 15 reachable award actions from `angular/applicant/msme/controller.js`; no Angular runtime is loaded. The shared theme and 153 existing translation keys are reused. Shared keyboard restrictions come from `angular/common.js`.

The field inventory in `artifacts/applicant-services/reference-inventory.json` records all 241 source field declarations across the eight templates (repeatable rows expand to additional controls). `action-coverage.json` records ported and manually implemented actions. Old hash links retain award/application IDs. The Industrial Unit missing-bank redirect now opens the dedicated Add Bank page.

The award list preserves the original branch ordering for Apply, View/Edit, View, Coming Soon and Application Closed, plus the Not applied / Incomplete / Submitted / Winner labels. The backend handles pagination/search through the original DataTables query parameters. The award forms retain repeatable partners, products, plant/machinery, pollution control, tax repayment and other information; fixed asset/employment totals; three-year tables; conditional descriptions and uploads; draft, save, document submission, back, print and download actions.

## Reference defects and adaptations

- The supplied `CommonController.js` has `loadBanks`, but does not implement the bank templates' add/list/edit callbacks. These use the existing Java `CommonController` / `CommonServiceImpl` contracts: `fetchBanksMap`, `fetchBankDetails`, multipart `saveBankDetails`, and JSON `updateBank`.
- The list template comments out its status and edit-action columns. Those remain hidden; its edit form and update/cancel implementation are retained.
- Bank validation originally refers to a nonexistent `bankForm` and `$index`. It now refers to the actual form/control. Submit also works from the keyboard. The advertised PDF/500KB requirement is enforced. Duplicate rejection is detected even though the Java service returns it in `successMessage`.
- Invalid whitespace in a legacy `@keyframes` declaration is normalized for production CSS compilation. Browser-inserted table bodies and dynamic file-field names are normalized without dropping fields.
- Date inputs use the original locally bundled jQuery datepicker and stylesheet with the original `lang: 'ch'`, date-only configuration and `dd/MM/yyyy` formatting. React owns the form state; the widget is destroyed when its field unmounts.
- MPIDC uses the original GET `/mpmsme/sws/initiate` handoff. External SSO completion needs the deployed backend and MPIDC service.

## Verification

Run `node scripts/check-applicant-services-reference.mjs`, `node scripts/check-applicant-services-browser.mjs`, and `npm.cmd run build`.

The browser test uses an isolated headless Chrome profile and controlled API responses; it never submits live applications. It covers bank validation, multipart submission, duplicate failure, populated/empty lists, award row actions/pagination, invalid application blocking, draft/edit, repeated rows, conditional required fields, numeric totals, view/print, conditional uploads, dynamic upload names, upload rejection/retry, and MPIDC handoff. Screenshots and a result record are saved under `artifacts/applicant-services`.

Live authenticated backend transactions and a side-by-side comparison with the running AngularJS application remain unverified. The source inventory proves field/action coverage, not pixel-identical rendering of every state.
