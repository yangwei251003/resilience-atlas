"use client";

import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BracketsSquare,
  ClockCountdown,
  Compass,
  EnvelopeSimple,
  IdentificationCard,
  Quotes,
  Rows,
  Sparkle,
  UserFocus,
} from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { experiences, identity, projects, traits } from "@/content/site";
import styles from "./about.module.css";

type ResumeMode = "proof" | "person";

const capabilities = [
  {
    code: "01",
    name: "问题定义",
    note: "先确认边界、证据与真正需要被改变的体验。",
  },
  {
    code: "02",
    name: "AI 协作",
    note: "把生成、判断、复核与责任组织成可解释的工作流。",
  },
  {
    code: "03",
    name: "交互表达",
    note: "让视觉、动效和内容共同回答，而不只负责装饰。",
  },
  {
    code: "04",
    name: "持续复盘",
    note: "保留失败提供的信息，并让它真实改变下一版。",
  },
] as const;

export function SwissResume() {
  const [mode, setMode] = useState<ResumeMode>("proof");
  const identityCardRef = useRef<HTMLDivElement | null>(null);
  const identityCardBounds = useRef<DOMRect | null>(null);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const smoothX = useSpring(cardX, { stiffness: 180, damping: 24 });
  const smoothY = useSpring(cardY, { stiffness: 180, damping: 24 });
  const rotateY = useTransform(smoothX, [-1, 1], [-7, 7]);
  const rotateX = useTransform(smoothY, [-1, 1], [6, -6]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.32 });

  useEffect(() => {
    function updateIdentityCardBounds() {
      if (identityCardBounds.current && identityCardRef.current) {
        identityCardBounds.current = identityCardRef.current.getBoundingClientRect();
      }
    }

    window.addEventListener("resize", updateIdentityCardBounds, { passive: true });
    return () => window.removeEventListener("resize", updateIdentityCardBounds);
  }, []);

  function tiltIdentityCard(event: PointerEvent<HTMLDivElement>) {
    const rect = identityCardBounds.current;
    if (!rect) return;
    cardX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    cardY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function beginIdentityCardGesture(event: PointerEvent<HTMLDivElement>) {
    identityCardBounds.current = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    tiltIdentityCard(event);
  }

  function endIdentityCardGesture(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetIdentityCard();
  }

  function resetIdentityCard() {
    identityCardBounds.current = null;
    cardX.set(0);
    cardY.set(0);
  }

  return (
    <>
      <motion.div className={styles.progressLine} style={{ scaleX: progress }} aria-hidden="true" />

      <header className={styles.masthead}>
        <div className={styles.mastMeta}>
          <p>03 / SWISS CV</p>
          <span>网页版简历 · 持续校准</span>
        </div>
        <div className={styles.titleGrid}>
          <h1>
            先读证据，
            <span>再认识我。</span>
          </h1>
          <p className={styles.declaration}>{identity.statement}</p>
          <div className={styles.issue} aria-label="版本信息">
            <span>RESILIENCE ATLAS</span>
            <strong>CV / 01</strong>
          </div>
        </div>
      </header>

      <section className={styles.switchboard} aria-labelledby="reading-mode-title">
        <div className={styles.switchCopy}>
          <p id="reading-mode-title">选择阅读密度</p>
          <span>同一份资料，两种抵达方式。切换不会隐藏打印内容。</span>
        </div>
        <div className={styles.modeTabs} role="group" aria-label="简历阅读方式">
          <button
            type="button"
            aria-pressed={mode === "proof"}
            onClick={() => setMode("proof")}
          >
            {mode === "proof" && <motion.i layoutId="resume-mode" aria-hidden="true" />}
            <ClockCountdown aria-hidden="true" size={21} weight="bold" />
            <span>
              <strong>90 秒证据</strong>
              <small>给招聘者与合作者</small>
            </span>
          </button>
          <button
            type="button"
            aria-pressed={mode === "person"}
            onClick={() => setMode("person")}
          >
            {mode === "person" && <motion.i layoutId="resume-mode" aria-hidden="true" />}
            <UserFocus aria-hidden="true" size={21} weight="bold" />
            <span>
              <strong>完整人格</strong>
              <small>给愿意慢读的人</small>
            </span>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          当前阅读方式：{mode === "proof" ? "90 秒证据" : "完整人格"}
        </p>
      </section>

      <div className={styles.resumeStage}>
        <motion.section
          hidden={mode !== "proof"}
          inert={mode !== "proof"}
          className={`${styles.resumePanel} ${styles.proofPanel}`}
          aria-labelledby="proof-title"
          initial={false}
          animate={mode === "proof" ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={styles.proofHeadline}>
            <span>THE 90-SECOND READ</span>
            <h2 id="proof-title">我能把模糊想法，推进为可演示、可复盘的作品。</h2>
            <ArrowDownRight aria-hidden="true" size={54} weight="thin" />
          </div>

          <motion.div
            ref={identityCardRef}
            className={styles.identityCard}
            onPointerEnter={(event) => {
              identityCardBounds.current = event.currentTarget.getBoundingClientRect();
            }}
            onPointerDown={beginIdentityCardGesture}
            onPointerMove={tiltIdentityCard}
            onPointerLeave={resetIdentityCard}
            onPointerUp={endIdentityCardGesture}
            onPointerCancel={endIdentityCardGesture}
            style={{ rotateX, rotateY }}
          >
            <div className={styles.identityNumber}>ID / 03</div>
            <div className={styles.portraitPlaceholder} aria-label="头像占位">
              <IdentificationCard aria-hidden="true" size={74} weight="thin" />
              <span>头像待替换</span>
            </div>
            <div className={styles.identityCopy}>
              <p>NAME</p>
              <h3>{identity.name}</h3>
              <span>{identity.role}</span>
              <ProvenanceBadge provenance={identity.provenance} />
            </div>
          </motion.div>

          <div className={styles.capabilityMatrix}>
            <div className={styles.sectionLabel}>
              <BracketsSquare aria-hidden="true" size={22} weight="bold" />
              <span>可被作品验证的工作方式</span>
            </div>
            <ol>
              {capabilities.map((capability) => (
                <li key={capability.code}>
                  <span>{capability.code}</span>
                  <strong>{capability.name}</strong>
                  <p>{capability.note}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.projectProof}>
            <div className={styles.sectionLabel}>
              <Rows aria-hidden="true" size={22} weight="bold" />
              <span>代表作品席位</span>
            </div>
            <div className={styles.projectRows}>
              {projects.slice(0, 3).map((project) => (
                <article key={project.slug}>
                  <span>{project.index}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.teaser}</p>
                  </div>
                  <div className={styles.projectState}>
                    <small>{project.state}</small>
                    <ProvenanceBadge provenance={project.provenance} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.fastFacts} aria-label="快速联系信息">
            <div>
              <span>LOCATED</span>
              <strong>{identity.location}</strong>
            </div>
            <div>
              <span>OPEN TO</span>
              <strong>{identity.availability}</strong>
            </div>
            <div>
              <span>CONTACT</span>
              <strong>{identity.emailLabel}</strong>
            </div>
            <p>真实联系方式接入前不生成跳转链接。</p>
          </aside>
        </motion.section>

        <motion.section
          hidden={mode !== "person"}
          inert={mode !== "person"}
          className={`${styles.resumePanel} ${styles.personPanel}`}
          aria-labelledby="person-title"
          initial={false}
          animate={mode === "person" ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={styles.personIntro}>
            <div className={styles.sectionLabel}>
              <Quotes aria-hidden="true" size={24} weight="fill" />
              <span>PERSON BEHIND THE PROOF</span>
            </div>
            <h2 id="person-title">能力是截面，人格才是它持续生长的原因。</h2>
            <p>{identity.longStatement}</p>
          </div>

          <div className={styles.traitField} aria-label="个人特质">
            {traits.map((trait, index) => (
              <motion.span
                key={trait}
                initial={{ opacity: 0, y: 18 }}
                animate={mode === "person" ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ delay: index * 0.045, duration: 0.38 }}
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
                {trait}
              </motion.span>
            ))}
          </div>

          <div className={styles.timeline}>
            <div className={styles.sectionLabel}>
              <Compass aria-hidden="true" size={24} weight="bold" />
              <span>教育与实践时间线</span>
            </div>
            <ol>
              {experiences.map((experience, index) => (
                <li key={`${experience.kind}-${index}`}>
                  <div className={styles.timeCode}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{experience.period}</strong>
                  </div>
                  <div className={styles.timeCopy}>
                    <p>{experience.kind}</p>
                    <h3>{experience.title}</h3>
                    <span>{experience.summary}</span>
                  </div>
                  <small>{experience.evidence}</small>
                </li>
              ))}
            </ol>
          </div>

          <blockquote className={styles.manifesto}>
            <Sparkle aria-hidden="true" size={34} weight="fill" />
            <p>我不想把“百折不挠”写成一句漂亮结论。我更想留下每一次被推翻的判断，以及它怎样让下一次尝试变得更准。</p>
            <cite>个人叙事方向 · 待由真实经历改写</cite>
          </blockquote>

          <div className={styles.contactLedger}>
            <div>
              <EnvelopeSimple aria-hidden="true" size={30} weight="bold" />
              <span>联系入口</span>
              <strong>{identity.emailLabel}</strong>
            </div>
            <div>
              <ArrowUpRight aria-hidden="true" size={30} weight="bold" />
              <span>公开主页</span>
              <strong>{identity.socialLabel}</strong>
            </div>
            <p>以上均为显式占位，不提供虚构地址；替换真实信息后再启用链接。</p>
          </div>
        </motion.section>
      </div>

      <footer className={styles.resumeFooter}>
        <span>BRIEF ENOUGH TO SCAN</span>
        <strong>完整到足以被理解。</strong>
        <span>PRINTABLE DOM / PLACEHOLDERS DECLARED</span>
      </footer>
    </>
  );
}
