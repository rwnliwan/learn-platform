import type { V2Lesson } from "../lib/types";

export const fdp9: V2Lesson = {
  slug: "fdp9-market-data",
  track: "Financial Data Pipeline",
  module: "Market Data",
  title: "FDP9 — Market Data: Menggabungkan Harga dengan Filings",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rasio yang butuh harga — dan harga yang tidak ada",
      prose: [
        "Riko sudah bisa menghitung 16 rasio dari filings: margin, ROE, current ratio. Lalu Sinta bertanya: 'berapa P/E KLBF?' Riko membuka tabel kanonisnya — tidak ada harga saham di sana. Filings berisi laba, aset, dan kas; harga saham hidup di tempat lain: pasar.",
        "Ia mengunduh harga penutupan dari sumber publik dan menempelkannya ke tabel — lalu mendapat P/E yang aneh: 4,1. Kesalahannya: harga yang ditempel adalah Rp290 bertanggal 2015, dari deret harga yang tidak disesuaikan dan tidak dicatat tanggalnya, sementara labanya laba FY2024 penuh (EPS Rp70,16). 290 dibagi 70,16 memang 4,1 — tetapi harga 2015 dipasangkan dengan laba 2024. Harga dan laba dari dua tanggal berbeda digabung menjadi satu rasio — seperti membandingkan berat badan hari ini dengan tinggi badan lima tahun lalu.",
        "Twist-nya: market data bukan sekadar 'kolom tambahan'. Ia punya sifat yang berlawanan dengan filings: filings datang per kuartal dan tidak berubah setelah terbit; harga berubah tiap detik dan tidak pernah 'final'. Menggabungkan keduanya adalah soal penjajaran tanggal — dan penjajaran yang salah menghasilkan rasio yang salah dengan percaya diri.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: tempel harga terbaru ke laba mana pun",
        type: "pitfall",
        body: "Harga adalah foto pada satu tanggal; laba adalah film satu periode. Rasio yang jujur memasangkan harga SETELAH periode laba berakhir — bukan harga dari tengah periode, dan bukan harga hari ini untuk laba dua tahun lalu.",
      },
      reference: "Filings = film per kuartal. Harga = foto per detik. Rasio butuh keduanya dari tanggal yang selaras.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menambahkan data pasar ke pipeline filings tanpa merusak kejujuran tanggalnya.",
        "(1) Menyebutkan sumber harga, return, dan volume beserta sifat masing-masing;",
        "(2) Menjajarkan harga dengan periode filings (aturan: harga setelah akhir periode);",
        "(3) Menghitung rasio yang butuh harga pasar — P/E dan kapitalisasi pasar — dari angka benchmark;",
        "(4) Menyimpan harga di lapis kanonis dengan kunci tanggal yang benar.",
      ],
      tasks: [],
    },
    {
      id: "sumber-harga",
      eyebrow: "Langkah 3 · Konsep",
      title: "Sumber harga, return, dan volume",
      prose: [
        "Tiga keluarga sumber. Pertama, bursa dan penyedia data pasar publik: harga penutupan harian, volume, dan harga yang sudah disesuaikan (adjusted close — memperhitungkan dividen dan stock split). Untuk emiten Indonesia, sumbernya antara lain data perdagangan IDX dan penyedia data pasar publik; untuk emiten AS, penyedia publik seperti Yahoo Finance atau Stooq. Pilih satu sumber dan catat di provenance — mencampur dua sumber harga dalam satu deret tanpa catatan adalah sumber artefak.",
        "Kedua, return: bukan data mentah, melainkan turunan dari harga — return harian sama dengan harga hari ini dibagi harga kemarin, dikurangi 1. Simpan harga mentahnya, hitung return-nya; jangan menyimpan return tanpa harga asalnya, karena kamu tidak bisa lagi memeriksa apakah return itu memakai harga yang sudah disesuaikan atau belum.",
        "Ketiga, volume: jumlah saham yang diperdagangkan — dipakai sebagai penanda likuiditas dan untuk validasi (harga tanpa volume yang wajar patut dicurigai: apakah hari itu sahamnya benar-benar diperdagangkan, atau harganya hanya harga terakhir yang menempel?).",
        "Satu perbedaan mendasar dengan filings: harga butuh penyesuaian aksi korporasi. Bila emiten membagi dividen atau stock split, harga historis yang tidak disesuaikan akan menunjukkan 'jatuh' yang tidak pernah terjadi. Selalu pakai adjusted close untuk deret return — dan catat di provenance apakah harga yang kamu simpan sudah disesuaikan atau belum.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai harga close biasa (bukan adjusted) untuk menghitung return jangka panjang. Stock split 2:1 membuat harga 'turun 50 persen' dalam semalam — return-mu akan mencatat crash yang tidak pernah terjadi.",
      },
      reference: "Simpan harga mentah + adjusted close + volume. Return adalah turunan, bukan data mentah.",
    },
    {
      id: "penjajaran",
      eyebrow: "Langkah 4 · Konsep",
      title: "Penjajaran tanggal: aturan harga-setelah-periode",
      prose: [
        "Aturan: harga yang dipasangkan dengan laba periode P harus bertanggal SETELAH akhir periode P — dan idealnya setelah tanggal filing terbit, agar harga sudah 'tahu' isi laporan itu. Harga sebelum akhir periode mengandung informasi yang belum terjadi saat laba dihitung — itu look-ahead: rasio yang memakai masa depan.",
        "Contoh konkret: laba KLBF FY2024 (periode berakhir 31 Des 2024). Harga yang selaras: harga penutupan setelah 31 Des 2024 — mis. 31 Mar 2025. Harga 30 Jun 2024 TIDAK selaras: ia berasal dari tengah periode laba, saat setengah laba bahkan belum terjadi. Rasio yang memakai harga Juni untuk laba setahun penuh adalah rasio yang membandingkan apel dengan setengah apel.",
        "Di tabel kanonis, harga disimpan sebagai baris fakta juga — dengan pos 'harga_penutupan', periode yang sama dengan periode laba, plus kolom tanggal_harga yang sebenarnya. Dua tanggal itu berbeda dan keduanya penting: periode menjawab 'laba periode mana', tanggal_harga menjawab 'harga kapan'. Menyimpan satu tanpa yang lain adalah cara tercepat kehilangan jejak penjajaran.",
        "Satu jebakan terakhir: harga harian punya akhir pekan dan hari libur. Bila tanggal target bukan hari bursa, ambil harga penutupan terakhir yang tersedia SEBELUM tanggal target — dan catat tanggal aktualnya, bukan tanggal targetnya. 'Harga 31 Mar 2025' yang sebenarnya harga 28 Mar (Jumat) harus tercatat sebagai 28 Mar.",
      ],
      tasks: [],
      note: {
        title: "Aturan penjajaran",
        type: "risk",
        body: "Harga SETELAH akhir periode, idealnya setelah tanggal filing terbit. Harga dari tengah periode = look-ahead. Selalu simpan tanggal_harga aktual, bukan tanggal target.",
      },
      reference: "Periode laba + tanggal_harga aktual = dua kolom, keduanya wajib.",
    },
    {
      id: "lab-gabung",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: P/E dan kapitalisasi pasar KLBF dari benchmark",
      prose: [
        "Angka filings dari benchmark (nyata, terverifikasi): KLBF FY2024 laba bersih atribusional Rp3.240.636.626.331 dan EPS dasar Rp70,16 per saham. Harga saham di lab ini ILUSTRATIF: Rp1.650 per saham pada 31 Mar 2025 (setelah akhir periode FY2024 — selaras). Harga ilustratif hanya untuk latihan hitung; jangan dikutip sebagai harga pasar KLBF yang sebenarnya.",
        "Tugasmu: tulis fungsi rasio_pasar yang menghitung (1) jumlah saham beredar tersirat = laba bersih dibagi EPS, (2) P/E = harga dibagi EPS, (3) kapitalisasi pasar = harga dikali jumlah saham. Lalu tulis fungsi gabung_valid yang menjawab True bila tanggal harga berada setelah akhir periode, dan False bila tidak.",
        "Eksperimen setelah selesai: ganti harga menjadi Rp3.300 (dua kali lipat) — P/E dan kapitalisasi pasar ikut dua kali lipat, tetapi jumlah saham tidak berubah. Itulah bedanya angka pasar (bergerak tiap hari) dan angka filings (tetap setelah terbit): rasio campuran bergerak karena sisi pasarnya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `rasio_pasar`: saham tersirat, P/E, kapitalisasi pasar dari EPS dan harga" },
        { id: "t2", text: "Tulis `gabung_valid`: True bila tanggal harga setelah akhir periode" },
        { id: "t3", text: "Cetak P/E, saham, kapitalisasi pasar, dan dua hasil penjajaran" },
      ],
      expected: "pe=23.52 | saham=46189233557 | mcap_triliun=76.21\njoin_ok=True | join_terlalu_dini=False",
      note: {
        title: "Kunci hitungan",
        body: "Saham tersirat = 3.240.636.626.331 dibagi 70,16 = 46.189.233.557 lembar. P/E = 1.650 dibagi 70,16 = 23,52. Kapitalisasi pasar = 1.650 kali 46.189.233.557 = Rp76,21 triliun. Harga Rp1.650 di sini ILUSTRATIF — yang nyata dari benchmark hanyalah laba dan EPS.",
      },
      hints: [
        "Saham tersirat dibulatkan ke lembar terdekat: gunakan round() lalu format tanpa desimal.",
        "Kapitalisasi pasar dalam triliun: bagi dengan 1e12, tampilkan 2 desimal.",
        "gabung_valid: bandingkan string tanggal 'YYYY-MM-DD' — format ini bisa dibandingkan langsung sebagai teks.",
      ],
      code: {
        starter: `# Angka benchmark (nyata): laba bersih dan EPS KLBF FY2024.\n# Harga Rp1650 ILUSTRATIF, hanya untuk latihan hitung.\nNI_KLBF = 3240636626331\nEPS_KLBF = 70.16\nHARGA_ILUSTRATIF = 1650\n\n# TULIS KODEMU\ndef rasio_pasar(ni, eps, harga):\n    \n\n# TULIS KODEMU\ndef gabung_valid(tanggal_harga, akhir_periode):\n    \n\nsaham, pe, mcap = rasio_pasar(NI_KLBF, EPS_KLBF, HARGA_ILUSTRATIF)\nprint(f"pe={pe:.2f} | saham={saham:.0f} | mcap_triliun={mcap/1e12:.2f}")\nok = gabung_valid("2025-03-31", "2024-12-31")\ndini = gabung_valid("2024-06-30", "2024-12-31")\nprint(f"join_ok={ok} | join_terlalu_dini={dini}")`,
        lockLines: 5,
        solution: `# Angka benchmark (nyata): laba bersih dan EPS KLBF FY2024.\n# Harga Rp1650 ILUSTRATIF, hanya untuk latihan hitung.\nNI_KLBF = 3240636626331\nEPS_KLBF = 70.16\nHARGA_ILUSTRATIF = 1650\n\ndef rasio_pasar(ni, eps, harga):\n    saham = round(ni / eps)\n    pe = harga / eps\n    mcap = harga * saham\n    return saham, pe, mcap\n\ndef gabung_valid(tanggal_harga, akhir_periode):\n    return tanggal_harga > akhir_periode\n\nsaham, pe, mcap = rasio_pasar(NI_KLBF, EPS_KLBF, HARGA_ILUSTRATIF)\nprint(f"pe={pe:.2f} | saham={saham:.0f} | mcap_triliun={mcap/1e12:.2f}")\nok = gabung_valid("2025-03-31", "2024-12-31")\ndini = gabung_valid("2024-06-30", "2024-12-31")\nprint(f"join_ok={ok} | join_terlalu_dini={dini}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pe", value: 23.52, tol: 0.01, label: "`pe` sekitar 23,52", msg: "1.650 dibagi 70,16 = 23,52 (harga ilustratif)." },
          { kind: "equal", task: "t1", name: "saham", value: 46189233557, tol: 1, label: "`saham` sekitar 46.189.233.557", msg: "3.240.636.626.331 dibagi 70,16." },
          { kind: "equal", task: "t1", name: "mcap", value: 76212235369050, tol: 2000000, label: "`mcap` sekitar Rp76,21 triliun", msg: "1.650 dikali 46.189.233.557." },
          { kind: "stdout_matches", task: "t3", pattern: "join_ok=True \\| join_terlalu_dini=False", label: "Penjajaran dinilai benar", msg: "31 Mar 2025 setelah 31 Des 2024 = selaras; 30 Jun 2024 = terlalu dini." },
        ],
      },
      reference: "P/E = harga / EPS. Kapitalisasi pasar = harga x saham beredar. Harga ilustratif, laba nyata.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Rasio apa butuh harga, mana yang tidak",
      prose: [
        "Tidak butuh harga: semua rasio dari filings saja — gross margin, net margin, ROE, current ratio, NPL, LDR, CAR. Ke-16 rasio FDP5 termasuk kelompok ini; itulah kenapa track ini bisa berjalan lima lesson tanpa menyentuh harga.",
        "Butuh harga: P/E (harga dibagi EPS), kapitalisasi pasar (harga dikali saham beredar), dividend yield (dividen per saham dibagi harga), price-to-book (harga dibagi nilai buku per saham). Semuanya memasangkan satu angka pasar yang bergerak dengan satu angka filings yang tetap — dan semuanya tunduk pada aturan penjajaran langkah 4.",
        "Skenario 1 — membandingkan P/E dua emiten pada tanggal yang sama. Keputusan: sah, asal kedua harga dari tanggal yang sama dan kedua laba dari periode yang sama. P/E KLBF vs P/E emiten lain di tanggal yang sama adalah perbandingan yang jujur.",
        "Skenario 2 — P/E hari ini memakai laba dua tahun lalu karena laba terbaru 'belum sempat ditarik'. Keputusan: jangan. Tarik dulu laba terbarunya (FDP8: jadwal fetch), baru hitung. Rasio campuran yang memakai laba kedaluwarsa memberi kesan murah atau mahal yang palsu.",
        "Aturan 10 detik: bila rasio menyebut harga, tanyakan dulu 'harga kapan, laba periode mana'. Bila jawabannya tidak ada di provenance, rasionya belum layak dikutip.",
      ],
      tasks: [],
      reference: "Filings saja: margin, ROE, NPL, LDR, CAR. Butuh harga: P/E, mcap, yield, P/B — selalu dengan tanggal.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: P/E 4,1 yang terlalu bagus",
      prose: [
        "Analis junior melaporkan P/E KLBF 4,1 — 'saham termurah di bursa'. Ia memakai EPS FY2024 Rp70,16 dan harga Rp290. Harga Rp290 itu nyata — tetapi bertanggal 2015, dari deret harga yang tidak disesuaikan dan tidak dicatat tanggalnya. EPS 2024 dipasangkan dengan harga 2015.",
        "Pertanyaan: dua kesalahan apa yang terjadi, dan apa P/E yang benar dengan harga ilustratif Rp1.650?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Kesalahan satu: penjajaran — harga 2015 dipasangkan dengan laba 2024, melanggar aturan harga-setelah-periode. Kesalahan dua: provenance hilang — tanggal harga tidak tercatat, sehingga tidak ada yang bisa memeriksa. P/E yang benar dengan harga ilustratif Rp1.650 adalah 23,52 (1.650 dibagi 70,16) — bukan 4,1. 'Termurah di bursa' itu artefak tanggal, bukan temuan.",
      },
      reference: "P/E tanpa tanggal harga = angka tanpa alamat. Selalu catat tanggal_harga.",
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
        "Harga, return, volume datang dari data pasar — simpan harga mentah + adjusted close + volume, dan catat sumbernya.",
        "Aturan penjajaran: harga SETELAH akhir periode laba, idealnya setelah filing terbit.",
        "P/E KLBF dengan harga ilustratif Rp1.650: 23,52; saham tersirat 46.189.233.557; kapitalisasi pasar Rp76,21 triliun.",
        "Rasio filings saja (margin, ROE, NPL, LDR, CAR) tidak butuh harga; P/E, mcap, yield, P/B butuh harga + tanggal.",
        "Harga penutupan terakhir sebelum tanggal target bila tanggal target bukan hari bursa — dan catat tanggal aktualnya.",
      ],
      quiz: [
        {
          q: "Dengan EPS KLBF FY2024 Rp70,16 dan harga ilustratif Rp1.650, berapa P/E-nya?",
          options: [
            { text: "4,1", why: "Salah: itu hasil harga 2015 yang dipasangkan dengan laba 2024 — artefak tanggal dari mini-case." },
            { text: "23,52", why: "Tepat: 1.650 dibagi 70,16 = 23,52. Harga ilustratif; laba dan EPS nyata dari benchmark.", correct: true },
            { text: "39,71", why: "Salah: itu gross margin KLBF, bukan P/E." },
            { text: "76,21", why: "Salah: itu kapitalisasi pasar dalam triliun rupiah, bukan P/E." },
          ],
        },
        {
          q: "Harga mana yang selaras dengan laba FY2024 (periode berakhir 31 Des 2024)?",
          options: [
            { text: "Harga 30 Jun 2024", why: "Salah: dari tengah periode — look-ahead, setengah laba belum terjadi." },
            { text: "Harga 31 Mar 2025 (setelah akhir periode)", why: "Tepat: harga setelah akhir periode, idealnya setelah filing terbit.", correct: true },
            { text: "Harga berapa pun, asal dari tahun yang sama", why: "Salah: 'tahun yang sama' mencakup harga dari tengah periode — tetap look-ahead." },
            { text: "Harga hari ini, untuk laba tahun berapa pun", why: "Salah: harga hari ini untuk laba dua tahun lalu adalah rasio kedaluwarsa." },
          ],
        },
        {
          q: "Kenapa return harus dihitung dari adjusted close, bukan close biasa?",
          options: [
            { text: "Karena adjusted close selalu lebih tinggi", why: "Salah: adjusted bisa lebih rendah — ia bukan soal tinggi-rendah." },
            { text: "Karena stock split dan dividen membuat close biasa menunjukkan jatuh yang tidak pernah terjadi", why: "Tepat: penyesuaian aksi korporasi menghilangkan 'crash' palsu dari deret return.", correct: true },
            { text: "Karena SEC mewajibkannya", why: "Salah: ini soal kebenaran hitungan, bukan aturan SEC." },
            { text: "Karena volume hanya tersedia untuk adjusted close", why: "Salah: volume tersedia untuk harga apa pun — keduanya tidak berhubungan." },
          ],
        },
        {
          q: "Tanggal target 31 Mar 2025 bukan hari bursa. Apa yang dilakukan?",
          options: [
            { text: "Pakai harga 1 Apr 2025 dan catat sebagai 31 Mar", why: "Salah: harga setelah tanggal target mengandung informasi masa depan — dan mencatat tanggal yang salah adalah provenance palsu." },
            { text: "Pakai harga penutupan terakhir sebelum tanggal target dan catat tanggal aktualnya", why: "Tepat: mundur ke harga terakhir yang tersedia, dengan tanggal yang jujur.", correct: true },
            { text: "Kosongkan harga hari itu", why: "Salah: mengosongkan membuang informasi yang tersedia — harga terakhir adalah jawaban yang benar." },
            { text: "Pakai rata-rata harga minggu itu", why: "Salah: rata-rata mengubah definisi 'harga penutupan' menjadi sesuatu yang lain tanpa memberi tahu pembaca." },
          ],
        },
        {
          q: "Rasio mana yang TIDAK membutuhkan data harga pasar?",
          options: [
            { text: "P/E", why: "Salah: P/E = harga dibagi EPS — harga adalah pembilangnya." },
            { text: "Kapitalisasi pasar", why: "Salah: harga dikali saham beredar — tanpa harga tidak ada kapitalisasi." },
            { text: "Gross margin KLBF 39,71 persen", why: "Tepat: laba bruto dibagi penjualan — keduanya dari filings, tanpa harga.", correct: true },
            { text: "Dividend yield", why: "Salah: dividen per saham dibagi harga — harga adalah penyebutnya." },
          ],
        },
      ],
    },
  ],
};
