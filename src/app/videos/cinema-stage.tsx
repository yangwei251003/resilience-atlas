"use client";

import Image from "next/image";
import { mediaUrl } from "@/lib/media-url";
import type { KeyboardEvent, PointerEvent } from "react";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FilmReel,
  Play,
  ProjectorScreenChart,
  SealWarning,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { provenanceLabel, videos } from "@/content/site";
import styles from "./videos.module.css";

function wrapIndex(index: number) {
  return (index + videos.length) % videos.length;
}

export function CinemaStage() {
  const [selected, setSelected] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [showSourceNotice, setShowSourceNotice] = useState(false);
  const video = videos[selected];
  const bounds = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 170, damping: 24, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 170, damping: 24, mass: 0.55 });
  const rotateY = useTransform(smoothX, [-1, 1], [-7, 7]);
  const rotateX = useTransform(smoothY, [-1, 1], [5, -5]);
  const posterX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const posterY = useTransform(smoothY, [-1, 1], [-8, 8]);

  function choose(index: number) {
    setSelected(wrapIndex(index));
    setChapter(0);
    setShowSourceNotice(false);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !bounds.current) return;
    const rect = bounds.current;
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function resetPointer() {
    bounds.current = null;
    pointerX.set(0);
    pointerY.set(0);
  }

  function onDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) < 46 && Math.abs(info.velocity.x) < 260) return;
    choose(selected + (info.offset.x < 0 ? 1 : -1));
  }

  function onStageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      choose(selected + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      choose(selected - 1);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setChapter((value) => (value + 1) % video.chapters.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setChapter((value) => (value - 1 + video.chapters.length) % video.chapters.length);
    }
  }

  return (
    <section className={styles.screeningRoom} aria-labelledby="now-screening">
      <aside className={styles.programme} aria-label="放映节目单">
        <div className={styles.programmeHeading}>
          <FilmReel aria-hidden="true" size={25} weight="duotone" />
          <div>
            <p className="atlas-kicker">PROGRAMME</p>
            <span>{String(selected + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}</span>
          </div>
        </div>
        <div className={styles.programmeList} aria-label="节目列表">
          {videos.map((item, index) => (
            <button
              key={item.index}
              type="button"
              aria-pressed={selected === index}
              onClick={() => choose(index)}
            >
              <span>{item.index}</span>
              <strong>{item.title}</strong>
              <small>{item.category}</small>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className={styles.programmeControls} aria-label="切换节目">
          <button type="button" onClick={() => choose(selected - 1)} aria-label="上一个节目">
            <ArrowLeft aria-hidden="true" size={20} />
          </button>
          <span>点选 / 方向键 / 横向甩动</span>
          <button type="button" onClick={() => choose(selected + 1)} aria-label="下一个节目">
            <ArrowRight aria-hidden="true" size={20} />
          </button>
        </div>
      </aside>

      <div className={styles.auditorium}>
        <div className={styles.projector} aria-hidden="true">
          <span />
          <motion.i
            animate={{ opacity: [0.22, 0.52, 0.28], scaleX: [0.96, 1.04, 0.98] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className={styles.screenRig}
          ref={undefined}
          tabIndex={0}
          role="group"
          aria-label={`投影舞台：${video.title}。左右方向键切换节目，上下方向键切换章节。`}
          onKeyDown={onStageKeyDown}
          onPointerEnter={(event) => {
            bounds.current = event.currentTarget.getBoundingClientRect();
          }}
          onPointerMove={onPointerMove}
          onPointerLeave={resetPointer}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.13}
          onDragEnd={onDragEnd}
          style={{ rotateX, rotateY }}
        >
          <div className={styles.screenBar} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles.screenFrame}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={video.index}
                className={styles.poster}
                initial={{ opacity: 0, scale: 1.07, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(9px)" }}
                transition={{ duration: 0.52, ease: [0.2, 0.85, 0.2, 1] }}
                style={{ x: posterX, y: posterY }}
              >
                <Image
                  src={mediaUrl(video.poster)}
                  alt="AI 生成的抽象黑红琥珀投影概念图，等待替换为真实视频海报"
                  fill
                  loading="lazy"
                  fetchPriority={selected === 0 ? "high" : "auto"}
                  decoding="async"
                  sizes="(max-width: 900px) 94vw, 64vw"
                />
                <div className={styles.posterShade} />
                <div className={styles.posterTitle}>
                  <span>{video.category}</span>
                  <strong>{video.title}</strong>
                </div>
                <span className={styles.assetStamp}>AI 概念示意 · 海报待替换</span>
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={`curtain-left-${video.index}`}
              className={`${styles.curtain} ${styles.curtainLeft}`}
              initial={{ x: "0%" }}
              animate={{ x: "-86%" }}
              transition={{ duration: 0.82, delay: 0.08, ease: [0.72, 0, 0.19, 1] }}
              aria-hidden="true"
            />
            <motion.div
              key={`curtain-right-${video.index}`}
              className={`${styles.curtain} ${styles.curtainRight}`}
              initial={{ x: "0%" }}
              animate={{ x: "86%" }}
              transition={{ duration: 0.82, delay: 0.08, ease: [0.72, 0, 0.19, 1] }}
              aria-hidden="true"
            />

            <button
              className={styles.sourceButton}
              type="button"
              onClick={() => setShowSourceNotice(true)}
              aria-describedby="source-status"
            >
              <Play aria-hidden="true" size={27} weight="fill" />
              <span>片源待接入</span>
            </button>
          </div>
          <div className={styles.screenFeet} aria-hidden="true"><i /><i /></div>
        </motion.div>

        <div className={styles.screeningCaption}>
          <div>
            <ProvenanceBadge provenance={video.provenance} />
            <p>{video.summary}</p>
          </div>
          <p id="source-status" role="status" aria-live="polite">
            <SealWarning aria-hidden="true" size={18} weight="bold" />
            {showSourceNotice
              ? "这里只展示舞台与海报概念。接入你的真实视频后，播放才会启用。"
              : "默认静音且不自动播放；当前没有伪造视频内容。"}
          </p>
        </div>
      </div>

      <aside className={styles.chapterBoard} aria-labelledby="now-screening">
        <div className={styles.nowPlaying}>
          <ProjectorScreenChart aria-hidden="true" size={27} weight="duotone" />
          <p>NOW SCREENING</p>
          <h2 id="now-screening">{video.title}</h2>
          <span>{provenanceLabel(video.provenance)}</span>
        </div>
        <div className={styles.chapterHeader}>
          <span>CHAPTER MAP</span>
          <span>STRUCTURE ONLY</span>
        </div>
        <ol className={styles.chapterList}>
          {video.chapters.map((item, index) => (
            <li key={item}>
              <button
                type="button"
                aria-pressed={chapter === index}
                onClick={() => setChapter(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${video.index}-${chapter}`}
            className={styles.chapterReadout}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
          >
            <span>SELECTED CHAPTER</span>
            <strong>{video.chapters[chapter]}</strong>
            <p>章节名称是内容结构占位，不代表已有真实时间码。</p>
          </motion.div>
        </AnimatePresence>
      </aside>
    </section>
  );
}
