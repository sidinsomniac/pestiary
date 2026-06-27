"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CustomerInquiry, TriageResult } from "@/types";
import TopBar from "@/components/shell/TopBar";
import Drawer from "@/components/shell/Drawer";
import BottomNav, { NAV_TABS } from "@/components/shell/BottomNav";
import ScanLoader from "@/components/shell/ScanLoader";
import Inbox from "@/components/Inbox/Inbox";
import InquiryContextBar from "@/components/InquiryContextBar/InquiryContextBar";
import IdentifiedPestCard from "@/components/IdentifiedPestCard/IdentifiedPestCard";
import AlsoConsidered from "@/components/AlsoConsidered/AlsoConsidered";
import RadarChartSection from "@/components/RadarChartSection/RadarChartSection";
import Leaderboard from "@/components/Leaderboard/Leaderboard";
import ServicePanel from "@/components/ServicePanel/ServicePanel";
import WhatsAppReplyCard from "@/components/WhatsAppReplyCard/WhatsAppReplyCard";
import styles from "./TriageDashboard.module.css";

export default function TriageDashboard() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [source, setSource] = useState<"sheet" | "sample" | null>(null);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [inboxError, setInboxError] = useState<string | null>(null);

  const [result, setResult] = useState<TriageResult | null>(null);
  const [view, setView] = useState<"inbox" | "result">("inbox");
  const [scanning, setScanning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("diagnosis");
  const [showAll, setShowAll] = useState(false);

  const cacheRef = useRef<Map<string, TriageResult>>(new Map());
  const [evaluatedIds, setEvaluatedIds] = useState<Set<string>>(new Set());

  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionsRef.current[id] = el;
  };

  const fetchInbox = useCallback(async () => {
    setLoadingInbox(true);
    setInboxError(null);
    try {
      const res = await fetch("/api/inquiries", { cache: "no-store" });
      const data = await res.json();
      setInquiries(data.inquiries ?? []);
      setSource(data.source ?? null);
      if (data.error) setInboxError(String(data.error));
    } catch {
      setInboxError("Could not load inquiries.");
    } finally {
      setLoadingInbox(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const handleSelect = useCallback(async (inquiry: CustomerInquiry) => {
    const cached = cacheRef.current.get(inquiry.id);
    if (cached) {
      setResult(cached);
      setShowAll(false);
      setActive("diagnosis");
      setView("result");
      return;
    }
    setScanning(true);
    setInboxError(null);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Triage failed (${res.status})`);
      }
      const triage: TriageResult = await res.json();
      cacheRef.current.set(inquiry.id, triage);
      setEvaluatedIds(new Set(cacheRef.current.keys()));
      setResult(triage);
      setShowAll(false);
      setActive("diagnosis");
      setView("result");
    } catch (e) {
      setInboxError(e instanceof Error ? e.message : "Triage failed.");
    } finally {
      setScanning(false);
    }
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    sectionsRef.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Bottom-nav active highlighting (only relevant in the result view).
  useEffect(() => {
    if (view !== "result") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    NAV_TABS.forEach((t) => {
      const el = sectionsRef.current[t.id];
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [view, result]);

  if (view === "inbox") {
    return (
      <div className={styles.shell}>
        <TopBar onMenu={() => setDrawerOpen(true)} />
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <p className={styles.about}>
            Pestiary is the Apex triage console. Pick a customer inquiry from the inbox to identify
            the most likely pest, see the supporting evidence, get a recommended treatment with an
            estimated quote, and a reply you can send straight back.
          </p>
        </Drawer>
        <Inbox
          inquiries={inquiries}
          source={source}
          loading={loadingInbox}
          error={inboxError}
          evaluatedIds={evaluatedIds}
          onRefresh={fetchInbox}
          onSelect={handleSelect}
        />
        <ScanLoader visible={scanning} />
      </div>
    );
  }

  // Result view
  const r = result!;
  const winnerEval =
    r.candidate_pests.find((c) => c.id === r.identified_pest.id) ?? r.candidate_pests[0];

  return (
    <div className={styles.shell}>
      <TopBar onBack={() => setView("inbox")} subtitle={r.inquiry.customer_name} />

      <main className={styles.content}>
        <section id="diagnosis" ref={setSectionRef("diagnosis")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Diagnosis</span>
            <h2 className={styles.secTitle}>Most likely pest</h2>
          </header>
          <InquiryContextBar inquiry={r.inquiry} />
          <IdentifiedPestCard pest={r.identified_pest} pestEval={winnerEval} />
          <AlsoConsidered candidates={r.candidate_pests} onSelect={() => scrollTo("evidence")} />
        </section>

        <section id="evidence" ref={setSectionRef("evidence")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Evidence</span>
            <h2 className={styles.secTitle}>Why this match</h2>
          </header>
          <RadarChartSection candidates={r.candidate_pests} />
          <button
            className={styles.toggle}
            onClick={() => setShowAll((s) => !s)}
            type="button"
            aria-expanded={showAll}
          >
            {showAll ? "Hide full breakdown" : `Show all ${r.candidate_pests.length} candidates`}
          </button>
          {showAll && <Leaderboard candidates={r.candidate_pests} />}
        </section>

        <section id="service" ref={setSectionRef("service")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Recommendation</span>
            <h2 className={styles.secTitle}>Suggested treatment</h2>
          </header>
          <ServicePanel service={r.recommended_service} />
        </section>

        <section id="reply" ref={setSectionRef("reply")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Reply</span>
            <h2 className={styles.secTitle}>Message for the customer</h2>
          </header>
          <WhatsAppReplyCard reply={r.whatsapp_reply} />
        </section>
      </main>

      <BottomNav active={active} onNavigate={scrollTo} />
      <ScanLoader visible={scanning} />
    </div>
  );
}
