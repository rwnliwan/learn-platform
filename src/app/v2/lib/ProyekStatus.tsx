"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* Status + CTA kartu Proyek Terpandu: membaca progres dari /api/progress
   (sumber yang sama seperti Panel Fokus). Gagal baca → CTA default. */
export default function ProyekStatus({ slug, base = "/v2/learn" }: { slug: string; base?: string }) {
  const [done, setDone] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("progress"))))
      .then((j) => {
        if (!alive) return;
        const rows: Array<{ lesson_slug?: string }> = j?.completed ?? [];
        setDone(rows.some((r) => r.lesson_slug === slug));
      })
      .catch(() => {
        if (alive) setDone(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const href = `${base}/${slug}`;
  if (done) {
    return (
      <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
        <span className="btn" aria-disabled="true" style={{ pointerEvents: "none" }}>
          Selesai ✓
        </span>
        <Link className="btn ghost" href={href}>
          Buka lagi
        </Link>
      </span>
    );
  }
  return (
    <Link className="btn primary" href={href}>
      {done === false ? "Mulai proyek" : "Buka proyek"}
    </Link>
  );
}
