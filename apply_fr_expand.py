#!/usr/bin/env python3
"""Aplikasikan ekspansi konten ke 23 lesson fr* (Track T2).
Insert:
- TOC: li worked sebelum li href="#peta"; li peta2+kasus sebelum li href="#case"
- Page: section worked sebelum <h2 id="peta ; section peta2+kasus sebelum <h2 id="case"
Idempotent: skip lesson yang sudah punya id="worked".
"""
import re, sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fr_expand_content import CONTENT
from fr_expand_content2 import CONTENT2
from fr_expand_content3 import CONTENT3
from fr_expand_content4 import CONTENT4

ALL = {}
for d in (CONTENT, CONTENT2, CONTENT3, CONTENT4):
    ALL.update(d)

BASE = os.path.expanduser("~/workspace/learn-platform/src/app/learn")

def insert_before_first(lines, needle, block_lines):
    for i, ln in enumerate(lines):
        if needle in ln:
            return lines[:i] + block_lines + [""] + lines[i:]
    raise ValueError(f"anchor tidak ketemu: {needle!r}")

def main():
    changed, skipped = [], []
    for slug, c in sorted(ALL.items()):
        if isinstance(c, tuple):  # entri ditulis dengan koma trailing -> 1-tuple
            c = c[0]
        path = os.path.join(BASE, slug, "page.tsx")
        assert os.path.exists(path), path
        text = open(path).read()
        if 'id="worked"' in text:
            skipped.append(slug)
            continue
        lines = text.split("\n")

        toc_worked_id, toc_worked_title = c["toc_worked"]
        toc_peta2_id, toc_peta2_title = c["toc_peta2"]
        toc_kasus_id, toc_kasus_title = c["toc_kasus"]

        li_w = f'          <li><a href="#{toc_worked_id}">{toc_worked_title}</a></li>'
        li_p2 = f'          <li><a href="#{toc_peta2_id}">{toc_peta2_title}</a></li>'
        li_k = f'          <li><a href="#{toc_kasus_id}">{toc_kasus_title}</a></li>'

        lines = insert_before_first(lines, 'href="#peta"', [li_w])
        lines = insert_before_first(lines, 'href="#case"', [li_p2, li_k])
        lines = insert_before_first(lines, '<h2 id="peta', c["worked"].strip("\n").split("\n"))
        lines = insert_before_first(lines, '<h2 id="case"',
                                    (c["peta2"].strip("\n") + "\n" + c["kasus"].strip("\n")).split("\n"))

        open(path, "w").write("\n".join(lines))
        changed.append(slug)

    print(f"CHANGED ({len(changed)}): {', '.join(changed)}")
    print(f"SKIPPED ({len(skipped)}): {', '.join(skipped)}")

    # QA: cek duplikat id + word count
    print("\n--- QA ---")
    for slug in sorted(ALL):
        path = os.path.join(BASE, slug, "page.tsx")
        text = open(path).read()
        ids = re.findall(r'<h2 id="([^"]+)"', text)
        dup = {i for i in ids if ids.count(i) > 1}
        words = len(text.split())
        toc_new = sum(text.count(f'href="#{x}"') for x in ("worked", "peta-lanjut", "kasus-nyata"))
        print(f"{slug}: words={words} dup_ids={sorted(dup) or '-'} new_toc_refs={toc_new}")

if __name__ == "__main__":
    main()
