import DashboardNav from "../lib/DashboardNav";
import PetaClient from "./PetaClient";
import "./peta.css";

export const metadata = {
  title: "Peta Pengetahuan — Learn v2",
  description:
    "Knowledge Graph Navigator: 749 lesson sebagai rute — jembatan terpendek antar konsep, lesson pembuka, bottleneck dari progresmu, dan pulau domain. Semua relasi dari data kurikulum nyata.",
};

export default function PetaPage() {
  return (
    <div className="shell">
      <DashboardNav active="peta" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Peta Pengetahuan</h1>
            <span className="date">Knowledge Graph · 749 lesson sebagai rute</span>
          </div>
          <PetaClient />
        </div>
      </main>
    </div>
  );
}
