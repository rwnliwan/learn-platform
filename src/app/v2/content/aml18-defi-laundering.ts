import type { V2Lesson } from "../lib/types";

const FIG_FLOW = `<svg viewBox="0 0 480 280" role="img" aria-label="Alur pencucian via DeFi.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Alur laundering DeFi (skema umum)</text>
<rect x="20" y="60" width="100" height="44" rx="8" fill="var(--c1)" opacity="0.4"/>
<text x="70" y="87" font-size="11" fill="var(--chart-text)" text-anchor="middle">Hack / scam</text>
<text x="135" y="87" font-size="14" fill="var(--chart-text)">→</text>
<rect x="155" y="60" width="100" height="44" rx="8" fill="var(--c3)" opacity="0.4"/>
<text x="205" y="87" font-size="11" fill="var(--chart-text)" text-anchor="middle">Mixer</text>
<text x="270" y="87" font-size="14" fill="var(--chart-text)">→</text>
<rect x="290" y="60" width="100" height="44" rx="8" fill="var(--c4)" opacity="0.4"/>
<text x="340" y="80" font-size="11" fill="var(--chart-text)" text-anchor="middle">Chain-hop</text>
<text x="340" y="96" font-size="10" fill="var(--chart-text)" text-anchor="middle">via bridge</text>
<text x="405" y="87" font-size="14" fill="var(--chart-text)">→</text>
<rect x="20" y="150" width="100" height="44" rx="8" fill="var(--c2)" opacity="0.4"/>
<text x="70" y="177" font-size="11" fill="var(--chart-text)" text-anchor="middle">DEX → CEX</text>
<rect x="155" y="150" width="100" height="44" rx="8" fill="var(--c2)" opacity="0.3"/>
<text x="205" y="177" font-size="11" fill="var(--chart-text)" text-anchor="middle">Fiat off-ramp</text>
<text x="70" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle" opacity="0.7">putus jejak</text>
<text x="340" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle" opacity="0.7">acak asal</text>
<text x="240" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle">Setiap tahap = peluang deteksi bagi analis.</text>
</g>
</svg>`;

export const aml18: V2Lesson = {
  slug: "aml18-defi-laundering",
  track: "Fraud & AML Analytics",
  module: "Aset Kripto",
  title: "AML18 — DeFi Laundering: Melacak Dana di Dunia Tanpa Bank",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp150 miliar yang menguap ke blockchain",
      prose: [
        "Tim investigasi Bank Nusantara menelusuri transfer Rp150 miliar hasil korupsi. Jejaknya berhenti di sebuah exchange kripto lokal — ditarik ke wallet anonim. Tiga hari kemudian, dana itu sudah: dicampur di mixer, dipindah lintas 4 blockchain via bridge, ditukar di DEX, dan dicairkan di exchange luar negeri. Jejaknya tersebar di 2.000 transaksi.",
        "Skala masalahnya nyata: laporan industri mencatat miliaran dolar kripto mengalir ke alamat ilegal tiap tahun, sebagian besar melewati mixer dan DEX sebelum mencapai off-ramp. Angka pastinya diperdebatkan, tetapi arahnya jelas — semakin besar adopsi kripto, semakin besar medan kerja analis AML kripto. Ini bukan niche; ini masa depan profesi.",
        "Twist-nya: blockchain itu TRANSPARAN — semua 2.000 transaksi tercatat publik selamanya. Masalahnya bukan ketiadaan data, melainkan banjir data + anonimitas semu. Analis yang paham heuristik blockchain (clustering, peel chain, atribusi) bisa merekonstruksi alur yang terlihat acak. Setelah lesson ini kamu bisa: (1) menjelaskan primitif DeFi yang disalahgunakan; (2) mengidentifikasi tipologi laundering kripto; (3) menerapkan heuristik pelacakan dasar; (4) menghitung eksposur pro-rata.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CAMS edisi ke-7 dan FATF menempatkan virtual assets sebagai area risiko utama. Di Indonesia, Bappebti/OJK mengatur pedagang aset kripto — bank yang melayani mereka wajib memahami risiko ini. Analis AML yang buta kripto = analis yang buta separuh medan.",
      },
      reference: "Blockchain transparan, identitas semu. Heuristik = kuncinya.",
    },
    {
      id: "primitif",
      eyebrow: "Langkah 2 · Konsep",
      title: "Primitif DeFi yang disalahgunakan",
      prose: [
        "Lima primitif yang perlu dipahami analis. (1) DEX (decentralized exchange): tukar kripto tanpa perantara/KYC — titik konversi antar aset. (2) Mixer/tumbler: mengacak kaitan input-output — pemutus jejak utama. (3) Bridge: pindah aset antar blockchain — chain-hopping. (4) Lending pool: pinjam-meminjam tanpa identitas — layering via utang. (5) Privacy coin (Monero dkk.): kriptografi yang menyembunyikan pengirim/penerima/jumlah — titik buta total.",
        "Kepribadian tiap primitif bagi pencuci: DEX = penukar uang, mixer = mesin cuci, bridge = pelarian lintas negara, lending = kuitansi palsu, privacy coin = bunker. Analis yang mengenali 'peran' tiap primitif membaca alur laundering seperti membaca peta.",
        "Tiga miskonsepsi. Satu: 'Kripto = anonim.' Bitcoin dkk. = PSEUDONIM (alamat bisa dilacak); hanya privacy coin yang mendekati anonim. Dua: 'Mixer = pasti jahat.' Ada penggunaan sah (privasi) — tetapi pola + konteks menentukan. Tiga: 'Tidak bisa dilacak setelah mixer.' Bisa — dengan heuristik + data exchange (KYC di off-ramp) + analisis perilaku. Sulit, bukan mustahil.",
        "Satu teknik yang wajib dikenal: clustering berbasis co-spend. Bila dua alamat selalu muncul sebagai input dalam transaksi yang sama, kemungkinan besar satu pemilik (satu wallet). Dengan teknik ini, analis meruntuhkan ribuan alamat menjadi puluhan entitas — dan peta menjadi terbaca. Batasannya: CoinJoin dan sejenisnya sengaja memalsukan co-spend; kenali batas teknikmu.",
        "Praktiknya, analis memakai block explorer gratis untuk triase: masukkan alamat, telusuri 10 hop ke depan dan belakang, catat pola. Untuk kasus besar, tools komersial mengotomasi ini dengan database atribusi (alamat milik exchange X, mixer Y). Kombinasi keduanya — intuisi manual + skala otomatis — adalah standar kerja modern.",
        "Bangun perpustakaan pola pribadimu: setiap kasus yang kamu tangani, catat tipologinya (mixer apa, berapa hop, chain apa). Dalam setahun kamu punya puluhan pola — dan kasus baru sering mirip kasus lama. Pencuci mengulang teknik yang berhasil; analis yang mencatat mengalahkan yang menghafal.",
        "Contoh heuristik change address: transaksi 10 BTC dengan input 10 BTC dan dua output (9,9 ke alamat baru, 0,1 kembali) — output 9,9 kemungkinan besar adalah pembayaran, 0,1 adalah kembalian ke pengirim. Dengan logika ini analis mengikuti aliran dana melewati puluhan hop. Sederhana, tetapi fondasi seluruh pelacakan blockchain.",
        "Satu contoh nyata cara kerja heuristik gabungan: alamat A menerima 10 BTC dari hack; dalam 1 jam, 9,9 BTC pindah ke B (change 0,1 kembali ke A); B ke C dengan pola sama; setelah 5 hop, dana masuk mixer. Analis menandai seluruh rantai sebagai ‘terkait hack’ berdasarkan konsistensi pola + timing, BUKAN satu bukti tunggal. Keyakinan dibangun dari konvergensi petunjuk.",
        "Waspadai false positive terbesar: donasi atau pembayaran sah yang kebetulan melewati alamat yang pernah terkait mixer. Heuristik tidak mengenal niat — hanya pola. Karena itu aturan emasnya: heuristik untuk PRIORITAS, verifikasi manual untuk KEPUTUSAN. Jangan bekukan rekening hanya karena skor heuristik.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Transaksi kripto tidak bisa diblokir bank.” Benar untuk on-chain — tetapi titik MASUK dan KELUAR (fiat on/off-ramp) melewati sistem keuangan. Di sanalah bank berperan: pantau transfer ke/dari exchange kripto dengan pola tidak wajar.",
      },
      hints: [
        "Hafalkan 5 primitif + 'perannya' masing-masing.",
        "Fokus pada off-ramp — di sanalah identitas terungkap.",
      ],
      reference: "DEX, mixer, bridge, lending, privacy coin. Off-ramp = titik terang.",
    },
    {
      id: "tipologi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tipologi: peel chain, chain-hop, dusting",
      prose: [
        "Tiga tipologi klasik. (1) Peel chain: dana besar dipecah bertahap — tiap transaksi 'mengupas' sedikit ke alamat baru, sisanya diteruskan; polanya: jumlah menyusut <2% per hop, rantai panjang. (2) Chain-hopping: pindah blockchain berkali-kali via bridge — tiap hop = yurisdiksi analitik baru, memutus korelasi. (3) Dusting + konsolidasi: sebar 'debu' ke ribuan alamat lalu kumpulkan kembali — mengaburkan di tengah keramaian.",
        "Heuristik deteksi: common-input (beberapa alamat sebagai input satu transaksi = kemungkinan satu pemilik), change address (kembalian ke alamat baru = milik pengirim), waktu + jumlah (pola berulang = otomatisasi). Heuristik = dugaan berbasis perilaku, bukan bukti — selalu verifikasi dengan data lain.",
        "Dua miskonsepsi. Satu: 'Heuristik = bukti.' Bukan — ia prioritas investigasi. Common-input bisa salah (CoinJoin). Dua: 'Semakin canggih tekniknya semakin aman.' Teknik canggih meninggalkan pola canggih — analis yang baik justru mencari pola yang 'terlalu rapi'.",
      ],
      figure: {
        svg: FIG_FLOW,
        alt: "Alur pencucian via DeFi.",
        caption: "Setiap tahap = peluang deteksi bagi analis.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kami tidak punya tools blockchain analytics.” Tools komersial (Chainalysis, TRM, Elliptic) memang mahal — tetapi heuristik dasar + block explorer gratis sudah cukup untuk triase awal. Jangan jadikan ketiadaan tools sebagai alasan kebutaan.",
      },
      hints: [
        "Latih mata: buka block explorer, telusuri 10 hop dari satu alamat — rasakan polanya.",
        "Chain-hop ≥3 dalam 24 jam = red flag kuat.",
      ],
      reference: "Peel chain, chain-hop, dusting. Heuristik = dugaan, bukan bukti.",
    },
    {
      id: "atribusi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Atribusi & pro-rata: siapa punya apa",
      prose: [
        "Saat dana kotor dan bersih bercampur (di mixer, di exchange), pertanyaan kunci: berapa porsi kotornya? Metode PRO-RATA: porsi kotor = total kotor / total campuran — setiap penarikan dianggap mengandung porsi yang sama. Sederhana, defensible, dan dipakai penyidik. Alternatif: FIFO/LIFO (asumsi urutan) — lebih kompleks, lebih diperdebatkan.",
        "Batasan pro-rata: ia asumsi statistik, bukan fakta — penarikan tertentu bisa 100% bersih atau 100% kotor. Gunakan untuk ESTIMASI eksposur dan prioritas, bukan untuk vonis. Untuk vonis, butuh pelacakan deterministik (UTXO-level).",
        "Dua miskonsepsi. Satu: 'Campuran = tidak bisa ditindak.' Bisa — pro-rata memberi dasar estimasi untuk pembekuan proporsional. Dua: 'Exchange luar negeri di luar jangkauan.' Kerja sama internasional (MLAT, FATF) + tekanan regulasi membuat exchange besar kooperatif — terutama bila ada perintah pengadilan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk bank: nasabah yang menerima dana dari mixer/DEX tanpa penjelasan = red flag EDD. Kebijakan yang jelas ('kami tidak memproses dana dari mixer tanpa verifikasi sumber') melindungi bank dari menjadi off-ramp pencucian.",
      },
      hints: [
        "Pro-rata = kotor/total × penarikan. Hafalkan.",
        "Dokumentasikan asumsi setiap estimasi — auditor akan bertanya.",
      ],
      formula: String.raw`\text{Porsi kotor} = \frac{\sum \text{kotor}}{\sum \text{total}} \times \text{penarikan}`,
      formulaNote: "Metode pro-rata PCAF-untuk-kripto: setiap penarikan dari campuran dianggap mengandung porsi kotor yang sama dengan komposisi campurannya. Contoh lab: 60/100 x 25 = 15 BTC. Interpretasi: estimasi untuk prioritas dan pembekuan proporsional \u2014 bukan bukti untuk vonis. Selalu dokumentasikan bahwa ini estimasi.",
      reference: "Pro-rata = estimasi eksposur. Deterministik = untuk vonis.",
    },
    {
      id: "lab-prorata",
      eyebrow: "Langkah 5 · Lab",
      title: "Estimasi porsi kotor pro-rata",
      prose: [
        "Mixer menerima 100 BTC dari 4 sumber (2 kotor, 2 bersih). Hitung % dana kotor di mixer, lalu estimasi porsi kotor dalam penarikan 25 BTC secara pro-rata.",
        "Perhatikan: 60% kotor berarti setiap penarikan 'mengandung' 60% dana kotor — termasuk penarikan oleh pengguna SAH yang kebetulan memakai mixer yang sama. Inilah dilema mixer: infrastruktur netral, dipakai dua dunia.",
      ],
      tasks: [
        { id: "t1", text: "Hitung % dana kotor = total kotor / total" },
        { id: "t2", text: "Estimasi porsi kotor penarikan 25 BTC" },
      ],
      expected: "Dana kotor di mixer: 60%\nPenarikan 25 BTC ~ 15.0 BTC kotor (pro-rata)",
      note: {
        title: "💡 Intuisi",
        body: "Satu pembagian mengubah 'campuran tak terlacak' menjadi '60% kotor, 15 BTC per penarikan 25'. Estimasi kasar yang bisa ditindak > presisi yang tidak ada.",
      },
      hints: [
        "kotor = jumlah dari sumber bertanda True.",
        "porsi = tarik × pct/100.",
      ],
      code: {
        starter: "# (sumber, jumlah BTC, kotor?). JANGAN UBAH.\nsumber = [(\"S1\", 40, True), (\"S2\", 30, False), (\"S3\", 20, True), (\"S4\", 10, False)]\n\n# TULIS KODEMU: % kotor + estimasi penarikan\ntotal = sum(j for _, j, _ in sumber)\nkotor = \npct = kotor / total * 100\nprint(f\"Dana kotor di mixer: {pct:.0f}%\")\ntarik = 25\nprint(f\"Penarikan {tarik} BTC ~ {tarik*pct/100:.1f} BTC kotor (pro-rata)\")\n",
        lockLines: 7,
        solution: "# (sumber, jumlah BTC, kotor?). JANGAN UBAH.\nsumber = [(\"S1\", 40, True), (\"S2\", 30, False), (\"S3\", 20, True), (\"S4\", 10, False)]\n\n# TULIS KODEMU: % kotor + estimasi penarikan\ntotal = sum(j for _, j, _ in sumber)\nkotor = sum(j for _, j, k in sumber if k)\npct = kotor / total * 100\nprint(f\"Dana kotor di mixer: {pct:.0f}%\")\ntarik = 25\nprint(f\"Penarikan {tarik} BTC ~ {tarik*pct/100:.1f} BTC kotor (pro-rata)\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "60% kotor", msg: "(40+20)/100.", pattern: "Dana kotor di mixer: 60%" },
          { kind: "stdout_matches", task: "t2", label: "15.0 BTC", msg: "25×0.6.", pattern: "Penarikan 25 BTC ~ 15.0 BTC kotor" },
        ],
      },
      reference: "Pro-rata = kotor/total × penarikan.",
    },
    {
      id: "lab-hop",
      eyebrow: "Langkah 6 · Lab",
      title: "Deteksi chain-hopping",
      prose: [
        "Jejak 4 langkah lintas chain. Hitung chain-hop = berapa kali chain BERGANTI berurutan. Klasifikasi: ≥3 TINGGI, ≥1 SEDANG, 0 RENDAH.",
        "Hasil: 3 hop = TINGGI. Pola ini — BTC→ETH→BSC→ETH dalam waktu singkat — adalah tanda tangan klasik upaya pemutusan jejak. Eksperimen: hapus langkah ke-4 — hop menjadi 2 = SEDANG. Ambang klasifikasi adalah keputusan kebijakan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung chain-hop (ganti chain berurutan)" },
        { id: "t2", text: "Klasifikasikan risiko TINGGI/SEDANG/RENDAH" },
      ],
      expected: "Chain-hop: 3\nRisiko TINGGI",
      note: {
        title: "💡 Intuisi",
        body: "Tiga perbandingan string = deteksi pola lintas-blockchain. Heuristik sederhana ini menangkap apa yang luput dari pemantauan single-chain.",
      },
      hints: [
        "Bandingkan jejak[i][1] vs jejak[i-1][1].",
        "Klasifikasi: >=3 TINGGI, >=1 SEDANG, else RENDAH.",
      ],
      code: {
        starter: "# (langkah, chain, alamat). JANGAN UBAH.\njejak = [(1,\"BTC\",\"bc1a\"),(2,\"ETH\",\"0xb2\"),(3,\"BSC\",\"0xc3\"),(4,\"ETH\",\"0xd4\")]\n\n# TULIS KODEMU: hitung hop + klasifikasi\nhop = \nprint(f\"Chain-hop: {hop}\")\nrisiko = \"TINGGI\" if hop >= 3 else (\"SEDANG\" if hop >= 1 else \"RENDAH\")\nprint(f\"Risiko {risiko}\")\n",
        lockLines: 6,
        solution: "# (langkah, chain, alamat). JANGAN UBAH.\njejak = [(1,\"BTC\",\"bc1a\"),(2,\"ETH\",\"0xb2\"),(3,\"BSC\",\"0xc3\"),(4,\"ETH\",\"0xd4\")]\n\n# TULIS KODEMU: hitung hop + klasifikasi\nhop = sum(1 for i in range(1, len(jejak)) if jejak[i][1] != jejak[i-1][1])\nprint(f\"Chain-hop: {hop}\")\nrisiko = \"TINGGI\" if hop >= 3 else (\"SEDANG\" if hop >= 1 else \"RENDAH\")\nprint(f\"Risiko {risiko}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "3 hop", msg: "BTC→ETH→BSC→ETH.", pattern: "Chain-hop: 3" },
          { kind: "stdout_matches", task: "t2", label: "Risiko TINGGI", msg: ">=3.", pattern: "Risiko TINGGI" },
        ],
      },
      reference: "Hop = ganti chain berurutan. ≥3 = TINGGI.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Transaksi kripto mencurigakan: respons apa",
      prose: [
        "Satu: nasabah transfer ke/dari exchange kripto — cek pola: frekuensi, nominal, konsistensi dengan profil. Dua: terindikasi mixer/DEX tanpa penjelasan → EDD: minta bukti sumber dana + tujuan transaksi. Tiga: pola chain-hop/peel chain terdeteksi → eskalasi ke tim investigasi; pertimbangkan STR. Empat: dana dari hack yang diketahui (daftar hitam) → bekukan + lapor. Lima: privacy coin tanpa justifikasi bisnis → tolak/de-risk.",
        "Aturan praktis 10 detik: exchange = pantau; mixer = EDD; pola laundering = investigasi; dana hack = bekukan. Kripto bukan alasan untuk tidak tahu — blockchain justru memberi data lebih banyak dari transfer bank.",
        "Satu jebakan: 'nasabah bilang untuk investasi.' Investasi SAH punya pola: beli-tahan-jual di exchange teregulasi. Pola mixer → bridge → DEX → off-ramp luar negeri BUKAN pola investasi. Uji: minta portofolio + riwayat — investor asli bisa menunjukkan; pencuci tidak.",
        "Enam: bangun relasi pra-insiden dengan exchange besar. Dana kripto bergerak dalam hitungan menit; permintaan pembekuan formal butuh hari. Kontak compliance langsung + jalur darurat jauh lebih berharga daripada prosedur. Bangun jaringan sebelum membutuhkan — pepatah lama yang sangat berlaku di kripto.",
        "Refleksi karir: analis AML kripto adalah profil paling dicari dan paling langka — bank, exchange, penegak hukum berebut talenta yang paham KEDUA dunia. Di wawancara, jangan bilang ‘saya tertarik kripto’; tunjukkan kamu bisa menjelaskan peel chain dan pro-rata. Itu pembedanya.",
        "Satu prinsip penutup: blockchain tidak pernah lupa. Transaksi yang hari ini tidak terlacak mungkin terlacak 5 tahun lagi saat teknik membaik atau identitas terungkap. Pencuci bertaruh pada kelupaan; analis bertaruh pada ingatan abadi. Waktu berpihak pada yang mencatat — catatlah dengan rapi mulai hari ini.",
        "Tugas mandiri minggu ini: pilih satu alamat dari laporan publik (mis. kasus hack yang diberitakan), buka block explorer, dan telusuri 5 hop. Tulis apa yang kamu temukan: pola apa, ke mana dana pergi, di mana jejak terputus. Pengalaman langsung 30 menit ini lebih berharga dari 3 jam teori.",
        "Satu catatan tentang regulasi Indonesia: perdagangan aset kripto diawasi (kini di bawah OJK), dan bank yang memiliki nasabah pedagang/klien kripto wajib menerapkan prinsip kehati-hatian ekstra. Pahami regulasi yang berlaku saat kamu membaca lesson ini — aturannya bergerak cepat, dan analis yang mengikuti perkembangannya selalu selangkah di depan.",
        "Terakhir: jangan bekerja sendirian. Komunitas analis blockchain (forum, grup profesional, konferensi) berbagi tipologi dan alamat mencurigakan — pencuci berkolaborasi lintas batas, analis pun harus begitu. Satu alamat yang kamu tandai hari ini bisa memecahkan kasus orang lain bulan depan.",
        "Penutup lesson: kamu kini memahami 5 primitif DeFi, 3 tipologi laundering, 3 heuristik pelacakan, dan metode atribusi pro-rata — fondasi lengkap analis AML kripto. Yang tersisa adalah jam terbang: setiap kasus menambah pola ke perpustakaanmu. Mulailah dari tugas mandiri di atas, dan dalam 6 bulan kamu akan membaca blockchain seperti membaca koran.",
        "Dan ingat pesan terpenting lesson ini: data blockchain itu publik dan abadi. Setiap teknik yang kamu pelajari hari ini bekerja justru karena pencuci tidak bisa menghapus jejak — mereka hanya bisa mengaburkannya. Tugasmu adalah melihat menembus kabut itu.",
        "Selamat — kamu selangkah lebih dekat menjadi analis yang tidak buta di separuh medan perang finansial modern.",
        "Terus asah heuristikmu, bangun jaringanmu, dan jangan pernah berhenti menelusuri — karena di dunia blockchain, jejak tidak pernah benar-benar hilang. Itulah keunggulanmu yang permanen atas mereka yang mengandalkan kegelapan untuk bersembunyi dari keadilan yang pasti akan menemukan mereka cepat atau lambat, karena blockchain tidak pernah lupa.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tetapkan kebijakan tertulis untuk eksposur kripto: ambang EDD, daftar merah (mixer, privacy coin, exchange tak berizin), dan prosedur STR. Tanpa kebijakan, setiap analis memutuskan sendiri — inkonsistensi = celah.",
      },
      reference: "Exchange pantau, mixer EDD, pola = investigasi, hack = bekukan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Jejak Rp150 miliar",
      prose: [
        "Kembali ke cerita pembuka. Data yang berhasil dikumpulkan: 40 BTC dari wallet X (terkait hack) masuk mixer M bersama 60 BTC lain; keluar 25 BTC ke bridge B1 → ETH → DEX D1 → exchange luar negeri E1; 15 BTC ke bridge B2 → BSC → DEX D2 → E1. Total yang tiba di E1: ~40 BTC.",
        "Pertanyaan: (a) Estimasi porsi kotor yang tiba di E1 (pro-rata)? (b) Langkah penyidikan? Pembahasan: (a) Mixer: 40% kotor (40/100). Penarikan total 40 BTC → ~16 BTC kotor tiba di E1 (pro-rata). (b) Minta data KYC E1 via kerja sama internasional (MLAT); petakan alamat deposit E1 — bila satu entitas, ajukan pembekuan; telusuri apakah ada off-ramp ke bank domestik (di sanalah wewenang bank berlaku). Pelajaran: rantai 2.000 transaksi runtuh menjadi 3 titik intervensi — mixer (estimasi), bridge (jejak), exchange (identitas). Fokus pada titik intervensi, bukan pada seluruh rantai.",
        "Satu pelajaran operasional: kecepatan adalah segalanya. Dana kripto bergerak dalam hitungan menit; permintaan pembekuan via MLAT butuh hari hingga minggu. Karena itu hubungan PRA-INSIDEN dengan exchange besar (kontak compliance, jalur darurat) jauh lebih berharga daripada prosedur formal. Bangun jaringan sebelum membutuhkan — pepatah lama yang sangat berlaku di dunia kripto.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan: 40 BTC 'bersih' (60%) juga tercampur — pengguna sah mixer ikut terdampak estimasi. Inilah mengapa pro-rata untuk estimasi, bukan vonis. Ketelitian metodologi = kredibilitas penyidikan.",
      },
      reference: "Fokus titik intervensi: mixer, bridge, exchange.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Lima primitif yang disalahgunakan: DEX (penukar uang), mixer (mesin cuci), bridge (pelarian lintas chain), lending (kuitansi palsu), privacy coin; kripto = pseudonim, bukan anonim.",
        "Tipologi klasik: peel chain (pecah bertahap), chain-hopping (≥3 hop = TINGGI), dusting; heuristik pelacakan: co-spend clustering, change address, common-input — heuristik = dugaan, bukan bukti.",
        "Atribusi pro-rata: setiap penarikan dari campuran dianggap mengandung porsi kotor yang sama — contoh 60% kotor → penarikan 25 BTC mengandung ~15 BTC kotor; asumsi statistik yang wajib didokumentasikan.",
        "Fiat off-ramp adalah titik terang: exchange/KYC tempat identitas terungkap; tetapkan kebijakan tertulis — ambang EDD, daftar merah (mixer, privacy coin, exchange tak berizin).",
        "Aturan respons 10 detik: exchange = pantau, mixer = EDD, pola laundering = investigasi, dana hack = bekukan; dana kripto bergerak dalam hitungan menit.",
      ],
      quiz: [
        {
          q: "Fungsi mixer dalam alur laundering:",
          options: [
            { text: "Memutus kaitan input-output — pemutus jejak utama", why: "Benar: mixer mengacak asal-usul.", correct: true },
            { text: "Menambah nilai kripto", why: "Mixer tidak menambah nilai; hanya mengaburkan jejak." },
            { text: "Memverifikasi identitas pengguna", why: "Mixer justru menghilangkan identitas." },
            { text: "Menyimpan kripto dengan aman", why: "Itu fungsi wallet/custody, bukan mixer." },
          ],
        },
        {
          q: "Chain-hopping bertujuan:",
          options: [
            { text: "Memutus korelasi analitik dengan pindah blockchain berkali-kali", why: "Benar: tiap hop = yurisdiksi analitik baru.", correct: true },
            { text: "Mendapatkan harga tukar terbaik", why: "Itu arbitrase; chain-hopping untuk mengaburkan." },
            { text: "Menghindari biaya transaksi", why: "Hop justru menambah biaya; tujuannya jejak." },
            { text: "Diversifikasi investasi", why: "Bukan investasi; melainkan pengaburan." },
          ],
        },
        {
          q: "Metode pro-rata digunakan untuk:",
          options: [
            { text: "Estimasi porsi kotor dalam campuran — bukan untuk vonis", why: "Benar: pro-rata = asumsi statistik untuk estimasi.", correct: true },
            { text: "Bukti pasti di pengadilan", why: "Pro-rata tidak pasti; vonis butuh pelacakan deterministik." },
            { text: "Menghitung pajak kripto", why: "Pajak pakai basis biaya aktual, bukan pro-rata." },
            { text: "Menentukan harga mixer", why: "Tidak ada hubungannya." },
          ],
        },
        {
          q: "Titik TERANG bagi analis dalam alur laundering kripto:",
          options: [
            { text: "Fiat off-ramp (exchange) — di sanalah KYC/identitas terungkap", why: "Benar: masuk/keluar fiat lewat sistem teregulasi.", correct: true },
            { text: "Mixer — paling transparan", why: "Terbalik: mixer paling gelap." },
            { text: "Privacy coin — mudah dilacak", why: "Terbalik: privacy coin dirancang sulit dilacak." },
            { text: "Bridge — selalu ada datanya", why: "Bridge justru titik gelap antar-chain." },
          ],
        },
        {
          q: "Nasabah mengaku 'investasi kripto' tetapi polanya mixer → bridge → DEX → off-ramp luar negeri. Respons:",
          options: [
            { text: "EDD mendalam — pola ini bukan pola investasi sah", why: "Benar: pola laundering ≠ pola investasi.", correct: true },
            { text: "Terima penjelasannya — investasi memang begitu", why: "Investasi sah: beli-tahan-jual di exchange teregulasi." },
            { text: "Abaikan — kripto di luar wewenang bank", why: "Bank wajib memantau aliran terkait nasabahnya." },
            { text: "Langsung bekukan tanpa verifikasi", why: "EDD dulu sebelum tindakan; vonis kemudian." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kripto terlalu teknis untuk analis AML.” Heuristik dasar (pro-rata, hop counting, pola) hanya butuh logika + block explorer gratis. Yang dibutuhkan bukan gelar kriptografi — melainkan kemauan menelusuri.",
      },
      hints: [
        "Uji cepat: jelaskan 5 primitif + perannya tanpa melihat catatan.",
        "Ingat: transparan (data) ≠ teridentifikasi (orang).",
      ],
      reference: "Heuristik + titik intervensi = pelacakan.",
    },
  ],
};
