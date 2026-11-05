"use client";

import { useMemo, useState } from "react";
import Tex from "@/components/Tex";
import "./poles.css";

/**
 * VisualBab3 — playground ketaksamaan Cantelli satu sisi (Bab 3, "What Is Performance?").
 *
 *   P(R ≤ −L) ≤ 1 / (1 + (L + SR)²)
 *
 * Dua slider (L dan SR) → batas atas dihitung live di client.
 * Verifikasi: L=2, SR=3 → 1/(1+25) = 1/26 ≈ 3,8%.
 */

/** Format angka gaya Indonesia: koma desimal, tanpa nol buntut. */
function fmtID(x: number, desimal = 2): string {
  return x
    .toFixed(desimal)
    .replace(/\.?0+$/, "")
    .replace(".", ",");
}

/** Versi KaTeX dari fmtID: koma desimal dibungkus {,} agar tidak ada spasi tipis. */
function fmtTex(x: number, desimal = 2): string {
  return fmtID(x, desimal).replace(",", "{,}");
}

export default function VisualBab3() {
  const [L, setL] = useState(2);
  const [SR, setSR] = useState(1);

  const batas = useMemo(() => 1 / (1 + (L + SR) * (L + SR)), [L, SR]);
  const persen = useMemo(() => (batas * 100).toFixed(1).replace(".", ","), [batas]);

  const latex = `P(R \\leq -${fmtTex(L)}) \\leq \\frac{1}{1+(${fmtTex(L)} + ${fmtTex(
    SR
  )})^2} \\approx ${fmtTex(batas * 100, 1)}\\%`;

  return (
    <figure className="bk-visual" aria-label="Playground ketaksamaan Cantelli">
      <div className="bk-fcard bk-cantelli-formula">
        <Tex block math="P(R \leq -L) \leq \frac{1}{1+(L + SR)^2}" />
        <p className="bk-cantelli-desc">
          Batas atas peluang return jatuh <strong>di bawah −L</strong> — hanya dari
          dua angka: ambang kerugian <em>L</em> dan Sharpe ratio <em>SR</em>.
        </p>
      </div>

      <div className="bk-sliders">
        <label className="bk-slider-row">
          <span className="bk-slider-label">
            Ambang kerugian <Tex math="L" />
            <span className="bk-slider-val">{fmtID(L)}σ</span>
          </span>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.5}
            value={L}
            onChange={(e) => setL(parseFloat(e.target.value))}
            aria-label="Ambang kerugian L (0,5 sampai 4)"
          />
        </label>
        <label className="bk-slider-row">
          <span className="bk-slider-label">
            Sharpe ratio <Tex math="SR" />
            <span className="bk-slider-val">{fmtID(SR)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={3}
            step={0.25}
            value={SR}
            onChange={(e) => setSR(parseFloat(e.target.value))}
            aria-label="Sharpe ratio SR (0 sampai 3)"
          />
        </label>
      </div>

      <div className="bk-cantelli-hasil" aria-live="polite">
        <div className="bk-cantelli-angka">{persen}%</div>
        <div className="bk-cantelli-sub">
          batas atas peluang return &lt; −{fmtID(L)}σ untuk L={fmtID(L)} dan SR=
          {fmtID(SR)}
        </div>
      </div>

      <div className="bk-fcard bk-cantelli-substitusi">
        <Tex block math={latex} />
      </div>

      <figcaption className="bk-ilustrasi">
        Coba geser: Sharpe ratio lebih tinggi → ekor kiri menyusut cepat, karena
        penyebut memuat <Tex math="(L+SR)^2" />. Inilah intuisi kuantitatif “kualitas
        return menekan risiko rugi besar”.
      </figcaption>
    </figure>
  );
}
