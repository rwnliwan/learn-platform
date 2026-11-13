#!/usr/bin/env python3
"""QA Learn — cek sitasi M9 (baru, WAJIB, 2026-11-13).

Latar: kelas kesalahan berulang M7-M8 — angka dikutip dengan sitasi modul
yang SALAH (mis. ECE 0,0087 disitir [M7.5] padahal itu [M6.4]; PSI 0,25
disitir [M7.5] padahal itu ambang kebijakan). Guard ini memetakan angka
khas ke modul "rumah"-nya dan memeriksa setiap pasangan
"ANGKA ... [M?.?]" di 5 lesson M9 (TS + .md): modul yang disitir harus
ada di himpunan yang diizinkan untuk angka itu.

Juga memeriksa: sitasi ke lesson yang TIDAK ADA (mis. [M4.6], [M9.6]).

Jalankan: python3 qa-learn/check_m9_citations.py
Keluar 0 = lolos; 1 = ada sitasi salah modul / lesson tak dikenal.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [ROOT / f"src/app/v2/content/mlf-m9{i}-" for i in range(1, 6)]
TS = sorted(ROOT.glob("src/app/v2/content/mlf-m9*.ts"))
MD = sorted(ROOT.glob("content/mlf-m9*.md"))

# angka khas -> himpunan modul yang diizinkan (format Indonesia, koma desimal)
NUM_HOME = {
    # flagship (diajarkan M6, dipakai lintas modul)
    "0,7823": {"M6.1", "M6.2", "M6.3", "M6.4", "M8.1"},
    "0,7816": {"M6.4", "M8.1"},
    "0,7426": {"M6.1", "M6.2", "M6.4"},
    "0,5597": {"M6.1", "M6.4"},
    "0,5558": {"M6.4", "M8.1"},
    "0,5049": {"M6.1", "M6.4"},
    "0,1342": {"M6.4"},
    "0,1345": {"M6.4", "M8.1"},
    "0,1427": {"M6.1", "M6.4"},
    "0,8469": {"M6.3", "M8.1"},
    "0,0646": {"M6.3", "M8.1"},
    # M6.2 nested CV
    "0,7858": {"M6.2", "M8.1"},
    "0,0068": {"M6.2", "M8.1"},
    "0,0030": {"M6.2"},
    "0,7840": {"M6.2"},
    "0,0059": {"M6.2"},
    "0,7560": {"M6.2"},
    "0,0056": {"M6.2"},
    "0,5516": {"M6.2"},
    # M6.4 threshold economics
    "0,10": {"M6.4"},
    "0,15": {"M6.4"},
    "0,20": {"M6.4"},
    "0,50": {"M6.4"},
    "33.046.500": {"M6.4", "M8.1", "M8.4", "M8.5"},
    "8.214.000": {"M6.4", "M8.1", "M8.4", "M8.5"},
    "28,5%": {"M6.4", "M8.1", "M8.5"},
    "6,67%": {"M6.4", "M8.1", "M8.5"},
    "5.490.500": {"M6.4", "M8.5"},
    "216.500": {"M6.4", "M8.5"},
    "3.908": {"M6.4"},
    "88,05%": {"M6.4"},
    "15,96%": {"M6.4"},
    "60.254.956": {"M6.4"},
    "18.994.456": {"M6.4", "M8.5"},
    "0,0087": {"M6.4", "M8.1"},
    # M6.5 McNemar / winner's curse
    "13,1601": {"M6.5"},
    "0,0003": {"M6.5"},
    "0,5383": {"M6.5"},
    "0,3788": {"M6.5"},
    "0,0042": {"M6.5"},
    # M4.1 walk-forward
    "0,5250": {"M4.1"},
    "0,5688": {"M4.1"},
    "0,5188": {"M4.1"},
    "0,5062": {"M4.1"},
    "0,5625": {"M4.1"},
    "0,5326": {"M4.1"},
    "0,6000": {"M4.1"},
    "0,5261": {"M4.1"},
    # M4.2 VaR/ES
    "0,0286": {"M4.2", "M9.5"},
    "0,0445": {"M4.2", "M9.5"},
    "0,0479": {"M4.2", "M9.5"},
    "0,0775": {"M4.2", "M9.5"},
    "0,0328": {"M4.2", "M9.1", "M9.4"},
    "0,0410": {"M4.2", "M9.5"},
    "0,0462": {"M4.2", "M9.5"},
    "0,0528": {"M4.2", "M9.5"},
    "0,0336": {"M4.2"},
    "0,0424": {"M4.2"},
    "0,0546": {"M4.2"},
    "0,0903": {"M4.2", "M9.1"},
    "0,0196": {"M4.2", "M9.1", "M9.4"},
    # M4.3 Kupiec / EWMA / GARCH / Basel
    "0,3108": {"M4.3", "M9.3"},
    "1,0275": {"M4.3", "M9.3"},
    "0,3079": {"M4.3", "M9.3"},
    "1,0398": {"M4.3", "M9.3"},
    "0,0366": {"M4.3"},
    "0,8602": {"M4.3"},
    "0,2113": {"M4.3"},
    "0,6489": {"M4.3"},
    "0,1043": {"M4.3", "M9.5"},
    # M4.4 Black-Scholes + beta / korelasi LOG-return
    "388,03": {"M4.4"},
    "0,5665": {"M4.4"},
    "44,49": {"M4.4"},
    "43,17": {"M4.4"},
    "0,1272": {"M4.4"},  # beta BBCA vs ^GSPC (diajarkan M4.4, bukan M4.1)
    "0,361": {"M4.4"},  # korelasi LOG-return BBCA-KLBF
    "0,285": {"M4.4"},  # korelasi LOG-return BBCA-UNVR
    "0,3001": {"M4.4"},  # korelasi LOG-return KLBF-UNVR
    # M4.5 drawdown / regime / stress
    "0,4363": {"M4.5"},
    "0,1890": {"M4.5"},
    "0,4973": {"M4.5"},
    "0,5791": {"M4.5"},
    "0,4925": {"M4.5"},
    "0,3752": {"M4.5"},
    "0,2775": {"M4.5"},
    "0,0431": {"M4.5"},
    "0,0324": {"M4.5"},  # VaR95 parametrik basis LOG-return / stress M4.5
    "1,353": {"M4.5"},
    "1,0169": {"M4.5"},
    "0,0892": {"M4.5"},
    # M5 (simple returns; terima semua sub-lesson M5.x)
    "0,2445": {"M5.1", "M5.2", "M5.3", "M5.4", "M5.5"},
    "0,2570": {"M5.1", "M5.2", "M5.3", "M5.4", "M5.5"},
    "0,0796": {"M5.1", "M5.2", "M5.3", "M5.4", "M5.5"},
    "0,3449": {"M5.1", "M5.2", "M5.3", "M5.4", "M5.5"},
    "0,4251": {"M5.1", "M5.2", "M5.3", "M5.4", "M5.5"},
    "0,5014": {"M5.1", "M5.2", "M5.3", "M5.4", "M5.5"},
    "0,8540": {"M5.1"},
    "0,7221": {"M5.1"},
    "0,0590": {"M5.1"},
    "0,5523": {"M5.2"},
    "0,1903": {"M5.2"},
    "0,2966": {"M5.2"},
    "0,1406": {"M5.2", "M5.3"},
    "0,3114": {"M5.2", "M5.3"},
    "0,6122": {"M5.2"},
    # M7.1 fairness
    "0,1208": {"M7.1", "M8.1"},
    "0,0312": {"M7.1", "M8.1"},
    "0,0455": {"M7.1"},
    "0,0362": {"M7.1"},
    "0,0210": {"M7.1", "M8.1"},
    "0,8694": {"M7.1", "M7.4", "M8.1"},
    "0,869": {"M7.1", "M7.4", "M8.1"},  # bentuk bulat AIR SEX (M8.4:344)
    "0,8390": {"M7.1"},
    "0,8906": {"M7.1", "M8.5"},
    "0,3572": {"M7.1"},
    # M7.3 explainability
    "0,0626": {"M7.3"},
    "0,0314": {"M7.3"},
    "0,4946": {"M7.3"},
    # M7.4 mitigation
    "0,9999": {"M7.4"},
    "0,9211": {"M7.4"},
    "0,1058": {"M7.4"},
    "0,0965": {"M7.4"},
    "32.756.000": {"M7.4"},
    "8.504.500": {"M7.4"},
    # M7.5 monitoring / drift
    "0,0161": {"M7.5"},
    "0,0017": {"M7.5", "M8.1"},
    "0,0029": {"M7.5"},
    "0,0710": {"M7.5", "M8.3"},
    "0,0388": {"M7.5", "M8.3", "M9.3"},
    "0,0421": {"M7.5"},
    "0,7449": {"M7.5", "M9.3"},
    "0,7428": {"M7.5", "M9.3"},
    "0,8138": {"M7.5", "M9.3"},
    "0,8041": {"M7.5", "M9.3"},
    "0,8006": {"M7.5", "M9.3"},
    "0,5811": {"M7.5", "M8.5"},
    "0,1003": {"M7.5"},
    # M8.1 halves / bootstrap CI
    "0,7885": {"M8.1"},
    "0,7746": {"M8.1"},
    "0,0614": {"M8.1"},
    "0,0720": {"M8.1"},
    "0,0114": {"M8.1"},
    "0,0104": {"M8.1"},
    "0,0139": {"M8.1"},
    "0,0176": {"M8.1"},
    "1,06": {"M8.1"},
    "0,54": {"M8.1"},
    "5,47%": {"M8.1"},
    "7,85%": {"M8.1"},
    "5.575.975": {"M8.1"},
    "10.802.787": {"M8.1"},
    # M8.2 tiering
    "11.989.453": {"M8.2"},
    "424.180.000": {"M8.2"},
    "1.007.777.680": {"M8.2"},  # fill M9.5 G1: total LIMIT test (m8_tiering)
    "78.675.378": {"M8.2"},  # fill M9.5 G1: EL all test (m8_tiering)
    "42,09%": {"M8.2"},  # fill M9.5 G1: approved share (m8_tiering)
    "25.990.000": {"M8.2"},  # [turunan] dari m8_tiering: realised_loss/0,45
    "398.190.000": {"M8.2"},  # [turunan] dari m8_tiering: approved - default
    # M8.3 seed sensitivity
    "0,0069": {"M8.3"},
    "0,7787": {"M8.3"},
    "0,0028": {"M8.3"},
    # M8.4 champion-challenger
    "209,4730": {"M8.4"},
    "19,42%": {"M8.4"},
    "1.166": {"M8.4"},
    "82.155.456": {"M8.4"},
    "0,2217": {"M8.4"},
    # M8.5 threshold change
    "1.283": {"M8.5"},
    "2.723.500": {"M6.4", "M8.5"},
    "49,88%": {"M6.4", "M8.5"},
    "8,99%": {"M6.4", "M8.5"},
}

KNOWN_LESSONS = set()
for mod, lessons in {
    "M1": 4, "M2": 5, "M3": 5, "M4": 5, "M5": 5, "M6": 5, "M7": 5,
    "M8": 5, "M9": 5, "L0": 5,
}.items():
    for i in range(1, lessons + 1):
        KNOWN_LESSONS.add(f"{mod}.{i}")
KNOWN_LESSONS |= {"M6.4", "M6.2", "M6.5", "M6.1", "M6.3"}

CIT_RE = re.compile(r"\[(M\d|L0)\.(\d)\]")
NUM_RE = re.compile(r"\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+,\d+%?|\d+,\d+")
LABEL_RE = re.compile(r"\[(notebook|ilustrasi|kebijakan[^\]]*|turunan|simulasi)\]")


def check_file(path: Path) -> list[str]:
    problems = []
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    for ln, line in enumerate(lines, 1):
        for m in CIT_RE.finditer(line):
            mod, num = m.group(1), m.group(2)
            key = f"{mod}.{num}"
            if key not in KNOWN_LESSONS:
                problems.append(f"{path.name}:{ln}: sitasi ke lesson tak dikenal [{key}] :: {line.strip()[:120]}")
                continue
            # Pasangkan sitasi dengan angka terpetakan TERDEKAT SEBELUMNYA
            # (sitasi ditulis sesudah angkanya: "0,1208 (n=76) [M7.1]").
            # Syarat: jarak <= 40 karakter, tanpa batas kalimat (". ")
            # dan tanpa angka terpetakan lain di antaranya. Sitasi topik
            # ("ECE per grup [M7.1]") tidak punya angka dekat -> dilewati.
            before = line[:m.start()]
            cands = [(nm.group(0), nm.end()) for nm in NUM_RE.finditer(before)
                     if nm.group(0) in NUM_HOME]
            if not cands:
                continue
            num_tok, num_end = cands[-1]
            gap = before[num_end:]
            if len(gap) > 25 or ". " in gap:
                continue
            cited = f"{mod}.{num}"
            if cited not in NUM_HOME[num_tok]:
                problems.append(
                    f"{path.name}:{ln}: angka {num_tok} disitir [{cited}] — rumahnya "
                    f"{sorted(NUM_HOME[num_tok])} :: {line.strip()[:140]}")
    return problems


def main() -> int:
    files = TS + MD
    if not files:
        print("FAIL: tidak ada file M9 ditemukan")
        return 1
    all_problems = []
    for f in files:
        all_problems += check_file(f)
    for p in all_problems:
        print("VIOLATION:", p)
    print(f"checked {len(files)} files, {len(all_problems)} violations")
    print("PASS" if not all_problems else "FAIL")
    return 0 if not all_problems else 1


if __name__ == "__main__":
    sys.exit(main())
