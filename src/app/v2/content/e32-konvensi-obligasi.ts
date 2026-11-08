import type { V2Lesson } from "../lib/types";

export const e32: V2Lesson = {
  slug: "e32-konvensi-obligasi",
  track: "Financial Markets",
  module: "Obligasi & Suku Bunga",
  title: "E32 — Konvensi Obligasi: Accrued Interest dan Day-Count",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Beli obligasi Rp100 juta, tagihan datang Rp2 juta lebih besar",
      prose: [
        "Sari membeli obligasi pemerintah nominal Rp100 juta di harga bersih (clean price) Rp98,5 juta. Ia menyiapkan Rp98,5 juta. Tagihan yang datang: Rp100,5 juta. Selisih Rp2 juta itu bukan fee, bukan pajak, bukan kesalahan — itu accrued interest, bunga yang sudah berjalan sejak kupon terakhir dan menjadi hak penjual.",
        "Obligasi membayar kupon tiap 6 bulan. Sari membeli tepat di tengah periode kupon — 90 hari setelah kupon terakhir. Penjual sudah 'memiliki' 90 hari bunga itu, jadi pembeli membayarnya di muka, lalu menerima kupon penuh 6 bulan di tanggal berikutnya. Mekanismenya adil — tetapi hanya bila kamu tahu cara menghitung 90 hari itu. Dan di sinilah konvensi day-count masuk: pasar yang berbeda menghitung '90 hari' dengan cara yang berbeda.",
        "Lesson ini mengisi kekosongan yang tidak pernah dibahas di track ini: E4 mengajarkan harga dan yield obligasi, tetapi tidak pernah menyentuh accrued interest dan day-count. Setelah lesson ini kamu bisa: (1) menghitung accrued interest dengan konvensi 30/360 dan Actual/Actual; (2) membedakan clean price dan dirty price; (3) menghitung settlement amount yang benar; (4) menjelaskan kenapa dua pasar bisa memberi accrued yang berbeda untuk obligasi yang sama; (5) mengenali jebakan ex-coupon dan accrued negatif.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "E4 (Obligasi) membahas harga, yield, dan kupon — tetapi grep menyeluruh tidak menemukan satu pun penyebutan accrued interest, day-count, 30/360, atau Actual/Actual di seluruh track Financial Markets. Lesson ini membangun topik itu dari nol: bukan pendalaman, melainkan fondasi yang hilang.",
      },
      reference: "Nominal Rp100 juta, kupon 8 persen per tahun. Accrued 30/360: Rp2.000.000. Accrued Actual/Actual: Rp1.988.950. Dirty price 30/360: Rp100.500.000.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu tidak akan pernah lagi kaget oleh tagihan obligasi.",
        "(1) Menghitung accrued interest dengan konvensi 30/360;",
        "(2) Menghitung accrued interest dengan konvensi Actual/Actual;",
        "(3) Membedakan clean price, dirty price, dan settlement amount;",
        "(4) Menjelaskan kenapa konvensi yang berbeda memberi angka yang berbeda;",
        "(5) Mengenali periode ex-coupon dan accrued negatif.",
      ],
      tasks: [],
    },
    {
      id: "accrued",
      eyebrow: "Langkah 3 · Teori",
      title: "Accrued interest: bunga yang sudah berjalan",
      prose: [
        "Kupon obligasi dibayar di tanggal tetap — misalnya tiap 15 Januari dan 15 Juli. Bila kamu membeli obligasi di antara dua tanggal itu, bunga sudah berjalan sebagian periode. Bagian yang sudah berjalan itu disebut accrued interest, dan pembeli membayarnya kepada penjual sebagai bagian dari settlement amount. Penjual menerima kompensasi atas hari-hari ia memegang obligasi; pembeli akan menerima kupon penuh di tanggal berikutnya — jadi secara ekonomi, pembeli hanya membayar bunga untuk hari-hari SETELAH ia membeli.",
        "Rumusnya: accrued = nominal × tingkat kupon tahunan × (hari sejak kupon terakhir dibagi hari dalam setahun menurut konvensi). Contoh cerita pembuka: nominal Rp100 juta, kupon 8 persen per tahun, 90 hari sejak kupon terakhir. Dengan konvensi 30/360, tahun = 360 hari: accrued = 100.000.000 × 0,08 × 90/360 = Rp2.000.000. Bersih, bulat, dan mudah — itulah alasan konvensi ini lahir di era sebelum kalkulator.",
        "Settlement amount = clean price + accrued. Sari membeli di clean price Rp98,5 juta: settlement = 98.500.000 + 2.000.000 = Rp100.500.000. Enam bulan kemudian ia menerima kupon penuh Rp4.000.000 (setengah dari 8 persen × 100 juta). Dari kupon itu, Rp2.000.000 adalah pengembalian accrued yang ia bayarkan — bunga ekonomisnya yang sesungguhnya hanya Rp2.000.000 untuk 90 hari berikutnya. Investor yang menghitung yield dari kupon penuh tanpa mengurangkan accrued sedang menghitung return yang bukan miliknya.",
        "Satu hal yang sering membingungkan: accrued bisa negatif. Bila obligasi dibeli dalam periode ex-coupon — beberapa hari sebelum tanggal kupon, saat pembeli TIDAK berhak atas kupon berikutnya — maka accrued bernilai NEGATIF: penjual tetap menerima kupon berikutnya, jadi pembeli membayar lebih murah. Rumusnya tetap sama, settlement = clean price + accrued — dengan accrued negatif, itu menjadi settlement = clean − |accrued|. Contoh: clean Rp98,5 juta dan accrued −Rp1.000.000 → settlement = 98.500.000 + (−1.000.000) = Rp97.500.000. Jangan mengurangkan dua kali: 'dikurangi accrued' sudah terkandung dalam tanda negatifnya. Selalu tanyakan tanggal ex-coupon sebelum membeli obligasi yang hampir membayar kupon.",
      ],
      tasks: [],
      formula: String.raw`\text{Accrued} = N \times c \times \frac{d}{B} \qquad \text{Settlement} = \text{Clean price} + \text{Accrued}`,
      formulaNote: "N = nominal; c = tingkat kupon tahunan; d = hari sejak kupon terakhir; B = hari dalam setahun menurut konvensi (360 untuk 30/360, 365 atau 366 untuk Actual/Actual). Contoh: 100.000.000 × 0,08 × 90/360 = 2.000.000.",
      reference: "Accrued 30/360: Rp2.000.000. Settlement: Rp100.500.000. Kupon penuh berikutnya Rp4.000.000.",
    },
    {
      id: "day-count",
      eyebrow: "Langkah 4 · Teori",
      title: "Day-count: tiga cara menghitung 90 hari",
      prose: [
        "Konvensi day-count menjawab dua pertanyaan: berapa hari sejak kupon terakhir, dan berapa hari dalam setahun. Tiga konvensi yang paling sering ditemui. 30/360 (Bond Basis): setiap bulan dianggap 30 hari, setahun 360 hari. 15 Januari ke 15 April = 3 bulan × 30 = 90 hari — bulat dan mudah. Actual/Actual ICMA (berbasis periode kupon): hitung hari kalender sesungguhnya, dibagi hari dalam periode kupon yang sesungguhnya — inilah yang dipakai lesson ini dan yang dipakai SUN. Actual/365 (Fixed): hitung hari kalender, dibagi 365 selalu — dipakai banyak pasar uang Asia. Perhatian: nama 'Actual/Actual' saja tidak cukup — ada varian ISDA (Actual/Actual ISDA membagi hari dengan hari dalam tahun kalender, 365 atau 366) yang berbeda dari varian ICMA (membagi dengan hari dalam periode kupon). Dokumentasi emisi selalu menyatakan varian yang dipakai; jangan mengasumsikan satu varian dari namanya saja.",
        "Tabel perbandingan untuk obligasi yang sama (nominal Rp100 juta, kupon 8 persen, dibeli 15 April setelah kupon 15 Januari, clean Rp98,5 juta): 30/360 → accrued Rp2.000.000, settlement Rp100.500.000 (korporat AS); Actual/Actual ICMA → accrued Rp1.988.950, settlement Rp100.488.950 (SUN, pemerintah AS); Actual/Actual ISDA → accrued = 8.000.000 × 90/365 = Rp1.972.603, settlement Rp100.472.603; Actual/365 → sama dengan ISDA di tahun non-kabisat, Rp1.972.603. Empat konvensi, empat tagihan — semuanya 'benar' di pasarnya masing-masing. Settlement selalu mengikuti konvensi yang tertulis di dokumen emisi, dan kustodian menagih sesuai konvensi itu.",
        "Untuk obligasi yang sama — nominal Rp100 juta, kupon 8 persen, dibeli 15 April setelah kupon 15 Januari — hasilnya berbeda. 30/360: 90/360 × 8.000.000 = Rp2.000.000. Actual/Actual: periode kupon 15 Januari–15 Juli 2026 adalah 181 hari kalender (16 hari sisa Januari + 28 Februari + 31 Maret + 30 April + 31 Mei + 30 Juni + 15 Juli), dan hari yang berlalu 90 — accrued = 4.000.000 × 90/181 = Rp1.988.950. Selisihnya Rp11.050 — kecil untuk satu obligasi, tetapi untuk portofolio Rp10 triliun selisihnya Rp1,1 miliar. Konvensi bukan detail administratif; ia adalah uang.",
        "Aturan pasarnya: obligasi pemerintah Amerika Serikat memakai Actual/Actual; obligasi korporat Amerika memakai 30/360; pasar uang memakai Actual/360; obligasi pemerintah Indonesia (SUN) memakai Actual/Actual. Investor yang memakai konvensi yang salah untuk pasar yang salah akan salah harga — dan salah harga Rp11.050 per Rp100 juta adalah selisih yang cukup untuk membuat arbitraseur tersenyum.",
        "Praktik terbaik: jangan pernah menghitung accrued dari ingatan. Dokumentasi emisi (offering circular) selalu menyatakan konvensi day-count obligasi itu. Bila ragu, tanyakan ke kustodian atau sekuritas — dan cocokkan accrued yang mereka tagihkan dengan hitunganmu sendiri sebelum membayar settlement.",
      ],
      tasks: [],
      note: {
        title: "Kenapa 360, bukan 365?",
        body: "Konvensi 360 hari lahir dari era perhitungan manual: 360 habis dibagi 12, 6, 4, 3, dan 2 — semua pembagian periode kupon menghasilkan angka bulat. Komputer membuat alasan itu usang, tetapi triliunan dolar obligasi korporat masih memakai 30/360 karena kontrak lama tidak bisa diubah seenaknya. Konvensi adalah fosil yang masih menagih uang.",
      },
      reference: "30/360: Rp2.000.000. Actual/Actual: Rp1.988.950 (periode 181 hari). Selisih Rp11.050 per Rp100 juta nominal.",
    },
    {
      id: "lab-accrued",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin accrued interest",
      prose: [
        "Lab ini membangun mesin accrued interest: dari nominal, kupon, hari berlalu, dan hari periode — hitung accrued 30/360, accrued Actual/Actual, dan dirty price.",
        "Hitung dulu di kepala. Accrued 30/360 = 100.000.000 × 0,08 × 90/360 = Rp2.000.000. Accrued Actual/Actual = 4.000.000 × 90/181 = Rp1.988.950 (dibulatkan ke rupiah). Dirty price (30/360) = clean price 98.500.000 + 2.000.000 = Rp100.500.000.",
        "Tugas lab: tulis fungsi yang menerima nominal, kupon tahunan, hari berlalu, hari periode kupon, dan clean price — lalu mencetak accrued 30/360, accrued Actual/Actual (dibulatkan), dan dirty price 30/360. Tiga angka ini adalah tagihan yang benar sebelum kamu menekan tombol bayar.",
        "Setelah lolos, coba eksperimen: ubah hari berlalu menjadi 180 (sehari sebelum kupon) dan lihat accrued 30/360 menjadi Rp4.000.000 — hampir seluruh kupon sudah menjadi hak penjual. Lalu tanyakan: kapan terakhir kali kamu memeriksa accrued sebelum membeli obligasi?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `accrued30` (konvensi 30/360)" },
        { id: "t2", text: "Hitung `accrued_act` (Actual/Actual, dibulatkan ke rupiah)" },
        { id: "t3", text: "Hitung `dirty30` (clean price + accrued 30/360)" },
      ],
      expected: "accrued30=2000000\naccrued_act=1988950\ndirty30=100500000",
      hints: [
        "Accrued 30/360 = nominal x kupon x hari / 360.",
        "Accrued Actual/Actual = (nominal x kupon / 2) x hari / hari_periode; bulatkan ke rupiah.",
        "Dirty price = clean price + accrued (pakai accrued 30/360).",
      ],
      code: {
        starter: `# Obligasi: nominal Rp100 jt, kupon 8% per tahun (semesteran), dibeli 90 hari setelah kupon.\nnominal = 100_000_000\nkupon = 0.08\nhari = 90\nhari_periode = 181  # 15 Jan - 15 Jul 2026, hari kalender\nclean = 98_500_000\n\n# TULIS KODEMU: hitung accrued30, accrued_act, dirty30.\n# Cetak, per baris: accrued30, accrued_act, dirty30.\n\n`,
        lockLines: 6,
        solution: `# Obligasi: nominal Rp100 jt, kupon 8% per tahun (semesteran), dibeli 90 hari setelah kupon.\nnominal = 100_000_000\nkupon = 0.08\nhari = 90\nhari_periode = 181  # 15 Jan - 15 Jul 2026, hari kalender\nclean = 98_500_000\n\n\naccrued30 = nominal * kupon * hari / 360\nkupon_semester = nominal * kupon / 2\naccrued_act = round(kupon_semester * hari / hari_periode)\ndirty30 = clean + accrued30\nprint(f"accrued30={accrued30:.0f}")\nprint(f"accrued_act={accrued_act}")\nprint(f"dirty30={dirty30:.0f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "accrued30", value: 2000000, tol: 1, label: "Accrued 30/360 Rp2.000.000", msg: "100.000.000 x 0,08 x 90/360 = 2.000.000." },
          { kind: "equal", task: "t2", name: "accrued_act", value: 1988950, tol: 1, label: "Accrued Actual/Actual Rp1.988.950", msg: "4.000.000 x 90/181 = 1.988.950,28 — dibulatkan 1.988.950." },
          { kind: "equal", task: "t3", name: "dirty30", value: 100500000, tol: 1, label: "Dirty price Rp100.500.000", msg: "98.500.000 + 2.000.000 = 100.500.000. Itulah tagihan settlement yang benar." },
        ],
      },
      reference: "Accrued 30/360: Rp2.000.000. Accrued Actual/Actual: Rp1.988.950. Dirty price: Rp100.500.000.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 6 · Teori",
      title: "Jebakan: clean vs dirty, ex-coupon, dan pajak",
      prose: [
        "Harga obligasi yang dikutip di layar hampir selalu clean price — tanpa accrued. Ini disengaja: clean price bergerak karena suku bunga dan risiko kredit, sementara accrued bergerak karena kalender. Mencampur keduanya membuat grafik harga obligasi bergerigi setiap tanggal kupon. Tetapi saat membayar, yang berlaku adalah dirty price. Trader yang menawar berdasarkan clean price lalu kaget oleh tagihan dirty price adalah trader yang belum membaca lesson ini.",
        "Jebakan kedua: membeli sehari sebelum kupon. Ada dua kasus yang harus dipisahkan. Kasus pertama — SEBELUM tanggal ex-coupon: kamu membayar accrued hampir penuh, misalnya 180 dari 181 hari × Rp4.000.000 = Rp3.977.900, lalu besok menerima kupon penuh Rp4.000.000 — secara ekonomi kamu hanya mendapat Rp22.100 untuk satu hari itu. Kasus kedua — DALAM periode ex-coupon: hak kupon berikutnya tetap pada penjual, accrued-mu NEGATIF, dan kamu TIDAK menerima kupon itu sama sekali. Settlement-nya: clean + accrued negatif = clean − |accrued|. Mencampur kedua kasus — membayar accrued penuh SESEKALIGUS kehilangan hak kupon — adalah kesalahan yang membuatmu membayar dua kali. Selalu periksa tanggal ex-coupon dan tanggal pencatatan (record date) sebelum membeli obligasi yang hampir membayar kupon.",
        "Jebakan ketiga: pajak. Di banyak yurisdiksi, accrued yang kamu bayarkan bukan biaya yang hilang — ia mengurangi penghasilan kena pajak dari kupon yang kamu terima, karena secara ekonomi itu uang penjual yang hanya lewat di tanganmu. Tetapi aturan pajak tiap negara berbeda, dan perlakuan accrued untuk obligasi domestik vs asing bisa berbeda. Jangan mengasumsikan — tanyakan ke penasihat pajakmu, dengan angka accrued di tangan.",
        "Aturan penutup: accrued adalah bunga yang sudah berjalan, bukan biaya tersembunyi. Ia adil, ia terhitung, dan ia bisa diverifikasi dalam satu menit. Investor yang memeriksa accrued sebelum membeli tidak pernah kaget oleh tagihan — dan tidak pernah membayar bunga orang lain tanpa sadar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghitung yield dari kupon penuh tanpa mengurangkan accrued yang dibayarkan. Yield yang benar memakai arus kas bersih: kupon diterima dikurangi accrued dibayar, dibagi dirty price yang dibayar. Yield dari kupon penuh adalah yield orang lain.",
      },
      reference: "Layar mengutip clean price; tagihan memakai dirty price. Periksa tanggal ex-coupon sebelum membeli dekat tanggal kupon.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: dua penawaran, satu obligasi, dua accrued",
      prose: [
        "Dua sekuritas menawarkan obligasi yang sama — nominal Rp100 juta, kupon 8 persen, dibeli 90 hari setelah kupon 15 Januari. Sekuritas A menagih settlement Rp100.500.000. Sekuritas B menagih Rp100.488.950. Selisih Rp11.050. Manakah yang benar?",
        "Keduanya benar — dengan konvensi masing-masing. Sekuritas A memakai 30/360: accrued Rp2.000.000. Sekuritas B memakai Actual/Actual: accrued Rp1.988.950. Obligasi ini adalah SUN, yang konvensi resminya Actual/Actual — jadi tagihan B yang sesuai dokumentasi emisi. Tetapi bila obligasi ini korporat Amerika, A yang benar. Jawabannya tidak ada di angka — ada di dokumen emisi.",
        "Keputusan: bayar tagihan B, dan catat konvensinya. Tiga bulan kemudian, saat obligasi yang sama ditawarkan lagi, kamu tidak perlu bertanya — kamu sudah tahu konvensinya, dan kamu bisa memeriksa tagihan dalam satu menit. Investor yang tahu konvensi tidak pernah membayar selisih Rp11.050 per Rp100 juta tanpa tahu kenapa.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, accrued dihitung dari konvensi, bukan dari tawar-menawar. Kedua, dokumentasi emisi adalah sumber kebenaran — bukan kebiasaan sekuritas. Ketiga, selisih kecil per obligasi menjadi besar di portofolio: Rp11.050 per Rp100 juta berarti Rp1,1 miliar per Rp10 triliun.",
      },
      reference: "A (30/360): Rp100.500.000. B (Actual/Actual): Rp100.488.950. SUN memakai Actual/Actual — B benar.",
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
        "Accrued 30/360: Rp2.000.000. Accrued Actual/Actual: Rp1.988.950. Dirty price: Rp100.500.000.",
        "Settlement = clean price + accrued; kupon penuh berikutnya Rp4.000.000.",
        "30/360: bulan 30 hari, tahun 360 hari. Actual/Actual: hari kalender sesungguhnya.",
        "SUN memakai Actual/Actual; korporat Amerika memakai 30/360.",
        "Layar mengutip clean price; tagihan memakai dirty price.",
      ],
      next: { label: "E33 — Obligasi Callable dan Convertible: Menilai Opsi yang Tersembunyi", href: "/v2/learn/e33-callable-convertible" },
      quiz: [
        {
          q: "Obligasi nominal Rp100 juta, kupon 8 persen per tahun, dibeli 90 hari setelah kupon terakhir. Berapa accrued 30/360 dan settlement bila clean price Rp98,5 juta?",
          options: [
            { text: "Accrued Rp2.000.000; settlement Rp100.500.000", why: "Tepat: 100.000.000 × 0,08 × 90/360 = 2.000.000; 98.500.000 + 2.000.000 = 100.500.000.", correct: true },
            { text: "Accrued Rp4.000.000; settlement Rp102.500.000", why: "Salah: Rp4.000.000 adalah kupon penuh satu semester, bukan accrued 90 hari. Accrued hanya bagian yang sudah berjalan." },
            { text: "Accrued Rp1.988.950; settlement Rp100.488.950", why: "Salah: itu accrued Actual/Actual (4.000.000 × 90/181). Pertanyaannya memakai 30/360." },
            { text: "Accrued Rp0; settlement Rp98.500.000", why: "Salah: accrued bukan nol — 90 hari bunga sudah berjalan dan menjadi hak penjual. Tagihan memakai dirty price." },
          ],
        },
        {
          q: "Kenapa accrued Actual/Actual (Rp1.988.950) lebih kecil dari accrued 30/360 (Rp2.000.000) untuk obligasi yang sama?",
          options: [
            { text: "Karena Actual/Actual memakai hari kalender sesungguhnya — periode kupon 181 hari, bukan 180 hari", why: "Tepat: 4.000.000 × 90/181 = 1.988.950. Penyebut 181 lebih besar dari 180, jadi accrued lebih kecil.", correct: true },
            { text: "Karena Actual/Actual memakai tahun 365 hari", why: "Salah: Actual/Actual membagi dengan hari periode kupon (181), bukan dengan 365. Actual/365 adalah konvensi lain." },
            { text: "Karena kupon Actual/Actual dibayar lebih jarang", why: "Salah: frekuensi kupon sama — yang berbeda hanya cara menghitung hari. Kupon tetap semesteran." },
            { text: "Karena 30/360 selalu salah dan harus dihindari", why: "Salah: 30/360 bukan salah — ia konvensi resmi obligasi korporat Amerika. Yang salah adalah memakai konvensi yang tidak sesuai dokumen emisi." },
          ],
        },
        {
          q: "Sari menerima kupon penuh Rp4.000.000 enam bulan setelah membeli. Berapa bunga ekonomis yang benar-benar menjadi haknya?",
          options: [
            { text: "Rp4.000.000 — seluruh kupon adalah hak pembeli", why: "Salah: Rp2.000.000 dari kupon itu adalah pengembalian accrued yang ia bayarkan ke penjual. Hak ekonomisnya hanya Rp2.000.000." },
            { text: "Rp2.000.000 — kupon dikurangi accrued yang ia bayarkan", why: "Tepat: 4.000.000 − 2.000.000 = 2.000.000 untuk 90 hari setelah ia membeli.", correct: true },
            { text: "Rp0 — kupon adalah milik penjual seluruhnya", why: "Salah: penjual hanya berhak atas 90 hari sebelum penjualan (Rp2.000.000). Sisanya milik pembeli." },
            { text: "Rp6.000.000 — kupon ditambah accrued", why: "Salah: accrued bukan tambahan penghasilan — ia uang yang sudah dibayarkan di muka dan kembali lewat kupon." },
          ],
        },
        {
          q: "Obligasi dibeli dalam periode ex-coupon, sehari sebelum tanggal kupon. Apa yang terjadi pada accrued?",
          options: [
            { text: "Accrued menjadi nol karena kupon belum dibayar", why: "Salah: accrued tidak nol — ia negatif. Pembeli tidak berhak atas kupon berikutnya, jadi penjual tetap menerimanya." },
            { text: "Accrued negatif — pembeli membayar clean price ditambah accrued negatif, yaitu clean − |accrued|", why: "Tepat: kupon berikutnya milik penjual, jadi pembeli mendapat potongan sebesar |accrued|. Rumus settlement = clean + accrued tetap berlaku — dengan accrued negatif, hasilnya clean dikurangi nilai absolutnya. Jangan mengurangkan dua kali.", correct: true },
            { text: "Accrued berlipat ganda karena pembeli membayar dua kupon", why: "Salah: tidak ada pembayaran ganda. Ex-coupon hanya memindahkan hak kupon berikutnya ke penjual." },
            { text: "Tidak ada efek — ex-coupon hanya istilah administratif", why: "Salah: ex-coupon menentukan siapa yang menerima kupon — dan itu mengubah settlement secara nyata." },
          ],
        },
        {
          q: "Harga obligasi di layar menunjukkan Rp98,5 juta, tetapi tagihanmu Rp100,5 juta. Penjelasan yang benar?",
          options: [
            { text: "Sekuritas menagih fee tersembunyi Rp2 juta", why: "Salah: selisih Rp2 juta adalah accrued interest — bunga 90 hari yang menjadi hak penjual, bukan fee." },
            { text: "Layar mengutip clean price; tagihan memakai dirty price = clean + accrued Rp2.000.000", why: "Tepat: 98.500.000 + 2.000.000 = 100.500.000. Clean untuk analisis, dirty untuk membayar.", correct: true },
            { text: "Harga obligasi naik Rp2 juta antara order dan settlement", why: "Salah: kenaikan harga akan mengubah clean price-nya, bukan menambah accrued. Selisih ini persis sama dengan accrued 90 hari." },
            { text: "Ada kesalahan sistem — tagihan seharusnya sama dengan harga layar", why: "Salah: bukan kesalahan. Clean vs dirty adalah konvensi pasar yang disengaja agar grafik harga tidak bergerigi tiap tanggal kupon." },
          ],
        },
      ],
    },
  ],
};
