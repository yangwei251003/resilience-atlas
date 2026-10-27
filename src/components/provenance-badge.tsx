import { SealCheck, Sparkle, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { provenanceLabel, type Provenance } from "@/content/site";
import styles from "./provenance-badge.module.css";

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const Icon =
    provenance === "final" ? SealCheck : provenance === "ai-generated" ? Sparkle : SquaresFour;

  return (
    <span className={styles.badge} data-provenance={provenance}>
      <Icon aria-hidden="true" size={14} weight="bold" />
      {provenanceLabel(provenance)}
    </span>
  );
}
