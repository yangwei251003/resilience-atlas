export type Provenance = "placeholder" | "ai-generated" | "final";

export type World = {
  id: string;
  index: string;
  href: string;
  title: string;
  english: string;
  invitation: string;
  promise: string;
  accent: string;
};

export const identity = {
  name: "示例创作者",
  role: "AI 驱动的创造者 · 学生 · 长期主义实践者",
  location: "演示不展示具体位置",
  statement: "把好奇变成作品，把挫折变成下一版。",
  longStatement:
    "我正在用 AI、代码、设计与持续记录，建造一套属于自己的作品宇宙。这里既是个人网站，也是会不断更新的网页版简历。",
  emailLabel: "演示不展示联系方式",
  socialLabel: "开源模板演示",
  availability: "期待交流、比赛、实习与有意思的合作",
  provenance: "placeholder" as Provenance,
};

export const traits = [
  "百折不挠",
  "卧薪尝胆",
  "博闻多识",
  "兴趣盎然",
  "深思敏悟",
  "争强好胜",
  "思如泉涌",
  "自信昂扬",
] as const;

export const worlds: World[] = [
  {
    id: "home",
    index: "00",
    href: "/",
    title: "入口",
    english: "Hero Portal",
    invitation: "从这里进入",
    promise: "一条折而不止的线，串起全部世界。",
    accent: "#ff5a36",
  },
  {
    id: "projects",
    index: "01",
    href: "/projects",
    title: "AI 项目集",
    english: "AI Lab",
    invitation: "玩一个",
    promise: "把问题装入反应台，看选择如何变成作品。",
    accent: "#37e6d4",
  },
  {
    id: "honors",
    index: "02",
    href: "/honors",
    title: "成就荣誉",
    english: "Museum Vault",
    invitation: "验一份",
    promise: "奖项不是金边，而是时间、作品与证据。",
    accent: "#c8a55b",
  },
  {
    id: "about",
    index: "03",
    href: "/about",
    title: "关于与简历",
    english: "Swiss CV",
    invitation: "读懂我",
    promise: "90 秒看能力，慢下来读完整人格。",
    accent: "#2456d8",
  },
  {
    id: "journal",
    index: "04",
    href: "/journal",
    title: "文章札记",
    english: "Thought Garden",
    invitation: "读一篇",
    promise: "让火种被看见，也让观点经得起淬炼。",
    accent: "#3f6d55",
  },
  {
    id: "videos",
    index: "05",
    href: "/videos",
    title: "视频放映",
    english: "Cinema",
    invitation: "看一幕",
    promise: "以镜头保存作品、过程和仍在发生的故事。",
    accent: "#e4a44a",
  },
  {
    id: "photos",
    index: "06",
    href: "/photos",
    title: "个人照片墙",
    english: "Contact Sheet",
    invitation: "显一格",
    promise: "把生活切片放回时间与感受之中。",
    accent: "#e66a2c",
  },
];

export type Project = {
  slug: string;
  index: string;
  title: string;
  type: string;
  state: string;
  teaser: string;
  question: string;
  decision: string;
  outcome: string;
  reflection: string;
  tools: string[];
  accent: string;
  provenance: Provenance;
};

export const projects: Project[] = [
  {
    slug: "knowledge-atlas",
    index: "P-01",
    title: "会思考的知识航图",
    type: "AI 网站 · 概念席位",
    state: "AI 概念原型",
    teaser: "让散落的笔记不只被搜索，还能被重新连接、质疑与继续生长。",
    question: "当资料越来越多，怎样避免知识只是在收藏夹里安静堆积？",
    decision: "把检索结果改写成可追问的关系航图，并给每条连接保留来源与不确定性。",
    outcome: "当前展示的是结构与交互概念，等待替换为你的真实网站、截图、链接和可验证结果。",
    reflection: "真正的智能不只给答案，也应该暴露依据、空白与下一步问题。",
    tools: ["AI Workflow", "Next.js", "Information Design"],
    accent: "#37e6d4",
    provenance: "ai-generated",
  },
  {
    slug: "skill-orchestrator",
    index: "P-02",
    title: "技能编排器",
    type: "AI Skill · 概念席位",
    state: "结构占位",
    teaser: "先理解任务，再选择、协调并验证合适的技能，而不是把工具一次全开。",
    question: "面对大量能力相近的 AI 技能，怎样选得准、协作稳、过程可追踪？",
    decision: "建立任务路由、能力去重、顺序依赖和验收回路，让每个技能只在需要时上场。",
    outcome: "本席位用于替换你的真实 Skill、安装地址、文档和演示记录，当前不提供虚构下载链接。",
    reflection: "更强不等于更多。优秀的编排，是让每项能力出现在正确时刻。",
    tools: ["Agent Routing", "Skill Design", "Evaluation"],
    accent: "#b7f34a",
    provenance: "placeholder",
  },
  {
    slug: "after-the-storm",
    index: "P-03",
    title: "残局之后",
    type: "AI 小游戏 · 概念席位",
    state: "玩法占位",
    teaser: "一场关于失败、重来与路径选择的短篇交互实验。",
    question: "如果失败不是回到原点，而会留下改变下一局的折痕呢？",
    decision: "把每次失败保存为新规则，让玩家用曾经的挫折打开新的通路。",
    outcome: "当前只展示叙事与机制方向，后续替换为真实可玩构建、录屏和开发复盘。",
    reflection: "百折不挠不是重复同一动作，而是带着每次失败留下的信息继续走。",
    tools: ["Game Loop", "Generative Story", "Web Audio"],
    accent: "#ff5a36",
    provenance: "ai-generated",
  },
  {
    slug: "campus-spark-box",
    index: "P-04",
    title: "校园灵感盒",
    type: "AI 小程序 · 概念席位",
    state: "需求占位",
    teaser: "把稍纵即逝的校园问题变成可被回应、组队和实践的微小提案。",
    question: "很多好点子为什么在一句‘以后再说’里消失？",
    decision: "用极短输入记录火种，再由 AI 帮助澄清问题、拆分行动并寻找同行者。",
    outcome: "等待替换为你的真实小程序码、使用流程、角色分工和成果证据。",
    reflection: "兴趣需要出口，行动需要第一个足够小的台阶。",
    tools: ["Mini Program", "AI Copilot", "Community"],
    accent: "#315efb",
    provenance: "placeholder",
  },
];

export type Honor = {
  index: string;
  title: string;
  level: string;
  year: string;
  context: string;
  evidence: string;
  provenance: Provenance;
};

export const honors: Honor[] = [
  {
    index: "H-01",
    title: "核心比赛奖项席位",
    level: "[奖项级别待补充]",
    year: "[年份]",
    context: "在这里补充比赛主题、你的角色、最困难的一次选择，以及它如何推动能力升级。",
    evidence: "证书图片、官方结果页与作品链接均待核验后接入。",
    provenance: "placeholder",
  },
  {
    index: "H-02",
    title: "创新实践荣誉席位",
    level: "[荣誉名称待补充]",
    year: "[年份]",
    context: "这不是荣誉墙的填充格，而是为真实事件保留的叙事展柜。",
    evidence: "颁发机构、证书编号与隐私遮挡规则待补充。",
    provenance: "placeholder",
  },
  {
    index: "H-03",
    title: "学业与成长记录席位",
    level: "[等级待补充]",
    year: "[年份]",
    context: "适合记录奖学金、优秀学生、课程成果或长期坚持带来的阶段性肯定。",
    evidence: "真实材料接入前，不展示任何虚构机构或排名。",
    provenance: "placeholder",
  },
];

export const experiences = [
  {
    period: "[起止时间]",
    title: "[学校 / 专业待补充]",
    kind: "教育经历",
    summary: "补充课程方向、重要转折、社团或研究经历，以及它们如何影响你的创造方式。",
    evidence: "信息占位",
  },
  {
    period: "[起止时间]",
    title: "[比赛 / 团队经历待补充]",
    kind: "实践经历",
    summary: "补充你承担的角色、合作方式、做出的关键判断和留下的真实结果。",
    evidence: "信息占位",
  },
  {
    period: "现在",
    title: "正在淬炼",
    kind: "Now",
    summary: "持续学习 AI 工程、交互设计与个人知识表达，并把每次实践沉淀为可演示作品。",
    evidence: "方向性描述 · 待用真实计划校准",
  },
] as const;

export type JournalEntry = {
  slug: string;
  index: string;
  title: string;
  stage: "火种" | "淬炼" | "成章";
  topic: string;
  excerpt: string;
  thesis: string;
  paragraphs: string[];
  provenance: Provenance;
};

export const journalEntries: JournalEntry[] = [
  {
    slug: "failure-leaves-a-map",
    index: "J-01",
    title: "失败不会归零，它会留下一张地图",
    stage: "淬炼",
    topic: "成长 / 复盘",
    excerpt: "一次失败如果只留下情绪，就会重复；如果留下结构，它会变成下一版的起点。",
    thesis: "把挫折写成可执行的设计约束，比把它包装成励志故事更诚实。",
    paragraphs: [
      "这是一篇 AI 生成的文章结构占位，不冒充你的真实经历。后续可以从一次具体比赛、项目返工或学习低谷出发，记录当时的判断、失败信号和改变。",
      "正文应保留事实与感受的边界：发生了什么、我怎样理解、下一次具体会做什么。网站中的韧性线也会从真实迭代中获得新的断点，而不是只做装饰。",
      "替换完成后，这里可以嵌入一次版本对照，让读者亲手切换失败前后的方案，并看见改变来自哪条证据。",
    ],
    provenance: "ai-generated",
  },
  {
    slug: "curiosity-needs-an-exit",
    index: "J-02",
    title: "兴趣需要出口",
    stage: "火种",
    topic: "学习 / 创造",
    excerpt: "收藏不是掌握，好奇只有落到一次试验、一段文字或一个作品里，才开始拥有形状。",
    thesis: "用小而具体的产出保护兴趣，让它从短暂兴奋变成长期能力。",
    paragraphs: [
      "这是一篇待由你亲自扩写的观点火种。可以补充最近真正吸引你的一个问题，以及你为它做过的最小实验。",
      "文章不需要假装已经得出结论。火种状态允许保留问题、分歧和下一次准备验证的假设。",
    ],
    provenance: "placeholder",
  },
  {
    slug: "ai-is-a-collaboration-mirror",
    index: "J-03",
    title: "AI 是一面协作镜子",
    stage: "成章",
    topic: "AI / 方法",
    excerpt: "模型会放大提示里的清晰与混乱，也迫使我重新判断什么值得由人负责。",
    thesis: "AI 开发的核心能力，不只是生成速度，而是定义问题、辨别质量与承担选择。",
    paragraphs: [
      "当前正文仍是 AI 概念稿，发布为真实文章前需要加入你的项目证据、失败案例和个人判断。",
      "一个可靠的协作过程应当留下：目标如何被定义、哪些答案被否决、为什么做出最终选择、结果由什么证据验证。",
      "当这些过程可见，AI 才不会把个人作品变成没有作者的平均答案。",
    ],
    provenance: "ai-generated",
  },
];

export const videos = [
  {
    index: "V-01",
    title: "作品演示主片席位",
    category: "Showreel",
    summary: "用于替换为最能代表你的项目演示或个人介绍视频。",
    poster: "/media/cinema-portal-ai.webp",
    chapters: ["问题", "关键选择", "演示", "复盘"],
    provenance: "ai-generated" as Provenance,
  },
  {
    index: "V-02",
    title: "比赛复盘影像席位",
    category: "Reflection",
    summary: "用于记录准备、现场、结果与比赛之后真正留下的能力。",
    poster: "/media/cinema-portal-ai.webp",
    chapters: ["起点", "受阻", "改道", "继续"],
    provenance: "placeholder" as Provenance,
  },
  {
    index: "V-03",
    title: "学习与表达席位",
    category: "Talk",
    summary: "用于替换为分享、讲解、课程片段或观点短片。",
    poster: "/media/cinema-portal-ai.webp",
    chapters: ["命题", "例子", "方法", "下一问"],
    provenance: "placeholder" as Provenance,
  },
] as const;

export const photoRolls = [
  {
    index: "R-01",
    title: "最近的光",
    note: "AI 概念接触印样，用来确认照片墙的节奏、比例与显影交互。",
    image: "/media/contact-sheet-ai.webp",
    provenance: "ai-generated" as Provenance,
  },
  {
    index: "R-02",
    title: "校园与途中",
    note: "等待替换为真实照片、拍摄时间、地点公开级别与个人感悟。",
    image: "/media/contact-sheet-ai.webp",
    provenance: "placeholder" as Provenance,
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getJournalEntry(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug);
}

export function provenanceLabel(provenance: Provenance) {
  return {
    placeholder: "占位 · 待替换",
    "ai-generated": "AI 概念示意",
    final: "真实内容 · 已核验",
  }[provenance];
}
