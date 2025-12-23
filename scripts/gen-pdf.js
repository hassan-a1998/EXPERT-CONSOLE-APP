const fs = require('fs');
const path = require('path');
const marked = require('marked');
const puppeteer = require('puppeteer');

async function generate() {
  const mdPath = path.join(__dirname, '..', 'docs', 'solution.md');
  const outPath = path.join(__dirname, '..', 'docs', 'solution.pdf');
  const md = fs.readFileSync(mdPath, 'utf8');
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Solution</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111}h1,h2,h3{color:#111}pre{background:#f6f8fa;padding:12px;border-radius:6px;overflow:auto}</style></head><body>${marked(md)}</body></html>`;

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPath, format: 'A4', printBackground: true });
  await browser.close();
  console.log('Generated PDF at', outPath);
}

generate().catch((err) => { console.error(err); process.exit(1); });
