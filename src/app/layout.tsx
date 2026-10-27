import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "百折万象｜个人 AI 作品集",
    template: "%s｜百折万象",
  },
  description:
    "一座持续生长的个人数字世界：AI 项目、荣誉经历、文章、影像与生活记录。当前内容含清晰标注的占位与 AI 概念素材。",
  applicationName: "百折万象",
  authors: [{ name: "[你的名字]" }],
  creator: "[你的名字]",
  keywords: ["个人作品集", "网页版简历", "AI 项目", "博客", "百折万象"],
  robots: {
    index: process.env.NEXT_PUBLIC_SITE_READY === "true",
    follow: process.env.NEXT_PUBLIC_SITE_READY === "true",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d12",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
