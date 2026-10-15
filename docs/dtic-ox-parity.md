# OX Forms, Legacy data and Land Reports

The screenshot's seven menu destinations now open React pages. The linked Legacy
data Edit/Verify page is included, for eight pages in total:

| Route under `/department/dtic/` | Angular reference template |
| --- | --- |
| `ox1Form` | `dtic/ox1Form.html` |
| `ox2Form` | `dtic/ox2Form.html` |
| `ox3Form` | `dtic/ox3Form.html` |
| `ox4Form` | `dtic/ox4Form.html` |
| `legacyData` | `dtic/dticlegacyData.html` |
| `id/editViewLegacyData/:id` | `dtic/dticViewEditLegacyData.html` |
| `completeDataOfLandApplicant` | `dtic/completeDataOfLandApplicant.html` |
| `esignPaymentPendencyReport` | `dtic/EsignPaymentPendencyReport.html` |

The read-only reference is the adjacent
`MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp`
checkout. The implementation uses its DTIC routing, DTICController and
DTICIDController actions, Java endpoint mappings, page markup, inline styles,
common numeric restrictions, date-picker assets, and spreadsheet library.

`scripts/compile-dtic-ox.py` retains all 74 OX field declarations, options,
conditions, validation messages, headings, nested tables, export tables, and
event bindings. The original date picker retains its day/month/year format and
future-date restriction. Stock calculations, cylinder conversions and limits,
supplier/facility dependencies, opening-stock restrictions, row addition/removal,
date locks, confirmation text, and save endpoints use the ported source actions.
The source's inactive hour-window restriction remains inactive. OX-1 remains
saveable after success; OX-2 through OX-4 retain their post-save lock until reload.
Excel export retains the original `.xls` content and filename convention.

The infrastructure compiler now includes the additional four land templates
and their 48 field declarations. Legacy data preserves its eight filters,
35-column table, Edit/Verify branch, export endpoint, and editing fields.
Reports preserve month/year choices, original columns, request parameters,
and `.xlsx` exports. The existing portal supplies typography and navigation;
the OX source styles take precedence over conflicting Bootstrap 5 table paint.
The land records pages avoid the infrastructure module's customized headings.

React-specific repairs preserve nested row scope/index values and initialize
replacement rows after changing dates. Malformed children of HTML void elements
are moved after those elements so Save controls are rendered. Request adapters
prevent duplicate writes and expose failures. No Angular runtime or template
expression evaluation is loaded in the browser.

## Verification

- `node scripts/check-dtic-ox-model.mjs`: 74 source field bindings and every
  referenced OX action; calculations, stock limits, row changes, historical
  locks, invalid/duplicate submissions, save URLs, report parameters, all eight
  legacy filters, invalid legacy edits, and old hash compatibility.
- `node scripts/check-dtic-ox-browser.mjs`: all eight pages with controlled
  authenticated fixtures; nested rows, conditional validation, recalculation,
  save payload, date reload/locks, mobile scrolling, report results, and completed
  `.xls`/`.xlsx` downloads. Screenshots and results are in `artifacts/dtic-ox/browser`.
- `python scripts/audit-industrial-reference.py`: all 544 inventoried fields
  across 17 Industrial Unit templates, with no missing fields or referenced actions.
- `node scripts/check-industrial-browser.mjs`: passed the existing Industrial
  Unit browser regression workflow. The source markup still produces existing
  React DOM-nesting warnings.
- `node scripts/check-dtic-infrastructure-model.mjs`: passed, including the
  expanded 43-template inventory.
- Production build passed. Targeted lint had no errors; the existing mutable
  reference-renderer approach and generated expressions produce warnings.

The separate existing `check-dtic-msme-form.mjs` test fails because it expects
`dtic/viewmsmeform`, which is absent from both HEAD and the starting generated
bundle. This task does not add or change that unrelated template.

These checks use local fixtures and source inventories. They do not certify live
authenticated backend saves or pixel-identical rendering against a running
AngularJS session. The existing build warnings for missing KrutiDev fonts,
letter watermark, and bundle size remain outside these pages.
