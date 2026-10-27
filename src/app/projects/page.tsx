import type { Metadata } from "next";
import { ProjectReactor } from "./project-reactor";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "AI 项目集",
  description: "进入 AI Lab：以问题、关键选择、结果与反思阅读网站、Skill、小游戏和小程序项目。",
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <section className={styles.intro} aria-labelledby="projects-title">
        <div className={styles.scan} aria-hidden="true" />
        <p className={`${styles.kicker} atlas-kicker`}>
          <span>01</span> AI LAB · IDEAS UNDER PRESSURE
        </p>
        <div className={styles.introGrid}>
          <h1 id="projects-title">
            把问题装进来。
            <span>让选择发光。</span>
          </h1>
          <div className={styles.introNote}>
            <strong>不是封面陈列室</strong>
            <p>每个项目都从一个问题开始，并用过程、结果和复盘证明能力。当前四个席位是清晰标注的概念与占位，等待替换为你的真实作品。</p>
          </div>
        </div>
        <div className={styles.labLegend} aria-label="实验室阅读方式">
          <span><i /> 选择项目</span>
          <span><i /> 装载证据</span>
          <span><i /> 深入个案</span>
        </div>
      </section>

      <ProjectReactor />

      <section className={styles.principles} aria-labelledby="principles-title">
        <header>
          <p className="atlas-kicker">WORKING PRINCIPLES</p>
          <h2 id="principles-title">我想用作品证明的，不只是“会做”。</h2>
        </header>
        <ol>
          <li><span>01</span><strong>先定义问题</strong><p>没有清楚边界的需求，只会更快地产生平均答案。</p></li>
          <li><span>02</span><strong>让选择可解释</strong><p>保留被否决的方案、判断依据和关键取舍。</p></li>
          <li><span>03</span><strong>把失败写进下一版</strong><p>复盘不为美化过程，而是改变下一次行动。</p></li>
          <li><span>04</span><strong>只展示可核验证据</strong><p>真实链接、角色与结果未接入前，状态永远保持占位。</p></li>
        </ol>
      </section>
    </main>
  );
}
