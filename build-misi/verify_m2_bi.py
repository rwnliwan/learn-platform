#!/usr/bin/env python3
"""Verifikasi end-to-end misi M2 BI:
1. Ekstrak solution Python dari TS -> jalankan (open_url stub) -> cocokkan dgn checks di TS.
2. Ekstrak sqlLab dari TS -> jalankan di sqlite3 -> cocokkan expectedRows.
3. Cek struktur: tasks tiap langkah, summary di langkah akhir, decision/goto/auditDossier/deliverable.
4. grep pola ${ (harus 0).
"""
import re, sys, sqlite3, types
from pathlib import Path

LP = Path.home() / "workspace/learn-platform"
fails = []

def check(cond, label):
    print(("PASS " if cond else "FAIL "), label)
    if not cond:
        fails.append(label)

def unquote_ts(s: str) -> str:
    # literal string TS "..." dengan escape \" dan \\ 
    assert s.startswith('"') and s.endswith('"'), s[:60]
    body = s[1:-1]
    return body.replace('\\"', '"').replace('\\\\', '\\')

def extract_array_block(ts: str, key: str, scope: str | None = None) -> list[str]:
    """Ambil isi [...].join("\n") setelah 'key:' -> list baris.
    Bila scope diberikan, cari dulu blok scope: {...} yang memuat key."""
    src = ts
    if scope:
        m = re.search(re.escape(scope) + r":\s*\{(.*?)\n\s*\},?\s*\n", ts, re.DOTALL)
        assert m, f"scope {scope} tidak ketemu"
        src = m.group(1)
    m = re.search(re.escape(key) + r":\s*\[(.*?)\]\.join\(\"\\n\"\)", src, re.DOTALL)
    assert m, f"block {key} tidak ketemu"
    inner = m.group(1)
    lits = re.findall(r'"(?:[^"\\]|\\.)*"', inner)
    return [unquote_ts(l) for l in lits]

def solution_blocks(ts: str):
    """Kembalikan list (is_sql, lines) untuk semua blok solution: [...].join."""
    m = re.search(r"sqlLab:\s*\{", ts)
    sql_span = None
    if m:
        end = ts.index("\n      },", m.start())
        sql_span = (m.start(), end)
    out = []
    for mm in re.finditer(r"solution:\s*\[(.*?)\]\.join\(\"\\n\"\)", ts, re.DOTALL):
        inner = mm.group(1)
        lits = re.findall(r'"(?:[^"\\]|\\.)*"', inner)
        is_sql = sql_span is not None and sql_span[0] <= mm.start() <= sql_span[1]
        out.append((is_sql, [unquote_ts(l) for l in lits]))
    return out

def run_py_solution(ts_path: Path, base_url: str, public_dir: Path, expected: dict, py_index: int = 0):
    ts = ts_path.read_text()
    py_sols = [lines for is_sql, lines in solution_blocks(ts) if not is_sql]
    assert len(py_sols) > py_index, f"blok solution python ke-{py_index} tidak ada"
    sol_code = "\n".join(py_sols[py_index])
    pyodide = types.ModuleType("pyodide")
    http = types.ModuleType("pyodide.http")
    def open_url(url: str):
        assert url.startswith(base_url), url
        return str(public_dir / url[len(base_url):].lstrip("/"))
    http.open_url = open_url
    pyodide.http = http
    sys.modules["pyodide"] = pyodide
    sys.modules["pyodide.http"] = http
    ns: dict = {}
    exec(compile(sol_code, str(ts_path), "exec"), ns)
    for name, want in expected.items():
        got = ns.get(name, "<HILANG>")
        if isinstance(want, float):
            ok = isinstance(got, (int, float)) and abs(float(got) - want) <= 0.06
        else:
            ok = got == want
        check(ok, f"{ts_path.name} py: {name}={got} (want {want})")

def run_sql_lab(ts_path: Path, label: str):
    ts = ts_path.read_text()
    # batasi ke blok sqlLab agar tidak menangkap solution Python
    m = re.search(r"sqlLab:\s*\{(.*)", ts, re.DOTALL)
    assert m, "sqlLab tidak ketemu"
    sub = "sqlLab: {" + m.group(1)
    seed_lines = extract_array_block(sub, "seedData")
    seed_sql = "\n".join(seed_lines)
    sol_lines = extract_array_block(sub, "solution")
    sol_sql = "\n".join(sol_lines)
    schema = re.search(r'schema:\s*"((?:[^"\\]|\\.)*)"', sub).group(1)
    schema = schema.replace('\\"', '"').replace('\\n', '\n')
    cols_m = re.search(r"expectedColumns:\s*\[(.*?)\]", sub, re.DOTALL)
    cols = re.findall(r'"([^"]*)"', cols_m.group(1))
    rows_m = re.search(r"expectedRows:\s*\[(.*?)\],\s*\n\s*orderMatters", sub, re.DOTALL)
    rows_src = rows_m.group(1)
    exp_rows = eval("[" + rows_src + "]")
    con = sqlite3.connect(":memory:")
    con.executescript(schema)
    con.executescript(seed_sql)
    got_cols = [d[0] for d in con.execute(sol_sql).description]
    got_rows = [list(r) for r in con.execute(sol_sql).fetchall()]
    check(got_cols == cols, f"{label} sql cols {got_cols} == {cols}")
    check(got_rows == exp_rows, f"{label} sql rows cocok ({len(got_rows)} baris)")
    con.close()

def check_structure(ts_path: Path, n_steps: int):
    ts = ts_path.read_text()
    ids = re.findall(r'id:\s*"([^"]+)"', ts)
    # step ids: pola id: "..." di awal objek langkah (eyebrow menyertai)
    step_ids = re.findall(r'\{\s*id:\s*"([a-z0-9-]+)",(?:\s*\n\s*goto:\s*"[^"]+",)?\s*\n\s*eyebrow:', ts)
    check(len(step_ids) == n_steps, f"{ts_path.name}: {len(step_ids)} langkah (want {n_steps})")
    check(len(set(step_ids)) == len(step_ids), f"{ts_path.name}: step id unik")
    # tasks tiap langkah
    n_tasks_blocks = len(re.findall(r"tasks:\s*\[", ts))
    check(n_tasks_blocks == n_steps, f"{ts_path.name}: tasks ada di {n_tasks_blocks}/{n_steps} langkah")
    # summary di langkah terakhir
    check(bool(re.search(r"summary:\s*\[", ts)), f"{ts_path.name}: summary[] ada")
    # decision options -> nextStepId valid
    nexts = re.findall(r'nextStepId:\s*"([^"]+)"', ts)
    check(len(nexts) == 3 and all(n in step_ids for n in nexts), f"{ts_path.name}: 3 opsi decision -> step valid {nexts}")
    gotos = re.findall(r'goto:\s*"([^"]+)"', ts)
    check(len(gotos) == 3 and all(g == "audit" for g in gotos), f"{ts_path.name}: 3 cabang goto audit")
    # auditDossier
    rows = re.findall(r"rowId:\s*(\d+)", ts)
    check(12 <= len(rows) <= 20, f"{ts_path.name}: dossier {len(rows)} baris (12-20)")
    inj = re.findall(r'key:\s*"([^"]+)"', ts)
    check(3 <= len(inj) <= 5, f"{ts_path.name}: {len(inj)} injections (3-5): {inj}")
    # deliverable
    tmpl = re.search(r"template:\s*\[(.*?)\],\s*\n\s*rubric:", ts, re.DOTALL)
    n_tmpl = len(re.findall(r'^\s*"', tmpl.group(1), re.MULTILINE))
    check(n_tmpl == 5, f"{ts_path.name}: template {n_tmpl} poin (want 5)")
    weights = [int(w) for w in re.findall(r"weight:\s*(\d+)", ts)]
    check(len(weights) == 4 and sum(weights) == 100, f"{ts_path.name}: rubric 4 kriteria, bobot {weights} = {sum(weights)}")
    # pola ${ = 0
    check(ts.count("${") == 0, f"{ts_path.name}: pola '${{' = 0")

if __name__ == "__main__":
    a = LP / "src/app/v2/content/misi-dashboard-regulator.ts"
    b = LP / "src/app/v2/content/misi-dua-definisi-revenue.ts"
    pa = LP / "public/misi/misi-dashboard-regulator"
    pb = LP / "public/misi/misi-dua-definisi-revenue"

    run_py_solution(a, "/misi/misi-dashboard-regulator", pa, {
        "n_baris": 1871, "tgl_awal": "2026-01-01", "tgl_akhir": "2026-03-31",
        "n_valid": 1458, "n_user_aktif_jan": 288, "total_nominal_valid": 320815338,
        "jan_valid": 512, "feb_valid": 477, "mar_valid": 469, "selisih_dua_jalur": 0})
    run_sql_lab(a, "regulator")
    check_structure(a, 12)
    print("---")
    run_py_solution(b, "/misi/misi-dua-definisi-revenue", pb, {
        "kas_q1": 48534170, "kas_q2": 22049107, "aku_q1": 31444151,
        "aku_q2": 39139126, "tumbuh_kas_pct": -54.57, "tumbuh_aku_pct": 24.47})
    # lab qoq = solution block python kedua di file b
    tsb = b.read_text()
    py_sols_b = [lines for is_sql, lines in solution_blocks(tsb) if not is_sql]
    check(len(py_sols_b) == 2, "revenue: 2 solution block python")
    sol2 = "\n".join(py_sols_b[1])
    pyodide = types.ModuleType("pyodide"); http = types.ModuleType("pyodide.http")
    http.open_url = lambda url: str(pb / url[len("/misi/misi-dua-definisi-revenue"):].lstrip("/"))
    pyodide.http = http
    sys.modules["pyodide"] = pyodide; sys.modules["pyodide.http"] = http
    ns2: dict = {}
    exec(compile(sol2, str(b), "exec"), ns2)
    for name, want in {"g_kas_q1": 81.82, "g_aku_q1": 11.11, "g_kas_q2": -54.57, "g_aku_q2": 24.47}.items():
        got = ns2.get(name, "<HILANG>")
        check(isinstance(got, (int, float)) and abs(float(got) - want) <= 0.06,
              f"misi-dua-definisi-revenue.ts py2: {name}={got} (want {want})")
    run_sql_lab(b, "revenue")
    check_structure(b, 13)

    print("=" * 50)
    print("HASIL:", "SEMUA PASS" if not fails else f"{len(fails)} FAIL: {fails}")
    sys.exit(1 if fails else 0)
