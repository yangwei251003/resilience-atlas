"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import type { Project } from "@/content/site";
import styles from "./case-signal.module.css";

export function CaseSignal({ project }: { project: Project }) {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const steps = [
    { index: "01", label: "QUESTION", title: "问题", content: project.question },
    { index: "02", label: "DECISION", title: "关键选择", content: project.decision },
    { index: "03", label: "OUTCOME", title: "结果状态", content: project.outcome },
    { index: "04", label: "REFLECTION", title: "反思", content: project.reflection },
  ];

  return (
    <section className={styles.case} ref={target} aria-label="项目案例过程">
      <aside aria-hidden="true">
        <span>LOAD</span>
        <div><motion.i style={{ scaleY: progress }} /></div>
        <span>LEARN</span>
      </aside>
      <div className={styles.steps}>
        {steps.map((step) => (
          <article key={step.index}>
            <div className={styles.stepMeta}>
              <span>{step.index}</span>
              <small>{step.label}</small>
            </div>
            <h2>{step.title}</h2>
            <p>{step.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
