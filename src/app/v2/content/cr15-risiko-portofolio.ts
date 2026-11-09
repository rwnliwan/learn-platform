import type { V2Lesson } from "../lib/types";

export const cr15: V2Lesson = {
  slug: "cr15-risiko-portofolio",
  track: "Credit Risk",
  module: "Risiko Portofolio & Stress Testing",
  title: "CR15 — Risiko Portofolio: Konsentrasi & Korelasi",
  estMinutes: 75,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "20 warung vs 1 mal",
      prose: [
        "Pak Haji punya Rp 1 miliar. Opsi A: pinjamkan ke 20 warung @Rp 50 juta. Opsi B: pinjamkan ke 1 mal Rp 1 miliar. Bunga sama, agunan proporsional sama, EL sama: Rp 16 juta.",
        "Tahun paceklik tiba. Di Opsi A: 3 warung gagal — rugi Rp 60 juta. Pahit, tetapi hidup terus. Di Opsi B: mal-nya kebakaran + sepi pengunjung — rugi Rp 400 juta sekaligus. Pak Haji bangkrut.",
        "EL-nya sama. Nasibnya beda langit-bumi. Inilah pelajaran paling mahal di risiko kredit: rata-rata (EL) tidak membunuh — sebaran (UL) yang membunuh. Dan sebaran ditentukan oleh dua hal: konsentrasi dan korelasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Seluruh arsitektur modal Basel (CR4a) pada dasarnya adalah harga untuk konsentrasi & korelasi. Diversifikasi adalah satu-satunya \"makan siang gratis\" di keuangan — mengurangi UL tanpa mengurangi expected return (bunga).",
      },
      reference: "EL = rata-rata; UL = sebaran. Modal membayar sebaran.",
    },
    {
      id: "konsentrasi",
      eyebrow: "Langkah 2 · Konsentrasi",
      title: "Semua telur satu keranjang",
      prose: [
        "Risiko konsentrasi = risiko akibat eksposur terpusat pada sedikit debitur (single-name), sektor, atau wilayah. Diukur dengan HHI (Herfindahl-Hirschman Index): jumlah kuadrat pangsa tiap debitur. HHI = 1/n untuk n debitur sama besar (tersebar sempurna); mendekati 1 untuk satu debitur dominan. Patokan: ≤0,01 tersebar; >0,01–0,10 sedang; >0,10 terkonsentrasi — batasnya kini tidak tumpang tindih (HHI tepat 0,01 = tersebar).",
        "Contoh: portofolio Rp 1000 M — debitur A 400 M, B 200 M, sisanya 8 debitur @50 M. Pangsa: 0,4; 0,2; 0,05 ×8. HHI = 0,16 + 0,04 + 8×0,0025 = 0,22. 0,22 > 0,10 = terkonsentrasi. Debitur A sendiri (40%) = \"too big to fail\" versi mini bank ini.",
        "Di Indonesia, OJK mengatur BMPK (Batas Maksimum Pemberian Kredit) — misal ke satu debitur ≤ 20–25% modal bank. Melanggar BMPK = pelanggaran serius. Tetapi lolos BMPK ≠ aman: BMPK = lantai hukum; analisis konsentrasi sektor, korelasi, dan RAROC bisa menyimpulkan \"terlalu mahal risikonya\".",
      ],
      formula: String.raw`\text{HHI} = \sum_{i=1}^{n} s_i^2`,
      formulaNote: "s_i = pangsa debitur ke-i dari total portofolio. HHI mengkuadratkan pangsa — debitur 40% sendiri menyumbang 0,16.",
      tasks: [],
      reference: "Bank C (HHI 0,25) butuh modal jauh lebih besar dari Bank A untuk portofolio nominal yang sama — granularity adjustment Basel.",
    },
    {
      id: "lab-konsentrasi",
      eyebrow: "Langkah 3 · Lab Konsentrasi",
      title: "EL sama, UL beda",
      prose: [
        "Rp 1 M disalurkan dua cara: 100 debitur vs 5 debitur (PD 4%, LGD 40%). Simulasi 10.000× dengan guncangan bersama (korelasi) terkunci. Ambang default di kode dihitung dari PD (Φ⁻¹(4%) ≈ −1,75) — ubah PD-nya, ambangnya ikut berubah. Tugasmu: hitung EL (rata-rata) dan UL (VaR 99% − EL) untuk keduanya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `el_100` dan `ul_100` (100 debitur)" },
        { id: "t2", text: "Hitung `el_5` dan `ul_5` (5 debitur)" },
        { id: "t3", text: "Cetak keempatnya dengan `print`" },
      ],
      expected: "n100: EL=16.2 UL=75.8 / n5: EL=16.2 UL=143.8",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "EL identik (~Rp 16 jt) — tetapi UL portofolio 5 debitur hampir 2× lipat. Konsentrasi melebarkan sebaran tanpa mengubah rata-rata — dan modal membayar sebaran. Inilah jawaban kuantitatif atas cerita pembuka.",
      },
      hints: [
        "Fungsi simulasi(n_debitur) mengembalikan list kerugian — terkunci.",
        "EL = rata-rata; VaR99 = persentil 99; UL = VaR99 − EL.",
        "rugi = simulasi(100); rugi.sort(); var99 = rugi[int(0.99*len(rugi))]",
      ],
      code: {
        starter: `import random, statistics\nrandom.seed(101)\n\ndef simulasi(n_debitur, pd=0.04, lgd=0.4, total=1000, n_sim=10000):\n    per = total / n_debitur\n    ambang = statistics.NormalDist().inv_cdf(pd)  # Φ⁻¹(PD) ≈ -1,75 untuk PD 4% — dihitung dari argumen pd, bukan angka ajaib\n    rugi = []\n    for _ in range(n_sim):\n        guncangan = random.gauss(0, 1)\n        r = 0\n        for _ in range(n_debitur):\n            sehat = random.gauss(0, 1) * 0.9 + guncangan * 0.44\n            if sehat < ambang:\n                r += per * lgd\n        rugi.append(r)\n    return rugi\n\n# TULIS KODEMU: EL & UL untuk n=100 dan n=5\ndef el_ul(rugi):\n    rugi = sorted(rugi)\n    el = sum(rugi)/len(rugi)\n    var99 = rugi[int(0.99*len(rugi))]\n    return el, var99 - el\n\nel_100, ul_100 = \nel_5, ul_5 = \n\nprint(f"n100: EL={el_100:.1f} UL={ul_100:.1f}")\nprint(f"n5: EL={el_5:.1f} UL={ul_5:.1f}")`,
        lockLines: 14,
        solution: `import random, statistics\nrandom.seed(101)\n\ndef simulasi(n_debitur, pd=0.04, lgd=0.4, total=1000, n_sim=10000):\n    per = total / n_debitur\n    ambang = statistics.NormalDist().inv_cdf(pd)  # Φ⁻¹(PD) ≈ -1,75 untuk PD 4% — dihitung dari argumen pd, bukan angka ajaib\n    rugi = []\n    for _ in range(n_sim):\n        guncangan = random.gauss(0, 1)\n        r = 0\n        for _ in range(n_debitur):\n            sehat = random.gauss(0, 1) * 0.9 + guncangan * 0.44\n            if sehat < ambang:\n                r += per * lgd\n        rugi.append(r)\n    return rugi\n\n# TULIS KODEMU: EL & UL untuk n=100 dan n=5\ndef el_ul(rugi):\n    rugi = sorted(rugi)\n    el = sum(rugi)/len(rugi)\n    var99 = rugi[int(0.99*len(rugi))]\n    return el, var99 - el\n\nel_100, ul_100 = el_ul(simulasi(100))\nel_5, ul_5 = el_ul(simulasi(5))\n\nprint(f"n100: EL={el_100:.1f} UL={ul_100:.1f}")\nprint(f"n5: EL={el_5:.1f} UL={ul_5:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "el_100", value: 16.2, tol: 0.5, label: "`el_100` sekitar 16.2", msg: "Rata-rata kerugian 10.000 simulasi." },
          { kind: "equal", task: "t1", name: "ul_100", value: 75.8, tol: 3.0, label: "`ul_100` sekitar 75.8", msg: "VaR99 − EL untuk 100 debitur." },
          { kind: "equal", task: "t2", name: "el_5", value: 16.2, tol: 0.5, label: "`el_5` sekitar 16.2", msg: "EL praktis sama — rata-rata tidak peduli konsentrasi." },
          { kind: "equal", task: "t2", name: "ul_5", value: 143.8, tol: 5.0, label: "`ul_5` sekitar 143.8", msg: "UL hampir 2× lipat — sebaran yang membayar pajak modal." },
          { kind: "stdout_matches", task: "t3", pattern: "n100: EL=16\\.2\\s+UL=75\\.8", label: "`print` menampilkan hasil n=100", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Total 'harga' risiko (EL+UL): tersebar Rp 92 jt vs terkonsentrasi Rp 160 jt.",
    },
    {
      id: "korelasi",
      eyebrow: "Langkah 4 · Korelasi",
      title: "Tenggelam bersama",
      prose: [
        "Korelasi default = kecenderungan debitur gagal bersamaan. Penyebab: faktor bersama (resesi, harga komoditas, bencana) yang memukul banyak debitur sekaligus. Korelasi 0 = independen (tenggelam sendiri-sendiri); korelasi tinggi = tenggelam bersama.",
        "100 debitur independen dengan PD 4% → kerugian terdistribusi normal (hukum bilangan besar). 100 debitur berkorelasi → distribusi miring kanan dengan ekor tebal: biasanya rugi kecil, kadang rugi raksasa. Ekor inilah yang membunuh bank.",
        "Korelasi seperti tali yang mengikat perahu-perahu — saat badai, perahu terikat terbalik bersamaan; perahu bebas terbalik sendiri-sendiri. Diversifikasi antar sektor/wilayah yang tidak berkorelasi = memotong talinya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"100 debitur beda nama = terdiversifikasi.\" 100 debitur sektor batubara di Kalimantan = 100 nama, satu risiko (harga batubara). Diversifikasi sejati = sebar antar faktor risiko (sektor, wilayah, segmen) — bukan antar nama. Ini wrong-way concentration yang paling sering luput.",
      },
      reference: "30 debitur batubara @3% portofolio (sektor batubara = 90% portofolio): HHI per nama 0,027 (tersebar) tetapi HHI faktor = 0,9² = 0,81 (ekstrem). HHI memakai pangsa PORTOFOLIO, bukan pangsa modal.",
    },
    {
      id: "vasicek",
      eyebrow: "Langkah 5 · Vasicek",
      title: "Mengukur ekor",
      prose: [
        "Model Vasicek (satu faktor) = model standar Basel untuk kerugian portofolio: tiap debitur punya faktor bersama (ekonomi, korelasi ρ) + faktor idiosinkratik (nasib sendiri). Φ = distribusi normal kumulatif; ρ = korelasi aset (Basel: 12–24% untuk korporasi); q = tingkat keyakinan (99,9% = \"1 dalam 1000 tahun\"). Hasilnya (L_q) = fraksi DEBITUR yang default pada skenario seburuk itu — kerugian rupiahnya = L_q × LGD × EAD, bukan L_q itu sendiri.",
        "Credit VaR = kuantil kerugian pada persentil ekstrem: VaR = L_q × LGD × EAD, dengan L_q = fraksi default pada kuantil q. UL (unexpected loss) = VaR − EL — inilah yang harus ditutup modal. Jangan samakan VaR dengan UL: VaR adalah kuantilnya, UL adalah selisihnya dengan EL. Rantai lengkap: Vasicek → VaR → UL → modal (inilah Pilar 1 Basel untuk IRB!). ρ menentukan seberapa \"bersama\" debitur gagal — makin tinggi, ekor distribusi kerugian makin tebal, VaR & modal makin besar.",
        "Dengan korelasi, peluang rugi ekstrem jauh lebih besar. Credit VaR 99% (PD 4%, LGD 40%, EAD Rp1.000 jt, 100 debitur): independen ≈ Rp36 jt, berkorelasi (ρ = 12–24%) ≈ Rp63–97 jt — korelasi bisa lebih dari menggandakan kebutuhan modal, tanpa mengubah EL sedikit pun. Angka lama di kalimat ini (18 dan 32) tidak dapat direproduksi karena asumsinya tidak pernah dinyatakan; hitung ulang lengkap ada di langkah tambahan 'Asumsi dan satuan'.",
      ],
      formula: String.raw`L_q = \Phi\left(\frac{\Phi^{-1}(\text{PD}) + \sqrt{\rho}\,\Phi^{-1}(q)}{\sqrt{1-\rho}}\right)`,
      formulaNote: "L_q = fraksi default pada persentil keyakinan q (bukan kerugian rupiah). Kerugian (VaR) = L_q × LGD × EAD; UL = VaR − EL.",
      tasks: [],
      reference: "Rantai Basel: PD/LGD/EAD → Vasicek (ρ) → distribusi kerugian → VaR 99,9% → UL → modal.",
    },
    {
      id: "lab-hhi",
      eyebrow: "Langkah 6 · Lab HHI",
      title: "Konsentrasi dalam satu angka",
      prose: [
        "Tiga bank, total kredit sama (Rp 1000 M). Bank A: 100 debitur @10 M. Bank B: 20 debitur @50 M. Bank C: 8 debitur timpang [400, 200, 100, 100, 50, 50, 50, 50]. Fungsi hhi terkunci. Tugasmu: hitung HHI ketiganya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hhi_a` dan `hhi_b`" },
        { id: "t2", text: "Hitung `hhi_c`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "A=0.0100 B=0.0500 C=0.2300",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank C (0,23) sangat terkonsentrasi — butuh modal jauh lebih besar dari Bank A untuk portofolio nominal yang sama. Inilah granularity adjustment Basel: konsentrasi membayar 'pajak' modal.",
      },
      hints: [
        "Ubah nominal jadi pangsa: x/total.",
        "HHI = jumlah kuadrat pangsa.",
        "hhi_a = hhi([x/1000 for x in bank_a])",
      ],
      code: {
        starter: `def hhi(pangsa):\n    return sum(p**2 for p in pangsa)\n\nbank_a = [10]*100\nbank_b = [50]*20\nbank_c = [400, 200, 100, 100, 50, 50, 50, 50]\n\n# TULIS KODEMU\nhhi_a = \nhhi_b = \nhhi_c = \n\nprint(f"A={hhi_a:.4f} B={hhi_b:.4f} C={hhi_c:.4f}")`,
        lockLines: 6,
        solution: `def hhi(pangsa):\n    return sum(p**2 for p in pangsa)\n\nbank_a = [10]*100\nbank_b = [50]*20\nbank_c = [400, 200, 100, 100, 50, 50, 50, 50]\n\n# TULIS KODEMU\nhhi_a = hhi([x/sum(bank_a) for x in bank_a])\nhhi_b = hhi([x/sum(bank_b) for x in bank_b])\nhhi_c = hhi([x/sum(bank_c) for x in bank_c])\n\nprint(f"A={hhi_a:.4f} B={hhi_b:.4f} C={hhi_c:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hhi_a", value: 0.01, tol: 1e-9, label: "`hhi_a` seharusnya 0.0100", msg: "100 × 0.01² = 0.01 — tersebar." },
          { kind: "equal", task: "t1", name: "hhi_b", value: 0.05, tol: 1e-9, label: "`hhi_b` seharusnya 0.0500", msg: "20 × 0.05² = 0.05 — sedang." },
          { kind: "equal", task: "t2", name: "hhi_c", value: 0.23, tol: 1e-9, label: "`hhi_c` seharusnya 0.2300", msg: "0.16+0.04+0.01+0.01+4×0.0025 = 0.23 — terkonsentrasi." },
          { kind: "stdout_matches", task: "t3", pattern: "A=0\\.0100\\s+B=0\\.0500\\s+C=0\\.2300", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Patokan: ≤0,01 tersebar · >0,01–0,10 sedang · >0,10 terkonsentrasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: membaca risiko portofolio",
      prose: [
        "Skenario 1 — Dua opsi penyaluran dengan EL sama. → Bandingkan UL, bukan EL: 20 warung @Rp 50 jt (rugi terburuk realistis Rp 60 jt) vs 1 mal Rp 1 M (rugi Rp 400 jt sekaligus). EL sama Rp 16 jt; nasib beda langit-bumi. Pilih granulitas — atau minta harga yang menutup UL-nya.",
        "Skenario 2 — HHI di atas 0,10. → Terkonsentrasi: kurangi eksposur atau tambah modal via granularity adjustment (+18–30%). Contoh nyata: 8 debitur timpang HHI 0,23 → modal IRB Rp 80 M seharusnya Rp 94 M. Yang memakai angka mentah kekurangan Rp 14 M — tak terlihat sampai debitur Rp 400 M itu default.",
        "Skenario 3 — HHI per nama rendah (<0,03). → Hitung HHI per FAKTOR: 30 debitur batubara @3% portofolio (sektor = 90% portofolio) → HHI nama 0,027 (terlihat tersebar) tetapi HHI faktor 0,9² = 0,81 (ekstrem). Saat harga jatuh 40%, ketigapuluhnya memburuk bersamaan — 'diversifikasi' 30 nama ternyata satu taruhan.",
        "Skenario 4 — Ditawari ikut sindikasi Rp 500 M (EL tambahan cuma Rp 6 M). → Hitung konsentrasi sektor pasca-deal + RAROC, bukan cuma EL. Contoh nyata: porsi tambang 6,34% (Rp 1,3 T dari total Rp 20,5 T pasca-deal) + korelasi sektor tinggi → EL sektoral naik dari Rp 15,6 M menjadi 0,09×0,5×1300 = Rp 58,5 M saat harga jatuh — selisih Rp 42,9 M itu adalah kenaikan EL (ΔEL), BUKAN UL: UL butuh kuantil distribusi kerugian (VaR − EL), bukan selisih dua EL. Lolos BMPK (12,5% < 20%) ≠ lolos risiko.",
        "Skenario 5 — Memakai ρ tunggal 20% untuk semua segmen. → Segmentasikan: korporasi besar ρ 24%, UKM ρ 12%. Contoh nyata (PD 2%, LGD 45%): VaR 99,9% Rp 1,21 T vs Rp 0,66 T untuk dua sub-portofolio Rp 10 T yang PD-nya sama — selisih ≈ Rp 0,55 T dari parameter yang sering diisi 'angka standar'.",
        "Aturan praktis 10 detik: rata-rata tidak membunuh — sebaran yang membunuh; ukur konsentrasi per faktor risiko (sektor, wilayah, komoditas), bukan per nama; dan ingat debitur yang juga deposan besar = wrong-way funding.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Portofolio 15 nama 'terdiversifikasi' — 5 smelter, 4 kontraktor tambang, 3 logistik — yang ternyata 13 di antaranya beroperasi di dua kawasan yang sama, bergantung pada satu smelter induk, memakai satu pelabuhan. Satu pemadaman listrik 3 minggu menghantam 13 debitur SERENTAK. Diversifikasi nama tanpa diversifikasi faktor = tidur nyenyak di atas bom.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Sindikasi Rp 500 M",
      prose: [
        "Bank Nusantara ditawari memimpin sindikasi Rp 500 M ke perusahaan tambang (margin 5%, PD 3%, LGD 40%). Modal bank Rp 4 T. Saat ini eksposur tambang bank: Rp 800 M (dari total kredit Rp 20 T). EL tambahan: 0,03 × 0,4 × 500 = Rp 6 M — kecil, \"murah\". Tetapi: porsi tambang menjadi Rp 1,3 T (6,34% dari total Rp 20,5 T pasca-deal) + korelasi sektor tinggi. BMPK: 500/4000 = 12,5% modal — di bawah batas 20%, lolos hukum.",
        "Pembahasan: lolos hukum ≠ lolos risiko. (1) Konsentrasi sektor: 6,5% di satu sektor siklikal — jika harga batubara jatuh 40% (pernah terjadi), PD sektor bisa 3%→9% serentak (korelasi!). EL sektor: 0,09×0,5×1300 = Rp 58,5 M vs Rp 15,6 M normal — selisih Rp 42,9 M adalah kenaikan EL, bukan UL; UL sektoral butuh kuantil (VaR − EL), bukan selisih EL. (2) Harga tidak sepadan: margin 5% terlihat menarik, tetapi setelah dihitung RAROC (return per modal UL — CR21), kemungkinan di bawah hurdle rate bank.",
        "(3) Keputusan: ikut sebagian (misal Rp 150 M) + jual sisanya (sub-partisipasi), ATAU minta pricing lebih tinggi + covenant harga komoditas. Pelajaran: BMPK adalah lantai hukum, bukan persetujuan risiko.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Limit sektor 95% terpakai, proposal tambang individual bagus masuk: tolak dengan penjelasan portofolio, atau setujui dengan harga konsentrasi (pricing + tenor + covenant). Limit yang dilanggar diam-diam bukan limit — disiplin portofolio mengalahkan kecemerlangan individual.",
      },
      reference: "Kepatuhan ≠ kehati-hatian. BMPK mencegah kebangkrutan tunggal; manajemen konsentrasi mencegah erosi modal perlahan.",
    },
    {
      id: "konsentrasi-tersembunyi",
      eyebrow: "Langkah 9 · Konsentrasi tersembunyi",
      title: "Konsentrasi yang tidak terlihat di HHI nama",
      prose: [
        "HHI per nama bisa menipu. Tiga puluh debitur batubara @3% portofolio memberi HHI nama 0,027 — terlihat tersebar. Tetapi hitung HHI per FAKTOR: sektor batubara = 90% portofolio, jadi HHI faktor = 0,9² = 0,81 — ekstrem. Ketika harga batubara jatuh 40%, ketigapuluh debitur itu memburuk bersamaan; \"diversifikasi\" 30 nama ternyata satu taruhan. Konsentrasi sejati diukur per faktor risiko (sektor, wilayah, komoditas), bukan per nama.",
        "Contoh kedua — konsentrasi agunan: KPR Rp 5 T dengan 80% di Jabodetabek. Per nama tersebar sempurna (ribuan debitur), tetapi guncangan harga properti Jakarta memukul LGD seluruh portofolio serentak: agunan yang tadinya menutup 70% exposure kini hanya 50%. Konsentrasi ketiga yang paling dilupakan: debitur yang juga deposan besar atau pemiliknya grup yang sama — gagal bayar dan rush penarikan dana terjadi bersamaan (wrong-way funding).",
        "Cara salah: limit hanya per nama (\"maks 10% modal per debitur\") lalu merasa aman. Cara benar: limit berlapis — per nama, per sektor (% modal), per wilayah, dan per faktor agunan. Stress test pun harus per faktor: \"bagaimana jika harga batubara −40%?\" memberi jawaban yang tidak pernah muncul dari stress \"PD naik 2× merata\".",
        "Aturan keputusan. Satu: hitung HHI per faktor (sektor, wilayah) tiap kuartal berdampingan dengan HHI per nama; jika keduanya bercerita berbeda, percayai yang faktor. Dua: tetapkan limit sektor sebagai % modal (misalnya batubara ≤ 100% Tier 1) — bukan % portofolio, karena % portofolio bisa \"terlihat kecil\" saat portofolionya sendiri jumbo. Tiga: petakan rantai pasok debitur besarmu — konsentrasi bersembunyi di pelanggan dan pemasok yang sama.",
      ],
      tasks: [],
      reference: "Diversifikasi sejati = sebar antar faktor, bukan antar nama.",
    },
    {
      id: "granularity-nyata",
      eyebrow: "Langkah 10 · Granularity adjustment",
      title: "Pajak modal untuk portofolio kurus",
      prose: [
        "Rumus modal IRB (Vasicek) mengasumsikan portofolio \"sangat granular\" — ribuan debitur kecil sehingga risiko idiosinkratik saling meniadakan. Portofolio korporasi bank menengah dengan 15–50 nama melanggar asumsi ini: satu default besar menggoyang seluruh distribusi kerugian. Granularity adjustment (GA) adalah koreksinya — \"pajak\" modal atas ketidak-granularan, yang naik seiring HHI.",
        "Contoh dengan angka: Bank C dari lab langkah 6 (HHI 0,23, 8 debitur timpang). Modal IRB formula: Rp 80 M. GA ≈ +18% → modal seharusnya Rp 94 M. Bank yang memakai angka IRB mentah kekurangan Rp 14 M modal terhadap risiko sebenarnya — kekurangan yang tidak terlihat sampai debitur Rp 400 M itu default. Untuk portofolio 15 nama korporasi, understatement tipikal 20–30%. Inilah mengapa bank kecil yang \"ikut\" metodologi bank besar tanpa penyesuaian justru paling rapuh.",
        "Cara salah: mengabaikan GA karena \"rumusnya kompleks\". Cara benar: jika HHI di atas 0,05, hitung GA sederhana (atau pakai buffer manajemen yang dikalibrasi ke GA) dan laporkan dua angka — modal IRB dan modal setelah GA. Untuk BPR dan bank kecil, pendekatan standar (SA) yang konservatif sering lebih jujur daripada IRB tanpa GA.",
        "Aturan keputusan. Satu: aturan praktis lesson ini — HHI > 0,05 → hitung GA (bukan ambang regulasi universal; kalibrasi ke kebijakan bankmu). Dua: single-name terbesar > 5% portofolio → analisis sensitivitas \"bagaimana jika ia default besok\" sebagai pelengkap VaR. Tiga: keputusan limit baru harus mempertimbangkan dampaknya ke HHI/GA — setiap kredit jumbo baru menaikkan \"pajak\" seluruh portofolio, bukan hanya risikonya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: diversifikasi dihitung dari dompet, bukan dari daftar nama",
        body: "Setiap kali mendengar \"portofolio kami terdiversifikasi\", tanyakan satu hal: diversifikasi dari APA? Jika jawabannya \"dari nama debitur\", belum cukup. Hitung rupiah per faktor risiko — sektor, wilayah, komoditas, bahkan pemberi kerja utama debitur ritelmu (satu kawasan industri = satu faktor). Heuristik yang jarang disadari: konsentrasi adalah satu-satunya risiko yang bisa dihilangkan HAMPIR gratis — menolak kredit jumbo tidak butuh biaya model atau modal, tetapi ada biaya peluang (margin yang hilang) dan biaya hubungan nasabah; “gratis” di sini = tanpa biaya modal/model, bukan tanpa biaya sama sekali. Menurunkan PD butuh underwriting lebih ketat (mengorbankan pertumbuhan); menurunkan LGD butuh agunan (mengorbankan segmen); menghilangkan konsentrasi hanya butuh satu kata — \"tidak\" — pada kredit jumbo ke-sekian di sektor yang sama. Tidak ada biaya, tidak ada model, hanya disiplin menolak. Bank yang rajin mengecilkan PD tetapi malas membatasi konsentrasi sedang memoles gagang pintu sementara fondasinya miring. Alat bantunya murah: sekali setahun, susun ulang seluruh portofolio bukan per debitur melainkan per faktor — satu baris per sektor, per wilayah, per komoditas — dengan total rupiahnya. Tabel satu halaman ini hampir selalu mengejutkan direksi, karena konsentrasi yang tersebar di ratusan nama tiba-tiba terlihat sebagai satu baris raksasa. Apa yang terlihat, dibatasi.",
      },
      reference: "Konsentrasi = risiko yang bisa dihapus hampir gratis (tanpa biaya modal/model — tetapi ada biaya peluang). Jangan bayar mahal untuk yang (hampir) gratis.",
    },
    {
      id: "rho-tidak-konstan",
      eyebrow: "Langkah 11 · Korelasi aset",
      title: "Rho yang tidak konstan",
      prose: [
        "Basel menetapkan korelasi aset (ρ) 12–24% untuk korporasi — tetapi ρ bukan konstanta alam. Ia lebih tinggi untuk debitur besar dan lembaga keuangan (terikat erat ke sistem), lebih rendah untuk UKM dan ritel (nasibnya lebih idiosinkratik). Memakai ρ tunggal 20% untuk seluruh portofolio meremehkan ekor pada segmen korporasi besar dan melebih-lebihkan pada ritel.",
        "Contoh: dua sub-portofolio Rp 10 T, PD sama 2%, LGD 45%. Korporasi besar (ρ 24%): q_99,9% = 26,79% → VaR = 0,2679 × 0,45 × Rp 10 T ≈ Rp 1,21 T. UKM (ρ 12%): q_99,9% = 14,73% → VaR = 0,1473 × 0,45 × Rp 10 T ≈ Rp 0,66 T. Selisih ≈ Rp 0,55 T kebutuhan modal dari parameter yang sering diisi \"angka standar\" tanpa pikir. (Angka lama lesson ini — Rp 1,9 T vs Rp 1,2 T — tidak dapat direkonsiliasi: ia menyiratkan LGD 71% untuk yang satu dan 82% untuk yang lain, padahal LGD-nya sama.) Aturan keputusan: segmentasikan ρ mengikuti Basel (size + segmen); uji sensitivitas ±5 poin ρ dan laporkan — VaR jauh lebih sensitif terhadap ρ daripada terhadap PD.",
      ],
      tasks: [],
      reference: "ρ bukan konstanta — ia mengikuti ukuran dan keterkaitan debitur.",
    },
        {
          id: "gap-r7-pd-marginal",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P3-G1)",
          title: "PD marginal: yang dibutuhkan rumus lifetime",
          prose: [
            "Rumus ECL lifetime (CR14a) butuh PD MARGINAL — peluang debitur default TEPAT di tahun ke-t — bukan PD tahunan mentah. Bedanya: PD tahunan (hazard) adalah peluang kondisional 'default di tahun t, BILA bertahan sampai tahun t'; PD marginal mengalikannya dengan peluang bertahan sampai tahun itu. Contoh: hazard tahun 1–3 = 2%, 3%, 4%. PD marginal tahun 1 = 2,00% (semua bertahan di awal). Tahun 2: 98% bertahan × 3% = 2,94% — BUKAN 3%. Tahun 3: 95,06% bertahan × 4% = 3,80%. PD lifetime 3 tahun = 2,00 + 2,94 + 3,80 = 8,74%.",
            "Kesalahan yang umum: menjumlah hazard mentah (2 + 3 + 4 = 9%) dan menyebutnya PD lifetime. Itu melebih-lebihkan — karena menjumlah peluang orang yang SUDAH default di tahun sebelumnya seolah mereka bisa default lagi. Selisihnya kecil di sini (9,00% vs 8,74%) tetapi membesar saat hazard tinggi atau tenor panjang — dan ECL lifetime yang dihitung dari PD yang salah ikut salah. Aturan: simpan survival S(t) = Π(1 − h) di tiap langkah; PD marginal tahun t = S(t−1) × h(t); PD lifetime = 1 − S(T). Bila hazard berubah karena skenario makro (CR14a), hitung marginal per skenario — jangan pakai satu hazard untuk semua skenario.",
          ],
          formula: String.raw`PD^{marg}_t = S(t-1) \times h_t \qquad S(t) = \prod_{s \le t}(1 - h_s) \qquad PD^{lifetime} = 1 - S(T)`,
          formulaNote: "Hazard 2%, 3%, 4%: marginal 2,00% / 2,94% / 3,80%; lifetime 8,74% (bukan 9,00% dari jumlah hazard mentah).",
          tasks: [
            { id: "t1", text: "Hitung PD marginal tiap tahun: `pd_m1`, `pd_m2`, `pd_m3`" },
            { id: "t2", text: "Hitung `pd_lifetime` 3 tahun" },
          ],
          expected: "pd_m1=0.02 pd_m2=0.0294 pd_m3=0.038 pd_lifetime=0.0874",
          hints: [
            "PD marginal tahun t = peluang bertahan sampai t−1 × hazard tahun t.",
            "Survival setelah tahun 1 = 0,98; setelah tahun 2 = 0,98 × 0,97.",
          ],
          code: {
            starter: `# Hazard tahunan (PD kondisional bila bertahan): tahun 1-3\nhazard = [0.02, 0.03, 0.04]\n\n# TULIS KODEMU: PD marginal tiap tahun + PD lifetime 3 tahun\npd_m1 =\npd_m2 =\npd_m3 =\npd_lifetime =\n\nprint(f"pd_m1={pd_m1} pd_m2={pd_m2} pd_m3={pd_m3} pd_lifetime={pd_lifetime}")`,
            lockLines: 4,
            solution: `# Hazard tahunan (PD kondisional bila bertahan): tahun 1-3\nhazard = [0.02, 0.03, 0.04]\n\n# TULIS KODEMU: PD marginal tiap tahun + PD lifetime 3 tahun\ns = 1.0\npd_m1 = round(s * hazard[0], 4); s *= 1 - hazard[0]\npd_m2 = round(s * hazard[1], 4); s *= 1 - hazard[1]\npd_m3 = round(s * hazard[2], 4); s *= 1 - hazard[2]\npd_lifetime = round(1 - s, 4)\n\nprint(f"pd_m1={pd_m1} pd_m2={pd_m2} pd_m3={pd_m3} pd_lifetime={pd_lifetime}")`,
            checks: [
              { kind: "equal", task: "t1", name: "pd_m1", value: 0.02, tol: 0.0001, label: "`pd_m1` = 0,02", msg: "Tahun 1: semua bertahan → marginal = hazard." },
              { kind: "equal", task: "t1", name: "pd_m2", value: 0.0294, tol: 0.0001, label: "`pd_m2` = 0,0294", msg: "0,98 × 0,03 = 0,0294 — bukan 0,03 mentah." },
              { kind: "equal", task: "t1", name: "pd_m3", value: 0.038, tol: 0.0001, label: "`pd_m3` = 0,038", msg: "0,9506 × 0,04 = 0,0380." },
              { kind: "equal", task: "t2", name: "pd_lifetime", value: 0.0874, tol: 0.0001, label: "`pd_lifetime` = 0,0874", msg: "1 − 0,98×0,97×0,96 = 8,74% — bukan 9% jumlah hazard." },
              { kind: "stdout_matches", task: "t2", pattern: "pd_m1=0\\.02\\s+pd_m2=0\\.0294\\s+pd_m3=0\\.038\\s+pd_lifetime=0\\.0874", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Hazard tahun 1 = 2%, tahun 2 = 3%. Berapa PD marginal tahun ke-2?",
              options: [
                { text: "2,94% — 98% yang bertahan × 3% hazard tahun 2", why: "Tepat: PD marginal = survival × hazard. Yang sudah default di tahun 1 tidak bisa default lagi di tahun 2.", correct: true },
                { text: "3% — hazard tahun 2 langsung dipakai", why: "Salah: itu hazard kondisional, bukan PD marginal. Memakainya mentah melebih-lebihkan PD lifetime." },
                { text: "5% — 2% + 3%", why: "Salah: menjumlah hazard mencampur peluang bersyarat dari populasi yang berbeda." },
                { text: "2,91% — 97% × 3%", why: "Salah: survival setelah tahun 1 adalah 98% (1 − 2%), bukan 97%." },
              ],
            },
          ],
          reference: "PD marginal = S(t−1) × hazard(t); PD lifetime = 1 − S(T). Jangan jumlah hazard mentah.",
        },
        {
          id: "gap-r7-lgd-diskonto",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P3-G2)",
          title: "LGD: kapan uangnya kembali itu penting",
          prose: [
            "LGD = 1 − (recovery bersih / EAD) — tetapi 'recovery' itu recovery KAPAN? Rp400 juta yang kembali di tahun ke-2 tidak sama dengan Rp400 juta hari ini. Dengan tingkat diskonto 10%: nilai hari ini recovery itu = 400 / 1,1² = Rp330,58 jt. Biaya workout Rp50 jt di tahun ke-1 juga didiskonto: 50 / 1,1 = Rp45,45 jt. Recovery bersih hari ini = 330,58 − 45,45 = Rp285,12 jt dari EAD Rp1.000 jt → LGD = 1 − 285,12/1.000 = 71,49%. Bila kamu memakai angka nominal (400 − 50 = 350 → LGD 65%), kamu meremehkan LGD sebesar 6,5 poin persentase — dan CKPN yang dihitung darinya ikut terlalu kecil.",
            "Jebakan kedua, yang berlawanan arah: DOUBLE-COUNT diskonto. Bila recovery rate yang kamu pakai berasal dari harga pasar obligasi default (market LGD), nilai waktu SUDAH tercermin di harga itu — mendiskontonya lagi berarti menghitung waktu dua kali dan melebih-lebihkan LGD. Konvensi yang benar: SATU kali diskonto, dan tulis konvensimu. Workout LGD (dari arus kas aktual + diskonto eksplisit) atau market LGD (dari harga, tanpa diskonto tambahan) — pilih satu, jangan campur. Dan catat tingkat diskontonya: LGD 71,49% di atas memakai 10%; dengan 5% hasilnya 68,83% — LGD-mu sensitif terhadap r yang kamu pilih.",
          ],
          formula: String.raw`\text{LGD} = 1 - \frac{\text{PV(recovery)} - \text{PV(biaya)}}{\text{EAD}} \qquad \text{PV} = \frac{\text{arus kas}}{(1+r)^t}`,
          formulaNote: "EAD Rp1.000 jt; recovery Rp400 jt thn-2 → PV 330,58; biaya Rp50 jt thn-1 → PV 45,45; LGD benar 71,49% vs nominal 65,0%.",
          tasks: [
            { id: "t1", text: "Hitung `pv_recovery` dan `pv_biaya` (r = 10%)" },
            { id: "t2", text: "Hitung `lgd_benar` (%) vs `lgd_nominal` (%)" },
          ],
          expected: "pv_recovery=330.58 pv_biaya=45.45 lgd_benar=71.49 lgd_nominal=65.0",
          hints: [
            "PV = arus kas / (1,1)^t — recovery di tahun 2, biaya di tahun 1.",
            "LGD nominal memakai angka tanpa diskonto: 1 − (400−50)/1000.",
          ],
          code: {
            starter: `# EAD Rp1000 jt; recovery Rp400 jt diterima tahun ke-2; biaya workout Rp50 jt tahun ke-1; r = 10%\nead = 1000; recovery = 400; biaya = 50; r = 0.10\n\n# TULIS KODEMU: PV recovery, PV biaya, LGD benar vs LGD nominal\npv_recovery =\npv_biaya =\nlgd_benar =\nlgd_nominal =\n\nprint(f"pv_recovery={pv_recovery} pv_biaya={pv_biaya} lgd_benar={lgd_benar} lgd_nominal={lgd_nominal}")`,
            lockLines: 4,
            solution: `# EAD Rp1000 jt; recovery Rp400 jt diterima tahun ke-2; biaya workout Rp50 jt tahun ke-1; r = 10%\nead = 1000; recovery = 400; biaya = 50; r = 0.10\n\n# TULIS KODEMU: PV recovery, PV biaya, LGD benar vs LGD nominal\npv_recovery = round(recovery / (1 + r) ** 2, 2)\npv_biaya = round(biaya / (1 + r) ** 1, 2)\nlgd_benar = round((1 - (pv_recovery - pv_biaya) / ead) * 100, 2)\nlgd_nominal = round((1 - (recovery - biaya) / ead) * 100, 1)\n\nprint(f"pv_recovery={pv_recovery} pv_biaya={pv_biaya} lgd_benar={lgd_benar} lgd_nominal={lgd_nominal}")`,
            checks: [
              { kind: "equal", task: "t1", name: "pv_recovery", value: 330.58, tol: 0.01, label: "`pv_recovery` = 330,58", msg: "400/1,1² = 330,58 — uang tahun ke-2 lebih murah dari nominalnya." },
              { kind: "equal", task: "t1", name: "pv_biaya", value: 45.45, tol: 0.01, label: "`pv_biaya` = 45,45", msg: "50/1,1 = 45,45." },
              { kind: "equal", task: "t2", name: "lgd_benar", value: 71.49, tol: 0.05, label: "`lgd_benar` = 71,49%", msg: "1 − (330,58−45,45)/1000 = 71,49%." },
              { kind: "equal", task: "t2", name: "lgd_nominal", value: 65.0, tol: 0.1, label: "`lgd_nominal` = 65,0%", msg: "Tanpa diskonto LGD tampak 6,5 pp lebih kecil — CKPN ikut terlalu kecil." },
              { kind: "stdout_matches", task: "t2", pattern: "pv_recovery=330\\.58\\s+pv_biaya=45\\.45\\s+lgd_benar=71\\.49\\s+lgd_nominal=65\\.0", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Recovery Rp400 jt diterima tahun ke-2, r = 10%. Nilai hari ini?",
              options: [
                { text: "Rp330,58 jt — 400 / 1,1²", why: "Tepat: uang tahun ke-2 didiskonto dua tahun. Memakai 400 mentah meremehkan LGD.", correct: true },
                { text: "Rp400 jt — nominalnya yang dihitung", why: "Salah: LGD tanpa diskonto (65%) meremehkan kerugian 6,5 pp dibanding yang benar (71,49%)." },
                { text: "Rp363,64 jt — 400 / 1,1 (satu tahun saja)", why: "Salah: recovery-nya di tahun ke-2, bukan tahun ke-1 — pangkatnya 2, bukan 1." },
                { text: "Rp330,58 jt lalu didiskonto sekali lagi karena harga pasar", why: "Salah: itu double-count — bila recovery sudah dari harga pasar, waktu sudah tercermin di harga; jangan diskonto lagi." },
              ],
            },
          ],
          reference: "LGD memakai PV recovery − PV biaya (SEKALI diskonto); nominal meremehkan LGD; market LGD jangan didiskonto lagi (double-count).",
        },
        {
          id: "gap-r7-var-asumsi-satuan",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P3-G3)",
          title: "Asumsi dan satuan: VaR tanpa asumsi tidak bisa direproduksi",
          prose: [
            "Kalimat di langkah 5 — 'Credit VaR 99%: independen ≈ Rp18 jt, berkorelasi ≈ Rp32 jt' — tidak dapat direproduksi: ukuran portofolio, PD, LGD, jumlah debitur, dan korelasinya tidak pernah dinyatakan. Angka VaR tanpa asumsi adalah angka yang tidak bisa diperiksa — dan angka yang tidak bisa diperiksa tidak bisa dipercaya. Langkah ini memperbaikinya dengan SATU set asumsi eksplisit, memakai angka kanonis lesson ini sendiri: PD 4%, LGD 40%, EAD total Rp1.000 jt, 100 debitur @ Rp10 jt, keyakinan 99%.",
            "Hasil hitung ulangnya: independen (binomial eksak — kuantil 99% = 9 gagal dari 100, tiap gagal rugi Rp4 jt) → VaR99 = Rp36,0 jt. Berkorelasi (Vasicek, ρ = 12%) → Rp62,8 jt; (ρ = 24%) → Rp96,7 jt. Jadi pasangan yang dapat direproduksi adalah Rp36 jt vs Rp63–97 jt — korelasi bisa lebih dari menggandakan kebutuhan modal, tanpa mengubah EL sedikit pun. Perhatikan dua hal. Satu: kasus independen TIDAK bisa dihitung dengan Vasicek ρ = 0 — rumus itu memberi L_q = PD (granularitas tak hingga menelan ekornya); kasus independen butuh distribusi binomial. Dua: satuan dan asumsi WAJIB menyertai angka VaR — 'Rp36 jt' saja belum cukup; 'VaR99 Rp36 jt (PD 4%, LGD 40%, EAD Rp1.000 jt, 100 debitur)' baru bisa diperiksa orang lain.",
          ],
          formula: String.raw`VaR_{99\%} = L_{99\%} \times LGD \times EAD \qquad L_{99\%} = \Phi\left(\frac{\Phi^{-1}(PD) + \sqrt{\rho}\,\Phi^{-1}(0{,}99)}{\sqrt{1-\rho}}\right)`,
          formulaNote: "PD 4%, LGD 40%, EAD Rp1.000 jt, 100 debitur: independen (binomial) 36,0; Vasicek ρ=12% → 62,8; ρ=24% → 96,7 (Rp jt).",
          tasks: [
            { id: "t1", text: "Hitung `var_indep` (binomial eksak, q99)" },
            { id: "t2", text: "Hitung `var_rho12` dan `var_rho24` (Vasicek)" },
          ],
          expected: "var_indep=36.0 var_rho12=62.8 var_rho24=96.7",
          hints: [
            "Binomial: cari k terkecil dengan P(X ≤ k) ≥ 0,99; tiap gagal rugi (1000/100) × 0,4 = Rp4 jt.",
            "Vasicek: L_q = Φ((Φ⁻¹(PD) + √ρ·Φ⁻¹(0,99)) / √(1−ρ)); VaR = L_q × LGD × EAD.",
          ],
          code: {
            starter: `import math, statistics as st\n\n# Asumsi EKSPLISIT (yang tidak dinyatakan di langkah 5): PD 4%, LGD 40%,\n# EAD total Rp1000 jt, 100 debitur @ Rp10 jt, q = 99%\npd, lgd, ead, n = 0.04, 0.4, 1000, 100\n\n# TULIS KODEMU: VaR99 independen (binomial eksak) + Vasicek rho 12% dan 24%\nvar_indep =\nvar_rho12 =\nvar_rho24 =\n\nprint(f"var_indep={var_indep} var_rho12={var_rho12} var_rho24={var_rho24}")`,
            lockLines: 7,
            solution: `import math, statistics as st\n\n# Asumsi EKSPLISIT (yang tidak dinyatakan di langkah 5): PD 4%, LGD 40%,\n# EAD total Rp1000 jt, 100 debitur @ Rp10 jt, q = 99%\npd, lgd, ead, n = 0.04, 0.4, 1000, 100\n\n# TULIS KODEMU: VaR99 independen (binomial eksak) + Vasicek rho 12% dan 24%\ndef phi(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef vasicek_q(pd, rho, q):\n    z = st.NormalDist().inv_cdf(pd)\n    zq = st.NormalDist().inv_cdf(q)\n    return phi((z + math.sqrt(rho) * zq) / math.sqrt(1 - rho))\nc = 0.0\nk = 0\nwhile c < 0.99:\n    c += math.comb(n, k) * pd ** k * (1 - pd) ** (n - k)\n    k += 1\nvar_indep = round((k - 1) * (ead / n) * lgd, 1)\nvar_rho12 = round(vasicek_q(pd, 0.12, 0.99) * lgd * ead, 1)\nvar_rho24 = round(vasicek_q(pd, 0.24, 0.99) * lgd * ead, 1)\n\nprint(f"var_indep={var_indep} var_rho12={var_rho12} var_rho24={var_rho24}")`,
            checks: [
              { kind: "equal", task: "t1", name: "var_indep", value: 36.0, tol: 0.5, label: "`var_indep` = 36,0", msg: "Kuantil 99% binomial(100; 4%) = 9 gagal × Rp4 jt = Rp36 jt." },
              { kind: "equal", task: "t2", name: "var_rho12", value: 62.8, tol: 0.5, label: "`var_rho12` = 62,8", msg: "L_99(ρ=12%) = 15,69% × 0,4 × 1000 = 62,8." },
              { kind: "equal", task: "t2", name: "var_rho24", value: 96.7, tol: 0.5, label: "`var_rho24` = 96,7", msg: "L_99(ρ=24%) = 24,17% × 0,4 × 1000 = 96,7." },
              { kind: "stdout_matches", task: "t2", pattern: "var_indep=36\\.0\\s+var_rho12=62\\.8\\s+var_rho24=96\\.7", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Kenapa kasus independen TIDAK bisa dihitung dengan Vasicek ρ = 0?",
              options: [
                { text: "ρ = 0 memberi L_q = PD — ekornya hilang (granularitas tak hingga); kasus independen butuh binomial", why: "Tepat: Vasicek mengasumsikan portofolio granular tak hingga; dengan ρ = 0 tidak ada sebaran sama sekali. Binomial dengan n = 100 memberi ekor yang benar (9 gagal).", correct: true },
                { text: "Rumus Vasicek tidak menerima ρ = 0 (pembagian dengan nol)", why: "Salah: rumusnya menerima ρ = 0 — hasilnya L_q = Φ(Φ⁻¹(PD)) = PD. Masalahnya bukan error, melainkan hasilnya bukan kuantil kerugian." },
                { text: "Kasus independen tidak punya VaR — hanya kasus berkorelasi yang punya", why: "Salah: portofolio independen tetap punya sebaran kerugian (binomial) dan kuantil 99%-nya Rp36 jt." },
                { text: "Karena PD 4% terlalu kecil untuk Vasicek", why: "Salah: PD bukan masalahnya — ρ = 0 yang menghilangkan ekor, pada PD berapa pun." },
              ],
            },
          ],
          reference: "VaR tanpa asumsi (PD, LGD, EAD, n, q, ρ) + satuan = tidak bisa direproduksi. Di sini: independen 36,0; Vasicek ρ=12% → 62,8; ρ=24% → 96,7 (Rp jt).",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "EL = rata-rata; UL = sebaran. Konsentrasi melebarkan sebaran tanpa mengubah rata-rata.",
        "HHI = Σ pangsa². >0,10 = terkonsentrasi. BMPK = lantai hukum, bukan persetujuan risiko.",
        "Diversifikasi sejati = sebar antar faktor risiko, bukan antar nama.",
        "Korelasi menebalkan ekor distribusi kerugian — ρ menentukan kebutuhan modal.",
        "Vasicek → VaR → UL → modal: mesin Pilar 1 Basel untuk IRB.",
      ],
      next: { label: "CR16 — Stress Testing", href: "/v2/learn/cr16-stress-testing" },
      quiz: [
        {
          q: "Dua portofolio Rp 1 M: 100 debitur vs 5 debitur. PD, LGD sama. Mana benar?",
          options: [
            { text: "Risiko sama — EL-nya sama", why: "EL sama, tetapi sebaran (UL) beda." },
            { text: "UL portofolio 5 debitur jauh lebih besar — EL sama, sebaran (UL) beda; konsentrasi membayar 'pajak' modal", why: "Konsentrasi melebarkan sebaran tanpa mengubah rata-rata — dan modal membayar sebaran.", correct: true },
            { text: "Portofolio 5 debitur lebih aman (mudah dimonitor)", why: "Mudah dimonitor tidak mengkompensasi UL yang besar." },
            { text: "Tidak bisa dibandingkan", why: "Bisa — via UL." },
          ],
        },
        {
          q: "HHI = 0,22. Interpretasi?",
          options: [
            { text: "Tersebar baik", why: "0,22 jauh di atas 0,10." },
            { text: "Terkonsentrasi (>0,10) — satu/beberapa debitur mendominasi; butuh perhatian modal & limit", why: "HHI mengkuadratkan pangsa — debitur 40% sendiri menyumbang 0,16.", correct: true },
            { text: "HHI tidak penting", why: "HHI menentukan granularity adjustment modal." },
            { text: "Semakin tinggi semakin baik", why: "Terbalik: tinggi = terkonsentrasi = butuh modal lebih." },
          ],
        },
        {
          q: "100 debitur semuanya perusahaan batubara Kalimantan. Terdiversifikasi?",
          options: [
            { text: "Ya — 100 nama beda", why: "Nama beda, faktor risiko sama." },
            { text: "Tidak — satu faktor risiko (harga batubara); diversifikasi sejati = antar faktor (sektor/wilayah/segmen)", why: "Korelasi tinggi = tenggelam bersama. Ini wrong-way concentration klasik.", correct: true },
            { text: "Ya — Kalimantan luas", why: "Luas wilayah tidak memutus korelasi harga komoditas." },
            { text: "Tergantung PD-nya", why: "Bukan soal level PD — soal korelasi." },
          ],
        },
        {
          q: "Dalam model Vasicek, peran korelasi ρ?",
          options: [
            { text: "Tidak ada — hanya PD yang penting", why: "ρ justru penentu ekor." },
            { text: "ρ menentukan seberapa 'bersama' debitur gagal — makin tinggi, ekor distribusi kerugian makin tebal, VaR & modal makin besar", why: "Tanpa korelasi, hukum bilangan besar menjinakkan portofolio; dengan korelasi, ekor tebal membutuhkan modal besar.", correct: true },
            { text: "ρ menurunkan modal", why: "Terbalik: ρ menaikkan modal." },
            { text: "ρ hanya untuk pasar saham", why: "ρ adalah parameter kredit portofolio Basel." },
          ],
        },
        {
          q: "Limit sektor 95% terpakai, proposal tambang individual bagus masuk. Keputusan terbaik?",
          options: [
            { text: "Setujui — proposalnya bagus, itu yang penting", why: "Kecemerlangan individual tidak mengalahkan disiplin portofolio." },
            { text: "Tolak dengan penjelasan portofolio, atau setujui dengan harga konsentrasi (pricing + tenor + covenant) — limit yang dilanggar diam-diam bukan limit", why: "Opsi sehat: tolak dengan alasan keranjang penuh, atau setujui dengan harga yang mencerminkan modal tambahan untuk UL.", correct: true },
            { text: "Naikkan limit diam-diam", why: "Menghancurkan governance." },
            { text: "Serahkan ke direksi tanpa rekomendasi", why: "Analis harus memberi rekomendasi." },
          ],
        },
      ],
    },
  ],
};
