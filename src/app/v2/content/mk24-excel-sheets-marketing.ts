import type { V2Lesson } from "../lib/types";

const FIG_PACING = `<svg viewBox="0 0 560 340" role="img" aria-label="Pacing budget: spend aktual vs target prorata.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Pacing budget: aktual vs target prorata (10 hari)</text>
<line x1="60" y1="290" x2="540" y2="290" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="290" x2="60" y2="40" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="14" y="295" font-size="9" fill="var(--chart-text)">0</text>
<text x="8" y="225" font-size="9" fill="var(--chart-text)">75jt</text>
<text x="8" y="155" font-size="9" fill="var(--chart-text)">150jt</text>
<text x="8" y="85" font-size="9" fill="var(--chart-text)">225jt</text>
<line x1="60" y1="220" x2="540" y2="220" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="150" x2="540" y2="150" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="80" x2="540" y2="80" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<polyline points="60,290 156,248 252,206 348,164 444,122 540,80" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="7,5"/>
<polyline points="60,290 156,232 252,180 348,120 444,72 540,30" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="444" cy="72" r="5" fill="var(--c1)"/>
<circle cx="540" cy="30" r="5" fill="var(--c1)"/>
<text x="300" y="60" font-size="10" fill="var(--c2)" font-weight="bold">- - target prorata</text>
<text x="300" y="78" font-size="10" fill="var(--c1)" font-weight="bold">— aktual (over-pacing)</text>
<text x="444" y="56" font-size="9" fill="var(--c1)" font-weight="bold">hari 8: 150% pacing</text>
<text x="120" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">H2</text>
<text x="216" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">H4</text>
<text x="312" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">H6</text>
<text x="408" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">H8</text>
<text x="500" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">H10</text>
</g>
</svg>`;

export const mk24: V2Lesson = {
  slug: "mk24-excel-sheets-marketing",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK24 — Excel & Google Sheets untuk Analis Marketing: Senjata Sehari-hari",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "ROAS 312% Dita yang membuat direksi bertepuk tangan — keliru",
      prose: [
        "Dita, analis marketing sebuah brand FMCG lokal, diminta direksi menghitung ROAS kampanye kuartal. Ia membuka Google Sheets, menulis =SUMIFS(revenue; kanal; \"Meta\") / =SUMIFS(spend; kanal; \"Meta\"), dan mendapat 312%. Slidenya cantik, direksi bertepuk tangan, budget Meta ditambah 50% kuartal berikutnya.",
        "Dua bulan kemudian finance komplain: revenue aktual tidak pernah setinggi itu. Audit menemukan penyebabnya: kolom revenue hasil export dari ads manager berformat TEKS (\"Rp 1.250.000\" — dengan 'Rp' dan titik), bukan angka. SUMIFS diam-diam MENGABAIKAN sel teks — ia menjumlah spend yang berupa angka penuh, tetapi revenue hanya dari baris-baris yang kebetulan sudah dibersihkan. ROAS sebenarnya: 118%. Budget Rp75 juta terlanjur dibakar di kanal yang 'terlihat' luar biasa.",
        "Twist-nya: spreadsheet yang rapi berbohong LEBIH meyakinkan daripada data mentah — karena kerapian memberi ilusi ketelitian. Tidak ada error merah, tidak ada #VALUE! — hanya angka yang salah dengan tenang. Lesson ini tentang Excel/Sheets sebagai senjata sehari-hari analis marketing: empat fungsi inti, tiga jebakan klasik, dan — yang terpenting — kapan spreadsheet cukup dan kapan ia harus digantikan SQL/BI. Karena 100% lowongan analis marketing menyebut Excel/Sheets berdampingan dengan SQL: keduanya bukan saingan, melainkan dua alat untuk dua ukuran masalah.",
      ],
      tasks: [],
      note: {
        title: "Konteks bisnis",
        type: "risk",
        body: "Data ITJobsWatch (6 bulan s.d. Okt 2026): 100% co-occurrence SQL + Power BI + Excel untuk role Marketing Data Analyst. Artinya: Excel bukan 'skill kuno yang akan mati' — ia adalah bahasa ibu analisis yang tetap dipakai untuk eksplorasi cepat, validasi, dan komunikasi dengan non-teknis.",
      },
      reference: "Kerapian spreadsheet ≠ kebenaran angka. Audit tipe data dulu.",
    },
    {
      id: "konsep-fungsi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat fungsi yang menutupi 80% kerja analis",
      prose: [
        "Satu — SUMIFS/COUNTIFS/AVERAGEIFS: agregasi bersyarat. =SUMIFS(spend; kanal; \"Meta\"; tgl; \">=2026-09-01\") menjawab 'berapa spend Meta bulan September' dalam satu sel. Ini adalah GROUP BY-nya spreadsheet — dan analis yang menguasainya jarang butuh pivot untuk pertanyaan sederhana.",
        "Dua — XLOOKUP (atau VLOOKUP dengan FALSE): mengambil nilai dari tabel lain. =XLOOKUP(kanal; tabel_owner[kanal]; tabel_owner[pemilik]) memetakan tiap kanal ke pemilik budgetnya. XLOOKUP mencari ke segala arah dan default exact match — dua kelemahan VLOOKUP yang selama ini jadi sumber bug.",
        "Tiga — Pivot table: ringkasan drag-and-drop. Baris = kanal, kolom = bulan, nilai = SUM(revenue) — pivot membangun tabel pivot lab langkah 6 dalam 30 detik, tanpa satu pun formula. Untuk eksplorasi ('coba potong per kanal, per minggu, per kampanye'), pivot mengalahkan formula manual 10 banding 1.",
        "Empat — Conditional formatting: radar visual. Atur sel pacing > 110% berwarna merah — masalah terlihat SEBELUM dibaca angkanya. Dashboard mini paling murah di dunia adalah satu kolom conditional formatting.",
        "Kepribadian konsep ini: spreadsheet adalah 'bengkel rumahan' analis — tidak semegah pabrik (warehouse), tetapi untuk memperbaiki satu sepeda (satu pertanyaan), bengkel rumahan lebih cepat daripada mengantre ke pabrik. Analis hebat tahu kapan memakai bengkel dan kapan memakai pabrik.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "VLOOKUP tanpa argumen ke-4 (atau =TRUE): Excel memakai approximate match — mencari nilai 'terdekat yang lebih kecil', bukan yang sama persis. Kanal 'Metaverse' bisa ter-match ke 'Meta'! Selalu tulis FALSE (atau pakai XLOOKUP yang default exact match). Satu argumen yang hilang = seluruh kolom salah diam-diam.",
      },
      reference: "SUMIFS + XLOOKUP + pivot + conditional formatting = 80% kerja harian.",
    },
    {
      id: "konsep-jebakan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga jebakan klasik: tanggal teks, persen ambigu, baris ganda",
      prose: [
        "Jebakan satu — tanggal sebagai teks. Export ads manager sering menulis tanggal sebagai teks (\"01/09/2026\") yang terlihat seperti tanggal tetapi tidak bisa difilter rentang. SUMIFS(tgl; \">=2026-09-01\") atas teks menghasilkan NOL — diam-diam. Diagnosis: =ISTEXT(A2) atau coba ubah format sel — bila tampilannya tidak berubah, itu teks. Obat: DATEVALUE / Text-to-Columns, SEKALI di awal, sebelum formula apa pun.",
        "Jebakan dua — persen vs poin persen. 'Konversi naik 2%' itu ambigu: dari 4% ke 6% = naik 2 POIN PERSEN = naik 50% secara relatif. Analis yang menulis 'naik 2%' di slide bisa dituduh melebih-lebihkan (bila maksudnya poin) atau meremehkan (bila maksudnya relatif). Aturan: selalu tulis keduanya — '+2 pp (dari 4% ke 6%; +50% relatif)'.",
        "Jebakan tiga — baris duplikat. Export yang di-join manual (misal data harian + data kampanye) bisa menggandakan baris — SUM(revenue) jadi 2× lipat. Ini kembaran fan-out dari lesson SQL kemarin, versi spreadsheet. Diagnosis: bandingkan COUNT baris vs COUNT DISTINCT id; bila beda, ada duplikat. Obat: Remove Duplicates SETELAH paham kenapa duplikatnya muncul — menghapus tanpa paham = menyembunyikan masalah sumber data.",
        "🚨 Mitos: 'Kalau tidak ada error merah, angkanya benar.' Yang benar: Excel hanya berteriak untuk kesalahan SINTAKS (#VALUE!, #N/A) — kesalahan LOGIKA (range salah, tipe data salah, duplikat) lolos tanpa suara. Audit manual (spot-check 5 baris dengan kalkulator) adalah satu-satunya alarm untuk kesalahan logika.",
      ],
      tasks: [],
      formula: String.raw`\text{pacing} = \frac{\text{spend kumulatif}}{\text{budget} \times \frac{\text{hari berlalu}}{\text{hari total}}}`,
      formulaNote: "pacing = spend kumulatif / (budget × hari berlalu / hari total). Interpretasi: pacing 100% = tepat jadwal; 150% = over-pacing (uang habis sebelum waktunya); 70% = under-pacing (peluang terbuang). Contoh: budget Rp300jt/30 hari, hari ke-12 spend Rp180jt → target prorata Rp120jt → pacing 150% → kurangi bid 30% atau kampanye mati di hari ke-20. Conditional formatting: >110% merah, 90–110% hijau, <90% kuning.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung pacing dari spend HARIAN vs target BULANAN tanpa prorata: 'spend hari ini Rp15jt, budget Rp300jt — masih jauh!' Padahal target harian = Rp10jt, jadi hari ini over 50%. Pacing selalu membandingkan kumulatif vs prorata — bukan harian vs total. Salah baca ini = sadar over-budget saat uang sudah habis.",
      },
      reference: "Tipe data dulu, persen ditulis lengkap, duplikat didiagnosis.",
    },
    {
      id: "konsep-kapan",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kapan spreadsheet cukup — dan kapan harus naik kelas",
      prose: [
        "Spreadsheet CUKUP bila: data < 100rb baris (satu file), analisis ad-hoc sekali pakai, satu-dua orang yang mengerjakan, dan tidak ada join multi-tabel yang rumit. Contoh: audit pacing mingguan, validasi angka dashboard, analisis post-mortem kampanye. Di zona ini spreadsheet adalah alat TERCEPAT — query SQL justru lebih lambat karena harus menunggu akses warehouse.",
        "Naik ke SQL bila: data > 1 juta baris (spreadsheet ngos-ngosan), butuh join 3+ tabel, analisis diulang tiap minggu (query bisa disimpan & dijadwalkan; spreadsheet harus di-refresh manual), atau banyak orang butuh angka yang sama (satu query = satu kebenaran; 5 file Excel = 5 versi kebenaran).",
        "Naik ke BI (Tableau/Power BI) bila: konsumennya banyak dan non-teknis (direksi tidak membuka spreadsheet), butuh refresh otomatis harian, atau butuh drill-down interaktif. Spreadsheet untuk analis, BI untuk organisasi.",
        "🚨 Mitos: 'Semua analisis serius harus di SQL/Python — spreadsheet itu amatir.' Yang benar: kematangan analis diukur dari MEMILIH alat yang tepat, bukan dari memakai alat yang paling canggih. Memaksa SQL untuk audit 500 baris = pamer, bukan profesional.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Tes 30 detik sebelum memilih alat: (1) berapa baris? (>100rb → pertimbangkan SQL); (2) berapa kali diulang? (>3× → otomatisasi/SQL); (3) berapa konsumen? (>3 orang → BI). Tiga jawaban ini menentukan alat dalam 30 detik — lebih cepat daripada debat 'Excel vs Python' yang tidak pernah selesai.",
      },
      reference: "Ad-hoc kecil → spreadsheet; berulang/besar → SQL; banyak konsumen → BI.",
    },
    {
      id: "visual-pacing",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca pacing: garis yang tidak boleh dilewati",
      prose: [
        "Diagram garis menunjukkan pacing budget 10 hari: garis putus-putus = target prorata (Rp30jt/hari dari budget Rp300jt), garis tegas = spend kumulatif aktual. Sejak hari ke-4, aktual mulai di atas target; di hari ke-8, pacing menyentuh 150% — titik di mana analis harus bertindak (tandai dengan lingkaran).",
        "Perhatikan: tanpa garis target, garis aktual terlihat 'naik dengan sehat' — naik terus = bagus, kan? Target prorata mengubah pembacaan total: yang terlihat sehat ternyata over-pacing. Inilah fungsi conditional formatting di spreadsheet: garis target adalah 'conditional formatting'-nya chart.",
      ],
      figure: {
        svg: FIG_PACING,
        alt: "Pacing budget: spend aktual vs target prorata.",
        caption: "Cara membaca: sumbu X = hari, sumbu Y = spend kumulatif; garis putus-putus = target prorata, garis tegas = aktual. Interpretasi: aktual menyalip target sejak hari ke-4 dan mencapai 150% di hari ke-8 — tanpa intervensi, budget habis di hari ke-20 dari 30 hari. Tindakan: turunkan bid/anggaran harian ~30% atau jeda kampanye termahal. Chart pacing yang baik SELALU punya garis target — garis aktual sendirian tidak bercerita.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Pacing dihitung dari spend GROSS tanpa memisahkan pajak/biaya platform (15-20% di beberapa kanal). Rp180jt spend gross = Rp153jt nett — pacing terlihat 150% padahal nett-nya 128%. Selalu definisikan dulu: pacing dihitung dari angka apa? Tulis definisinya di sel catatan — analis berikutnya akan berterima kasih.",
      },
      reference: "Garis aktual tanpa garis target tidak bercerita.",
    },
    {
      id: "lab-spreadsheet",
      eyebrow: "Langkah 6 · Lab",
      title: "Mereplikasi logika spreadsheet dalam Python",
      prose: [
        "Data: 9 baris (3 kanal × 3 hari) berisi tanggal, kanal, spend, klik, signup, revenue. Tugasmu mereplikasi empat fungsi spreadsheet: (t1) SUMIFS — total spend Meta bulan September; (t2) COUNTIFS — jumlah hari profitabel (revenue > spend) kanal TikTok; (t3) XLOOKUP — petakan kanal ke pemilik budget, hitung spend per pemilik, tentukan pemilik dengan spend terbesar; (t4) 'pivot table' — ringkasan per kanal (spend, revenue, ROAS) dan cetak. Di samping tiap tugas tertulis padanan formula Excel/Sheets-nya — lab ini melatih LOGIKA yang sama, dieksekusi di Python agar bisa dicek otomatis.",
        "Hasil yang benar: spend_meta = Rp6.000.000; hari_profit_tiktok = 3; owner_top = 'Tim Brand' (Rp9,6jt); ROAS Google = 4,67. Eksplorasi: tambah satu baris duplikat (copy baris pertama) lalu hitung ulang — berapa ROAS Meta sekarang? Itulah jebakan baris ganda dari langkah 3, dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "SUMIFS: total spend kanal Meta (tgl September) → spend_meta" },
        { id: "t2", text: "COUNTIFS: hari profitabel (revenue>spend) TikTok → hari_profit_tiktok" },
        { id: "t3", text: "XLOOKUP: kanal→pemilik budget; spend per pemilik → owner_top" },
        { id: "t4", text: "Pivot: ringkasan per kanal (spend, revenue, ROAS), lalu cetak" },
      ],
      expected: "spend_meta=6000000 hari_profit_tiktok=3 owner_top=Tim Brand roas_google=4.67",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Di Excel, =SUMIFS(spend; kanal; \"Meta\") atas kolom tanggal TEKS tetap jalan (ia tidak peduli tanggal) — tetapi =SUMIFS(spend; tgl; \">=2026-09-01\") atas teks menghasilkan NOL. Jebakan tanggal-teks hanya muncul saat kriteria melibatkan tanggal — tepat saat analis paling percaya diri karena 'kemarin formula yang sama jalan'.",
      },
      hints: [
        "t1: sum(r['spend'] for r in rows if r['kanal']=='Meta' and r['tgl'].startswith('2026-09')).",
        "t2: sum(1 for r in rows if r['kanal']=='TikTok' and r['revenue']>r['spend']).",
        "t3: owner = {'Meta':'Tim Brand','Google':'Tim Performance','TikTok':'Tim Brand'}; agregasi dict.",
        "t4: loop kanal unik; ROAS = revenue/spend; format :.2f.",
      ],
      code: {
        starter: "# DATA — JANGAN UBAH (replikasi tabel spreadsheet: 9 baris)\nrows = [\n    {\"tgl\": \"2026-09-01\", \"kanal\": \"Meta\", \"spend\": 2_000_000, \"klik\": 1200, \"signup\": 96, \"revenue\": 1_800_000},\n    {\"tgl\": \"2026-09-02\", \"kanal\": \"Meta\", \"spend\": 2_200_000, \"klik\": 1350, \"signup\": 108, \"revenue\": 2_000_000},\n    {\"tgl\": \"2026-09-03\", \"kanal\": \"Meta\", \"spend\": 1_800_000, \"klik\": 1100, \"signup\": 77, \"revenue\": 1_500_000},\n    {\"tgl\": \"2026-09-01\", \"kanal\": \"Google\", \"spend\": 1_000_000, \"klik\": 400, \"signup\": 120, \"revenue\": 4_800_000},\n    {\"tgl\": \"2026-09-02\", \"kanal\": \"Google\", \"spend\": 1_100_000, \"klik\": 440, \"signup\": 132, \"revenue\": 5_200_000},\n    {\"tgl\": \"2026-09-03\", \"kanal\": \"Google\", \"spend\": 900_000, \"klik\": 360, \"signup\": 99, \"revenue\": 4_000_000},\n    {\"tgl\": \"2026-09-01\", \"kanal\": \"TikTok\", \"spend\": 1_200_000, \"klik\": 2000, \"signup\": 100, \"revenue\": 1_500_000},\n    {\"tgl\": \"2026-09-02\", \"kanal\": \"TikTok\", \"spend\": 1_300_000, \"klik\": 2200, \"signup\": 110, \"revenue\": 1_400_000},\n    {\"tgl\": \"2026-09-03\", \"kanal\": \"TikTok\", \"spend\": 1_100_000, \"klik\": 1900, \"signup\": 95, \"revenue\": 1_200_000},\n]\n# Padanan Excel: t1 =SUMIFS | t2 =COUNTIFS | t3 =XLOOKUP | t4 = PivotTable\n\n# TULIS KODEMU\nspend_meta = \nhari_profit_tiktok = \nowner_top = \nroas_google = \n\nprint(f\"spend_meta={spend_meta} hari_profit_tiktok={hari_profit_tiktok} owner_top={owner_top} roas_google={roas_google:.2f}\")\n",
        lockLines: 13,
        solution: "# DATA — JANGAN UBAH (replikasi tabel spreadsheet: 9 baris)\nrows = [\n    {\"tgl\": \"2026-09-01\", \"kanal\": \"Meta\", \"spend\": 2_000_000, \"klik\": 1200, \"signup\": 96, \"revenue\": 1_800_000},\n    {\"tgl\": \"2026-09-02\", \"kanal\": \"Meta\", \"spend\": 2_200_000, \"klik\": 1350, \"signup\": 108, \"revenue\": 2_000_000},\n    {\"tgl\": \"2026-09-03\", \"kanal\": \"Meta\", \"spend\": 1_800_000, \"klik\": 1100, \"signup\": 77, \"revenue\": 1_500_000},\n    {\"tgl\": \"2026-09-01\", \"kanal\": \"Google\", \"spend\": 1_000_000, \"klik\": 400, \"signup\": 120, \"revenue\": 4_800_000},\n    {\"tgl\": \"2026-09-02\", \"kanal\": \"Google\", \"spend\": 1_100_000, \"klik\": 440, \"signup\": 132, \"revenue\": 5_200_000},\n    {\"tgl\": \"2026-09-03\", \"kanal\": \"Google\", \"spend\": 900_000, \"klik\": 360, \"signup\": 99, \"revenue\": 4_000_000},\n    {\"tgl\": \"2026-09-01\", \"kanal\": \"TikTok\", \"spend\": 1_200_000, \"klik\": 2000, \"signup\": 100, \"revenue\": 1_500_000},\n    {\"tgl\": \"2026-09-02\", \"kanal\": \"TikTok\", \"spend\": 1_300_000, \"klik\": 2200, \"signup\": 110, \"revenue\": 1_400_000},\n    {\"tgl\": \"2026-09-03\", \"kanal\": \"TikTok\", \"spend\": 1_100_000, \"klik\": 1900, \"signup\": 95, \"revenue\": 1_200_000},\n]\n# Padanan Excel: t1 =SUMIFS | t2 =COUNTIFS | t3 =XLOOKUP | t4 = PivotTable\n\n# TULIS KODEMU\nspend_meta = sum(r[\"spend\"] for r in rows if r[\"kanal\"] == \"Meta\" and r[\"tgl\"].startswith(\"2026-09\"))\nhari_profit_tiktok = sum(1 for r in rows if r[\"kanal\"] == \"TikTok\" and r[\"revenue\"] > r[\"spend\"])\nowner = {\"Meta\": \"Tim Brand\", \"Google\": \"Tim Performance\", \"TikTok\": \"Tim Brand\"}\nspend_owner = {}\nfor r in rows:\n    o = owner[r[\"kanal\"]]\n    spend_owner[o] = spend_owner.get(o, 0) + r[\"spend\"]\nowner_top = max(spend_owner, key=spend_owner.get)\nrev_g = sum(r[\"revenue\"] for r in rows if r[\"kanal\"] == \"Google\")\nspd_g = sum(r[\"spend\"] for r in rows if r[\"kanal\"] == \"Google\")\nroas_google = rev_g / spd_g\n\nprint(f\"spend_meta={spend_meta} hari_profit_tiktok={hari_profit_tiktok} owner_top={owner_top} roas_google={roas_google:.2f}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "spend_meta", value: 6000000, label: "spend_meta = Rp6.000.000", msg: "2,0 + 2,2 + 1,8 = 6,0 juta." },
          { kind: "equal", task: "t2", name: "hari_profit_tiktok", value: 3, label: "hari_profit_tiktok = 3", msg: "Ketiga hari TikTok revenue > spend." },
          { kind: "equal", task: "t3", name: "owner_top", value: "Tim Brand", label: "owner_top = Tim Brand", msg: "Tim Brand: 6,0 + 3,6 = 9,6jt > Tim Performance 3,0jt." },
          { kind: "equal", task: "t4", name: "roas_google", value: 14 / 3, tol: 0.01, label: "roas_google sekitar 4,67", msg: "14,0jt / 3,0jt = 4,667." },
          { kind: "stdout_matches", task: "t4", pattern: "owner_top=Tim Brand", label: "print menampilkan owner_top", msg: "Format: owner_top=..." },
        ],
      },
      reference: "SUMIFS/COUNTIFS/XLOOKUP/pivot: logika sama di Excel & Python.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Memilih alat: spreadsheet, SQL, atau BI",
      prose: [
        "Skenario satu — audit cepat data kecil ('cek pacing minggu ini dari export CSV 2.000 baris'): spreadsheet. Buka, pivot, conditional formatting, selesai 20 menit. SQL = overkill.",
        "Skenario dua — pertanyaan berulang tiap minggu ('ROAS per kanal, update Senin pagi'): JANGAN spreadsheet manual. Pindahkan ke SQL terjadwal atau tabel terkurasi — copy-paste mingguan adalah pabrik kesalahan (satu minggu lupa update range = angka basi).",
        "Skenario tiga — validasi angka dashboard ('dashboard bilang ROAS 2,1, kok aneh?'): spreadsheet sebagai ALAT AUDIT. Export sampel 1.000 baris, hitung manual dengan SUMIFS — bila beda dengan dashboard, selidiki definisinya. Spreadsheet adalah kebenaran kedua yang murah.",
        "Skenario empat — analisis butuh banyak orang & satu versi kebenaran ('laporan ke direksi tiap bulan'): BI atau tabel terkurasi. Lima file Excel dengan lima versi angka = rapat debat definisi.",
        "Skenario lima — data > 1 juta baris atau join 3+ tabel: SQL. Spreadsheet akan ngos-ngosan (atau crash) — dan VLOOKUP antar 3 file adalah mimpi buruk yang bisa dihindari.",
        "Aturan praktis 10 detik: (1) berapa baris? (2) berapa kali diulang? (3) berapa konsumen? — <100rb + sekali + sendiri = spreadsheet; selain itu naik kelas.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Spreadsheet final v7_REVISI_BENERAN.xlsx' — versioning via nama file adalah tanda proses yang rusak. Bila sebuah spreadsheet hidup lebih dari 2 minggu dan dipakai >1 orang, ia seharusnya sudah menjadi query terjadwal atau dashboard. File yang di-forward berkali-kali = kebenaran yang terfragmentasi.",
      },
      reference: "Sekali & kecil → spreadsheet; berulang/besar/banyak orang → naik kelas.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Audit 20 menit yang menyelamatkan Rp75 juta",
      prose: [
        "Setelah insiden Dita, timnya membuat SOP audit spreadsheet 20 menit sebelum angka naik ke direksi: (1) cek tipe data — =ISTEXT() pada kolom tanggal & angka; 5 baris sampel dihitung manual dengan kalkulator; (2) cek duplikat — COUNT vs COUNT DISTINCT pada kolom id; (3) cek argumen lookup — semua VLOOKUP harus FALSE / XLOOKUP; (4) cek persen — tulis 'pp' atau 'relatif' eksplisit.",
        "Pertanyaan: Dita menerapkan SOP pada laporan pacing bulan Oktober (budget Rp300jt, 30 hari). Hari ke-12, spreadsheet menunjukkan spend Rp180jt. (a) Berapa pacing-nya? (b) Tindakan apa? Pembahasan: (a) target prorata hari ke-12 = 300 × 12/30 = Rp120jt → pacing = 180/120 = 150% (over-pacing). (b) Turunkan anggaran harian ~30% ATAU jeda kampanye dengan ROAS terendah; bila dibiarkan, budget habis di hari ke-20. Pelajaran SOP: 20 menit audit < 2 bulan menjelaskan ke finance mengapa budget jebol — dan jauh lebih murah dari Rp75jt yang terlanjur dibakar Dita dulu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "SOP audit terbaik adalah yang paling pendek — 4 cek, 20 menit, tanpa kecuali. SOP 2 halaman tidak akan dibaca; SOP 4 baris akan dijalankan. Tempelkan 4 cek ini di baris pertama setiap spreadsheet laporan: tipe data, duplikat, lookup, persen.",
      },
      reference: "20 menit audit > 2 bulan menjelaskan ke finance.",
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
        "Empat fungsi inti: SUMIFS/COUNTIFS (agregasi bersyarat), XLOOKUP (exact match, gantikan VLOOKUP), pivot table (eksplorasi 30 detik), conditional formatting (radar visual).",
        "Tiga jebakan: tanggal sebagai teks (SUMIFS tanggal → NOL diam-diam), persen vs poin persen (tulis keduanya eksplisit), baris duplikat (COUNT vs COUNT DISTINCT).",
        "VLOOKUP tanpa FALSE = approximate match yang salah diam-diam; XLOOKUP default exact match.",
        "Pacing = spend kumulatif / (budget × hari berlalu/hari total); >110% merah, 90–110% hijau; selalu definisikan gross vs nett.",
        "Aturan alat: <100rb baris + sekali + sendiri = spreadsheet; berulang/besar/banyak konsumen = SQL/BI; spreadsheet juga alat audit dashboard.",
        "Kesalahan logika tidak memicu error merah — satu-satunya alarm adalah audit manual (spot-check 5 baris).",
      ],
      quiz: [
        {
          q: "=SUMIFS(revenue; kanal; \"Meta\") menghasilkan angka jauh lebih kecil dari ekspektasi, tanpa error. Penyebab PALING mungkin?",
          options: [
            { text: "Kolom revenue berisi teks (mis. 'Rp 1.250.000'), sehingga SUMIFS mengabaikan sel-sel itu diam-diam", why: "Benar: SUMIFS melewatkan teks tanpa peringatan — persis insiden Dita. Diagnosis: ISTEXT().", correct: true },
            { text: "Formula SUMIFS salah sintaks", why: "Sintaks salah akan memicu error, bukan angka kecil." },
            { text: "Kanal Meta memang penjualannya kecil", why: "Mungkin, tetapi 'tanpa error + jauh lebih kecil' menunjuk masalah tipe data dulu — cek itu sebelum menyimpulkan bisnis." },
            { text: "Excel sedang dalam mode perhitungan manual", why: "Mode manual membuat angka basi, bukan lebih kecil secara sistematis." },
          ],
        },
        {
          q: "Konversi naik dari 4% ke 6%. Penulisan yang TIDAK ambigu di slide?",
          options: [
            { text: "'+2 pp (dari 4% ke 6%; +50% relatif)'", why: "Benar: poin persen + relatif, tidak ada ruang salah tafsir.", correct: true },
            { text: "'Naik 2%'", why: "Ambigu: 2 poin persen atau 2% relatif (4% → 4,08%)? Beda 25× lipat." },
            { text: "'Naik 50%'", why: "Benar secara relatif tetapi menyembunyikan basisnya — 4%→6% (+50%) jauh berbeda bobotnya dari 40%→60% (+50%)." },
            { text: "'Naik signifikan'", why: "'Signifikan' tanpa angka = filler (F1); tidak memberi informasi." },
          ],
        },
        {
          q: "Laporan pacing mingguan yang sama dibuat manual tiap Senin (copy-paste dari 3 export). Masalah terbesar & solusinya?",
          options: [
            { text: "Copy-paste berulang = pabrik kesalahan; pindahkan ke query terjadwal / tabel terkurasi", why: "Benar: satu minggu lupa update range = angka basi yang terlihat segar.", correct: true },
            { text: "Ganti Excel dengan Google Sheets", why: "Ganti alat tidak memperbaiki proses copy-paste manual." },
            { text: "Tambah conditional formatting agar kesalahan terlihat", why: "Membantu deteksi, tetapi tidak menghilangkan sumber kesalahan." },
            { text: "Minta tiap orang membuat versinya sendiri lalu bandingkan", why: "Itu justru melipatgandakan versi kebenaran — masalahnya makin parah." },
          ],
        },
        {
          q: "Dashboard menunjukkan ROAS 2,1 tetapi analis curiga. Penggunaan spreadsheet yang TEPAT di sini?",
          options: [
            { text: "Sebagai alat audit: export sampel, hitung manual dengan SUMIFS, bandingkan definisinya dengan dashboard", why: "Benar: spreadsheet adalah 'kebenaran kedua yang murah' untuk memverifikasi definisi metrik.", correct: true },
            { text: "Membuat dashboard tandingan yang permanen di spreadsheet", why: "Itu menciptakan dua sumber kebenaran — masalah baru, bukan solusi." },
            { text: "Mengabaikan dashboard karena spreadsheet lebih akurat", why: "Tidak otomatis — dashboard bisa benar; yang dibutuhkan adalah verifikasi, bukan keyakinan." },
            { text: "Menghapus data dashboard agar tidak membingungkan", why: "Menghapus bukti bukan audit." },
          ],
        },
        {
          q: "=VLOOKUP(kanal; tabel; 2) tanpa argumen ke-4 me-match 'Metaverse' ke baris 'Meta'. Mengapa?",
          options: [
            { text: "Default approximate match (TRUE): mencari nilai terdekat ≤ lookup value, bukan yang sama persis", why: "Benar: tanpa FALSE, VLOOKUP tidak mencari kecocokan persis. Solusi: tambah FALSE atau pakai XLOOKUP.", correct: true },
            { text: "VLOOKUP tidak bisa dipakai untuk teks", why: "Bisa — masalahnya mode pencocokan, bukan tipe data." },
            { text: "Tabel harus diurutkan menurun", why: "Approximate match butuh urutan menaik; tetapi solusi yang benar adalah exact match, bukan mengurutkan." },
            { text: "Kolom index harus 1", why: "Tidak relevan dengan perilaku matching." },
          ],
        },
      ],
      next: { label: "MK25 — Membangun Dashboard Marketing", href: "/v2/learn/mk25-dashboard-marketing" },
    },
  ],
};
