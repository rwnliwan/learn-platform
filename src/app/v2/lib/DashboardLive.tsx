// Dashboard live components: replace the placeholder dashboard widgets with
// real data (localStorage progress/activity + /api/progress sync). Server
// passes a light lesson index; all lesson content stays server-side.
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon, { trackIconFor } from "./icons";
import { slugify } from "./slug";
import {
  getLocalDone,
  pullServerProgress,
  getActivity,
  activityByDay,
  getReviewItems,
  type Visit,
} from "./progress";

export interface LightLesson {
  slug: string;
  title: string;
  track: string;
  module: string;
  estMinutes: number;
  steps: number;
}
export interface TrackCount {
  track: string;
  count: number;
}

function useLiveData() {
  const [done, setDone] = useState<Set<string> | null>(null);
  const [activity, setActivity] = useState<Visit[]>([]);
  useEffect(() => {
    setDone(new Set([...getLocalDone()]));
    setActivity(getActivity());
    pullServerProgress().then((server) => {
      setDone((prev) => new Set([...(prev ?? []), ...server]));
    });
  }, []);
  return { done, activity };
}

/* ---------- resume + pending-practice cards (replaces .cont) ---------- */
export function ResumeBlock({ index, tracks }: { index: LightLesson[]; tracks: TrackCount[] }) {
  const { done, activity } = useLiveData();
  const bySlug = useMemo(() => new Map(index.map((l) => [l.slug, l])), [index]);

  const resume: LightLesson | null = useMemo(() => {
    if (!done) return null;
    // last visited lesson that is not yet done; else first lesson overall
    for (let i = activity.length - 1; i >= 0; i--) {
      const l = bySlug.get(activity[i].slug);
      if (l && !done.has(l.slug)) return l;
    }
    return index[0] ?? null;
  }, [done, activity, bySlug, index]);

  const review = useMemo(() => getReviewItems(), [done]); // depends on done tick
  void activity;

  if (!done || !resume) {
    return (
      <div className="cont">
        <div>
          <div className="eyebrow">Memuat…</div>
          <h2>Menyiapkan progresmu</h2>
          <p>Membaca catatan belajar di perangkat ini.</p>
        </div>
      </div>
    );
  }

  const firstReview = review[0];
  const reviewLesson = firstReview ? bySlug.get(firstReview.slug) : undefined;

  return (
    <div className="cont">
      <div>
        <div className="eyebrow">
          {resume.track} · {resume.module}
        </div>
        <h2>{resume.title}</h2>
        <p>
          {resume.steps} langkah · ±{resume.estMinutes} menit ·{" "}
          {done.has(resume.slug) ? "sudah selesai" : "belum selesai"}
        </p>
        <div className="bar">
          <i style={{ width: done.has(resume.slug) ? "100%" : "0%" }}></i>
        </div>
        <div className="row">
          <Link className="btn primary" href={`/v2/learn/${resume.slug}`}>
            Lanjutkan
            <Icon name="right" />
          </Link>
          <Link prefetch={false} className="btn ghost" href={`/v2/learn?track=track-${slugify(resume.track)}`}>
            Lihat track ini
          </Link>
        </div>
      </div>
      <div>
        <div className="eyebrow">Latihan tertunda</div>
        {review.length > 0 ? (
          <>
            <h2>{review.length} langkah perlu latihan</h2>
            <p>
              Lab yang sudah dicoba ≥2 kali tapi belum lolos
              {reviewLesson ? ` — mulai dari “${reviewLesson.title}”.` : "."}
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              {reviewLesson && (
                <Link className="btn primary" href={`/v2/learn/${reviewLesson.slug}`}>
                  Mulai latihan
                  <Icon name="right" />
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Tidak ada latihan tertunda</h2>
            <p>Semua lab yang kamu coba sudah lolos. Lanjutkan ke materi berikutnya.</p>
            <div className="row" style={{ marginTop: 12 }}>
              <Link prefetch={false} className="btn ghost" href="/v2/learn">
                Buka kurikulum
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- track table with real progress (replaces .tblwrap table) ---------- */
export function TrackTable({ tracks, totalLessons, index }: { tracks: TrackCount[]; totalLessons: number; index: LightLesson[] }) {
  const { done, activity } = useLiveData();
  const bySlug = useMemo(() => new Map(index.map((l) => [l.slug, l])), [index]);

  const lastInTrack = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of activity) {
      const l = bySlug.get(v.slug);
      if (!l) continue;
      const prev = m.get(l.track) ?? 0;
      if (v.ts > prev) m.set(l.track, v.ts);
    }
    return m;
  }, [activity, bySlug]);

  return (
    <div className="tblwrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>Track</th>
            <th className="num">Lesson</th>
            <th>Progres</th>
            <th className="num">Terakhir</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((t) => {
            const doneCount = done
              ? index.filter((l) => l.track === t.track && done.has(l.slug)).length
              : 0;
            const pct = Math.round((doneCount / t.count) * 100);
            const last = lastInTrack.get(t.track);
            const lastStr = last
              ? new Date(last).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
              : "—";
            return (
              <tr key={t.track}>
                <td>
                  <Link
                    prefetch={false}
                    className="name rowlink"
                    href={`/v2/learn?track=track-${slugify(t.track)}`}
                    style={{ color: "var(--accent)" }}
                  >
                    <Icon name={trackIconFor(t.track)} className="i ti" /> {t.track}
                  </Link>
                  <span className="sub">format workspace</span>
                </td>
                <td className="num">{t.count}</td>
                <td>
                  <span className="bar">
                    <i style={{ width: `${pct}%` }}></i>
                  </span>
                  <span className="muted">
                    {done ? `${doneCount}/${t.count} · ${pct}%` : "…"}
                  </span>
                </td>
                <td className="num muted">{lastStr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="meta muted" style={{ marginTop: 8, fontSize: 12 }}>
        Total {totalLessons} lesson · progres dihitung dari lesson yang kamu tandai selesai.
      </p>
    </div>
  );
}

/* ---------- real activity heatmap (13 weeks ending today) ---------- */
export function HeatMap() {
  const [byDay, setByDay] = useState<Map<string, number> | null>(null);
  useEffect(() => {
    setByDay(activityByDay());
  }, []);
  const cells = useMemo(() => {
    const out: { key: string; cls: string; title: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const n = byDay?.get(key) ?? 0;
      const cls = n <= 0 ? "" : n === 1 ? "l1" : n <= 3 ? "l2" : "l3";
      out.push({ key, cls, title: `${key}: ${n} kunjungan` });
    }
    return out;
  }, [byDay]);
  return (
    <div className="heat" aria-label="Peta aktivitas">
      {cells.map((c) => (
        <i key={c.key} className={c.cls} title={c.title}></i>
      ))}
    </div>
  );
}

/* ---------- real review list (replaces hardcoded fake items) ---------- */
export function ReviewList({ index }: { index: LightLesson[] }) {
  const [items, setItems] = useState<ReturnType<typeof getReviewItems> | null>(null);
  useEffect(() => {
    setItems(getReviewItems().slice(0, 5));
  }, []);
  const bySlug = useMemo(() => new Map(index.map((l) => [l.slug, l])), [index]);

  if (items === null) {
    return (
      <ul className="weak">
        <li>
          <span className="muted">Memuat…</span>
        </li>
      </ul>
    );
  }
  if (items.length === 0) {
    return (
      <ul className="weak">
        <li>
          <span>
            Belum ada
            <br />
            <span className="m">Lab yang gagal ≥2 kali akan muncul di sini</span>
          </span>
        </li>
      </ul>
    );
  }
  return (
    <ul className="weak">
      {items.map((it) => {
        const l = bySlug.get(it.slug);
        return (
          <li key={`${it.slug}:${it.stepId}`}>
            <span>
              {l ? l.title : it.slug}
              <br />
              <span className="m">
                {it.attempts} percobaan · belum lolos
              </span>
            </span>
            {l && (
              <Link className="btn" href={`/v2/learn/${l.slug}`}>
                Latih
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
