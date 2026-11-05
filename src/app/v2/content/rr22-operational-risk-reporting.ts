import type { V2Lesson } from "../lib/types";

const FIG_BASEL7 = `<svg viewBox="0 0 480 320" role="img" aria-label="Tujuh tipe kejadian risiko operasional Basel.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">7 tipe kejadian (Basel)</text>
<rect x="20" y="50" width="440" height="30" rx="6" fill="var(--c1)" opacity="0.35"/><text x="30" y="70" font-size="11" fill="var(--chart-text)">1. Fraud internal — pegawai</text>
<rect x="20" y="88" width="440" height="30" rx="6" fill="var(--c1)" opacity="0.3"/><text x="30" y="108" font-size="11" fill="var(--chart-text)">2. Fraud eksternal — perampokan, penipuan</text>
<rect x="20" y="126" width="440" height="30" rx="6" fill="var(--c3)" opacity="0.3"/><text x="30" y="146" font-size="11" fill="var(--chart-text)">3. Praktik karyawan &amp; keselamatan kerja</text>
<rect x="20" y="164" width="440" height="30" rx="6" fill="var(--c3)" opacity="0.3"/><text x="30" y="184" font-size="11" fill="var(--chart-text)">4. Praktik bisnis — mis-selling, pelanggaran</text>
<rect x="20" y="202" width="440" height="30" rx="6" fill="var(--c4)" opacity="0.3"/><text x="30" y="222" font-size="11" fill="var(--chart-text)">5. Kerusakan aset fisik — bencana</text>
<rect x="20" y="240" width="440" height="30" rx="6" fill="var(--c4)" opacity="0.3"/><text x="30" y="260" font-size="11" fill="var(--chart-text)">6. Gangguan sistem &amp; bisnis</text>
<rect x="20" y="278" width="440" height="30" rx="6" fill="var(--c2)" opacity="0.3"/><text x="30" y="298" font-size="11" fill="var(--chart-text)">7. Kegagalan proses &amp; eksekusi</text>
</g>
</svg>`;

const FIG_KRI = `<svg viewBox="0 0 480 220" role="img" aria-label="Dashboard KRI lampu lalu lintas.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">KRI: lampu lalu lintas</text>
<circle cx="60" cy="80" r="22" fill="#4caf50"/><text x="60" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">HIJAU</text><text x="60" y="148" font-size="10" fill="var(--chart-text)" text-anchor="middle">normal</text>
<circle cx="200" cy="80" r="22" fill="#ffc107"/><text x="200" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">KUNING</text><text x="200" y="148" font-size="10" fill="var(--chart-text)" text-anchor="middle">waspada</text>
<circle cx="340" cy="80" r="22" fill="#f44336"/><text x="340" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">MERAH</text><text x="340" y="148" font-size="10" fill="var(--chart-text)" text-anchor="middle">tindak lanjut</text>
<text x="40" y="185" font-size="11" fill="var(--chart-text)">Setiap KRI: definisi + ambang + pemilik + rencana aksi.</text>
<text x="40" y="205" font-size="10" fill="var(--chart-text)" opacity="0.75">KRI tanpa rencana aksi = dekorasi dashboard.</text>
</g>
</svg>`;

export const rr22: V2Lesson = {
  slug: "rr22-operational-risk-reporting",
  track: "Risk Reporting",
  module: "Pelaporan Risiko Operasional",
  title: "RR22 — Operational Risk Reporting: Dari Loss Data ke KRI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Outage yang tidak ada di laporan",
      prose: [
        "Jumat 14.00: core banking Bank Nusantara down 6 jam. Nasabah tidak bisa transaksi; call center lumpuh; media sosial meledak. Kerugian: Rp500 miliar (kompensasi, denda regulator, nasabah kabur). Senin pagi direksi bertanya: 'Kenapa risiko ini tidak pernah muncul di laporan?' Jawabannya pahit: karena tidak ada yang melaporkannya — tidak ada loss data, tidak ada KRI, tidak ada RCSA untuk sistem ini.",
        "Twist-nya: risiko operasional adalah satu-satunya risiko yang 'pasti terjadi, tidak tahu kapan dan seberapa besar'. Tidak seperti risiko kredit (ada debitur) atau pasar (ada harga), risiko operasional bersembunyi di proses, manusia, dan sistem. Pelaporan yang baik tidak mencegah outage — tetapi memastikan direksi tahu ia MUNGKIN terjadi, sudah diukur, dan ada rencananya. Setelah lesson ini kamu bisa: (1) mengklasifikasikan kejadian ke 7 tipe Basel; (2) mengagregasi loss data; (3) merancang KRI dengan ambang; (4) menyusun laporan risiko operasional untuk direksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Basel III final (diterapkan bertahap, termasuk oleh OJK) mengganti pendekatan modal risiko operasional dengan Standardised Measurement Approach berbasis loss data historis. Artinya: kualitas loss data-mu LANGSUNG memengaruhi kebutuhan modal bank. Pelaporan bukan administrasi — ia menentukan modal.",
      },
      reference: "Op risk = pasti terjadi, tak tentu kapan. Loss data → KRI → laporan.",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tujuh tipe kejadian Basel",
      prose: [
        "Basel mengklasifikasikan SEMUA kejadian risiko operasional ke 7 tipe: (1) fraud internal; (2) fraud eksternal; (3) praktik karyawan & keselamatan; (4) praktik bisnis (mis-selling, pelanggaran); (5) kerusakan aset fisik; (6) gangguan sistem & bisnis; (7) kegagalan proses & eksekusi. Setiap kerugian yang dicatat WAJIB masuk salah satu — tidak ada 'lain-lain' yang dominan. Bila 'lain-lain'-mu >20%, taksonomimu rusak.",
        "Mengapa klasifikasi penting: pola muncul dari agregasi. 'Kegagalan proses' Rp200 miliar setahun = masalah sistemik proses; 'fraud eksternal' naik 3 kuartal beruntun = serangan terkoordinasi. Tanpa klasifikasi, loss data = daftar belanja tanpa kategori — tidak bisa dianalisis.",
        "Tiga miskonsepsi. Satu: 'Near-miss tidak perlu dicatat.' Near-miss (hampir rugi) adalah data TERBAIK — ia menunjukkan kerentanan tanpa biaya. Bank yang hanya mencatat kerugian aktual = belajar dari luka, bukan dari pelajaran. Dua: 'Batas pencatatan Rp100 juta.' Batas terlalu tinggi = kehilangan pola frekuensi-tinggi-nominal-kecil. Tiga: 'Satu kejadian = satu tipe.' Kejadian kompleks bisa multi-tipe — catat tipe PRIMER + sekunder.",
      ],
      figure: {
        svg: FIG_BASEL7,
        alt: "Tujuh tipe kejadian risiko operasional Basel.",
        caption: "Setiap kerugian wajib masuk salah satu tipe.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kejadian ini salah siapa?” Pertanyaan pertama yang benar: “Masuk tipe apa?” Klasifikasi dulu, atribusi kemudian. Budaya menyalahkan membunuh pelaporan — tidak ada yang mau mencatat bila catatan = surat tuduhan. Praktik terbaik: just culture — kesalahan jujur tidak dihukum, pelanggaran sengaja ditindak tegas. Kualitas data = kualitas budaya.",
      },
      hints: [
        "Latih klasifikasi dengan 10 kasus nyata tiap kuartal — konsistensi antar pencatat.",
        "Pantau porsi 'lain-lain' — alarm bila >20%.",
      ],
      formula: String.raw`\text{Expected loss} = \lambda \times \bar{s}`,
      formulaNote: "lambda = frekuensi kejadian per tahun; s-bar = rata-rata severity (Rp miliar). Contoh: fraud eksternal 4 kejadian/tahun x Rp150 M = ekspektasi rugi Rp600 M/tahun. Interpretasi: frekuensi tinggi + severity kecil (kegagalan proses) vs frekuensi rendah + severity besar (outage) butuh strategi berbeda \u2014 yang pertama diperbaiki dengan kontrol proses, yang kedua dengan asuransi + rencana kontinjensi.",
      reference: "7 tipe. Near-miss dicatat. 'Lain-lain' <20%.",
    },
    {
      id: "kri",
      eyebrow: "Langkah 3 · Konsep",
      title: "KRI: speedometer risiko operasional",
      prose: [
        "KRI (Key Risk Indicator) adalah metrik yang memberi peringatan DINI — sebelum kerugian terjadi. Contoh: jumlah gagal login per hari (indikasi serangan), % transaksi gagal (indikasi kerapuhan sistem), jam lembur pegawai (indikasi kelelahan → kesalahan). KRI yang baik: TERUKUR (data tersedia), PREDIKTIF (bergerak sebelum kerugian), dan PUNYA AMBANG (hijau/kuning/merah dengan rencana aksi).",
        "Desain ambang: hijau = operasi normal; kuning = waspada (pemilik KRI menyelidiki); merah = tindak lanjut wajib (eskalasi + rencana aksi + tenggat). Ambang ditetapkan dari data historis (mis. persentil 90/95) atau judgment pakar — dan DITINJAU tiap tahun. Ambang yang tidak pernah tersentuh = terlalu longgar; yang selalu merah = terlalu ketat atau masalahnya nyata.",
        "Dua miskonsepsi. Satu: 'Semakin banyak KRI semakin baik.' 50 KRI = tidak ada yang dipantau serius. Mulai dari 10-15 KRI untuk risiko terbesar. Dua: 'KRI = KPI.' KPI mengukur kinerja (target dicapai); KRI mengukur RISIKO (bahaya mendekat). KRI merah bukan kegagalan — ia keberhasilan sistem peringatan.",
      ],
      figure: {
        svg: FIG_KRI,
        alt: "Dashboard KRI lampu lalu lintas.",
        caption: "KRI tanpa rencana aksi = dekorasi dashboard.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“KRI kami merah 3 bulan tapi tidak ada tindakan.” KRI tanpa tindak lanjut = alarm kebakaran yang diabaikan. Setiap KRI merah WAJIB punya: pemilik, rencana aksi, tenggat. Tidak ada = temuan audit.",
      },
      hints: [
        "Untuk tiap KRI tulis satu kalimat: 'Bila merah, maka ___.'",
        "Review ambang tahunan — bisnis berubah, ambang harus ikut.",
      ],
      reference: "KRI = terukur + prediktif + ambang + aksi.",
    },
    {
      id: "rcsa",
      eyebrow: "Langkah 4 · Konsep",
      title: "RCSA: penilaian diri yang jujur",
      prose: [
        "RCSA (Risk & Control Self-Assessment): unit bisnis menilai SENDIRI risiko dan kontrolnya — apa risiko terbesarmu, seberapa efektif kontrolmu, di mana celahnya. Ini forward-looking (beda dengan loss data yang backward). RCSA yang baik menghasilkan: daftar risiko residual (setelah kontrol), rencana perbaikan, dan — terpenting — KEJUJURAN tentang kelemahan.",
        "Tantangannya: unit bisnis cenderung menilai kontrolnya 'baik' (nilai diri sendiri). Solusinya: (1) fasilitasi independen (risk memandu, bukan unit menilai sendiri diam-diam); (2) uji dengan data (klaim 'kontrol baik' vs loss data yang berkata lain = diskusi); (3) kaitkan ke insentif (kejujuran dihargai, temuan yang disembunyikan dihukum).",
        "Dua miskonsepsi. Satu: 'RCSA = checklist tahunan.' RCSA yang hidup diperbarui saat ada perubahan proses/sistem/insiden — bukan setahun sekali. Dua: 'Risk yang menilai.' Risk memfasilitasi dan menantang; unit bisnis yang menilai (mereka yang paham prosesnya). Kepemilikan = akuntabilitas.",
        "Skala kematangan RCSA: level 1 (checklist diisi asal), level 2 (difasilitasi + didiskusikan), level 3 (diuji dengan loss data & KRI), level 4 (terkait ke rencana aksi + insentif). Jujur menilai level organisasimu \u2014 kebanyakan bank Indonesia di level 1-2. Peta jalan ke level 3 dalam 2 tahun adalah target yang realistis dan terukur.",
        "Satu jebakan RCSA: ‘workshop sehari selesai’. RCSA yang baik butuh persiapan (data loss + KRI dibagikan SEBELUM workshop), fasilitasi yang menantang (bukan sekadar mencatat), dan tindak lanjut (rencana aksi dengan pemilik). Workshop tanpa persiapan = opini; workshop dengan data = penilaian. Bedakan keduanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan direksi yang ideal menggabungkan ketiganya: loss data (apa yang TERJADI), KRI (apa yang MENDEKAT), RCSA (apa yang MUNGKIN + seberapa siap kita). Tiga lensa waktu: masa lalu, kini, masa depan. Laporan yang hanya berisi loss data = mengemudi dengan melihat kaca spion.",
      },
      reference: "RCSA = forward-looking. Fasilitasi independen + uji dengan data.",
    },
    {
      id: "lab-loss",
      eyebrow: "Langkah 5 · Lab",
      title: "Agregasi loss data per tipe Basel",
      prose: [
        "Enam kejadian kerugian. Agregasikan per tipe Basel, urutkan dari terbesar, hitung total, dan identifikasi tipe tertinggi — inilah tabel pertama di laporan direksi.",
        "Perhatikan: 'Gangguan sistem' Rp500 miliar dari SATU kejadian mendominasi — pola severity-tinggi-frekuensi-rendah yang khas op risk. Eksperimen: bagaimana bila batas pencatatan Rp100 juta menghilangkan 3 kejadian kecil? Pola frekuensi hilang — inilah bahaya ambang terlalu tinggi.",
      ],
      tasks: [
        { id: "t1", text: "Agregasi rugi per tipe Basel" },
        { id: "t2", text: "Urutkan menurun, hitung total, identifikasi tertinggi" },
      ],
      expected: "Gangguan sistem: Rp500 M\nFraud eksternal: Rp450 M\nKegagalan proses: Rp200 M\nPraktik karyawan: Rp60 M\nTotal: Rp1210 M\nTertinggi: Gangguan sistem",
      note: {
        title: "💡 Intuisi",
        body: "Enam baris menjadi empat angka + satu kesimpulan. Agregasi adalah 'penerjemah' dari data ke keputusan: direksi tidak membaca 6 kejadian, ia membaca 'gangguan sistem tertinggi'.",
      },
      hints: [
        "Gunakan dict untuk agregasi.",
        "sorted(agg, key=lambda t: -agg[t]) untuk urutan menurun.",
      ],
      code: {
        starter: "# (id, tipe Basel, rugi Rp miliar). JANGAN UBAH.\nlosses = [(\"L1\",\"Kegagalan proses\",120),(\"L2\",\"Fraud eksternal\",300),(\"L3\",\"Kegagalan proses\",80),\n          (\"L4\",\"Gangguan sistem\",500),(\"L5\",\"Fraud eksternal\",150),(\"L6\",\"Praktik karyawan\",60)]\n\n# TULIS KODEMU: agregasi + urutan + total + tertinggi\nagg = {}\nfor _id, tipe, rugi in losses:\n    agg[tipe] = agg.get(tipe, 0) + rugi\nfor tipe in sorted(agg, key=lambda t: -agg[tipe]):\n    print(f\"{tipe}: Rp{agg[tipe]:.0f} M\")\nprint(f\"Total: Rp{sum(agg.values()):.0f} M\")\ntertinggi = \nprint(f\"Tertinggi: {tertinggi}\")\n",
        lockLines: 10,
        solution: "# (id, tipe Basel, rugi Rp miliar). JANGAN UBAH.\nlosses = [(\"L1\",\"Kegagalan proses\",120),(\"L2\",\"Fraud eksternal\",300),(\"L3\",\"Kegagalan proses\",80),\n          (\"L4\",\"Gangguan sistem\",500),(\"L5\",\"Fraud eksternal\",150),(\"L6\",\"Praktik karyawan\",60)]\n\n# TULIS KODEMU: agregasi + urutan + total + tertinggi\nagg = {}\nfor _id, tipe, rugi in losses:\n    agg[tipe] = agg.get(tipe, 0) + rugi\nfor tipe in sorted(agg, key=lambda t: -agg[tipe]):\n    print(f\"{tipe}: Rp{agg[tipe]:.0f} M\")\nprint(f\"Total: Rp{sum(agg.values()):.0f} M\")\ntertinggi = max(agg, key=lambda t: agg[t])\nprint(f\"Tertinggi: {tertinggi}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Gangguan sistem 500", msg: "Satu kejadian besar.", pattern: "Gangguan sistem: Rp500 M" },
          { kind: "stdout_matches", task: "t2", label: "Total 1210", msg: "200+450+500+60.", pattern: "Total: Rp1210 M" },
          { kind: "stdout_matches", task: "t2", label: "Tertinggi benar", msg: "Gangguan sistem.", pattern: "Tertinggi: Gangguan sistem" },
        ],
      },
      reference: "Agregasi per tipe, urut menurun, total, tertinggi.",
    },
    {
      id: "lab-kri",
      eyebrow: "Langkah 6 · Lab",
      title: "Dashboard KRI lampu lalu lintas",
      prose: [
        "Empat KRI dengan ambang kuning dan merah. Terapkan aturan: HIJAU bila di bawah ambang kuning, KUNING bila mencapai kuning tetapi di bawah merah, MERAH bila mencapai/melewati merah.",
        "Perhatikan hasilnya: 2 MERAH, 1 KUNING, 1 HIJAU. Dashboard yang sehat TIDAK selalu hijau — ia jujur. Eksperimen: turunkan ambang merah 'Jam lembur' ke 350 — apa yang berubah? Inilah sensitivitas ambang: kalibrasi adalah keputusan, bukan kebenaran.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan status HIJAU/KUNING/MERAH tiap KRI dari ambangnya" },
        { id: "t2", text: "Cetak dashboard + hitung jumlah MERAH" },
      ],
      expected: "Gagal login/hari: 1200 -> KUNING\nTransaksi gagal %: 5.5 -> MERAH\nKeterlambatan SLA: 3 -> HIJAU\nJam lembur: 450 -> MERAH\nMERAH: 2",
      note: {
        title: "💡 Intuisi",
        body: "Empat angka menjadi satu dashboard yang bisa dibaca direksi dalam 10 detik. Itulah pekerjaan risk reporting: kompresi tanpa kehilangan kebenaran.",
      },
      hints: [
        "MERAH jika nilai >= m; KUNING jika >= k; selainnya HIJAU.",
        "Hitung jumlah MERAH dengan akumulator.",
      ],
      code: {
        starter: "# (kri, nilai, ambang kuning, ambang merah). JANGAN UBAH.\nkris = [(\"Gagal login/hari\", 1200, 1000, 2000), (\"Transaksi gagal %\", 5.5, 2.0, 5.0),\n        (\"Keterlambatan SLA\", 3, 5, 10), (\"Jam lembur\", 450, 250, 400)]\n\n# TULIS KODEMU: status + hitung MERAH\nmerah = 0\nfor nama, nilai, k, m in kris:\n    status = \n    if status == \"MERAH\":\n        merah += 1\n    print(f\"{nama}: {nilai} -> {status}\")\nprint(f\"MERAH: {merah}\")\n",
        lockLines: 9,
        solution: "# (kri, nilai, ambang kuning, ambang merah). JANGAN UBAH.\nkris = [(\"Gagal login/hari\", 1200, 1000, 2000), (\"Transaksi gagal %\", 5.5, 2.0, 5.0),\n        (\"Keterlambatan SLA\", 3, 5, 10), (\"Jam lembur\", 450, 250, 400)]\n\n# TULIS KODEMU: status + hitung MERAH\nmerah = 0\nfor nama, nilai, k, m in kris:\n    status = \"MERAH\" if nilai >= m else (\"KUNING\" if nilai >= k else \"HIJAU\")\n    if status == \"MERAH\":\n        merah += 1\n    print(f\"{nama}: {nilai} -> {status}\")\nprint(f\"MERAH: {merah}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Transaksi gagal MERAH", msg: "5.5 >= 5.0.", pattern: "Transaksi gagal %: 5.5 -> MERAH" },
          { kind: "stdout_matches", task: "t1", label: "SLA HIJAU", msg: "3 < 5.", pattern: "Keterlambatan SLA: 3 -> HIJAU" },
          { kind: "stdout_matches", task: "t2", label: "2 MERAH", msg: "Transaksi gagal + lembur.", pattern: "MERAH: 2" },
        ],
      },
      reference: ">= merah = MERAH; >= kuning = KUNING; else HIJAU.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Menyusun laporan op risk untuk direksi",
      prose: [
        "Satu: kumpulkan tiga lensa — loss data kuartal (apa terjadi), KRI terkini (apa mendekat), highlight RCSA (apa mungkin + kesiapan). Dua: soroti perubahan — tipe apa naik, KRI apa memerah, tren 4 kuartal. Tiga: sertakan rencana aksi untuk setiap merah — pemilik + tenggat. Empat: tutup dengan risiko residual terbesar — 'tiga hal yang paling mengkhawatirkan kami kuartal ini'. Lima: satu halaman eksekutif di depan — direksi membaca itu; lampiran untuk yang ingin detail.",
        "Aturan praktis 10 detik: masa lalu + kini + depan, perubahan + aksi, satu halaman eksekutif. Laporan 40 halaman tanpa kesimpulan = data, bukan informasi.",
        "Satu jebakan: 'laporan untuk memenuhi kewajiban.' Laporan yang ditulis untuk checklist akan dibaca seperti checklist — dilewati. Tulis untuk keputusan: setiap bagian harus menjawab 'jadi apa yang harus kami lakukan?' Bila tidak ada jawabannya, hapus bagiannya.",
        "Enam: cantumkan perbandingan antar periode dan antar unit. \u2018Fraud eksternal naik 40 persen vs kuartal lalu\u2019 lebih bermakna dari \u2018fraud eksternal Rp450 miliar\u2019. Tren = cerita; angka absolut = potret. Direksi butuh cerita untuk memutuskan.",
        "Tujuh: sertakan benchmark eksternal bila tersedia. ‘Rugi fraud kami Rp450 miliar vs rata-rata industri Rp300 miliar untuk bank seukuran’ memberi konteks yang tidak dimiliki angka absolut. Konsorsium data eksternal (mis. ORX untuk op risk global) adalah sumbernya — dan alasan kuat untuk ikut serta: kamu memberi data, kamu mendapat benchmark.",
        "Refleksi karir: pelaporan risiko operasional adalah keterampilan yang membedakan analis senior dari junior. Junior menghitung angka; senior merancang sistem yang menghasilkan angka yang bisa dipercaya direksi. Kuasai taksonomi, KRI, dan RCSA lesson ini — dan kamu bisa membangun fungsi op risk reporting dari nol di bank manapun.",
        "Satu prinsip penutup: risiko operasional tidak bisa dihilangkan — hanya bisa dipahami, diukur, dan disiapkan. Laporan yang baik tidak menjanjikan \u2018tidak akan terjadi lagi\u2019; ia menjanjikan \u2018kita akan tahu lebih cepat dan siap lebih baik\u2019. Kejujuran itu lebih berharga dari janji kosong manapun yang pernah ditulis di laporan. Mulai dari pencatatan pertamamu hari ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Frekuensi ideal: KRI dipantau bulanan (atau real-time untuk yang kritis), laporan direksi kuartalan, RCSA tahunan (atau saat ada perubahan besar). Insiden besar dilaporkan SEGERA — jangan tunggu kuartal berikutnya. Kecepatan > kerapian untuk insiden.",
      },
      reference: "3 lensa, perubahan + aksi, 1 halaman eksekutif.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Artha Dana: membangun dari nol",
      prose: [
        "Bank Artha Dana tidak punya sistem pelaporan op risk. Tahun lalu: 3 fraud eksternal (total Rp450 M), 1 outage (Rp500 M), puluhan kegagalan proses kecil (total Rp200 M). Direksi meminta laporan perdana kuartal depan. Tim risk: 2 orang.",
        "Pertanyaan: (a) Prioritas 90 hari pertama? (b) Isi laporan perdana? Pembahasan: (a) 90 hari: tetapkan taksonomi 7 tipe + template pencatatan (mulai catat SEKARANG, termasuk near-miss); pilih 10 KRI untuk 3 risiko terbesar (fraud eksternal, gangguan sistem, kegagalan proses); jalankan RCSA mini untuk unit operasi. Jangan kejar sempurna — kejar berjalan. (b) Laporan perdana: agregasi loss data setahun (seperti lab pertama), dashboard KRI awal (seperti lab kedua), 3 risiko residual terbesar + rencana aksi. Jujur tentang keterbatasan: 'KRI baru 1 bulan data — tren belum bermakna.' Pelajaran: mulai dari yang berjalan, bukan yang sempurna. Sistem yang hidup 80% > sistem sempurna yang tidak pernah jadi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Godaan terbesar proyek seperti ini: membeli software mahal dulu. Software tidak menciptakan budaya pelaporan — ia mengotomasi budaya yang sudah ada. Mulai dari spreadsheet + disiplin; otomasi setelah prosesnya terbukti berjalan 2 kuartal.",
      },
      reference: "90 hari: taksonomi + 10 KRI + RCSA mini. Mulai berjalan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Basel mengklasifikasikan semua kejadian ke 7 tipe (fraud internal/eksternal, praktik ketenagakerjaan, praktik bisnis, kerusakan aset, kegagalan proses, gangguan sistem) — klasifikasi dulu, atribusi kemudian.",
        "Near-miss (hampir rugi) wajib dicatat: ia data terbaik untuk mencegah kerugian nyata; latih konsistensi klasifikasi dengan 10 kasus nyata tiap kuartal.",
        "Basel III final mengganti pendekatan modal risiko operasional dengan Standardised Measurement Approach — di Indonesia diterapkan bertahap oleh OJK.",
        "Setiap KRI: definisi + ambang + pemilik + rencana aksi — KRI tanpa rencana aksi = dekorasi dashboard.",
        "Expected loss = λ × s̄: frekuensi kejadian × rata-rata severity — jembatan dari loss data ke angka laporan.",
      ],
      quiz: [
        {
          q: "Kejadian 'pegawai memalsukan dokumen kredit' masuk tipe Basel:",
          options: [
            { text: "Fraud internal", why: "Benar: pegawai = pihak dalam; pemalsuan = fraud.", correct: true },
            { text: "Fraud eksternal", why: "Eksternal = pihak luar; pelakunya pegawai." },
            { text: "Kegagalan proses", why: "Ada unsur kesengajaan (pemalsuan) — bukan sekadar proses gagal." },
            { text: "Praktik bisnis", why: "Itu kategori lain (mis. mis-selling)." },
          ],
        },
        {
          q: "Mengapa near-miss wajib dicatat?",
          options: [
            { text: "Ia menunjukkan kerentanan tanpa biaya — data terbaik untuk pencegahan", why: "Benar: near-miss = sinyal gratis sebelum kerugian.", correct: true },
            { text: "Regulator menghitungnya sebagai kerugian", why: "Near-miss bukan kerugian; tidak dihitung sebagai loss." },
            { text: "Ia menambah total loss data", why: "Near-miss tidak masuk loss data — nilainya justru karena belum jadi loss." },
            { text: "Tidak wajib — hanya kerugian aktual", why: "Salah: praktik baik mewajibkan pencatatan near-miss." },
          ],
        },
        {
          q: "KRI yang baik harus memiliki:",
          options: [
            { text: "Terukur + prediktif + ambang + rencana aksi", why: "Benar: empat sifat KRI yang efektif.", correct: true },
            { text: "Target kinerja tahunan", why: "Itu KPI, bukan KRI." },
            { text: "Minimal 50 indikator", why: "Banyak bukan baik; sedikit yang tajam lebih berguna." },
            { text: "Selalu berwarna hijau", why: "KRI yang selalu hijau = ambang terlalu longgar." },
          ],
        },
        {
          q: "Perbedaan RCSA dan loss data:",
          options: [
            { text: "RCSA forward-looking (risiko + kontrol); loss data backward (yang terjadi)", why: "Benar: RCSA menilai risiko dan kontrol ke depan.", correct: true },
            { text: "Keduanya backward-looking", why: "Loss data yang backward; RCSA forward." },
            { text: "RCSA untuk regulator; loss data untuk direksi", why: "Keduanya untuk manajemen; pembagian audiens bukan pembedanya." },
            { text: "Tidak ada perbedaan", why: "Jelas berbeda: prospektif vs retrospektif." },
          ],
        },
        {
          q: "Laporan op risk untuk direksi yang ideal dimulai dengan:",
          options: [
            { text: "Satu halaman eksekutif: perubahan + merah + aksi", why: "Benar: direksi butuh perubahan, yang merah, dan aksi — bukan detail.", correct: true },
            { text: "40 halaman detail semua kejadian", why: "Detail untuk analis; direksi tenggelam dalam 40 halaman." },
            { text: "Definisi risiko operasional", why: "Definisi bukan isi laporan rutin." },
            { text: "Struktur organisasi tim risk", why: "Struktur bukan metrik risiko." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Loss data kami kecil — risiko operasional kami rendah.” Mungkin benar, mungkin juga pelaporanmu buruk. Uji: bandingkan dengan benchmark industri + cek near-miss. Tidak ada near-miss = tidak ada yang melapor, bukan tidak ada yang hampir terjadi.",
      },
      hints: [
        "Uji cepat: sebutkan 7 tipe Basel tanpa melihat catatan.",
        "Ingat tiga lensa: lalu (loss), kini (KRI), depan (RCSA).",
      ],
      reference: "Klasifikasi → agregasi → KRI → RCSA → 1 halaman eksekutif.",
    },
  ],
};
