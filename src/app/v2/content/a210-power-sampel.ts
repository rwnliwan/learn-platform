import type { V2Lesson } from "../lib/types";

export const a210: V2Lesson = {
  slug: "a210-power-sampel",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.10 Berapa Data yang Cukup? Power & Ukuran Sampel",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-obat",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Obat yang gagal padahal manjur",
      prose: [
        "Tahun 2008, perusahaan farmasi menguji obat diabetes baru pada 120 pasien. Hasil: penurunan gula darah 0,4 poin lebih baik dari plasebo, p = 0,12 — tidak signifikan. Proyek dihentikan. Kerugian: 6 tahun riset + $400 juta. Dua tahun kemudian kompetitor menguji obat sejenis pada 800 pasien: efek 0,38 poin — praktis identik — p < 0,001. Obat disetujui, meraup $2 miliar/tahun.",
        "Obat pertama tidak gagal — studinya yang gagal. Dengan n = 120, power untuk mendeteksi efek sebesar itu hanya ~35%. Mereka melempar koin yang 65% meleset, lalu menyalahkan obatnya. Kegagalan termahal bukan eksperimen yang salah — melainkan eksperimen yang benar tapi terlalu kecil untuk melihat jawabannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_butuh` total (aturan 16: 16σ²/δ² per grup, σ=1,2, δ=0,4)" },
        { id: "t2", text: "Hitung `kekurangan` = n_butuh − 120" },
      ],
      expected: "n_butuh=288  kekurangan=168",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Vonis obat gagal dari studi underpowered = menyalahkan obat atas kegagalan desain. Dalam bisnis: keputusan stop/go dari A/B test yang terlalu kecil bisa membunuh fitur yang sebenarnya menguntungkan — atau meloloskan yang merugikan.",
      },
      hints: [
        "n per grup = 16 × σ² / δ².",
        "n_butuh = 2 × n per grup.",
        "n_grup = 16*1.2**2/0.4**2",
      ],
      code: {
        starter: `sigma, delta = 1.2, 0.4\n\n# TULIS KODEMU\nn_grup = \nn_butuh = \nkekurangan = \n\nprint(f"n_butuh={n_butuh}  kekurangan={kekurangan}")`,
        lockLines: 1,
        solution: `sigma, delta = 1.2, 0.4\n\n# TULIS KODEMU\nn_grup = round(16*sigma**2/delta**2)\nn_butuh = 2*n_grup\nkekurangan = n_butuh - 120\n\nprint(f"n_butuh={n_butuh}  kekurangan={kekurangan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_butuh", value: 288, tol: 1e-9, label: "`n_butuh` seharusnya 288", msg: "16 × 1,44/0,16 = 144 per grup → 288 total." },
          { kind: "equal", task: "t2", name: "kekurangan", value: 168, tol: 1e-9, label: "`kekurangan` seharusnya 168", msg: "288 − 120 = 168 pasien kurang — lebih dari separuh." },
          { kind: "stdout_matches", task: "t2", pattern: "n_butuh=288\\s+kekurangan=168", label: "`print` menampilkan keduanya", msg: "Format: n_butuh=...  kekurangan=... ." },
        ],
      },
      reference: "10 menit perhitungan sebelum eksperimen mencegah kerugian $400 juta.",
    },
    {
      id: "empat-tuas",
      eyebrow: "Langkah 2 · Anatomi power",
      title: "Power: empat tuas, satu yang kamu kendalikan",
      prose: [
        "Power = 1 − β: peluang mendeteksi efek yang benar-benar ada. Visualnya dua kurva: di bawah H0 (pusat di 0) dan di bawah H1 (pusat di efek δ). Power = luas kurva H1 yang jatuh di daerah penolakan H0. Empat tuas: δ besar → kurva biru menjauh; n besar → kurva menyempit; α longgar → batas bergeser; σ kecil → kurva menyempit.",
        "Dari empat tuas, n adalah satu-satunya yang sepenuhnya dalam kendalimu — itulah mengapa lesson ini tentang menghitung n. Dan ingat: power adalah probabilitas bersyarat pada δ tertentu. Power studi ini 80% adalah kalimat tidak lengkap; yang lengkap: power 80% untuk mendeteksi d = 0,5 pada α = 5%.",
      ],
      formula: String.raw`\text{Power} = P(\text{tolak } H_0 \mid H_1 \text{ benar}) = 1 - \beta`,
      formulaNote: "Power = peluang menolak H0 saat H1 benar; beta = peluang error Tipe II (gagal mendeteksi efek yang nyata); power selalu bersyarat pada besar efek delta tertentu — tanpa delta, angka power yatim.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "n = 30 selalu cukup. Salah: n = 30 adalah aturan untuk aproksimasi normal (CLT), bukan untuk power. Untuk d = 0,5, n = 30 per grup hanya memberi power ~48% — lempar koin! n yang cukup tergantung δ, σ, α, dan power target — tidak ada angka ajaib universal.",
      },
      reference: "Selalu tanya: 80% untuk efek sebesar apa?",
    },
    {
      id: "rumus-n",
      eyebrow: "Langkah 3 · Rumus ukuran sampel",
      title: "Dari power ke n: rumus dan aturan 16",
      prose: [
        "Untuk beda dua mean (n sama per grup, uji dua sisi): n = 2σ²(z₁₋α/₂ + z₁₋β)²/δ². z = 1,96 untuk α = 5%; 0,84 untuk power 80%. Versi super-praktis: aturan 16 — n per grup ≈ 16σ²/δ². Contoh obat tadi: 16 × 1,44/0,16 = 144 per grup → 288 total. Kegagalan itu tertulis di rumus sebelum studi dimulai.",
        "Untuk beda dua proporsi: ganti σ² dengan p̄(1−p̄). Contoh: baseline konversi 5%, ingin deteksi lift ke 7% (δ = 2 pp). n = 2×0,06×0,94×(2,8)²/0,02² ≈ 2.211 per grup → ~4.400 total. Jika trafik hanya 1.000/minggu → tidak feasible → naikkan MDE atau terima power lebih rendah.",
      ],
      formula: String.raw`n = \frac{2\sigma^2(z_{1-\alpha/2} + z_{1-\beta})^2}{\delta^2} \approx \frac{16\sigma^2}{\delta^2}`,
      formulaNote: "n = ukuran sampel per grup; sigma = simpangan baku populasi; z_{1-alpha/2} = kuantil normal untuk confidence (1,96 untuk alpha 5 persen); z_{1-beta} = kuantil untuk power (0,84 untuk 80 persen); delta = efek terkecil yang ingin dideteksi (MDE).",
      tasks: [
        { id: "t1", text: "Hitung `n_grup` aturan 16 untuk obat (σ=1,2, δ=0,4)" },
        { id: "t2", text: "Hitung `n_prop` per grup untuk beda proporsi (baseline 5%→7%)" },
      ],
      expected: "n_grup=144  n_prop=2211",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Pakai n = 30 per grup untuk semua eksperimen. Salah: n yang cukup tergantung δ, σ, α, dan power target. Untuk efek kecil (d = 0,2), power 80% butuh n ≈ 400 per grup — bukan 30.",
      },
      hints: [
        "n_grup = round(16*sigma**2/delta**2).",
        "Untuk proporsi: 2×p̄(1−p̄)×(1,96+0,84)²/δ².",
        "n_prop = round(2*0.06*0.94*(2.8)**2/0.02**2)",
      ],
      code: {
        starter: `# TULIS KODEMU\nn_grup = \nn_prop = \n\nprint(f"n_grup={n_grup}  n_prop={n_prop}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU\nn_grup = round(16*1.2**2/0.4**2)\nn_prop = round(2*0.06*0.94*(1.96+0.84)**2/0.02**2)\n\nprint(f"n_grup={n_grup}  n_prop={n_prop}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_grup", value: 144, tol: 1e-9, label: "`n_grup` seharusnya 144", msg: "16 × 1,44/0,16 = 144." },
          { kind: "equal", task: "t2", name: "n_prop", value: 2211, tol: 2, label: "`n_prop` sekitar 2211", msg: "2×0,06×0,94×7,84/0,0004 ≈ 2.211." },
          { kind: "stdout_matches", task: "t2", pattern: "n_grup=144\\s+n_prop=2211", label: "`print` menampilkan keduanya", msg: "Format: n_grup=...  n_prop=... ." },
        ],
      },
      reference: "Aturan 16 untuk estimasi cepat (α=5%, power=80%, dua sisi).",
    },
    {
      id: "mde",
      eyebrow: "Langkah 4 · MDE",
      title: "MDE: negosiasi tersulit dalam eksperimen",
      prose: [
        "MDE (Minimum Detectable Effect) adalah efek terkecil yang penting secara bisnis untuk dideteksi — bukan efek yang kamu harapkan, melainkan efek di bawah mana kamu tidak peduli. Cara menentukan dari bisnis: break-even (efek berapa yang membuat nilai harapan eksperimen = 0?), opportunity cost, dan risiko (efek negatif sebesar apa yang harus bisa dideteksi?).",
        "Hubungan MDE–n: n ∝ 1/MDE² — MDE separuhnya → n 4× lipat. MDE 5 pp butuh ~300/varian; MDE 0,5 pp butuh ~30.000/varian — 100× lipat untuk 10× presisi. Jika trafikmu 2.000/hari, MDE 0,5 pp berarti test 15 hari — masuk akal. MDE 0,1 pp berarti 375 hari — tidak masuk akal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `faktor` = kenaikan n jika MDE 2 pp → 1 pp" },
        { id: "t2", text: "Hitung `hari` = 30.000 / 2.000 (durasi test per varian)" },
      ],
      expected: "faktor=4  hari=15.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Tentukan MDE dari efek yang diharapkan (optimisme!). Salah: tentukan dari keputusan — jika efek sebenarnya hanya sebesar X, apakah kami tetap bertindak? Jika tidak, X adalah MDE yang tepat. Eksperimen yang didesain untuk efek harapan akan underpowered tepat saat hasilnya mengecewakan tapi penting.",
      },
      hints: [
        "n ∝ 1/δ² → δ separuh → n 4×.",
        "faktor = (2/1)**2.",
        "hari = 30000/2000",
      ],
      code: {
        starter: `# TULIS KODEMU\nfaktor = \nhari = \n\nprint(f"faktor={faktor}  hari={hari}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU\nfaktor = (2/1)**2\nhari = 30000/2000\n\nprint(f"faktor={faktor}  hari={hari}")`,
        checks: [
          { kind: "equal", task: "t1", name: "faktor", value: 4, tol: 1e-9, label: "`faktor` seharusnya 4", msg: "Hubungan kuadratik: MDE separuh → n 4× lipat." },
          { kind: "equal", task: "t2", name: "hari", value: 15.0, tol: 1e-9, label: "`hari` seharusnya 15.0", msg: "30.000/2.000 = 15 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "faktor=4(\\.0)?\\s+hari=15(\\.0)?", label: "`print` menampilkan keduanya", msg: "Format: faktor=...  hari=... ." },
        ],
      },
      reference: "Ambisi presisi 2× lipat harganya 4× sampel.",
    },
    {
      id: "jebakan-power",
      eyebrow: "Langkah 5 · Tiga jebakan",
      title: "Post-hoc power, peeking, dan winner's curse",
      prose: [
        "1. Post-hoc power: menghitung power dari efek teramati setelah eksperimen tidak signifikan — sirkular dan tidak informatif. Observed power adalah fungsi monoton dari p-value (p besar ⟺ observed power kecil — selalu!). Yang benar: laporkan CI efeknya — CI lebar sudah menceritakan belum konklusif dengan jujur.",
        "2. Peeking: mengecek hasil tiap hari dan berhenti saat p < 0,05. Setiap intipan adalah kesempatan false positive — α efektif jauh di atas 5%. Solusi: tentukan n di awal dan patuhi, atau pakai alpha-spending (O'Brien-Fleming) yang direncanakan. 3. Underpower yang tidak disengaja: studi pendahuluan underpowered yang menarik (p < 0,05) melebih-lebihkan efek secara sistematis — winner's curse. Pilot untuk estimasi variansi, bukan untuk keputusan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Berhenti saat menang adalah seleksi bias — seperti berhenti melempar koin saat sedang unggul lalu mengklaim koinnya bias. Dalam A/B testing produk, peeking menghasilkan ship keputusan atas false positive yang mahal.",
      },
      reference: "Peta perencanaan: hitung n SEBELUM eksperimen; n terbatas → hitung MDE yang terjangkau; n mentok → turunkan variansi (paired/CUPED); jangan intip; laporkan CI.",
    },
    {
      id: "minicase-abtest",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Berapa lama A/B test harus jalan?",
      prose: [
        "Fintech DanaKita mendesain ulang alur pengajuan kredit. Baseline konversi pengajuan→cair = 12%. Trafik: 4.000 pengunjung/hari (dibagi 2 varian). Tim produk: jalankan 7 hari, lihat hasilnya. Analisis biaya: redesign menelan Rp800 juta; break-even butuh kenaikan ≥ 1,5 poin (MDE = 1,5 pp).",
        "(a) n per varian = 2×0,12×0,88×(2,8)²/0,015² ≈ 7.359 → total ~14.700. (b) 7.359/2.000 ≈ 3,7 hari → dibulatkan ke 7 hari penuh (mencakup siklus mingguan). 1 minggu sebenarnya cukup secara n. Tapi (c) 7 hari benar secara kebetulan, bukan secara metode. Respons tepat: 7 hari cukup untuk MDE 1,5 pp — saya sudah hitung. Tapi jangan intip di hari ke-3; jalankan kelipatan minggu penuh; jika tidak signifikan, itu berarti efek < 1,5 pp — di bawah break-even — keputusannya tetap jelas: jangan ship.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_varian` untuk MDE 1,5 pp (baseline 12%)" },
        { id: "t2", text: "Hitung `hari` = n_varian / 2.000 (1 desimal)" },
      ],
      expected: "n_varian=7359  hari=3.7",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Eksperimen yang direncanakan dengan benar memberi keputusan yang jelas bahkan saat gagal: tidak signifikan berarti efek di bawah break-even — jangan ship. Tanpa perencanaan, tidak signifikan berarti tidak tahu apa-apa.",
      },
      hints: [
        "n = 2×p(1−p)×(1,96+0,84)²/δ².",
        "p = 0,12; δ = 0,015.",
        "hari = round(n_varian/2000, 1)",
      ],
      code: {
        starter: `p, d = 0.12, 0.015  # baseline dan MDE\n\n# TULIS KODEMU\nn_varian = \nhari = \n\nprint(f"n_varian={n_varian}  hari={hari}")`,
        lockLines: 1,
        solution: `p, d = 0.12, 0.015  # baseline dan MDE\n\n# TULIS KODEMU\nn_varian = round(2*p*(1-p)*(1.96+0.84)**2/d**2)\nhari = round(n_varian/2000, 1)\n\nprint(f"n_varian={n_varian}  hari={hari}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_varian", value: 7359, tol: 5, label: "`n_varian` sekitar 7359", msg: "2×0,12×0,88×7,84/0,000225 ≈ 7.359." },
          { kind: "equal", task: "t2", name: "hari", value: 3.7, tol: 0.05, label: "`hari` seharusnya 3.7", msg: "7.359/2.000 ≈ 3,7 hari → bulatkan ke 1 minggu penuh." },
          { kind: "stdout_matches", task: "t2", pattern: "n_varian=7359\\s+hari=3\\.7", label: "`print` menampilkan keduanya", msg: "Format: n_varian=...  hari=... ." },
        ],
      },
      reference: "Jalankan kelipatan minggu penuh (efek day-of-week).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Power = 1−β: peluang mendeteksi efek nyata — selalu sebutkan untuk δ berapa.",
        "4 tuas: δ↑, n↑, α↑, σ↓ → power↑. n satu-satunya yang sepenuhnya kamu kendalikan.",
        "Rumus n = 2σ²(z₁₋α/₂+z₁₋β)²/δ²; aturan 16 untuk estimasi cepat.",
        "MDE dari bisnis (break-even), bukan optimisme; n ∝ 1/MDE².",
        "Jebakan: observed power sirkular, peeking menggelembungkan α, pilot underpowered → winner's curse.",
      ],
      next: { label: "A2.11 — A/B Testing", href: "/v2/learn/a211-ab-testing" },
      quiz: [
        {
          q: "Dengan rumus n ∝ 1/δ²: MDE diperkecil dari 2 pp menjadi 1 pp. Apa yang terjadi pada n?",
          options: [
            { text: "Tetap", why: "n bergantung kuadratik pada MDE — tidak mungkin tetap." },
            { text: "Naik 2×", why: "Itu hubungan linear; yang benar kuadratik." },
            { text: "Naik 4×", why: "MDE separuh → n 4× lipat. Ambisi presisi 2× harganya 4× sampel.", correct: true },
            { text: "Turun 2×", why: "Terbalik: MDE lebih kecil butuh n lebih besar." },
          ],
        },
        {
          q: "n mentok di 100/grup tapi butuh power 80% untuk d=0,3 (butuh ~175/grup). Opsi paling cerdas?",
          options: [
            { text: "Jalankan saja dengan 100 — semoga beruntung", why: "Berharap bukan strategi — studi underpowered menipu." },
            { text: "Turunkan variansi: desain berpasangan / tambah kovariat (ANCOVA/CUPED)", why: "n ∝ σ²: σ lebih kecil = n efektif lebih besar. CUPED sering memangkas kebutuhan 30–50%.", correct: true },
            { text: "Naikkan α jadi 20%", why: "False positive 20% tidak bisa diterima untuk keputusan bisnis." },
            { text: "Laporkan p-value apa adanya nanti", why: "Tanpa power yang cukup, p-value tidak informatif." },
          ],
        },
        {
          q: "Mengapa observed power (dihitung dari efek teramati) tidak informatif?",
          options: [
            { text: "Karena rumusnya rumit", why: "Bukan soal kerumitan — soal sirkularitas." },
            { text: "Karena ia fungsi monoton dari p-value — tidak ada info baru; laporkan CI efeknya", why: "p besar ⟺ observed power kecil, selalu. CI memberi info yang sebenarnya dibutuhkan.", correct: true },
            { text: "Karena butuh n besar", why: "Tidak ada syarat n khusus — masalahnya konseptual." },
            { text: "Karena hanya untuk proporsi", why: "Berlaku umum — dan sama tidak informatifnya." },
          ],
        },
        {
          q: "Tim mengecek dashboard A/B test tiap hari dan berhenti saat p<0,05 (hari ke-4 dari rencana 14 hari). Masalahnya?",
          options: [
            { text: "Tidak ada — efisien", why: "Efisien tapi bias: tiap intipan adalah kesempatan false positive." },
            { text: "Peeking: α efektif jauh di atas 5%; komitmen pada n awal atau pakai desain sekuensial formal", why: "Berhenti saat menang = seleksi bias.", correct: true },
            { text: "Harusnya berhenti di hari ke-3", why: "Hari berapa pun, berhenti saat menang tetap bias." },
            { text: "p-value hari ke-4 tidak valid karena n kecil", why: "n bukan masalahnya — aturannya yang dilanggar." },
          ],
        },
        {
          q: "Power studi ini 80%. Apa yang kurang dari kalimat itu?",
          options: [
            { text: "Tidak kurang apa-apa", why: "Kurang: untuk efek sebesar apa." },
            { text: "Untuk efek sebesar APA — power selalu bersyarat pada δ tertentu", why: "80% untuk d=0,8 bisa berarti 25% untuk d=0,3. Power tanpa δ = kecepatan tanpa arah.", correct: true },
            { text: "Harusnya 90%", why: "80% adalah sweet spot konvensi — bukan hukum." },
            { text: "α-nya tidak disebut", why: "α penting, tapi δ yang paling sering hilang." },
          ],
        },
      ],
      note: {
        title: "Intuisi: power adalah asuransi yang dibeli sebelum bencana",
        body: "Enam heuristik. Satu: n berbanding terbalik dengan kuadrat MDE — presisi dua kali lipat berharga empat kali lipat sampel; negosiasi MDE pada dasarnya negosiasi budget, jadi negosiasikan dengan angka, bukan perasaan. Dua: power dihitung sebelum studi — power yang dihitung dari efek teramati setelah hasil keluar adalah sirkular dan tidak informatif; ia hanya p-value yang menyamar. Tiga: studi underpowered yang “berhasil” signifikan patut dicurigai — winner's curse membuat efek teramati melebih-lebihkan efek sebenarnya; replikasi, bukan perayaan. Empat: peeking adalah mencuri alpha dari masa depan — setiap intipan interim adalah kesempatan false positive tambahan; tentukan n di awal dan patuhi, atau pakai alpha-spending yang jujur. Lima: power 80 persen berarti satu dari lima studi yang benar akan gagal — rencanakan portofolio bukti, bukan keajaiban tunggal; dan selalu sebutkan power untuk delta berapa, karena power tanpa delta adalah angka yatim. Enam: jangan lupakan durasi kalender — n yang cukup secara statistik tetapi hanya mencakup tiga hari kerja mengabaikan efek day-of-week; bulatkan durasi ke minggu penuh.",
      },
    },
  ],
};
