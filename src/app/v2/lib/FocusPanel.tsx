"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Icon, { trackIconFor } from "./icons";
import { getV2Lessons } from "./registry";
import { REG_MISI } from "./reg-misi";
import { getStats } from "./fsrs";
import {
  listProjectableCards,
  projectCards,
  bandOf,
} from "./legacy";
import { computeNodes, confirmedKind } from "./confusion";
import { getActivity, getLocalDone } from "./progress";
import type { V2Lesson } from "./types";

// Panel Fokus sidebar (aditif 2026-10-15): ringkasan 4 kartu di sidebar
// expanded — SEMBUNYI TOTAL di mode rail (CSS .sidenav[data-collapsed="true"])
// dan di mobile (Sidenav display:none <=820px).
// Data hanya dari sumber existing: /api/progress + localStorage (v2:done:*,
// v2:activity, v2:fsrs:*) + registry. Tanpa endpoint/API baru, tanpa skema DB
// baru. Semua baca async; error -> kartu disembunyikan, bukan ditampilkan.

interface ResumeItem {
  slug: string;
  title: string;
  track: string;
  est: number;
  kind: "lesson" | "misi";
  href: string;
}

function lessonHref(slug: string) {
  return "/v2/learn/" + slug;
}

/* Bungkus kartu: fade-in halus sekali saat mount (stagger ≤40ms/kartu).
   prefers-reduced-motion -> div biasa tanpa animasi. */
function FpCard({ index, children }: { index: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className="fpcard">{children}</div>;
  return (
    <motion.div
      className="fpcard"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
    >
      {children}
    </motion.div>
  );
}
function misiHref(slug: string) {
  return "/v2/misi/" + slug;
}

export default function FocusPanel() {
  const [ready, setReady] = useState(false);
  const [resume, setResume] = useState<ResumeItem | null>(null);
  const [resumeTrack, setResumeTrack] = useState<string | null>(null);
  const [trackDone, setTrackDone] = useState(0);
  const [trackTotal, setTrackTotal] = useState(0);
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [spotlight, setSpotlight] = useState<ResumeItem | null>(null);
  const [legacy, setLegacy] = useState<{ p25: number; p75: number } | null>(
    null
  );
  const [confusionTop, setConfusionTop] = useState<
    { title: string; kind: string }[]
  >([]);

  useEffect(() => {
    try {
      // --- kumpulkan progres: server union lokal ---
      const doneLocal = getLocalDone();
      const localTs: Record<string, number> = {};
      try {
        for (const k of doneLocal) {
          const v = localStorage.getItem("v2:done:" + k);
          const t = v ? Date.parse(v) : NaN;
          if (Number.isFinite(t)) localTs[k] = t;
        }
      } catch {
        /* noop */
      }
      const serverTs: Record<string, number> = {};
      const done = new Set<string>(doneLocal);
      const pulls = (async () => {
        try {
          const res = await fetch("/api/progress");
          if (res.ok) {
            const data = await res.json();
            for (const r of data.completed ?? []) {
              done.add(r.lesson_slug);
              const t = Date.parse(r.completed_at);
              if (Number.isFinite(t)) serverTs[r.lesson_slug] = t;
            }
          }
        } catch {
          /* offline: local state stands alone */
        }
      })();

      pulls.then(() => {
        try {
          const lessons = getV2Lessons();
          const misiList = Object.values(REG_MISI);
          const tsOf = (slug: string) =>
            serverTs[slug] ?? localTs[slug] ?? 0;
          // aktivitas terakhir: completed terbaru ATAU kunjungan terakhir
          let lastSlug: string | null = null;
          let lastTs = 0;
          for (const s of done) {
            const t = tsOf(s);
            if (t > lastTs) {
              lastTs = t;
              lastSlug = s;
            }
          }
          const visits = getActivity();
          for (const v of visits) {
            if (v.ts > lastTs) {
              lastTs = v.ts;
              lastSlug = v.slug;
            }
          }

          const bySlug = new Map<string, V2Lesson>();
          for (const l of lessons) bySlug.set(l.slug, l);
          const isMisi = (slug: string) => REG_MISI[slug] !== undefined;
          const hrefOf = (slug: string) =>
            isMisi(slug) ? misiHref(slug) : lessonHref(slug);

          if (lastSlug) {
            const anchor = bySlug.get(lastSlug) ?? REG_MISI[lastSlug];
            const track = anchor?.track ?? null;
            setResumeTrack(track);
            if (track) {
              const trackItems: { slug: string; kind: "lesson" | "misi" }[] = [];
              for (const l of lessons)
                if (l.track === track) trackItems.push({ slug: l.slug, kind: "lesson" });
              for (const m of misiList)
                if (m.track === track) trackItems.push({ slug: m.slug, kind: "misi" });
              const total = trackItems.length;
              const doneInTrack = trackItems.filter((i) => done.has(i.slug)).length;
              setTrackDone(doneInTrack);
              setTrackTotal(total);
              const next = trackItems.find((i) => !done.has(i.slug));
              if (next) {
                const item = bySlug.get(next.slug) ?? REG_MISI[next.slug];
                if (item)
                  setResume({
                    slug: next.slug,
                    title: item.title,
                    track,
                    est: item.estMinutes,
                    kind: next.kind,
                    href: hrefOf(next.slug),
                  });
              }
            }
          } else {
            // belum ada progres: ajakan mulai dari track terbesar
            const byTrack = new Map<string, V2Lesson[]>();
            for (const l of lessons) {
              const a = byTrack.get(l.track) ?? [];
              a.push(l);
              byTrack.set(l.track, a);
            }
            let biggest: V2Lesson[] = [];
            for (const a of byTrack.values())
              if (a.length > biggest.length) biggest = a;
            const first = biggest[0];
            if (first) {
              setResumeTrack(first.track);
              setResume({
                slug: first.slug,
                title: first.title,
                track: first.track,
                est: first.estMinutes,
                kind: "lesson",
                href: lessonHref(first.slug),
              });
              setTrackDone(0);
              setTrackTotal(biggest.length);
            }
          }

          // --- sorotan misi: belum selesai, prioritas capstone, rotasi harian ---
          const open = misiList.filter((m) => !done.has(m.slug));
          if (open.length) {
            const caps = open.filter((m) => m.slug.startsWith("misi-gabung-"));
            const pool = caps.length ? caps : open;
            const now = new Date();
            const day =
              Math.floor(
                (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
              );
            const pick = pool[day % pool.length];
            setSpotlight({
              slug: pick.slug,
              title: pick.title,
              track: pick.track,
              est: pick.estMinutes,
              kind: "misi",
              href: misiHref(pick.slug),
            });
          }
        } catch {
          /* satu kartu gagal -> biarkan hidden */
        }
        setReady(true);
      });

      // --- FSRS due (lokal, sinkron) ---
      try {
        setDueCount(getStats().dueCount);
      } catch {
        setDueCount(null);
      }

      // --- Legacy Mode ringkas (Gelombang F, aditif): proyeksi stop 1 tahun ---
      try {
        const lc = listProjectableCards();
        if (lc.length) {
          const b = bandOf(
            projectCards(lc, "stop", 365).map((p) => p.retention)
          );
          setLegacy({ p25: b.p25, p75: b.p75 });
        } else {
          setLegacy(null);
        }
      } catch {
        setLegacy(null);
      }

      // --- Confusion Index ringkas (Gelombang G, aditif): 3 titik paling rapuh ---
      try {
        const bySlug = new Map<string, V2Lesson>();
        for (const l of getV2Lessons()) bySlug.set(l.slug, l);
        const nodes = computeNodes((slug, stepId) => {
          const l = bySlug.get(slug) ?? REG_MISI[slug];
          return {
            lessonTitle: l?.title ?? slug,
            stepTitle: stepId,
            track: l?.track ?? "Lainnya",
            href: REG_MISI[slug] ? "/v2/misi/" + slug : "/v2/learn/" + slug,
          };
        }).slice(0, 3);
        setConfusionTop(
          nodes.map((n) => ({
            title: n.lessonTitle,
            kind: confirmedKind(n.slug, n.stepId) ?? n.kind,
          }))
        );
      } catch {
        setConfusionTop([]);
      }
    } catch {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <section className="focuspanel" aria-label="Panel fokus" aria-busy="true">
        <div className="fphead">Fokus</div>
        <div className="fpskel">Memuat ringkasan…</div>
      </section>
    );
  }

  return (
    <section className="focuspanel" aria-label="Panel fokus">
      <div className="fphead">Fokus</div>

      {resume && (
        <FpCard index={0}>
          <div className="fptitle">
            <Icon name="play" />
            <span>Lanjutkan</span>
          </div>
          <Link className="fplink" href={resume.href} title={resume.title}>
            <span className="fpitem">{resume.title}</span>
          </Link>
          <div className="fpmeta">
            {resume.track} · {resume.kind === "misi" ? "Misi" : "Lesson"} · {resume.est} mnt
          </div>
          <Link className="fpcta" href={resume.href}>
            Lanjut
          </Link>
        </FpCard>
      )}

      {dueCount !== null && (
        <FpCard index={1}>
          <div className="fptitle">
            <Icon name="refresh" />
            <span>Review</span>
          </div>
          {dueCount > 0 ? (
            <>
              <div className="fpnum">{dueCount}</div>
              <div className="fpmeta">kartu jatuh tempo hari ini</div>
              <Link className="fpcta" href="/v2/review">
                Tinjau ulang
              </Link>
            </>
          ) : (
            <div className="fpmeta">Belum ada review jatuh tempo.</div>
          )}
        </FpCard>
      )}

      {resumeTrack && trackTotal > 0 && (
        <FpCard index={2}>
          <div className="fptitle">
            <Icon name="chart" />
            <span>Progres track</span>
          </div>
          <div className="fpitem">
            <Icon name={trackIconFor(resumeTrack)} className="i ti" /> {resumeTrack}
          </div>
          <div className="fpmeta">
            {trackDone}/{trackTotal} selesai
          </div>
          <div className="fpbar" role="progressbar" aria-valuenow={trackDone} aria-valuemax={trackTotal} aria-label="Progres track">
            <div
              className="fpbarfill"
              style={{ width: Math.round((trackDone / trackTotal) * 100) + "%" }}
            />
          </div>
        </FpCard>
      )}

      {spotlight && (
        <FpCard index={3}>
          <div className="fptitle">
            <Icon name="flag" />
            <span>Sorotan misi</span>
          </div>
          <Link className="fplink" href={spotlight.href} title={spotlight.title}>
            <span className="fpitem">{spotlight.title}</span>
          </Link>
          <div className="fpmeta">
            {spotlight.track} · {spotlight.est} mnt
          </div>
          <Link className="fpcta" href={spotlight.href}>
            Buka misi
          </Link>
        </FpCard>
      )}

      {/* Additive 2026-10-16: Legacy Mode ringkas (Gelombang F). Sembunyi bila
          belum ada kartu FSRS — pola yang sama dengan kartu lain. */}
      {legacy && (
        <FpCard index={4}>
          <div className="fptitle">
            <Icon name="book" />
            <span>Warisan pengetahuan</span>
          </div>
          <div className="fpnum">
            {Math.round(legacy.p25)}–{Math.round(legacy.p75)}%
          </div>
          <div className="fpmeta">perkiraan retensi 1 thn tanpa review</div>
          <Link className="fpcta" href="/v2/warisan">
            Buka Warisan
          </Link>
        </FpCard>
      )}

      {/* Additive 2026-10-16: Confusion Index ringkas (Gelombang G). Sembunyi
          bila belum ada titik kebingungan — pola yang sama dengan kartu lain. */}
      {confusionTop.length > 0 && (
        <FpCard index={5}>
          <div className="fptitle">
            <Icon name="bulb" />
            <span>Titik rapuh</span>
          </div>
          <div className="fpitem">{confusionTop[0].title}</div>
          <div className="fpmeta">
            {confusionTop.length} titik butuh perhatian
          </div>
          <Link className="fpcta" href="/v2/kebingungan">
            Buka Peta Kebingungan
          </Link>
        </FpCard>
      )}
    </section>
  );
}
