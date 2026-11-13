#!/usr/bin/env python3
"""Sweep "± sd" M6.2/M6.5 (Learn v2 MLF) — 13 Nov 2026, batch ronde fix M8.

Aturan scope (keputusan Chief):
- YANG DIGANTI: penyajian angka "mean ± sd antar-fold" (mis. 0,7858 ± 0,0068)
  -> "mean (sd antar-fold 0,0068)".
- YANG DIPERTAHANKAN: judul langkah "Membaca mean ± sd", peta lesson,
  pengajaran generik tentang band mean ± sd sebagai alat baca, rumus CI
  dengan SE (0,7858 ± 1,96 × 0,0030 — SE, BUKAN sd), rentang ±2 sd binomial,
  band lab [0,7781; 0,7899] (band deskriptif yang didefinisikan lab), dan
  distraktor kuis yang MENGAJARKAN kesalahan beserta why-nya yang benar.
- M6.2:627 distraktor SENGAJA DIROMBAK (bukan dihapus): "mean 0,7858 ± 0,0068"
  -> "mean 0,7858 dengan ketidakpastian 0,0068" agar fixture must-not
  repo-wide bisa ditambahkan tanpa false-positive.
- chapters.ts / lessonMeta / cardData diregenerasi koordinator deploy
  (build-content.py + gen-lesson-meta + gen-card-data); skrip ini TIDAK
  menyentuh file generated.

Cara pakai:
    python3 qa-learn/fix_m6_pm_sd.py --dry
    python3 qa-learn/fix_m6_pm_sd.py
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def apply(path, pairs, dry):
    p = REPO / path
    text = p.read_text()
    ok = True
    for old, new, expect in pairs:
        n = text.count(old)
        if n != expect:
            print(f"  FAIL {path}: expect {expect}x found {n}x :: {old[:100]!r}")
            ok = False
            continue
        text = text.replace(old, new)
    if not ok:
        return False
    if not dry:
        p.write_text(text)
    print(f"  OK {path}: {len(pairs)} replacements applied")
    return True


M62 = "src/app/v2/content/mlf-m62-cross-validation-nested-cv.ts"
M62_PAIRS = [
    # :56 — kualifikasi: "jujur tentang ketidakpastian" -> goyangan SATU skor fold.
    ("Baik atau buruk: mean ± sd bagus karena jujur tentang ketidakpastian — satu angka mean tanpa sd menyembunyikan goyangan.",
     "Baik atau buruk: mean beserta sd antar-fold-nya bagus karena jujur tentang goyangan SATU skor fold — bukan tentang ketidakpastian mean; satu angka mean tanpa sd menyembunyikan goyangan.", 1),
    # :57 — instruksi pelaporan.
    ("Mitigasi: laporkan SELALU mean ± sd (dan K-nya), jangan pernah mean saja.",
     "Mitigasi: laporkan SELALU mean beserta sd antar-fold-nya (dan K-nya), jangan pernah mean saja.", 1),
    # :76 — pelaporan mean + sd + skor per-fold.
    ("Baik atau buruk: melaporkan mean ± sd beserta skor per-fold itu bagus — pembaca bisa melihat sendiri rentang 0,7782–0,7974 dan menilai goyangannya.",
     "Baik atau buruk: melaporkan mean beserta sd antar-fold-nya dan skor per-fold itu bagus — pembaca bisa melihat sendiri rentang 0,7782–0,7974 dan menilai goyangannya.", 1),
    # :546 — rangkuman: dua penyajian angka.
    ("Mean ± sd dibaca berdampingan: GBM 0,7840 ± 0,0059 (band [0,7781; 0,7899]) vs LR 0,7560 ± 0,0056 (band [0,7504; 0,7616]) — band tidak bersinggungan, GBM lebih baik dengan jelas; sd antar-fold bukan ketidakpastian mean.",
     "Mean beserta sd antar-fold-nya dibaca berdampingan: GBM 0,7840 (sd antar-fold 0,0059; band [0,7781; 0,7899]) vs LR 0,7560 (sd antar-fold 0,0056; band [0,7504; 0,7616]) — band tidak bersinggungan, GBM lebih baik dengan jelas; sd antar-fold bukan ketidakpastian mean.", 1),
    ("Nested CV (outer 5 / inner 3, grid 18 konfigurasi, 275 kali latih) memberi estimasi JUJUR untuk prosedur tuning: GBM 0,7858 ± 0,0068 — LEBIH TINGGI dari single-split 0,7823 (+0,0035) dan hanya 0,0018 di atas CV biasa 0,7840;",
     "Nested CV (outer 5 / inner 3, grid 18 konfigurasi, 275 kali latih) memberi estimasi JUJUR untuk prosedur tuning: GBM 0,7858 (sd antar-fold 0,0068) — LEBIH TINGGI dari single-split 0,7823 (+0,0035) dan hanya 0,0018 di atas CV biasa 0,7840;", 1),
    # :553 — kuis: soal.
    ("LR pada data UCI: 5-fold stratified CV memberi mean ROC-AUC 0,7560 ± 0,0056. Apa bacaan yang benar?",
     "LR pada data UCI: 5-fold stratified CV memberi mean ROC-AUC 0,7560 (sd antar-fold 0,0056). Apa bacaan yang benar?", 1),
    # :627 — distraktor SENGAJA dirombak (string "±" dihapus, makna salah dipertahankan).
    ("sd 0,0068 adalah ketidakpastian mean — jadi mean 0,7858 ± 0,0068",
     "sd 0,0068 adalah ketidakpastian mean — jadi mean 0,7858 dengan ketidakpastian 0,0068", 1),
    # :646/:647 — summary.
    ("Mean ± sd: GBM 0,7840 ± 0,0059 (band [0,7781; 0,7899]) vs LR 0,7560 ± 0,0056 (band [0,7504; 0,7616]) — band tidak bersinggungan; sd antar-fold bukan ketidakpastian mean.",
     "Mean beserta sd antar-fold-nya: GBM 0,7840 (sd antar-fold 0,0059; band [0,7781; 0,7899]) vs LR 0,7560 (sd antar-fold 0,0056; band [0,7504; 0,7616]) — band tidak bersinggungan; sd antar-fold bukan ketidakpastian mean.", 1),
    ("Nested CV (outer 5 / inner 3, 18 konfigurasi, 275 kali latih): GBM 0,7858 ± 0,0068 — estimasi JUJUR prosedur tuning, LEBIH TINGGI dari single-split 0,7823 (+0,0035), hanya +0,0018 atas CV biasa.",
     "Nested CV (outer 5 / inner 3, 18 konfigurasi, 275 kali latih): GBM 0,7858 (sd antar-fold 0,0068) — estimasi JUJUR prosedur tuning, LEBIH TINGGI dari single-split 0,7823 (+0,0035), hanya +0,0018 atas CV biasa.", 1),
]

M65 = "src/app/v2/content/mlf-m65-automl-selection-bias.ts"
M65_PAIRS = [
    # :210 — dua penyajian angka.
    ("Di protokol adil (langkah 8), GBM tertala 0,7858 ± 0,0068 vs GBM default 0,7840 ± 0,0059: selisihnya 0,0018, sementara simpangan baku antar-fold-nya 0,0068",
     "Di protokol adil (langkah 8), GBM tertala 0,7858 (sd antar-fold 0,0068) vs GBM default 0,7840 (sd antar-fold 0,0059): selisihnya 0,0018, sementara simpangan baku antar-fold-nya 0,0068", 1),
    # :228
    ("Di sini, nested CV 5-fold (inner 3-fold grid 18 konfigurasi) memberi GBM tertala 0,7858 ± 0,0068 — dan bukti bahwa seleksi itu sendiri tidak stabil:",
     "Di sini, nested CV 5-fold (inner 3-fold grid 18 konfigurasi) memberi GBM tertala 0,7858 (sd antar-fold 0,0068) — dan bukti bahwa seleksi itu sendiri tidak stabil:", 1),
    # :229 — tiga penyajian angka.
    ("tiga model dinilai dengan protokol yang sama [notebook] — LR tertala (nested CV) 0,7560 ± 0,0056 (outer fold: 0,7635; 0,7476; 0,7600; 0,7523; 0,7568); GBM default (tanpa tuning, 5-fold CV biasa sudah tak-bias karena tidak ada seleksi) 0,7840 ± 0,0059 (fold: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808); GBM tertala (nested CV) 0,7858 ± 0,0068 (outer fold: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799).",
     "tiga model dinilai dengan protokol yang sama [notebook] — LR tertala (nested CV) 0,7560 (sd antar-fold 0,0056) (outer fold: 0,7635; 0,7476; 0,7600; 0,7523; 0,7568); GBM default (tanpa tuning, 5-fold CV biasa sudah tak-bias karena tidak ada seleksi) 0,7840 (sd antar-fold 0,0059) (fold: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808); GBM tertala (nested CV) 0,7858 (sd antar-fold 0,0068) (outer fold: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799).", 1),
    # :305 — tiga penyajian angka.
    ("Pakai skor nested CV (langkah 8), bukan skor test tunggal dan bukan skor CV pemenang: LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068.",
     "Pakai skor nested CV (langkah 8), bukan skor test tunggal dan bukan skor CV pemenang: LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068).", 1),
    # :307
    ("Pemenang yang jujur (nested CV): GBM tertala, 0,7858 ± 0,0068 — kalimat lengkapnya adalah:",
     "Pemenang yang jujur (nested CV): GBM tertala, 0,7858 (sd antar-fold 0,0068) — kalimat lengkapnya adalah:", 1),
    # :308
    ("dan apa yang dilaporkan (0,7858 ± 0,0068, bukan 0,7865).",
     "dan apa yang dilaporkan (0,7858 (sd antar-fold 0,0068), bukan 0,7865).", 1),
    # :320
    ("(9) skor final tercatat dengan labelnya — nested 0,7858 ± 0,0068 sebagai performa, CV 0,7865 dan test 0,7823 sebagai konteks.",
     "(9) skor final tercatat dengan labelnya — nested 0,7858 (sd antar-fold 0,0068) sebagai performa, CV 0,7865 dan test 0,7823 sebagai konteks.", 1),
    # :596
    ("pemenang jujur menurut nested CV adalah GBM tertala 0,7858 ± 0,0068 — BUKAN menurut skor test tunggal.",
     "pemenang jujur menurut nested CV adalah GBM tertala 0,7858 (sd antar-fold 0,0068) — BUKAN menurut skor test tunggal.", 1),
    # :691 — rangkuman: tiga penyajian + pemenang jujur.
    ("Protokol adil: nested CV — LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068; konfigurasi terbaik BERGANTI tiap outer fold; test terkunci; satu metrik utama (ROC-AUC). Pemenang jujur: GBM tertala, 0,7858 ± 0,0068 — DENGAN CATATAN keunggulannya atas default tidak signifikan dan tidak penting, jadi GBM default sama sahnya bila kesederhanaan dihitung.",
     "Protokol adil: nested CV — LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068); konfigurasi terbaik BERGANTI tiap outer fold; test terkunci; satu metrik utama (ROC-AUC). Pemenang jujur: GBM tertala, 0,7858 (sd antar-fold 0,0068) — DENGAN CATATAN keunggulannya atas default tidak signifikan dan tidak penting, jadi GBM default sama sahnya bila kesederhanaan dihitung.", 1),
    # :725 — kuis: soal.
    ("Protokol adil (nested CV) [notebook]: LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068. Siapa «pemenang jujur», dan apa catatannya?",
     "Protokol adil (nested CV) [notebook]: LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068). Siapa «pemenang jujur», dan apa catatannya?", 1),
    # :803/:804 — summary.
    ("Protokol adil: nested CV — LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068; konfigurasi terbaik berganti tiap outer fold; test terkunci; satu metrik utama (ROC-AUC).",
     "Protokol adil: nested CV — LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068); konfigurasi terbaik berganti tiap outer fold; test terkunci; satu metrik utama (ROC-AUC).", 1),
    ("Pemenang jujur: GBM tertala, 0,7858 ± 0,0068 — dengan catatan keunggulannya atas default tidak signifikan dan tidak penting; GBM default sama sahnya bila kesederhanaan dihitung. Jangan laporkan 0,7865 sebagai performa.",
     "Pemenang jujur: GBM tertala, 0,7858 (sd antar-fold 0,0068) — dengan catatan keunggulannya atas default tidak signifikan dan tidak penting; GBM default sama sahnya bila kesederhanaan dihitung. Jangan laporkan 0,7865 sebagai performa.", 1),
]

MD62 = "content/mlf-m62-cross-validation-nested-cv.md"
MD62_PAIRS = [
    # :57 — kualifikasi.
    ("**Baik/buruk:** mean ± sd bagus karena jujur tentang ketidakpastian.",
     "**Baik/buruk:** mean beserta sd antar-fold-nya bagus karena jujur tentang goyangan SATU skor fold — bukan tentang ketidakpastian mean.", 1),
    # :59 — instruksi pelaporan.
    ("**Mitigasi:** laporkan SELALU mean ± sd (dan K-nya), jangan pernah mean saja.",
     "**Mitigasi:** laporkan SELALU mean beserta sd antar-fold-nya (dan K-nya), jangan pernah mean saja.", 1),
    # :203 — rangkuman.
    ("- Mean ± sd: GBM 0,7840 ± 0,0059 (band [0,7781; 0,7899]) vs LR 0,7560 ± 0,0056 (band [0,7504; 0,7616]) — band tidak bersinggungan; sd antar-fold bukan ketidakpastian mean.",
     "- Mean beserta sd antar-fold-nya: GBM 0,7840 (sd antar-fold 0,0059; band [0,7781; 0,7899]) vs LR 0,7560 (sd antar-fold 0,0056; band [0,7504; 0,7616]) — band tidak bersinggungan; sd antar-fold bukan ketidakpastian mean.", 1),
    # :205 — rangkuman nested.
    ("- Nested CV (outer 5 / inner 3, 18 konfigurasi, 275 kali latih): GBM 0,7858 ± 0,0068 — estimasi JUJUR prosedur tuning, LEBIH TINGGI dari single-split 0,7823 (+0,0035), hanya +0,0018 atas CV biasa.",
     "- Nested CV (outer 5 / inner 3, 18 konfigurasi, 275 kali latih): GBM 0,7858 (sd antar-fold 0,0068) — estimasi JUJUR prosedur tuning, LEBIH TINGGI dari single-split 0,7823 (+0,0035), hanya +0,0018 atas CV biasa.", 1),
]

MD65 = "content/mlf-m65-automl-selection-bias.md"
MD65_PAIRS = [
    # :93
    ("**Nilai [notebook]:** GBM tertala 0,7858 ± 0,0068 vs GBM default 0,7840 ± 0,0059: selisih 0,0018, sementara simpangan baku antar-fold 0,0068",
     "**Nilai [notebook]:** GBM tertala 0,7858 (sd antar-fold 0,0068) vs GBM default 0,7840 (sd antar-fold 0,0059): selisih 0,0018, sementara simpangan baku antar-fold 0,0068", 1),
    # :107 — tiga penyajian angka.
    ("**Nilai [notebook]:** LR tertala (nested CV) 0,7560 ± 0,0056 (outer fold: 0,7635; 0,7476; 0,7600; 0,7523; 0,7568); GBM default (5-fold CV biasa, tanpa tuning sudah tak-bias) 0,7840 ± 0,0059 (fold: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808); GBM tertala (nested CV) 0,7858 ± 0,0068 (outer fold: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799).",
     "**Nilai [notebook]:** LR tertala (nested CV) 0,7560 (sd antar-fold 0,0056) (outer fold: 0,7635; 0,7476; 0,7600; 0,7523; 0,7568); GBM default (5-fold CV biasa, tanpa tuning sudah tak-bias) 0,7840 (sd antar-fold 0,0059) (fold: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808); GBM tertala (nested CV) 0,7858 (sd antar-fold 0,0068) (outer fold: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799).", 1),
    # :129
    ("**Langkah A — ranking yang adil.** Skor nested CV: LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068.",
     "**Langkah A — ranking yang adil.** Skor nested CV: LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068).", 1),
    # :133
    ("**Langkah C — putuskan dengan jujur.** Pemenang yang jujur (nested CV): GBM tertala, 0,7858 ± 0,0068 — kalimat lengkapnya:",
     "**Langkah C — putuskan dengan jujur.** Pemenang yang jujur (nested CV): GBM tertala, 0,7858 (sd antar-fold 0,0068) — kalimat lengkapnya:", 1),
    # :186
    ("- Protokol adil: nested CV — LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068; konfigurasi terbaik berganti tiap outer fold; test terkunci; satu metrik utama (ROC-AUC).",
     "- Protokol adil: nested CV — LR tertala 0,7560 (sd antar-fold 0,0056); GBM default 0,7840 (sd antar-fold 0,0059); GBM tertala 0,7858 (sd antar-fold 0,0068); konfigurasi terbaik berganti tiap outer fold; test terkunci; satu metrik utama (ROC-AUC).", 1),
    # :187
    ("- Pemenang jujur: GBM tertala, 0,7858 ± 0,0068 — dengan catatan keunggulannya atas default tidak signifikan dan tidak penting; GBM default sama sahnya bila kesederhanaan dihitung. Jangan laporkan 0,7865 sebagai performa.",
     "- Pemenang jujur: GBM tertala, 0,7858 (sd antar-fold 0,0068) — dengan catatan keunggulannya atas default tidak signifikan dan tidak penting; GBM default sama sahnya bila kesederhanaan dihitung. Jangan laporkan 0,7865 sebagai performa.", 1),
]


def main():
    ap = argparse.ArgumentParser(description="Sweep '± sd' M6.2/M6.5 (TS + .md).")
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    dry = args.dry
    total = 0
    total += apply(M62, M62_PAIRS, dry)
    total += apply(M65, M65_PAIRS, dry)
    total += apply(MD62, MD62_PAIRS, dry)
    total += apply(MD65, MD65_PAIRS, dry)
    print(f"\nTOTAL pasangan terapkan: {total}" + (" (DRY-RUN, tidak ada file diubah)" if dry else ""))


if __name__ == "__main__":
    main()
