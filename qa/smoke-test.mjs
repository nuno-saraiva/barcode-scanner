import { chromium } from 'playwright';

const targetArg = process.argv.find(arg => arg.startsWith('--target='));
const targetUrl = targetArg
  ? targetArg.slice('--target='.length)
  : process.env.TARGET_URL || 'https://nuno-saraiva.github.io/ArmazemNH/';
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'tablet', width: 1200, height: 2000 },
  { name: 'mobile', width: 390, height: 844 },
];

const checks = [];

function ok(name, pass, detail = '') {
  checks.push({ name, pass, detail });
  const mark = pass ? 'OK' : 'FAIL';
  console.log(`${mark} ${name}${detail ? ` - ${detail}` : ''}`);
  if (!pass) process.exitCode = 1;
}

async function clickIfVisible(page, locator) {
  try {
    if (await locator.isVisible({ timeout: 1200 })) {
      await locator.click({ timeout: 2000 });
      return true;
    }
  } catch {}
  return false;
}

async function loginIfNeeded(page) {
  const login = page.locator('#loginScreen');
  if (!(await login.isVisible({ timeout: 2500 }).catch(() => false))) return;
  const knownUser = page.getByText('Constança', { exact: true });
  if (await clickIfVisible(page, knownUser)) return;
  const firstAvatar = page.locator('.av-item').first();
  if (await firstAvatar.isVisible({ timeout: 1500 }).catch(() => false)) {
    await firstAvatar.click();
  }
}

async function runViewport(browser, viewport) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(7000);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await loginIfNeeded(page);

  ok(`${viewport.name}: title`, (await page.title()).includes('Warehouse'), await page.title());
  ok(`${viewport.name}: PT flag`, await page.locator('#lang-pt, #lang-pt-mob').count() > 0);
  ok(`${viewport.name}: GB flag`, await page.locator('#lang-en, #lang-en-mob').count() > 0);
  ok(`${viewport.name}: ES flag`, await page.locator('#lang-es, #lang-es-mob').count() > 0);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  ok(
    `${viewport.name}: no page horizontal overflow`,
    overflow.scrollWidth <= overflow.clientWidth + 8,
    `${overflow.scrollWidth}/${overflow.clientWidth}`,
  );

  if (viewport.name !== 'mobile') {
    await page.locator('#warehouseMapDrawer button[onclick*="openWarehouseMapModal"]').click();
    ok(`${viewport.name}: warehouse map modal`, await page.locator('#warehouseMapModal.visible').isVisible());
    await page.locator('#warehouseMapModal .btn').first().click();
  }

  await page.close();
}

const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    await runViewport(browser, viewport);
  }
} finally {
  await browser.close();
}

const failed = checks.filter(c => !c.pass).length;
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
if (failed) process.exit(1);
