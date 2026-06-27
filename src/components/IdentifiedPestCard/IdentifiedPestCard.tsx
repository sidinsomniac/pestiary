"use client";

import { motion } from "framer-motion";
import type { IdentifiedPest, PestEvaluation } from "@/types";
import MetricsBadge from "@/components/MetricsBadge/MetricsBadge";
import styles from "./IdentifiedPestCard.module.css";

interface IdentifiedPestCardProps {
  pest: IdentifiedPest;
  pestEval: PestEvaluation;
}

export default function IdentifiedPestCard({ pest, pestEval }: IdentifiedPestCardProps) {
  const metricKeys = Object.keys(pestEval.metrics) as (keyof typeof pestEval.metrics)[];

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      >
        <div className={styles.glowBorder} />
        <div className={`${styles.glowCorner} ${styles.glowCornerTL}`} />
        <div className={`${styles.glowCorner} ${styles.glowCornerBR}`} />

        <div className={styles.topRow}>
          <div className={styles.pestBlock}>
            <span className={styles.pestName}>{pest.pest_name}</span>
            {pest.scientific_name && (
              <span className={styles.sciName}>{pest.scientific_name}</span>
            )}
          </div>
          <div className={styles.confBadge}>
            <span className={styles.confNum}>{pest.confidence_pct}%</span>
            <span className={styles.confLabel}>Confidence</span>
          </div>
        </div>

        <blockquote className={styles.snippet}>
          <span className={styles.quoteIcon}>&ldquo;</span>
          <div>
            <p className={styles.snippetLabel}>Evidence from the customer</p>
            <p className={styles.snippetText}>{pest.evidence_quote}</p>
          </div>
        </blockquote>

        <div className={styles.rationaleSection}>
          <div className={styles.rationaleAvatar}>🔎</div>
          <div className={styles.rationaleContent}>
            <span className={styles.rationaleLabel}>Why this match</span>
            <p className={styles.rationaleNote}>{pest.evidence_rationale}</p>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {metricKeys.map((key) => (
            <MetricsBadge key={key} metricKey={key} score={pestEval.metrics[key]} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
