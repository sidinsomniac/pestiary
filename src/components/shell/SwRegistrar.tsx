"use client";

import { useEffect } from "react";

export default function SwRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failing is non-fatal; the app works without it.
      });
    }
  }, []);
  return null;
}
