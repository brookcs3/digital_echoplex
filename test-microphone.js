import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    permissions: ['microphone']
  });
  const page = await context.newPage();

  // Listen to console messages
  page.on('console', msg => {
    console.log(`BROWSER: ${msg.text()}`);
  });

  console.log('🎭 Starting Playwright microphone test...');
  
  // Navigate to the Echoplex
  await page.goto('http://localhost:4321');
  
  console.log('📄 Page loaded, waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  // Check if power button exists
  const powerButton = await page.locator('#power-button').first();
  if (await powerButton.count() > 0) {
    console.log('🔌 Found power button, clicking...');
    await powerButton.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('❌ Power button not found');
  }
  
  // Check if record button exists  
  const recordButton = await page.locator('[data-function="record"]').first();
  if (await recordButton.count() > 0) {
    console.log('⏺️ Found record button, clicking...');
    await recordButton.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('❌ Record button not found');
  }
  
  console.log('🔍 Test complete. Browser will stay open for manual inspection...');
  
  // Keep browser open
  // await browser.close();
})();