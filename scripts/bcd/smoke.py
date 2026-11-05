#!/usr/bin/env python3
"""Smoke test renderer -> page.tsx -> tsc."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from render import Lesson, T, TI, myth, tip, callout, worked, codebox, sql_answer, sql_lab_code, qa_lesson

L = Lesson("t1-smoke", "T1 — Smoke", "Judul<br/>Smoke Test",
           "45–60 menit &bull; 2 lab &bull; 4 quiz &bull; 1 mini-case",
           ("/", "Daftar Materi"), ("t2-x", "Next: T2"))

L.sec("tujuan", "🎯 Tujuan Pembelajaran")
L.raw('<div className="callout"><ul><li>Satu.</li><li>Dua.</li></ul></div>')

L.sec("cerita", "Cerita Pembuka")
L.raw('<div className="story"><p>Cerita dengan twist.</p></div>')

L.sec("konsep", "Konsep Inti")
L.p("Rumus: " + T(r"P(A) = \frac{n(A)}{n(S)}"))
L.p("Inline " + TI(r"\mu") + " selesai.")
L.raw(worked("📐 Contoh", "<p>Langkah.</p>"))
L.raw(myth("Rata-rata selalu mewakili", "Tidak. <strong>Contoh</strong> dengan &lt; 5."))
L.raw(tip("Median hanya peduli urutan."))
L.raw(myth("Kedua", "Isi kedua."))
L.raw(tip("Kedua tip."))

L.chart(
    data=[{"x": ["a", "b"], "y": [1, 2], "type": "bar", "marker": {"color": "#2a7de1"}}],
    title="Chart Uji",
    layout={"xaxis": {"title": "X"}, "yaxis": {"title": "Y"}},
    cara="Sumbu X kategori, tinggi batang nilai.",
    interpretasi="B lebih besar dari A.")

L.sec("lab1", "🔬 Lab 1")
L.lab("Lab 1 — Uji", "Ubah angka lalu jalankan.",
       'x = 5\nprint(f"hasil = {x*2}")',
       "Coba x = 10.")

L.sec("lab2", "🔬 Lab 2 (SQL)")
code = sql_lab_code("t", "CREATE TABLE t (a INTEGER, b TEXT)",
                    [(1, "x"), (2, None)], "Tampilkan semua baris.", "SELECT * FROM t")
L.lab("Lab 2 — SQL", "Tulis query.", code, "Coba WHERE.")
L.raw(sql_answer("Jawaban tugas", "SELECT * FROM t;"))

L.sec("peta", "🗺️ Peta Keputusan")
dc = L.decision_chart([{"x": [1], "y": [1], "type": "bar"}], "Mini", {})
L.decision("1", "Skenario A → <strong>Pilih A</strong>", "Kondisi x.",
           chart_var=dc, chart_title="Mini", kenapa="Karena.", contoh="Nyata.")
L.decision("2", "Skenario B → <strong>Pilih B</strong>", "Kondisi y.", kenapa="Karena.", contoh="Nyata.")
L.decision("3", "Skenario C → <strong>Pilih C</strong>", "Kondisi z.", kenapa="Karena.", contoh="Nyata.")
L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Satu.</li></ol>"))

L.sec("case", "📋 Mini-Case")
L.raw(callout("<p>Narasi.</p><p><strong>Pertanyaan:</strong> apa?</p>" +
              worked("💡 Pembahasan", "<p>Jawaban.</p>")))

L.quiz("Soal 1?", ["a", "b", "c", "d"], 1, "Karena b.")
L.quiz("Soal 2?", ["a", "b", "c", "d"], 0, "Karena a.")
L.quiz("Soal 3?", ["a", "b", "c", "d"], 2, "Karena c.")
L.quiz("Soal 4?", ["a", "b", "c", "d"], 3, "Karena d.")
L.quiz_section()

L.sec("rangkum", "📝 Rangkuman")
L.raw('<div className="callout"><ul><li><strong>A:</strong> ringkas.</li></ul></div>')

errs = qa_lesson(L)
print("QA:", errs if errs else "OK")
out = L.render()
os.makedirs("/tmp/smoke_out", exist_ok=True)
with open("/tmp/smoke_out/page.tsx", "w") as f:
    f.write(out)
print("wrote /tmp/smoke_out/page.tsx", len(out), "chars")
# extract lab codes for execution test
import re
codes = re.findall(r"const lab\d+Code = String\.raw`(.*?)`;", out, re.S)
with open("/tmp/smoke_out/labs.txt", "w") as f:
    for i, c in enumerate(codes):
        f.write(f"===== LAB {i} =====\n{c}\n")
print("labs:", len(codes))
