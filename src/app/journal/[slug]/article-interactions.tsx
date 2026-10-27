"use client";

import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { CheckCircle, Flask, Path } from "@phosphor-icons/react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import styles from "./article.module.css";

type ExperimentMode = "事实" | "判断" | "下一步";

const modes: Array<{
  id: ExperimentMode;
  label: string;
  icon: typeof CheckCircle;
}> = [
  { id: "事实", label: "原始证据席位", icon: CheckCircle },
  { id: "判断", label: "当前观点", icon: Flask },
  { id: "下一步", label: "待验证方向", icon: Path },
];

export function ArticleInteractions({ thesis }: { thesis: string }) {
  const [mode, setMode] = useState<ExperimentMode>("判断");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.55 });

  const body: Record<ExperimentMode, string> = {
    事实: "证据尚未接入。未来在这里放置真实事件、原始记录、作品版本或可核验链接，不用概念文字代替事实。",
    判断: thesis,
    下一步: "下一次实验仍待你的真实计划校准。未来可以把假设、操作入口与结果回填到同一舞台，让观点随验证继续变化。",
  };

  function selectTab(index: number) {
    const nextMode = modes[index].id;
    setMode(nextMode);
    tabRefs.current[index]?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % modes.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + modes.length) % modes.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = modes.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    selectTab(nextIndex);
  }

  return (
    <>
      <motion.div className={styles.readingProgress} style={{ scaleX: progress }} aria-hidden="true" />
      <aside className={styles.experimentDock} aria-label="文章交互实验舞台">
        <p>LIVE THOUGHT</p>
        <div className={styles.experimentTabs} role="tablist" aria-label="切换思考层次">
          {modes.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`thought-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={mode === id}
              aria-controls="thought-panel"
              tabIndex={mode === id ? 0 : -1}
              onClick={() => setMode(id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <Icon aria-hidden="true" size={18} weight={mode === id ? "fill" : "regular"} />
              <span><strong>{id}</strong><small>{label}</small></span>
            </button>
          ))}
        </div>
        <div
          className={styles.experimentPanel}
          id="thought-panel"
          role="tabpanel"
          aria-labelledby={`thought-tab-${mode}`}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -9 }}
              transition={{ duration: 0.24 }}
            >
              {body[mode]}
            </motion.p>
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
}
