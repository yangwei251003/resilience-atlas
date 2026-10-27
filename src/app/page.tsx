import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Lightning } from "@phosphor-icons/react/dist/ssr";
import { PortalScene } from "@/components/home/portal-scene";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { identity, traits, worlds } from "@/content/site";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "百折万象｜个人 AI 作品集与网页版简历" },
  description: "进入百折万象：AI 项目、荣誉、简历、文章、视频和照片组成的七个个人世界。",
};

export default function Home() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.gridLines} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={`${styles.kicker} atlas-kicker`}>
            <span>00</span>
            PERSONAL UNIVERSE · STILL BECOMING
          </p>
          <h1 id="hero-title">
            <span>百折</span>
            <span className={styles.titleShift}>万象</span>
          </h1>
          <p className={styles.statement}>{identity.statement}</p>
          <p className={styles.intro}>{identity.longStatement}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/projects">
              <span>自由漫游</span>
              <ArrowRight aria-hidden="true" size={20} weight="bold" />
            </Link>
            <Link className={styles.secondaryAction} href="/about">
              <Lightning aria-hidden="true" size={18} weight="fill" />
              90 秒能力路径
            </Link>
          </div>
          <div className={styles.identityLine}>
            <span>{identity.name}</span>
            <span>{identity.role}</span>
          </div>
        </div>

        <PortalScene />

      </section>

      <section className={styles.traitRail} aria-label="个人品牌特质">
        <div>
          {[...traits, ...traits].map((trait, index) => (
            <span key={`${trait}-${index}`} aria-hidden={index >= traits.length ? true : undefined}>
              {trait}
              <i aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      <section className={styles.manifesto} aria-labelledby="manifesto-title">
        <div className={styles.manifestoIndex}>
          <span>WHY THIS EXISTS</span>
          <strong>01 / 03</strong>
        </div>
        <div className={styles.manifestoBody}>
          <p className="atlas-kicker">先为自己建立，再向世界证明</p>
          <h2 id="manifesto-title">
            我不想把自己压缩成一张模板简历。
            <span>我想让每一种兴趣，都拥有自己的重力。</span>
          </h2>
          <div className={styles.manifestoNotes}>
            <p>
              这里首先服务于我自己的感受与长期记录；也让老师、同学和朋友能一眼看见惊喜，让招聘者和合作伙伴沿着清楚证据迅速判断能力。
            </p>
            <p>
              七个页面会使用不同的排版、材质、色域与交互语法。共享的只有身份、韧性线、信号朱和对真实性的坚持。
            </p>
          </div>
        </div>
      </section>

      <section className={styles.worldIndex} aria-labelledby="world-index-title">
        <header>
          <p className="atlas-kicker">THE SEVEN WORLDS</p>
          <h2 id="world-index-title">选择一种观看我的方式。</h2>
          <p>每扇门都有独立视觉世界和标志性交互，移动端也保留完整体验。</p>
        </header>
        <ol>
          {worlds.slice(1).map((world) => (
            <li key={world.id} style={{ "--world-accent": world.accent } as CSSProperties}>
              <Link href={world.href}>
                <span className={styles.worldNumber}>{world.index}</span>
                <span className={styles.worldTitle}>
                  <strong>{world.title}</strong>
                  <small>{world.english}</small>
                </span>
                <span className={styles.worldPromise}>{world.promise}</span>
                <span className={styles.worldGo}>
                  {world.invitation}
                  <ArrowRight aria-hidden="true" size={20} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <footer className={styles.footer}>
        <div>
          <p className="atlas-kicker">BUILD STATE · V0.1</p>
          <h2>这不是完成品。<br />这是下一版的起点。</h2>
        </div>
        <div className={styles.footerMeta}>
          <ProvenanceBadge provenance="ai-generated" />
          <p>首页主视觉为 AI 概念示意，后续将替换为你的真实头像、IP 或个人品牌影像。</p>
        </div>
      </footer>
    </main>
  );
}
