#!/usr/bin/env python3
"""QA Learn — guard klaim absolut / heuristik sebagai aturan universal (GG-7).

Latar (2026-11-09, ronde 8): ≈25 dari 50 should-fix R8 adalah klaim
absolut / heuristik yang disajikan sebagai aturan universal — kelas ini
muncul di TIAP ronde fix dan tidak pernah dikunci guard yang memindai
frasa absolut.

KELAS vs STRING (aturan Septian 2026-11-09 00:53) — JUJUR:
- Bagian A (daftar terlarang) mengunci KELAS "frasa absolut yang SUDAH
  PERNAH dikoreksi" — daftarnya tumbuh tiap ronde; frasa itu tidak boleh
  muncul kembali di lesson MANA PUN. KETERBATASAN: varian baru dengan kata
  berbeda (mis. "sepenuhnya", "jujur", "paling murah") TIDAK tertangkap
  otomatis. MITIGASI: (1) daftar ini disertakan ke prompt review ronde
  berikut agar reviewer memeriksa frasa absolut; (2) Bagian C mencetak
  sensus frasa absolut di semua lesson tiap run.
- Bagian B (aturan struktural) mengunci KELAS secara umum, bukan string:
  setiap penyebutan teorema impossibility WAJIB disertai kualifikasi
  pengecualiannya di sekitarnya (berlaku untuk SEMUA lesson, bukan hanya
  hd13). Bila suatu lesson baru menulis teorema yang sama tanpa
  kualifikasi, guard ini gagal — itulah kunci kelasnya.
- Bagian C (sensus) hanya melaporkan hitungan pola absolut di semua
  lesson; tidak pernah menggagalkan run (terlalu banyak pemakaian sah
  seperti "selalu laporkan" — butuh penilaian manusia).

Jalankan: python3 qa_absolute_claims.py
Keluar 0 = lolos; 1 = ada frasa terlarang / teorema tanpa kualifikasi.
"""
import re
import re
import sys
from pathlib import Path

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"


def _decode(raw: str) -> str:
    # File lesson menyimpan non-ASCII sebagai escape \uXXXX; frasa
    # terlarang ditulis dengan karakter aslinya — decode dulu supaya
    # daftar terlarang benar-benar bisa menangkap (sebelumnya needle
    # ber-aksen seperti "ES_α ≥ VaR_α" mati: tak pernah cocok).
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda m: chr(int(m.group(1), 16)), raw)

# --- A. Frasa absolut yang sudah dikoreksi di R8 (tidak boleh muncul lagi) ---
FORBIDDEN = [
    # a14
    "Mean selalu tertarik ke arah ekor",
    "jangan percaya VaR normal",
    # a15
    "Yang dijamin hanya: 90% data berada di bawahnya",
    "pasti terkontaminasi",
    "tidak ada masking effect",
    # a16
    "Kausalitasnya nol",
    "paling jujur menghadapi nilai kembar",
    # b14
    "justru pasti dimasuki dari status lain",
    # b16
    "Maksimum selalu jadi salah satu dari tiga bentuk",
    "Normal meremehkan secara sistematis",
    # cr17a
    "arus kas operasi harus ≥ 80% laba bersih secara konsisten",
    # cr19
    "standar global SR 11-7",
    # mr5 / mr6
    "Selalu benar: ES_α ≥ VaR_α",
    # aml3
    "plus keluarga dan kolega dekatnya",
    "dua sumber independen = EDD",
    # mle15
    "XGBoost mengalahkan neural network 9 dari 10 kali (dan 50x lebih cepat",
    # aai14
    "compaction di 80% budget",
    # aie14
    "hampir gratis, hanya retrieve tambahan",
    "DIBUANG, diganti dengan hasil web search",
    # llmops14
    "400 adalah satu-satunya error yang",
    # hd13
    "90% masalah fairness lahir di definisi label",
    "tidak bisa dipenuhi bersamaan — kecuali model sempurna atau acak",
    # bi13
    "satu-satunya cara melihat setiap CpG",
    "peak yang lolos hampir pasti nyata",
    # mlf3 / a35 — F4 DeepSeek R1 (2026-11-12): Brier rendah disamakan
    # dengan probabilitas jujur/terkalibrasi. Brier mencampur reliability +
    # resolution; Brier rendah TIDAK membuktikan kalibrasi.
    "jadi lebih terkalibrasi",
    "GBM lebih terkalibrasi",
    "Mana yang lebih terkalibrasi?",
    "Brier rendah = probabilitas jujur",
    "Brier sendiri sudah bisa dibandingkan — kecil lebih baik",
    "probabilitas jujur (Brier rendah)",
    # biz13
    "turunkan ambang auto-jawab untuk bucket itu",
    "Baru layak beli",
    # pm-a3 / mk14
    "menggandakan harga jual",
]

# Frasa yang BOLEH muncul hanya bila langsung diikuti kualifikasi
# (dalam 120 karakter sesudahnya) — klaim absolut yang sudah dikoreksi
# dengan kualifikasi eksplisit bukan lagi klaim absolut. Tanpa
# kualifikasi, frasa ini tetap FAIL seperti daftar FORBIDDEN.
QUALIFIED = {
    # cr17a: "Laba = opini, kas = fakta" lolos hanya sebagai pengingat
    # yang mengakui kas pun bisa dimanipulasi timing-nya.
    "Laba = opini, kas = fakta": [
        "sebagai pengingat", "bukan hukum", "bisa dimanipulasi",
    ],
}

# --- C. Pola sensus (dilaporkan, tidak menggagalkan) ---
CENSUS_PATTERNS = {
    "selalu": r"\bselalu\b",
    "tidak pernah": r"\btidak pernah\b",
    "pasti": r"\bpasti\b",
    "satu-satunya": r"\bsatu-satunya\b",
    "harus": r"\bharus\b",
    "wajib": r"\bwajib\b",
    "mustahil/tidak mungkin": r"\b(mustahil|tidak mungkin)\b",
    "tanpa kecuali": r"\btanpa kecuali\b",
    "hanya ... yang bisa": r"\bhanya\b.{0,40}\byang bisa\b",
}


def main() -> int:
    fails: list[str] = []
    files = sorted(CONTENT.glob("*.ts"))

    # A. daftar terlarang di semua lesson
    for f in files:
        text = _decode(f.read_text(encoding="utf-8"))
        for phrase in FORBIDDEN:
            if phrase in text:
                print(f"FAIL {f.name} :: frasa terlarang muncul lagi: {phrase!r}")
                fails.append(f"{f.name}:{phrase[:30]}")
        for phrase, qualifiers in QUALIFIED.items():
            start = 0
            while True:
                i = text.find(phrase, start)
                if i < 0:
                    break
                window = text[i + len(phrase):i + len(phrase) + 120]
                if not any(q in window for q in qualifiers):
                    print(f"FAIL {f.name} :: frasa absolut tanpa kualifikasi: {phrase!r}")
                    fails.append(f"{f.name}:{phrase[:30]}")
                    break
                start = i + len(phrase)

    # B. aturan struktural: teorema impossibility WAJIB berkualifikasi.
    # Per FILE (bukan per kemunculan — kuis boleh merujuk teorema secara
    # singkat bila lesson itu di tempat lain menyatakan pengecualiannya):
    # file yang menyebut "tidak bisa dipenuhi bersamaan" WAJIB juga memuat
    # pengecualian ("model sempurna", "kasus khusus", atau "base rate
    # sama") di suatu tempat, dan TIDAK BOLEH memuat rumusan salah
    # "kecuali model sempurna atau acak" (Bagian A sudah melarangnya).
    for f in files:
        text = _decode(f.read_text(encoding="utf-8"))
        if "tidak bisa dipenuhi bersamaan" in text and not re.search(
                "model sempurna|kasus khusus|base rate sama", text):
            print(f"FAIL {f.name} :: teorema impossibility tanpa "
                  f"kualifikasi pengecualian di lesson ini")
            fails.append(f"{f.name}:impossibility-tanpa-kualifikasi")

    # C. sensus (laporan saja)
    census: dict[str, int] = {k: 0 for k in CENSUS_PATTERNS}
    for f in files:
        text = _decode(f.read_text(encoding="utf-8"))
        for k, pat in CENSUS_PATTERNS.items():
            census[k] += len(re.findall(pat, text))
    print("SENSUS frasa absolut (semua lesson, laporan saja): " +
          ", ".join(f"{k}={v}" for k, v in census.items()))

    print(f"QA ABSOLUTE-CLAIMS: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}"
          f" ({len(FORBIDDEN)} frasa terlarang dipindai di {len(files)} file)")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
