#!/usr/bin/env python3
"""Renderer: lesson data (Python) -> Next.js page.tsx (WORKFLOW.md v2.0)."""
import json, re, html

# ---------------------------------------------------------------- helpers
def esc_attr(s: str) -> str:
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")

def T(math: str, block: bool = True) -> str:
    """KaTeX via <Tex math={String.raw`...`} /> — SELALU String.raw."""
    assert "`" not in math, f"backtick in math: {math[:60]}"
    assert "\\" in math or True
    return "<Tex math={String.raw`" + math + "`}" + (" block" if block else "") + " />"

def TI(math: str) -> str:
    return T(math, block=False)

def js(v) -> str:
    if v is None: return "null"
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, (int, float)):
        if isinstance(v, float) and (v != v or v in (float("inf"), float("-inf"))):
            return "null"
        return repr(v)
    if isinstance(v, str): return json.dumps(v, ensure_ascii=False)
    if isinstance(v, (list, tuple)): return "[" + ", ".join(js(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{" + ", ".join(json.dumps(str(k)) + ": " + js(x) for k, x in v.items()) + "}"
    raise TypeError(f"js(): unsupported {type(v)}")

def slug_to_component(slug: str) -> str:
    parts = re.split(r"[-_]", slug)
    return "".join(p[:1].upper() + p[1:] for p in parts if p) + "Page"

# ---------------------------------------------------------------- JSX sanitizer
# Escape < > { } yang muncul di posisi TEKS JSX (error TS1382/TS1005/TS1381),
# tanpa merusak tag, atribut, ekspresi {..}, dan komentar {/* .. */}.
def _scan_tag(s: str, i: int) -> int:
    n = len(s); j = i + 1; quote = None
    while j < n:
        c = s[j]
        if quote:
            if c == "\\":
                j += 1
            elif c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == ">":
            return j + 1
        j += 1
    return n

def _scan_expr(s: str, i: int) -> int:
    n = len(s); j = i + 1; depth = 1; quote = None
    while j < n:
        c = s[j]
        if quote:
            if c == "\\":
                j += 1
            elif c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    return n

def sanitize_body(s: str) -> str:
    out = []; i = 0; n = len(s)
    while i < n:
        c = s[i]
        if c == "<" and i + 1 < n and (s[i + 1].isalpha() or s[i + 1] == "/"):
            j = _scan_tag(s, i); out.append(s[i:j]); i = j
        elif c == "{":
            if s[i:i + 3] == "{/*":
                j = s.find("*/}", i); j = n if j == -1 else j + 3
                out.append(s[i:j]); i = j
            else:
                j = _scan_expr(s, i)
                inner = s[i + 1:j - 1] if j <= n else ""
                if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", inner or ""):
                    out.append(s[i:j]); i = j
                else:
                    out.append("&#123;"); i += 1
        elif c == "<":
            out.append("&lt;"); i += 1
        elif c == ">":
            out.append("&gt;"); i += 1
        elif c == "}":
            out.append("&#125;"); i += 1
        else:
            out.append(c); i += 1
    return "".join(out)

# ---------------------------------------------------------------- content blocks
def myth(title: str, body: str) -> str:
    return ('<div className="myth">\n'
            f'<p><strong className="t">🚨 Miskonsepsi: &ldquo;{title}&rdquo;</strong></p>\n'
            f'<p><strong>Yang benar:</strong> {body}</p>\n</div>')

def tip(body: str) -> str:
    return f'<div className="tip">\n<p><strong>💡 Intuisi kunci:</strong> {body}</p>\n</div>'

def callout(body: str, warn: bool = False) -> str:
    cls = "callout callout-warning" if warn else "callout"
    return f'<div className="{cls}">\n{body}\n</div>'

def worked(summary: str, body: str) -> str:
    return (f'<details className="worked">\n<summary>{summary}</summary>\n{body}\n</details>')

def codebox(code: str, lang: str = "sql") -> str:
    esc = html.escape(code).replace("{", "&#123;").replace("}", "&#125;")
    return (f'<div className="code-header"><span className="code-lang">{lang}</span></div>'
            f'<pre className="codebox">{esc}</pre>')

def chart_guide(cara: str, interpretasi: str) -> str:
    return ('<div className="chart-guide">\n'
            f'<p><strong>Cara membaca:</strong> {cara}</p>\n'
            f'<p><strong>Interpretasi:</strong> {interpretasi}</p>\n</div>')

def sql_answer(title: str, sql: str) -> str:
    return worked(f"🔑 {title} (klik untuk lihat jawaban)",
                  "<p>Jawaban yang benar:</p>\n" + codebox(sql, "sql"))

# ---------------------------------------------------------------- Lesson builder
class Lesson:
    def __init__(self, slug, eyebrow, title, meta, prev, nxt):
        self.slug = slug
        self.eyebrow = eyebrow
        self.title = title          # boleh pakai <br />
        self.meta = meta
        self.prev = prev            # (slug,label) | ("/","Daftar Materi")
        self.next = nxt
        self.toc = []               # [(id,label)]
        self.body = []              # list[str] JSX fragments
        self.quizzes = []           # list[dict]
        self._charts = []           # list[(var, data, title, layout)]
        self._codes = []            # list[(var, code)]
        self._cn = 0
        self._ln = 0

    # -- struktur
    def sec(self, id_, label):
        self.toc.append((id_, label))
        self.body.append(f'<h2 id="{id_}">{label}</h2>')

    def h3(self, text):
        self.body.append(f"<h3>{text}</h3>")

    def p(self, html_):
        self.body.append(f"<p>{html_}</p>")

    def raw(self, html_):
        self.body.append(html_)

    def ul(self, items):
        self.body.append("<ul>\n" + "\n".join(f"<li>{i}</li>" for i in items) + "\n</ul>")

    def ol(self, items):
        self.body.append("<ol>\n" + "\n".join(f"<li>{i}</li>" for i in items) + "\n</ol>")

    def table(self, headers, rows):
        h = "".join(f"<th>{c}</th>" for c in headers)
        r = "\n".join("<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>" for row in rows)
        self.body.append(
            '<div style={{ overflowX: "auto" }}>\n<table className="data-table">\n'
            f"<thead><tr>{h}</tr></thead>\n<tbody>\n{r}\n</tbody>\n</table>\n</div>")

    # -- komponen
    def chart(self, data, title, layout, cara, interpretasi):
        self._cn += 1
        var = f"chart{self._cn}"
        self._charts.append((var, data, title, layout or {}))
        self.body.append(
            f'<PlotlyChart\n  data={{{var}}}\n  title="{esc_attr(title)}"\n  layout={{{js(layout or {})}}}\n/>')
        self.body.append(chart_guide(cara, interpretasi))

    def lab(self, title, intro, code, hint):
        assert "`" not in code, f"backtick in lab code {title[:40]}"
        self._ln += 1
        var = f"lab{self._ln}Code"
        self._codes.append((var, code))
        self.body.append(f"<p>{intro}</p>")
        self.body.append(
            f'<PyodideLab\n  title="{esc_attr(title)}"\n  hint="{esc_attr(hint)}"\n  defaultCode={{{var}}}\n/>')

    def quiz(self, question, options, correct, explanation):
        assert len(options) == 4
        self.quizzes.append(dict(question=question, options=options,
                                 correct=correct, explanation=explanation))

    def decision(self, no, title, kondisi, chart_var=None, chart_title=None,
                 chart_layout=None, kenapa="", contoh=""):
        parts = [f'<div className="decision-card">',
                 f"<h3>{no}. {title}</h3>",
                 f"<p><strong>Kondisi data:</strong> {kondisi}</p>"]
        if chart_var:
            parts.append(
                f'<PlotlyChart data={{{chart_var}}} title="{esc_attr(chart_title or "")}" '
                f'layout={{{js(chart_layout or {})}}} />')
        parts.append(f"<p><strong>Kenapa:</strong> {kenapa}</p>")
        parts.append(f"<p><strong>Contoh nyata:</strong> {contoh}</p>")
        parts.append("</div>")
        self.body.append("\n".join(parts))

    def decision_chart(self, data, title, layout):
        """Chart khusus untuk dipakai di dalam decision card. Return var name."""
        self._cn += 1
        var = f"dchart{self._cn}"
        self._charts.append((var, data, title, layout or {}))
        return var

    def calc(self, defaultValues, title):
        self.body.append(
            f'<StatsCalculator defaultValues="{esc_attr(defaultValues)}" '
            f'title="{esc_attr(title)}" />')

    def quiz_section(self, id_="quiz", label=None):
        n = len(self.quizzes)
        label = label or f"✏️ Quiz — Uji Judgment-mu ({n} soal)"
        self.sec(id_, label)
        self.body.append("<QuizSection quizzes={quizData} />")

    # -- render
    def _render_quiz_data(self):
        return js([dict(question=q["question"], options=q["options"],
                        correct=q["correct"], explanation=q["explanation"])
                   for q in self.quizzes])

    def render(self):
        comp = slug_to_component(self.slug)
        head = []
        for var, data, title, layout in self._charts:
            head.append(f"  const {var} = {js(data)};")
        for var, code in self._codes:
            head.append(f"  const {var} = String.raw`" + code + "`;")
        if self.quizzes:
            head.append(f"  const quizData = {self._render_quiz_data()};")
        head_s = "\n".join(head)

        toc_items = "\n".join(
            f'          <li><a href="#{i}">{sanitize_body(l)}</a></li>' for i, l in self.toc)

        prev_href = self.prev[0] if self.prev[0].startswith("/") else f"/learn/{self.prev[0]}"
        next_href = "" if not self.next[0] else (self.next[0] if self.next[0].startswith("/") else f"/learn/{self.next[0]}")
        body_s = "\n\n      ".join(sanitize_body(b) for b in self.body)
        title_s = sanitize_body(self.title)
        meta_s = sanitize_body(self.meta)
        prev_l = sanitize_body(self.prev[1])
        next_l = sanitize_body(self.next[1] or "")
        next_nav = f'<Link href="{next_href}" className="btn btn-primary btn-sm">{next_l} →</Link>' if next_href else '<span></span>'

        return f'''import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";

export const runtime = "edge";

export default function {comp}() {{
{head_s}

  return (
    <div className="container-read" style={{{{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}}}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {{/* 1. COVER */}}
      <div className="lesson-cover">
        <span className="eyebrow">{self.eyebrow}</span>
        <h1 className="display-title">{title_s}</h1>
        <div className="meta">{meta_s}</div>
      </div>

      {{/* 2. TOC */}}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
{toc_items}
        </ol>
      </div>

      {body_s}

      <hr className="divider-fancy" />
      <div style={{{{ display: "flex", justifyContent: "space-between" }}}}>
        <Link href="{prev_href}" className="btn btn-secondary btn-sm">← {prev_l}</Link>
        {next_nav}
      </div>
    </div>
  );
}}
'''

# ---------------------------------------------------------------- SQL lab helper
SQL_Q_FN = '''
def q(sql):
    """Jalankan query SQL, cetak hasilnya."""
    cur.execute(sql)
    rows = cur.fetchall()
    if cur.description:
        cols = [d[0] for d in cur.description]
        header = " | ".join(cols)
        print(header)
        print("-" * len(header))
        for r in rows:
            print(" | ".join("NULL" if v is None else str(v) for v in r))
        print(f"({len(rows)} baris)")
    else:
        print("OK")
'''

def sql_lab_code(tables, task_comment: str, starter: str) -> str:
    """Bangun kode lab SQL (sqlite3 di Pyodide).
    tables: list of (table_name, ddl, rows).
    """
    parts = ["import sqlite3", 'db = sqlite3.connect(":memory:")', "cur = db.cursor()"]
    for table, ddl, rows in tables:
        parts.append(f'cur.executescript("""{ddl}""")')
        if rows:
            row_repr = ",\n".join("    " + repr(tuple(r)) for r in rows)
            placeholders = ",".join(["?"] * len(rows[0]))
            parts.append(f"data_{table} = [\n{row_repr}\n]")
            parts.append(f'cur.executemany("INSERT INTO {table} VALUES ({placeholders})", data_{table})')
    parts.append("db.commit()")
    code = "\n".join(parts) + "\n"
    code += SQL_Q_FN
    commented = "\n".join("# " + ln for ln in task_comment.split("\n"))
    code += f"# --- TUGAS ---\n{commented}\n" + 'q("""' + starter + '""")'
    return code

# ---------------------------------------------------------------- QA
FILLER = [
    "Pada lesson kali ini kita akan membahas",
    "Seperti yang telah dibahas sebelumnya",
    "Mari kita mulai pembahasan",
    "Selanjutnya, kita akan melihat",
    "Penting untuk diingat bahwa",
]

def qa_lesson(L: Lesson):
    errs = []
    src = "\n".join(L.body)
    for f in FILLER:
        if f in src:
            errs.append(f"FILLER: {f}")
    if src.count('className="myth"') < 2: errs.append("myth<2")
    if src.count('className="tip"') < 2: errs.append("tip<2")
    if src.count("<PyodideLab") < 2: errs.append("lab<2")
    if len(L.quizzes) < 4: errs.append(f"quiz<4 ({len(L.quizzes)})")
    if not L.quizzes: errs.append("no quiz data")
    if "<QuizSection" not in src and L.quizzes: errs.append("quiz section not rendered")
    if src.count('className="chart-guide"') < 1: errs.append("chart-guide<1")
    if src.count('className="decision-card"') < 3: errs.append("decision<3")
    if 'className="story"' not in src: errs.append("no story")
    return errs
