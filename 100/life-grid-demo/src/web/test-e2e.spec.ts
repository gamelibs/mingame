import { test, expect } from '@playwright/test';

test.describe('人生选择器 Web Demo - 人生卷轴', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4178/');
  });

  test('页面标题和参考图布局元素存在', async ({ page }) => {
    await expect(page).toHaveTitle('人生选择器 - Life Grid');
    await expect(page.locator('header h1')).toHaveText('人生选择器');

    // 左侧：人生阶段
    await expect(page.locator('#life-stages')).toBeVisible();
    await expect(page.locator('#life-stages .life-stage')).toHaveCount(7);

    // 中间：人生棋盘
    await expect(page.locator('#grid')).toBeVisible();
    await expect(page.locator('#grid .grid-cell')).toHaveCount(100);
    await expect(page.locator('.board-size')).toHaveText('10×10');
    await expect(page.locator('.board-hint')).toContainText('点击格子');
    await expect(page.locator('#board-legend .legend-item')).toHaveCount(10);

    // 右侧上方：当前状态
    await expect(page.locator('#attributes')).toBeVisible();
    await expect(page.locator('#attributes-content .attr-item')).toHaveCount(8);
    await expect(page.locator('#current-age')).toContainText('年龄');

    // 右侧下方：人生日志
    await expect(page.locator('#logs')).toBeVisible();
    await expect(page.locator('#logs-content')).toBeVisible();

    // 左侧下方：人生卡牌库
    await expect(page.locator('#card-library')).toBeVisible();
    await expect(page.locator('#library-tags .library-tag')).toHaveCount(10);
  });

  test('人生棋盘 10×10 网格渲染完成', async ({ page }) => {
    const cells = page.locator('#grid .grid-cell');
    await expect(cells).toHaveCount(100);

    const nonEmptyCount = await page.locator('#grid .grid-cell:not(.empty)').count();
    expect(nonEmptyCount).toBeGreaterThan(0);
  });

  test('选择人生阶段后按风险等级展示行为', async ({ page }) => {
    await page.locator('#life-stages .life-stage', { hasText: '工作' }).click();

    await expect(page.locator('.risk-grid')).toBeVisible();
    await expect(page.locator('.risk-row')).toHaveCount(10);

    const labels = await page.locator('.risk-label').allTextContents();
    expect(labels).toEqual(['n10', 'n9', 'n8', 'n7', 'n6', 'n5', 'n4', 'n3', 'n2', 'n1']);

    const moreBtn = page.locator('.risk-more').first();
    await expect(moreBtn).toBeVisible();

    const text = (await moreBtn.textContent()) || '';
    const match = text.match(/\d+/);
    expect(match).not.toBeNull();
    const total = parseInt(match![0], 10);
    expect(total).toBeGreaterThan(10);

    await moreBtn.click();
    await expect(page.locator('.risk-grid')).toBeVisible();
  });

  test('取消选择人生阶段后棋盘恢复 10×10', async ({ page }) => {
    const workStage = page.locator('#life-stages .life-stage', { hasText: '工作' });
    await workStage.click();
    await expect(page.locator('.risk-grid')).toBeVisible();

    await workStage.click();
    await expect(page.locator('#grid')).toHaveClass(/grid/);
    await expect(page.locator('#grid .risk-grid')).toHaveCount(0);
    await expect(page.locator('#grid .grid-cell')).toHaveCount(100);
  });

  test('点击棋盘格子弹出事件卡并可执行', async ({ page }) => {
    const nonEmptyCell = page.locator('#grid .grid-cell:not(.empty)').first();
    await nonEmptyCell.click();

    const modal = page.locator('#event-modal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.event-title')).not.toBeEmpty();
    await expect(modal.locator('.event-story')).not.toBeEmpty();
    await expect(modal.locator('.success-rate')).toContainText('成功率');
    await expect(modal.locator('button:has-text("执行此选择")')).toBeVisible();

    await modal.locator('button:has-text("执行此选择")').click();
    await expect(modal).toBeHidden();

    const ageText = await page.locator('#current-age').textContent();
    expect(ageText).toMatch(/\d+\s*岁/);
  });

  test('执行选择后更新人生日志和卡牌库', async ({ page }) => {
    const nonEmptyCell = page.locator('#grid .grid-cell:not(.empty)').first();
    await nonEmptyCell.click();

    await page.locator('#event-modal button:has-text("执行此选择")').click();
    await page.waitForTimeout(300);

    const logEntries = page.locator('#logs-content .log-entry');
    await expect(logEntries).toHaveCount(1);

    const statsText = await page.locator('#library-stats').textContent();
    expect(statsText).toMatch(/已解锁\s*\d+\s*\/\s*\d+/);
  });

  test('自动人生按钮可运行并产生日志', async ({ page }) => {
    await page.locator('#auto-play-btn').click();
    await page.waitForTimeout(1200);
    await page.locator('#auto-play-btn').click();

    const logEntries = await page.locator('#logs-content .log-entry').count();
    expect(logEntries).toBeGreaterThan(0);

    const ageText = await page.locator('#current-age').textContent();
    expect(ageText).toMatch(/\d+\s*岁/);
  });

  test('重新开始按钮可重置游戏', async ({ page }) => {
    const nonEmptyCell = page.locator('#grid .grid-cell:not(.empty)').first();
    await nonEmptyCell.click();
    await page.locator('#event-modal button:has-text("执行此选择")').click();
    await page.waitForTimeout(300);

    await page.locator('#reset-btn').click();

    const ageText = await page.locator('#current-age').textContent();
    expect(ageText).toMatch(/1\s*岁/);

    const logEntries = await page.locator('#logs-content .log-entry').count();
    expect(logEntries).toBe(0);
  });
});
