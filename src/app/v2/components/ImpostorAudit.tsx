"use client";

import { useMemo, useState } from "react";
import type { ImpostorAuditSpec, ImpostorInjection } from "../lib/types";

/* ── Logika skor murni (deterministik, bisa di-QA tanpa browser) ────────── */
export interface DetectionScore {
  total: number;
  caught: number;
  missed: number;
  /** key suntikan yang tertangkap */
  caughtKeys: string[];
  /** key suntikan yang terlewat */
  missedKeys: string[];
}

/** Satu suntikan dianggap tertangkap bila ≥1 baris terdampaknya ditandai. */
export function scoreDetection(
  flaggedRowIds: number[],
  injections: ImpostorInjection[]
): DetectionScore {
  const flagged = new Set(flaggedRowIds);
  const caughtKeys: string[] = [];
  const missedKeys: string[] = [];
  for (const inj of injections) {
    if (inj.rowIds.some((r) => flagged.has(r))) caughtKeys.push(inj.key);
    else missedKeys.push(inj.key);
  }
  return {
    total: injections.length,
    caught: caughtKeys.length,
    missed: missedKeys.length,
    caughtKeys,
    missedKeys,
  };
}

function fmtTurnover(t: number): string {
  return `${(t * 100).toFixed(2)}%`;
}

/* ── Komponen interaktif ───────────────────────────────────────────────── */
export default function ImpostorAudit({
  spec,
  onDebrief,
}: {
  spec: ImpostorAuditSpec;
  onDebrief?: (opened: boolean) => void;
}) {
  const [flagged, setFlagged] = useState<number[]>([]);
  const [debriefOpen, setDebriefOpen] = useState(false);

  const score: DetectionScore = useMemo(
    () => scoreDetection(flagged, spec.injections),
    [flagged, spec.injections]
  );

  function toggleFlag(rowId: number) {
    setFlagged((prev) =>
      prev.includes(rowId) ? prev.filter((r) => r !== rowId) : [...prev, rowId]
    );
  }

  function openDebrief() {
    setDebriefOpen(true);
    onDebrief?.(true);
  }

  function reset() {
    setFlagged([]);
    setDebriefOpen(false);
    onDebrief?.(false);
  }

  return (
    <div data-testid="impostor-audit" style={{ margin: "16px 0" }}>
      <div className="callout callout-warning">
        <strong>Misi audit.</strong> Di bawah ini dossier paket yang diklaim berisi{" "}
        <strong>16 simulasi unik</strong> (snapshot {spec.snapshotDate}, versi{" "}
        {spec.version}). Seseorang telah menyuntikkan{" "}
        <strong>{spec.injections.length} sabotase</strong> ke dalam paket ini{" "}
        <em>tanpa pengumuman</em> — angka yang dipalsukan, label yang salah,
        klaim yang tidak cocok dengan data. Tugasmu sebagai auditor: periksa
        setiap baris, dan tekan <strong>“Tandai sebagai anomali”</strong> pada
        baris yang menurutmu janggal. Setelah selesai, buka debrief untuk
        melihat skormu.
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table" data-testid="dossier-table">
          <thead>
            <tr>
              <th>Sim</th>
              <th>Family</th>
              <th>Sharpe</th>
              <th>Fitness</th>
              <th>Turnover</th>
              <th>Decay</th>
              <th>Status paket</th>
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
                  style={
                    isFlagged
                      ? { background: "rgba(220, 60, 60, 0.08)" }
                      : undefined
                  }
                >
                  <td>
                    <strong>#{row.simId}</strong>
                  </td>
                  <td>
                    <code className="kc">{row.family}</code>
                  </td>
                  <td>{row.sharpe.toFixed(2)}</td>
                  <td>{row.fitness.toFixed(2)}</td>
                  <td>{fmtTurnover(row.turnover)}</td>
                  <td>{row.decay}</td>
                  <td>{row.status}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {row.claims.map((c, i) => (
                        <li key={i}>
                          {c.label}: <strong>{c.value}</strong>
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
        Baris ditandai: <strong>{flagged.length}</strong> dari{" "}
        {spec.rows.length}
      </p>

      {!debriefOpen ? (
        <button
          type="button"
          data-testid="open-debrief"
          onClick={openDebrief}
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
            onClick={reset}
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
