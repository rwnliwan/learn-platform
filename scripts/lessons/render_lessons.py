#!/usr/bin/env python3
"""Renderer: lesson dicts -> Next.js page.tsx (WORKFLOW.md v2.0)."""
import json, os, re, sys, importlib

ROOT = os.path.expanduser("~/workspace/learn-platform")
LEARN_DIR = os.path.join(ROOT, "src/app/learn")

FILLER_FLAGS = [
    "Pada lesson kali ini kita akan membahas",
    "Seperti yang telah dibahas sebelumnya",
    "Mari kita mulai pembahasan",
    "Selanjutnya, kita akan melihat",
    "Penting untuk diingat bahwa",
]

def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

def jsx_str(s: str) -> str:
    # JSX attribute string literals do NOT support backslash escapes (TS1127);
    # always use expression containers for strings that may contain escapes.
    return "{" + json.dumps(s, ensure_ascii=False) + "}"

def camel(slug: str) -> str:
    parts = re.split(r"[-_]", slug)
    return "".join(p[:1].upper() + p[1:] for p in parts) + "Page"

def render_tex(math: str, block: bool = True) -> str:
    # math must not contain backtick or ${ (KaTeX never does)
    assert "`" not in math and "${" not in math, f"bad math: {math[:60]}"
    b = " block" if block else ""
    return "<Tex math={String.raw`" + math + "`}" + b + " />"

def render_formula(f) -> str:
    out = render_tex(f["math"], True) + "\n"
    syms = f.get("symbols")
    if syms:
        out += "<p><strong>Artinya tiap simbol:</strong></p>\n<ul>\n"
        for s in syms:
            out += f"<li>{s}</li>\n"
        out += "</ul>\n"
    return out

def render_chart(c) -> str:
    out = (
        "<PlotlyChart\n"
        f"  data={{{c['data']}}}\n"
        f"  title={jsx_str(c['title'])}\n"
        f"  layout={{{c['layout']}}}\n"
        "/>\n"
        '<div className="chart-guide">\n'
        f"<p><strong>Cara membaca:</strong> {c['cara']}</p>\n"
        f"<p><strong>Interpretasi:</strong> {c['interpretasi']}</p>\n"
        "</div>\n"
    )
    return out

def render_concept(sec, toc):
    out = f"<h2 id=\"{sec['id']}\">{sec['title']}</h2>\n"
    out += sec["body"] + "\n"
    for f in sec.get("formulas", []):
        out += render_formula(f)
    if sec.get("intuisi"):
        out += f"<p><strong>Kepribadian/intuisi:</strong> {sec['intuisi']}</p>\n"
    if sec.get("kapan"):
        out += f"<p><strong>Kapan dipakai:</strong> {sec['kapan']}</p>\n"
    w = sec.get("worked")
    if w:
        out += (
            '<details className="worked">\n'
            f"<summary>{w['title']}</summary>\n{w['body']}\n</details>\n"
        )
    for ch in sec.get("charts", []):
        out += render_chart(ch)
    return out

def render_lesson(L) -> str:
    slug = L["slug"]
    toc_items = []
    toc_items.append(('<a href="#tujuan">Tujuan Pembelajaran</a>'))
    toc_items.append((f'<a href="#cerita">{L["story_title"]}</a>'))
    for sec in L["concepts"]:
        toc_items.append((f'<a href="#{sec["id"]}">{sec["toc"]}</a>'))
    toc_items.append(('<a href="#miskonsepsi">Miskonsepsi Umum</a>'))
    toc_items.append(('<a href="#tips">Tips &amp; Intuisi Kunci</a>'))
    toc_items.append(('<a href="#lab1">Lab 1 (Live Python)</a>'))
    toc_items.append(('<a href="#lab2">Lab 2 (Live Python)</a>'))
    toc_items.append(('<a href="#peta">Peta Keputusan</a>'))
    toc_items.append((f'<a href="#case">{L["case"]["toc"]}</a>'))
    toc_items.append((f'<a href="#quiz">Quiz ({len(L["quiz"])} soal)</a>'))
    toc_items.append(('<a href="#rangkum">Rangkuman</a>'))

    toc_html = "<ol>\n" + "".join(f"<li>{t}</li>\n" for t in toc_items) + "</ol>"

    tujuan_html = "<ul>\n" + "".join(f"<li>{t}</li>\n" for t in L["tujuan"]) + "</ul>"

    concepts_html = "".join(render_concept(s, toc_items) for s in L["concepts"])

    myths_html = ""
    for m in L["myths"]:
        myths_html += (
            '<div className="myth">\n'
            f'<p><strong className="t">🚨 Miskonsepsi: &ldquo;{m["t"]}&rdquo;</strong></p>\n'
            f'<p><strong>Yang benar:</strong> {m["benar"]}</p>\n'
            "</div>\n"
        )

    tips_html = "".join(
        f'<div className="tip">\n<p><strong>💡 {t}</strong></p>\n</div>\n' for t in L["tips"]
    )

    labs_html = ""
    for i, lab in enumerate(L["labs"], 1):
        labs_html += (
            f"<h2 id=\"lab{i}\">🔬 Lab {i}: {lab['heading']}</h2>\n"
            f"<p>{lab['intro']}</p>\n"
            "<PyodideLab\n"
            f"  title={jsx_str(lab['title'])}\n"
            f"  hint={jsx_str(lab['hint'])}\n"
            f"  defaultCode={jsx_str(lab['code'])}\n"
            "/>\n"
        )

    decisions_html = ""
    for i, d in enumerate(L["decisions"], 1):
        decisions_html += (
            '<div className="decision-card">\n'
            f"<h3>{i}. {d['kondisi']} → <strong>{d['pakai']}</strong></h3>\n"
            f"<p><strong>Kenapa:</strong> {d['alasan']}</p>\n"
            f"<p><strong>Contoh nyata:</strong> {d['contoh']}</p>\n"
            "</div>\n"
        )
    decisions_html += (
        '<div className="callout">\n<h3>🧭 Aturan praktis 10 detik</h3>\n'
        f"{L['rule10']}\n</div>\n"
    )

    case = L["case"]
    case_html = (
        f"<h2 id=\"case\">📋 Mini-Case: {case['title']}</h2>\n"
        '<div className="callout">\n'
        f"{case['body']}\n"
        f"<p><strong>Pertanyaan:</strong> {case['q']}</p>\n"
        '<details className="worked">\n'
        "<summary>💡 Pembahasan (klik untuk buka)</summary>\n"
        f"{case['pembahasan']}\n"
        "</details>\n</div>\n"
    )

    nq = len(L["quiz"])
    quiz_html = f"<h2 id=\"quiz\">✏️ Quiz — Uji Judgment-mu ({nq} soal)</h2>\n"
    quiz_html += (
        '<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal '
        f"{(nq * 4 + 5) // 6} dari {nq}. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>\n"
    )
    for i, q in enumerate(L["quiz"], 1):
        opts = ",\n    ".join(js_str(o) for o in q["options"])
        quiz_html += (
            "<Quiz\n"
            f"  question={jsx_str(str(i) + '. ' + q['q'])}\n"
            f"  options={{\n    [{opts}]\n  }}\n"
            f"  correct={{{q['correct']}}}\n"
            f"  explanation={jsx_str(q['why'])}\n"
            "/>\n"
        )

    rangkum_html = "<ul>\n" + "".join(f"<li>{r}</li>\n" for r in L["rangkum"]) + "</ul>"

    prev, nxt = L["prev"], L["next"]
    nxt_href = "/learn/" + nxt[0] if nxt[0] != "/" else "/"

    tsx = f"""import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";

export const runtime = "edge";

export default function {camel(slug)}() {{
  return (
    <div className="container-read" style={{{{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}}}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {{/* 1. COVER */}}
      <div className="lesson-cover">
        <span className="eyebrow">{L['id']} — {L['track']}</span>
        <h1 className="display-title">{L['title_html']}</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; {nq} quiz &bull; 1 mini-case</div>
      </div>

      {{/* 2. TOC */}}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        {toc_html}
      </div>

      {{/* 3. TUJUAN */}}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        {tujuan_html}
      </div>

      {{/* 4. CERITA */}}
      <h2 id="cerita">{L['story_title']}</h2>
      <div className="story">
        {L['story']}
      </div>

      {{/* 5. KONSEP INTI */}}
{concepts_html}
      {{/* 6. MISKONSEPSI */}}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
{myths_html}
      {{/* 7. TIPS */}}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
{tips_html}
      {{/* 8. LABS */}}
{labs_html}
      {{/* 9. PETA KEPUTUSAN */}}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
{decisions_html}
      {{/* 10. MINI-CASE */}}
{case_html}
      {{/* 11. QUIZ */}}
{quiz_html}
      {{/* 12. RANGKUMAN */}}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        {rangkum_html}
      </div>

      <hr className="divider-fancy" />
      <div style={{{{ display: "flex", justifyContent: "space-between" }}}}>
        <Link href="/learn/{prev[0]}" className="btn btn-secondary btn-sm">← {prev[1]}</Link>
        <Link href="{nxt_href}" className="btn btn-primary btn-sm">{nxt[1]} →</Link>
      </div>
    </div>
  );
}}
"""
    return tsx

def qa_check(L):
    errs = []
    full = json.dumps(L, ensure_ascii=False)
    for f in FILLER_FLAGS:
        if f in full:
            errs.append(f"F1 filler: {f[:40]}")
    # KaTeX: math VALUES must never contain double backslashes (would render broken)
    BS = chr(92)
    def walk_math(o, where):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "math" and isinstance(v, str):
                    if BS * 2 in v:
                        errs.append(f"doubled backslash in math ({where}): {v[:50]}")
                    if "`" in v or "${" in v:
                        errs.append(f"backtick/${{ in math ({where})")
                walk_math(v, where)
        elif isinstance(o, list):
            for v in o:
                walk_math(v, where)
        elif isinstance(o, str) and "String.raw`" in o:
            # inline <Tex math={String.raw`...`}> — value must have single backslashes
            for m in re.finditer(r"String\.raw`([^`]*)`", o):
                if BS * 2 in m.group(1):
                    errs.append(f"doubled backslash in inline Tex ({where}): {m.group(1)[:50]}")
    walk_math(L, L["slug"])
    if len(L["myths"]) < 2: errs.append("myths < 2")
    if len(L["tips"]) < 2: errs.append("tips < 2")
    if len(L["labs"]) != 2: errs.append(f"labs != 2 ({len(L['labs'])})")
    if not (4 <= len(L["quiz"]) <= 6): errs.append(f"quiz not 4-6 ({len(L['quiz'])})")
    if not (3 <= len(L["decisions"]) <= 5): errs.append(f"decisions not 3-5")
    if not L.get("story"): errs.append("no story")
    if not L.get("case", {}).get("pembahasan"): errs.append("no case")
    nchart = sum(len(s.get("charts", [])) for s in L["concepts"])
    if nchart < 1: errs.append("no charts")
    # JSX-safety: raw < > in prose (allow tags), braces
    text_parts = [L["title_html"], L["story"]] + L["tujuan"] + L["rangkum"]
    for t in text_parts:
        if "{" in t or "}" in t:
            errs.append(f"curly brace in prose: {t[:50]}")
        # strip tags then check spaced </> (story/tujuan often contain comparisons)
        _to = re.sub(r"</?[a-zA-Z][^>]*>", " ", t)
        if "<" in _to or ">" in _to:
            m = re.search(r".{0,40}[<>].{0,40}", _to)
            errs.append(f"raw </> in prose: ...{m.group(0) if m else t[:70]}...")
    # raw JSX fields: decisions, case, myths, tips, concept bodies, lab heading/intro
    raw_fields = []
    for lab in L["labs"]:
        raw_fields += [lab["heading"], lab["intro"]]
    for s in L["concepts"]:
        raw_fields += [s["title"], s["body"], s.get("intuisi",""), s.get("kapan","")]
        w = s.get("worked")
        if w: raw_fields += [w["title"], w["body"]]
        for f in s.get("formulas", []):
            raw_fields += f.get("symbols", [])
        for ch in s.get("charts", []):
            raw_fields += [ch.get("cara",""), ch.get("interpretasi","")]
    raw_fields += [L.get("rule10","")]
    for q in L["quiz"]:
        raw_fields += [q["q"], q["why"]] + q["options"]
    raw_fields += [m["t"] for m in L["myths"]] + [m["benar"] for m in L["myths"]] + L["tips"]
    raw_fields += [d["kondisi"] for d in L["decisions"]] + [d["pakai"] for d in L["decisions"]] + [d["alasan"] for d in L["decisions"]] + [d["contoh"] for d in L["decisions"]]
    c = L["case"]
    raw_fields += [c["title"], c["body"], c["q"], c["pembahasan"]]
    for t in raw_fields:
        # 1) space-surrounded < > on the ORIGINAL (before tag-stripping can swallow them)
        if re.search(r"\s[<>]\s", t):
            errs.append(f"raw </> in prose: {t[:70]}")
        # 2) strip <...> tag spans, then inspect remaining text
        text_only = re.sub(r"</?[a-zA-Z][^>]*>", " ", t)
        # ANY remaining < or > breaks TSX (even >Rp100jt) — use &lt;/&gt; or unicode
        if "<" in text_only or ">" in text_only:
            m = re.search(r".{0,40}[<>].{0,40}", text_only)
            errs.append(f"raw </> in prose: ...{m.group(0) if m else t[:70]}...")
        # braces outside tags break JSX
        if "{" in text_only or "}" in text_only:
            errs.append(f"curly in raw JSX text: {t[:70]}")
    return errs

def write_lesson(L):
    slug = L["slug"]
    d = os.path.join(LEARN_DIR, slug)
    os.makedirs(d, exist_ok=True)
    tsx = render_lesson(L)
    with open(os.path.join(d, "page.tsx"), "w") as f:
        f.write(tsx)

def md_escape(s):
    return s.replace("\\", "\\\\")

def dedupe_chapters_file(path):
    """Line-based dedupe of chapters.ts entries (JSON strings have no literal newlines)."""
    import re as _re
    lines = open(path).read().split("\n")
    # locate first entry start
    try:
        first = next(i for i, ln in enumerate(lines) if ln == "  {")
    except StopIteration:
        return
    header = lines[:first]
    entries = []
    cur = None
    tail_start = len(lines)
    for i in range(first, len(lines)):
        ln = lines[i]
        if ln == "  {":
            cur = [ln]
        elif cur is not None:
            cur.append(ln)
            if ln in ("  }", "  },"):
                m = _re.search(r'"slug": "([^"]+)"', cur[1] if len(cur) > 1 else "")
                slug = m.group(1) if m else f"__unknown_{len(entries)}"
                entries.append((slug, cur))
                cur = None
                tail_start = i + 1
    footer = lines[tail_start:]
    seen = {}
    for slug, block in entries:
        if slug not in seen:
            seen[slug] = block
    out = header[:]
    blocks = list(seen.values())
    for bi, block in enumerate(blocks):
        # normalize trailing comma: all but last end with }, 
        b = [l for l in block]
        if bi < len(blocks) - 1:
            if b[-1] == "  }":
                b[-1] = "  },"
        else:
            if b[-1] == "  },":
                b[-1] = "  }"
        out.extend(b)
    out.extend(footer)
    open(path, "w").write("\n".join(out))

def update_chapters(all_lessons):
    path = os.path.join(ROOT, "src/lib/chapters.ts")
    with open(path) as f:
        src = f.read()
    entries = []
    for L in all_lessons:
        md = f"# {L['id']}: {L['title_plain']}\n\n{L['chapter_summary']}\n"
        md_js = json.dumps(md, ensure_ascii=False)
        entries.append(
            '  {\n'
            f'    "slug": "{L["slug"]}",\n'
            f'    "title": "{L["id"]}: {L["title_plain"]}",\n'
            f'    "content": {md_js}\n'
            '  }'
        )
    block = ",\n".join(entries)
    marker = "];"
    idx = src.rfind(marker)
    assert idx > 0
    new_src = src[:idx] + ",\n" + block + "\n" + src[idx:]
    with open(path, "w") as f:
        f.write(new_src)
    dedupe_chapters_file(path)

def main(modules):
    all_lessons = []
    for modname in modules:
        mod = importlib.import_module(modname)
        lessons = mod.LESSONS
        for L in lessons:
            errs = qa_check(L)
            if errs:
                print(f"QA FAIL {L['slug']}: {errs}")
                sys.exit(1)
            write_lesson(L)
            all_lessons.append(L)
            print(f"OK {L['slug']}")
    update_chapters(all_lessons)
    print(f"chapters.ts updated: {len(all_lessons)} entries")

if __name__ == "__main__":
    main(sys.argv[1:])
