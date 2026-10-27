import type { Metadata } from "next";
import { BookOpenText, TreeStructure } from "@phosphor-icons/react/dist/ssr";
import { journalEntries } from "@/content/site";
import { JournalGarden } from "./journal-garden";
import styles from "./journal.module.css";

export const metadata: Metadata = {
  title: "文章札记",
  description: "进入 Thought Garden：沿着火种、淬炼与成章三种状态，阅读仍在生长的观点与方法。",
};

export default function JournalPage() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <section className={styles.intro} aria-labelledby="journal-title">
        <div className={styles.paperGrain} aria-hidden="true" />
        <p className={`${styles.kicker} atlas-kicker`}>
          <span>04</span> THOUGHT GARDEN · IDEAS WITH ROOTS
        </p>

        <div className={styles.introGrid}>
          <h1 id="journal-title">
            思想不是陈列品。
            <span>它应该继续生长。</span>
          </h1>

          <div className={styles.introNote}>
            <TreeStructure aria-hidden="true" size={30} weight="thin" />
            <p>
              这里保留尚未定型的问题，也记录经由项目、失败与复盘逐渐成章的判断。当前文字均明确标注来源状态，不把 AI 概念稿冒充个人经历。
            </p>
          </div>
        </div>

        <div className={styles.readingKey} aria-label="阅读状态说明">
          <span><i data-stage="spark" />火种 · 一个值得继续追问的问题</span>
          <span><i data-stage="forge" />淬炼 · 正在被证据与实践改变</span>
          <span><i data-stage="chapter" />成章 · 形成阶段性判断，仍可修订</span>
        </div>
      </section>

      <JournalGarden entries={journalEntries} />

      <section className={styles.gardenPromise} aria-labelledby="garden-promise-title">
        <BookOpenText aria-hidden="true" size={44} weight="thin" />
        <div>
          <p className="atlas-kicker">GARDEN RULE / 01</p>
          <h2 id="garden-promise-title">不急着显得正确，先让思考过程可见。</h2>
        </div>
        <p>
          后续替换真实文章时，每篇文字都会补上具体事件、选择依据与可验证作品；尚未完成的内容继续保留“火种”或“淬炼”状态。
        </p>
      </section>
    </main>
  );
}
