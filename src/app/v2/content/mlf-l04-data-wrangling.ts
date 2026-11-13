import type { V2Lesson } from "../lib/types";

export const mlfL04: V2Lesson = {
  slug: "mlf-l04-data-wrangling",
  track: "Machine Learning Finance",
  module: "Data Foundations — prasyarat M1",
  title: "L0.4 — Data Wrangling: dari Raw ke Analysis-Ready",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "L0.1 sampai L0.3 membersihkan satu file. Lesson ini menyusun banyak file menjadi satu tabel yang siap dimodelkan: mengubah bentuk (reshape), menggabungkan (join), dan mengubah kode menjadi angka (encoding).",
        "Tujuan lesson ini:",
        "• Mengubah wide menjadi long (dan sebaliknya) dengan hitungan baris yang bisa diverifikasi.",
        "• Memilih inner, left, atau full outer join — dan tahu berapa baris yang hilang atau bertambah di tiap pilihan.",
        "• Memilih encoding yang benar: ordinal bila urutannya bermakna, one-hot bila tidak.",
        "• Menjalankan checklist raw ke analysis-ready: tipe, satuan, rentang, dan konsistensi.",
        "Isi lesson: cerita dua file yang belum bisa digabung → reshape → join → encoding → checklist analysis-ready → 2 lab → peta keputusan → mini-case notebook → guided task di Colab → checkpoint.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Dua file yang belum bisa bicara",
      prose: [
        "Analis itu punya dua file. File pertama: 6 pelamar dengan nama, income, pendidikan, dan status pernikahan. File kedua: 6 riwayat pembayaran dengan 6 kolom bulan (BILL_AMT1 sampai BILL_AMT6) — satu baris per nasabah, satu kolom per bulan. Ditambah satu masalah: status pernikahan berkode 1, 2, 3 dan pendidikan 1 sampai 4 — angka yang tampak seperti bilangan, tapi sebenarnya label.",
        "Tidak satu pun dari kedua file itu bisa langsung dimodelkan. File pembayaran berbentuk wide — model butuh long. Kedua file belum digabung — model butuh satu tabel. Kodenya belum di-encoding — model butuh angka yang artinya benar.",
        "Lesson ini mengerjakan ketiganya berurutan: reshape dulu (bentuk), join kemudian (gabung), encoding terakhir (arti). Urutan itu penting — encoding sebelum join berarti meng-encoding dua kali; join sebelum reshape berarti menggabungkan bentuk yang salah.",
      ],
      tasks: [],
      note: {
        title: "Tip: wide untuk manusia, long untuk model",
        body: "Wide (satu kolom per bulan) enak dibaca manusia — satu baris, satu nasabah, semua bulan terlihat. Long (satu baris per nasabah-bulan) enak untuk model — tiap baris adalah satu observasi. Bila tabelmu enak dibaca tapi modelmu bingung, kemungkinan besar bentuknya masih wide.",
      },
    },
    {
      id: "reshape",
      eyebrow: "Langkah 3 · Reshape",
      title: "Reshape: wide ke long dan kembali",
      prose: [
        "Reshape mengubah bentuk tabel tanpa mengubah isinya: wide (lebar, banyak kolom) menjadi long (panjang, banyak baris), atau sebaliknya. Kuncinya adalah menghitung baris sebelum dan sesudah — bila jumlahnya tidak cocok, ada yang hilang di jalan.",
        "Nilai: 3 nasabah × 6 bulan (BILL_AMT1 sampai BILL_AMT6) menjadi 18 baris [lab] — tiap nasabah-bulan menjadi satu baris dengan kolom (nasabah, bulan, tagihan). 30.000 × 6 = 180.000 baris bila di-melt [ilustrasi]; notebook credit scoring sendiri tidak di-melt — ia tetap wide dan mengagregasi kolomnya (cell 13). Hitungannya selalu sama: baris long sama dengan jumlah nasabah dikali jumlah bulan.",
        "Gambar di bawah menunjukkan perubahannya: kiri, tabel wide 3 baris × 6 kolom bulan; kanan, tabel long 18 baris × 3 kolom. Tidak ada nilai yang berubah — hanya susunannya.",
        "Baik atau buruk: wide baik untuk dibaca dan dilaporkan — satu baris per nasabah. Wide kurang cocok bila yang dibutuhkan adalah operasi per-waktu (agregasi runtun, lag, model deret waktu); untuk model tabular, wide sah dan justru yang dipakai notebook ini — long dipakai untuk menurunkan agregat seperti PAY_MEAN. Long baik untuk agregasi dan model deret waktu — tiap baris adalah satu observasi. Long buruk untuk dibaca manusia — 180.000 baris tidak bisa dibaca sekilas.",
        "Mitigasi: selalu verifikasi hitungan baris sesudah reshape (3 × 6 sama dengan 18; 30.000 × 6 sama dengan 180.000) dan periksa bahwa tidak ada nilai yang hilang — jumlah total tagihan sebelum dan sesudah reshape harus sama. Bila totalnya berubah, reshaping-mu salah.",
      ],
      formula: String.raw`\text{baris long} = n_{\text{nasabah}} \times n_{\text{bulan}}`,
      formulaNote: "Hitungan baris long: tiap kombinasi nasabah-bulan menjadi satu baris. 3 nasabah × 6 bulan sama dengan 18 baris; 30.000 × 6 sama dengan 180.000 baris.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram reshape: tabel wide 3 baris kali 6 kolom bulan menjadi tabel long 18 baris">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Reshape: wide ke long</text>
<rect x="52" y="40" width="150" height="120" rx="6" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="127.0" y="32" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">wide: 3 × 6</text>
<rect x="62" y="50" width="130" height="18" fill="var(--c1)"/>
<text x="127.0" y="63" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · 100 120 110 130 140 150</text>
<rect x="62" y="72" width="130" height="18" fill="var(--c2)"/>
<text x="127.0" y="85" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">B · 200 210 190 220 230 240</text>
<rect x="62" y="94" width="130" height="18" fill="var(--c2)"/>
<text x="127.0" y="107" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">C · 300 310 320 330 340 350</text>
<text x="127.0" y="140" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 baris = 1 nasabah</text>
<line x1="210" y1="100" x2="270" y2="100" stroke="var(--chart-text)" stroke-width="2"/>
<path d="M262 92 L276 100 L262 108" fill="none" stroke="var(--chart-text)" stroke-width="2"/>
<rect x="278" y="40" width="150" height="120" rx="6" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="353.0" y="32" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">long: 18 × 3</text>
<rect x="288" y="50" width="130" height="18" fill="var(--c1)"/>
<text x="353.0" y="63" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · bln 1 · 100</text>
<rect x="288" y="72" width="130" height="18" fill="var(--c2)"/>
<text x="353.0" y="85" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · bln 2 · 120</text>
<rect x="288" y="94" width="130" height="18" fill="var(--c2)"/>
<text x="353.0" y="107" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · bln 3 · 110</text>
<text x="353.0" y="140" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 baris = 1 nasabah-bulan</text>
<text x="240.0" y="196" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3 × 6 = 18 baris · tidak ada nilai yang berubah</text>
<text x="240.0" y="216" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">bila di-melt: 30.000 × 6 = 180.000 baris</text>
</svg>`,
        alt: "Diagram reshape: tabel wide 3 baris kali 6 kolom bulan menjadi tabel long 18 baris.",
        caption: "Cara membaca: kiri satu baris per nasabah dengan 6 kolom bulan; kanan satu baris per nasabah-bulan. Interpretasi: reshape hanya mengubah susunan — total tagihan sebelum dan sesudah harus sama.",
      },
      tasks: [],
    },
    {
      id: "join",
      eyebrow: "Langkah 4 · Join",
      title: "Join: inner, left, dan full outer — hitung barisnya",
      prose: [
        "Join menggabungkan dua tabel berdasarkan kunci yang sama — biasanya ID nasabah. Tiga jenis join menjawab tiga pertanyaan berbeda, dan ketiganya mengubah jumlah baris dengan cara yang berbeda.",
        "Nilai: Tabel A (pelamar) punya id 1 sampai 6 — 6 baris [lab]. Tabel B (pembayaran) punya id 2 sampai 7 — 6 baris [lab]. Inner join (hanya id yang ada di keduanya): id 2, 3, 4, 5, 6 — 5 baris. Left join (semua id A, cocokkan B bila ada): 6 baris — id 1 tanpa pembayaran, kolomnya NaN. Full outer join (semua id dari keduanya): id 1 sampai 7 — 7 baris.",
        "Gambar di bawah menunjukkan ketiganya: inner memotong yang tidak berpasangan; left mempertahankan A sepenuhnya; outer mempertahankan semuanya.",
        "Baik atau buruk: inner baik bila kamu hanya peduli nasabah yang lengkap datanya — tapi ia diam-diam membuang id 1 (pelamar tanpa riwayat pembayaran), dan yang dibuang mungkin justru kelompok yang penting. Left baik bila tabel A adalah populasi analisismu — semua pelamar tetap ada, dan NaN di id 1 adalah informasi (belum ada riwayat). Full outer baik untuk audit — ia menunjukkan siapa yang ada di mana. Outer buruk untuk modelling langsung — baris dengan NaN di kedua sisi harus diputuskan dulu.",
        "Mitigasi: sebelum join, cek kunci di kedua tabel — apakah ada duplikat kunci? Satu id yang muncul dua kali di tabel B akan menggandakan baris A-nya (fan-out, bukan cartesian product) — 6 baris bisa menjadi 12 tanpa peringatan. Dan cek tipe kunci: id sebagai string '001' tidak sama dengan integer 1. Setelah join, verifikasi hitungan baris: inner 5, left 6, outer 7 — bila angkanya tidak cocok, join-mu salah.",
        "Kardinalitas adalah deklarasi sebelum join, bukan penemuan sesudahnya. Empat relasi yang mungkin: one-to-one (satu nasabah, satu profil), one-to-many (satu nasabah, banyak riwayat pembayaran), many-to-one (banyak riwayat, satu nasabah — kebalikan dari yang sebelumnya, tergantung arah bacanya), dan many-to-many (banyak nasabah, banyak produk — butuh tabel jembatan). Sebelum join, nyatakan relasi yang diharapkan — di sini: satu nasabah → banyak riwayat (one-to-many) — lalu cek keunikan kunci di kedua tabel: id di A unik (6 id berbeda), id di H tidak unik (id 2 muncul 3 kali, id 3 muncul 2 kali). Bila relasi yang diharapkan one-to-one tapi kuncinya tidak unik, ada yang salah di data — jangan join dulu. Sesudah join, hitung perubahan baris: A 6 baris join H 8 baris riwayat menjadi 8 baris — satu baris per (nasabah, riwayat), bukan per nasabah. Bila grain yang dibutuhkan adalah satu baris per nasabah, agregasi kembali: rata-rata pembayaran per nasabah — id 2: 150,0; id 3: 210,0; id 4: 100,0; id 5: 300,0; id 6: 250,0 [lab] — 5 baris, id 1 hilang karena inner (tidak punya riwayat). Grain adalah kontrak: tiap join harus bisa menjawab 'satu baris mewakili apa?' — bila jawabannya berubah tanpa disadari, analisis sesudahnya salah grain.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram join: tabel A id 1 sampai 6, tabel B id 2 sampai 7; inner 5, left 6, outer 7 baris">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Join pada kunci id</text>
<rect x="52" y="30" width="180" height="40" rx="6" fill="var(--c1)"/>
<text x="142.0" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tabel A (pelamar)</text>
<text x="142.0" y="64" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">id 1, 2, 3, 4, 5, 6 — 6 baris</text>
<rect x="248" y="30" width="180" height="40" rx="6" fill="var(--c2)"/>
<text x="338.0" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tabel B (pembayaran)</text>
<text x="338.0" y="64" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">id 2, 3, 4, 5, 6, 7 — 6 baris</text>
<rect x="52" y="100" width="120" height="56" rx="6" fill="var(--c1)"/>
<text x="112.0" y="120" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">inner: 5</text>
<text x="112.0" y="138" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">id 2–6</text>
<rect x="180" y="100" width="120" height="56" rx="6" fill="var(--c2)"/>
<text x="240.0" y="120" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">left: 6</text>
<text x="240.0" y="138" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">id 1–6 · id 1 NaN</text>
<rect x="308" y="100" width="120" height="56" rx="6" fill="var(--c4)"/>
<text x="368.0" y="120" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">outer: 7</text>
<text x="368.0" y="138" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">id 1–7</text>
<text x="240.0" y="186" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">inner membuang id 1 dan 7 · left mempertahankan A · outer mempertahankan semua</text>
<text x="240.0" y="206" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">verifikasi: inner 5, left 6, outer 7 — bila tidak cocok, join salah</text>
</svg>`,
        alt: "Diagram join: tabel A id 1 sampai 6, tabel B id 2 sampai 7; inner 5, left 6, outer 7 baris.",
        caption: "Cara membaca: atas dua tabel sumber dengan kunci id; bawah tiga hasil join dengan jumlah barisnya. Interpretasi: inner kehilangan id 1 (pelamar tanpa riwayat) — kehilangan yang harus disadari, bukan kecelakaan.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: join tidak pernah mengubah jumlah baris",
        type: "pitfall",
        body: "Yang benar: join mengubah jumlah baris ke tiga arah — inner menguranginya (5 dari 6), left mempertahankannya (6), outer menambahnya (7), dan kunci yang duplikat bisa menggandakannya tanpa peringatan. Selalu hitung baris sebelum dan sesudah join.",
      },
    },
    {
      id: "encoding",
      eyebrow: "Langkah 5 · Encoding",
      title: "Encoding: ordinal bila urutannya bermakna, one-hot bila tidak",
      prose: [
        "Model tidak membaca label — ia membaca angka. Encoding mengubah kategori menjadi angka, dan pilihan encoding-nya menentukan arti yang dibaca model. Salah encoding berarti model belajar urutan yang tidak ada.",
        "Nilai: MARRIAGE punya 3 kategori (1 menikah, 2 lajang, 3 lainnya) — one-hot menghasilkan 3 kolom baru (atau 2 bila drop first, untuk menghindari dummy trap: kolom ketiga bisa ditebak dari dua lainnya) [lab]. EDUCATION punya 4 kategori (1 graduate, 2 university, 3 high school, 4 others) — 1 sampai 3 berurutan (graduate lebih tinggi dari university), jadi ordinal boleh dipakai untuk 1–3, dengan catatan jarak antar-jenjang diasumsikan sama dan arah kode harus didokumentasikan; kategori 4 = others sebaiknya dipisah (indikator sendiri atau 'unknown'), bukan diberi peringkat 4.",
        "Baik atau buruk: one-hot baik untuk kategori nominal tanpa urutan (MARRIAGE, kota, pekerjaan) — tiap kategori jadi kolomnya sendiri dan model tidak mengira 'menikah lebih besar dari lajang'. One-hot buruk bila kategorinya ratusan — tabel meledak dan model kelaparan data. Ordinal baik bila urutannya bermakna (EDUCATION, rating, jenjang) — satu kolom menangkap urutannya. Ordinal buruk bila urutannya tidak ada — memberi kode 1, 2, 3 pada tiga kota berarti model mengira kota 3 'lebih besar' dari kota 1.",
        "Mitigasi: sebelum encoding, tanyakan 'apakah urutannya bermakna?' Bila ya, ordinal. Bila tidak, one-hot. Bila kategorinya terlalu banyak, kelompokkan dulu yang jarang (kategori di bawah 1 persen menjadi 'lainnya') baru one-hot. Dan dokumentasikan kamusnya — '1 = graduate' harus tertulis di tempat yang sama dengan code-nya, bukan di kepala analis.",
      ],
      formula: String.raw`\text{one-hot: } k \text{ kategori} \rightarrow k \text{ kolom (atau } k-1 \text{ bila drop first)}`,
      formulaNote: "One-hot: tiap kategori menjadi satu kolom biner (0/1). Drop first membuang satu kolom karena nilainya bisa ditebak dari kolom lain — menghindari dummy trap pada model linear.",
      tasks: [],
      note: {
        title: "Tip: cek kunci sebelum join",
        body: "Dua cek sebelum join apa pun: pertama, apakah ada kunci yang duplikat di tiap tabel? Kedua, apakah tipe kuncinya sama (string vs integer)? Dua cek 30 detik ini mencegah baris yang mengganda diam-diam dan join yang kosong karena tipe tidak cocok.",
      },
    },
    {
      id: "checklist",
      eyebrow: "Langkah 6 · Checklist analysis-ready",
      title: "Checklist raw ke analysis-ready",
      prose: [
        "Setelah reshape, join, dan encoding, jalankan checklist ini sebelum modelling — lima menit yang menghemat lima jam debugging:",
        "• Tipe: tiap kolom bertipe yang benar (int untuk hitungan, float untuk uang, string untuk label, datetime untuk tanggal)? Income yang masih string berarti L0.1 belum selesai.",
        "• Satuan: semua uang dalam satuan yang sama (juta, bukan campuran juta dan rupiah)? '1.700.000' yang belum diparsing adalah jebakan satuan.",
        "• Rentang: tiap kolom di dalam rentang yang masuk akal (PAY −2 sampai 8, EDUCATION 1 sampai 4, MARRIAGE 1 sampai 3)? Nilai di luar rentang adalah sinyal kode tak dikenal atau salah input.",
        "• Konsistensi: jumlah baris cocok dengan hitungan reshape dan join (18 long, inner 5, left 6, outer 7)? Total tagihan sebelum dan sesudah reshape sama?",
        "• Jejak: tiap keputusan cleaning, imputasi, dan encoding tercatat (metode, nilai, jumlah baris)? Bila tidak tercatat, ia tidak terjadi — setidaknya tidak bisa diaudit.",
        "Contoh checklist yang sudah jalan: notebook credit scoring cell 13 membuat fitur baru dari kolom mentah — PAY_MEAN (rata-rata keterlambatan 6 bulan), PAY_MAX (keterlambatan terburuk), PAY_DELAY_COUNT (jumlah bulan terlambat), UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL), PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, dan BILL_TREND. Itu adalah wrangling yang sebenarnya: bukan sekadar membersihkan, melainkan membentuk fitur yang dipakai model.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab 1 — Hitung baris tiga join",
      prose: [
        "Kerjakan tiga join pada tabel kecil: A (pelamar, id 1–6) dan B (pembayaran, id 2–7). Hitung inner, left, dan full outer — dan sebutkan id mana yang hilang atau tanpa pasangan di tiap hasil.",
        "Tiga tugas: hitung id hasil tiap join dengan operasi himpunan; sebutkan id yang hilang di inner dan id yang tanpa pembayaran di left; dan nyatakan relasi yang diharapkan (satu nasabah → banyak riwayat), join A dengan riwayat H, hitung perubahan baris, lalu agregasi kembali ke satu baris per nasabah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung inner (irisan), left (semua A), dan outer (gabungan) — berapa baris tiap hasil?" },
        { id: "t2", text: "Sebutkan id yang hilang di inner dan id yang tanpa pembayaran di left." },
        { id: "t3", text: "Nyatakan relasi yang diharapkan (satu nasabah → banyak riwayat), cek keunikan kunci di A dan H, join A dengan H (8 baris riwayat), hitung perubahan baris (6 → 8), lalu agregasi kembali ke 5 baris — satu per nasabah id 2–6." },
      ],
      expected: "inner: 5 baris (ids 2, 3, 4, 5, 6)\nleft: 6 baris (id 1 tanpa pembayaran)\nouter: 7 baris (ids 1, 2, 3, 4, 5, 6, 7)\njoin A dengan H: 8 baris (6 → 8)\nagregasi kembali: 5 baris (satu per nasabah id 2–6)\nrata-rata id 2: 150.0; id 3: 210.0; id 4: 100.0; id 5: 300.0; id 6: 250.0",
      code: {
        starter: `# Tabel A (pelamar) dan B (pembayaran) — id adalah kunci join.
A = [(1, "Andi"), (2, "Budi"), (3, "Cici"), (4, "Dewi"), (5, "Eko"), (6, "Fani")]
B = [(2, 120), (3, 150), (4, 180), (5, 200), (6, 210), (7, 230)]
a_ids = {r[0] for r in A}
b_ids = {r[0] for r in B}
inner = []  # TODO: id yang ada di A DAN B
left = []  # TODO: semua id A
outer = []  # TODO: id yang ada di A ATAU B
no_pay = []  # TODO: id A yang tidak ada di B
H = [(2, 120), (2, 150), (2, 180), (3, 200), (3, 220), (4, 100), (5, 300), (6, 250)]
joined = []  # TODO: join A dengan H — satu baris per (nasabah, riwayat)
n_joined = 0  # TODO: jumlah baris hasil join
agg = {}  # TODO: rata-rata pembayaran per nasabah (satu baris per nasabah)
n_agg = 0  # TODO: jumlah baris sesudah agregasi kembali
avg2 = 0.0  # TODO: rata-rata pembayaran id 2
avg3 = 0.0  # TODO: rata-rata pembayaran id 3
print(f"inner: {len(inner)} baris (ids {', '.join(str(i) for i in inner)})")
print(f"left: {len(left)} baris (id {no_pay[0]} tanpa pembayaran)")
print(f"outer: {len(outer)} baris (ids {', '.join(str(i) for i in outer)})")
print(f"join A dengan H: {n_joined} baris (6 → {n_joined})")
print(f"agregasi kembali: {n_agg} baris (satu per nasabah id 2–6)")
print(f"rata-rata id 2: {avg2:.1f}; id 3: {avg3:.1f}; id 4: {agg[4]:.1f}; id 5: {agg[5]:.1f}; id 6: {agg[6]:.1f}")`,
        lockLines: 5,
        solution: `# Tabel A (pelamar) dan B (pembayaran) — id adalah kunci join.
A = [(1, "Andi"), (2, "Budi"), (3, "Cici"), (4, "Dewi"), (5, "Eko"), (6, "Fani")]
B = [(2, 120), (3, 150), (4, 180), (5, 200), (6, 210), (7, 230)]
a_ids = {r[0] for r in A}
b_ids = {r[0] for r in B}
inner = sorted(a_ids & b_ids)
left = sorted(a_ids)
outer = sorted(a_ids | b_ids)
no_pay = sorted(a_ids - b_ids)
H = [(2, 120), (2, 150), (2, 180), (3, 200), (3, 220), (4, 100), (5, 300), (6, 250)]
joined = [(a, h) for a in A for h in H if a[0] == h[0]]
n_joined = len(joined)
agg = {}
for i, v in H:
    agg.setdefault(i, []).append(v)
agg = {i: sum(vs) / len(vs) for i, vs in agg.items()}
n_agg = len(agg)
avg2 = agg[2]
avg3 = agg[3]
print(f"inner: {len(inner)} baris (ids {', '.join(str(i) for i in inner)})")
print(f"left: {len(left)} baris (id {no_pay[0]} tanpa pembayaran)")
print(f"outer: {len(outer)} baris (ids {', '.join(str(i) for i in outer)})")
print(f"join A dengan H: {n_joined} baris (6 → {n_joined})")
print(f"agregasi kembali: {n_agg} baris (satu per nasabah id 2–6)")
print(f"rata-rata id 2: {avg2:.1f}; id 3: {avg3:.1f}; id 4: {agg[4]:.1f}; id 5: {agg[5]:.1f}; id 6: {agg[6]:.1f}")`,
        checks: [
          { kind: "equal", task: "inner = [2, 3, 4, 5, 6]", value: [2, 3, 4, 5, 6], name: "inner", label: "`inner` seharusnya [2, 3, 4, 5, 6]", msg: "inner = [2, 3, 4, 5, 6]" },
          { kind: "equal", task: "left = [1, 2, 3, 4, 5, 6]", value: [1, 2, 3, 4, 5, 6], name: "left", label: "`left` seharusnya [1, 2, 3, 4, 5, 6]", msg: "left = [1, 2, 3, 4, 5, 6]" },
          { kind: "equal", task: "outer = [1, 2, 3, 4, 5, 6, 7]", value: [1, 2, 3, 4, 5, 6, 7], name: "outer", label: "`outer` seharusnya [1, 2, 3, 4, 5, 6, 7]", msg: "outer = [1, 2, 3, 4, 5, 6, 7]" },
          { kind: "equal", task: "join A dengan H = 8 baris", value: 8, name: "n_joined", label: "`n_joined` seharusnya 8", msg: "join A dengan H = 8 baris" },
          { kind: "equal", task: "agregasi kembali = 5 baris", value: 5, name: "n_agg", label: "`n_agg` seharusnya 5", msg: "agregasi kembali = 5 baris" },
          { kind: "equal", task: "rata-rata id 2 = 150,0", value: 150.0, tol: 0.1, name: "avg2", label: "`avg2` seharusnya 150.0", msg: "rata-rata id 2 = 150,0" },
          { kind: "equal", task: "rata-rata id 3 = 210,0", value: 210.0, tol: 0.1, name: "avg3", label: "`avg3` seharusnya 210.0", msg: "rata-rata id 3 = 210,0" },
          { kind: "stdout_matches", task: "laporan join lengkap tercetak", pattern: "inner: 5 baris \\(ids 2, 3, 4, 5, 6\\)\\nleft: 6 baris \\(id 1 tanpa pembayaran\\)\\nouter: 7 baris \\(ids 1, 2, 3, 4, 5, 6, 7\\)\\njoin A dengan H: 8 baris \\(6 → 8\\)\\nagregasi kembali: 5 baris \\(satu per nasabah id 2–6\\)\\nrata-rata id 2: 150.0; id 3: 210.0; id 4: 100.0; id 5: 300.0; id 6: 250.0", label: "Output menampilkan inner: 5 baris (ids 2, 3, 4, 5, 6)", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Inner adalah irisan himpunan: a_ids & b_ids. Outer adalah gabungan: a_ids | b_ids.",
        "Left adalah semua id A — urutkan dengan sorted() supaya tampil 1 sampai 6.",
        "Id tanpa pembayaran adalah selisih: a_ids - b_ids.",
        "Relasi yang diharapkan di sini one-to-many (satu nasabah, banyak riwayat) — id di H tidak unik, jadi join mengganda: 6 baris A menjadi 8 baris hasil.",
      ],
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab 2 — Reshape wide ke long dan one-hot",
      prose: [
        "Kerjakan reshape dan encoding: ubah tagihan wide (3 nasabah × 6 bulan) menjadi long (18 baris), verifikasi total tagihannya tidak berubah, lalu hitung kolom one-hot dan sebaran MARRIAGE pada 6 pelamar.",
        "Dua tugas: bangun daftar long dan verifikasi totalnya (3.990); hitung jumlah kolom one-hot MARRIAGE dan jumlah tiap kategori.",
      ],
      tasks: [
        { id: "t1", text: "Bangun tabel long dari tagihan wide — 18 baris — dan verifikasi total tagihan 3.990." },
        { id: "t2", text: "Hitung kolom one-hot MARRIAGE dan jumlah pelamar per kategori (1, 2, 3)." },
      ],
      expected: "baris long: 18\ntotal tagihan long: 3990\nkolom one-hot MARRIAGE: 3\nMARRIAGE=1: 2\nMARRIAGE=2: 3\nMARRIAGE=3: 1",
      code: {
        starter: `# Tagihan wide (ribu rupiah): 3 nasabah x 6 bulan.
wide = {
    "A": [100, 120, 110, 130, 140, 150],
    "B": [200, 210, 190, 220, 230, 240],
    "C": [300, 310, 320, 330, 340, 350],
}
marriage = [1, 2, 2, 3, 1, 2]  # 6 pelamar
long = []  # TODO: daftar (nasabah, bulan, tagihan) — 18 baris
total = 0  # TODO: total tagihan dari tabel long
n_long = 0  # TODO: jumlah baris long
n_cols = 0  # TODO: jumlah kolom one-hot MARRIAGE
c1 = 0  # TODO: jumlah MARRIAGE=1
c2 = 0  # TODO: jumlah MARRIAGE=2
c3 = 0  # TODO: jumlah MARRIAGE=3
print(f"baris long: {n_long}")
print(f"total tagihan long: {total}")
print(f"kolom one-hot MARRIAGE: {n_cols}")
print(f"MARRIAGE=1: {c1}")
print(f"MARRIAGE=2: {c2}")
print(f"MARRIAGE=3: {c3}")`,
        lockLines: 7,
        solution: `# Tagihan wide (ribu rupiah): 3 nasabah x 6 bulan.
wide = {
    "A": [100, 120, 110, 130, 140, 150],
    "B": [200, 210, 190, 220, 230, 240],
    "C": [300, 310, 320, 330, 340, 350],
}
marriage = [1, 2, 2, 3, 1, 2]  # 6 pelamar
long = []
for name, bills in wide.items():
    for m, v in enumerate(bills, start=1):
        long.append((name, m, v))
total = sum(r[2] for r in long)
n_long = len(long)
n_cols = len(set(marriage))
c1 = sum(1 for x in marriage if x == 1)
c2 = sum(1 for x in marriage if x == 2)
c3 = sum(1 for x in marriage if x == 3)
print(f"baris long: {n_long}")
print(f"total tagihan long: {total}")
print(f"kolom one-hot MARRIAGE: {n_cols}")
print(f"MARRIAGE=1: {c1}")
print(f"MARRIAGE=2: {c2}")
print(f"MARRIAGE=3: {c3}")`,
        checks: [
          { kind: "equal", task: "baris long = 18", value: 18, name: "n_long", label: "`n_long` seharusnya 18", msg: "baris long = 18" },
          { kind: "equal", task: "total tagihan long = 3990", value: 3990, name: "total", label: "`total` seharusnya 3990", msg: "total tagihan long = 3990" },
          { kind: "equal", task: "kolom one-hot = 3", value: 3, name: "n_cols", label: "`n_cols` seharusnya 3", msg: "kolom one-hot = 3" },
          { kind: "equal", task: "MARRIAGE=1 ada 2", value: 2, name: "c1", label: "`c1` seharusnya 2", msg: "MARRIAGE=1 ada 2" },
          { kind: "equal", task: "MARRIAGE=2 ada 3", value: 3, name: "c2", label: "`c2` seharusnya 3", msg: "MARRIAGE=2 ada 3" },
          { kind: "equal", task: "MARRIAGE=3 ada 1", value: 1, name: "c3", label: "`c3` seharusnya 1", msg: "MARRIAGE=3 ada 1" },
          { kind: "stdout_matches", task: "laporan lab lengkap tercetak", pattern: "baris long: 18\\ntotal tagihan long: 3990\\nkolom one-hot MARRIAGE: 3\\nMARRIAGE=1: 2\\nMARRIAGE=2: 3\\nMARRIAGE=3: 1", label: "Output menampilkan baris long: 18", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Long: untuk tiap nasabah, untuk tiap bulan (1 sampai 6), tambahkan satu baris (nama, bulan, nilai).",
        "Total tagihan long harus sama dengan total wide (3.990) — bila berbeda, ada nilai yang hilang.",
        "Kolom one-hot sama dengan jumlah kategori unik: len(set(marriage)).",
      ],
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan wrangling",
      prose: [
        "Tiga pertanyaan berurutan — bentuk, gabung, arti:",
        "• Bentuk: apakah tabelmu wide atau long? Wide untuk dibaca manusia; long untuk model dan agregasi. Hitungan baris sesudah reshape harus cocok (3 × 6 sama dengan 18).",
        "• Gabung: siapa populasimu? Hanya yang lengkap — inner. Semua pelamar — left (NaN adalah informasi). Audit siapa ada di mana — full outer. Dan selalu cek kunci dulu: duplikat dan tipe kunci.",
        "• Arti: apakah urutan kategorinya bermakna? Ya — ordinal (EDUCATION 1–3; kategori 4 = others dipisah). Tidak — one-hot (MARRIAGE, kota). Kategori terlalu banyak — kelompokkan yang jarang dulu, baru one-hot.",
        "• Checklist akhir sebelum modelling: tipe benar, satuan sama, rentang masuk akal, jumlah baris cocok, dan tiap keputusan tercatat.",
        "Koneksi ke modul berikutnya: wrangling adalah fondasi feature table — di M1, tabel analysis-ready dari lesson ini adalah input langsung pipeline ML (MLF1: framing → data → fitur); di M2, PAY_MEAN, PAY_DELAY_COUNT, dan BILL_MEAN dari cell 13 menjadi fitur scorecard, dan grain satu-baris-per-nasabah adalah syarat agar target (default) punya tepat satu baris per nasabah; di M3, join dengan data jaringan (graph) menambah fitur relasi; di M9, backtesting dan walk-forward bergantung pada time structure yang benar — grain waktu yang salah membuat backtest bocor. Peta lengkap L0 → M1–M9 ada di L0.5.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case — Fitur baru notebook credit scoring",
      prose: [
        "Notebook credit scoring cell 13 adalah contoh wrangling yang sebenarnya: dari 6 kolom PAY mentah (PAY_0 sampai PAY_6) dibuat tiga fitur baru — PAY_MEAN (rata-rata keterlambatan 6 bulan), PAY_MAX (keterlambatan terburuk), dan PAY_DELAY_COUNT (jumlah bulan terlambat). Dari BILL_AMT1 dan LIMIT_BAL dibuat UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL) — rasio pemakaian limit. UTILIZATION bisa negatif bila BILL_AMT1 negatif (saldo kredit), jadi namanya menyesatkan bila tidak dijelaskan. Ditambah PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, dan BILL_TREND.",
        "Perhatikan apa yang dilakukan notebook: ia tidak sekadar membersihkan — ia membentuk fitur yang dipakai model. PAY_DELAY_COUNT merangkum 6 kolom menjadi satu angka yang lebih stabil dan lebih mudah dibaca model daripada 6 kolom yang berkorelasi satu sama lain. UTILIZATION mengubah dua kolom mentah menjadi satu rasio yang bermakna bisnis.",
        "Dan perhatikan apa yang TIDAK dilakukan notebook: ia tidak menggabungkan tabel lain (datanya satu tabel), jadi tidak ada join — tapi bila kamu menggabungkan data aplikasi dengan data pembayaran, kuncinya adalah ID nasabah, dan cek pertama adalah duplikat kunci di kedua tabel.",
        "Gambar di bawah menunjukkan tiga tahap yang sama dari sisi grain: transaction-level (satu baris = satu transaksi; key-nya (nasabah, tanggal); belum ada agregasi) → customer-month (satu baris = satu nasabah-bulan; key-nya (nasabah, bulan); agregasi sum/mean per bulan) → customer-level feature table (satu baris = satu nasabah; key-nya nasabah; agregasi PAY_MEAN, PAY_DELAY_COUNT, BILL_MEAN dari cell 13). Dan satu aturan yang mengikat ketiganya: target (default Oktober 2005) TIDAK BOLEH dipakai sebagai fitur di tahap mana pun — ia baru dipakai sebagai label saat training. Memakai target untuk membentuk fitur adalah leakage (L0.2): fitur yang mengandung jawaban. PAY_MEAN merangkum 6 kolom PAY menjadi satu angka; PAY_DELAY_COUNT menghitung bulan terlambat; BILL_MEAN merangkum 6 kolom tagihan — ketiganya dihitung dari kolom mentah sebelum Oktober 2005, tanpa menyentuh kolom target.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Tiga tahap grain: transaction-level, customer-month, customer-level feature table">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tiga tahap: transaksi → nasabah-bulan → fitur nasabah</text>
<rect x="20" y="34" width="130" height="120" rx="6" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="85.0" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1 · transaction-level</text>
<rect x="30" y="44" width="110" height="18" fill="var(--c1)"/>
<text x="85.0" y="57" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · 3 Jan · 100</text>
<rect x="30" y="66" width="110" height="18" fill="var(--c2)"/>
<text x="85.0" y="79" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · 5 Jan · 50</text>
<rect x="30" y="88" width="110" height="18" fill="var(--c2)"/>
<text x="85.0" y="101" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · 8 Jan · 70</text>
<text x="85.0" y="140" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 baris = 1 transaksi</text>
<line x1="152" y1="94" x2="172" y2="94" stroke="var(--chart-text)" stroke-width="2"/>
<path d="M166 88 L176 94 L166 100" fill="none" stroke="var(--chart-text)" stroke-width="2"/>
<rect x="175" y="34" width="130" height="120" rx="6" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240.0" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2 · customer-month</text>
<rect x="185" y="44" width="110" height="18" fill="var(--c1)"/>
<text x="240.0" y="57" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · Jan · total 220</text>
<rect x="185" y="66" width="110" height="18" fill="var(--c2)"/>
<text x="240.0" y="79" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · Feb · total 310</text>
<rect x="185" y="88" width="110" height="18" fill="var(--c2)"/>
<text x="240.0" y="101" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">B · Jan · total 650</text>
<text x="240.0" y="140" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 baris = 1 nasabah-bulan</text>
<line x1="307" y1="94" x2="327" y2="94" stroke="var(--chart-text)" stroke-width="2"/>
<path d="M321 88 L331 94 L321 100" fill="none" stroke="var(--chart-text)" stroke-width="2"/>
<rect x="330" y="34" width="130" height="120" rx="6" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="395.0" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 · customer-level</text>
<rect x="340" y="44" width="110" height="18" fill="var(--c1)"/>
<text x="395.0" y="57" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · PAY_MEAN 0,8</text>
<rect x="340" y="66" width="110" height="18" fill="var(--c2)"/>
<text x="395.0" y="79" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · PAY_DELAY 1</text>
<rect x="340" y="88" width="110" height="18" fill="var(--c2)"/>
<text x="395.0" y="101" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A · BILL_MEAN 210</text>
<text x="395.0" y="140" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 baris = 1 nasabah</text>
<text x="240.0" y="180" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">satu baris mewakili: transaksi → nasabah-bulan → nasabah</text>
<text x="240.0" y="196" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">agregasi: tidak ada → sum/mean per bulan → PAY_MEAN, PAY_DELAY_COUNT, BILL_MEAN (cell 13)</text>
<text x="240.0" y="212" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">target (default Okt 2005) TIDAK BOLEH jadi fitur — baru dipakai sebagai label saat training</text>
<text x="240.0" y="228" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">nilai contoh [ilustrasi]; nama fitur dari cell 13 notebook</text>
</svg>`,
        alt: "Tiga tahap grain: transaction-level, customer-month, customer-level feature table.",
        caption: "Cara membaca: tiap kotak satu tahap dengan key-nya — (nasabah, tanggal), (nasabah, bulan), nasabah. Interpretasi: agregasi merangkum tahap sebelumnya (PAY_MEAN, PAY_DELAY_COUNT, BILL_MEAN dari cell 13); target tidak pernah dipakai sebagai fitur di tahap mana pun — itu leakage.",
      },
      tasks: [
        { id: "t1", text: "Jelaskan kenapa PAY_DELAY_COUNT lebih berguna untuk model daripada 6 kolom PAY mentah." },
        { id: "t2", text: "Jelaskan apa yang dicek pertama kali bila menggabungkan data aplikasi dengan data pembayaran." },
      ],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab — Wrangling 60 pengajuan sintetis",
      prose: [
        "Di Colab, kamu me-wrangling 60 pengajuan sintetis (seed 42): reshape riwayat 6 bulan dari wide ke long (60 × 6 sama dengan 360 baris), join data pelamar dengan data pembayaran (dengan satu id yang sengaja tidak punya pasangan — left vs inner), dan encoding MARRIAGE (one-hot) serta EDUCATION (ordinal) — dengan checks yang menegaskan tiap hitungan baris.",
        "Notebook ini juga meminta refleksi: kapan kamu memilih inner dan kapan left — dan apa yang hilang di tiap pilihan?",
        "Buka di Colab: https://colab.research.google.com/drive/14oNQnlZMo8HHynKs2r-Bh8klXm2hv62N",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint — 8 soal",
      prose: [
        "Delapan soal menutup lesson ini. Bila ada yang salah, kembali ke langkah yang dirujuk di 'why' — jawabannya ada di hitungan baris, bukan di hafalan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tagihan wide 3 nasabah × 6 bulan diubah ke long. Berapa baris hasilnya?",
          options: [
            { text: "6 baris", why: "Salah: 6 adalah jumlah bulan — bukan jumlah baris long.", correct: false },
            { text: "18 baris", why: "Benar: 3 × 6 sama dengan 18 — tiap nasabah-bulan menjadi satu baris.", correct: true },
            { text: "9 baris", why: "Salah: 9 adalah 3 + 6 — reshape mengalikan, bukan menambah.", correct: false },
            { text: "36 baris", why: "Salah: 36 adalah 6 × 6 — jumlah nasabahnya 3, bukan 6.", correct: false },
          ],
        },
        {
          q: "Tabel A id 1–6, tabel B id 2–7. Inner join menghasilkan?",
          options: [
            { text: "5 baris (id 2–6)", why: "Benar: hanya id yang ada di keduanya — id 1 dan 7 terbuang.", correct: true },
            { text: "6 baris (id 1–6)", why: "Salah: itu left join — inner hanya yang berpasangan.", correct: false },
            { text: "7 baris (id 1–7)", why: "Salah: itu full outer join.", correct: false },
            { text: "12 baris", why: "Salah: 12 adalah 6 + 6 — join bukan penjumlahan baris.", correct: false },
          ],
        },
        {
          q: "Left join A (id 1–6) dengan B (id 2–7). Apa yang terjadi pada id 1?",
          options: [
            { text: "Id 1 hilang", why: "Salah: left mempertahankan semua id A.", correct: false },
            { text: "Id 1 tetap ada, kolom pembayarannya NaN", why: "Benar: left mempertahankan A sepenuhnya — NaN di id 1 adalah informasi (belum ada riwayat).", correct: true },
            { text: "Id 1 terisi pembayaran id 2", why: "Salah: join tidak pernah meminjam nilai dari id lain.", correct: false },
            { text: "Id 1 terduplikasi", why: "Salah: duplikasi hanya terjadi bila kunci di B duplikat.", correct: false },
          ],
        },
        {
          q: "MARRIAGE punya 3 kategori. One-hot menghasilkan berapa kolom?",
          options: [
            { text: "1 kolom", why: "Salah: 1 kolom adalah ordinal — bukan one-hot.", correct: false },
            { text: "3 kolom (atau 2 bila drop first)", why: "Benar: tiap kategori menjadi satu kolom; drop first membuang satu karena bisa ditebak.", correct: true },
            { text: "9 kolom", why: "Salah: 9 adalah 3 × 3 — one-hot tidak mengalikan kategori dengan dirinya sendiri.", correct: false },
            { text: "0 kolom — MARRIAGE tidak bisa di-encoding", why: "Salah: MARRIAGE bisa di-encoding dengan one-hot.", correct: false },
          ],
        },
        {
          q: "EDUCATION 1 (graduate), 2 (university), 3 (high school), 4 (others). Encoding yang sah?",
          options: [
            { text: "One-hot — karena EDUCATION adalah kategori", why: "Sah, tetapi tidak memakai informasi urutan — trade-off yang valid, bukan kesalahan.", correct: false },
            { text: "Ordinal 1–3, dengan 4 (others) sebagai indikator sendiri", why: "Benar: 1–3 berurutan (graduate lebih tinggi dari university) — urutan itu informasi yang boleh dipakai model; kategori 4 = others bukan peringkat, jadi dipisah sebagai indikator sendiri.", correct: true },
            { text: "Label encoding acak — urutan tidak penting", why: "Salah: urutan EDUCATION bermakna — encoding acak merusaknya.", correct: false },
            { text: "Tidak di-encoding — biarkan sebagai string", why: "Salah: model tidak membaca string — harus di-encoding.", correct: false },
          ],
        },
        {
          q: "Kunci join (id) duplikat di tabel B — satu id muncul dua kali. Apa yang terjadi?",
          options: [
            { text: "Tidak ada — join mengabaikan duplikat", why: "Salah: join tidak mengabaikan duplikat.", correct: false },
            { text: "Baris A-nya mengganda (fan-out, bukan cartesian product) — 6 baris bisa menjadi lebih dari 6", why: "Benar: tiap baris A yang cocok dengan dua baris B menghasilkan dua baris hasil.", correct: true },
            { text: "Join gagal dengan error", why: "Salah: kebanyakan alat join tidak error — ia mengganda diam-diam.", correct: false },
            { text: "Baris duplikat terhapus otomatis", why: "Salah: tidak ada penghapusan otomatis — justru penggandaan.", correct: false },
          ],
        },
        {
          q: "A (6 pelamar) di-join dengan riwayat pembayaran H (8 baris: id 2 muncul 3 kali, id 3 muncul 2 kali). Berapa baris hasil join, dan apakah masih satu baris per nasabah?",
          options: [
            { text: "8 baris — bukan satu baris per nasabah lagi; satu baris = satu (nasabah, riwayat)", why: "Benar: id 2 mengganda 3 kali dan id 3 mengganda 2 kali (fan-out) — 6 baris A menjadi 8 baris hasil. Grain-nya berubah dari nasabah menjadi nasabah-riwayat; untuk kembali ke satu baris per nasabah, agregasi (misal rata-rata per nasabah).", correct: true },
            { text: "6 baris — join tidak mengubah jumlah baris", why: "Salah: join dengan kunci yang tidak unik menggandakan baris — 6 baris A menjadi 8.", correct: false },
            { text: "8 baris — dan itu masih satu baris per nasabah", why: "Salah: 8 baris untuk 6 nasabah berarti ada nasabah yang muncul lebih dari sekali — grain-nya bukan lagi per nasabah.", correct: false },
            { text: "14 baris — 6 + 8", why: "Salah: join bukan penjumlahan baris — hasilnya adalah pasangan yang cocok, 8 baris.", correct: false },
          ],
        },
        {
          q: "MARRIAGE di-one-hot menjadi 3 kolom. Pada model linear, kenapa membuang satu kolom (drop first) disarankan?",
          options: [
            { text: "Karena kolom ketiga bisa ditebak dari dua lainnya — ketiganya selalu berjumlah 1 (dummy trap / multikolinearitas sempurna)", why: "Benar: bila dua kolom 0, kolom ketiga pasti 1 — model linear tidak bisa membedakan kontribusi ketiganya dan koefisiennya menjadi tidak stabil.", correct: true },
            { text: "Karena 3 kolom terlalu banyak untuk model", why: "Salah: 3 kolom bukan masalah jumlah — masalahnya ketiganya saling menentukan.", correct: false },
            { text: "Karena MARRIAGE hanya punya 2 kategori yang bermakna", why: "Salah: MARRIAGE punya 3 kategori — ketiganya bermakna.", correct: false },
            { text: "Tidak perlu — drop first hanya untuk tree-based", why: "Salah: sebaliknya — tree-based tidak peduli dummy trap; model linear yang peduli.", correct: false },
          ],
        },
      ],
      summary: [
        "Reshape: wide untuk dibaca manusia, long untuk model — hitungan baris harus cocok (3 × 6 sama dengan 18; 30.000 × 6 sama dengan 180.000).",
        "Join: inner 5, left 6, outer 7 pada contoh A (1–6) dan B (2–7) — tiap pilihan membuang atau mempertahankan baris yang berbeda.",
        "Encoding: ordinal bila urutannya bermakna (EDUCATION), one-hot bila tidak (MARRIAGE).",
        "Sebelum join: cek duplikat kunci dan tipe kunci — kunci duplikat menggandakan baris diam-diam.",
        "Checklist analysis-ready: tipe, satuan, rentang, konsistensi jumlah baris, dan jejak keputusan.",
        "Wrangling yang sebenarnya membentuk fitur — PAY_DELAY_COUNT dan UTILIZATION di notebook adalah contohnya.",
        "Join mengubah grain — nyatakan relasi yang diharapkan sebelum join, dan agregasi kembali bila butuh satu baris per nasabah (A 6 baris join H 8 baris menjadi 8, agregasi kembali ke 5).",
        "Target tidak boleh jadi fitur di tahap wrangling mana pun — baru dipakai sebagai label saat training.",
      ],
      next: { label: "Lanjut ke L0.5 — A/B Testing", href: "/v2/learn/mlf-l05-ab-testing" },
    },
  ],
};
