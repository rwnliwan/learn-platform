"use client";

import { useState } from "react";
import Tex from "@/components/Tex";
import { RichInline } from "./rich";
import "./poles.css";

/**
 * RumusSection — blok rumus baku Bedah Buku (Poles Gelombang 1).
 *
 * Bentuk data (FINAL, ditulis worker data paralel):
 *   BukuRumus { id, judul, latex, variabel: [{simbol, arti}],
 *               langkah: string[], hasil, jebakan? }
 * Catatan: `latex`/`simbol` TANPA pembungkus $; string langkah/hasil/jebakan
 * boleh mengandung $...$ inline (dirender via <RichInline/>).
 */

export interface BukuRumusVariabel {
  simbol: string;
  arti: string;
}

export interface BukuRumus {
  id: string;
  judul: string;
  latex: string;
  variabel: BukuRumusVariabel[];
  langkah: string[];
  hasil: string;
  jebakan?: string;
}

function RumusCard({ rumus }: { rumus: BukuRumus }) {
  const n = rumus.langkah.length;
  const [idx, setIdx] = useState(0);
  const clamp = (v: number) => Math.max(0, Math.min(n - 1, v));

  return (
    <section className="bk-rumus" aria-label={rumus.judul}>
      <h3 className="bk-rumus-judul">{rumus.judul}</h3>

      {/* Rumus utama — display KaTeX */}
      <div className="bk-fcard bk-rumus-utama">
        <Tex block math={rumus.latex} />
      </div>

      {/* Legenda variabel */}
      {rumus.variabel.length > 0 && (
        <dl className="bk-varlist">
          {rumus.variabel.map((v, i) => (
            <div key={i} className="bk-varlist-row">
              <dt className="bk-varlist-simbol">
                <Tex math={v.simbol} />
              </dt>
              <dd className="bk-varlist-arti">
                <RichInline text={v.arti} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Stepper pengerjaan langkah-demi-langkah */}
      {n > 0 && (
        <div className="bk-stepper">
          <div className="bk-stepper-head">
            <span className="bk-stepper-label">Pengerjaan contoh</span>
            <span className="bk-stepper-count" aria-live="polite">
              Langkah {idx + 1}/{n}
            </span>
          </div>
          <div className="bk-stepper-body" key={idx}>
            <RichInline text={rumus.langkah[idx]} />
          </div>
          <div className="bk-stepper-dots" aria-hidden="true">
            {rumus.langkah.map((_, d) => (
              <button
                key={d}
                type="button"
                tabIndex={-1}
                className={`bk-stepper-dot${d === idx ? " is-active" : ""}${
                  d < idx ? " is-done" : ""
                }`}
                onClick={() => setIdx(d)}
                aria-label={`Ke langkah ${d + 1}`}
              />
            ))}
          </div>
          <div className="bk-stepper-nav">
            <button
              type="button"
              className="bkp-btn"
              disabled={idx === 0}
              onClick={() => setIdx((v) => clamp(v - 1))}
            >
              ← Sebelumnya
            </button>
            <button
              type="button"
              className="bkp-btn bkp-btn-primary"
              disabled={idx === n - 1}
              onClick={() => setIdx((v) => clamp(v + 1))}
            >
              Langkah berikutnya →
            </button>
          </div>
        </div>
      )}

      {/* Hasil akhir — callout menonjol */}
      <div className="bk-fcard bk-hasil" role="note" aria-label="Hasil akhir">
        <span className="bk-hasil-tag">Hasil</span>
        <RichInline text={rumus.hasil} />
      </div>

      {/* Jebakan — callout peringatan (opsional) */}
      {rumus.jebakan && (
        <div className="bk-fcard bk-jebakan" role="note" aria-label="Jebakan">
          <span className="bk-jebakan-tag">⚠ Jebakan</span>
          <RichInline text={rumus.jebakan} />
        </div>
      )}
    </section>
  );
}

export default function RumusSection({ rumus }: { rumus: BukuRumus[] }) {
  if (!rumus || rumus.length === 0) return null;
  return (
    <div className="bk-rumus-list">
      {rumus.map((r) => (
        <RumusCard key={r.id} rumus={r} />
      ))}
    </div>
  );
}
