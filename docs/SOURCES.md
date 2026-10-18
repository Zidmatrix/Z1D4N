# Source provenance

The owner supplied the identity, contact details, education, reported exam passes and technical background in the brief. No exam dates, GPA denominator, professional security role or issuer verification were inferred.

## Inspected GitHub account

The public repositories page at `https://github.com/Zidmatrix?tab=repositories` was read on 2026-10-08. GitHub API later confirmed the connected identity and accessible repositories. Z1D4N originally contained only a one-line README; the owner subsequently selected it as the destination for this technical portfolio. Its initial commit is preserved. Other existing repositories were left unchanged.

Source checkouts of `A.Zidan`, `Abdul.Zidan`, `Abdulrahman-Zidan`, `Myweb` and `ccna-30day-roadmap` were inspected outside this project. The sales-focused websites were not altered or repurposed. A repository name or commit count was not used as evidence of a skill.

## Portrait

`public/images/abdulrahman-zidan.webp` is copied unchanged from the existing public `Zidmatrix/A.Zidan` repository at commit `a1aecc7aa0d2543344c633b026b3f92f404b9c41`, path `public/profile.webp`. That repository identifies it as the real owner portrait. It was visually inspected before use. No photograph, certificate image or CV was generated.

## Technical CV

The owner uploaded `Abdulrahman_Zidan_Junior_Penetration_Tester_CV.pdf` on 2026-10-08 and explicitly requested that it be added to the website. It is stored unchanged at `public/downloads/Abdulrahman_Zidan_Junior_Penetration_Tester_CV.pdf`; the profile record controls its download link. The file was opened and visually inspected. It is an owner-supplied resume, not independent verification of every statement in it.

SHA-256: `ba386f13d7fb2f88620fa5f38513cfd11e29bb216ceee524a97f41ce4945504b`.

## Study application

The CCNA report links the reviewed source at commit `7046ee3e82b925b1c4152e604ff5bdea00f08e35`. Local storage, quizzes, flashcards, notes and export/import are visible in the source. Completed labs, runtime correctness, authorship details and issuer certification are separate claims and were not inferred.

## Assets and dependencies

Space Grotesk and Inter are self-hosted through their Fontsource packages, which include their upstream font license files. Lucide provides open-source interface icons. The diagrams and project card illustrations are original SVG/CSS interface compositions, not screenshots or evidence of completed work. See the installed packages for their respective open-source licenses. Exact dependency resolution and package integrity hashes are retained in `package-lock.json`.

PDF.js (`pdfjs-dist` 6.4.299, Apache-2.0) renders the owner's original CV inside the website. Its renderer and worker are hosted under the same project path and loaded near the CV section. The text-selection CSS is adapted from its upstream viewer stylesheet. Its license is included at `public/licenses/pdfjs-LICENSE.txt`.

## Deployment documentation

The official GitHub documentation source was fetched over verified HTTPS from:

- `github/docs/content/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages.md`
- Official `actions/checkout` and `actions/setup-node` README files.

Current action tags were resolved through read-only Git operations and pinned to their full SHAs in the workflow. This review established the workflow configuration, not a successful Actions run.

## Owner-supplied certificates - 2026-10-18

The owner supplied both files and requested inline display on the public portfolio. They are copied unchanged into `public/certificates/`.

- The NetRiders image was visually reviewed. It is a CompTIA Sec+ SY0-701 **course completion** certificate for Abdulrahman Mahmoud Zidan, instructor Ahmed Sultan, ID NTR-701-483927. This training ID is not used as a CompTIA exam credential ID.
- The original EF SET PDF was rendered and visually reviewed. It states C2 Proficient, 81/100 overall, 81/100 Reading and 81/100 Listening, awarded 01 Oct 2026. The portfolio limits the assessment scope to reading and listening. The PDF contains `cert.efset.org/dLQ16M`; no external verification claim was added.
- Both previews use the same document-frame component as the CV, with distinct IDs, labels, local asset URLs and independent zoom controls. The EF SET original PDF is rendered using the existing self-hosted PDF.js runtime; the NetRiders original JPEG is displayed as an image.

- `Abdulrahman-Zidan-EF-SET-C2.pdf`: SHA-256 `a5ae286f711638318e5fda6ac8bba24540630c9dc6365ee2576e88d7e565eeb8` (80080 bytes).
- `Abdulrahman-Zidan-Security-Plus-NetRiders.jpeg`: SHA-256 `4a65abfe474231daf3d972c0323a0bf9d3ebe2f48a28a02d88678abb71a7810c` (300160 bytes).
