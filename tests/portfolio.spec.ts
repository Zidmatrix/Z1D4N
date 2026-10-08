import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import projects from '../src/content/projects.json' with { type: 'json' };
import certificates from '../src/content/certifications.json' with { type: 'json' };
import profile from '../src/content/profile.json' with { type: 'json' };

test('production page loads its fonts, image, assets and factual content without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Understand');
  await expect(page.getByRole('heading', { name: 'Modern Academy, Maadi' })).toBeAttached();
  await expect(page.locator('.project-card')).toHaveCount(projects.filter((project) => project.featured).length);
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.portrait-frame img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('500 16px "Space Grotesk Variable"'))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('400 16px "Inter Variable"'))).toBe(true);
  expect(errors).toEqual([]);
});

test('project filters show the matching actual work', async ({ page }) => {
  await page.goto('./#work');
  await page.getByRole('button', { name: 'Networking', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(projects.filter((project) => project.featured && project.category === 'Networking').length);
  await expect(page.locator('.project-card h3').filter({ hasText: 'CCNA Study Roadmap' })).toBeVisible();
  await page.getByRole('button', { name: 'Web Development', exact: true }).click();
  await expect(page.locator('.project-card h3').filter({ hasText: 'Z!DVN / Technical Portfolio' })).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(projects.filter((project) => project.featured).length);
});

test('network nodes respond to keyboard activation and link to the relevant capability', async ({ page }) => {
  await page.goto('./');
  const node = page.getByRole('button', { name: 'Explore Networks', exact: true });
  await node.focus(); await page.keyboard.press('Enter');
  await expect(node).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.visual-caption p')).toHaveText('Understand the connections before the complexity.');
  await page.getByRole('link', { name: 'Read about Networks', exact: true }).click();
  await expect(page).toHaveURL(/#capability-networks$/);
});

test('report dialog contains real Markdown, traps focus, downloads and closes with Escape', async ({ page }) => {
  await page.goto('./#work');
  const opener = page.getByRole('link', { name: 'Read CCNA Study Roadmap report', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('7046ee3e82b925b1c4152e604ff5bdea00f08e35');
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: 'Download Markdown' }).click()]);
  expect(download.suggestedFilename()).toBe('ccna-roadmap.md');
  expect(await download.failure()).toBeNull();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
  await expect(opener).toBeFocused();
});

test('direct report and journal links survive a page refresh', async ({ page }) => {
  for (const [hash, expected] of [['report/portfolio', 'My Contribution and AI Assistance'], ['journal/building-an-evidence-led-portfolio', 'Weekly review']]) {
    await page.goto(`./#${hash}`);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText(expected);
    await page.reload();
    await expect(page.getByRole('dialog')).toContainText(expected);
    await page.getByRole('button', { name: 'Close article' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
});

test('contact URLs are real and the CV is only linked when supplied', async ({ page }) => {
  await page.goto('./#contact');
  await expect(page.locator('.contact-email')).toHaveAttribute('href', 'mailto:abd3lra7manzidan@gmail.com');
  await expect(page.getByRole('link', { name: '+201092637006', exact: true })).toHaveAttribute('href', 'tel:+201092637006');
  await expect(page.locator('.contact-actions a').filter({ hasText: 'GitHub' })).toHaveAttribute('href', 'https://github.com/Zidmatrix');
  if (profile.cv === null) {
    await expect(page.locator('.cv-note')).toContainText('will be added');
    await expect(page.getByRole('link', { name: /Download.*CV/ })).toHaveCount(0);
  } else {
    await expect(page.getByRole('link', { name: /Download.*CV/ })).toHaveAttribute('href', `/zidvn-portfolio/${profile.cv}`);
  }
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.locator('.copy-button')).toHaveText(/Email copied|Use the email link/);
});

test('archive and training details expand without conflating certifications and courses', async ({ page }) => {
  await page.goto('./#work');
  await page.locator('.archive summary').click();
  await expect(page.locator('.archive-row')).toHaveCount(projects.length);
  await expect(page.locator('.archive-content')).toBeVisible();
  await page.locator('#credentials').scrollIntoViewIfNeeded();
  await page.locator('.training-item').filter({ hasText: 'NetRiders' }).locator('summary').click();
  await expect(page.locator('.training-detail').filter({ hasText: 'Ahmed Sultan' })).toBeVisible();
  await expect(page.locator('.certification-card')).toHaveCount(certificates.professional.length);
});

test('phone navigation opens, follows a link and restores focus on Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile menu is only shown on phone and tablet layouts.');
  await page.goto('./');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('#main-navigation')).toBeVisible();
  await page.locator('#main-navigation').getByRole('link', { name: 'Credentials', exact: true }).click();
  await expect(page).toHaveURL(/#credentials$/);
  await expect(page.locator('#main-navigation')).not.toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
});

test('layout fits phone, tablet and desktop widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow at ${width}px`).toBe(true);
    expect(await page.locator('.menu-toggle').isVisible(), `Navigation toggle visibility at ${width}px`).toBe(width <= 860);
  }
});

test('reduced motion removes animation and can be persisted manually', async ({ page }, testInfo) => {
  await page.goto('./');
  const toggle = page.locator('.motion-button');
  if (testInfo.project.name === 'reduced-motion') {
    await expect(toggle).toBeDisabled();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  } else {
    await toggle.scrollIntoViewIfNeeded(); await toggle.click();
    await expect(toggle).toHaveText('Motion off');
    await page.reload(); await expect(toggle).toHaveText('Motion off');
  }
  expect(await page.locator('.orbit').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('page and open dialog have no serious accessibility violations', async ({ page }) => {
  await page.goto('./');
  const pageResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(pageResults.violations).toEqual([]);
  await page.goto('./#report/portfolio');
  await expect(page.getByRole('dialog')).toBeVisible();
  const dialogResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(dialogResults.violations).toEqual([]);
});
