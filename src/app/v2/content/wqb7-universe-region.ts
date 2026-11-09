import type { V2Lesson } from "../lib/types";

const FIG_UNIV = `<svg viewBox="0 0 480 260" role="img" aria-label="Universe TOP3000 dari seluruh saham AS.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Universe: dari 8000+ saham ke TOP3000</text>
<rect x="16" y="44" width="448" height="34" fill="var(--c4)" opacity="0.35"/>
<text x="24" y="66" font-size="12" fill="var(--chart-text)">Semua saham AS (~8000): termasuk yang tidak likuid &amp; datanya bolong</text>
<rect x="16" y="92" width="168" height="34" fill="var(--c2)" opacity="0.9"/>
<text x="24" y="114" font-size="12" fill="var(--chart-text)">TOP3000: 3000 terbesar, likuid</text>
<text x="200" y="114" font-size="12" fill="var(--chart-text)">← universe simulasi</text>
<line x1="16" y1="150" x2="464" y2="150" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="5 4"/>
<text x="16" y="176" font-size="11" fill="var(--chart-text)">Cara membaca: kotak kecil di dalam kotak besar = universe adalah SUBSET yang disaring.</text>
<text x="16" y="196" font-size="11" fill="var(--chart-text)">Interpretasi: alpha hanya 'hidup' di dalam kotak kecil — di luar itu tidak diuji,</text>
<text x="16" y="214" font-size="11" fill="var(--chart-text)">tidak dinilai, dan tidak bisa disubmit.</text>
</g>
</svg>`;

export const wqb7: V2Lesson = {
  slug: "wqb7-universe-region",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB7 — Universe & Region: Di Mana Alpha Boleh Hidup",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Alpha yang hidup di Excel, mati di platform",
      prose: [
        "Seorang peneliti membawa hasil backtest pribadinya: Sharpe 2,2 pada 150 saham small-cap pilihannya, dihitung di Excel dengan data Yahoo Finance. 'Tinggal dipindah ke platform,' katanya. Tiga jam kemudian ia kembali dengan wajah masam: separuh sahamnya tidak ada di universe, seperempat datanya tidak lolos quality check, dan Sharpe 2,2-nya menyusut menjadi 0,7 pada universe resmi.",
        "Bukan karena idenya jelek. Karena 'di mana' sama pentingnya dengan 'apa'. Universe resmi (TOP3000 USA) menyaring saham-saham tidak likuid tempat backtest Excel-nya berpesta — spread dan slippage yang ia abaikan. Region yang ia harapkan (Asia) bahkan tidak bisa dibuka — akses datanya terkunci di balik status yang belum ia miliki.",
        "Twist-nya: Sharpe 2,2 itu BENAR — untuk 150 saham pilihannya, di dunianya sendiri. Yang salah adalah mengira angka itu bisa dibawa pindah dunia. Alpha tidak hidup di ruang hampa; ia hidup di dalam universe dan region tertentu. Lesson ini memetakan kedua penjara — dan kebebasan — itu.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan apa itu universe dan kenapa TOP3000 dipilih; (2) menjelaskan perbedaan region USA/ASI/EUR/GLB; (3) menjelaskan kenapa region non-USA terkunci sebelum status Research Consultant; (4) memprediksi apa yang terjadi pada alpha yang 'pindah universe'; (5) menyusun strategi riset yang realistis di dalam batasan akses.",
      ],
      tasks: [],
      note: {
        title: "Dua penjara",
        body: "Universe = saham mana yang boleh dipakai. Region = negara mana yang datanya boleh dibuka. Keduanya adalah batas arena — alpha yang hebat di luar arena tidak dihitung.",
      },
      reference: "Alpha tidak hidup di ruang hampa — ia hidup di universe & region.",
    },
    {
      id: "universe",
      eyebrow: "Langkah 2 · Konsep",
      title: "Universe: saringan pertama",
      prose: [
        "Universe = daftar saham yang menjadi bahan simulasi. USA TOP3000 = 3000 saham AS terbesar berdasarkan kapitalisasi pasar, diperbarui berkala. Dari ~8000 saham tercatat di AS, hanya 3000 teratas yang masuk — sisanya (micro-cap, tidak likuid, data bolong) disingkirkan sebelum riset dimulai.",
        "Kenapa disaring? Tiga alasan. Satu: likuiditas — saham kecil spread-nya lebar, slippage backtest Excel tidak tertangkap. Dua: kualitas data — saham kecil sering punya data kosong/rusak yang meracuni statistik. Tiga: eksekusi nyata — alpha yang hanya bekerja di saham yang tidak bisa dibeli dalam jumlah besar = mainan, bukan strategi.",
        "Contoh terperinci. Saham ZZZ, kapitalisasi peringkat 5.412: spread bid-ask 3%, volume harian Rp50 juta. Sinyal 'beli ZZZ' di backtest Excel untung 40% setahun. Di universe resmi ZZZ tidak ada — dan kalaupun ada, market impact dari order Rp1 miliar akan menghapus 40% itu dalam seminggu. Universe melindungimu dari meneliti hal yang tidak bisa dieksekusi.",
        "Contoh kedua — efek universe pada Sharpe yang dilaporkan. Sebuah sinyal diuji pada dua universe: (a) 500 saham teratas: Sharpe 1,1 (saham besar = efisien, sinyal lemah); (b) saham peringkat 500–3000: Sharpe 2,3 (saham menengah = kurang efisien, sinyal kuat). Sharpe gabungan TOP3000: 1,7. Pelajarannya: angka Sharpe TANPA menyebut universe = tidak lengkap — seperti menyebut 'suhu 30°' tanpa menyebut Celcius atau Fahrenheit. Selalu tanyakan universe-nya sebelum membandingkan dua Sharpe.",
        "Cara membaca figur: kotak besar = semua saham AS; kotak kecil di dalamnya = TOP3000. Interpretasi: semua metrik alpha (Sharpe, fitness, turnover) hanya bermakna DI DALAM kotak kecil. Membandingkan alpha beda universe = membandingkan apel di dua planet berbeda.",
      ],
      figure: {
        svg: FIG_UNIV,
        alt: "Kotak kecil TOP3000 di dalam kotak besar semua saham AS.",
        caption: "Universe = subset yang disaring. Alpha hanya hidup di dalamnya.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Universe lebih kecil = hasil lebih buruk, jadi platform merugikan saya.” Terbalik: universe menyaring hal yang TIDAK BISA dieksekusi. Alpha yang lolos di TOP3000 jauh lebih mungkin bertahan di dunia nyata daripada juara Excel di saham gorengan.",
      },
      hints: [
        "TOP3000 ≈ 3000 saham AS terbesar, terlikuid, datanya paling bersih.",
        "Semua angka alpha hanya bermakna di dalam universe tempat ia diuji.",
      ],
      reference: "Universe = saringan likuiditas & kualitas data sebelum riset dimulai.",
    },
    {
      id: "region",
      eyebrow: "Langkah 3 · Konsep",
      title: "Region: peta yang sebagian terkunci",
      prose: [
        "Region = wilayah geografis data: USA (Amerika Serikat), ASI (Asia), EUR (Eropa), GLB (global). Setiap region punya universe, data field, dan karakteristik pasar sendiri — sinyal yang bekerja di USA belum tentu bekerja di ASI.",
        "Aturan akses platform: sebelum berstatus Research Consultant, yang terbuka hanyalah USA. Ini bukan kejahatan — ini kebijakan data: lisensi data tiap region berbeda, dan akses penuh adalah hak yang menyertai status resmi. Praktiknya: seluruh riset tahap awal difokuskan ke USA TOP3000, delay 1.",
        "Implikasi strategisnya besar. Satu: jangan menghabiskan waktu merancang 'alpha Asia' sebelum pintunya terbuka — simulasinya akan error. Dua: USA adalah pasar paling efisien di dunia; alpha yang lolos di USA membawa kredensial berat. Tiga: saat status konsultan tiba, region baru = ladang baru — tetapi itu ekspansi tahap dua, bukan tahap satu.",
        "Miskonsepsi: 'saya akan riset di region lain pakai data luar, lalu pindah.' Masalahnya: definisi field, universe, dan aturan eksekusi tiap region berbeda — alpha tidak portabel mentah-mentah. Riset di luar arena = riset yang harus diulang dari nol saat arena dibuka.",
        "Sisi terang dari penantian: saat status konsultan tiba, kamu tidak mulai dari nol. Skill yang terasah di USA — membaca fitness, diet turnover, berpikir klaster — 100% portabel; yang berubah hanya bahan bakunya. Tim yang disiplin di USA biasanya justru lebih cepat di region baru daripada tim yang 'langsung' ke sana tanpa fondasi. Delapan bulan fokus USA + satu bulan ekspansi ASI mengalahkan sembilan bulan setengah-setengah di dua region — karena yang kedua tidak pernah diizinkan sejak awal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Region lain pasti lebih mudah karena kurang efisien.” Mungkin benar — tetapi kamu tidak bisa membuktikannya sebelum pintunya terbuka. Merencanakan strategi di atas asumsi yang belum bisa diuji = membangun di atas kabut.",
      },
      hints: [
        "Fokus 100% ke USA TOP3000 sampai status konsultan tiba.",
        "Catat ide region lain di backlog — jangan eksekusi.",
      ],
      reference: "USA dulu sampai konsultan; region lain = ekspansi tahap dua.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab",
      title: "Saring universe & ukur efeknya",
      prose: [
        "Diberikan 10 saham mainan dengan kapitalisasi pasar dan spread. Tugasmu: (1) saring TOP5 berdasarkan kapitalisasi (universe mainan); (2) hitung rata-rata spread di dalam vs di luar universe; (3) putuskan: apakah alpha yang 'hanya bekerja di luar universe' layak dikejar?",
        "Eksperimen setelah selesai: ubah universe menjadi TOP3 — bagaimana rata-rata spread di dalamnya? Rasakan trade-off: universe sempit = bersih tetapi sedikit peluang.",
      ],
      tasks: [
        { id: "t1", text: "Saring 5 saham kapitalisasi terbesar" },
        { id: "t2", text: "Hitung rata-rata spread dalam vs luar universe" },
        { id: "t3", text: "Jalankan dan baca verdict" },
      ],
      expected: "Universe TOP5: ['A', 'C', 'E', 'G', 'I']\nSpread dalam: 0.40%\nSpread luar: 2.30%\nVerdict: KEJAR DALAM — spread 5.7x lebih murah",
      note: {
        title: "Intuisi",
        body: "Spread adalah pajak yang dibayar setiap putaran. Universe menyaring saham berpajak tinggi — alpha yang hidup di dalamnya otomatis membayar pajak lebih murah.",
      },
      hints: [
        "Urutkan berdasarkan market_cap menurun, ambil 5 pertama.",
        "Rata-rata = sum/len; bandingkan keduanya.",
      ],
      code: {
        starter: "# (nama, kapitalisasi_M, spread_%)\n# JANGAN UBAH data.\nsaham = [(\"A\", 900, 0.2), (\"B\", 120, 2.1), (\"C\", 750, 0.3),\n          (\"D\", 90, 2.8), (\"E\", 600, 0.4), (\"F\", 70, 1.9),\n          (\"G\", 500, 0.5), (\"H\", 60, 2.5), (\"I\", 400, 0.6),\n          (\"J\", 40, 2.2)]\n\n# TULIS KODEMU\nby_cap = \nuniverse = \ndalam = \nluar = \nrd = \nrl = \nprint(f\"Universe TOP5: {universe}\")\nprint(f\"Spread dalam: {rd:.2f}%\")\nprint(f\"Spread luar: {rl:.2f}%\")\nprint(f\"Verdict: KEJAR DALAM — spread {rl/rd:.1f}x lebih murah\")\n",
        lockLines: 8,
        solution: "# (nama, kapitalisasi_M, spread_%)\n# JANGAN UBAH data.\nsaham = [(\"A\", 900, 0.2), (\"B\", 120, 2.1), (\"C\", 750, 0.3),\n          (\"D\", 90, 2.8), (\"E\", 600, 0.4), (\"F\", 70, 1.9),\n          (\"G\", 500, 0.5), (\"H\", 60, 2.5), (\"I\", 400, 0.6),\n          (\"J\", 40, 2.2)]\n\n# TULIS KODEMU\nby_cap = sorted(saham, key=lambda s: s[1], reverse=True)\nuniverse = [s[0] for s in by_cap[:5]]\ndalam = [s[2] for s in by_cap[:5]]\nluar = [s[2] for s in by_cap[5:]]\nrd = sum(dalam) / len(dalam)\nrl = sum(luar) / len(luar)\nprint(f\"Universe TOP5: {universe}\")\nprint(f\"Spread dalam: {rd:.2f}%\")\nprint(f\"Spread luar: {rl:.2f}%\")\nprint(f\"Verdict: KEJAR DALAM — spread {rl/rd:.1f}x lebih murah\")\n",
        checks: [
          { kind: "stdout_matches", task: "t3", label: "Universe TOP5 benar", msg: "Urut kapitalisasi: A 900, C 750, E 600, G 500, I 400.", pattern: "Universe TOP5: \\['A', 'C', 'E', 'G', 'I'\\]" },
          { kind: "stdout_matches", task: "t3", label: "Spread dalam 0,40%", msg: "(0,2+0,3+0,4+0,5+0,6)/5 = 0,40.", pattern: "Spread dalam: 0\\.40%" },
          { kind: "stdout_matches", task: "t3", label: "Verdict tercetak", msg: "2,30/0,40 = 5,75 → tampil 5,7x (float).", pattern: "Verdict: KEJAR DALAM" }
        ],
      },
      reference: "Universe = pajak murah. Di luarnya, spread memakan alpha.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Bermain di dalam arena",
      prose: [
        "Satu: ide memakai saham di luar TOP3000 → buang atau cari versi TOP3000-nya; jangan kejar yang tidak bisa disubmit. Dua: ide butuh data region terkunci → masukkan backlog, kerjakan versi USA-nya dulu. Tiga: alpha bagus di USA tetapi kamu curiga lebih bagus di ASI → catat sebagai ekspansi tahap dua, bukan alasan menunda submit USA. Empat: hasil bagus di universe mainan/Excel → wajib replikasi di universe resmi sebelum dirayakan.",
        "Aturan praktis 10 detik: tanya 'di universe & region apa angka ini dihitung?' — bila jawabannya bukan 'USA TOP3000 resmi', anggap belum ada angka.",
        "Satu jebakan terakhir: 'universe creep' — diam-diam memperluas universe saat hasil di TOP3000 kurang bagus ('coba tambah 500 saham kecil, siapa tahu Sharpe naik'). Sharpe yang naik karena universe creep = Sharpe yang dibeli dengan eksekusi yang mustahil. Disiplin: universe ditetapkan SEBELUM riset, bukan dipilih SESUDAH melihat hasil. Mengganti arena agar angkanya cantik = memilih wasit yang memihak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Arena yang terbatas justru membebaskan: kamu berhenti membuang waktu pada 5000 saham yang tidak bisa dipakai, dan fokus penuh pada 3000 yang bisa. Keterbatasan = fokus.",
      },
      reference: "Bukan 'USA TOP3000 resmi' = belum ada angka.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Simulasi error: 'universe not available'",
      prose: [
        "Data: peneliti menjalankan batch 20 alpha; 3 error dengan pesan 'universe not available', 2 error 'region locked'. Ia menyimpulkan: 'platform-nya rusak, 25% riset saya hilang.'",
        "Pertanyaan: apa yang sebenarnya terjadi dan respons benar? Pembahasan: (1) Bukan rusak — 3 alpha memakai universe non-standar (kemungkinan field/region yang tidak tersedia), 2 alpha menunjuk region terkunci. (2) Respons: audit settings kelima alpha — samakan ke USA TOP3000; yang memang butuh region terkunci → pindah ke backlog tahap dua. (3) Pelajaran: error akses ≠ error platform. Arena punya pintu; menabrak pintu lalu menyalahkan gedung adalah kesalahan kategori.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risk reporting pun prinsipnya sama: angka tanpa konteks universe/perimeter-nya = angka yang menyesatkan. Selalu cantumkan cakupan di setiap laporan.",
      },
      reference: "Error akses = pintu terkunci, bukan gedung rusak.",
    },
    {
      id: "lab-arena",
      eyebrow: "Langkah 7 · Lab",
      title: "Audit arena: siapa menabrak pintu?",
      prose: [
        "Lima konfigurasi simulasi masuk antrean. Tugasmu: tulis pemeriksa arena — region harus USA (yang lain terkunci sebelum konsultan), universe harus TOP3000 (standar resmi). Cetak OK atau ERROR beserta alasannya untuk tiap konfigurasi.",
        "Eksperimen setelah selesai: tambahkan konfigurasi keenam dengan region 'GLB' dan universe 'TOP3000' — apa verdictnya? Dan bagaimana bila status konsultan sudah tiba (ubah aturan region)?",
      ],
      tasks: [
        { id: "t1", text: "Tulis `audit(nama, region, universe)` → 'OK' atau 'ERROR: ...'" },
        { id: "t2", text: "Jalankan pada 5 konfigurasi" },
      ],
      expected: "s1: OK\ns2: ERROR: region terkunci\ns3: ERROR: universe non-standar\ns4: OK\ns5: ERROR: region terkunci",
      note: {
        title: "Intuisi",
        body: "Pemeriksa 10 baris ini menghemat jam-jam debugging: error 'universe not available' yang misterius menjadi 's3: universe non-standar' yang jelas. Aturan arena yang dikodekan = aturan yang tidak perlu diingat.",
      },
      hints: [
        "Kumpulkan masalah dalam list, gabung dengan ', '.join.",
        "Region != 'USA' → 'region terkunci'; universe != 'TOP3000' → 'universe non-standar'.",
      ],
      code: {
        starter: "# (nama, region, universe). JANGAN UBAH.\nconfigs = [(\"s1\", \"USA\", \"TOP3000\"), (\"s2\", \"ASI\", \"TOP3000\"),\n           (\"s3\", \"USA\", \"ALL\"), (\"s4\", \"USA\", \"TOP3000\"),\n           (\"s5\", \"EUR\", \"TOP3000\")]\n\n# TULIS KODEMU\ndef audit(nama, region, universe):\n    return  # 'OK' atau 'ERROR: ...'\n\nfor nama, reg, uni in configs:\n    print(f\"{nama}: {audit(nama, reg, uni)}\")\n",
        lockLines: 4,
        solution: "# (nama, region, universe). JANGAN UBAH.\nconfigs = [(\"s1\", \"USA\", \"TOP3000\"), (\"s2\", \"ASI\", \"TOP3000\"),\n           (\"s3\", \"USA\", \"ALL\"), (\"s4\", \"USA\", \"TOP3000\"),\n           (\"s5\", \"EUR\", \"TOP3000\")]\n\n# TULIS KODEMU\ndef audit(nama, region, universe):\n    masalah = []\n    if region != \"USA\":\n        masalah.append(\"region terkunci\")\n    if universe != \"TOP3000\":\n        masalah.append(\"universe non-standar\")\n    return \"OK\" if not masalah else \"ERROR: \" + \", \".join(masalah)\n\nfor nama, reg, uni in configs:\n    print(f\"{nama}: {audit(nama, reg, uni)}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `audit` ada", msg: "Definisikan def audit(nama, region, universe).", name: "audit" },
          { kind: "stdout_matches", task: "t2", label: "s2 region terkunci", msg: "ASI terkunci sebelum konsultan.", pattern: "s2: ERROR: region terkunci" },
          { kind: "stdout_matches", task: "t2", label: "s3 universe non-standar", msg: "ALL bukan universe resmi.", pattern: "s3: ERROR: universe non-standar" },
          { kind: "stdout_matches", task: "t2", label: "s1 & s4 OK", msg: "USA TOP3000 = arena resmi.", pattern: "s4: OK" }
        ],
      },
      reference: "Aturan arena yang dikodekan = aturan yang tak perlu diingat.",
    },
    {
      id: "universe-lanjut",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Konstruksi universe & jebakan survivorship",
      prose: [
        "TOP3000 bukan daftar statis yang turun dari langit — ia dikonstruksi ulang berkala. Mekaniknya: setiap akhir bulan, seluruh saham AS diperingkat berdasarkan kapitalisasi pasar; 3000 teratas masuk. Lalu filter likuiditas bekerja: rata-rata volume harian (ADV) minimum — saham raksasa yang hampir tidak diperdagangkan tetap berbahaya dieksekusi; filter harga minimum — saham di bawah $1 spread-nya buas; filter kualitas data — riwayat harga yang berlubang parah dikeluarkan. Ilustrasi satu bulan: dari 8000 saham, 3000 lolos peringkat, ~150 gugur di filter ADV, ~50 di filter harga — universe efektif ~2800 saham yang benar-benar bisa ditradingkan. Angka pastinya berubah tiap bulan; prinsipnya tetap: universe = yang besar DAN likuid DAN datanya bersih.",
        "Jebakan paling mahal: survivorship bias. Bayangkan backtest 2015–2020 memakai daftar TOP3000 TAHUN 2026. Perusahaan yang bangkrut 2018 tidak ada di daftar itu — backtest-mu tidak pernah 'membeli' pecundang yang mati, hanya para penyintas. Hasilnya: return tahunan terlihat 2–4% lebih tinggi dari realitas. Itu bukan alpha — itu kuburan yang disembunyikan. Disiplin point-in-time: backtest wajib memakai KONSTITUEN HISTORIS — daftar universe sebagaimana ia terlihat pada tiap tanggal di masa lalu. Platform yang serius menyusun ulang universe per tanggal; backtest Excel hampir tidak pernah. Selisih 2–4% itu cukup untuk mengubah 'layak submit' menjadi 'sampah'.",
        "Implikasi kedua: generalisasi antar segmen universe. Uji sinyal yang sama pada tiga segmen: 500 teratas (raksasa, pasar paling efisien): Sharpe 1,1; peringkat 500–1500: Sharpe 1,6; peringkat 1500–3000: Sharpe 2,0; gabungan TOP3000: 1,7. Polanya jelas: alpha tinggal di ekor yang kurang efisien — saham raksasa terlalu ramai dianalisis. Ini bukan alasan pindah ke saham kecil (mereka disaring karena alasan yang bagus), melainkan peta: ekspektasikan Sharpe gabunganmu ditarik turun oleh segmen raksasa, dan jangan panik saat itu terjadi — itu fitur, bukan bug.",
        "Biaya tersembunyi: pergantian konstituen. Tiap rebalancing bulanan, ~5–10% universe berganti — saham yang terdepak harus dijual, yang masuk harus dibeli, terlepas dari sinyalmu. Itu turnover yang tidak terlihat di backtest naif: 8% pergantian × 12 bulan ≈ satu putaran penuh portofolio per tahun HANYA karena universe bergerak. Alpha berturnover rendah (sinyal fundamental, decay besar) paling terluka — biaya rebalancing bisa memakan seperempat returnnya. Praktik profesional: tambahkan 'universe turnover' ke anggaran biaya SEBELUM mengklaim fitness.",
        "Aturan generalisasi yang aman. Satu: laporkan setiap metrik DENGAN label universe — 'Sharpe 1,7 @ USA TOP3000', bukan 'Sharpe 1,7' telanjang. Dua: bandingkan alpha hanya dalam universe yang sama. Tiga: curigai alpha yang HANYA hidup di satu segmen sempit (misalnya hanya peringkat 2500–3000) — itu sering artefak likuiditas, bukan sinyal. Empat: saat status konsultan membuka region baru, JANGAN mentransfer ekspektasi Sharpe USA mentah-mentah — efisiensi, likuiditas, dan biaya tiap region berbeda; kalibrasi ulang dari nol dengan protokol yang sama.",
        "Satu catatan mekanik: filter universe tinggal di settings simulasi, bukan di ekspresi — kamu tidak 'menulis' universe dalam FASTEXPR. Tetapi kamu bisa membaca jejaknya: bila alpha-mu tiba-tiba mati tepat setelah rebalancing bulanan, tersangka pertamanya adalah konstituen yang berubah, bukan sinyal yang rusak. Cek kalender rebalancing sebelum mendiagnosis kematian alpha — separuh 'kematian misterius' ternyata hanya pergantian penghuni arena.",
        "Mekanik filter ADV dengan angka. ADV = rata-rata nilai yang diperdagangkan per hari. Saham X: ADV $800 ribu; order riset standar $5 juta = 6,25 hari volume — dieksekusi sekaligus, dampak pasar (market impact) ~2–3%, menghapus sebagian besar alpha sebelum dimulai. Saham Y (500 teratas): ADV $200 juta; order yang sama = 2,5% volume harian — impact ~10bp. Filter ADV memastikan setiap saham di universe bisa menampung order institusional tanpa pasar bergerak melawannya. Inilah alasan kuantitatif di balik 'likuiditas': bukan moral, melainkan fisika eksekusi.",
        "Diagnostik kematian alpha: universe vs sinyal. Alpha-mu mati bulan ini — apakah sinyalnya rusak atau arenanya berubah? Uji kontrol: jalankan ulang pada universe BEKU (konstituen tetap, misalnya daftar Januari) vs universe HIDUP (rebalancing normal). Versi beku masih hidup + versi hidup mati = arenanya yang berubah (konstituen, filter, atau biaya) — sinyalmu tidak bersalah. Keduanya mati = sinyalnya yang melemah. Tanpa kontrol ini, setiap kematian didiagnosis sebagai 'sinyal rusak' dan direspons dengan overfitting — padahal separuh kematian misterius hanyalah pergantian penghuni arena.",
        "Persiapan ekspansi region (tingkat lanjut). Saat pintu region baru terbuka, yang berubah bukan hanya 'negara': kalender trading berbeda (libur, jam), mata uang (return harus dalam denominasi yang konsisten), tick size dan aturan short-selling berbeda, likuiditas dan biaya berbeda. Protokol risetnya TETAP (sapu decay, netralkan, verifikasi field, baca kurva) — tetapi setiap angka kalibrasi (d optimal, turnover wajar, Sharpe target) harus diestimasi ulang dari nol. Jangan impor d=4 dari USA ke region lain seperti koper — setiap region punya 'kecepatan pasar'-nya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Backtest 10 tahun saya Sharpe 2,0.” — “Universe-nya point-in-time atau daftar hari ini?” Diam. Sembilan dari sepuluh backtest Excel gagal di pertanyaan ini. Tanpa konstituen historis, angka 10 tahun itu fiksi yang rapi.",
      },
      hints: [
        "Universe efektif ≈ 2800 setelah filter ADV & harga — bukan genap 3000.",
        "Survivorship bias menggelembungkan return 2–4%/tahun — selalu tanyakan konstituen historis.",
        "Anggaran biaya wajib memuat universe turnover (~1 putaran/tahun).",
      ],
      reference: "Konstruksi point-in-time, laporkan dengan label universe, anggarkan pergantiannya.",
    },
    {
      id: "konsultan",
      eyebrow: "Langkah 9 · Konsep",
      title: "Jalur menjadi Research Consultant: apa yang dinilai",
      prose: [
        "Sejauh ini track ini berbicara tentang 'era konsultan' seolah status itu tiba dengan sendirinya. Ia tidak tiba sendiri — ada jalurnya, dan jalur itu layak diajarkan sebelum kamu merancang strategi yang bergantung padanya (seperti menahan 10 alpha di WQB20).",
        "Cara mengajukan: tidak ada formulir publik dengan angka syarat yang bisa dikutip — dan lesson ini tidak akan mengarangnya. Yang bisa diverifikasi dari materi publik WorldQuant: (1) bangun rekam jejak alpha berkualitas di platform — konsultan yang diceritakan WorldQuant sendiri mencapai level 'Gold' di tangga Brain Genius sebelum di-onboard sebagai konsultan; (2) kompetisi adalah pintu yang terlihat: finalis dan pemenang International Quant Championship (IQC) dan Alphathon dinyatakan dapat dipertimbangkan untuk peran research consulting; (3) nyatakan minatmu — konsultan yang bercerita di situs WorldQuant bergabung setelah menyampaikan ketertarikan menyusul prestasi kompetisi.",
        "Apa yang dinilai: kualitas dan kuantitas alpha yang disubmit (bukan janji), konsistensi sepanjang waktu (bukan satu alpha beruntung), dan keluasan riset (berbagai dataset dan region setelah akses terbuka). Tangga Brain Genius (WQB25) adalah cermin terdekat dari penilaian ini: level naik bila gabungan performa, jumlah sinyal, dan keragaman portofolio naik — dengan slot terbatas dan tie-breaker antar yang lolos ambang.",
        "Tiga kejujuran. Pertama, tidak ada angka syarat resmi yang dipublikasikan di materi publik WorldQuant yang bisa diverifikasi saat lesson ini ditulis — siapa pun yang mengutip 'butuh N alpha Excellent' tanpa sumber sedang menebak. Kedua, jalurnya tidak instan: rekam jejak dibangun dalam hitungan bulan, bukan akhir pekan. Ketiga, status konsultan mengubah APA yang bisa kamu kerjakan (region, dataset, tipe submit) — bukan SIAPA kamu sebagai peneliti; skill yang membawamu ke sana adalah skill yang sama yang membuatmu bertahan di sana.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Saya tahan submit sampai status konsultan tiba — lalu submit semuanya sekaligus.” Menahan tanpa tanggal dan tanpa rencana adalah menimbun, bukan strategi. WQB20 mengajarkan syarat menahan: ada tanggal jelas status konsultan. Tanpa tanggal, tahan berarti menunda tanpa alasan.",
      },
      reference: "Jalur konsultan: rekam jejak alpha + level Genius + kompetisi + menyatakan minat. Tanpa angka syarat resmi yang dipublikasikan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan tentang arena tempat alpha hidup.",
      ],
      tasks: [],
      summary: [
        "Universe = daftar saham simulasi; USA TOP3000 = 3000 terbesar & terlikuid.",
        "Universe menyaring yang tidak bisa dieksekusi: likuiditas, kualitas data.",
        "Region: USA terbuka; ASI/EUR/GLB terkunci sebelum Research Consultant.",
        "Alpha tidak portabel antar universe/region tanpa replikasi ulang.",
        "Strategi: 100% USA TOP3000 dulu; region lain = backlog tahap dua.",
        "Universe dikonstruksi ulang berkala (filter ADV & harga); backtest wajib memakai konstituen historis — survivorship bias menggelembungkan 2–4%/tahun.",
        "Alpha tinggal di ekor yang kurang efisien; anggarkan universe turnover ~1 putaran/tahun.",
        "Jalur konsultan: rekam jejak alpha + level Genius + kompetisi (IQC/Alphathon) + menyatakan minat — tanpa angka syarat resmi yang dipublikasikan.",
      ],
      quiz: [
        {
          q: "Kenapa universe dibatasi ke TOP3000?",
          options: [
            { text: "Likuiditas & kualitas data — yang disaring tidak bisa dieksekusi/diandalkan", why: "Tepat — tiga alasan: likuiditas, kualitas data, eksekusi nyata.", correct: true },
            { text: "Agar komputasi lebih cepat", why: "Kecepatan bonus, bukan alasan utama." },
            { text: "Agar hanya institusi besar yang bisa riset", why: "Tidak ada kaitan institusi — ini soal kelayakan eksekusi." }
          ],
        },
        {
          q: "Alpha Sharpe 2,2 di Excel (150 small-cap) → 0,7 di TOP3000. Penjelasan terbaik?",
          options: [
            { text: "Keunggulannya berasal dari saham tidak likuid yang disaring universe", why: "Benar — spread & slippage yang diabaikan Excel.", correct: true },
            { text: "Excel salah hitung", why: "Hitungannya bisa benar untuk semestanya sendiri." },
            { text: "Platform sengaja menurunkan Sharpe", why: "Platform tidak mengubah matematika — ia mengubah arena." }
          ],
        },
        {
          q: "Kapan boleh riset serius untuk region ASI?",
          options: [
            { text: "Setelah status Research Consultant membuka akses datanya", why: "Tepat — sebelum itu simulasinya error.", correct: true },
            { text: "Sekarang, memakai data dari sumber luar", why: "Definisi field & aturan beda — harus diulang dari nol nanti." },
            { text: "Tidak pernah — ASI tidak ada di platform", why: "Ada, hanya terkunci sebelum status konsultan." }
          ],
        },
        {
          q: "Rata-rata spread dalam universe 0,40% vs luar 2,30%. Artinya?",
          options: [
            { text: "Trading di luar universe membayar pajak ~5,8x lebih mahal per putaran", why: "Benar — 2,30/0,40 = 5,75.", correct: true },
            { text: "Saham luar universe return-nya 5,8x lebih besar", why: "Spread = biaya, bukan return." },
            { text: "Universe harus diperluas ke semua saham", why: "Justru ini alasan universe disaring." }
          ],
        },
        {
          q: "Aturan 10 detik sebelum merayakan angka backtest?",
          options: [
            { text: "'Di universe & region apa angka ini dihitung?' — bukan resmi = belum ada angka", why: "Tepat.", correct: true },
            { text: "'Apakah Sharpe-nya di atas 2?'", why: "Sharpe tanpa konteks arena = angka hampa." },
            { text: "'Apakah kodenya sudah rapi?'", why: "Kerapian kode tidak menyelamatkan arena yang salah." }
          ],
        },
        {
          q: "Backtest 2015–2020 memakai daftar TOP3000 tahun 2026. Masalahnya?",
          options: [
            { text: "Survivorship bias — pecundang yang bangkrut tidak ikut diuji, return terlihat 2–4% lebih tinggi", why: "Tepat — kuburan disembunyikan.", correct: true },
            { text: "Tidak ada masalah — universe-nya sama", why: "Daftarnya sama, KONSTITUENnya beda — 2015 ≠ 2026." },
            { text: "Hasilnya terlalu pesimistis", why: "Terbalik — bias ini menggelembungkan, bukan mengempiskan." }
          ],
        },
        {
          q: "Rebalancing bulanan mengganti ~8% konstituen. Dampak tersembunyi?",
          options: [
            { text: "Turnover paksa ~1 putaran portofolio/tahun yang tak terlihat di backtest naif", why: "Benar — 8% × 12 bulan.", correct: true },
            { text: "Tidak ada — saham terdepak otomatis untung", why: "Terdepak ≠ untung; posisinya harus ditutup/dibuka paksa." },
            { text: "Universe menjadi tidak valid", why: "Universe tetap valid — yang berubah adalah biaya." }
          ],
        }
      ],
      reference: "Arena dulu, angka kemudian. USA TOP3000 sampai konsultan.",
    },
  ],
};
