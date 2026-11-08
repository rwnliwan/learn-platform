import type { V2Lesson } from "../lib/types";

export const rr35: V2Lesson = {
  slug: "rr35-gri-csrd",
  track: "Risk Reporting",
  module: "Pelaporan Keberlanjutan",
  title: "RR35 — GRI dan CSRD: Pelengkap ISSB untuk Laporan Keberlanjutan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan yang lolos ISSB tetapi ditolak investor Eropa",
      prose: [
        "PT Hijau Lestari menerbitkan sustainability report yang selaras ISSB S1 dan S2 — lengkap dengan empat pilar dan financed emissions. Fund manager Eropa tetap menjual sahamnya. Alasannya: 'ISSB menjawab risiko iklim bagi perusahaan. Kami butuh CSRD: dampak perusahaan bagi dunia — dan GRI: apa yang material bagi masyarakat, bukan hanya bagi investor.'",
        "Bank itu baru sadar: ISSB, GRI, dan CSRD menjawab pertanyaan berbeda. ISSB bertanya apa risiko keberlanjutan bagi nilai perusahaan. GRI bertanya apa dampak perusahaan bagi ekonomi, lingkungan, dan masyarakat. CSRD mewajibkan keduanya — materialitas ganda — untuk perusahaan yang MASUK CAKUPANNYA: perusahaan UE tertentu yang memenuhi ambang ukuran, serta sebagian perusahaan non-UE dengan aktivitas signifikan di UE. CSRD TIDAK berlaku untuk semua perusahaan yang 'beroperasi di Eropa' tanpa syarat — cakupannya mengikuti kategori dan ambang hukum, bukan sekadar kehadiran. Dan CSRD mewajibkan pelaporan BERDASARKAN ESRS; GRI adalah kerangka yang interoperabel dan sering dijadikan referensi — bukan berarti CSRD mewajibkan laporan GRI.",
        "Lesson ini mengajarkan GRI dan CSRD sebagai pelengkap ISSB. Setelah lesson ini kamu bisa: (1) membedakan ISSB, GRI, dan CSRD; (2) menjelaskan materialitas finansial vs materialitas ganda; (3) menghitung penurunan emisi dan menilai topik material; (4) memetakan topik ke standar GRI; (5) menilai kesiapan CSRD sebuah perusahaan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "RR21 mengajarkan ISSB S1/S2 dan konteks OJK secara mendalam — tetapi GRI dan CSRD tidak pernah disebut di track RR. Lesson ini adalah pelengkap yang dinyatakan di gaps: GRI dan CSRD sebagai pasangan ISSB, dengan sudut materialitas ganda dan kesiapan pelaporan Eropa.",
      },
      reference: "Emisi scope 1: 5.000 ke 4.200 tCO2e — turun 16,0 persen. 12 topik dinilai, 7 material pada aturan ATAU (lensa dampak atau keuangan ≥ 4).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan kenapa satu laporan keberlanjutan tidak cukup — dan standar mana menjawab pertanyaan siapa.",
        "(1) Membedakan ISSB (investor), GRI (dampak luas), dan CSRD (kewajiban Eropa);",
        "(2) Menjelaskan materialitas finansial vs materialitas ganda;",
        "(3) Menilai topik material dari skor dampak dan skor keuangan;",
        "(4) Menghitung penurunan emisi dan menilainya terhadap target;",
        "(5) Menilai kesiapan CSRD: data, assurance, dan tata kelola.",
      ],
      tasks: [],
    },
    {
      id: "tiga-standar",
      eyebrow: "Langkah 3 · Teori",
      title: "ISSB, GRI, CSRD: tiga pertanyaan berbeda",
      prose: [
        "ISSB (S1 dan S2) memakai materialitas finansial: ungkapkan isu keberlanjutan yang memengaruhi nilai perusahaan — risiko iklim yang mengancam aset, peluang transisi yang membuka pasar. Pembacanya investor. GRI memakai materialitas dampak: ungkapkan dampak perusahaan bagi ekonomi, lingkungan, dan masyarakat — berapa pun dampaknya pada nilai perusahaan. Pembacanya publik luas: masyarakat, pekerja, regulator, LSM.",
        "CSRD (Corporate Sustainability Reporting Directive, Uni Eropa) menggabungkan keduanya menjadi materialitas ganda: perusahaan wajib melaporkan isu yang material secara finansial ATAU berdampak signifikan — salah satu saja sudah cukup untuk wajib diungkap. CSRD juga mewajibkan assurance (audit eksternal atas laporan) dan format digital (XBRL) — laporan keberlanjutan diperlakukan seperti laporan keuangan. KOTAK CAKUPAN BERSYARAT — CSRD, ESRS, GRI: tiga hal yang berbeda perannya. CSRD adalah DIREKTIF (aturan hukum UE) yang mewajibkan pelaporan; ESRS adalah STANDAR pelaporan yang dipakai CSRD (apa yang dilaporkan dan bagaimana); GRI adalah KERANGKA pelaporan terpisah yang interoperabel dengan ESRS dan sering dipakai sebagai referensi — tetapi CSRD TIDAK mewajibkan laporan GRI. Cakupan CSRD bersyarat: perusahaan UE tertentu yang memenuhi ambang ukuran + sebagian perusahaan non-UE dengan aktivitas signifikan di UE — bukan semua perusahaan yang beroperasi atau menjual di Eropa. Bila kamu menulis 'perusahaan ini wajib CSRD', sertakan kategorinya dan ambangnya — tanpa itu, klaimnya tidak bisa diverifikasi.",
        "Peta praktisnya: perusahaan Indonesia yang mencari investor global butuh ISSB; yang MASUK CAKUPAN CSRD (perusahaan UE tertentu yang memenuhi ambang, plus sebagian non-UE dengan aktivitas signifikan di UE) butuh CSRD; yang ingin dipercaya publik luas memakai GRI. Ketiganya tumpang tindih pada data yang sama (emisi, energi, pekerja) tetapi berbeda pada ambang pengungkapan — satu angka emisi bisa wajib di ISSB, wajib di GRI, dan wajib di CSRD dengan alasan berbeda.",
      ],
      tasks: [],
      note: {
        title: "Materialitas ganda bukan dua kali kerja",
        body: "Materialitas ganda tidak berarti dua laporan terpisah — melainkan satu penilaian topik dengan dua lensa. Satu topik dinilai dua skor: seberapa besar dampaknya bagi dunia, dan seberapa besar dampaknya bagi nilai perusahaan. Topik yang lolos salah satu lensa masuk laporan. Penilaian ganda justru menghemat kerja: satu proses, dua jawaban.",
      },
      reference: "ISSB: materialitas finansial, pembaca investor. GRI: materialitas dampak, pembaca publik. CSRD: materialitas ganda plus assurance dan XBRL.",
    },
    {
      id: "penilaian-topik",
      eyebrow: "Langkah 4 · Teori",
      title: "Menilai topik material dan penurunan emisi",
      prose: [
        "Penilaian topik memakai dua skor 1 sampai 5: skor dampak (seberapa besar dampak bagi dunia) dan skor keuangan (seberapa besar pengaruh pada nilai perusahaan). Aturan material di lesson ini mengikuti CSRD: topik material bila SALAH SATU lensa mencapai 4 atau lebih — dampak ≥ 4 ATAU keuangan ≥ 4. Perkalian kedua skor (maksimal 25) dengan ambang 12 adalah aturan LAMA lesson ini dan sudah diganti: perkalian menyembunyikan topik yang ekstrem di satu lensa tetapi rendah di lensa lain — misalnya dampak 5 dan keuangan 1 (produk 5) lolos dari radar padahal dampaknya besar. Pasangan (dampak, keuangan) 12 topik: (5,3), (4,3), (3,3), (5,1), (5,4), (3,2), (4,2), (2,3), (4,4), (2,2), (4,3), (2,1) — yang material: (5,3), (4,3), (5,1), (5,4), (4,2), (4,4), (4,3) — 7 topik. Topik (5,1) adalah buktinya: produknya hanya 5, tetapi dampak 5 saja sudah cukup untuk wajib diungkap.",
        "Emisi dihitung seperti metrik keuangan: scope 1 turun dari 5.000 ke 4.200 tCO2e — turun 800, sama dengan 16,0 persen. Angka itu saja tidak cukup: bandingkan dengan target (misalnya turun 20 persen pada 2026) dan dengan baseline. Laporan yang menulis 'turun 16 persen' tanpa target adalah laporan yang memilih angka yang menyenangkan — pelajaran yang sama seperti MK31 tentang memilih angka.",
        "Kesiapan CSRD dinilai tiga lapis: data (apakah scope 3 sudah dihitung dengan metode yang terdokumentasi — scope 3 pada umumnya MEMANG melibatkan estimasi berbasis data primer dan faktor emisi; yang membedakan data baik dari tebakan adalah metode yang tertulis, sumber data yang jelas, dan jejak auditnya, bukan ada-tidaknya estimasi), assurance (apakah auditor sudah dilibatkan sejak awal, bukan di akhir), dan tata kelola (apakah dewan sudah menyetujui topik material). Perusahaan yang gagal biasanya gagal di lapis pertama: data scope 3 tidak ada, dan laporan ditulis dari perkiraan.",
      ],
      tasks: [],
      note: {
        title: "Memetakan topik ke nomor GRI (contoh)",
        body: "Emisi gas rumah kaca → GRI 305; energi → GRI 302; air → GRI 303; keanekaragaman hayati → GRI 304; pekerja dan keselamatan kerja → GRI 401/403; anti-korupsi → GRI 205; pajak → GRI 207. Pemetaan ini yang membuat laporan bisa diaudit: tiap topik material menunjuk ke standar yang pengungkapannya bisa diperiksa, bukan sekadar tema.",
      },
      reference: "7 dari 12 topik material pada aturan ATAU (lensa ≥ 4). Emisi turun 16,0 persen (5.000 ke 4.200). Kesiapan CSRD: data, assurance, tata kelola.",
    },
    {
      id: "lab-gri",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung topik material dan penurunan emisi",
      prose: [
        "Lab ini menghitung penilaian materialitas ganda dan penurunan emisi dari angka mentah.",
        "Hitung dulu di kepala. Topik material: pasangan (dampak, keuangan) — (5,3), (4,3), (3,3), (5,1), (5,4), (3,2), (4,2), (2,3), (4,4), (2,2), (4,3), (2,1) — yang material adalah yang dampaknya ≥ 4 ATAU keuangannya ≥ 4: (5,3), (4,3), (5,1), (5,4), (4,2), (4,4), (4,3) — sebanyak 7 topik. Bandingkan dengan aturan lama (perkalian ≥ 12): hanya 5 topik, dan (5,1) yang dampaknya ekstrem justru hilang. Penurunan emisi: 5.000 dikurangi 4.200 sama dengan 800; 800 dibagi 5.000 dikali 100 sama dengan 16,0 persen.",
        "Tugas lab: tulis fungsi yang menerima daftar skor topik, ambang, emisi awal, dan emisi akhir — lalu mencetak dua angka: topik_material dan emisi_turun_persen.",
        "Setelah lolos, coba eksperimen: naikkan ambang lensa menjadi 5 dan lihat topik material turun menjadi 3 — (5,3), (5,1), (5,4) — ambang adalah keputusan, bukan kebenaran. Lalu bandingkan dengan aturan perkalian lama (≥ 12): 5 topik — dan perhatikan (5,1) yang hilang di aturan lama.",
      ],
      tasks: [
        { id: "t1", text: "Hitung topik_material dari skor dampak dan keuangan dengan ambang lensa 4" },
        { id: "t2", text: "Hitung emisi_turun_persen" },
      ],
      expected: "topik_material=7\nemisi_turun_persen=16.0",
      hints: [
        "Topik material = dampak ≥ ambang lensa ATAU keuangan ≥ ambang lensa.",
        "Penurunan persen = awal dikurangi akhir, dibagi awal, dikali 100.",
      ],
      code: {
        starter: `# Penilaian materialitas Hijau Lestari: 12 topik + emisi scope 1.\ndampak = [5, 4, 3, 5, 5, 3, 4, 2, 4, 2, 4, 2]\nkeuangan = [3, 3, 3, 1, 4, 2, 2, 3, 4, 2, 3, 1]\nambang_lensa = 4\nemisi_awal = 5000\nemisi_akhir = 4200\n\n# TULIS KODEMU: hitung topik_material dan emisi_turun_persen.\n# Cetak, per baris: topik_material, emisi_turun_persen.\n\n\nmesin_gri(dampak, keuangan, ambang_lensa, emisi_awal, emisi_akhir)`,
        lockLines: 5,
        solution: `# Penilaian materialitas Hijau Lestari: 12 topik + emisi scope 1.\ndampak = [5, 4, 3, 5, 5, 3, 4, 2, 4, 2, 4, 2]\nkeuangan = [3, 3, 3, 1, 4, 2, 2, 3, 4, 2, 3, 1]\nambang_lensa = 4\nemisi_awal = 5000\nemisi_akhir = 4200\n\n\ndef mesin_gri(dampak, keuangan, ambang_lensa, emisi_awal, emisi_akhir):\n    topik_material = 0\n    for d, k in zip(dampak, keuangan):\n        if d >= ambang_lensa or k >= ambang_lensa:\n            topik_material = topik_material + 1\n    emisi_turun_persen = (emisi_awal - emisi_akhir) / emisi_awal * 100\n    print(f"topik_material={topik_material}")\n    print(f"emisi_turun_persen={emisi_turun_persen}")\n\n\nmesin_gri(dampak, keuangan, ambang_lensa, emisi_awal, emisi_akhir)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "topik_material=7", label: "7 topik material", msg: "Dampak ≥ 4 ATAU keuangan ≥ 4: (5,3), (4,3), (5,1), (5,4), (4,2), (4,4), (4,3) — 7 topik." },
          { kind: "stdout_matches", task: "t2", pattern: "emisi_turun_persen=16.0", label: "Emisi turun 16,0 persen", msg: "(5.000 - 4.200) / 5.000 x 100 = 16,0 persen. Bandingkan dengan target 20 persen." },
        ],
      },
      reference: "7 topik material; emisi turun 16,0 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: laporan yang akhirnya dibaca investor Eropa",
      prose: [
        "Kembali ke Hijau Lestari. Laporan tahun berikutnya memakai materialitas ganda: 7 topik material dinilai dua lensa, emisi scope 3 mulai dihitung dengan metode yang terdokumentasi (estimasi berbasis data primer dan faktor emisi — bukan tebakan tanpa jejak), dan auditor dilibatkan sejak kuartal pertama. Laporan itu memuat target (turun 20 persen pada 2026) di samping realisasi 16,0 persen — dengan jarak ke target yang ditulis jujur.",
        "Fund manager Eropa tidak langsung membeli kembali — tetapi ia membaca laporan itu sampai habis, dan menulis dua halaman pertanyaan lanjutan. Itulah fungsi laporan keberlanjutan yang baik: bukan meyakinkan semua orang, melainkan memberi bahan untuk percakapan yang serius.",
        "Keputusan rapat: GRI dan CSRD menjadi pelengkap ISSB di semua laporan berikutnya — satu proses penilaian, tiga jawaban untuk tiga pembaca.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat laporan baru dibaca. Pertama, materialitas ganda — pertanyaan investor Eropa terjawab. Kedua, target di samping realisasi — jarak ke target ditulis jujur. Ketiga, assurance sejak awal — auditor bukan peninjau akhir melainkan rekan sejak kuartal pertama.",
      },
      reference: "7 topik material dua lensa; scope 3 dihitung dengan metode terdokumentasi; target 20 persen vs realisasi 16,0 persen ditulis berdampingan.",
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
        "Lab: 7 topik material; emisi turun 16,0 persen.",
        "ISSB: materialitas finansial untuk investor. GRI: dampak untuk publik. CSRD: ganda plus assurance dan XBRL.",
        "Materialitas ganda: lolos salah satu lensa sudah wajib diungkap.",
        "Emisi tanpa target adalah angka yang menyenangkan — bukan laporan.",
        "Kesiapan CSRD: data, assurance, tata kelola.",
      ],
      next: { label: "RR36 — Pelaporan Kontrol Internal dan Audit Risk: Siapa Mengawasi Pengawas", href: "/v2/learn/rr36-kontrol-internal-audit-risk" },
      quiz: [
        {
          q: "Pasangan (dampak, keuangan) 12 topik: (5,3), (4,3), (3,3), (5,1), (5,4), (3,2), (4,2), (2,3), (4,4), (2,2), (4,3), (2,1); aturan ATAU dengan ambang lensa 4. Berapa topik material?",
          options: [
            { text: "6 topik — (5,1) tidak dihitung", why: "Salah: (5,1) justru material — dampak 5 saja sudah cukup di aturan ATAU.", correct: false },
            { text: "12 topik — semua dinilai", why: "Salah: dinilai bukan berarti material; hanya yang lolos aturan ATAU yang material." },
            { text: "7 topik", why: "Tepat: (5,3), (4,3), (5,1), (5,4), (4,2), (4,4), (4,3) — tujuh pasangan dengan dampak ≥ 4 atau keuangan ≥ 4.", correct: true },
            { text: "5 topik — hasil aturan perkalian lama", why: "Salah: 5 adalah hasil aturan perkalian (≥ 12) yang sudah diganti; aturan ATAU memberi 7 — dan (5,1) yang dampaknya ekstrem justru hilang di aturan lama." },
          ],
        },
        {
          q: "Emisi scope 1 dari 5.000 ke 4.200 tCO2e. Berapa penurunannya?",
          options: [
            { text: "800 persen — selisih disalahartikan", why: "Salah: 800 adalah selisih absolut (tCO2e), bukan persen." },
            { text: "84,0 persen — itu sisa emisi", why: "Salah: 4.200 / 5.000 = 84 persen adalah sisa, bukan penurunan." },
            { text: "20,0 persen — itu targetnya", why: "Salah: 20 persen adalah target 2026; realisasinya 16,0 persen." },
            { text: "16,0 persen", why: "Tepat: (5.000 - 4.200) / 5.000 = 16,0 persen.", correct: true },
          ],
        },
        {
          q: "Apa beda materialitas finansial dan materialitas ganda?",
          options: [
            { text: "Finansial: pengaruh pada nilai perusahaan. Ganda: finansial ATAU dampak bagi dunia — salah satu cukup", why: "Tepat: itulah CSRD — topik yang berdampak besar bagi dunia wajib diungkap meski belum memengaruhi nilai perusahaan.", correct: true },
            { text: "Tidak ada beda — keduanya soal investor", why: "Salah: materialitas ganda menambah lensa dampak bagi dunia." },
            { text: "Ganda berarti dua laporan terpisah", why: "Salah: ganda adalah satu penilaian dengan dua lensa, bukan dua laporan." },
            { text: "Finansial untuk Eropa, ganda untuk Indonesia", why: "Salah: terbalik — CSRD (ganda) adalah kewajiban Eropa." },
          ],
        },
        {
          q: "Laporan ISSB lengkap tetapi investor Eropa tetap menjual. Apa yang hilang?",
          options: [
            { text: "Foto penanaman pohon yang lebih banyak", why: "Salah: foto bukan substansi — investor butuh pengungkapan dampak dan assurance." },
            { text: "Sudut CSRD dan GRI: dampak bagi dunia dan materialitas ganda", why: "Tepat: ISSB menjawab risiko bagi perusahaan; investor Eropa bertanya dampak perusahaan bagi dunia.", correct: true },
            { text: "Laporan yang lebih tebal", why: "Salah: tebal bukan ukuran — kelengkapan terhadap pertanyaan pembacalah ukurannya." },
            { text: "Konsultan yang lebih mahal", why: "Salah: harga konsultan tidak menentukan apakah pertanyaan pembaca terjawab." },
          ],
        },
        {
          q: "Perusahaan gagal kesiapan CSRD paling sering di lapis apa?",
          options: [
            { text: "Tata kelola — dewan tidak menyetujui", why: "Salah: tata kelola bisa diperbaiki cepat; data yang tidak ada tidak bisa diperbaiki cepat." },
            { text: "Format XBRL — terlalu teknis", why: "Salah: format adalah lapis terakhir; data adalah lapis pertama." },
            { text: "Data — scope 3 belum dihitung dengan metode yang bisa diaudit", why: "Tepat: tanpa data scope 3 yang terdokumentasi, assurance dan tata kelola tidak punya bahan untuk bekerja. Estimasi berbasis data primer dengan metode tertulis tetap data — tebakan tanpa jejak yang bukan.", correct: true },
            { text: "Nama laporan — kurang menarik", why: "Salah: nama tidak menentukan kesiapan." },
          ],
        },
      ],
    },
  ],
};
