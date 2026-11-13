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
          {t.slug === "machine-learning-finance" && (
            <section
              aria-label="Apa yang berbeda dari track ini"
              style={{
                border: "1px solid #d8d3c3",
                borderRadius: 10,
                padding: "16px 20px",
                margin: "0 0 20px",
                background: "#faf8f2",
              }}
            >
              <h2 style={{ margin: "0 0 8px", fontSize: 17 }}>
                Apa yang berbeda dari track ini
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                <li>
                  <strong>Stress test tiga skenario</strong> — Baseline / Adverse /
                  Severe atas default rate dan expected loss, bukan satu angka
                  rata-rata.{" "}
                  <Link href="/v2/learn/mlf-m23-pd-lgd-ead-expected-loss">
                    M2.3
                  </Link>
                </li>
                <li>
                  <strong>Policy simulator</strong> — geser threshold, lihat
                  approval rate, bad rate, profit, dan fairness bergerak
                  bersama; versi interaktifnya di Colab.{" "}
                  <Link href="/v2/learn/mlf-m23-pd-lgd-ead-expected-loss">
                    M2.3
                  </Link>
                </li>
                <li>
                  <strong>Fairness audit + mitigasi</strong> — approval rate,
                  false positive/negative per SEX / EDUCATION / MARRIAGE /
                  AGE, satu mitigasi beserta trade-off-nya.{" "}
                  <Link href="/v2/learn/mlf-m22-scorecard-woe-iv">M2.2</Link>{" "}
                  · <Link href="/v2/learn/mlf-m71-fairness-metrics">M7</Link>
                </li>
                <li>
                  <strong>Adverse-action reason codes</strong> — tiga alasan
                  utama berbahasa awam untuk setiap nasabah yang ditolak, plus
                  counterfactual «apa yang harus berubah».{" "}
                  <Link href="/v2/learn/mlf-m22-scorecard-woe-iv">M2.2</Link>
                </li>
              </ul>
            </section>
          )}
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
