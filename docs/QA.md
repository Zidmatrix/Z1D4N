# Validation record

Validated locally on 2026-10-08. This record distinguishes the working local site from remote publication.

## Passed

- Locked dependency installation with npm; Node.js 24.19.0, npm 11.9.0. The setup was also refreshed with `npm ci` without changing the lockfile.
- Content validation: 2 actual projects, 4 capability areas, 3 owner-reported professional certifications, 3 training entries and 1 AI-assisted project note. Referenced portraits, optional downloads and Markdown paths are checked at build time.
- TypeScript type checking and Vite 8.3.4 production build.
- Functional startup of the development server: a browser selected the Systems node and received its expected explanation.
- Complete browser suite before the CV addition on the `/Z1D4N/` production path: **37 passed, 2 skipped, 0 failed** in 40.7 seconds, using Chromium 151.0.7922.173. The skipped instances are the phone-menu test in the desktop and reduced-motion projects; the actual mobile-menu test passed.
- Desktop, phone and reduced-motion contexts; additional layout checks at 320, 390, 768, 1024 and 1440 pixels with no horizontal overflow and the correct navigation-toggle visibility.
- Actual image and self-hosted font loading, with no observed page errors or failed asset responses during the loading test.
- Project filters, network-node keyboard activation, data-driven capability links, archive and training disclosures.
- Archive search by title, category and tool, matching counts, empty results, clearing the search and real repository source destinations.
- Markdown modal focus containment, Escape handling, focus restoration and an actual Markdown download whose saved contents were checked.
- Direct report and journal hash URLs, including a page refresh and browser Back/Forward reader restoration.
- Real email, phone and GitHub destinations. Copy email either completes or shows its explicit fallback; no fake CV link is rendered.
- OS reduced motion and a persistent manual motion preference.
- axe WCAG 2 A/AA and WCAG 2.1 AA scans of the page, open dialog and expanded archive produced no reported violations in the tested contexts.
- Visual inspection of desktop, phone, project-section and expanded-archive screenshots. Earlier navigation visibility and dialog lifecycle/focus defects were corrected before the final passing run.

After adding the framed CV, the production entry script is approximately 394 kB uncompressed / 122 kB gzip and the CSS about 39 kB / 9 kB gzip. PDF.js adds a separate 430 kB / 129 kB gzip renderer chunk and a 1.26 MB uncompressed worker, fetched only near the CV section. Both font files total about 71 kB and the portrait about 32 kB. These are build measurements, not a Lighthouse score. There is no WebGL dependency or third-party runtime font/PDF-viewer request.

## Screenshots

These show the **local production build**, not a deployed website:

- [Desktop](screenshots/desktop.png)
- [Phone](screenshots/mobile.png)
- [Project section](screenshots/work.png)
- [Desktop archive](screenshots/archive-desktop.png)
- [Phone archive](screenshots/archive-mobile.png)
- [Framed CV on desktop](screenshots/cv-desktop.png)
- [Framed CV on phone](screenshots/cv-mobile.png)

## Owner-supplied CV update — 2026-10-08

- The original PDF was opened and visually inspected, then copied unchanged to `public/downloads/`. Its checksum matches the upload and the built output; provenance is recorded in `SOURCES.md`.
- `npm run build` passed content validation, TypeScript and the production build after the CV/content update.
- `npm test -- --grep 'contact URLs'`: **3 passed, 0 failed** in 6.4 seconds, covering desktop, mobile and reduced-motion contexts. Each test activated the real download link, checked the original filename and PDF signature, and compared the downloaded bytes by SHA-256 with the repository PDF.
- This was focused validation of the update, not another run of the complete 37-check suite. Publication remains deferred.

## Framed CV update — 2026-10-08

- The original PDF renders inside the website with a responsive border/frame, selectable text, zoom/fit controls and real open/download links. The owner-supplied file remains unchanged.
- `npm test -- --grep 'CV renders|contact URLs|layout fits'`: **9 passed, 0 failed** in 12.1 seconds, across desktop, mobile and reduced-motion contexts. The rendering test checks actual painted pixels and PDF text, zoom sizing and reset, document-scoped scrolling, no body overflow and no reported axe violations or page errors.
- The contact tests still compare each downloaded PDF against the original by SHA-256. Layout checks cover 320, 390, 768, 1024 and 1440 pixels.
- Browser probes confirmed no PDF resource requests at the top of the page, followed by successful self-hosted rendering at `#cv`. Rapid zoom changes and fit completed without a rendering fallback. Desktop/phone screenshots were visually reviewed.
- Locked dependency installation, content validation, TypeScript and the production build passed with the PDF viewer. These are local production checks; no new live-publication claim is made.

## GitHub source and publication history

- Existing platform Git authentication successfully read `Zidmatrix/Z1D4N`.
- GitHub API confirmed that the connected account is `Zidmatrix`. The owner subsequently changed `Z1D4N` to public, which was independently confirmed.
- The owner replaced the new-repository destination with the existing `Zidmatrix/Z1D4N`. The original commit is preserved and the portfolio source was migrated into that checkout.
- Pages creation/settings updates and the initial visibility update were rejected with **Resource not accessible by integration** (HTTP 403). The owner enabled Pages through GitHub, but the last observed source was **Deploy from a branch**, not **GitHub Actions**. The last settings read reported `build_type: legacy` and no custom domain.
- The GitHub Pages workflow was checked against current official documentation and action tags. The build has `contents: read` and `pages: read`; deployment has `pages: write` and `id-token: write`. Configure-pages enablement requires a separate appropriately authorized token, so that option is not used to bypass the missing administration permission.
- The initial pushed implementation passed installation, production build and 31 browser checks in remote runs [37792572070](https://github.com/Zidmatrix/Z1D4N/actions/runs/37792572070) and [37793109364](https://github.com/Zidmatrix/Z1D4N/actions/runs/37793109364). They failed at Configure Pages before the owner enabled Pages. These are historical runs, not validation of the latest 37-check revision.
- A later run passed Configure Pages and uploaded the artifact, then reported a deployment collision with the branch-based Pages job. The owner's CNAME creation/deletion commits were preserved.
- The last actual URL request returned HTTP 200 but contained the unbuilt `/src/main.tsx` entry instead of production assets. A separate live-browser attempt failed at certificate validation; that check was not bypassed. No working live Vite site is claimed.
- Other inspected repositories were left unchanged.

## Publication deferred by the owner

On 2026-10-08 the owner approved the design/colors and asked to focus on building and testing, leaving publication for the final phase. Local implementation acceptance is recorded in [ACCEPTANCE.md](ACCEPTANCE.md). No further design approval is pending.

In the publication phase, recheck the actual Pages source and current Actions runs, use the existing Actions workflow, resolve any remaining settings/deployment issue, and test the actual production site with `PORTFOLIO_TEST_URL=https://zidmatrix.github.io/Z1D4N/ npm run test:live`. Preserve certificate validation. A successful local build, HTTP 200 or branch-based Jekyll job alone does not complete that phase.

Safari/iOS, Firefox, screen-reader review and real mail-client delivery were not tested. Automated accessibility checks do not replace manual assistive-technology testing. Existing CCNA app runtime behavior, exam issuer verification, the factual claims within the owner-supplied CV and unseen course-certificate image were not validated by these portfolio tests.
