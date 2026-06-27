"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PestEvaluation } from "@/types";
import MetricsBadge from "@/components/MetricsBadge/MetricsBadge";
import styles from "./CandidatePestCard.module.css";

interface CandidatePestCardProps {
  entry: PestEvaluation;
  index: number;
}

export default function CandidatePestCard({ entry, index }: CandidatePestCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isTop = index === 0;
  const rank = index + 1;
  const metricKeys = Object.keys(entry.metrics) as (keyof typeof entry.metrics)[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" as const }}
    >
      <div
        className={`${styles.card} ${isTop ? styles.cardTop : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className={styles.header}>
          <div className={`${styles.rankBubble} ${isTop ? styles.rankBubbleTop : ""}`}>
            {isTop ? "🎯" : `#${rank}`}
          </div>

          <div className={styles.meta}>
            <span className={`${styles.pestName} ${isTop ? styles.pestNameTop : ""}`}>
              {entry.pest_name}
            </span>
            {entry.scientific_name && <span className={styles.sciName}>{entry.scientific_name}</span>}
          </div>

          <div className={styles.right}>
            <div className={styles.confWrap}>
              <span className={styles.conf}>{entry.confidence_pct}%</span>
              <span className={styles.confLabel}>match</span>
            </div>
            <svg
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className={styles.miniBar}>
          <div className={styles.miniFill} style={{ width: `${entry.confidence_pct}%` }} />
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              className={styles.expandedContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {entry.evidence_quote && entry.evidence_quote !== "No direct evidence" && (
                <div className={styles.quoteRow}>
                  <span className={styles.quoteIcon}>&ldquo;</span>
                  <p className={styles.quoteText}>{entry.evidence_quote}</p>
                </div>
              )}
              <p className={styles.rationale}>{entry.evidence_rationale}</p>
              <div className={styles.metricsGrid}>
                {metricKeys.map((key) => (
                  <MetricsBadge key={key} metricKey={key} score={entry.metrics[key]} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
