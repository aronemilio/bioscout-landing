const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  
  await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(10000); // Wait longer for video
  
  const video = await page.$('#hero-main-video');
  const videoReady = video ? await video.evaluate(v => v.readyState) : 'NOT_FOUND';
  const videoDuration = video ? await video.evaluate(v => v.duration) : 'NOT_FOUND';
  const videoBuffered = video ? await video.evaluate(v => {
    const buf = v.buffered;
    if (buf.length === 0) return '0 bytes';
    return `${(buf.end(0) - buf.start(0) / 1024 / 1024).toFixed(2)} MB`;
  }) : 'NOT_FOUND';
  
  console.log('Video readyState:', videoReady, '(0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA)');
  console.log('Video duration:', videoDuration);
  console.log('Video buffered:', videoBuffered);
  console.log('Video error:', await video.evaluate(v => v.error ? v.error.code + ': ' + v.error.message : 'none'));
  
  console.log('\nConsole messages:');
  errors.forEach(e => console.log(' -', e));
  
  await browser.close();
})();
