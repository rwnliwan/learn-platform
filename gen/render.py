#!/usr/bin/env python3
"""Renderer: lesson dict -> Next.js page.tsx (WORKFLOW.md v2.0 compliant)."""
import json
import re

# ---------------------------------------------------------------- helpers

def J(s):
    """JS string literal (double-quoted, escaped)."""
    return json.dumps(s, ensure_ascii=False)


def check_prose(s, where):
    """Prose is emitted raw into JSX: forbid bare braces, escape <>&."""
    if "{" in s or "}" in s:
        raise ValueError(f"Bare brace in prose [{where}]: {s[:90]!r}")
    return esc_prose(s)


_TAG_PAT = r"</?(?:p|strong|em|details|summary|ul|li|ol|br|div|span|h1|h2|h3|hr)(?:\s[^<>]*)?/?>"
_TAG_SPLIT_RE = re.compile(f"({_TAG_PAT})")
_TAG_FULL_RE = re.compile(f"^{_TAG_PAT}$")
_ENTITY_RE = re.compile(r"&(?!(?:amp|lt|gt|quot|ldquo|rdquo|mdash|ndash|nbsp);)")


def esc_prose(s):
    """Escape bare <, >, & for raw JSX text; preserve allowed HTML tags/entities."""
    out = []
    for tok in _TAG_SPLIT_RE.split(s):
        if tok and _TAG_FULL_RE.match(tok):
            out.append(tok)
        else:
            tok = _ENTITY_RE.sub("&amp;", tok)
            tok = tok.replace("<", "&lt;").replace(">", "&gt;")
            out.append(tok)
    return "".join(out)


def code_display(lang, code):
    esc = (code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
               .replace("{", "&#123;").replace("}", "&#125;"))
    return (f'<div className="code-header"><span className="code-lang">{lang}</span></div>'
            f'<pre className="codebox">{esc}</pre>')


def tex(math):
    return "<Tex math={String.raw`" + math + "`} block />"


def para_list(items, where):
    out = []
    for p in items:
        out.append(check_prose(p, where))
    return "\n      ".join(out)


# ---------------------------------------------------------------- sections

def cover(code, track, title, meta):
    code = check_prose(code, "cover-code")
    track = check_prose(track, "cover-track")
    title = check_prose(title, "cover")
    meta = check_prose(meta, "cover-meta")
    return f"""      <div className="lesson-cover">
        <span className="eyebrow">{code} &mdash; {track}</span>
        <h1 className="display-title">{title}</h1>
        <div className="meta">{meta}</div>
      </div>"""


def toc(items):
    lis = "\n".join(f'          <li><a href="#{a}">{check_prose(t, "toc")}</a></li>' for a, t in items)
    return f"""      <div className="toc">
        <h3>\U0001f4d1 Daftar Isi</h3>
        <ol>
{lis}
        </ol>
      </div>"""


def tujuan(items):
    lis = "\n".join(f"          <li>{check_prose(x, 'tujuan')}</li>" for x in items)
    return f"""      <h2 id="tujuan">\U0001f3af Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
{lis}
        </ul>
      </div>"""


def story(title, paras):
    title = check_prose(title, "story-title")
    return f"""      <h2 id="cerita">{title}</h2>
      <div className="story">
        {para_list(paras, 'story')}
      </div>"""


def concept(c):
    """Konsep inti: definisi, rumus+simbol, worked example, kepribadian, kapan pakai, chart, myth inline."""
    title = check_prose(c["title"], "konsep-title")
    definisi = check_prose(c["definisi"], "definisi")
    parts = [f'      <h2 id="{c["id"]}">{title}</h2>']
    parts.append(f"      <p><strong>Definisi.</strong> {definisi}</p>")
    if c.get("rumus"):
        parts.append(f"      {tex(c['rumus'])}")
        if c.get("simbol"):
            parts.append('      <p><strong>Artinya tiap simbol:</strong></p>')
            lis = []
            for sym, desc in c["simbol"]:
                desc = check_prose(desc, "simbol-desc")
                lis.append(f"          <li><Tex math={{String.raw`{sym}`}} />: {desc}</li>")
            parts.append("      <ul>\n" + "\n".join(lis) + "\n      </ul>")
        if c.get("interpretasi"):
            interp = check_prose(c["interpretasi"], "interpretasi")
            parts.append(f"      <p><strong>Interpretasi:</strong> {interp}</p>")
    if c.get("worked"):
        summary, body = c["worked"]
        summary = check_prose(summary, "worked-summary")
        body = check_prose(body, "worked-body")
        parts.append(f"""      <details className="worked">
        <summary>{summary}</summary>
        {body}
      </details>""")
    if c.get("kepribadian"):
        kep = check_prose(c["kepribadian"], "kepribadian")
        parts.append(f"      <p><strong>Kepribadian konsep ini:</strong> {kep}</p>")
    if c.get("kapan"):
        kap = check_prose(c["kapan"], "kapan")
        parts.append(f"      <p><strong>Kapan memakai:</strong> {kap}</p>")
    if c.get("code_display"):
        lang, code = c["code_display"]
        parts.append(f"      {code_display(lang, code)}")
    if c.get("callout"):
        co = check_prose(c["callout"], "callout")
        parts.append(f'      <div className="callout">{co}</div>')
    if c.get("warning"):
        wn = check_prose(c["warning"], "warning")
        parts.append(f'      <div className="callout callout-warning">{wn}</div>')
    return "\n".join(parts)


def myths_block(myths):
    parts = ['      <h2 id="miskonsepsi">\U0001f6a8 Miskonsepsi Umum</h2>']
    for t, body in myths:
        t = check_prose(t, "myth-title")
        body = check_prose(body, "myth-body")
        parts.append(f"""      <div className="myth">
        <p><strong className="t">\U0001f6a8 Miskonsepsi: &ldquo;{t}&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> {body}</p>
      </div>""")
    return "\n".join(parts)


def tips_block(tips):
    parts = ['      <h2 id="tips">\U0001f4a1 Intuisi Kunci</h2>']
    for body in tips:
        body = check_prose(body, "tip")
        parts.append(f"""      <div className="tip">
        <p><strong>\U0001f4a1 Intuisi:</strong> {body}</p>
      </div>""")
    return "\n".join(parts)


def chart_block(ch):
    """ch: {var, data, title, layout, cara, interpretasi}"""
    data_js = json.dumps(ch["data"], ensure_ascii=False)
    layout_js = json.dumps(ch.get("layout", {}), ensure_ascii=False)
    check_prose(ch["title"], "chart-title")
    cara = check_prose(ch["cara"], "chart-cara")
    interp = check_prose(ch["interpretasi"], "chart-interp")
    return f"""  const {ch['var']} = {data_js};
  const {ch['var']}Layout = {layout_js};""", f"""      <PlotlyChart
        data={{{ch['var']}}}
        title={J(ch['title'])}
        layout={{{ch['var']}Layout}}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> {cara}</p>
        <p><strong>Interpretasi:</strong> {interp}</p>
      </div>"""


def lab_block(lab, idx):
    compile(lab["code"], f"<lab{idx}>", "exec")  # syntax check at build time
    intro = check_prose(lab["intro"], "lab-intro")
    var = f"lab{idx}Code"
    const = f"  const {var} = {J(lab['code'])};"
    jsx = f"""      <h2 id="{lab['id']}">{lab['title']}</h2>
      <p>{intro}</p>
      <PyodideLab
        title={J(lab['title'])}
        hint={J(lab['hint'])}
        defaultCode={{{var}}}
      />"""
    return const, jsx


def decision_map(scenarios, aturan):
    parts = ['      <h2 id="peta">\U0001f5fa\ufe0f Peta Keputusan</h2>']
    for i, s in enumerate(scenarios, 1):
        title = check_prose(s["title"], "dm-title")
        kondisi = check_prose(s["kondisi"], "dm-kondisi")
        alasan = check_prose(s["alasan"], "dm-alasan")
        contoh = check_prose(s["contoh"], "dm-contoh")
        card = [f"""      <div className="decision-card">
        <h3>{i}. {title}</h3>
        <p><strong>Kondisi:</strong> {kondisi}</p>"""]
        if s.get("chart_jsx"):
            card.append(s["chart_jsx"])
        card.append(f"""        <p><strong>Kenapa:</strong> {alasan}</p>
        <p><strong>Contoh nyata:</strong> {contoh}</p>
      </div>""")
        parts.append("\n".join(card))
    if aturan:
        lis = "\n".join(f"          <li>{check_prose(a, 'aturan')}</li>" for a in aturan)
        parts.append(f"""      <div className="callout" style={{{{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}}}>
        <h3>\U0001f9ed Aturan praktis 10 detik</h3>
        <ol>
{lis}
        </ol>
      </div>""")
    return "\n".join(parts)


def mini_case(case):
    title = check_prose(case["title"], "case-title")
    pertanyaan = check_prose(case["pertanyaan"], "case-q")
    pembahasan = check_prose(case["pembahasan"], "case-a")
    body = para_list(case["body"], "case-body")
    return f"""      <h2 id="case">\U0001f4cb Mini-Case: {title}</h2>
      <div className="callout">
        {body}
        <p><strong>Pertanyaan:</strong> {pertanyaan}</p>
        <details className="worked">
          <summary>\U0001f4a1 Pembahasan (klik untuk buka)</summary>
          <p>{pembahasan}</p>
        </details>
      </div>"""


def quiz_block(quizzes):
    parts = [f'      <h2 id="quiz">\u270f\ufe0f Quiz \u2014 Uji Judgment-mu ({len(quizzes)} soal)</h2>']
    for i, (q, opts, correct, why) in enumerate(quizzes, 1):
        if len(opts) != 4:
            raise ValueError(f"Quiz {i}: harus 4 opsi")
        opts_js = ",\n          ".join(J(o) for o in opts)
        parts.append(f"""      <Quiz
        question={J(f'{i}. {q}')}
        options={{[{opts_js}]}}
        correct={{{correct}}}
        explanation={J(why)}
      />""")
    score = len(quizzes)
    parts.append(f"""      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika \u2265 {score - 1} dari {score} benar. Kalau ada yang salah, baca lagi feedback-nya \u2014 di situlah pelajarannya.</p>
      </div>""")
    return "\n\n".join(parts)


def rangkuman(items):
    lis = "\n".join(f"          <li>{check_prose(x, 'rangkuman')}</li>" for x in items)
    return f"""      <h2 id="rangkum">\U0001f4dd Rangkuman</h2>
      <div className="callout">
        <ul>
{lis}
        </ul>
      </div>"""


def nav(prev, nxt):
    prev_jsx = (f'<Link href="/learn/{prev[0]}" className="btn btn-secondary btn-sm">\u2190 {prev[1]}</Link>'
                if prev else '<Link href="/" className="btn btn-secondary btn-sm">\u2190 Daftar Materi</Link>')
    nxt_jsx = (f'<Link href="/learn/{nxt[0]}" className="btn btn-primary btn-sm">{nxt[1]} \u2192</Link>'
               if nxt else "")
    return f"""      <hr className="divider-fancy" />
      <div style={{{{ display: "flex", justifyContent: "space-between" }}}}>
        {prev_jsx}
        {nxt_jsx}
      </div>"""


# ---------------------------------------------------------------- main

def render_lesson(L):
    consts = []
    body = []

    body.append(cover(L["code"], L["track"], L["cover_title"], L["meta"]))
    body.append(toc(L["toc"]))
    body.append(tujuan(L["tujuan"]))
    body.append(story(L["story_title"], L["story"]))

    for c in L["konsep"]:
        body.append(concept(c))
        if c.get("chart"):
            const, jsx = chart_block(c["chart"])
            consts.append(const)
            body.append(jsx)

    body.append(myths_block(L["myths"]))
    body.append(tips_block(L["tips"]))

    for i, lab in enumerate(L["labs"], 1):
        const, jsx = lab_block(lab, L["lab_offset"] + i if "lab_offset" in L else i)
        consts.append(const)
        body.append(jsx)

    # decision map: siapkan chart consts dulu
    dm_scenarios = []
    for s in L["decision_map"]:
        s2 = dict(s)
        if s.get("chart"):
            const, jsx = chart_block(s["chart"])
            consts.append(const)
            s2["chart_jsx"] = jsx
        dm_scenarios.append(s2)
    body.append(decision_map(dm_scenarios, L.get("aturan10")))

    body.append(mini_case(L["case"]))
    body.append(quiz_block(L["quiz"]))
    body.append(rangkuman(L["rangkuman"]))
    body.append(nav(L.get("prev"), L.get("next")))

    imports = ['import Quiz from "@/components/Quiz";',
               'import PlotlyChart from "@/components/PlotlyChart";',
               'import PyodideLab from "@/components/PyodideLab";',
               'import Tex from "@/components/Tex";',
               'import Link from "next/link";']
    if L.get("use_stats_calc"):
        imports.insert(1, 'import StatsCalculator from "@/components/StatsCalculator";')
    imports_s = "\n".join(imports)

    consts_s = "\n\n".join(consts)
    body_s = "\n\n".join(body)

    comp_name = L["slug"].replace("-", "_").title().replace("_", "") + "Page"

    return f"""{imports_s}

export const runtime = "edge";

export default function {comp_name}() {{
{consts_s}

  return (
    <div className="container-read" style={{{{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}}}>
      <Link href="/" className="text-small">\u2190 Daftar Materi</Link>

{body_s}
    </div>
  );
}}
"""


FILLER = [
    "Pada lesson kali ini kita akan membahas",
    "Seperti yang telah dibahas sebelumnya",
    "Mari kita mulai pembahasan",
    "Selanjutnya, kita akan melihat",
    "Penting untuk diingat bahwa",
]


def qa_scan(L):
    """F1-F6 scan. Raises on failure."""
    errs = []
    if len(L["myths"]) < 2:
        errs.append("myths < 2")
    if len(L["tips"]) < 2:
        errs.append("tips < 2")
    if len(L["labs"]) < 2:
        errs.append("labs < 2")
    if not (4 <= len(L["quiz"]) <= 6):
        errs.append(f"quiz count {len(L['quiz'])}")
    if len(L["decision_map"]) < 3:
        errs.append("decision_map < 3")
    if not L.get("case"):
        errs.append("no mini-case")
    if not L.get("story"):
        errs.append("no story")
    blob = json.dumps(L, ensure_ascii=False)
    for f in FILLER:
        if f in blob:
            errs.append(f"F1 filler: {f!r}")
    has_tex = any(c.get("rumus") for c in L["konsep"])
    if not has_tex:
        errs.append("no KaTeX rumus in konsep")
    n_charts = sum(1 for c in L["konsep"] if c.get("chart")) + sum(
        1 for s in L["decision_map"] if s.get("chart"))
    if n_charts < 1:
        errs.append("no charts")
    if errs:
        raise ValueError(f"QA FAIL {L['slug']}: " + "; ".join(errs))
    print(f"  QA OK: {L['slug']} ({len(L['quiz'])} quiz, {len(L['labs'])} lab, {n_charts} chart)")
