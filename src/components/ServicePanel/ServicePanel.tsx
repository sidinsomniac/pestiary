"use client";

import { motion } from "framer-motion";
import type { ServiceRecommendation } from "@/types";
import styles from "./ServicePanel.module.css";

interface ServicePanelProps {
  service: ServiceRecommendation;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function ServicePanel({ service }: ServicePanelProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>Recommended Service</p>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.headerRow}>
          <div>
            <h3 className={styles.serviceName}>{service.service_name}</h3>
            <p className={styles.serviceDesc}>{service.service_description}</p>
          </div>
          <div className={styles.priceBox}>
            <span className={styles.priceLabel}>Estimated quote</span>
            <span className={styles.price}>
              {inr(service.estimated_price_min)} – {inr(service.estimated_price_max)}
            </span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{service.estimated_visits}</span>
            <span className={styles.statLabel}>
              {service.estimated_visits === 1 ? "Visit" : "Visits"}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{service.warranty_months}</span>
            <span className={styles.statLabel}>
              {service.warranty_months === 1 ? "Month warranty" : "Months warranty"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
