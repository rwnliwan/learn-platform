import type { V2Lesson } from "../lib/types";

export const bi15: V2Lesson = {
  slug: "bi15-proteomik",
  track: "Bioinformatika",
  module: "Proteomik & Multi-Omics",
  title: "BI15 · Proteomik & Multi-Omics: AlphaFold dan Integrasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Struktur yang menunggu 50 tahun",
      prose: [
        "Menentukan SATU struktur protein via kristalografi: 1 PhD, 3 tahun, Rp1 miliar. Tahun 2021, AlphaFold memprediksi 200 juta struktur dalam setahun — gratis. Masalah 50 tahun (protein folding) runtuh dalam semalam.",
        "Tapi struktur bukan segalanya: protein bekerja dalam jaringan interaksi, modifikasi, dan konteks sel. Twist-nya: RNA naik belum tentu protein naik (regulasi translasi!) — korelasi RNA-protein di sel manusia hanya ~0,4. Satu lapisan omics yang dibaca sendirian bisa berbohong dengan percaya diri. Multi-omics bukan kemewahan; ia adalah koreksi silang terhadap kebohongan tiap lapisan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa struktur ≠ fungsi" },
        { id: "t2", text: "Jelaskan kenapa korelasi RNA-protein 0,4 menjadi masalah" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira AlphaFold mengakhiri biologi struktural. AlphaFold memprediksi SATU konformasi statis dengan keyakinan bervariasi. Dinamika, kompleks baru, efek mutasi, dan interaksi ligan tetap butuh eksperimen + simulasi. Ia mengakselerasi — bukan mengakhiri.",
      },
      reference: "AlphaFold = struktur dari sekuens. Multi-omics = koreksi silang antar lapisan.",
    },
    {
      id: "lab-peptida",
      eyebrow: "Langkah 2 · Lab",
      title: "Identifikasi peptida dan target-decoy",
      prose: [
        "Mass spec tidak “membaca protein”; ia menimbang fragmen peptida dan mencocokkan polanya ke database. Di lab ini kamu mencocokkan spektra observasi ke 3 kandidat via skor sederhana (fraksi fragmen cocok dalam toleransi).",
        "Perhatikan kandidat DECOY_X (acak): ia ikut menang! Inilah gunanya target-decoy — mencocokkan ke database asli + umpan (urutan terbalik) untuk mengestimasi FDR. Standar: FDR 1% di level peptida DAN protein.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `skor` (fraksi fragmen cocok)" },
        { id: "t2", text: "Urutkan kandidat dan identifikasi masalah decoy" },
      ],
      expected: "PEPTIDA & DECOY_X tie 100% → curigai FDR!",
      hints: [
        "Cocok = ada fragmen teoritis dalam toleransi 0.5 dari observasi.",
        "Skor = jumlah cocok / jumlah observasi.",
        "Urutkan menurun dengan sorted(..., reverse=True).",
      ],
      code: {
        starter: `spektra = [100.1, 200.3, 315.2, 428.4, 541.6]\nkandidat = {'PEPTIDA': [100.0, 200.1, 315.0, 428.2, 541.5],\n            'PEPTIDB': [100.5, 210.0, 300.0, 400.0, 500.0],\n            'DECOY_X': [99.9, 200.4, 315.3, 428.5, 541.7]}\n\ndef skor(obs, teor, tol=0.5):\n    # TULIS KODEMU: fraksi fragmen observasi yang cocok\n    cocok = \n    return cocok/len(obs)\n\nhasil = sorted(((skor(spektra, t), n) for n, t in kandidat.items()), reverse=True)\nfor s, n in hasil:\n    print(f'{n}: skor={s:.0%}')\nprint()\nprint('DECOY_X menang/tie -> curigai FDR!')`,
        lockLines: 4,
        solution: `spektra = [100.1, 200.3, 315.2, 428.4, 541.6]\nkandidat = {'PEPTIDA': [100.0, 200.1, 315.0, 428.2, 541.5],\n            'PEPTIDB': [100.5, 210.0, 300.0, 400.0, 500.0],\n            'DECOY_X': [99.9, 200.4, 315.3, 428.5, 541.7]}\n\ndef skor(obs, teor, tol=0.5):\n    # TULIS KODEMU: fraksi fragmen observasi yang cocok\n    cocok = sum(1 for o in obs if any(abs(o-t) < tol for t in teor))\n    return cocok/len(obs)\n\nhasil = sorted(((skor(spektra, t), n) for n, t in kandidat.items()), reverse=True)\nfor s, n in hasil:\n    print(f'{n}: skor={s:.0%}')\nprint()\nprint('DECOY_X menang/tie -> curigai FDR!')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "PEPTIDA: skor=100%", label: "PEPTIDA skor 100%", msg: "Semua 5 fragmen PEPTIDA dalam toleransi 0.5 dari observasi." },
          { kind: "stdout_matches", task: "t2", pattern: "DECOY_X: skor=100%", label: "DECOY_X juga 100% → curigai", msg: "Decoy acak ikut 100% = sinyal FDR. Tanpa target-decoy, “identifikasi” = tebakan." },
        ],
      },
      note: {
        title: "Intuisi: spektrometer menimbang, bukan membaca — perlakukan hasilnya seperti itu",
        body: "Praktisi proteomik menyimpan lima heuristik yang tidak ada di brosur vendor. Satu: FDR 1% dari 10.000 PSM berarti ~100 identifikasi salah — selalu terjemahkan persen ke angka absolut sebelum memercayai daftar protein. Dua: waspadai protein inference — peptida yang dipakai bersama banyak protein (shared peptides) tidak bisa menetapkan protein mana yang benar-benar ada; protein yang hanya didukung peptida bersama adalah klaim lemah. Tiga: plasma darah punya dynamic range 10^10 — albumin dan segelintir protein menutupi biomarker langka; tanpa depletion atau fraksinasi, kamu mengukur yang melimpah, bukan yang penting. Empat: missing value sering INFORMATIF — protein yang hilang di 80% sampel sakit tetapi ada di semua kontrol mungkin justru biomarkernya; imputasi buta menghapus sinyal ini. Lima: korelasi RNA-protein hanya ~0,4 — bila obatmu menarget protein, ukur proteinnya; mengandalkan RNA sebagai proxy adalah taruhan yang separuh waktu salah. Heuristik gabungannya: setiap daftar protein harus bisa menjawab tiga pertanyaan — berapa FDR-nya dalam angka absolut, peptida unik apa yang mendukungnya, dan berapa persen datanya yang hilang.",
      },
      reference: "Identifikasi = pencocokan pola. Target-decoy → FDR 1% terkontrol.",
    },
    {
      id: "lab-integrasi",
      eyebrow: "Langkah 3 · Lab",
      title: "mRNA vs protein: cari diskrepansi",
      prose: [
        "Diberikan log2FC mRNA dan protein untuk 8 gen: hitung korelasinya, lalu tandai gen dengan regulasi pasca-transkripsi (|selisih| > 2).",
        "Gen C dan F: mRNA naik, protein tidak — degradasi atau translasi yang ditahan. Tanpa proteomik, keduanya terlihat “aktif”. Obat bekerja pada PROTEIN — mengabaikan lapisan ini = mengabaikan target obat itu sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Hitung korelasi Pearson mRNA vs protein" },
        { id: "t2", text: "Tandai gen diskrepan (|selisih| > 2)" },
      ],
      expected: "r ~0.7 · gen C dan F diskrepan (protein diredam)",
      hints: [
        "Pearson = kovarians / (sd_x * sd_y).",
        "Selisih = |mRNA - protein| per gen.",
        "Arah: mRNA > protein → 'protein diredam'.",
      ],
      code: {
        starter: `import statistics as st\nmrna = {'A':1.0,'B':2.0,'C':3.0,'D':4.0,'E':5.0,'F':6.0,'G':7.0,'H':8.0}\nprot = {'A':1.1,'B':2.2,'C':0.2,'D':4.3,'E':5.1,'F':1.0,'G':7.2,'H':7.9}\n\n# TULIS KODEMU: korelasi Pearson\nxm, xp = list(mrna.values()), list(prot.values())\nmx, mp = st.mean(xm), st.mean(xp)\nr = \nprint(f'korelasi mRNA-protein: r={r:.2f}')\nprint('gen diskrepan (|selisih|>2):')\nfor g in mrna:\n    d = abs(mrna[g]-prot[g])\n    if d > 2:\n        arah = 'protein diredam' if mrna[g] > prot[g] else 'protein diperkuat'\n        print(f'  {g}: mRNA={mrna[g]}, protein={prot[g]} -> {arah}')`,
        lockLines: 3,
        solution: `import statistics as st\nmrna = {'A':1.0,'B':2.0,'C':3.0,'D':4.0,'E':5.0,'F':6.0,'G':7.0,'H':8.0}\nprot = {'A':1.1,'B':2.2,'C':0.2,'D':4.3,'E':5.1,'F':1.0,'G':7.2,'H':7.9}\n\n# TULIS KODEMU: korelasi Pearson\nxm, xp = list(mrna.values()), list(prot.values())\nmx, mp = st.mean(xm), st.mean(xp)\nr = sum((a-mx)*(b-mp) for a,b in zip(xm,xp)) / \\\n    (sum((a-mx)**2 for a in xm)*sum((b-mp)**2 for b in xp))**0.5\nprint(f'korelasi mRNA-protein: r={r:.2f}')\nprint('gen diskrepan (|selisih|>2):')\nfor g in mrna:\n    d = abs(mrna[g]-prot[g])\n    if d > 2:\n        arah = 'protein diredam' if mrna[g] > prot[g] else 'protein diperkuat'\n        print(f'  {g}: mRNA={mrna[g]}, protein={prot[g]} -> {arah}')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "korelasi mRNA-protein: r=0\\.\\d+", label: "korelasi tercetak", msg: "Hitung Pearson dari 8 pasangan mRNA-protein." },
          { kind: "stdout_matches", task: "t2", pattern: "C: mRNA=3\\.0, protein=0\\.2 -> protein diredam", label: "gen C diskrepan", msg: "C: |3.0-0.2|=2.8 > 2 → protein diredam." },
          { kind: "stdout_matches", task: "t2", pattern: "F: mRNA=6\\.0, protein=1\\.0 -> protein diredam", label: "gen F diskrepan", msg: "F: |6.0-1.0|=5.0 > 2 → protein diredam." },
        ],
      },
      reference: "mRNA ≠ protein. Diskrepansi = temuan regulasi pasca-transkripsi.",
    },
    {
      id: "alphafold-mofa",
      eyebrow: "Langkah 4 · Struktur & integrasi",
      title: "Baca pLDDT; integrasikan dengan MOFA",
      prose: [
        "Setiap prediksi AlphaFold punya skor kepercayaan per residu (pLDDT): >90 andal; 70–90 hati-hati; <70 jangan untuk desain presisi. Struktur “indah” dengan pLDDT 40 = lukisan, bukan data. Untuk docking virtual screening: 10.000 senyawa → skor → top 100 → uji in vitro → 5 hit. Funnel standar — komputasi mempercepat, bukan melompati tahap.",
        "Multi-omics (MOFA): tiap lapisan data dijelaskan oleh faktor laten BERSAMA. Contoh: mutasi + metilasi + mRNA + protein, 200 tumor — MOFA menemukan faktor laten yang menjelaskan variansi di SEMUA omics → 3 subtipe pasien. Satu omics saja tidak menemukan subtipe ini; sinyalnya terdistribusi.",
        "Jebakan integrasi: batch per-omics beda! Integrasikan setelah koreksi per lapisan. Dan tiap omics = biaya + kompleksitas — tanpa hipotesis dan n cukup, multi-omics = multi-noise.",
      ],
      tasks: [
        { id: "t1", text: "Region pLDDT 45: boleh untuk desain obat presisi?" },
        { id: "t2", text: "Jelaskan kenapa faktor laten bersama MOFA lebih berharga dari daftar per-omics" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira mRNA = protein sehingga proteomik mubazir. Korelasi mRNA-protein hanya ~0,4–0,6: translasi, degradasi, dan PTM memutus hubungan. Obat bekerja pada protein — lapisan ini tidak tergantikan.",
      },
      reference: "pLDDT >90 andal · MOFA: faktor bersama > tumpukan daftar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: ambang dan desain apa di proteomik?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Membaca prediksi struktur AlphaFold. → Cek pLDDT dulu: >90 andal, 70–90 hati-hati, <70 jangan untuk desain presisi. Alasan: pLDDT = kepercayaan per residu; struktur “indah” ber-pLDDT 40 adalah lukisan. Contoh nyata: docking gagal total di loop ber-pLDDT rendah.",
        "Skenario 2 — Melaporkan identifikasi protein. → FDR level protein, bukan cuma PSM. Alasan: FDR 1% di level PSM bisa menjadi 5%+ di level protein karena akumulasi. Contoh nyata: “500 protein baru” yang menyusut setelah FDR protein-level.",
        "Skenario 3 — Kohort besar multi-batch. → LFQ (label-free). Alasan: murah, tanpa batas jumlah sampel, cocok lintas batch. Contoh nyata: 300 plasma lintas 6 bulan.",
        "Skenario 4 — Sedikit sampel, butuh presisi kuantifikasi. → TMT (isobaric labeling). Alasan: multiplex dalam satu run menghilangkan variabilitas antar-run. Contoh nyata: 16 sampel diobati vs kontrol dalam satu batch TMT.",
        "Skenario 5 — Mengintegrasikan mutasi + metilasi + mRNA + protein. → MOFA (faktor laten bersama). Alasan: satu faktor menjelaskan variansi di SEMUA omics — korelasi sepasang omics melewatkan pola bersama. Contoh nyata: 3 subtipe tumor yang tak terlihat dari satu omics saja.",
        "Aturan praktis 10 detik: pLDDT <70 = lukisan; yang menentukan = FDR level protein; satu omics tidak menjawab pertanyaan multi-lapisan."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai struktur ber-pLDDT 45 untuk virtual screening presisi — region tak terstruktur diprediksi sebagai “bentuk”, bukan kepastian; docking di atasnya adalah judi komputasional, bukan desain obat.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "“Obat dari docking” tanpa validasi",
      prose: [
        "Tim komputasional melaporkan 3 kandidat obat dari docking ke struktur AlphaFold (pLDDT 55 di kantong ikatan). Manajemen ingin langsung paten + uji klinis. Keberatanmu sebagai bioinformatikawan:",
        "Tiga lampu merah. (1) pLDDT 55 di kantong = struktur tak terpercaya untuk docking presisi — pose bisa fiktif total. (2) Docking ≠ afinitas nyata: skor berkorelasi lemah dengan Kd eksperimental; tanpa uji in vitro, kandidat = hipotesis. (3) Tanpa ADMET/toksisitas, lompat ke klinik = berbahaya.",
        "Jalur benar: validasi struktur → docking ulang → uji in vitro 100 senyawa → optimasi lead → hewan → klinik. “In silico hit” ≠ obat — bedakan di setiap slide presentasi.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga lampu merah pada kasus ini" },
        { id: "t2", text: "Tulis jalur pengembangan yang benar" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Lompat ke klinik berbasis docking tak tervalidasi = risiko keselamatan pasien + modal hangus. Di risiko pengembangan obat, tiap tahap funnel adalah kontrol: komputasi mempercepat penyaringan, bukan menghapus validasi.",
      },
      reference: "Komputasi mempercepat funnel, bukan melompati tahap.",
    },
    {
      id: "kuantifikasi-fdr",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "FDR dua level, LFQ vs TMT, dan nilai yang hilang",
      prose: [
        "Target-decoy terlihat sederhana: cocokkan spektra ke database target + database umpan (sekuens terbalik/acak), lalu FDR = jumlah decoy dibagi jumlah target pada ambang skor tertentu. Tetapi iblisnya ada di detail. Pertama, level FDR: 1% di level PSM tidak sama dengan 1% di level protein — satu protein didukung banyak PSM, dan agregasi yang naif menumpuk error. Standar komunitas: 1% di KEDUA level (peptida dan protein). Kedua, protein inference problem: peptida yang cocok ke banyak protein (isoform atau famili gen) tidak bisa menetapkan protein mana yang benar-benar hadir. Praktik jujur: laporkan protein group, dan tandai protein yang hanya didukung shared peptides sebagai ambigu — bukan sebagai temuan.",
        "Kuantifikasi label-free (LFQ): tiap sampel di-run terpisah, intensitas dibandingkan antar-run. Kelebihan: murah, tidak ada batas jumlah sampel, cocok untuk kohort besar multi-batch. Kelemahan: variabilitas antar-run (waktu retensi bergeser, intensitas fluktuatif) dan missing values — peptida yang terdeteksi di run A belum tentu terdeteksi di run B. Butuh normalisasi antar-run dan match-between-runs. Kuantifikasi TMT: sampel diberi label isobarik berbeda, dicampur, di-run SEKALIGUS (multiplex hingga 16-plex) — variabilitas teknis dalam satu plex nyaris nol. Kelebihan: presisi relatif tinggi, missing value minimal dalam plex. Kelemahan: ratio compression — interferensi co-isolation (peptida pengganggu ikut terfragmentasi) menekan rasio terukur: perbedaan 10x yang nyata terlihat sebagai 3x. Plus batch effect ANTAR-plex yang butuh desain bridge channel.",
        "Aturan keputusan: kohort besar (ratusan sampel, multi-batch, budget terbatas) → LFQ + normalisasi ketat + laporkan persen missing. Perbandingan presisi sedikit kondisi dalam satu batch (mis. time-course 8 titik × 2 ulangan) → TMT. Studi biomarker plasma → LFQ dengan depletion protein abundan (dynamic range plasma 10^10: albumin menutupi segalanya). Jangan campur: membandingkan angka TMT dan LFQ lintas studi tanpa kalibrasi = membandingkan apel dan durian.",
        "Missing values: bedakan DUA jenis. MNAR (missing not at random): protein di bawah limit deteksi — memang rendah atau tidak ada di sampel itu; pola missing-nya INFORMATIF (hilang di kelompok sakit = kandidat biomarker). MAR (missing at random): hilang karena fluktuasi teknis — peptida tidak terpilih untuk fragmentasi di run itu; tidak informatif. Imputasi yang salah = artefak: mengimputasi mean global pada data MNAR mengecilkan perbedaan nyata antar-kelompok; mengimputasi nilai minimum pada data MAR menambah noise. Praktik yang benar: (1) laporkan persen missing per kelompok SEBELUM imputasi; (2) jangan imputasi bila missing di atas 50% pada satu kelompok — analisis sebagai data kategorikal (ada/tidak) saja; (3) uji sensitivitas: hasil harus bertahan dengan dan tanpa imputasi. Protein yang “signifikan hanya setelah imputasi” = temuan imputasi, bukan temuan biologi.",
        "Contoh kerja: 60 sampel plasma (30 kasus, 30 kontrol), LFQ. Protein X terdeteksi di 28/30 kontrol tetapi hanya 6/30 kasus — missing 80% di kasus. Analis A mengimputasi mean → protein X “tidak signifikan” (p = 0,2). Analis B memperlakukan sebagai MNAR: uji Fisher ada/tidak → p < 10^-6. Protein X adalah kandidat biomarker yang hampir terhapus oleh imputasi buta. Pelajaran: sebelum mengisi yang hilang, tanyakan dulu MENGAPA ia hilang — jawabannya sering lebih berharga daripada angkanya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan FDR level PSM vs level protein" },
        { id: "t2", text: "Kapan memilih LFQ dan kapan memilih TMT" },
      ],
      quiz: [
        {
          q: "TMT melaporkan rasio 3x; validasi targeted menunjukkan 10x yang nyata. Fenomena apa ini?",
          options: [
            { text: "Kesalahan pipet saat pelabelan", why: "Ratio compression bersifat sistematis, bukan acak seperti kesalahan pipet." },
            { text: "Ratio compression dari interferensi co-isolation", why: "Peptida pengganggu ikut terfragmentasi dan mengencerkan rasio reporter ion.", correct: true },
            { text: "FDR terlalu longgar", why: "FDR mengatur identifikasi, bukan besarnya rasio kuantifikasi." },
            { text: "Normalisasi median yang salah", why: "Normalisasi menggeser semua rasio seragam, bukan menekan rasio besar secara selektif." },
          ],
        },
        {
          q: "Protein hilang di 80% sampel satu kelompok. Tindakan yang benar?",
          options: [
            { text: "Imputasi mean lalu uji-t seperti biasa", why: "Imputasi mean pada pola MNAR menghapus sinyal — inilah cara biomarker terhapus." },
            { text: "Jangan imputasi buta — analisis pola missing-nya (ada/tidak); mungkin justru biomarker", why: "Missing yang informatif adalah data, bukan masalah data.", correct: true },
            { text: "Buang proteinnya dari analisis", why: "Membuang = membuang kemungkinan temuan terbaikmu." },
            { text: "Ulangi seluruh eksperimen MS", why: "Pola missing sistematis antar-kelompok bukan kegagalan teknis yang diperbaiki run ulang." },
          ],
        },
        {
          q: "10.000 PSM lolos pada FDR 1%. Berapa identifikasi yang diperkirakan salah?",
          options: [
            { text: "~100 — FDR adalah proporsi yang salah di antara yang lolos", why: "Benar: 1% dari 10.000 = ~100. Selalu terjemahkan persen ke angka absolut.", correct: true },
            { text: "0 — FDR 1% berarti praktis sempurna", why: "Salah: 1% bukan 0%; pada skala ribuan, 1% = ratusan kesalahan." },
            { text: "1.000", why: "Salah: itu 10%, bukan 1%." },
            { text: "Tidak bisa diketahui", why: "Salah: justru itulah gunanya target-decoy — mengestimasi jumlah yang salah." },
          ],
        },
        {
          q: "Protein hanya didukung peptida yang juga cocok ke 5 protein lain. Statusnya?",
          options: [
            { text: "Temuan kuat — peptidanya teridentifikasi valid", why: "Salah: peptida valid tidak berarti proteinnya pasti — inilah protein inference problem." },
            { text: "Ambigu — laporkan sebagai protein group, jangan klaim protein spesifik", why: "Benar: shared peptides tidak bisa menetapkan identitas; klaim spesifik = melebihi bukti.", correct: true },
            { text: "Buang dari analisis", why: "Salah: jangan buang — laporkan sebagai grup ambigu; informasinya tetap ada." },
            { text: "Naikkan FDR agar lolos", why: "Salah: melonggarkan FDR tidak menyelesaikan ambiguitas identitas." },
          ],
        },
      ],
      reference: "FDR 1% di dua level · LFQ = skala, TMT = presisi · missing bisa informatif.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Proteomik MS: spektra → peptida → protein; FDR target-decoy 1%.",
        "mRNA ≠ protein (r~0,5) — proteomik mengisi kesenjangan.",
        "AlphaFold: struktur dari sekuens; baca pLDDT; statis, bukan dinamis.",
        "Docking: funnel virtual screening — validasi in vitro wajib.",
        "Multi-omics (MOFA/network): faktor bersama lintas lapisan.",
        "Desain: sampel sama lintas omics; koreksi batch per lapisan.",
      ],
      next: { label: "BI16 · Machine Learning untuk Biologi", href: "/v2/learn/bi16-ml-bio" },
      quiz: [
        {
          q: "pLDDT 45 pada suatu region AlphaFold artinya…",
          options: [
            { text: "Sangat yakin", why: "Sangat yakin = pLDDT >90." },
            { text: "Tidak yakin (mungkin fleksibel/tak terstruktur) — jangan untuk desain presisi", why: "pLDDT = keyakinan per residu. <70 = jangan pakai untuk klaim presisi.", correct: true },
            { text: "Error komputasi", why: "Bukan error; ini skor kepercayaan yang valid." },
            { text: "Harus dihapus", why: "Region fleksibel bisa fungsional (disordered); jangan hapus, jangan percaya untuk presisi." },
          ],
        },
        {
          q: "Korelasi mRNA-protein ~0,5 menunjukkan…",
          options: [
            { text: "RNA-seq gagal", why: "RNA-seq mengukur dengan benar; yang berbeda adalah biologi regulasi." },
            { text: "Regulasi pasca-transkripsi signifikan — proteomik dibutuhkan", why: "Kesenjangan ini = alasan proteomik & multi-omics ada.", correct: true },
            { text: "Protein tidak penting", why: "Protein justru lapisan aksi obat." },
            { text: "Data buruk", why: "Ini pola biologis umum, bukan artefak." },
          ],
        },
        {
          q: "FDR 1% di proteomik diestimasi via…",
          options: [
            { text: "Feeling", why: "FDR dihitung, bukan dirasakan." },
            { text: "Target-decoy: cocokkan ke database + urutan terbalik", why: "Decoy mengukur tebakan. Tanpa itu, identifikasi = klaim tanpa kontrol.", correct: true },
            { text: "Uji-t", why: "Uji-t untuk perbedaan kuantitatif, bukan FDR identifikasi." },
            { text: "Tidak perlu", why: "Tanpa FDR, daftar protein = campuran benar dan salah." },
          ],
        },
        {
          q: "MOFA menemukan faktor laten yang menjelaskan variansi di SEMUA omics. Artinya?",
          options: [
            { text: "Noise", why: "Noise tidak konsisten lintas lapisan independen." },
            { text: "Sinyal biologis bersama — kandidat mekanisme/subtipe", why: "Orkestra, bukan solo. Faktor bersama = cerita integratif.", correct: true },
            { text: "Batch effect pasti", why: "Bisa jadi batch — tapi harus diverifikasi, bukan disimpulkan." },
            { text: "Error analisis", why: "Ini justru output yang diharapkan dari integrasi yang benar." },
          ],
        },
        {
          q: "Docking virtual screening yang benar?",
          options: [
            { text: "Langsung klinik", why: "Berbahaya: tanpa validasi in vitro dan toksisitas." },
            { text: "Funnel: ribuan senyawa → skor → validasi in vitro → optimasi", why: "Komputasi mempercepat, bukan melompati. In silico ≠ obat.", correct: true },
            { text: "Skor terbaik = obat", why: "Skor docking berkorelasi lemah dengan afinitas nyata." },
            { text: "Tanpa struktur", why: "Docking butuh struktur kantong ikatan." },
          ],
        },
      ],
    },
  ],
};
