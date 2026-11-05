"use client";
import { useEffect, useState } from "react";
import { exportAll, wipeV2Local, pullServerProgress } from "../lib/progress";
import Icon from "../lib/icons";

function setTheme(t: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem("theme", t);
  } catch {
    /* noop */
  }
}

export default function SettingsPage() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [sync, setSync] = useState<"idle" | "ok" | "fail">("idle");
  const [syncedAt, setSyncedAt] = useState<string>("");

  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      if (t === "dark" || t === "light") setThemeState(t);
    } catch {
      /* noop */
    }
  }, []);

  async function checkSync() {
    setSync("idle");
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setSync("ok");
        setSyncedAt(`${(data.completed ?? []).length} lesson tersimpan di server`);
        await pullServerProgress();
      } else {
        setSync("fail");
        setSyncedAt(`HTTP ${res.status}`);
      }
    } catch {
      setSync("fail");
      setSyncedAt("tidak dapat dijangkau (offline / DATABASE_URL belum diset)");
    }
  }

  function download() {
    const blob = new Blob([exportAll()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `learn-v2-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function wipe() {
    if (!window.confirm("Hapus SEMUA data belajar di perangkat ini (progres, catatan, aktivitas)? Data di server tidak ikut terhapus.")) return;
    wipeV2Local();
    window.location.reload();
  }

  return (
    <div>
      <div className="setrow">
        <div>
          <div className="t">Tema</div>
          <div className="d">Terang atau gelap, tersimpan di perangkat ini.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              className={`btn ${theme === t ? "primary" : "ghost"}`}
              onClick={() => {
                setTheme(t);
                setThemeState(t);
              }}
              aria-pressed={theme === t}
            >
              <Icon name={t === "light" ? "sun" : "moon"} />
              {t === "light" ? "Terang" : "Gelap"}
            </button>
          ))}
        </div>
      </div>

      <div className="setrow">
        <div>
          <div className="t">Sinkronisasi progres</div>
          <div className="d">
            {sync === "idle" && "Belum dicek."}
            {sync === "ok" && `Tersambung — ${syncedAt}.`}
            {sync === "fail" && `Gagal — ${syncedAt}. Progres tetap tersimpan lokal.`}
          </div>
        </div>
        <button className="btn" onClick={checkSync}>
          <Icon name="refresh" />
          Cek koneksi
        </button>
      </div>

      <div className="setrow">
        <div>
          <div className="t">Unduh data</div>
          <div className="d">Ekspor progres, catatan, dan aktivitas sebagai JSON (cadangan manual).</div>
        </div>
        <button className="btn" onClick={download}>
          Unduh JSON
        </button>
      </div>

      <div className="setrow">
        <div>
          <div className="t">Hapus data perangkat</div>
          <div className="d">Bersihkan progres, catatan, dan aktivitas di perangkat ini.</div>
        </div>
        <button className="btn ghost" onClick={wipe}>
          Hapus
        </button>
      </div>
    </div>
  );
}
