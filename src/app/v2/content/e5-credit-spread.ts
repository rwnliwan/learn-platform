import type { V2Lesson } from "../lib/types";

export const e5: V2Lesson = {
  slug: "e5-credit-spread",
  track: "Financial Markets",
  module: "Obligasi & Kredit",
  title: "E5. Credit Spread & Risiko Gagal Bayar",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-spread",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kupon sama, harga beda Rp11 juta",
      prose: [
        "Dua obligasi 5 tahun, kupon sama-sama 8%, nominal Rp100 juta. Obligasi BUMN laku Rp102 juta. Obligasi perusahaan properti laku cuma Rp91 juta. Kuponnya identik — kenapa pasar menghargai yang satu Rp11 juta lebih murah? Jawabannya satu kata: ketakutan. Pasar takut perusahaan properti gagal bayar, jadi menuntut yield lebih tinggi sebagai kompensasi — yang artinya harga lebih rendah.",
        "Selisih yield itu punya nama: credit spread. Hitung YTM kedua obligasi (dengan biseksi — cara yang sama seperti menghitung IRR: tebak angka yield, hitung harga, sesuaikan sampai cocok) lalu ubah selisih harga menjadi spread dalam basis poin.",
      ],
      formula: String.raw`s = y_{\text{korporasi}} - y_{\text{SBN}}`,
      formulaNote: "s = spread; y = YTM masing-masing bertenor sama. 1% = 100 bps.",
      tasks: [
        { id: "t1", text: "Hitung `ytm_bumn` dan `ytm_properti` (desimal, mis. 0,075)" },
        { id: "t2", text: "Hitung `spread_bps` (selisih yield dalam basis poin)" },
      ],
      expected: "ytm_bumn=0.0751  ytm_properti=0.1040  spread_bps=289",
      note: {
        title: "Sering salah",
        body: "Membaca selisih harga Rp11 juta sebagai “diskon”. Analis profesional tidak berkata “murah” — ia berkata “spread 289 bps”, lalu membandingkannya dengan histori.",
      },
      hints: [
        "YTM = yield yang membuat PV arus kas = harga pasar. Cari dengan biseksi.",
        "Harga 102 (> par) → yield < kupon 8%. Harga 91 (< par) → yield > 8%.",
        "spread_bps = (ytm_properti - ytm_bumn) * 10000",
      ],
      code: {
        starter: `def ytm(harga, kupon=8, n=5, fv=100):\n    lo, hi = -0.5, 1.0\n    for _ in range(200):\n        m = (lo + hi) / 2\n        pv = sum(kupon / (1 + m) ** t for t in range(1, n + 1)) + fv / (1 + m) ** n\n        if pv > harga:\n            lo = m\n        else:\n            hi = m\n    return (lo + hi) / 2\n\n# TULIS KODEMU: YTM kedua obligasi dan spread-nya (bps)\nytm_bumn = \nytm_properti = \nspread_bps = \n\nprint(f"ytm_bumn={ytm_bumn:.4f}  ytm_properti={ytm_properti:.4f}  spread_bps={spread_bps:.0f}")`,
        lockLines: 11,
        solution: `def ytm(harga, kupon=8, n=5, fv=100):\n    lo, hi = -0.5, 1.0\n    for _ in range(200):\n        m = (lo + hi) / 2\n        pv = sum(kupon / (1 + m) ** t for t in range(1, n + 1)) + fv / (1 + m) ** n\n        if pv > harga:\n            lo = m\n        else:\n            hi = m\n    return (lo + hi) / 2\n\n# TULIS KODEMU: YTM kedua obligasi dan spread-nya (bps)\nytm_bumn = ytm(102)\nytm_properti = ytm(91)\nspread_bps = (ytm_properti - ytm_bumn) * 10000\n\nprint(f"ytm_bumn={ytm_bumn:.4f}  ytm_properti={ytm_properti:.4f}  spread_bps={spread_bps:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ytm_bumn", value: 0.0751, tol: 0.001, label: "`ytm_bumn` sekitar 0,0751", msg: "Harga 102 di atas par → yield di bawah kupon 8%. Cek logika biseksinya." },
          { kind: "equal", task: "t1", name: "ytm_properti", value: 0.104, tol: 0.001, label: "`ytm_properti` sekitar 0,1040", msg: "Harga 91 jauh di bawah par → yield jauh di atas 8%." },
          { kind: "equal", task: "t2", name: "spread_bps", value: 289, tol: 2, label: "`spread_bps` sekitar 289", msg: "(0,1040 − 0,0751) × 10000 = 289 bps. Itulah harga ketakutan pasar per tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "spread_bps=289", label: "`print` menampilkan spread", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Credit spread = YTM korporasi − YTM SBN setenor = harga ketakutan per tahun.",
    },
    {
      id: "rating-pd-lgd",
      eyebrow: "Langkah 2 · Rating, PD, LGD, EAD",
      title: "Tiga huruf penentu rugi",
      prose: [
        "Rating = opini lembaga pemeringkat tentang kemampuan membayar penerbit. Skala S&P/Moody’s/Fitch: AAA → D; di Indonesia Pefindo memakai skala nasional idAAA → idD. Garis demarkasi terpenting: BBB− ke atas = investment grade; di bawahnya = junk/high yield. Penurunan menembus batas ini (fallen angel) memicu jual paksa.",
        "Tiga komponen risiko kredit: PD (probability of default) — peluang gagal bayar setahun (AAA ≈ 0,01%; CCC ≈ 5%+). LGD (loss given default) — porsi yang hilang jika default (obligasi senior ≈ 40–60%). EAD (exposure at default) — rupiah yang berisiko (untuk obligasi ≈ nominal + kupon terutang).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rating = rapor yang telat: berguna sebagai ringkasan, tapi sering terlambat menangkap pemburukan. Analis profesional membaca spread pasar setiap pagi — spread bergerak lebih cepat dari rating.",
      },
      reference: "BBB− = batas investment grade vs junk. PD × LGD × EAD = expected loss.",
    },
    {
      id: "expected-loss",
      eyebrow: "Langkah 3 · Expected loss",
      title: "Harga ketakutan statistik dalam rupiah",
      prose: [
        "Expected loss = PD × LGD × EAD — kerugian yang secara statistik diharapkan per tahun, dalam rupiah. Bank memakai ini untuk cadangan kerugian (CKPN/ECL di PSAK 109).",
        "Obligasi Rp1 miliar, rating BBB (PD = 0,4%/tahun), LGD 45%. Hitung EL-nya, lalu bandingkan dengan spread pasar 1,8% (= Rp18 juta/tahun).",
      ],
      formula: String.raw`EL = PD \times LGD \times EAD`,
      formulaNote: "EL = expected loss per tahun (rupiah); PD = probability of default per tahun — peluang gagal bayar (desimal, dipetakan dari rating); LGD = loss given default — porsi eksposur yang hilang bila gagal (desimal); EAD = exposure at default — nilai tercatat saat gagal bayar. Contoh: PD 0,4%, LGD 45%, EAD Rp1 miliar → EL = 0,004 × 0,45 × 1.000.000.000 = Rp1,8 juta/tahun — jauh di bawah spread pasar Rp18 juta; selisihnya = premi risiko + premi likuiditas.",
      tasks: [
        { id: "t1", text: "Hitung `el` (expected loss per tahun, rupiah)" },
        { id: "t2", text: "Cetak perbandingan EL vs spread Rp18 juta" },
      ],
      expected: "el=1800000",
      note: {
        title: "Sering salah",
        body: "Mengira EL = ramalan “pasti rugi Rp1,8 jt tiap tahun”. EL = rata-rata statistik. Realisasinya biner: tidak default (rugi 0) atau default (rugi LGD×EAD sekaligus).",
      },
      hints: [
        "Ubah persen ke desimal: PD = 0,004; LGD = 0,45.",
        "EL = PD × LGD × EAD.",
        "el = 0.004 * 0.45 * 1_000_000_000",
      ],
      code: {
        starter: `ead = 1_000_000_000  # Rp1 miliar\npd = 0.004            # 0,4% per tahun (BBB)\nlgd = 0.45            # 45% hilang jika default\nspread_rp = 18_000_000  # spread 1,8% dalam rupiah\n\n# TULIS KODEMU: expected loss\nel = \n\nprint(f"el={el:.0f}")\nprint(f"spread {spread_rp:.0f} vs EL {el:.0f} -> spread {spread_rp/el:.0f}x lipat EL")`,
        lockLines: 4,
        solution: `ead = 1_000_000_000  # Rp1 miliar\npd = 0.004            # 0,4% per tahun (BBB)\nlgd = 0.45            # 45% hilang jika default\nspread_rp = 18_000_000  # spread 1,8% dalam rupiah\n\n# TULIS KODEMU: expected loss\nel = pd * lgd * ead\n\nprint(f"el={el:.0f}")\nprint(f"spread {spread_rp:.0f} vs EL {el:.0f} -> spread {spread_rp/el:.0f}x lipat EL")`,
        checks: [
          { kind: "equal", task: "t1", name: "el", value: 1800000, tol: 1, label: "`el` seharusnya 1800000", msg: "0,004 × 0,45 × 1.000.000.000 = Rp1,8 jt/tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "el=1800000", label: "`print` menampilkan EL", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "EL = PD × LGD × EAD. Spread harus > EL — sisanya premi risiko + biaya lain.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang spread dan expected loss.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Obligasi korporasi YTM 9%, SBN setenor YTM 6%. Credit spread-nya?",
          options: [
            { text: "3% (300 bps)", why: "Benar: 9% − 6% = 3% = 300 basis points, relatif terhadap risk-free setenor.", correct: true },
            { text: "15%", why: "Salah: spread = selisih, bukan jumlah." },
            { text: "9%", why: "Salah: 9% = YTM total, belum dikurangi risk-free." },
            { text: "6%", why: "Salah: 6% = yield SBN-nya, bukan spread-nya." },
          ],
        },
        {
          q: "EL = Rp1,8 jt/tahun untuk obligasi Rp1 M. Artinya…",
          options: [
            { text: "Pasti rugi Rp1,8 jt tiap tahun", why: "Salah: EL = rata-rata statistik, bukan kepastian tahunan." },
            { text: "Secara statistik ekspektasi kerugian Rp1,8 jt/thn; realisasinya 0 atau besar sekaligus", why: "Benar: EL untuk pricing dan cadangan, bukan ramalan.", correct: true },
            { text: "Obligasi pasti default", why: "Salah: PD 0,4% = peluang kecil, bukan kepastian." },
            { text: "Spread pasti 0,18%", why: "Salah: spread pasar (1,8%) >> EL — sisanya premi risiko." },
          ],
        },
      ],
    },
    {
      id: "minicase-properti",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Obligasi properti vs BUMN: Rp500 juta",
      prose: [
        "Dana Rp500 juta, horizon 3 tahun. Opsi A: obligasi BUMN, YTM 7% (spread 100 bps), rating idAAA. Opsi B: obligasi properti, YTM 12% (spread 600 bps), rating idBBB outlook negatif. Analis memperkirakan PD properti 3%/tahun, LGD 50%.",
        "Pertanyaan: (a) Hitung EL tahunan obligasi properti. Apakah spread 600 bps “sepadan”? (b) Risiko apa yang belum tercakup dalam perbandingan YTM ini? (c) Untuk investor konservatif, mana yang dipilih — dan kenapa?",
        "Pembahasan: (a) EL = 3% × 50% × Rp500 jt = Rp7,5 jt/tahun (1,5% dari pokok). Spread 6% = Rp30 jt/tahun >> EL Rp7,5 jt → secara statistik “sepadan”, bahkan murah. Tapi ingat: EL = rata-rata; realisasinya bisa Rp250 juta melayang sekaligus. (b) Risiko spread (harga bisa jatuh sebelum jatuh tempo), risiko likuiditas (obligasi BBB sulit dijual saat panik), dan ketidakpastian estimasi (PD 3% itu tebakan — bisa 8%!). (c) Obligasi BUMN: varians hasilnya kecil. Pilih instrumen sesuai toleransi risiko, bukan yang YTM-nya paling besar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rumus kasar spread ≈ PD × LGD bisa dibalik: PD tersirat = spread / LGD. Spread 6% dengan LGD 50% → pasar “menakuti” PD 12%/tahun. Kalau analisismu bilang PD sebenarnya 4% → pasar terlalu takut → obligasi murah. Berbeda pendapat dengan pasar, dan benar = alpha.",
      },
      reference: "Spread ≈ PD × LGD → baca “pikiran pasar”, lalu tantang dengan analisismu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Spread mahal atau murah? Empat skenario",
      prose: [
        "Spread melebar tajam di SEMUA emiten → jangan panik jual; cek apakah sistemik. Pelebaran merata = ketakutan sistemik, bukan emitenmu memburuk. Spread SATU emiten melebar sendirian → investigasi fundamental: pasar mungkin mencium pemburukan.",
        "PD tersirat < PD analisismu → hindari/jual: pasar “terlalu berani”, kompensasi tidak sepadan risiko. PD tersirat > PD analisismu → peluang beli (dengan ukuran posisi disiplin): kamu dibayar premi ketakutan berlebih — tapi batasi posisi, analis bisa salah.",
        "Aturan 10 detik: spread = harga ketakutan per tahun; melebar = pasar takut. EL = PD × LGD × EAD. Spread harus > EL — sisanya premi risiko.",
      ],
      tasks: [],
      reference: "Sistemik vs idiosinkratik. PD tersirat vs PD analisismu = kompas mahal/murah.",
    },
    {
      id: "spread-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: membedah spread",
      title: "Membedah spread 180 bps: berapa untuk takut, berapa untuk sepi",
      prose: [
        "Spread 180 bps di obligasi korporasi bukan satu angka — ia tumpukan empat lapisan. Lapisan pertama: expected loss — PD 0,4% × LGD 45% = 18 bps, kerugian rata-rata yang memang akan terjadi. Lapisan kedua: credit risk premium — kompensasi atas ketidakpastian di sekitar rata-rata itu (kerugian aktual bisa nol, bisa Rp450 juta). Lapisan ketiga: liquidity premium — obligasi korporasi sepi, jual cepat = diskon. Lapisan keempat: pajak dan teknikal. Dari 180 bps, hanya 18 yang “takdir”; 162 sisanya adalah harga ketakutan dan kesepian.",
        "Versi murni risiko kredit ada namanya: CDS (credit default swap). Kamu membayar premi tahunan; saat emiten gagal bayar, penjual CDS menggantimu. Spread CDS ≈ harga pasar murni atas risiko gagal bayar — tanpa lapisan likuiditas obligasi. Praktisi memantau CDS 5Y Indonesia sebagai termometer: melebar 50 bps dalam sebulan = pasar mencium sesuatu sebelum berita keluar.",
        "Tiga peringatan tentang rating. Pertama, rating itu lagging — downgrade datang setelah spread melebar, bukan sebelum; pasar bergerak duluan. Kedua, model issuer-pays: emiten membayar lembaga pemeringkatnya — konflik kepentingan yang meledak di 2008 saat obligasi beracun berlabel AAA. Ketiga, rating bersifat through-the-cycle: sengaja lambat bereaksi, jadi jangan dipakai untuk timing. Rating = opini kedua yang berguna, bukan pengganti analisismu.",
        "Aturan praktis: (1) jangan beli spread tanpa menghitung EL — kalau EL 18 bps dan spread 180, kamu dibayar 10× lipat ekspektasi kerugian; itu menarik atau itu jebakan, tergantung keyakinanmu pada PD-nya; (2) spread yang melebar 100+ bps dalam sebulan = pasar tahu sesuatu — cari tahu dulu sebelum “membeli diskon”; (3) diversifikasi: satu gagal bayar dengan LGD 45% menghapus premi 25 obligasi sehat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `el_bps` (expected loss, basis poin)" },
        { id: "t2", text: "Hitung `premi_bps` (sisa spread setelah EL)" },
      ],
      expected: "el_bps=18  premi_bps=162",
      hints: [
        "el = PD × LGD; 1% = 100 bps.",
        "premi = spread − el, dalam bps.",
      ],
      code: {
        starter: `pd = 0.004       # probability of default per tahun\nlgd = 0.45       # loss given default\nspread = 0.018   # spread pasar (desimal)\n\n# TULIS KODEMU: el_bps dan premi_bps (dalam basis poin)\nel_bps = \npremi_bps = \n\nprint(f"el_bps={el_bps:.0f}  premi_bps={premi_bps:.0f}")`,
        lockLines: 3,
        solution: `pd = 0.004       # probability of default per tahun\nlgd = 0.45       # loss given default\nspread = 0.018   # spread pasar (desimal)\n\n# TULIS KODEMU: el_bps dan premi_bps (dalam basis poin)\nel_bps = pd * lgd * 10000\npremi_bps = spread * 10000 - el_bps\n\nprint(f"el_bps={el_bps:.0f}  premi_bps={premi_bps:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "el_bps", value: 18, tol: 0.01, label: "`el_bps` seharusnya 18", msg: "0,004 × 0,45 × 10000 = 18 bps. Itulah “takdir” statistiknya." },
          { kind: "equal", task: "t2", name: "premi_bps", value: 162, tol: 0.01, label: "`premi_bps` seharusnya 162", msg: "180 − 18 = 162 bps. Sisanya = harga ketakutan + kesepian." },
          { kind: "stdout_matches", task: "t2", pattern: "el_bps=18\\s+premi_bps=162", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: spread = harga ketakutan, bukan ramalan",
        body: "Spread lebar bukan vonis mati emiten — ia harga yang diminta pasar untuk tidur nyenyak sambil memegang risikonya. Empat heuristik. Pertama: pisahkan spread jadi EL vs premi — EL 18 bps dari spread 180 berarti 90% yang kamu terima adalah kompensasi ketidakpastian dan kesepian, bukan kerugian yang pasti; tanpa pemisahan ini kamu buta. Kedua: spread melebar = orang berpengetahuan sedang keluar — jangan jadi yang terakhir tahu; cari beritanya dulu, hitung kemudian; “diskon” tanpa berita = jebakan. Ketiga: rating dibayar oleh yang dinilai — perlakukan seperti testimoni di brosur properti: informatif, tetapi verifikasi sendiri; dan ingat ia lagging — downgrade datang setelah pasar bergerak. Keempat: satu gagal bayar menghapus premi puluhan obligasi sehat — LGD 45% pada satu nama = premi 25 nama lenyap; diversifikasi bukan opsi, melainkan syarat. Aturan 10 detiknya: kalau kamu tidak bisa menyebut dalam satu kalimat apa risiko yang membayar yield itu, kamulah yang sedang menanggung risiko yang tidak kamu pahami.",
      },
      reference: "Spread = EL + premi risiko + premi likuiditas. Rating = opini lagging yang dibayar emiten.",
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
        "Credit spread = YTM korporasi − YTM SBN setenor = harga ketakutan per tahun.",
        "Rating: AAA→D (Pefindo: idAAA→idD); batas BBB− = investment grade vs junk; rating bisa telat.",
        "PD = peluang default; LGD = porsi hilang jika default; EAD = eksposur. EL = PD × LGD × EAD.",
        "Spread ≈ PD × LGD → baca pikiran pasar, tantang dengan analisismu. Berbeda dan benar = alpha.",
        "Risiko kredit tidak hanya default: ada risiko spread dan risiko likuiditas.",
      ],
      next: { label: "E6 — Ekuitas", href: "/learn/e6-ekuitas" },
      quiz: [
        {
          q: "Batas investment grade vs junk berada di…",
          options: [
            { text: "AAA", why: "Salah: AAA = peringkat tertinggi, bukan batas." },
            { text: "BBB− (di bawahnya = spekulatif/junk)", why: "Benar: di bawah BBB− = high yield/junk; fallen angel memicu jual paksa.", correct: true },
            { text: "CCC", why: "Salah: CCC sudah jauh di wilayah junk." },
            { text: "Tidak ada batas resmi", why: "Salah: batas BBB− dipakai luas oleh mandat institusi." },
          ],
        },
        {
          q: "Spread obligasi X melebar sendirian (emiten lain stabil). Respons analis yang tepat?",
          options: [
            { text: "Langsung beli — pasti murah", why: "Salah: bisa murah, bisa value trap. Investigasi dulu." },
            { text: "Langsung jual — pasti bangkrut", why: "Salah: pelebaran belum tentu = kebangkrutan." },
            { text: "Investigasi fundamental emiten: pasar mungkin mencium pemburukan", why: "Benar: pelebaran idiosinkratik = sinyal tentang emiten itu.", correct: true },
            { text: "Abaikan — spread tidak penting", why: "Salah: spread = termometer panik pasar; mengabaikannya = buta." },
          ],
        },
        {
          q: "Spread pasar 6%, LGD 50%. Berapa PD yang “ditakuti” pasar (tersirat)?",
          options: [
            { text: "3%", why: "Salah: itu 6% × 50% — rumusnya pembagian, bukan perkalian." },
            { text: "6%", why: "Salah: 6% = spread-nya, belum dibagi LGD." },
            { text: "12% (spread ÷ LGD)", why: "Benar: PD tersirat = 6%/0,5 = 12%. Bandingkan dengan PD versimu.", correct: true },
            { text: "50%", why: "Salah: 50% = LGD-nya, bukan PD tersirat." },
          ],
        },
      ],
    },
  ],
};
