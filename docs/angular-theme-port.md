# Angular frontend design port

The React frontend reuses the original local webapp's assets and CSS. No backend,
Java, server configuration, existing API services, or authentication contracts were
modified.

## Sources

- Public page structure: `pages/website/msmemain.html` and `pages/website/login.html`.
- Public theme: `pages/website/msme_new/app_assets/assets_css/bootstrap.min.css`,
  `main_css.css`, `modern-ticker.css`, and `theme1.css`.
- Fonts: the original local Poppins files and Font Awesome.
- Signed-in layout: `pages/applicant/applicanthome.html`, `css/bootstrap.min.css`,
  and `css/sb-admin-2.css`.
- Applicant dashboard: `pages/applicant/dashboard.html` (heading-only layout).
- Department dashboard panel structure: `pages/dtic/dashboard.html`.

`public/legacy` contains original assets, with SHA-256 hashes in
`asset-manifest.json`. The styles in `src/styles/legacy-public.css` and
`legacy-portal.css` are generated copies with scoped selectors and rewritten asset
URLs. React-specific layout adjustments are in `legacy-adaptations.css`.

To reimport from another checkout:

```powershell
node scripts/import-legacy-theme.mjs 'E:\path\to\mpindustry-web\src\main\webapp'
```

The importer only reads the original webapp. Three decorative images referenced
by the original CSS are absent from that source: `arabesque.png`,
`colorbox_bg.png`, and `preloader.gif`. Their generated CSS uses `none`, retaining
the original background colours. Missing paths are recorded in
`public/legacy/missing-source-assets.json`.

## Dynamic content and remaining limits

The original public homepage obtains its menus, banners, officer portraits,
introduction, news and footer links from Thymeleaf/CMS data. The frontend reads
the existing `/mpmsme/website/home` response and extracts that public content;
it does not execute the page's scripts or inject raw HTML. When the backend is
unavailable, local banners/logos are shown and unavailable news/introduction
uses the original `Content awaited.` message. These fallbacks cannot reproduce
CMS content that is absent from the source files. CMS rich text is rendered using
allowlisted React elements and text styles; scripts, event handlers and embedded
frames are excluded. Menu nesting is preserved using keyboard-accessible dropdowns.

Login, CAPTCHA, signup, password recovery and unmigrated public links still
depend on the existing backend. Current React routes and land-allotment service
behaviour are retained. Existing department/admin placeholder counts and service
fallback data were not converted into new backend integrations. The applicant's
invented summary cards were removed to match the original heading-only dashboard.
This is a visual port of the implemented React pages, not a migration of every
Angular workflow.

## Verification

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run dev -- --host 127.0.0.1
node scripts/check-legacy-ui.mjs
```

The browser check uses installed Chrome with a separate headless profile and
intercepts backend requests with fixtures; it never submits credentials or writes
to backend endpoints. It checks desktop/mobile overflow, original colours/fonts,
local images, public menu visibility, carousel controls, login tabs, sidebar
collapse, role-specific navigation and CMS extraction. Screenshots are written to
`artifacts/ui-check`. Backend login and CMS parity against a live Angular page
require the running original backend and were not verified by this fixture check.

Use `UI_CHECK_BROWSER` to select another Chromium executable and `UI_CHECK_URL`
to select another Vite development server. The browser profile is stored under
`node_modules/.cache` and screenshots are excluded from Vite's file watcher.
