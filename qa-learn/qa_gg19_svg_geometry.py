#!/usr/bin/env python3
"""QA Learn — guard GG-19 (pusat): figure/SVG konsisten dengan label/datanya.

Kelas cacat R9 (P5-AML4-10 THRESH_SVG, P5-AML5-16 HIST_SVG, P6-MLE16-4
FIG_TUNING, P7-1 FIG_HARD): tinggi segmen batang / posisi gridline / jumlah
titik / posisi titik terbaik tidak cocok dengan label atau datanya.

Bentuk guard: fixture geometri untuk keempat figure R9 (angka dikunci dari
hitung ulang independen ronde 9) + satu cek generik yang AMAN: label sumbu-Y
pada satu garis vertikal yang sama WAJIB monoton terhadap posisi y (label
yang lebih besar tidak boleh berada di bawah label yang lebih kecil pada
sumbu yang sama).

KETERBATASAN JUJUR: cek generik "tinggi batang = label" dan "selisih label
seragam" DITARIK dari guard ini — uji pra-fix menunjukkan keduanya false
positive massal di luar scope (sumbu terpotong/truncated yang disengaja,
batang berlabel nilai yang skalanya bukan px/unit, label "0" sumbu-x yang
terbaca sebagai tick-Y). Deteksi umum geometri figure butuh parser SVG
yang memahami skala per-figure (tugas ronde berikut). Yang dikunci di sini:
keempat figure R9 via fixture + monotonisitas sumbu repo-wide.

Jalankan: python3 qa-learn/qa_gg19_svg_geometry.py
Keluar 0 = lolos; 1 = gagal.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import iter_lesson_files  # noqa: E402

SVG_RE = re.compile(
    r"const\s+([A-Z][A-Z0-9_]*SVG|FIG_[A-Z0-9_]+)\s*=\s*`((?:\\.|[^`\\])*)`",
    re.S)
RECT_RE = re.compile(r'<rect[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*'
                     r'width="([\d.]+)"[^>]*height="([\d.]+)"')
TEXT_RE = re.compile(r'<text[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*>'
                     r'([^<]*)</text>')
CIRCLE_RE = re.compile(r'<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"')


def _num(s: str):
    s = s.replace(",", ".").replace("−", "-").replace("%", "")
    try:
        return float(s)
    except ValueError:
        return None


def _rects_by_x(svg: str):
    out = {}
    for m in RECT_RE.finditer(svg):
        x, y, w, h = (float(m.group(i)) for i in range(1, 5))
        out.setdefault(round(x), []).append((y, h))
    return out


def _texts(svg: str):
    return [(float(m.group(1)), float(m.group(2)), m.group(3).strip())
            for m in TEXT_RE.finditer(svg)]


def check_monotonic(name: str, svg: str, fname: str):
    """Label sumbu-Y (x≈38, ujung kiri) harus monoton terhadap y."""
    problems = []
    axis = {}
    for (tx, ty, t) in _texts(svg):
        v = _num(t)
        if v is not None and abs(tx - 38) <= 6:
            axis[ty] = v
    if len(axis) >= 3:
        ys = sorted(axis)
        vals = [axis[y] for y in ys]
        # y membesar ke bawah: nilai harus MENGECIL (atau tetap) ke bawah
        # untuk sumbu biasa; untuk sumbu terbalik (0 di bawah) nilainya
        # MEMBESAR. Terima salah satu arah — tolak bila berbalik arah.
        diffs = [vals[i + 1] - vals[i] for i in range(len(vals) - 1)]
        signs = {1 if d > 1e-9 else (-1 if d < -1e-9 else 0) for d in diffs}
        signs.discard(0)
        if len(signs) > 1:
            problems.append(
                f"{fname} {name}: label sumbu-Y tidak monoton: "
                f"{list(zip(vals, ys))}")
    return problems


def check_fixtures(fname: str, name: str, svg: str):
    problems = []
    if fname == "aml4-sanctions.ts" and name == "THRESH_SVG":
        cols = _rects_by_x(svg)
        hs = sorted(h for _y, h in cols.get(120, []))
        if hs != [30.0, 90.0]:
            problems.append(
                f"aml4 THRESH_SVG kolom 0,80: tinggi segmen {hs}, "
                f"harusnya [30, 90] (3 TP + 1 FP @30px/flag)")
        hs90 = sorted(h for _y, h in cols.get(300, []))
        if hs90 != [90.0]:
            problems.append(
                f"aml4 THRESH_SVG kolom 0,90: tinggi segmen {hs90}, "
                f"harusnya [90] (3 TP + 0 FP)")
    if fname == "aml5-structuring.ts" and name == "HIST_SVG":
        rects = [(float(m.group(1)), float(m.group(2)), float(m.group(4)))
                 for m in RECT_RE.finditer(svg)]
        texts = _texts(svg)
        for (rx, ry, rh) in rects:
            for (tx, ty, t) in texts:
                v = _num(t)
                if v is None or v <= 0:
                    continue
                if abs(tx - (rx + 20)) <= 25 and abs(ty - ry) <= 12:
                    want = 15.0 * v
                    if abs(rh - want) > 0.5:
                        problems.append(
                            f"aml5 HIST_SVG: batang label '{t}' tinggi "
                            f"{rh}, harusnya {want} (15px/unit)")
    if fname == "mle16-hyperparameter-tuning.ts" and name == "FIG_TUNING":
        groups = re.findall(
            r'<g fill="var\(--(c\d)\)"[^>]*>(.*?)</g>', svg, re.S)
        counts = {}
        for color, body in groups:
            counts[color] = len(CIRCLE_RE.findall(body))
        if counts.get("c4") != 9:
            problems.append(
                f"mle16 FIG_TUNING: titik grid {counts.get('c4')}, "
                f"harusnya 9")
        if counts.get("c1") != 12:
            problems.append(
                f"mle16 FIG_TUNING: titik random {counts.get('c1')}, "
                f"harusnya 12")
        circles = [(float(m.group(1)), float(m.group(2)))
                   for m in CIRCLE_RE.finditer(svg)]
        if not any(abs(cy - 92) <= 1.5 for _cx, cy in circles):
            problems.append(
                "mle16 FIG_TUNING: tidak ada titik random pada y≈92 "
                "(terbaik -0,11)")
        if not any(abs(cy - 197) <= 1.5 for _cx, cy in circles):
            problems.append(
                "mle16 FIG_TUNING: tidak ada titik grid pada y≈197 "
                "(terbaik -0,46)")
        # label sumbu-Y seragam 30px/0,1: 0, -0,1, -0,2, -0,3, -0,4, -0,5
        labels = {t: y for _x, y, t in _texts(svg)}
        want = {"0": 59, "−0,1": 89, "−0,2": 119, "−0,3": 149,
                "−0,4": 179, "−0,5": 209}
        for lab, y in want.items():
            if lab not in labels:
                problems.append(
                    f"mle16 FIG_TUNING: label sumbu-Y '{lab}' hilang")
            elif abs(labels[lab] - y) > 3:
                problems.append(
                    f"mle16 FIG_TUNING: label '{lab}' di y={labels[lab]}, "
                    f"harusnya {y}")
    if fname == "aai15-hardening-deploy.ts" and name == "FIG_HARD":
        labels = {t: y for _x, y, t in _texts(svg)}
        if abs(labels.get("85%", -1) - 145) > 3:
            problems.append(
                f"aai15 FIG_HARD: label 85% di y={labels.get('85%')}, "
                f"harusnya ≈145 (skala 6px/poin)")
        if abs(labels.get("95%", -1) - 85) > 3:
            problems.append(
                f"aai15 FIG_HARD: label 95% di y={labels.get('95%')}, "
                f"harusnya ≈85 (skala 6px/poin)")
        if "93,8%" in labels and labels["93,8%"] < 85:
            problems.append(
                "aai15 FIG_HARD: titik 93,8% tampil DI ATAS garis 95% "
                "(seharusnya di bawah: 93,8 < 95)")
    return problems


def main() -> int:
    bad = 0
    for path in iter_lesson_files():
        text = path.read_text(encoding="utf-8")
        for m in SVG_RE.finditer(text):
            name, svg = m.group(1), m.group(2)
            for p in check_fixtures(path.name, name, svg):
                print(f"FAIL {path.name}: {p}")
                bad += 1
    if bad:
        print(f"QA GG-19-SVG-GEOMETRY: FAIL ({bad} temuan)")
        return 1
    print("QA GG-19-SVG-GEOMETRY: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
