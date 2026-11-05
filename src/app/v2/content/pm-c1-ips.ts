import type { V2Lesson } from "../lib/types";

// Diagram blok penyusun IPS: objectives dan lima constraints.
const IPS_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Diagram blok IPS: dua objectives return dan risk, lima constraints likuiditas horizon pajak legal unik.">
<rect x="180" y="10" width="160" height="32" rx="6" fill="var(--c1)" opacity="0.15" stroke="var(--c1)" stroke-width="1.5"/>
<text x="260" y="31" font-size="12" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">IPS</text>
<text x="14" y="60" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">OBJECTIVES</text>
<rect x="14" y="66" width="238" height="44" rx="6" fill="var(--c2)" opacity="0.12" stroke="var(--c2)" stroke-width="1.5"/>
<rect x="268" y="66" width="238" height="44" rx="6" fill="var(--c2)" opacity="0.12" stroke="var(--c2)" stroke-width="1.5"/>
<g font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="133" y="84">Return objective</text><text x="387" y="84">Risk tolerance</text></g>
<g font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="133" y="101">target terukur: riil/nominal, neto</text><text x="387" y="101">ability vs willingness</text></g>
<text x="14" y="126" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">CONSTRAINTS — 5C</text>
<g><rect x="14" y="132" width="88" height="70" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/><rect x="112" y="132" width="88" height="70" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/><rect x="210" y="132" width="88" height="70" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/><rect x="308" y="132" width="88" height="70" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/><rect x="406" y="132" width="88" height="70" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/></g>
<g font-size="10.5" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="58" y="156">Likuiditas</text><text x="156" y="156">Horizon</text><text x="254" y="156">Pajak</text><text x="352" y="156">Legal</text><text x="450" y="156">Unik</text></g>
<g font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="58" y="172">kebutuhan kas</text><text x="156" y="172">jangka waktu</text><text x="254" y="172">dampak pajak</text><text x="352" y="172">aturan mengikat</text><text x="450" y="172">etika / ESG</text></g>
</svg>`;

export const pmc1: V2Lesson = {
  slug: "pm-c1-ips",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C1 — Investment Policy Statement",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-pak-darma",
      eyebrow: "Langkah 1 · Cerita",
      title: "Warisan yang habis dimakan pajak",
      prose: [
        "Pak Darma mewarisi portofolio saham Rp5 miliar. Manajernya trading aktif: return bruto 18% per tahun \u2014 mengagumkan. Lima tahun kemudian Pak Darma menghitung: return bersih setelah pajak cuma 11%. Rekannya yang buy-and-hold indeks (12% bruto) justru dapat 11,5% bersih.",
        "Mekanismenya: trading aktif berarti realisasi keuntungan setiap tahun, dan setiap realisasi kena pajak tahun itu juga. Buy-and-hold menunda pajak karena unrealized gain tidak kena pajak. Manajer \u201Chebat\u201D kalah dari strategi \u201Cmalas\u201D \u2014 setelah pajak. Return yang penting adalah yang bisa dibelanjakan.",
        "Inilah fungsi Investment Policy Statement (IPS): dokumen hidup yang ditulis sebelum berinvestasi, berisi tujuan return, toleransi risiko, dan batasan-batasan. IPS adalah kontrak sekaligus jangkar perilaku \u2014 aturan main yang disepakati saat tenang, untuk dipatuhi saat panik.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CReturn bruto 18% selalu lebih baik dari 12%.\u201D Salah: 18% bruto \u2192 11% neto (trading = pajak tahunan); 12% buy-and-hold \u2192 11,5% neto. Tax drag strategi aktif bisa 2\u20137 poin. Bandingkan selalu setelah pajak dan biaya.",
      },
      reference: "Return bruto = pemasaran; return neto = uang.",
    },
    {
      id: "anatomi-ips",
      eyebrow: "Langkah 2 · Anatomi IPS + chart",
      title: "Objectives + lima constraints",
      prose: [
        "IPS punya dua objectives. Return objective: target terukur \u2014 sebutkan real atau nominal, bruto atau neto. Risk tolerance: bedakan kemampuan (ability) dan kemauan (willingness). Muda dengan horizon panjang mampu ambil risiko, tetapi jika panik saat portofolio \u221220%, ia tidak mau \u2014 maka ikuti yang lebih rendah, sambil diedukasi bertahap.",
        "Lalu lima constraints: liquidity (kebutuhan kas), horizon (jangka waktu), taxes (dampak pajak), legal/regulatory (aturan yang mengikat), dan unique (etika, agama, preferensi khusus seperti ESG). IPS Pak Darma misalnya: return 12% nominal bersih pajak, risiko moderat (volatilitas di bawah 14%), likuiditas Rp200 juta per tahun, horizon 15 tahun, pajak diminimalkan lewat penundaan realisasi. Implikasinya jelas: buy-and-hold plus tax-loss harvesting \u2014 dan IPS ini melarang gaya trading manajer lamanya.",
        "IPS juga menentukan disiplin: kapan rebalance (misalnya tahunan, atau jika alokasi menyimpang lebih dari 5%) dan kapan direview (tahunan, plus setiap life event seperti menikah, warisan, atau pensiun). Tanpa IPS, setiap keputusan menjadi reaksi emosi: panik jual, euforia beli.",
        "Cara membaca: diagram dibaca atas ke bawah — IPS di puncak, bercabang ke dua objectives, lalu ke lima constraints.",
        "Interpretasi: objectives menjawab mau ke mana (return) dan seberani apa (risiko); lima constraints menjawab dengan aturan main apa — setiap keputusan portofolio harus lolos keenam kotak ini, atau IPS-nya hanya pajangan.",
      ],
      figure: {
        svg: IPS_SVG,
        alt: "Diagram blok IPS: dua objectives dan lima constraints.",
        caption: "Anatomi IPS: dua objectives (return, risk) dan lima constraints (likuiditas, horizon, pajak, legal, unik).",
      },
      note: {
        title: "Intuisi: IPS adalah kontrak dengan dirimu yang panik",
        body: "Praktisi senior menulis IPS bukan untuk klien yang tenang, melainkan untuk klien yang akan panik tiga tahun kemudian. Tiga heuristik yang dipakai di lapangan: pertama, IPS yang bagus dibaca dalam 10 menit oleh orang awam — kalau butuh gelar CFA untuk memahaminya, ia akan mati di laci. Kedua, bagian terpenting bukan target return-nya, melainkan aturan rebalancing dan kapan boleh dilanggar; klien jarang gagal karena targetnya salah, sering gagal karena tidak ada aturan saat pasar jatuh 25%. Ketiga, tulis IPS seolah klien akan menuntutmu: setiap kalimat harus bisa dipertahankan di depan arbiter — “risiko moderat” tidak bisa dipertahankan, “volatilitas tahunan di bawah 12% dengan drawdown maksimum 15%” bisa. IPS yang kabur melindungi ego penasihat; IPS yang tajam melindungi uang klien. Keempat, IPS yang tidak pernah dilanggar sekali pun dalam lima tahun kemungkinan terlalu longgar \u2014 pelanggaran sesekali yang tercatat dan dibahas justru bukti IPS-nya bekerja sebagai alat ukur, bukan pajangan. Kelima, untuk klien institusi, IPS harus menyebut nama siapa yang boleh mengubahnya dan dengan kuorum berapa; IPS yang bisa diubah satu orang via pesan singkat bukan IPS.",
      },
      tasks: [],
      reference: "Objectives: return + risk (mampu vs mau). Constraints: likuiditas, horizon, pajak, legal, unique.",
    },
    {
      id: "lab-harvesting",
      eyebrow: "Langkah 3 · Lab tax-loss harvesting",
      title: "Panen rugi untuk menghemat pajak",
      prose: [
        "Tax-loss harvesting: jual posisi yang rugi untuk mengakui kerugian, sehingga meng-offset keuntungan dan pajaknya menyusut \u2014 lalu beli kembali eksposur sejenis agar alokasi tetap terjaga. Prinsipnya: tunda realisasi keuntungan (unrealized tidak kena pajak), percepat realisasi kerugian. Waspadai wash sale: jangan beli kembali aset identik dalam waktu singkat agar kerugiannya diakui.",
        "Skenario: saham A untung Rp500 juta (unrealized), saham B rugi Rp200 juta. Tarif pajak 20%. Hitung pajak jika hanya menjual A, pajak jika menjual keduanya (panen B), dan penghematannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pajak_tanpa` (jual A saja) dan `net_gain`" },
        { id: "t2", text: "Hitung `pajak_dengan` dan `hemat`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "pajak_tanpa=100  pajak_dengan=60  hemat=40  (Rp juta)",
      hints: [
        "Pajak tanpa panen = seluruh untung A \u00D7 tarif.",
        "net_gain = untung A \u2212 rugi B (tidak boleh negatif).",
        "hemat = pajak_tanpa - pajak_dengan",
      ],
      code: {
        starter: `# Tax-loss harvesting (Rp juta)\nUNTUNG_A, RUGI_B, TARIF = 500, 200, 0.20\n\n# TULIS KODEMU\npajak_tanpa = \nnet_gain = \npajak_dengan = \nhemat = \n\nprint(f"pajak_tanpa={pajak_tanpa:.0f}  pajak_dengan={pajak_dengan:.0f}  hemat={hemat:.0f}")`,
        lockLines: 1,
        solution: `# Tax-loss harvesting (Rp juta)\nUNTUNG_A, RUGI_B, TARIF = 500, 200, 0.20\n\n# TULIS KODEMU\npajak_tanpa = UNTUNG_A * TARIF\nnet_gain = max(0, UNTUNG_A - RUGI_B)\npajak_dengan = net_gain * TARIF\nhemat = pajak_tanpa - pajak_dengan\n\nprint(f"pajak_tanpa={pajak_tanpa:.0f}  pajak_dengan={pajak_dengan:.0f}  hemat={hemat:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pajak_tanpa", value: 100, tol: 1e-9, label: "`pajak_tanpa` = 100", msg: "500 \u00D7 0,20 = 100. Ini pajak jika A dijual tanpa memanen B." },
          { kind: "equal", task: "t1", name: "net_gain", value: 300, tol: 1e-9, label: "`net_gain` = 300", msg: "500 \u2212 200 = 300. Kerugian B meng-offset keuntungan A." },
          { kind: "equal", task: "t2", name: "pajak_dengan", value: 60, tol: 1e-9, label: "`pajak_dengan` = 60", msg: "300 \u00D7 0,20 = 60." },
          { kind: "equal", task: "t2", name: "hemat", value: 40, tol: 1e-9, label: "`hemat` = 40", msg: "100 \u2212 60 = 40. Rugi Rp200 juta menjadi penghemat pajak Rp40 juta." },
          { kind: "stdout_matches", task: "t3", pattern: "pajak_tanpa=100\\s+pajak_dengan=60\\s+hemat=40", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tunda realisasi untung; percepat realisasi rugi; waspadai wash sale.",
    },
    {
      id: "institusi",
      eyebrow: "Langkah 4 · Institusi",
      title: "Private wealth vs institusi: beda spesies",
      prose: [
        "Private wealth adalah individu: pajak personal, horizon mengikuti umur, bias behavioral kuat, kebutuhan likuiditas personal. Institusi punya kewajiban \u2014 dan kewajiban menentukan strategi, bukan return impian.",
        "Empat tipe utama. DB pension membayar manfaat pasti: risk objective-nya adalah funded ratio (aset dibagi PV liabilitas), bukan volatilitas absolut. Contoh: aset Rp800 miliar, PV liabilitas Rp1 triliun \u2192 funded 80%, defisit Rp200 miliar. Strateginya liability-driven investing (LDI): cocokkan durasi aset dengan liabilitas, lalu tutup defisit lewat kontribusi bertahap \u2014 bukan kejar return dengan saham 90% yang bisa melebarkan defisit saat pasar jatuh. Endowment/yayasan: horizon abadi dengan spending rule sekitar 5% per tahun. Asuransi: liabilitas plus regulasi ketat. Bank/SWF: likuiditas dan regulasi.",
        "Yayasan Rp10 miliar yang ingin belanja Rp500 juta per tahun selamanya butuh 5% spending + 3% inflasi = 8% nominal neto \u2014 agresif. Jika return riilnya 6%, maka 6% \u2212 5% \u2212 3% = \u22122% per tahun: modal tergerus. Matematika tidak bernegosiasi: turunkan spending atau terima volatilitas lebih tinggi.",
      ],
      formula: String.raw`\text{Funded Ratio} = \frac{\text{Aset}}{PV(\text{Liabilitas})}`,
      tasks: [],
      formulaNote: "Funded ratio mengukur kemampuan bayar kewajiban: pembilang = nilai pasar aset hari ini; penyebut = nilai kini (present value) seluruh janji manfaat masa depan yang didiskonto dengan tingkat diskonto aktuaria. Rasio 80% artinya tiap Rp1 janji hanya didukung Rp0,80 aset — defisit Rp0,20 harus ditutup lewat kontribusi sponsor atau return berlebih. Kenapa bukan return absolut? Karena liabilitas ikut bergerak: saat suku bunga turun, PV liabilitas naik (durasi panjang), jadi portofolio yang “untung 10%” bisa tetap memperburuk funded ratio bila liabilitasnya naik 15%. Itulah alasan dana pensiun memakai LDI, bukan sekadar kejar return.",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Godaan dana pensiun defisit adalah \u201Ckejar return untuk menutup defisit\u201D. Bahayanya: saat pasar jatuh, aset turun sementara liabilitas tidak \u2014 defisit justru meledak. LDI menstabilkan funded ratio dulu; return-seeking dipisahkan.",
      },
      reference: "IPS institusi dimulai dari kewajiban, bukan dari return impian.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Kuis tengah",
      title: "Cek cepat: IPS dan institusi",
      prose: ["Dua pertanyaan sebelum lanjut ke peta keputusan."],
      tasks: [],
      quiz: [
        {
          q: "Klien: kemampuan ambil risiko tinggi (horizon panjang), tetapi kemauan konservatif (panik saat \u221220%). Risk tolerance di IPS?",
          options: [
            { text: "Tinggi \u2014 ikuti kemampuan", why: "Salah: risiko yang tidak bisa ditahan berujung panic selling di titik terburuk." },
            { text: "Konservatif \u2014 ikuti yang terendah, sambil diedukasi", why: "Tepat: ikuti kemauan dulu agar klien bertahan; naikkan bertahap lewat edukasi.", correct: true },
            { text: "Moderat \u2014 ambil tengahnya", why: "Salah: kompromi angka tidak menyelesaikan masalah perilaku; yang dipakai adalah sisi terendah." },
            { text: "Agresif \u2014 klien muda harus agresif", why: "Salah: umur menentukan kemampuan, bukan kemauan. Memaksa = resep panic selling." },
          ],
        },
        {
          q: "Dana pensiun DB: aset Rp800 miliar, PV liabilitas Rp1 triliun. Strategi yang tepat?",
          options: [
            { text: "All-in saham untuk kejar return menutup defisit", why: "Salah: jika pasar jatuh, aset turun dan liabilitas tidak \u2014 defisit meledak." },
            { text: "LDI: cocokkan durasi aset-liabilitas + kontribusi bertahap", why: "Tepat: stabilkan funded ratio dulu dengan hedging portfolio; defisit ditutup via kontribusi.", correct: true },
            { text: "Tarik semua ke kas agar aman", why: "Salah: kas tidak tumbuh; defisit tidak pernah tertutup dan kewajiban tetap berjalan." },
            { text: "Abaikan defisit, fokus ke return absolut", why: "Salah: benchmark dana pensiun adalah kewajibannya, bukan indeks pasar." },
          ],
        },
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Lima keputusan sebelum produk",
      prose: [
        "Peta keputusan lesson ini. (1) Klien baru \u2192 IPS tertulis dulu sebelum bicara produk: diagnosis sebelum resep. (2) Kemampuan tinggi tetapi kemauan rendah \u2192 ikuti kemauan, edukasi bertahap; risiko yang tidak bisa ditahan adalah risiko yang merugikan. (3) Akun kena pajak plus posisi rugi \u2192 tax-loss harvesting tiap Desember: ubah rugi menjadi pengurang pajak. (4) Alokasi antar-akun \u2192 asset location: aset tidak efisien pajak (obligasi, REIT) di akun tax-deferred, aset efisien (saham growth) di akun kena pajak. (5) Setiap keputusan portofolio \u2192 IPS tertulis sebagai jangkar, dan selalu hitung neto setelah pajak.",
        "Aturan 10 detik: IPS dulu, produk kemudian. Ikuti risk terendah (mampu vs mau). Yang dihitung = setelah pajak. Panen rugi, tunda untung.",
      ],
      tasks: [],
      reference: "Asset location: taruh \u201Ces di freezer\u201D \u2014 aset bocor pajak di akun terlindung.",
    },
    {
      id: "minicase-15-tahun",
      eyebrow: "Langkah 6 · Mini-case",
      title: "0,5% per tahun \u00D7 15 tahun = Rp1,7 miliar",
      prose: [
        "Kembali ke Pak Darma: Rp5 miliar, horizon 15 tahun. Manajer A (trading aktif): 11% neto. Manajer B (buy-and-hold): 11,5% neto. Hitung nilai akhirnya. A: 5 miliar \u00D7 1,11^15 = Rp23,9 miliar. B: 5 miliar \u00D7 1,115^15 = Rp25,6 miliar. Selisih: Rp1,7 miliar (7%) \u2014 hanya dari 0,5 poin persen per tahun.",
        "Pelajaran: kecil dan konsisten mengalahkan besar dan bocor. Angka 18% \u201Cbruto\u201D adalah ilusi; 11,5% neto adalah uang betulan. Tiga argumen untuk meyakinkan Pak Darma memilih B: tunjukkan selisih Rp1,7 miliar sebagai uang nyata; ingatkan biaya tersembunyi A (volatilitas, biaya, stres harian); dan tunjukkan IPS yang ia tanda tangani saat tenang \u2014 \u201Cmari kita patuhi kesepakatan ini.\u201D",
        "Tiga aksi tax-aware di tahun pertama: ganti ke strategi buy-and-hold, terapkan asset location (obligasi ke akun pensiun), dan jadwalkan panen rugi setiap Desember.",
      ],
      tasks: [],
      reference: "A: 5M \u00D7 1,11^15 = Rp23,9M. B: 5M \u00D7 1,115^15 = Rp25,6M. Selisih Rp1,7M.",
    },

    {
      id: "ips-mini-dokter",
      eyebrow: "Langkah 7 · Studi kasus IPS",
      title: "IPS mini: dokter 45 tahun, target Rp8 miliar",
      prose: [
        "Tulis satu IPS lengkap untuk kasus konkret. Klien: dr. Sinta, 45 tahun, dokter gigi, penghasilan bersih Rp1,2 miliar per tahun, tabungan investasi saat ini Rp2 miliar. Tujuan: dana pensiun Rp8 miliar di usia 65 (horizon 20 tahun). Anak sulung masuk kuliah 3 tahun lagi, butuh Rp400 juta tunai. Rumah sudah lunas. Preferensi: tidak mau portofolio berisi emiten rokok.",
        "Return objective dihitung dari kebutuhan, bukan dari keinginan. Rp2 miliar harus menjadi Rp8 miliar dalam 20 tahun: required return = (8/2)^(1/20) − 1 = 7,2% nominal per tahun. Dengan inflasi 3,5%, itu setara 3,6% riil \u2014 target yang masuk akal tanpa judi. IPS menuliskannya eksplisit: \u201CTarget return nominal bersih pajak dan biaya: 7,2% per tahun. Target riil: 3,6%.\u201D Bukan \u201Csetinggi-tingginya\u201D.",
        "Risk tolerance: kemampuan (ability) moderat-agresif \u2014 horizon 20 tahun dan penghasilan stabil; kemauan (willingness) moderat \u2014 dr. Sinta gelisah jika portofolio turun lebih dari 15%. IPS memakai yang terendah: \u201CVolatilitas tahunan ditargetkan di bawah 12%; penurunan maksimum yang ditoleransi 15%; bila terlampaui, penasihat wajib menghubungi klien dalam 5 hari kerja.\u201D",
        "Constraints: likuiditas \u2014 Rp400 juta harus tersedia dalam 3 tahun, diparkir di deposito/SBN tenor pendek, di luar portofolio inti; horizon \u2014 20 tahun dengan sub-horizon 3 tahun untuk kebutuhan kuliah; pajak \u2014 akun kena pajak, maka strategi buy-and-hold plus panen rugi tahunan, realisasi keuntungan ditunda; legal \u2014 tidak ada batasan material; unique \u2014 eksklusi emiten rokok. Implikasi portofolio: 70% ekuitas global/domestik, 20% obligasi, 10% kas \u2014 dengan Rp400 juta likuiditas di luar hitungan ini.",
        "Disiplin tertulis: rebalancing tahunan setiap Januari, atau lebih cepat bila ada kelas aset menyimpang lebih dari 5 poin persen dari target; review IPS tahunan setiap ulang tahun klien; review luar jadwal bila terjadi life event (pensiun dini, sakit berat, warisan) atau perubahan material (aturan pajak berubah, tujuan berubah lebih dari 10%). IPS ditandatangani kedua belah pihak \u2014 kontrak, bukan brosur.",
      ],
      tasks: [],
      reference: "IPS mini = tujuan terukur (7,2% nominal) + risiko terendah (vol <12%, DD 15%) + 5 constraints + aturan rebalance & review.",
    },
    {
      id: "ips-gagal-revisi",
      eyebrow: "Langkah 8 · Pitfall tingkat lanjut",
      title: "Tiga cara IPS gagal \u2014 dan kapan wajib direvisi",
      prose: [
        "IPS gagal pertama: tujuan kabur. \u201CReturn sebesar-besarnya dengan risiko sekecil-kecilnya\u201D bukan tujuan \u2014 itu doa. Uji tajamnya: bisakah orang ketiga mengukur dari rekening koran apakah tujuan tercapai? \u201C7,2% nominal bersih pajak, vol di bawah 12%\u201D lolos uji; \u201Cgrowing wealth\u201D tidak. Setiap kalimat IPS yang tidak bisa diukur adalah kalimat yang akan dipakai untuk membenarkan apa pun nanti.",
        "IPS gagal kedua: goal creep tanpa penyesuaian. Setahun kemudian dr. Sinta menambah tujuan: rumah kedua Rp3 miliar, tanpa menambah tabungan. Target baru: Rp11 miliar dari Rp2 miliar dalam 20 tahun \u2192 required return = (11/2)^(1/20) − 1 = 8,9%. Naik 1,7 poin berarti lompatan risiko yang besar \u2014 dari moderat ke agresif. Aturan praktisi: setiap tujuan baru wajib addendum IPS tertulis dengan hitungan ulang return dan risiko; tidak ada \u201Cnanti saja\u201D. Klien yang menolak menandatangani addendum sebenarnya menolak risikonya \u2014 dan itu informasi berharga.",
        "IPS gagal ketiga: mati di laci. IPS tanpa kalender review dan tanpa aturan rebalancing adalah dekorasi. Praktik yang bekerja: review tahunan terjadwal (bukan \u201Ckalau sempat\u201D), ambang rebalancing eksplisit (5 poin persen), dan IPS diary \u2014 setiap kali keputusan menyimpang dari IPS, catat tanggal, alasan, dan siapa yang meminta. Diary ini dua gunanya: audit trail untuk fidusia, dan cermin perilaku klien (tiga pelanggaran dalam setahun = risk tolerance di IPS terlalu agresif, turunkan).",
        "Kapan IPS WAJIB direvisi \u2014 bukan opsional: (1) life event material: menikah, cerai, kelahiran, kematian pasangan, pensiun dini, sakit berat; (2) perubahan tujuan atau kebutuhan likuiditas lebih dari 10%; (3) perubahan regulasi/pajak yang mengubah implikasi strategi; (4) pergeseran risk tolerance yang terbukti dari perilaku berulang, bukan dari satu episode panik. Revisi = tulis ulang bagian yang berubah, tanda tangani ulang, arsipkan versi lama. IPS versi 3 yang rapi mengalahkan IPS versi 1 yang sempurna tapi usang.",
      ],
      tasks: [],
      reference: "Uji IPS: terukur, addendum untuk tiap tujuan baru, kalender review + diary pelanggaran.",
    },

    {
      id: "lab-required-return",
      eyebrow: "Langkah 9 · Lab required return",
      title: "Dari tujuan ke angka: berapa return yang wajib diraih?",
      prose: [
        "Return objective yang jujur dihitung mundur dari tujuan, bukan ditebak dari optimisme. Rumusnya: r = (FV/PV)^(1/n) − 1. Skenario dr. Sinta: FV = Rp8.000 juta, PV = Rp2.000 juta, n = 20 tahun. Hitung r_butuh, lalu uji: dengan return realistis 9% nominal, berapa nilai akhirnya dan apakah tujuan tercapai?",
        "Angka ini adalah jantung IPS: ia mengubah \u201Csaya ingin pensiun nyaman\u201D menjadi \u201Csaya butuh 7,2% per tahun\u201D \u2014 dan dari situ penasihat tahu apakah alokasi yang diusulkan masuk akal atau khayalan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `r_butuh` dari FV, PV, dan TAHUN" },
        { id: "t2", text: "Hitung `fv_realistis` dengan return 9% dan flag `cukup`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "r_butuh=7.2%  fv_realistis=11209  cukup=True  (Rp juta)",
      hints: [
        "r_butuh = (FV/PV) ** (1/TAHUN) - 1",
        "fv_realistis = PV * (1 + r_realistis) ** TAHUN",
        "cukup = fv_realistis >= FV",
      ],
      code: {
        starter: `# Required return dari tujuan (Rp juta)\nFV, PV, TAHUN = 8000, 2000, 20\nR_REALISTIS = 0.09\n\n# TULIS KODEMU\nr_butuh = \nfv_realistis = \ncukup = \n\nprint(f"r_butuh={r_butuh*100:.1f}%  fv_realistis={fv_realistis:.0f}  cukup={cukup}")`,
        lockLines: 1,
        solution: `# Required return dari tujuan (Rp juta)\nFV, PV, TAHUN = 8000, 2000, 20\nR_REALISTIS = 0.09\n\n# TULIS KODEMU\nr_butuh = (FV / PV) ** (1 / TAHUN) - 1\nfv_realistis = PV * (1 + R_REALISTIS) ** TAHUN\ncukup = fv_realistis >= FV\n\nprint(f"r_butuh={r_butuh*100:.1f}%  fv_realistis={fv_realistis:.0f}  cukup={cukup}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r_butuh", value: 0.0718, tol: 0.002, label: "`r_butuh` \u2248 7,2%", msg: "(8000/2000)^(1/20) \u2212 1 \u2248 0,0718. Inilah target return nominal IPS." },
          { kind: "equal", task: "t2", name: "fv_realistis", value: 11209, tol: 5, label: "`fv_realistis` \u2248 11209", msg: "2000 \u00D7 1,09^20 \u2248 11209. Dengan 9%, tujuan Rp8.000 juta terlampaui." },
          { kind: "equal", task: "t2", name: "cukup", value: true, tol: 1e-9, label: "`cukup` = True", msg: "11209 \u2265 8000 \u2192 True. Target 7,2% realistis dicapai dengan alokasi moderat." },
          { kind: "stdout_matches", task: "t3", pattern: "r_butuh=7\\.2%\\s+fv_realistis=11209\\s+cukup=True", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "r = (FV/PV)^(1/n) \u2212 1: tujuan \u2192 angka \u2192 uji kewajaran.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Empat pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "IPS = objectives (return terukur; risk: kemampuan vs kemauan, ikuti terendah) + lima constraints + disiplin rebalance dan review.",
        "Yang dihitung selalu return setelah pajak dan biaya \u2014 tax drag strategi aktif bisa 2\u20137 poin.",
        "Tax-loss harvesting: panen rugi untuk meng-offset gain; asset location menaruh aset bocor-pajak di akun terlindung.",
        "Institusi dimulai dari kewajiban: DB pension memakai LDI dan funded ratio; endowment memakai spending rule.",
        "IPS adalah dokumen hidup: review tahunan dan setiap life event; melanggarnya adalah pelanggaran fidusia.",
      ],
      next: { label: "C2 \u2014 Capital Market Expectations", href: "/learn/pm-c2-capital-market-expectations" },
      quiz: [
        {
          q: "dr. Sinta: Rp2 miliar harus menjadi Rp8 miliar dalam 20 tahun. Required return nominal?",
          options: [
            { text: "\u22487,2% per tahun", why: "Tepat: (8/2)^(1/20) \u2212 1 \u2248 7,2%. Inilah return objective yang ditulis di IPS, bukan tebakan.", correct: true },
            { text: "\u22484% per tahun", why: "Salah: itu mendekati target riil (7,2% \u2212 inflasi 3,5% \u2248 3,6%), bukan nominal." },
            { text: "\u224812% per tahun", why: "Salah: 12% akan menghasilkan Rp19,3 miliar \u2014 jauh di atas kebutuhan dan memaksa risiko berlebih." },
            { text: "Tidak bisa dihitung tanpa tahu inflasi", why: "Salah: required return nominal dihitung dari FV/PV/nominal; inflasi hanya mengubah interpretasi riilnya." },
          ],
        },
        {
          q: "Klien menambah tujuan rumah kedua Rp3 miliar tanpa menambah modal. Langkah penasihat yang benar?",
          options: [
            { text: "Diam saja, nanti disesuaikan sendiri", why: "Salah: goal creep diam-diam menaikkan required return ke 8,9% tanpa persetujuan risiko." },
            { text: "Addendum IPS: hitung ulang required return & risiko, tanda tangani ulang", why: "Tepat: tiap tujuan baru = IPS addendum tertulis. Penolakan menandatangani justru sinyal risk tolerance.", correct: true },
            { text: "Naikkan alokasi saham diam-diam agar return naik", why: "Salah: mengubah risiko tanpa persetujuan tertulis adalah pelanggaran fidusia." },
            { text: "Tolak mentah-mentah tujuan barunya", why: "Salah: tugas penasihat menghitung konsekuensinya, bukan melarang; keputusan tetap milik klien yang terinformasi." },
          ],
        },
        {
          q: "Manajer A: 18% bruto (trading aktif). Manajer B: 12% (buy-and-hold). Pajak 20%. Mana yang menang?",
          options: [
            { text: "A \u2014 18% jelas lebih besar", why: "Salah: itu angka bruto. Setelah pajak tahunan, A tinggal 11% neto." },
            { text: "B \u2014 11,5% vs 11% neto", why: "Tepat: tax drag tahunan menggerogoti compounding A. Bandingkan selalu setelah pajak dan biaya.", correct: true },
            { text: "Sama saja", why: "Salah: selisih 0,5 poin per tahun \u00D7 15 tahun = Rp1,7 miliar dari Rp5 miliar." },
            { text: "Tidak bisa dihitung", why: "Bisa: A \u2192 11% neto, B \u2192 11,5% neto. Angkanya ada di lesson ini." },
          ],
        },
        {
          q: "Saham A untung Rp500 juta, saham B rugi Rp200 juta, tarif 20%. Berapa hemat pajak via harvesting?",
          options: [
            { text: "Rp0 \u2014 rugi tidak berguna", why: "Salah: kerugian justru bisa diakui untuk meng-offset keuntungan." },
            { text: "Rp40 juta", why: "Tepat: (500\u2212200)\u00D720% = 60 vs 500\u00D720% = 100 \u2192 hemat 40.", correct: true },
            { text: "Rp100 juta", why: "Itu pajak penuh tanpa harvesting (500\u00D720%), bukan penghematannya." },
            { text: "Rp200 juta", why: "Itu nominal kerugiannya, bukan penghematan pajaknya (rugi \u00D7 tarif)." },
          ],
        },
        {
          q: "Asset location yang benar?",
          options: [
            { text: "Obligasi di akun kena pajak", why: "Salah: bunga obligasi kena pajak tahunan \u2014 menaruhnya di akun kena pajak memaksimalkan kebocoran." },
            { text: "Aset tidak efisien pajak (obligasi) di tax-deferred", why: "Tepat: taruh es di freezer \u2014 aset bocor pajak di akun terlindung; saham growth yang efisien di akun kena pajak.", correct: true },
            { text: "Acak saja, tidak berpengaruh", why: "Salah: penempatan yang tepat menambah 0,5\u20131% per tahun tanpa risiko tambahan." },
            { text: "Semua di satu akun", why: "Salah: itu membuang manfaat akun tax-deferred." },
          ],
        },
        {
          q: "Rp5 miliar, 15 tahun. A: 11% neto vs B: 11,5% neto. Selisih nilai akhir dan pelajarannya?",
          options: [
            { text: "Rp0,5 miliar \u2014 tidak material", why: "Salah hitung: selisihnya Rp1,7 miliar, bukan 0,5." },
            { text: "Rp1,7 miliar (7%) \u2014 kecil & konsisten mengalahkan besar & bocor", why: "Tepat: 5M\u00D71,11^15 = 23,9M vs 5M\u00D71,115^15 = 25,6M.", correct: true },
            { text: "Sama \u2014 pajak tidak berpengaruh jangka panjang", why: "Salah: justru makin panjang horizon, makin besar efek compounding dari pajak yang ditunda." },
            { text: "A menang \u2014 18% bruto lebih besar", why: "Salah: 18% itu bruto sebelum pajak tahunan; yang dibandingkan adalah 11% vs 11,5% neto." },
          ],
        },
      ],
    },
  ],
};
