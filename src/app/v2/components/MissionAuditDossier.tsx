"use client";

import { useMemo, useState } from "react";
import type { AuditDossierSpec } from "../lib/types";
import { scoreDetection } from "./ImpostorAudit";

/* ── Dossier audit generik untuk misi: tabel kolom bebas (dari spec.columns)
      + klaim per baris + suntikan impostor TAK diumumkan.
      Memakai ulang fungsi skor murni dari ImpostorAudit (rr19 tidak diubah). ── */
export default function MissionAuditDossier({
  spec,
  onDebrief,
}: {
  spec: AuditDossierSpec;
  onDebrief?: (opened: boolean) => void;
}) {
  const [flagged, setFlagged] = useState<number[]>([]);
  const [debriefOpen, setDebriefOpen] = useState(false);

  const score = useMemo(
    () => scoreDetection(flagged, spec.injections),
    [flagged, spec.injections]
  );

  function toggleFlag(rowId: number) {
    setFlagged((prev) =>
      prev.includes(rowId) ? prev.filter((r) => r !== rowId) : [...prev, rowId]
    );
  }

  return (
    <div data-testid="mission-audit-dossier" style={{ margin: "16px 0" }}>
      <div className="callout callout-warning">
        <strong>Misi audit.</strong> {spec.intro} Seseorang telah menyuntikkan{" "}
        <strong>{spec.injections.length} sabotase</strong> ke dalam dossier ini{" "}
        <em>tanpa pengumuman</em>. Tugasmu: periksa setiap baris, tekan{" "}
        <strong>“Tandai sebagai anomali”</strong> pada baris yang janggal, lalu
        buka debrief untuk melihat skormu.
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table" data-testid="dossier-table">
          <thead>
            <tr>
              <th>#</th>
              {spec.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
              <th>Klaim dossier</th>
              <th>Aksi auditor</th>
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row) => {
              const isFlagged = flagged.includes(row.rowId);
              return (
                <tr
                  key={row.rowId}
                  data-testid={`dossier-row-${row.rowId}`}
                  style={isFlagged ? { background: "rgba(220, 60, 60, 0.08)" } : undefined}
                >
                  <td>
                    <strong>#{row.rowId}</strong>
                  </td>
                  {spec.columns.map((c) => (
                    <td key={c}>{row.cells[c] ?? "—"}</td>
                  ))}
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {row.claims.map((cl, i) => (
                        <li key={i}>
                          {cl.label}: <strong>{cl.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      type="button"
                      data-testid={`flag-${row.rowId}`}
                      onClick={() => toggleFlag(row.rowId)}
                      aria-pressed={isFlagged}
                      style={{
                        cursor: "pointer",
                        border: "1px solid var(--c4, #b3541e)",
                        borderRadius: 8,
                        padding: "6px 10px",
                        background: isFlagged ? "#b3261e" : "transparent",
                        color: isFlagged ? "#fff" : "inherit",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isFlagged ? "🚩 Ditandai" : "Tandai sebagai anomali"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p data-testid="flag-counter" style={{ marginTop: 12 }}>
        Baris ditandai: <strong>{flagged.length}</strong> dari {spec.rows.length}
      </p>

      {!debriefOpen ? (
        <button
          type="button"
          data-testid="open-debrief"
          onClick={() => {
            setDebriefOpen(true);
            onDebrief?.(true);
          }}
          style={{
            cursor: "pointer",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            background: "var(--c1, #1a5c3f)",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Buka debrief &amp; lihat skor
        </button>
      ) : (
        <div data-testid="debrief">
          <div
            className={`callout ${
              score.caught === score.total
                ? "callout-success"
                : score.caught === 0
                  ? "callout-error"
                  : "callout-warning"
            }`}
          >
            <strong data-testid="debrief-score">
              Skor deteksi: {score.caught}/{score.total}
            </strong>{" "}
            — {score.caught === score.total
              ? "Sempurna. Tidak ada sabotase yang lolos darimu."
              : score.caught === 0
                ? "Semua sabotase lolos. Inilah kenapa audit butuh sistem, bukan firasat."
                : `${score.missed} sabotase lolos dari pemeriksaanmu — di dunia nyata, tiap yang lolos = keputusan berbasis angka palsu.`}
          </div>

          {spec.injections.map((inj) => {
            const caught = score.caughtKeys.includes(inj.key);
            return (
              <div
                key={inj.key}
                data-testid={`injection-${inj.key}`}
                data-caught={caught}
                className="callout"
                style={{ marginTop: 12 }}
              >
                <p>
                  <strong>
                    {caught ? "✅ Tertangkap" : "❌ Terlewat"} — {inj.title}
                  </strong>{" "}
                  <span style={{ opacity: 0.75 }}>
                    (baris {inj.rowIds.map((r) => `#${r}`).join(", ")})
                  </span>
                </p>
                <p>
                  <strong>Petunjuknya:</strong> {inj.clue}
                </p>
                <p>
                  <strong>Bahaya di pekerjaan nyata:</strong> {inj.danger}
                </p>
              </div>
            );
          })}

          <button
            type="button"
            data-testid="reset-audit"
            onClick={() => {
              setFlagged([]);
              setDebriefOpen(false);
              onDebrief?.(false);
            }}
            style={{
              cursor: "pointer",
              marginTop: 12,
              border: "1px solid currentColor",
              borderRadius: 8,
              padding: "8px 14px",
              background: "transparent",
              color: "inherit",
            }}
          >
            Ulangi misi
          </button>
        </div>
      )}
    </div>
  );
}
