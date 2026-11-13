import type { V2Lesson } from "../lib/types";

export const mlfM92: V2Lesson = {
  slug: "mlf-m92-scenario-stress-testing",
  track: "Machine Learning Finance",
  module: "Simulation, Backtesting & Validation",
  title: "MLF-M9.2 — Scenario & Stress Testing: Berapa Rugi Bila Sejarah Terburuk Terulang?",
  estMinutes: 90,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "8 April 2025: hari ketika portofolio −7,43% dalam sehari",
      prose: [
        "Selasa, 8 April 2025. Guncangan tarif mengguncang pasar — dan portofolio kita, equal-weight BBCA/KLBF/UNVR, jatuh −7,43% dalam SATU hari. Dengan modal Rp100.000.000, itu Rp7.432.406 yang hilang sebelum makan siang. Bukan dari model yang salah, bukan dari data yang bocor — dari pasar yang bergerak seperti yang kadang-kadang memang dilakukan pasar. Pertanyaan lesson ini bukan «kenapa jatuh?» — melainkan «berapa rugi bila hari seperti itu terulang — dan berapa rugi bila yang datang lebih buruk dari itu?»",
        "Konvensi lesson ini, ditulis eksplisit agar tidak ada angka yang tertukar: portofolio equal-weight BBCA/KLBF/UNVR atas SIMPLE daily returns (n=480, 2024-11-04 sampai 2026-11-11), deret yang sama dengan M4.2 VaR dan M5. Uang: Rp100.000.000 sebagai basis skenario — «Rp» hanya untuk portofolio IDX ini. Semua return di lesson ini adalah SIMPLE return, kecuali bila dinyatakan lain — dan bila satu angka punya versi simple dan versi log, keduanya ditulis berdampingan dengan labelnya.",
        "Peta lesson: cerita 8 April 2025 dan apa yang terjadi per saham → skenario historis: replay hari itu + 5 hari terburuk portofolio → skenario hipotetis: vol dikali 1,5 / 2,0 dan korelasi menuju 1 → reverse stress: berapa besar guncangan yang membuat VaR95 = 5% → stress M4.5 (rujukan): korelasi 0,95 dan diversifikasi yang menguap → batas stress test: «severe but plausible» → mini-case: komite minta angka untuk posisi 2× → 2 lab → 2 figure → jebakan: scenario shopping → checkpoint.",
        "Nilai: skenario dan stress test bagus karena ia mengubah ketakutan yang samar («bagaimana kalau pasar jatuh?») menjadi ANGKA yang bisa didiskusikan («bila 8 April terulang, rugi Rp7.432.406; bila posisi 2×, Rp14.864.812»). VaR95 0,0328 [M4.2] memberitahumu kerugian di hari yang buruk-dalam-batas-normal; stress test memberitahumu kerugian di hari yang TIDAK normal — dan hari tidak normal itulah yang menghabiskan modal.",
        "Baik atau buruk: kerugian −7,43% dalam sehari itu buruk sebagai HASIL — tapi bagus sebagai PELAJARAN, karena ia terukur: kamu tahu persis saham mana yang jatuh berapa (BBCA −8,53%, KLBF −7,05%, UNVR −6,72% — semuanya SIMPLE return), dan kamu tahu GSPC hari itu hanya −1,57%. Buruk bila hari seperti itu hanya diingat sebagai «hari yang sial» tanpa pernah dihitung ulang sebagai skenario: pasar akan mengulanginya dalam bentuk lain, dan kamu akan terkejut untuk kedua kalinya.",
        "Mitigasi: sebelum lesson ini selesai, kamu akan bisa menjawab tiga pertanyaan tanpa membuka spreadsheet: berapa rugi bila 8 April 2025 terulang (Rp7.432.406)? Berapa rugi di hari terburuk portofolio (Rp13.983.464, 2026-10-16)? Dan berapa besar guncangan yang membuat VaR95 menyentuh 5% (σ* = 0,0301, yaitu 1,53× σ saat ini)? Tiga angka itu adalah isi lesson ini.",
      ],
      tasks: [],
      note: {
        title: "Perhatian tanggal: guncangan tarif itu 2025-04-08, bukan 2026-04-08",
        type: "pitfall",
        body: "Yang benar: 8 April 2025 adalah hari guncangan tarif (portofolio −7,43%). Tanggal 8 April 2026 adalah hari yang BERBEDA — portofolio hari itu justru +3,39%. Jangan tertukar: satu digit tahun yang salah mengubah «hari terburuk kedua» menjadi «hari yang bagus». Selalu tulis tahunnya.",
      },
    },
    {
      id: "skenario-historis",
      eyebrow: "Langkah 2 · Skenario historis",
      title: "Skenario historis: replay 8 April 2025, per saham, dalam rupiah",
      prose: [
        "Skenario historis adalah replay: ambil SATU hari yang benar-benar terjadi, dan tanyakan «berapa rugi bila hari itu terulang dengan posisi saya hari ini?» Pada 2025-04-08, SIMPLE daily returns-nya: BBCA −0,0853, KLBF −0,0705, UNVR −0,0672, GSPC −0,0157, PORT −0,0743 [m9_canonical.json]. Dengan modal Rp100.000.000, kerugiannya: BBCA Rp8.529.401, KLBF Rp7.048.462, UNVR Rp6.719.357, GSPC Rp1.570.052, PORT Rp7.432.406. Perhatikan: kerugian portofolio Rp7.432.406 adalah rata-rata dari ketiga saham IDX (equal-weight) — rata-rata eksak ketiga kerugian per saham adalah Rp7.432.406,67, selisih Rp1 dari nilai kanonis karena kerugian per saham dibulatkan ke rupiah terdekat; nilai kanonis Rp7.432.406 sendiri dihitung dari return tak-terbulatkan −0,07432406 — dan GSPC, yang hanya −1,57% hari itu, menunjukkan bahwa guncangan ini berpusat di IDX, bukan di AS.",
        "Satu angka di sini punya dua versi — dan keduanya benar, untuk konvensi yang berbeda. M4.5 menyebut hari ini sebagai «BBCA log return −0,0892» — sekitar −8,9% (M4.5 menulis «sekitar −8,5%», itu persentase SIMPLE return-nya, −0,0853 — jangan tertukar). Di lesson ini BBCA ditulis −0,0853 — itu SIMPLE return. Bedanya: log return = ln(1 + simple return); untuk return negatif, log return lebih negatif daripada simple return (ln(1 − 0,0853) = −0,0892). Jangan pernah membandingkan −0,0892 [M4.5, log] dengan −0,0853 [lesson ini, simple] seolah satu lebih besar dari yang lain — keduanya adalah hari yang sama, diukur dengan penggaris yang berbeda. Di lesson ini, setiap pemakaian return dilabeli simple atau log.",
        "Lalu 5 hari terburuk portofolio (SIMPLE return, n=480): 2026-10-16 −0,1398 (Rp13.983.464); 2025-04-08 −0,0743 (Rp7.432.406); 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042). Dua hal yang harus dibaca dari daftar ini. Pertama: hari TERBURUK portofolio bukan guncangan tarif — 2026-10-16 jatuh −13,98%, hampir DUA KALI guncangan tarif (−7,43%). Siapa pun yang hanya menyiapkan diri untuk «mengulang 8 April» akan kekurangan modal hampir dua kali lipat pada 16 Oktober 2026. Kedua: 2026-10-19 (−4,83%) hanya tiga hari setelah hari terburuk — kerugian datang BERUNTUN, bukan sekali lalu selesai (lihat juga maxDD PORT −0,4363 [M4.5]: dari puncak ke lembah, portofolio pernah kehilangan 43,63%).",
        "Satu catatan tentang pembulatan — karena ia akan muncul di lab 1 dan tidak boleh disalahartikan sebagai kesalahan. Return yang ditampilkan di lesson ini dibulatkan ke 4 desimal (−0,0743), tetapi kerugian Rp kanonis dihitung dari return yang TIDAK dibulatkan: −0,0743 × Rp100.000.000 = Rp7.430.000, sedangkan nilai kanonisnya Rp7.432.406 — selisih Rp2.406 (0,03%). Selisih itu adalah artefak pembulatan, bukan kesalahan hitung: return sebenarnya hari itu −0,07432406. Bila kamu menghitung dari angka yang ditampilkan, kamu mendapat Rp7.430.000; bila kamu menghitung dari data, kamu mendapat Rp7.432.406 — dan yang kanonis adalah yang dari data.",
        "Apa yang dipelajari dari replay ini — dan ini jembatan ke langkah 5: pada hari-hari terburuk, saham-saham jatuh BERSAMAAN. BBCA, KLBF, dan UNVR semuanya negatif besar pada 8 April 2025 — dan M4.5 mengukur itu: korelasi antar-saham pada rezim volatilitas tinggi 0,3752, lebih tinggi daripada pada rezim volatilitas rendah 0,2775 [M4.5]. Korelasi NAIK saat stress — diversifikasi yang kamu andalkan di hari normal melemah tepat di hari kamu paling membutuhkannya. Skenario historis yang baik tidak hanya mengulang return-nya — ia mengulang KORELASI-nya.",
        "Nilai: skenario historis bagus karena ia TIDAK BISA DITUDUH mengada-ada — hari itu benar-benar terjadi, dengan angka yang bisa diperiksa siapa pun di data. Ia adalah skenario yang paling mudah dipertahankan di depan komite: «ini bukan imajinasi saya — ini 8 April 2025».",
        "Baik atau buruk: replay historis bagus bila dipakai sebagai TITIK AWAL («inilah yang pernah terjadi — sekarang bagaimana bila lebih buruk?») dan buruk bila dipakai sebagai BATAS («yang terburuk yang pernah terjadi adalah −13,98%, jadi siapkan modal untuk itu saja»). Sejarah adalah sampel, bukan batas: n=480 hari mengandung satu −13,98%, tetapi tidak ada yang menjamin −20% tidak akan datang. Itulah gunanya skenario hipotetis (langkah 3) dan batas stress test (langkah 6).",
        "Mitigasi: untuk setiap skenario historis yang kamu pakai, tulis tiga baris — tanggalnya, return per sahamnya (dengan konvensi simple/log), dan kerugiannya dalam rupiah pada posisi SAAT INI. Bila posisimu hari ini berbeda dari posisi saat sejarah itu terjadi, replay mentah-mentah adalah jawaban yang salah untuk pertanyaan yang benar — lihat jebakan di langkah 12.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: membandingkan simple return dengan log return seolah sama",
        type: "pitfall",
        body: "Yang benar: BBCA 8 April 2025 adalah −0,0853 SIMPLE dan −0,0892 LOG [M4.5] — dua angka untuk hari yang sama. Log return selalu lebih negatif daripada simple return saat return negatif (dan lebih kecil saat return positif). Bila kamu mencampur keduanya dalam satu perhitungan — misalnya memakai −0,0892 sebagai input VaR simple-return — hasilnya salah tanpa pesan error apa pun. Labeli konvensinya di tiap pemakaian.",
      },
    },
    {
      id: "skenario-hipotetis",
      eyebrow: "Langkah 3 · Skenario hipotetis",
      title: "Skenario hipotetis: vol dikali 1,5 / 2,0, dan korelasi menuju 1",
      prose: [
        "Skenario historis mengulang masa lalu. Skenario HIPOTETIS mengubah SATU parameter dan bertanya «bagaimana bila?» — dan yang diubah di sini adalah dua parameter yang paling menentukan VaR: volatilitas (σ) dan korelasi (ρ). Basisnya adalah VaR parametrik 95% [M4.2]: VaR95 = 0,0328, dari σ harian 0,0196 dan mean harian −0,0006 (SIMPLE return, n=480). Rumusnya di bawah — dan semua angka stress di langkah ini dihitung dari rumus yang sama, bukan dari simulasi baru.",
        "Satu faktor bergerak — volatilitas. Bila σ dikali 1,5 (menjadi 0,0294), VaR95 naik menjadi 0,0490. Bila σ dikali 2,0 (menjadi 0,0392), VaR95 naik menjadi 0,0651. Perhatikan dua hal. Pertama: VaR95 hampir berlipat ganda saat σ berlipat ganda — karena dalam rumus parametrik, VaR95 hampir sebanding dengan σ (mean −0,0006 hanya menggesernya sedikit: 0,0328 = 1,6449 × 0,0196 + 0,0006). Kedua: σ ×1,5 memberi VaR95 0,0490 — MASIH di bawah 0,05. Ambang 5% itu belum tersentuh pada pengali 1,5; ia tersentuh pada 1,53× (langkah 4). Dan kenapa stress vol masuk akal? Karena vol TIDAK KONSTAN — M4.3 (EWMA/GARCH) mengajarkan bahwa volatilitas bergerombol: hari yang volatil diikuti hari yang volatil. Mengalikan σ dengan 1,5 bukan mengada-ada — ia adalah cara sederhana untuk bertanya «bagaimana bila kita memasuki rezim volatilitas tinggi?»",
        "Satu faktor bergerak — korelasi. Bila korelasi antar-saham menuju 1 (semua saham bergerak sempurna searah), σ portofolio naik dari 0,0196 menjadi 0,0267 — yaitu rata-rata dari simpangan baku per saham (BBCA 0,0217; KLBF 0,0268; UNVR 0,0316; rata-ratanya (0,0217 + 0,0268 + 0,0316) / 3 = 0,0267) — dan VaR95 naik menjadi 0,0445. Perhatikan: korelasi →1 TIDAK membuat σ portofolio menjadi sebesar saham yang paling volatil (0,0316) — ia membuatnya menjadi RATA-RATA simpangan baku ketiganya, karena portofolio equal-weight dari tiga saham yang bergerak searah tetap merata-ratakan volatilitasnya. Dan bandingkan dengan stress vol: korelasi →1 (VaR95 0,0445) lebih ringan daripada σ ×1,5 (VaR95 0,0490) — karena σ ×1,5 menaikkan volatilitas SETIAP saham, sementara korelasi →1 hanya menghapus manfaat diversifikasi.",
        "Bedakan — dan ini inti langkah ini: SATU faktor bergerak vs SEMUA bergerak. Stress di atas masing-masing menggerakkan SATU faktor (σ saja, atau ρ saja) sambil menahan yang lain. Itu berguna untuk memahami «faktor mana yang paling berbahaya» — jawabannya di sini: σ. Tapi krisis yang sesungguhnya menggerakkan SEMUANYA SEKALIGUS: vol naik DAN korelasi naik (korelasi high-vol 0,3752 vs low-vol 0,2775 [M4.5] adalah buktinya). Skenario satu-faktor memberi batas bawah kerugian krisis; skenario semua-bergerak — misalnya σ ×1,5 DAN korelasi →1 — memberi gambaran yang lebih jujur tentang hari yang benar-benar buruk. Lesson ini tidak menghitung skenario gabungan itu sebagai angka kanonis — tetapi kamu harus tahu bahwa ia ada, dan bahwa ia lebih besar daripada kedua stress satu-faktor (σ per saham ×1,5 DAN korelasi 1 memberi σ_port 0,0401 dan VaR95 0,0666 [turunan]: 1,6449 × 0,0401 + 0,0006 = 0,0666).",
        "Nilai: skenario hipotetis bagus karena ia menjawab pertanyaan yang TIDAK BISA dijawab sejarah: «bagaimana bila vol naik 50%?» tidak pernah terjadi persis seperti itu — tetapi pertanyaan itu tetap layak dijawab, karena vol naik 50% adalah hal yang pernah terjadi dalam bentuk lain (M4.3: volatilitas bergerombol).",
        "Baik atau buruk: stress satu-faktor bagus bila dipakai untuk MEMERINGKAT risiko («σ lebih berbahaya daripada ρ di portofolio ini») dan buruk bila dipakai sebagai PERKIRAAN kerugian krisis — karena krisis menggerakkan semua faktor sekaligus, dan jumlah dua stress satu-faktor BUKAN stress gabungannya. Buruk juga bila pengalinya dipilih karena hasilnya «nyaman» (lihat jebakan, langkah 12): σ ×1,2 bukanlah stress — ia adalah pengali yang dipilih agar angkanya terlihat baik.",
        "Mitigasi: setiap skenario hipotetis tuliskan BERSAMA asumsi yang ditahannya: «σ ×1,5, korelasi TETAP pada korelasi SIMPLE-return saat ini (BBCA–KLBF 0,3488; BBCA–UNVR 0,2774; KLBF–UNVR 0,2897 [M5])». Dan bila menyebut korelasi, sebutkan konvensinya: korelasi SIMPLE-return M5 (0,3488/0,2774/0,2897) berbeda dari korelasi LOG-return M4 (0,361/0,285/0,3001) — keduanya benar, untuk konvensi yang berbeda, seperti simple vs log pada langkah 2.",
      ],
      formula: String.raw`\mathrm{VaR}_{95} = -(\mu + \sigma\,\Phi^{-1}(0{,}05)) = z_{0{,}95}\,\sigma - \mu, \qquad z_{0{,}95} = 1{,}6449`,
      formulaNote: "VaR parametrik 95% [M4.2]: Φ⁻¹(0,05) = −1,6449. Basis (SIMPLE return, n=480): μ = −0,0006, σ = 0,0196 → VaR95 = 1,6449 × 0,0196 − (−0,0006) = 0,0328. Stress vol: σ ×1,5 = 0,0294 → VaR95 0,0490; σ ×2,0 = 0,0392 → VaR95 0,0651. Stress korelasi →1: σ_port = rata-rata simpangan baku per saham = 0,0267 → VaR95 0,0445. Semua angka [m9_canonical.json].",
      tasks: [],
    },
    {
      id: "reverse-stress",
      eyebrow: "Langkah 4 · Reverse stress",
      title: "Reverse stress: berapa besar guncangan yang membuat VaR95 = 5%?",
      prose: [
        "Langkah 3 bertanya «bila σ naik sekian, berapa VaR-nya?» — pertanyaan MAJU. Reverse stress membaliknya: «VaR berapa yang TIDAK BOLEH terjadi — dan sebesar apa guncangan yang menyebabkannya?» Pertanyaan terbalik ini adalah pertanyaan yang diajukan regulator dan komite risiko, karena ia dimulai dari BATAS yang tidak boleh dilanggar, bukan dari skenario yang kebetulan terpikir.",
        "Batasnya di lesson ini: VaR95 = 0,05 — kerugian 5% dalam sehari pada Rp100.000.000 adalah Rp5.000.000 [kebijakan lesson ini: ambang 5% dipilih sebagai batas kerugian harian yang memicu eskalasi ke komite, bukan konstanta alam]. Pertanyaannya: berapa σ* yang membuat VaR95 parametrik tepat 0,05? Jawabannya [m9_canonical.json]: σ* = 0,0301 — yaitu 1,53× σ saat ini (0,0196; rasio 1,5323 dihitung dari σ eksak 0,0196172). Cara membacanya: volatilitas harian harus naik 53% dari level saat ini sebelum VaR95 menyentuh 5%. Selama σ di bawah 0,0301, VaR95 di bawah 0,05; begitu σ melewati 0,0301, batas itu terlampaui.",
        "Perhatikan betapa DEKATNYA σ* dengan stress langkah 3 — dan betapa pentingnya jarak itu. σ ×1,5 memberi VaR95 0,0490 — hanya 0,0010 di bawah target 0,05. Pengali 1,5 «hampir» menyentuh batas; pengali 1,53 menyentuhnya. Selisih antara «hampir» dan «menyentuh» itu hanya 0,03× σ — sekitar 0,0006 dalam σ harian. Pelajarannya: bila stress test-mu memberi 0,0490 dan batasmu 0,05, jangan menulis «aman» — tulislah «aman dengan margin 0,0010, yaitu kurang dari 0,03× σ». Margin yang lebih kecil daripada noise pengukuran σ itu sendiri bukanlah margin.",
        "Reverse stress juga bisa dibalik ke arah lain — dan komite yang baik menanyakan keduanya. Arah pertama (yang dihitung di sini): «σ berapa yang membuat VaR95 = 5%?» — jawabannya 0,0301. Arah kedua: «return harian berapa yang membuat kerugian Rp10.000.000?» — jawabannya −0,10, yaitu return yang LEBIH RINGAN daripada hari terburuk portofolio (−0,1398): hari terburuk sudah melewati batas Rp10.000.000, dengan kerugian Rp13.983.464. Membalik pertanyaan dengan benar berarti memeriksa arah ketidaksamaannya: −0,1398 < −0,10, jadi hari terburuk SUDAH melampaui batas Rp10.000.000. Reverse stress yang tidak memeriksa arah adalah jebakan aritmetika yang menunggu terjadi.",
        "Nilai: reverse stress bagus karena ia mengubah stress test dari «tebak skenario» menjadi «cari batas»: kamu tidak lagi memilih-milih skenario yang hasilnya nyaman (langkah 12) — kamu menghitung skenario yang TEPAT menyentuh batas yang tidak boleh dilanggar, lalu bertanya apakah skenario itu masuk akal.",
        "Baik atau buruk: reverse stress bagus bila batasnya (di sini VaR95 = 0,05) ditulis DULU dari kebijakan — dan buruk bila batasnya dipilih sesudah melihat σ* («ternyata 1,53×, jadi kita tetapkan batas 5%» adalah penalaran terbalik). Buruk juga bila σ* dibaca sebagai PREDIKSI («vol akan naik 53%») — σ* bukan ramalan; ia adalah jawaban atas «bagaimana bila», sama seperti semua stress test (langkah 6).",
        "Mitigasi: setiap reverse stress tuliskan dalam SATU kalimat yang lengkap: «VaR95 menyentuh 0,05 bila σ harian naik menjadi 0,0301 (1,53× σ saat ini 0,0196 — rasio 1,5323 dari σ eksak 0,0196172) — dan σ ×1,5 (0,0294) memberi VaR95 0,0490, hanya 0,0010 di bawah batas». Kalimat yang tidak menyebut σ saat ini, σ*, dan marginnya sekaligus adalah kalimat yang belum selesai.",
      ],
      tasks: [],
      formula: String.raw`\sigma^* = \frac{0{,}05 + \mu}{z_{0{,}95}} = \frac{0{,}05 - 0{,}000558}{1{,}6449} = 0{,}0301 = 1{,}53 \times \sigma`,
      formulaNote: "Reverse stress [m9_canonical.json]: dari VaR95 = z₀,₉₅·σ − μ = 0,05, dengan μ = −0,000558 dan z₀,₉₅ = 1,6449, diperoleh σ* = 0,0301. Rasio kanonis 1,5323 [m9_canonical.json] dihitung dari σ eksak 0,0196172 (σ tampil 0,0196) — ditulis 1,53×. Solver di lab 2 menemukan σ* yang sama dengan biseksi (0,0300–0,0301, dalam toleransi 0,0005 — selisihnya berasal dari pembulatan μ ke −0,0006).",
      note: {
        title: "Jangan baca «hampir menyentuh batas» sebagai «aman»",
        type: "risk",
        body: "Yang benar: σ ×1,5 memberi VaR95 0,0490 — hanya 0,0010 di bawah batas 0,05. Margin 0,0010 itu lebih kecil daripada ketidakpastian pengukuran σ harian itu sendiri. «Aman dengan margin 0,0010» adalah «tidak aman» yang ditulis dengan sopan. Tulis marginnya bersama verdictnya, selalu.",
      },
    },
    {
      id: "stress-m45",
      eyebrow: "Langkah 5 · Stress M4.5",
      title: "Stress M4.5: saat korelasi 0,95, diversifikasi menguap",
      prose: [
        "Langkah ini tidak menghitung apa pun yang baru — ia MERUJUK stress yang sudah dihitung di M4.5, dan menjelaskan maknanya. Di M4.5, korelasi antar-saham dinaikkan menjadi 0,95 (dari korelasi LOG-return saat itu) dan VaR95 naik dari 0,0324 menjadi 0,0431. Perhatikan basisnya: 0,0324 adalah VaR95 parametrik atas LOG return [M4.5] — berbeda dari basis lesson ini, VaR95 0,0328 atas SIMPLE return [M4.2]. Keduanya benar untuk konvensinya masing-masing; jangan membandingkan 0,0431 [M4.5, log] dengan 0,0445 [langkah 3, simple, korelasi →1] seolah selisihnya hanya soal penggaris — keduanya berbeda dalam DUA hal sekaligus: 0,0431 adalah korelasi 0,95 atas LOG return, sedangkan 0,0445 adalah korelasi 1,0 atas SIMPLE return. Dekomposisinya [M4, kanonik]: 0,0431 (ρ=0,95, log) → 0,0438 (ρ=1,0, log — stress_var95_100) → 0,0445 (ρ=1,0, simple). Jadi 0,0431 → 0,0438 adalah efek menaikkan ρ dari 0,95 ke 1,0, dan 0,0438 → 0,0445 adalah efek mengganti konvensi log→simple — dan ketiganya bercerita sama: korelasi naik, VaR naik sekitar sepertiga.",
        "Angka kedua dari M4.5 yang harus dibaca bersama VaR-nya: diversification ratio jatuh dari 1,353 menjadi 1,0169 saat korelasi 0,95. Diversification ratio mengukur «berapa kali lipat manfaat diversifikasi yang kamu dapatkan» — 1,353 berarti portofolio 35,3% lebih baik daripada rata-rata saham penyusunnya; 1,0169 berarti hanya 1,69% lebih baik — hampir TIDAK ADA manfaat diversifikasi yang tersisa. Itulah kalimat yang harus diingat dari langkah ini: diversifikasi menguap tepat saat kamu paling membutuhkannya. Bukan karena diversifikasi «tidak bekerja» — melainkan karena diversifikasi bekerja melalui korelasi yang RENDAH, dan korelasi naik saat stress (korelasi high-vol 0,3752 vs low-vol 0,2775 [M4.5]).",
        "Angka ketiga dari M4.5: maxDD PORT −0,4363, GSPC −0,1890. Maximum drawdown mengukur kerugian dari puncak ke lembah — dan −43,63% untuk portofolio berarti seseorang yang masuk di puncak dan keluar di lembah kehilangan hampir separuh modalnya, walau hari terburuknya «hanya» −13,98%. GSPC, dengan maxDD −18,90%, jatuh kurang dari separuh portofolio IDX — pasar AS dan IDX tidak jatuh sama dalamnya, seperti halnya mereka tidak selalu jatuh di hari yang sama (langkah 2: GSPC hari terburuknya 2026-11-05, portofolio hari itu justru +4,49%). Drawdown mengajarkan apa yang tidak diajarkan satu hari terburuk: kerugian BERUNTUN lebih berbahaya daripada kerugian sehari.",
        "Nilai: rujukan M4.5 bagus karena ia memberi stress test-mu SEJARAH: angka 0,0431 dan 1,0169 bukan dihitung untuk lesson ini — ia dihitung di modul lain, dari data yang sama, dan bercerita sama. Dua modul yang independen mencapai kesimpulan yang sama adalah bukti yang lebih kuat daripada satu modul yang menghitung dua kali.",
        "Baik atau buruk: merujuk M4.5 bagus bila basisnya ditulis (log vs simple, 0,0324 vs 0,0328) — dan buruk bila angka M4.5 dikutip tanpa basisnya, karena pembaca akan membandingkannya dengan angka lesson ini dan menyimpulkan ada yang «salah» di salah satu modul. Tidak ada yang salah: penggarisnya yang berbeda.",
        "Mitigasi: setiap kali kamu merujuk angka dari modul lain, tulis tiga hal — modulnya ([M4.5]), konvensinya (log return), dan basisnya (VaR95 0,0324). Tiga hal itu memakan satu baris — dan menyelamatkan satu jam debat yang tidak perlu.",
      ],
      tasks: [],
    },
    {
      id: "batas-stress",
      eyebrow: "Langkah 6 · Batas stress test",
      title: "Batas stress test: «severe but plausible» — dan stress BUKAN prediksi",
      prose: [
        "Stress test punya dua batas yang harus ditulis sebelum ia dipakai. Batas pertama: skenario yang TIDAK PERNAH TERJADI bukan berarti TIDAK MUNGKIN. Portofolio ini belum pernah jatuh −20% dalam sehari (n=480 hari, terburuk −13,98%) — tetapi «belum pernah» adalah pernyataan tentang sampel, bukan tentang masa depan. Skenario −20% dalam sehari bukanlah ramalan; ia adalah pertanyaan «bagaimana bila?» yang layak dijawab justru KARENA ia belum terjadi. Siapa pun yang menolak skenario dengan alasan «itu tidak pernah terjadi» sedang memakai sejarah sebagai tameng — dan sejarah tidak pernah berjanji untuk mengulang dirinya dalam batas yang sama.",
        "Batas kedua: skenario harus «severe but plausible» [kebijakan lesson ini] — berat TETAPI masuk akal. «Severe» berarti skenario itu cukup buruk untuk menguji batasmu: σ ×1,5, korelasi →1, replay −13,98% — semuanya severe. «Plausible» berarti skenario itu masih bisa dibayangkan terjadi tanpa melanggar cara pasar bekerja: σ ×2,0 masih plausible (vol rezim tinggi vs rendah di data ini 0,4131 vs 0,2777 — ≈1,5× [M4.5]; pelipatan ganda penuh pernah terjadi di krisis pasar lain [ilustrasi]); σ ×10 bukanlah stress test — ia adalah fantasi, dan fantasi tidak menghasilkan keputusan (modal berapa pun tidak cukup untuk σ ×10, jadi jawabannya selalu «tambah modal» — jawaban yang tidak berguna). Garis antara severe dan fantasi tidak ada rumusnya; ia diputuskan komite dan DITULIS — di lesson ini, pengali σ sampai 2,0 dan korelasi sampai 1 adalah batas «severe but plausible» [kebijakan lesson ini].",
        "Dan batas yang paling sering dilanggar: stress test BUKAN prediksi. VaR95 0,0651 pada σ ×2,0 TIDAK berarti «kerugian besok adalah 6,51%». Ia berarti «BILA σ berlipat ganda, kerugian di persentil 95 adalah 6,51%». Perbedaan antara «akan» dan «bila» adalah perbedaan antara ramalan dan pertanyaan — dan seluruh lesson ini adalah pertanyaan. Siapa pun yang memakai angka stress sebagai ramalan («model memprediksi rugi 6,51%») sedang menyalahgunakan alatnya, sama seperti memakai VaR sebagai «kerugian maksimum» (M4.2: VaR95 adalah ambang yang dilampaui 5% hari, bukan batas kerugian).",
        "Nilai: batas «severe but plausible» bagus karena ia membuat stress test JUJUR di kedua arah: cukup berat untuk tidak menenangkan diri secara palsu, cukup masuk akal untuk tidak melumpuhkan keputusan. Stress test yang terlalu ringan adalah penenang; yang terlalu berat adalah alasan untuk tidak melakukan apa pun.",
        "Baik atau buruk: «severe but plausible» bagus bila batasnya DITULIS («pengali σ sampai 2,0; korelasi sampai 1») — dan buruk bila batasnya hanya dirasakan («kayaknya ini sudah cukup berat»). Perasaan tidak bisa diaudit; pengali yang ditulis bisa.",
        "Mitigasi: di laporan stress test-mu, tulis satu baris untuk tiap skenario: «skenario X: severe karena …, plausible karena …». Bila satu dari dua kolom itu kosong, skenario itu belum siap dipakai — entah terlalu ringan, entah fantasi.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «skenario itu tidak pernah terjadi, jadi tidak perlu disiapkan»",
        type: "pitfall",
        body: "Yang benar: «belum pernah terjadi dalam 480 hari» berarti peluangnya kecil — bukan nol. 2026-10-16 (−13,98%) juga «belum pernah terjadi» sampai ia terjadi, dan ia hampir dua kali guncangan tarif yang sudah disiapkan. Stress test ada justru untuk hari yang belum pernah terjadi.",
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: «berapa rugi bila 8 April terulang dengan posisi 2×?»",
      prose: [
        "Komite risiko memanggilmu. Pertanyaannya satu kalimat: «Berapa rugi kita bila 8 April 2025 terulang — dengan posisi 2× lipat?» Jawabannya: Rp14.864.812. Aritmetikanya: kerugian 8 April pada modal Rp100.000.000 adalah Rp7.432.406 (langkah 2); posisi 2× berarti modal Rp200.000.000, jadi kerugiannya 2 × Rp7.432.406 = Rp14.864.812. Tulis aritmetikanya bersama jawabannya — komite yang hanya mendengar «14,8 juta» tanpa «2 × 7.432.406» tidak bisa memeriksa jawabanmu, dan jawaban yang tidak bisa diperiksa adalah klaim, bukan perhitungan.",
        "Tapi jawaban yang benar TIDAK BERHENTI di Rp14.864.812 — karena skala linear hanya berlaku bila posisi 2× tidak mengubah apa pun selain ukuran. Tiga batasnya, dan ketiganya harus disebutkan di depan komite. Pertama: LIKUIDITAS — menjual posisi 2× lipat di hari yang jatuh −7,43% tidak semudah menjual posisi 1×; pasar yang jatuh adalah pasar yang pembelinya menghilang, dan harga yang kamu dapatkan bisa lebih buruk daripada harga penutupan yang dipakai replay. Kedua: BIAYA — posisi 2× berarti biaya transaksi 2×, dan bila posisi 2× itu memakai leverage (pinjaman), ada bunga dan margin call yang tidak ada dalam replay Rp7.432.406. Ketiga: KORELASI — replay mengasumsikan korelasi hari itu terulang persis; bila posisi 2× itu menambah saham yang sama, korelasinya sama — tetapi bila ia menambah saham BARU, korelasi portofolio berubah dan replay 8 April bukan lagi replay yang benar.",
        "Dan satu batas yang paling sering dilupakan: replay 8 April mengasumsikan kamu MEMEGANG posisi yang sama seperti pada 8 April 2025. Bila komposisi portofoliomu hari ini berbeda — misalnya UNVR sudah dijual dan diganti saham lain — maka «8 April terulang» tidak lagi berarti −7,43%. Skenario historis yang diulang mentah-mentah tanpa menyesuaikan posisi saat ini adalah jawaban atas pertanyaan yang salah (langkah 12). Komite yang baik menanyakan «posisi SAAT INI» sebelum menanyakan «berapa rugi» — dan jawaban Rp14.864.812 di atas mengasumsikan posisi saat ini adalah equal-weight BBCA/KLBF/UNVR yang sama, hanya 2× lipat.",
        "Nilai: mini-case ini bagus karena jawabannya ADA di satu perkalian — 2 × 7.432.406 — dan kesulitannya BUKAN di perkalian itu, melainkan di tiga batas yang menyertainya. Itulah pekerjaan risiko: aritmetikanya mudah, syarat berlakunya yang sulit.",
        "Baik atau buruk: jawaban Rp14.864.812 bagus bila disertai tiga batasnya (likuiditas, biaya/leverage, komposisi posisi) — dan buruk bila disampaikan sebagai angka tunggal tanpa syarat, karena komite akan membawanya sebagai «kerugian maksimum bila 8 April terulang», padahal ia adalah «kerugian BILA 8 April terulang persis, posisi sama, tanpa gesekan». «Bila» yang hilang adalah «bila» yang paling mahal.",
        "Mitigasi: setiap kali kamu menjawab «berapa rugi bila X terulang?», jawab dalam DUA kalimat: kalimat pertama angkanya («Rp14.864.812 = 2 × Rp7.432.406»), kalimat kedua syaratnya («berlaku bila posisi sama dengan 8 April 2025, hanya 2× lipat, tanpa memperhitungkan likuiditas dan biaya leverage»). Bila kalimat keduamu kosong, jawaban pertamamu belum siap disampaikan.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: skala linear yang dibaca sebagai kebenaran, bukan asumsi",
        type: "risk",
        body: "Yang benar: 2 × Rp7.432.406 = Rp14.864.812 adalah skala LINEAR — ia mengasumsikan kerugian berlipat tepat dua kali saat posisi berlipat dua kali. Asumsi itu runtuh bila posisi 2× mengubah likuiditas, biaya, atau komposisi. Skala linear adalah titik awal perhitungan, bukan kesimpulan — tulis batasnya bersama angkanya.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 8 · Lab 1",
      title: "Lab: replay skenario — hitung kerugian rupiahnya, jangan tebak",
      prose: [
        "Sekarang hitung sendiri replay 8 April 2025 dan 5 hari terburuk dari angka kanonis [m9_canonical.json]. Return SIMPLE yang ditampilkan (BBCA −0,0853; KLBF −0,0705; UNVR −0,0672; GSPC −0,0157; PORT −0,0743) dibulatkan ke 4 desimal — sedangkan kerugian Rp kanonis dihitung dari return yang TIDAK dibulatkan. Lab ini menghitung KEDUANYA, supaya kamu melihat selisih pembulatannya dengan mata sendiri: Rp2.406 pada portofolio.",
        "Hasil yang diharapkan [lab]: loss_8apr_port_rounded=7430000; loss_8apr_port=7432406; rounding_diff=2406; worst_day=-0.1398; worst_day_date=2026-10-16; worst_day_loss=13983464; loss_2x=14864812. Bacalah baris ketiga dengan saksama: rounding_diff 2406 BUKAN kesalahan — ia adalah selisih antara menghitung dari return yang ditampilkan (−0,0743 × Rp100.000.000 = Rp7.430.000) dan menghitung dari data (Rp7.432.406). Dan baris terakhir adalah jawaban mini-case langkah 7: 2 × Rp7.432.406 = Rp14.864.812 — dari nilai KANONIS, bukan dari nilai yang dibulatkan (2 × Rp7.430.000 = Rp14.860.000 adalah jawaban yang salah Rp4.812).",
        "Setelah lab jalan, bandingkan dengan langkah 2: hari terburuk portofolio 2026-10-16 (−0,1398, Rp13.983.464) hampir dua kali guncangan tarif — dan tanggalnya (2026-10-16) adalah tanggal yang harus kamu ingat bila seseorang berkata «yang terburuk sudah lewat, itu 8 April».",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi loss_8apr_port_rounded, loss_8apr_port, dan rounding_diff" },
        { id: "t2", text: "Lengkapi worst_day, worst_day_date, dan worst_day_loss dari WORST5" },
        { id: "t3", text: "Lengkapi loss_2x: 2 × loss_8apr_port (mini-case langkah 7)" },
      ],
      expected: "loss_8apr_port_rounded=7430000\nloss_8apr_port=7432406\nrounding_diff=2406\nworst_day=-0.1398\nworst_day_date=2026-10-16\nworst_day_loss=13983464\nloss_2x=14864812",
      hints: [
        "loss_8apr_port_rounded = round(−(−0,0743) × 100.000.000) = Rp7.430.000 — dari return yang DITAMPILKAN. loss_8apr_port = RP_8APR[\"PORT\"] = Rp7.432.406 — nilai kanonis dari data.",
        "rounding_diff = 7.432.406 − 7.430.000 = 2.406 (0,03%) — artefak pembulatan, bukan kesalahan hitung.",
        "worst_day = return paling negatif di WORST5 = −0,1398 (2026-10-16), kerugiannya Rp13.983.464. loss_2x = 2 × 7.432.406 = 14.864.812 — pakai nilai kanonis, bukan nilai bulat.",
      ],
      requires: ["numpy"],
      code: {
        starter: `# Lab 1 — replay skenario 8 April 2025 [m9_canonical.json]
# Portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (n=480).
# Basis uang: Rp100.000.000. Kerugian Rp kanonis dihitung dari return
# yang TIDAK dibulatkan — return yang ditampilkan di lesson dibulatkan
# ke 4 desimal, jadi hitung dari angka tampil memberi selisih kecil.
import numpy as np

MODAL = 100_000_000
RET_8APR = {"BBCA": -0.0853, "KLBF": -0.0705, "UNVR": -0.0672,
            "GSPC": -0.0157, "PORT": -0.0743}
RP_8APR = {"BBCA": 8529401, "KLBF": 7048462, "UNVR": 6719357,
           "GSPC": 1570052, "PORT": 7432406}
WORST5 = [("2026-10-16", -0.1398, 13983464),
          ("2025-04-08", -0.0743, 7432406),
          ("2025-02-28", -0.0728, 7284287),
          ("2026-04-24", -0.0522, 5217623),
          ("2026-10-19", -0.0483, 4833042)]

loss_8apr_port_rounded = 0  # TODO: round(-RET_8APR["PORT"] * MODAL)
loss_8apr_port = 0  # TODO: RP_8APR["PORT"] — nilai kanonis dari data
rounding_diff = 0  # TODO: loss_8apr_port - loss_8apr_port_rounded
rets = np.array([w[1] for w in WORST5])
i_worst = 0  # TODO: int(np.argmin(rets)) — return paling negatif
worst_day = 0.0  # TODO: rets[i_worst]
worst_day_date = ""  # TODO: WORST5[i_worst][0]
worst_day_loss = 0  # TODO: WORST5[i_worst][2]
loss_2x = 0  # TODO: 2 * loss_8apr_port (mini-case langkah 7)
print(f"loss_8apr_port_rounded={loss_8apr_port_rounded}")
print(f"loss_8apr_port={loss_8apr_port}")
print(f"rounding_diff={rounding_diff}")
print(f"worst_day={worst_day:.4f}")
print(f"worst_day_date={worst_day_date}")
print(f"worst_day_loss={worst_day_loss}")
print(f"loss_2x={loss_2x}")`,
        lockLines: 18,
        solution: `# Lab 1 — replay skenario 8 April 2025 [m9_canonical.json]
# Portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (n=480).
# Basis uang: Rp100.000.000. Kerugian Rp kanonis dihitung dari return
# yang TIDAK dibulatkan — return yang ditampilkan di lesson dibulatkan
# ke 4 desimal, jadi hitung dari angka tampil memberi selisih kecil.
import numpy as np

MODAL = 100_000_000
RET_8APR = {"BBCA": -0.0853, "KLBF": -0.0705, "UNVR": -0.0672,
            "GSPC": -0.0157, "PORT": -0.0743}
RP_8APR = {"BBCA": 8529401, "KLBF": 7048462, "UNVR": 6719357,
           "GSPC": 1570052, "PORT": 7432406}
WORST5 = [("2026-10-16", -0.1398, 13983464),
          ("2025-04-08", -0.0743, 7432406),
          ("2025-02-28", -0.0728, 7284287),
          ("2026-04-24", -0.0522, 5217623),
          ("2026-10-19", -0.0483, 4833042)]

loss_8apr_port_rounded = round(-RET_8APR["PORT"] * MODAL)
loss_8apr_port = RP_8APR["PORT"]
rounding_diff = loss_8apr_port - loss_8apr_port_rounded
rets = np.array([w[1] for w in WORST5])
i_worst = int(np.argmin(rets))
worst_day = rets[i_worst]
worst_day_date = WORST5[i_worst][0]
worst_day_loss = WORST5[i_worst][2]
loss_2x = 2 * loss_8apr_port
print(f"loss_8apr_port_rounded={loss_8apr_port_rounded}")
print(f"loss_8apr_port={loss_8apr_port}")
print(f"rounding_diff={rounding_diff}")
print(f"worst_day={worst_day:.4f}")
print(f"worst_day_date={worst_day_date}")
print(f"worst_day_loss={worst_day_loss}")
print(f"loss_2x={loss_2x}")`,
        checks: [
          { kind: "equal", task: "t1", name: "loss_8apr_port", value: 7432406, tol: 1, label: "`loss_8apr_port` seharusnya 7432406", msg: "Kerugian portofolio 8 April 2025 pada Rp100jt: Rp7.432.406 — nilai kanonis dari data (return tak-terbulatkan)." },
          { kind: "equal", task: "t1", name: "loss_8apr_port_rounded", value: 7430000, tol: 1, label: "`loss_8apr_port_rounded` seharusnya 7430000", msg: "Dari return yang ditampilkan (−0,0743): 0,0743 × 100.000.000 = Rp7.430.000 — Rp2.406 lebih kecil dari nilai kanonis." },
          { kind: "equal", task: "t1", name: "rounding_diff", value: 2406, tol: 1, label: "`rounding_diff` seharusnya 2406", msg: "Selisih Rp2.406 (0,03%) adalah artefak pembulatan return ke 4 desimal — bukan kesalahan hitung." },
          { kind: "equal", task: "t2", name: "worst_day", value: -0.1398, tol: 0.00005, label: "`worst_day` seharusnya -0.1398", msg: "Hari terburuk portofolio: 2026-10-16, −0,1398 — hampir dua kali guncangan tarif." },
          { kind: "equal", task: "t2", name: "worst_day_loss", value: 13983464, tol: 1, label: "`worst_day_loss` seharusnya 13983464", msg: "Kerugian hari terburuk pada Rp100jt: Rp13.983.464." },
          { kind: "stdout_matches", task: "t2", pattern: "worst_day_date=2026-10-16", label: "Output menampilkan worst_day_date=2026-10-16", msg: "Tanggal hari terburuk: 2026-10-16 — bukan 8 April 2025." },
          { kind: "equal", task: "t3", name: "loss_2x", value: 14864812, tol: 1, label: "`loss_2x` seharusnya 14864812", msg: "Mini-case langkah 7: 2 × Rp7.432.406 = Rp14.864.812 — dari nilai kanonis, bukan dari nilai bulat (2 × 7.430.000 = 14.860.000 adalah jawaban yang salah Rp4.812)." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 9 · Lab 2",
      title: "Lab: reverse stress solver — cari σ* untuk target VaR95 0,05",
      prose: [
        "Lab kedua memecahkan pertanyaan terbalik langkah 4 dengan mesin: berapa σ* yang membuat VaR95 parametrik tepat 0,05? Rumusnya [M4.2]: VaR95(σ) = Z95 × σ − MU_DAY, dengan Z95 = 1,6449 dan MU_DAY = −0,0006 [m9_canonical.json]. Solver-nya adalah biseksi: mulai dari selang [0,01; 0,10] — VaR95 di 0,01 adalah 0,0170 (di bawah target), di 0,10 adalah 0,1651 (di atas target) — lalu bagi dua selang itu 60 kali sampai σ* terjepit.",
        "Hasil yang diharapkan [lab]: var95_base=0.0328; var95_x15=0.0490; var95_x2=0.0651; sigma_star=0.0300; sigma_star_ratio=1.5323; var95_at_star=0.0500. Perhatikan baris keempat: sigma_star tercetak 0,0300, sedangkan nilai kanonisnya 0,0301 [m9_canonical.json] — selisih 0,0001 berasal dari pembulatan μ ke −0,0006 di lab ini (kanonis memakai μ yang tidak dibulatkan); keduanya dalam toleransi 0,0005, dan rasio sigma_star_ratio 1,5323 sama persis dengan kanonis. Itulah gunanya toleransi: ia mengakui pembulatan tanpa menyembunyikannya.",
        "Setelah lab jalan, tanyakan pada dirimu: apa yang terjadi bila targetnya bukan 0,05 melainkan 0,0651? Jawabannya sudah ada di baris ketiga: σ* = 2,0 × σ — karena VaR95 0,0651 adalah VaR pada σ ×2,0. Reverse stress dan stress maju adalah dua arah dari rumus yang sama — dan solver yang sama menjawab keduanya, hanya targetnya yang diganti.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi var95_base, var95_x15, dan var95_x2 dari var95_param" },
        { id: "t2", text: "Lengkapi sigma_star dan sigma_star_ratio dari hasil biseksi" },
        { id: "t3", text: "Lengkapi var95_at_star: verifikasi VaR95 pada sigma_star" },
      ],
      expected: "var95_base=0.0328\nvar95_x15=0.0490\nvar95_x2=0.0651\nsigma_star=0.0300\nsigma_star_ratio=1.5323\nvar95_at_star=0.0500",
      hints: [
        "var95_base = var95_param(0,0196) = 0,0328; var95_x15 = var95_param(1,5 × 0,0196) = 0,0490; var95_x2 = var95_param(2,0 × 0,0196) = 0,0651.",
        "Biseksi menjepit σ* di antara lo dan hi: sigma_star = 0,5 × (lo + hi) ≈ 0,0300 — nilai kanonis 0,0301, selisih 0,0001 dari pembulatan μ. sigma_star_ratio = sigma_star / 0,0196 = 1,5323.",
        "var95_at_star = var95_param(sigma_star) ≈ 0,0500 — verifikasi bahwa solver memang menemukan σ yang membuat VaR95 tepat menyentuh target.",
      ],
      requires: ["numpy"],
      code: {
        starter: `# Lab 2 — reverse stress solver: cari sigma* untuk target VaR95 0,05
# Rumus parametrik [M4.2]: VaR95(sigma) = Z95 * sigma - MU_DAY,
# dengan Z95 = 1,6449 (Phi^-1(0,95)) dan MU_DAY = -0,0006 [m9_canonical.json].
# Basis: SIMPLE return, sigma harian saat ini 0,0196, VaR95 0,0328.
import numpy as np

MU_DAY = -0.0006
SD_DAY = 0.0196
Z95 = 1.6448536269514722
TARGET_VAR95 = 0.05


def var95_param(sigma):
    return Z95 * sigma - MU_DAY


var95_base = 0.0  # TODO: var95_param(SD_DAY)
var95_x15 = 0.0  # TODO: var95_param(1.5 * SD_DAY)
var95_x2 = 0.0  # TODO: var95_param(2.0 * SD_DAY)
# Biseksi: cari sigma* di [0,01; 0,10] sehingga var95_param(sigma*) = 0,05
lo, hi = 0.01, 0.10
for _ in range(60):
    mid = 0.5 * (lo + hi)
    if var95_param(mid) < TARGET_VAR95:
        lo = mid
    else:
        hi = mid
sigma_star = 0.0  # TODO: 0.5 * (lo + hi)
sigma_star_ratio = 0.0  # TODO: sigma_star / SD_DAY
var95_at_star = 0.0  # TODO: var95_param(sigma_star)
print(f"var95_base={var95_base:.4f}")
print(f"var95_x15={var95_x15:.4f}")
print(f"var95_x2={var95_x2:.4f}")
print(f"sigma_star={sigma_star:.4f}")
print(f"sigma_star_ratio={sigma_star_ratio:.4f}")
print(f"var95_at_star={var95_at_star:.4f}")`,
        lockLines: 16,
        solution: `# Lab 2 — reverse stress solver: cari sigma* untuk target VaR95 0,05
# Rumus parametrik [M4.2]: VaR95(sigma) = Z95 * sigma - MU_DAY,
# dengan Z95 = 1,6449 (Phi^-1(0,95)) dan MU_DAY = -0,0006 [m9_canonical.json].
# Basis: SIMPLE return, sigma harian saat ini 0,0196, VaR95 0,0328.
import numpy as np

MU_DAY = -0.0006
SD_DAY = 0.0196
Z95 = 1.6448536269514722
TARGET_VAR95 = 0.05


def var95_param(sigma):
    return Z95 * sigma - MU_DAY


var95_base = var95_param(SD_DAY)
var95_x15 = var95_param(1.5 * SD_DAY)
var95_x2 = var95_param(2.0 * SD_DAY)
# Biseksi: cari sigma* di [0,01; 0,10] sehingga var95_param(sigma*) = 0,05
lo, hi = 0.01, 0.10
for _ in range(60):
    mid = 0.5 * (lo + hi)
    if var95_param(mid) < TARGET_VAR95:
        lo = mid
    else:
        hi = mid
sigma_star = 0.5 * (lo + hi)
sigma_star_ratio = sigma_star / SD_DAY
var95_at_star = var95_param(sigma_star)
print(f"var95_base={var95_base:.4f}")
print(f"var95_x15={var95_x15:.4f}")
print(f"var95_x2={var95_x2:.4f}")
print(f"sigma_star={sigma_star:.4f}")
print(f"sigma_star_ratio={sigma_star_ratio:.4f}")
print(f"var95_at_star={var95_at_star:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95_base", value: 0.0328, tol: 0.0005, label: "`var95_base` seharusnya 0.0328", msg: "VaR95 basis (SIMPLE return): 1,6449 × 0,0196 + 0,0006 = 0,0328 [M4.2]." },
          { kind: "equal", task: "t1", name: "var95_x15", value: 0.049, tol: 0.0005, label: "`var95_x15` seharusnya 0.0490", msg: "σ ×1,5 → VaR95 0,0490 — hanya 0,0010 di bawah target 0,05 (langkah 4)." },
          { kind: "equal", task: "t1", name: "var95_x2", value: 0.0651, tol: 0.0005, label: "`var95_x2` seharusnya 0.0651", msg: "σ ×2,0 → VaR95 0,0651 — VaR95 hampir berlipat ganda saat σ berlipat ganda." },
          { kind: "equal", task: "t2", name: "sigma_star", value: 0.0301, tol: 0.0005, label: "`sigma_star` seharusnya ≈0.0300–0.0301 (kanonis 0.0301)", msg: "σ* = 0,0301 [m9_canonical.json] — solver memberi 0,0300 karena μ dibulatkan ke −0,0006; selisih 0,0001 dalam toleransi." },
          { kind: "equal", task: "t2", name: "sigma_star_ratio", value: 1.53, tol: 0.01, label: "`sigma_star_ratio` seharusnya 1.53", msg: "σ* adalah 1,53× σ saat ini (rasio kanonis 1,5323) — volatilitas harus naik 53% sebelum VaR95 menyentuh 5%." },
          { kind: "equal", task: "t3", name: "var95_at_star", value: 0.05, tol: 0.0005, label: "`var95_at_star` seharusnya 0.0500", msg: "Verifikasi: VaR95 pada σ* tepat 0,0500 — solver memang menemukan σ yang menyentuh target." },
        ],
      },
    },
    {
      id: "figure-worst5",
      eyebrow: "Langkah 10 · Figure 1",
      title: "Figure: 5 hari terburuk — satu batang yang dua kali lipat dari yang lain",
      prose: [
        "Bacalah figure ini seperti komite: satu batang menjulang sendiri di kiri — 2026-10-16, −13,98%, Rp13.983.464 — hampir dua kali batang kedua, 2025-04-08 (guncangan tarif), −7,43%, Rp7.432.406. Tiga batang berikutnya: 2025-02-28 −7,28% (Rp7.284.287), 2026-04-24 −5,22% (Rp5.217.623), 2026-10-19 −4,83% (Rp4.833.042). Semua nilai adalah SIMPLE return portofolio (n=480) dan kerugian pada modal Rp100.000.000 — angka yang SAMA dengan prose langkah 2 dan lab 1.",
        "Nilai: figure ini bagus karena ia membuat satu fakta menjadi TIDAK TERLEWATKAN: hari terburuk bukan guncangan tarif. Dalam tabel, −0,1398 dan −0,0743 terlihat seperti «dua angka negatif»; dalam figure, batang pertama dua kali batang kedua — dan mata tidak bisa mengabaikannya.",
        "Baik atau buruk: bar chart ini bagus bila dibaca bersama tanggalnya — 2026-10-19 hanya tiga hari setelah 2026-10-16, jadi dua dari lima batang terburuk terjadi dalam satu minggu yang sama. Buruk bila dibaca sebagai «lima kejadian yang independen» — kerugian beruntun adalah satu episode, bukan lima kecelakaan yang terpisah.",
        "Mitigasi: bila kamu membuat figure sejenis untuk portofoliomu sendiri, selalu sertakan DUA label per batang — return dan rupiah — karena komite memutuskan dalam rupiah, bukan dalam desimal.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Lima hari terburuk portofolio: 2026-10-16 minus 13,98 persen, 2025-04-08 minus 7,43 persen, 2025-02-28 minus 7,28 persen, 2026-04-24 minus 5,22 persen, 2026-10-19 minus 4,83 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5 hari terburuk portofolio (SIMPLE return)</text>
<line x1="50" y1="48" x2="450" y2="48" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="50" y1="98" x2="450" y2="98" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="50" y1="148" x2="450" y2="148" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="50" y1="198" x2="450" y2="198" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="44" y="51" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text>
<text x="44" y="101" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−5%</text>
<text x="44" y="151" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−10%</text>
<text x="44" y="201" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−15%</text>
<rect x="48" y="48" width="56" height="139.8" fill="var(--c2)"/>
<text x="76" y="201" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−13,98%</text>
<text x="76" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2026-10-16</text>
<text x="76" y="238" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Rp13,98 jt</text>
<rect x="128" y="48" width="56" height="74.3" fill="var(--c1)"/>
<text x="156" y="135" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−7,43%</text>
<text x="156" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2025-04-08</text>
<text x="156" y="238" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Rp7,43 jt</text>
<rect x="208" y="48" width="56" height="72.8" fill="var(--c4)"/>
<text x="236" y="134" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−7,28%</text>
<text x="236" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2025-02-28</text>
<text x="236" y="238" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Rp7,28 jt</text>
<rect x="288" y="48" width="56" height="52.2" fill="var(--c4)"/>
<text x="316" y="113" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−5,22%</text>
<text x="316" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2026-04-24</text>
<text x="316" y="238" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Rp5,22 jt</text>
<rect x="368" y="48" width="56" height="48.3" fill="var(--c4)"/>
<text x="396" y="109" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−4,83%</text>
<text x="396" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2026-10-19</text>
<text x="396" y="238" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Rp4,83 jt</text>
<text x="240" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">2026-10-16 hampir 2× guncangan tarif — dan 2026-10-19 hanya 3 hari sesudahnya.</text>
</svg>`,
        alt: "Lima hari terburuk portofolio: 2026-10-16 minus 13,98 persen (Rp13.983.464), 2025-04-08 minus 7,43 persen (Rp7.432.406), 2025-02-28 minus 7,28 persen (Rp7.284.287), 2026-04-24 minus 5,22 persen (Rp5.217.623), 2026-10-19 minus 4,83 persen (Rp4.833.042).",
        caption: "Cara membaca: batang turun dari garis 0% — semakin panjang ke bawah, semakin besar kerugian hari itu. Batang pertama (2026-10-16, −13,98%) hampir dua kali batang kedua (2025-04-08, guncangan tarif, −7,43%). Label rupiah adalah kerugian pada modal Rp100.000.000 (nilai persis: Rp13.983.464 / Rp7.432.406 / Rp7.284.287 / Rp5.217.623 / Rp4.833.042). Angka dari m9_canonical.json, SIMPLE return, n=480.",
      },
      tasks: [],
    },
    {
      id: "figure-var-sigma",
      eyebrow: "Langkah 11 · Figure 2",
      title: "Figure: VaR95 vs pengali σ — garis yang hampir menyentuh target",
      prose: [
        "Bacalah figure ini dari kiri ke kanan: pada σ ×1,0 (saat ini, σ = 0,0196), VaR95 = 0,0328. Pada σ ×1,5, VaR95 = 0,0490 — titiknya hanya 0,0010 di bawah garis putus-putus target 0,05. Pada σ ×2,0, VaR95 = 0,0651 — jauh di atas target. Garis vertikal putus-putus menandai σ* = 1,53× — pengali yang TEPAT mencapai target 0,05 (σ* = 0,0301). Semua nilai adalah VaR95 parametrik [M4.2] atas SIMPLE return.",
        "Nilai: figure ini bagus karena ia membuat margin 0,0010 menjadi TERLIHAT: jarak vertikal antara titik σ ×1,5 dan garis target hampir tidak ada — mata melihat «hampir menyentuh» lebih cepat daripada angka 0,0490 vs 0,05 dibaca sebagai «aman».",
        "Baik atau buruk: garis lurus antara tiga titik ini bagus sebagai ILUSTRASI — VaR95 parametrik memang hampir linear dalam σ (mean −0,0006 hanya menggesernya sedikit). Buruk bila dibaca sebagai «VaR95 SELALU linear dalam σ» — linearitas ini milik rumus parametrik normal; VaR historis atau VaR dari distribusi ber-ekor-tebal tidak linear seperti ini.",
        "Mitigasi: bila kamu menggambar figure sejenis, selalu gambar GARIS TARGET-nya — tanpa garis 0,05, tiga titik itu hanya «naik»; dengan garis itu, tiga titik itu bercerita «hampir menyentuh, lalu melampaui».",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="VaR95 parametrik versus pengali sigma: sigma kali 1,0 VaR95 0,0328; sigma kali 1,5 VaR95 0,0490; sigma kali 2,0 VaR95 0,0651; garis target 0,05; sigma bintang 1,53 kali">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VaR95 parametrik vs pengali σ (SIMPLE return)</text>
<line x1="50" y1="206" x2="50" y2="36" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="50" y1="206" x2="450" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="50" y1="157.4" x2="450" y2="157.4" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="50" y1="108.9" x2="450" y2="108.9" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="50" y1="60.3" x2="450" y2="60.3" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="50" y1="36" x2="450" y2="36" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="44" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="160.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,02</text>
<text x="44" y="111.9" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,04</text>
<text x="44" y="63.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,06</text>
<text x="44" y="39" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,07</text>
<line x1="50" y1="84.6" x2="450" y2="84.6" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="6 3"/>
<text x="448" y="78.6" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">target 0,05</text>
<line x1="258" y1="36" x2="258" y2="206" stroke="var(--c3)" stroke-width="1" stroke-dasharray="3 3"/>
<text x="258" y="30" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">σ* = 1,53×</text>
<polyline points="110,126.3 250,87 390,47.9" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="110" cy="126.3" r="5" fill="var(--c2)"/>
<circle cx="250" cy="87" r="5" fill="var(--c2)"/>
<circle cx="390" cy="47.9" r="5" fill="var(--c2)"/>
<text x="110" y="114.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0328</text>
<text x="250" y="75" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0490</text>
<text x="382" y="43.9" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0651</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">σ ×1,0 (saat ini)</text>
<text x="250" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">σ ×1,5</text>
<text x="390" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">σ ×2,0</text>
</svg>`,
        alt: "VaR95 parametrik versus pengali sigma: sigma kali 1,0 VaR95 0,0328; sigma kali 1,5 VaR95 0,0490; sigma kali 2,0 VaR95 0,0651; garis target 0,05; sigma bintang 1,53 kali.",
        caption: "Cara membaca: titik σ ×1,5 (VaR95 0,0490) hanya 0,0010 di bawah garis target 0,05 — «hampir menyentuh» bukanlah «aman». Garis vertikal putus-putus menandai σ* = 1,53× (σ* = 0,0301), pengali yang tepat mencapai target. Angka dari m9_canonical.json; rumus VaR95 = 1,6449 × σ + 0,0006 (μ = −0,0006).",
      },
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 12 · Jebakan",
      title: "Jebakan: scenario shopping — dan replay mentah-mentah",
      prose: [
        "Jebakan pertama: SCENARIO SHOPPING — memilih skenario karena hasilnya «nyaman». Bentuknya bermacam-macam, semuanya sopan: «kita pakai σ ×1,2 saja, karena ×1,5 terlalu pesimistis»; «kita replay 2025-04-08 saja, 2026-10-16 itu outlier»; «kita pakai VaR95 historis 0,0286 saja, bukan parametrik 0,0328 — kan lebih kecil». Setiap kalimat itu memilih SKENARIO agar angkanya terlihat baik — dan setiap kali itu terjadi, stress test berhenti menjadi alat ukur dan menjadi alat pembenaran. Ciri-cirinya: skenario dipilih SESUDAH hasilnya dilihat, dan alasannya adalah «hasilnya» («×1,5 memberi 0,0490, terlalu dekat dengan batas — pakai ×1,2 saja»), bukan «masuk akalnya» («vol ×1,2 tidak severe — lihat langkah 6»).",
        "Jebakan kedua: REPLAY MENTAH-MENTAH — mengulang skenario historis tanpa menyesuaikan posisi saat ini. «8 April terulang» berarti −7,43% HANYA bila posisimu hari ini sama dengan posisi pada 8 April 2025: equal-weight BBCA/KLBF/UNVR. Bila UNVR sudah dijual, bila bobot sudah berubah, bila ada saham keempat — maka −7,43% adalah jawaban untuk portofolio yang sudah tidak ada. Replay yang benar mengulang RETURN PER SAHAM hari itu (BBCA −0,0853; KLBF −0,0705; UNVR −0,0672) dan menerapkannya pada BOBOT SAAT INI — bukan mengulang return portofolionya (−0,0743) begitu saja. Selisih antara keduanya adalah selisih antara «sejarah sebagai data» dan «sejarah sebagai dongeng».",
        "Nilai: kedua jebakan ini bagus untuk dikenali karena keduanya TIDAK TERLIHAT di angka — stress test yang di-shopping tetap menghasilkan angka yang benar secara aritmetika (σ ×1,2 memang memberi VaR95 yang lebih kecil), dan replay mentah tetap menghasilkan Rp yang benar untuk portofolio yang salah. Yang salah bukan hitungannya — melainkan PILIHANNYA. Dan pilihan tidak bisa diperiksa mesin; ia hanya bisa diperiksa dengan pertanyaan «kenapa skenario ini, bukan yang lain?»",
        "Baik atau buruk: skenario yang dipilih sebelum melihat hasilnya bagus — ia adalah keputusan; skenario yang dipilih sesudah melihat hasilnya buruk — ia adalah pembenaran. Replay yang disesuaikan dengan posisi saat ini bagus; replay yang diulang mentah-mentah buruk — ia menjawab pertanyaan tentang portofolio kemarin.",
        "Mitigasi: dua ceklis sebelum stress test dipakai. Satu — TULIS SKENARIO DULU: daftar skenario (historis + hipotetis + reverse) ditulis dan disetujui SEBELUM satu angka pun dihitung; skenario yang ditambahkan sesudah melihat hasil ditandai «tambahan pasca-hasil» dan tidak boleh menggantikan skenario yang sudah disetujui. Dua — TERAPKAN PADA POSISI SAAT INI: tiap replay historis ditulis bersama bobot saat ini («return per saham 8 April 2025 × bobot hari ini») — bila bobotnya sama dengan 8 April 2025, tulis itu juga («bobot tidak berubah sejak 8 April 2025»).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «stress test yang hasilnya kecil berarti risikonya kecil»",
        type: "pitfall",
        body: "Yang benar: stress test yang hasilnya kecil bisa berarti risikonya kecil — ATAU skenarionya yang dipilih agar kecil. Bedakan keduanya dengan satu pertanyaan: «apakah skenario ini dipilih sebelum atau sesudah hasilnya dilihat?» Bila sesudah — itu scenario shopping, bukan pengukuran risiko.",
      },
    },
    {
      id: "mesin-pl",
      eyebrow: "Langkah 13 · Mesin P&L skenario",
      title: "Mesin P&L skenario: dari return ke rupiah — biaya, leverage, margin call",
      prose: [
        "Mini-case lesson ini berkata: posisi 2× bila 8 April terulang = 2 × Rp7.432.406 = Rp14.864.812 — «skala linear hanya berlaku tanpa gesekan likuiditas/biaya dan dengan posisi yang sama». Langkah ini menghitung gesekan itu. Ambil posisi yang sama: modal sendiri Rp100.000.000 + pinjaman Rp100.000.000 = posisi Rp200.000.000 [ilustrasi] — persis modal lesson ini (Rp100.000.000) yang digandakan dengan utang. Bila 8 April terulang, kerugian pasarnya Rp14.864.812 [kanonis] — 2 × Rp7.432.406. Itu baru baris pertama mesin P&L. Tiga baris berikutnya tidak pernah muncul di VaR: biaya transaksi, bunga pinjaman, dan — bila terpaksa menjual — haircut forced sale.",
        "Biaya transaksi 0,10% dari posisi = Rp200.000 [ilustrasi] — 1,35% dari kerugian pasar [turunan]. Bunga pinjaman 12% per tahun untuk 1 hari = Rp32.877 [ilustrasi] — 0,22% dari kerugian pasar [turunan]. Total tanpa forced sale: Rp15.097.689 [turunan] — hanya 1,57% di atas kerugian pasar [turunan]. Sejauh ini gesekan terlihat kecil — dan itulah yang berbahaya: ia membuatmu mengabaikan baris keempat. Bila kerugian itu memaksamu menjual (margin call atau kebutuhan likuiditas), haircut forced sale 1% dari posisi = Rp2.000.000 [ilustrasi] — 13,45% dari kerugian pasar [turunan]. Total dengan forced sale: Rp17.097.689 [turunan] — 15,02% di atas kerugian pasar [turunan]. Satu baris yang tidak ada di VaR menaikkan kerugian sekitar 15%.",
        "Leverage mengubah ARTI kerugian yang sama. Kerugian pasar Rp14.864.812 adalah 14,86% dari modal sendiri [turunan] — bukan 7,43% dari posisi. Ekuitas sesudah rugi pasar: Rp85.135.188 [turunan], rasio ekuitas terhadap nilai posisi 45,99% [turunan]. Bila broker menuntut maintenance margin 25% [ilustrasi], margin call tiba ketika nilai posisi menyusut ke Rp133.333.333 [turunan] — kerugian Rp66.666.667 [turunan], yaitu −33,33% dari posisi dan −66,67% dari modal sendiri [turunan]. Ekuitas yang tersisa Rp33.333.333 [turunan]. Perhatikan: VaR95 1-hari portofolio (0,0328) TIDAK PERNAH menyebut angka-angka ini — ia mengukur kerugian pasar pada posisi, bukan kerugian modal pada pemiliknya.",
        "Nilai: mesin P&L bagus karena ia mengubah skenario dari «berapa return-nya» menjadi «berapa rupiah yang hilang dari kantongku» — dan jawabannya tergantung pada tiga hal yang bukan return: berapa besar posisimu (leverage), berapa biayamu (transaksi + bunga), dan apakah kamu DIPAKSA menjual (likuiditas). Skenario yang sama, tiga pemilik dengan leverage berbeda, tiga kerugian berbeda.",
        "Baik atau buruk: P&L engine bagus bila tiap komponennya diberi label sumbernya — kerugian pasar dari data kanonis, biaya dan leverage dari asumsi [ilustrasi] yang ditulis eksplisit. Buruk bila komponen [ilustrasi] disajikan seolah-olah angka data — «biaya transaksi 0,10%» adalah asumsi, bukan fakta pasar; ganti asumsinya, ganti totalnya. Dan buruk bila mesinnya berhenti di kerugian pasar: skenario yang «lolos» di VaR bisa «gagal» di margin call.",
        "Mitigasi: untuk SETIAP skenario yang kamu laporkan, tulis empat baris — (1) kerugian pasar, (2) biaya (transaksi + bunga), (3) kerugian bila forced sale, (4) ekuitas sesudahnya dan jarak ke margin call. Bila baris (4) kosong, skenariomu belum selesai — ia baru setengah mesin.",
      ],
      tasks: [],
      formula: String.raw`\mathrm{P\&L}_{\mathrm{total}} = \underbrace{r \cdot V}_{\text{pasar}} + \underbrace{c \cdot V}_{\text{transaksi}} + \underbrace{i \cdot D \cdot \tfrac{1}{365}}_{\text{bunga}} + \underbrace{h \cdot V}_{\text{forced sale}}`,
      formulaNote: "V = nilai posisi (Rp200.000.000 [ilustrasi]), r = return skenario (−0,0743 pada 8 April), c = biaya transaksi 0,10% [ilustrasi], i = bunga pinjaman 12%/tahun [ilustrasi], D = pinjaman (Rp100.000.000 [ilustrasi]), h = haircut forced sale 1% [ilustrasi] — hanya bila terpaksa menjual. Dengan angka langkah ini: pasar Rp14.864.812 + transaksi Rp200.000 + bunga Rp32.877 = Rp15.097.689 [turunan]; tambah haircut Rp2.000.000 = Rp17.097.689 [turunan].",
      note: {
        title: "Yang tidak dihitung mesin ini",
        type: "risk",
        body: "Mesin ini menghitung SATU hari. Ia tidak menghitung: (1) slippage — harga yang kamu dapat saat menjual Rp200.000.000 dalam sehari bisa lebih buruk dari harga penutupan, terutama bila tiga saham itu jatuh bersamaan (korelasi high-vol 0,3752 vs low-vol 0,2775 [M4.5]); (2) bunga yang menumpuk bila posisi ditahan berhari-hari (Rp32.877 per hari — kecil per hari, tetapi skenario 10-hari M9.1 bukan 1 hari); (3) margin call BERANTAI — jangan campur dua angka ekuitas: Rp33.333.333 adalah ekuitas PADA SAAT margin call tiba (setelah kerugian Rp66.666.667), sedangkan ekuitas sesudah skenario 8 April + forced sale adalah Rp82.902.311 [turunan] (100.000.000 − 17.097.689). Margin call butuh kerugian kumulatif Rp66.666.667 — satu guncangan 8 April (Rp17.097.689) belum cukup; butuh guncangan berulang atau yang lebih dalam. Mesin P&L adalah lantai pertama, bukan gedungnya.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: stress test menjawab «bagaimana bila» — bukan «apa yang akan terjadi»",
      prose: [
        "Rangkuman: konvensi lesson ini — portofolio equal-weight BBCA/KLBF/UNVR atas SIMPLE daily returns (n=480), modal Rp100.000.000; «Rp» hanya untuk portofolio IDX. Skenario historis 2025-04-08 (guncangan tarif — BUKAN 2026-04-08, yang justru +3,39%): BBCA −0,0853 (Rp8.529.401), KLBF −0,0705 (Rp7.048.462), UNVR −0,0672 (Rp6.719.357), GSPC −0,0157 (Rp1.570.052), PORT −0,0743 (Rp7.432.406) — SIMPLE return; M4.5 menyebut hari yang sama sebagai BBCA LOG return −0,0892. 5 hari terburuk portofolio: 2026-10-16 −0,1398 (Rp13.983.464 — TERBURUK, hampir 2× guncangan tarif); 2025-04-08 −0,0743; 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042) — dan 2026-10-19 hanya 3 hari setelah hari terburuk. GSPC hari terburuknya (pada tanggal yang sama-sama hari bursa IDX) 2026-11-05 −0,0436, portofolio hari itu +0,0449 — IDX dan AS tidak selalu searah (beta BBCA vs GSPC hanya 0,1209 [m9_canonical]). Skenario hipotetis (VaR95 parametrik basis 0,0328; σ 0,0196; μ −0,0006): σ ×1,5 → VaR95 0,0490; σ ×2,0 → VaR95 0,0651; korelasi →1 → σ_port 0,0267 (rata-rata simpangan baku per saham: BBCA 0,0217, KLBF 0,0268, UNVR 0,0316) → VaR95 0,0445; korelasi SIMPLE-return saat ini BBCA–KLBF 0,3488, BBCA–UNVR 0,2774, KLBF–UNVR 0,2897 [M5] — bedakan dari korelasi LOG-return M4 (0,361/0,285/0,3001). Reverse stress: σ* = 0,0301 untuk VaR95 = 0,05 — yaitu 1,53× σ saat ini (rasio kanonis 1,5323); σ ×1,5 memberi 0,0490, hanya 0,0010 di bawah target. Stress M4.5 (rujukan, basis LOG return — basisnya 0,0324, bukan 0,0328): korelasi 0,95 → VaR95 0,0324 → 0,0431; diversification ratio 1,353 → 1,0169; korelasi high-vol 0,3752 vs low-vol 0,2775; maxDD PORT −0,4363, GSPC −0,1890. Batas: skenario yang tidak pernah terjadi ≠ tidak mungkin; skenario harus «severe but plausible» [kebijakan lesson ini] — pengali σ sampai 2,0, korelasi sampai 1; stress BUKAN prediksi — ia jawaban atas «bagaimana bila». Mini-case: posisi 2× bila 8 April terulang = 2 × Rp7.432.406 = Rp14.864.812 — skala linear hanya berlaku tanpa gesekan likuiditas/biaya dan dengan posisi yang sama. Lab 1: replay + 5 hari terburuk + selisih pembulatan Rp2.406 (return tampil −0,0743 memberi Rp7.430.000 vs kanonis Rp7.432.406) + loss_2x Rp14.864.812. Lab 2: reverse stress solver — σ* ≈ 0,0301 (solver memberi 0,0300 karena μ dibulatkan ke −0,0006; dalam toleransi 0,0005), rasio 1,5323. Mesin P&L (langkah 13): posisi 2× (modal Rp100.000.000 + pinjaman Rp100.000.000 [ilustrasi]) bila 8 April terulang — kerugian pasar Rp14.864.812 [kanonis], transaksi Rp200.000, bunga Rp32.877, total tanpa forced sale Rp15.097.689 [turunan], dengan forced sale Rp17.097.689 [turunan]; margin call 25% pada kerugian Rp66.666.667 (−66,67% modal sendiri) [turunan]. Jebakan: scenario shopping (memilih skenario karena hasilnya nyaman) dan replay mentah-mentah tanpa menyesuaikan posisi saat ini.",
        "Guided task di Colab — notebook mlf-m92-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data harga: replay 8 April 2025 per saham + kerugian Rp, 5 hari terburuk + GSPC hari terburuk, stress vol ×1,5/×2 dan korelasi →1, reverse stress solver (σ* = 0,0301), rujukan stress M4.5, dan mini-case posisi 2× (Rp14.864.812). Tautan Colab: https://colab.research.google.com/drive/1aVwqLBk5ZvnDzSzl00_asejXp2W6QTFW",
        "Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu VaR yang terlihat aman, tanyakan tiga hal — berapa rugi bila hari terburuk terulang, berapa besar guncangan yang menyentuh batasmu, dan apakah skenario itu dipilih sebelum atau sesudah hasilnya dilihat. Bila satu jawabannya kosong, angka VaR itu belum menjadi keputusan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Berapa SIMPLE return portofolio dan kerugian Rp-nya pada 8 April 2025 (modal Rp100.000.000)?",
          options: [
            { text: "PORT −0,0743 — rugi Rp7.432.406", why: "Benar: PORT = rata-rata equal-weight ketiga saham IDX = −0,0743; kerugian kanonis Rp7.432.406 dihitung dari return yang tidak dibulatkan (dari return yang ditampilkan −0,0743 diperoleh Rp7.430.000 — selisih Rp2.406 adalah artefak pembulatan).", correct: true },
            { text: "PORT −0,0853 — rugi Rp8.529.401", why: "Salah: −0,0853 / Rp8.529.401 adalah BBCA, bukan portofolio. Portofolio adalah rata-rata ketiga saham: −0,0743." },
            { text: "PORT −0,0157 — rugi Rp1.570.052", why: "Salah: −0,0157 / Rp1.570.052 adalah GSPC hari itu — guncangan ini berpusat di IDX, bukan di AS." },
            { text: "PORT −0,1398 — rugi Rp13.983.464", why: "Salah: −0,1398 / Rp13.983.464 adalah hari TERBURUK portofolio (2026-10-16), bukan 8 April 2025." },
          ],
        },
        {
          q: "Hari terburuk portofolio dalam 480 hari adalah…",
          options: [
            { text: "2025-04-08 (guncangan tarif), −7,43%", why: "Salah: 8 April 2025 adalah hari terburuk KEDUA (−0,0743). Hari terburuknya −0,1398 — hampir dua kali lipat." },
            { text: "2026-10-16, −13,98% (Rp13.983.464)", why: "Benar: 2026-10-16 −0,1398 adalah hari terburuk portofolio — hampir dua kali guncangan tarif. Siapa pun yang hanya menyiapkan diri untuk «mengulang 8 April» kekurangan modal hampir dua kali lipat.", correct: true },
            { text: "2026-04-24, −5,22%", why: "Salah: 2026-04-24 −0,0522 adalah hari terburuk KEEMPAT — jauh di bawah −0,1398." },
            { text: "2025-02-28, −7,28%", why: "Salah: 2025-02-28 −0,0728 adalah hari terburuk KETIGA — sedikit lebih ringan daripada guncangan tarif." },
          ],
        },
        {
          q: "BBCA 8 April 2025: SIMPLE return −0,0853, LOG return −0,0892 [M4.5]. Pernyataan mana yang benar?",
          options: [
            { text: "Salah satu dari keduanya pasti salah — satu hari tidak bisa punya dua return", why: "Salah: satu hari bisa punya dua angka return — simple dan log adalah dua penggaris yang berbeda untuk hari yang sama." },
            { text: "Keduanya benar untuk konvensinya; log return lebih negatif daripada simple return saat return negatif", why: "Benar: log = ln(1 + simple) = ln(1 − 0,0853) = ln(0,9147) = −0,0892. Jangan bandingkan keduanya seolah satu mengoreksi yang lain — dan labeli konvensinya di tiap pemakaian.", correct: true },
            { text: "−0,0892 adalah SIMPLE return, −0,0853 adalah LOG return", why: "Terbalik: −0,0853 adalah SIMPLE, −0,0892 adalah LOG [M4.5]. Untuk return negatif, log selalu lebih negatif daripada simple." },
            { text: "Bedanya karena datanya berbeda — M4.5 memakai data yang lain", why: "Salah: datanya SAMA (harga BBCA 8 April 2025) — bedanya hanya konvensi pengukuran, simple vs log." },
          ],
        },
        {
          q: "VaR95 parametrik basis 0,0328 (σ = 0,0196; μ = −0,0006). Bila σ dikali 1,5, VaR95 menjadi…",
          options: [
            { text: "0,0490 — hanya 0,0010 di bawah target 0,05", why: "Benar: 1,6449 × 0,0294 + 0,0006 = 0,0490. Pengali 1,5 «hampir» menyentuh batas 0,05 — dan «hampir» bukanlah «aman».", correct: true },
            { text: "0,0651", why: "Salah: 0,0651 adalah VaR95 pada σ ×2,0 (1,6449 × 0,0392 + 0,0006) — bukan ×1,5." },
            { text: "0,0445", why: "Salah: 0,0445 adalah VaR95 pada korelasi →1 (σ_port 0,0267) — bukan pada σ ×1,5." },
            { text: "Tetap 0,0328 — VaR95 tidak bergantung pada σ", why: "Salah: VaR95 parametrik hampir sebanding dengan σ — menaikkan σ 50% menaikkan VaR95 dari 0,0328 menjadi 0,0490." },
          ],
        },
        {
          q: "Bila korelasi antar-saham menuju 1 (semua saham bergerak sempurna searah), σ portofolio dan VaR95 menjadi…",
          options: [
            { text: "σ_port 0,0267, VaR95 0,0445", why: "Benar: σ_port = rata-rata simpangan baku per saham = (0,0217 + 0,0268 + 0,0316) / 3 = 0,0267; VaR95 = 1,6449 × 0,0267 + 0,0006 = 0,0445.", correct: true },
            { text: "σ_port 0,0316, VaR95 0,0526", why: "Salah: 0,0316 adalah simpangan baku UNVR saja (saham paling volatil) — portofolio equal-weight yang bergerak searah merata-ratakan volatilitasnya, bukan mengambil yang terbesar: (0,0217 + 0,0268 + 0,0316) / 3 = 0,0267." },
            { text: "σ_port tetap 0,0196 — korelasi tidak memengaruhi σ portofolio", why: "Salah: korelasi adalah bagian dari rumus σ portofolio — menaikkan korelasi menaikkan σ_port dari 0,0196 menjadi 0,0267, karena manfaat diversifikasi menghilang." },
            { text: "σ_port 0,0392, VaR95 0,0651", why: "Salah: 0,0392 / 0,0651 adalah stress σ ×2,0 — bukan stress korelasi. Korelasi →1 lebih ringan (0,0445) daripada σ ×1,5 (0,0490)." },
          ],
        },
        {
          q: "Reverse stress: berapa σ* yang membuat VaR95 parametrik tepat 0,05?",
          options: [
            { text: "σ* = 0,0301 — yaitu 1,53× σ saat ini", why: "Benar: σ* = (0,05 − 0,000558) / 1,6449 = 0,0301; rasio kanonis 1,5323 → 1,53×. Volatilitas harus naik 53% sebelum VaR95 menyentuh 5%.", correct: true },
            { text: "σ* = 0,0294 — yaitu 1,5× σ saat ini", why: "Salah: σ ×1,5 = 0,0294 memberi VaR95 0,0490 — hanya 0,0010 di bawah target, BELUM menyentuhnya. Yang tepat menyentuh adalah 1,53×." },
            { text: "σ* = 0,0392 — yaitu 2× σ saat ini", why: "Salah: σ ×2,0 = 0,0392 memberi VaR95 0,0651 — sudah jauh MELAMPAUI target 0,05, bukan tepat menyentuhnya." },
            { text: "σ* = 0,0196 — σ saat ini sudah membuat VaR95 = 0,05", why: "Salah: σ saat ini 0,0196 memberi VaR95 0,0328 — jauh di bawah 0,05. σ harus naik 53% dulu." },
          ],
        },
        {
          q: "Di M4.5, korelasi antar-saham dinaikkan menjadi 0,95. Apa yang terjadi pada VaR95 dan diversification ratio?",
          options: [
            { text: "VaR95 0,0324 → 0,0431; diversification ratio 1,353 → 1,0169", why: "Benar [M4.5, basis LOG return — basisnya 0,0324, bukan 0,0328 SIMPLE lesson ini]. Diversifikasi hampir menguap: 1,0169 berarti portofolio hanya 1,69% lebih baik daripada rata-rata saham penyusunnya.", correct: true },
            { text: "VaR95 0,0328 → 0,0445; diversification ratio 1,353 → 1,0169", why: "Salah: 0,0328 → 0,0445 adalah stress korelasi →1 lesson ini (basis SIMPLE) — bukan M4.5. Angka M4.5 (basis LOG) adalah 0,0324 → 0,0431. Jangan campur basisnya." },
            { text: "VaR95 turun menjadi 0,0324; diversification ratio naik menjadi 1,353", why: "Terbalik: korelasi yang NAIK membuat VaR NAIK (0,0324 → 0,0431) dan diversification ratio TURUN (1,353 → 1,0169) — diversifikasi melemah, bukan menguat." },
            { text: "VaR95 tetap 0,0324 — korelasi tidak memengaruhi VaR", why: "Salah: korelasi adalah penentu σ portofolio — menaikkannya ke 0,95 menaikkan VaR95 sekitar sepertiga, dari 0,0324 menjadi 0,0431." },
          ],
        },
        {
          q: "Mini-case: komite bertanya «berapa rugi bila 8 April 2025 terulang dengan posisi 2×?» Jawaban yang benar adalah…",
          options: [
            { text: "Rp14.864.812 = 2 × Rp7.432.406 — dengan catatan skala linear hanya berlaku tanpa gesekan dan dengan posisi yang sama", why: "Benar: 2 × 7.432.406 = 14.864.812 — dari nilai kanonis. Dan jawaban yang lengkap menyertakan batasnya: likuiditas, biaya/leverage, dan komposisi posisi yang sama dengan 8 April 2025.", correct: true },
            { text: "Rp14.860.000 = 2 × Rp7.430.000", why: "Salah Rp4.812: Rp7.430.000 adalah kerugian dari return yang DITAMPILKAN (−0,0743) — nilai kanonis dari data adalah Rp7.432.406, jadi 2× yang benar adalah Rp14.864.812." },
            { text: "Rp7.432.406 — sama seperti posisi 1×, karena return-nya sama", why: "Salah: return-nya sama (−7,43%), tetapi MODALNYA dua kali lipat (Rp200jt) — kerugiannya 2 × Rp7.432.406 = Rp14.864.812." },
            { text: "Rp27.966.928 = 2 × Rp13.983.464", why: "Salah: Rp13.983.464 adalah kerugian hari TERBURUK (2026-10-16) — komite bertanya tentang 8 April 2025, bukan tentang hari terburuk. Jawaban untuk 8 April adalah 2 × Rp7.432.406 = Rp14.864.812." },
          ],
        },
        {
          q: "GSPC hari terburuknya 2026-11-05 (−0,0436), tetapi portofolio hari itu justru +0,0449. Apa artinya?",
          options: [
            { text: "IDX dan AS selalu bergerak berlawanan — bila GSPC jatuh, PORT pasti naik", why: "Salah: «tidak selalu searah» bukan «selalu berlawanan». Pada 8 April 2025 keduanya jatuh bersamaan (GSPC −1,57%, PORT −7,43%) — hanya tidak sedalam dan tidak selalu di hari yang sama." },
            { text: "IDX dan AS tidak selalu searah — beta BBCA vs GSPC hanya 0,1209 [m9_canonical]", why: "Benar: beta 0,1209 berarti BBCA rata-rata hanya bergerak 0,1209× gerakan GSPC — keterkaitan yang lemah. Skenario AS bukan proksi skenario IDX; stress test IDX harus memakai hari IDX.", correct: true },
            { text: "GSPC −4,36% pasti membuat PORT negatif — angka +0,0449 pasti salah hitung", why: "Salah: +0,0449 adalah angka kanonis dari data (tanggal yang sama-sama hari bursa IDX). Beta yang kecil (0,1209) menjelaskan kenapa PORT bisa naik saat GSPC jatuh — bukan kesalahan hitung." },
            { text: "PORT +4,49% berarti diversifikasi IDX–AS bekerja sempurna", why: "Salah: satu hari bukan bukti diversifikasi bekerja — diversifikasi diukur dari korelasi jangka panjang, dan korelasi justru NAIK saat stress (high-vol 0,3752 vs low-vol 0,2775 [M4.5])." },
          ],
        },
        {
          q: "Posisi 2× (modal sendiri Rp100.000.000 + pinjaman Rp100.000.000 = Rp200.000.000 [ilustrasi]) menghadapi ulangan 8 April 2025. Kerugian pasar Rp14.864.812 [kanonis]. Biaya transaksi 0,10% = Rp200.000, bunga 1 hari 12%/tahun = Rp32.877, haircut forced sale 1% = Rp2.000.000 [ilustrasi]. Berapa total kerugian BILA terpaksa menjual — dan apa yang terjadi pada modal sendiri di margin call 25%?",
          options: [
            { text: "Total Rp17.097.689 [turunan] — pasar Rp14.864.812 + transaksi Rp200.000 + bunga Rp32.877 + haircut Rp2.000.000; margin call 25% tiba saat posisi menyusut ke Rp133.333.333 [turunan] — kerugian Rp66.666.667, yaitu −66,67% dari modal sendiri [turunan]", why: "Benar: gesekan menaikkan kerugian 15,02% di atas kerugian pasar [turunan]; dan leverage mengubah arti kerugian — −33,33% dari posisi berarti −66,67% dari modal sendiri [turunan]. VaR tidak pernah menyebut angka-angka ini.", correct: true },
            { text: "Rp14.864.812 — kerugian pasar sudah mencakup semuanya", why: "Salah: kerugian pasar HANYA baris pertama mesin P&L — tanpa forced sale saja totalnya Rp15.097.689 [turunan] (tambah transaksi Rp200.000 + bunga Rp32.877); dengan forced sale Rp17.097.689 [turunan].", correct: false },
            { text: "Rp15.097.689 — itu sudah termasuk haircut", why: "Salah: Rp15.097.689 [turunan] adalah total TANPA forced sale; haircut 1% = Rp2.000.000 [ilustrasi] belum masuk — total dengan forced sale Rp17.097.689 [turunan].", correct: false },
            { text: "Margin call 25% berarti kerugian maksimal 25% dari modal sendiri", why: "Salah: 25% adalah rasio ekuitas TERHADAP NILAI POSISI, bukan batas kerugian modal — margin call tiba saat ekuitas tersisa Rp33.333.333 [turunan], yaitu SETELAH modal sendiri hilang Rp66.666.667 (−66,67%) [turunan].", correct: false },
          ],
        },
      ],
      summary: [
        "Konvensi lesson ini: portofolio equal-weight BBCA/KLBF/UNVR atas SIMPLE daily returns (n=480); modal Rp100.000.000; «Rp» hanya untuk portofolio IDX; setiap return dilabeli simple atau log.",
        "Skenario historis 2025-04-08 (guncangan tarif — BUKAN 2026-04-08, yang justru +3,39%): BBCA −0,0853 (Rp8.529.401), KLBF −0,0705 (Rp7.048.462), UNVR −0,0672 (Rp6.719.357), GSPC −0,0157 (Rp1.570.052), PORT −0,0743 (Rp7.432.406). M4.5 menyebut hari yang sama sebagai BBCA LOG return −0,0892.",
        "5 hari terburuk portofolio: 2026-10-16 −0,1398 (Rp13.983.464 — TERBURUK, hampir 2× guncangan tarif); 2025-04-08 −0,0743; 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042).",
        "GSPC hari terburuk (tanggal yang sama-sama hari bursa IDX): 2026-11-05 −0,0436, portofolio hari itu +0,0449 — IDX dan AS tidak selalu searah (beta BBCA vs GSPC 0,1209 [m9_canonical]).",
        "Skenario hipotetis (VaR95 parametrik basis 0,0328; σ 0,0196; μ −0,0006): σ ×1,5 → VaR95 0,0490; σ ×2,0 → VaR95 0,0651; korelasi →1 → σ_port 0,0267 → VaR95 0,0445. Korelasi SIMPLE-return [M5]: 0,3488/0,2774/0,2897 — bedakan dari korelasi LOG-return M4 (0,361/0,285/0,3001).",
        "Reverse stress: σ* = 0,0301 untuk VaR95 = 0,05 — yaitu 1,53× σ saat ini (rasio kanonis 1,5323); σ ×1,5 memberi 0,0490, hanya 0,0010 di bawah target — «hampir menyentuh» bukanlah «aman».",
        "Stress M4.5 (rujukan, basis LOG return — basisnya 0,0324): korelasi 0,95 → VaR95 0,0324 → 0,0431; diversification ratio 1,353 → 1,0169; korelasi high-vol 0,3752 vs low-vol 0,2775; maxDD PORT −0,4363, GSPC −0,1890.",
        "Batas: skenario yang tidak pernah terjadi ≠ tidak mungkin; skenario harus «severe but plausible» [kebijakan lesson ini] — pengali σ sampai 2,0, korelasi sampai 1; stress BUKAN prediksi — ia jawaban atas «bagaimana bila».",
        "Mini-case: posisi 2× bila 8 April terulang = 2 × Rp7.432.406 = Rp14.864.812 — skala linear hanya berlaku tanpa gesekan likuiditas/biaya dan dengan posisi yang sama.",
        "Lab 1: replay + 5 hari terburuk + selisih pembulatan Rp2.406 + loss_2x Rp14.864.812. Lab 2: reverse stress solver — σ* ≈ 0,0301 (solver memberi 0,0300 karena μ dibulatkan; dalam toleransi 0,0005), rasio 1,5323.",
        "Jebakan: scenario shopping (memilih skenario karena hasilnya nyaman) dan replay mentah-mentah tanpa menyesuaikan posisi saat ini — tulis skenario dulu, terapkan pada bobot saat ini.",
        "Mesin P&L (langkah 13) [ilustrasi]: posisi 2× bila 8 April terulang — pasar Rp14.864.812 [kanonis] + transaksi Rp200.000 + bunga Rp32.877 = Rp15.097.689 [turunan]; + haircut forced sale Rp2.000.000 = Rp17.097.689 [turunan] (15,02% di atas kerugian pasar).",
        "Leverage: kerugian pasar 14,86% dari modal sendiri [turunan]; margin call 25% tiba pada kerugian Rp66.666.667 — −66,67% modal sendiri, ekuitas tersisa Rp33.333.333 [turunan].",
      ],
      next: { label: "Lanjut: MLF-M9.3 — Backtesting & Walk-Forward", href: "/v2/learn/mlf-m93-backtesting-walk-forward" },
    },
  ],
};
