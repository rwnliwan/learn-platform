// Registers /sw.js in production only.
// Never register during `next dev`: a dev-time SW would cache aggressively
// and break HMR. Guarded by NODE_ENV + feature detection.
"use client";
import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline-first is best-effort; the app works without it */
    });
  }, []);
  return null;
}
