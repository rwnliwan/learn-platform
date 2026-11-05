#!/usr/bin/env python3
"""Harness verifikasi lab SQL misi M2-SQL.
Mengekstrak blok sqlLab LANGSUNG dari file .ts (bukan dari salinan),
menjalankan schema+seedData+solution di sqlite3, dan membandingkan
dengan expectedColumns/expectedRows yang ikut diekstrak.
Juga: grep pola '${' (harus 0) dan uji logika lab Python (pandas) dgn open_url stub.
"""
import ast, os, re, sqlite3, sys

LP = os.path.expanduser("~/workspace/learn-platform")
FILES = {
    "misi-laporan-bulanan-sql": f"{LP}/src/app/v2/content/misi-laporan-bulanan-sql.ts",
    "misi-dua-sumber-tidak-cocok": f"{LP}/src/app/v2/content/misi-dua-sumber-tidak-cocok.ts",
}

def extract_brace(s, i):
    """i menunjuk '{'; kembalikan isi sampai '}' penutup yang seimbang (tanpa kurung luar)."""
    assert s[i] == "{"
    d, j = 0, i
    instr, esc = False, False
    while j < len(s):
        c = s[j]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"': instr = True
            elif c == "{": d += 1
            elif c == "}":
                d -= 1
                if d == 0: return s[i+1:j]
        j += 1
    raise ValueError("brace tak seimbang")

def str_array(block, key):
    """Ambil key: [ ... ].join("\n") -> gabung elemen string (decode escape)."""
    m = re.search(re.escape(key) + r"\s*:\s*\[", block)
    assert m, f"{key} tidak ketemu"
    i = m.end() - 1
    d, j = 1, i + 1
    instr, esc = False, False
    while j < len(block):
        c = block[j]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"': instr = True
            elif c == "[": d += 1
            elif c == "]":
                d -= 1
                if d == 0: break
        j += 1
    inner = block[i+1:j]
    elems = re.findall(r'"((?:[^"\\]|\\.)*)"', inner)
    out = []
    for e in elems:
        out.append(e.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t").replace("\\\\", "\\"))
    return "\n".join(out)

def js_array(block, key):
    """Ambil key: [ ... ] (nested, berisi string/int/null) -> list Python."""
    m = re.search(re.escape(key) + r"\s*:\s*\[", block)
    assert m, f"{key} tidak ketemu"
    i = m.end() - 1
    d, j = 1, i + 1
    instr, esc = False, False
    while j < len(block):
        c = block[j]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"': instr = True
            elif c == "[": d += 1
            elif c == "]":
                d -= 1
                if d == 0: break
        j += 1
    inner = "[" + block[i+1:j] + "]"
    def _repl(m):
        s = m.group(0)
        if s.startswith('"'):
            return s
        return {"null": "None", "true": "True", "false": "False"}[s]
    inner = re.sub(r'"(?:[^"\\]|\\.)*"|\bnull\b|\btrue\b|\bfalse\b', _repl, inner)
    return ast.literal_eval(inner)

def check(cond, msg):
    print(("  PASS " if cond else "  FAIL ") + msg)
    if not cond: check.failed += 1
check.failed = 0

for slug, path in FILES.items():
    src = open(path, encoding="utf-8").read()
    print(f"== {slug} ==")
    check("${" not in src, "tidak ada pola '${' di file")
    labs = []
    for m in re.finditer(r"sqlLab\s*:\s*\{", src):
        labs.append(extract_brace(src, m.end() - 1))
    print(f"  sqlLab ditemukan: {len(labs)}")
    for n, lab in enumerate(labs, 1):
        schema = str_array(lab, "schema")
        seed = str_array(lab, "seedData")
        sol = str_array(lab, "solution")
        exp_cols = js_array(lab, "expectedColumns")
        exp_rows = js_array(lab, "expectedRows")
        mom = re.search(r"orderMatters\s*:\s*(true|false)", lab)
        om = bool(mom and mom.group(1) == "true")
        con = sqlite3.connect(":memory:")
        cur = con.cursor()
        try:
            cur.executescript(schema)
            cur.executescript(seed)
            cur.execute(sol)
            cols = [d[0] for d in cur.description]
            rows = [list(r) for r in cur.fetchall()]
        except Exception as e:
            check(False, f"lab{n}: eksekusi SQL gagal: {e}")
            continue
        check(cols == exp_cols, f"lab{n}: kolom {cols} == expected")
        norm = lambda r: [ (None if v is None else (round(float(v),9) if isinstance(v,(int,float)) else v)) for v in r ]
        got = [norm(r) for r in rows]; want = [norm(r) for r in exp_rows]
        if om: check(got == want, f"lab{n}: {len(rows)} baris cocok persis (orderMatters)")
        else: check(sorted(map(str,got)) == sorted(map(str,want)), f"lab{n}: himpunan {len(rows)} baris cocok")
        if got != want and om:
            for g, w in zip(got, want):
                if g != w: print(f"    beda: dapat {g} vs harap {w}")
            if len(got) != len(want): print(f"    jumlah baris: {len(got)} vs {len(want)}")

# — uji logika lab Python misi B (pandas + open_url stub) —
print("== lab python misi-dua-sumber-tidak-cocok ==")
try:
    import pandas as pd
    from datetime import timedelta
    src = open(FILES["misi-dua-sumber-tidak-cocok"], encoding="utf-8").read()
    # ekstrak blok code: { ... } (lab Python) lalu ambil solution-nya
    mc = re.search(r"\bcode\s*:\s*\{", src)
    code_blk = extract_brace(src, mc.end() - 1)
    sol_py = str_array(code_blk, "solution")
    sol_py = sol_py.replace("from pyodide.http import open_url\n", "")
    sol_py = ("def open_url(url):\n"
              "    import re\n"
              "    p = url\n"
              "    assert p.startswith('/misi/')\n"
              f"    return open('{LP}/public' + p, encoding='utf-8')\n") + sol_py
    g = {}
    exec(compile(sol_py, "sol", "exec"), g)
    check(g.get("n_baris") == 41, f"n_baris == 41 (dapat {g.get('n_baris')})")
    check(g.get("n_pindah_hari") == 17, f"n_pindah_hari == 17 (dapat {g.get('n_pindah_hari')})")
    check(g.get("total_wib_2025_03_04") == 6738000, f"total_wib_2025_03_04 == 6738000 (dapat {g.get('total_wib_2025_03_04')})")
    # verifikasi checks di TS konsisten
    checks_blk = code_blk
    for name, val in [("n_baris", 41), ("n_pindah_hari", 17), ("total_wib_2025_03_04", 6738000)]:
        mm = re.search(r"name:\s*\"" + name + r"\".*?value:\s*([\d.]+)", checks_blk, re.S)
        check(mm and float(mm.group(1)) == val, f"check TS {name} == {val}")
except ImportError:
    print("  SKIP: pandas tidak tersedia")
except Exception as e:
    check(False, f"lab python gagal: {e!r}")

print()
print("HASIL:", "SEMUA LULUS" if check.failed == 0 else f"{check.failed} GAGAL")
sys.exit(1 if check.failed else 0)
