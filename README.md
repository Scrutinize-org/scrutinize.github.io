# scrutinize.github.io

## Purpose

Repository for Scrutinize website snippets/assets (often pasted into Squarespace code blocks) and published public resources (CSV, PDF, and report/media files).

## Current Status

- Production-facing styles/snippets live under `website/pages/` and should keep existing naming/grouping patterns.
- Reusable client-side table behavior is maintained in `website/scripts/judges_table.js` with tests in `website/scripts/judges_table.test.js`.
- FOIL release CSVs and disclosure PDFs are stored as durable resources under `website/resources/`.

## How To Run Or Verify

- Run table script tests when `website/scripts/judges_table.js` behavior changes: `node --test website/scripts/judges_table.test.js`
- If CSV-to-index behavior changes, generate with an explicit CSV path and verify output formatting:
  - `node website/scripts/generate_judges_seo_index.js --csv website/resources/foils/OCA/Scrutinize_FOIL_OCA_judges_2026_cleaned.csv`

## Key Workflows Or Commands

- Build a no-Datawrapper table with search and click-to-sort using `website/scripts/judges_table.js`.
- Optionally render a judge-name A-Z index by passing `seoIndexContainerId` to `mount()`.
- For strongest SEO, pre-render the table/index into the HTML source (instead of relying only on client-side rendering).

## Major Recent Changes

- Added a 2026 "Full List of New York State Judges - FOIL Release" page snippet: `website/pages/resources/Full List of New York State Judges — FOIL Release 2026.css`.
- Added reusable no-Datawrapper CSV table behavior in `website/scripts/judges_table.js` (search, sorting, optional A-Z index support).
- Added and updated 2025 annual report page assets, including `website/pages/annual-reports/the-state-of-ny-courts-2025-in-review.css`.

## Important Caveats And Assumptions

- Place OCA FOIL release CSVs under `website/resources/foils/OCA/` with year-stamped filenames.
- Keep original FOIL disclosure PDFs under `website/resources/pdfs/foils_disclosures/`.
- Treat files under `website/pages/` as production-facing and preserve established naming/grouping conventions.
