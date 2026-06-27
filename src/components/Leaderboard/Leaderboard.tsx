"use client";

import { useMemo } from "react";
import type { PestEvaluation } from "@/types";
import CandidatePestCard from "@/components/CandidatePestCard/CandidatePestCard";
import styles from "./Leaderboard.module.css";

interface LeaderboardProps {
  candidates: PestEvaluation[];
}

export default function Leaderboard({ candidates }: LeaderboardProps) {
  const ordered = useMemo(
    () => [...candidates].sort((a, b) => b.total_score - a.total_score),
    [candidates]
  );

  return (
    <div className={styles.list}>
      {ordered.map((entry, i) => (
        <CandidatePestCard key={entry.id} entry={entry} index={i} />
      ))}
    </div>
  );
}
