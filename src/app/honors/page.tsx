import type { Metadata } from "next";
import { MuseumVault } from "./museum-vault";
import styles from "./honors.module.css";

export const metadata: Metadata = {
  title: "成就荣誉",
  description:
    "进入 Museum Vault：聚焦并开启每一座荣誉展柜，查看奖项背景、个人角色与待核验的真实证据。",
};

export default function HonorsPage() {
  return (
    <main id="main-content" className={`${styles.page} atlas-page`}>
      <MuseumVault />
    </main>
  );
}
