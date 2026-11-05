import type { V2Lesson } from "../lib/types";

export const cr4a: V2Lesson = {
  slug: "cr4a-basel-rwa-kpmm",
  track: "Credit Risk",
  module: "Kinerja & Analisis Portofolio",
  title: "CR4A — Basel: Dari Aset Menjadi Modal",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua bank, aset sama, nasib beda",
      prose: [
        "Tahun 2008, dua bank fiktif — Bank Mawar dan Bank Melati — sama-sama punya aset Rp 100 triliun. Di atas kertas, kembar identik. Tapi isinya beda. Mawar: 70% asetnya obligasi pemerintah dan KPR prima. Melati: 70% asetnya kredit korporasi spekulatif dan pembiayaan tanpa agunan. Saat krisis datang, Melati kolaps — kerugiannya 5× lipat Mawar. Aset boleh sama, tapi risikonya tidak sama.",
        "Regulator global belajar dari kejadian seperti ini (berulang kali, sejak 1988): modal minimum tidak boleh dihitung dari total aset mentah, melainkan dari aset yang dibobot risikonya — RWA. Dan standar globalnya bernama Basel.",
        "Basel bukan sekadar aturan kepatuhan — ia adalah harga modal untuk setiap keputusan kredit. Analis yang paham Basel bisa menjawab pertanyaan direksi: \"kalau kita ekspansi Rp 1 T ke segmen X, berapa modal yang terkunci?\"",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hafalkan rantai ini: keputusan kredit → RWA → KPMM → kapasitas tumbuh. Setiap memo kredit yang kamu tulis diam-diam menggerakkan KPMM bank. Analis yang bisa menghitung \"berapa poin KPMM yang dimakan usulan ini\" bicara bahasa direksi.",
      },
      reference: "Basel = konstitusi permodalan bank global; Indonesia mengadopsi via OJK (POJK).",
    },
    {
      id: "basel",
      eyebrow: "Langkah 2 · Basel",
      title: "Tiga pilar Basel",
      prose: [
        "Basel = kerangka regulasi permodalan bank yang disusun Basel Committee on Banking Supervision (bermarkas di Basel, Swiss). Tiga pilarnya. Pilar 1 — modal minimum: rumus hitung kebutuhan modal untuk risiko kredit, pasar, dan operasional. Pilar 2 — supervisory review: OJK menilai profil risiko tiap bank (ICAAP) dan bisa meminta modal tambahan. Pilar 3 — disiplin pasar: bank wajib mempublikasikan eksposur risikonya, pasar ikut mengawasi.",
        "Sejarahnya berpola: Basel I lahir setelah krisis utang Amerika Latin, Basel II menyempurnakan bobot risiko, Basel III lahir dari krisis 2008 (modal lebih tebal + buffer + likuiditas). Regulasi selalu mengejar krisis terakhir. Analis yang paham sejarah ini tidak kaget saat aturan berubah.",
      ],
      tasks: [],
      reference: "Pilar 1: hitung · Pilar 2: awasi · Pilar 3: publikasikan.",
    },
    {
      id: "rwa",
      eyebrow: "Langkah 3 · RWA",
      title: "Kenapa Rp 1 M tidak selalu Rp 1 M",
      prose: [
        "RWA (Risk-Weighted Assets) = nilai aset dikalikan bobot risiko. Aset berisiko rendah (kas, SBN) bobotnya 0% — tidak \"memakan\" modal. Aset berisiko tinggi bobotnya 100%+. Untuk tiap kelompok aset: kalikan nilai bukunya dengan bobot risiko yang ditetapkan regulator (SA) atau model internal (IRB), lalu jumlahkan semua.",
        "Contoh: bank punya Kas Rp 100 M (0%), SBN Rp 200 M (0%), KPR Rp 300 M (35%), Korporasi Rp 400 M (100%). Hitung per kelompok: 100×0% = 0; 200×0% = 0; 300×35% = 105; 400×100% = 400. RWA = Rp 505 M. Bandingkan dengan total aset Rp 1.000 M — separuh aset \"tidak memakan modal\" (kas+SBN). Inilah mengapa bank gemar menumpuk SBN: imbal hasil tanpa beban modal.",
        "RWA adalah kurs tukar antara aset dan modal. Rp 1 M KPR \"ditukar\" jadi Rp 350 jt RWA; Rp 1 M korporasi jadi Rp 1 M RWA. Setiap analis kredit yang mengusulkan ekspansi segmen sebenarnya sedang mengusulkan pembelian RWA — dan RWA dibayar dengan modal yang mahal.",
      ],
      formula: String.raw`\text{RWA} = \sum (\text{Nilai Aset}_i \times \text{Bobot Risiko}_i)`,
      formulaNote: "Nilai Aset_i = nilai buku kelompok aset ke-i. Bobot Risiko_i = persentase regulator (kas/SBN 0%, KPR 35%, korporasi tanpa rating 100%). Σ = jumlahkan semua kelompok. Contoh: 100×0% + 200×0% + 300×35% + 400×100% = Rp 505 M RWA dari Rp 1.000 M aset — separuh aset \"bebas pajak modal\".",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kas & SBN (0%) = bebas pajak modal; KPR (35%) = pajak ringan; korporasi tanpa rating (100%) = pajak penuh. Dua bank dengan aset Rp 1 T bisa punya kebutuhan modal beda 2× lipat tergantung komposisinya — inilah \"harga\" strategi bisnis dalam bahasa regulator.",
      },
      reference: "Bobot SA tipikal: kas/SBN 0% · KPR 35% · UKM/kartu 75% · korporasi tanpa rating 100%.",
    },
    {
      id: "lab-rwa",
      eyebrow: "Langkah 4 · Lab RWA",
      title: "Kalkulator RWA & KPMM",
      prose: [
        "Jadilah \"bendahara modal\" bank. Aset: Kas Rp 100 M, SBN Rp 200 M, KPR Rp 300 M (bobot 35%), Korporasi Rp 400 M (bobot 100%). Modal Rp 80 M. Tugasmu: hitung RWA dan KPMM, lalu tentukan statusnya (AMAN jika ≥10%, WASPADA jika ≥8%, selain itu KRITIS).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rwa` dari keempat kelompok aset" },
        { id: "t2", text: "Hitung `kpmm` (%) dan `status` sesuai ambang" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "rwa=505 kpmm=15.8 status=AMAN",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjumlahkan total aset (Rp 1.000 M) lalu menganggap itulah penyebut KPMM. Penyebutnya RWA (Rp 505 M), bukan total aset. Salah penyebut = KPMM terlihat 8% padahal 15,8%.",
      },
      hints: [
        "RWA = jumlah (nilai × bobot) tiap kelompok.",
        "KPMM = modal / rwa × 100.",
        "status = \"AMAN\" if kpmm >= 10 else (\"WASPADA\" if kpmm >= 8 else \"KRITIS\")",
      ],
      code: {
        starter: `kas, sbn, kpr, korp = 100, 200, 300, 400  # miliar Rp\nb_kpr, b_korp = 0.35, 1.00\nmodal = 80  # miliar Rp\n\n# TULIS KODEMU\nrwa = \nkpmm = \nstatus = \n\nprint(f"rwa={rwa:.0f} kpmm={kpmm:.1f} status={status}")`,
        lockLines: 3,
        solution: `kas, sbn, kpr, korp = 100, 200, 300, 400  # miliar Rp\nb_kpr, b_korp = 0.35, 1.00\nmodal = 80  # miliar Rp\n\n# TULIS KODEMU\nrwa = kas*0 + sbn*0 + kpr*b_kpr + korp*b_korp\nkpmm = modal / rwa * 100\nstatus = "AMAN" if kpmm >= 10 else ("WASPADA" if kpmm >= 8 else "KRITIS")\n\nprint(f"rwa={rwa:.0f} kpmm={kpmm:.1f} status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rwa", value: 505, tol: 1e-9, label: "`rwa` seharusnya 505", msg: "0 + 0 + 105 + 400 = 505. Kas dan SBN bobotnya 0." },
          { kind: "equal", task: "t2", name: "kpmm", value: 15.84, tol: 0.05, label: "`kpmm` sekitar 15.8", msg: "80 / 505 × 100 ≈ 15.8." },
          { kind: "equal", task: "t2", name: "status", value: "AMAN", label: "`status` seharusnya AMAN", msg: "15.8 ≥ 10 → AMAN." },
          { kind: "stdout_matches", task: "t3", pattern: "rwa=505\\s+kpmm=15\\.8\\s+status=AMAN", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: pindahkan 100M dari SBN ke Korporasi. Aset tetap 1000M, tetapi RWA naik dan KPMM turun.",
    },
    {
      id: "sa-irb",
      eyebrow: "Langkah 5 · SA vs IRB",
      title: "Seragam vs jahitan sendiri",
      prose: [
        "Ada dua cara menentukan bobot risiko. SA (Standardised Approach) — \"seragam\": bobot ditentukan regulator berdasarkan kategori dan rating eksternal. Sederhana, transparan, dipakai mayoritas bank Indonesia. IRB (Internal Ratings-Based) — \"jahitan sendiri\": bank memakai model internal PD/LGD/EAD (yang kamu pelajari di CR3!) untuk menghitung bobot via rumus regulator. Hasilnya bisa lebih hemat modal jika portofolio memang bagus — tetapi syaratnya berat: data historis panjang, validasi ketat, persetujuan OJK.",
        "SA seperti membeli baju ukuran S/M/L — cepat tetapi tidak pas badan. IRB seperti jas tailor — pas dan bisa lebih hemat bahan, tetapi butuh penjahit ahli (tim modeling), mahal, dan harus lolos \"uji jahitan\" (validasi + approval OJK) tiap tahun.",
        "Basel III final memperkenalkan output floor 72,5%: RWA model internal tidak boleh lebih rendah dari 72,5% RWA Standardised — penghematan modal via model dibatasi, untuk mencegah penghematan agresif.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"IRB selalu lebih baik karena modern.\" IRB hanya menguntungkan jika modelmu benar-benar bagus. Model jelek → bobot IRB bisa lebih tinggi dari SA + biaya validasi + risiko teguran OJK. Banyak bank menengah Indonesia rasional bertahan di SA — keputusan bisnis yang valid, bukan ketertinggalan.",
      },
      reference: "IRB rasional jika: data historis panjang, model tervalidasi, portofolio berkualitas, lolos approval OJK.",
    },
    {
      id: "lab-irb",
      eyebrow: "Langkah 6 · Lab IRB",
      title: "SA vs IRB — siapa lebih hemat modal?",
      prose: [
        "Bank punya portofolio KPR Rp 500 M. SA: bobot 35%. IRB (ilustrasi): model internal bilang portofolio ini bagus — bobot efektif 15%. Tugasmu: hitung RWA dan modal minimum (8% dari RWA) untuk keduanya, lalu hitung penghematan modal IRB.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rwa_sa` dan `modal_sa` (8% dari RWA)" },
        { id: "t2", text: "Hitung `rwa_irb`, `modal_irb`, dan `hemat` = modal_sa − modal_irb" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "sa_rwa=175 sa_modal=14.0 / irb_rwa=75 irb_modal=6.0 hemat=8.0",
      hints: [
        "RWA = portofolio × bobot; modal = RWA × 0.08.",
        "Hemat = selisih modal SA dan IRB.",
        "rwa_sa = portofolio * 0.35; modal_sa = rwa_sa * 0.08",
      ],
      code: {
        starter: `portofolio = 500  # miliar Rp, KPR\nbobot_sa = 0.35\nbobot_irb = 0.15  # model internal: portofolio berkualitas\n\n# TULIS KODEMU\nrwa_sa = \nmodal_sa = \nrwa_irb = \nmodal_irb = \nhemat = \n\nprint(f"sa_rwa={rwa_sa:.0f} sa_modal={modal_sa:.1f}")\nprint(f"irb_rwa={rwa_irb:.0f} irb_modal={modal_irb:.1f} hemat={hemat:.1f}")`,
        lockLines: 3,
        solution: `portofolio = 500  # miliar Rp, KPR\nbobot_sa = 0.35\nbobot_irb = 0.15  # model internal: portofolio berkualitas\n\n# TULIS KODEMU\nrwa_sa = portofolio * bobot_sa\nmodal_sa = rwa_sa * 0.08\nrwa_irb = portofolio * bobot_irb\nmodal_irb = rwa_irb * 0.08\nhemat = modal_sa - modal_irb\n\nprint(f"sa_rwa={rwa_sa:.0f} sa_modal={modal_sa:.1f}")\nprint(f"irb_rwa={rwa_irb:.0f} irb_modal={modal_irb:.1f} hemat={hemat:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "modal_sa", value: 14.0, tol: 1e-9, label: "`modal_sa` seharusnya 14.0", msg: "500 × 0.35 = 175 RWA; 175 × 8% = 14." },
          { kind: "equal", task: "t2", name: "modal_irb", value: 6.0, tol: 1e-9, label: "`modal_irb` seharusnya 6.0", msg: "500 × 0.15 = 75 RWA; 75 × 8% = 6." },
          { kind: "equal", task: "t2", name: "hemat", value: 8.0, tol: 1e-9, label: "`hemat` seharusnya 8.0", msg: "14 − 6 = 8." },
          { kind: "stdout_matches", task: "t3", pattern: "hemat=8\\.0", label: "`print` menampilkan penghematan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: ubah bobot IRB jadi 0.45 (model bilang portofolio jelek) — IRB jadi LEBIH MAHAL dari SA.",
    },
    {
      id: "kpmm",
      eyebrow: "Langkah 7 · KPMM",
      title: "Speedometer kesehatan bank",
      prose: [
        "KPMM (Kewajiban Penyediaan Modal Minimum) = modal dibagi RWA — versi Indonesia dari CAR. Pembilang = modal bank (Tier 1: saham + laba ditahan; Tier 2: instrumen pelengkap); penyebut = RWA. Batas minimum OJK: 8% (plus buffer untuk bank besar/sistemik — efektif bisa 10–14%).",
        "Contoh: RWA Rp 505 M, modal Rp 80 M. KPMM = 80/505 × 100% = 15,8% — buffer 7,8 poin di atas batas 8%, bank sangat sehat. Tiap Rp 100 M RWA baru \"memakan\" Rp 8 M modal minimum.",
        "Saat krisis, KPMM tertekan dari dua sisi: RWA naik (migrasi rating/debitur memburuk) BERSAMAAN dengan modal tergerus rugi — jepitan dua sisi. Inilah alasan Basel III mewajibkan capital buffer di atas minimum 8%. Kasus Bank Century (2008): CAR anjlok di bawah minimum hingga negara menggelontorkan Rp 6,7 T. Modal adalah pertahanan terakhir sebelum uang publik dipertaruhkan — itulah mengapa OJK galak soal KPMM.",
      ],
      formula: String.raw`\text{KPMM} = \frac{\text{Modal (Tier 1 + Tier 2)}}{\text{RWA}} \times 100\% \quad \text{(batas OJK: 8\% + buffer)}`,
      formulaNote: "Modal = Tier 1 (saham + laba ditahan) + Tier 2 (instrumen pelengkap). RWA = penyebut (bukan total aset!). ×100% = dalam persen. Contoh: 80/505 × 100% = 15,8% — 7,8 poin di atas batas OJK 8%. Tiap Rp 100 M RWA baru \"memakan\" Rp 8 M modal minimum.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"KPMM tinggi selalu berarti bank hebat.\" KPMM 25% bisa berarti bank terlalu takut menyalurkan kredit (modal menganggur = ROE rendah). KPMM optimal = cukup di atas batas + buffer untuk tumbuh. Bank adalah bisnis menyalurkan risiko dengan harga tepat, bukan menghindarinya.",
      },
      reference: "Bank A 22,5% = ruang ekspansi besar · Bank C 8,5% = zona merah, dividen dibatasi, OJK mengawasi ketat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Ekspansi korporasi vs KPR",
      prose: [
        "Bank Nusantara (KPMM 13%, RWA Rp 40 T, modal Rp 5,2 T) punya dana Rp 2 T untuk ekspansi. Opsi KPR: Rp 2 T KPR LTV di bawah 80% (bobot 35%) → RWA +Rp 700 M, margin bunga bersih 3%. Opsi Korporasi: Rp 2 T kredit korporasi tanpa rating (bobot 100%) → RWA +Rp 2 T, margin bunga bersih 4%.",
        "Pembahasan. (a) KPR: KPMM = 5,2/40,7 = 12,78% (turun 0,22 poin). Korporasi: KPMM = 5,2/42 = 12,38% (turun 0,62 poin — hampir 3× lipat!). (b) Laba KPR = 2 T × 3% = Rp 60 M dengan \"biaya modal\" 700 M × 8% = Rp 56 M. Korporasi = 2 T × 4% = Rp 80 M dengan biaya modal 2 T × 8% = Rp 160 M. KPR jauh lebih efisien dari sisi konsumsi modal — inilah logika RAROC (CR21).",
        "(c) Rekomendasi: KPR — dengan catatan pastikan LTV benar-benar di bawah 80% (verifikasi appraisal!) dan sebar geografis (risiko konsentrasi, CR15). Margin korporasi yang terlihat lebih tinggi ternyata \"palsu\" setelah dihitung harga modalnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rantai modal — lima pertanyaan direksi untuk tiap usulan ekspansi: (1) berapa RWA-nya? (2) berapa poin KPMM yang dimakan? (3) masih di atas appetite? (4) berapa RAROC-nya — di atas hurdle? (5) bagaimana saat stres?",
      },
      reference: "Setiap kredit = pembelian RWA. Tanya bobotnya sebelum tanda tangan.",
    },
    {
      id: "output-floor",
      eyebrow: "Langkah 9 · Output floor",
      title: "Rem untuk model internal",
      prose: [
        "Model internal (IRB) memberi bank kebebasan mengestimasi risiko sendiri — dan kebebasan selalu mengundang optimisme. Basel III memasang rem: output floor 72,5%. RWA IRB tidak boleh lebih rendah dari 72,5% RWA pendekatan standar (SA). Tujuannya ganda: membatasi arbitrage model (input yang \"dioptimasi\" agar modal kecil) dan membuat KPMM antar bank bisa dibandingkan.",
        "Contoh dengan angka: RWA IRB Rp 300 M, RWA SA Rp 500 M. Floor = 72,5% × 500 = Rp 362,5 M. RWA efektif = Rp 362,5 M — bukan Rp 300 M. Bank yang berinvestasi mahal membangun model IRB \"menghemat\" modal ternyata tetap membayar 362,5 M. Cara salah: melaporkan RWA IRB sebagai angka final tanpa memeriksa floor. Cara benar: hitung selalu keduanya, laporkan yang mengikat (binding).",
        "Aturan keputusan. Satu: setiap pelaporan modal IRB wajib mencantumkan RWA SA pembanding dan posisi terhadap floor — tidak ada pengecualian. Dua: jika IRB-mu persis menempel di floor, pertanyakan nilai investasinya — kamu membayar biaya model untuk hasil yang ditentukan standar. Tiga: waspadai insentif perverse — floor yang mengikat membuat perbaikan model tidak lagi menurunkan modal, sehingga godaan \"optimasi input\" justru naik; governance model harus diperketat, bukan dilonggarkan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: modal adalah sabuk pengaman, bukan mesin",
        body: "Modal tidak menghasilkan uang — ia membuatmu selamat cukup lama untuk menghasilkan uang. Bank yang mengoptimasi KPMM mepet ke batas 8% seperti sopir yang melepas sabuk pengaman agar mobil lebih ringan: sedikit lebih cepat, jauh lebih mati saat menabrak. Heuristik yang jarang disadari: modal termurah adalah modal yang tidak pernah dibutuhkan — dan cara termurah mendapatkannya bukan menerbitkan saham (mahal, dilutif), melainkan mengelola RWA (komposisi aset). Menggeser Rp 100 M dari korporasi tanpa rating (100%) ke KPR (35%) menghemat Rp 5,2 M kebutuhan modal tanpa menambah satu rupiah modal. Maka setiap usulan ekspansi seharusnya dibaca sebagai pembelian RWA: berapa bobotnya, berapa poin KPMM yang dimakan, berapa RAROC-nya. Analis yang hanya bertanya \"berapa labanya?\" sedang menilai mobil dari kecepatannya tanpa memeriksa remnya. Kebiasaan sehatnya: setiap laporan KPMM disertai dua baris — \"berapa modal kami\" dan \"berapa RWA kami dan dari mana asalnya\". Baris kedua lebih penting; ia menunjukkan apakah bank tumbuh dengan menambah aset ringan (KPR, SBN) atau aset berat (korporasi tanpa rating). Dua bank dengan KPMM sama bisa memiliki masa depan yang sangat berbeda — bedanya tertulis di komposisi RWA.",
      },
      reference: "Kelola RWA dulu, terbitkan modal kemudian. Setiap kredit = pembelian RWA.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Basel: 3 pilar (modal minimum, supervisory review, disiplin pasar). Regulasi mengejar krisis terakhir.",
        "RWA = Σ(nilai × bobot). Penyebut KPMM adalah RWA, bukan total aset.",
        "SA = seragam regulator; IRB = model internal PD/LGD/EAD, hemat jika portofolio bagus tetapi mahal dan diawasi.",
        "KPMM = modal/RWA; batas OJK 8% + buffer. Krisis = jepitan dua sisi (RWA naik, modal tergerus).",
        "Margin tinggi tidak otomatis lebih baik — ukur per unit modal (RAROC).",
      ],
      next: { label: "CR4B — IFRS 9 / PSAK 71", href: "/learn/cr4b-ifrs9-psak71" },
      quiz: [
        {
          q: "Bank punya: Kas Rp 100 M (0%), SBN Rp 200 M (0%), KPR Rp 300 M (35%), Korporasi Rp 400 M (100%). Berapa RWA?",
          options: [
            { text: "Rp 1.000 M", why: "Itu total aset mentah — RWA memakai bobot risiko." },
            { text: "Rp 505 M", why: "0 + 0 + 105 + 400 = Rp 505 M. Kas dan SBN tidak memakan modal sama sekali.", correct: true },
            { text: "Rp 700 M", why: "Itu KPR + Korporasi tanpa bobot — bobotnya belum dikalikan." },
            { text: "Rp 400 M", why: "Hanya korporasi yang dihitung — KPR berbobot 35% ikut dihitung." },
          ],
        },
        {
          q: "Bank dengan RWA Rp 505 M dan modal Rp 80 M. KPMM dan statusnya (batas 8%)?",
          options: [
            { text: "15,8% — sehat, buffer lega", why: "80/505 = 15,8% — jauh di atas 8%. Bank punya ruang ekspansi besar.", correct: true },
            { text: "6,3% — di bawah batas, kritis", why: "Terbalik: 505/80 bukan rumusnya." },
            { text: "8,0% — pas di batas", why: "Tidak pas — hitung lagi: 80/505." },
            { text: "80% — salah hitung", why: "Memang salah: lupa membagi dengan RWA." },
          ],
        },
        {
          q: "Kapan IRB menjadi pilihan yang RASIONAL bagi bank?",
          options: [
            { text: "Selalu — IRB lebih modern", why: "Modern tidak otomatis murah — validasi dan approval OJK mahal." },
            { text: "Tidak pernah — SA selalu lebih murah", why: "Untuk portofolio jumbo berkualitas, penghematan modal IRB bisa puluhan triliun." },
            { text: "Jika bank punya data historis panjang, model tervalidasi, portofolio berkualitas, dan lolos approval OJK", why: "IRB = investasi. Baru kembali jika bobot IRB < SA secara konsisten DAN bank sanggup biaya validasi.", correct: true },
            { text: "Jika bank ingin menghindari validasi", why: "IRB justru diawasi dan divalidasi lebih ketat." },
          ],
        },
        {
          q: "Ekspansi Rp 2 T: KPR (bobot 35%, margin 3%) vs Korporasi tanpa rating (bobot 100%, margin 4%). Mana lebih efisien dari sisi modal?",
          options: [
            { text: "Korporasi — margin 4% > 3%", why: "Margin tanpa harga modal menipu — lihat konsumsi RWA-nya." },
            { text: "KPR — konsumsi RWA 2,8× lebih kecil; 'harga modal' korporasi melahap keunggulannya", why: "Biaya modal korporasi Rp 160 M vs KPR Rp 56 M. Inilah inti RAROC: return per unit modal.", correct: true },
            { text: "Sama saja — asetnya sama Rp 2 T", why: "Aset sama tetapi RWA beda 2,8× lipat." },
            { text: "Tidak bisa dibandingkan tanpa data PD", why: "Bobot SA sudah cukup untuk perbandingan modal." },
          ],
        },
        {
          q: "Basel III final memperkenalkan output floor 72,5%. Artinya bagi bank yang ingin memakai IRB?",
          options: [
            { text: "RWA model internal tidak boleh lebih rendah dari 72,5% RWA Standardised — penghematan modal via model dibatasi", why: "Tujuannya mencegah penghematan modal agresif via model.", correct: true },
            { text: "Modal minimum turun menjadi 72,5% dari sebelumnya", why: "Bukan soal modal minimum — ini batas bawah RWA model." },
            { text: "Bank wajib punya 72,5% aset dalam bentuk kas", why: "Tidak ada aturan seperti itu." },
            { text: "Tidak ada dampak — hanya untuk bank Eropa", why: "Berlaku untuk bank IRB di yurisdiksi yang mengadopsi Basel III final." },
          ],
        },
      ],
    },
  ],
};
