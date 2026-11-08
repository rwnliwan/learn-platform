import type { V2Lesson } from "../lib/types";

export const hd35: V2Lesson = {
  slug: "hd35-surveilans-end-to-end",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "HD35 — Sistem Surveilans End-to-End: Desain, Evaluasi dan Diseminasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Wabah yang terdeteksi enam minggu terlambat — bukan karena modelnya jelek",
      prose: [
        "Sebuah kabupaten mengalami wabah demam berdarah. Datanya ada: puskesmas mencatat kasus setiap minggu, dan angka itu naik perlahan selama enam minggu sebelum ada yang bertindak. Bukan karena tidak ada model — model deteksi wabah (HD16: SIR, Rt, CUSUM) sudah tersedia. Bukan karena datanya buruk — kualitas datanya sudah dinilai (HD29: DQA). Yang tidak ada adalah SISTEM: siapa yang melapor, seberapa cepat laporan sampai, siapa yang membaca angka itu setiap minggu, ambang berapa yang memicu respons, dan siapa yang bertindak saat ambang terlampaui. Enam minggu keterlambatan itu bukan kegagalan pemodelan — melainkan kegagalan desain.",
        "Lesson ini merancang sistem surveilans end-to-end: dari desain (tujuan, definisi kasus, populasi, sumber data) ke evaluasi (sembilan atribut CDC) ke diseminasi (buletin, dashboard, umpan balik). HD16 sudah mengajarkan matematika deteksi wabah; HD29 sudah mengajarkan penilaian kualitas data agregat; lesson ini mengajarkan mesin di sekeliling keduanya — mesin yang membuat deteksi terjadi bahkan saat analisnya sedang cuti. Setelah lesson ini kamu bisa: (1) merancang sistem surveilans dari tujuan sampai alur data; (2) menilai sistem dengan sembilan atribut CDC dan menghitung empat atribut kuantitatif; (3) menjelaskan diseminasi sebagai bagian sistem (bukan afterthought); (4) menulis rekomendasi perbaikan yang mengikuti atribut terlemah.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada di track ini",
        body: "HD16: SIR, Rt, CUSUM, nowcasting, dan evaluasi alert (sensitivitas sistem, ketepatan waktu, nilai prediktif). HD29: DHIS2 dan empat dimensi DQA (completeness, timeliness, consistency, validity). Lesson ini tidak mengulang ketiganya — ia memakai mereka sebagai komponen di dalam desain, evaluasi, dan diseminasi sistem yang utuh.",
      },
      reference: "Deteksi (HD16) + kualitas data (HD29) + desain + evaluasi + diseminasi = sistem surveilans. Tanpa sistem, model hanya menunggu dibaca.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai sistem surveilans sebuah kabupaten seperti auditor — dan menulis rekomendasi yang bisa dieksekusi, bukan sekadar 'tingkatkan surveilans'.",
        "(1) Merancang sistem surveilans: tujuan, definisi kasus, populasi di bawah surveilans, sumber data indikator dan event-based, serta alur pelaporan;",
        "(2) Menilai sembilan atribut evaluasi CDC — kesederhanaan, fleksibilitas, kualitas data, akseptabilitas, sensitivitas, nilai prediktif positif, representativitas, ketepatan waktu, stabilitas;",
        "(3) Menghitung empat atribut kuantitatif (completeness, timeliness, sensitivitas, PVP) dan skor komposit, lalu menentukan vonis layak atau tidak;",
        "(4) Merancang diseminasi: buletin, dashboard, dan umpan balik ke pelapor — serta menjelaskan kenapa surveilans tanpa umpan balik akan mati.",
      ],
      tasks: [],
    },
    {
      id: "desain",
      eyebrow: "Langkah 3 · Teori",
      title: "Desain: tujuan dulu, data kemudian",
      prose: [
        "Sistem surveilans yang baik dimulai dari tujuan, bukan dari data. Tujuan menentukan segalanya: bila tujuannya deteksi dini wabah, sistem butuh laporan mingguan yang cepat dan ambang yang sensitif; bila tujuannya evaluasi program imunisasi, sistem butuh data lengkap yang akurat dan ambang yang tidak penting. Sistem yang mencoba semua tujuan sekaligus biasanya tidak mencapai satu pun — ia mengumpulkan terlalu banyak data terlalu lambat untuk deteksi, dan terlalu sedikit data terlalu cepat untuk evaluasi.",
        "Empat keputusan desain mengikuti tujuan. Pertama, definisi kasus: kasus DBD adalah apa — demam plus trombosit di bawah 100 ribu, atau diagnosis klinis dokter, atau konfirmasi lab? Definisi yang longgar menangkap banyak kasus (sensitivitas tinggi) tetapi juga banyak bukan-kasus; definisi yang ketat menangkap sedikit tetapi pasti. Kedua, populasi di bawah surveilans: seluruh penduduk kabupaten, atau hanya yang berobat ke faskes? Yang kedua lebih murah tetapi buta terhadap yang tidak berobat — dan yang tidak berobat sering kali yang paling rentan. Ketiga, sumber data: surveilans indikator (laporan rutin mingguan dari faskes) plus surveilans berbasis peristiwa (event-based: laporan media, keluhan masyarakat, sinyal apotek) — HD16 memakai keduanya, dan kombinasi itulah yang menangkap wabah lebih cepat daripada salah satunya. Keempat, alur pelaporan: faskes ke kabupaten ke provinsi ke nasional — setiap jenjang menambah keterlambatan dan peluang error (HD29), sehingga alur yang pendek dan otomatis lebih baik daripada alur yang panjang dan manual.",
        "Satu prinsip desain yang paling sering dilanggar: tetapkan baseline, ambang, dan protokol respons SEBELUM wabah — saat tenang, bukan saat panik (HD16). Ambang yang ditetapkan saat panik selalu terlalu rendah (semua orang melihat wabah di mana-mana) atau terlalu tinggi (semua orang menunggu bukti yang tidak akan datang). Dan bedakan tanggal onset dari tanggal lapor di SETIAP grafik: kurva berdasarkan tanggal lapor yang 'menurun' sering kali hanya berarti laporannya belum masuk — nowcasting mengoreksi keterlambatan ini sebelum menghitung (HD16).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Merancang sistem dari data yang tersedia, bukan dari tujuan. 'Kita punya data ini, jadi surveilansnya mengukur ini' adalah desain terbalik: sistem mengukur apa yang mudah, bukan apa yang penting. Mulai dari tujuan, lalu tanyakan data apa yang dibutuhkan — dan akui data yang tidak ada.",
      },
      reference: "Tujuan menentukan definisi kasus, populasi, sumber data, dan alur. Baseline dan ambang ditetapkan saat tenang.",
    },
    {
      id: "evaluasi-cdc",
      eyebrow: "Langkah 4 · Teori",
      title: "Evaluasi CDC: sembilan atribut, empat angka",
      prose: [
        "CDC menilai sistem surveilans dengan sembilan atribut. Lima di antaranya kualitatif: kesederhanaan (apakah sistem mudah dijalankan dan dipahami pelapor?), fleksibilitas (apakah sistem bisa beradaptasi saat definisi kasus atau penyakit berubah?), akseptabilitas (apakah pelapor bersedia melapor — atau bebannya terlalu besar?), stabilitas (apakah sistem tetap jalan saat listrik padam, staf cuti, atau dana terlambat?), dan kualitas data (lengkap dan valid — HD29). Empat sisanya kuantitatif dan dihitung di lab: sensitivitas (proporsi kasus sebenarnya yang terdeteksi sistem), nilai prediktif positif atau PVP (proporsi alert yang benar-benar wabah), representativitas (apakah kasus yang terdeteksi mewakili seluruh populasi?), dan ketepatan waktu (seberapa cepat dari onset ke laporan ke respons?).",
        "Contoh angka dari lab — satu kabupaten, satu semester. Completeness: 180 dari 200 laporan yang diharapkan masuk, sama dengan 90,0 persen. Timeliness: 162 dari 200 laporan masuk sebelum tenggat, sama dengan 81,0 persen. Sensitivitas: 96 dari 120 kasus sebenarnya terdeteksi, sama dengan 80,0 persen. PVP: 96 dari 120 alert benar-benar wabah, sama dengan 80,0 persen. Representativitas: 18 dari 20 puskesmas melapor, sama dengan 90,0 persen. Skor komposit (rata-rata kelima atribut): 84,2. Vonis operasional (semua atribut pada atau di atas 80 persen): LAYAK — dengan catatan timeliness 81,0 persen adalah atribut terlemah dan paling dekat dengan ambang.",
        "Yang harus dipahami dari angka-angka itu adalah trade-off-nya. Sensitivitas dan PVP bergerak berlawanan: ambang yang rendah menangkap lebih banyak kasus (sensitivitas naik) tetapi juga lebih banyak alarm palsu (PVP turun) — HD16 sudah menunjukkan logika yang sama pada alert CUSUM. Sistem dengan PVP 100 persen biasanya ambangnya terlalu tinggi: ia tenang karena buta. Dan representativitas mengingatkan bahwa 90 persen completeness tidak berarti apa-apa bila 10 persen yang hilang adalah wilayah yang paling rentan — sistem yang hanya mendengar wilayah yang mudah dijangkau adalah sistem yang buta terhadap yang paling membutuhkan.",
      ],
      tasks: [],
      formula: String.raw`\text{Sensitivitas} = \frac{\text{terdeteksi}}{\text{kasus sebenarnya}}, \quad \text{PVP} = \frac{\text{alert benar}}{\text{semua alert}}`,
      formulaNote: "Contoh lab: sensitivitas 96/120 = 80,0 persen; PVP 96/120 = 80,0 persen. Completeness 90,0 persen; timeliness 81,0 persen; representativitas 90,0 persen; komposit 84,2; vonis LAYAK.",
      note: {
        title: "Sering salah",
        body: "Menilai sistem dari jumlah alert. Sistem dengan 100 alert 'benar' bisa berarti ambang terlalu tinggi (buta) atau definisi kasus terlalu longgar (berisik). Yang dinilai adalah atribut: sensitivitas, PVP, ketepatan waktu, dan representativitas — bukan volume.",
      },
      reference: "Sembilan atribut CDC: 5 kualitatif + 4 kuantitatif. Sensitivitas lawan PVP adalah trade-off ambang.",
    },
    {
      id: "diseminasi",
      eyebrow: "Langkah 5 · Teori",
      title: "Diseminasi: surveilans tanpa umpan balik akan mati",
      prose: [
        "Sistem surveilans yang tidak pernah memberi kabar balik kepada pelapornya akan mati pelan-pelan. Puskesmas yang melapor setiap minggu tetapi tidak pernah tahu apa yang terjadi dengan laporannya akan berhenti melapor — bukan karena malas, melainkan karena rasional: pekerjaan yang tidak pernah dibalas adalah pekerjaan yang tidak penting. Diseminasi adalah bagian dari sistem, bukan afterthought: buletin mingguan yang kembali ke pelapor (apa yang terdeteksi, di mana, apa yang dilakukan), dashboard yang bisa dibaca puskesmas sendiri, dan alert yang menjelaskan 'apa yang harus dilakukan', bukan hanya 'ada sinyal'.",
        "Tiga bentuk diseminasi, tiga audiens. Buletin mingguan untuk pelapor dan pengambil keputusan lokal: satu halaman, tiga angka (kasus minggu ini, perbandingan dengan baseline, wilayah hotspot), dan satu rekomendasi. Dashboard untuk analis: tren, peta (HD23), dan ambang — alat kerja, bukan pajangan. Alert untuk respons cepat: siapa yang dihubungi, apa yang dilakukan dalam 24 jam pertama, dan siapa yang memutuskan eskalasi. Dan satu aturan yang mengikat ketiganya: setiap alert dicatat beserta hasilnya (wabah nyata atau palsu) — tanpa umpan balik ini, ambang tidak pernah belajar (HD16).",
        "Diseminasi juga punya etika: angka agregat boleh dipublikasikan, identitas pasien tidak. Buletin yang menyebut 'RW 05, 12 kasus' memberi informasi yang cukup untuk bertindak tanpa membuka siapa yang sakit. Dan bila datanya menunjukkan wilayah tertentu tertinggal (representativitas rendah), diseminasi harus jujur tentang itu — menyembunyikan wilayah buta demi angka nasional yang rapi adalah cara tercepat kehilangan kepercayaan pelapor di wilayah itu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke HD19 dan HD29",
        body: "Pelaporan klinis (HD19) mengajarkan cara menulis untuk pengambil keputusan; DQA (HD29) mengajarkan cara menilai kualitas sebelum diseminasi. Diseminasi yang baik menggabungkan keduanya: angka yang sudah dinilai kualitasnya, ditulis untuk orang yang harus bertindak.",
      },
      reference: "Buletin untuk pelapor, dashboard untuk analis, alert untuk respons. Setiap alert dicatat hasilnya — ambang belajar dari umpan balik.",
    },
    {
      id: "lab-surveilans",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: menilai sistem surveilans satu kabupaten",
      prose: [
        "Sekarang nilai sendiri sistem surveilans satu kabupaten selama satu semester. Datanya: 200 laporan diharapkan (20 faskes dikali 10 minggu); 180 laporan masuk; 162 laporan masuk sebelum tenggat. Kasus DBD sebenarnya 120; sistem mendeteksi 96. Alert yang dikeluarkan 120; 96 di antaranya benar-benar wabah. Puskesmas yang melapor: 18 dari 20.",
        "Hitung lima atribut: completeness 180 dibagi 200 sama dengan 90,0 persen; timeliness 162 dibagi 200 sama dengan 81,0 persen; sensitivitas 96 dibagi 120 sama dengan 80,0 persen; PVP 96 dibagi 120 sama dengan 80,0 persen; representativitas 18 dibagi 20 sama dengan 90,0 persen. Skor komposit (rata-rata kelima): 84,2. Vonis operasional: LAYAK bila semua atribut pada atau di atas 80 persen (≥ 80) — dan di sini semuanya lolos, walau timeliness 81,0 persen hanya 1 poin di atas ambang.",
        "Setelah lolos, coba eksperimen: turunkan timeliness menjadi 150 laporan tepat waktu (75,0 persen) dan lihat vonis berubah menjadi PERLU PEMBINAAN — lalu tanyakan intervensi apa yang tepat: bukan hukuman untuk faskes yang terlambat, melainkan penyederhanaan formulir dan umpan balik bulanan (atribut terlemah menentukan intervensi, HD29).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `completeness` = laporan masuk / laporan diharapkan x 100" },
        { id: "t2", text: "Hitung `timeliness` = laporan tepat waktu / laporan diharapkan x 100" },
        { id: "t3", text: "Hitung `sensitivitas` = kasus terdeteksi / kasus sebenarnya x 100 dan `pvp` = alert benar / semua alert x 100" },
        { id: "t4", text: "Hitung `representativitas`, `komposit` (rata-rata kelima atribut), dan `vonis` (LAYAK bila semua ≥ 80)" },
      ],
      expected: "completeness=90.0\ntimeliness=81.0\nsensitivitas=80.0\npvp=80.0\nrepresentativitas=90.0\nkomposit=84.2\nvonis=LAYAK",
      hints: [
        "Completeness: 180/200 x 100 = 90,0. Timeliness: 162/200 x 100 = 81,0.",
        "Sensitivitas: 96/120 x 100 = 80,0. PVP: 96/120 x 100 = 80,0 — penyebutnya berbeda (kasus vs alert), walau angkanya sama di contoh ini.",
        "Representativitas: 18/20 x 100 = 90,0. Komposit: (90,0 + 81,0 + 80,0 + 80,0 + 90,0) / 5 = 84,2.",
        "Vonis: LAYAK bila min kelima atribut ≥ 80 — di sini min-nya 80,0, tepat di ambang.",
      ],
      code: {
        starter: `# Data satu kabupaten, satu semester (sintetis)\nlaporan_diharapkan = 200\nlaporan_masuk = 180\nlaporan_tepat_waktu = 162\nkasus_sebenarnya = 120\nkasus_terdeteksi = 96\nalert_total = 120\nalert_benar = 96\nwilayah_total = 20\nwilayah_melapor = 18\n\n# t1-t4: hitung lima atribut, komposit, dan vonis\ncompleteness = 0.0  # TULIS KODEMU\ntimeliness = 0.0  # TULIS KODEMU\nsensitivitas = 0.0  # TULIS KODEMU\npvp = 0.0  # TULIS KODEMU\nrepresentativitas = 0.0  # TULIS KODEMU\nkomposit = 0.0  # TULIS KODEMU: rata-rata kelima atribut\nvonis = ""  # TULIS KODEMU: "LAYAK" bila semua atribut >= 80, selain itu "PERLU PEMBINAAN"\n\nprint(f"completeness={completeness:.1f}")\nprint(f"timeliness={timeliness:.1f}")\nprint(f"sensitivitas={sensitivitas:.1f}")\nprint(f"pvp={pvp:.1f}")\nprint(f"representativitas={representativitas:.1f}")\nprint(f"komposit={komposit:.1f}")\nprint(f"vonis={vonis}")`,
        lockLines: 0,
        solution: `# Data satu kabupaten, satu semester (sintetis)\nlaporan_diharapkan = 200\nlaporan_masuk = 180\nlaporan_tepat_waktu = 162\nkasus_sebenarnya = 120\nkasus_terdeteksi = 96\nalert_total = 120\nalert_benar = 96\nwilayah_total = 20\nwilayah_melapor = 18\n\n# t1-t4: hitung lima atribut, komposit, dan vonis\ncompleteness = laporan_masuk / laporan_diharapkan * 100\ntimeliness = laporan_tepat_waktu / laporan_diharapkan * 100\nsensitivitas = kasus_terdeteksi / kasus_sebenarnya * 100\npvp = alert_benar / alert_total * 100\nrepresentativitas = wilayah_melapor / wilayah_total * 100\nkomposit = (completeness + timeliness + sensitivitas + pvp + representativitas) / 5\nvonis = "LAYAK" if min(completeness, timeliness, sensitivitas, pvp, representativitas) >= 80 else "PERLU PEMBINAAN"\n\nprint(f"completeness={completeness:.1f}")\nprint(f"timeliness={timeliness:.1f}")\nprint(f"sensitivitas={sensitivitas:.1f}")\nprint(f"pvp={pvp:.1f}")\nprint(f"representativitas={representativitas:.1f}")\nprint(f"komposit={komposit:.1f}")\nprint(f"vonis={vonis}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "completeness=90.0", label: "Completeness = 90,0 persen", msg: "180/200 x 100 = 90,0." },
          { kind: "stdout_matches", task: "t2", pattern: "timeliness=81.0", label: "Timeliness = 81,0 persen (atribut terlemah)", msg: "162/200 x 100 = 81,0 — hanya 1 poin di atas ambang 80." },
          { kind: "stdout_matches", task: "t3", pattern: "sensitivitas=80.0", label: "Sensitivitas = 80,0 persen", msg: "96/120 x 100 = 80,0. Penyebutnya kasus sebenarnya — bukan alert." },
          { kind: "stdout_matches", task: "t3", pattern: "pvp=80.0", label: "PVP = 80,0 persen", msg: "96/120 x 100 = 80,0. Penyebutnya semua alert — bukan kasus." },
          { kind: "equal", task: "t4", name: "komposit", value: 84.2, tol: 0.01, label: "Skor komposit = 84,2", msg: "(90,0 + 81,0 + 80,0 + 80,0 + 90,0) / 5 = 84,2." },
          { kind: "stdout_matches", task: "t4", pattern: "vonis=LAYAK", label: "Vonis = LAYAK (semua atribut ≥ 80)", msg: "Min kelima atribut = 80,0, tepat di ambang — LAYAK dengan catatan timeliness." },
        ],
      },
      reference: "Completeness 90,0; timeliness 81,0; sensitivitas 80,0; PVP 80,0; representativitas 90,0; komposit 84,2; vonis LAYAK.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: atribut terlemah menentukan intervensi",
      prose: [
        "Skenario 1 — 'Timeliness jebol (laporan terlambat) tetapi completeness bagus.' → Sederhanakan formulir dan tenggat, beri pengingat otomatis, beri umpan balik bulanan. Alasan: masalahnya proses, bukan pencatatan (HD29). Contoh nyata: faskes yang melaporkan lengkap tetapi selalu seminggu terlambat.",
        "Skenario 2 — 'Completeness jebol (laporan tidak masuk) tetapi timeliness bagus.' → Cek beban kerja dan kunjungi faskes: apakah formulirnya membingungkan, apakah stafnya kurang, apakah sinyalnya tidak sampai? Alasan: masalahnya pencatatan atau kapasitas, bukan proses. Contoh nyata: faskes yang melapor cepat tetapi hanya separuh laporan yang masuk.",
        "Skenario 3 — 'Sensitivitas rendah (kasus terlewat) tetapi PVP tinggi.' → Longgarkan definisi kasus atau turunkan ambang alert — dan terima PVP yang sedikit turun. Alasan: trade-off ambang (HD16): sistem yang terlalu ketat tenang karena buta. Contoh nyata: wabah yang baru terdeteksi setelah 50 kasus karena ambang menunggu 30 kasus seminggu.",
        "Skenario 4 — 'PVP rendah (banyak alarm palsu) tetapi sensitivitas tinggi.' → Naikkan ambang atau tambah konfirmasi lapangan sebelum alert disebar. Alasan: alarm palsu yang berulang membuat petugas berhenti merespons — dan sistem yang tidak direspons sama dengan tidak ada sistem. Contoh nyata: fogging yang dikerahkan lima kali untuk alarm yang empat kali palsu (HD16).",
        "Skenario 5 — 'Representativitas rendah (wilayah tertentu tidak melapor).' → Jangkau wilayah itu dulu — kunjungan, pelatihan, insentif pelaporan. Alasan: angka nasional yang rapi tetapi buta di wilayah rentan adalah angka yang berbohong dengan sopan. Contoh nyata: 2 dari 20 puskesmas tidak melapor, dan keduanya wilayah dengan akses tersulit.",
        "Aturan praktis 10 detik: jangan pernah menulis rekomendasi 'tingkatkan surveilans' — tulis atributnya, angkanya, dan intervensinya: 'timeliness 81 persen, sederhanakan formulir dan beri umpan balik bulanan'. Rekomendasi tanpa atribut adalah doa, bukan rencana.",
      ],
      tasks: [],
      reference: "Atribut terlemah menentukan intervensi: timeliness jebol → sederhanakan proses; completeness jebol → cek kapasitas; sensitivitas rendah → longgarkan ambang; PVP rendah → konfirmasi dulu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: kabupaten dengan timeliness 81 persen",
      prose: [
        "Kabupaten di lab mendapat vonis LAYAK (komposit 84,2) — tetapi timeliness-nya 81,0 persen, hanya 1 poin di atas ambang, dan sensitivitas serta PVP-nya tepat 80,0 persen. Tiga atribut duduk di ambang. Pertanyaan dinas: intervensi apa yang didanai tahun ini — dan apa yang TIDAK didanai?",
        "Jawaban yang mengikuti atribut: danai penyederhanaan proses pelaporan (formulir lebih pendek, tenggat yang diingatkan otomatis, umpan balik bulanan ke faskes) karena timeliness adalah yang paling rapuh dan paling murah diperbaiki. Jangan danai sistem deteksi baru (CUSUM sudah ada di HD16 dan bekerja) — sensitivitas 80,0 persen bukan karena modelnya lemah, melainkan karena laporan terlambat membuat deteksi terlambat. Dan jangan hukum faskes yang terlambat: keterlambatan adalah gejala proses, bukan gejala kemalasan — faskes yang sama melaporkan lengkap (completeness 90,0 persen) tetapi terlambat, yang berarti mereka bekerja, hanya alurnya yang menghambat.",
        "Pembahasan: perhatikan urutan berpikirnya — atribut dulu, intervensi kemudian, dan intervensi yang TIDAK dilakukan sama pentingnya dengan yang dilakukan. Mendanai model baru saat masalahnya adalah keterlambatan laporan adalah membeli mikroskop untuk orang yang butuh jam dinding. Analis senior tidak hanya tahu apa yang harus diperbaiki; ia tahu apa yang tidak perlu diperbaiki.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Danai penyederhanaan proses (timeliness paling rapuh dan paling murah diperbaiki). Jangan danai model deteksi baru (CUSUM sudah bekerja; keterlambatan laporan yang membuat deteksi terlambat) dan jangan hukum faskes (lengkap tetapi terlambat berarti alur yang menghambat, bukan kemalasan).",
      },
      reference: "Atribut dulu, intervensi kemudian. Yang tidak didanai sama pentingnya dengan yang didanai.",
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
        "Desain dimulai dari tujuan; baseline, ambang, dan protokol respons ditetapkan saat tenang, bukan saat panik.",
        "Sembilan atribut CDC: 5 kualitatif + 4 kuantitatif; lab: completeness 90,0, timeliness 81,0, sensitivitas 80,0, PVP 80,0, representativitas 90,0, komposit 84,2, vonis LAYAK.",
        "Sensitivitas lawan PVP adalah trade-off ambang; PVP 100 persen biasanya berarti sistem buta.",
        "Diseminasi adalah bagian sistem: buletin untuk pelapor, dashboard untuk analis, alert untuk respons — setiap alert dicatat hasilnya.",
        "Atribut terlemah menentukan intervensi; rekomendasi tanpa atribut adalah doa, bukan rencana.",
      ],
      next: { label: "HD36 — Epidemiologi Lapangan: Investigasi Wabah Langkah demi Langkah", href: "/v2/learn/hd36-epidemiologi-lapangan" },
      quiz: [
        {
          q: "Sistem surveilans punya PVP 100 persen — semua alert benar-benar wabah. Apa yang harus dicurigai?",
          options: [
            { text: "Tidak ada — PVP 100 persen berarti sistem sempurna", why: "Salah: PVP sempurna hampir selalu berarti ambang terlalu tinggi. Sistem itu tenang karena buta — ia hanya berteriak saat wabah sudah jelas bagi semua orang." },
            { text: "Ambang terlalu tinggi: sistem melewatkan wabah kecil demi menjaga PVP — sensitivitasnya patut diperiksa", why: "Tepat: sensitivitas dan PVP bergerak berlawanan. PVP 100 persen tanpa sensitivitas yang dilaporkan adalah klaim yang tidak lengkap.", correct: true },
            { text: "Definisi kasusnya terlalu longgar", why: "Salah: definisi longgar justru MENURUNKAN PVP (banyak bukan-kasus ikut tertangkap). PVP 100 persen menandakan definisi atau ambang yang terlalu ketat." },
            { text: "Datanya terlalu lengkap — completeness 100 persen", why: "Salah: completeness tidak menentukan PVP. PVP ditentukan ambang dan definisi kasus, bukan kelengkapan laporan." },
          ],
        },
        {
          q: "Completeness 90 persen tetapi 10 persen yang hilang adalah wilayah dengan akses tersulit. Apa masalahnya?",
          options: [
            { text: "Tidak ada — 90 persen sudah di atas ambang 80 persen", why: "Salah: angka agregat menutupi disparitas. Yang hilang justru wilayah paling rentan — sistem buta terhadap yang paling membutuhkan." },
            { text: "Representativitas: kasus yang terdeteksi tidak mewakili seluruh populasi — angka nasional berbohong dengan sopan", why: "Tepat: completeness mengukur berapa banyak yang masuk; representativitas mengukur SIAPA yang masuk. Keduanya harus dibaca bersama.", correct: true },
            { text: "Timeliness — laporan dari wilayah sulit pasti terlambat", why: "Salah: mungkin benar, tetapi bukan itu masalah utamanya. Laporan yang tidak masuk sama sekali adalah masalah completeness dan representativitas, bukan timeliness." },
            { text: "Kualitas data — wilayah sulit pasti mencatat dengan buruk", why: "Salah: tidak ada bukti pencatatannya buruk. Masalahnya adalah mereka tidak terjangkau — bukan mereka mencatat buruk." },
          ],
        },
        {
          q: "Faskes melaporkan lengkap (completeness tinggi) tetapi selalu terlambat. Intervensi yang tepat?",
          options: [
            { text: "Hukum faskes yang terlambat agar jera", why: "Salah: keterlambatan adalah gejala proses, bukan kemalasan. Faskes yang sama melaporkan lengkap — mereka bekerja, alurnya yang menghambat." },
            { text: "Sederhanakan formulir dan alur, beri pengingat otomatis dan umpan balik bulanan", why: "Tepat: masalahnya proses pelaporan (HD29). Intervensi mengikuti dimensi yang jebol — timeliness jebol berarti perbaiki proses, bukan menghukum pelapor.", correct: true },
            { text: "Ganti model deteksi ke yang lebih sensitif", why: "Salah: model deteksi (HD16) bukan masalahnya — laporan yang terlambat membuat deteksi apa pun terlambat. Membeli mikroskop untuk orang yang butuh jam dinding." },
            { text: "Turunkan ambang alert agar wabah terdeteksi lebih cepat", why: "Salah: ambang tidak memperbaiki keterlambatan laporan. Alert yang cepat dari data yang terlambat tetap terlambat." },
          ],
        },
        {
          q: "Kenapa setiap alert harus dicatat beserta hasilnya (wabah nyata atau palsu)?",
          options: [
            { text: "Untuk arsip — agar ada yang bisa ditunjukkan saat audit", why: "Salah: arsip adalah manfaat sampingan. Alasan utamanya adalah ambang belajar dari umpan balik: tanpa catatan hasil, ambang tidak pernah dikalibrasi ulang." },
            { text: "Karena ambang hanya bisa dikalibrasi ulang dari umpan balik — tanpa itu, sistem tidak pernah belajar dari kesalahannya", why: "Tepat: PVP dan sensitivitas dihitung dari catatan ini. Sistem tanpa umpan balik adalah sistem yang mengulang kesalahan yang sama setiap musim.", correct: true },
            { text: "Karena petugas lapangan membutuhkannya untuk fogging", why: "Salah: fogging butuh alert dan lokasi, bukan catatan historis alert. Catatan hasil adalah untuk evaluasi sistem, bukan untuk respons lapangan." },
            { text: "Tidak perlu — yang penting alertnya cepat", why: "Salah: alert cepat yang selalu palsu membuat petugas berhenti merespons. Kecepatan tanpa umpan balik adalah jalan menuju sistem yang diabaikan." },
          ],
        },
        {
          q: "Puskesmas melapor tiap minggu tetapi tidak pernah menerima kabar balik. Apa yang akan terjadi?",
          options: [
            { text: "Tidak ada — pelaporan adalah kewajiban, mereka akan terus melapor", why: "Salah: pekerjaan yang tidak pernah dibalas akan ditinggalkan — bukan karena malas, melainkan karena rasional. Diseminasi adalah bahan bakar pelaporan." },
            { text: "Pelaporan akan layu: tanpa buletin, dashboard, atau umpan balik, pelapor berhenti melihat gunanya melapor", why: "Tepat: surveilans adalah sistem dua arah. Buletin mingguan yang kembali ke pelapor adalah yang menjaga completeness dan timeliness tetap hidup.", correct: true },
            { text: "Kualitas data meningkat — pelapor fokus mencatat tanpa distraksi", why: "Salah: tanpa umpan balik, pelapor tidak tahu apakah catatannya benar atau salah — kualitas justru memburuk diam-diam." },
            { text: "Sistem menjadi lebih cepat — satu arah selalu lebih cepat dari dua arah", why: "Salah: lebih cepat mengirim, tetapi lebih cepat mati. Kecepatan tanpa umpan balik adalah kecepatan menuju kehampaan data." },
          ],
        },
      ],
    },
  ],
};
