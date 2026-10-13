DTIC account pages
==================

The DTIC user dropdown now links to Update Profile and Change Password under
`/department/dtic`. The old `updateprofile` and `changepassword` paths and hash
bookmarks remain supported. Root `/profile` and `/change-password` aliases wait
for session loading and select the DTIC destination for that role.

Reference files in the sibling AngularJS application:

- `pages/dtic/dtichome.html` and `angular/dtic/routing.js`: dropdown and routes.
- `pages/section/updateprofile.html`: department profile, 36 field occurrences,
  including conditional role/group, designation, office address, present address,
  permanent address, and same-address checkbox.
- `pages/section/changepassword.html`: four password/OTP fields, visibility
  controls, password standards, strength meter, Generate OTP and Submit buttons.
- `angular/common/CommonController.js`: profile loading and multipart update,
  gender/designation/state/district/tehsil lookups, same-address copy/clear,
  password strength, OTP generation/update, expiry and success workflows.
- `css/bootstrap.min.css` and `css/sb-admin-2.css`: form grid, panels, controls,
  typography, buttons and address section headings.

The templates are compiled to static React view metadata using the repository's
existing IndustrialView renderer. No Angular runtime or runtime expression
evaluation is introduced. Regenerate with `python scripts/compile-department-profile.py`.
English and Hindi labels are taken from the legacy translation bundles. Styles
are scoped to the department forms.

All account requests use the shared DTIC client and the `/mpmsme/dtic/` prefix,
matching the Java CommonController's class-level `/dtic/*` mapping. The profile
posts multipart data to `updateDepartmentUser`; passwords use
`dochangepasswordgenerateotp` followed by `dochangepassword`. Backend errors retain
the form for correction. Success requires an explicit server success message.
No profile data is fabricated when loading fails. OTP generation remains a
separate request; it cannot accidentally trigger the password update in the
same button click. OTP becomes required once generated. The invalid legacy CSS
selector `.point:last` is corrected to `.point:last-child`.

Verification
------------

- Production build passed (existing legacy font/watermark and bundle-size warnings).
- `node scripts/check-dtic-profile-model.mjs` passed: edit/update guards,
  multipart contract, address copying/clearing and cascades, update failures,
  password rules/strength, OTP errors/retry, expiry, visibility, legacy links.
  An Axios-adapter regression check also verifies the actual DTIC URLs, query
  parameters, multipart profile payload and JSON password payload. Browser
  fixtures reject unscoped account requests instead of accepting any prefix.
- Account-specific CSS overrides the portal-wide heading rules, removes the
  empty heading spacer, and gives forms compact headers, consistent controls,
  responsive spacing, and a single error banner with retry for profile loads.
- `python scripts/audit-industrial-reference.py` compared 17 inventoried
  Industrial Unit templates containing 544 field occurrences against the source.
  No missing field bindings or referenced actions were found in that inventory.
  Source fingerprints, controller endpoints, field counts, options, tables,
  modals, conditional counts and actions are recorded in
  `artifacts/dtic-profile/industrial-reference-audit.json`.
- Browser check is provided in `scripts/check-dtic-profile-browser.mjs` with
  controlled fixtures and no live writes. Its sandboxed run timed out before
  page inspection; permission for an unsandboxed run was declined. Screenshots,
  visual parity and live backend behavior have therefore not been verified.

Static inventory coverage does not establish that every branch of the wider
Industrial Unit workflow is correct. This change adds the two DTIC account
pages and records the existing Industrial Unit coverage without claiming an
exhaustive end-to-end certification of that module.
