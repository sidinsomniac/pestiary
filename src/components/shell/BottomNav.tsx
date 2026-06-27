"use client";

import styles from "./BottomNav.module.css";

export interface NavTab {
  id: string;
  label: string;
  icon: string;
}

export const NAV_TABS: NavTab[] = [
  { id: "diagnosis", label: "Diagnosis", icon: "🐛" },
  { id: "evidence", label: "Evidence", icon: "📊" },
  { id: "service", label: "Service", icon: "🛡️" },
  { id: "reply", label: "Reply", icon: "💬" },
];

interface BottomNavProps {
  active: string;
  onNavigate: (id: string) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      {NAV_TABS.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ""}`}
          onClick={() => onNavigate(tab.id)}
          type="button"
          aria-current={active === tab.id ? "true" : undefined}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
