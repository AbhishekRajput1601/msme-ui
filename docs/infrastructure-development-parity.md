# Infrastructure development reference audit

Reference root: `mpindustry-web/src/main/webapp` in the adjacent AngularJS project. Backend files were inspected read-only.

| Reference | React coverage |
| --- | --- |
| `pages/applicant/fa/infraDevelopmetForm.html` | Applicant application form compiled from the original markup; ten PDF controls, original labels, alternating row colors, required markers, Save and Cancel |
| `angular/applicant/fa/controller.js`, `saveInfrastructure`, `resetForm` | Five mandatory files checked in original order (1, 2, 3, 4, 9), all ten 5 MB limits and original alerts; create application then multipart upload; application-number alert and Save lock |
| `pages/fa/infradevelopmetList.html` | Five original columns; server pagination, page-size choices, search, processing state and View/Print action |
| `pages/fa/viewfaInfrastructure.html` | Original markup, translated headings, application number, authorized person, district, all ten conditional downloads, print image and Back |
| `angular/fa/FAController.js` | Detail fetch by ID; department endpoint namespace preserved |
| `angular/fa/FARouting.js`, applicant routing and home menus | Applicant form and officer list navigation; both hash-prefix variants and detail IDs preserved |
| Java `FAController` request mappings | List/detail/download requests use `/fa/`; create/upload requests use `/applicant/`; no backend edits |

The commented infrastructure-ID dropdown and Edit button are inactive in the reference and remain inactive. The permission form has no active text fields, dropdowns, or custom modals. It uses browser alert dialogs. File selection accepts `.pdf`; submission follows the original size checks rather than adding new MIME validation.

The separate Infrastructure Development **expense compensation** assistance remains in the existing Industrial Unit scheme forms and read-only scheme views. It is not the permission application. The existing generated Industrial Unit inventory records the profile, unit, scheme, document, history, disbursement and acceptance templates and their bindings.

Cancel clears both native file controls and their React bindings, preventing stale files from being submitted. It preserves the post-success Save lock. HTTP failures are surfaced in the existing error area instead of being silently swallowed as in the AngularJS controller.

Validation: `node scripts/check-infrastructure-model.mjs`; `node scripts/check-industrial-browser.mjs`; `npm.cmd run build`; `npm.cmd run lint`. Browser checks use controlled responses, exercise applicant and FA roles, and never submit live applications. Screenshots are under `artifacts/industrial-unit/infrastructure-*.png`. Live backend persistence and a pixel comparison against a running legacy application are not covered by these checks.
