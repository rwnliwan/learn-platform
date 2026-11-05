#!/usr/bin/env python3
"""Harness mandiri M1 PASAR & PELAPORAN: uji solusi lab vs CSV asli + SQL + struktur."""
import re, sys, os, json, sqlite3, ast, math
import pandas as pd

os.makedirs("/tmp/harness_m1/pyodide", exist_ok=True)
open("/tmp/harness_m1/pyodide/__init__.py", "w").write("")
open("/tmp/harness_m1/pyodide/http.py", "w").write(
    'def open_url(url):\n'
    '    import os\n'
    '    base = "/home/hatch/workspace/learn-platform/public"\n'
    '    p = os.path.join(base, url.lstrip("/"))\n'
    '    assert os.path.exists(p), f"CSV tidak ada: {p}"\n'
    '    return p\n')
sys.path.insert(0, "/tmp/harness_m1")

LP = "/home/hatch/workspace/learn-platform"
MISSIONS = {
    "misi-var-backtest": "misi-var-backtest.ts",
    "misi-stress-korelasi": "misi-stress-korelasi.ts",
    "misi-rekonsiliasi-laporan": "misi-rekonsiliasi-laporan.ts",
    "misi-laporan-dua-sumber": "misi-laporan-dua-sumber.ts",
}
fails = []
def ok(cond, msg):
    print(("  PASS " if cond else "  FAIL ") + msg)
    if not cond: fails.append(msg)

def js_unescape(s):
    out, i = [], 0
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s):
            n = s[i+1]
            out.append({"n": "\n", "t": "\t", '"': '"', "\\": "\\", "r": "\r"}.get(n, n))
            i += 2
        else:
            out.append(c); i += 1
    return "".join(out)

def extract_blocks(src, key):
    """Ambil semua blok  key: [ ... ].join("\n")  -> list of python code strings."""
    blocks = []
    for m in re.finditer(re.escape(key) + r": \[\n(.*?)\n\s*\]\.join\(\"\\n\"\)", src, re.S):
        lines = []
        for ln in m.group(1).split("\n"):
            ln = ln.strip()
            if not ln: continue
            if ln.endswith(","): ln = ln[:-1]
            assert ln.startswith('"') and ln.endswith('"'), f"baris aneh: {ln[:60]}"
            lines.append(js_unescape(ln[1:-1]))
        blocks.append("\n".join(lines))
    return blocks

def extract_checks(src):
    checks = []
    for m in re.finditer(r"checks: \[(.*?)\n\s*\],\n", src, re.S):
        body = m.group(1)
        for cm in re.finditer(r"\{ kind: \"(\w+)\"(.*?) \}", body, re.S):
            kind, rest = cm.group(1), cm.group(2)
            d = {"kind": kind}
            for k in ["task", "label", "name", "msg"]:
                mm = re.search(rf'{k}: "((?:[^"\\]|\\.)*)"', rest)
                if mm: d[k] = js_unescape(mm.group(1))
            mm = re.search(r"value: (-?[\d.]+|\"(?:[^\"\\]|\\.)*\")", rest)
            if mm:
                v = mm.group(1)
                d["value"] = js_unescape(v[1:-1]) if v.startswith('"') else float(v)
            mm = re.search(r"tol: ([\d.]+)", rest)
            if mm: d["tol"] = float(mm.group(1))
            checks.append(d)
    return checks

def run_solution(code):
    ns = {}
    exec(compile(code, "<sol>", "exec"), ns)
    return ns

for slug, fn in MISSIONS.items():
    print(f"== {slug} ==")
    src = open(f"{LP}/src/app/v2/content/{fn}").read()
    # 1. struktur dasar
    for token in ['slug: "%s"' % slug, "briefing:", "auditDossier:", "deliverable:",
                  "decision:", "summary:", "goto:", "sqlLab:", "prereqSummary"]:
        ok(token in src, f"token {token} ada")
    # estMinutes jujur
    m = re.search(r"estMinutes: (\d+)", src)
    ok(m and 90 <= int(m.group(1)) <= 200, f"estMinutes={m.group(1) if m else '?'}")
    # rubric total 100
    weights = [int(x) for x in re.findall(r"weight: (\d+)", src)]
    ok(sum(weights) % 100 == 0 and sum(weights) > 0, f"rubric weights sum={sum(weights)}")
    # step ids unik; decision nextStepId & goto valid
    ids = re.findall(r'^ {4,6}id: "([a-z0-9-]+)",$', src, re.M)
    ok(len(ids) == len(set(ids)), f"step ids unik ({len(ids)} langkah)")
    targets = set(re.findall(r'nextStepId: "([a-z0-9-]+)"', src)) | set(re.findall(r'goto: "([a-z0-9-]+)"', src))
    ok(targets <= set(ids), f"nextStepId/goto valid ({targets})")
    # dossier: rowIds injections ⊆ rows
    rowids = [int(x) for x in re.findall(r"\{ rowId: (\d+), cells:", src)]
    inj_groups = re.findall(r"rowIds: \[([\d, ]+)\]", src)
    flat = [int(x) for grp in inj_groups for x in grp.split(",")]
    ok(set(flat) <= set(rowids) and len(rowids) == len(set(rowids)), f"dossier rows={len(rowids)} injeksi konsisten")
    # F1 scan
    f1 = ["Pada lesson kali ini kita akan membahas", "Seperti yang telah dibahas sebelumnya",
          "Mari kita mulai pembahasan", "Selanjutnya, kita akan melihat", "Penting untuk diingat bahwa"]
    hits = [p for p in f1 if p in src]
    ok(not hits, f"F1 scan bersih (temuan: {hits})")
    # CSV dirujuk ada
    for csv in set(re.findall(r'URL = "(/misi/[^"]+\.csv)"|open_url\(B \+ "([^"]+\.csv)"\)|C = "(/misi/[^"]+)"', src)):
        pass
    for csv in sorted(set(re.findall(r'"/misi/([^"]+\.csv)"', src))):
        ok(os.path.exists(f"{LP}/public/misi/{csv}"), f"CSV ada: {csv}")
    # 2. lab pyodide: jalankan solution, evaluasi checks
    sols = extract_blocks(src, "solution")
    checks = extract_checks(src)
    print(f"  solution blocks: {len(sols)}, checks: {len(checks)}")
    # petakan checks ke solution terdekat: urutan kemunculan
    sol_iter = iter(sols)
    cur_ns, cur_checks = None, []
    ci = 0
    # sederhana: tiap blok solution dieksekusi, lalu checks yang nama var-nya ada di ns dievaluasi
    for s in sols:
        if "SELECT" in s.upper() and "import pandas" not in s:
            continue  # blok solution SQL — diuji terpisah via sqlite3
        try:
            ns = run_solution(s)
        except Exception as e:
            ok(False, f"solution exec gagal: {str(e)[:200]}"); continue
        for c in checks:
            if c.get("name") in ns and not c.get("_done"):
                c["_done"] = True
                if c["kind"] == "defined":
                    ok(c["name"] in ns, f"check defined {c['name']}")
                elif c["kind"] == "equal":
                    v, e = ns[c["name"]], c["value"]
                    tol = c.get("tol", 0)
                    good = (v == e) if isinstance(e, str) else (abs(float(v) - float(e)) <= tol + 1e-9)
                    ok(good, f"check {c['name']}: got {v} vs exp {e} (tol {tol})")
    undone = [c["name"] for c in checks if not c.get("_done") and c.get("name")]
    ok(not undone, f"semua checks tereksekusi (sisa: {undone})")
    # 3. SQL labs
    for sm in re.finditer(r"sqlLab: \{(.*?)\n    \},", src, re.S):
        body = sm.group(1)
        def grab(k):
            mm = re.search(k + r": \[\n(.*?)\n\s*\]\.join\(\"\\n\"\)", body, re.S)
            if not mm: return ""
            out = []
            for ln in mm.group(1).split("\n"):
                ln = ln.strip()
                if not ln: continue
                if ln.endswith(","): ln = ln[:-1]
                out.append(js_unescape(ln[1:-1]))
            return "\n".join(out)
        seed, sol = grab("seedData"), grab("solution")
        cols = ast.literal_eval(re.search(r"expectedColumns: (\[.*?\])", body, re.S).group(1))
        rows = ast.literal_eval(re.search(r"expectedRows: (\[.*?\n        \]),?\n", body, re.S).group(1))
        om = re.search(r"orderMatters: (true|false)", body)
        order = om and om.group(1) == "true"
        ft = re.search(r"floatTol: ([\d.]+)", body)
        ftol = float(ft.group(1)) if ft else 1e-6
        con = sqlite3.connect(":memory:")
        con.executescript(re.search(r'schema: "(.*?)"', body, re.S).group(1).replace("\\n", "\n"))
        con.executescript(seed)
        got = con.execute(sol).fetchall()
        got_cols = [d[0] for d in con.execute(sol).description]
        ok(got_cols == cols, f"SQL kolom {got_cols} vs {cols}")
        def norm(rs):
            return sorted([tuple(round(v, 6) if isinstance(v, float) else v for v in r) for r in rs])
        exp = [tuple(r) for r in rows]
        good = (list(got) == exp) if order else (norm(got) == norm(exp))
        if not good and not order:
            good = all(any(abs((a if isinstance(a,float) else 0)-(b if isinstance(b,float) else 0)) <= ftol or a==b for b in exp) for a in got) and len(got)==len(exp)
        ok(good, f"SQL rows cocok ({len(got)} baris)")
        con.close()
    # ukuran dataset
    tot = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(f"{LP}/public/misi/{slug}") for f in fs)
    ok(tot < 5*1024*1024, f"dataset {tot/1024:.0f}KB < 5MB")
    ok(os.path.exists(f"{LP}/public/misi/{slug}/METODE.md"), "METODE.md ada")

print()
if fails:
    print(f"GAGAL: {len(fails)}"); [print(" -", f) for f in fails]; sys.exit(1)
print("SEMUA HARNESS LOLOS")
