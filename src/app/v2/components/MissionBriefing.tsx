"use client";

import type { MissionBriefingSpec } from "../lib/types";

/* ── Briefing misi: peran + klien + cerita + tujuan + ringkasan prasyarat
      (F2) + catatan dataset. Murni presentasi, aditif. ── */
export default function MissionBriefing({ spec }: { spec: MissionBriefingSpec }) {
  return (
    <div data-testid="mission-briefing" style={{ margin: "16px 0" }}>
      <div className="callout">
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--text-muted)" }}>
          PERANMU
        </p>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 17 }}>{spec.role}</p>
        <p style={{ margin: 0 }}>
          <strong>Klien:</strong> {spec.client}
        </p>
      </div>

      {spec.story.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h3 className="label">Tujuan misi (terukur)</h3>
      <ol>
        {spec.objectives.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ol>

      <div className="note">
        <h4>Bekal yang kamu butuhkan (diringkas — misi ini mandiri)</h4>
        <p>{spec.prereqSummary}</p>
      </div>

      <div className="note risk">
        <h4>Catatan data room</h4>
        <p style={{ whiteSpace: "pre-wrap" }}>{spec.datasetNote}</p>
      </div>
    </div>
  );
}
