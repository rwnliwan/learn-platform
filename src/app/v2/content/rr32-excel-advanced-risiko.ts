import type { V2Lesson } from "../lib/types";

const FIG_REKON = `<svg viewBox=\"0 0 560 360\" role=\"img\" aria-label=\"Alur rekonsiliasi dua sumber.\">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Alur rekonsiliasi: dua sumber → satu kebenaran</text>
<rect x=\"30\" y=\"70\" width=\"130\" height=\"60\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<text x=\"95\" y=\"95\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Laporan</text>
<text x=\"95\" y=\"112\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">(ke regulator)</text>
<rect x=\"30\" y=\"160\" width=\"130\" height=\"60\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.85\"/>
<text x=\"95\" y=\"185\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Buku besar</text>
<text x=\"95\" y=\"202\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">(GL)</text>
<rect x=\"230\" y=\"105\" width=\"130\" height=\"80\" rx=\"8\" fill=\"var(--c3)\" opacity=\"0.9\"/>
<text x=\"295\" y=\"132\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">XLOOKUP /</text>
<text x=\"295\" y=\"149\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">merge</text>
<text x=\"295\" y=\"166\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">per rekening</text>
<line x1=\"160\" y1=\"100\" x2=\"230\" y2=\"130\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"160\" y1=\"190\" x2=\"230\" y2=\"160\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<rect x=\"420\" y=\"105\" width=\"110\" height=\"80\" rx=\"8\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"475\" y=\"132\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Selisih &gt;</text>
<text x=\"475\" y=\"149\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">toleransi?</text>
<text x=\"475\" y=\"166\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">→ break report</text>
<line x1=\"360\" y1=\"145\" x2=\"420\" y2=\"145\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<text x=\"14\" y=\"240\" font-size=\"10\" fill=\"var(--chart-text)\">Kunci: kunci kecocokan = rekening; toleransi = ambang break; setiap break = pemilik + tenggat.</text>
<text x=\"14\" y=\"260\" font-size=\"10\" fill=\"var(--chart-text)\">Tanpa langkah ini, laporan risiko = dua angka yang belum tentu bicara hal yang sama.</text>
</g>
</svg>`;

export const rr32: V2Lesson = {
  slug: "rr32-excel-advanced-risiko",
  track: "Risk Reporting",
  module: "Otomasi Reporting",
  title: "RR32 — Excel Advanced untuk Risk Reporting",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "VLOOKUP yang mengambil kolom yang salah",
      prose: [
        "Kamis malam, analis pelaporan risiko Dimas lembur menyelesaikan laporan eksposur untuk komite risiko Jumat pagi. Rumusnya: VLOOKUP(kode_rekening; tabel_GL; 4; FALSE). Kolom ke-4. Ia tidak sadar tim IT menyisipkan satu kolom baru di tabel GL minggu lalu — kolom ke-4 kini adalah 'kode cabang', bukan 'nominal'. Laporan terkirim dengan 200 rekening menempel pada angka cabang. Tidak ada error. Tidak ada #N/A. Hanya angka yang salah dengan tenang.",
        "Komite baru sadar saat total eksposur 'turun' Rp2,1 triliun dalam seminggu tanpa satu pun transaksi besar. Dimas menghabiskan akhir pekan menelusuri 40 sheet. Akar masalahnya bukan kecerobohan Dimas — melainkan VLOOKUP yang merujuk kolom berdasarkan POSISI, bukan NAMA. Satu kolom disisipkan, seluruh laporan bergeser dalam diam.",
        "Twist-nya: Excel tidak rusak — ia melakukan persis yang diperintah. Laporan risiko yang dibangun di atas rujukan posisi kolom, angka hardcode, dan macro tanpa dokumentasi adalah bom waktu ber-schedule bulanan. Lesson ini mengajarkan teknik Excel yang tahan terhadap perubahan: XLOOKUP/INDEX-MATCH (rujuk nama, bukan posisi), PivotTable untuk rekonsiliasi, Power Query untuk ETL yang tercatat, dan disiplin audit formula.",
      ],
      tasks: [],
    },
    {
      id: "xlookup",
      eyebrow: "Langkah 2 · Konsep",
      title: "XLOOKUP: rujuk nama, bukan posisi",
      prose: [
        "XLOOKUP — Si Pencari Jujur: `=XLOOKUP(kode; tabel_GL[kode]; tabel_GL[nominal]; \"tidak ketemu\")`. Tiga keunggulan atas VLOOKUP: (1) merujuk KOLOM BERNAMA — sisipkan 10 kolom baru pun rumusnya tetap benar; (2) exact match adalah default (VLOOKUP default-nya approximate match — jebakan klasik); (3) bisa mencari ke kiri dan mengembalikan banyak kolom sekaligus. Cerita Dimas di atas tidak akan terjadi dengan XLOOKUP.",
        "INDEX-MATCH — Si Klasik Tangguh: `=INDEX(tabel_GL[nominal]; MATCH(kode; tabel_GL[kode]; 0))`. Kombinasi ini sudah tahan-sisip-sebelum XLOOKUP lahir, dan masih berguna di file yang harus dibuka di Excel versi lama. Intuisi: MATCH menemukan BARIS-nya ('kode ini di baris berapa?'), INDEX mengambil NILAI-nya ('di baris itu, kolom nominal berapa?'). Dua langkah eksplisit lebih mudah diaudit daripada satu VLOOKUP magis.",
        "Kapan memakai: setiap kali mengambil angka dari tabel lain di laporan risiko. Aturan keras: tidak ada lagi angka kolom (4, 7, 12) di rumus laporan — hanya nama kolom/tabel terstruktur.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai VLOOKUP dengan argumen ke-4 dikosongkan (= approximate match) untuk kode rekening. Approximate match butuh data terurut dan mengembalikan 'yang terdekat' — untuk kode rekening, 'terdekat' = rekening yang salah dengan percaya diri. Selalu tulis FALSE eksplisit, atau pindah ke XLOOKUP.",
      },
      reference: "Rujuk nama kolom, bukan posisi. Exact match selalu eksplisit.",
    },
    {
      id: "pivot-query",
      eyebrow: "Langkah 3 · Konsep",
      title: "PivotTable & Power Query: rekonsiliasi yang tercatat",
      prose: [
        "PivotTable — Si Tukang Rekap: tarik `kategori` ke Rows, `selisih` ke Values (Sum). Dalam 10 detik terlihat kategori mana yang break — tanpa satu pun rumus SUMIF yang bisa salah ketik range-nya. Untuk rekonsiliasi dua sumber (laporan vs GL), pivot per kategori adalah 'meja bedah'-nya: total per kategori langsung menunjuk ke mana selisih bersembunyi.",
        "Power Query — Si Asisten yang Mencatat: ETL di dalam Excel (ambil data → transformasi → muat) di mana SETIAP langkah tercatat sebagai query yang bisa di-replay. Beda dengan macro VBA: macro adalah kotak hitam ('tombol ajaib yang tidak boleh disentuh'), Power Query adalah resep yang bisa dibaca. Untuk laporan risiko bulanan yang berulang, Power Query mengubah 'kerjaan 3 hari tiap bulan' menjadi 'klik refresh'.",
        "Kontrol versi & audit formula — Si Saksi: (1) tidak ada angka hardcode di sel rumus (semua asumsi di sheet 'Asumsi' bernama); (2) sheet dilindungi kecuali sel input; (3) file berversi (v1.0, v1.1…) dengan changelog satu baris; (4) sebelum kirim: Trace Precedents untuk 5 angka terbesar di laporan. Laporan tanpa jejak audit = opini tanpa bukti.",
      ],
      formula: String.raw`\text{Selisih} = |\text{Nominal}_{\text{laporan}} - \text{Nominal}_{\text{GL}}| \qquad \text{Break} \iff \text{Selisih} > \text{toleransi}`,
      formulaNote: "Selisih = nilai absolut perbedaan per rekening antara dua sumber; toleransi = ambang materialitas (mis. Rp5 juta); break = selisih yang wajib dijelaskan dengan pemilik & tenggat — bukan sekadar dicatat.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun 'template sakti' Excel yang hanya bisa dijalankan satu orang ('tanya Dimas kalau error'). Laporan risiko yang bergantung pada satu manusia = single point of failure. Standarnya: orang lain harus bisa menjalankan ulang laporan dari file + satu halaman instruksi, tanpa menelepon siapa pun.",
      },
      reference: "Pivot = meja bedah rekonsiliasi; Power Query = resep tercatat; audit = jejak bukti.",
    },
    {
      id: "figure-rekon",
      eyebrow: "Langkah 4 · Visual",
      title: "Peta alur rekonsiliasi dua sumber",
      prose: [
        "Cara membaca: dua kotak kiri = dua sumber (laporan & GL); kotak tengah = pencocokan per rekening (XLOOKUP/merge); kotak kanan = uji toleransi → break report. Interpretasi: rekonsiliasi BUKAN 'membandingkan total' — total yang sama bisa menyembunyikan dua kesalahan yang saling menghapus. Rekonsiliasi yang benar selalu di level butir (rekening), lalu diagregasi.",
        "Perhatikan panah: tidak ada jalan pintas dari sumber langsung ke break report. Setiap break harus bisa ditelusuri mundur: break → rekening → dua angka sumber → siapa yang bertanggung jawab. Itulah 'jejak audit' dalam bentuk diagram.",
      ],
      figure: {
        svg: FIG_REKON,
        alt: "Alur: laporan & GL → XLOOKUP/merge per rekening → uji toleransi → break report.",
        caption: "Cara membaca: kiri = dua sumber; tengah = cocokkan per rekening; kanan = uji toleransi. Interpretasi: rekonsiliasi di level butir, bukan total — total sama bisa menyembunyikan dua kesalahan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Rekonsiliasi hanya di level total ('totalnya sama, berarti cocok'). Dua rekening bisa salah berlawanan arah (+25 dan −25) dan total tetap nol. Inilah kenapa selisih wajib dihitung per rekening DULU sebelum agregasi — prinsip yang sama berlaku di Excel.",
      },
      reference: "Rekonsiliasi di level butir; total hanya pintu masuk.",
    },
    {
      id: "lab-xlookup",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: replika XLOOKUP + pivot rekonsiliasi",
      prose: [
        "Replikasikan logika XLOOKUP + PivotTable memakai pandas: dua DataFrame (`laporan` dan `gl`) berisi rekening, kategori, dan nominal (juta Rp). Tugas: (t1) `merge` keduanya pada `rekening` (analog XLOOKUP exact-match) dan hitung kolom `selisih` (absolut); (t2) buat `pivot_selisih` = jumlah selisih per `kategori` (analog PivotTable) dan tentukan `selisih_aset`; (t3) tentukan `breaks` = kategori dengan selisih > TOLERANSI (5) dan cetak baris diawali `REKONSILIASI:`.",
        "Hasil yang benar: hanya KREDIT yang berselisih (25) → pivot kategori Aset = 25 → breaks = ['Aset']. Eksplorasi: ubah nominal_gl KREDIT menjadi 8500 — apa isi breaks? Tambah selisih 10 di DPK — kategori apa yang ikut break?",
      ],
      tasks: [
        { id: "t1", text: "Merge `laporan` & `gl` pada `rekening`; hitung kolom `selisih` (absolut)" },
        { id: "t2", text: "Buat `pivot_selisih` per kategori; hitung `selisih_aset`" },
        { id: "t3", text: "Tentukan `breaks` (selisih > TOLERANSI); cetak baris diawali `REKONSILIASI:`" },
      ],
      expected: "selisih_aset=25\nbreaks=['Aset']\nREKONSILIASI: kategori Aset selisih 25 di atas toleransi 5 — wajib dijelaskan",
      requires: ["pandas"],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Perhatikan `merge` memakai `on='rekening'` (NAMA kolom), bukan posisi kolom — persis keunggulan XLOOKUP atas VLOOKUP. Bila urutan kolom di `gl` diacak, hasil merge tetap benar; VLOOKUP berbasis posisi akan hancur. Inilah 'tahan sisip kolom' dalam bentuk kode.",
      },
      hints: [
        "hasil = laporan.merge(gl, on='rekening') — analog XLOOKUP exact-match.",
        "hasil['selisih'] = (hasil['nominal_lap'] - hasil['nominal_gl']).abs().",
        "pivot_selisih = hasil.groupby('kategori')['selisih'].sum().",
      ],
      code: {
        starter: "import pandas as pd\n\n# Dua sumber saldo (juta Rp) — JANGAN UBAH.\nlaporan = pd.DataFrame({\n    \"rekening\": [\"KAS\", \"KREDIT\", \"DPK\", \"MODAL\"],\n    \"kategori\": [\"Likuiditas\", \"Aset\", \"Dana\", \"Modal\"],\n    \"nominal_lap\": [1200, 8500, 9000, 1700],\n})\ngl = pd.DataFrame({\n    \"rekening\": [\"KAS\", \"KREDIT\", \"DPK\", \"MODAL\"],\n    \"nominal_gl\": [1200, 8475, 9000, 1700],\n})\nTOLERANSI = 5\n\n# TULIS KODEMU: XLOOKUP (merge), selisih, pivot per kategori, breaks\nhasil = \npivot_selisih = \nselisih_aset = \nbreaks = \nprint(f\"selisih_aset={selisih_aset}\")\nprint(f\"breaks={breaks}\")\nfor k in breaks:\n    print(f\"REKONSILIASI: kategori {k} selisih {int(pivot_selisih[k])} di atas toleransi {TOLERANSI} — wajib dijelaskan\")\n",
        lockLines: 14,
        solution: "import pandas as pd\n\n# Dua sumber saldo (juta Rp) — JANGAN UBAH.\nlaporan = pd.DataFrame({\n    \"rekening\": [\"KAS\", \"KREDIT\", \"DPK\", \"MODAL\"],\n    \"kategori\": [\"Likuiditas\", \"Aset\", \"Dana\", \"Modal\"],\n    \"nominal_lap\": [1200, 8500, 9000, 1700],\n})\ngl = pd.DataFrame({\n    \"rekening\": [\"KAS\", \"KREDIT\", \"DPK\", \"MODAL\"],\n    \"nominal_gl\": [1200, 8475, 9000, 1700],\n})\nTOLERANSI = 5\n\n# TULIS KODEMU: XLOOKUP (merge), selisih, pivot per kategori, breaks\nhasil = laporan.merge(gl, on=\"rekening\")\nhasil[\"selisih\"] = (hasil[\"nominal_lap\"] - hasil[\"nominal_gl\"]).abs()\npivot_selisih = hasil.groupby(\"kategori\")[\"selisih\"].sum()\nselisih_aset = int(pivot_selisih[\"Aset\"])\nbreaks = pivot_selisih[pivot_selisih > TOLERANSI].index.tolist()\nprint(f\"selisih_aset={selisih_aset}\")\nprint(f\"breaks={breaks}\")\nfor k in breaks:\n    print(f\"REKONSILIASI: kategori {k} selisih {int(pivot_selisih[k])} di atas toleransi {TOLERANSI} — wajib dijelaskan\")\n",
        checks: [
          { kind: "equal", task: "t2", name: "selisih_aset", value: 25, label: "selisih_aset = 25", msg: "|8500 − 8475| = 25; kategori lain 0." },
          { kind: "equal", task: "t3", name: "breaks", value: ["Aset"], label: "breaks = ['Aset']", msg: "Hanya Aset yang selisihnya (25) > toleransi 5." },
          { kind: "stdout_matches", task: "t3", label: "Baris REKONSILIASI tercetak", msg: "Baris laporan harus diawali persis 'REKONSILIASI:'.", pattern: "REKONSILIASI:" },
          { kind: "uses", task: "t1", label: "Memakai merge (XLOOKUP analog)", msg: "Pencocokan memakai nama kolom, bukan posisi.", token: "merge" },
        ],
      },
      reference: "merge(on='rekening') = XLOOKUP; groupby = PivotTable.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan Excel cukup, kapan harus pindah",
      prose: [
        "Skenario satu — laporan bulanan < 100 ribu baris, logika stabil: EXCEL CUKUP. XLOOKUP + PivotTable + Power Query, dengan kontrol versi. Ini zona nyaman Excel — jangan pindah hanya karena 'ingin modern'.",
        "Skenario dua — data > 1 juta baris atau multi-file harian: PINDAH KE PYTHON/SQL. Excel mulai melambat, crash, dan 'angka kemarin berubah sendiri' karena recalculation parsial. pola yang sama berlaku di sini: logika yang sama, mesin yang lebih kuat.",
        "Skenario tiga — laporan butuh jejak audit regulator: EXCEL BISA, DENGAN SYARAT. Power Query (langkah tercatat) + sheet asumsi bernama + file berversi + Trace Precedents. Macro VBA tanpa dokumentasi = tidak bisa diaudit = tidak boleh untuk laporan regulator.",
        "Skenario empat — banyak analis mengedit file yang sama: PINDAH KE SISTEM TERPUSAT. Excel shared-workbook adalah kuburan versi: 'final_v3_Dimas_revisi_Sinta_FINAL.xlsx'. Solusinya: satu sumber (database) + laporan ter-generate, bukan file yang dioper.",
        "Aturan praktis 10 detik: (1) < 100rb baris & stabil → Excel; (2) > 1jt baris / harian → Python/SQL; (3) untuk regulator → Power Query + versi + jejak; (4) multi-editor → database, bukan file operan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Fanatisme tool: 'semua harus Python' atau 'Excel sudah cukup untuk semua'. Keduanya salah. Analis risiko yang baik memilih mesin dari ukuran & risiko pekerjaan — bukan dari gengsi tool. Excel yang terkontrol mengalahkan Python yang berantakan.",
      },
      reference: "Pilih mesin dari ukuran & risiko, bukan gengsi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Laporan eksposur Rp2,1 triliun yang 'turun' sendiri",
      prose: [
        "Kembali ke cerita Dimas: VLOOKUP kolom ke-4 mengambil 'kode cabang' sebagai 'nominal' untuk 200 rekening. Pertanyaan: (a) kenapa tidak ada error yang muncul? (b) kontrol apa yang akan menangkapnya SEBELUM terkirim? (c) bila file harus tetap Excel, apa perbaikan minimalnya?",
        "Pembahasan: (a) VLOOKUP dengan posisi kolom selalu 'berhasil' mengembalikan sesuatu — kode cabang adalah angka valid, jadi tidak ada #N/A. Inilah bahaya rujukan posisi: kegagalan yang sunyi. (b) Tiga lapis: (1) rekonsiliasi total vs GL (total akan janggal); (2) aturan 'tidak ada VLOOKUP tanpa FALSE / tanpa nama kolom'; (3) review sejawat 15 menit untuk 5 angka terbesar. (c) Perbaikan minimal: ganti semua VLOOKUP menjadi XLOOKUP dengan kolom bernama + kunci file dengan satu sheet 'Asumsi' + changelog versi. Tanpa itu, sisipan kolom berikutnya hanya soal waktu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan: kesalahan ini lolos KARENA tidak ada yang berteriak — bukan karena tidak ada yang salah. Desain laporan risiko yang baik membuat kesalahan BERTERIAK (error eksplisit, rekonsiliasi gagal, total janggal), bukan diam. 'Tidak ada error' bukanlah bukti 'tidak ada kesalahan'.",
      },
      reference: "Rancang agar kesalahan berteriak, bukan diam.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "XLOOKUP/INDEX-MATCH merujuk NAMA kolom — tahan terhadap sisipan kolom; VLOOKUP merujuk POSISI — bom waktu.",
        "PivotTable = meja bedah rekonsiliasi (agregasi per kategori tanpa rumus rapuh); Power Query = ETL yang tercatat & bisa di-replay.",
        "Rekonsiliasi selalu di level butir (rekening) dulu, baru agregasi — total sama bisa menyembunyikan dua kesalahan.",
        "Disiplin file: tanpa hardcode di rumus, sheet asumsi bernama, versi + changelog, Trace Precedents untuk angka terbesar.",
        "Pilih mesin dari ukuran & risiko: Excel (< 100rb baris), Python/SQL (besar/harian), database (multi-editor).",
      ],
      quiz: [
        {
          q: "Kolom baru disisipkan di tabel sumber. Rumus mana yang tetap benar?",
          options: [
            { text: "XLOOKUP dengan kolom bernama — tidak tergantung posisi", why: "Benar: rujukan nama kebal terhadap sisipan kolom.", correct: true },
            { text: "VLOOKUP(kode; tabel; 4; FALSE)", why: "Salah: angka 4 = posisi; sisipan kolom menggeser artinya." },
            { text: "VLOOKUP tanpa argumen ke-4", why: "Lebih buruk: approximate match + posisi = dua jebakan sekaligus." },
            { text: "Copy-paste value dari tabel sumber", why: "Memutus rujukan total — angka menjadi fosil yang tidak update." },
          ],
        },
        {
          q: "Dua rekening berselisih +25 dan −25; total selisih = 0. Kesimpulan yang benar?",
          options: [
            { text: "Tetap break dua-duanya — rekonsiliasi di level butir, total 0 menyembunyikan keduanya", why: "Benar: agregasi dulu = buta; butir dulu baru agregasi.", correct: true },
            { text: "Tidak ada break — totalnya nol", why: "Jebakan klasik: dua kesalahan berlawanan arah saling menghapus di total." },
            { text: "Hanya +25 yang break", why: "Keduanya menyimpang dari kebenaran; tanda tidak menghapus kewajiban menjelaskan." },
            { text: "Naikkan toleransi agar tidak break", why: "Mengakali ambang, bukan menyelesaikan selisih." },
          ],
        },
        {
          q: "Kenapa Power Query lebih baik dari macro VBA untuk laporan risiko bulanan?",
          options: [
            { text: "Setiap langkah tercatat & bisa di-replay — bisa diaudit", why: "Benar: transparansi = syarat laporan risiko; macro VBA biasanya kotak hitam.", correct: true },
            { text: "Power Query lebih cepat mengetik", why: "Bukan soal kecepatan mengetik — soal keterbacaan proses." },
            { text: "VBA tidak bisa dipakai di Excel modern", why: "Bisa dipakai; masalahnya bukan ketersediaan melainkan auditabilitas." },
            { text: "Power Query gratis sedangkan VBA berbayar", why: "Keduanya bagian dari Excel; bukan soal harga." },
          ],
        },
        {
          q: "File laporan diedit bergantian oleh 5 analis via email ('final_v3_..._FINAL.xlsx'). Masalah utamanya?",
          options: [
            { text: "Kuburan versi — tidak ada satu kebenaran; pindah ke sumber terpusat", why: "Benar: multi-editor butuh database + laporan ter-generate, bukan file operan.", correct: true },
            { text: "Nama file terlalu panjang", why: "Gejala, bukan penyakit: penyakitnya tidak ada sumber tunggal." },
            { text: "Email terlalu lambat", why: "Bukan soal kecepatan kirim — soal integritas versi." },
            { text: "Analisnya terlalu banyak", why: "Jumlah analis bukan masalah; arsitektur file-nya yang salah." },
          ],
        },
        {
          q: "Lab lesson ini: bila nominal_gl KREDIT diubah menjadi 8500 (sama dengan laporan), apa isi `breaks`?",
          options: [
            { text: "[] — tidak ada selisih di atas toleransi", why: "Benar: semua selisih 0; pivot semua kategori 0; tidak ada break.", correct: true },
            { text: "['Aset'] — tetap seperti semula", why: "Selisih Aset menjadi 0, di bawah toleransi 5." },
            { text: "['KREDIT'] — break di level rekening", why: "breaks dihitung di level kategori (pivot), bukan rekening." },
            { text: "Error — merge gagal", why: "Merge tetap berhasil; hanya selisihnya yang nol." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap lesson Excel 'di bawah level' analis risiko modern. Sebagian besar laporan risiko di industri masih hidup di Excel — menguasainya dengan disiplin audit justru pembeda yang langka. Yang kuno bukan tool-nya, melainkan cara pakainya yang tanpa kontrol.",
      },
      hints: [
        "Tiga serangkai Excel disiplin: rujuk nama (XLOOKUP), rekap tanpa rumus rapuh (Pivot), proses tercatat (Power Query).",
        "Ingat angka lab: hanya KREDIT berselisih 25 → breaks = ['Aset'].",
      ],
      reference: "Excel disiplin > Python berantakan.",
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
