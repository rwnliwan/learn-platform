"use client";

import { useEffect, useState } from "react";
import Icon, { trackIconFor } from "../lib/icons";
import type { V2Mission } from "../lib/types";

/* ── Pasangan track untuk 25 misi capstone kombinasi (misi-gabung-*).
      Sumber: RENCANA_MISI_75 §3 (peta pasangan per track rumah).
      Misi solo tidak ada di peta ini → tidak dapat penanda. ── */
const CAPSTONE_PAIR: Record<string, string> = {
  "misi-gabung-berkas-ganda": "Fraud/AML",
  "misi-gabung-jejak-lapis": "Blockchain Data Scientist",
  "misi-gabung-stress-portofolio": "Portfolio Management",
  "misi-gabung-dashboard-auditor": "Business Intelligence",
  "misi-gabung-uji-ab-jujur": "Marketing Analytics",
  "misi-gabung-monte-carlo": "Portfolio Management",
  "misi-gabung-rebalance-krisis": "Portfolio Management",
  "misi-gabung-anggaran-risiko": "Market Risk",
  "misi-gabung-jembatan-lintas": "Fraud/AML",
  "misi-gabung-pipeline-kotor": "Data Engineer",
  "misi-gabung-query-ke-dashboard": "Business Intelligence",
  "misi-gabung-lineage-governance": "Data Engineer",
  "misi-gabung-feature-store": "MLOps",
  "misi-gabung-migrasi-warisan": "Data Management",
  "misi-gabung-dashboard-jujur": "Marketing Analytics",
  "misi-gabung-surveilans-genomik": "Bioinformatika",
  "misi-gabung-vcf-ke-laporan": "Health Data Science",
  "misi-gabung-atribusi-model": "ML Engineer",
  "misi-gabung-notebook-produksi": "MLOps",
  "misi-gabung-training-skala": "ML Engineer",
  "misi-gabung-serving-llm": "LLMOps",
  "misi-gabung-evaluasi-agen": "AI Engineering",
  "misi-gabung-rag-agen": "Agentic AI",
  "misi-gabung-biaya-agen": "LLMOps",
  "misi-gabung-pipeline-alpha": "ML Engineer",
};

/* ── Galeri misi: kartu per misi + status selesai (localStorage-first,
      mirror /api/progress — pola yang sama dengan lesson). ── */
export default function MissionGallery({ missions }: { missions: V2Mission[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    const s = new Set<string>();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith("v2:done:misi-")) s.add(k.slice("v2:done:".length));
      }
    } catch {
      /* noop */
    }
    setDone(s);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
        marginTop: 24,
      }}
    >
      {missions.map((m) => (
        <a
          key={m.slug}
          href={`/v2/misi/${m.slug}`}
          className="card"
          data-testid={`mission-card-${m.slug}`}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <div className="card-h">
            <span className="eyebrow">
              <Icon name={trackIconFor(m.track)} className="i ti" /> {m.track}
              {CAPSTONE_PAIR[m.slug] && <> × {CAPSTONE_PAIR[m.slug]}</>}
            </span>
            <span style={{ display: "inline-flex", gap: 6 }}>
              {CAPSTONE_PAIR[m.slug] && <span className="badge">Kombinasi</span>}
              {done.has(m.slug) && <span className="badge ok">Selesai ✓</span>}
            </span>
          </div>
          <h3 style={{ margin: "8px 0" }}>{m.title}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 8px" }}>
            <strong>Peran:</strong> {m.role}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 12px" }}>{m.client}</p>
          <div className="meta" style={{ display: "flex", gap: 12 }}>
            <span>⏱ {m.estMinutes} mnt</span>
            <span>🧩 {m.steps.length} langkah</span>
            <span>⭐ {m.xp} XP</span>
          </div>
        </a>
      ))}
    </div>
  );
}
