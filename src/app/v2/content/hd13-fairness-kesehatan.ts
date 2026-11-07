import type { V2Lesson } from "../lib/types";

export const hd13: V2Lesson = {
  slug: "hd13-fairness-kesehatan",
  track: "Health Data Science",
  module: "Data Science Klinis",
  title: "HD13 Fairness di Kesehatan: Ketika AI Memihak",
  estMinutes: 50,
  steps: [
    {
      id: "skor-rasis",
      eyebrow: "Langkah 1 · Masalah",
      title: "Skor yang rasis — tanpa programmer yang rasis",
      prose: [
        "2019, jurnal Science: algoritma yang dipakai RS AS untuk memprioritaskan perawatan meremehkan kebutuhan pasien kulit hitam secara sistematis. Penyebabnya bukan programmer rasis — melainkan label: model memprediksi biaya kesehatan sebagai proksi kebutuhan kesehatan. Karena pasien kulit hitam secara historis menerima layanan lebih sedikit (biaya lebih rendah), model menyimpulkan mereka “kurang butuh”.",
        "Label yang terlihat netral (“biaya”) membawa sejarah ketidakadilan ke dalam model. Di Indonesia, versi lokalnya: model yang dilatih di RS swasta Jakarta bisa gagal total untuk pasien puskesmas Papua — bukan karena AI jahat, tapi karena dunianya beda.",
        "Twist-nya: tidak ada programmer yang rasis di cerita ini — dan hasilnya tetap rasis. Ketidakadilan tidak butuh niat jahat, cukup label yang ceroboh. Fairness bukan fitur tambahan yang dipasang belakangan; ia adalah pertanyaan pertama sebelum model menyentuh pasien: “siapa yang dirugikan jika aku salah, dan apakah mereka yang selama ini sudah dirugikan?”",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira menghapus variabel sensitif (etnis, gender) dari fitur membuat model adil. Justru sebaliknya seringnya: model mempelajari proksi (kode pos, nama, bahasa) yang berkorelasi dengan variabel sensitif — kini tanpa bisa diaudit per grup karena grupnya “tidak ada”. “Buta” tidak sama dengan “adil”.",
        type: "pitfall",
      },
      reference: "Audit fairness sebelum optimasi akurasi. Setelah deploy = skandal.",
    },
    {
      id: "empat-pintu",
      eyebrow: "Langkah 2 · Sumber bias",
      title: "Empat pintu masuk bias",
      prose: [
        "Bias data: siapa yang tercatat (RS swasta Jakarta ≠ puskesmas timur Indonesia). Bias label: proksi yang membawa sejarah (biaya ≠ kebutuhan). Bias representasi: grup minoritas sedikit di training (pasien >70 tahun hanya 3% data). Bias deployment: dipakai di populasi atau waktu berbeda.",
        "Contoh Indonesia: model rujukan dilatih dari 3 RS swasta Jakarta — 45% data training dari RS yang melayani <10% populasi. Model belajar “normal” = pasien Jakarta swasta; saat dipakai di puskesmas timur ia buta. Representasi bukan soal politik — soal validitas statistik.",
        "Audit fairness: periksa keempat pintu BERURUTAN sebelum menyentuh metrik. Kebanyakan kasus nyata (termasuk Science 2019) akarnya di label, bukan di algoritma. Di Indonesia, disparitas paling tajam sering berbentuk wilayah dan kelas faskes: model Jakarta vs Papua, RS swasta vs puskesmas — bukan template AS yang diimpor mentah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Model rujukan yang bias menolak rujukan pasien yang seharusnya diterima — merugikan yang paling jauh dari Jakarta, yang paling rentan. “Kami akan pantau setelah launch” untuk fairness berarti membiarkan pasien menjadi kelinci percobaan ketidakadilan modelmu.",
        type: "risk",
      },
      quiz: [
        {
          q: "Kasus Science 2019: model memakai BIAYA sebagai proksi KEBUTUHAN. Ini bias…",
          options: [
            { text: "Label", why: "Benar: labelnya yang membawa sejarah ketidakadilan. Algoritmanya “benar” memprediksi label yang salah konsep.", correct: true },
            { text: "Data", why: "Datanya mungkin representatif — masalahnya adalah apa yang diprediksi (label), bukan siapa yang tercatat." },
            { text: "Representasi", why: "Representasi soal proporsi grup di training; di sini masalahnya definisi label." },
            { text: "Deployment", why: "Deployment soal pemakaian di populasi berbeda; model ini bias bahkan di populasi trainingnya." },
          ],
        },
      ],
      reference: "90% masalah fairness lahir di definisi label, bukan di arsitektur model.",
    },
    {
      id: "metrik-impossibility",
      eyebrow: "Langkah 3 · Metrik",
      title: "Tiga metrik yang tidak bisa akur",
      prose: [
        "Demographic parity: tingkat positif sama antar grup. Equalized odds: TPR & FPR sama antar grup. Kalibrasi per grup: angka jujur di tiap grup. Teorema impossibility (Chouldechova 2017, Kleinberg 2016): bila base rate beda antar grup, ketiganya tidak bisa dipenuhi bersamaan — kecuali model sempurna atau acak.",
        "Contoh dalam angka: dua grup, base rate butuh-perawatan A=10%, B=30%, model sempurna terkalibrasi per grup. Demographic parity menuntut tingkat rujukan SAMA → melanggar kalibrasi (salah satu grup dirujuk berlebihan atau kurang). Equalized odds + kalibrasi bisa jalan, tapi parity dikorbankan.",
        "Tidak ada metrik tunggal yang benar — pilih sesuai nilai klinis dan nyatakan trade-off-nya eksplisit. Untuk alokasi perawatan, equalized odds (kesempatan terdeteksi sama) lebih relevan dari demographic parity. Untuk skrining penyakit mematikan, prioritaskan equal opportunity/TPR; untuk alokasi bantuan terbatas, pilih kalibrasi per grup agar skor berarti sama untuk semua.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengejar semua metrik fairness sekaligus lalu frustrasi. Metrik fairness seperti tiga orang menarik selimut: menutupi satu membuka yang lain. Tugasmu bukan memuaskan ketiganya — tapi memilih siapa yang boleh kedinginan, dan mempertanggungjawabkannya secara tertulis.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Base rate beda antar grup. Yang BENAR tentang metrik fairness?",
          options: [
            { text: "Demographic parity + equalized odds + kalibrasi tak bisa bersamaan — pilih sesuai misi", why: "Benar: teorema impossibility. Pilih metrik sesuai nilai klinis dan nyatakan trade-off eksplisit.", correct: true },
            { text: "Semua metrik bisa dipenuhi bersamaan", why: "Salah: justru itu yang dibuktikan mustahil oleh teorema impossibility." },
            { text: "Cukup pakai akurasi", why: "Akurasi agregat adalah tempat bersembunyi disparitas — ia menyembunyikan penderitaan minoritas." },
            { text: "Tidak ada metrik yang valid", why: "Terlalu nihilistik: metrik-metrik itu valid, hanya tidak bisa semuanya sekaligus." },
          ],
        },
      ],
      reference: "Ukur per grup; agregat menyembunyikan disparitas — secara matematis.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: AI kesehatan yang adil",
      prose: [
        "Lima situasi keputusan yang dihadapi tim AI kesehatan — karena “AUC keseluruhan bagus” tidak pernah cukup sebagai jawaban:",
        "Skenario 1 — “Model siap deploy — sudah adil?” → Audit per grup DULU: tabel 2×2 per kelompok (TPR, FPR, PPV) — bukan cuma AUC agregat. Contoh: model rujukan dengan AUC 0,87 ternyata TPR Grup A 75% vs Grup B 50% — separuh pasien pedesaan yang butuh rujukan terlewat. Agregat menyembunyikan siapa yang terlewat.",
        "Skenario 2 — “Ditemukan disparitas — sumbernya dari pintu mana?” → Diagnosis empat pintu: representasi (Grup B hanya 15% data latih), label (”butuh rujukan” didefinisikan dari rujukan historis — padahal akses B lebih rendah sehingga labelnya under-ascertained), fitur proxy (kode pos sebagai proksi ras/pendapatan), agregasi (satu threshold untuk semua). Obatnya beda untuk tiap pintu.",
        "Skenario 3 — “Metrik fairness mana yang dipakai?” → Pilih yang selaras dengan bahaya klinisnya — dan ingat impossibility theorem: kalibrasi per grup + equalized odds tidak bisa dipenuhi bersamaan bila prevalensi antar grup berbeda. Untuk rujukan yang terlewat = bahaya, utamakan equal opportunity (TPR setara); untuk alokasi sumber daya langka, pertimbangkan kalibrasi. Jangan kejar semua metrik sekaligus.",
        "Skenario 4 — “Bagaimana memitigasinya?” → Bertahap dan terukur: (a) perbaiki label — definisikan “butuh” dari kriteria klinis, bukan perilaku historis yang bias; (b) tambah data / bobot ulang grup yang kurang terwakili; (c) threshold per grup hingga TPR setara. Verifikasi: contoh audit menutup gap 25 poin menjadi 2 poin dengan harga AUC hanya 0,01 — trade-off akurasi-vs-fairness sering kecil, jangan jadikan alasan menunda.",
        "Skenario 5 — “Grup kecil atau irisan identitas?” → Audit interseksionalitas: disparitas bisa bersembunyi di irisan (mis. perempuan pedesaan lansia) yang tak terlihat saat grup dianalisis satu dimensi. Sampel kecil di irisan bukan alasan melewatkan — laporkan dengan interval ketidakpastian yang jujur.",
        "Aturan praktis 10 detik: deploy → audit per grup dulu → disparitas → diagnosis empat pintu → metrik sesuai bahaya klinis (ingat impossibility) → mitigasi bertahap + verifikasi → cek irisan identitas.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Vendor berdalih “AUC keseluruhan 0,87, sudah bagus” saat audit menemukan kesenjangan antar grup. Tolak argumen itu setiap kali: metrik agregat adalah rata-rata yang mengorbankan minoritas. Fairness diukur per grup, di dashboard monitoring, selamanya — bukan sekali saat audit.",
        type: "pitfall",
      },
      reference: "Audit = tabel 2×2 per grup + diagnosis empat pintu + mitigasi + verifikasi. Agregat menyembunyikan.",
    },
    {
      id: "audit-disparitas",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Audit disparitas: TPR 75% vs 50%",
      prose: [
        "Model memprediksi “butuh rujukan spesialis”. Evaluasi pada 2.000 pasien: Grup A (1.200, perkotaan): TP=180, FN=60, FP=120, TN=840. Grup B (800, pedesaan): TP=90, FN=90, FP=60, TN=560. Hitung: TPR A = 180/240 = 75%; TPR B = 90/180 = 50%. Kesenjangan 25 poin — model melewatkan separuh pasien Grup B yang butuh rujukan, vs seperempat di Grup A.",
        "Diagnosis penyebab: representasi training Grup B hanya 15% data latih, dan label “butuh rujukan” didefinisikan dari rujukan yang benar-benar terjadi — padahal pasien B yang butuh lebih jarang dirujuk (akses!) sehingga label B under-ascertained. Dua pintu bias sekaligus: representasi + label.",
        "Mitigasi bertahap: (a) perbaiki label — definisikan ulang “butuh” dari kriteria klinis (skor keparahan), bukan rujukan historis; (b) tambah data B / bobot ulang; (c) threshold per grup — turunkan threshold B hingga TPR setara (equal opportunity), dengan harga FPR B naik. Setelah mitigasi: TPR A=74%, TPR B=72% (gap 2 poin), dengan penurunan AUC hanya 0,01. Trade-off akurasi-vs-fairness sering kecil — jangan jadikan alasan menunda.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Contoh kedua, dari audit skor prioritas vaksin (grup difabel vs lansia dibandingkan sebagai pasangan audit): vendor berdalih “AUC keseluruhan 0,87, sudah bagus” saat audit menemukan TPR difabel 55% vs lansia 85%. Tolak argumen itu: AUC agregat menyembunyikan siapa yang terlewat. Selalu tampilkan metrik per grup di dashboard monitoring, bukan cuma agregat.",
        type: "risk",
      },
      reference: "Audit fairness = tabel 2×2 per grup + diagnosis + mitigasi + verifikasi.",
    },
    {
      id: "interseksionalitas",
      eyebrow: "Langkah 6 · Irisan",
      title: "Intersectionality: luka menumpuk di persimpangan",
      prose: [
        "Audit fairness yang berhenti di satu sumbu (kota vs desa) bisa memuji diri sendiri sambil melewatkan yang paling terluka. Intersectionality: kerugian menumpuk di persimpangan — perempuan × pedesaan × lansia bukan “tiga masalah kecil”, melainkan satu pengalaman yang berbeda secara kualitatif. Di lesson ini: TPR grup A 75%, grup B 50% — tapi irisan desa+lansia hanya 37,5%. Model yang “cukup adil” per sumbu bisa sangat tidak adil di irisan — dan irisan itulah yang paling jarang bersuara.",
        "Metrik lanjutan untuk praktisi: (a) minimax fairness — optimalkan grup TERBURUK, bukan rata-rata (cocok untuk alokasi layanan publik: negara dinilai dari yang paling tertinggal); (b) kalibrasi per grup — angka jujur di tiap grup (syarat kepercayaan klinisi); (c) predictive parity — PPV sama antar grup (penting bila hasil positif memicu tindakan mahal seperti rujukan tersier). Tidak ada metrik yang cukup sendirian — impossibility theorem di lesson ini membuktikannya. Praktiknya: laporkan 3–4 metrik sekaligus dalam “fairness dashboard”, dan tetapkan pemilik keputusan untuk trade-off-nya — bukan analis sendirian di ruang server.",
        "Pipeline audit praktis, berurutan: ① representasi — proporsi tiap grup di training vs populasi layanan (aturan praktis: selisih >10 poin = investigasi); ② label — definisikan ulang “butuh” dari kriteria klinis, bukan dari riwayat layanan (pelajaran Science 2019 di lesson ini); ③ metrik — hitung TPR/FPR/kalibrasi per grup DAN per irisan utama; ④ mitigasi — urutkan: perbaiki label > tambah data > reweighting > post-processing threshold per grup (catatan: threshold berbeda antar grup butuh dasar hukum yang jelas); ⑤ monitoring — disparitas bisa MUNCUL setelah deploy karena drift tidak merata antar grup.",
        "Konteks Indonesia: model rujukan yang dilatih di RS swasta Jakarta lalu dipakai di puskesmas timur Indonesia menghadapi dua lapis bias — geografis (case-mix beda) dan sosioekonomi (akses beda). Audit wajib mencakup dimensi wilayah dan pembiayaan (PBI vs non-PBI), bukan hanya dimensi yang “standar” di literatur luar. Fairness yang diimpor tanpa adaptasi lokal = fairness yang buta terhadap luka lokal.",
      ],
      tasks: [],
      formula: String.raw`\text{Gap}_{TPR} = |TPR_a - TPR_b|`,
      formulaNote: "Gap_TPR = selisih true positive rate antar grup — ukuran disparitas deteksi yang paling operasional. TPR_a, TPR_b = TPR grup a dan b (TP/(TP+FN) dihitung PER grup); |·| = nilai absolut. Interpretasi: gap 0,25 (75% vs 50%) berarti pasien yang benar-benar butuh di grup B 25 poin persen lebih jarang terdeteksi — bukan sekadar “angka”, melainkan nyawa yang terlewat. Aturan praktis: gap >0,10 wajib investigasi; gap >0,20 wajib mitigasi sebelum deploy.",
      note: {
        title: "Intuisi: pecah sampai irisan, metrik dari keputusan, catat persetujuan",
        body: "Setiap kali metrik fairness terlihat “cukup baik”, tanyakan: siapa yang tidak terlihat di angka ini? Rata-rata adalah tempat persembunyian ketidakadilan — gap 5% secara keseluruhan bisa berarti 0% untuk mayoritas dan 40% untuk minoritas kecil. Heuristik praktisi: selalu pecah metrik sampai ke irisan terkecil yang masih punya n memadai (aturan praktis: n≥30 per sel sebelum menarik kesimpulan); bila irisan kunci terlalu kecil untuk diukur, itu TEMUAN — bukan alasan untuk berhenti — dan jawabannya adalah kumpulkan data, bukan abaikan. Heuristik kedua: pilih metrik dari keputusan, bukan dari makalah. Bila hasil positif memicu rujukan mahal, yang penting adalah PPV per grup; bila hasil negatif berarti pulang tanpa perawatan, yang penting adalah FNR per grup. Metrik yang salah = audit yang menenangkan diri sendiri. Heuristik ketiga: dokumentasikan trade-off yang kamu pilih dan siapa yang menyetujuinya — “kami memilih equalized odds atas demographic parity, disetujui komite etik 12 Jan” — karena suatu hari seseorang akan bertanya, dan “algoritmenya begitu” bukan jawaban. Tiga kebiasaan — pecah sampai irisan, metrik dari keputusan, catat siapa menyetujui — mengubah fairness dari slogan menjadi praktik.",
      },
      quiz: [
        {
          q: "Model: TPR grup mayoritas 80%, grup minoritas 78%, irisan minoritas+lansia 45%. Dengan lensa intersectionality, kesimpulan?",
          options: [
            { text: "Tidak adil — irisan 45% adalah kegagalan yang disembunyikan rata-rata", why: "Benar: agregat terlihat baik (78–80%) tapi irisan paling rentan tertinggal 35 poin.", correct: true },
            { text: "Adil — selisih 2% antar grup utama kecil", why: "Itu kesimpulan tanpa lensa irisan — persis yang dikritik." },
            { text: "Adil bila n irisan <30", why: "n kecil = temuan “butuh data”, bukan vonis adil." },
            { text: "Tidak bisa dinilai", why: "Bisa: gap 35 poin pada irisan adalah sinyal yang jelas." },
          ],
        },
        {
          q: "Untuk alokasi kursi ICU yang langka di RS publik, prinsip fairness yang paling defensibel?",
          options: [
            { text: "Minimax — maksimalkan hasil grup terburuk", why: "Benar: layanan publik dinilai dari yang paling tertinggal; rata-rata menyembunyikan korban.", correct: true },
            { text: "Demographic parity — kursi dibagi rata", why: "Rata tanpa memperhatikan kebutuhan bisa merugikan yang paling sakit." },
            { text: "Akurasi keseluruhan tertinggi", why: "Akurasi global buta terhadap distribusi korban salah." },
            { text: "First-come first-served", why: "Menguntungkan yang aksesnya baik — melanggengkan ketidakadilan." },
          ],
        },
      ],
      reference: "Rata-rata menyembunyikan korban. Pecah sampai irisan, putuskan trade-off secara eksplisit.",
    },
    {
      id: "lab-audit-fairness",
      eyebrow: "Langkah 7 · Lab",
      title: "Hitung gap TPR tiga grup termasuk irisan",
      prose: [
        "Model “butuh rujukan spesialis” dievaluasi pada tiga grup. Grup A (kota, n=1.200): TP=180, FN=60. Grup B (desa, n=800): TP=80, FN=80. Grup C (desa + lansia, n=200): TP=30, FN=50. Tugasmu: hitung TPR tiap grup, lalu `tpr_c` dan `gap_max` (selisih TPR tertinggi − terendah). Lihat bagaimana irisan C mengubah cerita.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tpr_c` (TPR grup irisan C)" },
        { id: "t2", text: "Hitung `gap_max` (TPR tertinggi − terendah)" },
      ],
      expected: "tpr_c≈0.375 gap_max≈0.375",
      note: {
        title: "Kaitan ke risk",
        body: "Gap 37,5 poin berarti lansia desa yang benar-benar butuh rujukan terlewat 2,5× lebih sering daripada pasien kota. Deploy tanpa mitigasi = RS secara sistematis menelantarkan kelompok paling rentan — dengan stempel “berbasis AI”.",
        type: "risk",
      },
      hints: [
        "TPR = TP/(TP+FN), dihitung per grup.",
        "Grup A: 180/240; B: 80/160; C: 30/80.",
        "gap_max = max(TPR) − min(TPR).",
      ],
      code: {
        starter: `# TP, FN per grup: A kota, B desa, C desa+lansia
# TULIS KODEMU: tpr_c dan gap_max
tpr_c = 
gap_max = 
print(f"tpr_c={tpr_c:.3f} gap_max={gap_max:.3f}")`,
        lockLines: 1,
        solution: `# TP, FN per grup: A kota, B desa, C desa+lansia
# TULIS KODEMU: tpr_c dan gap_max
grup = {"A": (180, 60), "B": (80, 80), "C": (30, 50)}
tpr = {g: tp / (tp + fn) for g, (tp, fn) in grup.items()}
tpr_c = tpr["C"]
gap_max = max(tpr.values()) - min(tpr.values())
print(f"tpr_c={tpr_c:.3f} gap_max={gap_max:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tpr_c", value: 0.375, tol: 1e-9, label: "`tpr_c` seharusnya 0.375", msg: "30/80 — irisan desa+lansia terdeteksi paling buruk." },
          { kind: "equal", task: "t2", name: "gap_max", value: 0.375, tol: 1e-9, label: "`gap_max` seharusnya 0.375", msg: "0,75 − 0,375 — jauh di atas ambang aksi 0,10." },
          { kind: "stdout_matches", task: "t2", pattern: "tpr_c=0\\.375 gap_max=0\\.375", label: "`print` menampilkan hasil audit", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "gap_max = 0,375. Tindakan yang tepat sebelum deploy?",
          options: [
            { text: "Mitigasi wajib — mulai dari perbaiki label dan tambah data grup C", why: "Benar: >0,20 = mitigasi sebelum deploy; mulai dari akar (label, representasi).", correct: true },
            { text: "Deploy saja, nanti dimonitor", why: "Monitoring tidak menyembuhkan disparitas yang sudah diketahui sebelum launch." },
            { text: "Hapus grup C dari evaluasi", why: "Menghapus yang terluka dari laporan = menutupi, bukan memperbaiki." },
            { text: "Tutup dengan threshold berbeda diam-diam", why: "Threshold per grup butuh dasar hukum dan dokumentasi — tidak diam-diam." },
          ],
        },
        {
          q: "Irisan kunci (lansia desa) hanya punya n=12 — terlalu kecil untuk TPR yang stabil. Respons benar?",
          options: [
            { text: "Catat sebagai temuan “butuh data” dan prioritaskan pengumpulan data grup itu", why: "Benar: n kecil = temuan, bukan vonis. Jawabannya kumpulkan data, bukan abaikan.", correct: true },
            { text: "Abaikan irisan itu dari audit", why: "Mengabaikan yang tak terukur = membiarkan luka tak terlihat." },
            { text: "Nyatakan model adil karena tak terbukti tidak adil", why: "Beban pembuktian terbalik — ketidakmampuan mengukur bukan bukti adil." },
            { text: "Gabungkan paksa dengan grup lain", why: "Menggabung menghapus justru sinyal irisan yang dicari." },
          ],
        },
      ],
      reference: "Gap >0,10 investigasi; >0,20 mitigasi. Mulai dari label, bukan dari metrik.",
    },
    {
      id: "lab-mitigasi-fairness",
      eyebrow: "Langkah 8 · Lab",
      title: "Mitigasi: threshold per grup menutup gap — dengan harga",
      prose: [
        "Audit Langkah 7 menemukan gap TPR 37,5 poin (kota 75% vs irisan desa+lansia 37,5%). Sekarang jalankan mitigasi post-processing yang dijanjikan Langkah 4: threshold PER GRUP. Simulasi skor model: pasien yang benar-benar butuh (positif) di grup A dan C, plus pasien yang tidak butuh (negatif) di grup C. Threshold tunggal t=0 mereproduksi audit — TPR A ≈ 0,74, TPR C ≈ 0,39.",
        "Tugasmu: cari threshold t_c untuk grup C agar TPR_C ≈ 0,75 (kuantil 25% dari skor positif C — 75% skor di atasnya), lalu hitung harganya: FPR_C sebelum vs sesudah. Inilah trade-off yang dijanjikan lesson ini: gap menutup, tapi false positive naik.",
        "Batas kejujuran lab ini: threshold per grup adalah mitigasi POST-PROCESSING — ia tidak memperbaiki label atau representasi (Langkah 4: perbaiki label dulu). Dan di dunia nyata, threshold berbeda antar grup butuh dasar hukum yang jelas + dokumentasi persetujuan — bukan keputusan diam-diam.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `t_c` (threshold grup C agar TPR_C ≈ 0,75)" },
        { id: "t2", text: "Hitung `gap_sesudah` dan `fpr_sebelum`/`fpr_sesudah`, cetak" },
      ],
      expected: "t_c≈-0.99 tpr_c≈0.750 gap≈0.013 fpr_c=0.070->0.312",
      note: {
        title: "Kaitan ke risk",
        body: "Harga mitigasi ini nyata: FPR_C naik 7,0% → 31,2% — hampir sepertiga pasien C yang tidak butuh kini dirujuk (beban RS + kecemasan pasien). Bandingkan dengan mitigasi pre-processing (perbaiki label, tambah data): sering menutup gap TANPA harga sebesar ini. Threshold per grup adalah jalan terakhir yang terukur — bukan jalan pertama.",
        type: "risk",
      },
      hints: [
        "t_c = kuantil 25% skor positif C: sorted(pos_c)[len(pos_c)//4].",
        "TPR/FPR = proporsi skor di atas threshold: sum(1 for s in skor if s > t)/len(skor).",
        "gap_sesudah = |TPR_A(t=0) − TPR_C(t_c)|.",
      ],
      code: {
        starter: `import random
random.seed(13)
# Skor model (simulasi): positif = benar-benar butuh rujukan
pos_a = [random.gauss(0.67, 1) for _ in range(2000)]   # kota: TPR ~0,75 di t=0
pos_c = [random.gauss(-0.32, 1) for _ in range(2000)]  # desa+lansia: TPR ~0,39 di t=0
neg_c = [random.gauss(-1.5, 1) for _ in range(2000)]   # desa+lansia, tidak butuh

def rate(skor, t):
    return sum(1 for s in skor if s > t) / len(skor)

# TULIS KODEMU: threshold per grup + harga mitigasi
t_c = 
gap_sesudah = 
fpr_sebelum = 
fpr_sesudah = 

print(f"t_c={t_c:.2f} tpr_c={rate(pos_c, t_c):.3f} gap={gap_sesudah:.3f} fpr_c={fpr_sebelum:.3f}->{fpr_sesudah:.3f}")`,
        lockLines: 11,
        solution: `import random
random.seed(13)
# Skor model (simulasi): positif = benar-benar butuh rujukan
pos_a = [random.gauss(0.67, 1) for _ in range(2000)]   # kota: TPR ~0,75 di t=0
pos_c = [random.gauss(-0.32, 1) for _ in range(2000)]  # desa+lansia: TPR ~0,39 di t=0
neg_c = [random.gauss(-1.5, 1) for _ in range(2000)]   # desa+lansia, tidak butuh

def rate(skor, t):
    return sum(1 for s in skor if s > t) / len(skor)

# TULIS KODEMU: threshold per grup + harga mitigasi
t_c = sorted(pos_c)[len(pos_c) // 4]
gap_sesudah = abs(rate(pos_a, 0) - rate(pos_c, t_c))
fpr_sebelum = rate(neg_c, 0)
fpr_sesudah = rate(neg_c, t_c)

print(f"t_c={t_c:.2f} tpr_c={rate(pos_c, t_c):.3f} gap={gap_sesudah:.3f} fpr_c={fpr_sebelum:.3f}->{fpr_sesudah:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "t_c", value: -0.99, tol: 0.05, label: "`t_c` seharusnya ≈ -0,99", msg: "Kuantil 25% skor positif C: 75% skor di atasnya → TPR_C ≈ 0,75." },
          { kind: "equal", task: "t2", name: "gap_sesudah", value: 0.013, tol: 0.02, label: "`gap_sesudah` seharusnya ≈ 0,01", msg: "0,75 − 0,75 ≈ 0 — gap 37,5 poin menutup." },
          { kind: "equal", task: "t2", name: "fpr_sebelum", value: 0.07, tol: 0.02, label: "`fpr_sebelum` seharusnya ≈ 0,07", msg: "FPR_C di threshold tunggal t=0." },
          { kind: "equal", task: "t2", name: "fpr_sesudah", value: 0.312, tol: 0.02, label: "`fpr_sesudah` seharusnya ≈ 0,31", msg: "Harga mitigasi: FPR_C naik karena threshold diturunkan." },
          { kind: "stdout_matches", task: "t2", pattern: "t_c=-0\\.99 tpr_c=0\\.750 gap=0\\.013 fpr_c=0\\.070->0\\.312", label: "`print` menampilkan hasil mitigasi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Threshold per grup menutup gap TPR; harganya FPR naik. Perbaiki label/data dulu.",
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
        "Empat pintu bias: data, label, representasi, deployment — audit berurutan.",
        "Kasus klasik: proksi label (biaya ≠ kebutuhan) membawa sejarah ke model.",
        "Metrik parity, equalized odds, kalibrasi per grup tak bisa semua (impossibility).",
        "Mitigasi: pre (label/data) > in (constraint) > post (threshold).",
        "Threshold per grup = post-processing terakhir: setarakan TPR dengan harga FPR naik, butuh dasar hukum yang jelas.",
        "Lab mitigasi: threshold per grup menutup gap TPR 37,5 → ~1 poin dengan harga FPR_C 7% → 31%.",
      ],
      next: { label: "HD14 — NLP Klinis", href: "/learn/hd14-nlp-klinis" },
      quiz: [
        {
          q: "Menghapus variabel etnis dari fitur membuat model adil. Benar atau salah?",
          options: [
            { text: "Salah — proksi tetap membawa info itu, kini tanpa bisa diaudit", why: "Benar: kebutaan ≠ keadilan. Fairness butuh pengukuran per grup.", correct: true },
            { text: "Benar", why: "Salah: model mempelajari proksi (kode pos, nama, bahasa) yang berkorelasi dengan variabel sensitif." },
            { text: "Tergantung", why: "Terlalu aman: secara umum menghapus justru merusak auditabilitas." },
            { text: "Hanya untuk data kecil", why: "Ukuran data tidak relevan dengan masalah proksi ini." },
          ],
        },
        {
          q: "Untuk alokasi perawatan yang adil, metrik paling relevan?",
          options: [
            { text: "Equalized odds (TPR/FPR setara) — kesempatan terdeteksi sama", why: "Benar: yang penting adalah yang benar-benar butuh punya peluang sama tertangkap.", correct: true },
            { text: "Demographic parity", why: "Parity menuntut tingkat rujukan sama walau kebutuhan beda — bisa melanggar kalibrasi." },
            { text: "Akurasi agregat", why: "Akurasi agregat menyembunyikan disparitas antar grup." },
            { text: "Ukuran model", why: "Ukuran model tidak ada hubungannya dengan keadilan." },
          ],
        },
        {
          q: "Setelah mitigasi, TPR grup A = 74% dan grup B = 72% memakai threshold berbeda per grup. Syarat agar pendekatan ini defensibel?",
          options: [
            { text: "Ada dasar hukum yang jelas dan trade-off didokumentasikan — bukan keputusan diam-diam", why: "Benar: threshold per grup butuh dasar hukum dan persetujuan tertulis; kenaikan FPR di grup B harus dinyatakan eksplisit.", correct: true },
            { text: "Threshold disamakan untuk semua grup agar terlihat adil", why: "Salah: menyamakan threshold justru mengembalikan kesenjangan TPR — melanggar equal opportunity." },
            { text: "Cukup laporkan akurasi keseluruhan yang naik", why: "Salah: akurasi agregat menyembunyikan disparitas antar grup." },
            { text: "Hapus grup B dari laporan evaluasi", why: "Salah: menghapus yang terluka dari laporan = menutupi, bukan memperbaiki." },
          ],
        },
        {
          q: "Di Indonesia, dimensi fairness yang sering paling tajam?",
          options: [
            { text: "Wilayah & kelas faskes (model Jakarta vs Papua, swasta vs puskesmas)", why: "Benar: audit harus relevan lokal. Template AS tidak otomatis cocok.", correct: true },
            { text: "Hanya etnis", why: "Terlalu sempit untuk konteks Indonesia — wilayah dan kelas faskes lebih tajam." },
            { text: "Hanya gender", why: "Gender relevan, tapi bukan satu-satunya dimensi tajam di sini." },
            { text: "Tidak ada disparitas", why: "Kesenjangan struktural (60% spesialis di Jawa) adalah bahan bakar bias yang nyata." },
          ],
        },
        {
          q: "Urutan kerja fairness yang benar?",
          options: [
            { text: "Perbaiki data & label dulu, lalu pilih metrik, mitigasi, dokumentasikan trade-off", why: "Benar: sebagian besar “trade-off” sebenarnya kemalasan diagnosis — perbaiki akar gratis dulu.", correct: true },
            { text: "Langsung tuning hyperparameter", why: "Hyperparameter tidak memperbaiki label yang bias." },
            { text: "Deploy dulu, pantau setelah komplain", why: "Itu menjadikan pasien kelinci percobaan ketidakadilan." },
            { text: "Hapus semua atribut sensitif lalu selesai", why: "Fairness through blindness merusak auditabilitas tanpa menjamin keadilan." },
          ],
        },
      ],
    },
  ],
};
