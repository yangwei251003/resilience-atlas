# 系统蓝图｜个人 AI 作品集与网页版简历

- Blueprint: v1.0
- Last updated: 2026-08-29
- Status: Ready
- Authority: 本文件是系统边界、内容契约、静态运行方式、动作闭环、质量属性与技术约束的唯一权威来源；页面构图、视觉语言和微交互只由 `EXPERIENCE_BLUEPRINT.md` 定义。

## 1. 系统目标与边界

这是一个公开、只读、静态优先的多页面个人网站。首版负责可靠地呈现个人身份、AI 项目、经历、荣誉、文章、视频和照片，并允许访客通过真实可用的站内路径、站外链接与联系方式继续了解作者。

### 1.1 当前系统包含

- Next.js App Router 倾向的静态预渲染网站，默认 TypeScript。
- 首页、项目、关于/简历、荣誉、文章、视频、照片及内容详情路由。
- 本地 TS 数据与本地 MDX 内容；构建时完成解析、交叉引用和真实性状态校验。
- 中央 Asset Registry（素材注册表）与统一 Link Registry（链接注册表）。
- 每个顶级路由独立加载页面专属样式、组件与可选交互代码。
- 站内 404、缺失素材回退、减弱动效、键盘访问、打印简历和基础 SEO。

### 1.2 当前系统明确不包含

- 账号、登录、权限后台、数据库、服务端 API、Server Actions、在线 CMS 或站内上传。
- 评论、点赞、收藏、订阅、支付、UGC、实时功能或通知。
- 会向服务端提交信息的联系表单；联系行为只允许使用经确认的邮箱或真实社交链接。
- 未经决定的分析、广告、追踪 SDK 或第三方 Cookie。
- 为未来需求预建的微服务、数据库抽象层或通用插件系统。

因此首版没有可被虚构的后端闭环：所有用户动作要么是 `local-only`，要么是浏览器对一条经过校验的真实 URL/协议发起导航。若未来增加表单、后台、分析或 CMS，必须重开系统边界与隐私验收，不能在当前实现中暗埋接口。

## 2. 架构原则

1. **静态优先**：公开内容在构建时生成 HTML；动态参数在构建时枚举，未知 slug 返回真实 404。
2. **Server Components 默认**：内容读取、列表生成和元数据生成留在服务端构建阶段；只有确需浏览器状态的交互岛使用 Client Component。
3. **内容与表现分离**：内容实体不知道页面视觉实现；页面只通过类型化查询读取内容。
4. **同一内容契约，多个路由世界**：导航与实体规则统一，顶级页面的专属样式和交互按路由隔离。
5. **渐进增强**：禁用 JavaScript、减弱动效、触屏、键盘或低性能设备仍能访问全部核心内容和链接。
6. **真实性先于装饰**：占位、AI 生成和最终素材有机器可检验的状态；不能用假按钮、`#` 链接或虚构外链制造“完成感”。
7. **不提前发明平台**：部署商、域名、CMS 与访问分析仍属 `OPEN-005`；实现保持静态托管可迁移。

## 3. 客户端、存储、第三方与信任边界

| 层 | 选择 | 运行位置 | 信任边界与约束 |
|---|---|---|---|
| 页面框架 | Next.js App Router + TypeScript 倾向 | 构建机与浏览器 | 锁定具体版本前必须以脚手架当日官方文档和 lockfile 为准 |
| 渲染 | 静态生成/静态导出优先 | 构建机 | 首版不得依赖请求时服务器能力；动态路由必须有静态参数集合 |
| 内容 | `content/**/*.ts` 与 `content/journal/**/*.mdx` | Git 工作树、构建机 | 仅加载仓库内受信任内容；不执行远程或用户提供的任意 MDX |
| 素材 | `public/media/**` + Asset Registry | 静态托管与浏览器 | 页面不得绕过 Registry 直接引用业务素材；公开前检查隐私和版权元数据 |
| 样式 | 共享基础层 + 路由级 CSS Modules/CSS 自定义属性 | 构建产物与浏览器 | 页面世界样式不能进入全局命名空间污染其他路由 |
| 交互 | 路由内 Client Components；重型依赖按需动态导入 | 浏览器 | 核心阅读和导航不可依赖 Canvas、悬停、拖拽或动画完成 |
| 第三方 | 首版默认无运行时第三方 | — | 真实视频托管、分析或外嵌服务接入前须补充隐私、性能和失败回退验收 |

## 4. 路由与代码所有权

### 4.1 公开路由

| 路由 | 内容来源 | 生成方式 | 路由级边界 |
|---|---|---|---|
| `/` | Profile、精选 Project、全站导航 | 静态 | 首页世界只加载首页专属模块 |
| `/projects` | Project 集合 | 静态 | 项目世界专属样式、筛选状态和组件 |
| `/projects/[slug]` | 单个 Project | `generateStaticParams` + 静态 | 详情模板共享，不加载其他页面世界交互 |
| `/about` | Profile、Education、Experience、Contact | 静态 | 网页阅读和打印路径使用同一事实源 |
| `/honors` | Honor 集合 | 静态 | 证据素材仍由 Asset Registry 提供 |
| `/journal` | JournalEntry 元数据 | 静态 | 文章索引与正文代码分离 |
| `/journal/[slug]` | 本地 MDX | `generateStaticParams` + 静态 | 仅允许白名单 MDX 组件 |
| `/videos` | Video 集合 | 静态 | 播放能力作为按需交互岛；无视频时仍为完整页面状态 |
| `/photos` | Photo/Album 集合 | 静态 | 图片浏览交互按需加载；语义内容在 HTML 中存在 |
| 未知路由/slug | 404 文案与返回路径 | 静态 | 不重定向到首页掩盖错误 |

最终 URL 命名以 `PRODUCT_BLUEPRINT.md` 的信息架构为准；本表规定的是系统承接方式。若产品蓝图改变路由名，只允许更新一个路由清单和对应测试，不能在组件内散落字符串。

### 4.2 推荐目录边界

```text
src/
  app/                     # 路由、布局、元数据与静态参数
  components/primitives/   # 无页面世界偏见的语义基础组件
  features/
    hero/
    projects/
    about/
    honors/
    journal/
    videos/
    photos/                # 每个世界拥有自己的样式、组件和客户端入口
  content/
    profile.ts
    projects.ts
    honors.ts
    videos.ts
    photos.ts
    assets.ts
    links.ts
    journal/*.mdx
  lib/content/             # 类型、构建时校验、查询和元数据映射
public/media/              # 只存 Registry 已登记的公开素材
```

禁止创建一个导出全部页面世界的总 barrel；禁止在根布局导入重型动画、3D、视频播放器或照片墙逻辑。共享层只允许语义基础组件、全站导航契约、基础 tokens、内容查询和无障碍工具。页面世界在其路由内拥有样式与交互，使用 `next/dynamic` 或等效边界延迟非首屏重型代码。

## 5. 统一内容语言与 Schema

### 5.1 基础类型

| 类型 | 必填字段 | 规则 |
|---|---|---|
| `ContentBase` | `id`, `slug`, `title`, `summary`, `status`, `updatedAt` | `id` 与 `slug` 全局/集合内唯一；公开排序稳定；日期为 ISO 8601 |
| `Profile` | `displayName`, `headline`, `bio`, `avatarAssetId`, `contactLinkIds` | 未提供真实信息时使用显式占位文案，不虚构学校、经历或联系方式 |
| `Project` | `kind`, `summary`, `tags`, `featured`, `assetIds`, `linkIds` | 项目事实、技术、角色和结果不可由装饰性占位推断；精选项目顺序显式配置 |
| `Honor` | `issuer`, `awardedAt`, `evidenceAssetIds`, `privacy` | 证书/奖状缺失时显示未完成证据状态，不伪造编号、名次或颁发方 |
| `Education` / `Experience` | `organization`, `period`, `description`, `evidenceState` | 时间线数据来自同一 Profile 内容源；打印与网页不得各写一份 |
| `JournalEntry` | MDX front matter: `slug`, `title`, `excerpt`, `publishedAt`, `tags`, `coverAssetId`, `status` | 正文为本地 MDX；草稿不进入公开静态参数、sitemap 或 RSS（若后续添加） |
| `Video` | `title`, `summary`, `posterAssetId`, `sourceLinkId` 或 `mediaAssetId`, `captionAssetId`/`transcript` | 没有可播放源时不得渲染播放按钮；发布视频必须有字幕或等价文字稿 |
| `Photo` / `Album` | `assetId`, `caption`, `takenAt`, `albumId`, `privacy` | 公开前确认人物隐私、地点信息和替代文本；布局不改变内容顺序 |

`status` 用于内容发布生命周期，最低集合为 `draft | published`。真实性/素材就绪状态不能借用 `published` 表达，必须使用下述 Asset/Link Registry 字段。

### 5.2 Asset Registry

每张图片、头像、品牌/IP 视觉、证书、视频、视频封面、字幕文件和可下载简历都必须先注册，再以 `assetId` 引用。

| 字段 | 类型/示例 | 不变量 |
|---|---|---|
| `id` | 稳定字符串 | 全局唯一；替换文件不改变业务引用 ID |
| `kind` | `image | video | audio | document | caption` | 与文件 MIME/扩展名一致 |
| `src` | `/media/...` | 只允许已知本地公开路径或经批准的可静态获取源；路径必须存在 |
| `state` | `placeholder | ai-generated | final` | 必填；决定 UI 披露和发布校验 |
| `provenance` | `user | ai | third-party | unknown` | `final` 不抹去来源；AI 资产即使被批准为 final 也保留 `ai` 来源 |
| `disclosure` | 面向访客的短文案 | `placeholder` 和 `ai-generated` 必填；`provenance=ai` 的 final 也必填 |
| `alt` | 替代文本或空串 | 信息性素材必须有有意义文本；纯装饰可为空并标 `decorative: true` |
| `width`, `height` | 正整数 | 图片/视频必须提供，避免布局偏移 |
| `posterAssetId` | 可选 Asset ID | 视频引用的视频封面必须存在且类型正确 |
| `credit`, `license` | 可选/条件必填 | 第三方素材必须填写；不明版权不能变为 final |
| `privacy` | `public | review-required | redacted` | `review-required` 不得进入生产构建；奖状支持遮挡版 final 资产 |
| `updatedAt` | ISO 日期 | 用于资产替换清单和审计 |

状态迁移：

```text
placeholder ──> ai-generated ──> final
      └────────────────────────> final
ai-generated ──> placeholder（拒绝并回退）
final ──> final（经审核替换）
```

- 状态不得由文件名、目录或 UI 猜测，只能显式更新 Registry。
- `placeholder` 必须呈现“占位素材·待替换”；`ai-generated` 必须呈现“AI 生成示意”。
- `final` 表示用户已批准公开，不等于“非 AI”；`provenance=ai` 时披露仍保留。
- 替换状态不得改变布局契约、业务 ID、alt 责任或引用关系。

### 5.3 Link Registry 与“无假链接”规则

所有项目演示、源码、社交账号、邮箱、视频来源、下载和外部文章使用 `linkId` 引用。

| 字段 | 规则 |
|---|---|
| `id`, `label`, `kind` | `kind` 为 `internal | external | contact | download`；label 必须描述目的 |
| `availability` | 只允许 `active | unavailable` |
| `href` | `active` 必填；`unavailable` 禁止填写并渲染为非交互状态 |
| `verifiedAt` | `active` 外链在发布前必填；构建/链接检查记录最近验证日期 |
| `rel` | 新窗口外链至少 `noopener noreferrer`；除非体验蓝图明确，否则不强制新窗口 |

构建必须拒绝：空字符串、`#`、`javascript:`、未替换的 `example.com`、指向不存在内部路由的 href、显示为按钮却没有动作的元素。尚未提供的作品链接使用 `availability: unavailable`，页面可以说明“链接待补充”，但不能渲染为 `<a>`。

### 5.4 构建时内容校验

脚手架完成后建立单一 `validate-content` 入口并在 `build` 前执行，至少检查：

- Schema、枚举、必填字段、唯一 ID/slug、日期格式与排序稳定性。
- 所有 Asset/Link/关联实体引用存在，类型相容，无循环或孤儿引用。
- Registry 路径真实存在；媒体尺寸、alt、字幕、披露、来源、版权与隐私规则满足条件。
- `published` 内容不引用 `privacy: review-required` 素材。
- `active` 链接协议合法，内部链接有路由，外链无明显占位域名。
- 静态参数、sitemap、页面元数据只包含公开实体；草稿和未授权真实资料不泄露到构建产物。

## 6. 角色与权限

首版没有登录或个性化身份，因而不创建身份契约或权限数据库。

| 角色 | 资源 | 动作 | 约束 | 拒绝/失败反馈 | 审计证据 |
|---|---|---|---|---|---|
| 公开访客 | 已发布页面与公开素材 | 浏览、筛选、本地播放、打印、导航 | 只读；无需账号；核心内容可键盘/触屏访问 | 404、非交互“待补充”、媒体回退 | 自动测试、静态链接报告 |
| 网站作者/维护者 | 仓库内内容与 Registry | 新增、替换、发布 | 通过 Git 和构建校验；隐私资料需本人批准 | 构建失败并定位实体/字段 | Git 历史、构建日志 |
| 构建/部署流程 | 公开内容集合 | 校验、预渲染、输出 | 不持有业务数据库或用户秘密 | 非零退出，不发布旧/坏产物 | CI 日志与制品摘要 |

## 7. 状态机与不变量

| 实体 | 状态 | 允许迁移 | 不变量 |
|---|---|---|---|
| 内容实体 | `draft -> published -> draft` | 作者显式切换 | draft 不出现在公开路由、sitemap 或结构化数据；重新草稿化不删除源文件 |
| 素材 | 见 Asset Registry | 见 5.2 | 公开、来源、披露、alt、尺寸和隐私规则同时成立才能成为可发布 final |
| 链接 | `unavailable <-> active` | 作者显式切换并验证 | unavailable 永不产生可点击控件；active 始终有合法 href |
| 路由交互 | `idle -> active -> completed/failed -> idle` | 浏览器本地 | 失败不阻塞内容阅读；刷新或返回可恢复；无关键数据写入 |

全局不变量：

- 姓名、学校、经历、项目结果、荣誉、联系方式和证据不能被占位文案表达为真实事实。
- 任何顶级页面的视觉差异都不能改变全站导航项目的相对顺序、页面语义名称或基础键盘规则。
- 核心信息不得只存在于图片、Canvas、视频、悬停状态或动画结束态。
- 同一事实只在一个内容实体中维护；首页精选、时间线、打印简历和元数据均为查询/投影。
- 页面世界代码不得通过全局副作用改变其他路由的 `body` 样式、滚动、焦点或事件监听；卸载时必须清理。

## 8. ACT 动作闭环

所有动作均为无账号、只读场景。`local-only` 表示浏览器本地导航/状态变化，不对应伪造 API。

| ID | 用户动作与结果 | 权限 | 状态/数据 | API/事件 | 失败与恢复 | 监控/测试 |
|---|---|---|---|---|---|---|
| ACT-001 | 从首页识别作者并进入任一顶级展区 | 公开 | 读取 Profile 与 route manifest | `local-only` 站内导航 | JS 失效仍为普通链接；未知路径进入 404 并可返回 | 导航 E2E、键盘顺序、无 JS 冒烟 |
| ACT-002 | 浏览、筛选并定位一个项目 | 公开 | 读取 Project 集合；筛选状态可留在 URL 或本地 | `local-only` | 空筛选提供清除动作；内容仍可线性阅读 | 查询单测、筛选集成、移动端 E2E |
| ACT-003 | 打开项目详情并按真实链接查看演示/源码 | 公开 | 读取 Project、Asset、Link | 站内静态导航或已验证外链 | unavailable 非点击；失效外链发布检查报错；返回路径保留 | 链接检查、详情 E2E、披露断言 |
| ACT-004 | 阅读个人经历并打印/保存网页简历 | 公开 | 读取 Profile/Education/Experience | `local-only` + 浏览器打印 | 缺真实信息显示占位状态；打印版无导航遮挡、无截断关键信息 | 打印 CSS 截图/人工 PDF 检查、语义审计 |
| ACT-005 | 浏览荣誉并辨识证据真实性/隐私状态 | 公开 | 读取 Honor 与 Asset Registry | `local-only` | 缺证据显示待替换；隐私待审核素材构建失败 | 内容校验、荣誉页 E2E、放大/键盘检查 |
| ACT-006 | 浏览文章目录并完整阅读一篇文章 | 公开 | 读取 Journal 元数据与本地 MDX | 静态路由 | 未知 slug 404；不支持的 MDX 组件构建失败 | MDX 构建、目录/正文 E2E、阅读语义审计 |
| ACT-007 | 浏览并播放一段视频，或阅读等价文字 | 公开 | 读取 Video、poster、caption/transcript | `local-only` 媒体事件；真实外源才离站 | 无源则无播放按钮；播放失败保留封面、说明和文字稿 | 媒体状态集成、字幕/文字稿断言、触屏 E2E |
| ACT-008 | 浏览照片/相册并读取说明 | 公开 | 读取 Photo/Album/Asset | `local-only` | 图片失败显示稳定比例回退与说明；关闭增强浏览回到触发点 | 图片错误测试、键盘/触屏 E2E、隐私校验 |
| ACT-009 | 在所有页面正确识别占位、AI 生成与最终素材 | 公开 | 读取 Asset `state/provenance/disclosure` | `local-only` | 未知状态构建失败；披露缺失构建失败 | Registry 单测、全路由披露扫描 |
| ACT-010 | 使用真实联系方式或外部身份继续联系/了解 | 公开 | 读取 Link Registry | `mailto:`/`https:` 等已验证导航 | 未提供时显示非交互说明；不得提交站内表单 | 协议/链接检查、可访问名称 E2E |

`BUILD_AND_ACCEPTANCE.md` 负责跟踪这些 ACT 从 Planned 到 Verified 的实现证据，不在该文件重新定义规则。

## 9. 错误、恢复与降级

| 情况 | 系统行为 | 禁止行为 |
|---|---|---|
| 未知路由/slug | 返回有明确标题、首页与相关展区入口的 404；HTTP/静态托管语义尽量保留 | 静默跳首页、空白页 |
| Registry 缺引用/路径 | 构建失败，输出实体 ID、字段和缺失目标 | 发布后才依靠 `onError` 掩盖 |
| 图片运行时加载失败 | 保留预定尺寸，显示替代说明和素材状态 | 布局塌陷、无限重试 |
| 视频失败/不支持 | 保留 poster、标题、文字稿和真实离站来源（如有） | 自动切换到未披露追踪型 iframe |
| 动画/脚本失败 | 立即呈现最终静态状态；导航与正文不受影响 | 锁滚动、隐藏正文、要求刷新才能继续 |
| 过滤无结果 | 显示当前条件与清除筛选操作 | 伪装成“暂无所有内容” |
| 外链暂缺 | 呈现非交互“待补充”状态 | `href="#"`、空 href、假域名 |
| 减弱动效 | 取消非必要位移、视差、惯性和自动播放；状态变化即时可见 | 仅把时长减短但保留诱发不适的位移 |

## 10. 隐私、安全与内容可信度

- `OPEN-004` 生效：真实邮箱、电话、社交账号、校名/学号、奖状编号、人脸和精确地点接入前由用户确认公开级别；默认只使用占位信息和示意素材。
- 不把秘密、私钥、部署 token 或未公开个人资料写入 `NEXT_PUBLIC_*`、MDX、Registry 或静态产物。
- 只编译仓库内受信任 MDX；组件白名单不得暴露任意脚本、原始 HTML 注入或远程代码执行。
- 不使用 `dangerouslySetInnerHTML` 渲染未验证内容；外部嵌入接入前必须有域名白名单、隐私说明、懒加载与静态回退。
- 下载文件必须在 Registry 中登记 MIME、显示名称、文件大小与状态，禁止未知附件。
- 上线前执行依赖漏洞检查、静态链接检查和公开制品抽查；无后端不等于无供应链与隐私风险。
- CSP、缓存头和安全响应头在部署平台确定后配置；在此之前不得为满足检查而虚构服务端中间件。缺少这些头不会阻塞本地纵向切片，但会阻塞公开发布。

## 11. 非功能约束

### 11.1 可访问性

- 发布门槛为 WCAG 2.2 AA：键盘可达、焦点可见且不被遮挡、语义标题/地标、对比度、回流、触控目标、替代文本、字幕/文字稿和一致导航。
- 所有核心动作有非拖拽、非悬停、非 Canvas 的等价路径；页面切换/增强交互后焦点位置可预测。
- 全站提供跳过重复内容入口；顶级导航项目相对顺序一致，即使外观完全不同。
- `prefers-reduced-motion` 是必须实现的系统状态，不是视觉优化项。

### 11.2 性能与可靠性

- 目标 Core Web Vitals（真实流量可用后按第 75 百分位）：LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1。
- 在移动端生产构建的 Lighthouse 基准环境中，每个公开路由 Performance ≥ 90，Accessibility/Best Practices/SEO ≥ 95；单次偶然波动须复测三次取中位数。
- 路由专属客户端 JavaScript gzip 目标 ≤ 80 KiB，整条首屏所需客户端 JavaScript gzip 目标 ≤ 180 KiB；超过任一目标必须记录来源、用户价值和更轻方案对比，未获批准不得发布。
- 首屏 LCP 图片目标传输体积 ≤ 300 KiB；非首屏图片响应式、懒加载并保留尺寸。视频不作为移动端自动下载的首屏背景。
- 不依赖运行时 API 即可完成生产构建；断网打开已加载页面时不承诺 PWA，但脚本/第三方失败不破坏已到达页面。

### 11.3 SEO 与分享

- 每个公开路由有唯一 title、description、canonical、可索引语义内容和正确 `lang="zh-CN"`；详情页由内容实体生成元数据。
- 生成 sitemap、robots、favicon 与 OG/Twitter 分享图；占位和 AI 生成分享图遵守同一披露规则。
- 仅为真实已发布实体输出 Person、CreativeWork/Article 等结构化数据；不得把占位项目、待核实荣誉或虚构外链写入结构化数据。
- 标题层级、正文文本和链接目的不依赖客户端渲染，静态 HTML 可被抓取。

### 11.4 浏览器与响应式

- 验收矩阵：当前及前一个主要版本的 Chrome、Edge、Firefox、Safari；至少覆盖 Windows 桌面、macOS Safari、iOS Safari 和 Android Chrome 的代表性视口。
- 基准宽度：360、390、768、1024、1440 CSS px；也测试 200% 浏览器缩放和 320 CSS px 回流。
- 非 Chromium 浏览器不要求像素完全一致，但内容、导航、状态、焦点、媒体回退和主要视觉层级必须等价。

## 12. 技术决定与真实备选

### 12.1 主方案

- Next.js App Router + TypeScript。
- 默认静态导出能力（`output: 'export'` 或脚手架版本的等价官方能力）；动态内容路由通过静态参数生成。
- TS 内容用于结构化集合，MDX 只用于长文章/长叙事；构建时统一校验并映射为领域实体。
- CSS Modules + CSS 自定义属性隔离页面世界；CSS/WAAPI 优先，重型动画库只有在已批准标志性交互确有需要时按路由动态加载。
- 框架版本、包管理器与测试工具在脚手架创建时写入 lockfile；不得在蓝图中伪造尚未存在的版本号或命令。

选择理由：它同时提供多路由静态 HTML、元数据、类型化组件、路由级代码拆分和局部高交互能力；对于七个独立页面世界，比单页 SPA 更利于 SEO、深链与按页加载。

### 12.2 备选：Astro + TypeScript/React islands

Astro 的静态输出和岛屿模型可能带来更低客户端开销；若实现阶段证明所有页面只需极少 React 交互，可在脚手架前重开。当前不选的原因是本项目明确要持续扩展多个强交互页面世界，Next App Router 能以统一路由/元数据/React 生态降低长期分叉。重开条件：首个切片性能预算无法在 Next 主方案内达成，且分析显示框架运行时代码是主要原因。

### 12.3 禁用/受限能力

- 不使用需要请求时服务器的 middleware、动态 Route Handler、Server Action、ISR 或默认在线图片优化服务作为首版核心依赖。
- 不在根布局初始化 GSAP/Three.js/视频播放器等页面专属运行时。
- 不接远程 CMS/MDX、数据库或第三方媒体 API 来填补当前占位内容。

## 13. 部署与运维

- 构建产物必须可部署到任一标准静态主机；生产发布过程至少包含 install（锁定依赖）、typecheck、lint、内容校验、测试、生产 build、链接检查和制品抽查。
- 域名、平台、缓存策略、响应头、预览环境和访问分析在 `OPEN-005` 决定；选型不能改变内容 schema 或路由体验契约。
- 发布使用不可变构建制品；失败不覆盖当前线上版本。回滚为重新发布上一份已验证制品，而不是运行数据迁移。
- 当前无运行时业务日志。实现阶段保留构建日志、测试报告、bundle 报告和 Lighthouse 报告；真实访问监控仅在用户选择合规分析方案后加入。

## 14. 系统 Ready 判定

- 无账号、数据写入、第三方异步或后端动作需要实现 Agent 猜测。
- ACT-001 至 ACT-010 均有数据来源、失败恢复与验证入口。
- `OPEN-004` 有安全默认：真实隐私资料接入前继续使用显式占位，不阻塞完整页面开发。
- `OPEN-005` 只影响最终发布配置，不阻塞静态纵向切片；公开发布前必须关闭平台相关门禁。
- 若实现发现必须引入服务端能力、远程内容、追踪或未登记链接，立即停止该扩展并回写蓝图，不在代码中静默改变系统边界。
