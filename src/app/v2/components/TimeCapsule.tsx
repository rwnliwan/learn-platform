"use client";
import { useEffect, useState } from "react";
import {
  PROJECT_POINTS,
  brierLabel,
  checkAnswer,
  loadTcState,
  pointsAtStep,
  projectSummary,
  sealPrediction,
  skipPoint,
  unskipPoint,
  type TcPoint,
  type TcState,
} from "../lib/timecapsule";
import "./timecapsule.css";

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

/* ================= titik prediksi (di atas langkah anchor) ================= */

export function TimeCapsulePoint({ slug, point, tick }: { slug: string; point: TcPoint; tick: number }) {
  const [state, setState] = useState<TcState>(() => loadTcState(slug, point.pointId));
  const [formMode, setFormMode] = useState<"idle" | "predict" | "correct">("idle");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [conf, setConf] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setState(loadTcState(slug, point.pointId));
    setFormMode("idle");
    setErr("");
  }, [slug, point.pointId, tick]);

  const resolved = !!state.resolvedAt;
  const skipped = !resolved && !!state.skippedAt;
  const sealedLatest = state.versions.filter((v) => !v.outOfWindow).slice(-1)[0];
  const oow = state.versions.filter((v) => v.outOfWindow);

  function startForm(mode: "predict" | "correct") {
    const base = mode === "correct" && sealedLatest ? sealedLatest : undefined;
    const a: Record<string, string> = {};
    const c: Record<string, number> = {};
    for (const q of point.questions) {
      a[q.qid] = base?.answers[q.qid] ?? "";
      c[q.qid] = base?.conf[q.qid] ?? 50;
    }
    setAnswers(a);
    setConf(c);
    setReason("");
    setErr("");
    setFormMode(mode);
  }

  function doSeal() {
    for (const q of point.questions) {
      if (!(answers[q.qid] ?? "").trim()) {
        setErr("Isi semua jawaban dulu sebelum menyegel.");
        return;
      }
      if (checkAnswer(q, answers[q.qid]) === null && q.kind !== "pair" && q.kind !== "code") {
        // number/int yang tidak bisa diparse tetap boleh? Tidak — minta angka valid.
        setErr(`Jawaban "${q.label}" harus berupa angka yang valid.`);
        return;
      }
    }
    const s = sealPrediction(slug, point.pointId, answers, conf, reason.trim());
    setState({ ...s });
    setFormMode("idle");
  }

  function doSkip() {
    setState({ ...skipPoint(slug, point.pointId) });
  }
  function doUnskip() {
    setState({ ...unskipPoint(slug, point.pointId) });
    startForm("predict");
  }

  return (
    <section className="tc-card" aria-label={point.title}>
      <div className="tc-head">
        <span className="tc-badge">⏳ KAPSUL WAKTU</span>
        <h3 className="tc-title">{point.title}</h3>
      </div>
      <p className="tc-intro">{point.intro}</p>
      <p className="tc-guard">
        Ini latihan kalibrasi, bukan taruhan — tidak ada hukuman. Setelah disegel, prediksi <b>tidak bisa diubah</b>;
        koreksi hanya sebagai versi baru. Versi yang disegel setelah hasil dibuka tidak ikut penilaian.
      </p>

      {resolved && state.resolutionKind === "resolved" && (
        <div className="tc-resolved">
          <div className="tc-score">
            Skor kalibrasi (Brier): <b>{state.brier !== undefined ? state.brier.toFixed(2) : "—"}</b>
            <span className="tc-score-note">
              {state.brier !== undefined ? ` — ${brierLabel(state.brier)}` : ""} · makin kecil makin baik · ter-resolve {fmtDate(state.resolvedAt)}
            </span>
          </div>
          {state.results?.map((r) => {
            const q = point.questions.find((x) => x.qid === r.qid)!;
            return (
              <div key={r.qid} className={`tc-qres ${r.correct ? "ok" : "no"}`}>
                <div className="tc-qres-q">{q.label}</div>
                <div className="tc-qres-row">
                  <span>Prediksimu: <b>{r.answer || "—"}</b> (yakin {r.confidence}%)</span>
                  <span>Ground truth: <b>{q.expectedNote}</b></span>
                  <span className="tc-mark">{r.correct ? "✓ tepat" : "✗ meleset"}</span>
                </div>
              </div>
            );
          })}
          {oow.length > 0 && (
            <p className="tc-oow">
              {oow.length} versi koreksi disegel setelah hasil dibuka — ditandai di luar jendela dan tidak ikut skor.
            </p>
          )}
        </div>
      )}

      {resolved && state.resolutionKind !== "resolved" && (
        <p className="tc-muted">
          {state.resolutionKind === "skipped"
            ? "Titik ini kamu lewati tanpa prediksi — tidak ada skor."
            : "Tidak ada prediksi tersegel sebelum hasil dibuka — tidak ada skor."}{" "}
          Ter-resolve {fmtDate(state.resolvedAt)}.
        </p>
      )}

      {!resolved && skipped && (
        <div className="tc-skipped">
          <p className="tc-muted">Kamu melewati titik ini tanpa prediksi ({fmtDate(state.skippedAt)}). Proyek tetap bisa dilanjutkan.</p>
          <button className="btn ghost" onClick={doUnskip}>Batalkan — saya mau memprediksi</button>
        </div>
      )}

      {!resolved && !skipped && sealedLatest && formMode === "idle" && (
        <div className="tc-sealed">
          <p className="tc-sealed-note">
            🔒 Tersegel {fmtDate(sealedLatest.sealedAt)} (versi {sealedLatest.v}
            {state.versions.length > 1 ? ` dari ${state.versions.length}` : ""}) — tidak bisa diubah.
          </p>
          {point.questions.map((q) => (
            <div key={q.qid} className="tc-sealed-q">
              <span>{q.label}</span>
              <span><b>{sealedLatest.answers[q.qid]}</b>{q.unit ? ` ${q.unit}` : ""} · yakin {sealedLatest.conf[q.qid] ?? 50}%</span>
            </div>
          ))}
          {sealedLatest.reason && <p className="tc-reason">Alasan: {sealedLatest.reason}</p>}
          <button className="btn ghost" onClick={() => startForm("correct")}>Buat koreksi (versi baru)</button>
        </div>
      )}

      {!resolved && !skipped && formMode !== "idle" && (
        <div className="tc-form">
          {point.questions.map((q) => (
            <div key={q.qid} className="tc-field">
              <label>{q.label}</label>
              <div className="tc-field-row">
                <input
                  className="tc-input"
                  value={answers[q.qid] ?? ""}
                  onChange={(e) => setAnswers({ ...answers, [q.qid]: e.target.value })}
                  placeholder={q.kind === "int" || q.kind === "number" ? "angka…" : "jawaban…"}
                  inputMode={q.kind === "int" || q.kind === "number" ? "decimal" : "text"}
                  aria-label={q.label}
                />
                {q.unit && <span className="tc-unit">{q.unit}</span>}
                <label className="tc-conf">
                  Yakin <b>{conf[q.qid] ?? 50}%</b>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={conf[q.qid] ?? 50}
                    onChange={(e) => setConf({ ...conf, [q.qid]: Number(e.target.value) })}
                    aria-label={`Keyakinan untuk: ${q.label}`}
                  />
                </label>
              </div>
            </div>
          ))}
          <div className="tc-field">
            <label>Alasan singkat (opsional)</label>
            <textarea
              className="tc-area"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Kenapa kamu menebak angka ini? Satu-dua kalimat cukup."
              rows={2}
            />
          </div>
          {err && <p className="tc-err">{err}</p>}
          <div className="tc-actions">
            <button className="btn primary" onClick={doSeal}>🔒 Segel prediksiku</button>
            <button className="btn ghost" onClick={() => setFormMode("idle")}>Batal</button>
          </div>
        </div>
      )}

      {!resolved && !skipped && !sealedLatest && formMode === "idle" && (
        <div className="tc-actions">
          <button className="btn primary" onClick={() => startForm("predict")}>Buat prediksi</button>
          <button className="btn ghost" onClick={doSkip}>Lewati titik ini</button>
        </div>
      )}
    </section>
  );
}

/* ================= ringkasan kalibrasi (di langkah debrief) ================= */

export function TimeCapsuleSummary({ slug, tick }: { slug: string; tick: number }) {
  const [s, setS] = useState(() => projectSummary(slug));
  useEffect(() => setS(projectSummary(slug)), [slug, tick]);
  if (!(slug in PROJECT_POINTS)) return null;
  return (
    <section className="tc-card tc-summary" aria-label="Ringkasan kalibrasi Time Capsule">
      <div className="tc-head">
        <span className="tc-badge">⏳ RINGKASAN KAPSUL WAKTU</span>
        <h3 className="tc-title">Seberapa terkalibrasi prediksimu?</h3>
      </div>
      {s.meanBrier !== undefined ? (
        <p className="tc-score">
          Rata-rata skor kalibrasi (Brier): <b>{s.meanBrier.toFixed(2)}</b>
          <span className="tc-score-note"> — {brierLabel(s.meanBrier)} · makin kecil makin baik</span>
        </p>
      ) : (
        <p className="tc-muted">Belum ada titik prediksi yang ter-resolve dengan skor.</p>
      )}
      <ul className="tc-sumlist">
        {s.points.map(({ point, state }) => (
          <li key={point.pointId}>
            <span>{point.title.replace(/^Kapsul Waktu \d+ — /, "")}</span>
            <span className="tc-sumstat">
              {state.resolutionKind === "resolved" && state.brier !== undefined
                ? `Brier ${state.brier.toFixed(2)}`
                : state.resolutionKind === "skipped" || state.resolutionKind === "no-versions"
                  ? "tanpa skor"
                  : state.versions.length
                    ? "tersegel — menunggu hasil dibuka"
                    : "belum diprediksi"}
            </span>
          </li>
        ))}
      </ul>
      <p className="tc-muted">
        {s.resolved} ter-resolve · {s.skipped} tanpa skor · {s.pending} menunggu · dari {s.total} titik prediksi.
      </p>
    </section>
  );
}

/** helper untuk Workspace: titik pada langkah ini + apakah summary tampil */
export function useTcForStep(slug: string, stepId: string) {
  return {
    points: pointsAtStep(slug, stepId),
    showSummary: slug in PROJECT_POINTS && stepId === "debrief",
  };
}
