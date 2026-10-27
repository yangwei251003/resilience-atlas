import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.QA_BASE_URL ?? "http://localhost:3000";
const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const routes = [
  "/",
  "/projects/",
  "/projects/knowledge-atlas/",
  "/honors/",
  "/about/",
  "/journal/",
  "/journal/failure-leaves-a-map/",
  "/videos/",
  "/photos/",
];

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const mobileContextOptions = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  isMobile: true,
  locale: "zh-CN",
  reducedMotion: "no-preference",
};
const context = await browser.newContext(mobileContextOptions);

const report = [];

for (const route of routes) {
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResponses = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

  const layout = await page.evaluate(() => ({
    title: document.title,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    unnamedButtons: [...document.querySelectorAll("button")]
      .filter((button) => !button.getAttribute("aria-label") && !button.getAttribute("aria-labelledby") && !button.textContent?.trim() && !button.title)
      .length,
  }));

  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  report.push({
    route,
    ...layout,
    violations: axe.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        html: node.html,
        failureSummary: node.failureSummary,
      })),
    })),
    consoleErrors: [...new Set(consoleErrors)],
    failedResponses: [...new Set(failedResponses)],
  });
  await page.close();
}

await context.close();
const navigationContext = await browser.newContext(mobileContextOptions);
const navPage = await navigationContext.newPage();
await navPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const portalScene = navPage.getByLabel("世界快速入口").locator("..");
const portalTilt = portalScene.locator(":scope > div").first();
const tiltBefore = await portalTilt.evaluate((element) => getComputedStyle(element).transform);
const portalBounds = await portalScene.boundingBox();
if (portalBounds) {
  await navPage.mouse.move(
    portalBounds.x + portalBounds.width * 0.78,
    portalBounds.y + portalBounds.height * 0.28,
  );
}
await navPage.waitForTimeout(220);
const tiltAfter = await portalTilt.evaluate((element) => getComputedStyle(element).transform);
const homeDepthMotion = Boolean(portalBounds) && tiltBefore !== tiltAfter && tiltAfter !== "none";
const menuButton = navPage.getByRole("button", { name: "打开七界导航" });
await navPage.waitForTimeout(500);
await menuButton.click();
const dialog = navPage.getByRole("dialog", { name: /同一个我/ });
await dialog.waitFor({ state: "visible" });
const dialogVisible = await dialog.isVisible();
const focusInsideDialog = await navPage
  .waitForFunction(() => Boolean(document.activeElement?.closest('[role="dialog"]')), undefined, { timeout: 2000 })
  .then(() => true)
  .catch(() => false);
await navPage.keyboard.press("Escape");
const focusReturned = await menuButton.evaluate((button) => document.activeElement === button);

const navigationErrors = [];
navPage.on("response", (response) => {
  if (response.status() >= 400) navigationErrors.push(`${response.status()} ${response.url()}`);
});
await Promise.all([
  navPage.waitForURL(/\/projects\/?$/),
  navPage.getByRole("link", { name: /自由漫游/ }).click(),
]);

const navigation = {
  homeDepthMotion,
  dialogVisible,
  focusInsideDialog,
  focusReturned,
  reachedProjects: /\/projects\/?$/.test(new URL(navPage.url()).pathname),
  failedResponses: [...new Set(navigationErrors)],
};

await navPage.close();
await navigationContext.close();
await browser.close();

const failures = report.filter((item) =>
  item.horizontalOverflow ||
  item.unnamedButtons > 0 ||
  item.violations.length > 0 ||
  item.consoleErrors.length > 0 ||
  item.failedResponses.length > 0
);

console.log(JSON.stringify({ report, navigation, failedRouteCount: failures.length }, null, 2));

if (
  failures.length > 0 ||
  !navigation.homeDepthMotion ||
  !navigation.dialogVisible ||
  !navigation.focusInsideDialog ||
  !navigation.focusReturned ||
  !navigation.reachedProjects ||
  navigation.failedResponses.length > 0
) {
  process.exitCode = 1;
}
