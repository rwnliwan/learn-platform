#!/usr/bin/env python3
"""QA Learn — kunci 11 kelas kesalahan review DeepSeek M1 (guard permanen, 2026-11-12).

Latar: review DeepSeek atas Modul 1 "Machine Learning Finance" menemukan
11 kesalahan (3 must-fix, 4 should-fix, 4 nit) yang lolos dari 13 guard
spec §4 + tsc + concept gate. Perintah Septian (12 Nov 2026, 09:52):
update QA supaya celahnya makin kecil — self-learning loop.

KELAS vs STRING (aturan Septian 2026-11-09 00:53) — JUJUR:
- Bagian A (cek generik, repo-wide) mengunci KELAS secara umum:
  A1 formula median paritas-tunggal (F2), A2 band partisi berlubang (F6).
  Bila lesson baru menulis pola yang sama, guard ini gagal — itulah kunci
  kelasnya. KETERBATASAN: hanya menangkap pola yang sudah dirumuskan
  (formula median bentuk x_((n+1)/2); band yang mengklaim partisi lengkap
  dengan "< ... >"). Varian baru (mis. formula kondisional lain, band
  dengan format berbeda) TIDAK tertangkap otomatis.
- Bagian B (fixture regresi) mengunci 11 perbaikan M1 sebagai string jangkar
  — bila seseorang mengedit ulang lesson dan menghilangkan kalimat
  perbaikan, guard gagal. Ini kunci instance, bukan kelas.
- Kelas yang TIDAK bisa dikunci penuh oleh guard string (F1 qualifier
  hilang saat ringkas, F5 baseline-vs-akurasi beda set, F7 ambang hilang di
  .md, F9 definisi statistik tak disebut, F10 dua label satu skor, F11
  provenance figure tak dijelaskan, F3 dua test set dicampur): MITIGASI =
  (1) fixture Bagian B memastikan kalimat perbaikan tetap ada; (2) 11
  kelas ini ditambahkan ke prompt concept_gate.py agar review ronde
  berikut memeriksanya secara eksplisit; (3) frasa Brier yang salah
  dikunci sebagai daftar terlarang di qa_absolute_claims.py.
- Bagian B diperluas 2026-11-12 untuk L0 (review DeepSeek kedua, 25
  temuan): fixture F25-L0 (9 dari 12), F14-L0 (11 dari 16), F1-L0
  (rata-rata 3,48 juta), F8-L0 (histogram 2, 5, 3, 1, 0, 1), F13-L0
  (band power), F15-L0 (band z) + rumusan lama yang wajib hilang
  ("11 dari 12", "50 sampai 80 persen lemah", "sampai 2 biasa").
- KETERBATASAN JUJUR (L0): band F13 ("di bawah 80 persen lemah; 80
  persen ke atas memadai") dan F18/F5/F16 ditulis dalam bentuk kata,
  bukan pola "< x; x-y; > y" — checker band Bagian A (check_bands)
  tidak memvalidasinya; kontinuitasnya dikunci oleh fixture Bagian B
  + qa_learn_numbers saja. Kelas L0 lain yang tidak dikunci penuh
  oleh guard string: F3 (contoh hipotetis vs data nyata), F7 (urutan
  kode lab), F10/F11/F12 (provenansi dan klaim absolut), F17/F24
  (angka konteks), F19/F20 (kalimat penjelas) — mitigasi sama: fixture
  + prompt concept gate.
- Kelas chapters.ts (regen memangkas halaman legacy) dikunci guard
  terpisah qa_chapters_legacy.py — bukan di sini.

Jalankan dari root repo ini: python3 qa-learn/qa_mlf_deepseek_r1.py
Keluar 0 = lolos; 1 = gagal.
"""
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_TS = os.path.join(ROOT, "src/app/v2/content")
CONTENT_MD = os.path.join(ROOT, "content")

MLF_TS = {
    "mlf1": os.path.join(CONTENT_TS, "mlf1-tiga-tipe-satu-alur.ts"),
    "mlf2": os.path.join(CONTENT_TS, "mlf2-membaca-angka.ts"),
    "mlf3": os.path.join(CONTENT_TS, "mlf3-evaluasi-model.ts"),
    "mlf4": os.path.join(CONTENT_TS, "mlf4-overfitting-underfitting.ts"),
    "l01": os.path.join(CONTENT_TS, "mlf-l01-data-cleaning.ts"),
    "l02": os.path.join(CONTENT_TS, "mlf-l02-missing-data-imputasi.ts"),
    "l03": os.path.join(CONTENT_TS, "mlf-l03-distribusi-outlier.ts"),
    "l04": os.path.join(CONTENT_TS, "mlf-l04-data-wrangling.ts"),
    "l05": os.path.join(CONTENT_TS, "mlf-l05-ab-testing.ts"),
}
MLF_MD = {
    "mlf1": os.path.join(CONTENT_MD, "mlf1-tiga-tipe-satu-alur.md"),
    "mlf2": os.path.join(CONTENT_MD, "mlf2-membaca-angka.md"),
    "mlf3": os.path.join(CONTENT_MD, "mlf3-evaluasi-model.md"),
    "mlf4": os.path.join(CONTENT_MD, "mlf4-overfitting-underfitting.md"),
    "l01": os.path.join(CONTENT_MD, "mlf-l01-data-cleaning.md"),
    "l02": os.path.join(CONTENT_MD, "mlf-l02-missing-data-imputasi.md"),
    "l03": os.path.join(CONTENT_MD, "mlf-l03-distribusi-outlier.md"),
    "l04": os.path.join(CONTENT_MD, "mlf-l04-data-wrangling.md"),
    "l05": os.path.join(CONTENT_MD, "mlf-l05-ab-testing.md"),
}


def _read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


# ---------------------------------------------------------------- A1: median
# F2: formula median x_((n+1)/2) hanya benar untuk n ganjil. Bila formula
# itu muncul TANPA bentuk piecewise/cases atau rumus n genap di dekatnya,
# lesson mengajarkan definisi yang salah untuk contoh n genap.
MEDIAN_ODD_RE = re.compile(r"x_\{?\(\(n\+1\)/2\)\}?")
EVEN_HINT_RE = re.compile(r"begin\{cases\}|genap|\(x_\{\(n/2\)\}")


def check_median(paths):
    fails = []
    for path in paths:
        text = _read(path)
        for m in MEDIAN_ODD_RE.finditer(text):
            window = text[max(0, m.start() - 100):m.end() + 500]
            if not EVEN_HINT_RE.search(window):
                lineno = text[:m.start()].count("\n") + 1
                fails.append(
                    f"{os.path.basename(path)}:{lineno} :: formula median "
                    f"n-ganjil tanpa kasus n genap di dekatnya"
                )
    return fails


# ------------------------------------------------- A2: band partisi berlubang
# F6: band "< 0,02 sehat; 0,02–0,07 ringan; > 0,10 waspada" meninggalkan
# 0,07–0,10 tanpa kategori. Band yang mengklaim partisi lengkap (diawali
# batas-bawah terbuka, diakhiri batas-atas terbuka) WAJIB menutup rapat
# tanpa lubang. Band panduan baca (tanpa "<" awal) tidak dicek.
def _num(s):
    return float(s.replace(",", "."))


def _parse_band(text):
    # Unescape DULU: "&lt;"/"&gt;" mengandung ";" yang akan memecah segmen.
    text = html.unescape(text)
    out = []
    for seg in re.split(r"[;·]", text):
        seg = seg.strip()
        if not seg:
            continue
        # Notasi half-open "a ≤ X < b" HARUS dicek dulu: segmen ini mengandung
        # "< b" yang akan ditangkap pola below bila below dicek lebih dulu.
        m = re.search(r"(\d+(?:[,.]\d+)?)\s*≤\s*\S+\s*<\s*(\d+(?:[,.]\d+)?)", seg)
        if m:
            out.append(("range", _num(m.group(1)), _num(m.group(2))))
            continue
        m = re.search(r"(?:<\s*|di bawah\s+)(\d+(?:[,.]\d+)?)", seg)
        if m:
            out.append(("below", _num(m.group(1)), None))
            continue
        m = re.search(r"(?:>\s*|≥\s*|di atas\s+)(\d+(?:[,.]\d+)?)", seg)
        if m:
            out.append(("above", _num(m.group(1)), None))
            continue
        m = re.search(r"(\d+(?:[,.]\d+)?)\s*(?:–|-|sampai)\s*(\d+(?:[,.]\d+)?)", seg)
        if m:
            out.append(("range", _num(m.group(1)), _num(m.group(2))))
            continue
        m = re.search(r"(\d+(?:[,.]\d+)?)", seg)
        if m:
            out.append(("point", _num(m.group(1)), None))
    return out


def _check_band(text):
    parts = _parse_band(text)
    if not parts or parts[0][0] != "below" or parts[-1][0] != "above":
        return None  # bukan klaim partisi lengkap — tidak dicek
    if len(parts) < 3:
        return f"partisi hanya {len(parts)} segmen: {parts}"
    joints = [(parts[0][1], parts[1][1])]
    for i in range(1, len(parts) - 1):
        if parts[i][0] != "range":
            return f"segmen non-range di tengah partisi: {parts}"
        if parts[i][1] >= parts[i][2]:
            return f"range tidak naik: {parts[i]}"
        if i + 1 < len(parts) - 1:
            joints.append((parts[i][2], parts[i + 1][1]))
    joints.append((parts[-2][2], parts[-1][1]))
    for a, b in joints:
        if abs(a - b) > 1e-9:
            return f"lubang/tumpang tindih antara {a} dan {b}: {parts}"
    return "OK"


def check_bands(paths):
    fails = []
    checked = 0
    for path in paths:
        text = _read(path)
        for m in re.finditer(r"\bBand\b[^\"\n]{0,400}", text):
            res = _check_band(m.group(0))
            if res is None:
                continue
            checked += 1
            if res != "OK":
                lineno = text[:m.start()].count("\n") + 1
                fails.append(
                    f"{os.path.basename(path)}:{lineno} :: band partisi "
                    f"berlubang — {res}"
                )
    return fails, checked


# ------------------------------------------------- B: fixture regresi 11 fix
# (lesson, file, jangkar yang WAJIB ada) — kalimat perbaikan DeepSeek.
FIXTURES = [
    ("F1", "mlf3", "md", "1.420 nasabah bagus yang ditolak (false positive)"),
    ("F2", "mlf2", "ts", r"begin{cases}"),
    ("F2", "mlf2", "md", r"begin{cases}"),
    ("F3", "mlf4", "ts", "test set 60 titik"),
    ("F3", "mlf4", "ts", "test set 30 titik"),
    ("F4", "mlf3", "ts", "dicek dengan reliability diagram"),
    ("F4", "mlf3", "md", "dicek dengan reliability diagram"),
    ("F5", "mlf1", "ts", "baseline train: 0.5833"),
    ("F5", "mlf1", "ts", "0,6667"),
    ("F6", "mlf4", "ts", "perlu perhatian"),
    ("F6", "mlf4", "md", "perlu perhatian"),
    ("F7", "mlf1", "md", "|z| > 2"),
    ("F8", "mlf1", "ts", "gabungan 0–1: 7 orang"),
    ("F8", "mlf1", "md", "gabungan 0–1: 7 orang"),
    ("F9", "mlf2", "ts", "population sd (dibagi n, bukan n−1)"),
    ("F9", "mlf2", "md", "population sd (dibagi n, bukan n−1)"),
    ("F10", "mlf3", "ts", "Menurut band generik, GBM 0,7823"),
    ("F10", "mlf3", "md", "Menurut band generik, GBM 0,7823"),
    ("F11", "mlf4", "ts", "menggenerate ulang data sinus untuk tiap ukuran n"),
    ("F11", "mlf4", "md", "menggenerate ulang data sinus untuk tiap ukuran n"),
    # --- L0, review DeepSeek 2026-11-12 (25 temuan: 6 must, 8 should, 11 nit)
    ("F25-L0", "l02", "ts", "9 dari 12"),
    ("F25-L0", "l02", "md", "9 dari 12"),
    ("F25-L0", "l03", "ts", "9 dari 12"),
    ("F25-L0", "l03", "md", "9 dari 12"),
    ("F14-L0", "l03", "ts", "11 dari 16"),
    ("F14-L0", "l03", "md", "11 dari 16"),
    ("F1-L0", "l02", "ts", "rata-rata 3,48 juta"),
    ("F1-L0", "l02", "md", "rata-rata 3,48 juta"),
    ("F8-L0", "l02", "ts", "2, 5, 3, 1, 0, 1"),
    ("F13-L0", "l05", "ts", "50 sampai di bawah 80 persen lemah"),
    ("F13-L0", "l05", "md", "50 sampai di bawah 80 persen lemah"),
    ("F15-L0", "l03", "ts", "di bawah 2 biasa"),
    ("F15-L0", "l03", "md", "di bawah 2 biasa"),
]
# Rumusan lama yang WAJIB sudah hilang.
ABSENT = [
    ("F3", "mlf4", "ts", "0,113 (waspada)"),
    ("F3", "mlf4", "md", "0,113 (waspada)"),
    ("F6", "mlf4", "ts", "0,02–0,07 ringan"),
    ("F6", "mlf4", "md", "0,02–0,07 ringan"),
    # --- L0, rumusan lama review DeepSeek 2026-11-12
    ("F25-L0", "l02", "ts", "11 dari 12"),
    ("F25-L0", "l02", "md", "11 dari 12"),
    ("F25-L0", "l03", "ts", "11 dari 12"),
    ("F25-L0", "l03", "md", "11 dari 12"),
    ("F13-L0", "l05", "ts", "50 sampai 80 persen lemah"),
    ("F13-L0", "l05", "md", "50 sampai 80 persen lemah"),
    ("F15-L0", "l03", "ts", "sampai 2 biasa"),
    ("F15-L0", "l03", "md", "sampai 2 biasa"),
]


def check_fixtures():
    fails = []
    for fid, lesson, kind, anchor in FIXTURES:
        path = MLF_TS[lesson] if kind == "ts" else MLF_MD[lesson]
        if anchor not in _read(path):
            fails.append(
                f"{fid} {os.path.basename(path)} :: jangkar perbaikan "
                f"hilang: {anchor!r}"
            )
    for fid, lesson, kind, anchor in ABSENT:
        path = MLF_TS[lesson] if kind == "ts" else MLF_MD[lesson]
        if anchor in _read(path):
            fails.append(
                f"{fid} {os.path.basename(path)} :: rumusan lama masih "
                f"ada: {anchor!r}"
            )
    return fails


def main():
    fails = []
    ts_files = sorted(
        os.path.join(CONTENT_TS, f)
        for f in os.listdir(CONTENT_TS)
        if f.endswith(".ts")
    )
    md_files = sorted(
        os.path.join(CONTENT_MD, f)
        for f in os.listdir(CONTENT_MD)
        if f.endswith(".md")
    )
    fails += check_median(ts_files + md_files)
    band_fails, n_bands = check_bands(ts_files + md_files)
    fails += band_fails
    fails += check_fixtures()

    if fails:
        print("QA MLF-DEEPSEEK-R1: FAIL")
        for f in fails:
            print("  FAIL " + f)
        return 1
    print(
        f"QA MLF-DEEPSEEK-R1: ALL PASS "
        f"(median {len(ts_files) + len(md_files)} file, "
        f"{n_bands} band partisi, {len(FIXTURES)} fixture + "
        f"{len(ABSENT)} rumusan-lama dipindai)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
