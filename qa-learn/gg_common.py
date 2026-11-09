#!/usr/bin/env python3
"""Helper bersama guard GG-17..GG-21 + GG-37 (ronde 9).

Fungsi: membaca file lesson .ts, mengekstrak string TAMPILAN (learner-facing)
sambil MENGECUALIKAN hal yang memang ASCII secara sah:
- kode lab (starter/solution template literal),
- field `expected` (cermin stdout Python — float negatif dicetak ASCII),
- pola regex `stdout_matches` dan nilai numerik `value:`,
- rumus LaTeX `String.raw` (tanda minus matematika),
- komentar kode `//`.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent / "learn-platform"
CONTENT = ROOT / "src" / "app" / "v2" / "content"

DISPLAY_KEYS = (
    "prose", "formulaNote", "title", "eyebrow", "body", "label", "msg",
    "q", "text", "why", "reference", "summary", "expected",
)


def unescape_ts(s: str) -> str:
    def _u(m):
        try:
            return chr(int(m.group(1), 16))
        except ValueError:
            return m.group(0)
    s = re.sub(r"\\u([0-9a-fA-F]{4})", _u, s)
    return (s.replace("\\n", "\n").replace("\\t", "\t")
             .replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\"))


def strip_code_and_patterns(text: str) -> str:
    """Buang blok kode lab, pola stdout_matches, dan rumus String.raw."""
    # starter: `...` / solution: `...` (template literal, bisa multi-baris)
    text = re.sub(r"\b(?:starter|solution):\s*`(?:\\.|[^`\\])*`",
                  "starter: ``", text, flags=re.S)
    # pola regex check
    text = re.sub(r"\bpattern:\s*\"(?:\\.|[^\"\\])*\"", 'pattern: ""', text)
    # rumus LaTeX
    text = re.sub(r"String\.raw`(?:\\.|[^`\\])*`", "String.raw``", text, flags=re.S)
    # komentar baris
    text = re.sub(r"(?m)^\s*//.*$", "", text)
    return text


def display_strings(path: Path):
    """Yield (lineno, field, value) untuk string tampilan di file lesson.

    Mencakup: isi array prose/summary, formulaNote, note body, label/msg
    check, q/text/why kuis, reference, title, eyebrow, dan konstanta SVG
    (FIG_*/HIST_SVG/THRESH_SVG/*_SVG) sebagai field 'svg'.
    `expected` SENGAJA tidak disertakan (cermin stdout ASCII — lihat modul).
    """
    text = path.read_text(encoding="utf-8")
    clean = strip_code_and_patterns(text)
    out = []
    # string literal "..." yang didahului kunci tampilan
    key_re = re.compile(
        r"\b(prose|formulaNote|title|eyebrow|body|label|msg|q|text|why|"
        r"reference|summary)\s*:\s*\"((?:\\.|[^\"\\])*)\"", re.S)
    for m in key_re.finditer(clean):
        lineno = clean[:m.start()].count("\n") + 1
        out.append((lineno, m.group(1), unescape_ts(m.group(2))))
    # item array prose: "..." tanpa kunci (elemen array) — tangkap semua
    # string "..." di dalam blok prose: [...] / summary: [...] bila belum
    # tertangkap kunci di atas. Sederhana: semua string literal di file
    # bersih yang berada di baris berisi '"' dan bukan kunci lain.
    # (Kunci di atas sudah menangkap sebagian besar; array prose tertangkap
    # lewat pola berikut.)
    arr_re = re.compile(r"(?m)^\s*\"((?:\\.|[^\"\\])*)\"\s*,?\s*$")
    seen = {(ln, f, v) for ln, f, v in out}
    for m in arr_re.finditer(clean):
        lineno = clean[:m.start()].count("\n") + 1
        item = (lineno, "prose-item", unescape_ts(m.group(1)))
        if item not in seen:
            out.append(item)
    # konstanta SVG
    svg_re = re.compile(
        r"const\s+([A-Z][A-Z0-9_]*SVG|FIG_[A-Z0-9_]+)\s*=\s*`((?:\\.|[^`\\])*)`",
        re.S)
    for m in svg_re.finditer(text):
        lineno = text[:m.start()].count("\n") + 1
        out.append((lineno, "svg:" + m.group(1), m.group(2)))
    return out


def iter_lesson_files():
    return sorted(CONTENT.glob("*.ts"))


def split_steps(text: str):
    """Pecah file menjadi step berdasarkan `id: \"...\"` di level step.

    Mengembalikan list (step_id, chunk). Chunk checkpoint ikut serta.
    """
    starts = [m for m in re.finditer(
        r"(?m)^\s*\{\s*\n\s*id:\s*\"([^\"]+)\"", text)]
    steps = []
    for i, m in enumerate(starts):
        end = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        steps.append((m.group(1), text[m.start():end]))
    return steps


WORD_NUM = {
    "Satu": 1, "Dua": 2, "Tiga": 3, "Empat": 4, "Lima": 5, "Enam": 6,
    "Tujuh": 7, "Delapan": 8, "Sembilan": 9, "Sepuluh": 10,
    "satu": 1, "dua": 2, "tiga": 3, "empat": 4, "lima": 5, "enam": 6,
    "tujuh": 7, "delapan": 8, "sembilan": 9, "sepuluh": 10,
}
ORDINALS = ["Pertama", "Kedua", "Ketiga", "Keempat", "Kelima", "Keenam",
            "Ketujuh", "Kedelapan", "Kesembilan", "Kesepuluh"]
