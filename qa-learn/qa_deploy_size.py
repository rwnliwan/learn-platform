#!/usr/bin/env python3
"""QA Learn — batas ukuran file deploy Pages (25 MiB per file).

Latar: deploy M1 2026-11-12 GAGAL di wrangler — `v2/learn.html` 25,1 MiB
karena halaman kurikulum menserialisasi SEMUA lesson (936 lesson, semua
prose/kuis) ke RSC payload. Live sebelumnya sudah 24,85 MiB — 4 lesson
MLF mendorongnya melewati batas. Perbaikan: props kurikulum diringkas
hanya ke 5 field yang dipakai TrackAccordion (slug, title, module,
estMinutes, jumlah steps) — learn.html 26,3 MB -> 0,19 MB.

Kelas cacat: halaman indeks yang menerima koleksi penuh sebagai props.
Setiap halaman baru / lesson baru bisa mendorong file melewati batas
tanpa ada yang sadar — batasnya keras (wrangler menolak upload).

Jalankan SETELAH build, SEBELUM deploy, dari root repo:
  python3 qa-learn/qa_deploy_size.py [output-dir]
Default output-dir: .vercel/output/static. Keluar 0 = lolos; 1 = gagal.
Catatan: file `nop-build-log.json` (log diagnostik next-on-pages, bisa
ratusan MB) WAJIB dihapus dari output sebelum deploy — bukan aset situs.
Guard ini mengabaikannya bila masih ada, tapi deploy akan gagal bila
wrangler menganggapnya aset; hapus manual.
"""
import os
import sys

LIMIT = 25 * 1024 * 1024  # Pages: 25 MiB per file
IGNORE = {"nop-build-log.json"}


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else ".vercel/output/static"
    if not os.path.isdir(out):
        print(f"QA DEPLOY-SIZE: FAIL — output dir tidak ada: {out}")
        return 1
    worst = []
    total = 0
    for root, _, files in os.walk(out):
        for f in files:
            if f in IGNORE:
                continue
            p = os.path.join(root, f)
            size = os.path.getsize(p)
            total += 1
            if size >= LIMIT:
                worst.append((size, os.path.relpath(p, out)))
    if worst:
        print("QA DEPLOY-SIZE: FAIL")
        for size, rel in sorted(worst, reverse=True):
            print(f"  FAIL {rel}: {size / 1048576:.2f} MiB (>= 25 MiB)")
        return 1
    print(
        f"QA DEPLOY-SIZE: ALL PASS ({total} file dipindai, "
        f"tidak ada yang >= 25 MiB)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
