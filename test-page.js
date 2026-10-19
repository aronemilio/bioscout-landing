const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  try {
    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for animations/JS to initialize
    
    // Check video loads
    const video = await page.$('#hero-main-video');
    const videoReady = video ? await video.evaluate(v => v.readyState) : 'NOT_FOUND';
    
    // Check canvas elements
    const radarCanvas = await page.$('#tactical-radar-canvas');
    const swarmCanvas = await page.$('#swarm-flyover-canvas');
    const particlesCanvas = await page.$('#ambient-particles-canvas');
    
    console.log('=== PAGE TEST RESULTS ===');
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    console.log('Video readyState:', videoReady, '(4=HAVE_ENOUGH_DATA)');
    console.log('Radar canvas:', radarCanvas ? 'FOUND' : 'MISSING');
    console.log('Swarm canvas:', swarmCanvas ? 'FOUND' : 'MISSING');
    console.log('Particles canvas:', particlesCanvas ? 'FOUND' : 'MISSING');
    console.log('Console errors:', errors.length);
    
    if (errors.length > 0) {
      console.log('\nERRORS:');
      errors.forEach(e => console.log(' -', e));
    }
    
    // Test radar interactions
    await page.click('#btn-range-200');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Simular Obstáculo")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Simular Batería Baja")');
    await page.waitForTimeout(1000);
    
    // Check if handover banner appears
    const handoverVisible = await page.isVisible('#radar-handover-banner:not(.hidden)');
    console.log('Handover banner triggered:', handoverVisible);
    
    // Check metrics animation
    const metrics = await page.$$('#metrics-strip-container [data-target]');
    console.log('Metric elements found:', metrics.length);
    
    // Screenshot
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log('\nScreenshot saved: test-screenshot.png');
    
  } catch (err) {
    console.error('Test failed:', err.message);
  }
  
  await browser.close();
})();
