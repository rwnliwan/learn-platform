#!/usr/bin/env python3
"""QA Learn — guard GG-20 (pusat): starter berisi jawaban / lab tak melatih.

Kelas cacat R9 (P9-2 wqb15 starter = solution byte-per-byte; P9-7 rr13
`tren` sudah terisi di starter): lab yang starter-nya sudah berisi solusi
tidak melatih apa-apa — learner cukup menekan Run.

Catatan implementasi: `extract_labs` di qa_lab_regression TIDAK mengembalikan
`starter` (hanya solution/checks), jadi guard ini mem-parse pasangan
`starter: \\`...\\`` / `solution: \\`...\\`` langsung dari teks mentah per
blok `code: { ... }`.

Yang dicek (semua blok code lab di semua file):
1. `starter` (dinormalisasi whitespace + komentar) TIDAK BOLEH identik
   dengan `solution` — repo-wide (15 instance pra-fix R9, semua bermarker
   "TULIS KODEMU", semua genuine).
2. Fixture per-instance (denylist, tumbuh tiap ronde): variabel yang diminta
   task TIDAK BOLEH sudah terisi jawaban di starter. R9: rr13 `tren`.

KETERBATASAN JUJUR: sapuan luas rule-2 (variabel task yang terisi jawaban
di starter) menemukan 155 instance pra-fix R9 — kelas ini endemik di luar
scope ronde ini, dan tiap instance butuh triase manual (intermediate yang
sengaja diberikan, mis. `mean` di a13, BUKAN bocoran — dibedakan lewat
kata task). Sapuan luas itu disimpan sebagai backlog triase di
`gg20_rule2_broad_scan_r9.txt` (bukan kegagalan guard) agar ronde berikut
menutupnya bertahap; guard ini mengunci rule-1 repo-wide + instance R9.
Mitigasi: daftar backlog + pola masuk prompt review ronde berikut.

Jalankan: python3 qa-learn/qa_gg20_starter_solution.py
Keluar 0 = lolos; 1 = gagal.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import iter_lesson_files  # noqa: E402

CODE_RE = re.compile(
    r"\bcode:\s*\{\s*starter:\s*(?:`((?:\\.|[^`\\])*)`"
    r"|\"((?:\\.|[^\"\\])*)\")"
    r"(?:.*?)solution:\s*(?:`((?:\\.|[^`\\])*)`"
    r"|\"((?:\\.|[^\"\\])*)\")",
    re.S)
LINE_ASSIGN_RE = re.compile(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^\n]*)$")
PLACEHOLDERS = {"", "None", "[]", "{}", '""', "''", "0", "0.0", "pass"}
# Penanda "nilai ini adalah HASIL HITUNG, bukan scaffold": kondisional,
# comprehension/loop, pemanggilan agregasi, operator aritmetika/perbandingan
# ber-spasi (menghindari kri[-1], -0.30, dan panggilan demo polos seperti
# r1 = mcp_dispatch({...}) atau hasil = agen_capstone("...")).
COMPUTE_RE = re.compile(
    r"(\bif\b|\bfor\b|\band\b|\bor\b|sum\(|sorted\(|len\(|max\(|min\(|"
    r"round\(|abs\(|\*\*| \+ | - | \* | / | % | == | >= | <= | > | < )")


def _unescape(code: str) -> str:
    """Template literal TS memakai escape \\n/\\t — ubah jadi karakter nyata
    sebelum dipecah per baris (tanpa ini, starter satu-baris berawalan '#'
    terbuang utuh sebagai 'komentar' dan starter==solution palsu)."""
    return (code.replace("\\n", "\n").replace("\\t", "\t")
                .replace('\\"', '"').replace("\\'", "'"))


def _norm(code: str) -> str:
    code = _unescape(code)
    lines = []
    for ln in code.strip().splitlines():
        s = ln.strip()
        if not s or s.startswith("#"):
            continue
        lines.append(ln.rstrip())
    return "\n".join(lines)


def _after_marker(code: str):
    """Kembalikan (teks_setelah_marker, ada_marker). Tanpa marker, rule-2
    TIDAK berlaku: starter tanpa 'TULIS KODEMU' adalah lab demonstrasi /
    scaffold (panggilan demo r1..r6 dsb.) — bukan jawaban yang dibocorkan."""
    code = _unescape(code)
    idx = code.find("TULIS KODEMU")
    if idx == -1:
        return "", False
    nl = code.find("\n", idx)
    return (code[nl + 1:] if nl != -1 else ""), True


def _strip_defs(code: str) -> str:
    """Buang blok `def ...:` beserta badannya — fungsi yang DIBERIKAN di
    starter sebagai scaffold (mis. pearson() di rr13) bukan jawaban."""
    lines = code.split("\n")
    out = []
    i = 0
    while i < len(lines):
        ln = lines[i]
        m = re.match(r"^(\s*)def\s+\w+\s*\(.*\)\s*:\s*$", ln)
        if m:
            indent = len(m.group(1))
            i += 1
            while i < len(lines):
                nxt = lines[i]
                if nxt.strip() == "":
                    i += 1
                    continue
                cur = len(nxt) - len(nxt.lstrip())
                if cur <= indent:
                    break
                i += 1
            continue
        out.append(ln)
        i += 1
    return "\n".join(out)


def _assignments(code: str):
    """(nama, nilai) per baris penugasan sederhana (bukan tuple, bukan def)."""
    pairs = set()
    for ln in _strip_defs(_unescape(code)).split("\n"):
        s = ln.strip()
        if not s or s.startswith("#"):
            continue
        m = LINE_ASSIGN_RE.match(ln)
        if not m:
            continue
        name, val = m.group(1), m.group(2).strip()
        # buang komentar akhir baris
        val = val.split("#")[0].strip() if " #" in val else val
        if val in PLACEHOLDERS or not val:
            continue
        pairs.add((name, val))
    return pairs


# Rule-2 fixtures: (file, nomor blok code 1-based, variabel yang diminta
# task dan TIDAK BOLEH sudah terisi jawaban di starter).
RULE2_FIXTURES = [
    ("rr13-kri.ts", 3, "tren"),
]


def check_file(path: Path):
    problems = []
    text = path.read_text(encoding="utf-8")
    for i, m in enumerate(CODE_RE.finditer(text)):
        starter = m.group(1) if m.group(1) is not None else m.group(2)
        solution = m.group(3) if m.group(3) is not None else m.group(4)
        if _norm(starter) == _norm(solution):
            problems.append(
                f"blok code #{i + 1}: starter IDENTIK dengan solution")
            continue
        # rule-2 fixture (hanya instance yang sudah ditriase)
        for fname, block_no, var in RULE2_FIXTURES:
            if path.name == fname and i + 1 == block_no:
                tail, has_marker = _after_marker(starter)
                if not has_marker:
                    continue
                sol_pairs = _assignments(solution)
                for name, val in _assignments(tail):
                    if name == var and (name, val) in sol_pairs \
                            and COMPUTE_RE.search(val):
                        problems.append(
                            f"blok code #{i + 1}: starter sudah mengisi "
                            f"`{name} = {val}` (sama dengan solution)")
    return problems


def main() -> int:
    bad = 0
    for path in iter_lesson_files():
        for p in check_file(path):
            print(f"FAIL {path.name}: {p}")
            bad += 1
    if bad:
        print(f"QA GG-20-STARTER-SOLUTION: FAIL ({bad} temuan)")
        return 1
    print("QA GG-20-STARTER-SOLUTION: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
