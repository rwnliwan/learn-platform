#!/usr/bin/env python3
"""Aplikasikan ekspansi round-2 ke 23 lesson fr* (intuisi + faq).
Idempotent: skip lesson yang sudah punya id="intuisi".
"""
import re, sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fr_expand_r2a import R2
from fr_expand_r2b import R2B
from fr_expand_r2c import R2C

ALL = {}
for d in (R2, R2B, R2C):
    for k, v in d.items():
        ALL[k] = v[0] if isinstance(v, tuple) else v

BASE = os.path.expanduser("~/workspace/learn-platform/src/app/learn")

def insert_before_first(lines, needle, block):
    for i, ln in enumerate(lines):
        if needle in ln:
            return lines[:i] + block + [""] + lines[i:]
    raise ValueError(f"anchor tidak ketemu: {needle!r}")

def insert_after_first(lines, needle, block):
    for i, ln in enumerate(lines):
        if needle in ln:
            return lines[:i+1] + [""] + block + lines[i+1:]
    raise ValueError(f"anchor tidak ketemu: {needle!r}")

def main():
    changed, skipped = [], []
    for slug in sorted(ALL):
        c = ALL[slug]
        path = os.path.join(BASE, slug, "page.tsx")
        text = open(path).read()
        if 'id="intuisi"' in text:
            skipped.append(slug)
            continue
        lines = text.split("\n")

        iid, ititle = c["toc_intuisi"]
        fid, ftitle = c["toc_faq"]
        li_i = f'          <li><a href="#{iid}">{ititle}</a></li>'
        li_f = f'          <li><a href="#{fid}">{ftitle}</a></li>'

        lines = insert_after_first(lines, 'href="#worked"', [li_i])
        lines = insert_before_first(lines, 'href="#quiz"', [li_f])
        lines = insert_before_first(lines, '<h2 id="peta', c["intuisi"].strip("\n").split("\n"))
        lines = insert_before_first(lines, '<h2 id="quiz"', c["faq"].strip("\n").split("\n"))

        # update meta: tambah info konten baru
        for j, ln in enumerate(lines):
            if '<div className="meta">' in ln and "</div>" in ln:
                if "worked example" not in ln:
                    lines[j] = ln.replace("</div>", " &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>")
                break

        open(path, "w").write("\n".join(lines))
        changed.append(slug)

    print(f"CHANGED ({len(changed)}): {', '.join(changed)}")
    print(f"SKIPPED ({len(skipped)}): {', '.join(skipped)}")
    print("\n--- QA ---")
    for slug in sorted(ALL):
        path = os.path.join(BASE, slug, "page.tsx")
        text = open(path).read()
        ids = re.findall(r'<h2 id="([^"]+)"', text)
        dup = {i for i in ids if ids.count(i) > 1}
        words = len(text.split())
        toc_new = sum(text.count(f'href="#{x}"') for x in ("worked", "intuisi", "peta-lanjut", "kasus-nyata", "faq"))
        print(f"{slug}: words={words} dup={sorted(dup) or '-'} toc5={toc_new}")

if __name__ == "__main__":
    main()
