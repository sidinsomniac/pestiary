"use client";

import { useEffect, useRef, useState } from "react";
import type { TriageResult } from "@/types";
import TopBar from "@/components/shell/TopBar";
import Drawer from "@/components/shell/Drawer";
import BottomNav, { NAV_TABS } from "@/components/shell/BottomNav";
import ScanLoader from "@/components/shell/ScanLoader";
import SampleInquiryPicker from "@/components/SampleInquiryPicker/SampleInquiryPicker";
import InquiryContextBar from "@/components/InquiryContextBar/InquiryContextBar";
import IdentifiedPestCard from "@/components/IdentifiedPestCard/IdentifiedPestCard";
import AlsoConsidered from "@/components/AlsoConsidered/AlsoConsidered";
import RadarChartSection from "@/components/RadarChartSection/RadarChartSection";
import Leaderboard from "@/components/Leaderboard/Leaderboard";
import ServicePanel from "@/components/ServicePanel/ServicePanel";
import WhatsAppReplyCard from "@/components/WhatsAppReplyCard/WhatsAppReplyCard";
import styles from "./TriageDashboard.module.css";

interface TriageDashboardProps {
  initialResult: TriageResult;
}

export default function TriageDashboard({ initialResult }: TriageDashboardProps) {
  const [result, setResult] = useState<TriageResult>(initialResult);
  const [scanning, setScanning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<string>("diagnosis");
  const [showAll, setShowAll] = useState(false);

  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionsRef.current[id] = el;
  };

  // Highlight the bottom-nav tab for whichever section is near the top.
  useEffect(() => {
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
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    sectionsRef.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { inquiry, identified_pest, candidate_pests, recommended_service, whatsapp_reply } = result;
  const winnerEval =
    candidate_pests.find((c) => c.id === identified_pest.id) ?? candidate_pests[0];

  return (
    <div className={styles.shell}>
      <TopBar onMenu={() => setDrawerOpen(true)} />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SampleInquiryPicker
          onStart={() => {
            setScanning(true);
            setDrawerOpen(false);
          }}
          onResult={(r) => {
            setResult(r);
            setShowAll(false);
            scrollTo("diagnosis");
          }}
          onSettle={() => setScanning(false)}
        />
        <p className={styles.about}>
          Pestiary identifies household pests from a plain-language description, explains the
          evidence behind the call, recommends a treatment with an estimated quote, and drafts a
          reply you can send straight to the customer.
        </p>
      </Drawer>

      <main className={styles.content}>
        <section id="diagnosis" ref={setSectionRef("diagnosis")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Diagnosis</span>
            <h2 className={styles.secTitle}>Most likely pest</h2>
          </header>
          <InquiryContextBar inquiry={inquiry} />
          <IdentifiedPestCard pest={identified_pest} pestEval={winnerEval} />
          <AlsoConsidered candidates={candidate_pests} onSelect={() => scrollTo("evidence")} />
        </section>

        <section id="evidence" ref={setSectionRef("evidence")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Evidence</span>
            <h2 className={styles.secTitle}>Why this match</h2>
          </header>
          <RadarChartSection candidates={candidate_pests} />
          <button
            className={styles.toggle}
            onClick={() => setShowAll((s) => !s)}
            type="button"
            aria-expanded={showAll}
          >
            {showAll ? "Hide full breakdown" : `Show all ${candidate_pests.length} candidates`}
          </button>
          {showAll && <Leaderboard candidates={candidate_pests} />}
        </section>

        <section id="service" ref={setSectionRef("service")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Recommendation</span>
            <h2 className={styles.secTitle}>Suggested treatment</h2>
          </header>
          <ServicePanel service={recommended_service} />
        </section>

        <section id="reply" ref={setSectionRef("reply")} className={styles.section}>
          <header className={styles.secHead}>
            <span className={styles.eyebrow}>Reply</span>
            <h2 className={styles.secTitle}>Message for the customer</h2>
          </header>
          <WhatsAppReplyCard reply={whatsapp_reply} />
        </section>
      </main>

      <BottomNav active={active} onNavigate={scrollTo} />
      <ScanLoader visible={scanning} />
    </div>
  );
}
