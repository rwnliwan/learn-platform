import DashboardNav from "../lib/DashboardNav";
import { allMissions } from "../lib/missions";
import MissionGallery from "./MissionGallery";

export const metadata = {
  title: "Misi — Learn v2",
  description: "Proyek terpadu: peran, data nyata, keputusan bercabang, deliverable portofolio.",
};

export default function MisiIndex() {
  const missions = allMissions();
  return (
    <div className="shell">
      {/* Item nav "Misi" menunggu ACC Septian (desain §6.1) — sementara
          misi dikelompokkan di bawah nav Kurikulum. */}
      <DashboardNav active="kurikulum" />
      <main className="main">
        <div className="main-in wide">
          <div className="page-h">
            <h1>Misi</h1>
            <span className="date">{missions.length} misi</span>
          </div>
          <p style={{ maxWidth: 720, color: "var(--text-muted)" }}>
            Misi adalah proyek terpadu 90–150 menit: kamu diberi <strong>peran</strong> dan{" "}
            <strong>tugas dari klien</strong>, bekerja dengan <strong>data nyata yang kotor</strong>,
            mengambil <strong>keputusan bercabang</strong> yang mengubah jalan cerita, menghadapi{" "}
            <strong>suntikan impostor</strong> tanpa pengumuman, dan pulang membawa{" "}
            <strong>deliverable portofolio</strong>.
          </p>
          <MissionGallery missions={missions} />
        </div>
      </main>
    </div>
  );
}
