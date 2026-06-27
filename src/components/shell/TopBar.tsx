"use client";

import styles from "./TopBar.module.css";

interface TopBarProps {
  onMenu: () => void;
}

export default function TopBar({ onMenu }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <button className={styles.menuBtn} onClick={onMenu} aria-label="Open menu" type="button">
        <span />
        <span />
        <span />
      </button>

      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">🐞</span>
        <span className={styles.word}>Pestiary</span>
      </div>

      <span className={styles.tag}>by Apex</span>
    </header>
  );
}
