#!/usr/bin/env python3
"""QA Learn — regresi lab otomatis (guard permanen, 2026-11-08).

Latar: review putaran 2 (Kimi K3/glm-5.3) menemukan lab CR13 yang RUSAK —
solusi referensinya sendiri GAGAL terhadap check-nya (nilai check mustahil
matematis), plus BCD14 (6 vs 9 baris) dan DE16 (6 vs 5 baris). Lubang ini
lolos karena check lab TIDAK PERNAH dieksekusi sama sekali sebelum publikasi.
Aturan AGENTS.md ("eksekusi lab saja tidak cukup untuk prose/quiz") tetap
berlaku — tapi lab yang solusinya tidak pernah dijalankan adalah lubang yang
lebih dasar. Skrip ini menutup lubang itu: ia menjalankan kode solusi
referensi tiap lab terhadap check-nya, persis seperti runtime web.

Cara kerja:
- Memindai file lesson TypeScript di learn-platform/src/app/v2/content.
- Lab Python (`code: { solution, checks }`) dieksekusi dengan CPython lokal
  memakai SEMANTIK CHECK YANG SAMA dengan pyodide.worker.ts di app
  (defined/equal/contains/stdout_matches/uses/forbids — lihat
  `run_python_lab()`; `equal` memakai tol persis seperti worker).
- Lab SQL (`sqlLab: { schema, seedData, solution, expectedColumns,
  expectedRows }`) dijalankan dengan sqlite3 lokal; baris hasil
  dibandingkan sebagai himpunan (kecuali orderMatters), numerik pakai
  floatTol — sama seperti SqlLab di app (types.ts).
- Lab yang butuh paket yang tidak terinstal lokal (mis. statsmodels)
  dilaporkan SKIP, bukan PASS — jangan sampai "lolos" palsu. Sama untuk
  lab yang memakai API Pyodide/browser (`import pyodide`/`from js ...`):
  SKIP dengan alasan eksplisit — verifikasi lab itu tetap butuh browser.

Penggunaan:
    python3 qa_lab_regression.py [--file <nama-file.ts>] [--only python|sql]
                                 [--timeout <detik>] [--list]
    Keluar 0 = semua lab yang dieksekusi PASS; 1 = ada FAIL/ERROR.
    --list hanya menghitung lab tanpa mengeksekusi.

Batasan yang diketahui (jangan dianggap bug harness):
- sql.js di browser vs sqlite3 lokal: dialek SQL dasar sama; fungsi
  spesifik (mis. fungsi tanggal SQLite yang berbeda) bisa menimbulkan
  perbedaan — bila satu lab SQL gagal karena itu, laporkan sebagai
  "perlu verifikasi browser", bukan sebagai bukti lab rusak.
- Lab yang memakai `input()` tidak bisa dieksekusi non-interaktif dan
  dilaporkan ERROR.
- Lab dengan `random` tanpa seed bersifat flaky: FAIL yang muncul
  sekali-sekali dari lab seperti itu menandakan check-nya terlalu ketat,
  bukan harness yang salah — perbaiki toleransi di lesson.
"""
import argparse
import ast
import io
import json
import re
import signal
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path.home() / "workspace/learn-platform/src/app/v2/content"

# ---------------------------------------------------------------------------
# Parsing TypeScript: template literal + objek JS (subset yang dipakai lesson)
# ---------------------------------------------------------------------------

def unescape_ts(s: str) -> str:
    """Unescape isi string/template literal TypeScript (subset yang dipakai)."""
    out = []
    i = 0
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s):
            n = s[i + 1]
            mapping = {"n": "\n", "t": "\t", "r": "\r", "`": "`", "'": "'",
                       '"': '"', "\\": "\\", "$": "$", "/": "/"}
            if n in mapping:
                out.append(mapping[n])
                i += 2
            elif n == "u" and s[i + 2:i + 6].isalnum():
                try:
                    out.append(chr(int(s[i + 2:i + 6], 16)))
                    i += 6
                except ValueError:
                    out.append(c)
                    i += 1
            else:
                out.append(c)
                i += 1
        else:
            out.append(c)
            i += 1
    return "".join(out)


class JSParser:
    """Parser minimal untuk literal objek/array JS (subset lesson files).

    Mendukung: {kunci: nilai}, [a, b], string "..." / '...' / `...`,
    angka, true/false/null, identifier (dikembalikan sebagai ("ref", nama)),
    koma akhir. Tidak mendukung fungsi/regex.
    """

    def __init__(self, text: str, pos: int = 0):
        self.s = text
        self.i = pos

    def skip_ws(self):
        while self.i < len(self.s) and self.s[self.i] in " \t\r\n":
            self.i += 1

    def peek(self):
        self.skip_ws()
        return self.s[self.i] if self.i < len(self.s) else ""

    def parse(self):
        self.skip_ws()
        return self.parse_value()

    def parse_value(self):
        self.skip_ws()
        c = self.s[self.i] if self.i < len(self.s) else ""
        if c == "{":
            return self.parse_object()
        if c == "[":
            return self.parse_array()
        if c in "\"'`":
            return self.parse_string()
        if c == "-" or c.isdigit() or c == "(":
            return self.parse_expr()
        return self.parse_ident()

    def parse_expr(self, min_prec: int = 0):
        """Ekspresi numerik sederhana: 1 / 3, 210_000_000 / 3475,
        0.95 ** 100, (a+b)*c."""
        left = self.parse_primary()
        while True:
            self.skip_ws()
            if self.i >= len(self.s):
                return left
            if self.s[self.i:self.i + 2] == "**":
                if 3 < min_prec:
                    return left
                self.i += 2
                right = self.parse_expr(3)  # pangkat: asosiatif kanan
                left = left ** right
                continue
            if self.s[self.i] not in "+-*/":
                return left
            op = self.s[self.i]
            prec = 1 if op in "+-" else 2
            if prec < min_prec:
                return left
            self.i += 1
            right = self.parse_expr(prec + 1)
            left = {"+": left + right, "-": left - right,
                    "*": left * right, "/": left / right}[op]

    def parse_primary(self):
        self.skip_ws()
        if self.s[self.i] == "(":
            self.i += 1
            v = self.parse_expr()
            self.skip_ws()
            if self.s[self.i] == ")":
                self.i += 1
            return v
        return self.parse_number()

    def parse_object(self):
        obj = {}
        self.i += 1  # {
        while True:
            self.skip_ws()
            if self.i >= len(self.s):
                raise ValueError("objek JS tak tertutup")
            if self.s[self.i] == "}":
                self.i += 1
                return obj
            if self.s[self.i] == ",":
                self.i += 1
                continue
            key = self.parse_key()
            self.skip_ws()
            if self.i >= len(self.s) or self.s[self.i] != ":":
                raise ValueError(f"harus ':' setelah kunci {key!r}")
            self.i += 1
            obj[key] = self.parse_value()

    def parse_key(self):
        self.skip_ws()
        c = self.s[self.i]
        if c in "\"'`":
            return self.parse_string()
        m = re.compile(r"[A-Za-z_$][A-Za-z0-9_$]*").match(self.s, self.i)
        if not m:
            raise ValueError(f"kunci tak dikenal di posisi {self.i}")
        self.i = m.end()
        return m.group(0)

    def parse_array(self):
        arr = []
        self.i += 1  # [
        while True:
            self.skip_ws()
            if self.i >= len(self.s):
                raise ValueError("array JS tak tertutup")
            if self.s[self.i] == "]":
                self.i += 1
                break
            if self.s[self.i] == ",":
                self.i += 1
                continue
            arr.append(self.parse_value())
        # Bentuk misi: ["a", "b"].join("\n") — gabungkan elemen string.
        self.skip_ws()
        if self.s[self.i:self.i + 6] == ".join(":
            self.i += 6
            self.skip_ws()
            sep = self.parse_string()
            self.skip_ws()
            if self.i < len(self.s) and self.s[self.i] == ")":
                self.i += 1
            return sep.join(str(x) for x in arr)
        return arr

    def parse_string(self):
        quote = self.s[self.i]
        self.i += 1
        buf = []
        while self.i < len(self.s):
            c = self.s[self.i]
            if c == "\\" and self.i + 1 < len(self.s):
                buf.append(self.s[self.i:self.i + 2])
                self.i += 2
            elif c == quote:
                self.i += 1
                return unescape_ts("".join(buf))
            else:
                buf.append(c)
                self.i += 1
        raise ValueError("string JS tak tertutup")

    def parse_number(self):
        m = re.compile(r"-?\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?").match(self.s, self.i)
        if not m:
            raise ValueError(f"angka tak dikenal di posisi {self.i}")
        self.i = m.end()
        tok = m.group(0).replace("_", "")
        return float(tok) if ("." in tok or "e" in tok or "E" in tok) else int(tok)

    def parse_ident(self):
        m = re.compile(r"[A-Za-z_$][A-Za-z0-9_$]*").match(self.s, self.i)
        if not m:
            raise ValueError(f"nilai tak dikenal di posisi {self.i}: "
                             f"{self.s[self.i:self.i + 20]!r}")
        self.i = m.end()
        tok = m.group(0)
        if tok == "true":
            return True
        if tok == "false":
            return False
        if tok == "null":
            return None
        if tok == "undefined":
            return None
        return ("ref", tok)


def extract_template(text: str, pos: int) -> tuple[str, int]:
    """Ambil isi template literal `...` mulai di pos (pos menunjuk backtick).
    Mengembalikan (isi_mentah, posisi_setelah_backtick_penutup)."""
    assert text[pos] == "`"
    i = pos + 1
    buf = []
    while i < len(text):
        c = text[i]
        if c == "\\" and i + 1 < len(text):
            buf.append(text[i:i + 2])
            i += 2
        elif c == "`":
            return "".join(buf), i + 1
        else:
            buf.append(c)
            i += 1
    raise ValueError("template literal tak tertutup")


def find_matching(text: str, pos: int, open_c: str, close_c: str) -> int:
    """Posisi karakter penutup yang sepadan (abaikan string/template)."""
    depth = 0
    i = pos
    while i < len(text):
        c = text[i]
        if c in "\"'`":
            quote = c
            i += 1
            while i < len(text):
                if text[i] == "\\" and i + 1 < len(text):
                    i += 2
                elif text[i] == quote:
                    i += 1
                    break
                else:
                    i += 1
            continue
        if c == open_c:
            depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError(f"tidak ada penutup {close_c!r}")

# ---------------------------------------------------------------------------
# Ekstraksi lab dari satu file lesson
# ---------------------------------------------------------------------------

LAB_ID_RE = re.compile(r'id:\s*"([^"]*)"')
CODE_BLOCK_RE = re.compile(r"\bcode:\s*\{")
SQLLAB_RE = re.compile(r"\bsqlLab:\s*\{")
CONST_STR_RE = re.compile(
    r"const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(`|\"|')")

PY_REQUIRES_MAP = {
    "pandas": "pandas", "numpy": "numpy", "scipy": "scipy",
    "matplotlib": "matplotlib", "scikit-learn": "sklearn",
    "statsmodels": "statsmodels", "sqlite3": "sqlite3",
}


def collect_const_strings(text: str) -> dict[str, str]:
    """Semua `const NAMA = "..."` / `const NAMA = `...`` di file (schema/seed)."""
    consts: dict[str, str] = {}
    for m in CONST_STR_RE.finditer(text):
        name, quote = m.group(1), m.group(2)
        start = m.end() - 1  # posisi karakter quote
        try:
            if quote == "`":
                raw, _ = extract_template(text, start)
                consts[name] = unescape_ts(raw)
            else:
                p = JSParser(text, start)
                consts[name] = p.parse_string()
        except ValueError:
            continue
    return consts


def resolve(value, consts: dict[str, str]):
    if isinstance(value, tuple) and len(value) == 2 and value[0] == "ref":
        return consts.get(value[1])
    return value


def substitute_ts_interpolations(raw: str, consts: dict[str, str]) -> str:
    """Ganti interpolasi template literal ${NAMA} dengan nilai konstanta
    file (mis. ${CSV_KOTOR} di solusi d5). Hanya yang namanya ADA di consts;
    \\${...} (escaped = literal) tidak disentuh. Dilakukan pada teks MENTAH
    sebelum unescape, agar nilai konstanta tidak ikut ter-unescape."""
    placeholders: dict[str, str] = {}

    def repl(m):
        name = m.group(1)
        if name not in consts:
            return m.group(0)
        key = "\x00TS_CONST_%d\x00" % len(placeholders)
        placeholders[key] = consts[name]
        return key

    out = re.sub(r"(?<!\\)\$\{([A-Za-z_$][A-Za-z0-9_$]*)\}", repl, raw)
    out = unescape_ts(out)
    for key, val in placeholders.items():
        out = out.replace(key, val)
    return out


def extract_labs(path: Path) -> list[dict]:
    """Kembalikan daftar lab {kind, id, file, solution, checks|sqlLab, requires}."""
    text = path.read_text(encoding="utf-8")
    consts = collect_const_strings(text)
    labs: list[dict] = []

    # --- Lab Python: blok `code: { ... solution: `...`, checks: [...] }` ---
    for m in CODE_BLOCK_RE.finditer(text):
        brace = text.index("{", m.start())
        end = find_matching(text, brace, "{", "}")
        block = text[brace:end + 1]
        # id lab terdekat SEBELUM blok code ini (dalam step yang sama)
        ids = list(LAB_ID_RE.finditer(text, 0, m.start()))
        lab_id = ids[-1].group(1) if ids else "?"
        # solution: template literal atau string "..."
        sm = re.search(r"\bsolution:\s*(`|\"|')", block)
        if not sm:
            continue
        spos = block.index(sm.group(1), sm.start())
        if sm.group(1) == "`":
            raw, _ = extract_template(block, spos)
            solution = substitute_ts_interpolations(raw, consts)
        else:
            solution = JSParser(block, spos).parse_string()
        # checks: [...]
        cm = re.search(r"\bchecks:\s*\[", block)
        checks: list = []
        if cm:
            cpos = block.index("[", cm.start())
            cend = find_matching(block, cpos, "[", "]")
            try:
                checks = JSParser(block, cpos).parse()
            except ValueError:
                checks = [{"__parse_error__": block[cpos:cend + 1][:200]}]
        # requires (di level step, di atas blok code): cari mundur
        rm = re.search(r"requires:\s*\[([^\]]*)\]",
                       text[max(0, m.start() - 3000):m.start()])
        requires: list[str] = []
        if rm:
            requires = re.findall(r'"([^"]+)"', rm.group(1))
        labs.append({"kind": "python", "id": lab_id, "file": path.name,
                     "solution": solution, "checks": checks,
                     "requires": requires})

    # --- Lab SQL: blok `sqlLab: { ... }` ---
    for m in SQLLAB_RE.finditer(text):
        brace = text.index("{", m.start())
        end = find_matching(text, brace, "{", "}")
        block = text[brace:end + 1]
        ids = list(LAB_ID_RE.finditer(text, 0, m.start()))
        lab_id = ids[-1].group(1) if ids else "?"
        try:
            spec = JSParser(block).parse()
        except ValueError as e:
            labs.append({"kind": "sql", "id": lab_id, "file": path.name,
                         "parse_error": str(e)})
            continue
        spec["schema"] = resolve(spec.get("schema"), consts)
        spec["seedData"] = resolve(spec.get("seedData"), consts)
        labs.append({"kind": "sql", "id": lab_id, "file": path.name,
                     "sqlLab": spec})
    return labs


# ---------------------------------------------------------------------------
# Eksekusi lab Python — semantik check = pyodide.worker.ts buildScript()
# ---------------------------------------------------------------------------

def uses_token(tree, token: str) -> bool:
    if tree is None:
        return False
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and node.id == token:
            return True
        if isinstance(node, ast.Attribute) and node.attr == token:
            return True
    return False


def _values_equal(v, e, tol: float) -> bool:
    """Perbandingan nilai check `equal` yang sadar array.

    Worker app (pyodide.worker.ts) memakai `v == e` mentah — untuk nilai
    array (mis. `mu = [20.0, 10.0]` vs ndarray hasil solusi) itu
    menghasilkan array boolean dan `bool(...)` meledak, sehingga di browser
    lab-nya error "Hasil check tidak terbaca". Harness ini membandingkan
    elemen-demi-elemen agar bisa membedakan: nilai BENAR tapi spesifikasi
    check-nya yang tidak bisa dievaluasi runtime (→ perbaiki check/spec)
    vs nilai memang SALAH (→ perbaiki konten)."""
    try:
        import numpy as np
        if isinstance(v, np.ndarray):
            v = v.tolist()
        if isinstance(e, np.ndarray):
            e = e.tolist()
    except ImportError:
        pass
    if isinstance(v, (list, tuple)) and isinstance(e, (list, tuple)):
        if len(v) != len(e):
            return False
        return all(_values_equal(a, b, tol) for a, b in zip(v, e))
    if isinstance(v, (int, float)) and isinstance(e, (int, float)) and tol:
        return abs(v - e) <= tol
    return v == e


class LabTimeout(Exception):
    pass


def _alarm_handler(signum, frame):
    raise LabTimeout()


def run_python_lab(solution: str, checks: list, timeout: int = 30) -> dict:
    """Jalankan solusi; kembalikan {status, stdout, error, failed_checks}."""
    if checks and isinstance(checks[0], dict) and "__parse_error__" in checks[0]:
        return {"status": "ERROR", "error": "gagal parse checks di file sumber",
                "stdout": "", "failed_checks": []}
    ns: dict = {}
    buf = io.StringIO()
    err = None
    old_stdout, old_stdin = sys.stdout, sys.stdin
    sys.stdout = buf
    sys.stdin = io.StringIO("")  # input() -> EOFError, bukan blokir
    old_handler = None
    try:
        try:
            old_handler = signal.signal(signal.SIGALRM, _alarm_handler)
            signal.setitimer(signal.ITIMER_REAL, timeout)
            compiled = compile(solution, "<langkah>", "exec")
            exec(compiled, ns)
        except LabTimeout:
            err = "TimeoutError: eksekusi melebihi %d detik" % timeout
        except SyntaxError as e:
            err = "SyntaxError: %s (baris %s)" % (e.msg, e.lineno)
        except Exception as e:
            err = "%s: %s" % (type(e).__name__, e)
        finally:
            signal.setitimer(signal.ITIMER_REAL, 0)
            if old_handler is not None:
                signal.signal(signal.SIGALRM, old_handler)
    finally:
        sys.stdout, sys.stdin = old_stdout, old_stdin
    stdout = buf.getvalue()

    if err is not None:
        return {"status": "ERROR", "error": err, "stdout": stdout,
                "failed_checks": []}
    try:
        tree = ast.parse(solution)
    except Exception:
        tree = None
    failed = []
    for spec in checks:
        kind = spec.get("kind")
        ok, detail = False, ""
        try:
            if kind == "defined":
                ok = spec["name"] in ns
                detail = "" if ok else "tidak terdefinisi"
            elif kind == "equal":
                v, e = ns.get(spec.get("name")), spec.get("value")
                tol = spec.get("tol") or 0
                ok = _values_equal(v, e, tol)
                detail = "" if ok else "hasilmu %r (diharapkan %r)" % (v, e)
            elif kind == "contains":
                c = ns.get(spec.get("name"))
                ok = c is not None and spec.get("value") in c
                detail = "" if ok else "tidak ditemukan"
            elif kind == "stdout_matches":
                ok = re.search(spec.get("pattern", ""), stdout) is not None
                detail = "" if ok else "output tidak cocok"
            elif kind == "uses":
                ok = uses_token(tree, spec.get("token", ""))
                detail = "" if ok else "tidak dipakai"
            elif kind == "forbids":
                ok = not uses_token(tree, spec.get("token", ""))
                detail = "" if ok else "seharusnya tidak dipakai"
            else:
                detail = "jenis check tidak dikenal: %r" % (kind,)
        except Exception:
            ok, detail = False, "gagal dievaluasi"
        if not ok:
            failed.append({"task": spec.get("task"),
                           "label": spec.get("label", kind),
                           "detail": detail})
    return {"status": "FAIL" if failed else "PASS", "stdout": stdout,
            "error": None, "failed_checks": failed}


# ---------------------------------------------------------------------------
# Eksekusi lab SQL — bandingkan himpunan baris (types.ts SqlLabSpec)
# ---------------------------------------------------------------------------

def _cell_eq(a, b, tol: float) -> bool:
    if a is None or b is None:
        return a is None and b is None
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(float(a) - float(b)) <= tol
    return a == b


def _rows_equal(got: list, exp: list, tol: float, order: bool) -> bool:
    if len(got) != len(exp):
        return False
    if order:
        return all(all(_cell_eq(g, e, tol) for g, e in zip(gr, er))
                   for gr, er in zip(got, exp))
    remaining = [list(r) for r in exp]
    for gr in got:
        hit = None
        for i, er in enumerate(remaining):
            if len(gr) == len(er) and all(_cell_eq(g, e, tol)
                                          for g, e in zip(gr, er)):
                hit = i
                break
        if hit is None:
            return False
        remaining.pop(hit)
    return not remaining


def run_sql_lab(spec: dict) -> dict:
    schema, seed = spec.get("schema"), spec.get("seedData")
    solution = spec.get("solution")
    if not schema or not seed or not solution:
        return {"status": "SKIP",
                "error": "schema/seedData/solution tidak lengkap "
                         "(mungkin memakai konstanta yang tidak ter-resolve)",
                "stdout": "", "failed_checks": []}
    tol = spec.get("floatTol") or 1e-6
    order = bool(spec.get("orderMatters"))
    try:
        con = sqlite3.connect(":memory:")
        try:
            con.executescript(schema)
            con.executescript(seed)
            # Solusi boleh berisi >1 pernyataan (mis. misi-gabung-lineage-governance:
            # Q1 orphan + Q2 pelanggaran retensi; tugas meminta "dua query terpisah").
            # Jalankan berurutan; yang dibandingkan adalah pernyataan TERAKHIR
            # (sesuai expectedColumns/expectedRows). Check tidak dilemahkan:
            # kolom + baris hasil akhir tetap dibandingkan persis.
            cur = None
            for _stmt in solution.split(";"):
                _stmt = _stmt.strip()
                if _stmt:
                    cur = con.execute(_stmt)
            cols = [d[0] for d in cur.description] if cur.description else []
            rows = cur.fetchall()
        finally:
            con.close()
    except Exception as e:
        return {"status": "ERROR", "error": "%s: %s" % (type(e).__name__, e),
                "stdout": "", "failed_checks": []}
    failed = []
    exp_cols = spec.get("expectedColumns") or []
    # App membandingkan kolom case-insensitive + trim (SqlLab.tsx compareResult).
    if [str(c).strip().lower() for c in cols] != [str(c).strip().lower()
                                                  for c in exp_cols]:
        failed.append({"task": None, "label": "kolom hasil",
                       "detail": "dapat %r, diharapkan %r" % (cols, exp_cols)})
    exp_rows = spec.get("expectedRows") or []
    if not _rows_equal(rows, exp_rows, tol, order):
        failed.append({"task": None, "label": "baris hasil",
                       "detail": "dapat %r, diharapkan %r" % (rows, exp_rows)})
    return {"status": "FAIL" if failed else "PASS", "stdout": "",
            "error": None, "failed_checks": failed}

# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def check_requires(requires: list[str]) -> str | None:
    """Kembalikan nama paket yang hilang (None bila semua tersedia)."""
    for pkg in requires or []:
        mod = PY_REQUIRES_MAP.get(pkg, pkg)
        try:
            __import__(mod)
        except ImportError:
            return pkg
    return None


BROWSER_ONLY_RE = re.compile(r"^\s*(?:import|from)\s+(pyodide|js)\b", re.M)


def check_browser_only(solution: str) -> bool:
    """True bila solusi memakai API yang hanya ada di Pyodide/browser
    (mis. `import pyodide`, `from js import ...`) — tidak bisa dieksekusi
    CPython lokal; dilaporkan SKIP, bukan PASS/FAIL."""
    return bool(BROWSER_ONLY_RE.search(solution))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--file", help="hanya file ini (nama file .ts, mis. cr13-ead-ccf.ts)")
    ap.add_argument("--only", choices=["python", "sql"], help="hanya jenis lab ini")
    ap.add_argument("--timeout", type=int, default=30,
                    help="batas detik per lab Python (default 30)")
    ap.add_argument("--list", action="store_true",
                    help="hanya hitung lab, jangan eksekusi")
    args = ap.parse_args(argv)

    files = sorted(ROOT.glob("*.ts"))
    if args.file:
        files = [f for f in files if f.name == args.file]
        if not files:
            print(f"file tidak ditemukan: {args.file}")
            return 2

    all_labs: list[dict] = []
    parse_errors: list[tuple[str, str]] = []
    for f in files:
        try:
            all_labs.extend(extract_labs(f))
        except Exception as e:
            parse_errors.append((f.name, "%s: %s" % (type(e).__name__, e)))

    if args.list:
        n_py = sum(1 for l in all_labs if l["kind"] == "python")
        n_sql = sum(1 for l in all_labs if l["kind"] == "sql")
        print(f"lab Python: {n_py}\nlab SQL: {n_sql}\ntotal: {len(all_labs)}")
        for name, err in parse_errors:
            print(f"PARSE ERROR {name}: {err}")
        return 0

    t0 = time.time()
    counts = {"PASS": 0, "FAIL": 0, "ERROR": 0, "SKIP": 0}
    failures: list[dict] = []
    for lab in all_labs:
        if args.only and lab["kind"] != args.only:
            continue
        if lab["kind"] == "python":
            missing = check_requires(lab.get("requires") or [])
            if missing:
                counts["SKIP"] += 1
                failures.append({**lab, "status": "SKIP",
                                 "error": f"paket {missing} tidak terinstal lokal"})
                continue
            if check_browser_only(lab["solution"]):
                counts["SKIP"] += 1
                failures.append({**lab, "status": "SKIP",
                                 "error": "memakai API Pyodide/browser "
                                          "(import pyodide/js) — hanya bisa "
                                          "diverifikasi di browser"})
                continue
            res = run_python_lab(lab["solution"], lab["checks"], args.timeout)
        else:
            if "parse_error" in lab:
                res = {"status": "ERROR", "error": lab["parse_error"],
                       "stdout": "", "failed_checks": []}
            else:
                res = run_sql_lab(lab["sqlLab"])
        counts[res["status"]] += 1
        if res["status"] != "PASS":
            failures.append({**lab, **res})
            print(f"[{res['status']}] {lab['file']} :: {lab['id']}", flush=True)
            if res.get("error"):
                print(f"    err: {res['error']}", flush=True)
            for fc in res.get("failed_checks") or []:
                print(f"    check gagal: {fc.get('label')} — {fc.get('detail')}",
                      flush=True)
    dt = time.time() - t0
    print(f"\n=== RINGKASAN ({dt:.1f} dtk) ===")
    print(f"PASS={counts['PASS']}  FAIL={counts['FAIL']}  "
          f"ERROR={counts['ERROR']}  SKIP={counts['SKIP']}")
    for name, err in parse_errors:
        print(f"PARSE ERROR {name}: {err}")
    if failures:
        print("\nLab bermasalah:")
        for f in failures:
            print(f"  - {f['file']} :: {f['id']} [{f['status']}]")
    return 1 if (counts["FAIL"] or counts["ERROR"] or parse_errors) else 0


if __name__ == "__main__":
    sys.exit(main())
