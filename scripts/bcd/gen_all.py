#!/usr/bin/env python3
"""Generate semua page.tsx untuk track B/C/D + markdown ringkas untuk chapters.ts."""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from render import qa_lesson

import lessons_b
try:
    import lessons_c
except ImportError:
    lessons_c = None
try:
    import lessons_d
except ImportError:
    lessons_d = None

ORDER_B = ["b1", "b2", "b3", "b4", "b5", "b6_1", "b6_2", "b7_1", "b7_2",
           "b8", "b9", "b10", "b11", "b12", "b13", "b14", "b15", "b16", "b17"]
ORDER_C = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9_1", "c9_2",
           "c10", "c11", "c12", "c13", "c14", "c15", "c16", "c17", "c18"]
ORDER_D = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8_1", "d8_2",
           "d9", "d10", "d11", "d12", "d13", "d14", "d15"]

BASE = os.path.join(os.path.dirname(__file__), "../../")
LEARN_DIR = os.path.join(BASE, "src/app/learn")
CONTENT_DIR = os.path.join(BASE, "content")

def md_summary(L):
    nq = len(L.quizzes)
    return (f"# {L.eyebrow}: {re.sub('<br/>', ' — ', L.title)}\n\n"
            f"Materi interaktif: cerita pembuka, konsep inti dengan rumus KaTeX, "
            f"miskonsepsi, tips, 2 lab live-code (Pyodide), chart interaktif, "
            f"peta keputusan, mini-case, dan {nq} quiz dengan score tracking.\n\n"
            f"Buka versi interaktif lengkap di halaman lesson ini.\n")

def main(only=None):
    lessons = []
    mods = [(lessons_b, ORDER_B)]
    if lessons_c: mods.append((lessons_c, ORDER_C))
    if lessons_d: mods.append((lessons_d, ORDER_D))
    for mod, order in mods:
        for name in order:
            fn = getattr(mod, name, None)
            if fn is None:
                print(f"  SKIP (belum ditulis): {name}")
                continue
            if only and name not in only:
                continue
            before = len(mod.LESSONS)
            fn()
            assert len(mod.LESSONS) == before + 1, f"{name} tidak append tepat 1 lesson"
            L = mod.LESSONS[-1]
            errs = qa_lesson(L)
            status = "OK" if not errs else f"FAIL {errs}"
            print(f"  [{status}] {L.slug}")
            if errs:
                raise SystemExit(f"QA gagal untuk {L.slug}: {errs}")
            lessons.append(L)

    for L in lessons:
        d = os.path.join(LEARN_DIR, L.slug)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "page.tsx"), "w") as f:
            f.write(L.render())
        with open(os.path.join(CONTENT_DIR, L.slug + ".md"), "w") as f:
            f.write(md_summary(L))
    print(f"\nGenerated {len(lessons)} lessons.")

if __name__ == "__main__":
    only = sys.argv[1].split(",") if len(sys.argv) > 1 else None
    main(only)
