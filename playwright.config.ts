import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const live = process.env.PORTFOLIO_TEST_URL;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: live || 'http://127.0.0.1:4175/zidvn-portfolio/',
    trace: 'retain-on-failure',
    launchOptions: { executablePath, args: ['--no-sandbox'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'reduced-motion', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' } },
  ],
  webServer: live ? undefined : { command: 'npm run preview -- --port 4175 --strictPort', url: 'http://127.0.0.1:4175/zidvn-portfolio/', reuseExistingServer: false, timeout: 30_000 },
});
