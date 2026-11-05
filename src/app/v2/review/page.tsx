import DashboardNav from "../lib/DashboardNav";
import { getV2Lessons } from "../lib/registry";
import ReviewClient, { type LightIndex } from "./ReviewClient";

export const metadata = {
  title: "Tinjau ulang — Learn v2",
  description: "Antrean review harian: kartu kuis & lab dijadwalkan ulang otomatis (FSRS).",
};

export default function V2Review() {
  // Light index only (slug/title/track) — full card content comes on demand
  // from /api/v2/card. Never pass the 473-lesson corpus to the client.
  const index: LightIndex[] = getV2Lessons().map((l) => ({
    slug: l.slug,
    title: l.title,
    track: l.track,
  }));
  return (
    <div className="shell">
      <DashboardNav active="tinjau" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Review Hari Ini</h1>
            <span className="date">spaced repetition · FSRS</span>
          </div>
          <ReviewClient index={index} />
        </div>
      </main>
    </div>
  );
}
