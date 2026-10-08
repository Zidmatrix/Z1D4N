# Z!DVN — Abdulrahman Zidan

A technical portfolio focused on cybersecurity, with networking, Linux/Windows, programming and university work in context. React, TypeScript and Vite produce a static site for GitHub Pages. There is no backend, database, subscription or paid service.

The repository is [Zidmatrix/Z1D4N](https://github.com/Zidmatrix/Z1D4N). The intended Pages address is `https://zidmatrix.github.io/Z1D4N/`. Check [the project log](docs/PROJECT_LOG.md) for actual publication status; the site address is a target until a deployment has been verified. The original README-only repository history is preserved.

## Run locally

Use Node.js 24 (see `.nvmrc`), or a supported version at least 22.12.

```sh
npm ci
npm run dev
```

Vite prints the local development address. The application path is `/Z1D4N/`.

```sh
npm run build
npm run preview
```

The production output is `dist/`. Internal navigation uses hashes, such as `#work` and `#report/ccna-roadmap`, so opening a direct link or refreshing it does not require a server fallback. All fonts and the portrait are bundled locally. The Vite `base` matches the repository name; change it and the canonical/SEO files together if the repository ever moves.

## Checks

```sh
npm run validate:content
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

The cloud machine already has system Chromium; the test configuration detects it. Elsewhere, install Playwright Chromium with the command above. On a Linux CI machine, `npx playwright install --with-deps chromium` also installs the required browser libraries. See [QA](docs/QA.md) for executed outcomes, limitations and the browser tests.

To test the real Pages deployment after a successful Actions run:

```sh
PORTFOLIO_TEST_URL=https://zidmatrix.github.io/Z1D4N/ npm run test:live
```

## Edit content without changing the design

| File | Purpose |
| --- | --- |
| `src/content/profile.json` | Name, introduction, contact details, education, portrait and optional CV |
| `src/content/capabilities.json` | Technical areas, learning context and evidence |
| `src/content/projects.json` | Project cards, archive, categories, tools and report references |
| `src/content/certifications.json` | Separate professional certifications and training |
| `src/content/experience.json` | Training, practical use and university context |
| `src/content/journal.json` | Learning journal index |
| `src/content/reports/*.md` | Full technical project reports |
| `src/content/journal/*.md` | Learning notes and weekly reviews |

### Add a project or technical report

1. Copy an object in `projects.json`. Choose a unique lowercase `id`; add real context, tools, evidence, your contribution and limitations. Set `featured: false` to put it in the archive without featuring it.
2. Write a report in `src/content/reports/<report-slug>.md`, using [the project template](docs/templates/PROJECT.md). Set the object's `report` to that filename without `.md`.
3. Use a genuine HTTPS repository link, or `null` until one exists. Choose `visual: "roadmap"` or `"portfolio"` for a conceptual card illustration. These illustrations represent an interface; they are not screenshots or proof of results. The archive automatically includes each project and searches its title, summary, category and tools.
4. Run the build and tests, then commit and push. New categories appear automatically. Reports can be read in the site and downloaded as their actual Markdown files.

### Add a certification or training record

Add an object to the appropriate array in `certifications.json`. A professional exam and a course completion are different records. Use a unique `id`, accurate status and issuer/provider. Add `verification` for a professional certification or `url` for training only when a real link is available; otherwise keep it `null`. Never use a course certificate number as a CompTIA certification ID. Do not invent dates or assert issuer verification without checking its evidence.

### Add a learning note or weekly review

Write `src/content/journal/<slug>.md` using [the journal template](docs/templates/JOURNAL.md). Add an index entry to `journal.json` with `id`, `title`, a real `YYYY-MM-DD` date, `category`, `summary`, `file` (without `.md`) and an accurate `status`, including substantial AI assistance where relevant. Keep the full record; feature only well-supported results.

### Update contacts, portrait and CV

Edit `profile.json`. Email and phone use real `mailto:` and `tel:` links. Set `linkedin` to your reviewed HTTPS profile URL; `null` hides it. The Contact section currently downloads the owner-supplied `Abdulrahman_Zidan_Junior_Penetration_Tester_CV.pdf` unchanged. To replace it, put the new PDF in `public/downloads/` and set `cv` to `downloads/<filename>.pdf`. The build rejects a missing file. Setting `cv` to `null` hides the download. The existing sales CV was not copied into this technical site.

Keep contact details you intend to make public. Do not add tokens, passwords, client information, lab credentials or unredacted company materials.

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` runs on pushes to `main` and through **Actions → Build, test and deploy portfolio → Run workflow**. It installs locked packages, validates content and types, builds, runs browser tests, uploads `dist/`, and deploys after the checks pass. Actions are pinned to reviewed commit SHAs. The build receives `contents: read` and `pages: read` for Pages configuration; the deployment job receives `pages: write` and `id-token: write`.

First deployment of this existing repository:

1. Use the existing **Zidmatrix/Z1D4N** repository. Preserve its history and inspect new upstream changes before pushing.
2. For GitHub Pages at zero cost, use a public repository. A private repository requires a plan that includes Pages for private repositories; do not purchase a plan for this project.
3. Push this project to `main`. Use the repository's **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Allow Actions to run, or trigger the workflow manually after enabling Pages. Check both the build and deployment jobs.
5. Open the deployed URL and run the live tests. The application is not considered published until the deployment succeeds and the live site loads correctly.

With working GitHub CLI authentication, the corresponding commands are:

```sh
gh api user --jq .login
git push -u origin main
gh api --method POST repos/Zidmatrix/Z1D4N/pages -f build_type=workflow
gh workflow run pages.yml --repo Zidmatrix/Z1D4N --ref main
gh run list --repo Zidmatrix/Z1D4N --workflow pages.yml
```

The existing `origin` is already configured. If Pages already exists, inspect it and use the settings UI or the appropriate API update; do not delete it. A Git clone succeeding does not establish Pages administration permission. Do not place an authentication token in this project.

### Future updates

```sh
git add src/content public/downloads
git commit -m "content: add documented networking lab"
git push origin main
```

Pushes to `main` trigger a rebuild automatically. There is no background AI agent or ongoing access to your accounts; new achievements need their materials, a content update and a deployment.

### Return to a previous version

Use `git log --oneline` to find the relevant content or design commit. Prefer `git revert <commit>` followed by `git push origin main`: this keeps history and triggers a fresh deployment. Reverting a merge commit needs an explicit mainline choice; inspect it first. For a preview without affecting deployment, use `git switch --detach <known-good-commit>`, build locally, and return with `git switch main`. Avoid force pushes and deleting unrelated repositories or Pages sites.

## Project record and supporting documents

- [Project log](docs/PROJECT_LOG.md): confirmed facts, missing materials, decisions, completed work, blockers and next action.
- [Source provenance](docs/SOURCES.md): inspected repositories and the existing portrait source.
- [Profile README draft](docs/PROFILE_README.md): a proposed GitHub profile introduction, not an automatic change to another repository.
- [Repository review](docs/REPOSITORY_REVIEW.md): pinning recommendations based on inspected content.
- [Design notes](docs/DESIGN.md): visual direction and interaction choices.
- [Implementation checklist](docs/ACCEPTANCE.md): requirement coverage, approved design, deferred materials and testing scope.

For future Codex tasks, use the existing checkout. Each cloud task is already isolated; do not create a Git worktree unless explicitly requested.
