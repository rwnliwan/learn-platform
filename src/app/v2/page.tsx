import Link from "next/link";
import DashboardNav from "./lib/DashboardNav";
import MulaiCard from "./lib/MulaiCard";
import { getV2Lessons } from "./lib/registry";
import { ResumeBlock, TrackTable, HeatMap, ReviewList, type LightLesson } from "./lib/DashboardLive";
import "./mulai/mulai.css";

// Track list derived from the v2 registry (single source of truth) —
// grouping by lesson.track so new tracks appear automatically once their
// REG_* is merged into lib/registry.ts. Never scan src/app/learn folders
// here: that is the legacy v1 layout and does not contain new tracks.
function trackCounts(): { track: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const l of getV2Lessons()) {
    counts.set(l.track, (counts.get(l.track) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([track, count]) => ({ track, count }))
    .sort((x, y) => y.count - x.count);
}

function todayId(): string {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function V2Dashboard() {
  const lessons = getV2Lessons();
  const tracks = trackCounts();
  // Light index for client components (no lesson content leaves the server).
  const index: LightLesson[] = lessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    track: l.track,
    module: l.module,
    estMinutes: l.estMinutes,
    steps: l.steps.length,
  }));
  const totalLessons = lessons.length;

  return (
    <div className="shell">
      <DashboardNav active="beranda" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Beranda</h1>
            <span className="date">{todayId()}</span>
          </div>

          <ResumeBlock index={index} tracks={tracks} />

          <div className="sec">
            <span>Jalur belajar</span>
            <Link href="/v2/mulai">Mulai dari sini</Link>
          </div>
          <div style={{ maxWidth: 560 }}>
            <MulaiCard />
          </div>

          <div className="sec">
            <span>Track</span>
            <Link href="/v2/learn">Semua kurikulum</Link>
          </div>
          <TrackTable tracks={tracks} totalLessons={totalLessons} index={index} />

          <div className="two">
            <div>
              <div className="sec">
                <span>Aktivitas 13 minggu</span>
                <span className="muted" style={{ fontWeight: 400 }}>
                  kunjungan lesson
                </span>
              </div>
              <HeatMap />
            </div>
            <div>
              <div className="sec">
                <span>Perlu diulang</span>
              </div>
              <ReviewList index={index} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
