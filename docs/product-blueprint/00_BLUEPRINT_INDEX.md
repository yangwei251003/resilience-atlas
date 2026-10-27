# 百折万象 · Blueprint Index

- **Blueprint version:** 1.1
- **Last updated:** 2026-08-29
- **Status:** Implemented · QA Passed · Content Pending
- **Mode:** Greenfield / Deep / Visual-First
- **Current frontier:** 七界 V1 完成；进入真实内容与资产替换
- **Authority:** 本文件只负责蓝图导航、状态、门禁摘要与开发入口，不复制权威正文。

## 开发 Agent 阅读顺序

1. `00_BLUEPRINT_INDEX.md`
2. `BUILD_AND_ACCEPTANCE.md` 的 VS-01、ACT 追踪与停止升级条件
3. `PRODUCT_BLUEPRINT.md` 的产品结果、两批范围与 ACT-001 至 ACT-010
4. `EXPERIENCE_BLUEPRINT.md` 的 Brand DNA、Hero Portal、AI Lab、响应式与降级契约
5. `SYSTEM_BLUEPRINT.md` 的内容模型、Asset/Link Registry、路由边界与构建校验
6. `DECISIONS.md` 的 Approved 决定；实现不得静默重开
7. 与当前切片直接相关的条件模块

## 权威来源

| 主题 | 唯一权威文档 | 状态 | 依赖/备注 |
|---|---|---|---|
| 当前事实、风险、未决项、frontier | `PROJECT_STATE.md` | Ready | 每轮更新 |
| 产品结果、范围、旅程与业务动作 | `PRODUCT_BLUEPRINT.md` | Ready / Approved | ACT-001 至 ACT-010 是业务动作源 |
| 页面世界、视觉、交互与无障碍 | `EXPERIENCE_BLUEPRINT.md` | Ready / Approved | 七界差异与降级契约 |
| 系统、内容引用、Registry 与技术边界 | `SYSTEM_BLUEPRINT.md` | Ready | 与 Product 的 ACT 编号同号闭环 |
| 纵向切片、测试、门禁与交接 | `BUILD_AND_ACCEPTANCE.md` | Ready | VS-01 是开发入口 |

## 条件模块

| 模块 | 触发原因 | 状态 | 权威范围 |
|---|---|---|---|
| `DECISIONS.md` | 已产生跨产品、视觉、系统与交付的高影响决定 | Approved | 批准决定、理由与重开条件 |
| `RESEARCH_EVIDENCE.md` | 外部案例和官方规范改变了导航、平台、性能与无障碍决定 | Ready | 来源、日期、证据强度与决定影响 |
| `VISUAL_EXPLORATION.md` | 需要比较并收敛真正不同的视觉方向 | Approved | 三方向取舍与最终 `百折万象 / RESILIENCE ATLAS` 艺术指导 |
| `CONTENT_AND_COPY.md` | 结构化内容、SEO、真实性披露和长期替换需要独立契约 | Approved | 内容模型、来源状态、品牌语言与文案规则 |
| `MOTION_AND_REFERENCE_RESEARCH.md` | 用户要求扩大动效与参考调研，并禁止因移动端/静态部署削弱体验 | Approved | 16 个案例机制库、七界标志性交互、Motion + CSS 2.5D 技术决议 |

## Ready 摘要

- **Blocking:** 无；代码与交互 V1 已交付。
- **Conditional:** `OPEN-004` 联系方式公开级别与真实奖状隐私；开发期使用显式占位，不阻塞页面完成，接入真实资料前必须关闭。
- **Later:** `OPEN-005` 域名、部署平台、CMS 与分析方案；不阻塞静态开发，公开发布前处理平台门禁。
- **纵向切片:** VS-01 与全部七界均已实现，18 个静态路由构建通过。
- **批次承诺:** Batch 1 与 Batch 2 已连续完成；后续进入真实内容替换和部署切片。
- **三重审查:** Skeptic Pass / Simplifier Pass / Blind-Handoff Pass。
- **交接状态:** Blueprint v1.1 与实现一致；Playwright/axe、70 项交互旅程、静态导航与 Lighthouse 证据已通过或如实记录。

## 冻结决定

- 受众优先级：本人体验 → 老师/同学/朋友的炫技与分享 → 招聘者/合作伙伴的能力验证。
- 产品主张：同一身份下的七个独立视觉世界，固定 Brand DNA 与真实性契约。
- 主视觉方向：`百折万象 / RESILIENCE ATLAS`，以折线锻场为骨架、兴趣博物志为内涵、七界幻场为关键舞台。
- 系统：静态优先 Next.js App Router + TypeScript；无账号、后端、数据库、评论、站内表单或追踪 SDK。
- 真实性：所有素材和链接显式区分 `placeholder / ai-generated / final`；无假链接、假奖项、假指标或未标注 AI 内容。
- 动效默认：桌面与移动端均交付完整动态世界；静态部署不等于静态体验；以 Motion + 原生合成层 + CSS 2.5D 实现空间感，不使用重型 3D 引擎。

## 开发停止条件

只有命中 `BUILD_AND_ACCEPTANCE.md#9-停止升级条件` 才暂停受影响切片。缺少姓名、头像、项目截图、奖状、文章、视频或照片本身不是全局阻塞；使用符合 Registry 的清晰占位继续完成体验。
