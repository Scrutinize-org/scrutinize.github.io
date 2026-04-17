# AGENTS.md

## Repo purpose
- This repository stores Scrutinize website assets and snippets, including page CSS, scripts, CSV/PDF resources, and report/media files used in the published site.

## README usage
- Read `README.md` first before making substantive changes.
- Keep `README.md` updated only for major, meaningful repository changes (new workflows, major data drops, major page/script additions).
- Avoid cosmetic README churn.

## Verification expectations
- If `website/scripts/judges_table.js` or related script behavior changes, run: `node --test website/scripts/judges_table.test.js`.
- If CSV-to-index behavior changes, run the generator with an explicit CSV path and verify output formatting.
- Before declaring work complete, check `git diff -- README.md AGENTS.md` for unintended documentation changes.

## Durable conventions
- Place FOIL release CSVs under `website/resources/foils/OCA/` with year-stamped filenames when applicable.
- Keep original FOIL disclosure PDFs in `website/resources/pdfs/foils_disclosures/`.
- Treat files under `website/pages/` as production-facing page styles/snippets; preserve existing naming patterns and page grouping.
