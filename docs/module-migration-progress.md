# Module-by-module migration

Current module: **Land Allotment — applicant**.

Status: **In progress. Do not start another module without the user's approval after this module is finished.**

## Implemented in this change

- Developed-plot selection opens the instructions for the selected opaque plot token.
- Instructions are rendered as React content; legacy scripts are not executed.
- The existing backend form entry performs ownership/reservation checks before React loads the draft. The raw land ID comes from the authorized page, not a guessed client ID.
- Applicant draft form uses the actual IDApplicantBean fields: registered profile, nominee, manufactured items, employment, investment, finance, venture, utilities, prior allotment and land/construction rows. Registered profile fields remain read-only.
- Monetary investment/finance totals use rupees; the construction cost fields retain the legacy lakhs unit. The existing venture classification thresholds are preserved from source, not independently certified as current policy.
- Create/update requests call `/applicant/id/addIdApplicantDetail` and `/applicant/id/updateIdApplicantDetail`. Saves require explicit backend success; wrong captcha, validation errors and malformed responses do not advance the workflow.
- Document bundles use actual multipart names (`doc2`, `doc3`, `doc9`, `profileImage`, etc.), server-rendered declarations, create/update endpoints, PDF/JPEG checks and file size limits. Saving documents is not presented as final submission.
- Payment review displays the backend amounts and retains hidden fields. User confirmation posts to the existing backend treasury handoff. No live payments were initiated.
- Application progress has a dedicated history page rather than reusing application detail.
- Application detail displays the actual form model. Document download URLs use the applicant controller prefix and `documentTypeShort`.
- Selected old applicant hashes resolve to the corresponding new React pages while preserving application IDs and parcel tokens.
- Undeveloped-land applications now fetch the separate land information response, validate requested area against available area, obtain backend rates, apply the legacy area-based application fee and plant/machinery eligibility check, and require a fresh quote when area changes. Distinct document endpoints, additional mandatory reports, optional establishment proof and 10 MB document limits are connected.
- Query replies use the existing query JSON and document multipart endpoints. A document failure can be retried without submitting the reply again while the page remains open. Query-stage corrections use the separate application/document edit endpoints.
- Annual payment list, entry, calculated period totals, history, details, review, retry links and receipt links are implemented. Annual and appeal reviews preserve server hidden fields and require an explicit user action before treasury handoff.
- Treasury receipt/status rendering, enquiry handoff and application payment-retry routes are implemented without executing legacy scripts.
- Notices, ZO/IC appeal creation and details, hearings, compliance and conditional decisions now have React routes. Available list actions follow the legacy status/deadline conditions. IC appeal saves use the numeric ID actually returned by the backend.
- Application signing now has a React review page, Aadhaar gateway handoff, and DSC PDF/sign/store sequence using the existing endpoints. The full legacy document is compiled to static JSX (155 audited bindings), with no Angular runtime or dynamic expression evaluation. Invalid legacy table nesting is normalized without dropping text or rows. Application-list signing/download actions use the actual signed-document ID.

## Validation

- `node scripts/check-land-model.mjs`: passed; decimal totals, rejected save responses, invalid employment, booking restrictions and hash mappings.
- `node scripts/check-land-services.mjs`: passed; create/update paths, payload preservation, actual multipart fields, backend business errors and download paths using an Axios adapter.
- `node scripts/check-land-browser.mjs`: passed with an isolated headless Chrome profile and controlled responses. Tests cover selection, instructions, reservation rejection, failed/successful saves, document failures/success, payment review, draft update and history bookmarks.
- Browser evidence: `artifacts/land-allotment/checks.json`. These fixtures do not demonstrate real database persistence.
- `npm.cmd run build`: passed after the final application edits.
- `npm.cmd run lint`: exit code 0, warnings remain (including state reset effects in the new asynchronous pages); no lint errors.
- Expanded model/API tests cover undeveloped fee boundaries and invalid quotes, document requirements, query uploads, annual totals and invalid save responses, notice/appeal multipart fields, and query correction endpoints.
- Expanded browser fixtures cover undeveloped application entry/document requirements, query partial-upload retry, annual entry/review, receipt sanitization, notice compliance and IC appeal navigation. These are controlled fixtures, not live backend acceptance tests.
- The production build now reports a JavaScript chunk-size warning; route splitting remains a performance follow-up.
- Signing API tests cover escaped document data, incomplete/invalid gateway responses, already-signed applications, DSC transaction preservation, and rejection of empty signed PDFs. The browser signing check verifies document rendering, explicit consent, invalid Aadhaar input, server rejection and gateway preparation without navigating to a real provider.
- `node scripts/check-land-live.mjs`: passed against the running backend on 2026-10-01. The login page is reachable and anonymous session/application/document requests redirect to login. Evidence is in `artifacts/land-allotment/live-checks.json`; this is not authenticated workflow verification.

## Live verification blocker

The user confirmed that the local backend uses a test database and authorized test application/document verification. Initially port 8080 refused connections. An attempt to start the existing `mpindustry-web/target/mpmsme.war` failed with MySQL `CJCommunicationsException` / connection timeout. The process exited; backend source was not changed.

Update, 2026-10-01: the user started the backend. `/website/login` responds successfully and anonymous protected requests redirect to login. Authenticated verification now requires a test applicant account. The user was asked to provide it through `.env.land-test.local` using `LAND_TEST_USERNAME` and `LAND_TEST_PASSWORD` (the file is ignored by `*.local`). No credentials were provided at the latest check. No real application, file upload, payment or signature was submitted during this change.

## Remaining within Land Allotment

This is **not** a completed module or parity certification. Outstanding work includes:

- Live verification of undeveloped-land rates, eligibility and distinct document persistence, including comparison against actual test-database responses.
- Actual Aadhaar/DSC completion, generated-PDF visual/content comparison, translated labels, callback handling and final submission verification. The application signing UI and API adapters are implemented, but no real signature has been performed. The legacy DSC flow depends on the local signer at port 8060.
- End-to-end treasury callbacks, reconciliation, retries and duplicate-payment protection against the actual backend.
- LOC, possession and other post-allotment steps.
- Live query, notice, appeal, hearing and compliance authorization/state-transition verification; query corrections need full browser coverage with actual server data.
- Full legacy field/validation comparison, Hindi labels, direct URL/refresh/back behavior and live role/ownership tests for all remaining routes.
- Department/officer land-processing workflows; these are not implemented by adding applicant pages.

The metadata extraction script reads the legacy developed-land form using Python/BeautifulSoup and writes only React field metadata. Regenerate with:

```powershell
python scripts/extract-land-form.py 'E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp'
```

The earlier `angular-react-parity-audit.md` remains historical and contains findings superseded by later changes. Use this tracker and current code for the work described here.
