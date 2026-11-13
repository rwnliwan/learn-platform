#!/usr/bin/env python3
"""QA Learn — chapters.ts tidak boleh kehilangan halaman legacy (guard permanen, 2026-11-12).

Kasus: regen `scripts/build-content.py` saat build M1 (12 Nov 2026, 09:22)
menulis ulang `src/lib/chapters.ts` dari `content/*.md` SAJA dan diam-diam
memangkasnya 296 -> 197 chapter. `content/` bukan lagi himpunan lengkap
lesson — 103 chapter (36 pm-* + 67 a*/e* lama) tidak punya .md lagi tapi
MASIH live di route legacy `/learn/[slug]` (HTTP 200 terverifikasi:
pm-c1-ips, a11-tipe-data, a21-sampling-bias, a31-regresi-ols,
a210-power-sampel). Deploy dengan file 197 chapter = 103 halaman legacy
404. Klaim "nothing imports lib/chapters" SALAH — `src/lib/content.ts`
mengimpornya dan `/learn/[slug]` memakainya (v2 pakai lessonMeta, tidak kena).

Aturan (kelas kesalahan, bukan string spesifik):
- Himpunan slug di `src/lib/chapters.ts` WAJIB memuat SEMUA slug baseline
  (`qa-learn/legacy_slugs.txt`) — penghapusan slug apa pun dari chapters.ts
  adalah FAIL, apa pun penyebabnya (regen, edit manual, rename file).
- Setiap `content/*.md` WAJIB punya slug di chapters.ts (arah sebaliknya:
  lesson baru ditambah tapi chapters.ts tidak diregenerasi).
- Tidak boleh ada slug duplikat di chapters.ts.

Baseline diperbarui HANYA bila sebuah halaman legacy memang sengaja
dihapus dari situs (keputusan eksplisit, bukan efek samping regen):
regenerasi `legacy_slugs.txt` dari chapters.ts yang sudah diverifikasi +
catat alasannya di commit.

Jalankan dari root repo ini: python3 qa-learn/qa_chapters_legacy.py
Keluar 0 = lolos; 1 = gagal (slug baseline hilang / .md tak terdaftar / duplikat).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAPTERS = os.path.join(ROOT, "src/lib/chapters.ts")
CONTENT_DIR = os.path.join(ROOT, "content")
BASELINE = os.path.join(ROOT, "qa-learn/legacy_slugs.txt")

SLUG_RE = re.compile(r'"slug":\s*"([^"]+)"')


def read_slugs(path):
    with open(path, encoding="utf-8") as fh:
        return SLUG_RE.findall(fh.read())


def read_baseline(path):
    slugs = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#"):
                slugs.append(line)
    return slugs


def main():
    failures = []

    current = read_slugs(CHAPTERS)
    current_set = set(current)
    baseline = read_baseline(BASELINE)

    missing = [s for s in baseline if s not in current_set]
    if missing:
        failures.append(
            f"{len(missing)} slug baseline HILANG dari chapters.ts "
            f"(deploy akan 404-kan halaman legacy live): {missing[:10]}"
            + (" ..." if len(missing) > 10 else "")
        )

    md_slugs = sorted(f[:-3] for f in os.listdir(CONTENT_DIR) if f.endswith(".md"))
    unregistered = [s for s in md_slugs if s not in current_set]
    if unregistered:
        failures.append(
            f"{len(unregistered)} .md TIDAK terdaftar di chapters.ts "
            f"(regen belum jalan / terhapus): {unregistered[:10]}"
            + (" ..." if len(unregistered) > 10 else "")
        )

    dupes = sorted({s for s in current if current.count(s) > 1})
    if dupes:
        failures.append(f"slug DUPLIKAT di chapters.ts: {dupes[:10]}")

    if failures:
        print("QA CHAPTERS-LEGACY: FAIL")
        for f in failures:
            print("  FAIL " + f)
        print(
            "  (Baseline hanya diubah bila halaman memang sengaja dihapus; "
            "lihat docstring guard.)"
        )
        return 1

    print(
        f"QA CHAPTERS-LEGACY: ALL PASS "
        f"({len(baseline)} slug baseline hadir, {len(md_slugs)} slug .md "
        f"terdaftar, {len(current)} total, tanpa duplikat)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
