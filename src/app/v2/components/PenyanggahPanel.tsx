// AI Penyanggah (devil's advocate) — Gelombang O (aditif).
//
// Latihan berpikir kritis dua mode:
//   - "quiz": di bawah kuis sebuah langkah, SETELAH murid menjawab — AI
//     menyanggah JAWABAN MURID (bukan kunci jawaban).
//   - "bebas": di penutup lesson — murid menulis klaim bebas tentang topik.
//
// Alur: posisi → sanggahan (AI) → pembelaan (murid) → vonis (AI).
// NON-BLOKIR dan NON-PENILAI: tidak menyentuh skor kuis, progres, atau FSRS.
"use client";

import { useEffect, useRef, useState } from "react";
import type { V2Lesson, V2QuizItem } from "../lib/types";
import {
  AiError,
  chatComplete,
  isAiConfigured,
  loadAiConfig,
} from "../lib/ai";
import AiNotConfigured from "./AiGate";
import {
  PENYANGGAH_MIN_CHARS,
  PenyanggahSession,
  Sanggahan,
  Vonis,
  buildQuizPosition,
  loadFreeSessions,
  loadQuizSession,
  parseSanggahan,
  parseVonis,
  penyanggahUserPromptFree,
  penyanggahUserPromptQuiz,
  penyanggahUserPromptR2,
  quizKonteksId,
  deleteQuizSession,
  saveFreeSession,
  saveQuizSession,
  PENYANGGAH_SYSTEM_R1,
  PENYANGGAH_SYSTEM_R2,
} from "../lib/penyanggah";
import "./penyanggah.css";

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

function SanggahanView({ s }: { s: Sanggahan }) {
  return (
    <div className="sg-sanggahan-box">
      <h4 className="sg-sub">Sanggahan AI</h4>
      <p className="sg-sanggahan">{s.sanggahan}</p>
      {s.titik_lemah.length > 0 && (
        <>
          <h4 className="sg-sub">Titik lemah posisimu</h4>
          <ul className="sg-titik">
            {s.titik_lemah.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </>
      )}
      <div className="sg-balik">
        <strong>Pertanyaan balik:</strong> {s.pertanyaan_balik}
      </div>
    </div>
  );
}

function VonisView({ v }: { v: Vonis }) {
  return (
    <div className={`sg-vonis ${v.bertahan ? "sg-ok" : "sg-runtuh"}`}>
      <div className="sg-verdict-row">
        <span className={`sg-verdict ${v.bertahan ? "sg-ok" : "sg-runtuh"}`}>
          {v.bertahan ? "Posisi bertahan ✓" : "Posisi runtuh"}
        </span>
      </div>
      <p className="sg-alasan">{v.alasan}</p>
      {v.saran && (
        <p className="sg-saran">
          <strong>Saran:</strong> {v.saran}
        </p>
      )}
    </div>
  );
}

/**
 * Satu alur sanggah → bela → vonis. Dipakai per soal kuis dan per klaim bebas.
 * `initial`: sesi tersimpan (bila ada). `onPersist`: simpan/hapus sesi ke store.
 * `onResetDone`: dipanggil setelah "Sesi baru" (mode bebas kembali ke form).
 */
function SanggahFlow({
  idPrefix,
  posisiSummary,
  r1UserPrompt,
  initial,
  autoStart,
  onPersist,
  onResetDone,
}: {
  idPrefix: string;
  posisiSummary: string;
  r1UserPrompt: string;
  initial: PenyanggahSession | null;
  autoStart?: boolean;
  onPersist: (s: PenyanggahSession | null) => void;
  onResetDone?: () => void;
}) {
  const [sess, setSess] = useState<PenyanggahSession | null>(initial);
  const [phase, setPhase] = useState<"idle" | "r1" | "r2">("idle");
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const [pembelaan, setPembelaan] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (autoStart && !startedRef.current && !initial) {
      startedRef.current = true;
      void requestR1();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAndPersist = (s: PenyanggahSession | null) => {
    setSess(s);
    onPersist(s);
  };

  const requestR1 = async () => {
    setError(null);
    setRaw(null);
    setPhase("r1");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const r = await chatComplete({
        messages: [
          { role: "system", content: PENYANGGAH_SYSTEM_R1 },
          { role: "user", content: r1UserPrompt },
        ],
        feature: "penyanggah",
        temperature: 0,
        maxTokens: 700,
        signal: ctrl.signal,
      });
      const p = parseSanggahan(r.text);
      if (!p.ok) {
        setRaw(p.raw);
        setError(
          "Format sanggahan AI tidak terbaca. Respons mentah ditampilkan di bawah — tidak ada vonis yang dikarang. Coba minta sanggahan lagi."
        );
        return;
      }
      setAndPersist({ ts: Date.now(), posisi: posisiSummary, sanggahan: p.value });
    } catch (e) {
      if (e instanceof AiError) {
        setError(e.message + " Posisimu tidak hilang — perbaiki koneksi lalu coba lagi.");
      } else if (e instanceof DOMException && e.name === "AbortError") {
        setError("Permintaan dibatalkan. Posisimu tidak hilang.");
      } else {
        setError("Terjadi kesalahan tak terduga. Posisimu tidak hilang — coba lagi.");
      }
    } finally {
      abortRef.current = null;
      setPhase("idle");
    }
  };

  const requestR2 = async () => {
    if (!sess) return;
    const bela = pembelaan.trim();
    if (!bela) return;
    setError(null);
    setRaw(null);
    setPhase("r2");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const r = await chatComplete({
        messages: [
          { role: "system", content: PENYANGGAH_SYSTEM_R2 },
          { role: "user", content: penyanggahUserPromptR2(sess.posisi, sess.sanggahan, bela) },
        ],
        feature: "penyanggah",
        temperature: 0,
        maxTokens: 500,
        signal: ctrl.signal,
      });
      const p = parseVonis(r.text);
      if (!p.ok) {
        setRaw(p.raw);
        setError(
          "Format vonis AI tidak terbaca. Respons mentah ditampilkan di bawah — tidak ada vonis yang dikarang. Coba kirim pembelaan lagi."
        );
        return;
      }
      const done: PenyanggahSession = { ...sess, pembelaan: bela, vonis: p.value };
      setAndPersist(done);
      setPembelaan("");
    } catch (e) {
      if (e instanceof AiError) {
        setError(e.message + " Pembelaanmu tidak hilang — perbaiki koneksi lalu coba lagi.");
      } else if (e instanceof DOMException && e.name === "AbortError") {
        setError("Permintaan dibatalkan. Pembelaanmu tidak hilang.");
      } else {
        setError("Terjadi kesalahan tak terduga. Pembelaanmu tidak hilang — coba lagi.");
      }
    } finally {
      abortRef.current = null;
      setPhase("idle");
    }
  };

  const cancel = () => abortRef.current?.abort();

  const reset = () => {
    setAndPersist(null);
    setError(null);
    setRaw(null);
    setPembelaan("");
    onResetDone?.();
  };

  return (
    <div className="sg-flow">
      {!sess && phase === "idle" && !autoStart && (
        <div className="sg-actions">
          <button type="button" className="sg-btn" onClick={() => void requestR1()}>
            Minta sanggahan AI
          </button>
        </div>
      )}
      {phase === "r1" && (
        <div className="sg-loading">
          <p className="sg-muted">AI sedang menyusun sanggahan…</p>
          <button type="button" className="sg-btn sg-ghost" onClick={cancel}>
            Batalkan
          </button>
        </div>
      )}
      {sess && (
        <>
          <SanggahanView s={sess.sanggahan} />
          {!sess.vonis && (
            <div className="sg-form">
              <label className="sg-label" htmlFor={`${idPrefix}-bela`}>
                Pembelaanmu — jawab titik lemah dan pertanyaan balik di atas
              </label>
              <textarea
                id={`${idPrefix}-bela`}
                className="sg-ta"
                value={pembelaan}
                onChange={(e) => setPembelaan(e.target.value)}
                placeholder="Contoh: Asumsi saya tetap berlaku karena… Kasus batasnya saya tangani dengan…"
                rows={5}
              />
              <div className="sg-form-row">
                <span className="sg-count">{pembelaan.trim().length} karakter</span>
                <div className="sg-actions">
                  {phase === "r2" ? (
                    <button type="button" className="sg-btn sg-ghost" onClick={cancel}>
                      Batalkan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="sg-btn"
                      onClick={() => void requestR2()}
                      disabled={!pembelaan.trim()}
                    >
                      Kirim pembelaan
                    </button>
                  )}
                </div>
              </div>
              {phase === "r2" && <p className="sg-muted">AI sedang menilai pembelaanmu…</p>}
            </div>
          )}
          {sess.vonis && (
            <>
              <VonisView v={sess.vonis} />
              <div className="sg-actions">
                <button type="button" className="sg-btn sg-ghost" onClick={reset}>
                  Sesi baru
                </button>
              </div>
            </>
          )}
        </>
      )}
      {error && (
        <div className="sg-error" role="alert">
          <p>{error}</p>
          {!sess && phase === "idle" && (
            <button type="button" className="sg-btn sg-ghost" onClick={() => void requestR1()}>
              Coba lagi
            </button>
          )}
          {sess && !sess.vonis && phase === "idle" && (
            <button
              type="button"
              className="sg-btn sg-ghost"
              onClick={() => void requestR2()}
              disabled={!pembelaan.trim()}
            >
              Coba lagi
            </button>
          )}
        </div>
      )}
      {raw && (
        <details className="sg-raw">
          <summary>Respons mentah AI</summary>
          <pre>{raw}</pre>
        </details>
      )}
    </div>
  );
}

function QuizItem({
  slug,
  lessonTitle,
  stepId,
  qIdx,
  quiz,
  userOptIdx,
}: {
  slug: string;
  lessonTitle: string;
  stepId: string;
  qIdx: number;
  quiz: V2QuizItem[];
  userOptIdx: number;
}) {
  const konteksId = quizKonteksId(stepId, qIdx);
  const [initial, setInitial] = useState<PenyanggahSession | null>(null);
  const [vonis, setVonis] = useState<Vonis | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pos = buildQuizPosition(quiz, qIdx, userOptIdx);

  useEffect(() => {
    const s = loadQuizSession(slug, konteksId);
    setInitial(s);
    setVonis(s?.vonis ?? null);
    setLoaded(true);
  }, [slug, konteksId]);

  if (!pos) return null;
  const posisiSummary = `Soal ${qIdx + 1}: "${pos.question}" — jawaban saya: ${pos.userLabel}) ${pos.userText} (${pos.userCorrect ? "benar" : "salah"})`;

  return (
    <div className="sg-qitem">
      <div className="sg-qhead">
        <span className="sg-qno">Soal {qIdx + 1}</span>
        <span className={`sg-abadge ${pos.userCorrect ? "sg-ok" : "sg-bad"}`}>
          Jawabanmu {pos.userLabel} · {pos.userCorrect ? "benar" : "salah"}
        </span>
        {vonis && (
          <span className={`sg-abadge ${vonis.bertahan ? "sg-ok" : "sg-bad"}`}>
            Vonis: {vonis.bertahan ? "bertahan ✓" : "runtuh"}
          </span>
        )}
      </div>
      {loaded && (
        <SanggahFlow
          idPrefix={`sgq-${stepId}-${qIdx}`}
          posisiSummary={posisiSummary}
          r1UserPrompt={penyanggahUserPromptQuiz(lessonTitle, pos)}
          initial={initial}
          onPersist={(s) => {
            // Sesi terakhir per soal tetap tersimpan dan bisa dibuka kembali;
            // "Sesi baru" menghapusnya agar tidak bangkit setelah reload.
            if (s) {
              saveQuizSession(slug, konteksId, s);
              setVonis(s.vonis ?? null);
            } else {
              deleteQuizSession(slug, konteksId);
              setVonis(null);
            }
          }}
        />
      )}
    </div>
  );
}

function QuizMode({
  lesson,
  stepId,
  quiz,
  answers,
}: {
  lesson: V2Lesson;
  stepId: string;
  quiz: V2QuizItem[];
  answers: Record<number, number>;
}) {
  const answeredIdx = quiz
    .map((_, i) => i)
    .filter((i) => answers[i] !== undefined && buildQuizPosition(quiz, i, answers[i]) !== null);
  return (
    <section className="sg-panel" aria-label="AI Penyanggah untuk kuis">
      <div className="sg-head">
        <h3 className="sg-title">AI Penyanggah</h3>
        <span className="sg-badge">latihan devil's advocate</span>
      </div>
      <p className="sg-note">
        Sudah yakin dengan jawabanmu? Minta AI menyerang penalaran di baliknya —
        asumsi tersembunyi, edge case, interpretasi alternatif. Ini <strong>latihan</strong>:
        tidak mengubah skor kuis atau progresmu, dan AI tidak mengklaim jawaban
        yang benar secara faktual sebagai salah.
      </p>
      {answeredIdx.length === 0 ? (
        <p className="sg-muted">Jawab dulu satu soal di atas untuk mengaktifkan AI Penyanggah.</p>
      ) : (
        answeredIdx.map((i) => (
          <QuizItem
            key={`${stepId}:${i}`}
            slug={lesson.slug}
            lessonTitle={lesson.title}
            stepId={stepId}
            qIdx={i}
            quiz={quiz}
            userOptIdx={answers[i]}
          />
        ))
      )}
    </section>
  );
}

function FreeMode({ lesson }: { lesson: V2Lesson }) {
  const [claim, setClaim] = useState("");
  const [active, setActive] = useState<{ id: number; claim: string } | null>(null);
  const [activeTs, setActiveTs] = useState<number | null>(null);
  const [history, setHistory] = useState<PenyanggahSession[]>([]);
  const len = claim.trim().length;
  const canStart = len >= PENYANGGAH_MIN_CHARS;
  // Sesi yang sedang dikerjakan tidak diduplikasi di daftar riwayat.
  const visibleHistory = history.filter((h) => h.ts !== activeTs);

  useEffect(() => {
    setHistory(loadFreeSessions(lesson.slug).slice().reverse());
  }, [lesson.slug]);

  const start = () => {
    if (!canStart) return;
    setActive({ id: Date.now(), claim: claim.trim() });
    setClaim("");
  };

  const onPersist = (s: PenyanggahSession | null) => {
    if (s) {
      setHistory(saveFreeSession(lesson.slug, s).slice().reverse());
      setActiveTs(s.ts);
    }
  };

  return (
    <section className="sg-panel" aria-label="AI Penyanggah bebas">
      <div className="sg-head">
        <h3 className="sg-title">AI Penyanggah — mode bebas</h3>
        <span className="sg-badge">latihan devil's advocate</span>
      </div>
      <p className="sg-note">
        Punya klaim atau opini tentang topik lesson ini? Tulis di bawah, lalu
        minta AI menyanggahnya sekeras mungkin. Kamu membela, AI menjadi juri.
        Tersimpan di perangkat ini; bisa dibuka kembali kapan saja.
      </p>
      {!active ? (
        <div className="sg-form">
          <label className="sg-label" htmlFor={`sgf-claim-${lesson.slug}`}>
            Klaim / posisimu tentang lesson ini
          </label>
          <textarea
            id={`sgf-claim-${lesson.slug}`}
            className="sg-ta"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Contoh: Saya berpendapat bahwa untuk data kecil, interval kepercayaan bootstrap selalu lebih baik daripada pendekatan parametrik, karena…"
            rows={5}
          />
          <div className="sg-form-row">
            <span className={`sg-count${len < PENYANGGAH_MIN_CHARS ? " sg-short" : ""}`}>
              {len} / {PENYANGGAH_MIN_CHARS} karakter minimal
            </span>
            <div className="sg-actions">
              <button
                type="button"
                className="sg-btn"
                onClick={start}
                disabled={!canStart}
                title={
                  len < PENYANGGAH_MIN_CHARS
                    ? "Klaim terlalu pendek untuk disanggah secara adil"
                    : ""
                }
              >
                Minta sanggahan AI
              </button>
            </div>
          </div>
          {len > 0 && len < PENYANGGAH_MIN_CHARS && (
            <p className="sg-hint">
              Klaim di bawah {PENYANGGAH_MIN_CHARS} karakter terlalu pendek untuk
              disanggah secara adil — kembangkan dulu.
            </p>
          )}
        </div>
      ) : (
        <SanggahFlow
          key={active.id}
          idPrefix={`sgf-${active.id}`}
          posisiSummary={active.claim}
          r1UserPrompt={penyanggahUserPromptFree(lesson.title, active.claim)}
          initial={null}
          autoStart
          onPersist={onPersist}
          onResetDone={() => {
            setActive(null);
            setActiveTs(null);
          }}
        />
      )}
      {visibleHistory.length > 0 && (
        <details className="sg-history">
          <summary>Riwayat sesi ({visibleHistory.length})</summary>
          {visibleHistory.map((s, i) => (
            <details className="sg-history-item" key={`${s.ts}:${i}`}>
              <summary>
                {fmtTs(s.ts)} —{" "}
                {s.vonis ? (s.vonis.bertahan ? "bertahan ✓" : "runtuh") : "belum ada vonis"}
              </summary>
              <div className="sg-history-body">
                <p className="sg-posisi">
                  <strong>Posisi:</strong> {s.posisi}
                </p>
                <SanggahanView s={s.sanggahan} />
                {s.pembelaan && (
                  <p className="sg-posisi">
                    <strong>Pembelaan:</strong> {s.pembelaan}
                  </p>
                )}
                {s.vonis && <VonisView v={s.vonis} />}
              </div>
            </details>
          ))}
        </details>
      )}
    </section>
  );
}

export default function PenyanggahPanel(
  props:
    | { mode: "quiz"; lesson: V2Lesson; stepId: string; quiz: V2QuizItem[]; answers: Record<number, number> }
    | { mode: "bebas"; lesson: V2Lesson }
) {
  // Nilai netral saat SSR — localStorage HANYA dibaca di useEffect (pelajaran Gelombang J).
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    setConfigured(isAiConfigured(loadAiConfig()));
  }, []);

  if (configured === null) {
    return (
      <section className="sg-panel" aria-label="AI Penyanggah">
        <p className="sg-muted">Memuat…</p>
      </section>
    );
  }
  if (!configured) {
    return (
      <section className="sg-panel" aria-label="AI Penyanggah">
        <AiNotConfigured featureLabel="AI Penyanggah" />
      </section>
    );
  }
  if (props.mode === "quiz") {
    return <QuizMode lesson={props.lesson} stepId={props.stepId} quiz={props.quiz} answers={props.answers} />;
  }
  return <FreeMode lesson={props.lesson} />;
}
