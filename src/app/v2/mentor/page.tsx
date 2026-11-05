import DashboardNav from "../lib/DashboardNav";
import MentorClient from "./MentorClient";
import "./mentor.css";

export const metadata = {
  title: "Mentor Senyap — Learn v2",
  description:
    "Jaringan mentor AI yang diam-diam mengamati data belajarmu dan menulis catatan hanya saat kamu meminta — tanpa notifikasi, tanpa interupsi.",
};

export default function MentorPage() {
  return (
    <div className="shell">
      <DashboardNav active="mentor" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Mentor Senyap</h1>
            <span className="date">Silent Mentor Network · berbicara hanya saat diminta</span>
          </div>
          <MentorClient />
        </div>
      </main>
    </div>
  );
}
