import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import certificates from "../src/content/certifications.json" with { type: "json" };
import links from "../src/content/links.json" with { type: "json" };
import profile from "../src/content/profile.json" with { type: "json" };
import { mkdirSync } from "node:fs";

test("certificates have their own section, render inline and offer viewing controls only", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#certifications");
  const section = page.locator("#certifications");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Certifications.");
  await expect(section.locator(".certificate-preview")).toHaveCount(certificates.documents.length);
  await expect(section.locator(".training-item, .certification-card")).toHaveCount(0);
  await expect(section.locator("a")).toHaveCount(0);
  for (const certificate of certificates.documents) {
    const preview = page.locator(`#${certificate.id}`);
    await preview.scrollIntoViewIfNeeded();
    await expect(preview.getByText("View only", { exact: true })).toBeVisible();
    const sheet = preview.locator(".cv-page").first();
    await expect(sheet).toHaveAttribute("data-rendered", "true", { timeout: 20000 });
    if (certificate.kind === "image") {
      await expect.poll(() => sheet.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    } else {
      await expect(sheet.locator(".cv-text-layer")).toContainText("81/100");
      const painted = await sheet.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
        const pixels = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
        let ink = 0;
        for (let i = 0; i < pixels.length; i += 4) if (pixels[i + 3] && pixels[i] < 180 && pixels[i + 1] < 180) ink++;
        return ink > 500;
      });
      expect(painted).toBe(true);
    }
    const width = await sheet.evaluate((element) => element.clientWidth);
    await preview.getByRole("button", { name: `Zoom in ${certificate.label}`, exact: true }).click();
    await expect(preview.locator(".cv-page-count")).toContainText("125%");
    await expect(sheet).toHaveAttribute("data-rendered", "true");
    expect(await sheet.evaluate((element) => element.clientWidth)).toBeGreaterThan(width);
    await preview.getByRole("button", { name: "Fit to width", exact: true }).click();
    await expect(preview.locator(".cv-page-count")).toContainText("100%");
    await expect(sheet).toHaveAttribute("data-rendered", "true");
    expect(await sheet.evaluate((element) => element.clientWidth)).toBe(width);
    await expect(preview.getByRole("button", { name: `Zoom out ${certificate.label}`, exact: true })).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const result = await new AxeBuilder({ page }).include("#certifications").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("certificate error state stays view only", async ({ page }) => {
  await page.route("**/certificates/Abdulrahman-Zidan-EF-SET-C2.pdf", (route) => route.fulfill({ status: 404, body: "Not found" }));
  await page.goto("./#english-certificate");
  const preview = page.locator("#english-certificate");
  await expect(preview.getByRole("alert")).toContainText("Please refresh the page", { timeout: 20000 });
  await expect(preview.locator("a")).toHaveCount(0);
  await expect(preview.getByRole("button", { name: "Zoom in English certificate", exact: true })).toBeDisabled();
});

test("website links use the supplied destinations and website names only", async ({ page }) => {
  await page.goto("./#links");
  const section = page.locator("#links");
  const expected = [{ id: "github", name: "GitHub", url: profile.github }, ...links];
  await expect(section.locator(".profile-link-card")).toHaveCount(expected.length);
  for (const link of expected) {
    const card = section.getByRole("link", { name: link.name, exact: true });
    await expect(card).toHaveText(link.name);
    await expect(card).toHaveAttribute("href", link.url);
    await expect(card).toHaveAttribute("target", "_blank");
    await expect(card).toHaveAttribute("rel", "noopener noreferrer");
    await card.focus();
    await expect(card).toBeFocused();
  }
  const result = await new AxeBuilder({ page }).include("#links").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("document rendering obeys CSP and inline script injection is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      const prior = JSON.parse(document.documentElement.dataset.policyViolations || "[]") as string[];
      prior.push(`${event.effectiveDirective}:${event.blockedURI}`);
      document.documentElement.dataset.policyViolations = JSON.stringify(prior);
    });
  });
  await page.goto("./#english-certificate");
  await expect(page.locator("#english-certificate .cv-page")).toHaveAttribute("data-rendered", "true", { timeout: 20000 });
  const policy = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
  expect(policy).toContain("script-src 'self'");
  expect(policy).toContain("object-src 'none'");
  expect(policy).toContain("base-uri 'self'");
  await expect(page.locator("html")).not.toHaveAttribute("data-policy-violations");
  const external = await page.locator('a[target="_blank"]').evaluateAll((anchors) => anchors.map((anchor) => {
    const link = anchor as HTMLAnchorElement;
    const url = new URL(link.href);
    return { external: url.origin !== location.origin, protocol: url.protocol, opener: link.relList.contains("noopener"), referrer: link.relList.contains("noreferrer") };
  }));
  expect(external.length).toBeGreaterThan(0);
  for (const link of external) {
    expect(link.opener).toBe(true);
    expect(link.referrer).toBe(true);
    if (link.external) expect(link.protocol).toBe("https:");
  }
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = 'document.documentElement.dataset.injectedScript = "executed"';
    document.body.append(script);
    script.remove();
  });
  await expect(page.locator("html")).not.toHaveAttribute("data-injected-script");
  await expect(page.locator("html")).toHaveAttribute("data-policy-violations", /script-src(?:-elem)?:inline/);
});

test("certificate and link layouts fit narrow phones, tablets and desktop; capture QA images", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One responsive sweep covers all five widths.");
  test.setTimeout(90000);
  mkdirSync("qa-results", { recursive: true });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1200 : width >= 1024 ? 1000 : 900 });
    await page.goto("./#certifications");
    for (const certificate of certificates.documents) {
      const preview = page.locator(`#${certificate.id}`);
      await preview.scrollIntoViewIfNeeded();
      await expect(preview.locator(".cv-page")).toHaveAttribute("data-rendered", "true", { timeout: 20000 });
      expect(await preview.locator(".cv-viewport").evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Body overflow at ${width}px`).toBe(true);
    const columns = await page.locator(".certificate-gallery").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(width > 860 ? 2 : 1);
    if (width === 1440) {
      await page.locator("#certifications").evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 100, behavior: "instant" }));
      await expect(page.locator('#certifications .cv-page[data-rendered="true"]')).toHaveCount(certificates.documents.length);
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await page.screenshot({ path: "qa-results/certifications-1440.png", animations: "disabled" });
    } else if ([390, 768].includes(width)) {
      for (const certificate of certificates.documents) {
        const preview = page.locator(`#${certificate.id}`);
        await preview.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
        await expect(preview.locator(".cv-page")).toHaveAttribute("data-rendered", "true");
        await preview.screenshot({ path: `qa-results/certifications-${width}-${certificate.id}.png`, animations: "disabled" });
      }
    }
    await page.locator("#links").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Link overflow at ${width}px`).toBe(true);
    if ([390, 768, 1440].includes(width)) await page.locator("#links").screenshot({ path: `qa-results/links-${width}.png`, animations: "disabled" });
  }
});

test("legacy credentials bookmarks resolve to the dedicated certificate section", async ({ page }) => {
  await page.goto("./#credentials");
  await expect(page.locator("#certifications")).toBeVisible();
  await expect(page.locator("#credentials")).toHaveCount(1);
  expect(await page.locator("#credentials").evaluate((element) => element.closest("section")?.id)).toBe("certifications");
});
