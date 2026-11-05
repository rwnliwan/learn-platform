import type { V2Lesson } from "../lib/types";

const FIG_FUNNEL = `<svg viewBox="0 0 480 300" role="img" aria-label="Corong alert: 40 ribu transaksi mencurigakan menjadi 400 SAR.">
<g font-family="var(--font-ui)">
<text x="240" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Corong alert: dari 40.000 menjadi 400</text>
<text x="150" y="60" font-size="11" fill="var(--chart-text)">Alert sistem</text>
<rect x="60" y="68" width="180" height="26" fill="var(--c1)" opacity="0.85"/>
<text x="150" y="86" font-size="11" fill="#fff" text-anchor="middle">40.000 / bulan</text>
<text x="150" y="112" font-size="11" fill="var(--chart-text)">Triage analis (aturan)</text>
<rect x="85" y="120" width="130" height="26" fill="var(--c2)" opacity="0.85"/>
<text x="150" y="138" font-size="11" fill="#fff" text-anchor="middle">8.000</text>
<text x="150" y="164" font-size="11" fill="var(--chart-text)">Investigasi mendalam</text>
<rect x="105" y="172" width="90" height="26" fill="var(--c3)" opacity="0.85"/>
<text x="150" y="190" font-size="11" fill="#fff" text-anchor="middle">1.200</text>
<text x="150" y="216" font-size="11" fill="var(--chart-text)">SAR dilaporkan</text>
<rect x="125" y="224" width="50" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="150" y="242" font-size="11" fill="#fff" text-anchor="middle">400</text>
<text x="300" y="140" font-size="11" fill="var(--chart-text)">ML memangkas di DUA titik:</text>
<text x="300" y="160" font-size="11" fill="var(--chart-text)">1. Skor alert &#8594; analis hanya</text>
<text x="300" y="178" font-size="11" fill="var(--chart-text)">   buka 20% teratas.</text>
<text x="300" y="198" font-size="11" fill="var(--chart-text)">2. Auto-tutup pola jelas-bukan.</text>
<text x="240" y="272" font-size="11" fill="var(--chart-text)" text-anchor="middle">Cara membaca: lebar batang = volume di tiap tahap.</text>
<text x="240" y="290" font-size="11" fill="var(--chart-text)" text-anchor="middle">Interpretasi: 99% alert BUKAN SAR &#8212; di sinilah ML menghemat.</text>
</g>
</svg>`;

export const aml14: V2Lesson = {
  slug: "aml14-regtech-ai-pkyc",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML14 — RegTech, AI & pKYC untuk AFC",
  estMinutes: 58,
  steps: [
    {
      id: "sampul",
      eyebrow: "Sampul",
      title: "40.000 alert, 8 analis, 1 model",
      prose: [
        "AML14 — RegTech, AI & pKYC untuk AFC · 58 menit · 3 lab Python · 5 kuis · 1 mini-case · 1 chart.",
        "Daftar isi: 1. Cerita: antrean yang tidak pernah habis. 2. Konsep: transaction monitoring dengan ML. 3. Konsep: perpetual KYC & adverse media. 4. Lab: precision vs recall. 5. Lab: skor risiko pKYC yang hidup. 6. Lab: skor adverse media. 7. Peta keputusan: model memberi skor, analis memutuskan apa. 8. Mini-case: biaya false positive vs miss. 9. Checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan peran ML di transaction monitoring dan batasannya; (2) menghitung precision, recall, dan F1 dari confusion matrix serta memilih ambang yang tepat; (3) menghitung skor risiko pKYC yang diperbarui kontinu (EWMA); (4) merancang skoring adverse media sederhana; (5) menilai trade-off false positive vs kasus yang lolos.",
        "Konteks CAMS: domain 'Tools & Technologies' berbobot ~20% di CAMS edisi ke-7 (directional, menurut CAMS Exam Guide 2026) — mencakup AI, perpetual KYC, dan RegTech. Pesan intinya: teknologi melipatgandakan analis, bukan menggantikannya.",
      ],
      tasks: [],
      reference: "RegTech = teknologi untuk compliance. AI melipatgandakan analis.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Antrean yang tidak pernah habis",
      prose: [
        "Bank Cakra: 40.000 alert transaction monitoring per bulan, 8 analis. Tiap analis menutup ~150 alert per hari — 3 menit per alert, tanpa istirahat berpikir. Hasilnya bisa ditebak: 99% ditutup sebagai 'tidak mencurigakan', 400 SAR per bulan, dan 1 kasus besar lolos: pola structuring Rp9,8 miliar yang terpecah rapi di bawah ambang — karena analis ke-7 hari itu sedang mengejar target tutup alert.",
        "Twist-nya: enam bulan kemudian bank memasang model ML. Alert turun 70% — analis kini hanya membuka 20% skor tertinggi. Kapasitas investigasi naik 3x. Tetapi audit menemukan: model TIDAK PERNAH menaikkan skor pola 'pecah di bawah ambang' — karena data latihnya (SAR historis) hampir tidak mengandung pola itu. Model belajar dari masa lalu; pelaku menyerang dari masa depan.",
        "Lesson ini tentang tiga teknologi AFC: transaction monitoring ML, perpetual KYC, dan adverse media screening otomatis — cara kerjanya, cara mengukurnya, dan batasnya. Analis yang paham batas model = analis yang tahu kapan harus tidak percaya pada modelnya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model yang tidak pernah melihat pola baru = buta terhadap pola baru. Inilah mengapa program AFC mewajibkan 'model risk management': validasi berkala, monitoring drift (ingat FR10), dan — yang sering dilupakan — jalur eskalasi manusia untuk pola yang belum ada di data latih.",
      },
      reference: "ML memangkas 70% alert — tetapi buta pada pola tak terlihat di data latih.",
    },
    {
      id: "tm-ml",
      eyebrow: "Langkah 2 · Konsep",
      title: "Transaction monitoring ML: Si Magang Super Cepat",
      prose: [
        "Model ML — Si Magang Super Cepat. Ia membaca 40.000 alert dalam hitungan menit, memberi skor 0–100, dan tidak pernah lelah. Kepribadiannya: luar biasa cepat, tetapi (1) hanya tahu apa yang pernah ia lihat (data latih), (2) tidak bisa menjelaskan 'kenapa' tanpa bantuan (butuh explainability, ingat FR17), (3) percaya diri bahkan saat salah — skor 92 bisa berarti 'sangat mencurigakan' atau 'sangat mirip pola latih yang salah'.",
        "Dua keluarga model: supervised (belajar dari SAR historis berlabel — kuat untuk pola lama, buta pola baru) dan unsupervised/anomaly detection (belajar 'normal itu seperti apa' — bisa menangkap pola baru, tetapi berisik: banyak false positive). Bank matang memakai keduanya: supervised untuk presisi, unsupervised untuk jaring pengaman.",
        "Tiga metrik yang wajib dikuasai analis — karena 'akurasi 99%' adalah kebohongan statistik di data imbalance:",
      ],
      formula: String.raw`\text{Precision} = \frac{TP}{TP+FP} \quad ; \quad \text{Recall} = \frac{TP}{TP+FN} \quad ; \quad F_1 = \frac{2 \cdot P \cdot R}{P+R}`,
      formulaNote: "TP = alert benar & terbukti kasus; FP = alert salah (false positive); FN = kasus yang lolos tak ter-alert (miss). Contoh: 100 kasus nyata, model meng-alert 80 di antaranya (TP=80, FN=20) dari 400 alert total (FP=320) → Precision = 80/400 = 20%, Recall = 80/100 = 80%, F1 = 32%. Interpretasi: precision rendah = analis tenggelam; recall rendah = kasus lolos. Pilih ambang sesuai mana yang lebih mahal bagimu.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Akurasi model 99%, berarti bagus.” Pada 40.000 alert dengan 400 kasus nyata, model 'tutup semua' punya akurasi 99% (39.600/40.000) — dan recall 0%. Akurasi pada data imbalance = angka penipu. Selalu minta precision & recall per ambang.",
      },
      hints: [
        "Supervised = pola lama (presisi); unsupervised = pola baru (berisik).",
        "Precision = hemat analis; recall = tangkap kasus. F1 = kompromi.",
      ],
      reference: "Magang cepat: supervised + unsupervised. Ukur dengan P/R/F1, bukan akurasi.",
    },
    {
      id: "pkyc",
      eyebrow: "Langkah 3 · Konsep",
      title: "pKYC: Si Penjaga yang Tak Pernah Tidur",
      prose: [
        "KYC tradisional = foto SIM saat buka rekening, lalu tidur 5 tahun. Perpetual KYC (pKYC) = profil risiko nasabah yang HIDUP: setiap ada peristiwa (transaksi janggal, berita negatif, perubahan pekerjaan, ulang tahun ke-18) skor risikonya diperbarui otomatis. Kepribadiannya: penjaga yang memeriksa ulang setiap tamu setiap kali ada yang berubah — bukan sekali di pintu masuk.",
        "Cara kerjanya: skor risiko hari ini = kombinasi skor kemarin (bobot α) dan sinyal baru (bobot 1−α). Sinyal baru bisa: adverse media hit (+30), transaksi ke yurisdiksi risiko tinggi (+20), perubahan pekerjaan ke sektor sensitif (+15), tidak ada sinyal (−5, skor meluruh perlahan). Ambang: ≥70 = EDD, ≥40 = pantau, <40 = standar.",
        "Adverse media screening otomatis: crawler memindai berita/dokumen publik untuk nama nasabah + kata kunci risiko ('korupsi', 'ditangkap', 'sanksi', 'penggelapan'), lalu skoring: kecocokan nama × bobot kata kunci × kredibilitas sumber. Batasnya nyata: nama pasaran ('Budi Santoso') = banjir false positive; berita usang = skor basi; bahasa daerah = luput. Maka skor adverse media selalu butuh verifikasi manusia sebelum jadi dasar keputusan.",
        "Cara membaca figur: corong menyempit dari 40.000 alert ke 400 SAR. Interpretasi: 99% alert bukan SAR — ML menghemat di dua titik (skor prioritas + auto-tutup pola jelas-bukan), TETAPI titik sempit terakhir (1.200 → 400) tetap milik manusia: keputusan SAR tidak boleh otomatis penuh.",
      ],
      formula: String.raw`R_t = \alpha \cdot R_{t-1} + (1-\alpha) \cdot s_t`,
      formulaNote: "R_t = skor risiko hari ini (0–100); α = memori (0,7 = 70% skor lama bertahan); s_t = sinyal hari ini (0–100). Contoh: R kemarin 50, hari ini adverse media hit s=90, α=0,7 → R = 0,7×50 + 0,3×90 = 62 → naik ke 'pantau'. Interpretasi: α besar = skor stabil (tahan gosip); α kecil = skor reaktif (cepat panik). Pilih α sesuai selera risikomu — dan dokumentasikan.",
      figure: {
        svg: FIG_FUNNEL,
        alt: "Corong alert dari 40.000 menjadi 400 SAR.",
        caption: "ML menghemat di hulu; keputusan SAR tetap manusia.",
      },
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“pKYC = KYC yang dikerjakan lebih sering.” Bukan sekadar frekuensi — pKYC = pemantauan BERBASIS PERISTIWA (event-driven), bukan berbasis kalender. Nasabah yang hidupnya tidak berubah tidak perlu direview tiap tahun; nasabah yang kemarin masuk berita perlu direview HARI INI. Kalender = buang waktu; peristiwa = tepat sasaran.",
      },
      hints: [
        "pKYC = event-driven, bukan calendar-driven.",
        "Adverse media: nama × kata kunci × kredibilitas sumber — lalu verifikasi manusia.",
      ],
      reference: "Skor hidup: R_t = α·R_lama + (1−α)·sinyal.",
    },
    {
      id: "lab-pr",
      eyebrow: "Langkah 4 · Lab",
      title: "Precision vs recall: pilih ambangmu",
      prose: [
        "Model memberi skor 0–100 ke 1.000 alert; 80 di antaranya kasus nyata. Tiga ambang: 90 (ketat), 70 (sedang), 50 (longgar). Hitung TP/FP/FN, precision, recall, F1 tiap ambang. Perhatikan: ambang 50 menangkap 76 kasus (recall 95%) tetapi precision hanya 9,5% — analis membuka 800 alert untuk 76 kasus.",
        "Eksperimen: jika biaya 1 miss = Rp500 juta (denda + kasus lolos) dan biaya 1 FP = Rp150 ribu (15 menit analis), ambang mana yang total biayanya terkecil? (Petunjuk: total = FN×500jt + FP×150rb.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung precision, recall, F1 tiap ambang" },
        { id: "t2", text: "Jalankan dan pastikan tabel tercetak" },
      ],
      expected: "Ambang 90: P=66.7% R=25.0% F1=36.4%\nAmbang 70: P=35.7% R=62.5% F1=45.5%\nAmbang 50: P=9.5% R=95.0% F1=17.3%",
      note: {
        title: "💡 Intuisi",
        body: "Ambang 'terbaik' (F1 tertinggi = 70) BUKAN jawaban bisnis. Jika miss Rp500 juta dan FP Rp150 ribu, ambang 50 total biayanya: FN 4 × 500jt = Rp2 M + FP 724 × 150rb = Rp108,6 jt → Rp2,11 M; ambang 90: FN 60 × 500jt = Rp30 M. Ambang longgar 14x lebih murah! F1 buta terhadap biaya — analis tidak boleh buta.",
      },
      hints: [
        "precision = tp/(tp+fp); recall = tp/(tp+fn); f1 = 2*p*r/(p+r).",
        "Data: ambang 90 → tp 20, fp 10; 70 → tp 50, fp 90; 50 → tp 76, fp 724. fn = 80 - tp.",
      ],
      code: {
        starter: "# (ambang, TP, FP) dari 1000 alert, 80 kasus nyata. JANGAN UBAH.\ndata = [(90, 20, 10), (70, 50, 90), (50, 76, 724)]\nkasus = 80\n\n# TULIS KODEMU: precision, recall, F1 per ambang\nfor ambang, tp, fp in data:\n    fn = kasus - tp\n    p =\n    r =\n    f1 =\n    print(f\"Ambang {ambang}: P={p:.1%} R={r:.1%} F1={f1:.1%}\")\n",
        lockLines: 3,
        solution: "# (ambang, TP, FP) dari 1000 alert, 80 kasus nyata. JANGAN UBAH.\ndata = [(90, 20, 10), (70, 50, 90), (50, 76, 724)]\nkasus = 80\n\n# TULIS KODEMU: precision, recall, F1 per ambang\nfor ambang, tp, fp in data:\n    fn = kasus - tp\n    p = tp / (tp + fp)\n    r = tp / (tp + fn)\n    f1 = 2 * p * r / (p + r)\n    print(f\"Ambang {ambang}: P={p:.1%} R={r:.1%} F1={f1:.1%}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Ambang 90", msg: "P 66,7% R 25%.", pattern: "Ambang 90: P=66\\.7% R=25\\.0% F1=36\\.4%" },
          { kind: "stdout_matches", task: "t2", label: "Ambang 50", msg: "Recall 95%, precision 9,5%.", pattern: "Ambang 50: P=9\\.5% R=95\\.0% F1=17\\.3%" },
          { kind: "uses", task: "t1", label: "Rumus F1 dipakai", msg: "2·P·R/(P+R).", token: "f1" }
        ],
      },
      reference: "Ambang = keputusan biaya: FN×biaya_miss + FP×biaya_fp.",
    },
    {
      id: "lab-pkyc",
      eyebrow: "Langkah 5 · Lab",
      title: "Skor pKYC yang hidup 7 hari",
      prose: [
        "Nasabah 'PT Maju Jaya': skor awal 35. Tujuh hari peristiwa: [tidak ada, transaksi ke yurisdiksi risiko tinggi (+20), tidak ada, adverse media hit (+30), tidak ada, tidak ada, perubahan direksi (+10)]. Aturan: sinyal hari tanpa peristiwa = 0 dan skor meluruh (rumus EWMA dengan s_t=0). α = 0,7. Kapan skor menyentuh 'pantau' (≥40)?",
        "Perhatikan hari ke-4: adverse media mendorong skor ke ~52 — melewati ambang pantau. Di hari ke-7 skor ~47,5 — masih di zona pantau. Inilah 'hidup'-nya pKYC: ia naik saat ada peristiwa, meluruh saat tenang — tanpa menunggu review tahunan.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan skor 7 hari ke list `riwayat`" },
        { id: "t2", text: "Jalankan dan pastikan status akhir tercetak" },
      ],
      expected: "Hari 7: skor 47.5 -> pantau",
      note: {
        title: "💡 Intuisi",
        body: "α = 0,7 berarti 'ingatan 70%': gosip kemarin masih membekas hari ini, tetapi tidak selamanya. Bank konservatif memakai α 0,8–0,9 (skor stabil, butuh bukti kuat untuk naik); bank agresif 0,5–0,6 (reaktif). Tidak ada α yang benar — yang salah = α yang tidak didokumentasikan alasannya.",
      },
      hints: [
        "r = alpha*r + (1-alpha)*s tiap hari; simpan ke riwayat.",
        "status: >=70 EDD, >=40 pantau, else standar.",
      ],
      code: {
        starter: "# Sinyal harian 0-100 (0 = tidak ada peristiwa). JANGAN UBAH.\nsinyal = [0, 50, 30, 100, 30, 20, 70]\nalpha = 0.7\nr = 35.0\n\n# TULIS KODEMU: simulasi EWMA 7 hari\nriwayat = []\nfor s in sinyal:\n    r =\n    riwayat.append(round(r, 1))\nstatus = \"EDD\" if r >= 70 else (\"pantau\" if r >= 40 else \"standar\")\nprint(f\"Hari 7: skor {r:.1f} -> {status}\")\nprint(f\"Riwayat: {riwayat}\")\n",
        lockLines: 4,
        solution: "# Sinyal harian 0-100 (0 = tidak ada peristiwa). JANGAN UBAH.\nsinyal = [0, 50, 30, 100, 30, 20, 70]\nalpha = 0.7\nr = 35.0\n\n# TULIS KODEMU: simulasi EWMA 7 hari\nriwayat = []\nfor s in sinyal:\n    r = alpha * r + (1 - alpha) * s\n    riwayat.append(round(r, 1))\nstatus = \"EDD\" if r >= 70 else (\"pantau\" if r >= 40 else \"standar\")\nprint(f\"Hari 7: skor {r:.1f} -> {status}\")\nprint(f\"Riwayat: {riwayat}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Skor hari 7 ≈ 47,5", msg: "EWMA 7 hari.", name: "r", value: 47.46, tol: 0.05 },
          { kind: "stdout_matches", task: "t2", label: "Status pantau", msg: "≥40.", pattern: "Hari 7: skor 47\\.5 -> pantau" }
        ],
      },
      reference: "R_t = α·R + (1−α)·s. Naik saat peristiwa, meluruh saat tenang.",
    },
    {
      id: "lab-adverse",
      eyebrow: "Langkah 6 · Lab",
      title: "Skor adverse media",
      prose: [
        "Tiga artikel menyebut nama 'Budi Santoso'. Skor artikel = kecocokan_nama (0–1) × bobot_kata_kunci × kredibilitas_sumber (0–1). Kata kunci: 'korupsi' 40, 'ditangkap' 35, 'sanksi' 30, 'penggelapan' 35, 'kontroversi' 10. Skor nasabah = maksimum skor artikel. Ambang: ≥25 = EDD.",
        "Perhatikan artikel 3: nama cocok sempurna TETAPI sumber blog tak dikenal (kredibilitas 0,3) dan kata kunci ringan — skor hanya 3. Inilah mengapa kredibilitas sumber dikalikan, bukan ditambahkan: sumber sampah tidak bisa mengangkat skor setinggi apa pun kata kuncinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` maksimum dari tiga artikel" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "Skor adverse media: 32.4 -> EDD",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Skor 32 = terbukti bersalah.” Skor adverse media = ALASAN VERIFIKASI, bukan bukti. Artikel bisa tentang Budi Santoso yang lain, atau tuduhan yang sudah dibatalkan pengadilan. Prosedur benar: skor ≥25 → analis membaca artikelnya → konfirmasi identitas → baru EDD. Melewati 'membaca' = fitnah sistematis.",
      },
      hints: [
        "skor_artikel = cocok * bobot * kredibilitas.",
        "skor = max ketiga artikel; EDD jika >= 25.",
      ],
      code: {
        starter: "# (kecocokan_nama, kata_kunci, kredibilitas). JANGAN UBAH.\nartikel = [(0.9, 40, 0.9),   # 'korupsi', media nasional\n           (0.6, 35, 0.7),   # 'ditangkap', media daerah\n           (1.0, 10, 0.3)]   # 'kontroversi', blog tak dikenal\n\n# TULIS KODEMU: skor adverse media\nskor = 0.0\nfor cocok, bobot, kred in artikel:\n    s =\n    skor = max(skor, s)\nprint(f\"Skor adverse media: {skor:.1f} -> {'EDD' if skor >= 25 else 'standar'}\")\n",
        lockLines: 5,
        solution: "# (kecocokan_nama, kata_kunci, kredibilitas). JANGAN UBAH.\nartikel = [(0.9, 40, 0.9),   # 'korupsi', media nasional\n           (0.6, 35, 0.7),   # 'ditangkap', media daerah\n           (1.0, 10, 0.3)]   # 'kontroversi', blog tak dikenal\n\n# TULIS KODEMU: skor adverse media\nskor = 0.0\nfor cocok, bobot, kred in artikel:\n    s = cocok * bobot * kred\n    skor = max(skor, s)\nprint(f\"Skor adverse media: {skor:.1f} -> {'EDD' if skor >= 25 else 'standar'}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Skor = 32,4", msg: "0,9×40×0,9.", name: "skor", value: 32.4, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Vonis EDD", msg: "≥25.", pattern: "Skor adverse media: 32\\.4 -> EDD" }
        ],
      },
      reference: "Skor = cocok × bobot × kredibilitas. Verifikasi manusia wajib.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Model memberi skor, analis memutuskan",
      prose: [
        "Satu: skor ML ≥90 + pola belum pernah terlihat → investigasi prioritas (inilah gunanya unsupervised: menangkap yang baru). Dua: skor 70–89 → triage analis standar; jangan auto-tutup. Tiga: skor <70 tetapi adverse media ≥25 → EDD manual: sinyal eksternal mengalahkan skor internal. Empat: model 'yakin' (skor ekstrem) tetapi data input tidak lengkap (KYC kadaluarsa) → perbaiki data dulu, jangan percaya skor dari data sampah.",
        "Aturan praktis 10 detik: skor tinggi + pola baru = investigasi. Skor vs sinyal eksternal bertentangan = menangkan sinyal eksternal. Data jelek = skor tidak valid.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bias model = risiko nyata: jika data latih SAR historis kebanyakan dari satu segmen nasabah, model akan 'rajin' meng-alert segmen itu dan buta di segmen lain — diskriminasi sistematis yang terdokumentasi. Validasi model wajib menguji performa PER SEGMEN, bukan agregat.",
      },
      reference: "Skor = prioritas. Sinyal eksternal > skor. Data jelek = skor void.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Rp2,1 miliar vs Rp30 miliar",
      prose: [
        "Bank Cakra pasca-ML: 12.000 alert/bulan (dari 40.000), 8 analis, precision 35%, recall 80%. Biaya analis: Rp150 ribu per alert yang dibuka (15 menit × Rp600 ribu/jam). Biaya 1 miss (kasus lolos): estimasi Rp500 juta (denda, remedi, reputasi). Kasus nyata: 400/bulan.",
        "Pertanyaan: (a) Hitung biaya FP dan miss per bulan. (b) Layak naikkan ambang agar alert tinggal 6.000? Pembahasan: (a) Recall 80% → TP 320, FN 80 → biaya miss = 80 × 500jt = Rp40 M. Precision 35% → alert dibuka = 320/0,35 ≈ 914 → FP ≈ 594 → biaya FP = 594 × 150rb ≈ Rp89 jt. Total ≈ Rp40,1 M/bulan — didominasi miss! (b) Ambang lebih tinggi → precision naik (FP turun, hemat Rp puluhan juta) tetapi recall turun (miss naik, rugi Rp miliaran). JAWABAN: jangan — biaya miss 450x biaya FP per kejadian. Kecuali analis benar-benar kolaps, di AFC recall lebih mahal daripada precision.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah matematika di balik 'lebih baik capek daripada lolos': 1 miss = 3.333 FP (500jt/150rb). Model yang 'menghemat analis' dengan mengorbankan recall = menghemat receh sambil membakar gudang. Selalu hitung dalam rupiah, bukan dalam persen.",
      },
      reference: "Biaya miss >> biaya FP. Optimasi = rupiah, bukan persen.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Kunci: metrik + batas model.",
      ],
      tasks: [],
      summary: [
        "ML monitoring: supervised (pola lama, presisi) + unsupervised (pola baru, berisik).",
        "Ukur dengan precision/recall/F1 — akurasi 99% pada data imbalance = penipu.",
        "Ambang = keputusan biaya: FN×biaya_miss vs FP×biaya_fp.",
        "pKYC: R_t = α·R_{t-1} + (1−α)·s_t — event-driven, bukan calendar-driven.",
        "Adverse media: cocok × bobot × kredibilitas — skor = alasan verifikasi, bukan bukti.",
        "Batas: buta pola baru, bias segmen, keputusan SAR tetap manusia.",
      ],
      next: { label: "AML15 — Sanctions Evasion Methods", href: "/learn/aml15-sanctions-evasion" },
      quiz: [
        {
          q: "Model: 100 kasus nyata, 400 alert, TP 80. Precision dan recall?",
          options: [
            { text: "P 20%, R 80%", why: "Benar: 80/400 = 20%; 80/100 = 80%.", correct: true },
            { text: "P 80%, R 20%", why: "Terbalik: precision = TP/alert, recall = TP/kasus." },
            { text: "P 99%, R 80%", why: "99% = akurasi semu, bukan precision." },
            { text: "P 20%, R 99%", why: "Recall = 80/100 = 80%, bukan 99%." }
          ],
        },
        {
          q: "Biaya miss Rp500 jt, FP Rp150 rb. Implikasi untuk ambang?",
          options: [
            { text: "Pilih ambang longgar (recall tinggi) — miss jauh lebih mahal", why: "Benar: 1 miss = 3.333 FP.", correct: true },
            { text: "Pilih ambang ketat — analis jangan capek", why: "Menghemat FP (Rp150 rb) sambil menambah miss (Rp500 jt) = rugi." },
            { text: "Pilih ambang dengan F1 tertinggi selalu", why: "F1 buta terhadap biaya rupiah." },
            { text: "Ambang tidak penting, yang penting akurasi", why: "Akurasi menipu pada data imbalance." }
          ],
        },
        {
          q: "pKYC: R kemarin 50, sinyal hari ini 90, α=0,7. Skor baru?",
          options: [
            { text: "62 → pantau", why: "Benar: 0,7×50 + 0,3×90 = 62; ambang pantau ≥40.", correct: true },
            { text: "70 → EDD", why: "Hitung ulang: 35 + 27 = 62, belum 70." },
            { text: "90 → EDD", why: "Itu jika α=0 (tanpa memori). α=0,7 menahan 70% skor lama." },
            { text: "50 → standar", why: "Sinyal 90 pasti mengangkat skor di atas 50." }
          ],
        },
        {
          q: "Skor adverse media 32 dari artikel media nasional. Tindakan benar?",
          options: [
            { text: "Baca artikelnya, konfirmasi identitas, baru EDD", why: "Benar: skor = alasan verifikasi, bukan bukti.", correct: true },
            { text: "Langsung tutup rekening nasabah", why: "Skor bukan vonis; bisa nama orang lain." },
            { text: "Abaikan karena di bawah 50", why: "Ambang EDD = 25; 32 sudah melewatinya." },
            { text: "Langsung tulis SAR", why: "SAR butuh indikasi transaksi mencurigakan, bukan sekadar berita." }
          ],
        },
        {
          q: "Model tidak pernah menaikkan skor pola 'pecah di bawah ambang'. Penyebab paling mungkin?",
          options: [
            { text: "Pola itu hampir tidak ada di data latih SAR historis", why: "Benar: supervised hanya tahu yang pernah dilihat.", correct: true },
            { text: "Server model kurang cepat", why: "Kecepatan tidak memengaruhi skor pola." },
            { text: "Ambang terlalu longgar", why: "Ambang longgar justru menaikkan skor lebih banyak pola." },
            { text: "Analis kurang terlatih", why: "Ini masalah model (data latih), bukan analis." }
          ],
        }
      ],
      reference: "P/R/F1, ambang = biaya, pKYC event-driven, skor = verifikasi.",
    },
  ],
};
