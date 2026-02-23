#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const { parseCsv } = require('./judges_table');

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function slugify(value) {
  const raw = (value ?? '').toString().trim();
  if (!raw) return '';

  const normalized = raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
  return (text ?? '')
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function usage() {
  const scriptName = path.basename(process.argv[1] || 'generate_judges_seo_index.js');
  process.stderr.write(
    [
      '',
      `Usage: node website/scripts/${scriptName} --csv <path> [--judgeKey judge] [--rowIdPrefix scrt-judge-]`,
      '',
      'Example:',
      '  node website/scripts/generate_judges_seo_index.js \\',
      '    --csv website/resources/foils/OCA/Scrutinize_FOIL_OCA_judges_2026_cleaned.csv \\',
      '    --judgeKey judge \\',
      '    --rowIdPrefix scrt-judge-',
      '',
    ].join('\n')
  );
}

const csvPath = getArg('--csv');
const judgeKey = getArg('--judgeKey') || 'judge';
const rowIdPrefix = getArg('--rowIdPrefix') || 'scrt-judge-';

if (!csvPath) {
  usage();
  process.exit(2);
}

const csvText = fs.readFileSync(csvPath, 'utf8');
const parsed = parseCsv(csvText).filter(row => row.some(cell => (cell ?? '').toString().trim() !== ''));
if (!parsed.length) {
  process.stderr.write('No rows found in CSV.\n');
  process.exit(1);
}

const header = (parsed[0] ?? []).map(h => (h ?? '').toString().trim());
const judgeIndex = header.indexOf(judgeKey);
if (judgeIndex === -1) {
  process.stderr.write(`Column "${judgeKey}" not found. Headers: ${header.join(', ')}\n`);
  process.exit(1);
}

const names = parsed
  .slice(1)
  .map(row => (row[judgeIndex] ?? '').toString().trim())
  .filter(Boolean);

const uniqueSorted = Array.from(new Set(names)).sort((a, b) =>
  a.localeCompare(b, 'en', { sensitivity: 'base' })
);

const lines = uniqueSorted
  .map(name => {
    const slug = slugify(name);
    const href = slug ? `#${escapeHtml(rowIdPrefix + slug)}` : '#';
    return `<a href="${href}">${escapeHtml(name)}</a>`;
  })
  .join('<br>\n        ');

process.stdout.write(
  [
    '<details class="scrt-judges-seo-index">',
    '  <summary>Browse judge names (A–Z)</summary>',
    '  <div class="scrt-judges-seo-index__cols">',
    `        ${lines}`,
    '  </div>',
    '</details>',
    '',
  ].join('\n')
);
