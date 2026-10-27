import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, LinkSimpleBreak } from "@phosphor-icons/react/dist/ssr";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { getProject, projects } from "@/content/site";
import { CaseSignal } from "./case-signal";
import styles from "./project-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return { title: "项目未找到" };
  return { title: project.title, description: project.teaser };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main
      id="main-content"
      className={`${styles.page} atlas-page`}
      style={{ "--accent": project.accent } as CSSProperties}
    >
      <header className={styles.hero}>
        <div className={styles.heroTopline}>
          <Link href="/projects"><ArrowLeft aria-hidden="true" size={18} /> 返回实验室</Link>
          <ProvenanceBadge provenance={project.provenance} />
        </div>
        <div className={styles.heroBody}>
          <div>
            <p className="atlas-kicker">{project.index} · CASE FILE</p>
            <h1>{project.title}</h1>
            <p className={styles.teaser}>{project.teaser}</p>
          </div>
          <dl>
            <div><dt>类型</dt><dd>{project.type}</dd></div>
            <div><dt>状态</dt><dd>{project.state}</dd></div>
            <div><dt>外链</dt><dd><LinkSimpleBreak size={15} aria-hidden="true" /> 待真实链接接入</dd></div>
          </dl>
        </div>
        <div className={styles.blueprint} aria-label="项目视觉占位，非实际界面">
          <div className={styles.blueprintGrid} aria-hidden="true" />
          <div className={styles.moduleOne}><span>INPUT</span><strong>?</strong></div>
          <div className={styles.moduleTwo}><span>DECISION</span><strong>→</strong></div>
          <div className={styles.moduleThree}><span>OUTPUT</span><strong>∴</strong></div>
          <p>PROJECT VISUAL PLACEHOLDER · 非实际界面</p>
        </div>
      </header>

      <CaseSignal project={project} />

      <section className={styles.tools} aria-labelledby="tools-title">
        <p className="atlas-kicker">CAPABILITY SIGNALS</p>
        <h2 id="tools-title">能力不由标签证明，<br />但标签可以帮助快速定位。</h2>
        <ul>{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
        <p>技术栈、本人角色、真实指标和作品链接将在你提供资料后逐项核验，不用概念数据填满页面。</p>
      </section>

      <footer className={styles.nextCase}>
        <span>NEXT CASE · {nextProject.index}</span>
        <Link href={`/projects/${nextProject.slug}`}>
          {nextProject.title}
          <ArrowRight aria-hidden="true" size={30} />
        </Link>
      </footer>
    </main>
  );
}
