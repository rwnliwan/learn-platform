"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Rating } from "ts-fsrs";
import {
  getDueCards,
  getStats,
  recordReview,
  GRADE_LABEL,
  type FsrsGrade,
  type FsrsStats,
} from "../lib/fsrs";

export interface LightIndex {
  slug: string;
  title: string;
  track: string;
}

interface CardPayload {
  cardId: string;
  slug: string;
  stepId: string;
  lessonTitle: string;
  lessonTrack: string;
  stepTitle: string;
  type: "quiz" | "lab";
  q?: string;
  qIdx?: number;
  options?: { text: string; why: string; correct: boolean }[];
  tasks?: { id: string; text: string }[];
  expected?: string | null;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const day = (x: Date) => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  if (day(d) === day(now)) return "hari ini";
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
}

const GRADES: FsrsGrade[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy];

export default function ReviewClient({ index }: { index: LightIndex[] }) {
  const bySlug = useRef(new Map(index.map((l) => [l.slug, l])));
  const cache = useRef(new Map<string, CardPayload>());
  const [queue, setQueue] = useState<string[] | null>(null);
  const [cursor, setCursor] = useState(0);
  const [payload, setPayload] = useState<CardPayload | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stats, setStats] = useState<FsrsStats | null>(null);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    setStats(getStats());
    setQueue(getDueCards(60));
  }, []);

  useEffect(() => {
    if (!queue || cursor >= queue.length) {
      setPayload(null);
      return;
    }
    const cardId = queue[cursor];
    const hit = cache.current.get(cardId);
    if (hit) {
      setPayload(hit);
      setRevealed(false);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch(`/api/v2/card?cardId=${encodeURIComponent(cardId)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as CardPayload;
      })
      .then((p) => {
        if (cancelled) return;
        cache.current.set(cardId, p);
        setPayload(p);
        setRevealed(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("Kartu tidak bisa dimuat (lesson/step mungkin berubah). Lewati kartu ini.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queue, cursor]);

  function skip() {
    setQueue((q) => (q ? q.filter((_, i) => i !== cursor) : q));
    setStats(getStats());
  }

  function rate(grade: FsrsGrade) {
    const cardId = queue?.[cursor];
    if (!cardId) return;
    try {
      recordReview(cardId, grade);
    } catch {
      /* noop */
    }
    setReviewed((n) => n + 1);
    // remove reviewed card; next card shifts into the same cursor
    setQueue((q) => (q ? q.filter((c) => c !== cardId) : q));
    setPayload(null);
    setRevealed(false);
    setStats(getStats());
  }

  if (queue === null || stats === null) {
    return <p className="meta">Memuat antrean…</p>;
  }

  /* ---------- empty queue: stats ---------- */
  if (queue.length === 0) {
    return (
      <div>
        {reviewed > 0 && (
          <div className="note" role="status">
            <h4>Sesi selesai</h4>
            <p>
              {reviewed} kartu ditinjau. Interval berikutnya dijadwalkan otomatis oleh FSRS.
            </p>
          </div>
        )}
        <div className="sec">
          <span>Statistik kartu</span>
          <Link href="/v2/learn">Buka kurikulum</Link>
        </div>
        <ul className="weak">
          <li>
            <span>
              Total kartu
              <br />
              <span className="m">soal kuis + lab yang pernah dijawab</span>
            </span>
            <b>{stats.totalCards}</b>
          </li>
          <li>
            <span>
              Jatuh tempo hari ini
              <br />
              <span className="m">siap ditinjau</span>
            </span>
            <b>{stats.dueCount}</b>
          </li>
          <li>
            <span>
              Retensi perkiraan
              <br />
              <span className="m">rata-rata probabilitas ingat (model FSRS)</span>
            </span>
            <b>{stats.avgRetention === null ? "—" : `${stats.avgRetention}%`}</b>
          </li>
          <li>
            <span>
              Jatuh tempo berikutnya
              <br />
              <span className="m">di luar hari ini</span>
            </span>
            <b>{fmtDate(stats.nextDueISO)}</b>
          </li>
        </ul>
        {stats.totalCards === 0 && (
          <div className="note" style={{ marginTop: 16 }}>
            <h4>Belum ada kartu</h4>
            <p>
              Jawab kuis atau tekan <b>Periksa</b> pada lab di sebuah lesson — kartu review
              akan dibuat otomatis dan muncul di sini saat jatuh tempo.
            </p>
          </div>
        )}
      </div>
    );
  }

  const lesson = payload ? bySlug.current.get(payload.slug) : undefined;
  const title = payload?.lessonTitle ?? lesson?.title ?? payload?.slug ?? queue[cursor];
  const remaining = queue.length - cursor;

  return (
    <div>
      <div className="sec" style={{ marginTop: 0 }}>
        <span>
          Kartu {cursor + 1} dari {queue.length}
        </span>
        <span className="muted" style={{ fontWeight: 400 }}>
          tersisa {remaining}
        </span>
      </div>

      {loadError ? (
        <div className="note" role="alert">
          <h4>Kartu dilewati</h4>
          <p>{loadError}</p>
          <button className="btn" style={{ marginTop: 8 }} onClick={skip}>
            Lanjut ke kartu berikutnya
          </button>
        </div>
      ) : loading || !payload ? (
        <p className="meta">Memuat kartu…</p>
      ) : (
        <div className="prose">
          <div className="eyebrow">
            {payload.type === "quiz" ? `Kuis · Soal ${(payload.qIdx ?? 0) + 1}` : "Lab"} — {payload.stepTitle}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>
            <Link href={`/v2/learn/${payload.slug}`} style={{ color: "var(--accent)" }}>
              {title}
            </Link>
            {" · "}
            {payload.lessonTrack}
          </p>

          {!revealed ? (
            <>
              {payload.type === "quiz" ? (
                <p style={{ fontWeight: 600, fontSize: 17, lineHeight: "26px" }}>{payload.q}</p>
              ) : (
                <>
                  <p style={{ fontWeight: 600 }}>Tugas lab:</p>
                  <ul>
                    {(payload.tasks ?? []).map((t) => (
                      <li key={t.id} style={{ marginBottom: 6 }}>
                        {t.text}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <button className="btn primary" style={{ marginTop: 12 }} onClick={() => setRevealed(true)}>
                Tampilkan jawaban
              </button>
            </>
          ) : (
            <>
              {payload.type === "quiz" ? (
                <div className="stack" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {(payload.options ?? []).map((o, i) => (
                    <div key={i} className={`opt ${o.correct ? "right" : ""}`}>
                      <span className="l">{String.fromCharCode(65 + i)}</span>
                      <span>
                        {o.text}
                        <small>{o.why || "—"}</small>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="note">
                  <h4>Yang diharapkan</h4>
                  <p style={{ whiteSpace: "pre-wrap" }}>{payload.expected ?? "—"}</p>
                </div>
              )}

              <div className="sec">
                <span>Seberapa mudah kamu mengingatnya?</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {GRADES.map((g) => (
                  <button key={g} className={`btn ${g === Rating.Again ? "" : g === Rating.Good ? "primary" : "ghost"}`} onClick={() => rate(g)}>
                    {GRADE_LABEL[g]}
                  </button>
                ))}
              </div>
              <p className="meta" style={{ marginTop: 8, fontSize: 12, color: "var(--text-faint)" }}>
                Again = lupa · Hard = ingat dengan susah payah · Good = ingat · Easy = terlalu mudah
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
