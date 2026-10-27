"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  Certificate,
  CheckSquareOffset,
  DoorOpen,
  Fingerprint,
  Flashlight,
  MagnifyingGlass,
  ShieldCheckered,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { honors } from "@/content/site";
import styles from "./honors.module.css";

export function MuseumVault() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const cabinetRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const vaultRef = useRef<HTMLElement | null>(null);
  const vaultBounds = useRef<DOMRect | null>(null);
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const smoothLightX = useSpring(lightX, { stiffness: 120, damping: 24, mass: 0.45 });
  const smoothLightY = useSpring(lightY, { stiffness: 120, damping: 24, mass: 0.45 });
  const selectedHonor = honors[active];

  useEffect(() => {
    function updateVaultBounds() {
      if (vaultBounds.current && vaultRef.current) {
        vaultBounds.current = vaultRef.current.getBoundingClientRect();
      }
    }

    window.addEventListener("resize", updateVaultBounds, { passive: true });
    return () => window.removeEventListener("resize", updateVaultBounds);
  }, []);

  function moveLight(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const rect = vaultBounds.current;
    if (!rect) return;
    lightX.set(event.clientX - rect.left - 180);
    lightY.set(event.clientY - rect.top - 180);
  }

  function changeCabinet(next: number, moveFocus = false) {
    const normalized = (next + honors.length) % honors.length;
    setActive(normalized);
    setOpen(normalized);
    requestAnimationFrame(() => {
      cabinetRefs.current[normalized]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      if (moveFocus) cabinetRefs.current[normalized]?.focus({ preventScroll: true });
    });
  }

  function onCabinetKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      changeCabinet(index + 1, true);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      changeCabinet(index - 1, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      changeCabinet(0, true);
    }
    if (event.key === "End") {
      event.preventDefault();
      changeCabinet(honors.length - 1, true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(null);
    }
  }

  return (
    <>
      <header className={styles.museumIntro}>
        <div className={styles.archiveCode}>
          <span>02 / MUSEUM VAULT</span>
          <span>COLLECTION STATUS · AWAITING VERIFIED MATERIAL</span>
        </div>
        <div className={styles.introComposition}>
          <div className={styles.introSeal} aria-hidden="true">
            <ShieldCheckered size={48} weight="thin" />
            <i>RV</i>
          </div>
          <h1>
            荣誉不是
            <span>金边。</span>
          </h1>
          <p>它应该留下时间、现场、个人角色与能被核验的证据。真实材料到来之前，这座博物馆只陈列诚实的空展柜。</p>
        </div>
        <div className={styles.museumRules} aria-label="展馆原则">
          <span><strong>Ⅰ</strong> 聚焦一座展柜</span>
          <span><strong>Ⅱ</strong> 开柜阅读背景</span>
          <span><strong>Ⅲ</strong> 接入材料后核验</span>
        </div>
      </header>

      <section
        ref={vaultRef}
        className={styles.vault}
        aria-labelledby="vault-title"
        onPointerEnter={(event) => {
          vaultBounds.current = event.currentTarget.getBoundingClientRect();
        }}
        onPointerMove={moveLight}
        onPointerLeave={() => {
          vaultBounds.current = null;
          lightX.set(0);
          lightY.set(0);
        }}
      >
        <motion.div
          className={styles.spotlight}
          style={{ x: smoothLightX, y: smoothLightY }}
          aria-hidden="true"
        />
        <div className={styles.vaultHeading}>
          <div>
            <p>THE COLLECTION ROOM</p>
            <h2 id="vault-title">请选择一份值得被验证的记录。</h2>
          </div>
          <div className={styles.inputLegend}>
            <Flashlight aria-hidden="true" size={22} weight="fill" />
            <span>鼠标寻光 · 触摸滑动 · 方向键巡馆</span>
          </div>
        </div>

        <div className={styles.cabinetViewport} aria-label="可横向滑动的荣誉展柜">
          <div className={styles.cabinetDeck}>
          {honors.map((honor, index) => {
            const isActive = active === index;
            const isOpen = open === index;

            return (
              <motion.article
                key={honor.index}
                className={styles.cabinet}
                data-active={isActive}
                animate={{
                  z: isActive ? 58 : 0,
                  y: isActive ? -18 : 10,
                  rotateY: isActive ? 0 : index < active ? 7 : -7,
                }}
                transition={{ type: "spring", stiffness: 145, damping: 21 }}
              >
                <div className={styles.cabinetInterior} aria-hidden="true">
                  <Certificate size={82} weight="thin" />
                  <span>MATERIAL PENDING</span>
                </div>
                <button
                  ref={(node) => { cabinetRefs.current[index] = node; }}
                  type="button"
                  className={styles.cabinetDoorButton}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? `honor-evidence-${index}` : undefined}
                  aria-label={`${isOpen ? "关闭" : "打开"}${honor.title}展柜`}
                  onFocus={() => setActive(index)}
                  onClick={() => {
                    setActive(index);
                    setOpen(isOpen ? null : index);
                  }}
                  onKeyDown={(event) => onCabinetKeyDown(event, index)}
                >
                  <motion.span
                    className={styles.cabinetDoor}
                    animate={{ rotateY: isOpen ? -104 : 0, x: isOpen ? -8 : 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 19 }}
                  >
                    <span className={styles.doorIndex}>{honor.index}</span>
                    <Fingerprint aria-hidden="true" size={40} weight="thin" />
                    <strong>{honor.title}</strong>
                    <small>{honor.year}</small>
                    <i>{isOpen ? "CLOSE" : "OPEN"}</i>
                  </motion.span>
                </button>
                <div className={styles.plaque}>
                  <span>{honor.level}</span>
                  <ProvenanceBadge provenance={honor.provenance} />
                </div>
                <motion.div
                  className={styles.cabinetDimmer}
                  aria-hidden="true"
                  animate={{ opacity: isActive ? 0 : 0.42 }}
                  transition={{ duration: 0.28 }}
                />
              </motion.article>
            );
          })}
          </div>
        </div>

        <div className={styles.vaultControls}>
          <button type="button" onClick={() => changeCabinet(active - 1)} aria-label="上一座展柜">
            <ArrowLeft aria-hidden="true" size={19} weight="bold" />
            上一柜
          </button>
          <span aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(honors.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => changeCabinet(active + 1)} aria-label="下一座展柜">
            下一柜
            <ArrowRight aria-hidden="true" size={19} weight="bold" />
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {open === active ? (
            <motion.section
              key={selectedHonor.index}
              id={`honor-evidence-${active}`}
              className={styles.evidenceDrawer}
              aria-labelledby={`evidence-title-${active}`}
              initial={{ opacity: 0, y: 42, rotateX: -7 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -24, rotateX: 5 }}
              transition={{ duration: 0.44, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className={styles.drawerRail}>
                <Archive aria-hidden="true" size={28} weight="bold" />
                <span>{selectedHonor.index}</span>
                <small>DRAWER OPEN</small>
              </div>
              <div className={styles.drawerCopy}>
                <p>{selectedHonor.level}</p>
                <h3 id={`evidence-title-${active}`}>{selectedHonor.title}</h3>
                <blockquote>{selectedHonor.context}</blockquote>
              </div>
              <dl>
                <div>
                  <dt><MagnifyingGlass aria-hidden="true" size={17} /> 证据状态</dt>
                  <dd>{selectedHonor.evidence}</dd>
                </div>
                <div>
                  <dt><CheckSquareOffset aria-hidden="true" size={17} /> 发布规则</dt>
                  <dd>奖项名称、机构、年份与个人角色全部核实后，才能从占位状态转为真实内容。</dd>
                </div>
              </dl>
              <div className={styles.drawerStamp}>
                <ProvenanceBadge provenance={selectedHonor.provenance} />
                <span>NO CLAIM WITHOUT PROOF</span>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </section>

      <section className={styles.verificationHall} aria-labelledby="verification-title">
        <div className={styles.verificationIcon} aria-hidden="true">
          <DoorOpen size={68} weight="thin" />
        </div>
        <div>
          <p>CURATORIAL POLICY</p>
          <h2 id="verification-title">这面荣誉墙，宁可暂时留白。</h2>
        </div>
        <ol>
          <li><span>01</span><strong>材料到位</strong><p>证书、官方结果页、作品或可公开证明的记录。</p></li>
          <li><span>02</span><strong>角色说清</strong><p>个人贡献、协作边界与决定性行动不含糊。</p></li>
          <li><span>03</span><strong>隐私分级</strong><p>展示前处理证书编号、姓名与不宜公开的信息。</p></li>
        </ol>
      </section>
    </>
  );
}
