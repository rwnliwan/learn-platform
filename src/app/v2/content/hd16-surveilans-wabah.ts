import type { V2Lesson } from "../lib/types";

export const hd16: V2Lesson = {
  slug: "hd16-surveilans-wabah",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "HD16 SIR & Deteksi Wabah: Matematika Penyebaran Penyakit",
  estMinutes: 55,
  steps: [
    {
      id: "tiga-kasus",
      eyebrow: "Langkah 1 · Surveilans",
      title: "3 kasus yang menjadi 3.000",
      prose: [
        "Minggu 1: 3 kasus demam berdarah di sebuah kecamatan. Petugas mencatat di buku — tidak ada alert. Minggu 4: 80 kasus. Minggu 8: 3.000 kasus, RS penuh, fogging darurat yang terlambat. Investigasi: pola kenaikan sudah terlihat di minggu 2 bila ada yang menghitung.",
        "Tragedi itu bukan karena datanya tidak ada — datanya ada, tercatat rapi setiap minggu. Yang tidak ada adalah seseorang yang menghitung. Dalam pertumbuhan eksponensial, 3 kasus adalah sinyal: minggu depan 6, lalu 12. Surveilans yang baik bukan tentang data besar, melainkan kebiasaan menghitung hal kecil secara rutin.",
        "Aturan alert DBD kabupaten: dari data historis 3 tahun, rata-rata kasus mingguan per kecamatan = 5, SD = 3. Alert bila kasus minggu ini > rata-rata + 2×SD (= 11) selama 2 minggu berturut-turut. Minggu 12: 13 kasus; minggu 13: 15 kasus → ALERT → investigasi + fogging fokus. Trade-off abadi: ambang rendah = cepat tapi banyak false alarm (kelelahan petugas); ambang tinggi = tenang tapi terlambat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membaca kurva kasus berdasarkan tanggal LAPOR seolah itu tanggal kejadian. Kurva lapor terlambat 1–2 minggu dari realita — keputusan dari kurva lapor adalah keputusan dari masa lalu. Selalu bedakan tanggal onset vs tanggal lapor, dan nowcast sebelum menyimpulkan.",
        type: "pitfall",
      },
      reference: "Deteksi dini membeli waktu — seluruh nilai surveilans ada di kecepatan.",
    },
    {
      id: "lab-sir",
      eyebrow: "Langkah 2 · Lab simulasi",
      title: "Simulasi SIR dan efek intervensi",
      prose: [
        "Model SIR membagi populasi menjadi S (susceptible/rentan), I (infectious/menular), R (recovered/kebal). Infeksi mengalir S→I→R dengan laju beta (penularan = kontak × peluang infeksi) dan gamma (kesembuhan = 1/periode menular). Ibarat kebakaran hutan: S = pohon kering, I = api, R = abu.",
        "Simulasikan SIR diskret 200 hari: populasi 10.000, I awal 10, β=0,3, γ=0,1. Bandingkan tanpa intervensi vs β turun 40% mulai hari ke-30 (pembatasan). Lihat puncak lebih rendah dan total kasus turun — flatten the curve dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan `sir()` tanpa intervensi; catat `puncak1` dan `total1`" },
        { id: "t2", text: "Jalankan dengan intervensi (β×0,6 dari hari 30); catat `puncak2` dan `total2`" },
      ],
      expected: "puncak1=3127 total1=9457 | puncak2=1891 total2=7891",
      note: {
        title: "Sering salah",
        body: "Memakai model SIR untuk memprediksi tanggal puncak wabah dengan tepat. SIR adalah model skenario (“jika β tetap, maka…”), bukan kristal: parameter berubah saat perilaku berubah dan kasus underreported. Gunakan untuk membandingkan intervensi, bukan meramal tanggal.",
        type: "pitfall",
      },
      hints: [
        "Fungsi sir() sudah tersedia — panggil dengan argumen yang tepat.",
        "Intervensi: beta_baru = 0,3 × 0,6 mulai intervensi_hari=30.",
        "puncak1, _, total1 = sir()\npuncak2, _, total2 = sir(intervensi_hari=30, beta_baru=0.3*0.6)",
      ],
      code: {
        starter: `def sir(N=10000, I0=10, beta=0.3, gamma=0.1, hari=200, intervensi_hari=None, beta_baru=None):\n    S, I, R = N-I0, float(I0), 0.0\n    puncak, total = I, 0.0\n    for t in range(hari):\n        b = beta_baru if (intervensi_hari is not None and t >= intervensi_hari and beta_baru) else beta\n        baru = b*S*I/N; sembuh = gamma*I\n        S -= baru; I += baru - sembuh; R += sembuh\n        total += baru\n        if I > puncak: puncak = I\n    return puncak, total\n\n# TULIS KODEMU: bandingkan tanpa vs dengan intervensi\npuncak1, total1 = \npuncak2, total2 = \n\nprint(f"puncak1={puncak1:.0f} total1={total1:.0f}")\nprint(f"puncak2={puncak2:.0f} total2={total2:.0f}")`,
        lockLines: 11,
        solution: `def sir(N=10000, I0=10, beta=0.3, gamma=0.1, hari=200, intervensi_hari=None, beta_baru=None):\n    S, I, R = N-I0, float(I0), 0.0\n    puncak, total = I, 0.0\n    for t in range(hari):\n        b = beta_baru if (intervensi_hari is not None and t >= intervensi_hari and beta_baru) else beta\n        baru = b*S*I/N; sembuh = gamma*I\n        S -= baru; I += baru - sembuh; R += sembuh\n        total += baru\n        if I > puncak: puncak = I\n    return puncak, total\n\n# TULIS KODEMU: bandingkan tanpa vs dengan intervensi\npuncak1, total1 = sir()\npuncak2, total2 = sir(intervensi_hari=30, beta_baru=0.3*0.6)\n\nprint(f"puncak1={puncak1:.0f} total1={total1:.0f}")\nprint(f"puncak2={puncak2:.0f} total2={total2:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "puncak1", value: 3127, tol: 1, label: "`puncak1` seharusnya 3127", msg: "sir() tanpa argumen memakai default β=0,3. Cek pemanggilan fungsinya." },
          { kind: "equal", task: "t1", name: "total1", value: 9457, tol: 1, label: "`total1` seharusnya 9457", msg: "Total terinfeksi tanpa intervensi ≈ 9.457 dari 10.000." },
          { kind: "equal", task: "t2", name: "puncak2", value: 1891, tol: 1, label: "`puncak2` seharusnya 1891", msg: "sir(intervensi_hari=30, beta_baru=0.3*0.6) — puncak turun 40%." },
          { kind: "equal", task: "t2", name: "total2", value: 7891, tol: 1, label: "`total2` seharusnya 7891", msg: "Intervensi menekan total kasus dari 9.457 ke 7.891." },
        ],
      },
      reference: "Tiga tuas intervensi: turunkan β, naikkan γ, kecilkan S (vaksinasi).",
    },
    {
      id: "lab-rt",
      eyebrow: "Langkah 3 · Lab Rt",
      title: "Menghitung Rt dari data mingguan",
      prose: [
        "R0 = rata-rata kasus sekunder dari 1 kasus pada populasi rentan penuh (sifat patogen + kontak normal). Rt = versi saat-t (dengan intervensi/kekebalan). Rt > 1 = wabah tumbuh; Rt < 1 = padam. Herd immunity threshold = 1 − 1/R0: campak R0 ≈ 12–18 → butuh 92–94% kebal, itulah kenapa target imunisasi campak >95%.",
        "Estimasi sederhana: Rt ≈ (kasus periode ini) / (kasus satu interval serial lalu). Data kasus DBD mingguan kecamatan X: M1=12, M2=18, M3=31, M4=55, M5=40, M6=22. Interval serial DBD ≈ 2 minggu. Hitung Rt untuk M3–M6 dan tentukan kapan wabah berbalik.",
      ],
      formula: String.raw`R_t \approx \frac{\text{kasus}(t)}{\text{kasus}(t - \text{interval serial})} \qquad \text{herd immunity} = 1 - \frac{1}{R_0}`,
      formulaNote: "kasus(t) = jumlah kasus pada periode t; kasus(t − interval serial) = jumlah kasus satu interval serial sebelumnya (untuk DBD ≈ 2 minggu); R0 = angka reproduksi dasar pada populasi rentan penuh. Contoh: kasus M3 = 31, M1 = 12 → Rt(M3) = 31/12 ≈ 2,58. Interpretasi: tiap kasus rata-rata melahirkan 2,58 kasus baru dua minggu kemudian — wabah tumbuh cepat. Ambang herd immunity 1 − 1/R0: campak R0 ≈ 15 → butuh ≈ 93% kebal.",
      tasks: [
        { id: "t1", text: "Hitung `rt` = [Rt(M3), Rt(M4), Rt(M5), Rt(M6)] dengan interval serial 2 minggu" },
      ],
      expected: "rt=[2.58, 3.06, 1.29, 0.40]",
      note: {
        title: "Sering salah",
        body: "Mengumumkan “terkendali” dari Rt yang interval kepercayaannya mencakup 1. Rt(M5)=1,29 dengan CI 0,8–2,1 berarti belum pasti — bisa masih tumbuh. Dan Rt dihitung dari data 1–2 minggu lalu: ia termometer (menilai intervensi kemarin bekerja atau tidak), bukan ramalan cuaca.",
        type: "pitfall",
      },
      hints: [
        "Rt(M3) = kasus M3 / kasus M1 (2 minggu sebelumnya).",
        "Indeks list mulai dari 0: M[i] adalah minggu ke-(i+1).",
        "rt = [M[2]/M[0], M[3]/M[1], M[4]/M[2], M[5]/M[3]]\nrt_m3, rt_m6 = rt[0], rt[3]",
      ],
      code: {
        starter: `M = [12, 18, 31, 55, 40, 22]  # kasus DBD mingguan M1..M6\n\n# TULIS KODEMU: Rt tiap minggu (interval serial = 2 minggu)\nrt = \n\nprint("rt=" + str([round(x, 2) for x in rt]))\nprint("titik balik: Rt<1 pertama di M6" if rt[3] < 1 else "belum berbalik")`,
        lockLines: 1,
        solution: `M = [12, 18, 31, 55, 40, 22]  # kasus DBD mingguan M1..M6\n\n# TULIS KODEMU: Rt tiap minggu (interval serial = 2 minggu)\nrt = [M[2]/M[0], M[3]/M[1], M[4]/M[2], M[5]/M[3]]\nrt_m3, rt_m6 = rt[0], rt[3]\n\nprint("rt=" + str([round(x, 2) for x in rt]))\nprint("titik balik: Rt<1 pertama di M6" if rt[3] < 1 else "belum berbalik")`,
        checks: [
          { kind: "equal", task: "t1", name: "rt_m3", value: 2.5833, tol: 0.01, label: "Rt(M3) sekitar 2.58", msg: "31/12 = 2,58. Tambahkan rt_m3 = rt[0] agar bisa diperiksa." },
          { kind: "equal", task: "t1", name: "rt_m6", value: 0.4, tol: 0.01, label: "Rt(M6) = 0.40", msg: "22/55 = 0,40 — wabah menyusut. Tambahkan rt_m6 = rt[3]." },
          { kind: "stdout_matches", task: "t1", pattern: "rt=\\[2\\.58, 3\\.06, 1\\.29, 0\\.4\\]", label: "`print` menampilkan deret Rt", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Rt untuk aksi; R0 untuk konteks. Skenario, bukan ramalan titik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: membaca dan merespons sinyal wabah",
      prose: [
        "Lima situasi keputusan yang dihadapi epidemiolog lapangan dan Dinkes setiap musim penyakit:",
        "Skenario 1 — “Kasus naik — apakah ini wabah atau noise?” → Deteksi aberration (CUSUM): bandingkan angka minggu ini dengan baseline musiman yang sama, bukan dengan minggu lalu. Kenaikan tanpa konteks musim menghasilkan alarm palsu; penurunan tanpa konteks musim menghasilkan klaim keberhasilan palsu.",
        "Skenario 2 — “Wabahnya sedang meluas atau sudah padam?” → Hitung Rt SEBELUM memutuskan intervensi: Rt > 1 berarti meluas, Rt < 1 berarti padam dengan sendirinya. Contoh: Rt sudah < 1 sejak Februari — fogging massal di Maret berarti menembak wabah yang sudah mati, lalu mengklaim kematiannya.",
        "Skenario 3 — “Intervensi kami “berhasil” — benarkah?” → Klaim keberhasilan wajib punya pembanding: wilayah kontrol, pola musiman historis, atau Rt pra-intervensi. “Sesudah fogging kasus turun 60%” adalah post hoc ergo propter hoc bila tiap tahun kasus memang turun di bulan yang sama tanpa fogging.",
        "Skenario 4 — “Berapa beban RS minggu depan?” → Proyeksikan dengan model SIR yang parameternya dikalibrasi lokal (bukan angka dari negara lain). Ingat: populasi rentan (S) yang habis memadamkan wabah sendiri — proyeksi eksponensial tanpa batas adalah fiksi yang menakutkan.",
        "Skenario 5 — “Respons apa yang proporsional?” → Fogging FOKUS saat alert hotspot + PSN (pemberantasan sarang nyamuk) + surveilans larva sebagai rutinitas. Fogging massal rutin tiap bulan = mahal + mempercepat resistensi insektisida + populasi nyamuk pulih dalam 2 minggu karena sarangnya tak tersentuh.",
        "Aturan praktis 10 detik: naik → CUSUM vs baseline musiman → Rt dulu sebelum intervensi → klaim “berhasil” butuh pembanding → proyeksi = SIR terkalibrasi lokal → respons = fokus + PSN, bukan fogging seremonial.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menganggarkan fogging rutin bulanan karena “kasus turun sesudah fogging” — padahal Rt sudah < 1 sebelumnya dan penurunannya musiman. Analis yang bisa menghitung “efektivitas fogging vs PSN per rupiah” mengubah anggaran dari seremonial menjadi strategis.",
        type: "pitfall",
      },
      reference: "Klaim keberhasilan butuh pembanding: kontrol, musiman, atau Rt.",
    },
    {
      id: "fogging-musiman",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Fogging massal: berhasil atau musiman?",
      prose: [
        "Kota melakukan fogging massal DBD di bulan Maret. Kasus turun 60% di April–Mei. Walikota mengklaim sukses dan menganggarkan fogging rutin tiap bulan. Kamu cek data 5 tahun: kasus DBD selalu turun di April–Mei (musim kemarau, nyamuk berkurang). Tidak ada wilayah kontrol. Rt sudah < 1 sejak Februari — sebelum fogging.",
        "Tiga masalah: (1) musiman — penurunan terjadi tiap tahun tanpa fogging; (2) Rt<1 sebelum intervensi — wabah sudah padam sendiri (S habis/musim); (3) tanpa kontrol, tak ada pembanding. “Sesudah fogging kasus turun” adalah post hoc ergo propter hoc — sesudahnya belum tentu karenanya.",
        "Rekomendasi: JANGAN anggarkan fogging rutin bulanan (mahal, risiko resistensi insektisida, dampak lingkungan); alihkan ke PSN (pemberantasan sarang nyamuk) + surveilans larva + fogging FOKUS saat alert hotspot. Fogging membunuh nyamuk dewasa hari itu; tanpa pemberantasan sarang, populasi pulih dalam 2 minggu. Evaluasi yang benar butuh desain stepped-wedge atau wilayah kontrol — atau ukur kepadatan vektor (angka bebas jentik) sebelum-sesudah, bukan cuma kasus.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Menganggarkan fogging rutin bulanan berdasarkan klaim “berhasil” yang sebenarnya musiman berarti membakar anggaran Dinkes + mempercepat resistensi insektisida — sementara sarang nyamuk (akar masalah) tidak tersentuh. Analis yang bisa menghitung “efektivitas fogging vs PSN per rupiah” mengubah anggaran dari seremonial menjadi strategis.",
        type: "risk",
      },
      reference: "Klaim keberhasilan butuh pembanding: kontrol, musiman, atau Rt.",
    },
    {
      id: "cusum-aberration",
      eyebrow: "Langkah 6 · Deteksi aberration",
      title: "CUSUM: penjaga yang tidak tertidur oleh noise",
      prose: [
        "Aturan “rata-rata + 2SD selama 2 minggu” di cerita pembuka bekerja — tetapi ia buta terhadap kenaikan PELAN yang konsisten. Lima minggu berturut-turut di 1,5 SD di atas rata-rata tidak pernah memicu alert, padahal polanya jelas bukan kebetulan. Di sinilah metode deteksi aberration modern masuk: CUSUM (Cumulative Sum) dan EWMA (Exponentially Weighted Moving Average) — keduanya mengakumulasi bukti kecil dari minggu ke minggu sampai cukup untuk berteriak.",
        "Cara kerja CUSUM satu sisi: tiap minggu hitung selisih kasus dari nilai acuan k (mis. rata-rata + 0,5 SD), lalu jumlahkan — tetapi jumlahnya tidak boleh negatif (reset ke nol bila turun). Rumusnya S_h = max(0, S_{h−1} + (x_h − k)). Saat akumulasi S_h melewati ambang keputusan h, alarm berbunyi. Intuisinya: satu minggu tinggi menambah “kecurigaan”, satu minggu normal menguranginya — tetapi kecurigaan tidak pernah minus. Wabah pelan yang konsisten menumpuk kecurigaan sampai meledak; fluktuasi acak saling meniadakan.",
        "Tiga hal yang membedakan analis surveilans senior. Pertama, nowcasting: kurva berdasarkan tanggal LAPOR terlambat 1–2 minggu — analis yang baik mengoreksi keterlambatan pelaporan (mis. hanya 60% kasus minggu ini yang sudah masuk) sebelum menghitung, bukan setelah. Keputusan dari data mentah adalah keputusan dari masa lalu. Kedua, evaluasi sensitivitas sistem: surveilans dinilai bukan dari “berapa alert”, melainkan dari kelengkapan pelaporan (% fasyankes melapor tepat waktu), ketepatan waktu (lag onset→lapor), dan nilai prediktif alert (% alert yang berujung wabah nyata). Sistem dengan 100% alert “benar” biasanya ambangnya terlalu tinggi — ia tenang karena buta. Ketiga, kalibrasi musiman: untuk DBD, baseline harus mengikuti musim — ambang yang sama untuk Januari (hujan) dan Agustus (kemarau) akan membanjiri petugas dengan alarm palsu di musim hujan.",
      ],
      formula: String.raw`S_h = \max(0,\, S_{h-1} + (x_h - k)) \qquad \text{alarm bila } S_h > h`,
      formulaNote: "S_h = skor kecurigaan kumulatif minggu h (mulai dari S_0 = 0); x_h = kasus minggu h; k = nilai acuan (mis. rata-rata + 0,5×SD — hanya kelebihan di atas k yang menumpuk); h = ambang keputusan. Contoh: k = 7, h = 10, kasus mingguan 5, 12, 18 → S: max(0, 0+(5−7)) = 0; max(0, 0+(12−7)) = 5; max(0, 5+(18−7)) = 16 > 10 → ALARM. Interpretasi: S_h adalah “memori kecurigaan” — minggu normal menghapusnya perlahan, minggu abnormal menumpuknya.",
      tasks: [],
      note: {
        title: "Intuisi: surveilans yang baik itu membosankan",
        body: "Praktisi surveilans senior punya heuristik yang terdengar anti-klimaks: sistem yang baik jarang memberi kejutan. Caranya: tetapkan baseline, ambang, dan protokol respons SEBELUM wabah — saat tenang, bukan saat panik. Kedua, jangan pernah percaya satu angka: alert CUSUM harus dikonfirmasi dengan pertanyaan lapangan (“apakah ada klaster di satu RW atau tersebar acak?”) sebelum fogging dikerahkan. Ketiga, bedakan tanggal onset dan tanggal lapor dalam SETIAP grafik yang kamu buat — kurva lapor yang “menurun” sering kali hanya berarti laporannya belum masuk, dan nowcasting (mengoreksi keterlambatan) adalah pembeda analis junior dan senior. Keempat, catat setiap alert beserta hasilnya (wabah nyata atau palsu) — tanpa umpan balik ini, ambangmu tidak pernah belajar. Kelima, perlakukan setiap musim sebagai eksperimen baru — ambang yang bekerja tahun lalu belum tentu bekerja tahun ini bila cakupan pelaporan berubah; kalibrasi ulang baseline tiap awal musim hujan, dan dokumentasikan setiap perubahan ambang beserta alasannya agar keputusanmu bisa diaudit. Surveilans bukan tentang menemukan wabah; ia tentang membangun mesin yang menemukan wabah bahkan saat kamu sedang cuti.",
      },
      reference: "CUSUM/EWMA menangkap kenaikan pelan yang lolos dari ambang 2SD. Nowcast dulu, simpulkan kemudian.",
    },
    {
      id: "lab-cusum",
      eyebrow: "Langkah 7 · Lab simulasi",
      title: "Bangun detektor CUSUM",
      prose: [
        "Implementasikan CUSUM satu sisi pada 20 minggu data kasus DBD sintetis (12 minggu baseline tenang, lalu wabah). Nilai acuan k = 7, ambang h = 10. Tulis fungsi `cusum` yang mengembalikan skor akhir dan daftar minggu alarm (1-based), lalu tentukan minggu alarm pertama.",
        "Coba: setelah lolos, naikkan k menjadi 9 (acuan lebih longgar). Minggu alarm pertama mundur ke kapan? Itulah trade-off sensitivitas vs false alarm yang kamu pegang sebagai analis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `cusum(xs, k, h)`: kembalikan `(s_akhir, minggu_alarm)`" },
        { id: "t2", text: "Jalankan dan pastikan skor akhir + minggu alarm pertama tercetak" },
      ],
      expected: "s_akhir=59.0\nminggu_alarm=[14, 15, 16, 17, 18, 19, 20]\nalarm_pertama=14",
      note: {
        title: "Sering salah",
        body: "Lupa me-reset skor negatif ke nol (max(0, ...)). Tanpa reset, minggu-minggu tenang yang panjang membuat skor sangat negatif — lalu wabah sungguhan butuh berminggu-minggu hanya untuk kembali ke nol. Reset adalah yang membuat CUSUM “lupa” masa tenang yang sudah lama berlalu.",
        type: "pitfall",
      },
      hints: [
        "Skor minggu ini = max(0, skor_lalu + (x - k)).",
        "Alarm bila skor > h; nomor minggu = indeks + 1.",
      ],
      code: {
        starter: `# Kasus DBD mingguan, 20 minggu — DATA SINTETIS untuk latihan\nkasus = [4,6,5,7,4,5,6,5,4,6,5,7,12,18,25,22,15,10,7,6]\nK, H = 7.0, 10.0  # nilai acuan dan ambang keputusan\n\n# TULIS KODEMU: CUSUM satu sisi\ndef cusum(xs, k, h):\n    \n\ns_akhir, minggu_alarm = cusum(kasus, K, H)\nprint(f"s_akhir={s_akhir:.1f}")\nprint(f"minggu_alarm={minggu_alarm}")\nprint(f"alarm_pertama={minggu_alarm[0] if minggu_alarm else None}")`,
        lockLines: 3,
        solution: `# Kasus DBD mingguan, 20 minggu — DATA SINTETIS untuk latihan\nkasus = [4,6,5,7,4,5,6,5,4,6,5,7,12,18,25,22,15,10,7,6]\nK, H = 7.0, 10.0  # nilai acuan dan ambang keputusan\n\n# TULIS KODEMU: CUSUM satu sisi\ndef cusum(xs, k, h):\n    s = 0.0\n    alarm = []\n    for i, x in enumerate(xs):\n        s = max(0.0, s + (x - k))\n        if s > h:\n            alarm.append(i + 1)\n    return s, alarm\n\ns_akhir, minggu_alarm = cusum(kasus, K, H)\nprint(f"s_akhir={s_akhir:.1f}")\nprint(f"minggu_alarm={minggu_alarm}")\nprint(f"alarm_pertama={minggu_alarm[0] if minggu_alarm else None}")`,
        checks: [
          { kind: "equal", task: "t1", name: "s_akhir", value: 59.0, tol: 0.05, label: "`s_akhir` = 59,0", msg: "Akumulasi 20 minggu dengan k=7: kecurigaan menumpuk selama wabah." },
          { kind: "stdout_matches", task: "t2", pattern: "alarm_pertama=14", label: "Alarm pertama di minggu 14", msg: "Skor melewati h=10 pada minggu ke-14 (kasus 18)." },
          { kind: "stdout_matches", task: "t2", pattern: "minggu_alarm=\\[14, 15, 16, 17, 18, 19, 20\\]", label: "Alarm bertahan selama wabah", msg: "Setelah melewati ambang, skor tetap di atasnya selama kasus tinggi." },
        ],
      },
      reference: "CUSUM: S_h = max(0, S_{h-1} + (x_h − k)). Alarm bila S_h > h.",
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
        "Surveilans = indikator (rutin) + event-based (sinyal cepat); alert = trade-off cepat vs false alarm.",
        "SIR: S→I→R; tiga tuas: turunkan β, naikkan γ, kecilkan S.",
        "R0 = potensi; Rt = realita untuk aksi; herd immunity = 1−1/R0.",
        "Model untuk skenario, bukan ramalan titik; pakai tanggal onset.",
        "Klaim keberhasilan butuh pembanding; spasial: fokus di hotspot.",
        "CUSUM/EWMA menangkap kenaikan pelan yang lolos ambang 2SD; nowcast keterlambatan lapor sebelum menyimpulkan.",
      ],
      next: { label: "HD17 — Ekonomi Kesehatan", href: "/v2/learn/hd17-ekonomi-kesehatan" },
      quiz: [
        {
          q: "Rt = 0,7 artinya…",
          options: [
            { text: "Tiap kasus menulari rata-rata 0,7 orang — wabah menyusut", why: "Benar: di bawah 1 = padam. Di atas 1 = tumbuh. Inilah angka aksi.", correct: true },
            { text: "Wabah tumbuh cepat", why: "Terbalik: tumbuh cepat butuh Rt jauh di atas 1." },
            { text: "70% populasi kebal", why: "Itu herd immunity, bukan Rt." },
            { text: "Tidak ada kasus", why: "Rt 0,7 masih berarti ada penularan — hanya menyusut." },
          ],
        },
        {
          q: "Campak R0 ~15. Cakupan imunisasi untuk herd immunity sekitar…",
          options: [
            { text: "93%+", why: "Benar: 1−1/15 ≈ 93%. Itulah kenapa target campak >95% — R0 tinggi = ambang tinggi.", correct: true },
            { text: "50%", why: "Itu untuk R0=2; campak jauh lebih menular." },
            { text: "20%", why: "Itu untuk R0≈1,25 — bukan campak." },
            { text: "100% pasti", why: "Ambangnya 93%+; 100% tidak diperlukan secara teori (tapi dikejar sebagai buffer)." },
          ],
        },
        {
          q: "Dalam SIR, intervensi masker/isolasi bekerja via…",
          options: [
            { text: "Menurunkan beta (laju penularan)", why: "Benar: β = kontak × peluang infeksi. Vaksinasi mengecilkan S; pengobatan cepat menaikkan γ.", correct: true },
            { text: "Menaikkan gamma", why: "Gamma = laju kesembuhan — dipengaruhi pengobatan, bukan masker." },
            { text: "Menambah N", why: "N adalah total populasi — tidak berubah oleh masker." },
            { text: "Menghapus R", why: "R adalah kompartemen kebal — tidak dihapus intervensi." },
          ],
        },
        {
          q: "Kasus turun setelah intervensi. Agar klaim “intervensi berhasil” valid, butuh…",
          options: [
            { text: "Pembanding: Rt sebelum vs sesudah / wilayah kontrol", why: "Benar: kurva turun sendiri saat S habis atau musim berganti. Tanpa kontrol = post hoc fallacy.", correct: true },
            { text: "Siaran pers", why: "Publisitas bukan bukti efektivitas." },
            { text: "Anggaran lebih", why: "Anggaran bukan pembanding kausal." },
            { text: "Tidak butuh apa-apa", why: "Butuh: penurunan alami dan musiman adalah penjelasan alternatif yang harus disingkirkan." },
          ],
        },
        {
          q: "Fogging merata satu kota saat hotspot hanya di 3 RW adalah…",
          options: [
            { text: "Boros + risiko resistensi — gunakan analisis spasial untuk fokus", why: "Benar: peta hotspot menghemat sumber daya dan mengurangi dampak lingkungan. Presisi > volume.", correct: true },
            { text: "Paling efektif", why: "Fogging massal = teater kesehatan: membunuh nyamuk dewasa hari itu, jentik menetas minggu depan." },
            { text: "Wajib regulasi", why: "Tidak ada kewajiban seperti itu; yang wajib adalah efektivitas." },
            { text: "Tidak ada alternatif", why: "Alternatifnya: PSN + fogging fokus radius 200m dari kasus." },
          ],
        },
      ],
    },
  ],
};
