"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpenText,
  CirclesThreePlus,
  Flask,
  Sparkle,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { JournalEntry } from "@/content/site";
import { provenanceLabel } from "@/content/site";
import styles from "./journal.module.css";

type StageFilter = "全部" | JournalEntry["stage"];

const filters: Array<{
  label: StageFilter;
  note: string;
  icon: typeof CirclesThreePlus;
}> = [
  { label: "全部", note: "看见完整生长轨迹", icon: CirclesThreePlus },
  { label: "火种", note: "尚未定型的问题", icon: Sparkle },
  { label: "淬炼", note: "正在实践中改变", icon: Flask },
  { label: "成章", note: "阶段性的判断", icon: BookOpenText },
];

const stageAccent: Record<JournalEntry["stage"], string> = {
  火种: "#d1473f",
  淬炼: "#4f7056",
  成章: "#70405f",
};

const stageText: Record<JournalEntry["stage"], string> = {
  火种: "#8d2d29",
  淬炼: "#36513d",
  成章: "#573148",
};

export function JournalGarden({ entries }: { entries: JournalEntry[] }) {
  const gardenRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<StageFilter>("全部");
  const [activeSlug, setActiveSlug] = useState(entries[0]?.slug ?? "");
  const visibleEntries = filter === "全部" ? entries : entries.filter((entry) => entry.stage === filter);

  const { scrollYProgress } = useScroll({
    target: gardenRef,
    offset: ["start 82%", "end 26%"],
  });
  const growth = useSpring(scrollYProgress, { stiffness: 105, damping: 27, mass: 0.62 });
  const branchOne = useTransform(growth, [0.08, 0.36], [0, 1]);
  const branchTwo = useTransform(growth, [0.28, 0.66], [0, 1]);
  const branchThree = useTransform(growth, [0.56, 0.94], [0, 1]);
  const seedY = useTransform(growth, [0, 1], [0, 880]);

  return (
    <section className={styles.garden} ref={gardenRef} aria-labelledby="garden-index-title">
      <header className={styles.gardenHeader}>
        <div>
          <p className="atlas-kicker">GROWTH INDEX</p>
          <h2 id="garden-index-title">沿根系，进入一段思考。</h2>
        </div>
        <p>筛选不会缩减交互：鼠标、键盘与触屏都可以点按状态，再进入完整文章。</p>
      </header>

      <div className={styles.filterRail} role="group" aria-label="按文章状态筛选">
        {filters.map(({ label, note, icon: Icon }) => (
          <button
            key={label}
            type="button"
            aria-pressed={filter === label}
            onClick={() => setFilter(label)}
          >
            <Icon aria-hidden="true" size={20} weight={filter === label ? "fill" : "regular"} />
            <span>
              <strong>{label}</strong>
              <small>{note}</small>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.growthField}>
        <svg
          className={styles.rootMap}
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className={styles.rootGhost} d="M50 8 C44 150 60 234 49 365 C39 504 61 616 47 765 C42 840 49 925 51 992" />
          <motion.path
            className={styles.rootLive}
            d="M50 8 C44 150 60 234 49 365 C39 504 61 616 47 765 C42 840 49 925 51 992"
            style={{ pathLength: growth }}
          />
          <motion.path
            className={styles.branchLive}
            d="M51 192 C37 215 27 238 12 270"
            style={{ pathLength: branchOne }}
          />
          <motion.path
            className={styles.branchLive}
            d="M49 482 C61 503 74 532 89 566"
            style={{ pathLength: branchTwo }}
          />
          <motion.path
            className={styles.branchLive}
            d="M48 745 C35 770 25 802 10 842"
            style={{ pathLength: branchThree }}
          />
        </svg>
        <motion.span className={styles.travellingSeed} style={{ y: seedY }} aria-hidden="true" />

        <div className={styles.entryList} aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleEntries.map((entry) => {
              const sourceIndex = entries.findIndex((item) => item.slug === entry.slug);
              return (
                <motion.article
                  layout
                  key={entry.slug}
                  className={styles.entry}
                  data-side={sourceIndex % 2 === 0 ? "left" : "right"}
                  data-active={activeSlug === entry.slug}
                  style={{
                    "--entry-accent": stageAccent[entry.stage],
                    "--entry-text": stageText[entry.stage],
                  } as CSSProperties}
                  initial={{ opacity: 0, y: 54, rotate: sourceIndex % 2 === 0 ? -1.6 : 1.6 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -30, scale: 0.97 }}
                  transition={{ duration: 0.48, ease: [0.2, 0.8, 0.2, 1] }}
                  onPointerEnter={() => setActiveSlug(entry.slug)}
                  onFocusCapture={() => setActiveSlug(entry.slug)}
                  onPointerDown={() => setActiveSlug(entry.slug)}
                >
                  <div className={styles.entryTopline}>
                    <span>{entry.index}</span>
                    <span>{entry.stage}</span>
                    <span>{entry.topic}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p className={styles.excerpt}>{entry.excerpt}</p>
                  <p className={styles.thesis}><span>判断</span>{entry.thesis}</p>
                  <div className={styles.entryFoot}>
                    <span>{provenanceLabel(entry.provenance)}</span>
                    <Link href={`/journal/${entry.slug}`}>
                      进入这段思考
                      <ArrowUpRight aria-hidden="true" size={21} weight="bold" />
                    </Link>
                  </div>
                  <i className={styles.rootNode} aria-hidden="true" />
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {visibleEntries.length === 0 ? (
        <p className={styles.emptyState}>这个阶段尚未种下内容。保留空白，直到真实思考出现。</p>
      ) : null}
    </section>
  );
}
