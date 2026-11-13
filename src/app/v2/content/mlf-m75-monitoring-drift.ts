import type { V2Lesson } from "../lib/types";

export const mlfM75: V2Lesson = {
  slug: "mlf-m75-monitoring-drift",
  track: "Machine Learning Finance",
  module: "Fairness, explainability & monitoring",
  title: "MLF-M7.5 — Monitoring & Drift: Model yang Kemarin Akurat, Hari Ini Menolak Semua Orang",
  estMinutes: 90,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Model yang kemarin akurat, hari ini menolak semua orang baik",
      prose: [
        "Bayangkan kamu analis kredit. Model GBM-mu sudah live tiga bulan. Di test, ROC-AUC GBM mentah 0,7823 dan PR-AUC 0,5597 [notebook] — setelah kalibrasi Platt, model keputusan 0,7816 / 0,5558 — lumayan. Threshold operasional 0,10 menyetujui 28,5% nasabah dengan bad rate 6,67% [notebook]. Lalu suatu pagi, tim bisnis menelepon: «Approval rate anjlok ke 7% — hampir semua pengajuan ditolak. Apa yang rusak?» Modelnya tidak disentuh siapa pun. Datanya yang berubah: para nasabah mulai terlambat membayar satu bulan lebih lama dari biasanya — dan skor model ikut bergeser.",
        "Itulah drift. Model yang sama, kode yang sama, threshold yang sama — tapi populasi yang datang sudah bukan populasi yang dulu dipakai melatihnya. Lesson ini tentang cara MENDETEKSI perubahan itu sebelum bisnis yang meneleponmu: PSI (Population Stability Index) untuk stabilitas populasi, decay performa per periode, alerting dengan ambang yang ditulis dulu, dan pemicu retraining yang kuantitatif — plus kapan JANGAN retrain.",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Baseline monitoring [notebook]: test ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, approval rate 28,5%, bad rate 6,67%, skor rata-rata 0,2217. Satu peringatan jujur di depan: data UCI ini SATU snapshot — tidak ada tanggal, tidak ada deret waktu. Semua analisis «per periode» di lesson ini memakai WAKTU SEMU — urutan ID baris, BUKAN tanggal nyata — dan semua skenario geser memakai SIMULASI yang dilabeli [simulasi] dengan parameternya ditulis eksplisit. Jangan pernah mengklaim ada data deret waktu bila tidak ada.",
        "Peta lesson: cerita approval yang anjlok → tiga jenis drift → rumus PSI dan band-nya → PSI per fitur train vs test → PSI skor prediksi → attribution drift: ketika alasannya berubah → stabilitas populasi dari waktu ke waktu [waktu semu] → matured cohort: label yang belum matang → decay performa dan bedanya dengan noise → dua simulasi geser [simulasi] → alerting: siapa bertindak → fairness monitoring: overall stabil vs ketidakadilan yang bergerak → pemicu retraining dan kapan JANGAN retrain → 4 lab → checkpoint.",
        "Nilai: monitoring adalah selisih antara «model yang pernah bagus» dan «model yang masih bagus». Tanpa monitoring, kamu baru tahu modelmu rusak dari keluhan bisnis — berminggu-minggu setelah kerugian terjadi. Dengan monitoring, PSI skor 0,5811 dan approval yang anjlok memberi tahu lebih dulu, lengkap dengan angka dan penanggung jawabnya.",
        "Baik atau buruk: ROC-AUC GBM mentah 0,7823 di test itu bagus sebagai foto SATU titik waktu (model keputusan terkalibrasi: 0,7816). Buruk bila dibaca sebagai «model ini akan selamanya 0,7823»: angka test adalah foto, bukan jaminan. Populasi bergerak, dan foto lama tidak melindungi dari drift baru.",
        "Mitigasi: pasang dashboard monitoring SEBELUM model live — PSI skor, ROC-AUC/PR-AUC per periode, approval rate, bad rate — dengan ambang alert yang ditulis dulu (langkah 11). Model tanpa monitoring adalah model yang kamu serahkan pada nasib.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: sekali lolos test, model aman selamanya",
        type: "pitfall",
        body: "Yang benar: test 6.000 mengukur model pada populasi KEMARIN. Bila populasi bergeser — limit naik, keterlambatan naik, resesi datang — skor, approval, dan laba ikut bergeser, sementara ROC-AUC test-mu (GBM mentah) tetap 0,7823 di laporan lama. Di simulasi S2 lesson ini [simulasi], ROC-AUC (GBM terkalibrasi) hanya turun 0,0256 (0,7816 ke 0,7560) sementara approval rate anjlok 28,5% ke 7,05% — laporan test lama tidak akan pernah memberitahumu.",
      },
    },
    {
      id: "apa-drift",
      eyebrow: "Langkah 2 · Tiga jenis drift",
      title: "Data drift, concept drift, dan prior shift — tiga cara populasi mengkhianatimu",
      prose: [
        "Drift bukan satu hal — ada tiga, dan masing-masing merusak dengan cara berbeda. Data drift (covariate shift): DISTRIBUSI FITUR berubah, hubungan fitur-ke-label tetap. Contoh: limit kartu rata-rata naik 30% karena bank menaikkan limit massal — UTILIZATION turun, skor turun, approval naik. Label drift tidak terjadi; yang berubah hanya siapa yang datang. Prior shift (label shift): BASE RATE berubah, hubungan fitur-ke-label tetap. Contoh: resesi menaikkan base rate default dari 0,2212 ke 0,30 — model yang sama akan under-predict peluang default (kalibrasi bergeser meski ranking-nya utuh) dan bad rate yang disetujui naik; arah approval bergantung pada pergeseran distribusi X, jadi jangan diasumsikan otomatis turun. Concept drift: HUBUNGAN fitur-ke-label berubah. Contoh: pola «terlambat 1 bulan» yang dulu hampir pasti berujung default, kini tidak lagi karena ada program restrukturisasi — fitur yang sama kini berarti lain. Inilah yang paling berbahaya: modelmu mempelajari dunia yang sudah tidak ada.",
        "Ketiga jenis ini butuh alat deteksi yang berbeda. Data drift terdeteksi PSI per fitur dan PSI skor (langkah 3–5). Prior shift terdeteksi base rate dan skor rata-rata per periode (langkah 7). Concept drift TIDAK terdeteksi PSI sama sekali — distribusi fitur bisa stabil sempurna sementara hubungannya dengan label berubah — ia hanya terdeteksi lewat decay performa: ROC-AUC/PR-AUC per periode yang turun padahal PSI stabil (langkah 9). Itulah alasan monitoring butuh KEDUA keluarga metrik: PSI tanpa metrik performa buta terhadap concept drift; metrik performa tanpa PSI buta terhadap penyebabnya.",
        "Nilai: membedakan ketiga jenis drift mengubah responsmu. Data drift karena limit naik 30% [simulasi S1] mungkin tidak butuh retrain sama sekali — cukup sesuaikan threshold atau terima approval yang naik. Concept drift hampir selalu butuh retrain atau fitur baru. Salah diagnosis = salah obat: me-retrain model yang sebenarnya hanya butuh threshold baru adalah buang-buang waktu dan berisiko merusak model yang masih bagus.",
        "Baik atau buruk: taksonomi tiga drift ini bagus karena ia memberi nama pada tiga kegagalan yang berbeda — dan nama yang tepat adalah separuh diagnosis. Buruk bila dipakai sebagai label tempelan tanpa bukti: «ini concept drift» harus dibuktikan dengan PSI stabil + performa turun, bukan sekadar ditebak karena performa turun.",
        "Mitigasi: untuk setiap alert, catat dulu JENIS drift yang dicurigai beserta buktinya — PSI fitur, PSI skor, base rate, ROC-AUC per periode — sebelum memutuskan aksi. Template pencatatan ada di langkah 11.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: PSI besar berarti model rusak",
        type: "pitfall",
        body: "Yang benar: PSI besar berarti POPULASI bergeser — belum tentu model rusak. Di simulasi S1 [simulasi], limit naik 30% menggeser skor (PSI 0,0358) dan approval naik 7,82 poin persen, tapi ROC-AUC nyaris tidak bergerak (0,7816 ke 0,7796, turun 0,0020). Populasi bergeser, ranking tetap — yang berubah adalah keputusan bisnis, bukan kualitas model.",
      },
    },
    {
      id: "psi-rumus",
      eyebrow: "Langkah 3 · PSI: definisi",
      title: "PSI: satu angka untuk «seberapa jauh populasi bergeser»",
      prose: [
        "Population Stability Index (PSI) membandingkan distribusi sebuah variabel di dua populasi — biasanya train (yang diharapkan, expected) vs live atau test (yang aktual, actual). Caranya: bagi variabel ke dalam bin (di lesson ini 10 bin desil dari kuantil TRAIN — bin-nya ditetapkan sekali dari train, lalu dipakai untuk kedua populasi), hitung pangsa tiap bin di kedua populasi, lalu jumlahkan (aktual − expected) × ln(aktual / expected) per bin. Bin yang pangsanya tidak berubah menyumbang nol; bin yang pangsanya bergeser menyumbang positif — makin besar selisihnya, makin besar sumbangannya. PSI tidak pernah negatif; PSI 0 berarti distribusi IDENTIK.",
        "Band yang dipakai lesson ini — band standar industri, ditulis dulu sebelum melihat angka: PSI di bawah 0,1 = STABIL (tidak ada perubahan berarti); 0,1 sampai 0,25 = WASPADA (perubahan kecil, pantau); di atas 0,25 = GESER BESAR (perubahan signifikan, selidiki). Perhatikan: band ini berlaku untuk PSI TOTAL, bukan per bin. Satu bin yang menyumbang besar belum tentu membuat totalnya melewati ambang — dan sebaliknya, total yang melewati ambang bisa datang dari banyak bin yang masing-masing bergeser sedikit.",
        "Nilai: PSI bagus karena ia SATU angka per variabel yang bisa dipantau otomatis setiap hari — tanpa label. Itu krusial: label default baru diketahui berminggu-minggu kemudian (nasabah harus benar-benar gagal bayar dulu), sementara PSI bisa dihitung begitu skor keluar. PSI adalah sistem peringatan dini; metrik performa adalah konfirmasi yang datang terlambat.",
        "Baik atau buruk: PSI bagus sebagai alarm — murah, tanpa label, dan langsung menunjuk variabel mana yang bergeser. Buruk bila dibaca tanpa n: pada sampel kecil, pangsa bin berayun liar karena noise dan PSI membesar tanpa ada drift nyata. Di lesson ini tiap perbandingan memakai n besar (train 24.000 vs test 6.000; chunk 1.200 vs 1.200) — PSI di bawah 0,003 pada perbandingan train-vs-test adalah noise sampling, bukan drift. Buruk juga bila bin-nya dibuat dari LIVE (bukan train): bin yang menyesuaikan diri dengan populasi baru akan menyembunyikan gesernya sendiri. Bin SELALU dari train.",
        "Mitigasi: tetapkan bin dari train, kunci, dan jangan pernah mengubahnya saat membandingkan. Bila n per periode kecil (di bawah 1.000), naikkan ambang waspadamu atau gabungkan periode — PSI dari sampel kecil adalah rumor.",
      ],
      formula: String.raw`\mathrm{PSI} = \sum_{b=1}^{B} (a_b - e_b)\, \ln\!\left(\frac{a_b}{e_b}\right), \qquad \begin{array}{ll} \mathrm{PSI} < 0{,}1 & \text{stabil} \\ 0{,}1 \le \mathrm{PSI} \le 0{,}25 & \text{waspada} \\ \mathrm{PSI} > 0{,}25 & \text{geser besar} \end{array}`,
      formulaNote: "PSI: a_b = pangsa bin b di populasi aktual (live/test), e_b = pangsa bin b di populasi expected (train). Bin ditetapkan dari kuantil train. PSI 0 berarti distribusi identik; makin besar, makin jauh gesernya.",
      tasks: [],
    },
    {
      id: "psi-fitur",
      eyebrow: "Langkah 4 · PSI per fitur",
      title: "PSI per fitur train vs test: semuanya stabil — dan itu justru pelajarannya",
      prose: [
        "Sekarang hitung PSI untuk 16 fitur kunci, train (24.000) vs test (6.000), bin desil dari kuantil train [notebook]. Hasilnya: SEMUA 16 fitur STABIL — tidak satu pun melewati 0,1, bahkan tidak satu pun melewati 0,01. Tertinggi AGE 0,0029, lalu PAY_AMT1 0,0022, BILL_AMT1 0,0021, PAY_AMT_MEAN 0,0020, LIMIT_BAL 0,0016, BILL_TREND 0,0014, UTILIZATION 0,0013, PAY_MAX 0,0012, EDUCATION 0,0011, PAY_0 0,0011, PAY_DELAY_COUNT 0,0010, PAY_MEAN 0,0008, BILL_MEAN 0,0007, MARRIAGE 0,0007, PAY_RATIO 0,0004, SEX 0,0001. Rata-rata LIMIT_BAL train NT$167.365 vs test NT$167.963; UTILIZATION train 0,4234 vs test 0,4257 — nyaris identik.",
        "Nilai: hasil «membosankan» ini adalah pelajaran PENTING, bukan kegagalan. Train vs test di sini berasal dari SATU split acak (stratified, seed 42) — keduanya ditarik dari populasi yang sama, jadi PSI-nya HARUS mendekati nol. PSI train-vs-test yang besar justru akan menjadi tanda ada yang salah dengan split-mu (misal kebocoran urutan atau sampling yang bias). Pembanding yang dikunci koordinator: M2 G9 PSI 0,0104 — juga di band STABIL (di bawah 0,1), sejalan dengan hasil di sini: pada data yang sehat, PSI antar-bagian dari populasi yang sama memang kecil.",
        "Baik atau buruk: PSI per fitur yang semuanya stabil itu bagus sebagai BASELINE — ia membuktikan split-mu sehat dan memberi titik nol untuk perbandingan live nanti. Buruk bila dibaca sebagai «populasi live stabil»: test BUKAN live. Test adalah sampel acak dari populasi yang sama dengan train; live adalah populasi MASA DEPAN yang belum kamu lihat. PSI train-vs-test menguji split-mu; PSI live-vs-train menguji duniamu. Keduanya memakai rumus yang sama dan band yang sama — tapi menjawab pertanyaan yang berbeda.",
        "Mitigasi: simpan PSI train-vs-test ini sebagai BASELINE (tertinggi AGE 0,0029) dan bandingkan PSI live-vs-train terhadapnya. Bila PSI live-vs-train untuk AGE tiba-tiba 0,15, kamu tahu itu bukan noise split — karena noise split hanya 0,0029. Tanpa baseline, kamu tidak bisa membedakan «besar» dari «besar untuk variabel ini».",
      ],
      tasks: [],
      note: {
        title: "Jebakan: PSI train-vs-test kecil lalu disimpulkan live aman",
        type: "risk",
        body: "Yang benar: PSI kecil di sini hanya membuktikan split acakmu sehat. Live bisa bergeser kapan saja — resesi, perubahan kebijakan limit, program restrukturisasi — dan PSI live-vs-train-lah yang akan menangkapnya. Jangan pernah memakai PSI train-vs-test sebagai bukti «model aman di produksi»; ia bukti «split sehat», bukan bukti «dunia stabil».",
      },
    },
    {
      id: "psi-skor",
      eyebrow: "Langkah 5 · PSI skor prediksi",
      title: "PSI skor: satu angka yang merangkum semua fitur sekaligus",
      prose: [
        "PSI per fitur memberi 16 angka — terlalu banyak untuk dipantau tiap pagi. PSI SKOR memberi SATU angka: bandingkan distribusi probabilitas prediksi model di train vs test (atau live), dengan bin desil dari kuantil skor train. Hasil [notebook]: PSI skor GBM terkalibrasi (Platt/sigmoid) train vs test = 0,0017 (stabil); PSI skor GBM mentah = 0,0024 (stabil). Skor rata-rata train 0,2214 vs test 0,2217 — selisih 0,0003. Distribusi skor nyaris identik — seperti yang diharapkan dari split acak.",
        "Nilai: PSI skor adalah METRIK MONITORING UTAMA lesson ini, karena tiga alasan. Pertama, ia SATU angka — cukup untuk satu baris dashboard dan satu ambang alert. Kedua, ia merangkum SEMUA fitur: bila satu fitur bergeser cukup besar untuk menggerakkan skor, PSI skor menangkapnya walau kamu tidak memantau fitur itu. Ketiga, ia bisa dihitung TANPA label — begitu skor keluar, PSI skor bisa dihitung. Band yang sama berlaku: di bawah 0,1 stabil; 0,1–0,25 waspada; di atas 0,25 geser besar.",
        "Baik atau buruk: PSI skor bagus sebagai alarm pertama — murah dan menyeluruh. Buruk bila dipakai sendirian: ia memberitahumu ADA yang bergeser, tapi tidak memberitahumu APA yang bergeser. Bila PSI skor 0,5811 seperti di simulasi S2 (langkah 10), kamu masih butuh PSI per fitur untuk menjawab «fitur mana yang menggerakkan skor» — barulah kamu tahu apakah penyebabnya keterlambatan (PAY) atau limit (LIMIT_BAL). Buruk juga bila skornya sendiri tidak stabil karena kalibrasi: PSI skor yang memakai probabilitas mentah yang mis-kalibrasi akan berayun karena kalibrasi, bukan karena populasi. Di sini skornya terkalibrasi (ECE test 0,0087), jadi PSI skornya bisa dipercaya.",
        "Mitigasi: pantau PSI skor HARIAN sebagai alarm pertama; bila melewati 0,1, turun ke PSI per fitur untuk diagnosis — fitur dengan PSI terbesar adalah tersangka utama. Urutannya selalu: skor dulu (alarm), fitur kemudian (diagnosis).",
      ],
      tasks: [],
    },
    {
      id: "attribution-drift",
      eyebrow: "Langkah 6 · Attribution drift",
      title: "Attribution drift: ketika alasannya berubah — walau skornya tidak",
      prose: [
        "PSI skor memberitahumu populasi bergeser; PSI per fitur memberitahumu fitur mana yang bergeser. Tapi ada pergeseran ketiga yang tidak ditangkap keduanya: ALASAN model bergeser. Attribution drift adalah perubahan pada penjelasan model dari waktu ke waktu — fitur yang dulu menjadi pendorong utama kini bukan lagi, atau sebaliknya — sementara skor dan metrik performa bisa tampak stabil. Model yang sama, data yang mirip, keputusan yang mirip — tapi alasan yang berbeda. Bila alasan berubah, yang berubah adalah CARA model memutuskan — dan itu layak diselidiki, walau metriknya belum berteriak.",
        "Nilai: monitor DUA hal, keduanya [simulasi] atas SHAP kanonis M7.3 (GBM mentah, mean |SHAP| global atas test 6.000). Pertama, proporsi top reason codes per periode: di baseline, lima besar mean |SHAP| adalah PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892. Di periode [simulasi] yang baru, PAY_MAX turun ke 0,2500 (−0,2446) sementara UTILIZATION naik ke 0,3100 (+0,1526) — top-1 BERGANTI dari PAY_MAX ke UTILIZATION. Kedua, jarak distribusi (PSI) atas mean |SHAP| per fitur atau per keluarga: keluarga PAY (PAY_MAX, PAY_0, PAY_MEAN) vs keluarga LIMIT/BILL — bila PSI keluarga PAY melewati 0,10 sementara PSI skor diam, modelmu sedang memutuskan dengan alasan yang berbeda dari alasan yang kamu validasi. Dan monitor per grup: reason codes per grup (SEX/EDUCATION) — bila top-3 reason codes laki-laki dan perempuan berbeda secara sistematis, itu sinyal untuk audit fairness M7.2, bukan sekadar «modelnya berubah».",
        "Baik atau buruk: monitoring atribusi bagus karena ia menangkap perubahan yang tidak terlihat di metrik performa — model bisa tetap akurat sambil mengubah alasannya (misalnya limit naik di populasi, S1 di langkah 10, membuat UTILIZATION lebih menentukan). Buruk bila dibaca sebagai BUKTI KAUSAL: «UTILIZATION kini menyebabkan default» adalah klaim tentang dunia — yang ditunjukkan hanyalah «model ini kini lebih mengandalkan UTILIZATION». Attribution drift adalah DIAGNOSIS — ia berkata «selidiki», bukan «ini penyebabnya». Dan buruk bila dipakai tanpa pembanding: mean |SHAP| berayun antar-periode kecil (n = 1.200) seperti metrik lainnya — satu periode yang berbeda bukan vonis; dua periode berturut-turut dengan arah yang sama barulah sinyal (aturan yang sama seperti langkah 11).",
        "Mitigasi: tambahkan TIGA baris ke dashboard monitoring-mu — (1) top-3 reason codes per periode (global dan per grup); (2) PSI mean |SHAP| per keluarga fitur (PAY, BILL, LIMIT, PAY_AMT); (3) selisih mean |SHAP| top-1 antar-periode. Aturan alert-nya sama seperti alerting (langkah 11): satu periode = WASPADA, dua periode berturut-turut = selidiki; dan bila top-1 berganti, tuliskan alasannya di log keputusan — bukan karena aturannya memintanya, melainkan karena audit setahun kemudian akan menanyakan «kapan alasan model ini berubah, dan apakah ada yang memperhatikan?».",
      ],
      tasks: [],
    },
    {
      id: "waktu-semu",
      eyebrow: "Langkah 7 · Stabilitas populasi dari waktu ke waktu",
      title: "Waktu semu: lima periode, satu kejutan — dan kenapa kejutan itu noise",
      prose: [
        "Data UCI tidak punya tanggal. Untuk mempelajari «dari waktu ke waktu» tanpa berbohong, lesson ini memakai WAKTU SEMU: test 6.000 diurutkan menurut ID baris, lalu dipotong menjadi 5 chunk berurutan @ 1.200 nasabah [waktu semu — urutan ID, BUKAN tanggal nyata]. ID di sini hanyalah nomor urut baris di file, bukan waktu pengajuan — jadi pola antar-chunk adalah VARIASI SAMPLING, bukan tren waktu. Justru itu yang membuatnya berguna sebagai latihan: ia menunjukkan betapa berisiknya metrik per periode, bahkan saat tidak ada drift sama sekali.",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, per chunk [waktu semu]: Chunk 1 (ID 1–6.069): base rate 0,2200, ROC-AUC 0,7449, PR-AUC 0,4982, approval 26,92%, bad rate 8,05%. Chunk 2 (ID 6.072–12.246): base rate 0,2375, ROC-AUC 0,7428, PR-AUC 0,5137, approval 27,17%, bad rate 10,74%. Chunk 3 (ID 12.250–18.115): base rate 0,2450, ROC-AUC 0,8138, PR-AUC 0,6314, approval 25,17%, bad rate 5,63%. Chunk 4 (ID 18.117–24.223): base rate 0,2092, ROC-AUC 0,8041, PR-AUC 0,5985, approval 33,67%, bad rate 5,20%. Chunk 5 (ID 24.235–29.996): base rate 0,1942, ROC-AUC 0,8006, PR-AUC 0,5458, approval 29,58%, bad rate 4,23%. Rentang ROC-AUC 0,7428–0,8138 (lebar 0,0710); rentang PR-AUC 0,4982–0,6314 (lebar 0,1332); base rate 0,1942–0,2450 (lebar 5,08 poin persen). PSI chunk 1 vs chunk 5 [waktu semu]: skor 0,0161, PAY_MEAN 0,0193, UTILIZATION 0,0191, BILL_AMT1 0,0153, LIMIT_BAL 0,0129 — semuanya STABIL.",
        "Perhatikan chunk 1 dan 2: ROC-AUC 0,7449 dan 0,7428 — turun 0,0367 dan 0,0388 dari baseline test 0,7816. Bila kamu hanya melihat dua chunk itu, kamu akan menyimpulkan «model decay». Lalu chunk 3 datang: ROC-AUC 0,8138 — NAIK 0,0322 di atas baseline. Model yang sama, tidak disentuh, berayun 0,0710 antar-periode karena n per chunk hanya 1.200 (sekitar 230–295 default per chunk). Bad rate chunk 2 (10,74%) melewati ambang 10% — lalu chunk 3 (5,63%) dan chunk 5 (4,23%) jauh di bawahnya. Inilah noise periode-kecil: metrik yang sama bisa melewati ambangmu di satu periode dan jauh dari ambang di periode berikutnya, tanpa ada drift apa pun.",
        "Baik atau buruk: analisis per periode bagus karena ia satu-satunya cara melihat decay — metrik agregat 6.000 menyembunyikan ayunan ini. Buruk bila satu periode dibaca sebagai vonis: n = 1.200 terlalu kecil untuk vonis retrain. Aturan lesson ini (langkah 11–13): satu periode buruk = waspada + pantau periode berikutnya; DUA periode buruk berturut-turut = aksi. Chunk 2 sendirian tidak pernah boleh memicu retrain — dan chunk 3 membuktikan kenapa.",
        "Mitigasi: laporkan metrik per periode SELALU bersama n dan intervalnya (di sini n = 1.200 per chunk), dan jangan ambil keputusan retrain dari satu periode. Bila periode live-mu kecil, gabungkan dua periode sebelum menilai — atau terima ambang yang lebih longgar.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="ROC-AUC per chunk waktu semu: chunk 1 0,7449; chunk 2 0,7428; chunk 3 0,8138; chunk 4 0,8041; chunk 5 0,8006; garis baseline test 0,7816">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC-AUC per chunk — waktu semu, test 6.000 (n = 1.200 per chunk)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="110.3" x2="466" y2="110.3" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,85</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,80</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,70</text>
<rect x="66" y="153.3" width="44" height="52.7" fill="var(--c1)"/>
<text x="88" y="148.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7449</text>
<text x="88" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Chunk 1</text>
<rect x="132" y="155.8" width="44" height="50.2" fill="var(--c1)"/>
<text x="154" y="150.8" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7428</text>
<text x="154" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Chunk 2</text>
<rect x="198" y="72.5" width="44" height="133.5" fill="var(--c4)"/>
<text x="220" y="67.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8138</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Chunk 3</text>
<rect x="264" y="83.9" width="44" height="122.1" fill="var(--c4)"/>
<text x="286" y="78.9" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8041</text>
<text x="286" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Chunk 4</text>
<rect x="330" y="88.0" width="44" height="118.0" fill="var(--c4)"/>
<text x="352" y="83.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8006</text>
<text x="352" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Chunk 5</text>
<text x="410" y="104" font-size="10" fill="var(--text)" font-family="var(--font-ui)">baseline test 0,7816</text>
</svg>`,
        alt: "ROC-AUC per chunk waktu semu: chunk 1 0,7449; chunk 2 0,7428; chunk 3 0,8138; chunk 4 0,8041; chunk 5 0,8006; garis putus-putus baseline test 0,7816.",
        caption: "Cara membaca: lima chunk @ 1.200 nasabah dari test yang diurutkan menurut ID [waktu semu — urutan ID, BUKAN tanggal nyata]. ROC-AUC berayun 0,7428–0,8138 (lebar 0,0710) tanpa ada drift — itu noise periode-kecil. Chunk 1–2 di bawah baseline, chunk 3–5 di atasnya; satu periode buruk bukan vonis (langkah 9).",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: metrik per periode yang turun berarti model decay",
        type: "pitfall",
        body: "Yang benar: metrik per periode dengan n = 1.200 berayun lebar karena sampling — ROC-AUC 0,7428 di chunk 2 dan 0,8138 di chunk 3 adalah MODEL YANG SAMA tanpa drift (PSI chunk 1 vs chunk 5 semuanya stabil, tertinggi PAY_MEAN 0,0193). Decay baru terbukti bila penurunan BERTAHAN dua periode berturut-turut DAN PSI atau base rate ikut bergerak.",
      },
    },
    {
      id: "matured-cohort",
      eyebrow: "Langkah 8 · Matured cohort",
      title: "Matured cohort: label yang belum matang tidak boleh dipakai untuk menilai",
      prose: [
        "Semua metrik performa — ROC-AUC, PR-AUC, bad rate, dan semua metrik fairness — butuh LABEL. Dan label butuh WAKTU. Di dataset ini, labelnya adalah «default bulan depan» — jendela observasi 1 bulan. Nasabah yang aplikasinya 2 minggu lalu BELUM PUNYA label: bulan observasinya belum lewat. Periode terbaru selalu terdiri dari label yang belum matang — dan metrik yang dihitung di atasnya adalah metrik atas data yang belum lengkap. Inilah jebakan yang tidak ditangkap PSI: PSI, approval rate, dan distribusi skor bisa dihitung TANPA label — tapi ROC-AUC, bad rate, dan AIR tidak bisa.",
        "Nilai: garis waktunya empat titik — aplikasi (bulan 0) → skor/keputusan (saat itu juga) → jendela observasi (1 bulan) → label tersedia (matang). Cohort MATANG adalah aplikasi yang jendela observasinya sudah lewat: hanya cohort inilah yang boleh dipakai untuk ROC-AUC, PR-AUC, bad rate, dan metrik fairness. Cohort BELUM MATANG (jendela belum lewat) hanya boleh dimonitor TANPA label: PSI, approval rate, distribusi skor, dan proporsi label matang itu sendiri. Metrik yang harus kamu laporkan per periode: «proporsi label matang» — berapa persen aplikasi periode itu yang jendelanya sudah lewat. Bila proporsinya 0% (periode berjalan), tidak ada metrik berlabel yang boleh dilaporkan — tulis «belum matang», bukan 0. Bila proporsinya 60%, metriknya adalah metrik atas 60% itu — dan 60% itu BUKAN sampel acak: nasabah yang default cenderung ketahuan lebih dulu daripada yang tidak, jadi bad rate atas cohort yang belum matang cenderung BUKAN estimasi yang jujur.",
        "Baik atau buruk: pemisahan ini bagus karena ia membuat satu pertanyaan yang tajam — «periode ini boleh dipakai untuk metrik apa?» — dan jawabannya selalu bisa ditulis dalam satu baris. Buruk bila dibaca sebagai «jadi periode terbaru tidak berguna»: periode terbaru justru yang paling penting untuk monitoring TANPA label — PSI dan approval rate-nya adalah alarm pertamamu. Dan buruk bila «proporsi label matang» tidak pernah dilaporkan: dashboard yang menampilkan bad rate 4,1% untuk periode 2 minggu lalu TANPA menyebut bahwa hanya 30% labelnya yang matang adalah dashboard yang berbohong dengan angka yang benar.",
        "Mitigasi: di dashboard-mu, pisahkan DUA kolom untuk setiap periode — «monitoring tanpa label» (PSI, approval, distribusi skor — selalu tersedia) dan «monitoring dengan label» (ROC-AUC, bad rate, fairness — hanya untuk cohort matang). Dan tulis aturan ini di samping tabel alert-mu: periode yang belum matang TIDAK PERNAH menaikkan level alert berbasis label — ia hanya boleh menyalakan alert berbasis PSI/approval. Bila seseorang membawakanmu «bad rate periode terbaru 4,1%, turun dari 6,67% — model membaik!», tanyakan dulu: «berapa persen labelnya yang sudah matang?» — bila jawabannya bukan 100%, kabar baik itu belum terbukti.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 210" role="img" aria-label="Garis waktu label: aplikasi bulan nol, skor dan keputusan saat itu juga, jendela observasi satu bulan, lalu label tersedia dan cohort matang">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Label butuh waktu: jendela observasi 1 bulan</text>
<line x1="30" y1="90" x2="450" y2="90" stroke="var(--chart-text)" stroke-width="2"/>
<circle cx="60" cy="90" r="7" fill="var(--c1)"/>
<circle cx="170" cy="90" r="7" fill="var(--c4)"/>
<circle cx="290" cy="90" r="7" fill="var(--c2)"/>
<circle cx="420" cy="90" r="7" fill="var(--c3)"/>
<text x="60" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Aplikasi</text>
<text x="60" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">bulan 0</text>
<text x="170" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skor / keputusan</text>
<text x="170" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">saat itu juga</text>
<text x="290" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Jendela observasi</text>
<text x="290" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1 bulan</text>
<text x="420" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Label tersedia</text>
<text x="420" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">(matang)</text>
<line x1="420" y1="100" x2="420" y2="130" stroke="var(--c3)" stroke-width="2" stroke-dasharray="4 3"/>
<text x="240" y="122" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Cohort BELUM matang: monitoring TANPA label saja (PSI, approval, distribusi skor)</text>
<text x="240" y="140" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Cohort MATANG: ROC-AUC, PR-AUC, bad rate, dan metrik fairness BOLEH dihitung</text>
<text x="240" y="172" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Periode terbaru (jendela belum lewat) tidak pernah menaikkan alert berbasis label.</text>
<text x="240" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Laporkan «proporsi label matang» per periode — bila 0%, tulis «belum matang», bukan 0.</text>
</svg>`,
        alt: "Garis waktu label: aplikasi bulan nol, skor dan keputusan saat itu juga, jendela observasi satu bulan, lalu label tersedia dan cohort matang. Cohort belum matang hanya dimonitor tanpa label.",
        caption: "Cara membaca: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat. Cohort yang jendelanya belum lewat hanya boleh dimonitor tanpa label (PSI, approval rate, distribusi skor); ROC-AUC, bad rate, dan metrik fairness hanya dihitung pada cohort matang — dan «proporsi label matang» dilaporkan per periode.",
      },
      tasks: [],
    },
    {
      id: "decay",
      eyebrow: "Langkah 9 · Decay performa",
      title: "Decay: kapan penurunan itu nyata, dan kapan itu hanya noise",
      prose: [
        "Decay performa adalah penurunan ROC-AUC/PR-AUC (atau naiknya bad rate, ECE, Brier) dari waktu ke waktu pada model yang tidak berubah. Bedakan tiga pola. Pola 1 — noise: penurunan satu periode lalu rebound (chunk 2 ROC-AUC 0,7428 lalu chunk 3 0,8138). Bukan decay. Pola 2 — decay bertahap: penurunan kecil tapi KONSISTEN dua-tiga periode berturut-turut, PSI skor merangkak naik melewati 0,1. Ini decay — populasi bergeser perlahan. Pola 3 — patahan: penurunan besar dalam satu periode BERSAMA PSI skor di atas 0,25 (seperti simulasi S2: ROC-AUC turun 0,0256, PR-AUC turun 0,0582, PSI skor 0,5811). Ini decay mendadak — hampir pasti ada perubahan dunia nyata di baliknya.",
        "Nilai [notebook] — baseline vs train: GBM terkalibrasi (Platt/sigmoid) ROC-AUC train 0,8501 vs test 0,7816 — selisih 0,0685. Hati-hati: ini BUKAN decay; ini GAP TRAIN-TEST (overfitting, topik M6.3) — model yang sama diukur pada data yang pernah dilihat vs belum. Decay diukur dengan membandingkan periode live yang satu dengan periode live BERIKUTNYA, atau live vs baseline test — bukan train vs test. Satu lagi angka yang sering disalahbaca: ECE train 0,0415 vs ECE test 0,0087. ECE train yang LEBIH BURUK bukan bukti kalibrasi rusak — kalibrasi tidak boleh diukur di train, karena model sudah melihat data itu (skor train terlalu percaya diri). Ukur kalibrasi selalu di data yang belum dilihat model.",
        "Baik atau buruk: ROC-AUC per periode bagus sebagai detektor concept drift — satu-satunya alat yang menangkap hubungan fitur-label yang berubah sementara PSI diam. Buruk bila dipakai tanpa pembanding PSI: ROC-AUC turun + PSI stabil = concept drift (hubungan berubah); ROC-AUC turun + PSI besar = data drift (populasi berubah). Responsnya berbeda (langkah 13), jadi keduanya harus dibaca berdampingan. PR-AUC lebih sensitif daripada ROC-AUC di data tidak seimbang ini: di chunk [waktu semu], PR-AUC berayun 0,4982–0,6314 (lebar 0,1332) sementara ROC-AUC hanya 0,0710 — dan di simulasi S2, PR-AUC turun 0,0582, lebih dari dua kali penurunan ROC-AUC (0,0256).",
        "Mitigasi: tetapkan baseline performa (test: ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%) dan ukur penurunan RELATIF terhadap baseline itu, bukan terhadap train. Simpan juga lebar ayunan noise-mu: ROC-AUC ±0,04 antar-periode n = 1.200 adalah NORMAL di data ini — ambang alert di bawah itu hanya akan menghasilkan alarm palsu.",
      ],
      formula: String.raw`\Delta\mathrm{ROC} = \mathrm{ROC}_{\text{baseline}} - \mathrm{ROC}_{\text{periode}}, \qquad \text{decay bila } \Delta\mathrm{ROC} > 0{,}02 \text{ dalam 2 periode berturut-turut}`,
      formulaNote: "Penurunan ROC-AUC relatif terhadap baseline test 0,7816. Ambang 0,02 dan syarat 2 periode berturut-turut adalah keputusan kebijakan lesson ini (langkah 11) — bukan konstanta alam. Alasannya: ayunan noise antar-periode n = 1.200 mencapai 0,0388 dalam satu periode tanpa drift.",
      tasks: [],
    },
    {
      id: "simulasi",
      eyebrow: "Langkah 10 · Simulasi geser",
      title: "Dua simulasi geser: limit naik vs keterlambatan naik — hasil yang berlawanan",
      prose: [
        "Karena UCI tidak punya deret waktu, lesson ini mensimulasikan geser secara eksplisit — DILABELI [simulasi], parameternya ditulis, modelnya dibekukan (tidak di-retrain), dan skornya dihitung ulang. Simulasi S1 «limit naik» [simulasi]: LIMIT_BAL × 1,30 untuk semua baris test, fitur turunan dihitung ulang (UTILIZATION turun karena limit naik). Simulasi S2 «keterlambatan naik» [simulasi]: PAY_0 sampai PAY_6 + 1 (dibatasi maks 8) untuk semua baris test, fitur turunan dihitung ulang (PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT naik). Keduanya memakai GBM terkalibrasi yang sama, threshold 0,10, dan dibandingkan dengan baseline test.",
        "Nilai [notebook] — S1 [simulasi]: PSI skor 0,0358 (stabil), ROC-AUC 0,7796 (turun 0,0020 dari baseline 0,7816), PR-AUC 0,5551 (turun 0,0007), skor rata-rata 0,2108 (turun 0,0109), approval rate 36,32% (NAIK 7,82 poin persen dari 28,5%), bad rate 7,94% (naik 1,27 poin persen), ECE 0,0148 (dari 0,0087). S2 [simulasi]: PSI skor 0,5811 (GESER BESAR), ROC-AUC 0,7560 (turun 0,0256), PR-AUC 0,4976 (turun 0,0582), skor rata-rata 0,3210 (NAIK 0,0993), approval rate 7,05% (ANJLOK 21,45 poin persen dari 28,5%), bad rate 6,62% (turun 0,05 poin persen), ECE 0,1003 (11,5× baseline 0,0087), Brier 0,1538 (dari 0,1345). Pada S2, pangsa desil skor terendah jatuh dari 10% ke 1,83% sementara desil ke-8 naik dari 10% ke 22,55% — seluruh distribusi skor bergeser ke kanan.",
        "Bacalah kedua simulasi berdampingan. S1: populasi bergeser (limit naik), skor bergeser sedikit (PSI 0,0358), ranking UTUH (ROC-AUC turun 0,0020), tapi approval NAIK 7,82 poin persen — dampak BISNIS nyata tanpa kerusakan MODEL. Respons yang benar: sesuaikan ekspektasi bisnis, mungkin tinjau threshold — bukan retrain. S2: populasi bergeser besar (PSI 0,5811), ranking TURUN (ROC-AUC −0,0256, PR-AUC −0,0582), approval ANJLOK 21,45 poin persen, dan KALIBRASI RUSAK (ECE 0,1003) — threshold 0,10 tidak lagi berarti apa yang dulu ia artikan, karena probabilitas 0,10 kini tidak lagi jujur. Respons yang benar: retrain (langkah 13). Perhatikan juga bad rate S2: 6,62%, nyaris sama dengan baseline 6,67% — bad rate TIDAK menangkap bencana ini, karena yang disetujui tinggal 423 nasabah paling aman. Metrik yang tidak bergerak bisa sama berbahayanya dengan metrik yang bergerak.",
        "Baik atau buruk: simulasi bagus karena ia satu-satunya cara berlatih menghadapi drift saat datamu hanya satu snapshot — ia memberi angka yang bisa dihitung dan dibandingkan. Buruk bila hasilnya dibaca sebagai «bukti» tentang dunia nyata: S1 dan S2 adalah skenario YANG KAMU TULIS parameternya, bukan observasi. Mereka membuktikan «BILA limit naik 30%, MAKA approval naik 7,82 poin persen» — bukan «limit AKAN naik 30%». Jangan pernah menyajikan angka simulasi tanpa label [simulasi] dan parameternya.",
        "Mitigasi: sebelum live, jalankan simulasi geser pada modelmu sendiri — geser satu fitur kunci, ukur PSI skor + ROC-AUC + approval. Hasilnya adalah PETA SENSITIVITAS: fitur mana yang bila bergeser akan menghancurkan bisnismu, dan mana yang tidak. Pantau yang pertama dengan ketat; yang kedua boleh longgar.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="PSI skor: train vs test 0,0017; simulasi S1 limit naik 0,0358; simulasi S2 keterlambatan naik 0,5811; garis waspada 0,1 dan geser besar 0,25">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PSI skor — baseline vs dua simulasi geser [simulasi]</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="176.7" x2="466" y2="176.7" stroke="var(--c4)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="52" y1="132.7" x2="466" y2="132.7" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<rect x="90" y="205.5" width="60" height="0.5" fill="var(--c4)"/>
<text x="120" y="196" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0017</text>
<text x="120" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">train vs test</text>
<rect x="210" y="195.5" width="60" height="10.5" fill="var(--c4)"/>
<text x="240" y="190.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0358</text>
<text x="240" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">S1 limit ×1,30</text>
<rect x="330" y="35.5" width="60" height="170.5" fill="var(--c2)"/>
<text x="360" y="30.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5811</text>
<text x="360" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">S2 PAY +1</text>
<text x="410" y="171" font-size="10" fill="var(--text)" font-family="var(--font-ui)">waspada 0,1</text>
<text x="410" y="127" font-size="10" fill="var(--text)" font-family="var(--font-ui)">geser besar 0,25</text>
</svg>`,
        alt: "PSI skor: train vs test 0,0017; simulasi S1 limit naik 0,0358; simulasi S2 keterlambatan naik 0,5811; garis waspada 0,1 dan geser besar 0,25.",
        caption: "Cara membaca: PSI skor baseline train-vs-test 0,0017 nyaris nol (bar pertama hampir tak terlihat) — split acak memang stabil. S1 [simulasi] 0,0358 masih stabil, walau approval naik 7,82 poin persen. S2 [simulasi] 0,5811 melewati garis geser besar 0,25 — distribusi skor bergeser total dan approval anjlok 21,45 poin persen.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: approval anjlok berarti model rusak",
        type: "pitfall",
        body: "Yang benar: approval bisa anjlok karena POPULASI bergeser, bukan karena model rusak — di S2 [simulasi], model yang sama memberi skor lebih tinggi karena nasabahnya memang lebih terlambat (PAY +1). Modelnya bekerja BENAR; dunianyalah yang berubah. Menyalahkan model atas drift populasi adalah awal dari retrain yang sia-sia.",
      },
    },
    {
      id: "alerting",
      eyebrow: "Langkah 11 · Alerting",
      title: "Alerting: ambang ditulis dulu, penanggung jawab ditulis dulu",
      prose: [
        "Alert yang baik punya empat bagian: METRIK, AMBANG, FREKUENSI, dan PENANGGUNG JAWAB. Tanpa keempatnya, alert adalah angka yang berteriak tanpa ada yang mendengar. Tabel alert lesson ini [keputusan kebijakan lesson ini — ambang dipilih dari angka lesson, bukan konstanta alam]: PSI skor di atas 0,1 = WASPADA (analis memeriksa PSI per fitur dalam 1 hari kerja); PSI skor di atas 0,25 = KRITIS (analis + risk manager, investigasi dalam 1 hari kerja, keputusan retrain dalam 1 minggu). ROC-AUC turun lebih dari 0,02 dari baseline 0,7816 dalam 1 periode = WASPADA; dalam 2 periode berturut-turut = KRITIS. PR-AUC turun lebih dari 0,03 = WASPADA; 2 periode = KRITIS. Bad rate di atas 10% dalam 1 periode = WASPADA; 2 periode = KRITIS. ECE di atas 0,02 = WASPADA (kalibrasi perlu dicek ulang — threshold 0,10 bergantung padanya). Approval rate bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU (bukan alarm model — tapi beri tahu bisnis, karena ini memengaruhi volume).",
        "Uji tabel ini pada angka lesson. Chunk 2 [waktu semu]: ROC-AUC turun 0,0388 (melewati 0,02), PR-AUC turun 0,0421 (melewati 0,03), bad rate 10,74% (melewati 10%) — TIGA alarm waspada menyala sekaligus. Tapi chunk 3 membaik (ROC-AUC 0,8138) — tidak ada yang bertahan 2 periode, jadi tidak ada yang naik ke KRITIS dan tidak ada retrain. Inilah tabel yang bekerja: ia berteriak pada waktunya, dan diam pada waktunya. S1 [simulasi]: approval naik 7,82 poin persen — alarm PANTAU menyala, tapi PSI skor 0,0358 dan ROC-AUC turun 0,0020 tidak menyalakan apa pun. Respons: beri tahu bisnis, bukan retrain. S2 [simulasi]: PSI skor 0,5811, ROC-AUC turun 0,0256, PR-AUC turun 0,0582, ECE 0,1003 — KRITIS di empat metrik sekaligus. Respons: retrain (langkah 13).",
        "Dua jebakan alerting. Pertama, ALERT FATIGUE: ambang yang terlalu ketat (misal ROC-AUC turun 0,01) akan berteriak tiap periode — di data ini ayunan noise antar-periode mencapai 0,0388 — dan tim akan berhenti mendengar. Ambang harus DI ATAS noise normalmu: 0,02 untuk ROC-AUC dipilih karena ayunan noise satu periode mencapai 0,0388, jadi 0,02 masih akan berteriak sesekali — tapi syarat 2 periode-lah yang menyaringnya. Kedua, ALERT TANPA PEMILIK: PSI 0,5811 tanpa nama penanggung jawab adalah angka di dashboard yang tidak dibaca siapa pun. Tiap alert di tabel ini punya pemilik: analis untuk WASPADA, analis + risk manager untuk KRITIS, dan bisnis diberitahu untuk PANTAU approval.",
        "Nilai: dashboard monitoring minimal lesson ini — dibaca SETIAP PAGI oleh analis, MINGGUAN oleh risk manager: (1) PSI skor harian vs train (ambang 0,1 / 0,25); (2) ROC-AUC dan PR-AUC per periode vs baseline 0,7816 / 0,5558; (3) approval rate dan bad rate per periode vs 28,5% / 6,67%; (4) skor rata-rata dan ECE per periode vs 0,2217 / 0,0087; (5) PSI 5 fitur kunci (LIMIT_BAL, PAY_MEAN, UTILIZATION, BILL_AMT1, AGE) mingguan. Lima baris, satu halaman, tanpa grafik yang tidak dibaca. Dashboard yang tidak dibaca tiap pagi sama dengan tidak ada dashboard.",
        "Baik atau buruk: tabel alert ini bagus karena ambangnya DITULIS DULU dari angka lesson (noise 0,0388, baseline 0,7816) — bukan ditebak sesudah melihat angka. Buruk bila ambang ini disalin mentah ke produksi lain: ambang yang benar untuk n = 1.200 per periode belum tentu benar untuk n = 100.000 per hari. Hitung noise-mu sendiri, baru tulis ambangmu.",
        "Mitigasi: tinjau ambang tiap kuartal — bila alarm WASPADA tidak pernah menyala dalam 6 bulan, ambangmu mungkin terlalu longgar; bila menyala tiap minggu, terlalu ketat atau modelmu memang sedang decay. Ambang adalah hipotesis, bukan hukum.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: alert kritis langsung berarti retrain",
        type: "risk",
        body: "Yang benar: alert KRITIS berarti «selidiki sekarang», bukan «retrain sekarang». Chunk 2 menyalakan tiga alarm waspada sekaligus dan tetap tidak butuh retrain — karena chunk 3 membaik. Retrain adalah keputusan (langkah 13) dengan gerbangnya sendiri: 2 periode berturut-turut, atau PSI skor di atas 0,25, atau kalibrasi yang rusak (ECE di atas 0,02 bertahan). Alert memanggilmu; gerbang yang memutuskan.",
      },
    },
    {
      id: "fairness-monitoring",
      eyebrow: "Langkah 12 · Fairness monitoring",
      title: "Fairness monitoring: overall yang stabil bisa menyembunyikan ketidakadilan yang bergerak",
      prose: [
        "Monitoring yang kamu bangun sejauh ini memonitor POPULASI — PSI, ROC-AUC, approval rate, bad rate — semuanya angka OVERALL. Fairness monitoring memonitor hal yang berbeda: apakah model ini tetap adil UNTUK SETIAP GRUP, di setiap periode. Keduanya bisa bergerak berlawanan arah: overall stabil sementara fairness memburuk — dan dashboard yang hanya menampilkan overall tidak akan pernah memberitahumu. Inilah kelas kesalahan yang sama dengan aggregation bias M7.2 (satu angka global, lima cerita berbeda) — hanya saja kini ia terjadi dari WAKTU KE WAKTU, bukan dari grup ke grup.",
        "Nilai: dashboard fairness per periode/grup punya LIMA baris per grup (SEX, EDUCATION, AGE, MARRIAGE): approval rate, AIR (terhadap grup acuan), gap TPR, gap FPR/FNR, dan ECE/Brier per grup — masing-masing dengan n dan label matang-nya (langkah 7). Aturan alert-nya meminjam tabel alerting (langkah 11) dengan SATU tambahan: alert fairness menyala bila AIR grup mana pun jatuh di bawah 0,80 selama 2 periode berturut-turut, ATAU gap TPR/FPR melewati 0,05 dan bertahan 2 periode — dan alert itu TIDAK PERNAH digabung dengan alert overall: «overall AMAN, fairness WASPADA» adalah dua baris yang berbeda, bukan satu baris yang dirata-rata. Gambar dua panelnya menunjukkan kenapa: approval overall per chunk [waktu semu] berayun 25,17%–33,67% tanpa tren (ROC-AUC 0,7428–0,8138, juga tanpa tren) — sementara AIR SEX [simulasi] bergerak 0,869 → 0,710 → 0,830 → 0,910 → 0,940, dan chunk 2 (0,710) jatuh DI BAWAH 0,80. Overall diam. Fairness bergerak. Dashboard yang hanya punya panel kiri tidak akan pernah melihat panel kanan.",
        "Baik atau buruk: dashboard ini bagus karena ia membuat ketidakadilan yang bergerak menjadi TERLIHAT — dan karena ia memisahkan alert fairness dari alert overall, sehingga yang satu tidak menutupi yang lain. Buruk bila dibaca sebagai «jadi monitoring overall tidak penting»: overall tetap alarm pertamamu untuk data drift dan decay — fairness monitoring adalah LAPISAN TAMBAHAN, bukan pengganti. Dan buruk bila AIR per-periode dihitung tanpa n dan tanpa label matang: AIR chunk dengan n kecil atau label belum matang (langkah 7) adalah angka yang goyah — tulis n-nya dan proporsi label matangnya di samping AIR-nya, atau jangan laporkan AIR itu sama sekali.",
        "Mitigasi: tambahkan fairness monitoring ke dashboard-mu SEBELUM model live — bukan sesudah ada yang bertanya «apakah model ini masih adil?». Lima baris per grup, per periode; alert fairness terpisah dari alert overall; dan satu aturan keras: keputusan retrain atau rollback (langkah 13) yang dipicu alert fairness DITINJAU oleh manusia — bukan dieksekusi otomatis — karena alert fairness adalah awal penyelidikan (apakah ini drift nyata, noise periode-kecil, atau perubahan komposisi grup?), bukan vonis.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Dua panel: approval overall per chunk berayun tanpa tren, sementara AIR SEX simulasi bergerak dan jatuh di bawah 0,80 pada chunk 2">
<text x="120.0" y="16" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Overall: approval berayun, tanpa tren</text>
<text x="360.0" y="16" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fairness [simulasi]: AIR SEX bergerak</text>
<rect x="40" y="163" width="28" height="37" fill="var(--c1)" opacity="0.7"/>
<rect x="80" y="162" width="28" height="38" fill="var(--c1)" opacity="0.7"/>
<rect x="120" y="172" width="28" height="28" fill="var(--c1)" opacity="0.7"/>
<rect x="160" y="127" width="28" height="73" fill="var(--c1)" opacity="0.7"/>
<rect x="200" y="149" width="28" height="51" fill="var(--c1)" opacity="0.7"/>
<line x1="30" y1="200" x2="236" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="54" y="152" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">26,9</text>
<text x="94" y="151" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">27,2</text>
<text x="134" y="161" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">25,2</text>
<text x="174" y="116" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">33,7</text>
<text x="214" y="138" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">29,6</text>
<text x="54" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C1</text>
<text x="94" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C2</text>
<text x="134" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C3</text>
<text x="174" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C4</text>
<text x="214" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C5</text>
<line x1="260" y1="120" x2="460" y2="120" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="452" y="114" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,80</text>
<polyline points="280,92 320,156 360,108 400,76 440,64" fill="none" stroke="var(--c4)" stroke-width="2"/>
<circle cx="280" cy="92" r="4" fill="var(--c4)"/>
<circle cx="320" cy="156" r="4" fill="var(--c4)"/>
<circle cx="360" cy="108" r="4" fill="var(--c4)"/>
<circle cx="400" cy="76" r="4" fill="var(--c4)"/>
<circle cx="440" cy="64" r="4" fill="var(--c4)"/>
<text x="280" y="80" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,869</text>
<text x="320" y="172" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,710</text>
<text x="360" y="96" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,830</text>
<text x="400" y="64" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,910</text>
<text x="440" y="52" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,940</text>
<text x="280" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C1</text>
<text x="320" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C2</text>
<text x="360" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C3</text>
<text x="400" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C4</text>
<text x="440" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C5</text>
<text x="240" y="244" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Overall diam. Fairness bergerak. Panel kiri saja tidak akan pernah melihat panel kanan.</text>
</svg>`,
        alt: "Dua panel: approval overall per chunk berayun tanpa tren, sementara AIR SEX simulasi bergerak dan jatuh di bawah 0,80 pada chunk 2.",
        caption: "Cara membaca: panel kiri = approval overall per chunk [waktu semu] (25,17%–33,67%, tanpa tren; ROC-AUC 0,7428–0,8138 juga tanpa tren). Panel kanan = AIR SEX per chunk [simulasi] (0,869 → 0,710 → 0,830 → 0,910 → 0,940) dengan garis ambang 0,80 — chunk 2 jatuh di bawah ambang. Kanonik tidak punya AIR per chunk; angka panel kanan adalah [simulasi] untuk mengilustrasikan pola «overall stabil, fairness bergerak».",
      },
      tasks: [],
    },
    {
      id: "retraining",
      eyebrow: "Langkah 13 · Pemicu retraining",
      title: "Kapan retrain — dan kapan JANGAN retrain",
      prose: [
        "Pemicu retraining lesson ini — kuantitatif, tanpa firasat [keputusan kebijakan lesson ini]: RETRAIN bila SATU dari tiga ini terjadi — (1) PSI skor di atas 0,25 (geser besar, seperti S2 0,5811); (2) ROC-AUC turun lebih dari 0,02 dari baseline 0,7816 dalam 2 periode berturut-turut, ATAU PR-AUC turun lebih dari 0,03 dalam 2 periode berturut-turut; (3) ECE di atas 0,02 dalam 2 periode berturut-turut (kalibrasi rusak — threshold 0,10 tidak lagi bisa dipercaya, seperti S2 ECE 0,1003). Jadwal: tinjau metrik MINGGUAN, evaluasi retrain BULANAN, dan retrain TERJADWAL tiap kuartal bila tidak ada pemicu yang menyala — model yang tidak pernah di-retrain adalah model yang menua diam-diam. Retrain memakai data terbaru + protokol yang sama (stratified split, GBM + Platt, threshold dari biaya) dan dievaluasi dengan champion-challenger: model baru hanya menggantikan model lama bila mengalahkannya di data validation yang sama — bukan karena «lebih baru».",
        "Sama pentingnya: kapan JANGAN retrain. JANGAN retrain karena SATU periode buruk (chunk 2: ROC-AUC 0,7428, PR-AUC 0,5137, bad rate 10,74% — lalu chunk 3 membaik; retrain di chunk 2 berarti membuang model bagus karena noise). JANGAN retrain saat label BELUM MATANG: label default butuh waktu (nasabah harus benar-benar gagal bayar) — melatih ulang pada label yang belum matang berarti melatih pada label yang salah. JANGAN retrain saat penyebabnya BUG PIPELINE: bila PSI LIMIT_BAL melonjak karena satuan berubah (ribuan vs satuan) atau kolom tertukar, perbaiki pipelinenya — retrain hanya akan mengabadikan bug itu ke dalam model. JANGAN retrain saat drift-nya SEMENTARA dan diketahui penyebabnya (misal program restrukturisasi satu bulan) — tunggu program selesai, atau sesuaikan threshold sementara.",
        "Nilai: gerbang retrain yang kuantitatif mengubah retrain dari «perasaan» menjadi «keputusan». S2 [simulasi] lolos gerbang (1) PSI 0,5811 dan gerbang (3) ECE 0,1003 — retrain. S1 [simulasi] tidak lolos satu pun gerbang — jangan retrain, beri tahu bisnis soal approval yang naik. Chunk 2 tidak lolos gerbang (2) karena hanya 1 periode — jangan retrain. Tiga kasus, tiga jawaban, semuanya dari angka yang sama.",
        "Baik atau buruk: retrain terjadwal tiap kuartal bagus karena ia mencegah model menua diam-diam — decay bertahap yang tidak pernah melewati ambang harian tetap tertangkap kuartalan. Buruk bila retrain terjadwal dibaca sebagai «retrain apa pun yang terjadi»: retrain kuartalan tetap harus lewat champion-challenger. Model baru yang kalah dari champion di validation TIDAK naik ke produksi — «baru» bukan «lebih baik».",
        "Mitigasi: setiap retrain dicatat — tanggal, pemicu yang menyala (nomor gerbangnya), data yang dipakai, skor champion vs challenger, dan siapa yang menyetujui. Tanpa catatan ini, kamu tidak bisa membedakan «model membaik karena data baru» dari «model membaik karena kebetulan».",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 14 · Lab 1",
      title: "Lab: PSI manual dari tiga bin UTILIZATION",
      prose: [
        "Sekarang hitung PSI dengan tanganmu sendiri — dari tiga bin UTILIZATION (BILL_AMT1 / LIMIT_BAL), train vs test [notebook]. Bin desil dari kuantil train; pangsa train (expected) tiap bin di sini tepat 0,1000. Tiga bin ini: bin 1 (UTILIZATION 0–0,0012): expected 0,1000, actual 0,0977; bin 3 (0,0111–0,0407): expected 0,1000, actual 0,1072; bin 10 (0,9814–5,0): expected 0,1000, actual 0,1023. Rumus per bin: (actual − expected) × ln(actual / expected).",
        "Hasil yang diharapkan [lab]: term_bin1=0.000054; term_bin3=0.000501; term_bin10=0.000052; partial_psi_3bins=0.0006. Perhatikan: ini PSI PARSIAL — hanya 3 dari 10 bin. PSI penuh UTILIZATION adalah 0,0013 [notebook]; ketiga bin ini menyumbang 0,0006 dari 0,0013 itu. Bin 3 adalah penyumbang terbesar di antara ketiganya: (0,1072 − 0,1000) × ln(0,1072 / 0,1000) = 0,000501 — pangsa test 0,72 poin persen lebih tinggi dari train di bin ini.",
        "Setelah lab jalan, bandingkan dengan PSI penuh 0,0013: 7 bin lainnya menyumbang ≈0,0007 sisanya. Bila hasilmu berbeda, periksa dulu: apakah kamu memakai ln NATURAL (bukan log basis 10), dan apakah pangsa yang kamu pakai adalah pangsa (0,0977) bukan persen (9,77)?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi term tiap bin: (actual - expected) * ln(actual / expected)" },
        { id: "t2", text: "Lengkapi partial_psi_3bins: jumlah ketiga term" },
        { id: "t3", text: "Jalankan dan bandingkan dengan PSI parsial kanonis 0.0006 (PSI penuh UTILIZATION 0.0013)" },
      ],
      expected: "term_bin1=0.000054\nterm_bin3=0.000501\nterm_bin10=0.000052\npartial_psi_3bins=0.0006",
      hints: [
        "Term = (actual - expected) * ln(actual / expected): misal bin 3 -> (0,1072 - 0,1000) * ln(1,072) = 0,000501.",
        "Gunakan math.log (ln natural) — bukan log10. Selisih actual-expected boleh negatif; ln-nya pun boleh negatif; hasil kalinya selalu positif.",
        "PSI parsial hanya menjumlahkan 3 bin ini; PSI penuh (10 bin) UTILIZATION adalah 0,0013 — jangan samakan keduanya.",
      ],
      code: {
        starter: `# PSI manual dari 3 bin UTILIZATION (train vs test) [notebook]
# Bin: (label, expected share train, actual share test)
import math
BINS = [
    ("bin1 0-0,0012", 0.1000, 0.0977),
    ("bin3 0,0111-0,0407", 0.1000, 0.1072),
    ("bin10 0,9814-5,0", 0.1000, 0.1023),
]

term_bin1 = 0.0  # TODO: (actual - expected) * ln(actual / expected) bin 1
term_bin3 = 0.0  # TODO: (actual - expected) * ln(actual / expected) bin 3
term_bin10 = 0.0  # TODO: (actual - expected) * ln(actual / expected) bin 10
partial_psi_3bins = 0.0  # TODO: jumlah ketiga term
print(f"term_bin1={term_bin1:.6f}")
print(f"term_bin3={term_bin3:.6f}")
print(f"term_bin10={term_bin10:.6f}")
print(f"partial_psi_3bins={partial_psi_3bins:.4f}")`,
        lockLines: 9,
        solution: `# PSI manual dari 3 bin UTILIZATION (train vs test) [notebook]
# Bin: (label, expected share train, actual share test)
import math
BINS = [
    ("bin1 0-0,0012", 0.1000, 0.0977),
    ("bin3 0,0111-0,0407", 0.1000, 0.1072),
    ("bin10 0,9814-5,0", 0.1000, 0.1023),
]

term_bin1 = (BINS[0][2] - BINS[0][1]) * math.log(BINS[0][2] / BINS[0][1])
term_bin3 = (BINS[1][2] - BINS[1][1]) * math.log(BINS[1][2] / BINS[1][1])
term_bin10 = (BINS[2][2] - BINS[2][1]) * math.log(BINS[2][2] / BINS[2][1])
partial_psi_3bins = term_bin1 + term_bin3 + term_bin10
print(f"term_bin1={term_bin1:.6f}")
print(f"term_bin3={term_bin3:.6f}")
print(f"term_bin10={term_bin10:.6f}")
print(f"partial_psi_3bins={partial_psi_3bins:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "term_bin3", value: 0.000501, tol: 0.00005, label: "`term_bin3` seharusnya 0.000501", msg: "Bin 3: (0,1072 − 0,1000) × ln(1,072) = 0,000501 — penyumbang terbesar di antara ketiga bin." },
          { kind: "stdout_matches", task: "t1", pattern: "term_bin1=0.000054", label: "Output menampilkan term_bin1=0.000054", msg: "Bin 1: (0,0977 − 0,1000) × ln(0,977) = 0,000054 — selisih negatif × ln negatif = positif." },
          { kind: "stdout_matches", task: "t1", pattern: "term_bin10=0.000052", label: "Output menampilkan term_bin10=0.000052", msg: "Bin 10: (0,1023 − 0,1000) × ln(1,023) = 0,000052." },
          { kind: "equal", task: "t3", name: "partial_psi_3bins", value: 0.0006, tol: 0.00005, label: "`partial_psi_3bins` seharusnya 0.0006", msg: "PSI parsial 3 bin = 0,0006 — dari PSI penuh UTILIZATION 0,0013; ketiganya jauh di bawah ambang stabil 0,1." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 15 · Lab 2",
      title: "Lab: putuskan alert — chunk 2, S1, dan S2",
      prose: [
        "Lab kedua menerapkan tabel alert langkah 11 pada tiga kasus nyata lesson ini. Aturan level alert [keputusan kebijakan lesson ini]: KRITIS (2) bila PSI skor di atas 0,25 ATAU (penurunan ROC-AUC lebih dari 0,02 DAN penurunan PR-AUC lebih dari 0,03) DALAM 2 PERIODE BERTURUT-TURUT; WASPADA (1) bila salah satu pemicu terpenuhi dalam 1 periode (penurunan ROC-AUC lebih dari 0,02 ATAU penurunan PR-AUC lebih dari 0,03 ATAU bad rate di atas 0,10 ATAU PSI skor di atas 0,10); AMAN (0) bila tidak satu pun terpenuhi. Keputusan retrain memakai gerbang langkah 13: retrain = 1 bila PSI skor di atas 0,25 (gerbang 1 — cukup sendirian) ATAU (level KRITIS dan terkonfirmasi 2 periode berturut-turut).",
        "Tiga kasus [notebook, kecuali S1/S2 yang [simulasi]]: Kasus A — chunk 2 [waktu semu]: ROC-AUC 0,7428 (baseline 0,7816), PR-AUC 0,5137 (baseline 0,5558), bad rate 0,1074, PSI skor antar-periode [waktu semu] 0,0161 (chunk 1 vs chunk 5 — pembanding stabil yang tersedia), terkonfirmasi 2 periode = TIDAK (chunk 3 membaik: ROC-AUC 0,8138). Kasus B — S1 [simulasi]: PSI skor 0,0358, ROC-AUC 0,7796, PR-AUC 0,5551, bad rate 0,0794, terkonfirmasi 2 periode = TIDAK. Kasus C — S2 [simulasi]: PSI skor 0,5811, ROC-AUC 0,7560, PR-AUC 0,4976, bad rate 0,0662, terkonfirmasi 2 periode = TIDAK (tapi gerbang PSI sudah cukup).",
        "Hasil yang diharapkan [lab]: roc_drop_A=0.0388; pr_drop_A=0.0421; alert_A=1; retrain_A=0; alert_B=0; retrain_B=0; psi_C=0.5811; pr_drop_C=0.0582; alert_C=2; retrain_C=1. Bacalah baris terakhir dengan saksama: kasus A menyalakan alert WASPADA (tiga pemicu sekaligus) TAPI retrain-nya 0 — karena tidak terkonfirmasi 2 periode. Alert memanggilmu; gerbang yang memutuskan. Kasus C retrain-nya 1 walau tidak terkonfirmasi 2 periode — karena PSI 0,5811 melewati gerbang 1 sendirian.",
        "Setelah lab jalan, tanyakan pada dirimu: bila chunk 3 JUGA buruk (ROC-AUC 0,74), apa yang berubah? retrain_A menjadi 1 — karena gerbang 2 periode terpenuhi. Itulah bedanya satu periode buruk dengan decay.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi roc_drop_A dan pr_drop_A: baseline dikurangi nilai chunk 2" },
        { id: "t2", text: "Lengkapi alert_A, alert_B, alert_C dari aturan level (0 aman, 1 waspada, 2 kritis)" },
        { id: "t3", text: "Lengkapi retrain_A, retrain_B, retrain_C dari gerbang retrain langkah 13" },
      ],
      expected: "roc_drop_A=0.0388\npr_drop_A=0.0421\nalert_A=1\nretrain_A=0\nalert_B=0\nretrain_B=0\npsi_C=0.5811\npr_drop_C=0.0582\nalert_C=2\nretrain_C=1",
      hints: [
        "roc_drop_A = 0,7816 − 0,7428 = 0,0388; pr_drop_A = 0,5558 − 0,5137 = 0,0421 — keduanya melewati ambang, tapi baru 1 periode (chunk 3 membaik), jadi alert_A = 1 (waspada).",
        "Kasus B: PSI 0,0358, ROC turun 0,0020, PR turun 0,0007, bad rate 0,0794 — tidak satu pun pemicu terpenuhi, jadi alert_B = 0.",
        "retrain_C = 1 karena PSI 0,5811 di atas 0,25 (gerbang 1) — tidak butuh konfirmasi 2 periode. retrain_A = 0 karena hanya 1 periode buruk.",
      ],
      code: {
        starter: `# Putuskan alert: chunk 2 [waktu semu], S1 dan S2 [simulasi]
# Baseline test [notebook]: ROC-AUC 0,7816; PR-AUC 0,5558
BASE_ROC = 0.7816
BASE_PR = 0.5558
# Kasus A (chunk 2): ROC 0,7428; PR 0,5137; bad rate 0,1074; PSI skor antar-periode 0,0161 (chunk 1 vs chunk 5); 2 periode: TIDAK
# Kasus B (S1): ROC 0,7796; PR 0,5551; bad rate 0,0794; PSI skor 0,0358; 2 periode: TIDAK
# Kasus C (S2): ROC 0,7560; PR 0,4976; bad rate 0,0662; PSI skor 0,5811; 2 periode: TIDAK
CASES = {
    "A": {"roc": 0.7428, "pr": 0.5137, "bad": 0.1074, "psi": 0.0161, "confirmed_2p": False},
    "B": {"roc": 0.7796, "pr": 0.5551, "bad": 0.0794, "psi": 0.0358, "confirmed_2p": False},
    "C": {"roc": 0.7560, "pr": 0.4976, "bad": 0.0662, "psi": 0.5811, "confirmed_2p": False},
}

def alert_level(c):
    roc_drop = BASE_ROC - c["roc"]
    pr_drop = BASE_PR - c["pr"]
    if c["psi"] > 0.25 or ((roc_drop > 0.02 and pr_drop > 0.03) and c["confirmed_2p"]):
        return 2
    if roc_drop > 0.02 or pr_drop > 0.03 or c["bad"] > 0.10 or c["psi"] > 0.10:
        return 1
    return 0

def retrain(c):
    if c["psi"] > 0.25:
        return 1
    if alert_level(c) == 2 and c["confirmed_2p"]:
        return 1
    return 0

roc_drop_A = 0.0  # TODO: BASE_ROC - CASES["A"]["roc"]
pr_drop_A = 0.0  # TODO: BASE_PR - CASES["A"]["pr"]
alert_A = 0  # TODO: alert_level(CASES["A"])
retrain_A = 0  # TODO: retrain(CASES["A"])
alert_B = 0  # TODO: alert_level(CASES["B"])
retrain_B = 0  # TODO: retrain(CASES["B"])
psi_C = 0.0  # TODO: CASES["C"]["psi"]
pr_drop_C = 0.0  # TODO: BASE_PR - CASES["C"]["pr"]
alert_C = 0  # TODO: alert_level(CASES["C"])
retrain_C = 0  # TODO: retrain(CASES["C"])
print(f"roc_drop_A={roc_drop_A:.4f}")
print(f"pr_drop_A={pr_drop_A:.4f}")
print(f"alert_A={alert_A}")
print(f"retrain_A={retrain_A}")
print(f"alert_B={alert_B}")
print(f"retrain_B={retrain_B}")
print(f"psi_C={psi_C:.4f}")
print(f"pr_drop_C={pr_drop_C:.4f}")
print(f"alert_C={alert_C}")
print(f"retrain_C={retrain_C}")`,
        lockLines: 29,
        solution: `# Putuskan alert: chunk 2 [waktu semu], S1 dan S2 [simulasi]
# Baseline test [notebook]: ROC-AUC 0,7816; PR-AUC 0,5558
BASE_ROC = 0.7816
BASE_PR = 0.5558
# Kasus A (chunk 2): ROC 0,7428; PR 0,5137; bad rate 0,1074; PSI skor antar-periode 0,0161 (chunk 1 vs chunk 5); 2 periode: TIDAK
# Kasus B (S1): ROC 0,7796; PR 0,5551; bad rate 0,0794; PSI skor 0,0358; 2 periode: TIDAK
# Kasus C (S2): ROC 0,7560; PR 0,4976; bad rate 0,0662; PSI skor 0,5811; 2 periode: TIDAK
CASES = {
    "A": {"roc": 0.7428, "pr": 0.5137, "bad": 0.1074, "psi": 0.0161, "confirmed_2p": False},
    "B": {"roc": 0.7796, "pr": 0.5551, "bad": 0.0794, "psi": 0.0358, "confirmed_2p": False},
    "C": {"roc": 0.7560, "pr": 0.4976, "bad": 0.0662, "psi": 0.5811, "confirmed_2p": False},
}

def alert_level(c):
    roc_drop = BASE_ROC - c["roc"]
    pr_drop = BASE_PR - c["pr"]
    if c["psi"] > 0.25 or ((roc_drop > 0.02 and pr_drop > 0.03) and c["confirmed_2p"]):
        return 2
    if roc_drop > 0.02 or pr_drop > 0.03 or c["bad"] > 0.10 or c["psi"] > 0.10:
        return 1
    return 0

def retrain(c):
    if c["psi"] > 0.25:
        return 1
    if alert_level(c) == 2 and c["confirmed_2p"]:
        return 1
    return 0

roc_drop_A = BASE_ROC - CASES["A"]["roc"]
pr_drop_A = BASE_PR - CASES["A"]["pr"]
alert_A = alert_level(CASES["A"])
retrain_A = retrain(CASES["A"])
alert_B = alert_level(CASES["B"])
retrain_B = retrain(CASES["B"])
psi_C = CASES["C"]["psi"]
pr_drop_C = BASE_PR - CASES["C"]["pr"]
alert_C = alert_level(CASES["C"])
retrain_C = retrain(CASES["C"])
print(f"roc_drop_A={roc_drop_A:.4f}")
print(f"pr_drop_A={pr_drop_A:.4f}")
print(f"alert_A={alert_A}")
print(f"retrain_A={retrain_A}")
print(f"alert_B={alert_B}")
print(f"retrain_B={retrain_B}")
print(f"psi_C={psi_C:.4f}")
print(f"pr_drop_C={pr_drop_C:.4f}")
print(f"alert_C={alert_C}")
print(f"retrain_C={retrain_C}")`,
        checks: [
          { kind: "equal", task: "t1", name: "roc_drop_A", value: 0.0388, tol: 0.00005, label: "`roc_drop_A` seharusnya 0.0388", msg: "Chunk 2: 0,7816 − 0,7428 = 0,0388 — melewati ambang penurunan ROC-AUC 0,02." },
          { kind: "equal", task: "t1", name: "pr_drop_A", value: 0.0421, tol: 0.00005, label: "`pr_drop_A` seharusnya 0.0421", msg: "Chunk 2: 0,5558 − 0,5137 = 0,0421 — melewati ambang penurunan PR-AUC 0,03." },
          { kind: "equal", task: "t2", name: "alert_A", value: 1, tol: 0.5, label: "`alert_A` seharusnya 1 (waspada)", msg: "Chunk 2: ROC turun 0,0388 DAN PR turun 0,0421 — keduanya melewati ambang, tapi baru 1 periode (chunk 3 membaik: ROC-AUC 0,8138), jadi WASPADA (1), bukan KRITIS. Bad rate 10,74% juga melewati 10%." },
          { kind: "equal", task: "t3", name: "retrain_A", value: 0, tol: 0.5, label: "`retrain_A` seharusnya 0", msg: "Alert kritis TAPI hanya 1 periode (chunk 3 membaik ke 0,8138) — gerbang 2 periode tidak terpenuhi, jadi JANGAN retrain." },
          { kind: "equal", task: "t2", name: "alert_B", value: 0, tol: 0.5, label: "`alert_B` seharusnya 0 (aman)", msg: "S1 [simulasi]: PSI 0,0358, ROC turun 0,0020, PR turun 0,0007, bad rate 0,0794 — tidak satu pun pemicu terpenuhi. Approval yang naik 7,82 poin persen adalah PANTAU bisnis, bukan alarm model." },
          { kind: "equal", task: "t3", name: "retrain_C", value: 1, tol: 0.5, label: "`retrain_C` seharusnya 1", msg: "S2 [simulasi]: PSI skor 0,5811 di atas 0,25 — gerbang 1 terpenuhi sendirian, retrain tanpa menunggu konfirmasi 2 periode. PR-AUC turun 0,0582 dan ECE 0,1003 memperkuatnya." },
          { kind: "stdout_matches", task: "t2", pattern: "alert_C=2", label: "Output menampilkan alert_C=2", msg: "S2 [simulasi]: PSI 0,5811 di atas 0,25 — KRITIS (2)." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 16 · Lab 3",
      title: "Lab: monitoring overall vs per-grup — mana yang berteriak duluan?",
      prose: [
        "Lab ketiga membandingkan dua dashboard pada chunk yang sama [waktu semu]. Approval overall per chunk: C1 26,92%, C2 27,17%, C3 25,17%, C4 33,67%, C5 29,58% — berayun 8,50 poin persen tanpa tren; ROC-AUC 0,7428–0,8138, juga tanpa tren. AIR SEX per chunk [simulasi]: C1 0,869, C2 0,710, C3 0,830, C4 0,910, C5 0,940 — berayun 0,230 dan chunk 2 jatuh di bawah 0,80. Kanonik tidak punya AIR per chunk — angka AIR per-periode di sini adalah [simulasi] untuk mengilustrasikan pola «overall stabil, fairness bergerak», bukan angka yang dihitung dari data.",
        "Hasil yang diharapkan [lab]: overall_swing_pp=8.50; air_swing=0.2300; fairness_flag=True. Bacalah ketiganya berdampingan: ayunan overall 8,50 poin persen adalah NOISE periode-kecil (n = 1.200, tanpa tren, chunk 3 membaik setelah chunk 2) — sementara AIR 0,710 di chunk 2 adalah FLAG yang harus diselidiki, walau overall-nya diam. Dashboard yang hanya menampilkan panel kiri akan melaporkan «semua stabil» pada chunk 2 — dan melewatkan satu-satunya sinyal yang penting.",
        "Setelah lab jalan, bandingkan dengan langkah 12: alert fairness TIDAK PERNAH digabung dengan alert overall — «overall AMAN, fairness WASPADA» adalah dua baris yang berbeda. Dan ingat langkah 7: AIR per-periode hanya dilaporkan dengan n dan proporsi label matangnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi overall_swing_pp: ayunan approval overall (maks − min, poin persen)" },
        { id: "t2", text: "Lengkapi air_swing: ayunan AIR SEX [simulasi] (maks − min)" },
        { id: "t3", text: "Lengkapi fairness_flag: True bila AIR minimum di bawah 0,80" },
      ],
      expected: "overall_swing_pp=8.50\nair_swing=0.2300\nfairness_flag=True",
      hints: [
        "Approval overall: 26,92; 27,17; 25,17; 33,67; 29,58 — maks 33,67, min 25,17, ayunan 8,50 poin persen.",
        "AIR SEX [simulasi]: 0,869; 0,710; 0,830; 0,910; 0,940 — maks 0,940, min 0,710, ayunan 0,230.",
        "AIR minimum 0,710 di bawah ambang 0,80 — jadi fairness_flag = True (flag yang harus diselidiki, bukan vonis).",
      ],
      code: {
        starter: `# Lab 3 — monitoring overall vs per-grup [simulasi untuk AIR per-periode]
# Approval overall per chunk [waktu semu, kanonis M7.5]: C1..C5
# AIR SEX per chunk = [simulasi] — kanonik tak punya AIR per chunk
OVERALL_APPROVAL = [26.92, 27.17, 25.17, 33.67, 29.58]  # persen, chunk 1..5
AIR_SEX_SIM = [0.869, 0.710, 0.830, 0.910, 0.940]  # [simulasi], chunk 1..5

overall_swing_pp = 0.0  # TODO: max - min OVERALL_APPROVAL (poin persen)
air_swing = 0.0  # TODO: max - min AIR_SEX_SIM
fairness_flag = None  # TODO: True bila AIR minimum di bawah 0,80
print(f"overall_swing_pp={overall_swing_pp:.2f}")
print(f"air_swing={air_swing:.4f}")
print(f"fairness_flag={fairness_flag}")`,
        lockLines: 6,
        solution: `# Lab 3 — monitoring overall vs per-grup [simulasi untuk AIR per-periode]
# Approval overall per chunk [waktu semu, kanonis M7.5]: C1..C5
# AIR SEX per chunk = [simulasi] — kanonik tak punya AIR per chunk
OVERALL_APPROVAL = [26.92, 27.17, 25.17, 33.67, 29.58]  # persen, chunk 1..5
AIR_SEX_SIM = [0.869, 0.710, 0.830, 0.910, 0.940]  # [simulasi], chunk 1..5

overall_swing_pp = max(OVERALL_APPROVAL) - min(OVERALL_APPROVAL)
air_swing = max(AIR_SEX_SIM) - min(AIR_SEX_SIM)
fairness_flag = min(AIR_SEX_SIM) < 0.80
print(f"overall_swing_pp={overall_swing_pp:.2f}")
print(f"air_swing={air_swing:.4f}")
print(f"fairness_flag={fairness_flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "overall_swing_pp", value: 8.5, tol: 0.01, label: "`overall_swing_pp` seharusnya 8.50", msg: "Ayunan approval overall: 33,67 − 25,17 = 8,50 poin persen — noise periode-kecil tanpa tren." },
          { kind: "equal", task: "t2", name: "air_swing", value: 0.23, tol: 0.0005, label: "`air_swing` seharusnya 0.2300", msg: "Ayunan AIR SEX [simulasi]: 0,940 − 0,710 = 0,230 — fairness bergerak sementara overall diam." },
          { kind: "stdout_matches", task: "t3", pattern: "fairness_flag=True", label: "Output menampilkan fairness_flag=True", msg: "AIR minimum 0,710 di bawah ambang 0,80 — flag yang harus diselidiki, bukan vonis." },
        ],
      },
    },
    {
      id: "lab4",
      eyebrow: "Langkah 17 · Lab 4",
      title: "Lab (ringkas): attribution drift — top-1 berganti, apa artinya?",
      prose: [
        "Lab keempat mengukur attribution drift [simulasi] atas SHAP kanonis M7.3. Baseline mean |SHAP| global (GBM mentah, test 6.000): PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892. Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100 — top-1 BERGANTI dari PAY_MAX ke UTILIZATION. Angka periode baru adalah [simulasi] untuk mengilustrasikan pola «alasan berubah», bukan angka yang dihitung dari data.",
        "Hasil yang diharapkan [lab]: shift_pay_max=-0.2446; shift_utilization=0.1526; top1_baru=UTILIZATION; drift_flag=True. Bacalah dengan saksama: top-1 yang berganti adalah DIAGNOSIS — ia berkata «selidiki» (apakah limit naik di populasi? apakah komposisi grup berubah?), bukan «UTILIZATION kini menyebabkan default». Attribution drift bukan bukti kausal.",
        "Setelah lab jalan, bandingkan dengan langkah 6: tambahkan top-3 reason codes per periode dan PSI mean |SHAP| per keluarga ke dashboard-mu — dan bila top-1 berganti, tuliskan alasannya di log keputusan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi shift_pay_max dan shift_utilization: nilai baru dikurangi baseline" },
        { id: "t2", text: "Lengkapi top1_baru: fitur dengan mean |SHAP| terbesar di periode baru" },
        { id: "t3", text: "Lengkapi drift_flag: True bila top-1 berubah dari baseline" },
      ],
      expected: "shift_pay_max=-0.2446\nshift_utilization=0.1526\ntop1_baru=UTILIZATION\ndrift_flag=True",
      hints: [
        "PAY_MAX: 0,2500 − 0,4946 = −0,2446. UTILIZATION: 0,3100 − 0,1574 = +0,1526.",
        "Periode baru [simulasi]: PAY_MAX 0,2500 vs UTILIZATION 0,3100 — yang terbesar adalah UTILIZATION.",
        "Baseline top-1 adalah PAY_MAX (0,4946); periode baru top-1 adalah UTILIZATION — berubah, jadi drift_flag = True.",
      ],
      code: {
        starter: `# Lab 4 — attribution drift [simulasi] atas SHAP kanonis M7.3
# Baseline mean |SHAP| global (GBM mentah, test 6.000): PAY_MAX 0,4946; UTILIZATION 0,1574
# Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100
BASE_SHAP = {"PAY_MAX": 0.4946, "UTILIZATION": 0.1574}
NEW_SHAP = {"PAY_MAX": 0.2500, "UTILIZATION": 0.3100}  # [simulasi]

shift_pay_max = 0.0  # TODO: NEW_SHAP["PAY_MAX"] - BASE_SHAP["PAY_MAX"]
shift_utilization = 0.0  # TODO: NEW_SHAP["UTILIZATION"] - BASE_SHAP["UTILIZATION"]
top1_baru = ""  # TODO: fitur dengan mean |SHAP| terbesar di NEW_SHAP
drift_flag = None  # TODO: True bila top-1 berubah dari baseline
print(f"shift_pay_max={shift_pay_max:.4f}")
print(f"shift_utilization={shift_utilization:.4f}")
print(f"top1_baru={top1_baru}")
print(f"drift_flag={drift_flag}")`,
        lockLines: 6,
        solution: `# Lab 4 — attribution drift [simulasi] atas SHAP kanonis M7.3
# Baseline mean |SHAP| global (GBM mentah, test 6.000): PAY_MAX 0,4946; UTILIZATION 0,1574
# Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100
BASE_SHAP = {"PAY_MAX": 0.4946, "UTILIZATION": 0.1574}
NEW_SHAP = {"PAY_MAX": 0.2500, "UTILIZATION": 0.3100}  # [simulasi]

shift_pay_max = NEW_SHAP["PAY_MAX"] - BASE_SHAP["PAY_MAX"]
shift_utilization = NEW_SHAP["UTILIZATION"] - BASE_SHAP["UTILIZATION"]
top1_baru = max(NEW_SHAP, key=NEW_SHAP.get)
drift_flag = top1_baru != max(BASE_SHAP, key=BASE_SHAP.get)
print(f"shift_pay_max={shift_pay_max:.4f}")
print(f"shift_utilization={shift_utilization:.4f}")
print(f"top1_baru={top1_baru}")
print(f"drift_flag={drift_flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "shift_pay_max", value: -0.2446, tol: 0.0005, label: "`shift_pay_max` seharusnya -0.2446", msg: "Mean |SHAP| PAY_MAX turun 0,4946 → 0,2500 (selisih −0,2446) [simulasi]." },
          { kind: "equal", task: "t1", name: "shift_utilization", value: 0.1526, tol: 0.0005, label: "`shift_utilization` seharusnya 0.1526", msg: "Mean |SHAP| UTILIZATION naik 0,1574 → 0,3100 (selisih +0,1526) [simulasi]." },
          { kind: "stdout_matches", task: "t2", pattern: "top1_baru=UTILIZATION", label: "Output menampilkan top1_baru=UTILIZATION", msg: "Top-1 berganti dari PAY_MAX ke UTILIZATION [simulasi] — alasan model berubah." },
          { kind: "stdout_matches", task: "t3", pattern: "drift_flag=True", label: "Output menampilkan drift_flag=True", msg: "Top-1 yang berganti adalah diagnosis — selidiki, bukan bukti kausal." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 18 · Checkpoint",
      title: "Checkpoint: pantau skornya, baca fiturnya, putuskan dari dua periode",
      prose: [
        "Rangkuman: drift ada tiga — data drift (distribusi fitur berubah), prior shift (base rate berubah), concept drift (hubungan fitur-label berubah; hanya terdeteksi lewat decay performa, bukan PSI). PSI = jumlah (aktual − expected) × ln(aktual / expected) per bin, bin dari kuantil train; band: di bawah 0,1 stabil, 0,1–0,25 waspada, di atas 0,25 geser besar. PSI per fitur train vs test [notebook]: semua 16 fitur STABIL, tertinggi AGE 0,0029 — itu bukti split acak sehat, BUKAN bukti live aman; pembanding yang dikunci: M2 G9 PSI 0,0104, juga stabil. PSI skor GBM terkalibrasi train vs test 0,0017 (GBM mentah 0,0024); skor rata-rata train 0,2214 vs test 0,2217. Waktu semu [waktu semu — urutan ID, BUKAN tanggal nyata], 5 chunk @ 1.200: ROC-AUC 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006 (rentang 0,0710), PR-AUC 0,4982 / 0,5137 / 0,6314 / 0,5985 / 0,5458 (rentang 0,1332), base rate 0,2200 / 0,2375 / 0,2450 / 0,2092 / 0,1942, bad rate chunk 2 10,74%; PSI chunk 1 vs chunk 5 semuanya stabil (skor 0,0161, PAY_MEAN 0,0193). Decay: bandingkan live vs baseline test (ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%) — BUKAN train vs test (gap 0,0685 itu overfitting, bukan decay); ECE train 0,0415 tidak boleh dipakai menilai kalibrasi. Simulasi [simulasi]: S1 limit ×1,30 → PSI skor 0,0358, ROC-AUC 0,7796 (turun 0,0020), approval 36,32% (naik 7,82 poin persen) — pantau bisnis, jangan retrain. S2 PAY +1 → PSI skor 0,5811, ROC-AUC 0,7560 (turun 0,0256), PR-AUC 0,4976 (turun 0,0582), approval 7,05% (anjlok 21,45 poin persen), ECE 0,1003 (11,5× baseline), bad rate 6,62% — retrain. Alerting [keputusan kebijakan lesson ini]: PSI skor di atas 0,1 waspada / di atas 0,25 kritis; ROC-AUC turun lebih dari 0,02, PR-AUC turun lebih dari 0,03, bad rate di atas 10%, ECE di atas 0,02 — waspada 1 periode, kritis 2 periode. Dashboard minimal: PSI skor harian, ROC-AUC/PR-AUC + approval/bad rate per periode, skor rata-rata + ECE, PSI 5 fitur kunci mingguan — dibaca tiap pagi oleh analis, mingguan oleh risk manager. Retrain: PSI skor di atas 0,25, atau ROC-AUC turun lebih dari 0,02 / PR-AUC turun lebih dari 0,03 dalam 2 periode, atau ECE di atas 0,02 dalam 2 periode; retrain terjadwal tiap kuartal; champion-challenger sebelum naik produksi. JANGAN retrain: 1 periode buruk, label belum matang, bug pipeline, drift sementara yang diketahui. Lab: PSI parsial 3 bin UTILIZATION = 0,0006 (dari PSI penuh 0,0013); alert chunk 2 = waspada (1) tapi retrain = 0; S1 aman (0) retrain 0; S2 kritis (2) retrain 1. Attribution drift [simulasi]: top-1 mean |SHAP| berganti dari PAY_MAX ke UTILIZATION — diagnosis, bukan bukti kausal. Matured cohort: metrik berlabel hanya untuk cohort yang jendelanya sudah lewat. Fairness monitoring: AIR SEX [simulasi] 0,710 di chunk 2 — overall diam, fairness bergerak.",
        "Guided task di Colab — notebook mlf-m75-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM + kalibrasi Platt, PSI per fitur dan PSI skor train vs test, metrik per chunk waktu semu, dan dua simulasi geser S1/S2 dengan checks. Tautan Colab: https://colab.research.google.com/drive/1Qz1fYeAS-IdY6DLPya78Y_ikQ6_36VAg",
        "Ini lesson terakhir Modul M7 — tidak ada lesson berikutnya. Yang tersisa adalah kebiasaan: tiap pagi, buka dashboard, baca PSI skor — dan biarkan angka yang memutuskan, bukan firasat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "PSI skor pada simulasi S2 [simulasi] adalah 0,5811. Band apa ini, dan apa artinya?",
          options: [
            { text: "Stabil — di bawah 0,1, jadi tidak ada yang perlu dilakukan", why: "Salah: 0,5811 JAUH di atas 0,1. Band stabil hanya untuk PSI di bawah 0,1." },
            { text: "Waspada — antara 0,1 dan 0,25, cukup dipantau", why: "Salah: 0,5811 melewati 0,25 — bukan waspada, melainkan geser besar." },
            { text: "Geser besar — di atas 0,25; distribusi skor bergeser total dan retrain terpicu", why: "Benar: 0,5811 > 0,25. Desil skor terendah jatuh dari 10% ke 1,83% dan approval anjlok 21,45 poin persen — gerbang retrain 1 terpenuhi.", correct: true },
            { text: "Tidak bisa dinilai — PSI hanya berlaku untuk fitur, bukan skor", why: "Salah: PSI skor justru metrik monitoring utama lesson ini — satu angka yang merangkum semua fitur, dihitung dari distribusi probabilitas prediksi." },
          ],
        },
        {
          q: "PSI semua 16 fitur train vs test di bawah 0,003 (tertinggi AGE 0,0029). Kesimpulan yang benar?",
          options: [
            { text: "Populasi live stabil — model aman di produksi", why: "Salah: test BUKAN live. PSI train-vs-test hanya membuktikan split acak sehat; live adalah populasi masa depan yang belum dilihat." },
            { text: "Split acak sehat — train dan test berasal dari populasi yang sama, seperti yang diharapkan", why: "Benar: stratified split seed 42 menarik keduanya dari populasi yang sama, jadi PSI HARUS mendekati nol. PSI besar di sini justru akan menandakan split yang salah.", correct: true },
            { text: "PSI-nya terlalu kecil — bin desilnya pasti salah dibuat", why: "Salah: bin desil dari kuantil train sudah benar; PSI kecil adalah HASIL yang diharapkan dari split acak, bukan tanda kesalahan." },
            { text: "Model tidak sensitif terhadap fitur apa pun — semua fitur tidak penting", why: "Salah: PSI mengukur PERGESERAN distribusi, bukan pentingnya fitur. Fitur penting yang distribusinya tidak bergeser tetap punya PSI kecil." },
          ],
        },
        {
          q: "Chunk 2 [waktu semu]: ROC-AUC 0,7428 (turun 0,0388 dari baseline), PR-AUC 0,5137 (turun 0,0421), bad rate 10,74%. Chunk 3: ROC-AUC 0,8138. Apa keputusan yang benar?",
          options: [
            { text: "Retrain segera — tiga alarm menyala sekaligus", why: "Salah: alert KRITIS berarti selidiki, bukan retrain. Gerbang retrain butuh 2 periode berturut-turut — dan chunk 3 membaik ke 0,8138, membuktikan chunk 2 adalah noise." },
            { text: "Waspada, pantau periode berikutnya, JANGAN retrain — satu periode buruk adalah noise", why: "Benar: n = 1.200 per chunk membuat metrik berayun lebar (rentang ROC-AUC 0,0710 tanpa drift). Satu periode buruk = waspada; dua periode buruk berturut-turut = aksi.", correct: true },
            { text: "Abaikan — ROC-AUC 0,7428 masih di atas 0,7 jadi masih bagus", why: "Salah: 0,7428 memang bukan bencana, tapi penurunan 0,0388 melewati ambang alert 0,02 — ia layak dicatat sebagai waspada dan dipantau, bukan diabaikan." },
            { text: "Turunkan threshold ke 0,05 untuk menaikkan approval", why: "Salah: mengubah threshold karena satu periode buruk adalah reaksi terhadap noise — dan threshold 0,10 diturunkan dari biaya (LGD 45%, margin 5%), bukan dari ayunan satu periode." },
          ],
        },
        {
          q: "Simulasi S1 [simulasi] (limit ×1,30): PSI skor 0,0358, ROC-AUC turun 0,0020, tapi approval rate NAIK 7,82 poin persen (28,5% ke 36,32%). Apa yang terjadi?",
          options: [
            { text: "Model rusak — approval tidak boleh bergerak bila ROC-AUC diam", why: "Salah: modelnya utuh (ROC-AUC turun hanya 0,0020). Yang bergeser adalah POPULASI: limit naik menurunkan UTILIZATION, skor turun, lebih banyak nasabah lolos threshold 0,10." },
            { text: "Populasi bergeser, ranking tetap — dampaknya bisnis (volume naik), bukan kualitas model; beri tahu bisnis, jangan retrain", why: "Benar: PSI 0,0358 masih stabil dan ROC-AUC nyaris tidak bergerak — ini data drift ringan dengan dampak bisnis nyata. Responsnya komunikasi + tinjau threshold, bukan retrain.", correct: true },
            { text: "Threshold 0,10 sudah tidak berlaku — harus diganti 0,20", why: "Salah: tidak ada bukti threshold 0,10 rusak — kalibrasi S1 masih baik (ECE 0,0148 vs baseline 0,0087). Yang berubah adalah komposisi pendaftar, bukan kejujuran probabilitas." },
            { text: "Simulasinya salah — limit naik seharusnya menaikkan skor, bukan menurunkannya", why: "Salah: limit naik MENURUNKAN UTILIZATION (BILL_AMT1 / LIMIT_BAL) — dan utilisasi rendah berarti risiko lebih rendah, jadi skor turun dan approval naik. Arahnya benar." },
          ],
        },
        {
          q: "Simulasi S2 [simulasi] (PAY +1): ECE naik dari 0,0087 ke 0,1003 (11,5× baseline). Mengapa ini penting, bahkan lebih dari ROC-AUC yang hanya turun 0,0256?",
          options: [
            { text: "Tidak penting — ECE hanya pelengkap; ROC-AUC yang menentukan", why: "Salah: ECE 0,1003 berarti probabilitas meleset rata-rata 10 poin persen — threshold 0,10 yang diturunkan dari probabilitas jujur tidak lagi bisa dipercaya. Keputusan uang bergantung pada kalibrasi." },
            { text: "Kalibrasi rusak — probabilitas tidak lagi jujur, jadi threshold 0,10 kehilangan maknanya; ini salah satu gerbang retrain", why: "Benar: threshold 0,10 hanya bermakna bila skor 0,10 sungguh berarti peluang default 10%. Dengan ECE 0,1003, seluruh perhitungan biaya M6.4 runtuh — dan gerbang retrain ECE di atas 0,02 terpenuhi.", correct: true },
            { text: "ECE naik karena approval anjlok — keduanya hal yang sama", why: "Salah: keduanya gejala dari penyebab yang sama (skor bergeser), tapi bukan hal yang sama. ECE mengukur kejujuran probabilitas; approval mengukur volume keputusan." },
            { text: "ECE 0,1003 masih di bawah 0,25, jadi masih band stabil", why: "Salah: 0,25 adalah band PSI, bukan ECE. Ambang ECE lesson ini adalah 0,02 — 0,1003 melewatinya lima kali lipat." },
          ],
        },
        {
          q: "Mengapa PSI skor dipantau HARIAN sebagai alarm pertama, dan PSI per fitur baru diperiksa sesudahnya?",
          options: [
            { text: "Karena PSI skor lebih akurat daripada PSI per fitur", why: "Salah: keduanya memakai rumus yang sama. PSI skor bukan lebih akurat — ia lebih RINGKAS (satu angka) dan merangkum semua fitur." },
            { text: "Karena PSI skor satu angka yang merangkum semua fitur dan bisa dihitung tanpa label — bila ia melewati ambang, PSI per fitur menunjukkan fitur mana yang bergeser", why: "Benar: urutannya selalu skor dulu (alarm), fitur kemudian (diagnosis). PSI skor memberitahumu ADA yang bergeser; PSI per fitur memberitahumu APA yang bergeser.", correct: true },
            { text: "Karena PSI per fitur tidak bisa dihitung tanpa label default", why: "Salah: PSI (skor maupun fitur) tidak butuh label sama sekali — ia membandingkan distribusi, bukan kebenaran label. Label baru dibutuhkan untuk ROC-AUC/PR-AUC." },
            { text: "Karena fitur yang bergeser tidak pernah memengaruhi skor", why: "Terbalik: fitur yang bergeser CUKUP BESAR untuk menggerakkan skor akan tertangkap PSI skor. Fitur yang bergeser kecil dan tidak menggerakkan skor memang tidak perlu alarm harian." },
          ],
        },
        {
          q: "Angka kunci M2 G9 PSI 0,0104 — band apa ini?",
          options: [
            { text: "Geser besar — di atas 0,25", why: "Salah: 0,0104 jauh di bawah 0,25." },
            { text: "Waspada — antara 0,1 dan 0,25", why: "Salah: 0,0104 di bawah 0,1 — bukan waspada." },
            { text: "Stabil — di bawah 0,1, sejalan dengan PSI train-vs-test lesson ini yang semuanya di bawah 0,003", why: "Benar: 0,0104 < 0,1, jadi stabil. Angka ini pembanding yang dikunci koordinator — pada data yang sehat, PSI antar-bagian populasi yang sama memang kecil.", correct: true },
            { text: "Tidak bisa dinilai tanpa tahu bin-nya", why: "Salah: band PSI dibaca dari NILAI totalnya, bukan dari jumlah bin. 0,0104 < 0,1 berarti stabil apa pun bin-nya." },
          ],
        },
        {
          q: "Manakah situasi yang JANGAN memicu retrain?",
          options: [
            { text: "PSI skor 0,5811 dengan ECE 0,1003", why: "Salah: ini justru MEMICU retrain — gerbang 1 (PSI di atas 0,25) dan gerbang 3 (ECE di atas 0,02) terpenuhi, seperti S2." },
            { text: "ROC-AUC turun lebih dari 0,02 dalam 2 periode berturut-turut", why: "Salah: ini MEMICU retrain — gerbang 2 terpenuhi." },
            { text: "Satu periode buruk (chunk 2) yang diikuti periode membaik (chunk 3)", why: "Benar: satu periode buruk adalah noise (n = 1.200). Retrain di sini membuang model bagus karena ayunan sampling.", correct: true },
            { text: "Retrain terjadwal kuartalan dengan champion-challenger", why: "Salah: retrain terjadwal kuartalan adalah JADWAL, bukan larangan — model baru tetap harus mengalahkan champion di validation sebelum naik produksi." },
          ],
        },
        {
          q: "Periode terbaru (aplikasi 2 minggu lalu, jendela label 1 bulan) menunjukkan bad rate 4,1% — turun dari 6,67% baseline. Bolehkah periode ini dipakai untuk menyimpulkan «model membaik»?",
          options: [
            { text: "Tidak — label belum matang (jendela 1 bulan belum lewat); bad rate atas cohort belum matang bukan estimasi yang jujur; yang boleh dimonitor untuk periode ini hanya PSI, approval, dan distribusi skor", why: "Benar: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat. Periode 2 minggu lalu proporsi label matangnya 0% — bad rate 4,1% itu dihitung atas label yang belum lengkap, dan nasabah yang default cenderung ketahuan lebih dulu, jadi angka itu bukan estimasi yang jujur. Yang boleh dilaporkan untuk periode ini: «belum matang» + monitoring tanpa label (PSI, approval).", correct: true },
            { text: "Boleh — bad rate turun dari 6,67% ke 4,1% adalah kabar baik, laporkan saja apa adanya", why: "Salah: «apa adanya» tanpa label matang adalah angka yang menyesatkan — 4,1% itu bukan bad rate periode itu, melainkan bad rate atas sebagian label yang kebetulan sudah terlihat. Melaporkannya sebagai «model membaik» adalah vonis atas data yang belum lengkap." },
            { text: "Boleh, asal bad rate-nya dikalikan proporsi label matang — 4,1% × 0,5 = 2,05% bila setengah label sudah matang", why: "Salah: mengalikan dengan proporsi tidak memperbaiki bias seleksi — label yang matang lebih dulu bukan sampel acak dari periode itu. Tidak ada faktor koreksi sederhana untuk cohort yang belum matang; yang benar adalah menunggu cohort matang." },
            { text: "Tidak boleh — karena n periode terbaru terlalu kecil untuk vonis apa pun", why: "Salah alasan: masalahnya bukan n — masalahnya label yang BELUM MATANG. Periode dengan n = 1.200 yang labelnya sudah matang boleh dipakai; periode dengan n berapa pun yang labelnya belum matang tidak boleh dipakai untuk metrik berlabel." },
          ],
        },
      ],
      summary: [
        "Drift ada tiga: data drift (distribusi fitur berubah), prior shift (base rate berubah), concept drift (hubungan fitur-label berubah — hanya terdeteksi lewat decay performa, bukan PSI).",
        "PSI = jumlah (aktual − expected) × ln(aktual / expected) per bin, bin dari kuantil train; band: di bawah 0,1 stabil, 0,1–0,25 waspada, di atas 0,25 geser besar.",
        "PSI per fitur train vs test [notebook]: semua 16 fitur STABIL, tertinggi AGE 0,0029 — bukti split acak sehat, BUKAN bukti live aman. Pembanding yang dikunci: M2 G9 PSI 0,0104, juga stabil.",
        "PSI skor GBM terkalibrasi train vs test 0,0017 (GBM mentah 0,0024); skor rata-rata train 0,2214 vs test 0,2217 — alarm pertama monitoring, tanpa label.",
        "Waktu semu [waktu semu — urutan ID, BUKAN tanggal nyata], 5 chunk @ 1.200: ROC-AUC 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006 (rentang 0,0710); PR-AUC 0,4982 / 0,5137 / 0,6314 / 0,5985 / 0,5458 (rentang 0,1332); bad rate chunk 2 10,74%; PSI chunk 1 vs chunk 5 semuanya stabil (skor 0,0161, PAY_MEAN 0,0193).",
        "Decay diukur live vs baseline test (ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%) — bukan train vs test (gap 0,0685 itu overfitting). ECE train 0,0415 tidak boleh dipakai menilai kalibrasi.",
        "Simulasi [simulasi]: S1 limit ×1,30 → PSI skor 0,0358, ROC-AUC 0,7796 (turun 0,0020), approval 36,32% (naik 7,82 poin persen) — pantau bisnis, jangan retrain. S2 PAY +1 → PSI skor 0,5811, ROC-AUC 0,7560 (turun 0,0256), PR-AUC 0,4976 (turun 0,0582), approval 7,05% (anjlok 21,45 poin persen), ECE 0,1003 (11,5× baseline) — retrain.",
        "Alerting [keputusan kebijakan lesson ini]: PSI skor di atas 0,1 waspada / di atas 0,25 kritis; ROC-AUC turun lebih dari 0,02, PR-AUC turun lebih dari 0,03, bad rate di atas 10%, ECE di atas 0,02 — waspada 1 periode, kritis 2 periode. Dashboard minimal: PSI skor harian, ROC-AUC/PR-AUC + approval/bad rate per periode, skor rata-rata + ECE, PSI 5 fitur kunci mingguan — dibaca tiap pagi oleh analis, mingguan oleh risk manager.",
        "Retrain: PSI skor di atas 0,25, atau ROC-AUC turun lebih dari 0,02 / PR-AUC turun lebih dari 0,03 dalam 2 periode, atau ECE di atas 0,02 dalam 2 periode; retrain terjadwal tiap kuartal; champion-challenger sebelum naik produksi. JANGAN retrain: 1 periode buruk, label belum matang, bug pipeline, drift sementara yang diketahui.",
        "Attribution drift [simulasi]: mean |SHAP| PAY_MAX 0,4946 → 0,2500 (−0,2446), UTILIZATION 0,1574 → 0,3100 (+0,1526) — top-1 berganti; monitor top-3 reason codes per periode + PSI mean |SHAP| per keluarga; drift atribusi adalah diagnosis, bukan bukti kausal.",
        "Matured cohort: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan; ROC-AUC, bad rate, dan fairness hanya dihitung pada cohort matang; periode terbaru hanya dimonitor tanpa label (PSI, approval); laporkan «proporsi label matang» per periode.",
        "Fairness monitoring: dashboard per periode/grup (approval, AIR, gap TPR/FPR/FNR, ECE/Brier per grup + n + label matang) dengan alert fairness terpisah dari alert overall; approval overall 25,17%–33,67% tanpa tren sementara AIR SEX [simulasi] 0,710 di chunk 2 — overall diam, fairness bergerak.",
        "Lab: PSI parsial 3 bin UTILIZATION = 0,0006 (dari PSI penuh 0,0013); alert chunk 2 = waspada (1) tapi retrain = 0; S1 aman (0) retrain 0; S2 kritis (2) retrain 1.",
      ],
    },
  ],
};
