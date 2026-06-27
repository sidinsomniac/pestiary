"use client";

import { useEffect, useState } from "react";
import type { CustomerInquiry, TriageResult } from "@/types";
import styles from "./SampleInquiryPicker.module.css";

interface SampleInquiryPickerProps {
  onResult: (result: TriageResult) => void;
  onStart?: () => void;
  onSettle?: () => void;
}

export default function SampleInquiryPicker({ onResult, onStart, onSettle }: SampleInquiryPickerProps) {
  const [samples, setSamples] = useState<CustomerInquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/sample_inquiries.json")
      .then((r) => r.json())
      .then((data: CustomerInquiry[]) => {
        setSamples(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch(() => setError("Could not load sample inquiries."));
  }, []);

  const runTriage = async () => {
    const inquiry = samples.find((s) => s.id === selectedId);
    if (!inquiry) return;
    setLoading(true);
    setError(null);
    onStart?.();
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const result: TriageResult = await res.json();
      onResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Triage failed.");
    } finally {
      setLoading(false);
      onSettle?.();
    }
  };

  return (
    <section className={styles.bar}>
      <div className={styles.inner}>
        <label className={styles.label} htmlFor="sample-select">
          Try a sample inquiry
        </label>
        <div className={styles.controls}>
          <select
            id="sample-select"
            className={styles.select}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loading || samples.length === 0}
          >
            {samples.map((s) => (
              <option key={s.id} value={s.id}>
                {s.customer_name} · {s.property_type} · {s.language}
              </option>
            ))}
          </select>
          <button
            className={styles.runBtn}
            onClick={runTriage}
            disabled={loading || !selectedId}
            type="button"
          >
            {loading ? "Triaging…" : "Run Triage"}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.hint}>
          Runs the live DeepSeek pipeline against the selected inquiry.
        </p>
      </div>
    </section>
  );
}
