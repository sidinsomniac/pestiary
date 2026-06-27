"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { WhatsAppReply } from "@/types";
import styles from "./WhatsAppReplyCard.module.css";

interface WhatsAppReplyCardProps {
  reply: WhatsAppReply;
}

export default function WhatsAppReplyCard({ reply }: WhatsAppReplyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>Draft Reply</p>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.topRow}>
          <span className={styles.badge}>
            <span className={styles.waIcon}>💬</span> WhatsApp · {reply.language}
          </span>
          <button className={styles.copyBtn} onClick={handleCopy} type="button">
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        <div className={styles.bubble}>
          <p className={styles.message}>{reply.message}</p>
        </div>
      </motion.div>
    </div>
  );
}
