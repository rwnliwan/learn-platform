#!/usr/bin/env python3
"""QA Learn — next-link href lesson harus mengarah ke route yang ada.

Latar: tombol "Lanjut" di akhir lesson MLF1–MLF3 (deploy M1, 2026-11-12)
mengarah ke `/v2/mlf2-...` (tanpa `/learn/`) — route itu tidak ada,
klik berujung 404 (terverifikasi live: 404 vs 200 untuk route benar).
Pola benar di seluruh repo: `/v2/learn/<slug>`. L0 tidak kena (builder
memakai pola benar), M1 kena di 3 file — kelas cacatnya: href next-link
yang ditulis tangan tanpa cek route.

Aturan guard: setiap `next: { ..., href: "..." }` di lesson TS WAJIB
berupa `/v2/learn` persis (kembali ke kurikulum) atau
`/v2/learn/<slug>` dengan slug terdaftar di lessonMeta.json.
Slug diambil dari lessonMeta.json hasil regen terakhir.

Jalankan dari root repo: python3 qa-learn/qa_next_hrefs.py
Keluar 0 = lolos; 1 = gagal.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_TS = os.path.join(ROOT, "src/app/v2/content")
META = os.path.join(ROOT, "src/app/v2/lib/lessonMeta.json")

NEXT_RE = re.compile(
    r"next:\s*\{\s*label:\s*\"[^\"]*\",\s*href:\s*\"([^\"]+)\"\s*\}"
)


def _slugs_from_meta():
    with open(META, encoding="utf-8") as fh:
        meta = json.load(fh)
    # lessonMeta.json = {"lessons": {slug: {...}}, "misi": ..., "proyek": ...}
    return set(meta["lessons"].keys())


def _slugs_from_content():
    # Slug yang dideklarasikan tiap file lesson (ground truth isi repo).
    # Perlu sebagai pelengkap: ada lesson yang ter-serve live (mis.
    # pm-a10b-IPS-risiko, slug huruf besar) tapi tidak masuk lessonMeta.
    out = set()
    for name in os.listdir(CONTENT_TS):
        if not name.endswith(".ts"):
            continue
        with open(os.path.join(CONTENT_TS, name), encoding="utf-8") as fh:
            m = re.search(r"^\s*slug:\s*\"([^\"]+)\"", fh.read(), re.M)
        if m:
            out.add(m.group(1))
    return out


def main():
    slugs = _slugs_from_meta() | _slugs_from_content()
    fails = []
    checked = 0
    for name in sorted(os.listdir(CONTENT_TS)):
        if not name.endswith(".ts"):
            continue
        path = os.path.join(CONTENT_TS, name)
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
        for m in NEXT_RE.finditer(text):
            checked += 1
            href = m.group(1)
            lineno = text[: m.start()].count("\n") + 1
            if href == "/v2/learn":
                continue
            mm = re.fullmatch(r"/v2/learn/([A-Za-z0-9][A-Za-z0-9-]*)", href)
            if not mm:
                fails.append(
                    f"{name}:{lineno} :: next href bukan pola "
                    f"/v2/learn/<slug>: {href!r}"
                )
            elif mm.group(1) not in slugs:
                fails.append(
                    f"{name}:{lineno} :: next href ke slug yang tidak "
                    f"terdaftar: {href!r}"
                )
    if fails:
        print("QA NEXT-HREFS: FAIL")
        for f in fails:
            print("  FAIL " + f)
        return 1
    print(f"QA NEXT-HREFS: ALL PASS ({checked} next-link dipindai)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
