"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { ReactNode, MouseEvent as RMouseEvent, KeyboardEvent as RKeyboardEvent, CSSProperties } from "react";
import Tex from "@/components/Tex";
import ImpostorAudit from "../../components/ImpostorAudit";
// Misi (pilot 2026-10-15, aditif): briefing, keputusan bercabang,
// deliverable ber-rubrik, dossier audit generik.
import MissionBriefing from "../../components/MissionBriefing";
import DecisionCheckpoint, { loadDecision } from "../../components/DecisionCheckpoint";
import DeliverablePanel from "../../components/DeliverablePanel";
import MissionAuditDossier from "../../components/MissionAuditDossier";
// ITEM 3+4 (2026-10-14, aditif): lab SQL in-browser + ECharts
import SqlLab from "../../components/SqlLab";
import EChartFigure from "../../components/EChartFigure";
import HintLadder from "../../components/HintLadder";
import TtsButton from "../../components/TtsButton";
import Icon from "../../lib/icons";
import StepAnim from "../../lib/StepAnim";
import type { V2Lesson, V2Step } from "../../lib/types";
import {
  ensurePyodide,
  runChecks,
  type RunOutcome,
} from "../../lib/pyodideRunner";
import { logVisit, pushDone, pushUndone, markMasteredLocal } from "../../lib/progress";
import { Rating } from "ts-fsrs";
import { recordReview, quizCardId, labCardId } from "../../lib/fsrs";
import { shuffledOrder } from "../../lib/quizShuffle";
import { logSignal } from "../../lib/confusion";
import { SNAPSHOT_FILES } from "../../lib/snapshot-files";
// ITEM 7 (aditif, Gelombang H): Time Capsule Predictions — titik prediksi
// tersegel sebelum ground truth proyek dibuka (hanya 2 proyek target).
import { pointsAtStep, resolveDuePoints, PROJECT_POINTS } from "../../lib/timecapsule";
import { TimeCapsulePoint, TimeCapsuleSummary } from "../../components/TimeCapsule";
// ITEM 8 (aditif, Gelombang N): Feynman Gate 2.0 — penilai "ajarkan kembali"
// oleh AI pada langkah terakhir lesson. BUKAN pengunci progres: yang ditahan
// hanyalah lencana "Feynman: Lolos".
import FeynmanGate from "../../components/FeynmanGate";
// ITEM 9 (aditif, Gelombang O): AI Penyanggah — devil's advocate latihan
// berpikir kritis (mode kuis setelah menjawab + mode bebas di penutup lesson).
// NON-BLOKIR, tidak mengubah skor kuis/progres/FSRS.
import PenyanggahPanel from "../../components/PenyanggahPanel";

/* ---------- tiny inline markup: `code` ---------- */
/* Tautan silang antar-situs: sebutan nama situs di prosa menjadi hyperlink.
   (Instinct six-site audit: 8 sebutan FSA Lab tanpa link.) */
const SITE_LINKS: [RegExp, string][] = [
  [/\bFSA Lab\b/g, "https://fsa-lab.pages.dev/"],
  [/\bCredit Desk\b/g, "https://credit-desk-afy.pages.dev/"],
  [/\bInvestment Desk\b/g, "https://investment-desk.pages.dev/"],
  [/\bFMVA Sprint\b/g, "https://fmva-sprint.pages.dev/"],
  [/\bSimulator FMVA\b/g, "https://simulator-fmva.pages.dev/"],
];
function linkifySites(text: string, keyBase: string): ReactNode[] {
  // Split berdasarkan semua pola situs, pertahankan urutan
  const combined = new RegExp(
    SITE_LINKS.map(([re]) => `(${re.source})`).join("|"),
    "g"
  );
  const parts = text.split(combined).filter((p) => p !== undefined && p !== "");
  return parts.map((p, i) => {
    for (const [re, url] of SITE_LINKS) {
      if (new RegExp(`^${re.source}$`).test(p)) {
        return (
          <a key={`${keyBase}-${i}`} href={url} target="_blank" rel="noreferrer" className="sitelink">
            {p} ↗
          </a>
        );
      }
    }
    return <span key={`${keyBase}-${i}`}>{p}</span>;
  });
}
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith("`") && p.endsWith("`") ? (
      <code className="kc" key={i}>
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{linkifySites(p, `s${i}`)}</span>
    )
  );
}

/* Teks tugas: rujukan `file` yang ADA di snapshot lesson ini menjadi tautan
   buka/unduh langsung (feedback Septian 2026-10-15: tugas "Buka file.csv"
   tanpa affordance). File yang tidak ada di manifest tetap chip kode. */
function renderTaskInline(text: string, slug: string, module: string): ReactNode[] {
  const files = SNAPSHOT_FILES[slug];
  if (!files || files.length === 0) return renderInline(text);
  const base = module === "Proyek" ? "/proyek/" : "/misi/";
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) {
      const name = p.slice(1, -1);
      if (files.includes(name)) {
        return (
          <a
            className="kc filelink"
            key={i}
            href={`${base}${slug}/${name}`}
            target="_blank"
            rel="noreferrer"
            title="Buka file di tab baru"
          >
            {name} ↗
          </a>
        );
      }
      return (
        <code className="kc" key={i}>
          {name}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

/* ---------- per-step state ---------- */
interface CheckView {
  task: string;
  label: string;
  passed: boolean;
  detail: string;
  msg: string;
}
interface StepState {
  code: string;
  attempts: number;
  hintsOpened: number;
  passed: boolean;
  taskState: Record<string, "done" | "fail">;
  checkViews: CheckView[] | null;
  ranCount: number;
  passedCount: number;
  output: string | null;
  outMeta: string | null;
  outError: boolean;
  timedOut: boolean;
  runError: string | null;
  solutionOpen: boolean;
}

function defaultEditable(step: V2Step): string {
  if (!step.code) return "";
  return step.code.starter.split("\n").slice(step.code.lockLines).join("\n");
}
function lockedPart(step: V2Step): string {
  if (!step.code) return "";
  return step.code.starter.split("\n").slice(0, step.code.lockLines).join("\n");
}
function blankState(step: V2Step): StepState {
  return {
    code: defaultEditable(step),
    attempts: 0,
    hintsOpened: 0,
    passed: false,
    taskState: {},
    checkViews: null,
    ranCount: 0,
    passedCount: 0,
    output: null,
    outMeta: null,
    outError: false,
    timedOut: false,
    runError: null,
    solutionOpen: false,
  };
}
function loadState(slug: string, step: V2Step): StepState {
  try {
    const raw = localStorage.getItem(`v2:step:${slug}:${step.id}`);
    if (raw) {
      const s = JSON.parse(raw) as Partial<StepState>;
      return { ...blankState(step), ...s, checkViews: null, output: null, timedOut: false, runError: null, solutionOpen: false };
    }
  } catch {
    /* noop */
  }
  return blankState(step);
}
function saveState(slug: string, step: V2Step, s: StepState) {
  try {
    localStorage.setItem(
      `v2:step:${slug}:${step.id}`,
      JSON.stringify({ code: s.code, attempts: s.attempts, hintsOpened: s.hintsOpened, passed: s.passed, taskState: s.taskState })
    );
  } catch {
    /* noop */
  }
}

/* ================= Workspace ================= */
// Pilot practice-loop (2026-10-30): anti-hardcode — deteksi `nama = <angka>`
// di kode editable. Starter `nama = ` (kosong) tidak ke-flag karena regex
// menuntut digit setelah `=`.
function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function findHardcoded(code: string, names: string[]): string | null {
  for (const n of names) {
    if (new RegExp(`\\b${escapeReg(n)}\\s*=\\s*[-+]?\\d`).test(code)) return n;
  }
  return null;
}

export default function Workspace({ lesson }: { lesson: V2Lesson }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [states, setStates] = useState<Record<string, StepState>>({});
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [pyMsg, setPyMsg] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [mtab, setMtab] = useState<"pelajaran" | "kode" | "hasil">("pelajaran");
  const [leftTab, setLeftTab] = useState<"ins" | "ref" | "cat">("ins");
  const [leftPct, setLeftPct] = useState(44);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [impostorDebrief, setImpostorDebrief] = useState(false);
  // Misi (pilot 2026-10-15): state gate aditif per langkah misi.
  const [decisionChoices, setDecisionChoices] = useState<Record<string, string>>({});
  const [deliverableDone, setDeliverableDone] = useState<Record<string, boolean>>({});
  const [auditDebrief, setAuditDebrief] = useState(false);
  const [note, setNote] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  // Pilot practice-loop (2026-10-30, aditif): hintTried = pelajar mencoba buka
  // hint yang masih digate (untuk pesan panduan di dekat tombol hint);
  // tryMode = pilihan panel pembuka try-first.
  const [hintTried, setHintTried] = useState(false);
  const [tryMode, setTryMode] = useState<"pick" | "explain">("pick");
  // Lesson completion: local-first, Neon (/api/progress) as durable copy.
  // Also logs the visit for the dashboard activity heatmap.
  useEffect(() => {
    let local = false;
    try {
      local = localStorage.getItem(`v2:done:${lesson.slug}`) !== null;
    } catch { /* noop */ }
    setCompleted(local);
    logVisit(lesson.slug);
    (async () => {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;
        const data = await res.json();
        const onServer = (data.completed ?? []).some((r: { lesson_slug: string }) => r.lesson_slug === lesson.slug);
        if (onServer && !local) {
          try { localStorage.setItem(`v2:done:${lesson.slug}`, "1"); } catch { /* noop */ }
        }
        setCompleted(onServer || local);
      } catch { /* offline: local state stands alone */ }
    })();
  }, [lesson.slug]);

  async function toggleComplete() {
    if (completed) {
      await pushUndone(lesson.slug);
      setCompleted(false);
    } else {
      await pushDone(lesson.slug);
      setCompleted(true);
    }
  }
  const runId = useRef(0);
  const dragRef = useRef<{ startX: number; startPct: number } | null>(null);

  const step = lesson.steps[stepIdx];
  const st: StepState = states[step.id] ?? blankState(step);
  // Pilot practice-loop: langkah independent/transfer menyembunyikan
  // "Hasil yang diharapkan" + label cek sampai lolos.
  const isIndependent = step.mode === "independent" || step.kind === "transfer";
  // ITEM 7 (Gelombang H): resolve titik Time Capsule yang anchor-nya sudah
  // dilewati setiap kali langkah berubah; tick memaksa komponen me-refresh.
  const [tcTick, setTcTick] = useState(0);
  useEffect(() => {
    if (resolveDuePoints(lesson.slug, stepIdx, lesson.steps)) setTcTick((t) => t + 1);
  }, [lesson.slug, stepIdx]);
  const tcPoints = pointsAtStep(lesson.slug, step.id);
  const tcShowSummary = lesson.slug in PROJECT_POINTS && step.id === "debrief";
  // ITEM 8 (Gelombang N): Feynman Gate tampil di langkah terakhir lesson saja.
  const isLastStep = stepIdx === lesson.steps.length - 1;
  // "Poin penting" di panel kanan adalah ringkasan LEVEL LESSON (labelnya
  // "Ringkasan lesson"): ambil summary dari langkah yang memilikinya
  // (biasanya langkah rangkuman terakhir), bukan hanya langkah aktif —
  // kalau hanya dari langkah aktif, panel kosong di semua langkah lain.
  const lessonSummary = lesson.steps.find((s) => s.summary && s.summary.length > 0)?.summary;

  // Pyodide LAZY: dimuat saat pertama klik Jalankan/Periksa (ensurePython),
  // bukan saat halaman dibuka — halaman lesson tidak lagi mengunduh Pyodide
  // di depan.

  // load per-step state (and note) when step changes
  useEffect(() => {
    setStates((prev) => (prev[step.id] ? prev : { ...prev, [step.id]: loadState(lesson.slug, step) }));
    try {
      setNote(localStorage.getItem(`v2:note:${lesson.slug}:${step.id}`) ?? "");
    } catch {
      setNote("");
    }
    setQuizAnswers({});
    setQuizIdx(0);
    setImpostorDebrief(false);
    setHintTried(false);
    // Misi: pulihkan pilihan keputusan dari localStorage (keputusan final);
    // reset gate debrief dossier.
    setAuditDebrief(false);
    const st2 = lesson.steps[stepIdx];
    if (st2?.decision) {
      const saved = loadDecision(`v2:misi-dec:${lesson.slug}:${st2.id}`);
      if (saved) setDecisionChoices((prev) => ({ ...prev, [st2.id]: saved.optionId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, lesson.slug]);

  // close the step-list drawer with Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // Pilot practice-loop: panel try-first muncul sekali per lesson.
  useEffect(() => {
    setTryMode("pick");
  }, [lesson.slug]);

  const patch = useCallback(
    (fn: (s: StepState) => StepState) => {
      setStates((prev) => {
        const cur = prev[step.id] ?? blankState(step);
        const next = fn(cur);
        saveState(lesson.slug, step, next);
        return { ...prev, [step.id]: next };
      });
    },
    [lesson.slug, step]
  );

  const fullCode = useCallback(
    (s: StepState) => (lockedPart(step) + "\n" + s.code).trim() + "\n",
    [step]
  );

  // Lazy init Pyodide untuk klik pertama (di luar timer 10 dtk runChecks).
  async function ensurePython(): Promise<boolean> {
    if (pyStatus === "ready") return true;
    if (pyStatus === "error") return false;
    setPyStatus("loading");
    const allRequires = [...new Set(lesson.steps.flatMap((s) => s.requires ?? []))];
    const r = await ensurePyodide(allRequires);
    if (!r.ok) {
      setPyStatus("error");
      setPyMsg(r.msg ?? "");
      return false;
    }
    setPyStatus("ready");
    return true;
  }

  async function doRun() {
    if (!step.code || running) return;
    const myRun = ++runId.current;
    setRunning(true);
    if (!(await ensurePython())) {
      setRunning(false);
      return;
    }
    patch((s) => ({ ...s, timedOut: false, runError: null, outError: false }));
    const t0 = performance.now();
    const outcome: RunOutcome = await runChecks(fullCode(st), [], step.requires ?? []);
    if (myRun !== runId.current) return;
    const dt = ((performance.now() - t0) / 1000).toFixed(1).replace(".", ",");
    setRunning(false);
    if (outcome.timedOut) {
      patch((s) => ({ ...s, timedOut: true, output: null }));
    } else if (outcome.runError) {
      patch((s) => ({ ...s, runError: outcome.runError ?? null, output: null }));
    } else {
      patch((s) => ({
        ...s,
        output: outcome.stdout || "(tidak ada output)",
        outMeta: `Dijalankan · ${dt} dtk`,
        outError: !!outcome.error,
        ...(outcome.error ? { output: (outcome.stdout ? outcome.stdout + "\n" : "") + friendlyError(outcome.error) } : {}),
      }));
    }
    setMtab("hasil");
  }

  async function doCheck() {
    if (!step.code || running) return;
    // Pilot practice-loop: gagalkan run sebelum Pyodide bila ada variabel
    // noLiteral yang ditulis angkanya langsung.
    if (findHardcoded(st.code, step.noLiteral ?? [])) {
      const views: CheckView[] = step.code.checks.map((c) => ({
        task: c.task,
        label: c.label,
        passed: false,
        detail: "",
        msg: "Hitung dari data — jangan tulis angkanya langsung.",
      }));
      const taskState: Record<string, "done" | "fail"> = {};
      for (const t of step.tasks) taskState[t.id] = "fail";
      patch((s) => ({
        ...s,
        checkViews: views,
        ranCount: views.length,
        passedCount: 0,
        taskState,
        attempts: s.attempts + 1,
      }));
      try {
        recordReview(labCardId(lesson.slug, step.id), Rating.Again);
      } catch {
        /* noop */
      }
      setMtab("hasil");
      return;
    }
    const myRun = ++runId.current;
    setRunning(true);
    if (!(await ensurePython())) {
      setRunning(false);
      return;
    }
    patch((s) => ({ ...s, timedOut: false, runError: null }));
    const t0 = performance.now();
    const outcome: RunOutcome = await runChecks(fullCode(st), step.code.checks, step.requires ?? []);
    if (myRun !== runId.current) return;
    const dt = ((performance.now() - t0) / 1000).toFixed(1).replace(".", ",");
    setRunning(false);
    if (outcome.timedOut) {
      patch((s) => ({ ...s, timedOut: true, checkViews: null }));
      setMtab("hasil");
      return;
    }
    if (outcome.runError) {
      patch((s) => ({ ...s, runError: outcome.runError ?? null, checkViews: null }));
      setMtab("hasil");
      return;
    }
    const views: CheckView[] = step.code.checks.map((c, i) => {
      const r = outcome.checks[i];
      return { task: c.task, label: c.label, passed: r?.passed ?? false, detail: r?.detail ?? "", msg: c.msg };
    });
    const passedCount = views.filter((v) => v.passed).length;
    const allPassed = views.length > 0 && passedCount === views.length;
    const taskState: Record<string, "done" | "fail"> = {};
    for (const t of step.tasks) {
      const vs = views.filter((v) => v.task === t.id);
      if (vs.length) taskState[t.id] = vs.every((v) => v.passed) ? "done" : "fail";
    }
    patch((s) => ({
      ...s,
      output: outcome.stdout || "(tidak ada output)",
      outMeta: `Dijalankan · ${dt} dtk`,
      outError: !!outcome.error,
      ...(outcome.error ? { output: (outcome.stdout ? outcome.stdout + "\n" : "") + friendlyError(outcome.error) } : {}),
      checkViews: views,
      ranCount: views.length,
      passedCount,
      taskState,
      attempts: allPassed ? s.attempts : s.attempts + 1,
      passed: s.passed || allPassed,
    }));
    // FSRS review recording (additive hook; does not change check behavior).
    // Lab: first pass → Good; fail reaching ≥2 attempts → Again.
    try {
      if (allPassed && !st.passed) recordReview(labCardId(lesson.slug, step.id), Rating.Good);
      else if (!allPassed && st.attempts >= 1) recordReview(labCardId(lesson.slug, step.id), Rating.Again);
    } catch {
      /* noop */
    }
    // Pilot practice-loop: transfer check lolos pertama kali → lesson "Dikuasai".
    if (step.kind === "transfer" && allPassed && !st.passed) {
      markMasteredLocal(lesson.slug);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: lesson.slug, mastered: true }),
      }).catch(() => {
        /* offline: local state stands alone */
      });
    }
    // Confusion Index (Gelombang G, additive): run gagal = jawaban direvisi
    // sebelum lolos. Pasif; no-op bila pencatatan sinyal dimatikan.
    if (!allPassed) logSignal(lesson.slug, step.id, "revision");
    setMtab("hasil");
  }

  function friendlyError(err: string): string {
    // §7.3: friendly first line in Indonesian, raw detail stays in console text.
    const first = err.split("\n")[0];
    if (/SyntaxError/i.test(first)) return `Kesalahan sintaks: ${first.replace(/^SyntaxError:\s*/i, "")}\n\nDetail teknis:\n${err}`;
    return `${first}\n\nDetail teknis:\n${err}`;
  }

  function doReset() {
    const edited = st.code !== defaultEditable(step);
    if (edited && !window.confirm("Kembalikan kode ke awal? Perubahanmu akan hilang.")) return;
    patch((s) => ({ ...blankState(step), attempts: s.attempts, hintsOpened: s.hintsOpened, passed: s.passed }));
  }

  function openHint() {
    if (st.hintsOpened >= (step.hints?.length ?? 0)) return;
    // Pilot practice-loop: hint ke-2 dan seterusnya hanya terbuka setelah
    // ≥1 percobaan gagal (khusus lab kode; kuis/teori tidak digate).
    if (step.code && st.hintsOpened >= 1 && st.attempts < 1) {
      setHintTried(true);
      return;
    }
    patch((s) => ({ ...s, hintsOpened: s.hintsOpened + 1 }));
    // Confusion Index (Gelombang G, additive): petunjuk dibuka = sinyal.
    logSignal(lesson.slug, step.id, "hint");
  }

  function openSolution() {
    if (st.attempts < 2) return;
    if (!window.confirm("Lihat solusi? Kamu tetap bisa mencoba sendiri setelahnya.")) return;
    patch((s) => ({ ...s, solutionOpen: true }));
  }

  function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* noop */
    }
  }

  function saveNote(v: string) {
    setNote(v);
    try {
      localStorage.setItem(`v2:note:${lesson.slug}:${step.id}`, v);
    } catch {
      /* noop */
    }
  }

  function goStep(i: number) {
    if (i < 0 || i >= lesson.steps.length) return;
    setStepIdx(i);
    setMtab("pelajaran");
  }

  // Pilot practice-loop: try-first — lompat ke transfer check pertama bila
  // ada, kalau tidak ke lab kode pertama.
  function jumpToTryFirst() {
    const ti = lesson.steps.findIndex((s) => s.kind === "transfer");
    const ci = ti >= 0 ? ti : lesson.steps.findIndex((s) => s.code);
    if (ci >= 0) goStep(ci);
    setTryMode("explain");
  }

  // divider drag
  function onDividerDown(e: RMouseEvent) {
    dragRef.current = { startX: e.clientX, startPct: leftPct };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const w = window.innerWidth;
      const dxPct = ((ev.clientX - dragRef.current.startX) / w) * 100;
      const minPct = Math.min(62, (360 / w) * 100);
      setLeftPct(Math.max(minPct, Math.min(62, dragRef.current.startPct + dxPct)));
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }
  function onDividerKey(e: RKeyboardEvent) {
    const w = window.innerWidth;
    const stepPct = (16 / w) * 100;
    const minPct = Math.min(62, (360 / w) * 100);
    if (e.key === "ArrowLeft") setLeftPct((p) => Math.max(minPct, p - stepPct));
    else if (e.key === "ArrowRight") setLeftPct((p) => Math.min(62, p + stepPct));
    else if (e.key === "Home") setLeftPct(minPct);
    else if (e.key === "End") setLeftPct(62);
  }

  // Pilot practice-loop: solusi transfer check terkunci sampai lolos.
  const solutionUnlocked = step.kind === "transfer" ? st.passed : st.attempts >= 2;
  // Misi (pilot 2026-10-15): gate aditif — keputusan harus dipilih,
  // deliverable harus selesai, debrief dossier harus dibuka.
  const missionGate: boolean | null = step.decision
    ? !!decisionChoices[step.id]
    : step.deliverable
      ? !!deliverableDone[step.id]
      : step.auditDossier
        ? auditDebrief
        : null;
  const canNext =
    missionGate !== null
      ? missionGate
      : step.quiz
        ? Object.keys(quizAnswers).length === step.quiz.length
        : step.impostor
          ? impostorDebrief
          : step.sqlLab
            ? st.passed // ITEM 3: lab SQL lolos via tombol Periksa di SqlLab
            : !step.code || st.passed;
  // Keputusan bercabang: "Lanjut" mengikuti nextStepId opsi yang dipilih.
  // Langkah cabang (misi): "Lanjut" kembali ke alur utama via step.goto.
  const decisionNextIdx = (() => {
    if (!step.decision) return null;
    const opt = step.decision.options.find((o) => o.id === decisionChoices[step.id]);
    if (!opt) return null;
    const idx = lesson.steps.findIndex((s) => s.id === opt.nextStepId);
    return idx >= 0 ? idx : null;
  })();
  const gotoIdx = step.goto ? lesson.steps.findIndex((s) => s.id === step.goto) : -1;
  const lanjutIdx = gotoIdx >= 0 ? gotoIdx : (decisionNextIdx ?? stepIdx + 1);
  const lanjutLabel = gotoIdx >= 0 ? "Kembali ke misi" : decisionNextIdx !== null ? "Ikuti keputusanmu" : "Lanjut";
  const nSteps = lesson.steps.length;

  return (
    <div className="app" data-mtab={mtab}>
      {/* ---------- topbar ---------- */}
      <header className="topbar">
        <button
          className="btn ghost icon"
          aria-label="Buka daftar materi"
          aria-expanded={drawerOpen}
          aria-controls="daftar-langkah"
          onClick={() => setDrawerOpen(true)}
        >
          <Icon name="menu" />
        </button>
        <nav className="crumbs" aria-label="Lokasi">
          <span className="hide-m">{lesson.track}</span>
          <span className="sep hide-m">/</span>
          <span className="hide-m">{lesson.module}</span>
          <span className="sep hide-m">/</span>
          <b>{lesson.title}</b>
        </nav>
        <div className="steps" aria-label={`Langkah ${stepIdx + 1} dari ${nSteps}`}>
          {lesson.steps.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Ke langkah ${i + 1}`}
              onClick={() => goStep(i)}
              style={{ border: 0, padding: 0, cursor: "pointer", background: "none" }}
            >
              <i className={i < stepIdx ? "done" : i === stepIdx ? "cur" : ""}></i>
            </button>
          ))}
        </div>
        <div className="grow"></div>
        <span className="mstep">
          {stepIdx + 1}/{nSteps}
        </span>
        <button
          className={`btn ${completed ? "ghost" : "primary"}`}
          onClick={toggleComplete}
          title={completed ? "Batalkan tanda selesai" : "Tandai lesson ini selesai (tersimpan)"}
          aria-pressed={completed}
          aria-label={completed ? "Lesson selesai — klik untuk membatalkan" : "Tandai lesson selesai"}
          style={{ marginLeft: 8 }}
        >
          <Icon name="check" />
          <span className="hide-m">{completed ? "Selesai ✓" : "Tandai Selesai"}</span>
        </button>
        <button className="btn ghost icon" aria-label="Catatan" onClick={() => setLeftTab("cat")}>
          <Icon name="note" />
        </button>
        <button className="btn ghost icon" aria-label="Ganti tema" onClick={toggleTheme}>
          <Icon name="moon" />
        </button>
      </header>

      {/* Pilot practice-loop: panel try-first di pembuka lesson. */}
      {lesson.tryFirst && tryMode === "pick" && (
        <div className="tryfirst" role="region" aria-label="Pilih cara mulai lesson">
          <div>
            <b>Mau mulai dari mana?</b>
            <p>Coba dulu tanpa membaca teori — atau ikuti penjelasan seperti biasa.</p>
          </div>
          <div className="tryfirst-btns">
            <button className="btn" onClick={() => setTryMode("explain")}>
              Mulai dari penjelasan
            </button>
            <button className="btn primary" onClick={jumpToTryFirst}>
              Langsung coba
            </button>
          </div>
        </div>
      )}

      {/* ---------- workspace ---------- */}
      <main className="workspace" style={{ "--left": `${leftPct}%` } as CSSProperties}>
        {/* ===== left: instructions ===== */}
        <section className="pane-left" aria-label="Instruksi">
          <div className="tabs" role="tablist">
            <button className="tab" role="tab" aria-selected={leftTab === "ins"} onClick={() => setLeftTab("ins")}>
              Instruksi
            </button>
            <button className="tab" role="tab" aria-selected={leftTab === "ref"} onClick={() => setLeftTab("ref")}>
              Referensi
            </button>
            <button className="tab" role="tab" aria-selected={leftTab === "cat"} onClick={() => setLeftTab("cat")}>
              Catatan <span className="count">{note.trim() ? 1 : 0}</span>
            </button>
          </div>

          {leftTab === "ins" && (
            <StepAnim stepKey={`${lesson.slug}:${step.id}`} className="scroll prose">
              <div className="eyebrow">{step.eyebrow}</div>
              <h1 className="step-title">{step.title}</h1>
              {/* ITEM 7 (Gelombang H, aditif): titik prediksi Time Capsule di
                  atas langkah anchor; ringkasan kalibrasi di langkah debrief. */}
              {tcPoints.map((p) => (
                <TimeCapsulePoint key={`${p.pointId}:${tcTick}`} slug={lesson.slug} point={p} tick={tcTick} />
              ))}
              {tcShowSummary && <TimeCapsuleSummary slug={lesson.slug} tick={tcTick} />}
              {/* Item 6: TTS pilot — bacakan teks teori langkah ini */}
              <div className="tts-row">
                <TtsButton key={`tts:${step.id}`} text={step.prose} />
              </div>
              {step.prose.map((p, i) => (
                <p key={i}>{renderInline(p)}</p>
              ))}
              {step.formula && (
                <div className="math">
                  <Tex math={step.formula} block />
                </div>
              )}
              {step.formulaNote && <p>{renderInline(step.formulaNote)}</p>}
              {step.figure && (
                <figure className="fig">
                  <div dangerouslySetInnerHTML={{ __html: step.figure.svg }} />
                  <figcaption>{step.figure.caption}</figcaption>
                </figure>
              )}
              {/* ITEM 4 (aditif): ECharts figure bila step.echart ada */}
              {step.echart && <EChartFigure option={step.echart.option} caption={step.echart.caption} />}
              {step.tasks.length > 0 && (
                <>
                  <h3 className="label">Yang perlu kamu lakukan</h3>
                  <ul className="tasks">
                    {step.tasks.map((t) => {
                      const ts = st.taskState[t.id];
                      return (
                        <li key={t.id} className={ts === "done" ? "done" : ts === "fail" ? "fail" : ""}>
                          <span className="chk">
                            <Icon name={ts === "fail" ? "x" : "check"} />
                          </span>
                          <span className="t">{renderTaskInline(t.text, lesson.slug, lesson.module)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              {step.expected && (!isIndependent || st.passed) && (
                <>
                  <h3 className="label">Hasil yang diharapkan</h3>
                  <div className="expected">{step.expected}</div>
                </>
              )}
              {step.note && (
                <div className={`note${step.note.type === "risk" ? " risk" : ""}`}>
                  <h4>{step.note.title}</h4>
                  <p>{renderInline(step.note.body)}</p>
                </div>
              )}
              {(step.hints?.length ?? 0) > 0 && (
                <div className="hintbar">
                  <button className="btn" onClick={openHint} disabled={st.hintsOpened >= (step.hints?.length ?? 0)}>
                    <Icon name="bulb" />
                    Petunjuk
                  </button>
                  <span className="meta">
                    {st.hintsOpened} dari {step.hints?.length} dibuka
                  </span>
                </div>
              )}
              {hintTried && step.code && st.hintsOpened >= 1 && st.attempts < 1 && (
                <p className="hintgate" role="status">
                  Coba jalankan kodemu dulu — hint berikutnya terbuka setelah 1 percobaan.
                </p>
              )}
              {st.hintsOpened > 0 && (
                <div style={{ marginTop: 12 }}>
                  {step.hints!.slice(0, st.hintsOpened).map((h, i) => (
                    <div className="note" key={i}>
                      <h4>Petunjuk {i + 1}</h4>
                      <p style={{ whiteSpace: "pre-wrap" }}>{h}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Item 2: tangga petunjuk Socratic untuk lab (di samping alur Petunjuk) */}
              {step.code && (
                <HintLadder
                  key={`lab:${step.id}`}
                  mode="lab"
                  step={step}
                  onFirstOpen={() => logSignal(lesson.slug, step.id, "hint")}
                />
              )}
              {step.quiz && <QuizBlock quiz={step.quiz} seedKey={`${lesson.slug}:${step.id}`} answers={quizAnswers} setAnswers={setQuizAnswers} qIdx={quizIdx} setQIdx={setQuizIdx} onAnswer={(qi, oi, correct) => { try { recordReview(quizCardId(lesson.slug, step.id, qi), correct ? Rating.Good : Rating.Again); /* Career/gamifikasi: catat jawaban kuis ke localStorage (kontrak key v2:quiz:* di lib/career.ts). Sekali jawab per soal di UI, jadi "benar" = benar di percobaan pertama. */ localStorage.setItem(`v2:quiz:${lesson.slug}:${step.id}:${qi}`, JSON.stringify({ correct, ts: Date.now() })); } catch { /* noop */ } }} />}
              {/* Item 2: tangga petunjuk Socratic untuk kuis (di bawah QuizBlock) */}
              {step.quiz && (
                <HintLadder
                  key={`quiz:${step.id}:${quizIdx}`}
                  mode="quiz"
                  step={step}
                  quizIndex={quizIdx}
                  onFirstOpen={() => logSignal(lesson.slug, step.id, "hint")}
                />
              )}
              {/* ITEM 9 (Gelombang O): AI Penyanggah mode kuis — di bawah tangga
                  petunjuk kuis, aktif setelah murid menjawab. Tidak mengubah
                  logika kuis/penilaian yang ada. */}
              {step.quiz && (
                <PenyanggahPanel
                  key={`sgq:${step.id}`}
                  mode="quiz"
                  lesson={lesson}
                  stepId={step.id}
                  quiz={step.quiz}
                  answers={quizAnswers}
                />
              )}
              {step.impostor && (
                <ImpostorAudit spec={step.impostor} onDebrief={setImpostorDebrief} />
              )}
              {/* Misi (pilot 2026-10-15): komponen misi, aditif */}
              {step.briefing && <MissionBriefing spec={step.briefing} />}
              {step.decision && (
                <DecisionCheckpoint
                  spec={step.decision}
                  storageKey={`v2:misi-dec:${lesson.slug}:${step.id}`}
                  onChosen={(optionId) =>
                    setDecisionChoices((prev) => ({ ...prev, [step.id]: optionId }))
                  }
                />
              )}
              {step.deliverable && (
                <DeliverablePanel
                  spec={step.deliverable}
                  storageKey={`v2:misi-del:${lesson.slug}:${step.id}`}
                  onComplete={(done) =>
                    setDeliverableDone((prev) => ({ ...prev, [step.id]: done }))
                  }
                />
              )}
              {step.auditDossier && (
                <MissionAuditDossier spec={step.auditDossier} onDebrief={setAuditDebrief} />
              )}
              {step.summary && (
                <>
                  <h3 className="label">Ringkasan</h3>
                  <ul>
                    {step.summary.map((b, i) => (
                      <li key={i}>{renderInline(b)}</li>
                    ))}
                  </ul>
                </>
              )}
            </StepAnim>
          )}
          {leftTab === "ref" && (
            <div className="scroll prose">
              <div className="eyebrow">Referensi</div>
              <h1 className="step-title">Cheat sheet langkah ini</h1>
              <p style={{ whiteSpace: "pre-wrap" }}>{step.reference ?? "Tidak ada referensi untuk langkah ini."}</p>
            </div>
          )}
          {leftTab === "cat" && (
            <div className="scroll prose">
              <div className="eyebrow">Catatan</div>
              <h1 className="step-title">Catatan pribadi</h1>
              <textarea
                className="v2ed-area"
                style={{ minHeight: 200, border: "1px solid var(--border)", borderRadius: "var(--r-2)" }}
                value={note}
                onChange={(e) => saveNote(e.target.value)}
                placeholder="Tulis pemahamanmu dengan kata-katamu sendiri…"
                aria-label="Catatan pribadi"
              />
              <p className="meta" style={{ fontSize: 12, color: "var(--text-faint)" }}>
                Tersimpan otomatis di perangkat ini.
              </p>
            </div>
          )}
          {/* ITEM 8 (Gelombang N): Feynman Gate di penutup lesson (langkah terakhir,
              tab Instruksi). Tidak mengubah alur langkah yang ada. */}
          {isLastStep && leftTab === "ins" && (
            <FeynmanGate key={`fg:${lesson.slug}`} lesson={lesson} />
          )}
          {/* ITEM 9 (Gelombang O): AI Penyanggah mode bebas — section terpisah
              di penutup lesson, setelah Feynman Gate. */}
          {isLastStep && leftTab === "ins" && (
            <PenyanggahPanel key={`sgf:${lesson.slug}`} mode="bebas" lesson={lesson} />
          )}
          <footer>
            <button className="btn ghost" onClick={() => goStep(stepIdx - 1)} disabled={stepIdx === 0}>
              <Icon name="left" />
              Sebelumnya
            </button>
            <span className="pos">
              {!canNext && stepIdx < nSteps - 1
                ? step.quiz
                  ? "Jawab semua kuis dulu untuk lanjut"
                  : step.decision
                    ? "Pilih satu keputusan dulu untuk lanjut"
                    : step.deliverable
                      ? "Selesaikan deliverable dulu untuk lanjut"
                      : step.auditDossier
                        ? "Buka debrief audit dulu untuk lanjut"
                        : "Selesaikan pemeriksaan dulu (tombol Periksa)"
                : `Langkah ${stepIdx + 1} dari ${nSteps}`}
            </span>
            <button
              className="btn"
              onClick={() => goStep(lanjutIdx)}
              disabled={stepIdx === nSteps - 1 || !canNext}
              title={!canNext ? "Selesaikan langkah ini dulu" : ""}
            >
              {lanjutLabel}
              <Icon name="right" />
            </button>
          </footer>
        </section>

        <div
          className="divider"
          role="separator"
          aria-orientation="vertical"
          aria-label="Ubah lebar panel"
          aria-valuenow={Math.round(leftPct)}
          tabIndex={0}
          onMouseDown={onDividerDown}
          onKeyDown={onDividerKey}
          onDoubleClick={() => setLeftPct(44)}
        />

        {/* ===== right: code ===== */}
        <section className="pane-right" aria-label="Ruang kode">
          {/* ITEM 3 (aditif): lab SQL bila step.sqlLab ada — sejajar step.code */}
          {step.sqlLab ? (
            <SqlLab
              spec={step.sqlLab}
              storageKey={`v2:sql:${lesson.slug}:${step.id}`}
              onPassChange={(ok) => {
                if (ok) patch((s) => ({ ...s, passed: true }));
              }}
            />
          ) : step.code ? (
            <>
              <div className="tabs" role="tablist">
                <span className="tab" role="tab" aria-selected={true}>
                  script.py
                </span>
                <div className="status">
                  <span
                    className="dot"
                    style={{ background: pyStatus === "ready" ? "var(--success)" : pyStatus === "error" ? "var(--error)" : "var(--accent)" }}
                  ></span>
                  {pyStatus === "ready" ? "Python siap" : pyStatus === "error" ? `Gagal memuat Python${pyMsg ? ": " + pyMsg : ""}` : pyStatus === "loading" ? "Memuat Python" : "Python belum dimuat"}
                </div>
              </div>
              <div className="editor-wrap">
                <div className="lockbar">
                  <Icon name="lock" />
                  Baris 1–{step.code.lockLines} sudah disiapkan · hanya-baca
                </div>
                <pre className="v2ed-lock" aria-hidden="true">
                  {lockedPart(step)
                    .split("\n")
                    .map((ln, i) => (
                      <span className="ln" key={i}>
                        <span className="g">{i + 1}</span>
                        {ln || " "}
                        {"\n"}
                      </span>
                    ))}
                </pre>
                <textarea
                  className="v2ed-area"
                  value={st.code}
                  onChange={(e) => patch((s) => ({ ...s, code: e.target.value }))}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault();
                      doRun();
                    }
                  }}
                  spellCheck={false}
                  aria-label="Editor kode (bagian yang bisa diubah)"
                  rows={Math.max(4, st.code.split("\n").length + 1)}
                />
                {st.solutionOpen && (
                  <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                    <h3 className="label" style={{ marginTop: 0 }}>
                      Solusi
                    </h3>
                    <pre className="v2ed-lock" style={{ background: "var(--bg-sunken)", borderRadius: "var(--r-2)", padding: "8px 0" }}>
                      {step.code.solution.split("\n").slice(step.code.lockLines).join("\n")}
                    </pre>
                  </div>
                )}
              </div>
              <div className="console">
                <div className="tabs sub" role="tablist">
                  <span className="tab" role="tab" aria-selected={true}>
                    <Icon name="term" />
                    Konsol
                  </span>
                </div>
                <div className="console-body">
                  {st.timedOut ? (
                    <div className="out-err">Kode berjalan lebih dari 10 detik dan dihentikan. Cek loop tak berujung.</div>
                  ) : st.runError ? (
                    <div className="out-err">{st.runError}</div>
                  ) : st.output !== null ? (
                    <>
                      {st.outMeta && (
                        <div className="run-meta">
                          <span>Dijalankan</span>
                          <span>·</span>
                          <span>{st.outMeta.replace("Dijalankan · ", "")}</span>
                        </div>
                      )}
                      <div className={st.outError ? "out-err" : "out"}>{st.output}</div>
                    </>
                  ) : (
                    <span className="run-meta">Tekan Jalankan untuk mengeksekusi kode. Pertama kali memuat Python agak lama.</span>
                  )}
                </div>
              </div>
              {st.checkViews && <FeedbackStrip views={st.checkViews} ranCount={st.ranCount} passedCount={st.passedCount} maskLabels={isIndependent} />}
              <div className="actionbar">
                <button className="btn" onClick={openHint} aria-label="Petunjuk" disabled={(step.hints?.length ?? 0) === 0}>
                  <Icon name="bulb" />
                  <span className="lbl">Petunjuk</span>
                </button>
                <button
                  className="btn ghost"
                  onClick={openSolution}
                  disabled={!solutionUnlocked || st.solutionOpen}
                  title={solutionUnlocked ? "Lihat solusi" : step.kind === "transfer" ? "Terbuka setelah lolos transfer check" : "Terbuka setelah 2 percobaan"}
                  aria-label="Solusi"
                >
                  <Icon name="lock" />
                  <span className="lbl">Solusi</span>
                </button>
                <span className="spacer attempts">Percobaan {Math.max(1, st.attempts + (st.passed ? 0 : 1))}</span>
                <button className="btn ghost icon" onClick={doReset} aria-label="Reset kode">
                  <Icon name="reset" />
                </button>
                <button className="btn" onClick={doRun} disabled={running || pyStatus === "error"}>
                  <Icon name="play" />
                  {running ? "Menjalankan…" : "Jalankan"}
                  <span className="kbd">Ctrl+Enter</span>
                </button>
                <button className="btn primary" onClick={doCheck} disabled={running || pyStatus === "error"}>
                  Periksa
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="tabs" role="tablist">
                <span className="tab" role="tab" aria-selected={true}>
                  Ringkasan
                </span>
              </div>
              <div className="editor-wrap" style={{ padding: "24px 32px" }}>
                <div className="eyebrow">Ringkasan lesson</div>
                <h2 className="step-title" style={{ fontSize: 22, lineHeight: "28px" }}>
                  Poin penting
                </h2>
                <ul>
                  {(lessonSummary ?? []).map((b, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      {renderInline(b)}
                    </li>
                  ))}
                </ul>
                {!lessonSummary && (
                  <p className="run-meta">Lesson ini belum memiliki ringkasan poin penting.</p>
                )}
                {step.next && (
                  <a className="btn primary" href={step.next.href} style={{ marginTop: 16 }}>
                    {step.next.label}
                    <Icon name="right" />
                  </a>
                )}
              </div>
              <div className="console">
                <div className="tabs sub" role="tablist">
                  <span className="tab" role="tab" aria-selected={true}>
                    <Icon name="term" />
                    Konsol
                  </span>
                </div>
                <div className="console-body">
                  <span className="run-meta">Langkah ini tanpa kode. Jawab kuis di panel instruksi.</span>
                </div>
              </div>
              <div className="actionbar">
                <span className="spacer" />
                <span className="attempts">
                  {step.quiz ? `${Object.keys(quizAnswers).length} dari ${step.quiz.length} dijawab` : ""}
                </span>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ---------- mobile tabs ---------- */}
      <nav className="mtabs" aria-label="Tampilan">
        {(
          [
            ["pelajaran", "book", "Pelajaran"],
            ["kode", "term", "Kode"],
            ["hasil", "table", "Hasil"],
          ] as const
        ).map(([id, icon, label]) => (
          <button key={id} aria-selected={mtab === id} onClick={() => setMtab(id)}>
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </nav>

      {/* ---------- drawer: daftar langkah ---------- */}
      {drawerOpen && (
        <>
          <div className="backdrop" aria-hidden="true" onClick={() => setDrawerOpen(false)} />
          <aside
            className="drawer"
            id="daftar-langkah"
            role="dialog"
            aria-modal="true"
            aria-label="Daftar langkah"
          >
            <div className="drawer-h">
              <b>Daftar langkah</b>
              <button
                className="btn ghost icon"
                aria-label="Tutup daftar langkah"
                onClick={() => setDrawerOpen(false)}
              >
                <Icon name="x" />
              </button>
            </div>
            <a className="drawer-link" href="/v2/learn">
              <Icon name="left" /> Semua kurikulum
            </a>
            <ol className="drawer-list">
              {lesson.steps.map((s, i) => (
                <li key={s.id}>
                  <button
                    className={i === stepIdx ? "cur" : ""}
                    aria-current={i === stepIdx ? "step" : undefined}
                    onClick={() => {
                      goStep(i);
                      setDrawerOpen(false);
                    }}
                  >
                    <span className="n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="t">
                      <span className="e">{s.eyebrow}</span>
                      <span className="ti">{s.title}</span>
                    </span>
                    <i
                      className={`st ${i < stepIdx ? "done" : i === stepIdx ? "cur" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </>
      )}
    </div>
  );
}

/* ---------- feedback strip (§7.3) ---------- */
// Pilot practice-loop: maskLabels=true (langkah independent/transfer)
// menyamarkan label cek yang belum lolos jadi "Cek N · belum lolos"
// agar angka target tidak bocor; c.msg ("kenapa") tetap ditampilkan.
function FeedbackStrip({ views, ranCount, passedCount, maskLabels }: { views: CheckView[]; ranCount: number; passedCount: number; maskLabels?: boolean }) {
  const allPassed = ranCount > 0 && passedCount === ranCount;
  return (
    <div className={`feedback ${allPassed ? "pass" : "fail"}`} role="status" aria-live="polite">
      <Icon name={allPassed ? "check" : "x"} className="i lead" />
      <div>
        {allPassed ? (
          <div>
            <b>Benar.</b> {passedCount} dari {ranCount} pemeriksaan lolos.
          </div>
        ) : (
          <div>
            <b>Belum tepat.</b> {passedCount} dari {ranCount} pemeriksaan lolos.
            <ul>
              {views.map((v, i) => (
                <li key={i} className={v.passed ? "ok" : "no"}>
                  <Icon name={v.passed ? "check" : "x"} />
                  <span>
                    {maskLabels && !v.passed ? (
                      <b>{`Cek ${i + 1} · belum lolos`}</b>
                    ) : (
                      <code className="kc">{v.label.replace(/`/g, "")}</code>
                    )}{" "}
                    {v.passed ? "lolos" : maskLabels ? "belum tepat" : v.detail ? `seharusnya benar, ${v.detail}` : "belum tepat"}
                    {!v.passed && v.msg && <div className="why">{v.msg}</div>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- quiz (§7.7, pragmatic) ---------- */
function QuizBlock({
  quiz,
  answers,
  setAnswers,
  qIdx,
  setQIdx,
  seedKey,
  onAnswer,
}: {
  quiz: NonNullable<V2Step["quiz"]>;
  answers: Record<number, number>;
  setAnswers: (a: Record<number, number>) => void;
  qIdx: number;
  setQIdx: (i: number) => void;
  /** `${lessonSlug}:${stepId}` — seed acak deterministik (lihat quizShuffle.ts). */
  seedKey: string;
  /** additive hook: fired once per question, when an answer is first clicked */
  onAnswer?: (qIdx: number, optIdx: number, correct: boolean) => void;
}) {
  const q = quiz[qIdx];
  const answered = answers[qIdx] !== undefined;
  // F5: jangan ungkap penjelasan opsi benar setelah 1 klik salah.
  // Penjelasan opsi benar baru dibuka setelah SEMUA soal dijawab (attempt boundary).
  const attemptDone = quiz.every((_, i) => answers[i] !== undefined);
  // MUST-1 fix (review Instinct 2026-11-14): acak urutan opsi per soal agar
  // jawaban benar tidak selalu di posisi yang sama (konten: B = 60,3%).
  // DETERMINISTIK per soal (seed slug:step:qi) — urutan sama di tiap reload,
  // tanpa mismatch SSR/hydration. answers tetap menyimpan indeks ASLI opsi.
  const order = useMemo(
    () => shuffledOrder(q.options.length, `${seedKey}:${qIdx}`),
    [quiz, qIdx, seedKey]
  );
  const pickedOrig = answers[qIdx];
  return (
    <div style={{ marginTop: 16 }}>
      <h3 className="label">Kuis</h3>
      <div className="qznav" role="tablist" aria-label="Navigasi soal">
        {quiz.map((_, i) => {
          const a = answers[i];
          return (
            <button
              key={i}
              role="tab"
              aria-selected={qIdx === i}
              className={`${qIdx === i ? "cur" : ""} ${a !== undefined ? (quiz[i].options[a].correct ? "ok" : "bad") : ""}`}
              onClick={() => setQIdx(i)}
              aria-label={`Soal ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p style={{ fontWeight: 600 }}>{q.q}</p>
      <div className="stack" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {order.map((orig, d) => {
          const o = q.options[orig];
          const cls = answered ? (o.correct ? "right" : orig === pickedOrig ? "wrong" : "") : orig === pickedOrig ? "sel" : "";
          return (
            <button
              key={orig}
              className={`opt ${cls}`}
              onClick={() => {
                if (answered) return;
                onAnswer?.(qIdx, orig, !!o.correct);
                setAnswers({ ...answers, [qIdx]: orig });
              }}
              disabled={answered}
              style={{ textAlign: "left", cursor: answered ? "default" : "pointer" }}
            >
              <span className="l">{String.fromCharCode(65 + d)}</span>
              <span>
                {o.text}
                {answered && (orig === pickedOrig || (attemptDone && o.correct)) && <small>{o.why}</small>}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn ghost" disabled={qIdx === 0} onClick={() => setQIdx(qIdx - 1)}>
          <Icon name="left" />
          Sebelumnya
        </button>
        <button className="btn ghost" disabled={qIdx === quiz.length - 1} onClick={() => setQIdx(qIdx + 1)}>
          Berikutnya
          <Icon name="right" />
        </button>
      </div>
    </div>
  );
}
