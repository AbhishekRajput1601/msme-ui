# DTIC Infrastructure Development

The eight sidebar destinations now use React routes, including their detail,
edit, upload, signing, notice, appeal, and payment-history destinations.
The migration inventory contains 43 routes, 39 source templates and 245 field
occurrences. The source is the adjacent `mpindustry-web` AngularJS application:
`angular/dtic/routing.js`, `angular/dtic/controller.js` (DTICIDController),
`angular/dtic/customdirective.js`, page styles and DTIC Java endpoint mappings.

`scripts/compile-dtic-infrastructure.py` generates static template bindings and
controller actions into `src/modules/dtic/infrastructure/generated`. AngularJS
is not loaded and no source scripts are evaluated in the browser. Regeneration
requires the legacy checkout and Python BeautifulSoup. The field/event inventory
and extracted source references are in `artifacts/dtic-infrastructure`.

React adapters preserve dependent dropdown requests, multipart field names,
rate calculations, old-rate restrictions, dates, upload limits, applicant
selection, modal state, map coordinates, print/download actions and signing
requests. Server-selected LOI/allotment/acquisition variants remain selected by
the backend. Three server-only details/receipt pages are converted to inert React
elements; embedded scripts and event-handler strings are not executed.

Presentation retains the reference field order, Bootstrap column structure,
Helvetica typography, blue tables, pale-blue section headings and original button
labels. Scoped spacing, focus states, table scrolling and mobile form columns
improve usability. Native date controls replace the old jQuery date widgets.
Malformed legacy markup, missing parent model objects, the edit-form dropdown
race, missing-notice access and broken source links are repaired.

## Verification

- `node scripts/check-dtic-infrastructure-model.mjs`: source field inventories,
  bound actions, dropdowns, invalid-submit guards, multipart fields, ten rate
  bands, historical-rate restrictions, selection rules, date validation, file
  boundaries, notice actions and HTTP callback compatibility.
- `node scripts/check-dtic-infrastructure-browser.mjs`: fixture-backed routes,
  populated tables, signing controls, server-selected variants, required fields,
  mobile width, runtime errors and unintended writes. Set `UI_CHECK_URL` for the
  running Vite server. Screenshots are saved under the audit directory.
- `node scripts/check-dtic-msme-form.mjs`: shared-renderer MSME regression.
- `npm run build`: production compilation.

These checks do not certify live backend transactions, Aadhaar/DSC signing,
payment integration, external map tiles, or pixel-for-pixel parity. The legacy
KrutiDev010 font and letter watermark are absent from the supplied checkout;
their original backend asset paths remain in the letter styles and must be
served by the deployment for the corresponding letter appearance.
