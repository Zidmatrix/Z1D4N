import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const live = process.env.PORTFOLIO_TEST_URL;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const chromiumLaunch = { executablePath, args: ['--no-sandbox'] };
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['json', { outputFile: 'qa-results/browser-results.json' }]],
  use: {
    baseURL: live || 'http://127.0.0.1:4175/Z1D4N/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 }, launchOptions: chromiumLaunch } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 }, launchOptions: chromiumLaunch } },
    { name: 'reduced-motion', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', launchOptions: chromiumLaunch } },
    { name: 'firefox', testMatch: 'certifications-links.spec.ts', use: { ...devices['Desktop Firefox'], browserName: 'firefox', viewport: { width: 1440, height: 1000 } } },
    { name: 'webkit', testMatch: 'certifications-links.spec.ts', use: { ...devices['Desktop Safari'], browserName: 'webkit', viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: live ? undefined : { command: 'npm run preview -- --port 4175 --strictPort', url: 'http://127.0.0.1:4175/Z1D4N/', reuseExistingServer: false, timeout: 30_000 },
});
