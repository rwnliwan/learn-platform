import type { V2Lesson } from "../lib/types";

export const pmc13: V2Lesson = {
  slug: "pm-c13-manager-selection",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C13 — Manager Selection dan Due Diligence Manajer Investasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga finalis, satu kursi — dan yang paling bersinar ternyata paling rapuh",
      prose: [
        "Komite Dana Pensiun Nusantara harus memilih satu manajer saham dari tiga finalis. Finalis A, si Bintang: return 5 tahun tertinggi, alpha 4 persen, fee 2 persen — dan timnya baru berganti separuh tahun lalu. Finalis B, si Stabil: return biasa saja, tetapi alpha signifikan, proses terdokumentasi, tim yang sama selama 8 tahun, fee 0,5 persen. Finalis C, si Murah: fee 0,3 persen, tetapi track record hanya 2 tahun dan kapasitasnya nyaris penuh.",
        "Godaan komite adalah memilih A — return tertinggi, cerita paling menarik. Tetapi due diligence bukan kontes return. Ia adalah audit tujuh pilar: track record, alpha bersih fee, information ratio, proses, tim, kapasitas, dan fee. Dan di tujuh pilar itu, A justru yang paling rapuh.",
        "Setelah lesson ini kamu bisa: (1) menjalankan kerangka due diligence tujuh pilar dan menghitung skor tertimbang tiga manajer; (2) menghitung fee drag — berapa miliar yang hilang karena fee selama 10 tahun; (3) mengenali red flag yang membatalkan manajer sebagus apa pun angkanya; (4) menulis keputusan hire yang bisa dipertahankan di depan komite.",
      ],
      tasks: [],
      note: {
        title: "Aturan emas",
        body: "Pilih manajer dari prosesnya, bukan dari return-nya. Return 5 tahun bisa datang dari satu taruhan yang beruntung; proses yang terdokumentasi dan tim yang stabil adalah yang menghasilkan return 10 tahun berikutnya.",
      },
      reference: "Due diligence = audit tujuh pilar. Return tertinggi tanpa proses = lotre dengan brosur.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memimpin rapat seleksi manajer dan mempertahankan keputusanmu dengan angka dan bukti — bukan dengan kesan.",
        "(1) Menjelaskan tujuh pilar due diligence dan bobotnya dalam scorecard;",
        "(2) Menghitung skor tertimbang tiap finalis dan membaca apa yang disembunyikan skor totalnya;",
        "(3) Menghitung fee drag jangka panjang: selisih nilai akhir portofolio antara fee 2 persen dan 0,5 persen;",
        "(4) Mengenali red flag — key-person risk, kapasitas penuh, style drift, pergantian tim — dan menentukan kapan red flag membatalkan hire.",
      ],
      tasks: [],
    },
    {
      id: "tujuh-pilar",
      eyebrow: "Langkah 3 · Teori",
      title: "Tujuh pilar due diligence",
      prose: [
        "Pilar satu, track record: minimal 36 bulan, idealnya satu siklus pasar penuh. Tanyakan: apakah track record ini milik tim yang sama dengan yang akan mengelola uangmu? Track record manajer yang timnya sudah pergi adalah milik orang lain.",
        "Pilar dua, alpha bersih fee: alpha kotor dikurangi fee. Alpha 4 persen dengan fee 2 persen sama dengan alpha bersih 2 persen — dan bila t-stat alpha di bawah 2, angka itu belum terbukti skill. Pilar tiga, information ratio: alpha aktif dibagi tracking error. IR di atas 0,5 konsisten selama 5 tahun adalah bukti proses; IR yang datang dari satu tahun spektakuler adalah bukti keberuntungan.",
        "Pilar empat, proses: apakah proses investasinya tertulis, bisa diulang, dan dijalankan sama di semua kondisi pasar? Minta contoh keputusan beli dan jual nyata, lengkap dengan alasannya. Pilar lima, tim: stabilitas, suksesi, dan insentif. Bila pengambil keputusan utama pergi dalam 6 bulan, kamu sedang mewawancarai orang yang salah.",
        "Pilar enam, kapasitas: berapa AUM maksimal sebelum alpha menguap? Manajer small-cap dengan AUM Rp5 triliun sudah membeli seluruh saham yang ia incar — setiap rupiah tambahan merusak return. Pilar tujuh, fee: bukan sekadar murah atau mahal, melainkan fee per unit alpha bersih. Fee 2 persen untuk alpha bersih yang tidak signifikan adalah fee termahal di ruangan itu.",
      ],
      tasks: [],
      note: {
        title: "Red flag yang membatalkan",
        body: "Empat red flag membatalkan hire apa pun skornya: (1) key-person risk tanpa rencana suksesi; (2) kapasitas sudah penuh tetapi manajer tetap menerima dana; (3) style drift yang tidak diakui; (4) track record yang tidak bisa diverifikasi secara independen (bukan GIPS, tidak ada auditor). Satu red flag dari empat ini mengalahkan skor 4,5 sekalipun.",
      },
      reference: "Tujuh pilar: track record, alpha bersih, IR, proses, tim, kapasitas, fee. Empat red flag membatalkan semuanya.",
    },
    {
      id: "fee-drag",
      eyebrow: "Langkah 4 · Teori",
      title: "Fee drag: 1,5 persen yang memakan Rp2,70 miliar",
      prose: [
        "Fee terlihat kecil karena dikutip per tahun. Tetapi fee adalah potongan majemuk: ia memotong bukan hanya return tahun ini, melainkan juga return atas return di tahun-tahun berikutnya. Hitungannya: dana Rp10 miliar, return kotor 8 persen per tahun, selama 10 tahun. Dengan fee 2 persen, return bersih 6 persen — nilai akhir Rp17,91 miliar. Dengan fee 0,5 persen, return bersih 7,5 persen — nilai akhir Rp20,61 miliar.",
        "Selisihnya Rp2,70 miliar — 27 persen dari modal awal — hilang hanya karena selisih fee 1,5 persen per tahun. Inilah kenapa fee adalah pilar ketujuh yang paling mudah dihitung dan paling sering diremehkan: 1,5 persen per tahun terdengar seperti biaya administrasi, tetapi selama 10 tahun ia adalah seperempat modal.",
        "Aturan praktisnya: jangan pernah membandingkan fee tanpa membandingkan alpha bersih. Manajer dengan fee 2 persen dan alpha bersih signifikan 2 persen lebih murah daripada manajer dengan fee 0,5 persen dan alpha bersih negatif 1 persen. Yang dibandingkan adalah fee per unit alpha bersih — bukan fee mentahnya.",
      ],
      tasks: [],
      formula: String.raw`V_T = V_0 \times (1 + r_{kotor} - fee)^T, \quad \text{Fee drag} = V_T^{fee\ kecil} - V_T^{fee\ besar}`,
      formulaNote: "V_T = nilai akhir; V_0 = modal awal; r kotor = return kotor; fee = fee tahunan; T = tahun. Fee drag = selisih nilai akhir antara fee kecil dan fee besar.",
      reference: "Fee 2 persen vs 0,5 persen selama 10 tahun di Rp10 miliar: selisih Rp2,70 miliar. Fee kecil bukan biaya kecil.",
    },
    {
      id: "lab-scorecard",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: scorecard tiga finalis dan fee drag",
      prose: [
        "Hitung skor tertimbang tiga finalis dengan bobot tujuh pilar: track record 20 persen, alpha bersih 20 persen, information ratio 15 persen, proses 15 persen, tim 10 persen, kapasitas 10 persen, fee 10 persen. Skor tiap pilar 1 sampai 5. Finalis A: 5, 4, 3, 3, 4, 2, 2. Finalis B: 4, 4, 5, 5, 5, 4, 4. Finalis C: 3, 3, 3, 4, 3, 2, 5. (Skor kapasitas C = 2 — konsisten dengan 'kapasitasnya nyaris penuh' di cerita; skor 5 akan berarti kapasitas longgar.)",
        "Hitung di kepala dulu: A = 1,00 + 0,80 + 0,45 + 0,45 + 0,40 + 0,20 + 0,20 = 3,50. B = 0,80 + 0,80 + 0,75 + 0,75 + 0,50 + 0,40 + 0,40 = 4,40. C = 0,60 + 0,60 + 0,45 + 0,60 + 0,30 + 0,20 + 0,50 = 3,25. Pemenangnya B — bukan yang return-nya tertinggi, melainkan yang proses dan timnya paling kuat.",
        "Lalu hitung fee drag: modal Rp10 miliar, return kotor 8 persen, 10 tahun, fee 2 persen vs 0,5 persen. Nilai akhir 17,91 vs 20,61 miliar — selisih Rp2,70 miliar. Setelah lolos, coba ubah bobot fee menjadi 20 persen (dan turunkan bobot track record menjadi 10 persen) dan lihat apakah pemenangnya berubah — itulah sensitivitas keputusan terhadap bobot.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor_a`, `skor_b`, `skor_c` dari bobot dan skor pilar" },
        { id: "t2", text: "Hitung `nilai_fee2`, `nilai_fee05`, dan `fee_drag_miliar`, lalu cetak semuanya" },
      ],
      expected: "skor A=3.50 B=4.40 C=3.25 | fee 2 persen -> 17.91 | fee 0,5 persen -> 20.61 | drag=2.70 miliar",
      hints: [
        "Skor = jumlah bobot × skor pilar; bobot: 0,20, 0,20, 0,15, 0,15, 0,10, 0,10, 0,10.",
        "Nilai akhir = 10 × (1 + 0,08 - fee) pangkat 10, dalam Rp miliar.",
        "Fee drag = nilai fee 0,5 persen dikurangi nilai fee 2 persen.",
        "Pemenang = skor tertinggi — jangan tertipu return tertinggi.",
      ],
      code: {
        starter: `# Scorecard 3 finalis (skor pilar 1-5) + fee drag 10 tahun\nbobot = [0.20, 0.20, 0.15, 0.15, 0.10, 0.10, 0.10]\nA = [5, 4, 3, 3, 4, 2, 2]\nB = [4, 4, 5, 5, 5, 4, 4]\nC = [3, 3, 3, 4, 3, 2, 5]\n\n# TULIS KODEMU\nskor_a = \nskor_b = \nskor_c = \n\n# TULIS KODEMU: fee drag (modal 10 miliar, gross 8 persen, 10 tahun)\nnilai_fee2 = \nnilai_fee05 = \nfee_drag_miliar = \n\nprint(f"skor A={skor_a:.2f} B={skor_b:.2f} C={skor_c:.2f} | fee 2 persen -> {nilai_fee2:.2f} | fee 0,5 persen -> {nilai_fee05:.2f} | drag={fee_drag_miliar:.2f} miliar")`,
        lockLines: 5,
        solution: `# Scorecard 3 finalis (skor pilar 1-5) + fee drag 10 tahun\nbobot = [0.20, 0.20, 0.15, 0.15, 0.10, 0.10, 0.10]\nA = [5, 4, 3, 3, 4, 2, 2]\nB = [4, 4, 5, 5, 5, 4, 4]\nC = [3, 3, 3, 4, 3, 2, 5]\n\n# TULIS KODEMU\nskor_a = sum(b * s for b, s in zip(bobot, A))\nskor_b = sum(b * s for b, s in zip(bobot, B))\nskor_c = sum(b * s for b, s in zip(bobot, C))\n\n# TULIS KODEMU: fee drag (modal 10 miliar, gross 8 persen, 10 tahun)\nnilai_fee2 = 10 * (1 + 0.08 - 0.02) ** 10\nnilai_fee05 = 10 * (1 + 0.08 - 0.005) ** 10\nfee_drag_miliar = nilai_fee05 - nilai_fee2\n\nprint(f"skor A={skor_a:.2f} B={skor_b:.2f} C={skor_c:.2f} | fee 2 persen -> {nilai_fee2:.2f} | fee 0,5 persen -> {nilai_fee05:.2f} | drag={fee_drag_miliar:.2f} miliar")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor_a", value: 3.5, tol: 0.01, label: "`skor_a` = 3,50", msg: "Return tertinggi tidak menyelamatkan proses dan kapasitas yang lemah." },
          { kind: "equal", task: "t1", name: "skor_b", value: 4.4, tol: 0.01, label: "`skor_b` = 4,40", msg: "Proses dan tim yang kuat mengangkat B ke puncak." },
          { kind: "equal", task: "t1", name: "skor_c", value: 3.25, tol: 0.01, label: "`skor_c` = 3,25", msg: "Murah saja tidak cukup — track record pendek, IR biasa, dan kapasitas nyaris penuh (skor kapasitas 2)." },
          { kind: "equal", task: "t2", name: "fee_drag_miliar", value: 2.7, tol: 0.01, label: "`fee_drag_miliar` = 2,70", msg: "20,61 dikurangi 17,91 = 2,70 miliar selama 10 tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "skor A=3\\.50 B=4\\.40 C=3\\.25", label: "`print` menampilkan skor tiga finalis", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Skor: A 3,50, B 4,40, C 3,25 — pemenang B. Fee drag Rp2,70 miliar selama 10 tahun.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: pemenang dengan bom waktu",
      prose: [
        "Komite memilih B dengan skor 4,40. Tetapi due diligence lanjutan menemukan satu fakta: Chief Investment Officer B akan pensiun dalam 6 bulan, dan penggantinya belum ditunjuk. Tidak ada rencana suksesi tertulis. Ini key-person risk — salah satu dari empat red flag yang membatalkan hire.",
        "Pertanyaan: apakah komite tetap hire B? Jawabannya: tidak tanpa syarat. Tiga opsi di atas meja. Satu, tunda hire sampai rencana suksesi tertulis dan pengganti diumumkan — paling aman, tetapi B bisa diambil investor lain. Dua, hire bersyarat: kontrak dengan klausul key-person — bila CIO pergi tanpa pengganti yang disetujui komite dalam 6 bulan, dana bisa ditarik tanpa penalti. Tiga, hire dengan alokasi bertahap: mulai dari 25 persen dari alokasi penuh, naikkan setelah suksesi terbukti berjalan.",
        "Keputusan yang diambil komite: opsi tiga, dikombinasikan dengan klausul key-person dari opsi dua. Alasannya: skor 4,40 B dibangun oleh tim yang dipimpin CIO itu — tanpa dia, skornya adalah skor tim yang belum pernah diuji. Alokasi bertahap membatasi kerugian bila suksesi gagal, dan klausul memberi jalan keluar yang bersih. Due diligence tidak berhenti saat kontrak ditandatangani — ia berlanjut sebagai monitoring.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Key-person risk membatalkan hire tanpa syarat — tetapi tidak selalu membatalkan hire sepenuhnya. Bedakan: red flag berarti jangan hire buta, bukan jangan hire sama sekali. Alokasi bertahap ditambah klausul key-person adalah cara profesional mengelola red flag yang tidak bisa dihilangkan sebelum hire.",
      },
      reference: "Skor 4,40 milik tim yang dipimpin CIO itu. Tanpa suksesi, skornya belum terbukti — alokasi bertahap + klausul key-person.",
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
        "Tujuh pilar: track record, alpha bersih fee, information ratio, proses, tim, kapasitas, fee.",
        "Lab: skor A 3,50, B 4,40, C 3,25 — pemenang B, bukan yang return-nya tertinggi.",
        "Fee drag: fee 2 persen vs 0,5 persen selama 10 tahun di Rp10 miliar = selisih Rp2,70 miliar.",
        "Empat red flag membatalkan hire: key-person tanpa suksesi, kapasitas penuh, style drift, track record tak terverifikasi.",
        "Due diligence tidak berhenti saat kontrak ditandatangani — ia berlanjut sebagai monitoring kuartalan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Manajer A return tertinggi tetapi skor total 3,50; manajer B skor 4,40. Siapa yang dipilih dan kenapa?",
          options: [
            { text: "A — return tertinggi adalah bukti paling kuat", why: "Salah: return 5 tahun bisa datang dari satu taruhan beruntung. Skor total menilai proses, tim, dan kapasitas — bukan hanya return." },
            { text: "B — skor tertimbang tujuh pilar lebih tinggi; proses dan tim yang kuat lebih bisa diulang daripada return masa lalu", why: "Tepat: due diligence memilih proses yang menghasilkan return berikutnya, bukan return yang sudah terjadi.", correct: true },
            { text: "C — fee paling murah selalu menang", why: "Salah: C memang murah, tetapi track record pendek dan IR biasa — skornya hanya 3,25." },
            { text: "Tidak ada — skor di bawah 4,50 semuanya ditolak", why: "Salah: tidak ada ambang universal 4,50. Yang dibandingkan adalah skor relatif antar finalis dan red flag." },
          ],
        },
        {
          q: "Fee 2 persen vs 0,5 persen, modal Rp10 miliar, return kotor 8 persen, 10 tahun. Berapa fee drag-nya?",
          options: [
            { text: "Rp1,50 miliar — selisih fee 1,5 persen dikali modal", why: "Salah: itu hanya fee satu tahun tanpa bunga majemuk. Fee memotong return atas return selama 10 tahun." },
            { text: "Rp2,70 miliar — nilai akhir 20,61 dikurangi 17,91 miliar", why: "Tepat: fee adalah potongan majemuk. Selisih 1,5 persen per tahun menjadi 27 persen dari modal awal dalam 10 tahun.", correct: true },
            { text: "Rp150 juta — 1,5 persen dari Rp10 miliar", why: "Salah: itu fee satu tahun saja. Selama 10 tahun dengan bunga majemuk, kerugiannya jauh lebih besar." },
            { text: "Tidak ada — return kotor 8 persen sudah termasuk fee", why: "Salah: return kotor belum dikurangi fee. Return bersihlah yang menentukan nilai akhir." },
          ],
        },
        {
          q: "Manajer dengan skor 4,40 tetapi CIO-nya pensiun 6 bulan lagi tanpa rencana suksesi. Apa keputusan yang benar?",
          options: [
            { text: "Hire penuh — skor 4,40 sudah cukup", why: "Salah: skor itu milik tim yang dipimpin CIO tersebut. Key-person risk adalah red flag yang membatalkan hire tanpa syarat." },
            { text: "Tolak total — red flag berarti tidak boleh hire sama sekali", why: "Salah: red flag berarti jangan hire buta. Alokasi bertahap ditambah klausul key-person mengelola risikonya secara profesional." },
            { text: "Hire bertahap dengan klausul key-person — batasi kerugian bila suksesi gagal, dan jaga jalan keluar yang bersih", why: "Tepat: alokasi 25 persen dulu, naikkan setelah suksesi terbukti; klausul memungkinkan penarikan tanpa penalti.", correct: true },
            { text: "Tunda selamanya — cari manajer lain saja", why: "Salah: menunda selamanya membuang finalis terbaik karena risiko yang bisa dikelola dengan struktur kontrak." },
          ],
        },
        {
          q: "Manajer small-cap dengan AUM Rp5 triliun terus menerima dana baru. Apa risikonya?",
          options: [
            { text: "Tidak ada — AUM besar berarti manajer dipercaya", why: "Salah: kapasitas adalah pilar keenam. Manajer small-cap yang terlalu besar membeli saham yang sama dengan dirinya sendiri." },
            { text: "Alpha menguap — ia kehabisan ide yang cukup kecil untuk dibeli tanpa menggerakkan harga", why: "Tepat: setiap rupiah tambahan membeli saham yang sama, menggerakkan harga melawan dirinya, dan menipiskan alpha.", correct: true },
            { text: "Fee menjadi lebih murah otomatis", why: "Salah: fee tidak otomatis turun dengan AUM — dan kalaupun turun, alpha yang hilang jauh lebih mahal." },
            { text: "Tracking error menjadi nol", why: "Salah: tracking error tidak menjadi nol karena AUM besar. Kapasitas memengaruhi return, bukan tracking error secara langsung." },
          ],
        },
        {
          q: "Apa arti information ratio yang konsisten di atas 0,5 selama 5 tahun?",
          options: [
            { text: "Manajer tidak pernah rugi", why: "Salah: IR mengukur alpha per unit tracking error — bukan jaminan tidak pernah rugi." },
            { text: "Bukti proses yang menghasilkan alpha aktif secara konsisten, bukan dari satu tahun spektakuler", why: "Tepat: IR yang stabil selama 5 tahun menunjukkan skill yang berulang. IR dari satu tahun bisa jadi keberuntungan.", correct: true },
            { text: "Fee manajer pasti murah", why: "Salah: IR tidak ada hubungannya dengan fee. Fee dinilai di pilar ketujuh, terpisah." },
            { text: "Manajer pasti mengalahkan benchmark setiap tahun", why: "Salah: IR 0,5 berarti alpha rata-rata setengah tracking error — masih ada tahun-tahun negatif di dalamnya." },
          ],
        },
      ],
    },
  ],
};
