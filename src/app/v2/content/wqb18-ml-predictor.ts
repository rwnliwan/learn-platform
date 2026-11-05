import type { V2Lesson } from "../lib/types";

const FIG_CM = `<svg viewBox="0 0 520 300" role="img" aria-label="Confusion matrix 2x2: TP 95, FP 25, FN 15, TN 65.">
<g font-family="var(--font-ui)">
<text x="150" y="30" font-size="12" fill="var(--chart-text)" text-anchor="middle">prediksi: layak</text>
<text x="330" y="30" font-size="12" fill="var(--chart-text)" text-anchor="middle">prediksi: tidak</text>
<text x="30" y="110" font-size="12" fill="var(--chart-text)" text-anchor="middle">aktual:</text>
<text x="30" y="126" font-size="12" fill="var(--chart-text)" text-anchor="middle">layak</text>
<text x="30" y="200" font-size="12" fill="var(--chart-text)" text-anchor="middle">aktual:</text>
<text x="30" y="216" font-size="12" fill="var(--chart-text)" text-anchor="middle">tidak</text>
<rect x="80" y="60" width="140" height="90" fill="var(--c1)" opacity="0.9"/>
<text x="150" y="100" font-size="16" fill="#fff" text-anchor="middle">TP 95</text>
<text x="150" y="122" font-size="11" fill="#fff" text-anchor="middle">ketemu, benar</text>
<rect x="240" y="60" width="140" height="90" fill="#e5484d" opacity="0.75"/>
<text x="310" y="100" font-size="16" fill="#fff" text-anchor="middle">FN 15</text>
<text x="310" y="122" font-size="11" fill="#fff" text-anchor="middle">lolos dari radar</text>
<rect x="80" y="160" width="140" height="90" fill="#e5484d" opacity="0.75"/>
<text x="150" y="200" font-size="16" fill="#fff" text-anchor="middle">FP 25</text>
<text x="150" y="222" font-size="11" fill="#fff" text-anchor="middle">sampah masuk bank</text>
<rect x="240" y="160" width="140" height="90" fill="var(--c2)" opacity="0.9"/>
<text x="310" y="200" font-size="16" fill="#fff" text-anchor="middle">TN 65</text>
<text x="310" y="222" font-size="11" fill="#fff" text-anchor="middle">ditolak, benar</text>
<text x="80" y="282" font-size="11" fill="var(--chart-text)">Precision = 95/120 = 79,2% · Recall = 95/110 = 86,4% · F1 = 0,826</text>
</g>
</svg>`;

const FIG_MODEL = `<svg viewBox="0 0 520 250" role="img" aria-label="Perbandingan F1: RF lama 0,362, MLP 0,372, MLP skala besar 0,721, RF baru 0,746.">
<g font-family="var(--font-ui)">
<text x="10" y="52" font-size="12" fill="var(--chart-text)">RF lama (166 sim)</text>
<rect x="200" y="36" width="130" height="26" fill="var(--chart-text)" opacity="0.45"/>
<text x="336" y="55" font-size="11" fill="var(--chart-text)">0,362</text>
<text x="10" y="102" font-size="12" fill="var(--chart-text)">MLP (873 sim)</text>
<rect x="200" y="86" width="134" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="340" y="105" font-size="11" fill="var(--chart-text)">0,372</text>
<text x="10" y="152" font-size="12" fill="var(--chart-text)">MLP (data besar)</text>
<rect x="200" y="136" width="260" height="26" fill="var(--c2)" opacity="0.9"/>
<text x="466" y="155" font-size="11" fill="var(--chart-text)">0,721</text>
<text x="10" y="202" font-size="12" fill="var(--chart-text)">RF baru (873 sim)</text>
<rect x="200" y="186" width="269" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="475" y="205" font-size="11" fill="var(--chart-text)">0,746</text>
<text x="200" y="236" font-size="11" fill="var(--chart-text)">Pada ±1.000 baris tabular, arsitektur sederhana menang. Data yang membesar menutup celah.</text>
</g>
</svg>`;

export const wqb18: V2Lesson = {
  slug: "wqb18-ml-predictor",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB18 — ML Predictor: Mesin Penilai Kandidat",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model deep learning yang kalah dari hutan — lalu hampir menyusul",
      prose: [
        "Tim membangun predictor: model ML yang menilai kandidat ekspresi SEBELUM sim dibakar — layak diuji atau tidak. Versi pertama dilatih pada 166 simulasi. Hasil validasi silang: F1 = 0,362. Sedikit lebih baik dari lempar koin, tidak cukup untuk dipercaya sebagai penjaga gerbang wave. Modelnya dipensiunkan ke peran “pemberi saran”, bukan “penjaga”.",
        "Setahun kemudian, bank tumbuh menjadi 873 simulasi COMPLETE (209 di antaranya positif — lolos gerbang kualitas). Retrain dengan fitur yang sama: RandomForest mencapai F1 = 0,746. Dari 0,362 ke 0,746 — bukan karena arsitekturnya diganti, melainkan karena datanya 5× lipat. Predictor naik pangkat menjadi penjaga gerbang wave (ambang 0,65 di WQB17).",
        "Lalu datang usulan yang terdengar modern: ganti RandomForest dengan MLP (Multi-Layer Perceptron) — deep learning pasti lebih baik, kan? Hasil validasi silang pada data yang sama: F1 = 0,372. Tidak lebih baik dari model lama yang sudah dipensiunkan. Twist-nya: tim tidak membuang MLP begitu saja. Simulasi skala menunjukkan saat data membesar jauh, MLP menutup celah hingga 0,721 — nyaris menyamai RF. Pelajaran gandanya: pada data tabular ±1.000 baris, arsitektur sederhana menang; tetapi kemenangan itu milik data, bukan milik arsitektur — dan data yang cukup bisa mengubah pemenang.",
        "Setelah lesson ini kamu bisa: (1) merancang fitur dari ekspresi alpha dan label kualitas; (2) menghitung precision, recall, F1 dari confusion matrix; (3) menjelaskan kenapa RandomForest mengalahkan MLP di data tabular kecil; (4) menjelaskan kenapa MLP menutup celah saat data membesar; (5) memutuskan kapan me-retrain dan kapan mengganti arsitektur.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Klasifikasi biner = menebak label 0/1. Fitur = angka yang mendeskripsikan input (di sini: properti ekspresi alpha). Label = jawaban benar (di sini: 1 bila kandidat lolos gerbang S ≥ 1,25 & F ≥ 1). Validasi silang (cross-validation) = menguji model pada lipatan data yang tidak dipakai melatih, agar skornya jujur.",
      },
      reference: "Predictor menilai kandidat sebelum sim dibakar.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Fitur dari ekspresi, label dari gerbang",
      prose: [
        "Satu baris data = satu simulasi COMPLETE. Fiturnya dibaca dari ekspresi alpha: operator apa yang dipakai, berapa banyak operasi, family-nya apa, plus tiga fitur boolean — `has_ts_corr` (memakai korelasi time-series?), `has_ts_decay_linear` (memakai decay?), `has_group_neutralize` (ada neutralisasi grup?) — dan `n_ts_ops` (jumlah operasi time-series). Total 9 fitur. Tidak ada harga saham di sini — model ini menilai BENTUK ekspresi, bukan pasar.",
        "Labelnya brutal dan sederhana: 1 bila simulasi lolos gerbang kualitas (S ≥ 1,25 dan F ≥ 1), 0 bila tidak. Dari 873 sim, 209 positif (23,9%) — kelas tidak seimbang, sehingga metriknya harus F1, bukan akurasi (model yang selalu menebak “tidak layak” sudah dapat akurasi 76% tanpa belajar apa pun).",
        "Validasi silang stratifikasi: data dibagi beberapa lipatan dengan proporsi positif dijaga, model dilatih pada sebagian dan diuji pada sisanya, bergiliran. Skor yang dilaporkan = rata-rata lipatan. Inilah yang membuat 0,746 bisa dipercaya — ia bukan hafalan, ia generalisasi.",
        "Siklus hidupnya: setiap wave menambah sim baru → bank tumbuh → retrain berkala. Predictor adalah aset yang menua: tanpa retrain, ia menilai kandidat 2026 dengan pola 2025.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Akurasi 76% — modelnya bagus!” Pada data dengan 23,9% positif, model dungu yang selalu menjawab 0 sudah dapat 76,1%. Akurasi berbohong pada kelas tak seimbang; F1 (rata-rata harmonik precision–recall) tidak bisa dibohongi semudah itu.",
      },
      hints: [
        "Fitur = properti ekspresi (9 buah); label = lolos gerbang atau tidak.",
        "Kelas tak seimbang → pakai F1, bukan akurasi.",
      ],
      reference: "9 fitur bentuk ekspresi → label gerbang kualitas.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 3 · Konsep",
      title: "Membaca confusion matrix seperti auditor",
      prose: [
        "Empat kuadran: TP (layak, ketemu — 95), FP (tidak layak, lolos — 25: sampah masuk bank), FN (layak, terlewat — 15: alpha bagus lolos dari radar), TN (tidak layak, ditolak — 65). Dua kesalahan punya harga berbeda: FP membakar sim dan mengotori bank; FN membuang peluang yang mungkin tidak kembali.",
        "Precision = TP/(TP+FP) = 95/120 = 79,2%: dari yang diloloskan, berapa persen yang benar-benar layak. Recall = TP/(TP+FN) = 95/110 = 86,4%: dari yang memang layak, berapa persen yang ketemu. F1 = rata-rata harmonik keduanya = 0,826. Rata-rata harmonik menghukum ketidakseimbangan: precision 100% + recall 10% tidak bisa menghasilkan F1 tinggi.",
        "Cara membaca figur: empat kotak = empat kuadran; kotak merah = dua jenis kesalahan. Interpretasi: model ini “murah hati” — recall (86,4%) lebih tinggi dari precision (79,2%), artinya ia lebih takut melewatkan alpha bagus daripada kemasukan sampah. Untuk penjaga gerbang wave, bias ini masuk akal: FN (peluang hilang) lebih mahal dari FP (sim terbuang) — selama FP-nya tidak meledak.",
        "Konteks angkanya: F1 = 0,826 pada contoh mainan ini; F1 = 0,746 pada data nyata 873 sim (validasi silang). Ambang 0,65 di WQB17 dipilih dari kurva precision–recall model ini — bukan angka mistis.",
      ],
      formula: String.raw`\text{Precision} = \frac{TP}{TP+FP}, \quad \text{Recall} = \frac{TP}{TP+FN}, \quad F_1 = \frac{2 \cdot P \cdot R}{P + R}`,
      formulaNote: "Contoh: P = 95/120 = 0,792; R = 95/110 = 0,864; F1 = 2·0,792·0,864/(0,792+0,864) = 0,826. Rata-rata harmonik: F1 selalu ≤ rata-rata biasa, dan jatuh bila salah satu rendah.",
      figure: {
        svg: FIG_CM,
        alt: "Confusion matrix: TP 95, FN 15, FP 25, TN 65; precision 79,2%, recall 86,4%, F1 0,826.",
        caption: "Dua kesalahan, dua harga: FP mengotori bank, FN membuang peluang.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Precision menjawab “yang kuloloskan beneran bagus?”; recall menjawab “yang bagus keloloskan semua?”. Penjaga gerbang butuh keduanya — tetapi bila harus memilih, pilih sesuai harga kesalahanmu: di riset alpha, melewatkan juara (FN) lebih mahal daripada menguji sampah (FP).",
      },
      hints: [
        "Pembilang F1 selalu 2·P·R; penyebut P+R.",
        "F1 tinggi butuh P DAN R tinggi — tidak bisa salah satunya saja.",
      ],
      reference: "F1 = rata-rata harmonik precision–recall. Baca kuadran merahnya.",
    },
    {
      id: "rf-vs-mlp",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kenapa hutan menang — dan kapan ia kalah",
      prose: [
        "Kenapa RandomForest (0,746) mengalahkan MLP (0,372) pada 873 baris tabular? Empat alasan. Satu: bias induktif yang cocok — RF memotong ruang fitur dengan belahan sumbu (axis-aligned splits), persis cocok untuk fitur tabular campuran (boolean + count + kategori family). MLP harus MEMPELAJARI geometri itu dari nol. Dua: efisiensi sampel — RF memberi sinyal berguna sejak ratusan baris; MLP butuh ribuan untuk keluar dari noise. Tiga: ketahanan fitur — RF tidak peduli ada fitur tidak relevan; MLP tersiksa olehnya tanpa regularisasi yang disetel cermat. Empat: tanpa drama penskalaan — RF tidak butuh standardisasi; MLP tanpanya bisa tidak konvergen.",
        "Lalu kenapa MLP menutup celah menjadi 0,721 saat data membesar? Karena kelemahan MLP adalah kelaparan data, bukan kebodohan arsitektur. Dengan data cukup, MLP mempelajari interaksi non-linear antar fitur (mis. “`has_ts_decay_linear` HANYA berguna bila `n_ts_ops` tinggi”) yang sulit diwakili belahan sumbu RF. Data yang jauh lebih besar > keunggulan arsitektur pada kasus ini — untuk kasus ini, data mengalahkan arsitektur.",
        "Cara membaca figur kedua: empat batang F1. Interpretasi: RF lama 0,362 ≈ MLP 0,372 — keduanya “selevel koin” pada zamannya masing-masing (data kecil untuk RF lama; arsitektur lapar-data untuk MLP). RF baru 0,746 = pemenang hari ini. MLP skala-besar 0,721 = penantang yang menunggu datanya cukup. Keputusan tim: RF tetap dipakai; MLP dievaluasi ulang setiap kali bank melewati kelipatan 1.000 sim.",
        "Pelajaran metodologisnya: jangan pernah membandingkan arsitektur tanpa menyebut ukuran data. “MLP lebih baik dari RF” adalah kalimat yang tidak lengkap — yang lengkap: “MLP lebih baik dari RF PADA data sebesar X”.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Deep learning selalu lebih baik — tinggal pakai MLP.” Pada 873 baris tabular, MLP (0,372) bahkan kalah dari RF versi lama yang datanya 5× lebih kecil (0,362 ≈ setara). Kecanggihan arsitektur tidak mengkompensasi kelaparan data. Mulai dari yang sederhana, naik kelas hanya bila datanya mengizinkan.",
      },
      hints: [
        "RF: belahan sumbu + voting pohon = cocok untuk tabular kecil.",
        "MLP: butuh data besar untuk mempelajari interaksi non-linear.",
      ],
      figure: {
        svg: FIG_MODEL,
        alt: "Batang F1: RF lama 0,362; MLP 0,372; MLP data besar 0,721; RF baru 0,746.",
        caption: "Pemenang hari ini: RF. Penantang: MLP — bila datanya cukup.",
      },
      reference: "Data kecil → RF. Klaim DL wajib buktikan via validasi silang.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 5 · Praktik",
      title: "Merawat predictor seperti aset",
      prose: [
        "Dua kebiasaan. Pertama: retrain terjadwal — tiap wave selesai atau tiap +100 sim baru, mana yang dulu. Predictor yang tidak di-retrain adalah peta tahun lalu untuk jalan tahun ini. Kedua: ambang dari kurva, bukan dari firasat — pilih 0,65 (atau berapapun) dari trade-off precision–recall yang DATANYA tunjukkan, lalu kunci dan tulis alasannya satu kalimat.",
        "Dua jebakan tambahan. Jebakan data leakage: fitur tidak boleh mengandung informasi dari masa depan relatif terhadap label — mis. memakai Sharpe sim ITU SENDIRI sebagai fitur untuk memprediksi kelolosan sim itu. Kedengarannya bodoh, tetapi varian halusnya sering lolos: memakai statistik agregat yang dihitung dari seluruh bank termasuk sim yang sedang dinilai. Jebakan kedua: mengganti arsitektur setiap kali ada paper baru tanpa baseline — RF 0,746 adalah baseline yang harus dikalahkan, bukan direndahkan.",
      ],
      tasks: [],
      note: {
        title: "Leakage = nilai ujian yang bocor",
        type: "pitfall",
        body: "F1 = 0,99 yang tiba-tiba muncul setelah “perbaikan fitur” hampir pasti leakage, bukan keajaiban. Uji bau: bila fitur tidak akan tersedia pada saat prediksi dipakai di dunia nyata (sebelum sim dijalankan), ia bocor. Amputasi fitur itu, ulangi validasi silang.",
      },
      reference: "Retrain terjadwal, ambang dari kurva, baseline dihormati.",
    },
    {
      id: "lab-f1",
      eyebrow: "Langkah 6 · Lab",
      title: "Hitung precision, recall, F1 dari confusion matrix",
      prose: [
        "Dari kuadran mainan TP=95, FP=25, FN=15, TN=65: precision = 95/(95+25), recall = 95/(95+15), F1 = 2·P·R/(P+R). Tulis tiga baris, format tiga desimal. Setelah benar, uji pemahaman: ubah FP menjadi 60 dan lihat F1 jatuh — itulah harga sampah yang masuk bank.",
        "Perhatikan: TN (65) tidak dipakai sama sekali dalam F1. Metrik ini hanya peduli pada kelas positif — tepat untuk kasus “menemukan alpha layak” di tengah lautan kandidat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p`, `r`, `f1` dari TP/FP/FN" },
        { id: "t2", text: "Jalankan: pastikan tiga baris tercetak" },
      ],
      expected: "Precision: 0.792\nRecall: 0.864\nF1: 0.826",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“F1 = (P+R)/2.” Bukan — itu rata-rata aritmetik (0,828 di contoh ini, mirip sehingga jebakannya halus). F1 = 2PR/(P+R) = 0,826: selalu ≤ rata-rata biasa, dan selisihnya membesar saat P dan R timpang.",
      },
      hints: [
        "p = tp/(tp+fp); r = tp/(tp+fn); f1 = 2*p*r/(p+r).",
        "Format: f\"{p:.3f}\".",
      ],
      code: {
        starter: "# Kuadran confusion matrix (JANGAN UBAH)\ntp, fp, fn, tn = 95, 25, 15, 65\n\n# TULIS KODEMU\np =\nr =\nf1 =\nprint(f\"Precision: {p:.3f}\")\nprint(f\"Recall: {r:.3f}\")\nprint(f\"F1: {f1:.3f}\")\n",
        lockLines: 5,
        solution: "# Kuadran confusion matrix (JANGAN UBAH)\ntp, fp, fn, tn = 95, 25, 15, 65\n\n# TULIS KODEMU\np = tp / (tp + fp)\nr = tp / (tp + fn)\nf1 = 2 * p * r / (p + r)\nprint(f\"Precision: {p:.3f}\")\nprint(f\"Recall: {r:.3f}\")\nprint(f\"F1: {f1:.3f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Precision = 0,792", msg: "95/120 = 0,7917.", pattern: "Precision: 0\\.792" },
          { kind: "stdout_matches", task: "t2", label: "Recall = 0,864", msg: "95/110 = 0,8636.", pattern: "Recall: 0\\.864" },
          { kind: "stdout_matches", task: "t2", label: "F1 = 0,826", msg: "2·0,7917·0,8636/1,6553 = 0,8261.", pattern: "F1: 0\\.826" }
        ],
      },
      reference: "Tiga baris ini = cara membaca kualitas predictor.",
    },
    {
      id: "lab-pilih",
      eyebrow: "Langkah 7 · Lab",
      title: "Pilih arsitektur berdasarkan angka, bukan gengsi",
      prose: [
        "Terapkan keputusan tim dalam kode: dari skor F1 validasi silang, pilih model terbaik dan hitung improvement relatif terhadap model lama. Hasilnya harus berkata “RF_baru” — biarkan angkanya yang memutuskan, bukan preferensi arsitekturnya.",
        "Eksperimen lanjutan: tambahkan entri `\"MLP_besar\": 0.721` dan lihat keputusannya tetap RF_baru — tetapi selisihnya menyempit. Itulah cara membaca “penantang yang menunggu datanya”.",
      ],
      tasks: [
        { id: "t1", text: "Pilih `best` dan hitung `improve` vs RF_lama" },
        { id: "t2", text: "Jalankan: pastikan keputusan tercetak" },
      ],
      expected: "Model terpilih: RF_baru (F1=0.746)\nImprovement vs model lama: +106.1%",
      hints: [
        "best = max(f1, key=f1.get).",
        "improve = (f1['RF_baru'] - f1['RF_lama']) / f1['RF_lama'] * 100.",
      ],
      code: {
        starter: "# F1 validasi silang (JANGAN UBAH)\nf1 = {\"RF_lama\": 0.362, \"MLP\": 0.372, \"RF_baru\": 0.746}\n\n# TULIS KODEMU\nbest =\nimprove =\nprint(f\"Model terpilih: {best} (F1={f1[best]:.3f})\")\nprint(f\"Improvement vs model lama: +{improve:.1f}%\")\n",
        lockLines: 5,
        solution: "# F1 validasi silang (JANGAN UBAH)\nf1 = {\"RF_lama\": 0.362, \"MLP\": 0.372, \"RF_baru\": 0.746}\n\n# TULIS KODEMU\nbest = max(f1, key=f1.get)\nimprove = (f1[\"RF_baru\"] - f1[\"RF_lama\"]) / f1[\"RF_lama\"] * 100\nprint(f\"Model terpilih: {best} (F1={f1[best]:.3f})\")\nprint(f\"Improvement vs model lama: +{improve:.1f}%\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "RF_baru terpilih", msg: "0,746 tertinggi.", pattern: "Model terpilih: RF_baru \\(F1=0\\.746\\)" },
          { kind: "stdout_matches", task: "t2", label: "Improvement +106,1%", msg: "(0,746−0,362)/0,362 = 106,1%.", pattern: "Improvement vs model lama: \\+106\\.1%" }
        ],
      },
      reference: "Angka yang memilih arsitektur — bukan sebaliknya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan percaya, kapan retrain, kapan ganti",
      prose: [
        "Satu: data tabular < 2.000 baris → mulai dari RandomForest/GBM; MLP hanya bila ada alasan kuat. Dua: F1 validasi silang < 0,7 → predictor boleh dipakai untuk ranking, belum boleh jadi penjaga gerbang keras. Tiga: tiap wave selesai atau tiap +100 sim baru → retrain terjadwal; peta lama untuk jalan baru = sesat. Empat: bank melewati kelipatan 1.000 sim → evaluasi ulang MLP; penantang boleh bertanding lagi. Lima: F1 melonjak tiba-tiba (> 0,1 dalam sekali retrain) → audit leakage dulu, rayakan kemudian.",
        "Aturan praktis 10 detik: tabular kecil → RF dulu; setiap klaim “DL lebih baik” wajib menunjukkan skor validasi silang.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Predictor seperti anjing penjaga: RF adalah anjing kampung yang langsung bisa jaga (0,746), MLP adalah anak serigala — butuh makan banyak (data) sebelum bisa diandalkan (0,372 → 0,721). Pilih sesuai stok makananmu.",
      },
      reference: "Percaya bila F1 ≥ 0,7; retrain tiap wave; MLP diuji tiap 1.000 sim.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Ambang 0,65 vs 0,55: F1 naik, bank kotor",
      prose: [
        "Data: 200 kandidat dinilai predictor. Ambang 0,65 → 120 diprediksi layak; aktual: TP 95, FP 25, FN 15 (15 alpha bagus terlewat). Precision 79,2%, recall 86,4%, F1 0,826. Seseorang mengusulkan ambang 0,55: +20 kandidat diprediksi layak, TP naik ke 107, FP naik ke 33. Precision 76,4%, recall 97,3%, F1 0,856 — NAIK.",
        "Pertanyaan: turunkan ambang? Pembahasan: F1 memang naik (0,826 → 0,856), tetapi FP naik 25 → 33 (+32%): 8 sim sampah tambahan per 200 kandidat, dan sampah itu mengotori bank secara permanen — ia ikut dihitung di triage, klaster, dan submit wave-wave berikutnya. Sebaliknya 15 FN yang “diselamatkan” sebagian akan muncul lagi sebagai kandidat wave depan (peluang yang terlewat bisa kembali; sampah yang masuk tidak pergi sendiri). Keputusan tim: ambang tetap 0,65. Pelajaran: F1 bukan satu-satunya penentu ambang — harga asimetris FP vs FN ikut menimbang. Ambang dipilih dari kurva DAN dari ekonomi kesalahan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke riset",
        type: "risk",
        body: "Mengoptimasi F1 buta = mengasumsikan FP dan FN sama mahalnya. Di riset alpha tidak: FP = polusi permanen bank, FN = peluang yang bisa kembali. Selalu kalikan metrik dengan ekonomi kesalahan sebelum menggeser ambang.",
      },
      reference: "F1 naik belum tentu ambang harus turun — timbang harga kesalahan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Hitung dengan tangan bila perlu — rumusnya pendek.",
      ],
      tasks: [],
      summary: [
        "Fitur = properti ekspresi (9 buah); label = lolos gerbang S ≥ 1,25 & F ≥ 1.",
        "Precision = TP/(TP+FP); Recall = TP/(TP+FN); F1 = 2PR/(P+R).",
        "Kelas tak seimbang (23,9% positif) → F1, bukan akurasi.",
        "RF menang di tabular kecil (bias induktif cocok, efisien sampel); MLP menutup celah saat data membesar.",
        "Retrain tiap wave/+100 sim; evaluasi ulang MLP tiap kelipatan 1.000 sim; waspada leakage.",
      ],
      next: { label: "WQB19 — Triage Berlapis: Dari 600 Kandidat ke Antrean Submit", href: "/learn/wqb19-triage-berlapis" },
      quiz: [
        {
          q: "Precision = 0,8 dan recall = 0,6. F1 = …",
          options: [
            { text: "0,686", why: "Benar: 2·0,8·0,6/1,4 = 0,96/1,4 = 0,686.", correct: true },
            { text: "0,700", why: "Itu rata-rata aritmetik — bukan F1. F1 selalu ≤ rata-rata biasa." },
            { text: "0,480", why: "Itu P·R — bukan F1. F1 = rata-rata HARMONIK, bukan perkalian." }
          ],
        },
        {
          q: "Kenapa RandomForest mengalahkan MLP pada 873 baris tabular?",
          options: [
            { text: "Belahan sumbunya cocok untuk fitur tabular campuran; ia efisien sampel dan tahan fitur tak relevan", why: "Tepat — tiga keunggulan struktural RF pada data kecil.", correct: true },
            { text: "Karena RandomForest adalah deep learning", why: "Bukan — RF = ensemble pohon keputusan, bukan neural network." },
            { text: "Karena MLP tidak bisa dipakai untuk klasifikasi", why: "Bisa — masalahnya kelaparan data, bukan ketidakmampuan." }
          ],
        },
        {
          q: "Kenapa MLP menutup celah (0,372 → 0,721) saat data membesar?",
          options: [
            { text: "Kelemahannya kelaparan data; data cukup memungkinkannya mempelajari interaksi non-linear antar fitur", why: "Benar — untuk kasus ini, data mengalahkan arsitektur.", correct: true },
            { text: "Karena arsitekturnya diganti diam-diam", why: "Tidak — arsitekturnya sama; yang berubah jumlah data latih." },
            { text: "Karena RandomForest-nya sengaja dilemahkan", why: "Tidak — RF tetap 0,746; MLP-lah yang naik." }
          ],
        },
        {
          q: "Model mengklaim akurasi 76% pada data dengan 24% positif. Kesimpulan?",
          options: [
            { text: "Tidak informatif — model selalu-menebak-0 sudah dapat ~76%", why: "Benar. Minta F1-nya.", correct: true },
            { text: "Bagus — di atas 75%", why: "Jebakan akurasi pada kelas tak seimbang." },
            { text: "Buruk — harus di atas 90%", why: "Ambang “90%” tidak berarti tanpa konteks distribusi kelas." }
          ],
        },
        {
          q: "Kapan predictor harus di-retrain?",
          options: [
            { text: "Tiap wave selesai atau tiap +100 sim baru", why: "Benar — peta lama untuk jalan baru = sesat.", correct: true },
            { text: "Hanya bila F1 turun di bawah 0,5", why: "Terlambat — drift pola kandidat terjadi diam-diam sebelum skor jatuh." },
            { text: "Tidak pernah — model yang bagus abadi", why: "Tidak ada model abadi; distribusi kandidat berubah tiap wave." }
          ],
        }
      ],
      reference: "Mesin penilai yang baik = fitur jujur + metrik tepat + retrain disiplin.",
    },
  ],
};
