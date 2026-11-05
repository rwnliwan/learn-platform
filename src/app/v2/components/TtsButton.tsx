"use client";

/* TTS pilot (Item 6 program upgrade Learn v2, 2026-10-14).
 *
 * Web Speech API native (window.speechSynthesis) — NOL dependensi baru.
 * Tombol "Dengarkan" pada teks teori (prose) step: play / pause / resume /
 * stop. Memilih suara id-ID bila tersedia (fallback en, lalu default).
 * Berhenti otomatis saat teks berganti (ganti step) dan saat unmount.
 * Browser tanpa speechSynthesis → tombol disabled + tooltip jujur.
 *
 * Catatan QA: semua akses speechSynthesis lewat getSS() saat handler
 * dipanggil (bukan di-capture sekali), supaya bisa di-mock/di-spy di uji
 * headless via page.evaluate / addInitScript.
 */

import { useEffect, useRef, useState } from "react";
import Icon from "../lib/icons";

type TtsState = "idle" | "speaking" | "paused" | "unsupported";

function getSS(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { speechSynthesis?: SpeechSynthesis };
  return w.speechSynthesis ?? null;
}

/** Pilih suara id-ID bila ada, fallback en, lalu apa pun yang tersedia. */
function pickVoice(ss: SpeechSynthesis): SpeechSynthesisVoice | null {
  const vs = ss.getVoices();
  if (!vs.length) return null;
  return (
    vs.find((v) => v.lang.toLowerCase().startsWith("id")) ??
    vs.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    vs[0]
  );
}

/** prose punya markup `code` inline — buang backtick agar enak didengar. */
function plainText(paragraphs: string[]): string {
  return paragraphs.map((p) => p.replace(/`/g, "")).join("\n\n");
}

export default function TtsButton({ text }: { text: string[] }) {
  const [state, setState] = useState<TtsState>("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textKey = text.join("\n");

  // Deteksi dukungan + daftar suara (voiceschanged), dan stop saat unmount.
  useEffect(() => {
    const ss = getSS();
    if (!ss) {
      setState("unsupported");
      return;
    }
    pickVoice(ss); // pemanasan: sebagian browser butuh getVoices() dulu
    const onVoices = () => pickVoice(ss);
    // onvoiceschanged (bukan addEventListener) supaya kompatibel mock polos.
    const prev = ss.onvoiceschanged;
    ss.onvoiceschanged = onVoices;
    return () => {
      ss.onvoiceschanged = prev ?? null;
      try {
        ss.cancel();
      } catch {
        /* abaikan */
      }
      utterRef.current = null;
      setState("idle");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hentikan otomatis saat teks berganti (= ganti step).
  useEffect(() => {
    const ss = getSS();
    if (!ss) return;
    try {
      ss.cancel();
    } catch {
      /* abaikan */
    }
    utterRef.current = null;
    setState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textKey]);

  function speak() {
    const ss = getSS();
    if (!ss) {
      setState("unsupported");
      return;
    }
    try {
      ss.cancel();
    } catch {
      /* abaikan */
    }
    const u = new SpeechSynthesisUtterance(plainText(text));
    const v = pickVoice(ss);
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    } else {
      u.lang = "id-ID";
    }
    u.onend = () => {
      utterRef.current = null;
      setState("idle");
    };
    u.onerror = () => {
      utterRef.current = null;
      setState("idle");
    };
    utterRef.current = u;
    ss.speak(u);
    setState("speaking");
  }

  function pause() {
    try {
      getSS()?.pause();
    } catch {
      /* abaikan */
    }
    setState("paused");
  }

  function resume() {
    try {
      getSS()?.resume();
    } catch {
      /* abaikan */
    }
    setState("speaking");
  }

  function stop() {
    try {
      getSS()?.cancel();
    } catch {
      /* abaikan */
    }
    utterRef.current = null;
    setState("idle");
  }

  if (state === "unsupported") {
    return (
      <button
        className="btn ghost"
        disabled
        title="Browser ini tidak mendukung pembacaan suara (Web Speech API tidak tersedia)"
        aria-label="Dengarkan (tidak didukung browser ini)"
      >
        <Icon name="play" />
        <span>Dengarkan</span>
      </button>
    );
  }

  const main =
    state === "speaking" ? pause : state === "paused" ? resume : speak;
  const label =
    state === "speaking" ? "Jeda" : state === "paused" ? "Lanjutkan" : "Dengarkan";
  const aria =
    state === "speaking"
      ? "Jeda pembacaan suara"
      : state === "paused"
        ? "Lanjutkan pembacaan suara"
        : "Dengarkan teks teori langkah ini";

  return (
    <span className="tts" role="group" aria-label="Kontrol bacaan suara">
      <button className="btn ghost" onClick={main} aria-label={aria}>
        <Icon name={state === "speaking" ? "pause" : "play"} />
        <span>{label}</span>
      </button>
      {(state === "speaking" || state === "paused") && (
        <button
          className="btn ghost icon"
          onClick={stop}
          aria-label="Berhenti membaca"
          title="Berhenti"
        >
          <Icon name="stop" />
        </button>
      )}
    </span>
  );
}
