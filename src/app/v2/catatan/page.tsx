import DashboardNav from "../lib/DashboardNav";
import { getV2Lessons } from "../lib/registry";
import NotesList from "./NotesList";

export const metadata = {
  title: "Catatan — Learn v2",
  description: "Semua catatan pribadi per lesson.",
};

export default function V2Notes() {
  // Light index only (no lesson content leaves the server).
  const index = getV2Lessons().map((l) => ({
    slug: l.slug,
    title: l.title,
    track: l.track,
    steps: l.steps.map((s) => ({ id: s.id, title: s.title })),
  }));
  return (
    <div className="shell">
      <DashboardNav active="catatan" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Catatan</h1>
            <span className="date">tersimpan di perangkat ini</span>
          </div>
          <NotesList index={index} />
        </div>
      </main>
    </div>
  );
}
