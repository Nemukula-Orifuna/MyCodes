// Render an HTML file to an A4 PDF with page numbers.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

(async () => {
  const [, , input, output, title] = process.argv;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + input, { waitUntil: 'load' });
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:7.5px;color:#888;width:100%;padding:0 16mm;font-family:Inter,sans-serif;">COM5231 · ${title}</div>`,
    footerTemplate: '<div style="font-size:7.5px;color:#888;width:100%;text-align:center;font-family:Inter,sans-serif;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  await browser.close();
})();
