# 动效与个人网站参考研究｜百折万象

- **Blueprint addendum:** v1.1
- **Research date:** 2026-08-29
- **Status:** Approved for implementation
- **Scope:** 全动态默认体验、七个世界的标志性交互、无重型 3D 引擎的空间实现

## 1. 用户新增的不可弱化要求

1. 桌面与移动端都以完整动态体验为默认，不因为屏幕小而改成交互简版。
2. 静态部署只描述构建与托管方式，不限制浏览器端动效、路由交互岛或媒体体验。
3. 最大化空间感、视觉美感与强交互，但不引入 Three.js、React Three Fiber、Babylon、运行时 Spline 或全屏 WebGL 主场景。
4. `prefers-reduced-motion` 只作为操作系统级无障碍保护，不提供默认“轻量模式”，也不改变默认艺术指导。
5. 移动端采用同等丰富的触摸、滑动、点按和滚动映射；任何拖动都必须同时有按钮、分页或直接点选入口。

## 2. 已核验参考站与可借机制

本轮实际打开并核验 16 个当前个人站。只学习机制与信息架构，不复制标志性构图、配色、文案或 IP。

| 站点 | 可借机制 | 映射到百折万象 | 禁止照抄 |
|---|---|---|---|
| [Lynn Fisher](https://lynnandtonic.com/) | 页面受力、压缩、弹性复位；19 版成长归档 | Hero 的韧性线受阻、改道、重新上扬 | 436px 书页、拖窗彩蛋、年度换皮 |
| [Henry Desroches](https://henry.codes/) | Garden、Notes、Case Studies、Now 与双版本简历共存 | 七界语气不同但同属一个个人出版社 | 哥特杂志、失真肖像、季节命名 |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | 文章内可操作实验、键盘等价、人格化小玩具 | 博客用真实可玩切片证明思考能力 | 堆叠声音、宠物和彩蛋 |
| [Maggie Appleton](https://maggieappleton.com/) | Topic × Stage × Type 的知识生长结构 | “火种 / 淬炼 / 成章”的内容成熟度 | Digital Garden 原名、植物视觉与术语 |
| [Brittany Chiang](https://brittanychiang.com/) | 身份、经历、项目、写作的证据阶梯 | 90 秒招聘路径与 Swiss CV 信息骨架 | 深蓝青绿、固定侧栏与模板卡片比例 |
| [Nicky Case](https://ncase.me/) | 以 Play / Read / Watch 组织入口 | Hero 和 AI Lab 以访客动作而非技术栈导航 | 卡通 IP、口语风格与现成游戏形式 |
| [Adham Dannaway](https://www.adhamdannaway.com/) | 一次清楚选择表达一人多面 | 七扇门与专业/个人双速阅读 | 半脸分割、技能百分比 |
| [Emil Kowalski](https://emilkowal.ski/) | 可操作的动画 A/B、时长与 easing 对照 | 动效必须承担反馈、方向或理解目的 | Linear 式灰阶与全控件弹簧化 |
| [Bartosz Ciechanowski](https://ciechanow.ski/) | 拖拽、滑块、轨迹和双视角建立直觉 | 项目过程与博客的 2D 解释性实验 | 全篇高成本模拟和重型 3D |
| [Greg Garcia](https://greggarcia.net/) | Showreel、作品、履历、奖项的编号长卷 | Cinema 与 Museum 互相提供证据 | 伪造年限、客户或成果数字 |
| [Adam Allegrucci](https://adamallegrucci.com/) | 少量精选视频连接奖项与 Journal | 视频从观看入口延伸到复盘和荣誉 | 把个人站改成接单模板 |
| [Paul Stamatiou](https://paulstamatiou.com/photos) | Photosets / Photostream 双视图 | 接触印样快速看、故事胶卷慢慢读 | 用规模替代策展与隐私检查 |
| [Aaron Graubart](https://www.aarongraubart.com/) | 不同纵横比形成高密度影像节奏 | 照片墙由真实影像主导而非卡片模板 | 无导航倾倒全部图片 |
| [Tobias Ahlin](https://tobiasahlin.com/) | CSS/文字运动标本可直接预览 | 项目卡内运行一个最小 live slice | 把作品集变成组件大全 |
| [Paco Coursey](https://paco.me/craft) | Motion、CSS、Interaction 分成工艺标本 | About 的“此刻正在淬炼”与项目工艺切片 | 稀疏 Linear 风、原句口号 |
| [Rauno Freiberg](https://rauno.me/) | 稳定信条、Projects、Field Notes 与版本史 | 固定人格内核驱动七种可进化外观 | 灰阶等宽与 “Make it” 宣言 |

## 3. 研究后的七界标志性交互

| 世界 | 标志性交互 | 桌面输入 | 触屏输入 | 静态首帧 |
|---|---|---|---|---|
| Hero Portal | 韧性线带动七扇空间门受力、错位、复位并上扬 | pointer 倾斜、滚动推进、点击穿越 | 滑动/滚动推进、点按聚焦、按钮直达 | 完整英雄构图和全部入口立即可见 |
| AI Lab | 把项目装载进“反应台”，空间平面重排为问题、选择、结果、反思 | hover 预演、点击装载、键盘切换 | 点按装载、横向滑动、前后按钮 | 精选项目与证据正文完整存在 |
| Museum Vault | 聚光镜沿纵深展柜移动，抽屉展开证据与来源状态 | pointer 聚光、滚动开柜、键盘按钮 | 拖移聚光、点按开柜、上下滚动 | 展签、日期和证据状态可直接读取 |
| Swiss CV | 12 栏网格随时间轴重新排版，在“90 秒 / 完整人格”之间切换 | 滚动联动、点击视图、键盘跳转 | 点按视图、自然滚动、锚点跳转 | 完整简历 DOM 和 A4 打印版成立 |
| Digital Garden | 主题根系随阅读生长，文章按火种/淬炼/成章聚焦 | 滚动生长、筛选、键盘导航 | 滚动生长、点按筛选、章节按钮 | 文章摘要和状态索引完整存在 |
| Cinema | 幕布与投影光形成空间舞台，海报扩展为播放器与逐字稿 | 点击选片、指针景深、键盘控件 | 点按选片、滑动节目单、按钮控制 | 海报、摘要、播放按钮和逐字稿入口可见 |
| Contact Sheet | 接触印样像灯台般倾斜、平移、显影并进入故事胶卷 | pointer 透视、拖动、点击灯箱 | 双指针之外不设门槛；单指滑动、点按、按钮 | 高密度印样、图注和主题索引可直接查看 |

## 4. 技术实现结论

### 4.1 主路径

- 可访问、可索引的 Server Component DOM 负责所有正文、入口、媒体尺寸和最强静态首帧。
- CSS 以 `perspective`、`transform-style: preserve-3d` 和 4–7 个视觉平面建立 2.5D 空间。
- Motion 13 的 `useScroll → useSpring → useTransform` 为每个场景提供一个主进度，再派生多个 MotionValue；滚动和指针过程中禁止逐帧 React `setState`。
- 页面专属动画按路由加载；需要 drag/layout 的页面才加载相应 Motion 功能。
- `layoutId` 只用于局部平面 UI，不放进复杂 `preserve-3d` 子树。

### 4.2 特性增强而非核心依赖

- 原生 View Transition、CSS Scroll-driven Animations、CSS mask 只在支持时增强。
- React `<ViewTransition>`、Next `experimental.viewTransition` 与 Motion+ alpha API 不作为生产核心。
- 无上述特性时仍保留页内 Motion 进入、完整空间构图和正常 App Router 导航。

### 4.3 合成与性能预算

- 连续动画仅使用 transform、独立 translate/rotate/scale 和 opacity。
- 大面积 blur、filter、mask、clip-path 和阴影保持静态；它们不得放在 `preserve-3d` 祖先上，以免空间子树被扁平化。
- Hero LCP 内容不得等待 hydration 才显示；图片固定宽高比，字体预留空间。
- 每个场景一个主滚动进度、一个平滑 spring；同时连续运动的复合层控制在 4–7 层。
- `will-change` 只短时用于正在交互的少量元素；禁止全站常驻。
- 目标维持 LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1，并在桌面、320px 触屏与中端移动设备验证。

## 5. 明确排除

- Three.js、React Three Fiber、Babylon、全屏 WebGL/Canvas 主场景、运行时 Spline。
- GSAP 与 Motion 双动画栈；本项目只保留 Motion + CSS。
- Lenis 或其他滚动劫持、custom cursor、自动有声视频、关键内容自动轮播。
- hover-only、drag-only 或传感器-only 操作；所有拖动有点按替代。
- 因“移动端”或“静态部署”而关闭页面标志性交互。
- 用轻量模式掩盖没有完成性能工程；默认始终交付完整体验。

## 6. 原创性转换规则

每个借鉴机制必须经过三层转换：先换叙事含义，再换几何/材质，最后换输入映射。实现中不得同时复制某案例的版式、色彩、动效节奏和文案。七界两两比较时，色彩、排版、构图、材质、媒体、交互、动效七维中至少四维明显不同。
