import type { V2Lesson } from "../lib/types";

const FIG_UTIL = `<svg viewBox="0 0 520 300" role="img" aria-label="Utilisasi per fasilitas dengan ambang 80 persen.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Utilisasi per fasilitas vs ambang 80%</text>
<text x="10" y="66" font-size="11" fill="var(--chart-text)">KMK (120/200)</text>
<rect x="170" y="52" width="240" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="416" y="69" font-size="11" fill="var(--chart-text)">60%</text>
<text x="10" y="104" font-size="11" fill="var(--chart-text)">KPR (420/500)</text>
<rect x="170" y="90" width="336" height="22" fill="var(--c2)" opacity="0.9"/>
<text x="512" y="107" font-size="11" fill="var(--chart-text)">84%</text>
<text x="10" y="142" font-size="11" fill="var(--chart-text)">Kartu Kredit (47/50)</text>
<rect x="170" y="128" width="376" height="22" fill="var(--c5, #e5484d)" opacity="0.9"/>
<text x="552" y="145" font-size="11" fill="var(--chart-text)">94%</text>
<text x="10" y="180" font-size="11" fill="var(--chart-text)">KUR (0/100, lunas)</text>
<rect x="170" y="166" width="4" height="22" fill="var(--c3)" opacity="0.9"/>
<text x="180" y="183" font-size="11" fill="var(--chart-text)">0%</text>
<line x1="490" y1="44" x2="490" y2="196" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.7"/>
<text x="494" y="40" font-size="10" fill="var(--chart-text)" opacity="0.8">Ambang 80%</text>
<text x="10" y="232" font-size="10" fill="var(--chart-text)" opacity="0.75">KPR 84% dan kartu kredit 94% melewati ambang. Kartu yang hampir penuh = debitur hidup dari utang bergulir.</text>
<text x="10" y="262" font-size="10" fill="var(--chart-text)" opacity="0.75">Fasilitas lunas (KUR) tidak dihitung — hanya fasilitas aktif yang dinilai.</text>
</g>
</svg>`;

export const cr37: V2Lesson = {
  slug: "cr37-slik-biro-kredit",
  track: "Credit Risk",
  module: "Tooling Analis",
  title: "CR37 — Membaca Data Biro Kredit (SLIK/iDeb): Dari Laporan ke Fitur Scorecard",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Slip gaji bagus, SLIK berbicara lain",
      prose: [
        "Aplikasi kredit Rp300 juta masuk dengan slip gaji Rp40 juta per bulan — DTI terlihat aman. Analis junior Maya hampir merekomendasikan persetujuan. Lalu ia membuka SLIK debitur — Sistem Layanan Informasi Keuangan OJK, catatan resmi seluruh fasilitas kredit seseorang di Indonesia.",
        "Twist-nya: SLIK menunjukkan 4 fasilitas aktif — KMK, KPR, kartu kredit dengan utilisasi 94%, dan KUR yang sudah lunas. Kolektibilitas terburuknya Kol 2 (45 hari telat di KPR), dan dalam 6 bulan terakhir ada 8 kali inquiry — 8 kali ia mengajukan kredit ke tempat lain. Slip gaji berkata 'mampu'; SLIK berbisik 'ia sedang tenggelam dan mencari pelampung ke mana-mana.'",
        "Maya membatalkan rekomendasi persetujuannya. Tiga bulan kemudian debitur itu gagal bayar di dua bank lain. Satu laporan SLIK yang dibaca dengan benar menyelamatkan bank Rp300 juta — dan lesson ini mengajarkan cara membacanya.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan struktur laporan SLIK (identitas, fasilitas, kolektibilitas, riwayat); (2) mengekstrak fitur turunan untuk scorecard (fasilitas aktif, kol terburuk, utilisasi, inquiry); (3) mengenali red flag pola berbahaya; (4) menjelaskan batas etika dan privasi pemakaian data biro. Prasyarat ringkas: kolektibilitas 1–5 = status kelancaran (1 lancar, 2 perhatian khusus, 3 kurang lancar, 4 diragukan, 5 macet). SLIK ditarik oleh debitur sendiri via iDebku OJK atau oleh bank dengan persetujuan debitur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "SLIK adalah satu-satunya sumber yang melihat SELURUH utang debitur lintas bank — slip gaji hanya melihat penghasilan, bank hanya melihat fasilitasnya sendiri. Analis yang tidak membaca SLIK menilai debitur dengan sebelah mata tertutup.",
      },
      reference: "Slip gaji = penghasilan. SLIK = seluruh utang lintas bank. Baca keduanya.",
    },
    {
      id: "struktur-slik",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi laporan SLIK: empat bagian",
      prose: [
        "Bagian 1 — Identitas: nama, NIK, alamat debitur. Fungsinya bukan sekadar administrasi: analis mencocokkan identitas untuk memastikan laporan ini milik orang yang benar — salah orang berarti salah vonis, dan itu malapetaka kepatuhan.",
        "Bagian 2 — Fasilitas kredit: daftar tiap pinjaman — jenis (KMK, KPR, kartu kredit, KUR), plafon, baki debet (sisa utang), dan status aktif/lunas. Ini meja kerja utama analis: dari sini dihitung total eksposur dan utilisasi.",
        "Bagian 3 — Kolektibilitas per fasilitas: angka 1 sampai 5. Kol 1 = lancar; Kol 2 = dalam perhatian khusus (1–90 hari telat); Kol 3 = kurang lancar; Kol 4 = diragukan; Kol 5 = macet. Satu fasilitas Kol 3 di masa lalu adalah noda yang tidak hilang dengan melunasi — ia tercatat dalam riwayat.",
        "Bagian 4 — Riwayat: tunggakan per periode dan inquiry — catatan setiap kali debitur (atau bank atas kuasanya) meminta informasi kreditnya. Inquiry yang banyak dalam waktu singkat adalah bau yang khas: seseorang yang ditolak di banyak tempat terus mencoba di tempat lain.",
        "Kepribadiannya: SLIK adalah 'rapot', bukan 'vonis'. Rapot menunjukkan nilai tiap mata pelajaran dan catatan kehadiran — tetapi keputusan naik kelas tetap di tangan guru (analis) yang membaca konteksnya. Analis yang memperlakukan SLIK sebagai vonis otomatis akan menolak debitur baik yang punya satu noda lama, dan meloloskan debitur licin yang pandai menyembunyikan pola.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: Kol 1 di semua fasilitas = pasti aman",
        type: "pitfall",
        body: "Mitos: SLIK bersih berarti debitur aman. Yang benar: SLIK mencatat masa lalu dan saat ini — bukan masa depan. Debitur dengan SLIK bersih tetapi 8 inquiry dalam 6 bulan sedang dalam perlombaan mencari utang baru; SLIK-nya akan kotor tiga bulan lagi. Selalu baca inquiry dan utilisasi, bukan hanya kolom kolektibilitas.",
      },
      hints: [
        "Baca berurutan: identitas → fasilitas → kolektibilitas → riwayat/inquiry.",
        "Fasilitas lunas tidak dihitung dalam fitur aktif — tetapi riwayatnya tetap dibaca.",
      ],
      reference: "SLIK = rapot 4 bagian. Kolektibilitas 1–5. Inquiry banyak = bau bahaya.",
    },
    {
      id: "fitur-turunan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dari laporan ke fitur: angka yang dimakan scorecard",
      prose: [
        "Scorecard tidak membaca SLIK — ia membaca angka turunan dari SLIK. Empat fitur wajib: (1) jumlah fasilitas aktif (baki debet > 0) — banyaknya utang berjalan; (2) kolektibilitas terburuk — noda terdalam; (3) utilisasi kartu kredit = baki debet dibagi plafon — seberapa penuh 'tangki' utang bergulirnya; (4) total inquiry 6 bulan — seberapa agresif ia mencari utang baru.",
        "Utilisasi adalah fitur yang paling sering diremehkan junior. Kartu kredit dengan utilisasi 94% berarti debitur memakai hampir seluruh limitnya — ia tidak punya ruang napas. Dalam praktik, utilisasi di atas 80% adalah flag independen: bahkan dengan kolektibilitas Kol 1, debitur seperti ini satu guncangan jauhnya dari gagal bayar.",
        "Inquiry punya nuansa: 1–2 inquiry wajar (orang memang membandingkan penawaran), di atas 3 dalam 6 bulan mulai mencurigakan, di atas 5 hampir pasti pola 'ditolak di mana-mana'. Tetapi hati-hati — inquiry bisa juga berasal dari bank yang menawarkan (promosi), bukan dari debitur yang meminta. Bedakan keduanya sebelum menuduh.",
        "Cara membaca figur: tiap batang = utilisasi satu fasilitas; garis putus-putus = ambang 80%. Interpretasi: KPR 84% dan kartu kredit 94% melewati ambang — dua flag utilisasi. KMK 60% sehat. KUR 0% (lunas) bukan 0% bermasalah — fasilitas lunas justru riwayat baik, dan tidak masuk hitungan fitur aktif.",
      ],
      formula: String.raw`\text{Utilisasi} = \frac{\text{Baki debet}}{\text{Plafon}} \times 100\%, \quad \text{flag jika Utilisasi} > 80\%`,
      formulaNote: "Baki debet = sisa utang saat ini; plafon = limit fasilitas. Contoh kartu kredit: 47/50 = 94% — flag. Interpretasi: utilisasi mengukur 'kepenuhan tangki utang'; di atas 80% debitur hidup dari utang bergulir dan tidak punya bantalan likuiditas.",
      figure: {
        svg: FIG_UTIL,
        alt: "Utilisasi per fasilitas: KMK 60%, KPR 84%, kartu kredit 94%, KUR 0% (lunas); ambang 80% dilampaui KPR dan kartu kredit.",
        caption: "Dua flag utilisasi: KPR 84% dan kartu kredit 94%. Fasilitas lunas tidak dihitung.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: fitur terbaik adalah yang paling membosankan",
        body: "Analis junior mengejar fitur eksotis; analis senior tahu empat fitur SLIK standar (aktif, kol terburuk, utilisasi, inquiry) sudah menjelaskan sebagian besar risiko ritel. Kecanggihan scorecard bukan pada jumlah fitur, melainkan pada ketepatan membaca empat yang dasar ini.",
      },
      reference: "4 fitur wajib: fasilitas aktif, kol terburuk, utilisasi (>80% flag), inquiry (>3 waspada).",
    },
    {
      id: "redflag-etika",
      eyebrow: "Langkah 4 · Konsep",
      title: "Red flag pola dan batas etika data",
      prose: [
        "Tiga pola red flag yang harus dihafal: (1) 'piramida inquiry' — inquiry naik tajam 3 bulan terakhir (8 kali dalam kasus Maya) = debitur ditolak berulang dan makin putus asa; (2) 'tangki penuh' — utilisasi kartu > 80% BERSAMAAN dengan fasilitas lain Kol 2+ = utang bergulir menutup cicilan; (3) 'riwayat berombak' — Kol 1 hari ini tetapi Kol 3 dua tahun lalu = pola kesulitan berulang, bukan kecelakaan sekali.",
        "Sekarang sisi yang jarang diajarkan: batas etika. Data SLIK adalah data pribadi yang dilindungi UU Pelindungan Data Pribadi (UU 27/2022). Prinsipnya: bank hanya boleh menarik SLIK dengan persetujuan debitur, hanya untuk tujuan yang disetujui (analisis kredit — bukan untuk marketing atau dibagikan ke pihak ketiga), dan wajib menjaga keamanannya.",
        "Pelanggaran bukan teori: memakai data SLIK untuk menolak seseorang dari pekerjaan, membagikannya ke grup WhatsApp internal yang tidak berwenang, atau menyimpannya lebih lama dari yang dibutuhkan — semuanya melanggar prinsip tujuan dan keamanan data. Analis yang ceroboh dengan data bisa menyeret bank ke sanksi dan gugatan.",
        "Kapan memakai data biro: dengan consent, untuk keputusan kredit, oleh personel berwenang, dengan jejak audit. Kapan TIDAK: tanpa consent, untuk tujuan lain, dibagikan ke pihak yang tidak berhak — tidak ada pengecualian 'demi efisiensi'.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: data sudah ada di sistem = boleh dipakai bebas",
        type: "pitfall",
        body: "Mitos: 'SLIK debitur sudah tersimpan di core banking, jadi boleh saya buka kapan saja.' Yang benar: akses data pribadi harus sesuai tujuan pengumpulannya. Membuka SLIK debitur untuk 'kepo' di luar proses analisis kredit — meski kamu karyawan bank — adalah pelanggaran. Setiap akses harus punya alasan bisnis yang tercatat.",
      },
      reference: "3 pola: piramida inquiry, tangki penuh, riwayat berombak. Data biro = consent + tujuan + jejak audit.",
    },
    {
      id: "lab-slik",
      eyebrow: "Langkah 5 · Lab",
      title: "Parser SLIK mini: dari fasilitas ke vonis",
      prose: [
        "Empat fasilitas sudah tersedia. Tugasmu: hitung fasilitas aktif, kolektibilitas terburuk, utilisasi kartu kredit, total inquiry, dan tunggakan maksimum — lalu terapkan empat aturan flag dan tentukan vonisnya. Ini adalah versi miniatur dari modul pra-pemrosesan SLIK di scorecard production.",
        "Eksplorasi: setelah lolos, coba ubah inquiry kartu kredit dari 5 menjadi 1 — flag apa yang hilang? Lalu ubah kol KPR dari 2 menjadi 4 — flag apa yang muncul? Rasakan bagaimana satu angka mengubah vonis: itulah kenapa kualitas data SLIK menentukan kualitas keputusan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_aktif`, `kol_terburuk`, `util_kk`, `inquiry_total`, `tungg_max` dari data fasilitas" },
        { id: "t2", text: "Terapkan 4 aturan flag ke list `flags`, tentukan `vonis` (\"PERLU KAJIAN MENDALAM\" bila ada flag)" },
        { id: "t3", text: "Jalankan dan pastikan ringkasan tercetak dengan benar" },
      ],
      expected: "Fasilitas aktif: 3; Kol terburuk: 2; Utilisasi KK: 94% | Flag: UTILISASI_TINGGI, INQUIRY_BANYAK -> PERLU KAJIAN MENDALAM",
      code: {
        starter: "# Data JANGAN UBAH.\nfasilitas = [\n    {\"jenis\":\"KMK\",\"plafon\":200.0,\"baki\":120.0,\"kol\":1,\"tunggakan\":0,\"inquiry\":1},\n    {\"jenis\":\"KPR\",\"plafon\":500.0,\"baki\":420.0,\"kol\":2,\"tunggakan\":45,\"inquiry\":2},\n    {\"jenis\":\"Kartu Kredit\",\"plafon\":50.0,\"baki\":47.0,\"kol\":1,\"tunggakan\":0,\"inquiry\":5},\n    {\"jenis\":\"KUR\",\"plafon\":100.0,\"baki\":0.0,\"kol\":1,\"tunggakan\":0,\"inquiry\":0},\n]\n\n# TULIS KODEMU: t1 fitur turunan\nn_aktif =\nkol_terburuk =\nutil_kk =\ninquiry_total =\ntungg_max =\n\n# t2: aturan flag dan vonis\nflags = []\nvonis =\n\nprint(f\"Fasilitas aktif: {n_aktif}; Kol terburuk: {kol_terburuk}; Utilisasi KK: {util_kk:.0%}\")\nprint(f\"Flag: {\", \".join(flags)} -> {vonis}\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nfasilitas = [\n    {\"jenis\":\"KMK\",\"plafon\":200.0,\"baki\":120.0,\"kol\":1,\"tunggakan\":0,\"inquiry\":1},\n    {\"jenis\":\"KPR\",\"plafon\":500.0,\"baki\":420.0,\"kol\":2,\"tunggakan\":45,\"inquiry\":2},\n    {\"jenis\":\"Kartu Kredit\",\"plafon\":50.0,\"baki\":47.0,\"kol\":1,\"tunggakan\":0,\"inquiry\":5},\n    {\"jenis\":\"KUR\",\"plafon\":100.0,\"baki\":0.0,\"kol\":1,\"tunggakan\":0,\"inquiry\":0},\n]\n\n# TULIS KODEMU: t1 fitur turunan\naktif = [f for f in fasilitas if f[\"baki\"] > 0]\nn_aktif = len(aktif)\nkol_terburuk = max(f[\"kol\"] for f in aktif)\nkk = next(f for f in fasilitas if f[\"jenis\"] == \"Kartu Kredit\")\nutil_kk = kk[\"baki\"] / kk[\"plafon\"]\ninquiry_total = sum(f[\"inquiry\"] for f in fasilitas)\ntungg_max = max(f[\"tunggakan\"] for f in fasilitas)\n\n# t2: aturan flag dan vonis\nflags = []\nif kol_terburuk >= 3:\n    flags.append(\"KOL_MACET\")\nif util_kk > 0.8:\n    flags.append(\"UTILISASI_TINGGI\")\nif inquiry_total > 3:\n    flags.append(\"INQUIRY_BANYAK\")\nif tungg_max >= 90:\n    flags.append(\"TUNGGAKAN_PANJANG\")\nvonis = \"PERLU KAJIAN MENDALAM\" if flags else \"LAYAK LANJUT\"\n\nprint(f\"Fasilitas aktif: {n_aktif}; Kol terburuk: {kol_terburuk}; Utilisasi KK: {util_kk:.0%}\")\nprint(f\"Flag: {\", \".join(flags)} -> {vonis}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "n_aktif = 3", msg: "KUR sudah lunas (baki 0) tidak dihitung.", name: "n_aktif", value: 3, tol: 0 },
          { kind: "equal", task: "t1", label: "kol_terburuk = 2", msg: "KPR Kol 2 — noda, bukan vonis mati.", name: "kol_terburuk", value: 2, tol: 0 },
          { kind: "equal", task: "t1", label: "util_kk = 0,94", msg: "47/50 = 94% — di atas ambang 80%.", name: "util_kk", value: 0.94, tol: 0.005 },
          { kind: "equal", task: "t1", label: "inquiry_total = 8", msg: "1+2+5+0 = 8 — piramida inquiry.", name: "inquiry_total", value: 8, tol: 0 },
          { kind: "contains", task: "t2", label: "flags memuat INQUIRY_BANYAK", msg: "8 inquiry > ambang 3.", name: "flags", value: "INQUIRY_BANYAK" },
          { kind: "equal", task: "t2", label: "vonis tepat", msg: "Ada 2 flag: UTILISASI_TINGGI + INQUIRY_BANYAK.", name: "vonis", value: "PERLU KAJIAN MENDALAM", tol: 0 },
          { kind: "stdout_matches", task: "t3", label: "ringkasan tercetak", msg: "Fitur, flag, dan vonis tampil.", pattern: "PERLU KAJIAN MENDALAM" },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Membaca SLIK dalam 5 menit: empat skenario",
      prose: [
        "Skenario 1 — SLIK bersih + inquiry rendah + utilisasi sehat: jalur cepat. Tetap verifikasi identitas dan kecocokan data — SLIK bersih bukan alasan melewatkan KYC.",
        "Skenario 2 — Satu noda lama (Kol 3 dua tahun lalu, kini Kol 1, inquiry normal): selidiki konteksnya. Jika penyebabnya jelas dan sudah pulih 12+ bulan, noda lama = diskon risiko, bukan penolakan. Minta penjelasan tertulis debitur.",
        "Skenario 3 — Pola aktif berbahaya (piramida inquiry / tangki penuh / Kol 2+ berjalan): tunda atau tolak. Ini bukan 'noda', ini 'perilaku berjalan' — probabilitas gagal bayar sedang terbentuk di depan mata. Kasus Maya ada di sini.",
        "Skenario 4 — Data tidak lengkap/inkonsisten (identitas tidak cocok, fasilitas hilang): STOP. Jangan putuskan apa pun sampai data beres — keputusan di atas data salah lebih buruk dari tidak memutuskan. Eskalasi ke verifikasi.",
        "Aturan praktis 10 detik: identitas cocok → hitung 4 fitur → 0 flag = lanjut; noda lama = selidiki konteks; pola aktif = tunda/tolak; data aneh = stop dan verifikasi.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: bedakan noda, pola, dan data rusak",
        body: "Tiga kategori vonis SLIK: NODA (masa lalu, sudah pulih — selidiki konteks), POLA (berjalan sekarang — tunda/tolak), DATA RUSAK (inkonsisten — stop). Analis junior mencampur ketiganya menjadi satu label 'jelek'; analis senior memperlakukannya berbeda karena respons bisnisnya berbeda.",
      },
      reference: "Noda = selidiki. Pola aktif = tunda/tolak. Data rusak = stop.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kasus Maya: Rp300 juta yang (hampir) lolos",
      prose: [
        "Debitur: pengusaha katering, penghasilan Rp40 juta/bulan, mengajukan KMK Rp300 juta. DTI 28% — sehat. SLIK: 4 fasilitas aktif; kol terburuk Kol 2 (KPR, 45 hari telat 3 bulan lalu, kini lancar); utilisasi kartu kredit 94%; inquiry 8 kali dalam 6 bulan. Analis junior merekomendasikan setuju dengan alasan DTI sehat dan SLIK 'tidak ada yang macet'. Pertanyaan: (1) Apa yang salah dari rekomendasi itu? (2) Keputusanmu?",
        "Pembahasan: (1) Junior membaca SLIK sebagai vonis biner 'macet/tidak' — ia melewatkan DUA pola aktif: piramida inquiry (8x = ditolak berulang) dan tangki penuh (94% = hidup dari utang bergulir). DTI 28% sehat justru menutupi: penghasilannya baik tetapi perilakunya menunjukkan ia menghabiskan lebih dari penghasilannya. (2) TUNDA, bukan tolak langsung: minta penjelasan tertulis atas 8 inquiry + bukti 3 bulan utilisasi kartu turun di bawah 50%. Jika tidak bisa menjelaskan — tolak. Pelajaran Maya: SLIK dibaca sebagai pola perilaku, bukan sebagai daftar nilai.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tiga bulan setelah Maya menunda aplikasi itu, debitur gagal bayar di dua bank. Biaya 'menunda dan bertanya' = satu surat dan 30 menit. Biaya 'menyetujui buta' = Rp300 juta. Asimetri inilah yang membuat membaca SLIK sebagai pola — bukan sebagai checklist — menjadi skill dengan ROI tertinggi bagi analis ritel.",
      },
      reference: "DTI sehat + 2 pola aktif = tunda & minta penjelasan. Pola > angka tunggal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — SLIK adalah rapot perilaku, bukan vonis.",
      ],
      tasks: [],
      summary: [
        "SLIK 4 bagian: identitas, fasilitas, kolektibilitas 1–5, riwayat (tunggakan + inquiry).",
        "4 fitur turunan: fasilitas aktif, kol terburuk, utilisasi (>80% flag), inquiry (>3 waspada).",
        "3 pola red flag: piramida inquiry, tangki penuh, riwayat berombak.",
        "Vonis tiga kategori: noda lama = selidiki konteks; pola aktif = tunda/tolak; data rusak = stop.",
        "Data biro = data pribadi: consent, tujuan terbatas, akses berwenang, jejak audit.",
      ],
      next: { label: "CR28 — Climate Risk Kredit", href: "/learn/cr28-climate-risk-kredit" },
      quiz: [
        {
          q: "Debitur SLIK-nya Kol 1 semua, tetapi inquiry 8 kali dalam 6 bulan dan utilisasi kartu 94%. Penilaian yang benar…",
          options: [
            { text: "Aman — kolektibilitas bersih berarti tidak ada risiko", why: "Salah: SLIK bersih + 2 pola aktif (piramida inquiry, tangki penuh) = risiko sedang terbentuk.", },
            { text: "Ber-flag: pola perilaku aktif menunjukkan ia sedang mencari utang ke mana-mana", why: "Benar: inquiry dan utilisasi adalah fitur perilaku berjalan — lebih prediktif dari status Kol hari ini.", correct: true },
            { text: "Aman bila DTI di bawah 40%", why: "Salah: DTI sehat tidak menetralkan pola perilaku berbahaya.", },
            { text: "Tolak otomatis tanpa perlu bertanya", why: "Salah: flag = tunda dan minta penjelasan; vonis butuh konteks.", },
          ],
        },
        {
          q: "Fasilitas KUR sudah lunas (baki debet 0). Perlakuan yang benar dalam fitur…",
          options: [
            { text: "Tetap dihitung sebagai fasilitas aktif", why: "Salah: aktif = baki debet > 0; yang lunas tidak membebani arus kas.", },
            { text: "Tidak dihitung sebagai aktif, tetapi riwayatnya tetap dibaca", why: "Benar: lunas = riwayat baik (poin plus), bukan beban berjalan.", correct: true },
            { text: "Dihapus dari analisis sepenuhnya", why: "Salah: riwayat pelunasan adalah sinyal positif perilaku.", },
            { text: "Dihitung sebagai flag negatif", why: "Salah: melunasi utang adalah perilaku baik, bukan red flag.", },
          ],
        },
        {
          q: "Kol 3 dua tahun lalu, kini Kol 1 selama 18 bulan, inquiry normal. Ini termasuk kategori…",
          options: [
            { text: "Pola aktif berbahaya — tolak", why: "Salah: polanya sudah berhenti 18 bulan lalu; ini noda, bukan pola berjalan.", },
            { text: "Noda lama — selidiki konteks, bisa lanjut dengan diskon risiko", why: "Benar: penyebab jelas + pemulihan 18 bulan = konteks memaafkan; tetap catat sebagai riwayat.", correct: true },
            { text: "Data rusak — stop dan verifikasi", why: "Salah: datanya konsisten dan lengkap; tidak ada yang rusak.", },
            { text: "Tidak relevan sama sekali — abaikan", why: "Salah: noda tidak pernah nol bobotnya; ia didiskon, bukan dihapus.", },
          ],
        },
        {
          q: "Bank ingin memakai data SLIK debitur untuk menawarkan produk asuransi via telepon. Menurut prinsip data pribadi…",
          options: [
            { text: "Boleh — datanya sudah ada di sistem bank", why: "Salah: 'sudah ada' bukan izin pakai untuk tujuan lain; ini pelanggaran prinsip tujuan.", },
            { text: "Tidak boleh — di luar tujuan persetujuan awal (analisis kredit)", why: "Benar: data pribadi hanya boleh dipakai untuk tujuan yang disetujui debitur.", correct: true },
            { text: "Boleh bila hanya ke debitur yang Kol 1", why: "Salah: kolektibilitas tidak mengubah aturan tujuan pemakaian data.", },
            { text: "Boleh bila tidak disimpan, hanya dibaca", why: "Salah: membaca untuk tujuan lain tetap pemakaian di luar consent.", },
          ],
        },
        {
          q: "Utilisasi kartu kredit 94% berbahaya terutama karena…",
          options: [
            { text: "Bunganya paling tinggi di antara fasilitas", why: "Salah: bukan soal bunga — soal likuiditas dan perilaku.", },
            { text: "Debitur tidak punya ruang napas likuiditas dan hidup dari utang bergulir", why: "Benar: tangki hampir penuh = satu guncangan menuju gagal bayar; pola klasik pra-default.", correct: true },
            { text: "Limit kartu selalu lebih kecil dari KPR", why: "Salah: tidak relevan dengan risiko utilisasi.", },
            { text: "Kartu kredit tidak tercatat di SLIK", why: "Salah: kartu kredit tercatat lengkap di SLIK termasuk utilisasinya.", },
          ],
        },
      ],
    },
  ],
};
