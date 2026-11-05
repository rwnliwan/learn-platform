// Interview Simulator — Gelombang Q (ide #3), client.
//
// Alur: setup (peran/level/jumlah) → sesi (tanya-jawab bergiliran dengan AI
// pewawancara) → hasil (scorecard + transkrip). Sesi aktif tersimpan di
// localStorage `v2:interview:active` sehingga selamat dari refresh; sesi
// selesai masuk riwayat `v2:interview:sessions` (cap 10).
//
// localStorage HANYA dibaca di useEffect (pelajaran hidrasi Gelombang J).
// Non-blokir total: tidak menyentuh progres/FSRS/kuis.
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AiError, isAiConfigured, loadAiConfig } from "../lib/ai";
import AiNotConfigured from "../components/AiGate";
import {
  INTERVIEW_ROLES,
  INTERVIEW_LEVELS,
  INTERVIEW_MIN_QUESTIONS,
  INTERVIEW_MAX_QUESTIONS,
  pickTopics,
  fmtTopic,
  requestInterviewTurn,
  requestFinalAssessment,
  loadActiveSession,
  saveActiveSession,
  loadSessions,
  saveFinishedSession,
  roleLabel,
  levelLabel,
  avgScore,
  type ActiveSession,
  type FinishedSession,
  type InterviewLevel,
  type InterviewRole,
} from "../lib/interview";
import "./interview.css";

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

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function ScoreMeters({ label, value }: { label: string; value: number }) {
  return (
    <div className="iv-meter">
      <span>{label}</span>
      <span className="iv-mbar">
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </span>
      <b>{value}</b>
    </div>
  );
}

function TranscriptView({ turns }: { turns: FinishedSession["turns"] }) {
  return (
    <div className="iv-transcript">
      {turns.map((t, i) => (
        <Fragment key={i}>
          <div className="iv-msg iv-q">
            <span className="iv-who">Pewawancara</span>
            <span className="iv-topic">{t.topik}</span>
            <div>{t.pertanyaan}</div>
          </div>
          <div className="iv-msg iv-a">
            <span className="iv-who">Kamu</span>
            <div>{t.jawaban}</div>
          </div>
          <div className="iv-msg iv-fb">
            <span className="iv-who">Umpan balik</span>
            <div>{t.umpanBalik}</div>
            <span className="iv-score">Skor: {t.skor}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default function InterviewClient() {
  // Nilai netral saat SSR — localStorage HANYA dibaca di useEffect.
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [view, setView] = useState<"setup" | "session" | "result">("setup");

  const [roleId, setRoleId] = useState("credit-risk");
  const [level, setLevel] = useState<InterviewLevel>("junior");
  const [count, setCount] = useState(INTERVIEW_MIN_QUESTIONS);

  const [active, setActive] = useState<ActiveSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState<null | "turn" | "final">(null);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  /** true bila AI tidak menutup sesi padahal pertanyaan habis — tawarkan penilaian akhir manual. */
  const [needFinal, setNeedFinal] = useState(false);

  const [result, setResult] = useState<FinishedSession | null>(null);
  const [history, setHistory] = useState<FinishedSession[]>([]);
  const [histDetail, setHistDetail] = useState<FinishedSession | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setConfigured(isAiConfigured(loadAiConfig()));
    const a = loadActiveSession();
    setActive(a);
    if (a) {
      setAnswer(a.draftAnswer ?? "");
      setView("session");
    }
    setHistory(loadSessions());
    setReady(true);
  }, []);

  const roleOf = (s: ActiveSession): InterviewRole | undefined =>
    INTERVIEW_ROLES.find((r) => r.id === s.roleId);

  /** Selesaikan sesi: pindah ke riwayat, hapus sesi aktif. */
  const finishSession = (
    s: ActiveSession,
    penilaianAkhir: FinishedSession["penilaianAkhir"],
    endedEarly: boolean
  ) => {
    const fs: FinishedSession = {
      id: s.id,
      ts: Date.now(),
      roleId: s.roleId,
      level: s.level,
      turns: s.turns,
      penilaianAkhir,
      endedEarly,
    };
    saveFinishedSession(fs);
    saveActiveSession(null);
    setActive(null);
    setAnswer("");
    setResult(fs);
    setHistory(loadSessions());
    setView("result");
  };

  /** Minta pertanyaan pertama ke AI. */
  const doStart = async (s: ActiveSession) => {
    const role = roleOf(s);
    if (!role) {
      setError("Peran tidak dikenal. Kembali ke pengaturan dan mulai sesi baru.");
      return;
    }
    setError(null);
    setRaw(null);
    setNeedFinal(false);
    setBusy("turn");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await requestInterviewTurn({
        role,
        level: s.level,
        topics: s.topics,
        turns: [],
        answer: null,
        signal: ctrl.signal,
      });
      if (!res.ok) {
        setRaw(res.raw);
        setError(
          "Format respons AI tidak terbaca. Respons mentah ditampilkan di bawah — tidak ada pertanyaan yang dikarang. Coba lagi."
        );
        return;
      }
      if (res.turn.selesai || !res.turn.pertanyaanBerikutnya) {
        setRaw(JSON.stringify(res.turn, null, 2));
        setError("AI mengakhiri sesi sebelum mengajukan pertanyaan. Coba lagi.");
        return;
      }
      const next: ActiveSession = {
        ...s,
        pendingPertanyaan: res.turn.pertanyaanBerikutnya,
      };
      saveActiveSession(next);
      setActive(next);
    } catch (e) {
      if (e instanceof AiError) setError(e.message + " Sesi tersimpan — coba lagi.");
      else if (e instanceof DOMException && e.name === "AbortError")
        setError("Permintaan dibatalkan. Sesi tersimpan — lanjutkan kapan pun.");
      else setError("Terjadi kesalahan tak terduga. Sesi tersimpan — coba lagi.");
    } finally {
      abortRef.current = null;
      setBusy(null);
    }
  };

  /** Kirim jawaban → terima umpan balik + skor + pertanyaan berikut (atau selesai). */
  const doSend = async () => {
    if (!active || busy) return;
    const text = answer.trim();
    if (!text) return;
    const role = roleOf(active);
    if (!role) {
      setError("Peran tidak dikenal. Mulai sesi baru dari pengaturan.");
      return;
    }
    setError(null);
    setRaw(null);
    setNeedFinal(false);
    setBusy("turn");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const withDraft: ActiveSession = { ...active, draftAnswer: text };
    saveActiveSession(withDraft);
    setActive(withDraft);
    try {
      const res = await requestInterviewTurn({
        role,
        level: active.level,
        topics: active.topics,
        turns: active.turns,
        answer: text,
        signal: ctrl.signal,
      });
      if (!res.ok) {
        setRaw(res.raw);
        setError(
          "Format respons AI tidak terbaca. Jawabanmu TIDAK hilang dan tidak ada skor yang dikarang — perbaiki lalu coba lagi."
        );
        return;
      }
      const t = res.turn;
      const newTurn = {
        topik: active.pendingTopik ?? fmtTopic(active.topics[active.turns.length]!),
        pertanyaan: active.pendingPertanyaan ?? "",
        jawaban: text,
        umpanBalik: t.umpanBalik,
        skor: t.skor,
      };
      const turns = [...active.turns, newTurn];
      if (t.selesai && t.penilaianAkhir) {
        finishSession({ ...active, turns }, t.penilaianAkhir, false);
        return;
      }
      if (turns.length >= active.topics.length) {
        // AI tidak menutup sesi padahal pertanyaan habis — minta penilaian akhir eksplisit.
        setError(
          "AI tidak memberikan penilaian akhir. Minta penilaian akhir, atau simpan transkrip tanpa penilaian."
        );
        setNeedFinal(true);
        const keep: ActiveSession = {
          ...active,
          turns,
          draftAnswer: null,
          pendingPertanyaan: null,
          pendingTopik: null,
        };
        saveActiveSession(keep);
        setActive(keep);
        setAnswer("");
        return;
      }
      const next: ActiveSession = {
        ...active,
        turns,
        draftAnswer: null,
        pendingTopik: fmtTopic(active.topics[turns.length]!),
        pendingPertanyaan: t.pertanyaanBerikutnya,
      };
      saveActiveSession(next);
      setActive(next);
      setAnswer("");
    } catch (e) {
      if (e instanceof AiError) setError(e.message + " Jawabanmu tidak hilang — coba lagi.");
      else if (e instanceof DOMException && e.name === "AbortError")
        setError("Permintaan dibatalkan. Jawabanmu tidak hilang.");
      else setError("Terjadi kesalahan tak terduga. Jawabanmu tidak hilang — coba lagi.");
    } finally {
      abortRef.current = null;
      setBusy(null);
    }
  };

  /** Minta penilaian akhir untuk N giliran yang sudah ada (tanpa pertanyaan baru). */
  const requestFinal = async (s: ActiveSession): Promise<boolean> => {
    const role = roleOf(s);
    if (!role) return false;
    setError(null);
    setRaw(null);
    setBusy("final");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await requestFinalAssessment(role, s.level, s.topics, s.turns, ctrl.signal);
      if (!res.ok) {
        setRaw(res.raw);
        setError(
          "Format penilaian akhir AI tidak terbaca. Tidak ada skor yang dikarang — coba lagi, atau simpan transkrip tanpa penilaian."
        );
        return false;
      }
      finishSession(s, res.final.penilaianAkhir, true);
      return true;
    } catch (e) {
      if (e instanceof AiError) setError(e.message + " Transkripmu utuh — coba lagi.");
      else if (e instanceof DOMException && e.name === "AbortError")
        setError("Permintaan dibatalkan. Transkripmu utuh.");
      else setError("Terjadi kesalahan tak terduga. Transkripmu utuh — coba lagi.");
      return false;
    } finally {
      abortRef.current = null;
      setBusy(null);
    }
  };

  /** Akhiri sesi lebih awal: minta penilaian akhir dari AI. */
  const doEndEarly = async () => {
    if (!active || busy || active.turns.length === 0) return;
    await requestFinal(active);
  };

  /** Mulai sesi baru dari pengaturan. */
  const startNew = () => {
    const topics = pickTopics(roleId, level, count);
    if (topics.length === 0) {
      setError("Tidak ada topik untuk peran ini di kurikulum. Pilih peran lain.");
      return;
    }
    const s: ActiveSession = {
      id: genId(),
      ts: Date.now(),
      roleId,
      level,
      topics,
      turns: [],
      pendingTopik: fmtTopic(topics[0]!),
      pendingPertanyaan: null,
      draftAnswer: null,
    };
    saveActiveSession(s);
    setActive(s);
    setAnswer("");
    setResult(null);
    setHistDetail(null);
    setView("session");
    void doStart(s);
  };

  /** Buang sesi aktif tanpa menyimpan. */
  const discardActive = () => {
    saveActiveSession(null);
    setActive(null);
    setAnswer("");
    setView("setup");
  };

  if (!ready) {
    return (
      <div className="iv-wrap" aria-label="Simulator Wawancara">
        <p className="iv-muted">Memuat…</p>
      </div>
    );
  }

  const renderHistory = () => (
    <section className="iv-history" aria-label="Riwayat sesi">
      <h3>Riwayat sesi</h3>
      {histDetail ? (
        <div>
          <div className="iv-actions" style={{ marginTop: 0, marginBottom: 12 }}>
            <button type="button" className="iv-btn iv-ghost" onClick={() => setHistDetail(null)}>
              ← Kembali ke daftar
            </button>
          </div>
          <div className="iv-card">
            <h3>
              {roleLabel(histDetail.roleId)} · {levelLabel(histDetail.level)}
              {histDetail.endedEarly ? " · diakhiri lebih awal" : ""}
            </h3>
            <p className="iv-ts">
              {fmtTs(histDetail.ts)} · {histDetail.turns.length} jawaban
              {avgScore(histDetail) !== null ? ` · rata-rata skor ${avgScore(histDetail)}` : ""}
            </p>
            {histDetail.penilaianAkhir ? (
              <>
                <ScoreMeters label="Konsep" value={histDetail.penilaianAkhir.konsep} />
                <ScoreMeters label="Penerapan" value={histDetail.penilaianAkhir.penerapan} />
                <ScoreMeters label="Komunikasi" value={histDetail.penilaianAkhir.komunikasi} />
                <p className="iv-kesimpulan">{histDetail.penilaianAkhir.kesimpulan}</p>
                <ul className="iv-saran">
                  {histDetail.penilaianAkhir.saran.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="iv-muted">Sesi ini tersimpan tanpa penilaian akhir.</p>
            )}
          </div>
          <details className="iv-raw">
            <summary>Lihat transkrip ({histDetail.turns.length} giliran)</summary>
            <div style={{ marginTop: 10 }}>
              <TranscriptView turns={histDetail.turns} />
            </div>
          </details>
        </div>
      ) : history.length === 0 ? (
        <p className="iv-muted">Belum ada sesi selesai.</p>
      ) : (
        <div className="iv-hist">
          {history.map((h) => (
            <button
              key={h.id}
              type="button"
              className="iv-hist-item"
              onClick={() => setHistDetail(h)}
            >
              <span className="iv-grow">
                <strong>
                  {roleLabel(h.roleId)} · {levelLabel(h.level)}
                </strong>
                <br />
                <span className="iv-ts">
                  {fmtTs(h.ts)} · {h.turns.length} jawaban
                  {h.endedEarly ? " · diakhiri lebih awal" : ""}
                </span>
              </span>
              <span className="iv-score">
                {avgScore(h) !== null ? `Rata-rata ${avgScore(h)}` : "Tanpa penilaian"}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );

  // ── SETUP ────────────────────────────────────────────────────────────────
  if (view === "setup" || !configured) {
    return (
      <div className="iv-wrap" aria-label="Simulator Wawancara">
        <p className="iv-intro">
          Latihan wawancara kerja dengan AI sebagai pewawancara: jawab tiap
          pertanyaan dengan kata-katamu sendiri, dapatkan umpan balik + skor
          per jawaban, dan penilaian akhir saat sesi selesai. Topik pertanyaan
          diambil dari kurikulum Learn v2 yang nyata — bukan karangan AI.
        </p>
        {!configured ? (
          <AiNotConfigured featureLabel="Simulator Wawancara" />
        ) : (
          <>
            <div className="iv-setup">
              <fieldset className="iv-field">
                <legend className="iv-legend">Peran target</legend>
                <div className="iv-opts">
                  {INTERVIEW_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className="iv-opt"
                      aria-pressed={roleId === r.id}
                      onClick={() => setRoleId(r.id)}
                    >
                      {r.label}
                      <small>{r.desc}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="iv-field">
                <legend className="iv-legend">Level</legend>
                <div className="iv-opts">
                  {INTERVIEW_LEVELS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className="iv-opt"
                      aria-pressed={level === l.id}
                      onClick={() => setLevel(l.id)}
                    >
                      {l.label}
                      <small>{l.desc}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="iv-field">
                <legend className="iv-legend">Jumlah pertanyaan</legend>
                <div className="iv-opts">
                  {[INTERVIEW_MIN_QUESTIONS, INTERVIEW_MAX_QUESTIONS].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="iv-opt"
                      aria-pressed={count === n}
                      onClick={() => setCount(n)}
                    >
                      {n} pertanyaan
                      <small>{n === 5 ? "latihan kilat" : "simulasi penuh"}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            {error && (
              <div className="iv-error" role="alert">
                <p>{error}</p>
              </div>
            )}
            <div className="iv-actions">
              <button type="button" className="iv-btn" onClick={startNew}>
                Mulai sesi
              </button>
            </div>
            <p className="iv-note">
              Estimasi ±20–35 rb token per sesi penuh (tergantung model &amp;
              panjang jawabanmu). Pemakaian tercatat otomatis di Pengaturan AI.
            </p>
            {renderHistory()}
          </>
        )}
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────
  if (view === "result" && result) {
    const pa = result.penilaianAkhir;
    return (
      <div className="iv-wrap" aria-label="Hasil wawancara">
        <div className="iv-card">
          <h3>
            Hasil: {roleLabel(result.roleId)} · {levelLabel(result.level)}
            {result.endedEarly ? " · diakhiri lebih awal" : ""}
          </h3>
          <p className="iv-ts">
            {fmtTs(result.ts)} · {result.turns.length} jawaban
            {avgScore(result) !== null ? ` · rata-rata skor jawaban ${avgScore(result)}` : ""}
          </p>
          {pa ? (
            <>
              <ScoreMeters label="Konsep" value={pa.konsep} />
              <ScoreMeters label="Penerapan" value={pa.penerapan} />
              <ScoreMeters label="Komunikasi" value={pa.komunikasi} />
              <p className="iv-kesimpulan">{pa.kesimpulan}</p>
              <ul className="iv-saran">
                {pa.saran.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="iv-muted">
              Sesi tersimpan tanpa penilaian akhir (AI tidak memberikan format
              yang terbaca, atau sesi disimpan manual).
            </p>
          )}
        </div>
        <details className="iv-raw">
          <summary>Tinjau transkrip ({result.turns.length} giliran)</summary>
          <div style={{ marginTop: 10 }}>
            <TranscriptView turns={result.turns} />
          </div>
        </details>
        {raw && (
          <details className="iv-raw">
            <summary>Respons mentah AI</summary>
            <pre>{raw}</pre>
          </details>
        )}
        <div className="iv-actions">
          <button
            type="button"
            className="iv-btn"
            onClick={() => {
              setResult(null);
              setView("setup");
            }}
          >
            Sesi baru
          </button>
        </div>
        {renderHistory()}
      </div>
    );
  }

  // ── SESSION ──────────────────────────────────────────────────────────────
  if (!active) {
    return (
      <div className="iv-wrap" aria-label="Simulator Wawancara">
        <p className="iv-muted">Tidak ada sesi aktif.</p>
        <div className="iv-actions">
          <button type="button" className="iv-btn" onClick={() => setView("setup")}>
            Ke pengaturan
          </button>
        </div>
      </div>
    );
  }

  const total = active.topics.length;
  const current = active.turns.length + (active.pendingPertanyaan ? 1 : 0);
  const interrupted = !active.pendingPertanyaan; // terputus saat meminta ke AI

  return (
    <div className="iv-wrap" aria-label="Sesi wawancara">
      <p className="iv-intro">
        {roleLabel(active.roleId)} · {levelLabel(active.level)} · topik dari
        kurikulum Learn v2. Jawab sejujur-jujurnya — seperti wawancara sungguhan.
      </p>

      <div className="iv-progress" aria-label={`Pertanyaan ${current} dari ${total}`}>
        <span>
          Pertanyaan {Math.max(current, 1)} dari {total}
        </span>
        <span className="iv-bar">
          <span style={{ width: `${Math.round((current / total) * 100)}%` }} />
        </span>
      </div>

      <TranscriptView turns={active.turns} />

      {active.pendingPertanyaan ? (
        <div className="iv-msg iv-q iv-pending">
          <span className="iv-who">Pewawancara · menunggu jawabanmu</span>
          {active.pendingTopik && <span className="iv-topic">{active.pendingTopik}</span>}
          <div>{active.pendingPertanyaan}</div>
        </div>
      ) : (
        <div className="iv-resume">
          <p>
            Sesi terputus saat memuat {active.turns.length === 0 ? "pertanyaan pertama" : "respons AI"}
            . Transkripmu utuh di atas.
          </p>
          <div className="iv-actions">
            <button
              type="button"
              className="iv-btn"
              disabled={busy !== null}
              onClick={() => {
                if (active.turns.length === 0) void doStart(active);
                else if (active.draftAnswer) void doSend();
              }}
            >
              {busy ? "Memuat…" : "Lanjutkan sesi"}
            </button>
            <button type="button" className="iv-btn iv-ghost" onClick={discardActive}>
              Buang sesi
            </button>
          </div>
        </div>
      )}

      {active.pendingPertanyaan && (
        <div className="iv-answer">
          <label className="iv-muted" htmlFor="iv-answer">
            Jawabanmu
          </label>
          <textarea
            id="iv-answer"
            className="iv-textarea"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tulis jawabanmu di sini, seperti saat diwawancara…"
            disabled={busy !== null}
          />
          <div className="iv-actions">
            {busy ? (
              <>
                <p className="iv-muted">Pewawancara sedang merespons…</p>
                <button
                  type="button"
                  className="iv-btn iv-ghost"
                  onClick={() => abortRef.current?.abort()}
                >
                  Batalkan
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="iv-btn"
                  disabled={!answer.trim()}
                  onClick={() => void doSend()}
                >
                  Kirim jawaban
                </button>
                {active.turns.length > 0 && (
                  <button
                    type="button"
                    className="iv-btn iv-danger"
                    onClick={() => void doEndEarly()}
                  >
                    Akhiri sesi
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="iv-error" role="alert">
          <p>{error}</p>
          <div className="iv-actions">
            {needFinal && (
              <button
                type="button"
                className="iv-btn"
                disabled={busy !== null}
                onClick={() => {
                  setNeedFinal(false);
                  if (active) void requestFinal(active);
                }}
              >
                Minta penilaian akhir
              </button>
            )}
            {active.pendingPertanyaan && (
              <button
                type="button"
                className="iv-btn iv-ghost"
                disabled={busy !== null}
                onClick={() => void doSend()}
              >
                Coba lagi
              </button>
            )}
            {!active.pendingPertanyaan && active.turns.length > 0 && (
              <button
                type="button"
                className="iv-btn iv-ghost"
                disabled={busy !== null}
                onClick={() => {
                  if (active) finishSession(active, null, true);
                }}
              >
                Simpan transkrip tanpa penilaian
              </button>
            )}
          </div>
        </div>
      )}
      {raw && (
        <details className="iv-raw">
          <summary>Respons mentah AI</summary>
          <pre>{raw}</pre>
        </details>
      )}
    </div>
  );
}
