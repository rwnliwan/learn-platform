import type { V2Lesson } from "../lib/types";

export const mr7: V2Lesson = {
  slug: "mr7-stress-test",
  track: "Market Risk",
  module: "Stress Testing",
  title: "MR7 — Stress Testing: Berlatih Mati Sebelum Benar-Benar Mati",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-latihan",
      eyebrow: "Langkah 1 · VaR vs stress",
      title: "Cerita: latihan yang menyelamatkan — atau gagal menyelamatkan",
      prose: [
        "2006. Sebuah bank Eropa menjalankan stress test tahunan dengan skenario parah: harga properti turun 20%, spread kredit melebar 200 bp. Hasilnya: kerugian Rp3 triliun — masih dalam toleransi. Laporan selesai, semua lega. 2008. Krisis subprime: harga properti AS turun 30%+, spread melebar 800+ bp, dan — yang tidak ada di skenario mana pun — pasar pendanaan membeku total. Kerugian aktual: Rp15 triliun, 5× hasil stress test.",
        "Twist-nya: bukan cuma skenarionya yang kurang parah. Masalahnya lebih dalam: skenario mereka mengasumsikan korelasi normal (properti jatuh tetapi pendanaan lancar) — padahal di krisis, semuanya berkorelasi menjadi satu: aset jatuh dan pendanaan kering dan likuiditas hilang, bersamaan. Stress test yang menguji risiko satu-satu tidak pernah bisa menangkap krisis yang menyerang bergerombol.",
        "VaR menjawab bagaimana hari normal yang buruk (1% ekor dari distribusi biasa). Stress test menjawab bagaimana hari tidak normal (di luar distribusi — regime break). Keduanya wajib ada: VaR untuk sehari-hari, stress untuk eksistensi. Bank yang hanya punya VaR seperti pilot yang hanya latihan cuaca cerah.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan fundamental stress test vs VaR 99,9%." },
        { id: "t2", text: "Sebutkan dua kegagalan skenario 2006 bank Eropa tersebut." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira stress test = VaR dengan confidence level lebih tinggi (misal 99,9%). VaR 99,9% masih mengasumsikan distribusi yang sama — hanya ekor yang lebih jauh. Stress test mengasumsikan distribusinya sendiri berubah: korelasi melonjak, likuiditas hilang, hubungan yang stabil jadi tidak stabil. Ini perbedaan kualitatif, bukan sekadar lebih parah.",
        type: "pitfall",
      },
      reference: "VaR = hari normal yang buruk. Stress = hari tidak normal (regime break).",
    },
    {
      id: "tiga-skenario",
      eyebrow: "Langkah 2 · Jenis skenario",
      title: "Historis, hipotetis, reverse — dan skenario yang baik",
      prose: [
        "Skenario historis (bagaimana jika 2008 terulang?): terapkan pergerakan faktor aktual dari episode krisis masa lalu — 2008 GFC, 2020 COVID crash, 2013 taper tantrum, 1998 Asia — ke portofolio kini. Plausible by construction, konsisten antar faktor otomatis, mudah dikomunikasikan. Kelemahan: fighting the last war — krisis berikutnya tidak sama persis, dan eksposur baru yang tidak bergerak di 2008 tidak teruji.",
        "Skenario hipotetis (bagaimana jika yang belum pernah terjadi, terjadi?): rancangan analis — stagflasi + krisis geopolitik + gagal bayar sovereign. Bisa menargetkan kelemahan spesifik portofolio kini, tetapi wajib punya narasi makro yang konsisten. Shock asal comot yang mustahil bersamaan (suku bunga +500 bp tetapi ekuitas +20% tanpa narasi) = hasil sampah.",
        "Skenario yang baik memenuhi 4 kriteria: parah tetapi plausible (cukup parah untuk menguji batas, cukup plausible untuk ditanggapi serius); konsisten antar faktor (narasi makro mengikat: resesi → ekuitas −30%, spread +400bp, flight-to-quality → yield −100bp, USD menguat); relevan dengan portofolio (menggigit eksposur terbesar); menangkap interaksi (korelasi → 1, likuiditas kering, umpan balik margin call → forced selling).",
      ],
      formula: String.raw`\Delta V_{\text{stress}} \approx \sum_i S_i \cdot \Delta f_i^{\text{stress}} + \tfrac{1}{2} \sum_i \Gamma_i \cdot (\Delta f_i^{\text{stress}})^2`,
      formulaNote: "ΔV_stress = dampak skenario ke nilai portofolio; S_i = sensitivitas ke faktor i; Δf_i^stress = shock faktor i dalam skenario; Γ_i = koreksi orde-2 (convexity/gamma) — wajib untuk shock besar, jangan diabaikan.",
      tasks: [
        { id: "t1", text: "Bandingkan kelebihan dan kelemahan skenario historis vs hipotetis." },
        { id: "t2", text: "Sebutkan 4 kriteria skenario yang baik beserta contohnya." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira skenario terparah = skenario terbaik. Skenario yang terlalu ekstrem dan tidak plausible akan diabaikan pengambil keputusan (itu tidak akan terjadi). Seni stress test: cukup parah untuk memaksa tindakan, cukup plausible untuk dipercaya. Skenario kiamat tanpa narasi = latihan yang tidak mengubah apa-apa.",
        type: "pitfall",
      },
      reference: "Historis = kredibel, buta masa depan. Hipotetis = menarget kini, wajib narasi konsisten.",
    },
    {
      id: "terapkan-skenario",
      eyebrow: "Langkah 3 · Dampak skenario",
      title: "Menerapkan skenario ke portofolio",
      prose: [
        "Dampak skenario dihitung via sensitivitas orde-1 (linear: sensitivitas × shock, seperti DV01) plus koreksi orde-2 (kuadratik: untuk posisi non-linear seperti opsi). Untuk shock besar, orde-2 tidak boleh diabaikan — untuk pergerakan besar, suku kuadratik mendominasi suku linear.",
        "Skenario resesi global untuk desk multi-aset. Sensitivitas: spread −Rp170 ribu per bp, ekuitas +Rp2,75 juta per +1%, suku bunga −Rp3,6 juta per bp. Shock skenario: spread +400 bp, ekuitas −20%, suku bunga +20 bp. Hitung kontribusi tiap faktor dan totalnya — lalu lihat faktor mana yang paling menyakitkan.",
        "Hasilnya seperti waterfall: total kerugian Rp195 juta, didominasi suku bunga (Rp72 jt) — bukan spread (Rp68 jt) atau ekuitas (Rp55 jt). Hitungannya: spread 400 bp × Rp170 rb = Rp68 jt; ekuitas −20% × Rp2,75 jt = Rp55 jt; suku bunga +20 bp × Rp3,6 jt = Rp72 jt. Inilah nilai stress test: ia menunjukkan di mana tepatnya portofolio berdarah dalam tiap skenario, sehingga hedging bisa ditargetkan — bukan asal kurangi risiko.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kontrib` tiap faktor (dict) dan `total` kerugian skenario" },
        { id: "t2", text: "Tentukan `terparah` (nama faktor dengan kerugian terbesar), lalu cetak" },
      ],
      expected: "total=-195000000  terparah=sukubunga",
      note: {
        title: "Kaitan ke risk",
        body: "Faktor terparah di sini adalah suku bunga (Rp72 M) — bukan spread atau ekuitas yang biasa disorot. Stress test yang baik sering mengejutkan: ia menemukan bahwa luka terbesar bukan di tempat yang paling sering dibicarakan. Hedging yang ditargetkan ke faktor yang salah adalah premi yang terbuang.",
        type: "risk",
      },
      hints: [
        "kontrib[k] = sens[k] * shock[k] untuk tiap faktor. Total = jumlah semuanya.",
        "terparah = faktor dengan kontribusi paling negatif: min(kontrib, key=kontrib.get).",
        "Perhatikan satuan: spread dan suku bunga dalam bp, ekuitas dalam persen.",
      ],
      code: {
        starter: `# Sensitivitas (Rp per unit) dan shock skenario resesi global\nsens = {"spread": -170_000, "ekuitas": 2_750_000, "sukubunga": -3_600_000}\nshock = {"spread": 400, "ekuitas": -20, "sukubunga": 20}  # bp, %, bp\n\n# TULIS KODEMU: kontribusi tiap faktor, total, dan faktor terparah\nkontrib = \ntotal = \nterparah = \n\nprint(f"total={total:.0f}  terparah={terparah}")`,
        lockLines: 3,
        solution: `# Sensitivitas (Rp per unit) dan shock skenario resesi global\nsens = {"spread": -170_000, "ekuitas": 2_750_000, "sukubunga": -3_600_000}\nshock = {"spread": 400, "ekuitas": -20, "sukubunga": 20}  # bp, %, bp\n\n# TULIS KODEMU: kontribusi tiap faktor, total, dan faktor terparah\nkontrib = {k: sens[k] * shock[k] for k in sens}\ntotal = sum(kontrib.values())\nterparah = min(kontrib, key=kontrib.get)\n\nprint(f"total={total:.0f}  terparah={terparah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: -195000000, tol: 1, label: "`total` seharusnya −195.000.000", msg: "−68 − 55 − 72 (juta) = −195 jt. Cek perkalian tiap faktor." },
          { kind: "equal", task: "t2", name: "terparah", value: "sukubunga", label: "`terparah` seharusnya sukubunga", msg: "Kontribusi suku bunga −72 jt < spread −68 jt < ekuitas −55 jt." },
          { kind: "stdout_matches", task: "t2", pattern: "total=-195000000\\s+terparah=sukubunga", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ΔV ≈ Σ S_i Δf_i + ½ Σ Γ_i (Δf_i)². Total −Rp195 M; terparah: suku bunga.",
    },
    {
      id: "reverse-stress",
      eyebrow: "Langkah 4 · Reverse stress",
      title: "Mulai dari kematian",
      prose: [
        "Reverse stress test membalik pertanyaannya: bukan skenario → dampak, melainkan dampak yang tak tertahankan → skenario apa yang menyebabkannya? Langkahnya: tetapkan ambang kematian (misal rugi > Rp500 jt, CET1 < 8%, gagal bayar); cari kombinasi pemicu yang menembus ambang (grid search); nilai plausibilitas tiap kombinasi; tindak lanjuti pemicu yang paling plausible dengan mitigasi.",
        "Kenapa powerful: stress test biasa bisa melewatkan kombinasi mematikan yang tidak terpikirkan analis (unknown unknowns). Reverse stress menemukannya secara sistematis — ia bertanya ke seluruh ruang skenario, bukan cuma yang terpikirkan. Seperti dokter yang bertanya: gejala apa yang akan membunuh pasien ini, dan penyakit apa yang menyebabkannya? — bukan cuma memeriksa daftar penyakit yang diketahui.",
        "Contoh sederhana satu faktor: toleransi rugi Rp500 jt, sensitivitas spread −Rp1,25 juta per bp. Shock spread berapa yang menembus batas? 500 jt / 1,25 jt = 400 bp. Dalam praktik, grid dua-tiga faktor dicari kombinasinya, lalu diurutkan by plausibilitas: skenario kiamat (plausibilitas 2/100) kalah prioritas dari spread +400bp + likuiditas kering (12/100) dan spread +200bp (22/100). Reverse stress memaksa prioritas pada yang plausible, bukan yang paling dramatis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `shock_bp` = shock spread yang menembus `toleransi`" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "shock_bp=400.0",
      note: {
        title: "Sering salah",
        body: "Memprioritaskan skenario paling dramatis dalam reverse stress. Tindak lanjut harus mengejar pemicu paling plausible — skenario kiamat yang tak plausible hanya membuang perhatian mitigasi. Drama tidak membunuh bank; yang plausible-lah yang membunuh.",
        type: "pitfall",
      },
      hints: [
        "Kerugian = |sens_per_bp| × shock_bp. Balik rumusnya untuk shock.",
        "shock_bp = toleransi / abs(sens_per_bp).",
        "Hasilnya 400 bp — bandingkan dengan skenario historis 2008 (800+ bp).",
      ],
      code: {
        starter: `toleransi = 500_000_000  # Rp500 jt: ambang kematian\nsens_per_bp = -1_250_000  # sensitivitas spread (Rp per bp)\n\n# TULIS KODEMU: shock (bp) yang menembus toleransi\nshock_bp = \n\nprint(f"shock_bp={shock_bp}")`,
        lockLines: 2,
        solution: `toleransi = 500_000_000  # Rp500 jt: ambang kematian\nsens_per_bp = -1_250_000  # sensitivitas spread (Rp per bp)\n\n# TULIS KODEMU: shock (bp) yang menembus toleransi\nshock_bp = toleransi / abs(sens_per_bp)\n\nprint(f"shock_bp={shock_bp}")`,
        checks: [
          { kind: "equal", task: "t1", name: "shock_bp", value: 400.0, tol: 1e-9, label: "`shock_bp` seharusnya 400.0", msg: "500 jt / 1,25 jt = 400. Cek nilai absolut sensitivitasnya." },
          { kind: "stdout_matches", task: "t2", pattern: "shock_bp=400\\.0", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Reverse: tetapkan ambang → cari pemicu → nilai plausibilitas → mitigasi yang plausible.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Skenario mana, kapan",
      prose: [
        "Empat keputusan. Pertama, butuh skenario kredibel dan mudah dijelaskan (presentasi direksi/regulator, butuh bukti pernah terjadi) → historis: plausible by construction, korelasi krisis otomatis konsisten. Lengkapi dengan minimal 2 episode berbeda (2008 + 2020) agar tidak fighting the last war.",
        "Kedua, portofolio punya eksposur baru yang tidak bergerak di krisis lalu → hipotetis: hanya skenario rancangan yang bisa menargetkan kelemahan kini — wajib punya narasi makro yang konsisten. Ketiga, cari blind spot atau kombinasi tak terpikirkan (review tahunan risiko eksistensial, setelah perubahan besar portofolio) → reverse stress: satu-satunya metode yang mencari sistematis di seluruh ruang skenario; fokus tindak lanjut pada pemicu paling plausible.",
        "Keempat, keputusan modal dan risk appetite → gabungan ketiganya plus governance: stress test yang tidak mengubah keputusan (limit, hedge, kontinjensi) = ritual kepatuhan, bukan manajemen risiko. Aturan 10 detik: kredibel → historis; eksposur baru → hipotetis; blind spot → reverse; selalu tutup dengan: jadi apa yang kita ubah?",
      ],
      tasks: [
        { id: "t1", text: "Bank baru masuk ke pasar komoditas yang tidak ada di portofolio 2008. Skenario apa?" },
        { id: "t2", text: "Stress test selesai, hasil dalam toleransi, tidak ada keputusan berubah. Penilaianmu?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Tujuan stress test bukan menghasilkan laporan — melainkan mengubah keputusan. Jika tidak ada tindak lanjut (limit diketatkan, hedge ditambah, rencana kontinjensi disiapkan), latihan itu hanya ritual. Selalu tutup siklus dengan pertanyaan: jadi apa yang kita ubah?",
        type: "risk",
      },
      reference: "Kredibel → historis. Eksposur baru → hipotetis. Blind spot → reverse. Tutup dengan keputusan.",
    },
    {
      id: "minicase-sopan",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Skenario yang terlalu sopan",
      prose: [
        "Bank menyusun skenario stres tahunan: ekuitas −15%, spread +150 bp, yield +100 bp. Hasil: rugi Rp120 miliar — dalam toleransi Rp500 miliar. Direksi lega. Tetapi lihat datanya: skenario itu lebih ringan dari 2020 (IHSG −30% dari puncak Februari ke titik terendah 24 Maret 2020 — dalam hitungan pekan, bukan dalam sehari; penurunan harian terburuk ≈ −6,6% — spread +400 bp) dan jauh dari 2008. Skenario ini sopan — dirancang agar lolos, bukan agar menguji.",
        "Tiga cacatnya: tidak parah (di bawah episode historis yang benar-benar terjadi — gagal kriteria parah tapi plausible), tidak konsisten (yield +100 bp bersamaan ekuitas −15% tanpa narasi mengapa flight-to-quality tidak terjadi), dan tidak menangkap interaksi (korelasi tetap normal, likuiditas diasumsikan lancar — padahal krisis menyerang bergerombol).",
        "Perbaikannya: kalibrasi ke episode historis nyata (2008: spread 800+ bp; 2020: ekuitas −30%), tambahkan narasi makro yang mengikat shock, dan sertakan lapisan interaksi — korelasi → 1, slippage likuiditas, umpan balik margin call. Skenario yang membuat direksi tidak nyaman tetapi tetap plausible = skenario yang bekerja. Skenario yang membuat semua lega = skenario yang gagal.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga cacat skenario sopan di atas." },
        { id: "t2", text: "Tuliskan perbaikannya untuk tiap cacat." },
      ],
      note: {
        title: "Sering salah",
        body: "Merancang skenario agar hasilnya dalam toleransi (optimasi kenyamanan). Itu insentif terbalik: stress test yang selalu lolos memberi rasa aman palsu ke direksi. Kalibrasi ke episode historis nyata adalah jangkar kejujuran — 2008 dan 2020 benar-benar terjadi.",
        type: "pitfall",
      },
      reference: "Skenario sopan = dirancang untuk lolos. Kalibrasi ke 2008/2020 sebagai jangkar.",
    },
    {
      id: "governance-stress",
      eyebrow: "Langkah 7 · Governance",
      title: "Dari skenario ke keputusan: governance stress test",
      prose: [
        "Skenario terbaik pun tidak berguna tanpa governance yang memaksanya menjadi keputusan. Kegagalan klasik: skenario dirancang oleh tim yang sama yang dinilai dari hasilnya — insentifnya membuat skenario yang lolos, bukan yang jujur. Praktik yang benar: pemisahan peran — tim risiko merancang dan menantang skenario, unit bisnis memberi masukan eksposur, dan komite risiko menyetujui; penantang skenario (challenger) wajib ada, tugasnya bertanya skenario apa yang belum terpikirkan dan apakah narasinya konsisten.",
        "Siklusnya: kalender tahunan untuk stress test menyeluruh, plus pemicu ad-hoc — perubahan material portofolio, gejolak pasar, atau peringatan dini dari reverse stress. Setiap siklus ditutup dengan paket keputusan: limit yang diketatkan, hedge yang ditambah, rencana kontinjensi pendanaan, atau buffer modal — dengan pemilik dan tenggat yang jelas. Stress test yang selesai tanpa satu pun keputusan berubah adalah temuan audit terhadap dirinya sendiri.",
        "Komunikasi ke direksi adalah keterampilan tersendiri: direksi tidak memutuskan dari tabel shock 40 baris, melainkan dari narasi — skenario apa, seberapa plausible, rugi berapa, dan apa yang kita lakukan. Satu halaman eksekutif: narasi skenario dalam 3 kalimat, dampak ke modal dan likuiditas, lalu tiga opsi tindakan dengan trade-off-nya. Angka detail tetap ada di lampiran untuk yang ingin memverifikasi — tetapi keputusan lahir dari cerita yang jujur, bukan dari presisi semu.",
        "Konteks Indonesia: regulator (OJK/BI) mewajibkan bank melakukan stress test kecukupan modal sebagai bagian dari ICAAP — proses penilaian kecukupan modal internal di bawah Pilar 2 Basel. Artinya stress test bukan sekadar praktik baik, melainkan kewajiban dengan konsekuensi pengawasan: skenario makro regulator (misal pelemahan rupiah tajam + kenaikan suku bunga + perlambatan kredit) wajib dijalankan, hasilnya dilaporkan, dan tindak lanjutnya dipantau. Bank yang skenarionya selalu sopan akan ketahuan — regulator membandingkan antar bank.",
        "Terakhir: dokumentasikan semuanya — asumsi skenario, siapa yang menantang apa, keputusan yang diambil dan yang sengaja tidak diambil beserta alasannya. Lima tahun kemudian, saat skenario yang dulu dianggap tidak plausible benar-benar terjadi, dokumentasi itulah yang membedakan bank yang belajar dari bank yang mengulang.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa perancang skenario tidak boleh satu tim dengan yang dinilai dari hasilnya." },
        { id: "t2", text: "Tuliskan isi satu halaman eksekutif untuk direksi dari sebuah stress test." },
      ],
      note: {
        title: "Intuisi: stress test yang baik diukur dari keputusan, bukan dari laporannya",
        body: "Pola pikir senior: skenario adalah alat, keputusan adalah produk. Enam heuristik. Pertama: curigai skenario yang terlalu nyaman — jika setiap tahun hasilnya dalam toleransi dan tidak ada yang berubah, skenarionya yang rusak, bukan banknya yang kebal. Kedua: pisahkan perancang dari yang dinilai — insentif membentuk skenario lebih kuat daripada metodologi; challenger independen bukan kemewahan melainkan prasyarat. Ketiga: tutup setiap siklus dengan keputusan bernama dan bertanggal — limit, hedge, kontinjensi, atau buffer; tanpa itu, latihanmu ritual. Keempat: bicara ke direksi dalam narasi, bukan tabel — tiga kalimat skenario, dampak ke modal, tiga opsi tindakan; presisi semu 40 baris justru menyembunyikan keputusan. Kelima: dokumentasikan yang tidak kamu lakukan beserta alasannya — keputusan untuk tidak bertindak juga keputusan, dan lima tahun kemudian dokumentasi itulah audit trail kejujuranmu. Keenam: bandingkan skenariomu dengan bank lain dan dengan skenario regulator — jika skenariomu selalu paling ringan di antara peers, itu sinyal keras bahwa kalibrasimu sopan, bukan bahwa bankmu paling aman. Aturan 10 detiknya: skenario jujur → challenger independen → keputusan bernama → narasi ke direksi → dokumentasi lengkap.",
      },
      reference: "Governance: pisahkan perancang & dinilai, challenger wajib, tutup dengan keputusan, dokumentasikan.",
    },
    {
          id: "gap-r9-liquidity-stress",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P4-G3)",
          title: "Stress likuiditas: LCR, NSFR, survival horizon",
          prose: [
            "Lesson ini menguji skenario pasar (harga, spread, suku bunga) — tetapi krisis 2008 membuktikan bank mati bukan karena rugi mark-to-market, melainkan karena KEHABISAN KAS: pasar pendanaan membeku (langkah 1). Stress likuiditas menguji itu dengan tiga metrik. LCR (Liquidity Coverage Ratio) = HQLA (aset likuid berkualitas tinggi) ÷ arus keluar bersih 30 hari — wajib ≥ 100%: bank harus bertahan 30 hari tanpa pendanaan baru. NSFR (Net Stable Funding Ratio) = pendanaan stabil tersedia ÷ pendanaan stabil dibutuhkan — wajib ≥ 100%: struktur pendanaan jangka panjang harus menopang aset jangka panjang. Survival horizon = berapa hari kas + HQLA bertahan pada arus keluar harian — metrik operasional yang dipakai treasury tiap pagi.",
            "Contoh angka: HQLA Rp120 miliar, arus keluar bersih 30 hari Rp100 miliar → LCR = 120% (lolos, buffer 20 pp). Kas + HQLA Rp50 miliar dengan arus keluar Rp5 miliar/hari → survival horizon 10 hari. Skenario roll-off: pendanaan jangka pendek Rp200 miliar, 30% tidak diperpanjang (roll-off) → kebutuhan dana Rp60 miliar — bila LCR hanya 100% tanpa buffer, roll-off 30% ini langsung menembus batas. Itulah gunanya buffer: LCR 120% berarti bank bisa menyerap guncangan pendanaan 20% sebelum melanggar.",
            "Aturan keputusan: stress likuiditas selalu diuji BERSAMA stress pasar — skenario resesi lesson ini (spread +400 bp) harus disertai asumsi pendanaan (roll-off 30%, haircut repo naik, PUAB mengering). Bank yang hanya lolos stress pasar tetapi gagal stress likuiditas adalah bank yang “sehat di kertas, mati di kas”.",
          ],
          formula: String.raw`LCR = \frac{HQLA}{\text{arus keluar bersih 30 hari}} \geq 100\% \qquad \text{survival} = \frac{\text{kas + HQLA}}{\text{arus keluar harian}}`,
          formulaNote: "LCR ≥ 100% (bertahan 30 hari tanpa pendanaan baru). NSFR ≥ 100% (pendanaan stabil menopang aset). Survival horizon = kas/HQLA ÷ arus keluar harian. Contoh angka: HQLA 120, outflow 100 → LCR 120%; kas 50, outflow 5/hari → 10 hari; roll-off 30% × 200 = 60.",
          tasks: [
            { id: "t1", text: "Hitung `lcr` (%), `horizon` (hari), dan `rolloff` (Rp miliar)" },
            { id: "t2", text: "Cetak ketiganya" },
          ],
          expected: "LCR=120% horizon=10 rolloff=60",
          hints: [
            "lcr = 120/100 × 100.",
            "horizon = 50/5; rolloff = 200 × 0,30.",
          ],
          code: {
            starter: `hqla, outflow30 = 120.0, 100.0  # Rp miliar\nkas, outflow_harian = 50.0, 5.0\ndana_pendek, rolloff_rate = 200.0, 0.30\n\n# TULIS KODEMU: LCR + survival horizon + kebutuhan roll-off\nlcr = \nhorizon = \nrolloff = \n\nprint(f"LCR={lcr:.0f}% horizon={horizon:.0f} rolloff={rolloff:.0f}")`,
            lockLines: 5,
            solution: `hqla, outflow30 = 120.0, 100.0  # Rp miliar\nkas, outflow_harian = 50.0, 5.0\ndana_pendek, rolloff_rate = 200.0, 0.30\n\n# TULIS KODEMU: LCR + survival horizon + kebutuhan roll-off\nlcr = hqla / outflow30 * 100\nhorizon = kas / outflow_harian\nrolloff = dana_pendek * rolloff_rate\n\nprint(f"LCR={lcr:.0f}% horizon={horizon:.0f} rolloff={rolloff:.0f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "lcr", value: 120, tol: 0.5, label: "`lcr` seharusnya 120%", msg: "120/100 = 120% — lolos dengan buffer 20 pp." },
              { kind: "equal", task: "t1", name: "horizon", value: 10, tol: 0.5, label: "`horizon` seharusnya 10 hari", msg: "50/5 = 10 hari." },
              { kind: "equal", task: "t1", name: "rolloff", value: 60, tol: 0.5, label: "`rolloff` seharusnya Rp60 M", msg: "200 × 30% = 60." },
              { kind: "stdout_matches", task: "t2", pattern: "LCR=120%\\s+horizon=10\\s+rolloff=60", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Bank punya LCR 105% dan skenario roll-off 30% atas pendanaan jangka pendek Rp200 M. Apa masalahnya?",
              options: [
                { text: "Buffer hanya 5 pp — roll-off Rp60 M bisa menembus batas bila HQLA tidak cukup", why: "Benar: LCR 105% berarti buffer tipis; stress likuiditas harus diuji bersama stress pasar.", correct: true },
                { text: "Tidak ada masalah — LCR di atas 100% berarti aman", why: "Salah: 100% adalah batas minimum, bukan zona aman; buffer 5 pp terlalu tipis untuk roll-off 30%." },
                { text: "NSFR pasti juga di atas 100%", why: "Salah: LCR dan NSFR mengukur hal berbeda (30 hari vs struktural) — keduanya harus diuji terpisah." },
              ],
            },
          ],
          reference: "LCR ≥ 100% (30 hari), NSFR ≥ 100% (struktural), survival horizon = kas ÷ arus keluar harian.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Delapan pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      summary: [
        "VaR = hari normal yang buruk; stress test = hari tidak normal (regime break: korelasi, likuiditas, hubungan rusak).",
        "Tiga jenis: historis (kredibel, fighting the last war), hipotetis (menarget kini, wajib narasi), reverse (dampak → pemicu, temukan blind spot).",
        "Skenario baik: parah tapi plausible, konsisten (narasi makro), relevan, menangkap interaksi (korelasi → 1, likuiditas kering, umpan balik).",
        "Dampak: ΔV ≈ Σ S_i Δf_i + ½ Σ Γ_i (Δf_i)² — orde-2 wajib untuk shock besar.",
        "Reverse stress: tetapkan ambang kematian → cari pemicu → prioritaskan yang paling plausible → mitigasi.",
        "Stress test yang tidak mengubah keputusan = ritual, bukan manajemen risiko.",
      ],
      next: { label: "MR8 — Risiko Suku Bunga", href: "/v2/learn/mr8-risiko-suku-bunga" },
      quiz: [
        {
          q: "Perbedaan fundamental stress test vs VaR 99,9%?",
          options: [
            { text: "Tidak ada — sama saja", why: "ini perbedaan kualitatif, bukan sekadar angka." },
            { text: "VaR 99,9% masih mengasumsikan distribusi yang sama (ekor lebih jauh); stress test mengasumsikan distribusinya berubah", why: "stress = regime break — korelasi melonjak, likuiditas hilang, hubungan stabil rusak. Menaikkan confidence VaR tidak menangkap itu.", correct: true },
            { text: "Stress test lebih cepat dihitung", why: "bukan soal kecepatan." },
            { text: "VaR tidak bisa 99,9%", why: "VaR bisa dihitung di tingkat kepercayaan berapa pun." },
          ],
        },
        {
          q: "Kelemahan utama skenario historis?",
          options: [
            { text: "Terlalu sulit dihitung", why: "justru mudah — tinggal terapkan pergerakan historis." },
            { text: "Fighting the last war — krisis berikutnya berbeda; eksposur baru yang tak bergerak di krisis lalu tidak teruji", why: "skenario historis kredibel tetapi buta terhadap yang belum terjadi. Pasangkan dengan hipotetis.", correct: true },
            { text: "Tidak plausible", why: "justru plausible by construction — benar-benar terjadi." },
            { text: "Tidak bisa dijelaskan ke direksi", why: "skenario historis paling mudah dijelaskan." },
          ],
        },
        {
          q: "Skenario hipotetis: ekuitas +20% bersamaan dengan yield +500bp, tanpa narasi. Masalahnya?",
          options: [
            { text: "Tidak ada — skenario bebas", why: "skenario bebas tanpa logika = hasil sampah." },
            { text: "Inkonsisten secara ekonomi — tanpa narasi makro, hasilnya tidak bisa ditindaklanjuti", why: "skenario hipotetis wajib punya narasi yang mengikat shock-shocknya.", correct: true },
            { text: "Terlalu parah", why: "masalahnya bukan tingkat keparahan." },
            { text: "Terlalu ringan", why: "masalahnya bukan tingkat keparahan." },
          ],
        },
        {
          q: "Reverse stress test dimulai dari?",
          options: [
            { text: "Skenario makro", why: "itu stress test biasa." },
            { text: "Hasil yang tidak dapat diterima (ambang kematian) — lalu mundur mencari kombinasi pemicu yang paling plausible", why: "reverse = dampak → penyebab. Kekuatannya menemukan blind spot yang tidak terpikirkan analis.", correct: true },
            { text: "Data historis", why: "itu skenario historis." },
            { text: "VaR harian", why: "VaR tidak ada hubungannya dengan titik mulai reverse stress." },
          ],
        },
        {
          q: "Stress test tahunan selesai, hasil dalam toleransi, tidak ada keputusan berubah. Penilaian?",
          options: [
            { text: "Sukses — berarti bank aman", why: "aman di atas kertas belum tentu aman." },
            { text: "Gagal sebagai latihan — stress test yang tidak mengubah keputusan = ritual kepatuhan, bukan manajemen risiko", why: "tujuannya mengubah keputusan (limit, hedge, kontinjensi). Selalu tutup dengan: jadi apa yang kita ubah?", correct: true },
            { text: "Berarti skenarionya sempurna", why: "tidak ada skenario yang sempurna." },
            { text: "Tidak perlu diulang tahun depan", why: "justru harus diulang dengan skenario yang lebih jujur." },
          ],
        },
        {
          q: "Tim yang sama merancang skenario dan dinilai dari hasilnya. Risiko governance-nya?",
          options: [
            { text: "Tidak ada — mereka paling paham portofolionya", why: "paham portofolio tidak menetralkan insentif." },
            { text: "Insentif merancang skenario yang lolos, bukan yang jujur — perlu pemisahan peran dan challenger independen", why: "skenario sopan = dirancang untuk lolos. Challenger wajib bertanya apa yang belum terpikirkan.", correct: true },
            { text: "Skenario jadi terlalu parah", why: "arah insentifnya justru sebaliknya — terlalu ringan." },
            { text: "Proses jadi lebih cepat", why: "kecepatan bukan masalahnya; kejujuran yang terancam." },
          ],
        },
        {
          q: "Direksi meminta ringkasan stress test. Format yang tepat?",
          options: [
            { text: "Tabel 40 baris shock per faktor", why: "direksi tidak memutuskan dari tabel mentah — presisi semu menyembunyikan keputusan." },
            { text: "Satu halaman: narasi skenario 3 kalimat, dampak ke modal/likuiditas, tiga opsi tindakan dengan trade-off-nya", why: "keputusan lahir dari cerita yang jujur; detail angka tetap ada di lampiran untuk verifikasi.", correct: true },
            { text: "Hanya angka rugi total", why: "tanpa narasi dan opsi tindakan, angka tidak bisa diputuskan." },
            { text: "Tidak perlu — cukup bilang aman", why: "itu justru kegagalan komunikasi risiko." },
          ],
        },
        {
          q: "Kapan stress test ad-hoc wajib dijalankan di luar kalender tahunan?",
          options: [
            { text: "Tidak pernah — tahunan cukup", why: "risiko tidak menunggu kalender." },
            { text: "Saat ada perubahan material portofolio, gejolak pasar, atau peringatan dini dari reverse stress", why: "pemicu ad-hoc memastikan skenario tetap relevan dengan eksposur kini.", correct: true },
            { text: "Hanya saat regulator meminta", why: "menunggu diminta = reaktif; bank yang baik proaktif." },
            { text: "Setiap ada pergantian direksi", why: "bukan pemicu yang relevan dengan risiko." },
          ],
        },
      ],
    },
  ],
};
