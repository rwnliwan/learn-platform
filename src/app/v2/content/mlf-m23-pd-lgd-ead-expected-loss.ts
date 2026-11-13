import type { V2Lesson } from "../lib/types";

export const mlfM23: V2Lesson = {
  slug: "mlf-m23-pd-lgd-ead-expected-loss",
  track: "Machine Learning Finance",
  module: "Supervised — credit scoring",
  title: "MLF-M2.3 — PD, LGD, EAD & Expected Loss: Harga Sebuah Keputusan",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model sudah mengeluarkan probabilitas, scorecard sudah memberi skor. Sekarang bank bertanya: berapa rupiah risikonya? Lesson ini mengubah probabilitas menjadi uang — lewat trio Basel (PD, LGD, EAD), kalibrasi yang jujur, dan threshold yang dipilih dari biaya, bukan dari kebiasaan.",
        "Tujuan lesson ini:",
        "• Menghitung Expected Loss dari PD, LGD, dan EAD — per nasabah dan per portofolio.",
        "• Membaca kalibrasi lewat reliability diagram dan Brier score — dan tahu apa yang tidak bisa dibaca dari Brier.",
        "• Membaca confusion matrix pada threshold 0,10 dan menjelaskan kenapa akurasi 0,4682 bukan kegagalan.",
        "• Memilih threshold dari tabel kebijakan: approval rate, bad rate, EL, dan profit.",
        "• Menjalankan dua lab: kalkulator EL dan sweep threshold.",
        "Isi lesson: cerita 1.000 nasabah → PD/LGD/EAD → kalibrasi → threshold → biaya kesalahan → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook credit scoring [notebook]: GBM terkalibrasi Brier 0,1345; confusion matrix pada threshold 0,10 (TP 1.213, FP 3.077, TN 1.596, FN 114); threshold 0,10 memberi profit NT$8.214.000 pada test set 6.000 nasabah.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Bank menyetujui 1.000 nasabah — berapa yang default, berapa kerugiannya?",
      prose: [
        "Bayangkan bank menyetujui 1.000 pengajuan kartu kredit. Model berkata rata-rata PD-nya 0,22. Berapa nasabah yang akan default? Sekitar 220 — tapi «sekitar» bukan angka yang bisa dibukukan. Bank butuh expected loss: 220 nasabah × porsi yang hilang × exposure masing-masing. Itulah yang dihitung lesson ini.",
        "Tiga pertanyaan, tiga jawaban. Berapa peluang default? Itu PD — dari model klasifikasi (M2.1). Bila default, berapa yang hilang? Itu LGD — dari data recovery historis. Berapa besar exposure saat default? Itu EAD — dari limit dan utilisasi. Kalikan ketiganya: EL = PD × LGD × EAD.",
        "Nilai: pada test set 6.000 nasabah, mean PD model GBM terkalibrasi 0,2217 — nyaris sama dengan default rate aktual 0,2212 [notebook]. Selisih 0,0005. Model yang kalibrasinya sebagus ini bisa dipakai menghitung EL portofolio tanpa koreksi besar-besaran.",
        "Baik atau buruk: EL bagus bila ketiga komponennya diukur pada definisi yang sama — PD 1 bulan dikali LGD dan EAD yang juga 1 bulan. Buruk bila dicampur: PD lifetime dikali LGD 1 bulan menghasilkan angka yang bukan apa-apa.",
        "Mitigasi: kunci horizon di framing (M2.1) dan pakai konsisten di semua komponen. EL bukan ramalan nasib satu nasabah — ia adalah rata-rata atas portofolio, dan nilainya baru bermakna bila dihitung atas ratusan nasabah, bukan satu.",
      ],
      tasks: [],
    },
    {
      id: "pd-lgd-ead",
      eyebrow: "Langkah 3 · PD, LGD, EAD",
      title: "Trio Basel: tiga angka, satu expected loss",
      prose: [
        "PD (probability of default): peluang nasabah default dalam horizon yang didefinisikan. Di notebook, PD adalah output model — GBM terkalibrasi — untuk horizon 1 bulan ke depan (label UCI: default bulan berikutnya). PD 0,20 berarti: dari 100 nasabah seperti ini, sekitar 20 akan default dalam 1 bulan. PD 1 bulan dipakai sebagai proksi; EL di bawah adalah EL 1 bulan, bukan 12 bulan.",
        "LGD (loss given default): porsi exposure yang hilang bila default terjadi. Bila nasabah default dengan exposure Rp10.000.000 dan bank hanya berhasil menagih Rp5.500.000, LGD-nya 45 persen. LGD 45 persen adalah asumsi yang dipakai notebook [ilustrasi] — angka LGD sesungguhnya dihitung dari data recovery historis bank, dan berbeda per produk (kartu kredit vs KPR vs korporasi).",
        "EAD (exposure at default): besar exposure saat default terjadi. Untuk kartu kredit, EAD bukan limitnya — melainkan limit yang terpakai plus penarikan tambahan menjelang default. Di notebook, EAD didekati dengan LIMIT_BAL — penyederhanaan yang dinyatakan eksplisit, bukan disembunyikan.",
        "Nilai: lima pelamar [lab] — A (PD 0,05, EAD Rp100.000.000): EL Rp2.250.000. B (PD 0,10, EAD Rp50.000.000): EL Rp2.250.000 — sama dengan A, meski PD-nya dua kali lipat, karena EAD-nya setengah. C (PD 0,20, EAD Rp200.000.000): EL Rp18.000.000. D (PD 0,35, EAD Rp80.000.000): EL Rp12.600.000. E (PD 0,60, EAD Rp120.000.000): EL Rp32.400.000. Total EL lima pelamar: Rp67.500.000. Pelajaran A vs B: PD saja tidak menentukan risiko — EAD ikut menentukan.",
        "Baik atau buruk: EL bagus bila dipakai membandingkan keputusan — «menyetujui C (EL Rp18 juta) vs menolak C dan kehilangan margin» — bukan sebagai ramalan per nasabah. Buruk bila dibaca sebagai «nasabah ini akan merugikan Rp18 juta» — EL adalah nilai harapan, bukan tagihan.",
        "Mitigasi: selalu laporkan EL beserta komponennya (PD, LGD, EAD) — bukan EL saja. Bila EL naik, pembaca harus bisa melihat apakah penyebabnya PD, LGD, atau EAD — karena obatnya berbeda untuk tiap penyebab.",
        "LGD sebagai model regresi — bukan sekadar asumsi 45 persen. LGD hanya teramati untuk akun yang DEFAULT: dari 30.000 nasabah UCI, hanya 6.636 yang punya LGD teramati — dan UCI bahkan tidak punya data recovery-nya sama sekali, jadi LGD tidak bisa dilatih di notebook ini. Targetnya adalah recovery rate (berapa persen exposure yang kembali) atau LGD-nya (1 − recovery/EAD). Tiga masalah yang membuat LGD sulit dimodelkan: zero/one-inflation — banyak akun LGD-nya tepat 0 (recovery penuh) atau tepat 1 (tidak ada yang kembali), sehingga distribusinya menumpuk di kedua ujung; censoring — recovery masih berjalan saat diamati, jadi LGD finalnya belum diketahui; dan seleksi — akun yang default bukan sampel acak. Contoh: exposure Rp10.000.000, recovery Rp5.500.000 → LGD = 1 − 5.500.000/10.000.000 = 45 persen.",
        "EAD sebagai model regresi — bedakan tiga angka yang sering dicampur: limit (plafon yang disetujui), current balance (saldo saat ini), dan exposure at default (saldo saat default terjadi — yang dipakai EL). Untuk revolving credit, nasabah menarik dana tambahan menjelang default, jadi EAD > saldo saat ini. Jembatannya adalah credit conversion factor (CCF): EAD = saldo + CCF × (limit − saldo). Contoh: limit Rp10.000.000, saldo Rp6.000.000, EAD Rp8.000.000 → CCF = (8.000.000 − 6.000.000) / (10.000.000 − 6.000.000) = 50 persen — separuh dari sisa limit yang belum terpakai ikut tertarik sebelum default.",
        "Contoh kerja — sepuluh akun sintetis [ilustrasi] (limit/saldo/EAD/recovery dalam Rp jt): (1) 10/6,0/8,0/4,4 → LGD 0,45, CCF 0,50; (2) 20/15,0/18,0/9,0 → 0,50/0,60; (3) 5/4,0/5,0/5,0 → 0,00/1,00; (4) 50/10,0/20,0/2,0 → 0,90/0,25; (5) 30/0/5,0/0 → 1,00/0,17; (6) 15/12,0/13,5/13,5 → 0,00/0,50; (7) 8/7,0/8,0/1,6 → 0,80/1,00; (8) 100/40,0/60,0/30,0 → 0,50/0,33; (9) 12/3,0/6,0/6,0 → 0,00/0,33; (10) 25/20,0/25,0/10,0 → 0,60/1,00. LGD portofolio tertimbang EAD = 0,5163 — dari total EAD Rp168,5 jt dan recovery Rp81,5 jt (dibulatkan Rp168 jt dan Rp82 jt). Perhatikan akun 3 dan 6: LGD 0 — recovery penuh — dan akun 5: LGD 1,00 dengan saldo 0 — kartu yang tidak pernah dipakai lalu default penuh. Inilah zero/one-inflation dalam bentuk tabel: tiga akun LGD 0, satu akun LGD 1, dari sepuluh akun.",
        "Evaluasi model regresi LGD/EAD berbeda dari klasifikasi: tidak ada ROC-AUC di sini. Untuk EAD, pakai MAE/RMSE — dan weighted error berbasis exposure, karena meleset Rp10 juta pada exposure Rp100 juta jauh lebih mahal daripada meleset yang sama pada exposure Rp1 juta. Untuk LGD, pakai calibration bucket: kelompokkan prediksi LGD per desil, bandingkan dengan LGD aktual tiap bucket — sama seperti reliability diagram PD. Dan tegaskan sekali lagi: pada UCI, LGD 45 persen dan EAD = LIMIT_BAL adalah ILUSTRASI/PROXY, bukan estimasi produksi — notebook tidak punya recovery cash flow untuk melatih LGD, dan tidak punya utilization-at-default untuk melatih EAD.",
        "Horizon PD — satu kohort, tiga angka yang berbeda. Ambil kohort sintetis 1.000 akun [ilustrasi] dengan default bulanan m1 sampai m12 = [20, 18, 15, 14, 13, 12, 11, 10, 9, 8, 10, 10] — total 150 default. PD 1 bulan = 20/1.000 = 0,0200. PD 12 bln = 150/1.000 = 0,1500. Dan 12 × PD 1 bulan = 0,2400 — SALAH sebagai PD 12 bln: ia menghitung 20 default per bulan selama 12 bulan, padahal pool-nya menyusut (yang sudah default tidak bisa default lagi) dan hazard-nya berubah. PD lifetime — bila 70 akun lagi default setelah bulan ke-12 sampai maturity — menjadi (150 + 70)/1.000 = 0,2200.",
        "Kurva survival-nya menjelaskan kenapa: S(1) = 0,980, S(3) = 0,947, S(8) = 0,887, S(12) = 0,850 — dari 1.000 akun, 850 masih bertahan setelah 12 bulan. Hazard (peluang default bulan itu, di antara yang masih bertahan): bulan 1 = 20/1.000 = 0,0200; bulan 12 = 10/850 = 0,0118. Hazard MENURUN karena survivor terseleksi: yang paling berisiko sudah default duluan, yang tersisa adalah yang lebih kuat. Inilah alasan PD lifetime bukan perkalian PD 1 bulan — dan alasan Stage 2 IFRS 9 (M2.4) memakai PD lifetime, bukan PD 12 bln yang dikali.",
      ],
      formula: String.raw`EL = PD \times LGD \times EAD, \quad EL_{portofolio} = \sum_i PD_i \times LGD_i \times EAD_i`,
      formulaNote: "Expected loss satu nasabah adalah perkalian ketiganya; expected loss portofolio adalah jumlah EL tiap nasabah. LGD 45 persen di lesson ini adalah asumsi [ilustrasi] dari notebook.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Alur LGD dan EAD serta kurva survival kohort 1.000 akun: S(1) 0,980; S(3) 0,947; S(8) 0,887; S(12) 0,850">
<text x="240.0" y="14" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Alur LGD &amp; EAD — lalu kurva survival kohort</text>
<rect x="52" y="28" width="88" height="22" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="96" y="43" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Disetujui</text>
<line x1="140" y1="39" x2="158" y2="39" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="158,39 151,35 151,43" fill="var(--chart-text)"/>
<rect x="160" y="28" width="88" height="22" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="204" y="43" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Default</text>
<line x1="248" y1="39" x2="266" y2="39" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="266,39 259,35 259,43" fill="var(--chart-text)"/>
<rect x="268" y="28" width="88" height="22" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="312" y="43" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Recovery</text>
<line x1="356" y1="39" x2="374" y2="39" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="374,39 367,35 367,43" fill="var(--chart-text)"/>
<rect x="376" y="28" width="88" height="22" rx="6" fill="none" stroke="var(--c4)" stroke-width="1.5"/>
<text x="420" y="43" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">LGD</text>
<text x="240" y="64" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">LGD = 1 − recovery / EAD</text>
<rect x="52" y="72" width="88" height="22" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="96" y="87" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Limit</text>
<line x1="140" y1="83" x2="158" y2="83" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="158,83 151,79 151,87" fill="var(--chart-text)"/>
<rect x="160" y="72" width="88" height="22" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="204" y="87" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Saldo</text>
<line x1="248" y1="83" x2="266" y2="83" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="266,83 259,79 259,87" fill="var(--chart-text)"/>
<rect x="268" y="72" width="88" height="22" rx="6" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="312" y="87" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Undrawn × CCF</text>
<line x1="356" y1="83" x2="374" y2="83" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="374,83 367,79 367,87" fill="var(--chart-text)"/>
<rect x="376" y="72" width="88" height="22" rx="6" fill="none" stroke="var(--c4)" stroke-width="1.5"/>
<text x="420" y="87" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">EAD</text>
<text x="240" y="108" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">EAD = saldo + CCF × (limit − saldo)</text>
<text x="240" y="126" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kurva survival kohort 1.000 akun [ilustrasi]</text>
<line x1="52" y1="140" x2="52" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="210" x2="466" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="210.0" x2="52" y2="210.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="213.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,80</text>
<line x1="48" y1="192.5" x2="52" y2="192.5" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="195.5" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,85</text>
<line x1="48" y1="175.0" x2="52" y2="175.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="178.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,90</text>
<line x1="48" y1="157.5" x2="52" y2="157.5" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="160.5" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,95</text>
<line x1="48" y1="140.0" x2="52" y2="140.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="143.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,00</text>
<line x1="52.0" y1="210" x2="52.0" y2="214" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="155.5" y1="210" x2="155.5" y2="214" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<line x1="259.0" y1="210" x2="259.0" y2="214" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<line x1="362.5" y1="210" x2="362.5" y2="214" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">9</text>
<line x1="466.0" y1="210" x2="466.0" y2="214" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">12</text>
<polyline points="52.0,140.0 86.5,147.0 155.5,158.6 328.0,179.6 466.0,192.5" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="86.5" cy="147.0" r="4" fill="var(--c2)"/>
<text x="86.5" y="139.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S(1)=0,980</text>
<circle cx="155.5" cy="158.6" r="4" fill="var(--c2)"/>
<text x="155.5" y="150.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S(3)=0,947</text>
<circle cx="328.0" cy="179.6" r="4" fill="var(--c2)"/>
<text x="328.0" y="171.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S(8)=0,887</text>
<circle cx="466.0" cy="192.5" r="4" fill="var(--c2)"/>
<text x="462" y="184.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S(12)=0,850</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">bulan sejak observasi</text>
</svg>`,
        alt: "Alur LGD dan EAD serta kurva survival kohort 1.000 akun: S(1) 0,980; S(3) 0,947; S(8) 0,887; S(12) 0,850.",
        caption: "Cara membaca: panel atas = dua alur (default → recovery → LGD; limit → saldo → EAD lewat CCF); panel bawah = survival S(t), makin lama makin sedikit yang bertahan. Interpretasi: LGD dan EAD adalah regresi atas akun yang default; PD 12 bln (0,1500) bukan 12 × PD 1 bulan (0,2400) karena pool menyusut dan hazard menurun.",
      },
      tasks: [],
    },
    {
      id: "kalibrasi",
      eyebrow: "Langkah 4 · Kalibrasi",
      title: "Kalibrasi: apakah PD 0,20 benar-benar berarti 20 persen?",
      prose: [
        "Model yang ranking-nya bagus belum tentu jujur. ROC-AUC hanya mengukur urutan — ia tidak peduli apakah PD 0,20 benar-benar berarti 20 persen. Kalibrasi mengukur kejujuran itu: kelompokkan nasabah per desil PD prediksi, lalu bandingkan PD rata-rata tiap desil dengan default rate aktualnya.",
        "Nilai: reliability diagram GBM terkalibrasi pada test set 6.000 nasabah [notebook] — desil 1: PD 0,0449, aktual 0,0417. Desil 5: 0,1379 vs 0,1250. Desil 10: 0,6967 vs 0,7000. Sepuluh titik, semuanya menempel garis diagonal «kalibrasi sempurna» — selisih terbesar hanya 0,0181 (desil 6: 0,1636 vs 0,1817). Inilah yang dimaksud probabilitas yang jujur.",
        "Gambar di bawah adalah diagram itu: sumbu X PD prediksi rata-rata per desil, sumbu Y default teramati, garis putus-putus adalah kalibrasi sempurna. Titik yang di atas garis berarti model meremehkan risiko (aktual lebih tinggi dari prediksi); di bawah garis berarti model melebih-lebihkan.",
        "Sekarang kejujuran tentang Brier score — dan ini penting. Brier GBM mentah 0,1342; GBM terkalibrasi 0,1345 [notebook]. Kalibrasi nyaris TIDAK mengubah Brier — bahkan sedikit memburuk. Jangan pernah membaca «skor Brier yang kecil berarti probabilitasnya jujur»: Brier mencampur ranking dan kalibrasi menjadi satu angka, sehingga perbaikan kalibrasi bisa tertutup perubahan ranking. Yang membaik dari kalibrasi adalah selisih desil terbesar terkalibrasi 0,0181. Untuk menilai kalibrasi, baca reliability diagram — bukan Brier.",
        "Baik atau buruk: kalibrasi bagus bila diukur per desil pada data yang belum dilihat model — desil 10 dengan PD 0,6967 vs aktual 0,7000 adalah bukti yang kuat karena n per desil 600. Buruk bila diukur pada data latih: model yang sudah melihat datanya akan tampak kalibrasi dengan sendirinya.",
        "Mitigasi: kalibrasi dengan Platt scaling (sigmoid) atau isotonic regression pada data validasi — seperti yang dilakukan notebook — lalu verifikasi pada test set. Dan ulangi tiap kali populasi berubah: kalibrasi adalah janji yang kedaluwarsa.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Reliability diagram 10 desil: titik-titik GBM terkalibrasi menempel garis diagonal kalibrasi sempurna">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Reliability diagram: GBM terkalibrasi (test 6.000)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,8</text>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,8</text>
<line x1="52" y1="206" x2="466.0" y2="30.0" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="372.8" y="52.0" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">kalibrasi sempurna</text>
<polyline points="75.2,196.8 87.1,190.6 99.6,185.5 111.6,180.0 123.4,178.5 136.7,166.0 156.1,164.6 194.4,147.7 270.9,111.8 412.5,52.0" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="75.2" cy="196.8" r="5" fill="var(--c1)"/>
<circle cx="87.1" cy="190.6" r="5" fill="var(--c1)"/>
<circle cx="99.6" cy="185.5" r="5" fill="var(--c1)"/>
<circle cx="111.6" cy="180.0" r="5" fill="var(--c1)"/>
<circle cx="123.4" cy="178.5" r="5" fill="var(--c1)"/>
<circle cx="136.7" cy="166.0" r="5" fill="var(--c1)"/>
<circle cx="156.1" cy="164.6" r="5" fill="var(--c1)"/>
<circle cx="194.4" cy="147.7" r="5" fill="var(--c1)"/>
<circle cx="270.9" cy="111.8" r="5" fill="var(--c1)"/>
<circle cx="412.5" cy="52.0" r="5" fill="var(--c1)"/>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">PD prediksi rata-rata per desil</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">default teramati</text>
</svg>`,
        alt: "Reliability diagram 10 desil: titik-titik GBM terkalibrasi menempel garis diagonal kalibrasi sempurna.",
        caption: "Cara membaca: X PD prediksi rata-rata per desil, Y default teramati; garis putus-putus = kalibrasi sempurna. Interpretasi: sepuluh titik menempel diagonal — selisih terbesar 0,0181 (desil 6).",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: Brier rendah berarti probabilitas jujur",
        type: "pitfall",
        body: "Yang benar: Brier mencampur ranking dan kalibrasi. Di notebook, selisih desil terbesar setelah kalibrasi adalah 0,0181, sementara Brier nyaris tidak bergerak (0,1342 → 0,1345). Nilai kalibrasi dari reliability diagram, bukan dari satu angka Brier.",
      },
    },
    {
      id: "threshold",
      eyebrow: "Langkah 5 · Threshold bisnis",
      title: "Threshold 0,10: akurasi 0,4682 yang keputusannya benar",
      prose: [
        "Probabilitas yang jujur belum menjadi keputusan — keputusan lahir saat probabilitas dipotong threshold. Notebook memakai threshold 0,10: PD di bawah 0,10 disetujui, di atasnya ditolak atau diperiksa. Threshold ini bukan default 0,5 — ia dipilih dari biaya.",
        "Nilai: confusion matrix GBM terkalibrasi pada threshold 0,10, test set 6.000 nasabah [notebook] — TP 1.213, FP 3.077, TN 1.596, FN 114. Precision 0,2828 (dari semua yang diprediksi default, 28 persen benar-benar default). Recall 0,9141 (dari semua default aktual, 91 persen tertangkap). F1 0,4319. Akurasi 0,4682.",
        "Akurasi 0,4682 — di bawah 50 persen, lebih buruk dari tebak acak? Bukan kegagalan — melainkan harga dari biaya yang asimetris. Threshold 0,10 sengaja rendah: ia menangkap 91 persen default (recall 0,9141) dengan harga 3.077 false positive. False positive berarti menolak nasabah yang sebenarnya lancar — kehilangan margin. False negative berarti menyetujui nasabah yang default — kehilangan LGD × EAD, yang jauh lebih besar. Bila satu default merugikan sembilan kali satu margin yang hilang, threshold rendah adalah keputusan yang benar meski akurasinya tampak buruk.",
        "Tabel kebijakan membuktikan threshold ini [notebook] — threshold 0,10: approval 0,285, bad rate 0,0667, EL NT$11.989.453, profit NT$8.214.000. Threshold 0,15: approval 0,499, bad rate 0,0899, EL NT$23.813.003, profit NT$5.490.500. Threshold 0,20: approval 0,651, bad rate 0,1113, EL NT$33.683.252, profit −NT$216.500. Profit maksimal di 0,10 — menaikkan threshold menaikkan approval (+128%), tapi EL naik lebih cepat (+181%) dan bad rate ikut naik (+67%) sehingga profit jatuh.",
        "Tabel yang sama, ditambah satu kolom — dampak fairness [M7.1]. Threshold 0,10: approval 28,5%, bad rate 6,67%, profit +NT$8.214.000, AIR (SEX) 0,8694. Threshold 0,15: approval 49,9%, bad 8,99%, profit +NT$5.490.500, AIR 0,8906. Threshold 0,20: approval 65,1%, bad 11,13%, profit −NT$216.500, AIR 0,9432. Threshold 0,50: approval 88,05%, bad 15,96%, profit −NT$18.994.456, AIR 0,9898. Bacanya: di keempat baris ini, menaikkan threshold menaikkan approval DAN bad rate, dan profit TURUN — tapi AIR justru MEMBAIK (mendekati 1,00), karena makin banyak nasabah dari kedua grup disetujui. Profit-max (0,10) adalah titik AIR TERBURUK di antara keempatnya — dan itulah mengapa tabel kebijakan yang hanya berisi profit adalah simulator yang belum lengkap: angka fairness-nya dihitung di M7.1, dan cara memperbaikinya (threshold per-grup) di M7.4. Versi interaktif tabel ini — geser threshold, lihat keempat kolom bergerak — ada di Colab (policy simulator).",
        "Gambar di bawah menunjukkan profit vs threshold: dua batang hijau (untung), satu batang merah (rugi). Titik baliknya antara 0,15 dan 0,20 — di situlah biaya default menyalip margin.",
        "Baik atau buruk: threshold bagus bila dipilih dari tabel kebijakan dengan biaya yang eksplisit — bukan dari kebiasaan «0,5 itu netral». Buruk bila threshold disalin dari bank lain tanpa menghitung ulang: biaya dan populasi tiap bank berbeda.",
        "Mitigasi: hitung ulang tabel kebijakan tiap kali model, populasi, atau biaya berubah — dan laporkan selalu approval rate dan bad rate di samping profit, supaya keputusan tidak hanya dibaca dari uangnya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar profit vs threshold: 0,10 untung NT$8.214.000; 0,15 untung NT$5.490.500; 0,20 rugi NT$216.500">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Profit vs threshold — threshold naik, profit jatuh</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−5 jt</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5 jt</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10 jt</text>
<line x1="52" y1="147.3" x2="466" y2="147.3" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="86.5" y="51.0" width="69.0" height="96.4" fill="var(--c3)"/>
<text x="121.0" y="45.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+8,2 jt</text>
<line x1="121.0" y1="206" x2="121.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="121.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<text x="121.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">approval 0,285</text>
<rect x="224.5" y="82.9" width="69.0" height="64.4" fill="var(--c3)"/>
<text x="259.0" y="76.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+5,5 jt</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,15</text>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">approval 0,499</text>
<rect x="362.5" y="147.3" width="69.0" height="2.5" fill="var(--c4)"/>
<text x="397.0" y="163.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,2 jt</text>
<line x1="397.0" y1="206" x2="397.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="397.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<text x="397.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">approval 0,651</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">threshold (test set 6.000 nasabah)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">profit (NT$)</text>
</svg>`,
        alt: "Bar profit vs threshold: 0,10 untung NT$8.214.000; 0,15 untung NT$5.490.500; 0,20 rugi NT$216.500.",
        caption: "Cara membaca: tinggi bar = profit pada test set 6.000 nasabah; garis nol memisahkan untung dan rugi. Interpretasi: profit maksimal di threshold 0,10; di 0,20 sudah negatif.",
      },
      tasks: [],
    },
    {
      id: "biaya",
      eyebrow: "Langkah 6 · Biaya kesalahan",
      title: "False negative vs false positive: dua kesalahan, dua harga",
      prose: [
        "Threshold 0,10 menangkap 91 persen default — tapi 114 default masih lolos (FN). Berapa harga 114 nasabah itu? Tiap FN berarti EL yang tidak dicegah: PD × LGD × EAD yang akhirnya terjadi. Sebaliknya 3.077 FP berarti 3.077 nasabah lancar yang ditolak — tiap penolakan kehilangan margin yang seharusnya didapat.",
        "Nilai: stress test notebook [notebook] menunjukkan seberapa cepat EL bergerak bila kondisi memburuk — baseline EL NT$78.675.378; skenario Adverse (tiap nasabah telat 1 bulan lebih lama) EL NT$117.257.049 (+49,0 persen); skenario Severe (+2 bulan) EL NT$231.440.183 (+194,2 persen). EL bukan angka statis — ia sensitif terhadap kondisi, dan threshold yang benar di kondisi normal bisa salah di kondisi buruk.",
        "Aturan memilih threshold yang benar: naikkan threshold selama margin dari nasabah tambahan yang disetujui masih lebih besar dari EL tambahan yang mereka bawa; berhenti saat keduanya sama. Itulah titik optimal — dan tabel kebijakan di langkah 5 adalah cara menghitungnya tanpa rumus.",
        "Baik atau buruk: analisis biaya bagus bila kedua harga ditulis eksplisit — margin per nasabah lancar dan kerugian per nasabah default. Buruk bila hanya satu sisi dihitung: bank yang hanya menghitung kerugian akan menolak semua orang; bank yang hanya menghitung margin akan menyetujui semua orang.",
        "Mitigasi: tetapkan biaya FN dan FP bersama tim bisnis — bukan bersama tim model. Tim model mengukur probabilitas; tim bisnis yang tahu berapa harga satu nasabah yang ditolak dan satu default yang lolos.",
        "Threshold tidak harus biner — ia bisa menjadi policy matrix. Empat perlakuan bertingkat pada test set, GBM terkalibrasi [notebook]: A — PD < 0,05, approve penuh: n = 421, mean PD 0,0415, EL NT$2.497.992, profit NT$4.046.953. B — PD 0,05–0,10, approve dengan limit 50%: n = 1.289, mean PD 0,0746, EL penuh NT$9.491.461 / profit NT$3.840.432, EL 50% NT$4.745.730 / profit NT$1.920.216. C — PD 0,10–0,20, manual review (di sini: ditolak): n = 2.198, mean PD 0,1443, EL penuh NT$21.693.799 / profit −NT$7.089.721. D — PD > 0,20, reject: n = 2.092, mean PD 0,4300, EL penuh NT$44.992.127 / profit −NT$37.825.868.",
        "Total policy (A penuh + B 50% + C/D reject): EL NT$7.243.723, profit NT$5.967.169 — vs threshold tunggal 0,10: EL NT$11.989.453, profit NT$7.887.385. Sajikan dengan jujur: policy matrix MENURUNKAN EL (7,24 jt vs 11,99 jt) TAPI juga menurunkan profit (5,97 jt vs 7,89 jt). Nilainya bukan maksimasi profit — melainkan kontrol risiko dan graduated treatment: nasabah menengah tidak langsung ditolak, melainkan diberi limit lebih kecil; nasabah berisiko tinggi tidak disetujui dengan limit penuh. Dua ekstremnya menjelaskan kenapa: bila C semuanya ditolak, EL 0 dan profit 0 — aman tapi tidak ada bisnis; bila C semuanya disetujui penuh, EL NT$21.693.799 dan profit −NT$7.089.721 — bisnisnya merugi. Policy matrix adalah jalan tengah yang dihitung, bukan ditebak.",
        "Mini-case tiga pelamar baru — sebut saja Q1, Q2, Q3 [ilustrasi] — PD dan EAD berbeda, perlakuan berbeda. Q1: PD 0,04, EAD Rp100.000.000 → policy A (approve penuh): EL = 0,04 × 0,45 × 100.000.000 = Rp1.800.000. Q2: PD 0,08, EAD Rp50.000.000 → policy B (limit 50%): EL penuh Rp1.800.000, EL dengan limit 50% Rp900.000 — memotong limit separuh memotong EL separuh. Q3: PD 0,15, EAD Rp200.000.000 → policy C (review): EL penuh = 0,15 × 0,45 × 200.000.000 = Rp13.500.000 — terlalu besar untuk disetujui otomatis; masuk antrean review manual, dan bila ditolak EL-nya 0 dengan harga kehilangan marginnya. Perhatikan Q1 vs Q2: EL penuhnya sama persis (Rp1.800.000) meski PD-nya berbeda dua kali lipat — karena EAD Q2 setengah EAD Q1. Policy matrix yang baik membaca EL, bukan PD saja.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Tabel policy matrix: A PD di bawah 0,05 approve penuh; B 0,05-0,10 limit 50 persen; C 0,10-0,20 review; D di atas 0,20 reject">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Policy matrix: PD → perlakuan → EL &amp; profit</text>
<text x="70" y="44" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Policy</text>
<text x="150" y="44" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PD</text>
<text x="240" y="44" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Perlakuan</text>
<text x="330" y="44" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EL</text>
<text x="424" y="44" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Profit</text>
<line x1="52" y1="52" x2="466" y2="52" stroke="var(--chart-text)" stroke-width="1"/>
<text x="70" y="76" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A</text>
<text x="150" y="76" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">&lt; 0,05</text>
<text x="240" y="76" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">approve penuh</text>
<text x="330" y="76" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">2.497.992</text>
<text x="424" y="76" text-anchor="middle" font-size="11" fill="var(--c3)" font-family="var(--font-ui)" font-weight="600">+4.046.953</text>
<text x="70" y="102" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B</text>
<text x="150" y="102" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0,05–0,10</text>
<text x="240" y="102" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">limit 50%</text>
<text x="330" y="102" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">4.745.730</text>
<text x="424" y="102" text-anchor="middle" font-size="11" fill="var(--c3)" font-family="var(--font-ui)" font-weight="600">+1.920.216</text>
<text x="70" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">C</text>
<text x="150" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0,10–0,20</text>
<text x="240" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">review / reject</text>
<text x="330" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0 (ditolak)</text>
<text x="424" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0</text>
<text x="70" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">D</text>
<text x="150" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">&gt; 0,20</text>
<text x="240" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">reject</text>
<text x="330" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0 (ditolak)</text>
<text x="424" y="154" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0</text>
<line x1="52" y1="166" x2="466" y2="166" stroke="var(--chart-text)" stroke-width="1"/>
<text x="70" y="190" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Total</text>
<text x="150" y="190" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">A+B 50%</text>
<text x="240" y="190" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">C/D reject</text>
<text x="330" y="190" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">7.243.723</text>
<text x="424" y="190" text-anchor="middle" font-size="11" fill="var(--c3)" font-family="var(--font-ui)" font-weight="600">+5.967.169</text>
<text x="240" y="216" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">vs threshold tunggal 0,10: EL 11.989.453 · profit 7.887.385</text>
<text x="240" y="232" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Matrix menurunkan EL — tapi juga menurunkan profit. Nilainya kontrol risiko, bukan maksimasi profit.</text>
</svg>`,
        alt: "Tabel policy matrix: A PD di bawah 0,05 approve penuh; B 0,05-0,10 limit 50 persen; C 0,10-0,20 review; D di atas 0,20 reject.",
        caption: "Cara membaca: tiap baris = satu policy; EL dan profit dalam NT$ pada test set [notebook]. Interpretasi: total policy EL 7.243.723 dan profit 5.967.169 — EL lebih rendah dari threshold tunggal 0,10 (11.989.453), tapi profitnya juga lebih rendah (7.887.385).",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: kalkulator Expected Loss lima pelamar",
      prose: [
        "Lab pertama menghitung EL lima pelamar dengan LGD 45 persen [ilustrasi] — angka yang sama dengan yang dipakai lesson ini.",
        "Perhatikan pelamar A dan B: EL-nya sama persis (Rp2.250.000) meski PD B dua kali PD A — karena EAD B setengah EAD A. Inilah pelajaran lab ini: jangan menilai risiko dari PD saja.",
        "Total EL lima pelamar: Rp67.500.000 [lab]. Bila bank menyetujui kelimanya, inilah kerugian yang diharapkan — bukan yang pasti terjadi, melainkan rata-rata atas banyak portofolio seperti ini.",
        "Tugas keempat menghitung LGD dan CCF dari tabel sintetis 10 akun — bukan dari asumsi 45 persen: LGD = 1 − recovery/EAD, CCF = (EAD − saldo)/(limit − saldo), lalu LGD portofolio tertimbang EAD. Perhatikan akun 3 dan 6 (LGD 0 — recovery penuh) dan akun 5 (LGD 1 — tidak ada yang kembali): itulah zero/one-inflation yang dibahas di langkah 3.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi rumus EL = PD x LGD x EAD" },
        { id: "t2", text: "Jalankan dan baca EL tiap pelamar" },
        { id: "t3", text: "Bandingkan EL A dan B — kenapa sama?" },
        { id: "t4", text: "Hitung LGD dan CCF tiap akun dari tabel sintetis 10 akun, lalu LGD portofolio tertimbang EAD" },
      ],
      expected: "pelamar A: PD=0.05 EAD=Rp100000000 EL=Rp2250000\npelamar B: PD=0.10 EAD=Rp50000000 EL=Rp2250000\npelamar C: PD=0.20 EAD=Rp200000000 EL=Rp18000000\npelamar D: PD=0.35 EAD=Rp80000000 EL=Rp12600000\npelamar E: PD=0.60 EAD=Rp120000000 EL=Rp32400000\nEL portofolio (5 pelamar): Rp67500000\nakun 1: LGD=0.4500 CCF=0.5000\nakun 2: LGD=0.5000 CCF=0.6000\nakun 3: LGD=0.0000 CCF=1.0000\nakun 4: LGD=0.9000 CCF=0.2500\nakun 5: LGD=1.0000 CCF=0.1667\nakun 6: LGD=0.0000 CCF=0.5000\nakun 7: LGD=0.8000 CCF=1.0000\nakun 8: LGD=0.5000 CCF=0.3333\nakun 9: LGD=0.0000 CCF=0.3333\nakun 10: LGD=0.6000 CCF=1.0000\ntotal EAD: Rp168.5 jt, total recovery: Rp81.5 jt\nLGD portofolio tertimbang EAD: 0.5163",
      hints: [
        "EL = PD × LGD × EAD; LGD sudah didefinisikan 0,45 di atas.",
        "Format rupiah tanpa pemisah ribuan — samakan dengan expected.",
      ],
      code: {
        starter: `# (nama, PD, EAD) — LGD 45% untuk semua [ilustrasi]
apps = [("A", 0.05, 100000000), ("B", 0.10, 50000000), ("C", 0.20, 200000000),
        ("D", 0.35, 80000000), ("E", 0.60, 120000000)]
LGD = 0.45
total = 0.0
for name, pd, ead in apps:
    el = 0.0  # TODO: EL = PD x LGD x EAD
    total += el
    print(f"pelamar {name}: PD={pd:.2f} EAD=Rp{ead} EL=Rp{el:.0f}")
print(f"EL portofolio (5 pelamar): Rp{total:.0f}")

# --- Tugas 4: LGD & CCF dari tabel sintetis 10 akun (G2) ---
# (limit, saldo, EAD, recovery) dalam Rp jt [ilustrasi]
accounts = [(10, 6.0, 8.0, 4.4), (20, 15.0, 18.0, 9.0), (5, 4.0, 5.0, 5.0),
            (50, 10.0, 20.0, 2.0), (30, 0, 5.0, 0), (15, 12.0, 13.5, 13.5),
            (8, 7.0, 8.0, 1.6), (100, 40.0, 60.0, 30.0),
            (12, 3.0, 6.0, 6.0), (25, 20.0, 25.0, 10.0)]
tot_ead = 0.0
tot_rec = 0.0
lgd_w_num = 0.0
for i, (lim, sal, ead, rec) in enumerate(accounts, 1):
    lgd = 0.0  # TODO: LGD = 1 - recovery / EAD
    ccf = 0.0  # TODO: CCF = (EAD - saldo) / (limit - saldo)
    tot_ead += ead
    tot_rec += rec
    lgd_w_num += lgd * ead
    print(f"akun {i}: LGD={lgd:.4f} CCF={ccf:.4f}")
print(f"total EAD: Rp{tot_ead:.1f} jt, total recovery: Rp{tot_rec:.1f} jt")
lgd_w = 0.0  # TODO: LGD portofolio tertimbang EAD = jumlah(LGD x EAD) / total EAD
print(f"LGD portofolio tertimbang EAD: {lgd_w:.4f}")`,
        lockLines: 4,
        solution: `# (nama, PD, EAD) — LGD 45% untuk semua [ilustrasi]
apps = [("A", 0.05, 100000000), ("B", 0.10, 50000000), ("C", 0.20, 200000000),
        ("D", 0.35, 80000000), ("E", 0.60, 120000000)]
LGD = 0.45
total = 0.0
for name, pd, ead in apps:
    el = pd * LGD * ead
    total += el
    print(f"pelamar {name}: PD={pd:.2f} EAD=Rp{ead} EL=Rp{el:.0f}")
print(f"EL portofolio (5 pelamar): Rp{total:.0f}")

# --- Tugas 4: LGD & CCF dari tabel sintetis 10 akun (G2) ---
# (limit, saldo, EAD, recovery) dalam Rp jt [ilustrasi]
accounts = [(10, 6.0, 8.0, 4.4), (20, 15.0, 18.0, 9.0), (5, 4.0, 5.0, 5.0),
            (50, 10.0, 20.0, 2.0), (30, 0, 5.0, 0), (15, 12.0, 13.5, 13.5),
            (8, 7.0, 8.0, 1.6), (100, 40.0, 60.0, 30.0),
            (12, 3.0, 6.0, 6.0), (25, 20.0, 25.0, 10.0)]
tot_ead = 0.0
tot_rec = 0.0
lgd_w_num = 0.0
for i, (lim, sal, ead, rec) in enumerate(accounts, 1):
    lgd = 1 - rec / ead
    ccf = (ead - sal) / (lim - sal)
    tot_ead += ead
    tot_rec += rec
    lgd_w_num += lgd * ead
    print(f"akun {i}: LGD={lgd:.4f} CCF={ccf:.4f}")
print(f"total EAD: Rp{tot_ead:.1f} jt, total recovery: Rp{tot_rec:.1f} jt")
lgd_w = lgd_w_num / tot_ead
print(f"LGD portofolio tertimbang EAD: {lgd_w:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "total", value: 67500000, tol: 1, label: "`total` seharusnya Rp67.500.000", msg: "2.250.000 + 2.250.000 + 18.000.000 + 12.600.000 + 32.400.000 = 67.500.000." },
          { kind: "stdout_matches", task: "t2", pattern: "EL portofolio \\(5 pelamar\\): Rp67500000", label: "Output menampilkan EL portofolio Rp67.500.000", msg: "Format: EL portofolio (5 pelamar): Rp{total:.0f}." },
          { kind: "equal", task: "t4", name: "lgd_w", value: 0.5163, tol: 0.0001, label: "`lgd_w` seharusnya 0,5163", msg: "LGD portofolio tertimbang EAD = jumlah(LGD × EAD) / total EAD = 87,0 / 168,5 = 0,5163 — bukan rata-rata biasa LGD tiap akun." },
          { kind: "stdout_matches", task: "t4", pattern: "akun 5: LGD=1\\.0000 CCF=0\\.1667", label: "Output menampilkan akun 5 (LGD 1, CCF 0,1667)", msg: "Akun 5: saldo 0, EAD 5,0, recovery 0 — LGD 1,00, CCF (5−0)/(30−0) = 0,1667." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: sweep threshold pada 20 pelamar sintetis",
      prose: [
        "Lab kedua mensimulasikan tabel kebijakan pada 20 pelamar sintetis [ilustrasi] — PD acak (seed 7) dan default yang digambar dari PD itu. Ekonomi yang dipakai: margin Rp500.000 per nasabah lancar yang disetujui, kerugian Rp4.500.000 per nasabah default yang disetujui (LGD 45 persen × EAD Rp10.000.000).",
        "Hasilnya: threshold 0,10 → approval 0,20, bad rate 0,0000, profit Rp2.000.000. Threshold 0,30 → approval 0,50, bad rate 0,2000, profit −Rp5.000.000. Threshold 0,50 → approval 0,65, bad rate 0,3077, profit −Rp13.500.000 [lab]. Profit maksimal di threshold terendah — pola yang sama dengan notebook, meski angkanya berbeda.",
        "Baca hasil ini dengan benar: n = 20 adalah sampel yang sangat kecil. Bad rate 0,0000 pada threshold 0,10 bukan berarti «tidak ada risiko» — itu berarti 4 nasabah yang disetujui kebetulan semuanya lancar. Arahnya yang penting (threshold naik → profit turun), bukan angkanya. Di notebook dengan 6.000 nasabah, pola yang sama muncul dengan angka yang stabil.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi bad rate = default di antara yang disetujui / jumlah disetujui" },
        { id: "t2", text: "Lengkapi profit = margin per lancar - kerugian per default" },
        { id: "t3", text: "Jalankan dan tentukan threshold dengan profit tertinggi" },
      ],
      expected: "threshold 0.10: approval=0.20 bad_rate=0.0000 profit=Rp2000000\nthreshold 0.30: approval=0.50 bad_rate=0.2000 profit=Rp-5000000\nthreshold 0.50: approval=0.65 bad_rate=0.3077 profit=Rp-13500000",
      hints: [
        "Yang disetujui = pelamar dengan PD di bawah threshold.",
        "Profit = 500.000 × (disetujui dan lancar) − 4.500.000 × (disetujui dan default).",
      ],
      code: {
        starter: `import random

# 20 pelamar sintetis [ilustrasi]: (PD, default aktual)
rng = random.Random(7)
pool = []
for _ in range(20):
    pd = round(rng.uniform(0.02, 0.85), 2)
    default = 1 if rng.random() < pd else 0
    pool.append((pd, default))

# Ekonomi [ilustrasi]: margin Rp500.000 per lancar yang disetujui,
# kerugian Rp4.500.000 per default yang disetujui (LGD 45% x EAD Rp10 jt)
profits = []
for th in (0.10, 0.30, 0.50):
    appr = [(p, d) for p, d in pool if p < th]
    ar = len(appr) / len(pool)
    br = 0.0  # TODO: bad rate = default di antara yang disetujui / jumlah disetujui
    profit = 0  # TODO: margin per lancar - kerugian per default
    profits.append(profit)
    print(f"threshold {th:.2f}: approval={ar:.2f} bad_rate={br:.4f} profit=Rp{profit}")`,
        lockLines: 9,
        solution: `import random

# 20 pelamar sintetis [ilustrasi]: (PD, default aktual)
rng = random.Random(7)
pool = []
for _ in range(20):
    pd = round(rng.uniform(0.02, 0.85), 2)
    default = 1 if rng.random() < pd else 0
    pool.append((pd, default))

# Ekonomi [ilustrasi]: margin Rp500.000 per lancar yang disetujui,
# kerugian Rp4.500.000 per default yang disetujui (LGD 45% x EAD Rp10 jt)
profits = []
for th in (0.10, 0.30, 0.50):
    appr = [(p, d) for p, d in pool if p < th]
    ar = len(appr) / len(pool)
    br = sum(d for _, d in appr) / len(appr) if appr else 0.0
    profit = sum((500000 if d == 0 else -4500000) for _, d in appr)
    profits.append(profit)
    print(f"threshold {th:.2f}: approval={ar:.2f} bad_rate={br:.4f} profit=Rp{profit}")`,
        checks: [
          { kind: "equal", task: "t3", name: "profits", value: [2000000, -5000000, -13500000], label: "`profits` seharusnya [2000000, -5000000, -13500000]", msg: "Profit maksimal di threshold 0,10 — pola yang sama dengan notebook." },
          { kind: "stdout_matches", task: "t3", pattern: "threshold 0\\.10: approval=0\\.20 bad_rate=0\\.0000 profit=Rp2000000", label: "Output menampilkan threshold 0,10 dengan profit Rp2.000.000", msg: "Format: threshold {th:.2f}: approval={ar:.2f} bad_rate={br:.4f} profit=Rp{profit}." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: kapan threshold naik, kapan turun?",
      prose: [
        "Margin naik atau kerugian default turun? Threshold boleh naik — tiap persetujuan tambahan membawa untung lebih besar dari risikonya.",
        "Kondisi ekonomi memburuk (stress test: EL +49 persen di Adverse, +194 persen di Severe)? Threshold harus turun — EL tiap persetujuan naik, jadi lebih sedikit yang layak disetujui.",
        "Recall terlalu rendah (banyak default lolos)? Turunkan threshold — tangkap lebih banyak default, dengan harga lebih banyak false positive.",
        "Approval rate terlalu rendah (bank kehilangan pasar)? Naikkan threshold — tapi hanya bila tabel kebijakan menunjukkan profit ikut naik, bukan hanya approval.",
        "Model di-recalibrate? Hitung ulang tabel kebijakan — threshold lama belum tentu optimal untuk model baru.",
        "Champion–challenger: scorecard vs GBM — siapa yang dipakai bank? Bandingkan pada test set yang sama [notebook]: scorecard ROC-AUC 0,7248 vs LR 0,7426 vs GBM 0,7823. Ranking berkata GBM menang — tapi ranking bukan satu-satunya juri. Kalibrasi desil terburuk (|prediksi − aktual|): scorecard 0,1406 vs GBM terkalibrasi 0,0181 — scorecard bisa salah 14 poin persentase pada satu desil, GBM terkalibrasi hanya 1,8 poin. Scorecard dengan threshold approve ≥ 500: approval 0,7232, bad rate 0,1415, EL NT$46.382.448, profit −NT$9.140.169 — RUGI. Jangan klaim kebijakan ≥ 500 itu bagus: ia menyetujui 72 persen pelamar dengan bad rate 14 persen. Scorecard dengan threshold ≥ 520: approval 0,1972, bad rate 0,1057, EL NT$16.121.864, profit NT$2.179.202 — untung, tapi hanya menyetujui 1 dari 5 pelamar. Bandingkan GBM threshold 0,10: approval 0,2850, bad rate 0,0667, EL NT$11.989.453.",
        "Skor test: mean 504,0, min 437, maks 532 [notebook]. Pelajaran champion–challenger: scorecard butuh threshold-NYA SENDIRI, bukan 500. Angka 500 adalah skor dasar — bukan ambang keputusan. Ambang yang benar dicari dari tabel kebijakan (seperti threshold 0,10 untuk GBM), dan scorecard yang threshold-nya tidak pernah dicari akan kalah bukan karena modelnya buruk, melainkan karena ambangnya asal. Keputusan bank memakai GBM atau scorecard bukan soal ROC-AUC tertinggi — melainkan soal kombinasi ranking, kalibrasi, reason codes, fairness, dan biaya — dan perbandingan lengkapnya ditutup di M2.5.",
        "Peta M2.4 — apa yang menanti. Vintage dan roll-rate: bagaimana kohort menua dan tunggakan bermigrasi; lalu IFRS 9 staging dan ECL — expected loss yang dilaporkan ke regulator. Peta konsep saja — pengajaran penuhnya di lesson berikut.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar ROC-AUC test: scorecard 0,7248; LR 0,7426; GBM 0,7823">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Champion–challenger: ROC-AUC test — siapa paling jitu?</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="157.1" x2="52" y2="157.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="160.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="108.2" x2="52" y2="108.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="111.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="59.3" x2="52" y2="59.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="62.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<rect x="86.5" y="64.5" width="69.0" height="141.5" fill="var(--c2)"/>
<text x="121.0" y="58.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7248</text>
<line x1="121.0" y1="206" x2="121.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="121.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Scorecard</text>
<rect x="224.5" y="61.0" width="69.0" height="145.0" fill="var(--c1)"/>
<text x="259.0" y="55.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7426</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">LR</text>
<rect x="362.5" y="53.2" width="69.0" height="152.8" fill="var(--c3)"/>
<text x="397.0" y="47.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7823</text>
<line x1="397.0" y1="206" x2="397.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="397.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GBM</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">model (test set 6.000 nasabah)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">ROC-AUC test</text>
</svg>`,
        alt: "Bar ROC-AUC test: scorecard 0,7248; LR 0,7426; GBM 0,7823.",
        caption: "Cara membaca: tinggi bar = ROC-AUC test. Interpretasi: GBM menang ranking — tapi scorecard ≥ 500 merugi (profit −NT$9.140.169) dan kalibrasi desil terburuknya 0,1406 vs GBM 0,0181. Ranking saja tidak menentukan pemenang.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: tiga pelamar di bawah threshold 0,10",
      prose: [
        "Tiga pelamar dari M2.1 — dengan PD dari Lab 1 M2.1 [lab]: P1 PD 0,1741, P2 PD 0,9864, P3 PD 0,0000. Sekarang terapkan threshold notebook 0,10 — bukan 0,5 seperti di lab.",
        "P1: PD 0,1741 > 0,10 → ditolak (atau masuk antrean review manual). Di M2.1, P1 «lancar» pada threshold 0,5 dan «setujui bersyarat» dari perhitungan EL. Di bawah threshold 0,10, jawabannya berubah: tolak. Inilah pelajaran mini-case ini — «lancar» bukan sifat pelamar, melainkan hasil dari threshold yang dipilih. Threshold 0,5 dan 0,10 memberi jawaban berbeda untuk orang yang sama.",
        "P2: PD 0,9864 > 0,10 → ditolak. Tidak ada ambiguitas. P3: PD 0,0000 < 0,10 → disetujui. Keputusan akhirnya: 1 dari 3 disetujui — approval rate 0,333, dekat dengan approval rate notebook 0,285 pada threshold yang sama.",
        "Perhatikan: P1 ditolak di sini BUKAN karena ia pasti default — PD 0,1741 berarti peluang lancarnya masih 0,8259. Ia ditolak karena bank, dengan biaya yang dipakainya, memutuskan bahwa 17 persen risiko tidak sepadan dengan marginnya. Threshold adalah pernyataan tentang biaya bank — bukan vonis tentang karakter nasabah.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: kalibrasi dan threshold di data UCI",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m23-guided-task.ipynb.",
        "Di notebook itu kamu menghitung EL per nasabah dari PD, LGD, dan EAD di dataset UCI 30.000 nasabah, menggambar reliability diagram GBM terkalibrasi, membangun confusion matrix pada threshold 0,10, dan menyusun tabel kebijakan (approval, bad rate, EL, profit) untuk tiga threshold — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1GhqRy3AJl9APW93M0qhh3o1iZMphEXtC",
        "Jalur file notebook: colab/mlf-m23-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — di sana policy simulator dan stress test dijalankan penuh pada test set 6.000 nasabah.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: probabilitas menjadi uang",
      prose: [
        "Rangkuman: EL = PD × LGD × EAD — per nasabah dan per portofolio. Kalibrasi dibaca dari reliability diagram (selisih desil terbesar 0,0181), bukan dari Brier (0,1342 → 0,1345 nyaris tidak bergerak). Threshold 0,10: recall 0,9141, precision 0,2828, akurasi 0,4682 — dan profit maksimal NT$8.214.000. Threshold dipilih dari biaya, bukan dari kebiasaan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "PD 0,2, LGD 0,45, EAD Rp200.000.000. Berapa Expected Loss?",
          options: [
            { text: "Rp9.000.000", why: "Itu EL bila EAD-nya Rp100.000.000 — di sini EAD-nya dua kali lipat." },
            { text: "Rp18.000.000", why: "Benar: 0,2 × 0,45 × 200.000.000 = 18.000.000.", correct: true },
            { text: "Rp40.000.000", why: "Itu PD × EAD tanpa LGD — menganggap seluruh exposure hilang." },
            { text: "Rp90.000.000", why: "Itu LGD × EAD tanpa PD — kehilangan peluang defaultnya." },
          ],
        },
        {
          q: "Brier GBM mentah 0,1342, GBM terkalibrasi 0,1345. Apa artinya?",
          options: [
            { text: "Kalibrasi gagal — Brier memburuk", why: "Brier nyaris tidak bergerak (selisih 0,0003) — dan Brier bukan alat ukur kalibrasi." },
            { text: "Kalibrasi nyaris tidak mengubah Brier; nilai kalibrasi dari reliability diagram", why: "Benar: selisih desil terbesar terkalibrasi adalah 0,0181. Brier mencampur ranking dan kalibrasi, jadi jangan baca kalibrasi darinya.", correct: true },
            { text: "Model mentah lebih terkalibrasi", why: "Jangan pakai frasa itu — dan Brier 0,1342 vs 0,1345 bukan bukti kalibrasi mana pun." },
            { text: "Brier rendah membuktikan probabilitas jujur", why: "Itu miskonsepsi yang dibantah lesson ini: Brier rendah tidak sama dengan probabilitas jujur." },
          ],
        },
        {
          q: "Confusion matrix threshold 0,10: TP 1.213, FN 114. Berapa recall?",
          options: [
            { text: "0,2828", why: "Itu precision: TP dibagi (TP + FP)." },
            { text: "0,4682", why: "Itu akurasi: (TP + TN) dibagi total." },
            { text: "0,9141", why: "Benar: 1.213 dibagi (1.213 + 114) = 0,9141 — 91 persen default tertangkap.", correct: true },
            { text: "0,4319", why: "Itu F1: rata-rata harmonis precision dan recall." },
          ],
        },
        {
          q: "Threshold naik 0,10 → 0,20. Apa yang terjadi pada profit di notebook?",
          options: [
            { text: "Naik — makin banyak yang disetujui", why: "Approval memang naik (0,285 → 0,651, +128%), tapi EL naik lebih cepat (+181%) dan bad rate ikut naik (0,0667 → 0,1113, +67%) — profit jatuh dari NT$8.214.000 ke −NT$216.500." },
            { text: "Turun menjadi negatif (−NT$216.500)", why: "Benar: di 0,20 profit −NT$216.500 — biaya default menyalip margin.", correct: true },
            { text: "Tetap — threshold tidak memengaruhi profit", why: "Threshold adalah penentu profit terbesar kedua setelah model itu sendiri." },
            { text: "Naik — karena bad rate turun", why: "Bad rate justru naik (0,0667 → 0,1113) saat threshold naik." },
          ],
        },
        {
          q: "Desil 10 reliability diagram: PD 0,6967, aktual 0,7000. Apa artinya?",
          options: [
            { text: "Model meremehkan risiko di desil ini", why: "Selisihnya hanya 0,0033 — terlalu kecil untuk disebut meremehkan." },
            { text: "Model hampir sempurna di desil ini", why: "Benar: prediksi 0,6967 vs aktual 0,7000 — selisih 0,0033 pada n = 600.", correct: true },
            { text: "Model melebih-lebihkan risiko di desil ini", why: "Prediksi sedikit DI BAWAH aktual — bukan di atas." },
            { text: "Desil 10 tidak bisa dibaca — n terlalu kecil", why: "n per desil 600 — cukup besar untuk estimasi yang solid." },
          ],
        },
        {
          q: "Stress test Severe (+2 bulan telat): EL naik berapa persen dari baseline?",
          options: [
            { text: "+49,0 persen", why: "Itu skenario Adverse (+1 bulan): NT$117.257.049." },
            { text: "+194,2 persen", why: "Benar: NT$231.440.183 vs baseline NT$78.675.378 — hampir tiga kali lipat.", correct: true },
            { text: "+22,97 persen", why: "Itu EL Severe sebagai persen exposure — bukan kenaikan dari baseline." },
            { text: "+7,81 persen", why: "Itu EL baseline sebagai persen exposure." },
          ],
        },
        {
          q: "Confusion matrix threshold 0,10: TP 1.213, FP 3.077, TN 1.596, FN 114. Berapa precision dan specificity?",
          options: [
            { text: "Precision 0,9141, specificity 0,2363", why: "0,9141 adalah recall; 0,2363 adalah specificity LR (bukan GBM) pada threshold 0,10." },
            { text: "Precision 0,2828, specificity 0,3415", why: "Benar: precision = 1.213/(1.213 + 3.077) = 0,2828; specificity = 1.596/(1.596 + 3.077) = 0,3415.", correct: true },
            { text: "Precision 0,4682, specificity 0,9141", why: "0,4682 adalah akurasi; 0,9141 adalah recall." },
            { text: "Precision 0,6750, specificity 0,9501", why: "Itu precision dan specificity GBM terkalibrasi pada threshold 0,50, bukan 0,10." },
          ],
        },
        {
          q: "Threshold 0,10 memberi akurasi 0,4682 — di bawah 50 persen — tapi profit maksimal NT$8.214.000. Mengapa keduanya konsisten?",
          options: [
            { text: "Karena akurasinya salah hitung", why: "Akurasi 0,4682 benar: (1.213 + 1.596)/6.000 — yang salah adalah membacanya sebagai ukuran kebijakan." },
            { text: "Karena accuracy 0,4682 menghitung semua error sama; kebijakan mengoptimasi profit — FN jauh lebih mahal dari FP", why: "Benar: akurasi menghukum 3.077 FP sama beratnya dengan 114 FN, padahal satu default yang lolos (FN) merugikan berkali-kali satu margin yang hilang (FP).", correct: true },
            { text: "Karena profit dihitung dari model yang berbeda", why: "Profit dan akurasi dihitung dari model dan threshold yang sama — GBM terkalibrasi, threshold 0,10." },
            { text: "Karena threshold 0,10 sebenarnya optimal untuk akurasi", why: "Tidak — akurasi tertinggi ada di threshold 0,50 (0,8207); threshold 0,10 optimal untuk profit, bukan akurasi." },
          ],
        },
      ],
      summary: [
        "EL = PD × LGD × EAD; PD saja tidak menentukan risiko — EAD ikut menentukan (A vs B).",
        "Kalibrasi dibaca dari reliability diagram (selisih desil terbesar 0,0181); Brier 0,1342 → 0,1345 nyaris tidak bergerak.",
        "Threshold 0,10: TP 1.213, FP 3.077, TN 1.596, FN 114; recall 0,9141, precision 0,2828, akurasi 0,4682.",
        "Profit maksimal di threshold 0,10 (NT$8.214.000); di 0,20 negatif (−NT$216.500).",
        "Stress test: EL +49,0 persen (Adverse) dan +194,2 persen (Severe) dari baseline.",
        "LGD = 1 − recovery/EAD, EAD = saldo + CCF × (limit − saldo); LGD portofolio tertimbang EAD 0,5163 (10 akun sintetis).",
        "PD 12 bln (0,1500) bukan 12 × PD 1 bulan (0,2400); hazard menurun karena survivor terseleksi.",
        "Policy matrix menurunkan EL (7.243.723 vs 11.989.453) tapi juga menurunkan profit (5.967.169 vs 7.887.385) — nilainya kontrol risiko.",
        "Champion–challenger: GBM menang ranking (0,7823), tapi scorecard butuh threshold-nya sendiri — ≥ 500 merugi.",
      ],
      next: { label: "Lanjut: MLF-M2.4 — Vintage, Roll-Rate & IFRS 9", href: "/v2/learn/mlf-m24-vintage-rollrate-ifrs9" },
    },
  ],
};
