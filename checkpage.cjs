const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 30000 }).catch(e => errors.push('GOTO: ' + e.message));
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML.slice(0, 300) || 'NO ROOT');
  console.log('ROOT LENGTH:', (await page.evaluate(() => document.getElementById('root')?.innerHTML.length)) || 0);
  console.log('ROOT SNIPPET:', rootHtml);
  console.log('ERRORS:\n' + (errors.join('\n') || 'none'));
  await browser.close();
})();
