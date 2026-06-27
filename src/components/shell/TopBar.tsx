"use client";

import styles from "./TopBar.module.css";

interface TopBarProps {
  onMenu?: () => void;
  onBack?: () => void;
  subtitle?: string;
}

export default function TopBar({ onMenu, onBack, subtitle }: TopBarProps) {
  return (
    <header className={styles.bar}>
      {onBack ? (
        <button className={styles.iconBtn} onClick={onBack} aria-label="Back to inbox" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      ) : (
        <button className={styles.menuBtn} onClick={onMenu} aria-label="Open menu" type="button">
          <span />
          <span />
          <span />
        </button>
      )}

      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">🐞</span>
        <span className={styles.word}>Pestiary</span>
      </div>

      <span className={styles.tag}>{subtitle ?? "by Apex"}</span>
    </header>
  );
}
