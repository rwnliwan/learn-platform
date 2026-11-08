import type { V2Lesson } from "../lib/types";

export const mr33: V2Lesson = {
  slug: "mr33-economic-capital-raroc",
  track: "Market Risk",
  module: "Modal & Regulasi",
  title: "MR33 — Economic Capital dan RAROC: Modal Trading Book yang Jujur",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Desk yang paling menguntungkan — sampai modalnya dihitung",
      prose: [
        "Desk derivatif ekuitas Bank Nusantara melaporkan laba Rp600 miliar — tertinggi di bank. Direksi hendak memberi bonus besar dan menambah modalnya. Lalu tim risiko menghitung economic capital-nya: Rp1.423 miliar. RAROC-nya: (600 − 180 − 90) dibagi 1.423 = 23,19 persen — di atas hurdle 15 persen, tetapi jauh dari desk obligasi yang labanya 'hanya' Rp400 miliar dengan RAROC 31 persen. Desk yang paling menguntungkan ternyata bukan desk yang paling efisien memakai modal.",
        "Inilah fungsi economic capital (EC): mengukur berapa modal yang HARUS dipegang untuk menanggung kerugian tak terduga (unexpected loss) pada tingkat kepercayaan tertentu — biasanya 99,9 persen selama 1 tahun. Modal regulator (CR4a) adalah lantai hukum; EC adalah ukuran ekonomi yang sebenarnya. Bank yang mengalokasikan modal berdasarkan laba — bukan berdasarkan EC — sedang memberi makan desk yang rakus modal dan membuat kelaparan desk yang efisien.",
        "Lesson ini membangun topik yang mendapat NOL hit di seluruh track Market Risk: 'economic capital' dan 'RAROC' tidak pernah muncul di file mr mana pun. Sisi kredit sudah punya CR21 (RAROC pricing) dan CR15 (UL lewat simulasi) — tetapi trading book tidak punya padanannya. Setelah lesson ini kamu bisa: (1) menghitung EC dari VaR/ES dengan scaling waktu dan pengali; (2) menghitung RAROC dan membandingkannya dengan hurdle rate; (3) menjelaskan beda EC, modal regulator, dan modal akuntansi; (4) mengalokasikan modal antar desk dengan RAROC; (5) menjelaskan keterbatasan RAROC.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "CR21 mengajarkan RAROC untuk pricing kredit (pendapatan dikurangi biaya dikurangi EL, dibagi modal ekonomis, hurdle 18 persen, lab 4 segmen) dan CR15 menghitung UL portofolio kredit lewat simulasi Monte Carlo. Keduanya dari sisi kredit. Di track Market Risk, grep menyeluruh tidak menemukan satu pun penyebutan economic capital atau RAROC. Lesson ini membangun padanan trading-book-nya: EC dari VaR/ES, scaling 10 hari, pengali regulator, dan alokasi modal antar desk.",
      },
      reference: "VaR 1 hari 99 persen Rp150 miliar → EC Rp1.423 miliar (ES 10 hari dikali pengali 3). RAROC 23,19 persen vs hurdle 15 persen — TERIMA.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjawab pertanyaan direksi yang sebenarnya: bukan 'berapa labanya', melainkan 'berapa laba per rupiah modal yang dikunci'.",
        "(1) Menghitung economic capital dari VaR/ES dengan scaling waktu dan pengali;",
        "(2) Menghitung RAROC dan membandingkannya dengan hurdle rate;",
        "(3) Menjelaskan beda economic capital, modal regulator, dan modal akuntansi;",
        "(4) Mengalokasikan modal antar desk berdasarkan RAROC;",
        "(5) Menjelaskan keterbatasan RAROC — termasuk yang tidak ditangkapnya.",
      ],
      tasks: [],
    },
    {
      id: "ec",
      eyebrow: "Langkah 3 · Teori",
      title: "Economic capital: dari VaR harian ke modal tahunan",
      prose: [
        "Economic capital adalah kerugian tak terduga pada tingkat kepercayaan tinggi selama horizon panjang — biasanya VaR atau ES 99,9 persen selama 1 tahun. Trading book tidak mengukur langsung 1 tahun — ia mengukur VaR 1 hari 99 persen (MR3), lalu melakukan scaling. Lesson ini memakai rumus PENYEDERHANAAN PENGAJARAN yang dinyatakan eksplisit dan dipakai di lab: EC = VaR 1 hari × akar 10 × pengali 3. Akar 10 adalah scaling waktu ke horizon 10 hari; pengali 3 berasal dari pengali VaR IMA lama (Basel 2.5). Perhatian: rumus ini BUKAN formula regulator Basel/FRTB — jangan mengutipnya sebagai 'rumus Basel'. Formula modal FRTB (internal models approach) yang sebenarnya memakai Expected Shortfall 97,5 persen dengan liquidity horizon per kelas aset (10–120 hari), bukan VaR 1 hari yang di-scaling: modal ≈ max(ES hari ini, m_c × rata-rata ES 60 hari) + Default Risk Charge + add-on risiko non-modellable, dengan pengali m_c minimal 1,5 (bukan 3). Pengali 3 adalah peninggalan rezim VaR lama — di FRTB ia tidak dipakai. Contoh pengajaran: VaR 1 hari Rp150 miliar → EC = 150 × 3,1623 × 3 = Rp1.423 miliar. Praktisi yang memakai ES (bukan VaR) sebagai dasar akan mendapat angka lebih besar — ES 1 hari sekitar 1,3 × VaR = Rp195 miliar, ES 10 hari Rp616,6 miliar, dikali pengali 3 = Rp1.850 miliar. Kedua konvensi sah sebagai ilustrasi; yang penting adalah menyatakan konvensimu dan memakainya konsisten — lab lesson ini memakai konvensi VaR agar transparan, dan SEMUA angka lab adalah angka pengajaran, bukan angka modal regulator.",
        "Peta confidence × horizon — ukuran mana untuk apa. VaR 99 persen 1 hari: monitoring harian dan backtesting (MR3, MR6). VaR 99 persen 10 hari × pengali 3 (maks dengan VaR kemarin): modal REZIM LAMA Basel 2.5 IMA — masih berguna sebagai referensi sejarah, bukan aturan berlaku. ES 97,5 persen dengan liquidity horizon: modal FRTB IMA yang berlaku — 97,5 persen ES kira-kira setara VaR 99 persen, tetapi ES menangkap ekor. VaR/ES 99,9 persen 1 tahun: ECONOMIC CAPITAL — kerugian tak terduga (UL) pada confidence sangat tinggi selama setahun. Dan hubungan EC–UL–EL: expected loss (EL) ditutup provisi dan harga; unexpected loss (UL) ditutup modal — EC pada dasarnya adalah UL pada 99,9 persen 1 tahun. Jangan membaca 'VaR 99 persen' sebagai EC: confidence dan horizon yang berbeda menghasilkan modal yang berbeda — membandingkan keduanya tanpa menyebut confidence dan horizon adalah membandingkan apel dengan jeruk.",
        "Tiga modal yang berbeda — jangan dicampur. Modal akuntansi (ekuitas di neraca): apa yang dimiliki bank menurut pembukuan. Modal regulator (KPMM, CR4a): minimum yang diwajibkan OJK/Basel — lantai hukum, dihitung dari ATMR dengan bobot standar. Economic capital: yang DIBUTUHKAN secara ekonomi menurut model internal bank sendiri. Tidak ada aturan umum bahwa EC 'biasanya lebih besar' dari modal regulator — untuk portofolio berisiko tinggi EC sering lebih besar, untuk portofolio aman EC sering LEBIH KECIL, karena modal regulator dihitung dari bobot standar yang konservatif sementara EC mengikuti model internal bank. Yang benar: keduanya mengukur hal yang berbeda dengan metode yang berbeda, dan bank yang sehat memegang modal AKTUAL di atas ketiganya — serta memakai EC untuk keputusan bisnis, bukan modal regulator.",
        "Kenapa pengali 3? Karena model salah. VaR dihitung dari data historis yang tidak mengandung krisis berikutnya, dari distribusi yang diasumsikan normal padahal berekor tebal (MR37), dan dari korelasi masa tenang yang naik saat stres (E37). Pengali adalah pengakuan resmi bahwa model tidak sempurna — bantalan untuk ketidakpastian model itu sendiri. Dalam rezim VaR IMA LAMA, bank dengan backtesting buruk (MR6) mendapat pengali LEBIH BESAR (sampai 4) — hukuman yang diterjemahkan ke modal. Di FRTB, mekanismenya berbeda: pengali ES minimal 1,5 dan naik lewat add-on, bukan lewat pengali 3–4. Jangan mencampuradukkan kedua rezim saat mengutip pengali.",
        "EC bukan angka mati — ia berubah tiap hari bersama posisi dan volatilitas. Desk yang menambah posisi besar di saham lapis 3 akan melihat EC-nya melonjak besok pagi — dan RAROC-nya jatuh. Inilah disiplinnya: EC membuat biaya modal VISIBLE bagi trader, setiap hari, bukan hanya saat rapat tahunan.",
      ],
      tasks: [],
      formula: String.raw`\text{EC} = \text{VaR}_{1d} \times \sqrt{10} \times m \qquad \text{RAROC} = \frac{\text{Pendapatan} - \text{Biaya} - \text{EL}}{\text{EC}}`,
      formulaNote: "EC = economic capital (RUMUS PENGAJARAN, bukan formula regulator Basel/FRTB); VaR 1d = 150; akar 10 = 3,1623 (scaling 10 hari); m = pengali 3 (peninggalan VaR IMA lama). EC = 1.423. RAROC = (600 − 180 − 90) / 1.423 = 23,19 persen. FRTB yang sebenarnya memakai ES 97,5 persen + liquidity horizon + pengali minimal 1,5 + DRC + NMRF.",
      reference: "EC Rp1.423 miliar (rumus pengajaran VaR×√10×3 — BUKAN formula Basel/FRTB); RAROC 23,19 persen; hurdle 15 persen. FRTB IMA: ES 97,5 persen + liquidity horizon, pengali ≥1,5.",
    },
    {
      id: "raroc-alokasi",
      eyebrow: "Langkah 4 · Teori",
      title: "RAROC dan alokasi modal: memberi makan yang efisien",
      prose: [
        "RAROC = (pendapatan − biaya − expected loss) dibagi economic capital. Pembilangnya adalah laba SETELAH risiko yang diharapkan (EL); penyebutnya adalah modal untuk risiko yang TIDAK diharapkan (UL/EC). Keputusan: RAROC di atas hurdle rate (biasanya target ROE bank, misalnya 15 persen) → TERIMA dan tambah modal; di bawah hurdle → TOLAK, naikkan harga, atau kurangi posisi. Contoh cerita pembuka: (600 − 180 − 90) dibagi 1.423 = 330 dibagi 1.423 = 23,19 persen — di atas hurdle 15 persen, desk diterima. Tetapi desk obligasi dengan RAROC 31 persen mendapat modal TAMBAHAN lebih dulu — karena tiap rupiah modal menghasilkan lebih banyak di sana.",
        "Alokasi modal dengan RAROC mengikuti aturan sederhana: alokasikan ke RAROC tertinggi sampai marginal RAROC semua desk sama. Bila desk A RAROC 31 persen dan desk B 23 persen, pindahkan modal dari B ke A — total laba bank naik tanpa menambah modal. Proses ini berhenti saat RAROC marginal keduanya sama (misalnya 25 persen) — titik di mana rupiah terakhir menghasilkan sama di kedua desk. Bank yang tidak melakukan ini sedang membiarkan uangnya bekerja di tempat yang salah.",
        "Tiga keterbatasan RAROC yang wajib diketahui. Pertama, RAROC mengukur RATA-RATA — ia tidak menangkap ekor (CR21 sudah mengajarkan ini untuk kredit: single-name Rp1 triliun dengan RAROC lolos tetap berbahaya karena konsentrasi). Desk dengan RAROC tinggi tetapi ekor gemuk bisa membunuh bank dalam satu hari buruk. Kedua, EC bergantung pada model — model yang salah memberi RAROC yang salah; validasi model (MR18) adalah prasyarat, bukan hiasan. Ketiga, RAROC menghukum bisnis baru: desk baru belum punya track record, EC-nya dihitung konservatif, RAROC-nya rendah — bank yang kaku pada RAROC akan menolak semua inovasi.",
        "Aturan penutup: RAROC adalah kompas, bukan autopilot. Ia memberi tahu ke mana modal sebaiknya pergi — tetapi keputusan akhir mempertimbangkan strategi, konsentrasi, ekor, dan regulasi. Desk dengan RAROC 14 persen (di bawah hurdle) bisa dipertahankan bila ia adalah lindung nilai alami bagi desk lain — atau bila ia pintu masuk ke klien strategis. Yang tidak boleh adalah desk dengan RAROC rendah yang dipertahankan tanpa alasan yang ditulis dan ditinjau.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira laba besar berarti desk bagus. Laba Rp600 miliar dengan EC Rp1.423 miliar (RAROC 23 persen) kalah efisien dari laba Rp400 miliar dengan EC Rp1.290 miliar (RAROC 31 persen). Yang dihitung bukan laba — melainkan laba per rupiah modal yang dikunci.",
      },
      reference: "RAROC 23,19 persen vs hurdle 15 persen — TERIMA. Alokasi ke RAROC marginal tertinggi sampai semua sama.",
    },
    {
      id: "lab-raroc",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin economic capital dan RAROC",
      prose: [
        "Lab ini membangun mesin EC dan RAROC trading book: dari VaR 1 hari, pendapatan, biaya, dan EL — hitung EC, RAROC, dan keputusannya.",
        "Hitung dulu di kepala. Akar 10 = 3,162278. EC = 150 × 3,162278 × 3 = 150 × 9,486833 = Rp1.423,02 miliar — dibulatkan Rp1.423 miliar. RAROC = (600 − 180 − 90) dibagi 1.423,02 × 100 = 330 dibagi 1.423,02 × 100 = 23,19 persen. Di atas hurdle 15 persen → TERIMA.",
        "Tugas lab: tulis fungsi yang menerima VaR 1 hari, pengali, pendapatan, biaya, EL, dan hurdle — lalu mencetak EC (dibulatkan), RAROC (2 desimal), dan keputusan. Tiga keluaran ini adalah ringkasan satu desk dalam satu baris.",
        "Setelah lolos, coba eksperimen: naikkan pengali menjadi 4 (backtesting buruk) dan lihat EC menjadi Rp1.897 miliar, RAROC jatuh ke 17,39 persen — masih lolos, tetapi margin menipis. Lalu tanyakan: berapa pengali yang membuat desk ini DITOLAK?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ec` (VaR 1 hari dikali akar 10 dikali pengali, dibulatkan)" },
        { id: "t2", text: "Hitung `raroc` ((pendapatan - biaya - EL) dibagi EC, dikali 100)" },
        { id: "t3", text: "Tentukan `keputusan` ('TERIMA' bila RAROC di atas hurdle, 'TOLAK' bila tidak)" },
      ],
      expected: "ec=1423\nraroc=23.19\nkeputusan=TERIMA",
      hints: [
        "EC = VaR x akar(10) x pengali; gunakan math.sqrt.",
        "RAROC = (pendapatan - biaya - EL) / EC x 100.",
        "TERIMA bila raroc >= hurdle, TOLAK bila tidak.",
      ],
      code: {
        starter: `# Desk derivatif ekuitas: VaR 1 hari Rp150 M, pengali 3, pendapatan 600, biaya 180, EL 90, hurdle 15%.\nimport math\nvar_1d = 150.0\npengali = 3.0\npendapatan = 600.0\nbiaya = 180.0\nel = 90.0\nhurdle = 15.0\n\n# TULIS KODEMU: hitung ec, raroc, keputusan.\n# Cetak, per baris: ec, raroc, keputusan.\n\n`,
        lockLines: 8,
        solution: `# Desk derivatif ekuitas: VaR 1 hari Rp150 M, pengali 3, pendapatan 600, biaya 180, EL 90, hurdle 15%.\nimport math\nvar_1d = 150.0\npengali = 3.0\npendapatan = 600.0\nbiaya = 180.0\nel = 90.0\nhurdle = 15.0\n\n\nec = round(var_1d * math.sqrt(10) * pengali)\nraroc = (pendapatan - biaya - el) / (var_1d * math.sqrt(10) * pengali) * 100\nkeputusan = "TERIMA" if raroc >= hurdle else "TOLAK"\nprint(f"ec={ec}")\nprint(f"raroc={raroc:.2f}")\nprint(f"keputusan={keputusan}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "ec", value: 1423, tol: 1, label: "EC Rp1.423 miliar", msg: "150 x 3,162278 x 3 = 1.423,02 — dibulatkan 1.423. Itulah modal yang dikunci desk ini." },
          { kind: "equal", task: "t2", name: "raroc", value: 23.19, tol: 0.01, label: "RAROC 23,19 persen", msg: "(600 - 180 - 90) / 1.423 x 100 = 23,19. Di atas hurdle 15 persen — tetapi di bawah desk obligasi 31 persen." },
          { kind: "stdout_matches", task: "t3", pattern: "keputusan=TERIMA", label: "Keputusan TERIMA", msg: "RAROC 23,19 persen di atas hurdle 15 persen. Desk diterima — tetapi modal tambahan pergi dulu ke desk obligasi." },
        ],
      },
      reference: "EC Rp1.423 miliar; RAROC 23,19 persen; keputusan TERIMA.",
    },
    {
      id: "keterbatasan",
      eyebrow: "Langkah 6 · Teori",
      title: "Yang tidak ditangkap RAROC — dan pengaman tambahannya",
      prose: [
        "RAROC tidak menangkap risiko ekor: desk dengan RAROC 30 persen tetapi distribusi kerugian yang gemuk di ekor bisa bangkrut dalam satu hari buruk — sementara desk dengan RAROC 20 persen dan ekor tipis bertahan. Pengaman tambahannya: stress test (MR7) dan ES 99,9 persen — bukan hanya EC dari VaR. Bank yang hanya memakai RAROC sedang mengemudi dengan melihat spion rata-rata.",
        "RAROC tidak menangkap risiko likuiditas: desk yang memegang aset illiquid (MR34) bisa punya RAROC tinggi di masa tenang — karena EC-nya dihitung dari volatilitas masa tenang — lalu tidak bisa keluar saat krisis. Pengamannya: LVaR (MR13) dan liquidity horizon FRTB yang lebih panjang untuk aset illiquid. RAROC tidak menangkap risiko konsentrasi: desk yang terkonsentrasi pada satu emiten atau satu faktor bisa punya RAROC tinggi sampai faktor itu berbalik. Pengamannya: limit konsentrasi dan stress test faktor tunggal.",
        "RAROC juga tidak menangkap risiko model: EC dihitung dari model VaR — bila modelnya salah (MR18/MR20), EC-nya salah, dan RAROC-nya salah. Pengamannya: validasi independen, backtesting (MR6), dan pengali yang naik saat backtesting buruk. Tiga pengaman ini — stress test, LVaR, validasi — bukan pengganti RAROC; mereka adalah pagar di sekelilingnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai RAROC sebagai satu-satunya kriteria. RAROC adalah satu lensa — ekor, likuiditas, konsentrasi, dan model adalah lensa lain. Keputusan modal yang hanya memakai satu lensa adalah keputusan yang buta di tiga arah.",
      },
      reference: "Pengaman RAROC: stress test + ES, LVaR, limit konsentrasi, validasi model.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: rapat alokasi modal tahunan",
      prose: [
        "Rapat alokasi modal tahunan Bank Nusantara. Tiga desk meminta tambahan modal Rp500 miliar. Desk derivatif ekuitas: laba Rp600 miliar, EC Rp1.423 miliar, RAROC 23,19 persen. Desk obligasi: laba Rp400 miliar, EC Rp1.290 miliar, RAROC 31,01 persen. Desk komoditas: laba Rp250 miliar, EC Rp2.000 miliar, RAROC 12,5 persen — di bawah hurdle 15 persen, tetapi desk ini adalah lindung nilai alami untuk portofolio kredit bank ke sektor tambang.",
        "Keputusan: Rp500 miliar dibagi — Rp300 miliar ke desk obligasi (RAROC tertinggi), Rp200 miliar ke desk ekuitas (di atas hurdle), Rp0 tambahan ke desk komoditas — tetapi desk komoditas DIPERTAHANKAN dengan alasan tertulis: lindung nilai alami, ditinjau tiap kuartal, dengan batas kerugian yang jelas. Bila lindung nilainya tidak terbukti dalam 2 kuartal, desk ditutup atau direstrukturisasi.",
        "Hasilnya setahun kemudian: laba total bank naik 8 persen tanpa menambah modal — hanya dengan memindahkan modal ke tempat yang lebih efisien. Dan desk komoditas membuktikan nilainya saat harga batubara jatuh 40 persen: kerugian kredit tambang Rp58 miliar (CR15) diimbangi keuntungan lindung nilai komoditas. RAROC yang rendah dengan alasan yang benar mengalahkan RAROC yang tinggi tanpa alasan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, modal dialokasikan berdasarkan RAROC marginal, bukan berdasarkan laba absolut. Kedua, pengecualian (desk komoditas) diberi alasan tertulis dan tenggat tinjauan — bukan dipertahankan diam-diam. Ketiga, hasilnya diukur setahun kemudian — bukan diasumsikan.",
      },
      reference: "Rp300 miliar ke obligasi (31,01 persen), Rp200 miliar ke ekuitas (23,19 persen), Rp0 ke komoditas — dipertahankan sebagai lindung nilai dengan tinjauan kuartalan.",
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
        "EC Rp1.423 miliar (VaR 150 × akar 10 × pengali 3 — RUMUS PENGAJARAN, bukan formula Basel/FRTB); RAROC 23,19 persen; hurdle 15 persen — TERIMA.",
        "Tiga modal: akuntansi (pembukuan), regulator (lantai hukum), economic capital (kebutuhan ekonomi).",
        "Alokasi modal ke RAROC marginal tertinggi sampai semua sama.",
        "RAROC tidak menangkap ekor, likuiditas, konsentrasi, dan risiko model — perlu pengaman.",
        "Desk di bawah hurdle bisa dipertahankan dengan alasan tertulis dan tenggat tinjauan.",
      ],
      next: { label: "MR34 — Risiko Hedge Fund dan Illiquidity: Leverage, Gate, dan Side Pocket", href: "/v2/learn/mr34-hedge-fund-illiquidity" },
      quiz: [
        {
          q: "VaR 1 hari Rp150 miliar, pengali 3. Pendapatan 600, biaya 180, EL 90 (miliar). Berapa EC dan RAROC? (hurdle 15 persen)",
          options: [
            { text: "EC Rp1.423 miliar; RAROC 23,19 persen — TERIMA", why: "Tepat: 150 × 3,1623 × 3 = 1.423; (600−180−90)/1.423 = 23,19 persen, di atas hurdle.", correct: true },
            { text: "EC Rp450 miliar; RAROC 73,33 persen — TERIMA", why: "Salah: 150 × 3 = 450 mengabaikan scaling akar 10. EC harus mencakup horizon 10 hari." },
            { text: "EC Rp1.423 miliar; RAROC 42,16 persen — TERIMA", why: "Salah: 42,16 persen berasal dari 600/1.423 — lupa mengurangkan biaya dan EL. RAROC memakai laba SETELAH risiko." },
            { text: "EC Rp4.743 miliar; RAROC 6,96 persen — TOLAK", why: "Salah: 4.743 berasal dari pengali 10, bukan 3. Pengali 3 adalah pengali VaR IMA lama (sampai 4 bila backtesting buruk); di FRTB pengali ES minimal 1,5." },
          ],
        },
        {
          q: "Apa beda economic capital dengan modal regulator?",
          options: [
            { text: "Tidak ada beda — keduanya sama", why: "Salah: modal regulator adalah lantai hukum dari ATMR standar; EC adalah kebutuhan ekonomi menurut model internal bank — biasanya lebih besar untuk portofolio berisiko." },
            { text: "Modal regulator adalah lantai hukum (ATMR); EC adalah kebutuhan ekonomi menurut model internal — dipakai untuk keputusan bisnis", why: "Tepat: bank yang sehat memegang modal aktual di atas keduanya, tetapi keputusan bisnis memakai EC.", correct: true },
            { text: "EC selalu lebih kecil dari modal regulator", why: "Salah: EC bisa lebih besar atau lebih kecil — tergantung portofolio. Untuk portofolio berisiko, EC biasanya LEBIH BESAR." },
            { text: "Modal regulator dihitung harian; EC dihitung tahunan saja", why: "Salah: EC berubah tiap hari bersama posisi dan volatilitas — itulah yang membuat biaya modal visible bagi trader." },
          ],
        },
        {
          q: "Desk A RAROC 31 persen, desk B 23 persen, keduanya di atas hurdle. Ke mana modal tambahan sebaiknya pergi?",
          options: [
            { text: "Ke desk B — ia lebih membutuhkan", why: "Salah: 'membutuhkan' bukan kriteria. Modal pergi ke tempat ia menghasilkan paling banyak — desk A — sampai RAROC marginal keduanya sama." },
            { text: "Ke desk A dulu — RAROC marginal tertinggi — sampai RAROC marginal keduanya sama", why: "Tepat: alokasi optimal menyamakan RAROC marginal. Memindahkan modal dari B ke A menaikkan laba total tanpa menambah modal.", correct: true },
            { text: "Dibagi rata — adil untuk semua desk", why: "Salah: adil bukan efisien. Pembagian rata membiarkan rupiah bekerja di tempat yang menghasilkan lebih sedikit." },
            { text: "Ke desk dengan laba absolut terbesar", why: "Salah: laba absolut mengabaikan modal yang dikunci. Desk dengan laba Rp600 miliar bisa kalah efisien dari desk laba Rp400 miliar." },
          ],
        },
        {
          q: "Kenapa pengali VaR IMA lama adalah 3, bukan 1?",
          options: [
            { text: "Karena regulator ingin bank memegang modal tiga kali lipat tanpa alasan", why: "Salah: pengali adalah bantalan untuk ketidakpastian model — data historis tanpa krisis berikutnya, distribusi yang diasumsikan, korelasi masa tenang." },
            { text: "Karena model salah — VaR dari data historis tidak mengandung krisis berikutnya dan korelasi masa tenang naik saat stres", why: "Tepat: pengali mengakui ketidaksempurnaan model. Backtesting buruk menaikkan pengali sampai 4 — ini pengali VaR IMA LAMA; di FRTB pengali ES minimal 1,5 dengan struktur berbeda.", correct: true },
            { text: "Karena VaR selalu meremehkan risiko tepat tiga kali lipat", why: "Salah: tidak ada angka pasti 'tiga kali'. Pengali 3 adalah kebijakan kehati-hatian, bukan hasil pengukuran yang eksak." },
            { text: "Karena ES selalu tiga kali VaR", why: "Salah: ES sekitar 1,3x VaR untuk distribusi normal, bukan 3x. Pengali 3 tidak ada hubungannya dengan rasio ES/VaR." },
          ],
        },
        {
          q: "Desk komoditas RAROC 12,5 persen (di bawah hurdle 15 persen) tetapi merupakan lindung nilai alami untuk portofolio kredit tambang bank. Apa keputusan yang benar?",
          options: [
            { text: "Tutup segera — RAROC di bawah hurdle berarti tidak ada pengecualian", why: "Salah: RAROC adalah kompas, bukan autopilot. Lindung nilai alami adalah alasan sah — bila ditulis dan ditinjau." },
            { text: "Pertahankan tanpa modal tambahan, dengan alasan tertulis dan tinjauan kuartalan — tutup bila lindung nilainya tidak terbukti", why: "Tepat: pengecualian boleh, tetapi harus eksplisit, beralasan, dan bertenggat. Yang tidak boleh adalah pengecualian diam-diam.", correct: true },
            { text: "Beri modal tambahan agar RAROC-nya naik", why: "Salah: menambah modal ke desk di bawah hurdle MENURUNKAN RAROC-nya lebih jauh (penyebut naik). Modal pergi ke RAROC tertinggi." },
            { text: "Naikkan hurdle menjadi 12 persen agar desk ini lolos", why: "Salah: mengubah hurdle untuk meloloskan desk adalah manipulasi — sama seperti mengubah ambang triase untuk meloloskan angka (MK31)." },
          ],
        },
      ],
    },
  ],
};
