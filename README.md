# scrutinize.github.io

Repo for Scrutinize website snippets/assets (often pasted into Squarespace code blocks) and public resources (CSVs, PDFs, reports).

## Recent changes

- Added a 2026 “Full List of New York State Judges — FOIL Release” page snippet: `website/pages/resources/Full List of New York State Judges — FOIL Release 2026.css`
- Added a reusable, no-Datawrapper CSV table script (search + click-to-sort): `website/scripts/judges_table.js`
- Table script can optionally render a judge-name index (A–Z) from the loaded CSV (pass `seoIndexContainerId` to `mount()`).
- For strongest SEO, pre-render the table/index into the HTML source (not just client-side JS rendering).

## Data conventions (FOIL releases)

- Store OCA FOIL releases under `website/resources/foils/OCA/` with year-stamped filenames (example: `Scrutinize_FOIL_OCA_judges_2026_cleaned.csv`).
- Store original PDF disclosures in `website/resources/pdfs/foils_disclosures/` (example folder: `website/resources/pdfs/foils_disclosures/OCA_judges/`).

## Dev notes

- Run table-script unit tests: `node --test website/scripts/judges_table.test.js`
- Generate an optional judge-name index for SEO: `node website/scripts/generate_judges_seo_index.js --csv website/resources/foils/OCA/Scrutinize_FOIL_OCA_judges_2026_cleaned.csv`
