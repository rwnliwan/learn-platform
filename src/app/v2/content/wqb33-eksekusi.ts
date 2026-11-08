import type { V2Lesson } from "../lib/types";

export const wqb33: V2Lesson = {
  slug: "wqb33-eksekusi",
  track: "WorldQuant Brain",
  module: "Operasi Alpha",
  title: "WQB33 — Eksekusi: VWAP, TWAP, Market Impact, dan Slippage",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Order beli 20.000 lembar — dan harga yang bergerak melawan pembelinya sendiri",
      prose: [
        "Sinyalmu berkata beli 20.000 lembar. Harga saat sinyal muncul: Rp100. Kamu mengeksekusi sekaligus — dan harga rata-rata yang kamu dapat adalah Rp100,77. Selisih 77 basis poin hilang sebelum posisi itu menghasilkan apa pun. Bukan karena sinyalnya salah, melainkan karena eksekusinya menabrak pasar.",
        "Setiap order besar membayar tiga tagihan: spread bid-ask, market impact — harganya bergerak karena ordermu sendiri — dan slippage — harga bergerak selama kamu mengeksekusi. Trader yang hanya mengukur sinyal tanpa mengukur eksekusi sedang mengukur separuh strategi: alpha di atas kertas dikurangi biaya eksekusi sama dengan alpha yang benar-benar bisa dibawa pulang.",
        "Setelah lesson ini kamu bisa: (1) menghitung VWAP dan TWAP serta memilih algoritma yang cocok dengan tujuanmu; (2) memodelkan market impact permanen dan temporer dari ukuran order dan partisipasi; (3) menghitung implementation shortfall terhadap harga kedatangan; (4) merancang jadwal eksekusi yang menyeimbangkan biaya impact dengan risiko harga bergerak selama eksekusi.",
      ],
      tasks: [],
      note: {
        title: "Alpha yang tidak bisa dieksekusi bukan alpha",
        body: "Di WorldQuant Brain, turnover dan fitness sudah memotong biaya secara kasar — tetapi di pasar nyata, eksekusilah yang menentukan. Strategi dengan Sharpe 2 dan biaya eksekusi 100 basis poin per putaran bisa kalah dari strategi Sharpe 1,2 dengan biaya 10 basis poin. Eksekusi adalah bagian dari alpha, bukan sesudahnya.",
      },
      reference: "Sinyal berkata apa yang dibeli. Eksekusi menentukan berapa harganya. Keduanya adalah strategi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengubah order besar menjadi jadwal eksekusi dan menghitung biayanya sebelum menekan tombol beli.",
        "(1) Menghitung VWAP dari harga dan volume per bar, dan TWAP sebagai rata-rata harga yang sama bobot;",
        "(2) Membandingkan jadwal VWAP dan TWAP — kapan mengikuti ritme pasar, kapan netral terhadap waktu;",
        "(3) Memodelkan market impact: permanen dari total ukuran order, temporer dari tingkat partisipasi;",
        "(4) Menghitung implementation shortfall terhadap harga kedatangan dan memutuskan apakah jadwal perlu dipecah lebih lama.",
      ],
      tasks: [],
    },
    {
      id: "vwap-twap",
      eyebrow: "Langkah 3 · Teori",
      title: "VWAP dan TWAP: dua cara membagi order",
      prose: [
        "VWAP (volume-weighted average price) adalah harga rata-rata yang dibobot volume: jumlah harga dikali volume tiap bar, dibagi total volume. Algoritma VWAP membagi order mengikuti profil volume pasar — banyak saat pasar ramai, sedikit saat sepi — sehingga harga eksekusimu mendekati harga rata-rata pasar hari itu. Ia cocok bila tujuanmu adalah tidak terlihat berbeda dari pasar.",
        "TWAP (time-weighted average price) membagi order sama rata per periode waktu — misal 4.000 lembar tiap jam selama 5 jam — tanpa peduli volume pasar. Ia cocok bila kamu tidak percaya pada profil volume hari itu, atau bila ordermu kecil terhadap volume pasar sehingga mengikuti volume tidak penting. Kelemahannya: di jam sepi, porsi yang sama bisa menjadi bagian besar dari volume jam itu — dan menggerakkan harga.",
        "Contoh di lab: 5 bar dengan harga 100, 100,5, 101, 100,8, 101,2 dan volume 10.000, 15.000, 12.000, 8.000, 20.000. VWAP-nya 100,7677; TWAP-nya 100,70. Jadwal VWAP untuk 20.000 lembar mengikuti volume: 3.077, 4.615, 3.692, 2.462, 6.154 lembar per bar. Jadwal TWAP: 4.000 lembar tiap bar. Keduanya menghasilkan harga rata-rata yang dekat — tetapi profil risikonya berbeda: VWAP menaruh porsi terbesar di bar terakhir yang paling ramai.",
      ],
      tasks: [],
      formula: String.raw`VWAP = \frac{\sum p_i v_i}{\sum v_i}, \quad TWAP = \frac{\sum p_i}{n}, \quad IS = \frac{p_{eksekusi} - p_{kedatangan}}{p_{kedatangan}}`,
      formulaNote: "p_i = harga bar ke-i; v_i = volume bar ke-i; n = jumlah bar. IS = implementation shortfall terhadap harga saat sinyal muncul (harga kedatangan).",
      reference: "VWAP mengikuti volume pasar; TWAP membagi rata waktu. Pilih berdasarkan apa yang ingin kamu tiru.",
    },
    {
      id: "impact-slippage",
      eyebrow: "Langkah 4 · Teori",
      title: "Market impact dan slippage: dua biaya yang berbeda",
      prose: [
        "Market impact permanen adalah perubahan harga yang menetap karena informasimu: pasar menyimpulkan ada pembeli besar dan menyesuaikan harga. Model sederhana lesson ini: 0,5 basis poin per 1.000 lembar — order 20.000 lembar memberi impact permanen 10 basis poin, apa pun jadwalnya. Ia tergantung total ukuran, bukan kecepatan.",
        "Market impact temporer adalah biaya karena kamu menuntut likuiditas sekarang: ia tergantung tingkat partisipasi — ordermu dibagi volume pasar. Model lesson ini: 0,8 basis poin per 1 persen partisipasi. Order 20.000 lembar terhadap volume harian 65.000 berarti partisipasi 30,77 persen — temporer 24,62 basis poin. Total impact model: 34,62 basis poin. Pecah order menjadi dua hari (10.000 per hari, partisipasi 15,38 persen) menurunkan temporer menjadi 12,31 basis poin dan total menjadi 22,31 basis poin.",
        "Slippage dan implementation shortfall (IS) adalah yang benar-benar terjadi: IS sama dengan harga eksekusi rata-rata dikurangi harga kedatangan, dibagi harga kedatangan. Di lab, eksekusi mengikuti VWAP memberi harga rata-rata 100,7677 terhadap harga kedatangan 100 — IS 76,77 basis poin, jauh di atas model 34,62 basis poin. Selisih itu adalah timing luck yang buruk: harga memang naik hari itu, di luar impact ordermu. Model memprediksi biaya yang kamu sebabkan; IS mengukur biaya yang kamu alami — keduanya harus dilaporkan berdampingan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menyalahkan algoritma eksekusi untuk seluruh implementation shortfall. IS terdiri dari impact yang kamu sebabkan ditambah pergerakan harga yang akan terjadi tanpa ordermu. Bila harga naik 50 basis poin karena berita, algoritma apa pun akan menunjukkan IS besar. Pisahkan keduanya sebelum menghakimi algoritma.",
      },
      reference: "Permanen dari ukuran total; temporer dari partisipasi. IS = impact + timing luck — laporkan keduanya.",
    },
    {
      id: "lab-eksekusi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: VWAP, shortfall, dan model impact",
      prose: [
        "Hitung eksekusi order beli 20.000 lembar dari 5 bar harga dan volume: harga 100, 100,5, 101, 100,8, 101,2; volume 10.000, 15.000, 12.000, 8.000, 20.000. Harga kedatangan 100. Model impact: permanen 0,5 basis poin per 1.000 lembar; temporer 0,8 basis poin per 1 persen partisipasi.",
        "Hitung di kepala dulu: VWAP = 6.549.900 dibagi 65.000 = 100,7677. Harga rata-rata eksekusi mengikuti VWAP sama dengan VWAP itu sendiri — 100,7677. IS = (100,7677 - 100) dibagi 100 = 76,77 basis poin. Partisipasi = 20.000 dibagi 65.000 = 30,77 persen; temporer = 0,8 × 30,77 = 24,62 basis poin; permanen = 0,5 × 20 = 10 basis poin; total model 34,62 basis poin.",
        "Perhatikan selisih antara IS 76,77 dan model 34,62 basis poin: 42,15 basis poin adalah pergerakan harga yang bukan disebabkan ordermu — timing luck. Setelah lolos, coba ubah order menjadi 10.000 lembar dan lihat partisipasi, temporer, dan total model berubah — sementara permanen ikut turun menjadi 5 basis poin.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `vwap`, `is_bps` (implementation shortfall dalam bps), dan `partisipasi_persen`" },
        { id: "t2", text: "Hitung `impact_model_bps` (permanen + temporer), lalu cetak semuanya" },
      ],
      expected: "vwap=100.77 is=76.77 bps partisipasi=30.77 persen impact_model=34.62 bps",
      hints: [
        "VWAP = jumlah (harga × volume) dibagi jumlah volume.",
        "IS bps = (vwap / harga_kedatangan - 1) × 10000.",
        "Partisipasi = order / total volume × 100; temporer = 0,8 × partisipasi.",
        "Permanen = 0,5 × (order / 1000); total model = permanen + temporer.",
      ],
      code: {
        starter: `# Eksekusi: beli 20000 lembar, harga kedatangan 100\nprices = [100.0, 100.5, 101.0, 100.8, 101.2]\nvolumes = [10000, 15000, 12000, 8000, 20000]\norder = 20000\nkedatangan = 100.0\n\n# TULIS KODEMU\nvwap = \nis_bps = \npartisipasi_persen = \n\n# TULIS KODEMU: model impact (permanen 0,5 bps per 1000 lembar;\n# temporer 0,8 bps per 1 persen partisipasi)\nimpact_model_bps = \n\nprint(f"vwap={vwap:.2f} is={is_bps:.2f} bps partisipasi={partisipasi_persen:.2f} persen impact_model={impact_model_bps:.2f} bps")`,
        lockLines: 4,
        solution: `# Eksekusi: beli 20000 lembar, harga kedatangan 100\nprices = [100.0, 100.5, 101.0, 100.8, 101.2]\nvolumes = [10000, 15000, 12000, 8000, 20000]\norder = 20000\nkedatangan = 100.0\n\n# TULIS KODEMU\nvwap = sum(p * v for p, v in zip(prices, volumes)) / sum(volumes)\nis_bps = (vwap / kedatangan - 1) * 10000\npartisipasi_persen = order / sum(volumes) * 100\n\n# TULIS KODEMU: model impact (permanen 0,5 bps per 1000 lembar;\n# temporer 0,8 bps per 1 persen partisipasi)\npermanen = 0.5 * (order / 1000)\ntemporer = 0.8 * partisipasi_persen\nimpact_model_bps = permanen + temporer\n\nprint(f"vwap={vwap:.2f} is={is_bps:.2f} bps partisipasi={partisipasi_persen:.2f} persen impact_model={impact_model_bps:.2f} bps")`,
        checks: [
          { kind: "equal", task: "t1", name: "vwap", value: 100.7677, tol: 0.01, label: "`vwap` ≈ 100,77", msg: "6.549.900 / 65.000 = 100,7677." },
          { kind: "equal", task: "t1", name: "is_bps", value: 76.77, tol: 0.1, label: "`is_bps` ≈ 76,77", msg: "(100,7677 / 100 - 1) × 10000 = 76,77 bps." },
          { kind: "equal", task: "t1", name: "partisipasi_persen", value: 30.77, tol: 0.01, label: "`partisipasi_persen` ≈ 30,77", msg: "20.000 / 65.000 = 30,77 persen — sangat agresif." },
          { kind: "equal", task: "t2", name: "impact_model_bps", value: 34.62, tol: 0.01, label: "`impact_model_bps` ≈ 34,62", msg: "Permanen 10 + temporer 24,62 = 34,62 bps." },
          { kind: "stdout_matches", task: "t2", pattern: "vwap=100\\.77 is=76\\.77 bps", label: "`print` menampilkan VWAP dan shortfall", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "VWAP 100,77; IS 76,77 bps; partisipasi 30,77 persen; model impact 34,62 bps — sisanya timing luck.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: pecah dua hari atau eksekusi hari ini?",
      prose: [
        "Partisipasi 30,77 persen terlalu agresif: temporer 24,62 basis poin. Alternatifnya: pecah order menjadi dua hari, 10.000 lembar per hari. Partisipasi per hari menjadi 15,38 persen; temporer menjadi 12,31 basis poin; permanen tetap 10 basis poin karena total order tidak berubah; total model menjadi 22,31 basis poin — hemat 12,31 basis poin dari 34,62.",
        "Tetapi penghematan itu punya harga: risiko semalam. Selama satu malam tambahan, harga bisa bergerak ke arah mana pun — bila sinyalmu benar dan harga naik 1 persen semalam, penghematan 12,31 basis poin berubah menjadi kerugian 100 basis poin pada separuh order. Inilah trade-off klasik Almgren-Chriss: eksekusi cepat membayar impact tinggi tetapi risiko harga rendah; eksekusi lambat membayar impact rendah tetapi risiko harga tinggi.",
        "Keputusan yang benar tergantung pada dua angka: seberapa besar impact yang dihemat, dan seberapa besar volatilitas harian sahamnya. Bila volatilitas harian 2 persen (200 basis poin), risiko semalam jauh lebih besar dari penghematan 12,31 basis poin — eksekusi hari ini, meski mahal. Bila volatilitas harian 0,3 persen (30 basis poin), penghematan impact sebanding dengan risikonya — pecah dua hari masuk akal. Aturan praktis: bandingkan penghematan impact dengan volatilitas harian, bukan dengan nol.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pecah dua hari: partisipasi 15,38 persen, temporer 12,31 bps, total model 22,31 bps — hemat 12,31 bps. Tetapi risiko semalam = volatilitas harian. Bila vol harian 200 bps, jangan pecah. Bila vol harian 30 bps, pecah masuk akal.",
      },
      reference: "Hemat 12,31 bps vs risiko semalam. Bandingkan dengan volatilitas harian — bukan dengan nol.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "VWAP mengikuti volume pasar; TWAP membagi rata waktu. Pilih berdasarkan apa yang ingin kamu tiru.",
        "Lab: VWAP 100,77; IS 76,77 bps; partisipasi 30,77 persen; model impact 34,62 bps.",
        "Permanen dari ukuran total order; temporer dari tingkat partisipasi.",
        "IS = impact yang kamu sebabkan + timing luck — pisahkan keduanya sebelum menghakimi algoritma.",
        "Trade-off Almgren-Chriss: cepat = impact tinggi, risiko harga rendah; lambat = impact rendah, risiko harga tinggi.",
      ],
      next: { label: "WQB34 — Strategi Akademik Bernama: Piotroski, PEAD, Accruals, BAB, Momentum Crash", href: "/v2/learn/wqb34-strategi-akademik-bernama" },
      quiz: [
        {
          q: "Order 20.000 lembar, volume harian 65.000. Berapa partisipasinya, dan apa artinya?",
          options: [
            { text: "3,08 persen — order kecil, tidak memengaruhi harga", why: "Salah: 20.000 / 65.000 = 30,77 persen, bukan 3,08 persen. Koma desimalnya salah tempat." },
            { text: "30,77 persen — sangat agresif; order ini hampir sepertiga dari seluruh volume harian", why: "Tepat: partisipasi di atas 20 persen umumnya dianggap agresif — temporer 24,62 bps adalah konsekuensinya.", correct: true },
            { text: "65 persen — order lebih besar dari volume pasar", why: "Salah: 65.000 adalah volume pasar, bukan persentase. Partisipasi = order dibagi volume." },
            { text: "100 persen — order menghabiskan seluruh likuiditas", why: "Salah: order 20.000 dari volume 65.000 adalah 30,77 persen — besar, tetapi bukan seluruhnya." },
          ],
        },
        {
          q: "IS 76,77 bps tetapi model impact hanya 34,62 bps. Apa penjelasan yang benar?",
          options: [
            { text: "Model impact salah hitung — harusnya sama dengan IS", why: "Salah: model dan IS mengukur hal yang berbeda. Model memprediksi biaya yang disebabkan order; IS mengukur biaya yang dialami termasuk pergerakan harga." },
            { text: "Selisih 42,15 bps adalah timing luck — harga memang naik hari itu di luar dampak ordermu", why: "Tepat: IS = impact + timing luck. Bila harga naik karena berita, algoritma apa pun akan menunjukkan IS besar.", correct: true },
            { text: "Algoritma VWAP gagal — harus diganti TWAP", why: "Salah: TWAP menghadapi pergerakan harga yang sama. Mengganti algoritma tidak menghapus timing luck." },
            { text: "Harga kedatangan salah — harusnya memakai harga penutupan", why: "Salah: harga kedatangan adalah harga saat sinyal muncul — itulah benchmark IS yang benar." },
          ],
        },
        {
          q: "Kapan TWAP lebih cocok daripada VWAP?",
          options: [
            { text: "Saat kamu ingin meniru harga rata-rata pasar hari itu", why: "Salah: itu tujuan VWAP — mengikuti profil volume pasar." },
            { text: "Saat kamu tidak percaya pada profil volume hari itu, atau ordermu kecil terhadap volume pasar", why: "Tepat: TWAP netral terhadap waktu dan tidak bergantung pada pola volume — cocok bila pola volume hari itu tidak bisa diandalkan.", correct: true },
            { text: "Saat ordermu lebih besar dari volume harian", why: "Salah: order sebesar itu tidak bisa diselesaikan satu hari dengan algoritma apa pun — ia harus dipecah berhari-hari." },
            { text: "Saat kamu ingin mengeksekusi secepat mungkin", why: "Salah: kecepatan bukan soal VWAP vs TWAP — keduanya bisa dipercepat atau diperlambat. Soal ini adalah soal mengikuti volume atau waktu." },
          ],
        },
        {
          q: "Pecah order dua hari menghemat impact 12,31 bps. Kapan penghematan ini TIDAK layak diambil?",
          options: [
            { text: "Saat volatilitas harian jauh lebih besar dari penghematan — risiko semalam memakan penghematan impact", why: "Tepat: bila vol harian 200 bps, risiko semalam 200 bps vs hemat 12,31 bps — eksekusi hari ini lebih murah secara risiko.", correct: true },
            { text: "Saat partisipasi sudah di bawah 5 persen", why: "Salah: partisipasi rendah berarti impact sudah kecil — tetapi itu bukan alasan penghematan tidak layak; justru jadwal lambat makin murah." },
            { text: "Saat harga kedatangan sama dengan VWAP", why: "Salah: kesamaan harga kedatangan dan VWAP tidak ada hubungannya dengan keputusan memecah jadwal." },
            { text: "Tidak pernah — menghemat impact selalu layak", why: "Salah: penghematan impact selalu punya harga berupa risiko harga selama eksekusi. Keduanya harus dibandingkan." },
          ],
        },
        {
          q: "Market impact permanen 10 bps untuk order 20.000 lembar. Bila order dipecah dua hari, berapa permanennya?",
          options: [
            { text: "5 bps — terbagi dua seperti temporer", why: "Salah: permanen tergantung total ukuran order, bukan kecepatan. Total order tetap 20.000 lembar." },
            { text: "10 bps — permanen tergantung total ukuran, bukan jadwal", why: "Tepat: pasar menyesuaikan harga karena ada pembeli besar — penyesuaian itu tidak berkurang karena kamu membagi jadwal.", correct: true },
            { text: "20 bps — dua hari berarti dua kali impact", why: "Salah: permanen tidak digandakan oleh jumlah hari. Ia adalah penyesuaian harga terhadap informasi total order." },
            { text: "0 bps — impact permanen hanya ada bila eksekusi sekaligus", why: "Salah: impact permanen ada selama pasar mengetahui ada pembeli besar, apa pun jadwalnya." },
          ],
        },
      ],
    },
  ],
};
