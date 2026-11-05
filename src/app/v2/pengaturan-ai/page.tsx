import DashboardNav from "../lib/DashboardNav";
import AiSettingsClient from "./AiSettingsClient";
import "./pengaturan-ai.css";

export const metadata = {
  title: "Pengaturan AI — Learn v2",
  description:
    "Sambungkan provider AI (base URL + API key + model) untuk fitur AI Learn v2: Feynman Gate, AI Penyanggah, Silent Mentor, dan Interview Simulator.",
};

export default function PengaturanAiPage() {
  return (
    <div className="shell">
      <DashboardNav active="ai" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Pengaturan AI</h1>
            <span className="date">AI runtime · BYOK dari browser ini</span>
          </div>
          <AiSettingsClient />
        </div>
      </main>
    </div>
  );
}
