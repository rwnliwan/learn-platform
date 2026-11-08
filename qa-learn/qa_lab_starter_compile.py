#!/usr/bin/env python3
"""QA Learn — guard starter lab: starter WAJIB bisa di-compile (kelas cacat d10 R7).

Latar: ronde 7 Terra menemukan starter minicase d10 berisi escape literal
``\\\\n`` (backslash-backslash-n di sumber TS) — setelah di-unescape TS, kode
Python yang diterima learner berisi ``\\n`` literal di posisi kode (bukan di
dalam string) sehingga SyntaxError saat dijalankan. Kelas cacat ini lolos
karena guard sebelumnya hanya mengeksekusi SOLUSI (qa_lab_regression.py),
bukan starter.

Cara kerja: untuk tiap blok `code: { starter, ... }` di semua lesson, ambil
starter, unescape TS (aturan yang sama dengan runtime app), lalu isi
kekosongan yang memang dirancang untuk diisi learner — dan HANYA itu:
- `...` sendiri di baris -> `pass`; `if :` -> `if True:`; `for ...:` ->
  `for _ in ():`; assignment kosong (`nama =`, `nama =  # komentar`) ->
  `nama = 0`; operator tanpa operan (`total +=`, `p +=`) -> `+= 0`;
  argumen kosong (`round(, 2)`, `set_ylim( , )`, `key=)`, `"k": ,`) -> `0`;
  blok kosong (`def`/`for`/`if` tanpa isi) -> sisipkan `pass`.
Lalu `compile()`. SyntaxError yang tersisa = FAIL — terutama
"unexpected character after line continuation character", yaitu tanda
escape literal ``\\n`` di posisi kode (kelas d10): perbaikan itu TIDAK
pernah dilakukan guard ini; escape literal selalu FAIL.

Hanya compile, bukan eksekusi — jadi tidak butuh paket (pandas/numpy/dll),
tidak butuh seed, dan tidak flaky. Starter SQL tidak ada (lab SQL memakai
`sqlLab`, bukan `code:`); semua blok `code:` adalah Python, sama seperti
asumsi qa_lab_regression.py.

Jalankan: python3 qa_lab_starter_compile.py [--file <nama-file.ts>]
Keluar 0 = lolos; 1 = ada starter yang tidak bisa di-compile.
"""
import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_lab_regression import (  # noqa: E402
    CODE_BLOCK_RE, collect_const_strings, extract_template,
    find_matching, substitute_ts_interpolations, JSParser,
)

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"

LAB_ID_RE = re.compile(r'id:\s*"([^"]*)"')

# --- Perbaikan tekstual kekosongan yang dirancang untuk learner -------------
# Setiap pola di bawah hanya mengisi sesuatu yang KOSONG; tidak ada pola yang
# mengubah token yang sudah ada (kecuali `...` sebagai placeholder).
# PENTING: semua `\s` ditulis `[ \t]` — `\s` ikut menelan newline sehingga
# pola bisa cocok LINTAS BARIS dan merusak baris lain (pernah terjadi:
# `!` di akhir komentar + `\n` + `]` di baris berikut termakan pola
# perbandingan sehingga penutup `])` hilang).

_TEXTUAL = [
    # `for ...:` (placeholder loop) -> loop kosong yang valid
    (re.compile(r"^([ \t]*)for \.\.\.:", re.M), r"\1for _ in ():"),
    # `if :` / `elif :` / `while :` (kondisi kosong) -> True
    (re.compile(r"^([ \t]*)(if|elif|while)[ \t]*:(.*)$", re.M), r"\1\2 True:\3"),
    # kondisi kosong di comprehension: `if ]` -> `if True]`
    (re.compile(r"\bif[ \t]*([\]\)])"), r"if True\1"),
    # subskrip kosong: `rev[]` -> `rev[0]` (bukan list kosong `= []`)
    (re.compile(r"([A-Za-z0-9_\]\)])\[\]"), r"\1[0]"),
    # assignment kosong, dgn / tanpa komentar: `nama =` / `nama =  # ...`
    # Lookbehind menolak `==`, `!=`, `<=`, `>=`, `+=` dst. — `=` di sini
    # harus assignment murni (bukan perbandingan / augmented).
    (re.compile(r"^([ \t]*)(.+?)(?<![=!<>+\-*/%])=(?!=)[ \t]*(#.*)?$", re.M),
     lambda m: f"{m.group(1)}{m.group(2)} = 0"
               + (f"  {m.group(3)}" if m.group(3) else "")),
    # operator tanpa operan di ujung baris: `total +=` / `p +=` / `x -=`
    (re.compile(r"^([ \t]*)(.+?)[ \t]*([+\-*/%]=)[ \t]*(#.*)?$", re.M),
     lambda m: f"{m.group(1)}{m.group(2)} {m.group(3)} 0"
               + (f"  {m.group(4)}" if m.group(4) else "")),
    # argumen kosong: `f(, 2)` -> `f(0, 2)`; `f(a, , b)` -> `f(a, 0, b)`
    (re.compile(r"\([ \t]*,", re.M), "(0,"),
    (re.compile(r",[ \t]*,", re.M), ", 0,"),
    # `f(x=)` / `f(x=, y=)` -> `f(x=0)`
    (re.compile(r"=[ \t]*([,\)])"), r"=0\1"),
    # `set_ylim( , )` / `yerr= ,` -> isi 0
    (re.compile(r"\([ \t]*,[ \t]*\)"), "(0, 0)"),
    (re.compile(r"=[ \t]*,[ \t]*$", re.M), "= 0,"),
    # nilai dict kosong: `"k": ,` -> `"k": 0,` ; `"k": }` -> `"k": 0}`
    # (dibatasi ke baris yang memang pasangan kunci dict — bukan slice
    # seperti `x[1:]}`).
    (re.compile(r"^([ \t]*(?:\"[^\"]*\"|'[^']*'|\w+)[ \t]*):[ \t]*,[ \t]*$", re.M),
     r"\1: 0,"),
    (re.compile(r"^([ \t]*(?:\"[^\"]*\"|'[^']*'|\w+)[ \t]*):[ \t]*\}", re.M),
     r"\1: 0}"),
    # perbandingan tanpa operan kanan: `if p < ]` -> `if p < 1]`
    (re.compile(r"([<>=!]=?)[ \t]*\]"), r"\1 1]"),
]


_BINOP_RE = re.compile(
    r"^([ \t]*)(.*?)[ \t]*(\*\*|//|<<|>>|[+\-*/%&|^~])[ \t]*(#.*)?$")


def _binary_op_fill(lines: list[str]) -> list[str]:
    """Isi operator biner tanpa operan kanan di ujung baris — TAPI hanya bila
    baris itu BUKAN lanjutan ekspresi yang sah.

    `efektif[orang] = ... + ` (baris berikut dedented) -> tambah `0`.
    `... +` yang dilanjutkan baris berikut yang LEBIH INDENT (bi16:
    `[s + random.gauss(...)] +` lalu `[random.gauss(...)]` di baris
    berikut) adalah kode sah — JANGAN disentuh. Baris `from x import *`
    dikecualikan.
    """
    out = []
    for i, line in enumerate(lines):
        m = _BINOP_RE.match(line)
        if m and not m.group(2).lstrip().startswith(("from ", "import ")):
            nxt = None
            for k in range(i + 1, len(lines)):
                s = lines[k].strip()
                if s and not s.startswith("#"):
                    nxt = lines[k]
                    break
            cur_ind = len(m.group(1))
            if nxt is None or len(nxt) - len(nxt.lstrip()) <= cur_ind:
                comment = f"  {m.group(4)}" if m.group(4) else ""
                line = f"{m.group(1)}{m.group(2)} {m.group(3)} 0{comment}"
        out.append(line)
    return out


def _textual_fill(code: str) -> str:
    """Satu putaran perbaikan tekstual; kembalikan kode baru."""
    out = "\n".join(_binary_op_fill(code.split("\n")))
    for pat, repl in _TEXTUAL:
        out = pat.sub(repl, out) if isinstance(repl, str) else pat.sub(repl, out)
    # `...` sendiri di baris (placeholder badan) -> `pass`
    # `{}` kosong di dalam f-string (`f"champions={}"`) -> `{0}`
    lines = []
    for line in out.split("\n"):
        if line.strip() == "...":
            line = line.replace("...", "pass", 1)
        if 'f"' in line or "f'" in line:
            line = line.replace("{}", "{0}")
        lines.append(line)
    return "\n".join(lines)


def _insert_pass_for_empty_block(lines: list[str], err_lineno: int) -> bool:
    """Sisipkan `pass` sebagai isi blok yang kosong.

    SyntaxError "expected an indented block" menunjuk baris pertama yang
    bukan isi blok; header blok adalah baris `...:` terdekat sebelumnya.
    """
    idx = err_lineno - 1  # baris yang ditunjuk error (0-based)
    hdr = None
    for j in range(min(idx, len(lines)) - 1, -1, -1):
        s = lines[j].strip()
        if s.endswith(":") and not s.startswith("#"):
            hdr = j
            break
    if hdr is None:
        return False
    indent = lines[hdr][: len(lines[hdr]) - len(lines[hdr].lstrip())] + "    "
    at = min(idx, len(lines))
    lines.insert(at, indent + "pass")
    return True


_OPEN = {"(": ")", "[": "]", "{": "}"}


def _close_blank_opener(lines: list[str], err_lineno: int,
                        tried: set[int]) -> bool:
    """Tutup kurung pembuka yang dibiarkan kosong untuk diisi learner.

    Pola starter: `cur.execute(` / `total_salah = sum(` di ujung baris, lalu
    baris berikutnya kosong/komentar dan kode lanjutan DEDENTED (bukan
    argumen lanjutan yang di-indent). Perbaikan: tutup DI BARIS ITU juga
    (`cur.execute(0)`) — JANGAN menutup di akhir file, karena isi di antara
    akan ikut jadi argumen dan merusak kode berikut (pernah terjadi di
    dm19: `0)` di akhir file membuat `)` tak cocok dengan `[` baris 5).
    Untuk error "was never closed", e.lineno menunjuk baris pembuka; untuk
    error lain (mis. "forgot a comma" di de6) cari baris pembuka terakhir
    sebelum baris error. Satu baris tidak pernah diperbaiki dua kali.
    """
    idx = (err_lineno or 1) - 1
    cands: list[int] = []
    if 0 <= idx < len(lines) and lines[idx].rstrip().endswith(tuple(_OPEN)):
        cands.append(idx)
    for j in range(min(idx, len(lines)) - 1, -1, -1):
        if lines[j].rstrip().endswith(tuple(_OPEN)):
            cands.append(j)
    for j in cands:
        if j in tried:
            continue
        stripped = lines[j].rstrip()
        opener = stripped[-1]
        indent = lines[j][: len(lines[j]) - len(lines[j].lstrip())]
        nxt = None
        for k in range(j + 1, len(lines)):
            s = lines[k].strip()
            if s and not s.startswith("#"):
                nxt = lines[k]
                break
        if nxt is None:
            lines[j] = stripped + "0" + _OPEN[opener]
            tried.add(j)
            return True
        nindent = nxt[: len(nxt) - len(nxt.lstrip())]
        if len(nindent) <= len(indent) and not nxt.lstrip().startswith((")", "]", "}", ",")):
            lines[j] = stripped + "0" + _OPEN[opener]
            tried.add(j)
            return True
    return False


def make_compilable(code: str) -> tuple[str, str | None]:
    """Kembalikan (kode_setelah_isi_kekosongan, error_atau_None).

    Error yang dikembalikan HANYA untuk cacat nyata — perbaikan tidak pernah
    menyentuh escape literal (kelas d10) atau kesalahan sintaks lain.
    """
    cur = _textual_fill(code)
    tried_openers: set[int] = set()
    for _ in range(30):
        try:
            compile(cur, "<starter>", "exec")
            return cur, None
        except SyntaxError as e:
            msg = e.msg or ""
            # Kelas d10: escape literal di posisi kode — JANGAN pernah diperbaiki.
            if "unexpected character after line continuation" in msg:
                return cur, f"SyntaxError baris {e.lineno}: {msg} (escape literal \\n di posisi kode — kelas cacat d10)"
            if "expected an indented block" in msg:
                lines = cur.split("\n")
                if _insert_pass_for_empty_block(lines, e.lineno or 1):
                    cur = "\n".join(lines)
                    continue
                return cur, f"SyntaxError baris {e.lineno}: {msg}"
            if "was never closed" in msg or "forgot a comma" in msg:
                lines = cur.split("\n")
                if _close_blank_opener(lines, e.lineno or 1, tried_openers):
                    cur = "\n".join(lines)
                    continue
                return cur, f"SyntaxError baris {e.lineno}: {msg}"
            return cur, f"SyntaxError baris {e.lineno}: {msg}"
    return cur, "terlalu banyak putaran perbaikan (starter terlalu rusak)"


def extract_starters(path: Path) -> list[dict]:
    """Kembalikan daftar {id, file, starter} dari satu file lesson."""
    text = path.read_text(encoding="utf-8")
    consts = collect_const_strings(text)
    starters: list[dict] = []
    for m in CODE_BLOCK_RE.finditer(text):
        brace = text.index("{", m.start())
        end = find_matching(text, brace, "{", "}")
        block = text[brace:end + 1]
        ids = list(LAB_ID_RE.finditer(text, 0, m.start()))
        lab_id = ids[-1].group(1) if ids else "?"
        sm = re.search(r"\bstarter:\s*(`|\"|')", block)
        if not sm:
            continue
        spos = block.index(sm.group(1), sm.start())
        if sm.group(1) == "`":
            raw, _ = extract_template(block, spos)
            starter = substitute_ts_interpolations(raw, consts)
        else:
            starter = JSParser(block, spos).parse_string()
        starters.append({"id": lab_id, "file": path.name, "starter": starter})
    return starters


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", default=None)
    args = ap.parse_args()
    files = [CONTENT / args.file] if args.file else sorted(CONTENT.glob("*.ts"))
    total = fails = 0
    for f in files:
        for lab in extract_starters(f):
            total += 1
            filled, err = make_compilable(lab["starter"])
            if err:
                fails += 1
                print(f"FAIL {lab['file']} :: {lab['id']}: {err}")
                lines = filled.split("\n")
                m = re.search(r"baris (\d+)", err)
                if m:
                    ln = int(m.group(1))
                    for i in range(max(0, ln - 2), min(len(lines), ln + 1)):
                        print(f"    {i + 1:>4}: {lines[i][:160]}")
    print(f"QA LAB-STARTER-COMPILE: {'ALL PASS' if fails == 0 else f'{fails} FAIL'}"
          f" ({total} starter dipindai, {len(files)} file)")
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
