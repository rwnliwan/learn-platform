import type { V2Lesson } from "../lib/types";

const FIG_TIPOLOGI = `<svg viewBox="0 0 480 260" role="img" aria-label="Tipologi pencucian via judi.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Tiga tipologi judi × pencucian</text>
<rect x="30" y="60" width="130" height="110" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="90" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Chip dumping</text>
<text x="95" y="112" font-size="10" fill="var(--chart-text)" text-anchor="middle">sengaja kalah ke</text>
<text x="95" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">komplotan (poker)</text>
<rect x="175" y="60" width="130" height="110" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="240" y="90" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Structuring</text>
<text x="240" y="112" font-size="10" fill="var(--chart-text)" text-anchor="middle">deposit di bawah</text>
<text x="240" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">ambang lapor</text>
<rect x="320" y="60" width="130" height="110" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="385" y="90" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Taruhan aman</text>
<text x="385" y="112" font-size="10" fill="var(--chart-text)" text-anchor="middle">bet dua sisi /</text>
<text x="385" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">refund abuse</text>
<text x="240" y="210" font-size="11" fill="var(--chart-text)" text-anchor="middle">Ketiganya mengubah uang kotor menjadi 'kemenangan'.</text>
</g>
</svg>`;

export const aml19: V2Lesson = {
  slug: "aml19-gaming-gambling-ml",
  track: "Fraud & AML Analytics",
  module: "Aset Kripto",
  title: "AML19 — Judi & Gaming: Pencucian Lewat 'Kemenangan'",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pemenang yang selalu kalah",
      prose: [
        "Analis fraud memeriksa pemain poker online 'P1': dalam 2 bulan ia KALAH Rp450 juta — semuanya ke pemain 'P2' yang sama. P2 kemudian menarik dananya sebagai 'kemenangan'. P1 tidak pernah komplain, tidak pernah berganti meja, tidak pernah mencoba menang. Polisi kemudian mengonfirmasi: P1 dan P2 satu komplotan; Rp450 juta itu hasil penipuan yang 'dicuci' menjadi kemenangan judi.",
        "Twist-nya: judi adalah mesin cuci yang sempurna — uang masuk kotor, keluar sebagai 'kemenangan' yang sah dan bahkan kena pajak. Di Indonesia, judi ONLINE ILEGAL — artinya seluruh ekosistemnya adalah area kejahatan, dan setiap rupiah yang mengalir ke sana patut dicurigai. Setelah lesson ini kamu bisa: (1) menjelaskan tipologi pencucian via judi; (2) mendeteksi chip dumping; (3) mendeteksi structuring via taruhan; (4) merespons temuan.",
        "Skala di Indonesia: perputaran dana judi online mencapai ratusan triliun rupiah menurut Satgas pemerintah — sebagian besar mengalir via e-wallet dan rekening bank lokal. Ini bukan kejahatan pinggiran; ini salah satu aliran dana ilegal terbesar yang melewati sistem keuangan Indonesia. Analis AML yang mengabaikannya mengabaikan gajah di ruangan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Konteks Indonesia: segala bentuk perjudian dilarang (KUHP) — termasuk online. Artinya analis bank Indonesia tidak berurusan dengan 'judi legal yang disalahgunakan' melainkan dengan 'aliran dana ke aktivitas ilegal'. Setiap transfer ke situs judi = red flag serius, bukan sekadar 'hobi'.",
      },
      reference: "Judi = mesin cuci: kotor masuk, 'kemenangan' keluar.",
    },
    {
      id: "tipologi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga tipologi utama",
      prose: [
        "Satu: CHIP DUMPING — di poker/gim PvP, pelaku sengaja kalah ke komplotan; komplotan menarik sebagai kemenangan. Ciri: kalah konsisten ke lawan SAMA, tidak ada upaya menang, pola taruhan tidak wajar. Dua: STRUCTURING via taruhan — deposit di bawah ambang lapor berkali-kali, lalu tarik sekaligus sebagai kemenangan. Tiga: TARUHAN AMAN — bet dua sisi (menang-kalah) untuk meminimalkan rugi sambil 'memutar' dana; atau refund abuse (minta chargeback setelah kalah).",
        "Varian modern: e-sports betting & skin gambling (taruhan item gim), crash games dengan bot, dan 'jasa pencucian' di forum — pelaku membayar fee 10-20% ke penyedia jasa. Ekosistemnya profesional.",
        "Tiga miskonsepsi. Satu: 'Judi kecil = tidak menarik.' Justru nominal kecil-menengah yang lolos radar — akumulasinya besar. Dua: 'Kemenangan = bukti sah.' Kemenangan dari skema = hasil kejahatan; 'kemenangan' bukan sertifikat kesucian. Tiga: 'Hanya di situs luar.' Perjudian online menjangkau Indonesia via situs luar + e-wallet lokal sebagai pintu — di sanalah bank melihatnya.",
      ],
      figure: {
        svg: FIG_TIPOLOGI,
        alt: "Tipologi pencucian via judi.",
        caption: "Ketiganya mengubah uang kotor menjadi 'kemenangan'.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nasabah hanya main kecil-kecilan.” Pola structuring justru TERDIRI dari transaksi kecil. Nilai bukan penentu — POLA adalah penentunya. Rp95 juta × 10 = Rp950 juta yang lolos ambang.",
      },
      hints: [
        "Hafalkan 3 tipologi + cirinya masing-masing.",
        "E-wallet → situs judi = rantai yang harus diputus di hulu.",
        "Varian yang berkembang: taruhan e-sports dan skin gambling menargetkan generasi muda yang mungkin tidak menyadari mereka terlibat pencucian. Akun mereka dipakai sebagai ‘keledai’ (money mule) — menerima dan meneruskan dana. Analis harus bisa membedakan mule (korban/perantara) dari pelaku (otak) karena responsnya berbeda: edukasi + pemulihan vs penindakan.",
      ],
      formula: String.raw`\text{Skor dumping} = \frac{\text{kalah ke lawan X}}{\sum \text{kalah}}`,
      formulaNote: "Rasio kekalahan ke satu lawan terhadap total kekalahan. Contoh lab: 450/(450) = 100% \u2014 seluruh kekalahan ke P2. Pemain sah kalah tersebar ke banyak lawan (rasio rendah); dumper terkonsentrasi (rasio mendekati 100%). Interpretasi: konsentrasi ekstrem + tidak ada upaya menang = dugaan kuat dumping.",
      reference: "Dumping, structuring, taruhan aman. Pola > nominal.",
    },
    {
      id: "deteksi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Deteksi: dari data ke dugaan",
      prose: [
        "Deteksi chip dumping: agregasi kalah-menang per pasangan pemain; tandai bila satu pemain kalah >X ke lawan sama dalam periode (lab pertama). Deteksi structuring: frekuensi deposit di rentang [90%, 100%) ambang lapor (lab kedua). Deteksi taruhan aman: rasio menang di bawah normal TETAPI volume tinggi — pemain yang 'tidak pernah menang besar tetapi terus main' = sedang memutar dana, bukan berjudi.",
        "Sumber data: untuk bank — pola transfer ke e-wallet/merchant judi (nama merchant, MCC code); untuk operator gim — log permainan. Kolaborasi bank-operator (via penegak hukum) = deteksi ujung-ke-ujung.",
        "Dua miskonsepsi. Satu: 'Butuh AI canggih.' Aturan sederhana (agregasi + ambang) menangkap 80% kasus — AI untuk 20% yang adaptif. Dua: 'False positive tinggi.' Memang — pemain sah bisa kalah beruntun. Karena itu hasil deteksi = EDD/investigasi, bukan vonis otomatis.",
        "Satu teknik lanjutan: analisis jaringan (graph). Petakan transfer antar pemain sebagai graf; cari klaster yang padat (saling transfer) tetapi terisolasi dari jaringan umum. Komplotan ‘Meja 7’ di mini-case akan terlihat sebagai klaster mencolok. Tools graf sederhana (bahkan spreadsheet + visualisasi) sudah cukup untuk memulai.",
        "Kolaborasi lintas institusi: pola ‘Meja 7’ hanya terlihat utuh bila data beberapa bank digabung — komplotan menyebar rekening di banyak bank. Forum berbagi informasi (di bawah payung regulator/penegak hukum) memungkinkan deteksi jaringan lintas bank. Dorong institusimu bergabung; pencuci tidak mengenal batas institusi.",
        "Pencegahan di hulu: edukasi nasabah tentang modus ‘akun disewa untuk judi’. Banyak mule tidak tahu mereka terlibat kejahatan — mereka pikir hanya ‘meminjamkan rekening’ dengan imbalan. Kampanye edukasi yang baik mengurangi pasokan mule lebih efektif daripada penindakan setelahnya. Pencegahan > penindakan.",
        "Refleksi karir: kejahatan finansial via gaming adalah bidang yang relatif baru dengan sedikit ahli — analis yang menguasainya memiliki diferensiasi kuat. Di wawancara, contoh ‘Meja 7’ adalah cerita yang menunjukkan kamu berpikir seperti penyidik, bukan seperti penghafal. Kuasai tipologi, kuasai data, kuasai cerita.",
        "Satu prinsip penutup: judi online ilegal adalah ekosistem kejahatan, bukan hiburan yang disalahgunakan. Setiap rupiah yang mengalir ke sana adalah rupiah yang keluar dari ekonomi sah — dan mungkin kembali sebagai ‘kemenangan’ yang mencuci kejahatan lain. Memutus alirannya = memutus banyak kejahatan sekaligus. Pekerjaanmu penting.",
        "Tugas mandiri: periksa mutasi rekeningmu sendiri 3 bulan terakhir — adakah transfer ke merchant/e-wallet yang tidak kamu kenali? Edukasi dimulai dari diri sendiri. Lalu diskusikan dengan tim: berapa banyak nasabah kita yang transfer ke e-wallet berisiko? Angka itu adalah awal dari program deteksimu.",
        "Satu teknik deteksi yang sering luput: analisis WAKTU. Komplotan ‘Meja 7’ bermain jam 02.00-04.00 — jam sepi untuk menghindari pemain sah yang bisa mengalahkan mereka atau melaporkan pola aneh. Filter ‘bermain di jam sepi + selalu meja sama + selalu lawan sama’ adalah saringan yang sangat selektif. Waktu adalah dimensi yang jarang dipalsukan.",
        "Contoh perhitungan dampak: 5 akun x Rp800 juta = Rp4 miliar per komplotan per bulan. Bila ada 100 komplotan serupa = Rp400 miliar/bulan = Rp4,8 triliun/tahun. Angka-angka ini menjelaskan mengapa Satgas melaporkan ratusan triliun: kejahatannya berskala industri. Analis yang memahami skala tidak akan meremehkan ‘kasus kecil’.",
        "Dua: waspadai evolusi ke kripto. Judi online kini menerima deposit kripto — menggabungkan dua tipologi lesson ini (AML18 + AML19). Dana kotor → kripto → situs judi → ‘kemenangan’ → fiat. Rantai hibrida ini butuh analis hibrida yang paham keduanya. Kabar baiknya: kamu baru saja mempelajari keduanya.",
        "Penutup: tiga tipologi, dua lab deteksi, satu kerangka respons — kamu kini bisa mengenali, mengukur, dan merespons pencucian via judi. Ingat selalu konteks Indonesia: ilegal berarti tidak ada area abu-abu. Ketegasanmu didukung hukum; gunakan dengan bijak dan prosedural.",
        "Satu studi kasus nyata untuk direnungkan: operasi internasional ‘Operation Jackpot’ dan sejenisnya menunjukkan komplotan judi-pencucian beroperasi lintas negara dengan pembagian peran (perekrut mule, operator akun, penarik dana). Struktur organisasinya mirip perusahaan — ada manajer, ada pekerja. Memahaminya sebagai ORGANISASI (bukan individu nakal) mengubah strategimu dari ‘tangkap pemain’ menjadi ‘bongkar jaringan’.",
        "Dan satu pengingat terakhir tentang korban: di balik setiap ‘Meja 7’ ada mule yang mungkin tidak tahu, penjudi adiktif yang bangkrut, dan keluarga yang hancur. Pekerjaan AML bukan hanya tentang angka dan regulasi — ia tentang melindungi manusia. Ingat itu saat kamu menatap dashboard jam 2 pagi.",
        "Mulai dari hal kecil minggu ini: ajukan ke atasanmu untuk menambahkan satu aturan deteksi — deposit di 90-100% ambang lapor ≥3x seminggu. Satu aturan, satu dashboard, satu review mingguan. Dalam sebulan kamu akan tahu apakah institusimu punya masalah ini. Data mengalahkan asumsi; mulailah mengumpulkan data.",
        "Satu metrik untuk mengukur keberhasilan programmu: rasio STR terkait judi yang berujung penyidikan. Bila deteksimu tajam, rasionya tinggi; bila banyak false positive, PPATK akan memberi umpan balik. Jadikan umpan balik itu kalibrasi — ketajaman deteksi adalah keterampilan yang diasah, bukan bakat bawaan.",
        "Dan akhirnya: dokumentasikan SEMUA yang kamu lakukan. Setiap aturan deteksi, setiap ambang, setiap eskalasi — catat alasan dan hasilnya. Dokumentasi ini adalah perisaimu saat ditanya regulator dan bekalmu saat berganti peran. Analis yang terdokumentasi = analis yang dipercaya.",
        "Selamat — kamu kini bisa mengenali mesin cuci bernama judi online, mengukurnya dengan data, dan meresponsnya dengan prosedur. Tiga kemampuan yang membedakan analis biasa dari analis yang melindungi sistem keuangan.",
        "Terus asah matamu untuk pola, pertajam ambangmu dengan data, dan jangan pernah berhenti bertanya ‘ke mana uang ini pergi?’ — karena di sanalah kejahatan selalu meninggalkan jejak. Ikuti jejaknya, dan kamu akan menemukan kebenaran yang selama ini tersembunyi di balik angka-angka yang selama ini kamu lihat setiap hari.",
        "Contoh aturan operasional yang konkret: (1) kalah > Rp300 juta ke satu lawan dalam 30 hari → tandai; (2) ≥3 deposit di 90-100% ambang lapor dalam 7 hari → tandai; (3) volume taruhan > Rp1 miliar/bulan dengan win-rate < 45% → tandai (taruhan aman). Tiga aturan, dijalankan harian otomatis, ditinjau analis. Sederhana, efektif, bisa dijelaskan ke auditor.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Terdeteksi = langsung blokir.” Deteksi = MULAI investigasi. Blokir prematur memperingatkan komplotan (tipping-off) dan bisa salah sasaran. Ikuti prosedur: deteksi → verifikasi → eskalasi → tindakan.",
      },
      hints: [
        "Ambang dumping: kalah >Rp300 juta ke satu lawan per bulan (sesuaikan).",
        "Ambang structuring: ≥3 deposit di 90-100% ambang dalam seminggu.",
      ],
      reference: "Agregasi + ambang = 80% kasus. Deteksi = mulai investigasi.",
    },
    {
      id: "respons",
      eyebrow: "Langkah 4 · Konsep",
      title: "Respons & pencegahan",
      prose: [
        "Respons bertingkat: (1) pola terdeteksi → EDD nasabah (sumber dana, tujuan transaksi); (2) terkonfirmasi → STR ke PPATK + pertimbangkan penutupan rekening; (3) jaringan/komplotan → koordinasi penegak hukum. Pencegahan: blokir merchant judi teridentifikasi, pantau MCC/e-wallet berisiko, edukasi nasabah.",
        "Konteks Indonesia memberi keleluasaan: karena judi online ilegal, bank BISA dan SEBAIKNYA memblokir transaksi ke merchant judi teridentifikasi tanpa dilema 'bisnis sah'. Kominfo memblokir situs; bank memblokir alirannya — dua sisi gunting yang sama.",
        "Dua miskonsepsi. Satu: 'Blokir merchant = selesai.' Operator ganti domain/nama dalam hitungan jam — butuh daftar hidup + deteksi pola, bukan daftar statis. Dua: 'Ini urusan polisi.' Bank adalah pintu aliran dana — kewajiban AML (POJK 8/2023) mencakup pemantauan transaksi mencurigakan APAPUN sumbernya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Judi online juga PINTU MASUK fraud lain: data nasabah dicuri via situs judi palsu, e-wallet dibobol untuk deposit judi. Analis fraud yang melihat 'deposit judi' harus juga memeriksa 'apakah e-wallet-nya dibobol' — dua kejahatan, satu pintu.",
      },
      hints: [
        "Bangun daftar merchant judi hidup (update mingguan).",
        "Kolaborasi dengan tim fraud — polanya sering beririsan.",
      ],
      reference: "EDD → STR → koordinasi. Daftar hidup, bukan statis.",
    },
    {
      id: "lab-dumping",
      eyebrow: "Langkah 5 · Lab",
      title: "Deteksi chip dumping",
      prose: [
        "Lima hand poker. Agregasikan total KEKALAHAN P1 ke tiap lawan; tandai DUMPING bila melebihi Rp300 (ribu) ke satu lawan.",
        "Hasil: P1 → P2 = 450 = DUMPING. Perhatikan: kemenangan P1 ke P3 tidak mengurangi skor dumping — pencuci tidak peduli menang kecil di tempat lain. Eksperimen: turunkan ambang ke 200 — apa yang berubah?",
      ],
      tasks: [
        { id: "t1", text: "Agregasi kekalahan P1 per lawan" },
        { id: "t2", text: "Tandai DUMPING bila > 300, cetak" },
      ],
      expected: "P1 -> P2: 450 (DUMPING)",
      note: {
        title: "💡 Intuisi",
        body: "Satu agregasi sederhana menangkap skema Rp450 juta. Pencuci mengandalkan 'tidak ada yang menjumlahkan' — analis yang menjumlahkan memenangkan permainan.",
      },
      hints: [
        "Hanya hitung hasil 'kalah' milik P1.",
        "Gunakan dict; ambang > 300.",
      ],
      code: {
        starter: "# (pemain, lawan, hasil, jumlah Rp ribu). JANGAN UBAH.\nhands = [(\"P1\",\"P2\",\"kalah\",100),(\"P1\",\"P2\",\"kalah\",150),(\"P1\",\"P3\",\"menang\",80),\n         (\"P1\",\"P2\",\"kalah\",200),(\"P2\",\"P1\",\"menang\",50)]\n\n# TULIS KODEMU: agregasi kalah P1 per lawan + tandai dumping\nkalah = {}\nfor p, lwn, hasil, jml in hands:\n    if p == \"P1\" and hasil == \"kalah\":\n        kalah[lwn] = kalah.get(lwn, 0) + jml\nfor lwn, total in kalah.items():\n    status = \n    print(f\"P1 -> {lwn}: {total} ({status})\")\n",
        lockLines: 9,
        solution: "# (pemain, lawan, hasil, jumlah Rp ribu). JANGAN UBAH.\nhands = [(\"P1\",\"P2\",\"kalah\",100),(\"P1\",\"P2\",\"kalah\",150),(\"P1\",\"P3\",\"menang\",80),\n         (\"P1\",\"P2\",\"kalah\",200),(\"P2\",\"P1\",\"menang\",50)]\n\n# TULIS KODEMU: agregasi kalah P1 per lawan + tandai dumping\nkalah = {}\nfor p, lwn, hasil, jml in hands:\n    if p == \"P1\" and hasil == \"kalah\":\n        kalah[lwn] = kalah.get(lwn, 0) + jml\nfor lwn, total in kalah.items():\n    status = \"DUMPING\" if total > 300 else \"normal\"\n    print(f\"P1 -> {lwn}: {total} ({status})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "P2 DUMPING 450", msg: "100+150+200.", pattern: "P1 -> P2: 450 .DUMPING." },
          { kind: "uses", task: "t1", label: "Agregasi dict", msg: "Jumlahkan per lawan.", token: "kalah" },
        ],
      },
      reference: "Agregasi kalah per lawan; >300 = DUMPING.",
    },
    {
      id: "lab-struktur",
      eyebrow: "Langkah 6 · Lab",
      title: "Deteksi structuring taruhan",
      prose: [
        "Enam deposit, ambang lapor Rp100.000 ribu. Hitung deposit di rentang [90.000, 100.000) — zona 'nyaris ambang'. Tandai STRUKTURING bila ≥3.",
        "Hasil: 4 dari 6 = STRUKTURING. Perhatikan deposit Rp200.000 (di atas ambang) — justru BUKAN bagian pola; structuring menghindari ambang, bukan melanggarnya. Eksperimen: bagaimana bila ambang 50.000? Pola berubah — kalibrasi ambang itu penting.",
      ],
      tasks: [
        { id: "t1", text: "Hitung deposit di rentang [90000, 100000)" },
        { id: "t2", text: "Tandai STRUKTURING bila >= 3" },
      ],
      expected: "Deposit mencurigakan: 4 dari 6\nSTRUKTURING",
      note: {
        title: "💡 Intuisi",
        body: "Structuring = kejahatan yang 'menghormati' ambang. Deteksinya pun menghormati ambang: cari yang TERLALU dekat, TERLALU sering.",
      },
      hints: [
        "mencurigakan = [d for d in deposits if 90000 <= d < 100000].",
        "STRUKTURING bila len >= 3.",
      ],
      code: {
        starter: "# Deposit Rp ribu. Ambang lapor 100.000. JANGAN UBAH.\ndeposits = [95000, 98000, 96000, 50000, 99000, 200000]\n\n# TULIS KODEMU: deteksi structuring\nmencurigakan = \nprint(f\"Deposit mencurigakan: {len(mencurigakan)} dari {len(deposits)}\")\nprint(\"STRUKTURING\" if len(mencurigakan) >= 3 else \"normal\")\n",
        lockLines: 5,
        solution: "# Deposit Rp ribu. Ambang lapor 100.000. JANGAN UBAH.\ndeposits = [95000, 98000, 96000, 50000, 99000, 200000]\n\n# TULIS KODEMU: deteksi structuring\nmencurigakan = [d for d in deposits if 90000 <= d < 100000]\nprint(f\"Deposit mencurigakan: {len(mencurigakan)} dari {len(deposits)}\")\nprint(\"STRUKTURING\" if len(mencurigakan) >= 3 else \"normal\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "4 mencurigakan", msg: "95,98,96,99 ribu.", pattern: "Deposit mencurigakan: 4 dari 6" },
          { kind: "stdout_matches", task: "t2", label: "STRUKTURING", msg: ">=3.", pattern: "STRUKTURING" },
        ],
      },
      reference: "Zona [90%,100%) ambang + frekuensi = structuring.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Indikasi judi × pencucian: respons apa",
      prose: [
        "Satu: transfer ke merchant/e-wallet judi teridentifikasi → tandai + pantau pola (frekuensi, nominal). Dua: pola dumping/structuring terdeteksi → EDD: sumber dana + tujuan. Tiga: terkonfirmasi skema → STR + pertimbangkan tutup rekening. Empat: jaringan/komplotan → eskalasi ke penegak hukum + blokir merchant. Lima: situs judi palsu/phishing → koordinasi tim fraud (nasabah mungkin korban).",
        "Aturan praktis 10 detik: merchant judi = pantau; pola = EDD; skema = STR; korban = lindungi. Bedakan pelaku dan korban — responsnya berlawanan.",
        "Satu jebakan: 'tutup rekening = selesai.' Penutupan tanpa STR = memindahkan masalah ke bank lain. STR memastikan jejaknya tercatat di PPATK untuk jaringan yang lebih luas. Tutup + lapor, bukan tutup saja.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di Indonesia, pemblokiran rekening terkait judi online didukung aparat penegak hukum (Satgas). Bank yang proaktif memblokir + melapor = bank yang sejalan dengan negara. Dokumentasikan setiap tindakan — ia bukti kepatuhan POJK 8/2023.",
      },
      reference: "Pantau → EDD → STR → koordinasi. Tutup + lapor.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Komplotan 'Meja 7'",
      prose: [
        "Tim fraud menemukan 5 akun poker yang selalu bermain di 'Meja 7' yang sama, jam 02.00-04.00. Pola 1 bulan: A kalah Rp800 juta (ke B, C, D), B/C/D menarik total Rp750 juta sebagai 'kemenangan', E (akun kelima) tidak pernah main — hanya menerima transfer dari B. Rekening A menerima transfer Rp800 juta dari perusahaan fiktif seminggu sebelum mulai main.",
        "Pertanyaan: (a) Apa skemanya? (b) Langkah respons? Pembahasan: (a) Chip dumping berjamaah + layering: dana fiktif → A → (kalah) → B/C/D → (menang) → tarik; E = penampung/lapisan tambahan. (b) Bekukan A-E (satu jaringan); STR dengan narasi jaringan; koordinasi polisi (perusahaan fiktif = predicate crime); blokir meja/operator; periksa apakah ada nasabah lain dengan pola serupa (pencarian jaringan). Pelajaran: satu pola dumping = satu kasus; LIMA akun terkoordinasi = organisasi. Naikkan level respons sesuai skala.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan E — akun yang 'tidak ngapa-ngapain' justru paling mencurigakan. Dalam analisis jaringan, node pasif penerima dana = indikasi layering. Jangan abaikan yang diam.",
      },
      reference: "Skala menentukan respons: individu = EDD; jaringan = penegak hukum.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Tiga modus utama: chip dumping (sengaja kalah ke komplotan di poker PvP), e-sports betting & skin gambling, dan jasa pencucian via crash games/bot — semuanya mengubah uang kotor menjadi 'kemenangan' sah.",
        "Deteksi chip dumping = agregasi kalah-menang per pasangan pemain: contoh lab 450/(450) = 100% — pemain sah tidak kalah 100% ke satu orang yang sama.",
        "Nilai bukan penentu, POLA adalah: structuring terdiri dari transaksi kecil; judi kecil-menengah justru lolos radar dan akumulasinya besar.",
        "Aturan sederhana (agregasi + ambang) menangkap 80% kasus — AI hanya untuk 20% sisanya; tidak perlu menunggu AI canggih untuk mulai.",
        "Sumber sinyal bank: pola transfer ke e-wallet/merchant judi (nama merchant, MCC code); di Indonesia perjudian dilarang KUHP, jadi jejak transfernya selalu red flag.",
      ],
      quiz: [
        {
          q: "Ciri utama chip dumping:",
          options: [
            { text: "Kalah konsisten ke lawan yang SAMA tanpa upaya menang", why: "Benar: konsistensi ke satu lawan + tanpa upaya menang = tanda tangan dumping.", correct: true },
            { text: "Menang besar sesekali", why: "Itu pola pemain biasa, bukan transfer terselubung." },
            { text: "Bermain di banyak meja berbeda", why: "Meja banyak = pola rekreasi, bukan dumping terarah." },
            { text: "Deposit besar sekali", why: "Deposit besar = red flag lain; dumping soal pola kalah." },
          ],
        },
        {
          q: "Deposit Rp95 juta × 4 dalam seminggu (ambang lapor Rp100 juta) mengindikasikan:",
          options: [
            { text: "Structuring — menghindari ambang dengan pola", why: "Benar: 'nyaris ambang + berulang' = structuring.", correct: true },
            { text: "Investasi rutin", why: "Investasi rutin tidak menghindari ambang pelaporan." },
            { text: "Tidak masalah — di bawah ambang", why: "Di bawah ambang bukan pembelaan bila polanya jelas." },
            { text: "Kesalahan sistem", why: "Pola 4x bukan kesalahan; itu kesengajaan." },
          ],
        },
        {
          q: "Konteks Indonesia untuk judi online:",
          options: [
            { text: "Ilegal — setiap aliran dana ke sana adalah red flag serius", why: "Benar: judi dilarang KUHP termasuk online.", correct: true },
            { text: "Legal dengan izin", why: "Tidak ada judi online legal di Indonesia." },
            { text: "Abu-abu — tergantung nominal", why: "Tidak abu-abu; nominal tidak mengubah status ilegal." },
            { text: "Hanya ilegal bila di atas Rp100 juta", why: "Ambang lapor bukan ambang legalitas." },
          ],
        },
        {
          q: "Hasil deteksi pola dumping sebaiknya ditindaklanjuti dengan:",
          options: [
            { text: "EDD/investigasi dulu — deteksi = mulai, bukan vonis", why: "Benar: deteksi → verifikasi → eskalasi.", correct: true },
            { text: "Langsung blokir dan umumkan", why: "Blokir prematur = tipping-off; umumkan = melanggar kerahasiaan." },
            { text: "Abaikan — pemain sah bisa kalah", why: "False positive ditangani via EDD, bukan pengabaian." },
            { text: "Naikkan ambang agar tidak terdeteksi lagi", why: "Mengubah ambang untuk menyembunyikan = pelanggaran." },
          ],
        },
        {
          q: "Akun E yang tidak pernah main tetapi menerima transfer dari pemenang dumping kemungkinan adalah:",
          options: [
            { text: "Lapisan layering — node pasif penerima dana", why: "Benar: node pasif = indikasi layering.", correct: true },
            { text: "Tidak relevan — ia tidak bermain", why: "Justru yang diam paling perlu diperiksa." },
            { text: "Korban", why: "Tidak ada bukti ia korban; polanya penerima layering." },
            { text: "Bandar resmi", why: "Judi online ilegal — tidak ada bandar resmi." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Situsnya di luar negeri — di luar jangkauan.” Aliran dananya melewati bank/e-wallet Indonesia — di sanalah wewenangmu. Fokus pada apa yang bisa kamu lihat dan tindak, bukan pada apa yang tidak bisa.",
      },
      hints: [
        "Uji cepat: jelaskan 3 tipologi + cirinya tanpa melihat catatan.",
        "Ingat: pola > nominal; deteksi = mulai investigasi.",
      ],
      reference: "Pola > nominal. Jaringan > individu.",
    },
  ],
};
