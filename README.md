# scrutinize.github.io

Repo for Scrutinize website snippets/assets (often pasted into Squarespace code blocks) and public resources (CSVs, PDFs, reports).

## Recent changes

- Added a 2026 “Full List of New York State Judges — FOIL Release” page snippet: `website/pages/resources/Full List of New York State Judges — FOIL Release 2026.css`
- Added a reusable, no-Datawrapper CSV table script (search + click-to-sort): `website/scripts/judges_table.js`

## Data conventions (FOIL releases)

- Store cleaned datasets in `website/resources/csvs/` using year-stamped filenames so older releases stay stable (example: `judicial_directory_oca_foil_2026_cleaned.csv`).
- Store original PDF disclosures in `website/resources/pdfs/foils_disclosures/` (example folder: `website/resources/pdfs/foils_disclosures/OCA_judges/`).

## Dev notes

- Run table-script unit tests: `node --test website/scripts/judges_table.test.js`
