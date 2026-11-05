"use client";

import { useEffect, useState } from "react";
import type { DecisionSpec } from "../lib/types";

/* ── Checkpoint keputusan bercabang.
      Pelajar memilih SATU opsi; pilihan dicatat (localStorage) dan tidak
      bisa diubah diam-diam — konsekuensinya terungkap setelah memilih.
      Pilihan menentukan langkah berikutnya via nextStepId (di Workspace). ── */
export interface DecisionChoice {
  optionId: string;
  ts: number;
}

export function loadDecision(key: string): DecisionChoice | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as DecisionChoice) : null;
  } catch {
    return null;
  }
}

export default function DecisionCheckpoint({
  spec,
  storageKey,
  onChosen,
}: {
  spec: DecisionSpec;
  storageKey: string;
  onChosen?: (optionId: string) => void;
}) {
  const [choice, setChoice] = useState<DecisionChoice | null>(null);

  useEffect(() => {
    setChoice(loadDecision(storageKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function choose(optionId: string) {
    if (choice) return; // keputusan final — seperti di pekerjaan nyata
    const c: DecisionChoice = { optionId, ts: Date.now() };
    try {
      localStorage.setItem(storageKey, JSON.stringify(c));
    } catch {
      /* noop */
    }
    setChoice(c);
    onChosen?.(optionId);
  }

  const chosenOpt = spec.options.find((o) => o.id === choice?.optionId);

  return (
    <div data-testid="decision-checkpoint" style={{ margin: "16px 0" }}>
      <div className="callout callout-warning">
        <strong>⛔ Checkpoint keputusan.</strong> Ini bukan kuis benar/salah —
        tidak ada jawaban yang "aman". Pilih satu, dan pilihanmu mengubah
        langkah berikutnya. Keputusanmu <strong>final</strong> (seperti
        rekomendasi yang sudah dikirim ke klien).
      </div>
      <p style={{ fontWeight: 600 }}>{spec.prompt}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {spec.options.map((o) => {
          const isChosen = choice?.optionId === o.id;
          const dimmed = choice && !isChosen;
          return (
            <button
              key={o.id}
              type="button"
              data-testid={`decision-opt-${o.id}`}
              onClick={() => choose(o.id)}
              disabled={!!choice}
              className={`opt${isChosen ? " right" : ""}`}
              style={{
                textAlign: "left",
                cursor: choice ? "default" : "pointer",
                opacity: dimmed ? 0.55 : 1,
              }}
            >
              <span className="l">{o.label.charAt(0)}</span>
              <span>
                <strong>{o.label}</strong>
                <br />
                <small style={{ opacity: 0.85 }}>{o.rationale}</small>
                {isChosen && (
                  <small
                    data-testid="decision-consequence"
                    style={{ display: "block", marginTop: 8 }}
                  >
                    <strong>Konsekuensi pilihanmu:</strong> {o.consequenceNote}
                  </small>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {chosenOpt && (
        <p className="meta" style={{ marginTop: 10 }}>
          Keputusan tercatat. Tekan <strong>Lanjut</strong> — langkah berikutnya
          mengikuti pilihanmu.
        </p>
      )}
    </div>
  );
}
