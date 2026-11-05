import type { Metadata } from "next";
import "./v2.css";
import SWRegister from "./lib/SWRegister";

export const metadata: Metadata = {
  title: "Learn v2 — Workspace",
  description: "Ruang kerja belajar: instruksi per langkah, kode langsung jalan.",
};

// Scoped under .v2 so the legacy site styling is untouched.
// Theme follows <html data-theme> managed by the root layout script.
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2">
      {/* PWA: registers /sw.js in production only (never in next dev — protects HMR). */}
      <SWRegister />
      {children}
    </div>
  );
}
