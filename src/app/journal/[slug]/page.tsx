import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  Quotes,
} from "@phosphor-icons/react/dist/ssr";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { getJournalEntry, journalEntries } from "@/content/site";
import { ArticleInteractions } from "./article-interactions";
import styles from "./article.module.css";

type JournalArticleProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return journalEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: JournalArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) {
    return { title: "文章未找到" };
  }

  return {
    title: entry.title,
    description: entry.excerpt,
  };
}

export default async function JournalArticlePage({ params }: JournalArticleProps) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) notFound();

  const entryIndex = journalEntries.findIndex((item) => item.slug === entry.slug);
  const nextEntry = journalEntries[(entryIndex + 1) % journalEntries.length];

  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <ArticleInteractions thesis={entry.thesis} />

      <header className={styles.articleHeader}>
        <Link className={styles.backLink} href="/journal">
          <ArrowLeft aria-hidden="true" size={19} weight="bold" />
          返回思想花园
        </Link>

        <div className={styles.headerGrid}>
          <div className={styles.articleIdentity}>
            <p className={`${styles.kicker} atlas-kicker`}>
              <span>{entry.index}</span> THOUGHT GARDEN / {entry.stage}
            </p>
            <h1>{entry.title}</h1>
          </div>

          <aside className={styles.articleState} aria-label="文章状态">
            <BookOpenText aria-hidden="true" size={34} weight="thin" />
            <dl>
              <div><dt>生长阶段</dt><dd>{entry.stage}</dd></div>
              <div><dt>主题根系</dt><dd>{entry.topic}</dd></div>
              <div><dt>内容状态</dt><dd><ProvenanceBadge provenance={entry.provenance} /></dd></div>
            </dl>
          </aside>
        </div>

        <div className={styles.thesis}>
          <Quotes aria-hidden="true" size={38} weight="thin" />
          <p>{entry.thesis}</p>
        </div>
      </header>

      <article className={styles.articleBody} aria-label={`${entry.title}正文`}>
        <aside className={styles.marginNote}>
          <span>正在生长的文本</span>
          <p>未接入真实经历与作品证据前，本页保持当前来源标注。状态不是装饰，而是可信度边界。</p>
        </aside>

        <div className={styles.prose}>
          <p className={styles.lead}>{entry.excerpt}</p>
          {entry.paragraphs.map((paragraph, index) => (
            <section key={paragraph} className={styles.paragraphBlock}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <p>{paragraph}</p>
            </section>
          ))}
        </div>
      </article>

      <section className={styles.experimentAnchor} aria-labelledby="experiment-anchor-title">
        <p className="atlas-kicker">EMBEDDED EXPERIMENT / RESERVED</p>
        <h2 id="experiment-anchor-title">文章最终不只被读，也可以被亲手验证。</h2>
        <p>
          上方的“事实、判断、下一步”是一座交互占位舞台。未来可以接入版本对照、可操作原型、证据图谱或一次真实实验，不用重做文章结构。
        </p>
      </section>

      <nav className={styles.articleNavigation} aria-label="文章导航">
        <Link href="/journal">
          <span>INDEX</span>
          <strong>浏览全部思想根系</strong>
          <ArrowUpRight aria-hidden="true" size={25} />
        </Link>
        <Link href={`/journal/${nextEntry.slug}`}>
          <span>NEXT ROOT · {nextEntry.index}</span>
          <strong>{nextEntry.title}</strong>
          <ArrowUpRight aria-hidden="true" size={25} />
        </Link>
      </nav>
    </main>
  );
}
