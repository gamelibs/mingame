import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const PORT = 5175;
const BASE_URL = `http://[::1]:${PORT}/`;
const OUT_DIR = path.resolve(__dirname, '../test-results/verify-diversity');

async function waitFor<T>(
  fn: () => Promise<T> | T,
  timeout = 10000,
  interval = 200
): Promise<T> {
  const start = Date.now();
  while (true) {
    try {
      const result = await fn();
      if (result) return result;
    } catch {}
    if (Date.now() - start > timeout) throw new Error('waitFor timeout');
    await new Promise((r) => setTimeout(r, interval));
  }
}

async function getAge(page: Page): Promise<number> {
  const text = await page.locator('#current-age').textContent();
  const match = text?.match(/(\d+)\s*岁/);
  return match ? parseInt(match[1], 10) : 0;
}

async function isAutoPlaying(page: Page): Promise<boolean> {
  const text = await page.locator('#auto-play-btn').textContent();
  return text?.includes('停止') ?? false;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-proxy-server', '--proxy-bypass-list=*'],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(BASE_URL);

  // 选择第一个人生目标
  await page.locator('.life-goal-card').first().click();
  await page.locator('.life-goal-modal').waitFor({ state: 'hidden', timeout: 5000 });

  // 等待 AI 开局寄语弹窗出现并确认
  await page.locator('#ai-opening-modal').waitFor({ state: 'visible', timeout: 5000 });
  // 若未配置有效 Key，AI 会显示失败信息；点击“开始人生”继续
  await page.locator('#ai-opening-modal-start').click();
  await page.locator('#ai-opening-modal').waitFor({ state: 'hidden', timeout: 5000 });

  // 截图：1 岁初始棋盘
  await page.screenshot({ path: path.join(OUT_DIR, 'age-1.png'), fullPage: true });

  // 点击自动人生并等待到 30 岁
  await page.locator('#auto-play-btn').click();
  await waitFor(async () => (await getAge(page)) >= 30, 60000);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'age-30plus.png'), fullPage: true });

  // 继续自动人生，等到 55 岁或自动停止（死亡/结束）
  await waitFor(
    async () => {
      const age = await getAge(page);
      const playing = await isAutoPlaying(page);
      return age >= 55 || !playing;
    },
    120000
  );

  if (await isAutoPlaying(page)) {
    await page.locator('#auto-play-btn').click();
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'age-50plus.png'), fullPage: true });

  // 记录日志中重复行为的统计
  const logTexts = await page.locator('#logs-content .log-entry .log-title').allTextContents();
  const counts: Record<string, number> = {};
  logTexts.forEach((t) => {
    const name = t.replace(/^\d+岁\s*:\s*/, '').trim();
    counts[name] = (counts[name] || 0) + 1;
  });
  const repeats = Object.entries(counts)
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1]);

  const summary = {
    finalAge: await getAge(page),
    totalChoices: logTexts.length,
    uniqueBehaviors: Object.keys(counts).length,
    repeats: repeats.slice(0, 10),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

  console.log('验证完成');
  console.log(JSON.stringify(summary, null, 2));

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
