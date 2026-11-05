// Empty state bersama untuk fitur AI gelombang N–Q (Gelombang M).
// Ditampilkan bila AI runtime belum dikonfigurasi — menjelaskan singkat
// dan mengarahkan ke /v2/pengaturan-ai.
"use client";

import Link from "next/link";

export default function AiNotConfigured({ featureLabel }: { featureLabel: string }) {
  return (
    <div className="ai-gate">
      <p className="ai-gate-title">Fitur {featureLabel} butuh AI runtime.</p>
      <p className="ai-gate-body">
        Sambungkan provider AI-mu (base URL + API key + model) di halaman
        Pengaturan AI — key tersimpan lokal di browser ini dan hanya dikirim ke
        base URL yang kamu isi.
      </p>
      <Link className="ai-gate-link" href="/v2/pengaturan-ai">
        Buka Pengaturan AI →
      </Link>
    </div>
  );
}
