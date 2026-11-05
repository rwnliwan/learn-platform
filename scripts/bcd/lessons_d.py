#!/usr/bin/env python3
"""Track D: Python for Data Analysis — 16 lessons. Lab = Python runnable (Pyodide)."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from render import Lesson, T, TI, myth, tip, callout, worked, codebox, qa_lesson

LESSONS = []

# Kepala untuk lab yang butuh pandas/numpy/scipy/sklearn di Pyodide
PANDAS = "import micropip\nawait micropip.install('pandas')\n"
NUMPY = "import micropip\nawait micropip.install('numpy')\n"
SCIPY = "import micropip\nawait micropip.install('scipy')\n"
SKLEARN = "import micropip\nawait micropip.install('scikit-learn')\n"

# ================================================================== D1
def d1():
    L = Lesson("d1-python-dasar", "D1 — Python",
        "Python Dasar: Bahasa<br/>Kedua Seorang Analis",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c18-transaksi-acid", "← C18"), ("d2-struktur-data", "Next: D2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>tipe data dasar</strong> Python: int, float, str, bool, None.</li>"
        "<li>Menulis <strong>alur kontrol</strong>: if/else, for, while.</li>"
        "<li>Mendefinisikan <strong>fungsi</strong> dengan parameter &amp; return.</li>"
        "<li>Memahami <strong>mengapa Python</strong> untuk analisis (vs SQL).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: SQL Bertemu Batasnya")
    L.raw('<div className="story"><p>Kamu sudah kuasai SQL (track C!). Tapi suatu hari diminta: <em>&ldquo;Ambil data transaksi dari API, bersihkan, hitung model skor kredit, kirim email laporan otomatis tiap pagi.&rdquo;</em> SQL tidak bisa panggil API. SQL tidak bisa kirim email. SQL tidak bisa machine learning.</p>'
        "<p><strong>Python</strong> = bahasa general-purpose yang mengisi semua celah SQL: API, cleaning kompleks, statistik, ML, otomasi. Kombinasi <strong>SQL (ambil data) + Python (olah data)</strong> = 90% pekerjaan data analyst/scientist 2026. Track D mengajarkan Python <em>untuk analisis</em> — bukan Python umum.</p></div>")

    L.sec("tipe", "Tipe Data Dasar — Fondasi")
    L.raw(codebox("nama = 'Andi'        # str\numur = 32            # int\ngaji = 8500000.0     # float\naktif = True         # bool\nbonus = None         # None = 'tidak ada' (mirip NULL!)", "python"))
    L.ul([
        "<strong>Dynamic typing:</strong> tidak deklarasi tipe — Python menebak dari nilai.",
        "<strong>None</strong> = padanan NULL (C2!) — &ldquo;tidak tahu&rdquo;, bukan 0.",
        "<strong>Penting:</strong> <code className=\"inline\">'5' + 3</code> → ERROR (str + int)! Konversi eksplisit: <code className=\"inline\">int('5') + 3</code>.",
        "<strong>F-string:</strong> <code className=\"inline\">f&#39;Halo &#123;nama&#125;&#39;</code> — cara modern format teks.",
    ])
    L.raw(tip("Dua konversi yang menyelamatkan: <code className=\"inline\">float('8.5')</code> untuk parsing, <code className=\"inline\">str(x)</code> untuk tampil. Error 'can only concatenate str' = 99% masalah konversi tipe."))
    L.raw(myth("Python lambat, jadi tidak cocok untuk data besar.",
        "Python <em>murni</em> memang lambat untuk loop — tapi analis tidak loop manual! NumPy/pandas (D3/D4) menjalankan komputasi di <strong>C yang dikompilasi</strong> (vectorized). Python = &ldquo;lem&rdquo; yang mengatur; C = yang bekerja. Kombinasi ini memproses jutaan baris dengan cepat."))

    L.sec("kontrol", "Alur Kontrol — if / for / while")
    L.raw(codebox("dpd = 45\nif dpd == 0:\n    status = 'lancar'\nelif dpd <= 30:\n    status = 'ringan'\nelse:\n    status = 'bermasalah'\n\nfor i in range(3):\n    print(f'iterasi {i}')\n\nn = 0\nwhile n < 3:\n    n += 1", "python"))
    L.ul([
        "<strong>Indentasi = blok!</strong> Tidak ada kurung kurawal — spasi yang menentukan. Konsisten 4 spasi.",
        "<code className=\"inline\">range(3)</code> = 0,1,2 (berhenti <em>sebelum</em> 3!).",
        "<code className=\"inline\">elif</code> = else-if; <code className=\"inline\">break</code>/ <code className=\"inline\">continue</code> untuk kontrol loop.",
    ])
    L.raw(tip("Pola analis: <code className=\"inline\">for row in data:</code> untuk iterasi — tapi ingat, di pandas kamu akan <strong>menghindari loop</strong> (vectorize, D3/D4). Loop Python = untuk logika, bukan untuk komputasi massal."))

    L.sec("fungsi", "Fungsi — Bungkus Logika Jadi Reusable")
    L.raw(codebox("def bucket_dpd(dpd):\n    \"\"\"Kelompokkan DPD ke bucket risiko.\"\"\"\n    if dpd == 0:\n        return 'lancar'\n    elif dpd <= 30:\n        return 'ringan'\n    elif dpd <= 90:\n        return 'sedang'\n    return 'berat'\n\nprint(bucket_dpd(45))  # 'sedang'", "python"))
    L.ul([
        "<code className=\"inline\">def nama(param):</code> — definisi; <code className=\"inline\">return</code> — kembalikan nilai.",
        "<strong>Docstring</strong> (<code className=\"inline\">\"\"\"...\"\"\"</code>) = dokumentasi fungsi — tulis selalu!",
        "<strong>Aturan:</strong> fungsi = 1 tugas, < 20 baris, nama jelas (<code className=\"inline\">bucket_dpd</code> bukan <code className=\"inline\">f</code>).",
    ])
    L.raw(myth("Fungsi hanya untuk programmer.",
        "Analis menulis fungsi <em>setiap hari</em>: fungsi cleaning yang dipakai ulang, fungsi hitung metrik, fungsi plot. Tanpa fungsi = copy-paste = bug saat diubah di satu tempat tapi lupa di tempat lain. DRY: Don't Repeat Yourself."))
    L.raw(tip("Mulai biasakan: setiap kali copy-paste kode 2×, jadikan fungsi. Investasi 2 menit menghemat 20 menit debugging."))

    L.chart(
        data=[{"x": ["SQL", "Python"], "y": [90, 85], "type": "bar", "name": "Ambil & query data",
               "marker": {"color": "#2a7de1"}},
              {"x": ["SQL", "Python"], "y": [30, 95], "type": "bar", "name": "Statistik & ML",
               "marker": {"color": "#e8a838"}},
              {"x": ["SQL", "Python"], "y": [20, 90], "type": "bar", "name": "API & otomasi",
               "marker": {"color": "#34a853"}}],
        title="SQL vs Python: Kekuatan Komplementer (ilustrasi)",
        layout={"barmode": "group", "yaxis": {"title": "Kecocokan"}, "showlegend": True},
        cara="Tinggi = seberapa cocok tiap bahasa untuk tugas itu (ilustrasi).",
        interpretasi="SQL unggul di query data; Python di statistik/ML/otomasi. <strong>Bukan lawan — pasangan.</strong> Analis 2026 = SQL + Python. (D15: menggabungkan keduanya!)")

    L.sec("lab1", "🔬 Lab 1: Bucket DPD dengan Fungsi")
    L.lab("Lab 1 — Fungsi Python Pertama",
        "Tulis fungsi <code className=\"inline\">bucket_dpd(dpd)</code> dan uji untuk dpd = 0, 15, 45, 120. Cetak hasilnya.",
        r'''
def bucket_dpd(dpd):
    """Kelompokkan DPD ke bucket risiko."""
    if dpd == 0:
        return "lancar"
    elif dpd <= 30:
        return "ringan"
    elif dpd <= 90:
        return "sedang"
    return "berat"

# --- UJI ---
for d in [0, 15, 45, 120]:
    print(f"dpd={d:>3} -> {bucket_dpd(d)}")

# Coba: apa hasil bucket_dpd(-5)? Perbaiki agar valid!
''',
        "Tambahkan validasi: dpd negatif → raise ValueError. (Error handling = D2!)")

    L.sec("lab2", "🔬 Lab 2: Simulasi Sederhana")
    L.lab("Lab 2 — Loop & Akumulasi",
        "Simulasikan: nasabah bayar Rp 1 juta/bulan selama 12 bulan. Hitung total bayar + sisa dari plafon 50 juta. Pakai loop!",
        r'''
plafon = 50_000_000
bayar_per_bulan = 1_000_000

total = 0
for bulan in range(1, 13):
    total += bayar_per_bulan
    # print(f"Bulan {bulan}: total {total:,}")

sisa = plafon - total
print(f"Total bayar 12 bulan: Rp {total:,}")
print(f"Sisa plafon: Rp {sisa:,}")
print(f"Terbayar: {total/plafon:.1%}")

# Coba: ubah jadi while. Kapan while lebih tepat dari for?
''',
        "Modifikasi: berhenti (break) jika total >= plafon. Berapa bulan?")

    L.sec("peta", "🗺️ Peta Keputusan: Python vs SQL")
    L.decision("1", "Ambil/filter/agregat di database → <strong>SQL</strong>",
        "Query data.",
        kenapa="Deklaratif, dioptimasi database, dekat data.",
        contoh="NPL per kota (C3).")
    L.decision("2", "API, file, scraping → <strong>Python</strong>",
        "Sumber non-DB.",
        kenapa="SQL tak bisa panggil API/baca file.",
        contoh="Ambil data dari REST API (D15).")
    L.decision("3", "Statistik/ML → <strong>Python</strong>",
        "Model.",
        kenapa="scipy/sklearn tidak ada di SQL.",
        contoh="Regresi, clustering (D11/D12).")
    L.decision("4", "Otomasi terjadwal → <strong>Python</strong>",
        "Rutin.",
        kenapa="Script + cron.",
        contoh="Laporan email tiap pagi.")
    L.decision("5", "Keduanya bisa → <strong>SQL dulu</strong> (dekat data)",
        "Efisiensi.",
        kenapa="Jangan tarik 1 juta baris untuk di-filter di Python!",
        contoh="Filter di SQL, analisis di Python.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>SQL = ambil data; Python = olah data. Jangan tertukar.</li>"
        "<li>Filter/agregat <strong>di database</strong> — tarik hasil ringkas.</li>"
        "<li>Fungsi untuk logika yang dipakai 2×+.</li>"
        "<li>Indentasi 4 spasi — konsisten!</li></ol>"))

    L.sec("case", "📋 Mini-Case: Kalkulator Denda Keterlambatan")
    L.raw(callout("<p>Bank: denda = 2% per bulan dari tunggakan, dihitung harian pro-rata. Tunggakan Rp 5 juta, telat 45 hari.</p>"
        "<p><strong>Tugas:</strong> tulis fungsi <code className=\"inline\">denda(tunggakan, hari_telat)</code> dan hitung. Lalu: apa yang terjadi jika hari_telat = 0? Negatif?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">def denda(t, h): return t * 0.02 * h / 30</code> → Rp 150.000. Hari 0 → 0 (benar). Negatif → negatif (salah! tambah validasi <code className=\"inline\">if h &lt; 0: raise ValueError</code>).</p>"
        "<p><strong>Pelajaran:</strong> fungsi bisnis <em>selalu</em> butuh validasi input — &ldquo;tidak mungkin negatif&rdquo; adalah undangan bug. Dan denda riil memakai compounding (B... track finansial!) — versi sederhana ini fondasinya.</p>")))

    L.quiz("'5' + 3 di Python…",
        ["8", "'53'", "Error (str + int)", "5"],
        2, "Benar: Python tidak konversi implisit. Pakai int('5') + 3.")
    L.quiz("range(3) menghasilkan…",
        ["1,2,3", "0,1,2", "0,1,2,3", "3,2,1"],
        1, "Benar: mulai 0, berhenti sebelum 3.")
    L.quiz("None mirip dengan…",
        ["0", "NULL di SQL — 'tidak tahu'", "String kosong", "False"],
        1, "Benar: None = tidak ada nilai, bukan 0.")
    L.quiz("Kapan copy-paste dijadikan fungsi?",
        ["Tidak pernah", "Saat dipakai 2× atau lebih", "Hanya jika >100 baris", "Selalu, bahkan 1×"],
        1, "Benar: DRY — dipakai ulang = jadikan fungsi.")
    L.quiz("Tugas 'ambil data API lalu hitung model' → …",
        ["SQL saja", "Python (SQL tak bisa panggil API/ML)", "Excel", "Tidak bisa"],
        1, "Benar: Python mengisi celah SQL.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Tipe:</strong> int/float/str/bool/None — konversi eksplisit!</li>"
        "<li><strong>Kontrol:</strong> if/elif/else, for, while — indentasi = blok.</li>"
        "<li><strong>Fungsi:</strong> def + return + docstring; DRY.</li>"
        "<li><strong>SQL + Python:</strong> pasangan komplementer — SQL ambil, Python olah.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D2
def d2():
    L = Lesson("d2-struktur-data", "D2 — Python",
        "Struktur Data, Comprehension<br/>&amp; Menangani Error",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("d1-python-dasar", "← D1"), ("d3-numpy", "Next: D3"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Memakai <strong>list, dict, tuple, set</strong> untuk data terstruktur.</li>"
        "<li>Menulis <strong>list/dict comprehension</strong> yang pythonic.</li>"
        "<li>Menangani error dengan <strong>try/except</strong>.</li>"
        "<li>Membaca/menulis <strong>file</strong> (CSV, JSON).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 10.000 Baris Tanpa pandas?")
    L.raw('<div className="story"><p>Sebelum pandas (D4), analis Python memakai <strong>list of dicts</strong>: tiap baris = dict, tabel = list. Pola ini masih dipakai untuk data kecil, API response (JSON), dan memahami <em>cara berpikir</em> tentang data terstruktur.</p>'
        "<p>Lesson ini juga mengajarkan dua survival skill: <strong>comprehension</strong> (transformasi 1 baris) dan <strong>error handling</strong> (program yang tidak mati saat data kotor). Data nyata = kotor; program analis = harus tahan kotor.</p></div>")

    L.sec("struktur", "Empat Struktur — Pilih yang Tepat")
    L.raw(codebox("# list: urutan, bisa diubah\nkota = ['Jakarta', 'Bandung', 'Surabaya']\nkota.append('Medan')\n\n# dict: pasangan kunci-nilai (seperti 1 baris data!)\nnasabah = {'nama': 'Andi', 'kota': 'Jakarta', 'dpd': 0}\nnasabah['dpd']  # 0\n\n# tuple: urutan tetap (immutable)\nkoordinat = (-6.2, 106.8)\n\n# set: unik, tanpa urutan\nunik = set(['Jakarta', 'Jakarta', 'Bandung'])  # {'Jakarta', 'Bandung'}", "python"))
    L.table(["Struktur", "Kapan", "Contoh analis"],
        [["list", "Urutan data", "Daftar transaksi"],
         ["dict", "1 baris / mapping", "Record nasabah; mapping kode→label"],
         ["tuple", "Tetap, ringan", "Koordinat; return multi-nilai"],
         ["set", "Keunikan/keanggotaan", "Kota unik; cek duplikat cepat"]])
    L.raw(tip("Pola 'tabel' manual: <code className=\"inline\">data = [{'nama': 'Andi', 'dpd': 0}, {...}]</code> — list of dicts. Akses: <code className=\"inline\">data[0]['nama']</code>. Ini <em>mental model</em> DataFrame (D4)!"))
    L.raw(myth("Dict tidak berurutan.",
        "Sejak Python 3.7, dict <strong>menjaga urutan insert</strong>! Mitos lama dari Python 2. Tapi jangan andalkan untuk <em>sorting</em> — urutkan eksplisit jika butuh."))

    L.sec("comprehension", "Comprehension — Transformasi 1 Baris")
    L.raw(codebox("# tanpa comprehension\nkuadrat = []\nfor x in range(5):\n    kuadrat.append(x**2)\n\n# dengan comprehension (pythonic!)\nkuadrat = [x**2 for x in range(5)]\n\n# dengan filter\ngenap = [x for x in range(10) if x % 2 == 0]\n\n# dict comprehension: mapping dpd -> bucket\nbucket = {d: ('lancar' if d == 0 else 'telat') for d in [0, 15, 45]}", "python"))
    L.ul([
        "<strong>Pola:</strong> <code className=\"inline\">[ekspresi for x in data if kondisi]</code>.",
        "<strong>Kapan:</strong> transformasi/filter list — lebih cepat dibaca & ditulis dari loop.",
        "<strong>Jangan:</strong> comprehension bersarang 3 level — jadi tak terbaca. Keterbacaan > kepintaran.",
    ])
    L.raw(tip("Comprehension = 'SELECT transformasi' untuk list. Jika kamu berpikir 'untuk tiap x, hitung y' — tulis comprehension, bukan loop."))

    L.sec("error", "try/except — Program Tahan Data Kotor")
    L.raw(codebox("def parse_gaji(s):\n    try:\n        return float(s.replace(',', ''))\n    except (ValueError, AttributeError):\n        return None  # data kotor -> None, bukan crash!\n\nprint(parse_gaji('8,500,000'))  # 8500000.0\nprint(parse_gaji('tidak tahu'))  # None\nprint(parse_gaji(None))          # None", "python"))
    L.ul([
        "<strong>try:</strong> coba; <strong>except:</strong> tangani jenis error tertentu.",
        "<strong>Jangan</strong> <code className=\"inline\">except:</code> kosong (menangkap semua, termasuk bug!) — sebutkan jenisnya.",
        "<strong>EAFP:</strong> 'lebih mudah minta maaf' — coba dulu, tangani gagal. Gaya Python.",
    ])
    L.raw(myth("Error harus dihindari dengan if.",
        "Untuk data kotor, try/except <em>lebih bersih</em> dari if bertingkat: <code className=\"inline\">try: float(x) except: None</code> vs 5 baris pengecekan. Tapi untuk <em>logika bisnis</em> (dpd negatif), if/raise lebih tepat. Pilih sesuai konteks."))
    L.raw(tip("Pola analis: bungkus <em>parsing</em> dengan try/except → None; bungkus <em>validasi bisnis</em> dengan if → raise. Parsing toleran, validasi ketat."))

    L.sec("file", "File I/O — CSV &amp; JSON")
    L.raw(codebox("import csv, json\n\n# tulis CSV\nwith open('/tmp/nasabah.csv', 'w', newline='') as f:\n    w = csv.DictWriter(f, fieldnames=['nama', 'dpd'])\n    w.writeheader()\n    w.writerows([{'nama': 'Andi', 'dpd': 0}])\n\n# baca JSON (format API!)\nrespon = '{\"nama\": \"Budi\", \"dpd\": 15}'\ndata = json.loads(respon)\nprint(data['nama'])  # Budi", "python"))
    L.ul([
        "<code className=\"inline\">with open(...)</code> = buka-tutup otomatis (wajib!).",
        "<code className=\"inline\">csv.DictWriter/DictReader</code> = CSV via dict (nyaman!).",
        "<code className=\"inline\">json.loads/load</code> = parse JSON (API response!).",
    ])
    L.raw(tip("Di Pyodide (browser), file ditulis ke <em>memori virtual</em> — untuk latihan cukup. Di kerja nyata, file = lokal/server. pandas (D4) membuat ini 1 baris: <code className=\"inline\">pd.read_csv(...)</code>."))

    L.chart(
        data=[{"x": ["list", "dict", "tuple", "set"], "y": [40, 35, 10, 15], "type": "bar",
               "marker": {"color": "#2a7de1"},
               "text": ["40%", "35%", "10%", "15%"], "textposition": "outside"}],
        title="Frekuensi Pakai Struktur Data (ilustrasi analis)",
        layout={"xaxis": {"title": "Struktur"}, "yaxis": {"title": "% penggunaan"}, "showlegend": False},
        cara="Distribusi ilustratif pemakaian di kode analis.",
        interpretasi="list & dict mendominasi — <strong>kuasai dua ini dulu</strong>. tuple/set untuk kasus khusus. (Di pandas, semuanya dibungkus DataFrame — tapi mental model-nya dari sini.)")

    L.sec("lab1", "🔬 Lab 1: Analisis List of Dicts")
    L.lab("Lab 1 — Tanpa pandas!",
        "Data: list of dicts 5 nasabah. Hitung: rata-rata dpd, yang dpd>30, kota unik. Pakai comprehension!",
        r'''
data = [
    {"nama": "Andi", "kota": "Jakarta", "dpd": 0},
    {"nama": "Budi", "kota": "Bandung", "dpd": 15},
    {"nama": "Citra", "kota": "Jakarta", "dpd": 45},
    {"nama": "Dewi", "kota": "Surabaya", "dpd": 0},
    {"nama": "Eko", "kota": "Jakarta", "dpd": 90},
]

# 1. rata-rata dpd
rata = sum(d["dpd"] for d in data) / len(data)
print(f"Rata-rata dpd: {rata}")

# 2. yang bermasalah (dpd > 30)
bermasalah = [d["nama"] for d in data if d["dpd"] > 30]
print(f"Bermasalah: {bermasalah}")

# 3. kota unik
kota_unik = {d["kota"] for d in data}
print(f"Kota unik: {kota_unik}")

# Coba: dict nama -> dpd via comprehension!
''',
        "Buat mapping {nama: bucket} memakai fungsi bucket_dpd (D1) + dict comprehension.")

    L.sec("lab2", "🔬 Lab 2: Parser Tahan Kotor")
    L.lab("Lab 2 — try/except untuk Data Kotor",
        "Data gaji kotor: ['8,500,000', 'tidak tahu', None, '12000000']. Parse semua → float atau None. Hitung rata-rata yang valid.",
        r'''
def parse_gaji(s):
    try:
        return float(str(s).replace(",", ""))
    except (ValueError, AttributeError):
        return None

kotor = ["8,500,000", "tidak tahu", None, "12000000", ""]
bersih = [parse_gaji(x) for x in kotor]
print(f"Hasil parse: {bersih}")

valid = [x for x in bersih if x is not None]
print(f"Rata-rata valid: {sum(valid)/len(valid):,.0f}")
print(f"Tingkat kotor: {(len(kotor)-len(valid))/len(kotor):.0%}")

# Coba: apa yang terjadi tanpa try/except? (hapus dan jalankan!)
''',
        "Tambahkan: log nilai kotor ke list terpisah untuk dilaporkan (data quality!).")

    L.sec("peta", "🗺️ Peta Keputusan: Struktur &amp; Error")
    L.decision("1", "Urutan data → <strong>list</strong>",
        "Koleksi.",
        kenapa="Append, index, iterasi.",
        contoh="Daftar transaksi.")
    L.decision("2", "Record/mapping → <strong>dict</strong>",
        "Kunci-nilai.",
        kenapa="Akses by name; 1 baris data.",
        contoh="{'nama': 'Andi'}.")
    L.decision("3", "Unik/anggota → <strong>set</strong>",
        "Dedup.",
        kenapa="O(1) membership; unik otomatis.",
        contoh="Kota unik.")
    L.decision("4", "Transformasi list → <strong>comprehension</strong>",
        "Pythonic.",
        kenapa="1 baris, terbaca.",
        contoh="[x**2 for x in data].")
    L.decision("5", "Parsing kotor → <strong>try/except → None</strong>",
        "Toleran.",
        kenapa="Jangan crash; tandai kotor.",
        contoh="parse_gaji.")
    L.decision("6", "Validasi bisnis → <strong>if → raise</strong>",
        "Ketat.",
        kenapa="Bug harus berteriak, bukan diam.",
        contoh="dpd negatif.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>list/dict = 90% kebutuhan; tuple/set untuk khusus.</li>"
        "<li>'Untuk tiap x hitung y' → comprehension.</li>"
        "<li>Parsing: try/except → None. Validasi: if → raise.</li>"
        "<li><code className=\"inline\">with open</code> selalu untuk file.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Pembersih Data Gaji")
    L.raw(callout("<p><strong>Situasi:</strong> File CSV 1.000 baris, kolom gaji berantakan: '8,500,000', '8.5jt', 'tidak tahu', kosong, '-5000'.</p>"
        "<p><strong>Tugas:</strong> tulis fungsi <code className=\"inline\">bersihkan_gaji(s)</code> yang menangani semua + kembalikan (nilai, status). Status: 'ok' / 'kotor' / 'invalid'.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">def bersihkan_gaji(s):<br/>&nbsp;&nbsp;try:<br/>&nbsp;&nbsp;&nbsp;&nbsp;v = float(str(s).replace(',','').replace('jt',''))<br/>&nbsp;&nbsp;&nbsp;&nbsp;if 'jt' in str(s): v *= 1_000_000<br/>&nbsp;&nbsp;&nbsp;&nbsp;return (v, 'ok' if v >= 0 else 'invalid')<br/>&nbsp;&nbsp;except: return (None, 'kotor')</code></p>"
        "<p><strong>Pelajaran:</strong> fungsi cleaning mengembalikan <strong>(nilai, status)</strong> — bukan cuma nilai! Status memungkinkan <em>laporan kualitas</em> (C15): '5% kotor, 1% invalid'. Cleaning tanpa metrik = tak terukur.</p>")))

    L.quiz("dict sejak Python 3.7…",
        ["Acak", "Menjaga urutan insert", "Tersortir otomatis", "Tidak bisa diubah"],
        1, "Benar: mitos 'dict acak' sudah usang sejak 3.7.")
    L.quiz("[x**2 for x in range(5) if x%2==0] = …",
        ["[0,1,4,9,16]", "[0,4,16]", "[0,2,4]", "Error"],
        1, "Benar: 0,2,4 → kuadrat = 0,4,16.")
    L.quiz("except: (kosong, tanpa jenis)…",
        ["Praktik baik", "Buruk — menangkap bug juga, sebutkan jenisnya", "Lebih cepat", "Wajib"],
        1, "Benar: tangkap spesifik (ValueError, dsb).")
    L.quiz("Untuk parsing data kotor, yang tepat…",
        ["if bertingkat", "try/except → None", "biarkan crash", "hapus baris"],
        1, "Benar: toleran untuk parsing; ketat untuk validasi bisnis.")
    L.quiz("json.loads dipakai untuk…",
        ["Tulis file", "Parse string JSON (respons API)", "Hitung statistik", "Buat chart"],
        1, "Benar: API → JSON string → dict.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>list/dict/tuple/set:</strong> pilih sesuai kebutuhan; list of dicts = mental model tabel.</li>"
        "<li><strong>Comprehension:</strong> transformasi 1 baris yang pythonic.</li>"
        "<li><strong>try/except:</strong> parsing toleran (→None); <strong>if/raise:</strong> validasi ketat.</li>"
        "<li><strong>File:</strong> with open + csv/json; pandas membuatnya 1 baris (D4).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)
# ================================================================== D3
def d3():
    L = Lesson("d3-numpy", "D3 — Python",
        "NumPy: Vectorization &amp;<br/>Berpikir Array",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d2-struktur-data", "← D2"), ("d4-pandas-dasar", "Next: D4"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>vectorization</strong>: mengapa operasi array 100× lebih cepat dari loop.</li>"
        "<li>Memakai <strong>broadcasting</strong> untuk operasi antar-shape.</li>"
        "<li>Menerapkan <strong>indexing boolean &amp; fancy</strong>.</li>"
        "<li>Memakai <strong>random</strong> NumPy dengan seed untuk simulasi.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Loop 8 Detik vs 0,05 Detik")
    L.raw('<div className="story"><p>Analis menghitung rata-rata 10 juta transaksi dengan loop Python: <strong>8 detik</strong>. Rekannya memakai NumPy: <strong>0,05 detik</strong> — 160× lebih cepat, kode lebih pendek.</p>'
        "<p>Rahasianya: <strong>vectorization</strong> — operasi diterapkan ke <em>seluruh array sekaligus</em> di C yang dikompilasi, bukan per elemen di Python. Ini <em>cara berpikir</em> baru: berhenti loop, mulai operasikan array. Lesson ini mengubah cara kamu menulis kode numerik selamanya.</p></div>")

    L.sec("vector", "Vectorization — Berhenti Loop")
    L.raw(codebox("import numpy as np\n\na = np.array([1, 2, 3, 4])\nb = np.array([10, 20, 30, 40])\n\nprint(a + b)       # [11 22 33 44]  (element-wise!)\nprint(a * 2)       # [2 4 6 8]\nprint(a ** 2)      # [1 4 9 16]\nprint(np.sqrt(a))  # [1.  1.41  1.73  2. ]", "python"))
    L.ul([
        "<strong>Element-wise:</strong> operasi diterapkan per elemen — tanpa loop!",
        "<strong>Ufunc:</strong> <code className=\"inline\">np.sqrt, np.exp, np.log</code> = fungsi vectorized.",
        "<strong>Agregat:</strong> <code className=\"inline\">a.sum(), a.mean(), a.std(), a.max()</code>.",
    ])
    L.raw(worked("📐 Contoh: hitung NPL",
        "<p><code className=\"inline\">plafon = np.array([50, 100, 30, 200])  # juta</code><br/>"
        "<code className=\"inline\">macet = np.array([False, True, True, False])</code></p>"
        "<p><code className=\"inline\">npl = plafon[macet].sum() / plafon.sum()</code> → 0,342. "
        "Tiga operasi, nol loop — bandingkan dengan loop + if manual!</p>"))
    L.raw(myth("NumPy hanya untuk matematikawan.",
        "Analis memakai NumPy <em>setiap hari</em> tanpa sadar — di dalam pandas! Tiap <code className=\"inline\">df['x'] * 2</code> = operasi NumPy. Memahami vectorization menjelaskan <em>mengapa</em> pandas cepat dan <em>kapan</em> loop manual menjadi masalah."))
    L.raw(tip("Refleks: saat jarimu mengetik <code className=\"inline\">for</code> untuk angka — berhenti! Tanyakan: 'bisakah ini operasi array?' 95% bisa."))

    L.sec("broadcast", "Broadcasting — Shape Beda, Tetap Jalan")
    L.p("<strong>Aturan:</strong> array kecil 'direntangkan' mengikuti yang besar (dari dimensi terakhir):")
    L.raw(codebox("m = np.array([[1, 2, 3],\n              [4, 5, 6]])  # shape (2, 3)\n\nprint(m + 10)           # skalar -> semua elemen\nprint(m + np.array([1, 0, 1]))  # (3,) -> tiap baris\n# m + np.array([1, 2])  # ERROR: (2,) vs (3,) tak cocok!", "python"))
    L.ul([
        "<strong>Kapan:</strong> normalisasi (kurangi mean tiap kolom), skenario (+10% ke semua), bobot.",
        "<strong>Jebakan:</strong> shape (3,) vs (3,1) beda! Pakai <code className=\"inline\">.reshape(-1, 1)</code> untuk kolom.",
        "<strong>Debug:</strong> <code className=\"inline\">print(a.shape)</code> — selalu cek shape saat error!",
    ])
    L.raw(tip("Hafalkan: broadcasting cocok dari <strong>kanan ke kiri</strong>. (2,3) + (3,) OK; (2,3) + (2,) ERROR. Cek shape = debug 80% error NumPy."))

    L.sec("indexing", "Boolean &amp; Fancy Indexing")
    L.raw(codebox("dpd = np.array([0, 15, 45, 0, 90, 5])\n\nmask = dpd > 30                    # [False False  True False  True False]\nprint(dpd[mask])                  # [45 90]  (boolean indexing!)\n\nprint(dpd[[0, 2, 4]])             # [0 45 90]  (fancy: indeks list)\ndpd[dpd > 30] = 999               # assign bersyarat!\nprint(dpd)  # [0 15 999 0 999 5]", "python"))
    L.ul([
        "<strong>Boolean indexing</strong> = WHERE-nya NumPy! (C1: filter baris.)",
        "<strong>Assign bersyarat:</strong> <code className=\"inline\">a[a &lt; 0] = 0</code> — floor di 0, 1 baris!",
        "<strong>Operator:</strong> <code className=\"inline\">&amp;</code> (and), <code className=\"inline\">|</code> (or), <code className=\"inline\">~</code> (not) — dengan <strong>kurung</strong>!",
    ])
    L.raw(myth("Boolean indexing membuat kopi yang boros.",
        "Boolean indexing memang return <em>kopi</em> — tapi untuk analisis itu justru aman (tak ubah asli). Untuk view hemat memori: <em>slicing</em> (<code className=\"inline\">a[1:3]</code>) = view. Beda kebutuhan, beda alat."))

    L.sec("random", "Random — Simulasi dengan Seed")
    L.raw(codebox("rng = np.random.default_rng(42)  # seed = reproduksibel!\n\nacak = rng.normal(0, 1, 10000)      # 10rb sampel N(0,1)\nprint(acak.mean(), acd := acak.std())\n\n# Monte Carlo: P(portofolio rugi > 10%)\nret = rng.normal(0.001, 0.02, 100000)\nprint(f\"P(rugi>10%): {(ret < -0.10).mean():.2%}\")", "python"))
    L.ul([
        "<code className=\"inline\">default_rng(seed)</code> = generator modern (bukan <code className=\"inline\">np.random.seed</code> global!).",
        "<strong>Seed = reproduksibel:</strong> seed sama → angka sama → hasil bisa direplikasi orang lain.",
        "<strong>Distribusi:</strong> <code className=\"inline\">normal, uniform, binomial, poisson, choice</code>.",
    ])
    L.raw(tip("Aturan simulasi: <strong>selalu set seed</strong> dan catat di kode. 'Hasil tidak bisa direplikasi' = hasil tidak bisa dipercaya (D14!)."))

    L.chart(
        data=[{"x": ["Loop Python", "NumPy"], "y": [8, 0.05], "type": "bar",
               "marker": {"color": ["#ef4444", "#34a853"]},
               "text": ["8 dtk", "0,05 dtk"], "textposition": "outside"}],
        title="Loop vs Vectorized: 10 Juta Elemen (ilustrasi)",
        layout={"yaxis": {"title": "Detik", "type": "log"}, "showlegend": False},
        cara="Skala log — beda 160×.",
        interpretasi="Vectorization bukan optimasi kecil — ia <strong>beda orde</strong>. Dan kode NumPy <em>lebih pendek</em>. Cepat + ringkas = tidak ada alasan loop untuk numerik.")

    L.sec("lab1", "🔬 Lab 1: Vectorized NPL")
    L.lab("Lab 1 — Tanpa Loop!",
        "Data: plafon & status macet (array). Hitung NPL ratio + rata-rata plafon macet — <strong>dilarang loop!</strong>",
        NUMPY + r'''
import numpy as np

plafon = np.array([50, 100, 30, 200, 75, 40, 60, 90, 25, 55], dtype=float)  # juta
macet = np.array([False, True, True, False, True, False, False, False, True, False])

# NPL ratio (vectorized!)
npl = plafon[macet].sum() / plafon.sum()
print(f"NPL ratio: {npl:.2%}")

# rata-rata plafon macet vs tidak
print(f"Rata-rata macet: {plafon[macet].mean():.1f} jt")
print(f"Rata-rata lancar: {plafon[~macet].mean():.1f} jt")

# Coba: plafon semua naik 10% (broadcasting) — NPL berubah?
''',
        "Bandingkan kecepatan: tulis versi loop manual dengan %%time (di Colab) — rasakan bedanya!")

    L.sec("lab2", "🔬 Lab 2: Monte Carlo Sederhana")
    L.lab("Lab 2 — Simulasi dengan Seed",
        "Simulasikan 100.000 return harian N(0,1%, 2%). Estimasi P(rugi > 5%) dalam sehari. Ulangi 2× — sama?",
        NUMPY + r'''
import numpy as np

rng = np.random.default_rng(42)
ret = rng.normal(0.001, 0.02, 100_000)

p_rugi = (ret < -0.05).mean()
print(f"P(rugi > 5%): {p_rugi:.2%}")
print(f"Return terburuk: {ret.min():.2%}")
print(f"Return terbaik: {ret.max():.2%}")

# Coba: ganti seed 42 -> 123. Berapa P-nya? (beda tipis = Monte Carlo error!)
# Coba: naikkan n ke 1 juta — P lebih stabil?
''',
        "Hitung juga P(untung > 5%). Simetris? Kenapa? (mean 0,1%!)")

    L.sec("peta", "🗺️ Peta Keputusan: NumPy")
    L.decision("1", "Operasi per elemen → <strong>vectorized</strong>",
        "Tanpa loop.",
        kenapa="100× cepat; kode pendek.",
        contoh="a * 2, np.sqrt(a).")
    L.decision("2", "Filter → <strong>boolean indexing</strong>",
        "WHERE-nya NumPy.",
        kenapa="mask = kondisi; a[mask].",
        contoh="dpd[dpd > 30].")
    L.decision("3", "Shape beda → <strong>broadcasting</strong>",
        "Rentangkan.",
        kenapa="Cek shape dari kanan.",
        contoh="matriks + vektor.")
    L.decision("4", "Simulasi → <strong>rng + seed</strong>",
        "Reproduksibel.",
        kenapa="default_rng(seed); catat seed.",
        contoh="Monte Carlo.")
    L.decision("5", "Error shape → <strong>print shape</strong>",
        "Debug.",
        kenapa="80% error = shape mismatch.",
        contoh="a.shape, b.shape.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Jari mengetik <code className=\"inline\">for</code> untuk angka → berhenti, vectorize!</li>"
        "<li>Broadcasting: cocokkan dari kanan; cek shape.</li>"
        "<li>Boolean: <code className=\"inline\">&amp; | ~</code> dengan kurung.</li>"
        "<li>Simulasi: seed selalu, catat selalu.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Stress Test Portofolio")
    L.raw(callout("<p><strong>Situasi:</strong> Portofolio Rp 1M. Asumsi return harian N(0,05%, 1,5%). Estimasi: (a) P(rugi > Rp 50jt sehari), (b) VaR 95% 1-hari.</p>"
        "<p><strong>Tugas:</strong> tulis simulasi Monte Carlo (100rb skenario). Bandingkan VaR simulasi vs rumus normal (B7!).</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">r = rng.normal(0.0005, 0.015, 100_000); pnl = 1e9 * r</code><br/>(a) <code className=\"inline\">(pnl &lt; -50e6).mean()</code> (b) <code className=\"inline\">VaR = -np.percentile(pnl, 5)</code></p>"
        "<p>Rumus: VaR 95% = 1e9 × (1.645×0.015 − 0.0005) ≈ Rp 24,2jt. Simulasi ≈ sama (beda = Monte Carlo error). <strong>Pelajaran:</strong> simulasi memverifikasi rumus; rumus memverifikasi simulasi. Dua alat, satu kebenaran. (B15: VaR/ES mendalam!)</p>")))

    L.quiz("Vectorization cepat karena…",
        ["Python lebih cepat", "Operasi di C terkompilasi sekaligus, bukan loop Python", "Array lebih kecil", "Sihir"],
        1, "Benar: loop di C, bukan di Python — beda orde kecepatan.")
    L.quiz("(2,3) + (2,) → …",
        ["OK", "Error — broadcast cocok dari kanan", "OK jadi (2,3)", "Jadi (2,2)"],
        1, "Benar: (3,) vs (2,) tak cocok. Cek shape!")
    L.quiz("dpd[dpd > 30] = …",
        ["Error", "Boolean indexing — elemen yang memenuhi", "Semua elemen", "Indeks ke-30"],
        1, "Benar: WHERE-nya NumPy.")
    L.quiz("Untuk AND di boolean indexing…",
        ["and", "& dengan kurung", "&&", "+"],
        1, "Benar: & (bitwise) dengan kurung — 'and' Python tak bisa untuk array.")
    L.quiz("Seed dalam simulasi untuk…",
        ["Kecepatan", "Reproduksibilitas — hasil sama tiap run", "Keamanan", "Tidak penting"],
        1, "Benar: tanpa seed, hasil tak bisa direplikasi = tak bisa dipercaya.")
    L.quiz("a[a < 0] = 0 artinya…",
        ["Error", "Semua negatif jadi 0 (assign bersyarat)", "Hapus negatif", "Tidak ada efek"],
        1, "Benar: 1 baris untuk floor — pola cleaning.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Vectorization:</strong> operasi array sekaligus di C — berhenti loop!</li>"
        "<li><strong>Broadcasting:</strong> cocokkan shape dari kanan; cek .shape.</li>"
        "<li><strong>Boolean indexing:</strong> filter + assign bersyarat (<code className=\"inline\">&amp; | ~</code>).</li>"
        "<li><strong>Random:</strong> default_rng(seed) — reproduksibel selalu.</li>"
        "<li>NumPy = mesin di dalam pandas.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D4
def d4():
    L = Lesson("d4-pandas-dasar", "D4 — Python",
        "pandas: DataFrame &amp;<br/>Berpikir Tabel",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d3-numpy", "← D3"), ("d5-data-cleaning", "Next: D5"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>Series vs DataFrame</strong> (kolom vs tabel).</li>"
        "<li>Memakai <strong>loc/iloc</strong> dengan benar (label vs posisi).</li>"
        "<li>Memfilter dengan <strong>boolean mask</strong>.</li>"
        "<li>Membaca data dari <strong>CSV</strong>.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Excel 1 Juta Baris yang Crash")
    L.raw('<div className="story"><p>File Excel 1 juta baris: dibuka 5 menit, filter 1 menit, crash saat sort. Analis menyerah — padahal tugasnya sederhana: <em>&ldquo;rata-rata gaji per kota untuk yang dpd=0&rdquo;</em>.</p>'
        "<p><strong>pandas</strong> = 'Excel terprogram': DataFrame (tabel) + operasi vectorized. Tugas di atas = <strong>3 baris kode, 2 detik</strong>. Ini library #1 data analyst Python — kuasai D4–D7 dan kamu produktif.</p></div>")

    L.sec("df", "DataFrame &amp; Series — Anatomi")
    L.raw(codebox("import pandas as pd\n\ndf = pd.DataFrame({\n    'nama': ['Andi', 'Budi', 'Citra'],\n    'kota': ['Jakarta', 'Bandung', 'Jakarta'],\n    'dpd': [0, 15, 45],\n})\nprint(df)\nprint(df.dtypes)   # tipe tiap kolom!\nprint(df.shape)    # (baris, kolom)", "python"))
    L.ul([
        "<strong>DataFrame</strong> = tabel (2D); <strong>Series</strong> = 1 kolom (1D).",
        "<code className=\"inline\">df['dpd']</code> = Series; <code className=\"inline\">df[['nama','dpd']]</code> = DataFrame.",
        "<strong>Index:</strong> label baris (default 0,1,2...) — bisa jadi id/tanggal.",
        "<strong>dtypes:</strong> int64, float64, object (string!), bool, datetime64 — <strong>cek selalu!</strong>",
    ])
    L.raw(tip("Tiga perintah eksplorasi pertama untuk DataFrame baru: <code className=\"inline\">df.head()</code>, <code className=\"inline\">df.info()</code>, <code className=\"inline\">df.describe()</code>. 30 detik = peta data. Jadikan refleks!"))
    L.raw(myth("Kolom string = tipe 'string'.",
        "Di pandas, string = <strong>object</strong> (campuran)! Angka tersimpan sebagai object = <em>tidak bisa dihitung</em> (error/diam salah). Cek dtypes — jika angka terbaca object, konversi: <code className=\"inline\">pd.to_numeric(df['x'], errors='coerce')</code>."))

    L.sec("lociloc", "loc vs iloc — Label vs Posisi")
    L.raw(codebox("# loc: berdasar LABEL\nprint(df.loc[0])              # baris label 0\nprint(df.loc[0:1, 'nama':'dpd'])  # label 0 s.d. 1 (INKLUSIF!)\n\n# iloc: berdasar POSISI\nprint(df.iloc[0])             # baris posisi 0\nprint(df.iloc[0:2, 0:2])     # posisi 0-1 (EKSKLUSIF akhir!)", "python"))
    L.table(["", "loc", "iloc"],
        [["Berdasar", "Label", "Posisi (0-based)"],
         ["Slice", "Inklusif ujung!", "Eksklusif ujung"],
         ["Kapan", "Index bermakna (id/tanggal)", "Posisi murni"]])
    L.raw(myth("loc dan iloc sama saja.",
        "Beda kritis: <code className=\"inline\">df.loc[0:1]</code> = 2 baris (inklusif!); <code className=\"inline\">df.iloc[0:1]</code> = 1 baris! Bug off-by-one klasik. Dan jika index bukan 0..n (misal id), loc pakai id — iloc tetap posisi."))
    L.raw(tip("Aturan: butuh baris ke-n? iloc. Butuh id/tanggal tertentu? loc. Ragu? iloc untuk posisi selalu aman."))

    L.sec("filter", "Boolean Mask — WHERE-nya pandas")
    L.raw(codebox("# filter: mask boolean\nmask = (df['kota'] == 'Jakarta') & (df['dpd'] == 0)\nprint(df[mask])\n\n# query(): lebih terbaca untuk kompleks\nprint(df.query(\"kota == 'Jakarta' and dpd == 0\"))\n\n# kolom baru (vectorized!)\ndf['bermasalah'] = df['dpd'] > 30\ndf['gaji_jt'] = df['gaji'] / 1_000_000", "python"))
    L.ul([
        "<strong>Mask:</strong> <code className=\"inline\">df[kondisi]</code> — seperti boolean indexing NumPy (D3!).",
        "<strong>Operator:</strong> <code className=\"inline\">&amp; | ~</code> dengan kurung (bukan and/or!).",
        "<strong>Kolom baru:</strong> assign vectorized — <em>jangan loop</em>!",
    ])
    L.raw(tip("Pola analis harian: <code className=\"inline\">df[(df.a > x) & (df.b == y)]</code>. Jika kondisi 3+, pertimbangkan <code className=\"inline\">.query()</code> agar terbaca."))

    L.sec("csv", "read_csv — Pintu Masuk Data")
    L.raw(codebox("df = pd.read_csv('nasabah.csv')\n# opsi penting:\ndf = pd.read_csv('nasabah.csv',\n    parse_dates=['tanggal'],      # kolom jadi datetime!\n    dtype={'id': str},            # paksa tipe (id jangan int!)\n    na_values=['', 'NA', '-'])    # anggap ini sebagai NaN", "python"))
    L.ul([
        "<strong>parse_dates:</strong> tanggal langsung jadi datetime64 (D7!).",
        "<strong>dtype:</strong> cegah tebakan salah (id '001' → int = '1' hilang nol!).",
        "<strong>na_values:</strong> samakan definisi 'kosong' (C2!).",
        "<strong>Ingat SQL:</strong> filter di database dulu (D15!) — jangan read_csv 10GB lalu filter!",
    ])
    L.raw(myth("read_csv selalu benar menebak tipe.",
        "Tebakan berdasarkan 100 baris pertama! Kolom campur ('123', 'ABC') → object; tanggal format aneh → object. <strong>Selalu cek dtypes setelah baca</strong> — 5 detik mencegah 5 jam."))

    L.chart(
        data=[{"x": ["Excel", "pandas"], "y": [300, 2], "type": "bar",
               "marker": {"color": ["#ef4444", "#34a853"]},
               "text": ["5 mnt + crash", "2 dtk"], "textposition": "outside"}],
        title="Filter 1 Juta Baris: Excel vs pandas (ilustrasi)",
        layout={"yaxis": {"title": "Detik", "type": "log"}, "showlegend": False},
        cara="Skala log.",
        interpretasi="Bukan cuma cepat — tapi <strong>reproduksibel</strong> (kode!), <strong>skalabel</strong>, dan <strong>terdokumentasi</strong>. Excel = kerja manual; pandas = kerja terprogram.")

    L.sec("lab1", "🔬 Lab 1: Eksplorasi DataFrame")
    L.lab("Lab 1 — head/info/describe + loc/iloc",
        "Data CSV inline 6 nasabah. Eksplorasi: head, info, describe. Lalu ambil: baris posisi 0–2 (iloc) vs label tertentu (loc).",
        PANDAS + r'''
import pandas as pd, io

csv = """id,nama,kota,penghasilan,dpd
1,Andi,Jakarta,8500000,0
2,Budi,Bandung,12000000,15
3,Citra,Jakarta,6700000,45
4,Dewi,Surabaya,15000000,0
5,Eko,Jakarta,,90
6,Fitri,Bandung,9200000,5"""
df = pd.read_csv(io.StringIO(csv))

print("=== HEAD ==="); print(df.head(3))
print("\n=== INFO ==="); df.info()
print("\n=== DESCRIBE ==="); print(df.describe())
print("\n=== dtypes ==="); print(df.dtypes)

print("\n=== iloc[0:2] (posisi, eksklusif) ==="); print(df.iloc[0:2])
print("\n=== loc: dpd > 30 ==="); print(df.loc[df["dpd"] > 30, ["nama", "dpd"]])

# Coba: kenapa penghasilan Eko jadi NaN? (D5!)
''',
        "Ubah: filter kota Jakarta DAN penghasilan > 8jt. Pakai & dengan kurung!")

    L.sec("lab2", "🔬 Lab 2: Kolom Baru Vectorized")
    L.lab("Lab 2 — Bucket + Flag tanpa Loop",
        "Tambahkan kolom: bucket (dari dpd), gaji_jt, flag_bermasalah. Semua vectorized — dilarang loop!",
        PANDAS + r'''
import pandas as pd, numpy as np, io

csv = """nama,kota,penghasilan,dpd
Andi,Jakarta,8500000,0
Budi,Bandung,12000000,15
Citra,Jakarta,6700000,45
Dewi,Surabaya,15000000,0
Eko,Jakarta,,90"""
df = pd.read_csv(io.StringIO(csv))

# kolom baru vectorized
df["gaji_jt"] = df["penghasilan"] / 1_000_000
df["bermasalah"] = df["dpd"] > 30
df["bucket"] = pd.cut(df["dpd"], bins=[-1, 0, 30, 90, 9999],
                       labels=["lancar", "ringan", "sedang", "berat"])
print(df[["nama", "dpd", "bucket", "gaji_jt", "bermasalah"]])

# agregat cepat
print("\nRata-rata gaji per bucket:")
print(df.groupby("bucket", observed=True)["gaji_jt"].mean())

# Coba: pd.cut vs fungsi manual — kapan pakai mana?
''',
        "Agregat: hitung n & rata-rata gaji per kota (groupby — intip D6!).")

    L.sec("peta", "🗺️ Peta Keputusan: pandas Dasar")
    L.decision("1", "Lihat data → <strong>head/info/describe</strong>",
        "Eksplorasi.",
        kenapa="30 detik = peta data.",
        contoh="DataFrame baru.")
    L.decision("2", "Baris by posisi → <strong>iloc</strong>",
        "Posisi.",
        kenapa="Eksklusif ujung; aman.",
        contoh="df.iloc[0:5].")
    L.decision("3", "Baris by label → <strong>loc</strong>",
        "Label.",
        kenapa="Inklusif ujung! Index bermakna.",
        contoh="df.loc['2026-01'].")
    L.decision("4", "Filter → <strong>boolean mask</strong>",
        "WHERE.",
        kenapa="& | ~ dengan kurung.",
        contoh="df[df.dpd > 30].")
    L.decision("5", "Kolom baru → <strong>vectorized assign</strong>",
        "Transformasi.",
        kenapa="Jangan loop!",
        contoh="df['x'] = df.a * 2.")
    L.decision("6", "Baca file → <strong>read_csv + cek dtypes</strong>",
        "Input.",
        kenapa="Tebakan tipe sering salah.",
        contoh="parse_dates, dtype, na_values.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Baru: head/info/describe/dtypes.</li>"
        "<li>iloc = posisi (eksklusif); loc = label (inklusif!).</li>"
        "<li>Filter: mask + &amp; | ~ berkunjung... berkonsultasi dengan kurung.</li>"
        "<li>Kolom baru: vectorized, bukan loop.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Filter Excel yang Crash")
    L.raw(callout("<p><strong>Situasi:</strong> Excel 1 juta baris crash saat filter 'dpd=0 per kota, rata-rata gaji'. Tulis solusi pandas 5 baris.</p>"
        "<p><strong>Tugas:</strong> tulis kodenya + jelaskan kenapa tidak crash.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">df = pd.read_csv('data.csv', usecols=['kota','penghasilan','dpd'])</code><br/>"
        "<code className=\"inline\">hasil = df[df.dpd == 0].groupby('kota')['penghasilan'].mean()</code><br/>"
        "<code className=\"inline\">print(hasil)</code></p>"
        "<p><strong>Kenapa tidak crash:</strong> (1) usecols = baca yang perlu saja; (2) vectorized di C; (3) tidak render 1 juta baris ke layar. <strong>Pelajaran:</strong> 'tugas sederhana' tidak butuh 'alat berat' — butuh alat <em>tepat</em>.</p>")))

    L.quiz("df.loc[0:1] vs df.iloc[0:1]…",
        ["Sama (1 baris)", "loc=2 baris (inklusif), iloc=1 baris (eksklusif)", "loc=1, iloc=2", "Keduanya error"],
        1, "Benar: perangkap off-by-one klasik!")
    L.quiz("Kolom angka terbaca 'object'. Artinya…",
        ["Normal", "Ada nilai non-angka — konversi dengan pd.to_numeric(errors='coerce')", "Hapus kolom", "Tidak bisa dihitung selamanya"],
        1, "Benar: cek dtypes selalu setelah baca data.")
    L.quiz("Filter 'Jakarta dan dpd=0'…",
        ["df[df.kota=='Jakarta' and df.dpd==0]", "df[(df.kota=='Jakarta') & (df.dpd==0)]", "df.query tanpa tanda", "Tidak bisa"],
        1, "Benar: & dengan kurung (and Python tak bisa untuk Series).")
    L.quiz("Tiga perintah pertama untuk DataFrame baru…",
        ["plot, merge, pivot", "head, info, describe", "drop, fillna, astype", "save, load, exit"],
        1, "Benar: refleks 30 detik.")
    L.quiz("id '001' terbaca int → …",
        ["Baik", "Nol hilang! Paksa dtype={'id': str} saat baca", "Tidak masalah", "Error"],
        1, "Benar: ID/kode = string, bukan angka.")
    L.quiz("Kolom baru sebaiknya…",
        ["Loop per baris", "Vectorized assign", "Apply selalu", "Manual di Excel"],
        1, "Benar: df['x'] = ... — jangan loop.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>DataFrame</strong> (tabel) / <strong>Series</strong> (kolom); cek dtypes selalu!</li>"
        "<li><strong>iloc</strong> (posisi, eksklusif) vs <strong>loc</strong> (label, inklusif!).</li>"
        "<li><strong>Boolean mask</strong> = WHERE; <strong>kolom baru</strong> = vectorized.</li>"
        "<li><strong>read_csv:</strong> parse_dates, dtype, na_values — lalu cek dtypes.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D5
def d5():
    L = Lesson("d5-data-cleaning", "D5 — Python",
        "Data Cleaning: dtype, Missing,<br/>Duplikat, Outlier",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d4-pandas-dasar", "← D4"), ("d6-wrangling", "Next: D6"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Memperbaiki <strong>dtype</strong> (to_numeric, to_datetime, astype).</li>"
        "<li>Menangani <strong>missing</strong>: deteksi, hapus, imputasi (dengan benar!).</li>"
        "<li>Menghapus <strong>duplikat</strong> dengan aturan menang.</li>"
        "<li>Mendeteksi <strong>outlier</strong> (IQR, z-score) &amp; membersihkan teks (regex).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 80% Waktu untuk 20% Kemuliaan")
    L.raw('<div className="story"><p>Survei industri konsisten: data scientist menghabiskan <strong>80% waktu untuk cleaning</strong>. Bukan karena mereka lambat — karena data nyata = kotor: tipe salah, hilang, duplikat, outlier, teks berantakan.</p>'
        "<p>Kabar baik: 90% cleaning = <strong>pola berulang</strong> yang bisa dihafal. Lesson case-heavy ini (60+ menit) = pola lengkap + <em>kapan</em> tiap teknik tepat (dan kapan berbahaya!). Cleaning yang salah = analisis yang salah — ini skill dengan ROI tertinggi.</p></div>")

    L.sec("dtype", "dtype — Perbaiki Tipe Dulu")
    L.raw(codebox("df['penghasilan'] = pd.to_numeric(df['penghasilan'], errors='coerce')\ndf['tanggal'] = pd.to_datetime(df['tanggal'], errors='coerce')\ndf['kota'] = df['kota'].astype('category')  # hemat memori!\n# errors='coerce': yang gagal -> NaT/NaN (bukan crash)", "python"))
    L.ul([
        "<strong>to_numeric:</strong> object → angka; <code className=\"inline\">errors='coerce'</code> = gagal → NaN.",
        "<strong>to_datetime:</strong> string → datetime64 (D7!). Format aneh? <code className=\"inline\">format='%d/%m/%Y'</code>.",
        "<strong>category:</strong> untuk kolom sedikit nilai unik (kota, status) — hemat memori 10×+.",
        "<strong>Urutan:</strong> perbaiki dtype <em>dulu</em> — banyak 'error' hilang setelah tipe benar!",
    ])
    L.raw(tip("Cek setelah konversi: <code className=\"inline\">df['x'].isna().sum()</code> — berapa yang gagal jadi NaN? Jika banyak, format datamu tak seperti dugaan — investigasi, jangan abaikan!"))

    L.sec("missing", "Missing — Deteksi, Pahami, Tindakan")
    L.raw(codebox("# deteksi\nprint(df.isna().sum())           # per kolom\nprint(df.isna().mean())          # proporsi\n\n# hapus\nbersih = df.dropna()                    # hapus baris ada NaN\nbersih = df.dropna(subset=['penghasilan'])  # hanya kolom penting\n\n# imputasi\nmedian = df['penghasilan'].median()\ndf['penghasilan'] = df['penghasilan'].fillna(median)", "python"))
    L.table(["Strategi", "Kapan", "Bahaya"],
        [["dropna", "< 5% & MCAR", "Bias jika tidak acak!"],
         ["fillna median", "Numerik skew", "Menekan varians"],
         ["fillna mean", "Numerik simetris", "Sensitif outlier"],
         ["fillna modus/ffill", "Kategorikal/time-series", "Asumsi kuat"],
         ["model-based", "Penting & kompleks", "Overkill untuk eksplorasi"]])
    L.raw(myth("Missing selalu diisi rata-rata.",
        "Imputasi buta = bias buta! Tanya dulu <em>mengapa</em> hilang (A1.7: MCAR/MAR/MNAR). Eko (gaji NULL) — jika gaji hilang karena <em>pengangguran</em>, imputasi median = salah total! <strong>Aturan:</strong> pahami mekanisme → pilih strategi → <strong>tandai yang diimputasi</strong> (<code className=\"inline\">df['gaji_imputed'] = df['gaji'].isna()</code>)."))
    L.raw(tip("Jangan imputasi sebelum split train-test (D12)! Imputasi pakai statistik <em>train</em> saja — pakai statistik full data = <strong>data leakage</strong>."))

    L.sec("duplikat", "Duplikat — Aturan Menang")
    L.raw(codebox("# deteksi\nprint(df.duplicated().sum())\nprint(df[df.duplicated('id', keep=False)])  # lihat semua duplikat\n\n# hapus dengan aturan menang (terbaru menang)\nbersih = (df.sort_values('updated_at')\n              .drop_duplicates('id', keep='last'))", "python"))
    L.ul([
        "<code className=\"inline\">duplicated()</code> = deteksi; <code className=\"inline\">drop_duplicates(subset, keep)</code> = hapus.",
        "<strong>keep:</strong> 'first'/'last'/False — aturan menang eksplisit!",
        "<strong>Sort dulu</strong> jika 'terbaru menang' (butuh updated_at!).",
        "<strong>Ukur dulu</strong> (C10!): berapa % duplikat? Sumbernya?",
    ])
    L.raw(tip("Duplikat 'sempurna' (semua kolom sama) vs 'parsial' (id sama, atribut beda) — yang kedua butuh aturan menang. Jangan drop_duplicates buta tanpa subset yang dipikirkan!"))

    L.sec("outlier", "Outlier — IQR &amp; z-score")
    L.raw(codebox("# IQR method (A1.5!)\nq1, q3 = df['penghasilan'].quantile([0.25, 0.75])\niqr = q3 - q1\nbatas_bawah, batas_atas = q1 - 1.5*iqr, q3 + 1.5*iqr\noutlier = df[(df['penghasilan'] < batas_bawah) | (df['penghasilan'] > batas_atas)]\n\n# z-score\nz = (df['penghasilan'] - df['penghasilan'].mean()) / df['penghasilan'].std()\noutlier_z = df[z.abs() > 3]", "python"))
    L.ul([
        "<strong>Tindakan:</strong> investigasi → (a) salah input? perbaiki/hapus; (b) valid tapi ekstrem? <strong>winsorize/cap</strong> atau biarkan + catat; (c) untuk model robust? biarkan.",
        "<strong>Jangan</strong> hapus outlier diam-diam — ia mungkin <em>fraud</em> (C14!) atau <em>peluang</em>.",
        "<strong>Cap:</strong> <code className=\"inline\">df['x'].clip(upper=batas_atas)</code> — batasi, bukan hapus.",
    ])
    L.raw(myth("Outlier harus selalu dibuang.",
        "Outlier = data yang <em>tidak biasa</em>, bukan <em>salah</em>. Gaji Rp 500jt/bulan = outlier statistik tapi mungkin direktur (valid!). Hapus tanpa investigasi = hapus informasi. <strong>Aturan:</strong> investigasi → keputusan tercatat → tindakan."))

    L.sec("regex", "Regex — Bedah Teks Kotor")
    L.raw(codebox("# bersihkan no HP: ambil digit saja\ndf['hp_bersih'] = df['hp'].str.replace(r'\\D', '', regex=True)\n\n# ekstrak kode dari 'JKT-00123'\ndf['kode'] = df['id_transaksi'].str.extract(r'([A-Z]+)-(\\d+)')[0]\n\n# validasi email sederhana\nvalid = df['email'].str.match(r'^[^@]+@[^@]+\\.[^@]+$')", "python"))
    L.ul([
        "<code className=\"inline\">.str</code> accessor = operasi string vectorized!",
        "<strong>Pola wajib:</strong> <code className=\"inline\">\\D</code> (non-digit), <code className=\"inline\">\\d+</code> (angka), <code className=\"inline\">^...$</code> (full match).",
        "<strong>Kapan:</strong> standardisasi telepon, ekstrak kode, validasi format.",
    ])
    L.raw(tip("Tiga regex menyelamatkan 80% kasus teks: <code className=\"inline\">\\D</code> (buang non-digit), <code className=\"inline\">\\s+</code> (spasi berlebih), <code className=\"inline\">^...$</code> (validasi penuh). Sisanya: Stack Overflow."))

    L.chart(
        data=[{"x": ["dtype", "missing", "duplikat", "outlier", "teks"], "y": [15, 35, 10, 15, 25],
               "type": "bar", "marker": {"color": "#2a7de1"},
               "text": ["15%", "35%", "10%", "15%", "25%"], "textposition": "outside"}],
        title="Alokasi Waktu Cleaning (ilustrasi survei)",
        layout={"xaxis": {"title": "Jenis masalah"}, "yaxis": {"title": "% waktu"}, "showlegend": False},
        cara="Distribusi ilustratif waktu cleaning.",
        interpretasi="Missing + teks = 60% waktu. <strong>Investasi:</strong> validasi di <em>sumber</em> (form, API) 10× lebih murah dari cleaning di <em>hilir</em>. Analis senior = yang memperbaiki hulu, bukan cuma membersihkan hilir.")

    L.sec("lab1", "🔬 Lab 1: Pipeline Cleaning Lengkap")
    L.lab("Lab 1 — Kotor → Bersih",
        "Data sengaja dikotori: tipe salah, missing, duplikat, outlier. Bersihkan dengan pipeline lengkap + <strong>lapor % tiap masalah</strong>!",
        PANDAS + r'''
import pandas as pd, numpy as np, io

csv = """id,nama,kota,penghasilan,dpd,updated_at
1,Andi,Jakarta,8500000,0,2026-09-01
2,Budi,Bandung,12000000,15,2026-09-01
3,Citra,Jakarta,6700000,45,2026-09-01
4,Dewi,Surabaya,15000000,0,2026-09-01
5,Eko,Jakarta,,90,2026-09-01
2,Budi,Bandung,12500000,15,2026-09-05
6,Fahri,Medan,500000000,5,2026-09-01
7,Gita,Jakarta,abc,10,2026-09-01"""
df = pd.read_csv(io.StringIO(csv))
print(f"Baris awal: {len(df)}")

# 1. dtype
df["penghasilan"] = pd.to_numeric(df["penghasilan"], errors="coerce")
print(f"Gagal konversi: {df['penghasilan'].isna().sum()}")

# 2. missing: tandai + imputasi median
df["gaji_imputed"] = df["penghasilan"].isna()
med = df["penghasilan"].median()
df["penghasilan"] = df["penghasilan"].fillna(med)
print(f"Median imputasi: {med:,.0f}")

# 3. duplikat: terbaru menang
n_dup = df.duplicated("id").sum()
df = df.sort_values("updated_at").drop_duplicates("id", keep="last")
print(f"Duplikat dihapus: {n_dup}")

# 4. outlier (IQR) — investigasi, jangan hapus buta!
q1, q3 = df["penghasilan"].quantile([0.25, 0.75])
batas = q3 + 1.5 * (q3 - q1)
print(f"Batas atas IQR: {batas:,.0f}")
print("Outlier:"); print(df[df["penghasilan"] > batas][["nama", "penghasilan"]])

print(f"\nBaris akhir: {len(df)}")
# Coba: winsorize Fahri dengan clip(upper=batas). Kapan cap vs hapus?
''',
        "Tambahkan: kolom status_cleaning yang mencatat tindakan per baris (audit trail!).")

    L.sec("lab2", "🔬 Lab 2: Regex untuk Teks Kotor")
    L.lab("Lab 2 — Standardisasi Telepon",
        "Bersihkan no HP berantakan → digit saja, validasi panjang 10–14. Ekstrak kode kota dari format 'JKT-001'.",
        PANDAS + r'''
import pandas as pd

df = pd.DataFrame({
    "nama": ["Andi", "Budi", "Citra", "Dewi"],
    "hp": ["0812-3456-789", "+62 812 3456 789", "08123456789", "tidak punya"],
    "kode_trx": ["JKT-001", "BDG-023", "JKT-045", "SBY-007"],
})

df["hp_bersih"] = df["hp"].str.replace(r"\D", "", regex=True)
df["hp_valid"] = df["hp_bersih"].str.len().between(10, 14)
df["kota_kode"] = df["kode_trx"].str.extract(r"([A-Z]+)-\d+")[0]
print(df[["nama", "hp", "hp_bersih", "hp_valid", "kota_kode"]])

# Coba: normalisasi +62 -> 0 di depan. (str.replace dengan regex!)
''',
        "Validasi email: tulis regex sederhana + uji 3 contoh (2 valid, 1 tidak).")

    L.sec("peta", "🗺️ Peta Keputusan: Cleaning")
    L.decision("1", "Tipe salah → <strong>to_numeric/to_datetime (coerce)</strong>",
        "dtype dulu.",
        kenapa="Banyak error hilang setelah tipe benar.",
        contoh="Angka object → numeric.")
    L.decision("2", "Missing → <strong>pahami → pilih → tandai</strong>",
        "Mekanisme.",
        kenapa="MCAR/MAR/MNAR menentukan strategi; tandai imputasi.",
        contoh="Median + flag.")
    L.decision("3", "Duplikat → <strong>ukur → aturan menang</strong>",
        "Dedup.",
        kenapa="Sort + drop_duplicates(subset, keep).",
        contoh="Terbaru menang.")
    L.decision("4", "Outlier → <strong>investigasi → keputusan tercatat</strong>",
        "Ekstrem.",
        kenapa="IQR/z-score deteksi; jangan hapus buta.",
        contoh="Cap vs hapus vs biarkan.")
    L.decision("5", "Teks kotor → <strong>.str + regex</strong>",
        "Standardisasi.",
        kenapa="Vectorized; 3 pola cukup.",
        contoh="\\D, \\s+, validasi.")
    L.decision("6", "Semua → <strong>lapor % + audit trail</strong>",
        "Akuntabilitas.",
        kenapa="Cleaning tanpa metrik = tak terukur.",
        contoh="'5% diimputasi'.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>dtype dulu, baru lainnya.</li>"
        "<li>Missing: pahami mekanisme, tandai imputasi.</li>"
        "<li>Outlier: investigasi, jangan hapus buta.</li>"
        "<li>Catat semua tindakan + laporkan %.</li>"
        "<li>Jangan imputasi sebelum split (leakage!).</li></ol>"))

    L.sec("case", "📋 Mini-Case: Audit Cleaning (60+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Kamu menerima CSV 50.000 baris dari tim lain. Atasan minta 'analisis siap' besok pagi.</p>"
        "<p><strong>Tugas:</strong> (1) Rancang <strong>checklist cleaning</strong> 10 langkah. (2) Untuk tiap langkah: kode + metrik yang dilaporkan. (3) Tulis <strong>laporan kualitas 5 kalimat</strong> (template untuk atasan).</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Checklist:</strong> ① dtypes ② missing per kolom ③ duplikat ④ validitas range ⑤ konsistensi bisnis ⑥ outlier ⑦ teks ⑧ tanggal ⑨ relasi antar tabel ⑩ snapshot sebelum/sesudah.</p>"
        "<p><strong>Laporan contoh:</strong> 'Dari 50.000 baris: 3% missing penghasilan (diimputasi median, ditandai), 1,2% duplikat (terbaru menang), 7 outlier (>batas IQR, 2 dikoreksi typo, 5 valid dipertahankan), 0 inkonsistensi status. Data siap analisis dengan catatan terlampir.'</p>"
        "<p><strong>Pelajaran:</strong> laporan cleaning = <strong>kepercayaan</strong>. Analis yang melampirkan 'catatan data' 1 paragraf = analis yang dipercaya angkanya.</p>")))

    L.quiz("errors='coerce' pada to_numeric…",
        ["Error jika gagal", "Gagal → NaN (tidak crash)", "Hapus baris", "Abaikan kolom"],
        1, "Benar: toleran — lalu ukur berapa yang jadi NaN.")
    L.quiz("Imputasi sebelum split train-test…",
        ["Baik", "Data leakage! Pakai statistik train saja", "Tidak masalah", "Wajib"],
        1, "Benar: statistik full data 'membocorkan' info test.")
    L.quiz("Outlier valid tapi ekstrem sebaiknya…",
        ["Selalu hapus", "Investigasi → cap/pertahankan + catat", "Abaikan", "Ganti 0"],
        1, "Benar: outlier mungkin fraud/peluang — jangan hapus buta.")
    L.quiz("drop_duplicates tanpa subset…",
        ["Aman", "Berisiko: hanya hapus baris identik penuh — pikirkan definisi duplikat", "Error", "Hapus semua"],
        1, "Benar: definisikan duplikat (subset id) + aturan menang.")
    L.quiz("Kolom 'kota' 4 nilai unik sebaiknya…",
        ["object", "category (hemat memori)", "int", "dihapus"],
        1, "Benar: category untuk kardinalitas rendah.")
    L.quiz("Fungsi cleaning ideal mengembalikan…",
        ["Nilai saja", "(nilai, status) — untuk laporan kualitas", "Error", "Tidak mengembalikan"],
        1, "Benar: status memungkinkan audit trail + metrik.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>dtype</strong> dulu: to_numeric/to_datetime (coerce) + category.</li>"
        "<li><strong>Missing:</strong> pahami mekanisme → pilih strategi → tandai imputasi.</li>"
        "<li><strong>Duplikat:</strong> ukur → aturan menang eksplisit.</li>"
        "<li><strong>Outlier:</strong> IQR/z-score deteksi; investigasi sebelum tindakan.</li>"
        "<li><strong>Regex:</strong> \\D, \\s+, validasi — via .str.</li>"
        "<li><strong>Lapor:</strong> % + audit trail. Jangan imputasi sebelum split!</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D6
def d6():
    L = Lesson("d6-wrangling", "D6 — Python",
        "Wrangling: Merge, GroupBy,<br/>Pivot &amp; Reshape",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d5-data-cleaning", "← D5"), ("d7-datetime-timeseries", "Next: D7"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menggabungkan DataFrame dengan <strong>merge</strong> (how: inner/left) &amp; <strong>concat</strong>.</li>"
        "<li>Melakukan <strong>groupby + agregasi</strong> (split-apply-combine).</li>"
        "<li>Me-<strong>reshape</strong>: pivot_table &amp; melt.</li>"
        "<li>Menghindari <strong>fan-out</strong> versi pandas (C5!).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Tiga File, Satu Jawaban")
    L.raw('<div className="story"><p>Data tersebar: <em>nasabah.csv</em>, <em>transaksi.csv</em>, <em>kredit.csv</em>. Pertanyaan: <em>&ldquo;rata-rata transaksi per kota untuk nasabah yang punya kredit macet&rdquo;</em> — butuh ketiganya!</p>'
        "<p><strong>Wrangling</strong> = seni menggabung &amp; membentuk data: merge (JOIN-nya pandas), groupby (GROUP BY-nya), pivot (reshape). Jika kamu kuasai SQL C5/C3, ini terasa familiar — <em>konsep sama, sintaks beda</em>. Lesson ini = kamus SQL→pandas.</p></div>")

    L.sec("merge", "merge — JOIN-nya pandas")
    L.raw(codebox("# analogi SQL: SELECT * FROM nasabah n JOIN kredit k ON ...\ngabung = pd.merge(nasabah, kredit,\n                  left_on='id', right_on='nasabah_id',\n                  how='left')  # inner/left/right/outer\n\n# validasi relasi!\ngabung = pd.merge(nasabah, kredit, left_on='id', right_on='nasabah_id',\n                  how='left', validate='1:m')  # one-to-many: 1 nasabah -> banyak kredit", "python"))
    L.table(["how", "SQL", "Kapan"],
        [["inner", "INNER JOIN", "Default; hanya cocok"],
         ["left", "LEFT JOIN", "Pertahankan kiri"],
         ["outer", "FULL OUTER", "Semua; rekonsiliasi"],
         ["cross", "CROSS JOIN", "Jarang; hati-hati!"]])
    L.ul([
        "<strong>validate:</strong> '1:1', '1:m', 'm:1', 'm:m' — <strong>error jika relasi tak sesuai!</strong> Penjaga fan-out.",
        "<strong>Fan-out (C5!):</strong> merge 1-ke-banyak menggandakan baris kiri — agregat setelahnya salah!",
        "<strong>Obat:</strong> agregat dulu baru merge (seperti derived table C6!).",
    ])
    L.raw(tip("Selalu pakai <code className=\"inline\">validate=</code> saat relasi diketahui! <code className=\"inline\">validate='1:m'</code> melempar error jika ternyata bukan 1-ke-banyak — menangkap fan-out <em>sebelum</em> angka salah."))
    L.raw(myth("merge selalu aman jika key-nya benar.",
        "Key benar ≠ relasi benar! Duplikat di <em>kedua</em> sisi (m:m tak disengaja) = ledakan baris. Cek: <code className=\"inline\">df.duplicated(key).sum()</code> di kedua sisi <em>sebelum</em> merge."))

    L.sec("concat", "concat — UNION-nya pandas")
    L.raw(codebox("# tumpuk baris (UNION ALL)\ngabung = pd.concat([df_jan, df_feb], ignore_index=True)\n\n# tumpuk kolom (sejajarkan index!)\nlebar = pd.concat([df_a, df_b], axis=1)", "python"))
    L.ul([
        "<strong>axis=0</strong> (default) = tumpuk baris; <strong>axis=1</strong> = tumpuk kolom.",
        "<code className=\"inline\">ignore_index=True</code> = reset index (hindari duplikat index!).",
        "<strong>Kapan:</strong> gabung file bulanan, tambah kolom hasil hitung.",
    ])
    L.raw(tip("Pola 'baca banyak file': <code className=\"inline\">pd.concat([pd.read_csv(f) for f in files], ignore_index=True)</code> — 1 baris untuk 12 file bulanan!"))

    L.sec("groupby", "GroupBy — Split-Apply-Combine")
    L.raw(codebox("# analogi SQL: SELECT kota, AVG(...) FROM ... GROUP BY kota\nprint(df.groupby('kota')['penghasilan'].mean())\n\n# multi-agregat\nagg = df.groupby('kota').agg(\n    n=('nama', 'count'),\n    rata_gaji=('penghasilan', 'mean'),\n    max_dpd=('dpd', 'max'),\n)\n\n# transform: agregat kembali ke baris (tanpa melipat!)\ndf['rata_kota'] = df.groupby('kota')['penghasilan'].transform('mean')", "python"))
    L.ul([
        "<strong>agg:</strong> banyak agregat sekaligus dengan nama kolom baru.",
        "<strong>transform:</strong> hasil agregat <em>broadcast</em> ke tiap baris — seperti window function (C9!) tanpa melipat.",
        "<strong>apply:</strong> fungsi custom per grup (fleksibel, lambat) — hindari jika bisa vectorized.",
    ])
    L.raw(worked("📐 Contoh: NPL per kota (pandas!)",
        "<p><code className=\"inline\">kredit['npl_flag'] = kredit['kolektibilitas'] >= 3</code><br/>"
        "<code className=\"inline\">npl = kredit.groupby('kota').agg(total=('plafon','sum'), npl_plafon=('plafon', lambda s: s[kredit.loc[s.index,'npl_flag']].sum()))</code></p>"
        "<p>Lebih mudah: <code className=\"inline\">kredit.assign(npl_p=kredit.plafon.where(kredit.npl_flag, 0)).groupby('kota').agg(...)</code>. Bandingkan dengan SQL C3 — <em>konsep identik</em>!</p>"))
    L.raw(tip("groupby().transform() = window function pandas. 'Rata-rata kotanya di tiap baris' = transform, bukan merge hasil agregat (lebih cepat & aman)."))

    L.sec("reshape", "pivot_table &amp; melt — Reshape")
    L.raw(codebox("# pivot: baris -> kolom (seperti pivot SQL C10!)\npivot = df.pivot_table(index='kota', columns='kategori',\n                        values='jumlah', aggfunc='sum', fill_value=0)\n\n# melt: kolom -> baris (unpivot!)\nlong = pivot.reset_index().melt(id_vars='kota',\n    var_name='kategori', value_name='total')", "python"))
    L.ul([
        "<strong>pivot_table:</strong> index × columns → values (dengan agregat!).",
        "<strong>melt:</strong> wide → long (untuk plotting/analisis!).",
        "<strong>Aturan:</strong> tidy data = 1 baris per observasi (long). Pivot untuk <em>tampil</em>, melt untuk <em>analisis</em>.",
    ])
    L.raw(myth("Wide format lebih baik untuk analisis.",
        "Sebaliknya! Kebanyakan operasi pandas/plot (groupby, seaborn) ingin <strong>long/tidy</strong>. Wide = untuk dibaca manusia (laporan). Melt dulu, analisis kemudian."))

    L.chart(
        data=[{"x": ["merge", "concat", "groupby", "pivot/melt"], "y": [35, 15, 35, 15], "type": "bar",
               "marker": {"color": "#2a7de1"},
               "text": ["35%", "15%", "35%", "15%"], "textposition": "outside"}],
        title="Frekuensi Operasi Wrangling (ilustrasi)",
        layout={"xaxis": {"title": "Operasi"}, "yaxis": {"title": "%"}, "showlegend": False},
        cara="Distribusi ilustratif.",
        interpretasi="merge + groupby = 70% wrangling. <strong>Kuasai dua ini dalam-dalam</strong> — sisanya menyusul. (Dan keduanya = JOIN & GROUP BY yang sudah kamu kuasai di SQL!)")

    L.sec("lab1", "🔬 Lab 1: Merge Aman")
    L.lab("Lab 1 — Merge + Validate",
        "Merge nasabah + kredit (left). Pakai validate='1:m' (1 nasabah -> banyak kredit). Lalu hitung total plafon per kota — waspadai fan-out!",
        PANDAS + r'''
import pandas as pd, io

nasabah = pd.read_csv(io.StringIO("""id,nama,kota
1,Andi,Jakarta
2,Budi,Bandung
3,Citra,Jakarta"""))
kredit = pd.read_csv(io.StringIO("""id,nasabah_id,plafon,kolektibilitas
1,1,50000000,1
2,2,100000000,2
3,2,30000000,3
4,3,30000000,1"""))

# cek duplikat key dulu!
print("duplikat id nasabah:", nasabah.duplicated("id").sum())

g = pd.merge(nasabah, kredit, left_on="id", right_on="nasabah_id",
             how="left", validate="1:m")
print(g[["nama", "kota", "plafon", "kolektibilitas"]])

# total plafon per kota (plafon granularitas kredit = AMAN)
print("\nTotal plafon per kota:")
print(g.groupby("kota")["plafon"].sum())

# Coba: hapus validate, duplikatkan 1 nasabah — apa yang terjadi?
''',
        "Jebakan: hitung rata-rata plafon per nasabah setelah merge — benar atau fan-out?")

    L.sec("lab2", "🔬 Lab 2: GroupBy + Pivot")
    L.lab("Lab 2 — Agregat & Reshape",
        "Dari data transaksi: total per kategori per channel (groupby 2 level), lalu pivot jadi tabel, lalu melt kembali!",
        PANDAS + r'''
import pandas as pd, io

trx = pd.read_csv(io.StringIO("""nasabah_id,kategori,channel,jumlah
1,belanja,mobile,500000
1,makan,mobile,250000
2,belanja,web,1000000
2,travel,web,2000000
3,belanja,mobile,500000
1,travel,web,1200000"""))

# groupby 2 level
g = trx.groupby(["kategori", "channel"])["jumlah"].sum()
print(g)

# pivot: kategori x channel
p = trx.pivot_table(index="kategori", columns="channel",
                    values="jumlah", aggfunc="sum", fill_value=0)
print("\nPIVOT:"); print(p)

# melt kembali ke long
long = p.reset_index().melt(id_vars="kategori",
    var_name="channel", value_name="total")
print("\nMELT:"); print(long)

# Coba: pivot per nasabah_id juga (index 2 level). Kapan berguna?
''',
        "Transform: tambahkan kolom 'pangsa' = jumlah / total per kategori (window function!).")

    L.sec("peta", "🗺️ Peta Keputusan: Wrangling")
    L.decision("1", "Gabung berdasar key → <strong>merge</strong>",
        "JOIN.",
        kenapa="how=inner/left; validate relasi!",
        contoh="Nasabah + kredit.")
    L.decision("2", "Tumpuk data sejenis → <strong>concat</strong>",
        "UNION.",
        kenapa="axis=0 baris; ignore_index.",
        contoh="File bulanan.")
    L.decision("3", "Agregat per grup → <strong>groupby.agg</strong>",
        "GROUP BY.",
        kenapa="Multi-agregat bernama.",
        contoh="NPL per kota.")
    L.decision("4", "Agregat ke tiap baris → <strong>transform</strong>",
        "Window.",
        kenapa="Tanpa melipat baris.",
        contoh="Rata-rata kota per baris.")
    L.decision("5", "Baris→kolom (tampil) → <strong>pivot_table</strong>",
        "Laporan.",
        kenapa="Dengan agregat + fill_value.",
        contoh="Kategori × channel.")
    L.decision("6", "Kolom→baris (analisis) → <strong>melt</strong>",
        "Tidy.",
        kenapa="Long untuk groupby/plot.",
        contoh="Wide → long.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>merge: cek duplikat key + validate!</li>"
        "<li>Agregat dulu, merge kemudian (anti fan-out).</li>"
        "<li>transform = window function (tanpa melipat).</li>"
        "<li>Pivot untuk tampil; melt untuk analisis.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Tiga File, Satu Jawaban")
    L.raw(callout("<p><strong>Pertanyaan:</strong> rata-rata transaksi per kota untuk nasabah yang punya kredit macet (kolektibilitas 5).</p>"
        "<p><strong>Tugas:</strong> tulis pipeline pandas lengkap: merge → filter → groupby. Identifikasi di mana fan-out bisa terjadi!</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">k = kredit[kredit.kolektibilitas==5][['nasabah_id']].drop_duplicates()</code>  ← dedup dulu!<br/>"
        "<code className=\"inline\">n = nasabah.merge(k, left_on='id', right_on='nasabah_id')</code><br/>"
        "<code className=\"inline\">t = transaksi.merge(n[['id','kota']], left_on='nasabah_id', right_on='id')</code><br/>"
        "<code className=\"inline\">hasil = t.groupby('kota')['jumlah'].mean()</code></p>"
        "<p><strong>Fan-out:</strong> jika tidak dedup k (nasabah 2 kredit macet), nasabah terganda → rata-rata salah! <strong>Pelajaran:</strong> dedup <em>sebelum</em> merge untuk filter eksistensi. Pola 'semi-join' = merge dengan tabel key unik.</p>")))

    L.quiz("validate='1:m' pada merge nasabah->kredit…",
        ["Mempercepat", "Error jika relasi bukan 1-ke-banyak — penjaga fan-out", "Mengubah hasil", "Tidak ada efek"],
        1, "Benar: 1 nasabah -> banyak kredit. Validasi relasi = tangkap masalah sebelum angka salah.")
    L.quiz("Duplikat key di kedua sisi merge…",
        ["Aman", "Ledakan baris m:m — cek duplicated sebelum merge", "Otomatis dedup", "Error langsung"],
        1, "Benar: cek kedua sisi!")
    L.quiz("transform vs agg…",
        ["Sama", "transform: hasil ke tiap baris (tanpa melipat); agg: 1 baris per grup", "transform lebih lambat", "agg untuk kolom baru"],
        1, "Benar: transform = window function pandas.")
    L.quiz("pivot untuk ___ ; melt untuk ___ …",
        ["analisis; tampil", "tampil (laporan); analisis (tidy/long)", "hapus; tambah", "cepat; lambat"],
        1, "Benar: wide dibaca manusia; long dianalisis mesin.")
    L.quiz("pd.concat 12 file bulanan…",
        ["Loop append", "pd.concat([...], ignore_index=True)", "merge", "Tidak bisa"],
        1, "Benar: 1 baris untuk 12 file.")
    L.quiz("Filter eksistensi ('punya kredit macet') aman via…",
        ["merge langsung", "Dedup key dulu baru merge (semi-join)", "concat", "pivot"],
        1, "Benar: tanpa dedup = fan-out.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>merge</strong> = JOIN (validate!); <strong>concat</strong> = UNION.</li>"
        "<li><strong>groupby.agg</strong> = GROUP BY; <strong>transform</strong> = window.</li>"
        "<li><strong>pivot_table</strong> (tampil) / <strong>melt</strong> (analisis).</li>"
        "<li><strong>Fan-out:</strong> cek duplikat key; agregat/dedup dulu baru merge.</li>"
        "<li>SQL→pandas: konsep sama, sintaks beda.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D7
def d7():
    L = Lesson("d7-datetime-timeseries", "D7 — Python",
        "Datetime &amp; Time Series:<br/>Waktu sebagai Data",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("d6-wrangling", "← D6"), ("d8-visualisasi-1", "Next: D8-1"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Memakai <strong>datetime64</strong>: akses komponen (.dt), aritmetika, resample.</li>"
        "<li>Menangani <strong>timezone</strong> dengan benar.</li>"
        "<li>Menghitung <strong>rolling</strong> (moving average) &amp; <strong>shift</strong> (lag).</li>"
        "<li>Menjelaskan jebakan <strong>lookahead</strong> di time series.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 'Bulan Lalu' yang Salah")
    L.raw('<div className="story"><p>Analis menghitung &ldquo;transaksi bulan lalu&rdquo; dengan <code className=\"inline\">df[df.tanggal.dt.month == 8]</code> — hasilnya <strong>mencampur Agustus 2025 dan 2026</strong>! Laporan salah, tidak ada yang sadar 2 minggu.</p>'
        "<p>Waktu = dimensi paling menipu: zona, format, bulan-tanpa-tahun, hari libur. pandas punya alat lengkap — lesson ini memastikan kamu memakainya dengan benar.</p></div>")

    L.sec("dt", ".dt Accessor — Bedah Waktu")
    L.raw(codebox("df['tanggal'] = pd.to_datetime(df['tanggal'])\n\ndf['tahun'] = df['tanggal'].dt.year\ndf['bulan'] = df['tanggal'].dt.to_period('M')  # 2026-09 (tahun+bulan!)\ndf['hari'] = df['tanggal'].dt.day_name()\ndf['is_weekend'] = df['tanggal'].dt.dayofweek >= 5\n\n# aritmetika: selisih -> Timedelta\ndf['umur_hari'] = (pd.Timestamp('2026-10-01') - df['tanggal']).dt.days", "python"))
    L.ul([
        "<strong>.dt</strong> = accessor komponen (year/month/day/hour/dayofweek...).",
        "<strong>to_period('M')</strong> = tahun-bulan (hindari jebakan 'bulan saja'!).",
        "<strong>Timedelta:</strong> selisih waktu; <code className=\"inline\">.dt.days</code> untuk angka.",
    ])
    L.raw(myth("Filter bulan cukup dengan .dt.month.",
        "Jebakan di cerita! <code className=\"inline\">.dt.month == 8</code> = semua Agustus <em>semua tahun</em>. Pakai <strong>period</strong> (<code className=\"inline\">dt.to_period('M')</code>) atau rentang tanggal eksplisit."))
    L.raw(tip("Untuk 'bulan ini vs bulan lalu': <code className=\"inline\">df[df['tanggal'].dt.to_period('M') == '2026-09']</code> — period bisa dibandingkan dengan string 'YYYY-MM'!"))

    L.sec("resample", "resample — GROUP BY Waktu")
    L.raw(codebox("ts = df.set_index('tanggal').sort_index()\n\n# agregat per hari / minggu / bulan\nprint(ts['jumlah'].resample('D').sum())   # D=hari\nprint(ts['jumlah'].resample('W').sum())   # W=minggu\nprint(ts['jumlah'].resample('ME').sum()) # ME=akhir bulan\n\n# rolling 7 hari (moving average!)\nprint(ts['jumlah'].rolling(7).mean())\n\n# lag 1 hari (LAG-nya pandas!)\nprint(ts['jumlah'].shift(1))", "python"))
    L.ul([
        "<strong>resample:</strong> butuh DatetimeIndex! 'D'/'W'/'ME'/'QE'/'YE'.",
        "<strong>rolling(n):</strong> jendela bergerak (MA-n) — seperti window frame SQL (C9!).",
        "<strong>shift(n):</strong> geser (lag/lead) — untuk pertumbuhan.",
        "<strong>Pertumbuhan:</strong> <code className=\"inline\">ts['jumlah'].pct_change()</code> = (baru-lama)/lama!",
    ])
    L.raw(tip("Pola laporan: <code className=\"inline\">resample('ME').sum()</code> → <code className=\"inline\">pct_change(12)</code> = YoY bulanan. 2 baris = analisis tahunan!"))

    L.sec("tz", "Timezone — Simpan UTC, Tampil Lokal")
    L.raw(codebox("# buat sadar-zona\njakarta = df['tanggal'].dt.tz_localize('Asia/Jakarta')\n# konversi\nutc = jakarta.dt.tz_convert('UTC')\n\n# jika sudah ada zona tapi campur: normalisasi dulu!", "python"))
    L.ul([
        "<strong>tz_localize:</strong> pasang zona (untuk naive); <strong>tz_convert:</strong> ubah zona.",
        "<strong>Aturan:</strong> simpan UTC, konversi saat tampil (C4!).",
        "<strong>Bahaya:</strong> campur naive + aware = error! Samakan dulu.",
    ])
    L.raw(myth("Timezone tidak penting untuk data domestik.",
        "Server UTC + user WIB = selisih 7 jam! 'Transaksi hari ini' bisa salah hari. Bahkan domestik: <em>selalu</em> eksplisit tentang zona."))

    L.sec("lookahead", "Lookahead — Dosa Time Series")
    L.p("<strong>Lookahead bias:</strong> memakai info <em>masa depan</em> untuk keputusan <em>masa lalu</em> — hasil backtest fantastis, live hancur.")
    L.raw(codebox("# SALAH: rolling mencakup hari ini (bocor!)\ndf['ma7'] = df['jumlah'].rolling(7).mean()\n\n# BENAR: hanya masa lalu\nsignal = df['jumlah'].shift(1).rolling(7).mean()\n\n# BENAR: expanding (hanya yang sudah diketahui)\ndf['rata_sd_ini'] = df['jumlah'].expanding().mean()", "python"))
    L.ul([
        "<strong>Aturan:</strong> fitur untuk prediksi hari-T <em>hanya</em> boleh dari data < T.",
        "<strong>shift(1)</strong> sebelum rolling = pola aman standar.",
        "<strong>expanding:</strong> semua histori hingga kini (tanpa bocor).",
    ])
    L.raw(tip("Tanya selalu: 'apakah nilai ini sudah diketahui <em>saat keputusan dibuat</em>?' Jika tidak → lookahead → hasil menipu. (E16: jebakan backtest!)"))
    L.raw(myth("Lookahead hanya masalah trading.",
        "Kredit juga! 'DPD 90 hari' sebagai fitur untuk prediksi <em>saat pencairan</em> = lookahead (belum terjadi!). Fitur harus <strong>point-in-time</strong>: yang diketahui saat observasi."))

    L.chart(
        data=[{"x": ["2026-09-01", "2026-09-05", "2026-09-10", "2026-09-15", "2026-09-20", "2026-09-25"],
               "y": [500000, 75000, 2000000, 1200000, 80000, 400000], "type": "bar",
               "name": "Harian", "marker": {"color": "#94a3b8"}},
              {"x": ["2026-09-01", "2026-09-05", "2026-09-10", "2026-09-15", "2026-09-20", "2026-09-25"],
               "y": [500000, 287500, 858333, 1091666, 828000, 736000], "type": "scatter",
               "mode": "lines+markers", "name": "MA-3", "line": {"color": "#2a7de1", "width": 3}}],
        title="Harian vs Moving Average 3 (data lab)",
        layout={"yaxis": {"title": "Rupiah"}, "showlegend": True},
        cara="Abu-abu = harian (berisik); biru = rata-rata 3 transaksi terakhir.",
        interpretasi="MA menghaluskan noise — tren terlihat. <strong>Tapi:</strong> MA-3 di titik awal hanya dari 1–2 data (tak stabil); dan MA 'terpusat' akan bocor (lookahead!). Pilih jendela sesuai tujuan.")

    L.sec("lab1", "🔬 Lab 1: Resample & Rolling")
    L.lab("Lab 1 — Agregat Waktu",
        "Data transaksi harian. Resample per minggu (sum), hitung MA-3, dan pertumbuhan harian (pct_change).",
        PANDAS + r'''
import pandas as pd, io

csv = """tanggal,jumlah
2026-09-01,500000
2026-09-02,300000
2026-09-03,250000
2026-09-05,75000
2026-09-08,150000
2026-09-10,2000000
2026-09-12,500000
2026-09-15,1200000"""
df = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])
ts = df.set_index("tanggal").sort_index()["jumlah"]

print("=== Per minggu ==="); print(ts.resample("W").sum())
print("\n=== MA-3 ==="); print(ts.rolling(3).mean().round(0))
print("\n=== Pertumbuhan ==="); print((ts.pct_change() * 100).round(1))

# Coba: tanggal 04, 06, 07 hilang — resample mengisi 0? (asfreq!)
print("\n=== Harian kontinu ==="); print(ts.resample("D").sum().head(8))
''',
        "Perhatikan: resample('D') mengisi tanggal hilang dengan 0 (sum) — beda dengan forward-fill. Kapan pakai mana?")

    L.sec("lab2", "🔬 Lab 2: Sinyal Tanpa Lookahead")
    L.lab("Lab 2 — MA Aman vs Bocor",
        "Bangun sinyal 'di atas MA-3': versi BOCOR (tanpa shift) vs AMAN (shift 1). Bandingkan — kapan mereka beda?",
        PANDAS + r'''
import pandas as pd, io

csv = """tanggal,jumlah
2026-09-01,500000
2026-09-02,300000
2026-09-03,250000
2026-09-05,75000
2026-09-10,2000000
2026-09-12,500000
2026-09-15,1200000"""
df = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])
df = df.sort_values("tanggal")

# BOCOR: MA termasuk hari ini
df["ma_bocor"] = df["jumlah"].rolling(3).mean()
df["sinyal_bocor"] = df["jumlah"] > df["ma_bocor"]

# AMAN: hanya data masa lalu
df["ma_aman"] = df["jumlah"].shift(1).rolling(3).mean()
df["sinyal_aman"] = df["jumlah"] > df["ma_aman"]

print(df[["tanggal", "jumlah", "sinyal_bocor", "sinyal_aman"]])
beda = (df["sinyal_bocor"] != df["sinyal_aman"]).sum()
print(f"\nBeda sinyal: {beda} dari {len(df)} hari")

# Coba: di hari 2026-09-10 (lonjakan 2jt), sinyal_bocor vs aman?
''',
        "Renungkan: backtest dengan sinyal_bocor akan terlihat 'akurat' — kenapa menipu?")

    L.sec("peta", "🗺️ Peta Keputusan: Waktu")
    L.decision("1", "Komponen waktu → <strong>.dt</strong>",
        "Bedah.",
        kenapa="year/month/dayofweek; period untuk YYYY-MM.",
        contoh="df.tanggal.dt.to_period('M').")
    L.decision("2", "Agregat per periode → <strong>resample</strong>",
        "GROUP BY waktu.",
        kenapa="Butuh DatetimeIndex; D/W/ME/QE.",
        contoh="Penjualan bulanan.")
    L.decision("3", "Rata-rata bergerak → <strong>rolling</strong>",
        "Haluskan.",
        kenapa="Jendela n; waspadai tepi.",
        contoh="MA-7.")
    L.decision("4", "Banding periode lalu → <strong>shift / pct_change</strong>",
        "Lag.",
        kenapa="shift(1) = kemarin; pct_change = growth.",
        contoh="MoM.")
    L.decision("5", "Zona → <strong>localize/convert</strong>",
        "Eksplisit.",
        kenapa="Simpan UTC; tampil lokal.",
        contoh="Asia/Jakarta.")
    L.decision("6", "Fitur prediksi → <strong>cek lookahead</strong>",
        "Jujur.",
        kenapa="Hanya data < T; shift(1) pola aman.",
        contoh="Sinyal MA.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Bulan = <strong>period</strong>, bukan .dt.month saja.</li>"
        "<li>resample butuh DatetimeIndex + sort.</li>"
        "<li>Fitur prediksi: shift(1) dulu — anti lookahead.</li>"
        "<li>Zona: eksplisit selalu.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Laporan 'Bulan Lalu' yang Salah")
    L.raw(callout("<p><strong>Situasi:</strong> Laporan 'Agustus' ternyata mencampur 2025+2026. Atasan minta perbaikan + jaminan tak terulang.</p>"
        "<p><strong>Tugas:</strong> (1) Tulis filter yang benar (3 cara!). (2) Rancang <strong>assert</strong> otomatis: 'data hanya 1 bulan'. (3) Tulis penjelasan 3 kalimat untuk atasan.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> <code className=\"inline\">df[df.tanggal.dt.to_period('M')=='2026-08']</code>; atau <code className=\"inline\">(df.tanggal>='2026-08-01')&(df.tanggal<'2026-09-01')</code>; atau <code className=\"inline\">df.set_index('tanggal').loc['2026-08']</code> (slice string parsial!).</p>"
        "<p><strong>(2)</strong> <code className=\"inline\">assert df['tanggal'].dt.to_period('M').nunique() == 1</code> — gagalkan pipeline jika campur!</p>"
        "<p><strong>(3)</strong> 'Filter bulan tanpa tahun mencampur dua tahun. Sudah diperbaiki dengan filter tahun-bulan eksplisit + automated check. Angka terkoreksi terlampir.'</p>"
        "<p><strong>Pelajaran:</strong> bug waktu = bug diam-diam. <strong>Assert</strong> = vaksinnya.</p>")))

    L.quiz("df[df.tanggal.dt.month == 8]…",
        ["Benar untuk Agustus 2026", "Salah: campur semua Agustus semua tahun!", "Error", "Kosong"],
        1, "Benar: pakai period YYYY-MM atau rentang eksplisit.")
    L.quiz("resample butuh…",
        ["Tidak ada syarat", "DatetimeIndex (set_index + sort)", "Kolom string", "GroupBy dulu"],
        1, "Benar: index harus datetime terurut.")
    L.quiz("Sinyal 'di atas MA-7' yang benar (anti lookahead)…",
        ["rolling(7).mean()", "shift(1).rolling(7).mean()", "expanding().mean()", "rolling(7, center=True).mean()"],
        1, "Benar: hanya masa lalu. center=True justru bocor!")
    L.quiz("tz_localize vs tz_convert…",
        ["Sama", "localize=pasang zona (naive), convert=ubah zona", "convert lebih cepat", "localize menghapus zona"],
        1, "Benar: pasang dulu, baru ubah.")
    L.quiz("pct_change() = …",
        ["Selisih absolut", "(baru-lama)/lama — pertumbuhan", "Rata-rata", "Akumulasi"],
        1, "Benar: growth rate 1 baris.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>.dt:</strong> komponen waktu; <strong>period</strong> untuk YYYY-MM.</li>"
        "<li><strong>resample</strong> (agregat waktu), <strong>rolling</strong> (MA), <strong>shift/pct_change</strong> (lag/growth).</li>"
        "<li><strong>Timezone:</strong> localize → convert; simpan UTC.</li>"
        "<li><strong>Lookahead:</strong> fitur hanya dari masa lalu — shift(1) pola aman.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D8-1
def d81():
    L = Lesson("d8-visualisasi-1", "D8 — Python (Part 1)",
        "Visualisasi: Memilih Chart<br/>yang Jujur (matplotlib)",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d7-datetime-timeseries", "← D7"), ("d8-visualisasi-2", "Next: D8-2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Memilih <strong>chart yang tepat</strong> untuk tiap pertanyaan (bar/line/hist/scatter/box).</li>"
        "<li>Membuat plot dasar dengan <strong>matplotlib</strong>.</li>"
        "<li>Menghindari <strong>chart yang menipu</strong> (sumbu terpotong, 3D, pie berlebihan).</li>"
        "<li>Menerapkan <strong>grammar of graphics</strong> (data → aesthetic → geometri).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Chart yang 'Membuktikan' Kenaikan 300%")
    L.raw('<div className="story"><p>Slide presentasi: bar chart menunjukkan penjualan &ldquo;naik 300%&rdquo; — batang kedua 4× lebih tinggi. Faktanya: dari 100 ke 115 (<strong>naik 15%</strong>). Triknya? Sumbu Y dimulai dari 90, bukan 0.</p>'
        "<p>Visualisasi = <em>bahasa</em> analis — dan seperti bahasa, bisa jujur atau menipu. Part 1: memilih chart + matplotlib + kejujuran visual. (Catatan: lab di browser mencetak data &amp; info figure — render grafik penuh di Colab/lokal dengan <code className=\"inline\">plt.show()</code>.)</p></div>")

    L.sec("pilih", "Memilih Chart — Pertanyaan Dulu, Chart Kemudian")
    L.table(["Pertanyaan", "Chart", "Contoh"],
        [["Perbandingan kategori", "Bar", "Nasabah per kota"],
         ["Tren waktu", "Line", "Transaksi harian"],
         ["Distribusi", "Histogram", "Sebaran gaji"],
         ["Hubungan 2 variabel", "Scatter", "Gaji vs DPD"],
         ["Sebaran per grup", "Boxplot", "Gaji per kota"],
         ["Komposisi", "Stacked bar (bukan pie!)", "Pangsa kategori"]])
    L.raw(codebox("import matplotlib.pyplot as plt\n\n# bar: perbandingan\nplt.bar(kota, jumlah)\nplt.xlabel('Kota'); plt.ylabel('Nasabah')\nplt.title('Nasabah per Kota')\n# plt.show()  # di Colab/lokal\nprint('figure dibuat:', plt.gcf().number)", "python"))
    L.ul([
        "<strong>Aturan emas:</strong> 1 pertanyaan = 1 chart. Chart yang mencoba jawab 3 hal = menjawab 0.",
        "<strong>Pie chart:</strong> manusia buruk membandingkan sudut — maksimal 3–4 slice, atau pakai bar!",
        "<strong>Line untuk waktu</strong> (kontinu); <strong>bar untuk kategori</strong> (diskret) — tertukar = menyesatkan.",
    ])
    L.raw(tip("Sebelum plot, tulis 1 kalimat: 'chart ini menjawab ___'. Jika tak bisa — jangan plot dulu, pikirkan dulu."))
    L.raw(myth("Chart bagus = chart indah.",
        "Chart bagus = <strong>jujur + jelas</strong>. Gradien 3D, animasi, warna-warni = <em>chartjunk</em> (Tufte) yang mengaburkan. Analis senior: chart sederhana yang tak bisa disalahartikan."))

    L.sec("jujur", "Kejujuran Visual — 4 Dosa")
    L.table(["Dosa", "Contoh", "Obat"],
        [["Sumbu terpotong", "Y dari 90 → 'naik 300%'", "Bar chart: Y dari 0!"],
         ["Skala ganda menyesatkan", "2 sumbu tak sebanding", "Satu sumbu / panel terpisah"],
         ["3D", "Batang 3D = volume menipu", "2D selalu"],
         ["Cherry-picking", "Hanya tampil periode bagus", "Tampil penuh + konteks"]])
    L.p("<strong>Pengecualian sumbu-0:</strong> line chart <em>boleh</em> tidak dari 0 (tren, bukan perbandingan absolut) — tapi <strong>nyatakan eksplisit</strong>. Bar chart: selalu dari 0 (panjang batang = nilai!).")
    L.raw(codebox("# JUJUR: bar dari 0\nplt.bar(['A', 'B'], [100, 115])\nplt.ylim(0, 130)  # eksplisit dari 0\n# bandingkan: plt.ylim(90, 120) -> MENIPU (dosa!)", "python"))
    L.raw(myth("Memotong sumbu selalu menipu.",
        "Tergantung chart! <strong>Bar</strong>: ya, menipu (panjang ∝ nilai). <strong>Line</strong>: tidak selalu (yang penting <em>perubahan</em>) — tapi harus jelas & bukan untuk membesar-besarkan. Konteks menentukan."))
    L.raw(tip("Uji kejujuran: 'jika saya tunjukkan ke orang awam 5 detik, kesimpulan apa yang diambil?' Jika beda dari data → perbaiki chart."))

    L.sec("grammar", "Grammar of Graphics — Struktur Berpikir")
    L.p("<strong>Konsep</strong> (dari ggplot2/seaborn): plot = <strong>data</strong> + <strong>aesthetic</strong> (x, y, warna) + <strong>geometri</strong> (bar/line/titik):")
    L.raw(codebox("import seaborn as sns\n# data + aesthetic + geometri dalam 1 baris!\n# sns.barplot(data=df, x='kota', y='penghasilan', hue='status')\n# hue = warna per grup (dimensi ke-3!)\nprint('pola: sns.<geometri>(data=df, x=..., y=..., hue=...)')", "python"))
    L.ul([
        "<strong>hue</strong> (warna) = dimensi ke-3 — 'per kota, per status'.",
        "<strong>facet</strong> (subplot per grup) = dimensi ke-4 — untuk banyak grup.",
        "<strong>Aturan:</strong> maksimal 3–4 dimensi per chart. Lebih = pecah jadi beberapa chart.",
    ])
    L.raw(tip("seaborn = matplotlib yang 'pintar' (statistik built-in: CI, regresi). Untuk eksplorasi cepat: seaborn. Untuk kustom penuh: matplotlib."))

    L.chart(
        data=[{"x": ["A", "B"], "y": [100, 115], "type": "bar", "name": "Jujur (Y dari 0)",
               "marker": {"color": "#34a853"}},
              {"x": ["A", "B"], "y": [100, 115], "type": "bar", "name": "Menipu (Y dari 90)",
               "marker": {"color": "#ef4444"}, "xaxis": "x2", "yaxis": "y2"}],
        title="Dosa #1: Sumbu Terpotong (data sama!)",
        layout={"grid": {"rows": 1, "columns": 2},
                "yaxis": {"title": "Y dari 0", "range": [0, 130]},
                "yaxis2": {"title": "Y dari 90", "range": [90, 120]},
                "showlegend": False,
                "annotations": [
                    {"x": 0.22, "y": 1.05, "xref": "paper", "yref": "paper", "text": "Naik 15% (jujur)", "showarrow": False},
                    {"x": 0.78, "y": 1.05, "xref": "paper", "yref": "paper", "text": "Terlihat 4× lipat! (menipu)", "showarrow": False}]},
        cara="Kiri: sumbu dari 0. Kanan: sumbu dari 90 — data IDENTIK.",
        interpretasi="Data sama, kesan beda total. <strong>Bar chart wajib dari 0.</strong> Saat baca chart orang lain: <em>selalu cek sumbu dulu</em> — 5 detik yang menyelamatkan dari manipulasi.")

    L.sec("lab1", "🔬 Lab 1: Chart yang Tepat")
    L.lab("Lab 1 — Pilih & Buat",
        "Data: gaji per kota. Buat <strong>bar chart</strong> (rata-rata gaji per kota) + <strong>histogram</strong> (sebaran gaji). Di browser: cetak info figure; di Colab: plt.show().",
        r'''
import matplotlib
matplotlib.use("Agg")  # backend non-interaktif (browser)
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(7)
gaji = rng.normal(9_000_000, 2_500_000, 200).clip(3_000_000)
kota = rng.choice(["Jakarta", "Bandung", "Surabaya"], 200)

# 1. BAR: rata-rata per kota
rata = {k: gaji[kota == k].mean() for k in ["Jakarta", "Bandung", "Surabaya"]}
fig, ax = plt.subplots()
ax.bar(rata.keys(), rata.values(), color="#2a7de1")
ax.set_ylabel("Rata-rata gaji"); ax.set_title("Rata-rata Gaji per Kota")
ax.set_ylim(0, max(rata.values()) * 1.2)  # JUJUR: dari 0!
print(f"Bar chart: {len(ax.patches)} batang, ylim dari 0 = jujur")

# 2. HISTOGRAM: sebaran
fig2, ax2 = plt.subplots()
ax2.hist(gaji / 1e6, bins=20, color="#e8a838", edgecolor="white")
ax2.set_xlabel("Gaji (juta)"); ax2.set_title("Sebaran Gaji")
print(f"Histogram: n={len(gaji)}, mean={gaji.mean()/1e6:.1f}jt")

# Coba: ganti bins=5 vs bins=50. Bagaimana bentuk berubah? (D9!)
''',
        "Uji dosa: buat versi menipu (ylim dari 8jt) — rasakan bedanya!")

    L.sec("lab2", "🔬 Lab 2: Scatter + Boxplot")
    L.lab("Lab 2 — Hubungan & Sebaran per Grup",
        "Scatter: gaji vs dpd (apakah berhubungan?). Boxplot: gaji per kota (bandingkan sebaran!).",
        r'''
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(11)
n = 150
gaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)
dpd = rng.poisson(12, n) + (gaji < 7_000_000).astype(int) * rng.poisson(20, n)
kota = rng.choice(["Jakarta", "Bandung", "Surabaya"], n)

# SCATTER
fig, ax = plt.subplots()
ax.scatter(gaji / 1e6, dpd, alpha=0.5, c="#2a7de1")
ax.set_xlabel("Gaji (juta)"); ax.set_ylabel("DPD")
ax.set_title("Gaji vs DPD")
kor = np.corrcoef(gaji, dpd)[0, 1]
print(f"Korelasi gaji-dpd: {kor:.2f}")

# BOXPLOT per kota
fig2, ax2 = plt.subplots()
data_kota = [gaji[kota == k] / 1e6 for k in ["Jakarta", "Bandung", "Surabaya"]]
ax2.boxplot(data_kota, labels=["Jakarta", "Bandung", "Surabaya"])
ax2.set_ylabel("Gaji (juta)"); ax2.set_title("Sebaran Gaji per Kota")
print("Boxplot: median/garis tengah, box=IQR, titik=outlier")

# Coba: korelasi negatif — apa artinya bisnis? (hati-hati korelasi vs kausal!)
''',
        "Tambahkan garis tren: np.polyfit untuk regresi linear sederhana (intip D11!).")

    L.sec("peta", "🗺️ Peta Keputusan: Chart")
    L.decision("1", "Banding kategori → <strong>bar</strong> (Y dari 0!)",
        "Diskret.",
        kenapa="Panjang ∝ nilai.",
        contoh="Nasabah per kota.")
    L.decision("2", "Tren waktu → <strong>line</strong>",
        "Kontinu.",
        kenapa="Perubahan, bukan absolut.",
        contoh="Transaksi harian.")
    L.decision("3", "Distribusi → <strong>histogram/boxplot</strong>",
        "Sebaran.",
        kenapa="Bentuk, skew, outlier.",
        contoh="Sebaran gaji.")
    L.decision("4", "Hubungan → <strong>scatter</strong>",
        "Korelasi.",
        kenapa="Pola + outlier bivariat.",
        contoh="Gaji vs DPD.")
    L.decision("5", "Komposisi → <strong>stacked bar</strong>",
        "Pangsa.",
        kenapa="Pie maks 3–4 slice.",
        contoh="Pangsa kategori.")
    L.decision("6", "Ragu → <strong>tulis kalimat pertanyaan</strong>",
        "Klarifikasi.",
        kenapa="1 pertanyaan = 1 chart.",
        contoh="'Chart ini menjawab ___.'")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Pertanyaan dulu, chart kemudian.</li>"
        "<li>Bar: Y dari 0. Line: boleh tidak (nyatakan!).</li>"
        "<li>Maks 3–4 dimensi; pie maks 3–4 slice.</li>"
        "<li>Cek sumbu dulu saat baca chart orang.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Slide yang Menipu")
    L.raw(callout("<p><strong>Situasi:</strong> Tim marketing presentasi: bar chart 'konversi naik 300%' (2% → 8%). Kamu curiga.</p>"
        "<p><strong>Tugas:</strong> (1) Apa yang (mungkin) salah dari chart? (2) Buat versi jujur. (3) Tulis <strong>komentar diplomatik</strong> 2 kalimat untuk presenter.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> Kemungkinan: sumbu Y dari 1.5% (bukan 0) → batang 8% terlihat 13× batang 2%. Padahal naik 6pp (poin persentase), bukan 300% secara visual proporsional.</p>"
        "<p><strong>(2)</strong> Bar dari 0 + label 'naik 6pp (4× lipat)' — <em>jujur tapi tetap positif</em>.</p>"
        "<p><strong>(3)</strong> 'Kenaikannya memang signifikan — 4× lipat! Saran kecil: mulai sumbu dari 0 agar audiens langsung percaya tanpa perlu cek ulang. Angkanya sudah cukup kuat.'</p>"
        "<p><strong>Pelajaran:</strong> koreksi chart = <strong>diplomasi</strong>. Jangan tuduh menipu; tawarkan versi yang <em>lebih meyakinkan</em>. Kejujuran + taktik.</p>")))

    L.quiz("Bar chart yang jujur…",
        ["Sumbu Y dari nilai min", "Sumbu Y dari 0", "3D", "Tanpa label"],
        1, "Benar: panjang batang ∝ nilai — hanya benar jika dari 0.")
    L.quiz("Pie chart sebaiknya…",
        ["10+ slice", "Maks 3–4 slice, atau pakai bar", "3D", "Tanpa label %"],
        1, "Benar: manusia buruk membandingkan sudut.")
    L.quiz("Untuk tren waktu…",
        ["Bar", "Line", "Pie", "Scatter"],
        1, "Benar: kontinu = line.")
    L.quiz("hue di seaborn untuk…",
        ["Ukuran titik", "Dimensi ke-3 via warna", "Judul", "Sumbu Y"],
        1, "Benar: warna per grup.")
    L.quiz("Melihat chart orang: cek pertama…",
        ["Warna", "Sumbu (skala, dari mana)", "Judul", "Font"],
        1, "Benar: 5 detik cek sumbu menyelamatkan dari manipulasi.")
    L.quiz("Maks dimensi per chart…",
        ["10", "3–4 (lebih = pecah)", "1", "Tidak terbatas"],
        1, "Benar: lebih = pecah jadi beberapa chart.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Pilih:</strong> bar (kategori), line (waktu), hist/box (distribusi), scatter (hubungan).</li>"
        "<li><strong>Jujur:</strong> bar dari 0; 2D; konteks penuh; nyatakan pengecualian.</li>"
        "<li><strong>Grammar:</strong> data + aesthetic (x/y/hue) + geometri.</li>"
        "<li><strong>seaborn</strong> untuk cepat; <strong>matplotlib</strong> untuk kustom.</li>"
        "<li>1 pertanyaan = 1 chart.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D8-2
def d82():
    L = Lesson("d8-visualisasi-2", "D8 — Python (Part 2)",
        "Plotly: Chart Interaktif<br/>untuk Dashboard",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("d8-visualisasi-1", "← D8-1"), ("d9-eda", "Next: D9"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Membuat chart <strong>interaktif</strong> dengan plotly (hover, zoom).</li>"
        "<li>Membedakan <strong>plotly express</strong> vs <strong>graph_objects</strong>.</li>"
        "<li>Memilih kapan <strong>statis vs interaktif</strong>.</li>"
        "<li>Menyusun <strong>dashboard mini</strong> multi-chart.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 'Angka Aneh di Bulan Maret'")
    L.raw('<div className="story"><p>Direksi menunjuk chart statis: <em>&ldquo;Ada lonjakan di Maret — transaksi apa itu?&rdquo;</em> Kamu tidak bisa jawab — chart statis tidak bisa di-zoom, tidak ada detail per titik.</p>'
        "<p><strong>Plotly</strong> = chart interaktif: hover untuk detail, zoom untuk investigasi, filter untuk eksplorasi. Untuk dashboard &amp; presentasi ke direksi, interaktif = <em>jawaban langsung</em>, bukan 'saya cek dulu'. Part 2: plotly.</p></div>")

    L.sec("express", "Plotly Express — 1 Baris, Interaktif")
    L.raw(codebox("import plotly.express as px\n\n# 1 baris = chart interaktif!\nfig = px.bar(df, x='kota', y='n', color='status',\n              title='Nasabah per Kota per Status')\n# fig.show()  # di Colab/lokal\nprint('chart interaktif: hover, zoom, pan aktif')", "python"))
    L.ul([
        "<strong>px.bar/line/scatter/histogram/box</strong> = 1 baris per chart.",
        "<strong>color=</strong> = hue (dimensi ke-3); <strong>facet_col=</strong> = subplot per grup.",
        "<strong>Interaktif otomatis:</strong> hover detail, zoom, pan, toggle legend.",
        "<strong>Export:</strong> <code className=\"inline\">fig.write_html('chart.html')</code> — kirim ke siapa saja!",
    ])
    L.raw(tip("Pola tercepat: <code className=\"inline\">px.histogram(df, x='gaji')</code> untuk eksplorasi — 5 detik dari data ke chart interaktif. Untuk EDA (D9), ini senjata utama."))
    L.raw(myth("Plotly hanya untuk web.",
        "Plotly juga untuk <em>analisis</em>: di Jupyter, chart interaktif mempercepat EDA (hover outlier langsung tahu nilainya!). Dan <code className=\"inline\">write_html</code> = laporan mandiri tanpa server."))

    L.sec("go", "Graph Objects — Kontrol Penuh")
    L.raw(codebox("import plotly.graph_objects as go\n\nfig = go.Figure()\nfig.add_trace(go.Bar(x=kota, y=n, name='Nasabah'))\nfig.add_trace(go.Scatter(x=kota, y=rata, name='Rata2', yaxis='y2'))\nfig.update_layout(title='Dua Metrik', yaxis2=dict(overlaying='y', side='right'))\nprint('go = rakit manual: tiap trace + layout dikontrol')", "python"))
    L.ul([
        "<strong>Express</strong> = cepat (90% kasus); <strong>Graph Objects</strong> = kustom (dual-axis, annotasi kompleks).",
        "<strong>Aturan:</strong> mulai dengan px; pindah ke go saat px tak cukup.",
        "<strong>update_layout:</strong> judul, sumbu, tema, ukuran — finalisasi.",
    ])
    L.raw(tip("Dual-axis (2 sumbu Y) = berguna tapi berbahaya (skala ganda menipu — D8-1!). Pakai hanya jika hubungan kedua metrik yang penting, dan <strong>nyatakan jelas</strong>."))

    L.sec("kapan", "Statis vs Interaktif — Pilih Medan")
    L.table(["", "Statis (matplotlib)", "Interaktif (plotly)"],
        [["Kapan", "Laporan PDF, paper, slide cetak", "Dashboard, Jupyter, HTML"],
         ["Kelebihan", "Ringan, presisi piksel", "Eksplorasi, hover, zoom"],
         ["Kekurangan", "Tak bisa drill-down", "Berat untuk 1jt+ titik"],
         ["Aturan", "Final & cetak", "Eksplorasi & presentasi live"]])
    L.p("<strong>Untuk 1jt+ titik:</strong> agregat dulu! (resample/binning) — plot 1 juta titik = lambat <em>dan</em> tak terbaca. Chart = ringkasan, bukan dump data.")
    L.raw(myth("Interaktif selalu lebih baik.",
        "Untuk laporan PDF/paper yang dicetak = statis. Untuk email = PNG statis (tak semua email render HTML). <strong>Medium menentukan</strong>: tanya 'di mana ini dibaca?' sebelum pilih."))

    L.sec("dashboard", "Dashboard Mini — Multi-Chart")
    L.raw(codebox("from plotly.subplots import make_subplots\n\nfig = make_subplots(rows=2, cols=1, subplot_titles=('Tren', 'Sebaran'))\nfig.add_trace(go.Scatter(x=tgl, y=nilai, name='Tren'), row=1, col=1)\nfig.add_trace(go.Histogram(x=gaji, name='Sebaran'), row=2, col=1)\nfig.update_layout(height=600, title='Dashboard Mini')\nprint('2 chart, 1 figure: narasi vertikal')", "python"))
    L.ul([
        "<strong>Narasi:</strong> susun chart sebagai <em>cerita</em> (konteks → detail → aksi), bukan tumpukan acak.",
        "<strong>Aturan dashboard:</strong> 4–6 chart maks per layar; tiap chart 1 pesan; judul = kesimpulan (<em>'NPL naik di Q3'</em> bukan <em>'NPL per kuartal'</em>).",
    ])
    L.raw(tip("Judul sebagai kesimpulan = teknik presentasi ampuh. Bandingkan: 'Transaksi per bulan' vs 'Transaksi turun 20% sejak Juni' — yang kedua <em>langsung</em> memberi insight."))

    L.chart(
        data=[{"x": ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"],
               "y": [100, 105, 180, 110, 108, 112], "type": "scatter", "mode": "lines+markers",
               "name": "Transaksi", "line": {"color": "#2a7de1", "width": 3}}],
        title="Lonjakan Maret: Hover untuk Detail (coba!)",
        layout={"xaxis": {"title": "Bulan"}, "yaxis": {"title": "Indeks"}, "showlegend": False},
        cara="Arahkan kursor ke titik Maret — nilai detail muncul (hover).",
        interpretasi="Inilah keunggulan interaktif: <strong>pertanyaan direksi terjawab di tempat</strong> (hover = nilai + konteks). Chart di lesson ini memakai Plotly — <em>itulah</em> yang kamu pelajari!")

    L.sec("lab1", "🔬 Lab 1: Express dalam 1 Baris")
    L.lab("Lab 1 — Chart Interaktif Pertama",
        "Buat px.bar + px.line dari data inline. Di browser: verifikasi struktur figure (data, layout); di Colab: fig.show().",
        r'''
import json
# plotly mungkin belum ada di env ini — siapkan data dulu, plot di Colab
# (di browser Pyodide: await micropip.install("plotly"))

data = {
    "kota": ["Jakarta", "Bandung", "Surabaya", "Medan"],
    "n": [4, 2, 2, 2],
    "npl": [0.02, 0.05, 0.03, 0.08],
}

# Struktur figure plotly (bisa dicek tanpa render!)
fig_dict = {
    "data": [{"type": "bar", "x": data["kota"], "y": data["n"], "name": "Nasabah"}],
    "layout": {"title": "Nasabah per Kota"},
}
print(json.dumps(fig_dict, indent=1)[:300])

# Kode untuk Colab (copy-paste!):
kode_colab = "\n".join([
    "import plotly.express as px",
    "import pandas as pd",
    "df = pd.DataFrame(" + repr(data) + ")",
    'fig = px.bar(df, x="kota", y="n", color="npl",',
    '             title="Nasabah per Kota (warna=NPL)",',
    '             color_continuous_scale="RdYlGn_r")',
    "fig.show()",
])
print("\n=== KODE COLAB (copy-paste) ===")
print(kode_colab)

# Coba: apa beda px.bar vs go.Bar? (kapan pindah ke go?)
''',
        "Eksperimen di Colab: tambahkan hover_data=['npl'] — apa yang berubah saat hover?")

    L.sec("lab2", "🔬 Lab 2: Dashboard Narasi")
    L.lab("Lab 2 — Rancang Dashboard",
        "Rancang dashboard 3-chart untuk 'kesehatan kredit': pilih chart + tulis judul-sebagai-kesimpulan untuk tiap chart.",
        r'''
# RANCANGAN (tulis kode px-nya di Colab!):

dashboard = [
    {"chart": "line", "judul": "NPL naik 0.5pp dalam 3 bulan",
     "kode": "px.line(df, x='bulan', y='npl', title='NPL naik 0.5pp dalam 3 bulan')"},
    {"chart": "bar", "judul": "Bucket 31-60 menumpuk: collection kurang agresif",
     "kode": "px.bar(bucket, x='bucket', y='exposure', title='...')"},
    {"chart": "scatter", "judul": "Vintage Jul-25 konsisten terburuk",
     "kode": "px.scatter(vintage, x='mob', y='npl', color='vintage', title='...')"},
]

for i, d in enumerate(dashboard, 1):
    print(f"{i}. [{d['chart']}] {d['judul']}")
    print(f"   {d['kode']}\n")

print("Narasi: masalah (1) -> lokasi (2) -> penyebab (3) = cerita lengkap")
# Coba: susun ulang urutan — apakah cerita tetap masuk akal?
''',
        "Tantangan: tambahkan chart ke-4 'rekomendasi' — chart apa yang menunjukkan aksi?")

    L.sec("peta", "🗺️ Peta Keputusan: Interaktif")
    L.decision("1", "Eksplorasi cepat → <strong>px 1 baris</strong>",
        "EDA.",
        kenapa="5 detik ke chart interaktif.",
        contoh="px.histogram(df, x='gaji').")
    L.decision("2", "Butuh kustom → <strong>graph_objects</strong>",
        "Kontrol.",
        kenapa="Trace + layout manual.",
        contoh="Dual-axis, annotasi.")
    L.decision("3", "Dashboard → <strong>subplots + narasi</strong>",
        "Cerita.",
        kenapa="4–6 chart; judul = kesimpulan.",
        contoh="Kesehatan kredit.")
    L.decision("4", "Kirim/share → <strong>write_html</strong>",
        "Mandiri.",
        kenapa="HTML tanpa server.",
        contoh="Laporan interaktif.")
    L.decision("5", "Medium cetak/PDF → <strong>statis</strong>",
        "Tepat medium.",
        kenapa="Interaktif tak tercetak.",
        contoh="Paper, slide cetak.")
    L.decision("6", "Data besar → <strong>agregat dulu</strong>",
        "Performa.",
        kenapa="1jt titik = lambat + tak terbaca.",
        contoh="Resample/binning.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Mulai px; pindah go saat kurang.</li>"
        "<li>Judul = kesimpulan, bukan deskripsi.</li>"
        "<li>Medium menentukan: interaktif untuk live, statis untuk cetak.</li>"
        "<li>Agregat sebelum plot data besar.</li></ol>"))

    L.sec("case", "📋 Mini-Case: 'Angka Aneh di Maret'")
    L.raw(callout("<p><strong>Situasi:</strong> Direksi tunjuk lonjakan Maret di chart statis. Kamu buka versi plotly, hover: ternyata <strong>1 transaksi korporat Rp 80M</strong> (bukan tren!).</p>"
        "<p><strong>Tugas:</strong> (1) Chart apa yang membedakan 'lonjakan 1 transaksi' vs 'tren naik'? (2) Tulis kode px-nya. (3) Apa tindak lanjutnya?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> Bar per transaksi di Maret (bukan agregat!) — atau boxplot/scatter: 1 titik jauh di atas = outlier tunggal vs semua naik = tren.</p>"
        "<p><strong>(2)</strong> <code className=\"inline\">px.bar(df_maret, x='id', y='jumlah', hover_data=['nasabah'])</code> — hover langsung tahu siapa.</p>"
        "<p><strong>(3)</strong> Keluarkan outlier dari analisis tren (catat!), investigasi terpisah. <strong>Pelajaran:</strong> agregat menyembunyikan; drill-down mengungkap. Interaktif = <em>kecepatan</em> dari curiga ke paham.</p>")))

    L.quiz("Plotly express vs graph_objects…",
        ["Sama", "px = cepat 1 baris; go = kustom penuh", "go lebih cepat", "px hanya bar"],
        1, "Benar: mulai px, pindah go saat kurang.")
    L.quiz("Untuk laporan PDF…",
        ["Plotly interaktif", "Statis (matplotlib/PNG)", "Tidak pakai chart", "GIF"],
        1, "Benar: medium menentukan — interaktif tak tercetak.")
    L.quiz("1 juta titik di scatter…",
        ["Plot semua", "Agregat/binning dulu", "Tidak bisa", "Pakai pie"],
        1, "Benar: lambat + tak terbaca. Chart = ringkasan.")
    L.quiz("Judul chart yang baik…",
        ["'Grafik 1'", "'NPL naik 0.5pp dalam 3 bulan' (kesimpulan)", "'NPL per kuartal'", "Tanpa judul"],
        1, "Benar: judul = insight, bukan deskripsi.")
    L.quiz("Hover/zoom berguna untuk…",
        ["Keindahan", "Drill-down: jawab 'angka aneh' di tempat", "Kecepatan", "Tidak ada"],
        1, "Benar: investigasi langsung.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>px</strong> = 1 baris interaktif; <strong>go</strong> = kustom penuh.</li>"
        "<li><strong>Interaktif:</strong> hover/zoom = drill-down cepat; write_html untuk share.</li>"
        "<li><strong>Medium menentukan:</strong> live → interaktif; cetak → statis.</li>"
        "<li><strong>Dashboard:</strong> 4–6 chart, narasi, judul = kesimpulan.</li>"
        "<li><strong>Agregat</strong> sebelum plot data besar.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D9
def d9():
    L = Lesson("d9-eda", "D9 — Python",
        "EDA: Workflow &amp; Profiling<br/>Data",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d8-visualisasi-2", "← D8-2"), ("d10-feature-engineering", "Next: D10"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjalankan <strong>workflow EDA</strong> sistematis (bukan acak!).</li>"
        "<li>Membuat <strong>profil data</strong> otomatis (pandas-profiling manual).</li>"
        "<li>Mengajukan &amp; menjawab <strong>pertanyaan analitis</strong> berlapis.</li>"
        "<li>Mendokumentasikan <strong>temuan + batasan</strong>.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: EDA Acak vs Sistematis")
    L.raw('<div className="story"><p>Dua analis dapat dataset sama. Analis A: plot acak 2 jam, temukan &ldquo;gaji vs kota menarik&rdquo; — tapi lupa cek missing, dan insight-nya ternyata artefak duplikat. Analis B: ikut <strong>workflow 6 langkah</strong> 90 menit — temukan 3 insight valid + 2 isu kualitas + daftar pertanyaan lanjutan.</p>'
        "<p>EDA (Exploratory Data Analysis) = <em>wawancara</em> dengan data. Tanpa struktur, wawancara ngalor-ngidul. Lesson case-heavy ini (60+ menit): workflow yang dipakai analis senior.</p></div>")

    L.sec("workflow", "Workflow 6 Langkah")
    L.table(["#", "Langkah", "Pertanyaan", "Alat"],
        [["1", "Gambaran", "'Data ini apa?'", "head/info/describe/shape"],
         ["2", "Kualitas", "'Apa yang kotor?'", "isna/duplicated/dtypes (D5!)"],
         ["3", "Univariat", "'Bagaimana tiap kolom?'", "hist/box/value_counts"],
         ["4", "Bivariat", "'Apa hubungannya?'", "groupby/scatter/corr"],
         ["5", "Waktu", "'Bagaimana trennya?'", "resample/rolling (D7!)"],
         ["6", "Sintesis", "'Jadi apa?'", "Catatan temuan + batasan"]])
    L.p("<strong>Aturan:</strong> urut! Jangan lompat ke bivariat sebelum kualitas (insight dari data kotor = sampah). Tiap langkah: <strong>catat</strong> (bukan di kepala!).")
    L.raw(codebox("# template profil univariat cepat\nfor col in df.select_dtypes('number').columns:\n    print(col, '| mean:', round(df[col].mean(), 1),\n          '| missing:', df[col].isna().mean().round(2),\n          '| skew:', round(df[col].skew(), 2))", "python"))
    L.raw(tip("Skewness (B4!) di profil = sinyal: skew tinggi → log-transform atau median (bukan mean!). EDA yang baik <em>menghubungkan</em> ke track B — statistik bukan teori, tapi alat baca data."))
    L.raw(myth("EDA = bikin chart sebanyak-banyaknya.",
        "EDA = <em>menjawab pertanyaan</em>. Chart tanpa pertanyaan = dekorasi. Mulai tiap EDA dengan <strong>3–5 pertanyaan bisnis</strong> tertulis — chart melayani pertanyaan, bukan sebaliknya."))

    L.sec("profil", "Profil Otomatis — Mesin 5 Menit")
    L.raw(codebox("def profil(df):\n    print(f'Shape: {df.shape}')\n    print(f\"\\nDuplikat: {df.duplicated().sum()}\")\n    print('\\nMissing (%):')\n    print((df.isna().mean() * 100).round(1).sort_values(ascending=False).head())\n    print('\\nKardinalitas (unik):')\n    for c in df.select_dtypes('object'):\n        print(f'  {c}: {df[c].nunique()} unik')\n    print('\\nKorelasi numerik:')\n    print(df.select_dtypes('number').corr().round(2))", "python"))
    L.ul([
        "<strong>Kardinalitas:</strong> kolom 10.000 nilai unik dari 10.000 baris = ID (bukan kategori!).",
        "<strong>Korelasi:</strong> |r| > 0.7 = hubungan kuat (tapi bukan kausal!).",
        "<strong>Di produksi:</strong> ydata-profiling / Sweetviz otomatisasi ini — tapi pahami manualnya dulu!",
    ])
    L.raw(tip("Red flag kardinalitas: kolom 'kategori' dengan 5.000 unik = data kotor (typo, case beda) atau sebenarnya ID. Normalisasi dulu (D5: lower/strip)!"))

    L.sec("tanya", "Bertanya Berlapis — Dari Apa ke Kenapa")
    L.table(["Level", "Pertanyaan", "Contoh"],
        [["Apa", "Deskriptif", "'Berapa NPL per kota?'"],
         ["Kenapa", "Diagnostik", "'Kenapa kota X NPL-nya tinggi?'"],
         ["Bagaimana jika", "Prediktif (intip)", "'Jika tren lanjut, NPL bulan depan?'"],
         ["Apa yang dilakukan", "Preskriptif", "'Intervensi apa paling efektif?'"]])
    L.p("<strong>Teknik '5 Whys' untuk data:</strong> NPL tinggi → kenapa? (bucket 31-60 menumpuk) → kenapa? (vintage Jul-25) → kenapa? (underwriting longgar) → ... Setiap 'kenapa' = 1 analisis lanjutan.")
    L.raw(worked("📐 Contoh berlapis",
        "<p><strong>Q1 (apa):</strong> rata-rata DPD per kota → Bandung tertinggi (25).</p>"
        "<p><strong>Q2 (kenapa):</strong> sebaran DPD Bandung → 1 outlier (120 hari) menaikkan rata-rata!</p>"
        "<p><strong>Q3 (validasi):</strong> median DPD Bandung = 5 (normal) — Q1 tadi <em>menyesatkan</em>.</p>"
        "<p><strong>Pelajaran:</strong> EDA berlapis <em>mengkoreksi diri</em>. Q1 tanpa Q2–Q3 = kesimpulan salah.</p>"))
    L.raw(myth("Insight pertama biasanya benar.",
        "Justru <strong>curigai insight pertama</strong>! Cek: outlier? duplikat? definisi? Insight EDA = hipotesis, bukan kesimpulan — butuh validasi berlapis (inilah '5 Whys' data)."))

    L.sec("dokumentasi", "Dokumentasi — EDA yang Hilang = Tak Pernah Ada")
    L.raw(codebox("# pola catatan temuan (di notebook/script)\ntemuan = []\ntemuan.append({'q': 'NPL per kota?', 'a': 'Medan 8% tertinggi',\n                 'validasi': 'n=2, kecil - tidak signifikan',\n                 'tindak': 'kumpulkan data 6 bulan'})", "python"))
    L.ul([
        "<strong>Catat:</strong> pertanyaan → jawaban → <strong>validasi</strong> → tindak lanjut.",
        "<strong>Batasan:</strong> 'data hanya 1 bulan', 'n kecil', 'definisi X' — jujur tentang kelemahan!",
        "<strong>Untuk atasan:</strong> 1 halaman: 3 temuan + 1 rekomendasi + batasan. Bukan 50 chart.",
    ])
    L.raw(tip("Struktur laporan EDA: <strong>Konteks → Temuan (3) → Batasan → Rekomendasi</strong>. Maks 1 halaman + lampiran. Eksekutif membaca kesimpulan; analis membaca lampiran."))

    L.chart(
        data=[{"x": ["Gambaran", "Kualitas", "Univariat", "Bivariat", "Waktu", "Sintesis"],
               "y": [10, 25, 20, 20, 15, 10], "type": "bar",
               "marker": {"color": ["#2a7de1", "#ef4444", "#e8a838", "#e8a838", "#34a853", "#2a7de1"]},
               "text": ["10%", "25%", "20%", "20%", "15%", "10%"], "textposition": "outside"}],
        title="Alokasi Waktu EDA 6 Langkah (ilustrasi)",
        layout={"xaxis": {"title": "Langkah"}, "yaxis": {"title": "% waktu"}, "showlegend": False},
        cara="Distribusi ilustratif waktu per langkah.",
        interpretasi="<strong>Kualitas = 25%</strong> — langkah terbesar kedua! EDA yang melompatinya = istana di atas pasir. Dan 'sintesis' 10% = yang paling sering <em>dilewatkan</em>, padahal yang paling dibaca atasan.")

    L.sec("lab1", "🔬 Lab 1: Profil Lengkap")
    L.lab("Lab 1 — EDA Langkah 1–3",
        "Dataset kredit inline. Jalankan: gambaran → kualitas → univariat. Catat 3 temuan + 1 isu kualitas!",
        PANDAS + r'''
import pandas as pd, numpy as np, io

csv = """id,kota,plafon,tenor,dpd,kolektibilitas
1,Jakarta,50000000,12,0,1
2,Bandung,100000000,24,15,2
3,Jakarta,30000000,12,45,3
4,Surabaya,200000000,36,0,1
5,Jakarta,75000000,24,90,4
6,Bandung,40000000,12,5,1
7,Medan,60000000,18,30,2
8,Jakarta,90000000,24,0,1
9,Surabaya,25000000,12,120,5
10,Medan,55000000,18,0,1
11,Bandung,30000000,12,60,3
12,Jakarta,,6,150,5"""
df = pd.read_csv(io.StringIO(csv))

# LANGKAH 1: gambaran
print("Shape:", df.shape)
print(df.dtypes)

# LANGKAH 2: kualitas
print("\nMissing %:"); print((df.isna().mean()*100).round(1))
print("Duplikat:", df.duplicated().sum())

# LANGKAH 3: univariat numerik
print("\nDeskriptif:"); print(df.describe().round(0))
print("\nKolektibilitas:"); print(df["kolektibilitas"].value_counts().sort_index())

# TEMUAN (tulis!):
# 1. ...
# 2. ...
# ISU KUALITAS:
# 1. ...

# Coba: plafon skew? (bandingkan mean vs median!)
print("\nMean plafon:", df["plafon"].mean(), "| Median:", df["plafon"].median())
''',
        "Lanjut Q berlapis: kenapa mean >> median? (outlier 200jt!) — validasi!")

    L.sec("lab2", "🔬 Lab 2: Bivariat + Waktu")
    L.lab("Lab 2 — EDA Langkah 4–5",
        "Hubungan: plafon vs dpd (scatter + korelasi). Per kota: NPL rate (groupby). Ajukan 1 'kenapa' + jawab!",
        PANDAS + r'''
import pandas as pd, numpy as np, io

csv = """id,kota,plafon,dpd,kolektibilitas
1,Jakarta,50000000,0,1
2,Bandung,100000000,15,2
3,Jakarta,30000000,45,3
4,Surabaya,200000000,0,1
5,Jakarta,75000000,90,4
6,Bandung,40000000,5,1
7,Medan,60000000,30,2
8,Jakarta,90000000,0,1
9,Surabaya,25000000,120,5
10,Medan,55000000,0,1"""
df = pd.read_csv(io.StringIO(csv))

# LANGKAH 4: bivariat
kor = df["plafon"].corr(df["dpd"])
print(f"Korelasi plafon-dpd: {kor:.2f}")

npl = df.assign(npl=df["kolektibilitas"] >= 3).groupby("kota")["npl"].mean()
print("\nNPL rate per kota:"); print((npl*100).round(1))

# Q BERLAPIS: kenapa Surabaya NPL 50%? -> cek n (kecil!) -> cek barisnya
print("\nDetail Surabaya:"); print(df[df["kota"] == "Surabaya"])

# Coba: hitung ulang NPL per kota BERDASAR PLAFON (bukan count). Beda?
npl_p = df.assign(np=df["plafon"].where(df["kolektibilitas"]>=3, 0)).groupby("kota").apply(
    lambda g: g["np"].sum()/g["plafon"].sum())
print("\nNPL plafon per kota:"); print((npl_p*100).round(1))
''',
        "Renungkan: NPL count vs plafon beda — mana yang 'benar'? (Tergantung pertanyaan!)")

    L.sec("peta", "🗺️ Peta Keputusan: EDA")
    L.decision("1", "Mulai → <strong>3–5 pertanyaan tertulis</strong>",
        "Fokus.",
        kenapa="Chart melayani pertanyaan.",
        contoh="NPL per kota? Kenapa?")
    L.decision("2", "Selalu → <strong>kualitas dulu</strong>",
        "Fondasi.",
        kenapa="Insight dari data kotor = sampah.",
        contoh="D5 sebelum analisis.")
    L.decision("3", "Variabel tunggal → <strong>univariat</strong>",
        "Pahami.",
        kenapa="hist/box + skew + missing.",
        contoh="Sebaran gaji.")
    L.decision("4", "Hubungan → <strong>bivariat</strong>",
        "Kaitkan.",
        kenapa="groupby/scatter/corr.",
        contoh="Gaji vs DPD.")
    L.decision("5", "Insight pertama → <strong>curigai & validasi</strong>",
        "Koreksi.",
        kenapa="Outlier? n kecil? definisi?",
        contoh="5 Whys.")
    L.decision("6", "Selesai → <strong>dokumentasi 1 halaman</strong>",
        "Komunikasi.",
        kenapa="Temuan + batasan + rekomendasi.",
        contoh="3-1-1.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Pertanyaan tertulis dulu.</li>"
        "<li>Kualitas sebelum insight.</li>"
        "<li>Curigai insight pertama; validasi berlapis.</li>"
        "<li>Catat: Q → A → validasi → tindak lanjut.</li>"
        "<li>Lapor: 3 temuan + 1 rekomendasi + batasan.</li></ol>"))

    L.sec("case", "📋 Mini-Case: EDA 90 Menit (60+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Dataset kredit 12 baris (lab 1) + pertanyaan bisnis: 'Apakah kita harus khawatir tentang portofolio ini?'</p>"
        "<p><strong>Tugas:</strong> jalankan 6 langkah penuh. Tulis: (1) 3 temuan, (2) 2 isu kualitas, (3) 2 pertanyaan lanjutan, (4) <strong>rekomendasi 3 kalimat</strong> + batasan.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Temuan:</strong> ① NPL 33% (4/12, kolektibilitas ≥3) — <em>sangat tinggi</em> vs benchmark ~3%! ② Terkonsentrasi: 2 dari 4 NPL di Jakarta. ③ Mean plafon >> median (skew, outlier 200jt).</p>"
        "<p><strong>Isu:</strong> ① 1 missing plafon (8%!). ② n=12 <em>terlalu kecil</em> untuk kesimpulan.</p>"
        "<p><strong>Lanjutan:</strong> ① Data berapa bulan? (vintage?) ② Definisi kolektibilitas konsisten?</p>"
        "<p><strong>Rekomendasi:</strong> 'NPL 33% jauh di atas benchmark — tapi n=12 tidak konklusif. Minta data 6 bulan + definisi kolektibilitas sebelum eskalasi. Sementara: review 4 debitur NPL manual.'</p>"
        "<p><strong>Pelajaran:</strong> EDA hebat = <strong>temuan + kerendahan hati</strong> (batasan). Rekomendasi tanpa batasan = kecerobohan.</p>")))

    L.quiz("Langkah pertama EDA…",
        ["Bivariat", "Gambaran + kualitas (jangan lompat!)", "Modeling", "Presentasi"],
        1, "Benar: urut! Insight dari data kotor = sampah.")
    L.quiz("Insight pertama sebaiknya…",
        ["Langsung presentasi", "Dicurigai & divalidasi berlapis", "Diabaikan", "Disebar"],
        1, "Benar: hipotesis, bukan kesimpulan.")
    L.quiz("Kolom 'kategori' dengan 5.000 unik dari 10.000 baris…",
        ["Normal", "Red flag: kotor atau sebenarnya ID", "Bagus", "Hapus"],
        1, "Benar: kardinalitas aneh = investigasi.")
    L.quiz("Korelasi 0.8 artinya…",
        ["Kausalitas", "Hubungan kuat, bukan kausalitas", "Tidak ada hubungan", "Error"],
        1, "Benar: korelasi ≠ kausalitas (A1.6!).")
    L.quiz("Laporan EDA untuk eksekutif…",
        ["50 chart", "1 halaman: 3 temuan + rekomendasi + batasan", "Kode mentah", "Tanpa batasan"],
        1, "Benar: ringkas + jujur tentang kelemahan.")
    L.quiz("Mean >> median menandakan…",
        ["Data normal", "Skew (outlier kanan) — pakai median/log", "Error", "Data bersih"],
        1, "Benar: skew = sinyal dari profil.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Workflow:</strong> gambaran → kualitas → univariat → bivariat → waktu → sintesis.</li>"
        "<li><strong>Mulai</strong> dengan pertanyaan tertulis; <strong>akhiri</strong> dengan dokumentasi.</li>"
        "<li><strong>Curigai</strong> insight pertama; validasi berlapis (5 Whys).</li>"
        "<li><strong>Lapor:</strong> 3 temuan + 1 rekomendasi + batasan (jujur!).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D10
def d10():
    L = Lesson("d10-feature-engineering", "D10 — Python",
        "Feature Engineering:<br/>Bahan Bakar Model",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d9-eda", "← D9"), ("d11-scipy-statsmodels", "Next: D11"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>mengapa feature engineering</strong> > tuning model.</li>"
        "<li>Membuat fitur <strong>agregat, rasio, waktu, kategorikal</strong> (credit &amp; fraud).</li>"
        "<li>Menerapkan <strong>encoding</strong> (one-hot, target) &amp; <strong>scaling</strong>.</li>"
        "<li>Menghindari <strong>leakage</strong> (dosa terbesar!).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Model 60% → 85% Tanpa Ganti Algoritma")
    L.raw('<div className="story"><p>Kompetisi: model A akurasi 60% dengan 5 fitur mentah. Model B <strong>85%</strong> — algoritma <em>sama</em> (logistic regression!), tapi 40 fitur hasil engineering: rasio, agregat 30-hari, tren.</p>'
        "<p>Pepatah ML: <em>'garbage in, garbage out — fitur bagus, model sederhana menang.'</em> Feature engineering = menerjemahkan <strong>pengetahuan domain</strong> (risk! fraud!) menjadi angka. Lesson ini: pola fitur untuk credit & fraud — domainmu.</p></div>")

    L.sec("pola", "Pola Fitur — 4 Keluarga")
    L.raw(codebox("# 1. AGREGAT: ringkasan perilaku\nfitur['trx_30d_n'] = ...    # count 30 hari\nfitur['trx_30d_sum'] = ...  # total 30 hari\nfitur['trx_30d_max'] = ...  # terbesar\n\n# 2. RASIO: normalisasi\nfitur['utilisasi'] = plafon_terpakai / plafon\nfitur['dpd_per_tenor'] = dpd / tenor\n\n# 3. WAKTU: tren & keterkinian\nfitur['hari_sejak_trx'] = (kini - trx_terakhir).days\nfitur['tren_7d'] = ma7 / ma30 - 1\n\n# 4. KATEGORIKAL: encoding\n# one-hot: kota_Jakarta, kota_Bandung, ...\n# target encoding: rata-rata default per kota", "python"))
    L.table(["Keluarga", "Contoh credit", "Contoh fraud"],
        [["Agregat", "Rata-rata DPD 6 bulan", "Count trx 1 jam (velocity!)"],
         ["Rasio", "Utilisasi limit", "Amount / rata-rata user"],
         ["Waktu", "MOB (umur kredit)", "Jam transaksi (0–23)"],
         ["Kategorikal", "Tujuan kredit", "Channel (one-hot)"]])
    L.raw(tip("Mulai dari <strong>hipotesis domain</strong>: 'fraud = cepat + besar + jam aneh' → velocity, amount ratio, hour. Fitur dari <em>pemahaman</em>, bukan dari coba-coba buta."))
    L.raw(myth("Makin banyak fitur makin baik.",
        "Fitur sampah = noise + overfitting + lambat. <strong>Kualitas > kuantitas</strong>: 20 fitur bermakna > 200 fitur acak. Dan tiap fitur harus <em>dijelaskan</em> ('mengapa ini prediktif?')."))

    L.sec("encoding", "Encoding &amp; Scaling")
    L.raw(codebox("# one-hot: kategori -> kolom biner\npd.get_dummies(df['kota'], prefix='kota', dtype=int)\n\n# scaling: samakan skala (untuk model jarak/gradien!)\nfrom sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X_train)  # fit di TRAIN saja!\n\n# log: untuk skew\nimport numpy as np\ndf['log_plafon'] = np.log1p(df['plafon'])", "python"))
    L.ul([
        "<strong>One-hot:</strong> untuk nominal, kardinalitas kecil. Kardinalitas besar? → target/frequency encoding.",
        "<strong>Scaling:</strong> wajib untuk SVM, KNN, neural net, regresi ber-regularisasi. Tree? <em>Tidak butuh</em>.",
        "<strong>Log:</strong> untuk skew kanan (plafon, gaji) — B4!",
        "<strong>Aturan emas:</strong> fit (scaler/encoder) <strong>hanya di train</strong>, transform ke test (anti-leakage!).",
    ])
    L.raw(myth("Scaling selalu dibutuhkan.",
        "Hanya untuk model berbasis <em>jarak/gradien</em>. Tree-based (random forest, XGBoost) = <em>tidak butuh</em> (split tak peduli skala). Scaling buta = buang waktu; pahami modelmu (D12!)."))

    L.sec("leakage", "Leakage — Dosa Terbesar ⚠️")
    L.p("<strong>Definisi.</strong> <strong>Data leakage</strong> = fitur mengandung info <em>masa depan</em> / <em>target itu sendiri</em> — model 'sempurna' di train, hancur di live.")
    L.table(["Contoh leakage", "Kenapa bocor", "Obat"],
        [["'DPD 90 hari' untuk prediksi saat pencairan", "Belum terjadi saat prediksi", "Point-in-time: hanya info saat observasi"],
         ["Imputasi pakai mean full data", "Info test bocor ke train", "Fit imputasi di train saja"],
         ["'Status macet' sebagai fitur prediksi macet", "Itu targetnya!", "Audit: fitur vs target"],
         ["Future trx dalam agregat", "Lookahead (D7!)", "Jendela hanya masa lalu"]])
    L.raw(codebox("# POLA AMAN: semua transform fit di train\nfrom sklearn.preprocessing import StandardScaler\nscaler.fit(X_train)              # hanya train!\nX_train_s = scaler.transform(X_train)\nX_test_s = scaler.transform(X_test)  # pakai parameter train", "python"))
    L.raw(tip("Uji leakage: 'apakah fitur ini <em>sudah diketahui</em> saat prediksi dibuat?' + 'apakah ada info test di train?' Jika ragu → bocor. Model terlalu bagus (99%+) = curigai leakage <em>dulu</em>, rayakan <em>kemudian</em>."))
    L.raw(myth("Leakage hanya masalah pemula.",
        "Kaggle grandmaster pun pernah! Leakage = musuh abadi karena sering <em>halus</em> (ID berkorelasi waktu, duplikat train-test). <strong>Audit leakage</strong> = checklist wajib sebelum deploy (D14!)."))

    L.chart(
        data=[{"x": ["Fitur mentah\n(5 fitur)", "+ Agregat", "+ Rasio & waktu", "+ Encoding\nbenar"],
               "y": [60, 72, 81, 85], "type": "bar",
               "marker": {"color": ["#94a3b8", "#e8a838", "#2a7de1", "#34a853"]},
               "text": ["60%", "72%", "81%", "85%"], "textposition": "outside"}],
        title="Akurasi vs Tahap Feature Engineering (ilustrasi)",
        layout={"xaxis": {"title": "Tahap"}, "yaxis": {"title": "Akurasi %"}, "showlegend": False},
        cara="Model sama (logistic regression), fitur bertambah.",
        interpretasi="Fitur > algoritma: dari 60% ke 85% <strong>tanpa ganti model</strong>. Inilah mengapa waktu untuk feature engineering > waktu tuning hyperparameter. (Angka ilustrasi.)")

    L.sec("lab1", "🔬 Lab 1: Fitur Kredit")
    L.lab("Lab 1 — Bangun Fitur dari Data Mentah",
        "Dari data transaksi + nasabah: buat fitur agregat (total, count, max 30 hari), rasio, dan waktu. Semua vectorized!",
        PANDAS + r'''
import pandas as pd, numpy as np, io

trx = pd.read_csv(io.StringIO("""nasabah_id,tanggal,jumlah,kategori
1,2026-09-01,500000,belanja
1,2026-09-03,250000,makan
1,2026-09-15,1200000,travel
2,2026-09-01,1000000,belanja
2,2026-09-10,2000000,travel
2,2026-09-25,400000,makan"""), parse_dates=["tanggal"])
nasabah = pd.DataFrame({"id": [1, 2], "plafon": [50_000_000, 100_000_000]})

# AGREGAT per nasabah
agg = trx.groupby("nasabah_id").agg(
    trx_n=("jumlah", "count"),
    trx_sum=("jumlah", "sum"),
    trx_max=("jumlah", "max"),
    trx_mean=("jumlah", "mean"),
)
print(agg)

# RASIO: total trx / plafon
fitur = agg.merge(nasabah, left_index=True, right_on="id")
fitur["utilisasi_trx"] = fitur["trx_sum"] / fitur["plafon"]
# WAKTU: hari sejak trx terakhir (vs 2026-10-01)
terakhir = trx.groupby("nasabah_id")["tanggal"].max()
fitur = fitur.merge((pd.Timestamp("2026-10-01") - terakhir).dt.days.rename("hari_sejak_trx"),
                    left_on="id", right_index=True)
print("\nFITUR:"); print(fitur[["trx_n", "trx_sum", "utilisasi_trx", "hari_sejak_trx"]])

# Coba: fitur fraud apa yang bisa ditambah? (velocity? jam aneh?)
''',
        "Tantangan: buat fitur 'kategori dominan' (modus kategori per nasabah).")

    L.sec("lab2", "🔬 Lab 2: Encoding + Scaling Aman")
    L.lab("Lab 2 — One-Hot & Scaler Anti-Leakage",
        "One-hot kota + scaling plafon. Bagi train/test DULU, fit scaler HANYA di train!",
        PANDAS + SKLEARN + r'''
import pandas as pd, numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

df = pd.DataFrame({
    "kota": ["Jakarta", "Bandung", "Jakarta", "Surabaya", "Bandung", "Jakarta"],
    "plafon": [50e6, 100e6, 30e6, 200e6, 40e6, 90e6],
    "macet": [0, 0, 1, 0, 0, 1],
})

# 1. SPLIT DULU!
train, test = train_test_split(df, test_size=0.33, random_state=42)

# 2. One-hot (kolom sama di train & test!)
X_train = pd.get_dummies(train[["kota", "plafon"]], columns=["kota"])
X_test = pd.get_dummies(test[["kota", "plafon"]], columns=["kota"])
X_test = X_test.reindex(columns=X_train.columns, fill_value=0)
print("Kolom:", list(X_train.columns))

# 3. Scaling: FIT di train SAJA
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)  # pakai mean/std TRAIN
print("\nMean train setelah scaling:", X_train_s.mean(axis=0).round(2))

# Coba: apa yang terjadi jika fit di full data? (leakage! mean/std bocor)
''',
        "Eksperimen: kota baru di test ('Medan') — bagaimana get_dummies menanganinya? (reindex!)")

    L.sec("peta", "🗺️ Peta Keputusan: Fitur")
    L.decision("1", "Mulai dari → <strong>hipotesis domain</strong>",
        "Bermakna.",
        kenapa="Fitur dari pemahaman, bukan coba-coba.",
        contoh="'Fraud = cepat' → velocity.")
    L.decision("2", "Perilaku → <strong>agregat jendela</strong>",
        "Ringkasan.",
        kenapa="count/sum/max/mean per periode.",
        contoh="trx 30 hari.")
    L.decision("3", "Normalisasi → <strong>rasio</strong>",
        "Skala.",
        kenapa="Bagi dengan basis yang tepat.",
        contoh="Utilisasi = pakai/plafon.")
    L.decision("4", "Kategori kecil → <strong>one-hot</strong>",
        "Nominal.",
        kenapa="Kolom biner; besar → target encoding.",
        contoh="Kota.")
    L.decision("5", "Skew/model jarak → <strong>log/scaling</strong>",
        "Transform.",
        kenapa="log1p untuk skew; scaler untuk jarak/gradien.",
        contoh="log plafon.")
    L.decision("6", "Selalu → <strong>cek leakage</strong>",
        "Jujur.",
        kenapa="Point-in-time; fit hanya di train.",
        contoh="Audit fitur.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Fitur dari <strong>hipotesis domain</strong>.</li>"
        "<li>Kualitas > kuantitas; tiap fitur bisa dijelaskan.</li>"
        "<li>Scaling untuk jarak/gradien; tree tak butuh.</li>"
        "<li>Fit hanya di train. Curigai akurasi 99%+.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Fitur Skor Kredit (45+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Bangun fitur untuk prediksi 'macet dalam 12 bulan' dari data transaksi + nasabah. Prediksi dibuat <strong>saat pencairan</strong>.</p>"
        "<p><strong>Tugas:</strong> (1) Daftar 10 fitur (4 keluarga). (2) Untuk tiap fitur: tandai <strong>aman/bocor</strong> + alasan. (3) Pilih 5 terbaik + jelaskan.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Contoh fitur:</strong> ① trx_n_90d (aman: histori) ② rata-rata DPD histori (aman) ③ utilisasi (aman) ④ umur rekening (aman) ⑤ <strong>DPD saat ini</strong> (AMAN jika >0 saat cair? <strong>BOCOR</strong> jika nasabah baru!) ⑥ <strong>total denda dibayar</strong> (bocor: masa depan!) ⑦ jam trx rata-rata (aman) ⑧ kota (aman, one-hot) ⑨ <strong>'pernah macet'</strong> (bocor: itu target!) ⑩ tren trx (aman).</p>"
        "<p><strong>Pelajaran:</strong> audit leakage = <strong>simulasi waktu</strong>: 'apa yang diketahui <em>saat pencairan</em>?' Tulis tanggal observasi untuk tiap fitur. Inilah disiplin yang membedakan model kertas vs model produksi.</p>")))

    L.quiz("Feature engineering penting karena…",
        ["Menggantikan model", "Fitur bagus + model sederhana > model canggih + fitur mentah", "Wajib 1000 fitur", "Tidak penting"],
        1, "Benar: kualitas fitur = bahan bakar model.")
    L.quiz("Data leakage = …",
        ["Data hilang", "Fitur mengandung info masa depan/target — model menipu", "Data duplikat", "Fitur terlalu banyak"],
        1, "Benar: dosa terbesar. Curigai akurasi 99%+.")
    L.quiz("Scaler harus di-fit…",
        ["Di full data", "Hanya di train, lalu transform test", "Hanya di test", "Tidak perlu"],
        1, "Benar: statistik test bocor = leakage.")
    L.quiz("Scaling wajib untuk…",
        ["Random forest", "SVM/KNN/neural net (jarak/gradien)", "Semua model", "Tidak ada"],
        1, "Benar: tree tak peduli skala.")
    L.quiz("'DPD 90 hari' sebagai fitur prediksi <em>saat pencairan</em>…",
        ["Aman", "Leakage (belum terjadi!)", "Bagus", "Tidak masalah"],
        1, "Benar: point-in-time — hanya info saat observasi.")
    L.quiz("Kota dengan 200 nilai unik sebaiknya…",
        ["One-hot 200 kolom", "Target/frequency encoding", "Dihapus", "Label encoding ordinal"],
        1, "Benar: one-hot meledak; encoding alternatif.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>4 keluarga:</strong> agregat, rasio, waktu, kategorikal — dari hipotesis domain.</li>"
        "<li><strong>Encoding:</strong> one-hot (kecil); <strong>scaling:</strong> untuk jarak/gradien.</li>"
        "<li><strong>Leakage:</strong> point-in-time; fit hanya di train; curigai 99%+.</li>"
        "<li>Kualitas > kuantitas; tiap fitur bisa dijelaskan.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D11
def d11():
    L = Lesson("d11-scipy-statsmodels", "D11 — Python",
        "SciPy &amp; statsmodels:<br/>Uji Hipotesis di Python",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d10-feature-engineering", "← D10"), ("d12-sklearn", "Next: D12"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjalankan <strong>uji hipotesis</strong> dengan scipy (t-test, chi-square, dll).</li>"
        "<li>Menghubungkan ke <strong>track B</strong> (B8/B9: p-value, CI).</li>"
        "<li>Membuat <strong>regresi OLS</strong> dengan statsmodels + membaca summary.</li>"
        "<li>Menjelaskan <strong>asumsi</strong> tiap uji.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 'Kampanye Berhasil?'")
    L.raw('<div className="story"><p>Marketing: <em>&ldquo;Kampanye baru menaikkan konversi dari 5% ke 6,5%!&rdquo;</em> Kamu: <em>&ldquo;Sampelnya berapa? Signifikan tidak?&rdquo;</em> — 200 vs 200 orang. Uji proporsi: p = 0,52. <strong>Tidak signifikan.</strong> Kenaikan = noise.</p>'
        "<p>Track B mengajarkan <em>teori</em> uji hipotesis; lesson ini = <em>praktik</em> di Python. Setiap klaim 'naik/turun/berbeda' harus melewati uji — atau ia opini, bukan temuan.</p></div>")

    L.sec("scipy", "scipy.stats — Kotak Alat Uji")
    L.raw(codebox("from scipy import stats\nimport numpy as np\n\n# t-test: rata-rata 2 grup beda?\na = np.array([8.5, 9.0, 8.7, 9.2, 8.8])  # juta, kota A\nb = np.array([9.5, 9.8, 9.6, 10.0, 9.7]) # juta, kota B\nt, p = stats.ttest_ind(a, b)\nprint(f't={t:.2f}, p={p:.4f}')\n\n# chi-square: kategori berhubungan?\n# tabel: [[lancar_bayar, lancar_macet], [telat_bayar, telat_macet]]\nchi2, p, dof, exp = stats.chi2_contingency([[80, 20], [50, 50]])\nprint(f'chi2={chi2:.1f}, p={p:.4f}')", "python"))
    L.table(["Uji", "Fungsi", "Kapan", "Asumsi kunci"],
        [["t-test 2 sampel", "ttest_ind", "Rata-rata 2 grup", "Normalitas (n besar OK)"],
         ["t-test berpasangan", "ttest_rel", "Sebelum-sesudah", "Selisih normal"],
         ["Chi-square", "chi2_contingency", "Kategori × kategori", "Expected ≥ 5"],
         ["Shapiro", "shapiro", "Uji normalitas", "n < 5000"],
         ["Pearson r", "pearsonr", "Korelasi + p-value", "Linear"]])
    L.raw(tip("Alur: <strong>ajukan hipotesis → cek asumsi → pilih uji → baca p-value + effect size</strong>. p < 0,05 tanpa effect size = tidak lengkap! (B8/B9: teori lengkapnya.)"))
    L.raw(myth("p < 0,05 = terbukti.",
        "p-value = <em>probabilitas data seekstrem ini jika H0 benar</em> — bukan 'probabilitas H0 salah'! (B8). Dan dengan n raksasa, beda <em>trivial</em> jadi 'signifikan'. Selalu lapor <strong>effect size</strong> (beda rata-rata, Cohen's d) + <strong>CI</strong>."))

    L.sec("ols", "statsmodels — Regresi yang Bisa Dibaca")
    L.raw(codebox("import statsmodels.formula.api as smf\n\n# OLS dengan formula (mirip R!)\nmodel = smf.ols('dpd ~ penghasilan + tenor', data=df).fit()\nprint(model.summary())\n# baca: coef, P>|t| (signifikan?), R-squared", "python"))
    L.ul([
        "<strong>Formula:</strong> <code className=\"inline\">'y ~ x1 + x2'</code> — intuitif!",
        "<strong>summary():</strong> koefisien, p-value per variabel, R², diagnostik.",
        "<strong>Keunggulan vs sklearn:</strong> inferensi (p-value, CI) — untuk <em>penjelasan</em>, bukan prediksi.",
        "<strong>Asumsi OLS:</strong> linearitas, homoskedastisitas, normalitas residual, no multikolinearitas (VIF!).",
    ])
    L.raw(worked("📐 Membaca summary",
        "<p><code className=\"inline\">coef penghasilan = -0.000003, P>|t| = 0.001</code> → tiap Rp 1jt gaji naik, DPD turun 0.003 hari — <strong>signifikan</strong> tapi <strong>kecil</strong> (effect size!).</p>"
        "<p><code className=\"inline\">R-squared = 0.12</code> → model menjelaskan 12% variasi DPD — 88% faktor lain! Jangan oversell.</p>"
        "<p><strong>Aturan:</strong> signifikan ≠ penting. Lapor koefisien + p-value + R² + interpretasi bisnis.</p>"))
    L.raw(tip("Kapan statsmodels vs sklearn? <strong>statsmodels</strong> = 'mengapa' (inferensi, p-value, untuk laporan/riset). <strong>sklearn</strong> = 'berapa' (prediksi, untuk produksi). Analis butuh keduanya!"))

    L.sec("ab", "A/B Testing — Uji di Dunia Nyata")
    L.raw(codebox("# A/B: konversi 5% (1000) vs 6.5% (1000) — signifikan?\nfrom statsmodels.stats.proportion import proportions_ztest\ncount = [50, 65]   # konversi\nnobs = [1000, 1000]\nstat, p = proportions_ztest(count, nobs)\nprint(f'p={p:.3f}')  # p=0.15 -> TIDAK signifikan!\n# butuh n berapa? -> power analysis\nfrom statsmodels.stats.power import zt_ind_solve_power\nn = zt_ind_solve_power(effect_size=0.05, alpha=0.05, power=0.8)\nprint(f'butuh n ~ {n:.0f} per grup')", "python"))
    L.ul([
        "<strong>proportions_ztest:</strong> untuk rate/konversi (kasus paling umum!).",
        "<strong>Power analysis:</strong> hitung n <em>sebelum</em> eksperimen — jangan 'coba 200 dulu'.",
        "<strong>Peeking:</strong> intip hasil tiap hari + berhenti saat signifikan = p-value rusak! Tentukan n & durasi di awal.",
    ])
    L.raw(myth("'Naik 1,5pp' = berhasil.",
        "Tanpa uji = opini. A/B butuh: <strong>hipotesis awal</strong>, <strong>n cukup</strong> (power), <strong>durasi tetap</strong> (no peeking), <strong>metrik primer 1</strong> (bukan 20 metrik lalu pilih yang signifikan = p-hacking!)."))

    L.chart(
        data=[{"x": [50, 55, 60, 65, 70, 75, 80], "y": [0.02, 0.05, 0.08, 0.06, 0.03, 0.01, 0.005],
               "type": "bar", "name": "Distribusi H0", "marker": {"color": "#94a3b8"}},
              {"x": [72], "y": [0.02], "type": "scatter", "mode": "markers",
               "name": "Observasi", "marker": {"color": "#ef4444", "size": 14}}],
        title="p-value: Seberapa Ekstrem Observasi? (ilustrasi)",
        layout={"xaxis": {"title": "Statistik uji"}, "yaxis": {"title": "Probabilitas"}, "showlegend": True},
        cara="Abu-abu = distribusi jika H0 benar; merah = yang teramati.",
        interpretasi="p-value = luas area <em>di luar</em> titik merah. Jauh di ekor = jarang terjadi jika H0 benar → tolak H0. <strong>Ingat B8:</strong> ini bukan 'probabilitas H0 salah'!")

    L.sec("lab1", "🔬 Lab 1: Uji Beda Dua Kota")
    L.lab("Lab 1 — t-test + Effect Size",
        "Gaji Jakarta vs Bandung (data inline). Uji: apakah beda signifikan? Hitung juga selisih rata-rata (effect size!).",
        SCIPY + r'''
import numpy as np
from scipy import stats

rng = np.random.default_rng(42)
jakarta = rng.normal(9_500_000, 2_000_000, 60)
bandung = rng.normal(8_800_000, 2_000_000, 60)

# uji normalitas dulu (asumsi!)
print("Shapiro Jakarta p:", round(float(stats.shapiro(jakarta).pvalue), 3))

# t-test
t, p = stats.ttest_ind(jakarta, bandung)
print(f"t={t:.2f}, p={p:.4f}")
print(f"Selisih rata-rata: Rp {(jakarta.mean()-bandung.mean()):,.0f}")

# effect size: Cohen's d
d = (jakarta.mean() - bandung.mean()) / np.sqrt((jakarta.var() + bandung.var()) / 2)
print(f"Cohen's d: {d:.2f} (0.2 kecil, 0.5 sedang, 0.8 besar)")

# Coba: kecilkan n jadi 10 per grup. p-value berubah? (power!)
''',
        "Eksperimen: n=10 vs n=60 — kapan 'tidak signifikan' berarti 'tidak ada efek' vs 'data kurang'?")

    L.sec("lab2", "🔬 Lab 2: Chi-Square + Regresi")
    L.lab("Lab 2 — Kategori & OLS",
        "Uji: apakah status (lancar/telat) berhubungan dengan kota? (chi-square). Lalu OLS: dpd ~ penghasilan.",
        SCIPY + r'''
import pandas as pd, numpy as np
from scipy import stats

# chi-square: kota x bermasalah
tabel = [[70, 10],   # Jakarta: ok, bermasalah
         [45, 15],   # Bandung
         [30, 10]]   # Surabaya
chi2, p, dof, exp = stats.chi2_contingency(tabel)
print(f"chi2={chi2:.1f}, p={p:.4f}, dof={dof}")
print("Expected >= 5?", (exp >= 5).all())

# OLS manual via numpy (tanpa statsmodels di lab ini — konsepnya!)
rng = np.random.default_rng(7)
gaji = rng.normal(9e6, 2e6, 100)
dpd = 30 - 2e-6 * gaji + rng.normal(0, 8, 100)  # gaji naik -> dpd turun
dpd = np.clip(dpd, 0, None)

# slope via least squares
A = np.vstack([gaji, np.ones(len(gaji))]).T
slope, intercept = np.linalg.lstsq(A, dpd, rcond=None)[0]
pred = slope * gaji + intercept
r2 = 1 - ((dpd - pred) ** 2).sum() / ((dpd - dpd.mean()) ** 2).sum()
print(f"\nSlope: {slope:.2e} (dpd per rupiah)")
print(f"R2: {r2:.2f}")

# Coba: interpretasikan slope dalam bahasa bisnis!
''',
        "Di Colab: ulangi dengan statsmodels smf.ols('dpd ~ gaji') — bandingkan summary!")

    L.sec("peta", "🗺️ Peta Keputusan: Uji")
    L.decision("1", "Banding rata-rata 2 grup → <strong>t-test</strong>",
        "Numerik.",
        kenapa="Cek normalitas; lapor effect size.",
        contoh="Gaji 2 kota.")
    L.decision("2", "Kategori × kategori → <strong>chi-square</strong>",
        "Kategorikal.",
        kenapa="Expected ≥ 5.",
        contoh="Kota × bermasalah.")
    L.decision("3", "Rate/konversi A/B → <strong>proportions_ztest</strong>",
        "Proporsi.",
        kenapa="+ power analysis sebelum!",
        contoh="Kampanye A vs B.")
    L.decision("4", "Jelaskan hubungan → <strong>OLS statsmodels</strong>",
        "Inferensi.",
        kenapa="Koef + p-value + R².",
        contoh="dpd ~ gaji.")
    L.decision("5", "Prediksi → <strong>sklearn</strong> (D12)",
        "Prediksi.",
        kenapa="Bukan p-value, tapi akurasi.",
        contoh="Skor kredit.")
    L.decision("6", "Selalu → <strong>asumsi + effect size</strong>",
        "Lengkap.",
        kenapa="p-value saja = tidak cukup.",
        contoh="Cohen's d, CI.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Hipotesis → asumsi → uji → p-value + effect size.</li>"
        "<li>p < 0,05 ≠ terbukti; lapor CI + effect size.</li>"
        "<li>A/B: n dihitung dulu, no peeking.</li>"
        "<li>statsmodels = mengapa; sklearn = berapa.</li></ol>"))

    L.sec("case", "📋 Mini-Case: 'Kampanye Berhasil?' (45+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Kampanye: konversi 5,0% (n=1000) → 6,5% (n=1000). Marketing klaim berhasil, minta budget 10×.</p>"
        "<p><strong>Tugas:</strong> (1) Uji signifikansi. (2) Hitung n yang dibutuhkan (power 80%). (3) Tulis <strong>rekomendasi</strong> ke CMO: lanjutkan/tidak + syarat.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> proportions_ztest: p ≈ 0,15 → <strong>tidak signifikan</strong>. Kenaikan 1,5pp = noise pada n ini.</p>"
        "<p><strong>(2)</strong> Power analysis: butuh ~3.000+ per grup untuk deteksi 1,5pp (power 80%).</p>"
        "<p><strong>(3)</strong> 'Kenaikan belum signifikan (p=0,15). Jangan scale 10× dulu — lanjutkan eksperimen hingga n=3.000/grup dengan metrik primer tetap konversi. Jika signifikan + effect size bermakna bisnis, baru scale.'</p>"
        "<p><strong>Pelajaran:</strong> statistik = <strong>rem</strong> terhadap euforia. Analis yang bisa bilang 'belum terbukti' = penjaga uang perusahaan.</p>")))

    L.quiz("p = 0,03 artinya…",
        ["H0 97% salah", "Data seekstrem ini 3% mungkin jika H0 benar", "Efek besar", "Terbukti"],
        1, "Benar: definisi p-value (B8!). Bukan probabilitas H0 salah.")
    L.quiz("n raksasa + p < 0,05…",
        ["Pasti penting", "Bisa signifikan tapi efek trivial — cek effect size!", "Error", "Abaikan"],
        1, "Benar: signifikansi ≠ pentingnya.")
    L.quiz("Sebelum A/B test, wajib…",
        ["Langsung jalan", "Power analysis: hitung n dulu", "Pilih metrik belakangan", "Intip tiap jam"],
        1, "Benar: n cukup + durasi tetap + no peeking.")
    L.quiz("Chi-square butuh…",
        ["Data normal", "Expected frequency ≥ 5", "n > 10000", "Korelasi"],
        1, "Benar: asumsi tabel kontingensi.")
    L.quiz("statsmodels vs sklearn…",
        ["Sama", "statsmodels=inferensi (mengapa); sklearn=prediksi (berapa)", "sklearn lebih akurat", "statsmodels untuk big data"],
        1, "Benar: pilih sesuai tujuan.")
    L.quiz("Peeking (intip + berhenti saat signifikan)…",
        ["Praktik baik", "Merusak p-value — tentukan durasi di awal", "Mempercepat", "Wajib"],
        1, "Benar: optional stopping = p-hacking.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>scipy:</strong> ttest, chi2, shapiro, pearsonr — cek asumsi!</li>"
        "<li><strong>p-value</strong> + effect size + CI — tidak pernah p-value saja.</li>"
        "<li><strong>statsmodels OLS:</strong> formula + summary untuk inferensi.</li>"
        "<li><strong>A/B:</strong> power analysis dulu; no peeking; 1 metrik primer.</li>"
        "<li>Statistik = rem terhadap euforia.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D12
def d12():
    L = Lesson("d12-sklearn", "D12 — Python",
        "scikit-learn: Pipeline &amp;<br/>Cross-Validation",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d11-scipy-statsmodels", "← D11"), ("d13-performa", "Next: D13"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan alur <strong>fit/predict</strong> sklearn.</li>"
        "<li>Membuat <strong>Pipeline</strong> (preprocessing + model) yang anti-leakage.</li>"
        "<li>Menjalankan <strong>cross-validation</strong> &amp; membaca metrik (AUC, dll).</li>"
        "<li>Menjelaskan <strong>overfitting</strong> &amp; cara mendeteksinya.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Model 99% yang Hancur di Produksi")
    L.raw('<div className="story"><p>Model skor kredit: akurasi <strong>99%</strong> di laptop. Deploy 1 bulan: prediksi ngawur, kerugian Rp 500 juta. Investigasi: <strong>leakage</strong> (fitur "status kolektibilitas saat ini" = target!) + <strong>tanpa validasi</strong> yang benar.</p>'
        "<p>sklearn membuat ML <em>mudah</em> — terlalu mudah hingga orang lupa validasi. Lesson case-heavy ini (60+ menit): cara yang <strong>benar</strong> — pipeline + CV + metrik yang tepat. ML tanpa validasi = ramalan, bukan sains.</p></div>")

    L.sec("dasar", "fit/predict — Dua Kata Kunci")
    L.raw(codebox("from sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42)\n\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)      # belajar dari train\npred = model.predict(X_test)     # prediksi test\nproba = model.predict_proba(X_test)[:, 1]  # probabilitas!", "python"))
    L.ul([
        "<strong>fit(X, y):</strong> belajar; <strong>predict(X):</strong> prediksi kelas; <strong>predict_proba:</strong> probabilitas.",
        "<strong>X</strong> = fitur (2D); <strong>y</strong> = target (1D).",
        "<strong>train_test_split:</strong> <code className=\"inline\">random_state</code> untuk reproduksibel; <code className=\"inline\">stratify=y</code> untuk target tak seimbang!",
    ])
    L.raw(tip("Untuk fraud/kredit macet (target 1–5%): <strong>stratify=y</strong> wajib! Tanpa itu, test set bisa 0% positif — metrik menipu."))
    L.raw(myth("Akurasi 95% = model bagus.",
        "Jika 95% tidak macet, model 'tebak semua lancar' = 95% akurasi tapi <strong>tak menangkap 1 pun</strong> yang macet! Untuk imbalance: <strong>AUC, precision, recall, F1</strong> — bukan akurasi. (B... : metrik klasifikasi!)"))

    L.sec("pipeline", "Pipeline — Anti-Leakage by Design")
    L.raw(codebox("from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.impute import SimpleImputer\n\npipe = Pipeline([\n    ('imputer', SimpleImputer(strategy='median')),\n    ('scaler', StandardScaler()),\n    ('model', LogisticRegression()),\n])\npipe.fit(X_train, y_train)  # semua step fit HANYA di train!", "python"))
    L.ul([
        "<strong>Mengapa:</strong> preprocessing di dalam pipeline = otomatis fit-di-train-saja (D10!).",
        "<strong>ColumnTransformer:</strong> beda treatment per kolom (numerik: impute+scale; kategorikal: one-hot).",
        "<strong>Aturan:</strong> <em>jangan</em> preprocessing manual di luar pipeline lalu CV — itu leakage!",
    ])
    L.raw(myth("Pipeline hanya untuk kerapian.",
        "Pipeline = <strong>kebenaran metodologis</strong>! Preprocessing di luar CV = statistik test bocor ke train (D10). Pipeline memaksa urutan benar. Kerapian = bonus."))

    L.sec("cv", "Cross-Validation — Jangan Percaya 1 Split")
    L.raw(codebox("from sklearn.model_selection import cross_val_score, StratifiedKFold\n\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nskor = cross_val_score(pipe, X, y, cv=cv, scoring='roc_auc')\nprint(f'AUC: {skor.mean():.3f} (+/- {skor.std():.3f})')", "python"))
    L.ul([
        "<strong>K-fold:</strong> data dibagi 5; tiap lipatan jadi test 1× — 5 skor, bukan 1!",
        "<strong>Stratified:</strong> jaga proporsi target per lipatan (untuk imbalance).",
        "<strong>scoring:</strong> 'roc_auc', 'f1', 'precision', 'recall' — pilih sesuai <em>biaya kesalahan</em>.",
        "<strong>Lapor:</strong> mean ± std — bukan 1 angka!",
    ])
    L.raw(tip("Pilih metrik dari <em>bisnis</em>: fraud = recall penting (jangan lewatkan!); kredit = precision vs recall trade-off (tolak yang sehat = rugi). Metrik = keputusan bisnis, bukan default."))
    L.raw(myth("CV 5-fold = 5× lebih lambat, tidak worth it.",
        "1 split = 1 undian! Beda seed → beda hasil ±5%. CV memberi <strong>distribusi</strong> performa — 'AUC 0.82 ± 0.03' jauh lebih jujur dari 'AUC 0.85' (yang mungkin hoki). Untuk keputusan deploy, kejujuran > kecepatan."))

    L.sec("overfit", "Overfitting — Menghafal vs Belajar")
    L.p("<strong>Tanda:</strong> train 99%, test/CV 70% = <strong>menghafal</strong> (overfit). Model bagus: train ≈ CV (keduanya wajar).")
    L.raw(codebox("# diagnosis: learning curve sederhana\nfor depth in [2, 5, 10, None]:\n    m = DecisionTreeClassifier(max_depth=depth)\n    s = cross_val_score(m, X, y, cv=3)\n    print(f'depth={depth}: train~? CV={s.mean():.3f}')\n# pola: CV naik lalu TURUN = overfit mulai!", "python"))
    L.ul([
        "<strong>Obat:</strong> lebih banyak data, regularisasi (C, max_depth), fitur lebih sedikit, CV.",
        "<strong>Underfit:</strong> train & CV sama-sama jelek = model terlalu sederhana.",
        "<strong>Validasi:</strong> simpan <strong>holdout</strong> yang <em>tak pernah</em> disentuh hingga akhir!",
    ])
    L.raw(tip("Aturan data: <strong>train</strong> (latih) → <strong>CV</strong> (pilih model) → <strong>holdout</strong> (1× verifikasi akhir). Holdout yang dipakai 2× = bukan holdout lagi!"))

    L.chart(
        data=[{"x": ["Underfit", "Pas", "Overfit"], "y": [70, 85, 99], "type": "bar", "name": "Train",
               "marker": {"color": "#94a3b8"}},
              {"x": ["Underfit", "Pas", "Overfit"], "y": [68, 83, 70], "type": "bar", "name": "CV/Test",
               "marker": {"color": "#2a7de1"}}],
        title="Diagnosis: Train vs Test (ilustrasi)",
        layout={"barmode": "group", "yaxis": {"title": "Skor"}, "showlegend": True},
        cara="Abu-abu = train; biru = test/CV.",
        interpretasi="<strong>Overfit:</strong> train 99% tapi test 70% — menghafal! <strong>Pas:</strong> keduanya ~84% — belajar pola umum. <strong>Selalu bandingkan keduanya</strong> — train saja = menipu diri.")

    L.sec("lab1", "🔬 Lab 1: Pipeline Lengkap")
    L.lab("Lab 1 — Klasifikasi Macet (End-to-End)",
        "Dataset kredit inline. Bangun pipeline: impute + scale + logistic. Evaluasi dengan CV (AUC).",
        PANDAS + SKLEARN + r'''
import pandas as pd, numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

rng = np.random.default_rng(42)
n = 300
df = pd.DataFrame({
    "penghasilan": rng.normal(9e6, 2.5e6, n),
    "dpd": rng.poisson(15, n),
    "tenor": rng.choice([12, 24, 36], n),
})
# target: macet jika dpd tinggi + gaji rendah (dengan noise)
prob = 1 / (1 + np.exp(-(df["dpd"] / 10 - df["penghasilan"] / 5e6)))
df["macet"] = (rng.random(n) < prob).astype(int)
df.loc[rng.choice(n, 15), "penghasilan"] = np.nan  # missing!
print("Proporsi macet:", df["macet"].mean().round(3))

X, y = df[["penghasilan", "dpd", "tenor"]], df["macet"]
pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=500)),
])
cv = StratifiedKFold(5, shuffle=True, random_state=42)
skor = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
print(f"AUC: {skor.mean():.3f} +/- {skor.std():.3f}")

# Coba: ganti scoring='accuracy'. Kenapa menipu di sini? (imbalance!)
''',
        "Eksperimen: hapus SimpleImputer — apa yang terjadi? (NaN = error!)")

    L.sec("lab2", "🔬 Lab 2: Deteksi Overfitting")
    L.lab("Lab 2 — Depth vs CV",
        "Decision tree dengan max_depth bervariasi. Plot train vs CV — temukan titik overfit!",
        PANDAS + SKLEARN + r'''
import pandas as pd, numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(7)
n = 200
X = pd.DataFrame({"x1": rng.normal(0, 1, n), "x2": rng.normal(0, 1, n)})
y = ((X["x1"] + X["x2"] + rng.normal(0, 0.5, n)) > 0).astype(int)

print("depth | train | CV")
for depth in [1, 2, 3, 5, 10, None]:
    m = DecisionTreeClassifier(max_depth=depth, random_state=42)
    train_skor = m.fit(X, y).score(X, y)
    cv_skor = cross_val_score(m, X, y, cv=5).mean()
    flag = " <-- OVERFIT!" if train_skor - cv_skor > 0.15 else ""
    print(f"{str(depth):>5} | {train_skor:.3f} | {cv_skor:.3f}{flag}")

# Coba: depth berapa yang terbaik? (CV tertinggi, bukan train!)
''',
        "Renungkan: kenapa train terus naik tapi CV turun? (menghafal noise!)")

    L.sec("peta", "🗺️ Peta Keputusan: ML")
    L.decision("1", "Preprocessing → <strong>dalam Pipeline</strong>",
        "Anti-leakage.",
        kenapa="Fit hanya di train, otomatis.",
        contoh="impute+scale+model.")
    L.decision("2", "Evaluasi → <strong>CV stratified</strong>",
        "Jujur.",
        kenapa="Mean ± std, bukan 1 angka.",
        contoh="5-fold AUC.")
    L.decision("3", "Metrik → <strong>dari bisnis</strong>",
        "Relevan.",
        kenapa="Bukan default akurasi.",
        contoh="Recall untuk fraud.")
    L.decision("4", "Imbalance → <strong>stratify</strong>",
        "Wajib.",
        kenapa="Jaga proporsi target.",
        contoh="stratify=y.")
    L.decision("5", "Train >> CV → <strong>overfit</strong>",
        "Diagnosis.",
        kenapa="Regularisasi / data / fitur.",
        contoh="Batasi depth.")
    L.decision("6", "Deploy → <strong>holdout 1×</strong>",
        "Final.",
        kenapa="Tak tersentuh hingga akhir.",
        contoh="Verifikasi terakhir.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Pipeline untuk semua preprocessing.</li>"
        "<li>CV stratified; lapor mean ± std.</li>"
        "<li>Metrik dari biaya kesalahan bisnis.</li>"
        "<li>Train vs CV selalu dibandingkan.</li>"
        "<li>Holdout = sekali, di akhir.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Model 99% yang Hancur (60+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Model akurasi 99% di laptop, hancur di produksi (rugi Rp 500jt). Fitur termasuk 'kolektibilitas_saat_ini'. Evaluasi: 1 split train-test tanpa stratify.</p>"
        "<p><strong>Tugas:</strong> (1) Identifikasi <strong>2 kesalahan fatal</strong>. (2) Rancang ulang: pipeline + CV + metrik yang benar. (3) Tulis <strong>post-mortem 5 kalimat</strong> untuk direksi.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> ① <strong>Leakage:</strong> 'kolektibilitas_saat_ini' = target itu sendiri (saat prediksi, belum diketahui!). ② <strong>Validasi salah:</strong> 1 split tanpa stratify + metrik akurasi pada data imbalance = menipu.</p>"
        "<p><strong>(2)</strong> Hapus fitur bocor → fitur point-in-time (D10) → Pipeline(impute+scale+model) → StratifiedKFold CV → metrik AUC + precision/recall.</p>"
        "<p><strong>(3)</strong> 'Model 99% mengandung kebocoran data: ia 'mengintip' jawaban saat latihan. Di produksi tanpa jawaban, ia gagal. Kami membangun ulang dengan validasi benar (AUC 0.78, jujur) + checklist anti-leakage sebelum deploy berikutnya.'</p>"
        "<p><strong>Pelajaran:</strong> ML = <strong>validasi</strong>. Model tanpa validasi benar = bukan model, tapi <em>ilusi</em>. Checklist D14 mencegah ini.</p>")))

    L.quiz("Akurasi 95% pada data 95% negatif…",
        ["Bagus", "Menipu — model 'tebak semua negatif' pun 95%. Pakai AUC/precision/recall", "Sempurna", "Error"],
        1, "Benar: akurasi = metrik terburuk untuk imbalance.")
    L.quiz("Pipeline penting karena…",
        ["Rapi", "Preprocessing fit hanya di train — anti-leakage by design", "Cepat", "Wajib sklearn"],
        1, "Benar: kebenaran metodologis, bukan sekadar gaya.")
    L.quiz("CV melaporkan…",
        ["1 angka", "Mean ± std dari k lipatan", "Train score", "Waktu"],
        1, "Benar: distribusi performa, bukan undian 1 split.")
    L.quiz("StratifiedKFold untuk…",
        ["Kecepatan", "Jaga proporsi target tiap lipatan (imbalance)", "Shuffle", "Regresi"],
        1, "Benar: wajib untuk target tak seimbang.")
    L.quiz("Train 99%, CV 70% = …",
        ["Bagus", "Overfit — menghafal", "Underfit", "Normal"],
        1, "Benar: gap besar = menghafal noise.")
    L.quiz("Holdout dipakai…",
        ["Berkali-kali", "Sekali, di akhir, tak tersentuh sebelumnya", "Untuk training", "Tidak perlu"],
        1, "Benar: sekali pakai = sekali dipercaya.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>fit/predict:</strong> belajar di train, prediksi di test; stratify untuk imbalance.</li>"
        "<li><strong>Pipeline:</strong> preprocessing di dalam = anti-leakage by design.</li>"
        "<li><strong>CV:</strong> stratified k-fold; lapor mean ± std; metrik dari bisnis.</li>"
        "<li><strong>Overfit:</strong> train >> CV; obat = data/regularisasi/fitur.</li>"
        "<li><strong>Holdout:</strong> sekali di akhir. ML tanpa validasi = ilusi.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D13
def d13():
    L = Lesson("d13-performa", "D13 — Python",
        "Performa: Data Besar<br/>tanpa Drama",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("d12-sklearn", "← D12"), ("d14-rekayasa", "Next: D14"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menghemat memori dengan <strong>dtype tepat</strong> (category, int32, dll).</li>"
        "<li>Memproses file besar dengan <strong>chunking</strong>.</li>"
        "<li>Mengenal <strong>Polars &amp; DuckDB</strong> untuk data besar.</li>"
        "<li>Menerapkan <strong>aturan kapan optimasi</strong>.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Laptop Ngadat di 8GB")
    L.raw('<div className="story"><p>File 8GB, laptop 16GB RAM. <code className=\"inline\">pd.read_csv()</code> → memory error. Analis panik — deadline 2 jam. Solusi: <strong>chunking</strong> (baca 100rb baris sekaligus) + <strong>dtype hemat</strong> — selesai 20 menit tanpa upgrade hardware.</p>'
        "<p>Data tumbuh; RAM tidak. Lesson ini: teknik bertahan hidup data besar — dan kapan <em>pindah alat</em> (Polars/DuckDB).</p></div>")

    L.sec("dtype", "dtype Hemat — 10× Lebih Kecil")
    L.raw(codebox("print(df.memory_usage(deep=True).sum() / 1e6, 'MB')\n\n# hemat:\ndf['kota'] = df['kota'].astype('category')       # object -> category\n# df['id'] = df['id'].astype('int32')            # jika cukup\ndf['flag'] = df['flag'].astype('bool')\n# df['nilai'] = df['nilai'].astype('float32')    # jika presisi cukup\n\nprint(df.memory_usage(deep=True).sum() / 1e6, 'MB')", "python"))
    L.ul([
        "<strong>category:</strong> string berulang (kota, status) — hemat 10×+.",
        "<strong>int32/float32:</strong> jika range/presisi cukup — hemat 2×.",
        "<strong>bool:</strong> untuk flag — 8× lebih hemat dari object!",
        "<strong>Ukur:</strong> <code className=\"inline\">memory_usage(deep=True)</code> sebelum/sesudah.",
    ])
    L.raw(tip("Saat baca CSV besar: <code className=\"inline\">pd.read_csv(..., dtype={'kota': 'category'}, usecols=[...])</code> — hemat dari <em>awal</em> (usecols = baca yang perlu saja!)."))
    L.raw(myth("float32 selalu aman.",
        "float32 presisi ~7 digit — untuk uang (Rp 123.456.789) = <strong>kehilangan presisi</strong>! Uang = int (rupiah) atau float64. Hemat memori <em>jangan</em> korbankan kebenaran."))

    L.sec("chunk", "Chunking — Makan Gajah Seiris")
    L.raw(codebox("total = 0\nn = 0\nfor chunk in pd.read_csv('besar.csv', chunksize=100_000):\n    # proses per chunk (agregat parsial!)\n    total += (chunk['jumlah'] * chunk['kurs']).sum()\n    n += len(chunk)\nprint('total:', total, 'n:', n)\n\n# atau: filter saat baca, simpan yang lolos saja\n# for chunk in pd.read_csv('besar.csv', chunksize=100_000):\n#     chunk[chunk['tahun'] == 2026].to_csv('kecil.csv', mode='a')", "python"))
    L.ul([
        "<strong>chunksize:</strong> iterator per N baris — memori tetap kecil.",
        "<strong>Syarat:</strong> operasi harus <em>agregabel</em> (sum/count/mean via sum+count) — bukan median global!",
        "<strong>Pola:</strong> filter-dulu-simpan (kecilkan), atau agregat-parsial-gabung.",
    ])
    L.raw(myth("Chunking selalu bisa.",
        "Tidak untuk operasi <em>global</em>: median, ranking, dedup lintas chunk, sort penuh. Untuk itu: <strong>sampel</strong> dulu, atau pindah ke alat yang tepat (DuckDB!)."))

    L.sec("alat", "Polars &amp; DuckDB — Naik Kelas")
    L.table(["", "pandas", "Polars", "DuckDB"],
        [["Gaya", "Eager", "Eager + Lazy", "SQL di Python!"],
         ["Kecepatan", "Baik", "Sangat (multithread, Rust)", "Sangat (kolom, C++)"],
         ["Data besar", "RAM", "RAM (efisien) / streaming", "Disk! (out-of-core)"],
         ["Kapan", "Default", "Transformasi berat", "Query file langsung"]])
    L.raw(codebox("# DuckDB: SQL langsung ke file (tanpa load ke RAM!)\n# import duckdb\n# duckdb.sql(\"SELECT kota, SUM(jumlah) FROM 'besar.parquet' GROUP BY 1\").df()\nprint('DuckDB: query parquet/csv langsung dari disk!')\n\n# Polars: seperti pandas tapi multithread + lazy\n# import polars as pl\n# (pl.scan_csv('besar.csv').filter(pl.col('tahun')==2026)\n#    .group_by('kota').agg(pl.col('jumlah').sum()).collect())\nprint('Polars: lazy query, dieksekusi optimal saat .collect()')", "python"))
    L.ul([
        "<strong>DuckDB:</strong> 'SQLite untuk analitik' — SQL ke parquet/CSV tanpa server, dari disk!",
        "<strong>Polars:</strong> DataFrame multithread + lazy evaluation (optimasi query otomatis).",
        "<strong>Parquet:</strong> format kolom biner — 10× lebih kecil & cepat dari CSV. <strong>Standar 2026!</strong>",
    ])
    L.raw(tip("Aturan migrasi: pandas lambat tapi <em>cukup</em> → tetap pandas. Terasa lambat (>menit) → dtype/chunk dulu. Masih lambat → Polars/DuckDB. <strong>Jangan pindah alat sebelum optimasi dasar!</strong>"))

    L.chart(
        data=[{"x": ["CSV", "Parquet"], "y": [800, 80], "type": "bar", "name": "Ukuran (MB)",
               "marker": {"color": "#2a7de1"}},
              {"x": ["CSV", "Parquet"], "y": [60, 5], "type": "bar", "name": "Waktu baca (dtk)",
               "marker": {"color": "#e8a838"}}],
        title="CSV vs Parquet: 10 Juta Baris (ilustrasi)",
        layout={"barmode": "group", "yaxis": {"title": "MB / detik"}, "showlegend": True},
        cara="Perbandingan ukuran file & waktu baca.",
        interpretasi="Parquet 10× lebih kecil & 12× lebih cepat baca — <em>plus</em> bisa baca kolom tertentu saja! <strong>Standar 2026:</strong> simpan data analitik sebagai parquet, bukan CSV.")

    L.sec("lab1", "🔬 Lab 1: Diet Memori")
    L.lab("Lab 1 — Ukur & Hemat",
        "DataFrame 100rb baris. Ukur memori, terapkan category/int32/bool, ukur lagi. Berapa % hemat?",
        r'''
import pandas as pd, numpy as np

rng = np.random.default_rng(42)
n = 100_000
df = pd.DataFrame({
    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya", "Medan"], n),
    "status": rng.choice(["lancar", "telat", "macet"], n),
    "dpd": rng.integers(0, 200, n),
    "flag": rng.choice([True, False], n),
})
# simulasi boros: object & int64
df["kota"] = df["kota"].astype(object)

sebelum = df.memory_usage(deep=True).sum() / 1e6
print(f"Sebelum: {sebelum:.1f} MB")

df["kota"] = df["kota"].astype("category")
df["status"] = df["status"].astype("category")
df["dpd"] = df["dpd"].astype("int32")

sesudah = df.memory_usage(deep=True).sum() / 1e6
print(f"Sesudah: {sesudah:.1f} MB")
print(f"Hemat: {(1 - sesudah/sebelum):.0%}!")

# Coba: groupby di category vs object — ada beda kecepatan? (%%time di Colab)
''',
        "Jebakan: astype('int32') pada kolom dengan NaN — apa yang terjadi? (Int32 nullable!)")

    L.sec("lab2", "🔬 Lab 2: Chunking Manual")
    L.lab("Lab 2 — Agregat Tanpa Load Penuh",
        "Simulasikan file besar: proses 1 juta baris dalam chunk 100rb. Hitung total + rata-rata tanpa load sekaligus!",
        r'''
import pandas as pd, numpy as np

# simulasi: generator chunk (seperti read_csv chunksize)
def gen_chunks(n_total=1_000_000, chunk_n=100_000, seed=42):
    rng = np.random.default_rng(seed)
    for _ in range(n_total // chunk_n):
        yield pd.DataFrame({"jumlah": rng.normal(500_000, 100_000, chunk_n)})

total, n = 0.0, 0
for i, chunk in enumerate(gen_chunks()):
    total += chunk["jumlah"].sum()
    n += len(chunk)
    # print(f"chunk {i}: memori kecil, progres {n:,}")

print(f"Total: Rp {total:,.0f}")
print(f"Rata-rata: Rp {total/n:,.0f}")
print(f"Baris diproses: {n:,} (peak RAM: 1 chunk saja!)")

# Coba: hitung juga MAX per chunk lalu max global — benar? (ya, max agregabel!)
# Coba: median — bisa? (TIDAK langsung! butuh pendekatan)
''',
        "Renungkan: operasi apa yang TIDAK bisa di-chunk? (median, rank, dedup global)")

    L.sec("peta", "🗺️ Peta Keputusan: Performa")
    L.decision("1", "Lambat → <strong>ukur dulu</strong>",
        "Profil.",
        kenapa="Jangan tebak; %%time/memory_usage.",
        contoh="Mana yang lambat?")
    L.decision("2", "Memori bengkak → <strong>dtype + usecols</strong>",
        "Diet.",
        kenapa="category, int32, baca yang perlu.",
        contoh="10× hemat.")
    L.decision("3", "File > RAM → <strong>chunking</strong>",
        "Seiris.",
        kenapa="Agregat parsial; filter-simpan.",
        contoh="chunksize=100rb.")
    L.decision("4", "Butuh SQL ke file → <strong>DuckDB</strong>",
        "Query disk.",
        kenapa="Tanpa load RAM; parquet.",
        contoh="SELECT dari parquet.")
    L.decision("5", "Transformasi berat → <strong>Polars</strong>",
        "Multithread.",
        kenapa="Lazy + Rust.",
        contoh="ETL besar.")
    L.decision("6", "Simetri → <strong>parquet</strong>",
        "Format.",
        kenapa="10× kecil/cepat; standar.",
        contoh="Simpan antar-tahap.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Ukur dulu, optimasi kemudian.</li>"
        "<li>dtype + usecols sebelum alat baru.</li>"
        "<li>Uang = int/float64, bukan float32!</li>"
        "<li>Simpan parquet, bukan CSV.</li>"
        "<li>Cukup cepat = berhenti.</li></ol>"))

    L.sec("case", "📋 Mini-Case: 8GB, 2 Jam")
    L.raw(callout("<p><strong>Situasi:</strong> File transaksi 8GB CSV, laptop 16GB. Butuh: total per kategori per bulan. Deadline 2 jam.</p>"
        "<p><strong>Tugas:</strong> tulis rencana + kode. (Petunjuk: gabungkan teknik!)</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Rencana:</strong> ① <code className=\"inline\">usecols=['tanggal','kategori','jumlah']</code> + <code className=\"inline\">dtype={'kategori':'category'}</code> + <code className=\"inline\">parse_dates</code> ② chunk 500rb ③ agregat parsial per chunk (groupby bulan+kategori) ④ gabung + agregat final.</p>"
        "<p><code className=\"inline\">parsial = []<br/>for c in pd.read_csv('f.csv', chunksize=500_000, usecols=[...]):<br/>&nbsp;&nbsp;c['bulan'] = pd.to_datetime(c['tanggal']).dt.to_period('M')<br/>&nbsp;&nbsp;parsial.append(c.groupby(['bulan','kategori'])['jumlah'].sum())<br/>hasil = pd.concat(parsial).groupby(level=[0,1]).sum()</code></p>"
        "<p><strong>Alternatif modern:</strong> <code className=\"inline\">duckdb.sql(\"SELECT strftime(tanggal,'%Y-%m'), kategori, SUM(jumlah) FROM 'f.csv' GROUP BY 1,2\")</code> — 3 baris! <strong>Pelajaran:</strong> alat tepat > kerja keras.</p>")))

    L.quiz("category menghemat karena…",
        ["Kompresi ajaib", "Simpan kode int + tabel nilai unik (bukan string berulang)", "Hapus data", "Tidak hemat"],
        1, "Benar: string 'Jakarta' 1jt× → 1× + kode int.")
    L.quiz("Uang Rp 123.456.789 sebagai float32…",
        ["Aman", "Kehilangan presisi! Pakai int/float64", "Lebih akurat", "Error"],
        1, "Benar: 7 digit presisi tak cukup.")
    L.quiz("Chunking TIDAK bisa untuk…",
        ["Sum", "Median global / ranking / dedup lintas chunk", "Count", "Filter"],
        1, "Benar: butuh seluruh data sekaligus.")
    L.quiz("DuckDB unggul untuk…",
        ["Training deep learning", "SQL langsung ke file (parquet/CSV) tanpa load RAM", "Plotting", "Web app"],
        1, "Benar: analitik out-of-core.")
    L.quiz("Parquet vs CSV…",
        ["Sama", "Parquet 10× kecil/cepat + baca kolom parsial", "CSV lebih cepat", "Parquet hanya untuk gambar"],
        1, "Benar: standar 2026 untuk data analitik.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>dtype:</strong> category/int32/bool — ukur dengan memory_usage.</li>"
        "<li><strong>Chunking:</strong> agregat parsial untuk file > RAM.</li>"
        "<li><strong>DuckDB:</strong> SQL ke file; <strong>Polars:</strong> transformasi cepat.</li>"
        "<li><strong>Parquet:</strong> format standar analitik.</li>"
        "<li>Ukur dulu; cukup cepat = berhenti.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D14
def d14():
    L = Lesson("d14-rekayasa", "D14 — Python",
        "Rekayasa: Modul, Test &amp;<br/>Reproducibility",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d13-performa", "← D13"), ("d15-sql-python-api", "Next: D15"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menyusun kode sebagai <strong>modul</strong> (bukan notebook raksasa).</li>"
        "<li>Menulis <strong>test</strong> dengan pytest untuk fungsi analisis.</li>"
        "<li>Menerapkan <strong>validasi data</strong> (pandera/great expectations konsep).</li>"
        "<li>Menjamin <strong>reproducibility</strong> (seed, env, versi).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: 'Di Laptop Saya Bisa'")
    L.raw('<div className="story"><p>Analisis brilian — tapi hanya jalan di laptop pembuatnya. Di laptopmu: error library, hasil beda, path hardcode <code className=\"inline\">C:\\Users\\Budi\\...</code>. 3 hari untuk reproduksi.</p>'
        "<p><strong>Rekayasa</strong> (software engineering untuk analis) = kode yang <em>jalan di mana saja</em>, <em>teruji</em>, <em>terreproduksi</em>. Ini pembeda analis senior — dan yang dicari di lowongan 2026 ('reproducible analysis', 'testing').</p></div>")

    L.sec("modul", "Modul — Pecah Notebook Raksasa")
    L.raw(codebox("# proyek_analisis/\n#   config.py        <- parameter (bukan hardcode!)\n#   cleaning.py      <- fungsi cleaning (D5)\n#   features.py      <- fungsi fitur (D10)\n#   analisis.py      <- alur utama\n\n# config.py\nAMBANG_DPD = 30\nPATH_DATA = 'data/kredit.parquet'\nSEED = 42\n\n# analisis.py\nfrom cleaning import bersihkan\nfrom config import PATH_DATA, SEED", "python"))
    L.ul([
        "<strong>Aturan:</strong> 1 file = 1 tanggung jawab; fungsi murni (input → output, tanpa efek samping).",
        "<strong>config.py:</strong> semua angka/path di satu tempat — ubah tanpa sentuh logika.",
        "<strong>if __name__ == '__main__':</strong> — file bisa di-import <em>dan</em> dijalankan.",
    ])
    L.raw(tip("Bau kode: angka ajaib ('30' tersebar), path hardcode, fungsi 100 baris, copy-paste. Obat: config, parameter, pecah fungsi."))
    L.raw(myth("Notebook cukup untuk analis.",
        "Notebook = eksplorasi (bagus!). Produksi/berbagi = modul + script. Aturan: <strong>eksplorasi di notebook, produksi di .py</strong>. Notebook yang di-run ulang hasilnya beda = bukan analisis, tapi <em>pertunjukan</em>."))

    L.sec("pytest", "pytest — Test untuk Analis")
    L.raw(codebox("# test_cleaning.py\nfrom cleaning import bucket_dpd\n\ndef test_bucket_batas():\n    assert bucket_dpd(0) == 'lancar'\n    assert bucket_dpd(30) == 'ringan'\n    assert bucket_dpd(31) == 'sedang'\n\ndef test_bucket_negatif():\n    try:\n        bucket_dpd(-5)\n        assert False, 'harus error!'\n    except ValueError:\n        pass\n# jalankan: pytest test_cleaning.py", "python"))
    L.ul([
        "<strong>Apa yang di-test:</strong> fungsi cleaning, fitur, metrik — <em>logika</em>, bukan data.",
        "<strong>Batas:</strong> test nilai tepi (0, 30, 31) — di situlah bug bersembunyi!",
        "<strong>Property test:</strong> 'NPL ratio selalu 0–1', 'tidak ada NaN setelah cleaning'.",
    ])
    L.raw(tip("Mulai kecil: test 3 fungsi terpentingmu. Test yang jalan tiap perubahan = <strong>jaring pengaman</strong> saat refactor."))
    L.raw(myth("Test memperlambat analis.",
        "Test 10 menit menghemat <em>debugging 2 jam</em> saat ubah kode 3 bulan kemudian. Dan test = <strong>dokumentasi hidup</strong> ('fungsi ini seharusnya...')."))

    L.sec("validasi", "Validasi Data — Test untuk Data ⭐")
    L.p("<strong>Konsep</strong> (pandera / great expectations): skema + aturan sebagai <em>kode</em>, dicek otomatis tiap data masuk:")
    L.raw(codebox("# konsep pandera (pola - tanpa install di lab)\naturan = {\n    'penghasilan': {'min': 0, 'tidak_null': True},\n    'dpd': {'min': 0, 'max': 3650},\n    'kota': {'nilai_boleh': ['Jakarta', 'Bandung', 'Surabaya', 'Medan']},\n}\n\ndef validasi(df, aturan):\n    masalah = []\n    if (df['penghasilan'] < 0).any():\n        masalah.append('penghasilan negatif!')\n    if not df['kota'].isin(aturan['kota']['nilai_boleh']).all():\n        masalah.append('kota tak dikenal!')\n    assert not masalah, masalah\n    return True", "python"))
    L.ul([
        "<strong>Validasi ≠ cleaning:</strong> cleaning <em>memperbaiki</em>; validasi <em>menolak/menandai</em> yang melanggar.",
        "<strong>Di pipeline:</strong> validasi di <em>pintu masuk</em> — data busuk ditolak sebelum meracuni.",
        "<strong>Job relevance:</strong> 'data validation' = skill yang dicari 2026 (dbt test = versi SQL-nya, C15!).",
    ])
    L.raw(tip("Lima validasi universal: (1) skema (kolom+tipe), (2) range, (3) nilai diizinkan, (4) tidak null (kolom kunci), (5) unik (id). Mulai dari sini!"))

    L.sec("repro", "Reproducibility — Hasil yang Bisa Diulang")
    L.raw(codebox("# 1. seed di satu tempat (config.py)\nimport random, numpy as np\nSEED = 42\nrandom.seed(SEED); np.random.seed(SEED)\n\n# 2. catat environment\n# pip freeze > requirements.txt\n\n# 3. catat versi data + kode\n# git commit + hash dataset di laporan", "python"))
    L.table(["Pilar", "Cara", "Tanpa ini"],
        [["Seed", "config.SEED; rng(seed)", "Hasil beda tiap run"],
         ["Environment", "requirements.txt", "'Di laptop saya bisa'"],
         ["Versi data", "Hash/tanggal dataset", "Data berubah diam-diam"],
         ["Versi kode", "git", "Tidak tahu yang mana dipakai"]])
    L.raw(myth("'Hasilnya sama kok kemarin.'",
        "Tanpa seed+env+versi, 'sama' = kebetulan. Sains = <strong>reproduksibel</strong>. Laporan tanpa info reproduksibilitas = anekdot, bukan analisis."))
    L.raw(tip("Checklist sebelum kirim analisis: ☐ seed tercatat ☐ requirements ☐ versi data ☐ kode di git ☐ hasil bisa di-run ulang dari nol. 5 centang = profesional."))

    L.chart(
        data=[{"x": ["Tanpa test", "Dengan test"], "y": [120, 20], "type": "bar", "name": "Waktu debug (mnt)",
               "marker": {"color": ["#ef4444", "#34a853"]}}],
        title="Waktu Debug Perubahan Kode (ilustrasi)",
        layout={"yaxis": {"title": "Menit"}, "showlegend": False},
        cara="Waktu menemukan bug setelah ubah kode 3 bulan kemudian.",
        interpretasi="Test = <strong>asuransi</strong>: bayar 10 menit sekarang, hemat 100 menit nanti. Bug yang ditangkap test = bug yang <em>tidak</em> sampai ke direksi.")

    L.sec("lab1", "🔬 Lab 1: Tulis Test Pertama")
    L.lab("Lab 1 — pytest Pola",
        "Fungsi bucket_dpd + npl_ratio. Tulis test: batas, negatif, NPL selalu 0–1. Jalankan pola assert!",
        r'''
# --- modul mini (cleaning.py pola) ---
def bucket_dpd(dpd):
    if dpd < 0:
        raise ValueError("dpd negatif!")
    if dpd == 0: return "lancar"
    if dpd <= 30: return "ringan"
    if dpd <= 90: return "sedang"
    return "berat"

def npl_ratio(plafon_npl, plafon_total):
    if plafon_total == 0: return 0.0
    return plafon_npl / plafon_total

# --- test (test_cleaning.py pola) ---
def test_bucket_batas():
    assert bucket_dpd(0) == "lancar"
    assert bucket_dpd(30) == "ringan"   # batas!
    assert bucket_dpd(31) == "sedang"   # batas!
    assert bucket_dpd(91) == "berat"
    print("test_bucket_batas LOLOS")

def test_bucket_negatif():
    try:
        bucket_dpd(-5)
        raise AssertionError("harusnya ValueError!")
    except ValueError:
        print("test_bucket_negatif LOLOS")

def test_npl_range():
    for a, b in [(0, 100), (50, 100), (100, 100), (0, 0)]:
        r = npl_ratio(a, b)
        assert 0 <= r <= 1, f"gagal untuk {a}/{b}"
    print("test_npl_range LOLOS")

test_bucket_batas(); test_bucket_negatif(); test_npl_range()
print("\nSemua test lolos! (di lokal: pytest test_cleaning.py)")

# Coba: tambahkan test untuk bucket_dpd(30.5) — float! Apa yang terjadi?
''',
        "Tantangan: test untuk fungsi parse_gaji (D2) — kasus '8,500,000', 'abc', None.")

    L.sec("lab2", "🔬 Lab 2: Validasi Data")
    L.lab("Lab 2 — Gate Validasi",
        "Buat fungsi validasi: skema + range + nilai diizinkan. Uji dengan data BERSIH vs KOTOR — yang kotor harus DITOLAK!",
        r'''
import pandas as pd

ATURAN = {
    "kolom_wajib": ["id", "kota", "penghasilan", "dpd"],
    "kota_boleh": ["Jakarta", "Bandung", "Surabaya", "Medan"],
    "dpd_min": 0, "dpd_max": 3650,
}

def validasi(df):
    masalah = []
    for k in ATURAN["kolom_wajib"]:
        if k not in df.columns: masalah.append(f"kolom hilang: {k}")
    if (df["dpd"] < ATURAN["dpd_min"]).any() or (df["dpd"] > ATURAN["dpd_max"]).any():
        masalah.append("dpd di luar range!")
    asing = df[~df["kota"].isin(ATURAN["kota_boleh"])]["kota"].unique()
    if len(asing): masalah.append(f"kota tak dikenal: {list(asing)}")
    if df["id"].duplicated().any(): masalah.append("id duplikat!")
    if masalah: raise ValueError("VALIDASI GAGAL: " + "; ".join(masalah))
    return True

bersih = pd.DataFrame({"id": [1, 2], "kota": ["Jakarta", "Bandung"],
                        "penghasilan": [8e6, 9e6], "dpd": [0, 15]})
kotor = pd.DataFrame({"id": [1, 1], "kota": ["Jakarta", "Mars"],
                       "penghasilan": [8e6, 9e6], "dpd": [-5, 15]})

print("Data bersih:", end=" ")
try: validasi(bersih); print("LOLOS")
except ValueError as e: print(e)

print("Data kotor:", end=" ")
try: validasi(kotor); print("LOLOS")
except ValueError as e: print(e)

# Coba: tambahkan aturan 'penghasilan > 0'. Di mana menaruhnya? (pintu masuk!)
''',
        "Refleksi: validasi ini = dbt test versi Python (C15). Di mana di pipeline menaruhnya?")

    L.sec("peta", "🗺️ Peta Keputusan: Rekayasa")
    L.decision("1", "Eksplorasi → <strong>notebook</strong>",
        "Coba-coba.",
        kenapa="Cepat, visual.",
        contoh="EDA awal.")
    L.decision("2", "Produksi/berbagi → <strong>modul .py</strong>",
        "Serius.",
        kenapa="Terstruktur, teruji.",
        contoh="Pipeline.")
    L.decision("3", "Logika penting → <strong>pytest</strong>",
        "Aman.",
        kenapa="Jaring pengaman refactor.",
        contoh="Fungsi cleaning.")
    L.decision("4", "Data masuk → <strong>validasi</strong>",
        "Gate.",
        kenapa="Tolak busuk di pintu.",
        contoh="Skema + range.")
    L.decision("5", "Kirim hasil → <strong>checklist repro</strong>",
        "Profesional.",
        kenapa="seed+env+data+kode.",
        contoh="5 centang.")
    L.decision("6", "Angka config → <strong>config.py</strong>",
        "Fleksibel.",
        kenapa="Ubah tanpa sentuh logika.",
        contoh="Ambang, path, seed.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Notebook untuk eksplorasi; .py untuk produksi.</li>"
        "<li>Test fungsi penting (batas!); validasi data masuk.</li>"
        "<li>config.py untuk semua angka/path.</li>"
        "<li>5 centang repro sebelum kirim.</li></ol>"))

    L.sec("case", "📋 Mini-Case: 'Di Laptop Saya Bisa'")
    L.raw(callout("<p><strong>Situasi:</strong> Analisis hanya jalan di laptop Budi. Error di tempatmu: library beda versi, path <code className=\"inline\">C:\\Users\\Budi</code>, hasil beda tiap run.</p>"
        "<p><strong>Tugas:</strong> (1) Diagnosis 4 masalah. (2) Rencana perbaikan (struktur + file). (3) Tulis <strong>checklist repro</strong> untuk tim.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> ① env tak tercatat ② path hardcode ③ seed tak ada ④ kode+data tak versi.</p>"
        "<p><strong>(2)</strong> <code className=\"inline\">proyek/{config.py, cleaning.py, analisis.py, requirements.txt, README}</code> + path relatif + SEED di config + git.</p>"
        "<p><strong>(3)</strong> ☐ requirements.txt ☐ path relatif ☐ seed ☐ git commit ☐ versi data di README ☐ run dari nol berhasil.</p>"
        "<p><strong>Pelajaran:</strong> 'bisa di laptop saya' = <strong>kegagalan profesional</strong>. Rekayasa = empati ke <em>pengguna kode berikutnya</em> (termasuk dirimu 3 bulan lagi).</p>")))

    L.quiz("Notebook vs modul .py…",
        ["Sama", "Notebook=eksplorasi; .py=produksi/berbagi", "Notebook untuk produksi", ".py usang"],
        1, "Benar: pilih sesuai fase.")
    L.quiz("Test paling penting untuk…",
        ["Semua baris", "Fungsi logika penting, terutama nilai batas", "Import", "Print"],
        1, "Benar: bug bersembunyi di batas (0, 30, 31).")
    L.quiz("Validasi vs cleaning…",
        ["Sama", "Validasi=menolak/menandai yang melanggar; cleaning=memperbaiki", "Cleaning lebih penting", "Validasi tidak perlu"],
        1, "Benar: beda peran, keduanya perlu.")
    L.quiz("Lima validasi universal…",
        ["Plot 5 chart", "Skema, range, nilai diizinkan, not null, unik", "5 model ML", "Tidak ada"],
        1, "Benar: mulai dari sini.")
    L.quiz("Reproducibility butuh…",
        ["Seed saja", "Seed + env + versi data + versi kode", "Git saja", "Tidak perlu"],
        1, "Benar: 4 pilar.")
    L.quiz("Angka/path sebaiknya di…",
        ["Tersebar di kode", "config.py — satu tempat", "Di kepala", "Hardcode"],
        1, "Benar: ubah tanpa sentuh logika.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Modul:</strong> 1 file 1 tugas; config.py untuk angka/path.</li>"
        "<li><strong>pytest:</strong> test logika penting (batas!) = jaring pengaman.</li>"
        "<li><strong>Validasi data:</strong> gate di pintu masuk (5 universal).</li>"
        "<li><strong>Repro:</strong> seed + env + data + kode (5 centang).</li>"
        "<li>Notebook eksplorasi; .py produksi.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== D15
def d15():
    L = Lesson("d15-sql-python-api", "D15 — Python",
        "SQL × Python × API:<br/>Orkestrasi Seorang Analis",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("d14-rekayasa", "← D14"), (None, None))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menghubungkan <strong>Python ↔ database</strong> (sqlite3, pola umum).</li>"
        "<li>Menerapkan pola <strong>SQL untuk ambil, Python untuk olah</strong>.</li>"
        "<li>Mengambil data dari <strong>REST API</strong> (requests).</li>"
        "<li>Merancang <strong>pipeline mini</strong> end-to-end (capstone mini!).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Hari Pertama Kerja")
    L.raw('<div className="story"><p>Hari pertama sebagai data analyst. Tugas: <em>&ldquo;Ambil data transaksi bulan ini dari database, gabungkan dengan kurs dari API, hitung NPL per kota, kirim ringkasannya.&rdquo;</em></p>'
        "<p>Ini <strong>pekerjaan nyata</strong> — dan membutuhkan <em>semua</em> yang kamu pelajari: SQL (C) + Python (D) + API. Lesson penutup track D ini (60+ menit, capstone mini) merangkai semuanya menjadi <strong>pipeline end-to-end</strong>. Setelah ini: kamu siap kerja.</p></div>")

    L.sec("sqlpy", "Python ↔ SQL — Dua Arah")
    L.raw(codebox("import sqlite3\nimport pandas as pd\n\n# Python -> SQL: query dari Python\ncon = sqlite3.connect(':memory:')\ndf.to_sql('transaksi', con, index=False)\n\n# SQL -> Python: hasil query jadi DataFrame!\nhasil = pd.read_sql('''\n  SELECT kota, SUM(jumlah) AS total\n  FROM transaksi GROUP BY kota\n''', con)\nprint(hasil)", "python"))
    L.ul([
        "<strong>pd.read_sql:</strong> query → DataFrame (jembatan utama!).",
        "<strong>df.to_sql:</strong> DataFrame → tabel (simpan hasil!).",
        "<strong>Pola:</strong> agregat berat di SQL (dekat data!), olah lanjut di Python.",
        "<strong>Produksi:</strong> SQLAlchemy untuk Postgres/MySQL/BigQuery (pola sama!).",
    ])
    L.raw(tip("Aturan emas integrasi: <strong>filter & agregat di SQL</strong> (database dioptimasi!), <strong>analisis & model di Python</strong>. Jangan tarik 10 juta baris untuk di-sum di pandas!"))
    L.raw(myth("Harus pilih: SQL atau Python.",
        "Profesional memakai <em>keduanya</em> — tiap tugas ke alat terbaiknya. 'SQL vs Python' = pertanyaan pemula; 'SQL + Python' = jawaban senior."))

    L.sec("api", "REST API — Data dari Langit")
    L.raw(codebox("import requests\n\n# GET: ambil data\nr = requests.get('https://api.exchangerate.host/latest',\n                   params={'base': 'USD'}, timeout=10)\nr.raise_for_status()  # error jika gagal!\ndata = r.json()\nprint('EUR/USD:', data['rates']['EUR'])\n\n# pola: API -> DataFrame\n# kurs = pd.DataFrame(data['rates'].items(), columns=['curr', 'rate'])", "python"))
    L.ul([
        "<strong>requests.get/post:</strong> ambil/kirim; <strong>params:</strong> query string.",
        "<strong>raise_for_status():</strong> gagal = error jelas (jangan diam!).",
        "<strong>.json():</strong> respons → dict (lalu ke DataFrame!).",
        "<strong>Etika:</strong> hormati rate limit! (sleep antar request; baca ToS).",
    ])
    L.raw(tip("Pola API→analisis: <code className=\"inline\">requests.get → .json() → pd.DataFrame → analisis</code>. 4 langkah dari 'data di langit' ke 'insight di meja'."))
    L.raw(myth("Scraping = API.",
        "API = pintu resmi (stabil, legal). Scraping = memanjat jendela (rapuh, mungkin melanggar ToS). <strong>Selalu cari API dulu</strong>; scraping = terakhir + cek legalitas."))

    L.sec("pipeline", "Pipeline Mini — Merangkai Semua")
    L.raw(codebox("# ALUR: SQL -> Python -> API -> lapor\n# 1. Ambil ringkas dari DB (agregat di SQL!)\nringkas = pd.read_sql('SELECT kota, SUM(jumlah) total FROM trx GROUP BY 1', con)\n# 2. Perkaya dari API\nkurs = requests.get(API_KURS, timeout=10).json()['rates']['IDR']\nringkas['total_usd'] = ringkas['total'] / kurs\n# 3. Analisis di Python\nringkas['pangsa'] = ringkas['total'] / ringkas['total'].sum()\n# 4. Validasi + simpan\nassert (ringkas['total'] >= 0).all()\nringkas.to_sql('laporan_harian', con, if_exists='replace')\nprint(ringkas)", "python"))
    L.ul([
        "<strong>4 tahap:</strong> extract (SQL/API) → transform (Python) → validate → load (SQL).",
        "<strong>Idempoten:</strong> bisa di-run ulang aman (if_exists='replace' / kunci unik).",
        "<strong>Log:</strong> catat waktu, baris, error — untuk debugging.",
        "<strong>Jadwal:</strong> cron (Linux) / Task Scheduler — 'tiap pagi jam 6'.",
    ])
    L.raw(tip("Pipeline mini ini = <strong>miniatur data engineer</strong>. Skala besar: Airflow/dbt (C16). Prinsipnya sama: extract → transform → validate → load."))

    L.chart(
        data=[{"x": ["Extract\n(SQL/API)", "Transform\n(Python)", "Validate", "Load\n(SQL)"],
               "y": [1, 1, 1, 1], "type": "bar",
               "marker": {"color": ["#2a7de1", "#e8a838", "#ef4444", "#34a853"]},
               "text": ["Ambil", "Olah", "Cek", "Simpan"], "textposition": "inside"}],
        title="Pipeline 4 Tahap (konseptual)",
        layout={"xaxis": {"title": "Tahap"}, "yaxis": {"visible": False}, "showlegend": False},
        cara="Alur kiri ke kanan.",
        interpretasi="Setiap pipeline data = 4 tahap ini. <strong>Hafalkan:</strong> extract → transform → validate → load. Dari script pagi ini hingga platform big tech — polanya sama.")

    L.sec("lab1", "🔬 Lab 1: SQL × Python")
    L.lab("Lab 1 — read_sql & to_sql",
        "Buat DB sqlite di Python, isi data, query agregat via SQL → DataFrame → analisis di Python → simpan kembali!",
        r'''
import sqlite3
import pandas as pd

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE trx (id INTEGER, kota TEXT, jumlah REAL)")
cur.executemany("INSERT INTO trx VALUES (?, ?, ?)", [
    (1, "Jakarta", 500000), (2, "Jakarta", 300000),
    (3, "Bandung", 700000), (4, "Surabaya", 200000),
])
con.commit()

# 1. SQL untuk agregat (dekat data!)
ringkas = pd.read_sql("SELECT kota, SUM(jumlah) AS total, COUNT(*) AS n FROM trx GROUP BY kota", con)
print("Dari SQL:"); print(ringkas)

# 2. Python untuk analisis lanjut
ringkas["pangsa"] = ringkas["total"] / ringkas["total"].sum()
ringkas["rata"] = ringkas["total"] / ringkas["n"]
print("\nAnalisis Python:"); print(ringkas)

# 3. Simpan kembali
ringkas.to_sql("laporan", con, index=False, if_exists="replace")
print("\nTersimpan:", pd.read_sql("SELECT COUNT(*) AS baris FROM laporan", con).iloc[0, 0], "baris")

# Coba: apa beda read_sql vs to_sql? (arah berlawanan!)
''',
        "Eksperimen: pindahkan agregat ke Python (tarik semua lalu groupby) — kapan ini buruk? (data besar!)")

    L.sec("lab2", "🔬 Lab 2: Simulasi API")
    L.lab("Lab 2 — Pola API → DataFrame",
        "Simulasikan respons API (dict JSON) → parsing → DataFrame → gabung dengan data lokal. (Tanpa internet pun jalan!)",
        r'''
import pandas as pd

# Simulasi respons API kurs (seperti requests.get(...).json())
respons_api = {
    "base": "USD",
    "rates": {"IDR": 15800, "EUR": 0.92, "JPY": 149.5},
    "date": "2026-10-13",
}

# API -> DataFrame
kurs = pd.DataFrame(respons_api["rates"].items(), columns=["curr", "rate_usd"])
print(kurs)

# Gabung dengan data lokal
trx = pd.DataFrame({"id": [1, 2], "curr": ["IDR", "EUR"], "jumlah": [1_580_000, 92]})
gabung = trx.merge(kurs, on="curr")
gabung["usd"] = gabung["jumlah"] / gabung["rate_usd"]
print("\nDalam USD:"); print(gabung[["id", "curr", "jumlah", "usd"]])

# Pola asli (butuh internet — coba di Colab!):
kode_asli = "\n".join([
    "import requests",
    'r = requests.get("https://api.exchangerate.host/latest", params={"base": "USD"}, timeout=10)',
    "r.raise_for_status()",
    'kurs = pd.DataFrame(r.json()["rates"].items(), columns=["curr", "rate"])',
])
print("\n=== KODE ASLI (Colab) ==="); print(kode_asli)

# Coba: tambahkan error handling (try/except + timeout). Kenapa penting?
''',
        "Tantangan: cache respons API ke file (jangan panggil tiap run — hemat rate limit!).")

    L.sec("peta", "🗺️ Peta Keputusan: Integrasi")
    L.decision("1", "Ambil dari DB → <strong>pd.read_sql</strong>",
        "Jembatan.",
        kenapa="Query → DataFrame.",
        contoh="Agregat per kota.")
    L.decision("2", "Agregat berat → <strong>di SQL</strong>",
        "Dekat data.",
        kenapa="Jangan tarik mentah.",
        contoh="SUM di DB, bukan pandas.")
    L.decision("3", "Simpan hasil → <strong>to_sql</strong>",
        "Kembali.",
        kenapa="DataFrame → tabel.",
        contoh="laporan_harian.")
    L.decision("4", "Data luar → <strong>requests API</strong>",
        "Langit.",
        kenapa="Cari API dulu; hormati limit.",
        contoh="Kurs, cuaca.")
    L.decision("5", "Rutin → <strong>pipeline + jadwal</strong>",
        "Otomatis.",
        kenapa="ETL mini + cron.",
        contoh="Laporan pagi.")
    L.decision("6", "Selalu → <strong>validate + log</strong>",
        "Aman.",
        kenapa="D14 di setiap pipeline.",
        contoh="Assert + catat.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>SQL ambil (agregat!), Python olah.</li>"
        "<li>API: raise_for_status + timeout + hormati limit.</li>"
        "<li>Pipeline: extract → transform → validate → load.</li>"
        "<li>Idempoten + log + jadwal.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Tugas Hari Pertama (60+ mnt, CAPSTONE MINI)")
    L.raw(callout("<p><strong>Tugas:</strong> 'Ambil transaksi bulan ini dari DB, gabungkan kurs USD dari API, hitung total USD + NPL per kota, simpan laporan.'</p>"
        "<p><strong>Kerjakan:</strong> tulis script lengkap (boleh pseudo untuk API) dengan: (1) read_sql agregat, (2) API kurs, (3) hitung USD + pangsa, (4) validasi, (5) to_sql, (6) <strong>log + komentar</strong>. Lalu tulis <strong>README 5 baris</strong> cara menjalankan.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">import sqlite3, pandas as pd, requests, logging<br/>"
        "logging.basicConfig(level=logging.INFO)<br/>"
        "con = sqlite3.connect('bank.db')<br/>"
        "df = pd.read_sql(\"SELECT kota, SUM(jumlah) t, SUM(CASE WHEN kol>=3 THEN jumlah ELSE 0 END) npl FROM trx GROUP BY 1\", con)<br/>"
        "kurs = requests.get(API, timeout=10).json()['rates']['IDR']<br/>"
        "df['usd'] = df['t'] / kurs; df['npl_ratio'] = df['npl']/df['t']<br/>"
        "assert (df['t'] >= 0).all(), 'total negatif!'<br/>"
        "df.to_sql('laporan', con, if_exists='replace', index=False)<br/>"
        "logging.info(f'selesai: {len(df)} kota')</code></p>"
        "<p><strong>README:</strong> '1. pip install -r requirements.txt 2. python laporan.py 3. output: tabel laporan di bank.db 4. jadwal: cron 0 6 * * * 5. log: laporan.log'</p>"
        "<p><strong>Pelajaran:</strong> ini <strong>pekerjaan analis sesungguhnya</strong> — bukan teori. Kamu baru saja merangkai C + D menjadi <em>sistem</em>. 🎓 <strong>Track D selesai — 16 lesson!</strong></p>")))
    L.raw(callout("<h3>🎓 Track 10 Foundation SELESAI!</h3><p><strong>B (Probabilitas):</strong> 19 lesson &bull; <strong>C (SQL):</strong> 19 lesson &bull; <strong>D (Python):</strong> 16 lesson. Total <strong>54 lesson</strong>. Kamu kini punya fondasi: peluang → data → analisis → model. Lanjut: track risiko (CR), pasar (E), dan capstone portofolio. Terus berlatih — fondasi yang kokoh = karir yang kokoh. 💪</p>"))

    L.quiz("Aturan emas SQL × Python…",
        ["Python untuk semua", "Agregat di SQL (dekat data), analisis di Python", "SQL untuk semua", "Acak"],
        1, "Benar: tiap alat ke keunggulannya.")
    L.quiz("pd.read_sql vs df.to_sql…",
        ["Sama", "read_sql: DB→Python; to_sql: Python→DB", "Keduanya hapus data", "Tidak ada bedanya"],
        1, "Benar: dua arah jembatan.")
    L.quiz("requests.get yang aman…",
        ["Tanpa timeout", "timeout + raise_for_status()", "Tanpa cek", "POST selalu"],
        1, "Benar: gagal = error jelas, bukan diam.")
    L.quiz("Scraping vs API…",
        ["Sama", "API dulu (resmi, stabil); scraping terakhir + cek legalitas", "Scraping selalu", "API lambat"],
        1, "Benar: pintu resmi dulu.")
    L.quiz("Pipeline 4 tahap…",
        ["Ambil, buang, ulangi", "Extract → transform → validate → load", "Kode, run, harap", "Tidak ada pola"],
        1, "Benar: pola universal data.")
    L.quiz("Idempoten artinya…",
        ["Cepat", "Bisa di-run ulang dengan aman (hasil sama)", "Mahal", "Otomatis"],
        1, "Benar: syarat pipeline terjadwal.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>read_sql / to_sql:</strong> jembatan dua arah Python ↔ DB.</li>"
        "<li><strong>Aturan:</strong> agregat di SQL, analisis di Python.</li>"
        "<li><strong>API:</strong> requests + timeout + raise_for_status; hormati limit.</li>"
        "<li><strong>Pipeline:</strong> extract → transform → validate → load; idempoten + log.</li>"
        "<li><strong>🎓 Track 10 selesai: 54 lesson!</strong> Fondasi kokoh = karir kokoh.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# alias untuk gen_all ORDER
d8_1 = d81
d8_2 = d82
