#!/usr/bin/env python3
"""Verifikasi end-to-end: ekstrak kode `solution` Python & SQL yang TER TANAM
di file .ts misi, lalu jalankan persis seperti di browser (pandas + sqlite3).

Menangkap typo transkripsi antara harness logika dan file .ts.
"""
import os
import re
import sqlite3

import pandas as pd

A_DIR = os.path.join("public", "misi", "misi-katalog-data-hilang")
B_DIR = os.path.join("public", "misi", "misi-lineage-terputus")
CONTENT = os.path.join("src", "app", "v2", "content")


def open_url(url):  # shim lokal pengganti pyodide.http.open_url
    name = url.rsplit("/", 1)[-1]
    for d in (A_DIR, B_DIR):
        p = os.path.join(d, name)
        if os.path.exists(p):
            return open(p, "rb")
    raise FileNotFoundError(url)


# stub modul pyodide agar `from pyodide.http import open_url` jalan di harness
import sys
import types as _types
_pyodide = _types.ModuleType("pyodide")
_pyodide_http = _types.ModuleType("pyodide.http")
_pyodide_http.open_url = open_url
_pyodide.http = _pyodide_http
sys.modules["pyodide"] = _pyodide
sys.modules["pyodide.http"] = _pyodide_http


def unescape_ts(s: str) -> str:
    # string TS "..." -> python: tangani \" \\ \n umum
    return s.replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")


def extract_py_solutions(ts_path):
    """Ambil semua blok `solution: [...]` Python (yang bukan sqlLab)."""
    src = open(ts_path, encoding="utf-8").read()
    sols = []
    for m in re.finditer(r"solution: \[\n(.*?)\n\s*\]\.join\(\"\\n\"\)", src, re.S):
        block = m.group(1)
        # lewati solution milik sqlLab: bandingkan posisi "code: {" vs "sqlLab: {" terakhir
        pre = src[:m.start()]
        if pre.rfind("sqlLab: {") > pre.rfind("code: {"):
            continue
        lines = []
        for ln in block.split("\n"):
            ln = ln.strip()
            assert ln.startswith('"') and ln.rstrip().endswith(('"', '",')), f"baris aneh: {ln[:60]}"
            ln = ln[1:]
            ln = ln[:-2] if ln.endswith('",') else ln[:-1]
            lines.append(unescape_ts(ln))
        sols.append("\n".join(lines))
    return sols


def extract_sql_labs(ts_path):
    """Ambil (seedData, solution, expectedColumns, expectedRows, orderMatters) per sqlLab."""
    src = open(ts_path, encoding="utf-8").read()
    labs = []
    for m in re.finditer(r"sqlLab: \{(.*?)\n\s{4}\},", src, re.S):
        body = m.group(1)

        def arr(key):
            mm = re.search(key + r": \[\n(.*?)\n\s*\]\.join\(\"\\n\"\)", body, re.S)
            lines = []
            for ln in mm.group(1).split("\n"):
                ln = ln.strip()[1:]
                ln = ln[:-2] if ln.endswith('",') else ln[:-1]
                lines.append(unescape_ts(ln))
            return "\n".join(lines)

        seed = arr("seedData")
        sol = arr("solution")
        cols = re.search(r"expectedColumns: \[(.*?)\]", body, re.S).group(1)
        cols = [c.strip().strip('"') for c in cols.split(",")]
        rows_raw = re.search(r"expectedRows: \[(.*?)\],\n\s*orderMatters", body, re.S).group(1)
        rows = []
        for rm in re.finditer(r"\[(.*?)\]", rows_raw, re.S):
            cells = []
            for c in rm.group(1).split(","):
                c = c.strip()
                cells.append(int(c) if re.fullmatch(r"-?\d+", c) else c.strip('"'))
            rows.append(cells)
        om = "orderMatters: true" in body
        labs.append((seed, sol, cols, rows, om))
    return labs


def run_py(name, code, expected_vars):
    ns = {"open_url": open_url, "print": lambda *a: None}
    exec(code, ns)
    got = {k: ns[k] for k in expected_vars}
    ok = got == expected_vars
    print(("PASS " if ok else "FAIL ") + name, got if not ok else "")
    assert ok, f"{name}: {got} != {expected_vars}"


def run_sql(name, schema_seed, seed, sol, cols, rows, om):
    con = sqlite3.connect(":memory:")
    # schema diambil dari seed: CREATE TABLE diekstrak dari blok schema terpisah —
    # di sini kita buat dari seedData saja tidak cukup; schema dilewatkan via arg.
    con.executescript(schema_seed + "\n" + seed)
    cur = con.execute(sol)
    got_cols = [d[0] for d in cur.description]
    got_rows = [list(r) for r in cur.fetchall()]
    ok = got_cols == cols and got_rows == rows
    print(("PASS " if ok else "FAIL ") + name)
    if not ok:
        print("  cols:", got_cols, "vs", cols)
        print("  rows:", got_rows, "vs", rows)
    assert ok


def schema_of(ts_path):
    src = open(ts_path, encoding="utf-8").read()
    return [unescape_ts(m.group(1)) for m in re.finditer(r'schema: "(.*?)"', src)]


print("── ekstraksi solusi Python tertanam ──")
a_sols = extract_py_solutions(os.path.join(CONTENT, "misi-katalog-data-hilang.ts"))
b_sols = extract_py_solutions(os.path.join(CONTENT, "misi-lineage-terputus.ts"))
print(f"A: {len(a_sols)} blok, B: {len(b_sols)} blok")
assert len(a_sols) == 1 and len(b_sols) == 2

run_py("A/lab-katalog", a_sols[0], {
    "n_kolom": 37, "n_rahasia": 9, "n_terbatas": 6,
    "n_tanpa_pemilik": 8, "n_kritis_tanpa_pemilik": 2,
    "n_deprecated_bermasalah": 1, "n_pasang_duplikat": 5})
run_py("B/lab-diff", b_sols[0], {
    "n_hilang": 2, "n_baru": 3, "n_tipe_berubah": 1,
    "n_makna_berubah": 1, "n_kandidat_rename": 2})
run_py("B/lab-dampak", b_sols[1], {"n_terdampak": 4, "n_select_bintang": 1})

print("── ekstraksi lab SQL tertanam ──")
a_labs = extract_sql_labs(os.path.join(CONTENT, "misi-katalog-data-hilang.ts"))
b_labs = extract_sql_labs(os.path.join(CONTENT, "misi-lineage-terputus.ts"))
a_schema = schema_of(os.path.join(CONTENT, "misi-katalog-data-hilang.ts"))
b_schema = schema_of(os.path.join(CONTENT, "misi-lineage-terputus.ts"))
print(f"A: {len(a_labs)} lab, B: {len(b_labs)} lab")
assert len(a_labs) == 1 and len(b_labs) == 1
run_sql("A/lab-sql", a_schema[0], *a_labs[0])
run_sql("B/lab-sql", b_schema[0], *b_labs[0])

print("\nSEMUA SOLUSI TERTANAM LOLOS — expected values di checks cocok.")
