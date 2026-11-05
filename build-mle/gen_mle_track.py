#!/usr/bin/env python3
"""Generator for MLE track (mle1..mle14) v2 lessons. Runs every lab solution with
python3 to capture REAL stdout; auto-calibrates `equal` check values."""
import subprocess, re, sys, os, json

OUT_DIR = os.path.expanduser("~/workspace/learn-platform/src/app/v2/content")

# ---------- escaping ----------
def esc_prose(s: str) -> str:
    # KOREKSI 2026-10-13: prose/quiz/note/hint dirender via renderInline() ke React
    # text nodes yang AUTO-ESCAPE -> tulis karakter MENTAH (<, >, &).
    # Entity HTML hanya benar di dalam const SVG (dangerouslySetInnerHTML).
    return s

def ts_str(s: str) -> str:
    s = s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t")
    return '"' + s + '"'

def ts_tpl(s: str) -> str:
    # TS template literal for Python code: double every backslash so regex \s etc survive
    s = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return "`" + s + "`"

def ts_raw_tpl(s: str) -> str:
    # for String.raw KaTeX: single backslash must survive -> do NOT double backslashes
    s = s.replace(chr(96), chr(92) + chr(96))
    return chr(96) + s + chr(96)


# ---------- lab integrity ----------
def run_py(code: str):
    r = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=60)
    return r

def calibrate(step: dict):
    """Run solution; fail loudly on error; auto-set expected + equal values;
    verify authored stdout_matches patterns."""
    code = step.get("code")
    if not code:
        return
    r = run_py(code["solution"])
    if r.returncode != 0:
        raise SystemExit("SOLUTION FAILED [" + step["id"] + "]:\n" + r.stderr)
    out = r.stdout
    if not code.get("expected"):
        lines = [l for l in out.splitlines() if l.strip()]
        code["expected"] = lines[-1] if lines else ""
    names = sorted({c["name"] for c in code["checks"] if c.get("name") and c["kind"] in ("equal", "contains", "defined")})
    vals = {}
    if names:
        probe = code["solution"] + "\n" + "\n".join(
            "try:\n    print('##V## " + n + " ' + repr(" + n + "))\nexcept NameError:\n    print('##V## " + n + " ##UNDEF##')" for n in names)
        r2 = run_py(probe)
        if r2.returncode != 0:
            raise SystemExit("PROBE FAILED [" + step["id"] + "]:\n" + r2.stderr)
        for line in r2.stdout.splitlines():
            if line.startswith("##V## "):
                _, name, val = line.split(" ", 2)
                if val == "##UNDEF##":
                    continue
                try:
                    vals[name] = eval(val, {"__builtins__": {}})
                except Exception:
                    vals[name] = "__SKIP__"
    for c in code["checks"]:
        if c["kind"] == "equal" and c.get("name") in vals and vals[c["name"]] != "__SKIP__":
            c["value"] = vals[c["name"]]
            c.setdefault("tol", 1e-9)
        elif c["kind"] == "stdout_matches":
            pat = c.get("pattern")
            if not pat:
                raise SystemExit("stdout_matches without pattern [" + step["id"] + "]")
            if not re.search(pat, out):
                raise SystemExit("PATTERN MISMATCH [" + step["id"] + "]: " + repr(pat) + " not in:\n" + out)

# SVG helpers (theme-aware) — re-inserted into gen.py before LESSONS = []
C1, C2, C3, C4 = "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"

def bars_svg(pairs, title="", w=480, h=200, unit="", colors=None):
    """pairs: [(label, value)]. Simple vertical bars, theme-aware."""
    n = len(pairs)
    pad_l, pad_b, pad_t = 46, 34, 26
    cw, ch = w - pad_l - 14, h - pad_t - pad_b
    mx = max(v for _, v in pairs) or 1
    bw = cw / n
    cols = colors or [C1, C2, C3, C4]
    parts = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{title}">']
    parts.append(f'<text x="{w/2}" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{title}</text>')
    for i in range(5):
        y = pad_t + ch - ch * i / 4
        val = mx * i / 4
        parts.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-14}" y2="{y:.1f}" stroke="var(--chart-grid)" stroke-width="1"/>')
        parts.append(f'<text x="{pad_l-6}" y="{y+4:.1f}" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">{val:.1f}</text>')
    for i, (lab, v) in enumerate(pairs):
        x = pad_l + i * bw + bw * 0.18
        bw2 = bw * 0.64
        bh = ch * v / mx
        y = pad_t + ch - bh
        parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw2:.1f}" height="{bh:.1f}" fill="{cols[i % len(cols)]}" rx="3"/>')
        parts.append(f'<text x="{x+bw2/2:.1f}" y="{y-6:.1f}" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{v:g}{unit}</text>')
        parts.append(f'<text x="{x+bw2/2:.1f}" y="{pad_t+ch+16:.1f}" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">{lab}</text>')
    parts.append(f'<line x1="{pad_l}" y1="{pad_t+ch}" x2="{w-14}" y2="{pad_t+ch}" stroke="var(--chart-grid)" stroke-width="1"/>')
    parts.append('</svg>')
    return "\n".join(parts)

def funnel_svg(stages, title="", w=480, h=230):
    """stages: [(label, count)]. Horizontal funnel bars."""
    pad_l, pad_t = 130, 34
    cw = w - pad_l - 60
    mx = max(c for _, c in stages)
    parts = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{title}">']
    parts.append(f'<text x="{w/2}" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{title}</text>')
    rh = (h - pad_t - 16) / len(stages)
    cols = [C1, C2, C3, C4]
    for i, (lab, c) in enumerate(stages):
        y = pad_t + i * rh + 4
        bw = cw * c / mx
        parts.append(f'<text x="{pad_l-8}" y="{y+rh/2-2+4:.1f}" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">{lab}</text>')
        parts.append(f'<rect x="{pad_l}" y="{y:.1f}" width="{bw:.1f}" height="{rh-10:.1f}" fill="{cols[i % 4]}" rx="4"/>')
        parts.append(f'<text x="{pad_l+bw+8:.1f}" y="{y+rh/2-2+4:.1f}" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{c}</text>')
    parts.append('</svg>')
    return "\n".join(parts)

def line_svg(series, title="", xlab="", ylab="", w=480, h=220, marks=None):
    """series: [(x, y)] polyline."""
    pad_l, pad_b, pad_t = 48, 34, 26
    cw, ch = w - pad_l - 14, h - pad_t - pad_b
    xs = [x for x, _ in series]; ys = [y for _, y in series]
    x0, x1 = min(xs), max(xs); y0, y1 = min(ys), max(ys)
    if x1 == x0: x1 = x0 + 1
    if y1 == y0: y1 = y0 + 1
    def X(x): return pad_l + cw * (x - x0) / (x1 - x0)
    def Y(y): return pad_t + ch - ch * (y - y0) / (y1 - y0)
    pts = " ".join(f"{X(x):.1f},{Y(y):.1f}" for x, y in series)
    parts = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{title}">']
    parts.append(f'<text x="{w/2}" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{title}</text>')
    parts.append(f'<polyline points="{pts}" fill="none" stroke="{C1}" stroke-width="2.5"/>')
    for x, y in series[::max(1, len(series)//8)]:
        parts.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="3" fill="{C1}"/>')
    if marks:
        for x, y, lab in marks:
            parts.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="4.5" fill="{C4}"/>')
            parts.append(f'<text x="{X(x):.1f}" y="{Y(y)-10:.1f}" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{lab}</text>')
    parts.append(f'<text x="{pad_l+cw/2}" y="{h-8}" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">{xlab}</text>')
    parts.append(f'<text x="14" y="{pad_t+ch/2}" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 {pad_t+ch/2})">{ylab}</text>')
    parts.append('</svg>')
    return "\n".join(parts)

LESSONS = []

# ==================== MLE1 ====================
mle1 = {
  "slug": "mle1-lanskap", "track": "Machine Learning Engineer",
  "module": "Fondasi Produksi", "title": "MLE1 — Dari Notebook ke Produksi", "estMinutes": 50,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Track ini bukan tentang algoritma yang lebih canggih. Ini tentang pertanyaan yang jarang ditanyakan di kursus ML: setelah model selesai di notebook, bagaimana ia sampai ke tangan pengguna — dan tetap waras di sana?",
        "Tujuan lesson ini:",
        "• Menjelaskan kenapa mayoritas model ML tidak pernah menyentuh produksi — dan apa penyebab utamanya.",
        "• Membedakan lingkungan notebook vs produksi dalam 5 dimensi konkret.",
        "• Memetakan peran Machine Learning Engineer terhadap Data Scientist, Data Engineer, dan MLOps.",
        "• Menghitung funnel eksperimen→produksi dan latency budget dari angka nyata.",
        "• Memutuskan kapan memakai ML, kapan cukup rule-based, dan kapan tidak pakai ML sama sekali.",
        "Isi lesson: cerita pembuka (model 99,2% yang tidak pernah dipakai) → 5 perbedaan notebook vs produksi → peta peran → 2 lab (funnel + latency budget) → peta keputusan → mini-case bank → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model 99,2% yang tidak pernah dipakai siapa pun",
      "prose": [
        "Maret 2025. Tim data sebuah bank digital merayakan: model deteksi fraud mereka mencapai akurasi 99,2% di notebook. Confusion matrix-nya rapi, ROC curve-nya mulus. Presentasi ke direksi sukses besar.",
        "November 2025 — delapan bulan kemudian. Model itu belum dipakai oleh siapa pun. Bukan karena akurasinya turun. Bukan karena ada model yang lebih bagus. Melainkan karena tidak ada yang tahu cara menjalankannya di luar laptop analis yang membuatnya.",
        "Twist-nya: pipeline datanya manual. Setiap pagi seseorang mengunduh CSV dari tiga sistem berbeda, menggabungkannya di Excel, lalu menjalankan notebook cell per cell. Minggu lalu nama satu kolom berubah dari `trx_amount` menjadi `transaction_amount` dan seluruh pipeline diam-diam menghasilkan angka sampah selama 6 hari — tanpa ada yang sadar.",
        "Ini bukan cerita fiksi. Survei industri konsisten menemukan angka yang menyakitkan: sekitar 87% model ML tidak pernah mencapai produksi. Dan dari yang mencapai produksi, sebagian besar gagal bukan karena matematikanya — melainkan karena infrastrukturnya.",
        "Machine Learning Engineer adalah orang yang menutup jurang itu. Bukan ilmuwan yang mencari akurasi tertinggi, melainkan insinyur yang memastikan model terbaik pun bisa berjalan andal, cepat, murah, dan terpantau — setiap hari, tanpa intervensi manual.",
      ],
      "figure": {
        "svg": funnel_svg([("Eksperimen", 120), ("Validasi offline", 41), ("Shadow test", 15), ("Produksi", 6)], title="Funnel eksperimen → produksi (tipikal)"),
        "alt": "Funnel: 120 eksperimen, 41 lolos validasi offline, 15 masuk shadow test, 6 mencapai produksi.",
        "caption": "Dari 120 eksperimen, hanya 6 (5%) yang mencapai produksi. Penyusutan terbesar terjadi di validasi offline — di situlah model-model 'bagus di notebook' gugur karena tidak reproducible atau tidak bisa di-serve.",
      },
      "note": {
        "title": "🚨 Mitos: model terbaik = model dengan akurasi tertinggi",
        "type": "pitfall",
        "body": "Yang benar: model terbaik untuk produksi = model yang memenuhi SEMUA kontrak — akurasi cukup, latency di bawah SLO, biaya masuk akal, bisa di-monitor, dan bisa di-rollback. Model dengan akurasi 94% yang stabil di produksi mengalahkan model 97% yang tidak bisa di-deploy.",
      },
      "tasks": [],
    },
    {
      "id": "notebook-vs-prod", "eyebrow": "Langkah 3 · Notebook vs produksi",
      "title": "Lima perbedaan yang menentukan hidup-matinya model",
      "prose": [
        "Notebook dan produksi terlihat menjalankan 'kode yang sama', tetapi kontraknya berbeda total. Berikut lima dimensinya:",
        "1. Data: di notebook, data adalah file statis yang sudah dibersihkan. Di produksi, data adalah aliran hidup — terlambat, hilang, berubah skema tanpa pemberitahuan.",
        "2. Eksekusi: notebook dijalankan manusia cell per cell, boleh gagal di tengah. Produksi berjalan otomatis 24/7; kegagalan di tengah malam harus pulih sendiri atau membangunkan orang yang tepat.",
        "3. Dependensi: notebook memakai 'library yang terinstall di laptop saya'. Produksi butuh environment yang terkunci versinya dan bisa dibangun ulang dari nol.",
        "4. Skala: notebook memproses ribuan baris sekali jalan. Produksi melayani jutaan request per hari dengan latency budget dalam milidetik.",
        "5. Akuntabilitas: notebook cukup 'akurasi 95%'. Produksi menuntut: berapa biayanya per prediksi? Bagaimana tahu kalau performanya turun? Bagaimana cara mematikannya dengan aman?",
        "Setiap perbedaan ini adalah tempat model-model mati. Lab berikut mengukur seberapa kejam funnel-nya dengan angka.",
      ],
      "formula": "\\text{retensi} = \\frac{N_{\\text{produksi}}}{N_{\\text{eksperimen}}} \\times 100\\%",
      "tasks": [
        {"id": "t1", "text": "Hitung `retensi` eksperimen → produksi dalam persen"},
        {"id": "t2", "text": "Temukan `bottleneck`: transisi dengan penurunan relatif terbesar"},
        {"id": "t3", "text": "Cetak retensi, bottleneck, dan persentase penurunannya"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: ukur funnel-mu sendiri",
        "body": "Tim yang sehat mencatat setiap eksperimen dan alasannya gugur. Kalau 80% gugur di validasi offline karena 'tidak reproducible', masalahmu bukan modeling — melainkan disiplin eksperimen (topik MLE3).",
      },
      "hints": [
        "Retensi = stage terakhir / stage pertama × 100.",
        "Penurunan relatif satu transisi = (sebelum - sesudah) / sebelum × 100.",
        "Gunakan zip(stages, stages[1:]) untuk memasangkan stage berurutan.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "stages = [(\"eksperimen\", 120), (\"validasi_offline\", 41),\n"
          "          (\"shadow_test\", 15), (\"produksi\", 6)]\n"
          "\n"
          "# TULIS KODEMU: retensi end-to-end (persen)\n"
          "retensi = \n"
          "\n"
          "# TULIS KODEMU: cari transisi dengan penurunan relatif terbesar\n"
          "bottleneck = \"\"\n"
          "drop = 0.0\n"
          "\n"
          "print(f\"retensi={retensi:.1f}%  bottleneck={bottleneck}  drop={drop:.1f}%\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "stages = [(\"eksperimen\", 120), (\"validasi_offline\", 41),\n"
          "          (\"shadow_test\", 15), (\"produksi\", 6)]\n"
          "\n"
          "# TULIS KODEMU: retensi end-to-end (persen)\n"
          "retensi = stages[-1][1] / stages[0][1] * 100\n"
          "\n"
          "# TULIS KODEMU: cari transisi dengan penurunan relatif terbesar\n"
          "bottleneck = \"\"\n"
          "drop = 0.0\n"
          "for (nama1, c1), (nama2, c2) in zip(stages, stages[1:]):\n"
          "    d = (c1 - c2) / c1 * 100\n"
          "    if d > drop:\n"
          "        bottleneck, drop = f\"{nama1}->{nama2}\", d\n"
          "\n"
          "print(f\"retensi={retensi:.1f}%  bottleneck={bottleneck}  drop={drop:.1f}%\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "retensi", "value": 5.0, "tol": 1e-9, "label": "`retensi` = 5.0%", "msg": "6/120 × 100 = 5.0. Stage terakhir dibagi stage pertama."},
          {"kind": "equal", "task": "t2", "name": "drop", "value": 65.83, "tol": 0.05, "label": "`drop` ≈ 65.8%", "msg": "(120-41)/120 × 100 = 65.8%. Bandingkan ketiga transisi."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "retensi=5\\.0%", "label": "`print` menampilkan retensi", "msg": "Format: retensi=...%  bottleneck=...  drop=...%."},
        ],
      },
      "reference": "zip(a, a[1:]) memasangkan elemen berurutan. f-string {x:.1f} = 1 desimal.",
    },
    {
      "id": "peta-peran", "eyebrow": "Langkah 4 · Peta peran",
      "title": "MLE, Data Scientist, Data Engineer: siapa mengerjakan apa",
      "prose": [
        "Kebingungan peran adalah sumber konflik klasik. Data Scientist (DS) menjawab 'model apa yang memprediksi paling baik?'. Data Engineer (DE) menjawab 'bagaimana data mengalir andal dari sumber ke tujuan?'. Machine Learning Engineer duduk di persimpangannya: 'bagaimana model terbaik berjalan andal di produksi?'",
        "Praktisnya: DS memiliki eksperimen dan metrik offline. DE memiliki pipeline data dan warehouse. MLE memiliki training pipeline yang reproducible, serving infrastructure, monitoring, dan rollback plan. Di tim kecil, satu orang bisa merangkap ketiganya — tetapi tanggung jawabnya tetap tiga hal yang berbeda.",
        "MLOps bukan peran, melainkan praktik: gabungan budaya + tooling agar perubahan model bisa dikirim ke produksi dengan aman dan cepat — mirip DevOps untuk software, ditambah keunikan ML (data dan model ikut berversion).",
        "Twist karir: di banyak perusahaan Indonesia, lowongan 'Data Scientist' sebenarnya mencari MLE — deskripsinya menyebut deploy, API, dan monitoring. Membaca deskripsi pekerjaan dengan lensa lesson ini menghemat banyak kekecewaan.",
      ],
      "note": {
        "title": "🚨 Mitos: 'kalau jalan di notebook, deploy tinggal copy-paste'",
        "type": "pitfall",
        "body": "Yang benar: notebook menyembunyikan state (urutan run cell), dependensi tak terkunci, dan data yang sudah dibersihkan manual. Copy-paste ke server hampir pasti gagal — atau lebih buruk: jalan tetapi menghasilkan prediksi salah (train-serve skew, dibahas di MLE2).",
      },
      "tasks": [],
    },
    {
      "id": "latency-budget", "eyebrow": "Langkah 5 · Latency budget",
      "title": "SLO 250ms: ke mana perginya waktu?",
      "prose": [
        "Kontrak produksi paling konkret adalah latency budget. Misal aplikasi kredit menjanjikan keputusan dalam 250ms (SLO). Budget itu harus dibagi ke semua komponen: preprocessing, inference, postprocessing, jaringan.",
        "Aturan main: jumlahkan semua komponen. Sisanya adalah headroom — ruang napas untuk lonjakan. Headroom 0% berarti sistem pas-pasan: satu lonjakan kecil dan SLO jebol.",
        "Cara membaca: total 200ms dari budget 250ms → sisa 50ms → headroom 20%. Interpretasi: masih ada ruang, tetapi model yang 2x lebih lambat tidak akan muat tanpa optimasi.",
        "Di lab ini kamu menghitungnya sendiri. Coba ubah: bagaimana jika inference naik menjadi 180ms? Headroom tinggal berapa?",
      ],
      "formula": "\\text{headroom} = \\frac{\\text{SLO} - \\sum \\text{komponen}}{\\text{SLO}} \\times 100\\%",
      "tasks": [
        {"id": "t1", "text": "Hitung `total` latensi semua komponen"},
        {"id": "t2", "text": "Hitung `sisa` dan `headroom` (persen) dari SLO"},
        {"id": "t3", "text": "Cetak total, sisa, dan headroom"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: latency adalah fitur",
        "body": "Pengguna merasakan 300ms vs 80ms — bukan akurasi 94% vs 95%. Dalam banyak produk, memangkas latency 200ms menaikkan konversi lebih banyak daripada menaikkan akurasi 1 poin.",
      },
      "hints": [
        "total = jumlah semua value di dict komponen.",
        "sisa = SLO_MS - total; headroom = sisa / SLO_MS × 100.",
        "sum(komponen.values()) menjumlahkan dict.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "SLO_MS = 250\n"
          "komponen = {\"preprocessing\": 25, \"inference\": 120, \"postprocessing\": 15, \"jaringan\": 40}\n"
          "\n"
          "# TULIS KODEMU\n"
          "total = \n"
          "sisa = \n"
          "headroom = \n"
          "\n"
          "print(f\"total={total}ms  sisa={sisa}ms  headroom={headroom:.1f}%\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "SLO_MS = 250\n"
          "komponen = {\"preprocessing\": 25, \"inference\": 120, \"postprocessing\": 15, \"jaringan\": 40}\n"
          "\n"
          "# TULIS KODEMU\n"
          "total = sum(komponen.values())\n"
          "sisa = SLO_MS - total\n"
          "headroom = sisa / SLO_MS * 100\n"
          "\n"
          "print(f\"total={total}ms  sisa={sisa}ms  headroom={headroom:.1f}%\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "total", "value": 200, "tol": 1e-9, "label": "`total` = 200ms", "msg": "25+120+15+40 = 200."},
          {"kind": "equal", "task": "t2", "name": "sisa", "value": 50, "tol": 1e-9, "label": "`sisa` = 50ms", "msg": "250 - 200 = 50."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "headroom=20\\.0%", "label": "`print` menampilkan headroom", "msg": "50/250 × 100 = 20.0%."},
        ],
      },
      "reference": "sum(dict.values()). f-string {x:.1f} untuk 1 desimal.",
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Kapan pakai ML — dan kapan JANGAN",
      "prose": [
        "Skenario 1 — Prediksi fraud kartu kredit real-time, pola berubah tiap minggu → pakai ML online serving. Alasan: pola terlalu kompleks untuk aturan manual dan berubah cepat; volume tinggi membenarkan biaya infra.",
        "Skenario 2 — Laporan agregat transaksi harian untuk direksi → JANGAN pakai ML serving; pakai batch job SQL. Alasan: tidak ada prediksi yang dibutuhkan, hanya agregasi deterministik. ML menambah biaya tanpa manfaat.",
        "Skenario 3 — Validasi format KTP di form pendaftaran → pakai rule-based (regex + checksum). Alasan: aturannya eksak dan stabil; ML hanya menambah ketidakpastian pada masalah yang sudah solved.",
        "Skenario 4 — Rekomendasi produk dengan data 200 pengguna → JANGAN pakai deep learning; mulai dari popularity baseline atau model sederhana. Alasan: data terlalu sedikit; model kompleks akan overfit dan mahal.",
        "Aturan praktis 10 detik: (1) Apakah polanya terlalu kompleks untuk aturan manual? (2) Apakah datanya cukup dan mengalir? (3) Apakah nilai bisnisnya menutup biaya serving + monitoring? Tiga 'ya' → ML layak dipertimbangkan. Satu 'tidak' → cari jalan yang lebih sederhana dulu.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Bank Arus: model 94% yang mengantre 3 minggu",
      "prose": [
        "Bank Arus punya model credit scoring dengan akurasi 94% — terbaik yang pernah mereka buat. Masalah: setiap retraining butuh 3 minggu kerja manual (tarik data, bersihkan, training, validasi, deploy). Akibatnya model hanya di-retrain 2x setahun.",
        "Datanya: portofolio Rp800 miliar, NPL naik dari 2,1% ke 3,4% dalam 6 bulan terakhir. Analisis menunjukkan 60% dari kenaikan NPL berasal dari segmen yang perilakunya bergeser 4 bulan lalu — model yang dipakai masih 'percaya' pada pola lama.",
        "Pertanyaan: (a) Berapa estimasi kerugian dari keterlambatan deteksi? (b) Apa intervensi MLE yang paling berdampak — menaikkan akurasi ke 95% atau memangkas siklus retrain ke 2 hari?",
        "Pembahasan: (a) Kenaikan NPL 1,3 poin dari Rp800 miliar ≈ Rp10,4 miliar eksposur bermasalah tambahan; 60%-nya ≈ Rp6,2 miliar terkait pola yang sudah bergeser 4 bulan. (b) Memangkas siklus retrain jauh lebih berdampak: model 94% yang segar mengalahkan model 95% yang basi 6 bulan. Inilah inti MLE — kecepatan dan keandalan siklus mengalahkan akurasi marginal.",
      ],
      "note": {
        "title": "Kaitan ke risk",
        "type": "risk",
        "body": "Dalam risiko kredit, model basi adalah risiko model (model risk) yang nyata: keputusan kredit diambil berdasarkan dunia yang sudah tidak ada. Regulator (OJK/Basel) mensyaratkan validasi dan monitoring berkala justru karena alasan ini.",
      },
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah. Setiap opsi menjelaskan alasannya."],
      "tasks": [],
      "summary": [
        "87% model tidak pernah produksi — penyebab utamanya infrastruktur dan proses, bukan matematika.",
        "Notebook vs produksi berbeda dalam 5 dimensi: data, eksekusi, dependensi, skala, akuntabilitas.",
        "MLE = memastikan model berjalan andal di produksi; DS = mencari model terbaik; DE = aliran data.",
        "Funnel tipikal: ~5% eksperimen mencapai produksi; bottleneck terbesar di validasi offline.",
        "Latency budget: jumlahkan komponen, sisakan headroom; 0% headroom = SLO pasti jebol.",
        "Tidak semua masalah butuh ML: cek kompleksitas pola, ketersediaan data, dan nilai bisnis dulu.",
      ],
      "next": {"label": "MLE2 — Data Pipeline & Feature Engineering", "href": "/v2/learn/mle2-data-pipeline"},
      "quiz": [
        {
          "q": "Akar masalah paling umum kenapa model bagus tidak pernah produksi?",
          "options": [
            {"text": "Akurasi model kurang tinggi", "why": "Akurasi 99% pun tidak menolong kalau tidak ada cara menjalankannya di produksi."},
            {"text": "Tidak ada pipeline produksi yang andal", "why": "Data manual, environment tak terkunci, dan tanpa monitoring adalah pembunuh nomor satu model.", "correct": True},
            {"text": "Kurang data training", "why": "Itu masalah modeling, bukan masalah deploy — modelnya sudah jadi dan bagus."},
            {"text": "Komputasi terlalu mahal", "why": "Biaya komputasi jarang menjadi penghalang utama dibanding tidak adanya jalur deploy."},
          ],
        },
        {
          "q": "Perbedaan notebook vs produksi yang PALING berbahaya jika diabaikan?",
          "options": [
            {"text": "Ukuran font di notebook", "why": "Tidak relevan dengan kebenaran prediksi."},
            {"text": "Data produksi berubah dan bisa corrupt", "why": "Skema berubah diam-diam menghasilkan prediksi sampah tanpa error — kegagalan sunyi yang paling mahal.", "correct": True},
            {"text": "Notebook tidak bisa dibuka di HP", "why": "Kenyamanan, bukan kebenaran sistem."},
            {"text": "Warna chart berbeda", "why": "Kosmetik, tidak memengaruhi model."},
          ],
        },
        {
          "q": "Tanggung jawab utama seorang MLE adalah…",
          "options": [
            {"text": "Mencari arsitektur model terbaru", "why": "Itu wilayah riset/data scientist."},
            {"text": "Menulis query SQL untuk dashboard", "why": "Itu wilayah data engineer/analyst."},
            {"text": "Memastikan model berjalan andal, terpantau, dan bisa di-rollback di produksi", "why": "Tepat: training reproducible, serving, monitoring, dan rollback adalah inti peran MLE.", "correct": True},
            {"text": "Mendesain logo produk", "why": "Bukan wilayah MLE."},
          ],
        },
        {
          "q": "SLO 250ms, total komponen 200ms. Headroom dan artinya?",
          "options": [
            {"text": "50ms / 20% — masih ada ruang, tapi model 2x lebih lambat tidak muat", "why": "50/250 = 20%. Cukup untuk fluktuasi, tidak cukup untuk model yang jauh lebih berat.", "correct": True},
            {"text": "50ms / 80% — sangat longgar", "why": "50/250 = 20%, bukan 80%. Hitung lagi pembaginya."},
            {"text": "0ms — sudah pas", "why": "Sisa = 250 − 200 = 50ms, bukan 0."},
            {"text": "450ms — dijumlahkan", "why": "SLO bukan dijumlah dengan komponen; sisa = SLO − total."},
          ],
        },
        {
          "q": "Validasi format KTP di form pendaftaran sebaiknya memakai…",
          "options": [
            {"text": "Deep learning terbaru", "why": "Berlebihan: aturannya eksak, ML hanya menambah ketidakpastian dan biaya."},
            {"text": "Rule-based (regex + checksum)", "why": "Tepat: masalah deterministik dengan aturan stabil tidak butuh ML.", "correct": True},
            {"text": "LLM via API", "why": "Mahal, lambat, dan tidak deterministik untuk validasi format."},
            {"text": "Clustering", "why": "Clustering untuk segmentasi, bukan validasi format eksak."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE2 ====================
mle2 = {
  "slug": "mle2-data-pipeline", "track": "Machine Learning Engineer",
  "module": "Fondasi Produksi", "title": "MLE2 — Data Pipeline & Feature Engineering", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Model hanya sebaik data yang mengalir ke dalamnya — dan di produksi, data mengalir terus, berubah, dan kadang berbohong. Lesson ini tentang membangun pipa data yang jujur.",
        "Tujuan lesson ini:",
        "• Menjelaskan data leakage dalam 3 bentuk dan cara mendeteksinya sebelum merugikan.",
        "• Membangun pipeline yang reproducible: idempotent, berversion, dan teruji.",
        "• Mengukur train-serve skew dengan angka, bukan firasat.",
        "• Menerapkan prinsip point-in-time correctness pada feature engineering.",
        "• Memutuskan kapan membangun feature store vs pipeline sederhana.",
        "Isi lesson: cerita model '95% akurat' yang bocor → 3 jenis leakage + lab detektor → pipeline reproducible & train-serve skew + lab → feature engineering point-in-time → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model 95% akurat yang ternyata mencontek",
      "prose": [
        "Tim churn sebuah e-commerce melompat kegirangan: model prediksi churn mereka mencapai akurasi 95% di validasi. Fitur terpentingnya, menurut feature importance, adalah `hari_sejak_login_terakhir` — masuk akal, pelanggan yang lama tidak login memang cenderung churn.",
        "Minggu pertama di produksi, akurasinya 51%. Hampir setara lempar koin. Investigasi menemukan twist yang memalukan: fitur itu dihitung dari snapshot database yang diambil SETELAH periode churn diketahui. Untuk pelanggan yang sudah churn, 'login terakhir' tercatat jauh di masa lalu — informasinya berasal dari masa depan.",
        "Inilah data leakage: fitur yang mengandung informasi label yang seharusnya belum tersedia saat prediksi dibuat. Model tidak belajar pola pelanggan — ia belajar membaca kunci jawaban.",
        "Yang menyakitkan: leakage tidak menimbulkan error. Kode jalan mulus, metrik terlihat fantastis. Satu-satunya gejala adalah kejatuhan brutal saat bertemu dunia nyata.",
      ],
      "note": {
        "title": "🚨 Mitos: 'kalau metrik validasinya bagus, modelnya bagus'",
        "type": "pitfall",
        "body": "Yang benar: metrik validasi hanya sejujur pemisahan data dan fiturmu. Leakage membuat validasi terlihat sempurna sambil menyembunyikan bahwa model tidak belajar apa-apa. Selalu curigai akurasi yang 'terlalu bagus untuk jadi kenyataan'.",
      },
      "tasks": [],
    },
    {
      "id": "leakage", "eyebrow": "Langkah 3 · Tiga wajah leakage",
      "title": "Target leakage, kontaminasi, dan kebocoran waktu",
      "prose": [
        "Leakage punya tiga wajah. Pertama, target leakage: fitur yang merupakan fungsi dari label atau dihitung setelah label diketahui — seperti cerita di atas. Cirinya: korelasi fitur-label mendekati sempurna (|r| > 0.9 patut dicurigai).",
        "Kedua, kontaminasi train-test: data test bocor ke training. Penyebab klasik: split acak pada data berurutan waktu (pelanggan yang sama muncul di train dan test), atau imputasi/scaling yang di-fit di seluruh data sebelum split.",
        "Ketiga, kebocoran waktu (temporal leakage): fitur memakai informasi yang belum ada pada saat prediksi. Contoh: memprediksi default kredit bulan Juni memakai 'total tunggakan hingga Desember'. Solusinya adalah point-in-time correctness: setiap fitur harus bisa direkonstruksi persis seperti keadaannya pada timestamp prediksi.",
        "Aturan praktis: untuk setiap fitur, tanyakan 'kapan informasi ini tersedia?' Jika jawabannya 'setelah kita tahu hasilnya', buang fitur itu.",
      ],
      "formula": "\\text{curigai leakage jika } |r_{x,y}| > 0{,}9",
      "figure": {
        "svg": bars_svg([("x1 legit", 0.31), ("x2 bocor", 0.99)], title="Korelasi fitur vs label (contoh)", colors=[C2, C4]),
        "alt": "Bar chart: fitur x1 berkorelasi 0.31 dengan label, fitur x2 berkorelasi 0.99.",
        "caption": "Cara membaca: tinggi batang = korelasi Pearson fitur terhadap label. Interpretasi: x1 (0,31) wajar untuk fitur prediktif; x2 (0,99) nyaris sempurna — terlalu bagus untuk jadi kenyataan, indikasi kuat leakage.",
      },
      "tasks": [
        {"id": "t1", "text": "Hitung korelasi Pearson `c1` (fitur legit) dan `c2` (fitur curiga) terhadap label"},
        {"id": "t2", "text": "Terapkan aturan: |korelasi| > 0.9 → `verdict` = fitur yang bocor"},
        {"id": "t3", "text": "Cetak kedua korelasi dan verdict"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: leakage detector termurah",
        "body": "Sebelum training apa pun, hitung korelasi tiap fitur terhadap label. Fitur dengan |r| > 0.9 hampir selalu bocor atau duplikat label — investigasi 10 menit ini menyelamatkan 10 minggu kerja sia-sia.",
      },
      "hints": [
        "Pearson r = Σ((x-x̄)(y-ȳ)) / √(Σ(x-x̄)² · Σ(y-ȳ)²).",
        "Fungsi pearson(xs, ys) sudah disediakan dan terkunci.",
        "verdict = 'x2 BOCOR' jika abs(c2) > 0.9, else 'aman'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random, math\n"
          "random.seed(7)\n"
          "n = 1000\n"
          "churn = [1 if random.random() < 0.2 else 0 for _ in range(n)]\n"
          "x1 = [c + random.gauss(0, 2) for c in churn]      # fitur legit\n"
          "x2 = [c * 10 + random.gauss(0, 0.5) for c in churn]  # fitur CURIGA\n"
          "def pearson(xs, ys):\n"
          "    m = len(xs); mx = sum(xs)/m; my = sum(ys)/m\n"
          "    num = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n"
          "    den = math.sqrt(sum((x-mx)**2 for x in xs) * sum((y-my)**2 for y in ys))\n"
          "    return num/den\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "c1 = \n"
          "c2 = \n"
          "verdict = \n"
          "\n"
          "print(f\"corr_x1={c1:.2f}  corr_x2={c2:.2f}  verdict={verdict}\")"
        ),
        "lockLines": 12,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random, math\n"
          "random.seed(7)\n"
          "n = 1000\n"
          "churn = [1 if random.random() < 0.2 else 0 for _ in range(n)]\n"
          "x1 = [c + random.gauss(0, 2) for c in churn]      # fitur legit\n"
          "x2 = [c * 10 + random.gauss(0, 0.5) for c in churn]  # fitur CURIGA\n"
          "def pearson(xs, ys):\n"
          "    m = len(xs); mx = sum(xs)/m; my = sum(ys)/m\n"
          "    num = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n"
          "    den = math.sqrt(sum((x-mx)**2 for x in xs) * sum((y-my)**2 for y in ys))\n"
          "    return num/den\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "c1 = pearson(x1, churn)\n"
          "c2 = pearson(x2, churn)\n"
          "verdict = \"x2 BOCOR\" if abs(c2) > 0.9 else \"aman\"\n"
          "\n"
          "print(f\"corr_x1={c1:.2f}  corr_x2={c2:.2f}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "c2", "value": 0.99, "tol": 0.02, "label": "`c2` ≈ 0.99 (bocor)", "msg": "x2 nyaris fungsi linear dari label — korelasinya mendekati 1."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=x2 BOCOR", "label": "`print` memvonis x2", "msg": "|c2| > 0.9 → verdict 'x2 BOCOR'."},
        ],
      },
      "reference": "Korelasi Pearson mengukur hubungan linear. |r|>0.9 pada fitur = lampu merah.",
    },
    {
      "id": "pipeline-repro", "eyebrow": "Langkah 4 · Pipeline reproducible",
      "title": "Idempotent, berversion, teruji — dan train-serve skew",
      "prose": [
        "Pipeline yang reproducible punya tiga sifat. Idempotent: dijalankan 1x atau 5x hasilnya sama (tidak ada append ganda, tidak ada state nyasar). Berversion: input, kode, dan parameter tercatat sehingga run mana pun bisa diulang. Teruji: ada test otomatis yang gagal berisik saat data berubah.",
        "Musuh terbesarnya adalah train-serve skew: fitur di training dihitung dengan kode A, di serving dengan kode B — hasilnya 'mirip tapi tidak sama'. Contoh klasik: training memakai SQL dengan timezone UTC, serving memakai kode Python dengan timezone lokal. Model menerima angka yang tidak pernah ia lihat saat training.",
        "Cara mengukurnya sederhana: bandingkan statistik fitur training vs serving. Skew ternormalisasi = |μ_serve − μ_train| / σ_train. Di atas 1.0 berarti rata-rata serving bergeser lebih dari satu standar deviasi — investigasi wajib.",
        "Solusi struktural: satu kode feature engineering dipakai di training DAN serving (shared library), atau feature store yang menyajikan fitur point-in-time yang sama untuk keduanya.",
      ],
      "formula": "\\text{skew} = \\frac{|\\mu_{serve} - \\mu_{train}|}{\\sigma_{train}}",
      "tasks": [
        {"id": "t1", "text": "Hitung `serve_mean` dari 10 batch serving"},
        {"id": "t2", "text": "Hitung `skew` ternormalisasi dan tentukan `verdict` (ambang 1.0)"},
        {"id": "t3", "text": "Cetak skew dan verdict"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'pipeline-ku deterministik karena kodenya sama'",
        "type": "pitfall",
        "body": "Yang benar: kode sama ≠ hasil sama. Timezone, urutan baris, versi library, dan pembulatan floating point bisa mengubah fitur diam-diam. Deterministik harus DIBUKTIKAN dengan test, bukan diasumsikan.",
      },
      "hints": [
        "serve_mean = sum(serve) / len(serve).",
        "skew = abs(serve_mean - train_mean) / train_std.",
        "verdict = 'SKEW' jika skew > 1.0, else 'OK'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "train_mean, train_std = 35.0, 5.0\n"
          "serve = [42.1, 41.5, 43.0, 40.8, 42.6, 41.9, 42.3, 41.2, 42.8, 41.7]\n"
          "\n"
          "# TULIS KODEMU\n"
          "serve_mean = \n"
          "skew = \n"
          "verdict = \n"
          "\n"
          "print(f\"skew={skew:.2f}  verdict={verdict}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "train_mean, train_std = 35.0, 5.0\n"
          "serve = [42.1, 41.5, 43.0, 40.8, 42.6, 41.9, 42.3, 41.2, 42.8, 41.7]\n"
          "\n"
          "# TULIS KODEMU\n"
          "serve_mean = sum(serve) / len(serve)\n"
          "skew = abs(serve_mean - train_mean) / train_std\n"
          "verdict = \"SKEW\" if skew > 1.0 else \"OK\"\n"
          "\n"
          "print(f\"skew={skew:.2f}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "skew", "value": 1.4, "tol": 0.02, "label": "`skew` ≈ 1.40", "msg": "|41.99 − 35| / 5 = 1.40. Rata-rata serving bergeser 1.4 SD."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=SKEW", "label": "`print` memvonis SKEW", "msg": "skew > 1.0 → verdict 'SKEW'."},
        ],
      },
      "reference": "abs() untuk nilai mutlak. Ambang 1.0 SD adalah aturan praktis, bukan hukum alam.",
    },
    {
      "id": "feature-eng", "eyebrow": "Langkah 5 · Feature engineering",
      "title": "Point-in-time correctness: fitur yang jujur terhadap waktu",
      "prose": [
        "Feature engineering untuk produksi punya satu aturan emas: nilai fitur pada timestamp T harus sama persis dengan nilai yang tersedia pada saat T — tidak boleh memakai data yang baru muncul setelah T.",
        "Contoh konkret: fitur 'rata-rata transaksi 30 hari' untuk prediksi tanggal 10 Juni harus dihitung dari 11 Mei–10 Juni, BUKAN dari data hingga hari ini. Kesalahan umum: join dengan tabel agregat 'terkini' yang sudah mencakup masa depan.",
        "Praktiknya: setiap baris training membawa `timestamp_prediksi`, dan semua agregasi di-filter `event_time <= timestamp_prediksi`. Feature store modern (Feast, Tecton) mengotomatiskan ini dengan 'point-in-time join'.",
        "Biaya mengabaikannya: model yang terlihat hebat di backtest tetapi buta di produksi — varian temporal dari leakage di Langkah 3.",
      ],
      "note": {
        "title": "💡 Intuisi: backtest yang jujur itu mahal, backtest yang murah itu bohong",
        "body": "Kalau backtest-mu tidak mensimulasikan ketersediaan data per timestamp, angkanya adalah fiksi optimistis. Alokasikan waktu membangun backtest point-in-time — ia adalah asuransi termurah dalam ML.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Membangun pipeline: seberapa serius infrastrukturnya?",
      "prose": [
        "Skenario 1 — Startup 5 orang, 1 model, retrain bulanan → pipeline sederhana: script terjadwal + test dasar + versioning manual yang disiplin. Alasan: biaya feature store tidak sebanding; yang penting reproducible dan terpantau.",
        "Skenario 2 — Bank dengan 40 model kredit, retrain mingguan, diaudit regulator → feature store + training pipeline terorkestrasi + model registry. Alasan: skala dan compliance menuntut lineage penuh; satu definisi fitur dipakai train dan serve.",
        "Skenario 3 — Fitur real-time (mis. 'transaksi 1 jam terakhir') untuk fraud → streaming pipeline (Kafka/Flink) + online feature store. Alasan: batch harian terlalu lambat; fitur harus tersedia dalam detik dengan point-in-time yang benar.",
        "Skenario 4 — Eksperimen riset, belum tahu apakah model akan dipakai → notebook rapi + seed + config file. Alasan: jangan bangun infrastruktur untuk model yang mungkin mati minggu depan; tetapi siapkan fondasi reproducibility sejak hari pertama.",
        "Aturan praktis 10 detik: (1) Berapa model dan seberapa sering retrain? (2) Apakah ada fitur real-time? (3) Apakah diaudit? Jawaban 'banyak/ya' → investasi infrastruktur; 'sedikit/tidak' → kesederhanaan yang disiplin.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "E-commerce Kilat: fitur yang berubah diam-diam",
      "prose": [
        "E-commerce Kilat punya model rekomendasi voucher. Tiga bulan lalu tim data mengubah definisi 'pelanggan aktif' dari 'transaksi 90 hari terakhir' menjadi 'transaksi 30 hari terakhir' — di kode training. Kode serving tidak diubah.",
        "Dampaknya: distribusi fitur `is_aktif` di serving bergeser — proporsi 'aktif' turun dari 62% ke 38%. Model yang dilatih dengan definisi baru menerima input berdefinisi lama. Konversi voucher turun 11% dalam sebulan sebelum ada yang sadar.",
        "Pertanyaan: (a) Ini jenis kegagalan apa? (b) Test otomatis apa yang akan menangkapnya dalam 1 hari? (c) Perubahan proses apa yang mencegah terulang?",
        "Pembahasan: (a) Train-serve skew akibat definisi fitur ganda. (b) Test distribusi fitur train vs serve harian (skew > 1.0 → alarm) atau contract test: proporsi tiap kategori fitur harus dalam rentang historis. (c) Single source of truth: satu definisi fitur di shared library/feature store yang dipakai training dan serving — perubahan definisi menjadi perubahan berversion yang terdeploy bersamaan.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Data leakage: fitur mengandung info label dari masa depan → metrik validasi fantastis, produksi hancur.",
        "Tiga wajah leakage: target leakage, kontaminasi train-test, kebocoran temporal.",
        "Detektor murah: |korelasi fitur-label| > 0.9 = investigasi wajib.",
        "Pipeline reproducible = idempotent + berversion + teruji.",
        "Train-serve skew diukur: |μ_serve − μ_train| / σ_train; > 1.0 = alarm.",
        "Point-in-time correctness: fitur di timestamp T hanya boleh memakai data ≤ T.",
      ],
      "next": {"label": "MLE3 — Training yang Reproducible", "href": "/v2/learn/mle3-training"},
      "quiz": [
        {
          "q": "Model akurasi validasi 95% tetapi 51% di produksi. Diagnosis paling mungkin?",
          "options": [
            {"text": "Overfitting biasa", "why": "Overfitting menurunkan beberapa poin, bukan dari 95% ke 51% (setara acak)."},
            {"text": "Data leakage pada fitur", "why": "Tepat: validasi fantastis + produksi setara acak adalah sidik jari klasik leakage.", "correct": True},
            {"text": "Learning rate terlalu besar", "why": "Itu masalah training, akan terlihat juga di validasi."},
            {"text": "Data terlalu sedikit", "why": "Akan terlihat di validasi, bukan hanya di produksi."},
          ],
        },
        {
          "q": "Fitur 'total denda hingga akhir tahun' untuk prediksi default bulan Juni adalah…",
          "options": [
            {"text": "Fitur yang bagus karena informatif", "why": "Informatif justru karena bocor — ia memakai masa depan."},
            {"text": "Temporal leakage", "why": "Tepat: memakai informasi yang belum ada saat prediksi dibuat.", "correct": True},
            {"text": "Train-serve skew", "why": "Skew adalah beda definisi train vs serve, bukan masalah waktu ketersediaan."},
            {"text": "Data drift", "why": "Drift adalah perubahan distribusi seiring waktu, bukan kebocoran masa depan."},
          ],
        },
        {
          "q": "Imputasi missing value memakai mean dari SELURUH data sebelum train-test split menyebabkan…",
          "options": [
            {"text": "Kontaminasi train-test", "why": "Tepat: statistik test bocor ke training lewat mean global.", "correct": True},
            {"text": "Target leakage", "why": "Target leakage soal fitur dari label, bukan soal split."},
            {"text": "Tidak masalah", "why": "Mean global membawa informasi test ke train — validasi jadi optimistis."},
            {"text": "Underfitting", "why": "Tidak berhubungan dengan kapasitas model."},
          ],
        },
        {
          "q": "skew = 1.4 untuk fitur usia. Artinya?",
          "options": [
            {"text": "Rata-rata serving bergeser 1.4 SD dari training — investigasi wajib", "why": "Tepat: di atas ambang 1.0, distribusi serving berbeda bermakna dari training.", "correct": True},
            {"text": "Model pasti rusak", "why": "Skew adalah sinyal investigasi, bukan vonis — bisa jadi pergeseran legitimate."},
            {"text": "Tidak ada masalah", "why": "1.4 > 1.0 melewati ambang alarm."},
            {"text": "Harus retrain sekarang juga", "why": "Investigasi dulu penyebabnya; retrain buta bisa mengulang kesalahan."},
          ],
        },
        {
          "q": "Tim kecil dengan 1 model dan retrain bulanan sebaiknya…",
          "options": [
            {"text": "Membangun feature store enterprise", "why": "Overkill: biaya dan kompleksitas tidak sebanding untuk 1 model."},
            {"text": "Pipeline sederhana yang disiplin: terjadwal, teruji, berversion", "why": "Tepat: reproducibility dulu, skala infrastruktur mengikuti kebutuhan.", "correct": True},
            {"text": "Tetap manual via notebook", "why": "Manual = tidak reproducible = bom waktu seperti cerita MLE1."},
            {"text": "Tidak perlu versioning", "why": "Versioning adalah fondasi termurah untuk debugging masa depan."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE3 ====================
mle3 = {
  "slug": "mle3-training", "track": "Machine Learning Engineer",
  "module": "Fondasi Produksi", "title": "MLE3 — Training yang Reproducible", "estMinutes": 50,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "'Kode yang sama, data yang sama, hasil yang berbeda' adalah kalimat yang seharusnya tidak pernah terucap di tim ML profesional. Lesson ini membuatnya tidak terucap.",
        "Tujuan lesson ini:",
        "• Menjelaskan 4 sumber non-determinisme dalam training dan cara menguncinya.",
        "• Menerapkan seed management yang benar (bukan sekadar random.seed(42) di satu tempat).",
        "• Merancang config file dan experiment tracking yang membuat setiap run bisa diulang.",
        "• Menghitung config ID dari hash untuk versioning eksperimen.",
        "• Memutuskan tingkat reproducibility yang dibutuhkan per konteks (riset vs regulated).",
        "Isi lesson: cerita run ketiga yang misterius → seed & determinisme + lab → config & experiment tracking + lab → environment → peta keputusan → mini-case audit → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Run ketiga yang tidak bisa dijelaskan siapa pun",
      "prose": [
        "Rina, analis di sebuah multifinance, melatih model scoring dua kali dengan kode yang sama persis. Hasilnya identik: AUC 0,812. Ia melapor ke atasannya dengan percaya diri.",
        "Seminggu kemudian, diminta mendemokan ulang, ia menjalankan kode yang sama untuk ketiga kalinya. AUC: 0,797. Tidak ada yang diubah — tidak ada satu baris kode pun. Ruangan hening.",
        "Twist-nya: dua run pertama 'kebetulan' identik karena dijalankan dalam sesi yang sama tanpa restart — state random yang tersisa sama. Run ketiga dimulai dari kernel fresh dengan seed tak terinisialisasi. Modelnya tidak pernah reproducible; ia hanya terlihat reproducible.",
        "Yang lebih dalam: seed hanyalah satu dari empat sumber keacakan. Tiga lainnya — urutan shuffle data, versi library, dan nondeterminisme hardware (GPU) — tetap bisa menggeser hasil walau seed sudah dikunci. Reproducibility adalah sistem, bukan satu baris kode.",
      ],
      "note": {
        "title": "🚨 Mitos: 'cukup tambah random.seed(42) di awal'",
        "type": "pitfall",
        "body": "Yang benar: seed harus dikunci di SEMUA sumber keacakan (Python, NumPy, framework DL), shuffle data harus deterministik, dan versi environment tercatat. Satu sumber bocor = hasil tetap bergeser antar run.",
      },
      "tasks": [],
    },
    {
      "id": "seed", "eyebrow": "Langkah 3 · Seed dan determinisme",
      "title": "Mengunci keacakan: dari 0,028 menjadi 0,000",
      "prose": [
        "Empat sumber non-determinisme dalam training: (1) inisialisasi bobot acak, (2) urutan shuffle data tiap epoch, (3) operasi stokastik (dropout, augmentasi), (4) nondeterminisme hardware — operasi paralel GPU yang urutan penjumlahannya tidak dijamin.",
        "Strategi penguncian: seed terpusat (satu seed mengendalikan semua library), deterministic algorithms di framework (dengan catatan: sedikit lebih lambat), dan pencatatan environment (versi library + hardware).",
        "Lab berikut mensimulasikan training dengan gradient ber-noise. Tanpa seed terkunci, tiga run menghasilkan bobot akhir yang tersebar (rentang 0,028). Dengan seed yang sama, rentang = 0,000000 — identik bit-per-bit.",
        "Cara membaca chart: tinggi batang = rentang (max − min) bobot akhir dari 3 run. Interpretasi: batang kiri menunjukkan variansi yang harus dijelaskan ke regulator; batang kanan menunjukkan reproducibility yang bisa dipertanggungjawabkan.",
      ],
      "figure": {
        "svg": bars_svg([("tanpa seed", 0.028), ("seed=42", 0.0)], title="Rentang bobot akhir, 3 run (simulasi)", colors=[C4, C2]),
        "alt": "Bar chart: rentang bobot tanpa seed 0,028; dengan seed tetap 0.",
        "caption": "Tanpa seed terkunci, tiga run 'kode yang sama' menghasilkan bobot akhir yang berbeda (rentang 0,028). Dengan seed tetap, hasilnya identik. Inilah perbedaan antara 'kebetulan sama' dan 'terjamin sama'.",
      },
      "tasks": [
        {"id": "t1", "text": "Jalankan `train()` dengan 3 seed berbeda, hitung `rentang_bebas` (max − min)"},
        {"id": "t2", "text": "Jalankan `train(42)` tiga kali, hitung `rentang_kunci`"},
        {"id": "t3", "text": "Cetak kedua rentang dengan 6 desimal"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: seed adalah kontrak, bukan angka mistis",
        "body": "Angka 42 tidak istimewa — yang istimewa adalah seed TERCATAT bersama run-nya. Run tanpa seed tercatat = run yang tidak bisa dipertahankan di depan auditor.",
      },
      "hints": [
        "rentang = max(daftar) - min(daftar).",
        "List comprehension: [train(s) for s in (1, 2, 3)].",
        "f-string {x:.6f} menampilkan 6 desimal.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "def train(seed):\n"
          "    random.seed(seed)\n"
          "    w = random.gauss(0, 1)          # inisialisasi bobot acak\n"
          "    for _ in range(50):\n"
          "        grad = 2 * (w - 3.0) + random.gauss(0, 0.1)  # gradient ber-noise\n"
          "        w = w - 0.1 * grad\n"
          "    return w\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: 3 run dengan seed berbeda\n"
          "bebas = \n"
          "rentang_bebas = \n"
          "\n"
          "# TULIS KODEMU: 3 run dengan seed yang sama\n"
          "kunci = \n"
          "rentang_kunci = \n"
          "\n"
          "print(f\"rentang_bebas={rentang_bebas:.6f}  rentang_kunci={rentang_kunci:.6f}\")"
        ),
        "lockLines": 9,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "def train(seed):\n"
          "    random.seed(seed)\n"
          "    w = random.gauss(0, 1)          # inisialisasi bobot acak\n"
          "    for _ in range(50):\n"
          "        grad = 2 * (w - 3.0) + random.gauss(0, 0.1)  # gradient ber-noise\n"
          "        w = w - 0.1 * grad\n"
          "    return w\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: 3 run dengan seed berbeda\n"
          "bebas = [train(s) for s in (1, 2, 3)]\n"
          "rentang_bebas = max(bebas) - min(bebas)\n"
          "\n"
          "# TULIS KODEMU: 3 run dengan seed yang sama\n"
          "kunci = [train(42) for _ in range(3)]\n"
          "rentang_kunci = max(kunci) - min(kunci)\n"
          "\n"
          "print(f\"rentang_bebas={rentang_bebas:.6f}  rentang_kunci={rentang_kunci:.6f}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "rentang_bebas", "value": 0.028, "tol": 0.002, "label": "`rentang_bebas` ≈ 0.028", "msg": "max−min dari train(1), train(2), train(3). Seed berbeda → hasil berbeda."},
          {"kind": "equal", "task": "t2", "name": "rentang_kunci", "value": 0.0, "tol": 1e-12, "label": "`rentang_kunci` = 0", "msg": "Seed sama → hasil identik bit-per-bit, rentang nol."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "rentang_kunci=0\\.000000", "label": "`print` menampilkan kedua rentang", "msg": "Format 6 desimal: rentang_bebas=...  rentang_kunci=0.000000."},
        ],
      },
      "reference": "random.seed() mengunci semua angka acak sesudahnya. max()/min() untuk rentang.",
    },
    {
      "id": "config", "eyebrow": "Langkah 4 · Config dan experiment tracking",
      "title": "Setiap run punya KTP: config + ID unik",
      "prose": [
        "Hyperparameter yang tersebar di kode ('lr = 0.01' di baris 47, diubah jadi 0.02 minggu lalu, atau was it 0.03?') adalah cara tercepat kehilangan reproducibility. Solusinya: SEMUA parameter di satu config file (YAML/JSON) — tidak ada angka ajaib di kode.",
        "Setiap run mencatat: config lengkap, hash dataset, seed, versi kode (git commit), metrik, dan artefak (model file). Inilah experiment tracking — MLflow, Weights & Biases, atau bahkan CSV yang disiplin, semuanya lebih baik daripada ingatan.",
        "Config ID dari hash SHA-256 membuat setiap kombinasi parameter punya identitas unik: ubah satu angka, ID berubah. Tidak ada lagi 'run yang kemarin sore itu pakai lr berapa ya?'",
        "Aturan: kode membaca config; manusia tidak mengedit kode untuk mengganti parameter. Jika kamu perlu membuka file .py untuk mengubah learning rate, arsitekturnya salah.",
      ],
      "formula": "\\text{config\\_id} = \\text{sha256}(\\text{canonical\\_json(config)})[0:8]",
      "tasks": [
        {"id": "t1", "text": "Buat `canonical` = JSON config dengan key terurut"},
        {"id": "t2", "text": "Hitung `config_id` = 8 karakter pertama SHA-256"},
        {"id": "t3", "text": "Cetak config_id"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'experiment tracking = overkill untuk tim kecil'",
        "type": "pitfall",
        "body": "Yang benar: tim kecil justru paling butuh — karena satu orang memegang banyak eksperimen di kepala. CSV dengan kolom (run_id, git_commit, config_id, metric) sudah menyelamatkan banyak tim dari 'lupa run mana yang terbaik'.",
      },
      "hints": [
        "json.dumps(config, sort_keys=True) untuk canonical form.",
        "hashlib.sha256(teks.encode()).hexdigest() → hex string.",
        "Ambil 8 karakter pertama dengan [:8].",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "import json, hashlib\n"
          "config = {\"model\": \"logreg\", \"lr\": 0.01, \"epochs\": 50, \"seed\": 42, \"features\": [\"usia\", \"tenor\", \"gaji\"]}\n"
          "\n"
          "# TULIS KODEMU\n"
          "canonical = \n"
          "config_id = \n"
          "\n"
          "print(f\"config_id={config_id}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "import json, hashlib\n"
          "config = {\"model\": \"logreg\", \"lr\": 0.01, \"epochs\": 50, \"seed\": 42, \"features\": [\"usia\", \"tenor\", \"gaji\"]}\n"
          "\n"
          "# TULIS KODEMU\n"
          "canonical = json.dumps(config, sort_keys=True)\n"
          "config_id = hashlib.sha256(canonical.encode()).hexdigest()[:8]\n"
          "\n"
          "print(f\"config_id={config_id}\")"
        ),
        "checks": [
          {"kind": "defined", "task": "t1", "name": "canonical", "label": "`canonical` terdefinisi", "msg": "Buat canonical = json.dumps(config, sort_keys=True)."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "config_id=fc084cce", "label": "`print` menampilkan config_id", "msg": "SHA-256 dari canonical JSON, 8 karakter pertama."},
        ],
      },
      "reference": "sort_keys=True menjamin urutan key konsisten → hash stabil.",
    },
    {
      "id": "environment", "eyebrow": "Langkah 5 · Environment",
      "title": "Library, container, dan GPU yang 'kadang beda'",
      "prose": [
        "Sumber non-determinisme keempat: environment. Versi library yang berbeda bisa mengubah hasil numerik; GPU yang berbeda (atau bahkan run yang berbeda di GPU yang sama, tanpa deterministic flag) bisa menggeser digit terakhir.",
        "Praktik standar: lockfile (pip freeze / poetry.lock) mencatat versi eksak setiap dependensi; container (Docker) membekukan OS + library; CI membangun ulang dari definisi ini — bukan dari 'laptop yang kemarin bisa'.",
        "Untuk GPU: framework menyediakan mode deterministik (mis. torch.use_deterministic_algorithms) dengan biaya 10–30% lebih lambat. Keputusan: riset eksploratif boleh longgar; model yang diaudit regulator atau menjadi champion produksi wajib deterministik.",
        "Catat juga hardware dalam metadata run. 'Berhasil di-reproduce di A100 tapi tidak di T4' adalah informasi berharga, bukan kegagalan — ia memberitahumu ada operasi yang sensitif hardware.",
      ],
      "note": {
        "title": "💡 Intuisi: reproducibility = kemampuan menjelaskan, bukan bit-identik sempurna",
        "body": "Target praktis: orang lain dengan config + data + environment yang sama mendapatkan hasil dalam toleransi yang disepakati. Bit-identik adalah bonus; yang wajib adalah 'tidak ada kejutan'.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Seberapa reproducible harusnya?",
      "prose": [
        "Skenario 1 — Eksperimen eksploratif pribadi → seed tercatat + config file. Alasan: murah, dan kebiasaan baik dimulai sebelum dibutuhkan.",
        "Skenario 2 — Model kandidat champion untuk produksi → seed terkunci semua library + deterministic ops + lockfile + experiment tracking penuh. Alasan: model ini akan di-debug, dibandingkan, dan dipertahankan orang lain.",
        "Skenario 3 — Model untuk regulator (kredit, asuransi) → semua di atas + dataset berversion (hash) + environment container + run log yang bisa diaudit. Alasan: 'hasilnya beda waktu di-run ulang' adalah temuan audit yang serius.",
        "Skenario 4 — Training raksasa multi-hari yang mahal → checkpointing + resume deterministik + toleransi: bit-identik dikorbankan demi kecepatan, tetapi config dan data tetap terkunci. Alasan: biaya compute mengalahkan perfeksionisme numerik.",
        "Aturan praktis 10 detik: tanyakan 'siapa yang akan me-reproduce run ini 6 bulan lagi, dan apa taruhannya?' Taruhan kecil → seed + config. Taruhan besar (uang, regulasi) → kunci semuanya.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Audit Multifinance: 'tolong run ulang model champion'",
      "prose": [
        "Tim audit internal multifinance meminta: run ulang training model champion scoring (AUC 0,83) dan buktikan hasilnya sama. Tim data mencoba — dan gagal total.",
        "Investigasi menemukan 4 masalah: (1) learning rate diubah langsung di kode tanpa catatan — nilai aslinya tidak diketahui; (2) dataset diambil dari warehouse yang sudah di-overwrite 2 bulan lalu; (3) tidak ada yang mencatat seed; (4) library di-upgrade dari 1.12 ke 1.15 di tengah jalan.",
        "Hasil run ulang: AUC 0,79 — selisih 4 poin. Tidak ada yang bisa menjelaskan apakah selisih itu dari parameter, data, atau library. Model champion 'terbaik' itu secara formal tidak bisa dipertanggungjawabkan.",
        "Pertanyaan: (a) Dari 4 masalah, mana yang paling fatal untuk audit? (b) Berapa minimal artefak yang harus ada agar run bisa diulang? (c) Proses apa yang mencegah ini terulang?",
        "Pembahasan: (a) Dataset yang hilang (2) — tanpa data yang sama, tidak ada pembanding yang valid; parameter bisa ditebak, data tidak. (b) Minimal: config lengkap + hash/versi dataset + seed + versi kode (git commit) + versi environment. (c) Training pipeline yang otomatis mencatat kelimanya setiap run — disiplin manual tidak bertahan di bawah deadline.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "4 sumber non-determinisme: init acak, shuffle, operasi stokastik, hardware/GPU.",
        "Seed harus mengunci SEMUA library, bukan cuma random.",
        "Semua hyperparameter di config file — tidak ada angka ajaib di kode.",
        "Setiap run: config + hash data + seed + git commit + versi env + metrik + artefak.",
        "Config ID dari hash = identitas unik tiap kombinasi parameter.",
        "Tingkat reproducibility mengikuti taruhan: riset longgar, regulated ketat.",
      ],
      "next": {"label": "MLE4 — Evaluasi di Luar Akurasi", "href": "/v2/learn/mle4-evaluasi"},
      "quiz": [
        {
          "q": "Dua run kode identik hasil beda, run ketiga beda lagi. Penyebab paling mungkin?",
          "options": [
            {"text": "Kode rusak", "why": "Kode rusak biasanya gagal konsisten, bukan menghasilkan angka yang masuk akal tapi berbeda."},
            {"text": "Seed tidak dikunci di semua sumber keacakan", "why": "Tepat: tanpa seed terkunci, init/shuffle acak membuat tiap run berbeda.", "correct": True},
            {"text": "Data terlalu besar", "why": "Ukuran data tidak membuat hasil run-to-run berbeda."},
            {"text": "Komputer terlalu lambat", "why": "Kecepatan tidak mengubah hasil numerik."},
          ],
        },
        {
          "q": "Run A: lr=0.01 diubah langsung di kode, tidak tercatat. Masalahnya?",
          "options": [
            {"text": "Tidak masalah selama hasilnya bagus", "why": "Hasil bagus yang tidak bisa diulang = tidak bisa dipertahankan."},
            {"text": "Melanggar prinsip config-driven; run tidak bisa direproduksi", "why": "Tepat: parameter harus di config berversion, bukan di kode yang berubah diam-diam.", "correct": True},
            {"text": "Learning rate 0.01 terlalu kecil", "why": "Bukan soal nilainya, melainkan tidak tercatatnya nilai itu."},
            {"text": "Harus pakai 0.02", "why": "Tidak ada nilai 'harus' — yang harus adalah pencatatan."},
          ],
        },
        {
          "q": "Dataset training sudah di-overwrite dan tidak berversion. Dampak terburuk?",
          "options": [
            {"text": "Training jadi lebih lambat", "why": "Tidak berhubungan dengan kecepatan."},
            {"text": "Run historis tidak bisa dibandingkan atau diaudit secara valid", "why": "Tepat: tanpa data yang sama, tidak ada baseline pembanding yang sah.", "correct": True},
            {"text": "Model jadi overfit", "why": "Overfit soal pola data, bukan soal versioning."},
            {"text": "Seed tidak berfungsi", "why": "Seed dan data versioning adalah masalah berbeda."},
          ],
        },
        {
          "q": "Kapan mode deterministik GPU (yang 10–30% lebih lambat) WAJIB dipakai?",
          "options": [
            {"text": "Selalu, tanpa kecuali", "why": "Untuk eksplorasi cepat, biaya keterlambatan bisa lebih mahal daripada manfaatnya."},
            {"text": "Model champion/audit yang hasilnya harus bisa dipertanggungjawabkan", "why": "Tepat: ketika hasil harus dijelaskan ke pihak lain, determinisme sepadan dengan biayanya.", "correct": True},
            {"text": "Tidak pernah", "why": "Ada konteks (audit, debugging) di mana ia sangat berharga."},
            {"text": "Hanya saat GPU menganggur", "why": "Keputusan berbasis kebutuhan akuntabilitas, bukan ketersediaan GPU."},
          ],
        },
        {
          "q": "Config ID dari hash SHA-256 berguna untuk…",
          "options": [
            {"text": "Mempercepat training", "why": "Hash tidak memengaruhi kecepatan training."},
            {"text": "Memberi identitas unik tiap kombinasi parameter agar run bisa dilacak", "why": "Tepat: ubah satu parameter → ID berubah → tidak ada run yang tertukar.", "correct": True},
            {"text": "Mengenkripsi model", "why": "Hash bukan enkripsi dan tidak melindungi model."},
            {"text": "Mengompresi config", "why": "Hash 8 karakter bukan kompresi config."},
          ],
        },
      ],
    },
  ],
}

# ---- MLE4 figure: PR curve from seeded simulation (real data, computed at build time) ----
import random as _r4
_r4.seed(11)
_n4 = 2000
_yt4 = [1 if _r4.random() < 0.05 else 0 for _ in range(_n4)]
_sc4 = [_r4.gauss(0.7 if y else 0.3, 0.25) for y in _yt4]
_pr4 = []
_th4 = 0.05
while _th4 < 1.0:
    _yp4 = [1 if s > _th4 else 0 for s in _sc4]
    _tp4 = sum(1 for t, p in zip(_yt4, _yp4) if t == 1 and p == 1)
    _fp4 = sum(1 for t, p in zip(_yt4, _yp4) if t == 0 and p == 1)
    _fn4 = sum(1 for t, p in zip(_yt4, _yp4) if t == 1 and p == 0)
    _rc4 = _tp4 / (_tp4 + _fn4)
    _pc4 = _tp4 / (_tp4 + _fp4) if _tp4 + _fp4 else 0.0
    _pr4.append((round(_rc4, 3), round(_pc4, 3)))
    _th4 += 0.05
mle4_pr_svg = line_svg(_pr4, title="Kurva Precision-Recall (2.000 transaksi, 5% fraud)",
                       xlab="recall", ylab="precision",
                       marks=[(0.8, 0.148, "thr=0,5")])

# ==================== MLE4 ====================
mle4 = {
  "slug": "mle4-evaluasi", "track": "Machine Learning Engineer",
  "module": "Fondasi Produksi", "title": "MLE4 — Evaluasi di Luar Akurasi", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Akurasi adalah metrik yang paling sering dikutip dan paling sering menipu. Lesson ini melengkapimu dengan metrik yang jujur untuk keputusan produksi.",
        "Tujuan lesson ini:",
        "• Menjelaskan accuracy paradox pada data imbalance dengan angka konkret.",
        "• Menghitung precision, recall, F1 dari confusion matrix dari nol.",
        "• Memilih threshold berdasarkan cost, bukan default 0,5.",
        "• Mengukur kalibrasi model dengan Expected Calibration Error (ECE).",
        "• Melakukan slice evaluation: metrik per segmen, bukan cuma global.",
        "Isi lesson: cerita model fraud '99% akurat' yang buta → precision/recall + lab → kalibrasi + lab → slice evaluation → peta keputusan metrik → mini-case cost threshold → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model 99% akurat yang tidak menangkap satu pun penipu",
      "prose": [
        "Sebuah payment gateway membanggakan model fraud dengan akurasi 99,3%. Direksi puas. Tiga bulan kemudian, tim finance bertanya: kenapa kerugian fraud naik 40%?",
        "Twist-nya sederhana sekaligus brutal: hanya 0,7% transaksi yang fraud. Model yang memprediksi 'bukan fraud' untuk SEMUA transaksi otomatis mendapat akurasi 99,3% — sambil membiarkan setiap penipu lolos. Recall-nya: 0%.",
        "Inilah accuracy paradox: pada data imbalance, akurasi didominasi kelas mayoritas dan tidak memberi tahu apa-apa tentang kemampuan model pada kelas yang penting.",
        "Pelajaran MLE: metrik evaluasi harus selaras dengan BIAYA KESALAHAN bisnis. Salah memprediksi fraud (false negative) biayanya jutaan rupiah; salah menandai transaksi legit (false positive) biayanya satu investigasi. Akurasi memperlakukan keduanya sama — bisnis tidak.",
      ],
      "note": {
        "title": "🚨 Mitos: 'akurasi 99% = model hebat'",
        "type": "pitfall",
        "body": "Yang benar: bandingkan dengan baseline mayoritas. Jika 99% datamu kelas A, model 'selalu tebak A' juga 99% akurat. Metrik yang jujur untuk imbalance: precision, recall, F1, atau PR-AUC — bukan akurasi.",
      },
      "tasks": [],
    },
    {
      "id": "pr", "eyebrow": "Langkah 3 · Precision, recall, F1",
      "title": "Confusion matrix: empat kotak yang bercerita",
      "prose": [
        "Confusion matrix membagi prediksi menjadi: TP (benar menangkap), FP (salah tuduh), FN (lolos), TN (benar melepas). Dari sini: precision = TP/(TP+FP) — 'dari yang ditangkap, berapa yang benar-benar fraud?'; recall = TP/(TP+FN) — 'dari semua fraud, berapa yang tertangkap?'.",
        "Tradeoff abadi: menurunkan threshold menangkap lebih banyak fraud (recall naik) tetapi salah tuduh makin banyak (precision turun). Tidak ada threshold yang memaksimalkan keduanya — pilihannya adalah keputusan bisnis.",
        "F1 = 2·precision·recall/(precision+recall) adalah rata-rata harmonik keduanya — berguna sebagai SATU angka ringkas, tetapi jangan biarkan ia menggantikan pemahaman tradeoff.",
        "Lab: dari 2.000 transaksi (5% fraud), model pada threshold 0,5 menghasilkan akurasi 78,4% tetapi precision hanya 14,8% — 'lumayan' yang menipu, lagi.",
      ],
      "formula": "\\text{precision} = \\frac{TP}{TP+FP} \\qquad \\text{recall} = \\frac{TP}{TP+FN} \\qquad F_1 = \\frac{2PR}{P+R}",
      "figure": {
        "svg": mle4_pr_svg,
        "alt": "Kurva precision-recall: recall naik, precision turun.",
        "caption": "Cara membaca: sumbu X = recall, sumbu Y = precision; tiap titik = satu threshold. Interpretasi: kurva turun ke kanan — menangkap lebih banyak fraud (recall naik) selalu dibayar dengan lebih banyak salah tuduh (precision turun). Titik thr=0,5: recall 0,80, precision 0,15.",
      },
      "tasks": [
        {"id": "t1", "text": "Hitung `tp`, `fp`, `fn`, `tn` dari `y_true` dan `y_pred`"},
        {"id": "t2", "text": "Hitung `precision`, `recall`, `f1`, `acc`"},
        {"id": "t3", "text": "Cetak keempat metrik dengan 3 desimal"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: precision vs recall = siapa yang menanggung salah",
        "body": "False positive ditanggung tim investigasi (kelelahan). False negative ditanggung perusahaan (kerugian). Tanyakan 'salah mana yang lebih mahal?' — jawabannya menentukan metrik mana yang dioptimasi.",
      },
      "hints": [
        "tp: t==1 dan p==1; fp: t==0 dan p==1; fn: t==1 dan p==0; tn: sisanya.",
        "precision = tp/(tp+fp); recall = tp/(tp+fn).",
        "f1 = 2*precision*recall/(precision+recall); acc = (tp+tn)/n.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(11)\n"
          "n = 2000\n"
          "y_true = [1 if random.random() < 0.05 else 0 for _ in range(n)]\n"
          "scores = [random.gauss(0.7 if y else 0.3, 0.25) for y in y_true]\n"
          "y_pred = [1 if s > 0.5 else 0 for s in scores]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: confusion matrix\n"
          "tp = \n"
          "fp = \n"
          "fn = \n"
          "tn = \n"
          "\n"
          "# TULIS KODEMU: metrik\n"
          "precision = \n"
          "recall = \n"
          "f1 = \n"
          "acc = \n"
          "\n"
          "print(f\"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}  f1={f1:.3f}\")"
        ),
        "lockLines": 8,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(11)\n"
          "n = 2000\n"
          "y_true = [1 if random.random() < 0.05 else 0 for _ in range(n)]\n"
          "scores = [random.gauss(0.7 if y else 0.3, 0.25) for y in y_true]\n"
          "y_pred = [1 if s > 0.5 else 0 for s in scores]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: confusion matrix\n"
          "tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\n"
          "fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\n"
          "fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n"
          "tn = n - tp - fp - fn\n"
          "\n"
          "# TULIS KODEMU: metrik\n"
          "precision = tp / (tp + fp)\n"
          "recall = tp / (tp + fn)\n"
          "f1 = 2 * precision * recall / (precision + recall)\n"
          "acc = (tp + tn) / n\n"
          "\n"
          "print(f\"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}  f1={f1:.3f}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "tp", "value": 72, "tol": 1e-9, "label": "`tp` = 72", "msg": "Hitung pasangan (t=1, p=1)."},
          {"kind": "equal", "task": "t2", "name": "precision", "value": 0.148, "tol": 0.002, "label": "`precision` ≈ 0.148", "msg": "72/(72+413) = 0.148. Mayoritas 'tangkapan' adalah salah tuduh."},
          {"kind": "equal", "task": "t2", "name": "recall", "value": 0.8, "tol": 0.002, "label": "`recall` ≈ 0.800", "msg": "72/(72+18) = 0.80."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "acc=0\\.784", "label": "`print` menampilkan akurasi", "msg": "Format: acc=...  precision=...  recall=...  f1=...."},
        ],
      },
      "reference": "zip(y_true, y_pred) memasangkan label dan prediksi. Waspadai pembagian nol bila tp+fp=0.",
    },
    {
      "id": "kalibrasi", "eyebrow": "Langkah 4 · Kalibrasi",
      "title": "Skor 0,9 harus berarti 90% — benarkah?",
      "prose": [
        "Model klasifikasi mengeluarkan skor (mis. 0,9), tetapi skor BUKAN probabilitas kecuali modelnya terkalibrasi. Model terkalibrasi: dari semua prediksi berskor ~0,9, benar-benar 90% yang positif.",
        "Kenapa penting di produksi? Threshold, ekspektasi kerugian, dan keputusan 'auto-approve vs review manual' semuanya mengasumsikan skor ≈ probabilitas. Model yang overconfident membuat keputusan bisnis berdasarkan angka dusta.",
        "Expected Calibration Error (ECE): bagi prediksi ke 10 bin berdasarkan skor; tiap bin hitung |akurasi_bin − confidence_bin|; rata-ratakan berbobot. ECE > 0,05 = kalibrasi buruk, pertimbangkan Platt scaling atau isotonic regression.",
        "Lab: model simulasi dengan skor acak menghasilkan ECE 0,143 — jauh di atas ambang. Skornya tidak bisa dipercaya sebagai probabilitas.",
      ],
      "formula": "\\text{ECE} = \\sum_{b=1}^{10} \\frac{n_b}{n}\\,|\\text{acc}_b - \\text{conf}_b|",
      "tasks": [
        {"id": "t1", "text": "Kelompokkan prediksi ke 10 bin, hitung `ece`"},
        {"id": "t2", "text": "Tentukan `verdict`: 'kalibrasi buruk' jika ece > 0.05"},
        {"id": "t3", "text": "Cetak ece dan verdict"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'skor model = probabilitas, tinggal pakai'",
        "type": "pitfall",
        "body": "Yang benar: skor hanya ranking kecuali terbukti terkalibrasi. Model dengan AUC tinggi bisa kalibrasinya buruk — diskriminasi (ranking) dan kalibrasi (nilai absolut) adalah dua kemampuan berbeda.",
      },
      "hints": [
        "Bin b: indeks i dengan lo <= probs[i] < hi (bin terakhir inklusif 1.0).",
        "conf = rata-rata probs di bin; acc = rata-rata y di bin.",
        "ece += abs(acc - conf) * len(idx)/n.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(13)\n"
          "n = 5000\n"
          "probs = [random.random() for _ in range(n)]\n"
          "y = [1 if random.random() < 0.5*p + 0.15 else 0 for p in probs]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: ECE dengan 10 bin\n"
          "ece = 0.0\n"
          "for b in range(10):\n"
          "    lo, hi = b/10, (b+1)/10\n"
          "    idx = [i for i, p in enumerate(probs) if (lo <= p < hi) or (b == 9 and p == 1.0)]\n"
          "    if not idx:\n"
          "        continue\n"
          "    conf = \n"
          "    accb = \n"
          "    ece += \n"
          "\n"
          "verdict = \n"
          "print(f\"ece={ece:.3f}  verdict={verdict}\")"
        ),
        "lockLines": 7,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(13)\n"
          "n = 5000\n"
          "probs = [random.random() for _ in range(n)]\n"
          "y = [1 if random.random() < 0.5*p + 0.15 else 0 for p in probs]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: ECE dengan 10 bin\n"
          "ece = 0.0\n"
          "for b in range(10):\n"
          "    lo, hi = b/10, (b+1)/10\n"
          "    idx = [i for i, p in enumerate(probs) if (lo <= p < hi) or (b == 9 and p == 1.0)]\n"
          "    if not idx:\n"
          "        continue\n"
          "    conf = sum(probs[i] for i in idx) / len(idx)\n"
          "    accb = sum(y[i] for i in idx) / len(idx)\n"
          "    ece += abs(accb - conf) * len(idx) / n\n"
          "\n"
          "verdict = \"kalibrasi buruk\" if ece > 0.05 else \"terkalibrasi\"\n"
          "print(f\"ece={ece:.3f}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "ece", "value": 0.143, "tol": 0.005, "label": "`ece` ≈ 0.143", "msg": "Rata-rata berbobot |acc − conf| per bin. Model ini overconfident."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=kalibrasi buruk", "label": "`print` memvonis kalibrasi", "msg": "ece > 0.05 → 'kalibrasi buruk'."},
        ],
      },
      "reference": "enumerate() memberi (indeks, nilai). Bin terakhir harus inklusif p==1.0.",
    },
    {
      "id": "slice", "eyebrow": "Langkah 5 · Slice evaluation",
      "title": "Metrik global 90%, metrik segmen 40%",
      "prose": [
        "Metrik global adalah rata-rata — dan rata-rata menyembunyikan segmen yang menderita. Model dengan akurasi global 90% bisa memiliki akurasi 40% pada segmen 'pengguna baru dari luar Jawa' yang justru paling penting bagi bisnis.",
        "Slice evaluation: hitung metrik per segmen yang relevan secara bisnis — wilayah, segmen umur, tipe device, jam transaksi. Pilih slice SEBELUM melihat hasil (berdasarkan risiko bisnis), bukan setelah (agar tidak jadi p-hacking).",
        "Contoh nyata: model churn dengan recall global 80% ternyata recall 45% pada pelanggan korporat — segmen dengan nilai kontrak 20x lipat. Satu angka global menyembunyikan kerugian terbesar.",
        "Kaitannya dengan fairness (MLE12): slice berdasarkan grup demografis adalah fondasi audit bias. Evaluasi yang tidak di-slice = evaluasi yang buta.",
      ],
      "note": {
        "title": "💡 Intuisi: slice adalah tempat uang dan reputasi hilang",
        "body": "Pilih 3–5 slice berdasarkan dampak bisnis TERTINGGI, bukan yang datanya paling banyak. Segmen kecil bernilai besar (korporat, VIP) wajib punya metrik sendiri meski sampelnya sedikit.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Metrik apa untuk masalah apa",
      "prose": [
        "Skenario 1 — Deteksi fraud (FN mahal: Rp500rb; FP murah: Rp20rb investigasi) → optimasi recall, threshold rendah. Alasan: satu fraud lolos = 25x biaya satu salah tuduh.",
        "Skenario 2 — Blokir otomatis akun (FP mahal: pelanggan marah + churn) → optimasi precision, threshold tinggi; yang meragukan lempar ke review manual. Alasan: salah blokir merusak kepercayaan.",
        "Skenario 3 — Ranking rekomendasi (tidak ada threshold) → PR-AUC atau NDCG. Alasan: yang penting urutan, bukan keputusan biner.",
        "Skenario 4 — Skor dipakai untuk pricing asuransi → kalibrasi (ECE) WAJIB bagus. Alasan: skor diterjemahkan langsung menjadi rupiah; skor dusta = harga salah.",
        "Aturan praktis 10 detik: tulis cost matrix dulu (biaya FP vs FN), baru pilih metrik. Metrik tanpa cost = opini; metrik dengan cost = keputusan.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Threshold 0,5 vs 0,3: Rp16 juta vs Rp11 juta",
      "prose": [
        "Payment gateway memproses 10.000 transaksi/minggu dengan 100 fraud aktual. Dua kandidat threshold:",
        "Threshold 0,5: TP=70, FP=50, FN=30. Threshold 0,3: TP=90, FP=300, FN=10. Biaya: tiap FN (fraud lolos) = Rp500rb; tiap FP (investigasi) = Rp20rb.",
        "Hitung: threshold 0,5 → FN 30 × Rp500rb = Rp15jt + FP 50 × Rp20rb = Rp1jt → total Rp16jt/minggu. Threshold 0,3 → FN 10 × Rp500rb = Rp5jt + FP 300 × Rp20rb = Rp6jt → total Rp11jt/minggu.",
        "Pertanyaan: (a) Threshold mana yang dipilih dan kenapa? (b) Berapa precision masing-masing? (c) Kapan jawabannya berbalik?",
        "Pembahasan: (a) Threshold 0,3 — menghemat Rp5jt/minggu (Rp260jt/tahun) meski 'terlihat' lebih buruk karena banyak salah tuduh. (b) Precision 0,5: 70/120 = 58%; 0,3: 90/390 = 23%. Precision lebih rendah tetapi total cost lebih kecil — inilah kenapa cost mengalahkan estetika metrik. (c) Jika biaya investigasi naik (mis. tiap FP butuh 2 jam analis senior = Rp200rb), maka 0,3 → Rp65jt vs 0,5 → Rp25jt: jawaban berbalik. Threshold adalah fungsi cost, bukan sifat model.",
      ],
      "note": {
        "title": "Kaitan ke risk",
        "type": "risk",
        "body": "Inilah inti risk-based decision: expected loss = P(event) × impact. Threshold optimal meminimalkan ekspektasi kerugian, bukan memaksimalkan metrik akademik.",
      },
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Accuracy paradox: pada imbalance, akurasi didominasi kelas mayoritas.",
        "Precision = ketepatan tuduhan; recall = kelengkapan tangkapan; F1 = harmonik keduanya.",
        "Threshold adalah keputusan bisnis berbasis cost, bukan default 0,5.",
        "Kalibrasi (ECE): skor harus ≈ probabilitas bila dipakai untuk keputusan bernilai uang.",
        "Slice evaluation: hitung metrik per segmen bisnis penting — global average menyembunyikan masalah.",
        "Tulis cost matrix DULU, baru pilih metrik.",
      ],
      "next": {"label": "MLE5 — Model Serving: Batch vs Online", "href": "/v2/learn/mle5-serving"},
      "quiz": [
        {
          "q": "Fraud 0,7% dari transaksi. Model 'selalu tebak bukan fraud' akurasinya 99,3%. Kesimpulan?",
          "options": [
            {"text": "Model hebat, langsung deploy", "why": "Recall-nya 0% — tidak menangkap satu pun fraud. Akurasi menipu di sini."},
            {"text": "Akurasi tidak informatif; pakai precision/recall", "why": "Tepat: baseline mayoritas sudah 99,3%; yang penting adalah performa pada kelas minoritas.", "correct": True},
            {"text": "Butuh lebih banyak data", "why": "Masalahnya metrik, bukan jumlah data."},
            {"text": "Naikkan threshold", "why": "Model ini bahkan tidak punya threshold yang bermakna — ia tidak pernah memprediksi positif."},
          ],
        },
        {
          "q": "Biaya FN Rp500rb, biaya FP Rp20rb. Strategi threshold?",
          "options": [
            {"text": "Threshold tinggi untuk precision maksimal", "why": "Itu benar bila FP yang mahal; di sini FN 25x lebih mahal."},
            {"text": "Threshold rendah untuk recall tinggi", "why": "Tepat: FN jauh lebih mahal, jadi tangkap sebanyak mungkin meski banyak salah tuduh.", "correct": True},
            {"text": "Tetap 0,5 karena standar", "why": "0,5 bukan standar — ia arbitrer tanpa dasar cost."},
            {"text": "Threshold tidak penting", "why": "Mini-case menunjukkan threshold mengubah cost Rp16jt vs Rp11jt per minggu."},
          ],
        },
        {
          "q": "Model AUC 0,92 tetapi ECE 0,14. Aman dipakai untuk pricing asuransi?",
          "options": [
            {"text": "Aman, AUC-nya tinggi", "why": "AUC mengukur ranking, bukan kebenaran nilai probabilitas."},
            {"text": "Tidak — skornya tidak terkalibrasi, harga akan salah", "why": "Tepat: pricing butuh probabilitas yang jujur; ECE 0,14 jauh di atas ambang 0,05.", "correct": True},
            {"text": "Aman jika threshold 0,5", "why": "Threshold tidak memperbaiki kalibrasi."},
            {"text": "Perlu lebih banyak fitur", "why": "Masalahnya kalibrasi, diperbaiki dengan Platt/isotonic scaling, bukan fitur baru."},
          ],
        },
        {
          "q": "Model akurasi global 90%, tetapi 40% pada segmen korporat bernilai tinggi. Tindakan?",
          "options": [
            {"text": "Deploy saja, globalnya bagus", "why": "Segmen bernilai tertinggi justru yang paling buruk — kerugian terbesar ada di sana."},
            {"text": "Slice evaluation rutin + perbaiki performa segmen kritis sebelum deploy", "why": "Tepat: metrik per segmen mencegah rata-rata menyembunyikan masalah.", "correct": True},
            {"text": "Hapus segmen korporat dari data", "why": "Menghapus masalah dari laporan bukan menyelesaikan masalah."},
            {"text": "Naikkan akurasi global ke 95%", "why": "Akurasi global bisa naik sambil segmen kritis tetap buruk."},
          ],
        },
        {
          "q": "F1-score paling tepat dipakai ketika…",
          "options": [
            {"text": "Butuh satu angka ringkas saat precision dan recall sama pentingnya", "why": "Tepat: F1 adalah rata-rata harmonik — ringkas, tetapi sembunyikan tradeoff.", "correct": True},
            {"text": "Selalu lebih baik dari akurasi", "why": "F1 buta terhadap TN; untuk masalah dengan TN penting, akurasi bisa lebih relevan."},
            {"text": "Data seimbang sempurna", "why": "Pada data seimbang, akurasi biasanya cukup."},
            {"text": "Tidak perlu threshold", "why": "F1 tetap butuh threshold untuk klasifikasi biner."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE5 ====================
mle5 = {
  "slug": "mle5-serving", "track": "Machine Learning Engineer",
  "module": "Serving & Operasi", "title": "MLE5 — Model Serving: Batch vs Online", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Model yang sudah dilatih harus 'dihidangkan' ke pengguna — dan cara menghidangkannya menentukan biaya, kecepatan, dan keandalan. Salah pilih arsitektur = bayar 20x lipat untuk manfaat yang sama.",
        "Tujuan lesson ini:",
        "• Membedakan batch, online, dan streaming serving beserta tradeoff-nya.",
        "• Menghitung perbandingan biaya batch vs online dari angka nyata.",
        "• Merancang arsitektur serving: API, model server, versioning endpoint.",
        "• Menghitung kebutuhan kapasitas dengan Little's Law.",
        "• Memutuskan pola serving untuk 4 skenario bisnis berbeda.",
        "Isi lesson: cerita tagihan 20x lipat → 3 pola serving + lab biaya → arsitektur & kapasitas + lab → SLO & operasional → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Tagihan $2.000/hari untuk pekerjaan $100/hari",
      "prose": [
        "Sebuah marketplace mendeploy model prediksi demand sebagai API online: GPU menyala 24 jam, autoscaling siap melayani request kapan pun. Kedengarannya modern dan benar.",
        "Masalahnya: model itu hanya dipakai SEKALI sehari — jam 2 pagi, untuk menghitung prediksi 5 juta SKU yang dibaca tim merchandising jam 8 pagi. Tidak ada satu pun request real-time. GPU mahal itu menganggur 23 jam sehari menunggu pekerjaan yang sebenarnya batch.",
        "Twist-nya: tim memilih online serving bukan karena kebutuhan, melainkan karena 'itu yang modern'. Tagihannya $2.000/hari vs $100/hari jika dikerjakan sebagai batch job — 20x lipat untuk hasil yang identik.",
        "Pelajaran: pola serving dipilih dari KEBUTUHAN LATENSI pengguna, bukan dari tren teknologi. 'Kapan hasilnya dibutuhkan?' adalah pertanyaan pertama, bukan terakhir.",
      ],
      "note": {
        "title": "🚨 Mitos: 'serving modern = API real-time'",
        "type": "pitfall",
        "body": "Yang benar: mayoritas workload ML di perusahaan adalah batch (laporan harian, scoring mingguan, ETL). Real-time hanya untuk kasus yang benar-benar butuh respons < detik. Memaksakan online pada workload batch = membayar kemewahan yang tidak dipakai.",
      },
      "tasks": [],
    },
    {
      "id": "pola", "eyebrow": "Langkah 3 · Tiga pola serving",
      "title": "Batch, online, streaming: pilih senjatamu",
      "prose": [
        "Batch: kumpulkan request, proses sekaligus dalam jadwal (harian/mingguan). Latency: menit–jam. Biaya: termurah (compute dipakai penuh, bisa spot/preemptible). Cocok: laporan, scoring portofolio, rekomendasi harian.",
        "Online: satu request → satu respons, dalam milidetik. Latency: <100ms tipikal. Biaya: termahal (kapasitas standby 24/7). Cocok: fraud real-time, search ranking, rekomendasi saat browsing.",
        "Streaming: data mengalir kontinu, diproses per event/window kecil. Latency: detik. Cocok: deteksi anomali sensor, agregat real-time ('transaksi 1 jam terakhir').",
        "Karakteristik kunci: batch memaksimalkan throughput per rupiah; online meminimalkan latency per request; streaming menyeimbangkan keduanya untuk data yang tak pernah berhenti.",
        "Lab berikut menghitungnya: 5 juta prediksi/hari — berapa biaya online vs batch?",
      ],
      "figure": {
        "svg": bars_svg([("online", 2000), ("batch", 100)], title="Biaya serving 5 jt prediksi/hari ($)", colors=[C4, C2]),
        "alt": "Bar chart: biaya online $2.000/hari, batch $100/hari.",
        "caption": "Cara membaca: tinggi batang = biaya harian dalam dolar. Interpretasi: untuk workload yang sama (5 juta prediksi/hari), online 20x lebih mahal — selisih $1.900/hari atau ~$57.000/bulan untuk 'kemewahan' yang tidak dibutuhkan workload batch.",
      },
      "tasks": [
        {"id": "t1", "text": "Hitung `online` dan `batch`: biaya harian dalam dolar"},
        {"id": "t2", "text": "Hitung `rasio` = online / batch"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: tanyakan 'kapan hasilnya dibaca manusia?'",
        "body": "Jika jawabannya 'besok pagi di dashboard' → batch. 'Detik ini di aplikasi' → online. 'Terus-menerus dari sensor' → streaming. Pertanyaan satu kalimat ini mencegah 80% kesalahan arsitektur.",
      },
      "hints": [
        "biaya = (req_per_hari / 1000) × tarif_per_1k.",
        "rasio = online / batch.",
        "f-string {x:.0f} untuk tanpa desimal.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "req_per_hari = 5_000_000\n"
          "tarif_online_per_1k = 0.40   # $ per 1000 request (GPU standby)\n"
          "tarif_batch_per_1k = 0.02    # $ per 1000 request (job terjadwal)\n"
          "\n"
          "# TULIS KODEMU\n"
          "online = \n"
          "batch = \n"
          "rasio = \n"
          "\n"
          "print(f\"online=${online:.0f}/hari  batch=${batch:.0f}/hari  rasio={rasio:.0f}x\")"
        ),
        "lockLines": 4,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "req_per_hari = 5_000_000\n"
          "tarif_online_per_1k = 0.40   # $ per 1000 request (GPU standby)\n"
          "tarif_batch_per_1k = 0.02    # $ per 1000 request (job terjadwal)\n"
          "\n"
          "# TULIS KODEMU\n"
          "online = req_per_hari / 1000 * tarif_online_per_1k\n"
          "batch = req_per_hari / 1000 * tarif_batch_per_1k\n"
          "rasio = online / batch\n"
          "\n"
          "print(f\"online=${online:.0f}/hari  batch=${batch:.0f}/hari  rasio={rasio:.0f}x\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "online", "value": 2000, "tol": 1e-9, "label": "`online` = $2000/hari", "msg": "5.000.000/1000 × 0.40 = 2000."},
          {"kind": "equal", "task": "t1", "name": "batch", "value": 100, "tol": 1e-9, "label": "`batch` = $100/hari", "msg": "5.000.000/1000 × 0.02 = 100."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "rasio=20x", "label": "`print` menampilkan rasio", "msg": "2000/100 = 20x."},
        ],
      },
      "reference": "5_000_000 = 5 juta (underscore hanya pemisah baca).",
    },
    {
      "id": "arsitektur", "eyebrow": "Langkah 4 · Arsitektur serving",
      "title": "Dari request ke prediksi: siapa melakukan apa",
      "prose": [
        "Arsitektur online tipikal: client → API gateway (auth, rate limit) → model server (memuat model berversion) → feature lookup → prediksi → monitoring/logging. Setiap panah adalah tempat kegagalan — dan tempat dioptimasi.",
        "Dua keputusan penting. Pertama, versioning endpoint: /v1 dan /v2 berjalan paralel saat model baru diuji (canary/shadow). Tanpa ini, rollback = deploy ulang yang panik.",
        "Kedua, kapasitas: Little's Law — jumlah request yang sedang diproses = laju kedatangan × latency. 500 request/detik × 0,08 detik = 40 request concurrent. Dengan target utilisasi 70%, butuh 58 worker. Ini bukan tebakan — ini aritmetika.",
        "Cold start: model besar butuh detik untuk dimuat ke memori. Solusi: keep-warm, model kecil untuk fallback, atau pisahkan loading dari request path.",
      ],
      "formula": "L = \\lambda \\times W",
      "tasks": [
        {"id": "t1", "text": "Hitung `concurrent` = rps × latency (Little's Law)"},
        {"id": "t2", "text": "Hitung `workers` = ceil(concurrent / util_target)"},
        {"id": "t3", "text": "Cetak keduanya"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'tambah server = latency turun'",
        "type": "pitfall",
        "body": "Yang benar: menambah worker menaikkan THROUGHPUT (request/detik), bukan menurunkan LATENCY per request. Latency per request diturunkan dengan model lebih kecil, optimasi, atau caching — bukan dengan menambah mesin.",
      },
      "hints": [
        "concurrent = rps * latency.",
        "import math; workers = math.ceil(concurrent / util_target).",
        "ceil = pembulatan ke atas — worker tidak bisa pecahan.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "import math\n"
          "rps, latency, util_target = 500, 0.08, 0.7\n"
          "\n"
          "# TULIS KODEMU: Little's Law\n"
          "concurrent = \n"
          "workers = \n"
          "\n"
          "print(f\"concurrent={concurrent:.0f}  workers={workers}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "import math\n"
          "rps, latency, util_target = 500, 0.08, 0.7\n"
          "\n"
          "# TULIS KODEMU: Little's Law\n"
          "concurrent = rps * latency\n"
          "workers = math.ceil(concurrent / util_target)\n"
          "\n"
          "print(f\"concurrent={concurrent:.0f}  workers={workers}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "concurrent", "value": 40, "tol": 1e-9, "label": "`concurrent` = 40", "msg": "500 × 0.08 = 40 request sedang diproses."},
          {"kind": "equal", "task": "t2", "name": "workers", "value": 58, "tol": 1e-9, "label": "`workers` = 58", "msg": "ceil(40 / 0.7) = ceil(57.14) = 58."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "concurrent=40\\s+workers=58", "label": "`print` menampilkan keduanya", "msg": "Format: concurrent=...  workers=...."},
        ],
      },
      "reference": "Little's Law: L (concurrent) = λ (laju) × W (latency). math.ceil untuk kapasitas.",
    },
    {
      "id": "slo", "eyebrow": "Langkah 5 · SLO dan operasional",
      "title": "Kontrak yang dijaga mesin, bukan janji",
      "prose": [
        "SLO (Service Level Objective): '99% request < 200ms dalam 30 hari'. Bukan rata-rata — pakai persentil (p99), karena rata-rata menyembunyikan 1% pengguna yang menderita.",
        "Autoscaling menaikkan worker saat antrean tumbuh — tetapi butuh menit untuk siap, sementara lonjakan butuh detik. Solusi: overprovision baseline + autoscaling untuk tren, bukan untuk spike.",
        "Shadow deployment: model baru menerima traffic salinan (tidak memengaruhi pengguna) — validasi gratis dengan data produksi nyata. Canary: 5% traffic ke model baru, bandingkan metrik, naikkan bertahap.",
        "Circuit breaker: jika model server gagal, fallback ke model sederhana/cache/default — lebih baik prediksi mediocre daripada error 500.",
      ],
      "note": {
        "title": "💡 Intuisi: rencanakan kegagalan, bukan kesempurnaan",
        "body": "Setiap komponen serving AKAN gagal suatu hari. Desain yang baik bukan yang tidak pernah gagal, melainkan yang gagal dengan anggun (graceful degradation) dan pulih tanpa drama.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Pola serving untuk 4 skenario",
      "prose": [
        "Skenario 1 — Skor kredit saat pengajuan online (user menunggu) → online serving, p99 < 300ms. Alasan: keputusan harus keluar sebelum user menutup aplikasi.",
        "Skenario 2 — Prediksi demand 5 juta SKU untuk perencanaan mingguan → batch harian. Alasan: tidak ada yang menunggu real-time; batch 20x lebih murah.",
        "Skenario 3 — Fraud kartu kredit saat transaksi → online (< 100ms) + fallback rule-based jika timeout. Alasan: transaksi tidak bisa menunggu; tetapi kegagalan harus graceful.",
        "Skenario 4 — Agregat fitur 'transaksi 1 jam terakhir' untuk model fraud → streaming. Alasan: fitur bergantung pada event yang terus mengalir; batch harian terlalu basi.",
        "Aturan praktis 10 detik: (1) Berapa lama user boleh menunggu? (2) Berapa biaya standby vs batch? (3) Apa yang terjadi jika serving mati 5 menit? Jawaban menentukan pola.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Bank Digital Nusa: 12.000 pengajuan/hari",
      "prose": [
        "Bank Digital Nusa memproses 12.000 pengajuan kredit per hari (puncak 2.000/jam). Model scoring latency 60ms. SLO: p99 < 500ms end-to-end.",
        "Opsi A — online: 2.000/3600 = 0,56 request/detik rata-rata puncak; concurrent = 0,56 × 0,06 ≈ 0,03 → 1 worker cukup secara teori, tetapi butuh minimal 2 untuk redundansi + autoscaling. Biaya: $900/bulan.",
        "Opsi B — batch per jam: kumpulkan pengajuan, skor sekaligus tiap jam. Biaya: $60/bulan. Tetapi user menunggu hingga 1 jam untuk keputusan — conversion drop terukur 18% pada pengajuan yang menunggu > 10 menit.",
        "Pertanyaan: (a) Hitung concurrent request puncak. (b) Opsi mana yang dipilih? (c) Kapan jawabannya berubah?",
        "Pembahasan: (a) 2000/3600 × 0,06 = 0,033 → praktis 1–2 worker + redundansi. (b) Online: selisih $840/bulan tidak sebanding dengan kehilangan 18% conversion pada 12.000 pengajuan/hari — satu nasabah kredit bernilai jauh lebih dari itu. (c) Jika produknya pengajuan KPR yang memang diproses manual 3 hari → batch cukup; latency bukan faktor conversion.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Pola serving dipilih dari kebutuhan latency, bukan tren teknologi.",
        "Batch: termurah, latency jam; online: termahal, latency ms; streaming: untuk data kontinu.",
        "Workload batch yang di-serve online = membayar 20x untuk manfaat nol.",
        "Little's Law: concurrent = laju × latency → dasar perhitungan kapasitas.",
        "Tambah worker = tambah throughput, BUKAN turunkan latency.",
        "Shadow/canary untuk rilis aman; circuit breaker untuk gagal yang anggun.",
      ],
      "next": {"label": "MLE6 — Monitoring: Drift & Performance Decay", "href": "/v2/learn/mle6-monitoring"},
      "quiz": [
        {
          "q": "Model dipakai sekali sehari jam 2 pagi untuk 5 juta SKU. Pola serving terbaik?",
          "options": [
            {"text": "API online 24/7", "why": "20x lebih mahal untuk pekerjaan yang tidak butuh real-time."},
            {"text": "Batch job terjadwal", "why": "Tepat: tidak ada yang menunggu real-time; batch termurah dan paling sederhana.", "correct": True},
            {"text": "Streaming", "why": "Streaming untuk data kontinu, bukan job harian terjadwal."},
            {"text": "Manual via notebook", "why": "Tidak reproducible dan tidak terpantau — pelajaran MLE1."},
          ],
        },
        {
          "q": "500 rps, latency 0,08s, target utilisasi 70%. Berapa worker?",
          "options": [
            {"text": "40", "why": "Itu concurrent request (500×0,08), belum dibagi utilisasi target."},
            {"text": "58", "why": "Tepat: ceil(40/0,7) = 58.", "correct": True},
            {"text": "28", "why": "Itu 40×0,7 — terbalik; utilisasi target di bawah 100% butuh LEBIH banyak worker."},
            {"text": "500", "why": "Satu worker melayani banyak request concurrent; bukan 1:1 dengan rps."},
          ],
        },
        {
          "q": "Latency p99 naik tapi rata-rata tetap. Artinya?",
          "options": [
            {"text": "Tidak ada masalah", "why": "p99 naik = 1% pengguna mengalami keburukan yang makin parah."},
            {"text": "Ekor distribusi memburuk — investigasi", "why": "Tepat: rata-rata menyembunyikan penderitaan 1% pengguna; p99 adalah metrik SLO yang benar.", "correct": True},
            {"text": "Tambah worker segera", "why": "Belum tentu kapasitas; bisa jadi satu query lambat atau GC pause."},
            {"text": "Rata-rata lebih penting", "why": "Untuk SLO, persentil (p99) lebih jujur daripada rata-rata."},
          ],
        },
        {
          "q": "Fungsi utama shadow deployment?",
          "options": [
            {"text": "Mengurangi biaya", "why": "Shadow justru menambah compute (traffic ganda)."},
            {"text": "Menguji model baru dengan traffic produksi nyata tanpa memengaruhi pengguna", "why": "Tepat: validasi gratis terhadap data dunia nyata sebelum go-live.", "correct": True},
            {"text": "Mempercepat inference", "why": "Tidak berhubungan dengan kecepatan."},
            {"text": "Menggantikan unit test", "why": "Shadow adalah validasi tambahan, bukan pengganti test."},
          ],
        },
        {
          "q": "Model server mati 5 menit. Respons terbaik?",
          "options": [
            {"text": "Biarkan error 500 sampai diperbaiki", "why": "Pengguna kabur; tidak ada graceful degradation."},
            {"text": "Circuit breaker: fallback ke model sederhana/cache/default", "why": "Tepat: prediksi mediocre sementara > tidak ada prediksi sama sekali.", "correct": True},
            {"text": "Restart manual tiap kali", "why": "Tidak scalable dan lambat; butuh otomatisasi."},
            {"text": "Sembunyikan error dari monitoring", "why": "Menyembunyikan masalah = bom waktu yang lebih besar."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE6 ====================
mle6 = {
  "slug": "mle6-monitoring", "track": "Machine Learning Engineer",
  "module": "Serving & Operasi", "title": "MLE6 — Monitoring: Drift & Performance Decay", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Model yang sehat hari ini bisa sakit bulan depan — bukan karena kodenya berubah, melainkan karena dunianya berubah. Lesson ini tentang mendeteksi perubahan itu sebelum merugikan.",
        "Tujuan lesson ini:",
        "• Membedakan data drift, concept drift, dan label drift.",
        "• Menghitung Population Stability Index (PSI) dari nol dan membaca ambangnya.",
        "• Membedakan alarm yang bermakna dari noise (mencegah alert fatigue).",
        "• Merancang dashboard monitoring: apa yang dimonitor di input, output, dan performa.",
        "• Memutuskan kapan me-retrain, kapan investigasi, kapan tidak ngapa-ngapain.",
        "Isi lesson: cerita model yang 'sehat' tapi revenue turun → 3 jenis drift + lab PSI → alarm vs noise + lab → apa yang dimonitor → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model yang sehat, revenue yang turun",
      "prose": [
        "Model prediksi churn sebuah telco 'sehat': akurasi validasi 86%, tidak ada error di log, dashboard hijau semua. Namun revenue turun 9% dalam dua kuartal.",
        "Tim me-retrain model tiga kali dengan data terbaru. Hasilnya: akurasi naik 1 poin, revenue tetap turun. Frustrasi memuncak — sampai seorang analis junior memplot distribusi umur pelanggan.",
        "Twist-nya: distribusi umur bergeser drastis — pandemi mengubah komposisi pelanggan (lebih banyak pelanggan muda digital), tetapi model dilatih di era pelanggan lama. Modelnya tidak rusak; DUNIA-nya yang berubah. Tiga kali retrain sia-sia karena yang dibutuhkan bukan model baru, melainkan pemahaman bahwa perilaku segmen baru berbeda.",
        "Pelajaran: monitoring model BUKAN monitoring akurasi saja. Distribusi input adalah sistem peringatan dini — ia bergeser BERBULAN-BULAN sebelum akurasi ikut jatuh.",
      ],
      "note": {
        "title": "🚨 Mitos: 'monitoring model = pantau akurasi'",
        "type": "pitfall",
        "body": "Yang benar: label aktual (untuk hitung akurasi) sering datang berminggu-minggu terlambat (mis. default kredit butuh 90 hari). Menunggu akurasi = menunggu kerugian. Pantau distribusi input/output — ia tersedia detik ini juga.",
      },
      "tasks": [],
    },
    {
      "id": "drift", "eyebrow": "Langkah 3 · Tiga jenis drift",
      "title": "Data drift, concept drift, label drift",
      "prose": [
        "Data drift (covariate shift): distribusi INPUT berubah, hubungan input→label tetap. Contoh: rata-rata umur pelanggan 35 → 28. Model masih 'benar' secara logika, tetapi beroperasi di wilayah data yang jarang ia lihat saat training.",
        "Concept drift: hubungan INPUT→LABEL berubah. Contoh: pola 'pelanggan muda = loyal' berbalik setelah kompetitor meluncurkan paket murah. Ini yang paling berbahaya — model confidently wrong.",
        "Label drift: distribusi LABEL berubah. Contoh: baseline fraud naik dari 0,7% ke 2% saat serangan terkoordinasi. Threshold yang dikalibrasi untuk 0,7% menjadi tidak optimal.",
        "Population Stability Index (PSI) mengukur data drift per fitur: bandingkan % per bin antara training (expected) dan serving (actual). Ambang industri: < 0,1 stabil; 0,1–0,25 waspada; > 0,25 pergeseran signifikan.",
        "Lab: distribusi umur bergeser (mean bin 4,5 → 5,5), PSI = 0,153 → 'waspada'. Belum darurat, tetapi wajib investigasi — inilah peringatan dini yang menyelamatkan revenue di cerita pembuka.",
      ],
      "formula": "\\text{PSI} = \\sum_{b} (\\%Aktual_b - \\%Ekspektasi_b)\\,\\ln\\frac{\\%Aktual_b}{\\%Ekspektasi_b}",
      "figure": {
        "svg": bars_svg([("b3 tr", 12), ("b3 sv", 7.0), ("b4 tr", 15), ("b4 sv", 13.0), ("b5 tr", 18), ("b5 sv", 15.8), ("b6 tr", 15), ("b6 sv", 16.1), ("b7 tr", 12), ("b7 sv", 17.6)], title="% sampel per bin usia: training vs serving", colors=[C1, C2]),
        "alt": "Bar chart: per bin usia, % training vs % serving bergeser ke kanan.",
        "caption": "Cara membaca: tiap pasangan batang = % sampel pada satu bin usia (tr=training, sv=serving). Interpretasi: massa bergeser ke bin kanan — serving menumpuk di usia lebih tua. PSI merangkum seluruh pergeseran ini menjadi satu angka: 0,153 (waspada).",
      },
      "tasks": [
        {"id": "t1", "text": "Bangun distribusi `actual` (proporsi) dari 2000 sampel serving"},
        {"id": "t2", "text": "Hitung `psi` dan tentukan `verdict` (ambang 0.1 / 0.25)"},
        {"id": "t3", "text": "Cetak psi dan verdict"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: PSI adalah termometer, bukan diagnosis",
        "body": "PSI bilang 'ada yang bergeser', bukan 'apa yang salah'. PSI 0,3 pada fitur 'kode promo' mungkin wajar (kampanye baru); PSI 0,3 pada 'umur' mungkin krisis. Selalu interpretasikan dengan konteks bisnis.",
      },
      "hints": [
        "actual = [c/2000 for c in actual_counts] — proporsi, bukan persen!",
        "psi += (a - e) * math.log(a/e), lewati bin dengan a=0 atau e=0.",
        "verdict: >0.25 'drift', >0.1 'waspada', else 'stabil'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random, math\n"
          "random.seed(21)\n"
          "expected = [0.05,0.08,0.12,0.15,0.18,0.15,0.12,0.08,0.05,0.02]\n"
          "actual_counts = [0]*10\n"
          "for _ in range(2000):\n"
          "    b = min(9, max(0, int(random.gauss(5.5, 2.2))))\n"
          "    actual_counts[b] += 1\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "actual = \n"
          "psi = 0.0\n"
          "for a, e in zip(actual, expected):\n"
          "    if a > 0 and e > 0:\n"
          "        psi += \n"
          "verdict = \n"
          "\n"
          "print(f\"psi={psi:.3f}  verdict={verdict}\")"
        ),
        "lockLines": 9,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random, math\n"
          "random.seed(21)\n"
          "expected = [0.05,0.08,0.12,0.15,0.18,0.15,0.12,0.08,0.05,0.02]\n"
          "actual_counts = [0]*10\n"
          "for _ in range(2000):\n"
          "    b = min(9, max(0, int(random.gauss(5.5, 2.2))))\n"
          "    actual_counts[b] += 1\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "actual = [c/2000 for c in actual_counts]\n"
          "psi = 0.0\n"
          "for a, e in zip(actual, expected):\n"
          "    if a > 0 and e > 0:\n"
          "        psi += (a - e) * math.log(a/e)\n"
          "verdict = \"drift\" if psi > 0.25 else (\"waspada\" if psi > 0.1 else \"stabil\")\n"
          "\n"
          "print(f\"psi={psi:.3f}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "psi", "value": 0.153, "tol": 0.005, "label": "`psi` ≈ 0.153", "msg": "PSI dalam proporsi (0-1). 0.153 = zona waspada."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=waspada", "label": "`print` memvonis waspada", "msg": "0.1 < 0.153 < 0.25 → 'waspada'."},
        ],
      },
      "reference": "math.log = ln (natural log). PSI memakai proporsi, bukan persen.",
    },
    {
      "id": "alarm", "eyebrow": "Langkah 4 · Alarm vs noise",
      "title": "Sembilan alarm palsu vs dua alarm yang benar",
      "prose": [
        "Monitoring tanpa disiplin alarm menghasilkan alert fatigue: tim menerima 50 notifikasi sehari, semuanya diabaikan — termasuk yang benar. Alarm yang selalu diabaikan sama dengan tidak ada alarm.",
        "Teknik anti-noise: (1) smoothing — alarm hanya jika rata-rata 3 hari melewati ambang, bukan satu titik; (2) multi-window — cek anomali 1 jam DAN 1 hari (spike sesaat vs tren); (3) deadband — butuh 2 pelanggaran berurutan sebelum berbunyi.",
        "Lab: metrik akurasi harian 30 hari dengan 1 degradasi nyata (hari 20–22). Alarm naif (tiap titik < 0,775) berbunyi 9 kali — 7 di antaranya noise. Alarm dengan smoothing 3-hari berbunyi 2 kali — tepat pada degradasi nyata.",
        "Cara membaca: alarm bukan tujuan; alarm adalah BIAYA perhatian. Setiap false alarm menggerogoti kepercayaan tim pada sistem monitoring.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `naive`: jumlah hari dengan metrik < 0.775"},
        {"id": "t2", "text": "Hitung `smooth`: rata-rata 3-hari, lalu hitung pelanggarannya"},
        {"id": "t3", "text": "Cetak keduanya dan `hemat` = naive - smooth"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'semakin sensitif alarm semakin aman'",
        "type": "pitfall",
        "body": "Yang benar: alarm hipersensitif dibunuh oleh manusia (di-mute). Keamanan datang dari alarm yang DIPERCAYA — sedikit, tajam, dan selalu ditindaklanjuti.",
      },
      "hints": [
        "naive = sum(1 for m in metric if m < 0.775).",
        "smooth = [sum(metric[i:i+3])/3 for i in range(28)].",
        "hemat = naive - smooth.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(30)\n"
          "metric = [0.80 + random.gauss(0, 0.02) for _ in range(30)]\n"
          "for i in (19, 20, 21):\n"
          "    metric[i] -= 0.05   # degradasi NYATA hari 20-22\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "naive = \n"
          "smooth = \n"
          "smooth_alarm = \n"
          "hemat = \n"
          "\n"
          "print(f\"alarm_naif={naive}  alarm_smooth={smooth_alarm}  hemat={hemat}\")"
        ),
        "lockLines": 7,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(30)\n"
          "metric = [0.80 + random.gauss(0, 0.02) for _ in range(30)]\n"
          "for i in (19, 20, 21):\n"
          "    metric[i] -= 0.05   # degradasi NYATA hari 20-22\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "naive = sum(1 for m in metric if m < 0.775)\n"
          "smooth = [sum(metric[i:i+3])/3 for i in range(28)]\n"
          "smooth_alarm = sum(1 for m in smooth if m < 0.775)\n"
          "hemat = naive - smooth_alarm\n"
          "\n"
          "print(f\"alarm_naif={naive}  alarm_smooth={smooth_alarm}  hemat={hemat}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "naive", "value": 9, "tol": 1e-9, "label": "`naive` = 9 alarm", "msg": "9 hari di bawah 0.775 — mayoritas noise."},
          {"kind": "equal", "task": "t2", "name": "smooth_alarm", "value": 2, "tol": 1e-9, "label": "`smooth_alarm` = 2", "msg": "Smoothing menyisakan 2 window — tepat pada degradasi nyata."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "hemat=7", "label": "`print` menampilkan penghematan", "msg": "9 − 2 = 7 false alarm dihemat."},
        ],
      },
      "reference": "Smoothing = rata-rata bergerak. Noise acak saling meniadakan; sinyal nyata bertahan.",
    },
    {
      "id": "apa", "eyebrow": "Langkah 5 · Apa yang dimonitor",
      "title": "Empat lapisan monitoring",
      "prose": [
        "Lapisan 1 — Input: distribusi fitur (PSI per fitur penting), missing rate, range violation, volume data. Ini peringatan dini tercepat.",
        "Lapisan 2 — Output: distribusi prediksi (apakah % 'fraud' tiba-tiba 10x lipat?), confidence rata-rata. Perubahan output tanpa perubahan input = sinyal concept drift.",
        "Lapisan 3 — Performa: akurasi/precision/recall begitu label tersedia; proxy metric sementara (mis. tingkat dispute pelanggan). Ekspektasikan jeda label berminggu-minggu.",
        "Lapisan 4 — Infra: latency p99, error rate, throughput, biaya per prediksi. Model 'benar' yang lambat atau mahal tetap gagal.",
        "Golden rule: setiap lapisan punya owner dan runbook ('jika alarm X, lakukan Y dalam Z menit'). Alarm tanpa runbook = notifikasi kecemasan, bukan sistem.",
      ],
      "note": {
        "title": "💡 Intuisi: monitor seperti dokter UGD — triase dulu",
        "body": "Input = tanda vital (cepat, murah, selalu tersedia). Performa = lab darah (akurat, lambat, mahal). Dokter yang baik tidak menunggu hasil lab untuk memeriksa nadi.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Drift terdeteksi — sekarang apa?",
      "prose": [
        "Skenario 1 — PSI 0,15 pada satu fitur, performa stabil → investigasi ringan, catat, pantau mingguan. Alasan: waspada ≠ darurat; retrain buta membuang biaya.",
        "Skenario 2 — PSI > 0,25 pada banyak fitur + proxy metric turun → investigasi mendalam: apakah pergeseran legitimate (kampanye baru) atau data rusak (pipeline bug)? Alasan: retrain di atas data rusak = melestarikan bug.",
        "Skenario 3 — Concept drift terkonfirmasi (hubungan berubah) → retrain dengan data baru + validasi ulang penuh. Alasan: model lama secara struktural sudah salah.",
        "Skenario 4 — Drift musiman yang berulang (lebaran, akhir tahun) → JANGAN retrain panik; bangun model yang sadar musiman atau terima fluktuasi sebagai normal. Alasan: retrain tiap musim = overfit pada kalender.",
        "Aturan praktis 10 detik: (1) Apakah drift-nya legitimate atau bug? (2) Apakah performa ikut turun? (3) Apakah polanya permanen atau musiman? Jawaban menentukan: pantau / perbaiki data / retrain / terima.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Pinjol DanaKilat: PSI 0,31 di tengah malam",
      "prose": [
        "Jam 02.14, alarm berbunyi: PSI fitur `jumlah_pengajuan_7hari` = 0,31 (drift signifikan). Di saat yang sama, approval rate naik dari 34% ke 61% dalam 6 jam.",
        "Investigasi pagi harinya: bukan perubahan perilaku nasabah — melainkan bug di API partner yang mengirim `jumlah_pengajuan_7hari = 0` untuk 40% request (field kosong di-default 0). Model membaca '0 pengajuan' sebagai 'nasabah sangat aman' dan meloloskan hampir semua.",
        "Kerugian 6 jam: 1.900 pengajuan berisiko tinggi lolos, estimasi eksposur Rp4,7 miliar. Jika alarm diabaikan (alert fatigue), kerugian berlanjut berhari-hari.",
        "Pertanyaan: (a) Ini drift jenis apa? (b) Lapisan monitoring mana yang menangkapnya pertama? (c) Perbaikan sistemik apa yang mencegah terulang?",
        "Pembahasan: (a) Data drift akibat BUG — distribusi input berubah bukan karena dunia berubah. (b) Lapisan input (PSI per fitur) + lapisan output (approval rate anomali) — keduanya tersedia real-time, jauh sebelum label default muncul 90 hari kemudian. (c) Data validation di serving (tolak/default yang benar untuk field kosong + alarm missing rate), contract test dengan partner API, dan runbook: 'PSI > 0,25 tengah malam → page on-call, bukan tunggu pagi'.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Data drift: input berubah; concept drift: hubungan berubah; label drift: baseline berubah.",
        "PSI: < 0,1 stabil; 0,1–0,25 waspada; > 0,25 drift signifikan.",
        "Pantau input/output (real-time) — jangan tunggu label (berminggu-minggu).",
        "Alarm butuh anti-noise: smoothing, multi-window, deadband.",
        "Alarm tanpa runbook dan owner = notifikasi kecemasan.",
        "Retrain hanya setelah memastikan drift legitimate, bukan bug data.",
      ],
      "next": {"label": "MLE7 — Testing untuk ML", "href": "/v2/learn/mle7-testing"},
      "quiz": [
        {
          "q": "Rata-rata umur pelanggan 35 → 28, tetapi hubungan umur→churn tetap. Ini…",
          "options": [
            {"text": "Concept drift", "why": "Concept drift = hubungannya yang berubah; di sini hubungannya tetap."},
            {"text": "Data drift", "why": "Tepat: distribusi input berubah, hubungan input→label tetap.", "correct": True},
            {"text": "Label drift", "why": "Label drift = distribusi label yang berubah."},
            {"text": "Tidak ada drift", "why": "Distribusinya jelas bergeser — itu drift."},
          ],
        },
        {
          "q": "PSI = 0,31 pada fitur penting. Tindakan pertama?",
          "options": [
            {"text": "Langsung retrain model", "why": "Retrain di atas data yang mungkin rusak = melestarikan bug."},
            {"text": "Investigasi: pergeseran legitimate atau bug data?", "why": "Tepat: penyebab menentukan obat — bug diperbaiki, pergeseran legitimate baru dipertimbangkan retrain.", "correct": True},
            {"text": "Abaikan, nanti juga kembali", "why": "0,31 adalah drift signifikan; mengabaikan = mini-case DanaKilat."},
            {"text": "Matikan model", "why": "Terlalu drastis sebelum tahu penyebabnya; cek dulu."},
          ],
        },
        {
          "q": "Kenapa akurasi bukan metrik monitoring utama?",
          "options": [
            {"text": "Akurasi tidak penting", "why": "Akurasi penting, tetapi labelnya datang terlambat berminggu-minggu."},
            {"text": "Label aktual datang terlambat; distribusi input tersedia real-time", "why": "Tepat: menunggu label = menunggu kerugian. Input adalah peringatan dini.", "correct": True},
            {"text": "Akurasi sulit dihitung", "why": "Bukan soal sulit, melainkan soal waktu ketersediaan label."},
            {"text": "Drift tidak memengaruhi akurasi", "why": "Drift justru sering mendahului penurunan akurasi."},
          ],
        },
        {
          "q": "Alarm berbunyi 50x sehari dan semuanya diabaikan tim. Diagnosis?",
          "options": [
            {"text": "Tim malas", "why": "Menyalahkan manusia mengabaikan desain sistem yang buruk."},
            {"text": "Alert fatigue — alarm butuh anti-noise (smoothing, deadband)", "why": "Tepat: alarm yang tak dipercaya = tak ada alarm. Kurangi noise, naikkan kepercayaan.", "correct": True},
            {"text": "Butuh lebih banyak alarm", "why": "Menambah alarm memperparah fatigue."},
            {"text": "Monitoring tidak berguna", "why": "Monitoringnya berguna; desain alarmnya yang gagal."},
          ],
        },
        {
          "q": "Approval rate naik 34% → 61% dalam 6 jam tanpa perubahan model. Sinyal apa?",
          "options": [
            {"text": "Model makin pintar", "why": "Model tidak berubah — yang berubah adalah input atau dunia."},
            {"text": "Anomali output — investigasi distribusi input segera", "why": "Tepat: perubahan output mendadak tanpa perubahan model = sinyal kuat masalah input.", "correct": True},
            {"text": "Keberuntungan", "why": "Lompatan 27 poin dalam 6 jam bukan keberuntungan."},
            {"text": "Butuh retrain", "why": "Investigasi dulu — bisa jadi bug data seperti kasus DanaKilat."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE7 ====================
mle7 = {
  "slug": "mle7-testing", "track": "Machine Learning Engineer",
  "module": "Serving & Operasi", "title": "MLE7 — Testing untuk ML", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Software biasa diuji dengan 'input X → output Y'. ML menambah dimensi: data bisa salah, model bisa 'benar secara kode tetapi salah secara makna'. Lesson ini membangun jaring pengaman berlapis.",
        "Tujuan lesson ini:",
        "• Menjelaskan piramida testing ML: data, pipeline, model, sistem.",
        "• Menulis data validation checks (skema, range, missing) dari nol.",
        "• Menguji invariant model (monotonisitas) dan metamorphic testing.",
        "• Membedakan testing offline vs shadow/canary di produksi.",
        "• Memutuskan test apa yang wajib untuk 4 skenario risiko berbeda.",
        "Isi lesson: cerita pipeline hijau yang memprediksi nol → piramida testing + lab validasi data → invariant + lab monotonisitas → test di produksi → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Pipeline hijau yang memprediksi nol untuk semua orang",
      "prose": [
        "CI sebuah fintech hijau semua: 120 unit test lolos. Deploy berjalan mulus. Tiga hari kemudian, tim risiko menemukan model credit scoring memprediksi skor 0 — untuk SEMUA pengajuan. 4.200 keputusan dibuat berdasarkan angka nol.",
        "Twist-nya: semua test hanya memeriksa 'apakah kode berjalan tanpa error'. Tidak satu pun memeriksa 'apakah outputnya masuk akal'. Bug-nya sepele: perubahan nama kolom membuat feature engineering menghasilkan NaN, dan NaN di-cast menjadi 0 diam-diam. Kode 'berhasil' — hasilnya sampah.",
        "Inilah perbedaan testing ML vs software biasa: di ML, kegagalan paling mahal bukan crash (yang berisik dan cepat ketahuan), melainkan silent failure — sistem berjalan sempurna sambil menghasilkan keputusan salah.",
        "Pelajaran: test untuk ML harus menguji TIGA hal: kode (seperti biasa), data (apakah input waras?), dan perilaku model (apakah output masuk akal?).",
      ],
      "note": {
        "title": "🚨 Mitos: 'CI hijau = aman deploy'",
        "type": "pitfall",
        "body": "Yang benar: CI tradisional hanya menguji kode. Untuk ML, butuh lapisan tambahan: validasi data, invariant model, dan evaluasi metrik dengan quality gate. Tanpa ketiganya, CI hijau adalah rasa aman yang palsu.",
      },
      "tasks": [],
    },
    {
      "id": "piramida", "eyebrow": "Langkah 3 · Piramida testing ML",
      "title": "Data, pipeline, model: tiga lapisan jaring",
      "prose": [
        "Lapisan 1 — Data validation: skema (kolom & tipe benar?), range (usia 17–70, bukan −5 atau 250), missing rate (< ambang), distribusi (tidak bergeser tiba-tiba). Dijalankan SETIAP batch data masuk — training maupun serving.",
        "Lapisan 2 — Pipeline test: unit test tiap fungsi transformasi dengan input-output yang diketahui; integration test end-to-end pipeline dengan data kecil; determinisme test (run 2x hasil sama).",
        "Lapisan 3 — Model test: invariant (properti yang HARUS selalu benar, mis. skor naik saat penghasilan naik), metamorphic (input yang diubah sedikit → output berubah sedikit), dan quality gate metrik (AUC ≥ 0,80).",
        "Aturan: test yang murah dan cepat (validasi data) dijalankan paling sering; test yang mahal (evaluasi penuh) di gate penting. Seperti asuransi berlapis — bukan satu test raksasa.",
        "Lab: validasi satu batch 500 pengajuan. Ditemukan: 2 usia di luar range, 1 gaji negatif, missing 0,2%. Verdict: GAGAL — batch ditolak sebelum menyentuh model.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `pelanggaran_usia`: usia di luar 17–70"},
        {"id": "t2", "text": "Hitung `gaji_negatif` dan `missing` (% gaji None)"},
        {"id": "t3", "text": "Tentukan `lolos` dan cetak semua hasil"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: validasi data adalah test termurah dengan ROI tertinggi",
        "body": "Satu fungsi 20 baris yang menolak batch anomali mencegah insiden Rp4,7 miliar seperti di MLE6. Tidak ada test lain yang semurah ini dengan dampak sebesar ini.",
      },
      "hints": [
        "pelanggaran = sum(1 for u in usia if not (17 <= u <= 70)).",
        "gaji None = missing; gaji < 0 (dan bukan None) = negatif.",
        "lolos = pelanggaran_usia==0 and gaji_negatif==0 and missing < 1.0.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(41)\n"
          "n = 500\n"
          "usia = [random.randint(17, 70) for _ in range(n)]\n"
          "tenor = [random.choice([6,12,24,36]) for _ in range(n)]\n"
          "gaji = [round(random.gauss(8, 3), 1) for _ in range(n)]\n"
          "usia[10] = -5; usia[20] = 250   # anomali suntikan\n"
          "gaji[30] = -100; gaji[40] = None\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: data validation\n"
          "pelanggaran_usia = \n"
          "gaji_negatif = \n"
          "missing = \n"
          "lolos = \n"
          "\n"
          "print(f\"pelanggaran_usia={pelanggaran_usia}  gaji_negatif={gaji_negatif}  missing={missing:.1f}%  lolos={lolos}\")"
        ),
        "lockLines": 10,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(41)\n"
          "n = 500\n"
          "usia = [random.randint(17, 70) for _ in range(n)]\n"
          "tenor = [random.choice([6,12,24,36]) for _ in range(n)]\n"
          "gaji = [round(random.gauss(8, 3), 1) for _ in range(n)]\n"
          "usia[10] = -5; usia[20] = 250   # anomali suntikan\n"
          "gaji[30] = -100; gaji[40] = None\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: data validation\n"
          "pelanggaran_usia = sum(1 for u in usia if not (17 <= u <= 70))\n"
          "gaji_negatif = sum(1 for g in gaji if g is not None and g < 0)\n"
          "missing = sum(1 for g in gaji if g is None) / n * 100\n"
          "lolos = pelanggaran_usia == 0 and gaji_negatif == 0 and missing < 1.0\n"
          "\n"
          "print(f\"pelanggaran_usia={pelanggaran_usia}  gaji_negatif={gaji_negatif}  missing={missing:.1f}%  lolos={lolos}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "pelanggaran_usia", "value": 2, "tol": 1e-9, "label": "`pelanggaran_usia` = 2", "msg": "Dua anomali suntikan: -5 dan 250."},
          {"kind": "equal", "task": "t2", "name": "gaji_negatif", "value": 1, "tol": 1e-9, "label": "`gaji_negatif` = 1", "msg": "Satu gaji -100 (None tidak dihitung negatif)."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "lolos=False", "label": "`print` memvonis GAGAL", "msg": "Ada pelanggaran → batch ditolak."},
        ],
      },
      "reference": "None menandai missing. Validasi selalu sebelum model melihat data.",
    },
    {
      "id": "invariant", "eyebrow": "Langkah 4 · Invariant model",
      "title": "Properti yang harus selalu benar",
      "prose": [
        "Invariant adalah janji perilaku: 'untuk input X yang lebih besar, output tidak boleh lebih kecil'. Contoh: skor kredit HARUS monoton naik terhadap penghasilan (ceteris paribus). Jika tidak, ada yang salah — entah bug fitur atau model belajar pola aneh.",
        "Metamorphic testing: hubungan antar output. 'Naikkan penghasilan 10% → skor tidak turun.' 'Duplikat data dengan nama berbeda → prediksi sama' (fairness check sederhana). Tidak butuh label — hanya butuh akal sehat domain.",
        "Lab: model skor dengan bug tersembunyi — di segmen penghasilan Rp40–50 juta, skor ANJLOK 25 poin karena salah skala fitur. Test monotonisitas menangkap 1 pelanggaran tepat di perbatasan segmen. Tanpa test ini, bug hanya ketahuan dari komplain nasabah.",
        "Kunci: invariant ditulis oleh DOMAIN EXPERT, bukan oleh programmer model. Hanya orang yang paham bisnis yang tahu 'seharusnya' seperti apa.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `pelanggaran`: pasangan berurutan dengan skor turun"},
        {"id": "t2", "text": "Tentukan `verdict`: 'GAGAL' jika ada pelanggaran"},
        {"id": "t3", "text": "Cetak keduanya"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'model sudah divalidasi metriknya, tidak perlu test perilaku'",
        "type": "pitfall",
        "body": "Yang benar: metrik agregat (AUC 0,85) bisa menyembunyikan perilaku absurd di segmen kecil. Invariant menangkap 'model yang benar secara statistik tetapi salah secara akal sehat'.",
      },
      "hints": [
        "penghasilan = list(range(10, 81, 5)) — sudah terurut naik.",
        "Bandingkan skor(b) < skor(a) untuk pasangan berurutan.",
        "zip(penghasilan, penghasilan[1:]) untuk pasangan.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "def skor(penghasilan_jt):\n"
          "    s = 30 + penghasilan_jt * 1.5\n"
          "    if 40 <= penghasilan_jt <= 50:  # BUG: salah skala fitur di segmen ini\n"
          "        s = s - 25\n"
          "    return s\n"
          "penghasilan = list(range(10, 81, 5))\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: test monotonisitas\n"
          "pelanggaran = \n"
          "verdict = \n"
          "\n"
          "print(f\"pelanggaran_monotonik={pelanggaran}  verdict={verdict}\")"
        ),
        "lockLines": 7,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "def skor(penghasilan_jt):\n"
          "    s = 30 + penghasilan_jt * 1.5\n"
          "    if 40 <= penghasilan_jt <= 50:  # BUG: salah skala fitur di segmen ini\n"
          "        s = s - 25\n"
          "    return s\n"
          "penghasilan = list(range(10, 81, 5))\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: test monotonisitas\n"
          "pelanggaran = sum(1 for a, b in zip(penghasilan, penghasilan[1:]) if skor(b) < skor(a))\n"
          "verdict = \"GAGAL\" if pelanggaran > 0 else \"LOLOS\"\n"
          "\n"
          "print(f\"pelanggaran_monotonik={pelanggaran}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "pelanggaran", "value": 1, "tol": 1e-9, "label": "`pelanggaran` = 1", "msg": "Skor turun di transisi 35→40 juta (bug segmen)."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=GAGAL", "label": "`print` memvonis GAGAL", "msg": "1 pelanggaran → verdict GAGAL."},
        ],
      },
      "reference": "Invariant = properti domain yang selalu benar. Tulis sebelum model selesai.",
    },
    {
      "id": "produksi", "eyebrow": "Langkah 5 · Test di produksi",
      "title": "Shadow dan canary: test dengan dunia nyata",
      "prose": [
        "Test offline tidak pernah mencakup 100% realitas produksi. Dua teknik menutup celah: shadow deployment (model baru menerima salinan traffic, hasilnya dicatat tetapi tidak dipakai) dan canary (5% traffic nyata ke model baru, metrik dibandingkan).",
        "Yang diuji di produksi bukan akurasi — melainkan: latency p99, error rate, distribusi output, dan biaya. Model yang 'lebih akurat' tetapi 3x lebih lambat akan ketahuan di sini, bukan di notebook.",
        "Golden rule rilis: tidak ada model yang langsung 100% traffic. Bertahap: shadow → canary 5% → 25% → 100%, dengan kriteria promosi eksplisit di tiap tahap. Rollback harus satu tombol, bukan satu sprint.",
      ],
      "note": {
        "title": "💡 Intuisi: produksi adalah test terakhir yang tidak bisa dipalsukan",
        "body": "Data produksi selalu mengandung kejutan yang tidak ada di data historis. Perlakukan setiap rilis sebagai eksperimen — dengan hipotesis, metrik, dan kriteria berhenti yang jelas.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Test apa untuk risiko apa",
      "prose": [
        "Skenario 1 — Model rekomendasi konten (risiko rendah) → validasi data dasar + quality gate metrik. Alasan: kesalahan = rekomendasi kurang relevan, bukan kerugian finansial.",
        "Skenario 2 — Credit scoring (risiko finansial + regulasi) → semua lapisan: validasi data ketat, invariant monotonisitas, metamorphic, quality gate, shadow wajib. Alasan: satu bug = miliaran rupiah + temuan audit.",
        "Skenario 3 — Fraud real-time (risiko + latency) → ditambah load test dan chaos test (matikan satu worker — apakah sistem bertahan?). Alasan: fraud tidak menunggu sistem pulih.",
        "Skenario 4 — Model eksperimental internal → validasi data + smoke test. Alasan: jangan over-engineer test untuk model yang mungkin mati minggu depan; tetapi validasi data tetap wajib (murah).",
        "Aturan praktis 10 detik: kalikan probabilitas bug × biaya kegagalan. Hasil besar → test berlapis. Hasil kecil → validasi data + smoke test cukup.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Asuransi SehatQ: premi Rp0 untuk semua polis",
      "prose": [
        "Model pricing asuransi SehatQ lolos semua unit test dan deploy Jumat sore. Senin pagi: 312 polis terjual dengan premi Rp0. Kerugian langsung Rp187 juta sebelum sistem dimatikan.",
        "Root cause: kolom `usia` tertukar dengan `kode_pos` di pipeline (keduanya integer). Model menerima kode pos 10110 sebagai 'usia', feature engineering me-cap di 100, dan formula premi menghasilkan 0 untuk 'usia' ekstrem. Tidak ada test yang memeriksa 'apakah premi dalam range wajar?'",
        "Pertanyaan: (a) Lapisan test mana yang seharusnya menangkap ini? (b) Tulis invariant-nya dalam satu kalimat. (c) Kenapa unit test tidak menangkapnya?",
        "Pembahasan: (a) Data validation (range usia 0–120 akan menolak 10110) DAN invariant model ('premi per polis ∈ [Rp50rb, Rp50jt]'). Dua lapisan, dua-duanya absen. (b) 'Premi yang dihasilkan model harus dalam [batas_bawah, batas_atas] yang ditentukan aktuaria.' (c) Unit test menguji fungsi dengan input BENAR; bug ini adalah input SALAH yang lolos — ranah validasi data dan invariant, bukan unit test.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Kegagalan termahal ML adalah silent failure — kode jalan, hasil salah.",
        "Tiga lapisan: validasi data, test pipeline, invariant + quality gate model.",
        "Validasi data (skema, range, missing) = test termurah ROI tertinggi.",
        "Invariant ditulis domain expert: properti yang HARUS selalu benar.",
        "Shadow/canary menguji dengan realitas produksi sebelum 100% traffic.",
        "Tingkat testing mengikuti risiko: biaya kegagalan × probabilitas bug.",
      ],
      "next": {"label": "MLE8 — Versioning: Data, Model, Code", "href": "/v2/learn/mle8-versioning"},
      "quiz": [
        {
          "q": "CI hijau, tetapi model memprediksi 0 untuk semua. Pelajaran utama?",
          "options": [
            {"text": "Tambah lebih banyak unit test", "why": "Unit test sudah 120 dan hijau — masalahnya bukan jumlah, melainkan jenis test."},
            {"text": "Test harus mencakup data dan perilaku model, bukan cuma kode", "why": "Tepat: silent failure hanya tertangkap validasi data + invariant output.", "correct": True},
            {"text": "Jangan deploy Jumat sore", "why": "Waktu deploy bukan akar masalahnya."},
            {"text": "Modelnya terlalu sederhana", "why": "Kompleksitas model tidak relevan dengan bug pipeline."},
          ],
        },
        {
          "q": "Batch 500 pengajuan: 2 usia invalid, 1 gaji negatif. Keputusan?",
          "options": [
            {"text": "Loloskan, cuma 3 dari 500", "why": "3 anomali bisa jadi gejala bug sistemik; validasi ada untuk ditaati."},
            {"text": "Tolak batch, investigasi sumber anomali", "why": "Tepat: quality gate data melindungi semua tahap berikutnya.", "correct": True},
            {"text": "Hapus 3 baris diam-diam", "why": "Menghapus tanpa investigasi menyembunyikan kemungkinan bug pipeline."},
            {"text": "Naikkan ambang toleransi", "why": "Mengubah ambang agar lolos = menonaktifkan pengaman."},
          ],
        },
        {
          "q": "Skor kredit turun saat penghasilan naik (ceteris paribus). Ini melanggar…",
          "options": [
            {"text": "Unit test", "why": "Unit test menguji fungsi, bukan properti domain."},
            {"text": "Invariant monotonisitas", "why": "Tepat: properti domain yang harus selalu benar.", "correct": True},
            {"text": "Akurasi", "why": "Akurasi agregat bisa tetap tinggi meski invariant dilanggar di segmen kecil."},
            {"text": "Latency SLO", "why": "Tidak berhubungan dengan kecepatan."},
          ],
        },
        {
          "q": "Fungsi shadow deployment yang paling tepat?",
          "options": [
            {"text": "Menggandakan throughput", "why": "Shadow menambah beban, bukan throughput untuk pengguna."},
            {"text": "Validasi model baru dengan traffic produksi tanpa risiko pengguna", "why": "Tepat: data nyata, dampak nol.", "correct": True},
            {"text": "Backup database", "why": "Tidak berhubungan."},
            {"text": "Mengurangi biaya training", "why": "Shadow adalah biaya serving tambahan."},
          ],
        },
        {
          "q": "Premi Rp0 untuk 312 polis lolos semua test. Test apa yang paling murah untuk mencegahnya?",
          "options": [
            {"text": "Load test 1 juta request", "why": "Mahal dan tidak menangkap logika premi yang salah."},
            {"text": "Invariant range: premi ∈ [batas aktuaria]", "why": "Tepat: satu baris check menolak output absurd sebelum merugikan.", "correct": True},
            {"text": "Test warna UI", "why": "Tidak relevan."},
            {"text": "Review kode manual tiap deploy", "why": "Tidak scalable dan tidak menangkap data tertukar."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE8 ====================
mle8 = {
  "slug": "mle8-versioning", "track": "Machine Learning Engineer",
  "module": "Serving & Operasi", "title": "MLE8 — Versioning: Data, Model, Code", "estMinutes": 50,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Git memversionkan kode. Tetapi model ML lahir dari TIGA hal: kode + data + config. Memversionkan satu tanpa dua lainnya = tidak bisa kembali ke masa lalu.",
        "Tujuan lesson ini:",
        "• Menjelaskan kenapa git saja tidak cukup untuk ML.",
        "• Memversionkan dataset dengan content hash.",
        "• Merancang model registry: staging, champion, archived.",
        "• Mencatat lineage lengkap: model ini dari data, kode, dan config apa.",
        "• Memutuskan strategi versioning untuk 4 skenario tim.",
        "Isi lesson: cerita model champion yang hilang → 3 kaki versioning + lab hash → registry & lineage + lab → time travel → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model champion yang tidak bisa ditemukan",
      "prose": [
        "Direktur risiko meminta model champion scoring — yang AUC-nya 0,87 bulan lalu — untuk dipresentasikan ke regulator. Tim data mencari di shared drive: `model_final.pkl`, `model_final_v2.pkl`, `model_final_FINAL.pkl`, `model_final_FINAL_beneran.pkl`. Empat file, tidak ada yang tahu mana yang dipakai bulan lalu.",
        "Twist yang lebih menyakitkan: kalaupun filenya ketemu, tidak ada yang tahu data training-nya yang mana — warehouse sudah di-update 3x sejak itu — dan kode trainingnya ada di notebook yang tidak pernah di-commit.",
        "Model tanpa lineage = artefak tanpa identitas. Kamu tidak bisa menjawab pertanyaan paling dasar audit: 'model ini dilatih dengan data apa, kode apa, parameter apa?'",
        "Pelajaran: versioning ML = versioning TIGA artefak (code, data, model) + hubungannya (lineage). Hilang satu = hilang semua.",
      ],
      "note": {
        "title": "🚨 Mitos: 'cukup commit kode ke git, data kan ada di warehouse'",
        "type": "pitfall",
        "body": "Yang benar: warehouse berubah setiap hari. 'Data ada di warehouse' tanpa versi = tidak bisa kembali ke data 3 bulan lalu. Data butuh identitas (hash/snapshot) sama seperti kode butuh commit hash.",
      },
      "tasks": [],
    },
    {
      "id": "tiga-kaki", "eyebrow": "Langkah 3 · Tiga kaki versioning",
      "title": "Code, data, model: ketiganya berversion",
      "prose": [
        "Kaki 1 — Code: git seperti biasa (commit hash = identitas). Notebook harus di-export/di-commit; 'notebook di laptop' = tidak berversion.",
        "Kaki 2 — Data: content hash (SHA-256 dari isi dataset) atau snapshot berversion (DVC, lakeFS, Delta Lake time travel). Prinsip: data_v1 ≠ data_v2 terdeteksi otomatis dari hash yang berbeda. Lab berikut membuktikannya: tambah 1 baris → hash berubah.",
        "Kaki 3 — Model: setiap artefak model berversion (v1, v2, ...) dan TIDAK PERNAH di-overwrite. `model.pkl` yang ditimpa = sejarah yang dihapus.",
        "Perekatnya — Lineage: catatan (model_v4 ← data_id fc084cce + code commit a3f9c1 + config_id 9d21bb). Dengan ini, pertanyaan audit terjawab dalam detik, bukan minggu.",
        "Cara membaca: hash 8 karakter cukup sebagai ID manusiawi; yang penting UNIK dan DETERMINISTIK — data sama → hash sama, selalu.",
      ],
      "formula": "\\text{lineage}(m) = (\\text{code\\_ver},\\; \\text{data\\_id},\\; \\text{config\\_id})",
      "tasks": [
        {"id": "t1", "text": "Tulis fungsi `dataset_id(rows)`: SHA-256 dari JSON canonical, 8 karakter"},
        {"id": "t2", "text": "Hitung `id1`, `id2` dan `berubah` = apakah hash berbeda"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: hash adalah sidik jari data",
        "body": "Kamu tidak perlu menyimpan 10 salinan dataset 50GB — cukup simpan hash + cara merekonstruksi (query + timestamp snapshot). Hash yang berbeda = data berbeda, tanpa perlu membandingkan isi.",
      },
      "hints": [
        "canonical = json.dumps(rows, sort_keys=True).",
        "hashlib.sha256(canonical.encode()).hexdigest()[:8].",
        "berubah = id1 != id2.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "import hashlib, json\n"
          "train_v1 = [{\"usia\": 30, \"gaji\": 8}, {\"usia\": 45, \"gaji\": 12}]\n"
          "train_v2 = [{\"usia\": 30, \"gaji\": 8}, {\"usia\": 45, \"gaji\": 12}, {\"usia\": 28, \"gaji\": 7}]\n"
          "\n"
          "# TULIS KODEMU\n"
          "def dataset_id(rows):\n"
          "    \n"
          "id1 = \n"
          "id2 = \n"
          "berubah = \n"
          "\n"
          "print(f\"data_v1={id1}  data_v2={id2}  berubah={berubah}\")"
        ),
        "lockLines": 4,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "import hashlib, json\n"
          "train_v1 = [{\"usia\": 30, \"gaji\": 8}, {\"usia\": 45, \"gaji\": 12}]\n"
          "train_v2 = [{\"usia\": 30, \"gaji\": 8}, {\"usia\": 45, \"gaji\": 12}, {\"usia\": 28, \"gaji\": 7}]\n"
          "\n"
          "# TULIS KODEMU\n"
          "def dataset_id(rows):\n"
          "    canonical = json.dumps(rows, sort_keys=True)\n"
          "    return hashlib.sha256(canonical.encode()).hexdigest()[:8]\n"
          "id1 = dataset_id(train_v1)\n"
          "id2 = dataset_id(train_v2)\n"
          "berubah = id1 != id2\n"
          "\n"
          "print(f\"data_v1={id1}  data_v2={id2}  berubah={berubah}\")"
        ),
        "checks": [
          {"kind": "defined", "task": "t1", "name": "dataset_id", "label": "`dataset_id` terdefinisi", "msg": "Definisikan fungsi dataset_id(rows)."},
          {"kind": "equal", "task": "t2", "name": "berubah", "value": True, "tol": 1e-9, "label": "`berubah` = True", "msg": "Satu baris tambahan mengubah hash — v1 ≠ v2 terdeteksi."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "berubah=True", "label": "`print` menampilkan hasil", "msg": "Format: data_v1=...  data_v2=...  berubah=True."},
        ],
      },
      "reference": "json.dumps(sort_keys=True) → canonical. SHA-256 → sidik jari unik.",
    },
    {
      "id": "registry", "eyebrow": "Langkah 4 · Model registry",
      "title": "Dari file acak ke registry: staging → champion",
      "prose": [
        "Model registry adalah 'app store' internal untuk model: setiap versi tercatat dengan metrik, lineage, status, dan siapa yang mempromosikannya. Status standar: staging (diuji) → champion/production (melayani) → archived (pensiun, tetapi tetap ada).",
        "Aturan promosi HARUS eksplisit dan otomatis: 'challenger naik jika AUC ≥ champion + 0,02 DAN PSI_max ≤ 0,25 DAN lolos semua invariant'. Tanpa aturan tertulis, promosi = opini orang yang paling vokal.",
        "Lab: challenger v4 (AUC 0,86) vs champion v3 (AUC 0,83). Kenaikan 0,03 memenuhi syarat — TETAPI psi_max 0,31 melanggar batas 0,25. Verdict: TETAP di staging. Model yang 'lebih akurat' tetapi berdiri di atas data yang bergeser = risiko.",
        "Champion yang digantikan tidak dihapus — di-archive. Rollback = mengembalikan status, bukan mencari file di recycle bin.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `naik` = selisih AUC challenger − champion"},
        {"id": "t2", "text": "Terapkan aturan promosi → `promote` (True/False) dan `alasan`"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'model dengan metrik tertinggi otomatis jadi champion'",
        "type": "pitfall",
        "body": "Yang benar: metrik offline hanyalah SATU syarat. Drift data, hasil invariant, latency, dan risiko bisnis ikut menentukan. Promosi buta metrik = mengundang insiden.",
      },
      "hints": [
        "naik = challenger['auc'] - champion['auc'].",
        "promote = naik >= 0.02 and challenger['psi_max'] <= 0.25.",
        "alasan menjelaskan syarat mana yang gagal.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "champion = {\"version\": \"v3\", \"auc\": 0.83, \"psi_max\": 0.08}\n"
          "challenger = {\"version\": \"v4\", \"auc\": 0.86, \"psi_max\": 0.31}\n"
          "\n"
          "# TULIS KODEMU: aturan promosi\n"
          "naik = \n"
          "promote = \n"
          "alasan = \n"
          "\n"
          "print(f\"auc_naik={naik:.2f}  promote={promote}  alasan={alasan}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "champion = {\"version\": \"v3\", \"auc\": 0.83, \"psi_max\": 0.08}\n"
          "challenger = {\"version\": \"v4\", \"auc\": 0.86, \"psi_max\": 0.31}\n"
          "\n"
          "# TULIS KODEMU: aturan promosi\n"
          "naik = challenger[\"auc\"] - champion[\"auc\"]\n"
          "promote = naik >= 0.02 and challenger[\"psi_max\"] <= 0.25\n"
          "alasan = \"psi_max 0.31 > 0.25\" if not promote else \"semua syarat lolos\"\n"
          "\n"
          "print(f\"auc_naik={naik:.2f}  promote={promote}  alasan={alasan}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "naik", "value": 0.03, "tol": 1e-9, "label": "`naik` = 0.03", "msg": "0.86 − 0.83 = 0.03 ≥ 0.02 (syarat metrik lolos)."},
          {"kind": "equal", "task": "t2", "name": "promote", "value": False, "tol": 1e-9, "label": "`promote` = False", "msg": "psi_max 0.31 > 0.25 → ditolak meski AUC naik."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "promote=False", "label": "`print` menampilkan verdict", "msg": "Format: auc_naik=...  promote=...  alasan=...."},
        ],
      },
      "reference": "Aturan promosi = quality gate. Tulis sebagai kode, bukan kesepakatan lisan.",
    },
    {
      "id": "timetravel", "eyebrow": "Langkah 5 · Time travel",
      "title": "Kemampuan kembali ke masa lalu",
      "prose": [
        "Ujian akhir versioning: 'bisakah kamu merekonstruksi PERSIS model yang melayani pada 14 Maret lalu?' Dengan tiga kaki + lineage, jawabannya ya: checkout code commit, restore data snapshot by ID, load config, retrain (atau load artefak berversion).",
        "Kegunaan praktis: debugging insiden ('model 14 Maret vs hari ini — apa yang berubah?'), audit regulator, dan perbandingan challenger yang adil (latih challenger di data yang SAMA dengan champion).",
        "Biaya: storage snapshot data. Strategi hemat: simpan hash + query rekonstruksi untuk data besar; snapshot penuh hanya untuk dataset kritis/audit.",
        "Tim yang tidak bisa time travel = tim yang debugging dengan tebakan. Setiap 'kayaknya sih datanya yang ini' adalah versi mahal dari tidak tahu.",
      ],
      "note": {
        "title": "💡 Intuisi: versioning dibayar di depan, dipakai saat krisis",
        "body": "Manfaat versioning tidak terasa saat semua lancar — ia terasa saat insiden jam 2 pagi dan kamu butuh jawaban dalam 10 menit, bukan 10 hari.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Strategi versioning per skala tim",
      "prose": [
        "Skenario 1 — Solo/2 orang, 1 model → git + hash dataset manual + folder model berversion (v1, v2, ...). Alasan: disiplin > tooling; yang penting tidak overwrite dan tercatat.",
        "Skenario 2 — Tim 5–10 orang, beberapa model → DVC/lakeFS untuk data + MLflow registry untuk model. Alasan: kolaborasi butuh single source of truth yang tidak bergantung pada ingatan.",
        "Skenario 3 — Enterprise teregulasi → semua di atas + immutable audit log (siapa mempromosikan apa, kapan) + retensi artefak sesuai regulasi. Alasan: 'tunjukkan buktinya' adalah pertanyaan rutin, bukan insiden.",
        "Skenario 4 — Riset eksploratif cepat → minimal: config + seed + hash data di tiap run (murah, otomatis). Alasan: eksperimen yang tidak tercatat = eksperimen yang tidak terjadi.",
        "Aturan praktis 10 detik: tanyakan 'jika saya cuti 3 bulan, bisakah orang lain me-reproduce model ini?' Jika jawabannya ragu-ragu, versioning-mu kurang.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "E-commerce: challenger menang, champion tetap",
      "prose": [
        "Challenger v7 mengalahkan champion v6: AUC 0,88 vs 0,84 (+0,04). Tim ingin langsung promosi. Registry check menemukan: v7 dilatih dengan data_id berbeda (ada 2 minggu data tambahan pasca kampanye besar), sedangkan v6 memakai data_id lama.",
        "Pertanyaan: (a) Apakah perbandingan ini adil? (b) Apa yang harus dilakukan sebelum promosi? (c) Keputusan promosi yang benar?",
        "Pembahasan: (a) Tidak adil — seperti membandingkan pelari dengan lintasan berbeda. Kenaikan AUC bisa berasal dari data baru, bukan model lebih baik. (b) Latih ulang v6 (arsitektur lama) di data_id yang SAMA dengan v7 — bandingkan apel dengan apel. (c) Jika setelah itu v7 tetap menang + lolos drift gate + invariant → promosi. Jika tidak → v7 tetap staging. Inilah kenapa lineage bukan birokrasi: ia membuat perbandingan JUJUR menjadi mungkin.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Git saja tidak cukup: model = code + data + config, ketiganya berversion.",
        "Data versioning via content hash / snapshot — 'ada di warehouse' bukan versi.",
        "Model tidak pernah di-overwrite; registry: staging → champion → archived.",
        "Aturan promosi eksplisit: metrik + drift + invariant, bukan opini.",
        "Lineage = (code_ver, data_id, config_id): jawaban audit dalam detik.",
        "Ujian akhir: bisakah time travel ke model 3 bulan lalu?",
      ],
      "next": {"label": "MLE9 — CI/CD untuk ML", "href": "/v2/learn/mle9-cicd"},
      "quiz": [
        {
          "q": "Empat file model_final*.pkl, tidak jelas mana yang produksi. Akar masalah?",
          "options": [
            {"text": "Kurang storage", "why": "Masalahnya identitas, bukan kapasitas."},
            {"text": "Tidak ada model registry + versioning", "why": "Tepat: tanpa registry, 'mana yang produksi' = tebak-tebakan.", "correct": True},
            {"text": "Nama file kurang kreatif", "why": "Penamaan bukan solusi sistemik."},
            {"text": "Python versi lama", "why": "Tidak berhubungan."},
          ],
        },
        {
          "q": "Dataset ditambah 1 baris, hash SHA-256 berubah. Artinya?",
          "options": [
            {"text": "Hash rusak", "why": "Justru itu sifat hash yang benar: sensitif terhadap perubahan apa pun."},
            {"text": "Perubahan data terdeteksi otomatis — v1 ≠ v2", "why": "Tepat: inilah fungsi content hash sebagai sidik jari.", "correct": True},
            {"text": "Data corrupt", "why": "Perubahan belum tentu corrupt; hash hanya bilang 'berbeda'."},
            {"text": "Harus ganti algoritma hash", "why": "SHA-256 bekerja persis seperti yang diharapkan."},
          ],
        },
        {
          "q": "Challenger AUC +0,03 tetapi psi_max 0,31 (> 0,25). Keputusan?",
          "options": [
            {"text": "Promosikan, AUC naik", "why": "Mengabaikan drift gate = promosi buta metrik."},
            {"text": "Tahan di staging, investigasi drift dulu", "why": "Tepat: aturan promosi eksplisit menolak — data bergeser signifikan.", "correct": True},
            {"text": "Hapus challenger", "why": "Challenger berharga sebagai kandidat; yang ditolak adalah promosinya, bukan eksistensinya."},
            {"text": "Turunkan ambang PSI", "why": "Mengubah ambang agar lolos = menonaktifkan pengaman."},
          ],
        },
        {
          "q": "Komponen lineage lengkap sebuah model adalah…",
          "options": [
            {"text": "Nama file model", "why": "Nama file bukan identitas yang dapat diverifikasi."},
            {"text": "(code_ver, data_id, config_id)", "why": "Tepat: ketiganya memungkinkan rekonstruksi penuh.", "correct": True},
            {"text": "Tanggal training", "why": "Tanggal tidak cukup untuk merekonstruksi."},
            {"text": "Nama data scientist", "why": "Orang bisa lupa/pindah; artefak harus mandiri."},
          ],
        },
        {
          "q": "Challenger dilatih di data 2 minggu lebih baru dari champion. Perbandingan AUC-nya…",
          "options": [
            {"text": "Adil, yang penting AUC lebih tinggi", "why": "Data berbeda = lintasan berbeda; kenaikan bisa dari data, bukan model."},
            {"text": "Tidak adil — latih ulang pembanding di data_id yang sama dulu", "why": "Tepat: apel vs apel membutuhkan data yang identik.", "correct": True},
            {"text": "Adil jika selisihnya besar", "why": "Besar-kecil tidak memperbaiki ketidakadilan perbandingan."},
            {"text": "Tidak penting, langsung promosikan", "why": "Promosi buta = mengundang insiden."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE9 ====================
mle9 = {
  "slug": "mle9-cicd", "track": "Machine Learning Engineer",
  "module": "Serving & Operasi", "title": "MLE9 — CI/CD untuk ML", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Model yang di-retrain manual 'tiap Jumat' akan basi — karena Jumat ada cuti, ada insiden, ada lupa. Lesson ini mengotomatiskan siklus hidup model.",
        "Tujuan lesson ini:",
        "• Menjelaskan perbedaan CI/CD software vs ML (data dan model ikut pipeline).",
        "• Merancang training pipeline: dari trigger hingga artefak berversion.",
        "• Menulis quality gate: syarat otomatis lolos/tahan/deploy.",
        "• Menganalisis hasil canary untuk keputusan promosi/rollback.",
        "• Memutuskan trigger retraining untuk 4 skenario.",
        "Isi lesson: cerita model basi 3 bulan → CI untuk ML + lab quality gate → CD & canary + lab → trigger retraining → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model yang basi 3 bulan karena menunggu 'Jumat'",
      "prose": [
        "Sebuah P2P lending punya SOP: retrain model scoring tiap Jumat sore. Tiga bulan berjalan lancar. Lalu datang bulan puasa: tim cuti bergantian, Jumat terlewat sekali, dua kali — dan tidak ada yang sadar model sudah basi 3 bulan.",
        "Twist-nya: bukan orangnya yang lalai — sistemnya yang dirancang bergantung pada ingatan manusia. Setiap langkah manual (tarik data, cek kualitas, training, validasi, deploy) adalah titik di mana proses bisa berhenti diam-diam.",
        "Selama 3 bulan itu, NPL naik 1,8 poin. Tidak ada yang menghubungkan — sampai audit menemukan model memakai pola dari 5 bulan lalu.",
        "Pelajaran: training harus seperti detak jantung — otomatis, terjadwal, terpantau. CI/CD untuk ML = mengubah 'SOP Jumat' menjadi pipeline yang berjalan sendiri dan berteriak jika gagal.",
      ],
      "note": {
        "title": "🚨 Mitos: 'CI/CD untuk ML = CI/CD biasa + training di tengah'",
        "type": "pitfall",
        "body": "Yang benar: pipeline ML menguji DATA dan MODEL juga (bukan cuma kode), artefaknya termasuk dataset berversion, dan 'deploy' berarti promosi model di registry — bukan sekadar copy binary.",
      },
      "tasks": [],
    },
    {
      "id": "ci", "eyebrow": "Langkah 3 · CI untuk ML",
      "title": "Setiap perubahan diuji, setiap training tercatat",
      "prose": [
        "CI untuk ML terpicu oleh TIGA hal: perubahan kode, data baru masuk, atau jadwal (cron). Tiap trigger menjalankan: validasi data → unit test → training → evaluasi → quality gate.",
        "Quality gate adalah penjaga otomatis: kumpulan syarat yang HARUS lolos sebelum artefak boleh lanjut. Contoh: AUC ≥ 0,80; PSI_max ≤ 0,25; latency p99 ≤ 200ms; semua invariant lolos. Satu syarat gagal → pipeline berhenti dan memberi tahu manusia.",
        "Bedanya dengan CI software: training bisa makan waktu berjam-jam dan hasilnya STOKASTIK. Solusinya: seed terkunci (MLE3), perbandingan vs champion (bukan angka absolut buta), dan artefak selalu berversion meski gagal (untuk debugging).",
        "Lab: quality gate dengan 3 syarat. Hasil: AUC 0,84 ✓, PSI 0,18 ✓, latency 150ms ✓ → DEPLOY. Ubah satu angka di kepalamu: jika PSI 0,31 → DITAHAN.",
      ],
      "tasks": [
        {"id": "t1", "text": "Evaluasi tiap gate: `hasil` memenuhi `syarat`?"},
        {"id": "t2", "text": "Tentukan `keputusan`: 'DEPLOY' jika semua lolos"},
        {"id": "t3", "text": "Cetak status tiap gate dan keputusan"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: quality gate = checklist pilot sebelum takeoff",
        "body": "Pilot tidak 'merasa' pesawat siap — ia mencentang daftar. Quality gate mengubah penilaian subjektif ('kayaknya modelnya oke') menjadi keputusan objektif yang bisa diaudit.",
      },
      "hints": [
        "syarat: ('min', ambang) → hasil >= ambang; ('maks', ambang) → hasil <= ambang.",
        "Loop dict syarat, kumpulkan status tiap metrik.",
        "keputusan = 'DEPLOY' jika all(status.values()) else 'DITAHAN'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "hasil = {\"auc\": 0.84, \"psi_max\": 0.18, \"latency_p99\": 150}\n"
          "syarat = {\"auc\": (\"min\", 0.80), \"psi_max\": (\"maks\", 0.25), \"latency_p99\": (\"maks\", 200)}\n"
          "\n"
          "# TULIS KODEMU: evaluasi quality gate\n"
          "status = {}\n"
          "for metrik, (arah, ambang) in syarat.items():\n"
          "    \n"
          "keputusan = \n"
          "\n"
          "print(f\"status={status}  keputusan={keputusan}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "hasil = {\"auc\": 0.84, \"psi_max\": 0.18, \"latency_p99\": 150}\n"
          "syarat = {\"auc\": (\"min\", 0.80), \"psi_max\": (\"maks\", 0.25), \"latency_p99\": (\"maks\", 200)}\n"
          "\n"
          "# TULIS KODEMU: evaluasi quality gate\n"
          "status = {}\n"
          "for metrik, (arah, ambang) in syarat.items():\n"
          "    status[metrik] = hasil[metrik] >= ambang if arah == \"min\" else hasil[metrik] <= ambang\n"
          "keputusan = \"DEPLOY\" if all(status.values()) else \"DITAHAN\"\n"
          "\n"
          "print(f\"status={status}  keputusan={keputusan}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "keputusan", "value": "DEPLOY", "tol": 1e-9, "label": "`keputusan` = DEPLOY", "msg": "Semua gate lolos: 0.84≥0.80, 0.18≤0.25, 150≤200."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "keputusan=DEPLOY", "label": "`print` menampilkan keputusan", "msg": "Format: status={...}  keputusan=DEPLOY."},
        ],
      },
      "reference": "all() True jika semua True. Quality gate = if otomatis untuk deploy.",
    },
    {
      "id": "cd", "eyebrow": "Langkah 4 · CD dan canary",
      "title": "Deploy bertahap: 5% dulu, bukan 100% langsung",
      "prose": [
        "CD untuk ML: artefak yang lolos gate dipromosikan di registry (staging → production), lalu traffic dialihkan bertahap: 5% → 25% → 100%. Tiap tahap: bandingkan metrik canary vs control (champion).",
        "Aturan analisis canary: error rate canary ≤ 1,5× control DAN latency p99 dalam SLO → lanjut. Jika tidak → rollback otomatis. Tidak ada 'tunggu dulu, kayaknya oke' — keputusan oleh angka, bukan perasaan.",
        "Lab: control 10.000 request (error 1,2%) vs canary 500 request (error 2,4%). Batas: 1,5 × 1,2% = 1,8%. Canary 2,4% > 1,8% → ROLLBACK. Model 'lebih akurat di offline' gagal di dunia nyata — dan sistem menangkapnya dalam 500 request, bukan 500 ribu.",
        "Penting: canary butuh waktu cukup untuk signifikansi. 500 request dengan base rate 1,2% = ~6 error ekspektasi — cukup untuk sinyal, belum untuk kepastian. Aturan praktis: minimum ratusan sampel per varian.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `err_control` dan `err_canary` (%)"},
        {"id": "t2", "text": "Terapkan aturan: canary ≤ 1.5× control → 'LANJUT', else 'ROLLBACK'"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'canary 5% = aman, tidak perlu dianalisis'",
        "type": "pitfall",
        "body": "Yang benar: canary tanpa analisis = eksperimen tanpa kesimpulan. 5% traffic yang tidak dibandingkan dengan control hanya memberi rasa aman palsu.",
      },
      "hints": [
        "err = error / n * 100.",
        "batas = 1.5 * err_control.",
        "keputusan = 'LANJUT' jika err_canary <= batas else 'ROLLBACK'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "control = {\"n\": 10000, \"error\": 120}\n"
          "canary = {\"n\": 500, \"error\": 12}\n"
          "\n"
          "# TULIS KODEMU: analisis canary\n"
          "err_control = \n"
          "err_canary = \n"
          "keputusan = \n"
          "\n"
          "print(f\"control={err_control:.1f}%  canary={err_canary:.1f}%  keputusan={keputusan}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "control = {\"n\": 10000, \"error\": 120}\n"
          "canary = {\"n\": 500, \"error\": 12}\n"
          "\n"
          "# TULIS KODEMU: analisis canary\n"
          "err_control = control[\"error\"] / control[\"n\"] * 100\n"
          "err_canary = canary[\"error\"] / canary[\"n\"] * 100\n"
          "keputusan = \"LANJUT\" if err_canary <= 1.5 * err_control else \"ROLLBACK\"\n"
          "\n"
          "print(f\"control={err_control:.1f}%  canary={err_canary:.1f}%  keputusan={keputusan}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "err_canary", "value": 2.4, "tol": 1e-9, "label": "`err_canary` = 2.4%", "msg": "12/500 × 100 = 2.4."},
          {"kind": "equal", "task": "t2", "name": "keputusan", "value": "ROLLBACK", "tol": 1e-9, "label": "`keputusan` = ROLLBACK", "msg": "2.4 > 1.5×1.2 = 1.8 → rollback otomatis."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "keputusan=ROLLBACK", "label": "`print` menampilkan keputusan", "msg": "Format: control=...%  canary=...%  keputusan=...."},
        ],
      },
      "reference": "Canary = eksperimen terkontrol di produksi. Keputusan oleh angka.",
    },
    {
      "id": "trigger", "eyebrow": "Langkah 5 · Trigger retraining",
      "title": "Kapan pipeline berjalan sendiri",
      "prose": [
        "Empat trigger retraining: (1) Jadwal — tiap minggu/bulan. Sederhana, tetapi buta terhadap kebutuhan. (2) Data baru — N sampel baru terkumpul. (3) Degradasi — metrik turun di bawah ambang. (4) Drift signifikan — PSI melewati batas.",
        "Praktik terbaik: kombinasikan. Jadwal sebagai jaring pengaman + trigger degradasi/drift sebagai respons cepat. 'Retrain tiap Senin, ATAU jika akurasi turun 2 poin, ATAU jika PSI > 0,25.'",
        "Yang sering dilupakan: retraining otomatis TETAP butuh quality gate. Pipeline yang me-retrain dan auto-deploy model buruk = otomatisasi bencana. Otomatisasi tanpa gate = mempercepat kegagalan.",
        "Biaya: tiap retraining = compute + risiko. Jangan retrain harian jika drift-nya mingguan — selaraskan frekuensi dengan kecepatan perubahan dunia.",
      ],
      "note": {
        "title": "💡 Intuisi: otomatisasi yang baik itu membosankan",
        "body": "Pipeline ideal: berjalan tiap minggu, lolos gate, deploy, dan tidak ada yang memperhatikan. Jika retraining selalu jadi 'acara', ada yang salah dengan desainnya.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Tingkat otomasi per konteks",
      "prose": [
        "Skenario 1 — Startup, 1 model, tim 3 orang → semi-otomatis: training terjadwal + notifikasi, deploy manual dengan 1 klik. Alasan: full-otomatis butuh investasi; manusia masih lebih murah untuk volume kecil.",
        "Skenario 2 — Scale-up, 20 model → full CI/CD: trigger otomatis + quality gate + canary + rollback otomatis. Alasan: 20 model × proses manual = tidak mungkin konsisten.",
        "Skenario 3 — Model teregulasi (kredit) → otomatisasi penuh TETAPI deploy butuh persetujuan manusia (human-in-the-loop). Alasan: regulator butuh akuntabilitas manusia pada keputusan promosi.",
        "Skenario 4 — Riset/eksperimen → pipeline training otomatis, tanpa CD. Alasan: eksperimen butuh kecepatan iterasi, bukan rilis aman.",
        "Aturan praktis 10 detik: (1) Berapa model? (2) Berapa biaya satu deploy manual yang gagal? (3) Apakah regulator menuntut jejak persetujuan? Jawaban menentukan tingkat otomasi.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Auto-deploy yang menyebarkan bug ke 2 juta pengguna",
      "prose": [
        "Sebuah aplikasi investasi membangun full CI/CD: retrain mingguan + auto-deploy jika AUC naik. Suatu Senin, AUC naik 0,02 — deploy otomatis jalan. Selasa pagi: 2 juta pengguna menerima rekomendasi portofolio yang kacau.",
        "Root cause: data weekend mengandung duplikat akibat bug ETL (satu transaksi tercatat 3x). AUC naik PALSU karena duplikat membuat validasi optimistis. Quality gate hanya memeriksa AUC — tidak ada validasi data di pipeline.",
        "Kerugian: rollback 6 jam, 340 ribu pengguna terdampak, biaya kompensasi Rp1,2 miliar.",
        "Pertanyaan: (a) Di mana rantai pertahanan jebol? (b) Gate apa yang akan menghentikannya? (c) Apakah auto-deploy yang salah, atau desainnya?",
        "Pembahasan: (a) Tidak ada validasi data di pipeline — bug ETL lolos ke training. (b) Data validation gate (duplikat rate, volume check: 'data weekend 3x lipat dari normal = tolak') + perbandingan distribusi train vs baseline. (c) Desainnya: auto-deploy tanpa validasi data dan tanpa canary bertahap. Otomatisasi mempercepat — termasuk mempercepat bencana. Pelajaran: kecepatan pipeline harus diimbangi ketebalan gate.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "CI/CD ML: trigger (kode/data/jadwal) → validasi → training → evaluasi → quality gate → promosi bertahap.",
        "Quality gate = syarat otomatis dan eksplisit; satu gagal = pipeline berhenti.",
        "Canary: bandingkan vs control dengan aturan angka; rollback otomatis jika gagal.",
        "Retraining otomatis TETAP butuh gate — otomatisasi tanpa gate = bencana cepat.",
        "Trigger: jadwal + degradasi + drift; frekuensi selaras dengan kecepatan dunia.",
        "Tingkat otomasi mengikuti skala dan regulasi; model teregulasi butuh human-in-the-loop.",
      ],
      "next": {"label": "MLE10 — Scaling: Distributed Training", "href": "/v2/learn/mle10-scaling"},
      "quiz": [
        {
          "q": "Perbedaan utama CI untuk ML vs CI software biasa?",
          "options": [
            {"text": "Tidak ada, sama saja", "why": "CI ML menguji data dan model juga, artefaknya termasuk dataset berversion."},
            {"text": "CI ML menguji data + model, artefak termasuk data berversion", "why": "Tepat: tiga artefak (code, data, model) semuanya masuk pipeline.", "correct": True},
            {"text": "CI ML tidak butuh test", "why": "Justru butuh LEBIH banyak lapisan test."},
            {"text": "CI ML hanya untuk deep learning", "why": "Berlaku untuk semua model ML yang diproduksi."},
          ],
        },
        {
          "q": "AUC naik 0,02 tetapi data mengandung duplikat 3x. Deploy?",
          "options": [
            {"text": "Deploy, AUC naik", "why": "Kenaikan palsu dari duplikat — metriknya bohong."},
            {"text": "Tahan — validasi data dulu, metrik dari data corrupt tidak valid", "why": "Tepat: gate data harus lolos sebelum gate metrik dipercaya.", "correct": True},
            {"text": "Deploy setengah traffic", "why": "Canary tidak memperbaiki data training yang corrupt."},
            {"text": "Naikkan threshold AUC", "why": "Ambang lebih tinggi tidak mendeteksi duplikat."},
          ],
        },
        {
          "q": "Canary error 2,4% vs control 1,2% (batas 1,5x). Keputusan?",
          "options": [
            {"text": "Lanjut, bedanya kecil", "why": "2,4 > 1,8 = melanggar aturan yang disepakati."},
            {"text": "ROLLBACK otomatis", "why": "Tepat: aturan angka ditegakkan tanpa negosiasi perasaan.", "correct": True},
            {"text": "Tunggu seminggu lagi", "why": "Menunggu = membiarkan 5% pengguna menderita tanpa keputusan."},
            {"text": "Naikkan batas jadi 2,5x", "why": "Mengubah aturan agar lolos = menonaktifkan pengaman."},
          ],
        },
        {
          "q": "Model teregulasi (kredit) dengan CI/CD penuh. Deploy sebaiknya…",
          "options": [
            {"text": "Full otomatis tanpa manusia", "why": "Regulator butuh akuntabilitas manusia pada keputusan promosi."},
            {"text": "Otomatis sampai staging, promosi butuh persetujuan manusia", "why": "Tepat: kecepatan otomasi + akuntabilitas human-in-the-loop.", "correct": True},
            {"text": "Manual semua", "why": "Membuang manfaat otomasi; yang manual hanya keputusan promosi."},
            {"text": "Tidak perlu CI/CD", "why": "Justru model teregulasi paling butuh jejak pipeline yang rapi."},
          ],
        },
        {
          "q": "Trigger retraining terbaik untuk model dengan drift musiman?",
          "options": [
            {"text": "Retrain harian", "why": "Boros dan berisiko overfit pada noise harian."},
            {"text": "Jadwal selaras musim + trigger degradasi/drift", "why": "Tepat: frekuensi mengikuti kecepatan perubahan dunia, bukan kalender buta.", "correct": True},
            {"text": "Tidak pernah retrain", "why": "Drift permanen tetap butuh adaptasi."},
            {"text": "Retrain tiap ada data baru 1 baris", "why": "Terlalu reaktif; noise memicu churn model."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE10 ====================
mle10 = {
  "slug": "mle10-scaling", "track": "Machine Learning Engineer",
  "module": "Skala & Tanggung Jawab", "title": "MLE10 — Scaling: Distributed Training", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Ketika satu GPU butuh 9 hari dan deadline-mu 2 hari, jawabannya adalah paralelisme. Tetapi 8 GPU tidak berarti 8x lebih cepat — lesson ini menjelaskan kenapa dan kapan scaling worth it.",
        "Tujuan lesson ini:",
        "• Menjelaskan data parallel vs model parallel.",
        "• Menghitung speedup teoritis dengan Hukum Amdahl.",
        "• Memodelkan overhead komunikasi dan menemukan jumlah GPU optimal.",
        "• Membedakan synchronous vs asynchronous SGD.",
        "• Memutuskan strategi scaling untuk 4 skenario.",
        "Isi lesson: cerita 8 GPU yang tidak 8x → paralelisme + lab Amdahl → overhead komunikasi + lab → sinkron vs asinkron → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Delapan GPU yang tidak 8x lebih cepat",
      "prose": [
        "Tim riset sebuah bank melatih model credit scoring pada 40 juta baris data. Satu GPU: 9 hari. Deadline direksi: 2 hari. Solusi yang tampak jelas: sewa 8 GPU — 9/8 = 1,1 hari. Selesai sebelum deadline, bukan?",
        "Hasilnya: 3,8 hari. Bukan 1,1. Tagihan 8 GPU × 3,8 hari = 2,7x lebih mahal dari estimasi, dan deadline tetap terlewat.",
        "Twist-nya: bottleneck bukan komputasi — melainkan KOMUNIKASI. Tiap GPU menghitung gradient-nya sendiri, lalu semua gradient harus disinkronkan (allreduce) sebelum lanjut. Semakin banyak GPU, semakin besar waktu yang habis untuk 'ngobrol' dibanding 'bekerja'.",
        "Pelajaran: scaling punya hukum fisika. Memahaminya mengubah keputusan dari 'tambah GPU sampai cukup' menjadi 'hitung dulu titik optimalnya'.",
      ],
      "note": {
        "title": "🚨 Mitos: 'n GPU = n kali lebih cepat'",
        "type": "pitfall",
        "body": "Yang benar: bagian sekuensial (baca data, sinkronisasi) tidak bisa diparalelkan. Hukum Amdahl memberi batas atas speedup — dan overhead komunikasi bisa membuat n besar JUSTRU lebih lambat.",
      },
      "tasks": [],
    },
    {
      "id": "paralel", "eyebrow": "Langkah 3 · Data vs model parallel",
      "title": "Dua cara membagi kerja",
      "prose": [
        "Data parallel: tiap GPU memegang SALINAN model penuh, tetapi data berbeda (batch dibagi). Setelah tiap batch, gradient dirata-ratakan (allreduce). Cocok untuk: model muat di 1 GPU, data sangat besar. Ini pola paling umum.",
        "Model parallel: MODEL-nya dibagi antar GPU (lapisan 1–10 di GPU-A, 11–20 di GPU-B). Cocok untuk: model raksasa yang tidak muat di 1 GPU (LLM). Lebih kompleks — aktivasi harus dikirim antar GPU tiap forward/backward.",
        "Hukum Amdahl: jika fraksi p dari pekerjaan bisa diparalelkan, speedup maksimal dengan n pekerja = 1/((1−p) + p/n). Dengan p = 0,9 dan n = 8: speedup = 4,71x — bukan 8x. Efisiensi: 58,8%.",
        "Interpretasi: 41% potensi hilang ke bagian sekuensial. Inilah 'pajak' paralelisme yang tidak bisa dihindari — sebelum menghitung overhead komunikasi.",
      ],
      "formula": "S(n) = \\frac{1}{(1-p) + p/n}",
      "figure": {
        "svg": bars_svg([("1 GPU", 1.0), ("2 GPU", 1.82), ("4 GPU", 3.08), ("8 GPU", 4.71)], title="Speedup teoritis (p=0,9, Hukum Amdahl)"),
        "alt": "Bar chart speedup: 1, 1.82, 3.08, 4.71 untuk 1, 2, 4, 8 GPU.",
        "caption": "Cara membaca: tinggi batang = speedup vs 1 GPU. Interpretasi: kenaikan melambat — dari 4 ke 8 GPU hanya menambah 1,6x speedup tetapi menggandakan biaya. Titik inilah ekonomi scaling mulai dipertanyakan.",
      },
      "tasks": [
        {"id": "t1", "text": "Tulis fungsi `speedup(n, p)` sesuai Hukum Amdahl"},
        {"id": "t2", "text": "Hitung `s8` (n=8, p=0.9) dan `efisiensi` (%)"},
        {"id": "t3", "text": "Cetak keduanya"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: cari p dulu sebelum sewa GPU",
        "body": "Ukur fraksi sekuensial kode-mu (profiling) SEBELUM scaling. Jika p = 0,5, speedup maksimal (n→∞) hanya 2x — sewa 100 GPU pun sia-sia. Optimasi sekuensial sering lebih murah dari tambah GPU.",
      },
      "hints": [
        "speedup = 1 / ((1 - p) + p / n).",
        "efisiensi = s8 / 8 * 100.",
        "f-string {x:.2f} untuk 2 desimal.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 1 baris berikut ===\n"
          "p = 0.9\n"
          "\n"
          "# TULIS KODEMU: Hukum Amdahl\n"
          "def speedup(n, p):\n"
          "    \n"
          "s8 = \n"
          "efisiensi = \n"
          "\n"
          "print(f\"speedup_8={s8:.2f}x  efisiensi={efisiensi:.1f}%\")"
        ),
        "lockLines": 2,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 1 baris berikut ===\n"
          "p = 0.9\n"
          "\n"
          "# TULIS KODEMU: Hukum Amdahl\n"
          "def speedup(n, p):\n"
          "    return 1 / ((1 - p) + p / n)\n"
          "s8 = speedup(8, p)\n"
          "efisiensi = s8 / 8 * 100\n"
          "\n"
          "print(f\"speedup_8={s8:.2f}x  efisiensi={efisiensi:.1f}%\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "s8", "value": 4.71, "tol": 0.01, "label": "`s8` ≈ 4.71x", "msg": "1/(0.1 + 0.9/8) = 4.71. Bukan 8x."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "efisiensi=58\\.8%", "label": "`print` menampilkan efisiensi", "msg": "4.71/8 × 100 = 58.8%."},
        ],
      },
      "reference": "Hukum Amdahl = batas atas teoritis. Realita selalu di bawahnya.",
    },
    {
      "id": "overhead", "eyebrow": "Langkah 4 · Overhead komunikasi",
      "title": "Ketika 8 GPU lebih lambat dari 4 GPU",
      "prose": [
        "Amdahl belum menghitung biaya 'ngobrol': tiap sinkronisasi gradient butuh waktu yang tumbuh dengan jumlah GPU. Model sederhana: waktu(n) = T1 × ((1−p) + p/n) + k×(n−1), dengan k = biaya komunikasi per GPU tambahan.",
        "Lab: training 216 jam (9 hari), p = 0,95, k = 8 jam. Hasil: 1 GPU = 216 jam; 2 = 123,4; 4 = 86,1; 8 = 92,5 jam. DELAPAN GPU LEBIH LAMBAT DARI EMPAT.",
        "Twist-nya: titik optimal bukan 'sebanyak mungkin', melainkan n* di mana turunan waktu = 0. Melewatinya = membayar lebih untuk hasil lebih buruk. Inilah yang terjadi di cerita pembuka.",
        "Solusi dunia nyata: gradient accumulation (sinkronisasi lebih jarang), kompresi gradient, topologi komunikasi efisien (ring allreduce), dan — paling sering dilupakan — perbesar batch agar rasio komputasi/komunikasi naik.",
      ],
      "tasks": [
        {"id": "t1", "text": "Tulis fungsi `waktu(n)`: Amdahl + overhead komunikasi"},
        {"id": "t2", "text": "Hitung waktu untuk n = 1, 2, 4, 8; tentukan `terbaik`"},
        {"id": "t3", "text": "Cetak waktu n=4, n=8, dan GPU terbaik"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'kalau lambat, tambah GPU lagi'",
        "type": "pitfall",
        "body": "Yang benar: di atas titik optimal, tambah GPU = tambah lambat + tambah mahal. Diagnosis dulu (profiling: berapa % waktu untuk komunikasi?) baru tambah hardware.",
      },
      "hints": [
        "waktu = T1*((1-p) + p/n) + k*(n-1).",
        "Hitung untuk [1,2,4,8], cari n dengan waktu minimum.",
        "min(range, key=...) atau loop manual.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 1 baris berikut ===\n"
          "T1, p, k = 216, 0.95, 8.0   # jam, fraksi paralel, overhead/GPU\n"
          "\n"
          "# TULIS KODEMU\n"
          "def waktu(n):\n"
          "    \n"
          "hasil = {n: waktu(n) for n in (1, 2, 4, 8)}\n"
          "terbaik = \n"
          "\n"
          "print(f\"waktu_4={hasil[4]:.1f}jam  waktu_8={hasil[8]:.1f}jam  terbaik={terbaik} GPU\")"
        ),
        "lockLines": 2,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 1 baris berikut ===\n"
          "T1, p, k = 216, 0.95, 8.0   # jam, fraksi paralel, overhead/GPU\n"
          "\n"
          "# TULIS KODEMU\n"
          "def waktu(n):\n"
          "    return T1 * ((1 - p) + p / n) + k * (n - 1)\n"
          "hasil = {n: waktu(n) for n in (1, 2, 4, 8)}\n"
          "terbaik = min(hasil, key=hasil.get)\n"
          "\n"
          "print(f\"waktu_4={hasil[4]:.1f}jam  waktu_8={hasil[8]:.1f}jam  terbaik={terbaik} GPU\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "terbaik", "value": 4, "tol": 1e-9, "label": "`terbaik` = 4 GPU", "msg": "waktu(4)=86.1 < waktu(8)=92.5. Titik optimal terlampaui di 8."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "waktu_8=92\\.5jam", "label": "`print` menampilkan perbandingan", "msg": "Format: waktu_4=...jam  waktu_8=...jam  terbaik=... GPU."},
        ],
      },
      "reference": "Overhead komunikasi tumbuh dengan n; komputasi menyusut dengan 1/n.",
    },
    {
      "id": "sgd", "eyebrow": "Langkah 5 · Sinkron vs asinkron",
      "title": "Staleness: harga kecepatan",
      "prose": [
        "Synchronous SGD: semua GPU sinkron tiap step — konsisten, tetapi GPU tercepat menunggu yang terlambat (straggler).",
        "Asynchronous SGD: tiap GPU update model global kapan pun selesai — tidak ada menunggu, tetapi gradient bisa basi (stale): dihitung dari bobot 10 step lalu. Staleness menambah noise dan bisa merusak konvergensi.",
        "Praktik modern: synchronous dengan optimasi (backup workers: abaikan straggler paling lambat) untuk kebanyakan kasus; asinkron hanya bila straggler sangat parah dan toleransi noise tinggi.",
        "Aturan: sinkron = benar tetapi kadang lambat; asinkron = cepat tetapi kadang salah arah. Pilih berdasarkan mana yang lebih mahal bagimu: waktu atau akurasi.",
      ],
      "note": {
        "title": "💡 Intuisi: distributed training = ekonomi, bukan cuma teknik",
        "body": "Setiap keputusan scaling adalah tradeoff uang vs waktu vs akurasi. Insinyur yang baik menghitung ketiganya sebelum menyewa cluster.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Strategi scaling per situasi",
      "prose": [
        "Skenario 1 — Model muat 1 GPU, data 40 juta baris, deadline ketat → data parallel multi-GPU, hitung n optimal dulu. Alasan: pola standar dengan ROI jelas.",
        "Skenario 2 — Model 70B parameter, tidak muat 1 GPU → model parallel / pipeline parallel. Alasan: tidak ada pilihan — modelnya memang tidak muat.",
        "Skenario 3 — Training 2 jam di 1 GPU, ingin 30 menit → JANGAN distributed; optimasi single-GPU dulu (mixed precision, batch lebih besar). Alasan: overhead distributed tidak sebanding untuk job kecil.",
        "Skenario 4 — Eksperimen banyak varian kecil → JANGAN 1 job besar; jalankan banyak job paralel (hyperparameter search). Alasan: paralelisme antar-eksperimen 100% efisien (tidak ada komunikasi).",
        "Aturan praktis 10 detik: (1) Apakah model muat 1 GPU? (2) Berapa p (fraksi paralel)? (3) Apakah job cukup besar untuk menutup overhead? Tidak → optimasi dulu.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "E-commerce: Rp180 juta untuk training yang bisa Rp45 juta",
      "prose": [
        "Tim e-commerce menyewa 16 GPU selama 10 hari (Rp180 juta) untuk training model rekomendasi. Hasil: selesai 6,5 hari — lebih cepat dari 9 hari estimasi 1 GPU, tetapi...",
        "Analisis pasca: p = 0,88 (banyak preprocessing sekuensial), overhead komunikasi tinggi. Perhitungan ulang: 4 GPU → 4,2 hari dengan biaya Rp45 juta. 16 GPU → 6,5 hari?? — tunggu, kenapa 16 GPU LEBIH LAMBAT dari estimasi?",
        "Karena di atas titik optimal: waktu(16) > waktu(8) > waktu(4). Mereka membayar 4x lipat untuk hasil yang lebih buruk dari opsi 4 GPU.",
        "Pertanyaan: (a) Di mana kesalahan keputusan? (b) Berapa penghematan jika memakai 4 GPU? (c) Proses apa yang mencegah terulang?",
        "Pembahasan: (a) Sewa maksimal tanpa menghitung titik optimal — 'lebih banyak = lebih baik' yang salah. (b) Rp180jt − Rp45jt = Rp135 juta + selesai lebih cepat (4,2 vs 6,5 hari). (c) Wajib: ukur p via profiling di 1–2 GPU, hitung kurva waktu vs n, baru sewa. Aturan: tidak ada sewa > 4 GPU tanpa kurva scaling.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Data parallel: model sama, data dibagi; model parallel: model dibagi (untuk model raksasa).",
        "Hukum Amdahl: S(n) = 1/((1−p) + p/n) — batas atas speedup.",
        "Overhead komunikasi bisa membuat n besar lebih lambat — ada titik optimal.",
        "Ukur p dulu (profiling), hitung kurva, baru sewa GPU.",
        "Sinkron = konsisten; asinkron = cepat tetapi gradient basi.",
        "Banyak eksperimen kecil → paralel antar-job, bukan distributed training.",
      ],
      "next": {"label": "MLE11 — Cost & Latency Optimization", "href": "/v2/learn/mle11-cost"},
      "quiz": [
        {
          "q": "8 GPU, p = 0,9. Speedup ekspektasi?",
          "options": [
            {"text": "8x", "why": "Mengabaikan bagian sekuensial — mitos yang dibantah Amdahl."},
            {"text": "≈ 4,7x", "why": "Tepat: 1/(0,1 + 0,9/8) = 4,71.", "correct": True},
            {"text": "0,9x", "why": "Itu bukan cara membaca p."},
            {"text": "72x", "why": "Tidak ada dasarnya."},
          ],
        },
        {
          "q": "waktu(4) = 86 jam, waktu(8) = 92 jam. Keputusan?",
          "options": [
            {"text": "Pakai 8 GPU, lebih banyak lebih baik", "why": "Data menunjukkan 8 GPU lebih lambat — titik optimal terlampaui."},
            {"text": "Pakai 4 GPU — titik optimal, lebih cepat dan murah", "why": "Tepat: 86 < 92, dan biaya setengahnya.", "correct": True},
            {"text": "Pakai 16 GPU", "why": "Tren menunjukkan makin buruk setelah 4."},
            {"text": "Kembali ke 1 GPU", "why": "216 jam > 86 jam; 4 GPU tetap jauh lebih baik dari 1."},
          ],
        },
        {
          "q": "Model 70B parameter tidak muat di 1 GPU. Solusi?",
          "options": [
            {"text": "Data parallel biasa", "why": "Data parallel butuh salinan model penuh per GPU — tidak muat."},
            {"text": "Model parallel / pipeline parallel", "why": "Tepat: modelnya yang dibagi antar GPU.", "correct": True},
            {"text": "Perkecil data", "why": "Masalahnya ukuran model, bukan data."},
            {"text": "Training lebih lama di 1 GPU", "why": "Tidak muat = tidak bisa, bukan soal waktu."},
          ],
        },
        {
          "q": "Kelemahan utama asynchronous SGD?",
          "options": [
            {"text": "Terlalu lambat", "why": "Justru lebih cepat karena tanpa menunggu — masalahnya di tempat lain."},
            {"text": "Gradient basi (stale) merusak konvergensi", "why": "Tepat: update dari bobot lama menambah noise.", "correct": True},
            {"text": "Butuh lebih banyak data", "why": "Tidak berhubungan dengan jumlah data."},
            {"text": "Tidak bisa diimplementasikan", "why": "Bisa, dan dipakai di beberapa sistem."},
          ],
        },
        {
          "q": "20 varian eksperimen kecil, masing-masing 1 jam di 1 GPU. Strategi?",
          "options": [
            {"text": "Distributed training 20 GPU untuk 1 varian", "why": "Overhead tidak sebanding untuk job 1 jam."},
            {"text": "Jalankan 20 job paralel (1 GPU each)", "why": "Tepat: paralelisme antar-eksperimen 100% efisien, tanpa komunikasi.", "correct": True},
            {"text": "Berurutan di 1 GPU", "why": "20 jam vs 1 jam — buang waktu tanpa alasan."},
            {"text": "Gabungkan jadi 1 model besar", "why": "Mengubah pertanyaan riset, bukan strategi komputasi."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE11 ====================
mle11 = {
  "slug": "mle11-cost", "track": "Machine Learning Engineer",
  "module": "Skala & Tanggung Jawab", "title": "MLE11 — Cost & Latency Optimization", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Model terbaik di dunia tidak berguna jika terlalu lambat atau terlalu mahal untuk dijalankan. Lesson ini tentang seni mengorbankan sedikit akurasi untuk banyak kecepatan dan uang.",
        "Tujuan lesson ini:",
        "• Menjelaskan tradeoff tiga dimensi: akurasi, latency, biaya.",
        "• Menemukan himpunan Pareto dari kandidat model.",
        "• Menghitung efek kuantisasi pada ukuran model.",
        "• Membedakan teknik optimasi: kuantisasi, pruning, distilasi, caching.",
        "• Memutuskan optimasi untuk 4 skenario produk.",
        "Isi lesson: cerita tagihan $4.200 → tradeoff Pareto + lab → teknik optimasi + lab kuantisasi → cost modeling → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Tagihan $4.200/bulan yang menjadi $380",
      "prose": [
        "Sebuah SaaS HR memakai model NLP 2GB untuk screening CV: latency 800ms, tagihan GPU $4.200/bulan. CFO mulai bertanya-tanya apakah fitur ini sepadan.",
        "Tim MLE tidak mengganti model — mereka menumpuk optimasi kecil: kuantisasi int8 (4x lebih kecil), batching request, caching untuk CV yang di-submit ulang, dan distilasi ke model 6x lebih kecil untuk 90% traffic mudah.",
        "Hasil: latency 800ms → 120ms, biaya $4.200 → $380/bulan. Akurasi turun 0,4 poin — dari 94,0% ke 93,6%. Tidak ada pengguna yang komplain; tidak ada metrik bisnis yang bergerak.",
        "Twist-nya: tidak ada SATU teknik ajaib. Kemenangan datang dari tumpukan 4 optimasi yang masing-masing 'kecil'. Optimasi ML adalah portofolio, bukan lotre.",
      ],
      "note": {
        "title": "🚨 Mitos: 'optimasi = mengorbankan banyak akurasi'",
        "type": "pitfall",
        "body": "Yang benar: 80% penghematan biaya/latency biasanya menelan < 1 poin akurasi. Yang mahal adalah 1% akurasi TERAKHIR — dan seringkali tidak ada yang membutuhkannya.",
      },
      "tasks": [],
    },
    {
      "id": "pareto", "eyebrow": "Langkah 3 · Tradeoff tiga dimensi",
      "title": "Himpunan Pareto: tidak ada yang gratis",
      "prose": [
        "Setiap kandidat model punya tiga angka: akurasi (↑ baik), latency (↓ baik), biaya (↓ baik). Kandidat X 'mendominasi' Y jika X lebih baik di SEMUA dimensi — Y bisa dibuang tanpa ragu.",
        "Yang tersisa setelah membuang yang terdominasi = himpunan Pareto (frontier). Di sinilah keputusan sulit: setiap pilihan mengorbankan sesuatu. Tidak ada jawaban 'benar' — hanya jawaban yang selaras dengan prioritas produk.",
        "Lab: 6 kandidat. E didominasi B (akurasi lebih rendah, latency & biaya lebih tinggi) → buang. F didominasi C → buang. Tersisa 4: A (akurasi tertinggi), B, C, D (termurah/tercepat). Pilihan = strategi bisnis.",
        "Cara membaca: tidak ada kandidat yang 'menang' — A terbaik untuk akurasi kritis (medis), D terbaik untuk skala masif (rekomendasi), B/C untuk tengah-tengah.",
      ],
      "figure": {
        "svg": bars_svg([("A", 800), ("B", 120), ("C", 60), ("D", 30)], title="Latency kandidat Pareto (ms)"),
        "alt": "Bar chart latency: A 800ms, B 120ms, C 60ms, D 30ms.",
        "caption": "Cara membaca: tinggi batang = latency per prediksi. Interpretasi: A 27x lebih lambat dari D — harga dari 4 poin akurasi ekstra. Untuk screening CV (cerita pembuka), B/C adalah sweet spot.",
      },
      "tasks": [
        {"id": "t1", "text": "Tulis fungsi `dominan(x, y)`: x lebih baik di semua dimensi"},
        {"id": "t2", "text": "Saring `pareto`: kandidat yang tidak didominasi siapa pun"},
        {"id": "t3", "text": "Cetak jumlah dan nama anggota Pareto"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: buang yang terdominasi dulu, debat sisanya",
        "body": "Pareto mengubah debat kusut ('model mana terbaik?') menjadi dua langkah: eliminasi objektif (dominasi), lalu keputusan nilai (prioritas produk). Langkah pertama tidak butuh opini.",
      },
      "hints": [
        "x dominan y: acc x>=y DAN lat x<=y DAN cost x<=y, dengan minimal satu ketat.",
        "pareto = [k for k in kandidat if not any(dominan(o,k) for o in kandidat if o != k)].",
        "Bandingkan tuple (nama, acc, latency, cost).",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "# (nama, akurasi, latency_ms, biaya_per_1k_$)\n"
          "kandidat = [(\"A_besar\", 0.940, 800, 4.20), (\"B_quant\", 0.936, 120, 0.38),\n"
          "            (\"C_distil\", 0.928, 60, 0.15), (\"D_kecil\", 0.900, 30, 0.08),\n"
          "            (\"E_boros\", 0.930, 200, 0.60), (\"F_aneh\", 0.910, 100, 0.30)]\n"
          "\n"
          "# TULIS KODEMU: dominasi Pareto\n"
          "def dominan(x, y):\n"
          "    \n"
          "pareto = \n"
          "nama = [k[0] for k in pareto]\n"
          "\n"
          "print(f\"pareto={len(pareto)}  anggota={nama}\")"
        ),
        "lockLines": 5,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "# (nama, akurasi, latency_ms, biaya_per_1k_$)\n"
          "kandidat = [(\"A_besar\", 0.940, 800, 4.20), (\"B_quant\", 0.936, 120, 0.38),\n"
          "            (\"C_distil\", 0.928, 60, 0.15), (\"D_kecil\", 0.900, 30, 0.08),\n"
          "            (\"E_boros\", 0.930, 200, 0.60), (\"F_aneh\", 0.910, 100, 0.30)]\n"
          "\n"
          "# TULIS KODEMU: dominasi Pareto\n"
          "def dominan(x, y):\n"
          "    baik = x[1] >= y[1] and x[2] <= y[2] and x[3] <= y[3]\n"
          "    ketat = x[1] > y[1] or x[2] < y[2] or x[3] < y[3]\n"
          "    return baik and ketat\n"
          "pareto = [k for k in kandidat if not any(dominan(o, k) for o in kandidat if o != k)]\n"
          "nama = [k[0] for k in pareto]\n"
          "\n"
          "print(f\"pareto={len(pareto)}  anggota={nama}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "pareto", "value": ["A_besar", "B_quant", "C_distil", "D_kecil"], "tol": 1e-9, "label": "4 anggota Pareto", "msg": "E didominasi B, F didominasi C. Bandingkan list nama."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "pareto=4", "label": "`print` menampilkan jumlah", "msg": "Format: pareto=4  anggota=[...]."},
        ],
      },
      "reference": "Pareto = tidak ada yang mengalahkan di semua dimensi. Keputusan akhir = prioritas produk.",
    },
    {
      "id": "teknik", "eyebrow": "Langkah 4 · Teknik optimasi",
      "title": "Kuantisasi, pruning, distilasi, caching",
      "prose": [
        "Kuantisasi: turunkan presisi bobot (fp32 → int8). Ukuran 4x lebih kecil, inference 2–4x lebih cepat, akurasi turun tipis. Lab: model 350 juta parameter: 1400MB → 350MB (hemat 75%).",
        "Pruning: potong bobot/koneksi yang tidak penting (mendekati nol). Model lebih ramping; butuh fine-tuning setelahnya agar akurasi pulih.",
        "Distilasi: latih model KECIL (student) meniru output model BESAR (teacher). Student belajar 'pengetahuan' teacher — sering mencapai 95%+ akurasi teacher dengan 10x lebih kecil.",
        "Caching & batching: jangan hitung ulang yang sudah dihitung (cache prediksi untuk input berulang); kumpulkan request menjadi batch (GPU suka batch besar). Keduanya 'gratis' — tanpa mengorbankan akurasi sama sekali.",
        "Urutan kerja: ukur dulu bottleneck-nya (compute? memori? I/O?), lalu pilih teknik yang menyerang bottleneck itu. Optimasi buta = prematur.",
      ],
      "formula": "\\text{ukuran} = \\text{params} \\times \\text{bytes\\_per\\_param}",
      "tasks": [
        {"id": "t1", "text": "Hitung `fp32_mb` dan `int8_mb` untuk 350 juta parameter"},
        {"id": "t2", "text": "Hitung `hemat` (%)"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'kuantisasi selalu merusak akurasi secara signifikan'",
        "type": "pitfall",
        "body": "Yang benar: int8 quantization-aware training biasanya < 1 poin penurunan. Yang merusak adalah kuantisasi buta tanpa kalibrasi/validasi — tekniknya benar, eksekusinya yang salah.",
      },
      "hints": [
        "fp32 = 4 byte/param; int8 = 1 byte/param. MB = byte / 1e6.",
        "hemat = (1 - int8/fp32) * 100.",
        "350_000_000 = 350 juta.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 1 baris berikut ===\n"
          "params = 350_000_000\n"
          "\n"
          "# TULIS KODEMU: ukuran model\n"
          "fp32_mb = \n"
          "int8_mb = \n"
          "hemat = \n"
          "\n"
          "print(f\"fp32={fp32_mb:.0f}MB  int8={int8_mb:.0f}MB  hemat={hemat:.0f}%\")"
        ),
        "lockLines": 2,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 1 baris berikut ===\n"
          "params = 350_000_000\n"
          "\n"
          "# TULIS KODEMU: ukuran model\n"
          "fp32_mb = params * 4 / 1e6\n"
          "int8_mb = params * 1 / 1e6\n"
          "hemat = (1 - int8_mb / fp32_mb) * 100\n"
          "\n"
          "print(f\"fp32={fp32_mb:.0f}MB  int8={int8_mb:.0f}MB  hemat={hemat:.0f}%\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "fp32_mb", "value": 1400, "tol": 1e-9, "label": "`fp32_mb` = 1400", "msg": "350jt × 4 byte / 1e6 = 1400 MB."},
          {"kind": "equal", "task": "t2", "name": "hemat", "value": 75, "tol": 1e-9, "label": "`hemat` = 75%", "msg": "(1 − 350/1400) × 100 = 75%."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "int8=350MB", "label": "`print` menampilkan hasil", "msg": "Format: fp32=...MB  int8=...MB  hemat=...%."},
        ],
      },
      "reference": "Kuantisasi int8 = standar industri untuk serving. Validasi akurasi setelahnya wajib.",
    },
    {
      "id": "costmodel", "eyebrow": "Langkah 5 · Cost modeling",
      "title": "Berapa rupiah per prediksi?",
      "prose": [
        "Metrik biaya yang benar: $/1.000 prediksi (atau Rp/prediksi). Ia menggabungkan harga compute, utilisasi, dan throughput menjadi satu angka yang bisa dibandingkan antar arsitektur.",
        "Contoh: GPU $3/jam, throughput 500 prediksi/detik, utilisasi 60% → prediksi per jam = 500 × 3600 × 0,6 = 1.080.000 → $3/1080 = $0,0028 per 1.000 prediksi. Naikkan utilisasi ke 90% (batching lebih baik) → $0,0019 — optimasi tanpa menyentuh model.",
        "Biaya tersembunyi: egress network, storage model, monitoring, dan — yang terbesar — WAKTU INSINYUR. Optimasi yang menghemat $100/bulan tetapi butuh 2 minggu kerja = rugi.",
        "Aturan: optimasi yang ROI-nya positif dulu (caching, batching, kuantisasi standar); yang eksotis (custom kernel) hanya jika skala membenarkan.",
      ],
      "note": {
        "title": "💡 Intuisi: utilisasi adalah tuas termurah",
        "body": "GPU yang menganggur 70% = membayar 3x lipat per prediksi. Sebelum mengecilkan model, pastikan GPU-mu sibuk dulu (batching, penjadwalan).",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Optimasi apa untuk produk apa",
      "prose": [
        "Skenario 1 — Fraud real-time, SLO 100ms, model 800ms → kuantisasi + distilasi + caching. Alasan: latency adalah syarat hidup-mati; korbankan sedikit akurasi.",
        "Skenario 2 — Rekomendasi batch harian, biaya membengkak → batching + spot instance + model lebih kecil. Alasan: latency tidak kritis; yang diburu $/prediksi.",
        "Skenario 3 — Model di HP (on-device) → kuantisasi agresif + pruning + arsitektur mobile. Alasan: memori dan baterai adalah batas keras.",
        "Skenario 4 — Model medis, akurasi kritis → JANGAN optimasi agresif; validasi klinis ulang tiap perubahan. Alasan: 0,4 poin di medis bisa berarti nyawa; biaya compute bukan masalahnya.",
        "Aturan praktis 10 detik: (1) Apa batas kerasnya — latency, biaya, atau memori? (2) Berapa akurasi yang boleh dikorbankan? (3) Apakah optimasi butuh validasi ulang? Jawaban menentukan teknik.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Chatbot bank: 2 detik → 0,4 detik",
      "prose": [
        "Chatbot CS bank memakai LLM 7B parameter: latency 2 detik, biaya $0,012/pertanyaan, 3 juta pertanyaan/bulan = $36.000/bulan. Target: < 0,5 detik.",
        "Intervensi bertahap: (1) Caching: 35% pertanyaan berulang (saldo, jam operasional) → dijawab cache < 50ms, biaya ~$0. (2) Klasifikasi intent ringan: 50% pertanyaan sederhana → model kecil 120ms, $0,001. (3) LLM hanya untuk 15% kompleks → 2 detik, $0,012.",
        "Hitung: latency rata-rata = 0,35×0,05 + 0,50×0,12 + 0,15×2,0 = 0,38 detik ✓. Biaya/bulan = 3jt × (0,50×0,001 + 0,15×0,012) = 3jt × $0,0023 = $6.900 — hemat 81%.",
        "Pertanyaan: (a) Teknik apa yang paling berkontribusi pada penghematan? (b) Kenapa tidak semua ke model kecil? (c) Risiko terbesar desain ini?",
        "Pembahasan: (a) Caching — 35% traffic menjadi nyaris gratis. (b) 15% pertanyaan kompleks butuh kemampuan LLM; model kecil akan ngawur dan merusak kepercayaan. (c) Cache basi (info promo berubah) dan salah routing intent (pertanyaan kompleks dikira sederhana) — butuh monitoring kualitas per jalur.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Tradeoff tiga dimensi: akurasi ↑, latency ↓, biaya ↓ — tidak ada yang gratis.",
        "Pareto: buang yang terdominasi; pilih sisanya sesuai prioritas produk.",
        "Kuantisasi int8: 4x lebih kecil, 2–4x lebih cepat, akurasi turun tipis.",
        "Caching & batching: optimasi 'gratis' tanpa korban akurasi.",
        "Metrik biaya: $/1.000 prediksi; utilisasi adalah tuas termurah.",
        "Optimasi agresif butuh validasi ulang — di domain kritis (medis), jangan.",
      ],
      "next": {"label": "MLE12 — Fairness & Responsible ML", "href": "/v2/learn/mle12-fairness"},
      "quiz": [
        {
          "q": "Kandidat E (acc 0,93, lat 200ms, $0,60) vs B (acc 0,936, lat 120ms, $0,38). Nasib E?",
          "options": [
            {"text": "Tetap dipertimbangkan", "why": "E kalah di SEMUA dimensi dari B — tidak ada alasan memilihnya."},
            {"text": "Dibuang — didominasi B di semua dimensi", "why": "Tepat: B lebih baik di akurasi, latency, DAN biaya.", "correct": True},
            {"text": "Dipromosikan", "why": "Promosi butuh keunggulan, bukan kekalahan total."},
            {"text": "Dilatih ulang", "why": "Mungkin, tetapi sebagai kandidat ia sudah gugur dari frontier."},
          ],
        },
        {
          "q": "Model 350M parameter di-fp32 1400MB. Setelah int8?",
          "options": [
            {"text": "1400MB, tidak berubah", "why": "int8 = 1 byte/param vs fp32 4 byte/param."},
            {"text": "350MB (hemat 75%)", "why": "Tepat: 350jt × 1 byte = 350MB.", "correct": True},
            {"text": "700MB", "why": "Itu setara 2 byte/param (fp16), bukan int8."},
            {"text": "87MB", "why": "Terlalu kecil; hitung lagi: 350jt × 1 byte."},
          ],
        },
        {
          "q": "GPU menganggur 70%. Tuas termurah menurunkan $/prediksi?",
          "options": [
            {"text": "Beli GPU lebih mahal", "why": "Menambah biaya tanpa menaikkan utilisasi."},
            {"text": "Naikkan utilisasi via batching/penjadwalan", "why": "Tepat: utilisasi 30% → 90% = 3x lebih murah per prediksi, tanpa menyentuh model.", "correct": True},
            {"text": "Kecilkan model 10x", "why": "Berisiko akurasi; utilisasi dulu yang gratis."},
            {"text": "Naikkan harga ke pelanggan", "why": "Bukan optimasi teknis; tidak menyelesaikan inefisiensi."},
          ],
        },
        {
          "q": "Teknik optimasi yang TIDAK mengorbankan akurasi?",
          "options": [
            {"text": "Kuantisasi agresif", "why": "Ada penurunan kecil yang harus divalidasi."},
            {"text": "Caching prediksi untuk input berulang", "why": "Tepat: hasil identik, hanya tidak dihitung ulang.", "correct": True},
            {"text": "Pruning 90%", "why": "Jelas mengorbankan akurasi tanpa fine-tuning serius."},
            {"text": "Distilasi ke model 100x lebih kecil", "why": "Ada gap akurasi teacher-student yang harus diterima."},
          ],
        },
        {
          "q": "Model diagnosis medis, akurasi kritis, biaya compute bukan masalah. Sikap optimasi?",
          "options": [
            {"text": "Kuantisasi agresif untuk hemat", "why": "Penghematan tidak sebanding risiko nyawa; butuh validasi klinis ulang."},
            {"text": "Jangan optimasi agresif; validasi klinis tiap perubahan", "why": "Tepat: di domain kritis, 0,4 poin bisa berarti nyawa.", "correct": True},
            {"text": "Distilasi ke model HP", "why": "Mengorbankan akurasi demi efisiensi yang tidak dibutuhkan."},
            {"text": "Hapus monitoring untuk hemat", "why": "Monitoring bukan biaya yang boleh dipangkas di domain kritis."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE12 ====================
mle12 = {
  "slug": "mle12-fairness", "track": "Machine Learning Engineer",
  "module": "Skala & Tanggung Jawab", "title": "MLE12 — Fairness & Responsible ML", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "Model yang 'akurat' bisa tetap tidak adil — dan ketidakadilan yang diotomatiskan berskala jauh lebih besar daripada ketidakadilan manusia. Lesson ini memberimu alat ukur dan alat perbaikinya.",
        "Tujuan lesson ini:",
        "• Menjelaskan kenapa akurasi global menyembunyikan ketidakadilan.",
        "• Menghitung disparate impact ratio dan equal opportunity gap.",
        "• Mengidentifikasi sumber bias: data, label, fitur, feedback loop.",
        "• Menerapkan mitigasi: reweighting dan penyesuaian threshold.",
        "• Memutuskan pendekatan fairness untuk 4 skenario.",
        "Isi lesson: cerita model hiring yang 'adil' → metrik fairness + lab → sumber bias & mitigasi + lab → tradeoff & governance → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Model hiring dengan akurasi sama — dan recall 40% vs 85%",
      "prose": [
        "Sebuah perusahaan memakai AI screening CV. Audit pertama: akurasi 82% untuk grup A dan 81% untuk grup B — 'adil', kata vendor.",
        "Audit kedua melihat lebih dalam: recall untuk kandidat qualified grup A = 85%, grup B = 40%. Artinya: kandidat qualified dari grup B 2x lebih mungkin TERLEWAT oleh sistem. Akurasi 'sama' menyembunyikan bahwa kesalahan didistribusikan tidak merata — grup B menanggung hampir semua false negative.",
        "Twist-nya: model tidak pernah melihat atribut grup. 'Kami tidak memasukkan gender/suku sebagai fitur!' — tetapi fitur proxy (nama universitas, kode pos, gap karir) membawa informasi yang sama. Buta terhadap atribut ≠ adil.",
        "Pelajaran: fairness harus DIUKUR per grup, bukan diasumsikan dari desain. Yang tidak diukur = tidak dikelola.",
      ],
      "note": {
        "title": "🚨 Mitos: 'tidak memakai atribut sensitif = model adil'",
        "type": "pitfall",
        "body": "Yang benar: proxy (kode pos, nama, riwayat) merekonstruksi atribut sensitif. Keadilan butuh pengukuran outcome per grup — bukan sekadar menghapus kolom.",
      },
      "tasks": [],
    },
    {
      "id": "metrik", "eyebrow": "Langkah 3 · Metrik fairness",
      "title": "Tiga lensa keadilan",
      "prose": [
        "Demographic parity: P(lolos | grup A) ≈ P(lolos | grup B). Sederhana, tetapi mengabaikan perbedaan kualifikasi antar grup — bisa memaksa kuota yang tidak meritokratis.",
        "Equalized odds / equal opportunity: tingkat kesalahan SAMA antar grup — mis. recall (TPR) grup A ≈ grup B. Fokus pada yang qualified: 'kandidat bagus dari grup mana pun punya peluang sama lolos'. Ini lensa yang paling selaras dengan meritokrasi.",
        "Disparate impact (aturan 4/5 AS): rasio tingkat lolos grup minoritas/mayoritas ≥ 0,8. Di bawah itu = disparate impact, pemicu investigasi hukum di banyak yurisdiksi.",
        "Ketiganya TIDAK BISA dipenuhi bersamaan (impossibility theorem) kecuali kasus khusus. Memilih metrik = memilih definisi keadilan — keputusan nilai, bukan matematika.",
        "Lab: tingkat lolos A = 50%, B = 30% → rasio 0,60 < 0,8 → DISPARATE IMPACT. Angka ini memicu investigasi, bukan vonis — tetapi tanpanya, tidak ada yang bertanya.",
      ],
      "formula": "\\text{DI ratio} = \\frac{P(\\hat{Y}=1 \\mid G=B)}{P(\\hat{Y}=1 \\mid G=A)} \\geq 0{,}8",
      "figure": {
        "svg": bars_svg([("A lolos", 50), ("B lolos", 30)], title="Tingkat kelolosan per grup (%)", colors=[C1, C4]),
        "alt": "Bar chart: grup A 50% lolos, grup B 30% lolos.",
        "caption": "Cara membaca: tinggi batang = % pelamar yang lolos per grup. Interpretasi: rasio 30/50 = 0,60 < 0,8 (aturan 4/5) → disparate impact. Kesenjangan 20 poin ini tidak terlihat dari akurasi global.",
      },
      "tasks": [
        {"id": "t1", "text": "Hitung `rate_a`, `rate_b`, dan `di_ratio`"},
        {"id": "t2", "text": "Tentukan `verdict` dengan aturan 4/5 (0.8)"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: ukur dulu, debat definisi kemudian",
        "body": "Tim sering berdebat definisi keadilan berbulan-bulan tanpa angka. Hitung ketiga metrik dulu (10 menit) — data konkret membuat debat 10x lebih produktif.",
      },
      "hints": [
        "rate = lolos / pelamar.",
        "di_ratio = rate_b / rate_a.",
        "verdict = 'DISPARATE IMPACT' jika di_ratio < 0.8 else 'OK'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "grup_a = {\"pelamar\": 800, \"lolos\": 400}\n"
          "grup_b = {\"pelamar\": 200, \"lolos\": 60}\n"
          "\n"
          "# TULIS KODEMU: disparate impact ratio\n"
          "rate_a = \n"
          "rate_b = \n"
          "di_ratio = \n"
          "verdict = \n"
          "\n"
          "print(f\"di_ratio={di_ratio:.2f}  verdict={verdict}\")"
        ),
        "lockLines": 3,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "grup_a = {\"pelamar\": 800, \"lolos\": 400}\n"
          "grup_b = {\"pelamar\": 200, \"lolos\": 60}\n"
          "\n"
          "# TULIS KODEMU: disparate impact ratio\n"
          "rate_a = grup_a[\"lolos\"] / grup_a[\"pelamar\"]\n"
          "rate_b = grup_b[\"lolos\"] / grup_b[\"pelamar\"]\n"
          "di_ratio = rate_b / rate_a\n"
          "verdict = \"DISPARATE IMPACT\" if di_ratio < 0.8 else \"OK\"\n"
          "\n"
          "print(f\"di_ratio={di_ratio:.2f}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "di_ratio", "value": 0.6, "tol": 1e-9, "label": "`di_ratio` = 0.60", "msg": "(60/200)/(400/800) = 0.3/0.5 = 0.6."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=DISPARATE IMPACT", "label": "`print` memvonis", "msg": "0.6 < 0.8 → disparate impact."},
        ],
      },
      "reference": "Aturan 4/5: rasio < 0.8 = lampu merah (bukan vonis hukum otomatis).",
    },
    {
      "id": "bias", "eyebrow": "Langkah 4 · Sumber bias dan mitigasi",
      "title": "Dari mana bias lahir — dan cara melawannya",
      "prose": [
        "Empat sumber: (1) Data historis — model belajar dari keputusan manusia masa lalu yang bias (rekrutmen 'culture fit'). (2) Label bias — 'kinerja bagus' dinilai subjektif oleh atasan. (3) Fitur proxy — kode pos ≈ suku. (4) Feedback loop — model menolak grup B → grup B tidak pernah dapat kesempatan → data masa depan 'membuktikan' grup B memang buruk.",
        "Tiga titik mitigasi: pre-processing (reweighting/rebalancing data training), in-processing (tambah constraint fairness saat training), post-processing (sesuaikan threshold per grup setelah training).",
        "Lab: threshold tunggal 0,6 → recall A 66%, B 21% (gap 45 poin!). Cari threshold grup B agar recall menyamai A: threshold 0,45 → recall B 62% ≈ A 66%. Gap menyusut dari 45 menjadi 4 poin.",
        "Catatan jujur: threshold berbeda per grup adalah disparate treatment di beberapa yurisdiksi — konsultasikan legal. Alternatif yang lebih aman: perbaiki representasi data dan fitur, bukan threshold.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `r_a` (thr 0.6) dan `r_b` (thr 0.6): recall per grup"},
        {"id": "t2", "text": "Cari `best`: threshold grup B (0.05–0.95) dengan recall terdekat r_a"},
        {"id": "t3", "text": "Cetak recall awal, threshold adil, dan recall akhir"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'bias hilang kalau datanya besar'",
        "type": "pitfall",
        "body": "Yang benar: data besar yang bias = bias yang diyakini dengan sangat percaya diri. Feedback loop justru menguatkan bias seiring data bertambah. Ukuran tidak menggantikan keadilan.",
      },
      "hints": [
        "recall(skor, thr) = proporsi skor >= thr.",
        "Cari di [t/100 for t in range(5, 96, 5)] yang meminimalkan |recall_b(t) - r_a|.",
        "min(daftar, key=lambda t: abs(...)).",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(51)\n"
          "skor_a = [min(1, max(0, random.gauss(0.65, 0.15))) for _ in range(500)]\n"
          "skor_b = [min(1, max(0, random.gauss(0.50, 0.15))) for _ in range(200)]\n"
          "def recall(skor, thr):\n"
          "    return sum(1 for s in skor if s >= thr) / len(skor)\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "r_a = \n"
          "r_b = \n"
          "best = \n"
          "r_b_adil = recall(skor_b, best)\n"
          "\n"
          "print(f\"recall_A={r_a:.2f}  recall_B_tunggal={r_b:.2f}  thr_B_adil={best:.2f}  recall_B_adil={r_b_adil:.2f}\")"
        ),
        "lockLines": 8,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah blok berikut ===\n"
          "import random\n"
          "random.seed(51)\n"
          "skor_a = [min(1, max(0, random.gauss(0.65, 0.15))) for _ in range(500)]\n"
          "skor_b = [min(1, max(0, random.gauss(0.50, 0.15))) for _ in range(200)]\n"
          "def recall(skor, thr):\n"
          "    return sum(1 for s in skor if s >= thr) / len(skor)\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU\n"
          "r_a = recall(skor_a, 0.6)\n"
          "r_b = recall(skor_b, 0.6)\n"
          "best = min([t/100 for t in range(5, 96, 5)], key=lambda t: abs(recall(skor_b, t) - r_a))\n"
          "r_b_adil = recall(skor_b, best)\n"
          "\n"
          "print(f\"recall_A={r_a:.2f}  recall_B_tunggal={r_b:.2f}  thr_B_adil={best:.2f}  recall_B_adil={r_b_adil:.2f}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "r_b", "value": 0.21, "tol": 0.02, "label": "`r_b` ≈ 0.21 (timpang)", "msg": "Threshold tunggal menghukum grup dengan skor lebih rendah."},
          {"kind": "equal", "task": "t2", "name": "best", "value": 0.45, "tol": 1e-9, "label": "`best` = 0.45", "msg": "Threshold 0.45 menyamakan recall B dengan A."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "recall_B_adil=0\\.62", "label": "`print` menampilkan hasil adil", "msg": "Gap menyusut dari 45 poin menjadi ~4 poin."},
        ],
      },
      "reference": "Post-processing = mitigasi termurah (tanpa retrain), tetapi konsultasikan legal.",
    },
    {
      "id": "governance", "eyebrow": "Langkah 5 · Tradeoff dan governance",
      "title": "Keadilan vs akurasi — dan siapa memutuskan",
      "prose": [
        "Mitigasi fairness sering menurunkan akurasi global sedikit (1–3 poin). Ini bukan bug — ini harga keadilan. Pertanyaannya bukan 'apakah kita mau membayar?' melainkan 'siapa yang selama ini membayar ketidakadilan?'",
        "Governance praktis: (1) fairness review WAJIB sebelum deploy model yang berdampak ke manusia (hiring, kredit, hukum); (2) metrik fairness di dashboard monitoring, bukan laporan tahunan; (3) dokumentasi: definisi keadilan yang dipilih + alasannya + tradeoff yang diterima.",
        "Red teaming: minta tim terpisah mencari cara model bisa tidak adil — seperti penetration test untuk keamanan. Bias yang ditemukan sendiri < bias yang ditemukan jurnalis.",
        "Prinsip: jika modelmu menentukan nasib manusia, 'tidak tahu' bukan jawaban yang dapat diterima untuk pertanyaan fairness.",
      ],
      "note": {
        "title": "💡 Intuisi: fairness adalah fitur kepercayaan",
        "body": "Satu skandal bias menghancurkan kepercayaan yang dibangun bertahun-tahun. Investasi fairness = premi asuransi reputasi termurah.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Pendekatan fairness per konteks",
      "prose": [
        "Skenario 1 — Hiring/lending (dampak langsung ke manusia, risiko hukum) → audit penuh: 3 metrik + mitigasi + review legal + monitoring. Alasan: taruhannya hak manusia dan gugatan.",
        "Skenario 2 — Rekomendasi konten → ukur exposure per grup kreator; mitigasi ringan. Alasan: dampak ekonomi tetapi tidak menentukan nasib.",
        "Skenario 3 — Model internal (prioritas tiket CS) → ukur, dokumentasikan, mitigasi jika timpang parah. Alasan: dampak tidak langsung, tetapi tetap membentuk pengalaman.",
        "Skenario 4 — Riset tanpa deploy → ukur dan laporkan sebagai bagian hasil. Alasan: kebiasaan baik + mencegah 'penemuan' bias setelah terlanjur dipublikasikan.",
        "Aturan praktis 10 detik: (1) Apakah model menentukan akses ke peluang/sumber daya? (2) Apakah ada risiko hukum/reputasi? Ya → audit penuh. Tidak → ukur dan dokumentasikan.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Pinjol: approval 50% vs 30%, NPL sama",
      "prose": [
        "Pinjol DanaMaju: approval grup A 50%, grup B 30% (DI ratio 0,60). Manajemen berargumen: 'grup B memang lebih berisiko — NPL mereka 8% vs 5%.'",
        "Audit slice: pada segmen 'penghasilan > Rp10jt & tenor 12 bulan', NPL kedua grup SAMA (4,2% vs 4,3%) — tetapi approval tetap 55% vs 32%. Perbedaan risiko tidak menjelaskan kesenjangan approval. Model menghukum grup B bahkan saat risikonya identik.",
        "Akar: fitur 'lama tinggal di alamat' (proxy urbanisasi) berkorelasi dengan grup. Model 'belajar' pola historis penolakan manusia.",
        "Pertanyaan: (a) Argumen manajemen valid? (b) Bukti apa yang membantahnya? (c) Mitigasi yang tepat?",
        "Pembahasan: (a) Tidak — argumen 'memang lebih berisiko' harus diuji per segmen risiko setara, bukan agregat. (b) Slice dengan NPL sama tetapi approval timpang = bukti model menambah ketidakadilan di atas perbedaan risiko riil. (c) Hapus/transform fitur proxy + reweighting + threshold review + monitoring DI ratio bulanan. Bukan 'tambah data grup B' saja — data historisnya sendiri yang bias.",
      ],
      "note": {
        "title": "Kaitan ke risk",
        "type": "risk",
        "body": "OJK dan regulator global semakin mensyaratkan model kredit bebas diskriminasi. Fairness bukan CSR — ia adalah compliance risk yang nyata dengan denda nyata.",
      },
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Akurasi global menyembunyikan ketidakadilan — ukur per grup.",
        "Tiga lensa: demographic parity, equal opportunity, disparate impact (4/5).",
        "Ketiganya tak bisa dipenuhi bersamaan — pilih definisi secara sadar.",
        "Sumber bias: data historis, label, proxy, feedback loop.",
        "Mitigasi: pre/in/post-processing; threshold per grup butuh review legal.",
        "Fairness review wajib untuk model yang menentukan nasib manusia.",
      ],
      "next": {"label": "MLE13 — LLM dalam Sistem ML", "href": "/v2/learn/mle13-llm-ml"},
      "quiz": [
        {
          "q": "Akurasi 82% vs 81% antar grup, tetapi recall 85% vs 40%. Kesimpulan?",
          "options": [
            {"text": "Model adil, akurasi sama", "why": "Akurasi menyembunyikan distribusi kesalahan yang timpang."},
            {"text": "Tidak adil — grup B menanggung hampir semua false negative", "why": "Tepat: kandidat qualified grup B 2x lebih mungkin terlewat.", "correct": True},
            {"text": "Butuh lebih banyak data", "why": "Masalahnya distribusi kesalahan, bukan volume data."},
            {"text": "Akurasi harus 100%", "why": "Tidak realistis dan tidak menyelesaikan ketimpangan."},
          ],
        },
        {
          "q": "DI ratio 0,60. Artinya?",
          "options": [
            {"text": "Lolos aturan 4/5", "why": "0,60 < 0,8 — tidak lolos."},
            {"text": "Disparate impact — investigasi wajib", "why": "Tepat: di bawah 0,8 = lampu merah.", "correct": True},
            {"text": "Tidak ada masalah", "why": "Kesenjangan 20 poin antar grup adalah masalah."},
            {"text": "Model harus dihapus", "why": "Investigasi dan mitigasi dulu; penghapusan adalah opsi terakhir."},
          ],
        },
        {
          "q": "'Kami tidak memakai atribut sensitif sebagai fitur.' Apakah cukup?",
          "options": [
            {"text": "Ya, itu menjamin keadilan", "why": "Proxy merekonstruksi atribut sensitif — buta kolom ≠ adil."},
            {"text": "Tidak — proxy bisa membawa info yang sama; ukur outcome per grup", "why": "Tepat: keadilan dibuktikan dengan pengukuran, bukan niat.", "correct": True},
            {"text": "Ya jika akurasinya tinggi", "why": "Akurasi tinggi tidak menjamin keadilan per grup."},
            {"text": "Tidak perlu dipikirkan", "why": "Mengabaikan = risiko hukum dan reputasi."},
          ],
        },
        {
          "q": "Threshold tunggal 0,6 → recall A 66%, B 21%. Mitigasi post-processing?",
          "options": [
            {"text": "Naikkan threshold global", "why": "Menaikkan threshold menurunkan recall kedua grup — gap tetap."},
            {"text": "Sesuaikan threshold per grup (dengan review legal)", "why": "Tepat: thr B 0,45 → recall 62% ≈ A. Catatan: konsultasikan legal.", "correct": True},
            {"text": "Hapus grup B dari data", "why": "Menghapus masalah dari laporan, bukan menyelesaikannya."},
            {"text": "Acak threshold", "why": "Tidak sistematis dan tidak bisa dipertanggungjawabkan."},
          ],
        },
        {
          "q": "Kapan fairness review WAJIB?",
          "options": [
            {"text": "Semua model tanpa kecuali dengan audit penuh", "why": "Tingkat audit mengikuti dampak; model internal ringan tidak butuh review legal."},
            {"text": "Model yang menentukan akses ke peluang/sumber daya (hiring, kredit)", "why": "Tepat: taruhannya hak manusia dan risiko hukum.", "correct": True},
            {"text": "Tidak pernah, terlalu mahal", "why": "Biaya skandal bias jauh lebih mahal dari audit."},
            {"text": "Hanya jika ada komplain", "why": "Reaktif = menunggu kerusakan terjadi."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE13 ====================
mle13 = {
  "slug": "mle13-llm-ml", "track": "Machine Learning Engineer",
  "module": "Skala & Tanggung Jawab", "title": "MLE13 — LLM dalam Sistem ML", "estMinutes": 55,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "LLM bukan pengganti sistem ML — ia adalah KOMPONEN baru di dalamnya: sebagai pemberi fitur (embedding), sebagai pekerja (klasifikasi/generasi), dan sebagai juri (evaluasi). Lesson ini menempatkannya dengan tepat.",
        "Tujuan lesson ini:",
        "• Menjelaskan embedding sebagai fitur dan similarity search.",
        "• Menghitung cosine similarity dari nol dan retrieval top-k.",
        "• Merancang pola integrasi: LLM sebagai fitur, pekerja, dan juri.",
        "• Mengevaluasi kelayakan LLM-as-judge dengan angka agreement.",
        "• Memutuskan kapan memakai LLM vs model klasik untuk 4 skenario.",
        "Isi lesson: cerita classifier 2 hari → embedding + lab cosine → pola integrasi → LLM-as-judge + lab → cost & guardrails → peta keputusan → mini-case → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Classifier intent yang selesai dalam 2 hari",
      "prose": [
        "Tim CS sebuah bank merencanakan proyek 3 bulan: membangun classifier intent chatbot dari nol — kumpulkan 10 ribu label, latih model, tuning, deploy.",
        "Seorang MLE junior mencoba jalan pintas: ambil embedding dari model pre-trained, tulis 20 contoh intent sebagai 'jangkar', klasifikasikan dengan cosine similarity ke jangkar terdekat. Waktu pengerjaan: 2 hari. F1: 0,91 — mengalahkan target proyek 3 bulan (0,88).",
        "Twist-nya: yang mahal bukan training-nya — melainkan tidak tahu bahwa masalah ini sudah 'solved' oleh representasi yang dipelajari orang lain. Embedding adalah transfer learning yang paling mudah dipakai: pengetahuan bahasa dunia, gratis, tanpa training.",
        "Pelajaran: sebelum melatih apa pun untuk teks, tanyakan dulu 'apakah embedding + metode sederhana cukup?' Seringkali cukup — dan 45x lebih cepat.",
      ],
      "note": {
        "title": "🚨 Mitos: 'untuk NLP harus fine-tune LLM sendiri'",
        "type": "pitfall",
        "body": "Yang benar: hierarki usaha — (1) embedding + cosine/kNN, (2) prompt LLM, (3) fine-tune. Kebanyakan kasus klasifikasi/retrieval selesai di level 1–2. Fine-tune adalah opsi terakhir, bukan pertama.",
      },
      "tasks": [],
    },
    {
      "id": "embedding", "eyebrow": "Langkah 3 · Embedding sebagai fitur",
      "title": "Cosine similarity: kedekatan makna sebagai angka",
      "prose": [
        "Embedding mengubah teks menjadi vektor angka (ratusan dimensi) di mana teks yang mirip maknanya berdekatan. Cosine similarity mengukur kedekatan: 1 = identik arah, 0 = tidak berhubungan.",
        "Pola retrieval: ubah dokumen menjadi embedding SEKALI (offline), simpan di vector DB; saat query datang, embed query, cari tetangga terdekat. Inilah fondasi RAG dan semantic search.",
        "Kenapa cosine, bukan jarak Euclidean? Karena pada embedding teks, ARAH vektor membawa makna; panjangnya sering artefak frekuensi kata. Cosine mengabaikan panjang — fokus pada arah.",
        "Lab: 5 dokumen 2D + 1 query. Cosine tertinggi: d1 (0,993), d2 (0,992) — keduanya tentang topik yang sama dengan query. Top-2 retrieval bekerja persis seperti sistem nyata, hanya dimensinya 2 bukan 768.",
      ],
      "formula": "\\text{cos}(a,b) = \\frac{a \\cdot b}{\\|a\\|\\,\\|b\\|}",
      "figure": {
        "svg": bars_svg([("d1", 0.99), ("d2", 0.99), ("d5", 0.85), ("d4", 0.45), ("d3", 0.38)], title="Cosine similarity query vs dokumen"),
        "alt": "Bar chart cosine similarity: d1 dan d2 tertinggi (~0,99).",
        "caption": "Cara membaca: tinggi batang = cosine similarity query terhadap tiap dokumen. Interpretasi: d1/d2 nyaris 1 (sangat relevan) — sistem akan mengambil keduanya sebagai konteks. Inilah 'pencarian makna', bukan pencocokan kata.",
      },
      "tasks": [
        {"id": "t1", "text": "Tulis fungsi `cosine(a, b)` dari nol"},
        {"id": "t2", "text": "Hitung skor semua dokumen, ambil `top2` teratas"},
        {"id": "t3", "text": "Cetak top2 dan skor d1 (3 desimal)"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: embedding = kamus makna yang bisa dihitung",
        "body": "'Raja - pria + wanita = ratu' adalah contoh klasik: operasi aritmetika pada embedding menangkap hubungan semantik. Retrieval modern = aritmetika makna dalam skala besar.",
      },
      "hints": [
        "dot = sum(x*y for x,y in zip(a,b)); norm = sqrt(sum(x*x for x in a)).",
        "cosine = dot / (na * nb).",
        "sorted(skor, key=skor.get, reverse=True)[:2] untuk top-2.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "import math\n"
          "docs = {\"d1\": (0.9, 0.1), \"d2\": (0.8, 0.3), \"d3\": (0.1, 0.9), \"d4\": (0.2, 0.8), \"d5\": (0.5, 0.5)}\n"
          "query = (0.85, 0.2)\n"
          "\n"
          "# TULIS KODEMU: cosine similarity\n"
          "def cosine(a, b):\n"
          "    \n"
          "skor = \n"
          "top2 = \n"
          "\n"
          "print(f\"top2={top2}  skor_d1={skor['d1']:.3f}\")"
        ),
        "lockLines": 4,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 2 baris berikut ===\n"
          "import math\n"
          "docs = {\"d1\": (0.9, 0.1), \"d2\": (0.8, 0.3), \"d3\": (0.1, 0.9), \"d4\": (0.2, 0.8), \"d5\": (0.5, 0.5)}\n"
          "query = (0.85, 0.2)\n"
          "\n"
          "# TULIS KODEMU: cosine similarity\n"
          "def cosine(a, b):\n"
          "    dot = sum(x * y for x, y in zip(a, b))\n"
          "    na = math.sqrt(sum(x * x for x in a))\n"
          "    nb = math.sqrt(sum(x * x for x in b))\n"
          "    return dot / (na * nb)\n"
          "skor = {d: cosine(v, query) for d, v in docs.items()}\n"
          "top2 = sorted(skor, key=skor.get, reverse=True)[:2]\n"
          "\n"
          "print(f\"top2={top2}  skor_d1={skor['d1']:.3f}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t2", "name": "top2", "value": ["d1", "d2"], "tol": 1e-9, "label": "`top2` = [d1, d2]", "msg": "d1 (0.993) dan d2 (0.992) paling dekat dengan query."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "skor_d1=0\\.993", "label": "`print` menampilkan skor", "msg": "Cosine d1 vs query = 0.993."},
        ],
      },
      "reference": "Cosine = dot product ternormalisasi. 1 = searah, 0 = ortogonal.",
    },
    {
      "id": "pola", "eyebrow": "Langkah 4 · Tiga peran LLM",
      "title": "Fitur, pekerja, juri",
      "prose": [
        "Peran 1 — LLM sebagai pemberi fitur: embedding untuk classifier, clustering, atau retrieval. Murah, deterministik, mudah di-cache. Inilah peran dengan ROI tertinggi.",
        "Peran 2 — LLM sebagai pekerja: klasifikasi/generasi via prompt. Fleksibel (tanpa training), tetapi mahal, lambat, dan non-deterministik. Cocok untuk kasus kompleks bervolume rendah.",
        "Peran 3 — LLM sebagai juri (LLM-as-judge): menilai output sistem lain (mis. kualitas ringkasan). Skala evaluasi tanpa manusia — TETAPI harus divalidasi: bandingkan dengan label manusia dulu (agreement rate).",
        "Aturan: jangan pakai LLM sebagai juri tanpa mengukur agreement-nya. Juri yang tidak tervalidasi = opini mahal yang terlihat seperti metrik.",
      ],
      "tasks": [
        {"id": "t1", "text": "Hitung `agreement`: proporsi judge == human"},
        {"id": "t2", "text": "Hitung `cost` = n × $0.002; tentukan `verdict` (agreement ≥ 0.8 → 'layak')"},
        {"id": "t3", "text": "Cetak ketiganya"},
      ],
      "expected": "",
      "note": {
        "title": "🚨 Mitos: 'LLM-as-judge bisa langsung menggantikan evaluator manusia'",
        "type": "pitfall",
        "body": "Yang benar: judge harus dikalibrasi dulu terhadap manusia (agreement ≥ 0,8) DAN di-rekalibrasi berkala — LLM judge bisa drift mengikuti update model. Tanpa itu, ia mengukur dirinya sendiri.",
      },
      "hints": [
        "agreement = sum(1 for h, j in zip(human, judge) if h == j) / n.",
        "cost = n * 0.002.",
        "verdict = 'layak' jika agreement >= 0.8 else 'belum layak'.",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "import random\n"
          "random.seed(61)\n"
          "n = 200\n"
          "human = [random.choice([0, 1]) for _ in range(n)]\n"
          "judge = [h if random.random() < 0.85 else 1 - h for h in human]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: validasi LLM-as-judge\n"
          "agreement = \n"
          "cost = \n"
          "verdict = \n"
          "\n"
          "print(f\"agreement={agreement:.2f}  cost=${cost:.2f}  verdict={verdict}\")"
        ),
        "lockLines": 7,
        "solution": (
          "# === SEED TERKUNCI: jangan ubah 3 baris berikut ===\n"
          "import random\n"
          "random.seed(61)\n"
          "n = 200\n"
          "human = [random.choice([0, 1]) for _ in range(n)]\n"
          "judge = [h if random.random() < 0.85 else 1 - h for h in human]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: validasi LLM-as-judge\n"
          "agreement = sum(1 for h, j in zip(human, judge) if h == j) / n\n"
          "cost = n * 0.002\n"
          "verdict = \"layak\" if agreement >= 0.8 else \"belum layak\"\n"
          "\n"
          "print(f\"agreement={agreement:.2f}  cost=${cost:.2f}  verdict={verdict}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "agreement", "value": 0.82, "tol": 0.01, "label": "`agreement` ≈ 0.82", "msg": "Judge setuju dengan manusia 82% — di atas ambang 0.8."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "verdict=layak", "label": "`print` memvonis layak", "msg": "0.82 ≥ 0.8 → layak dipakai sebagai juri."},
        ],
      },
      "reference": "Validasi judge = bandingkan dengan ground truth manusia. Ulangi berkala.",
    },
    {
      "id": "ops", "eyebrow": "Langkah 5 · Cost, latency, guardrails",
      "title": "Harga nyata memakai LLM di produksi",
      "prose": [
        "Cost: LLM API ditagih per token. 3 juta pertanyaan/bulan × $0,012 = $36.000/bulan (mini-case MLE11). Tuas: cache, routing ke model kecil, prompt lebih pendek.",
        "Latency: ratusan ms hingga detik — jauh di atas SLO real-time ketat. Solusi: streaming token (UX terasa cepat), atau LLM hanya untuk jalur kompleks.",
        "Non-determinisme: prompt sama bisa hasil beda (temperature > 0). Untuk keputusan konsisten: temperature 0 + validasi output terstruktur (JSON schema).",
        "Guardrails: filter input (PII, prompt injection), filter output (konten berbahaya), dan fallback ke sistem klasik jika LLM gagal/timeout. LLM tanpa guardrails di produksi = pintu terbuka.",
      ],
      "note": {
        "title": "💡 Intuisi: LLM adalah karyawan brilian yang kadang mengarang",
        "body": "Kamu tidak memberi karyawan baru akses produksi tanpa supervisi. Perlakukan LLM sama: batasi wewenangnya, verifikasi outputnya, siapkan fallback-nya.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "LLM atau model klasik?",
      "prose": [
        "Skenario 1 — Klasifikasi intent chatbot, 10 ribu contoh → embedding + cosine/kNN. Alasan: murah, cepat, F1 0,91 tanpa training (cerita pembuka).",
        "Skenario 2 — Ringkasan dokumen kompleks bervolume rendah → LLM via prompt. Alasan: fleksibilitas mengalahkan biaya untuk kasus sulit dan jarang.",
        "Skenario 3 — Fraud real-time 5.000 rps, SLO 100ms → model klasik (gradient boosting). Alasan: LLM terlalu lambat dan mahal untuk throughput ini.",
        "Skenario 4 — Evaluasi 100 ribu ringkasan/bulan → LLM-as-judge (setelah validasi agreement ≥ 0,8). Alasan: manusia tidak berskala; judge tervalidasi cukup baik.",
        "Aturan praktis 10 detik: (1) Apakah embedding + sederhana cukup? (2) Apakah latency/biaya LLM masuk akal untuk volumenya? (3) Apakah output butuh determinisme? Jawaban menentukan peran LLM.",
      ],
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "E-commerce: search yang mengerti 'sepatu lari murah'",
      "prose": [
        "Search keyword lama: 'sepatu lari murah' → cocokkan kata → hasil sedikit karena produk bertuliskan 'running shoes diskon'. Conversion search: 1,8%.",
        "Solusi embedding: embed 2 juta produk sekali (offline, $400), embed query saat datang, cosine top-20. 'Sepatu lari murah' kini menemukan 'running shoes diskon' — makna, bukan kata. Conversion: 1,8% → 3,1% (+72%).",
        "Biaya operasional: embedding query $0,0001 + vector search 40ms — jauh di bawah SLO 300ms. Tidak ada LLM generatif sama sekali.",
        "Pertanyaan: (a) Kenapa tidak pakai LLM generatif untuk search? (b) Kapan embedding perlu di-refresh? (c) Risiko terbesar?",
        "Pembahasan: (a) Search butuh retrieval cepat dan murah per query — LLM generatif lambat, mahal, dan tidak memberi ranking deterministik. (b) Saat katalog berubah signifikan (produk baru tidak punya embedding) atau model embedding di-upgrade → re-embed terjadwal + versioning (MLE8!). (c) Drift makna: embedding lama untuk tren baru ('quiet luxury') — monitor kualitas retrieval via click-through rate.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu",
      "prose": ["Lima pertanyaan campuran dari semua langkah."],
      "tasks": [],
      "summary": [
        "Hierarki usaha NLP: embedding + sederhana → prompt LLM → fine-tune (terakhir).",
        "Cosine similarity mengukur kedekatan makna (arah vektor).",
        "Tiga peran LLM: pemberi fitur (termurah), pekerja (fleksibel), juri (harus divalidasi).",
        "LLM-as-judge butuh agreement ≥ 0,8 vs manusia + rekalibrasi berkala.",
        "LLM mahal, lambat, non-deterministik — butuh guardrails dan fallback.",
        "Untuk throughput tinggi / SLO ketat, model klasik sering menang.",
      ],
      "next": {"label": "MLE14 — Capstone: Sistem ML End-to-End", "href": "/v2/learn/mle14-capstone"},
      "quiz": [
        {
          "q": "Klasifikasi intent, 10 ribu contoh, butuh cepat. Pendekatan pertama?",
          "options": [
            {"text": "Fine-tune LLM 70B", "why": "Opsi terakhir — mahal dan lambat untuk masalah ini."},
            {"text": "Embedding + cosine/kNN", "why": "Tepat: 2 hari, F1 0,91 — mulai dari yang termurah.", "correct": True},
            {"text": "Rule-based manual", "why": "Intent bahasa terlalu variatif untuk aturan manual."},
            {"text": "Tidak usah dibuat", "why": "Solusi murah tersedia; tidak ada alasan menunda."},
          ],
        },
        {
          "q": "Kenapa cosine similarity (bukan Euclidean) untuk embedding teks?",
          "options": [
            {"text": "Lebih cepat dihitung", "why": "Keduanya sebanding secara komputasi."},
            {"text": "Arah vektor membawa makna; panjang sering artefak", "why": "Tepat: cosine fokus pada arah, mengabaikan panjang.", "correct": True},
            {"text": "Euclidean tidak bisa untuk vektor", "why": "Euclidean valid untuk vektor; hanya kurang tepat untuk makna."},
            {"text": "Cosine selalu 1", "why": "Tidak — bervariasi 0 hingga 1 sesuai kedekatan."},
          ],
        },
        {
          "q": "LLM-as-judge agreement 0,65 vs manusia. Keputusan?",
          "options": [
            {"text": "Pakai saja, lumayan", "why": "0,65 < 0,8 — juri tidak cukup selaras dengan manusia."},
            {"text": "Belum layak — perbaiki prompt/kalibrasi atau tetap pakai manusia", "why": "Tepat: di bawah ambang, ia adalah opini mahal bukan metrik.", "correct": True},
            {"text": "Naikkan temperature", "why": "Menaikkan temperature menambah variansi, bukan agreement."},
            {"text": "Kurangi sampel validasi", "why": "Mengurangi sampel menyembunyikan masalah, bukan memperbaikinya."},
          ],
        },
        {
          "q": "Fraud real-time 5.000 rps, SLO 100ms. Pilihan arsitektur?",
          "options": [
            {"text": "LLM via API untuk tiap transaksi", "why": "Terlalu lambat (detik) dan mahal untuk 5.000 rps."},
            {"text": "Model klasik (boosting) yang teroptimasi", "why": "Tepat: latency ms, biaya rendah, throughput tinggi.", "correct": True},
            {"text": "Manual review semua", "why": "Tidak berskala untuk 5.000/detik."},
            {"text": "Embedding + LLM chain", "why": "Menambah latency berlapis — berlawanan dengan SLO."},
          ],
        },
        {
          "q": "Risiko terbesar LLM di produksi tanpa guardrails?",
          "options": [
            {"text": "Terlalu akurat", "why": "Bukan risiko."},
            {"text": "Output tak terduga (halusinasi, prompt injection) tanpa fallback", "why": "Tepat: non-determinisme + input jahat = insiden tanpa pengaman.", "correct": True},
            {"text": "Kode terlalu rapi", "why": "Tidak relevan."},
            {"text": "Terlalu murah", "why": "LLM justru mahal; dan murah bukan risiko."},
          ],
        },
      ],
    },
  ],
}

# ==================== MLE14 ====================
mle14 = {
  "slug": "mle14-capstone", "track": "Machine Learning Engineer",
  "module": "Skala & Tanggung Jawab", "title": "MLE14 — Capstone: Sistem ML End-to-End", "estMinutes": 60,
  "steps": [
    {
      "id": "mulai", "eyebrow": "Langkah 1 · Mulai dari sini",
      "title": "Peta lesson dan tujuan",
      "prose": [
        "13 lesson membangun kepingan puzzle: pipeline, reproducibility, evaluasi, serving, monitoring, testing, versioning, CI/CD, scaling, cost, fairness, LLM. Capstone merakitnya menjadi satu sistem yang hidup.",
        "Tujuan lesson ini:",
        "• Menjalankan pipeline mini end-to-end: data → training → evaluasi → gate → monitoring.",
        "• Menghubungkan setiap tahap dengan lesson yang membahasnya.",
        "• Merancang proyek capstone mandiri dengan checklist deliverables.",
        "• Menyusun roadmap 90 hari menjadi MLE yang siap produksi.",
        "Isi lesson: cerita 'toko' mini-MLOps → lab pipeline end-to-end → brief proyek capstone → peta keputusan karir → mini-case insiden → checkpoint.",
      ],
      "tasks": [],
    },
    {
      "id": "cerita", "eyebrow": "Langkah 2 · Cerita pembuka",
      "title": "Toko kelontong dan sistem ML pertamamu",
      "prose": [
        "Bayangkan kamu diminta membangun sistem ML untuk toko kelontong: prediksi stok harian. Kedengarannya sepele — sampai kamu daftar apa saja yang dibutuhkan: pipeline data penjualan (MLE2), training yang bisa diulang (MLE3), evaluasi yang jujur (MLE4), serving ke aplikasi kasir (MLE5), monitoring saat pola belanja berubah (MLE6), test agar tidak kacau (MLE7), versioning (MLE8), retrain otomatis (MLE9).",
        "Twist-nya: 'proyek kecil' ini menyentuh SEMUA 13 lesson. Tidak ada sistem ML produksi yang 'hanya butuh model bagus' — selalu butuh sistem di sekelilingnya.",
        "Kabar baik: kamu sekarang punya peta lengkapnya. Lab berikut adalah simulasi satu putaran hidup sistem itu — dari data mentah hingga keputusan deploy dan sinyal monitoring.",
        "Setiap baris output lab terhubung ke satu lesson. Bacalah output-nya sebagai cerita, bukan sekadar angka.",
      ],
      "tasks": [],
    },
    {
      "id": "pipeline", "eyebrow": "Langkah 3 · Lab end-to-end",
      "title": "Satu putaran hidup sistem ML",
      "prose": [
        "Pipeline mini ini mensimulasikan kasus persetujuan kredit mikro (600 aplikasi, fitur usia + gaji):",
        "Tahap 1 — Data (MLE2): generate 600 sampel dengan seed terkunci, split 80/20. Tahap 2 — Training (MLE3): logistic regression dari nol, 500 epoch, seed tetap → reproducible.",
        "Tahap 3 — Evaluasi (MLE4): akurasi 0,783, precision 0,800, recall 0,800 — bukan akurasi semata. Tahap 4 — Quality gate (MLE9): syarat acc ≥ 0,75 dan precision ≥ 0,6 → DEPLOY.",
        "Tahap 5 — Monitoring (MLE6): 400 sampel 'serving' dengan distribusi usia bergeser → PSI 0,213 = 'waspada'. Sistem deploy TETAPI memberi peringatan dini — persis seperti seharusnya: deploy bukan akhir, melainkan awal pengawasan.",
        "Coba ubah: naikkan ambang gate ke 0,85 — apa keputusannya? Turunkan pergeseran serving — apa kata PSI?",
      ],
      "tasks": [
        {"id": "t1", "text": "Jalankan training logistic regression (kode terkunci), hitung `acc`, `precision`, `recall`"},
        {"id": "t2", "text": "Terapkan quality gate → `gate` ('DEPLOY'/'DITAHAN')"},
        {"id": "t3", "text": "Hitung `psi` distribusi usia train vs serving, cetak laporan 3 baris"},
      ],
      "expected": "",
      "note": {
        "title": "💡 Intuisi: pipeline yang baik bercerita",
        "body": "Setiap tahap menghasilkan artefak + keputusan yang bisa dijelaskan ke orang lain. Jika ada tahap yang 'pokoknya jalan', di situlah insiden masa depan bersembunyi.",
      },
      "hints": [
        "Kode training/evaluasi terkunci — fokus pada gate dan PSI.",
        "gate = 'DEPLOY' jika acc >= 0.75 and precision >= 0.6.",
        "PSI: binning 8 bin, jumlahkan (a-e)*ln(a/e).",
      ],
      "code": {
        "starter": (
          "# === SEED TERKUNCI: blok data + training, jangan ubah ===\n"
          "import random, math\n"
          "random.seed(71)\n"
          "n = 600\n"
          "X = [(random.gauss(35, 8), random.gauss(8, 3)) for _ in range(n)]\n"
          "y = [1 if 0.05*u + 0.3*g + random.gauss(0, 0.8) > 4.0 else 0 for u, g in X]\n"
          "split = int(n*0.8)\n"
          "Xtr_raw, ytr = X[:split], y[:split]\n"
          "Xte_raw, yte = X[split:], y[split:]\n"
          "mu = [sum(c)/len(Xtr_raw) for c in zip(*Xtr_raw)]\n"
          "sd = [math.sqrt(sum((r[i]-mu[i])**2 for r in Xtr_raw)/len(Xtr_raw)) for i in range(2)]\n"
          "def std(Xs):\n"
          "    return [[(r[i]-mu[i])/sd[i] for i in range(2)] for r in Xs]\n"
          "Xtr, Xte = std(Xtr_raw), std(Xte_raw)\n"
          "w = [0.0, 0.0]; b = 0.0; lr = 0.5\n"
          "for _ in range(500):\n"
          "    gw = [0.0, 0.0]; gb = 0.0\n"
          "    for (x1, x2), t in zip(Xtr, ytr):\n"
          "        p = 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b)))\n"
          "        e = p - t\n"
          "        gw[0] += e*x1; gw[1] += e*x2; gb += e\n"
          "    m = len(Xtr)\n"
          "    w[0] -= lr*gw[0]/m; w[1] -= lr*gw[1]/m; b -= lr*gb/m\n"
          "def pred(xs):\n"
          "    return [1 if 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b))) >= 0.5 else 0 for x1, x2 in xs]\n"
          "yp = pred(Xte)\n"
          "srv = [random.gauss(38, 8) for _ in range(400)]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: evaluasi\n"
          "tp = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 1)\n"
          "fp = sum(1 for t, p in zip(yte, yp) if t == 0 and p == 1)\n"
          "fn = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 0)\n"
          "acc = \n"
          "precision = \n"
          "recall = \n"
          "\n"
          "# TULIS KODEMU: quality gate (MLE9)\n"
          "gate = \n"
          "\n"
          "# TULIS KODEMU: monitoring PSI usia (MLE6)\n"
          "def bins(xs, lo=10, hi=65, nb=8):\n"
          "    c = [0]*nb\n"
          "    for x in xs:\n"
          "        c[min(nb-1, max(0, int((x-lo)/(hi-lo)*nb)))] += 1\n"
          "    return [v/len(xs) for v in c]\n"
          "pe = bins([r[0] for r in Xtr_raw])\n"
          "pa = bins(srv)\n"
          "psi = 0.0\n"
          "for a, e in zip(pa, pe):\n"
          "    if a > 0 and e > 0:\n"
          "        psi += \n"
          "\n"
          "print(f\"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}\")\n"
          "print(f\"gate={gate}\")\n"
          "print(f\"psi_usia={psi:.3f}\")"
        ),
        "lockLines": 29,
        "solution": (
          "# === SEED TERKUNCI: blok data + training, jangan ubah ===\n"
          "import random, math\n"
          "random.seed(71)\n"
          "n = 600\n"
          "X = [(random.gauss(35, 8), random.gauss(8, 3)) for _ in range(n)]\n"
          "y = [1 if 0.05*u + 0.3*g + random.gauss(0, 0.8) > 4.0 else 0 for u, g in X]\n"
          "split = int(n*0.8)\n"
          "Xtr_raw, ytr = X[:split], y[:split]\n"
          "Xte_raw, yte = X[split:], y[split:]\n"
          "mu = [sum(c)/len(Xtr_raw) for c in zip(*Xtr_raw)]\n"
          "sd = [math.sqrt(sum((r[i]-mu[i])**2 for r in Xtr_raw)/len(Xtr_raw)) for i in range(2)]\n"
          "def std(Xs):\n"
          "    return [[(r[i]-mu[i])/sd[i] for i in range(2)] for r in Xs]\n"
          "Xtr, Xte = std(Xtr_raw), std(Xte_raw)\n"
          "w = [0.0, 0.0]; b = 0.0; lr = 0.5\n"
          "for _ in range(500):\n"
          "    gw = [0.0, 0.0]; gb = 0.0\n"
          "    for (x1, x2), t in zip(Xtr, ytr):\n"
          "        p = 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b)))\n"
          "        e = p - t\n"
          "        gw[0] += e*x1; gw[1] += e*x2; gb += e\n"
          "    m = len(Xtr)\n"
          "    w[0] -= lr*gw[0]/m; w[1] -= lr*gw[1]/m; b -= lr*gb/m\n"
          "def pred(xs):\n"
          "    return [1 if 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b))) >= 0.5 else 0 for x1, x2 in xs]\n"
          "yp = pred(Xte)\n"
          "srv = [random.gauss(38, 8) for _ in range(400)]\n"
          "# === AKHIR BLOK TERKUNCI ===\n"
          "\n"
          "# TULIS KODEMU: evaluasi\n"
          "tp = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 1)\n"
          "fp = sum(1 for t, p in zip(yte, yp) if t == 0 and p == 1)\n"
          "fn = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 0)\n"
          "acc = sum(1 for t, p in zip(yte, yp) if t == p) / len(yte)\n"
          "precision = tp / (tp + fp)\n"
          "recall = tp / (tp + fn)\n"
          "\n"
          "# TULIS KODEMU: quality gate (MLE9)\n"
          "gate = \"DEPLOY\" if acc >= 0.75 and precision >= 0.6 else \"DITAHAN\"\n"
          "\n"
          "# TULIS KODEMU: monitoring PSI usia (MLE6)\n"
          "def bins(xs, lo=10, hi=65, nb=8):\n"
          "    c = [0]*nb\n"
          "    for x in xs:\n"
          "        c[min(nb-1, max(0, int((x-lo)/(hi-lo)*nb)))] += 1\n"
          "    return [v/len(xs) for v in c]\n"
          "pe = bins([r[0] for r in Xtr_raw])\n"
          "pa = bins(srv)\n"
          "psi = 0.0\n"
          "for a, e in zip(pa, pe):\n"
          "    if a > 0 and e > 0:\n"
          "        psi += (a - e) * math.log(a/e)\n"
          "\n"
          "print(f\"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}\")\n"
          "print(f\"gate={gate}\")\n"
          "print(f\"psi_usia={psi:.3f}\")"
        ),
        "checks": [
          {"kind": "equal", "task": "t1", "name": "acc", "value": 0.783, "tol": 0.002, "label": "`acc` ≈ 0.783", "msg": "Evaluasi pada 120 sampel test."},
          {"kind": "equal", "task": "t2", "name": "gate", "value": "DEPLOY", "tol": 1e-9, "label": "`gate` = DEPLOY", "msg": "0.783 ≥ 0.75 dan 0.800 ≥ 0.6 → lolos gate."},
          {"kind": "equal", "task": "t3", "name": "psi", "value": 0.213, "tol": 0.01, "label": "`psi` ≈ 0.213", "msg": "Zona waspada — deploy dengan pengawasan."},
          {"kind": "stdout_matches", "task": "t3", "pattern": "gate=DEPLOY", "label": "Laporan menampilkan gate", "msg": "Tiga baris: metrik, gate, psi."},
        ],
      },
      "reference": "End-to-end = data → train → eval → gate → monitor. Satu putaran hidup sistem.",
    },
    {
      "id": "brief", "eyebrow": "Langkah 4 · Brief proyek capstone",
      "title": "Proyek mandiri: sistem ML produksi mini",
      "prose": [
        "Tugas capstone (kerjakan 2–4 minggu): bangun SATU sistem ML end-to-end untuk kasus pilihanmu (skor kredit mikro, prediksi churn, atau screening CV). Deliverables wajib:",
        "1. Pipeline data reproducible: script + seed + validasi data (MLE2, MLE7). 2. Training reproducible: config file + experiment log + dataset berversion (MLE3, MLE8). 3. Evaluasi jujur: bukan cuma akurasi — precision/recall, kalibrasi, slice (MLE4).",
        "4. Serving: pilih pola (batch/online) dengan justifikasi biaya-latency (MLE5, MLE11). 5. Monitoring: dashboard PSI + alarm anti-noise + runbook (MLE6). 6. CI/CD: training pipeline + quality gate + canary plan (MLE9). 7. Fairness check: metrik per grup + mitigasi jika perlu (MLE12).",
        "Kriteria kelulusan: orang lain bisa menjalankan ulang pipeline-mu dari nol dan mendapat hasil sama (reproducibility); setiap keputusan desain ada justifikasi angka (bukan opini); ada runbook untuk 3 skenario kegagalan.",
        "Ini adalah portofolio yang membedakanmu: 90% kandidat menunjukkan notebook; kamu menunjukkan SISTEM.",
      ],
      "note": {
        "title": "🚨 Mitos: 'capstone = model dengan akurasi tertinggi'",
        "type": "pitfall",
        "body": "Yang benar: capstone dinilai dari sistemnya — reproducibility, testing, monitoring, dan justifikasi keputusan. Model 85% dengan sistem rapi mengalahkan model 92% tanpa sistem.",
      },
      "tasks": [],
    },
    {
      "id": "roadmap", "eyebrow": "Langkah 5 · Roadmap 90 hari",
      "title": "Dari sini ke MLE yang siap produksi",
      "prose": [
        "Hari 1–30 — Fondasi: kuasai Python packaging, Docker, git advanced, SQL. Bangun 1 pipeline batch end-to-end (data → model → API sederhana). Target: deploy 1 model ke server/VPS.",
        "Hari 31–60 — Operasi: tambah monitoring (PSI + alarm), testing (validasi data + invariant), CI/CD (training otomatis + gate). Target: pipeline berjalan sendiri 2 minggu tanpa disentuh.",
        "Hari 61–90 — Tanggung jawab: fairness audit, cost optimization, dokumentasi + runbook. Target: capstone selesai dan bisa didemokan — termasuk simulasi kegagalan dan rollback.",
        "Prinsip sepanjang jalan: setiap minggu, satu artefak yang bisa ditunjukkan. Bukan tutorial yang ditonton — sistem yang dibangun.",
        "Peta keputusan karir: (1) Suka sistem + data → MLE. (2) Suka modeling murni → Data Scientist/Research. (3) Suka infra tanpa model → Platform/DevOps. Ketiganya valid — pilih yang membuatmu bertahan 10 tahun.",
      ],
      "note": {
        "title": "💡 Intuisi: portofolio sistem > sertifikat",
        "body": "Pewawancara MLE tidak bertanya 'berapa akurasimu?' — mereka bertanya 'ceritakan sistem tersulit yang pernah kamu operasikan'. Capstone-mu adalah jawaban itu.",
      },
      "tasks": [],
    },
    {
      "id": "peta-keputusan", "eyebrow": "Langkah 6 · Peta keputusan",
      "title": "Membawa pulang: kapan memakai apa",
      "prose": [
        "Skenario 1 — 'Modelku bagus di notebook, mau produksi minggu depan' → mulai dari MLE1+MLe5: definisikan kontrak serving + latency budget DULU, baru training ulang yang reproducible.",
        "Skenario 2 — 'Model produksiku performanya turun' → MLE6: cek drift input dulu (PSI), bukan langsung retrain. 70% kasus = masalah data, bukan model.",
        "Skenario 3 — 'Timku 1 orang, 3 model' → MLE2+MLE9: pipeline sederhana yang terjadwal + quality gate. Otomatisasi menggantikan tim yang tidak ada.",
        "Skenario 4 — 'Mau pindah karir ke MLE' → ikuti roadmap 90 hari di Langkah 5 + capstone. Satu sistem rapi > 10 sertifikat.",
        "Aturan praktis 10 detik untuk SEMUA lesson: (1) Apa buktinya (angka)? (2) Apa yang bisa gagal diam-diam? (3) Bagaimana cara kembali (rollback/reproduce)? Tiga pertanyaan ini adalah inti berpikir MLE.",
      ],
      "note": {
        "title": "🚨 Mitos: 'lulus track ini = siap jadi MLE'",
        "type": "pitfall",
        "body": "Yang benar: track ini memberi peta — kesiapan dibuktikan dengan sistem yang kamu operasikan sendiri (capstone). Tools berganti tiap 2 tahun; yang awet adalah prinsipnya: reproducibility, quality gate, monitoring, rollback.",
      },
      "tasks": [],
    },
    {
      "id": "minicase", "eyebrow": "Langkah 7 · Mini-case",
      "title": "Insiden 02.14: semua lesson dalam satu malam",
      "prose": [
        "Sebuah e-commerce mengalami insiden: rekomendasi voucher kacau jam 02.14. Investigasi menemukan RANTAI kegagalan: (1) ETL partner mengubah format diam-diam → (2) validasi data tidak ada → (3) fitur korup masuk training otomatis → (4) quality gate hanya cek AUC (naik palsu) → (5) auto-deploy 100% langsung → (6) monitoring PSI ada tetapi alarm di-mute (alert fatigue).",
        "Kerugian: 9 jam, Rp2,8 miliar voucher salah sasaran.",
        "Pertanyaan: (a) Sebutkan lesson yang dilanggar di tiap rantai! (b) Satu perubahan mana yang memutus rantai paling awal? (c) Berapa 'harga' setiap pertahanan yang absen?",
        "Pembahasan: (a) MLE2 (validasi/pipeline), MLE7 (test), MLE9 (gate + canary), MLE6 (alarm). (b) Validasi data di ingestion — rantai putus di mata rantai pertama, biaya termurah. (c) Inilah pelajaran pertahanan berlapis: tiap lapisan murah sendiri-sendiri; absennya SEMUA yang mahal. Sistem yang baik tidak mengandalkan satu pahlawan — ia mengandalkan lapisan.",
      ],
      "tasks": [],
    },
    {
      "id": "checkpoint", "eyebrow": "Checkpoint",
      "title": "Uji pemahamanmu — ujian akhir track",
      "prose": ["Enam pertanyaan dari seluruh track. Kelulusan: ≥ 5 benar."],
      "tasks": [],
      "summary": [
        "Sistem ML = model + pipeline + serving + monitoring + testing + versioning + CI/CD.",
        "Kegagalan termahal selalu silent — pertahanan berlapis adalah jawabannya.",
        "Setiap keputusan butuh angka: cost matrix, latency budget, PSI, gate.",
        "Reproducibility, versioning, dan lineage = kemampuan kembali ke masa lalu.",
        "Fairness dan cost bukan tambahan — mereka bagian dari definisi 'sistem yang baik'.",
        "Mulai dari yang termurah: validasi data, seed, config — baru yang mahal.",
      ],
      "next": {"label": "Kembali ke Kurikulum", "href": "/v2/learn"},
      "quiz": [
        {
          "q": "Model 'bagus' tetapi 3 bulan tidak di-retrain karena SOP manual. Solusi sistemik?",
          "options": [
            {"text": "Ingatkan tim lebih tegas", "why": "Mengandalkan ingatan manusia = mengulang kegagalan."},
            {"text": "Training pipeline otomatis + quality gate (CI/CD untuk ML)", "why": "Tepat (MLE9): detak jantung otomatis, bukan SOP Jumat.", "correct": True},
            {"text": "Naikkan akurasi model", "why": "Akurasi bukan masalahnya; kebasian model yang masalah."},
            {"text": "Beli GPU lebih banyak", "why": "Tidak berhubungan dengan proses retraining."},
          ],
        },
        {
          "q": "Akurasi validasi 95%, produksi 51%. Diagnosis pertama?",
          "options": [
            {"text": "Data leakage", "why": "Tepat (MLE2): sidik jari klasik — validasi fantastis, produksi acak.", "correct": True},
            {"text": "Learning rate", "why": "Akan terlihat di validasi juga."},
            {"text": "Kurang epoch", "why": "Validasi 95% menunjukkan training cukup."},
            {"text": "Server lambat", "why": "Latency tidak mengubah akurasi menjadi 51%."},
          ],
        },
        {
          "q": "8 GPU lebih lambat dari 4 GPU. Penjelasan?",
          "options": [
            {"text": "GPU rusak", "why": "Pola sistematis, bukan kerusakan acak."},
            {"text": "Overhead komunikasi melewati titik optimal (Hukum Amdahl + overhead)", "why": "Tepat (MLE10): tambah GPU di atas n* = lebih lambat + lebih mahal.", "correct": True},
            {"text": "Data terlalu kecil", "why": "Mungkin berkontribusi, tetapi penjelasan utamanya overhead."},
            {"text": "Model terlalu sederhana", "why": "Tidak menjelaskan pembalikan tren 4→8 GPU."},
          ],
        },
        {
          "q": "DI ratio 0,60 pada model hiring. Tindakan?",
          "options": [
            {"text": "Abaikan, akurasi global bagus", "why": "Akurasi global menyembunyikan ketidakadilan (MLE12)."},
            {"text": "Investigasi + mitigasi (ukur per grup, cek proxy, sesuaikan)", "why": "Tepat (MLE12): di bawah 0,8 = investigasi wajib.", "correct": True},
            {"text": "Hapus data grup minoritas", "why": "Menyembunyikan masalah, bukan menyelesaikan."},
            {"text": "Naikkan akurasi global", "why": "Bisa tetap timpang bahkan jika akurasi naik."},
          ],
        },
        {
          "q": "Alarm monitoring berbunyi 50x/hari, semua diabaikan. Perbaikan?",
          "options": [
            {"text": "Tambah alarm lagi", "why": "Memperparah alert fatigue."},
            {"text": "Anti-noise: smoothing, deadband, multi-window + runbook per alarm", "why": "Tepat (MLE6): alarm yang dipercaya > alarm yang banyak.", "correct": True},
            {"text": "Matikan monitoring", "why": "Buta total lebih buruk dari noise."},
            {"text": "Ganti tim", "why": "Masalah desain sistem, bukan orangnya."},
          ],
        },
        {
          "q": "Satu prinsip yang merangkum seluruh track?",
          "options": [
            {"text": "Akurasi adalah segalanya", "why": "14 lesson membuktikan sebaliknya."},
            {"text": "Kejar model terbesar", "why": "Biaya dan latency adalah batas nyata."},
            {"text": "Bangun sistem yang jujur, terukur, dan bisa kembali — bukan cuma model yang akurat", "why": "Tepat: reproducibility, testing berlapis, monitoring, dan angka di setiap keputusan.", "correct": True},
            {"text": "Otomatisasi semuanya tanpa gate", "why": "Otomatisasi tanpa gate = bencana yang cepat (MLE9)."},
          ],
        },
      ],
    },
  ],
}

# ==================== EMITTER ====================
def emit_value(v, indent):
    if isinstance(v, str):
        return ts_str(esc_prose(v))
    if isinstance(v, bool):
        return "true" if v else "false"
    if v is None:
        return "null"
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, (list, tuple)):
        if not v:
            return "[]"
        inner = (",\n" + " " * (indent + 2)).join(emit_value(x, indent + 2) for x in v)
        return "[\n" + " " * (indent + 2) + inner + ",\n" + " " * indent + "]"
    if isinstance(v, dict):
        if not v:
            return "{}"
        parts = []
        for k, val in v.items():
            parts.append(" " * (indent + 2) + f'"{k}": {emit_value(val, indent + 2)}')
        return "{\n" + ",\n".join(parts) + ",\n" + " " * indent + "}"
    raise TypeError(f"unsupported {type(v)}")

def emit_check(c, indent):
    p = " " * indent
    lines = [p + "{"]
    order = ["kind", "task", "label", "name", "value", "tol", "pattern", "token", "msg"]
    for k in order:
        if k in c and c[k] is not None:
            lines.append(p + f'  "{k}": {emit_value(c[k], indent + 2)},')
    lines.append(p + "},")
    return "\n".join(lines)

def emit_code(code, indent):
    p = " " * indent
    out = [p + "code: {"]
    out.append(p + f"  starter: {ts_tpl(code['starter'])},")
    out.append(p + f"  lockLines: {code['lockLines']},")
    out.append(p + f"  solution: {ts_tpl(code['solution'])},")
    out.append(p + "  checks: [")
    for c in code["checks"]:
        out.append(emit_check(c, indent + 4))
    out.append(p + "  ],")
    out.append(p + "},")
    return "\n".join(out)

def emit_step(s, indent):
    p = " " * indent
    out = [p + "{"]
    out.append(p + f'  id: {ts_str(s["id"])},')
    out.append(p + f'  eyebrow: {ts_str(esc_prose(s["eyebrow"]))},')
    if s.get("requires"):
        out.append(p + f'  requires: {emit_value(s["requires"], indent + 2)},')
    out.append(p + f'  title: {ts_str(esc_prose(s["title"]))},')
    out.append(p + "  prose: [")
    for para in s["prose"]:
        out.append(p + f"    {ts_str(esc_prose(para))},")
    out.append(p + "  ],")
    if s.get("formula"):
        out.append(p + f"  formula: String.raw{ts_raw_tpl(s['formula'])},")
    if s.get("formulaNote"):
        out.append(p + f"  formulaNote: {ts_str(esc_prose(s['formulaNote']))},")
    if s.get("figure"):
        f = s["figure"]
        out.append(p + "  figure: {")
        out.append(p + f"    svg: {ts_tpl(f['svg'])},")
        out.append(p + f"    alt: {ts_str(esc_prose(f['alt']))},")
        out.append(p + f"    caption: {ts_str(esc_prose(f['caption']))},")
        out.append(p + "  },")
    out.append(p + "  tasks: [")
    for t in s["tasks"]:
        out.append(p + f'    {{ id: {ts_str(t["id"])}, text: {ts_str(esc_prose(t["text"]))} }},')
    out.append(p + "  ],")
    if s.get("expected") is not None:
        out.append(p + f'  expected: {ts_str(esc_prose(s["expected"]))},')
    if s.get("note"):
        n = s["note"]
        out.append(p + "  note: {")
        out.append(p + f'    title: {ts_str(esc_prose(n["title"]))},')
        if n.get("type"):
            out.append(p + f'    type: {ts_str(n["type"])},')
        out.append(p + f'    body: {ts_str(esc_prose(n["body"]))},')
        out.append(p + "  },")
    if s.get("hints"):
        out.append(p + "  hints: [")
        for h in s["hints"]:
            out.append(p + f"    {ts_str(esc_prose(h))},")
        out.append(p + "  ],")
    if s.get("code"):
        out.append(emit_code(s["code"], indent + 2))
    if s.get("quiz"):
        out.append(p + "  quiz: [")
        for q in s["quiz"]:
            out.append(p + "    {")
            out.append(p + f'      q: {ts_str(esc_prose(q["q"]))},')
            out.append(p + "      options: [")
            for o in q["options"]:
                out.append(p + "        {")
                out.append(p + f'          text: {ts_str(esc_prose(o["text"]))},')
                out.append(p + f'          why: {ts_str(esc_prose(o["why"]))},')
                if o.get("correct"):
                    out.append(p + "          correct: true,")
                out.append(p + "        },")
            out.append(p + "      ],")
            out.append(p + "    },")
        out.append(p + "  ],")
    if s.get("summary"):
        out.append(p + "  summary: [")
        for sm in s["summary"]:
            out.append(p + f"    {ts_str(esc_prose(sm))},")
        out.append(p + "  ],")
    if s.get("next"):
        out.append(p + f'  next: {{ label: {ts_str(esc_prose(s["next"]["label"]))}, href: {ts_str(s["next"]["href"])} }},')
    if s.get("reference"):
        out.append(p + f'  reference: {ts_str(esc_prose(s["reference"]))},')
    out.append(p + "},")
    return "\n".join(out)

def emit_lesson(varname, lesson):
    out = ['import type { V2Lesson } from "../lib/types";', ""]
    fig_consts = []
    out.append(f"export const {varname}: V2Lesson = {{")
    out.append(f'  slug: "{lesson["slug"]}",')
    out.append(f'  track: "{lesson["track"]}",')
    out.append(f'  module: "{lesson["module"]}",')
    out.append(f'  title: "{lesson["title"]}",')
    out.append(f'  estMinutes: {lesson["estMinutes"]},')
    out.append("  steps: [")
    for s in lesson["steps"]:
        out.append(emit_step(s, 4))
    out.append("  ],")
    out.append("};")
    out.append("")
    return "\n".join(out)

TRACK = [
    ("mle1", mle1), ("mle2", mle2), ("mle3", mle3), ("mle4", mle4),
    ("mle5", mle5), ("mle6", mle6), ("mle7", mle7), ("mle8", mle8),
    ("mle9", mle9), ("mle10", mle10), ("mle11", mle11), ("mle12", mle12),
    ("mle13", mle13), ("mle14", mle14),
]

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # 1. calibrate every lab
    for varname, lesson in TRACK:
        for s in lesson["steps"]:
            calibrate(s)
    print("ALL LABS CALIBRATED OK")
    # 2. emit lesson files
    for varname, lesson in TRACK:
        path = os.path.join(OUT_DIR, lesson["slug"] + ".ts")
        with open(path, "w") as f:
            f.write(emit_lesson(varname, lesson))
        print("wrote", path)
    # 3. emit registry
    reg = ['import type { V2Lesson } from "./types";']
    for varname, lesson in TRACK:
        reg.append(f'import {{ {varname} }} from "../content/{lesson["slug"]}";')
    reg.append("")
    reg.append("export const REG_MLE: Record<string, V2Lesson> = {")
    for varname, lesson in TRACK:
        reg.append(f'  "{lesson["slug"]}": {varname},')
    reg.append("};")
    reg.append("")
    regpath = os.path.expanduser("~/workspace/learn-platform/src/app/v2/lib/reg-mle.ts")
    with open(regpath, "w") as f:
        f.write("\n".join(reg))
    print("wrote", regpath)

if __name__ == "__main__":
    main()
