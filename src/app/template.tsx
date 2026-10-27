import type { ReactNode } from "react";
import { RouteTransitionSignature } from "@/components/route-transition-signature";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <RouteTransitionSignature />
    </>
  );
}
