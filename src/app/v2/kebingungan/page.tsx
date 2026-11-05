import DashboardNav from "../lib/DashboardNav";
import KebingunganClient from "./KebingunganClient";
import "./kebingungan.css";

export const metadata = {
  title: "Peta Kebingungan — Learn v2",
  description:
    "Confusion Index: konsep mana yang rapuh, apa jenis kebingungannya, dan intervensi terkecil untuk membereskannya — dari data review dan sinyal belajarmu.",
};

export default function KebingunganPage() {
  return (
    <div className="shell">
      <DashboardNav active="kebingungan" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Peta Kebingungan</h1>
            <span className="date">Confusion Index · diagnosis dari data belajarmu</span>
          </div>
          <KebingunganClient />
        </div>
      </main>
    </div>
  );
}
