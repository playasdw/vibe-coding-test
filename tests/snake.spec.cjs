const { test, expect } = require('@playwright/test');

test.describe('Neon Snake', () => {
  test('loads and starts with keyboard input', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Neon Snake/);
    await expect(page.getByRole('heading', { name: '准备好了吗？' })).toBeVisible();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#overlay')).toHaveClass(/hidden/);
    await expect(page.locator('#score')).toHaveText('0');
  });

  test('pause and resume work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '开始游戏' }).click();
    await page.getByRole('button', { name: '暂停' }).click();
    await expect(page.getByRole('heading', { name: '已暂停' })).toBeVisible();
    await page.getByRole('button', { name: '继续游戏' }).click();
    await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  });

  test('mobile controls are available on mobile viewport', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only check');
    await page.goto('/');
    await expect(page.getByRole('button', { name: '向上' })).toBeVisible();
    await page.getByRole('button', { name: '向上' }).click();
    await expect(page.locator('#overlay')).toHaveClass(/hidden/);
  });

  test('best score is restored from localStorage', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('neonSnakeBest', '120'));
    await page.goto('/');
    await expect(page.locator('#best')).toHaveText('120');
  });

  test('eventually reaches game over when moving into a wall', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '开始游戏' }).click();
    await expect(page.getByRole('heading', { name: '游戏结束' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: '再来一局' })).toBeVisible();
  });
});
