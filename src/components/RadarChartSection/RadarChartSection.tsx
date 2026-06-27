"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PestEvaluation, RadarDataPoint } from "@/types";
import styles from "./RadarChartSection.module.css";

const CHART_COLORS = [
  "#1f9d57",
  "#0c9b86",
  "#b8801f",
  "#2f80c2",
  "#d98324",
  "#7b5ed6",
];

const METRIC_LABELS: Record<string, string> = {
  symptom_match: "Symptom",
  behavioral_cues: "Behavior",
  visual_cues: "Visual",
  environmental_fit: "Environment",
  timing_pattern: "Timing",
  damage_signature: "Damage",
};

// Limit the overlay to the strongest candidates so the chart stays readable.
const MAX_SERIES = 4;

interface RadarChartSectionProps {
  candidates: PestEvaluation[];
}

function buildRadarData(candidates: PestEvaluation[]): RadarDataPoint[] {
  const metricKeys = Object.keys(candidates[0].metrics);
  return metricKeys.map((key) => {
    const point: RadarDataPoint = { metric: METRIC_LABELS[key] ?? key };
    candidates.forEach((entry) => {
      point[entry.pest_name] = entry.metrics[key as keyof typeof entry.metrics];
    });
    return point;
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className={styles.tooltipRow} style={{ color: p.color }}>
          <span className={styles.tooltipName}>{p.name}</span>
          <span className={styles.tooltipValue}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function RadarChartSection({ candidates }: RadarChartSectionProps) {
  const topCandidates = [...candidates]
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, MAX_SERIES);
  const radarData = buildRadarData(topCandidates);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={styles.legend}>
        {topCandidates.map((entry, i) => (
          <div key={entry.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: CHART_COLORS[i] }} />
            <span className={styles.legendName}>{entry.pest_name}</span>
            <span className={styles.legendPct}>{entry.confidence_pct}%</span>
          </div>
        ))}
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
            <PolarGrid stroke="rgba(20,60,40,0.12)" gridType="polygon" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#51625a", fontSize: 11, fontWeight: 500 }}
            />
            {topCandidates.map((entry, i) => (
              <Radar
                key={entry.id}
                name={entry.pest_name}
                dataKey={entry.pest_name}
                stroke={CHART_COLORS[i]}
                fill={CHART_COLORS[i]}
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{ r: 2.5, fill: CHART_COLORS[i], strokeWidth: 0 }}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: "none" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
