const { chromium } = require('playwright');

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Wide', width: 1920, height: 1080 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Check for horizontal overflow
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    
    // Check hero section visibility
    const hero = await page.$('#hero');
    const heroVisible = hero ? await hero.isVisible() : false;
    
    // Check radar section
    const radar = await page.$('#radar-tactico');
    const radarVisible = radar ? await radar.isVisible() : false;
    
    // Check nav visibility (mobile vs desktop)
    const nav = await page.$('nav.hidden.xl\\:flex');
    const navVisible = nav ? await nav.isVisible() : false;
    
    console.log(`${vp.name} (${vp.width}x${vp.height}):`);
    console.log(`  Horizontal overflow: ${overflow ? 'YES ⚠️' : 'NO ✓'}`);
    console.log(`  Hero visible: ${heroVisible ? 'YES ✓' : 'NO'}`);
    console.log(`  Radar visible: ${radarVisible ? 'YES ✓' : 'NO'}`);
    console.log(`  Desktop nav visible: ${navVisible ? 'YES' : 'NO (hamburger expected)'}`);
    
    await page.screenshot({ path: `screenshot-${vp.name.toLowerCase()}.png`, fullPage: true });
    await page.close();
  }
  
  await browser.close();
  console.log('\nScreenshots saved for each viewport');
})();
