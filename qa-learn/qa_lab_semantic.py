#!/usr/bin/env python3
"""QA Learn — guard semantik kode lab (GG-9 + kelas baru R8).

Latar (2026-11-09, ronde 8): `qa_lab_starter_compile` hanya memeriksa
kode lab bisa di-compile — dua bug lolos karena kode jalan tapi SALAH
secara semantik: sampler Beta b17 (dua draw Gamma(a) berbeda → bukan
Beta(a,b)) dan `pack_context` aai14 (ringkasan +150 tanpa reservasi ruang
→ total melebihi budget). Guard ini MENGEKSEKUSI kode solusi yang
diekstrak dari file lesson (.ts) lalu menegaskan INVARIAN SEMANTIK dari
distribusi/konsep yang diklaim — bukan membandingkan string.

KELAS vs STRING (aturan Septian 2026-11-09 00:53): guard ini mengunci
KELAS "kode lab harus memenuhi invarian konsep yang diklaim" (distribusi
yang disampling, budget yang tidak dilanggar, ranking ties yang benar,
fixture yang lengkap untuk konsepnya). Polanya umum: tiap lab baru yang
mengklaim distribusi/anggaran/ranking bisa ditambah satu invarian di
bawah tanpa mengubah kerangka. KETERBATASAN: invarian harus ditulis
per lab oleh manusia (tidak ada cara otomatis menurunkan "distribusi
yang diklaim" dari prose); lab yang belum punya invarian di sini belum
terkunci — mitigasi: daftar invarian tumbuh tiap ronde + prompt review
ronde berikut wajib menanyakan invarian semantik tiap lab baru.

Jalankan: python3 qa_lab_semantic.py
Keluar 0 = lolos; 1 = ada invarian semantik yang dilanggar.
"""
import math
import re
import sqlite3
import sys
from pathlib import Path

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"


def _unescape_ts(raw: str) -> str:
    """Unescape string template-literal TS tanpa merusak non-ASCII literal."""
    out = []
    i = 0
    esc = {"n": "\n", "t": "\t", "r": "\r", "\\": "\\", "`": "`", "$": "$",
           '"': '"', "'": "'"}
    while i < len(raw):
        c = raw[i]
        if c == "\\" and i + 1 < len(raw):
            out.append(esc.get(raw[i + 1], raw[i + 1]))
            i += 2
        else:
            out.append(c)
            i += 1
    return "".join(out)


def extract_solution(text: str, nth: int = 0) -> str:
    """Ambil blok `solution: `...`` ke-n dari teks lesson (template literal)."""
    hits = []
    for m in re.finditer(r"solution:\s*`", text):
        j = m.end()
        buf = []
        while j < len(text) and text[j] != "`":
            if text[j] == "\\" and j + 1 < len(text) and text[j + 1] == "`":
                buf.append("`")
                j += 2
            else:
                buf.append(text[j])
                j += 1
        hits.append("".join(buf))
    if nth >= len(hits):
        raise AssertionError(f"blok solution ke-{nth} tidak ditemukan "
                             f"(hanya {len(hits)})")
    return _unescape_ts(hits[nth])


def extract_const(text: str, name: str) -> str:
    m = re.search(r"const " + re.escape(name) + r" = `", text)
    if not m:
        raise AssertionError(f"const {name} tidak ditemukan")
    j = m.end()
    buf = []
    while j < len(text) and text[j] != "`":
        if text[j] == "\\" and j + 1 < len(text) and text[j + 1] == "`":
            buf.append("`")
            j += 2
        else:
            buf.append(text[j])
            j += 1
    return _unescape_ts("".join(buf))


def main() -> int:
    fails: list[str] = []

    # --- b17: sampler Beta(a,b) harus benar-benar Beta(a,b) ---------------
    # Invarian: mean sampel ≈ a/(a+b); P(X>0,07) dekat ekor eksak 0,0102.
    t = (CONTENT / "b17-bayesian-praktis.ts").read_text(encoding="utf-8")
    sol = extract_solution(t, 3)  # blok ke-4 = lab sampler Beta
    # Kunci struktural (bukan statistik semata): sampler Gamma-ratio yang
    # benar menarik tiap Gamma TEPAT SEKALI. Bug R8: `gammavariate(a,1)`
    # dipanggil DUA kali (dua draw berbeda) → X1/(X2+Y) bukan Beta(a,b).
    # Uji statistik saja TIDAK cukup: mean buggy 0,0527 ≈ mean benar 0,0524.
    n_a = sol.count("gammavariate(a,1)")
    n_b = sol.count("gammavariate(b,1)")
    if n_a != 1 or n_b != 1:
        print(f"FAIL b17 :: sampler menarik Gamma(a,1) {n_a}x dan "
              f"Gamma(b,1) {n_b}x (mau tepat 1x tiap-tiap — satu draw per "
              f"variabel, bukan dua draw Gamma(a) berbeda)")
        fails.append("b17-sampler")
    ns: dict = {}
    try:
        exec(compile(sol, "b17-solution", "exec"), ns)  # noqa: S102
    except Exception as e:  # noqa: BLE001
        print(f"FAIL b17 :: solusi tidak bisa dieksekusi: {e}")
        fails.append("b17-sampler")
    else:
        samp = ns.get("samp", [])
        mean = sum(samp) / len(samp) if samp else float("nan")
        p7, p10 = ns.get("p7"), ns.get("p10")
        ok = (abs(mean - 53 / 1010) < 0.01 and p7 is not None
              and 0.005 < p7 < 0.02 and p10 is not None and p10 < 0.002)
        if ok:
            print(f"OK   b17 :: sampler Beta(53,957) mean={mean:.4f} "
                  f"(teori 0,0525) p7={p7:.4f} p10={p10:.4f}")
        else:
            print(f"FAIL b17 :: sampler menyimpang: mean={mean:.4f} "
                  f"p7={p7} p10={p10} (teori mean 0,0525, ekor P(>0,07)=0,0102)")
            fails.append("b17-sampler")

    # --- aai14: pack_context TIDAK PERNAH melebihi budget ------------------
    t = (CONTENT / "aai14-context-engineering.ts").read_text(encoding="utf-8")
    sol = extract_solution(t, 0)
    ns = {}
    try:
        exec(compile(sol, "aai14-solution", "exec"), ns)  # noqa: S102
    except Exception as e:  # noqa: BLE001
        print(f"FAIL aai14 :: solusi tidak bisa dieksekusi: {e}")
        fails.append("aai14-pack")
        ns = {}
    if ns:
        pc, msgs = ns["pack_context"], ns["MSGS"]
        cases = {800: (800, False), 2000: (950, True), 4000: (3950, True),
                 5300: (5300, False), 6000: (5300, False)}
        bad = []
        for budget, (want_total, want_summary) in cases.items():
            packed, used = pc(msgs, budget)
            ids = [m["id"] for m in packed]
            has_summary = "ringkasan" in ids
            if used != want_total or used > budget or has_summary != want_summary:
                bad.append(f"BUDGET={budget}: total={used} (mau {want_total}), "
                           f"ringkasan={has_summary} (mau {want_summary})")
        if bad:
            print("FAIL aai14 :: " + "; ".join(bad))
            fails.append("aai14-pack")
        else:
            print("OK   aai14 :: pack_context total<=budget di semua budget "
                  "(800→800, 2000→950, 4000→3950, 5300→5300 tanpa ringkasan)")

    # --- a16: rank() harus menangani ties dengan rata-rata ranking --------
    t = (CONTENT / "a16-korelasi.ts").read_text(encoding="utf-8")
    sol = extract_solution(t, 2)  # blok ke-3 = lab Spearman (rank)
    ns = {}
    try:
        exec(compile(sol, "a16-solution", "exec"), ns)  # noqa: S102
    except Exception as e:  # noqa: BLE001
        print(f"FAIL a16 :: solusi tidak bisa dieksekusi: {e}")
        fails.append("a16-rank")
        ns = {}
    if ns:
        got = ns["rank"]([1, 2, 2, 4])
        if got == [1, 2.5, 2.5, 4]:
            print(f"OK   a16 :: rank([1,2,2,4])={got} (rata-rata ties)")
        else:
            print(f"FAIL a16 :: rank([1,2,2,4])={got} (mau [1, 2.5, 2.5, 4])")
            fails.append("a16-rank")

    # --- biz13: gap_max = max atas SEMUA bucket, bukan hanya kandidat -----
    t = (CONTENT / "biz13-ai.ts").read_text(encoding="utf-8")
    sols = [extract_solution(t, i) for i in range(2)]
    ns = {}
    try:
        exec(compile(sols[1], "biz13-solution", "exec"), ns)  # noqa: S102
    except Exception as e:  # noqa: BLE001
        print(f"FAIL biz13 :: solusi lab kalibrasi tidak bisa dieksekusi: {e}")
        fails.append("biz13-gap")
        ns = {}
    if ns:
        kal = ns["kalibrasi"]
        all_max = max(c - acc for c, acc in kal.items())
        if ns["gap_max"] == 35 and all_max == 35:
            print(f"OK   biz13 :: gap_max={ns['gap_max']} = max semua bucket "
                  f"({kal})")
        else:
            print(f"FAIL biz13 :: gap_max={ns['gap_max']} vs max semua "
                  f"bucket={all_max} (kalibrasi={kal})")
            fails.append("biz13-gap")

    # --- c14: fixture HARUS punya kolom waktu + kota (konsep impossible travel)
    t = (CONTENT / "c14-fraud-velocity.ts").read_text(encoding="utf-8")
    setup = extract_const(t, "SETUP")
    # Periksa blok CREATE TABLE transaksi-nya (bukan tabel nasabah yang
    # memang sudah punya kolom kota): lab impossible travel butuh kolom
    # waktu + kota DI TABEL TRANSAKSI.
    m_tbl = re.search(r"CREATE TABLE transaksi \((.*?)\)", setup, re.S)
    tbl = m_tbl.group(1) if m_tbl else ""
    missing = [c for c in ("waktu", "kota") if c not in tbl]
    if missing:
        print(f"FAIL c14 :: tabel transaksi kehilangan kolom: {missing} "
              f"(lab impossible travel butuh waktu + kota)")
        fails.append("c14-fixture")
    else:
        ns = {"sqlite3": sqlite3}
        try:
            exec(compile(setup, "c14-setup", "exec"), ns)  # noqa: S102
            cur = ns["cur"]
            rows = cur.execute(
                "SELECT COUNT(*) FROM transaksi WHERE waktu IS NOT NULL "
                "AND kota IS NOT NULL").fetchone()[0]
            gaps = cur.execute(
                "SELECT MIN((julianday(waktu)-julianday(lalu))*24) FROM "
                "(SELECT waktu, LAG(waktu) OVER (PARTITION BY nasabah_id "
                "ORDER BY waktu) AS lalu FROM transaksi) WHERE lalu IS NOT NULL"
            ).fetchone()[0]
        except Exception as e:  # noqa: BLE001
            print(f"FAIL c14 :: fixture tidak bisa dieksekusi: {e}")
            fails.append("c14-fixture")
            rows, gaps = 0, None
        else:
            if rows >= 15 and gaps is not None and abs(gaps - 0.5) < 1e-6:
                # tol 1e-6 (bukan 1e-9): julianday() float — 30 menit =
                # 0,020833.. hari tak eksak biner; selisih terukur 3,7e-9 jam.
                print(f"OK   c14 :: fixture punya waktu+kota ({rows} baris), "
                      f"jeda tercepat={gaps} jam (Jakarta 10:00→Surabaya 10:30)")
            else:
                print(f"FAIL c14 :: fixture waktu/kota tidak lengkap "
                      f"(baris={rows}, jeda tercepat={gaps}, mau 0,5 jam)")
                fails.append("c14-fixture")

    print(f"QA LAB-SEMANTIC: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}"
          f" (5 invarian dipindai)")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
