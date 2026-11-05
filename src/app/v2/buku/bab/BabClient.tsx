// Bedah Buku — Gelombang 1: renderer paket bab (7 bagian).
// Gelombang Poles: KaTeX via RichInline di semua teks konten, graf peta
// konsep interaktif (PetaGraf), subsection Blok Rumus + visual per bab di
// Deep Dive, grup cheatsheet berkotak, reveal halus per section.
//
// Client component. Semua state interaktif di localStorage (pola v2):
//   v2:buku:<slug>:kuis     — jawaban + skor kuis
//   v2:buku:<slug>:prediksi — jawaban + status buka-kunci
//   v2:buku:<slug>:feynman  — checklist tercentang
//   v2:buku:<slug>:fsrs     — kartu yang sudah dibalik/ditinjau
// localStorage HANYA dibaca di useEffect (pelajaran hidrasi).
//
// Kartu FSRS di sini page-local (BUKAN store bersama v2:fsrs:): kartu buku
// tidak terdaftar di /api/v2/card sehingga mendaftarkannya ke antrean
// review bersama akan merusak halaman Tinjau ulang. Label jujur di UI.
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type {
  ChapterPack,
  BukuKonsep,
  BukuPrediksi,
  BukuKuisSoal,
  BukuKartuFsrs,
  BukuFeynman,
  AudioInfo,
} from "../../lib/bedahbuku";
import { RichInline } from "./rich";
import PetaGraf from "./PetaGraf";
import DeepDiveSection from "./DeepDiveSection";
import RumusSection from "./RumusSection";
import VisualBab1 from "./VisualBab1";
import VisualBab2 from "./VisualBab2";
import VisualBab3 from "./VisualBab3";
import VisualBab4 from "./VisualBab4";
import VisualBab5 from "./VisualBab5";
import VisualBab6 from "./VisualBab6";
import "../buku.css";

/* ------------------------------------------------------------------ */
/* Markdown-lite renderer: fence ```, tabel |, heading ###, quote >,   */
/* list -/1. Inline (bold/italic/code/KaTeX) via RichInline.             */
/* Tiap grup bagian ### (heading + blok setelahnya) dibungkus            */
/* <div className="bk-cheat-grup"> berkotak.                            */
/* ------------------------------------------------------------------ */

function splitTableRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map((c) => c.trim());
}

function isSepRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

function MdLite({ text }: { text: string }) {
  const lines = text.split("\n");
  // grup per heading ###: grup ke-0 = blok sebelum ### pertama (bila ada)
  const groups: ReactNode[][] = [[]];
  let bi = 0;
  const push = (el: ReactNode) => {
    groups[groups.length - 1].push(<span key={bi++} style={{ display: "contents" }}>{el}</span>);
  };
  // satu-satunya inline renderer: KaTeX + **bold**/*italic*/`code`
  const rich = (t: string): ReactNode => <RichInline key={`r${bi++}`} text={t} />;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // fenced code
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // lewati fence penutup
      push(<pre className="bk-pre">{buf.join("\n")}</pre>);
      continue;
    }
    // table
    if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      const body = rows.filter((r) => !isSepRow(r));
      const head = body.length > 1 && rows.length > body.length ? body[0] : null;
      const data = head ? body.slice(1) : body;
      push(
        <div className="bk-tablewrap">
          <table className="bk-table">
            {head && (
              <thead>
                <tr>{head.map((c, ci) => <th key={ci}>{rich(c)}</th>)}</tr>
              </thead>
            )}
            <tbody>
              {data.map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{rich(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    // heading
    const hm = line.match(/^(#{2,4})\s+(.*)$/);
    if (hm) {
      const lvl = hm[1].length;
      const kids = rich(hm[2]);
      if (lvl === 3) groups.push([]); // ### memulai grup cheatsheet baru
      if (lvl === 2) push(<h3 className="bk-mdh2">{kids}</h3>);
      else if (lvl === 3) push(<h4 className="bk-mdh3">{kids}</h4>);
      else push(<h5 className="bk-mdh4">{kids}</h5>);
      i++;
      continue;
    }
    // blockquote
    if (line.trim().startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      push(<blockquote className="bk-quote">{buf.map((b, qi) => <p key={qi}>{rich(b)}</p>)}</blockquote>);
      continue;
    }
    // list
    const lm = line.match(/^\s*(?:[-*]|\d+[.)])\s+(.*)$/);
    if (lm) {
      const items: string[] = [];
      while (i < lines.length) {
        const m2 = lines[i].match(/^\s*(?:[-*]|\d+[.)])\s+(.*)$/);
        if (!m2) break;
        items.push(m2[1]);
        i++;
      }
      push(<ul className="bk-list">{items.map((it, li) => <li key={li}>{rich(it)}</li>)}</ul>);
      continue;
    }
    // blank
    if (line.trim() === "") {
      i++;
      continue;
    }
    // paragraph (gabung baris berurutan)
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith(">") &&
      !/^(#{2,4})\s/.test(lines[i]) &&
      !/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    push(<p className="bk-p">{rich(buf.join(" "))}</p>);
  }
  return (
    <>
      {groups
        .filter((g) => g.length > 0)
        .map((g, gi) => (
          <div className="bk-cheat-grup" key={gi}>
            {g}
          </div>
        ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section dengan reveal halus saat scroll (sekali, subtle)              */
/* ------------------------------------------------------------------ */

function Sec({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className={"bk-sec" + (className ? " " + className : "")}
      aria-label={label}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* localStorage helpers (baca HANYA di useEffect)                        */
/* ------------------------------------------------------------------ */

function lsRead<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function lsWrite(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/* Bagian 0: Audio                                                       */
/* ------------------------------------------------------------------ */

function AudioBlock({ info, testId }: { info: AudioInfo; testId: string }) {
  const [dead, setDead] = useState(false);
  if (dead) return null;
  return (
    <div className="bk-audio" data-testid={testId}>
      <div className="bk-audio-head">
        <span className="bk-audio-label">{info.label}</span>
        {info.durasi && <span className="bk-muted">{info.durasi}</span>}
      </div>
      <audio
        controls
        preload="none"
        src={info.src}
        className="bk-player"
        onError={() => setDead(true)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bagian 1: Peta Konsep                                                 */
/* ------------------------------------------------------------------ */

function KonsepCard({ k }: { k: BukuKonsep }) {
  return (
    <div className="bk-konsep">
      <h4 className="bk-konsep-nama">{k.nama}</h4>
      <p className="bk-p"><RichInline text={k.definisi} /></p>
      {k.relasi && (
        <p className="bk-p bk-relasi">
          <strong>Relasi:</strong> <RichInline text={k.relasi} />
        </p>
      )}
      {k.contoh && (
        <p className="bk-p bk-contoh">
          <strong>Contoh:</strong> <RichInline text={k.contoh} />
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bagian 4: Prediksi Bab (Time Capsule lokal — kunci setelah menjawab)  */
/* ------------------------------------------------------------------ */

function PrediksiSection({ pack }: { pack: ChapterPack }) {
  const key = `v2:buku:${pack.slug}:prediksi`;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = lsRead<{ answers?: Record<string, string>; unlocked?: Record<string, boolean> }>(key);
    if (saved) {
      setAnswers(saved.answers ?? {});
      setUnlocked(saved.unlocked ?? {});
    }
    setReady(true);
  }, [key]);

  const setAnswer = (id: string, v: string) => {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    lsWrite(key, { answers: next, unlocked });
  };
  const unlock = (id: string) => {
    const next = { ...unlocked, [id]: true };
    setUnlocked(next);
    lsWrite(key, { answers, unlocked: next });
  };

  if (!ready) return <p className="bk-muted">Memuat…</p>;

  return (
    <div>
      <p className="bk-note">
        Jawab <strong>dulu</strong> dari pemahamanmu sekarang — kunci jawabannya
        terkunci sampai kamu menulis jawaban. Pola yang sama seperti Time
        Capsule: tebakanmu hari ini adalah pembanding terbaik untuk dirimu nanti.
      </p>
      {pack.prediksi.map((p: BukuPrediksi) => {
        const answered = (answers[p.id] ?? "").trim().length > 0;
        const open = !!unlocked[p.id];
        return (
          <div className="bk-pred" key={p.id}>
            <h4 className="bk-sub2">
              {p.id}. <RichInline text={p.pertanyaan} />
            </h4>
            <textarea
              className="bk-area"
              rows={3}
              placeholder="Tulis tebakanmu di sini…"
              value={answers[p.id] ?? ""}
              onChange={(e) => setAnswer(p.id, e.target.value)}
              aria-label={`Jawaban prediksi ${p.id}`}
            />
            {!open ? (
              <button
                type="button"
                className="bk-btn"
                disabled={!answered}
                onClick={() => unlock(p.id)}
                title={answered ? "Buka kunci jawaban" : "Tulis jawabanmu dulu untuk membuka kunci"}
              >
                🔒 Buka kunci jawaban
              </button>
            ) : (
              <div className="bk-kunci">
                <strong>Kunci:</strong> <RichInline text={p.kunci} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bagian 5: Kuis Bab (feedback instan + skor)                           */
/* ------------------------------------------------------------------ */

function KuisSection({ pack }: { pack: ChapterPack }) {
  const key = `v2:buku:${pack.slug}:kuis`;
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = lsRead<{ picked?: Record<number, number>; done?: boolean }>(key);
    if (saved) {
      setPicked(saved.picked ?? {});
      setDone(!!saved.done);
    }
    setReady(true);
  }, [key]);

  const choose = (qi: number, oi: number) => {
    if (done) return;
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    lsWrite(key, { picked: next, done });
  };
  const finish = () => {
    setDone(true);
    lsWrite(key, { picked, done: true });
  };
  const reset = () => {
    setPicked({});
    setDone(false);
    lsWrite(key, { picked: {}, done: false });
  };

  if (!ready) return <p className="bk-muted">Memuat…</p>;

  const score = pack.kuis.reduce(
    (s, q: BukuKuisSoal, i) => s + (picked[i] === q.benar ? 1 : 0),
    0
  );

  return (
    <div>
      {pack.kuis.map((q: BukuKuisSoal, qi) => {
        const sel = picked[qi];
        return (
          <div className="bk-kuis" key={qi}>
            <h4 className="bk-sub2">
              Q{qi + 1}. <RichInline text={q.pertanyaan} />
            </h4>
            <div className="bk-opsi" role="radiogroup" aria-label={`Soal ${qi + 1}`}>
              {q.opsi.map((op, oi) => {
                const isSel = sel === oi;
                const showRight = done && oi === q.benar;
                const showWrong = done && isSel && oi !== q.benar;
                return (
                  <button
                    key={oi}
                    type="button"
                    role="radio"
                    aria-checked={isSel}
                    disabled={done}
                    onClick={() => choose(qi, oi)}
                    className={
                      "bk-op" +
                      (isSel && !done ? " bk-op-sel" : "") +
                      (showRight ? " bk-op-benar" : "") +
                      (showWrong ? " bk-op-salah" : "")
                    }
                  >
                    <RichInline text={op} />
                  </button>
                );
              })}
            </div>
            {done && sel !== undefined && (
              <p className={"bk-fb" + (sel === q.benar ? " bk-fb-ok" : " bk-fb-no")}>
                {sel === q.benar ? "✓ Benar. " : "✗ Kurang tepat. "}
                <RichInline text={q.penjelasan} />
              </p>
            )}
          </div>
        );
      })}
      <div className="bk-kuis-foot">
        {!done ? (
          <button
            type="button"
            className="bk-btn"
            disabled={Object.keys(picked).length < pack.kuis.length}
            onClick={finish}
            title={
              Object.keys(picked).length < pack.kuis.length
                ? "Jawab semua soal dulu"
                : "Lihat skor & pembahasan"
            }
          >
            Lihat skor
          </button>
        ) : (
          <>
            <p className="bk-skor" role="status">
              Skor: <strong>{score}/{pack.kuis.length}</strong>
              {score === pack.kuis.length ? " — sempurna. 🎯" : score >= Math.ceil(pack.kuis.length * 0.7) ? " — kuat." : " — baca ulang Deep Dive-nya, lalu coba lagi."}
            </p>
            <button type="button" className="bk-btn bk-ghost" onClick={reset}>
              Ulangi kuis
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bagian 6: Kartu FSRS (page-local flip card)                           */
/* ------------------------------------------------------------------ */

function FsrsSection({ pack }: { pack: ChapterPack }) {
  const key = `v2:buku:${pack.slug}:fsrs`;
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [seen, setSeen] = useState<Record<number, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = lsRead<{ seen?: Record<number, boolean> }>(key);
    if (saved?.seen) setSeen(saved.seen);
    setReady(true);
  }, [key]);

  const flip = (i: number) => {
    setFlipped((p) => ({ ...p, [i]: !p[i] }));
    if (!seen[i]) {
      const next = { ...seen, [i]: true };
      setSeen(next);
      lsWrite(key, { seen: next });
    }
  };

  if (!ready) return <p className="bk-muted">Memuat…</p>;

  const seenCount = Object.keys(seen).length;

  return (
    <div>
      <p className="bk-note">
        Klik kartu untuk membalik. Kartu-kartu ini <strong>khusus halaman bab
        ini</strong> (page-local) — sengaja tidak masuk antrean Tinjau ulang
        bersama, supaya tidak merusak penjadwalan kartu lesson-mu.
        <span className="bk-muted"> {seenCount}/{pack.fsrs.length} sudah dibalik.</span>
      </p>
      <div className="bk-fsrs-grid">
        {pack.fsrs.map((c: BukuKartuFsrs, i) => (
          <button
            key={i}
            type="button"
            className={"bk-flip" + (flipped[i] ? " bk-flip-on" : "")}
            onClick={() => flip(i)}
            aria-label={`Kartu ${i + 1}: ${flipped[i] ? "sembunyikan jawaban" : "tampilkan jawaban"}`}
          >
            <span className="bk-flip-inner">
              <span className="bk-flip-front"><RichInline text={c.depan} /></span>
              <span className="bk-flip-back"><RichInline text={c.belakang} /></span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bagian 7: Feynman Checklist                                           */
/* ------------------------------------------------------------------ */

function FeynmanSection({ pack }: { pack: ChapterPack }) {
  const key = `v2:buku:${pack.slug}:feynman`;
  const [checked, setChecked] = useState<boolean[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = lsRead<boolean[]>(key);
    setChecked(saved ?? new Array(pack.feynman.length).fill(false));
    setReady(true);
  }, [key, pack.feynman.length]);

  const toggle = (i: number) => {
    const next = checked.slice();
    next[i] = !next[i];
    setChecked(next);
    lsWrite(key, next);
  };

  if (!ready) return <p className="bk-muted">Memuat…</p>;

  const n = checked.filter(Boolean).length;

  return (
    <div>
      <p className="bk-note">
        Untuk tiap poin: jelaskan dengan kata-katamu sendiri seolah mengajar
        teman. Centang hanya bila pertanyaan penajamannya bisa kamu jawab
        lancar. <span className="bk-muted">{n}/{pack.feynman.length} lolos.</span>
      </p>
      <ul className="bk-feyn">
        {pack.feynman.map((f: BukuFeynman, i) => (
          <li key={i} className={checked[i] ? "bk-feyn-ok" : ""}>
            <label>
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
              />
              <span>
                <strong><RichInline text={f.poin} /></strong>
                <span className="bk-feyn-tajam"> Penajaman: <RichInline text={f.penajaman} /></span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman bab                                                           */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "peta", label: "Peta Konsep" },
  { id: "deep", label: "Deep Dive" },
  { id: "cheat", label: "Cheatsheet" },
  { id: "prediksi", label: "Prediksi Bab" },
  { id: "kuis", label: "Kuis Bab" },
  { id: "fsrs", label: "Kartu FSRS" },
  { id: "feynman", label: "Feynman" },
] as const;

export default function BabClient({ pack }: { pack: ChapterPack }) {
  const [tab, setTab] = useState<string>("peta");
  const [printing, setPrinting] = useState(false);

  const doPrint = () => {
    setPrinting(true);
    // biarkan React merender kelas cetak dulu
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 60);
  };

  return (
    <div className={"bk-wrap" + (printing ? " bk-printing" : "")}>
      {/* Audio */}
      {pack.podcast && (
        <AudioBlock info={pack.podcast} testId="podcast" />
      )}
      {pack.podcastPending && !pack.podcast && (
        <p className="bk-note bk-pending" role="status">
          🎙️ Podcast Gemini untuk bab ini sedang diproduksi — segera hadir.
        </p>
      )}
      {pack.narasi && <AudioBlock info={pack.narasi} testId="narasi" />}

      {/* Navigasi 7 bagian */}
      <nav className="bk-tabs" aria-label="Bagian paket bab">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={"bk-tab" + (tab === s.id ? " bk-tab-on" : "")}
            aria-current={tab === s.id ? "page" : undefined}
            onClick={() => setTab(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {tab === "peta" && (
        <Sec label="Peta Konsep">
          <h2 className="bk-h2">Peta Konsep</h2>
          <p className="bk-lead"><RichInline text={pack.ideBesar} /></p>
          {pack.peta ? (
            <PetaGraf peta={pack.peta} konsep={pack.konsep} />
          ) : (
            <pre className="bk-pre">{pack.diagram}</pre>
          )}
          <div className="bk-konsep-grid">
            {pack.konsep.map((k: BukuKonsep, i) => (
              <KonsepCard key={i} k={k} />
            ))}
          </div>
        </Sec>
      )}

      {tab === "deep" && (
        <Sec label="Deep Dive">
          <h2 className="bk-h2">Deep Dive</h2>
          <DeepDiveSection pack={pack} />
          {pack.rumus && pack.rumus.length > 0 && (
            <>
              <h2 className="bk-h2">Blok Rumus</h2>
              <RumusSection rumus={pack.rumus} />
            </>
          )}
          {pack.slug === "bab-1" && <VisualBab1 />}
          {pack.slug === "bab-2" && <VisualBab2 />}
          {pack.slug === "bab-3" && <VisualBab3 />}
          {pack.slug === "bab-4" && <VisualBab4 />}
          {pack.slug === "bab-5" && <VisualBab5 />}
          {pack.slug === "bab-6" && <VisualBab6 />}
        </Sec>
      )}

      {tab === "cheat" && (
        <Sec label="Cheatsheet Bab" className="bk-print-target">
          <div className="bk-cheat-head">
            <h2 className="bk-h2">Cheatsheet Bab</h2>
            <button type="button" className="bk-btn bk-ghost" onClick={doPrint}>
              🖨️ Cetak
            </button>
          </div>
          <p className="bk-note">Satu halaman ringkas — cetak dan tempel.</p>
          <MdLite text={pack.cheatsheet} />
        </Sec>
      )}

      {tab === "prediksi" && (
        <Sec label="Prediksi Bab">
          <h2 className="bk-h2">Prediksi Bab</h2>
          <PrediksiSection pack={pack} />
        </Sec>
      )}

      {tab === "kuis" && (
        <Sec label="Kuis Bab">
          <h2 className="bk-h2">Kuis Bab</h2>
          <KuisSection pack={pack} />
        </Sec>
      )}

      {tab === "fsrs" && (
        <Sec label="Kartu FSRS">
          <h2 className="bk-h2">Kartu FSRS</h2>
          <FsrsSection pack={pack} />
        </Sec>
      )}

      {tab === "feynman" && (
        <Sec label="Feynman Checklist">
          <h2 className="bk-h2">Feynman Checklist</h2>
          <FeynmanSection pack={pack} />
        </Sec>
      )}

      <p className="bk-back">
        <Link href="/v2/buku">← Kembali ke Rak Buku</Link>
      </p>
    </div>
  );
}
