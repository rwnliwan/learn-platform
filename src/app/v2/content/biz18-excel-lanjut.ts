import type { V2Lesson } from "../lib/types";

// ── Figure: waktu proses laporan mingguan vs ukuran data ──────────────────
const WAKTU_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang perbandingan waktu proses laporan: VLOOKUP manual vs model Power Pivot">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">30</text><text x="54" y="139">60</text>
<text x="54" y="99">90</text><text x="54" y="59">120 mnt</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="120" y="196" width="56" height="20" fill="var(--chart-text)" opacity="0.55"/>
<text x="148" y="188" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">8</text>
<text x="148" y="232" text-anchor="middle" fill="var(--text)">1 rb</text>
<rect x="120" y="208" width="56" height="8" fill="var(--c1)" opacity="0.9"/>
<text x="148" y="204" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">2</text>
<rect x="236" y="136" width="56" height="80" fill="var(--chart-text)" opacity="0.55"/>
<text x="264" y="128" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">35</text>
<text x="264" y="232" text-anchor="middle" fill="var(--text)">10 rb</text>
<rect x="236" y="204" width="56" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="264" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">4</text>
<rect x="352" y="56" width="56" height="160" fill="var(--chart-text)" opacity="0.55"/>
<text x="380" y="48" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">110</text>
<text x="380" y="232" text-anchor="middle" fill="var(--text)">50 rb</text>
<rect x="352" y="196" width="56" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="380" y="188" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">8</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="120" y="30">baris = jumlah baris data penjualan (ilustrasi waktu kerja analis)</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="120" y="240" width="12" height="12" fill="var(--chart-text)" opacity="0.55"/>
<text x="138" y="250" fill="var(--text)">VLOOKUP + copy-paste manual</text>
<rect x="300" y="240" width="12" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="318" y="250" fill="var(--text)">Power Pivot (refresh 1 klik)</text>
</g>
</svg>`;

const LAB_SETUP = `penjualan = [
    # (produk, kategori, qty, harga_jual, hpp)
    ("Kopi A", "Minuman", 120, 18000, 11000),
    ("Kopi B", "Minuman", 200, 15000, 9000),
    ("Teh C",  "Minuman", 150, 12000, 7000),
    ("Roti D", "Makanan", 300, 10000, 6000),
    ("Roti E", "Makanan", 80,  22000, 15000),
]
`;

export const biz18: V2Lesson = {
  slug: "biz18-excel-lanjut",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "Excel Tingkat Lanjut: Power Pivot untuk Analis — Berhenti Menempel, Mulai Memodelkan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Promo yang terlihat untung 31% ternyata boncos 4%",
      prose: [
        "Rina, analis di sebuah ritel regional, menyiapkan laporan margin mingguan: 18.000 baris transaksi, 6 sheet, VLOOKUP berantai untuk menarik harga jual dan HPP dari tabel referensi. Laporannya rapi, semua sel hijau, tidak ada satu pun #N/A. Direksi menyetujui promo besar-besaran untuk kategori Minuman karena marginnya dilaporkan 31% — sangat sehat.",
        "Tiga minggu kemudian tim finance menemukan kejanggalan: kategori Minuman justru merugi 4%. Akar masalahnya sepele sekaligus mengerikan — seminggu sebelum laporan dibuat, tim IT menambah satu kolom baru (\"diskon\") di tabel referensi harga. VLOOKUP Rina yang mengambil \"kolom ke-5\" (harga jual) diam-diam kini mengambil kolom ke-5 yang baru: diskon. Tidak ada error, tidak ada peringatan — formulanya tetap \"benar\" secara sintaks, tetapi salah secara makna. Satu pergeseran kolom meruntuhkan seluruh laporan tanpa suara.",
        "Twist-nya: kesalahan ini tidak bisa dicegah dengan \"lebih teliti\". Selama arsitekturnya adalah tempelan antar-sel (VLOOKUP ke nomor kolom), kerapuhan itu sistemik — ia hanya menunggu kolom bergeser, sheet di-rename, atau baris ter-sort. Solusinya bukan formula yang lebih pintar, melainkan cara berpikir yang berbeda: berhenti menempel data antar sel, mulai memodelkan data sebagai tabel-tabel yang berelasi. Itulah yang dilakukan Power Pivot — mesin model data relasional yang sudah ada di dalam Excel-mu, gratis, dan bisa menangani jutaan baris.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini masalah BI, bukan sekadar masalah Excel",
        type: "risk",
        body: "Keputusan promo, pricing, dan target penjualan di banyak perusahaan Indonesia masih lahir dari spreadsheet seperti milik Rina. Satu model yang rapuh = satu keputusan direksi yang salah arah. Analis senior dibedakan dari analis junior bukan oleh kecepatan membuat laporan, melainkan oleh seberapa tahan laporannya terhadap perubahan.",
      },
      reference: "Tempelan antar-sel (VLOOKUP ke nomor kolom) = rapuh secara sistemik. Model relasional = tahan terhadap perubahan struktur.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita promo yang boncos — sudah kamu baca. (2) Peta ini: tujuan dan rute. (3) Konsep: Power Pivot sebagai model data relasional — Si Arsitek. (4) Konsep: DAX measures — Si Kalkulator Kontekstual. (5) Konsep: Power Query — Si Tukang Bersih-bersih. (6) Lab: bangun measure anti-VLOOKUP dalam Python. (7) Chart: kapan tempelan manual kalah telak dari model. (8) Peta keputusan: Excel biasa vs Power Pivot vs Power BI vs Python/SQL. (9) Mini-case: audit margin tiga kategori. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membangun model data di Power Pivot — tabel fakta penjualan berelasi ke tabel dimensi produk dan tanggal, bukan VLOOKUP; (2) menulis DAX measure esensial — SUM, SUMX, CALCULATE — dan menjelaskan kapan memakai calculated column vs measure; (3) memakai Power Query untuk ETL ringan yang bisa di-refresh satu klik; (4) memutuskan dengan argumen kapan Excel sudah cukup dan kapan harus naik kelas ke Power BI atau Python/SQL.",
        "Lesson ini mandiri — tidak ada prasyarat lesson lain. Dua bekal ringkas agar semua pembaca setara: pertama, kamu sudah bisa formula Excel dasar (SUM, AVERAGE, IF, VLOOKUP) — kalau VLOOKUP masih asing, intinya ia \"menarik nilai dari tabel lain berdasarkan kunci\"; kelemahannya ia menunjuk nomor kolom, bukan nama kolom. Kedua, kamu paham ide tabel baris-kolom dan konsep kunci unik (satu kode produk hanya muncul sekali di tabel produk) — itu fondasi relasi yang dipakai Power Pivot.",
        "Rutenya: cerita → peta → tiga konsep inti (model, DAX, Power Query) → lab → chart waktu → peta keputusan → mini-case → kuis. Estimasi 50 menit; lab-nya ±15 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bedakan dua pekerjaan — menyiapkan DATA (bersih, relasional, sekali saja) vs menjawab PERTANYAAN (hitung ini, potong per itu, berkali-kali). VLOOKUP mencampur keduanya di setiap sel; Power Pivot memisahkannya. Semua kerapuhan Rina berasal dari pencampuran itu.",
      ],
      reference: "Tujuan: model relasional + DAX measure + Power Query + keputusan naik kelas. Mandiri, tanpa prasyarat lesson lain.",
    },
    {
      id: "konsep-model",
      eyebrow: "Langkah 3 · Konsep",
      title: "Power Pivot — Si Arsitek (berhenti menempel, mulai memodelkan)",
      prose: [
        "Definisi: Power Pivot adalah add-in (kini bawaan) Excel yang menyimpan banyak tabel dalam satu model data relasional di memori — dengan relasi antar tabel, bukan formula antar sel. Kapasitasnya jutaan baris (melewati batas 1.048.576 baris sheet), dan kompresinya membuat file 40 MB menyusut drastis. Kamu mengimpor tabel penjualan (fakta), tabel produk (dimensi), tabel tanggal (dimensi), lalu menarik garis relasi: penjualan[kode_produk] → produk[kode_produk].",
        "Kepribadiannya: jika VLOOKUP adalah tukang tempel yang menempelkan fotokopian data ke setiap baris (dan fotokopinya basi saat sumber berubah), Power Pivot adalah arsitek yang membangun denah — tiap tabel punya tempat, tiap hubungan digambar sekali, dan denahnya tetap valid walau furnitur (kolom) digeser. Saat kolom \"diskon\" ditambahkan ke tabel produk, tidak ada yang pecah: relasi menunjuk nama kolom, bukan nomor kolom. Itulah perbedaan yang menyelamatkan Rina.",
        "Kapan memakai: saat datamu terdiri dari beberapa tabel yang harus digabung berulang-ulang (penjualan + produk + wilayah + tanggal), saat baris mendekati atau melewati ratusan ribu, atau saat laporan yang sama harus diulang tiap minggu/bulan. Tiga peran tabel dalam model: tabel FAKTA menyimpan kejadian yang bisa dijumlahkan (transaksi: qty, omzet) — biasanya panjang dan tumbuh tiap hari; tabel DIMENSI menyimpan atribut untuk memotong analisis (produk: kategori; tanggal: bulan) — biasanya pendek dan stabil; relasi 1-ke-banyak selalu dari dimensi (sisi \"1\") ke fakta (sisi \"banyak\").",
      ],
      formula: String.raw`\text{Total Omzet} = \sum_{i=1}^{n} \text{Harga}_i \times \text{Qty}_i`,
      formulaNote: "Ini logika di balik measure DAX SUMX — bukan sekadar SUM kolom. Simbol: n = jumlah baris transaksi dalam konteks filter aktif; Harga_i dan Qty_i = harga dan qty pada baris ke-i. Interpretasi: total omzet dihitung PER BARIS dulu (harga × qty), baru dijumlahkan — karena harga bisa berbeda tiap baris, menjumlah harga dulu lalu dikali total qty akan salah. Contoh angka: 2 baris — (Rp18.000 × 120) + (Rp15.000 × 200) = Rp2.160.000 + Rp3.000.000 = Rp5.160.000. Inilah kenapa SUMX ada: SUM tidak bisa mengalikan dua kolom per baris.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Power Pivot = PivotTable yang lebih besar”",
        type: "pitfall",
        body: "Yang benar: PivotTable adalah alat TAMPILAN (drag-and-drop agregasi dari satu tabel); Power Pivot adalah MESIN MODEL (banyak tabel + relasi + DAX). PivotTable bisa duduk di atas Power Pivot sebagai tampilannya — tetapi modelnya bisa melayani banyak PivotTable, banyak chart, banyak laporan sekaligus. Menyamakan keduanya seperti menyamakan etalase toko dengan gudangnya.",
      },
      hints: [
        "💡 Intuisi arsitek: sebelum menulis satu pun DAX, tanyakan “mana fakta, mana dimensi?”. Kalau jawabanmu “semuanya satu sheet raksasa”, berhentilah — pecah dulu menjadi tabel fakta + dimensi. 80% kerapuhan model berasal dari langkah yang dilewati ini.",
      ],
      reference: "Fakta = kejadian yang dijumlahkan (sisi banyak). Dimensi = atribut pemotong (sisi satu). Relasi menunjuk nama kolom, bukan nomor kolom.",
    },
    {
      id: "konsep-dax",
      eyebrow: "Langkah 4 · Konsep",
      title: "DAX Measures — Si Kalkulator Kontekstual",
      prose: [
        "Definisi: DAX (Data Analysis Expressions) adalah bahasa formula Power Pivot/Power BI. Unit terpentingnya adalah MEASURE — formula yang TIDAK menyimpan hasil di sel, melainkan menghitung ulang setiap kali ditanya, mengikuti konteks filter yang aktif (mis. measure yang sama menjawab berbeda untuk \"Minuman\" vs \"Makanan\", atau Januari vs Februari). Tiga measure fondasi: SUM(kolom) menjumlah satu kolom; SUMX(tabel, harga*qty) menjumlah ekspresi per baris; CALCULATE(ekspresi, filter) menghitung ekspresi dalam konteks filter yang dimodifikasi — mis. pangsa kategori = DIVIDE([Total Omzet], CALCULATE([Total Omzet], ALL(Produk))).",
        "Kepribadiannya: measure adalah kalkulator yang selalu bertanya balik “untuk konteks apa?” sebelum menjawab. Calculated column sebaliknya — ia seperti pegawai yang menulis jawaban di kertas dan menempelkannya ke tiap baris sekali saja (dihitung saat refresh, memakan memori, tidak responsif terhadap filter slicer). Analogi Rina: kolom tempelan VLOOKUP-nya adalah calculated column yang rapuh; measure adalah jawaban yang selalu segar karena dihitung dari sumbernya setiap kali ditanya.",
        "Kapan memakai: measure untuk SEMUA agregasi yang akan difilter/dipotong (total, rata-rata, margin, YoY) — inilah 95% kebutuhan analis. Calculated column hanya untuk atribut baris yang statis (mis. kategori harga dari harga satuan) dan jarang berubah. Aturan praktis: kalau hasilnya harus berubah saat user mengklik slicer → measure; kalau nilainya tetap per baris apa pun filternya → boleh column.",
      ],
      formula: String.raw`\text{Margin} = \frac{\sum (\text{Harga}_i - \text{HPP}_i)\times \text{Qty}_i}{\sum \text{Harga}_i \times \text{Qty}_i}`,
      formulaNote: "Simbol: Harga_i = harga jual baris ke-i, HPP_i = harga pokok baris ke-i, Qty_i = kuantitas baris ke-i; penjumlahan mengikuti konteks filter aktif (mis. hanya kategori Minuman). Interpretasi: margin = total laba kotor dibagi total omzet — keduanya dihitung per baris dulu (karena HPP berbeda per produk), baru dibagi. Contoh angka lab: total laba = (18.000−11.000)×120 + (15.000−9.000)×200 + (12.000−7.000)×150 + (10.000−6.000)×300 + (22.000−15.000)×80 = 840.000+1.200.000+750.000+1.200.000+560.000 = Rp4.550.000; total omzet = Rp11.720.000; margin = 38,82%. Jebakan klasik: menghitung margin dari rata-rata harga (salah) alih-alih dari total (benar).",
      tasks: [],
      note: {
        title: "🚨 Mitos: “DAX = formula Excel biasa, tinggal copy-paste”",
        type: "pitfall",
        body: "Yang benar: sintaksnya mirip (SUM, IF, DIVIDE) tetapi SEMANTIKNYA beda total — DAX berpikir dalam konteks filter dan relasi, bukan alamat sel. SUM(Penjualan[Harga]) tanpa konteks filter menjumlah SELURUH tabel; di Excel, SUM menunjuk range eksplisit. Analis yang copy-paste pola pikir sel ke DAX akan bingung kenapa angkanya \"berubah-ubah\" — padahal itulah fitur utamanya: konteks.",
      },
      hints: [
        "💡 Intuisi konteks: hafalkan kalimat “measure tidak punya jawaban — ia punya cara menjawab”. Setiap kali menulis DAX, uji dengan dua pertanyaan: “kalau difilter satu kategori, apa yang terjadi?” dan “kalau tidak difilter sama sekali, apa yang terjadi?”. Dua uji itu menangkap 90% bug DAX pemula.",
      ],
      reference: "Measure = hitung saat ditanya, responsif filter. Column = hitung saat refresh, statis per baris. Agregasi → measure, selalu.",
    },
    {
      id: "konsep-powerquery",
      eyebrow: "Langkah 5 · Konsep",
      title: "Power Query — Si Tukang Bersih-bersih yang Bisa Disuruh Ulang",
      prose: [
        "Definisi: Power Query adalah mesin ETL (Extract-Transform-Load) di dalam Excel/Power BI: ia merekam setiap langkah pembersihan sebagai resep berurutan (ambil file → buang baris kosong → ubah tipe → pivot kolom → gabung tabel) dalam bahasa M. Kuncinya: resepnya TERSIMPAN dan bisa di-JALANKAN ULANG satu klik (Refresh) saat file sumber diperbarui — tidak perlu mengulang copy-paste-filter manual.",
        "Kepribadiannya: jika cara manual adalah mencuci piring dengan tangan setiap kali makan (dan kadang ada piring yang terlewat), Power Query adalah mesin pencuci piring yang diprogram sekali — kamu susun urutan kerjanya satu kali, lalu setiap ada piring kotor baru (data bulan baru) tinggal tekan tombol. Rina versi Power Query: langkah “ambil tabel referensi → cocokkan kode_produk” direkam sekali; saat kolom \"diskon\" ditambahkan, langkahnya tetap menunjuk nama kolom — tidak pecah.",
        "Kapan memakai: setiap pekerjaan berulang — laporan mingguan/bulanan dari file yang strukturnya sama, gabungan banyak file CSV/Excel seformat, unpivot tabel crosstab menjadi format baris. Tiga langkah yang menyelesaikan 80% kasus: (1) ubah tipe data dengan benar di awal (tanggal sebagai tanggal, bukan teks); (2) unpivot kolom bulan menjadi baris (format crosstab → tabular); (3) merge berdasarkan kunci bernama, bukan posisi kolom. Catatan jujur: Power Query hebat untuk ETL ringan-menengah; untuk pipeline harian multi-sumber dengan orkestrasi dan testing, naiklah ke Python/SQL terjadwal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membersihkan data di SHEET (edit sel manual) lalu mengimpor hasilnya ke Power Pivot. Begitu file sumber diperbarui, semua edit manual hilang dan harus diulang. Aturan: JANGAN PERNAH menyentuh data sumber — semua transformasi direkam sebagai langkah Power Query. Data sumber itu read-only; resepnya yang versioned.",
      },
      hints: [
        "💡 Intuisi resep: anggap tiap langkah Power Query seperti baris resep masakan yang bisa dibaca orang lain setahun kemudian. Beri nama langkah yang jelas (\"Buang baris total\", bukan \"Filtered Rows1\"). Analis yang mewarisi file-mu akan berterima kasih — dan analis itu sering kali kamu sendiri 6 bulan kemudian.",
      ],
      reference: "Power Query = resep ETL yang bisa di-refresh. Data sumber read-only; transformasi sebagai langkah bernama.",
    },
    {
      id: "lab-measure",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun measure anti-VLOOKUP",
      prose: [
        "Waktunya praktik. Data penjualan lima produk sudah disiapkan (produk, kategori, qty, harga_jual, hpp). Tugasmu: tulis dua fungsi ala DAX measure — `total_omzet(data, kategori=None)` yang menjumlah harga×qty per baris (seperti SUMX) dan hanya untuk kategori tertentu bila diminta (seperti CALCULATE dengan filter), serta `margin(data, kategori=None)` yang memakai rumus margin dari Langkah 4.",
        "Coba: setelah lolos, panggil `margin(penjualan, \"Minuman\")` dan `margin(penjualan, \"Makanan\")` — kategori mana yang marginnya lebih tinggi, dan apakah itu berarti kategori tersebut “lebih baik”? Lalu ubah satu harga_jual di data dan jalankan ulang TANPA mengubah fungsi — inilah sifat measure: jawaban selalu segar dari sumbernya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `total_omzet` lalu isi `omzet_total = total_omzet(penjualan)`" },
        { id: "t2", text: "Lengkapi `margin` lalu isi `margin_total = margin(penjualan)`" },
        { id: "t3", text: "Jalankan dan pastikan tiga baris ringkasan tercetak dengan benar" },
      ],
      expected: "Total omzet: 11720000 | Margin Minuman: 0.4009 | Margin Makanan: 0.3697",
      code: {
        starter:
          LAB_SETUP +
          `
def total_omzet(data, kategori=None):
    total = 0
    for p, k, qty, harga, hpp in data:
        if kategori is None or k == kategori:
            total +=
    return total

def margin(data, kategori=None):
    laba = 0
    for p, k, qty, harga, hpp in data:
        if kategori is None or k == kategori:
            laba +=
    return laba / total_omzet(data, kategori)

omzet_total =
margin_total =

print("Total omzet:", omzet_total)
print("Margin Minuman:", round(margin(penjualan, "Minuman"), 4))
print("Margin Makanan:", round(margin(penjualan, "Makanan"), 4))`,
        lockLines: 8,
        solution:
          LAB_SETUP +
          `
def total_omzet(data, kategori=None):
    total = 0
    for p, k, qty, harga, hpp in data:
        if kategori is None or k == kategori:
            total += harga * qty
    return total

def margin(data, kategori=None):
    laba = 0
    for p, k, qty, harga, hpp in data:
        if kategori is None or k == kategori:
            laba += (harga - hpp) * qty
    return laba / total_omzet(data, kategori)

omzet_total = total_omzet(penjualan)
margin_total = margin(penjualan)

print("Total omzet:", omzet_total)
print("Margin Minuman:", round(margin(penjualan, "Minuman"), 4))
print("Margin Makanan:", round(margin(penjualan, "Makanan"), 4))`,
        checks: [
          { kind: "equal", task: "t1", name: "omzet_total", value: 11720000, tol: 1e-9, label: "`omzet_total` = 11.720.000", msg: "Jumlahkan harga*qty per baris: 2.160.000+3.000.000+1.800.000+3.000.000+1.760.000." },
          { kind: "equal", task: "t2", name: "margin_total", value: 0.3882, tol: 0.001, label: "`margin_total` ≈ 0,388", msg: "Total laba 4.550.000 / total omzet 11.720.000 ≈ 0,3882." },
          { kind: "stdout_matches", task: "t3", pattern: "Margin Minuman: 0\\.40", label: "Margin Minuman tercetak ±0,40", msg: "Filter kategori='Minuman' harus memotong tiga produk minuman saja." },
          { kind: "stdout_matches", task: "t3", pattern: "Margin Makanan: 0\\.37", label: "Margin Makanan tercetak ±0,37", msg: "Filter kategori='Makanan' harus memotong dua produk makanan saja." },
        ],
      },
      reference: "Measure = fungsi atas tabel + filter konteks. Ubah data → jawaban ikut berubah tanpa edit fungsi.",
    },
    {
      id: "chart-waktu",
      eyebrow: "Langkah 7 · Chart",
      title: "Kapan tempelan manual kalah telak",
      prose: [
        "Chart di bawah membandingkan waktu kerja analis untuk laporan mingguan yang sama pada tiga ukuran data: VLOOKUP + copy-paste manual vs model Power Pivot yang tinggal di-refresh.",
        "Cara membaca: sumbu Y = menit kerja analis per minggu; tiap kelompok batang = ukuran data (1 rb, 10 rb, 50 rb baris); batang abu-abu = cara manual, batang berwarna = Power Pivot. Angka di atas batang = menitnya.",
        "Interpretasi: pada 1.000 baris, bedanya belum dramatis (8 vs 2 menit) — di sinilah banyak analis bertahan dengan cara manual. Pada 10.000 baris, manual membengkak 4× lipat (35 menit) sementara model hanya naik ke 4 menit. Pada 50.000 baris, manual menelan hampir 2 jam (110 menit) vs 8 menit — dan itu BELUM termasuk waktu memperbaiki saat ada kolom bergeser seperti kasus Rina. Pelajaran chart: biaya cara manual tumbuh eksponensial terhadap ukuran dan kompleksitas, biaya model tumbuh hampir datar. Titik impasnya jauh lebih awal dari yang dikira kebanyakan orang — sekitar belasan ribu baris atau laporan yang diulang lebih dari 3×.",
      ],
      figure: {
        svg: WAKTU_SVG,
        alt: "Diagram batang: waktu proses laporan mingguan. Pada 1 rb baris: manual 8 mnt vs Power Pivot 2 mnt. 10 rb: 35 vs 4. 50 rb: 110 vs 8.",
        caption: "Waktu kerja analis per laporan mingguan (ilustrasi). Biaya cara manual tumbuh curam; biaya model hampir datar.",
      },
      tasks: [],
      reference: "Titik impas model vs manual: ~belasan ribu baris, atau laporan yang diulang >3×.",
      note: {
        title: "Intuisi: kenali garis pindah — kapan Excel berhenti jadi spreadsheet",
        body: "Excel yang baik tahu kapan harus berhenti jadi Excel. Praktisi spreadsheet senior punya \"garis pindah\" — ambang konkret saat workbook harus naik kelas ke Power BI atau database, bukan dipaksa terus. Garisnya: (1) baris mendekati 1 juta (batas sheet 1.048.576 bukan target, itu tembok); (2) file di atas 50 MB yang butuh lebih dari 2 menit sekadar dibuka; (3) tiga atau lebih sumber data yang di-refresh manual tiap minggu; (4) dua orang atau lebih mengedit bergantian lewat email (\"Laporan_Final_v7_REVISI_Direktur.xlsx\"). Kalau dua dari empat ini terpenuhi, kamu tidak punya spreadsheet — kamu punya pipeline rusak yang menyamar. Heuristik \"uji Senin pagi\": kalau membuka file + refresh + cek angka memakan lebih dari 15 menit setiap Senin, prosesnya sudah bangkrut secara ekonomi — 15 menit × 52 minggu × gajimu = harga tool yang proper berkali-kali lipat. Jebakan emosionalnya adalah sunk cost: \"tapi file ini sudah 3 tahun berjalan\". Tiga tahun berjalan TANPA bisa diaudit, TANPA kontrol versi, dan dengan satu orang sebagai single point of failure bukanlah stabilitas — itu risiko yang belum meledak. Aturan praktisnya: Power Pivot + Power Query adalah jembatan, bukan tujuan akhir. Mereka memperpanjang umur Excel dengan bermartabat — model relasional, refresh satu klik — tetapi saat garis pindah terlewati, pindahlah. Spreadsheet hebat yang tahu batasnya jauh lebih berharga daripada \"sistem\" Excel yang diam-diam menahan perusahaan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Excel biasa, Power Pivot, Power BI, atau Python/SQL?",
      prose: [
        "Lima skenario yang dihadapi analis setiap kuartal:",
        "Skenario 1 — Laporan ad-hoc sekali pakai, <10 ribu baris, satu tabel. → Excel biasa cukup. Alasan: biaya setup model tidak terbayar untuk pekerjaan sekali jalan; VLOOKUP/PIVOT biasa memadai.",
        "Skenario 2 — Laporan mingguan/bulanan berulang, multi-tabel, 10 ribu–1 juta baris. → Power Pivot + Power Query. Alasan: zona emas lesson ini — relasi sekali, refresh selamanya; kapasitas dan kompresi jauh di atas sheet biasa.",
        "Skenario 3 — Dashboard untuk 20+ orang, perlu akses browser/HP, refresh terjadwal, keamanan baris. → Power BI. Alasan: Power Pivot tidak punya layanan berbagi, scheduled refresh, dan RLS — Power BI adalah Power Pivot yang naik kelas ke server.",
        "Skenario 4 — Pipeline harian multi-sumber, testing, versioning kode, data >RAM Excel. → Python/SQL terjadwal. Alasan: kebutuhan rekayasa (orchestration, test, code review) melampaui kapabilitas resep klik-dan-seret.",
        "Skenario 5 — Sudah punya model Power Pivot yang bagus dan manajemen minta dashboard online. → JANGAN bangun ulang: impor model ke Power BI Desktop (atau publish via Power BI). Alasan: DAX dan modelnya portabel — kerja model tidak hilang saat naik kelas.",
        "Aturan praktis 10 detik: sekali pakai + kecil → Excel biasa; berulang + multi-tabel → Power Pivot; dishare + terjadwal → Power BI; pipeline + kode → Python/SQL. Dan ingat: measure yang kamu tulis di Power Pivot terbawa ke Power BI — investasinya tidak hangus.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memaksakan Power Pivot untuk SEMUA hal (“sudah terlanjur bisa”) atau menolaknya untuk SEMUA hal (“nanti saja belajar Power BI”). Keduanya mahal: yang pertama menghabiskan jam untuk pipeline yang seharusnya kode; yang kedua menghabiskan jam untuk copy-paste yang seharusnya model. Pilih alat per skenario, bukan per kebiasaan.",
      },
      reference: "Sekali+kecil → Excel; berulang+relasional → Power Pivot; share+jadwal → Power BI; pipeline+kode → Python/SQL.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Audit margin tiga kategori dalam 15 menit",
      prose: [
        "Skenario (sintetis, angka konkret): kamu mewarisi file laporan dari analis yang resign. Satu sheet \"Laporan\" berisi margin per kategori yang dihitung dengan VLOOKUP berantai ke sheet \"Ref_Harga\" dan \"Ref_HPP\". Angka yang tertulis: Minuman 31%, Makanan 42%, Total 38%. Sheet referensi terakhir diubah 2 minggu lalu oleh tim IT (\"penambahan kolom diskon\"). Direksi memakai angka ini untuk memutuskan alokasi budget promo kuartal depan.",
        "Pertanyaan analisis: (1) Tanpa membuka file-nya pun, apa hipotesis pertamamu tentang keandalan angka-angka itu — dan tes 2 menit apa yang membuktikannya? (2) Rancang ulang perhitungannya sebagai model: tabel apa saja, relasi apa, measure apa? (3) Setelah model jadi, uji apa yang kamu jalankan sebelum angka diserahkan ke direksi?",
        "Pembahasan: (1) Hipotesis: VLOOKUP menunjuk nomor kolom — penambahan kolom \"diskon\" kemungkinan menggeser kolom yang diambil, persis kasus Rina. Tes 2 menit: di sheet referensi, cek apakah kolom yang diambil VLOOKUP masih berisi yang seharusnya (mis. =INDEX/MATCH per nama kolom sebagai pembanding, atau lihat langsung header kolom ke-n yang dirujuk). (2) Model: tabel fakta Penjualan (kode_produk, qty, tanggal), dimensi Produk (kode_produk, kategori, harga, hpp — harga/hpp sebagai atribut, BUKAN kolom tempelan), dimensi Tanggal; relasi kode_produk dan tanggal; measure: Total Omzet = SUMX, Total Laba = SUMX((harga−hpp)×qty), Margin = DIVIDE(laba, omzet). (3) Uji sebelum serah: rekonsiliasi — total omzet model vs total dari sistem sumber (selisih harus nol); uji sensitivitas — filter satu kategori, pastikan measure berubah masuk akal; uji kerapuhan — tambah kolom dummy di tabel produk, refresh, pastikan tidak ada yang pecah. Analis senior menyerahkan angka beserta bukti ujinya, bukan angkanya saja.",
        "Kaitan ke karier: pewawancara BI sering bertanya “ceritakan laporan tersulit yang pernah kamu bangun”. Jawaban yang berkesan bukan “file 50 ribu baris”, melainkan “laporan yang tetap benar setelah tiga kali perubahan struktur sumber — karena saya memodelkannya, bukan menempelnya”.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Angka margin dipakai untuk alokasi budget promo — keputusan uang. Analis yang menyerahkan angka tanpa uji rekonsiliasi sedang mempertaruhkan uang perusahaan pada kerapuhan yang ia warisi. Standar profesional: tidak ada angka keputusan yang lolos tanpa (a) rekonsiliasi ke sumber, (b) jejak cara menghitungnya yang bisa di-refresh.",
      },
      reference: "Warisi file VLOOKUP → hipotesis kolom bergeser → bangun ulang sebagai model → rekonsiliasi sebelum serah.",
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
        "Power Pivot = model data relasional di dalam Excel (jutaan baris): tabel fakta berelasi ke tabel dimensi — relasi menunjuk nama kolom, bukan nomor kolom, sehingga tahan terhadap perubahan struktur.",
        "DAX measure (SUM, SUMX, CALCULATE) menghitung ulang mengikuti konteks filter; calculated column menyimpan hasil statis per baris — agregasi hampir selalu measure.",
        "SUMX ada karena total = jumlah per-baris (harga×qty), bukan jumlah kolom dikali jumlah kolom; margin = total laba / total omzet, dihitung dari total bukan dari rata-rata.",
        "Power Query = resep ETL yang bisa di-refresh satu klik; data sumber read-only, semua transformasi sebagai langkah bernama.",
        "Pilih alat per skenario: sekali+kecil → Excel biasa; berulang+relasional → Power Pivot; share+jadwal → Power BI; pipeline+kode → Python/SQL — dan model DAX terbawa saat naik ke Power BI.",
      ],
      quiz: [
        {
          q: "Akar masalah kasus Rina (margin 31% ternyata −4%) adalah…",
          options: [
            { text: "Arsitektur tempelan: VLOOKUP menunjuk nomor kolom sehingga penambahan kolom \"diskon\" menggeser data yang diambil tanpa peringatan", why: "Benar: tidak ada formula yang error — kerapuhannya sistemik. Selama rujukan memakai posisi kolom, setiap perubahan struktur sumber adalah bom waktu.", correct: true },
            { text: "Rina salah mengetik formula VLOOKUP", why: "Salah: formulanya \"benar\" secara sintaks dan tidak ada error. Justru itu yang berbahaya — kesalahan tak terlihat." },
            { text: "Data transaksinya memang salah dari sistem sumber", why: "Salah: data sumber baik-baik saja; yang rusak adalah cara menariknya ke laporan." },
            { text: "Excel tidak mampu menangani 18.000 baris", why: "Salah: 18.000 baris ringan untuk Excel. Masalahnya bukan kapasitas, melainkan arsitektur rujukan." },
          ],
        },
        {
          q: "Kapan memakai DAX measure dan kapan calculated column?",
          options: [
            { text: "Measure untuk agregasi yang harus responsif terhadap filter (total, margin, YoY); calculated column hanya untuk atribut statis per baris", why: "Benar: measure dihitung saat ditanya mengikuti konteks filter; column dihitung saat refresh dan memakan memori. Aturan: hasil harus berubah saat slicer diklik → measure.", correct: true },
            { text: "Selalu pakai calculated column karena hasilnya tersimpan dan lebih cepat", why: "Salah: tersimpan = memakan memori model dan TIDAK responsif terhadap filter. Untuk agregasi, ini pilihan yang salah." },
            { text: "Measure hanya untuk tabel kecil; tabel besar wajib calculated column", why: "Salah: justru tabel besar paling diuntungkan measure — tidak ada kolom hasil raksasa yang disimpan." },
            { text: "Keduanya identik, pilih yang sintaksnya lebih pendek", why: "Salah: semantiknya beda total — waktu hitung (saat ditanya vs saat refresh) dan perilaku terhadap filter." },
          ],
        },
        {
          q: "Total omzet yang benar dari data: harga bervariasi per baris. Formula yang tepat?",
          options: [
            { text: "SUMX(Penjualan, Penjualan[Harga] * Penjualan[Qty]) — kalikan per baris dulu, baru jumlahkan", why: "Benar: inilah alasan SUMX ada. Menjumlah harga dulu lalu dikali total qty hanya benar bila harga seragam — yang jarang terjadi.", correct: true },
            { text: "SUM(Penjualan[Harga]) * SUM(Penjualan[Qty])", why: "Salah: ini mengalikan total harga dengan total qty — salah secara matematis kecuali harga seragam di semua baris." },
            { text: "AVERAGE(Penjualan[Harga]) * SUM(Penjualan[Qty])", why: "Salah: rata-rata harga × total qty mengabaikan korelasi harga-qty per baris (produk mahal bisa laku sedikit). Hasilnya bias." },
            { text: "SUM(Penjualan[Harga] * Penjualan[Qty])", why: "Salah: SUM tidak mengevaluasi ekspresi per baris — ia butuh satu kolom. Inilah tepatnya peran SUMX sebagai iterator." },
          ],
        },
        {
          q: "Dalam model Power Pivot, relasi 1-ke-banyak yang benar adalah…",
          options: [
            { text: "Dari tabel dimensi (sisi \"1\", mis. Produk) ke tabel fakta (sisi \"banyak\", mis. Penjualan)", why: "Benar: satu produk muncul di banyak transaksi. Dimensi memegang kunci unik; fakta memegang kunci asing yang berulang.", correct: true },
            { text: "Dari tabel fakta ke tabel dimensi, agar agregasi mengalir ke atas", why: "Salah: arah relasi mengikuti kunci unik → kunci asing, yaitu dimensi → fakta. Dibalik, relasinya tidak valid." },
            { text: "Dua arah selalu, agar filter bekerja dua-duanya", why: "Salah: relasi dua arah (bidirectional) adalah pengecualian untuk kasus khusus — default yang benar adalah satu arah dimensi → fakta." },
            { text: "Tidak perlu relasi bila nama kolomnya sudah sama", why: "Salah: nama kolom yang sama tidak menciptakan relasi. Relasi harus didefinisikan eksplisit di model." },
          ],
        },
        {
          q: "Tim meminta dashboard online yang bisa dibuka 30 orang via browser dengan refresh terjadwal tiap pagi. Keputusan tepat?",
          options: [
            { text: "Naik ke Power BI (impor model Power Pivot yang sudah ada) — karena butuh layanan berbagi, scheduled refresh, dan akses browser yang tidak dimiliki Excel", why: "Benar: ini skenario 3 peta keputusan. Model dan DAX-nya portabel — kerja model tidak hilang, hanya naik kelas ke server.", correct: true },
            { text: "Tetap di Excel, file dishare via email tiap pagi", why: "Salah: email manual = versi berantakan, tidak ada refresh terjadwal, tidak ada kontrol akses — bom waktu operasional." },
            { text: "Bangun ulang dari nol di Python karena \"lebih modern\"", why: "Salah: membangun ulang yang sudah bekerja adalah pemborosan; kebutuhan di sini adalah sharing + scheduling, bukan rekayasa pipeline." },
            { text: "Power Pivot cukup — tinggal save di shared folder", why: "Salah: shared folder tidak memberi scheduled refresh, tampilan browser/HP, atau keamanan baris. Itu ranah Power BI Service." },
          ],
        },
      ],
    },
  ],
};
