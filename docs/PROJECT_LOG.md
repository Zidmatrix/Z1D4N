# Project log — Z!DVN technical portfolio

Last updated: 2026-10-08 (Africa/Cairo user date).

## Current state

The owner explicitly selected the existing `Zidmatrix/Z1D4N` repository. The portfolio is now implemented and validated at `/workspace/Z1D4N`, with the original initial commit preserved and the prior implementation commits imported. The original independent local directory is a retained backup, not the active publishing target. Other existing repositories remain unchanged. The implementation was pushed to remote `main` at `6b38a8be8360d8df6249cf102533428e4e41c2b2`. **Pages publication has not succeeded yet.**

Actual repository: `https://github.com/Zidmatrix/Z1D4N`.

Intended Pages URL: `https://zidmatrix.github.io/Z1D4N/`.

The site address remains a target until a deployment is verified. The owner changed the repository to public, confirmed by the repository API. Pages is not enabled yet. The connected integration still rejects Pages creation with HTTP 403, so selecting GitHub Actions as the publishing source requires the owner's GitHub UI or an appropriately authorized connection.

## Confirmed / owner-supplied information

- Professional name Abdulrahman Zidan; brand Z!DVN; based in Egypt.
- Email and phone provided for public professional contact.
- Modern Academy, Maadi; B.Sc. in Computer Science Engineering; 2024–Present; expected graduation 2028; GPA 3 without an inferred denominator.
- Best Computer Graphics Project Award — 2026, reported by the owner; project artifacts not yet supplied.
- Security+, CCNA and A+ exam passes confirmed by the owner; no issuer evidence, issue/expiry dates or credential numbers supplied.
- IT Gate networking training and Security+ study labs reported by the owner.
- The brief describes a NetRiders CompTIA Sec+ SY0-701 course completion certificate in the name Abdulrahman Mahmoud Zidan, with instructor Ahmed Sultan. The actual certificate image was not supplied in this session.
- Linux/Windows practical use and programming background supplied by the owner. Detailed workplace roles, penetration-testing experience and language proficiency levels were not inferred.

## Reviewed materials

- Supplied Arabic brief and mandatory GitHub/Pages instructions.
- Connected GitHub identity and repository list.
- Actual sources of `A.Zidan`, `Abdul.Zidan`, `Abdulrahman-Zidan`, `Myweb`, `ccna-30day-roadmap`, and the existing `Z1D4N` checkout.
- Existing real portrait from `A.Zidan`, copied unchanged with provenance.
- Official Pages workflow documentation and action repositories.

## Decisions

- Use Z1D4N as explicitly requested by the owner, preserving its original history. Keep the sales portfolios unchanged.
- English professional content; Arabic communication with the owner.
- Static React/TypeScript/Vite site, free GitHub Pages target, no backend or paid services.
- Dark editorial visual identity, cyan emphasis, restrained purple, lightweight SVG/CSS illustrations, self-hosted fonts and normal pointer/scroll behavior.
- JSON factual records and Markdown reports/journal; new content does not require layout edits.
- Separate professional certifications, course completion, training and practical use. Clearly state missing evidence.
- Include the CCNA app only after source review. Do not describe its labs as completed or claim undocumented independent authorship.
- Disclose substantial AI assistance in this portfolio and its initial journal note.
- Defer additional project examples, IT Gate details, LinkedIn and the correct CV, as requested by the owner: “خليه للاخر”. Do not ask those questions again before the owner is ready.
- Draft profile README and pinning recommendations are saved here; no other profile or repository was modified.

## Completed

- All portfolio sections: introduction/about, technical capabilities, featured projects and archive, certifications/training, technical experience, education, learning journal and contact.
- Interactive node exploration, category filters, native Markdown reading/downloads, expandable evidence/training, phone navigation, email copy and motion preferences.
- GitHub Pages base path and hash navigation, SEO files, local fonts/portrait with licenses/provenance.
- Content validators, production build, browser tests and minimal-permission automatic/manual Pages workflow with pinned action SHAs.
- English README covering local setup, content edits, contact/CV updates, commits, publishing and history-preserving rollback.
- Local validation was rerun after migrating to `/Z1D4N/`: 31 browser tests passed in 34.3 seconds; two inapplicable desktop instances of the phone-menu test skipped. Details in `QA.md`.
- Canonical/SEO URLs, report/download URLs, the test server path and the portfolio repository link now match Z1D4N. The configure-pages build step has the required read permission; only the deployment job has write permissions.
- Reproducible setup refresh and local development/production startup checked.

## Remote validation

GitHub Actions run [37792572070](https://github.com/Zidmatrix/Z1D4N/actions/runs/37792572070) checked out the pushed source, installed locked dependencies and the browser, built successfully, and passed the browser-test step. The run then failed at **Configure Pages** with **Not Found**, because a Pages site is not enabled. Upload was skipped and deployment did not run. The direct Pages URL returned HTTP 404. This is a settings blocker, not an unexplained build or application defect.

## External blocker

The connected GitHub account is Zidmatrix. Repository and Actions-run reads work. Pages read/create and repository visibility updates were rejected as `Resource not accessible by integration` (HTTP 403). A reported administrator role does not give this integration those API permissions.

The repository is now public, satisfying the free-hosting requirement. The remaining owner action is **Settings → Pages → Build and deployment → Source → GitHub Actions**. No visibility change or paid plan is needed. No token value is requested in chat. After settings change, recheck the actual state, run the existing workflow and verify the live site. Do not force-push or replace another site.

## Materials to add later

- Correct reviewed technical CV and LinkedIn URL.
- IT Gate dates, scope and actual contribution.
- Issuer evidence for the professional exams and the actual training-certificate image.
- Individual/team contribution and AI assistance for the existing CCNA study app.
- Sanitized project artifacts, award evidence and practical lab reports.

## Resume when the owner says “نكمل”

Read this log and QA first. Use `/workspace/Z1D4N` and its existing `origin`. Inspect the remote and current Actions runs; preserve the owner's changes and all local commits. After Pages settings are supplied, trigger the existing `pages.yml` workflow on main, inspect the actual run, test `https://zidmatrix.github.io/Z1D4N/`, then update the publication record and delivery links. Do not repeat the old request to create zidvn-portfolio; the owner has replaced that destination with Z1D4N.

The current environment has Internet access and an active GitHub connection. The `install_script` and `start_skill` fields were saved as a draft using `/workspace/Z1D4N`. The draft needs environment review/save and publication to become active; this is separate from Pages deployment. Configuration saves do not prove website publication or restoration in a new task.

Latest verification: [Actions run 37793109364](https://github.com/Zidmatrix/Z1D4N/actions/runs/37793109364) again passed the production build and browser-test steps, then failed at Configure Pages. Public visibility is confirmed; Pages activation remains the only publishing prerequisite.
