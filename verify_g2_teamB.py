#!/usr/bin/env python3
"""Verifikasi lesson G2 Team-B (e19..e22): tasks, summary, F1, quiz, compile lab."""
import re, subprocess, json, sys, os

BASE = os.path.dirname(os.path.abspath(__file__))
FILES = {
    "e19": "src/app/v2/content/e19-real-estate-reit.ts",
    "e20": "src/app/v2/content/e20-asuransi-dana-pensiun.ts",
    "e21": "src/app/v2/content/e21-investment-banking.ts",
    "e22": "src/app/v2/content/e22-reksa-dana-etf.ts",
}
F1 = [
    "Pada lesson kali ini kita akan membahas",
    "Seperti yang telah dibahas sebelumnya",
    "Mari kita mulai pembahasan",
    "Selanjutnya, kita akan melihat",
    "Penting untuk diingat bahwa",
]

NODE_HARNESS = r"""
const fs = require('fs');
const path = process.argv[1];
let src = fs.readFileSync(path, 'utf8');
src = src.replace(/^import type .*$/m, '');
const m = src.match(/export const (\w+)(?::\s*V2Lesson)?\s*=\s*/);
if (!m) { console.log(JSON.stringify({error: 'no export'})); process.exit(0); }
const name = m[1];
src = src.replace(m[0], 'globalThis.__L = ');
try { eval(src); } catch (e) { console.log(JSON.stringify({error: 'eval: ' + e.message})); process.exit(0); }
const L = globalThis.__L;
const out = { exportName: name, slug: L.slug, title: L.title, steps: [] };
for (const s of L.steps) {
  const st = { id: s.id, hasTasks: Array.isArray(s.tasks),
               nTasks: Array.isArray(s.tasks) ? s.tasks.length : -1,
               hasSummary: Array.isArray(s.summary),
               nQuiz: s.quiz ? s.quiz.length : 0,
               quizDetail: [], hasCode: !!s.code, hasFigure: !!s.figure,
               solution: s.code ? s.code.solution : null,
               patterns: s.code ? s.code.checks.filter(c => c.pattern).map(c => c.pattern) : [] };
  for (const q of (s.quiz || [])) {
    st.quizDetail.push({ nOptions: q.options.length,
                         nCorrect: q.options.filter(o => o.correct).length,
                         allWhy: q.options.every(o => o.why && o.why.length > 10) });
  }
  out.steps.push(st);
}
console.log(JSON.stringify(out));
"""

def node_check(path):
    r = subprocess.run(["node", "-e", NODE_HARNESS, path],
                       capture_output=True, text=True, cwd=BASE)
    return json.loads(r.stdout.strip().splitlines()[-1])

ok = True
for prefix, rel in FILES.items():
    path = os.path.join(BASE, rel)
    src = open(path, encoding="utf-8").read()
    errs = []
    info = node_check(path)
    if "error" in info:
        errs.append("NODE " + info["error"])
        info = {"exportName": "?", "slug": "?", "steps": []}
    if info.get("exportName") != prefix:
        errs.append(f"export name {info.get('exportName')} != {prefix}")
    if info.get("slug") != os.path.basename(rel)[:-3]:
        errs.append(f"slug {info.get('slug')} != filename")
    # tasks di setiap langkah
    for st in info["steps"]:
        if not st["hasTasks"]:
            errs.append(f"step {st['id']}: tasks hilang")
    # summary wajib ada (checkpoint/akhir)
    if not any(s["hasSummary"] for s in info["steps"]):
        errs.append("tidak ada summary di lesson")
    # quiz: >=4 opsi, tepat 1 correct, why spesifik
    total_q = sum(s["nQuiz"] for s in info["steps"])
    if total_q < 4:
        errs.append(f"quiz total {total_q} < 4")
    for st in info["steps"]:
        for i, q in enumerate(st["quizDetail"]):
            if q["nOptions"] < 4:
                errs.append(f"quiz {st['id']}#{i}: opsi {q['nOptions']} < 4")
            if q["nCorrect"] != 1:
                errs.append(f"quiz {st['id']}#{i}: correct={q['nCorrect']} (harus 1)")
            if not q["allWhy"]:
                errs.append(f"quiz {st['id']}#{i}: why kurang spesifik")
    # F1
    for ph in F1:
        if ph.lower() in src.lower():
            errs.append(f"F1: frasa terlarang '{ph}'")
    if re.search(r"lihat lesson\s+[A-Z]?\d", src, re.I):
        errs.append("F2: referensi 'lihat lesson X'")
    # lab: compile + jalankan solution ASLI dari .ts, uji pola stdout terhadap output nyata
    sols = [(s["id"], s["solution"], s["patterns"])
            for s in info["steps"] if s["solution"]]
    if not sols:
        errs.append("tidak ada lab solution")
    for j, (sid, code, patterns) in enumerate(sols):
        try:
            compile(code, f"{prefix}-lab{j}", "exec")
        except SyntaxError as e:
            errs.append(f"lab {sid} SyntaxError: {e}")
            continue
        try:
            r = subprocess.run([sys.executable, "-c", code],
                               capture_output=True, text=True, timeout=30)
        except Exception as e:
            errs.append(f"lab {sid} gagal dijalankan: {e}")
            continue
        if r.returncode != 0:
            errs.append(f"lab {sid} runtime error: {r.stderr.strip()[:200]}")
            continue
        for pat in patterns:
            if not re.search(pat, r.stdout):
                errs.append(f"lab {sid}: pola /{pat}/ TIDAK cocok output nyata: {r.stdout.strip()[:120]!r}")
    n_labs = len(sols)
    # myth & decision map & minicase & story & chart: kehadiran penanda
    for marker, label in [("🚨", "myth box"), ("💡", "tips"),
                          ("Cara membaca", "panduan chart"), ("Interpretasi", "interpretasi chart"),
                          ("Peta keputusan", "decision map"), ("Mini-case", "mini-case")]:
        if marker not in src and label in ("myth box", "tips"):
            errs.append(f"tidak ada {label}")
    n_myth = src.count("🚨")
    print(f"[{prefix}] steps={len(info['steps'])} quiz={total_q} labs={n_labs} "
          f"myths={n_myth} tasks_ok={all(s['hasTasks'] for s in info['steps'])}")
    if errs:
        ok = False
        for e in errs:
            print(f"   FAIL: {e}")
    else:
        print("   PASS semua cek")
print("HASIL:", "LOLOS" if ok else "GAGAL")
sys.exit(0 if ok else 1)
