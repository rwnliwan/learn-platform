// Kartu "Mulai dari Sini" di dashboard /v2 (Gelombang A).
// Client-only: membaca v2:path + progres localStorage.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./icons";
import { getLocalDone, pullServerProgress } from "./progress";
import { PATHS, getPath, pathProgress, nextStep, stepMeta } from "./paths";

export default function MulaiCard() {
  const [pathId, setPathId] = useState("fondasi");
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      setPathId(localStorage.getItem("v2:path") ?? "fondasi");
    } catch {
      /* noop */
    }
    setDone(getLocalDone());
    pullServerProgress().then((s) => setDone(new Set([...getLocalDone(), ...s])));
  }, []);

  const path = getPath(pathId) ?? PATHS[0];
  const prog = pathProgress(path, done);
  let skipped = new Set<string>();
  try {
    const raw = localStorage.getItem("v2:skipped");
    if (raw) skipped = new Set(JSON.parse(raw) as string[]);
  } catch {
    /* noop */
  }
  const next = nextStep(path, done, skipped);
  const meta = next ? stepMeta(next) : null;

  return (
    <div className="mu-card">
      <div className="mu-card-h">
        <div style={{ flex: 1 }}>
          <div className="eyebrow">Mulai dari sini</div>
          <h3 style={{ margin: "4px 0 0" }}>{path.name}</h3>
        </div>
        <span className="mu-ico">
          <Icon name="play" />
        </span>
      </div>
      <div className="bar" role="progressbar" aria-valuenow={prog.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progres ${path.name}`}>
        <i style={{ width: `${prog.pct}%` }}></i>
      </div>
      <div className="mu-prog">
        <b>{prog.done}</b>/{prog.total} langkah · {prog.pct}%
      </div>
      {meta ? (
        <p className="mu-outcome">
          Berikutnya: <b>{meta.title}</b>
        </p>
      ) : (
        <p className="mu-outcome">Jalur selesai — pilih jalur lain atau ulangi tes penempatan.</p>
      )}
      <div className="mu-actions">
        <Link className="btn ghost" href="/v2/mulai">
          Lihat jalur <Icon name="right" />
        </Link>
      </div>
    </div>
  );
}
