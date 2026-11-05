import DashboardNav from "../lib/DashboardNav";
import MulaiClient from "./MulaiClient";
import "./mulai.css";

export const metadata = {
  title: "Mulai dari Sini — Learn v2",
  description:
    "Pilih jalur belajar terurut per tujuan karier, ikuti tes penempatan, dan lihat langkah berikutnya.",
};

export default function MulaiPage() {
  return (
    <div className="shell">
      <DashboardNav active="mulai" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Mulai dari Sini</h1>
            <span className="date">Jalur belajar terurut</span>
          </div>
          <p style={{ maxWidth: 720, color: "var(--text-muted)" }}>
            Pilih jalur sesuai tujuanmu, ikuti tes penempatan untuk melewati
            materi dasar yang sudah dikuasai, lalu ikuti langkah demi langkah —
            diakhiri misi dan proyek capstone.
          </p>
          <MulaiClient />
        </div>
      </main>
    </div>
  );
}
