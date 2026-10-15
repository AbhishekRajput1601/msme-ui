# DTIC MSME reports

The Service Enterprise, Manufacturing Enterprise, Micro Level, Small Level and Medium Level routes are compiled from the corresponding AngularJS templates in `mpindustry-web/src/main/webapp/pages/dtic`. Run `python scripts/compile-dtic-msme-reports.py` to regenerate their views, expressions, column definitions and source inventory.

The templates retain their fields, labels, translations, nested tables, acronyms, conditions and actions. The report adapter uses the original DTIC query and download endpoints. All three level reports use `validatemicrolevelreportform`, as in the original controller. Dates remain DD/MM/YYYY in queries and DD-MM-YYYY in download/list paths. The shared legacy calendar retains keyboard blocking and date selection. Backend validation errors are rendered as text.

Level reports preserve all 18 columns, including the nullable NIC code, classification and product-name columns. The React table supplies server paging, search, page length and empty/error states. New submissions reset pagination. Report styles restore the source heading colors and button sizes over application-wide overrides.

The main DTIC generator now retains `DTICMSMEController`, its Applications List, add/edit forms and detail route. Angular subtraction of a negative is compiled with separated operators to preserve numeric investment totals.

Verification:

- `node scripts/check-dtic-msme-reports.mjs`: required dates, query parameters, validation errors, five download URLs and all level columns.
- `node scripts/check-dtic-msme-form.mjs`: form initialization, activity rows and registration resets.
- `node scripts/check-dtic-msme-reports-browser.mjs`: seven routes, report results, pagination, repeat submission and download URL dispatch; fixture-backed authenticated browser, no live writes.
- `python scripts/audit-industrial-reference.py`: 17 Industrial Unit templates, 544 fields, no missing field bindings or referenced action names.
- `npm.cmd run build`: production compilation.

Browser screenshots and check results are in `artifacts/dtic-msme-reports/browser`. The Industrial Unit inventory is a static coverage check, not exhaustive behavior verification. Live backend responses, actual exported file contents and pixel-by-pixel comparison against a running AngularJS application have not been verified.
