import DashboardNav from "../lib/DashboardNav";
import WarisanClient from "./WarisanClient";
import "./warisan.css";

export const metadata = {
  title: "Warisan Pengetahuan — Learn v2",
  description:
    "Proyeksi retensi jangka panjang dari data review FSRS: apa yang kemungkinan bertahan 1, 3, dan 5 tahun, dan rencana maintenance minimalnya.",
};

export default function WarisanPage() {
  return (
    <div className="shell">
      <DashboardNav active="warisan" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Warisan Pengetahuan</h1>
            <span className="date">Legacy Mode · proyeksi dari data review</span>
          </div>
          <WarisanClient />
        </div>
      </main>
    </div>
  );
}
