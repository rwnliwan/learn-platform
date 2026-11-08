import type { V2Lesson } from "../lib/types";

export const e34: V2Lesson = {
  slug: "e34-swap-valuasi",
  track: "Financial Markets",
  module: "Derivatif & Suku Bunga",
  title: "E34 — Swap sebagai Instrumen: Valuasi, Kurva, dan Swap Spread",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Swap yang bernilai nol saat ditandatangani, lalu bernilai minus Rp94 juta",
      prose: [
        "PT SinarAbadi menandatangani interest rate swap tiga tahun: notional Rp10 miliar, membayar fixed 7 persen per tahun, menerima floating. Saat ditandatangani, nilai swap itu nol — seperti semua swap baru. Setahun berlalu. Suku bunga turun: diskonto 1 tahun 6 persen, 2 tahun 6,5 persen. Tiba-tiba swap itu bernilai minus Rp94.131.684 bagi SinarAbadi — kewajiban yang harus dibayar bila swap ditutup hari ini. Tidak ada yang 'rusak': inilah valuasi swap bekerja.",
        "Swap bukan taruhan satu arah — ia dua kaki yang masing-masing punya nilai kini. Kaki fixed adalah obligasi berkupon tetap; kaki floating adalah obligasi yang harganya kembali ke par di tiap tanggal reset. Nilai swap = selisih keduanya. Saat suku bunga turun, kaki fixed (yang membayar 7 persen saat pasar hanya 6 persen) menjadi mahal — dan pihak yang membayar fixed menanggung selisihnya.",
        "Lesson ini mengambil sudut yang belum ada: PM-A8 mengajarkan swap sebagai alat lindung nilai (bayar fixed, terima floating, net terkunci 10 persen), tetapi tidak pernah menilainya. Di sini kamu menghitung nilai kini kedua kaki, membangun kurva swap, dan membaca swap spread. Setelah lesson ini kamu bisa: (1) menghitung nilai swap dari nilai kini kedua kakinya; (2) menjelaskan kenapa kaki floating bernilai par saat reset; (3) membangun kurva swap dari suku bunga pasar; (4) membaca swap spread; (5) menjelaskan OIS discounting dan cross-currency basis.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-A8 (Derivatives) membahas interest rate swap sebagai alat lindung nilai: bayar fixed 8 persen, terima floating, net terkunci — dengan contoh utang Rp400 juta. Tidak ada valuasi: tidak ada nilai kini kaki fixed vs floating, tidak ada kurva swap, tidak ada swap spread. Lesson ini membangun sudut valuasi Financial Markets itu dari nol.",
      },
      reference: "Notional Rp10 miliar, fixed 7 persen, sisa 2 tahun. PV kaki fixed Rp10.094.131.684; kaki floating Rp10.000.000.000; nilai swap bagi pembayar fixed minus Rp94.131.684.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memberi harga pada swap — bukan hanya memakainya.",
        "(1) Menghitung nilai kini kaki fixed dan kaki floating;",
        "(2) Menjelaskan kenapa kaki floating bernilai par pada tanggal reset;",
        "(3) Membangun kurva swap (par swap rate) dari suku bunga pasar;",
        "(4) Membaca swap spread sebagai sinyal risiko;",
        "(5) Menjelaskan OIS discounting dan cross-currency basis.",
      ],
      tasks: [],
    },
    {
      id: "valuasi",
      eyebrow: "Langkah 3 · Teori",
      title: "Valuasi: swap adalah dua obligasi yang saling meniadakan",
      prose: [
        "Interest rate swap plain vanilla terdiri dari dua kaki. Kaki fixed: membayar kupon tetap (misalnya 7 persen dari notional) tiap periode plus notional di akhir — persis obligasi berkupon tetap. Kaki floating: membayar suku bunga pasar yang di-reset tiap periode plus notional di akhir — persis obligasi berbunga mengambang. Nilai swap bagi pihak pembayar fixed = PV kaki floating DIKURANGI PV kaki fixed. Bila fixed yang dibayar lebih tinggi dari pasar, selisihnya negatif — swap menjadi kewajiban.",
        "Kunci valuasi ada pada kaki floating: pada tanggal reset, nilainya SAMA DENGAN notional (par) — TETAPI hanya di bawah asumsi single-curve: kurva yang dipakai memproyeksikan suku bunga floating adalah kurva yang sama dengan kurva diskonto, valuasi tepat pada tanggal reset/setelah pembayaran, dan tanpa spread di atas suku bunga acuan. Alasannya: obligasi floating membayar kupon pasar yang baru saja di-reset — jadi harga pasarnya kembali ke par, seperti obligasi yang baru diterbitkan. Sejak 2008 pasar memakai multi-curve — kaki floating diproyeksikan dari kurva forward (mis. SOFR) tetapi didiskonto dengan OIS — sehingga nilainya mendekati par tetapi tidak persis par. Di antara tanggal reset pun nilainya sedikit di atas atau di bawah par (akrual kupon berikutnya). Dalam lesson ini kita memakai asumsi single-curve agar valuasi tetap dapat dihitung dengan tangan; ingatlah bahwa itu penyederhanaan.",
        "Hitung contoh cerita pembuka. Notional Rp10 miliar, fixed 7 persen, sisa 2 tahun, pembayaran tahunan, diskonto 1 tahun 6 persen dan 2 tahun 6,5 persen. PV kaki fixed = 700.000.000 dibagi 1,06 + 10.700.000.000 dibagi 1,065 kuadrat = 660.377.358 + 9.433.754.326 = Rp10.094.131.684. PV kaki floating = Rp10.000.000.000. Nilai swap bagi pembayar fixed = 10.000.000.000 − 10.094.131.684 = minus Rp94.131.684. Bila SinarAbadi menutup swap hari ini, ia membayar Rp94.131.684 — harga dari mengunci 7 persen saat pasar turun ke 6 persen.",
        "Saat swap baru ditandatangani, fixed rate dipilih agar nilai swap NOL — itulah par swap rate. Bila par swap rate 2 tahun adalah 6,4 persen, maka swap dengan fixed 6,4 persen bernilai nol di awal. Fixed 7 persen di atas par rate berarti pembayar fixed sudah 'membayar lebih' sejak awal — dan nilai awalnya negatif, bukan nol. Inilah sebabnya swap lama bisa bernilai besar positif atau negatif: ia membeku pada rate masa lalu sementara pasar bergerak.",
      ],
      tasks: [],
      formula: String.raw`V_{swap} = PV_{float} - PV_{fixed} \qquad PV_{float} = N \text{ (saat reset)}`,
      formulaNote: "V swap = nilai bagi pembayar fixed; PV fixed = nilai kini kupon tetap plus notional; PV float = notional pada tanggal reset (asumsi single-curve — lihat teori). Contoh: 10.000.000.000 − 10.094.131.684 = minus 94.131.684.",
      reference: "PV kaki fixed Rp10.094.131.684; kaki floating Rp10.000.000.000; nilai swap minus Rp94.131.684.",
    },
    {
      id: "kurva-spread",
      eyebrow: "Langkah 4 · Teori",
      title: "Kurva swap dan swap spread",
      prose: [
        "Kurva swap adalah kumpulan par swap rate untuk tiap tenor — 1, 2, 5, 10, 30 tahun — yang masing-masing membuat swap tenor itu bernilai nol. Kurva ini dibangun (bootstrapping) dari suku bunga pasar: deposito jangka pendek, futures, dan swap yang sudah diperdagangkan. Kurva swap adalah 'kurva yield versi bank' — ia mencerminkan biaya pendanaan antarbank, bukan biaya pendanaan pemerintah.",
        "Swap spread = par swap rate DIKURANGI yield obligasi pemerintah tenor yang sama. Bila swap 10 tahun 7,2 persen dan obligasi pemerintah 10 tahun 6,8 persen, swap spread = 40 bps. Spread ini mencerminkan campuran beberapa hal — risiko kredit perbankan, premi likuiditas, permintaan terhadap obligasi pemerintah, dan tekanan pendanaan — sehingga ia BUKAN ukuran tunggal risiko bank: spread bisa melebar karena likuiditas tanpa bank mana pun memburuk, dan bisa negatif (pernah terjadi pada swap USD jangka panjang). Swap spread yang melebar tajam adalah sirene yang patut diperiksa — bukan vonis bahwa bank lebih berisiko.",
        "Contoh bootstrap kurva swap (dari suku bunga yang dipakai di lesson ini): diskonto 1 tahun 6 persen → DF1 = 1/1,06 = 0,9434; diskonto 2 tahun 6,5 persen → DF2 = 1/1,065² = 0,8817. Par swap rate 2 tahun adalah s yang membuat PV kaki fixed = notional: s × (DF1 + DF2) + DF2 = 1 → s = (1 − 0,8817)/(0,9434 + 0,8817) = 6,48 persen. Periksa: kupon 6,48 persen → 648/1,06 + 10.648/1,065² = 611 + 9.389 ≈ 10.000 — swap bernilai nol. Begitulah kurva dibangun tenor demi tenor: tiap par rate baru memakai discount factor tenor sebelumnya.",
        "Sejak krisis 2008, valuasi memakai OIS discounting: arus kas swap didiskonto dengan suku bunga overnight indexed swap (OIS), bukan dengan LIBOR. Alasannya: swap modern dijamin dengan collateral harian, sehingga pendanaannya mengikuti suku bunga overnight bebas risiko — bukan suku bunga antarbank yang mengandung risiko kredit. Perubahan ini memindahkan nilai swap miliaran dolar antar pihak saat diterapkan — pengingat bahwa 'suku bunga diskonto' bukan detail teknis, melainkan uang.",
        "Cross-currency basis swap menambah satu dimensi: menukar arus kas dalam dua mata uang. Basis adalah premi yang dibayar untuk mendapatkan dolar saat dolar langka — saat krisis, basis melebar karena semua orang berebut dolar. Bank Indonesia dan bank sentral lain memantau basis ini sebagai termometer tekanan dolar global.",
      ],
      tasks: [],
      note: {
        title: "Swap bukan pinjaman",
        body: "Notional swap Rp10 miliar tidak pernah berpindah tangan pada interest rate swap satu mata uang — hanya selisih bunganya yang dibayar (net settlement). Dalam pendekatan valuasi dua-obligasi, pembayaran notional di akhir tiap kaki adalah arus kas HIPOTETIS yang saling meniadakan, bukan pembayaran nyata. Pengecualian: cross-currency swap MEMANG menukar principal di awal dan di akhir. Investor yang mengira swap berarti meminjam Rp10 miliar sedang membayangkan risiko yang tidak ada. Risiko swap ada di nilai kini selisih kakinya — Rp94 juta di contoh kita — bukan di notionalnya.",
      },
      reference: "Swap spread 10 tahun 40 bps (swap 7,2 persen dikurangi obligasi pemerintah 6,8 persen). OIS dipakai untuk discounting sejak 2008.",
    },
    {
      id: "lab-swap",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin valuasi swap",
      prose: [
        "Lab ini membangun mesin valuasi swap: dari notional, fixed rate, dan suku bunga diskonto — hitung PV kaki fixed, nilai swap bagi pembayar fixed, dan selisihnya dalam basis poin dari notional.",
        "Hitung dulu di kepala. PV kaki fixed = 700.000.000 dibagi 1,06 + 10.700.000.000 dibagi 1,065 kuadrat. Suku pertama: 660.377.358. Suku kedua: 1,065 kuadrat = 1,134225; 10.700.000.000 dibagi 1,134225 = 9.433.754.326. Total: Rp10.094.131.684. Nilai swap = 10.000.000.000 − 10.094.131.684 = minus Rp94.131.684. Dalam basis poin dari notional: 94.131.684 dibagi 10.000.000.000 × 10.000 = 94,13 bps.",
        "Tugas lab: tulis fungsi yang menerima notional, fixed rate, dan dua suku bunga diskonto — lalu mencetak PV kaki fixed (dibulatkan), nilai swap (dibulatkan), dan nilai swap dalam bps. Tiga angka ini adalah harga penutupan swap itu hari ini.",
        "Setelah lolos, coba eksperimen: naikkan diskonto 2 tahun menjadi 7,5 persen dan lihat PV kaki fixed turun di bawah notional — swap berbalik menjadi aset bagi pembayar fixed. Lalu tanyakan: berapa par swap rate yang membuat nilai swap tepat nol?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pv_fixed` (nilai kini kaki fixed, dibulatkan)" },
        { id: "t2", text: "Hitung `nilai_swap` (notional - pv_fixed, dibulatkan)" },
        { id: "t3", text: "Hitung `nilai_bps` (nilai swap dalam bps dari notional)" },
      ],
      expected: "pv_fixed=10094131684\nnilai_swap=-94131684\nnilai_bps=-94.13",
      hints: [
        "PV fixed = kupon / (1+r1) + (kupon + notional) / (1+r2)^2.",
        "Kaki floating bernilai par saat reset: PV float = notional.",
        "Nilai swap = notional - pv_fixed; bps = nilai / notional x 10.000.",
      ],
      code: {
        starter: `# Swap: notional Rp10 miliar, fixed 7%, sisa 2 tahun, pembayaran tahunan.\nnotional = 10_000_000_000\nfixed = 0.07\nr1 = 0.06  # diskonto 1 tahun\nr2 = 0.065  # diskonto 2 tahun\n\n# TULIS KODEMU: hitung pv_fixed, nilai_swap, nilai_bps.\n# Cetak, per baris: pv_fixed, nilai_swap, nilai_bps.\n\n`,
        lockLines: 5,
        solution: `# Swap: notional Rp10 miliar, fixed 7%, sisa 2 tahun, pembayaran tahunan.\nnotional = 10_000_000_000\nfixed = 0.07\nr1 = 0.06  # diskonto 1 tahun\nr2 = 0.065  # diskonto 2 tahun\n\n\nkupon = notional * fixed\npv_fixed = round(kupon / (1 + r1) + (kupon + notional) / (1 + r2) ** 2)\nnilai_swap = round(notional - pv_fixed)\nnilai_bps = nilai_swap / notional * 10000\nprint(f"pv_fixed={pv_fixed}")\nprint(f"nilai_swap={nilai_swap}")\nprint(f"nilai_bps={nilai_bps:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "pv_fixed", value: 10094131684, tol: 1, label: "PV kaki fixed Rp10.094.131.684", msg: "660.377.358 + 9.433.754.326 = 10.094.131.684. Kupon 7 persen lebih mahal dari pasar 6 persen." },
          { kind: "equal", task: "t2", name: "nilai_swap", value: -94131684, tol: 1, label: "Nilai swap minus Rp94.131.684", msg: "10.000.000.000 - 10.094.131.684 = -94.131.684. Negatif = kewajiban bagi pembayar fixed." },
          { kind: "equal", task: "t3", name: "nilai_bps", value: -94.13, tol: 0.01, label: "Nilai swap minus 94,13 bps", msg: "94.131.684 / 10.000.000.000 x 10.000 = 94,13 bps. Itulah harga penutupan swap hari ini." },
        ],
      },
      reference: "PV kaki fixed Rp10.094.131.684; nilai swap minus Rp94.131.684 (minus 94,13 bps).",
    },
    {
      id: "penggunaan",
      eyebrow: "Langkah 6 · Teori",
      title: "Penggunaan: lindung nilai, spekulasi, dan arbitrase",
      prose: [
        "Tiga motif memakai swap. Lindung nilai: perusahaan dengan utang floating membayar fixed untuk mengunci biaya bunga (PM-A8) — motif SinarAbadi. Spekulasi: trader yang yakin suku bunga turun menerima fixed (kebalikan dari SinarAbadi) — bila benar, swapnya bernilai positif besar. Arbitrase: memanfaatkan selisih antara swap spread dan spread obligasi korporat (asset swap) — membeli obligasi korporat, men-swap kuponnya menjadi floating, dan memanen selisih spread.",
        "Risiko yang sering dilupakan: counterparty risk. Swap adalah kontrak OTC bilateral — bila lawan transaksi gagal, swap berhargamu bisa lenyap. Sejak 2008, sebagian besar swap standar wajib di-clearing lewat central counterparty (CCP) dengan margin harian — MR23 membahas mekanismenya. Swap yang tidak di-clearing tetap memakai CSA (credit support annex) dengan collateral. Pelajaran 2008: AIG menjual proteksi lewat CDS — sepupu swap — tanpa collateral yang cukup, dan hampir menjatuhkan sistem keuangan.",
        "Aturan penutup: nilai swap setiap hari. Swap yang bernilai nol saat ditandatangani bukan swap yang bernilai nol selamanya — ia bergerak bersama kurva. Perusahaan yang tidak menandai swap-nya ke pasar (mark-to-market) akan kaget saat menutupnya, seperti SinarAbadi yang menemukan kewajiban Rp94 juta. Akuntansi lindung nilai (hedge accounting, PSAK 109) mengizinkan pergerakan itu dicatat di ekuitas — tetapi hanya bila dokumentasi lindung nilainya lengkap sejak awal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira nilai swap sama dengan notional. Notional tidak pernah berpindah dan bukan nilai swap. Nilai swap adalah selisih nilai kini kedua kakinya — Rp94 juta di contoh kita, bukan Rp10 miliar.",
      },
      reference: "Tiga motif: lindung nilai, spekulasi, arbitrase. Swap standar wajib clearing lewat CCP sejak 2008.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: tutup atau tahan?",
      prose: [
        "Setahun setelah penandatanganan, bendahara SinarAbadi menghadapi pilihan: menutup swap dengan membayar Rp94.131.684, atau menahannya satu tahun lagi. Suku bunga pasar 6 persen; swap membayar fixed 7 persen. Bila suku bunga tetap 6 persen, tahun depan — dengan sisa tenor satu tahun — swap masih bernilai negatif sekitar minus Rp94 juta: PV kaki fixed = 10.700.000.000/1,06 = Rp10.094.339.623, selisihnya tetap sekitar Rp94 juta karena selisih kupon 1 poin atas notional Rp10 miliar. Bila suku bunga naik ke 7,5 persen, swap berbalik positif.",
        "Keputusan yang benar tidak ditentukan oleh tebakan suku bunga — melainkan oleh tujuan awal swap: lindung nilai. Swap itu dibeli untuk mengunci biaya bunga, bukan untuk berspekulasi. Menutupnya karena 'rugi Rp94 juta' berarti mengubah lindung nilai menjadi spekulasi suku bunga — dan bendahara bukan trader suku bunga. Selama utang floating yang dilindungi masih ada, swap dipertahankan; kerugiannya adalah harga kepastian yang sudah disepakati sejak awal.",
        "Tetapi ada satu pengecualian: bila utang yang dilindungi sudah dilunasi atau di-refinancing, swap menjadi posisi spekulasi telanjang — dan harus ditutup. Lindung nilai tanpa eksposur yang dilindungi bukan lindung nilai; ia taruhan. Inilah disiplin yang membedakan bendahara dari spekulan: lindung nilai mengikuti eksposur, bukan mengikuti pasar.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, nilai swap dihitung (Rp94 juta), bukan ditebak. Kedua, keputusan mengikuti tujuan awal (lindung nilai), bukan emosi terhadap kerugian mark-to-market. Ketiga, ada aturan keluar yang jelas: bila eksposur hilang, swap ditutup.",
      },
      reference: "Tahan selama utang yang dilindungi masih ada; tutup bila eksposur hilang. Kerugian Rp94 juta adalah harga kepastian.",
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
        "PV kaki fixed Rp10.094.131.684; kaki floating Rp10.000.000.000; nilai swap minus Rp94.131.684 (minus 94,13 bps).",
        "Kaki floating bernilai par pada tanggal reset.",
        "Par swap rate adalah fixed rate yang membuat nilai swap nol.",
        "Swap spread = par swap rate dikurangi yield obligasi pemerintah.",
        "Notional tidak berpindah — hanya selisih bunga yang dibayar.",
      ],
      next: { label: "E35 — Kebijakan Moneter dan Bank Sentral: Cara Suku Bunga Menggerakkan Pasar", href: "/v2/learn/e35-kebijakan-moneter" },
      quiz: [
        {
          q: "Swap notional Rp10 miliar, fixed 7 persen, sisa 2 tahun, diskonto 1 tahun 6 persen dan 2 tahun 6,5 persen. Berapa PV kaki fixed dan nilai swap bagi pembayar fixed?",
          options: [
            { text: "PV fixed Rp10.094.131.684; nilai swap minus Rp94.131.684", why: "Tepat: 700 jt / 1,06 + 10.700 jt / 1,065² = 10.094.131.684; 10.000.000.000 − 10.094.131.684 = −94.131.684.", correct: true },
            { text: "PV fixed Rp10.000.000.000; nilai swap Rp0", why: "Salah: Rp10 miliar adalah nilai kaki FLOATING (par saat reset). Kaki fixed dengan kupon 7 persen di atas pasar bernilai lebih dari par." },
            { text: "PV fixed Rp10.700.000.000; nilai swap minus Rp700.000.000", why: "Salah: itu jumlah arus kas tanpa diskonto. Nilai kini harus mendiskonto tiap arus kas dengan sukunya masing-masing." },
            { text: "PV fixed Rp9.433.754.326; nilai swap Rp566.245.674", why: "Salah: 9.433.754.326 hanya suku kedua (tahun ke-2). Suku pertama (660.377.358) tertinggal." },
          ],
        },
        {
          q: "Kenapa kaki floating swap bernilai sama dengan notional pada tanggal reset?",
          options: [
            { text: "Karena notional selalu dibayar di tanggal reset", why: "Salah: notional tidak dibayar di tanggal reset — hanya kuponnya yang di-reset. Notional hanya dibayar di akhir." },
            { text: "Karena kupon floating baru saja di-reset ke suku bunga pasar — seperti obligasi yang baru diterbitkan, harganya kembali ke par", why: "Tepat: kupon pasar berarti harga par. Inilah yang menyederhanakan valuasi swap.", correct: true },
            { text: "Karena regulator menetapkan nilai kaki floating sama dengan notional", why: "Salah: bukan aturan regulator — ini konsekuensi matematika dari kupon yang di-reset ke pasar." },
            { text: "Karena suku bunga floating selalu sama dengan fixed rate", why: "Salah: floating berubah-ubah mengikuti pasar; fixed tetap. Keduanya hanya sama di tanggal penandatanganan (par swap rate)." },
          ],
        },
        {
          q: "Par swap rate 10 tahun 7,2 persen, yield obligasi pemerintah 10 tahun 6,8 persen. Berapa swap spread dan apa artinya?",
          options: [
            { text: "40 bps — pasar menagih premi yang mencerminkan campuran risiko bank, likuiditas, dan pendanaan di atas pemerintah; bukan bukti tunggal bahwa bank lebih berisiko", why: "Tepat: 7,2 − 6,8 = 0,4 persen = 40 bps. Spread bisa melebar karena likuiditas tanpa bank memburuk, dan bisa negatif — ia sinyal yang harus diperiksa, bukan vonis.", correct: true },
            { text: "140 bps — spread adalah jumlah kedua suku bunga", why: "Salah: spread adalah SELISIH, bukan jumlah. 7,2 + 6,8 tidak punya arti ekonomi di sini." },
            { text: "0 bps — swap dan obligasi pemerintah selalu sama", why: "Salah: keduanya berbeda — swap mengandung risiko bank, obligasi pemerintah tidak. Spread hampir tidak pernah nol." },
            { text: "40 bps — tetapi artinya obligasi pemerintah lebih berisiko dari bank", why: "Salah: terbalik. Spread positif biasanya berarti pasar meminta premi di atas pemerintah — tetapi spread mencampur risiko bank, likuiditas, dan pendanaan, bukan satu peringkat risiko." },
          ],
        },
        {
          q: "Swap barumu bernilai nol hari ini. Setahun kemudian suku bunga turun 1 persen. Apa yang terjadi pada swapmu sebagai pembayar fixed?",
          options: [
            { text: "Tetap nol — swap selalu bernilai nol", why: "Salah: swap hanya nol saat ditandatangani. Setelah itu nilainya bergerak bersama kurva." },
            { text: "Menjadi negatif — kamu terkunci membayar fixed di atas pasar", why: "Tepat: kaki fixed-mu (rate lama yang tinggi) menjadi mahal; nilai swap bagi pembayar fixed turun.", correct: true },
            { text: "Menjadi positif — suku bunga turun selalu menguntungkan", why: "Salah: suku bunga turun menguntungkan PENERIMA fixed, bukan pembayar fixed. Posisimu yang menentukan." },
            { text: "Menjadi sama dengan notional", why: "Salah: nilai swap tidak pernah sama dengan notional. Notional bukan nilai swap." },
          ],
        },
        {
          q: "Kenapa valuasi swap modern memakai OIS discounting, bukan LIBOR?",
          options: [
            { text: "Karena OIS lebih tinggi dari LIBOR sehingga valuasi lebih konservatif", why: "Salah: bukan soal tinggi-rendah. OIS dipakai karena swap dijamin collateral harian — pendanaannya mengikuti overnight, bukan antarbank." },
            { text: "Karena swap di-collateral harian — pendanaannya mengikuti suku bunga overnight bebas risiko", why: "Tepat: collateral harian berarti eksposur didanai overnight. LIBOR mengandung risiko kredit bank yang tidak relevan lagi.", correct: true },
            { text: "Karena LIBOR sudah tidak pernah dipakai di pasar mana pun", why: "Salah: LIBOR memang dihentikan, tetapi alasannya bukan itu — OIS dipilih karena mencerminkan pendanaan ber-collateral." },
            { text: "Karena OIS membuat nilai swap selalu nol", why: "Salah: OIS mengubah DISKONTO, bukan nilai swap menjadi nol. Swap lama tetap bernilai positif atau negatif." },
          ],
        },
      ],
    },
  ],
};
