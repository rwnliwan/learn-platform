import type { V2Lesson } from "../lib/types";

export const mlfM72: V2Lesson = {
  slug: "mlf-m72-bias-audit-sources",
  track: "Machine Learning Finance",
  module: "Fairness, explainability & monitoring",
  title: "MLF-M7.2 — Sumber Bias dan Audit: Dari Mana Ketimpangan Itu Berasal",
  estMinutes: 90,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Satu model, dua cerita: siapa yang disetujui, siapa yang ditolak",
      prose: [
        "M7.1 sudah mengukur ketimpangannya: model yang sama, GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 — menyetujui laki-laki 26,1% dan perempuan 30,1%; menyetujui Pascasarjana 35,3%, Universitas 25,2%, SMA 20,9%, dan Lainnya 58,5%. Satu angka global — approval keseluruhan 28,5% — menyembunyikan keempat cerita itu. Lesson ini tidak mengulang pengukurannya. Lesson ini bertanya: DARI MANA ketimpangan itu berasal — dan bagaimana kamu membedakan ketimpangan yang nyata dari angka yang hanya tampak timpang?",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Approval berarti probabilitas default prediksi DI BAWAH threshold. ROC-AUC test GBM 0,7823, PR-AUC 0,5597. Grup diperiksa dengan definisi yang sama seperti M7.1: SEX (laki-laki n = 2.402, perempuan n = 3.598); EDUCATION (Pascasarjana n = 2.130, Universitas n = 2.774, SMA n = 1.014, Lainnya n = 82 — gabungan kode 0/4/5/6); MARRIAGE (Menikah n = 2.767, Lajang n = 3.158, Lainnya n = 75 — gabungan kode 0/3); AGE band (di bawah 30 tahun n = 1.912; 30–39 n = 2.198; 40–49 n = 1.341; 50–59 n = 473; 60+ n = 76). Semua angka audit di lesson ini dihitung pada test 6.000 yang sama.",
        "Peta lesson: taksonomi lima sumber bias → measurement bias (fitur dan label yang diukur berbeda + checklist kualitas data per grup) → tabel audit lengkap empat atribut → representation bias (grup kecil di train) → label bias (label historis) → selection bias (siapa yang masuk data) → aggregation bias (satu angka global menyembunyikan ketimpangan) → audit irisan: ketika dua atribut bertemu (SEX×EDUCATION, SEX×AGE) → workflow audit end-to-end → kapan selisih adalah noise dan kapan sinyal → ketidakpastian bootstrap: CI untuk gap fairness → 4 lab → checkpoint.",
        "Nilai: audit tanpa diagnosis sumber adalah vonis tanpa penyebab — kamu tahu ADA ketimpangan, tapi tidak tahu APA yang harus diperbaiki. Lima sumber bias di lesson ini adalah lima tempat berbeda untuk mencari penyebabnya: di pengukuran, di komposisi data, di label, di sampling, dan di agregasi. Setiap sumber punya bukti yang berbeda dan mitigasi yang berbeda — dan mencampuradukkannya adalah cara tercepat untuk memperbaiki hal yang salah.",
        "Baik atau buruk: angka global 28,5% itu bagus sebagai ringkasan bisnis — dan buruk sebagai bukti keadilan. Ia tidak berbohong, tapi ia menyembunyikan: selisih SEX 3,93 poin persen, selisih EDUCATION 37,63 poin persen (dari SMA 20,9% sampai Lainnya 58,5%), selisih AGE 13,38 poin persen (dari 60+ 19,7% sampai 30–39 tahun 33,1%). Model yang dilaporkan hanya dengan angka globalnya adalah model yang belum diaudit.",
        "Mitigasi: sebelum membaca satu pun angka grup, tulis dulu definisi grupmu (kode apa masuk grup mana, termasuk kode «lainnya» yang jarang) dan ambang keputusanmu (AIR di bawah 0,80 = flag, sebelum melihat angka). Tanpa keduanya, kamu akan memilih definisi grup dan ambang SESUDAH melihat angka — dan menemukan apa pun yang ingin kamu temukan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: menghapus kolom SEX membuat model adil",
        type: "pitfall",
        body: "Yang benar: model di lesson ini MEMAKAI SEX, EDUCATION, MARRIAGE, dan AGE sebagai fitur prediksi — koefisien LR: SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314 [notebook] — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357. Atribut sensitif memengaruhi keputusan lewat DUA jalur: langsung (kolomnya sendiri, bobot kecil) dan lewat proxy (limit, pola bayar, tagihan yang berkorelasi dengannya). Menghapus kolom sensitif dari fitur MENURUNKAN disparitas — AIR SEX 0,8694 → 0,9211 (M7.4) — tetapi TIDAK menuntaskannya: probe GBM masih memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261, dan AIR tetap di bawah 1,0. Buktinya ada di angka per grup, bukan di daftar fitur.",
      },
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Taksonomi lima sumber bias",
      title: "Lima tempat bias bersembunyi: ukur, wakili, labeli, pilih, agregasi",
      prose: [
        "Bias bukan satu hal — ia lima kegagalan yang berbeda, di lima tempat berbeda dalam pipeline. Measurement bias: fitur atau label DIUKUR berbeda antar grup — misal keterlambatan bayar tercatat lebih lengkap untuk satu grup daripada grup lain, atau limit kartu yang diberikan sudah mencerminkan keputusan manusia yang bias. Representation bias: satu grup TERLALU SEDIKIT di data latih — model hampir tidak pernah melihatnya, jadi prediksinya untuk grup itu ditebak dari grup lain. Label bias: label yang dipakai melatih model MENCERMINKAN keputusan manusia masa lalu yang bias — model mempelajari prasangka itu sebagai «pola». Selection bias (sampling bias): data yang kamu punya BUKAN populasi yang akan kamu layani — yang masuk dataset sudah melewati saringan (misal hanya nasabah yang DULU disetujui). Aggregation bias: satu metrik global MENYEMBUNYIKAN ketimpangan antar grup — model terlihat adil secara keseluruhan dan timpang di tiap grupnya (paradoks Simpson, langkah 8).",
        "Kelima sumber ini saling terkait tapi tidak sama — dan cara membedakannya adalah dengan bertanya DI MANA buktinya. Measurement bias dibuktikan dari DISTRIBUSI FITUR antar grup (langkah 3). Representation bias dibuktikan dari n PER GRUP di train (langkah 5). Label bias dibuktikan dari BASE RATE dan dari SEJARAH labelnya — dan sering kali TIDAK bisa dibuktikan dari data saja (langkah 6). Selection bias dibuktikan dari PERBANDINGAN POPULASI — siapa yang ada di data vs siapa yang akan dilayani (langkah 7). Aggregation bias dibuktikan dari STRATIFIKASI — angka global vs angka per strata (langkah 8).",
        "Nilai: taksonomi ini adalah daftar periksa penyebab — seperti daftar periksa dokter yang membedakan demam karena infeksi, karena obat, atau karena panas. Tanpa taksonomi, setiap ketimpangan dibaca sebagai «modelnya bias» — vonis yang benar secara moral tapi tidak berguna secara teknis, karena «modelnya bias» tidak memberitahu apakah yang harus diperbaiki adalah datanya, labelnya, sampling-nya, atau cara membacanya.",
        "Baik atau buruk: taksonomi lima sumber ini bagus karena tiap sumber punya UJI yang berbeda — kamu tidak perlu menebak, kamu bisa memeriksa. Buruk bila dibaca sebagai «pilih satu sumber dan salahkan ia»: dalam praktik, ketimpangan hampir selalu campuran — SMA di data ini (langkah 4) adalah contohnya: base rate-nya tertinggi, limitnya terendah, FPR-nya tertinggi, dan ECE-nya terburuk di antara grup besar. Itu bukan satu sumber — itu beberapa sumber yang menunjuk grup yang sama.",
        "Mitigasi: untuk setiap ketimpangan yang kamu temukan, tulis hipotesis sumbernya DENGAN uji yang akan membuktikan atau membantahnya — misal «bila ini representation bias, grup itu n-nya kecil di train; bila ini measurement bias, distribusi fiturnya berbeda antar grup». Audit yang baik adalah audit yang bisa SALAH — hipotesis yang bisa dibantah oleh angka.",
      ],
      tasks: [],
    },
    {
      id: "measurement-bias",
      eyebrow: "Langkah 3 · Measurement bias",
      title: "Measurement bias: ketika penggarisnya sendiri yang bengkok",
      prose: [
        "Measurement bias terjadi bila fitur atau label DIUKUR berbeda antar grup — bukan karena grupnya berbeda, melainkan karena ALAT UKURNYA berbeda. Contoh klasik di kredit: riwayat bayar tercatat lebih lengkap untuk nasabah dengan rekening lama; limit kartu (LIMIT_BAL) bukan «kemampuan bayar» yang netral — ia hasil keputusan manusia masa lalu tentang berapa limit yang «pantas» untuk orang seperti nasabah itu. Bila alat ukurmu sudah bias, model yang belajar dari alat ukur itu akan mewarisi biasnya — dan karena model tidak pernah melihat alat ukurnya, ia tidak bisa mengoreksinya sendiri.",
        "Nilai [notebook] — distribusi fitur per SEX di test 6.000 (fitur flagship, bukan fitur mentah): LIMIT_BAL rata-rata laki-laki NT$164.482 vs perempuan NT$170.286 — perempuan rata-rata punya limit LEBIH BESAR 3,5%. PAY_MEAN (rata-rata status bayar 6 bulan, makin negatif makin tepat waktu) laki-laki −0,1053 vs perempuan −0,2278 — perempuan rata-rata membayar LEBIH TEPAT WAKTU. UTILIZATION (tagihan pertama dibagi limit) laki-laki 0,4661 vs perempuan 0,3987. PAY_DELAY_COUNT (jumlah bulan dengan keterlambatan) laki-laki 0,8805 vs perempuan 0,7932. Keempat fitur menunjuk arah yang SAMA: pada fitur-fitur yang dipakai model, perempuan rata-rata tampak LEBIH RENDAH RISIKO — dan base rate-nya memang lebih rendah (laki-laki 0,2336 vs perempuan 0,2129 di test; 0,2417 vs 0,2078 di data penuh 30.000).",
        "Gambar: bayangkan dua penggaris — satu untuk tiap grup — yang salah satunya memendek 5% di ujungnya. Nasabah dari grup itu akan selalu terukur «lebih pendek» (lebih berisiko) daripada kenyataannya, tidak peduli seberapa bagus modelmu. Di data ini, arahnya justru sebaliknya untuk SEX: fitur-fitur perempuan tampak lebih baik — jadi measurement bias pada fitur TIDAK menjelaskan mengapa laki-laki lebih jarang disetujui; ia malah menjelaskan SEBAGIAN dari kesenjangan itu sebagai perbedaan risiko yang terukur, bukan sebagai bias model. Pertanyaan yang tersisa: apakah perbedaan fitur itu sendiri sudah adil — misal apakah limit perempuan yang lebih besar adalah hasil keputusan limit yang adil, atau justru kompensasi atas hal lain? Data ini tidak bisa menjawabnya — dan ketidakmampuan menjawab itu juga temuan (langkah 6).",
        "Baik atau buruk: perbedaan fitur antar grup itu bagus sebagai PENJELASAN PARSIAL — ia menunjukkan bahwa sebagian kesenjangan approval (laki-laki 26,1% vs perempuan 30,1%) bergerak seiring perbedaan risiko yang terukur (base rate laki-laki lebih tinggi 2,07 poin persen di test). Buruk bila dibaca sebagai «jadi tidak ada bias»: perbedaan risiko yang terukur dan bias pengukuran adalah dua hal yang bisa HIDUP BERSAMAAN — fitur bisa benar-benar berbeda antar grup DAN alat ukurnya bisa bengkok pada saat yang sama. Bukti yang membedakan keduanya bukan di data ini, melainkan di luar data: bagaimana limit ditetapkan, bagaimana keterlambatan dicatat, siapa yang memutuskan.",
        "Mitigasi: untuk tiap fitur penting, bandingkan distribusinya antar grup SEBELUM melatih — rata-rata, sebaran, dan proporsi nilai hilang. Bila satu fitur berbeda tajam antar grup, tanyakan: apakah fitur ini MENGUKUR risiko, atau MENGUKUR sejarah keputusan tentang grup itu? Fitur yang jawabannya «sejarah keputusan» (seperti limit yang diberikan manusia) adalah kandidat measurement bias — perlakukan ia dengan curiga, bukan sebagai kebenaran netral.",
        "Nilai [notebook] — checklist kualitas data per grup, dihitung dari data penuh 30.000 baris. (1) Nilai hilang: 0 di mana-mana — 0 NaN di semua 19 fitur utama (LIMIT_BAL, PAY_0..6, BILL_AMT1..6, PAY_AMT1..6), overall maupun per SEX/EDUCATION — dataset ini lengkap, tidak ada imputasi yang dibutuhkan. (2) Kategori invalid: EDUCATION kode 0/5/6 (di luar 1–4) = 345 baris (1,15%; kode mentah 0 = 14, 4 = 123, 5 = 280, 6 = 51) — dan 73,72% dari grup «Lainnya» EDUCATION adalah kode-kode ini, jadi grup Lainnya mencampur kode yang berbeda maknanya; MARRIAGE kode 0 = 54 baris (0,18%), terkonsentrasi di SMA (44 dari 54; 0,89% dari SMA). (3) Pelanggaran range: BILL_AMT negatif (salah satu dari 6) = 1.930 baris (6,43%; laki-laki 7,04% vs perempuan 6,03%; tertinggi Pascasarjana 8,50%) — plausibel sebagai kredit/kelebihan bayar, bukan error; PAY_AMT negatif = 0; LIMIT_BAL ≤ 0 = 0; AGE di luar 21–79 = 0. (4) Duplikat: 0 baris penuh termasuk ID; 35 baris (0,12%) duplikat di luar ID — baris kembar dari nasabah berbeda pada 24 kolom, kecil tapi patut dicurigai sebagai duplikasi pencatatan.",
        "Baik atau buruk: checklist ini bagus karena ia membedakan «data kotor» dari «data yang tampak kotor»: BILL_AMT negatif 6,43% tampak seperti error tapi plausibel — membersihkannya tanpa memahami artinya justru MERUSAK data. Buruk bila dibaca sebagai «0 missing berarti data bersih»: 345 baris kode invalid EDUCATION tidak muncul sebagai missing — ia muncul sebagai grup «Lainnya» yang tampak sah, dan audit yang tidak memeriksa kode mentahnya akan mengira Lainnya adalah satu grup yang homogen. Mitigasi: sebelum audit apa pun, jalankan checklist ini per grup — missingness, kategori invalid, pelanggaran range, duplikat, validitas timestamp — dan laporkan hasilnya di samping tabel audit. Fitur yang perlu investigasi di data ini: EDUCATION (kode invalid mencampur grup Lainnya) dan MARRIAGE (kode 0 terkonsentrasi di SMA).",
      ],
      formula: String.raw`\text{calibration gap}(g) = \bar{\hat{p}}_g - \bar{y}_g`,
      formulaNote: "Selisih kalibrasi per grup: rata-rata probabilitas prediksi di grup g dikurangi tingkat default aktual grup itu. Nilai positif = model melebih-lebihkan risiko grup itu; negatif = meremehkan. SMA −0,0114 (meremehkan sedikit); Lainnya EDUCATION +0,0455 dan Lainnya MARRIAGE +0,0656 (melebih-lebihkan — tapi keduanya n kecil, langkah 11).",
      figure: {
        svg: `<svg viewBox="0 0 520 220" role="img" aria-label="Heatmap kualitas data per grup: nilai hilang nol di mana-mana, kode invalid EDUCATION 73,72 persen di grup Lainnya, BILL_AMT negatif 5 sampai 8 persen">
<text x="260.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kualitas data per grup (%, data penuh 30.000 baris)</text>
<text x="175" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Laki</text>
<text x="227" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Perempuan</text>
<text x="279" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Pasca</text>
<text x="331" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Univ</text>
<text x="383" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">SMA</text>
<text x="435" y="40" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Lainnya</text>
<text x="144" y="64" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Nilai hilang (19 fitur)</text>
<rect x="150" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="202" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="254" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="306" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="358" y="48" width="50" height="24" fill="#e8f5e9"/><rect x="410" y="48" width="50" height="24" fill="#e8f5e9"/>
<text x="175" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="227" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="279" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="331" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="383" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="435" y="64" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="144" y="94" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Kode invalid EDUCATION</text>
<rect x="150" y="78" width="50" height="24" fill="#ffe082"/><rect x="202" y="78" width="50" height="24" fill="#ffe082"/><rect x="254" y="78" width="50" height="24" fill="#e8f5e9"/><rect x="306" y="78" width="50" height="24" fill="#e8f5e9"/><rect x="358" y="78" width="50" height="24" fill="#e8f5e9"/><rect x="410" y="78" width="50" height="24" fill="#c62828"/>
<text x="175" y="94" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">1,08%</text>
<text x="227" y="94" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">1,20%</text>
<text x="279" y="94" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="331" y="94" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="383" y="94" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="435" y="94" text-anchor="middle" font-size="9" fill="#ffffff" font-family="var(--font-ui)">73,72%</text>
<text x="144" y="124" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Kode invalid MARRIAGE (0)</text>
<rect x="150" y="108" width="50" height="24" fill="#fff9c4"/><rect x="202" y="108" width="50" height="24" fill="#fff9c4"/><rect x="254" y="108" width="50" height="24" fill="#fff9c4"/><rect x="306" y="108" width="50" height="24" fill="#fff9c4"/><rect x="358" y="108" width="50" height="24" fill="#fff9c4"/><rect x="410" y="108" width="50" height="24" fill="#e8f5e9"/>
<text x="175" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,12%</text>
<text x="227" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,22%</text>
<text x="279" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,04%</text>
<text x="331" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,04%</text>
<text x="383" y="124" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">0,89%</text>
<text x="435" y="124" text-anchor="middle" font-size="9" fill="#1b5e20" font-family="var(--font-ui)">0,0%</text>
<text x="144" y="154" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">BILL_AMT negatif</text>
<rect x="150" y="138" width="50" height="24" fill="#ffcc80"/><rect x="202" y="138" width="50" height="24" fill="#ffcc80"/><rect x="254" y="138" width="50" height="24" fill="#ffcc80"/><rect x="306" y="138" width="50" height="24" fill="#ffcc80"/><rect x="358" y="138" width="50" height="24" fill="#ffcc80"/><rect x="410" y="138" width="50" height="24" fill="#ffcc80"/>
<text x="175" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">7,04%</text>
<text x="227" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">6,03%</text>
<text x="279" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">8,50%</text>
<text x="331" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">5,18%</text>
<text x="383" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">5,47%</text>
<text x="435" y="154" text-anchor="middle" font-size="9" fill="#5d4037" font-family="var(--font-ui)">7,27%</text>
<text x="260" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Hijau 0% · kuning pucat &lt;1% · kuning 1–2% · oranye 5–9% · merah &gt;70%.</text>
<text x="260" y="204" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Duplikat di luar ID: 35 baris (0,12%) — tidak per grup, lihat prose. PAY_AMT negatif, LIMIT_BAL ≤ 0, AGE di luar 21–79: semuanya 0.</text>
</svg>`,
        alt: "Heatmap kualitas data per grup: nilai hilang nol di mana-mana, kode invalid EDUCATION 73,72 persen di grup Lainnya, BILL_AMT negatif 5 sampai 8 persen.",
        caption: "Cara membaca: tiap sel = persentase baris dalam grup itu yang terkena pemeriksaan tersebut. Nilai hilang 0% di mana-mana — dataset lengkap. Yang merah: 73,72% grup «Lainnya» EDUCATION adalah kode invalid 0/5/6 — grup itu mencampur kode yang berbeda maknanya. BILL_AMT negatif 5–9% di semua grup adalah kredit/kelebihan bayar yang plausibel, bukan error.",
      },
      tasks: [],
      note: {
        title: "Perbedaan fitur bukan bukti tidak ada bias",
        type: "risk",
        body: "Perempuan tampak lebih rendah risiko pada keempat fitur (limit lebih besar, bayar lebih tepat waktu, utilisasi lebih rendah, keterlambatan lebih sedikit) — dan base rate-nya memang lebih rendah. Itu menjelaskan SEBAGIAN kesenjangan approval sebagai perbedaan risiko terukur. Tapi ia tidak membuktikan «tidak ada bias»: bila limit itu sendiri adalah hasil keputusan manusia yang bias, maka «perbedaan risiko terukur» itu sebagian adalah bias yang sudah dibekukan menjadi fitur. Data tidak bisa membedakan keduanya — hanya proses di luar data yang bisa.",
      },
    },
    {
      id: "audit-lengkap",
      eyebrow: "Langkah 4 · Tabel audit lengkap",
      title: "Audit lengkap: empat atribut, satu tabel, semua dengan n",
      prose: [
        "Ini tabel yang menjadi rujukan seluruh lesson — audit lengkap notebook credit scoring pada test 6.000, GBM terkalibrasi (Platt/sigmoid), threshold 0,10 [notebook]. Baca baris demi baris, dan perhatikan kolom n-nya sebelum kolom lain: SEX — laki-laki n = 2.402, approval 26,1%, AIR 0,8693, FPR 0,6817, FNR 0,0749, bad rate di antara yang disetujui 6,69%; perempuan n = 3.598, approval 30,1%, AIR 1,0000 (pembanding tertinggi), FPR 0,6434, FNR 0,0940, bad rate 6,65%. EDUCATION — Pascasarjana n = 2.130, approval 35,3%, AIR 0,6032, FPR 0,5867, FNR 0,0963, bad rate 5,19%; Universitas n = 2.774, approval 25,2%, AIR 0,4298, FPR 0,6950, FNR 0,0793, bad rate 7,45%; SMA n = 1.014, approval 20,9%, AIR 0,3572, FPR 0,7463, FNR 0,0805, bad rate 9,91%; Lainnya n = 82, approval 58,5%, AIR 1,0000, FPR 0,4026, FNR 0,4000, bad rate 4,17%. MARRIAGE — Menikah n = 2.767, approval 28,0%, AIR 0,9606, FPR 0,6570, FNR 0,0823, bad rate 7,10%; Lajang n = 3.158, approval 29,2%, AIR 1,0000, FPR 0,6559, FNR 0,0881, bad rate 6,19%; Lainnya n = 75, approval 18,7%, AIR 0,6403, FPR 0,8095, FNR 0,1667, bad rate 14,29%. AGE band — di bawah 30 tahun n = 1.912, approval 26,6%, AIR 0,8037, FPR 0,6808, FNR 0,0820, bad rate 6,88%; 30–39 n = 2.198, approval 33,1%, AIR 1,0000, FPR 0,6057, FNR 0,0883, bad rate 5,49%; 40–49 n = 1.341, approval 27,0%, AIR 0,8149, FPR 0,6783, FNR 0,0994, bad rate 8,56%; 50–59 n = 473, approval 20,3%, AIR 0,6129, FPR 0,7535, FNR 0,0625, bad rate 7,29%; 60+ n = 76, approval 19,7%, AIR 0,5960, FPR 0,7358, FNR 0,0435, bad rate 6,67%.",
        "Nilai: tabel ini adalah SATU-SATUNYA tempat di lesson ini di mana semua angka audit berkumpul — dan ia sengaja memuat FPR dan FNR di samping approval rate, karena satu metrik bisa lolos sementara metrik lain gagal. SEX lolos AIR (0,8693, di atas 0,80) tapi FPR-nya 0,6817 vs 0,6434 — sekitar dua pertiga (65,85%) nasabah LANCAR ditolak di kedua grup (harga threshold 0,10 yang rendah, lihat M6.4). EDUCATION gagal AIR (0,3572) DAN gagal FPR (SMA 0,7463 vs Pascasarjana 0,5867) — dua metrik menunjuk grup yang sama. MARRIAGE hampir lolos semua — kecuali Lainnya (n = 75). AGE gagal AIR (0,5960) tapi TPR-nya rapat (0,9006 sampai 0,9565).",
        "Gambar: gambar di bawah memplot approval rate keenam grup SEX dan EDUCATION dengan n-nya — dan garis putus-putus approval keseluruhan 28,5%. Perhatikan dua hal: pertama, bar tertinggi (Lainnya 58,5%) adalah bar dengan n TERKECIL (82 orang); kedua, tiga bar EDUCATION yang besar (n = 1.014 sampai 2.774) tersusun rapi dari SMA 20,9% sampai Pascasarjana 35,3% — ketimpangan yang TIDAK bisa dijelaskan oleh n kecil.",
        "Baik atau buruk: tabel lengkap ini bagus karena ia memaksa pembacaan multi-metrik — approval, FPR, FNR, bad rate, dan n dalam satu pandangan. Buruk bila dibaca kolom demi kolom tanpa melihat barisnya: AIR EDUCATION 0,3572 memakai Lainnya (n = 82) sebagai tertinggi — tanpa Lainnya, AIR-nya 0,5922 (langkah 11), tetap flag, tapi besarnya berbeda jauh. AIR yang dilaporkan tanpa menyebut grup tertinggi dan n-nya adalah angka yang tidak bisa diperiksa ulang.",
        "Mitigasi: aturan pelaporan audit di lesson ini — setiap angka grup WAJIB ditemani n grupnya, dan setiap AIR WAJIB ditemani nama grup pembandingnya. Bila satu grup n-nya di bawah 100, angkanya dilaporkan dengan label «n kecil» dan TIDAK dipakai untuk vonis (langkah 11). Di tabel ini, yang masuk kategori itu: Lainnya EDUCATION (n = 82), Lainnya MARRIAGE (n = 75), dan 60+ (n = 76).",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Approval rate per grup: laki-laki 26,1 persen (n=2.402), perempuan 30,1 persen (n=3.598), Pascasarjana 35,3 persen (n=2.130), Universitas 25,2 persen (n=2.774), SMA 20,9 persen (n=1.014), Lainnya 58,5 persen (n=82); garis keseluruhan 28,5 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Approval rate per grup — GBM terkalibrasi, threshold 0,10 (test 6.000)</text>
<line x1="270.2" y1="36" x2="270.2" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="270.2" y="32" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">keseluruhan 28,5%</text>
<text x="118" y="57.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Laki-laki</text>
<rect x="122" y="44" width="135.7" height="18" fill="var(--c1)"/>
<text x="262.7" y="57.5" font-size="10" fill="var(--text)" font-family="var(--font-ui)">26,1% (n=2.402)</text>
<text x="118" y="87.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Perempuan</text>
<rect x="122" y="74" width="156.5" height="18" fill="var(--c1)"/>
<text x="283.5" y="87.5" font-size="10" fill="var(--text)" font-family="var(--font-ui)">30,1% (n=3.598)</text>
<text x="118" y="117.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pascasarjana</text>
<rect x="122" y="104" width="183.6" height="18" fill="var(--c4)"/>
<text x="310.6" y="117.5" font-size="10" fill="var(--text)" font-family="var(--font-ui)">35,3% (n=2.130)</text>
<text x="118" y="147.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Universitas</text>
<rect x="122" y="134" width="131.0" height="18" fill="var(--c4)"/>
<text x="258.0" y="147.5" font-size="10" fill="var(--text)" font-family="var(--font-ui)">25,2% (n=2.774)</text>
<text x="118" y="177.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">SMA</text>
<rect x="122" y="164" width="108.7" height="18" fill="var(--c4)"/>
<text x="235.7" y="177.5" font-size="10" fill="var(--text)" font-family="var(--font-ui)">20,9% (n=1.014)</text>
<text x="118" y="207.5" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Lainnya*</text>
<rect x="122" y="194" width="304.2" height="18" fill="var(--c2)"/>
<text x="431.2" y="207.5" font-size="10" fill="var(--text)" font-family="var(--font-ui)">58,5% (n=82)</text>
<text x="240" y="230" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">*Lainnya n = 82 (kode 0/4/5/6) — bar tertinggi, bukti terlemah.</text>
<text x="240" y="246" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Approval = probabilitas default prediksi DI BAWAH 0,10 [notebook].</text>
</svg>`,
        alt: "Approval rate per grup: laki-laki 26,1 persen (n=2.402), perempuan 30,1 persen (n=3.598), Pascasarjana 35,3 persen (n=2.130), Universitas 25,2 persen (n=2.774), SMA 20,9 persen (n=1.014), Lainnya 58,5 persen (n=82); garis keseluruhan 28,5 persen.",
        caption: "Cara membaca: panjang bar = approval rate grup itu (disetujui bila probabilitas default prediksi DI BAWAH 0,10) [notebook]; garis putus-putus = approval keseluruhan 28,5%. SEX selisihnya kecil (26,1% vs 30,1%); EDUCATION selisihnya besar — tapi bar tertinggi (Lainnya 58,5%) berasal dari 82 orang saja, jadi jangan jadikan ia patokan. Tiga bar EDUCATION yang besar tersusun rapi SMA 20,9% → Universitas 25,2% → Pascasarjana 35,3%.",
      },
      formula: String.raw`\mathrm{AIR}(g) = \frac{\text{approval rate}(g)}{\max_h \text{approval rate}(h)}, \qquad \text{flag bila } \mathrm{AIR} < 0{,}80`,
      formulaNote: "AIR per grup: approval rate grup g dibagi approval rate TERTINGGI di dalam atribut yang sama (M7.1). SEX: laki-laki 0,2614 / 0,3007 = 0,8693 (lolos). EDUCATION: Pascasarjana 0,3531 / 0,5854 = 0,6032; SMA 0,2091 / 0,5854 = 0,3572 (flag). Selalu sebut grup pembandingnya — di sini «Lainnya» (n = 82).",
      tasks: [],
    },
    {
      id: "representation-bias",
      eyebrow: "Langkah 5 · Representation bias",
      title: "Representation bias: grup yang hampir tidak pernah dilihat model",
      prose: [
        "Representation bias terjadi bila satu grup TERLALU SEDIKIT di data latih — model hampir tidak pernah melihat contoh dari grup itu, jadi apa pun yang ia prediksi untuk grup itu sebagian besar ditebak dari grup lain. Di data ini, grup-grup kecil itu nyata dan bernama: EDUCATION Lainnya hanya 386 dari 24.000 baris train (1,6%), MARRIAGE Lainnya hanya 302 (1,3%), AGE 60+ hanya 263 (1,1%). Bandingkan dengan grup besar: Universitas 11.256 (46,9%), Pascasarjana 8.455 (35,2%), 30–39 tahun 9.040 (37,7%), di bawah 30 tahun 7.706 (32,1%). Model ini dilatih 46,9% dari contoh Universitas — dan 1,1% dari contoh 60+.",
        "Nilai [notebook]: konsekuensi kecilnya n terlihat langsung di test. EDUCATION Lainnya: n = 82 di test, approval 58,5% — tertinggi di antara semua grup EDUCATION — dengan interval Wilson 95% [47,7%; 68,6%], lebar 20,85 poin persen (langkah 11). MARRIAGE Lainnya: n = 75, approval 18,7% — TERENDAH di MARRIAGE — dengan interval [11,5%; 28,9%]. 60+: n = 76, approval 19,7%, interval [12,3%; 30,0%]. Ketiga grup kecil ini menempati posisi EKSTREM di tabelnya masing-masing (tertinggi, terendah, terendah) — dan ketiganya adalah grup yang angkanya paling tidak bisa dipercaya. Itu bukan kebetulan: grup kecil memang cenderung tampak ekstrem, karena sedikit orang yang pindah kelompok sudah menggeser ratenya jauh.",
        "Gambar: bayangkan melatih model dengan 11.256 foto kucing dan 386 foto anjing, lalu menguji «apakah model ini adil untuk anjing?» — jawabannya hampir pasti «tidak tahu», bukan «ya» atau «tidak». Di data ini, «anjing»-nya adalah Lainnya (386 contoh train) dan 60+ (263 contoh train). Pascasarjana, sebaliknya, BUKAN grup kecil — 8.455 contoh train, 2.130 di test — jadi AIR Pascasarjana 0,6032 bukan artefak representasi: grupnya sendiri besar; yang kecil adalah PEMBANDINGNYA (Lainnya, n = 82). Dua jenis «kecil» yang berbeda — dan lesson ini membedakannya dengan tegas.",
        "Baik atau buruk: representation bias ini bagus sebagai DIAGNOSIS — ia menjelaskan mengapa tiga grup kecil menempati posisi ekstrem, dan mengapa TPR Lainnya EDUCATION 0,6000 (langkah 11) tidak boleh dibaca sebagai vonis: hanya 5 nasabah default di grup itu. Buruk bila dibaca sebagai «jadi ketimpangan EDUCATION bukan masalah»: tanpa Lainnya pun, AIR EDUCATION 0,5922 (SMA vs Pascasarjana, keduanya n ribuan) tetap flag — representation bias menjelaskan bagian kecil dari cerita, bukan seluruhnya. Grup besar yang timpang adalah sinyal; grup kecil yang ekstrem adalah noise yang menunggu dibuktikan.",
        "Mitigasi: laporkan n TRAIN per grup di samping n test — bukan hanya n test. Bila satu grup di bawah 2% train (di sini Lainnya 1,6% dan 1,3%, 60+ 1,1%), tandai ia «kurang terwakili» SEBELUM membaca angkanya. Perbaikannya bukan di model — melainkan di data: kumpulkan lebih banyak contoh grup itu, atau oversampling dengan sadar akan harganya (M7.4), atau — bila tidak bisa — laporkan angkanya dengan label «tidak cukup bukti» dan jangan jadikan ia dasar keputusan.",
      ],
      tasks: [],
      note: {
        title: "Dua jenis «kecil» — jangan dicampur",
        type: "pitfall",
        body: "Pascasarjana n = 2.130 (test) adalah grup BESAR — AIR-nya 0,6032 bukan artefak n kecil. Yang kecil adalah PEMBANDINGNYA, Lainnya n = 82, yang dipakai sebagai tertinggi dalam perhitungan AIR itu. Sebaliknya, Lainnya MARRIAGE (n = 75) dan 60+ (n = 76) adalah grup yang SENDIRI kecil — angkanya sendiri yang rapuh. «Flag karena pembandingnya kecil» dan «flag karena grupnya sendiri kecil» adalah dua masalah berbeda dengan dua mitigasi berbeda.",
      },
    },
    {
      id: "label-bias",
      eyebrow: "Langkah 6 · Label bias",
      title: "Label bias: ketika labelnya sendiri mewarisi keputusan manusia",
      prose: [
        "Label bias terjadi bila label yang dipakai melatih model MENCERMINKAN keputusan manusia masa lalu — termasuk prasangkanya. Di kredit, label «default» sering kali bukan fakta alam: ia hasil dari siapa yang DULU diberi pinjaman, dengan syarat apa, dan bagaimana penagihannya dilakukan. Bila dulu satu grup lebih jarang diberi pinjaman — atau diberi limit lebih kecil sehingga lebih mudah gagal bayar — maka label «default» grup itu sudah mengandung sejarah keputusan tersebut. Model yang belajar dari label itu akan mempelajari sejarah itu sebagai «pola risiko» — dan mengulanginya dengan rapi, lengkap dengan angka ROC-AUC yang bagus.",
        "Nilai [notebook] — base rate per grup di test 6.000: SEX laki-laki 0,2336 vs perempuan 0,2129 (selisih 2,07 poin persen); EDUCATION Pascasarjana 0,1901, Universitas 0,2365, SMA 0,2574 (tertinggi di antara grup besar), Lainnya 0,0610 (n = 82); MARRIAGE Menikah 0,2414, Lajang 0,2049, Lainnya 0,1600; AGE di bawah 30 tahun 0,2233, 30–39 0,2061, 40–49 0,2327, 50–59 0,2368, 60+ 0,3026 (tertinggi). Pola base rate ini SEJALAN dengan pola approval: grup dengan base rate tertinggi (SMA 0,2574; 60+ 0,3026) adalah grup dengan approval terendah — model menyetujui lebih jarang grup yang lebih sering default. Itu konsisten dengan «model membaca risiko yang terukur» — dan JUGA konsisten dengan «labelnya sendiri bias». Dari data saja, keduanya tidak bisa dibedakan.",
        "Gambar: bayangkan dua thermometer — satu mengukur suhu ruangan, satu mengukur suhu di dekat jendela yang bocor. Keduanya memberi angka, keduanya «benar» sebagai bacaan alatnya — tapi hanya satu yang mengukur ruangan. Label «default next month» di dataset UCI ini adalah bacaan dari SATU thermometer: perilaku bayar nasabah kartu kredit satu bank di Taiwan tahun 2005 yang SUDAH lolos saringan pemberian kartu. Ia tidak mengukur «siapa yang akan default bila diberi pinjaman» untuk semua orang — ia mengukur «siapa yang default di antara mereka yang dulu diberi kartu». Perbedaan itu adalah label bias yang paling sulit dilihat: labelnya tampak objektif karena ia angka, bukan opini.",
        "Baik atau buruk: base rate yang sejalan dengan approval itu bagus sebagai BUKTI bahwa model tidak mengada-ada — ia merespons perbedaan risiko yang ada di label. Buruk bila dibaca sebagai «jadi labelnya benar»: base rate SMA 0,2574 vs Pascasarjana 0,1901 (selisih 6,73 poin persen) bisa berarti «nasabah SMA memang lebih berisiko» ATAU «nasabah SMA dulu diberi limit lebih kecil dan syarat lebih keras, sehingga lebih mudah tercatat default». Data ini tidak mencatat syarat pemberian kartu — jadi pertanyaan itu tidak bisa dijawab dari data ini, dan jawaban yang jujur adalah «tidak tahu, perlu data proses».",
        "Mitigasi: untuk tiap label, tanyakan tiga hal dan tulis jawabannya: (1) SIAPA yang memberi label ini — manusia, sistem, atau perilaku yang teramati? (2) APA yang TIDAK tercatat — misal, apakah yang ditolak dulu tidak punya label sama sekali (langkah 7)? (3) APAKAH label ini akan sama bila prosesnya berbeda — misal bila limit diberikan dengan aturan yang berbeda? Bila satu jawaban «tidak tahu», tulis «tidak tahu» di samping auditmu — jangan isi dengan asumsi yang menguntungkan modelmu.",
      ],
      tasks: [],
      note: {
        title: "Label UCI: perilaku yang teramati, bukan vonis manusia",
        type: "risk",
        body: "Nuansa yang wajib dicatat: label «default payment next month» di dataset ini adalah PERILAKU yang teramati (nasabah benar-benar gagal bayar), bukan vonis manusia atas nasabah itu. Jadi label bias di sini lebih halus daripada «petugas dulu menolak grup ini»: ia hidup di SAMPING label — di siapa yang masuk dataset (langkah 7) dan di fitur seperti limit yang sudah dipengaruhi keputusan manusia (langkah 3). Jangan ajarkan label bias di data ini sebagai «labelnya bohong» — ajarkan sebagai «labelnya benar untuk populasi yang sudah tersaring, dan diam tentang yang lain».",
      },
    },
    {
      id: "selection-bias",
      eyebrow: "Langkah 7 · Selection / sampling bias",
      title: "Selection bias: yang tidak ada di data tidak bisa diaudit",
      prose: [
        "Selection bias terjadi bila data yang kamu punya BUKAN populasi yang akan kamu layani. Dataset UCI ini berisi nasabah kartu kredit SATU bank di Taiwan tahun 2005 yang SUDAH memegang kartu — orang yang dulu DITOLAK pemberian kartunya tidak ada di sini, dan orang yang tidak pernah mengajukan juga tidak ada. Model yang dilatih di data ini belajar «siapa yang default di antara yang dulu disetujui» — lalu dipakai untuk memutuskan «siapa yang disetujui sekarang». Itu seperti melatih penguji rasa makanan hanya pada orang yang sudah suka pedas, lalu menyimpulkan «semua orang suka pedas».",
        "Nilai [notebook] — dua pemeriksaan yang BISA dilakukan dari data, dan satu yang TIDAK bisa. Yang bisa, pertama: PSI (Population Stability Index) train vs test — SEX 0,0001; EDUCATION 0,0008; MARRIAGE 0,0002. Ketiganya jauh di bawah 0,1 (ambang «stabil»): komposisi train dan test NYARIS IDENTIK — tidak ada pergeseran distribusi antara latih dan uji. Yang bisa, kedua: PSI yang dihitung M2 (G9) sebesar 0,0104 — juga di bawah 0,1, stabil. Yang TIDAK bisa: memeriksa apakah populasi dataset ini mewakili populasi yang akan dilayani — karena populasi yang tidak masuk dataset tidak meninggalkan jejak di dalam dataset. Satu-satunya cara mengetahuinya adalah membandingkan dengan data LUAR: berapa persen pengaju yang ditolak bank itu dulu, dan seperti apa profil mereka (topik M2.5, reject inference).",
        "Gambar: bayangkan ember yang kamu isi dari sungai — ember itu berisi air sungai, tapi hanya air yang berhasil kamu tangkap. Bila jaringmu hanya menangkap ikan besar, embermu akan meyakinkanmu bahwa «sungai ini hanya berisi ikan besar». PSI train-vs-test yang 0,0001 itu seperti membandingkan dua ember dari jaring yang sama: keduanya sama — tapi keduanya sama-sama salah tentang sungai. PSI mengukur «apakah ember kedua sama dengan ember pertama», bukan «apakah ember itu mewakili sungai».",
        "Baik atau buruk: PSI yang kecil itu bagus sebagai BUKTI TIDAK ADA DRIFT antara train dan test — auditmu tidak dirusak oleh pergeseran distribusi internal. Buruk bila dibaca sebagai «jadi datanya representatif»: PSI tidak pernah bisa membuktikan itu, karena ia hanya membandingkan dua bagian dari data yang sama. Selection bias yang sesungguhnya — siapa yang tidak pernah masuk dataset — tidak punya angka di dalam dataset. Ia hanya bisa ditemukan dengan bertanya ke luar: siapa yang ditolak, siapa yang tidak mengajukan, dan apakah mereka berbeda dari yang ada di sini.",
        "Mitigasi: untuk setiap dataset, tulis «siapa yang TIDAK ada di sini» sebelum melatih — di sini: pengaju yang ditolak, non-nasabah, dan nasabah bank lain / tahun lain. Bila keputusan model akan diterapkan pada populasi yang lebih luas dari dataset (dan hampir selalu begitu), nyatakan batas itu di samping setiap angka audit: «berlaku untuk nasabah kartu kredit bank ini, 2005, yang dulu disetujui». Dan bila memungkinkan, lakukan reject inference (M2.5): perkirakan seperti apa yang ditolak itu, agar model tidak buta terhadap mereka.",
      ],
      formula: String.raw`\mathrm{PSI} = \sum_b (\text{actual}_b - \text{expected}_b) \times \ln\!\left(\frac{\text{actual}_b}{\text{expected}_b}\right), \qquad \mathrm{PSI} < 0{,}1 \text{ stabil}`,
      formulaNote: "PSI: jumlah per bin dari (proporsi aktual − proporsi acuan) × ln(aktual/acuan). Band M2.4: di bawah 0,1 stabil; 0,1–0,25 waspada; di atas 0,25 drift besar. Train vs test di sini: SEX 0,0001; EDUCATION 0,0008; MARRIAGE 0,0002 — stabil. PSI M2 (G9) 0,0104 — stabil juga.",
      tasks: [],
      note: {
        title: "PSI kecil bukan bukti representatif",
        type: "pitfall",
        body: "PSI train-vs-test 0,0001–0,0008 hanya membuktikan train dan test berasal dari populasi yang sama — bukan bahwa populasi itu mewakili calon nasabah. Selection bias yang sesungguhnya (pengaju yang ditolak tidak ada di dataset) tidak bisa dideteksi oleh PSI apa pun, karena kelompok yang hilang itu tidak ada di kedua sisi perbandingan. Jangan laporkan «PSI kecil» sebagai «data representatif».",
      },
    },
    {
      id: "aggregation-bias",
      eyebrow: "Langkah 8 · Aggregation bias",
      title: "Aggregation bias: satu angka global, lima cerita berbeda",
      prose: [
        "Aggregation bias (paradoks Simpson) terjadi bila satu metrik global MENYEMBUNYIKAN ketimpangan antar grup — bahkan membaliknya. Mekanismenya sederhana: angka global adalah RATA-RATA TERTIMBANG dari angka per strata — dan bila komposisi strata berbeda antar grup, rata-ratanya bisa berkata sebaliknya dari tiap stratanya. Model yang «adil secara keseluruhan» bisa timpang di setiap kelompoknya — dan model yang «timpang secara keseluruhan» bisa adil di setiap kelompoknya. Satu angka tidak pernah cukup.",
        "Nilai [notebook] — selisih approval perempuan dikurangi laki-laki (F−M) per AGE band, GBM terkalibrasi, threshold 0,10, test 6.000: global +3,93 poin persen. Per band: di bawah 30 tahun +8,06 (perempuan 29,44% dari n = 1.243 vs laki-laki 21,38% dari n = 669); 30–39 tahun +3,27 (34,47% vs 31,20%); 40–49 tahun +0,81 (27,33% vs 26,52%); 50–59 tahun +0,07 (20,33% vs 20,26%); 60+ tahun +0,56 (20,00% vs 19,44%). Gambar di bawah menunjukkan pola ini: selisihnya TERBESAR pada nasabah muda dan MENGHILANG pada nasabah tua. Angka global +3,93 adalah rata-rata dari lima cerita yang berbeda — dan cerita yang paling timpang (+8,06 pada di bawah 30 tahun) adalah cerita tentang nasabah muda, bukan tentang «perempuan secara umum». Di dalam EDUCATION polanya sama: F−M Pascasarjana +2,26 (36,26% vs 34,00%), Universitas +4,00 (26,70% vs 22,70%), SMA +7,75 (24,05% vs 16,30%), Lainnya +9,40 (61,40% vs 52,00%) — selisihnya membesar pada grup dengan approval lebih rendah.",
        "Gambar: lima bar di bawah adalah lima selisih F−M — dan garis putus-putus adalah selisih global +3,93. Bila kamu hanya melaporkan garisnya, kamu akan berkata «perempuan disetujui 3,93 poin persen lebih sering» — kalimat yang benar secara aritmetika dan menyesatkan secara isi: pada nasabah 50–59 tahun selisihnya praktis NOL (+0,07), dan pada nasabah di bawah 30 tahun selisihnya DUA KALI LIPAT angka global (+8,06). Kebijakan yang dirancang dari angka global («tambahkan penyeimbang untuk perempuan») akan salah sasaran di kedua ujung: ia memberi kompensasi di tempat yang tidak timpang, dan memberi terlalu sedikit di tempat yang paling timpang.",
        "Baik atau buruk: stratifikasi ini bagus karena ia menunjukkan DI MANA ketimpangan itu tinggal — di nasabah muda — dan itu mengarahkan penyelidikan berikutnya (apakah nasabah muda perempuan memang lebih rendah risiko, atau adakah fitur yang menguntungkan mereka?). Buruk bila dibaca sebagai «jadi tidak ada masalah global»: +3,93 global tetap nyata (uji-z langkah 11: p = 0,001), dan stratifikasi tidak menghapusnya — ia hanya menjelaskan KOMPOSISINYA. Satu catatan kejujuran: di data ini TIDAK terjadi pembalikan tanda (semua band F−M positif) — contoh pembalikan sejati di bawah ini diberi label [ilustrasi] karena angkanya dibuat, bukan dari data UCI.",
        "Mitigasi: JANGAN PERNAH melaporkan selisih antar grup tanpa stratifikasi minimal satu variabel yang relevan (di sini AGE). Bila selisih global dan selisih per strata berbeda jauh — atau bertanda beda — laporkan KEDUANYA dan selidiki komposisinya: grup mana yang mendominasi tiap strata, dan apakah base rate-nya berbeda di tiap strata (di sini base rate laki-laki 50–59 tahun 0,2672 vs perempuan 0,2075 — selisih 5,97 poin persen — ikut menjelaskan mengapa selisih approval di band itu mengecil).",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Selisih approval perempuan dikurangi laki-laki per AGE band: di bawah 30 tahun plus 8,06 poin persen; 30 sampai 39 plus 3,27; 40 sampai 49 plus 0,81; 50 sampai 59 plus 0,07; 60 plus plus 0,56; garis global plus 3,93">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Selisih approval perempuan − laki-laki per AGE band (poin persen)</text>
<line x1="200" y1="40" x2="200" y2="196" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="298.2" y1="40" x2="298.2" y2="196" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="298.2" y="32" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">global +3,93</text>
<text x="194" y="65" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">di bawah 30</text>
<rect x="200" y="52" width="201.5" height="16" fill="var(--c1)"/>
<text x="406.5" y="65" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+8,06 pp</text>
<text x="194" y="97" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">30–39</text>
<rect x="200" y="84" width="81.8" height="16" fill="var(--c1)"/>
<text x="286.8" y="97" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+3,27 pp</text>
<text x="194" y="129" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">40–49</text>
<rect x="200" y="116" width="20.2" height="16" fill="var(--c1)"/>
<text x="225.2" y="129" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,81 pp</text>
<text x="194" y="161" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">50–59</text>
<rect x="200" y="148" width="1.8" height="16" fill="var(--c1)"/>
<text x="206.8" y="161" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,07 pp</text>
<text x="194" y="193" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">60+</text>
<rect x="200" y="180" width="14.0" height="16" fill="var(--c1)"/>
<text x="219.0" y="193" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+0,56 pp</text>
<text x="200" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="300" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+4</text>
<text x="400" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+8</text>
<text x="240" y="228" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Selisih global +3,93 pp menyembunyikan bahwa ketimpangan terkonsentrasi di nasabah muda.</text>
</svg>`,
        alt: "Selisih approval perempuan dikurangi laki-laki per AGE band: di bawah 30 tahun plus 8,06 poin persen; 30 sampai 39 plus 3,27; 40 sampai 49 plus 0,81; 50 sampai 59 plus 0,07; 60 plus plus 0,56; garis global plus 3,93.",
        caption: "Cara membaca: panjang bar = selisih approval perempuan dikurangi laki-laki di band itu (poin persen) [notebook]; garis putus-putus = selisih global +3,93. Ketimpangan SEX terkonsentrasi di nasabah muda (+8,06 pada di bawah 30 tahun) dan praktis hilang pada 50–59 tahun (+0,07). Satu angka global tidak pernah cukup — selalu stratifikasi.",
      },
      formula: String.raw`\bar{r} = \sum_s w_s\, \bar{r}_s, \qquad w_s = \frac{n_s}{N}`,
      formulaNote: "Rata-rata global = rata-rata TERTIMBANG dari rata-rata per strata s, dengan bobot w_s = n_s / N. Bila komposisi strata berbeda antar grup, rata-rata global bisa membalik arah tiap stratanya — itulah paradoks Simpson. Di data ini tidak terjadi pembalikan tanda, tapi terjadi konsentrasi: +8,06 di bawah 30 tahun vs +0,07 pada 50–59 tahun.",
      tasks: [],
      note: {
        title: "Contoh pembalikan sejati [ilustrasi] — bukan dari data UCI",
        type: "risk",
        body: "Angka berikut DIBUAT untuk menunjukkan mekanisme pembalikan, bukan dari data UCI. Cabang A (kota besar): perempuan disetujui 60 dari 100 (60%), laki-laki 7 dari 10 (70%) — laki-laki lebih tinggi di cabang A. Cabang B (kota kecil): perempuan 1 dari 10 (10%), laki-laki 20 dari 100 (20%) — laki-laki lebih tinggi juga di cabang B. Global: perempuan 61 dari 110 (55,5%), laki-laki 27 dari 110 (24,5%) — perempuan lebih tinggi secara global. Laki-laki menang di TIAP cabang, perempuan menang secara GLOBAL — karena perempuan terkonsentrasi di cabang yang approval-nya tinggi. Itulah paradoks Simpson yang sesungguhnya — dan alasan angka global tidak pernah boleh berdiri sendiri.",
      },
    },
    {
      id: "intersectional-audit",
      eyebrow: "Langkah 9 · Audit irisan",
      title: "Audit irisan: ketika dua atribut bertemu, ketimpangan bisa jauh lebih parah",
      prose: [
        "Stratifikasi (langkah 8) memotong data SATU atribut pada satu waktu: SEX saja, EDUCATION saja, AGE saja. Audit irisan memotong DUA atribut sekaligus: SEX × EDUCATION, SEX × AGE. Bedanya bukan teknik — bedanya adalah APA YANG BISA DISEMBUNYIKAN. Satu atribut bisa tampak «lumayan» sementara irisannya parah: AIR SEX global 0,8693 dan AIR EDUCATION SMA 0,3572 (terhadap Lainnya) masing-masing sudah flag — tapi tidak satu pun dari keduanya memberitahumu bahwa laki-laki SMA approval-nya hanya 16,30%. Stratifikasi menjawab «grup mana yang timpang?»; audit irisan menjawab «KOMBINASI mana yang paling timpang?» — dan jawabannya sering kali bukan kombinasi yang kamu tebak dari marginalnya.",
        "Nilai [notebook] — audit irisan SEX × EDUCATION, test 6.000, GBM terkalibrasi, threshold 0,10; AIR = approval sel dibagi approval tertinggi dalam tabel yang sama (Perempuan × Lainnya 0,6140). Laki-laki × Pascasarjana: approval 0,3400, AIR 0,5537 (n = 900, base rate 0,2067, FPR 0,5938, TPR 0,9140, Wilson [0,3098; 0,3716]). Laki-laki × Universitas: 0,2270, AIR 0,3697 (n = 1.066, FPR 0,7255, TPR 0,9195, [0,2029; 0,2531]). Laki-laki × SMA: 0,1630, AIR 0,2655 (n = 411, base rate 0,2701, FPR 0,7933, TPR 0,9550, PPV 0,3081, [0,1305; 0,2018]) — sel TERPARAH di tabel ini, dan n-nya cukup besar untuk divonis. Laki-laki × Lainnya: 0,5200, AIR 0,8469 — tapi n = 25, JANGAN VONIS. Perempuan × Pascasarjana: 0,3626, AIR 0,5906 (n = 1.230). Perempuan × Universitas: 0,2670, AIR 0,4349 (n = 1.708). Perempuan × SMA: 0,2405, AIR 0,3917 (n = 603). Perempuan × Lainnya: 0,6140, AIR 1,0000 — tapi n = 57, terlalu kecil untuk vonis: TPR-nya 0,0 dan PPV-nya 0,0 karena hanya ada 2 defaulter dan keduanya di-approve — artefak sel kecil, bukan vonis.",
        "Nilai [notebook] — audit irisan SEX × AGE; AIR = approval sel dibagi approval tertinggi dalam tabel yang sama (Perempuan × 30–39 0,3447). Laki-laki × <30: 0,2138, AIR 0,6202 (n = 669). Laki-laki × 30–39: 0,3120, AIR 0,9051 (n = 907) — satu-satunya sel laki-laki yang mendekati adil. Laki-laki × 40–49: 0,2652, AIR 0,7694 (n = 558). Laki-laki × 50–59: 0,2026, AIR 0,5878 (n = 232, [0,1559; 0,2590]). Laki-laki × 60+: 0,1944, AIR 0,5640 — n = 36, terlalu kecil untuk vonis (Wilson [0,0975; 0,3503] selebar 0,2528). Perempuan × <30: 0,2944, AIR 0,8541 (n = 1.243). Perempuan × 30–39: 0,3447, AIR 1,0000 (n = 1.291). Perempuan × 40–49: 0,2733, AIR 0,7929 (n = 783). Perempuan × 50–59: 0,2033, AIR 0,5898 (n = 241). Perempuan × 60+: 0,2000, AIR 0,5802 (n = 40, flag). Pesan yang sama di kedua tabel: AIR global SEX 0,8693 MENYEMBUNYIKAN irisan yang jauh lebih parah — sel terendah SEX × EDUCATION 0,2655 (selisih −0,6038 dari global) dan sel terendah SEX × AGE 0,5640 (selisih −0,3053).",
        "Baik atau buruk: audit irisan bagus karena ia menemukan ketimpangan yang tidak terlihat dari marginal mana pun — laki-laki SMA bukan «laki-laki yang timpang» maupun «SMA yang timpang», melainkan kombinasi keduanya yang menumpuk. Buruk bila dibaca sebagai «semakin banyak irisan semakin baik»: tiap irisan membelah n menjadi potongan yang makin kecil — 18 sel di dua tabel ini, 4 di antaranya n < 100 — dan sel kecil menghasilkan angka ekstrem yang tidak bisa dipercaya (Perempuan × Lainnya TPR 0,0 adalah contohnya). Aturan yang sama seperti langkah 4: sel dengan n < 100 dilabeli «terlalu kecil untuk vonis» — dilaporkan, tidak divonis. Dan buruk bila irisan dibaca sebagai «bukti diskriminasi terhadap kombinasi itu»: irisan menunjukkan DI MANA ketimpangan tinggal, bukan MENGAPA ia ada — penyebabnya tetap butuh penyelidikan sumber (langkah 2).",
        "Mitigasi: tambahkan audit irisan ke workflow-mu (langkah 10) sebagai langkah 3b — SETELAH tabel audit lengkap, SEBELUM penyelidikan sumber. Dua dimensi dulu (SEX × EDUCATION, SEX × AGE); tiga dimensi hanya bila n-nya memungkinkan. Dan satu peringatan yang wajib ditulis di samping tabel irisan: multiple comparisons. Delapan belas sel diuji pada ambang 5% berarti ~1 flag palsu diharapkan muncul secara kebetulan — jadi satu sel yang flag sendirian, tanpa pola di sel tetangganya, adalah kandidat noise sebelum jadi vonis. Aturan praktisnya: flag yang berdiri sendiri diselidiki; flag yang membentuk POLA (semua sel laki-laki SMA/50+/60+ di bawah 0,65) ditindaklanjuti. Koreksi formalnya (Bonferroni: 0,05/18 ≈ 0,0028) ada sebagai konsep — yang dipakai di lesson ini adalah aturan n minimum + pola, bukan p-value yang dikoreksi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="AIR per sel irisan SEX kali EDUCATION: laki-laki SMA 0,2655 paling rendah, perempuan Lainnya 1,0000 tertinggi dengan n kecil">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">AIR per sel irisan SEX × EDUCATION (global SEX: 0,8693)</text>
<line x1="20" y1="72" x2="470" y2="72" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="66" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">ambang 0,80</text>
<rect x="30" y="111" width="40" height="89" fill="var(--c1)" opacity="0.7"/>
<rect x="84" y="141" width="40" height="59" fill="var(--c1)" opacity="0.7"/>
<rect x="138" y="157" width="40" height="43" fill="var(--c1)" opacity="0.7"/>
<rect x="192" y="64" width="40" height="136" fill="var(--c1)" opacity="0.7"/>
<rect x="246" y="105" width="40" height="95" fill="var(--c4)" opacity="0.7"/>
<rect x="300" y="130" width="40" height="70" fill="var(--c4)" opacity="0.7"/>
<rect x="354" y="137" width="40" height="63" fill="var(--c4)" opacity="0.7"/>
<rect x="408" y="40" width="40" height="160" fill="var(--c4)" opacity="0.7"/>
<line x1="20" y1="200" x2="460" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="50" y="100" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,554</text>
<text x="104" y="130" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,370</text>
<text x="158" y="146" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,266</text>
<text x="212" y="53" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,847*</text>
<text x="266" y="94" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,591</text>
<text x="320" y="119" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,435</text>
<text x="374" y="126" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,392</text>
<text x="428" y="29" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">1,000*</text>
<text x="50" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·Pasca</text>
<text x="104" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·Univ</text>
<text x="158" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·SMA</text>
<text x="212" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">L·Lainnya</text>
<text x="266" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·Pasca</text>
<text x="320" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·Univ</text>
<text x="374" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·SMA</text>
<text x="428" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">P·Lainnya</text>
<text x="240" y="240" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">* n kecil — jangan vonis (L·Lainnya n = 25; P·Lainnya n = 57). L·SMA 0,2655 (n = 411) adalah vonis yang sah.</text>
</svg>`,
        alt: "AIR per sel irisan SEX kali EDUCATION: laki-laki SMA 0,2655 paling rendah, perempuan Lainnya 1,0000 tertinggi dengan n kecil.",
        caption: "Cara membaca: AIR = approval sel dibagi approval tertinggi dalam tabel yang sama (Perempuan × Lainnya 0,6140). Garis putus-putus = ambang 0,80. Tujuh dari delapan sel di bawah ambang — dan sel terendah (Laki-laki × SMA 0,2655, n = 411) jauh di bawah AIR global SEX 0,8693. Dua sel bertanda * punya n kecil (25 dan 57) — dilaporkan, tidak divonis.",
      },
      tasks: [],
    },
    {
      id: "workflow-audit",
      eyebrow: "Langkah 10 · Workflow audit end-to-end",
      title: "Workflow audit: definisikan, ukur, selidiki, putuskan, dokumentasikan",
      prose: [
        "Audit yang baik adalah PROSES, bukan sekali hitung. Lima langkahnya, berurutan dan tidak boleh dilompati. Langkah 1 — DEFINISIKAN GRUP: tulis atribut yang diperiksa (SEX, EDUCATION, MARRIAGE, AGE band), pemetaan kodenya (termasuk kode «lainnya» 0/4/5/6 untuk EDUCATION dan 0/3 untuk MARRIAGE), dan n minimum untuk vonis (di lesson ini: n di bawah 100 = «n kecil», dan untuk TPR, nasabah default di bawah 30 = «tidak dipakai untuk vonis», mengikuti M7.1). Langkah 2 — UKUR: hitung approval rate, AIR, FPR, FNR (atau TPR), PPV, ECE, Brier, dan bad rate per grup — SEMUA dengan n — pada data yang SAMA (di sini test 6.000, model dan threshold yang SAMA). Jangan ukur satu metrik saja: M7.1 membuktikan satu metrik bisa lolos sementara yang lain gagal.",
        "Langkah 3 — SELIDIKI SUMBER: untuk tiap flag, jalankan taksonomi langkah 2 sebagai daftar periksa. Apakah grupnya kecil di train (langkah 5)? Apakah distribusi fiturnya berbeda (langkah 3)? Apakah base rate-nya berbeda — dan apakah perbedaan itu sendiri perlu dijelaskan (langkah 6)? Apakah ada stratifikasi yang mengubah cerita (langkah 8)? Apakah datanya mewakili populasi yang dilayani (langkah 7)? Tulis hipotesis sumbernya DENGAN uji yang membantahnya — audit yang tidak bisa salah bukan audit. Langkah 4 — PUTUSKAN AMBANG: ambang (AIR di bawah 0,80 = flag) ditetapkan SEBELUM melihat angka — dan keputusan tindak lanjutnya dibedakan: flag pada grup BESAR (SMA, n = 1.014) berarti «selidiki dan rencanakan mitigasi» (M7.4); flag pada grup KECIL (Lainnya, n = 82) berarti «kumpulkan data dulu, jangan mitigasi dari noise» (langkah 11).",
        "Langkah 5 — DOKUMENTASIKAN: tulis semuanya dalam satu lembar audit — model dan thresholdnya, definisi grup dan n-nya, tabel metriknya, hipotesis sumbernya, ambang keputusannya, dan apa yang TIDAK diketahui (misal: «apakah limit ditetapkan adil — tidak diketahui dari data ini»). Lembar audit yang baik bisa dibaca ulang setahun kemudian oleh orang lain dan tetap bisa diperiksa ulang — karena semua angka tertelusur ke data dan script yang sama.",
        "Nilai: workflow ini adalah yang membedakan «audit» dari «sekali lihat angka». Tanpa langkah 1, definisi grup berubah-ubah mengikuti hasil. Tanpa langkah 3, setiap flag dibaca sebagai «modelnya bias» tanpa penyebab. Tanpa langkah 4, flag pada n = 82 diperlakukan sama dengan flag pada n = 2.130 — dan mitigasi dibangun di atas noise. Tanpa langkah 5, auditnya tidak bisa diaudit ulang — dan temuan yang tidak bisa diperiksa ulang bukan temuan.",
        "Baik atau buruk: workflow lima langkah ini bagus karena ia memaksa urutan yang benar — definisi dulu, ukur kemudian, selidiki, baru putuskan. Buruk bila dibaca sebagai birokrasi: lima langkah ini bisa dikerjakan dalam satu notebook (notebook guided task lesson ini melakukannya dalam 6 check) — yang mahal bukan waktunya, melainkan disiplin untuk tidak melompati langkah 3 dan 5. Audit yang melompati penyelidikan sumber akan selalu menemukan «modelnya bias» — dan tidak pernah menemukan apa yang harus diperbaiki.",
        "Mitigasi: sebelum audit berikutnya, salin lima langkah ini menjadi template — dengan definisi grup, ambang, dan aturan n-kecil yang sudah terisi dari lesson ini — dan pakai template yang SAMA untuk setiap model. Template yang sama berarti audit antar model bisa dibandingkan; template yang berubah-ubah berarti setiap audit adalah cerita baru yang tidak bisa dibandingkan dengan audit sebelumnya.",
      ],
      tasks: [],
      note: {
        title: "Ambang ditetapkan sebelum melihat angka",
        type: "risk",
        body: "AIR di bawah 0,80 = flag, dan n di bawah 100 = «n kecil» — keduanya ditetapkan SEBELUM angka audit dibaca, mengikuti M7.1. Bila ambang dipilih sesudah melihat angka (misal memakai 0,85 karena AIR SEX 0,8693 «kelihatan lolos» di 0,80), auditnya sudah dicurangi oleh hasilnya sendiri — sama seperti memilih threshold di test (M6.4, langkah 4). Tulis ambangmu dulu, baru hitung.",
      },
    },
    {
      id: "noise-vs-sinyal",
      eyebrow: "Langkah 11 · Noise vs sinyal",
      title: "Kapan selisih adalah noise — dan kapan ia sinyal",
      prose: [
        "Tidak semua selisih antar grup adalah ketimpangan — sebagian adalah noise sampling: selisih yang muncul karena grupnya kecil, bukan karena modelnya timpang. Alat untuk membedakannya ada tiga: interval kepercayaan (seberapa lebar rentang yang masih cocok dengan data), uji statistik (apakah selisihnya lebih besar dari yang diharapkan bila tidak ada perbedaan), dan n penyebutnya (berapa orang yang menjadi dasar rate itu). Ketiganya harus dibaca BERSAMA — satu saja tidak cukup.",
        "Nilai [notebook] — pertama, interval Wilson 95% untuk approval rate. EDUCATION Lainnya (n = 82, 48 disetujui): [47,7%; 68,6%], lebar 20,85 poin persen. Bandingkan dengan Pascasarjana (n = 2.130): [33,3%; 37,4%], lebar 4,06 poin persen — dan dengan perempuan (n = 3.598): [28,6%; 31,6%], lebar 2,99 poin persen. Bila Lainnya punya n = 2.000 dengan rate yang sama (58,5%), intervalnya menyempit menjadi [56,4%; 60,7%], lebar 4,31 poin persen — hampir LIMA KALI lebih sempit. Lebar interval berbanding terbalik dengan akar n: untuk mempersempit interval 5 kali lipat, n harus 25 kali lebih besar. Kedua, uji-z dua proporsi untuk SEX: selisih approval laki-laki dikurangi perempuan −3,93 poin persen, standard error 1,19 poin persen, z = −3,30, p = 0,001 — selisih SEX adalah SINYAL, bukan noise: peluang selisih sebesar ini muncul bila tidak ada perbedaan hanya 0,1%. Intervalnya pun tidak bersinggungan (laki-laki [24,4%; 27,9%], perempuan [28,6%; 31,6%]). Ketiga, n penyebut untuk TPR: Lainnya EDUCATION hanya punya 5 nasabah default (TP 3, FN 2) — SATU nasabah pindah kelompok mengubah TPR-nya 20 poin persen (dari 0,6000 menjadi 0,8000). Aturan M7.1: grup dengan nasabah default di bawah 30 orang TIDAK dipakai untuk vonis equal opportunity — di data ini, Lainnya (5) dan 60+ (23) masuk kategori itu.",
        "Gambar: gambar di bawah memplot lima interval Wilson — dan ceritanya terbaca dari PANJANG garisnya, bukan dari posisi titiknya. Tiga garis panjang (Lainnya EDUCATION, 60+, Lainnya MARRIAGE) adalah tiga grup yang angkanya paling tidak bisa dipercaya — dan ketiganya adalah grup kecil (n = 82, 76, 75). Dua garis pendek (Perempuan, Pascasarjana) adalah estimasi yang bisa dipercaya. Perhatikan: titik Lainnya EDUCATION (58,5%) adalah yang PALING JAUH dari garis keseluruhan — dan garisnya adalah yang PALING PANJANG. Kombinasi «paling ekstrem + paling tidak pasti» adalah tanda klasik noise yang menyamar sebagai temuan.",
        "Baik atau buruk: interval Wilson ini bagus karena ia jujur tentang ketidakpastian — ia tidak menyembunyikan bahwa 58,5% dari 82 orang bisa berarti apa saja dari 47,7% sampai 68,6%. Buruk bila dibaca sebagai «jadi tidak ada masalah di EDUCATION»: interval yang lebar tidak membuktikan «tidak ada ketimpangan» — ia membuktikan «tidak tahu». Yang membuktikan ketimpangan EDUCATION adalah grup BESAR-nya: SMA vs Pascasarjana (AIR robust 0,5922, keduanya n ribuan) — interval SMA [18,5%; 23,5%] dan Pascasarjana [33,3%; 37,4%] TIDAK bersinggungan sama sekali. Noise pada grup kecil dan sinyal pada grup besar bisa hidup berdampingan — dan audit yang baik melaporkan keduanya, bukan memilih salah satu.",
        "Mitigasi: aturan praktis tiga lapis. Lapis 1 — n grup di bawah 100: laporkan angkanya, beri label «n kecil», jangan jadikan vonis. Lapis 2 — untuk TPR/FNR: hitung JUMLAH nasabah default per grup (bukan hanya n grup); di bawah 30 default, jangan vonis equal opportunity. Lapis 3 — untuk selisih antar grup besar: laporkan intervalnya DAN uji statistiknya (selisih, standard error, p) — selisih 3,93 poin persen dengan p = 0,001 adalah sinyal; selisih yang sama dengan p = 0,40 adalah rumor. Dan bila ragu, kumpulkan data — bukan asumsi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Interval Wilson 95 persen approval rate: Perempuan 30,1 persen interval 28,6 sampai 31,6; Pascasarjana 35,3 persen interval 33,3 sampai 37,4; Lainnya EDUCATION 58,5 persen interval 47,7 sampai 68,6; 60 plus 19,7 persen interval 12,3 sampai 30,0; Lainnya MARRIAGE 18,7 persen interval 11,5 sampai 28,9">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Interval Wilson 95% — approval rate per grup (test 6.000)</text>
<line x1="90" y1="40" x2="90" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="190" y1="40" x2="190" y2="200" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="290" y1="40" x2="290" y2="200" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<text x="90" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text>
<text x="190" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">25%</text>
<text x="290" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text>
<text x="84" y="55" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Perempuan</text>
<line x1="204.4" y1="52" x2="216.4" y2="52" stroke="var(--c1)" stroke-width="2"/>
<line x1="204.4" y1="46" x2="204.4" y2="58" stroke="var(--c1)" stroke-width="2"/>
<line x1="216.4" y1="46" x2="216.4" y2="58" stroke="var(--c1)" stroke-width="2"/>
<circle cx="210.3" cy="52" r="4" fill="var(--c1)"/>
<text x="221.4" y="55" font-size="10" fill="var(--text)" font-family="var(--font-ui)">30,1% [28,6–31,6]</text>
<text x="84" y="89" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pascasarjana</text>
<line x1="223.2" y1="86" x2="239.4" y2="86" stroke="var(--c4)" stroke-width="2"/>
<line x1="223.2" y1="80" x2="223.2" y2="92" stroke="var(--c4)" stroke-width="2"/>
<line x1="239.4" y1="80" x2="239.4" y2="92" stroke="var(--c4)" stroke-width="2"/>
<circle cx="231.2" cy="86" r="4" fill="var(--c4)"/>
<text x="244.4" y="89" font-size="10" fill="var(--text)" font-family="var(--font-ui)">35,3% [33,3–37,4]</text>
<text x="84" y="123" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Lainnya EDU</text>
<line x1="280.9" y1="120" x2="364.3" y2="120" stroke="var(--c2)" stroke-width="2"/>
<line x1="280.9" y1="114" x2="280.9" y2="126" stroke="var(--c2)" stroke-width="2"/>
<line x1="364.3" y1="114" x2="364.3" y2="126" stroke="var(--c2)" stroke-width="2"/>
<circle cx="324.2" cy="120" r="4" fill="var(--c2)"/>
<text x="369.3" y="123" font-size="10" fill="var(--text)" font-family="var(--font-ui)">58,5% [47,7–68,6]</text>
<text x="84" y="157" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">60+</text>
<line x1="139.4" y1="154" x2="210.2" y2="154" stroke="var(--c2)" stroke-width="2"/>
<line x1="139.4" y1="148" x2="139.4" y2="160" stroke="var(--c2)" stroke-width="2"/>
<line x1="210.2" y1="148" x2="210.2" y2="160" stroke="var(--c2)" stroke-width="2"/>
<circle cx="169.0" cy="154" r="4" fill="var(--c2)"/>
<text x="215.2" y="157" font-size="10" fill="var(--text)" font-family="var(--font-ui)">19,7% [12,3–30,0]</text>
<text x="84" y="191" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Lainnya MAR</text>
<line x1="135.8" y1="188" x2="205.7" y2="188" stroke="var(--c2)" stroke-width="2"/>
<line x1="135.8" y1="182" x2="135.8" y2="194" stroke="var(--c2)" stroke-width="2"/>
<line x1="205.7" y1="182" x2="205.7" y2="194" stroke="var(--c2)" stroke-width="2"/>
<circle cx="164.7" cy="188" r="4" fill="var(--c2)"/>
<text x="210.7" y="191" font-size="10" fill="var(--text)" font-family="var(--font-ui)">18,7% [11,5–28,9]</text>
<text x="240" y="232" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Titik = approval rate; garis = interval Wilson 95% [notebook].</text>
<text x="240" y="248" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Garis panjang = bukti lemah; garis pendek = bukti kuat.</text>
</svg>`,
        alt: "Interval Wilson 95 persen approval rate: Perempuan 30,1 persen interval 28,6 sampai 31,6; Pascasarjana 35,3 persen interval 33,3 sampai 37,4; Lainnya EDUCATION 58,5 persen interval 47,7 sampai 68,6; 60 plus 19,7 persen interval 12,3 sampai 30,0; Lainnya MARRIAGE 18,7 persen interval 11,5 sampai 28,9.",
        caption: "Cara membaca: titik = approval rate grup itu; garis horizontal = interval Wilson 95% [notebook]. Tiga garis panjang (Lainnya EDUCATION, 60+, Lainnya MARRIAGE) adalah tiga grup kecil (n = 82, 76, 75) — angkanya paling tidak bisa dipercaya. Dua garis pendek (Perempuan, Pascasarjana) adalah estimasi yang bisa dipercaya. Titik paling ekstrem (Lainnya 58,5%) juga yang garisnya paling panjang — noise yang menyamar sebagai temuan.",
      },
      formula: String.raw`\hat{p} \pm 1{,}96\sqrt{\frac{\hat{p}(1-\hat{p})}{n}} \;\; \text{(pendekatan Wald; Wilson menggeser pusat dan mempersempit ujung)}`,
      formulaNote: "Interval kepercayaan untuk rate dari n orang: lebarnya mengecil sebanding 1/akar n. Wilson 95% yang dipakai lesson ini menggeser pusat estimasi dan tidak pernah keluar dari 0–1 (penting untuk rate dekat 0 atau 1, seperti Lainnya EDUCATION). Uji-z dua proporsi SEX: selisih −0,0393, SE 0,0119, z = −3,30, p = 0,001.",
      tasks: [],
    },
    {
      id: "ketidakpastian-bootstrap",
      eyebrow: "Langkah 12 · Ketidakpastian bootstrap",
      title: "Ketidakpastian bootstrap: «tidak signifikan» bukan berarti «tidak ada gap»",
      prose: [
        "Selisih SEX +3,93 poin persen adalah sinyal (uji-z, p = 0,001, langkah 11) — tapi «sinyal» tidak berkata SEBERAPA BESAR gap itu sebenarnya. Bootstrap menjawab pertanyaan itu: ulangi pengukuran 1.000 kali pada sampel ulang (resample) dari test 6.000 yang sama, dan lihat seberapa lebar sebaran hasilmu. Interval kepercayaan (CI) 95% yang dihasilkan bukan «jawaban yang benar» — ia adalah RENTANG nilai yang masih cocok dengan datamu. Gap yang CI-nya mencakup 0 BUKAN gap yang «tidak ada» — ia gap yang datamu tidak bisa bedakan dari 0. Dan gap yang CI-nya tidak mencakup 0 adalah gap yang datamu katakan «bukan nol» — dengan kepercayaan 95%.",
        "Nilai [notebook] — bootstrap 1.000 ulangan, seed 42, resample seluruh test 6.000; semua gap F−M (perempuan dikurangi laki-laki). Selisih approval: +3,93 poin persen, CI 95% [1,78; 6,22] — TIDAK mencakup 0: gap approval itu nyata. AIR SEX: 0,8693, CI [0,7978; 0,9391] — TIDAK mencakup 1: AIR di bawah 1 itu nyata (dan seluruh CI-nya di bawah 1, tapi batas atasnya 0,9391 masih di atas ambang 0,80 — jadi «nyata» tidak sama dengan «di bawah ambang»). Gap TPR: −0,0191, CI [−0,0498; 0,0110] — MENCakup 0: tidak bisa divonis. Gap FPR: −0,0383, CI [−0,0653; −0,0123] — TIDAK mencakup 0: gap FPR itu nyata. Gap ECE: +0,0012, CI [−0,0155; 0,0118] — mencakup 0 (dan rata-rata bootstrap-nya −0,0015, berlawanan tanda dengan titiknya — keduanya dekat 0, jadi tidak disimpulkan apa-apa). Gap Brier: −0,0143, CI [−0,0257; −0,0036] — TIDAK mencakup 0: gap Brier itu nyata. Gap PPV: −0,0168, CI [−0,0446; 0,0101] — mencakup 0: tidak bisa divonis. Empat dari tujuh gap nyata; tiga tidak bisa divonis — dan ketiganya tetap DILAPORKAN dengan CI-nya, bukan dihapus.",
        "Baik atau buruk: bootstrap CI bagus karena ia mengubah «sinyal vs noise» dari vonis biner menjadi RENTANG — kamu bisa melihat sendiri seberapa goyah tiap gap: CI approval selebar 4,44 poin persen, CI AIR selebar 0,1414. Buruk bila dibaca sebagai «CI mencakup 0 berarti tidak ada gap»: CI TPR [−0,0498; 0,0110] mencakup 0 DAN mencakup −0,0498 — gap TPR yang sebenarnya bisa sebesar −4,98 poin persen. «Tidak signifikan» berarti «data ini tidak cukup untuk membedakan», bukan «gapnya nol». Dan buruk bila CI dilaporkan tanpa n dan tanpa metode: CI dari n = 82 (Lainnya) selebar 0,2085, dari n = 2.000 selebar 0,0431 — lebar CI adalah informasi, bukan hiasan. Sebagai pembanding lebar: interval Wilson approval SEX — laki-laki [0,2443; 0,2794] lebar 0,0351; perempuan [0,2860; 0,3159] lebar 0,0299.",
        "Mitigasi: laporkan SETIAP gap dengan CI-nya — titik + interval, bukan titik saja. Dan bila kamu mengaudit BANYAK gap sekaligus (delapan belas sel irisan di langkah 9, tujuh metrik di langkah ini), ingat multiple comparisons: tiap CI 95% punya peluang 5% meleset sendirian — dari 18 sel, ~1 flag palsu diharapkan muncul secara kebetulan. Aturan praktisnya sama seperti di langkah 9: flag yang berdiri sendiri diselidiki; flag yang membentuk POLA ditindaklanjuti. Dan satu kalimat yang wajib kamu hafal: «tidak signifikan ≠ tidak ada gap» — yang tidak signifikan adalah BUKTI-MU, bukan gap-nya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Forest plot: selisih approval, TPR, FPR, PPV, ECE, Brier antara perempuan dan laki-laki dengan interval kepercayaan bootstrap 95 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Gap F−M (poin persen) dengan CI 95% bootstrap — 0 = tidak ada gap</text>
<line x1="250" y1="30" x2="250" y2="205" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="250" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0</text>
<text x="87" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−6</text>
<text x="169" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−3</text>
<text x="331" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+3</text>
<text x="413" y="222" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+6</text>
<text x="55" y="54" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Approval</text>
<line x1="298" y1="50" x2="419" y2="50" stroke="#1565c0" stroke-width="2"/>
<circle cx="357" cy="50" r="4" fill="#1565c0"/>
<text x="292" y="54" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+3,93 [1,78; 6,22]</text>
<text x="55" y="84" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">TPR</text>
<line x1="115" y1="80" x2="280" y2="80" stroke="#9e9e9e" stroke-width="2"/>
<circle cx="198" cy="80" r="4" fill="#9e9e9e"/>
<text x="286" y="84" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−1,91 [−4,98; 1,10]</text>
<text x="55" y="114" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">FPR</text>
<line x1="73" y1="110" x2="217" y2="110" stroke="#1565c0" stroke-width="2"/>
<circle cx="146" cy="110" r="4" fill="#1565c0"/>
<text x="223" y="114" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−3,83 [−6,53; −1,23]</text>
<text x="55" y="144" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">PPV</text>
<line x1="129" y1="140" x2="277" y2="140" stroke="#9e9e9e" stroke-width="2"/>
<circle cx="204" cy="140" r="4" fill="#9e9e9e"/>
<text x="283" y="144" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−1,68 [−4,46; 1,01]</text>
<text x="55" y="174" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">ECE</text>
<line x1="208" y1="170" x2="282" y2="170" stroke="#9e9e9e" stroke-width="2"/>
<circle cx="253" cy="170" r="4" fill="#9e9e9e"/>
<text x="288" y="174" font-size="9" fill="var(--text)" font-family="var(--font-ui)">+0,12 [−1,55; 1,18]</text>
<text x="55" y="204" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Brier</text>
<line x1="180" y1="200" x2="240" y2="200" stroke="#1565c0" stroke-width="2"/>
<circle cx="211" cy="200" r="4" fill="#1565c0"/>
<text x="246" y="204" font-size="9" fill="var(--text)" font-family="var(--font-ui)">−1,43 [−2,57; −0,36]</text>
<text x="240" y="244" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Biru = CI tidak mencakup 0 (gap nyata). Abu-abu = CI mencakup 0 (tidak bisa divonis — bukan «tidak ada gap»).</text>
</svg>`,
        alt: "Forest plot: selisih approval, TPR, FPR, PPV, ECE, Brier antara perempuan dan laki-laki dengan interval kepercayaan bootstrap 95 persen.",
        caption: "Cara membaca: titik = gap F−M (poin persen), garis = CI 95% bootstrap (1.000 ulangan, seed 42). Biru = CI tidak mencakup 0 (approval, FPR, Brier — gap nyata). Abu-abu = CI mencakup 0 (TPR, PPV, ECE — tidak bisa divonis, bukan «tidak ada gap»). AIR SEX tidak digambar di sini (satuannya rasio, bukan poin persen): 0,8693, CI [0,7978; 0,9391] — tidak mencakup 1.",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: AIR dan interval Wilson dari angka kanonis",
      prose: [
        "Sekarang hitung sendiri — dari approval rate kanonis GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. EDUCATION: Pascasarjana 0,3531 (n = 2.130), Universitas 0,2516, SMA 0,2091, Lainnya 0,5854 (n = 82; 48 dari 82 disetujui). Rumus AIR dari langkah 4; rumus Wilson dari langkah 11 (z 95% = 1,96).",
        "Hasil yang diharapkan [lab]: air_pasca=0.6032; air_edu=0.3572; ci_lo=0.4773; ci_hi=0.6858; ci_width=0.2085. Tiga TODO: air_pasca (Pascasarjana dibagi Lainnya), air_edu (terendah dibagi tertinggi), dan interval Wilson Lainnya (pusat digeser, lalu bagi dengan penyebut).",
        "Setelah lab jalan, perhatikan apa arti angka-angka itu: AIR Pascasarjana 0,6032 memakai Lainnya (n = 82) sebagai pembanding — dan interval Lainnya selebar 0,2085 berarti pembanding itu sendiri goyah antara 47,7% dan 68,6%. Bila interval Lainnya menyempit (langkah 11: n = 2.000 memberi lebar 0,0431), AIR Pascasarjana akan jauh lebih stabil. Itulah yang harus kamu bawa pulang: AIR yang dihitung dari pembanding kecil adalah AIR yang goyah.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi air_pasca: approval Pascasarjana / approval Lainnya" },
        { id: "t2", text: "Lengkapi air_edu: approval EDUCATION terendah / tertinggi" },
        { id: "t3", text: "Lengkapi ci_lo, ci_hi, ci_width: interval Wilson 95% untuk Lainnya (k=48, n=82), lalu jalankan dan bandingkan dengan angka kanonis (0,6032 / 0,3572 / [0,4773; 0,6858])" },
      ],
      expected: "air_pasca=0.6032\nair_edu=0.3572\nci_lo=0.4773\nci_hi=0.6858\nci_width=0.2085",
      hints: [
        "air_pasca = APPROVAL_EDU['Pascasarjana'] / APPROVAL_EDU['Lainnya'] — pembaginya adalah approval TERTINGGI (Lainnya 0,5854).",
        "air_edu = min(APPROVAL_EDU.values()) / max(APPROVAL_EDU.values()) — terendah SMA 0,2091, tertinggi Lainnya 0,5854.",
        "Wilson: p = k/n; denom = 1 + z^2/n; centre = p + z^2/(2n); margin = z * akar(p(1-p)/n + z^2/(4n^2)); lalu (centre - margin)/denom dan (centre + margin)/denom, dibulatkan 4 desimal.",
      ],
      code: {
        starter: `# Lab 1: AIR + interval Wilson 95% dari angka kanonis [notebook]
# Approval EDUCATION (GBM terkalibrasi, threshold 0,10, test 6.000):
#   Pascasarjana 0.3531 (n=2130) | Universitas 0.2516 | SMA 0.2091 | Lainnya 0.5854 (n=82)
#   k Lainnya = 48 dari 82 disetujui; z 95% = 1.96
import math
APPROVAL_EDU = {"Pascasarjana": 0.3531, "Universitas": 0.2516, "SMA": 0.2091, "Lainnya": 0.5854}
K_LAINNYA = 48
N_LAINNYA = 82
Z = 1.96

air_pasca = 0.0  # TODO: approval Pascasarjana / approval Lainnya
air_edu = 0.0  # TODO: approval EDUCATION terendah / tertinggi
p = K_LAINNYA / N_LAINNYA
denom = 1 + Z * Z / N_LAINNYA
centre = p + Z * Z / (2 * N_LAINNYA)
margin = Z * math.sqrt(p * (1 - p) / N_LAINNYA + Z * Z / (4 * N_LAINNYA * N_LAINNYA))
ci_lo = 0.0  # TODO: (centre - margin) / denom, dibulatkan 4 desimal
ci_hi = 0.0  # TODO: (centre + margin) / denom, dibulatkan 4 desimal
ci_width = 0.0  # TODO: ci_hi - ci_lo, dibulatkan 4 desimal
print(f"air_pasca={air_pasca:.4f}")
print(f"air_edu={air_edu:.4f}")
print(f"ci_lo={ci_lo:.4f}")
print(f"ci_hi={ci_hi:.4f}")
print(f"ci_width={ci_width:.4f}")`,
        lockLines: 9,
        solution: `# Lab 1: AIR + interval Wilson 95% dari angka kanonis [notebook]
# Approval EDUCATION (GBM terkalibrasi, threshold 0,10, test 6.000):
#   Pascasarjana 0.3531 (n=2130) | Universitas 0.2516 | SMA 0.2091 | Lainnya 0.5854 (n=82)
#   k Lainnya = 48 dari 82 disetujui; z 95% = 1.96
import math
APPROVAL_EDU = {"Pascasarjana": 0.3531, "Universitas": 0.2516, "SMA": 0.2091, "Lainnya": 0.5854}
K_LAINNYA = 48
N_LAINNYA = 82
Z = 1.96

air_pasca = APPROVAL_EDU["Pascasarjana"] / APPROVAL_EDU["Lainnya"]
air_edu = min(APPROVAL_EDU.values()) / max(APPROVAL_EDU.values())
p = K_LAINNYA / N_LAINNYA
denom = 1 + Z * Z / N_LAINNYA
centre = p + Z * Z / (2 * N_LAINNYA)
margin = Z * math.sqrt(p * (1 - p) / N_LAINNYA + Z * Z / (4 * N_LAINNYA * N_LAINNYA))
ci_lo = round((centre - margin) / denom, 4)
ci_hi = round((centre + margin) / denom, 4)
ci_width = round(ci_hi - ci_lo, 4)
print(f"air_pasca={air_pasca:.4f}")
print(f"air_edu={air_edu:.4f}")
print(f"ci_lo={ci_lo:.4f}")
print(f"ci_hi={ci_hi:.4f}")
print(f"ci_width={ci_width:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "air_pasca", value: 0.6032, tol: 0.00005, label: "`air_pasca` seharusnya 0.6032", msg: "AIR Pascasarjana = 0,3531 / 0,5854 = 0,6032 — di bawah 0,80, flag (dengan catatan pembandingnya n = 82)." },
          { kind: "equal", task: "t2", name: "air_edu", value: 0.3572, tol: 0.00005, label: "`air_edu` seharusnya 0.3572", msg: "AIR EDUCATION = 0,2091 / 0,5854 = 0,3572 — terendah SMA dibagi tertinggi Lainnya." },
          { kind: "equal", task: "t3", name: "ci_lo", value: 0.4773, tol: 0.00005, label: "`ci_lo` seharusnya 0.4773", msg: "Ujung bawah Wilson Lainnya (48 dari 82): 0,4773." },
          { kind: "equal", task: "t3", name: "ci_hi", value: 0.6858, tol: 0.00005, label: "`ci_hi` seharusnya 0.6858", msg: "Ujung atas Wilson Lainnya (48 dari 82): 0,6858." },
          { kind: "stdout_matches", task: "t3", pattern: "ci_width=0\\.2085", label: "Output menampilkan ci_width=0.2085", msg: "Lebar interval Lainnya 0,2085 — bandingkan dengan Pascasarjana (0,0406) dan perempuan (0,0299): bukti dari 82 orang jauh lebih goyah." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: stratifikasi Simpson dan AIR yang bergerak bersama threshold",
      prose: [
        "Sekarang hitung dua hal yang membuktikan bahwa angka global tidak pernah cukup — dari angka kanonis [notebook]. Pertama, selisih approval perempuan dikurangi laki-laki per AGE band (poin persen): di bawah 30 tahun 0,0806; 30–39 tahun 0,0327; 40–49 tahun 0,0081; 50–59 tahun 0,0007; 60+ tahun 0,0056; selisih global 0,0393. Kedua, AIR SEX per threshold: 0,05 menjadi 0,9186; 0,10 menjadi 0,8693; 0,20 menjadi 0,9431; 0,50 menjadi 0,9898.",
        "Hasil yang diharapkan [lab]: max_gap_band=below30; max_gap=0.0806; min_gap=0.0007; concentration=0.0413; air_range=0.1205. Tiga TODO: band dengan gap terbesar dan terkecil, seberapa jauh gap terbesar di atas global (concentration), dan rentang AIR antar threshold (tertinggi dikurangi terendah).",
        "Setelah lab jalan, perhatikan apa arti angka-angka itu: concentration 0,0413 berarti gap pada nasabah muda LEBIH DARI DUA KALI LIPAT angka global (0,0806 vs 0,0393) — kebijakan dari angka global akan salah sasaran. Dan air_range 0,1205 berarti AIR SEX bergerak 12 poin persen hanya karena threshold digeser — jadi «memperbaiki» ketimpangan dengan menaikkan threshold (di 0,50 AIR-nya 0,9898, hampir adil sempurna) adalah ilusi: di 0,50 labanya −NT$18.994.456 (M6.4). Keadilan yang dibeli dengan menghancurkan laba bukan keadilan — itu threshold yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi max_gap_band dan max_gap: band AGE dengan selisih F-M terbesar" },
        { id: "t2", text: "Lengkapi min_gap dan concentration: gap terkecil, dan max_gap - GLOBAL_GAP" },
        { id: "t3", text: "Lengkapi air_range: AIR SEX tertinggi - terendah di antara empat threshold, lalu jalankan dan bandingkan dengan angka kanonis (0,0806 / 0,0007 / 0,0413 / 0,1205)" },
      ],
      expected: "max_gap_band=below30\nmax_gap=0.0806\nmin_gap=0.0007\nconcentration=0.0413\nair_range=0.1205",
      hints: [
        "max_gap_band = max(GAPS_AGE, key=GAPS_AGE.get) — kunci 'below30' berarti di bawah 30 tahun.",
        "min_gap = min(GAPS_AGE.values()); concentration = max_gap - GLOBAL_GAP.",
        "air_range = max(AIR_THR.values()) - min(AIR_THR.values()) — tertinggi di 0,50 (0,9898), terendah di 0,10 (0,8693).",
      ],
      code: {
        starter: `# Lab 2: stratifikasi Simpson + AIR yang bergerak bersama threshold [notebook]
# Selisih approval perempuan - laki-laki per AGE band (poin persen):
#   below30: 0.0806 | 30-39: 0.0327 | 40-49: 0.0081 | 50-59: 0.0007 | 60plus: 0.0056
# Selisih global: 0.0393. AIR SEX per threshold:
#   0.05: 0.9186 | 0.10: 0.8693 | 0.20: 0.9431 | 0.50: 0.9898
GAPS_AGE = {"below30": 0.0806, "30-39": 0.0327, "40-49": 0.0081, "50-59": 0.0007, "60plus": 0.0056}
GLOBAL_GAP = 0.0393
AIR_THR = {0.05: 0.9186, 0.10: 0.8693, 0.20: 0.9431, 0.50: 0.9898}

max_gap_band = ""  # TODO: band AGE dengan gap terbesar
max_gap = 0.0  # TODO: gap terbesar
min_gap = 0.0  # TODO: gap terkecil
concentration = 0.0  # TODO: max_gap - GLOBAL_GAP
air_range = 0.0  # TODO: AIR tertinggi - AIR terendah di AIR_THR
print(f"max_gap_band={max_gap_band}")
print(f"max_gap={max_gap:.4f}")
print(f"min_gap={min_gap:.4f}")
print(f"concentration={concentration:.4f}")
print(f"air_range={air_range:.4f}")`,
        lockLines: 8,
        solution: `# Lab 2: stratifikasi Simpson + AIR yang bergerak bersama threshold [notebook]
# Selisih approval perempuan - laki-laki per AGE band (poin persen):
#   below30: 0.0806 | 30-39: 0.0327 | 40-49: 0.0081 | 50-59: 0.0007 | 60plus: 0.0056
# Selisih global: 0.0393. AIR SEX per threshold:
#   0.05: 0.9186 | 0.10: 0.8693 | 0.20: 0.9431 | 0.50: 0.9898
GAPS_AGE = {"below30": 0.0806, "30-39": 0.0327, "40-49": 0.0081, "50-59": 0.0007, "60plus": 0.0056}
GLOBAL_GAP = 0.0393
AIR_THR = {0.05: 0.9186, 0.10: 0.8693, 0.20: 0.9431, 0.50: 0.9898}

max_gap_band = max(GAPS_AGE, key=GAPS_AGE.get)
max_gap = max(GAPS_AGE.values())
min_gap = min(GAPS_AGE.values())
concentration = max_gap - GLOBAL_GAP
air_range = max(AIR_THR.values()) - min(AIR_THR.values())
print(f"max_gap_band={max_gap_band}")
print(f"max_gap={max_gap:.4f}")
print(f"min_gap={min_gap:.4f}")
print(f"concentration={concentration:.4f}")
print(f"air_range={air_range:.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "max_gap_band=below30", label: "Output menampilkan max_gap_band=below30", msg: "Gap F-M terbesar ada pada nasabah di bawah 30 tahun (0,0806) — ketimpangan terkonsentrasi di nasabah muda." },
          { kind: "equal", task: "t1", name: "max_gap", value: 0.0806, tol: 0.00005, label: "`max_gap` seharusnya 0.0806", msg: "Gap terbesar 0,0806 (di bawah 30 tahun) — lebih dari dua kali lipat angka global 0,0393." },
          { kind: "equal", task: "t2", name: "min_gap", value: 0.0007, tol: 0.00005, label: "`min_gap` seharusnya 0.0007", msg: "Gap terkecil 0,0007 (50–59 tahun) — praktis nol: di band ini tidak ada ketimpangan SEX." },
          { kind: "equal", task: "t2", name: "concentration", value: 0.0413, tol: 0.00005, label: "`concentration` seharusnya 0.0413", msg: "0,0806 − 0,0393 = 0,0413 — gap muda melebihi global sebesar itu." },
          { kind: "equal", task: "t3", name: "air_range", value: 0.1205, tol: 0.00005, label: "`air_range` seharusnya 0.1205", msg: "AIR SEX bergerak 0,9898 − 0,8693 = 0,1205 antar threshold — AIR bergantung pada threshold, bukan sifat model semata." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 15 · Lab 3",
      title: "Lab: audit irisan — group_key dan gap yang disembunyikan angka global",
      prose: [
        "Lab ketiga menghitung audit irisan dari angka kanonis [notebook]. Approval rate SEX × EDUCATION, test 6.000, GBM terkalibrasi, threshold 0,10 — tertinggi Perempuan × Lainnya 0,6140 (n = 57, flag n < 100). Laki-laki × SMA: approval 0,1630 (n = 411). AIR global SEX: 0,8693. Tugasmu: hitung AIR Laki-laki × SMA dari dua approval rate itu, hitung seberapa besar gap yang disembunyikan angka global, dan hitung berapa sel kecil (n < 100) di antara sel-sel yang tercantum di N (termasuk Laki-laki × Lainnya n = 25; Perempuan × Lainnya n = 57; Laki-laki × 60+ n = 36; Perempuan × 60+ n = 40).",
        "Hasil yang diharapkan [lab]: air_laki_sma=0.2655; gap_tersembunyi=0.6038; small_cells=4. Bacalah ketiganya berdampingan: AIR global 0,8693 tampak «hampir adil» — tapi irisan terendahnya 0,2655, selisih 0,6038. Itulah yang disembunyikan angka global: bukan ketimpangan yang hilang, melainkan ketimpangan yang dirata-rata. Dan keempat sel kecil itu dilaporkan — tidak divonis.",
        "Setelah lab jalan, bandingkan dengan langkah 9: flag yang berdiri sendiri diselidiki; flag yang membentuk POLA (semua sel laki-laki SMA/50+/60+ di bawah 0,65) ditindaklanjuti.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi air_laki_sma: approval Laki-laki x SMA dibagi approval tertinggi (Perempuan x Lainnya)" },
        { id: "t2", text: "Lengkapi gap_tersembunyi: AIR global SEX dikurangi air_laki_sma" },
        { id: "t3", text: "Lengkapi small_cells: jumlah sel di N yang n-nya di bawah 100" },
      ],
      expected: "air_laki_sma=0.2655\ngap_tersembunyi=0.6038\nsmall_cells=4",
      hints: [
        "AIR sel = approval sel / approval tertinggi dalam tabel yang sama: 0,1630 / 0,6140 = 0,2655.",
        "Gap yang disembunyikan = 0,8693 − 0,2655 = 0,6038 — selisih AIR global dengan irisan terendah.",
        "Keempat sel: n = 25, 57, 36, 40 — semuanya di bawah 100, jadi small_cells = 4.",
      ],
      code: {
        starter: `# Lab 3 — audit irisan (intersectional audit) [notebook]
# Approval rate kanonis, test 6.000, GBM terkalibrasi, threshold 0,10
# SEX x EDUCATION: tertinggi Perempuan x Lainnya 0,6140 (n=57, flag n<100); SEX x AGE: sel kecil L x 60+ (n=36), P x 60+ (n=40)
APPR = {
    "L x SMA": 0.1630, "L x Lainnya": 0.5200,
    "P x Lainnya": 0.6140, "P x SMA": 0.2405,
}
N = {"L x SMA": 411, "L x Lainnya": 25, "P x Lainnya": 57, "P x SMA": 603, "L x 60+": 36, "P x 60+": 40}
AIR_GLOBAL_SEX = 0.8693

air_laki_sma = 0.0  # TODO: APPR["L x SMA"] / APPR["P x Lainnya"]
gap_tersembunyi = 0.0  # TODO: AIR_GLOBAL_SEX - air_laki_sma
small_cells = 0  # TODO: jumlah sel di N yang n-nya di bawah 100
print(f"air_laki_sma={air_laki_sma:.4f}")
print(f"gap_tersembunyi={gap_tersembunyi:.4f}")
print(f"small_cells={small_cells}")`,
        lockLines: 10,
        solution: `# Lab 3 — audit irisan (intersectional audit) [notebook]
# Approval rate kanonis, test 6.000, GBM terkalibrasi, threshold 0,10
# SEX x EDUCATION: tertinggi Perempuan x Lainnya 0,6140 (n=57, flag n<100); SEX x AGE: sel kecil L x 60+ (n=36), P x 60+ (n=40)
APPR = {
    "L x SMA": 0.1630, "L x Lainnya": 0.5200,
    "P x Lainnya": 0.6140, "P x SMA": 0.2405,
}
N = {"L x SMA": 411, "L x Lainnya": 25, "P x Lainnya": 57, "P x SMA": 603, "L x 60+": 36, "P x 60+": 40}
AIR_GLOBAL_SEX = 0.8693

air_laki_sma = APPR["L x SMA"] / APPR["P x Lainnya"]
gap_tersembunyi = AIR_GLOBAL_SEX - air_laki_sma
small_cells = sum(1 for n in N.values() if n < 100)
print(f"air_laki_sma={air_laki_sma:.4f}")
print(f"gap_tersembunyi={gap_tersembunyi:.4f}")
print(f"small_cells={small_cells}")`,
        checks: [
          { kind: "equal", task: "t1", name: "air_laki_sma", value: 0.2655, tol: 0.0005, label: "`air_laki_sma` seharusnya 0.2655", msg: "AIR Laki-laki × SMA: 0,1630 / 0,6140 = 0,2655 — irisan terparah di tabel SEX × EDUCATION (n = 411, bisa divonis)." },
          { kind: "equal", task: "t2", name: "gap_tersembunyi", value: 0.6038, tol: 0.0005, label: "`gap_tersembunyi` seharusnya 0.6038", msg: "AIR global SEX 0,8693 menyembunyikan irisan 0,2655 — selisih 0,6038. Angka global merata-ratakan ketimpangan, bukan menghilangkannya." },
          { kind: "equal", task: "t3", name: "small_cells", value: 4, tol: 0, label: "`small_cells` seharusnya 4", msg: "Keempat sel (n = 25, 57, 36, 40) di bawah 100 — dilaporkan, tidak divonis." },
        ],
      },
    },
    {
      id: "lab4",
      eyebrow: "Langkah 16 · Lab 4",
      title: "Lab (ringkas): checklist kualitas data — tandai fitur yang perlu investigasi",
      prose: [
        "Lab keempat menerapkan checklist kualitas data (langkah 3) pada angka kanonis [notebook, data penuh 30.000 baris]. Kode invalid EDUCATION (0/5/6): 345 baris. BILL_AMT negatif (salah satu dari 6): 1.930 baris. Tugasmu: hitung kedua persentasenya, dan tandai fitur yang perlu investigasi — EDUCATION, karena kode invalid-nya mencampur grup «Lainnya» (73,72% dari grup itu).",
        "Hasil yang diharapkan [lab]: invalid_edu_pct=1.15; bill_neg_pct=6.43; investigasi=EDUCATION. Bacalah ketiganya berdampingan: 1,15% tampak kecil — tapi ia terkonsentrasi di SATU grup (Lainnya), sehingga 73,72% grup itu adalah kode yang berbeda makna. Dan 6,43% BILL_AMT negatif tampak seperti error — tapi ia plausibel sebagai kredit/kelebihan bayar. Checklist yang baik membedakan keduanya: yang satu perlu investigasi, yang satu perlu dipahami.",
        "Setelah lab jalan, bandingkan dengan langkah 3: sebelum audit apa pun, jalankan checklist ini per grup — dan laporkan hasilnya di samping tabel audit.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi invalid_edu_pct: 345 dari 30.000 baris, dalam persen" },
        { id: "t2", text: "Lengkapi bill_neg_pct: 1.930 dari 30.000 baris, dalam persen" },
        { id: "t3", text: "Lengkapi investigasi: fitur yang kode invalid-nya mencampur grup Lainnya" },
      ],
      expected: "invalid_edu_pct=1.15\nbill_neg_pct=6.43\ninvestigasi=EDUCATION",
      hints: [
        "345 / 30.000 × 100 = 1,15%.",
        "1.930 / 30.000 × 100 = 6,43% — BILL_AMT negatif plausibel (kredit/kelebihan bayar), bukan error.",
        "EDUCATION: kode 0/5/6 (345 baris) semuanya masuk grup «Lainnya» — 73,72% dari grup itu.",
      ],
      code: {
        starter: `# Lab 4 — checklist kualitas data per grup [notebook, data penuh 30.000 baris]
# Kode invalid EDUCATION (0/5/6): 345 baris; BILL_AMT negatif (salah satu dari 6): 1.930 baris
N_TOTAL = 30000
N_EDU_INVALID = 345
N_BILL_NEG = 1930

invalid_edu_pct = 0.0  # TODO: N_EDU_INVALID / N_TOTAL * 100
bill_neg_pct = 0.0  # TODO: N_BILL_NEG / N_TOTAL * 100
investigasi = ""  # TODO: "EDUCATION" — kode invalid mencampur grup Lainnya (73,72% grup itu)
print(f"invalid_edu_pct={invalid_edu_pct:.2f}")
print(f"bill_neg_pct={bill_neg_pct:.2f}")
print(f"investigasi={investigasi}")`,
        lockLines: 6,
        solution: `# Lab 4 — checklist kualitas data per grup [notebook, data penuh 30.000 baris]
# Kode invalid EDUCATION (0/5/6): 345 baris; BILL_AMT negatif (salah satu dari 6): 1.930 baris
N_TOTAL = 30000
N_EDU_INVALID = 345
N_BILL_NEG = 1930

invalid_edu_pct = N_EDU_INVALID / N_TOTAL * 100
bill_neg_pct = N_BILL_NEG / N_TOTAL * 100
investigasi = "EDUCATION"
print(f"invalid_edu_pct={invalid_edu_pct:.2f}")
print(f"bill_neg_pct={bill_neg_pct:.2f}")
print(f"investigasi={investigasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "invalid_edu_pct", value: 1.15, tol: 0.01, label: "`invalid_edu_pct` seharusnya 1.15", msg: "Kode invalid EDUCATION: 345 / 30.000 = 1,15% — kecil secara keseluruhan, tapi 73,72% dari grup Lainnya." },
          { kind: "equal", task: "t2", name: "bill_neg_pct", value: 6.43, tol: 0.01, label: "`bill_neg_pct` seharusnya 6.43", msg: "BILL_AMT negatif: 1.930 / 30.000 = 6,43% — plausibel sebagai kredit/kelebihan bayar, bukan error." },
          { kind: "stdout_matches", task: "t3", pattern: "investigasi=EDUCATION", label: "Output menampilkan investigasi=EDUCATION", msg: "EDUCATION perlu investigasi: kode invalid-nya mencampur grup Lainnya." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 17 · Checkpoint",
      title: "Checkpoint: ketimpangan punya alamat — cari alamatnya sebelum memperbaiki",
      prose: [
        "Rangkuman: lima sumber bias — measurement (fitur/label diukur berbeda; perempuan tampak lebih rendah risiko pada keempat fitur: limit lebih besar NT$170.286 vs NT$164.482, PAY_MEAN −0,2278 vs −0,1053, utilisasi 0,3987 vs 0,4661, keterlambatan 0,7932 vs 0,8805; base rate laki-laki lebih tinggi 0,2417 vs 0,2078 di data penuh), representation (Lainnya EDUCATION 386 dari 24.000 train, MARRIAGE Lainnya 302, 60+ 263 — ketiganya menempati posisi ekstrem di tabelnya), label (base rate SMA 0,2574 vs Pascasarjana 0,1901 sejalan dengan approval — tapi tidak bisa dibedakan dari bias label dengan data saja), selection (PSI train vs test 0,0001–0,0008 dan PSI M2 G9 0,0104 — stabil; tapi yang ditolak dulu tidak ada di data), aggregation (selisih SEX global +3,93 pp terkonsentrasi di bawah 30 tahun +8,06 pp dan hilang di 50–59 tahun +0,07 pp). Tabel audit lengkap (test 6.000, GBM terkalibrasi, threshold 0,10): SEX laki-laki 26,1% (n = 2.402, AIR 0,8693, FPR 0,6817, FNR 0,0749) vs perempuan 30,1% (n = 3.598); EDUCATION Pascasarjana 35,3% (n = 2.130, AIR 0,6032, FPR 0,5867) vs SMA 20,9% (n = 1.014, AIR 0,3572, FPR 0,7463) vs Lainnya 58,5% (n = 82, interval Wilson [47,7%; 68,6%]); MARRIAGE Lainnya 18,7% (n = 75, AIR 0,6403); AGE 60+ 19,7% (n = 76, AIR 0,5960, ECE 0,1208). Workflow audit: definisikan grup → ukur (semua metrik + n) → selidiki sumber dengan taksonomi → putuskan ambang SEBELUM melihat angka → dokumentasikan. Noise vs sinyal: selisih SEX adalah sinyal (z = −3,30, p = 0,001, interval tidak bersinggungan); TPR Lainnya 0,6000 dari 5 nasabah default adalah noise (satu orang = 20 poin persen); aturan n di bawah 100 = «n kecil», default di bawah 30 = jangan vonis. Lab: AIR Pascasarjana 0,6032, AIR EDUCATION 0,3572, Wilson Lainnya [0,4773; 0,6858] lebar 0,2085; gap Simpson terbesar di bawah 30 tahun 0,0806, terkecil 50–59 tahun 0,0007, AIR SEX bergerak 0,1205 antar threshold (0,8693 di 0,10 sampai 0,9898 di 0,50). Koreksi terhadap catatan pengunci: n = 82 adalah n grup Lainnya (pembanding), BUKAN n Pascasarjana (n = 2.130) — flag-nya benar, atribusi n-nya yang dikoreksi di lesson ini mengikuti M7.1. Audit irisan [notebook]: Laki-laki × SMA AIR 0,2655 — angka global 0,8693 menyembunyikan irisan terparah. Bootstrap [notebook]: «tidak signifikan ≠ tidak ada gap» (TPR CI mencakup 0). Kualitas data [notebook]: 0 missing; EDUCATION invalid 345 baris mencampur grup Lainnya.",
        "Guided task di Colab — notebook mlf-m72-guided-task.ipynb mereplikasi semua angka audit lesson ini dari data UCI: flagship GBM terkalibrasi, tabel audit SEX/EDUCATION/MARRIAGE/AGE dengan n per grup, interval Wilson dan uji-z, stratifikasi Simpson, serta AIR per threshold. Tautan Colab: https://colab.research.google.com/drive/1R4e28RIBr-3PsN4gj_9o6-Yz7FO4vE1X",
        "Lanjut: MLF-M7.3 — Explainability (SHAP/LIME): setelah tahu DI MANA ketimpangannya dan DARI MANA asalnya, pertanyaan berikutnya adalah MENGAPA model memutuskan begitu untuk satu nasabah — dan fitur mana yang mendorong keputusannya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "EDUCATION: Pascasarjana approval 35,3% (n = 2.130), Lainnya 58,5% (n = 82) — AIR Pascasarjana 0,6032, di bawah 0,80. Mengapa lesson ini menandai angka ini sebagai flag yang harus diselidiki, bukan sebagai vonis yang langsung dimitigasi?",
          options: [
            { text: "Karena 0,6032 masih di atas ambang 0,80 — tidak perlu ditindaklanjuti", why: "Salah: 0,6032 JAUH di bawah 0,80 — justru itu yang membuatnya tampak mendesak. Alasan flag-nya bukan AIR-nya, melainkan n pembandingnya." },
            { text: "Karena pembandingnya (Lainnya) hanya n = 82 — interval Wilson-nya [47,7%; 68,6%] selebar 20,85 poin persen, jadi AIR-nya goyah", why: "Benar: flag-nya benar (0,6032 di bawah 0,80), tapi pembanding tertinggi Lainnya berasal dari 82 orang dengan interval selebar 20,85 poin persen. Tindakan yang benar adalah selidiki dulu — dan AIR robust tanpa Lainnya (SMA vs Pascasarjana 0,5922) tetap flag, jadi ketimpangan EDUCATION-nya nyata.", correct: true },
            { text: "Karena Pascasarjana n-nya hanya 82 — terlalu kecil untuk vonis", why: "Salah arah: n Pascasarjana = 2.130 (grup BESAR). Yang n-nya 82 adalah grup Lainnya, pembanding tertinggi dalam perhitungan AIR itu — koreksi ini dicatat terbuka di lesson ini mengikuti M7.1." },
            { text: "Karena AIR 0,6032 dihitung dari model yang salah — seharusnya memakai GBM mentah", why: "Salah: AIR 0,6032 dihitung dari model keputusan lesson ini (GBM terkalibrasi, threshold 0,10) dengan definisi yang sama seperti M7.1. Kalibrasi Platt memang monoton — ranking dan ROC-AUC nyaris sama (0,7823 vs 0,7816) — tetapi approval pada threshold TETAP 0,10 tetap bergeser: GBM mentah menyetujui 29,85% (n = 1.791) vs terkalibrasi 28,50% (n = 1.710), selisih 1,35 poin persen; AIR SEX 0,8390 vs 0,8694. Jadi varian modelnya mengubah angka — dan angka yang dilaporkan lesson ini adalah angka model keputusan (terkalibrasi)." },
          ],
        },
        {
          q: "Tiga metrik menunjuk grup yang sama — SMA: approval terendah di antara grup besar (20,9%), FPR tertinggi (0,7463 vs Pascasarjana 0,5867), ECE terburuk di antara grup besar (0,0362) dan Brier 0,1609. Apa kesimpulan yang benar?",
          options: [
            { text: "SMA adalah prioritas penyelidikan pertama — tiga metrik independen menunjuk grup yang sama, semuanya dengan n ribuan", why: "Benar: SMA n = 1.014 (test), 3.903 (train) — bukan artefak n kecil. Approval, FPR, dan kalibrasi menunjuk arah yang sama: grup ini paling jarang disetujui, paling sering salah ditolak, dan probabilitasnya paling tidak bisa dipercaya di antara grup besar EDUCATION (ECE 0,0362).", correct: true },
            { text: "SMA hanya gagal AIR karena Lainnya (n = 82) — tanpa Lainnya, SMA pasti lolos", why: "Salah: tanpa Lainnya, AIR EDUCATION 0,5922 (SMA vs Pascasarjana) — MASIH flag, jauh di bawah 0,80. Flag EDUCATION bukan artefak satu grup kecil." },
            { text: "SMA harus langsung dimitigasi dengan threshold per grup sebelum penyelidikan", why: "Salah urutan: workflow audit (langkah 9) menuntut selidiki sumber DULU (langkah 3–8) sebelum mitigasi (M7.4). Mitigasi tanpa diagnosis sumber berisiko memperbaiki hal yang salah." },
            { text: "Tidak ada kesimpulan — ECE 0,0362 terlalu kecil untuk berarti apa-apa", why: "Salah: ECE SMA 0,0362 adalah yang terburuk di antara grup besar (Universitas 0,0100, Pascasarjana 0,0210) — dan Brier-nya 0,1609 juga terburuk. Kecil dalam nilai absolut, tapi relatif terhadap grup lain ia menonjol." },
          ],
        },
        {
          q: "Selisih approval perempuan dikurangi laki-laki: global +3,93 poin persen; di bawah 30 tahun +8,06; 50–59 tahun +0,07. Apa yang ditunjukkan stratifikasi ini?",
          options: [
            { text: "Ketimpangan SEX terkonsentrasi di nasabah muda dan praktis hilang di 50–59 tahun — angka global menyembunyikan komposisi itu", why: "Benar: +8,06 pada di bawah 30 tahun vs +0,07 pada 50–59 tahun. Kebijakan dari angka global akan salah sasaran di kedua ujung: kompensasi di tempat yang tidak timpang, terlalu sedikit di tempat yang paling timpang.", correct: true },
            { text: "Tidak ada ketimpangan SEX sama sekali — selisih global +3,93 adalah artefak agregasi", why: "Salah: selisih global +3,93 adalah sinyal (uji-z p = 0,001, interval tidak bersinggungan). Stratifikasi menjelaskan KOMPOSISINYA, bukan menghapusnya." },
            { text: "Perempuan muda didiskriminasi — model menolak perempuan muda lebih sering", why: "Terbalik: selisihnya positif berarti perempuan disetujui LEBIH SERING — pada di bawah 30 tahun, perempuan 29,44% vs laki-laki 21,38%. Yang dirugikan di sini adalah laki-laki muda, bukan perempuan muda." },
            { text: "Stratifikasi membuktikan paradoks Simpson dengan pembalikan tanda di data ini", why: "Salah: di data ini TIDAK terjadi pembalikan tanda — semua band F−M positif. Yang terjadi adalah konsentrasi, bukan pembalikan. Contoh pembalikan sejati di lesson ini diberi label [ilustrasi] karena angkanya dibuat." },
          ],
        },
        {
          q: "EDUCATION Lainnya: TPR 0,6000 — jauh di bawah tiga grup besar (0,9037–0,9207). Mengapa angka ini TIDAK boleh dibaca sebagai «model gagal equal opportunity di EDUCATION»?",
          options: [
            { text: "Karena TPR Lainnya dihitung dari hanya 5 nasabah default (TP 3, FN 2) — satu nasabah pindah mengubah TPR 20 poin persen", why: "Benar: 3/5 = 0,6000; bila satu FN menjadi TP, TPR-nya 0,8000. Aturan M7.1: grup dengan nasabah default di bawah 30 tidak dipakai untuk vonis equal opportunity. Tiga grup besarnya rapat (0,9037–0,9207) — spread 0,3207 itu hampir seluruhnya artefak 5 orang.", correct: true },
            { text: "Karena TPR 0,6000 masih di atas ambang four-fifths 0,80 bila dibulatkan", why: "Salah hitung: 0,6000 JAUH di bawah 0,80. Alasan bukan ambangnya, melainkan n penyebutnya (5 nasabah default)." },
            { text: "Karena equal opportunity tidak berlaku untuk EDUCATION — hanya untuk SEX", why: "Salah: equal opportunity berlaku untuk atribut apa pun. Yang tidak berlaku di sini adalah VONIS dari n = 5 — bukan metriknya." },
            { text: "Karena modelnya memang sengaja dirancang gagal di grup kecil", why: "Salah: tidak ada yang merancang kegagalan ini. Model hampir tidak pernah melihat grup Lainnya di train (386 dari 24.000) — itu representation bias (langkah 5), bukan kesengajaan." },
          ],
        },
        {
          q: "Uji-z dua proporsi untuk approval SEX: selisih −0,0393, standard error 0,0119, z = −3,30, p = 0,001; interval Wilson laki-laki [24,4%; 27,9%] dan perempuan [28,6%; 31,6%]. Kesimpulan yang benar?",
          options: [
            { text: "Selisih SEX adalah sinyal — p = 0,001 berarti peluang selisih sebesar ini muncul bila tidak ada perbedaan hanya 0,1%, dan intervalnya tidak bersinggungan", why: "Benar: uji-z dan interval yang tidak bersinggungan adalah DUA CARA MEMBACA bukti yang sama (keduanya dihitung dari SE yang sama) — keduanya menunjuk arah yang sama. Selisih 3,93 poin persen pada n ribuan adalah sinyal, bukan noise sampling.", correct: true },
            { text: "Selisihnya noise — p = 0,001 terlalu kecil untuk dipercaya", why: "Terbalik: p KECIL berarti bukti KUAT terhadap «tidak ada perbedaan». p = 0,001 adalah sinyal yang kuat, bukan yang lemah." },
            { text: "Selisihnya sinyal, tapi hanya karena n-nya besar — pada n kecil selisih yang sama akan hilang", why: "Setengah benar tapi menyesatkan: n besar memang memberi daya uji — tapi itu justru ALASAN selisih ini bisa dipercaya. Selisih 3,93 poin persen dengan SE 1,19 poin persen adalah sinyal pada n berapa pun yang memberi SE sekecil itu." },
            { text: "Tidak bisa disimpulkan — uji-z tidak berlaku untuk approval rate", why: "Salah: uji-z dua proporsi adalah uji standar untuk selisih dua rate. Syaratnya (n besar, kedua grup independen) terpenuhi di sini (n = 2.402 dan 3.598)." },
          ],
        },
        {
          q: "Model memakai SEX, EDUCATION, dan AGE sebagai fitur (koefisien LR kecil: SEX −0,0626) — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1%. Penjelasan yang benar?",
          options: [
            { text: "Ketimpangan berasal dari campuran: kontribusi langsung fitur demografis (bobot kecil) + perbedaan risiko terukur antar grup + proxy lewat fitur lain (limit, pola bayar, tagihan)", why: "Benar: model MEMAKAI SEX/EDUCATION/MARRIAGE/AGE sebagai fitur (koefisien LR SEX −0,0626; SHAP SEX 0,0314) — jadi sebagian gap adalah efek langsung kolom itu; sebagian lagi dari perbedaan distribusi fitur antar grup (langkah 3) dan proxy (limit, pola bayar, tagihan). Menghapus kolom sensitif menaikkan AIR (0,8694 → 0,9211, M7.4) — menurunkan disparitas — tapi tidak menuntaskannya.", correct: true },
            { text: "Model memakai SEX secara diam-diam — ada yang salah dengan pipeline-nya", why: "Salah arah: model MEMANG memakai SEX sebagai fitur — secara terbuka, bukan diam-diam, dan bukan bug pipeline: koefisien LR-nya −0,0626 dan SHAP GBM-nya 0,0314 [notebook]. Yang keliru adalah mengira model tidak memakainya; ketimpangan muncul lewat kolom sensitif itu sendiri DAN lewat proxy." },
            { text: "Ketimpangan itu mustahil — tanpa fitur sensitif, approval antar grup harus sama", why: "Salah: approval antar grup yang sama TIDAK membuktikan distribusi fiturnya sama — model konstan menyetujui semua orang apa pun fiturnya, dan perbedaan distribusi bisa saling meniadakan. Di sini distribusi fiturnya berbeda (langkah 3), jadi approval-nya berbeda — dengan atau tanpa kolom sensitif." },
            { text: "Solusinya menghapus semua fitur yang berkorelasi dengan SEX", why: "Salah arah: menghapus semua fitur yang berkorelasi dengan SEX berarti menghapus hampir semua fitur yang berguna (limit, pola bayar) — modelnya jadi tidak berguna. Mitigasi yang benar dibahas M7.4 (reweighing, threshold per grup, dan kawan-kawan), bukan penghapusan buta." },
          ],
        },
        {
          q: "PSI train vs test: SEX 0,0001; EDUCATION 0,0008; MARRIAGE 0,0002 — semuanya jauh di bawah 0,1. PSI M2 (G9) 0,0104 — juga di bawah 0,1. Apa yang BOLEH dan TIDAK BOLEH disimpulkan?",
          options: [
            { text: "BOLEH: tidak ada drift antara train dan test. TIDAK BOLEH: bahwa datanya representatif terhadap populasi yang dilayani", why: "Benar: PSI hanya membandingkan dua bagian dari data yang sama — ia tidak pernah melihat siapa yang tidak masuk dataset (pengaju yang ditolak dulu). Representativitas hanya bisa diperiksa dengan data luar.", correct: true },
            { text: "BOLEH: datanya representatif — PSI di bawah 0,1 berarti populasi stabil", why: "Salah: «stabil» di sini berarti «train dan test sama», bukan «data mewakili populasi». Selection bias (langkah 7) tidak bisa dideteksi PSI." },
            { text: "BOLEH: tidak ada selection bias sama sekali di dataset ini", why: "Salah: selection bias yang sesungguhnya — siapa yang tidak pernah masuk dataset — tidak meninggalkan jejak di dalam dataset, jadi PSI sekecil apa pun tidak bisa membantahnya." },
            { text: "TIDAK BOLEH disimpulkan apa-apa — PSI 0,0001 terlalu kecil untuk berarti", why: "Salah: PSI kecil justru bermakna — ia membuktikan tidak ada pergeseran distribusi antara train dan test. Yang tidak bisa dibuktikan PSI hanyalah representativitas terhadap populasi luar." },
          ],
        },
        {
          q: "AIR SEX per threshold: 0,05 menjadi 0,9186; 0,10 menjadi 0,8693; 0,20 menjadi 0,9431; 0,50 menjadi 0,9898. Seseorang mengusulkan: «naikkan threshold ke 0,50 — AIR-nya hampir 1,0, adil sempurna». Apa yang salah dengan usul itu?",
          options: [
            { text: "Di 0,50 hampir semua orang disetujui (88,05%) — ketimpangan hilang karena keputusannya hilang, dan labanya −NT$18.994.456 (M6.4)", why: "Benar: AIR 0,9898 di 0,50 bukan keadilan — itu threshold yang menyetujui hampir semua orang, termasuk 843 nasabah yang default (bad rate 15,96%, M6.4). Keadilan yang dibeli dengan menghancurkan laba dan menyetujui risiko buruk bukan keadilan.", correct: true },
            { text: "Tidak ada yang salah — AIR 0,9898 memang membuktikan threshold 0,50 paling adil", why: "Salah: AIR mengukur rasio approval antar grup — bila semua orang disetujui, rasionya 1,0 secara trivial. «Adil» yang dicapai dengan menghapus keputusan bukanlah keadilan, melainkan penyerahan." },
            { text: "AIR di 0,50 salah hitung — seharusnya tetap 0,8693 seperti di 0,10", why: "Salah: AIR memang BERGANTUNG pada threshold (rentang 0,1205 antar threshold). Di 0,50 approval laki-laki 87,51% vs perempuan 88,41% — rasionya 0,9898, benar sebagai perhitungan." },
            { text: "Threshold 0,50 dilarang M6.4 — lesson ini melarang memakainya", why: "Salah: M6.4 tidak melarang 0,50 — ia membuktikan 0,50 merugikan (laba −NT$18.994.456) di bawah asumsi biaya lesson ini. Larangan yang ada adalah memakai 0,5 TANPA menghitung biaya — bukan memakai 0,50 itu sendiri." },
          ],
        },
        {
          q: "Bootstrap CI 95% untuk gap TPR (F−M) adalah [−0,0498; 0,0110] — mencakup 0. Apakah itu berarti «tidak ada gap TPR»?",
          options: [
            { text: "Tidak — «tidak signifikan ≠ tidak ada gap»: CI mencakup 0 berarti data ini tidak bisa membedakan 0 dari −0,0498; gap sebenarnya bisa sebesar −4,98 poin persen; yang benar adalah melaporkan CI-nya, bukan memvonis «tidak ada»", why: "Benar: CI yang mencakup 0 berkata «nilai 0 masih cocok dengan datamu» — dan nilai −0,0498 JUGA masih cocok. Yang tidak signifikan adalah BUKTI-MU, bukan gap-nya. Vonis yang benar: «gap TPR −0,0191, CI 95% [−0,0498; 0,0110] — tidak bisa divonis dari data ini». Bandingkan dengan gap FPR [−0,0653; −0,0123] yang tidak mencakup 0 — itu yang boleh disebut nyata.", correct: true },
            { text: "Ya — CI yang mencakup 0 berarti gapnya nol, dan TPR laki-laki dan perempuan sama", why: "Salah: CI mencakup 0 bukan berarti titiknya 0 — titiknya −0,0191, dan seluruh rentang [−0,0498; 0,0110] masih mungkin. «Mencakup 0» dan «sama dengan 0» adalah dua klaim yang berbeda." },
            { text: "Ya — karena p > 0,05, hipotesis nol diterima dan gap dinyatakan tidak ada", why: "Salah dua kali: pertama, p > 0,05 berarti «gagal menolak», bukan «menerima» hipotesis nol; kedua, «tidak ada gap» adalah klaim tentang dunia yang butuh bukti — dan CI yang lebar justru menunjukkan bukti yang tidak cukup, bukan bukti ketiadaan." },
            { text: "Tidak — karena CI-nya salah hitung: bootstrap 1.000 ulangan terlalu sedikit untuk gap sekecil ini", why: "Salah alasan: 1.000 ulangan sudah cukup untuk CI persentil pada n = 6.000 — lebar CI [−0,0498; 0,0110] mencerminkan ukuran sampel dan variabilitas gapnya, bukan kesalahan hitung. Masalahnya bukan hitungannya, melainkan pembacaannya." },
          ],
        },
      ],
      summary: [
        "Lima sumber bias: measurement (fitur/label diukur berbeda), representation (grup kecil di train), label (label mewarisi keputusan manusia), selection (yang ditolak tidak ada di data), aggregation (angka global menyembunyikan ketimpangan).",
        "Tabel audit lengkap [notebook] (test 6.000, GBM terkalibrasi, threshold 0,10): SEX laki-laki 26,1% (n = 2.402, AIR 0,8693, FPR 0,6817, FNR 0,0749) vs perempuan 30,1% (n = 3.598); EDUCATION Pascasarjana 35,3% (n = 2.130, AIR 0,6032) vs SMA 20,9% (n = 1.014, AIR 0,3572, FPR 0,7463) vs Lainnya 58,5% (n = 82); MARRIAGE Lainnya 18,7% (n = 75, AIR 0,6403); AGE 60+ 19,7% (n = 76, AIR 0,5960, ECE 0,1208).",
        "Measurement: perempuan tampak lebih rendah risiko pada keempat fitur (limit NT$170.286 vs NT$164.482; PAY_MEAN −0,2278 vs −0,1053; utilisasi 0,3987 vs 0,4661; keterlambatan 0,7932 vs 0,8805) — menjelaskan SEBAGIAN kesenjangan sebagai risiko terukur, bukan membuktikan tidak ada bias.",
        "Representation: Lainnya EDUCATION 386 dari 24.000 train (1,6%), MARRIAGE Lainnya 302 (1,3%), 60+ 263 (1,1%) — ketiganya menempati posisi ekstrem di tabelnya. Pascasarjana BUKAN grup kecil (8.455 train); yang kecil adalah pembandingnya (Lainnya n = 82).",
        "Label: base rate SMA 0,2574 vs Pascasarjana 0,1901 sejalan dengan approval — konsisten dengan risiko terukur DAN dengan bias label; data saja tidak bisa membedakan keduanya.",
        "Selection: PSI train vs test 0,0001–0,0008 dan PSI M2 (G9) 0,0104 — stabil, tidak ada drift; tapi PSI tidak bisa membuktikan representativitas — pengaju yang ditolak dulu tidak ada di data.",
        "Aggregation: selisih SEX global +3,93 pp terkonsentrasi di bawah 30 tahun (+8,06 pp) dan hilang di 50–59 tahun (+0,07 pp). Contoh pembalikan sejati diberi label [ilustrasi] — di data ini tidak terjadi pembalikan tanda.",
        "Workflow audit: definisikan grup → ukur (semua metrik + n) → selidiki sumber dengan taksonomi → putuskan ambang SEBELUM melihat angka → dokumentasikan. Ambang: AIR di bawah 0,80 = flag; n di bawah 100 = «n kecil».",
        "Noise vs sinyal: selisih SEX adalah sinyal (z = −3,30, p = 0,001; interval Wilson tidak bersinggungan). TPR Lainnya 0,6000 dari 5 nasabah default adalah noise (satu orang = 20 poin persen). Wilson Lainnya [47,7%; 68,6%] lebar 0,2085 vs n = 2.000 lebar 0,0431.",
        "Audit irisan [notebook]: AIR global SEX 0,8693 menyembunyikan Laki-laki × SMA 0,2655 (n = 411, selisih −0,6038) dan Laki-laki × 60+ 0,5640 (n = 36, flag); sel dengan n < 100 dilaporkan, tidak divonis; 18 sel diuji → ~1 flag palsu diharapkan secara kebetulan (multiple comparisons).",
        "Ketidakpastian bootstrap [notebook, 1.000 ulangan, seed 42]: selisih approval +3,93 pp CI [1,78; 6,22] (nyata); AIR 0,8693 CI [0,7978; 0,9391] (nyata); gap TPR [−0,0498; 0,0110] dan PPV [−0,0446; 0,0101] mencakup 0 (tidak bisa divonis — bukan «tidak ada gap»); gap FPR dan Brier nyata.",
        "Kualitas data [notebook, 30.000 baris]: nilai hilang 0 di mana-mana; EDUCATION kode invalid 0/5/6 = 345 baris (1,15%) dan 73,72% grup Lainnya; MARRIAGE kode 0 = 54 baris (0,18%, terkonsentrasi di SMA); BILL_AMT negatif = 1.930 baris (6,43%, plausibel); duplikat di luar ID = 35 baris (0,12%).",
        "Lab: AIR Pascasarjana 0,6032; AIR EDUCATION 0,3572; Wilson Lainnya [0,4773; 0,6858] lebar 0,2085; gap Simpson terbesar di bawah 30 tahun 0,0806, terkecil 50–59 tahun 0,0007; AIR SEX bergerak 0,1205 antar threshold.",
        "Koreksi: n = 82 adalah n grup Lainnya (pembanding), BUKAN n Pascasarjana (n = 2.130) — flag-nya benar, atribusi n-nya dikoreksi mengikuti M7.1.",
      ],
      next: { label: "Lanjut: MLF-M7.3 — Explainability (SHAP/LIME)", href: "/v2/learn/mlf-m73-explainability-shap-lime" },
    },
  ],
};
