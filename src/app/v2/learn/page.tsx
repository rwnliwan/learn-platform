import DashboardNav from "../lib/DashboardNav";
import TrackAccordion, { type TrackGroup } from "./TrackAccordion";
import { getV2Lessons } from "../lib/registry";
import type { V2Lesson } from "../lib/types";

export const metadata = {
  title: "Kurikulum — Learn v2",
  description: "Semua track dan lesson dalam format workspace.",
};

/* Foundation = bekal teknis lintas peran; sisanya track peran/domain. */
const FOUNDATION = new Set(["Statistika", "Probabilitas", "SQL", "Python"]);

export default function V2Curriculum() {
  const lessons = getV2Lessons();
  const byTrack = new Map<string, V2Lesson[]>();
  for (const l of lessons) {
    const arr = byTrack.get(l.track) ?? [];
    arr.push(l);
    byTrack.set(l.track, arr);
  }
  const tracks = [...byTrack.entries()].sort((a, b) => b[1].length - a[1].length);

  const groups: TrackGroup[] = [
    {
      id: "fondasi",
      title: "Fondasi",
      blurb:
        "Bekal teknis lintas peran — kuasai dulu sebelum masuk track peran.",
      tracks: tracks.filter(([t]) => FOUNDATION.has(t)),
    },
    {
      id: "peran",
      title: "Track Peran",
      blurb: "Spesialisasi per peran dan domain: risiko, fraud, portfolio, data, pemasaran, kesehatan.",
      tracks: tracks.filter(([t]) => !FOUNDATION.has(t)),
    },
  ];

  return (
    <div className="shell">
      <DashboardNav active="kurikulum" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Kurikulum</h1>
            <span className="date">{lessons.length} lesson</span>
          </div>
          <TrackAccordion groups={groups} />
        </div>
      </main>
    </div>
  );
}
