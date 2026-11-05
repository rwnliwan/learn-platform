import DashboardNav from "../lib/DashboardNav";
import InterviewClient from "./InterviewClient";
import "./interview.css";

export const metadata = {
  title: "Simulator Wawancara — Learn v2",
  description:
    "Latihan wawancara kerja dengan AI sebagai pewawancara: umpan balik dan skor per jawaban, penilaian akhir, topik dari kurikulum nyata.",
};

export default function InterviewPage() {
  return (
    <div className="shell">
      <DashboardNav active="wawancara" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Simulator Wawancara</h1>
            <span className="date">Interview Simulator · jawab seperti wawancara sungguhan</span>
          </div>
          <InterviewClient />
        </div>
      </main>
    </div>
  );
}
