"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { worlds } from "@/content/site";
import styles from "./route-transition-signature.module.css";

export function RouteTransitionSignature() {
  const pathname = usePathname();
  const world = pathname === "/"
    ? worlds[0]
    : worlds.find((item) => item.href !== "/" && pathname.startsWith(item.href)) ?? worlds[0];

  return (
    <div
      className={styles.signature}
      style={{ "--route-accent": world.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
      <i />
    </div>
  );
}
