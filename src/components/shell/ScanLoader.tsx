"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./ScanLoader.module.css";

interface ScanLoaderProps {
  visible: boolean;
}

// Static bug definitions (no randomness at render time).
const BUGS = [
  { emoji: "🐛", top: "18%", delay: 0, dur: 3.2, drift: 30 },
  { emoji: "🪳", top: "34%", delay: 0.5, dur: 3.8, drift: -24 },
  { emoji: "🐜", top: "52%", delay: 1.1, dur: 2.9, drift: 20 },
  { emoji: "🦟", top: "66%", delay: 0.8, dur: 3.5, drift: -30 },
  { emoji: "🕷️", top: "78%", delay: 1.5, dur: 4.1, drift: 26 },
  { emoji: "🐞", top: "26%", delay: 2.0, dur: 3.0, drift: -18 },
];

export default function ScanLoader({ visible }: ScanLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {BUGS.map((b, i) => (
            <motion.span
              key={i}
              className={styles.bug}
              style={{ top: b.top }}
              initial={{ left: "-12%" }}
              animate={{ left: "112%", y: [0, b.drift, 0, -b.drift, 0] }}
              transition={{
                left: { duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" },
                y: { duration: b.dur / 2, delay: b.delay, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {b.emoji}
            </motion.span>
          ))}

          <div className={styles.center}>
            <motion.div
              className={styles.lens}
              animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              🔎
            </motion.div>
            <p className={styles.title}>Identifying the pest…</p>
            <p className={styles.sub}>Weighing the evidence across 10 suspects</p>
            <div className={styles.dots}>
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className={styles.dot}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.1, delay: d * 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
