import type { V2Lesson } from "../lib/types";

const FIG_REDFLAGS = `<svg viewBox="0 0 480 300" role="img" aria-label="Frekuensi lima red flag suap korporat pada agregat kasus publik.">
<g font-family="var(--font-ui)">
<text x="240" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Red flag suap korporat: seberapa sering muncul</text>
<text x="240" y="42" font-size="10" fill="var(--chart-text)" text-anchor="middle">agregat ilustratif kasus penegakan publik 2020&#8211;2025 (bukan statistik resmi)</text>
<text x="8" y="80" font-size="11" fill="var(--chart-text)">Fee tanpa deliverable jelas</text>
<rect x="205" y="66" width="204" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="414" y="82" font-size="11" fill="var(--chart-text)">68%</text>
<text x="8" y="114" font-size="11" fill="var(--chart-text)">Invoice bundar, tanpa rincian</text>
<rect x="205" y="100" width="156" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="366" y="116" font-size="11" fill="var(--chart-text)">52%</text>
<text x="8" y="148" font-size="11" fill="var(--chart-text)">Success fee kontrak pemerintah</text>
<rect x="205" y="134" width="165" height="22" fill="var(--c3)" opacity="0.9"/>
<text x="375" y="150" font-size="11" fill="var(--chart-text)">55%</text>
<text x="8" y="182" font-size="11" fill="var(--chart-text)">Bayar ke offshore / pribadi</text>
<rect x="205" y="168" width="141" height="22" fill="var(--c3)" opacity="0.9"/>
<text x="351" y="184" font-size="11" fill="var(--chart-text)">47%</text>
<text x="8" y="216" font-size="11" fill="var(--chart-text)">Perantara dikenalkan pejabat</text>
<rect x="205" y="202" width="117" height="22" fill="var(--c2)" opacity="0.9"/>
<text x="327" y="218" font-size="11" fill="var(--chart-text)">39%</text>
<text x="240" y="252" font-size="11" fill="var(--chart-text)" text-anchor="middle">Cara membaca: panjang batang = % kasus dengan red flag itu.</text>
<text x="240" y="270" font-size="11" fill="var(--chart-text)" text-anchor="middle">Interpretasi: &#8220;fee tanpa deliverable&#8221; paling umum &#8212; mulai dari sana.</text>
</g>
</svg>`;

export const aml12: V2Lesson = {
  slug: "aml12-bribery-corruption",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML12 — Bribery & Corruption dalam Program AFC",
  estMinutes: 55,
  steps: [
    {
      id: "sampul",
      eyebrow: "Sampul",
      title: "Suap: kejahatan yang tidak mencuri apa-apa",
      prose: [
        "AML12 — Bribery & Corruption dalam Program AFC · 55 menit · 2 lab Python · 6 kuis · 1 mini-case · 1 chart.",
        "Daftar isi: 1. Cerita: faktur konsultan Rp45 juta per bulan. 2. Konsep: tiga wajah suap. 3. Konsep: third-party risk dan red flags pembayaran. 4. Lab: skor risiko perantara. 5. Lab: deteksi pola pembayaran aneh. 6. Peta keputusan: temuan red flag, respons apa. 7. Mini-case: onboarding vendor. 8. Checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan bribery, corruption, dan facilitation payment beserta implikasinya bagi bank; (2) menjelaskan mengapa suap korporat adalah predicate crime untuk pencucian uang dan wajib masuk program AFC; (3) menghitung skor risiko pihak ketiga dari lima red flags; (4) mendeteksi pola pembayaran konsultan yang anomali dari data invoice.",
        "Konteks CAMS: sertifikasi CAMS edisi ke-7 (relaunch 15 Juli 2025, menurut CAMS Exam Guide 2026) memperluas spektrum dari AML murni menjadi Anti-Financial Crime — mencakup sanctions evasion, bribery & corruption, cybercrime, fraud, dan ESG-linked crime — dengan kerangka modular 4 core + 2 elektif. Bobot domain bersifat directional: Financial Crime Risks & Methods ~30%, Global AFC Frameworks ~20%, Building an AFC Program ~30%, Tools & Technologies ~20%. Lesson AML12–AML17 mengikuti spektrum baru ini.",
      ],
      tasks: [],
      reference: "CAMS 7th ed: AML → spektrum Anti-Financial Crime. Bribery = predicate crime.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Faktur konsultan Rp45 juta per bulan",
      prose: [
        "PT Nusantara Energi memenangkan tender pembangkit Rp2,3 triliun. Penawarannya bukan yang termurah — tetapi 'konsultan perizinan' mereka, PT Cahaya Advisory, bekerja sangat efektif. Fee-nya Rp45 juta per bulan selama 18 bulan: total Rp810 juta. Deliverable yang terdokumentasi: dua memo dua halaman tentang 'pemetaan pemangku kepentingan'.",
        "Twist-nya: direktur PT Cahaya Advisory adalah keponakan kepala bagian pengadaan pemberi tender. Tidak ada uang yang 'dicuri' — kas perusahaan tercatat rapi, invoice ada, kontrak ada, pajak dibayar. Namun Rp810 juta itu membeli keputusan tender Rp2,3 triliun. Inilah sifat suap korporat: ia tidak mencuri dari kas; ia membeli masa depan kas orang lain.",
        "Bagi analis AFC, pelajarannya ganda. Satu: suap adalah predicate crime pencucian uang — di Indonesia tindak pidana korupsi adalah kejahatan asal (predicate crime) TPPU menurut UU No. 8 Tahun 2010, sehingga dana hasil suap yang masuk ke sistem keuangan wajib dideteksi program AML. Dua: program AFC modern (CAMS 7th ed, POJK No. 8 Tahun 2023 tentang APU-PPT) tidak berhenti di 'uang kotor' — ia mencakup pencegahan suap di rantai pihak ketiga bank dan nasabah korporatnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank meminjamkan ke PT Nusantara Energi Rp800 miliar untuk proyek itu. Jika tender dibatalkan karena skandal suap, arus kas proyek runtuh dan kredit bank ikut macet. Risiko suap nasabah = risiko kredit bank. Inilah mengapa analis risiko wajib paham red flags bribery, bukan hanya tim compliance.",
      },
      reference: "Suap membeli keputusan, bukan mencuri kas. Predicate crime TPPU.",
    },
    {
      id: "tiga-wajah",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga wajah suap: kenali kepribadiannya",
      prose: [
        "Bribery — Si Tukang Titip. Definisi: menawarkan, menjanjikan, atau memberi sesuatu yang berharga agar seseorang menyalahgunakan posisinya. Ada dua arah: active bribery (memberi/menawarkan) dan passive bribery (meminta/menerima). Dalam perbankan, wajahnya: nasabah korporat yang 'menitipkan' fee ke perantara agar kredit disetujui, atau pegawai bank yang menerima 'uang terima kasih' dari debitur. Kepribadiannya: selalu lewat perantara, selalu dibungkus bahasa bisnis ('consulting fee', 'success fee', 'marketing expense').",
        "Corruption — Si Penjaga Gerbang yang Menjual Kunci. Definisi: penyalahgunaan kekuasaan yang dipercayakan untuk keuntungan pribadi. Bribery adalah salah satu BENTUK corruption; corruption lebih luas — mencakup penggelapan, nepotisme, pemerasan. Bedanya penting: bribery selalu melibatkan dua pihak (pemberi–penerima), corruption bisa dilakukan sendirian oleh si penjaga gerbang. Bagi analis: jika bribery = transaksi yang bisa dilacak, corruption = pola kekuasaan yang harus dipetakan (siapa mengendalikan keputusan apa).",
        "Facilitation payment — Si Uang Rokok. Definisi: pembayaran kecil untuk mempercepat tindakan rutin yang memang sudah menjadi hak (mempercepat perizinan, bukan memenangkan tender). Kepribadiannya: kecil, rutin, 'sudah biasa'. Jebakannya: (1) di banyak yurisdiksi — termasuk Indonesia dan Inggris (UK Bribery Act 2010) — ia tetap suap; (2) ia melatih organisasi bahwa 'aturan bisa dibeli', pintu masuk ke suap besar; (3) untuk bank, ia muncul sebagai biaya operasional cabang yang tidak pernah bisa dijelaskan.",
        "Cara membaca figur: lima batang = lima red flag, panjang batang = frekuensi kemunculan pada agregat ilustratif kasus penegakan publik. Interpretasi: 'fee tanpa deliverable jelas' (68%) adalah pola paling umum — maka uji pertama atas setiap perantara adalah: tunjukkan hasil kerjanya. Jika tidak bisa, skor risikonya langsung tinggi.",
      ],
      figure: {
        svg: FIG_REDFLAGS,
        alt: "Lima red flag suap korporat dan frekuensi ilustratifnya.",
        caption: "Mulai dari red flag paling umum: fee tanpa deliverable.",
      },
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Suap hanya soal pejabat pemerintah.” Salah dua arah: (1) commercial bribery — suap antar swasta (mis. supplier menyuap staf purchasing) — juga kejahatan di banyak yurisdiksi dan tetap predicate crime; (2) di sisi bank, pegawai bank yang menerima imbalan dari debitur = passive bribery. Program AFC yang hanya mengawasi 'pejabat' buta terhadap separuh peta.",
      },
      hints: [
        "Bribery = transaksi dua pihak; corruption = penyalahgunaan kuasa (bisa sendirian).",
        "Facilitation payment: kecil, rutin — tetapi tetap melatih budaya 'aturan bisa dibeli'.",
      ],
      reference: "Tiga wajah: Titip (bribery), Gerbang (corruption), Rokok (facilitation).",
    },
    {
      id: "third-party",
      eyebrow: "Langkah 3 · Konsep",
      title: "Third-party risk: di sinilah suap bersembunyi",
      prose: [
        "Perantara — Si Kurir yang Tak Pernah Ditanya. Perusahaan jarang menyuap langsung; ia menyewa 'konsultan', 'agen', atau 'distributor' yang melakukan bagian kotornya. Kepribadian perantara bermasalah: dikenalkan oleh pejabat (bukan lewat tender), fee tidak proporsional dengan pekerjaan, menolak klausul anti-suap di kontrak, minta dibayar ke rekening pribadi/offshore, dan — ciri paling jujur — tidak bisa menjelaskan dengan kalimat sederhana apa sebenarnya yang ia kerjakan.",
        "Lima red flags pembayaran, masing-masing dengan bobot: (1) fee tanpa deliverable jelas, bobot 3; (2) success fee yang terkait kontrak pemerintah, bobot 3; (3) invoice bundar tanpa rincian (Rp50.000.000 pas), bobot 2; (4) pembayaran ke rekening pribadi/offshore, bobot 2; (5) perantara dikenalkan pejabat, bobot 1. Total maksimum 11. Ambang: skor ≥7 = risiko TINGGI (EDD mendalam + persetujuan komite), 4–6 = SEDANG (EDD standar + pantau), <4 = RENDAH.",
        "Rumus skornya sederhana dan itulah kekuatannya — ia memaksa analis memberi angka pada firasat:",
      ],
      formula: String.raw`S = \sum_{i=1}^{5} w_i \cdot f_i \quad ; \quad f_i \in \{0,1\}`,
      formulaNote: "S = skor risiko perantara (0–11); w_i = bobot red flag ke-i (3,3,2,2,1); f_i = 1 jika red flag ada, 0 jika tidak. Contoh PT Cahaya Advisory: fee tanpa deliverable (3) + dikenalkan pejabat (1) + invoice Rp45 jt tanpa rincian detail (2) = S 6 → SEDANG, nyaris TINGGI. Interpretasi: skor ≥7 = hentikan pembayaran sampai EDD selesai; skor bukan vonis, melainkan antrean prioritas investigasi.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Sudah ada kontrak dan invoice, berarti aman.” Dokumen adalah BENTUK, bukan SUBSTANSI. Kasus cerita punya keduanya — kontrak 18 bulan dan invoice tiap bulan — namun substansinya (dua memo untuk Rp810 juta) tidak masuk akal. Uji substansi: bandingkan fee dengan harga pasar jasa sejenis dan dengan nilai keputusan yang 'dibantu'.",
      },
      hints: [
        "Skor = Σ bobot × ada/tidak. Ambang: ≥7 tinggi, 4–6 sedang.",
        "Tanya satu kalimat: 'Bisakah fee ini dijelaskan ke auditor tanpa malu?'",
      ],
      reference: "Perantara = tempat suap bersembunyi. Skor = antrean prioritas.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 4 · Lab",
      title: "Skor risiko lima perantara",
      prose: [
        "Lima perantara PT Nusantara Energi, lima red flags berbobot [3,3,2,2,1] (urutan: tanpa deliverable, success fee pemerintah, invoice bundar, rekening offshore/pribadi, dikenalkan pejabat). Hitung skor tiap perantara dan klasifikasinya. Perhatikan 'PT Cahaya Advisory': skor 6 — SEDANG, tetapi satu red flag lagi (mis. invoice bundar) akan mendorongnya ke TINGGI.",
        "Eksperimen: ubah bobot 'dikenalkan pejabat' dari 1 menjadi 3, lalu jalankan ulang. Berapa perantara yang naik kelas? Inilah sensitivitas model: bobot adalah keputusan kebijakan, bukan kebenaran alam — dokumentasikan alasannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` tiap perantara dan simpan ke dict `hasil`" },
        { id: "t2", text: "Jalankan dan pastikan klasifikasi tercetak" },
      ],
      expected: "PT Cahaya Advisory: skor 6 -> SEDANG\nPT Bina Karsa: skor 10 -> TINGGI\nPT Delta Prima: skor 2 -> RENDAH\nPT Eka Samudra: skor 7 -> TINGGI\nPT Fajar Mulia: skor 0 -> RENDAH",
      note: {
        title: "💡 Intuisi",
        body: "Skor 6 vs 7 terlihat seperti beda tipis — tetapi ambang memaksa keputusan: SEDANG = bayar sambil pantau, TINGGI = hentikan sampai EDD selesai. Nilai ambang justru melindungi analis: keputusan sulit sudah dibuat oleh kebijakan, bukan oleh keberanianmu hari itu.",
      },
      hints: [
        "skor = sum(w*f untuk tiap pasangan bobot-flag).",
        "Klasifikasi: >=7 TINGGI, >=4 SEDANG, selainnya RENDAH.",
      ],
      code: {
        starter: "# (nama, [5 flags 0/1]: tanpa_deliverable, success_fee_pemerintah, invoice_bundar, rek_offshore, dikenalkan_pejabat). JANGAN UBAH.\nbobot = [3, 3, 2, 2, 1]\nperantara = [(\"PT Cahaya Advisory\", [1, 0, 1, 0, 1]),\n            (\"PT Bina Karsa\", [1, 1, 1, 1, 0]),\n            (\"PT Delta Prima\", [0, 0, 1, 0, 0]),\n            (\"PT Eka Samudra\", [1, 1, 0, 0, 1]),\n            (\"PT Fajar Mulia\", [0, 0, 0, 0, 0])]\n\n# TULIS KODEMU: skor = jumlah bobot*flag; klasifikasi TINGGI/SEDANG/RENDAH\nhasil = {}\nfor nama, flags in perantara:\n    skor =\n    kelas =\n    hasil[nama] = skor\n    print(f\"{nama}: skor {skor} -> {kelas}\")\n",
        lockLines: 9,
        solution: "# (nama, [5 flags 0/1]: tanpa_deliverable, success_fee_pemerintah, invoice_bundar, rek_offshore, dikenalkan_pejabat). JANGAN UBAH.\nbobot = [3, 3, 2, 2, 1]\nperantara = [(\"PT Cahaya Advisory\", [1, 0, 1, 0, 1]),\n            (\"PT Bina Karsa\", [1, 1, 1, 1, 0]),\n            (\"PT Delta Prima\", [0, 0, 1, 0, 0]),\n            (\"PT Eka Samudra\", [1, 1, 0, 0, 1]),\n            (\"PT Fajar Mulia\", [0, 0, 0, 0, 0])]\n\n# TULIS KODEMU: skor = jumlah bobot*flag; klasifikasi TINGGI/SEDANG/RENDAH\nhasil = {}\nfor nama, flags in perantara:\n    skor = sum(w * f for w, f in zip(bobot, flags))\n    kelas = \"TINGGI\" if skor >= 7 else (\"SEDANG\" if skor >= 4 else \"RENDAH\")\n    hasil[nama] = skor\n    print(f\"{nama}: skor {skor} -> {kelas}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Skor Bina Karsa = 10 TINGGI", msg: "3+3+2+2+0.", pattern: "PT Bina Karsa: skor 10 -> TINGGI" },
          { kind: "stdout_matches", task: "t2", label: "Cahaya 6 SEDANG", msg: "3+0+2+0+1.", pattern: "PT Cahaya Advisory: skor 6 -> SEDANG" },
          { kind: "stdout_matches", task: "t2", label: "Dua TINGGI tercetak", msg: "Bina Karsa 9, Eka Samudra 7.", pattern: "PT Eka Samudra: skor 7 -> TINGGI" }
        ],
      },
      reference: "Skor = Σ w·f. Ambang: ≥7 TINGGI, 4–6 SEDANG.",
    },
    {
      id: "lab-pola",
      eyebrow: "Langkah 5 · Lab",
      title: "Deteksi pola pembayaran aneh",
      prose: [
        "Delapan invoice konsultan (Rp juta). Tiga pola aneh yang dicari analis: (1) nominal bundar (habis dibagi 50) — jasa profesional sungguhan jarang pas Rp50.000.000; (2) tanpa rincian deliverable; (3) dibayar ke rekening pribadi. Invoice yang memenuhi ≥2 pola = 'aneh', layak investigasi.",
        "Perhatikan invoice #3: Rp45 juta, tidak bundar, ada rincian, ke rekening perusahaan — LOLOS semua uji. Inilah gunanya pola ganda: satu pola (mis. hanya 'bundar') akan menangkap invoice sah Rp100 juta yang memang paket flat. Kombinasi pola = presisi.",
      ],
      tasks: [
        { id: "t1", text: "Tandai invoice aneh (≥2 pola) ke list `aneh`" },
        { id: "t2", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "Invoice aneh: ['INV-002', 'INV-005', 'INV-007'] (3 dari 8)\nTotal nilai aneh: Rp205 juta",
      note: {
        title: "💡 Intuisi",
        body: "Nominal bundar BUKAN bukti suap — ia hanya 'bau'. Analis yang baik memperlakukan pola sebagai radar, bukan vonis: radar yang baik jarang diam (recall tinggi), dan vonis dijatuhkan investigator manusia setelah EDD. Tertukar keduanya = sistem yang menuduh atau sistem yang buta.",
      },
      hints: [
        "bundar = jumlah % 50 == 0.",
        "pola = bundar + tanpa_rincian + rek_pribadi; aneh jika >= 2.",
      ],
      code: {
        starter: "# (id, jumlah Rp jt, ada_rincian, ke_rek_pribadi). JANGAN UBAH.\ninvoice = [(\"INV-001\", 47.5, True, False), (\"INV-002\", 50.0, False, True),\n            (\"INV-003\", 45.0, True, False), (\"INV-004\", 120.0, True, False),\n            (\"INV-005\", 100.0, False, False), (\"INV-006\", 38.2, True, False),\n            (\"INV-007\", 75.0, False, True), (\"INV-008\", 62.5, True, False)]\n\n# TULIS KODEMU: invoice aneh = >= 2 pola (bundar, tanpa rincian, rek pribadi)\naneh = []\ntotal = 0.0\nfor iid, jml, rincian, pribadi in invoice:\n    pola =\n    if pola >= 2:\n        aneh.append(iid)\n        total += jml\nprint(f\"Invoice aneh: {aneh} ({len(aneh)} dari {len(invoice)})\")\nprint(f\"Total nilai aneh: Rp{total:.0f} juta\")\n",
        lockLines: 6,
        solution: "# (id, jumlah Rp jt, ada_rincian, ke_rek_pribadi). JANGAN UBAH.\ninvoice = [(\"INV-001\", 47.5, True, False), (\"INV-002\", 50.0, False, True),\n            (\"INV-003\", 45.0, True, False), (\"INV-004\", 120.0, True, False),\n            (\"INV-005\", 100.0, False, False), (\"INV-006\", 38.2, True, False),\n            (\"INV-007\", 75.0, False, True), (\"INV-008\", 62.5, True, False)]\n\n# TULIS KODEMU: invoice aneh = >= 2 pola (bundar, tanpa rincian, rek pribadi)\naneh = []\ntotal = 0.0\nfor iid, jml, rincian, pribadi in invoice:\n    pola = (1 if jml % 50 == 0 else 0) + (0 if rincian else 1) + (1 if pribadi else 0)\n    if pola >= 2:\n        aneh.append(iid)\n        total += jml\nprint(f\"Invoice aneh: {aneh} ({len(aneh)} dari {len(invoice)})\")\nprint(f\"Total nilai aneh: Rp{total:.0f} juta\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "3 invoice aneh", msg: "INV-002, INV-005, INV-007.", name: "total", value: 225.0, tol: 1e-9 },
          { kind: "stdout_matches", task: "t2", label: "Daftar aneh tercetak", msg: "Samakan format.", pattern: "Invoice aneh: \\['INV-002', 'INV-005', 'INV-007'\\]" },
          { kind: "stdout_matches", task: "t2", label: "Total 225 tercetak", msg: "50+100+75.", pattern: "Total nilai aneh: Rp225 juta" }
        ],
      },
      reference: "Pola = bundar + tanpa rincian + rek pribadi. ≥2 = aneh = radar, bukan vonis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Temuan red flag: respons apa",
      prose: [
        "Satu: skor perantara TINGGI (≥7) → hentikan pembayaran baru sampai EDD selesai; EDD mencakup verifikasi pemilik manfaat (beneficial owner), adverse media, dan wawancara substansi pekerjaan. Dua: invoice aneh terdeteksi → jangan bayar dulu; minta rincian deliverable tertulis + bukti kerja; jika tidak bisa diberikan dalam 14 hari, eskalasi. Tiga: indikasi suap melibatkan pejabat/keputusan pemerintah → pertimbangkan kewajiban lapor (di Indonesia: korupsi = predicate crime TPPU; konsultasikan ke legal/compliance untuk pelaporan ke aparat/PPATK). Empat: temuan melibatkan pegawai bank sendiri → alur khusus: isolasi akses, investigasi internal independen, tanpa tipping-off ke yang bersangkutan.",
        "Aturan praktis 10 detik: skor TINGGI = stop bayar + EDD. Invoice aneh = tahan + minta bukti. Libatkan pejabat = libatkan legal. Libatkan orang dalam = isolasi + investigasi independen.",
        "Satu skenario yang sering luput: 'konsultan' yang sebenarnya tidak punya kantor, karyawan, atau portofolio — hanya nama dan koneksi. Uji substansi tiga menit: minta CV tim, kunjungi alamat kantor, telepon dua klien lama. Konsultan asli menjawab dalam sehari; fiktif menghilang atau marah. Biaya uji ini hampir nol — biayanya tidak menguji adalah skandal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kewajiban program AFC (POJK No. 8 Tahun 2023) mencakup kebijakan anti-suap pada pihak ketiga: due diligence, klausul anti-korupsi di kontrak, dan pelatihan. Bank yang tidak punya ini bukan hanya berisiko denda — ia berisiko menjadi saluran dana hasil korupsi tanpa menyadarinya.",
      },
      reference: "TINGGI = stop + EDD. Aneh = tahan + bukti. Pejabat = legal. Orang dalam = isolasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Onboarding vendor: PT Sinar Konsultan",
      prose: [
        "Bank Artha Dana akan mengontrak PT Sinar Konsultan sebagai 'agen perluasan jaringan' untuk pembukaan 12 cabang baru: fee Rp30 juta/bulan + success fee Rp200 juta per izin cabang terbit. Pemiliknya dikenalkan oleh seorang pejabat dinas perizinan. Invoice bulan pertama: Rp30.000.000 pas, tanpa rincian, ditagih ke rekening pribadi direktur.",
        "Pertanyaan: (a) Hitung skor red flag-nya. (b) Keputusan onboarding apa? Pembahasan: (a) Tanpa deliverable jelas (3) + success fee terkait perizinan pemerintah (3) + invoice bundar tanpa rincian (2) + rekening pribadi (2) + dikenalkan pejabat (1) = 11, skor MAKSIMUM → TINGGI. (b) TOLAK atau tunda sampai EDD penuh: struktur fee ini hampir identik dengan skema suap perizinan. Success fee per 'izin terbit' = insentif yang selaras sempurna dengan suap — bayaran hanya keluar jika keputusan pejabat keluar. Jika bisnis tetap butuh jasanya: ubah ke fee berbasis jam kerja + deliverable terukur + klausul audit + pembayaran ke rekening perusahaan.",
        "Satu hal terakhir yang membedakan analis hebat dari analis biasa: keberanian menindaklanjuti temuan yang tidak populer. Suap korporat sering melibatkan pihak yang berkuasa — vendor besar, pejabat, bahkan atasan sendiri. Sistem yang baik melindungimu: laporkan melalui kanal whistleblowing yang tersedia, dokumentasikan setiap langkah analisismu, dan biarkan bukti yang berbicara. Integritasmu adalah benteng terakhir sistem keuangan. Dan ingat: setiap suap yang berhasil dicegah hari ini adalah satu skandal besar yang tidak perlu kamu jelaskan kepada regulator, direksi, dan media massa esok hari.",
        "Mulai dari kasus kecil di sekitarmu \u2014 keberanian itu menular.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Success fee per izin adalah 'desain insentif suap': ia membayar HASIL keputusan pejabat, bukan JASA konsultan. Analis yang membaca struktur insentif — bukan nominalnya — menangkap skema ini dalam 10 detik. Selalu tanya: 'fee ini membayar apa, persisnya?'",
      },
      reference: "Skor 11/11 = tolak/tunda. Success fee per izin = insentif suap.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan. Fokus: bedakan tiga wajah suap, dan ingat skor = antrean prioritas, bukan vonis.",
      ],
      tasks: [],
      summary: [
        "Bribery = transaksi dua pihak; corruption = penyalahgunaan kuasa (bisa sendirian); facilitation payment = kecil-rutin tetapi tetap melatih budaya suap.",
        "Suap korporat = predicate crime TPPU (UU 8/2010): dana hasilnya wajib dideteksi program AML.",
        "Suap bersembunyi di perantara: lima red flags berbobot, skor ≥7 = TINGGI.",
        "Uji substansi > bentuk: kontrak + invoice tidak membuktikan jasa benar dikerjakan.",
        "Pola pembayaran (bundar, tanpa rincian, rek pribadi) = radar, bukan vonis.",
        "Success fee per keputusan pejabat = desain insentif suap.",
      ],
      next: { label: "AML13 — Cybercrime-Enabled Laundering", href: "/learn/aml13-cybercrime-laundering" },
      quiz: [
        {
          q: "Mana yang BUKAN bribery tetapi BISA jadi corruption?",
          options: [
            { text: "Kepala cabang menggelapkan dana kas sendirian", why: "Benar: penyalahgunaan kuasa sendirian = corruption, bukan bribery (tak ada pihak kedua).", correct: true },
            { text: "Supplier memberi parsel ke staf purchasing agar menang tender", why: "Ini commercial bribery klasik: dua pihak, imbalan untuk keputusan." },
            { text: "Agen meminta fee agar izin dipercepat", why: "Meminta imbalan = passive bribery." },
            { text: "Konsultan dibayar setelah izin terbit", why: "Struktur success fee = red flag bribery, tetap dua pihak." }
          ],
        },
        {
          q: "Mengapa analis AML wajib peduli suap korporat?",
          options: [
            { text: "Korupsi = predicate crime TPPU; dananya mengalir lewat bank", why: "Benar: UU 8/2010 — hasil korupsi yang masuk sistem keuangan wajib dideteksi.", correct: true },
            { text: "Karena bank dilarang punya vendor konsultan", why: "Tidak dilarang — yang wajib = due diligence atas mereka." },
            { text: "Karena semua invoice bundar pasti suap", why: "Invoice bundar = red flag (radar), bukan bukti." },
            { text: "Hanya jika nilainya di atas Rp1 miliar", why: "Tidak ada ambang nominal untuk red flag suap." }
          ],
        },
        {
          q: "Perantara: tanpa deliverable (3) + dikenalkan pejabat (1) + invoice bundar (2). Skor dan kelas?",
          options: [
            { text: "6 → SEDANG", why: "Benar: 3+1+2 = 6; ambang 4–6 = SEDANG.", correct: true },
            { text: "6 → TINGGI", why: "TINGGI mulai dari 7." },
            { text: "5 → SEDANG", why: "Hitung ulang: 3+1+2 = 6, bukan 5." },
            { text: "11 → TINGGI", why: "11 = semua lima flags; di sini hanya tiga." }
          ],
        },
        {
          q: "Invoice Rp100 juta pas, ada rincian deliverable lengkap, ke rekening perusahaan. Menurut pola lab?",
          options: [
            { text: "1 pola (bundar) → tidak aneh", why: "Benar: hanya 1 dari 3 pola — butuh ≥2 untuk masuk radar.", correct: true },
            { text: "Aneh, karena bundar", why: "Satu pola saja tidak cukup; paket flat sah juga bundar." },
            { text: "Aneh, karena di atas Rp50 juta", why: "Tidak ada ambang nominal dalam pola ini." },
            { text: "Pasti suap", why: "Pola = radar, bukan vonis." }
          ],
        },
        {
          q: "Skor perantara TINGGI ditemukan di vendor aktif. Langkah pertama?",
          options: [
            { text: "Hentikan pembayaran baru + EDD mendalam", why: "Benar: TINGGI = stop bayar sampai EDD selesai.", correct: true },
            { text: "Telepon vendor menanyakan maksudnya", why: "Berisiko tipping-off; verifikasi lewat jalur resmi." },
            { text: "Langsung laporkan ke polisi", why: "Skor = antrean prioritas, bukan bukti kejahatan." },
            { text: "Tunggu sampai kontrak habis", why: "Menunggu = membiarkan potensi suap berjalan." }
          ],
        },
        {
          q: "CAMS edisi ke-7 (2025) mengubah apa yang relevan dengan lesson ini?",
          options: [
            { text: "Spektrum meluas: bribery & corruption masuk domain AFC inti", why: "Benar: dari AML murni ke Anti-Financial Crime (CAMS Exam Guide 2026).", correct: true },
            { text: "Menghapus kewajiban CDD", why: "CDD tetap fondasi; tidak dihapus." },
            { text: "Hanya mengubah nama sertifikasi", why: "Overhaul terbesar: modular 4 core + 2 elektif, domain baru." },
            { text: "Mengurangi bobot teknologi menjadi 0%", why: "Tools & Technologies justru ~20%." }
          ],
        }
      ],
      reference: "Tiga wajah, lima flags, skor = prioritas. Substansi > bentuk.",
    },
  ],
};
