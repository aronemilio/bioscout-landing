const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000); // More time for video
  
  // Check video readyState again
  const video = await page.$('#hero-main-video');
  const videoReady = video ? await video.evaluate(v => v.readyState) : 'NOT_FOUND';
  const videoSrc = video ? await video.evaluate(v => v.currentSrc) : 'NOT_FOUND';
  console.log('Video readyState:', videoReady, '(4=HAVE_ENOUGH_DATA)');
  console.log('Video currentSrc:', videoSrc);
  
  // Accessibility checks
  const issues = [];
  
  // 1. Check for missing alt text on images
  const images = await page.$$('img');
  for (const img of images) {
    const alt = await img.getAttribute('alt');
    const src = await img.getAttribute('src');
    // alt="" es válido para imágenes decorativas; el problema real es NO tener el atributo.
    if (alt === null) {
      issues.push(`Missing alt attribute: ${src}`);
    }
  }
  
  // 2. Check for form labels (buttons with only icons)
  const iconButtons = await page.$$('button:not(:has-text(""))');
  for (const btn of iconButtons) {
    const ariaLabel = await btn.getAttribute('aria-label');
    const title = await btn.getAttribute('title');
    const text = await btn.textContent();
    if (!ariaLabel && !title && text.trim() === '') {
      issues.push(`Button missing accessible name: ${await btn.evaluate(el => el.outerHTML.substring(0, 100))}`);
    }
  }
  
  // 3. Check heading hierarchy
  const headings = await page.$$('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  for (const h of headings) {
    const tag = await h.evaluate(el => el.tagName.toLowerCase());
    const level = parseInt(tag[1]);
    const text = await h.textContent();
    if (level > lastLevel + 1 && lastLevel !== 0) {
      issues.push(`Heading level jump: ${tag} "${text.trim()}" after h${lastLevel}`);
    }
    lastLevel = level;
  }
  
  // 4. Check color contrast (basic - check for very light text on light bg)
  // 5. Check for lang attribute
  const htmlLang = await page.getAttribute('html', 'lang');
  if (!htmlLang) issues.push('Missing lang attribute on html');
  
  // 6. Check for focus indicators
  const focusable = await page.$$('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  console.log(`\nFocusable elements: ${focusable.length}`);
  
  // 7. Check video has controls
  const hasControls = video ? await video.evaluate(v => v.controls) : false;
  console.log('Video has controls:', hasControls);
  
  console.log('\n=== ACCESSIBILITY ISSUES ===');
  if (issues.length === 0) {
    console.log('No major issues found ✓');
  } else {
    issues.forEach(i => console.log(' -', i));
  }
  
  // Performance metrics
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
      loadComplete: perf.loadEventEnd - perf.loadEventStart,
      totalTime: perf.loadEventEnd - perf.fetchStart
    };
  });
  console.log('\n=== PERFORMANCE ===');
  console.log('DOMContentLoaded:', metrics.domContentLoaded.toFixed(2), 'ms');
  console.log('Load complete:', metrics.loadComplete.toFixed(2), 'ms');
  console.log('Total load time:', metrics.totalTime.toFixed(2), 'ms');
  
  await browser.close();
})();
