import type { V2Lesson } from "../lib/types";

const FIG_AIS = `<svg viewBox="0 0 480 300" role="img" aria-label="Timeline AIS kapal: sinyal hidup, mati 60 jam, hidup kembali.">
<g font-family="var(--font-ui)">
<text x="240" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Jejak AIS &#8220;Sea Fortune&#8221;: 60 jam menghilang</text>
<line x1="40" y1="120" x2="440" y2="120" stroke="var(--chart-text)" stroke-width="1" opacity="0.4"/>
<line x1="40" y1="60" x2="180" y2="60" stroke="var(--c1)" stroke-width="8" stroke-linecap="round"/>
<circle cx="40" cy="60" r="6" fill="var(--c1)"/>
<circle cx="180" cy="60" r="6" fill="var(--c1)"/>
<text x="110" y="48" font-size="11" fill="var(--chart-text)" text-anchor="middle">sinyal normal</text>
<line x1="180" y1="120" x2="330" y2="120" stroke="var(--c4)" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 6"/>
<text x="255" y="108" font-size="11" fill="var(--c4)" text-anchor="middle" font-weight="600">GAP 60 JAM</text>
<text x="255" y="150" font-size="11" fill="var(--chart-text)" text-anchor="middle">AIS dimatikan &#8212; zona transfer STS</text>
<line x1="330" y1="60" x2="440" y2="60" stroke="var(--c1)" stroke-width="8" stroke-linecap="round"/>
<circle cx="330" cy="60" r="6" fill="var(--c1)"/>
<circle cx="440" cy="60" r="6" fill="var(--c1)"/>
<text x="385" y="48" font-size="11" fill="var(--chart-text)" text-anchor="middle">muncul: draft +2m</text>
<text x="40" y="200" font-size="11" fill="var(--chart-text)">Petunjuk analis: draft (sarat kapal) naik 2 meter = memuat &#177;8.000 ton</text>
<text x="40" y="220" font-size="11" fill="var(--chart-text)">saat &#8220;tidak ke mana-mana&#8221;. Fisika tidak berbohong.</text>
<text x="240" y="262" font-size="11" fill="var(--chart-text)" text-anchor="middle">Cara membaca: garis putus-putus = periode tanpa sinyal.</text>
<text x="240" y="282" font-size="11" fill="var(--chart-text)" text-anchor="middle">Interpretasi: gap + perubahan draft = transfer gelap di laut.</text>
</g>
</svg>`;

export const aml15: V2Lesson = {
  slug: "aml15-sanctions-evasion",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML15 — Sanctions Evasion Methods",
  estMinutes: 58,
  steps: [
    {
      id: "sampul",
      eyebrow: "Sampul",
      title: "Sanksi ada, tetapi kapalnya menghilang",
      prose: [
        "AML15 — Sanctions Evasion Methods · 58 menit · 3 lab Python · 5 kuis · 1 mini-case · 1 chart.",
        "Daftar isi: 1. Cerita: 60 jam hilangnya 'Sea Fortune'. 2. Konsep: tiga metode evasi. 3. Konsep: red flags dan skor risiko evasi. 4. Lab: deteksi AIS gap. 5. Lab: skor risiko kapal. 6. Lab: anomali harga barang dual-use. 7. Peta keputusan: indikasi evasi, respons apa. 8. Mini-case: kargo 'mesin pertanian'. 9. Checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga metode evasi sanksi (dark fleet, crypto mixer, trade-based circumvention) dan bedanya dengan pelanggaran screening biasa; (2) membaca jejak AIS dan mengenali pola transfer gelap; (3) menghitung skor risiko evasi kapal dari red flags; (4) mendeteksi anomali harga barang dual-use; (5) menentukan eskalasi yang tepat atas indikasi evasi.",
        "Konteks: AML4 mengajarkan sisi PERTAHANAN (screening nama vs daftar sanksi). Lesson ini sisi SERANGAN — bagaimana pelaku menghindari pertahanan itu. CAMS edisi ke-7 menempatkan sanctions evasion di domain inti spektrum Anti-Financial Crime. Analis yang hanya paham screening = penjaga yang hanya tahu bentuk gerbangnya.",
      ],
      tasks: [],
      reference: "AML4 = pertahanan (screening). AML15 = serangan (evasi).",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "60 jam hilangnya 'Sea Fortune'",
      prose: [
        "Kapal tanker 'Sea Fortune', bendera negara yang jarang terdengar, berlayar dari Teluk menuju Asia Tenggara dengan muatan minyak mentah. Di tengah Selat Malaka, AIS-nya — sistem pelaporan posisi wajib — mati. 60 jam kemudian ia muncul kembali 200 mil jauhnya. Draf kapalnya (kedalaman sarat) naik 2 meter: ia memuat ~8.000 ton 'sesuatu' saat 'tidak ke mana-mana'.",
        "Twist-nya: dokumen pelayaran menyatakan minyak dari negara A (tidak disanksi). Tetapi sampel kargo dan pola pelayaran cocok dengan minyak negara B (disanksi). Pembayarannya tidak lewat bank — melainkan kripto via mixer, dalam tiga tranche. Satu pengiriman, tiga kejahatan sekaligus: pemalsuan asal barang, pelayaran gelap, dan pencucian via aset virtual.",
        "Bagi analis AFC, pelajarannya: evasi sanksi modern adalah operasi GABUNGAN — laut + dokumen + kripto. Tim sanksi yang hanya memeriksa dokumen, tim kripto yang hanya memeriksa wallet, dan tim trade finance yang hanya memeriksa L/C — ketiganya melihat sepertiga gajah. Lesson ini melatihmu melihat gajahnya utuh.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank yang memfasilitasi trade finance untuk kargo semacam ini — walau 'dokumennya lengkap' — berisiko melanggar sanksi internasional: denda miliaran dolar AS untuk bank global, dan risiko koresponden untuk bank Indonesia. 'Dokumen lengkap' bukan pertahanan; verifikasi substansi (rute, harga, AIS) adalah.",
      },
      reference: "Evasi = operasi gabungan laut + dokumen + kripto.",
    },
    {
      id: "tiga-metode",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga metode evasi: kenali kepribadiannya",
      prose: [
        "Dark fleet — Si Hantu Laut. Armada kapal tua (rata-rata >15 tahun), bendera berganti-ganti, pemilik tersembunyi di balik 3–4 lapis perusahaan cangkang, AIS yang 'rusak' di momen strategis, dan transfer ship-to-ship (STS) di tengah laut. Kepribadiannya: ia tidak bersembunyi — ia BERPURA-PURA menjadi kapal biasa yang sial (AIS rusak, bendera sah). Tugas analis: bedakan 'sial' dari 'sengaja' — kapal sial tidak menghilang tepat di zona transfer lalu muncul dengan draf naik 2 meter.",
        "Crypto mixer — Si Pengaduk. Sama seperti di AML13, tetapi di sini tujuannya spesifik: memutus tautan antara pembayaran dan barang/jasa yang disanksi. Pola khas evasi: pembayaran dalam 2–3 tranche via mixer ke wallet yang baru dibuat < 7 hari, lalu dicairkan di exchange yurisdiksi longgar. Bedanya dengan pencucian biasa: jumlahnya sering BULAT dan TERJADWAL (cicilan kontrak), bukan acak.",
        "Trade-based circumvention — Si Pedagang Topeng. Barang disanksi disamarkan lewat: (1) misdeclaration — 'mesin pertanian' yang ternyata komponen dual-use; (2) false end-user — pembeli di negara netral yang meneruskan; (3) over/under-invoicing — harga 3x pasar untuk menyelundupkan nilai (atau 1/3 pasar untuk mengecilkan bea + menyembunyikan margin). Kepribadiannya: dokumennya SELALU rapi — karena topengnya memang dokumen.",
        "Benang merah: ketiga metode menyerang TITIK BUTA yang berbeda — dark fleet menyerang visibilitas fisik, mixer menyerang visibilitas keuangan, topeng dokumen menyerang kepercayaan pada kertas. Pertahanan = verifikasi silang ketiganya: fisika (AIS, draf) vs dokumen (asal barang) vs uang (pola bayar).",
      ],
      formula: String.raw`S = \sum_{i=1}^{6} w_i \cdot f_i`,
      formulaNote: "S = skor risiko evasi (0–14); enam red flags berbobot: AIS gap >24 jam (3), STS di zona berisiko (3), harga anomali ±50% pasar (2), pemilik lapis cangkang ≥3 (2), pembayaran via mixer (2), dokumen asal berubah di tengah jalan (2). Contoh 'Sea Fortune': 3+3+0+2+2+2 = 12 → KRITIS (≥10). Interpretasi: skor ≥10 = tolak/hentikan + lapor; 6–9 = EDD mendalam; <6 = pantau.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Tidak ada di daftar sanksi = boleh diproses.” Screening (AML4) hanya menangkap yang SUDAH terdaftar. Evasi justru dirancang untuk TIDAK terdaftar: nama baru, bendera baru, perusahaan cangkang baru. 'Lolos screening' adalah asumsi desain pelaku — bukan bukti bersih.",
      },
      hints: [
        "Hantu Laut (fisik), Pengaduk (uang), Topeng (dokumen) — verifikasi silang ketiganya.",
        "Skor evasi: ≥10 kritis, 6–9 EDD, <6 pantau.",
      ],
      reference: "Tiga serangan, tiga titik buta. Lawan dengan verifikasi silang.",
    },
    {
      id: "redflags",
      eyebrow: "Langkah 3 · Konsep",
      title: "Membaca laut dan dokumen seperti analis",
      prose: [
        "Membaca AIS: kapal normal memancarkan posisi tiap 2–10 menit. Gap >24 jam = anomali; gap yang DIAKHIRI perubahan draf signifikan = transfer muatan. STS (ship-to-ship) legal untuk banyak kargo — tetapi STS di zona yang dikenal sebagai titik transfer gelap + AIS mati = pola evasi klasik. Analis tidak butuh satelit: data AIS komersial + data draf pelabuhan cukup untuk skor awal.",
        "Membaca dokumen: tiga uji cepat. (1) Uji harga: bandingkan unit price dengan harga pasar (database komoditas) — deviasi >50% = anomali. (2) Uji rute: apakah rute ekonomis? Memutar 2.000 mil untuk 'menghemat' = tidak ekonomis = menyembunyikan sesuatu. (3) Uji konsistensi: berat kargo vs kapasitas kapal vs draf; asal barang vs pola pelayaran historis kapal.",
        "Membaca pembayaran: tranche via mixer + wallet baru + exchange yurisdiksi longgar = pola evasi. Terutama waspadai 'pembayaran mendahului dokumen': uang bergerak SEBELUM L/C diterbitkan — tanda transaksi dirancang di luar sistem perbankan formal.",
        "Cara membaca figur: garis utuh = AIS hidup, garis putus-putus = gap 60 jam. Interpretasi: gap + draf naik 2 meter (+~8.000 ton) = kapal memuat saat 'hilang'. Fisika tidak berbohong — draf adalah sidik jari muatan.",
      ],
      figure: {
        svg: FIG_AIS,
        alt: "Timeline AIS: sinyal normal, gap 60 jam, muncul dengan draf naik.",
        caption: "Gap + draf naik = transfer gelap. Fisika = sidik jari.",
      },
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“STS itu ilegal.” Tidak — ship-to-ship transfer sah dan umum (mis. untuk kapal besar yang tak bisa merapat). Yang mencurigakan = KONTEKSNYA: AIS mati + zona berisiko + dokumen berubah + draf berubah. Menandai semua STS = false positive massal; mengabaikan konteks = buta.",
      },
      hints: [
        "AIS: gap >24 jam = anomali; gap + draf berubah = transfer.",
        "Dokumen: uji harga, uji rute, uji konsistensi.",
      ],
      reference: "Fisika vs dokumen vs uang — ketiganya harus cocok.",
    },
    {
      id: "lab-ais",
      eyebrow: "Langkah 4 · Lab",
      title: "Deteksi AIS gap",
      prose: [
        "Laporan posisi 'Sea Fortune' tiap 6 jam (timestamp jam ke-). Hitung selisih antar laporan berurutan; gap = selisih > 12 jam (2x interval normal). Temukan semua gap dan durasinya. Perhatikan: ada 2 gap — 60 jam dan 30 jam. Gap 60 jam = zona transfer; gap 30 jam = 'badai' menurut nakhoda (tetapi tidak ada badai tercatat — verifikasi silang cuaca = langkah analis berikutnya).",
        "Eksperimen: ubah ambang menjadi > 24 jam. Gap mana yang hilang? Inilah mengapa ambang = 2x interval normal: cukup sensitif untuk menangkap, cukup longgar untuk cuaca.",
      ],
      tasks: [
        { id: "t1", text: "Temukan semua gap ke list `gaps` (durasi jam)" },
        { id: "t2", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "Gap terdeteksi: [60, 30] jam; total 90 jam tanpa sinyal",
      note: {
        title: "💡 Intuisi",
        body: "Ambang 2x interval normal adalah aturan praktis universal deteksi anomali sekuens: 1x = noise (keterlambatan wajar), 2x = sinyal. Analis yang baik tidak menghafal angka 12 jam — ia menghafal logikanya: 'dua kali ritme normal = ada yang tidak normal.'",
      },
      hints: [
        "gap = laporan[i+1] - laporan[i] jika > 12.",
        "Simpan durasi gap ke list gaps.",
      ],
      code: {
        starter: "# Laporan posisi tiap 6 jam (jam ke-). JANGAN UBAH.\nlaporan = [0, 6, 12, 18, 24, 84, 90, 96, 102, 132, 138, 144]\n\n# TULIS KODEMU: deteksi gap > 12 jam\ngaps = []\nfor i in range(len(laporan) - 1):\n    selisih =\n    if selisih > 12:\n        gaps.append(selisih)\nprint(f\"Gap terdeteksi: {gaps} jam; total {sum(gaps)} jam tanpa sinyal\")\n",
        lockLines: 2,
        solution: "# Laporan posisi tiap 6 jam (jam ke-). JANGAN UBAH.\nlaporan = [0, 6, 12, 18, 24, 84, 90, 96, 102, 132, 138, 144]\n\n# TULIS KODEMU: deteksi gap > 12 jam\ngaps = []\nfor i in range(len(laporan) - 1):\n    selisih = laporan[i + 1] - laporan[i]\n    if selisih > 12:\n        gaps.append(selisih)\ntotal_gap = sum(gaps)\nprint(f\"Gap terdeteksi: {gaps} jam; total {total_gap} jam tanpa sinyal\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Total gap 90 jam", msg: "60 + 30.", name: "total_gap", value: 90 },
          { kind: "stdout_matches", task: "t2", label: "Dua gap tercetak", msg: "60 dan 30.", pattern: "Gap terdeteksi: \\[60, 30\\] jam; total 90 jam" }
        ],
      },
      reference: "Gap > 2x interval normal = anomali. Verifikasi silang cuaca.",
    },
    {
      id: "lab-skorkapal",
      eyebrow: "Langkah 5 · Lab",
      title: "Skor risiko evasi tiga kapal",
      prose: [
        "Tiga kapal, enam red flags berbobot [3,3,2,2,2,2] (urutan: AIS gap >24 jam, STS zona berisiko, harga anomali, cangkang ≥3 lapis, bayar via mixer, dokumen berubah). 'Sea Fortune': 3+3+0+2+2+2 = 12 → KRITIS. 'Cahaya Timur': hanya harga anomali (2) → pantau, tetapi catat: satu red flag harga BISA jadi awal investigasi trade-based.",
        "Perhatikan 'Samudra Biru': skor 0 — tetapi ia berlayar di rute yang sama dengan Sea Fortune. Skor 0 = 'tidak ada red flag hari ini', bukan 'bersih selamanya'. Skor = foto, bukan vonis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` tiap kapal ke dict `hasil`" },
        { id: "t2", text: "Jalankan dan pastikan klasifikasi tercetak" },
      ],
      expected: "Sea Fortune: skor 12 -> KRITIS\nCahaya Timur: skor 2 -> PANTAU\nSamudra Biru: skor 0 -> PANTAU",
      note: {
        title: "💡 Intuisi",
        body: "Bobot 3 untuk AIS gap dan STS bukan kebetulan: keduanya adalah EVIDENSI FISIK — sulit dipalsukan dibanding dokumen. Prinsip skoring yang baik: bobot tertinggi untuk bukti yang paling sulit direkayasa pelaku.",
      },
      hints: [
        "skor = sum(w*f); simpan ke hasil[nama].",
        "KRITIS >= 10, EDD 6-9, else PANTAU.",
      ],
      code: {
        starter: "# (nama, [6 flags]). JANGAN UBAH.\nbobot = [3, 3, 2, 2, 2, 2]\nkapal = [(\"Sea Fortune\", [1, 1, 0, 1, 1, 1]),\n        (\"Cahaya Timur\", [0, 0, 1, 0, 0, 0]),\n        (\"Samudra Biru\", [0, 0, 0, 0, 0, 0])]\n\n# TULIS KODEMU: skor + klasifikasi KRITIS/EDD/PANTAU\nhasil = {}\nfor nama, flags in kapal:\n    skor =\n    kelas =\n    hasil[nama] = skor\n    print(f\"{nama}: skor {skor} -> {kelas}\")\n",
        lockLines: 6,
        solution: "# (nama, [6 flags]). JANGAN UBAH.\nbobot = [3, 3, 2, 2, 2, 2]\nkapal = [(\"Sea Fortune\", [1, 1, 0, 1, 1, 1]),\n        (\"Cahaya Timur\", [0, 0, 1, 0, 0, 0]),\n        (\"Samudra Biru\", [0, 0, 0, 0, 0, 0])]\n\n# TULIS KODEMU: skor + klasifikasi KRITIS/EDD/PANTAU\nhasil = {}\nfor nama, flags in kapal:\n    skor = sum(w * f for w, f in zip(bobot, flags))\n    kelas = \"KRITIS\" if skor >= 10 else (\"EDD\" if skor >= 6 else \"PANTAU\")\n    hasil[nama] = skor\n    print(f\"{nama}: skor {skor} -> {kelas}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Sea Fortune KRITIS", msg: "Skor 12.", pattern: "Sea Fortune: skor 12 -> KRITIS" },
          { kind: "stdout_matches", task: "t2", label: "Cahaya Timur PANTAU", msg: "Skor 2.", pattern: "Cahaya Timur: skor 2 -> PANTAU" },
          { kind: "uses", task: "t1", label: "Bobot dipakai", msg: "Σ w·f.", token: "bobot" }
        ],
      },
      reference: "Skor ≥10 KRITIS. Bobot terbesar = bukti tersulit dipalsukan.",
    },
    {
      id: "lab-harga",
      eyebrow: "Langkah 6 · Lab",
      title: "Anomali harga barang dual-use",
      prose: [
        "Lima shipment 'mesin pertanian' (harga pasar wajar: USD 12.000/unit). Hitung deviasi = |harga − pasar| / pasar; flag jika > 50%. 'SH-003': USD 36.000 (deviasi 200%) — over-invoice untuk menyelundupkan nilai keluar. 'SH-005': USD 4.000 (deviasi 67%) — under-invoice, mungkin mengecilkan bea ATAU menyembunyikan spesifikasi sebenarnya (mesin 'pertanian' yang terlalu murah untuk spesifikasinya = bukan mesin pertanian).",
        "Dua arah anomali, dua hipotesis berbeda — tetapi keduanya = 'dokumen tidak mencerminkan barang'. Analis tidak perlu tahu yang mana; tugasnya = menandai untuk inspeksi fisik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung deviasi dan tandai shipment aneh ke `aneh`" },
        { id: "t2", text: "Jalankan dan pastikan daftar tercetak" },
      ],
      expected: "Shipment aneh: ['SH-003', 'SH-005'] -> inspeksi fisik",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Over-invoice = merugikan pembeli, jadi tidak mungkin.” Dalam evasi sanksi, pembeli dan penjual BERKOLUSI — tidak ada yang dirugikan, keduanya diuntungkan oleh nilai yang dipindahkan. Logika 'siapa dirugikan' hanya berlaku untuk fraud biasa, bukan untuk kejahatan terorganisir.",
      },
      hints: [
        "deviasi = abs(harga - 12000) / 12000.",
        "aneh jika deviasi > 0.5.",
      ],
      code: {
        starter: "# (id, harga USD/unit). Harga pasar: 12000. JANGAN UBAH.\nshipment = [(\"SH-001\", 12100.0), (\"SH-002\", 11500.0), (\"SH-003\", 36000.0),\n            (\"SH-004\", 12800.0), (\"SH-005\", 4000.0)]\npasar = 12000.0\n\n# TULIS KODEMU: deviasi > 50% -> aneh\naneh = []\nfor sid, harga in shipment:\n    dev =\n    if dev > 0.5:\n        aneh.append(sid)\nprint(f\"Shipment aneh: {aneh} -> inspeksi fisik\")\n",
        lockLines: 5,
        solution: "# (id, harga USD/unit). Harga pasar: 12000. JANGAN UBAH.\nshipment = [(\"SH-001\", 12100.0), (\"SH-002\", 11500.0), (\"SH-003\", 36000.0),\n            (\"SH-004\", 12800.0), (\"SH-005\", 4000.0)]\npasar = 12000.0\n\n# TULIS KODEMU: deviasi > 50% -> aneh\naneh = []\nfor sid, harga in shipment:\n    dev = abs(harga - pasar) / pasar\n    if dev > 0.5:\n        aneh.append(sid)\nprint(f\"Shipment aneh: {aneh} -> inspeksi fisik\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "SH-003 & SH-005", msg: "Deviasi 200% dan 67%.", pattern: "Shipment aneh: \\['SH-003', 'SH-005'\\] -> inspeksi fisik" },
          { kind: "forbids", task: "t1", label: "Tanpa hardcode", msg: "Hitung deviasi, jangan tulis manual.", token: "SH-003" }
        ],
      },
      reference: "Deviasi >50% = dokumen vs barang tidak cocok → inspeksi fisik.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Indikasi evasi: respons apa",
      prose: [
        "Satu: skor KRITIS (≥10) → tolak/hentikan transaksi + eskalasi ke compliance + pertimbangkan pelaporan ke otoritas; jangan beri tahu nasabah (risiko tipping-off + risiko keselamatan). Dua: skor EDD (6–9) → verifikasi silang penuh (AIS komersial, database harga, struktur kepemilikan) sebelum keputusan. Tiga: hanya anomali harga → inspeksi fisik/dokumen lanjutan; jangan langsung vonis evasi — bisa sengketa dagang biasa. Empat: pembayaran via mixer terdeteksi → bekukan alur + telusuri wallet (ingat AML13: pra-mixer masih terlacak).",
        "Aturan praktis 10 detik: KRITIS = stop + eskalasi + lapor. EDD = verifikasi silang dulu. Harga aneh = inspeksi. Mixer = bekukan + telusuri.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pelanggaran sanksi = risiko eksistensial bagi bank: denda dapat mencapai miliaran dolar AS dan berujung pemutusan hubungan koresponden global. Tidak ada 'toleransi risiko' untuk sanksi — ambang KRITIS harus memicu penghentian otomatis, bukan diskusi.",
      },
      reference: "KRITIS = stop otomatis. Sanksi = zero tolerance.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Kargo 'mesin pertanian' USD 36.000",
      prose: [
        "PT Tani Maju mengajukan L/C USD 1,8 juta untuk 50 unit 'mesin pertanian' (USD 36.000/unit; pasar USD 12.000). Pemasok: perusahaan 6 bulan di negara netral, pemilik lapis 2 cangkang. Pembayaran: 30% di muka via transfer bank, 70% 'menyusul via kripto'. Rute: memutar 1.800 mil dari rute ekonomis.",
        "Pertanyaan: (a) Skor evasinya? (b) Keputusan L/C? Pembahasan: (a) Harga anomali 200% (2) + cangkang (2) + bayar via mixer/kripto (2) + rute tidak ekonomis — misal dokumen asal belum berubah (0), AIS belum dicek. Skor minimal 6 → EDD; jika AIS gap ditemukan (+3) = 9 → EDD mendalam menuju KRITIS. (b) TAHAN L/C: minta inspeksi fisik + sertifikat end-user terverifikasi + ubah pembayaran 100% via bank. Jika nasabah menolak transparansi = jawaban itu sendiri. Pelajaran: satu L/C 'kecil' USD 1,8 juta bisa menjadi pintu pelanggaran sanksi — analis trade finance adalah garis pertahanan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "'70% via kripto' pada L/C adalah kontradiksi: L/C dirancang agar pembayaran terkontrol via bank; kripto justru menghindari kontrol itu. Ketika nasabah meminta instrumen kontrol TETAPI menolak kontrolnya, ia memberi tahu motifnya.",
      },
      reference: "Tahan L/C. Minta inspeksi + end-user + 100% via bank.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Kunci: evasi = serangan terhadap titik buta.",
      ],
      tasks: [],
      summary: [
        "Tiga metode: dark fleet (fisik), crypto mixer (uang), trade-based circumvention (dokumen).",
        "AML4 = screening (pertahanan); AML15 = evasi (serangan). Lolos screening ≠ bersih.",
        "Baca AIS: gap >2x interval + draf berubah = transfer gelap.",
        "Skor evasi: ≥10 KRITIS (stop + lapor), 6–9 EDD, <6 pantau.",
        "Uji dokumen: harga (±50%), rute (ekonomis?), konsistensi (fisika vs kertas).",
        "Bobot terbesar untuk bukti tersulit dipalsukan.",
      ],
      next: { label: "AML16 — Indonesia Anggota Penuh FATF", href: "/v2/learn/aml16-fatf-greylist-indonesia" },
      quiz: [
        {
          q: "Kapal AIS mati 60 jam, muncul dengan draf naik 2 meter. Kesimpulan analis?",
          options: [
            { text: "Indikasi transfer muatan gelap saat gap", why: "Benar: gap + draf naik = memuat saat 'hilang'. Fisika tidak berbohong.", correct: true },
            { text: "Normal — AIS sering rusak", why: "AIS rusak tidak menaikkan draf 2 meter." },
            { text: "Pasti bukan evasi sanksi", why: "Pola ini = red flag utama dark fleet; butuh investigasi." },
            { text: "Cukup catat, tidak perlu tindakan", why: "Gap 60 jam + draf berubah = skor tinggi, wajib EDD." }
          ],
        },
        {
          q: "Bedanya AML4 (screening) dengan AML15 (evasi)?",
          options: [
            { text: "Screening menangkap yang terdaftar; evasi dirancang agar tidak terdaftar", why: "Benar: pertahanan vs serangan.", correct: true },
            { text: "Tidak ada beda, sama-sama cek daftar", why: "Evasi = menghindari daftar; screening = memeriksa daftar." },
            { text: "Evasi hanya soal kapal", why: "Evasi juga via mixer kripto dan dokumen dagang." },
            { text: "Screening sudah cukup", why: "'Lolos screening' adalah asumsi desain pelaku." }
          ],
        },
        {
          q: "STS (ship-to-ship transfer) dengan AIS mati di zona berisiko. Respons?",
          options: [
            { text: "Skor tinggi → EDD mendalam / hentikan", why: "Benar: konteksnya (AIS mati + zona) yang mencurigakan.", correct: true },
            { text: "Abaikan — STS itu legal", why: "STS legal, tetapi konteks ini = pola evasi klasik." },
            { text: "Langsung vonis evasi sanksi", why: "Butuh verifikasi silang dulu; skor = prioritas." },
            { text: "Minta nakhoda menjelaskan via email", why: "Verifikasi ke pelaku = tipping-off." }
          ],
        },
        {
          q: "Shipment USD 36.000/unit vs pasar USD 12.000. Deviasi dan arti?",
          options: [
            { text: "200% → over-invoice, selundupkan nilai / sembunyikan margin", why: "Benar: (36.000−12.000)/12.000 = 200%.", correct: true },
            { text: "67% → under-invoice", why: "Hitung ulang: 24.000/12.000 = 200%, bukan 67%." },
            { text: "300% → pasti evasi sanksi", why: "200%, dan deviasi = alasan inspeksi, bukan vonis." },
            { text: "Normal untuk mesin pertanian", why: "3x harga pasar tidak normal untuk barang standar." }
          ],
        },
        {
          q: "Skor evasi kapal = 12. Tindakan pertama?",
          options: [
            { text: "Hentikan transaksi + eskalasi + pertimbangkan pelaporan", why: "Benar: ≥10 = KRITIS = stop otomatis.", correct: true },
            { text: "Pantau dulu 30 hari", why: "KRITIS bukan untuk dipantau — untuk dihentikan." },
            { text: "Minta klarifikasi ke pemilik kapal", why: "Berisiko tipping-off pada potensi pelanggaran sanksi." },
            { text: "Turunkan skor agar bisa diproses", why: "Memalsukan skor = pelanggaran kepatuhan." }
          ],
        }
      ],
      reference: "Tiga metode, verifikasi silang, skor = prioritas, KRITIS = stop.",
    },
  ],
};
