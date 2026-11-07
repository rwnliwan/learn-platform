import type { V2Lesson } from "../lib/types";

export const pmcfaCalculatorDrill: V2Lesson = {
  slug: "pm-cfa-calculator-drill",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-CFA Drill Kalkulator BA II Plus",
  estMinutes: 60,
  steps: [
    {
      id: "tvm-dasar",
      eyebrow: "Langkah 1 · Lab",
      title: "TVM dasar: FV dan PV dengan lima tombol",
      prose: [
        "Lima tombol TVM di BA II Plus adalah N (jumlah periode), I/Y (tingkat per periode), PV, PMT, dan FV. Aturan tanda: uang keluar negatif, uang masuk positif — bila tandanya salah, jawabannya ikut salah tanda. Selalu tekan 2ND lalu CLR TVM sebelum soal baru, supaya sisa soal lama tidak meracuni perhitunganmu.",
        "Soal drill (ilustratif): (a) Rp1.000 diinvestasikan 10 tahun pada 8% per tahun. Urutan tombol: N=10, I/Y=8, PV=-1000, PMT=0, CPT FV — hasilnya Rp2.158,92. Tanda PV negatif karena uang keluar dari kantongmu hari ini; FV positif karena uang kembali padamu. (b) Rp5.000 diterima 5 tahun lagi, tingkat 6%. Urutan tombol: N=5, I/Y=6, PMT=0, FV=5000, CPT PV — hasilnya minus Rp3.736,29; nilai kini adalah Rp3.736,29.",
        "Lab Python di bawah menghitung hasil yang sama dengan rumus TVM. Cocokkan dengan tombolmu: bila kalkulator dan Python berbeda, yang salah hampir selalu tanda atau periode, bukan rumusnya.",
      ],
      formula: String.raw`FV = PV(1+r)^n \qquad PV = \frac{FV}{(1+r)^n}`,
      formulaNote: "FV = nilai masa depan; PV = nilai kini; r = tingkat per periode; n = jumlah periode. Lab memakai PV positif 1.000 dan FV positif 5.000, lalu menghitung nilai absolutnya.",
      tasks: [
        { id: "t1", text: "Hitung `fv` dari Rp1.000 selama 10 tahun pada 8%" },
        { id: "t2", text: "Hitung `pv` dari Rp5.000 yang diterima 5 tahun lagi pada 6%" },
      ],
      expected: "fv=2158.92  pv=3736.29",
      hints: [
        "fv = 1000 * 1.08 ** 10.",
        "pv = 5000 / 1.06 ** 5.",
        "Bulatkan 2 desimal dengan round().",
      ],
      code: {
        starter: `# TVM dasar (ilustratif)\n# (a) N=10, I/Y=8, PV=-1000, PMT=0, CPT FV\n# (b) N=5, I/Y=6, PMT=0, FV=5000, CPT PV\n\n# TULIS KODEMU\nfv = \npv = \n\nprint(f"fv={fv}  pv={pv}")`,
        lockLines: 3,
        solution: `# TVM dasar (ilustratif)\n# (a) N=10, I/Y=8, PV=-1000, PMT=0, CPT FV\n# (b) N=5, I/Y=6, PMT=0, FV=5000, CPT PV\n\n# TULIS KODEMU\nfv = round(1000 * 1.08 ** 10, 2)\npv = round(5000 / 1.06 ** 5, 2)\n\nprint(f"fv={fv}  pv={pv}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fv", value: 2158.92, tol: 0.01, label: "`fv` sekitar 2158.92", msg: "1.000 × 1,08^10 = 2.158,92." },
          { kind: "equal", task: "t2", name: "pv", value: 3736.29, tol: 0.01, label: "`pv` sekitar 3736.29", msg: "5.000 ÷ 1,06^5 = 3.736,29." },
          { kind: "stdout_matches", task: "t2", pattern: "fv=2158\\.92\\s+pv=3736\\.29", label: "`print` menampilkan keduanya", msg: "Format: fv=...  pv=... ." },
        ],
      },
      reference: "2ND CLR TVM dulu. Uang keluar negatif, uang masuk positif.",
    },
    {
      id: "anuitas",
      eyebrow: "Langkah 2 · Lab",
      title: "Anuitas dan perpetuitas: pembayaran berulang",
      prose: [
        "Anuitas memakai tombol PMT. Soal drill (ilustratif): kamu menabung Rp100 setiap akhir tahun selama 10 tahun pada 8%. Urutan tombol: N=10, I/Y=8, PV=0, PMT=-100, CPT FV — hasilnya Rp1.448,66. Nilai kini dari rangkaian tabungan yang sama: N=10, I/Y=8, PMT=100, FV=0, CPT PV — hasilnya minus Rp671,01, jadi PV-nya Rp671,01.",
        "Perpetuitas tidak punya tombol N — ia dihitung langsung: PV = PMT dibagi r. Pembayaran Rp100 per tahun selamanya pada 8% bernilai 100 ÷ 0,08 = Rp1.250. Perhatikan lompatannya: anuitas 10 tahun bernilai Rp671, tetapi menambah pembayaran sampai selamanya hanya menaikkan nilai ke Rp1.250 — pembayaran di tahun-tahun jauh didiskonto sangat berat.",
        "Jebakan paling umum: mode BGN/END. Anuitas biasa membayar di akhir periode (mode END, bawaan kalkulator). Bila soal menyebut pembayaran di awal periode, tekan 2ND lalu BGN dan pilih BGN — lupa mengembalikan ke END adalah sumber kesalahan di soal berikutnya.",
      ],
      formula: String.raw`FV_{anuitas} = PMT \times \frac{(1+r)^n - 1}{r} \qquad PV_{anuitas} = PMT \times \frac{1-(1+r)^{-n}}{r} \qquad PV_{perpetuitas} = \frac{PMT}{r}`,
      formulaNote: "PMT = pembayaran per periode; r = tingkat per periode; n = jumlah periode. Rumus perpetuitas adalah limit rumus anuitas saat n menuju tak hingga.",
      tasks: [
        { id: "t1", text: "Hitung `fv_ann` dari Rp100 per tahun selama 10 tahun pada 8%" },
        { id: "t2", text: "Hitung `pv_ann` dari rangkaian yang sama" },
        { id: "t3", text: "Hitung `pv_perp` perpetuitas Rp100 per tahun pada 8%" },
      ],
      expected: "fv_ann=1448.66  pv_ann=671.01  pv_perp=1250.0",
      hints: [
        "fv_ann = 100 * ((1.08**10 - 1) / 0.08).",
        "pv_ann = 100 * ((1 - 1.08**-10) / 0.08).",
        "pv_perp = 100 / 0.08.",
      ],
      code: {
        starter: `# Anuitas Rp100/tahun, 10 tahun, 8% (ilustratif)\n# Tombol: N=10, I/Y=8, PV=0, PMT=-100, CPT FV lalu CPT PV\n\n# TULIS KODEMU\nfv_ann = \npv_ann = \npv_perp = \n\nprint(f"fv_ann={fv_ann}  pv_ann={pv_ann}  pv_perp={pv_perp}")`,
        lockLines: 2,
        solution: `# Anuitas Rp100/tahun, 10 tahun, 8% (ilustratif)\n# Tombol: N=10, I/Y=8, PV=0, PMT=-100, CPT FV lalu CPT PV\n\n# TULIS KODEMU\nfv_ann = round(100 * ((1.08 ** 10 - 1) / 0.08), 2)\npv_ann = round(100 * ((1 - 1.08 ** -10) / 0.08), 2)\npv_perp = round(100 / 0.08, 2)\n\nprint(f"fv_ann={fv_ann}  pv_ann={pv_ann}  pv_perp={pv_perp}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fv_ann", value: 1448.66, tol: 0.01, label: "`fv_ann` sekitar 1448.66", msg: "100 × ((1,08^10 − 1) ÷ 0,08) = 1.448,66." },
          { kind: "equal", task: "t2", name: "pv_ann", value: 671.01, tol: 0.01, label: "`pv_ann` sekitar 671.01", msg: "100 × ((1 − 1,08^-10) ÷ 0,08) = 671,01." },
          { kind: "equal", task: "t3", name: "pv_perp", value: 1250.0, tol: 0.01, label: "`pv_perp` sekitar 1250.0", msg: "100 ÷ 0,08 = 1.250." },
          { kind: "stdout_matches", task: "t3", pattern: "fv_ann=1448\\.66\\s+pv_ann=671\\.01\\s+pv_perp=1250", label: "`print` menampilkan ketiganya", msg: "Format: fv_ann=...  pv_ann=...  pv_perp=... ." },
        ],
      },
      reference: "Anuitas biasa = mode END (bawaan). Pembayaran di awal periode = mode BGN, ingat kembalikan ke END.",
    },
    {
      id: "npv-irr",
      eyebrow: "Langkah 3 · Lab",
      title: "NPV dan IRR: fungsi aliran kas (CF)",
      prose: [
        "Fungsi CF di BA II Plus menyimpan arus kas yang tidak sama besar. Urutan tombol untuk proyek (ilustratif) dengan investasi awal Rp1.000 dan arus masuk Rp300, Rp400, Rp500, Rp600: tekan CF, lalu CF0 = -1000, C01 = 300, F01 = 1, C02 = 400, F02 = 1, C03 = 500, F03 = 1, C04 = 600, F04 = 1. Untuk NPV: tekan NPV, isi I = 10, lalu CPT — hasilnya Rp388,77. Untuk IRR: tekan IRR lalu CPT — hasilnya 24,89%.",
        "F01, F02, dan seterusnya adalah frekuensi: berapa kali arus kas sebesar itu berulang berturut-turut. Arus kas yang sama tiga tahun berturut-turut cukup ditulis sekali dengan F = 3 — jauh lebih cepat dan lebih kecil risikonya daripada mengetik tiga kali. Kesalahan paling umum: lupa mengisi CF0 dengan tanda negatif, sehingga NPV dan IRR sama-sama salah.",
        "IRR bisa punya lebih dari satu jawaban bila arus kas berganti tanda lebih dari sekali (misalnya investasi awal, arus masuk, lalu biaya penutupan besar). Bila kalkulator memberi IRR yang aneh, cek dulu pola tandanya — soal CFA suka menyisipkan jebakan ini.",
      ],
      formula: String.raw`NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t} \qquad IRR: NPV = 0`,
      formulaNote: "CF_t = arus kas tahun t; r = biaya modal (10% pada contoh ini). IRR di lab dicari dengan metode bisection, cara yang sama seperti kalkulator bekerja di balik layar.",
      tasks: [
        { id: "t1", text: "Hitung `npv` proyek pada biaya modal 10%" },
        { id: "t2", text: "Hitung `irr` proyek dalam persen (2 desimal)" },
      ],
      expected: "npv=388.77  irr=24.89",
      hints: [
        "npv = -1000 + 300/1.1 + 400/1.1**2 + 500/1.1**3 + 600/1.1**4.",
        "IRR: cari r yang membuat NPV nol — coba r = 25% dan lihat tandanya.",
        "Gunakan loop bisection: batas bawah 0, batas atas 1, 60 iterasi.",
      ],
      code: {
        starter: `# Arus kas (ilustratif): CF0=-1000, lalu 300, 400, 500, 600\ncfs = [-1000, 300, 400, 500, 600]\n\ndef npv_at(r):\n    return sum(cf / (1 + r) ** t for t, cf in enumerate(cfs))\n\n# TULIS KODEMU\nnpv = \n# IRR dengan bisection: lo=0.0, hi=1.0, 60 iterasi\nlo, hi = 0.0, 1.0\nfor _ in range(60):\n    mid = (lo + hi) / 2\n    if npv_at(mid) > 0:\n        lo = mid\n    else:\n        hi = mid\nirr = \n\nprint(f"npv={npv}  irr={irr}")`,
        lockLines: 6,
        solution: `# Arus kas (ilustratif): CF0=-1000, lalu 300, 400, 500, 600\ncfs = [-1000, 300, 400, 500, 600]\n\ndef npv_at(r):\n    return sum(cf / (1 + r) ** t for t, cf in enumerate(cfs))\n\n# TULIS KODEMU\nnpv = round(npv_at(0.10), 2)\n# IRR dengan bisection: lo=0.0, hi=1.0, 60 iterasi\nlo, hi = 0.0, 1.0\nfor _ in range(60):\n    mid = (lo + hi) / 2\n    if npv_at(mid) > 0:\n        lo = mid\n    else:\n        hi = mid\nirr = round((lo + hi) / 2 * 100, 2)\n\nprint(f"npv={npv}  irr={irr}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npv", value: 388.77, tol: 0.01, label: "`npv` sekitar 388.77", msg: "Pada 10%, PV arus masuk 1.388,77 dikurangi 1.000 = 388,77." },
          { kind: "equal", task: "t2", name: "irr", value: 24.89, tol: 0.05, label: "`irr` sekitar 24.89", msg: "IRR adalah r yang membuat NPV nol: sekitar 24,89%." },
          { kind: "stdout_matches", task: "t2", pattern: "npv=388\\.77\\s+irr=24\\.89", label: "`print` menampilkan keduanya", msg: "Format: npv=...  irr=... ." },
        ],
      },
      reference: "CF0 negatif = investasi awal. F = frekuensi arus kas yang berulang.",
    },
    {
      id: "amortisasi",
      eyebrow: "Langkah 4 · Lab",
      title: "Amortisasi pinjaman: cicilan dan sisa saldo",
      prose: [
        "Fungsi AMORT di BA II Plus memecah cicilan menjadi bunga dan pokok. Soal drill (ilustratif): pinjaman Rp120 juta, bunga 12% per tahun dibayar bulanan, tenor 60 bulan. Setel dulu P/Y = 12 dan C/Y = 12 lewat 2ND P/Y. Lalu urutan tombol TVM: N=60, I/Y=12, PV=120, PMT=?, FV=0, CPT PMT — hasilnya Rp2,67 juta per bulan. Perhatikan: I/Y diisi 12 (tahunan), bukan 1 — kalkulator yang membaginya menjadi 1% per bulan.",
        "Sisa saldo setelah 12 pembayaran: tekan 2ND AMORT, isi P1=1, P2=12 — kalkulator menampilkan BAL = Rp101,37 juta. Artinya pokok yang sudah dilunasi 12 bulan pertama hanya Rp18,63 juta dari total cicilan Rp32,04 juta (12 × 2,67); sisanya Rp13,41 juta adalah bunga. Inilah sifat amortisasi: cicilan awal didominasi bunga.",
        "Kesalahan paling umum: P/Y masih 1 dari soal sebelumnya, sehingga I/Y 12 dibaca 12% per bulan — cicilannya meledak. Biasakan cek 2ND P/Y di awal setiap soal pinjaman.",
      ],
      formula: String.raw`PMT = P \times \frac{r}{1-(1+r)^{-n}} \qquad BAL_k = P(1+r)^k - PMT \times \frac{(1+r)^k - 1}{r}`,
      formulaNote: "P = pokok pinjaman (Rp120 juta); r = bunga per periode (12% dibagi 12 = 1% per bulan); n = 60 bulan; k = 12 pembayaran yang sudah berjalan; BAL_k = sisa saldo setelah k pembayaran.",
      tasks: [
        { id: "t1", text: "Hitung `pmt` bulanan (Rp juta, 2 desimal)" },
        { id: "t2", text: "Hitung `saldo12` sisa saldo setelah 12 pembayaran (Rp juta)" },
        { id: "t3", text: "Hitung `pokok12` = pokok yang sudah dilunasi setelah 12 pembayaran" },
      ],
      expected: "pmt=2.67  saldo12=101.37  pokok12=18.63",
      hints: [
        "r bulanan = 0.12 / 12 = 0.01; n = 60.",
        "pmt = 120 * 0.01 / (1 - 1.01**-60).",
        "saldo12 = 120 * 1.01**12 - pmt * ((1.01**12 - 1) / 0.01).",
      ],
      code: {
        starter: `# Pinjaman Rp120 jt, 12% per tahun, 60 bulan (ilustratif)\n# Tombol: P/Y=12, N=60, I/Y=12, PV=120, FV=0, CPT PMT; 2ND AMORT P1=1 P2=12\nP, r, n = 120, 0.12 / 12, 60\n\n# TULIS KODEMU\npmt = \nsaldo12 = \npokok12 = \n\nprint(f"pmt={pmt}  saldo12={saldo12}  pokok12={pokok12}")`,
        lockLines: 3,
        solution: `# Pinjaman Rp120 jt, 12% per tahun, 60 bulan (ilustratif)\n# Tombol: P/Y=12, N=60, I/Y=12, PV=120, FV=0, CPT PMT; 2ND AMORT P1=1 P2=12\nP, r, n = 120, 0.12 / 12, 60\n\n# TULIS KODEMU\npmt_raw = P * r / (1 - (1 + r) ** -n)\npmt = round(pmt_raw, 2)\nsaldo12 = round(P * (1 + r) ** 12 - pmt_raw * (((1 + r) ** 12 - 1) / r), 2)\npokok12 = round(P - saldo12, 2)\n\nprint(f"pmt={pmt}  saldo12={saldo12}  pokok12={pokok12}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pmt", value: 2.67, tol: 0.01, label: "`pmt` sekitar 2.67", msg: "120 × 0,01 ÷ (1 − 1,01^-60) = 2,67 juta per bulan." },
          { kind: "equal", task: "t2", name: "saldo12", value: 101.37, tol: 0.02, label: "`saldo12` sekitar 101.37", msg: "Setelah 12 cicilan, sisa saldo Rp101,37 juta." },
          { kind: "equal", task: "t3", name: "pokok12", value: 18.63, tol: 0.02, label: "`pokok12` sekitar 18.63", msg: "120 − 101,37 = 18,63 juta pokok terlunasi." },
          { kind: "stdout_matches", task: "t3", pattern: "pmt=2\\.67\\s+saldo12=101\\.37\\s+pokok12=18\\.63", label: "`print` menampilkan ketiganya", msg: "Format: pmt=...  saldo12=...  pokok12=... ." },
        ],
      },
      reference: "Setel P/Y = 12 dulu. Cicilan awal didominasi bunga — saldo turun lambat.",
    },
    {
      id: "obligasi-ytm",
      eyebrow: "Langkah 5 · Lab",
      title: "Harga obligasi dan YTM pendekatan",
      prose: [
        "Obligasi dihitung dengan lima tombol TVM: N = jumlah periode kupon, I/Y = YTM per periode, PMT = kupon per periode, FV = nilai nominal, CPT PV untuk harga. Soal drill (ilustratif): obligasi nominal Rp1.000, kupon 8% per tahun, tenor 10 tahun, YTM 6%. Urutan tombol: N=10, I/Y=6, PMT=80, FV=1000, CPT PV — hasilnya minus Rp1.147,20, jadi harganya Rp1.147,20.",
        "Soal terbalik: bila harga pasar obligasi yang sama Rp950, berapa YTM-nya? Urutan tombol: N=10, PV=-950, PMT=80, FV=1000, CPT I/Y — hasilnya sekitar 8,72%. Pendekatan kasar yang bisa dihitung tanpa kalkulator: YTM kira-kira sama dengan (kupon + (nominal − harga) dibagi n) dibagi ((nominal + harga) dibagi 2) = (80 + 5) ÷ 975 = 8,72%. Cocok dengan hasil kalkulator pada contoh ini.",
        "Perhatikan: harga di atas par (Rp1.147,20) saat YTM di bawah kupon, dan di bawah par (Rp950) saat YTM di atas kupon. Bila hasilmu terbalik, cek tanda PV dan PMT: kupon dan pokok sama-sama uang masuk, jadi bertanda sama.",
      ],
      formula: String.raw`P = \sum_{t=1}^{n} \frac{C}{(1+y)^t} + \frac{F}{(1+y)^n} \qquad y \approx \frac{C + (F-P)/n}{(F+P)/2}`,
      formulaNote: "P = harga; C = kupon per periode (Rp80); F = nominal (Rp1.000); y = YTM per periode; n = 10. Rumus pendekatan di kanan hanya perkiraan — jawaban ujian tetap memakai CPT I/Y.",
      tasks: [
        { id: "t1", text: "Hitung `harga` obligasi pada YTM 6% (Rp, 2 desimal)" },
        { id: "t2", text: "Hitung `ytm_dekat` pendekatan YTM saat harga Rp950 (persen, 2 desimal)" },
      ],
      expected: "harga=1147.2  ytm_dekat=8.72",
      hints: [
        "harga = jumlah 80/1.06**t untuk t=1..10, ditambah 1000/1.06**10.",
        "ytm_dekat = ((80 + (1000-950)/10) / ((1000+950)/2)) * 100.",
        "Gunakan sum() dengan generator untuk kuponnya.",
      ],
      code: {
        starter: `# Obligasi nominal 1000, kupon 8%, tenor 10 thn (ilustratif)\n# Tombol harga: N=10, I/Y=6, PMT=80, FV=1000, CPT PV\n# Tombol YTM: N=10, PV=-950, PMT=80, FV=1000, CPT I/Y\n\n# TULIS KODEMU\nharga = \nytm_dekat = \n\nprint(f"harga={harga}  ytm_dekat={ytm_dekat}")`,
        lockLines: 3,
        solution: `# Obligasi nominal 1000, kupon 8%, tenor 10 thn (ilustratif)\n# Tombol harga: N=10, I/Y=6, PMT=80, FV=1000, CPT PV\n# Tombol YTM: N=10, PV=-950, PMT=80, FV=1000, CPT I/Y\n\n# TULIS KODEMU\nharga = round(sum(80 / 1.06 ** t for t in range(1, 11)) + 1000 / 1.06 ** 10, 2)\nytm_dekat = round(((80 + (1000 - 950) / 10) / ((1000 + 950) / 2)) * 100, 2)\n\nprint(f"harga={harga}  ytm_dekat={ytm_dekat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "harga", value: 1147.2, tol: 0.01, label: "`harga` sekitar 1147.2", msg: "PV kupon + PV pokok pada 6% = 1.147,20." },
          { kind: "equal", task: "t2", name: "ytm_dekat", value: 8.72, tol: 0.02, label: "`ytm_dekat` sekitar 8.72", msg: "(80 + 5) ÷ 975 = 8,72%." },
          { kind: "stdout_matches", task: "t2", pattern: "harga=1147\\.2\\s+ytm_dekat=8\\.72", label: "`print` menampilkan keduanya", msg: "Format: harga=...  ytm_dekat=... ." },
        ],
      },
      reference: "Harga: CPT PV. YTM: CPT I/Y. Harga di atas par bila YTM di bawah kupon.",
    },
    {
      id: "statistik",
      eyebrow: "Langkah 6 · Lab",
      title: "Statistik: mean dan sample SD dari daftar",
      prose: [
        "Fungsi STAT di BA II Plus menyimpan daftar data. Urutan tombol untuk data return (ilustratif) 12, 15, 18, 22, 9, 14, 20, 11: tekan 2ND DATA, masukkan X01=12, X02=15, dan seterusnya sampai X08=11, lalu 2ND STAT, pilih LIN, dan baca x-bar (mean) serta Sx (sample standar deviasi). Hasilnya: mean 15,125 dan Sx 4,55.",
        "Dua standar deviasi muncul di kalkulator: Sx (sample, pembagi n−1) dan sigma-x (population, pembagi n). CFA memakai Sx untuk data sampel — memilih sigma-x adalah kesalahan klasik yang menggeser jawaban dari 4,55 ke 4,26. Selalu cek kamu membaca baris yang benar.",
        "Lab Python menghitung hal yang sama. Perhatikan pembagi n−1 pada varians sampel: jumlah kuadrat selisih dari mean dibagi 7, bukan 8.",
      ],
      formula: String.raw`\bar{x} = \frac{1}{n}\sum x_i \qquad s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}}`,
      formulaNote: "x bar = mean; s = sample standar deviasi; n = 8 data. Pembagi n−1 adalah koreksi Bessel — memakai pembagi n menghasilkan population SD 4,26, bukan 4,55.",
      tasks: [
        { id: "t1", text: "Hitung `mean` dari daftar data" },
        { id: "t2", text: "Hitung `sd` sample standar deviasi (2 desimal)" },
      ],
      expected: "mean=15.125  sd=4.55",
      hints: [
        "mean = sum(data) / len(data).",
        "sd = (sum((x - mean)**2 for x in data) / (len(data) - 1)) ** 0.5.",
        "Bulatkan sd 2 desimal dengan round().",
      ],
      code: {
        starter: `# Data return (ilustratif, persen)\n# Tombol: 2ND DATA, isi X01..X08, lalu 2ND STAT, baca x-bar dan Sx\ndata = [12, 15, 18, 22, 9, 14, 20, 11]\n\n# TULIS KODEMU\nmean = \nsd = \n\nprint(f"mean={mean}  sd={sd}")`,
        lockLines: 3,
        solution: `# Data return (ilustratif, persen)\n# Tombol: 2ND DATA, isi X01..X08, lalu 2ND STAT, baca x-bar dan Sx\ndata = [12, 15, 18, 22, 9, 14, 20, 11]\n\n# TULIS KODEMU\nmean = sum(data) / len(data)\nsd = round((sum((x - mean) ** 2 for x in data) / (len(data) - 1)) ** 0.5, 2)\n\nprint(f"mean={mean}  sd={sd}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean", value: 15.125, tol: 0.001, label: "`mean` sekitar 15.125", msg: "Jumlah data 121 dibagi 8 = 15,125." },
          { kind: "equal", task: "t2", name: "sd", value: 4.55, tol: 0.01, label: "`sd` sekitar 4.55", msg: "Sample SD (pembagi 7) = 4,55; population SD (pembagi 8) = 4,26." },
          { kind: "stdout_matches", task: "t2", pattern: "mean=15\\.125\\s+sd=4\\.55", label: "`print` menampilkan keduanya", msg: "Format: mean=...  sd=... ." },
        ],
      },
      reference: "CFA memakai Sx (sample, pembagi n−1), bukan sigma-x (population).",
    },
    {
      id: "diskon-money-market",
      eyebrow: "Langkah 7 · Lab",
      title: "Diskon dan yield money market: T-bill 90 hari",
      prose: [
        "BA II Plus tidak punya tombol khusus T-bill, tetapi lima tombol TVM tetap bisa dipakai: harga T-bill adalah PV dari nilai nominal pada jatuh tempo. Soal drill (ilustratif): T-bill nominal Rp100, harga Rp98, jatuh tempo 90 hari. Diskonnya Rp2.",
        "Tiga yield yang wajib dibedakan. Discount yield memakai nominal sebagai penyebut dan tahun 360 hari: (2 ÷ 100) × (360 ÷ 90) = 8,00%. Money market yield memakai HARGA sebagai penyebut: (2 ÷ 98) × (360 ÷ 90) = 8,16%. Bond equivalent yield sama seperti money market yield tetapi memakai tahun 365 hari: (2 ÷ 98) × (365 ÷ 90) = 8,28%. Urutannya selalu: discount yield paling kecil, lalu money market yield, lalu bond equivalent yield paling besar — karena penyebutnya makin kecil dan harinya makin banyak.",
        "Jebakan soal: discount yield dan money market yield terlihat sama rumusnya, bedanya hanya penyebut (nominal vs harga). Bila soal menyebut discount basis, penyebutnya nominal; bila menyebut add-on atau money market, penyebutnya harga.",
      ],
      formula: String.raw`r_{BD} = \frac{F-P}{F} \times \frac{360}{t} \qquad r_{MM} = \frac{F-P}{P} \times \frac{360}{t} \qquad r_{BEY} = \frac{F-P}{P} \times \frac{365}{t}`,
      formulaNote: "F = nilai nominal (Rp100); P = harga (Rp98); t = hari sampai jatuh tempo (90). BD = bank discount yield; MM = money market yield; BEY = bond equivalent yield.",
      tasks: [
        { id: "t1", text: "Hitung `disc` discount yield dalam persen (2 desimal)" },
        { id: "t2", text: "Hitung `mmy` money market yield dalam persen (2 desimal)" },
        { id: "t3", text: "Hitung `bey` bond equivalent yield dalam persen (2 desimal)" },
      ],
      expected: "disc=8.0  mmy=8.16  bey=8.28",
      hints: [
        "disc = (2 / 100) * (360 / 90) * 100.",
        "mmy = (2 / 98) * (360 / 90) * 100.",
        "bey = (2 / 98) * (365 / 90) * 100.",
      ],
      code: {
        starter: `# T-bill nominal 100, harga 98, 90 hari (ilustratif)\nF, P, t = 100, 98, 90\n\n# TULIS KODEMU\ndisc = \nmmy = \nbey = \n\nprint(f"disc={disc}  mmy={mmy}  bey={bey}")`,
        lockLines: 2,
        solution: `# T-bill nominal 100, harga 98, 90 hari (ilustratif)\nF, P, t = 100, 98, 90\n\n# TULIS KODEMU\ndisc = round((F - P) / F * (360 / t) * 100, 2)\nmmy = round((F - P) / P * (360 / t) * 100, 2)\nbey = round((F - P) / P * (365 / t) * 100, 2)\n\nprint(f"disc={disc}  mmy={mmy}  bey={bey}")`,
        checks: [
          { kind: "equal", task: "t1", name: "disc", value: 8.0, tol: 0.01, label: "`disc` sekitar 8.0", msg: "(2 ÷ 100) × 4 = 8,00%." },
          { kind: "equal", task: "t2", name: "mmy", value: 8.16, tol: 0.01, label: "`mmy` sekitar 8.16", msg: "(2 ÷ 98) × 4 = 8,16%." },
          { kind: "equal", task: "t3", name: "bey", value: 8.28, tol: 0.01, label: "`bey` sekitar 8.28", msg: "(2 ÷ 98) × (365 ÷ 90) = 8,28%." },
          { kind: "stdout_matches", task: "t3", pattern: "disc=8(\\.0)?\\s+mmy=8\\.16\\s+bey=8\\.28", label: "`print` menampilkan ketiganya", msg: "Format: disc=...  mmy=...  bey=... ." },
        ],
      },
      reference: "Discount yield: penyebut nominal. Money market yield: penyebut harga. BEY: 365 hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Drill campuran: lima soal kilat",
      prose: [
        "Lima soal campuran dari semua fungsi kalkulator di lesson ini. Kerjakan dengan kalkulator dulu, baru cek jawabanmu di sini. Target: lima soal dalam 8 menit tanpa melihat catatan — itulah kecepatan yang dibutuhkan di ruang ujian.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tombol pertama yang wajib ditekan sebelum mengerjakan soal TVM baru adalah?",
          options: [
            { text: "2ND CLR TVM — menghapus sisa soal lama", why: "Benar: nilai N, I/Y, PV, PMT, FV dari soal lama masih tersimpan dan akan meracuni soal baru bila tidak dibersihkan.", correct: true },
            { text: "CPT FV — langsung menghitung", why: "Salah: menghitung dengan nilai sisa soal lama menghasilkan jawaban soal lama, bukan soal baru.", },
            { text: "2ND BGN — mengganti mode anuitas", why: "Salah: mode BGN hanya relevan bila pembayaran di awal periode; bukan langkah pembuka umum.", },
          ],
        },
        {
          q: "Pinjaman Rp120 juta, 12% per tahun, 60 bulan (ilustratif). Cicilan bulanan dan sisa saldo setelah 12 bulan?",
          options: [
            { text: "Rp2,67 juta; saldo Rp101,37 juta", why: "Benar: PMT = 2,67 juta; setelah 12 cicilan pokok terlunasi 18,63 juta sehingga saldo 101,37 juta.", correct: true },
            { text: "Rp2,00 juta; saldo Rp96,00 juta", why: "Salah: 120 ÷ 60 = 2,00 mengabaikan bunga sama sekali.", },
            { text: "Rp3,20 juta; saldo Rp81,60 juta", why: "Salah: tidak ada kombinasi P/Y dan I/Y yang benar menghasilkan angka ini.", },
          ],
        },
        {
          q: "T-bill nominal Rp100, harga Rp98, 90 hari (ilustratif). Mana urutan yield yang benar?",
          options: [
            { text: "Discount 8,00% di bawah MMY 8,16% di bawah BEY 8,28%", why: "Benar: penyebut nominal membuat discount yield paling kecil; BEY memakai 365 hari sehingga paling besar.", correct: true },
            { text: "BEY 8,28% di bawah MMY 8,16% di bawah discount 8,00%", why: "Salah: urutannya terbalik — discount yield selalu paling kecil dari ketiganya.", },
            { text: "Ketiganya sama, 8,00%", why: "Salah: penyebut dan jumlah hari berbeda menghasilkan tiga angka berbeda.", },
          ],
        },
        {
          q: "Data 12, 15, 18, 22, 9, 14, 20, 11 (ilustratif). Standar deviasi yang dipakai CFA adalah?",
          options: [
            { text: "Sx = 4,55 (sample, pembagi n−1)", why: "Benar: data adalah sampel, jadi CFA memakai Sx dengan pembagi 7.", correct: true },
            { text: "sigma-x = 4,26 (population, pembagi n)", why: "Salah: itu population SD — benar hanya bila data adalah seluruh populasi, bukan sampel.", },
            { text: "4,90 (pembagi n−2)", why: "Salah: tidak ada rumus standar deviasi dengan pembagi n−2.", },
          ],
        },
        {
          q: "Proyek CF0 minus Rp1.000, arus masuk 300, 400, 500, 600 (ilustratif). NPV pada 10% dan IRR?",
          options: [
            { text: "NPV Rp388,77; IRR 24,89%", why: "Benar: NPV positif dan IRR jauh di atas biaya modal 10% — proyek diterima.", correct: true },
            { text: "NPV Rp200,00; IRR 15,00%", why: "Salah: PV arus masuk saja sudah 1.388,77, sehingga NPV tidak mungkin 200.", },
            { text: "NPV minus Rp100,00; IRR 8,00%", why: "Salah: arus masuk total 1.800 melebihi investasi 1.000, NPV tidak mungkin negatif pada 10%.", },
          ],
        },
      ],
      summary: [
        "2ND CLR TVM sebelum soal baru; uang keluar negatif, uang masuk positif.",
        "Anuitas memakai PMT; mode END bawaan, BGN hanya untuk pembayaran di awal periode.",
        "NPV dan IRR lewat fungsi CF; F adalah frekuensi arus kas yang berulang.",
        "Pinjaman: setel P/Y = 12 dulu; cicilan awal didominasi bunga.",
        "Obligasi: CPT PV untuk harga, CPT I/Y untuk YTM.",
        "Statistik: CFA memakai Sx (sample, pembagi n−1).",
        "T-bill: discount (penyebut nominal, 360 hari) di bawah MMY (penyebut harga) di bawah BEY (365 hari).",
      ],
      next: { label: "PM-CFA Mock Exam 1: 18 Soal Gaya CFA", href: "/learn/pm-cfa-mock-exam-1" },
    },
  ],
};
