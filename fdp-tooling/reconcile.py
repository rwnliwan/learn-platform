#!/usr/bin/env python3
"""reconcile.py — checker script-vs-benchmark untuk track Financial Data Pipeline.

Membandingkan output pipeline (CSV) dengan benchmark terverifikasi builder,
dengan 5 cek eksplisit (desain FDP §4):
  C1 angka level-1 vs benchmark: EKSAK (setelah normalisasi satuan)
  C2 rasio terhitung vs benchmark: ±0,5 pp (percentage point)
  C3 konsistensi internal output script (neraca balance, aritmetika)
  C4 provenance: tiap angka wajib bawa sumber
  C5 jebakan satuan: bila C1 gagal dengan rasio kelipatan 1000 yang bersih,
     vonis menyebut "KETIDAKCOCOKAN SATUAN" secara eksplisit.

Format input pipeline (CSV): emiten,periode,pos,nilai,satuan,sumber
Format benchmark (CSV):      emiten,periode,pos,nilai,satuan,sumber_filing,halaman

Keluar: exit 0 = LULUS, exit 1 = GAGAL. Opsi --out menulis laporan_rekonsiliasi.md.
"""

import argparse
import csv
import math
import sys
from collections import defaultdict
from decimal import Decimal, InvalidOperation

# Faktor konversi ke Rupiah penuh.
UNIT_FACTOR = {
    "Rp": 1,
    "Rp-ribu": 1_000,
    "Rp-juta": 1_000_000,
    "Rp-miliar": 1_000_000_000,
    "persen": None,  # rasio: tidak dikonversi, dibandingkan langsung (pp)
}

# Aturan konsistensi internal C3: (nama_cek, target, [(pos, tanda), ...])
# tanda +1 = ditambah, -1 = dikurang. Semua dalam satuan yang sama.
CONSISTENCY_RULES = {
    "KLBF": [
        ("neraca balance: total_aset = lancar + tidak_lancar",
         "total_aset", [("total_aset_lancar", +1), ("total_aset_tidak_lancar", +1)]),
        ("laba_bruto = penjualan_neto − beban_pokok_penjualan",
         "laba_bruto", [("penjualan_neto", +1), ("beban_pokok_penjualan", -1)]),
    ],
    "BBRI": [
        ("nii = pendapatan_bunga − beban_bunga",
         "nii", [("pendapatan_bunga", +1), ("beban_bunga", -1)]),
    ],
    "BBCA": [
        ("nii = pendapatan_bunga − beban_bunga",
         "nii", [("pendapatan_bunga", +1), ("beban_bunga", -1)]),
        ("kredit_gross = kredit_konvensional + pembiayaan_syariah",
         "kredit_gross", [("kredit_konvensional", +1), ("pembiayaan_syariah", +1)]),
        ("total_dpk = giro + tabungan + deposito",
         "total_dpk", [("giro", +1), ("tabungan", +1), ("deposito", +1)]),
    ],
}

RATIO_TOL_PP = 0.5  # C2: ±0,5 percentage point


def load_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def to_base(nilai, satuan):
    """Normalisasi nilai ke Rupiah penuh memakai Decimal (eksak, anti float).
    Return None bila satuan tak dikenal."""
    if satuan not in UNIT_FACTOR:
        return None
    try:
        v = Decimal(str(nilai))
    except InvalidOperation:
        return None
    factor = UNIT_FACTOR[satuan]
    if factor is None:  # persen
        return v
    return v * factor


def looks_like_unit_mismatch(script_val, bench_val):
    """Rasio bersih kelipatan 1000 -> sangat mungkin salah satuan."""
    if bench_val == 0 or script_val == 0:
        return False
    ratio = script_val / bench_val
    for k in (3, 6, 9, -3, -6, -9):
        target = Decimal(10) ** k
        if abs(ratio - target) / target < Decimal("1e-9"):
            return True
    return False


def main():
    ap = argparse.ArgumentParser(description="Checker script-vs-benchmark FDP")
    ap.add_argument("--benchmark", required=True)
    ap.add_argument("--input", required=True, help="CSV output pipeline")
    ap.add_argument("--emiten", default=None)
    ap.add_argument("--periode", default=None)
    ap.add_argument("--out", default=None, help="tulis laporan_rekonsiliasi.md")
    args = ap.parse_args()

    bench = load_csv(args.benchmark)
    data = load_csv(args.input)

    # Tentukan emiten/periode dari input bila unik.
    pairs = {(r["emiten"], r["periode"]) for r in data}
    if len(pairs) != 1:
        print(f"GAGAL: input harus memuat tepat 1 pasangan emiten/periode, "
              f"ditemukan {len(pairs)}: {sorted(pairs)}")
        return 1
    emiten, periode = pairs.pop()
    if args.emiten and args.emiten != emiten:
        print(f"GAGAL: --emiten {args.emiten} tidak cocok dengan input {emiten}")
        return 1

    bmap = {(r["emiten"], r["periode"], r["pos"]): r for r in bench
            if r["emiten"] == emiten and r["periode"] == periode}
    if not bmap:
        print(f"GAGAL: tidak ada benchmark untuk {emiten} {periode}")
        return 1

    smap = {(r["emiten"], r["periode"], r["pos"]): r for r in data}
    lines = [f"# Laporan Rekonsiliasi — {emiten} {periode}", ""]
    fails = []

    # ---------- C4: provenance ----------
    prov_ok, prov_bad = 0, []
    for key, r in smap.items():
        if (r.get("sumber") or "").strip():
            prov_ok += 1
        else:
            prov_bad.append(r["pos"])
    if prov_bad:
        fails.append(f"C4 provenance: {len(prov_bad)} angka tanpa sumber: "
                     f"{', '.join(prov_bad)}")
    lines.append(f"- C4 provenance: {prov_ok} ber-sumber"
                 + (f", GAGAL: {', '.join(prov_bad)}" if prov_bad else " ✓"))

    # ---------- C1 + C2: bandingkan per pos ----------
    lines.append("")
    lines.append("| pos | script | benchmark | Δ | status |")
    lines.append("|---|---|---|---|---|")
    for key in sorted(bmap):
        pos = key[2]
        b = bmap[key]
        s = smap.get(key)
        if s is None:
            fails.append(f"C1: pos '{pos}' tidak ada di output script")
            lines.append(f"| {pos} | — | {b['nilai']} {b['satuan']} | — | "
                         f"❌ HILANG |")
            continue
        bv = to_base(b["nilai"], b["satuan"])
        sv = to_base(s["nilai"], s["satuan"])
        if bv is None or sv is None:
            fails.append(f"C1: satuan tak dikenal untuk '{pos}' "
                         f"(script: {s['satuan']}, benchmark: {b['satuan']})")
            lines.append(f"| {pos} | {s['nilai']} {s['satuan']} | "
                         f"{b['nilai']} {b['satuan']} | — | ❌ SATUAN TAK DIKENAL |")
            continue
        if pos.startswith("rasio:"):
            # C2: ±0,5 pp
            delta = sv - bv
            ok = abs(delta) <= RATIO_TOL_PP
            status = "✓" if ok else "❌"
            if not ok:
                fails.append(f"C2 rasio '{pos}': selisih {delta:+.2f} pp "
                             f"(batas ±{RATIO_TOL_PP} pp)")
            lines.append(f"| {pos} | {sv:.2f} | {bv:.2f} | {delta:+.2f} pp | {status} |")
        else:
            # C1: eksak setelah normalisasi satuan
            ok = (sv == bv)
            status = "✓" if ok else "❌"
            if not ok:
                if looks_like_unit_mismatch(sv, bv):
                    fails.append(
                        f"C1 '{pos}': {sv:,.0f} vs {bv:,.0f} — "
                        f"kemungkinan KETIDAKCOCOKAN SATUAN "
                        f"(script: {s['satuan']}, benchmark: {b['satuan']}; "
                        f"cek konversi satuan sebelum vonis angka salah)")
                else:
                    fails.append(f"C1 '{pos}': {sv:,.0f} vs {bv:,.0f} "
                                 f"(Δ {sv - bv:+,.0f})")
            lines.append(f"| {pos} | {sv:,.0f} | {bv:,.0f} | "
                         f"{sv - bv:+,.0f} | {status} |")

    # ---------- C3: konsistensi internal ----------
    lines.append("")
    lines.append("## C3 — Konsistensi internal")
    # normalisasi semua angka script ke Rp penuh untuk aritmetika
    sval = {}
    for key, r in smap.items():
        v = to_base(r["nilai"], r["satuan"])
        if v is not None:
            sval[r["pos"]] = v
    for rule_name, target, parts in CONSISTENCY_RULES.get(emiten, []):
        needed = [target] + [p for p, _ in parts]
        if not all(p in sval for p in needed):
            hilang = [p for p in needed if p not in sval]
            lines.append(f"- {rule_name}: DILEWATI (pos tak ada: "
                         f"{', '.join(hilang)})")
            continue
        rhs = sum(sign * sval[p] for p, sign in parts)
        diff = sval[target] - rhs
        ok = abs(diff) <= 1
        lines.append(f"- {rule_name}: Δ {diff:+,.0f} "
                     f"{'✓' if ok else '❌'}")
        if not ok:
            fails.append(f"C3 {rule_name}: selisih {diff:+,.0f}")

    # ---------- Vonis ----------
    lines.append("")
    if fails:
        lines.append("## Vonis: GAGAL ❌")
        lines.append("")
        for f_ in fails:
            lines.append(f"- {f_}")
        lines.append("")
        lines.append("Diagnosis cepat: bila pesan menyebut KETIDAKCOCOKAN SATUAN, "
                     "cek kolom `satuan` dan konversi (Rp vs Rp-juta vs Rp-ribu). "
                     "Bila C2 gagal, cek definisi rasio (rata-rata vs akhir). "
                     "Bila C3 gagal, cek restatement/`filed` terbaru.")
        verdict, code = "GAGAL", 1
    else:
        lines.append("## Vonis: LULUS ✓")
        verdict, code = "LULUS", 0

    report = "\n".join(lines)
    print(report)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(report + "\n")
        print(f"\nLaporan ditulis ke {args.out}")
    print(f"\n== {verdict} ==")
    return code


if __name__ == "__main__":
    sys.exit(main())
