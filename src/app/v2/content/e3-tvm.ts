import type { V2Lesson } from "../lib/types";

export const e3: V2Lesson = {
  slug: "e3-tvm",
  track: "Financial Markets",
  module: "Matematika Keuangan",
  title: "E3. Time Value of Money",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-pak-haji",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Rp100 juta atau Rp140 juta?",
      prose: [
        "Pak Haji menawarkan: “Pilih — Rp100 juta cash sekarang, atau Rp140 juta lima tahun lagi.” Temanmu langsung teriak: “140 juta dong, lebih besar 40 juta!” Tapi kamu ingat deposito memberi 8% per tahun. Kamu hitung: Rp100 juta × (1,08)⁵ = Rp146,9 juta. Ternyata Rp100 juta sekarang lebih berharga dari Rp140 juta lima tahun lagi!",
        "Temanmu tidak salah hitung — 140 memang lebih besar dari 100. Ia salah dimensi: membandingkan dua angka yang hidup di “zona waktu” berbeda tanpa menyamakannya dulu. Uang punya dimensi waktu, dan bunga adalah kurs tukar antar zona waktu. Future value (FV) memajukan uang ke depan; present value (PV) memundurkannya ke hari ini.",
      ],
      formula: String.raw`FV = PV \times (1+r)^n \qquad PV = \frac{FV}{(1+r)^n}`,
      formulaNote: "PV = uang hari ini, r = bunga per periode (desimal), n = jumlah periode.",
      tasks: [
        { id: "t1", text: "Hitung `fv_jt` (Rp100 jt dimajukan 5 tahun @8%, dalam juta)" },
        { id: "t2", text: "Hitung `pv_jt` (Rp140 jt dimundurkan 5 tahun @8%, dalam juta)" },
      ],
      expected: "fv_jt=146.9  pv_jt=95.3",
      note: {
        title: "Sering salah",
        body: "Membandingkan uang beda waktu tanpa menyamakan zona waktunya dulu — seperti membandingkan 5 kg dengan 7 liter lalu menyimpulkan 7 “lebih besar”.",
      },
      hints: [
        "FV = PV × (1+r)^n. PV = FV / (1+r)^n.",
        "r = 0,08 dan n = 5. Hasilnya dibagi 1 juta agar dalam juta rupiah.",
        "fv_jt = 100 * (1.08**5)\npv_jt = 140 / (1.08**5)",
      ],
      code: {
        starter: `r = 0.08  # deposito 8% per tahun\nn = 5     # 5 tahun\n\n# TULIS KODEMU: majukan 100 jt, mundurkan 140 jt (hasil dalam juta)\nfv_jt = \npv_jt = \n\nprint(f"fv_jt={fv_jt:.1f}  pv_jt={pv_jt:.1f}")`,
        lockLines: 2,
        solution: `r = 0.08  # deposito 8% per tahun\nn = 5     # 5 tahun\n\n# TULIS KODEMU: majukan 100 jt, mundurkan 140 jt (hasil dalam juta)\nfv_jt = 100 * (1 + r) ** n\npv_jt = 140 / (1 + r) ** n\n\nprint(f"fv_jt={fv_jt:.1f}  pv_jt={pv_jt:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fv_jt", value: 146.9, tol: 0.05, label: "`fv_jt` sekitar 146,9", msg: "100 × 1,08^5 = 146,9. Cek pangkatnya: n = 5." },
          { kind: "equal", task: "t2", name: "pv_jt", value: 95.3, tol: 0.05, label: "`pv_jt` sekitar 95,3", msg: "140 / 1,08^5 = 95,3 < 100 — ambil yang sekarang." },
          { kind: "stdout_matches", task: "t2", pattern: "fv_jt=146\\.9\\s+pv_jt=95\\.3", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "FV memajukan uang (compounding); PV memundurkan uang (diskonto). Satu mesin waktu, dua arah.",
    },
    {
      id: "anuitas",
      eyebrow: "Langkah 2 · Anuitas",
      title: "Cicilan KPR: samakan periodenya dulu",
      prose: [
        "Anuitas = rangkaian pembayaran tetap tiap periode (cicilan KPR, gaji pensiun, premi asuransi). Rumus PV anuitas mengubah cicilan menjadi nilai hari ini. Sumber error #1: periode tidak konsisten — bunga tahunan 9% dengan cicilan bulanan wajib dikonversi ke 0,75%/bulan dan n = 180.",
        "Pinjaman Rp500 juta, bunga 9%/tahun, tenor 15 tahun, cicilan bulanan. Hitung cicilan bulanannya dengan rumus PMT = P × r / (1 − (1+r)^−n).",
      ],
      formula: String.raw`PV_{\text{anuitas}} = PMT \times \frac{1-(1+r)^{-n}}{r}`,
      formulaNote: "PMT = pembayaran per periode; r dan n harus satu satuan periode.",
      tasks: [
        { id: "t1", text: "Hitung `pmt_jt` cicilan bulanan (dalam juta rupiah)" },
        { id: "t2", text: "Hitung `total_jt` yang dibayar selama 180 bulan" },
      ],
      expected: "pmt_jt=5.071  total_jt=912.8",
      note: {
        title: "Sering salah",
        body: "Memakai bunga tahunan 9% langsung dengan n = 180 bulan. Cicilan bulanan → bunga harus bulanan: 9%/12 = 0,75%/bulan.",
      },
      hints: [
        "r = 0,09/12 dan n = 15×12 = 180.",
        "pmt = 500 × r / (1 − (1+r)^−n), dalam juta rupiah.",
        "total = pmt × 180",
      ],
      code: {
        starter: `P = 500  # pokok pinjaman, juta rupiah\nr = 0.09 / 12  # bunga BULANAN\nn = 15 * 12    # 180 cicilan\n\n# TULIS KODEMU: cicilan bulanan dan total bayar (juta rupiah)\npmt_jt = \ntotal_jt = \n\nprint(f"pmt_jt={pmt_jt:.3f}  total_jt={total_jt:.1f}")`,
        lockLines: 3,
        solution: `P = 500  # pokok pinjaman, juta rupiah\nr = 0.09 / 12  # bunga BULANAN\nn = 15 * 12    # 180 cicilan\n\n# TULIS KODEMU: cicilan bulanan dan total bayar (juta rupiah)\npmt_jt = P * r / (1 - (1 + r) ** -n)\ntotal_jt = pmt_jt * n\n\nprint(f"pmt_jt={pmt_jt:.3f}  total_jt={total_jt:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pmt_jt", value: 5.071, tol: 0.005, label: "`pmt_jt` sekitar 5,071", msg: "500 × 0,0075 / (1 − 1,0075^−180) = 5,071 jt/bulan. Samakan periodenya." },
          { kind: "equal", task: "t2", name: "total_jt", value: 912.8, tol: 0.5, label: "`total_jt` sekitar 912,8", msg: "5,071 × 180 = 912,8 jt — bunganya Rp412,8 jt, hampir sebesar pokoknya." },
          { kind: "stdout_matches", task: "t2", pattern: "pmt_jt=5\\.071\\s+total_jt=912\\.8", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "PMT = P × r/(1−(1+r)^−n). Samakan periode bunga dan pembayaran — selalu.",
    },
    {
      id: "ear",
      eyebrow: "Langkah 3 · EAR",
      title: "Bunga yang jujur: nominal menipu",
      prose: [
        "Bank mengiklankan bunga nominal 12% “per tahun” yang dibungakan bulanan. Biaya sebenarnya per tahun (effective annual rate): EAR = (1 + r_nom/m)^m − 1. Untuk 12% bulanan: (1,01)¹² − 1 = 12,68%. Kamu membayar 0,68% lebih mahal dari yang diiklankan!",
        "Bandingkan pinjaman A (1%/bulan) vs pinjaman B (12%/tahun dibayar tahunan) — mana yang lebih murah?",
      ],
      formula: String.raw`EAR = \left(1+\frac{r_{\text{nom}}}{m}\right)^{m} - 1`,
      formulaNote: "r_nom = bunga nominal tahunan; m = frekuensi pembungaan per tahun.",
      tasks: [
        { id: "t1", text: "Hitung `ear_a` pinjaman A (1% per bulan)" },
        { id: "t2", text: "Tentukan `pemenang` (\"A\" atau \"B\") yang lebih murah" },
      ],
      expected: "ear_a=0.1268  pemenang=B",
      note: {
        title: "Sering salah",
        body: "“Bunga 12% per tahun yang dicicil bulanan = 1% per bulan, total tetap 12%.” Salah: 1% per bulan yang berbunga-berbunga = 12,68% per tahun (EAR).",
      },
      hints: [
        "EAR A = (1 + 0,01)^12 − 1. Pinjaman B EAR-nya = 12% (dibayar tahunan).",
        "Bandingkan kedua EAR: yang lebih kecil = lebih murah.",
        "pemenang = \"B\" jika ear_a > 0.12",
      ],
      code: {
        starter: `# Pinjaman A: 1% per bulan. Pinjaman B: 12% per tahun (dibayar tahunan).\near_b = 0.12\n\n# TULIS KODEMU: EAR pinjaman A dan pemenangnya\near_a = \npemenang = \n\nprint(f"ear_a={ear_a:.4f}  pemenang={pemenang}")`,
        lockLines: 2,
        solution: `# Pinjaman A: 1% per bulan. Pinjaman B: 12% per tahun (dibayar tahunan).\near_b = 0.12\n\n# TULIS KODEMU: EAR pinjaman A dan pemenangnya\near_a = (1 + 0.01) ** 12 - 1\npemenang = "B" if ear_a > ear_b else "A"\n\nprint(f"ear_a={ear_a:.4f}  pemenang={pemenang}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ear_a", value: 0.1268, tol: 0.001, label: "`ear_a` sekitar 0,1268", msg: "(1,01)^12 − 1 = 12,68%. Makin sering pembungaan, makin besar selisihnya." },
          { kind: "stdout_matches", task: "t2", pattern: "pemenang=B", label: "Pemenang = B", msg: "12,68% > 12% — pinjaman B lebih murah. Selalu bandingkan dalam EAR." },
        ],
      },
      reference: "EAR = bunga yang jujur. Bandingkan pinjaman selalu dalam EAR, bukan nominal.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang zona waktu uang dan bunga jujur.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Rp100 jt sekarang vs Rp140 jt 5 tahun lagi, bunga 8%. Mana lebih berharga?",
          options: [
            { text: "Rp140 jt — nominalnya lebih besar", why: "Salah: 140 memang lebih besar nominalnya, tapi hidup 5 tahun di masa depan. PV-nya hanya Rp95,3 jt." },
            { text: "Rp100 jt sekarang — PV dari Rp140 jt hanya ~Rp95,3 jt", why: "Benar: 140/1,08⁵ = Rp95,3 jt < Rp100 jt. Samakan zona waktunya dulu.", correct: true },
            { text: "Sama saja", why: "Salah: Rp100 jt × 1,08⁵ = Rp146,9 jt — jelas tidak sama." },
            { text: "Tidak bisa dibandingkan", why: "Salah: justru BISA dibandingkan — dengan PV-kan keduanya ke hari ini." },
          ],
        },
        {
          q: "Pinjaman A: bunga 1% per bulan. Pinjaman B: 12% per tahun dibayar tahunan. Mana lebih murah?",
          options: [
            { text: "Sama saja, 1% × 12 = 12%", why: "Salah: perkalian sederhana mengabaikan compounding. 1% per bulan berbunga-berbunga." },
            { text: "A lebih murah", why: "Salah: EAR A = 12,68% > 12%." },
            { text: "B lebih murah — EAR A = 12,68% > 12%", why: "Benar: bunga nominal menipu — selalu bandingkan dalam EAR.", correct: true },
            { text: "Tidak bisa dibandingkan", why: "Salah: bisa — samakan ke EAR tahunan." },
          ],
        },
      ],
    },
    {
      id: "npv-irr",
      eyebrow: "Langkah 5 · Lab: NPV vs IRR",
      title: "Warung kopi Rina: buka atau tidak?",
      prose: [
        "Net present value = jumlah PV seluruh arus kas dikurangi investasi awal. Aturan: NPV > 0 → terima. NPV mengukur pertambahan kekayaan dalam rupiah — setelah memperhitungkan opportunity cost modal.",
        "Rina mau buka warung kopi: investasi Rp200 juta, laba proyeksi Rp55/65/75/70/60 juta (tahun 1–5), required return 12%. Hitung NPV-nya.",
      ],
      formula: String.raw`NPV = \sum_{t=1}^{n}\frac{CF_t}{(1+r)^t} - C_0`,
      formulaNote: "CF_t = arus kas tahun ke-t; r = tingkat diskonto; C_0 = investasi awal.",
      tasks: [
        { id: "t1", text: "Hitung `npv_jt` (dalam juta rupiah)" },
        { id: "t2", text: "Tentukan `keputusan` (\"buka\" atau \"tutup\")" },
      ],
      expected: "npv_jt=32.8  keputusan=buka",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "NPV tidak menangkap risiko proyeksi meleset (angka laba itu tebakan!), risiko likuiditas (uang terkunci 5 tahun), dan nilai opsi menutup usaha di tengah jalan.",
      },
      hints: [
        "PV tiap arus kas = CF / (1,12)^t, lalu jumlahkan dan kurangi 200.",
        "Gunakan loop atau penjumlahan langsung tiap tahun.",
        "keputusan = \"buka\" jika npv_jt > 0",
      ],
      code: {
        starter: `cf = [-200, 55, 65, 75, 70, 60]  # juta rupiah, t=0..5\nr = 0.12\n\n# TULIS KODEMU: NPV dan keputusan\nnpv_jt = \nkeputusan = \n\nprint(f"npv_jt={npv_jt:.1f}  keputusan={keputusan}")`,
        lockLines: 2,
        solution: `cf = [-200, 55, 65, 75, 70, 60]  # juta rupiah, t=0..5\nr = 0.12\n\n# TULIS KODEMU: NPV dan keputusan\nnpv_jt = sum(c / (1 + r) ** t for t, c in enumerate(cf))\nkeputusan = "buka" if npv_jt > 0 else "tutup"\n\nprint(f"npv_jt={npv_jt:.1f}  keputusan={keputusan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npv_jt", value: 32.84, tol: 0.1, label: "`npv_jt` sekitar 32,8", msg: "PV arus kas @12% = 232,8 jt; kurangi 200 jt = +32,8 jt." },
          { kind: "stdout_matches", task: "t2", pattern: "keputusan=buka", label: "Keputusan = buka", msg: "NPV positif = kekayaan bertambah setelah opportunity cost. Terima." },
        ],
      },
      reference: "NPV > 0 → terima. IRR = diskonto saat NPV=0; enak didengar tapi cacat saat proyek saling meniadakan — NPV menang.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Rumus mana untuk apa?",
      prose: [
        "“Tabunganku jadi berapa?” → FV: satu setoran (atau rutin via FV anuitas), ingin tahu hasil di masa depan. “Tawaran masa depan ini worth it?” → PV: menyamakan zona waktu ke hari ini sebelum membandingkan.",
        "“Pinjaman mana lebih murah?” → EAR: bunga nominal menipu; EAR menyamakan ke basis tahunan yang jujur. “Proyek ini diambil atau tidak?” → NPV (utama), IRR (pendamping): NPV mengukur pertambahan kekayaan dalam rupiah; IRR enak untuk komunikasi tapi cacat saat proyek saling meniadakan.",
        "Aturan 10 detik: samakan periode dulu (bunga bulanan ↔ arus kas bulanan — sumber error #1). Uang beda waktu → PV-kan dulu, baru jumlahkan/bandingkan. Pinjaman → bandingkan EAR. Proyek → putuskan dengan NPV.",
      ],
      note: {
        title: "Intuisi: uang punya harga sewa",
        body: "Bunga bukan “hadiah menabung” — ia harga sewa uang, ditentukan oleh ketidaksabaran kolektif. Empat heuristik. Pertama: setiap keputusan keuangan adalah perbandingan harga sewa — KPR 8% vs ORI 5,76% bukan soal “cinta produk”, melainkan soal mana harga sewa yang lebih mahal; pilih yang murah, bukan yang familiar. Kedua: aturan 72 — 72 ÷ persen bunga = tahun uang berlipat dua. 8% → 9 tahun; 6% → 12 tahun; 12% → 6 tahun. Estimasi 10 detik sebelum buka kalkulator — kalau hasil kasarnya saja tidak masuk akal, kalkulator hanya memperhalus kesalahan. Ketiga: r dan n wajib satu satuan — bunga bulanan 1% bukan “kecil”, ia = 12,68% efektif tahunan; cicilan “ringan” 36 bulan bisa jauh lebih mahal dari yang terlihat. Keempat: hargai opsi likuiditas — uang yang terkunci di pelunasan KPR tidak bisa ditarik saat darurat; fleksibilitas punya nilai yang tidak muncul di rumus tetapi muncul di hidup. Jebakan paling mahal di TVM bukan rumusnya, melainkan membandingkan apel nominal dengan jeruk efektif, atau apel sebelum pajak dengan jeruk sesudah pajak. Samakan dulu satuannya, baru bertarung.",
      },
      tasks: [],
      reference: "FV = ke depan, PV = ke hari ini, EAR = bandingkan pinjaman, NPV = putuskan proyek.",
    },
    {
      id: "minicase-kpr-ori",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Lunasi KPR atau beli ORI? Duel Rp500 juta",
      prose: [
        "Bu Sari menerima bonus Rp500 juta dan dihadapkan dua pilihan. Opsi A: melunasi sebagian KPR berbunga 8% per tahun — setiap rupiah pelunasan menghemat bunga 8% yang pasti, bebas pajak, bebas risiko. Opsi B: membeli ORI (obligasi ritel) kupon 6,4% — setelah PPh final 10% menjadi 5,76% bersih.",
        "Pertanyaan: (a) Secara angka murni, opsi mana yang menang dan berapa selisihnya per tahun? (b) Dalam kondisi apa opsi B — yang angkanya kalah — tetap menjadi pilihan rasional?",
        "Pembahasan: (a) Opsi A menang: penghematan bunga 8% × Rp500 juta = Rp40 juta/tahun vs kupon bersih 5,76% × Rp500 juta = Rp28,8 juta/tahun. Selisih Rp11,2 juta/tahun — dan A bebas risiko. (b) Opsi B rasional bila Bu Sari butuh likuiditas: ORI bisa dijual di pasar sekunder kapan saja, sedangkan KPR yang sudah dilunasi tidak bisa “ditarik” kembali saat butuh dana darurat. B juga menang bila ia yakin suku bunga akan turun — harga ORI naik dan ia bisa menjualnya dengan capital gain. Pelajaran TVM-nya: bandingkan selalu dalam satuan yang sama — after-tax, risk-adjusted — dan hargai opsi likuiditas yang tidak muncul di rumus.",
      ],
      tasks: [],
      reference: "Bandingkan after-tax & risk-adjusted; likuiditas punya harga yang tak tertulis di rumus.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "FV = memajukan uang (compounding); PV = memundurkan uang (diskonto). Satu mesin waktu, dua arah.",
        "Anuitas untuk arus kas tetap periodik — samakan periode bunga dan pembayaran!",
        "EAR = bunga yang jujur; selalu bandingkan pinjaman dalam EAR.",
        "NPV > 0 → terima. IRR = diskonto saat NPV=0; cacat (skala, reinvestasi); saat konflik dengan NPV, NPV menang.",
        "Jangan pernah menjumlahkan/membandingkan uang dari waktu berbeda tanpa PV-kan dulu.",
      ],
      next: { label: "E4 — Obligasi", href: "/learn/e4-obligasi" },
      quiz: [
        {
          q: "Dalam rumus anuitas KPR, kesalahan paling umum adalah…",
          options: [
            { text: "Salah memasukkan pokok pinjaman", why: "Salah: pokok biasanya jelas. Masalah klasiknya = periode." },
            { text: "Tidak menyamakan periode: bunga tahunan dipakai dengan cicilan bulanan", why: "Benar: bunga 9%/tahun dengan cicilan bulanan wajib jadi 0,75%/bulan dan n = 180.", correct: true },
            { text: "Lupa mengalikan 12", why: "Salah: justru mengalikan/membagi 12 tanpa konversi bunga yang benar = sumber error." },
            { text: "Menggunakan kalkulator", why: "Salah: kalkulator tidak salah — input periode yang salah." },
          ],
        },
        {
          q: "NPV = +Rp27 jt artinya…",
          options: [
            { text: "Proyek untung Rp27 jt secara akuntansi", why: "Salah: NPV bukan laba akuntansi — ia sudah dikurangi opportunity cost modal." },
            { text: "Proyek menambah kekayaan Rp27 jt di atas required return — terima", why: "Benar: NPV positif = kekayaan bertambah setelah memperhitungkan diskonto.", correct: true },
            { text: "Proyek impas", why: "Salah: impas = NPV 0." },
            { text: "Tolak proyek", why: "Salah: NPV positif = terima." },
          ],
        },
        {
          q: "Dua proyek saling meniadakan: A (IRR 40%, NPV Rp40 jt), B (IRR 15%, NPV Rp1,5 M). Pilih?",
          options: [
            { text: "A — IRR lebih tinggi", why: "Salah: masalah skala IRR — persen tinggi dari basis kecil kalah nilai." },
            { text: "B — NPV lebih besar; kekayaan diukur dalam rupiah", why: "Benar: yang masuk kantong adalah rupiah, bukan persen. NPV = wasit utama.", correct: true },
            { text: "Tolak keduanya", why: "Salah: keduanya NPV positif — menolak = membuang kekayaan." },
            { text: "Pilih berdasarkan firasat", why: "Salah: firasat bukan metode keputusan investasi." },
          ],
        },
        {
          q: "“Cicilan 0%” untuk elektronik — respons analis yang tepat?",
          options: [
            { text: "Langsung ambil, gratis!", why: "Salah: tidak ada makan siang gratis — harga cash sering lebih murah." },
            { text: "Hitung PV total cicilan vs harga cash — “0%” sering berarti harga sudah di-markup", why: "Benar: verifikasi dengan PV. Bandingkan total yang benar-benar keluar dari kantong.", correct: true },
            { text: "Tolak selalu", why: "Salah: kadang memang 0% betulan (promo subsidi). Verifikasi dulu, bukan tolak buta." },
            { text: "Minta bunga 0% yang benar-benar 0%", why: "Salah: bukan soal meminta — soal memverifikasi angka yang ditawarkan." },
          ],
        },
      ],
    },
  ],
};
