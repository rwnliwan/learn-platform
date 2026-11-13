#!/usr/bin/env python3
"""QA Learn — cek koma desimal di span kode lesson (baru, 2026-11-13).

Latar: kelas kesalahan (h) ronde fix DeepSeek M9 — hint lab M9.3 memakai
`np.quantile(RETURNS[t-250:t], 0,05)`: koma desimal di kode Python adalah
"0, 05" = dua argumen / syntax error bila learner menyalinnya. Instans
sekelasnya juga ditemukan di pj-aml-monitoring.ts (body note
`min(1, fan_in/10) * 0,5 + ...`) dan wqb16-decay-sensitivity.ts
(prose lab `x = [3,0, 1,0, ...]` — padahal starter/solution memakai
`[3.0, 1.0, ...]`); ketiganya diperbaiki di ronde yang sama.

Aturan: span backtick yang tampak seperti KODE dan memuat pola desimal
koma yang tak ambigu:
  (1) argumen pemanggilan fungsi "0,0x": `nama_fungsi(..., 0,05, ...)`
      (argumen shape `randn(4,2)` dan pemisah list TIDAK kena)
  (2) setelah operator aritmetika: `* 0,5` / `/ 0,5` (`=` tidak masuk:
      rumus "R = 0,40 ± 0,05" dan nilai string pemeriksa ikut kena)
  (3) elemen list float ".0" gaya Indonesia "N,0, " di dalam [...]
      (`[3,0, 1,0, ...]`; list integer `[2,0,1,2,...]` dan `[4,5,5]`
      TIDAK kena)
Dilewati: markup SVG, notasi KaTeX, notasi matematika `·`/`±`, komentar
`# ...` (koma desimal di komentar Indonesia tidak dieksekusi), teks di
dalam string literal, dan koma pemisah di dalam [...] atau {...}.

Jalankan: python3 qa-learn/qa_lab_hints.py
Keluar 0 = lolos; 1 = ada koma desimal di span kode.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src/app/v2/content"

SPAN_RE = re.compile(r"`([^`]+)`")
LATEX_MARK = re.compile(r"\\(frac|text|cdots|times|sqrt|sum|left|right)|_\{|\\^")
STRING_RE = re.compile(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'')
# (1) panggilan fungsi dengan desimal koma "0,0x" di argumennya
# (mis. `np.quantile(..., 0,05)`). Bentuk "0,0x" dipilih karena argumen
# shape seperti `randn(4,2)` dan pemisah list `[6,12,24,36]` TIDAK
# memakai nol di depan pecahan — "4,2" dan "6,12" bukan desimal.
CALL_ARG = re.compile(r"[A-Za-z_][\w.]*\(\s*[^()]*\d,0\d")
# (2) operator aritmetika diikuti desimal koma (`* 0,5`, `/ 0,5`).
# `=` SENGAJA tidak masuk: rumus matematika ("R = 0,40 ± 0,05") dan
# nilai string pemeriksa ("= 0,79") ikut kena bila `=` dipakai.
OP_DECIMAL = re.compile(r"[*\/]\s*\d,\d")
# (3) elemen list float ".0" gaya Indonesia, ditulis "N,0, " (koma +
# spasi sesudahnya) — mis. `[3,0, 1,0, ...]`. List integer
# `[2,0,1,2,...]` (tanpa spasi) dan `[4,5,5]` TIDAK kena.
LIST_FLOAT = re.compile(r"\d,0,\s")


def _inside_brackets(code: str, start: int) -> bool:
    r"""True bila posisi start berada di dalam [...] atau {...} yang belum
    tertutup — di sana koma adalah pemisah elemen / kuantifier regex
    (`[6,12,24,36]`, `d{8,11}`), bukan desimal."""
    for open_c, close_c in (("[", "]"), ("{", "}")):
        o = code.rfind(open_c, 0, start)
        if o != -1 and code.find(close_c, o, start) == -1:
            return True
    return False


def _real_matches(span: str) -> list[str]:
    """Koma desimal yang BENAR-BENAR di kode (bukan notasi matematika
    `·`/`±`/KaTeX, bukan komentar `# ...`, bukan markup SVG, bukan teks
    di dalam string literal f-string/JSON, bukan pemisah di dalam
    [...] atau {...})."""
    if LATEX_MARK.search(span) or "·" in span or "±" in span:
        return []
    # hapus komentar `# ...` per baris, lalu hapus string literal
    code = "\n".join(line.split("#", 1)[0] for line in span.split("\n"))
    code = STRING_RE.sub('""', code)
    out = []
    for pat in (CALL_ARG, OP_DECIMAL, LIST_FLOAT):
        for m in pat.finditer(code):
            if pat is LIST_FLOAT:
                # (3) hanya berlaku DI DALAM [...] — di luar kurung,
                # "N,0, " bisa jadi prose ("skor 3,0, 5,0 dari 10").
                if not _inside_brackets(code, m.start()):
                    continue
            elif _inside_brackets(code, m.start()):
                continue
            out.append(m.group(0))
    return out


def main() -> int:
    bad = []
    for path in sorted(CONTENT.glob("*.ts")):
        text = path.read_text(encoding="utf-8")
        for m in SPAN_RE.finditer(text):
            span = m.group(1)
            # span markup (SVG dkk.) dilewati: koma di koordinat SVG
            # ("points='10,20'") adalah sintaks yang sah, bukan desimal.
            if span.lstrip().startswith("<"):
                continue
            if _real_matches(span):
                lineno = text[:m.start()].count("\n") + 1
                bad.append(f"{path.name}:{lineno}: {span[:120]!r}")
    if bad:
        print(f"FAIL — {len(bad)} span kode berkoma desimal:")
        for b in bad:
            print("  " + b)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
