"use client";

import { useEffect, useState } from "react";
import type { DeliverableSpec } from "../lib/types";

/* ── Deliverable akhir ber-rubrik.
      Pelajar menulis draf deliverable (textarea, tersimpan lokal), lalu
      melakukan self-check per kriteria rubrik. Gate: draf tidak kosong +
      semua kriteria dicentang → onComplete(true). ── */
export default function DeliverablePanel({
  spec,
  storageKey,
  onComplete,
}: {
  spec: DeliverableSpec;
  storageKey: string;
  onComplete?: (done: boolean) => void;
}) {
  const [draft, setDraft] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setDraft(localStorage.getItem(`${storageKey}:draft`) ?? "");
      const raw = localStorage.getItem(`${storageKey}:rubric`);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function saveDraft(v: string) {
    setDraft(v);
    try {
      localStorage.setItem(`${storageKey}:draft`, v);
    } catch {
      /* noop */
    }
  }
  function toggleCriterion(c: string) {
    const next = { ...checked, [c]: !checked[c] };
    setChecked(next);
    try {
      localStorage.setItem(`${storageKey}:rubric`, JSON.stringify(next));
    } catch {
      /* noop */
    }
    report(next, draft);
  }
  function report(chk: Record<string, boolean>, d: string) {
    const all = spec.rubric.every((r) => chk[r.criterion]);
    onComplete?.(all && d.trim().length >= 50);
  }

  const allChecked = spec.rubric.every((r) => checked[r.criterion]);
  const ready = allChecked && draft.trim().length >= 50;

  return (
    <div data-testid="deliverable-panel" style={{ margin: "16px 0" }}>
      <div className="callout">
        <strong>📦 Deliverable.</strong> Ini artefak portofoliomu: tulis
        seperti akan dikirim ke klien/employer sungguhan. Minimal 50 karakter
        yang bermakna, lalu centang self-check rubrik dengan jujur.
      </div>

      <h3 className="label">Template deliverable</h3>
      {spec.template.map((t, i) => (
        <p key={i}>
          <strong>{i + 1}.</strong> {t}
        </p>
      ))}

      <h3 className="label">Drafmu</h3>
      <textarea
        data-testid="deliverable-draft"
        className="v2ed-area"
        style={{ minHeight: 220, border: "1px solid var(--border)", borderRadius: "var(--r-2)" }}
        value={draft}
        onChange={(e) => {
          saveDraft(e.target.value);
          report(checked, e.target.value);
        }}
        placeholder="Tulis deliverable-mu di sini…"
        aria-label="Draf deliverable"
      />
      <p className="meta">{draft.trim().length} karakter (minimum 50)</p>

      <h3 className="label">Self-check rubrik</h3>
      {spec.rubric.map((r) => (
        <div key={r.criterion} className="note" style={{ marginBottom: 10 }}>
          <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
            <input
              type="checkbox"
              data-testid={`rubric-${r.criterion.slice(0, 12)}`}
              checked={!!checked[r.criterion]}
              onChange={() => toggleCriterion(r.criterion)}
              style={{ marginTop: 4 }}
            />
            <span>
              <strong>
                {r.criterion} <span className="meta">({r.weight}%)</span>
              </strong>
              <br />
              <small style={{ opacity: 0.85 }}>Level: {r.levels.join(" → ")}</small>
            </span>
          </label>
        </div>
      ))}

      {ready && (
        <div className="callout callout-success" data-testid="deliverable-ready">
          <strong>Deliverable siap.</strong> Kamu boleh lanjut ke debrief.
        </div>
      )}
    </div>
  );
}
