import DashboardNav from "../lib/DashboardNav";
import { getV2Lessons } from "../lib/registry";
import KarierClient from "./KarierClient";
import type { CareerLesson } from "../lib/career";
import "./karier.css";

export const metadata = {
  title: "Kesiapan karier — Learn v2",
  description: "Peta kesiapan karier analis risiko: cakupan lesson per peran dari progres nyata.",
};

export default function KarierPage() {
  // Light index only (slug/title/track) — lesson content stays server-side.
  const index: CareerLesson[] = getV2Lessons().map((l) => ({
    slug: l.slug,
    title: l.title,
    track: l.track,
  }));
  return (
    <div className="shell">
      <DashboardNav active="karier" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Kesiapan karier</h1>
            <span className="date">Peta skill analis risiko</span>
          </div>
          <KarierClient index={index} />
        </div>
      </main>
    </div>
  );
}
