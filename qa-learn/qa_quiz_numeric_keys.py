#!/usr/bin/env python3
"""QA Learn — guard kunci kuis numerik: jawaban benar kuis yang berupa angka
WAJIB cocok dengan hitung ulang independen.

Latar: ronde 7 menemukan kunci kuis numerik yang salah di lesson (mis.
Vasicek SD, rasio FNR) — angka yang salah di kunci kuis membuat learner
yang menghitung dengan BENAR justru dinyatakan salah. Guard ini mengambil
tiap kunci numerik dari TABEL di bawah, menghitung ulang nilainya dari
parameter pertama (bukan dari teks lesson — rumus di qa_r7_recompute.py
atau aritmetika inline dengan derivasi di komentar), lalu menegaskan
opsi yang ditandai `correct: true` pada pertanyaan itu memuat angka hasil
hitung ulang tersebut.

Hanya kuis yang kuncinya MEMANG membawa angka hasil koreksi R7 yang
masuk tabel — angka yang hanya ada di prosa/lab sudah dikunci
qa_learn_numbers.py. Setiap entri di tabel ini diverifikasi ke file
sumber sebelum ditambahkan.

Jalankan: python3 qa_quiz_numeric_keys.py
Keluar 0 = lolos; 1 = ada kunci kuis yang tidak cocok dengan hitung ulang.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_r7_recompute import vasicek_q, vasicek_sd  # noqa: E402

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"

TEXT_RE = re.compile(r'text:\s*"((?:[^"\\]|\\.)*)"', re.S)
Q_RE = re.compile(r'q:\s*"((?:[^"\\]|\\.)*)"', re.S)


def _unescape(s: str) -> str:
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace('\\"', '"').replace("\\\\", "\\").replace("\\n", "\n")


def decode_file(path: Path) -> str:
    """Teks lesson dengan escape \\uXXXX diubah ke karakter asli (untuk cari)."""
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda m: chr(int(m.group(1), 16)),
                  path.read_text(encoding="utf-8"))


def correct_option(text: str, q_sub: str) -> str:
    """Teks opsi `correct: true` pada pertanyaan yang memuat q_sub."""
    qi = text.find(q_sub)
    if qi < 0:
        raise AssertionError(f"pertanyaan tidak ditemukan: {q_sub!r}")
    ci = text.find("correct: true", qi)
    if ci < 0:
        raise AssertionError(f"tidak ada opsi correct setelah pertanyaan: {q_sub!r}")
    texts = list(TEXT_RE.finditer(text, qi, ci))
    if not texts:
        raise AssertionError(f"tidak ada opsi sebelum correct: {q_sub!r}")
    return _unescape(texts[-1].group(1))


def question_text(text: str, q_sub: str) -> str:
    """Teks pertanyaan (field `q:`) yang memuat q_sub."""
    for m in Q_RE.finditer(text):
        if q_sub in _unescape(m.group(1)):
            return _unescape(m.group(1))
    raise AssertionError(f"pertanyaan tidak ditemukan: {q_sub!r}")


def fmt_id(value: float, decimals: int) -> str:
    return f"{value:.{decimals}f}".replace(".", ",")


# (file, pertanyaan, [(nama, nilai_hitung_ulang, desimal, akhiran), ...])
# Untuk tiap entri: fmt_id(nilai, desimal) + akhiran WAJIB muncul di opsi benar.
_KV_BYTES = 2 * 40 * 40 * 128 * 16 * 1024 * 2  # rumus dari opsi lesson itu sendiri
CHECKS = [
    ("b13-vasicek.ts",
     "n=500, PD=2%, ρ=0,15. SD jumlah gagal",
     [("SD Vasicek", vasicek_sd(500, 0.02, 0.15)[0], 2, ""),
      ("SD binomial", vasicek_sd(500, 0.02, 0.15)[1], 2, "")]),
    ("mle12-fairness.ts",
     "recall 85% vs 40%",
     [("FNR 60%/15%", 60 / 15, 0, "x")]),
    ("llmops13-inference-selfhosted.ts",
     "Model 13B, batch 16, seq 1024",
     [("KV-cache GiB", _KV_BYTES / 1024 ** 3, 1, " GiB"),
      ("KV-cache GB", _KV_BYTES / 1e9, 2, "")]),
    ("aai11-debugging.ts",
     "muncul di langkah 4, 5, 7, 10 dari 12 langkah",
     [("R = 4/12", 4 / 12, 2, "")]),
    ("aai13-mcp.ts",
     "6 tool dan 4 framework",
     [("tanpa MCP 6x4", 6 * 4, 0, ""),
      ("dengan MCP 6+4", 6 + 4, 0, "")]),
]

# (file, pertanyaan, [(nama, nilai, desimal, akhiran)], [string yang TIDAK
# boleh ada di pertanyaan]) — angka yang hidup di TEKS PERTANYAAN itu sendiri.
QUESTION_CHECKS = [
    ("b13-vasicek.ts",
     "VaR 99,9% ≈ 17,6%",
     [("q99,9 PD=2% rho=15%", vasicek_q(0.02, 0.15, 0.999) * 100, 1, "%")],
     ["17,9%"]),
]


def main() -> int:
    fails: list[str] = []
    for fname, q_sub, recomps in CHECKS:
        text = decode_file(CONTENT / fname)
        try:
            opt = correct_option(text, q_sub)
        except AssertionError as e:
            print(f"FAIL {fname} :: {e}")
            fails.append(fname)
            continue
        missing = []
        vals = []
        for name, value, dec, suffix in recomps:
            want = fmt_id(value, dec) + suffix
            vals.append(f"{name}={want}")
            if want not in opt:
                missing.append(want)
        if missing:
            print(f"FAIL {fname} :: opsi benar '{opt[:90]}' kehilangan {missing} "
                  f"(hitung ulang: {', '.join(vals)})")
            fails.append(fname)
        else:
            print(f"OK   {fname} :: opsi benar memuat {vals}")
    for fname, q_sub, recomps, must_not in QUESTION_CHECKS:
        text = decode_file(CONTENT / fname)
        try:
            q = question_text(text, q_sub)
        except AssertionError as e:
            print(f"FAIL {fname} :: {e}")
            fails.append(fname)
            continue
        missing, bad, vals = [], [], []
        for name, value, dec, suffix in recomps:
            want = fmt_id(value, dec) + suffix
            vals.append(f"{name}={want}")
            if want not in q:
                missing.append(want)
        bad = [s for s in must_not if s in q]
        if missing or bad:
            print(f"FAIL {fname} :: pertanyaan '{q[:90]}' hilang {missing}, "
                  f"mengandung yang salah {bad} (hitung ulang: {', '.join(vals)})")
            fails.append(fname)
        else:
            print(f"OK   {fname} :: pertanyaan memuat {vals}")
    print(f"QA QUIZ-NUMERIC-KEYS: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}"
          f" ({len(CHECKS) + len(QUESTION_CHECKS)} kunci dipindai)")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
