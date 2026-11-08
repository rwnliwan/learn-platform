import type { V2Lesson } from "../lib/types";

export const e37: V2Lesson = {
  slug: "e37-krisis-2008",
  track: "Financial Markets",
  module: "Sejarah Pasar",
  title: "E37 — Krisis Keuangan 2008: Gelembung, Penularan, dan Pelajaran",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "15 September 2008: bank 158 tahun runtuh dalam satu akhir pekan",
      prose: [
        "Senin 15 September 2008, Lehman Brothers — bank investasi berusia 158 tahun — mengajukan kebangkrutan. Dalam hitungan hari, pasar uang membeku: bank tidak mau meminjamkan ke bank lain karena tidak tahu siapa yang memegang kerugian berikutnya. AIG, perusahaan asuransi terbesar dunia, diselamatkan pemerintah dengan Rp1.200 triliun lebih. Dow jatuh 18 persen dalam satu minggu. Krisis yang bermula dari KPR rumah di Amerika menjadi krisis keuangan global terbesar sejak 1929.",
        "Akarnya sederhana dan sudah lama terlihat: rumah yang harganya naik 124 persen dalam 9 tahun (1997–2006), KPR subprime yang diberikan tanpa verifikasi penghasilan, dan obligasi hasil sekuritisasi KPR itu yang diberi peringkat AAA — seolah 1.000 KPR berisiko yang digabung menjadi satu obligasi aman. Ketika harga rumah berhenti naik pada 2006, seluruh rantai itu runtuh bersamaan — karena rantai itu diikat oleh satu asumsi: harga rumah tidak pernah turun secara nasional.",
        "Lesson ini adalah sejarah yang belum pernah diajarkan sebagai lesson utuh: E14 punya mini-case 2008 dan E26 membedah mesin sekuritisasi ('bukan cerita krisisnya'), tetapi tidak ada narasi lengkap — timeline, penularan, respons kebijakan, dan pelajaran. Setelah lesson ini kamu bisa: (1) menjelaskan rantai sebab-akibat dari gelembung perumahan ke krisis global; (2) menghitung bagaimana leverage mengubah kerugian kecil menjadi kebangkrutan; (3) menjelaskan penularan lewat pasar uang dan repo; (4) menilai respons kebijakan (TARP, QE, Dodd-Frank); (5) mengenali tanda-tanda gelembung berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "E14 memuat mini-case 2008 (repo dan pasar uang membeku) dan E26 membedah mesin sekuritisasi dengan penegasan eksplisit 'bukan cerita krisisnya — mini-case krisis 2008 sudah ada di E14'. Tidak ada lesson yang menyajikan narasi lengkap krisis: timeline, gelembung perumahan, rantai sekuritisasi, leverage, penularan global, dan respons kebijakan. Lesson ini membangun narasi itu.",
      },
      reference: "Leverage 30:1 — kerugian 3,33 persen menghapus seluruh ekuitas. Harga rumah AS naik 124 persen (1997–2006), lalu jatuh. TARP 700 miliar dolar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan krisis 2008 dari hulu ke hilir — dan mengenali pola yang sama bila muncul lagi.",
        "(1) Menjelaskan rantai sebab-akibat: gelembung perumahan → subprime → sekuritisasi → krisis;",
        "(2) Menghitung bagaimana leverage 30:1 mengubah kerugian kecil menjadi kebangkrutan;",
        "(3) Menjelaskan penularan lewat pasar uang, repo, dan CDS;",
        "(4) Menilai respons kebijakan: TARP, QE, Dodd-Frank, Basel III;",
        "(5) Mengenali tanda-tanda gelembung dan kerapuhan sistem berikutnya.",
      ],
      tasks: [],
    },
    {
      id: "gelembung",
      eyebrow: "Langkah 3 · Teori",
      title: "Gelembung: rumah yang harganya tidak pernah turun — sampai turun",
      prose: [
        "Antara 1997 dan 2006, harga rumah Amerika Serikat naik 124 persen — jauh di atas inflasi dan pendapatan. Pendorongnya tiga. Pertama, suku bunga rendah pasca dot-com crash 2001: The Fed memangkas suku bunga ke 1 persen, KPR menjadi murah. Kedua, standar kredit yang runtuh: KPR subprime — untuk debitur tanpa verifikasi penghasilan, tanpa uang muka, dengan suku bunga awal rendah yang naik tajam setelah 2 tahun (teaser rate) — tumbuh dari 8 persen menjadi 20 persen dari seluruh KPR baru. Ketiga, keyakinan bahwa harga rumah tidak pernah turun secara nasional — keyakinan yang benar sejak 1930-an, sampai 2006.",
        "Rantai sekuritisasi (E26) mengubah KPR individual menjadi obligasi: ribuan KPR dikumpulkan, dipotong menjadi tranche, dan tranche senior diberi peringkat AAA oleh lembaga pemeringkat. Logikanya: tidak mungkin ribuan debitur di seluruh Amerika gagal bersamaan. Logika itu benar — kecuali bila gagalnya disebabkan oleh SATU faktor bersama: harga rumah nasional yang turun. Korelasi yang diasumsikan 0,2 dalam contoh ini (angka ilustratif, bukan parameter yang dikutip dari satu sumber historis tertentu) ternyata mendekati 1 saat harga rumah jatuh di mana-mana. Model Gaussian copula David Li — yang dipakai untuk menilai CDO — mengasumsikan korelasi konstan; saat korelasi melonjak, tranche AAA yang 'tidak mungkin gagal' gagal bersamaan.",
        "Insentifnya rusak di setiap mata rantai. Broker KPR dibayar per KPR yang diterbitkan — bukan per KPR yang dibayar kembali. Bank yang menerbitkan sekuritisasi tidak menanggung risikonya (originate-to-distribute). Lembaga pemeringkat dibayar oleh penerbit yang dinilainya. Manajer dana dibayar dari volume, bukan dari kualitas. Setiap pihak rasional secara individual — dan sistemnya gila secara kolektif. Inilah pelajaran pertama krisis: krisis jarang disebabkan satu penjahat; ia disebabkan insentif yang membuat perilaku berbahaya menjadi rasional bagi semua orang.",
        "Tanda-tandanya terlihat sejak 2005 bagi yang mau melihat: rasio harga rumah terhadap pendapatan mencapai rekor, KPR subprime tumbuh 20 persen per tahun, dan tranche CDO AAA memberi yield lebih tinggi dari obligasi korporat AAA — pasar sedang membayar lebih untuk risiko yang diklaim sama. Investor yang membandingkan yield dengan risiko — bukan yield dengan yield — sudah menjual sejak 2006.",
      ],
      tasks: [],
      note: {
        title: "Asumsi yang membunuh",
        body: "Satu asumsi menopang seluruh rantai: harga rumah tidak pernah turun secara nasional. Asumsi itu benar selama 70 tahun — dan salah satu kali sudah cukup. Pelajaran abadi: risiko terbesar selalu bersembunyi di asumsi yang 'tidak pernah salah sebelumnya'. Selalu tanyakan: apa yang terjadi bila asumsi ini salah?",
      },
      reference: "Harga rumah naik 124 persen (1997–2006). Subprime: 8 persen → 20 persen dari KPR baru. Korelasi asumsi 0,2; kenyataan mendekati 1.",
    },
    {
      id: "leverage-penularan",
      eyebrow: "Langkah 4 · Teori",
      title: "Leverage dan penularan: kerugian kecil, kebangkrutan besar",
      prose: [
        "Leverage adalah pengali yang mengubah kerugian kecil menjadi bencana. Bank investasi 2008 beroperasi dengan leverage 30:1 — aset Rp1.000 miliar didanai ekuitas Rp33,3 miliar dan utang Rp966,7 miliar. Kerugian aset 2 persen (Rp20 miliar) menyisakan ekuitas Rp13,3 miliar — masih hidup. Kerugian 3,33 persen (Rp33,3 miliar) menghapus SELURUH ekuitas akuntansi — bank secara ekonomi insolven (perlu dicatat: ekuitas nol akuntansi bukan otomatis 'bangkrut' secara hukum — kebangkrutan butuh gagal bayar atau putusan pengadilan; bank bisa bertahan sementara dengan dukungan likuiditas). Kerugian 5 persen (Rp50 miliar) berarti ekuitas minus Rp16,7 miliar — insolven dan menunggak. Aset yang turun 5 persen seharusnya kabar buruk biasa; dengan leverage 30:1, ia adalah vonis mati.",
        "Penularan menyebar lewat tiga saluran. Pasar uang: bank berhenti meminjamkan ke bank lain (E14) karena tidak tahu siapa memegang kerugian CDO — suku bunga antarbank (LIBOR-OIS spread) melonjak dari 10 bps ke 350 bps. Repo: pemberi pinjaman menaikkan haircut dan menolak collateral CDO — bank yang mendanai aset jangka panjang dengan repo semalam tiba-tiba tidak bisa mendanai apa pun (MR36 membahas mekanisme repo run ini). CDS: AIG menjual proteksi atas CDO senilai ratusan miliar dolar tanpa collateral memadai — saat CDO jatuh, AIG harus membayar dan tidak mampu.",
        "Lehman dibiarkan jatuh — dan pasar menyimpulkan: bila Lehman bisa jatuh, siapa pun bisa jatuh. Kepanikan menjadi rasional: menarik dana dari semua bank adalah strategi yang benar bagi tiap deposan individual — dan bencana bagi sistem. Inilah bank run modern: bukan antrean di depan cabang, melainkan penarikan dana pasar uang dan repo dalam hitungan jam. Pemerintah belajar dari kesalahan itu: AIG diselamatkan keesokan harinya, dan TARP 700 miliar dolar disahkan untuk membeli aset bermasalah dan menyuntik modal bank.",
        "Respons kebijakan punya tiga kaki. TARP: pemerintah membeli aset bermasalah dan menyuntik modal — menstabilkan sistem, tetapi menyelamatkan pemegang saham bank yang ceroboh. QE: The Fed membeli obligasi jangka panjang untuk menekan yield saat suku bunga sudah nol (E35). Regulasi: Dodd-Frank (2010) membatasi proprietary trading bank (Volcker Rule) dan membentuk FSOC; Basel III menaikkan modal minimum dan menambah buffer likuiditas (LCR/NSFR). Perdebatan tentang ketiganya — apakah terlalu besar, terlalu kecil, atau salah sasaran — masih berlangsung sampai hari ini.",
      ],
      tasks: [],
      formula: String.raw`\text{Ekuitas setelah rugi} = \frac{A}{L} - A \times r \qquad r_{bangkrut} = \frac{1}{L}`,
      formulaNote: "A = aset (1.000); L = leverage (30); r = kerugian aset. Ekuitas awal = 1.000/30 = 33,3. Kerugian yang menghapus ekuitas = 1/30 = 3,33 persen (ambang insolvensi akuntansi — bukan putusan bangkrut hukum). Kerugian 2 persen → ekuitas 13,3; 5 persen → minus 16,7.",
      reference: "Leverage 30:1 → bangkrut di kerugian 3,33 persen. LIBOR-OIS: 10 bps → 350 bps. TARP 700 miliar dolar.",
    },
    {
      id: "lab-leverage",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin leverage dan titik bangkrut",
      prose: [
        "Lab ini membangun mesin leverage: dari aset dan leverage — hitung ekuitas awal, ekuitas setelah kerugian 2 persen dan 5 persen, dan ambang kerugian yang menghapus ekuitas.",
        "Hitung dulu di kepala. Aset Rp1.000 miliar, leverage 30: ekuitas awal = 1.000 dibagi 30 = Rp33,33 miliar. Kerugian 2 persen = Rp20 miliar → ekuitas 33,33 − 20 = Rp13,33 miliar (masih hidup). Kerugian 5 persen = Rp50 miliar → ekuitas 33,33 − 50 = minus Rp16,67 miliar (bangkrut). Ambang bangkrut = 100 dibagi 30 = 3,33 persen.",
        "Tugas lab: tulis fungsi yang menerima aset dan leverage — lalu mencetak ekuitas awal, ekuitas setelah rugi 2 persen, ekuitas setelah rugi 5 persen, dan ambang bangkrut dalam persen. Empat angka ini adalah seluruh cerita kerapuhan bank 2008.",
        "Setelah lolos, coba eksperimen: turunkan leverage menjadi 10:1 (seperti bank komersial yang diatur ketat) dan lihat ambang bangkrut naik menjadi 10 persen — lalu tanyakan: berapa leverage maksimum yang masih masuk akal untuk institusi yang dananya adalah uang publik?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ekuitas_awal` (aset dibagi leverage)" },
        { id: "t2", text: "Hitung `ekuitas_rugi2` (ekuitas setelah kerugian 2 persen)" },
        { id: "t3", text: "Hitung `ekuitas_rugi5` dan `ambang_bangkrut` (100 dibagi leverage)" },
      ],
      expected: "ekuitas_awal=33.33\nekuitas_rugi2=13.33\nekuitas_rugi5=-16.67\nambang_bangkrut=3.33",
      hints: [
        "Ekuitas awal = aset / leverage.",
        "Kerugian 2% = aset x 0,02; kurangkan dari ekuitas awal.",
        "Ambang bangkrut = 100 / leverage (persen).",
      ],
      code: {
        starter: `# Bank investasi 2008: aset Rp1.000 miliar, leverage 30:1.\naset = 1000.0  # miliar rupiah\nleverage = 30.0\n\n# TULIS KODEMU: hitung ekuitas_awal, ekuitas_rugi2, ekuitas_rugi5, ambang_bangkrut.\n# Cetak, per baris: ekuitas_awal, ekuitas_rugi2, ekuitas_rugi5, ambang_bangkrut.\n\n`,
        lockLines: 3,
        solution: `# Bank investasi 2008: aset Rp1.000 miliar, leverage 30:1.\naset = 1000.0  # miliar rupiah\nleverage = 30.0\n\n\nekuitas_awal = aset / leverage\nekuitas_rugi2 = ekuitas_awal - aset * 0.02\nekuitas_rugi5 = ekuitas_awal - aset * 0.05\nambang_bangkrut = 100 / leverage\nprint(f"ekuitas_awal={ekuitas_awal:.2f}")\nprint(f"ekuitas_rugi2={ekuitas_rugi2:.2f}")\nprint(f"ekuitas_rugi5={ekuitas_rugi5:.2f}")\nprint(f"ambang_bangkrut={ambang_bangkrut:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "ekuitas_awal", value: 33.33, tol: 0.01, label: "Ekuitas awal Rp33,33 miliar", msg: "1.000 / 30 = 33,33. Hanya 3,33 persen dari aset — bantalan yang sangat tipis." },
          { kind: "equal", task: "t2", name: "ekuitas_rugi2", value: 13.33, tol: 0.01, label: "Setelah rugi 2 persen: Rp13,33 miliar", msg: "33,33 - 20 = 13,33. Masih hidup, tetapi sudah kehilangan 60 persen ekuitas." },
          { kind: "equal", task: "t3", name: "ekuitas_rugi5", value: -16.67, tol: 0.01, label: "Setelah rugi 5 persen: minus Rp16,67 miliar", msg: "33,33 - 50 = -16,67. Ekuitas negatif — insolven. Kerugian 5 persen seharusnya kabar buruk biasa." },
          { kind: "equal", task: "t3", name: "ambang_bangkrut", value: 3.33, tol: 0.01, label: "Ambang bangkrut 3,33 persen", msg: "100 / 30 = 3,33. Itulah seluruh cerita: bank 30:1 mati oleh kerugian 3,33 persen." },
        ],
      },
      reference: "Ekuitas awal Rp33,33 miliar; rugi 2 persen → Rp13,33 miliar; rugi 5 persen → minus Rp16,67 miliar; ambang bangkrut 3,33 persen.",
    },
    {
      id: "pelajaran",
      eyebrow: "Langkah 6 · Teori",
      title: "Pelajaran: lima tanda yang tidak boleh diabaikan lagi",
      prose: [
        "Pelajaran pertama: leverage adalah risiko sistemik, bukan risiko individual. Bank yang bangkrut karena leverage 30:1 tidak hanya merugikan pemegang sahamnya — ia membekukan pasar uang seluruh dunia. Basel III merespons dengan leverage ratio minimum 3 persen — tetapi perhatikan dua hal. Pertama, 3 persen itu LEBIH TIPIS dari 3,33 persen ekuitas/aset milik Lehman, bukan lebih tebal — 3 < 3,33. Kedua, keduanya mengukur hal BERBEDA: leverage ratio Basel memakai modal Tier 1 dibagi total EKSPOSUR REGULASI (termasuk eksposur off-balance-sheet dan derivatif), bukan ekuitas akuntansi dibagi aset akuntansi. Yang membuat Basel III lebih kuat bukan angka 3 persennya, melainkan definisi eksposur yang lebih luas plus buffer tambahan untuk bank sistemik. Ilustrasi 30:1 tetap berguna untuk memahami kerapuhan — tetapi jangan membandingkan kedua angka itu seolah sepadan. Investor wajib memeriksa leverage institusi tempat ia menyimpan uang — bukan hanya return-nya.",
        "Pelajaran kedua: korelasi naik saat stres. Model yang mengasumsikan korelasi konstan — Gaussian copula untuk CDO, VaR dengan korelasi historis — runtuh tepat saat dibutuhkan. Stress test (MR7) yang memakai korelasi masa tenang adalah stress test yang menipu diri sendiri. Selalu uji korelasi krisis, bukan korelasi rata-rata.",
        "Pelajaran ketiga: likuiditas adalah solvabilitas yang menyamar. Bank yang 'solven' tetapi tidak bisa mendanai asetnya lewat repo semalam akan bangkrut dalam hitungan hari — seperti Lehman. LCR (liquidity coverage ratio) Basel III mewajibkan bank memegang aset likuid berkualitas tinggi untuk 30 hari arus keluar — pengakuan bahwa likuiditas bisa membunuh lebih cepat dari kerugian kredit.",
        "Pelajaran keempat: insentif mengalahkan niat baik. Selama broker dibayar per KPR yang diterbitkan dan pemeringkat dibayar oleh penerbit, perilaku berbahaya akan kembali dalam bentuk baru. Regulasi yang tidak memperbaiki insentif hanya memindahkan risiko ke sudut yang belum diatur — shadow banking. Pelajaran kelima: 'too big to fail' adalah janji yang mahal. Menyelamatkan AIG dan bank besar mencegah depresi — tetapi menciptakan moral hazard: institusi yang tahu akan diselamatkan akan mengambil risiko lebih besar. Dodd-Frank mencoba menjawabnya dengan resolusi teratur (living wills) — rencana pemakaman bank besar tanpa uang pajak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira krisis 2008 disebabkan 'keserakahan'. Keserakahan selalu ada — yang berubah adalah STRUKTUR yang membuat keserakahan menjadi sistemik: leverage 30:1, sekuritisasi tanpa retensi risiko, dan pemeringkat yang dibayar penerbit. Perbaiki strukturnya, bukan moralnya.",
      },
      reference: "Lima pelajaran: leverage, korelasi krisis, likuiditas, insentif, too big to fail.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: investor yang menjual di 2006",
      prose: [
        "Michael Burry — manajer dana kecil — membaca prospektus CDO pada 2005 dan menemukan: KPR subprime dengan teaser rate yang akan naik tajam pada 2007, tranche AAA yang isinya KPR tanpa verifikasi penghasilan, dan korelasi yang diasumsikan 0,2. Ia membeli CDS (E5) sebagai asuransi atas CDO itu — membayar premi sambil menunggu. Investornya marah: premi menggerus return selama 2 tahun, dan 'semua orang' bilang harga rumah tidak pernah turun. Hasil akhirnya, menurut The Big Short: dananya naik 489 persen KUMULATIF dari November 2000 sampai Juni 2008 — bukan 489 persen di tahun 2008 saja — sementara pasar saham AS (S&P 500) jatuh 37 persen di tahun 2008.",
        "Burry tidak lebih pintar dari semua orang — ia hanya membaca dokumen yang tidak dibaca orang lain dan menghitung leverage yang tidak dihitung orang lain. Pelajaran untuk investor ritel: kamu tidak perlu memprediksi krisis; kamu perlu menghindari aset yang harganya bergantung pada asumsi yang tidak pernah diuji. Bila sebuah investasi 'aman' tetapi memberi yield lebih tinggi dari yang aman, selisihnya adalah risiko yang belum kamu kenali — carilah sebelum membelinya.",
        "Dan bila kamu sudah memegang aset seperti itu saat tanda-tandanya muncul — rasio harga terhadap pendapatan di rekor, standar kredit yang longgar, leverage yang menumpuk — menjual lebih awal dan 'salah' selama 2 tahun lebih baik dari memegang dan 'benar' terlambat. Biaya menjadi terlalu dini adalah premi yang tidak dibayar; biaya menjadi terlambat adalah seluruh modal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat analisis ini benar. Pertama, keputusan didasarkan pada dokumen primer (prospektus), bukan pada opini pasar. Kedua, leverage dihitung — bukan dirasakan. Ketiga, biaya menjadi terlalu dini diakui secara eksplisit dan diterima sebagai harga asuransi.",
      },
      reference: "Dana Burry naik 489 persen kumulatif Nov 2000–Jun 2008 (bukan 2008 saja); pasar jatuh 37 persen di 2008. Ia membaca prospektus yang tidak dibaca orang lain.",
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
        "Leverage 30:1 — kerugian 3,33 persen menghapus seluruh ekuitas.",
        "Harga rumah naik 124 persen (1997–2006); subprime 8 persen → 20 persen dari KPR baru.",
        "Korelasi asumsi 0,2 (ilustratif); kenyataan mendekati 1 saat harga rumah jatuh nasional.",
        "Penularan: pasar uang (LIBOR-OIS 10 → 350 bps), repo (haircut naik), CDS (AIG).",
        "Respons: TARP 700 miliar dolar, QE, Dodd-Frank, Basel III.",
      ],
      next: { label: "E38 — Model Endowment Yale (Swensen): Alokasi, Illiquiditas, dan Disiplin", href: "/v2/learn/e38-model-endowment-swensen" },
      quiz: [
        {
          q: "Bank dengan aset Rp1.000 miliar dan leverage 30:1. Berapa kerugian aset (persen) yang menghapus seluruh ekuitasnya?",
          options: [
            { text: "30 persen — sama dengan leverage-nya", why: "Salah: ambang bangkrut adalah 1 dibagi leverage = 1/30 = 3,33 persen. Leverage 30 berarti ekuitas hanya 3,33 persen dari aset." },
            { text: "3,33 persen", why: "Tepat: ekuitas awal 1.000/30 = 33,33; kerugian 33,33 dari aset 1.000 = 3,33 persen. Kerugian kecil menjadi vonis mati.", correct: true },
            { text: "10 persen — ambang standar bank komersial", why: "Salah: 10 persen adalah ambang untuk leverage 10:1. Bank ini leverage-nya 30:1 — ambangnya tiga kali lebih kecil." },
            { text: "50 persen — bank hanya bangkrut bila kehilangan separuh aset", why: "Salah: dengan leverage 30:1, kerugian 5 persen saja sudah membuat ekuitas minus Rp16,67 miliar." },
          ],
        },
        {
          q: "Kenapa tranche CDO AAA yang 'tidak mungkin gagal' gagal bersamaan pada 2008?",
          options: [
            { text: "Karena semua debitur KPR berkonspirasi untuk gagal bersamaan", why: "Salah: tidak ada konspirasi. Penyebabnya adalah faktor bersama — harga rumah nasional yang turun — yang membuat gagalnya berkorelasi." },
            { text: "Karena korelasi gagal bayar melonjak saat harga rumah turun nasional — asumsi korelasi 0,2 (ilustratif) runtuh", why: "Tepat: model mengasumsikan korelasi konstan 0,2. Saat harga rumah jatuh di mana-mana, korelasi mendekati 1 dan diversifikasi semu itu lenyap.", correct: true },
            { text: "Karena lembaga pemeringkat salah ketik peringkatnya", why: "Salah: bukan salah ketik. Pemeringkat memakai model dengan asumsi korelasi yang salah — dan dibayar oleh penerbit yang dinilainya." },
            { text: "Karena suku bunga naik terlalu cepat pada 2008", why: "Salah: suku bunga justru DIPOTONG agresif pada 2008. Pemicunya adalah harga rumah yang berhenti naik dan teaser rate yang meledak." },
          ],
        },
        {
          q: "LIBOR-OIS spread melonjak dari 10 bps ke 350 bps pada 2008. Apa artinya?",
          options: [
            { text: "Bank saling percaya lebih dari sebelumnya", why: "Salah: terbalik. Spread melebar berarti bank menagih premi besar untuk meminjamkan ke bank lain — kepercayaan runtuh." },
            { text: "Bank tidak mau meminjamkan ke bank lain — pasar uang membeku karena ketidakpastian siapa memegang kerugian", why: "Tepat: OIS mencerminkan suku bunga bebas risiko; LIBOR menambah premi risiko bank. Selisih 350 bps adalah harga ketakutan.", correct: true },
            { text: "Inflasi naik 350 bps dalam semalam", why: "Salah: LIBOR-OIS bukan ukuran inflasi — ia ukuran risiko kredit antarbank." },
            { text: "Pemerintah menaikkan suku bunga 350 bps", why: "Salah: pemerintah justru MEMOTONG suku bunga pada 2008. Spread melebar karena pasar, bukan karena kebijakan." },
          ],
        },
        {
          q: "Apa pelajaran utama dari insentif di rantai sekuritisasi 2008?",
          options: [
            { text: "Setiap pihak berbuat jahat dengan sengaja", why: "Salah: hampir semua pihak rasional secara individual — broker dibayar per KPR, bank tidak menanggung risiko, pemeringkat dibayar penerbit. Sistemnya yang gila, bukan orangnya." },
            { text: "Insentif yang membuat perilaku berbahaya menjadi rasional bagi semua orang — perbaiki struktur, bukan moral", why: "Tepat: krisis lahir dari struktur insentif, bukan dari satu penjahat. Regulasi yang tidak memperbaiki insentif hanya memindahkan risiko.", correct: true },
            { text: "Sekuritisasi harus dilarang seluruhnya", why: "Salah: sekuritisasi adalah alat yang berguna (E26) — yang rusak adalah sekuritisasi TANPA retensi risiko dan tanpa transparansi." },
            { text: "Lembaga pemeringkat adalah satu-satunya pihak yang bersalah", why: "Salah: pemeringkat adalah satu mata rantai. Broker, bank, manajer dana, dan regulator semuanya berperan." },
          ],
        },
        {
          q: "Bank komersial dengan leverage 10:1 vs bank investasi 30:1. Mana yang lebih tahan terhadap kerugian aset 5 persen?",
          options: [
            { text: "Bank 30:1 — leverage tinggi berarti bantalan lebih besar", why: "Salah: terbalik. Leverage tinggi berarti ekuitas TIPIS: 30:1 mati di kerugian 3,33 persen." },
            { text: "Bank 10:1 — ekuitasnya 10 persen dari aset, kerugian 5 persen menyisakan 5 persen", why: "Tepat: ekuitas awal 100 dari aset 1.000; rugi 50 menyisakan 50. Bank 30:1 sudah minus 16,67 di titik yang sama.", correct: true },
            { text: "Keduanya sama — kerugian 5 persen mematikan keduanya", why: "Salah: ambang bangkrut 10:1 adalah 10 persen; 30:1 adalah 3,33 persen. Kerugian 5 persen hanya mematikan yang kedua." },
            { text: "Tidak bisa dibandingkan — leverage tidak memengaruhi ketahanan", why: "Salah: leverage ADALAH ketahanan. Ekuitas dibagi aset menentukan berapa kerugian yang bisa diserap." },
          ],
        },
      ],
    },
  ],
};
