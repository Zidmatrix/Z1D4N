# Validation record

Validated locally on 2026-10-08. This record distinguishes the working local site from remote publication.

## Passed

- Locked dependency installation with npm; Node.js 24.19.0, npm 11.9.0. The setup was also refreshed with `npm ci` without changing the lockfile.
- Content validation: 2 actual projects, 4 capability areas, 3 owner-reported professional certifications, 3 training entries and 1 AI-assisted project note. Referenced portraits, optional downloads and Markdown paths are checked at build time.
- TypeScript type checking and Vite 8.3.4 production build.
- Functional startup of the development server: a browser selected the Systems node and received its expected explanation.
- Complete browser suite rerun on the `/Z1D4N/` production path: **31 passed, 2 skipped, 0 failed** in 34.3 seconds, using Chromium 151.0.7922.173. The skipped instances are the phone-menu test in the desktop and reduced-motion projects; the actual mobile-menu test passed.
- Desktop, phone and reduced-motion contexts; additional layout checks at 320, 390, 768, 1024 and 1440 pixels with no horizontal overflow and the correct navigation-toggle visibility.
- Actual image and self-hosted font loading, with no observed page errors or failed asset responses during the loading test.
- Project filters, network-node keyboard activation, correct capability links, archive and training disclosures.
- Markdown modal focus containment, Escape handling, focus restoration and an actual Markdown download.
- Direct report and journal hash URLs, including a page refresh.
- Real email, phone and GitHub destinations. Copy email either completes or shows its explicit fallback; no fake CV link is rendered.
- OS reduced motion and a persistent manual motion preference.
- axe WCAG 2 A/AA and WCAG 2.1 AA scans of the page and open dialog produced no reported violations in the tested contexts.
- Visual inspection of desktop, phone and project-section screenshots. Earlier navigation visibility and dialog lifecycle/focus defects were corrected before the final passing run.

The production entry script is approximately 386 kB uncompressed / 120 kB gzip, the CSS about 34 kB / 8 kB gzip, both font files about 71 kB combined, and the portrait about 32 kB. These are build measurements, not a Lighthouse score. There is no WebGL dependency or third-party runtime font request.

## Screenshots

These show the **local production build**, not a deployed website:

- [Desktop](screenshots/desktop.png)
- [Phone](screenshots/mobile.png)
- [Project section](screenshots/work.png)

## GitHub outcomes

- Existing platform Git authentication successfully read `Zidmatrix/Z1D4N`.
- After required domains became reachable, GitHub API confirmed that the connected account is `Zidmatrix`; its repository list contains the five public repositories reviewed and the private `Z1D4N` repository.
- The owner replaced the new-repository destination with the existing `Zidmatrix/Z1D4N`. The original commit is preserved and the portfolio source was migrated into that checkout.
- Pages read/create requests and the repository visibility update were rejected with **Resource not accessible by integration** (HTTP 403). The repository remains private and `has_pages` remains false according to the repository API.
- The GitHub Pages workflow was checked against current official documentation and action tags. The build has `contents: read` and `pages: read`; deployment has `pages: write` and `id-token: write`. Configure-pages enablement requires a separate appropriately authorized token, so that option is not used to bypass the missing administration permission.
- Remote push and workflow outcomes are recorded after execution below. A local build does not establish successful deployment.
- Other inspected repositories were left unchanged.

## Unverified / awaiting outside action

1. In the existing Z1D4N repository, use public visibility for free Pages and select **Settings → Pages → Source → GitHub Actions**. The integration could not apply either setting.
2. Trigger the existing Pages workflow on `main`; inspect both the build and deployment jobs.
3. After successful deployment, run `PORTFOLIO_TEST_URL=https://zidmatrix.github.io/Z1D4N/ npm run test:live` and inspect the deployed assets and links.

Safari/iOS, Firefox, screen-reader review and real mail-client delivery were not tested. Automated accessibility checks do not replace manual assistive-technology testing. Existing CCNA app runtime behavior, exam issuer verification, the missing technical CV and unseen course-certificate image were not validated by these portfolio tests.
