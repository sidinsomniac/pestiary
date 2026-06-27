"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Drawer.module.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Drawer({ open, onClose, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className={styles.panel}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.head}>
              <div className={styles.brand}>
                <span aria-hidden="true">🐞</span> Pestiary
              </div>
              <button className={styles.close} onClick={onClose} aria-label="Close menu" type="button">
                ✕
              </button>
            </div>
            <div className={styles.body}>{children}</div>
            <p className={styles.footer}>Powered by Apex Pest Solutions · Bangalore</p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
