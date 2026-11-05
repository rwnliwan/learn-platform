import type { V2Lesson } from "../lib/types";

const FIG_HARGA = `<svg viewBox="0 0 520 300" role="img" aria-label="Diagram batang harga satuan per invoice: dua batang anomali menonjol.">
<g font-family="var(--font-ui)">
<text x="260" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Harga satuan per invoice (Rp/kg)</text>
<line x1="50" y1="240" x2="500" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="40" y="180" font-size="10" fill="var(--chart-text)" text-anchor="middle">95rb</text>
<text x="40" y="228" font-size="10" fill="var(--chart-text)" text-anchor="middle">46rb</text>
<g>
<rect x="70" y="222" width="26" height="18" fill="var(--c2)" opacity="0.7"/><rect x="100" y="220" width="26" height="20" fill="var(--c2)" opacity="0.7"/><rect x="130" y="221" width="26" height="19" fill="var(--c2)" opacity="0.7"/><rect x="160" y="219" width="26" height="21" fill="var(--c2)" opacity="0.7"/><rect x="190" y="222" width="26" height="18" fill="var(--c2)" opacity="0.7"/>
<rect x="220" y="120" width="26" height="120" fill="var(--c1)" stroke="var(--c1)" stroke-width="2"/>
<text x="233" y="110" font-size="10" fill="var(--c1)" text-anchor="middle" font-weight="bold">INV-006</text>
<rect x="270" y="224" width="20" height="16" fill="var(--c3)" opacity="0.7"/><rect x="294" y="223" width="20" height="17" fill="var(--c3)" opacity="0.7"/><rect x="318" y="224" width="20" height="16" fill="var(--c3)" opacity="0.7"/><rect x="342" y="223" width="20" height="17" fill="var(--c3)" opacity="0.7"/><rect x="366" y="224" width="20" height="16" fill="var(--c3)" opacity="0.7"/><rect x="390" y="224" width="20" height="16" fill="var(--c3)" opacity="0.7"/><rect x="414" y="223" width="20" height="17" fill="var(--c3)" opacity="0.7"/><rect x="438" y="224" width="20" height="16" fill="var(--c3)" opacity="0.7"/>
<rect x="462" y="232" width="20" height="8" fill="var(--c4)" stroke="var(--c4)" stroke-width="2"/>
<text x="472" y="222" font-size="10" fill="var(--c4)" text-anchor="middle" font-weight="bold">INV-015</text>
</g>
<text x="150" y="262" font-size="10" fill="var(--chart-text)" text-anchor="middle">kopi arabika (Rp/kg)</text>
<text x="365" y="262" font-size="10" fill="var(--chart-text)" text-anchor="middle">kain katun (Rp/meter)</text>
<text x="472" y="262" font-size="10" fill="var(--chart-text)" text-anchor="middle">anomali</text>
<text x="260" y="288" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mata melihat “sekilas mirip”. Z-score melihat 2,23σ dan −2,81σ.</text>
</g>
</svg>`;

export const aml26: V2Lesson = {
  slug: "aml26-trade-based-ml",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML26 — Trade-Based Money Laundering: ML untuk Manipulasi Invoice",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kopi Rp95.000 per kilo: salah ketik atau pencucian uang?",
      prose: [
        "Seorang analis trade finance menatap invoice impor kopi arabika: harga satuan Rp95.000 per kg. Harga pasar saat itu sekitar Rp46.000 per kg. Ia menelepon importir; jawabannya tenang: 'Salah ketik, nanti kami revisi.' Analis mengangguk — kesalahan ketik memang terjadi. Tiga bulan kemudian, audit menemukan 40 invoice 'salah ketik' serupa dari jaringan perusahaan yang sama, semuanya menggelembungkan nilai barang. Total dana yang 'kelebihan bayar' dan parkir di luar negeri: Rp38 miliar.",
        "Twist-nya: pembelaan 'salah ketik' berhasil untuk SATU invoice — tetapi runtuh saat diuji secara statistik. Satu harga Rp95.000 bisa jadi typo; 40 harga yang semuanya menyimpang ke arah yang sama (selalu LEBIH mahal, tidak pernah lebih murah) memiliki probabilitas typo yang praktis nol. Analis yang hanya memeriksa invoice satu per satu akan selalu kalah dari pembelaan ini; analis yang memeriksa DISTRIBUSI tidak bisa dibohongi.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan tiga modus trade-based money laundering (over/under-invoicing, multiple invoicing, phantom shipment); (2) membangun harga benchmark per komoditas; (3) menghitung z-score untuk mengubah 'firasat mahal' menjadi angka; (4) merancang fitur ML dari data perdagangan; (5) menulis temuan dengan bahasa yang membedakan anomali statistik dari vonis kejahatan. Pola yang dipakai adalah tipologi TBML yang didokumentasikan dalam panduan internasional anti pencucian uang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "TBML adalah jalur pencucian favorit karena 'berpakaian' perdagangan sah — bank melihat dokumen lengkap, bea cukai melihat barang bergerak. Analis yang bisa membaca invoice seperti membaca laporan keuangan (mencari yang tidak wajar, bukan yang tidak lengkap) mengisi celah yang jarang diisi orang.",
      },
      reference: "Satu invoice bisa typo; distribusi tidak bisa.",
    },
    {
      id: "tiga-modus",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga sulap faktur",
      prose: [
        "Si Tukang Sulap Faktur. Sulap pertama: over-invoicing — menulis harga LEBIH TINGGI dari nilai sebenarnya. Importir membayar Rp95.000 untuk kopi Rp46.000; selisihnya parkir di rekening eksportir di luar negeri. Dana kotor 'keluar' negeri dengan bungkus dagang yang sah. Kebalikannya, under-invoicing: menulis harga LEBIH RENDAH — menekan bea masuk/pajak, atau memindahkan nilai ke pihak lain secara diam-diam.",
        "Sulap kedua: multiple invoicing — satu pengiriman barang difakturkan berkali-kali ke bank yang berbeda untuk mencairkan pembiayaan ganda; setiap bank melihat dokumen yang tampak sah. Sulap ketiga: phantom shipment — tidak ada barang sama sekali; yang bergerak hanya dokumen dan uang. Ini yang paling berani sekaligus paling rapuh: sekali bea cukai memverifikasi fisik, sulapnya terbongkar.",
        "Benang merah ketiganya: yang dimanipulasi bukan uangnya, melainkan CERITA tentang uang itu — harga, kuantitas, atau keberadaan barang. Karena itu pertahanan TBML bukan memeriksa uang, melainkan memeriksa konsistensi cerita: apakah harga, volume, dan logistiknya saling masuk akal?",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Over vs under bukan soal 'mana yang lebih jahat' — melainkan soal ARAH aliran nilai. Over-invoicing memindahkan nilai KE LUAR (importir membayar lebih); under-invoicing menahan nilai DI DALAM atau mengecilkan pajak. Saat melihat anomali, tanyakan dulu: nilai mengalir ke mana?",
      },
      reference: "Yang dipalsukan adalah cerita, bukan uangnya.",
    },
    {
      id: "benchmark",
      eyebrow: "Langkah 3 · Konsep",
      title: "Harga pembanding: dari mana angka 'wajar' itu?",
      prose: [
        "Si Juru Timbang. Z-score butuh rata-rata dan simpangan baku 'harga normal' — tetapi dari mana? Sumber benchmark berlapis: (1) harga kontrak/komoditas acuan (untuk komoditas standar seperti kopi, ada harga acuan internasional); (2) riwayat transaksi nasabah itu sendiri — importir yang sama biasanya membeli di kisaran yang konsisten; (3) peer group — importir sejenis dengan volume sebanding.",
        "Tiga jebakan benchmark: pertama, grade kualitas — kopi arabika grade specialty memang 2–3x lipat dari grade komersial; membandingkan tanpa menyamakan grade menghasilkan false positive. Kedua, waktu — harga komoditas bergerak; invoice Januari tidak bisa dibandingkan dengan harga Desember tanpa penyesuaian. Ketiga, Incoterms & biaya — harga CIF (termasuk ongkir & asuransi) wajar lebih tinggi dari FOB; bandingkan apel dengan apel.",
        "Aturan praktis analis: benchmark terbaik adalah yang paling SPESIFIK — komoditas sama, grade sama, periode sama, skema pengiriman sama. Setiap lapisan spesifisitas yang hilang menambah noise, dan noise adalah tempat anomali bersembunyi (atau tempat false positive lahir).",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Ada satu harga pasar untuk tiap komoditas.” Tidak ada. Harga kopi bervariasi menurut grade, asal, kontrak vs spot, dan waktu. Analis yang memakai satu angka acuan untuk semua invoice akan menandai pedagang jujur sebagai pencuci — dan kehilangan kredibilitas saat temuan dibantah dengan satu lembar spesifikasi grade.",
      },
      reference: "Bandingkan apel dengan apel: grade, waktu, skema.",
    },
    {
      id: "zscore",
      eyebrow: "Langkah 4 · Konsep",
      title: "Z-score: firasat yang bisa dihitung",
      prose: [
        "Si Penggaris Statistik. 'Harga ini terlihat mahal' adalah firasat; 'harga ini 2,23 simpangan baku di atas rata-rata' adalah temuan. Z-score mengukur seberapa jauh sebuah harga menyimpang dari kelompoknya, dalam satuan simpangan baku — sehingga Rp95.000 untuk kopi dan Rp14.000 untuk kain bisa dibandingkan dalam bahasa yang sama.",
        "Rumus kerja analis — z-score:",
      ],
      formula: String.raw`z = \frac{x - \mu}{\sigma}`,
      formulaNote: "x = harga satuan pada invoice yang diperiksa; μ (mu) = rata-rata harga satuan komoditas yang sama dalam kelompok pembanding; σ (sigma) = simpangan baku kelompok itu (gunakan simpangan baku populasi bila kelompoknya adalah seluruh data yang ada); z = jumlah simpangan baku penyimpangan — |z| > 2 berarti harga berada di luar ~95% sebaran normal, layak di-flag untuk pendalaman. Contoh: kopi μ=54.417, σ=18.176 → invoice Rp95.000 memberi z = (95.000−54.417)/18.176 = 2,23 → ter-flag OVER-INVOICING.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Z-score tinggi = pasti fraud.” Z-score mengukur KEJARANGAN statistik, bukan kesalahan. Kopi grade specialty yang sah bisa ber-z-score 2,5. Alur yang benar: z-score memicu PENDALAMAN (cek grade, kontrak, pemasok) — vonis hanya setelah pendalaman, tidak pernah dari angka saja.",
      },
      reference: "Z-score memicu pendalaman, bukan vonis.",
    },
    {
      id: "fitur-ml",
      eyebrow: "Langkah 5 · Konsep",
      title: "Dari z-score ke fitur ML",
      prose: [
        "Si Perakit Senjata. Z-score adalah satu fitur; model ML yang baik merakit BANYAK fitur dari data perdagangan. Katalog fitur TBML yang dipakai praktisi: (1) z-score harga per komoditas-grade; (2) frekuensi anomali per pasangan importir-eksportir (satu anomali = insiden; lima anomali = pola); (3) round-tripping entitas — perusahaan A menjual ke B yang menjual kembali ke A; (4) ketidakcocokan kode HS (barang diklaim sebagai kode bertarif rendah); (5) anomali logistik — berat/volume tidak konsisten dengan barang yang diklaim; (6) kecepatan invoice — 40 invoice dalam sepekan dari importir yang biasanya 2 per bulan.",
        "Cara membaca figur: batang-batang pendek yang seragam = harga normal yang mengelompok; dua batang yang menonjol (INV-006 ke atas, INV-015 ke bawah) = anomali dua arah — over dan under. Interpretasi: mata manusia melihat 'sekilas mirip'; z-score melihat 2,23σ dan −2,81σ. Pelajaran untuk perancang fitur: visualisasi distribusi adalah cara tercepat meyakinkan non-teknis bahwa temuanmu nyata — satu gambar mengalahkan tiga paragraf angka.",
        "Prinsip perancangan fitur: mulai dari yang bisa dijelaskan ke auditor ('z-score harga'), bukan dari yang paling canggih. Model yang tidak bisa dijelaskan tidak akan dipakai — temuan TBML harus bisa dipertahankan di depan kepatuhan, regulator, bahkan pengadilan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Fitur terbaik TBML sering bukan tentang harga, melainkan tentang PERILAKU: siapa berdagang dengan siapa, seberapa sering, dan apakah barangnya benar-benar berpindah. Harga bisa dimanipulasi dalam dokumen; pola perilaku jauh lebih sulit dipalsukan secara konsisten.",
      },
      figure: {
        svg: FIG_HARGA,
        alt: "Diagram batang harga satuan: dua invoice anomali menonjol dari kelompoknya.",
        caption: "Anomali dua arah: INV-006 over-invoicing (z=2,23), INV-015 under-invoicing (z=−2,81).",
      },
      reference: "Fitur perilaku lebih sulit dipalsukan daripada harga.",
    },
    {
      id: "lab-zscore",
      eyebrow: "Langkah 6 · Lab",
      title: "Flag invoice anomali dengan z-score",
      prose: [
        "Dua puluh invoice, tiga komoditas, harga satuan tertanam. Tugasmu: (1) kelompokkan harga per komoditas, hitung rata-rata (mean) dan simpangan baku populasi (pstdev) memakai modul statistics; (2) hitung z-score tiap invoice; (3) flag invoice dengan |z| > 2 beserta arahnya (OVER/UNDER-INVOICING), dan simpan daftar id-nya di `terflag`.",
        "Hasil yang benar: INV-006 (kopi arabika Rp95.000) → z=2,23 → OVER-INVOICING; INV-015 (kain katun Rp14.000) → z=−2,81 → UNDER-INVOICING; 18 invoice lain bersih. Perhatikan: minyak sawit tidak punya anomali — kelompok yang sehat adalah kontrol yang membuktikan metodemu tidak asal menandai.",
      ],
      tasks: [
        { id: "t1", text: "Kelompokkan harga per komoditas; hitung `mean` & `pstdev` tiap kelompok" },
        { id: "t2", text: "Hitung z-score tiap invoice; flag bila |z| > 2" },
        { id: "t3", text: "Cetak invoice ter-flag + simpan id-nya di `terflag`" },
      ],
      expected: "INV-006: z=2.23 OVER-INVOICING\nINV-015: z=-2.81 UNDER-INVOICING",
      note: {
        title: "💡 Intuisi",
        body: "Kenapa pstdev (populasi) bukan stdev (sampel)? Karena kelompok pembanding di sini adalah SELURUH invoice yang kita miliki untuk komoditas itu — bukan sampel dari populasi yang lebih besar. Pilihan ini mengubah angka sedikit, tetapi analis yang baik tahu asumsi di balik tiap angka yang ia laporkan.",
      },
      hints: [
        "statistics.mean(grup[komoditas]) dan statistics.pstdev(grup[komoditas]).",
        "z = (harga - mu) / sd; flag bila abs(z) > 2.",
        "arah = 'OVER-INVOICING' bila z > 0 else 'UNDER-INVOICING'.",
      ],
      code: {
        starter: "import statistics\nfrom collections import defaultdict\n\n# Data invoice: (id, komoditas, harga_satuan). JANGAN UBAH.\ninvoices = [\n    (\"INV-001\", \"kopi arabika\", 45000), (\"INV-002\", \"kopi arabika\", 47000),\n    (\"INV-003\", \"kopi arabika\", 46000), (\"INV-004\", \"kopi arabika\", 48000),\n    (\"INV-005\", \"kopi arabika\", 45500), (\"INV-006\", \"kopi arabika\", 95000),\n    (\"INV-007\", \"kain katun\", 28000), (\"INV-008\", \"kain katun\", 29000),\n    (\"INV-009\", \"kain katun\", 27500), (\"INV-010\", \"kain katun\", 28500),\n    (\"INV-011\", \"kain katun\", 28200), (\"INV-012\", \"kain katun\", 27800),\n    (\"INV-013\", \"kain katun\", 28800), (\"INV-014\", \"kain katun\", 28100),\n    (\"INV-015\", \"kain katun\", 14000),\n    (\"INV-016\", \"minyak sawit\", 12000), (\"INV-017\", \"minyak sawit\", 12500),\n    (\"INV-018\", \"minyak sawit\", 11800), (\"INV-019\", \"minyak sawit\", 12200),\n    (\"INV-020\", \"minyak sawit\", 12100),\n]\n\n# TULIS KODEMU di bawah.\ngrup = \nterflag = []\nfor iid, kom, harga in invoices:\n    mu = \n    sd = \n    z = \n    if abs(z) > 2:\n        arah = \n        terflag.append(iid)\n        print(f\"{iid}: z={z:.2f} {arah}\")\n",
        lockLines: 16,
        solution: "import statistics\nfrom collections import defaultdict\n\n# Data invoice: (id, komoditas, harga_satuan). JANGAN UBAH.\ninvoices = [\n    (\"INV-001\", \"kopi arabika\", 45000), (\"INV-002\", \"kopi arabika\", 47000),\n    (\"INV-003\", \"kopi arabika\", 46000), (\"INV-004\", \"kopi arabika\", 48000),\n    (\"INV-005\", \"kopi arabika\", 45500), (\"INV-006\", \"kopi arabika\", 95000),\n    (\"INV-007\", \"kain katun\", 28000), (\"INV-008\", \"kain katun\", 29000),\n    (\"INV-009\", \"kain katun\", 27500), (\"INV-010\", \"kain katun\", 28500),\n    (\"INV-011\", \"kain katun\", 28200), (\"INV-012\", \"kain katun\", 27800),\n    (\"INV-013\", \"kain katun\", 28800), (\"INV-014\", \"kain katun\", 28100),\n    (\"INV-015\", \"kain katun\", 14000),\n    (\"INV-016\", \"minyak sawit\", 12000), (\"INV-017\", \"minyak sawit\", 12500),\n    (\"INV-018\", \"minyak sawit\", 11800), (\"INV-019\", \"minyak sawit\", 12200),\n    (\"INV-020\", \"minyak sawit\", 12100),\n]\n\n# TULIS KODEMU di bawah.\ngrup = defaultdict(list)\nfor _iid, _kom, _harga in invoices:\n    grup[_kom].append(_harga)\nterflag = []\nfor iid, kom, harga in invoices:\n    mu = statistics.mean(grup[kom])\n    sd = statistics.pstdev(grup[kom])\n    z = (harga - mu) / sd\n    if abs(z) > 2:\n        arah = \"OVER-INVOICING\" if z > 0 else \"UNDER-INVOICING\"\n        terflag.append(iid)\n        print(f\"{iid}: z={z:.2f} {arah}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t3", label: "INV-006 ter-flag", msg: "Over-invoicing kopi.", pattern: "INV-006: z=2.23 OVER-INVOICING" },
          { kind: "stdout_matches", task: "t3", label: "INV-015 ter-flag", msg: "Under-invoicing kain.", pattern: "INV-015: z=-2.81 UNDER-INVOICING" },
          { kind: "equal", task: "t3", name: "terflag", value: ["INV-006", "INV-015"], label: "`terflag` tepat 2 invoice", msg: "Hanya dua anomali." },
          { kind: "defined", task: "t1", name: "grup", label: "`grup` terdefinisi", msg: "Pengelompokan per komoditas." },
          { kind: "uses", task: "t1", token: "pstdev", label: "memakai pstdev", msg: "Simpangan baku populasi." },
          { kind: "uses", task: "t1", token: "mean", label: "memakai mean", msg: "Rata-rata kelompok." },
        ],
      },
      reference: "Kelompokkan, hitung z, flag |z|>2.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: respons atas invoice ter-flag",
      prose: [
        "Skenario 1 — |z| > 3 atau anomali berulang pada pasangan importir-eksportir yang sama → eskalasi ke investigasi: minta dokumen pendukung (kontrak, spesifikasi grade, bukti pembayaran) dan cek silang pemasok.",
        "Skenario 2 — 2 < |z| ≤ 3, kejadian tunggal, importir bereputasi baik → klarifikasi tertulis dulu ('mohon penjelasan perbedaan harga vs benchmark'); jangan langsung eskalasi — beri kesempatan menjelaskan grade/kondisi khusus.",
        "Skenario 3 — Anomali UNDER-invoicing → arahkan ke tim bea cukai/pajak (potensi penghindaran bea masuk), bukan tim AML — karena nilai 'bocor' ke dalam, bukan keluar. Salah alamat eskalasi membuang waktu dua tim.",
        "Skenario 4 — Pola multiple invoicing (satu shipment, banyak invoice ke bank berbeda) → koordinasi antar-bank/Lembaga: satu bank tidak bisa melihat invoice di bank lain; ini kasus untuk berbagi informasi, bukan investigasi sendirian.",
        "Aturan 10 detik: (1) z-nya berapa & ke arah mana? (2) tunggal atau pola? (3) siapa yang paling dirugikan negara/bank? Tindaklanjuti sesuai alamat yang benar — AML, pajak, atau kepatuhan.",
      ],
      tasks: [],
      reference: "Skor memicu; alamat eskalasi menentukan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "40 invoice 'salah ketik'",
      prose: [
        "Kembali ke cerita pembuka dengan angka. Audit menemukan 40 invoice dari satu jaringan importir, semuanya over-invoicing dengan z-score antara 2,1 dan 3,4 — tidak ada satu pun under. Rata-rata kelebihan bayar per invoice: Rp49 juta. Total: Rp38 miliar dalam 8 bulan. Importir berdalih: 'kesalahan input berulang oleh staf baru.'",
        "Pertanyaan: (1) Mengapa pembelaan 'salah ketik' runtuh secara statistik? (2) Fitur tambahan apa (selain z-score harga) yang memperkuat kasus ini? (3) Apa langkah pertama analis sebelum menulis laporan eskalasi?",
        "Pembahasan: (1) Typo acak akan menyebar dua arah (kadang lebih murah, kadang lebih mahal) dan jarang berulang 40 kali pada entitas yang sama — probabilitas 40 penyimpangan searah secara kebetulan praktis nol; ini pola, bukan kecelakaan. (2) Frekuensi anomali per pasangan entitas, round-tripping (apakah eksportirnya terafiliasi), dan kecepatan invoice (40 dalam 8 bulan vs baseline importir). (3) Verifikasi grade & kontrak dulu — pastikan bukan kopi specialty yang memang mahal; analis yang melewatkan langkah ini akan dipermalukan oleh satu lembar spesifikasi.",
      ],
      tasks: [],
      reference: "Pola searah 40x bukan kecelakaan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Tiga modus TBML: over/under-invoicing (manipulasi harga), multiple invoicing (satu barang, banyak klaim), phantom shipment (tanpa barang).",
        "Benchmark harus spesifik: komoditas + grade + periode + skema pengiriman yang sama; jika tidak, false positive.",
        "Z-score z=(x−μ)/σ mengubah firasat menjadi angka; |z|>2 = layak didalami, bukan vonis.",
        "Fitur ML TBML: z-score harga, frekuensi anomali per pasangan entitas, round-tripping, ketidakcocokan kode HS, anomali logistik.",
        "Arah anomali menentukan alamat eskalasi: over → AML (nilai keluar), under → bea cukai/pajak.",
      ],
      quiz: [
        {
          q: "Importir membayar Rp95.000/kg untuk kopi seharga pasar Rp46.000/kg. Modus TBML apa ini?",
          options: [
            { text: "Over-invoicing — memindahkan nilai ke luar negeri lewat harga yang digelembungkan", why: "Benar: selisih harga = nilai yang 'parkir' di luar.", correct: true },
            { text: "Under-invoicing", why: "Salah: itu kebalikannya — harga ditulis lebih rendah." },
            { text: "Multiple invoicing", why: "Salah: itu satu barang difakturkan berkali-kali." },
            { text: "Phantom shipment", why: "Salah: itu tanpa barang sama sekali." },
          ],
        },
        {
          q: "Mengapa pembelaan 'salah ketik' runtuh untuk 40 invoice yang semuanya over?",
          options: [
            { text: "Typo acak menyebar dua arah; 40 penyimpangan searah praktis mustahil kebetulan", why: "Benar: pola searah = bukan kecelakaan.", correct: true },
            { text: "Staf baru tidak mungkin salah ketik", why: "Salah: staf baru justru sering salah — argumennya soal pola, bukan kemungkinan." },
            { text: "Kopi tidak mungkin salah ketik harganya", why: "Salah: satu invoice memang bisa typo." },
            { text: "Angka 40 terlalu besar untuk dipercaya", why: "Salah: bukan besarnya angka, melainkan konsistensi arahnya." },
          ],
        },
        {
          q: "Invoice kain Rp14.000 vs rata-rata kelompok Rp28.000 (z=−2,81). Tindakan yang tepat:",
          options: [
            { text: "Dalami sebagai under-invoicing; eskalasi ke tim bea cukai/pajak bila terbukti pola", why: "Benar: arah under = nilai bocor ke dalam.", correct: true },
            { text: "Eskalasi ke tim AML sebagai pencucian uang", why: "Salah alamat: under-invoicing merugikan penerimaan negara, bukan memindahkan dana kotor keluar." },
            { text: "Abaikan karena z negatif berarti murah = bagus", why: "Salah: 'murah' dalam dokumen bisa berarti manipulasi." },
            { text: "Langsung denda importir", why: "Salah: analis tidak menjatuhkan sanksi; dan z-score bukan vonis." },
          ],
        },
        {
          q: "Benchmark harga yang paling bisa dipertahankan dari bantahan:",
          options: [
            { text: "Komoditas + grade + periode + skema pengiriman yang sama", why: "Benar: semakin spesifik, semakin sulit dibantah.", correct: true },
            { text: "Rata-rata harga semua komoditas tahun ini", why: "Salah: terlalu kasar — grade dan waktu diabaikan." },
            { text: "Harga dari satu website acuan", why: "Salah: satu sumber belum tentu mewakili grade/periode invoice." },
            { text: "Harga yang disepakati importir dan eksportir", why: "Salah: itu justru harga yang sedang diperiksa." },
          ],
        },
        {
          q: "Selain z-score harga, fitur ML yang paling sulit dipalsukan pelaku:",
          options: [
            { text: "Pola perilaku: frekuensi anomali, round-tripping entitas, kecepatan invoice", why: "Benar: perilaku konsisten sulit dipalsukan.", correct: true },
            { text: "Nilai nominal invoice", why: "Salah: nominal adalah yang paling mudah dimanipulasi." },
            { text: "Nama perusahaan di kop invoice", why: "Salah: kop surat mudah dibuat." },
            { text: "Jumlah halaman dokumen", why: "Salah: tidak relevan dengan kecurangan." },
          ],
        },
        {
          q: "Satu invoice ber-z-score 2,5 dari importir bereputasi baik, kejadian pertama. Respons:",
          options: [
            { text: "Minta klarifikasi tertulis — cek grade/kondisi khusus sebelum eskalasi", why: "Benar: proporsional; z-score memicu pendalaman.", correct: true },
            { text: "Langsung eskalasi ke investigasi fraud", why: "Salah: berlebihan untuk kejadian tunggal tanpa pola." },
            { text: "Blokir fasilitas trade finance importir", why: "Salah: hukuman tanpa pendalaman." },
            { text: "Abaikan — reputasi baik berarti bersih", why: "Salah: reputasi bukan bukti; klarifikasi tetap murah dilakukan." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Model sudah menandai, tugas analis selesai.” Terbalik: model menandai KANDIDAT; analis memverifikasi grade, kontrak, dan konteks, lalu menulis temuan yang bisa dipertahankan. Analis yang meneruskan flag mentah ke eskalasi akan cepat kehilangan kepercayaan tim investigasi.",
      },
      hints: [
        "Uji cepat: jelaskan beda over vs under dan ke mana masing-masing dieskalasi.",
        "Ingat: benchmark spesifik, z memicu pendalaman, pola mengalahkan insiden tunggal.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      reference: "Distribusi tidak bisa berbohong seperti satu invoice.",
    },
  ],
};
