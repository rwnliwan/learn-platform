#!/usr/bin/env python3
"""QA Learn — guard aturan lesson sendiri: bila lesson menyatakan sebuah
aturan, contoh di lesson itu WAJIB mematuhinya.

Latar: fix R6 di aai11 memperkenalkan 2 must-fix baru di lesson yang sama —
salah satunya karena contoh (alert τ=0,15 di langkah 4) MELANGGAR aturan
lesson itu sendiri ("evaluasi R hanya setelah state muncul ≥2×").
Guard ini mengunci aturan-aturan yang dikoreksi di R7 beserta contohnya:
aturan harus tertulis, contoh harus mematuhinya, dan klaim lama yang
melanggar aturan tidak boleh muncul kembali kecuali sebagai kalimat
koreksi yang menandainya salah.

Setiap aturan di bawah diverifikasi ke file sumber sebelum ditambahkan.
Hitung ulang contoh (R, CKPN, dst.) dilakukan di sini dari parameter
pertama, bukan disalin dari teks lesson.

Jalankan: python3 qa_lesson_rules.py
Keluar 0 = lolos; 1 = ada aturan yang dilanggar contohnya sendiri.
"""
import re
import sys
from pathlib import Path

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"


def decode_file(path: Path) -> str:
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda m: chr(int(m.group(1), 16)),
                  path.read_text(encoding="utf-8"))


def main() -> int:
    fails: list[str] = []

    def must(fname: str, text: str, rule: str, needle: str) -> None:
        if needle not in text:
            print(f"FAIL {fname} :: [{rule}] hilang: {needle!r}")
            fails.append(f"{fname}:{rule}")

    def must_not(fname: str, text: str, rule: str, needle: str) -> None:
        if needle in text:
            print(f"FAIL {fname} :: [{rule}] muncul lagi: {needle!r}")
            fails.append(f"{fname}:{rule}")

    # --- aai11: aturan "state ≥2×" -------------------------------------------
    # Contoh: state muncul di langkah 4 (pertama), 5 (ke-2), 7, 10 dari 12.
    # R di langkah 4 = 1/4 = 0,25 TIDAK boleh dievaluasi (belum ada pengulangan);
    # alert τ=0,15 jatuh di langkah 5 (R = 2/5 = 0,40). Pada trace lain,
    # pengulangan ke-2 di langkah 9 memberi R = 2/9 ≈ 0,22 > 0,15.
    t = decode_file(CONTENT / "aai11-debugging.ts")
    rule = "aai11 state ≥2×"
    must("aai11-debugging.ts", t, rule, "aturan ≥2×")
    must("aai11-debugging.ts", t, rule, "alert di langkah 5 (R = 2/5 = 0,40")
    must("aai11-debugging.ts", t, rule, "melarang alert di langkah 4")
    must("aai11-debugging.ts", t, rule, "R = 2/9 ≈ 0,22")
    assert abs(1 / 4 - 0.25) < 1e-9 and abs(2 / 5 - 0.40) < 1e-9
    assert abs(2 / 9 - 0.22) < 0.01 and abs(4 / 12 - 0.33) < 0.01
    # "alert di langkah 4" hanya boleh muncul sebagai kalimat yang MELARANGNYA
    for m in re.finditer("alert di langkah 4", t):
        ctx = t[max(0, m.start() - 40):m.start()]
        if "melarang" not in ctx:
            print(f"FAIL aai11-debugging.ts :: [{rule}] 'alert di langkah 4' "
                  f"tanpa kata 'melarang' di sekitarnya: ...{ctx[-40:]!r}")
            fails.append("aai11-debugging.ts:" + rule)
            break
    else:
        print(f"OK   aai11-debugging.ts :: [{rule}] alert langkah 5 (R=2/5=0,40); "
              f"langkah 4 dilarang; R(4)=0,25, R(9)=2/9≈0,22 terhitung ulang")

    # --- cr14a: backstop 30 hari = rebuttable presumption ---------------------
    t = decode_file(CONTENT / "cr14a-ecl-staging.ts")
    rule = "cr14a backstop rebuttable"
    must("cr14a-ecl-staging.ts", t, rule, "rebuttable presumption")
    must("cr14a-ecl-staging.ts", t, rule, "dapat dibantah")
    must("cr14a-ecl-staging.ts", t, rule, "bukan aturan mutlak")
    must("cr14a-ecl-staging.ts", t, rule, "INDIKATOR SICR yang kuat")
    must("cr14a-ecl-staging.ts", t, rule, "bukan SICR otomatis")
    print(f"OK   cr14a-ecl-staging.ts :: [{rule}] backstop dapat dibantah; "
          f"forbearance indikator kuat, bukan SICR otomatis")

    # --- b12: importance sampling WAJIB koreksi likelihood-ratio -------------
    t = decode_file(CONTENT / "b12-monte-carlo.ts")
    rule = "b12 likelihood-ratio"
    must("b12-monte-carlo.ts", t, rule, "likelihood-ratio")
    must("b12-monte-carlo.ts", t, rule, "w(x) = p(x)/q(x)")
    must("b12-monte-carlo.ts", t, rule, "BIAS")
    print(f"OK   b12-monte-carlo.ts :: [{rule}] sampling terarah tanpa koreksi "
          f"= estimator bias")

    # --- mle12: equalized odds SUDAH mencakup equal opportunity --------------
    t = decode_file(CONTENT / "mle12-fairness.ts")
    rule = "mle12 equalized odds mencakup"
    must("mle12-fairness.ts", t, rule, "SUDAH mencakup equal opportunity")
    must("mle12-fairness.ts", t, rule, "Kleinberg")
    must_not("mle12-fairness.ts", t, rule, "Pilih SATU")
    print(f"OK   mle12-fairness.ts :: [{rule}] equalized odds mencakup equal "
          f"opportunity; 'Pilih SATU' sudah hilang")

    # --- cr13: CKPN = PD × LGD × EAD (EAD ≠ cadangan) -------------------------
    t = decode_file(CONTENT / "cr13-ead-ccf.ts")
    rule = "cr13 CKPN = PD×LGD×EAD"
    must("cr13-ead-ccf.ts", t, rule, "CKPN) = PD × LGD × EAD")
    must("cr13-ead-ccf.ts", t, rule, "Rp 0,19 jt")
    must("cr13-ead-ccf.ts", t, rule, "BUKAN cadangan")
    assert abs(0.03 * 0.45 * 14_000_000 - 189_000) < 1
    print(f"OK   cr13-ead-ccf.ts :: [{rule}] tambahan CKPN 3%x45%xRp14jt = "
          f"Rp0,19jt, bukan Rp14jt")

    print(f"QA LESSON-RULES: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}"
          f" (5 aturan dipindai)")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
