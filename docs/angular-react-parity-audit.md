# Angular / legacy website to React parity audit

Audit date: 30 September 2026.

**Result: the migration is incomplete. React does not yet contain every legacy page, its content, or its workflows.** A shared theme, copied assets, a route mapping document, and redirects are not evidence that the underlying pages were implemented.

## Scope and evidence

Read the legacy source at `E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-web/src/main/webapp` and the React source in this workspace. The public website includes server-rendered Thymeleaf pages as well as AngularJS application pages.

- Found **874 non-commented Angular `.when()` route declarations in 28 routing files**, comprising 870 unique file/hash pairs. Shared routes and duplicate declarations mean this is not a count of unique screens.
- Inventoried **793 HTML/JSP files beneath legacy `pages/`**. These include templates and fragments, not necessarily 793 independent reachable pages.
- React has **99 explicit path declarations**, including **62 redirects**, one wildcard 404, and 36 routes rendering **13 distinct page components** (including UnauthorizedPage). Parent layout routes and index redirects are excluded from this count.
- Cross-checked the existing `route-mapping.md` against the routes actually registered in React. Its destinations describe intended mappings; they are not proof of implementation. Some implemented React pages use different URLs, so a missing documented destination does not alone prove that no related functionality exists.
- Loaded the actual `AppRoutes` through Vite and checked selected destinations using React Router's `createRoutesFromChildren` and `matchRoutes`. This confirmed the dashboard aliases and missing-route examples below.
- This was a source and route audit. It did **not** execute authenticated transactions or compare every field, document, database record, permission, translation, or responsive state in browsers. Content parity is **not certified** for any entire module.

## Findings that affect verification

| Priority | Finding | Source evidence |
|---|---|---|
| High | Sign-up reports success when the request fails. A green message does not establish that an account was created. | `src/modules/auth/SignUpPage.jsx:72` |
| High | Password recovery simulates OTP delivery, displays a demo OTP, and reports reset success on request failure. Username recovery also reports SMS delivery after failure. | `src/modules/auth/ForgotPasswordPage.jsx:48`, `:76`; `src/modules/auth/ForgotUsernamePage.jsx:61` |
| High | Login can return `authenticated: true` with an assumed role when the current-user response does not verify an authenticated session. This is a client-side behavior; it does not establish access to protected backend data. | `src/services/authService.js:110` |
| High | Land application lists, details, documents and vacant plots have demo fallbacks. Some lists substitute demo records even for a successful empty response. Visible records are therefore not proof of backend parity. | `src/modules/id/applicant/services/idApplicantService.js:138`, `:181`, `:198`, `:235` |
| High | “Proceed to Apply” links to application ID `1001` regardless of the selected parcel. It does not implement a new application for that parcel. | `src/modules/id/applicant/LandAllotmentPage.jsx:236` |
| High | Saving project details updates React state and displays success without making a persistence request in the save handler. | `src/modules/id/applicant/ApplicationDetailPage.jsx:65` |
| High | Many route names resolve to dashboards instead of their named forms, lists, or workflows. | `src/routes/AppRoutes.jsx` |
| High | The public content hook fetches `backendLink('/website/home')`, but that helper returns `/`. In the current Vite setup this fetches the SPA HTML, which has no legacy `.header-new-section`; the parser returns empty content. CMS menus, news, introduction, officers and other content cannot be assumed present. | `src/modules/public/legacyWebsite.js:6`, `:87`, `:124` |
| Medium | Admin and department counts are literal values, not fetched statistics. Department-specific dashboards share the same generic infrastructure cards. | `src/modules/admin/AdminDashboard.jsx`; `src/modules/department/DepartmentDashboard.jsx` |
| Medium | Several legacy hash translations lead to unregistered React routes. | `src/routes/roleRoutes.js`; `artifacts/migration-audit/legacy-redirect-checks.csv` |
| Medium | English/Hindi coverage is partial: the public navigation and several form/table labels remain English literals. Field-by-field translation comparison remains outstanding. | `src/layouts/PublicLayout.jsx`; `src/modules/id/applicant/ApplicationDetailForm.jsx`; `src/modules/applicant/ApplicantDashboard.jsx` |

## Public pages and content

The following covers all 13 HTML files directly inside legacy `pages/website/`. Additional nested templates are listed in the template CSV.

| Legacy template / feature | React status |
|---|---|
| `msmemain.html` / homepage | React shell exists. CMS content loading is affected by the helper issue above. Fallback content is not a full copy of the old homepage. |
| `login.html` | React login page exists; backend session, captcha, rejection and role behavior require validation. |
| `screenReader.html` | React page exists at `/website/screen-reader`. It is **not an exact content copy**: the previous page listed nine readers and different explanatory text; the new page has keyboard guidance and three official resources. English and Hindi rendering were checked during implementation. |
| `downloads.html` | No dedicated React page; current link targets the legacy backend through `/mpmsme`. |
| `orderCirculars.html` | No dedicated React page; current link targets the legacy backend. |
| `albums.html` | No dedicated React album listing; current gallery link targets the legacy backend. |
| `gallery.html` | No dedicated React gallery-detail page. A homepage thumbnail is not the gallery workflow. |
| `usefulLinks.html` | No dedicated React page; current link targets the legacy backend. |
| `whatsNew.html` | No dedicated React page; “Read More” targets the legacy backend. |
| `events.html` | No dedicated React page; “Read More” targets the legacy backend. |
| `search.html` | Search form submits to the legacy backend; no React results page. |
| `advanceSearch.html` | Link opens the legacy advanced-search entry; no React implementation. |
| `menuDisplay.html` | No React route for general CMS content pages. Rendering menu links does not render their destination pages. |

`/about` and `/guidelines` both render `HomePage`, not dedicated content pages. Registration and recovery have React components but are subject to the false-success findings above. Migrated public-page aliases also need direct URL and refresh verification; links normalized by a helper are not equivalent to registered legacy URL aliases.

## Authenticated areas

| Area | Present | Missing / incomplete |
|---|---|---|
| Applicant | Dashboard; land application list; plot exploration; application detail UI; document UI | Full land application creation/persistence; profile; industry profile; password-change forms; financial assistance; grievances; wider applicant schemes and workflow parity |
| Administration | Shared layout and static dashboard | Users/officers, masters, audit logs, reports, settings and other legacy administration workflows; several named routes render the same dashboard |
| Departments | Shared layout, role guards and generic static dashboard | Distinct scrutiny, inspections, approvals, application processing, MIS, payments, letters and other departmental workflows |
| Other modules | Role names and some endpoint constants / planned routes | Dedicated React feature implementations for most FA, MSME, self-employment, legal, MSEFC, textile, accounts, audit, budget, coordination and related modules |

The empty module endpoint objects in `src/api/endpoints.js:497` onward provide additional evidence that those API integrations have not been completed. Existing ID endpoint constants alone do not establish implemented screens.

## Confirmed route examples

| URL / navigation | Actual React result |
|---|---|
| `/applicant/financial-assistance` | Applicant dashboard |
| `/applicant/profile` | Applicant dashboard |
| `/applicant/change-password` | Applicant dashboard |
| `/admin/users` | Static admin dashboard |
| `/department/land-scrutiny` | Generic department dashboard |
| `/applicant/home#/id/landApplications` | Resolver returns `/applicant/land-applications`, which has no registered page |
| `/applicant/home#/id/vacantLands` | Resolver returns `/applicant/vacant-lands`, which has no registered page |
| `/applicant/home#/fa/newapplicantform` | Resolver returns `/applicant/financial-assistance/new`, which has no registered page |
| `/adminSection/home#/addOfficer` | Resolver returns `/admin/addOfficer`, which has no registered page |
| `/dtic/home#/changepassword` | Resolver returns `/department/dtic/change-password`, which has no registered page |

The hash checks evaluate the React resolver after a legacy entry reaches the SPA. Proxy interception can separately affect whether that entry reaches React. Public `/mpmsme/website/...` navigation still deliberately proxies to the backend except for the migrated screen-reader route. An available legacy page must not be counted as a migrated React page.

## Files for review

- [Angular route inventory](../artifacts/migration-audit/angular-routes.csv): source file, line, hash route, template expression, controller, documented React destination and whether that destination exists.
- [React route inventory](../artifacts/migration-audit/react-routes.csv): actual explicit paths and their rendered component/status.
- [Legacy template inventory](../artifacts/migration-audit/legacy-templates.csv): every discovered template; content comparison remains outstanding.
- [Actual legacy redirect samples](../artifacts/migration-audit/legacy-redirect-checks.csv).
- [Route verification evidence](../artifacts/migration-audit/route-verification.txt).
- [Machine-readable counts](../artifacts/migration-audit/summary.json).

Regenerate the inventories with `node scripts/audit-migration.mjs`. Optionally pass another legacy webapp directory as the first argument. The script reads source and writes audit artifacts only; it does not modify application code or contact the backend. The selected route-verification text was produced separately against the actual JSX route tree.

## Verification order

1. Remove misleading demo/success behavior from production flows and verify backend failures are shown as failures.
2. Repair public CMS loading and migrate the missing public content pages.
3. Finish one applicant workflow end to end: create, save, reload, submit, upload, download and status changes against test data.
4. Implement the role-specific forms and lists currently represented by dashboards or missing routes.
5. For each route, compare legacy and React fields, labels, English/Hindi content, validation, role access, search/sort/pagination, uploads/downloads, and persisted data. Check direct URLs, browser refresh/back, keyboard access and mobile layouts.
6. Mark a page complete only after those checks pass. Keep “not tested” separate from “missing” and “implemented”.

No application behavior was changed during this audit.

## Module inventory counts

These counts cross-check the planned destinations in `route-mapping.md`. A matching dashboard is not a completed workflow, and an implemented page at a different URL may still exist. **Do not interpret these as migration percentages.**

| Angular source module | Declarations | Documented destination exists | Documented destination missing |
|---|---:|---:|---:|
| account | 12 | 1 | 11 |
| admuser | 49 | 1 | 48 |
| applicant | 129 | 4 | 125 |
| audit | 44 | 1 | 43 |
| bank | 17 | 1 | 16 |
| budgetPlanning | 38 | 1 | 37 |
| cmcs | 10 | 1 | 9 |
| collector | 8 | 1 | 7 |
| common | 5 | 0 | 5 |
| coordination | 40 | 1 | 39 |
| dtfc | 21 | 1 | 20 |
| dtic | 179 | 1 | 178 |
| fa | 37 | 1 | 36 |
| grievanceApplicant | 9 | 0 | 9 |
| icOffice | 38 | 1 | 37 |
| id | 35 | 1 | 34 |
| ldm | 6 | 1 | 5 |
| legal | 32 | 2 | 30 |
| mbfc | 16 | 1 | 15 |
| msefc | 17 | 1 | 16 |
| msme | 23 | 1 | 22 |
| secretary | 6 | 1 | 5 |
| selfemployment | 15 | 0 | 15 |
| startupCenter | 11 | 1 | 10 |
| textile | 16 | 1 | 15 |
| zonaloffice | 53 | 1 | 52 |
| zonaloperator | 8 | 1 | 7 |
| Total | 874 | 28 | 846 |
