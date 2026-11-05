import type { V2Lesson } from "../lib/types";

// ── Figure: waktu pipeline agregasi — pandas vs Polars ────────────────────
const WAKTU_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang waktu pipeline agregasi: pandas vs Polars eager vs Polars lazy">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">15</text><text x="54" y="139">30</text>
<text x="54" y="99">45</text><text x="54" y="59">60 mnt</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="100" y="56" width="64" height="160" fill="var(--chart-text)" opacity="0.55"/>
<text x="132" y="48" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">45</text>
<text x="132" y="232" text-anchor="middle" fill="var(--text)">pandas</text>
<text x="132" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">single-thread</text>
<rect x="228" y="156" width="64" height="60" fill="var(--c2)" opacity="0.85"/>
<text x="260" y="148" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">9</text>
<text x="260" y="232" text-anchor="middle" fill="var(--text)">Polars eager</text>
<text x="260" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">multi-thread</text>
<rect x="356" y="196" width="64" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="388" y="188" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">2</text>
<text x="388" y="232" text-anchor="middle" fill="var(--text)">Polars lazy</text>
<text x="388" y="246" text-anchor="middle" font-size="10" fill="var(--text-muted)">+ optimizer</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">pipeline agregasi 5 GB (ilustrasi orde besaran — ukur di mesinmu)</text>
</g>
</svg>`;

const LAB_SETUP = `import pandas as pd
import numpy as np
import time

rng = np.random.default_rng(42)
n = 300_000
df = pd.DataFrame({
    "kategori": rng.choice(["A", "B", "C", "D"], n),
    "x": rng.normal(100, 15, n),
    "y": rng.normal(50, 10, n),
})
print("data:", df.shape)
`;

export const d16: V2Lesson = {
  slug: "d16-polars",
  track: "Python",
  module: "Rekayasa",
  title: "Polars: DataFrame Supercepat untuk Data Besar — Kapan Tinggalkan pandas",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pipeline 45 menit yang menjadi 40 detik — tanpa ganti mesin",
      prose: [
        "Tim analis sebuah e-commerce punya pipeline harian: baca 5 GB CSV transaksi, filter, groupby per kategori, tulis ringkasan. Di pandas: 45 menit — dan dua kali seminggu gagal karena memori habis (OOM). Solusi yang diusulkan: sewa mesin 4× lebih besar (Rp 8 juta/bulan). Lalu seorang data engineer mencoba mengganti pandas dengan Polars — tanpa mengubah logika, hanya menerjemahkan sintaks. Hasilnya: 40 detik di mesin yang SAMA. Proposal sewa mesin dibatalkan.",
        "Twist-nya: pandas tidak “bodoh” — ia dirancang tahun 2008–2012 untuk era single-core dan data yang muat di RAM. Polars (ditulis dengan Rust, 2020-an) dirancang untuk era multi-core: semua operasi paralel otomatis, memori memakai format kolomnar Arrow yang rapat, dan mode lazy yang mengoptimasi query SEBELUM dijalankan. Pipeline itu tidak butuh mesin lebih besar — ia butuh mesin berpikir yang lebih modern. (Angka 45 menit → 40 detik adalah ilustrasi orde besaran dari pola yang dilaporkan banyak tim; hasil pastimu tergantung mesin dan data — ukur sendiri.)",
        "Lesson ini tentang kapan tetap di pandas dan kapan pindah ke Polars — plus cara berpikir “lazy” yang membuat Polars cepat. Bekal ringkas dari dua lesson prasyarat (diringkas agar mandiri): dari pandas dasar — DataFrame adalah tabel (baris × kolom), filter dengan df[df.x > 100], agregasi dengan groupby(...).mean(); dari wrangling — rantai operasi (filter → pilih kolom → agregasi) adalah pola sehari-hari. Polars memakai pola yang sama — hanya lebih cepat dan punya mode lazy.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "Polars BELUM tersedia sebagai paket resmi Pyodide (environment Python di browser lesson ini) — import polars akan gagal di lab. Karena itu lab memakai pandas untuk mendemonstrasikan KONSEP di balik kecepatan Polars (vektorisasi + optimasi query manual). Sintaks Polars di lesson ini berstatus baca-saja: salin ke laptop/Colab (pip install polars) untuk praktik nyata. Klaim kecepatan selalu ilustrasi — verifikasi di mesinmu.",
      },
      reference: "Polars = DataFrame era multi-core (Rust, Arrow, lazy optimizer). Lab memakai pandas untuk konsep; Polars asli di laptop/Colab.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita 45 menit → 40 detik. (2) Peta ini. (3) Konsep: Polars eager — Si Atlet Sprint. (4) Konsep: Lazy API — Si Perencana. (5) Konsep: kapan tinggalkan pandas — kriteria keputusan. (6) Lab: tiru optimizer Polars dengan pandas (naif vs cerdas). (7) Chart: orde besaran waktu pipeline. (8) Peta keputusan: lima skenario pandas vs Polars. (9) Mini-case: migrasi pipeline harian. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan tiga sumber kecepatan Polars (multithread, memori kolomnar Arrow, lazy optimizer); (2) membaca dan menulis sintaks Polars dasar (filter, select, group_by, agg) serta padanannya di pandas; (3) menjelaskan cara kerja lazy evaluation — predicate pushdown dan projection pushdown; (4) memutuskan dengan kriteria kapan pindah ke Polars dan kapan tetap di pandas.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: DataFrame = tabel dengan kolom bertipe; df[kolom] memilih kolom; df[kondisi] menyaring baris; df.groupby(k).agg(...) meringkas per grup; rantai operasi dibaca kiri-ke-kanan (filter → pilih → agregasi). Itu fondasi yang dipakai Polars juga.",
        "Rutenya: cerita → peta → tiga konsep inti → lab → chart → peta keputusan → mini-case → kuis. Estimasi 55 menit; lab ±15 menit (termasuk waktu komputasi 300 ribu baris di browser).",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bedakan DUA kecepatan Polars — (1) eager yang cepat karena paralel + memori rapat (atlet yang larinya kencang), (2) lazy yang cepat karena TIDAK mengerjakan yang tidak perlu (perencana yang memotong rute). Kebanyakan orang hanya tahu yang pertama; yang kedua justru pembeda terbesar.",
      ],
      reference: "Tujuan: 3 sumber kecepatan + sintaks dasar + lazy evaluation + kriteria pindah. Lab: konsep via pandas.",
    },
    {
      id: "konsep-eager",
      eyebrow: "Langkah 3 · Konsep",
      title: "Polars Eager — Si Atlet Sprint",
      prose: [
        "Definisi: mode EAGER Polars bekerja seperti pandas — tiap operasi langsung dieksekusi dan menghasilkan DataFrame. Bedanya ada di mesin: (1) PARALEL otomatis — groupby memakai semua core CPU tanpa kamu meminta; pandas single-threaded kecuali trik khusus. (2) Memori Arrow kolomnar — angka disimpan rapat per kolom (tanpa overhead objek Python per nilai seperti pandas pada tipe object); (3) tanpa index — Polars tidak punya konsep index baris ala pandas (df.index) yang sering menjadi sumber bug dan overhead; baris diidentifikasi posisinya.",
        "Kepribadiannya: Polars eager adalah atlet sprint yang berlari dengan teknik sempurna — langkahnya (paralelisme) lebar, napasnya (memori) efisien, dan ia tidak membawa beban tak perlu (tanpa index). pandas adalah pelari veteran yang tekniknya dari era berbeda — tetap sampai finis, tetapi untuk jarak jauh (data besar) selisihnya melebar. Sintaksnya sengaja dibuat familier agar migrasi murah:",
        "Perbandingan sintaks (baca-saja — jalankan di laptop/Colab): pandas: df[df.x > 100].groupby('kategori')['y'].mean() — Polars: df.filter(pl.col('x') > 100).group_by('kategori').agg(pl.col('y').mean()). Pola pikirnya sama — bedanya pl.col('x') adalah EKSPRESI (rencana), bukan kolom yang langsung dievaluasi. Tiga perbedaan sintaks yang wajib dihafal: group_by (bukan groupby), tidak ada index (tidak ada .loc dengan label), dan string method via .str (mis. pl.col('nama').str.to_lowercase()). Kapan memakai eager: eksplorasi interaktif, data muat nyaman di RAM, dan migrasi bertahap dari pandas (ganti mesin dulu, optimasi kemudian).",
      ],
      formula: String.raw`\text{memori}_{\text{kolom}} = n \times b \quad\text{(Arrow, rapat per kolom)}`,
      formulaNote: "Simbol: n = jumlah baris, b = byte per nilai (mis. 8 untuk float64). Interpretasi: di format kolomnar Arrow, satu kolom float64 atas 300 ribu baris ≈ 300.000 × 8 byte = 2,4 MB — rapat dan terprediksi. pandas untuk tipe numerik juga ~2,4 MB, TETAPI untuk kolom string/object pandas menyimpan POINTER per nilai (+ overhead objek Python) sehingga bisa 5–10× lipat. Praktisnya: DataFrame string-heavy yang 2 GB di pandas sering <500 MB di Polars — dan data yang muat di RAM tidak OOM.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Polars = pandas yang ditulis ulang, jadi 100% kompatibel”",
        type: "pitfall",
        body: "Yang benar: API-nya SENGAJA berbeda di titik-titik penting — tidak ada index, group_by bukan groupby, ekspresi pl.col() bukan akses kolom langsung. Migrasi butuh penerjemahan, bukan find-replace. Yang 100% sama hanyalah pola pikirnya (filter → pilih → agregasi). Mengira “tinggal ganti import” adalah sumber bug migrasi paling umum.",
      },
      hints: [
        "💡 Intuisi atlet: saat menerjemahkan kode pandas ke Polars, terjemahkan POLA-nya (“filter lalu agregasi per grup”), bukan barisnya. Pola yang diterjemahkan dengan benar otomatis mendapat paralelisme gratis — baris yang diterjemahkan kata-per-kata sering membawa idiom pandas yang tidak idiomatis di Polars.",
      ],
      reference: "Eager = pandas lebih cepat (paralel + Arrow + tanpa index). Sintaks familier tetapi tidak identik.",
    },
    {
      id: "konsep-lazy",
      eyebrow: "Langkah 4 · Konsep",
      title: "Lazy API — Si Perencana (optimasi sebelum eksekusi)",
      prose: [
        "Definisi: mode LAZY menunda eksekusi — df.lazy().filter(...).group_by(...).agg(...) hanya membangun RENCANA (query plan), dan .collect() yang menjalankannya. Sebelum eksekusi, OPTIMIZER menulis ulang rencanamu menjadi versi yang lebih murah. Dua optimasi terpenting: (1) PREDICATE PUSHDOWN — filter didorong sedini mungkin (baca 300 ribu baris → filter jadi 150 ribu → baru groupby; bukan groupby 300 ribu lalu filter); (2) PROJECTION PUSHDOWN — hanya kolom yang dipakai yang dibaca/diproses (dari 50 kolom baca 3 saja).",
        "Kepribadiannya: jika eager adalah atlet yang langsung lari, lazy adalah perencana logistik yang mempelajari peta DULU — “untuk apa membawa 50 karung kalau yang dibutuhkan 3? untuk apa menyortir 300 ribu paket kalau separuhnya dibuang?” — lalu memotong rute sebelum satu langkah pun diambil. Kamu menulis kode yang nyaman dibaca (manusiawi), optimizer menulis ulang menjadi kode yang murah dijalankan (mesinwi). Inilah keajaiban yang tidak dimiliki pandas: di pandas, urutan yang kamu tulis = urutan yang dijalankan, titik.",
        "Kapan memakai lazy: pipeline berulang atas data besar (di sinilah penghematan 45→2 menit terjadi), query atas file Parquet (pushdown didorong sampai ke file — kolom tak terpakai TIDAK DIBACA dari disk), dan saat kamu ingin melihat rencananya (.explain() mencetak query plan yang dioptimasi — transparan, bisa dipelajari). Contoh (baca-saja): (df.lazy().filter(pl.col('x') > 100).group_by('kategori').agg(pl.col('y').mean()).collect()) — dengan .explain() kamu bisa MELIHAT filter didorong ke depan. Kapan tetap eager: eksplorasi cepat di notebook kecil — overhead berpikir lazy tidak terbayar untuk 10 ribu baris.",
      ],
      formula: String.raw`\text{biaya} = \underbrace{n_{\text{baca}}}_{\text{pushdown}} \times \underbrace{k_{\text{kolom}}}_{\text{proyeksi}} \times c \;\; \text{dieksekusi setelah optimasi, bukan saat ditulis}`,
      formulaNote: "Simbol: n_baca = baris yang benar-benar dibaca (setelah filter didorong), k_kolom = kolom yang benar-benar dipakai (setelah proyeksi didorong), c = biaya per sel. Interpretasi: optimizer MEMINIMALKAN kedua faktor sebelum eksekusi — inilah yang kamu tiru manual di lab (filter + pilih kolom dulu, baru groupby). Contoh angka: n=300 ribu → n_baca≈150 ribu (x>100 menyisakan ~50%), k=4 → k_kolom=2 → biaya ≈ 150rb × 2 × c vs 300rb × 4 × c — seperempat biaya, SEBELUM paralelisme dihitung. Di pandas, kamu membayar penuh kecuali kamu mengoptimasi manual.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Lazy = malas, jadi lebih lambat karena menunda”",
        type: "pitfall",
        body: "Yang benar: “lazy” di sini berarti “menunda EKSEKUSI untuk mengoptimasi RENCANA” — bukan menunda kerja. Hasil akhirnya: kerja yang dilakukan LEBIH SEDIKIT (filter/proyeksi didorong), bukan sama dengan jeda. Analogi: koki yang membaca seluruh resep dulu (lazy) vs yang langsung memanaskan oven lalu sadar bahannya kurang (eager naif).",
      },
      hints: [
        "💡 Intuisi perencana: biasakan membaca .explain() untuk query penting — ia menunjukkan APA yang sebenarnya dijalankan vs apa yang kamu tulis. Selisih keduanya adalah “kecerdasan gratis” yang kamu dapat. Di pandas, selisih itu nol — apa yang kamu tulis itulah yang dibayar.",
      ],
      reference: "Lazy = rencana dioptimasi dulu (predicate + projection pushdown), baru dieksekusi via .collect().",
    },
    {
      id: "konsep-kapan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kapan Tinggalkan pandas — Kriteria, Bukan Gengsi",
      prose: [
        "Definisi kriteria pindah — PINDAH ke Polars bila DUA ATAU LEBIH benar: (1) data rutin >50% RAM (OOM atau swap menjadi kejadian bulanan); (2) pipeline batch berulang yang waktu jalannya mengganggu SLA (laporan telat karena pipeline 45 menit); (3) butuh paralelisme tanpa kompleksitas Dask/Spark; (4) workload murni transformasi/agregasi (bukan ML training). TETAP di pandas bila: (1) ekosistemmu pandas-native (sklearn, statsmodels — mereka menerima DataFrame pandas); (2) tim belum siap (biaya belajar > penghematan waktu); (3) data kecil (<1 GB) dan kode sudah cepat — migrasi tanpa masalah adalah churn.",
        "Kepribadiannya: keputusan ini seperti memilih pindah rumah — pindah karena rumahmu KEKecilan (kriteria 1–4), bukan karena tetangga pamer rumah baru (gengsi “semua orang pakai Polars”). Pindah rumah ada biaya (belajar sintaks, uji ulang pipeline); ia terbayar hanya bila rumah lama benar-benar menghambat. Banyak tim “pindah ke Polars” untuk pipeline 200 MB yang jalan 30 detik — menghemat 20 detik dengan biaya migrasi 2 minggu.",
        "Kapan memakai strategi HYBRID (paling umum di praktik): baca + transformasi berat di Polars (lazy), lalu .to_pandas() untuk tahap ML/sklearn — dapatkan kecepatan di hulu, kompatibilitas di hilir. Konversi Arrow→pandas murah (zero-copy untuk numerik). Aturan migrasi: mulai dari pipeline PALING LAMBAT dan PALING SERING gagal (bukan yang paling mudah) — di sanalah ROI terlihat dan tim termotivasi. Satu pipeline yang 45→2 menit menjual Polars ke seluruh tim lebih baik dari 10 slide presentasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Migrasi big-bang: menulis ulang SELURUH codebase pandas dalam satu proyek. Hasilnya: 3 bulan tanpa nilai, bug di mana-mana, tim trauma. Pola yang benar: strangler fig — satu pipeline per sprint, dimulai dari yang paling sakit, dengan test yang membandingkan output pandas vs Polars (harus identik sebelum switch).",
      },
      hints: [
        "💡 Intuisi pindah rumah: ukur DULU dengan profiler (cProfile / %timeit) — 80% “pandas lambat” ternyata satu baris loop Python yang bisa divektorisasi tanpa pindah library. Pindah ke Polars untuk arsitektur (paralel + lazy), bukan untuk memperbaiki satu baris yang malas.",
      ],
      reference: "Pindah bila 2+ kriteria terpenuhi; hybrid Polars→to_pandas() untuk ML; migrasi strangler fig dari pipeline tersakit.",
    },
    {
      id: "lab-optimizer",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Tiru optimizer Polars dengan pandas",
      prose: [
        "Waktunya praktik. Data 300.000 baris sudah disiapkan. Tugas: hitung rata-rata y per kategori untuk baris dengan x > 100 — dengan DUA rencana. Rencana A (naif, seperti pandas tanpa optimizer): salin seluruh DataFrame, buat kolom z yang TIDAK dipakai jawaban, baru filter + groupby. Rencana B (cerdas, meniru lazy optimizer): filter + pilih kolom yang dipakai DULU, baru groupby.",
        "Tugasmu: lengkapi kedua rencana, catat waktunya, dan buktikan hasilnya IDENTIK (variabel sama). Rencana A sengaja diberi dua pekerjaan sia-sia (kolom z yang tak dipakai + sort yang urutannya tak dipakai) — persis jenis pekerjaan yang optimizer Polars TIDAK akan lakukan. Polars melakukan rencana B OTOMATIS via predicate/projection pushdown — di sini kamu melakukannya manual agar memahami APA yang dioptimasi.",
        "Coba: setelah lolos, naikkan n menjadi 1_000_000 dan jalankan ulang — bagaimana rasio kecepatannya berubah? (Ekspektasi: selisih melebar — biaya rencana naif tumbuh dengan seluruh data, rencana cerdas hanya dengan yang dipakai.) Perhatian: di browser (Pyodide) komputasi lebih lambat dari laptop — bersabarlah ±1 menit.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi rencana A: tmp = df.copy(); kolom z; filter x>100; groupby kategori mean y; catat t_a" },
        { id: "t2", text: "Lengkapi rencana B: df.loc[df.x>100, ['kategori','y']] lalu groupby; catat t_b; isi sama = hasil_a.equals(hasil_b)" },
        { id: "t3", text: "Jalankan; pastikan waktu dan speedup tercetak" },
      ],
      requires: ["pandas", "numpy"],
      expected: "sama=True; speedup rencana B > 1 (tipikal ~3x di laptop; di browser bervariasi)",
      code: {
        starter:
          LAB_SETUP +
          `
# RENCANA A (naif): kerjakan semua, saring belakangan
t0 = time.perf_counter()
tmp = df.copy()
tmp["z"] =
tmp = tmp.sort_values("x")  # sia-sia: diurutkan, urutannya tak dipakai jawaban
hasil_a =
t_a = time.perf_counter() - t0

# RENCANA B (cerdas, tiru optimizer): saring + proyeksi dulu
t0 = time.perf_counter()
kecil = df.loc[
hasil_b =
t_b = time.perf_counter() - t0

sama =

print("waktu A (naif) :", round(t_a, 3), "detik")
print("waktu B (cerdas):", round(t_b, 3), "detik")
print("speedup B:", round(t_a / t_b, 2), "x")
print("hasil identik:", sama)
print("rata-rata y per kategori:", hasil_b.round(4).to_dict())`,
        lockLines: 13,
        solution:
          LAB_SETUP +
          `
# RENCANA A (naif): kerjakan semua, saring belakangan
t0 = time.perf_counter()
tmp = df.copy()
tmp["z"] = tmp["x"] * tmp["y"]
tmp = tmp.sort_values("x")  # sia-sia: diurutkan, urutannya tak dipakai jawaban
hasil_a = tmp[tmp["x"] > 100].groupby("kategori")["y"].mean()
t_a = time.perf_counter() - t0

# RENCANA B (cerdas, tiru optimizer): saring + proyeksi dulu
t0 = time.perf_counter()
kecil = df.loc[df["x"] > 100, ["kategori", "y"]]
hasil_b = kecil.groupby("kategori")["y"].mean()
t_b = time.perf_counter() - t0

sama = hasil_a.equals(hasil_b)

print("waktu A (naif) :", round(t_a, 3), "detik")
print("waktu B (cerdas):", round(t_b, 3), "detik")
print("speedup B:", round(t_a / t_b, 2), "x")
print("hasil identik:", sama)
print("rata-rata y per kategori:", hasil_b.round(4).to_dict())`,
        checks: [
          { kind: "equal", task: "t2", name: "sama", value: true, tol: 0, label: "`sama` = True", msg: "Optimizer tidak boleh mengubah HASIL — hanya rencananya. Dua rencana harus identik." },
          { kind: "defined", task: "t1", name: "hasil_a", label: "`hasil_a` terdefinisi", msg: "Lengkapi rencana A: filter x>100 lalu groupby kategori mean y." },
          { kind: "defined", task: "t2", name: "hasil_b", label: "`hasil_b` terdefinisi", msg: "Lengkapi rencana B: loc[filter, kolom] lalu groupby." },
          { kind: "stdout_matches", task: "t3", pattern: "hasil identik: True", label: "Output menyatakan hasil identik", msg: "Pastikan print terakhir menampilkan perbandingan." },
          { kind: "stdout_matches", task: "t3", pattern: "'A': 49\\.99", label: "Rata-rata kategori A tercetak ±49,99", msg: "Dengan seed 42, rata-rata y kategori A ≈ 49,99." },
        ],
      },
      reference: "Optimizer = rencana B otomatis: predicate pushdown (filter dulu) + projection pushdown (kolom dipakai saja).",
    },
    {
      id: "chart-waktu",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca orde besaran: di mana garis berpotongan",
      prose: [
        "Chart di bawah membandingkan pipeline agregasi 5 GB yang sama: pandas (single-thread), Polars eager (multi-thread), Polars lazy (multi-thread + optimizer). Angka ilustrasi orde besaran.",
        "Cara membaca: sumbu Y = menit; tiap batang = pendekatan; label kecil = penyebab utama angkanya.",
        "Interpretasi: pandas 45 menit — didominasi single-thread + memori boros (plus risiko OOM yang tidak terlihat di chart). Polars eager 9 menit — paralelisme memangkas ~5× TANPA mengubah logika. Polars lazy 2 menit — optimizer memangkas lagi ~4× dengan tidak mengerjakan yang tak perlu. Pelajaran chart: dua lompatan BERBEDA — (1) paralelisme (gratis, dari arsitektur), (2) optimasi rencana (gratis, dari lazy). Tim yang hanya memakai eager mendapat lompatan pertama; yang memakai lazy mendapat keduanya. Dan catatan kaki terpenting: untuk data 200 MB / 30 detik, SEMUA batang pendek — jangan migrasi tanpa masalah nyata.",
      ],
      figure: {
        svg: WAKTU_SVG,
        alt: "Diagram batang pipeline 5 GB: pandas 45 menit, Polars eager 9 menit, Polars lazy 2 menit.",
        caption: "Waktu pipeline agregasi 5 GB (ilustrasi orde besaran). Dua lompatan: paralelisme, lalu optimasi rencana.",
      },
      tasks: [],
      reference: "Eager = paralelisme gratis. Lazy = + optimasi rencana gratis. Migrasi butuh masalah nyata.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "pandas atau Polars? Lima skenario",
      prose: [
        "Lima skenario pemilihan library DataFrame:",
        "Skenario 1 — Eksplorasi 200 MB di notebook, butuh plot + sklearn setelahnya. → pandas. Alasan: tidak ada masalah kecepatan; ekosistem langsung pakai.",
        "Skenario 2 — Pipeline harian 5 GB, 45 menit, OOM dua kali seminggu. → Polars lazy. Alasan: semua kriteria pindah terpenuhi — ini skenario cerita pembuka.",
        "Skenario 3 — Transformasi berat 3 GB, lalu training sklearn. → Hybrid: Polars lazy → .to_pandas() → sklearn. Alasan: kecepatan di hulu, kompatibilitas di hilir; konversi murah.",
        "Skenario 4 — Kode pandas lambat, belum di-profil. → PROFIL DULU, jangan pindah dulu. Alasan: 80% kasus = satu loop yang bisa divektorisasi. Pindah library untuk memperbaiki satu baris malas adalah salah diagnosis.",
        "Skenario 5 — Tim 15 analis pandas, pipeline 500 MB jalan 2 menit, “ingin modern”. → Tetap pandas (tetapkan batas review: pindah bila >50% RAM atau >10 menit). Alasan: biaya belajar 15 orang > penghematan 1 menit. Modernisasi tanpa masalah = churn.",
        "Aturan praktis 10 detik: sakit (OOM/lambat) + sering + transformasi-berat → Polars; ekosistem ML / data kecil / belum di-profil → pandas; di antara → hybrid. Ukur dulu, gengsi kemudian.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kita standardisasi ke Polars untuk SEMUA kode termasuk notebook eksplorasi 50 MB.” Hasil: tim melambat 2 minggu belajar sintaks untuk penghematan 3 detik. Standardisasi buta = pajak tanpa manfaat. Biarkan eksplorasi kecil di pandas; wajibkan Polars hanya di pipeline yang memenuhi kriteria.",
      },
      reference: "Sakit + sering + berat → Polars. Kecil / ML / belum-profil → pandas. Hybrid untuk antaranya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Migrasi pipeline harian: proposal yang disetujui",
      prose: [
        "Skenario (sintetis, angka konkret): pipeline harian e-commerce: baca 5 GB CSV (50 kolom), filter transaksi valid, join tabel produk (2 juta baris), groupby kategori → 40 metrik, tulis Parquet. Saat ini pandas: 45 menit, OOM ~2×/minggu (butuh rerun manual 30 menit), mesin 32 GB RAM. Usulan awal: upgrade ke 128 GB (Rp 8 juta/bulan). Kamu mengusulkan migrasi ke Polars lazy.",
        "Pertanyaan analisis: (1) Hitung estimasi waktu + biaya kedua opsi per bulan (asumsi engineer Rp 200 ribu/jam; migrasi butuh 3 hari kerja). (2) Apa risiko terbesar migrasi — dan mitigasinya? (3) Bagaimana kamu MEMBUKTIKAN migrasi aman sebelum switch?",
        "Pembahasan: (1) Opsi upgrade: Rp 8 juta × 12 = Rp 96 juta/tahun, waktu pipeline tetap 45 menit (lebih jarang OOM, tetapi tidak lebih cepat). Opsi Polars: biaya migrasi 3 × 8 jam × Rp 200 ribu = Rp 4,8 juta sekali; waktu pipeline → ~2 menit (orde besaran); OOM hilang (streaming + pushdown). Payback: bulan pertama. (2) Risiko terbesar: perbedaan hasil (bug penerjemahan sintaks — mis. penanganan null berbeda) → mitigasi: dual-run 2 minggu (pandas vs Polars, bandingkan output baris-per-baris, toleransi float). (3) Bukti aman: test kesetaraan output di 14 hari data historis + .explain() di-review + rollback plan (kode pandas disimpan di branch). Kriteria go-live: 14/14 hari identik + waktu <5 menit.",
        "Kaitan ke karier: proposal dengan angka (Rp 96 juta/tahun vs Rp 4,8 juta sekali) + rencana bukti (dual-run 14 hari) adalah cara analis senior menjual perubahan teknis ke manajemen — bukan dengan kata “modern”, melainkan dengan matematika.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pipeline yang OOM 2×/minggu dengan rerun manual adalah risiko operasional: laporan telat, analis lembur, dan “angka kemarin” yang tidak deterministik. Migrasi yang menghilangkan kelas kegagalan (bukan sekadar mempercepat) adalah mitigasi risiko — framing ini lebih kuat dari framing kecepatan saat bicara dengan manajemen.",
      },
      reference: "Jual migrasi dengan matematika (biaya + payback) dan bukti (dual-run 14 hari identik).",
    },
    {
      id: "advanced-streaming",
      eyebrow: "Langkah 10 · Advanced",
      title: "Advanced: streaming — ketika data tidak muat di RAM",
      prose: [
        "Lazy mengoptimasi RENCANA; streaming mengoptimasi MEMORI — dua sumbu berbeda. Lazy menjawab \"pekerjaan apa yang bisa dihindari\", streaming menjawab \"bagaimana mengerjakan 50 GB di mesin 16 GB\". Pola streaming: proses data dalam potongan (morsel) sehingga memori konstan berapa pun ukuran input. Pergeseran mentalnya: dari \"muat semua lalu hitung\" menjadi \"scan → alirkan → sink\". Sintaks (baca-saja, laptop/Colab): `pl.scan_csv(\"data/*.csv\")` — perhatikan scan, bukan read: file tidak dibaca dulu, hanya didaftarkan sebagai sumber lazy. Rantai filter/group_by/agg seperti biasa, lalu akhiri dengan `.sink_parquet(\"hasil.parquet\")` — sink, bukan collect: hasil ditulis bertahap ke disk, tidak pernah materialisasi penuh di RAM. Predicate/projection pushdown tetap bekerja — dan kini ia menghemat BACAAN DISK, bukan hanya CPU.",
        "Kapan streaming GAGAL atau merugikan — inilah yang membedakan praktisi dari penggemar. Operasi yang butuh pandangan global atas seluruh data: sort penuh, join dua tabel raksasa, atau operasi yang butuh melihat semua nilai unik — tidak bisa dipotong-potong tanpa trik, sehingga streaming engine menolak atau jatuh kembali ke mode biasa. Kedua, untuk data yang MUAT di RAM, streaming bisa LEBIH LAMBAT dari collect biasa: beberapa optimasi vektorisasi global tidak tersedia dalam mode potongan. Maka aturan keputusannya: muat di RAM → lazy + collect (dapat semua optimasi); melebihi RAM tetapi satu mesin → streaming + sink_parquet; melebihi satu mesin atau butuh ML iteratif → distributed (Spark/Dask). Streaming bukan mode \"lebih cepat\" — ia mode \"tetap jalan\".",
        "Lengkapi dengan peta kapan Polars TIDAK mengalahkan pandas — kejujuran ini yang membuat rekomendasi migrasimu dipercaya. (1) Data kecil (<1 GB): overhead perencanaan query bisa membuat Polars lazy lebih lambat dari pandas untuk satu operasi sepele — jangan ukur dengan stopwatch untuk 10 ribu baris. (2) Ekosistem sklearn/statsmodels: mereka menerima DataFrame pandas; pakai pola hybrid, bukan perang library. (3) Row-wise Python UDF (apply dengan fungsi Python per baris): menghancurkan mesin vektorisasi Polars SAMA parahnya dengan di pandas — tulis sebagai ekspresi pl.col(), bukan fungsi Python. (4) Tim belum siap: kecepatan library tidak mengkompensasi 2 minggu learning curve untuk pipeline yang jalan 30 detik. Senior tidak bertanya \"mana yang lebih cepat\" — ia bertanya \"di mana bottleneck-ku, dan mode eksekusi apa yang menghilangkannya\".",
      ],
      tasks: [],
      reference: "Muat di RAM → collect; >RAM satu mesin → streaming + sink; >satu mesin → distributed. Streaming = tetap jalan, bukan lebih cepat.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Intuisi: optimasi punya dua sumbu — rencana dan memori",
      prose: [
        "Heuristik penutup untuk memilih senjata yang tepat — karena kebanyakan orang hanya mengenal satu sumbu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: optimasi punya dua sumbu — rencana dan memori",
        body: "Kebanyakan analis hanya mengenal SATU sumbu optimasi: membuat tiap operasi lebih cepat (vektorisasi, paralelisme). Polars mengajarkan sumbu kedua: mengurangi pekerjaan dan memori yang dibutuhkan. Heuristiknya: sebelum bertanya \"bagaimana mempercepat kode ini\", tanyakan dulu \"pekerjaan apa yang sebenarnya tidak perlu dilakukan\" — filter yang didorong, kolom yang tidak dibaca, sort yang urutannya tak dipakai. Pekerjaan yang dihindari adalah pekerjaan tercepat. Heuristik kedua: bedakan TIGA mode kegagalan data besar — lambat (butuh paralel/lazy), OOM sesekali (butuh lazy + proyeksi), dan tidak muat sama sekali (butuh streaming). Salah diagnosis = salah obat: streaming untuk masalah \"lambat\" hanya menambah kompleksitas tanpa kecepatan. Heuristik ketiga: ukur di work-load-MU — benchmark internet memakai data dan mesin orang lain; satu .explain() + timer di pipeline-mu sendiri lebih jujur dari 10 artikel. Dan heuristik yang paling senior: kecepatan adalah fitur, tetapi determinisme adalah kontrak — pipeline 2 menit yang hasilnya identik setiap run mengalahkan pipeline 40 detik yang kadang OOM. Optimasi yang mengorbankan keandalan bukan optimasi, melainkan judi.",
      },
      reference: "Hindari pekerjaan dulu, percepat kemudian; diagnosis dulu (lambat/OOM/tidak muat); determinisme > kecepatan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Polars cepat karena tiga hal: paralelisme otomatis (multi-core), memori kolomnar Arrow yang rapat (tanpa overhead objek), dan tanpa index baris.",
        "Mode eager = eksekusi langsung seperti pandas (sintaks familier: filter, group_by, agg) — dapat lompatan paralelisme gratis.",
        "Mode lazy = rencana dioptimasi dulu: predicate pushdown (filter sedini mungkin) + projection pushdown (hanya kolom dipakai) — dapat lompatan kedua; .collect() mengeksekusi, .explain() transparan.",
        "Pindah ke Polars bila 2+ kriteria terpenuhi (data >50% RAM, pipeline lambat berulang, butuh paralel mudah, workload transformasi); pola hybrid Polars→to_pandas() untuk tahap ML.",
        "Migrasi yang benar: profil dulu, strangler fig dari pipeline tersakit, dual-run bandingkan output identik sebelum switch — bukan big-bang.",
      ],
      quiz: [
        {
          q: "Pipeline 5 GB: pandas 45 menit → Polars lazy 2 menit. Kontributor terbesar lompatan kedua (9→2 menit) adalah…",
          options: [
            { text: "Lazy optimizer: predicate pushdown + projection pushdown — tidak mengerjakan filter/kolom yang tak perlu", why: "Benar: lompatan pertama (45→9) dari paralelisme; lompatan kedua dari optimasi rencana — tidak membayar yang tidak dibutuhkan.", correct: true },
            { text: "Bahasa Rust lebih cepat dari C", why: "Salah: pandas intinya juga C/Cython. Beda bahasa bukan penjelasan utama — arsitektur dan optimasilah." },
            { text: "Polars memakai GPU", why: "Salah: Polars standar CPU (SIMD). Bukan GPU." },
            { text: "Polars mengompres data sehingga lebih kecil", why: "Salah: kompresi membantu I/O, tetapi lompatan 9→2 menit datang dari pushdown — membaca lebih sedikit, bukan membaca lebih kecil." },
          ],
        },
        {
          q: "Arti predicate pushdown dalam praktik adalah…",
          options: [
            { text: "Filter (mis. x > 100) dieksekusi SEDINI mungkin — sebelum groupby/join yang mahal — sehingga operasi berat hanya memproses baris yang lolos", why: "Benar: inilah rencana B di lab — filter dulu (150 ribu baris), baru groupby, bukan sebaliknya.", correct: true },
            { text: "Predikat dihapus dari query agar lebih cepat", why: "Salah: predikat tidak dihapus — ia DIDORONG ke depan. Hasil tetap sama (terbukti sama=True di lab)." },
            { text: "Filter dijalankan di akhir agar hasilnya akurat", why: "Salah: kebalikannya — di akhir = mahal. Pushdown = ke depan = murah, dengan hasil identik." },
            { text: "Hanya berlaku untuk database, tidak untuk DataFrame", why: "Salah: konsepnya universal — Polars menerapkannya pada DataFrame via lazy API." },
          ],
        },
        {
          q: "Perbedaan sintaks pandas→Polars yang PALING sering menjadi bug migrasi?",
          options: [
            { text: "Tidak ada index baris + group_by (bukan groupby) + ekspresi pl.col() — migrasi butuh penerjemahan pola, bukan find-replace", why: "Benar: miskonsepsi Langkah 3 — yang sama hanya pola pikirnya; sintaks berbeda di titik penting.", correct: true },
            { text: "Polars tidak bisa membaca CSV", why: "Salah: pl.read_csv / scan_csv justru andalan Polars." },
            { text: "Polars tidak punya groupby sama sekali", why: "Salah: ada — namanya group_by. Beda ejaan, bukan ketiadaan." },
            { text: "Semua fungsi pandas ada dengan nama sama persis", why: "Salah: justru tidak — dan mengira demikian adalah sumber bug." },
          ],
        },
        {
          q: "Tim 15 analis, pipeline 500 MB jalan 2 menit, ingin “modernisasi ke Polars”. Keputusan tepat?",
          options: [
            { text: "Tunda — tidak ada masalah nyata (kecil, cepat); tetapkan ambang pindah (>50% RAM atau >10 menit); biaya belajar 15 orang > penghematan", why: "Benar: skenario 5 peta keputusan — kriteria, bukan gengsi. Modernisasi tanpa masalah = churn.", correct: true },
            { text: "Migrasi big-bang semua kode minggu depan", why: "Salah: big-bang = 3 bulan tanpa nilai + trauma tim. Bahkan JIKA pindah, polanya strangler fig." },
            { text: "Migrasi karena “semua orang pakai Polars”", why: "Salah: argumen gengsi bukan kriteria. Lihat Langkah 5." },
            { text: "Beli mesin 4× lebih besar dulu, baru migrasi", why: "Salah: masalahnya tidak ada — membeli mesin untuk pipeline 2 menit adalah pemborosan ganda." },
          ],
        },
        {
          q: "Strategi migrasi pipeline tersakit (45 menit, sering OOM) yang paling aman?",
          options: [
            { text: "Strangler fig: satu pipeline, dual-run 14 hari bandingkan output identik, .explain() di-review, rollback plan siap — go-live bila 14/14 identik", why: "Benar: inilah mini-case — bukti kesetaraan output adalah syarat go-live, bukan klaim kecepatan.", correct: true },
            { text: "Tulis ulang sekaligus saat akhir pekan, switch Senin pagi", why: "Salah: tanpa dual-run, bug penerjemahan (null, float) baru ketahuan saat laporan salah — Senin pagi yang menegangkan." },
            { text: "Jalankan Polars tanpa membandingkan output — kan lebih cepat", why: "Salah: kecepatan bukan bukti kebenaran. Output harus identik DULU." },
            { text: "Minta tim menghafal sintaks Polars dulu 1 bulan, baru migrasi", why: "Salah: belajar tanpa praktik = lupa. Migrasi satu pipeline nyata adalah cara belajar tercepat." },
          ],
        },
      ],
    },
  ],
};
