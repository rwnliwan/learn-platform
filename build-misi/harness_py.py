"""Harness: jalankan solusi lab Python dengan open_url di-stub ke file lokal,
lalu verifikasi nilai ekspektasi persis seperti checks di TS."""
import sys, types, runpy
from pathlib import Path

LP = Path.home() / "workspace/learn-platform"

def run_solution(sol_path: Path, base_url: str, public_dir: Path, expected: dict):
    # stub pyodide.http.open_url -> path file lokal
    pyodide = types.ModuleType("pyodide")
    http = types.ModuleType("pyodide.http")
    def open_url(url: str):
        assert url.startswith(base_url), f"URL tak dikenal: {url}"
        return str(public_dir / url[len(base_url):].lstrip("/"))
    http.open_url = open_url
    pyodide.http = http
    sys.modules["pyodide"] = pyodide
    sys.modules["pyodide.http"] = http

    ns = runpy.run_path(str(sol_path))
    fails = []
    for name, want in expected.items():
        got = ns.get(name, "<HILANG>")
        if isinstance(want, float):
            ok = isinstance(got, (int, float)) and abs(float(got) - want) <= 0.06
        else:
            ok = got == want
        print(("PASS " if ok else "FAIL "), f"{name}: got={got} want={want}")
        if not ok:
            fails.append(name)
    return fails

if __name__ == "__main__":
    which = sys.argv[1]
    fails = []
    if which == "regulator-lab1":
        fails = run_solution(
            LP / "build-misi/misi-dashboard-regulator/sol_lab1.py",
            "/misi/misi-dashboard-regulator",
            LP / "public/misi/misi-dashboard-regulator",
            {
                "n_baris": 1871,
                "tgl_awal": "2026-01-01",
                "tgl_akhir": "2026-03-31",
                "n_valid": 1458,
                "n_user_aktif_jan": 288,
                "total_nominal_valid": 320815338,
                "jan_valid": 512,
                "feb_valid": 477,
                "mar_valid": 469,
                "selisih_dua_jalur": 0,
            },
        )
    elif which == "revenue-lab1":
        fails = run_solution(
            LP / "build-misi/misi-dua-definisi-revenue/sol_lab_tren.py",
            "/misi/misi-dua-definisi-revenue",
            LP / "public/misi/misi-dua-definisi-revenue",
            {
                "kas_q1": 48534170,
                "kas_q2": 22049107,
                "aku_q1": 31444151,
                "aku_q2": 39139126,
                "tumbuh_kas_pct": -54.57,
                "tumbuh_aku_pct": 24.47,
            },
        )
    elif which == "revenue-lab2":
        fails = run_solution(
            LP / "build-misi/misi-dua-definisi-revenue/sol_lab_qoq.py",
            "/misi/misi-dua-definisi-revenue",
            LP / "public/misi/misi-dua-definisi-revenue",
            {
                "g_kas_q1": 81.82,
                "g_aku_q1": 11.11,
                "g_kas_q2": -54.57,
                "g_aku_q2": 24.47,
            },
        )
    else:
        print("harness tak dikenal:", which)
        sys.exit(2)
    print("=== HARNESS:", "ALL PASS" if not fails else f"FAIL {fails}")
    sys.exit(1 if fails else 0)
