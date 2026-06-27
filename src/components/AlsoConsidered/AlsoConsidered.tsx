"use client";

import type { PestEvaluation } from "@/types";
import styles from "./AlsoConsidered.module.css";

interface AlsoConsideredProps {
  candidates: PestEvaluation[]; // already sorted desc; we show items 2..4
  onSelect?: () => void;
}

export default function AlsoConsidered({ candidates, onSelect }: AlsoConsideredProps) {
  const others = candidates.slice(1, 4);
  if (others.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Also considered</p>
      <div className={styles.row}>
        {others.map((c) => (
          <button key={c.id} className={styles.pill} onClick={onSelect} type="button">
            <span className={styles.name}>{c.pest_name}</span>
            <span className={styles.pct}>{c.confidence_pct}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}
