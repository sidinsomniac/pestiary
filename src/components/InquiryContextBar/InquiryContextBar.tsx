"use client";

import { motion } from "framer-motion";
import type { CustomerInquiry } from "@/types";
import styles from "./InquiryContextBar.module.css";

interface InquiryContextBarProps {
  inquiry: CustomerInquiry;
}

export default function InquiryContextBar({ inquiry }: InquiryContextBarProps) {
  return (
    <motion.section
      className={styles.bar}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.label}>Customer Inquiry</p>
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark}>&ldquo;</span>
            {inquiry.description}
          </blockquote>
        </div>
        <div className={styles.chips}>
          <span className={styles.chip}>👤 {inquiry.customer_name}</span>
          <span className={styles.chip}>🏠 {inquiry.property_type}</span>
          <span className={styles.chip}>📐 {inquiry.square_footage.toLocaleString()} sq ft</span>
          <span className={styles.chip}>📍 {inquiry.location_in_property}</span>
          <span className={styles.chip}>🗣 {inquiry.language}</span>
        </div>
      </div>
    </motion.section>
  );
}
