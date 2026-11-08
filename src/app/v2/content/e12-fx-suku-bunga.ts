import type { V2Lesson } from "../lib/types";

export const e12: V2Lesson = {
  slug: "e12-fx-suku-bunga",
  track: "Financial Markets",
  module: "Makro & Valas",
  title: "E12. Kurs & Suku Bunga",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-rupiah",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Rupiah melemah — salah siapa?",
      prose: [
        "USD/IDR menembus Rp16.500. Media ribut: “Rupiah terpuruk!” Tapi di saat yang sama, bank sentral AS menaikkan suku bunga — dolar menguat terhadap semua mata uang dunia, dari yen sampai euro. Rupiah “melemah” 3%, yen melemah 8%. Pertanyaan yang benar bukan “kenapa rupiah melemah?” melainkan “melemah terhadap apa, dan karena apa?”",
        "Nilai tukar = harga relatif dua ekonomi. Covered interest parity: kurs forward “wajar” ditentukan selisih suku bunga dua negara — kalau tidak, ada peluang arbitrase (secara teori bebas risiko \u2014 dalam praktik, biaya transaksi, friksi pasar, dan risiko eksekusi membuat arbitrase 'bebas risiko' jarang benar-benar bebas risiko). Spot 16.500, bunga IDR 6%, USD 4,5%, T = 1 tahun → hitung forward wajarnya.",
      ],
      formula: String.raw`F = S \times \frac{1 + r_d \cdot T}{1 + r_f \cdot T}`,
      formulaNote: "F = forward wajar; S = spot; r_d = bunga domestik; r_f = bunga asing; T = tenor (tahun).",
      tasks: [
        { id: "t1", text: "Hitung `F_wajar` (forward 1 tahun)" },
        { id: "t2", text: "Hitung `premium` (forward premium dalam %, 2 desimal)" },
      ],
      expected: "F_wajar=16737  premium=1.44",
      note: {
        title: "Sering salah",
        body: "Membaca USD/IDR naik sebagai “rupiah menguat”. Konvensi: USD/IDR naik = rupiah MELEMAH (butuh lebih banyak rupiah per dolar). Jangan terbalik — ini sumber salah baca #1.",
      },
      hints: [
        "F = 16500 × (1 + 0,06×1)/(1 + 0,045×1).",
        "premium = (F/S − 1) × 100.",
        "premium = (F_wajar / 16500 - 1) * 100",
      ],
      code: {
        starter: `S = 16500\nr_idr, r_usd, T = 0.06, 0.045, 1.0\n\n# TULIS KODEMU: forward wajar dan forward premium (%)\nF_wajar = \npremium = \n\nprint(f"F_wajar={F_wajar:.0f}  premium={premium:.2f}")`,
        lockLines: 2,
        solution: `S = 16500\nr_idr, r_usd, T = 0.06, 0.045, 1.0\n\n# TULIS KODEMU: forward wajar dan forward premium (%)\nF_wajar = S * (1 + r_idr * T) / (1 + r_usd * T)\npremium = (F_wajar / S - 1) * 100\n\nprint(f"F_wajar={F_wajar:.0f}  premium={premium:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "F_wajar", value: 16736.84, tol: 0.5, label: "`F_wajar` sekitar 16737", msg: "16500 × 1,06/1,045 = 16736,84. Murni selisih bunga — tanpa ramalan ekonomi." },
          { kind: "equal", task: "t2", name: "premium", value: 1.44, tol: 0.01, label: "`premium` sekitar 1,44", msg: "(16737/16500 − 1) × 100 = 1,44%. Pasar “wajar” mematok rupiah melemah 1,44%/tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "F_wajar=16737\\s+premium=1\\.44", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Forward wajar = S × (1+r_d·T)/(1+r_f·T) — hasil arbitrase bunga, BUKAN ramalan.",
    },
    {
      id: "ppp-bi",
      eyebrow: "Langkah 2 · PPP & Bank Indonesia",
      title: "Daya beli dan sang pengatur suku bunga",
      prose: [
        "Purchasing power parity: dalam jangka panjang, kurs bergerak mengikuti selisih inflasi — mata uang negara berinflasi tinggi cenderung melemah. Indonesia inflasi 3%, AS 2% → rupiah “wajar” melemah ≈ 1%/tahun. PPP = kompas jangka panjang, bukan sinyal trading.",
        "BI menjalankan kebijakan moneter dengan instrumen utama BI-Rate. Rantai transmisi: BI naikkan BI-Rate → bunga pasar uang dan deposito naik → bunga kredit naik → orang malas pinjam, rajin nabung → belanja turun → inflasi turun, tapi pertumbuhan melambat. Ke nilai tukar: bunga IDR naik → aset IDR lebih menarik → rupiah cenderung menguat (jangka pendek). Inilah dilema BI.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menaikkan bunga untuk jaga rupiah dan inflasi = mengorbankan pertumbuhan. Investor yang membaca keputusan BI-Rate membaca arah biaya kredit, daya beli, dan arus modal sekaligus.",
      },
      reference: "PPP: depresiasi ≈ selisih inflasi. BI-Rate naik → inflasi & rupiah dijaga, pertumbuhan dikorbankan.",
    },
    {
      id: "bunga-riil",
      eyebrow: "Langkah 3 · Bunga riil",
      title: "Kuliti brosur: berapa daya belimu sebenarnya?",
      prose: [
        "Bunga nominal = angka di brosur. Bunga riil = daya beli sebenarmu setelah inflasi: 1 + r_riil = (1 + r_nom)/(1 + π). Aproksimasi cepat: r_nom − π (cukup akurat untuk angka kecil).",
        "Deposito 2022: nominal 4%, inflasi 5,5% → riil ≈ −1,4%: uangmu “bertambah” tapi daya belinya menyusut! Hitung bunga riil tiga produk: deposito 2023 (4,5%, inflasi 2,6%), deposito 2022 (4%, 5,5%), SBN ritel 2024 (6,4%, 1,6%).",
      ],
      formula: String.raw`1 + r_{\text{riil}} = \frac{1 + r_{\text{nom}}}{1 + \pi} \qquad r_{\text{riil}} \approx r_{\text{nom}} - \pi`,
      formulaNote: "r_riil = bunga riil (daya beli); r_nom = bunga nominal (angka brosur); π = inflasi. Rumus eksak membagi; aproksimasi r_nom − π cukup akurat untuk angka kecil. Contoh: deposito 4%, inflasi 5,5% → riil = 1,04÷1,055 − 1 = −1,42%: nominal “bertambah”, daya beli menyusut.",
      tasks: [
        { id: "t1", text: "Hitung `riil_2022` (deposito 2022, desimal)" },
        { id: "t2", text: "Hitung `riil_sbn` (SBN ritel 2024, desimal)" },
      ],
      expected: "riil_2022=-0.0142  riil_sbn=0.0472",
      note: {
        title: "Sering salah",
        body: "Membandingkan produk dalam bunga nominal. Negara berbunga nominal 15% tapi inflasi 14% = sama saja dengan negara berbunga 3% dan inflasi 2%. Bandingkan selalu dalam riil.",
      },
      hints: [
        "riil = (1 + nom)/(1 + inflasi) − 1.",
        "Deposito 2022: nom = 0,04, inflasi = 0,055.",
        "SBN 2024: nom = 0,064, inflasi = 0,016.",
      ],
      code: {
        starter: `# (nama, bunga nominal, inflasi)\ndata = [\n    ("Deposito 2023", 0.045, 0.026),\n    ("Deposito 2022", 0.040, 0.055),\n    ("SBN ritel 2024", 0.064, 0.016),\n]\n\n# TULIS KODEMU: bunga riil tiap produk, simpan di dict riil,\n# lalu salin ke variabel standalone riil_2022 dan riil_sbn (sekali saja).\nriil = {}\n\nprint(f"riil_2022={riil_2022:.4f}  riil_sbn={riil_sbn:.4f}")`,
        lockLines: 6,
        solution: `# (nama, bunga nominal, inflasi)\ndata = [\n    ("Deposito 2023", 0.045, 0.026),\n    ("Deposito 2022", 0.040, 0.055),\n    ("SBN ritel 2024", 0.064, 0.016),\n]\n\n# TULIS KODEMU: bunga riil tiap produk, simpan di dict riil,\n# lalu salin ke variabel standalone riil_2022 dan riil_sbn (sekali saja).\nriil = {}\nfor nama, nom, inf in data:\n    riil[nama] = (1 + nom) / (1 + inf) - 1\nriil_2022 = riil["Deposito 2022"]\nriil_sbn = riil["SBN ritel 2024"]\n\nprint(f"riil_2022={riil_2022:.4f}  riil_sbn={riil_sbn:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "riil_2022", value: -0.0142, tol: 0.0001, label: "`riil_2022` sekitar −0,0142", msg: "(1,04/1,055) − 1 = −1,42%. Daya beli TURUN meski nominal naik." },
          { kind: "equal", task: "t2", name: "riil_sbn", value: 0.0472, tol: 0.0001, label: "`riil_sbn` sekitar 0,0472", msg: "(1,064/1,016) − 1 = 4,72%. Bandingkan ini, bukan angka brosur." },
        ],
      },
      reference: "Bunga riil = kebenaran pahit di balik brosur. Nominal menipu saat inflasi tinggi.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang konvensi kurs dan forward.",
      ],
      tasks: [],
      quiz: [
        {
          q: "USD/IDR naik dari 16.000 ke 16.500. Artinya…",
          options: [
            { text: "Rupiah menguat", why: "Salah: terbalik. USD/IDR naik = rupiah melemah." },
            { text: "Rupiah melemah — butuh lebih banyak rupiah per dolar", why: "Benar: konvensi USD/IDR naik = IDR melemah.", correct: true },
            { text: "Dolar melemah", why: "Salah: dolar justru menguat terhadap rupiah." },
            { text: "Tidak ada artinya", why: "Salah: artinya jelas — rupiah melemah 3,1%." },
          ],
        },
        {
          q: "Spot 16.500, bunga IDR 6%, USD 4,5%, 1 tahun. Forward wajar?",
          options: [
            { text: "Rp16.500 (sama dengan spot)", why: "Salah: forward menyimpang dari spot sebesar selisih bunga." },
            { text: "Rp16.737 — forward premium dari selisih bunga (arbitrase)", why: "Benar: 16.500 × 1,06/1,045. Hasil arbitrase, bukan ramalan.", correct: true },
            { text: "Rp15.000 (ramalan penguatan)", why: "Salah: forward bukan ramalan — ia konsekuensi aritmetika bunga." },
            { text: "Tidak bisa dihitung", why: "Salah: bisa — covered interest parity." },
          ],
        },
      ],
    },
    {
      id: "minicase-importir",
      eyebrow: "Langkah 5 · Mini-case",
      title: "PT Maju Plastik: hedge atau firasat?",
      prose: [
        "PT Maju Plastik harus bayar pemasok USD 500 ribu dalam 6 bulan. Spot Rp16.500, bunga IDR 6%, USD 4,5%. Bank menawarkan forward 6 bulan. Direksi “yakin rupiah akan menguat ke Rp16.000” (firasat!).",
        "Pertanyaan: (a) Hitung forward wajar 6 bulan. (b) Jika ikut firasat dan tidak hedge, berapa risiko rupiahnya jika kurs jadi Rp17.500? (c) Keputusan profesionalnya?",
        "Pembahasan: (a) F = 16.500 × 1,03/1,0225 = Rp16.621. Biaya kepastian ≈ Rp121/USD × 500 ribu = Rp60,5 juta di atas spot kini. (b) Tanpa hedge @17.500: bayar Rp8,75 M vs Rp8,31 M (forward) → rugi tambahan Rp440 juta — 7× lipat “biaya” hedging. Firasat direksi = spekulasi dengan uang perusahaan. (c) Hedge. Tugas direktur keuangan = menghilangkan risiko kurs, bukan menebaknya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Firasat bukan strategi treasury. Biaya hedging (Rp60,5 juta) vs potensi rugi tanpa hedge (Rp440 juta) = asimetri yang harus dihitung, bukan dirasakan.",
      },
      reference: "Punya kewajiban valas → hedge. Firasat direksi bukan strategi treasury.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Membaca sinyal BI & kurs: empat skenario",
      prose: [
        "BI menaikkan BI-Rate → siap-siap: bunga kredit dan deposito ikut naik (rantai transmisi moneter). Rupiah melemah tajam dan cepat → cek: dolar global menguat atau rupiah bermasalah? Bandingkan dengan THB, MYR, PHP di periode sama — pelemahan merata = sentimen global.",
        "Punya utang/kewajiban USD → hedge dengan forward (kontrak mengunci kurs beli/jual di tanggal depan): premi forward (selisih forward terhadap spot) adalah HARGA KEPASTIAN relatif terhadap spot hari ini — bukan 'biaya' dalam arti kerugian yang pasti. Biaya ekonomi hedging yang sebenarnya baru terlihat setelah tanggal jatuh tempo: bila kurs akhirnya di bawah forward, kamu 'membayar lebih' dari harga pasar; bila di atas forward, hedging justru menghematmu. Yang dihitung sebelum memutuskan adalah premi forward itu — apakah kepastian itu sepadan. Membandingkan produk investasi → pakai bunga riil (nominal − inflasi), bukan nominal, lalu sesuaikan dengan risikonya.",
        "Aturan 10 detik: USD/IDR naik = rupiah melemah, jangan terbalik. Forward = arbitrase bunga, bukan ramalan. PPP = kompas jangka panjang. Baca RDG seperti prakiraan cuaca.",
      ],
      tasks: [],
      reference: "Tiga kebiasaan analis FX: bandingkan dalam riil; bedakan level vs perubahan; tanya mata uang pembandingnya.",
    },
    {
      id: "fx-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: carry & transmisi",
      title: "Carry trade, paritas tertutup, dan jalan BI rate ke kreditmu",
      prose: [
        "Carry trade = pinjam di mata uang berbunga rendah, investasikan di berbunga tinggi. Pinjam yen 0,5%, konversi, beli SBN 6,8% — selisih 6,3% terasa seperti uang gratis. Sampai unwind: saat panik global, semua carry trader keluar bersamaan — jual rupiah, beli kembali yen — rupiah anjlok TEPAT saat kamu paling butuh stabil. 2008 dan Maret 2020: carry trade yang “aman” bertahun-tahun evaporasi dalam hitungan minggu. Carry = pungut receh di depan buldoser.",
        "Kenapa forward USD/IDR “mahal” (premi forward)? Bukan ramalan pelemahan rupiah — melainkan aritmetika paritas tertutup (CIP): F = S(1+r_d·T)/(1+r_f·T). Bunga rupiah > dolar → forward rupiah “terdepresiasi” secara matematis. Forward ≠ prediksi; forward = harga yang membuat arbitrase tidak mungkin. Deviasi dari CIP = peluang arbitrase — atau tanda biaya/risiko yang belum kamu lihat.",
        "Bagaimana BI rate sampai ke cicilan KPR-mu? Rantai transmisi: BI rate → SRBI & PUAB (pasar uang, hitungan hari) → bunga deposito (minggu–bulan) → bunga kredit (3–6 bulan lag). Bank tidak langsung menurunkan kredit saat BI rate turun: mereka menunggu biaya dananya (deposito lama) ikut turun. Makanya keluhan “BI rate turun kok KPR-ku tetap” selalu muncul — transmisinya butuh waktu, dan tidak pernah 1:1.",
        "Aturan praktis: (1) carry trade = sizing kecil, stop jelas — risikonya korelasi (semua rugi bersamaan); (2) jangan baca forward sebagai ramalan arah kurs; (3) eksportir/importir: lindungi arus kas dengan forward, jangan berspekulasi arah — tugasmu jualan, bukan menebak BI.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hasil_idr` (pinjaman dikonversi + SBN 1 tahun)" },
        { id: "t2", text: "Hitung `rugi` saat unwind (kurs 16.500)" },
      ],
      expected: "hasil_idr=1708800000  rugi=23700000",
      hints: [
        "hasil_idr = pinjam_usd × kurs_awal × (1 + bunga_idr).",
        "bayar_idr = pinjam_usd × (1 + bunga_usd) × kurs_akhir; rugi = bayar − hasil.",
      ],
      code: {
        starter: `pinjam_usd = 100_000\nbunga_usd = 0.05\nkurs_awal = 16_000\nbunga_idr = 0.068\nkurs_akhir = 16_500   # rupiah melemah saat unwind\n\n# TULIS KODEMU\nhasil_idr = \nbayar_idr = \nrugi = \n\nprint(f"hasil_idr={hasil_idr:.0f}  rugi={rugi:.0f}")`,
        lockLines: 5,
        solution: `pinjam_usd = 100_000\nbunga_usd = 0.05\nkurs_awal = 16_000\nbunga_idr = 0.068\nkurs_akhir = 16_500   # rupiah melemah saat unwind\n\n# TULIS KODEMU\nhasil_idr = pinjam_usd * kurs_awal * (1 + bunga_idr)\nbayar_idr = pinjam_usd * (1 + bunga_usd) * kurs_akhir\nrugi = bayar_idr - hasil_idr\n\nprint(f"hasil_idr={hasil_idr:.0f}  rugi={rugi:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hasil_idr", value: 1708800000, tol: 1, label: "`hasil_idr` seharusnya 1708800000", msg: "100.000 × 16.000 × 1,068 = Rp1.708.800.000 = Rp1.708,8 juta (Rp1,7088 miliar)." },
          { kind: "equal", task: "t2", name: "rugi", value: 23700000, tol: 1, label: "`rugi` seharusnya 23700000", msg: "Bayar 105.000×16.500 = 1.732,5M > hasil 1.708,8M. Unwind memakan selisih bunga setahun." },
          { kind: "stdout_matches", task: "t2", pattern: "hasil_idr=1708800000\\s+rugi=23700000", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: selisih bunga = sewa risiko",
        body: "Tidak ada makan siang gratis di FX — selisih bunga 6% yang “pasti” selalu dibayar dengan risiko yang belum kelihatan. Empat heuristik. Pertama: carry trade untung sedikit demi sedikit, rugi sekaligus — distribusinya seperti menjual asuransi gempa: premi tiap bulan, bangkrut sekali; sizing harus tahan skenario terburuk, bukan skenario rata-rata. Kedua: forward mahal ≠ rupiah akan melemah — ia cuma cermin selisih bunga (CIP); memakai forward untuk menebak arah seperti memakai termometer untuk meramal cuaca minggu depan. Ketiga: BI rate adalah keran, bukan saklar — butuh 3–6 bulan merembes ke kreditmu lewat SRBI → deposito → kredit, dan bank selalu menahan sebagian; jangan protes di bulan pertama. Keempat: pisahkan peran — eksportir/importir memakai forward untuk mengunci kepastian arus kas (tugasmu jualan, bukan menebak BI); spekulan memakai carry dengan stop jelas; campur keduanya = hedging yang bocor + spekulasi yang tak diakui. Aturan 10 detiknya: butuh lindung nilai → forward; mau untung dari arah kurs → sadari kamu berspekulasi, batasi seperti spekulasi.",
      },
      reference: "Carry = receh vs buldoser. Forward = matematika, bukan ramalan. BI rate butuh 3–6 bulan.",
    },
        {
          id: "gap-r8-bunga-sederhana-majemuk",
          eyebrow: "Langkah tambahan · Gap ronde 8 (R8-G12)",
          title: "Bunga sederhana vs majemuk: forward yang sama, rumusnya beda",
          prose: [
            "Rumus CIP lesson ini — F = S × (1 + r_d·T)/(1 + r_f·T) — memakai BUNGA SEDERHANA: bunga dihitung sekali atas pokok, sebanding dengan tenor. Itu asumsi yang sah untuk tenor pendek dan pasar uang (yang memang mengutip simple interest) — tetapi BUKAN rumus universal. Bila suku bunga yang kamu pakai adalah suku bunga tahunan EFEKTIF (yang sudah mengandung pemajemukan), forward yang benar memakai bunga MAJEMUK: F = S × (1 + r_d)^T/(1 + r_f)^T. Untuk T = 1 tahun keduanya IDENTIK — itulah kenapa contoh lesson ini (T = 1, F = Rp16.736,84) tidak membedakan keduanya.",
            "Bedanya muncul saat T ≠ 1. Ambil S = Rp16.500, r_IDR = 6%, r_USD = 4,5%, T = 2 tahun. Sederhana: 16.500 × (1 + 0,12)/(1 + 0,09) = 16.500 × 1,12/1,09 = Rp16.954,13. Majemuk: 16.500 × 1,06²/1,045² = 16.500 × 1,1236/1,092025 = Rp16.977,08. Selisih Rp22,95 per dolar — kecil per dolar, tetapi untuk kewajiban USD 500 ribu (mini-case importir lesson ini) selisihnya Rp11,48 juta. Pemajemukan KONTINYU — F = S × e^((r_d−r_f)T), konvensi yang dipakai banyak model derivatif — memberi Rp17.002,50 untuk contoh yang sama. Tiga konvensi, tiga forward — dan ketiganya 'benar' di bawah asumsinya masing-masing.",
            "Aturan: sebelum memakai rumus CIP, tanyakan DUA hal — (1) suku bunga ini dikutip sebagai simple atau efektif? (2) tenornya berapa? Untuk T ≤ 1 tahun dan pasar uang, sederhana adalah konvensi standarnya. Untuk tenor multi-tahun atau saat membandingkan dengan harga pasar (yang memakai konvensi tertentu), pakai konvensi yang SAMA dengan pasarnya — forward yang 'salah' Rp23 per dolar adalah forward yang memakai konvensi yang salah.",
          ],
          formula: String.raw`F_{\text{simple}} = S\frac{1+r_d T}{1+r_f T} \qquad F_{\text{majemuk}} = S\frac{(1+r_d)^T}{(1+r_f)^T} \qquad F_{\text{kontinyu}} = S\,e^{(r_d-r_f)T}`,
          formulaNote: "S = 16.500, r_IDR = 6%, r_USD = 4,5%, T = 2: sederhana 16.954,13; majemuk 16.977,08; kontinyu 17.002,50. Selisih majemuk−sederhana Rp22,95/USD (Rp11,48 jt untuk USD 500 rb).",
          tasks: [
            { id: "t1", text: "Hitung forward T=2 tahun: `f_simple`, `f_majemuk`, `f_kontinyu` (2 desimal)" },
            { id: "t2", text: "Hitung `selisih_jt` = (f_majemuk − f_simple) × 500.000 / 1e6 (Rp juta, 2 desimal)" },
          ],
          expected: "f_simple=16954.13 f_majemuk=16977.08 f_kontinyu=17002.5 selisih_jt=11.48",
          hints: [
            "Sederhana: 16500 × 1,12/1,09. Majemuk: 16500 × 1,06²/1,045².",
            "Kontinyu: 16500 × e^(0,015×2).",
          ],
          code: {
            starter: `import math\n\nS = 16500; rd = 0.06; rf = 0.045; T = 2\n\n# TULIS KODEMU: forward 2 tahun di tiga konvensi + selisih untuk USD 500 rb\nf_simple =\nf_majemuk =\nf_kontinyu =\nselisih_jt =\n\nprint(f"f_simple={f_simple} f_majemuk={f_majemuk} f_kontinyu={f_kontinyu} selisih_jt={selisih_jt}")`,
            lockLines: 5,
            solution: `import math\n\nS = 16500; rd = 0.06; rf = 0.045; T = 2\n\n# TULIS KODEMU: forward 2 tahun di tiga konvensi + selisih untuk USD 500 rb\nf_simple = round(S * (1 + rd * T) / (1 + rf * T), 2)\nf_majemuk = round(S * (1 + rd) ** T / (1 + rf) ** T, 2)\nf_kontinyu = round(S * math.exp((rd - rf) * T), 2)\nselisih_jt = round((f_majemuk - f_simple) * 500000 / 1e6, 2)\n\nprint(f"f_simple={f_simple} f_majemuk={f_majemuk} f_kontinyu={f_kontinyu} selisih_jt={selisih_jt}")`,
            checks: [
              { kind: "equal", task: "t1", name: "f_simple", value: 16954.13, tol: 0.5, label: "`f_simple` = 16.954,13", msg: "16500 × 1,12/1,09 ≈ 16.954,13." },
              { kind: "equal", task: "t1", name: "f_majemuk", value: 16977.08, tol: 0.5, label: "`f_majemuk` = 16.977,08", msg: "16500 × 1,1236/1,092025 ≈ 16.977,08." },
              { kind: "equal", task: "t1", name: "f_kontinyu", value: 17002.5, tol: 0.5, label: "`f_kontinyu` = 17.002,50", msg: "16500 × e^0,03 ≈ 17.002,50." },
              { kind: "equal", task: "t2", name: "selisih_jt", value: 11.48, tol: 0.05, label: "`selisih_jt` = 11,48", msg: "(16.977,08 − 16.954,13) × 500.000 ≈ Rp11,48 juta." },
              { kind: "stdout_matches", task: "t2", pattern: "f_simple=16954\\.13\\s+f_majemuk=16977\\.08\\s+f_kontinyu=17002\\.5\\s+selisih_jt=11\\.48", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Forward 1 tahun dari rumus sederhana dan majemuk hasilnya sama persis. Kenapa?",
              options: [
                { text: "Karena pada T = 1, (1 + r×1) = (1 + r)^1 — kedua rumus berimpit", why: "Tepat: bedanya baru muncul saat T ≠ 1. Contoh lesson ini (T = 1) tidak bisa membedakan keduanya.", correct: true },
                { text: "Karena suku bunganya kecil", why: "Salah: kecilnya bunga hanya memperkecil selisih — pada T = 1 selisihnya NOL persis, bukan kecil." },
                { text: "Karena spot-nya sama", why: "Salah: spot yang sama tidak menjelaskan kenapa dua rumus berbeda memberi hasil sama." },
                { text: "Karena CIP tidak berlaku untuk T = 1", why: "Salah: CIP berlaku — justru pada T = 1 kedua konvensi kebetulan sama." },
              ],
            },
          ],
          reference: "CIP sederhana vs majemuk vs kontinyu: sama di T = 1, beda di T ≠ 1. Tanyakan konvensi suku bunga + tenor sebelum memakai rumus.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "USD/IDR naik = rupiah melemah. Bedakan level, perubahan, kecepatan — dan pembandingnya.",
        "Forward wajar = S × (1+r_d·T)/(1+r_f·T) — hasil arbitrase bunga, BUKAN ramalan.",
        "PPP: depresiasi ≈ selisih inflasi — kompas jangka panjang level kurs.",
        "BI-Rate = rem/gas ekonomi: naik → inflasi & rupiah dijaga, pertumbuhan dikorbankan.",
        "Bunga riil = (1+r_nom)/(1+π) − 1 — kebenaran pahit di balik brosur.",
      ],
      next: { label: "E13 — Market Risk", href: "/v2/learn/e13-market-risk" },
      quiz: [
        {
          q: "BI menaikkan BI-Rate. Efek berantainya…",
          options: [
            { text: "Bunga kredit turun, ekonomi memanas", why: "Salah: terbalik — bunga NAIK." },
            { text: "Bunga naik → belanja/investasi turun → inflasi turun, tapi pertumbuhan melambat; rupiah cenderung didukung", why: "Benar: rantai transmisi moneter — BI menukar pertumbuhan dengan stabilitas.", correct: true },
            { text: "Tidak ada efek", why: "Salah: efeknya ke kredit, deposito, inflasi, dan kurs." },
            { text: "Hanya memengaruhi bank", why: "Salah: memengaruhi seluruh ekonomi." },
          ],
        },
        {
          q: "Deposito 4%, inflasi 5,5%. Bunga riil?",
          options: [
            { text: "4%", why: "Salah: itu nominalnya — belum dikurangi inflasi." },
            { text: "9,5%", why: "Salah: itu penjumlahan — rumusnya pembagian." },
            { text: "≈ −1,5% — daya beli MENYUSUT meski nominal bertambah", why: "Benar: (1,04/1,055)−1 ≈ −1,4%.", correct: true },
            { text: "0%", why: "Salah: hitung — (1,04/1,055)−1 ≠ 0." },
          ],
        },
        {
          q: "Rupiah melemah 5% dalam sebulan BERSAMAAN dengan THB, MYR, PHP melemah serupa. Kesimpulan?",
          options: [
            { text: "Rupiah bermasalah spesifik", why: "Salah: pelemahan merata = bukan masalah domestik." },
            { text: "Sentimen global (dolar menguat / risk-off) — bukan masalah Indonesia saja", why: "Benar: bandingkan dengan tetangga dulu sebelum menyalahkan domestik.", correct: true },
            { text: "BI gagal total", why: "Salah: fenomena global di luar kendali satu bank sentral." },
            { text: "Harus borong dolar sekarang", why: "Salah: keputusan dari satu data kurs = spekulasi, bukan analisis." },
          ],
        },
      ],
    },
  ],
};
