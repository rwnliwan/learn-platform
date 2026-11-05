import type { V2Lesson } from "../lib/types";

// Revenue 6 bulan menurun + anotasi driver dine-in 85%.
const STORY_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Garis revenue menurun dari 5200 ke 4050 dengan anotasi 85 persen penurunan dari dine-in.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="50" y1="30" x2="500" y2="30"/><line x1="50" y1="80" x2="500" y2="80"/><line x1="50" y1="130" x2="500" y2="130"/><line x1="50" y1="180" x2="500" y2="180"/><line x1="50" y1="230" x2="500" y2="230"/>
</g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="44" y="34" text-anchor="end">5200</text><text x="44" y="84" text-anchor="end">4800</text><text x="44" y="134" text-anchor="end">4400</text><text x="44" y="184" text-anchor="end">4000</text>
<text x="70" y="252" text-anchor="middle">Jan</text><text x="160" y="252" text-anchor="middle">Feb</text><text x="250" y="252" text-anchor="middle">Mar</text><text x="340" y="252" text-anchor="middle">Apr</text><text x="430" y="252" text-anchor="middle">Mei</text><text x="495" y="252" text-anchor="middle">Jun</text>
</g>
<polyline points="70,33 160,43 250,58 340,83 430,113 495,148" fill="none" stroke="var(--c1)" stroke-width="3"/>
<g fill="var(--c1)"><circle cx="70" cy="33" r="4"/><circle cx="160" cy="43" r="4"/><circle cx="250" cy="58" r="4"/><circle cx="340" cy="83" r="4"/><circle cx="430" cy="113" r="4"/><circle cx="495" cy="148" r="4"/></g>
<line x1="495" y1="148" x2="430" y2="60" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4,3"/>
<rect x="300" y="30" width="180" height="52" rx="8" fill="var(--error-soft)" stroke="var(--error)"/>
<text x="390" y="50" text-anchor="middle" font-size="12" font-weight="700" fill="var(--error)" font-family="var(--font-ui)">-22% dalam 6 bulan</text>
<text x="390" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">85% dari dine-in</text>
<text x="70" y="20" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Revenue (juta Rp)</text>
<text x="390" y="110" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Satu chart, satu pesan:</text>
<text x="390" y="126" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">dine-in yang bocor, bukan semua segmen.</text>
</svg>`;

export const biz7: V2Lesson = {
  slug: "biz7-storytelling",
  track: "Business Intelligence",
  module: "Insight & Komunikasi",
  title: "BI7 — Data Storytelling untuk Eksekutif",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "47 slide yang tidur, 3 slide yang menang",
      prose: [
        "Dimas, analis di bank digital, presentasi 47 slide ke direksi: metodologi, 20 chart, appendix 15 halaman. Slide 12, direktur utama mulai membalas chat. Slide 30, dua direksi izin ke toilet. Budget penelitiannya tidak disetujui — bukan karena datanya lemah, tapi karena tidak ada yang mendengar kesimpulannya.",
        "Minggu depannya ia kembali dengan 3 slide. Slide 1: \u201CRevenue turun 22% dalam 6 bulan — 85% dari dine-in.\u201D Slide 2: satu chart dengan anotasi. Slide 3: \u201CKita kehilangan Rp13,8 miliar per tahun jika dibiarkan; usulan: program dine-in experience, biaya Rp1,2 miliar.\u201D Budget disetujui dalam 11 menit.",
        "Twist-nya: data yang dipakai IDENTIK. Yang berubah hanya urutan penyajian: kesimpulan dulu, bukti kemudian, aksi di akhir. Eksekutif tidak kekurangan data — mereka kekurangan alasan untuk peduli.",
        "Di lesson ini kamu akan bisa: (1) menyusun narasi piramida (kesimpulan → bukti → aksi); (2) mengekstrak 3 angka narasi dari data (headline, driver, so-what); (3) membuat satu chart satu pesan dengan anotasi; (4) memilih format komunikasi per audiens.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengubah temuan analisis menjadi narasi 5 menit yang menggerakkan keputusan.",
        "(1) Menyusun temuan dalam struktur piramida Minto: kesimpulan berdampak terbesar dulu, bukti menyusul;",
        "(2) Memilih SATU angka pembuka = dampak × keyakinan tertinggi, bukan angka yang paling dramatis;",
        "(3) Mengekstrak 3 angka narasi dari data mentah (penurunan, driver, kerugian tahunan);",
        "(4) Menjelaskan kenapa kronologi pengerjaan adalah struktur presentasi terburuk.",
      ],
      tasks: [],
    },

    {
      id: "piramida",
      eyebrow: "Langkah 3 · Piramida",
      title: "Piramida: kesimpulan dulu, bukti kemudian",
      prose: [
        "Pola pikir analis: data → analisis → temuan → kesimpulan (bottom-up). Pola pikir eksekutif: kesimpulan → bukti → aksi (top-down). Storytelling adalah menerjemahkan yang pertama menjadi yang kedua — piramida terbalik.",
        "Struktur 3 menit: MENIT 0-1 — headline: satu kalimat kesimpulan + angka. (\u201CRevenue turun 22% dalam 6 bulan.\u201D) MENIT 1-2 — driver: kenapa, dengan bukti satu chart. (\u201C85% penurunan dari dine-in.\u201D) MENIT 2-3 — so-what: dampak dan aksi yang diminta. (\u201CRp13,8M/tahun terancam; minta Rp1,2M untuk program.\u201D)",
        "Uji \u201Cso what?\u201D: setiap angka yang kamu tampilkan harus lolos pertanyaan \u201Cjadi apa?\u201D. \u201CConversion 3,2%\u201D → so what? \u201CTurun 15,8%, artinya 400 transaksi hilang per minggu.\u201D → so what? \u201CRp156 juta/minggu terancam.\u201D Berhenti saat sampai pada uang, risiko, atau keputusan.",
        "💡 Intuisi kunci: eksekutif membuat keputusan dalam 3 menit pertama; 27 menit sisanya hanya konfirmasi. Jika kesimpulanmu ada di slide 40, kamu tidak punya 3 menit — kamu punya 0 menit.",
      ],
      formula: String.raw`K_{segmen} = \frac{\Delta_{segmen}}{\Delta_{total}} \qquad \text{SoWhat} = \Delta_{bulanan} \times 12`,
      formulaNote:
        "K = kontribusi segmen terhadap total penurunan: selisih segmen dibagi total selisih. Dine-in: 980/1150 = 85,2% — dialah \u201Cpenjahatnya\u201D. SoWhat = dampak tahunan jika dibiarkan: Rp1.150 juta/bulan × 12 = Rp13,8 miliar — angka yang membuat direksi peduli.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: storytelling = mempercantik chart",
        body: "Storytelling bukan soal warna dan font — itu styling. Storytelling adalah soal URUTAN dan SELEKSI: kesimpulan dulu, satu pesan per chart, buang 90% analisis yang tidak mendukung keputusan. Chart cantik tanpa narasi tetap 47 slide yang tidur.",
      },
    },
    {
      id: "satu-chart",
      eyebrow: "Langkah 4 · Satu chart satu pesan",
      title: "Satu chart, satu pesan, satu anotasi",
      prose: [
        "Aturan: tiap chart menjawab tepat satu pertanyaan dan membawa satu anotasi yang menuliskan jawabannya. Chart tanpa anotasi memaksa pembaca menebak — dan eksekutif tidak punya waktu menebak.",
        "Cara membaca: garis turun dari 5.200 ke 4.050 (juta Rp) selama 6 bulan. Kotak merah beranotasi langsung pada titik akhir: \u201C-22% dalam 6 bulan, 85% dari dine-in\u201D. Pembaca tidak perlu menghitung — jawabannya tertulis.",
        "Interpretasi: anotasi mengubah chart dari \u201Cdata\u201D menjadi \u201Cpesan\u201D. Tanpa anotasi, tiap direksi menarik kesimpulan sendiri (dan berbeda). Dengan anotasi, semua melihat pesan yang sama: dine-in yang bocor, bukan semua segmen.",
        "Teknik anotasi: lingkari titik penting, tulis angkanya, tulis artinya dalam bahasa bisnis. \u201C85% dari dine-in\u201D lebih kuat dari sekadar garis merah — ia memberi tahu MENGAPA garisnya turun.",
        "💡 Intuisi kunci: jika chart-mu butuh penjelasan lisan lebih dari 20 detik, chart-nya yang salah, bukan audiensnya. Tulis penjelasan itu sebagai anotasi, lalu diam dan biarkan chart bicara.",
      ],
      figure: {
        svg: STORY_SVG,
        alt: "Garis revenue 6 bulan menurun dengan anotasi minus 22 persen, 85 persen dari dine-in.",
        caption: "Satu chart, satu pesan: garis turun + anotasi yang menuliskan kesimpulan. Tidak perlu penjelasan lisan.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: semakin banyak chart semakin meyakinkan",
        body: "20 chart tidak 20x lebih meyakinkan — ia 20x lebih membingungkan. Keyakinan datang dari SATU bukti yang tak terbantahkan, bukan dari hujan bukti. Pilih chart terkuatmu, buang sisanya ke appendix. Appendix ada untuk ditanya, bukan untuk dipresentasikan.",
      },
    },
    {
      id: "lab-narasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: ekstrak 3 angka narasi dari data",
      prose: [
        "Data revenue bulanan + per segmen Kopi Nusantara tersedia. Tugasmu: (1) hitung `drop_pct` Jan→Jun; (2) hitung `kontrib` tiap segmen terhadap penurunan dan temukan `driver`-nya; (3) hitung `annual_loss_jt` (dampak tahunan) dan cetak ketiganya — inilah kerangka 3 menitmu.",
        "Coba juga: susun kalimat headline-mu dalam SATU baris tidak lebih dari 20 kata memakai tiga angka ini. Jika lebih dari 20 kata, pangkas lagi — direksi mengingat kalimat, bukan paragraf.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `drop_pct` revenue Jan → Jun" },
        { id: "t2", text: "Hitung `kontrib` per segmen, temukan `driver`" },
        { id: "t3", text: "Hitung `annual_loss_jt`, cetak 3 angka narasi" },
      ],
      expected: "drop=-0.2212  driver=dine-in (0.8522)  loss=13800jt/thn",
      note: {
        title: "Sering salah",
        body: "Menghitung kontribusi dari revenue absolut segmen, bukan dari PENURUNAN-nya. Segmen terbesar belum tentu pendorong penurunan — yang dicari adalah siapa yang paling banyak HILANG, bukan siapa yang paling besar.",
      },
      hints: [
        "drop_pct = (jun - jan) / jan.",
        "decline_segmen = jan_segmen - jun_segmen; kontrib = decline_segmen / total_decline.",
        "driver = max(kontrib, key=kontrib.get); annual_loss_jt = total_decline * 12.",
      ],
      code: {
        starter: `rev = [5200, 5100, 4950, 4700, 4400, 4050]  # juta Rp, Jan-Jun\nseg_jan = {"dine-in": 2600, "takeaway": 1560, "online": 1040}\nseg_jun = {"dine-in": 1620, "takeaway": 1450, "online": 980}\n\n# TULIS KODEMU: drop_pct, kontrib, driver, annual_loss_jt\ndrop_pct = 0.0\nkontrib = {}\ndriver = ""\nannual_loss_jt = 0\n\nprint(f"drop={drop_pct:.4f}  driver={driver} ({kontrib.get(driver,0):.4f})  loss={annual_loss_jt}jt/thn")`,
        lockLines: 3,
        solution: `rev = [5200, 5100, 4950, 4700, 4400, 4050]  # juta Rp, Jan-Jun\nseg_jan = {"dine-in": 2600, "takeaway": 1560, "online": 1040}\nseg_jun = {"dine-in": 1620, "takeaway": 1450, "online": 980}\n\n# TULIS KODEMU: drop_pct, kontrib, driver, annual_loss_jt\ndrop_pct = (rev[-1] - rev[0]) / rev[0]\ndecline = {k: seg_jan[k] - seg_jun[k] for k in seg_jan}\ntotal = sum(decline.values())\nkontrib = {k: v / total for k, v in decline.items()}\ndriver = max(kontrib, key=kontrib.get)\nannual_loss_jt = total * 12\n\nprint(f"drop={drop_pct:.4f}  driver={driver} ({kontrib.get(driver,0):.4f})  loss={annual_loss_jt}jt/thn")`,
        checks: [
          { kind: "equal", task: "t1", name: "drop_pct", value: -0.2212, tol: 0.0001, label: "`drop_pct` = -0.2212", msg: "(4050-5200)/5200." },
          { kind: "equal", task: "t2", name: "driver", value: "dine-in", label: "`driver` = dine-in", msg: "Penurunan terbesar: 980 dari dine-in." },
          { kind: "equal", task: "t3", name: "annual_loss_jt", value: 13800, tol: 1e-9, label: "`annual_loss_jt` = 13800", msg: "1150 juta/bulan × 12." },
          { kind: "stdout_matches", task: "t3", pattern: "drop=-0\\.2212\\s+driver=dine-in \\(0\\.8522\\)\\s+loss=13800jt/thn", label: "`print` menampilkan 3 angka", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "max(dict, key=dict.get) untuk kunci bernilai terbesar.",
    },    {
      id: "lab2-piramida-narasi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: susun piramida narasi dari data",
      prose: [
        "Empat temuan, satu slot presentasi 5 menit. Prinsip piramida Minto: mulai dari yang paling berdampak, bukan dari kronologi pengerjaan. Tugasmu: urutkan temuan berdasar dampak, totalkan 3 teratas, dan pilih SATU pembuka = dampak × keyakinan tertinggi.",
        "Perhatikan: temuan berdampak terbesar (retur fashion, 420 jt) juga berkeyakinan tinggi (0,9) — pembuka ideal. Kalau yang terbesar keyakinannya rendah, pembuka yang jujur adalah yang terbesar DAN meyakinkan.",
        "Coba juga: apa jadinya jika keyakinan 'stok kosong' naik ke 0,95? Pembuka bisa bergeser — narasi yang baik diperbarui saat bukti berubah.",
      ],
      tasks: [
        { id: "t1", text: "Urutkan `temuan` by dampak menurun → `urutan_nama`" },
        { id: "t2", text: "Hitung `total_top3`: jumlah dampak 3 teratas" },
        { id: "t3", text: "Tentukan `pembuka`: nama dengan dampak × keyakinan max" },
      ],
      expected: "urutan=['retur naik di segmen fashion', 'ongkir gratis disalahgunakan', 'stok kosong SKU top', 'checkout lambat di Android']",
      note: {
        title: "Sering salah",
        body: "Memilih pembuka = dampak terbesar saja, mengabaikan keyakinan. Membuka dengan klaim raksasa yang goyah = kredibilitas presentasi runtuh di menit pertama.",
      },
      hints: [
        "sorted(temuan, key=lambda t: t[1], reverse=True).",
        "total_top3 = sum 3 elemen pertama urutan.",
        "pembuka = max(temuan, key=lambda t: t[1]*t[2])[0].",
      ],
      code: {
        starter: `# Temuan analisis: (nama, dampak_jt_per_tahun, keyakinan_0_1)\ntemuan = [\n    ("retur naik di segmen fashion", 420, 0.9),\n    ("ongkir gratis disalahgunakan", 310, 0.7),\n    ("checkout lambat di Android", 180, 0.95),\n    ("stok kosong SKU top", 260, 0.6),\n]\n# TULIS KODEMU: urutan_nama, total_top3, pembuka\nurutan_nama = []\ntotal_top3 = 0\npembuka = ''\n`,
        lockLines: 7,
        solution: `# Temuan analisis: (nama, dampak_jt_per_tahun, keyakinan_0_1)\ntemuan = [\n    ("retur naik di segmen fashion", 420, 0.9),\n    ("ongkir gratis disalahgunakan", 310, 0.7),\n    ("checkout lambat di Android", 180, 0.95),\n    ("stok kosong SKU top", 260, 0.6),\n]\n\n# TULIS KODEMU: urutan, total_top3, pembuka\nurutan = sorted(temuan, key=lambda t: t[1], reverse=True)\nurutan_nama = [t[0] for t in urutan]\ntotal_top3 = sum(t[1] for t in urutan[:3])\npembuka = max(temuan, key=lambda t: t[1] * t[2])[0]\n\nprint(f"urutan={urutan_nama}")\nprint(f"total_top3={total_top3}")\nprint(f"pembuka={pembuka}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "urutan=\\['retur naik di segmen fashion', 'ongkir gratis disalahgunakan'", label: "urutan dampak benar", msg: "Urut menurun: 420, 310, 260, 180." },
          { kind: "equal", task: "t2", name: "total_top3", value: 990, label: "`total_top3` = 990", msg: "420+310+260." },
          { kind: "equal", task: "t3", name: "pembuka", value: "retur naik di segmen fashion", label: "`pembuka` tepat", msg: "dampak × keyakinan tertinggi: 420×0,9." },
        ],
      },
      reference: "Struktur piramida Minto: kesimpulan dulu (dampak terbesar), bukti menyusul.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Audiens mengingat maksimal 3 angka dari presentasimu. Pilih ketiganya dengan sengaja (penurunan, driver, kerugian) — atau mereka akan mengingat 3 angka yang salah.",
        "💡 Jangan pernah membuka dengan metodologi. 'Kami menganalisis 2 juta baris...' membuat audiens menguap; 'Kita kehilangan 420 juta per tahun dari retur fashion' membuat mereka duduk tegak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: setiap slide harus lolos uji 'jadi apa?'",
        body: "Setiap chart dalam presentasimu harus bisa menjawab satu pertanyaan kejam: \"jadi apa?\" — dan jawabannya harus berupa tindakan, bukan kekaguman. \"Retensi turun 12%\" bukan jawaban; itu fakta. \"Jadi kita harus menghentikan diskon akuisisi bulan depan karena pelanggan diskon churn 3x lipat\" — itu jawaban. Praktisi storytelling tahu: slide yang berhenti di level insight (\"menarik ya\") adalah hiburan, bukan analisis. Rantai yang wajib dilalui setiap slide: data → insight → implikasi → rekomendasi. Kalau kamu tidak bisa menulis \"maka kita harus ___\" di bawah sebuah chart, chart itu milik appendix, bukan panggung utama. Heuristik penyusunannya: tulis keputusan yang kamu inginkan di selembar kertas SEBELUM membuka data — lalu cari bukti yang mendukung DAN bukti yang membunuhnya. Ini bukan cherry-picking; ini kejujuran yang terstruktur, karena kamu memaksa dirimu mencari pembunuhnya juga. Aturan 3-angka tetap berlaku: audiens hanya mengingat tiga angka, jadi pilih ketiganya dengan sengaja — masalahnya, penyebabnya, harganya — sisanya appendix. Dan uji terakhir sebelum presentasi: bacakan hanya judul-judul slidemu berurutan. Kalau judul-judul itu tidak membentuk cerita yang masuk akal (\"kita kehilangan X karena Y, maka lakukan Z\"), slidemmu adalah tumpukan fakta, bukan narasi. Keputusan yang baik lahir dari cerita yang tak terhindarkan — setelah melihat buktimu, audiens merasa tidak punya pilihan selain setuju.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: format per audiens",
      prose: [
        "Skenario 1 — Direksi (waktu: 3-10 menit, mau: keputusan). → 3 slide: headline, bukti 1 chart, aksi + biaya. Kirim 1-pager sebelum rapat.",
        "Skenario 2 — Manajer (waktu: 30 menit, mau: apa yang harus dilakukan timnya). → 5-8 slide: headline, 2-3 driver, rencana aksi per tim, target.",
        "Skenario 3 — Sesama analis / tim data (waktu: 1 jam, mau: metodologi). → Baru boleh 47 slide: tunjukkan asumsi, robustness check, appendix. Di sinilah detail dihargai.",
        "Skenario 4 — Async (tidak ada rapat). → Memo 1 halaman: kesimpulan di paragraf pertama, chart beranotasi, keputusan yang diminta + deadline. Jangan kirim deck tanpa narasi tertulis.",
        "Skenario 5 — Krisis (angka buruk, cepat). → Headline jujur di 30 detik pertama + apa yang sudah dilakukan + apa yang diminta. Menyembunyikan kabar buruk menghancurkan kepercayaan permanen.",
        "Aturan praktis 10 detik: tulis dulu kalimat keputusan yang kamu inginkan dari audiens. Lalu susun mundur: aksi → bukti → headline. Jika kalimat keputusannya tidak jelas, jangan buat slide dulu.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: narasi 3 menit untuk retensi",
      prose: [
        "Konteks: aplikasi bank digital, retensi 90 hari turun dari 41% ke 33% dalam 2 kuartal. Data: kohort Q1 2026 (50 ribu user) retensi 38%; kohort Q2 (80 ribu user, hasil kampanye besar) retensi 29%. Kampanye mendatangkan user berkualitas rendah.",
        "Narasi 3 menit: MENIT 1 — \u201CRetensi 90 hari turun 41% → 33%. Bukan produk yang memburuk — komposisi user yang berubah.\u201D MENIT 2 — satu chart: dua garis kohort + anotasi \u201CQ2: 80rb user kampanye, retensi 29% vs 38%\u201D. MENIT 3 — \u201CSo what: tiap 1% retensi = Rp2,1M LTV/tahun. Usulan: ubah KPI kampanye dari jumlah install ke retensi 30 hari; biaya nol, hanya ubah insentif.\u201D",
        "Kenapa menang: ia menjawab \u201Ckenapa\u201D (komposisi, bukan produk), memberi angka uang (Rp2,1M per 1%), dan aksinya murah (ubah KPI). Tiga menit, satu keputusan.",
        "💡 Intuisi kunci: narasi terbaik selalu punya \u201Cmusuh\u201D yang spesifik (kampanye berkualitas rendah) — bukan \u201Ckondisi pasar\u201D yang abstrak. Musuh yang spesifik bisa dilawan; kondisi abstrak hanya bisa dikeluhkan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang data storytelling. Ingat: kesimpulan dulu.",
      ],
      tasks: [],
      summary: [
        "Struktur 3 menit: headline (1') → driver + 1 chart (1') → so-what + aksi (1').",
        "Tiap angka harus lolos uji \u201Cso what?\u201D sampai menyentuh uang, risiko, atau keputusan.",
        "Satu chart satu pesan + anotasi yang menuliskan kesimpulan.",
        "Kontribusi dihitung dari penurunan, bukan dari ukuran absolut.",
        "Format mengikuti audiens: 3 slide direksi, memo async, 47 slide hanya untuk sesama analis.",
      ],
      next: { label: "BI8 — Analisis Adhoc yang Cepat & Benar", href: "/v2/learn/biz8-adhoc" },
      quiz: [
        {
          q: "47 slide gagal, 3 slide menang dengan data identik. Faktor pembedanya?",
          options: [
            { text: "Font yang lebih bagus", why: "Styling bukan penyebab kegagalan 47 slide." },
            { text: "Urutan piramida: kesimpulan dulu, bukti kemudian, aksi di akhir", why: "Tepat: eksekutif memutuskan di menit awal; kesimpulan di akhir = tidak pernah didengar.", correct: true },
            { text: "Slide yang lebih sedikit pasti menang", why: "Sedikit tapi tanpa struktur tetap gagal." },
            { text: "Direksinya sedang baik hati", why: "Bukan faktor yang bisa diandalkan." },
          ],
        },
        {
          q: "\u201CConversion 3,2%\u201D belum lolos uji so-what. Versi yang lolos?",
          options: [
            { text: "Conversion 3,2% (n=12.400)", why: "Menambah n tidak menjawab \u201Cjadi apa?\u201D." },
            { text: "Turun 15,8% = ~400 transaksi hilang/minggu ≈ Rp156 jt/minggu terancam", why: "Tepat: sampai pada uang dan keputusan.", correct: true },
            { text: "Conversion 3,2% dengan CI 95%", why: "Presisi statistik bukan so-what bisnis." },
            { text: "Dihitung dengan metode yang benar", why: "Metode benar tidak sama dengan relevan." },
          ],
        },
        {
          q: "Chart untuk direksi sebaiknya…",
          options: [
            { text: "Menampilkan semua data mentah", why: "Itu pekerjaan analis, bukan direksi." },
            { text: "Satu pesan + anotasi yang menuliskan kesimpulan", why: "Tepat: pembaca mendapat pesan yang sama tanpa penjelasan lisan.", correct: true },
            { text: "Tanpa angka agar sederhana", why: "Tanpa angka tidak ada bukti." },
            { text: "3D agar menarik", why: "3D merusak akurasi baca." },
          ],
        },
        {
          q: "Driver penurunan dicari dari…",
          options: [
            { text: "Segmen dengan revenue terbesar", why: "Terbesar belum tentu yang paling banyak hilang." },
            { text: "Segmen dengan penurunan terbesar (kontribusi thd total decline)", why: "Tepat: K = Δ_segmen / Δ_total.", correct: true },
            { text: "Segmen yang paling disukai tim", why: "Bukan kriteria analitis." },
            { text: "Segmen dengan pertumbuhan tertinggi", why: "Pertumbuhan tidak menjelaskan penurunan." },
          ],
        },
        {
          q: "Tidak ada rapat, hanya kirim async. Format terbaik?",
          options: [
            { text: "Deck 47 slide via email", why: "Tanpa narasi lisan, deck = teka-teki." },
            { text: "Memo 1 halaman: kesimpulan dulu + chart beranotasi + keputusan diminta", why: "Tepat: mandiri dibaca tanpa presenter.", correct: true },
            { text: "Screenshot dashboard", why: "Tanpa narasi, pembaca menebak sendiri." },
            { text: "File Excel mentah", why: "Itu melempar pekerjaan analisis ke pembaca." },
          ],
        },
        {
          q: "Presentasi 5 menit ke direksi tentang temuan 3 bulan. Struktur pembuka terbaik?",
          options: [
            { text: "Kronologi: mulai dari data collection hingga analisis", why: "Kronologi adalah struktur terburuk untuk eksekutif: 4 menit berlalu sebelum mereka tahu kenapa harus peduli." },
            { text: "Satu kalimat: kerugian terbesar + angkanya, lalu 2 pendukung", why: "Tepat piramida Minto: 'Kita kehilangan 420 jt/tahun dari retur fashion' — duduk tegak dulu, bukti menyusul. Ingatan audiens = 3 angka; pilih ketiganya.", correct: true },
            { text: "Metodologi dulu agar kredibel", why: "Kredibilitas datang dari angka yang bisa diverifikasi, bukan dari penjelasan metode di menit pertama." },
            { text: "Semua 12 temuan diringkas rata", why: "12 temuan dalam 5 menit = 25 detik per temuan = tidak ada yang diputuskan." },
          ],
        },
      ],
    },
  ],
};
