"use client";

/* Tangga petunjuk Socratic (Item 2 program upgrade Learn v2, 2026-10-14).
 *
 * Terinspirasi Khanmigo: menuntun lewat pertanyaan berjenjang, bukan memberi
 * jawaban. Dipakai di lab DAN kuis. Konten diambil berurutan dari:
 *   (a) step.hints[] bila ada → dijadikan jenjang,
 *   (b) bila tidak ada: parafrase Socratic dari o.why / penjelasan kuis /
 *       note step (TIDAK mengarang fakta baru),
 *   (c) untuk lab: jenjang terakhir boleh memuat potongan konsep dari
 *       `expected`/prose step.
 * Bila tidak ada bahan sama sekali → builder mengembalikan null dan panel
 * menampilkan pesan jujur "Belum ada petunjuk untuk langkah ini."
 *
 * Semua teks UI/narasi Bahasa Indonesia, istilah teknis tetap Inggris.
 */

import { useMemo, useState } from "react";
import Icon from "../lib/icons";
import type { V2Step } from "../lib/types";

export interface LadderRung {
  title: string;
  body: string;
}

/** Nudge Socratic generik: ajak berpikir dulu, tanpa mengarang fakta. */
const THINK_FIRST =
  "Jawab dulu dengan kata-katamu sendiri, baru bandingkan dengan petunjuk di bawah.";

function stripCode(s: string): string {
  return s.replace(/`/g, "");
}

/** Bangun jenjang untuk langkah lab (ada editor kode). */
export function buildLabLadder(step: V2Step): LadderRung[] | null {
  const hints = (step.hints ?? []).map((h) => h.trim()).filter(Boolean);
  const noteBody = step.note?.body?.trim() ?? "";
  // Mode independent/transfer: jangan bocorkan target lewat jenjang.
  const blind = step.mode === "independent" || step.kind === "transfer";
  const expected = blind ? "" : (step.expected?.trim() ?? "");
  const tasks = (step.tasks ?? [])
    .map((t) => stripCode(t.text).trim())
    .filter(Boolean);

  const rungs: LadderRung[] = [];
  const push = (title: string, body: string) => {
    const b = body.trim();
    if (!b) return;
    if (rungs.some((r) => r.body === b)) return; // jangan duplikat jenjang
    rungs.push({ title, body: b });
  };

  if (hints.length > 0) {
    // (a) hints authored → jadikan jenjang, berurutan dari umum ke spesifik.
    push("Jenjang 1 · Pertanyaan penuntun", `${THINK_FIRST}\n\n${hints[0]}`);
    if (hints.length > 1) {
      push("Jenjang 2 · Arah yang lebih spesifik", hints[1]);
    }
    // (c) jenjang terakhir = rangkuman konsep kunci, bukan jawaban final.
    if (noteBody) {
      push("Jenjang 3 · Konsep kunci", noteBody);
    } else if (expected) {
      push(
        "Jenjang 3 · Konsep kunci",
        `Patokan hasil yang diharapkan: ${expected}`
      );
    } else if (hints.length > 2) {
      push("Jenjang 3 · Konsep kunci", hints[2]);
    }
  } else {
    // (b) tanpa hints: turunkan dari tasks / expected / note — tanpa fakta baru.
    // Langkah blind (independent/transfer) = "tanpa petunjuk": jangan turunkan
    // jenjang dari tasks, kembalikan null agar panel jujur "Belum ada petunjuk".
    if (blind) return null;
    if (tasks.length > 0) {
      push(
        "Jenjang 1 · Pertanyaan penuntun",
        `Uraikan dulu dengan kata-katamu sebelum menulis kode: ${tasks.join(" → ")}`
      );
    }
    if (expected) {
      push(
        "Jenjang 2 · Arah yang lebih spesifik",
        `Mundur dari hasil akhir — ${expected}. Variabel apa saja yang harus sudah ada sebelum baris terakhir?`
      );
    }
    if (noteBody) {
      push("Jenjang 3 · Konsep kunci", noteBody);
    }
  }
  return rungs.length > 0 ? rungs : null;
}

/** Bangun jenjang untuk satu soal kuis (pra-jawab; why dipakai sebagai arah). */
export function buildQuizLadder(step: V2Step, qIdx: number): LadderRung[] | null {
  const q = step.quiz?.[qIdx];
  if (!q) return null;
  const why = q.options.find((o) => o.correct)?.why?.trim() ?? "";
  const noteBody = step.note?.body?.trim() ?? "";
  if (!why && !noteBody) return null; // jujur: tidak ada bahan

  const rungs: LadderRung[] = [];
  rungs.push({
    title: "Jenjang 1 · Pertanyaan penuntun",
    body:
      `Baca ulang soalnya pelan-pelan: "${stripCode(q.q).trim()}"\n\n` +
      "Tanyakan pada dirimu: konsep apa yang sedang diuji, dan kata kunci apa di soal yang menentukannya?",
  });
  if (why) {
    // why opsi benar dipakai sebagai arah berpikir — tanpa menyebut huruf opsi.
    rungs.push({
      title: "Jenjang 2 · Arah yang lebih spesifik",
      body: `Arah berpikir yang tepat: ${why}`,
    });
  }
  if (noteBody) {
    rungs.push({ title: "Jenjang 3 · Konsep kunci", body: noteBody });
  }
  return rungs;
}

export default function HintLadder({
  mode,
  step,
  quizIndex = 0,
  onFirstOpen,
}: {
  mode: "lab" | "quiz";
  step: V2Step;
  quizIndex?: number;
  /** Additive hook (Gelombang G): dipanggil sekali saat panel pertama kali dibuka. */
  onFirstOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(1);
  const [fired, setFired] = useState(false);

  const rungs = useMemo(
    () =>
      mode === "lab" ? buildLabLadder(step) : buildQuizLadder(step, quizIndex),
    [mode, step, quizIndex]
  );
  const shown = rungs?.slice(0, level) ?? [];

  function toggleOpen() {
    if (!open && !fired) {
      setFired(true);
      try {
        onFirstOpen?.();
      } catch {
        /* noop */
      }
    }
    setOpen((o) => !o);
  }

  return (
    <div className="ladder">
      <button
        className="btn ghost"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label="Buka tangga petunjuk Socratic"
      >
        <Icon name="bulb" />
        <span>Butuh petunjuk?</span>
      </button>
      {open && (
        <div className="ladder-panel" role="region" aria-label="Tangga petunjuk">
          {rungs === null ? (
            <p className="ladder-empty">
              Belum ada petunjuk untuk langkah ini.
            </p>
          ) : (
            <>
              {shown.map((r, i) => (
                <div className="ladder-rung" key={i}>
                  <h4>{r.title}</h4>
                  <p>{r.body}</p>
                </div>
              ))}
              <div className="ladder-actions">
                {level < rungs.length && (
                  <button
                    className="btn"
                    onClick={() => setLevel((l) => l + 1)}
                  >
                    Jenjang berikutnya
                    <Icon name="right" />
                  </button>
                )}
                <button className="btn ghost" onClick={() => setOpen(false)}>
                  Tutup
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
