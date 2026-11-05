// /v2/mulai client: pilih jalur + tes penempatan + detail jalur aktif.
// Semua state progres dibaca dari localStorage (getLocalDone) + server sync;
// pilihan jalur (v2:path) & hasil tes (v2:skipped, v2:placement) = localStorage saja.
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "../lib/icons";
import { getLocalDone, pullServerProgress, getLocalMastered, pullServerMastered } from "../lib/progress";
import {
  PATHS,
  getPath,
  pathSteps,
  pathProgress,
  nextStep,
  stepMeta,
  type LearnPath,
  type PathStep,
} from "../lib/paths";
import {
  PLACEMENT_QUESTIONS,
  AREA_ORDER,
  AREA_LABEL,
  placementResult,
  type PlacementArea,
  type PlacementResult,
} from "../lib/placement";

const PATH_KEY = "v2:path";
const SKIPPED_KEY = "v2:skipped";
const PLACEMENT_KEY = "v2:placement";

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* noop */
  }
}

function kindIcon(kind: PathStep["kind"]): string {
  return kind === "misi" ? "flag" : kind === "proyek" ? "flask" : "book";
}

function kindLabel(kind: PathStep["kind"]): string {
  return kind === "misi" ? "Misi" : kind === "proyek" ? "Proyek" : "Lesson";
}

export default function MulaiClient() {
  const [pathId, setPathId] = useState<string>("fondasi");
  const [done, setDone] = useState<Set<string>>(new Set());
  // Pilot practice-loop: lesson yang transfer check-nya lolos = "Dikuasai".
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [placement, setPlacement] = useState<PlacementResult | null>(null);
  // quiz flow
  const [quizOn, setQuizOn] = useState(false);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [result, setResult] = useState<PlacementResult | null>(null);

  useEffect(() => {
    setPathId(lsGet(PATH_KEY) ?? "fondasi");
    try {
      const raw = lsGet(SKIPPED_KEY);
      if (raw) setSkipped(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* noop */
    }
    try {
      const raw = lsGet(PLACEMENT_KEY);
      if (raw) setPlacement((JSON.parse(raw) as { result: PlacementResult }).result);
    } catch {
      /* noop */
    }
    setDone(getLocalDone());
    pullServerProgress().then((s) => setDone(new Set([...getLocalDone(), ...s])));
    setMastered(getLocalMastered());
    pullServerMastered().then((s) => setMastered(new Set([...getLocalMastered(), ...s])));
  }, []);

  const path: LearnPath = useMemo(() => getPath(pathId) ?? PATHS[0], [pathId]);
  const steps = useMemo(() => pathSteps(path), [path]);
  const prog = useMemo(() => pathProgress(path, done), [path, done]);
  const next = useMemo(() => nextStep(path, done, skipped), [path, done, skipped]);

  function choosePath(id: string) {
    setPathId(id);
    lsSet(PATH_KEY, id);
  }

  function startQuiz() {
    setQuizOn(true);
    setQi(0);
    setPicked(null);
    setAnswers([]);
    setResult(null);
  }
  function answer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const q = PLACEMENT_QUESTIONS[qi];
    setAnswers((a) => [...a, i === q.correct]);
  }
  function nextQ() {
    if (qi + 1 >= PLACEMENT_QUESTIONS.length) {
      // hitung hasil per area
      const acc: Record<PlacementArea, { correct: number; total: number }> = {
        statistika: { correct: 0, total: 0 },
        probabilitas: { correct: 0, total: 0 },
        sql: { correct: 0, total: 0 },
        python: { correct: 0, total: 0 },
      };
      PLACEMENT_QUESTIONS.forEach((q, idx) => {
        acc[q.area].total += 1;
        if (answers[idx]) acc[q.area].correct += 1;
      });
      const r = placementResult(acc);
      setResult(r);
      setQuizOn(false);
    } else {
      setQi(qi + 1);
      setPicked(null);
    }
  }
  function saveResult() {
    if (!result) return;
    setSkipped(new Set(result.skippedSlugs));
    lsSet(SKIPPED_KEY, JSON.stringify(result.skippedSlugs));
    lsSet(PLACEMENT_KEY, JSON.stringify({ at: new Date().toISOString(), result }));
    setPlacement(result);
    setResult(null);
  }

  const q = PLACEMENT_QUESTIONS[qi];

  return (
    <div>
      {/* ── 1. pilih jalur ─────────────────────────────────────────── */}
      <div className="sec">
        <span>Pilih jalurmu</span>
        <span className="muted" style={{ fontWeight: 400 }}>
          urutan belajar terstruktur per tujuan
        </span>
      </div>
      <div className="mu-grid">
        {PATHS.map((p) => {
          const pp = pathProgress(p, done);
          const sel = p.id === path.id;
          return (
            <article key={p.id} className={`mu-card${sel ? " sel" : ""}`}>
              <div className="mu-card-h">
                <div style={{ flex: 1 }}>
                  <div className="eyebrow">{pp.total} langkah</div>
                  <h3>{p.name}</h3>
                </div>
                {sel && <Icon name="check" />}
              </div>
              <p>{p.desc}</p>
              <div className="bar" role="progressbar" aria-valuenow={pp.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progres ${p.name}`}>
                <i style={{ width: `${pp.pct}%` }}></i>
              </div>
              <div className="mu-prog">
                <b>{pp.done}</b>/{pp.total} selesai · Dikuasai {pathSteps(p).filter((s) => mastered.has(s.slug)).length} · {pp.pct}%
              </div>
              <p className="mu-outcome">
                Hasil: <b>{p.outcome}</b>
              </p>
              <div className="mu-actions">
                {sel ? (
                  <span className="badge ok">Jalur aktif</span>
                ) : (
                  <button type="button" className="btn ghost" onClick={() => choosePath(p.id)}>
                    Pilih jalur
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* ── 2. tes penempatan ──────────────────────────────────────── */}
      <div className="sec">
        <span>Tes penempatan</span>
        <span className="muted" style={{ fontWeight: 400 }}>
          15 soal · lewati materi dasar yang sudah kamu kuasai
        </span>
      </div>
      {!quizOn && !result && (
        <div className="mu-card" style={{ maxWidth: 720 }}>
          <p>
            Tes singkat ini mengukur penguasaanmu di 4 area fondasi. Area yang
            nilainya ≥ 75% dianggap <b>dikuasai</b> — lesson dasarnya ditandai{" "}
            <span className="badge">terlewati via tes</span> (bukan selesai), dan
            kamu langsung diarahkan ke titik mulai yang tepat.
          </p>
          {placement && (
            <p className="muted" style={{ fontSize: 13 }}>
              Tes terakhir: {placement.masteredCount} dari 4 area dikuasai ·{" "}
              {placement.skippedSlugs.length} lesson ditandai terlewati.
            </p>
          )}
          <div className="mu-actions">
            <button type="button" className="btn" onClick={startQuiz}>
              <Icon name="play" /> {placement ? "Ulangi tes" : "Mulai tes"}
            </button>
          </div>
        </div>
      )}

      {quizOn && q && (
        <div className="mu-card mu-q">
          <div className="eyebrow">
            Tes penempatan · soal {qi + 1}/{PLACEMENT_QUESTIONS.length} · {AREA_LABEL[q.area]}
          </div>
          <div className="bar" role="progressbar" aria-valuenow={qi + 1} aria-valuemin={0} aria-valuemax={PLACEMENT_QUESTIONS.length}>
            <i style={{ width: `${((qi + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}></i>
          </div>
          <p className="q">{q.q}</p>
          <div className="mu-opts">
            {q.options.map((o, i) => {
              const cls =
                picked === null
                  ? ""
                  : i === q.correct
                    ? " right"
                    : i === picked
                      ? " wrong"
                      : "";
              return (
                <button
                  key={i}
                  type="button"
                  className={`mu-opt${cls}`}
                  disabled={picked !== null}
                  onClick={() => answer(i)}
                >
                  {o.text}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div>
              <div className={`mu-why ${picked === q.correct ? "ok" : "no"}`}>
                <b>{picked === q.correct ? "Benar." : "Kurang tepat."}</b>{" "}
                {q.options[picked].why}
                {picked !== q.correct && (
                  <>
                    <br />
                    <b>Jawaban benar:</b> {q.options[q.correct].text} — {q.options[q.correct].why}
                  </>
                )}
              </div>
              <div className="mu-actions" style={{ marginTop: 12 }}>
                <button type="button" className="btn" onClick={nextQ}>
                  {qi + 1 >= PLACEMENT_QUESTIONS.length ? "Lihat hasil" : "Soal berikutnya"}
                  <Icon name="right" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {result && (
        <div>
          <div className="mu-card" style={{ maxWidth: 720, marginBottom: 12 }}>
            <div className="eyebrow">Hasil tes</div>
            <p style={{ fontSize: 15 }}>
              Kamu menguasai <b>{result.masteredCount} dari 4</b> area fondasi.{" "}
              {result.skippedSlugs.length > 0
                ? `${result.skippedSlugs.length} lesson dasar akan ditandai terlewati via tes.`
                : "Tidak ada lesson yang dilewati — mulai dari awal tiap area."}
            </p>
            <div className="mu-actions">
              <button type="button" className="btn" onClick={saveResult}>
                <Icon name="check" /> Simpan hasil
              </button>
              <button type="button" className="btn ghost" onClick={startQuiz}>
                Ulangi tes
              </button>
            </div>
          </div>
          <div className="mu-area">
            {AREA_ORDER.map((a) => {
              const r = result.areas[a];
              const startMeta = r.startSlug ? stepMeta({ kind: "lesson", slug: r.startSlug }) : null;
              return (
                <div key={a} className="mu-acard">
                  <h4>{AREA_LABEL[a]}</h4>
                  <div>
                    <span className={`badge ${r.mastered ? "ok" : "no"}`}>
                      {r.mastered ? "Dikuasai" : "Belum dikuasai"}
                    </span>{" "}
                    <span className="muted" style={{ fontSize: 13 }}>
                      {r.correct}/{r.total} benar
                    </span>
                  </div>
                  {r.mastered && startMeta ? (
                    <p style={{ fontSize: 13, marginTop: 8 }}>
                      Titik mulai yang disarankan:{" "}
                      <Link href={startMeta.href}>{startMeta.title}</Link>
                    </p>
                  ) : (
                    <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
                      Mulai dari lesson pertama area ini di jalur Fondasi.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. detail jalur aktif ───────────────────────────────────── */}
      <div className="sec" style={{ marginTop: 24 }}>
        <span>Jalur aktif: {path.name}</span>
        <span className="muted" style={{ fontWeight: 400 }}>
          {prog.done}/{prog.total} selesai · Dikuasai {steps.filter((s) => mastered.has(s.slug)).length} · {prog.pct}%
        </span>
      </div>
      <div className="bar" role="progressbar" aria-valuenow={prog.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progres ${path.name}`}>
        <i style={{ width: `${prog.pct}%` }}></i>
      </div>
      {path.phases.map((ph) => (
        <section key={ph.title} className="mu-phase">
          <h3>{ph.title}</h3>
          {ph.desc && <div className="muted">{ph.desc}</div>}
          <ul className="mu-steps">
            {ph.steps.map((s) => {
              const meta = stepMeta(s);
              const isDone = done.has(s.slug);
              const isSkip = skipped.has(s.slug);
              const isNext = next !== null && next.slug === s.slug && next.kind === s.kind;
              const status = isDone ? "done" : isSkip ? "skip" : isNext ? "next" : "lock";
              const label =
                status === "done"
                  ? "Selesai"
                  : status === "skip"
                    ? "Terlewati via tes"
                    : status === "next"
                      ? "Berikutnya"
                      : "Ikuti urutan";
              return (
                <li key={`${s.kind}:${s.slug}`}>
                  <Link
                    className={`mu-step ${status === "next" ? "next" : ""} ${status === "lock" ? "locked" : ""}`}
                    href={meta.href}
                  >
                    <span className="mu-ico">
                      <Icon name={status === "done" ? "check" : kindIcon(s.kind)} />
                    </span>
                    <span className="t">
                      <b>{meta.title}</b>
                      <small>
                        {kindLabel(s.kind)} · {meta.track}
                        {s.note ? ` · ${s.note}` : ""}
                      </small>
                    </span>
                    <span className={`mu-st ${status}`}>{label}</span>
                    {mastered.has(s.slug) && (
                      <span className="badge ok" style={{ marginLeft: 6 }}>
                        Dikuasai
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
