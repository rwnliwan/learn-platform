import type { V2Lesson } from "../lib/types";

const FIG_PILLARS = `<svg viewBox="0 0 480 260" role="img" aria-label="Tiga pilar Basel.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Tiga pilar Basel</text>
<rect x="30" y="60" width="130" height="120" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="95" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Pilar 1</text>
<text x="95" y="120" font-size="10" fill="var(--chart-text)" text-anchor="middle">Modal minimum</text>
<text x="95" y="140" font-size="10" fill="var(--chart-text)" text-anchor="middle">ATMR × 8%</text>
<rect x="175" y="60" width="130" height="120" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="240" y="95" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Pilar 2</text>
<text x="240" y="120" font-size="10" fill="var(--chart-text)" text-anchor="middle">Supervisi (ICAAP,</text>
<text x="240" y="140" font-size="10" fill="var(--chart-text)" text-anchor="middle">SREP)</text>
<rect x="320" y="60" width="130" height="120" rx="8" fill="var(--c4)" opacity="0.35" stroke="var(--c4)" stroke-width="2"/>
<text x="385" y="95" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Pilar 3</text>
<text x="385" y="120" font-size="10" fill="var(--chart-text)" text-anchor="middle">Disiplin pasar:</text>
<text x="385" y="140" font-size="10" fill="var(--chart-text)" text-anchor="middle">ungkap ke publik</text>
<text x="240" y="220" font-size="11" fill="var(--chart-text)" text-anchor="middle">Pilar 3 = pasar ikut mengawasi bank lewat keterbukaan.</text>
</g>
</svg>`;

export const rr24: V2Lesson = {
  slug: "rr24-pillar3-disclosure",
  track: "Risk Reporting",
  module: "Keterbukaan Basel",
  title: "RR24 — Pillar 3 Disclosure: Disiplin Pasar lewat Keterbukaan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Analis yang membaca laporanmu",
      prose: [
        "Analis saham di sebuah sekuritas membuka laporan Pilar 3 dua bank pesaing. Bank A: tabel KM1 lengkap, OV1 rinci, narasi risiko jelas — ia memberi rekomendasi BELI. Bank B: template seadanya, angka tanpa konteks — ia memberi rekomendasi TAHAN dengan catatan 'keterbukaan terbatas'. Selisih valuasi: 15%.",
        "Twist-nya: kedua bank sama sehatnya secara modal. Yang membedakan adalah KETERBUKAAN. Pilar 3 Basel adalah mekanisme 'disiplin pasar': bank wajib mengungkapkan risiko dan permodalannya ke publik agar pasar bisa menilai dan 'menghukum' yang buram. Laporan Pilar 3 yang baik = modal yang lebih murah. Setelah lesson ini kamu bisa: (1) menjelaskan tiga pilar Basel; (2) membaca tabel KM1 & OV1; (3) menghitung rasio permodalan; (4) memeriksa kelengkapan disclosure.",
        "Mekanisme disiplin pasar dalam praktik: bank dengan disclosure buruk membayar spread kredit 20-50bps lebih mahal di pasar obligasi \u2014 investor menuntut premi ketidakpastian. Untuk bank dengan obligasi Rp10 triliun, 30bps = Rp30 miliar/tahun biaya tambahan. Keterbukaan bukan biaya compliance; ia penghematan biaya dana. Hitungan inilah yang meyakinkan CFO.",
        "Satu nuansa penting: disiplin pasar bekerja paling baik saat informasinya BISA DIBANDINGKAN. Inilah alasan template standar — tanpa format seragam, setiap bank melaporkan dengan caranya sendiri dan perbandingan menjadi mustahil. Standardisasi = komparabilitas = disiplin. Jangan ‘kreatif’ dengan format template; kreativitasmu tempatkan di narasi.",
        "Latihan membaca cepat: ambil laporan Pilar 3 bank manapun, cari tabel KM1, dan jawab dalam 2 menit — (a) berapa CET1 ratio dan trennya? (b) berapa buffer di atas minimum? (c) porsi CET1 dari total modal? Bila kamu bisa menjawab tiga ini dengan lancar, kamu sudah membaca seperti analis profesional. Ulangi untuk 3 bank dan bandingkan.",
        "Satu alat bantu: buat spreadsheet perbandingan peer dengan kolom — bank, CET1, Tier 1, Total CAR, NPL, LCR, tanggal publikasi. Update tiap kuartal. Dalam 1 tahun kamu punya database tren industri yang bahkan banyak analis profesional tidak punya. Data yang terstruktur = keunggulan analitis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "OJK mengadopsi kerangka Basel termasuk kewajiban publikasi (SEOJK transparansi). Analis risk reporting yang bisa menyusun Pilar 3 = analis yang langsung produktif di bank — ini keterampilan kerja hari pertama.",
      },
      reference: "Pilar 3 = pasar mengawasi. Keterbukaan = valuasi.",
    },
    {
      id: "pilar",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga pilar: modal, supervisi, pasar",
      prose: [
        "Basel berdiri di tiga pilar. Pilar 1: persyaratan modal MINIMUM — bank harus punya modal ≥ 8% dari ATMR (aset tertimbang menurut risiko), dengan komposisi berkualitas (CET1 ≥ 4,5%). Pilar 2: tinjauan SUPERVISI — bank menilai sendiri kecukupan modalnya (ICAAP), regulator menilai (SREP) dan bisa meminta modal tambahan. Pilar 3: DISIPLIN PASAR — bank mengungkapkan risiko, permodalan, dan manajemen risikonya ke publik.",
        "Logikanya: Pilar 1 = aturan main; Pilar 2 = wasit; Pilar 3 = penonton yang ikut menilai. Tanpa Pilar 3, hanya regulator yang tahu kondisi bank — pasar buta. Dengan Pilar 3, analis, investor, dan deposan bisa membandingkan dan menekan bank yang berisiko lewat harga (saham turun, biaya dana naik).",
        "Tiga miskonsepsi. Satu: 'Pilar 3 = laporan tahunan.' Bukan — ia template TERSTANDAR (KM1, OV1, dst.) dengan frekuensi kuartalan/semesteran, bukan narasi bebas. Dua: 'Hanya untuk bank besar.' Cakupan bertingkat — bank besar lebih rinci, tetapi prinsipnya berlaku umum. Tiga: 'Yang penting angkanya.' Narasi kualitatif (strategi risiko, tata kelola) adalah bagian wajib — angka tanpa konteks tidak bisa dinilai.",
        "Evolusi Pilar 3: Basel merevisi kerangka ini pada 2015 dan 2017 \u2014 menambah template, memperketat frekuensi, menyeragamkan format agar bisa dibandingkan antar bank dan antar negara. Arahnya satu: semakin rinci, semakin sering, semakin bisa dibandingkan. Bank yang membangun proses disclosure yang kuat hari ini tidak akan kelabakan saat persyaratan bertambah besok.",
        "Konteks Indonesia: OJK menerbitkan ketentuan transparansi dan publikasi laporan bank (termasuk laporan Pilar 3 untuk bank umum). Bank Indonesia juga mengatur transparansi kondisi keuangan. Praktiknya: bank-bank besar Indonesia mempublikasikan laporan Pilar 3 di situs webnya tiap kuartal — unduh 2-3 contoh dan bandingkan gayanya. Belajar dari yang terbaik lebih cepat dari membaca regulasi saja.",
        "Satu perbedaan penting: cakupan konsolidasi REGULASI bisa berbeda dari AKUNTANSI. Entitas asuransi dalam konglomerasi misalnya diperlakukan berbeda di perhitungan modal. Pilar 3 mewajibkan rekonsiliasi neraca akuntansi vs neraca regulasi (template LI1/LI2) — justru untuk mencegah kebingungan. Bila angkamu beda dengan lapkeu, jelaskan di narasi; jangan biarkan pasar menebak.",
        "Dua: perhatikan tanggal efektif vs tanggal publikasi. Keterlambatan lebih dari 1 bulan setelah tutup kuartal menimbulkan pertanyaan. Bank yang baik mempublikasikan 3-4 minggu setelah tutup buku — cepat, rutin, bisa diprediksi. Keteraturan jadwal itu sendiri adalah sinyal tata kelola.",
      ],
      figure: {
        svg: FIG_PILLARS,
        alt: "Tiga pilar Basel.",
        caption: "Pilar 3 = pasar ikut mengawasi bank lewat keterbukaan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“CAR kami 20% — pasti bagus.” CAR tinggi bisa berarti modal kuat ATAU ATMR yang diremehkan (model internal agresif). Pilar 3 memaksa pengungkapan METODOLOGI — pasar menilai kualitas angka, bukan hanya angkanya.",
      },
      hints: [
        "Hafalkan: P1 = 8% minimum; P2 = ICAAP/SREP; P3 = ungkap publik.",
        "CET1 ≥ 4,5%, Tier 1 ≥ 6%, Total ≥ 8% (+buffer).",
      ],
      formula: String.raw`\text{CAR} = \frac{\text{Modal total}}{\text{ATMR}} \times 100\%`,
      formulaNote: "Modal total = CET1 + AT1 + Tier 2; ATMR = aset tertimbang menurut risiko. Contoh lab: 60/400 x 100% = 15,0%. Minimum Basel: CET1 4,5%, Tier 1 6%, Total 8% \u2014 ditambah buffer (conservation 2,5% + countercyclical). Interpretasi: CAR mengukur \u2018bantalan\u2019 bank terhadap kerugian \u2014 tetapi kualitas (porsi CET1) sama pentingnya dengan jumlahnya.",
      reference: "P1 aturan, P2 wasit, P3 penonton yang menilai.",
    },
    {
      id: "template",
      eyebrow: "Langkah 3 · Konsep",
      title: "Template: KM1, OV1, dan kawan-kawan",
      prose: [
        "Pilar 3 memakai template berkode standar. KM1 (Key Metrics): metrik UTAMA — rasio modal, leverage, likuiditas (LCR/NSFR) dalam satu tabel; ini halaman pertama yang dibaca analis. OV1 (Overview of RWA): rincian ATMR per jenis risiko — kredit, pasar, operasional. Lalu template detail: CR (credit risk), MR (market risk), OR (operational), LIQ (liquidity) — masing-masing dengan pendekatan standar vs model internal.",
        "Cara membaca KM1 seperti analis: (1) tren rasio — naik/turun 4 kuartal? (2) buffer di atas minimum — berapa 'ruang napas'? (3) kualitas modal — porsi CET1 vs AT1/Tier 2? (4) perbandingan peer — di atas/di bawah rata-rata industri? Empat pertanyaan, sepuluh menit, satu kesimpulan investasi.",
        "Satu template yang layak dipahami lebih dalam: OV1 merinci ATMR per jenis risiko \u2014 kredit, pasar, operasional, ditambah penyesuaian. Dari OV1 analis bisa melihat di mana modal \u2018dimakan\u2019: bank dengan 80 persen ATMR di kredit adalah bank kredit; bank dengan porsi pasar besar adalah bank trading. Komposisi ini menentukan sensitivitas bank terhadap guncangan. Baca OV1 = baca DNA risiko bank.",
        "Dua miskonsepsi. Satu: 'Semua template wajib untuk semua bank.' Ada hierarki: template inti wajib, beberapa hanya untuk bank dengan pendekatan tertentu (mis. model internal). Dua: 'Frekuensi tahunan cukup.' KM1 kuartalan — pasar butuh data segar; data basi = tidak berguna untuk disiplin pasar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Template sudah diisi — selesai.” Kebenaran > kelengkapan. Angka yang tidak bisa direkonsiliasi ke laporan keuangan = temuan. Setiap angka Pilar 3 harus bisa dilacak ke sumbernya — bangun jejak audit sejak hari pertama.",
      },
      hints: [
        "Mulai dari KM1 — ia ringkasan seluruh cerita permodalan.",
        "Buat checklist template wajib vs opsional untuk bankmu.",
        "Detail template yang sering luput: OV1 membedakan ATMR pendekatan STANDAR vs MODEL INTERNAL. Bila bankmu memakai model internal (A-IRB untuk kredit), selisih keduanya diawasi pasar \u2014 output floor Basel III membatasi seberapa rendah model internal boleh (72,5% dari standar). Pahami posisi bankmu terhadap floor ini; ia adalah salah satu angka yang paling diperhatikan analis.",
        "Cara cepat menilai kualitas modal dari KM1: (1) CET1 ratio vs minimum 4,5% + buffer — berapa ruang napasnya? (2) Rasio CET1 terhadap total modal — di atas 75% = berkualitas; di bawah 60% = waspada. (3) Tren 4 kuartal — stabil, naik, atau tergerus? Tiga angka, satu menit, sudah cukup untuk kesan pertama yang tajam.",
        "Contoh konkret: Bank X melaporkan CET1 12,0%, turun dari 12,8% kuartal lalu dan 13,5% setahun lalu. Buffer di atas minimum (4,5% + 2,5% conservation = 7,0%) masih 5 poin — aman. Tetapi TREN-nya turun 1,5 poin setahun: analis akan bertanya ‘mengapa tergerus?’ — ekspansi kredit agresif? Dividen besar? Kerugian? Narasi bank harus menjawab SEBELUM ditanya. Antisipasi > reaksi.",
        "Tiga: waspadai perubahan metodologi antar kuartal. Bank yang tiba-tiba mengganti pendekatan pengukuran ATMR (standar ke model internal) tepat saat rasionya turun patut dipertanyakan motifnya. Perubahan metodologi harus diungkapkan + dijelaskan + disajikan pro-forma perbandingan. Tanpa itu, pasar mengasumsikan yang terburuk.",
        "Satu prinsip penutup untuk penyusun: tulis laporan Pilar 3 seolah pembacanya adalah analis short-seller yang mencari kelemahanmu — karena memang ada yang seperti itu. Setiap angka yang bisa dipertanyakan, pertanyakan sendiri dulu dan jawab di narasi. Laporan yang tahan serang adalah laporan yang jujur, lengkap, dan konsisten. Itulah standar emasnya.",
        "Mulai minggu depan: unduh laporan Pilar 3 satu bank, baca KM1-nya dalam 10 menit, dan tulis kesimpulan 3 kalimat. Ulangi tiap kuartal. Dalam setahun kamu membaca 4-8 laporan — lebih banyak dari kebanyakan analis junior. Kebiasaan ini membangun intuisi yang tidak bisa dibeli.",
      ],
      reference: "KM1 = metrik utama. OV1 = rincian ATMR. Baca: tren, buffer, kualitas, peer.",
    },
    {
      id: "membaca",
      eyebrow: "Langkah 4 · Konsep",
      title: "Membaca seperti pasar: red flags",
      prose: [
        "Pasar membaca Pilar 3 untuk mencari masalah. Red flags: (1) CAR turun 3 kuartal beruntun — erosi modal; (2) porsi AT1/Tier 2 naik sementara CET1 stagnan — kualitas modal menurun; (3) ATMR model internal jauh di bawah pendekatan standar — model agresif? (4) konsentrasi eksposur tinggi di satu sektor — risiko tersembunyi; (5) narasi risiko berubah-ubah tiap kuartal — tata kelola goyah. Satu red flag = pertanyaan; tiga = rekomendasi jual.",
        "Cara analis membandingkan antar bank: buat tabel peer dengan kolom yang SAMA persis (CET1, total CAR, NPL, LCR, porsi model internal). Isi dari laporan Pilar 3 masing-masing. Bank yang outlier \u2014 jauh di atas atau di bawah rata-rata \u2014 layak diselidiki lebih dalam. Outlier bukan selalu buruk; tetapi selalu menarik.",
        "Ingat: tujuan akhirmu bukan mengisi template \u2014 melainkan membuat pasar PERCAYA pada bankmu. Kepercayaan = biaya dana lebih murah = laba lebih tinggi. Pilar 3 adalah investasi kepercayaan, bukan beban administrasi. Mulai bangun kebiasaan membacanya dari sekarang.",
        "Sebaliknya, green flags: buffer tebal dan stabil, CET1 dominan, pengungkapan konsisten, narasi jujur tentang tantangan ('NPL naik karena X, mitigasi Y'). Pasar menghargai kejujuran lebih dari kesempurnaan — seperti investor di lesson RR21.",
        "Dua miskonsepsi. Satu: 'Tugas kami hanya mengisi template.' Tugasmu = memastikan pasar MEMAHAMI bankmu dengan benar. Template yang diisi tetapi menyesatkan (cherry-picking) = pelanggaran semangat Pilar 3. Dua: 'Pasar tidak membaca ini.' Analis kredit, rating agency, dan investor institusi MEMBACA — merekalah 'disiplin pasar' itu.",
        "Contoh disiplin pasar bekerja: bank yang terlambat mempublikasikan Pilar 3 dua kuartal beruntun — analis menulis ‘keterbukaan memburuk’, harga obligasinya turun 50bps, CFO dipanggil komisaris. Tidak ada denda regulator; hukumannya dari pasar. Inilah mengapa ketepatan waktu publikasi sama pentingnya dengan kebenaran angka.",
        "Satu jebakan publikasi: ‘window dressing’ kuartal — mempercantik angka sesaat sebelum tanggal laporan (mis. menekan ATMR dengan transaksi temporer). Pasar dan regulator semakin pandai mendeteksinya (pola berulang tiap akhir kuartal). Reputasi yang dibangun bertahun-tahun bisa runtuh oleh satu temuan window dressing. Jangan.",
        "Refleksi karir: kemampuan menyusun dan MEMBACA Pilar 3 adalah keterampilan yang langsung terpakai di bank, sekuritas, rating agency, dan regulator. Di wawancara, pertanyaan ‘jelaskan tiga pilar Basel’ adalah pembuka klasik — dan kebanyakan kandidat hanya hafal definisi. Kamu, setelah lesson ini, bisa menjelaskan + menghitung + membaca seperti analis. Itu pembedanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Uji keterbacaan: minta kolega non-risk membaca draf Pilar 3-mu dan menyimpulkan kondisi bank dalam 3 kalimat. Bila ia tidak bisa, pasar juga tidak bisa — dan tujuan disiplin pasar gagal. Kejelasan = efektivitas regulasi.",
      },
      hints: [
        "Buat 'red flag checklist' internal sebelum publikasi — tangkap masalah duluan.",
        "Bandingkan dengan 3 peer setiap kuartal — konteks adalah segalanya.",
      ],
      reference: "Baca seperti pasar: tren, kualitas, konsistensi, peer.",
    },
    {
      id: "lab-car",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung rasio permodalan (KM1 mini)",
      prose: [
        "Modal Rp60 triliun (CET1 45, AT1 5, Tier 2 10), ATMR Rp400 triliun. Hitung tiga rasio kunci KM1: CET1 ratio, Tier 1 ratio, Total CAR. Bandingkan dengan minimum (4,5% / 6% / 8%) — berapa buffer-nya?",
        "Perhatikan kualitas: CET1 11,2% dari total 15,0% — 75% modal adalah yang berkualitas tertinggi. Inilah yang dilihat pasar pertama kali: bukan hanya besarnya, tetapi mutunya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung CET1, Tier 1, dan Total CAR (%)" },
        { id: "t2", text: "Cetak ketiganya dengan 1 desimal" },
      ],
      expected: "CET1: 11.2%\nTier 1: 12.5%\nTotal CAR: 15.0%",
      note: {
        title: "💡 Intuisi",
        body: "Tiga pembagian sederhana = inti KM1. Setiap analis bank di dunia menghitung ini sebagai hal pertama — kuasai sampai di luar kepala.",
      },
      hints: [
        "Tier 1 = CET1 + AT1; Total = Tier 1 + Tier 2.",
        "Rasio = modal / ATMR × 100.",
      ],
      code: {
        starter: "# (Rp triliun). JANGAN UBAH.\nmodal = {\"CET1\": 45, \"AT1\": 5, \"Tier2\": 10}\natmr = 400\n\n# TULIS KODEMU: tiga rasio KM1\ntier1 = \ntotal = \nprint(f\"CET1: {modal['CET1']/atmr*100:.1f}%\")\nprint(f\"Tier 1: {tier1/atmr*100:.1f}%\")\nprint(f\"Total CAR: {total/atmr*100:.1f}%\")\n",
        lockLines: 6,
        solution: "# (Rp triliun). JANGAN UBAH.\nmodal = {\"CET1\": 45, \"AT1\": 5, \"Tier2\": 10}\natmr = 400\n\n# TULIS KODEMU: tiga rasio KM1\ntier1 = modal[\"CET1\"] + modal[\"AT1\"]\ntotal = tier1 + modal[\"Tier2\"]\nprint(f\"CET1: {modal['CET1']/atmr*100:.1f}%\")\nprint(f\"Tier 1: {tier1/atmr*100:.1f}%\")\nprint(f\"Total CAR: {total/atmr*100:.1f}%\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "CET1 11.2", msg: "45/400.", pattern: "CET1: 11.2%" },
          { kind: "stdout_matches", task: "t1", label: "Tier 1 12.5", msg: "(45+5)/400.", pattern: "Tier 1: 12.5%" },
          { kind: "stdout_matches", task: "t2", label: "Total 15.0", msg: "60/400.", pattern: "Total CAR: 15.0%" },
        ],
      },
      reference: "CET1 = CET1/ATMR. Tier1 = (CET1+AT1)/ATMR. Total = semua/ATMR.",
    },
    {
      id: "lab-lengkap",
      eyebrow: "Langkah 6 · Lab",
      title: "Pemeriksa kelengkapan template",
      prose: [
        "Lima template dengan status wajib/tersedia. Hitung % kelengkapan HANYA untuk template wajib, dan daftarkan yang hilang — inilah checklist pra-publikasi.",
        "Hasil: 75%, hilang CR1. Template risiko kredit yang hilang = lubang besar — kredit biasanya 70%+ ATMR bank. Eksperimen: tandai MR1 sebagai wajib dan tidak tersedia — berapa kelengkapannya? Prioritas pengisian = dampaknya terhadap cerita.",
      ],
      tasks: [
        { id: "t1", text: "Hitung kelengkapan % template WAJIB saja" },
        { id: "t2", text: "Daftarkan template wajib yang hilang" },
      ],
      expected: "Kelengkapan: 3/4 (75%)\nHilang: CR1",
      note: {
        title: "💡 Intuisi",
        body: "Checklist sederhana ini mencegah malu publikasi: template wajib yang hilang = pertanyaan analis yang tidak bisa dijawab. Lebih baik tunda sehari daripada publikasikan berlubang.",
      },
      hints: [
        "Filter wajib dulu, baru hitung.",
        "Hilang = wajib dan tidak tersedia.",
      ],
      code: {
        starter: "# (kode, wajib, tersedia). JANGAN UBAH.\ntemplates = [(\"KM1\", True, True), (\"OV1\", True, True), (\"CR1\", True, False),\n             (\"MR1\", False, False), (\"OP1\", True, True)]\n\n# TULIS KODEMU: kelengkapan wajib + daftar hilang\nwajib = [t for t in templates if t[1]]\nlengkap = \nhilang = \nprint(f\"Kelengkapan: {lengkap}/{len(wajib)} ({lengkap/len(wajib)*100:.0f}%)\")\nprint(f\"Hilang: {', '.join(hilang) if hilang else 'tidak ada'}\")\n",
        lockLines: 8,
        solution: "# (kode, wajib, tersedia). JANGAN UBAH.\ntemplates = [(\"KM1\", True, True), (\"OV1\", True, True), (\"CR1\", True, False),\n             (\"MR1\", False, False), (\"OP1\", True, True)]\n\n# TULIS KODEMU: kelengkapan wajib + daftar hilang\nwajib = [t for t in templates if t[1]]\nlengkap = sum(1 for t in wajib if t[2])\nhilang = [t[0] for t in wajib if not t[2]]\nprint(f\"Kelengkapan: {lengkap}/{len(wajib)} ({lengkap/len(wajib)*100:.0f}%)\")\nprint(f\"Hilang: {', '.join(hilang) if hilang else 'tidak ada'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Kelengkapan 75", msg: "3 dari 4 wajib.", pattern: "Kelengkapan: 3/4 .75%." },
          { kind: "stdout_matches", task: "t2", label: "Hilang CR1", msg: "CR1 wajib tapi tidak tersedia.", pattern: "Hilang: CR1" },
          { kind: "uses", task: "t1", label: "Filter wajib", msg: "Hanya hitung yang wajib.", token: "wajib" },
        ],
      },
      reference: "Kelengkapan = tersedia/wajib. Daftarkan yang hilang.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Siklus publikasi Pilar 3",
      prose: [
        "Satu: kalender — tetapkan jadwal (KM1 kuartalan, template detail semesteran/tahunan) selaras laporan keuangan. Dua: kumpulkan — tarik data dari sistem risiko + keuangan; rekonsiliasi keduanya. Tiga: isi template — ikuti format standar persis; jangan improvisasi kolom. Empat: uji — kelengkapan (lab kedua), rekonsiliasi ke lapkeu, red-flag checklist internal. Lima: telaah — risk + keuangan + legal menandatangani. Enam: publikasikan — situs web bank, mudah ditemukan (bukan tersembunyi 5 klik).",
        "Tujuh: arsipkan dengan rapi. Pilar 3 historis (8 kuartal) harus tersedia — analis membangun tren darinya. Bank yang hanya menampilkan kuartal terakhir memaksa analis menebak tren; bank yang menampilkan arsip memudahkan analisis. Kemudahan = kepercayaan. Biaya arsip: hampir nol; nilainya: besar.",
        "Aturan praktis 10 detik: jadwal → kumpul → isi → uji → telaah → publikasi. Keterlambatan publikasi = sinyal buruk bagi pasar.",
        "Satu jebakan: 'angka Pilar 3 beda dengan lapkeu.' Cakupan konsolidasi bisa berbeda (regulasi vs akuntansi) — JELASKAN perbedaannya di narasi. Perbedaan yang dijelaskan = transparansi; perbedaan yang disembunyikan = kecurigaan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tunjuk satu pemilik proses Pilar 3 (biasanya di risk/keuangan) dengan wewenang meminta data lintas unit. Tanpa pemilik, siklus publikasi = kejar-kejaran tiap kuartal. Dengan pemilik, ia menjadi rutinitas.",
      },
      reference: "Jadwal → kumpul → isi → uji → telaah → publikasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Artha Dana vs Bank Nusantara",
      prose: [
        "Data kuartal terakhir. Bank Artha Dana: CET1 11,2%, Tier 1 12,5%, Total 15,0%; NPL 2,8%; LCR 135%; template lengkap; narasi: 'NPL naik 0,3% karena sektor properti, mitigasi: restrukturisasi + pencadangan +25%.' Bank Nusantara: CET1 9,0%, Tier 1 11,0%, Total 14,5% (Tier 2 besar); NPL 3,5%; LCR 115%; template: CR1 terlambat; narasi generik.",
        "Pertanyaan: bank mana yang dinilai pasar lebih baik, dan mengapa? Pembahasan: Artha Dana — meski total CAR hanya beda 0,5%, kualitas modalnya jauh lebih baik (CET1 11,2% vs 9,0%), metrik risiko lebih sehat, disclosure lengkap, narasi jujur dan spesifik. Nusantara: bergantung pada Tier 2 (kualitas rendah), NPL lebih tinggi, disclosure berlubang, narasi templat. Pasar memberi premium valuasi 10-15% untuk keterbukaan — Artha Dana 'membeli' kepercayaan dengan transparansi. Pelajaran: Pilar 3 bukan beban compliance; ia alat pemasaran kepercayaan.",
        "Pertanyaan lanjutan: (c) Apa yang harus dilakukan Bank Nusantara SEKARANG? Pembahasan: (1) kejar keterlambatan CR1 \u2014 publikasikan susulan dengan penjelasan; (2) mulai bangun buffer CET1 (tahan dividen, rights issue parsial); (3) perbaiki narasi: ganti template generik dengan penjelasan spesifik per kuartal. Tiga langkah, 2 kuartal, reputasi pulih. Keterbukaan yang terlambat lebih baik dari tidak pernah \u2014 tetapi keterlambatan berulang = pola.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan peran narasi: angka Artha Dana tidak sempurna (NPL naik), tetapi narasi menjelaskan SEBAB + MITIGASI. Pasar tidak menghukum masalah yang dikelola transparan; ia menghukum ketidakpastian. Ungkap masalahmu sebelum pasar menemukannya sendiri.",
      },
      reference: "Kualitas > kuantitas. Narasi jujur = premium valuasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Tiga pilar: Pilar 1 = aturan main (modal ≥8% ATMR), Pilar 2 = wasit (review supervisor), Pilar 3 = penonton yang ikut menilai — disiplin pasar lewat keterbukaan.",
        "Pilar 3 ≠ laporan tahunan: ia template TERSTANDAR (KM1, OV1, dst.) dengan frekuensi yang ditentukan — supaya informasi bisa dibandingkan antar bank.",
        "Disiplin pasar bekerja lewat harga: disclosure buruk = bank membayar spread kredit 20–50 bps lebih mahal di pasar.",
        "Latihan membaca cepat: ambil laporan Pilar 3 bank mana pun, cari tabel KM1, jawab dalam 2 menit — berapa CET1 ratio-nya; OJK mengadopsi kerangka ini via ketentuan transparansi publikasi bank.",
      ],
      quiz: [
        {
          q: "Tujuan utama Pilar 3 Basel:",
          options: [
            { text: "Disiplin pasar — publikasi agar pasar bisa menilai dan menekan bank berisiko", why: "Benar: Pilar 3 = pasar ikut mengawasi lewat keterbukaan.", correct: true },
            { text: "Menambah modal minimum bank", why: "Itu Pilar 1." },
            { text: "Menggantikan supervisi regulator", why: "Itu Pilar 2; Pilar 3 melengkapi, bukan mengganti." },
            { text: "Merahasiakan kondisi bank dari publik", why: "Terbalik: Pilar 3 = keterbukaan." },
          ],
        },
        {
          q: "Isi utama template KM1:",
          options: [
            { text: "Metrik kunci: rasio modal, leverage, likuiditas dalam satu tabel", why: "Benar: KM1 = halaman pertama yang dibaca analis.", correct: true },
            { text: "Daftar seluruh debitur bank", why: "Itu rahasia bank; tidak dipublikasikan." },
            { text: "Gaji direksi", why: "Itu di laporan tata kelola, bukan KM1." },
            { text: "Rencana bisnis 5 tahun", why: "Itu internal; bukan template KM1." },
          ],
        },
        {
          q: "Bank dengan CET1 9% + Tier 2 besar (total CAR 14,5%) vs bank CET1 11,2% (total 15%). Penilaian pasar:",
          options: [
            { text: "Bank kedua lebih baik — kualitas modal (CET1) lebih penting dari total", why: "Benar: CET1 menyerap rugi pertama; mutu > jumlah.", correct: true },
            { text: "Bank pertama lebih baik — total CAR hampir sama", why: "Total menipu; Tier 2 besar = kualitas rendah." },
            { text: "Sama saja — yang penting di atas 8%", why: "Di atas minimum bukan berarti sama kualitasnya." },
            { text: "Tidak bisa dibandingkan", why: "Justru bisa dan harus dibandingkan." },
          ],
        },
        {
          q: "Red flag dalam laporan Pilar 3:",
          options: [
            { text: "CAR turun 3 kuartal beruntun + narasi berubah-ubah", why: "Benar: tren memburuk + inkonsistensi = red flag.", correct: true },
            { text: "Template lengkap dan tepat waktu", why: "Itu green flag." },
            { text: "CET1 dominan", why: "Itu green flag kualitas modal." },
            { text: "Narasi jujur tentang tantangan", why: "Kejujuran = green flag." },
          ],
        },
        {
          q: "Sebelum publikasi Pilar 3, uji wajib:",
          options: [
            { text: "Kelengkapan template + rekonsiliasi ke lapkeu + red-flag checklist", why: "Benar: kebenaran > kelengkapan > kecepatan.", correct: true },
            { text: "Cukup isi template seadanya", why: "Seadanya = risiko sanksi dan reputasi." },
            { text: "Pastikan semua angka terlihat bagus", why: "Mempercantik = manipulasi; kebenaran yang wajib." },
            { text: "Tidak perlu uji — langsung publikasikan", why: "Publikasi tanpa uji = bom waktu." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Pilar 3 = urusan compliance, bukan analis.” Analis yang menyusun Pilar 3 memahami banknya lebih dalam dari analis lain — ia melihat seluruh risiko dalam satu dokumen. Ini akselerator karir, bukan tugas administratif.",
      },
      hints: [
        "Uji cepat: hitung CAR dari CET1 45 + AT1 5 + Tier 2 10, ATMR 400 — tanpa kalkulator.",
        "Ingat: Pilar 3 = pasar mengawasi; keterbukaan = valuasi.",
      ],
      reference: "Ungkap jujur, ungkap lengkap, ungkap tepat waktu.",
    },
  ],
};
