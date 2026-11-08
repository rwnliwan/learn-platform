import type { V2Lesson } from "../lib/types";

const FIG_SLOT = `<svg viewBox="0 0 480 300" role="img" aria-label="Empat grade slotting dengan bobot risiko masing-masing.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Slotting: empat slot, empat bobot</text>
<text x="10" y="55" font-size="11" fill="var(--chart-text)">Strong</text>
<rect x="120" y="42" width="84" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="210" y="59" font-size="11" fill="var(--chart-text)">70%</text>
<text x="10" y="95" font-size="11" fill="var(--chart-text)">Good</text>
<rect x="120" y="82" width="108" height="24" fill="var(--c1)" opacity="0.7"/>
<text x="234" y="99" font-size="11" fill="var(--chart-text)">90%</text>
<text x="10" y="135" font-size="11" fill="var(--chart-text)">Satisfactory</text>
<rect x="120" y="122" width="138" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="264" y="139" font-size="11" fill="var(--chart-text)">115%</text>
<text x="10" y="175" font-size="11" fill="var(--chart-text)">Weak</text>
<rect x="120" y="162" width="300" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="426" y="179" font-size="11" fill="var(--chart-text)">250%</text>
<text x="10" y="215" font-size="11" fill="var(--chart-text)">Satu grade turun (good → satisfactory): bobot naik 25 poin.</text>
<text x="10" y="235" font-size="11" fill="var(--chart-text)">Jatuh ke weak: bobot melonjak 2,5x lipat.</text>
<text x="10" y="265" font-size="10" fill="var(--chart-text)" opacity="0.75">Kerangka Basel CRE30 (supervisory slotting), project finance &amp; IPRE.</text>
</g>
</svg>`;

const FIG_JENIS = `<svg viewBox="0 0 480 260" role="img" aria-label="Empat jenis specialised lending.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Empat wajah specialised lending</text>
<rect x="20" y="50" width="200" height="70" rx="8" fill="var(--c1)" opacity="0.2" stroke="var(--c1)" stroke-width="2"/>
<text x="120" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Project finance</text>
<text x="120" y="95" font-size="10" fill="var(--chart-text)" text-anchor="middle">tol, PLTU, smelter</text>
<text x="120" y="110" font-size="10" fill="var(--chart-text)" text-anchor="middle">dibayar dari arus kas proyek</text>
<rect x="260" y="50" width="200" height="70" rx="8" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="2"/>
<text x="360" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">IPRE</text>
<text x="360" y="95" font-size="10" fill="var(--chart-text)" text-anchor="middle">apartemen, mal, gudang</text>
<text x="360" y="110" font-size="10" fill="var(--chart-text)" text-anchor="middle">dibayar dari sewa properti</text>
<rect x="20" y="140" width="200" height="70" rx="8" fill="var(--c4)" opacity="0.2" stroke="var(--c4)" stroke-width="2"/>
<text x="120" y="165" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Object finance</text>
<text x="120" y="185" font-size="10" fill="var(--chart-text)" text-anchor="middle">kapal, pesawat, alat berat</text>
<text x="120" y="200" font-size="10" fill="var(--chart-text)" text-anchor="middle">dibayar dari operasi aset</text>
<rect x="260" y="140" width="200" height="70" rx="8" fill="var(--c1)" opacity="0.2" stroke="var(--c1)" stroke-width="2"/>
<text x="360" y="165" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Commodities finance</text>
<text x="360" y="185" font-size="10" fill="var(--chart-text)" text-anchor="middle">stok CPO, batubara</text>
<text x="360" y="200" font-size="10" fill="var(--chart-text)" text-anchor="middle">cadangan jangka pendek</text>
<text x="20" y="240" font-size="11" fill="var(--chart-text)">Ciri bersama: pembayaran bergantung pada aset/proyek — bukan korporasi induk.</text>
</g>
</svg>`;

export const cr30: V2Lesson = {
  slug: "cr30-specialised-lending",
  track: "Credit Risk",
  module: "Kredit Korporasi Lanjut",
  title: "CR30 — Specialised Lending: Ketika Skor Kredit Biasa Menyerah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp3 triliun untuk satu jembatan",
      prose: [
        "Bank Nusantara diminta membiayai jalan tol baru: Rp3 triliun, tenor 15 tahun. Tim analis membuka model scorecard korporasi — dan berhenti. Model itu butuh laporan keuangan 3 tahun, riwayat pembayaran, rasio lancar. Perusahaan proyek ini baru berdiri kemarin; satu-satunya 'laporan keuangan' adalah proyeksi lalu lintas 15 tahun ke depan. Skor kredit biasa menyerah sebelum mulai.",
        "Twist-nya: justru inilah kredit paling 'jujur' — pembayarannya tidak bergantung pada janji manajemen, melainkan pada mobil yang lewat gerbang tol. Basel menyebutnya specialised lending: eksposur yang pembayarannya bergantung pada aset atau proyek yang dibiayai, bukan pada korporasi secara umum. Dan karena model PD biasa tidak bisa dipakai, Basel menyediakan jalan pintas resmi: supervisory slotting — menilai proyek, memasukkannya ke satu dari empat slot, dan memakai bobot risiko yang sudah ditentukan.",
        "Ada ironi yang perlu kamu pahami sejak awal: kredit 'jujur' ini justru paling sulit dinilai. Tidak ada histori pembayaran, tidak ada rasio keuangan masa lalu — hanya proyeksi. Dan proyeksi adalah opini yang diberi dasi. Slotting tidak menghilangkan subjektivitas itu; ia MENATA-nya: lima faktor eksplisit, empat grade, bobot pasti. Penilai boleh berdebat — tetapi harus berdebat dalam kerangka yang sama.",
        "Lesson ini tentang empat wajah specialised lending dan cara menilainya tanpa model PD. Setelah lesson ini kamu bisa: (1) membedakan empat jenis specialised lending; (2) menetapkan slotting grade dari faktor penilaian; (3) menghitung RWA dengan bobot slotting; (4) menjelaskan kapan slotting dipakai vs model internal. Ini adalah lesson yang membuatmu bisa membaca proposal proyek triliunan rupiah tanpa panik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Infrastruktur Indonesia — tol, smelter, PLTU, kawasan industri — dibiayai dengan specialised lending. Analis kredit korporasi yang hanya paham scorecard akan gagap menghadapi proposal Rp3 triliun tanpa histori. Slotting adalah bahasa yang dipakai komite kredit untuk proyek-proyek ini.",
      },
      reference: "Specialised lending = dibayar dari proyek/aset. Slotting = 4 grade, bobot pasti.",
    },
    {
      id: "jenis",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat wajah, satu ciri",
      prose: [
        "Project finance: pembiayaan proyek tunggal berskala besar (tol, PLTU, smelter) — pembayaran dari arus kas proyek itu sendiri; sponsor punya limited recourse. IPRE (income-producing real estate): apartemen, mal, gudang — pembayaran dari pendapatan sewa properti. Object finance: kapal, pesawat, alat berat — pembayaran dari pengoperasian aset fisik yang menjadi agunan sekaligus. Commodities finance: pembiayaan cadangan komoditas (CPO, batubara) jangka pendek terstruktur.",
        "Satu ciri bersama yang membedakannya dari kredit korporasi biasa: sumber pembayaran utama adalah ASET atau PROYEK yang dibiayai — bukan arus kas korporasi induk secara umum. Konsekuensinya: analisis bergeser dari 'seberapa sehat perusahaannya' menjadi 'seberapa kokoh proyeknya' — proyeksi arus kas, kontrak, risiko konstruksi, risiko regulasi.",
        "Ada konsekuensi kedua yang jarang disadari: LGD specialised lending cenderung TINGGI. Agunan jalan tol yang setengah jadi, kapal khusus, atau stok komoditas yang harganya jatuh — semuanya tidak likuid saat harus dijual paksa. Bank tidak bisa 'menjual tolnya' seperti menjual ruko agunan KPR. Inilah mengapa bobot slotting dimulai dari 70% (bukan 0%): bahkan proyek 'strong' membawa risiko eksekusi yang tidak ada di kredit korporasi biasa. Analis yang hanya menghitung PD tanpa memikirkan 'bagaimana cara menjual agunan ini bila gagal' baru mengerjakan setengah pekerjaannya.",
        "Tiga miskonsepsi. Satu: 'Proyek besar = korporasi besar, pakai scorecard biasa.' Tidak — SPV proyek tidak punya histori; scorecard butuh histori. Dua: 'Agunannya besar jadi aman.' Agunan proyek (jalan tol setengah jadi) tidak likuid — LGD justru tinggi bila proyek gagal. Tiga: 'Slotting = tebakan kasar.' Slotting adalah kerangka penilaian terstruktur dengan faktor eksplisit — bukan tebakan.",
      ],
      figure: {
        svg: FIG_JENIS,
        alt: "Empat jenis specialised lending.",
        caption: "Ciri bersama: pembayaran bergantung pada aset/proyek, bukan induk.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Ini kan kredit korporasi — sponsornya konglomerat besar.” Sponsor kuat memang faktor penilai (strength of sponsor), tetapi recourse terbatas: bila proyek gagal, bank tidak bisa menagih ke induk di luar jaminan yang diberikan. Menilai sponsor saja = melewatkan risiko proyeknya.",
      },
      hints: [
        "Identifikasi dulu sumber pembayaran utama — itulah penentu jenisnya.",
        "Untuk IPRE, bedakan dari KPR: IPRE dinilai dari pendapatan sewa, bukan kemampuan membayar penghuni.",
      ],
      reference: "Tanya: siapa yang membayar? Proyek/aset = specialised lending.",
    },
    {
      id: "slotting",
      eyebrow: "Langkah 3 · Konsep",
      title: "Empat slot penentu modal",
      prose: [
        "Supervisory slotting (Basel CRE30): bank menilai eksposur terhadap faktor-faktor — kekuatan finansial (DSCR, LLCR), lingkungan politik/hukum, karakteristik transaksi, kekuatan sponsor, dan paket pengaman — lalu memasukkannya ke satu grade: Strong, Good, Satisfactory, atau Weak. Tiap grade = bobot risiko pasti untuk project finance dan IPRE: 70%, 90%, 115%, 250%.",
        "Perhatikan lompatannya: dari good (90%) ke satisfactory (115%) naik 25 poin — tetapi jatuh ke weak melonjak ke 250%, hampir 3x lipat. Satu grade bisa mengubah RWA Rp1 triliun sebesar Rp1,35 triliun. Inilah mengapa perdebatan grade di komite kredit begitu sengit: ini bukan soal label, melainkan soal modal.",
        "Contoh: Tol Trans Rp3 triliun dinilai strong → RWA Rp2,1 triliun (70%). Bila dinilai satisfactory → Rp3,45 triliun. Selisih Rp1,35 triliun RWA ≈ Rp108 miliar kebutuhan modal (pada CAR 8%). Satu kata — 'strong' vs 'satisfactory' — bernilai Rp108 miliar.",
        "Bagaimana grade sebenarnya ditentukan? Bank mengisi matriks lima faktor. Contoh Tol Trans: kekuatan finansial — DSCR proyeksi 1,35x (cukup untuk good, belum strong yang biasanya >1,4x); lingkungan politik/hukum — konsesi 35 tahun dari pemerintah, risiko regulasi tarif (satisfactory); karakteristik transaksi — konstruksi medan sulit (weak); kekuatan sponsor — konglomerat dengan track record tol (strong); paket pengaman — jaminan saham SPV + rekening penampungan (good). Agregat: bukan rata-rata matematis, melainkan penilaian menyeluruh — faktor terlemah (konstruksi) membatasi grade ke good atau satisfactory. Inilah mengapa dokumentasi per faktor wajib: grade adalah kesimpulan dari lima argumen, bukan satu firasat.",
        "Dua miskonsepsi. Satu: 'Slotting untuk bank yang tidak punya model.' Slotting adalah pendekatan standar resmi Basel — bahkan bank dengan model internal pun memakainya untuk portofolio yang tidak memenuhi syarat model. Dua: 'Grade bisa dinegosiasi.' Faktor penilaiannya eksplisit dan diaudit — mengatrol grade tanpa dasar = temuan pengawasan.",
      ],
      formula: String.raw`\text{RWA} = \text{EAD} \times w_{\text{grade}}`,
      formulaNote: "w_grade = 70% (strong), 90% (good), 115% (satisfactory), 250% (weak) untuk project finance & IPRE. Contoh: Rp3.000 M × 70% = Rp2.100 M. Interpretasi: grade menentukan 'pajak modal' proyek.",
      figure: {
        svg: FIG_SLOT,
        alt: "Empat grade slotting dengan bobot risiko.",
        caption: "Jatuh ke weak = bobot 2,5x lipat. Satu grade bernilai ratusan miliar modal.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Proyek ini strong karena sponsornya kuat.” Sponsor hanyalah satu dari lima faktor. Proyek dengan sponsor kuat tetapi DSCR 1,1x dan risiko konstruksi tinggi bukan strong. Grade = agregat faktor, bukan satu faktor favorit.",
      },
      hints: [
        "DSCR (debt service coverage ratio) adalah faktor finansial terpenting: <1,2x sulit dapat strong.",
        "Dokumentasikan tiap faktor — grade tanpa jejak penilaian = grade yang tidak bisa dipertahankan.",
      ],
      reference: "70/90/115/250. Satu grade = ratusan miliar modal.",
    },
    {
      id: "lab-slotting",
      eyebrow: "Langkah 4 · Lab",
      title: "Kalkulator RWA slotting",
      prose: [
        "Empat proyek dengan grade berbeda. Hitung RWA tiap proyek dan totalnya dengan bobot slotting. Perhatikan proyek Tambang: EAD paling kecil (Rp1.000 M) tetapi grade weak membuatnya penyumbang RWA terbesar kedua.",
        "Eksperimen: naikkan grade Apartemen dari satisfactory ke good — total RWA turun dari Rp8.125 M menjadi Rp7.750 M (hemat Rp375 M RWA ≈ Rp30 M modal). Inilah nilai satu grade dalam rupiah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rwa` tiap proyek dan `total`" },
        { id: "t2", text: "Jalankan dan pastikan tabelnya tercetak" },
      ],
      expected: "Tol Trans (strong): RWA Rp2100.0 M\nPLTU (good): RWA Rp1800.0 M\nApartemen (satisfactory): RWA Rp1725.0 M\nTambang (weak): RWA Rp2500.0 M\nTotal RWA: Rp8125.0 M",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tambang EAD-nya kecil — tidak material.” RWA Tambang Rp2.500 M > RWA Tol Trans Rp2.100 M yang EAD-nya 3x lipat. Bobot 250% membalikkan logika ukuran: proyek kecil berisiko tinggi bisa lebih 'berat' daripada proyek raksasa yang sehat.",
      },
      hints: [
        "bobot = {'strong': 0.70, 'good': 0.90, 'satisfactory': 1.15, 'weak': 2.50}.",
        "rwa = ead × bobot[grade].",
      ],
      code: {
        starter: "# (nama, grade, EAD Rp M). JANGAN UBAH.\nproyek = [(\"Tol Trans\", \"strong\", 3000.0), (\"PLTU\", \"good\", 2000.0),\n          (\"Apartemen\", \"satisfactory\", 1500.0), (\"Tambang\", \"weak\", 1000.0)]\nbobot = {\"strong\": 0.70, \"good\": 0.90, \"satisfactory\": 1.15, \"weak\": 2.50}\n\n# TULIS KODEMU: RWA tiap proyek dan total\ntotal = 0.0\nfor nama, grade, ead in proyek:\n    rwa =\n    total += rwa\n    print(f\"{nama} ({grade}): RWA Rp{rwa:.1f} M\")\nprint(f\"Total RWA: Rp{total:.1f} M\")\n",
        lockLines: 4,
        solution: "# (nama, grade, EAD Rp M). JANGAN UBAH.\nproyek = [(\"Tol Trans\", \"strong\", 3000.0), (\"PLTU\", \"good\", 2000.0),\n          (\"Apartemen\", \"satisfactory\", 1500.0), (\"Tambang\", \"weak\", 1000.0)]\nbobot = {\"strong\": 0.70, \"good\": 0.90, \"satisfactory\": 1.15, \"weak\": 2.50}\n\n# TULIS KODEMU: RWA tiap proyek dan total\ntotal = 0.0\nfor nama, grade, ead in proyek:\n    rwa = ead * bobot[grade]\n    total += rwa\n    print(f\"{nama} ({grade}): RWA Rp{rwa:.1f} M\")\nprint(f\"Total RWA: Rp{total:.1f} M\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Total RWA = 8125", msg: "2100+1800+1725+2500.", name: "total", value: 8125.0, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Tambang 2500 tercetak", msg: "1000×250%.", pattern: "Tambang \\(weak\\): RWA Rp2500\\.0 M" }
        ],
      },
      reference: "RWA = EAD × bobot grade. Weak 250% membalik logika ukuran.",
    },
    {
      id: "lab-banding",
      eyebrow: "Langkah 5 · Lab",
      title: "Slotting vs korporasi biasa",
      prose: [
        "Bandingkan: bila keempat proyek diperlakukan sebagai kredit korporasi biasa (bobot flat 100%), total RWA = Rp7.500 M. Dengan slotting: Rp8.125 M. Slotting 'menghukum' proyek weak (250%) lebih dari ia 'menghargai' proyek strong (70%).",
        "Eksperimen: ubah semua grade menjadi strong — total RWA Rp5.250 M, jauh di bawah flat 100%. Slotting adalah sistem yang jujur dua arah: proyek bagus membayar pajak modal lebih murah daripada korporasi biasa.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih` = total slotting − total flat" },
        { id: "t2", text: "Jalankan dan pastikan kesimpulannya tercetak" },
      ],
      expected: "RWA slotting: Rp8125.0 M\nRWA flat 100%: Rp7500.0 M\nSelisih: Rp625.0 M (slotting lebih berat)",
      note: {
        title: "Intuisi",
        body: "Selisih Rp625 M adalah 'harga kejujuran': slotting memaksa bank mengakui bahwa satu proyek weak lebih berbahaya daripada empat korporasi biasa digabung. Bank yang menghindari slotting = bank yang menyembunyikan risiko proyek di balik rata-rata.",
      },
      hints: [
        "total_slotting = 8125 (dari lab sebelumnya).",
        "total_flat = jumlah EAD × 1.00.",
      ],
      code: {
        starter: "# EAD Rp M. JANGAN UBAH.\nead = [3000.0, 2000.0, 1500.0, 1000.0]\ntotal_slotting = 8125.0\n\n# TULIS KODEMU: bandingkan dengan bobot flat 100%\ntotal_flat =\nselisih =\nprint(f\"RWA slotting: Rp{total_slotting:.1f} M\")\nprint(f\"RWA flat 100%: Rp{total_flat:.1f} M\")\nprint(f\"Selisih: Rp{selisih:.1f} M (slotting lebih berat)\")\n",
        lockLines: 3,
        solution: "# EAD Rp M. JANGAN UBAH.\nead = [3000.0, 2000.0, 1500.0, 1000.0]\n\n# TULIS KODEMU: bandingkan dengan bobot flat 100%\ntotal_slotting = 8125.0\ntotal_flat = sum(ead) * 1.00\nselisih = total_slotting - total_flat\nprint(f\"RWA slotting: Rp{total_slotting:.1f} M\")\nprint(f\"RWA flat 100%: Rp{total_flat:.1f} M\")\nprint(f\"Selisih: Rp{selisih:.1f} M (slotting lebih berat)\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "selisih = 625", msg: "8125−7500.", name: "selisih", value: 625.0, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Kesimpulan tercetak", msg: "Slotting lebih berat.", pattern: "Selisih: Rp625\\.0 M \\(slotting lebih berat\\)" }
        ],
      },
      reference: "Slotting menghukum weak lebih dari menghargai strong.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Slotting atau model internal?",
      prose: [
        "Satu: proyek/SPV tanpa histori 3 tahun → slotting; jangan paksakan scorecard. Dua: IPRE dengan data sewa stabil → slotting dengan fokus pada DSCR sewa; pertimbangkan model internal bila portofolio besar. Tiga: object finance (kapal/pesawat) → slotting; nilai agunan sekunder (pasar kapal bekas) sebagai faktor LGD. Empat: komoditas jangka pendek → slotting; perhatikan volatilitas harga komoditas sebagai faktor utama. Lima: korporasi mapan dengan proyek kecil di dalamnya → kredit korporasi biasa; slotting hanya bila proyeknya ring-fenced.",
        "Aturan praktis 10 detik: tidak ada histori → slotting. Ada histori + portofolio besar → pertimbangkan model. Selalu dokumentasikan lima faktor.",
        "Kapan TIDAK pakai slotting? Bila eksposur sebenarnya adalah kredit korporasi biasa yang 'dibungkus' proyek — misalnya pinjaman ke induk konglomerat dengan agunan proyek tetapi pembayaran dari kas induk. Itu korporasi biasa dengan agunan, bukan specialised lending. Salah klasifikasi = bobot salah = modal salah. Ujian klasifikasi ini muncul di setiap review pengawasan — dan analis yang bisa mempertahankannya dengan argumen sumber pembayaran adalah analis yang dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Pertanyaan kuncinya bukan 'model apa?' melainkan 'apakah data untuk model itu ada?' Slotting adalah pengakuan jujur bahwa untuk proyek unik, penilaian ahli terstruktur lebih baik daripada model statistik tanpa data.",
      },
      reference: "Tanpa histori = slotting. Lima faktor terdokumentasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Perdebatan Rp108 miliar",
      prose: [
        "Komite kredit Bank Nusantara: Tol Trans Rp3 triliun. Account officer mengusulkan grade 'strong' (DSCR 1,35x, sponsor konglomerat). Risk menuntut 'satisfactory' (risiko konstruksi: medan sulit, kontraktor belum pernah bangun tol sepanjang ini). Selisih grade = Rp1,35 triliun RWA ≈ Rp108 miliar kebutuhan modal.",
        "Pertanyaan: (a) Faktor apa yang paling diperdebatkan? (b) Kompromi yang masuk akal? (c) Bagaimana keputusan didokumentasikan? Pembahasan: (a) Karakteristik transaksi (risiko konstruksi) vs kekuatan sponsor — dua faktor yang tarik-menarik. (b) 'Good' sebagai kompromi (90% → RWA Rp2,7 T) dengan covenant: pencairan bertahap mengikuti milestone konstruksi + independent engineer. Kovenan mengubah risiko, bukan sekadar label. (c) Matriks lima faktor dengan skor per faktor + justifikasi tertulis — grade tanpa jejak = grade yang runtuh saat diaudit.",
        "Epilog yang sering dilupakan: monitoring. Setelah cair, grade bukan patung — ia hidup. Keterlambatan konstruksi 6 bulan, DSCR aktual di bawah proyeksi, atau perubahan regulasi tarif = pemicu review grade. Bank yang baik mereview slotting tiap tahun (atau saat trigger) dan menaikkan bobot bila proyek memburuk. Specialised lending adalah pernikahan 15 tahun, bukan kencan satu malam: penilaian awal hanyalah awal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perdebatan grade adalah momen paling jujur dalam perbankan: di sinilah risiko diterjemahkan menjadi modal, rupiah per rupiah. Analis yang bisa memfasilitasi perdebatan ini — dengan matriks faktor, bukan opini — adalah analis yang naik kelas.",
      },
      reference: "Debat grade = debat modal. Kovenan mengubah risiko, bukan label.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — slotting adalah soal penilaian, bukan hafalan bobot. Kuasai ini dan kamu bisa duduk di komite kredit proyek tanpa gagap, mempertahankan grade dengan argumen lima faktor, bukan firasat.",
      ],
      tasks: [],
      summary: [
        "Specialised lending: project finance, IPRE, object finance, commodities finance — dibayar dari proyek/aset.",
        "Slotting: 4 grade (strong/good/satisfactory/weak) → bobot 70/90/115/250% (project finance & IPRE).",
        "Satu grade = ratusan miliar modal; jatuh ke weak = 2,5x lipat.",
        "Lima faktor: finansial, politik/hukum, transaksi, sponsor, pengaman — terdokumentasi.",
        "Tanpa histori → slotting; jangan paksakan scorecard.",
      ],
      next: { label: "CR31 — Low Default Portfolios", href: "/v2/learn/cr31-low-default-portfolio" },
      quiz: [
        {
          q: "Tol Trans Rp3 triliun dinilai satisfactory (115%). RWA-nya?",
          options: [
            { text: "Rp3.450 M", why: "Benar: 3000 × 115%.", correct: true },
            { text: "Rp3.000 M", why: "Itu EAD, bukan RWA." },
            { text: "Rp2.100 M", why: "Itu bila grade strong (70%)." },
            { text: "Rp7.500 M", why: "Itu bila weak (250%)." }
          ],
        },
        {
          q: "Mengapa scorecard korporasi biasa tidak bisa dipakai untuk project finance SPV?",
          options: [
            { text: "SPV tidak punya histori 3 tahun — model butuh data yang tidak ada", why: "Benar: tanpa histori, scorecard tidak valid.", correct: true },
            { text: "Karena proyeknya terlalu besar", why: "Ukuran bukan masalah model — ketiadaan data yang masalah." },
            { text: "Karena bunganya berbeda", why: "Bunga tidak memengaruhi validitas scorecard." },
            { text: "Karena sponsornya selalu lemah", why: "Sponsor bisa kuat; masalahnya recourse terbatas + tanpa histori." }
          ],
        },
        {
          q: "Ciri pembeda specialised lending dari kredit korporasi biasa?",
          options: [
            { text: "Sumber pembayaran utama = proyek/aset yang dibiayai", why: "Benar: definisi Basel.", correct: true },
            { text: "Tenornya selalu di atas 10 tahun", why: "Commodities finance justru jangka pendek." },
            { text: "Agunannya selalu properti", why: "Hanya IPRE; object finance = kapal/pesawat." },
            { text: "Suku bunganya lebih tinggi", why: "Bunga adalah harga, bukan ciri definisi." }
          ],
        },
        {
          q: "Proyek EAD Rp1.000 M jatuh dari good ke weak. Kenaikan RWA?",
          options: [
            { text: "Rp1.600 M (dari 900 menjadi 2.500)", why: "Benar: 1000×(250%−90%) = 1600.", correct: true },
            { text: "Rp160 M", why: "Salah hitung — selisih bobot 160 poin × 1000." },
            { text: "Rp2.500 M", why: "Itu RWA weak, bukan kenaikannya." },
            { text: "Tidak berubah — EAD sama", why: "RWA = EAD × bobot; bobot berubah drastis." }
          ],
        },
        {
          q: "Account officer: 'Sponsornya konglomerat — pasti strong.' Respons tepat?",
          options: [
            { text: "Sponsor hanya satu dari lima faktor; nilai DSCR, konstruksi, dan pengaman juga", why: "Benar: grade = agregat faktor.", correct: true },
            { text: "Setuju — sponsor kuat menjamin proyek", why: "Recourse terbatas; sponsor kuat tidak menjamin proyek." },
            { text: "Tolak mentah-mentah — sponsor tidak relevan", why: "Sponsor relevan sebagai faktor, hanya bukan satu-satunya." },
            { text: "Minta sponsor menambah modal dulu", why: "Itu negosiasi struktur, bukan penilaian grade." }
          ],
        }
      ],
      reference: "70/90/115/250. Tanpa histori = slotting. Grade = agregat 5 faktor.",
    },
  ],
};
