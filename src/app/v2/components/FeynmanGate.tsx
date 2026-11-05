// Feynman Gate 2.0 — Gelombang N (aditif).
// Dipasang di langkah terakhir lesson (Workspace). Murid menjelaskan kembali
// konsep dengan kata-katanya sendiri; AI menilai terhadap poin kunci lesson.
// Gate ini BUKAN pengunci progres — yang ditahan hanyalah lencana "Feynman: Lolos".
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { V2Lesson } from "../lib/types";
import {
  AiError,
  chatComplete,
  isAiConfigured,
  loadAiConfig,
} from "../lib/ai";
import AiNotConfigured from "./AiGate";
import {
  FEYNMAN_MIN_CHARS,
  FeynmanAttempt,
  FeynmanStatus,
  buildKeyContext,
  feynmanStatus,
  feynmanSystemPrompt,
  feynmanUserPrompt,
  loadFeynmanAttempts,
  parseFeynmanResult,
  saveFeynmanAttempt,
} from "../lib/feynman";
import "./feynman.css";

const STATUS_LABEL: Record<FeynmanStatus, string> = {
  belum: "Belum dicoba",
  perbaiki: "Perlu diperbaiki",
  lolos: "Feynman: Lolos ✓",
};

function fmtTs(ts: number): string {
  try {
    return new Date(ts).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

function ScoreBars({ a }: { a: FeynmanAttempt }) {
  const rows: [string, number][] = [
    ["Akurasi konsep", a.scores.akurasi],
    ["Kelengkapan poin kunci", a.scores.kelengkapan],
    ["Kejelasan & struktur", a.scores.kejelasan],
    ["Contoh/aplikasi", a.scores.contoh],
  ];
  return (
    <div className="fg-scores">
      {rows.map(([label, v]) => (
        <div className="fg-score-row" key={label}>
          <span className="fg-score-label">{label}</span>
          <div className="fg-score-track" aria-hidden="true">
            <div className="fg-score-fill" style={{ width: `${v}%` }} />
          </div>
          <span className="fg-score-num">{v}</span>
        </div>
      ))}
    </div>
  );
}

function AttemptView({ a, latest }: { a: FeynmanAttempt; latest: boolean }) {
  return (
    <div className={`fg-result fg-${a.verdict}`}>
      <div className="fg-verdict-row">
        <span className={`fg-verdict fg-${a.verdict}`}>
          {a.verdict === "lolos" ? "Lolos ✓" : "Perbaiki"}
        </span>
        <span className="fg-ts">{fmtTs(a.ts)}{latest ? " · terbaru" : ""}</span>
      </div>
      <ScoreBars a={a} />
      {a.gaps.length > 0 && (
        <div className="fg-gaps">
          <h4>Celah yang perlu diperbaiki</h4>
          <ul>
            {a.gaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}
      {a.feedback && (
        <div className="fg-feedback">
          <h4>Umpan balik penilai</h4>
          <p>{a.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default function FeynmanGate({ lesson }: { lesson: V2Lesson }) {
  // Nilai netral saat SSR — localStorage HANYA dibaca di useEffect (pelajaran Gelombang J).
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState<FeynmanAttempt[]>([]);
  const [text, setText] = useState("");
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setConfigured(isAiConfigured(loadAiConfig()));
    setAttempts(loadFeynmanAttempts(lesson.slug));
  }, [lesson.slug]);

  const keyCtx = useMemo(() => buildKeyContext(lesson), [lesson]);
  const status = feynmanStatus(attempts);
  const latest = attempts[attempts.length - 1] ?? null;
  const past = attempts.slice(0, -1).reverse();
  const len = text.trim().length;
  const canGrade = !grading && len >= FEYNMAN_MIN_CHARS;

  const grade = async () => {
    if (!canGrade) return;
    setError(null);
    setRawResponse(null);
    setGrading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const r = await chatComplete({
        messages: [
          { role: "system", content: feynmanSystemPrompt(keyCtx) },
          { role: "user", content: feynmanUserPrompt(lesson.title, text.trim()) },
        ],
        feature: "feynman",
        temperature: 0.3,
        maxTokens: 900,
        signal: ctrl.signal,
      });
      const parsed = parseFeynmanResult(r.text);
      if (!parsed.ok) {
        setRawResponse(parsed.raw);
        setError(
          "Format penilaian AI tidak terbaca. Respons mentah AI ditampilkan di bawah — skor tidak ditampilkan agar tidak mengarang. Coba nilai lagi."
        );
        return;
      }
      const attempt: FeynmanAttempt = {
        ts: Date.now(),
        text: text.trim(),
        ...parsed.assessment,
      };
      setAttempts(saveFeynmanAttempt(lesson.slug, attempt));
    } catch (e) {
      if (e instanceof AiError) {
        setError(e.message + " Penjelasanmu tidak hilang — perbaiki koneksi lalu coba lagi.");
      } else if (e instanceof DOMException && e.name === "AbortError") {
        setError("Penilaian dibatalkan. Penjelasanmu tidak hilang.");
      } else {
        setError("Terjadi kesalahan tak terduga. Penjelasanmu tidak hilang — coba lagi.");
      }
    } finally {
      abortRef.current = null;
      setGrading(false);
    }
  };

  const cancel = () => abortRef.current?.abort();

  return (
    <section className="fg-panel" aria-label="Feynman Gate">
      <div className="fg-head">
        <h3 className="fg-title">Feynman Gate</h3>
        <span className={`fg-badge fg-st-${status}`}>{STATUS_LABEL[status]}</span>
      </div>
      <p className="fg-note">
        Uji penguasaanmu: jelaskan kembali konsep lesson ini dengan kata-katamu
        sendiri, lalu minta AI menilainya. Gate ini <strong>tidak mengunci
        progres</strong> — yang ditahan hanyalah lencana "Feynman: Lolos".
      </p>

      {configured === null ? (
        <p className="fg-muted">Memuat…</p>
      ) : !configured ? (
        <AiNotConfigured featureLabel="Feynman Gate" />
      ) : (
        <>
          {latest && <AttemptView a={latest} latest />}
          {past.length > 0 && (
            <details className="fg-history">
              <summary>Riwayat percobaan ({past.length})</summary>
              {past.map((a, i) => (
                <details className="fg-history-item" key={`${a.ts}:${i}`}>
                  <summary>
                    {fmtTs(a.ts)} — {a.verdict === "lolos" ? "Lolos ✓" : "Perbaiki"}
                  </summary>
                  <AttemptView a={a} latest={false} />
                </details>
              ))}
            </details>
          )}

          <div className="fg-form">
            <label className="fg-label" htmlFor={`fg-text-${lesson.slug}`}>
              Penjelasanmu (kata-katamu sendiri)
            </label>
            <textarea
              id={`fg-text-${lesson.slug}`}
              className="fg-area"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: Konsep intinya adalah… Cara kerjanya… Contohnya dalam praktik…"
              rows={8}
            />
            <div className="fg-form-row">
              <span className={`fg-count${len < FEYNMAN_MIN_CHARS ? " fg-short" : ""}`}>
                {len} / {FEYNMAN_MIN_CHARS} karakter minimal
              </span>
              <div className="fg-actions">
                {grading ? (
                  <button type="button" className="fg-btn fg-ghost" onClick={cancel}>
                    Batalkan
                  </button>
                ) : (
                  <button
                    type="button"
                    className="fg-btn"
                    onClick={grade}
                    disabled={!canGrade}
                    title={len < FEYNMAN_MIN_CHARS ? "Penjelasan terlalu pendek untuk dinilai secara adil" : ""}
                  >
                    Nilai penjelasanku
                  </button>
                )}
              </div>
            </div>
            {len > 0 && len < FEYNMAN_MIN_CHARS && (
              <p className="fg-hint">
                Penjelasan di bawah {FEYNMAN_MIN_CHARS} karakter terlalu pendek
                untuk dinilai secara adil — kembangkan dulu.
              </p>
            )}
            {grading && <p className="fg-muted">AI sedang menilai…</p>}
            {error && (
              <div className="fg-error" role="alert">
                <p>{error}</p>
                {!grading && (
                  <button type="button" className="fg-btn fg-ghost" onClick={grade} disabled={!canGrade}>
                    Coba lagi
                  </button>
                )}
              </div>
            )}
            {rawResponse && (
              <details className="fg-raw">
                <summary>Respons mentah AI</summary>
                <pre>{rawResponse}</pre>
              </details>
            )}
          </div>
        </>
      )}
    </section>
  );
}
