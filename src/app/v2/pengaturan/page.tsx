import DashboardNav from "../lib/DashboardNav";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Pengaturan — Learn v2",
  description: "Tema, sinkronisasi, dan data belajar.",
};

export default function V2Settings() {
  return (
    <div className="shell">
      <DashboardNav active="pengaturan" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Pengaturan</h1>
          </div>
          <SettingsClient />
        </div>
      </main>
    </div>
  );
}
