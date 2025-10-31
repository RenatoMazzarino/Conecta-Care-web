const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.join(__dirname, '..', '.tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const screenshotPath = path.join(outDir, 'debug-screenshot.png');
  const htmlPath = path.join(outDir, 'debug-page.html');
  const logsPath = path.join(outDir, 'debug-logs.json');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: 'console', text: msg.text(), location: msg.location() });
  });
  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push({ type: 'pageerror', message: err.message, stack: err.stack });
  });
  const requestFailures = [];
  page.on('requestfailed', req => {
    requestFailures.push({ url: req.url(), method: req.method(), failureText: req.failure()?.errorText });
  });

  try {
    console.log('navigating to http://localhost:9003/login');
    const resp = await page.goto('http://localhost:9003/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('response status:', resp && resp.status());

    // Wait a bit to allow hydration/runtime errors to surface
    await page.waitForTimeout(3000);

    // capture screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // get final HTML
    const finalHtml = await page.content();
    fs.writeFileSync(htmlPath, finalHtml, 'utf8');

    const logs = { consoleMessages, pageErrors, requestFailures };
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2), 'utf8');

    console.log('wrote screenshot:', screenshotPath);
    console.log('wrote html snapshot:', htmlPath);
    console.log('wrote logs:', logsPath);
    console.log('summary:', {
      consoleMessages: consoleMessages.length,
      pageErrors: pageErrors.length,
      requestFailures: requestFailures.length
    });

    // print detailed logs (shortened) to stdout for quick inspection
    if (pageErrors.length) {
      console.log('\nPage errors:');
      pageErrors.forEach((e, i) => console.log(i, e.message, e.stack && e.stack.split('\n')[0]));
    }
    if (requestFailures.length) {
      console.log('\nRequest failures:');
      requestFailures.forEach((r) => console.log(r.method, r.url, r.failureText));
    }
    if (consoleMessages.length) {
      console.log('\nConsole messages (last 20):');
      consoleMessages.slice(-20).forEach(m => console.log(m.type, m.text));
    }

  } catch (err) {
    console.error('script error', err);
  } finally {
    await browser.close();
  }

})();
