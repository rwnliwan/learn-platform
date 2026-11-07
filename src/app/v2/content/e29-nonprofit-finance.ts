import type { V2Lesson } from "../lib/types";

export const e29: V2Lesson = {
  slug: "e29-nonprofit-finance",
  track: "Financial Markets",
  module: "Keuangan Nonprofit",
  title: "E29. Nonprofit & Finance for Public Purpose",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-yayasan",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Yayasan dengan Rp100 miliar — dan larangan menghabiskannya",
      prose: [
        "Sebuah yayasan pendidikan menerima warisan Rp100 miliar dengan satu syarat dari pewaris: pokoknya tidak boleh disentuh — hanya hasilnya yang boleh dipakai untuk beasiswa. Pengurus yayasan menghadapi teka-teki keuangan yang sama sekali berbeda dari perusahaan biasa: bukan bagaimana memaksimalkan laba, melainkan bagaimana uang ini tetap ada seratus tahun lagi sambil mendanai beasiswa setiap tahun.",
        "Inilah dunia keuangan nonprofit: organisasi yang tidak punya pemilik, tidak membagikan dividen, dan tidak bisa dijual — tetapi mengelola uang dalam jumlah besar dengan tanggung jawab antar generasi. Lesson ini membahas yayasan dan endowment, aturan belanja yang menjaga dana abadi, perbedaan filantropi dan impact investing, serta tata kelola yang membuat donatur percaya.",
      ],
      tasks: [],
      reference: "Nonprofit = tanpa pemilik, tanpa dividen — tetapi dengan tanggung jawab antar generasi.",
    },
    {
      id: "yayasan-endowment",
      eyebrow: "Langkah 2 · Yayasan & endowment",
      title: "Dana abadi: pokok dijaga, hasil dibelanjakan",
      prose: [
        "Yayasan (foundation) adalah badan hukum nirlaba yang mengelola dana untuk tujuan sosial — pendidikan, kesehatan, keagamaan, atau lingkungan. Endowment (dana abadi) adalah kumpulan dana yang pokoknya dipertahankan selamanya, sementara hasil investasinya dipakai untuk mendanai misi organisasi. Universitas besar dunia menjalankan sebagian operasionalnya dari hasil endowment; rumah sakit nirlaba membiayai layanan bagi pasien tidak mampu dari sumber yang sama.",
        "Tiga ciri membedakan endowment dari dana perusahaan biasa. Pertama, horizon abadi: tidak ada tanggal jatuh tempo — pengelola hari ini adalah wali bagi generasi yang belum lahir. Kedua, donor intent: syarat pewaris atau donatur mengikat secara hukum — dana beasiswa tidak boleh dialihkan menjadi gedung rektorat. Ketiga, intergenerational equity: generasi hari ini dan generasi mendatang berhak atas manfaat yang setara — belanja berlebihan hari ini adalah pencurian dari masa depan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira endowment = tabungan besar yang boleh dipakai kapan saja. Endowment terikat donor intent dan prinsip abadi — memakai pokoknya bisa melanggar hukum dan kepercayaan donatur.",
      },
      reference: "Endowment: pokok abadi, hasil untuk misi, syarat donatur mengikat.",
    },
    {
      id: "spending-rule",
      eyebrow: "Langkah 3 · Spending rule",
      title: "Aturan belanja 5%: kenapa tidak 10%?",
      prose: [
        "Spending rule adalah persentase endowment yang boleh dibelanjakan tiap tahun. Angka klasik: 5% — dipakai banyak universitas dan yayasan besar. Logikanya sederhana: bila return nominal 7% dan inflasi 3%, maka return riil 4%. Belanja 5% berarti mengambil 1 poin persentase lebih dari yang dihasilkan secara riil — pokok tergerus perlahan dalam nilai riil. Belanja 4% justru menjaga daya beli pokok tetap utuh selamanya.",
        "Contoh ilustratif: endowment Rp100 miliar. Aturan 5% → belanja Rp5 miliar per tahun. Tetapi return riil hanya 4% → dana yang bisa dibelanjakan tanpa menggerus daya beli pokok hanya Rp4 miliar. Selisih Rp1 miliar per tahun adalah erosi diam-diam: dalam 20 tahun, daya beli pokok menyusut sekitar seperlima bila pola ini dipertahankan. Karena itu banyak endowment memakai rata-rata nilai pasar 3 tahun (smoothing) agar belanja tidak melonjak saat pasar bagus dan tidak anjlok saat pasar jatuh. Hitung sendiri di lab.",
      ],
      formula: String.raw`\text{Belanja} = \text{spending rate} \times \text{endowment} \qquad \text{Return riil} \approx \text{return nominal} - \text{inflasi}`,
      formulaNote: "Contoh ilustratif: endowment Rp100 miliar, spending rate 5% → belanja Rp5 miliar; return nominal 7% − inflasi 3% = return riil 4% → belanja berkelanjutan Rp4 miliar; selisih Rp1 miliar per tahun = erosi daya beli pokok.",
      tasks: [
        { id: "t1", text: "Hitung `spending_5pct` (belanja tahunan aturan 5% dari Rp100 M)" },
        { id: "t2", text: "Hitung `sustainable` (belanja berkelanjutan pada return riil 4%)" },
      ],
      expected: "spending_5pct=5000000  sustainable=4000000",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Spending rule yang melebihi return riil = rencana kebangkrutan lambat. Risiko terbesar endowment bukan satu tahun buruk — melainkan belanja yang diam-diam lebih besar dari yang dihasilkan, tahun demi tahun.",
      },
      hints: [
        "spending_5pct = endowment × 0,05.",
        "return riil = 0,07 − 0,03 = 0,04.",
        "sustainable = endowment × return riil.",
      ],
      code: {
        starter: `endowment = 100_000_000  # Rp100 juta (ilustratif)\nreturn_nominal = 0.07\ninflasi = 0.03\nspending_rate = 0.05\n\n# TULIS KODEMU: belanja aturan 5% dan belanja berkelanjutan\nspending_5pct = \nreturn_riil = return_nominal - inflasi\nsustainable = \n\nprint(f"spending_5pct={spending_5pct:.0f}  sustainable={sustainable:.0f}")`,
        lockLines: 4,
        solution: `endowment = 100_000_000  # Rp100 juta (ilustratif)\nreturn_nominal = 0.07\ninflasi = 0.03\nspending_rate = 0.05\n\n# TULIS KODEMU: belanja aturan 5% dan belanja berkelanjutan\nspending_5pct = endowment * spending_rate\nreturn_riil = return_nominal - inflasi\nsustainable = endowment * return_riil\n\nprint(f"spending_5pct={spending_5pct:.0f}  sustainable={sustainable:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "spending_5pct", value: 5000000, tol: 1, label: "`spending_5pct` = Rp5 jt", msg: "100 jt × 5% = Rp5 juta per tahun." },
          { kind: "equal", task: "t2", name: "sustainable", value: 4000000, tol: 1, label: "`sustainable` = Rp4 jt", msg: "100 jt × (7% − 3%) = Rp4 juta — selisih Rp1 juta = erosi tahunan." },
          { kind: "stdout_matches", task: "t2", pattern: "spending_5pct=5000000\\s+sustainable=4000000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Spending 5% vs return riil 4% = erosi Rp1 juta per tahun pada Rp100 juta.",
    },
    {
      id: "filantropi-impact",
      eyebrow: "Langkah 4 · Filantropi vs impact investing",
      title: "Memberi uang vs menanam uang: dua logika berbeda",
      prose: [
        "Filantropi (grant-making) = memberi dana tanpa mengharapkan kembali — hibah beasiswa, bantuan bencana, riset. Ukuran suksesnya: dampak sosial per rupiah, bukan return finansial. Yayasan tradisional bekerja dengan cara ini: investasikan endowment secara konvensional, belanjakan hasilnya sebagai hibah.",
        "Impact investing = menanam dana pada usaha yang menghasilkan dampak sosial DAN return finansial — misalnya pinjaman berbunga rendah untuk klinik di daerah terpencil, atau ekuitas pada perusahaan energi bersih. Dana bisa kembali dan dipakai ulang — satu rupiah bekerja berkali-kali. Tetapi ada tegangan: bila return dikejar terlalu agresif, dampak sosialnya tergerus; bila dampak diprioritaskan mutlak, dananya tidak kembali. Spektrumnya: di satu ujung hibah murni (return −100%), di ujung lain investasi komersial biasa (dampak nol). Kebanyakan yayasan menempatkan sebagian kecil portofolio di tengah spektrum — program-related investments — sambil menjaga inti endowment tetap pada investasi konvensional yang prudent.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: satu rupiah, dua neraca",
        body: "Filantropi mengukur satu neraca: dampak. Impact investing mengukur dua neraca sekaligus: dampak dan return. Dua neraca berarti dua kemungkinan gagal — dan dua kemungkinan berhasil.",
      },
      reference: "Hibah = dana tidak kembali. Impact investing = dana kembali + dampak.",
    },
    {
      id: "tata-kelola",
      eyebrow: "Langkah 5 · Tata kelola nonprofit",
      title: "Siapa mengawasi pengawas? Dewan, audit, dan transparansi",
      prose: [
        "Nonprofit tidak punya pemegang saham yang bisa memecat direksi — sehingga tata kelola harus menggantikan disiplin pasar. Dewan pengurus (board) yang independen menyetujui anggaran, mengawasi investasi endowment, dan memastikan misi tidak bergeser. Komite investasi menetapkan investment policy statement: alokasi aset, batas risiko, dan spending rule — agar keputusan investasi tidak bergantung pada selera satu orang.",
        "Dua pengaman lain: audit eksternal tahunan dan laporan publik. Donatur tidak bisa “menjual sahamnya” bila kecewa — satu-satunya hukuman mereka adalah berhenti menyumbang. Karena itu transparansi bukan kosmetik: laporan keuangan yang terbuka, konflik kepentingan yang diungkap, dan gaji pengurus yang wajar adalah modal kepercayaan yang nilainya melebihi endowment itu sendiri. Skandal satu yayasan menular ke seluruh sektor — donatur tidak membedakan yayasan yang curang dengan yayasan yang jujur, mereka hanya berhenti memberi.",
      ],
      tasks: [],
      reference: "Tanpa pemegang saham, tata kelola = dewan independen + audit + transparansi.",
    },
    {
      id: "contoh-universitas-rs",
      eyebrow: "Langkah 6 · Contoh: universitas & rumah sakit",
      title: "Berapa endowment yang dibutuhkan untuk satu beasiswa selamanya?",
      prose: [
        "Universitas dan rumah sakit adalah pengguna endowment terbesar. Universitas memakai hasil endowment untuk beasiswa, gaji profesor, dan riset; rumah sakit nirlaba memakainya untuk layanan pasien tidak mampu dan peralatan. Pertanyaan praktis yang sama muncul di keduanya: berapa dana abadi yang dibutuhkan untuk mendanai satu pos belanja selamanya?",
        "Rumusnya adalah kebalikan spending rule: endowment yang dibutuhkan = belanja tahunan dibagi spending rate berkelanjutan. Contoh ilustratif: satu beasiswa penuh Rp50 juta per tahun, spending rate berkelanjutan 4% (return riil) → endowment yang dibutuhkan = 50.000.000 / 0,04 = Rp1.250.000.000. Satu beasiswa selamanya “berharga” Rp1,25 miliar dana abadi. Inilah cara yayasan mengonversi janji abadi menjadi angka: setiap komitmen tahunan baru harus disertai dana abadi yang menopangnya, atau janji itu akan memakan pokok.",
      ],
      formula: String.raw`\text{Endowment dibutuhkan} = \frac{\text{belanja tahunan}}{\text{spending rate berkelanjutan}}`,
      formulaNote: "Contoh ilustratif: beasiswa Rp50 juta per tahun / 0,04 = Rp1.250.000.000 dana abadi.",
      tasks: [
        { id: "t1", text: "Hitung `endowment_butuh` untuk beasiswa Rp50 jt/tahun pada spending rate 4%" },
      ],
      expected: "endowment_butuh=1250000000",
      note: {
        title: "Sering salah",
        body: "Menghitung endowment dari return NOMINAL (7%) bukan return RIIL (4%). Inflasi menggerogoti daya beli — memakai 7% berarti meremehkan dana yang dibutuhkan hampir setengahnya.",
      },
      hints: [
        "endowment_butuh = belanja_tahunan / spending_rate.",
        "50.000.000 / 0,04 = 1.250.000.000.",
      ],
      code: {
        starter: `beasiswa_tahunan = 50_000_000  # Rp50 juta per tahun (ilustratif)\nspending_rate = 0.04  # return riil: 7% nominal - 3% inflasi\n\n# TULIS KODEMU: dana abadi yang dibutuhkan\nendowment_butuh = \n\nprint(f"endowment_butuh={endowment_butuh:.0f}")`,
        lockLines: 2,
        solution: `beasiswa_tahunan = 50_000_000  # Rp50 juta per tahun (ilustratif)\nspending_rate = 0.04  # return riil: 7% nominal - 3% inflasi\n\n# TULIS KODEMU: dana abadi yang dibutuhkan\nendowment_butuh = beasiswa_tahunan / spending_rate\n\nprint(f"endowment_butuh={endowment_butuh:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "endowment_butuh", value: 1250000000, tol: 1, label: "`endowment_butuh` = Rp1,25 M", msg: "50 jt / 0,04 = Rp1,25 miliar dana abadi untuk satu beasiswa selamanya." },
          { kind: "stdout_matches", task: "t1", pattern: "endowment_butuh=1250000000", label: "`print` menampilkan hasilnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Satu beasiswa Rp50 jt/tahun selamanya = Rp1,25 miliar dana abadi.",
    },
    {
      id: "minicase-naik-spending",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Yayasan mau naikkan belanja ke 6% — setuju atau tidak?",
      prose: [
        "Yayasan pendidikan dengan endowment ilustratif Rp100 miliar sedang mempertimbangkan menaikkan spending rate dari 5% menjadi 6% — tambahan Rp1 miliar per tahun untuk beasiswa baru. Return nominal 7%, inflasi 3%. Argumen pendukung: beasiswa tambahan mengubah hidup 20 mahasiswa sekarang; pasar sedang bagus dan endowment tumbuh 12% tahun lalu. Argumen penentang: return riil hanya 4% — belanja 6% berarti menggerus pokok 2 poin per tahun; satu tahun pasar bagus bukan bukti return permanen.",
        "Pembahasan: hitungannya berpihak pada penentang. Belanja 6% = Rp6 juta per tahun (dalam skala Rp100 juta: Rp6.000.000) melawan return riil Rp4.000.000 — defisit Rp2.000.000 per tahun yang memakan pokok. Dalam 20 tahun dengan pola ini, daya beli pokok menyusut sekitar sepertiga. Keputusan yang prudent: pertahankan 5% dan danai beasiswa tambahan dari donasi baru atau hibah khusus — bukan dari menggerus pokok. Bila dewan tetap ingin 6%, ia wajib menuliskan secara eksplisit: yayasan ini memilih mengecil demi generasi sekarang, dan mempertanggungjawabkannya kepada donatur.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Endowment Rp100 juta (ilustratif), return riil 4%. Yayasan belanja 6% per tahun. Apa yang terjadi?",
          options: [
            { text: "Tidak ada — 6% masih di bawah return nominal 7%", why: "Salah: yang relevan return RIIL (4%), bukan nominal — inflasi ikut memakan pokok." },
            { text: "Pokok tergerus 2 poin per tahun dalam nilai riil — rencana pengecilan diam-diam", why: "Benar: 6% − 4% = 2 poin defisit tahunan atas daya beli pokok.", correct: true },
            { text: "Endowment tumbuh karena belanja merangsang donasi", why: "Salah: belanja tidak menciptakan return — itu harapan, bukan hitungan." },
            { text: "Tidak masalah bila pasar naik tahun lalu", why: "Salah: satu tahun bagus bukan return permanen — smoothing ada untuk ini." },
          ],
        },
        {
          q: "Kenapa yayasan memakai rata-rata nilai pasar 3 tahun (smoothing) untuk spending rule?",
          options: [
            { text: "Agar belanja tidak melonjak saat pasar bagus dan tidak anjlok saat pasar jatuh", why: "Benar: smoothing menstabilkan belanja antar tahun.", correct: true },
            { text: "Agar return terlihat lebih tinggi", why: "Salah: smoothing tidak mengubah return — hanya dasar hitung belanja." },
            { text: "Agar audit lebih mudah", why: "Salah: bukan alasan smoothing." },
            { text: "Agar donatur tidak tahu nilai endowment", why: "Salah: terbalik — transparansi justru wajib." },
          ],
        },
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Nonprofit: tanpa pemilik dan tanpa dividen, tetapi mengelola dana besar dengan tanggung jawab antar generasi.",
        "Endowment: pokok dipertahankan selamanya, hasilnya mendanai misi; donor intent mengikat secara hukum.",
        "Spending rule klasik 5%; belanja berkelanjutan = return riil (nominal − inflasi) — selisihnya = erosi pokok.",
        "Filantropi = hibah tanpa kembali; impact investing = dana kembali + dampak, dua neraca sekaligus.",
        "Tata kelola: dewan independen, investment policy statement, audit, dan transparansi menggantikan disiplin pasar.",
        "Satu beasiswa Rp50 jt/tahun selamanya butuh Rp1,25 miliar dana abadi pada spending rate 4%.",
      ],
      next: { label: "E1 — Struktur Pasar (awal track)", href: "/learn/e1-struktur-pasar" },
      quiz: [
        {
          q: "Apa itu endowment?",
          options: [
            { text: "Tabungan yayasan yang boleh dipakai kapan saja", why: "Salah: pokok endowment dipertahankan selamanya; hanya hasilnya yang dibelanjakan." },
            { text: "Dana abadi: pokok dijaga selamanya, hasil investasinya mendanai misi", why: "Benar: plus donor intent yang mengikat secara hukum.", correct: true },
            { text: "Pinjaman bank untuk yayasan", why: "Salah: endowment bukan utang." },
            { text: "Dividen yang dibagikan ke donatur", why: "Salah: nonprofit tidak membagikan dividen." },
          ],
        },
        {
          q: "Endowment Rp100 juta (ilustratif), return nominal 7%, inflasi 3%. Berapa belanja tahunan yang berkelanjutan?",
          options: [
            { text: "Rp7 juta (return nominal)", why: "Salah: inflasi 3% menggerogoti daya beli — yang berkelanjutan return riil." },
            { text: "Rp4 juta (return riil 4%)", why: "Benar: 7% − 3% = 4%; belanja di atas itu menggerus pokok.", correct: true },
            { text: "Rp3 juta (inflasi saja)", why: "Salah: inflasi bukan return." },
            { text: "Rp10 juta", why: "Salah: dua kali lipat return riil — pokok habis dalam hitungan dekade." },
          ],
        },
        {
          q: "Beasiswa Rp50 juta per tahun selamanya, spending rate 4%. Dana abadi yang dibutuhkan?",
          options: [
            { text: "Rp50 juta", why: "Salah: itu satu tahun beasiswa, bukan dana abadi." },
            { text: "Rp1,25 miliar (50 jt / 0,04)", why: "Benar: kebalikan spending rule.", correct: true },
            { text: "Rp200 juta", why: "Salah: 50 jt / 0,25 — spending rate-nya salah." },
            { text: "Rp2 miliar", why: "Salah: 50 jt / 0,025 — bukan 4%." },
          ],
        },
        {
          q: "Apa beda utama impact investing dengan filantropi hibah?",
          options: [
            { text: "Tidak ada bedanya", why: "Salah: hibah tidak kembali, impact investing mengharapkan dana kembali plus dampak." },
            { text: "Impact investing mengharapkan dana kembali DAN dampak sosial; hibah tidak mengharapkan kembali", why: "Benar: dua neraca sekaligus — return dan dampak.", correct: true },
            { text: "Impact investing tidak peduli dampak", why: "Salah: dampak adalah setengah dari definisinya." },
            { text: "Hibah selalu lebih besar nilainya", why: "Salah: bukan soal besar-kecil, melainkan soal dana kembali atau tidak." },
          ],
        },
        {
          q: "Nonprofit tidak punya pemegang saham. Apa pengganti disiplin pasarnya?",
          options: [
            { text: "Tidak ada — nonprofit tidak butuh pengawasan", why: "Salah: justru karena tidak ada pemegang saham, tata kelola harus lebih kuat." },
            { text: "Dewan independen + investment policy statement + audit + transparansi publik", why: "Benar: kepercayaan donatur adalah modal yang nilainya melebihi endowment.", correct: true },
            { text: "Pemerintah mengelola semuanya", why: "Salah: pemerintah mengatur, bukan mengelola yayasan." },
            { text: "Donatur memecat direksi lewat RUPS", why: "Salah: nonprofit tidak punya RUPS — donatur hanya bisa berhenti menyumbang." },
          ],
        },
      ],
    },
  ],
};
