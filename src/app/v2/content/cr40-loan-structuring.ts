import type { V2Lesson } from "../lib/types";

const FIG_DSCR = `<svg viewBox="0 0 520 300" role="img" aria-label="DSCR per bulan dua struktur dengan garis covenant 1,2.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">DSCR per bulan: bullet vs grace + amortisasi</text>
<text x="10" y="52" font-size="10" fill="var(--chart-text)" opacity="0.7">Sumbu Y: DSCR (bawah = 0, garis putus-putus = covenant 1,2)</text>
<line x1="50" y1="230" x2="500" y2="230" stroke="var(--chart-text)" stroke-width="1" opacity="0.4"/>
<line x1="50" y1="196" x2="500" y2="196" stroke="#e5484d" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="504" y="200" font-size="10" fill="#e5484d">1,2</text>
<polyline points="50,216 88,214 126,213 164,211 202,209 240,208 278,206 316,205 354,206 392,208 430,210 468,228" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="50,216 88,214 126,213 164,222 202,225 240,227 278,224 316,222 354,224 392,227 430,230 468,231" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<circle cx="468" cy="228" r="5" fill="#e5484d"/>
<circle cx="164" cy="222" r="4" fill="#f5a524"/>
<circle cx="202" cy="225" r="4" fill="#f5a524"/>
<circle cx="240" cy="227" r="4" fill="#f5a524"/>
<text x="60" y="120" font-size="11" fill="var(--c1)" font-weight="bold">— bullet: aman 11 bulan, jatuh di bulan 12</text>
<text x="60" y="142" font-size="11" fill="var(--c2)" font-weight="bold">— grace: goyang di bulan sepi, tapi tidak jatuh</text>
<text x="10" y="262" font-size="10" fill="var(--chart-text)" opacity="0.75">Titik merah: DSCR di bawah covenant. Bullet hanya 1 titik — tetapi titik itu = gagal bayar.</text>
<text x="10" y="284" font-size="10" fill="var(--chart-text)" opacity="0.75">Grace: 6 pelanggaran teknis (kuning) = 6 undangan renegosiasi dini, bukan 6 gagal bayar.</text>
</g>
</svg>`;

export const cr40: V2Lesson = {
  slug: "cr40-loan-structuring",
  track: "Credit Risk",
  module: "Analisis Kredit",
  title: "CR40 — Loan Structuring: Merancang Fasilitas yang Selamat",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kredit bagus yang dibunuh strukturnya",
      prose: [
        "PT Sinar Abadi, distributor FMCG yang sehat: laba bersih Rp2,1 miliar setahun, tidak pernah telat bayar ke pemasok, arus kas musiman — ramai saat Lebaran dan Natal, sepi di awal tahun. Bank memberi KMK Rp1,2 miliar tenor 12 bulan, bunga 1% per bulan, struktur bullet: bayar bunga tiap bulan, pokok lunas sekaligus di bulan 12. 'Perusahaannya sehat, strukturnya sederhana,' kata analisnya.",
        "Bulan 1–11 berjalan mulus — bunga Rp12 juta per bulan tidak terasa. Bulan 12 tagihan datang: Rp1,212 miliar sekaligus. Kas perusahaan bulan itu Rp100 juta. Sinar Abadi gagal bayar. Bukan karena bisnisnya jelek — labanya tetap Rp2,1 miliar tahun itu. Ia gagal bayar karena Rp1,2 miliar harus keluar dalam 30 hari sementara uangnya masuk sedikit demi sedikit sepanjang tahun.",
        "Twist-nya: analis tidak salah menilai debitur — ia salah menjahit bajunya. Kredit yang sama dengan struktur grace 3 bulan + angsuran pokok 9 bulan tidak pernah gagal bayar: DSCR terendahnya 0,74 (pelanggaran covenant teknis yang memicu renegosiasi dini), bukan 0,08 (kematian). Debitur yang sama, bisnis yang sama — nasib berbeda, hanya karena struktur.",
        "Setelah lesson ini kamu bisa: (1) mencocokkan struktur pembayaran dengan pola arus kas debitur; (2) menghitung DSCR per periode dan membaca covenant; (3) menjelaskan fungsi grace period, covenant, dan haircut agunan; (4) mengenali struktur yang membunuh kredit bagus. Prasyarat ringkas: DSCR = debt service coverage ratio; covenant = janji kontraktual debitur (mis. DSCR minimal); haircut = diskon atas nilai agunan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sebagian kredit macet bukan lahir dari debitur buruk, melainkan dari struktur yang buta arus kas. Analis yang hanya menilai 'layak atau tidak' tanpa merancang 'bagaimana dibayar' menyerahkan nasib kredit pada kalender — dan kalender tidak bernegosiasi.",
      },
      reference: "Nilai debitur dulu, jahit struktur mengikuti arus kasnya.",
    },
    {
      id: "tenor-grace-aruskas",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tenor dan grace: si penjahit",
      prose: [
        "Structuring adalah menjahit jadwal pembayaran mengikuti pola arus kas debitur. Tiga pola dasar: bullet (bunga berkala, pokok di akhir — cocok untuk proyek dengan exit jelas seperti penjualan aset), amortizing (pokok + bunga dicicil — cocok untuk kas stabil), dan grace period (tenggang awal tanpa cicilan pokok — untuk debitur yang kasnya baru kuat belakangan, mis. ekspansi pabrik).",
        "Kepribadiannya: structurer yang baik adalah 'si penjahit' — ia mengukur dulu (pola kas 12–24 bulan), baru memotong kain (jadwal bayar). Penjahit yang buruk memotong dulu ('standar kami tenor 12 bulan bullet') lalu memaksa debitur muat ke dalamnya. Sinar Abadi adalah korban penjahit buruk: bajunya bagus (limit cukup, bunga wajar), ukurannya salah.",
        "Grace period bukan hadiah — ia pengakuan jujur bahwa kas awal lemah. Syaratnya: ada alasan kas akan menguat (pabrik beroperasi, kontrak dimulai) dan ada covenant yang mengawasi. Grace tanpa alasan = menunda masalah; grace dengan alasan + covenant = memberi napas.",
        "Aturan praktisnya: debt service bulanan tidak boleh melebihi 70–80% dari arus kas konservatif bulan itu — dan 'konservatif' berarti memakai skenario kas lemah, bukan rata-rata optimistis.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: struktur mengikuti kas, bukan sebaliknya",
        body: "Urutan kerja yang benar: (1) petakan arus kas per periode, (2) rancang jadwal bayar yang muat di periode tersempit, (3) baru tentukan tenor dan pricing. Analis yang menentukan tenor dulu ('maunya berapa lama?') lalu memaksakan cicilan sedang menjahit baju tanpa mengukur badan.",
      },
      hints: [
        "Bullet = butuh exit jelas. Amortizing = kas stabil. Grace = kas awal lemah.",
        "Uji struktur pada bulan kas tersempit, bukan rata-rata.",
      ],
      reference: "Ukur kas dulu, potong jadwal kemudian.",
    },
    {
      id: "covenant-dscr",
      eyebrow: "Langkah 3 · Konsep",
      title: "Covenant: kawat pemicu, bukan hukuman",
      prose: [
        "Covenant adalah janji kontraktual debitur yang bila dilanggar memberi bank hak bertindak lebih awal — renegosiasi, menaikkan bunga, atau mempercepat pelunasan. Dua yang paling dipakai: DSCR covenant (DSCR minimal, mis. 1,2x — arus kas harus 20% di atas kewajiban) dan leverage cap (utang terhadap ekuitas maksimal, mis. 3x).",
        "Kesalahpahaman terbesar: covenant sebagai hukuman. Fungsi sebenarnya adalah kawat pemicu (tripwire) — ia berbunyi SEBELUM jurang, memberi bank kursi di meja negosiasi saat debitur masih bisa diajak bicara. Dalam simulasi lesson ini, struktur grace melanggar covenant 6 kali — dan justru itulah yang menyelamatkannya: setiap pelanggaran adalah undangan renegosiasi dini, bukan vonis mati.",
        "Rumusnya:",
      ],
      formula: String.raw`\text{DSCR} = \frac{\text{Arus kas operasi}}{\text{Debt service}}, \qquad \text{LTV}_{\text{efektif}} = \frac{\text{Pinjaman}}{\text{Nilai agunan} \times (1 - \text{haircut})}`,
      formulaNote: "Arus kas operasi = kas masuk dari bisnis per periode; debt service = pokok + bunga jatuh tempo periode itu; haircut = diskon atas nilai agunan (mis. 0,3 = 30%). Contoh lesson ini: bulan 12 struktur bullet — 100/1212 = 0,08, jauh di bawah covenant 1,2. Interpretasi: DSCR di bawah 1 berarti kas tidak cukup membayar utang periode itu; covenant 1,2 memberi bantalan 20%.",
      tasks: [],
      note: {
        title: "🚨 Mitos: covenant dilanggar = debitur nakal",
        type: "pitfall",
        body: "Mitos: 'DSCR di bawah covenant berarti debitur wanprestasi moral.' Yang benar: pelanggaran covenant teknis sering kali soal timing kas musiman, bukan itikad. Bank yang memperlakukan setiap pelanggaran sebagai dosa akan menghancurkan hubungan dengan debitur yang sebenarnya masih bisa diselamatkan — padahal covenant dirancang untuk memicu dialog, bukan eksekusi.",
      },
      reference: "Covenant = tripwire dini. DSCR < 1,2 = ajak bicara, bukan langsung sita.",
    },
    {
      id: "agunan-pricing",
      eyebrow: "Langkah 4 · Konsep",
      title: "Agunan, haircut, dan pricing yang mengikuti struktur",
      prose: [
        "Agunan adalah sabuk pengaman, bukan mesin. Prinsipnya: kredit diberikan karena arus kas cukup membayar (primary source), agunan hanya secondary source bila semuanya gagal. Bank yang menyetujui kredit semata karena agunannya bagus sedang menjalankan bisnis gadai, bukan bisnis kredit — dan akan kecewa saat harus melelang ruko di pasar sepi.",
        "Haircut menerjemahkan keraguan menjadi angka: agunan properti yang likuid mungkin haircut 20–30%, mesin pabrik khusus 40–50%, saham gorengan 50%+. LTV efektif = pinjaman dibagi (nilai agunan × (1 − haircut)). Haircut bukan pesimisme — ia harga dari pertanyaan 'berapa yang benar-benar kembali bila harus jual cepat besok pagi?'",
        "Pricing mengikuti struktur, bukan sebaliknya: tenor lebih panjang, grace period, atau covenant longgar = risiko lebih besar = spread lebih lebar. Struktur bullet 12 bulan untuk kas musiman seharusnya lebih MAHAL daripada amortizing yang aman — karena bank menanggung risiko refinancing. Memberi harga sama untuk struktur berbeda berarti mensubsidi risiko.",
        "Cara membaca figur: dua garis DSCR 12 bulan + garis putus-putus covenant 1,2. Interpretasi: garis bullet (biru) tinggi sepanjang tahun lalu terjun ke titik merah di bulan 12 — kematian mendadak. Garis grace (oranye) bergelombang di sekitar covenant dengan 6 titik kuning — goyang tetapi selamat, karena setiap goyangan memicu dialog.",
      ],
      figure: {
        svg: FIG_DSCR,
        alt: "DSCR per bulan: struktur bullet aman 11 bulan lalu jatuh ke 0,08 di bulan 12; struktur grace berfluktuasi dengan 6 pelanggaran covenant teknis.",
        caption: "Satu titik merah bullet = gagal bayar. Enam titik kuning grace = enam renegosiasi dini.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: agunan bagus = kredit aman",
        type: "pitfall",
        body: "Mitos: 'Agunannya ruko Rp3 miliar untuk pinjaman Rp1,2 miliar — aman.' Yang benar: agunan hanya membantu SETELAH gagal bayar, dan nilainya saat dilelang jarang setinggi saat dinilai. Kredit yang 'aman karena agunan' tetapi DSCR-nya di bawah 1 adalah bom waktu bersabuk pengaman — sabuknya tidak mencegah kecelakaan.",
      },
      reference: "Arus kas = primary. Agunan = secondary. Harga mengikuti risiko struktur.",
    },
    {
      id: "jebakan-struktur",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tiga jebakan perancang struktur",
      prose: [
        "Jebakan 1 — Tenor mengikuti keinginan, bukan kas: debitur minta 12 bulan agar cicilan ringan, analis mengiyakan tanpa memetakan kas. Hasilnya cicilan 'ringan' yang tetap tidak terbayar di bulan sepi. Penangkalnya: tenor adalah OUTPUT dari pemetaan kas, bukan input dari negosiasi.",
        "Jebakan 2 — Covenant tanpa monitoring: covenant ditulis rapi di perjanjian kredit, lalu tidak ada yang menghitung DSCR-nya tiap triwulan. Saat pelanggaran akhirnya ketahuan, debitur sudah 6 bulan di bawah air. Penangkalnya: covenant monitoring masuk ke dashboard KRI (kembali ke CR38) dengan pemilik yang jelas.",
        "Jebakan 3 — Refinancing sebagai rencana: struktur bullet disetujui dengan asumsi 'nanti diperpanjang saja'. Saat jatuh tempo tiba bersamaan dengan pasar yang ketat atau kinerja yang menurun, perpanjangan tidak datang. Penangkalnya: bullet hanya untuk debitur dengan exit yang konkret dan terverifikasi — penjualan aset yang sudah ada pembelinya, atau arus kas masuk terjadwal.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: uji struktur di bulan terburuk",
        body: "Satu-satunya stress test struktur yang penting: bagaimana jadwal ini bertahan di 3 bulan kas tersempit debitur? Jika jawabannya 'harus pinjam lagi untuk bayar cicilan', strukturnya salah — tidak peduli seberapa bagus rata-rata tahunannya.",
      },
      reference: "3 jebakan: tenor ikut keinginan, covenant tak dimonitor, refinancing sebagai rencana.",
    },
    {
      id: "lab-struktur",
      eyebrow: "Langkah 6 · Lab",
      title: "Uji tabrak dua struktur: siapa yang selamat?",
      prose: [
        "Arus kas 12 bulan PT Sinar Abadi (dalam juta Rp) dan dua kandidat struktur sudah tersedia. Tugasmu: bangun jadwal debt service kedua struktur — bullet (bunga 1% per bulan, pokok Rp1,2 miliar lunas bulan 12) dan grace 3 bulan + angsuran pokok 9 bulan (bunga 1% atas sisa) — hitung DSCR per bulan, tandai bulan pelanggar covenant (DSCR < 1,2), dan cetak vonisnya.",
        "Eksplorasi: setelah lolos, ubah covenant dari 1,2 menjadi 1,0 — berapa pelanggaran grace yang hilang? Lalu ubah arus kas bulan 12 dari 100 menjadi 1300 (seolah ada penjualan aset) — apakah bullet masih gagal bayar? Rasakan: struktur yang 'bodoh' bisa selamat bila exit-nya nyata, dan struktur 'pintar' tetap butuh covenant.",
      ],
      tasks: [
        { id: "t1", text: "Bangun list `ds1` (bullet) dan `ds2` (grace + angsuran) sepanjang 12 bulan" },
        { id: "t2", text: "Hitung `dscr1`, `dscr2`, list bulan `langgar1`/`langgar2`, dan DSCR minimum" },
        { id: "t3", text: "Cetak ringkasan kedua struktur dengan vonisnya" },
      ],
      expected: "Struktur bullet: DSCR min 0.08, langgar covenant bulan [12] -> GAGAL BAYAR bulan 12 (risiko refinancing)\nStruktur grace : DSCR min 0.74, langgar covenant bulan [4, 5, 6, 10, 11, 12] -> pelanggaran teknis, renegosiasi dini",
      code: {
        starter: "# Data JANGAN UBAH.\narus = [80,90,100,120,140,160,180,200,180,150,120,100]\nP, r = 1200.0, 0.01\n\n# TULIS KODEMU: t1 jadwal debt service 12 bulan\n# ds1: bullet — bunga tiap bulan, pokok lunas bulan 12\nds1 = []\n# ds2: grace 3 bulan, lalu pokok P/9 per bulan + bunga atas sisa\nds2 = []\n\n# t2: DSCR per bulan dan bulan pelanggar covenant (DSCR < 1.2)\ndscr1 = []\ndscr2 = []\nlanggar1 = []\nlanggar2 = []\ndscr1_min = 0.0\ndscr2_min = 0.0\nn_langgar2 = 0\n\n# t3: cetak ringkasan\n",
        lockLines: 3,
        solution: "# Data JANGAN UBAH.\narus = [80,90,100,120,140,160,180,200,180,150,120,100]\nP, r = 1200.0, 0.01\n\n# TULIS KODEMU: t1 jadwal debt service 12 bulan\n# ds1: bullet — bunga tiap bulan, pokok lunas bulan 12\nds1 = [P*r]*11 + [P*r + P]\n# ds2: grace 3 bulan, lalu pokok P/9 per bulan + bunga atas sisa\nsisa = P\nds2 = []\nfor m in range(1, 13):\n    bunga = sisa*r\n    pokok = 0.0 if m <= 3 else P/9\n    ds2.append(bunga + pokok)\n    sisa -= pokok\n\n# t2: DSCR per bulan dan bulan pelanggar covenant (DSCR < 1.2)\ndscr1 = [cf/d for cf, d in zip(arus, ds1)]\ndscr2 = [cf/d for cf, d in zip(arus, ds2)]\nlanggar1 = [i+1 for i, v in enumerate(dscr1) if v < 1.2]\nlanggar2 = [i+1 for i, v in enumerate(dscr2) if v < 1.2]\ndscr1_min = round(min(dscr1), 2)\ndscr2_min = round(min(dscr2), 2)\nn_langgar2 = len(langgar2)\n\n# t3: cetak ringkasan\nprint(f\"Struktur bullet: DSCR min {dscr1_min:.2f}, langgar covenant bulan {langgar1} -> GAGAL BAYAR bulan 12 (risiko refinancing)\")\nprint(f\"Struktur grace : DSCR min {dscr2_min:.2f}, langgar covenant bulan {langgar2} -> pelanggaran teknis, renegosiasi dini\")\n",
        checks: [
          { kind: "equal", task: "t2", label: "DSCR min bullet = 0,08", msg: "100/1212 di bulan 12 — jurang refinancing.", name: "dscr1_min", value: 0.08, tol: 0.01 },
          { kind: "equal", task: "t2", label: "DSCR min grace = 0,74", msg: "Bulan 12: 100/134,67 — goyang tapi bukan jurang.", name: "dscr2_min", value: 0.74, tol: 0.01 },
          { kind: "contains", task: "t2", label: "langgar1 memuat bulan 12", msg: "Satu-satunya pelanggaran bullet — yang fatal.", name: "langgar1", value: 12 },
          { kind: "equal", task: "t2", label: "6 bulan langgar di grace", msg: "Bulan 4,5,6,10,11,12 — enam undangan dialog.", name: "n_langgar2", value: 6, tol: 0 },
          { kind: "stdout_matches", task: "t3", label: "vonis bullet tercetak", msg: "GAGAL BAYAR bulan 12.", pattern: "GAGAL BAYAR" },
          { kind: "stdout_matches", task: "t3", label: "vonis grace tercetak", msg: "Pelanggaran teknis, renegosiasi dini.", pattern: "renegosiasi dini" },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Memilih struktur: empat skenario",
      prose: [
        "Skenario 1 — Arus kas stabil dan terprediksi (gaji, kontrak jangka panjang): amortizing klasik. Cicilan tetap, DSCR stabil, tidak perlu kreativitas — kesederhanaan adalah fitur.",
        "Skenario 2 — Arus kas musiman (ritel, agri, distributor): jadwal musiman (seasonal schedule) — cicilan mengikuti musim, bukan dibagi rata 12. Atau grace + amortizing seperti Sinar Abadi. Bullet hanya bila ada exit konkret.",
        "Skenario 3 — Kas awal lemah tetapi prospek kuat (ekspansi, pabrik baru): grace period dengan alasan tertulis + covenant ketat sebagai kompensasi. Grace tanpa covenant = hadiah; grace dengan covenant = manajemen risiko.",
        "Skenario 4 — Proyek dengan exit jelas (konstruksi lalu jual, bridging): bullet boleh — dengan syarat exit-nya terverifikasi (pembeli sudah ada, bukan 'nanti dicari') dan ada rencana B bila exit molor.",
        "Aturan praktis 10 detik: petakan kas 12 bulan → uji struktur di 3 bulan tersempit → DSCR < 1 di bulan mana pun = rancang ulang → covenant selalu dipasang dan dimonitor.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: struktur yang baik membosankan",
        body: "Struktur yang baik tidak pernah menjadi cerita — debitur membayar, bank mencatat, semua bosan. Struktur yang buruk selalu menjadi cerita: rapat darurat, memo direksi, pelajaran mahal. Jika rancangan struktummu terdengar 'menarik', curigalah.",
      },
      reference: "Stabil = amortizing. Musiman = seasonal. Awal lemah = grace + covenant. Exit jelas = bullet.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Sinar Abadi, dirancang ulang",
      prose: [
        "Data: pinjaman Rp1,2 miliar, bunga 1%/bulan, arus kas [80,90,100,120,140,160,180,200,180,150,120,100] juta. Struktur awal (bullet): DSCR min 0,08, gagal bayar bulan 12. Alternatif grace 3 bulan + angsuran: DSCR min 0,74, 6 pelanggaran covenant teknis. Pertanyaan: (1) Mengapa analis awal memilih bullet — apa logika yang tampak masuk akal saat itu? (2) Rancangan finalmu: pilih struktur, tetapkan covenant, dan jelaskan pricing-nya.",
        "Pembahasan: (1) Logika semu analis: 'perusahaan sehat, bunga ringan, pokoknya nanti saja' — ia menilai DEBITUR (sehat) bukan ARUS KAS (musiman). Bullet terlihat murah dan sederhana; yang tidak terlihat adalah konsentrasi risiko di satu titik waktu. (2) Rancangan final: grace 3 bulan + angsuran pokok 9 bulan, covenant DSCR minimal 1,2 dengan monitoring triwulanan, pricing +0,25% di atas amortizing standar sebagai kompensasi risiko struktur. Setiap pelanggaran covenant = review otomatis, bukan penalti otomatis. Pelajaran: struktur yang selamat bukan yang tidak pernah goyang — melainkan yang goyangnya terdeteksi dan bisa dinegosiasikan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Selisih biaya antara struktur bullet dan grace+amortizing untuk bank mungkin hanya puluhan juta (selisih bunga dan monitoring). Selisih akibatnya adalah Rp1,2 miliar — gagal bayar vs selamat. Structuring adalah asuransi termurah di perbankan: sedikit kerumitan di awal menghemat bencana di akhir.",
      },
      reference: "Pilih grace + covenant 1,2 + pricing kompensasi. Goyang terdeteksi > aman semu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — struktur adalah keputusan risiko.",
      ],
      tasks: [],
      summary: [
        "Struktur mengikuti pola arus kas: stabil = amortizing, musiman = seasonal, awal lemah = grace, exit jelas = bullet.",
        "DSCR = arus kas operasi / debt service; covenant 1,2 = tripwire dini, bukan hukuman.",
        "Agunan = secondary source; haircut menerjemahkan keraguan menjadi angka.",
        "Pricing mengikuti risiko struktur — struktur berisiko harus lebih mahal.",
        "Uji struktur di bulan kas tersempit, bukan rata-rata.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Distributor dengan kas musiman (sepi awal tahun, ramai akhir tahun) mengajukan KMK Rp1,2 miliar. Struktur terbaik…",
          options: [
            { text: "Bullet 12 bulan — sederhana dan murah", why: "Salah: bullet menumpuk seluruh pokok di satu titik — persis yang membunuh Sinar Abadi.", },
            { text: "Jadwal musiman / grace + angsuran mengikuti pola kas", why: "Benar: struktur harus muat di bulan tersempit, bukan rata-rata.", correct: true },
            { text: "Amortizing cicilan tetap 12 bulan", why: "Salah: cicilan tetap mencekik bulan sepi — lebih baik dari bullet, tetapi bukan yang terbaik.", },
            { text: "Tenor 24 bulan bullet", why: "Salah: memperpanjang bullet hanya memindahkan jurang, bukan menghilangkannya.", },
          ],
        },
        {
          q: "DSCR debitur 1,05 — di bawah covenant 1,2 tetapi di atas 1,0. Respons bank yang tepat…",
          options: [
            { text: "Eksekusi agunan segera", why: "Salah: DSCR > 1 berarti masih bisa membayar; eksekusi adalah respons yang tidak proporsional.", },
            { text: "Aktifkan hak kontraktual: panggil debitur, review, renegosiasi", why: "Benar: itulah fungsi covenant sebagai tripwire — dialog dini, bukan hukuman.", correct: true },
            { text: "Abaikan — masih di atas 1,0", why: "Salah: mengabaikan pelanggaran covenant merusak fungsi peringatan dini.", },
            { text: "Naikkan bunga sebagai denda otomatis", why: "Salah: penalti otomatis tanpa dialog bisa mendorong debitur yang masih viable ke jurang.", },
          ],
        },
        {
          q: "Agunan ruko dinilai Rp3 miliar, haircut 30%, pinjaman Rp1,2 miliar. LTV efektif…",
          options: [
            { text: "40% — sangat aman", why: "Salah: itu LTV tanpa haircut; haircut wajib dihitung.", },
            { text: "57% — 1,2 / (3 × 0,7)", why: "Benar: nilai efektif agunan = 3 × (1 − 0,3) = 2,1; LTV = 1,2/2,1.", correct: true },
            { text: "30% — sebesar haircut-nya", why: "Salah: haircut bukan LTV; ia diskon atas nilai agunan.", },
            { text: "133% — tidak aman", why: "Salah: salah rumus; pinjaman lebih kecil dari nilai efektif agunan.", },
          ],
        },
        {
          q: "Grace period 6 bulan paling tepat diberikan ketika…",
          options: [
            { text: "Debitur memintanya agar cicilan ringan", why: "Salah: keinginan bukan alasan risiko; grace butuh alasan kas yang konkret.", },
            { text: "Kas awal lemah tetapi ada alasan kuat kas akan menguat + covenant dipasang", why: "Benar: grace = pengakuan jujur atas pola kas, dikompensasi pengawasan.", correct: true },
            { text: "Bank ingin terlihat akomodatif ke nasabah besar", why: "Salah: itu keputusan komersial yang mengorbankan prinsip risiko.", },
            { text: "Tidak pernah — grace selalu buruk", why: "Salah: grace untuk pola kas yang tepat adalah structuring yang baik.", },
          ],
        },
        {
          q: "DSCR 0,9 tetapi agunan sangat bagus (LTV efektif 40%). Keputusan kredit…",
          options: [
            { text: "Setujui — agunan menutup risiko", why: "Salah: agunan = secondary source; DSCR < 1 berarti bisnisnya tidak bisa membayar.", },
            { text: "Tolak / rancang ulang struktur — agunan bukan sumber pembayaran", why: "Benar: kredit dibayar dari arus kas, bukan dari lelang ruko.", correct: true },
            { text: "Setujui dengan bunga lebih tinggi", why: "Salah: bunga lebih tinggi tidak memperbaiki arus kas yang tidak cukup.", },
            { text: "Minta tambahan agunan", why: "Salah: menumpuk agunan di atas struktur yang salah tidak menyelamatkan.", },
          ],
        },
      ],
    },
  ],
};
