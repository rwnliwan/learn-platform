import type { V2Lesson } from "../lib/types";

export const bi28: V2Lesson = {
  slug: "bi28-bioinformatika-struktural",
  track: "Bioinformatika",
  module: "Proteomik & Multi-Omics",
  title: "BI28 — Bioinformatika Struktural: dari PDB ke Docking dan PPI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Struktur yang indah dengan pLDDT 40 — lukisan, bukan data",
      prose: [
        "Sebuah tim komputasional melaporkan 3 kandidat obat dari docking ke struktur protein target. Manajemen ingin langsung paten dan uji klinis. Bioinformatikawan tim itu menolak: kantong ikatan target punya pLDDT 55 — struktur tak terpercaya untuk docking presisi. Pose docking di atasnya bisa fiktif total.",
        "Ia menunjukkan angka-angkanya: alignment target ke template sepanjang 200 residu, 140 identik — identitas 70 persen, cakupan 90 persen — model yang sebenarnya layak. Tetapi model itu dibangun dari template yang berbeda dari yang dipakai tim docking, dan jaringan interaksi protein target menunjukkan 12 protein dengan 18 interaksi — derajat rata-rata 3,0, densitas 27,3 persen — yang berarti target itu hub dengan banyak mitra, bukan protein soliter. Docking tanpa konteks jaringan adalah separuh cerita.",
        "Lesson ini mengajarkan bioinformatika struktural: PDB, homology modelling, docking, dan jaringan interaksi protein (PPI). Setelah lesson ini kamu bisa: (1) membaca entri PDB dan menilai kualitas struktur; (2) menilai kelayakan homology modelling dari identitas dan cakupan; (3) menjelaskan funnel docking dan batas skornya; (4) menghitung metrik dasar jaringan PPI; (5) memutuskan kapan struktur cukup baik untuk desain — dan kapan tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Struktur sudah disinggung di track ini: BI2 menyebut PDB sebagai database kurasi, BI15 mengajarkan pLDDT AlphaFold dan funnel docking dalam satu skenario, BI16 memakai homologi untuk split data ML. Tidak ada lesson yang MENGAJARKAN bioinformatika struktural sebagai disiplin — pipeline homology modelling, penilaian kualitas model, docking sebagai sistem, dan jaringan PPI. Lesson ini membangun disiplin itu, dengan merujuk singgungan yang ada, bukan mengulanginya.",
      },
      reference: "Identitas 70 persen, cakupan 90 persen. Jaringan PPI: 12 node, 18 edge, derajat rata-rata 3,0, densitas 27,3 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai struktur protein seperti menilai data — dengan angka dan ambang.",
        "(1) Membaca entri PDB: metode, resolusi, R-factor, dan kelengkapan;",
        "(2) Menilai homology modelling dari identitas sekuens dan cakupan alignment;",
        "(3) Menjelaskan funnel docking: dari 10.000 senyawa ke 5 hit;",
        "(4) Menghitung derajat rata-rata dan densitas jaringan PPI;",
        "(5) Memutuskan kapan struktur layak untuk docking presisi — dan kapan harus berhenti.",
      ],
      tasks: [],
    },
    {
      id: "pdb",
      eyebrow: "Langkah 3 · Teori",
      title: "PDB: membaca struktur sebelum memakainya",
      prose: [
        "Protein Data Bank (PDB) adalah arsip struktur 3D protein, DNA, dan kompleksnya — ditentukan lewat kristalografi sinar-X, cryo-EM, atau NMR. Tiap entri punya identitas: kode 4 huruf, metode penentuan, resolusi, dan R-factor. Resolusi kristalografi di bawah 2,0 angstrom berarti atom terlihat tajam; di atas 3,0 angstrom berarti peta elektron kabur dan posisi rantai samping meragukan. R-factor di bawah 0,20 berarti model cocok dengan data difraksi; di atas 0,25 berarti curigai.",
        "Dua jebakan sebelum memakai struktur apa pun. Pertama, kelengkapan: banyak entri PDB kehilangan loop fleksibel yang tidak terlihat di peta elektron — loop yang hilang itu bisa persis kantong ikatan yang kamu incar. Kedua, kondisi kristal bukan kondisi sel: struktur yang dikristalkan dengan ligan, pada pH ekstrem, atau sebagai monomer padahal di sel ia dimer — semuanya mengubah bentuk yang kamu lihat. Aturan: baca header PDB dan makalah aslinya sebelum memakai koordinatnya.",
        "AlphaFold mengubah lanskap: hampir semua protein manusia kini punya prediksi struktur. Tetapi prediksi bukan eksperimen — pLDDT adalah skor kepercayaan per residu: di atas 90 andal, 70 sampai 90 hati-hati, di bawah 70 jangan untuk desain presisi (BI15). Struktur AlphaFold dengan pLDDT 40 di kantong ikatan adalah lukisan — indah dilihat, berbahaya dipakai. Untuk docking presisi, yang dibutuhkan bukan struktur yang indah, melainkan struktur yang terpercaya di wilayah yang dipakai.",
      ],
      tasks: [],
      note: {
        title: "Resolusi bukan kualitas tunggal",
        body: "Resolusi rendah (angka besar) tidak otomatis berarti struktur buruk — cryo-EM 3,5 angstrom pada kompleks besar bisa lebih informatif dari kristal 2,0 angstrom pada fragmen kecil. Yang dinilai adalah KESESUAIAN struktur dengan pertanyaanmu: apakah wilayah yang kamu pakai terdefinisi baik, dengan kepadatan elektron yang mendukungnya? Jawabannya ada di peta, bukan di satu angka.",
      },
      reference: "Resolusi di bawah 2,0 angstrom tajam; R-factor di bawah 0,20 cocok. pLDDT: di atas 90 andal, 70–90 hati-hati, di bawah 70 jangan untuk desain presisi.",
    },
    {
      id: "homology-docking",
      eyebrow: "Langkah 4 · Teori",
      title: "Homology modelling dan docking: dua pipeline, satu kejujuran",
      prose: [
        "Homology modelling membangun struktur target dari template yang sudah diketahui — dengan asumsi sekuens mirip berarti struktur mirip. Pipeline empat langkah: (1) cari template — BLAST target ke PDB; (2) alignment target-template — fondasi seluruh model; (3) bangun model — salin kerangka template, modelkan loop dan rantai samping; (4) validasi — Ramachandran plot, skor DOPE, dan perbandingan dengan data eksperimen bila ada.",
        "Ambang praktis yang dipakai di lesson ini: identitas di atas 50 persen — model biasanya andal untuk docking; 30 sampai 50 persen — zona senja, kerangka benar tetapi detail kantong meragukan; di bawah 30 persen — jangan untuk desain presisi. Cakupan sama pentingnya: identitas 70 persen pada cakupan 90 persen (contoh kita: 140 identik dari 200 residu, 180 tercakup) berarti model memakai hampir seluruh protein. Identitas 70 persen pada cakupan 40 persen berarti kamu hanya memodelkan separuh protein — dan separuh yang hilang bisa berisi kantongnya.",
        "Docking adalah funnel, bukan jawaban. Dari 10.000 senyawa, skor docking menyaring ke 100 teratas, uji in vitro menyaring ke 5 hit. Skor docking berkorelasi LEMAH dengan afinitas nyata (Kd eksperimental) — ia mengurutkan, bukan mengukur. Tiga kesalahan yang mematikan: docking ke struktur ber-pLDDT rendah; docking tanpa air dan fleksibilitas protein (rigid docking pada kantong yang bergerak); dan melaporkan skor terbaik sebagai 'obat' tanpa validasi in vitro. Aturan BI15 tetap berlaku: 'in silico hit' bukan obat.",
        "Jaringan interaksi protein (PPI) memberi konteks yang tidak dimiliki struktur tunggal. Node adalah protein, edge adalah interaksi yang terbukti eksperimental. Dua metrik dasar: derajat rata-rata sama dengan 2 dikali jumlah edge dibagi jumlah node — contoh kita: 2 dikali 18 dibagi 12 sama dengan 3,0. Densitas sama dengan 2 dikali edge dibagi (node dikali (node dikurangi 1)) — 36 dibagi 132 sama dengan 27,3 persen. Hub — protein berderajat tinggi — adalah target obat yang berpengaruh luas, tetapi juga berisiko efek samping luas. Docking ke hub tanpa membaca jaringannya adalah menembak tanpa melihat peta.",
      ],
      tasks: [],
      note: {
        title: "Zona senja 30–50 persen",
        body: "Zona senja bukan larangan — ia adalah peringatan. Model 40 persen identitas masih bisa benar kerangkanya dan berguna untuk memahami fungsi umum. Tetapi kantong ikatan — tempat obat bekerja — adalah wilayah paling variabel, dan di zona senja ia paling tidak terpercaya. Bila targetmu di zona senja, investasikan validasi eksperimental SEBELUM docking besar-besaran, bukan sesudahnya.",
      },
      reference: "Identitas: di atas 50 persen andal; 30–50 persen zona senja; di bawah 30 persen jangan untuk desain. Funnel: 10.000 → 100 → 5 hit.",
    },
    {
      id: "lab-struktural",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menilai model homologi dan jaringan PPI",
      prose: [
        "Lab ini membangun penilai model homologi dan jaringan PPI: dari panjang alignment, residu identik, dan residu tercakup — hitung identitas dan cakupan; dari node dan edge jaringan — hitung derajat rata-rata dan densitas.",
        "Hitung dulu di kepala. Identitas: 140 identik dibagi 200 residu alignment dikali 100 sama dengan 70 persen — di atas ambang 50 persen, model layak. Cakupan: 180 tercakup dibagi 200 dikali 100 sama dengan 90 persen — hampir seluruh protein tercakup. Derajat rata-rata: 2 dikali 18 dibagi 12 sama dengan 3,0 interaksi per protein. Densitas: 2 dikali 18 dibagi (12 dikali 11) sama dengan 36 dibagi 132 sama dengan 27,3 persen (tepatnya 27,2727 persen, dibulatkan satu desimal).",
        "Tugas lab: tulis fungsi yang menerima panjang alignment, residu identik, residu tercakup, jumlah node, dan jumlah edge — lalu mencetak empat angka: identitas_persen, cakupan_persen, derajat_rata, densitas_persen. Empat angka ini adalah kartu identitas sebuah model dan jaringannya — yang dibaca sebelum satu docking pun dijalankan.",
        "Setelah lolos, coba eksperimen: turunkan identitas menjadi 60 dari 200 (30 persen) dan lihat vonis berubah menjadi zona senja — lalu tanyakan: berapa anggaran validasi eksperimental yang kamu minta sebelum melanjutkan docking?",
      ],
      tasks: [
        { id: "t1", text: "Hitung identitas sekuens dan cakupan alignment" },
        { id: "t2", text: "Hitung derajat rata-rata jaringan PPI" },
        { id: "t3", text: "Hitung densitas jaringan PPI" },
      ],
      expected: "identitas_persen=70.0\ncakupan_persen=90.0\nderajat_rata=3.0\ndensitas_persen=27.3",
      hints: [
        "Identitas persen = identik dibagi panjang alignment, dikali 100.",
        "Cakupan persen = tercakup dibagi panjang alignment, dikali 100.",
        "Derajat rata-rata = 2 x edge dibagi node.",
        "Densitas persen = 2 x edge dibagi (node x (node - 1)), dikali 100, dibulatkan 1 desimal.",
      ],
      code: {
        starter: `# Penilai model homologi + jaringan PPI.\npanjang_alignment = 200\nidentik = 140\ntercakup = 180\nnode = 12\nedge = 18\n\n# TULIS KODEMU: hitung empat angka penilaian di bawah ini.\n# Cetak, per baris: identitas_persen, cakupan_persen,\n# derajat_rata, densitas_persen.\n\n\npenilai_struktural(panjang_alignment, identik, tercakup, node, edge)`,
        lockLines: 5,
        solution: `# Penilai model homologi + jaringan PPI.\npanjang_alignment = 200\nidentik = 140\ntercakup = 180\nnode = 12\nedge = 18\n\n\ndef penilai_struktural(panjang_alignment, identik, tercakup, node, edge):\n    identitas_persen = identik / panjang_alignment * 100\n    cakupan_persen = tercakup / panjang_alignment * 100\n    derajat_rata = 2 * edge / node\n    densitas_persen = round(2 * edge / (node * (node - 1)) * 100, 1)\n    print(f"identitas_persen={identitas_persen}")\n    print(f"cakupan_persen={cakupan_persen}")\n    print(f"derajat_rata={derajat_rata}")\n    print(f"densitas_persen={densitas_persen}")\n\n\npenilai_struktural(panjang_alignment, identik, tercakup, node, edge)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "identitas_persen=70.0", label: "Identitas 70 persen", msg: "140 / 200 x 100 = 70 persen. Di atas ambang 50 persen — model layak untuk docking." },
          { kind: "stdout_matches", task: "t1", pattern: "cakupan_persen=90.0", label: "Cakupan 90 persen", msg: "180 / 200 x 100 = 90 persen. Hampir seluruh protein tercakup — kantong kemungkinan ikut termodelkan." },
          { kind: "stdout_matches", task: "t2", pattern: "derajat_rata=3.0", label: "Derajat rata-rata 3,0", msg: "2 x 18 / 12 = 3,0 interaksi per protein." },
          { kind: "stdout_matches", task: "t3", pattern: "densitas_persen=27.3", label: "Densitas 27,3 persen", msg: "36 / 132 x 100 = 27,2727 persen, dibulatkan 27,3. Jaringan cukup padat — target berinteraksi luas." },
        ],
      },
      reference: "Identitas 70 persen, cakupan 90 persen, derajat rata-rata 3,0, densitas 27,3 persen.",
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 6 · Teori",
      title: "Keputusan: kapan struktur cukup baik?",
      prose: [
        "Keputusan memakai tiga pertanyaan. Pertama, apakah wilayah yang dipakai terpercaya — pLDDT di atas 70 di kantong, atau resolusi dan R-factor yang mendukung? Bila tidak, berhenti — docking apa pun di atasnya adalah judi komputasional. Kedua, apakah modelnya cukup — identitas di atas 50 persen dan cakupan di atas 80 persen? Bila di zona senja, validasi eksperimental dulu. Ketiga, apakah konteks jaringannya dipahami — target hub atau soliter, dan apa konsekuensi memblokirnya?",
        "Dua jebakan yang paling mahal. Jebakan pertama: memakai struktur AlphaFold ber-pLDDT rendah untuk virtual screening presisi — region tak terstruktur diprediksi sebagai 'bentuk', bukan kepastian (BI15). Jebakan kedua: melaporkan skor docking sebagai afinitas — skor mengurutkan, bukan mengukur; tanpa uji in vitro, kandidat adalah hipotesis. Keduanya berakhir sama: manajemen mengambil keputusan atas angka yang terlihat pasti tetapi tidak.",
        "Untuk bioinformatikawan, keterampilan yang paling berharga bukan menjalankan docking — tool melakukannya dalam hitungan menit — melainkan MENOLAK docking yang tidak layak dan menjelaskan penolakannya dengan angka. Penolakan yang disertai identitas 30 persen dan pLDDT 55 adalah keputusan ilmiah; penolakan tanpa angka adalah opini. Lesson ini memberimu angkanya.",
      ],
      tasks: [],
      note: {
        title: "Validasi adalah bagian dari komputasi",
        body: "Alur yang benar: validasi struktur → docking ulang → uji in vitro 100 senyawa → optimasi lead → hewan → klinik. Komputasi mempercepat penyaringan, bukan menghapus validasi. Tiap tahap funnel adalah kontrol — dan kontrol yang dilewati akan menagih biayanya di tahap berikutnya, dengan bunga.",
      },
      reference: "Tiga pertanyaan: wilayah terpercaya? model cukup? konteks jaringan dipahami? Bila satu jawaban tidak — berhenti atau validasi dulu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: tiga kandidat yang tidak jadi obat",
      prose: [
        "Kembali ke tim komputasional. Bioinformatikawan itu menunjukkan: kantong ikatan pLDDT 55, model homologi sebenarnya layak (identitas 70 persen, cakupan 90 persen) tetapi dari template berbeda — dan target adalah hub di jaringan PPI (derajat rata-rata 3,0, densitas 27,3 persen) sehingga memblokirnya berisiko efek samping luas. Tiga lampu merah dalam satu presentasi.",
        "Keputusan manajemen: tunda paten, validasi struktur kantong secara eksperimental, docking ulang ke struktur tervalidasi, dan uji in vitro 100 senyawa teratas sebelum bicara klinik. Enam bulan kemudian, satu dari tiga kandidat lolos in vitro — dua lainnya ternyata artefak pose fiktif. Biaya validasi: sebagian kecil dari biaya paten dan uji klinis yang hampir dikeluarkan untuk kandidat fiktif.",
        "Yang membuat keputusan ini benar: angka dibaca SEBELUM uang besar keluar, dan penolakan disertai jalur maju — bukan sekadar 'tidak'. Bioinformatikawan yang bisa mengatakan 'belum' dengan angka dan rencana adalah yang paling berharga di ruangan itu.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat mini-case ini berakhir baik. Pertama, kualitas struktur diperiksa di wilayah yang dipakai (kantong), bukan secara global. Kedua, konteks jaringan dibaca sebelum target dipilih. Ketiga, validasi diposisikan sebagai penghemat biaya — bukan penghambat. Urutan ini — struktur, jaringan, validasi — berlaku untuk setiap proyek desain obat komputasional.",
      },
      reference: "Satu dari tiga kandidat lolos in vitro; dua artefak pose fiktif. Validasi menghemat biaya paten + klinik untuk kandidat fiktif.",
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
        "PDB: resolusi di bawah 2,0 angstrom tajam; R-factor di bawah 0,20 cocok; pLDDT di atas 90 andal.",
        "Homologi: identitas di atas 50 persen andal; 30–50 persen zona senja; cakupan sama pentingnya.",
        "Docking: funnel 10.000 → 100 → 5 hit; skor mengurutkan, bukan mengukur.",
        "Lab: identitas 70 persen, cakupan 90 persen, derajat rata-rata 3,0, densitas 27,3 persen.",
        "Hub berderajat tinggi: berpengaruh luas, berisiko efek samping luas.",
      ],
      next: { label: "BI29 — ATAC-seq dan Genomik 3D: Kromatin Terbuka dan Hi-C", href: "/v2/learn/bi29-atac-hic" },
      quiz: [
        {
          q: "Alignment 200 residu, 140 identik, 180 tercakup. Jaringan PPI 12 node, 18 edge. Berapa identitas, cakupan, derajat rata-rata, dan densitas?",
          options: [
            { text: "70 persen; 90 persen; 3,0; 27,3 persen", why: "Tepat: 140/200 = 70 persen; 180/200 = 90 persen; 2x18/12 = 3,0; 36/132 = 27,3 persen.", correct: true },
            { text: "70 persen; 90 persen; 1,5; 13,6 persen", why: "Salah: derajat rata-rata memakai 2x edge (tiap edge menyentuh 2 node) — 18/12 = 1,5 melupakan faktor 2." },
            { text: "90 persen; 70 persen; 3,0; 27,3 persen", why: "Salah: identitas dan cakupan tertukar — 140 identik dari 200 adalah identitas 70 persen, bukan cakupan." },
            { text: "70 persen; 90 persen; 3,0; 54,5 persen", why: "Salah: densitas 36/132 = 27,3 persen — 54,5 persen adalah 36/66, pembagi yang salah (node x (node-1) = 132, bukan 66)." },
          ],
        },
        {
          q: "Struktur AlphaFold targetmu punya pLDDT 55 di kantong ikatan. Apa keputusan yang benar untuk docking presisi?",
          options: [
            { text: "Lanjutkan — pLDDT 55 masih di atas 50", why: "Salah: ambang docking presisi adalah pLDDT di atas 70 di wilayah yang dipakai. 55 berarti struktur tak terpercaya di kantong." },
            { text: "Berhenti dan validasi struktur kantong dulu — pose docking di atas wilayah tak terpercaya bisa fiktif total", why: "Tepat: pLDDT di bawah 70 berarti jangan untuk desain presisi. Validasi dulu, docking kemudian.", correct: true },
            { text: "Docking saja — skor docking akan mengoreksi struktur yang buruk", why: "Salah: skor docking mengurutkan pose pada struktur yang DIBERIKAN — ia tidak memperbaiki struktur yang salah." },
            { text: "Ganti target — pLDDT 55 berarti protein tidak bisa diobati", why: "Salah: pLDDT rendah berarti PREDIKSI tidak terpercaya di wilayah itu — bukan proteinnya tidak bisa diobati." },
          ],
        },
        {
          q: "Apa arti funnel docking 10.000 → 100 → 5, dan apa batas skor docking?",
          options: [
            { text: "Skor docking mengukur afinitas nyata (Kd) — 5 teratas adalah obat", why: "Salah: skor berkorelasi lemah dengan Kd. 5 hit adalah hipotesis yang butuh uji in vitro, bukan obat." },
            { text: "Skor docking mengurutkan kandidat untuk disaring; 5 hit butuh validasi in vitro sebelum disebut kandidat obat", why: "Tepat: komputasi mempercepat penyaringan, bukan melompati validasi.", correct: true },
            { text: "Funnel berarti 9.995 senyawa terbukti tidak aktif", why: "Salah: funnel menyaring berdasarkan skor — senyawa yang tersaring belum terbukti tidak aktif, hanya tidak terpilih." },
            { text: "Funnel hanya berlaku untuk docking rigid, bukan fleksibel", why: "Salah: funnel adalah logika penyaringan bertahap — berlaku untuk semua jenis docking." },
          ],
        },
        {
          q: "Model homologi identitas 40 persen, cakupan 95 persen. Apa vonisnya?",
          options: [
            { text: "Andal untuk docking — cakupan 95 persen menutupi identitas rendah", why: "Salah: cakupan tinggi tidak menolong identitas rendah — 40 persen adalah zona senja, kerangka boleh jadi benar tetapi kantong meragukan." },
            { text: "Zona senja — kerangka mungkin benar, kantong meragukan; validasi eksperimental sebelum docking besar", why: "Tepat: 30–50 persen adalah zona senja. Cakupan bagus berarti modelnya lengkap — tetapi lengkap bukan berarti tepat di kantong.", correct: true },
            { text: "Tidak berguna sama sekali — buang modelnya", why: "Salah: model zona senja masih berguna untuk fungsi umum dan hipotesis — hanya tidak untuk desain presisi tanpa validasi." },
            { text: "Andal — identitas di atas 30 persen sudah cukup", why: "Salah: 30 persen adalah batas bawah zona senja, bukan ambang andal. Ambang andal adalah di atas 50 persen." },
          ],
        },
        {
          q: "Targetmu adalah hub di jaringan PPI (derajat tinggi). Apa implikasinya untuk desain obat?",
          options: [
            { text: "Hub selalu target terbaik — pengaruhnya paling luas", why: "Salah: pengaruh luas berarti efek samping luas juga. Hub adalah pedang bermata dua." },
            { text: "Hub berpengaruh luas sehingga berpotensi efektif — tetapi berisiko efek samping luas; baca jaringannya sebelum memilih", why: "Tepat: derajat tinggi berarti banyak mitra — memblokirnya mengguncang banyak jalur.", correct: true },
            { text: "Hub harus dihindari — tidak ada obat yang menarget hub", why: "Salah: banyak obat menarget hub — dengan pemahaman risiko. Yang dilarang adalah menarget hub TANPA membaca jaringannya." },
            { text: "Derajat jaringan tidak relevan — yang penting hanya struktur kantong", why: "Salah: struktur menjawab 'bisakah mengikat', jaringan menjawab 'apa yang terjadi bila terikat'. Keduanya dibutuhkan." },
          ],
        },
      ],
    },
  ],
};
