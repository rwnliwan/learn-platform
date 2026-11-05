import DashboardNav from "../../lib/DashboardNav";
import { getPack, withAudio, BUKU } from "../../lib/bedahbuku";
import BabClient from "../bab/BabClient";
import "../buku.css";

export const metadata = {
  title: "Bab 2: Univariate Returns — Bedah Buku",
  description:
    "Bedah Bab 2 The Elements of Quantitative Investing: peta konsep, deep dive, cheatsheet, prediksi, kuis, kartu FSRS, dan Feynman checklist.",
};

export default function BukuBab2Page() {
  const pack = getPack("bab-2");
  if (!pack) return null;
  const full = withAudio(pack);
  return (
    <div className="shell">
      <DashboardNav active="buku" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <div>
              <h1>Bab 2: Univariate Returns</h1>
              <span className="date">
                {BUKU.judul} · {BUKU.penulis} ({BUKU.penerbit}, {BUKU.tahun})
              </span>
            </div>
            <img
              src="/v2/buku/cover.jpg"
              alt="Sampul buku The Elements of Quantitative Investing — Giuseppe A. Paleologo (Wiley, 2025)"
              className="bk-bab-cover-thumb"
              width={640}
              height={949}
            />
          </div>
          <BabClient pack={full} />
        </div>
      </main>
    </div>
  );
}
