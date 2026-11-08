import type { V2Lesson } from "../lib/types";

const FIG_PAYOFF = `<svg viewBox="0 0 560 320" role="img" aria-label="Diagram payoff tail hedge: portofolio tanpa hedge vs dengan put OTM.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Payoff portofolio: tanpa hedge vs dengan tail hedge</text>
<line x1="70" y1="270" x2="530" y2="270" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="70" y1="270" x2="70" y2="30" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="300" y="296" font-size="11" fill="var(--chart-text)" text-anchor="middle">Harga aset saat jatuh tempo →</text>
<text x="24" y="150" font-size="11" fill="var(--chart-text)" text-anchor="middle" transform="rotate(-90 24 150)">Nilai portofolio →</text>
<polyline points="70,120 530,250" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="470" y="228" font-size="11" fill="var(--c2)">tanpa hedge</text>
<polyline points="70,120 250,178 530,262" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<text x="400" y="240" font-size="11" fill="var(--c1)">dengan put OTM</text>
<line x1="250" y1="270" x2="250" y2="178" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="5,4"/>
<text x="250" y="290" font-size="10" fill="var(--chart-text)" text-anchor="middle">strike</text>
<rect x="90" y="42" width="360" height="52" rx="8" fill="var(--c4)" opacity="0.18" stroke="var(--c4)" stroke-width="1.5"/>
<text x="270" y="62" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Zona lantai: put menahan kerugian</text>
<text x="270" y="80" font-size="10" fill="var(--chart-text)" text-anchor="middle">Di kiri strike, kurva mendatar — itulah asuransinya bekerja.</text>
<text x="90" y="112" font-size="10" fill="var(--chart-text)">Celah vertikal = premi yang dibayar tiap tahun (drag).</text>
</g>
</svg>`;

export const mr26: V2Lesson = {
  slug: "mr26-tail-risk-hedging",
  track: "Market Risk",
  module: "Derivatif, FX & Komoditas",
  title: "MR26 — Tail Risk Hedging: Asuransi Portofolio dari Ekor Distribusi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Premi Rp120 miliar yang ditertawakan — lalu menyelamatkan dana",
      prose: [
        "Januari 2020. Komite investasi dana pensiun 'Nusantara Abadi' menyetujui pos anggaran yang membuat beberapa anggotanya mengernyit: Rp120 miliar per tahun untuk membeli opsi put jauh di bawah harga pasar (out-of-the-money) atas indeks saham — polis asuransi yang HANYA membayar bila pasar jatuh lebih dari 20%. Tiga tahun berturut-turut polis itu kedaluwarsa tanpa nilai. Di rapat 2019, seorang anggota nyeletuk: 'Kita membakar Rp360 miliar untuk kertas yang tidak pernah dipakai.'",
        "Lalu Maret 2020 datang. Indeks jatuh 34% dalam 23 hari perdagangan — peristiwa yang menurut model normal distribusi 'seharusnya' terjadi sekali dalam beberapa ribu tahun. Portofolio Rp40 triliun itu seharusnya kehilangan Rp13,6 triliun. Polis yang ditertawakan itu membayar Rp4,1 triliun, memotong kerugian hampir sepertiga dan — yang lebih penting — memberi dana itu kas untuk membeli saham di titik terendah, saat dana lain terpaksa menjual.",
        "Twist-nya: tail hedge hampir selalu terlihat bodoh di tahun-tahun normal — premi yang dibayar adalah drag yang nyata setiap tahun, sementara manfaatnya nol 9 tahun dari 10. Nilainya hanya muncul di 1 tahun dari 10, dan di tahun itu ia bisa menentukan hidup-matinya sebuah institusi. Lesson ini mengajarkan cara berpikir seperti perusahaan asuransi: menghitung harga perlindungan ekor, memilih instrumennya, dan memutuskan kapan perlindungan itu layak dibeli. Fondasi yang dipakai lesson ini (ringkas, tanpa prasyarat): opsi put memberi hak — bukan kewajiban — menjual aset pada harga strike yang disepakati, jadi ia bekerja persis seperti polis asuransi dengan deductible; Expected Shortfall (ES) adalah rata-rata kerugian pada skenario terburuk (misal 2,5% terburuk) — tidak seperti VaR yang hanya menandai ambang, ES mengukur seberapa dalam jurang di balik ambang itu, dan justru jurang itulah yang diasuransikan tail hedge.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tail risk = risiko kejadian langka tetapi dahsyat di 'ekor' kiri distribusi return. Model risiko harian (VaR/ES) mengukurnya; tail hedge MENGELOLA-nya dengan mentransfer sebagian kerugian ekstrem ke pihak lain — dengan harga premi.",
      },
      reference: "Tail hedge = asuransi ekor: bayar premi tiap tahun, dibayar saat bencana.",
    },
    {
      id: "ekor",
      eyebrow: "Langkah 2 · Konsep",
      title: "Ekor distribusi: tempat model normal berbohong",
      prose: [
        "Distribusi normal memprediksi penurunan harian 5 sigma hampir tidak pernah terjadi. Kenyataannya, pasar saham mengalaminya berkali-kali dalam satu generasi: 1987 (-20% sehari), 2008, 2020. Ekor return keuangan 'gemuk' (fat-tailed): probabilitas bencana kecil, tetapi JAUH lebih besar dari prediksi normal, dan kerugiannya tidak simetris dengan keuntungannya.",
        "Di sinilah jump risk tinggal: risiko bahwa harga tidak bergerak mulus melainkan MELOMPAT — gap down 10% dalam semalam karena berita, bukan merayap turun 1% sepuluh hari. Model difusi biasa (Gerak Brown) tidak punya lompatan; model jump-diffusion (Merton, 1976) menambahkannya: sebagian besar waktu harga berdifusi normal, sesekali ia melompat. Jump-lah yang membunuh strategi yang 'aman menurut VaR'.",
        "Kepribadian konsep ini: ekor adalah 'daerah yang tidak dikunjungi turis'. Semua model kalibrasi hidup di badan distribusi (95% data), tetapi 95% KERUGIAN BESAR hidup di 5% ekor. Analis yang hanya memoles model badan distribusi seperti memperbaiki atap saat fondasi retak.",
        "🚨 Mitos: 'Ekor 5% artinya rugi besar hanya 5% dari waktu — bisa diabaikan.' Yang benar: 5% dari HARI PERDAGANGAN = sekitar 12 hari setahun, dan satu hari ekor bisa menghapus 3 tahun keuntungan. Frekuensi kecil × dampak raksasa = risiko yang justru paling layak diasuransikan.",
        "🚨 Mitos: 'Portofolio terdiversifikasi tidak butuh tail hedge.' Yang benar: diversifikasi gagal tepat saat paling dibutuhkan — dalam krisis, korelasi antar aset melonjak menuju 1 (semua jatuh bersama). Tail hedge melindungi dari kegagalan diversifikasi itu sendiri.",
      ],
      tasks: [],
      formula: String.raw`P(R < -k) \gg \Phi(-k) \quad \text{dan} \quad \rho_{krisis} \to 1`,
      formulaNote: "P(R < -k) = probabilitas return lebih buruk dari -k; Φ = fungsi distribusi normal (prediksi model normal); simbol ≫ artinya 'jauh lebih besar dari'. ρ_krisis = korelasi antar aset saat krisis. Interpretasi: rumus ini merangkum dua kebohongan model normal — ekor jauh lebih gemuk dari prediksi, dan diversifikasi menguap saat krisis. Contoh angka: model normal bilang penurunan 5 sigma terjadi sekali per ~14.000 tahun; pasar saham AS mengalaminya beberapa kali per dekade.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Uji cepat fat tail: hitung berapa kali return harian portofoliomu melewati 3 sigma dalam 5 tahun terakhir. Model normal memprediksi ~1-2 kali. Bila jawabannya belasan, kamu hidup di dunia berekor gemuk — dan tail hedge adalah topik yang relevan untukmu.",
      },
      reference: "Ekor gemuk + jump + korelasi→1 saat krisis = alasan tail hedge ada.",
    },
    {
      id: "instrumen",
      eyebrow: "Langkah 3 · Konsep",
      title: "Lima senjata melawan ekor",
      prose: [
        "Satu — put OTM (out-of-the-money): membeli hak jual pada strike 20-30% di bawah harga kini. Murah karena jarang 'in-the-money', tetapi tepat membayar saat bencana. Ini polis asuransi murni: premi kecil, payout besar, kedaluwarsa sia-sia 9 tahun dari 10.",
        "Dua — put spread: beli put OTM strike rendah (misal -30%) + jual put strike lebih rendah lagi (-50%). Premi bersih lebih murah karena put yang dijual membiayai sebagian; bayarannya: perlindungan berhenti di bawah -50% (lantai berlapis, bukan lantai penuh). Cocok bila dana hanya butuh selamat dari 'bencana sedang', bukan kiamat.",
        "Tiga — VIX call: opsi beli atas indeks volatilitas. Saat pasar jatuh, volatilitas meledak, VIX call membayar — dan ia membayar CEPAT (volatilitas melonjak sebelum harga menemukan dasarnya). Kelemahan: VIX tidak bisa dibeli langsung (hanya via derivatif), dan harganya sangat sensitif pada timing.",
        "Empat — CDS (credit default swap) proteksi: untuk portofolio obligasi, membeli proteksi gagal bayar atas indeks kredit. Saat krisis, spread kredit melebar dan posisi proteksi untung — mengimbangi kerugian obligasi. Ini tail hedge-nya dunia fixed income.",
        "Lima — trend following / managed futures (CTA): strategi sistematis yang ikut tren — otomatis short saat pasar jatuh. Bukan asuransi kontrak, melainkan 'asuransi perilaku': data 2008 dan 2020 menunjukkan CTA cenderung positif saat ekuitas kolaps (krisis = tren terkuat). Kelemahan: di pasar sideways berombak ia berdarah pelan (whipsaw).",
        "🚨 Mitos: 'Satu instrumen terbaik untuk semua tail hedge.' Yang benar: instrumen harus cocok dengan JENIS ekor yang ditakuti — put OTM untuk crash ekuitas mendadak, CDS proteksi untuk krisis kredit, CTA untuk drawdown berkepanjangan. Salah senjata = premi hangus tanpa perlindungan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aturan memilih: petakan dulu skenario bencana dominan portofoliomu (crash ekuitas? krisis kredit? krisis likuiditas FX?), lalu pilih instrumen yang payoff-nya berkorelasi positif dengan skenario itu. Hedge yang tidak membayar di skenariomu = premi hangus bergaya.",
      },
      reference: "Put OTM = asuransi murni; put spread = murah berlapis; VIX call = cepat; CDS = kredit; CTA = tren.",
    },
    {
      id: "harga",
      eyebrow: "Langkah 4 · Konsep",
      title: "Harga perlindungan: premi, drag, dan break-even",
      prose: [
        "Premi put OTM ≈ 1-3% dari nilai portofolio per tahun untuk proteksi -20%. Artinya portofolio yang return-nya 8% tanpa hedge menjadi ~6% dengan hedge — drag 2 poin PERSEN setiap tahun, tahun demi tahun, saat pasar normal. Selama 10 tahun bull market, drag itu menggerus ~22% nilai akhir. Inilah alasan komite investasi membenci tail hedge: biayanya pasti, manfaatnya hipotetis.",
        "Rumus nilai put saat jatuh tempo: payoff = maks(strike − harga_akhir, 0). Bila harga akhir di atas strike, payoff nol — premi hangus total. Bila harga jatuh ke setengah strike, put membayar (strike − harga) per unit — payout bisa 10-20× premi saat bencana besar. Asimetri inilah produknya: rugi kecil pasti vs untung besar jarang.",
        "Break-even berpikir: misal premi 2%/tahun dan bencana -30% terjadi rata-rata sekali per 15 tahun dengan payout 12× premi. Nilai harapan tahunan ≈ (12 × 2%)/15 − 2% = −0,4%/tahun — NEGATIF secara ekspektasi! Tail hedge hampir selalu 'rugi' dalam nilai harapan. Pembeliannya dibenarkan bukan oleh ekspektasi, melainkan oleh UTILITAS: menghindari kebangkrutan/penarikan dana massal yang nilainya tidak tertangkap rata-rata. Ini keputusan survival, bukan keputusan return.",
        "🚨 Mitos: 'Tail hedge yang baik harus positif expected value.' Yang benar: asuransi kebakaran rumahmu juga negatif expected value — kamu tetap membelinya karena rumah hangus bukan risiko yang bisa 'dirata-rata'. Dana pensiun membeli tail hedge dengan logika yang sama: bukan untuk kaya, melainkan untuk tetap ada.",
      ],
      tasks: [],
      formula: String.raw`\text{Payoff}_{put} = \max(K - S_T, 0) \qquad \text{Drag} = \frac{\text{premi tahunan}}{\text{nilai portofolio}}`,
      formulaNote: "K = strike (harga jual yang dijamin, Rp); S_T = harga aset saat opsi jatuh tempo; max(K − S_T, 0) = bayar hanya bila harga jatuh di bawah strike. Drag = premi tahunan dibagi nilai portofolio (persen per tahun). Interpretasi: drag 2% artinya setiap tahun kamu 'membayar' 2% return demi lantai proteksi. Contoh angka: portofolio Rp10 triliun, premi Rp200 miliar/tahun → drag 2%; saat crash -34%, put strike -20% membayar ≈ Rp1,4 triliun — 7× premi tahun itu.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Cara cepat menilai kewajaran premi: bandingkan dengan 'biaya alternatif' — berapa kerugian AUM bila 20% nasabah menarik dana saat crash tanpa hedge? Bila jawabannya Rp5 triliun, premi Rp200 miliar/tahun mendadak terlihat murah. Tail hedge dibeli dengan uang ketakutan yang rasional.",
      },
      reference: "Payoff asimetris; drag pasti; dibenarkan oleh survival, bukan expected value.",
    },
    {
      id: "figure-payoff",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca diagram payoff tail hedge",
      prose: [
        "Diagram di bawah memplot nilai portofolio saat jatuh tempo terhadap harga aset. Garis tanpa hedge adalah diagonal: turun 30% harga = turun 30% nilai. Garis dengan put OTM mengikuti diagonal di kanan strike (premi membuat ia sedikit DI BAWAH garis tanpa hedge — itulah drag yang terlihat), lalu MENDATAR di kiri strike: di sinilah asuransi bekerja, kerugian berhenti membesar.",
        "Perhatikan celah vertikal antara dua garis di daerah kanan: celah itu konstan = premi. Di daerah kiri, garis hedge berada JAUH di atas garis tanpa hedge — selisihnya = payout put. Titik strike adalah 'engsel' diagram: deductible polis asuransimu.",
      ],
      figure: {
        svg: FIG_PAYOFF,
        alt: "Diagram payoff tail hedge: portofolio tanpa hedge vs dengan put OTM.",
        caption: "Cara membaca: sumbu X = harga aset saat jatuh tempo (kiri = crash), sumbu Y = nilai portofolio; garis lurus = tanpa hedge, garis berengsel = dengan put OTM, garis putus-putus = strike. Interpretasi: di kanan strike kamu membayar premi (garis hedge sedikit lebih rendah = drag); di kiri strike kerugianmu berhenti (garis mendatar) sementara portofolio tanpa hedge terus jatuh — asimetri inilah yang dibeli premi.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca garis mendatar sebagai 'untung saat crash'. Bukan untung — melainkan 'rugi yang berhenti'. Portofolio hedge tetap rugi 20% (sampai strike); yang dihindari adalah 20% BERIKUTNYA. Tail hedge memotong ekor, bukan membalikkan rugi jadi laba.",
      },
      reference: "Engsel di strike: kanan = bayar premi, kiri = rugi berhenti.",
    },
    {
      id: "lab-drag",
      eyebrow: "Langkah 6 · Lab",
      title: "Simulasi: drag vs penyelamatan",
      prose: [
        "Simulasikan 15 tahun return tahunan: 14 tahun normal (return ~N(8%, 15%)) dan 1 tahun crash (-34%, meniru 2008/2020) di tahun ke-8. Bandingkan portofolio tanpa hedge vs dengan tail hedge: premi 2%/tahun, put membayar 7× premi pada tahun crash. Hitung nilai akhir keduanya dan drawdown maksimum.",
        "Hasil tipikal (seed 42): tanpa hedge Rp100 tumbuh menjadi Rp192 tetapi sempat jatuh -36% di tahun crash; dengan hedge menjadi Rp168 — lebih rendah di akhir, tetapi drawdown -30% vs -36%. Itulah trade-off yang sesungguhnya: kamu menukar return puncak dengan tidur nyenyak. Eksplorasi: ubah premi menjadi 3% atau payout menjadi 4× — pada titik mana hedge tidak lagi 'layak' menurut seleramu?",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan 15 tahun: 14 normal + 1 crash di tahun ke-8" },
        { id: "t2", text: "Hitung nilai akhir & drawdown maks kedua strategi, cetak perbandingannya" },
      ],
      expected: "Tanpa hedge: akhir=192 drawdown=-36%\nDengan hedge: akhir=168 drawdown=-30%",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Angka akhir bukan satu-satunya metrik: untuk dana pensiun, drawdown -38% memicu penarikan dana nasabah dan forced selling — kerugian riil yang tidak tertangkap angka 'nilai akhir'. Hedge membeli KELANGSUNGAN, bukan return.",
      },
      hints: [
        "Gunakan random.seed(42) agar hasil reproduksibel; crash di index tahun ke-8.",
        "Drawdown = (nilai / puncak_tertinggi_sejauh_ini − 1), ambil minimumnya.",
        "Hedge: tiap tahun kalikan (1 + r − 0.02); di tahun crash tambahkan 7 × 0.02 × nilai_awal_tahun.",
      ],
      code: {
        starter: "import random\nrandom.seed(42)\n\n# 15 tahun: return normal ~ N(8%, 15%), crash -34% di tahun ke-8 (index 7). JANGAN UBAH.\nrets = [random.gauss(0.08, 0.15) for _ in range(15)]\nrets[7] = -0.34\nPREMI = 0.02  # 2% per tahun\nPAYOUT_MULT = 7  # put membayar 7x premi di tahun crash\n\n# TULIS KODEMU: nilai akhir + drawdown maks kedua strategi\ndef jalan(rets, hedge):\n    v, puncak, dd = 100.0, 100.0, 0.0\n    for i, r in enumerate(rets):\n        v = v * (1 + r - PREMI) if hedge else v * (1 + r)\n        if hedge and i == 7:\n            v = v + 100 * PREMI * PAYOUT_MULT  # payout put, basis nilai awal 100\n        puncak = max(puncak, v)\n        dd = min(dd, v / puncak - 1)\n    return v, dd\n\nakhir0, dd0 = jalan(rets, False)\nakhir1, dd1 = jalan(rets, True)\nprint(f\"Tanpa hedge: akhir={akhir0:.0f} drawdown={dd0:.0%}\")\nprint(f\"Dengan hedge: akhir={akhir1:.0f} drawdown={dd1:.0%}\")\n",
        lockLines: 9,
        solution: "import random\nrandom.seed(42)\n\n# 15 tahun: return normal ~ N(8%, 15%), crash -34% di tahun ke-8 (index 7). JANGAN UBAH.\nrets = [random.gauss(0.08, 0.15) for _ in range(15)]\nrets[7] = -0.34\nPREMI = 0.02  # 2% per tahun\nPAYOUT_MULT = 7  # put membayar 7x premi di tahun crash\n\n# TULIS KODEMU: nilai akhir + drawdown maks kedua strategi\ndef jalan(rets, hedge):\n    v, puncak, dd = 100.0, 100.0, 0.0\n    for i, r in enumerate(rets):\n        v = v * (1 + r - PREMI) if hedge else v * (1 + r)\n        if hedge and i == 7:\n            v = v + 100 * PREMI * PAYOUT_MULT  # payout put, basis nilai awal 100\n        puncak = max(puncak, v)\n        dd = min(dd, v / puncak - 1)\n    return v, dd\n\nakhir0, dd0 = jalan(rets, False)\nakhir1, dd1 = jalan(rets, True)\nprint(f\"Tanpa hedge: akhir={akhir0:.0f} drawdown={dd0:.0%}\")\nprint(f\"Dengan hedge: akhir={akhir1:.0f} drawdown={dd1:.0%}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Baris tanpa hedge tercetak", msg: "Cetak format 'Tanpa hedge: akhir=... drawdown=...'.", pattern: "Tanpa hedge: akhir=" },
          { kind: "stdout_matches", task: "t2", label: "Baris dengan hedge tercetak", msg: "Cetak format 'Dengan hedge: akhir=... drawdown=...'.", pattern: "Dengan hedge: akhir=" },
          { kind: "uses", task: "t1", label: "Memakai data rets simulasi", msg: "Iterasi atas list rets yang sudah disediakan.", token: "rets" },
        ],
      },
      reference: "Drag pasti tiap tahun; payout besar di 1 tahun crash; drawdown jauh lebih dangkal.",
    },
    {
      id: "lab-jump",
      eyebrow: "Langkah 7 · Lab",
      title: "Jump risk: mengapa VaR gagal dan ES menangkapnya",
      prose: [
        "Bangun dua dunia: dunia A tanpa jump (return harian ~N(0, 1%)) dan dunia B dengan jump (sama, plus tiap hari ada peluang 0,5% terjadi lompatan -8%). Hitung VaR 99% dan ES 99% untuk keduanya dari 10.000 simulasi harian.",
        "Hasil tipikal (seed 7): VaR 99% dunia A ≈ 2,36%, dunia B ≈ 2,65% — hampir sama! VaR 'tidak melihat' jump karena ambang 1% hanya menangkap hari-hari buruk biasa. Tetapi ES 99% dunia A ≈ 2,63% vs dunia B ≈ 6,23% — ES menangkap ekornya karena ia merata-ratakan SEMUA yang di balik ambang, termasuk lompatan -8%. Inilah keunggulan ES yang menjadi alasan regulator (FRTB) mengganti VaR: VaR buta terhadap seberapa dalam jurang di balik garisnya.",
        "Kaitan ke tail hedge: put OTM pada dasarnya adalah 'asuransi atas selisih ES − VaR' — ia membayar tepat di wilayah yang VaR abaikan tetapi ES ukur. Eksplorasi: naikkan peluang jump ke 2% — seberapa lebar jurang ES − VaR sekarang?",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan 10.000 return harian dunia A (tanpa jump) dan B (jump 0,5% × -8%)" },
        { id: "t2", text: "Hitung VaR 99% & ES 99% keduanya, cetak selisih ES-VaR" },
      ],
      expected: "A: VaR99=2.36% ES99=2.63% jurang=0.27%\nB: VaR99=2.65% ES99=6.23% jurang=3.58%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jurang ES − VaR adalah 'wilayah tak terlihat VaR' — dan tepat di situlah jump risk tinggal. Tail hedge yang baik membayar di wilayah ini. Dana yang hanya memakai VaR 99% pada dasarnya tidak mengukur risiko yang ingin mereka hedge.",
      },
      hints: [
        "random.seed(7); return = gauss(0, 0.01); jump bila random() < 0.005 → return -= 0.08.",
        "VaR99 = -persentil ke-1 dari return; ES99 = -rata-rata return yang lebih buruk dari -VaR99.",
        "Gunakan statistics.quantiles atau sort manual: sorted(r)[int(0.01*n)].",
      ],
      code: {
        starter: "import random\nrandom.seed(7)\nN = 10000\n\n# Dunia A: difusi murni. Dunia B: + jump -8% dgn peluang 0,5%/hari. JANGAN UBAH.\nA = [random.gauss(0, 0.01) for _ in range(N)]\nB = [random.gauss(0, 0.01) - (0.08 if random.random() < 0.005 else 0) for _ in range(N)]\n\n# TULIS KODEMU: VaR99, ES99, dan jurang ES-VaR untuk A dan B\ndef var_es(xs):\n    s = sorted(xs)\n    var = -s[int(0.01 * N)]\n    es = -sum(x for x in xs if x < -var) / sum(1 for x in xs if x < -var)\n    return var, es\n\nfor nama, xs in [(\"A\", A), (\"B\", B)]:\n    v, e = var_es(xs)\n    print(f\"{nama}: VaR99={v:.2%} ES99={e:.2%} jurang={e-v:.2%}\")\n",
        lockLines: 6,
        solution: "import random\nrandom.seed(7)\nN = 10000\n\n# Dunia A: difusi murni. Dunia B: + jump -8% dgn peluang 0,5%/hari. JANGAN UBAH.\nA = [random.gauss(0, 0.01) for _ in range(N)]\nB = [random.gauss(0, 0.01) - (0.08 if random.random() < 0.005 else 0) for _ in range(N)]\n\n# TULIS KODEMU: VaR99, ES99, dan jurang ES-VaR untuk A dan B\ndef var_es(xs):\n    s = sorted(xs)\n    var = -s[int(0.01 * N)]\n    es = -sum(x for x in xs if x < -var) / sum(1 for x in xs if x < -var)\n    return var, es\n\nfor nama, xs in [(\"A\", A), (\"B\", B)]:\n    v, e = var_es(xs)\n    print(f\"{nama}: VaR99={v:.2%} ES99={e:.2%} jurang={e-v:.2%}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Hasil dunia A tercetak", msg: "Cetak baris 'A: VaR99=...'.", pattern: "A: VaR99=" },
          { kind: "stdout_matches", task: "t2", label: "Hasil dunia B tercetak", msg: "Cetak baris 'B: VaR99=...'.", pattern: "B: VaR99=" },
          { kind: "uses", task: "t1", label: "Memakai kedua dunia simulasi", msg: "Hitung untuk A dan B, bukan salah satu.", token: "B" },
        ],
      },
      reference: "VaR buta terhadap kedalaman ekor; ES menangkapnya. Tail hedge = asuransi jurang ES−VaR.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan membeli, kapan menolak tail hedge",
      prose: [
        "Skenario satu — dana pensiun / asuransi dengan kewajiban jangka panjang: BELI. Penarikan dana massal saat crash adalah risiko eksistensial; premi 1-2% murah dibanding forced selling. Pilih put OTM indeks 1 tahun, roll tiap tahun.",
        "Skenario dua — hedge fund agresif dengan investor yang paham risiko: TOLAK (atau kecil saja). Investornya memang mencari return tinggi dan siap menanggung drawdown; drag 2% menghancurkan daya saing vs peer. Ganti dengan stop-loss disiplin + likuiditas kas.",
        "Skenario tiga — bank dengan portofolio kredit: BELI via CDS proteksi indeks (bukan put ekuitas). Ekor yang ditakuti adalah gagal bayar massal, bukan crash saham — senjatanya harus cocok dengan skenarionya.",
        "Skenario empat — premi mahal (VIX > 35, semua orang panik): TUNDA atau pakai put spread. Membeli asuransi saat rumah tetangga sudah kebakaran = premi termahal. Tail hedge dibeli saat tenang (VIX rendah, premi murah), bukan saat panik.",
        "Skenario lima — portofolio kecil (< Rp50 miliar): TOLAK put listed, pertimbangkan diversifikasi + kas. Premi minimum dan biaya transaksi memakan porsi terlalu besar; asuransi termurah untuk portofolio kecil adalah alokasi kas 10-20%.",
        "Aturan praktis 10 detik: (1) apa skenario bencanaku? (2) apakah drag 1-2%/tahun bisa kujelaskan ke komite selama 5 tahun tanpa payout? (3) apakah premi sedang murah (VIX rendah)? Tiga YA = beli; satu TIDAK = pikir ulang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membeli tail hedge SETELAH crash ('kapok'). Premi pasca-crash termahal dalam siklus; secara historis pembeli pasca-2008 membayar mahal lalu kecewa 10 tahun. Asuransi dibeli sebelum kebakaran — disiplin ini yang membedakan risk manager dari penonton.",
      },
      reference: "Beli saat tenang & kewajiban panjang; tolak saat premi mahal atau portofolio kecil.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Komite investasi yang harus memilih",
      prose: [
        "Dana 'Cakra Investama' mengelola Rp12 triliun, 70% saham Indonesia. Setelah membaca lesson ini, CIO mengusulkan: beli put OTM 1 tahun atas indeks, strike 20% di bawah harga kini, premi Rp240 miliar (2%). Data pendukung: dalam 20 tahun terakhir, IHSG jatuh >20% dalam setahun sebanyak 3 kali (2008: -51%, 2020: -37% intraday, 2015: -22%); payout put semacam ini pada tiap kejadian ≈ 6-9× premi. Pertanyaan: (a) berapa drag tahunan dan total premi 10 tahun tanpa bencana? (b) berapa payout pada skenario -37%? (c) layak atau tidak — dan untuk siapa keputusan ini benar?",
        "Pembahasan: (a) Drag 2%/tahun; 10 tahun tanpa bencana = Rp2,4 triliun hangus — seperempat triliun 'uang hangus'. (b) Pada -37%, put strike -20% membayar ≈ (37%−20%) × Rp8,4 triliun eksposur ≈ Rp1,43 triliun, atau ~6× premi tahun itu. (c) Layak BILA dana ini punya risiko penarikan massal (misal DPLK dengan peserta boleh keluar) — Rp2,4 triliun premi adalah harga menghindari forced selling Rp4+ triliun di dasar jurang. TIDAK layak bila ini dana tertutup 20 tahun dengan peserta terkunci — mereka bisa menunggu pemulihan tanpa menjual, sehingga drag 2% murni merugikan. Pelajaran: tail hedge tidak pernah 'benar secara umum' — ia benar relatif terhadap struktur kewajiban dan perilaku nasabahmu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan cara CIO membingkai: bukan 'apakah premi mahal?' melainkan 'berapa biaya alternatif tanpa hedge?'. Risk manager yang baik selalu membandingkan premi dengan biaya skenario tanpa perlindungan — termasuk biaya yang tidak muncul di laporan keuangan (reputasi, penarikan dana, PHK tim).",
      },
      reference: "Premi vs biaya alternatif: keputusan hedge = perbandingan dua biaya, bukan satu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5. Baca juga alasan opsi yang salah — di sanalah miskonsepsi bersembunyi.",
      ],
      tasks: [],
      summary: [
        "Tail risk = kejadian langka-dahsyat di ekor kiri distribusi; ekor return keuangan gemuk (fat-tailed) dan berisi jump — model normal meremehkannya, dan korelasi → 1 saat krisis sehingga diversifikasi gagal tepat saat dibutuhkan.",
        "Fondasi: put = hak jual pada strike (asuransi dengan deductible); ES = rata-rata kerugian skenario terburuk — VaR buta terhadap kedalaman ekor, ES menangkapnya (lab: jurang ES−VaR dunia ber-jump ≈ 3,58% vs 0,27% tanpa jump).",
        "Lima instrumen: put OTM (asuransi murni), put spread (murah berlapis), VIX call (cepat), CDS proteksi (kredit), CTA/trend (asuransi perilaku) — pilih sesuai JENIS ekor yang ditakuti.",
        "Harga: payoff = maks(K − S_T, 0); drag premi 1-3%/tahun pasti; expected value biasanya negatif — pembelian dibenarkan logika survival (seperti asuransi kebakaran), bukan return.",
        "Keputusan: beli saat tenang + kewajiban panjang + premi murah (VIX rendah); tolak/tunda saat premi mahal, portofolio kecil, atau investor memang pemburu risiko; aturan 10 detik: skenario? drag bisa dijelaskan? premi murah?",
      ],
      next: { label: "MR27 — SQL & Otomatisasi Laporan Market Risk", href: "/v2/learn/mr27-sql-otomatisasi-laporan" },
      quiz: [
        {
          q: "Mengapa diversifikasi BUKAN pengganti tail hedge?",
          options: [
            { text: "Korelasi antar aset melonjak menuju 1 saat krisis — semua jatuh bersama", why: "Benar: diversifikasi menguap tepat saat paling dibutuhkan; tail hedge melindungi dari kegagalan diversifikasi itu.", correct: true },
            { text: "Diversifikasi selalu menaikkan return sehingga hedge tidak perlu", why: "Diversifikasi menurunkan risiko spesifik, bukan risiko sistemik ekor." },
            { text: "Diversifikasi dilarang regulator untuk dana besar", why: "Tidak ada larangan seperti itu." },
            { text: "Diversifikasi hanya bekerja untuk obligasi, bukan saham", why: "Diversifikasi bekerja lintas aset — masalahnya ia gagal di ekor krisis." },
          ],
        },
        {
          q: "Put OTM strike 20% di bawah harga kini, premi 2%/tahun. Crash -37% terjadi. Apa yang terjadi?",
          options: [
            { text: "Put membayar ≈ (37%−20%) × eksposur — kerugian berhenti di sekitar -20%", why: "Benar: payoff = maks(K − S_T, 0); di kiri strike kurva mendatar — rugi berhenti membesar.", correct: true },
            { text: "Portofolio untung karena put membayar melebihi kerugian", why: "Salah baca diagram: garis mendatar = rugi berhenti, bukan berbalik untung." },
            { text: "Put hangus karena crash terlalu dalam", why: "Terbalik: semakin dalam di bawah strike, semakin besar payout." },
            { text: "Premi 2% dikembalikan karena polis dipakai", why: "Premi tidak kembali — ia harga perlindungan yang sudah dikonsumsi." },
          ],
        },
        {
          q: "Lab jump: VaR 99% dunia ber-jump ≈ VaR dunia normal, tetapi ES-nya jauh lebih besar. Kesimpulan?",
          options: [
            { text: "VaR buta terhadap kedalaman ekor; ES menangkap jump — tail hedge mengasuransikan wilayah yang VaR abaikan", why: "Benar: jurang ES−VaR 3,58% vs 0,27% adalah 'wilayah tak terlihat VaR' tempat jump tinggal.", correct: true },
            { text: "VaR 99% salah hitung dan harus diganti 95%", why: "VaR-nya benar; ia hanya mengukur ambang, bukan kedalaman." },
            { text: "Jump tidak berpengaruh pada risiko portofolio", why: "ES yang membesar justru membuktikan jump sangat berpengaruh." },
            { text: "ES selalu lebih kecil dari VaR", why: "Terbalik: ES ≥ VaR menurut definisi (rata-rata di balik ambang)." },
          ],
        },
        {
          q: "Kapan waktu TERBURUK membeli tail hedge?",
          options: [
            { text: "Setelah crash, saat VIX tinggi — premi termahal dalam siklus", why: "Benar: membeli asuransi saat rumah tetangga kebakaran; pembeli pasca-2008 membayar mahal lalu kecewa 10 tahun.", correct: true },
            { text: "Saat pasar tenang dan VIX rendah", why: "Itu justru waktu TERBAIK: premi murah sebelum badai." },
            { text: "Saat dana punya kewajiban penarikan jangka pendek", why: "Itu alasan KUAT membeli, bukan waktu terburuk." },
            { text: "Saat komite investasi menyetujui anggarannya", why: "Persetujuan komite adalah syarat administrasi, bukan penentu timing." },
          ],
        },
        {
          q: "Expected value tail hedge biasanya negatif, tetapi dana pensiun tetap membelinya. Alasan yang tepat?",
          options: [
            { text: "Logika survival: menghindari kebangkrutan/penarikan massal yang nilainya tak tertangkap rata-rata — seperti asuransi kebakaran", why: "Benar: keputusan utilitas, bukan ekspektasi; yang dihindari adalah skenario eksistensial.", correct: true },
            { text: "Karena expected value negatif artinya pasti untung dalam jangka panjang", why: "Negatif artinya rugi dalam rata-rata — logikanya terbalik." },
            { text: "Karena regulator mewajibkan semua dana membeli put OTM", why: "Tidak ada kewajiban seperti itu." },
            { text: "Karena premi bisa diklaim kembali bila tidak dipakai", why: "Premi hangus bila tidak dipakai — tidak ada pengembalian." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghafal 'tail hedge = beli put' lalu berhenti. Put OTM hanyalah satu dari lima senjata — untuk portofolio obligasi, CDS proteksi lebih tepat; untuk drawdown berkepanjangan, CTA bisa lebih murah. Selalu mulai dari skenario bencana, bukan dari instrumen.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa premi 2%/tahun bisa 'murah' bagi DPLK tetapi 'mahal' bagi dana tertutup 20 tahun.",
        "Ingat angka lab: jurang ES−VaR dunia ber-jump ≈ 3,58% — itulah wilayah yang diasuransikan.",
      ],
      reference: "Ekor gemuk → asuransi ekor → bayar premi saat tenang → selamat saat bencana.",
    },
  ],
};
