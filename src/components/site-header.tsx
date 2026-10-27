"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { identity, worlds } from "@/content/site";
import styles from "./site-header.module.css";

function getWorld(pathname: string) {
  if (pathname === "/") return worlds[0];
  return worlds.find((world) => world.href !== "/" && pathname.startsWith(world.href)) ?? worlds[0];
}

export function SiteHeader() {
  const pathname = usePathname();
  const activeWorld = getWorld(pathname);
  const headerTone = activeWorld.id === "honors" || activeWorld.id === "about" ? "light" : "dark";
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const main = document.getElementById("main-content");
    const dialog = dialogRef.current;
    const trigger = menuButtonRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;
    const focusTimer = window.setTimeout(() => first?.focus({ preventScroll: true }), 0);
    const settledFocusTimer = window.setTimeout(() => {
      if (dialog && !dialog.contains(document.activeElement)) first?.focus({ preventScroll: true });
    }, 180);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        trigger?.focus();
      } else if (!event.shiftKey && document.activeElement === trigger) {
        event.preventDefault();
        first.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        trigger?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(settledFocusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (main) main.inert = false;
      trigger?.focus();
    };
  }, [open]);

  return (
    <header className={styles.header} data-site-header data-open={open} data-tone={headerTone}>
      <Link className={styles.brand} href="/" aria-label={`百折万象 ${identity.name} 首页`}>
        <span className={styles.mark} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>
          <strong>百折万象</strong>
          <small>{identity.name}</small>
        </span>
      </Link>

      <div className={styles.location} aria-label={`当前世界：${activeWorld.title}`}>
        <span>{activeWorld.index}</span>
        <span>{activeWorld.title}</span>
      </div>

      <button
        ref={menuButtonRef}
        className={styles.menuButton}
        type="button"
        aria-label={open ? "关闭七界导航" : "打开七界导航"}
        aria-expanded={open}
        aria-controls="atlas-world-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "关闭" : "七界导航"}</span>
        {open ? <X aria-hidden="true" size={22} /> : <List aria-hidden="true" size={22} />}
      </button>

      <div
        ref={dialogRef}
        className={styles.menu}
        id="atlas-world-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="atlas-world-menu-title"
        aria-hidden={!open}
      >
        <div className={styles.menuIntro}>
          <p>RESILIENCE ATLAS</p>
          <h2 id="atlas-world-menu-title">同一个我，<br />七种观看方式。</h2>
          <p className={styles.menuNote}>移动、触摸与键盘都有完整入口。选择一扇门，世界会换，内核不变。</p>
        </div>
        <nav aria-label="主要导航">
          <ol className={styles.worldList}>
            {worlds.map((world) => {
              const isActive = world.id === activeWorld.id;
              return (
                <li key={world.id}>
                  <Link
                    href={world.href}
                    aria-current={isActive ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    style={{ "--item-accent": world.accent } as React.CSSProperties}
                  >
                    <span className={styles.worldIndex}>{world.index}</span>
                    <span className={styles.worldName}>
                      <strong>{world.title}</strong>
                      <small>{world.english}</small>
                    </span>
                    <span className={styles.worldInvitation}>{world.invitation}</span>
                    <ArrowUpRight aria-hidden="true" size={24} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}
