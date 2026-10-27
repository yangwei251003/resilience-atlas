"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { worlds } from "@/content/site";
import { mediaUrl } from "@/lib/media-url";
import styles from "./portal-scene.module.css";

export function PortalScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const pointerFrame = useRef<number | null>(null);
  const scrollFrame = useRef<number | null>(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    function updateScrollDepth() {
      scrollFrame.current = null;
      const scene = sceneRef.current;
      const art = artRef.current;
      const line = lineRef.current;
      if (!scene || !art || !line) return;

      const rect = scene.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      art.style.setProperty("--art-y", `${progress * 110}px`);
      art.style.setProperty("--art-scale", String(1 - progress * 0.1));
      line.style.setProperty("--line-x", `${progress * 80}px`);
    }

    function scheduleScrollDepth() {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = window.requestAnimationFrame(updateScrollDepth);
    }

    updateScrollDepth();
    window.addEventListener("scroll", scheduleScrollDepth, { passive: true });
    window.addEventListener("resize", scheduleScrollDepth);

    return () => {
      window.removeEventListener("scroll", scheduleScrollDepth);
      window.removeEventListener("resize", scheduleScrollDepth);
      if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  function setTilt(x: number, y: number) {
    if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = null;
      tiltRef.current?.style.setProperty("--rotate-x", `${y * -6}deg`);
      tiltRef.current?.style.setProperty("--rotate-y", `${x * 7}deg`);
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = bounds.current;
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt(x, y);
  }

  return (
    <div
      className={styles.scene}
      ref={sceneRef}
      onPointerEnter={(event) => { bounds.current = event.currentTarget.getBoundingClientRect(); }}
      onPointerDown={(event) => {
        bounds.current = event.currentTarget.getBoundingClientRect();
        if (event.pointerType === "touch") event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        setTilt(0, 0);
      }}
      onPointerCancel={() => {
        setTilt(0, 0);
      }}
      onPointerLeave={() => {
        setTilt(0, 0);
        bounds.current = null;
      }}
    >
      <div className={styles.tilt} ref={tiltRef}>
        <div className={styles.artPlane} ref={artRef}>
          <Image
            src={mediaUrl("/media/hero-resilience-atlas-ai.webp")}
            alt="AI 概念示意：黑色与骨白色折叠结构被一条信号红线重新缝合并向上延伸"
            fill
            priority
            fetchPriority="high"
            decoding="sync"
            sizes="(max-width: 800px) 100vw, 62vw"
          />
          <span className={styles.imageLabel}>AI CONCEPT · REPLACE LATER</span>
        </div>
        <div className={styles.depthPanelOne} aria-hidden="true" />
        <div className={styles.depthPanelTwo} aria-hidden="true" />
        <div className={styles.resilienceLine} ref={lineRef} aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </div>

      <div className={styles.portalDeck} aria-label="世界快速入口">
        <p><span>{String(active).padStart(2, "0")}</span>/ 06 · FOCUS A WORLD</p>
        <ol>
          {worlds.slice(1).map((world, index) => {
            const number = index + 1;
            return (
              <li
                key={world.id}
                data-active={active === number}
                style={{ "--portal-accent": world.accent } as CSSProperties}
              >
                <Link
                  href={world.href}
                  onPointerEnter={() => setActive(number)}
                  onFocus={() => setActive(number)}
                  onPointerDown={() => setActive(number)}
                >
                  <span>{world.index}</span>
                  <strong>{world.title}</strong>
                  <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
