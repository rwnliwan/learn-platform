import DashboardNav from "../lib/DashboardNav";
import BukuClient from "./BukuClient";
import "./buku.css";

export const metadata = {
  title: "Bedah Buku — Learn v2",
  description:
    "Rak buku: bedah The Elements of Quantitative Investing per bab — peta konsep, deep dive, cheatsheet, kuis, dan mode suara. Gelombang 1: Bab 1–3.",
};

export default function BukuPage() {
  return (
    <div className="shell">
      <DashboardNav active="buku" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Bedah Buku</h1>
            <span className="date">bedah per bab · interaktif · nol AI runtime</span>
          </div>
          <BukuClient />
        </div>
      </main>
    </div>
  );
}
