#!/usr/bin/env python3
"""QA Learn — guard konsistensi `expected` vs `check` lab (kelas cacat AAI10 R5).

Aturan: untuk tiap lab Python yang punya field `expected: "k=v\\n..."`, nilai tiap
kunci di `expected` WAJIB sama dengan yang ditegaskan check lab yang sama:
- check { kind: "equal", name, value } dengan name yang sama, dan
- check { kind: "stdout_matches", pattern } yang berupa literal `k=v` (per baris).

Latar: ronde 5 Terra menemukan AAI10 `expected` bilang node_dieksekusi=4 sementara
check menuntut 3 — learner yang mengikuti `expected` GAGAL check (cacat fungsional,
bukan sekadar prose). Guard ini menangkap kelas itu secara programatik di SEMUA lab.

Hanya membandingkan kunci yang SAMA di kedua sisi; check boleh menegaskan variabel
lain (mis. riset_total vs riset_diulang) tanpa memicu guard. Pola stdout_matches
yang mengandung meta-karakter regex dilewati (bukan literal).
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_lab_regression import JSParser, find_matching  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent.parent / "learn-platform"
CONTENT = ROOT / "src" / "app" / "v2" / "content"

EXPECTED_RE = re.compile(r"\bexpected:\s*(`|\"|')")
KV_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_\-\.]*)\s*=\s*(.+?)\s*$")
REGEX_META = re.compile(r"[.*+?()|\[\]{}\\^$]")


def parse_expected(raw: str):
    """Ekstrak token k=v dari string `expected` (dipisah spasi/baris baru).

    `expected` adalah contoh stdout: bentuknya bervariasi — satu k=v per baris
    ("node_dieksekusi=3"), beberapa k=v sebaris ("rata=1.5 macet=0.1"), atau teks
    bebas. Hanya token berbentuk k=v yang diekstrak; teks lain diabaikan.
    Kunci bisa muncul BERKALI-KALI dengan nilai berbeda (dua skenario dalam satu
    lab, mis. serial vs thread) — semua nilai disimpan; check lolos bila cocok
    dengan SALAH SATU nilai.
    Kembalikan dict k->[v, ...], atau None bila tidak ada token k=v sama sekali.
    """
    pairs: dict[str, list[str]] = {}
    # GG-6 (R8): `expected` kadang menulis "pi≈[0.88, 0.07, 0.05]" — tanda
    # "≈" membuat token k=v tidak terurai sehingga pasangan expected/check
    # yang bertentangan LOLOS tanpa diperiksa (kasus b14 R8: expected
    # [0.86,0.08,0.06] vs check [0.88,0.07,0.05]). Normalisasi "≈" → "="
    # agar bentuk itu ikut dibandingkan seperti k=v biasa.
    raw = raw.replace("≈", "=")
    toks = re.split(r"\s+", raw.strip())
    i = 0
    while i < len(toks):
        tok = toks[i]
        # nilai "USD 150144.76" terpisah spasi: gabung token mata uang + angka
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_\-\.]*)=(USD|Rp|\$)$", tok)
        if m and i + 1 < len(toks):
            tok = f"{m.group(1)}={m.group(2)}{toks[i + 1]}"
            i += 1
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_\-\.]*)=([^\s]+)$", tok)
        if m:
            pairs.setdefault(m.group(1), []).append(m.group(2))
        i += 1
    return pairs or None


def _unescape_ts(raw: str) -> str:
    """Unescape string TS tanpa merusak karakter non-ASCII literal.

    `unicode_escape` pada str UTF-8 menghasilkan mojibake (mis. '×' -> 'Ã—'),
    jadi hanya proses escape yang dikenal: \\n \\t \\r \\\\ \\" \\' dan \\uXXXX.
    """
    def _u(m):
        try:
            return chr(int(m.group(1), 16))
        except ValueError:
            return m.group(0)
    raw = re.sub(r"\\u([0-9a-fA-F]{4})", _u, raw)
    return (raw.replace("\\n", "\n").replace("\\t", "\t").replace("\\r", "\r")
               .replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\"))


def _token_number(tok: str):
    """Urai token display menjadi (angka, satuan, desimal) atau None.

    Format display yang dikenali: '%' dan 'pp' (check bisa menyimpan fraksi
    ATAU sudah persen — keduanya dicoba), 'B'/'M'/'K'/'jt' (miliar/juta/ribu;
    'M' sesudah 'Rp' = miliar), 'MB'/'ms'/'s'/'x', awalan mata uang, pemisah
    ribuan/koma desimal Indonesia ('6.738.000', '3,1237'), minus Unicode '−',
    akhiran '/satuan' ('12.60jt/bln', '1752/grup').
    """
    t = tok.strip().rstrip(",;.")
    t = t.replace("−", "-").replace("–", "-").rstrip("×")
    rp = t.startswith("Rp")
    t = re.sub(r"^(Rp|USD|\$)", "", t)
    t = t.split("/")[0]  # buang '/bln', '/grup', dst.
    # Pemisah angka: tentukan format dari pola, bukan tebakan.
    if "," in t and "." in t:
        if t.rfind(",") > t.rfind("."):
            t = t.replace(".", "").replace(",", ".")  # Indonesia: 1.234,56
        else:
            t = t.replace(",", "")  # US: 1,234.56
    elif "," in t:
        if re.fullmatch(r"[+-]?[1-9]\d{0,2}(,\d{3})+", t):
            t = t.replace(",", "")  # ribuan US: 1,600,000 (bukan 0,163)
        else:
            t = t.replace(",", ".")  # desimal Indonesia: 3,1237 / 0,163
    elif t.count(".") > 1:
        t = t.replace(".", "")  # ribuan Indonesia: 6.738.000
    elif rp and re.fullmatch(r"[+-]?\d+\.\d{3}", t):
        t = t.replace(".", "")  # Rp380.000 = 380.000 rupiah
    m = re.fullmatch(r"([+-]?[0-9]*\.?[0-9]+)(%|pp|jt|MB|B|M|K|ms|s|x)?", t)
    if not m:
        return None
    try:
        num = float(m.group(1))
    except ValueError:
        return None
    unit = m.group(2) or ""
    if unit == "M" and rp:
        unit = "Miliar"
    dec = len(m.group(1).split(".")[1]) if "." in m.group(1) else 0
    return num, unit, dec


def _num_equal(tok_num: float, tok_unit: str, check_num: float,
               tok_decimals: int, tol: float) -> bool:
    """Bandingkan angka check dengan angka token, di ruang satuan token."""
    factors = {"%": (100.0, 1.0), "pp": (100.0, 1.0), "B": (1e-9,),
               "Miliar": (1e-9,), "M": (1e-6,), "K": (1e-3,), "jt": (1e-6,),
               "MB": (1.0,), "ms": (1.0,), "s": (1.0,), "x": (1.0,), "": (1.0,)}
    for f in factors[tok_unit]:
        c = check_num * f
        if abs(c - tok_num) <= tol:
            return True
        if round(c, tok_decimals) == tok_num:
            return True
        # display kadang memotong (bukan membulatkan): 0.0000505 -> 0.000050
        import math
        trunc = math.floor(abs(c) * 10 ** tok_decimals) / 10 ** tok_decimals
        if (trunc if c >= 0 else -trunc) == tok_num:
            return True
        # display kadang membulatkan half-up (0.3085 -> 0.309) sementara
        # float repr Python membulatkan ke bawah — terima keduanya.
        from decimal import Decimal, ROUND_HALF_UP
        q = Decimal(1).scaleb(-tok_decimals)
        if Decimal(str(c)).quantize(q, rounding=ROUND_HALF_UP) == Decimal(str(tok_num)):
            return True
    return False


def _clean_str(s: str) -> str:
    return s.strip().strip("'\"").rstrip(",;.")


def values_equal(a: str, b, tol: float = 1e-9) -> bool:
    """Bandingkan nilai expected (str token) vs nilai check (angka/str/list/dict).

    `expected` adalah contoh stdout — angka di sana tampil dengan format display
    (persen, mata uang, ms, B/M, pembulatan, koma desimal Indonesia). Check
    menyimpan nilai mentah. Aturan: samakan dulu formatnya, lalu bandingkan;
    untuk string/list, token pertama check boleh sama dengan token expected
    (check sering menegaskan satu baris utuh sementara expected hanya
    menampilkan token pertamanya).
    """
    a = a.strip().rstrip(",;.")
    bs = str(b).strip()
    if a == bs:
        return True
    if isinstance(b, bool):
        return _clean_str(a) == str(b)
    if isinstance(b, (list, tuple)):
        if len(b) == 0:
            return False
        if bs.replace(" ", "") == a.replace(" ", ""):
            return True
        # token bisa berupa elemen pertama list yang tercetak ("[2,", "['rs2',")
        first_tok = a.lstrip("[").strip("'\"").rstrip(",;.")
        if first_tok == str(b[0]) or first_tok == str(b[0]).split(None, 1)[0]:
            return True
        tn_first = _token_number(first_tok)
        if (tn_first is not None and isinstance(b[0], (int, float))
                and _num_equal(tn_first[0], tn_first[1], float(b[0]), tn_first[2], tol)):
            return True
        if [x.strip() for x in a.split(",")] == [str(x) for x in b]:
            return True
        try:
            if int(float(a)) == len(b):
                return True
        except ValueError:
            pass
        return False
    if isinstance(b, dict):
        if bs.replace(" ", "") == a.replace(" ", ""):
            return True
        if bs.startswith(a):
            return True
        tn = _token_number(a)
        if tn is not None:
            for v in b.values():
                if isinstance(v, (int, float)) and _num_equal(tn[0], tn[1], float(v), tn[2], tol):
                    return True
        return False
    if isinstance(b, str):
        if _clean_str(a) == _clean_str(bs):
            return True
        # check string: bandingkan token pertamanya (baris utuh vs token)
        first = bs.split(None, 1)[0] if bs.split() else bs
        if _clean_str(a) == _clean_str(first):
            return True
        tn_a, tn_b = _token_number(a), _token_number(first)
        if tn_a is not None and tn_b is not None and tn_a[1] == tn_b[1]:
            return _num_equal(tn_a[0], tn_a[1], tn_b[0], tn_a[2], tol)
        return False
    # b angka
    tn = _token_number(a)
    if tn is not None:
        try:
            check_num = float(b)
        except (TypeError, ValueError):
            return False
        # token pecahan "1/3" (1 dari 3): bandingkan pembilang atau rasionya
        fm = re.fullmatch(r"(\d+)/(\d+)", a)
        if fm:
            n, d = int(fm.group(1)), int(fm.group(2))
            return check_num == n or abs(check_num - n / d) <= tol
        if _num_equal(tn[0], tn[1], check_num, tn[2], tol):
            return True
        # ribuan tanpa awalan Rp: "3.153" bisa berarti 3.153 atau 3.153 (ribuan)
        if re.fullmatch(r"[+-]?\d{1,3}\.\d{3}", a) and tn[1] == "":
            alt = _token_number(a.replace(".", ""))
            if alt is not None and _num_equal(alt[0], alt[1], check_num, alt[2], tol):
                return True
        # persen tanpa tanda '%': token 4.35 vs check 0.043478
        if 0 < check_num < 1 and tn[0] > 1 and tn[1] == "":
            return _num_equal(tn[0], "", check_num * 100, tn[2], tol)
        return False
    return False


def check_file(path: Path):
    """Kembalikan daftar (lab_id, kunci, expected, check) yang bertentangan."""
    text = path.read_text(encoding="utf-8")
    bad = []
    for m in EXPECTED_RE.finditer(text):
        q = m.group(1)
        start = m.end()
        if q == "`":
            # template literal: baca sampai backtick tak ter-escape
            j = start
            buf = []
            esc_map = {"n": "\n", "t": "\t", "r": "\r", "\\": "\\", "`": "`", "$": "$"}
            while j < len(text) and text[j] != "`":
                if text[j] == "\\" and j + 1 < len(text):
                    buf.append(esc_map.get(text[j + 1], text[j + 1]))
                    j += 2
                else:
                    buf.append(text[j])
                    j += 1
            raw = "".join(buf)
        else:
            end = text.find(q, start)
            if end == -1:
                continue
            raw = _unescape_ts(text[start:end])
        expected = parse_expected(raw)
        if not expected:
            continue
        # checks: [...] pertama setelah expected (dalam blok code step yang sama)
        cm = re.search(r"\bchecks:\s*\[", text[start:start + 40000])
        if not cm:
            continue
        cpos = start + cm.end() - 1  # indeks "[" pembuka array checks
        cend = find_matching(text, cpos, "[", "]")
        try:
            checks = JSParser(text, cpos).parse()
        except ValueError:
            continue
        if not isinstance(checks, list):
            continue
        for c in checks:
            if not isinstance(c, dict):
                continue
            kind = c.get("kind")
            if kind == "equal":
                name, value = c.get("name"), c.get("value")
                tol = c.get("tol", 1e-9)
                try:
                    tol = float(tol)
                except (TypeError, ValueError):
                    tol = 1e-9
                if name in expected and not any(
                        values_equal(v, value, tol) for v in expected[name]):
                    bad.append((path.name, name, expected[name], value))
            elif kind == "stdout_matches":
                pat = str(c.get("pattern", ""))
                for line in pat.split("\\n"):
                    line = line.strip()
                    mm = KV_RE.match(line)
                    # lewati pola berbentuk tabel ("d=8: 5 hari") — nilainya
                    # mengandung spasi, bukan satu token k=v yang bisa dibandingkan
                    if not mm or " " in mm.group(2) or REGEX_META.search(mm.group(2)):
                        continue
                    k, v = mm.group(1), mm.group(2)
                    if k in expected and not any(
                            values_equal(ev, v) for ev in expected[k]):
                        bad.append((path.name, k, expected[k], v))
    return bad


def main():
    files = sorted(CONTENT.glob("*.ts"))
    total_labs = 0
    bad = []
    for f in files:
        text = f.read_text(encoding="utf-8")
        total_labs += len(EXPECTED_RE.findall(text))
        bad.extend(check_file(f))
    if bad:
        print(f"QA LAB-EXPECTED-CHECK: {len(bad)} FAIL")
        for fname, key, exp, got in bad:
            print(f"  FAIL {fname} :: {key}: expected={exp!r} vs check={got!r}")
        sys.exit(1)
    print(f"QA LAB-EXPECTED-CHECK: ALL PASS "
          f"({total_labs} expected-field dipindai, {len(files)} file)")
    sys.exit(0)


if __name__ == "__main__":
    main()
