import Link from "next/link";
import DashboardNav from "../lib/DashboardNav";
import Icon from "../lib/icons";
import { getV2Tracks } from "./tracks";

export const metadata = {
  title: "Kurikulum — Learn v2",
  description: "Semua track dan lesson dalam format workspace.",
};

/* Foundation = bekal teknis lintas peran; sisanya track peran/domain. */
const FOUNDATION = new Set(["Statistika", "Probabilitas", "SQL", "Python"]);

export default function V2Curriculum() {
  const tracks = getV2Tracks();
  const groups = [
    {
      id: "fondasi",
      title: "Fondasi",
      blurb:
        "Bekal teknis lintas peran — kuasai dulu sebelum masuk track peran.",
      tracks: tracks.filter((t) => FOUNDATION.has(t.name)),
    },
    {
      id: "peran",
      title: "Track Peran",
      blurb: "Spesialisasi per peran dan domain: risiko, fraud, portfolio, data, pemasaran, kesehatan.",
      tracks: tracks.filter((t) => !FOUNDATION.has(t.name)),
    },
  ];
  const totalLessons = tracks.reduce((a, t) => a + t.lessonCount, 0);

  return (
    <div className="shell">
      <DashboardNav active="kurikulum" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Kurikulum</h1>
            <span className="date">
              {tracks.length} track · {totalLessons} lesson
            </span>
          </div>
          {groups.map((g) => (
            <div key={g.id} className="tgroup">
              <div className="sec">
                <span>
                  {g.title}{" "}
                  <span className="muted">
                    · {g.tracks.length} track ·{" "}
                    {g.tracks.reduce((a, t) => a + t.lessonCount, 0)} lesson
                  </span>
                </span>
              </div>
              <p className="gblurb">{g.blurb}</p>
              {g.tracks.map((t) => (
                <section key={t.name} className="tacc">
                  <Link
                    className="tacc-h"
                    href={`/v2/learn/track/${t.slug}`}
                  >
                    <span className="tacc-ic" aria-hidden="true">
                      <Icon name={t.icon} className="i ti" />
                    </span>
                    <span className="tacc-n">{t.name}</span>
                    <span className="muted">
                      {t.lessonCount} lesson · ±{t.totalMinutes} mnt
                    </span>
                    <span className="chev go" aria-hidden="true" />
                  </Link>
                </section>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
