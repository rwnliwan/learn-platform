import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardNav from "../../../lib/DashboardNav";
import { getV2Tracks, trackBySlug, trackLessons } from "../../tracks";

export function generateStaticParams() {
  return getV2Tracks().map((t) => ({ track: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const t = trackBySlug(track);
  return {
    title: t ? `${t.name} — Learn v2` : "Track — Learn v2",
    description: t
      ? `Lesson track ${t.name} dalam format workspace.`
      : "Track kurikulum Learn v2.",
  };
}

export default async function V2TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const t = trackBySlug(track);
  if (!t) notFound();
  const lessons = trackLessons(t.name);

  return (
    <div className="shell">
      <DashboardNav active="kurikulum" />
      <main className="main">
        <div className="main-in">
          <Link className="backlink" href="/v2/learn">
            ← Semua track
          </Link>
          <div className="page-h">
            <h1>{t.name}</h1>
            <span className="date">
              {lessons.length} lesson · ±{t.totalMinutes} mnt
            </span>
          </div>
          <div className="tblwrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Lesson</th>
                  <th className="num">Langkah</th>
                  <th className="num">Estimasi</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l.slug}>
                    <td>
                      <Link className="name rowlink" href={`/v2/learn/${l.slug}`}>
                        {l.title}
                      </Link>
                      <span className="sub">{l.module}</span>
                    </td>
                    <td className="num">{l.steps}</td>
                    <td className="num muted">±{l.estMinutes} mnt</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
