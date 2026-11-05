#!/usr/bin/env python3
"""Build all 38 lessons: render page.tsx + content md, rebuild chapters.ts."""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from render import qa_scan, render_lesson

from hd_a import LESSONS as HD_A
from hd_b import LESSONS as HD_B
from hd_c import LESSONS as HD_C
from hd_d import LESSONS as HD_D
from bi_a import LESSONS as BI_A
from bi_b import LESSONS as BI_B
from bi_c import LESSONS as BI_C

ROOT = os.path.join(os.path.dirname(__file__), "..")
LEARN_DIR = os.path.join(ROOT, "src", "app", "learn")
CONTENT_DIR = os.path.join(ROOT, "content")

ALL = HD_A + HD_B + HD_C + HD_D + BI_A + BI_B + BI_C
assert len(ALL) == 38, f"expected 38 lessons, got {len(ALL)}"
codes = [L["code"] for L in ALL]
assert len(set(codes)) == 38, "duplicate lesson codes"

TAG_RE = re.compile(r"<[^>]+>")


def clean_title(cover_title):
    t = cover_title.replace("<br />", " ").replace("<br/>", " ")
    t = re.sub(r"\s+", " ", t)
    t = t.replace("&amp;", "&").replace("&ldquo;", "\u201c").replace("&rdquo;", "\u201d")
    return TAG_RE.sub("", t).strip()


def strip_tags(s):
    return TAG_RE.sub("", s).strip()


built = []
for L in ALL:
    qa_scan(L)
    tsx = render_lesson(L)
    slug = L["slug"]
    page_dir = os.path.join(LEARN_DIR, slug)
    os.makedirs(page_dir, exist_ok=True)
    with open(os.path.join(page_dir, "page.tsx"), "w", encoding="utf-8") as fh:
        fh.write(tsx)

    # content md for chapters.ts (title extraction: first "# " line)
    title = f'{L["code"]}: {clean_title(L["cover_title"])}'
    lines = [f"# {title}", ""]
    lines.append("## Tujuan")
    for t in L["tujuan"]:
        lines.append(f"- {strip_tags(t)}")
    lines.append("")
    lines.append("## Ringkasan")
    for r in L["rangkuman"]:
        lines.append(f"- {strip_tags(r)}")
    lines.append("")
    with open(os.path.join(CONTENT_DIR, f"{slug}.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    built.append(slug)

print(f"Built {len(built)} lessons -> src/app/learn/<slug>/page.tsx + content/<slug>.md")
print("HD:", sum(1 for s in built if s.startswith("hd")),
      "| BI:", sum(1 for s in built if s.startswith("bi")))
