import type { V2Lesson } from "../lib/types";

const FIG_ROAS = `<svg viewBox="0 0 560 340" role="img" aria-label="ROAS per kanal: Google tertinggi, Meta terendah.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">ROAS per kanal: yang paling besar belum tentu paling efisien</text>
<line x1="60" y1="290" x2="540" y2="290" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="290" x2="60" y2="40" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="295" font-size="9" fill="var(--chart-text)">0</text>
<text x="14" y="235" font-size="9" fill="var(--chart-text)">0,3</text>
<text x="14" y="175" font-size="9" fill="var(--chart-text)">0,6</text>
<text x="14" y="115" font-size="9" fill="var(--chart-text)">0,9</text>
<line x1="60" y1="230" x2="540" y2="230" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="170" x2="540" y2="170" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="110" x2="540" y2="110" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<rect x="100" y="243" width="90" height="47" fill="var(--c2)" opacity="0.85" rx="4"/>
<rect x="250" y="98" width="90" height="192" fill="var(--c1)" opacity="0.85" rx="4"/>
<rect x="400" y="238" width="90" height="52" fill="var(--c3)" opacity="0.85" rx="4"/>
<text x="145" y="312" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Meta</text>
<text x="295" y="312" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Google</text>
<text x="445" y="312" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">TikTok</text>
<text x="145" y="268" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">0,20</text>
<text x="295" y="90" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">0,90</text>
<text x="445" y="263" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">0,22</text>
<text x="145" y="328" font-size="9" fill="var(--chart-text)" text-anchor="middle">spend Rp80jt</text>
<text x="295" y="328" font-size="9" fill="var(--chart-text)" text-anchor="middle">spend Rp20jt</text>
<text x="445" y="328" font-size="9" fill="var(--chart-text)" text-anchor="middle">spend Rp25jt</text>
</g>
</svg>`;

export const mk23: V2Lesson = {
  slug: "mk23-sql-marketing",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK23 — SQL untuk Marketing Data: Membaca Portofolio Lewat Query",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Presentasi Raka yang runtuh oleh satu pertanyaan",
      prose: [
        "Raka, analis marketing sebuah e-commerce fashion lokal, menyiapkan presentasi bulanan untuk CMO. Slidenya rapi: 'Kanal terbaik bulan ini: Meta — revenue Rp15,6 juta.' Angka benar — Meta memang menghasilkan Rp15,6 juta. Ia pulang dengan percaya diri.",
        "Di tengah presentasi, CMO mengangkat tangan: 'Budget Meta bulan ini berapa?' Raka menjawab: Rp80 juta. Hening tiga detik. 'Jadi kita bakar Rp80 juta untuk dapat Rp15,6 juta? ROAS-nya 0,2?' Raka menelan ludah. Ia tidak pernah menghitung ROAS per kanal — ia hanya menjumlah revenue. Ternyata Google, dengan budget Rp20 juta, menghasilkan Rp18 juta (ROAS 0,9). Kanal 'terbaik' versi Raka justru yang paling boros. Budget kuartal berikutnya dipotong 30% dari Meta dan dialihkan — keputusan yang seharusnya datang dari datanya sendiri, bukan dari pertanyaan CMO.",
        "Twist-nya: Raka BUKAN salah hitung — ia salah PERTANYAAN. Bahkan klaim 'terbesar' di slidenya salah: Google menghasilkan Rp18 juta — Raka bahkan tidak membandingkan revenue antar kanal sebelum menyimpulkan. 'Kanal mana revenue-nya terbesar?' adalah pertanyaan volume; 'kanal mana yang paling efisien?' adalah pertanyaan efisiensi; dan keduanya butuh query yang berbeda. Lesson ini mengajarkan SQL secukupnya untuk analis marketing: agregasi per kanal, konversi funnel, cohort, dan ranking — empat query yang mengubahmu dari 'tukang lapor angka' menjadi orang yang menjawab pertanyaan bisnis sebelum ditanya. Ringkas fondasi funnel (agar lesson mandiri): funnel marketing adalah tahapan visit → signup → beli; konversi antar tahap mengukur di mana prospek gugur; analisis funnel yang baik membandingkan konversi PER KANAL, bukan agregat semua kanal — karena kanal dengan traffic besar bisa menutupi kanal kecil yang sebenarnya paling efisien (persis kasus Raka).",
      ],
      tasks: [],
      note: {
        title: "Konteks bisnis",
        type: "risk",
        body: "Di pasar kerja 2026, SQL adalah skill #1 analis marketing (muncul di hampir semua lowongan) — bukan untuk jadi engineer, tetapi untuk menjawab pertanyaan sendiri tanpa antre ke tim data. Analis yang bisa query tidak menunggu dashboard diperbaiki; ia membuktikan dulu dengan SQL.",
      },
      reference: "Jangan tanya 'mana yang terbesar' sebelum bertanya 'mana yang paling efisien'.",
    },
    {
      id: "konsep-sql",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat pola query yang menutupi 80% kebutuhan analis marketing",
      prose: [
        "SQL untuk marketing bukan SQL untuk engineer. Kamu tidak perlu window frame eksotis atau recursive CTE — empat pola ini menutupi hampir semua kebutuhan: satu, GROUP BY untuk agregasi (spend, revenue, ROAS per kanal/kampanye). Dua, CASE WHEN untuk logika kondisional (bucket funnel, segmentasi). Tiga, JOIN untuk menggabungkan tabel yang terpisah (kampanye × event, user × transaksi). Empat, window function dasar (ROW_NUMBER, agregat OVER) untuk ranking dan perbandingan dalam grup.",
        "Kepribadian konsep ini: SQL adalah 'bahasa bertanya yang tidak bisa dibohongi' — spreadsheet bisa menyembunyikan baris yang ter-filter, tetapi query selalu jujur tentang apa yang ia hitung, karena logikanya tertulis eksplisit. Analis yang menulis query sedang menuliskan DEFINISI metriknya — dan definisi yang tertulis bisa diaudit, diuji, dan diperdebatkan. Itulah bedanya dengan angka di slide.",
        "Urutannya penting: filter dulu (WHERE), gabung (JOIN), kelompokkan (GROUP BY), saring hasil agregat (HAVING), urutkan (ORDER BY), batasi (LIMIT). Analis pemula paling sering salah di satu titik: agregasi SETELAH join tanpa pra-agregasi — lihat jebakan fan-out di bawah.",
        "🚨 Mitos: 'SQL itu untuk data engineer; analis cukup dashboard.' Yang benar: dashboard menjawab pertanyaan yang SUDAH dipikirkan orang lain. Pertanyaan Raka ('ROAS per kanal bulan ini, bandingkan dengan bulan lalu') tidak ada di dashboard mana pun — ia butuh query. SQL adalah kebebasan bertanya.",
      ],
      tasks: [],
      formula: String.raw`\text{ROAS} = \frac{\text{revenue}}{\text{spend}}`,
      formulaNote: "ROAS (Return on Ad Spend) = revenue / spend. revenue = pendapatan yang diatribusikan ke kanal; spend = budget yang dibelanjakan di kanal itu. Interpretasi: ROAS 0,9 berarti tiap Rp1 spend kembali Rp0,90 — masih rugi bila margin < 10%. ROAS tidak berdiri sendiri: selalu pasangkan dengan volume (spend) dan margin. Contoh: Google ROAS 0,9 dengan spend Rp20jt vs Meta ROAS 0,2 dengan spend Rp80jt — Google lebih efisien 4,5× lipat.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "FAN-OUT: JOIN kampanye (1 baris per kampanye) dengan funnel (3 baris per kampanye: visit, signup, beli), lalu SUM(budget) — budget ikut terlipat 3×! Hasilnya Rp150jt padahal aslinya Rp50jt. Solusinya: agregasi dulu per tabel (subquery/CTE), BARU join — persis pola di lab langkah 6. Aturan: tidak pernah SUM kolom dari tabel 'satu' setelah join dengan tabel 'banyak'.",
      },
      reference: "Agregasi dulu per tabel, baru join — cegah fan-out.",
    },
    {
      id: "konsep-funnel",
      eyebrow: "Langkah 3 · Konsep",
      title: "Konversi funnel via CASE WHEN: di mana prospek gugur",
      prose: [
        "Funnel menjawab 'tahap mana yang bocor'. Polanya: hitung jumlah per tahap dengan CASE WHEN, lalu bagi. Query kanonis: SUM(CASE WHEN tahap='beli' THEN jumlah ELSE 0 END) / SUM(CASE WHEN tahap='visit' THEN jumlah ELSE 0 END) — konversi visit→beli. Pola yang sama menghitung signup/visit (kualitas traffic) dan beli/signup (kualitas lead).",
        "Yang membuat analisis ini berharga adalah PERBANDINGAN antar kampanye, bukan angka absolutnya. Kampanye K3 (Search Brand) konversi visit→beli 9% — tiga kali lipat K2 (2%). Artinya: traffic search datang dengan niat beli; traffic Meta butuh edukasi lebih dulu. Keputusan bisnisnya berbeda: untuk K3 naikkan budget (panen niat yang ada), untuk K2 perbaiki landing page (jangan buang traffic).",
        "Jebakan klasik: membagi dengan visit yang mencakup bot/internal traffic — konversi jadi terlihat kecil dan 'diperbaiki' dengan cara yang salah. Selalu pastikan denominator funnel sudah dibersihkan (filter internal IP, bot) SEBELUM dianalisis; query tidak bisa memperbaiki data kotor, hanya membuatnya terlihat presisi.",
        "🚨 Mitos: 'Konversi naik = marketing membaik.' Yang benar: konversi bisa naik karena traffic turun (denominator mengecil) — misal kampanye dihentikan di kanal murah sehingga yang tersisa hanya traffic niat tinggi. Selalu baca konversi BERSAMA volume; konversi 9% dari 500 visit (45 beli) vs 5% dari 5.000 visit (250 beli) — yang kedua menghasilkan 5× pembeli.",
      ],
      tasks: [],
      formula: String.raw`\text{konversi}_{A \to B} = \frac{\text{jumlah tahap } B}{\text{jumlah tahap } A}`,
      formulaNote: "konversi dari tahap A ke tahap B = jumlah di tahap B / jumlah di tahap A. Contoh: 45 beli / 500 visit = 0,09 = 9%. Interpretasi: dari 100 pengunjung, 9 menjadi pembeli. Bandingkan antar kampanye/kanal untuk menemukan di mana prospek gugur — lalu perbaiki tahap itu, bukan menaikkan budget membabi buta.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membagi dengan nol: kampanye baru yang belum punya visit membuat konversi = jumlah/0 → NULL/error. Bungkus denominator dengan NULLIF(..., 0) agar query tidak mati di tengah presentasi. Aturan: setiap pembagian di SQL marketing wajib NULLIF — kampanye baru selalu ada.",
      },
      reference: "Konversi dibaca bersama volume; denominator wajib NULLIF.",
    },
    {
      id: "konsep-kohort",
      eyebrow: "Langkah 4 · Konsep",
      title: "Cohort & window: retensi dan ranking tanpa spreadsheet",
      prose: [
        "Cohort menjawab 'apakah pelanggan baru makin setia?' — kelompokkan user berdasar bulan akuisisi, lalu lacak % yang masih aktif di bulan ke-1, ke-2, dst. Polanya: retensi = aktif_bulan_ke_n / aktif_bulan_ke_0. Cohort Juli: 32% bertahan di bulan pertama; cohort Agustus: 40%. Tren membaik — bukti program onboarding baru bekerja, sesuatu yang tidak terlihat dari total user aktif (yang bisa naik hanya karena akuisisi naik).",
        "Window function menjawab 'siapa terbaik DI DALAM grupnya'. ROW_NUMBER() OVER (PARTITION BY kanal ORDER BY roas DESC) memberi peringkat kampanye per kanal — adil, karena kampanye Meta tidak dilombakan melawan kampanye Google yang naturenya beda. Tanpa PARTITION BY, ranking global selalu dimenangkan kanal termurah — perbandingan yang tidak fair dan keputusan yang salah.",
        "Kepribadian konsep ini: cohort adalah 'rapor kesetiaan per angkatan' — seperti melihat nilai ujian per angkatan sekolah, bukan rata-rata seluruh sekolah yang menutupi angkatan bermasalah. Window function adalah 'juri yang adil' — ia menilai dalam kelasnya masing-masing.",
        "🚨 Mitos: 'Retensi cohort bisa dihitung dari total MAU.' Yang benar: MAU naik bisa berarti akuisisi naik SEMENTARA retensi anjlok — dua cerita berlawanan dengan angka total yang sama. Hanya cohort yang memisahkan 'menarik orang baru' dari 'menjaga orang lama'.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Uji cepat kualitas analisismu: bila seseorang bertanya 'kenapa MAU naik?', jawaban 'akuisisi naik 20%' tanpa menyebut retensi cohort = jawaban separuh. Selalu siapkan dua angka: akuisisi (aliran masuk) dan retensi cohort (kebocoran ember). Ember bocor + keran dibuka lebar = tagihan air (budget) membengkak.",
      },
      reference: "Cohort = kesetiaan per angkatan; ranking selalu dalam grup (PARTITION BY).",
    },
    {
      id: "visual-roas",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca ROAS: efisiensi vs volume",
      prose: [
        "Diagram batang menunjukkan ROAS tiga kanal dari data lab: Google 0,90 (tertinggi), TikTok 0,22, Meta 0,20 (terendah). Perhatikan label di bawah tiap batang: Meta membelanjakan Rp80jt — 4× lipat Google — untuk ROAS terendah. Inilah visual dari kesalahan Raka: batang 'revenue terbesar' (Meta) ternyata milik kanal paling boros.",
        "Pola yang harus dikenali: efisiensi (tinggi batang) vs volume (label spend). Keputusan budget yang sehat mempertimbangkan keduanya — Google efisien tetapi volumenya kecil (apakah bisa menyerap budget 4× lipat tanpa ROAS anjlok? itu pertanyaan diminishing return). Jawaban 'geser semua ke Google' sama naifnya dengan 'Meta terbaik karena revenue terbesar'.",
      ],
      figure: {
        svg: FIG_ROAS,
        alt: "ROAS per kanal: Google tertinggi, Meta terendah.",
        caption: "Cara membaca: sumbu Y = ROAS (revenue/spend); tinggi batang = efisiensi kanal; label bawah = total spend. Interpretasi: Google paling efisien (0,90) tetapi volumenya kecil; Meta paling boros (0,20) meski spend-nya terbesar. Keputusan: uji skala bertahap di Google (naikkan 50%, pantau ROAS), perbaiki funnel Meta sebelum menambah budget — bukan sekadar memindahkan semua uang.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca chart ROAS tanpa label spend = memutuskan dengan setengah informasi. ROAS 0,9 dari spend Rp20jt tidak sama bobotnya dengan ROAS 0,9 dari spend Rp200jt. Selalu minta dua dimensi: efisiensi DAN volume — chart yang baik menampilkan keduanya.",
      },
      reference: "Efisiensi × volume: dua dimensi, satu keputusan.",
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 6 · Lab",
      title: "Query portofolio: dari tabel mentah ke jawaban Raka",
      prose: [
        "Database berisi tiga tabel: kampanye (id, nama, kanal, budget), funnel (kampanye_id, tahap, jumlah, revenue), dan kohort (bulan_akuisisi, bulan_ke, aktif). Tugasmu menulis empat query: (t1) spend, revenue, dan ROAS per kanal + kanal ROAS tertinggi; (t2) konversi visit→beli per kampanye; (t3) ranking kampanye dalam kanal Meta via ROW_NUMBER; (t4) retensi cohort bulan ke-1 untuk akuisisi Juli 2026. Perhatikan pola anti fan-out di t1: agregasi funnel dulu (subquery), baru join ke kampanye.",
        "Hasil yang benar: kanal_top = Google (ROAS 0,90); konversi K3 = 9%; K1 ranking 1 di Meta; retensi cohort Juli bulan ke-1 = 32%. Eksplorasi: ubah query t1 menjadi AVG(roas) per kampanye (rata-rata dari rasio) — bandingkan dengan ROAS kanal (rasio dari total). Mengapa angkanya beda, dan mana yang benar untuk keputusan budget?",
      ],
      tasks: [
        { id: "t1", text: "Hitung spend, revenue, ROAS per kanal (anti fan-out) → kanal_top, roas_google" },
        { id: "t2", text: "Hitung konversi visit→beli per kampanye via CASE WHEN → konversi_k3" },
        { id: "t3", text: "Ranking kampanye dalam kanal Meta dgn ROW_NUMBER → rank_k1_meta" },
        { id: "t4", text: "Hitung retensi bulan ke-1 cohort 2026-07 → retensi_07_m1, lalu cetak semuanya" },
      ],
      expected: "roas_terbaik=Google roas_google=0.90 konversi_k3=9.00% rank_k1_meta=1 retensi_07_m1=32%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "AVG(ROAS kampanye) vs ROAS kanal (SUM revenue / SUM spend): keduanya 'rata-rata' tetapi beda makna — yang pertama memberi bobot sama ke kampanye kecil dan besar (kampanye Rp1jt diperlakukan setara Rp50jt), yang kedua membobot dengan uang sesungguhnya. Untuk keputusan budget, yang benar adalah rasio dari total. Rata-rata dari rasio hanya valid bila semua kampanye seukuran.",
      },
      hints: [
        "t1: subquery agregasi funnel per kampanye_id dulu, baru JOIN ke kampanye.",
        "t2: SUM(CASE WHEN tahap='beli' THEN jumlah ELSE 0 END) / NULLIF(SUM(CASE WHEN tahap='visit' ...), 0).",
        "t3: ROW_NUMBER() OVER (ORDER BY revenue*1.0/budget DESC) di dalam subquery kanal='Meta'.",
        "t4: aktif bulan_ke=1 dibagi aktif bulan_ke=0 pada bulan_akuisisi yang sama.",
      ],
      code: {
        starter: "import sqlite3\n\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.executescript(\"\"\"\nCREATE TABLE kampanye (id TEXT PRIMARY KEY, nama TEXT, kanal TEXT, budget INTEGER);\nCREATE TABLE funnel (kampanye_id TEXT, tahap TEXT, jumlah INTEGER, revenue INTEGER);\nCREATE TABLE kohort (bulan_akuisisi TEXT, bulan_ke INTEGER, aktif INTEGER);\n\"\"\")\n# DATA — JANGAN UBAH\nkampanye = [\n    (\"k1\", \"Ramadan Sale\", \"Meta\", 50_000_000),\n    (\"k2\", \"Payday Blast\", \"Meta\", 30_000_000),\n    (\"k3\", \"Search Brand\", \"Google\", 20_000_000),\n    (\"k4\", \"TikTok Live\", \"TikTok\", 25_000_000),\n]\nfunnel = [\n    (\"k1\", \"visit\", 1000, 0), (\"k1\", \"signup\", 200, 0), (\"k1\", \"beli\", 40, 12_000_000),\n    (\"k2\", \"visit\", 800, 0), (\"k2\", \"signup\", 96, 0), (\"k2\", \"beli\", 12, 3_600_000),\n    (\"k3\", \"visit\", 500, 0), (\"k3\", \"signup\", 150, 0), (\"k3\", \"beli\", 45, 18_000_000),\n    (\"k4\", \"visit\", 1200, 0), (\"k4\", \"signup\", 180, 0), (\"k4\", \"beli\", 18, 5_400_000),\n]\nkohort = [\n    (\"2026-07\", 0, 1000), (\"2026-07\", 1, 320), (\"2026-07\", 2, 210),\n    (\"2026-08\", 0, 1200), (\"2026-08\", 1, 480),\n]\ncur.executemany(\"INSERT INTO kampanye VALUES (?,?,?,?)\", kampanye)\ncur.executemany(\"INSERT INTO funnel VALUES (?,?,?,?)\", funnel)\ncur.executemany(\"INSERT INTO kohort VALUES (?,?,?)\", kohort)\ncon.commit()\n\n# TULIS KODEMU\nkanal_top = \nroas_google = \nkonversi_k3 = \nrank_k1_meta = \nretensi_07_m1 = \n\nprint(f\"roas_terbaik={kanal_top} roas_google={roas_google:.2f} konversi_k3={konversi_k3:.2%} rank_k1_meta={rank_k1_meta} retensi_07_m1={retensi_07_m1:.0%}\")\n",
        lockLines: 30,
        solution: "import sqlite3\n\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.executescript(\"\"\"\nCREATE TABLE kampanye (id TEXT PRIMARY KEY, nama TEXT, kanal TEXT, budget INTEGER);\nCREATE TABLE funnel (kampanye_id TEXT, tahap TEXT, jumlah INTEGER, revenue INTEGER);\nCREATE TABLE kohort (bulan_akuisisi TEXT, bulan_ke INTEGER, aktif INTEGER);\n\"\"\")\n# DATA — JANGAN UBAH\nkampanye = [\n    (\"k1\", \"Ramadan Sale\", \"Meta\", 50_000_000),\n    (\"k2\", \"Payday Blast\", \"Meta\", 30_000_000),\n    (\"k3\", \"Search Brand\", \"Google\", 20_000_000),\n    (\"k4\", \"TikTok Live\", \"TikTok\", 25_000_000),\n]\nfunnel = [\n    (\"k1\", \"visit\", 1000, 0), (\"k1\", \"signup\", 200, 0), (\"k1\", \"beli\", 40, 12_000_000),\n    (\"k2\", \"visit\", 800, 0), (\"k2\", \"signup\", 96, 0), (\"k2\", \"beli\", 12, 3_600_000),\n    (\"k3\", \"visit\", 500, 0), (\"k3\", \"signup\", 150, 0), (\"k3\", \"beli\", 45, 18_000_000),\n    (\"k4\", \"visit\", 1200, 0), (\"k4\", \"signup\", 180, 0), (\"k4\", \"beli\", 18, 5_400_000),\n]\nkohort = [\n    (\"2026-07\", 0, 1000), (\"2026-07\", 1, 320), (\"2026-07\", 2, 210),\n    (\"2026-08\", 0, 1200), (\"2026-08\", 1, 480),\n]\ncur.executemany(\"INSERT INTO kampanye VALUES (?,?,?,?)\", kampanye)\ncur.executemany(\"INSERT INTO funnel VALUES (?,?,?,?)\", funnel)\ncur.executemany(\"INSERT INTO kohort VALUES (?,?,?)\", kohort)\ncon.commit()\n\n# TULIS KODEMU\nrows = cur.execute(\"\"\"\nSELECT k.kanal, SUM(k.budget) AS spend, SUM(f.revenue) AS revenue,\n       CAST(SUM(f.revenue) AS REAL) / SUM(k.budget) AS roas\nFROM kampanye k\nJOIN (SELECT kampanye_id, SUM(revenue) AS revenue FROM funnel GROUP BY kampanye_id) f\n  ON f.kampanye_id = k.id\nGROUP BY k.kanal ORDER BY roas DESC\"\"\").fetchall()\nkanal_top = rows[0][0]\nroas = {r[0]: r[3] for r in rows}\nroas_google = roas[\"Google\"]\nkonv = cur.execute(\"\"\"\nSELECT k.id,\n  CAST(SUM(CASE WHEN f.tahap='beli' THEN f.jumlah ELSE 0 END) AS REAL)\n  / NULLIF(SUM(CASE WHEN f.tahap='visit' THEN f.jumlah ELSE 0 END), 0) AS konv\nFROM kampanye k JOIN funnel f ON f.kampanye_id = k.id GROUP BY k.id\"\"\").fetchall()\nkonversi_k3 = [r[1] for r in konv if r[0] == \"k3\"][0]\nrnk = cur.execute(\"\"\"\nSELECT id, ROW_NUMBER() OVER (ORDER BY CAST(revenue AS REAL)/budget DESC) AS rn\nFROM (SELECT k.id, k.budget, SUM(f.revenue) AS revenue\n      FROM kampanye k JOIN funnel f ON f.kampanye_id = k.id\n      WHERE k.kanal = 'Meta' GROUP BY k.id)\"\"\").fetchall()\nrank_k1_meta = [r[1] for r in rnk if r[0] == \"k1\"][0]\nret = cur.execute(\"SELECT bulan_akuisisi, bulan_ke, aktif FROM kohort\").fetchall()\nbase = [r[2] for r in ret if r[0] == \"2026-07\" and r[1] == 0][0]\nretensi_07_m1 = [r[2] for r in ret if r[0] == \"2026-07\" and r[1] == 1][0] / base\n\nprint(f\"roas_terbaik={kanal_top} roas_google={roas_google:.2f} konversi_k3={konversi_k3:.2%} rank_k1_meta={rank_k1_meta} retensi_07_m1={retensi_07_m1:.0%}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "kanal_top", value: "Google", label: "kanal ROAS tertinggi = Google", msg: "Google: 18jt/20jt = 0,9 — tertinggi." },
          { kind: "equal", task: "t1", name: "roas_google", value: 0.9, tol: 0.01, label: "roas_google sekitar 0,90", msg: "18.000.000 / 20.000.000 = 0,9." },
          { kind: "equal", task: "t2", name: "konversi_k3", value: 0.09, tol: 1e-9, label: "konversi_k3 = 9%", msg: "45 beli / 500 visit = 0,09." },
          { kind: "equal", task: "t3", name: "rank_k1_meta", value: 1, label: "K1 ranking 1 di Meta", msg: "K1 ROAS 0,24 > K2 0,12." },
          { kind: "equal", task: "t4", name: "retensi_07_m1", value: 0.32, tol: 1e-9, label: "retensi cohort Juli m1 = 32%", msg: "320 / 1000 = 0,32." },
          { kind: "stdout_matches", task: "t4", pattern: "roas_terbaik=Google", label: "print menampilkan kanal terbaik", msg: "Format: roas_terbaik=..." },
        ],
      },
      reference: "Empat query kanonis: agregasi anti fan-out, CASE WHEN funnel, ROW_NUMBER, cohort.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan SQL, kapan spreadsheet, kapan minta ke data engineer",
      prose: [
        "Skenario satu — pertanyaan ad-hoc dari atasan ('ROAS per kanal minggu ini?'): tulis SQL sendiri. Data sudah di warehouse, query 5 menit, jawaban hari ini. Menunggu tim data = jawaban minggu depan.",
        "Skenario dua — eksplorasi cepat di data kecil (<100rb baris, satu file CSV): spreadsheet cukup. SQL adalah overkill; pivot table lebih cepat untuk 'coba-coba'.",
        "Skenario tiga — metrik dipakai berulang oleh banyak orang (definisi ROAS resmi perusahaan): JANGAN query sendiri-sendiri. Minta tim data membuatkan tabel/model terkurasi (dbt) — satu definisi, semua orang pakai. Query ad-hoc untuk eksplorasi; tabel terkurasi untuk kebenaran resmi.",
        "Skenario empat — data belum ada di warehouse (event baru, data partner): jangan memaksa SQL. Rapikan dulu sumbernya (tracking, ETL) — query di atas data setengah jadi menghasilkan jawaban yang presisi tapi salah.",
        "Skenario lima — analisis butuh statistik lanjut (MMM, uplift, forecasting): SQL berhenti di agregasi; lanjutkan di Python/R. SQL menyiapkan meja, Python memasak.",
        "Aturan praktis 10 detik: (1) apakah datanya sudah di warehouse? (tidak → bereskan sumber dulu); (2) apakah pertanyaan ini akan ditanya lagi bulan depan? (ya → minta tabel terkurasi); (3) apakah butuh modeling? (ya → SQL hanya untuk siapkan data).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Analis yang baru bisa SQL lalu meng-query SEMUANYA sendiri — termasuk metrik resmi yang sudah ada tabel kurasinya. Hasilnya: dua versi 'ROAS' yang beda definisi di dua slide berbeda, dan rapat berubah jadi debat definisi. Aturan: eksplorasi boleh query bebas; angka yang naik ke direksi wajib dari sumber terkurasi.",
      },
      reference: "Ad-hoc → SQL sendiri; resmi → tabel terkurasi; modeling → Python.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Budget Rp500jt: siapa dapat apa",
      prose: [
        "Brand D2C skincare 'GlowLokal' punya budget kuartal Rp500jt untuk tiga kanal. Data kuartal lalu (dari query seperti lab): Meta spend Rp200jt ROAS 0,8 (revenue Rp160jt); Google spend Rp150jt ROAS 1,4 (revenue Rp210jt); TikTok spend Rp150jt ROAS 1,1 (revenue Rp165jt). Total revenue Rp535jt. CMO bertanya: alokasi kuartal depan?",
        "Pertanyaan: (a) alokasi naive 'bagi rata' vs 'semua ke Google' — apa masalah masing-masing? (b) usulkan alokasi + eksperimen validasinya. Pembahasan: (a) Bagi rata mengabaikan efisiensi (Meta ROAS 0,8 = bakar uang). 'Semua ke Google' mengabaikan diminishing return — ROAS 1,4 di spend Rp150jt belum tentu bertahan di Rp500jt (lelang makin mahal, audiens jenuh). (b) Usulan sehat: Google Rp250jt (+67%), TikTok Rp175jt (+17%), Meta Rp75jt (−62%, hanya untuk retargeting yang ROAS-nya biasanya lebih baik) — total tetap Rp500jt. Validasi: naikkan bertahap per 2 minggu, pantau ROAS marginal (bukan rata-rata): bila ROAS Google turun di bawah 1,2, hentikan penambahan. Pelajaran: alokasi budget memakai ROAS MARGINAL (efek rupiah tambahan), bukan ROAS rata-rata — dan SQL-lah yang menghitung keduanya per minggu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "ROAS rata-rata menjawab 'bagaimana kemarin'; ROAS marginal menjawab 'bagaimana rupiah berikutnya'. Keputusan budget selalu tentang rupiah BERIKUTNYA. Analis yang hanya melaporkan rata-rata sedang menjawab pertanyaan kemarin untuk keputusan besok.",
      },
      reference: "Alokasi memakai ROAS marginal, divalidasi bertahap per 2 minggu.",
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
        "Empat pola query analis: GROUP BY (agregasi), CASE WHEN (funnel/bucket), JOIN (gabung tabel), window dasar (ranking) — menutupi 80% kebutuhan.",
        "Anti fan-out: agregasi dulu per tabel (subquery/CTE), baru join — tidak pernah SUM kolom tabel 'satu' setelah join tabel 'banyak'.",
        "Konversi funnel = tahap B / tahap A (NULLIF denominator); baca selalu bersama volume; bandingkan antar kampanye untuk temukan kebocoran.",
        "Cohort memisahkan akuisisi dari retensi; ROW_NUMBER() dengan PARTITION BY memberi ranking yang adil dalam grup.",
        "ROAS = revenue/spend; keputusan budget memakai ROAS marginal (rupiah berikutnya), bukan rata-rata; rasio dari total ≠ rata-rata dari rasio.",
        "Aturan alat: ad-hoc → SQL sendiri; metrik resmi → tabel terkurasi; modeling → Python; data kecil eksplorasi → spreadsheet.",
      ],
      quiz: [
        {
          q: "JOIN tabel kampanye (1 baris/kampanye) dengan funnel (3 baris/kampanye) lalu SUM(budget) menghasilkan 3× budget asli. Perbaikan yang benar?",
          options: [
            { text: "Agregasi funnel dulu per kampanye_id (subquery), baru join ke kampanye", why: "Benar: fan-out terjadi karena baris berlipat; pra-agregasi mengembalikan ke 1 baris per kampanye sebelum join.", correct: true },
            { text: "Pakai AVG(budget) sebagai ganti SUM", why: "AVG tetap salah — ia merata-ratakan nilai yang terlipat, bukan memperbaiki pelipatannya." },
            { text: "Tambahkan DISTINCT di dalam SUM", why: "SUM(DISTINCT) hanya benar bila tidak ada dua kampanye berbudget sama — rapuh dan menyesatkan." },
            { text: "Filter WHERE tahap='beli' sebelum SUM", why: "Itu mengubah makna query (hanya kampanye ber-beli), bukan memperbaiki pelipatan baris." },
          ],
        },
        {
          q: "Kampanye A ROAS 2,0 (spend Rp10jt), kampanye B ROAS 1,5 (spend Rp100jt). Mana yang 'lebih baik' untuk tambahan budget Rp50jt?",
          options: [
            { text: "Tidak bisa diputuskan dari ROAS rata-rata saja — butuh ROAS marginal & kapasitas skala", why: "Benar: ROAS 2,0 di spend kecil bisa anjlok saat diskala (diminishing return); keputusan butuh efek rupiah berikutnya.", correct: true },
            { text: "A, karena ROAS-nya lebih tinggi", why: "ROAS rata-rata tidak menjamin bertahan saat budget naik 5× lipat." },
            { text: "B, karena volumenya lebih besar", why: "Volume besar tidak berarti masih punya ruang tumbuh yang efisien." },
            { text: "Bagi rata Rp25jt ke masing-masing", why: "Bagi rata mengabaikan informasi efisiensi yang sudah ada." },
          ],
        },
        {
          q: "Konversi visit→beli sebuah kampanye naik dari 4% ke 8% setelah kanal termurahnya dihentikan. Interpretasi yang tepat?",
          options: [
            { text: "Waspada: konversi naik bisa karena denominator (visit) menyusut, bukan karena funnel membaik — cek volume", why: "Benar: traffic murah yang dihentikan mungkin justru yang paling tidak terkonversi; konversi naik mekanis.", correct: true },
            { text: "Funnel membaik dua kali lipat, naikkan budget", why: "Berbahaya tanpa cek volume — bisa jadi total pembeli justru turun." },
            { text: "Kanal murah memang tidak berguna, keputusan tepat", why: "Tidak bisa disimpulkan — kanal murah mungkin memberi volume pembeli absolut terbesar." },
            { text: "Angka 8% pasti salah hitung", why: "Tidak — kenaikan mekanis seperti ini wajar dan harus dibaca dengan benar." },
          ],
        },
        {
          q: "Kapan analis marketing sebaiknya TIDAK query sendiri melainkan memakai tabel terkurasi tim data?",
          options: [
            { text: "Ketika angkanya akan naik ke direksi / dipakai lintas tim sebagai metrik resmi", why: "Benar: satu definisi resmi mencegah dua versi ROAS di dua slide berbeda.", correct: true },
            { text: "Ketika datanya kecil (<100rb baris)", why: "Data kecil justru alasan memakai spreadsheet, bukan alasan memakai tabel terkurasi." },
            { text: "Ketika butuh jawaban dalam 5 menit", why: "Terbalik: query sendiri justru lebih cepat untuk ad-hoc." },
            { text: "Ketika ingin eksplorasi hipotesis baru", why: "Eksplorasi adalah use case terbaik query ad-hoc sendiri." },
          ],
        },
        {
          q: "Query retensi cohort memakai MAX(CASE WHEN bulan_ke=0 THEN aktif END) OVER (PARTITION BY bulan_akuisisi) sebagai denominator. Mengapa bukan total MAU?",
          options: [
            { text: "Karena retensi mengukur kesetiaan angkatan yang sama — denominatornya harus akuisisi angkatan itu, bukan total user", why: "Benar: MAU mencampur angkatan baru dan lama; hanya cohort yang memisahkan akuisisi dari retensi.", correct: true },
            { text: "Karena MAU tidak bisa dihitung di SQL", why: "MAU bisa dihitung — masalahnya maknanya, bukan teknisnya." },
            { text: "Karena window function wajib dipakai di semua query cohort", why: "Tidak wajib — ini soal definisi metrik yang benar, bukan kewajiban sintaks." },
            { text: "Karena total MAU selalu lebih kecil dari akuisisi", why: "Salah arah: MAU biasanya justru lebih besar karena mencakup banyak angkatan." },
          ],
        },
      ],
      next: { label: "MK24 — Excel & Google Sheets untuk Analis Marketing", href: "/learn/mk24-excel-sheets-marketing" },
    },
  ],
};
