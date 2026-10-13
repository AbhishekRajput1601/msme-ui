# DTIC sidebar — first migration step

Reference: `mpindustry-web/src/main/webapp/pages/dtic/dtichome.html`, `css/sb-admin-2.css`, `js/plugins/metisMenu/metisMenu.min.js`, and `src/main/resources/application_{en_US,hi_IN}.properties` in the adjacent legacy project.

The DTIC role now receives its own navigation: 16 top-level entries and 41 destinations, in source order. This includes GIS, PowerBi, Self Employment, Financial Assistance, MSME, Infrastructure Development, Budget Planning, Coordination, Audit, CMCS, Enrolment, Supplier/Facility Master, OX Forms, Legacy data, and Land Reports. Commented-out legacy entries remain excluded. The malformed PowerBi list item in the source is represented as a normal list item.

`src/modules/dtic/dticMenu.json` preserves the legacy hashes and message keys. English labels use the message bundle values, which can differ from template fallback text. Hindi values have their repeated Windows-1252/UTF-8 encoding damage reversed. Literal labels remain literal in both languages, as in the source.

The recursive menu retains both nested report menus, Font Awesome icons, submenu bullets, the source font/colors/spacing, and MetisMenu's one-open-sibling behavior. It uses the existing portal's responsive sidebar and hide/show control. Other department roles retain their current navigation.

Only Dashboard points to React. The remaining internal links load `/mpmsme/dtic/home#<original hash>` through the existing backend proxy; GIS links retain their original URLs and new-tab behavior. These are deliberately legacy destinations, not completed React migrations. In particular, Industrial Unit points to the DTIC legacy workflow, not the applicant Industrial Unit component.

Verification: source comparison confirms all 41 active link destinations and their order. Run `node scripts/check-dtic-sidebar.mjs` against the local Vite server for fixture-based checks of role isolation, menu hierarchy, accordion behavior, destinations, Hindi labels, sidebar collapse, and mobile layout. This check does not execute backend transactions or certify visual parity against a running legacy session.

The broader DTIC page migration and the field/controller/service audit for its Industrial Unit workflow remain outstanding.
