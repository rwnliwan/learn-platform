"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { RichInline } from "./rich";
import "./poles.css";

/**
 * VisualBab1 — rantai alur Bab 1 ("The Map and the Territory"):
 *   Standarisasi → konsolidasi demand → biaya transaksi turun → Likuiditas naik
 *
 * Kotak muncul berurutan (stagger); klik kotak menampilkan keterangan di bawah.
 * Tanpa library baru — hanya motion (sudah terpasang di repo).
 */

const TAHAP = [
  {
    judul: "Standarisasi",
    keterangan:
      "Kontrak, satuan kuotasi, dan aturan main dibuat seragam. Instrumen yang tadinya unik dan sulit dibandingkan menjadi *fungible* — satu saham LQ45 sama dengan saham LQ45 lainnya.",
  },
  {
    judul: "Konsolidasi demand",
    keterangan:
      "Pembeli dan penjual berkumpul di satu 'peta' yang sama (satu bursa, satu order book). Order tidak lagi tersebar di belasan tempat — semuanya bertemu di satu titik.",
  },
  {
    judul: "Biaya transaksi turun",
    keterangan:
      "Saat semua order berkumpul, penyedia likuiditas bersaing ketat: **spread menyempit**, biaya eksekusi mengecil, dan dampak harga per transaksi menyusut.",
  },
  {
    judul: "Likuiditas naik",
    keterangan:
      "Hasil akhirnya: aset mudah dibeli/dijual dalam volume besar **tanpa menggerakkan harga**. Peta yang bagus (pasar yang terstandarisasi) mendekati teritorinya.",
  },
] as const;

export default function VisualBab1() {
  const [aktif, setAktif] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <figure className="bk-visual" aria-label="Rantai standarisasi menuju likuiditas">
      <div className="bk-alur">
        {TAHAP.map((t, i) => (
          <div key={t.judul} className="bk-alur-item">
            <motion.button
              type="button"
              className={`bk-alur-box${aktif === i ? " is-active" : ""}`}
              initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.45, duration: 0.5, ease: "easeOut" }}
              onClick={() => setAktif((a) => (a === i ? null : i))}
              aria-expanded={aktif === i}
              aria-label={`${t.judul} — klik untuk keterangan`}
            >
              <span className="bk-alur-num">{i + 1}</span>
              <span className="bk-alur-judul">{t.judul}</span>
            </motion.button>
            {i < TAHAP.length - 1 && (
              <motion.span
                className="bk-alur-panah"
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.45, duration: 0.4 }}
              >
                →
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
              <strong className="bk-alur-ket-judul">{TAHAP[aktif].judul}</strong>
              <RichInline text={TAHAP[aktif].keterangan} />
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="bk-peta-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              👆 Klik tiap kotak untuk melihat penjelasannya.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </figure>
  );
}
