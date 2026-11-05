"use client";

import { useEffect } from "react";

export default function V2Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("v2 error boundary:", error);
  }, [error]);

  const isChunkError =
    /ChunkLoadError|Loading chunk|failed to load/i.test(error?.message || "") ||
    /chunk/i.test(error?.name || "");

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <h2 style={{ marginBottom: 12 }}>
          {isChunkError ? "Koneksi terputus saat memuat" : "Terjadi kesalahan"}
        </h2>
        <p style={{ opacity: 0.75, marginBottom: 20, lineHeight: 1.6 }}>
          {isChunkError
            ? "Sebagian file aplikasi gagal dimuat — biasanya karena koneksi lambat atau terputus. Progres belajarmu tersimpan di perangkat ini dan tidak hilang."
            : "Maaf, ada yang tidak beres. Progres belajarmu tersimpan di perangkat ini dan tidak hilang."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            className="btn primary"
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Coba lagi
          </button>
          <button
            onClick={() => (window.location.href = "/v2")}
            className="btn ghost"
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Kembali ke Beranda
          </button>
        </div>
        {isChunkError && (
          <p style={{ opacity: 0.5, fontSize: 13, marginTop: 16 }}>
            Tips: jika sering gagal, coba koneksi yang lebih stabil atau muat ulang halaman.
          </p>
        )}
      </div>
    </div>
  );
}
