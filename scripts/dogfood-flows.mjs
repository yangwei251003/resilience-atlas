import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const baseUrl = (process.env.QA_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const basePath = new URL(baseUrl).pathname.replace(/\/$/, "");
const sitePath = (pathname) => basePath && pathname.startsWith(`${basePath}/`)
  ? pathname.slice(basePath.length)
  : pathname;
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA
    ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
    : undefined,
].filter(Boolean);
const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));

class FlowAssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "FlowAssertionError";
  }
}

function unique(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function wireDiagnostics(page) {
  const consoleMessages = [];
  const pageErrors = [];
  const httpFailures = [];
  const requestFailures = [];

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      httpFailures.push({ status: response.status(), url: response.url() });
    }
  });
  page.on("requestfailed", (request) => {
    const error = request.failure()?.errorText ?? "request failed";
    // Next.js 会主动取消已经不再需要的链接预取；这不是网络故障。
    if (error === "net::ERR_ABORTED") return;
    requestFailures.push({
      url: request.url(),
      error,
    });
  });

  return {
    snapshot() {
      return {
        console: unique(consoleMessages),
        pageErrors: unique(pageErrors),
        httpFailures: unique(httpFailures),
        requestFailures: unique(requestFailures),
      };
    },
  };
}

function createVerifier(page, checks) {
  async function eventually(label, read, accepts, timeoutMs = 4500) {
    const started = Date.now();
    let lastValue;
    let lastError;

    while (Date.now() - started < timeoutMs) {
      try {
        lastValue = await read();
        if (accepts(lastValue)) {
          checks.push(label);
          return lastValue;
        }
      } catch (error) {
        lastError = error;
      }
      await page.waitForTimeout(60);
    }

    const detail = lastError
      ? lastError instanceof Error
        ? lastError.message
        : String(lastError)
      : JSON.stringify(lastValue);
    throw new FlowAssertionError(`${label}；最后状态：${detail}`);
  }

  return {
    async truth(label, read, timeoutMs) {
      return eventually(label, read, Boolean, timeoutMs);
    },
    async count(label, locator, expected, timeoutMs) {
      return eventually(label, () => locator.count(), (value) => value === expected, timeoutMs);
    },
    async visible(label, locator, timeoutMs) {
      return eventually(
        label,
        async () => (await locator.count()) > 0 && locator.first().isVisible(),
        (value) => value === true,
        timeoutMs,
      );
    },
    async hidden(label, locator, timeoutMs) {
      return eventually(
        label,
        async () => (await locator.count()) === 0 || !(await locator.first().isVisible()),
        (value) => value === true,
        timeoutMs,
      );
    },
    async attribute(label, locator, name, expected, timeoutMs) {
      return eventually(
        label,
        () => locator.getAttribute(name),
        (value) => value === expected,
        timeoutMs,
      );
    },
    async text(label, locator, expected, timeoutMs) {
      return eventually(
        label,
        () => locator.first().textContent(),
        (value) => typeof value === "string" && value.includes(expected),
        timeoutMs,
      );
    },
  };
}

const flows = [
  {
    id: "projects",
    route: "/projects/",
    async run(page, verify) {
      const selectors = page.locator('[aria-label="项目列表"] button');
      await verify.count("项目选择器有四个席位", selectors, 4);
      await verify.attribute("首个项目默认选中", selectors.first(), "aria-pressed", "true");

      const second = selectors.nth(1);
      const secondTitle = (await second.locator("strong").innerText()).trim();
      await second.click();
      await verify.attribute("第二个项目切换为选中", second, "aria-pressed", "true");
      await verify.attribute("第一个项目取消选中", selectors.first(), "aria-pressed", "false");

      const evidence = page.locator("#project-evidence-panel");
      await verify.visible(
        "证据面板显示所选项目",
        evidence.getByRole("heading", { level: 2, name: secondTitle, exact: true }),
      );
      const detailLink = evidence.getByRole("link", { name: /打开完整个案/ });
      await verify.truth("详情链接指向独立项目页", async () => {
        const href = await detailLink.getAttribute("href");
        return typeof href === "string" && /^\/projects\/[^/]+\/?$/.test(sitePath(new URL(href, baseUrl).pathname));
      });

      await Promise.all([
        page.waitForURL((url) => /^\/projects\/[^/]+\/?$/.test(sitePath(url.pathname))),
        detailLink.click(),
      ]);
      await verify.visible(
        "详情页标题与选择项目一致",
        page.getByRole("heading", { level: 1, name: secondTitle, exact: true }),
      );
    },
  },
  {
    id: "honors",
    route: "/honors/",
    async run(page, verify) {
      const cabinets = page.locator('button[aria-expanded][aria-label*="展柜"]');
      const drawers = page.locator('[id^="honor-evidence-"]');
      await verify.count("荣誉馆有三座可操作展柜", cabinets, 3);
      await verify.attribute("首座展柜默认打开", cabinets.first(), "aria-expanded", "true");
      await verify.visible("首座展柜显示证据抽屉", page.locator("#honor-evidence-0"));

      await cabinets.first().click();
      await verify.attribute("点击可关闭首座展柜", cabinets.first(), "aria-expanded", "false");
      await verify.hidden("关闭后证据抽屉移除", drawers, 1800);

      await cabinets.first().click();
      await verify.attribute("点击可重新打开首座展柜", cabinets.first(), "aria-expanded", "true");
      await verify.visible("重新打开后恢复证据抽屉", page.locator("#honor-evidence-0"));

      await cabinets.first().press("ArrowRight");
      await verify.attribute("方向键切换到下一座展柜", cabinets.nth(1), "aria-expanded", "true");
      await verify.truth("方向键切换同时移动键盘焦点", () =>
        cabinets.nth(1).evaluate((element) => document.activeElement === element),
      );
      await verify.visible("下一座展柜显示对应证据", page.locator("#honor-evidence-1"));

      await cabinets.nth(1).press("Escape");
      await verify.attribute("Escape 关闭当前展柜", cabinets.nth(1), "aria-expanded", "false");
      await verify.hidden("Escape 后证据抽屉移除", drawers, 1800);
    },
  },
  {
    id: "about",
    route: "/about/",
    async run(page, verify) {
      const proofButton = page.getByRole("button", { name: /90 秒证据/ });
      const personButton = page.getByRole("button", { name: /完整人格/ });
      const proofPanel = page.locator('section[aria-labelledby="proof-title"]');
      const personPanel = page.locator('section[aria-labelledby="person-title"]');

      await verify.attribute("默认进入 90 秒证据模式", proofButton, "aria-pressed", "true");
      await verify.visible("证据面板默认可见", proofPanel);
      await verify.hidden("完整人格面板默认隐藏", personPanel);

      await personButton.click();
      await verify.attribute("完整人格模式变为选中", personButton, "aria-pressed", "true");
      await verify.attribute("证据模式取消选中", proofButton, "aria-pressed", "false");
      await verify.hidden("证据面板切换后隐藏", proofPanel);
      await verify.visible("完整人格面板切换后可见", personPanel);
      await verify.text("完整人格面板显示人格标题", personPanel, "能力是截面");

      await proofButton.click();
      await verify.attribute("可切回 90 秒证据模式", proofButton, "aria-pressed", "true");
      await verify.visible("切回后证据面板恢复", proofPanel);
    },
  },
  {
    id: "journal",
    route: "/journal/",
    async run(page, verify) {
      const filterGroup = page.getByRole("group", { name: "按文章状态筛选" });
      const allFilter = filterGroup.getByRole("button", { name: /全部/ });
      const sparkFilter = filterGroup.getByRole("button", { name: /火种/ });
      const entryLinks = page.getByRole("link", { name: /进入这段思考/ });

      await verify.attribute("文章列表默认显示全部", allFilter, "aria-pressed", "true");
      await verify.count("全部状态显示三篇文章", entryLinks, 3);

      await sparkFilter.click();
      await verify.attribute("火种筛选变为选中", sparkFilter, "aria-pressed", "true");
      await verify.attribute("全部筛选取消选中", allFilter, "aria-pressed", "false");
      await verify.count("火种筛选只保留一篇文章", entryLinks, 1, 1800);
      await verify.visible(
        "火种文章内容正确",
        page.getByRole("heading", { level: 3, name: "兴趣需要出口", exact: true }),
      );

      await allFilter.click();
      await verify.count("恢复全部文章", entryLinks, 3, 1800);
      await Promise.all([
        page.waitForURL((url) => /^\/journal\/[^/]+\/?$/.test(sitePath(url.pathname))),
        entryLinks.first().click(),
      ]);

      const judgementTab = page.getByRole("tab", { name: /判断/ });
      const nextTab = page.getByRole("tab", { name: /下一步/ });
      const factTab = page.getByRole("tab", { name: /事实/ });
      const panel = page.getByRole("tabpanel");
      await verify.attribute("文章实验默认选择判断", judgementTab, "aria-selected", "true");
      await verify.attribute("选中 tab 是唯一 Tab 停靠点", judgementTab, "tabindex", "0");

      await judgementTab.press("ArrowRight");
      await verify.attribute("右方向键选择下一步", nextTab, "aria-selected", "true");
      await verify.attribute("旧 tab 移出 Tab 顺序", judgementTab, "tabindex", "-1");
      await verify.truth("键盘焦点跟随到下一步 tab", () =>
        nextTab.evaluate((element) => document.activeElement === element),
      );
      await verify.text("tabpanel 同步显示下一步内容", panel, "下一次实验");

      await nextTab.press("Home");
      await verify.attribute("Home 键选择首个事实 tab", factTab, "aria-selected", "true");
      await verify.text("tabpanel 同步显示事实内容", panel, "证据尚未接入");
    },
  },
  {
    id: "videos",
    route: "/videos/",
    async run(page, verify) {
      const programmes = page.locator('[aria-label="节目列表"] button');
      await verify.count("节目单有三个节目", programmes, 3);
      await verify.attribute("首个节目默认选中", programmes.first(), "aria-pressed", "true");
      await verify.truth("初始没有媒体自动播放", () =>
        page.locator("video, audio").evaluateAll((media) => media.every((item) => item.paused)),
      );

      const second = programmes.nth(1);
      const secondTitle = (await second.locator("strong").innerText()).trim();
      await second.click();
      await verify.attribute("第二个节目切换为选中", second, "aria-pressed", "true");
      await verify.text("NOW SCREENING 更新节目标题", page.locator("#now-screening"), secondTitle);

      const chapters = page.locator('aside[aria-labelledby="now-screening"] ol button');
      await verify.count("当前节目有四个章节", chapters, 4);
      await verify.attribute("切换节目后首章选中", chapters.first(), "aria-pressed", "true");
      const secondChapter = chapters.nth(1);
      const secondChapterTitle = (await secondChapter.locator("strong").innerText()).trim();
      await secondChapter.click();
      await verify.attribute("第二章切换为选中", secondChapter, "aria-pressed", "true");
      const chapterReadout = page.getByText("SELECTED CHAPTER", { exact: true }).locator("..");
      await verify.text("章节读数同步更新", chapterReadout, secondChapterTitle);

      await verify.text(
        "片源状态明确说明不会自动播放",
        page.getByRole("status"),
        "默认静音且不自动播放",
      );
      await verify.truth("节目与章节切换后仍没有媒体播放", () =>
        page.locator("video, audio").evaluateAll((media) => media.every((item) => item.paused)),
      );
    },
  },
  {
    id: "photos",
    route: "/photos/",
    async run(page, verify) {
      const frames = page.locator('button[aria-label*="AI 概念样片"]');
      const inspection = page.locator('aside[aria-label="选中样片说明"]');
      await verify.count("接触印样包含六格样片", frames, 6);
      await verify.attribute("第一格样片默认选中", frames.first(), "aria-pressed", "true");

      await frames.nth(2).click();
      await verify.attribute("点击切换到第三格样片", frames.nth(2), "aria-pressed", "true");
      await verify.text("样片检查台同步到第三格", inspection, "FRAME 03");

      const rollGroup = page.locator('[aria-label="故事胶卷"]');
      const rolls = rollGroup.locator("button");
      await verify.count("照片墙有两卷故事胶卷", rolls, 2);
      const secondRoll = rolls.nth(1);
      const secondRollTitle = (await secondRoll.locator("strong").innerText()).trim();
      await secondRoll.click();
      await verify.attribute("第二卷故事胶卷切换为选中", secondRoll, "aria-pressed", "true");
      await verify.attribute("换卷后样片复位到第一格", frames.first(), "aria-pressed", "true");
      await verify.text("检查台同步显示第二卷故事", inspection, secondRollTitle);
      await verify.truth("灯台无障碍说明同步第二卷标题", async () => {
        const label = await page.getByRole("group", { name: /接触印样灯台/ }).getAttribute("aria-label");
        return label?.includes(secondRollTitle);
      });
    },
  },
];

async function runFlow(context, flow) {
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  page.setDefaultNavigationTimeout(15000);
  const diagnostics = wireDiagnostics(page);
  const checks = [];
  const verify = createVerifier(page, checks);
  const started = Date.now();
  let error = null;

  try {
    const response = await page.goto(`${baseUrl}${flow.route}`, { waitUntil: "networkidle" });
    if (!response || response.status() >= 400) {
      throw new FlowAssertionError(
        `页面加载失败：${response ? response.status() : "没有导航响应"}`,
      );
    }
    checks.push("页面加载成功");
    await flow.run(page, verify);
    await page.waitForTimeout(120);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
  }

  const observed = diagnostics.snapshot();
  const compactDiagnostics = Object.fromEntries(
    Object.entries(observed).filter(([, items]) => items.length > 0),
  );
  const consoleErrors = observed.console.filter((message) => message.type === "error");
  if (
    !error &&
    (consoleErrors.length > 0 ||
      observed.pageErrors.length > 0 ||
      observed.httpFailures.length > 0 ||
      observed.requestFailures.length > 0)
  ) {
    error = "流程通过，但检测到控制台错误、页面异常或失败请求";
  }

  await page.close();
  return {
    id: flow.id,
    status: error ? "failed" : "passed",
    checkCount: checks.length,
    ...(error ? { passedChecks: checks, error } : {}),
    diagnostics: compactDiagnostics,
    durationMs: Date.now() - started,
  };
}

if (!chromePath) {
  console.log(
    JSON.stringify(
      {
        status: "failed",
        error: "未找到系统 Chrome；可通过 CHROME_PATH 指定 chrome.exe。",
        candidates: chromeCandidates,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} else {
  let browser;

  try {
    browser = await chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: ["--disable-background-networking"],
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      locale: "zh-CN",
      reducedMotion: "no-preference",
      serviceWorkers: "block",
    });

    const results = [];
    for (const flow of flows) {
      results.push(await runFlow(context, flow));
    }

    await context.close();
    const failed = results.filter((result) => result.status === "failed");
    console.log(
      JSON.stringify(
        {
          status: failed.length === 0 ? "passed" : "failed",
          baseUrl,
          summary: {
            total: results.length,
            passed: results.length - failed.length,
            failed: failed.length,
          },
          flows: results,
        },
        null,
        2,
      ),
    );

    if (failed.length > 0) process.exitCode = 1;
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          status: "failed",
          baseUrl,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } finally {
    await browser?.close();
  }
}
