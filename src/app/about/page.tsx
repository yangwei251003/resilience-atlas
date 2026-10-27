import type { Metadata } from "next";
import { SwissResume } from "./swiss-resume";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "关于与简历",
  description:
    "进入 Swiss CV：在 90 秒能力证据与完整人格叙事之间切换，阅读教育、实践、方法与联系方式占位。",
};

export default function AboutPage() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <SwissResume />
    </main>
  );
}
