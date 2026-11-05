import DashboardNav from "../lib/DashboardNav";
import LabBebasClient from "./LabBebasClient";
import "./labbebas.css";

export const metadata = {
  title: "Lab Bebas — Learn v2",
  description:
    "Ruang eksperimen bebas berformat experiment card: pertanyaan, hipotesis, dan kondisi falsifikasi — dengan engine Python (Pyodide) dan SQL (sql.js) yang sama seperti Misi.",
};

export default function LabBebasPage() {
  return (
    <div className="shell">
      <DashboardNav active="labbebas" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Lab Bebas</h1>
            <span className="date">Ruang eksperimen eksploratif · engine sama seperti Misi</span>
          </div>
          <LabBebasClient />
        </div>
      </main>
    </div>
  );
}
