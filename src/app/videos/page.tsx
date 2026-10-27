import type { Metadata } from "next";
import { CinemaStage } from "./cinema-stage";
import styles from "./videos.module.css";

export const metadata: Metadata = {
  title: "视频放映",
  description:
    "进入 Cinema：用节目单、章节灯板与投影舞台保存作品演示、比赛复盘和表达影像。当前片源与海报均清晰标注为占位或 AI 概念示意。",
};

export default function VideosPage() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <section className={styles.hero} aria-labelledby="cinema-title">
        <div className={styles.marquee} aria-hidden="true">
          <span>PROCESS / PROOF / PERSPECTIVE / PROCESS / PROOF / PERSPECTIVE /</span>
        </div>
        <div className={styles.heroCopy}>
          <p className={`${styles.kicker} atlas-kicker`}>05 · CINEMA / STORIES IN MOTION</p>
          <h1 id="cinema-title">
            把过程留在
            <span>光里。</span>
          </h1>
        </div>
        <div className={styles.heroAside}>
          <span className={styles.reelNumber}>REEL 00</span>
          <p>
            这里将放映作品演示、比赛复盘与个人表达。当前没有接入真实片源，所有入口都会诚实保持“待替换”。
          </p>
          <div className={styles.formatLine}>
            <span>16:9</span>
            <i aria-hidden="true" />
            <span>NO AUTOPLAY</span>
            <i aria-hidden="true" />
            <span>AI CONCEPT</span>
          </div>
        </div>
      </section>

      <CinemaStage />

      <section className={styles.credits} aria-labelledby="credits-title">
        <p className="atlas-kicker">SCREENING PRINCIPLE</p>
        <h2 id="credits-title">影像不是装饰，是作品怎样发生的另一份证词。</h2>
        <div className={styles.creditsTrack}>
          <p><span>01</span>先说问题，再给镜头。</p>
          <p><span>02</span>让选择、受阻与改道被看见。</p>
          <p><span>03</span>真实片源接入前，不制造播放假象。</p>
        </div>
      </section>
    </main>
  );
}
