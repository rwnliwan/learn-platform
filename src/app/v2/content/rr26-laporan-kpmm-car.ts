import type { V2Lesson } from "../lib/types";

const FIG_MODAL = `<svg viewBox="0 0 480 300" role="img" aria-label="Komposisi modal bank.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Modal Rp60 T menopang ATMR Rp400 T</text>
<rect x="60" y="60" width="120" height="45" fill="var(--c1)" opacity="0.7"/>
<text x="120" y="87" font-size="11" fill="var(--chart-text)" text-anchor="middle">CET1: 45</text>
<rect x="60" y="105" width="120" height="25" fill="var(--c2)" opacity="0.7"/>
<text x="120" y="122" font-size="11" fill="var(--chart-text)" text-anchor="middle">AT1: 5</text>
<rect x="60" y="130" width="120" height="40" fill="var(--c3)" opacity="0.7"/>
<text x="120" y="154" font-size="11" fill="var(--chart-text)" text-anchor="middle">Tier 2: 10</text>
<rect x="240" y="60" width="180" height="110" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="330" y="100" font-size="11" fill="var(--chart-text)" text-anchor="middle">ATMR: 400</text>
<text x="330" y="118" font-size="10" fill="var(--text-muted)" text-anchor="middle">kredit + pasar +</text>
<text x="330" y="132" font-size="10" fill="var(--text-muted)" text-anchor="middle">operasional</text>
<text x="210" y="112" font-size="16" fill="var(--chart-text)" text-anchor="middle">/</text>
<text x="120" y="205" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">CAR = 60 / 400 = 15,0%</text>
<text x="120" y="226" font-size="10" fill="var(--text-muted)" text-anchor="middle">CET1 11,25% · Tier 1 12,5%</text>
<text x="240" y="262" font-size="11" fill="var(--chart-text)" text-anchor="middle">Kualitas = komposisi. CET1 75% dari modal = fondasi kuat.</text>
</g>
</svg>`;

export const rr26: V2Lesson = {
  slug: "rr26-laporan-kpmm-car",
  track: "Risk Reporting",
  module: "Permodalan & KPMM",
  title: "RR26 — Laporan KPMM/CAR: Dari RWA ke Rasio Modal",
  estMinutes: 54,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan yang ditolak bukan karena ATMR-nya",
      prose: [
        "Tim risk reporting Bank Cahaya Timur lembur dua minggu menyusun laporan KPMM. ATMR Rp400 triliun — sudah direkonsiliasi tiga kali dengan tim risiko kredit. Modal total Rp62 triliun. CAR = 62/400 = 15,5%. Laporan dikirim ke OJK dengan percaya diri. Seminggu kemudian: dikembalikan. Bukan karena ATMR salah — melainkan karena komposisi modalnya.",
        "Twist-nya: dari Rp62 triliun itu, Rp32 triliun adalah modal pelengkap (Tier 2) sementara modal inti (Tier 1) hanya Rp30 triliun. Aturan POJK: Tier 2 paling tinggi diakui 100% dari Tier 1 — maka hanya Rp30 triliun yang dihitung. Modal diakui = Rp60 triliun, CAR = 15,0%, bukan 15,5%. Lebih menyakitkan: bank pesaing dengan modal total LEBIH KECIL (Rp55 triliun) tetapi komposisi sehat (Tier 1 Rp45 triliun) dinilai LEBIH KUAT — CET1 10,5% vs 7,0%. Modal lebih besar, rasio lebih tinggi, penilaian lebih buruk. Kualitas mengalahkan kuantitas.",
        "Inilah wilayah lesson ini — dan pembagian kerjanya perlu ditegaskan eksplisit agar tidak tumpang tindih dengan CR4A. CR4A (track Credit Risk) = menghitung ATMR: dari aset menjadi aset tertimbang menurut risiko lewat bobot risiko, pendekatan standar vs model internal. Lesson ini MENGAMBIL ATMR SEBAGAI INPUT dan mengerjakan sisanya: menyusun komposisi modal (CET1/AT1/Tier 2) dengan batas-batasnya, menerapkan buffer dan threshold profil risiko OJK, menghitung rasio KPMM, menilai kepatuhan, dan menyusun laporan yang lolos QC. Kalau angka ATMR dipertanyakan \u2014 larinya ke tim dan model wilayah CR4A. Kalau komposisi modal, buffer, atau ambang kepatuhan yang dipertanyakan \u2014 larinya ke sini.",
        "Setelah lesson ini kamu bisa: (1) menghitung CAR, CET1 ratio, dan Tier 1 ratio dari komponen modal; (2) menerapkan batas Tier 2 dan persyaratan buffer; (3) menentukan kebutuhan modal efektif bank dari peringkat profil risikonya; (4) menilai status kepatuhan dan menyusun laporan KPMM yang tahan QC.",
        "Tiga bekal prasyarat, diringkas cepat. RR16 membahas ECL dan RWA: ATMR dihitung dari risiko kredit (lewat bobot risiko dan pencadangan ECL), risiko pasar, dan risiko operasional \u2014 ATMR adalah penyebut setiap rasio modal. CR4A membahas Basel dan RWA dari sisi kredit: bagaimana Rp1 triliun aset berubah menjadi ATMR lewat bobot risiko, plus perbedaan pendekatan standar vs model internal. Lesson ini mulai tepat di titik kedua lesson itu berhenti: ATMR sudah di tangan, sekarang hitung rasionya dan laporkan.",
        "Satu prinsip yang memandu: laporan KPMM bukan aritmetika \u2014 ia pernyataan kepatuhan. Setiap angka rasio adalah klaim 'bank ini patuh' yang ditandatangani dan bisa diaudit. Hitung seperti akuntan, berpikir seperti auditor.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan KPMM adalah salah satu laporan paling sensitif yang ditangani risk reporting \u2014 dibaca OJK, direksi, dan analis. Analis yang bisa menjelaskan MENGAPA CAR banknya 15% (bukan sekadar angkanya) menjadi rujukan direksi setiap ada pertanyaan regulator.",
      },
      reference: "CR4A = hitung ATMR. Lesson ini = ATMR \u2192 rasio + laporan. Batas jelas.",
    },
    {
      id: "rumus",
      eyebrow: "Langkah 2 · Konsep",
      title: "Rumus CAR dan anatomi modal",
      prose: [
        "Rumusnya satu baris: CAR = modal / ATMR \u00D7 100%. Tetapi pembilangnya berlapis. Modal inti (Tier 1) = modal inti utama (CET1) + modal inti tambahan (AT1). CET1 adalah kualitas tertinggi: modal disetor, agio, laba ditahan, dan komponen ekuitas lain yang menyerap rugi pertama. AT1: instrumen hybrid seperti obligasi yang bisa dikonversi/dihapuskan saat bank bermasalah. Modal pelengkap (Tier 2): utang subordinasi dan cadangan umum \u2014 menyerap rugi belakangan, kualitas terendah.",
        "Tiga ambang minimum dari POJK: CET1 paling rendah 4,5% dari ATMR; Tier 1 paling rendah 6%; total CAR mengikuti profil risiko (dibahas langkah 3). Ditambah satu batas komposisi: Tier 2 hanya diakui paling tinggi 100% dari Tier 1 \u2014 inilah yang menjegal Bank Cahaya Timur. Bank tidak bisa 'membeli' CAR dengan menumpuk utang subordinasi; fondasi Tier 1 harus dibangun dulu.",
        "Penyebutnya: total ATMR = ATMR risiko kredit + ATMR risiko pasar + ATMR risiko operasional. Angka ini datang dari tim risiko (wilayah CR4A/RR16) \u2014 tugasmu bukan menghitungnya ulang, melainkan memastikan angka yang kamu pakai = angka final yang sudah direkonsiliasi, dengan tanggal posisi yang sama dengan pembilang modal. Ketidakcocokan tanggal posisi adalah temuan klasik: modal per 31 Maret dibagi ATMR per 28 Februari.",
        "Cara membaca gambar di atas: tiga blok kiri = susunan modal Rp60 T (CET1 45, AT1 5, Tier 2 10); blok kanan = ATMR Rp400 T yang harus 'ditopang'. Garis miring di tengah = pembagian. Interpretasi: 75% modal adalah CET1 \u2014 fondasi kuat. Bank dengan komposisi ini tidak akan dipertanyakan kualitasnya; bank dengan Tier 2 dominan akan.",
        "Contoh langkah-demi-langkah (Bank Sehat Sentosa): CET1 45, AT1 5, Tier 2 10, ATMR 400. Tier 1 = 45 + 5 = 50. Tier 2 diakui = min(10, 100% \u00D7 50) = 10 (lolos batas). Modal diakui = 60. CET1 ratio = 45/400 = 11,25%. Tier 1 ratio = 50/400 = 12,5%. CAR = 60/400 = 15,0%. Tiga rasio, satu kesimpulan: jauh di atas semua minimum.",
        "Contoh yang gagal batas (Bank Cahaya Timur): CET1 28, AT1 2, Tier 2 32, ATMR 400. Tier 1 = 30. Tier 2 diakui = min(32, 100% \u00D7 30) = 30 \u2014 Rp2 triliun HANGUS dari perhitungan. Modal diakui = 60, CAR = 15,0% (bukan 15,5%). CET1 ratio hanya 7,0%. Pelajaran: Rp2 triliun utang subordinasi diterbitkan sia-sia untuk rasio \u2014 biaya bunga jalan, manfaat modal tidak diakui. Perencana modal harus menghitung batas ini SEBELUM menerbitkan instrumen, bukan sesudah.",
      ],
      figure: {
        svg: FIG_MODAL,
        alt: "Komposisi modal bank.",
        caption: "Cara membaca: blok kiri = susunan modal (pembilang), blok kanan = ATMR (penyebut). Interpretasi: porsi CET1 menentukan kualitas rasio.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CModal kami Rp62 triliun, ATMR Rp400 triliun, jadi CAR 15,5%.\u201D Belum tentu \u2014 Rp62 triliun itu modal AKUNTANSI. Modal REGULASI = setelah batas Tier 2 (maks 100% Tier 1) dan penyesuaian lain. Selalu hitung 'modal yang diakui' dulu sebelum membagi. CAR = modal diakui / ATMR, bukan modal akuntansi / ATMR.",
      },
      hints: [
        "Urutan hitung: Tier 1 dulu \u2192 terapkan batas Tier 2 \u2192 jumlahkan \u2192 bagi ATMR.",
        "Tanggal posisi modal dan ATMR harus SAMA \u2014 cek ini pertama saat QC.",
      ],
      formula: String.raw`\text{CAR} = \frac{\text{Modal yang diakui}}{\text{ATMR}} \times 100\%`,
      formulaNote: "Modal yang diakui = Tier 1 (CET1 + AT1) + Tier 2 yang diakui, dalam Rp. Tier 2 yang diakui = min(Tier 2 aktual, 100% \u00D7 Tier 1). ATMR = total aset tertimbang menurut risiko (kredit + pasar + operasional), dalam Rp. Contoh: (45+5+10)/400 \u00D7 100% = 15,0%; CET1 ratio = 45/400 = 11,25%. Interpretasi: CAR mengukur bantalan total; CET1 ratio mengukur KUALITAS bantalan \u2014 pasar dan regulator membaca keduanya, dan kualitas tidak bisa dikompensasi kuantitas.",
      reference: "Tier 1 dulu, batas Tier 2, jumlahkan, bagi ATMR.",
    },
    {
      id: "buffer",
      eyebrow: "Langkah 3 · Konsep",
      title: "Buffer dan threshold: kebutuhan efektif bank",
      prose: [
        "Minimum 8% hanya untuk bank dengan peringkat profil risiko 1 (terbaik). POJK 11/2016 menetapkan tangga: peringkat 1 \u2192 8%; peringkat 2 \u2192 9% sampai di bawah 10%; peringkat 3 \u2192 10% sampai di bawah 11%; peringkat 4 atau 5 \u2192 11% sampai 14%. OJK bahkan boleh menetapkan lebih tinggi bila menilai bank menghadapi potensi kerugian besar. Jadi 'minimum' bukan satu angka \u2014 ia tangga yang menempel pada kualitas manajemen risiko bank.",
        "Di atas tangga itu wajib ditumpuk buffer \u2014 semuanya dipenuhi dengan CET1, tidak bisa dengan Tier 2. Satu: capital conservation buffer 2,5% dari ATMR \u2014 penyangga untuk dipakai saat krisis (bank yang menggerus buffer ini menghadapi pembatasan dividen otomatis). Dua: countercyclical buffer 0\u20132,5% \u2014 ditetapkan otoritas mengikuti kondisi makroekonomi, ditujukan meredam ekspansi kredit berlebihan saat ekonomi memanas. Tiga: capital surcharge untuk bank sistemik (D-SIB) \u2014 berjenjang menurut bucket: 1% (bucket 1), 1,5% (bucket 2), 2% (bucket 3), 2,5% (bucket 4), 3,5% (bucket 5).",
        "Rumus kebutuhan efektif menggabungkan semuanya. Contoh Bank Sehat Sentosa: peringkat profil risiko 2 (minimum 9%) + conservation 2,5% + countercyclical 0% + D-SIB bucket 1 (1%) = 12,5%. Artinya: total CAR wajib \u2265 12,5%; dan CET1 wajib \u2265 4,5% + (2,5% + 0% + 1%) = 8,0%. CAR aktual 15,0% \u2192 patuh dengan margin 2,5 poin. CET1 aktual 11,25% \u2192 patuh dengan margin 3,25 poin. Dua uji, dua-duanya harus lolos \u2014 bank yang lolos total tetapi jebol CET1 tetap tidak patuh.",
        "Konteks industri nyata: BI mencatat CAR industri perbankan 25,48% per Mei 2025; BCA 26,6% (Q1 2025); BSI 21,39% \u2014 semuanya jauh di atas kebutuhan efektif masing-masing. Margin tebal ini bukan kebetulan: bank Indonesia menahan buffer besar karena ingat krisis 1998 dan karena ekspansi kredit butuh 'bahan bakar' modal. Analis yang melaporkan CAR 15% tanpa menyebut kebutuhan efektif bank itu (12,5%? 14%?) sedang melaporkan setengah cerita.",
        "Dua miskonsepsi. Satu: 'CAR 15% pasti aman.' Aman relatif terhadap APA? Bank peringkat 4 dengan D-SIB bucket 3 butuh 11% + 2,5% + 2% = 15,5% \u2014 CAR 15% di sana = tidak patuh. Dua: 'Buffer bisa dipenuhi Tier 2.' Tidak \u2014 seluruh buffer wajib CET1. Bank yang menumpuk Tier 2 untuk 'mengejar buffer' sedang membangun di atas fondasi yang salah.",
        "Satu jebakan perencanaan: menerbitkan AT1/Tier 2 itu cepat (hitungan minggu), menaikkan CET1 itu lambat (laba ditahan butuh kuartal, rights issue butuh persetujuan). Bank yang kebutuhan CET1-nya mepet tidak bisa 'membeli jalan keluar' dengan instrumen cepat \u2014 ia harus merencanakan 2-3 kuartal ke depan. Inilah mengapa laporan KPMM dibaca bersama capital plan (lihat RR25).",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Selalu uji DUA lapis: total CAR vs kebutuhan efektif total, DAN CET1 vs kebutuhan efektif CET1. Kegagalan kepatuhan paling memalukan adalah yang lolos di total tetapi jebol di CET1 \u2014 seperti Bank Cahaya Timur di mini-case: total 15% terlihat patuh, CET1 7% ternyata tidak.",
      },
      hints: [
        "Buffer = CET1 only. Tulis ini di dinding.",
        "Kebutuhan efektif = tangga profil risiko + conservation + CCyB + D-SIB.",
      ],
      formula: String.raw`K_{efektif} = K_{profil} + B_{cons} + B_{ccyb} + S_{dsib}`,
      formulaNote: "K_efektif = kebutuhan modal total bank (% dari ATMR). K_profil = minimum sesuai peringkat profil risiko (8%; 9\u2013<10%; 10\u2013<11%; 11\u201314%). B_cons = capital conservation buffer, 2,5%. B_ccyb = countercyclical buffer, 0\u20132,5% (penetapan otoritas). S_dsib = capital surcharge bank sistemik (1%; 1,5%; 2%; 2,5%; 3,5% per bucket). Contoh: 9% + 2,5% + 0% + 1% = 12,5%. Interpretasi: inilah garis kepatuhan SEBENARNYA bank \u2014 bukan 8%. Kebutuhan CET1 efektif = 4,5% + (B_cons + B_ccyb + S_dsib).",
      reference: "Uji dua lapis: total vs efektif, CET1 vs efektif. Buffer = CET1.",
    },
    {
      id: "qc",
      eyebrow: "Langkah 4 · Konsep",
      title: "Menyusun dan meng-QC laporan KPMM",
      prose: [
        "Alur penyusunan, enam langkah. Satu: kumpulkan komponen modal dari laporan keuangan \u2014 dengan rekonsiliasi: setiap pos modal regulasi harus bisa dilacak ke pos akuntansi (prinsip yang sama dengan template LI1/LI2 di RR24). Dua: ambil ATMR final dari tim risiko \u2014 kredit, pasar, operasional \u2014 pastikan tanggal posisi sama dengan modal. Tiga: terapkan batas (Tier 2 \u2265 100% Tier 1) dan hitung modal yang diakui. Empat: hitung tiga rasio (CET1, Tier 1, total CAR). Lima: bandingkan dengan kebutuhan efektif (tangga profil risiko + buffer). Enam: telaah berjenjang (risk \u2192 keuangan \u2192 direksi) lalu sampaikan ke OJK.",
        "QC memakai checklist lima item \u2014 jalankan SEBELUM telaah direksi, bukan sesudah. (1) Tanggal posisi: modal dan ATMR per tanggal yang sama? (2) Rekonsiliasi: total modal regulasi = modal akuntansi \u00B1 penyesuaian yang terdokumentasi? (3) Batas: Tier 2 \u2264 100% Tier 1 sudah diterapkan? (4) Threshold: peringkat profil risiko yang dipakai = peringkat TERKINI (ingat: posisi Maret\u2013Agustus memakai peringkat Desember tahun lalu)? (5) Konsistensi antar periode: perubahan rasio >1 poin harus punya penjelasan tertulis \u2014 bukan 'fluktuasi biasa'.",
        "Tiga miskonsepsi pelaporan. Satu: 'ATMR turun = kabar baik, CAR naik.' Belum tentu \u2014 tanyakan MENGAPA turun: deleveraging sehat, penjualan aset, atau window dressing akhir kuartal (transaksi temporer menekan ATMR)? Pola ATMR yang turun setiap akhir kuartal lalu naik lagi = sinyal manipulasi yang dibaca OJK. Dua: 'Laporan sudah dikirim = selesai.' OJK bisa mengembalikan (seperti Cahaya Timur) atau meminta klarifikasi; siapkan tim untuk putaran tanya-jawab. Tiga: 'Ini urusan tim keuangan saja.' Risk reporting adalah pemilik angka ATMR dan buffer \u2014 tanpa keterlibatannya, laporan = angka keuangan tanpa penjelasan risiko.",
        "Pembagian kerja dengan CR4A, ditegaskan sekali lagi secara operasional. Input dari wilayah CR4A: angka ATMR per jenis risiko + metodologi perhitungannya + penjelasan perubahan metodologi. Output wilayah lesson ini: modal yang diakui + rasio + penilaian kepatuhan + laporan ke OJK. Titik serah terima = angka ATMR final yang direkonsiliasi. Sengketa di titik ini ('ATMR kredit naik 8%, kenapa?') diselesaikan BERSAMA kedua tim sebelum laporan jalan \u2014 bukan setelah OJK bertanya.",
        "Satu praktik terbaik: simpan 'buku jejak' (audit trail) tiap kuartal \u2014 file yang mencatat sumber setiap angka, siapa yang menghitung, siapa yang me-review, dan tanggalnya. Saat OJK bertanya 'dari mana angka Tier 2 Rp10 triliun ini?' dua tahun kemudian, jawabannya ada di buku jejak, bukan di ingatan analis yang sudah resign.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CPeringkat profil risiko kami 2, jadi minimum 9%.\u201D Cek TANGGALNYA: peringkat untuk posisi Maret\u2013Agustus memakai peringkat Desember tahun lalu; September\u2013Februari memakai peringkat Juni. Memakai peringkat lama setelah ada penurunan peringkat = melaporkan dengan ambang yang salah = temuan kepatuhan.",
      },
      hints: [
        "QC lima item: tanggal, rekonsiliasi, batas Tier 2, threshold terkini, konsistensi antar periode.",
        "Buku jejak audit trail = asuransi karir saat OJK bertanya dua tahun kemudian.",
      ],
      reference: "Serah terima CR4A\u2192sini = ATMR final terekonsiliasi. QC sebelum telaah.",
    },
    {
      id: "lab-kpmm",
      eyebrow: "Langkah 5 · Lab",
      title: "Menghitung KPMM lengkap",
      prose: [
        "Bank Sehat Sentosa: CET1 Rp45 T, AT1 Rp5 T, Tier 2 Rp12 T, ATMR Rp400 T. Hitung Tier 1, Tier 2 yang diakui (batas 100% Tier 1), modal diakui, lalu tiga rasio: CET1, Tier 1, dan total CAR.",
        "Hasil: Tier 2 Rp12 T \u2264 Rp50 T \u2192 diakui penuh; CAR 15,5%. Eksperimen: naikkan Tier 2 menjadi Rp60 T \u2014 berapa yang diakui? (Rp50 T; Rp10 T hangus.) Inilah simulasi yang wajib dijalankan SEBELUM menerbitkan utang subordinasi baru.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tier1`, `tier2_diakui`, dan `modal`" },
        { id: "t2", text: "Hitung `cet1_ratio`, `t1_ratio`, `car` (%) dan cetak" },
      ],
      expected: "CET1: 11.2%\nTier 1: 12.5%\nCAR: 15.5%",
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Fungsi min() satu baris ini menyelamatkan Rp2 triliun Bank Cahaya Timur seandainya dijalankan sebelum laporan dikirim. Simulasi batas komposisi = bagian termurah dari perencanaan modal.",
      },
      hints: [
        "tier2_diakui = min(tier2, tier1).",
        "Rasio = komponen / ATMR \u00D7 100.",
      ],
      code: {
        starter: "# (Rp triliun). JANGAN UBAH.\ncet1, at1, tier2 = 45, 5, 12\natmr = 400\n\n# TULIS KODEMU: tier1, tier2 diakui (batas 100%), modal, tiga rasio\ntier1 = \ntier2_diakui = \nmodal = \ncet1_ratio = \nt1_ratio = \ncar = \nprint(f\"CET1: {cet1_ratio:.1f}%\")\nprint(f\"Tier 1: {t1_ratio:.1f}%\")\nprint(f\"CAR: {car:.1f}%\")\n",
        lockLines: 9,
        solution: "# (Rp triliun). JANGAN UBAH.\ncet1, at1, tier2 = 45, 5, 12\natmr = 400\n\n# TULIS KODEMU: tier1, tier2 diakui (batas 100%), modal, tiga rasio\ntier1 = cet1 + at1\ntier2_diakui = min(tier2, tier1)\nmodal = tier1 + tier2_diakui\ncet1_ratio = cet1 / atmr * 100\nt1_ratio = tier1 / atmr * 100\ncar = modal / atmr * 100\nprint(f\"CET1: {cet1_ratio:.1f}%\")\nprint(f\"Tier 1: {t1_ratio:.1f}%\")\nprint(f\"CAR: {car:.1f}%\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Tier2 diakui 12", msg: "min(12, 50).", name: "tier2_diakui", value: 12, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "Modal 62", msg: "50 + 12.", name: "modal", value: 62, tol: 1e-9 },
          { kind: "equal", task: "t2", label: "CET1 11.25", msg: "45/400 \u00D7 100.", name: "cet1_ratio", value: 11.25, tol: 1e-9 },
          { kind: "stdout_matches", task: "t2", label: "CAR 15.5", msg: "62/400 \u00D7 100.", pattern: "CAR: 15.5%" },
        ],
      },
      reference: "Batas dulu (min), baru jumlahkan, baru bagi ATMR.",
    },
    {
      id: "lab-patuh",
      eyebrow: "Langkah 6 · Lab",
      title: "Uji kepatuhan dua lapis",
      prose: [
        "Bank Sehat Sentosa: peringkat profil risiko 2 (minimum 9%), D-SIB bucket 1 (surcharge 1%), countercyclical 0%. Dari lab sebelumnya: CET1 11,25%, CAR 15,5%. Hitung kebutuhan efektif total dan kebutuhan CET1 efektif, lalu tentukan status: 'PATUH' bila kedua lapis lolos, 'TIDAK PATUH' bila ada yang jebol \u2014 serta margin-nya.",
        "Hasil: kebutuhan total 12,5% (lolos, margin 3,0 poin); CET1 efektif 8,0% (lolos, margin 3,25 poin) \u2192 PATUH. Eksperimen: ganti ke peringkat profil risiko 4 (minimum 11%) + D-SIB bucket 3 (2%) \u2014 kebutuhan total jadi 15,5%, margin NOL. Satu peringkat turun = seluruh ruang napas hilang. Inilah mengapa penurunan peringkat profil risiko adalah kabar buruk yang sesungguhnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `k_total` dan `k_cet1` (kebutuhan efektif, %)" },
        { id: "t2", text: "Tentukan `status` dan cetak margin + status" },
      ],
      expected: "Kebutuhan total: 12.5% (margin 3.0)\nKebutuhan CET1: 8.0% (margin 3.2)\nStatus: PATUH",
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Margin kepatuhan = 'jarak ke tilang'. Direksi tidak butuh tahu rumusnya \u2014 mereka butuh tahu marginnya berapa dan apa yang bisa menggerusnya. Sajikan margin, bukan rumus.",
      },
      hints: [
        "k_total = profil + 2,5 + ccyb + dsib.",
        "k_cet1 = 4,5 + 2,5 + ccyb + dsib.",
        "Kedua lapis harus lolos untuk PATUH.",
      ],
      code: {
        starter: "# (%). JANGAN UBAH.\nprofil, ccyb, dsib = 9.0, 0.0, 1.0\ncet1_r, car_r = 11.25, 15.5\n\n# TULIS KODEMU: kebutuhan efektif + status kepatuhan\nk_total = \nk_cet1 = \nstatus = \nprint(f\"Kebutuhan total: {k_total:.1f}% (margin {car_r-k_total:.1f})\")\nprint(f\"Kebutuhan CET1: {k_cet1:.1f}% (margin {cet1_r-k_cet1:.1f})\")\nprint(f\"Status: {status}\")\n",
        lockLines: 8,
        solution: "# (%). JANGAN UBAH.\nprofil, ccyb, dsib = 9.0, 0.0, 1.0\ncet1_r, car_r = 11.25, 15.5\n\n# TULIS KODEMU: kebutuhan efektif + status kepatuhan\nk_total = profil + 2.5 + ccyb + dsib\nk_cet1 = 4.5 + 2.5 + ccyb + dsib\nstatus = \"PATUH\" if car_r >= k_total and cet1_r >= k_cet1 else \"TIDAK PATUH\"\nprint(f\"Kebutuhan total: {k_total:.1f}% (margin {car_r-k_total:.1f})\")\nprint(f\"Kebutuhan CET1: {k_cet1:.1f}% (margin {cet1_r-k_cet1:.1f})\")\nprint(f\"Status: {status}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "K_total 12.5", msg: "9+2,5+0+1.", name: "k_total", value: 12.5, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "K_cet1 8.0", msg: "4,5+2,5+0+1.", name: "k_cet1", value: 8.0, tol: 1e-9 },
          { kind: "equal", task: "t2", label: "Status PATUH", msg: "Kedua lapis lolos.", name: "status", value: "PATUH" },
          { kind: "stdout_matches", task: "t2", label: "Cetak status", msg: "Cetak margin dan status.", pattern: "Status: PATUH" },
        ],
      },
      reference: "Dua lapis: total vs efektif, CET1 vs efektif. Satu jebol = tidak patuh.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Lima skenario, lima respons",
      prose: [
        "Satu: CAR turun 3 kuartal beruntun tetapi masih di atas kebutuhan efektif \u2192 SELIDIKI TREN. Cari penyebab: ATMR naik (ekspansi agresif?) atau modal tergerus (rugi/divden besar?). Tren turun = peringatan dini; jangan tunggu menyentuh garis. Dua: margin ke kebutuhan efektif < 1 poin \u2192 SIAGA MODAL. Tahan dividen, tunda ekspansi ATMR besar, siapkan rencana penerbitan modal. Di bawah 1 poin, satu kuartal buruk bisa menjebol kepatuhan.",
        "Tiga: Tier 2 mendekati 100% dari Tier 1 \u2192 STOP TERBITKAN TIER 2. Setiap rupiah Tier 2 baru tidak menambah CAR \u2014 hanya menambah biaya bunga. Alihkan rencana ke penguatan CET1 (laba ditahan/rights issue). Empat: ATMR naik >10% dalam setahun \u2192 AUDIT PERTUMBUHAN. Pastikan kenaikan berasal dari bisnis yang direncanakan (ada di capital plan RR25), bukan dari penurunan kualitas aset yang menaikkan bobot risiko.",
        "Lima: bank naik bucket D-SIB (mis. bucket 1 \u2192 2, surcharge +0,5%) \u2192 HITUNG ULANG KEBUTUHAN. Kenaikan surcharge menggerus margin CET1 efektif 0,5 poin seketika \u2014 tanpa satu rupiah pun perubahan di neraca. Rencanakan 2 kuartal sebelumnya bila skor sistemik bankmu mendekati ambang bucket berikutnya.",
        "Aturan praktis 10 detik: hitung tiga rasio \u2192 bandingkan dengan kebutuhan efektif dua lapis \u2192 cek margin \u2192 putuskan: aman / siaga / rem. Tiga rasio, dua pembanding, satu keputusan \u2014 dasbor KPMM yang seharusnya dilihat direksi tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jadikan peta ini SOP eskalasi: siapa dihubungi saat margin < 1 poin, siapa memutuskan penundaan dividen. Keputusan modal yang diambil panik di menit terakhir selalu lebih mahal dari keputusan yang diambil tenang 2 kuartal sebelumnya.",
      },
      reference: "Rasio \u2192 vs efektif (2 lapis) \u2192 margin \u2192 aman / siaga / rem.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Cahaya Timur: lolos total, jebol CET1",
      prose: [
        "Data Bank Cahaya Timur: CET1 Rp28 T, AT1 Rp2 T, Tier 2 Rp32 T, ATMR Rp400 T; peringkat profil risiko 2; D-SIB bucket 2 (surcharge 1,5%); countercyclical 0%.",
        "Pertanyaan: (a) Hitung tiga rasio dengan batas Tier 2. (b) Hitung kebutuhan efektif dua lapis. (c) Patuh atau tidak \u2014 dan apa rekomendasi ke direksi? Pembahasan: (a) Tier 1 = 30; Tier 2 diakui = min(32, 30) = 30 (Rp2 T hangus); modal = 60; CET1 = 7,0%; Tier 1 = 7,5%; CAR = 15,0%. (b) Kebutuhan total = 9 + 2,5 + 0 + 1,5 = 13,0% \u2192 lolos (margin 2,0). Kebutuhan CET1 = 4,5 + 2,5 + 0 + 1,5 = 8,5% \u2192 JEBOL (7,0% < 8,5%, defisit 1,5 poin = Rp6 T). (c) TIDAK PATUH. Rekomendasi: tambah CET1 Rp6 T+ (laba ditahan/rights issue); stop rencana penerbitan Tier 2 baru (tidak menambah apa-apa); revisi capital plan. Total CAR 15% yang 'terlihat patuh' ternyata menutupi defisit CET1 Rp6 triliun \u2014 inilah mengapa uji dua lapis tidak bisa ditawar.",
        "Pelajaran mini-case: laporan KPMM yang hanya menampilkan total CAR akan meloloskan Bank Cahaya Timur \u2014 dan OJK akan mengembalikannya, seperti di cerita pembuka. Kualitas laporan = kelengkapan uji, bukan keindahan angka.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Defisit CET1 Rp6 triliun tidak bisa ditutup dalam semalam \u2014 rights issue butuh RUPS, laba ditahan butuh kuartal. Inilah nilai laporan KPMM yang jujur dan dini: memberi direksi WAKTU. Laporan yang menutupi masalah = mencuri waktu dari direksi sendiri.",
      },
      reference: "Total lolos + CET1 jebol = tidak patuh. Uji dua lapis, selalu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "CAR = modal yang diakui / ATMR \u00D7 100% \u2014 Tier 2 diakui maksimal 100% dari Tier 1; modal akuntansi \u2260 modal regulasi.",
        "Tiga minimum: CET1 \u2265 4,5%, Tier 1 \u2265 6%, total mengikuti tangga profil risiko (8% / 9\u2013<10% / 10\u2013<11% / 11\u201314%) \u2014 OJK boleh menetapkan lebih tinggi.",
        "Buffer wajib CET1: conservation 2,5% + countercyclical 0\u20132,5% + D-SIB surcharge 1\u20133,5% per bucket \u2014 kebutuhan efektif = tangga + buffer.",
        "Uji kepatuhan DUA lapis: total CAR vs kebutuhan efektif total DAN CET1 vs kebutuhan efektif CET1 \u2014 satu jebol = tidak patuh.",
        "Pembagian kerja: CR4A menghitung ATMR; lesson ini menghitung rasio, menilai kepatuhan, dan menyusun laporan \u2014 titik serah terima = ATMR final terekonsiliasi.",
      ],
      next: { label: "RR27 — Pelaporan Model Risk: Inventaris, Validasi, Monitoring", href: "/v2/learn/rr27-pelaporan-model-risk" },
      quiz: [
        {
          q: "CET1 28, AT1 2, Tier 2 32, ATMR 400 (Rp triliun). Modal yang diakui dan CAR?",
          options: [
            { text: "Rp60 T \u2192 CAR 15,0% (Rp2 T Tier 2 hangus karena batas 100% Tier 1)", why: "Benar: Tier 1 = 30, Tier 2 diakui = min(32,30) = 30.", correct: true },
            { text: "Rp62 T \u2192 CAR 15,5%", why: "Itu modal akuntansi \u2014 belum kena batas Tier 2." },
            { text: "Rp30 T \u2192 CAR 7,5%", why: "Itu hanya Tier 1; Tier 2 yang diakui tetap dihitung." },
            { text: "Rp92 T \u2192 CAR 23%", why: "Tidak ada penjumlahan yang menghasilkan ini." },
          ],
        },
        {
          q: "Bank peringkat profil risiko 2, D-SIB bucket 1, countercyclical 0%. Kebutuhan modal total efektif?",
          options: [
            { text: "12,5%", why: "Benar: 9 + 2,5 + 0 + 1 = 12,5.", correct: true },
            { text: "8%", why: "Itu minimum peringkat 1 \u2014 belum termasuk tangga dan buffer." },
            { text: "9%", why: "Itu baru tangga profil risiko \u2014 belum ditambah buffer." },
            { text: "11,5%", why: "Lupa surcharge D-SIB 1%." },
          ],
        },
        {
          q: "CAR 15% (kebutuhan 13%) tetapi CET1 7% (kebutuhan 8,5%). Status kepatuhan:",
          options: [
            { text: "TIDAK PATUH \u2014 defisit CET1 1,5 poin wajib ditutup dengan CET1", why: "Benar: uji dua lapis; satu jebol = tidak patuh.", correct: true },
            { text: "PATUH \u2014 total CAR di atas kebutuhan", why: "Total saja tidak cukup; CET1 punya ambang sendiri." },
            { text: "PATUH bila menambah Tier 2", why: "Buffer wajib CET1 \u2014 Tier 2 tidak membantu." },
            { text: "Tidak bisa dinilai", why: "Bisa \u2014 datanya lengkap untuk dua lapis uji." },
          ],
        },
        {
          q: "Item QC yang PALING dulu dicek sebelum menghitung rasio:",
          options: [
            { text: "Tanggal posisi modal dan ATMR sama + rekonsiliasi ke laporan keuangan", why: "Benar: fondasi salah = seluruh rasio salah.", correct: true },
            { text: "Font laporan", why: "Kosmetik \u2014 bukan QC substansi." },
            { text: "Jumlah halaman", why: "Tidak relevan dengan kebenaran angka." },
            { text: "Tanda tangan direksi", why: "Itu langkah telaah \u2014 setelah QC angka." },
          ],
        },
        {
          q: "Pembagian kerja CR4A vs lesson ini yang tepat:",
          options: [
            { text: "CR4A menghitung ATMR; lesson ini dari ATMR menghitung rasio, menilai kepatuhan, menyusun laporan", why: "Benar: titik serah terima = ATMR final terekonsiliasi.", correct: true },
            { text: "Keduanya menghitung ATMR", why: "Duplikasi \u2014 justru yang dihindari." },
            { text: "Lesson ini menghitung ulang ATMR", why: "ATMR diambil sebagai input final dari tim risiko." },
            { text: "CR4A menyusun laporan ke OJK", why: "Laporan KPMM = wilayah lesson ini." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CLaporan KPMM = hitung CAR.\u201D Bukan. Laporan KPMM = komposisi modal + tiga rasio + uji dua lapis + penjelasan perubahan + buku jejak. CAR hanyalah satu baris di halaman pertama.",
      },
      hints: [
        "Uji cepat: Tier 1 = 30, Tier 2 = 32 \u2014 berapa diakui? (30)",
        "Ingat: buffer = CET1 only; uji dua lapis selalu.",
      ],
      reference: "Laporkan kepatuhan, bukan sekadar rasio.",
    },
  ],
};
