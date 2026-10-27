"use client";

import Image from "next/image";
import { mediaUrl } from "@/lib/media-url";
import type { KeyboardEvent, PointerEvent } from "react";
import { useRef, useState } from "react";
import {
  Aperture,
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  FrameCorners,
  Stack,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import { photoRolls, provenanceLabel } from "@/content/site";
import styles from "./photos.module.css";

const crops = ["18% 18%", "50% 16%", "82% 20%", "20% 78%", "52% 82%", "84% 76%"] as const;

function wrap(index: number, length: number) {
  return (index + length) % length;
}

export function ContactTable() {
  const [roll, setRoll] = useState(0);
  const [frame, setFrame] = useState(0);
  const activeRoll = photoRolls[roll];
  const bounds = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 150, damping: 22, mass: 0.62 });
  const smoothY = useSpring(pointerY, { stiffness: 150, damping: 22, mass: 0.62 });
  const rotateY = useTransform(smoothX, [-1, 1], [-6.5, 6.5]);
  const rotateX = useTransform(smoothY, [-1, 1], [5, -5]);
  const glowX = useTransform(smoothX, [-1, 1], ["16%", "84%"]);
  const glowY = useTransform(smoothY, [-1, 1], ["18%", "82%"]);

  function chooseRoll(index: number) {
    setRoll(wrap(index, photoRolls.length));
    setFrame(0);
  }

  function chooseFrame(index: number) {
    setFrame(wrap(index, crops.length));
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
    if (Math.abs(info.offset.x) < 42 && Math.abs(info.velocity.x) < 240) return;
    chooseFrame(frame + (info.offset.x < 0 ? 1 : -1));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      chooseFrame(frame + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      chooseFrame(frame - 1);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      chooseRoll(roll + 1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      chooseRoll(roll - 1);
    }
  }

  return (
    <section className={styles.contactLab} aria-labelledby="contact-lab-title">
      <div className={styles.tableHeader}>
        <div>
          <Aperture aria-hidden="true" size={27} weight="duotone" />
          <p className="atlas-kicker">LIGHT TABLE / PROOF 00</p>
        </div>
        <p>点按选格 · 左右拖动 · 方向键检查 · 上下键换卷</p>
      </div>

      <div className={styles.tableLayout}>
        <motion.div
          className={styles.lightTable}
          tabIndex={0}
          role="group"
          aria-label={`接触印样灯台：${activeRoll.title}。左右方向键选择样片，上下方向键切换胶卷。`}
          onKeyDown={onKeyDown}
          onPointerEnter={(event) => {
            bounds.current = event.currentTarget.getBoundingClientRect();
          }}
          onPointerMove={onPointerMove}
          onPointerLeave={resetPointer}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.11}
          onDragEnd={onDragEnd}
          style={{ rotateX, rotateY }}
        >
          <div className={styles.tableChrome} aria-hidden="true">
            <span>CONTACT PRINTER 06</span>
            <i />
            <span>SAFE LIGHT / ON</span>
          </div>
          <motion.div
            className={styles.inspectionGlow}
            style={{ left: glowX, top: glowY }}
            animate={{ opacity: [0.42, 0.7, 0.46], scale: [0.95, 1.08, 0.98] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className={styles.scanLine}
            animate={{ y: ["-10%", "970%", "-10%"] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />

          <div className={styles.contactSheet}>
            <div className={styles.filmEdge} aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeRoll.index}
                className={styles.frameGrid}
                initial={{ opacity: 0, rotateZ: -1.7, scale: 0.97 }}
                animate={{ opacity: 1, rotateZ: 0, scale: 1 }}
                exit={{ opacity: 0, rotateZ: 1.4, scale: 1.02 }}
                transition={{ duration: 0.46, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {crops.map((position, index) => (
                  <motion.button
                    key={`${activeRoll.index}-${position}`}
                    type="button"
                    aria-pressed={frame === index}
                    aria-label={`选择 ${activeRoll.title} 的 AI 概念样片 ${String(index + 1).padStart(2, "0")}`}
                    onClick={() => chooseFrame(index)}
                    animate={frame === index ? { z: 34, rotateZ: index % 2 ? 1.2 : -1.2 } : { z: 0, rotateZ: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    <span className={styles.frameImage}>
                      <Image
                        src={mediaUrl(activeRoll.image)}
                        alt=""
                        fill
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        sizes="(max-width: 760px) 43vw, 23vw"
                        style={{ objectPosition: position }}
                      />
                    </span>
                    <span className={styles.frameCode}>
                      {activeRoll.index} · {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.frameAi}>AI 概念</span>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className={`${styles.filmEdge} ${styles.filmEdgeBottom}`} aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
            </div>
          </div>
        </motion.div>

        <aside className={styles.inspectionDesk} aria-label="选中样片说明">
          <div className={styles.deskHeading}>
            <FrameCorners aria-hidden="true" size={26} weight="duotone" />
            <span>INSPECTION / {String(frame + 1).padStart(2, "0")}</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={`${activeRoll.index}-${frame}`}
              initial={{ opacity: 0, y: 22, rotateZ: 2 }}
              animate={{ opacity: 1, y: 0, rotateZ: -1.2 }}
              exit={{ opacity: 0, y: -18, rotateZ: -2 }}
              transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className={styles.focusPrint}>
                <Image
                  src={mediaUrl(activeRoll.image)}
                  alt="AI 生成的抽象接触印样概念图，等待替换为真实个人照片"
                  fill
                  loading="lazy"
                  fetchPriority={roll === 0 && frame === 0 ? "high" : "auto"}
                  decoding="async"
                  sizes="(max-width: 860px) 88vw, 29vw"
                  style={{ objectPosition: crops[frame] }}
                />
                <span>AI 概念示意</span>
              </div>
              <figcaption>
                <span>{activeRoll.index} / FRAME {String(frame + 1).padStart(2, "0")}</span>
                <strong>{activeRoll.title}</strong>
                <p>{activeRoll.note}</p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className={styles.frameControls} aria-label="切换样片">
            <button type="button" onClick={() => chooseFrame(frame - 1)} aria-label="上一格样片">
              <ArrowLeft aria-hidden="true" size={21} />
            </button>
            <span>{String(frame + 1).padStart(2, "0")} / {String(crops.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => chooseFrame(frame + 1)} aria-label="下一格样片">
              <ArrowRight aria-hidden="true" size={21} />
            </button>
          </div>
        </aside>
      </div>

      <div className={styles.rollStory}>
        <div className={styles.rollLabel}>
          <Stack aria-hidden="true" size={24} weight="duotone" />
          <p>STORY ROLLS</p>
          <span>选择一卷，改变整张接触印样。</span>
        </div>
        <div className={styles.rollButtons} aria-label="故事胶卷">
          {photoRolls.map((item, index) => (
            <button
              key={item.index}
              type="button"
              aria-pressed={roll === index}
              onClick={() => chooseRoll(index)}
            >
              <span>{item.index}</span>
              <strong>{item.title}</strong>
              <small>{provenanceLabel(item.provenance)}</small>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className={styles.assetDisclosure}>
          <ArrowsOutSimple aria-hidden="true" size={22} />
          <div>
            <strong>视觉素材：AI 概念示意</strong>
            <p>两卷目前共用一张 AI 生成概念图做裁切测试。真实照片接入后，每格将拥有独立图像、时间与说明。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
