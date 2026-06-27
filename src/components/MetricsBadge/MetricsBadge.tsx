"use client";

import { motion } from "framer-motion";
import styles from "./MetricsBadge.module.css";

const METRIC_COLORS: Record<string, string> = {
  symptom_match: "var(--accent-green)",
  behavioral_cues: "var(--accent-cyan)",
  visual_cues: "var(--chart-4)",
  environmental_fit: "var(--accent-magenta)",
  timing_pattern: "var(--accent-amber)",
  damage_signature: "var(--accent-coral)",
};

interface MetricsBadgeProps {
  metricKey: string;
  score: number;
  maxScore?: number;
}

export default function MetricsBadge({ metricKey, score, maxScore = 10 }: MetricsBadgeProps) {
  const color = METRIC_COLORS[metricKey] ?? "var(--accent-coral)";
  const percentage = (score / maxScore) * 100;
  const displayName = metricKey.replace(/_/g, " ");

  return (
    <div className={styles.badge}>
      <div className={styles.topRow}>
        <span className={styles.metricName}>{displayName}</span>
        <span className={styles.score} style={{ color }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className={styles.barTrack}>
        <motion.div
          className={styles.barFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
