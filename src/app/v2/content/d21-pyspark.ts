import type { V2Lesson } from "../lib/types";

// ── Figure: baris yang harus pindah partisi (shuffle) ─────────────────────
const SHUFFLE_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang shuffle: strategi A 17 baris, strategi B 0 baris">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="166" x2="500" y2="166"/><line x1="60" y1="116" x2="500" y2="116"/>
<line x1="60" y1="66" x2="500" y2="66"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="169">5</text>
<text x="54" y="119">10</text><text x="54" y="69">15 baris</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="130" y="30" width="80" height="186" fill="var(--c4)" opacity="0.9"/>
<text x="170" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">17</text>
<text x="170" y="232" text-anchor="middle" fill="var(--text)">A: partisi id</text>
<text x="170" y="246" text-anchor="middle" fill="var(--text-muted)">8,5 MB pindah</text>
<rect x="330" y="210" width="80" height="6" fill="var(--c1)" opacity="0.9"/>
<text x="370" y="202" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0</text>
<text x="370" y="232" text-anchor="middle" fill="var(--text)">B: partisi kota</text>
<text x="370" y="246" text-anchor="middle" fill="var(--text-muted)">0 MB pindah</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">baris yang harus pindah mesin saat agregasi per kota (ilustrasi 24 baris)</text>
</g>
</svg>`;

const LAB1_SETUP = `# Data JANGAN UBAH. 24 transaksi: 4 kota.
import pandas as pd
kota = ["Jakarta"]*8 + ["Bandung"]*6 + ["Surabaya"]*6 + ["Medan"]*4
df = pd.DataFrame({"id": list(range(1, 25)), "kota": kota, "nominal": [i*100 for i in range(1, 25)]})
`;

export const d21: V2Lesson = {
  slug: "d21-pyspark",
  track: "Python",
  module: "Skala",
  title: "D21 — PySpark: Saat Pandas Menyerah",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pandas-nya tidak salah — datanya yang membesar",
      prose: [
        "Sari, analis kredit sebuah bank digital, punya pipeline ETL harian yang ia cintai: pandas, 14 baris, jalan 6 menit untuk 2 juta transaksi. Bisnis tumbuh. Suatu Senin, tabelnya 40 juta baris. Pipeline yang sama jalan 4 jam, lalu mati dengan satu baris merah: MemoryError. Sari menaikkan RAM server 4× lipat — pipeline jalan 3 jam, tagihan naik 5×. Ia lalu menulis ulang semuanya ke PySpark dalam dua hari. Pipeline baru: 22 menit, di cluster murah. Pertanyaannya: kenapa tidak dari dulu pakai Spark? Karena 6 bulan lalu, Spark untuk 2 juta baris justru LEBIH LAMBAT dari pandas — overhead-nya lebih besar dari manfaatnya.",
        "Twist-nya: Sari sempat mencoba “jalan pintas” — mempartisi data Spark-nya berdasarkan id transaksi (seimbang sempurna, skew 1,0). Agregasi per kota tetap lambat. Ia ganti kunci partisi ke kota — partisi jadi tidak seimbang (skew 2,0) — dan agregasinya justru 10× lebih cepat. Partisi yang “rapi” secara matematis ternyata bodoh secara bisnis; partisi yang “miring” justru cerdas. Lesson ini menjelaskan kenapa — dan kapan kamu harus pindah dari pandas.",
        "Tiga hal yang akan kamu kuasai: (1) partisi dan lazy evaluation — dua ide yang membuat Spark bisa menangani data 100× RAM; (2) shuffle — biaya utama yang menentukan cepat atau lambatnya job-mu; (3) aturan kapan pindah dari pandas ke PySpark (dan kapan JANGAN).",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "PySpark ASLI butuh cluster JVM (Java + Spark) — tidak tersedia di lab browser. Lab memakai pandas dengan POLA 1:1 terhadap logika Spark: kunci partisi = kolom yang menentukan baris tinggal di mesin mana; shuffle = baris yang harus pindah mesin sebelum agregasi; lazy evaluation disimulasikan sebagai rencana eksekusi yang baru “dijalankan” saat aksi dipanggil. Di laptop: pip install pyspark, dan df.groupBy(\"kota\").sum() mengikuti logika yang sama persis — hanya mesinnya yang sungguhan.",
      },
      reference: "Pandas mati bukan karena salah, tapi karena data membesar. Partisi cerdas > partisi seimbang.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita Sari dan MemoryError. (2) Peta ini. (3) Konsep: partisi — Si Tukang Sortir Gudang. (4) Konsep: shuffle — Si Tukang Pindahan, biaya utama Spark. (5) Konsep: DataFrame API vs RDD + kapan pindah dari pandas. (6) Lab 1: ukur skew dua strategi partisi. (7) Lab 2: hitung biaya shuffle. (8) Chart: 17 vs 0 baris pindah. (9) Peta keputusan: pandas vs Spark. (10) Mini-case: migrasi pipeline 40 juta baris. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan partisi, lazy evaluation, dan shuffle dengan analogi yang benar; (2) memilih kunci partisi berdasarkan pola query, bukan berdasarkan keseimbangan semata; (3) menghitung biaya shuffle sebuah agregasi; (4) memutuskan kapan pindah ke PySpark — dan kapan bertahan di pandas.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: pandas dasar (DataFrame, groupby, value_counts); list dan dict; operasi modulo (%). Tidak perlu pengalaman Spark.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart shuffle → peta keputusan → mini-case → kuis. Estimasi 65 menit; dua lab ±18 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap data 40 juta baris sebagai 40 juta kardus di gudang raksasa. pandas = satu orang super-cepat yang memindahkan semua kardus sendirian (asal gudangnya — RAM — cukup). Spark = 100 orang biasa, masing-masing bertanggung jawab atas satu lorong (partisi). Shuffle = saat kardus harus dipindahkan ANTAR lorong karena pengelompokan berubah — itulah pekerjaan paling melelahkan di gudang.",
      ],
      reference: "Tujuan: partisi + lazy + shuffle + kapan pindah. Pola lab 1:1 dengan logika Spark.",
    },
    {
      id: "konsep-partisi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Partisi — Si Tukang Sortir Gudang",
      prose: [
        "Definisi: partisi adalah potongan data yang tinggal di satu mesin (executor). Spark memecah dataset menjadi N partisi; tiap partisi diproses paralel oleh satu task. Kunci partisi (partition key) menentukan baris mana tinggal di mana — biasanya hash dari satu kolom. Lazy evaluation artinya Spark TIDAK mengeksekusi transformasi saat kamu menulisnya: df.filter(...).groupBy(...) hanya membangun RENCANA (DAG); eksekusi baru terjadi saat aksi dipanggil (count(), collect(), write).",
        "Kepribadiannya: partisi adalah tukang sortir gudang yang membagi kardus ke lorong-lorong SEBELUM ada yang bertanya. Lazy evaluation adalah mandor yang tidak menyuruh siapa pun bergerak sampai ada perintah “kirim laporannya sekarang” (aksi) — lalu ia menyusun rute TERPENDEK dari semua instruksi yang menumpuk. Sari yang mempartisi by id: tukang sortir yang membagi kardus berdasarkan nomor urut — rapi di rak, tetapi saat bos minta “rekap per kota”, semua lorong harus dibuka dan kardus dipindah-pindah. Tukang sortir yang membagi BERDASARKAN KOTA: raknya miring (Jakarta 8, Medan 4), tetapi rekap per kota tinggal mengambil per lorong — nol pindahan.",
        "Kapan memakai: pilih kunci partisi = kolom yang paling sering jadi kunci join/groupBy di query-mu (kota untuk agregasi kota, tanggal untuk filter tanggal). Tiga aturan: (1) partisi untuk POLA QUERY, bukan untuk keseimbangan; (2) jumlah partisi ≈ 2–4× jumlah core (terlalu sedikit = ada core menganggur; terlalu banyak = overhead scheduling); (3) waspadai skew ekstrem — satu partisi 10× lebih besar dari lainnya membuat 1 task jadi bottleneck (solusi: salting, dibahas di mini-case).",
      ],
      tasks: [],
      formula: String.raw`P_{ideal} \approx 2 \times C \; \text{sampai} \; 4 \times C`,
      formulaNote: "P = jumlah partisi yang disarankan; C = jumlah core CPU di cluster. Contoh: cluster 8 core → 16–32 partisi. Terlalu sedikit partisi: sebagian core menganggur (data 4 partisi di 8 core = 4 core tidur). Terlalu banyak (10.000 partisi untuk 1 GB): overhead penjadwalan task lebih mahal dari komputasinya.",
      note: {
        title: "🚨 Mitos: “Partisi harus seimbang sempurna”",
        type: "pitfall",
        body: "Yang benar: keseimbangan hanya setengah cerita — yang lebih penting adalah LOCALITY: baris yang akan diagregasi bersama harus sudah tinggal bersama. Partisi by id Sari seimbang sempurna (skew 1,0) tetapi memaksa shuffle 17 dari 24 baris; partisi by kota miring (skew 2,0) tetapi shuffle-nya NOL. Keseimbangan tanpa locality = gudang rapi yang boros pindahan.",
      },
      hints: [
        "💡 Intuisi lazy: di pandas, tiap baris kode langsung bekerja (eager). Di Spark, df = df.filter(...) tidak menyentuh data SAMA SEKALI sampai kamu memanggil aksi. Keuntungannya: Spark bisa mengoptimalkan SELURUH rencana sekaligus (predicate pushdown: filter didorong sedekat mungkin ke sumber baca).",
      ],
      reference: "Partisi = potongan per mesin; kunci partisi mengikuti pola query. Lazy: rencana dulu, eksekusi saat aksi.",
    },
    {
      id: "konsep-shuffle",
      eyebrow: "Langkah 4 · Konsep",
      title: "Shuffle — Si Tukang Pindahan dan Tagihannya",
      prose: [
        "Definisi: shuffle adalah pemindahan baris ANTAR partisi (antar mesin) agar baris-baris dengan kunci yang sama berkumpul. Terjadi saat groupBy, join, atau repartition dengan kunci berbeda dari kunci partisi saat ini. Ini operasi TERMahal di Spark: melibatkan serialisasi, transfer jaringan, dan tulis-baca disk — sering 80–90% waktu sebuah job yang lambat.",
        "Kepribadiannya: shuffle adalah tukang pindahan yang menagih per kardus per kilometer. Transformasi tanpa shuffle (map, filter) = menata kardus di lorong sendiri — gratis ongkir. Begitu kamu groupBy dengan kunci berbeda dari kunci partisi, tukang pindahan datang: setiap baris yang “salah lorong” harus diangkut lewat jaringan. Sari membayar 8,5 MB “ongkir” untuk 24 baris mainan; untuk 40 juta baris, ongkirnya terabyte — dan tagihan network + waktu yang sebenarnya.",
        "Kapan memakai: minimalkan shuffle dengan tiga cara: (1) partisi berdasarkan kunci agregasi sejak awal (seperti strategi B); (2) hindari groupBy berantai dengan kunci berbeda — gabungkan agregasi; (3) untuk join: broadcast join bila satu sisi kecil (<10 MB default) — tabel kecil dikirim ke semua mesin, NOL shuffle. Rumus biayanya sederhana dan jujur:",
      ],
      tasks: [],
      formula: String.raw`C_{shuffle} = n_{pindah} \times s`,
      formulaNote: "C = biaya shuffle; n_pindah = jumlah baris yang harus pindah partisi (baris “salah lorong”); s = ukuran per baris (byte). Contoh lab: n=17 baris, s=0,5 MB → C = 8,5 MB yang harus melintasi jaringan. Untuk 40 juta baris dengan pola yang sama: n ≈ 28 juta baris × ukuran baris = ratusan GB “ongkir”.",
      note: {
        title: "🚨 Mitos: “Spark lambat karena Python”",
        type: "pitfall",
        body: "Yang benar: PySpark lambat 90% karena SHUFFLE dan serialisasi yang buruk, bukan karena Python-nya. Dua job PySpark dengan kode Python identik bisa beda 10× lipat kecepatannya hanya karena strategi partisi. Menyalahkan bahasa = mengobati gejala; mengobati shuffle = mengobati penyakit. (Pengecualian: UDF Python baris-per-baris memang lambat — pakai fungsi bawaan Spark/F.col yang berjalan di JVM.)",
      },
      hints: [
        "💡 Intuisi broadcast join: kalau satu tabel kecil (mis. tabel kota: 4 baris), JANGAN shuffle 40 juta baris untuk menemuinya — fotokopi tabel kecilnya dan tempel di setiap lorong. Itulah broadcast: tabel kecil dikirim ke semua executor, join tanpa pindahan sama sekali.",
      ],
      reference: "Shuffle = baris pindah mesin; 80–90% waktu job lambat. Obat: partisi ikut kunci agregasi, broadcast join untuk tabel kecil.",
    },
    {
      id: "konsep-api",
      eyebrow: "Langkah 5 · Konsep",
      title: "DataFrame API vs RDD — dan kapan pindah dari pandas",
      prose: [
        "Definisi: RDD (Resilient Distributed Dataset) adalah API level rendah Spark — kamu mengatur partisi dan komputasi manual, seperti menyetir mobil manual. DataFrame API (df.groupBy(...).agg(...)) adalah API level tinggi — deklaratif, dan Spark mengoptimalkan rencananya via Catalyst optimizer, seperti mobil matik dengan supir profesional. Untuk analis Python: DataFrame API adalah rumahmu — sintaksnya mirip pandas (filter, groupBy, withColumn), dan 95% pekerjaan tidak butuh RDD.",
        "Kepribadiannya: RDD adalah montir yang membongkar mesin sendiri — powerful, tetapi kamu yang menanggung semua keputusan. DataFrame API adalah sopir taksi berpengalaman — kamu sebutkan tujuan (apa yang mau dihitung), ia yang memilih rute tercepat (Catalyst + Tungsten mengoptimalkan rencana eksekusi). Sari yang menulis ulang pipeline-nya: 14 baris pandas menjadi ~20 baris PySpark DataFrame API — bukan karena Spark “lebih panjang”, tapi karena ia menambahkan dua baris partisi yang menghemat 10× waktu.",
        "Kapan memakai — aturan pindahnya (inilah peta keputusan mini lesson ini): TETAP di pandas bila data muat nyaman di RAM (<50% RAM tersedia), pipeline jalan <30 menit, dan tim sudah produktif — overhead Spark tidak membayar. PINDAH ke PySpark bila: (1) MemoryError atau data > RAM; (2) runtime > jam dan tumbuh tiap bulan; (3) butuh fault tolerance (1 mesin mati ≠ job gagal — RDD/DataFrame bisa recompute partisi yang hilang). Jangan pindah karena “ingin terlihat modern” — Sari membuktikan Spark untuk 2 juta baris justru lebih lambat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “PySpark = pandas yang lebih cepat”",
        type: "pitfall",
        body: "Yang benar: untuk data KECIL, PySpark justru LEBIH LAMBAT dari pandas (overhead JVM + scheduling task bisa detik–menit untuk job yang pandas selesaikan dalam milidetik). PySpark bukan “pandas turbo” — ia adalah “pandas yang tidak mati saat data 100× RAM”. Kecepatan relatifnya baru menang saat data melebihi kapasitas satu mesin.",
      },
      hints: [
        "💡 Intuisi Catalyst: karena DataFrame API deklaratif (“hitung rata-rata per kota”) bukan imperatif (“loop baris ini lalu...”), Spark bisa MENULIS ULANG rencanamu menjadi lebih cepat — mis. mendorong filter sebelum join. Kode RDD imperatif tidak bisa dioptimalkan seperti ini karena Spark tidak tahu niatmu.",
      ],
      reference: "DataFrame API = rumah analis (mirip pandas, dioptimalkan Catalyst). Pindah bila >RAM / jam-an / butuh fault tolerance.",
    },
    {
      id: "lab-partisi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Ukur skew dua strategi partisi",
      prose: [
        "Waktunya praktik. Data 24 transaksi (4 kota) sudah tersedia sebagai DataFrame pandas. Tugasmu: (1) simulasikan partisi Spark strategi A — kunci = id % 4 (seperti Sari yang pertama); (2) strategi B — kunci = indeks kota % 4; (3) hitung baris per partisi dan rasio skew (max/min) untuk keduanya. Prediksi dulu sebelum run: strategi mana yang “terlihat” lebih baik?",
        "Di Spark asli, ini setara df.repartition(4, \"id\") vs df.repartition(4, \"kota\") — lalu menghitung baris per partisi. Bedanya: di sini 24 baris, di produksi 40 juta — logika partisi-nya identik.",
        "Coba: setelah lolos, ubah jumlah partisi menjadi 2 (id % 2) — bagaimana skew strategi A? Lalu pikirkan: apakah skew yang bagus membuat strategi A menang untuk agregasi per kota? (Tidak — Lab 2 membuktikannya.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `baris_A` (list baris per partisi, kunci id % 4, urut menaik)" },
        { id: "t2", text: "Hitung `baris_B` (list baris per partisi, kunci indeks kota % 4, urut menaik)" },
        { id: "t3", text: "Hitung `skew_A` dan `skew_B` (max/min, bulatkan 1 desimal)" },
      ],
      expected: "A: [6, 6, 6, 6] skew=1.0 | B: [4, 6, 6, 8] skew=2.0",
      code: {
        starter: LAB1_SETUP + "\n# TULIS KODEMU: t1 strategi A — partisi by id % 4\nbaris_A =\n\n# t2 strategi B — partisi by indeks kota % 4 (Jakarta=0, Bandung=1, Surabaya=2, Medan=3)\nidx = {\"Jakarta\": 0, \"Bandung\": 1, \"Surabaya\": 2, \"Medan\": 3}\nbaris_B =\n\n# t3: rasio skew = max/min\nskew_A =\nskew_B =\n\nprint(f\"A: {baris_A} skew={skew_A} | B: {baris_B} skew={skew_B}\")\n",
        lockLines: 4,
        solution: LAB1_SETUP + "\n# TULIS KODEMU: t1 strategi A — partisi by id % 4\nbaris_A = sorted((df[\"id\"] % 4).value_counts().tolist())\n\n# t2 strategi B — partisi by indeks kota % 4 (Jakarta=0, Bandung=1, Surabaya=2, Medan=3)\nidx = {\"Jakarta\": 0, \"Bandung\": 1, \"Surabaya\": 2, \"Medan\": 3}\nbaris_B = sorted(df[\"kota\"].map(idx).value_counts().tolist())\n\n# t3: rasio skew = max/min\nskew_A = round(max(baris_A) / min(baris_A), 1)\nskew_B = round(max(baris_B) / min(baris_B), 1)\n\nprint(f\"A: {baris_A} skew={skew_A} | B: {baris_B} skew={skew_B}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "baris_A = [6,6,6,6]", msg: "id % 4 atas 24 baris: tiap partisi 6.", name: "baris_A", value: [6, 6, 6, 6] },
          { kind: "equal", task: "t2", label: "baris_B = [4,6,6,8]", msg: "Kota utuh per partisi: Medan 4, Bandung 6, Surabaya 6, Jakarta 8.", name: "baris_B", value: [4, 6, 6, 8] },
          { kind: "equal", task: "t3", label: "skew_A = 1.0", msg: "Seimbang sempurna — dan itu jebakannya.", name: "skew_A", value: 1.0, tol: 0.01 },
          { kind: "equal", task: "t3", label: "skew_B = 2.0", msg: "Miring 8/4 — tetapi locality-nya sempurna.", name: "skew_B", value: 2.0, tol: 0.01 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Dua strategi + dua skew.", pattern: "skew=2.0" },
        ],
      },
      reference: "A seimbang (1,0) tapi bodoh; B miring (2,0) tapi cerdas. Skew tanpa locality = vanity metric.",
    },
    {
      id: "lab-shuffle",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Hitung biaya shuffle agregasi per kota",
      prose: [
        "Lab kedua mengukur “ongkir tukang pindahan”. Untuk agregasi per kota, tiap kota harus berkumpul di satu partisi. Tugasmu: (1) hitung shuffle_A — total baris yang “salah lorong” (per kota: baris kota − baris kota terbanyak dalam satu partisi); (2) shuffle_B dengan cara yang sama; (3) biaya dalam MB (asumsi 0,5 MB/baris) + vonis strategi pemenang. Rumus Langkah 4 dipakai langsung.",
        "Di Spark asli, ini setara menjelaskan kenapa df.groupBy(\"kota\") setelah repartition(\"id\") memicu shuffle penuh — sedangkan setelah repartition(\"kota\") nyaris tanpa shuffle.",
        "Coba: setelah lolos, naikkan ukuran baris menjadi 5 MB (data JSON gemuk) — berapa “ongkir” strategi A sekarang? Itulah kenapa wide row + kunci partisi buruk = kombinasi mematikan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `shuffle_A` (baris salah lorong, kunci id % 4)" },
        { id: "t2", text: "Hitung `shuffle_B` (baris salah lorong, kunci indeks kota % 4)" },
        { id: "t3", text: "Hitung `biaya_A`, `biaya_B` (MB; 0,5 MB/baris) dan `pemenang` (\"A\"/\"B\")" },
      ],
      expected: "shuffle A: 17 baris (8.5 MB) | shuffle B: 0 baris (0.0 MB) | pemenang: B",
      code: {
        starter: LAB1_SETUP + "\n# TULIS KODEMU: t1 shuffle strategi A — per kota: baris_kota - max(baris_kota per partisi)\nshuffle_A =\n\n# t2 shuffle strategi B\nidx = {\"Jakarta\": 0, \"Bandung\": 1, \"Surabaya\": 2, \"Medan\": 3}\nshuffle_B =\n\n# t3: biaya (0,5 MB/baris) + vonis\nbiaya_A =\nbiaya_B =\npemenang =\n\nprint(f\"shuffle A: {shuffle_A} baris ({biaya_A} MB) | shuffle B: {shuffle_B} baris ({biaya_B} MB) | pemenang: {pemenang}\")\n",
        lockLines: 4,
        solution: LAB1_SETUP + "\n# TULIS KODEMU: t1 shuffle strategi A — per kota: baris_kota - max(baris_kota per partisi)\nshuffle_A = sum(len(g) - g[\"id\"].mod(4).value_counts().max() for _, g in df.groupby(\"kota\"))\n\n# t2 shuffle strategi B\nidx = {\"Jakarta\": 0, \"Bandung\": 1, \"Surabaya\": 2, \"Medan\": 3}\nshuffle_B = sum(len(g) - g[\"kota\"].map(idx).value_counts().max() for _, g in df.groupby(\"kota\"))\n\n# t3: biaya (0,5 MB/baris) + vonis\nbiaya_A = shuffle_A * 0.5\nbiaya_B = shuffle_B * 0.5\npemenang = \"A\" if biaya_A < biaya_B else \"B\"\n\nprint(f\"shuffle A: {shuffle_A} baris ({biaya_A} MB) | shuffle B: {shuffle_B} baris ({biaya_B} MB) | pemenang: {pemenang}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "shuffle_A = 17 baris", msg: "Tiap kota tersebar di 4 partisi; hanya yang terbanyak per kota yang boleh tinggal.", name: "shuffle_A", value: 17 },
          { kind: "equal", task: "t2", label: "shuffle_B = 0 baris", msg: "Tiap kota sudah utuh di partisinya — nol pindahan.", name: "shuffle_B", value: 0 },
          { kind: "equal", task: "t3", label: "biaya_A = 8,5 MB", msg: "17 × 0,5 — ongkir strategi A.", name: "biaya_A", value: 8.5, tol: 0.01 },
          { kind: "equal", task: "t3", label: "biaya_B = 0,0 MB", msg: "Nol baris pindah = nol ongkir.", name: "biaya_B", value: 0.0, tol: 0.01 },
          { kind: "equal", task: "t3", label: "pemenang = B", msg: "Locality mengalahkan keseimbangan.", name: "pemenang", value: "B" },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Dua shuffle, dua biaya, satu vonis.", pattern: "pemenang: B" },
        ],
      },
      reference: "Shuffle A = 17 baris (8,5 MB); B = 0. Rumus C = n × s dipakai langsung.",
    },
    {
      id: "chart-shuffle",
      eyebrow: "Langkah 8 · Chart",
      title: "17 vs 0: harga sebuah kunci partisi",
      prose: [
        "Chart di bawah memvisualkan hasil Lab 2: baris yang harus pindah mesin saat agregasi per kota — strategi A (kunci id) 17 baris, strategi B (kunci kota) 0 baris.",
        "Cara membaca: sumbu Y = jumlah baris yang “salah lorong”; tiap batang = satu strategi kunci partisi; label di bawah batang = ongkirnya dalam MB.",
        "Interpretasi: batang A menjulang, batang B nyaris tak terlihat — untuk DATA DAN QUERY YANG SAMA. Satu-satunya yang berubah adalah satu argumen: kunci partisi. Inilah visualisasi paling jujur tentang “biaya keputusan kecil”: dua baris kode (repartition by id vs by kota) membedakan job yang 10× lebih lambat. Di produksi, batang A bukan 17 baris melainkan 28 juta baris — dan “ongkirnya” dibayar dengan jam dan dolar.",
      ],
      figure: {
        svg: SHUFFLE_SVG,
        alt: "Diagram batang: strategi A 17 baris pindah (8,5 MB), strategi B 0 baris (0 MB).",
        caption: "Satu argumen berbeda, 17 vs 0 baris pindah. Kunci partisi adalah keputusan termahal yang paling murah diubah.",
      },
      tasks: [],
      reference: "17 vs 0 untuk data & query yang sama — harga satu argumen kunci partisi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: pandas atau PySpark",
      prose: [
        "Skenario 1 — Data 500 ribu baris, pipeline 3 menit, RAM 16 GB. → Tetap pandas. Alasan: overhead Spark (JVM + scheduling) lebih mahal dari manfaatnya — seperti menyewa truk kontainer untuk mengantar satu kardus.",
        "Skenario 2 — Data 40 juta baris, MemoryError semalam. → Pindah PySpark DataFrame API. Alasan: data > RAM adalah garis batas yang tidak bisa dinegosiasi; partisi + lazy + fault tolerance menyelesaikannya.",
        "Skenario 3 — Sudah di Spark tetapi groupBy lambat. → Cek kunci partisi dulu (apakah mengikuti kunci agregasi?), lalu pertimbangkan broadcast join untuk tabel kecil. Alasan: 80–90% kelambatan Spark = shuffle, bukan Python-nya.",
        "Skenario 4 — Butuh loop Python baris-per-baris (UDF kompleks) atas data besar. → Hindari UDF Python per-baris; pakai fungsi bawaan Spark (F.col) atau pandas UDF (vectorized). Alasan: UDF per-baris memaksa serialisasi Python↔JVM tiap baris — satu-satunya kasus di mana “Spark lambat karena Python” benar-benar benar.",
        "Skenario 5 — Tim 2 orang, data 5 juta baris, deadline minggu depan. → Tetap pandas + sampling/chunking dulu; migrasi Spark setelah pipeline stabil. Alasan: migrasi di tengah deadline = dua risiko sekaligus (risiko logika + risiko platform).",
        "Aturan praktis 10 detik: muat di RAM + <30 menit = pandas. MemoryError / >RAM / tumbuh tiap bulan = Spark. Sudah di Spark tapi lambat = salahkan shuffle dulu, bukan Python.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Migrasi ke Spark “agar modern” saat data masih 2 juta baris — lalu heran kenapa lebih lambat dan tagihan cluster muncul tiap bulan. Modernitas arsitektur bukan metrik; metriknya: apakah job selesai dalam SLA dengan biaya masuk akal. Sari menunggu sampai MemoryError — dan itu keputusan yang tepat.",
      },
      reference: "pandas vs Spark = soal ukuran & SLA, bukan gengsi. Lambat di Spark = cek shuffle dulu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Migrasi pipeline 40 juta baris: rencana Sari",
      prose: [
        "Skenario (sintetis, angka konkret): pipeline skoring harian Sari — baca 40 juta transaksi (±8 GB), join tabel nasabah 2 juta baris (±400 MB), agregasi per kota + per segmen risiko, tulis ke tabel hasil. Di pandas: MemoryError di 32 GB RAM. Target SLA: selesai <45 menit, biaya cluster <$15/hari.",
        "Pertanyaan analisis: (1) Berapa partisi yang disarankan untuk cluster 8 core, dan kunci partisi apa? (2) Join 8 GB × 400 MB — strategi join apa dan kenapa? (3) Di mana letak risiko skew, dan mitigasinya?",
        "Pembahasan: (1) 16–32 partisi (2–4× core); kunci = kota (kunci agregasi utama) — bukan id transaksi. (2) Tabel nasabah 400 MB > ambang broadcast default (~10 MB) tetapi masih “kecil” relatif terhadap 8 GB — opsi: naikkan ambang broadcast bila memori executor cukup, atau partisi KEDUA tabel by kunci join (sort-merge join tanpa shuffle ulang). (3) Risiko skew: Jakarta bisa 5× Medan — 1 task menampung partisi Jakarta menjadi bottleneck; mitigasi salting: pecah kunci Jakarta menjadi jakarta_0..jakarta_3 saat agregasi, lalu agregasi ulang.",
        "Kaitan ke karier: “memigrasikan pipeline 40 juta baris dari pandas ke PySpark, 4 jam → 22 menit” adalah baris CV yang dibaca hiring manager sampai habis — karena ia membuktikan kamu paham KENAPA, bukan sekadar API-nya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pipeline skoring yang gagal diam-diam (bukan crash, tapi salah karena OOM-kill parsial atau sampling tak disengaja) adalah risiko model yang nyata: skor kredit yang hilang = keputusan kredit yang buta. Fault tolerance Spark (recompute partisi yang gagal) bukan kemewahan — ia adalah kontrol kualitas data.",
      },
      reference: "16–32 partisi by kota; join 400 MB = pertimbangkan broadcast; skew Jakarta = salting.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Partisi = potongan data per mesin; kunci partisi harus mengikuti pola query (locality > keseimbangan).",
        "Lazy evaluation: transformasi membangun rencana (DAG); eksekusi terjadi saat aksi — memungkinkan optimasi Catalyst.",
        "Shuffle = baris pindah mesin; biaya C = n × s; 80–90% kelambatan Spark berasal dari sini.",
        "DataFrame API (deklaratif, dioptimalkan) untuk analis; RDD hanya bila perlu kontrol level rendah.",
        "Pindah ke Spark bila data > RAM / runtime jam-an / butuh fault tolerance; selain itu pandas menang.",
      ],
      next: { label: "D22 — BigQuery & Snowflake dari Python", href: "/v2/learn/d22-bigquery-snowflake" },
      quiz: [
        {
          q: "Strategi A (partisi by id, skew 1,0) vs B (by kota, skew 2,0) untuk agregasi per kota. Mana lebih cepat dan kenapa?",
          options: [
            { text: "B — locality: tiap kota sudah utuh di partisinya sehingga shuffle = 0", why: "Benar: angka lab — shuffle B 0 baris vs A 17 baris. Keseimbangan tanpa locality tidak berguna untuk agregasi.", correct: true },
            { text: "A — partisi seimbang berarti beban kerja merata di semua core", why: "Salah: beban “merata” tidak membantu bila 17 dari 24 baris tetap harus pindah mesin — ongkir shuffle mendominasi." },
            { text: "Sama cepat — jumlah partisi sama (4)", why: "Salah: jumlah partisi sama, tetapi distribusi kunci terhadap query berbeda — itulah seluruh inti lesson ini." },
            { text: "A — skew 2,0 pada B membuat 1 task bottleneck", why: "Salah: skew 2,0 ringan (8 vs 4 baris); bottleneck skew baru masalah pada rasio ekstrem (10×+). Di sini locality menang telak." },
          ],
        },
        {
          q: "Apa yang terjadi saat kamu menulis df = df.filter(df.kota == \"Jakarta\") di PySpark (tanpa aksi)?",
          options: [
            { text: "Tidak ada — hanya rencana (DAG) yang dibangun; eksekusi menunggu aksi seperti count()", why: "Benar: lazy evaluation — inilah yang memungkinkan Catalyst mengoptimalkan seluruh rencana sekaligus.", correct: true },
            { text: "Filter langsung dijalankan di semua partisi", why: "Salah: itu perilaku eager (pandas). Di Spark, transformasi = janji, bukan pekerjaan." },
            { text: "Error — filter wajib diikuti aksi di baris yang sama", why: "Salah: tidak ada keharusan itu; chaining transformasi lalu satu aksi di akhir adalah pola normal." },
            { text: "Data di-cache otomatis di memori", why: "Salah: caching hanya terjadi bila kamu memanggil .cache()/.persist() secara eksplisit." },
          ],
        },
        {
          q: "Job PySpark lambat padahal kode Python-nya sederhana. Diagnosis pertama yang profesional?",
          options: [
            { text: "Cek shuffle: kunci partisi vs kunci groupBy/join — 80–90% kelambatan berasal dari sini", why: "Benar: aturan lesson — salahkan shuffle dulu, bukan Python.", correct: true },
            { text: "Tulis ulang ke Scala — Python terlalu lambat untuk Spark", why: "Salah: mitos Langkah 4 — kelambatan hampir selalu shuffle/serialisasi, bukan bahasa driver-nya." },
            { text: "Naikkan jumlah executor 10× lipat", why: "Salah: executor lebih banyak tidak mengurangi shuffle; bahkan menambah overhead scheduling." },
            { text: "Kecilkan data dengan sampling agar cepat", why: "Salah: mengorbankan kebenaran demi kecepatan tanpa diagnosis — urutan yang salah." },
          ],
        },
        {
          q: "Join tabel transaksi 8 GB dengan tabel kota 4 MB. Strategi join terbaik?",
          options: [
            { text: "Broadcast join — tabel kecil dikirim ke semua executor, nol shuffle", why: "Benar: 4 MB << ambang broadcast; fotokopi tabel kecil ke tiap lorong.", correct: true },
            { text: "Sort-merge join dengan repartition kedua tabel", why: "Salah: bisa, tetapi boros — shuffle 8 GB tidak perlu bila satu sisi muat di memori tiap executor." },
            { text: "Loop manual di driver dengan collect()", why: "Salah: collect() menarik 8 GB ke driver = MemoryError yang baru saja kita tinggalkan." },
            { text: "Cross join lalu filter", why: "Salah: cross join 8 GB × 4 MB = ledakan kombinatorial — pola paling mahal yang ada." },
          ],
        },
        {
          q: "Kapan TETAP memakai pandas meski PySpark tersedia di perusahaan?",
          options: [
            { text: "Data muat nyaman di RAM dan pipeline <30 menit — overhead Spark tidak membayar", why: "Benar: skenario 1 peta keputusan — truk kontainer untuk satu kardus.", correct: true },
            { text: "Tidak pernah — Spark selalu lebih cepat", why: "Salah: mitos Langkah 5 — untuk data kecil Spark justru lebih lambat (overhead JVM + scheduling)." },
            { text: "Hanya bila dilarang manajer", why: "Salah: keputusan arsitektur berdasarkan metrik (SLA, biaya), bukan hierarki." },
            { text: "Bila data sudah terpartisi rapi", why: "Salah: data terpartisi rapi justru alasan KUAT memakai Spark — argumen ini terbalik." },
          ],
        },
        {
          q: "Satu partisi (Jakarta) 10× lebih besar dari lainnya dan menjadi bottleneck. Mitigasi yang tepat?",
          options: [
            { text: "Salting: pecah kunci besar menjadi sub-kunci (jakarta_0..3), agregasi dua tahap", why: "Benar: pola mini-case — pecah dulu, gabung kemudian; bottleneck hilang tanpa mengubah hasil.", correct: true },
            { text: "Kurangi jumlah partisi agar Jakarta menyebar", why: "Salah: mengurangi partisi menggabungkan partisi — Jakarta tetap satu gumpalan, kini dengan tetangga yang ikut melambat." },
            { text: "Naikkan RAM executor 10× lipat", why: "Salah: mengobati gejala dengan uang; partisi raksasa tetap diproses 1 task serial." },
            { text: "Filter Jakarta keluar dari pipeline", why: "Salah: membuang data = mengubah hasil bisnis — bukan optimasi, melainkan manipulasi." },
          ],
        },
      ],
    },
  ],
};
