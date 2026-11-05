import type { V2Lesson } from "../lib/types";

export const e14: V2Lesson = {
  slug: "e14-money-market",
  track: "Financial Markets",
  module: "Pasar Uang",
  title: "E14. Pasar Uang, Repo & Sekuritisasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-bank",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Bank butuh Rp100 miliar — semalam",
      prose: [
        "Jam 15:30, Bank X sadar: kasnya kurang Rp100 miliar untuk memenuhi kewajiban kliring besok pagi. Panik? Tidak. Telepon satu bank lain: “Repo SBN Rp100 miliar, semalam, 5,5%.” Deal dalam 10 menit. SBN-nya “digadaikan”, kas masuk, besok pagi dibeli kembali + bunga semalam.",
        "Transaksi triliunan rupiah seperti ini terjadi setiap hari — tanpa pasar uang dan repo, sistem pembayaran Indonesia macet. Repo (repurchase agreement) = jual SBN hari ini + janji beli kembali di tanggal dan harga disepakati. Ekonominya = pinjaman beragunan. Konvensi pasar uang: tahun = 360 hari.",
      ],
      formula: String.raw`\text{Bunga repo} = \text{Pokok} \times r_{\text{repo}} \times \frac{\text{hari}}{360}`,
      formulaNote: "Bunga repo = pokok × r_repo × hari/360: pokok = nilai SBN yang digadaikan; r_repo = bunga tahunan (desimal); konvensi pasar uang = tahun 360 hari. Contoh: Rp100 miliar, 5,5%, 7 hari → 100.000.000.000 × 0,055 × 7/360 = Rp106,94 juta.",
      tasks: [
        { id: "t1", text: "Hitung `bunga_7hari` repo Rp100 M, 7 hari, 5,5%" },
        { id: "t2", text: "Hitung `bunga_1hari` (overnight)" },
      ],
      expected: "bunga_7hari=106944444  bunga_1hari=15277778",
      note: {
        title: "Sering salah",
        body: "Memakai 365 hari untuk bunga pasar uang. Konvensi pasar uang = 360 hari. Selisihnya kecil per transaksi, tapi sistemik untuk triliunan rupiah.",
      },
      hints: [
        "bunga = pokok × 0,055 × hari/360.",
        "7 hari → ×7/360. 1 hari → ×1/360.",
        "bunga_7hari = 100_000_000_000 * 0.055 * 7/360",
      ],
      code: {
        starter: `pokok = 100_000_000_000  # Rp100 miliar\nr_repo = 0.055\n\n# TULIS KODEMU: bunga repo 7 hari dan 1 hari (konvensi /360)\nbunga_7hari = \nbunga_1hari = \n\nprint(f"bunga_7hari={bunga_7hari:.0f}  bunga_1hari={bunga_1hari:.0f}")`,
        lockLines: 2,
        solution: `pokok = 100_000_000_000  # Rp100 miliar\nr_repo = 0.055\n\n# TULIS KODEMU: bunga repo 7 hari dan 1 hari (konvensi /360)\nbunga_7hari = pokok * r_repo * 7 / 360\nbunga_1hari = pokok * r_repo * 1 / 360\n\nprint(f"bunga_7hari={bunga_7hari:.0f}  bunga_1hari={bunga_1hari:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bunga_7hari", value: 106944444, tol: 1, label: "`bunga_7hari` ≈ Rp106,9 jt", msg: "100M × 0,055 × 7/360 = Rp106,9 juta untuk 7 hari." },
          { kind: "equal", task: "t2", name: "bunga_1hari", value: 15277778, tol: 1, label: "`bunga_1hari` ≈ Rp15,3 jt", msg: "100M × 0,055/360 = Rp15,3 juta — “menyewa” Rp100 miliar semalam." },
          { kind: "stdout_matches", task: "t2", pattern: "bunga_7hari=106944444\\s+bunga_1hari=15277778", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Repo = gadai modern antar bank. Bunga = pokok × r × hari/360.",
    },
    {
      id: "sekuritisasi-spn",
      eyebrow: "Langkah 2 · Sekuritisasi & SPN",
      title: "Sulap kredit jadi obligasi — dan obligasi diskon",
      prose: [
        "Sekuritisasi = mengumpulkan banyak kredit (misal 10.000 KPR) menjadi satu pool, memindahkannya ke SPV, lalu menerbitkan efek beragun aset (EBA/MBS) yang arus kasnya = cicilan para debitur. Motivasi bank: bebaskan modal, transfer risiko, likuiditas. Di Indonesia: EBA diterbitkan dengan dukungan SMF.",
        "Instrumen pasar uang juga dijual dengan diskonto. SPN (Surat Perbendaharaan Negara) 90 hari, nominal Rp1 miliar, didiskonto 6%/tahun. Hitung harga belinya dan yield efektifnya (atas dana yang benar-benar ditanam).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `harga` beli SPN (nominal − diskonto)" },
        { id: "t2", text: "Hitung `yield_eff` (diskonto/harga × 360/90)" },
      ],
      expected: "harga=985000000  yield_eff=0.0609",
      note: {
        title: "Sering salah",
        body: "Mengira yield = tingkat diskonto kuotasi (6%). Yield efektif dihitung atas dana riil yang ditanam (Rp985 jt), bukan nominal — hasilnya 6,09%, sedikit di atas kuotasi.",
      },
      hints: [
        "Diskonto = 1.000.000.000 × 0,06 × 90/360 = Rp15 jt.",
        "harga = nominal − diskonto.",
        "yield_eff = diskonto / harga * (360/90)",
      ],
      code: {
        starter: `nominal = 1_000_000_000\ndiskonto_rate = 0.06\nhari = 90\n\n# TULIS KODEMU: harga beli dan yield efektif SPN\ndiskonto = \nharga = \nyield_eff = \n\nprint(f"harga={harga:.0f}  yield_eff={yield_eff:.4f}")`,
        lockLines: 3,
        solution: `nominal = 1_000_000_000\ndiskonto_rate = 0.06\nhari = 90\n\n# TULIS KODEMU: harga beli dan yield efektif SPN\ndiskonto = nominal * diskonto_rate * hari / 360\nharga = nominal - diskonto\nyield_eff = diskonto / harga * (360 / hari)\n\nprint(f"harga={harga:.0f}  yield_eff={yield_eff:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "harga", value: 985000000, tol: 1, label: "`harga` = Rp985 jt", msg: "1.000 jt − 15 jt = 985 jt." },
          { kind: "equal", task: "t2", name: "yield_eff", value: 0.0609, tol: 0.001, label: "`yield_eff` sekitar 0,0609", msg: "15/985 × 4 = 6,09% — di atas kuotasi 6% karena basisnya dana riil." },
          { kind: "stdout_matches", task: "t2", pattern: "harga=985000000\\s+yield_eff=0\\.0609", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Sekuritisasi: pool kredit → SPV → EBA ber-tranche. SPN: harga = nominal − diskonto.",
    },
    {
      id: "tranche",
      eyebrow: "Langkah 3 · Tranche",
      title: "Kue lapis risiko: siapa berdarah duluan?",
      prose: [
        "Tranche = lapisan EBA dengan urutan penyerapan kerugian berbeda. Equity (paling bawah, ~10%): menyerap rugi pertama — imbal hasil tertinggi, risiko tertinggi. Mezzanine (~20%): rugi setelah equity habis. Senior (~70%): rugi terakhir — “aman” kecuali bencana besar, rating bisa AAA.",
        "Aturan waterfall: arus kas masuk → bayar senior dulu; kerugian datang → equity menanggung dulu. Pool KPR Rp1 triliun, gagal bayar 15%, LGD 50% → rugi Rp75 miliar (7,5% pool). Simulasikan siapa menanggung berapa.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rugi` total pool (rupiah)" },
        { id: "t2", text: "Hitung `equity_hangus` (% tranche equity yang hangus)" },
      ],
      expected: "rugi=75000000000  equity_hangus=75",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tranche senior “aman” hanya sebagus asumsi korelasinya. Model 2008 memakai korelasi masa tenang; krisis menyeret semua default bersamaan (korelasi → 1) dan senior ikut berdarah. Uji modelmu dengan asumsi musuh, bukan asumsi teman.",
      },
      hints: [
        "rugi = pool × default_rate × lgd.",
        "Equity (10% = Rp100 M) menanggung pertama: min(rugi, 100M).",
        "equity_hangus = serapan_equity / 100M × 100",
      ],
      code: {
        starter: `pool = 1_000_000_000_000  # Rp1 triliun\ndefault_rate = 0.15\nlgd = 0.50\neq_porsi, mez_porsi, sen_porsi = 0.10, 0.20, 0.70\n\n# TULIS KODEMU: total rugi dan % equity yang hangus\nrugi = \nserap_equity = min(rugi, pool * eq_porsi)\nequity_hangus = \n\nprint(f"rugi={rugi:.0f}  equity_hangus={equity_hangus:.0f}")`,
        lockLines: 5,
        solution: `pool = 1_000_000_000_000  # Rp1 triliun\ndefault_rate = 0.15\nlgd = 0.50\neq_porsi, mez_porsi, sen_porsi = 0.10, 0.20, 0.70\n\n# TULIS KODEMU: total rugi dan % equity yang hangus\nrugi = pool * default_rate * lgd\nserap_equity = min(rugi, pool * eq_porsi)\nequity_hangus = serap_equity / (pool * eq_porsi) * 100\n\nprint(f"rugi={rugi:.0f}  equity_hangus={equity_hangus:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rugi", value: 75000000000, tol: 1, label: "`rugi` = Rp75 M", msg: "1T × 15% × 50% = Rp75 miliar = 7,5% pool." },
          { kind: "equal", task: "t2", name: "equity_hangus", value: 75, tol: 1e-9, label: "`equity_hangus` = 75", msg: "75M/100M = 75% tranche equity hangus; senior & mezzanine belum tersentuh." },
          { kind: "stdout_matches", task: "t2", pattern: "rugi=75000000000\\s+equity_hangus=75", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Waterfall: rugi dari equity ke atas; kas dibayar dari senior ke bawah.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang repo dan tranche.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Repo Rp100 M, 7 hari, bunga 5,5%. Bunga yang dibayar?",
          options: [
            { text: "Rp5,5 M", why: "Salah: itu jika 5,5% untuk setahun penuh — ini cuma 7 hari." },
            { text: "≈ Rp107 juta (100M × 5,5% × 7/360)", why: "Benar: konvensi pasar uang = /360. Kecil relatif — itulah gunanya agunan SBN.", correct: true },
            { text: "Rp550 juta", why: "Salah: kelebihan satu nol — hitung lagi dengan /360." },
            { text: "Gratis", why: "Salah: repo = pinjaman beragunan; bunganya kecil tapi ada." },
          ],
        },
        {
          q: "Dalam sekuritisasi, siapa menanggung kerugian PERTAMA?",
          options: [
            { text: "Tranche senior", why: "Salah: senior = rugi TERAKHIR." },
            { text: "Tranche mezzanine", why: "Salah: mezzanine = setelah equity habis." },
            { text: "Tranche equity (paling junior)", why: "Benar: equity = bantalan pertama. Rugi masuk dari bawah; kas dibayar dari atas.", correct: true },
            { text: "SPV", why: "Salah: SPV = kendaraan penerbit, bukan penanggung rugi." },
          ],
        },
      ],
    },
    {
      id: "minicase-2008",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Krisis 2008 mini: saat korelasi → 1",
      prose: [
        "Bank menerbitkan EBA dari pool KPR Rp2 triliun: senior 75% (rating AAA), mezzanine 15%, equity 10%. Model berasumsi gagal bayar tidak berkorelasi (default 8%, LGD 50% → rugi 4%). Terjadi resesi properti: harga rumah jatuh 30% nasional, default melonjak ke 35% dan berkorelasi.",
        "Pertanyaan: (a) Hitung rugi pool dan siapa menanggung berapa. (b) Apakah tranche “AAA” senior selamat? (c) Di mana kesalahan modelnya?",
        "Pembahasan: (a) Rugi = 35% × 50% × Rp2 T = Rp350 M (17,5% pool). Equity (Rp200 M) habis total; sisa Rp150 M → mezzanine (Rp300 M) hangus 50%; senior selamat — tapi nyaris. (b) Selamat secara nominal, hancur secara harga pasar: pasar melihat mezzanine jebol 50% → menuntut diskon besar untuk senior juga. Rating AAA diturunkan beruntun. Mark-to-market membunuh sebelum default membunuh. (c) Asumsi korelasi. Model memakai korelasi rendah dari masa tenang. Krisis = korelasi → 1.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sekuritisasi memindahkan risiko, bukan menghilangkannya. Selalu tanya: siapa menanggung duluan — dan apa asumsi korelasi di balik “aman”-nya tranche senior?",
      },
      reference: "2008 = pelajaran abadi: uji dengan asumsi musuh, bukan asumsi teman.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Instrumen likuiditas mana? Empat skenario",
      prose: [
        "Bank butuh kas semalam → repo/PUAB overnight: tercepat, beragunan, bunga terendah. Dana parkir 3–12 bulan → SRBI/deposito/reksa dana pasar uang: likuid, nilai stabil, sesuai horizon.",
        "Bank mau salurkan kredit baru tapi modal penuh → sekuritisasi: pindahkan kredit ke SPV → modal bebas → kredit baru (dengan tata kelola dan transparansi yang benar!). Ditawari structured product “pokok dijamin + untung besar” → bedah dulu: siapa penjamin pokok (risiko penerbit!), berapa biaya implisit vs rakit sendiri, bisa jual sebelum jatuh tempo?",
        "Aturan 10 detik: pasar uang = peredaran darah; repo macet = sirene krisis. Sekuritisasi memindahkan risiko, bukan menghilangkannya.",
      ],
      note: {
        title: "Intuisi: pasar uang = sistem peredaran darah keuangan",
        body: "Repo semalam Rp100 miliar bukan “investasi” — ia oksigen: tanpa pasar uang, kliring macet dan bank sehat pun bisa mati berdiri. Empat heuristik. Pertama: bedakan likuiditas vs solvabilitas — bank bisa kaya aset (solven) tetapi mati karena kas tidak cukup besok pagi (illikuid); 2008 membunuh yang illikuid dulu, yang insolven belakangan. Kedua: agunan menentukan segalanya — repo SBN vs repo “percaya saya” beda dunia; saat panik, pasar hanya menerima agunan terbaik (flight to quality); tanpa agunan bagus kamu bukan peserta pasar, kamu pemohon belas kasihan. Ketiga: 360 hari = konvensi, bukan fisika — selisih 5 hari dari 365 terlihat sepele, tetapi di triliunan rupiah ia nyata; pahami konvensi sebelum protes angkanya. Keempat: pasar uang = tempat parkir, bukan perkebunan — ekspektasi return-nya memang kecil; yang dibeli adalah kepastian dan kecepatan, bukan pertumbuhan; kalau butuh tumbuh, pindah ke pasar modal. Aturan 10 detiknya: butuh dana < 1 tahun → pasar uang; > 1 tahun → pasar modal; di antaranya = tanya kenapa butuh yang aneh-aneh.",
      },
      tasks: [],
      reference: "Repo = likuiditas harian. SRBI/deposito = parkir. Sekuritisasi = capital relief.",
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
        "Pasar uang = instrumen ≤ 1 tahun; peredaran darah likuiditas + jalur moneter BI (SRBI, PUAB, repo).",
        "Repo = gadai modern (SBN vs kas); bunga = pokok × r × hari/360; barometer kepercayaan antar bank.",
        "Sekuritisasi: pool kredit → SPV → EBA ber-tranche; motif bank = modal, risiko, likuiditas.",
        "Waterfall: rugi dari equity ke atas; kas dibayar dari senior ke bawah.",
        "Tranche senior “aman” hanya sebagus asumsi korelasinya — 2008 = buktinya.",
      ],
      next: { label: "E15 — Konteks Indonesia", href: "/learn/e15-indonesia" },
      quiz: [
        {
          q: "Fungsi utama pasar uang bagi bank?",
          options: [
            { text: "Spekulasi saham", why: "Salah: pasar uang = instrumen ≤ 1 tahun untuk likuiditas." },
            { text: "Manajemen likuiditas harian + transmisi kebijakan moneter BI", why: "Benar: peredaran darah sistem keuangan.", correct: true },
            { text: "Mencari untung besar", why: "Salah: return pasar uang kecil — fungsinya likuiditas." },
            { text: "Menghindari pajak", why: "Salah: tidak ada kaitan dengan pajak." },
          ],
        },
        {
          q: "Pelajaran utama 2008 tentang tranche senior AAA?",
          options: [
            { text: "Tranche tidak berguna", why: "Salah: tranche = mekanisme valid; yang gagal = asumsinya." },
            { text: "Keamanan senior bergantung pada asumsi KORELASI gagal bayar — saat krisis korelasi → 1, senior ikut berdarah", why: "Benar: titik buta = korelasi masa tenang.", correct: true },
            { text: "Rating selalu benar", why: "Salah: rating AAA justru diturunkan beruntun." },
            { text: "Sekuritisasi harus dilarang", why: "Salah: masalahnya tata kelola dan asumsi, bukan instrumennya." },
          ],
        },
        {
          q: "Structured product “pokok dijamin”. Risiko yang sering dilupakan?",
          options: [
            { text: "Tidak ada risiko", why: "Salah: selalu ada — mulai dari risiko penerbit." },
            { text: "Risiko PENERBIT — jaminan hanya sekuat bank yang menerbitkan; plus biaya tersembunyi & likuiditas rendah", why: "Benar: jika penerbit bangkrut, jaminan hangus.", correct: true },
            { text: "Risiko kurs", why: "Salah: bukan risiko utamanya." },
            { text: "Risiko inflasi saja", why: "Salah: inflasi hanya satu dari beberapa risiko." },
          ],
        },
      ],
    },
  ],
};
