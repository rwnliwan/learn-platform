"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { RichInline } from "./rich";
import "./poles.css";

/**
 * VisualBab6 — diagram alur 6 langkah estimasi model fundamental
 * (Bab 6, "Fundamental Factor Models", §6.1.2).
 *
 * Alur vertikal (6 langkah tidak muat horizontal di mobile); klik kotak
 * menampilkan keterangan di bawah. Pola interaksi meniru VisualBab1.
 */

const LANGKAH = [
  {
    judul: "1 · Data ingestion",
    keterangan:
      "Terima data vendor, cek tipe/integritas — korupsi data terjadi *\"dengan probabilitas positif\"*. Cek kestabilan himpunan sekuritas, fraksi missing data, identifikasi & laporkan outlier. Bukan sekali di awal, tapi tiap periode.",
  },
  {
    judul: "2 · Estimation universe",
    keterangan:
      "Pilih himpunan aset acuan dengan tiga kriteria: **tradeability** (cukup likuid — FMP mencakup semuanya), **data quality** (price discovery: harga bisa dieksploitasi dalam ukuran non-negligible), **relevance** (overlap dengan semesta strategi — diakui buku sebagai \"art\").",
  },
  {
    judul: "3 · Winsorization",
    keterangan:
      "Potong ekor return ekstrem via robust z-score $d_{i,t}$ (threshold 5–10, trial-and-error). Peringatan keras: FMP memakai data *winsorized* sementara return portofolio sejati tidak — laporkan **semua** kasus di backtest maupun produksi, periksa satu per satu.",
  },
  {
    judul: "4 · Loadings generation",
    keterangan:
      "Transformasi karakteristik mentah menjadi $B_t$ — \"dark art\" yang sah: data terstruktur vs tak-terstruktur (transkrip earnings, filing 10-K, web scraping, transaksi kartu kredit, data lokasi). Di sinilah human expertise terbesar dibutuhkan.",
  },
  {
    judul: "5 · Cross-sectional regression",
    keterangan:
      "Tiap periode $t$: regresi WLS $r_t$ pada $B_t$ dengan bobot $\\Omega_\\epsilon^{-1}$ → output $\\hat{f}_t$ (return faktor) dan $\\hat{\\epsilon}_t$ (residual). Inilah mesin inti: $B_t$ diketahui, $f_t$ dan $\\epsilon_t$ diekstrak dari data.",
  },
  {
    judul: "6 · Time-series estimation",
    keterangan:
      "Dari deret waktu $\\hat{f}_t$: estimasi $\\hat{\\Omega}_{f,t}$ dan $\\hat{\\Omega}_{\\epsilon,t}$ — dengan tiga koreksi wajib: koreksi bias $(B^T\\Omega_\\epsilon^{-1}B)^{-1}$ + shrinkage Ledoit–Wolf, Newey–West untuk autokorelasi, dan STVU untuk shock volatilitas mendadak.",
  },
] as const;

export default function VisualBab6() {
  const [aktif, setAktif] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <figure className="bk-visual" aria-label="Diagram alur enam langkah estimasi model fundamental">
      <div className="bk-alur6">
        {LANGKAH.map((t, i) => (
          <div key={t.judul} className="bk-alur6-item">
            <motion.button
              type="button"
              className={`bk-alur-box${aktif === i ? " is-active" : ""}`}
              initial={reduce ? false : { opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.3, duration: 0.45, ease: "easeOut" }}
              onClick={() => setAktif((a) => (a === i ? null : i))}
              aria-expanded={aktif === i}
              aria-label={`${t.judul} — klik untuk keterangan`}
            >
              <span className="bk-alur-num">{i + 1}</span>
              <span className="bk-alur-judul">{t.judul}</span>
            </motion.button>
            {i < LANGKAH.length - 1 && (
              <motion.span
                className="bk-alur6-panah"
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 0.4 }}
              >
                ↓
              </motion.span>
            )}
          </div>
        ))}
      </div>

      <div className="bk-alur-ket" aria-live="polite">
        <AnimatePresence mode="wait">
          {aktif !== null ? (
            <motion.div
              key={aktif}
              className="bk-fcard bk-alur-ket-card"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <strong className="bk-alur-ket-judul">{LANGKAH[aktif].judul}</strong>
              <p>
                <RichInline text={LANGKAH[aktif].keterangan} />
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="bk-peta-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              👆 Klik tiap langkah untuk melihat penjelasannya.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <figcaption className="bk-ilustrasi">
        Pipa produksi model risiko komersial (Barra/Axioma), ujung-ke-ujung —
        dari §6.1.2 buku. Dua keputusan awal (universe & data) menentukan
        segalanya.
      </figcaption>
    </figure>
  );
}
