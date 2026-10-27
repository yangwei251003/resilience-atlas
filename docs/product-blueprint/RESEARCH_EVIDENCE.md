# 研究证据｜个人 AI 作品集与网页版简历

- Blueprint: v1.0
- Last updated: 2026-08-29
- Status: Ready
- Authority: 本文件只记录外部证据、证据强度及其对决定的影响；产品、体验、系统和验收规则仍分别以对应核心蓝图为准。
- Research cutoff: 2026-08-29

## 1. 研究问题与方法

研究聚焦于会改变当前蓝图的四个问题：

1. 多页面个人作品集能否同时保持强烈个性与可维护性。
2. 完全不同的页面视觉是否仍需要稳定的导航与无障碍契约。
3. 静态优先的 Next.js App Router 是否能承接多路由、MDX、SEO 与按页拆包。
4. “最好看”应受哪些可量化性能和可访问性门槛约束。

方法为：案例作者复盘、行业奖项样本、W3C 规范、框架官方文档与 Web 性能官方指导交叉阅读。案例只用于启发方向，规范/官方文档用于建立约束；没有把奖项排名当作用户价值或可用性证明。

## 2. 证据矩阵

| 主张/问题 | 方法 | 来源（检索/复核于 2026-08-29） | 发现 | 置信度 | 对决定的影响 |
|---|---|---|---|---|---|
| 个人网站可以把作者个性变成可发现的标志性交互，同时保留移动端与焦点可用性 | 作者案例复盘 | [Lynn Fisher：2025 portfolio refresh case study](https://lynnandtonic.com/thoughts/entries/case-study-2025-refresh/) | 作者围绕一个响应式发现机制展开该版体验，在小屏回到常规响应式布局，并专门处理跳转入口与焦点样式；复盘也说明长期维护时会把主要精力集中在 landing、work、about | 中高（单案例、第一方复盘） | 支持“每页一个标志性交互 + 明确移动/键盘降级”，并支持先完成 Hero/Projects/About/Honors 的第一批顺序；影响 RISK-001/002/004、ACT-001 至 ACT-004 |
| 行业前沿作品集重视明显的 UI、UX、创新与作品集个性，而不是单一模板同质化 | 行业奖项样本 | [CSS Design Awards：2025 Website of the Year winners](https://www.cssdesignawards.com/blog/2025-website-of-the-year-winners/430/) | 榜单将 Best UI、Best UX、Best Innovation、Best Portfolio 分列，且多件高分作品为品牌/作品集型网站；证明“视觉区分度”是行业评价维度，但不证明其一定更易用 | 中（策展/评奖样本，非用户研究） | 支持七个独立页面世界作为展示目标；同时要求以 WCAG、性能和任务验收校正“炫技”，不能用奖项偏好覆盖 RISK-002/004 |
| 页面外观可以不同，但重复导航应保持同一相对顺序 | 规范解读 | [W3C WCAG 2.2 Understanding SC 3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) | 重复出现的导航机制应保持相同相对顺序；不同视觉布局并不意味着可以随意重排语义导航 | 高（W3C 官方解释） | 冻结全站导航名称、目标与相对顺序；每页可改变表现但不可改变语义契约；直接影响 ACT-001 和最终一致导航 E2E |
| 强交互页面必须满足 WCAG 2.2 AA 的新旧核心要求 | 标准审阅 | [W3C Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) | AA 包含焦点不被完全遮挡、拖拽替代、最小目标尺寸等要求；这些要求会直接影响导航、照片浏览、筛选、媒体与高强度动效设计 | 高（W3C Recommendation） | 将 WCAG 2.2 AA 设为 release blocker；核心动作不得只靠拖拽/悬停/Canvas，必须有 reduced-motion 和键盘/触屏等价路径；影响全部 ACT，重点 ACT-002/007/008 |
| 视觉复杂度需要以可量化的加载、响应和稳定性约束管理 | 官方性能指导 | [web.dev：Web Vitals](https://web.dev/articles/vitals) | 官方“良好”阈值为 LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1，并建议按真实用户第 75 百分位评估 | 高（Google Web 性能官方指导） | 把三项阈值写入系统与最终验收；要求重型交互路由隔离、媒体懒加载、尺寸预留与性能超限升级，缓解 RISK-002 |
| Next.js App Router 可以从静态站开始，为每个路由生成 HTML 并保留以后升级服务器能力的路径 | 框架官方文档 | [Next.js：Static Exports](https://nextjs.org/docs/app/guides/static-exports) | `next build` 可为路由生成静态 HTML；App Router 的 Server Components 可在构建期运行；静态导出不能使用部分服务端功能 | 高（官方、时效性强） | 选择静态优先 App Router；首版不依赖 Server Actions、动态 API、middleware/ISR，动态 slug 必须构建时枚举；构建发现需要服务器时触发停止升级条件 |
| 本地 MDX 可在 App Router/Server Components 中编译，适合长文章而无需先接 CMS | 框架官方文档 | [Next.js：MDX guide](https://nextjs.org/docs/app/guides/mdx) | 官方方案支持本地 Markdown/MDX 与 App Router；MDX 可嵌组件，因此需要配置和组件边界 | 高（官方、时效性强） | Journal 使用本地 MDX，结构化集合继续用 TS；只允许仓库内受信任内容与组件白名单，不使用远程任意 MDX；影响 ACT-006 |
| App Router 原生元数据与文件约定可承接路由级 SEO 和分享素材 | 框架官方文档 | [Next.js：Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) | 静态 metadata、`generateMetadata` 与 favicon/OG/robots/sitemap 等文件约定能随路由组织 SEO 信息 | 高（官方、时效性强） | 每个顶级路由/详情实体生成唯一 metadata；OG 资产进入 Asset Registry，草稿/占位事实不得进入结构化数据；影响 ACT-001/003/006 与 SEO 门禁 |

## 3. 证据到蓝图的决定链

| 证据组合 | 已形成决定 | 权威落点 | 验证方式 |
|---|---|---|---|
| Lynn Fisher + CSSDA | 同一身份下允许多个明显不同的页面世界，但复杂度集中为每页一个标志性交互 | `EXPERIENCE_BLUEPRINT.md`；系统只承接路由隔离 | 各页独立体验验收 + route bundle 报告 |
| W3C 3.2.3 + WCAG 2.2 | 视觉不同不能牺牲导航顺序、焦点、键盘、触屏与等价路径 | `SYSTEM_BLUEPRINT.md` 7/10/11；ACT-001 至 ACT-010 | axe/等价自动检查 + 人工键盘、缩放、触屏、reduced-motion |
| Next Static Exports + Metadata | 静态优先 App Router、按路由生成 HTML、无首版后端、SEO 由路由内容生成 | `SYSTEM_BLUEPRINT.md` 1–4/11–13 | 生产静态 build、未知 slug 404、抓取 HTML、bundle 分析 |
| Next MDX + 本项目内容规模 | TS 管结构化实体，MDX 管长文章；统一构建时校验和 Registry 引用 | `SYSTEM_BLUEPRINT.md` 5；ACT-006/009 | `validate:content`、MDX build、草稿泄露测试 |
| Web Vitals + WCAG | 审美不是豁免条件；性能/可访问性是发布门禁 | `BUILD_AND_ACCEPTANCE.md` 7–9 | Lighthouse/CWV 代理报告、浏览器矩阵、release blocker 扫描 |

## 4. 证据限制与尚不能推出的结论

- CSSDA 与单个作者案例不能证明目标访客一定喜欢某种具体审美；具体页面方向必须以用户已给出的品牌人格及 Experience 蓝图为准。
- 目前没有真实项目、奖状、头像、照片、视频、访问数据或目标设备实测，不能预言最终内容密度、真实 LCP 或哪种互动最受欢迎。
- 没有部署平台和域名，因此不能确定缓存头、CSP、图片优化服务、访问分析或实际 RUM 采集；对应 `OPEN-005`。
- 没有用户批准的公开联系方式和奖状隐私方案，因此不能从案例推导“默认公开”；对应 `OPEN-004`。
- Next.js 文档与浏览器版本会变化。Blueprint 冻结的是能力边界，不是虚构的包版本；VS-01 脚手架与正式发布前各复核一次官方文档并锁定版本。
- Lighthouse 是实验室信号，不等同真实用户数据；上线有足够流量后才用第 75 百分位 CWV 验证真实表现。

## 5. 后续验证计划与停止研究条件

| 时点 | 只验证会改变决定的事项 | 证据 | 停止条件 |
|---|---|---|---|
| VS-01 脚手架 | 当日 Next 静态导出、MDX、Metadata 与测试兼容性 | 官方文档、最小生产 build、lockfile | 静态闭环成功且无服务器依赖后停止框架调研 |
| 首个页面世界完成 | 路由 bundle、LCP/INP/CLS 代理、reduced-motion 与键盘路径 | bundle/Lighthouse/E2E 报告 | 达预算或已定位唯一可执行优化后停止案例搜集 |
| 真实资产接入 | 版权、AI 来源、隐私、尺寸与可公开性 | 用户确认 + Asset Registry | 每个资产达到 final 或保持清晰占位后停止 |
| 发布平台选择 | 静态托管、响应头、缓存、域名、回滚与可选分析 | 候选平台官方资料 | 一个方案满足系统门禁并有可迁移/回滚路径后停止 |
| 上线后优化 | 本人体验反馈优先，其次老师/同学/朋友、招聘者/合作伙伴；观察核心旅程 | 定性反馈 + 合规 RUM（若批准） | 新证据不再改变导航、内容优先级或性能瓶颈时停止本轮优化 |

当前研究已经足以改变并冻结架构、无障碍、性能、内容与分批交付决定；继续浏览更多“好看网站”不会改变首个纵向切片，因此应停止广泛调研并进入 VS-01。
