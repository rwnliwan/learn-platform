import type { V2Lesson } from "../lib/types";

export const pma6c: V2Lesson = {
  slug: "pm-a6c-analisis-industri",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A6C Equity: Analisis Industri & Keunggulan Kompetitif",
  estMinutes: 60,
  steps: [
    {
      id: "porter-lima-kekuatan",
      eyebrow: "Langkah 1 · Porter Five Forces",
      title: "Lima kekuatan yang memeras margin industri",
      prose: [
        "Valuasi saham di PM-A6B mengasumsikan growth dan margin tertentu. Dari mana angka itu berasal? Dari industri tempat perusahaan beroperasi. Kerangka Porter five forces menjawab pertanyaan mendasar: seberapa besar porsi nilai yang bisa dipertahankan perusahaan, dan seberapa besar yang diperas oleh pihak lain. Lima kekuatan itu adalah persaingan antar pemain lama, ancaman pendatang baru, ancaman produk pengganti, daya tawar pembeli, dan daya tawar pemasok.",
        "Terapkan ke industri ilustratif: kopi siap minum kemasan di sebuah pasar fiktif. Persaingan antar pemain lama: sengit, puluhan merek berebut rak minimarket dengan harga nyaris sama. Ancaman pendatang baru: sedang, modal pabrik tidak kecil tetapi merek baru bisa masuk lewat kanal online. Ancaman produk pengganti: tinggi, teh kemasan, minuman energi, dan kopi seduh sendiri semuanya bersaing untuk tenggorokan yang sama. Daya tawar pembeli: tinggi, minimarket besar menekan harga dan meminta listing fee. Daya tawar pemasok: sedang, petani kopi kecil-kecil tetapi harga biji kopi dunia berfluktuasi.",
        "Vonis Porter untuk industri ini: struktur yang tidak menarik. Margin tipis karena pembeli kuat, pengganti berlimpah, dan persaingan harga terus-menerus. Itu bukan berarti tidak ada perusahaan yang bisa untung: perusahaan dengan merek terkuat atau biaya terendah masih bisa menang. Tetapi analis yang memproyeksikan margin 20 persen selamanya di industri seperti ini sedang melawan struktur, bukan mengikutinya. Porter memberi tahu ke mana arah angin bertiup sebelum kamu membangun proyeksi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menilai industri dari pertumbuhannya saja. Industri yang tumbuh cepat tetapi strukturnya buruk, seperti kopi kemasan di contoh ini, bisa menghancurkan modal lebih cepat daripada industri lambat yang terstruktur baik.",
      },
      quiz: [
        {
          q: "Industri kopi kemasan fiktif: pembeli minimarket besar menekan harga, pengganti berlimpah, persaingan harga sengit. Vonis Porter?",
          options: [
            { text: "Industri menarik — pertumbuhannya cepat", why: "Salah: growth cepat tidak menyelamatkan margin bila lima kekuatan memeras dari semua sisi." },
            { text: "Struktur tidak menarik — margin akan tipis; hanya merek terkuat atau biaya terendah yang menang", why: "Benar: pembeli kuat, pengganti banyak, dan persaingan sengit menekan profitabilitas seluruh industri.", correct: true },
            { text: "Industri menarik — pendatang baru sulit masuk", why: "Salah: hambatan masuk hanya sedang; merek baru bisa masuk lewat kanal online." },
            { text: "Tidak bisa dinilai tanpa laporan keuangan", why: "Salah: Porter menilai struktur industri, bukan satu perusahaan." },
          ],
        },
      ],
      reference: "Lima kekuatan: persaingan lama, pendatang baru, pengganti, tawar pembeli, tawar pemasok. Struktur menentukan ke mana margin mengalir.",
    },
    {
      id: "siklus-hidup-industri",
      eyebrow: "Langkah 2 · Siklus Hidup Industri",
      title: "Strategi yang benar tergantung umur industrinya",
      prose: [
        "Industri hidup seperti organisme: embrionik, tumbuh, matang, lalu menurun. Di fase embrionik, pasarnya kecil dan belum terbukti; yang menang adalah yang menemukan product-market fit, bukan yang paling efisien. Di fase tumbuh, permintaan meledak; yang menang adalah yang menambah kapasitas paling cepat tanpa merusak kualitas. Di fase matang, growth melambat dan persaingan bergeser ke pangsa pasar dan efisiensi; yang menang adalah yang berbiaya rendah atau berdiferensiasi kuat. Di fase menurun, permintaan menyusut; yang menang adalah yang mengelola exit dengan disiplin atau mengonsolidasi sisa pasar.",
        "Kesalahan klasik analis adalah memakai strategi satu fase untuk industri di fase lain. Memproyeksikan growth 30 persen selamanya untuk industri matang sama kelirunya dengan mengharapkan dividen besar dari industri embrionik yang masih membakar kas. Tanda fase matang: growth penjualan mendekati growth ekonomi, konsolidasi mulai terjadi, dan perang harga menjadi berita rutin. Tanda fase menurun: volume menyusut bertahun-tahun, kapasitas berlebih kronis, dan pemain keluar satu per satu.",
        "Hubungkan dengan valuasi: fase industri menentukan growth dan margin yang wajar dipakai di DDM dan FCFE. Perusahaan di industri tumbuh boleh memakai growth tinggi di fase awal model multi-stage; perusahaan di industri matang harus memakai growth mendekati ekonomi secara keseluruhan. Bila proyeksimu bertentangan dengan fase industri, proyeksimulah yang kemungkinan besar salah, bukan industrinya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap industri menurun tidak bisa menghasilkan uang. Perusahaan terakhir yang bertahan di industri menurun sering sangat menguntungkan: pesaing pergi, harga stabil, dan tidak ada lagi yang berinvestasi besar.",
      },
      quiz: [
        {
          q: "Industri matang: growth penjualan mendekati growth ekonomi, konsolidasi berjalan, perang harga rutin. Strategi dan proyeksi yang konsisten?",
          options: [
            { text: "Proyeksikan growth 30 persen selamanya dan ekspansi agresif", why: "Salah: itu strategi fase tumbuh; di fase matang growth tinggi tidak bertahan." },
            { text: "Fokus biaya rendah atau diferensiasi; growth proyeksi mendekati ekonomi secara keseluruhan", why: "Benar: di fase matang, kemenangan datang dari efisiensi dan posisi, bukan dari pasar yang membesar.", correct: true },
            { text: "Bagikan dividen besar sambil tetap membakar kas untuk ekspansi", why: "Salah: keduanya sekaligus tidak konsisten; pilih sesuai fase." },
            { text: "Keluar dari industri secepatnya", why: "Salah: industri matang masih bisa sangat menguntungkan bagi pemain efisien." },
          ],
        },
      ],
      reference: "Embrionik cari fit; tumbuh tambah kapasitas; matang rebut pangsa dan efisiensi; menurun kelola exit atau konsolidasi.",
    },
    {
      id: "moat-dan-ujinya",
      eyebrow: "Langkah 3 · Moat",
      title: "Narrow, wide, atau tidak ada: menguji klaim keunggulan",
      prose: [
        "Moat adalah keunggulan kompetitif yang bertahan lama. Klasifikasi praktisnya tiga tingkat: wide moat, keunggulan yang diperkirakan bertahan lebih dari 20 tahun; narrow moat, keunggulan yang bertahan sekitar 10 tahun; dan no moat, tidak ada keunggulan yang bisa dipertahankan. Sumber moat bermacam-macam: efek jaringan, biaya beralih yang tinggi, aset tak berwujud seperti merek dan paten, keunggulan biaya, dan skala efisien di pasar yang sempit.",
        "Klaim moat harus diuji dari laporan keuangan, bukan dari presentasi manajemen. Tiga uji kuantitatif: pertama, ROE yang konsisten di atas cost of equity selama bertahun-tahun, bukan satu tahun bagus. Kedua, margin yang stabil atau membaik saat industri tertekan, bukan margin yang ikut runtuh bersama pesaing. Ketiga, ROIC yang bertahan di atas WACC, karena itulah definisi penciptaan nilai yang sesungguhnya. Perusahaan tanpa moat yang tumbuh cepat justru menghancurkan nilai: setiap rupiah yang diinvestasikan menghasilkan kurang dari biayanya.",
        "Uji kualitatifnya sama penting: apakah pelanggan benar-benar terkunci atau hanya malas pindah sementara? Apakah merek itu memungkinkan harga premium, atau hanya dikenal tetapi dibeli karena diskon? Apakah paten itu melindungi produk inti atau sekadar pagar di sekeliling produk yang sudah usang? Rujuk silang ke FSA Lab untuk membedah laporan keuangan sampai ke sumbernya; lesson ini memakai angka laporan keuangan hanya sebagai alat uji klaim moat, bukan sebagai bedah laporan lengkap.",
      ],
      formula: String.raw`\text{Spread moat} = ROE - r \quad ; \quad \text{Nilai tercipta bila } ROIC > WACC`,
      formulaNote: "ROE adalah return on equity; r adalah required return ekuitas; ROIC adalah return on invested capital; WACC adalah biaya modal rata-rata tertimbang. Interpretasi: spread positif yang bertahan bertahun-tahun adalah jejak moat di laporan keuangan; spread negatif yang persisten berarti perusahaan menghancurkan nilai saat tumbuh. Contoh angka di lab: ROE rata-rata 13,55 persen dikurangi r 10 persen sama dengan spread 3,55 poin.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Moat bisa terkikis pelan-pelan: teknologi baru, regulasi, atau perubahan selera. Uji moat bukan sekali seumur hidup; ulangi tiap tahun dengan angka terbaru.",
      },
      quiz: [
        {
          q: "Perusahaan fiktif mengklaim wide moat, tetapi ROE-nya 6 persen selama 5 tahun sementara required return 10 persen. Penilaianmu?",
          options: [
            { text: "Klaim diterima — mereknya terkenal", why: "Salah: merek yang tidak menghasilkan return di atas biaya modal bukan moat ekonomi." },
            { text: "Klaim ditolak — ROE di bawah biaya modal 5 tahun berturut-turut berarti tidak ada keunggulan yang menciptakan nilai", why: "Benar: moat harus terlihat di angka; spread negatif yang persisten membantah klaim.", correct: true },
            { text: "Klaim diterima — 5 tahun terlalu pendek untuk menilai", why: "Salah: lima tahun spread negatif adalah bukti yang cukup kuat." },
            { text: "Tidak bisa dinilai tanpa harga saham", why: "Salah: moat dinilai dari return atas modal, bukan dari harga pasar." },
          ],
        },
      ],
      reference: "Wide lebih dari 20 tahun; narrow sekitar 10 tahun; none berarti tidak ada. Uji: ROE di atas biaya modal, margin bertahan, ROIC di atas WACC.",
    },
    {
      id: "lab-uji-moat",
      eyebrow: "Langkah 4 · Lab: Uji Moat",
      title: "Menghitung spread ROE dari tiga tahun laporan fiktif",
      prose: [
        "PT Kopi Nusantara Fiktif (ilustratif) mengklaim punya moat dari mereknya. Uji klaim itu dengan tiga tahun angka fiktif. Laba bersih: Rp120 miliar, Rp150 miliar, Rp180 miliar. Ekuitas: Rp1.000 miliar, Rp1.100 miliar, Rp1.200 miliar. Pendapatan: Rp1.000 miliar, Rp1.200 miliar, Rp1.400 miliar. Required return ekuitas 10 persen.",
        "Hitung ROE tiap tahun: 120 dibagi 1.000 sama dengan 12,0 persen; 150 dibagi 1.100 sama dengan 13,64 persen; 180 dibagi 1.200 sama dengan 15,0 persen. Rata-rata ROE tiga tahun sekitar 13,55 persen. Spread terhadap required return 10 persen sekitar 3,55 poin, positif dan membaik. Margin bersih: 12,0 persen, 12,5 persen, lalu 12,86 persen, stabil dan sedikit naik. Dua uji kuantitatif lolos: return di atas biaya modal dan margin tidak tergerus.",
        "Vonis sementara: klaim moat didukung angka, setidaknya narrow moat, tetapi tiga tahun belum cukup untuk wide moat. Uji lanjutannya: apakah margin bertahan saat harga biji kopi naik? Apakah pelanggan tetap membeli saat harga jual naik 10 persen? Apakah ROE bertahan bila pesaing baru masuk? Moat yang benar diuji dalam tekanan, bukan dalam cuaca cerah.",
      ],
      formula: String.raw`ROE_t = \frac{NI_t}{\text{Ekuitas}_t} \quad ; \quad \text{Spread} = \overline{ROE} - r`,
      formulaNote: "Semua angka ilustratif dalam Rp miliar: laba bersih 120, 150, 180; ekuitas 1.000, 1.100, 1.200; r 10 persen. Interpretasi: ROE rata-rata di atas required return berarti perusahaan menciptakan nilai; tren ROE dan margin yang naik memperkuat klaim moat. Contoh angka: ROE 12,0 persen, 13,64 persen, 15,0 persen; rata-rata 13,55 persen; spread 3,55 poin.",
      tasks: [
        { id: "t1", text: "Hitung `avg_roe` (rata-rata ROE tiga tahun, dalam persen)" },
        { id: "t2", text: "Hitung `spread` (avg_roe dikurangi required return 10%), cetak keduanya 1 desimal" },
      ],
      expected: "avg_roe=13.5  spread=3.5",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai ekuitas akhir tahun saja tanpa memeriksa apakah ekuitas rata-rata lebih tepat, atau menilai moat dari satu tahun ROE bagus. Moat butuh konsistensi bertahun-tahun.",
      },
      hints: [
        "ROE tiap tahun = laba bersih dibagi ekuitas dikali 100.",
        "Rata-rata dari 12,0, 13,64, dan 15,0 adalah sekitar 13,55.",
        "roes = [n / e * 100 for n, e in zip(ni, eq)]\navg_roe = sum(roes) / len(roes)\nspread = avg_roe - wacc",
      ],
      code: {
        starter: `ni = [120, 150, 180]\neq = [1000, 1100, 1200]\nwacc = 10.0\n\n# TULIS KODEMU\navg_roe = \nspread = \n\nprint(f"avg_roe={avg_roe:.1f}  spread={spread:.1f}")`,
        lockLines: 3,
        solution: `ni = [120, 150, 180]\neq = [1000, 1100, 1200]\nwacc = 10.0\n\n# TULIS KODEMU\nroes = [n / e * 100 for n, e in zip(ni, eq)]\navg_roe = sum(roes) / len(roes)\nspread = avg_roe - wacc\n\nprint(f"avg_roe={avg_roe:.1f}  spread={spread:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "avg_roe", value: 13.55, tol: 0.1, label: "`avg_roe` sekitar 13.5", msg: "ROE 12,0, 13,64, dan 15,0 dirata-rata sama dengan 13,55." },
          { kind: "equal", task: "t2", name: "spread", value: 3.55, tol: 0.1, label: "`spread` sekitar 3.5", msg: "13,55 dikurangi 10 sama dengan 3,55 poin di atas required return." },
          { kind: "stdout_matches", task: "t2", pattern: "avg_roe=13\\.5\\s+spread=3\\.5", label: "`print` menampilkan keduanya", msg: "Format: avg_roe=...  spread=... ." },
        ],
      },
      reference: "Moat diuji angka: ROE rata-rata di atas required return, margin stabil, tren membaik. Tiga tahun dukung narrow, bukan wide.",
    },
    {
      id: "industri-ke-proyeksi",
      eyebrow: "Langkah 5 · Dari Industri ke Proyeksi",
      title: "Rantai logis, bukan tebak-tebakan",
      prose: [
        "Analisis perusahaan yang baik adalah rantai logis dari industri ke proyeksi. Setiap mata rantai harus bisa dipertahankan. Rantai itu: ukuran pasar dan growth-nya, pangsa pasar yang realistis, pendapatan dari pangsa itu, margin dari struktur Porter dan moat, laba dari pendapatan dan margin, lalu arus kas dan valuasi dari laba. Bila satu mata rantai lemah, seluruh proyeksi ikut lemah.",
        "Contoh ilustratif: pasar kopi siap minum fiktif Rp10.000 miliar dan tumbuh 8 persen per tahun. PT Kopi Nusantara Fiktif menargetkan pangsa 5 persen, realistis untuk merek nomor tiga. Pendapatan proyeksi: 5 persen dari 10.000 sama dengan Rp500 miliar. Margin bersih 12 persen, konsisten dengan margin historis 12,0 sampai 12,86 persen dan moat narrow-nya. Laba proyeksi: 12 persen dari 500 sama dengan Rp60 miliar. Dari sini analis lanjut ke FCFE dan valuasi seperti di PM-A6B.",
        "Cara mengaudit rantai ini: tanyakan tiap mata rantai secara terpisah. Apakah pasar benar-benar tumbuh 8 persen, atau itu angka tahun terbaik yang dipilih? Apakah pangsa 5 persen masuk akal bila pemimpin pasar punya 40 persen dan distribusinya terkunci? Apakah margin 12 persen bertahan bila harga biji kopi naik? Analis yang baik menyerang proyeksinya sendiri di mata rantai terlemah sebelum orang lain melakukannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memulai proyeksi dari target laba yang diinginkan, lalu menyesuaikan asumsi pasar dan pangsa sampai angkanya cocok. Itu bukan analisis, itu pembenaran. Mulai dari pasar, bukan dari target.",
      },
      quiz: [
        {
          q: "Rantai proyeksi: pasar fiktif Rp10.000 miliar, pangsa 5 persen, margin 12 persen. Laba proyeksi dan mata rantai yang paling patut diuji?",
          options: [
            { text: "Rp60 miliar; uji pangsa 5 persen — apakah realistis melawan pemimpin 40 persen dengan distribusi terkunci", why: "Benar: 5 persen dari 10.000 sama dengan 500; 12 persen dari 500 sama dengan 60. Pangsa adalah asumsi paling rapuh.", correct: true },
            { text: "Rp500 miliar; uji margin saja", why: "Salah: 500 adalah pendapatan, bukan laba; dan pangsa sama rapuhnya dengan margin." },
            { text: "Rp120 miliar; uji ukuran pasar saja", why: "Salah: hitung ulang 5 persen dari 10.000 lalu 12 persen dari hasilnya." },
            { text: "Rp60 miliar; tidak ada yang perlu diuji bila angkanya bulat", why: "Salah: angka bulat bukan bukti; tiap mata rantai harus diuji." },
          ],
        },
      ],
      reference: "Pasar, pangsa, pendapatan, margin, laba, arus kas, valuasi. Uji tiap mata rantai; mulai dari pasar, bukan dari target laba.",
    },
    {
      id: "jebakan-pangsa-pasar",
      eyebrow: "Langkah 6 · Jebakan Pangsa Pasar",
      title: "Pangsa naik, margin turun: menang pertempuran, kalah perang",
      prose: [
        "PT Kopi Nusantara Fiktif (ilustratif) merayakan pangsa pasarnya naik dari 20 persen ke 25 persen dalam dua tahun. Tetapi margin bersihnya turun dari 12 persen ke 8 persen pada periode yang sama. Pangsa itu dibeli dengan perang harga: diskon besar ke minimarket, promosi beli satu gratis satu, dan potongan harga ke distributor. Pendapatan naik, laba turun. Inilah jebakan klasik: pangsa pasar tanpa margin adalah vanity metric.",
        "Cara membedakannya: tanyakan bagaimana pangsa itu didapat. Pangsa dari produk yang lebih baik, distribusi yang lebih luas, atau merek yang lebih kuat adalah pangsa yang sehat: margin bertahan atau naik. Pangsa dari diskon adalah pangsa sewaan: begitu diskon berhenti, pelanggan pergi, dan pesaing yang lebih bermodal bisa membalas dengan diskon lebih besar. Perang harga hanya dimenangkan oleh pemilik biaya terendah; semua yang lain hanya membakar kas.",
        "Uji angka sederhananya: bandingkan pertumbuhan laba dengan pertumbuhan pangsa. Bila pangsa naik 5 poin tetapi laba absolut turun, strateginya menghancurkan nilai. Bila pangsa naik dan margin bertahan, strateginya menciptakan nilai. Dan bila pangsa turun tetapi margin naik karena perusahaan sengaja meninggalkan segmen murah, itu bisa jadi keputusan terbaik: lebih baik 15 persen pasar dengan margin 15 persen daripada 25 persen pasar dengan margin 8 persen.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perang harga adalah perlombaan ke bawah yang sulit dihentikan: menaikkan harga kembali setelah pelanggan terbiasa diskon hampir selalu kehilangan volume. Jangan memulai perang yang tidak bisa kamu menangkan.",
      },
      quiz: [
        {
          q: "Perusahaan fiktif: pangsa naik 20 persen ke 25 persen, margin bersih turun 12 persen ke 8 persen karena diskon besar. Penilaianmu?",
          options: [
            { text: "Sukses — pangsa pasar adalah ukuran kemenangan", why: "Salah: pangsa yang dibeli dengan diskon menghancurkan laba; pendapatan naik tetapi laba turun." },
            { text: "Gagal menciptakan nilai — pangsa sewaan dari perang harga; uji laba absolut dan keberlanjutan margin", why: "Benar: margin turun 4 poin menandakan pangsa dibeli, bukan dimenangkan.", correct: true },
            { text: "Sukses — pesaing pasti tersingkir duluan", why: "Salah: pesaing bermodal lebih besar bisa membalas dengan diskon lebih dalam." },
            { text: "Tidak bisa dinilai tanpa harga saham", why: "Salah: laba dan margin sudah cukup untuk menilai strategi ini." },
          ],
        },
      ],
      reference: "Pangsa tanpa margin adalah vanity metric. Pangsa sehat: margin bertahan. Pangsa sewaan: margin runtuh karena diskon.",
    },
    {
      id: "vignette-bank",
      eyebrow: "Langkah 7 · Vignette Bank",
      title: "Bank Fiktif Nusantara: enam soal, satu cerita",
      prose: [
        "Bank Fiktif Nusantara (ilustratif) melaporkan angka tahun berjalan: pendapatan bunga bersih Rp450 miliar, aset produktif rata-rata Rp9.000 miliar, total kredit Rp6.000 miliar, kredit bermasalah Rp180 miliar, modal Rp1.200 miliar, aset tertimbang menurut risiko Rp10.000 miliar, dana pihak ketiga Rp10.000 miliar dengan CASA Rp7.000 miliar, total aset Rp12.500 miliar, ekuitas Rp2.500 miliar, laba bersih Rp300 miliar, dan biaya kredit Rp90 miliar. Enam soal berikut memakai angka yang sama; tiap soal menguji satu lensa analisis bank.",
        "Rasio-rasio kuncinya (ilustratif): NIM sama dengan 450 dibagi 9.000 sama dengan 5,0 persen. NPL gross sama dengan 180 dibagi 6.000 sama dengan 3,0 persen. CAR sama dengan 1.200 dibagi 10.000 sama dengan 12,0 persen, di atas patokan minimum umum 8 persen. Rasio CASA sama dengan 7.000 dibagi 10.000 sama dengan 70 persen. ROE sama dengan 300 dibagi 2.500 sama dengan 12,0 persen, dari ROA 300 dibagi 12.500 sama dengan 2,4 persen dengan leverage aset terhadap ekuitas 5 kali. Cost of credit sama dengan 90 dibagi 6.000 sama dengan 1,5 persen.",
        "Cara membaca bank secara utuh: NIM dan CASA bercerita tentang profitabilitas dan struktur dana; NPL dan cost of credit bercerita tentang kualitas aset; CAR bercerita tentang bantalan modal; ROE dan leverage bercerita tentang seberapa besar return itu dibeli dengan risiko. Bank yang bagus di satu lensa tetapi rapuh di lensa lain bukan bank yang bagus, melainkan bank yang belum ketahuan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "NIM Bank Fiktif Nusantara 5,0 persen (ilustratif). Artinya?",
          options: [
            { text: "Pendapatan bunga bersih 5 persen dari aset produktif rata-rata — margin bunga yang sehat", why: "Benar: 450 dibagi 9.000 sama dengan 5,0 persen; NIM mengukur seberapa efisien bank mengubah aset produktif menjadi pendapatan bunga.", correct: true },
            { text: "Bank membayar bunga 5 persen ke nasabah", why: "Salah: NIM adalah margin bersih, bukan bunga simpanan." },
            { text: "Laba bersih 5 persen dari total aset", why: "Salah: itu definisi ROA, dan ROA bank ini 2,4 persen." },
            { text: "Kredit tumbuh 5 persen tahun ini", why: "Salah: NIM tidak mengukur pertumbuhan kredit." },
          ],
        },
        {
          q: "NPL gross 3,0 persen (ilustratif). Interpretasi yang benar?",
          options: [
            { text: "Tidak ada masalah — 3 persen selalu aman", why: "Salah: aman atau tidak tergantung tren, cakupan pencadangan, dan konsentrasi kreditnya." },
            { text: "3 persen kredit bermasalah; tanyakan trennya dan apakah pencadangannya cukup menutupnya", why: "Benar: 180 dibagi 6.000 sama dengan 3,0 persen; angka itu baru bermakna dengan tren dan coverage.", correct: true },
            { text: "Bank pasti merugi tahun depan", why: "Salah: NPL 3 persen tidak otomatis berarti rugi." },
            { text: "NPL mengukur permodalan bank", why: "Salah: permodalan diukur CAR, bukan NPL." },
          ],
        },
        {
          q: "CAR 12,0 persen (ilustratif) versus patokan minimum umum 8 persen. Artinya?",
          options: [
            { text: "Modal 12 persen dari ATMR — bantalan di atas minimum, bank punya ruang menyerap kerugian", why: "Benar: 1.200 dibagi 10.000 sama dengan 12,0 persen; di atas minimum umum 8 persen.", correct: true },
            { text: "Bank wajib menambah modal segera", why: "Salah: 12 persen di atas minimum, bukan di bawah." },
            { text: "CAR mengukur profitabilitas", why: "Salah: CAR mengukur kecukupan modal terhadap risiko aset." },
            { text: "12 persen berarti bank tidak boleh menyalurkan kredit lagi", why: "Salah: CAR di atas minimum justru memberi ruang tumbuh." },
          ],
        },
        {
          q: "CASA 70 persen (ilustratif). Kenapa analis menyukai CASA tinggi?",
          options: [
            { text: "Dana murah (giro dan tabungan) menekan biaya dana sehingga NIM lebih lebar", why: "Benar: 7.000 dibagi 10.000 sama dengan 70 persen; dana murah adalah sumber moat bank.", correct: true },
            { text: "CASA tinggi berarti bank tidak punya nasabah deposito", why: "Salah: CASA 70 persen berarti deposito 30 persen, tetap ada." },
            { text: "CASA mengukur kualitas kredit", why: "Salah: kualitas kredit diukur NPL dan cost of credit." },
            { text: "CASA tinggi selalu berarti bank besar", why: "Salah: CASA adalah rasio, bukan ukuran absolut." },
          ],
        },
        {
          q: "Laba bank naik 20 persen, tetapi NPL naik dari 1,5 persen ke 3,0 persen dan cost of credit naik ke 1,5 persen (ilustratif). Penilaianmu?",
          options: [
            { text: "Bank makin bagus — laba naik adalah segalanya", why: "Salah: laba yang dibeli dengan kredit berisiko akan dibayar kembali lewat pencadangan dan hapus buku." },
            { text: "Waspada — laba mungkin dibeli dengan pelonggaran standar kredit; cek tren NPL dan kecukupan pencadangan", why: "Benar: pertumbuhan laba yang sejalan dengan memburuknya kualitas aset adalah bendera merah klasik.", correct: true },
            { text: "Tidak ada hubungan antara laba dan NPL", why: "Salah: kredit berisiko menghasilkan bunga hari ini dan kerugian besok." },
            { text: "Bank harus berhenti menyalurkan kredit", why: "Salah: yang dibutuhkan adalah standar kredit yang disiplin, bukan berhenti total." },
          ],
        },
        {
          q: "ROE 12,0 persen dari ROA 2,4 persen dan leverage 5 kali (ilustratif). Risiko tersembunyi di balik ROE ini?",
          options: [
            { text: "Tidak ada — ROE 12 persen selalu bagus", why: "Salah: ROE yang didorong leverage rapuh saat aset bermasalah; ekuitas hanya seperlima aset." },
            { text: "ROE dibeli dengan leverage: aset 5 kali ekuitas, jadi kerugian aset 20 persen menghapus seluruh ekuitas", why: "Benar: 12.500 dibagi 2.500 sama dengan 5; leverage mengalikan return sekaligus kerugian.", correct: true },
            { text: "ROA 2,4 persen berarti bank tidak efisien", why: "Salah: ROA bank memang kecil karena asetnya besar; yang penting ROA terhadap biaya modalnya." },
            { text: "Leverage tidak memengaruhi risiko bank", why: "Salah: leverage adalah pengali risiko yang paling mendasar di perbankan." },
          ],
        },
      ],
      reference: "NIM 5,0 persen; NPL 3,0 persen; CAR 12,0 persen; CASA 70 persen; ROE 12,0 persen dari ROA 2,4 persen kali leverage 5. Baca bank dengan semua lensa sekaligus.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: Porter, siklus hidup, moat, rantai proyeksi, dan analisis bank.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Industri dengan pembeli kuat, pengganti berlimpah, dan persaingan harga sengit. Vonis Porter?",
          options: [
            { text: "Struktur tidak menarik — margin tipis; hanya merek terkuat atau biaya terendah yang menang", why: "Benar: lima kekuatan memeras margin dari semua sisi.", correct: true },
            { text: "Industri menarik karena banyak pesaing", why: "Salah: banyak pesaing berarti persaingan sengit, bukan peluang." },
            { text: "Struktur tidak relevan bila growth-nya cepat", why: "Salah: growth cepat tidak menyelamatkan margin yang diperas." },
            { text: "Industri menarik karena pembeli kuat", why: "Salah: pembeli kuat menekan harga dan margin produsen." },
          ],
        },
        {
          q: "Perusahaan mengklaim moat, tetapi ROE 6 persen selama 5 tahun sementara required return 10 persen. Vonis?",
          options: [
            { text: "Klaim ditolak — spread negatif persisten membantah moat", why: "Benar: moat harus terlihat di return atas modal.", correct: true },
            { text: "Klaim diterima — merek terkenal cukup sebagai bukti", why: "Salah: merek tanpa return di atas biaya modal bukan moat ekonomi." },
            { text: "Klaim diterima — 5 tahun terlalu pendek", why: "Salah: lima tahun spread negatif adalah bukti kuat." },
            { text: "Tidak bisa dinilai", why: "Salah: angka ROE dan required return sudah cukup untuk menilai." },
          ],
        },
        {
          q: "PT Kopi Nusantara Fiktif (ilustratif): ROE 12,0, 13,64, dan 15,0 persen; required return 10 persen. Spread rata-rata?",
          options: [
            { text: "3,55 poin — positif dan membaik, mendukung klaim narrow moat", why: "Benar: rata-rata 13,55 dikurangi 10 sama dengan 3,55.", correct: true },
            { text: "0 poin — tepat di required return", why: "Salah: rata-rata ROE 13,55, bukan 10." },
            { text: "Negatif 3,55 poin", why: "Salah: spread adalah ROE dikurangi required return, dan hasilnya positif." },
            { text: "13,55 poin", why: "Salah: itu ROE rata-ratanya, bukan spread-nya." },
          ],
        },
        {
          q: "Pangsa naik 20 persen ke 25 persen tetapi margin turun 12 persen ke 8 persen karena diskon. Penilaian?",
          options: [
            { text: "Pangsa sewaan dari perang harga — menghancurkan nilai bila laba absolut turun", why: "Benar: margin turun 4 poin menandakan pangsa dibeli dengan diskon.", correct: true },
            { text: "Sukses besar — pangsa adalah segalanya", why: "Salah: pangsa tanpa margin adalah vanity metric." },
            { text: "Tidak bisa dinilai", why: "Salah: laba dan margin sudah cukup untuk menilai." },
            { text: "Pasti sukses karena pesaing tersingkir", why: "Salah: pesaing bermodal besar bisa membalas lebih dalam." },
          ],
        },
        {
          q: "Bank fiktif: CAR 12,0 persen, CASA 70 persen, NPL 3,0 persen, ROE 12,0 persen dari leverage 5 kali. Bacaan utuh?",
          options: [
            { text: "Bank sehat sempurna — semua angka terlihat bagus", why: "Salah: NPL 3 persen perlu tren dan coverage; ROE didorong leverage 5 kali." },
            { text: "Modal dan dana murah kuat, tetapi cek tren NPL dan ingat ROE dibeli dengan leverage", why: "Benar: CAR di atas minimum dan CASA tinggi bagus; NPL dan leverage adalah sisi risikonya.", correct: true },
            { text: "Bank bermasalah karena NPL 3 persen", why: "Salah: NPL 3 persen saja tanpa tren dan coverage belum cukup untuk vonis." },
            { text: "CASA 70 persen berarti bank tidak punya deposito", why: "Salah: CASA 70 persen berarti deposito 30 persen." },
          ],
        },
      ],
      summary: [
        "Porter: lima kekuatan menentukan ke mana margin industri mengalir; growth cepat tidak menyelamatkan struktur buruk.",
        "Siklus hidup: strategi dan proyeksi growth harus sesuai fase industri.",
        "Moat: wide lebih dari 20 tahun, narrow sekitar 10 tahun; uji dari ROE di atas biaya modal, margin bertahan, dan ROIC di atas WACC.",
        "Rantai proyeksi: pasar, pangsa, pendapatan, margin, laba, arus kas, valuasi; uji tiap mata rantai.",
        "Pangsa tanpa margin adalah vanity metric; bank dibaca dengan semua lensa sekaligus: NIM, NPL, CAR, CASA, ROE, dan leverage.",
      ],
      next: { label: "PM-A7 — Fixed Income: Pricing, Duration & Kredit", href: "/v2/learn/pm-a7-fixed-income" },
    },
  ],
};
