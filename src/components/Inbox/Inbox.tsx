"use client";

import { motion } from "framer-motion";
import type { CustomerInquiry } from "@/types";
import styles from "./Inbox.module.css";

interface InboxProps {
  inquiries: CustomerInquiry[];
  source: "sheet" | "sample" | null;
  loading: boolean;
  error: string | null;
  evaluatedIds: Set<string>;
  onRefresh: () => void;
  onSelect: (inquiry: CustomerInquiry) => void;
}

export default function Inbox({
  inquiries,
  source,
  loading,
  error,
  evaluatedIds,
  onRefresh,
  onSelect,
}: InboxProps) {
  return (
    <main className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <span className={styles.eyebrow}>Inbox</span>
          <h2 className={styles.title}>Customer inquiries</h2>
        </div>
        <button className={styles.refresh} onClick={onRefresh} disabled={loading} type="button">
          <span className={`${styles.refreshIcon} ${loading ? styles.spinning : ""}`}>↻</span>
          {loading ? "Loading" : "Refresh"}
        </button>
      </header>

      {source && (
        <p className={styles.sourceNote}>
          {source === "sheet" ? "Live from Google Sheet" : "Showing sample inquiries (no Sheet connected)"}
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {loading && inquiries.length === 0 ? (
        <div className={styles.skeletonList}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <p className={styles.empty}>No inquiries yet. Submissions to the form will appear here.</p>
      ) : (
        <div className={styles.list}>
          {inquiries.map((inq, i) => {
            const done = evaluatedIds.has(inq.id);
            return (
              <motion.button
                key={inq.id}
                className={styles.card}
                onClick={() => onSelect(inq)}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.name}>{inq.customer_name}</span>
                  {done && <span className={styles.doneBadge}>✓ triaged</span>}
                </div>
                <p className={styles.snippet}>{inq.description}</p>
                <div className={styles.chips}>
                  <span className={styles.chip}>🏠 {inq.property_type}</span>
                  {inq.location_in_property && (
                    <span className={styles.chip}>📍 {inq.location_in_property}</span>
                  )}
                  <span className={styles.chip}>🗣 {inq.language}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </main>
  );
}
