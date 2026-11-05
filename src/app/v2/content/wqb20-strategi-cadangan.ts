import type { V2Lesson } from "../lib/types";

const FIG_CLUSTER = `<svg viewBox="0 0 480 260" role="img" aria-label="286 kandidat menyusut menjadi 17 klaster independen.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">286 baris = 17 taruhan</text>
<text x="16" y="52" font-size="11" fill="var(--chart-text)">Baris kandidat (286)</text>
<rect x="16" y="62" width="280" height="20" fill="var(--c1)" opacity="0.5"/>
<rect x="16" y="88" width="280" height="20" fill="var(--c1)" opacity="0.5"/>
<rect x="16" y="114" width="280" height="20" fill="var(--c1)" opacity="0.5"/>
<text x="310" y="104" font-size="11" fill="var(--chart-text)">…banyak baris,</text>
<text x="310" y="122" font-size="11" fill="var(--chart-text)">satu family</text>
<text x="16" y="162" font-size="11" fill="var(--chart-text)">Klaster independen (17)</text>
<g fill="var(--c2)" opacity="0.9">
<rect x="16" y="172" width="24" height="24"/><rect x="48" y="172" width="24" height="24"/><rect x="80" y="172" width="24" height="24"/><rect x="112" y="172" width="24" height="24"/><rect x="144" y="172" width="24" height="24"/><rect x="176" y="172" width="24" height="24"/><rect x="208" y="172" width="24" height="24"/><rect x="240" y="172" width="24" height="24"/><rect x="272" y="172" width="24" height="24"/>
<rect x="16" y="204" width="24" height="24"/><rect x="48" y="204" width="24" height="24"/><rect x="80" y="204" width="24" height="24"/><rect x="112" y="204" width="24" height="24"/><rect x="144" y="204" width="24" height="24"/><rect x="176" y="204" width="24" height="24"/><rect x="208" y="204" width="24" height="24"/><rect x="240" y="204" width="24" height="24"/>
</g>
<text x="16" y="244" font-size="11" fill="var(--chart-text)">Cara membaca: puluhan baris di atas = 1 klaster; 17 kotak di bawah = 17 taruhan.</text>
</g>
</svg>`;

export const wqb20: V2Lesson = {
  slug: "wqb20-strategi-cadangan",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB20 — Strategi Cadangan Era Research Consultant",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Konsultan yang kehabisan peluru di minggu kedua",
      prose: [
        "Seorang konsultan riset baru memulai dengan gemilang: minggu pertama ia submit 10 alpha — 4 lolos, bonus mengalir. Minggu kedua: 6 submit, 1 lolos. Minggu ketiga: ia menatap daftarnya yang kosong. 'Bukankah saya punya 200 kandidat bagus?' Ia punya 200 BARIS — tetapi 180 di antaranya satu family yang sama. Begitu self-correlation menandai family itu, 180 baris runtuh sekaligus seperti domino.",
        "Di kota yang sama, konsultan lain memulai lambat: 3 submit per hari, semuanya dari family berbeda. Enam bulan kemudian ia masih submit setiap hari — karena cadangannya dihitung dalam KLASTER independen, bukan baris. Satu klaster runtuh? 16 lainnya tetap berdiri.",
        "Twist-nya: konsultan pertama tidak malas — ia justru PALING rajin memproduksi. Yang salah adalah satuan hitungnya: baris, bukan klaster. Produktivitas yang diukur dengan satuan salah = menara kartu. Lesson ini tentang satuan yang benar, target harian yang benar, dan logika ekonomi menahan submit.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan target operasional 'minimal 2 Excellent per hari' dan implikasinya; (2) menghitung klaster efektif dari daftar kandidat; (3) menjelaskan kenapa 19 baris satu klaster = satu taruhan; (4) menjelaskan logika ekonomi menahan submit sampai status konsultan; (5) menyusun rencana cadangan 30 hari.",
      ],
      tasks: [],
      note: {
        title: "Satuan yang benar",
        body: "Baris = upaya. Klaster = taruhan independen. Konsultan dibayar dari taruhan yang lolos, bukan dari upaya yang tercatat. Hitunglah apa yang dibayar.",
      },
      reference: "200 baris satu family = 1 taruhan. Hitung klaster, bukan baris.",
    },
    {
      id: "target",
      eyebrow: "Langkah 2 · Konsep",
      title: "Target: 2 Excellent per hari",
      prose: [
        "Kategori fitness platform: Excellent > 2,0 · Good > 1,5 · Average < 1,5. Target operasional konsultan: setiap hari submit minimal 2 kandidat Excellent. Kenapa 2? Karena tidak semua submit lolos — dengan tingkat kelolosan realistis ~30–50%, 2 submit/hari menjaga aliran alpha yang diterima tetap hidup. Satu Excellent per hari = hidup segan; nol = mati.",
        "Implikasinya ke produksi: kamu butuh PABRIK Excellent, bukan gudang. Excellent (fitness > 2,0) menuntut kombinasi langka: Sharpe tinggi DAN turnover rendah (ingat rumus fitness). Dari 292 kandidat berkualitas sebuah tim nyata, hanya 1 yang Excellent — 0,3%. Target 2/hari berarti mesin risetmu harus menemukan ~2 Excellent per hari dari ratusan kandidat yang diuji. Itulah kenapa wave dirancang ratusan kandidat, bukan puluhan.",
        "Konsekuensinya: (1) turnover rendah adalah mata uang — tanpa TO < ~30%, Excellent hampir mustahil; (2) family lambat (decay besar, fundamental) adalah ladang Excellent; (3) jangan puas dengan 'banyak yang Good' — Good tidak membayar tagihan harian.",
        "Miskonsepsi: 'target 2/hari berarti submit apa saja 2.' Yang benar: 2 EXCELLENT — kualitasnya yang dihitung, bukan jumlahnya. Submit 2 Average per hari = membakar slot dan reputasi konsultan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Saya punya 40 Good — cukup untuk 20 hari.” Good ≠ Excellent. Target harian dihitung dalam Excellent; Good adalah cadangan darurat, bukan bahan bakar harian. Mencampur keduanya = merencanakan dengan mata uang yang salah.",
      },
      hints: [
        "Excellent > 2,0 menuntut Sharpe tinggi + turnover rendah sekaligus.",
        "Rancang wave untuk volume: ratusan kandidat → segelintir Excellent.",
      ],
      reference: "2 Excellent/hari = pabrik, bukan gudang.",
    },
    {
      id: "klaster",
      eyebrow: "Langkah 3 · Konsep",
      title: "Klaster: satuan cadangan yang sebenarnya",
      prose: [
        "Klaster = sekelompok kandidat dari family/struktur yang sama, yang akan runtuh BERSAMA saat self-correlation datang. Contoh nyata: 19 kandidat ts_decay_linear — Sharpe 1,3–1,4 semua, terlihat seperti '19 cadangan'. Kenyataannya: satu klaster. Begitu satu anggota gagal self-corr terhadap alpha sejenis yang sudah disubmit, 18 sisanya ikut dicurigai.",
        "Contoh hitung nyata sebuah tim: 286 kandidat berkualitas → setelah dipetakan per family & struktur → 17 klaster efektif. Rasio 17:1 — setiap 17 baris rata-rata hanya 1 taruhan independen. Cadangan '286' yang dibanggakan sebenarnya cadangan '17'.",
        "Cara membaca figur: tiga baris panjang di atas = puluhan kandidat satu family (satu klaster); 17 kotak di bawah = 17 taruhan independen. Interpretasi: panjang baris menipu — yang penting jumlah kotak. Tim yang sehat menambah KOTAK (family baru), bukan memanjangkan BARIS (varian ke-20 family yang sama).",
        "Aturan diversifikasi: tiap klaster baru harus lolos 'uji keterkejutan' — 'bila klaster terbesar saya runtuh besok, apakah saya masih bisa submit minggu depan?' Bila jawabannya tidak, buka family baru SEKARANG, bukan setelah runtuh.",
      ],
      formula: String.raw`\text{Cadangan efektif} = \sum_{\text{klaster}} 1 \quad \text{(bukan } \sum \text{baris)}`,
      formulaNote: "Setiap klaster independen dihitung 1, berapa pun barisnya. 19 baris satu klaster = 1. Tiga klaster = 3 — walau total barisnya hanya 9.",
      figure: {
        svg: FIG_CLUSTER,
        alt: "Ratusan baris kandidat menyusut menjadi 17 kotak klaster independen.",
        caption: "Baris = upaya. Kotak = taruhan. Tambah kotak, bukan baris.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Klaster terbesar saya 43 baris — itu cadangan terbesar saya.” Itu KONSENTRASI RISIKO terbesar, bukan cadangan terbesar. Klaster dominan = titik kegagalan tunggal: satu vonis self-corr menghapus '43 cadangan' sekaligus.",
      },
      hints: [
        "Kelompokkan kandidat by family + struktur inti, bukan by angka.",
        "Satu family = satu klaster, kecuali terbukti tidak berkorelasi.",
      ],
      reference: "Tambah kotak (family baru), bukan baris (varian ke-20).",
    },
    {
      id: "ekonomi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Logika ekonomi: tahan submit demi komisi",
      prose: [
        "Keputusan nyata yang kontra-intuitif: tim menahan 10 alpha yang LOLOS self-correlation — tidak disubmit — sampai status Research Consultant diterima. Kenapa menahan barang bagus? Karena komisi konsultan hanya dibayar untuk alpha yang disubmit SETELAH status aktif. Submit sebelum itu = menyumbang alpha tanpa dibayar.",
        "Hitungannya: misal tiap alpha yang diterima bernilai komisi C. Submit 10 alpha sebelum status = 10×C hilang. Menahan 2 bulan = 10×C terselamatkan, dengan risiko: ide kedaluwarsa? Risiko ini kecil untuk alpha terneutralisasi (bukan arbitrase mikro) — dan jauh lebih kecil dari 10×C yang pasti hilang.",
        "Syarat menahan: (1) alpha sudah lolos self-corr (kualitas terverifikasi, bukan spekulasi); (2) ada tanggal jelas status konsultan (menahan tanpa tenggat = menimbun); (3) selama menunggu, bangun wave berikutnya — waktu tunggu = waktu produksi, bukan libur.",
        "Miskonsepsi: 'submit secepatnya selalu benar — momentum itu penting.' Momentum tanpa komisi = kerja bakti. Konsultan profesional berpikir seperti pemilik bisnis: setiap submit adalah keputusan alokasi modal intelektual.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nanti kalau statusnya tidak jadi, alpha-nya basi.” Itulah gunanya syarat (1): hanya tahan yang sudah lolos self-corr dan ber-turnover rendah — alpha seperti itu tidak basi dalam hitungan bulan. Yang basi = alpha arbitrase mikro; itu memang jangan ditahan, jangan juga terlalu diharapkan.",
      },
      hints: [
        "Tahan = hanya untuk yang sudah lolos self-corr + ada tenggat status.",
        "Waktu tunggu dipakai produksi wave berikutnya.",
      ],
      reference: "Submit = alokasi modal intelektual. Tanpa komisi = kerja bakti.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung klaster efektif & rencana 30 hari",
      prose: [
        "Daftar 12 kandidat mainan (nama, family, fitness). Tugasmu: (1) kelompokkan per family → hitung klaster efektif; (2) hitung berapa Excellent (F > 2,0) per klaster; (3) jawab: berapa hari target '2 Excellent/hari' bisa dipenuhi dari cadangan ini? (4) rekomendasi: family baru apa yang harus dibuka?",
        "Eksperimen setelah selesai: pindahkan 3 kandidat 'slowrev' menjadi 'orth' (simulasi diversifikasi) — bagaimana cadangan efektif dan hari-terpenuhi berubah?",
      ],
      tasks: [
        { id: "t1", text: "Kelompokkan kandidat per family" },
        { id: "t2", text: "Hitung Excellent per klaster & total hari terpenuhi" },
        { id: "t3", text: "Jalankan dan baca rekomendasi" },
      ],
      expected: "Klaster efektif: 4\nExcellent per klaster: {'fund': 0, 'gap': 1, 'orth': 1, 'slowrev': 1}\nHari terpenuhi (2/hari): 1\nRekomendasi: BUKA family baru — cadangan hanya 1 hari",
      note: {
        title: "Intuisi",
        body: "Lab ini adalah 'neraca' konsultan: aktiva = klaster × Excellent per klaster; kewajiban = 2 per hari. Neraca yang hanya cukup 1 hari = perusahaan yang bangkrut besok — kecuali produksi berjalan.",
      },
      hints: [
        "klaster = set(family); Excellent = fitness > 2,0.",
        "hari = total_excellent // 2 (pembulatan bawah).",
      ],
      code: {
        starter: "# (nama, family, fitness). JANGAN UBAH.\nkandidat = [\n    (\"k1\", \"slowrev\", 1.8), (\"k2\", \"slowrev\", 1.6), (\"k3\", \"slowrev\", 2.1),\n    (\"k4\", \"orth\", 2.3), (\"k5\", \"orth\", 1.4), (\"k6\", \"orth\", 1.2),\n    (\"k7\", \"gap\", 2.05), (\"k8\", \"gap\", 1.1),\n    (\"k9\", \"fund\", 1.9), (\"k10\", \"fund\", 1.7), (\"k11\", \"fund\", 1.5),\n    (\"k12\", \"fund\", 1.3),\n]\n\n# TULIS KODEMU\nklaster = sorted(set(f for _, f, _ in kandidat))\nexc = {}\nfor f in klaster:\n    exc[f] = sum(1 for _, ff, fit in kandidat if ff == f and fit > 2.0)\ntotal = sum(exc.values())\nhari = total // 2\nprint(f\"Klaster efektif: {len(klaster)}\")\nprint(f\"Excellent per klaster: {exc}\")\nprint(f\"Hari terpenuhi (2/hari): {hari}\")\nprint(\"Rekomendasi: BUKA family baru — cadangan hanya 1 hari\" if hari < 7 else \"Rekomendasi: AMAN\")\n",
        lockLines: 9,
        solution: "# (nama, family, fitness). JANGAN UBAH.\nkandidat = [\n    (\"k1\", \"slowrev\", 1.8), (\"k2\", \"slowrev\", 1.6), (\"k3\", \"slowrev\", 2.1),\n    (\"k4\", \"orth\", 2.3), (\"k5\", \"orth\", 1.4), (\"k6\", \"orth\", 1.2),\n    (\"k7\", \"gap\", 2.05), (\"k8\", \"gap\", 1.1),\n    (\"k9\", \"fund\", 1.9), (\"k10\", \"fund\", 1.7), (\"k11\", \"fund\", 1.5),\n    (\"k12\", \"fund\", 1.3),\n]\n\n# TULIS KODEMU\nklaster = sorted(set(f for _, f, _ in kandidat))\nexc = {}\nfor f in klaster:\n    exc[f] = sum(1 for _, ff, fit in kandidat if ff == f and fit > 2.0)\ntotal = sum(exc.values())\nhari = total // 2\nprint(f\"Klaster efektif: {len(klaster)}\")\nprint(f\"Excellent per klaster: {exc}\")\nprint(f\"Hari terpenuhi (2/hari): {hari}\")\nprint(\"Rekomendasi: BUKA family baru — cadangan hanya 1 hari\" if hari < 7 else \"Rekomendasi: AMAN\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Klaster efektif = 4", msg: "Family: slowrev, orth, gap, fund.", pattern: "Klaster efektif: 4" },
          { kind: "stdout_matches", task: "t2", label: "Hari terpenuhi = 1", msg: "Excellent: k3 (2,1), k4 (2,3), k7 (2,05) = 3 → 3//2 = 1.", pattern: "Hari terpenuhi \\(2/hari\\): 1" },
          { kind: "stdout_matches", task: "t3", label: "Rekomendasi buka family", msg: "1 hari < 7 → buka family baru.", pattern: "Rekomendasi: BUKA family baru" }
        ],
      },
      reference: "Neraca konsultan: aktiva = klaster × Excellent; kewajiban = 2/hari.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Operasi cadangan harian",
      prose: [
        "Satu: pagi — pilih 2 Excellent dari klaster BERBEDA (jangan pernah 2 dari klaster sama sehari). Dua: sebelum submit — cek self-corr manual terhadap yang sudah disubmit. Tiga: klaster yang anggotanya mulai gagal self-corr → bekukan klaster itu, alihkan produksi ke klaster lain. Empat: cadangan < 14 hari (28 Excellent) → wave baru WAJIB jalan minggu itu. Lima: status konsultan belum tiba → tahan yang lolos, produksi terus.",
        "Aturan praktis 10 detik: 'berapa klaster saya hari ini, berapa hari cadangan saya?' — dua angka ini adalah dashboard konsultan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Konsultan yang baik seperti petani dengan banyak lumbung: panen dari lumbung berbeda tiap hari, dan selalu menanam untuk musim depan. Satu lumbung raksasa = satu kebakaran menghabiskan segalanya.",
      },
      reference: "2 klaster berbeda/hari · self-corr dulu · cadangan <14 hari = wave baru.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rencana 30 hari dari 17 klaster",
      prose: [
        "Data: cadangan 17 klaster; Excellent terdistribusi: 5 klaster punya 2, 4 klaster punya 1, 8 klaster punya 0. Total Excellent = 14. Target 2/hari × 30 hari = 60 Excellent. Status konsultan tiba 45 hari lagi.",
        "Pertanyaan: susun rencana. Pembahasan: (1) Cadangan kini hanya cukup 7 hari (14/2) — defisit 46 untuk 30 hari operasi penuh. (2) Prioritas wave: targetkan klaster yang sudah TERBUKTI menghasilkan Excellent (5 klaster × 2) — gandakan variasinya; jangan hamburkan slot pada 8 klaster nol-Excellent tanpa hipotesis baru. (3) Selama 45 hari menunggu status: tahan 14 Excellent yang ada (sudah lolos self-corr), produksi wave untuk menutup defisit — target wave: 46 Excellent baru ≈ butuh ~1500 kandidat diuji pada rasio 3% (pelajaran: volume!). (4) Keputusan: JANGAN mulai submit parsial sebelum status — 14 Excellent adalah modal hari pertama; bakar sekarang = mulai dari nol lagi nanti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ini perencanaan modal — persis seperti perencanaan kecukupan modal bank: kebutuhan (60) vs tersedia (14) vs produksi (wave). Konsultan tanpa rencana cadangan = bank tanpa rencana permodalan: hidup dari gaji ke gaji.",
      },
      reference: "Kebutuhan 60, tersedia 14, defisit 46 → wave menutup, tahan modal awal.",
    },
    {
      id: "lab-simulator",
      eyebrow: "Langkah 8 · Lab",
      title: "Simulator 30 hari: kapan cadangan habis?",
      prose: [
        "Cadangan: slowrev 4, orth 3, correst 2, gap 1, fund 0 Excellent. Aturan harian: ambil 2 dari 2 klaster berbeda (dahulukan yang terbanyak). Tugasmu: simulasikan hari demi hari sampai cadangan < 2, lalu laporkan: berapa hari operasi? Klaster mana yang kosong duluan?",
        "Eksperimen setelah selesai: tambahkan wave baru di hari ke-3 yang menyuntik 4 Excellent ke 'gap' — berapa hari operasi sekarang? Inilah alasan wave harus jalan SEBELUM cadangan habis, bukan sesudah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis loop simulasi harian" },
        { id: "t2", text: "Cetak hari operasi + klaster yang kosong duluan" },
      ],
      expected: "Hari operasi: 5\nSisa cadangan: {'slowrev': 0, 'orth': 0, 'correst': 0, 'gap': 0, 'fund': 0}\nPeringatan: wave baru WAJIB sebelum hari ke-5",
      note: {
        title: "Intuisi",
        body: "Simulator 20 baris ini adalah 'stress test' cadangan — sama seperti stress test modal bank. Cadangan yang hanya cukup 5 hari tanpa produksi = rencana yang sudah kedaluwarsa sebelum dijalankan.",
      },
      hints: [
        "while sum(cad.values()) >= 2: ambil 2 klaster teratas yang masih > 0.",
        "sorted(cad, key=lambda k: -cad[k]) untuk urutan terbanyak.",
      ],
      code: {
        starter: "# Cadangan awal (klaster -> Excellent). JANGAN UBAH.\ncad = {\"slowrev\": 4, \"orth\": 3, \"correst\": 2, \"gap\": 1, \"fund\": 0}\n\n# TULIS KODEMU\nhari = 0\nwhile sum(cad.values()) >= 2:\n    pass  # ambil 2 dari 2 klaster berbeda, terbanyak dulu; hari += 1\n\nprint(f\"Hari operasi: {hari}\")\nprint(f\"Sisa cadangan: {cad}\")\nprint(f\"Peringatan: wave baru WAJIB sebelum hari ke-{hari}\")\n",
        lockLines: 2,
        solution: "# Cadangan awal (klaster -> Excellent). JANGAN UBAH.\ncad = {\"slowrev\": 4, \"orth\": 3, \"correst\": 2, \"gap\": 1, \"fund\": 0}\n\n# TULIS KODEMU\nhari = 0\nwhile sum(cad.values()) >= 2:\n    urut = sorted(cad, key=lambda k: -cad[k])\n    ambil = [k for k in urut if cad[k] > 0][:2]\n    for k in ambil:\n        cad[k] -= 1\n    hari += 1\n\nprint(f\"Hari operasi: {hari}\")\nprint(f\"Sisa cadangan: {cad}\")\nprint(f\"Peringatan: wave baru WAJIB sebelum hari ke-{hari}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Hari operasi = 5", msg: "10 Excellent / 2 per hari = 5 hari.", pattern: "Hari operasi: 5" },
          { kind: "stdout_matches", task: "t2", label: "Peringatan tercetak", msg: "Wave sebelum hari ke-5.", pattern: "Peringatan: wave baru WAJIB sebelum hari ke-5" }
        ],
      },
      reference: "Stress test cadangan = stress test modal. Produksi sebelum habis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang satuan yang benar dan ekonomi menahan.",
      ],
      tasks: [],
      summary: [
        "Target operasional: minimal 2 Excellent (F > 2,0) per hari.",
        "Cadangan efektif = jumlah klaster independen, bukan baris.",
        "Satu klaster runtuh bersama saat self-corr — diversifikasi = tambah klaster.",
        "Tahan submit sampai status konsultan = selamatkan komisi; syarat: lolos self-corr + ada tenggat.",
        "Dashboard konsultan: berapa klaster? berapa hari cadangan?",
      ],
      quiz: [
        {
          q: "286 kandidat = 17 klaster. Cadangan efektif?",
          options: [
            { text: "17 — dihitung per klaster independen", why: "Benar.", correct: true },
            { text: "286 — semua kandidat berkualitas", why: "Satuan salah: baris, bukan taruhan." },
            { text: "143 — setengahnya", why: "Tidak ada dasar membagi dua." }
          ],
        },
        {
          q: "Kenapa targetnya 2 Excellent/hari, bukan 2 submit/hari?",
          options: [
            { text: "Tidak semua lolos; 2 menjaga aliran alpha diterima tetap hidup", why: "Tepat — dengan kelolosan 30–50%.", correct: true },
            { text: "Karena platform mewajibkan tepat 2", why: "Tidak ada kewajiban platform — ini target operasional." },
            { text: "Agar terlihat sibuk", why: "Konsultan dibayar dari yang lolos, bukan dari kesibukan." }
          ],
        },
        {
          q: "10 alpha lolos self-corr, status konsultan 2 bulan lagi. Tindakan?",
          options: [
            { text: "Tahan — submit sekarang = tanpa komisi; produksi wave sambil menunggu", why: "Benar — selamatkan 10×C.", correct: true },
            { text: "Submit sekarang — momentum penting", why: "Momentum tanpa komisi = kerja bakti." },
            { text: "Buang — nanti juga basi", why: "Alpha terneutralisasi + TO rendah tidak basi dalam 2 bulan." }
          ],
        },
        {
          q: "Satu klaster berisi 43 baris. Artinya?",
          options: [
            { text: "Konsentrasi risiko — satu vonis menghapus 43 'cadangan'", why: "Tepat — titik kegagalan tunggal.", correct: true },
            { text: "Cadangan terbesar — aman", why: "Terbalik: ini yang paling rapuh." },
            { text: "Harus segera disubmit semua", why: "Submit massal satu klaster = bunuh diri self-corr." }
          ],
        },
        {
          q: "Cadangan 14 Excellent, target 2/hari. Berapa hari terpenuhi?",
          options: [
            { text: "7 hari (14 ÷ 2)", why: "Benar.", correct: true },
            { text: "14 hari", why: "Lupa targetnya 2 per hari, bukan 1." },
            { text: "28 hari", why: "Itu bila targetnya 0,5 per hari." }
          ],
        }
      ],
      reference: "Klaster = taruhan. 2 Excellent/hari. Tahan demi komisi.",
    },
  ],
};
