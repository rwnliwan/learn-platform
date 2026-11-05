import Link from "next/link";
import DashboardNav from "../lib/DashboardNav";
import { PF_LIST } from "../lib/portfolio";
import "./portofolio.css";

export const metadata = {
  title: "Portofolio — Learn v2",
  description:
    "Portfolio Generator: 7 proyek flagship Learn v2 sebagai studi kasus siap bagikan — executive scan & technical deep dive, dengan kontrol redaksi dan tautan versi ber-ID.",
};

export default function PortofolioIndexPage() {
  return (
    <div className="shell">
      <DashboardNav active="portofolio" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Portofolio</h1>
            <span className="date">7 proyek flagship · studi kasus siap bagikan</span>
          </div>
          <div className="pf-wrap">
            <p className="pf-idx-sub">
              Setiap proyek diubah menjadi halaman studi kasus dua mode —{" "}
              <strong>executive scan</strong> untuk pembaca cepat dan{" "}
              <strong>technical deep dive</strong> untuk yang ingin melihat mesinnya.
              Semua isi ditarik dari konten proyek yang sudah ada; kamu bisa menyembunyikan
              bagian sebelum membagikan, dan tautan bagikan membawa versi ber-ID.
            </p>
            <div className="pf-grid">
              {PF_LIST.map((p) => (
                <Link key={p.slug} href={`/v2/portofolio/${p.slug}`} className="pf-card">
                  <span className="pf-track">{p.track}</span>
                  <h3>{p.title}</h3>
                  <p>{p.tagline}</p>
                  <span className="pf-go">
                    {p.steps.length} langkah · {p.skills.length} skill → Buka studi kasus
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
