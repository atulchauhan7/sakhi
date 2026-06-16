#!/usr/bin/env node
/*
 * Runs PurgeCSS against the theme, writes trimmed copies to ./purged/,
 * and prints a per-file before/after size report. Non-destructive:
 * your real assets/*.css are never modified by this script.
 *
 * Usage:  npm run purge
 * Then preview the trimmed CSS (see README note printed at the end)
 * and, if it looks right, copy ./purged/*.css over ./assets/.
 */
const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');
const config = require('../purgecss.config.cjs');

const OUT = path.join(__dirname, '..', 'purged');
function kb(n) { return (n / 1024).toFixed(1) + ' KB'; }

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const results = await new PurgeCSS().purge(config);

  let beforeTotal = 0, afterTotal = 0;
  console.log('\n  file                       before     after     saved');
  console.log('  ' + '-'.repeat(58));
  for (const r of results) {
    const name = path.basename(r.file);
    const before = fs.statSync(r.file).size;
    const after = Buffer.byteLength(r.css, 'utf8');
    beforeTotal += before; afterTotal += after;
    fs.writeFileSync(path.join(OUT, name), r.css);
    const saved = (((before - after) / before) * 100).toFixed(0);
    console.log(
      '  ' + name.padEnd(26) +
      kb(before).padStart(9) + kb(after).padStart(10) + (saved + '%').padStart(9)
    );
  }
  console.log('  ' + '-'.repeat(58));
  console.log(
    '  ' + 'TOTAL'.padEnd(26) +
    kb(beforeTotal).padStart(9) + kb(afterTotal).padStart(10) +
    ((((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(0) + '%').padStart(9)
  );
  console.log(`\n  Trimmed CSS written to ./purged/  (originals untouched)\n`);
  console.log('  To preview: temporarily copy purged/*.css over assets/*.css on a');
  console.log('  throwaway commit, run `shopify theme dev`, and click through every');
  console.log('  page + state (cart drawer, filters, quick-add, wishlist). If nothing');
  console.log('  is visually missing, keep it; otherwise widen the safelist and rerun.\n');
})().catch((e) => { console.error(e); process.exit(1); });
