import type { Metadata } from "next";
import { ContactTable } from "./contact-table";
import styles from "./photos.module.css";

export const metadata: Metadata = {
  title: "个人照片墙",
  description:
    "进入 Contact Sheet：在接触印样灯台上整理生活切片、照片故事与公开边界。当前图像均为清晰标注的 AI 概念示意或待替换席位。",
};

export default function PhotosPage() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <section className={styles.hero} aria-labelledby="photos-title">
        <p className={`${styles.kicker} atlas-kicker`}>06 · CONTACT SHEET / LIFE IN FRAMES</p>
        <div className={styles.titleLockup}>
          <span aria-hidden="true">CONTACT</span>
          <h1 id="photos-title">生活不是瀑布流。</h1>
          <span aria-hidden="true">SHEET</span>
        </div>
        <div className={styles.heroFooter}>
          <p>它更像一卷底片：有过曝，有停顿，也有后来才看懂的一格。</p>
          <div aria-label="照片墙当前状态">
            <span>ROLLS 02</span>
            <span>REAL PHOTOS 00</span>
            <span>AI CONCEPT / LABELED</span>
          </div>
        </div>
      </section>

      <ContactTable />

      <section className={styles.developing} aria-labelledby="developing-title">
        <div className={styles.developingLead}>
          <p className="atlas-kicker">DEVELOPING NOTES</p>
          <h2 id="developing-title">先决定怎样记录，再把真实照片放进来。</h2>
        </div>
        <ol>
          <li><span>01</span><strong>公开边界</strong><p>接入前确认人物授权、地点精度与隐私遮挡。</p></li>
          <li><span>02</span><strong>时间证据</strong><p>只补充真实日期、地点与当时留下的原始记录。</p></li>
          <li><span>03</span><strong>一格一感受</strong><p>不追求堆满，保留为什么按下快门和后来怎样理解。</p></li>
          <li><span>04</span><strong>替换 AI 样片</strong><p>真实照片上线后，同步更新来源标识与替代文本。</p></li>
        </ol>
      </section>
    </main>
  );
}
