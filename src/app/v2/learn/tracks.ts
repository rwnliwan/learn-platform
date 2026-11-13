import { getV2Lessons } from "../lib/registry";
import { slugify } from "../lib/slug";
import { trackIconFor, type IconName } from "../lib/icons";

/* Daftar track kurikulum v2 — dipakai halaman direktori /v2/learn dan
   halaman per-track /v2/learn/track/<slug> (pecah kurikulum, 2026-11-12).
   Sengaja RINGKAS: direktori hanya butuh nama + hitungan, bukan objek
   lesson penuh (payload RSC learn.html menembus 25 MiB bila lesson penuh
   ikut — deploy M1, 2026-11-12). */

export interface TrackSummary {
  name: string;
  slug: string;
  icon: IconName;
  lessonCount: number;
  totalMinutes: number;
}

export interface TrackLesson {
  slug: string;
  title: string;
  module: string;
  estMinutes: number;
  steps: number;
}

export function getV2Tracks(): TrackSummary[] {
  const byTrack = new Map<string, { count: number; minutes: number }>();
  for (const l of getV2Lessons()) {
    const cur = byTrack.get(l.track) ?? { count: 0, minutes: 0 };
    cur.count += 1;
    cur.minutes += l.estMinutes;
    byTrack.set(l.track, cur);
  }
  return [...byTrack.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, { count, minutes }]) => ({
      name,
      slug: slugify(name),
      icon: trackIconFor(name),
      lessonCount: count,
      totalMinutes: minutes,
    }));
}

export function trackBySlug(slug: string): TrackSummary | null {
  return getV2Tracks().find((t) => t.slug === slug) ?? null;
}

export function trackLessons(name: string): TrackLesson[] {
  return getV2Lessons()
    .filter((l) => l.track === name)
    .map((l) => ({
      slug: l.slug,
      title: l.title,
      module: l.module,
      estMinutes: l.estMinutes,
      steps: l.steps.length,
    }));
}
