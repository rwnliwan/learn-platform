#!/usr/bin/env python3
"""QA Learn — cek angka M9 (baru, WAJIB, 2026-11-13).

Latar: kelas kesalahan berulang M7-M8 — angka di prose TIDAK ADA di
kanonik (dikarang / dikutip dari modul lain tanpa jejak). Guard ini
memindai semua angka di 5 lesson M9 (TS + .md, di luar blok svg dan blok
kode .md) dan menuntut setiap angka:
  (a) cocok dengan nilai di qa-learn/m9_canonical.json, ATAU
  (b) cocok dengan angka cross-ref yang dipetakan di check_m9_citations.py, ATAU
  (c) berada di baris/kalimat yang sama dengan label [notebook] /
      [ilustrasi] / [kebijakan ...] / [turunan] / [simulasi], ATAU
  (d) masuk allowlist konstanta standar (level alpha, nilai-z, tahun,
      jumlah hari bursa, hitungan struktural kecil).

Angka yang lolos dari (a)-(d) dicetak sebagai SUSPECT untuk ditinjau
manual oleh Chief — skrip ini pencari, bukan hakim. Keluar 1 bila ada
suspect (harus dibersihkan atau dijustifikasi sebelum review).
Jalankan: python3 qa-learn/check_m9_numbers.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_m9_citations import NUM_HOME  # noqa: E402

CANON = json.loads((ROOT / "qa-learn/m9_canonical.json").read_text())

# --- kumpulkan nilai kanonis sebagai himpunan float/int ternormalisasi ---
CANON_NUMS: set[float] = set()
CANON_STRS: set[str] = set()


def _walk(v):
    if isinstance(v, bool):
        return
    if isinstance(v, (int, float)):
        CANON_NUMS.add(float(v))
        CANON_STRS.add(str(v))
        if isinstance(v, int):
            CANON_STRS.add(f"{v:,}".replace(",", "."))
        return
    if isinstance(v, dict):
        for x in v.values():
            _walk(x)
    elif isinstance(v, list):
        for x in v:
            _walk(x)


_walk(CANON)

# cross-ref: semua angka dari peta sitasi -> nilai ternormalisasi
# (kunci persen menyumbang DUA skala: "28,5%" -> 0.285, "28,5" -> 28.5)
for k in NUM_HOME:
    kk = k.rstrip("%")
    v = float(kk.replace(".", "").replace(",", "."))
    CANON_NUMS.add(v)
    if k.endswith("%"):
        CANON_NUMS.add(v / 100.0)
# nilai kanonis 0<v<1 boleh ditulis sebagai persen ("5,72%" <-> 0,0572)
for _v in list(CANON_NUMS):
    if 0 < _v < 1:
        CANON_NUMS.add(_v * 100.0)


def _candidates(tok: str) -> list[float]:
    """Semua tafsir numerik yang masuk akal untuk satu token.

    Ambigu: "1.283" bisa ribuan Indonesia (1.283 = 1283) atau float Python
    (1.283). "1.645" bisa ribuan (1645) atau nilai-z (1.645). Kembalikan
    kedua tafsir bila ambigu; pemeriksaan lolos bila SALAH SATU cocok.
    Persen menyumbang dua skala: "9,8%" -> [0.098, 9.8] (pecahan dan angka
    persen — kanonik menyimpan keduanya di kunci berbeda).
    """
    pct = tok.endswith("%")
    s = tok.rstrip("%")
    out: list[float] = []
    if "," in s:
        # desimal koma Indonesia ("0,0329") atau ribuan+desimal ("1.283,5")
        try:
            out.append(float(s.replace(".", "").replace(",", ".")))
        except ValueError:
            pass
    elif re.fullmatch(r"\d{1,3}(?:\.\d{3})+", s):
        groups = s.split(".")
        if len(groups) == 2:
            # ambigu: ribuan vs float Python
            try:
                out.append(float("".join(groups)))
            except ValueError:
                pass
            try:
                out.append(float(s))
            except ValueError:
                pass
        else:
            try:
                out.append(float("".join(groups)))
            except ValueError:
                pass
    elif "." in s:
        # float Python ("0.000813", "1.96")
        try:
            out.append(float(s))
        except ValueError:
            pass
    else:
        try:
            out.append(float(s))
        except ValueError:
            pass
    if pct:
        out = [v / 100.0 for v in out] + out
    return out


def _decimals(tok: str) -> int:
    """Jumlah desimal yang ditampilkan token ('6,02' -> 2; '0,0329' -> 4)."""
    s = tok.rstrip("%")
    if "," in s:
        return len(s.split(",")[1])
    if re.fullmatch(r"\d+\.\d+", s):
        return len(s.split(".")[1])
    return 0


def _matches_canonical(v: float, tok: str) -> bool:
    """Cocok bila v sama dengan nilai kanonis (tanda diabaikan — besaran)
    ATAU sama dengan nilai kanonis yang dibulatkan ke desimal token
    ('6,02' cocok dengan 6,0216; '0,0393' cocok dengan 0,0392824) ATAU
    ke desimal yang LEBIH SEDIKIT ('0,001960' cocok dengan 0,001962
    yang dibulatkan ke 5 desimal; '64%' cocok dengan 64,15 yang
    dibulatkan ke 0 desimal) ATAU — untuk token bilangan bulat — sama
    dengan nilai kanonis yang dibulatkan ke ribuan/puluh-ribuan
    ('7.430.000' cocok dengan 7.432.406 yang dibulatkan ke 10^4).
    Aturannya tetap ketat: token harus hasil pembulatan ASLI dari nilai
    kanonis pada suatu presisi — bukan sekadar berdekatan."""
    d = _decimals(tok)
    # Token bilangan bulat: digit polos ATAU ribuan dengan pemisah titik
    # (7.430.000, 27.966.928). "0.0328" BUKAN token bulat (grup kedua
    # 4 digit), begitu pula "1.6449".
    s2 = tok.rstrip("%")
    is_int_tok = ("," not in s2) and (
        re.fullmatch(r"\d+", s2) or re.fullmatch(r"\d{1,3}(?:\.\d{3})+", s2))
    for c in CANON_NUMS:
        if _close(v, c) or _close(abs(v), abs(c)):
            return True
        # Untuk token "%", kandidat skala pecahan membawa 2 desimal lebih
        # banyak dari yang ditampilkan (8,5% = 0,085), jadi izinkan
        # k sampai d+2 di sana.
        d_eff = d + 2 if tok.endswith("%") else d
        for k in range(0, d_eff + 1):
            if round(c, k) == v or round(abs(c), k) == abs(v):
                return True
        if is_int_tok:
            for k in range(1, 7):
                if round(c, -k) == v or round(abs(c), -k) == abs(v):
                    return True
    return False


# token angka: gumpalan digit/titik/koma terpanjang (+ % yang menempel)
NUM_RE = re.compile(r"\d[\d.,]*\d%?|\d%?")


# konstanta standar yang bukan angka kanonis (level, nilai-z, tahun, hari)
ALLOW = {
    0.05, 0.01, 0.10, 0.025,  # level alpha standar
    0.95, 0.99, 0.975,  # level kepercayaan sebagai pecahan ("95%")
    1.6449, 1.2816,  # nilai-z eksak (z95, z90)
    1.6448536269514722,  # z95 eksak (scipy norm.ppf(0.95)) di kode
    3.841, 6.635, 2.706, 5.991,  # nilai kritis chi2 df=1 (95/99/90%) + df=2 (95%)
    1.645, 1.96, 2.58, 2.326, 2.576,  # nilai-z standar
    4.4721, 4.47, 31.62,  # akar: sqrt(20), sqrt(20) 2 desimal, sqrt(1000)
    2011, 2024, 2025, 2026, 2027,  # tahun
    1995, 1998,  # tahun publikasi uji Kupiec POF / Christoffersen
    3.85, 3.4,  # pengali modal Basel traffic-light (YELLOW 3,40-3,85)
    252, 365,  # hari bursa / hari kalender
    42,  # seed
    100, 1000,  # basis Rp100jt / per-seribu
    100000000,  # basis portofolio Rp100.000.000
    2000, 1000000,  # B lab bootstrap / N hipotetis kuis 1/sqrt(N)
    30000, 24000, 6000,  # flagship UCI: total / train / test
    95, 99, 97.5,  # level kepercayaan (sebagai angka bulat/persen)
    70, 75, 80, 85, 90,  # estMinutes lesson
    13, 8, 9, 2, 5, 3, 4, 6, 7,  # hitungan struktural (langkah/kuis/lab)
}
LABEL_RE = re.compile(r"\[(notebook|ilustrasi|kebijakan|turunan|simulasi|lab)[^\]]*\]")
NOTEBOOK_WORD_RE = re.compile(r"\bnotebook\b", re.I)
SVG_RE = re.compile(
    r"svg:\s*(?:\"(?:[^\"\\]|\\.)*\"|`(?:[^`\\]|\\.)*`)", re.S)
FENCE_RE = re.compile(r"```.*?```", re.S)


def _close(a: float, b: float) -> bool:
    if abs(b) < 1e-9:
        return abs(a) < 1e-9
    return abs(a - b) <= max(1e-6, abs(b) * 1e-4)


def check_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".ts":
        text = SVG_RE.sub('svg: ""', text)
    else:
        text = FENCE_RE.sub("", text)
    suspects = []
    for ln, line in enumerate(text.splitlines(), 1):
        if "COLAB-LINK" in line:
            continue
        # definisi cek lab (expected:/kind:) diverifikasi oleh EKSEKUSI lab,
        # bukan cek angka — nilainya adalah output lab, bukan prose.
        if "expected:" in line or "kind:" in line:
            continue
        # KaTeX memakai {,} sebagai koma desimal ("1{,}6449") — satukan dulu
        # supaya tokenisasinya sama dengan "1,6449".
        line = line.replace("{,}", ",")
        # literal data (mis. RETS_CSV: deret return mentah untuk lab) bukan
        # prose — diverifikasi terpisah oleh eksekusi lab, bukan cek angka.
        toks = list(NUM_RE.finditer(line))
        if len(toks) > 15 or "RETS_CSV" in line:
            continue
        has_label = bool(LABEL_RE.search(line) or NOTEBOOK_WORD_RE.search(line))
        for m in NUM_RE.finditer(line):
            tok = m.group(0).rstrip(".,")
            if not tok or not tok[0].isdigit():
                continue
            # fragmen identifier, bukan angka prose: digit yang menempel pada
            # huruf/underscore ("p_loss_gt_0903", "Z975", "var95") — KECUALI
            # jumlah uang berawalan "Rp" ("Rp7.432.406" tetap dicek).
            if m.start() > 0 and (line[m.start() - 1].isalpha()
                                  or line[m.start() - 1] == "_"):
                if line[max(0, m.start() - 2):m.start()] != "Rp":
                    continue
            # gumpalan digit raksasa (>15 digit) = string bit / hash, bukan angka
            if len(re.sub(r"[.,%]", "", tok)) > 15:
                continue
            # referensi modul ("M8.1", "L0.2", "[M6.4]") bukan angka
            if m.start() > 0 and line[m.start() - 1] in "ML" and "." in tok:
                continue
            cands = _candidates(tok)
            if not cands:
                continue
            # integer kecil (<10) = hitungan biasa, lewati
            plain_int = re.fullmatch(r"\d+", tok.rstrip("%"))
            if plain_int:
                iv = int(plain_int.group(0))
                if iv < 10:
                    continue
                # integer 10-99: hanya flag bila persen atau uang
                if 10 <= iv < 100 and "%" not in tok and not re.search(
                        r"(Rp|NT\$)\s*$", line[:m.start()]):
                    continue
            if any(v in ALLOW or _matches_canonical(v, tok) for v in cands):
                continue
            # "selisih 0,0001 murni pembulatan" — gap pembulatan 4 desimal
            if any(abs(v - 0.0001) < 1e-9 for v in cands) and \
                    "pembulatan" in line[max(0, m.start() - 120):m.end() + 120]:
                continue
            if has_label:
                continue
            # label bisa di baris yang sama dalam kalimat berdekatan:
            # cek 120 karakter sekitar
            ctx = line[max(0, m.start() - 120):m.end() + 120]
            if LABEL_RE.search(ctx) or NOTEBOOK_WORD_RE.search(ctx):
                continue
            suspects.append(
                f"{path.name}:{ln}: angka {tok} tidak ada di kanonik "
                f"dan tanpa label :: {line.strip()[:150]}")
    return suspects


def main() -> int:
    files = sorted(ROOT.glob("src/app/v2/content/mlf-m9*.ts")) + \
        sorted(ROOT.glob("content/mlf-m9*.md"))
    if not files:
        print("FAIL: tidak ada file M9 ditemukan")
        return 1
    all_suspects = []
    for f in files:
        all_suspects += check_file(f)
    for s in all_suspects:
        print("SUSPECT:", s)
    print(f"checked {len(files)} files, {len(all_suspects)} suspects")
    print("PASS" if not all_suspects else "FAIL (tinjau manual)")
    return 0 if not all_suspects else 1


if __name__ == "__main__":
    sys.exit(main())
