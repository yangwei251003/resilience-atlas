"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import { useRef, useState } from "react";
import { ArrowRight, BracketsCurly, CircleNotch, Flask, Pulse } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { projects, provenanceLabel } from "@/content/site";
import styles from "./project-reactor.module.css";

export function ProjectReactor() {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const bounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 190, damping: 25 });
  const sy = useSpring(y, { stiffness: 190, damping: 25 });
  const rotateY = useTransform(sx, [-1, 1], [-8, 8]);
  const rotateX = useTransform(sy, [-1, 1], [7, -7]);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!bounds.current) return;
    const rect = bounds.current;
    x.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    y.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  return (
    <section className={styles.reactor} aria-label="项目反应台">
      <div className={styles.projectRail}>
        <p className="atlas-kicker">LOAD A PROJECT</p>
        <div className={styles.railButtons} aria-label="项目列表">
          {projects.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={selected === index}
              aria-controls="project-evidence-panel"
              onClick={() => setSelected(index)}
              style={{ "--project-accent": item.accent } as CSSProperties}
            >
              <span>{item.index}</span>
              <strong>{item.title}</strong>
              <small>{item.type}</small>
              <CircleNotch aria-hidden="true" size={18} weight={selected === index ? "fill" : "regular"} />
            </button>
          ))}
        </div>
      </div>

      <div
        className={styles.chamberWrap}
        onPointerEnter={(event) => { bounds.current = event.currentTarget.getBoundingClientRect(); }}
        onPointerDown={(event) => {
          bounds.current = event.currentTarget.getBoundingClientRect();
          if (event.pointerType === "touch") event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={onMove}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          x.set(0);
          y.set(0);
        }}
        onPointerCancel={() => {
          x.set(0);
          y.set(0);
        }}
        onPointerLeave={() => {
          bounds.current = null;
          x.set(0);
          y.set(0);
        }}
      >
        <motion.div className={styles.chamber} style={{ rotateX, rotateY, "--accent": project.accent } as never}>
          <div className={styles.chamberGrid} aria-hidden="true" />
          <div className={styles.orbit} aria-hidden="true"><i /><i /><i /></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.slug}
              className={styles.specimen}
              initial={{ opacity: 0, z: -80, rotateZ: -4 }}
              animate={{ opacity: 1, z: 70, rotateZ: 0 }}
              exit={{ opacity: 0, z: -80, rotateZ: 4 }}
              transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className={styles.specimenIndex}>{project.index}</span>
              <BracketsCurly aria-hidden="true" size={54} weight="thin" />
              <strong>{project.title}</strong>
              <small>{project.state}</small>
            </motion.div>
          </AnimatePresence>
          <div className={styles.readout}>
            <span><Pulse size={15} aria-hidden="true" /> ACTIVE INPUT</span>
            <span>{String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          </div>
        </motion.div>
        <p className={styles.touchHint}>触摸与键盘：点选项目即可完成同样的装载与切换。</p>
      </div>

      <div id="project-evidence-panel" className={styles.evidence} style={{ "--accent": project.accent } as CSSProperties}>
        <span className="sr-only" aria-live="polite">已装载项目：{project.title}</span>
        <div className={styles.evidenceTopline}>
          <span>{provenanceLabel(project.provenance)}</span>
          <Flask aria-hidden="true" size={20} />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
          >
            <p className={styles.projectType}>{project.type}</p>
            <h2>{project.title}</h2>
            <p className={styles.teaser}>{project.teaser}</p>
            <dl>
              <div><dt>问题</dt><dd>{project.question}</dd></div>
              <div><dt>关键选择</dt><dd>{project.decision}</dd></div>
              <div><dt>结果状态</dt><dd>{project.outcome}</dd></div>
            </dl>
            <ul aria-label="相关能力">
              {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
            <Link href={`/projects/${project.slug}`}>
              打开完整个案
              <ArrowRight aria-hidden="true" size={19} weight="bold" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
