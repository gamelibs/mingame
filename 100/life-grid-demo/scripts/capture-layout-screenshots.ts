import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.resolve(__dirname, '../test-results/layout-screenshots');
const URL = 'http://localhost:5175/';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1200', width: 1200, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'mobile-375', width: 375, height: 812 },
];

async function capturePage(page: any, name: string) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    fullPage: true,
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('.life-goal-card', { timeout: 10000 });
    await page.click('.life-goal-card');
    await page.waitForSelector('#grid .grid-cell', { timeout: 10000 });
    await capturePage(page, vp.name);
    console.log(`✅ ${vp.name}: ${vp.width}x${vp.height}`);

    // 移动端额外截图抽屉交互
    if (vp.width <= 768) {
      // 时间轴抽屉
      await page.click('#mobile-timeline-btn');
      await page.waitForTimeout(300);
      await capturePage(page, `${vp.name}-drawer-timeline`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // 当前状态抽屉
      await page.click('#mobile-status-btn');
      await page.waitForTimeout(300);
      await capturePage(page, `${vp.name}-drawer-status`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // 人生日志抽屉
      await page.click('[data-drawer="logs"]');
      await page.waitForTimeout(300);
      await capturePage(page, `${vp.name}-drawer-logs`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // 人生阶段抽屉
      await page.click('[data-drawer="stages"]');
      await page.waitForTimeout(300);
      await capturePage(page, `${vp.name}-drawer-stages`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // 卡牌库抽屉
      await page.click('[data-drawer="library"]');
      await page.waitForTimeout(300);
      await capturePage(page, `${vp.name}-drawer-library`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n截图已保存到 ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
