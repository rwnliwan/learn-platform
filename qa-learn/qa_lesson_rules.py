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

    # --- hd13: teorema impossibility — pengecualian model sempurna (R8 M1) --
    # R7 mle12 sudah mengunci teorema yang sama; R8 menemukannya lagi di
    # hd13 dengan wording berbeda (GG-5, paling eksplisit). Kuncinya:
    # model sempurna memenuhi EO+kalibrasi tapi TETAP GAGAL demographic
    # parity bila base rate beda — jadi "kecuali model sempurna" TIDAK
    # menyelamatkan ketiganya.
    t = decode_file(CONTENT / "hd13-fairness-kesehatan.ts")
    rule = "hd13 impossibility"
    must("hd13-fairness-kesehatan.ts", t, rule,
         "kecuali model sempurna (yang memenuhi equalized odds + kalibrasi, "
         "tapi TETAP gagal demographic parity")
    must("hd13-fairness-kesehatan.ts", t, rule,
         "kecuali model sempurna.")
    must("hd13-fairness-kesehatan.ts", t, rule,
         "bukan menghapusnya dari dataset evaluasi")
    must_not("hd13-fairness-kesehatan.ts", t, rule,
             "kecuali model sempurna atau acak")
    must_not("hd13-fairness-kesehatan.ts", t, rule,
             "tanpa bisa diaudit per grup karena grupnya")
    print(f"OK   hd13-fairness-kesehatan.ts :: [{rule}] model sempurna "
          f"gagal DP; hapus fitur ≠ hapus dari evaluasi")

    # --- biz13: arah ambang auto-jawab + NLQ jangan tebak periode (R8) -----
    t = decode_file(CONTENT / "biz13-ai.ts")
    rule = "biz13 ambang auto-jawab"
    must("biz13-ai.ts", t, rule, "NAIKKAN ambang auto-jawab untuk bucket itu")
    must("biz13-ai.ts", t, rule, "menurunkan ambang justru menerima LEBIH BANYAK")
    must_not("biz13-ai.ts", t, rule, "turunkan ambang auto-jawab untuk bucket itu")
    print(f"OK   biz13-ai.ts :: [{rule}] naikkan ambang = lebih sedikit "
          f"auto-jawab")
    rule = "biz13 NLQ jangan tebak tahun"
    must("biz13-ai.ts", t, rule, "JANGAN tebak tahunnya")
    calls = re.findall(r'nlq_to_sql\("([^"]+)"\)', t)
    if not calls:
        print("FAIL biz13-ai.ts :: [biz13 NLQ jangan tebak tahun] tidak ada "
              "pemanggilan nlq_to_sql(...)")
        fails.append("biz13-ai.ts:" + rule)
    else:
        bad_calls = [c for c in calls if "2026" not in c and "september" in c.lower()]
        if bad_calls:
            print(f"FAIL biz13-ai.ts :: [{rule}] soal tanpa tahun tapi "
                  f"solusi memfilter tahun: {bad_calls}")
            fails.append("biz13-ai.ts:" + rule)
        else:
            print(f"OK   biz13-ai.ts :: [{rule}] {len(calls)} soal NLQ "
                  f"menyebut tahunnya sendiri; periode tak ditebak")

    # --- b17: ambang 95% bukan aturan universal; selisih = shrinkage ------
    t = decode_file(CONTENT / "b17-bayesian-praktis.ts")
    rule = "b17 ambang 95%"
    must("b17-bayesian-praktis.ts", t, rule, "BUKAN aturan universal")
    must("b17-bayesian-praktis.ts", t, rule,
         "mengukur besar shrinkage, bukan ketidakpastian")
    must("b17-bayesian-praktis.ts", t, rule, "kondisi regularitas")
    must_not("b17-bayesian-praktis.ts", t, rule,
             "selisihnya adalah ukuran ketidakpastianmu")
    print(f"OK   b17-bayesian-praktis.ts :: [{rule}] 95% = contoh ambang, "
          f"bukan hukum; selisih = shrinkage")

    # --- aai14: ambang budget ringkasan hilang di 5.300, bukan 4.000 -------
    t = decode_file(CONTENT / "aai14-context-engineering.ts")
    rule = "aai14 budget ringkasan"
    must("aai14-context-engineering.ts", t, rule,
         "naikkan BUDGET ke 5.300 dan lihat ringkasan hilang")
    must("aai14-context-engineering.ts", t, rule,
         "hanya jangkar yang selamat")
    must_not("aai14-context-engineering.ts", t, rule,
             "naikkan BUDGET ke 4.000 dan lihat ringkasan hilang")
    print(f"OK   aai14-context-engineering.ts :: [{rule}] ringkasan hilang "
          f"di ≥5.300; di 800 hanya jangkar")

    # --- cr19: SR 11-7 = guidance Fed/OCC AS, bukan standar global ---------
    t = decode_file(CONTENT / "cr19-validasi-model.ts")
    rule = "cr19 SR 11-7"
    must("cr19-validasi-model.ts", t, rule,
         "guidance SR 11-7 dari Fed/OCC AS")
    must_not("cr19-validasi-model.ts", t, rule, "standar global SR 11-7")
    print(f"OK   cr19-validasi-model.ts :: [{rule}] SR 11-7 = guidance AS")

    # --- cr17a: OCF ≥80% = heuristik, bukan aturan --------------------------
    t = decode_file(CONTENT / "cr17a-corporate-credit-1.ts")
    rule = "cr17a OCF heuristik"
    must("cr17a-corporate-credit-1.ts", t, rule,
         "HEURISTIK praktis (bukan aturan)")
    must_not("cr17a-corporate-credit-1.ts", t, rule,
             "harus ≥ 80% laba bersih secara konsisten")
    print(f"OK   cr17a-corporate-credit-1.ts :: [{rule}] OCF 80% = heuristik")

    # --- aie14: CRAG Incorrect tidak selalu dibuang --------------------------
    t = decode_file(CONTENT / "aie14-advanced-rag.ts")
    rule = "aie14 CRAG conditional"
    must("aie14-advanced-rag.ts", t, rule, "JANGAN langsung dibuang")
    must_not("aie14-advanced-rag.ts", t, rule, "DIBUANG, diganti web search")
    print(f"OK   aie14-advanced-rag.ts :: [{rule}] Incorrect dievaluasi dulu")

    # --- llmops14: availability rantai butuh independensi -------------------
    t = decode_file(CONTENT / "llmops14-smart-routing.ts")
    rule = "llmops14 independensi"
    must("llmops14-smart-routing.ts", t, rule,
         "dengan asumsi ketiga provider gagal secara independen")
    must_not("llmops14-smart-routing.ts", t, rule,
             "400 adalah satu-satunya error yang jujur")
    print(f"OK   llmops14-smart-routing.ts :: [{rule}] six nines bersyarat "
          f"independen")

    print(f"QA LESSON-RULES: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}"
          f" (14 aturan dipindai)")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
