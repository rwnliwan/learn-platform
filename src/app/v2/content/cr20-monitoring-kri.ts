import type { V2Lesson } from "../lib/types";

export const cr20: V2Lesson = {
  slug: "cr20-monitoring-kri",
  track: "Credit Risk",
  module: "Validasi & Monitoring",
  title: "CR20 — Monitoring & KRI",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lampu oli yang diabaikan",
      prose: [
        "Suatu hari, lampu tekanan oli menyala merah. Co-pilot melihat, tetapi berkata: \"Ah, sensornya mungkin rusak. Lanjutkan.\" Tiga puluh menit kemudian: mesin mati.",
        "Bank Nusantara, 2025. Dashboard risiko menunjukkan cost of risk 2,1% — di atas appetite 1,5% — selama dua kuartal. Analis junior melaporkannya. Atasannya: \"NPL masih 2,8%, aman. Mungkin cuma musiman.\" Dua kuartal kemudian: NPL melonjak ke 4,5%, CKPN meledak Rp 600 miliar.",
        "Masalahnya bukan tidak ada data — melainkan tidak ada yang bertindak atas lampu merah. Lesson ini tentang membangun dashboard yang tidak bisa diabaikan: KRI yang tepat, ambang yang jelas, dan eskalasi yang otomatis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Appetite bukan ramalan — melainkan janji. Risk appetite adalah janji direksi kepada komisaris dan OJK: \"inilah batas risiko yang kami berani ambil.\" Melanggar appetite bukan sekadar \"angka merah\" — melainkan pelanggaran janji yang wajib dijelaskan dan diperbaiki. Pelanggaran appetite 2 kuartal = eskalasi wajib ke komite risiko dengan action plan.",
      },
      reference: "\"Mungkin musiman\" bukan action plan.",
    },
    {
      id: "lima-kri",
      eyebrow: "Langkah 2 · Lima KRI",
      title: "Tanda vital bank",
      prose: [
        "KRI (Key Risk Indicator) = metrik yang dipantau berkala untuk mendeteksi perubahan profil risiko. Lima yang wajib ada di dashboard kredit: NPL gross — % kredit macet (kolek 3–5), ambang OJK <5%; NPL net — setelah dikurangi CKPN, mengukur eksposur bersih; coverage ratio — CKPN/NPL, mengukur ketebalan bantal; cost of risk (CoR) — beban CKPN tahunan / total kredit, mengukur \"harga\" risiko per tahun; DPK (Kolek 2) — % dalam perhatian khusus, indikator awal (leading).",
        "Lima KRI seperti lima tanda vital pasien — tensi, nadi, suhu, saturasi, pernapasan. Dokter tidak mendiagnosis dari satu tanda; ia membaca kombinasinya. NPL normal + CoR tinggi = demam yang belum terlihat di termometer.",
        "Contoh: NPL gross 2,8% (aman, <5%) + coverage 68% (tebal) = terlihat sehat. Tetapi CoR 1,4% mendekati appetite 1,5% — lampu kuning. Kombinasi \"NPL rendah + CoR naik\" = bank sedang mencadangkan agresif (mungkin antisipasi) ATAU kualitas memburuk tetapi belum jadi NPL. Selidiki — jangan rayakan dulu.",
      ],
      formula: String.raw`\text{CoR} = \frac{\text{Beban CKPN tahunan}}{\text{Total kredit}} \times 100\%`,
      formulaNote: "CoR 1,4% = dari tiap Rp 100 kredit, Rp 1,4 menjadi beban cadangan tahun ini.",
      tasks: [],
      reference: "CoR langsung menggerus laba: CoR naik 0,5 poin di portofolio Rp 50 T = Rp 250 miliar laba hilang.",
    },
    {
      id: "lab-kri",
      eyebrow: "Langkah 3 · Lab KRI",
      title: "Dari angka mentah ke dashboard",
      prose: [
        "Data Bank Nusantara (Rp Miliar) terkunci: total kredit 50.000, kolek 3-5 = 1.400, CKPN 950, beban CKPN kuartal 175, laba sebelum CKPN 900. Tugasmu: hitung lima KRI.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `npl_gross` dan `npl_net` (%)" },
        { id: "t2", text: "Hitung `coverage` dan `cor` (%)" },
        { id: "t3", text: "Hitung `laba_bersih`, lalu `print` semuanya" },
      ],
      expected: "NPL=2.80 net=0.90 cov=67.9 CoR=1.40 laba=725",
      hints: [
        "npl_gross = kolek_345 / total_kredit * 100.",
        "coverage = ckpn / kolek_345 * 100.",
        "cor = beban_ckpn_kuartal * 4 / total_kredit * 100.",
      ],
      code: {
        starter: `total_kredit = 50000\nkolek_345 = 1400\nckpn = 950\nbeban_ckpn_kuartal = 175\nlaba_sebelum_ckpn = 900\n\n# TULIS KODEMU\nnpl_gross = \nnpl_net = \ncoverage = \ncor = \nlaba_bersih = \n\nprint(f"NPL={npl_gross:.2f} net={npl_net:.2f} cov={coverage:.1f} CoR={cor:.2f} laba={laba_bersih}")`,
        lockLines: 5,
        solution: `total_kredit = 50000\nkolek_345 = 1400\nckpn = 950\nbeban_ckpn_kuartal = 175\nlaba_sebelum_ckpn = 900\n\n# TULIS KODEMU\nnpl_gross = kolek_345 / total_kredit * 100\nnpl_net = (kolek_345 - ckpn) / total_kredit * 100\ncoverage = ckpn / kolek_345 * 100\ncor = beban_ckpn_kuartal * 4 / total_kredit * 100\nlaba_bersih = laba_sebelum_ckpn - beban_ckpn_kuartal\n\nprint(f"NPL={npl_gross:.2f} net={npl_net:.2f} cov={coverage:.1f} CoR={cor:.2f} laba={laba_bersih}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl_gross", value: 2.8, tol: 1e-9, label: "`npl_gross` seharusnya 2.80", msg: "1400 / 50000 × 100 = 2.80." },
          { kind: "equal", task: "t1", name: "npl_net", value: 0.9, tol: 1e-9, label: "`npl_net` seharusnya 0.90", msg: "(1400−950) / 50000 × 100 = 0.90." },
          { kind: "equal", task: "t2", name: "coverage", value: 67.9, tol: 0.1, label: "`coverage` seharusnya 67.9", msg: "950 / 1400 × 100 = 67.9 — tebal." },
          { kind: "equal", task: "t2", name: "cor", value: 1.4, tol: 1e-9, label: "`cor` seharusnya 1.40", msg: "175×4 / 50000 × 100 = 1.40 — mendekati appetite 1.5!" },
          { kind: "equal", task: "t3", name: "laba_bersih", value: 725, tol: 1e-9, label: "`laba_bersih` seharusnya 725", msg: "900 − 175 = 725 — CKPN memakan 19% laba." },
          { kind: "stdout_matches", task: "t3", pattern: "NPL=2\\.80\\s+net=0\\.90\\s+cov=67\\.9\\s+CoR=1\\.40\\s+laba=725", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Beban CKPN Rp 700 M, rata-rata total kredit Rp 50 T → CoR = 1,4%.",
    },
    {
      id: "leading-lagging",
      eyebrow: "Langkah 4 · Leading",
      title: "Kaca depan vs kaca spion",
      prose: [
        "Lima KRI terbagi dua keluarga: lagging (NPL gross/net, coverage — menceritakan masa lalu) dan leading (DPK/Kolek 2, CoR — menceritakan masa depan). Analis yang hanya memonitor NPL seperti sopir yang hanya melihat kaca spion — ia tahu ke mana mobil telah pergi, bukan ke mana ia akan pergi.",
        "DPK yang menggelembung adalah kaca depan: ia menunjukkan NPL 6 bulan ke depan. CoR yang merangkak naik menunjukkan laba 2 kuartal ke depan. Dashboard yang baik selalu punya keduanya — spion untuk akuntabilitas, kaca depan untuk aksi.",
        "NPL stabil 2,8% tetapi DPK naik 5,8%→7,5% dan CoR melanggar appetite: waspada — leading indicator memburuk, NPL (lagging) akan menyusul 1–2 kuartal lagi; eskalasi sekarang. Atau evergreening yang disembunyikan — selidiki!",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"NPL rendah = risiko terkendali.\" NPL adalah lagging indicator (mencerminkan masa lalu). CoR dan DPK adalah leading indicator (mencerminkan masa depan). Bank bisa punya NPL 2% (cantik) sementara CoR 2,5% (berdarah) — karena sedang mencadangkan untuk masalah yang akan jadi NPL. Pantau keduanya.",
      },
      reference: "NPL 2,8% (rendah) tetapi CoR 2,3% (2× industri) = waspada: baca CoR + DPK + write-off.",
    },
    {
      id: "dashboard",
      eyebrow: "Langkah 5 · Dashboard",
      title: "Dari angka ke keputusan",
      prose: [
        "Prinsip dashboard yang baik: traffic light — hijau/kuning/merah vs appetite (otak memproses warna 60.000× lebih cepat dari angka); tren, bukan titik — 6–8 kuartal ke belakang (satu titik = tidak ada cerita); drill-down — klik NPL → per segmen → per vintage → per cabang (masalah selalu bersembunyi di detail); eskalasi otomatis — lampu merah 2 periode = wajib dibahas komite (bukan \"nanti\").",
        "Contoh segmen: kartu kredit merah di NPL (9,5%) tetapi hijau di coverage (80%) — berisiko tetapi dicadangkan tebal. KTA merah di NPL (5,2%) + DPK tinggi (10,1%) + coverage rendah (55%) — triple merah: segmen paling berbahaya. Prioritas langsung terlihat tanpa membaca 50 halaman laporan.",
        "Dashboard terbaik menjawab tiga pertanyaan dalam 30 detik: (1) apa yang merah? (2) trennya ke mana? (3) siapa yang bertanggung jawab menindaklanjuti? Jika butuh 30 menit menjelaskan dashboard, dashboardnya gagal — bukan audiensnya.",
      ],
      tasks: [],
      reference: "Dashboard ideal untuk direksi: 3 pertanyaan dalam 30 detik + tren + drill-down + eskalasi otomatis.",
    },
    {
      id: "lab-traffic",
      eyebrow: "Langkah 6 · Lab Traffic Light",
      title: "Otomatisasi penilaian",
      prose: [
        "Aturan terkunci: hijau < appetite; kuning 1–1,2× appetite; merah >1,2× appetite (untuk coverage dibalik: hijau ≥ appetite). Lima KRI terkunci: NPL gross 2,8 (app 5,0); CoR 2,1 (app 1,5); coverage 68 (app 60); DPK 6,2 (app 8,0); konsentrasi sektor 22 (app 20). Tugasmu: hitung jumlah lampu merah dan putuskan eskalasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_merah` dari `kris`" },
        { id: "t2", text: "Tentukan `eskalasi` (True jika n_merah > 0)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "merah=1 eskalasi=True",
      hints: [
        "Status tiap KRI adalah elemen ke-4 tuple.",
        "n_merah = sum(1 for _, _, _, st in kris if st == 'MERAH').",
        "CoR 2,1 > 1,5×1,2 = 1,8 → merah.",
      ],
      code: {
        starter: `def traffic_light(nama, nilai, appetite, lebih_kecil_bagus=True):\n    if lebih_kecil_bagus:\n        if nilai <= appetite: status = "HIJAU"\n        elif nilai <= appetite*1.2: status = "KUNING"\n        else: status = "MERAH"\n    else:\n        if nilai >= appetite: status = "HIJAU"\n        elif nilai >= appetite*0.8: status = "KUNING"\n        else: status = "MERAH"\n    return nama, nilai, appetite, status\n\nkris = [\n    traffic_light("NPL gross (%)", 2.8, 5.0),\n    traffic_light("Cost of risk (%)", 2.1, 1.5),\n    traffic_light("Coverage (%)", 68, 60, lebih_kecil_bagus=False),\n    traffic_light("DPK (%)", 6.2, 8.0),\n    traffic_light("Konsentrasi sektor (%)", 22, 20),\n]\n\n# TULIS KODEMU\nn_merah = \neskalasi = \n\nprint(f"merah={n_merah} eskalasi={eskalasi}")`,
        lockLines: 16,
        solution: `def traffic_light(nama, nilai, appetite, lebih_kecil_bagus=True):\n    if lebih_kecil_bagus:\n        if nilai <= appetite: status = "HIJAU"\n        elif nilai <= appetite*1.2: status = "KUNING"\n        else: status = "MERAH"\n    else:\n        if nilai >= appetite: status = "HIJAU"\n        elif nilai >= appetite*0.8: status = "KUNING"\n        else: status = "MERAH"\n    return nama, nilai, appetite, status\n\nkris = [\n    traffic_light("NPL gross (%)", 2.8, 5.0),\n    traffic_light("Cost of risk (%)", 2.1, 1.5),\n    traffic_light("Coverage (%)", 68, 60, lebih_kecil_bagus=False),\n    traffic_light("DPK (%)", 6.2, 8.0),\n    traffic_light("Konsentrasi sektor (%)", 22, 20),\n]\n\n# TULIS KODEMU\nn_merah = sum(1 for _, _, _, st in kris if st == "MERAH")\neskalasi = n_merah > 0\n\nprint(f"merah={n_merah} eskalasi={eskalasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_merah", value: 1, label: "`n_merah` seharusnya 1", msg: "Hanya CoR yang merah (2,1 > 1,8). Konsentrasi 22 = kuning." },
          { kind: "equal", task: "t2", name: "eskalasi", value: true, label: "`eskalasi` seharusnya True", msg: "1 lampu merah → ESKALASI KE KOMITE." },
          { kind: "stdout_matches", task: "t3", pattern: "merah=1\\s+eskalasi=True", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Lampu merah 2 periode = wajib dibahas komite. Appetite adalah janji, bukan hiasan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: membaca dashboard",
      prose: [
        "Skenario 1 — NPL naik kuartalan. → Jangan baca NPL sendirian: bedah 5 KRI bersama — CoR (harga risiko), coverage (ketebalan bantal), write-off (apakah NPL 'dibersihkan'?), DPK (arus masalah baru). Contoh nyata: NPL 2,8% terlihat sehat, tetapi CoR 2,3% (2× industri) + write-off 4× lipat + DPK naik 5%→8% = bank berdarah di balik dashboard hijau.",
        "Skenario 2 — Leading memburuk (DPK naik, CoR melanggar appetite) tetapi lagging tenang (NPL stabil). → Eskalasi SEKARANG: seperti sopir yang melihat kaca depan — NPL (kaca spion) akan menyusul 1–2 kuartal lagi. Atau selidiki evergreening yang disembunyikan.",
        "Skenario 3 — Lampu merah menyala 2 periode. → Wajib dibahas komite — eskalasi otomatis, bukan 'nanti'. Dashboard yang lampunya bisa diabaikan dengan kalimat 'mungkin cuma musiman' = lampu oli yang diabaikan co-pilot.",
        "Skenario 4 — Satu segmen triple merah (NPL tinggi + DPK tinggi + coverage rendah). → Prioritas #1. Contoh nyata: KTA merah di NPL 5,2% + DPK 10,1% + coverage 55% — segmen paling berbahaya, terlihat tanpa membaca 50 halaman laporan.",
        "Skenario 5 — BPR/tim kecil tanpa sumber daya dashboard 50 KRI. → Pilih 3 KRI yang paling awal berbunyi untuk model bisnismu. Contoh nyata: BPR Rp 800 M selamat karena memantau roll rate Kolek 1→2 (18% → 31% dalam 4 bulan) — PAR 30 masih 'aman' 3,2% saat masalahnya sudah berjalan.",
        "Aturan praktis 10 detik: baca kombinasi seperti tanda vital (tensi+nadi+suhu — bukan satu angka), lihat tren 6–8 kuartal (bukan titik), dan pastikan lampu merah memicu tindakan — dashboard terbaik menjawab 'apa yang merah, trennya ke mana, siapa menindaklanjuti' dalam 30 detik.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "'NPL 2,8% — di bawah rata-rata industri 3,1%. Kinerja risiko sangat baik.' — cherry-picking satu angka sementara CoR 2× lipat industri, write-off Rp 1,2 T (4× tahun lalu), dan bantal coverage menipis 75% → 55%. Analis yang jujur tidak membiarkan satu angka cantik menutupi empat angka yang berdarah.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dashboard hijau, bank berdarah",
      prose: [
        "Laporan tahunan Bank Nusantara: \"NPL 2,8% — di bawah rata-rata industri 3,1%. Kinerja risiko sangat baik.\" Kamu diminta second opinion. Temuanmu: CoR 2,3% (industri 1,2%) — hampir 2× lipat!; write-off tahun ini Rp 1,2 T (tahun lalu Rp 300 M) — NPL \"dibersihkan\" agresif; DPK naik 5% → 8% dalam setahun; coverage turun 75% → 55% (CKPN dipakai untuk write-off).",
        "Tidak valid — cherry-picking NPL. Tiga poin: (1) NPL cantik karena write-off, bukan karena debitur sembuh: Rp 1,2 T dibersihkan (4× tahun lalu). NPL gross \"asli\" (tanpa write-off) ≈ 5%+. (2) CoR 2,3% vs industri 1,2% — bank membayar 2× lipat \"harga risiko\" dibanding peers. Laba tergerus diam-diam. (3) DPK naik + coverage turun — masalah masa depan membesar sementara bantal menipis. Kombinasi terburuk.",
        "Kesimpulan: dashboard yang hanya menampilkan NPL = cermin menipu. Lima KRI harus dibaca bersama — dan analis yang jujur tidak membiarkan satu metrik cantik menutupi empat yang berdarah.",
      ],
      tasks: [],
      reference: "Pekerjaanmu sebagai analis adalah memastikan angkanya JUJUR.",
    },
    {
      id: "pendalaman-tindakan",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Dari dashboard ke tindakan",
      prose: [
        "Contoh terapan kedua — dari BPR di Jawa Tengah yang hampir tidak punya tim risiko. Portofolio Rp 800 miliar, 90% kredit mikro ke pedagang pasar. Mereka tidak mampu membangun dashboard 50 KRI — jadi mereka memilih 3: PAR 30 (portfolio at risk >30 hari — versi mikro dari NPL), roll rate (persentase Kolek 1 yang \"bergulir\" menjadi Kolek 2 tiap bulan), dan pertumbuhan kredit per AO (account officer). Angka yang menyelamatkan mereka: roll rate Kolek 1→2 naik dari 18% ke 31% dalam 4 bulan — padahal PAR 30 masih \"aman\" di 3,2%. Investigasi: dua AO mengejar target dengan menyalurkan ke pedagang yang sama berulang-ulang (konsentrasi debitur tersembunyi). Tindakan: bekukan penyaluran dua AO, audit portofolionya. Pelajarannya: KRI yang tepat untuk BPR bukan yang paling canggih — melainkan yang paling awal berbunyi untuk masalah yang paling mungkin terjadi di model bisnisnya. Tiga KRI yang dibaca tiap minggu mengalahkan 50 KRI yang dibaca tiap kuartal.",
        "Kontras cara salah vs benar membangun traffic light. Cara salah: threshold ditentukan agar \"tidak terlalu banyak merah\" — appetite CoR ditetapkan 2,5% karena realisasinya 2,3% (\"biar hijau\"). Ini seperti memajukan garis finish agar terlihat menang. Cara benar: appetite diturunkan DARI strategi — \"kita bank konservatif, CoR appetite 1,5%\" — lalu biarkan lampunya merah dan hadapi masalahnya. Contoh nyata: bank yang appetite-nya 1,5% dengan realisasi 2,1% (merah, tetapi jujur) vs bank yang appetite-nya 2,5% dengan realisasi 2,3% (hijau, tetapi menipu diri). Setahun kemudian bank pertama memperbaiki underwriting dan CoR turun ke 1,4%; bank kedua \"hijau\" terus sampai NPL meledak. Lampu hijau yang didapat dengan menggeser ambang adalah lampu yang dimatikan — dan dashboard yang tidak pernah merah adalah dashboard yang rusak.",
        "Mode kegagalan nyata: waterbed effect (efek kasur air) — menekan NPL di satu tempat membuatnya menyembul di tempat lain. Bank Nusantara menekan NPL KTA dengan write-off agresif Rp 1,2 T — NPL turun 4,5% → 2,8%, direksi puas. Tetapi: (1) CKPN terkuras → coverage 75% → 55%; (2) tim collection dialihkan ke \"pembersihan\" → DPK naik 5% → 8% (tidak ada yang menjaga pintu masuk); (3) untuk \"mengganti\" portofolio yang di-write-off, tim bisnis menyalurkan KTA baru agresif ke segmen berisiko — vintage baru roll rate-nya 2× vintage lama. Setahun kemudian NPL kembali 4,2% dengan coverage lebih tipis dan CKPN lebih kecil. Menekan satu metrik tanpa melihat sistem = memencet kasur air. Pertahanan: setiap target perbaikan SATU KRI wajib disertai \"metrik penjaga\" yang tidak boleh memburuk (target: NPL turun; penjaga: coverage ≥60%, DPK ≤6%, roll rate vintage baru ≤ baseline). Tidak ada perbaikan yang gratis — pastikan harganya terlihat.",
        "Pendalaman sub-topik yang selama ini hanya disebut sekilas: vintage analysis. NPL agregat mencampur kredit yang dicairkan tahun 2022 (matang, polanya jelas) dengan yang dicairkan 2025 (masih bayi). Vintage analysis memisahkan per \"angkatan pencairan\" dan menggambar kurva default per umur kredit. Contoh: vintage 2023 KTA — default kumulatif bulan ke-6: 1,2%; bulan ke-12: 3,1%; bulan ke-18: 4,0% (mendatar). Vintage 2024 — bulan ke-6: 2,1% (sudah di atas 2023!); bulan ke-12: 5,2%. Kesimpulan: underwriting 2024 lebih longgar — masalahnya di ORIGINATION, bukan di ekonomi. Tanpa vintage, analis hanya melihat \"NPL naik\" dan menebak-nebak. Dengan vintage, ia tahu persis angkatan mana yang rusak dan siapa yang menyalurkannya. Aturan: setiap kenaikan NPL >0,5 poin wajib dibedah per vintage sebelum menyimpulkan apapun. NPL agregat adalah rata-rata yang menyembunyikan pelaku.",
        "Aturan keputusan monitoring untuk kepala risiko. Satu: dashboard direksi maksimal 8 KRI — lebih dari itu tidak dibaca (pilih yang leading + yang paling mahal jika salah). Dua: setiap KRI merah 2 periode = eskalasi otomatis ke komite dengan action plan tertulis — tanpa pengecualian \"mungkin musiman\". Tiga: setiap target perbaikan satu KRI wajib punya 2–3 metrik penjaga anti-waterbed. Empat: kenaikan NPL >0,5 poin = bedah vintage dulu, kesimpulan kemudian. Lima: appetite direview tahunan DARI strategi (bukan dari realisasi) — appetite yang digeser mengikuti realisasi adalah janji yang ditulis ulang setelah dilanggar. Lima aturan ini mengubah monitoring dari \"laporan bulanan\" menjadi \"sistem peringatan yang bekerja\".",
        "Pendalaman leading indicator yang jarang diajarkan: migration matrix (matriks migrasi kolektibilitas). Bukan sekadar \"DPK 6,2%\", melainkan: dari Rp 100 miliar Kolek 1 bulan lalu, berapa yang bulan ini naik ke Kolek 2 (memburuk), turun ke Lancar (sembuh), atau bertahan? Contoh matriks Bank Nusantara (Rp M): dari Kolek 1 (1.000): 700 → Lancar, 180 bertahan, 120 → Kolek 2 (roll rate 12%). Dari Kolek 2 (500): 150 → Kolek 1 (sembuh), 200 bertahan, 150 → Kolek 3 (roll rate 30%). Dua angka ini — 12% dan 30% — adalah \"kecepatan\" menuju NPL. Jika roll rate Kolek 1→2 naik 12% → 20% sementara DPK total masih stabil, NPL 2 kuartal ke depan SUDAH bisa diproyeksikan naik — tanpa menunggu. Migration matrix mengubah DPK dari foto menjadi film: bukan \"berapa yang di ruang tunggu\", melainkan \"seberapa cepat mereka berjalan ke ruang operasi\". Bank yang hanya membaca level DPK seperti membaca jumlah antrean tanpa melihat kecepatannya.",
        "Disiplin respons yang membedakan bank sehat: setiap KRI merah wajib dijawab dengan \"5 whys\" tertulis dalam 14 hari. Contoh: CoR merah 2,1% vs appetite 1,5%. Why 1: kenapa? Beban CKPN naik Rp 175 M/kuartal. Why 2: kenapa? NPL KTA naik. Why 3: kenapa? Vintage 2024 roll rate 2× normal. Why 4: kenapa? Tiga AO menyalurkan ke segmen yang sama tanpa verifikasi ganda. Why 5: kenapa? Insentif AO 100% berbasis volume tanpa komponen kualitas. Akar masalah: desain insentif — bukan \"ekonomi sulit\". Tanpa 5 whys, responsnya berhenti di why 2 (\"tambah CKPN\") dan masalah berulang tiap tahun. Aturan: laporan eskalasi KRI yang tidak mencantumkan why-ke-5 (akar masalah) = ditolak komite, kembalikan. Komite tidak butuh tahu angkanya merah — ia butuh tahu rantai sebabnya dan siapa yang memperbaikinya kapan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: dashboard yang tidak pernah merah = dashboard yang rusak",
        body: "Risiko yang sesungguhnya selalu bergerak — ekonomi berubah, debitur berubah, tim bisnis berubah. Maka dashboard risiko yang sehat PASTI kadang merah; merah adalah bukti sensornya bekerja. Heuristiknya terbalik dari intuisi awam: jika dashboardmu hijau semua selama 4 kuartal berturut-turut, jangan rayakan — audit dashboardnya. Kemungkinan besar: threshold-nya digeser mengikuti realisasi, datanya basi, atau metriknya salah pilih (mengukur yang mudah, bukan yang penting). Analogi medisnya: pasien yang tensinya selalu \"normal\" di semua pemeriksaan tetapi pingsan di rumah — tensimeternya yang rusak, bukan pasiennya yang sehat. Maka satu KRI untuk KRI itu sendiri: hitung \"alert rate\" dashboardmu — berapa % KRI yang pernah kuning/merah dalam setahun. Target sehat: 15–30%. Di bawah 10% = sensor mati; di atas 50% = threshold terlalu ketat (alert fatigue). Dashboard adalah instrumen, dan instrumen butuh kalibrasi — termasuk kalibrasi keberaniannya untuk berwarna merah. Satu praktik penutup: tiap kuartal, pilih satu KRI yang \"terlalu hijau\" dan tantang datanya — telusuri sampai ke sumber transaksi. Tiga dari empat kali kamu akan menemukan sesuatu: definisi yang bergeser, data yang basi, atau segmen yang disembunyikan agregat. Hijau yang tidak pernah ditantang adalah hijau yang tidak bisa dipercaya.",
      },
      reference: "Setiap KRI merah = 5 whys tertulis dalam 14 hari + metrik penjaga anti-waterbed.",
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
        "Lima KRI: NPL gross, NPL net, coverage, CoR, DPK — baca kombinasinya.",
        "CoR = beban CKPN tahunan / total kredit — KRI yang paling \"terasa\" di laba.",
        "Leading (DPK, CoR) vs lagging (NPL, coverage) — baca kaca depan, bukan cuma spion.",
        "Dashboard: traffic light + tren + drill-down + eskalasi otomatis.",
        "Appetite = janji direksi ke komisaris/OJK — pelanggaran 2 periode = eskalasi wajib.",
      ],
      next: { label: "CR21 — Pricing Risiko", href: "/learn/cr21-pricing-risiko" },
      quiz: [
        {
          q: "Beban CKPN tahunan Rp 700 M, rata-rata total kredit Rp 50 T. Cost of risk?",
          options: [
            { text: "1,4%", why: "700/50.000 = 1,4%. Tiap Rp 100 kredit 'dimakan' Rp 1,4 cadangan per tahun.", correct: true },
            { text: "0,7%", why: "Jangan lupa bebannya tahunan penuh." },
            { text: "14%", why: "Kelebihan satu nol — bagi lagi dengan 100." },
            { text: "7%", why: "Bukan." },
          ],
        },
        {
          q: "NPL 2,8% (rendah) tetapi CoR 2,3% (tinggi, 2× industri). Interpretasi?",
          options: [
            { text: "Bank sehat — NPL rendah", why: "NPL bisa 'dibersihkan' via write-off." },
            { text: "Waspada: bank mencadangkan agresif untuk masalah yang belum jadi NPL (atau write-off besar membersihkan NPL) — baca CoR + DPK + write-off", why: "NPL lagging bisa 'dibersihkan'; CoR leading menunjukkan harga sebenarnya.", correct: true },
            { text: "CoR tidak penting", why: "CoR paling terasa di laba." },
            { text: "Pasti salah hitung", why: "Kombinasi ini nyata dan berbahaya." },
          ],
        },
        {
          q: "KRI mana yang merupakan LEADING indicator?",
          options: [
            { text: "NPL gross", why: "NPL = lagging." },
            { text: "DPK (Kolek 2) & Cost of Risk — mencerminkan masalah masa depan sebelum jadi NPL", why: "DPK = ruang tunggu NPL; CoR = harga antisipasi.", correct: true },
            { text: "Coverage ratio", why: "Coverage = lagging." },
            { text: "Tidak ada", why: "Ada — DPK dan CoR." },
          ],
        },
        {
          q: "CoR menembus appetite 2 kuartal berturut-turut. Tindakan governance yang benar?",
          options: [
            { text: "Tunggu kuartal ketiga — mungkin musiman", why: "'Mungkin musiman' bukan respons governance." },
            { text: "Eskalasi wajib ke komite risiko dengan bedah sebab + proyeksi dampak + action plan", why: "Pelanggaran 2 periode = eskalasi wajib.", correct: true },
            { text: "Ubah appetite agar tidak merah", why: "Itu memanipulasi ambang!" },
            { text: "Sembunyikan dari laporan", why: "Pelanggaran integritas." },
          ],
        },
        {
          q: "Mengapa risk appetite yang dilanggar 2 periode berturut-turut wajib dieskalasi ke komite (bukan 'nanti')?",
          options: [
            { text: "Formalitas saja", why: "Bukan formalitas." },
            { text: "Appetite adalah janji direksi ke komisaris/OJK — pelanggaran berulang tanpa aksi = janji dilanggar; eskalasi memaksa keputusan (aksi korektif atau revisi appetite resmi)", why: "Eskalasi otomatis mencegah 'nanti' yang tidak pernah datang.", correct: true },
            { text: "Agar rapat ada bahasan", why: "Bukan." },
            { text: "OJK menghitung jumlah rapat", why: "Bukan itu alasannya." },
          ],
        },
      ],
    },
  ],
};
