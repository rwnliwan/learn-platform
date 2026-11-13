#!/usr/bin/env python3
"""Fill G2 cross-ref (M8.1 validation-design) di M8.4 — 1 paragraf + 1 kuis.

Konteks: fill G2 utama sudah di M8.1 (langkah "validation-design"), tetapi
sub-item brief "Singgung kembali di M8.4 (1 paragraf + 1 kuis)" belum
diterapkan oleh fill_m8_gap_4.py. Skrip ini menutup sub-item itu di langkah
"jebakan" M8.4 (tempat yang alami: test reuse adalah jebakan ke-6 challenger
menang di test tapi kalah di live) + 1 kuis di checkpoint M8.4.

Tidak ada angka baru: 6.000 / 0,10 sudah kanonis. TS + mirror .md.
Pola: pasangan (old, new, expected_count); file TIDAK ditulis bila satu
pasangan meleset. Dry-run dulu, lalu run.
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TS = REPO / "src/app/v2/content/mlf-m84-deployment-shadow-canary-champion.ts"
MD = REPO / "content/mlf-m84-deployment-shadow-canary-champion.md"

G2_PARAGRAPH = (
    "Keenam, PEMAKAIAN ULANG TEST (test reuse [M8.1]): test 6.000 yang sama "
    "sudah dipakai MEMILIH empat kali — threshold 0,10 [M6.4], pemenang model "
    "[M6.5], verdict validasi [M8.1], dan challenger ini [M8.4]. Setiap "
    "pemakaian memilih mengikis kejujuran test: challenger yang «menang» pada "
    "test yang sudah mengenalnya mungkin hanya menang karena test itu sudah "
    "dipakai memilih sebelumnya. Penangkalnya ditulis di M8.1 dan berlaku "
    "penuh di sini: sebelum menyatakan challenger menang, bandingkan ia pada "
    "split validasi yang SEGAR atau nested CV [M6.2], dan tulis di laporan "
    "bahwa test 6.000 sudah dipakai memilih sebelumnya. Validator yang "
    "menemukan kemenangan challenger di test yang dipakai ulang tanpa catatan "
    "menulisnya sebagai TEMUAN — sama seperti ia menulis leakage sebagai temuan."
)

G2_QUIZ = """        {
          q: "Challenger LR dipilih berdasarkan test 6.000 yang sama yang sudah dipakai memilih threshold 0,10 [M6.4], membandingkan model [M6.5], dan memvalidasi [M8.1]. Apa yang harus dilakukan validator sebelum menyatakan challenger menang?",
          options: [
            { text: "Bandingkan challenger pada split validasi yang segar atau nested CV [M6.2], dan tulis di laporan bahwa test 6.000 sudah dipakai memilih sebelumnya", why: "Benar: test final dipakai SATU KALI untuk vonis akhir; sesudah itu ia referensi, bukan test yang segar. Kemenangan pada test yang dipakai memilih empat kali adalah kemenangan atas test yang sudah dikenalnya — validator yang menemukannya tanpa catatan menulisnya sebagai TEMUAN [M8.1].", correct: true },
            { text: "Tidak ada — test 6.000 adalah test resmi lesson ini, jadi kemenangan di atasnya sah apa pun riwayat pemakaiannya", why: "Salah: test yang sudah dipakai memilih threshold, model, dan verdict bukan lagi test yang segar — yang dipilih adalah yang kebetulan bagus di test itu. «Test resmi» bukan alasan untuk mengabaikan riwayat pemakaian [M8.1]." },
            { text: "Belah lagi test 6.000 secara acak menjadi dua, pilih belahan yang angkanya paling bagus untuk challenger, dan laporkan belahan itu", why: "Salah: memilih belahan karena angkanya bagus adalah selection yang sama dengan baju baru — split yang dipilih karena kebetulan adalah split yang dipilih karena kebetulan [M8.1]." },
            { text: "Pakai ulang test 6.000 tanpa catatan — riwayat pemakaian test adalah detail administrasi, bukan bukti", why: "Salah: riwayat pemakaian test adalah BAGIAN dari bukti — tanpa catatan itu, pembaca laporan tidak tahu bahwa kemenangan challenger diukur pada test yang sudah dipakai memilihnya tiga kali sebelumnya [M8.1]." },
          ],
        },
"""

TS_REPLACEMENTS = [
    # 1. Hitungan jebakan 5 -> 6 (paragraf pembuka langkah jebakan).
    (
        "Ada lima cara challenger yang «menang di test» kalah di live",
        "Ada enam cara challenger yang «menang di test» kalah di live",
        1,
    ),
    # 2. Paragraf baru Keenam setelah paragraf "Nilai:" langkah jebakan.
    (
        "«sederhana = aman» dilawan dengan tujuh gate (langkah 6). Jebakan bukan nasib — ia kegagalan protokol yang namanya sudah diketahui.\",",
        "«sederhana = aman» dilawan dengan tujuh gate (langkah 6). Jebakan bukan nasib — ia kegagalan protokol yang namanya sudah diketahui.\",\n        \"" + G2_PARAGRAPH + "\",",
        1,
    ),
    # 3. Item (6) di checklist Mitigasi langkah jebakan.
    (
        "Satu «tidak» = challenger belum siap canary.\",",
        "(6) apakah challenger ini dipilih dari test 6.000 yang sama yang sudah dipakai memilih threshold, model, dan verdict validasi? Bila ya, apakah ia sudah dibandingkan pada split yang segar atau nested CV [M6.2] — dan apakah pemakaian ulang test itu dicatat di laporan? [M8.1] Satu «tidak» = challenger belum siap canary.\",",
        1,
    ),
    # 4. Rangkuman checkpoint (prose panjang): tambah jebakan ke-6.
    (
        "Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah, «sederhana = aman». Mini-case: TIDAK NAIK",
        "Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah, «sederhana = aman», pemakaian ulang test [M8.1]. Mini-case: TIDAK NAIK",
        1,
    ),
    # 5. Summary lesson: tambah jebakan ke-6.
    (
        "Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah (ROC-AUC ≠ profit), «sederhana = aman» — tiap jebakan punya penangkal di lesson ini.",
        "Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah (ROC-AUC ≠ profit), «sederhana = aman», pemakaian ulang test [M8.1] — tiap jebakan punya penangkal di lesson ini.",
        1,
    ),
    # 6. Kuis baru G2 setelah kuis G9 (kuis terakhir checkpoint).
    (
        "            { text: \"Superiority — LR menang kesederhanaan, dan kesederhanaan adalah sumbu superiority\", why: \"Salah: superiority diukur pada tujuh gate (profit, bad rate, kalibrasi, disagreement, monitoring, fairness, dua periode) — bukan pada kesederhanaan. LR yang mudah dijelaskan tetap merugikan NT$6.391.000.\" },\n          ],\n        },\n      ],",
        "            { text: \"Superiority — LR menang kesederhanaan, dan kesederhanaan adalah sumbu superiority\", why: \"Salah: superiority diukur pada tujuh gate (profit, bad rate, kalibrasi, disagreement, monitoring, fairness, dua periode) — bukan pada kesederhanaan. LR yang mudah dijelaskan tetap merugikan NT$6.391.000.\" },\n          ],\n        },\n" + G2_QUIZ + "      ],",
        1,
    ),
]

MD_REPLACEMENTS = [
    # 1. Hitungan jebakan 5 -> 6 + trap keenam di paragraf jebakan (.md ringkas).
    (
        "Ada lima cara challenger yang «menang di test» kalah di live.",
        "Ada enam cara challenger yang «menang di test» kalah di live.",
        1,
    ),
    (
        "«SEDERHANA = AMAN»:** LR mudah dijelaskan, cepat, stabil — dan tetap kalah NT$6.391.000.",
        "«SEDERHANA = AMAN»:** LR mudah dijelaskan, cepat, stabil — dan tetap kalah NT$6.391.000. **Keenam, PEMAKAIAN ULANG TEST (test reuse [M8.1]):** test 6.000 yang sama sudah dipakai memilih empat kali — threshold 0,10 [M6.4], pemenang model [M6.5], verdict validasi [M8.1], dan challenger ini [M8.4]. Sebelum menyatakan challenger menang, bandingkan ia pada split validasi yang segar atau nested CV [M6.2], dan catat pemakaian ulang test itu di laporan.",
        1,
    ),
    # 2. Penangkal keenam di paragraf "Nilai:" (.md).
    (
        "«sederhana = aman» dilawan dengan tujuh gate.",
        "«sederhana = aman» dilawan dengan tujuh gate; pemakaian ulang test dilawan dengan split validasi yang segar atau nested CV [M6.2] + catatan pemakaian test [M8.1].",
        1,
    ),
    # 3. Baris rangkuman jebakan (.md).
    (
        "- Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah (ROC-AUC ≠ profit), «sederhana = aman» — tiap jebakan punya penangkal di lesson ini.",
        "- Jebakan: selection [M6.5], kalibrasi, populasi, metrik yang salah (ROC-AUC ≠ profit), «sederhana = aman», pemakaian ulang test [M8.1] — tiap jebakan punya penangkal di lesson ini.",
        1,
    ),
]


def apply(path: Path, replacements, dry: bool) -> bool:
    text = path.read_text(encoding="utf-8")
    ok = True
    for old, new, expected in replacements:
        n = text.count(old)
        if n != expected:
            print(f"  MISS {path.name}: {n} != {expected} :: {old[:70]!r}")
            ok = False
        elif not dry:
            text = text.replace(old, new)
    if ok and not dry:
        path.write_text(text, encoding="utf-8")
    return ok


def main() -> int:
    dry = "--dry" in sys.argv
    print(("DRY-RUN" if dry else "RUN") + " fill_m8_gap_2b (G2 cross-ref M8.4)")
    ok_ts = apply(TS, TS_REPLACEMENTS, dry)
    ok_md = apply(MD, MD_REPLACEMENTS, dry)
    print(f"TS: {'OK' if ok_ts else 'FAIL'} ({len(TS_REPLACEMENTS)} replacements)")
    print(f"MD: {'OK' if ok_md else 'FAIL'} ({len(MD_REPLACEMENTS)} replacements)")
    return 0 if (ok_ts and ok_md) else 1


if __name__ == "__main__":
    raise SystemExit(main())
