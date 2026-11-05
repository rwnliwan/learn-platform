#!/usr/bin/env python3
"""Aplikasikan round-3 (latihan mandiri) ke 13 lesson fr* di bawah 4000 kata.
Idempotent: skip jika id="latihan" sudah ada.
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fr_expand_r3 import R3
ALL = {k: (v[0] if isinstance(v, tuple) else v) for k, v in R3.items()}
BASE = os.path.expanduser("~/workspace/learn-platform/src/app/learn")

def insert_before_first(lines, needle, block):
    for i, ln in enumerate(lines):
        if needle in ln:
            return lines[:i] + block + [""] + lines[i:]
    raise ValueError(needle)

changed, skipped = [], []
for slug in sorted(ALL):
    c = ALL[slug]
    path = os.path.join(BASE, slug, "page.tsx")
    text = open(path).read()
    if 'id="latihan"' in text:
        skipped.append(slug); continue
    lines = text.split("\n")
    lid, ltitle = c["toc_lat"]
    li = f'          <li><a href="#{lid}">{ltitle}</a></li>'
    lines = insert_before_first(lines, 'href="#quiz"', [li])
    lines = insert_before_first(lines, '<h2 id="quiz"', c["latihan"].strip("\n").split("\n"))
    open(path, "w").write("\n".join(lines))
    changed.append(slug)

print("CHANGED:", changed, "SKIPPED:", skipped)
print("--- QA ---")
for slug in sorted(ALL):
    path = os.path.join(BASE, slug, "page.tsx")
    text = open(path).read()
    ids = re.findall(r'<h2 id="([^"]+)"', text)
    dup = {i for i in ids if ids.count(i) > 1}
    print(f"{slug}: words={len(text.split())} dup={sorted(dup) or '-'}")
