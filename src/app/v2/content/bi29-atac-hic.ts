import type { V2Lesson } from "../lib/types";

export const bi29: V2Lesson = {
  slug: "bi29-atac-hic",
  track: "Bioinformatika",
  module: "Epigenomik",
  title: "BI29 — ATAC-seq dan Genomik 3D: Kromatin Terbuka dan Hi-C",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Gen yang sama, dua sel yang berbeda — jawabannya di lipatan",
      prose: [
        "Dua sel punya genom yang identik — huruf DNA yang sama persis. Tetapi sel yang satu mengekspresikan gen X, sel yang lain tidak. RNA-seq menunjukkan perbedaannya, tetapi tidak menjelaskan MENGAPA. Jawabannya ada di dua lapisan: kromatin mana yang terbuka (ATAC-seq) dan bagaimana genom terlipat dalam 3D (Hi-C).",
        "ATAC-seq sampel itu menunjukkan FRiP 15 persen — 4,5 juta dari 30 juta read berada di dalam peak — dan TSS enrichment 8,2. Angka QC yang sehat: kromatin terbuka terpetakan dengan bersih. Hi-C menunjukkan 120 juta kontak: 96 juta cis (80 persen) dan 24 juta trans (20 persen) — pola yang diharapkan untuk genom yang terlipat dalam teritori kromosom. Dan satu enhancer yang berjarak 500 ribu basa dari gen X ternyata berinteraksi dengannya dalam 3D — penjelasan yang tidak pernah terlihat dari sekuens linear.",
        "Lesson ini mengajarkan ATAC-seq dan genomik 3D: aksesibilitas kromatin, QC, matriks kontak Hi-C, kompartemen, TAD, dan loop. Setelah lesson ini kamu bisa: (1) menjelaskan cara kerja ATAC-seq dan membaca QC-nya; (2) menghitung FRiP dan rasio cis/trans; (3) menjelaskan kompartemen A/B, TAD, dan loop dari matriks Hi-C; (4) menghubungkan enhancer ke gen target lewat kontak 3D; (5) memutuskan kapan data linear tidak cukup dan 3D dibutuhkan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BI13 menyebut ATAC-seq dalam satu baris definisi ('transposase menandai kromatin TERBUKA') dan mengajarkan ChIP-seq serta state kromatin ChromHMM; BI26 memakai anotasi puncak ATAC-seq sebagai contoh GenomicRanges. Hi-C tidak pernah muncul di track ini (nol hit). Tidak ada lesson yang MENGAJARKAN analisis ATAC-seq (QC, peak, footprint) atau genomik 3D (matriks kontak, kompartemen, TAD, loop). Lesson ini membangun keduanya dari nol.",
      },
      reference: "FRiP 15 persen (4,5 dari 30 juta read); TSS enrichment 8,2. Hi-C: 120 juta kontak, cis 80 persen, trans 20 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca peta aksesibilitas dan lipatan genom — bukan hanya hurufnya.",
        "(1) Menjelaskan cara kerja ATAC-seq: transposase, fragmentasi, dan peak;",
        "(2) Menghitung dan menafsirkan FRiP dan TSS enrichment;",
        "(3) Menjelaskan matriks kontak Hi-C dan rasio cis/trans;",
        "(4) Membedakan kompartemen A/B, TAD, dan loop — dan apa yang dibaca dari masing-masing;",
        "(5) Menghubungkan enhancer ke gen target lewat bukti kontak 3D.",
      ],
      tasks: [],
    },
    {
      id: "atac",
      eyebrow: "Langkah 3 · Teori",
      title: "ATAC-seq: peta kromatin terbuka tanpa antibodi",
      prose: [
        "ATAC-seq memakai Tn5 transposase — enzim yang memotong DNA dan sekaligus menempelkan adaptor sekuensing — tetapi hanya di wilayah kromatin TERBUKA, tempat transposase bisa masuk. Wilayah tertutup (heterokromatin padat) tidak terpotong. Hasilnya: fragment yang berasal dari wilayah terbuka, yang setelah disequensing dan dipetakan menjadi peak — peta aksesibilitas genom.",
        "Keunggulannya dibanding ChIP-seq dan DNase-seq: tanpa antibodi (tidak ada masalah spesifisitas antibodi), butuh sel sedikit (ribuan, bukan jutaan — bahkan sel tunggal), dan protokolnya cepat. Kelemahannya: ia mengukur AKSESIBILITAS, bukan identitas — peak ATAC-seq memberitahu 'wilayah ini terbuka', bukan 'faktor transkripsi apa yang terikat di sini'. Untuk identitas, butuh footprint (pola perlindungan di dalam peak) atau ChIP-seq faktor spesifik.",
        "Dua angka QC yang menentukan apakah eksperimenmu layak dianalisis. FRiP — fraction of reads in peaks — adalah proporsi read yang jatuh di dalam peak: contoh kita 4,5 juta dari 30 juta sama dengan 15 persen. FRiP di bawah 5 persen patut dicurigai — sinyal mungkin tenggelam dalam noise — TETAPI ambang ini bergantung pada protokol, organisme, dan jenis sel: library dari sel langka atau protokol yang berbeda bisa sah di bawah 5 persen; bandingkan dengan kontrol dan replikat, bukan hanya ambang. Antibodi tidak ada di sini, tetapi transposase yang memotong di mana-mana adalah masalah yang sama. TSS enrichment mengukur penumpukan read di sekitar transcription start site: 8,2 berarti read 8,2 kali lebih padat di TSS dibanding latar — TSS enrichment di bawah 5 patut dicurigai, dengan catatan yang sama: ambang bergantung pada protokol.",
        "Tiga artefak yang harus dikenali. Pertama, peak mitokondria: DNA mitokondria sangat terbuka dan bisa menyedot 20 sampai 50 persen read — filter sebelum analisis. Kedua, fragment pendek vs panjang: fragment di bawah 100 bp berasal dari wilayah bebas nukleosom; fragment 180 sampai 247 bp membungkus satu nukleosom — distribusi panjang fragment adalah sidik jari kualitas library. Ketiga, duplikat PCR: seperti biasa, hapus sebelum peak calling — atau peak tertinggimu adalah artefak amplifikasi.",
      ],
      tasks: [],
      note: {
        title: "ATAC-seq bukan ChIP-seq yang lebih murah",
        body: "Godaan umum: memakai ATAC-seq sebagai pengganti ChIP-seq karena lebih mudah. Itu salah kategori: ChIP-seq menjawab 'di mana protein X terikat', ATAC-seq menjawab 'di mana kromatin terbuka'. Keduanya komplementer — ATAC-seq menemukan kandidat enhancer, ChIP-seq memastikan siapa yang mengikatnya. Memakai satu untuk pertanyaan yang lain adalah menjawab pertanyaan yang salah dengan data yang benar.\n\nPreprocessing sebelum QC (yang tidak terlihat di angka): ATAC-seq — saring read mitokondria, buang duplikat PCR, dan geser posisi read (+4/-5 basa, koreksi Tn5) sebelum peak calling (misalnya MACS2); normalisasi antar-sampel memakai jumlah read di peak atau metode kuantil, bukan total read mentah. Hi-C — normalisasi matriks dengan ICE atau Knight-Ruiz (KR) untuk menghilangkan bias cakupan antar-bin, dan saring bin ber-cakupan rendah sebelum memanggil kompartemen, TAD, atau loop. QC yang dibaca dari data yang belum dinormalisasi adalah QC yang menipu.",
      },
      reference: "FRiP 15 persen; TSS enrichment 8,2. Artefak: read mitokondria, distribusi panjang fragment, duplikat PCR.",
    },
    {
      id: "hic",
      eyebrow: "Langkah 4 · Teori",
      title: "Hi-C: genom sebagai matriks kontak",
      prose: [
        "Hi-C mengukur kedekatan fisik DNA dalam inti sel: DNA dipotong, ujung yang berdekatan dalam 3D diligasi, lalu disequensing — tiap read pair adalah bukti dua lokus yang berdekatan di ruang, berapa pun jaraknya di sekuens linear. Hasilnya adalah matriks kontak: baris dan kolom adalah bin genom (misalnya 10 kb), isi sel adalah jumlah kontak. Matriks ini adalah peta lipatan genom.",
        "Tiga struktur yang dibaca dari matriks. KOMPARTEMEN A/B: pada resolusi kasar (100 kb sampai 1 Mb), genom terbagi dua kompartemen — A aktif (eukromatin, gen aktif) dan B tidak aktif (heterokromatin). Kompartemen terlihat sebagai pola kotak-kotak (plaid) di matriks: A berinteraksi dengan A, B dengan B. TAD — topologically associating domain — adalah blok 100 kb sampai 1 Mb di mana kontak di dalam blok jauh lebih padat dari kontak antar-blok: gen dan enhancer-nya biasanya berada dalam satu TAD. Batas TAD bersifat PROBABILISTIK, bukan absolut: insulasi bervariasi antar sel dan kondisi, dan batasnya bisa 'bocor' — dua gen dalam satu TAD lebih mungkin berinteraksi, tetapi batas TAD bukan tembok. LOOP adalah kontak titik-ke-titik: enhancer dan promoter yang berinteraksi, terlihat sebagai titik terang di luar diagonal.",
        "Rasio cis/trans adalah pemeriksaan kewarasan pertama. Kontak cis (dalam kromosom yang sama) seharusnya mendominasi: contoh kita 96 juta dari 120 juta sama dengan 80 persen cis, 20 persen trans. Trans di atas 40 persen PATUT DICURIGAI — kontaminasi ligasi antar-molekul atau pemetaan yang buruk adalah kemungkinan, bukan vonis: ambang ini bergantung pada organisme, library, dan protokol; bandingkan dengan replikat dan kontrol sebelum menyimpulkan. Peluruhan kontak terhadap jarak adalah yang kedua: kontak menurun dengan jarak linear — bila tidak, matriksmu bukan lipatan, melainkan noise.",
        "Yang membuat Hi-C penting untuk biologi: ia menjawab pertanyaan yang tidak bisa dijawab data linear. Enhancer 500 kb dari gennya — yang terlihat tidak berhubungan di sekuens — ternyata ber-loop ke promoter gen itu. Varian GWAS di daerah non-coding yang 'tidak mengenai gen apa pun' ternyata berada di enhancer yang ber-loop ke gen penyebab penyakit. Tanpa 3D, keduanya tidak terlihat. Aturan praktis: bila pertanyaanmu melibatkan regulasi jarak jauh, data linear saja tidak cukup.",
      ],
      tasks: [],
      note: {
        title: "Resolusi adalah biaya",
        body: "Resolusi Hi-C ditentukan kedalaman sekuensing: matriks 10 kb butuh miliaran read; matriks 1 Mb butuh jauh lebih sedikit. Jangan meminta loop 5 kb dari data yang hanya cukup untuk kompartemen 1 Mb — itu seperti meminta nomor rumah dari peta provinsi. Tentukan struktur yang dicari DULU (kompartemen, TAD, atau loop), lalu hitung kedalaman yang dibutuhkan.",
      },
      reference: "Cis 80 persen, trans 20 persen. Kompartemen A/B, TAD 100 kb–1 Mb, loop enhancer-promoter.",
    },
    {
      id: "lab-atac-hic",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: QC ATAC-seq dan rasio kontak Hi-C",
      prose: [
        "Lab ini membangun pemeriksa QC ATAC-seq dan Hi-C: dari total read, read di dalam peak, kontak cis, dan kontak trans — hitung FRiP, total kontak, persen cis, dan persen trans.",
        "Hitung dulu di kepala. FRiP: 4,5 juta dibagi 30 juta dikali 100 sama dengan 15 persen — sehat, di atas ambang 5 persen. Total kontak: 96 juta cis ditambah 24 juta trans sama dengan 120 juta. Persen cis: 96 dibagi 120 dikali 100 sama dengan 80 persen. Persen trans: 24 dibagi 120 dikali 100 sama dengan 20 persen — di bawah ambang curiga 40 persen (ambang yang bergantung pada protokol).",
        "Tugas lab: tulis fungsi yang menerima total read, read di peak, kontak cis, dan kontak trans — lalu mencetak empat angka: frip_persen, total_kontak, cis_persen, trans_persen. Empat angka ini adalah pemeriksaan kewarasan pertama sebelum analisis apa pun — yang gagal di sini tidak dilanjutkan ke peak calling atau pemanggilan loop.",
        "Setelah lolos, coba eksperimen: turunkan read di peak menjadi 1,2 juta (FRiP 4 persen) dan lihat vonis berubah menjadi gagal QC — lalu tanyakan: apakah kamu mengulang library prep, atau memaksakan analisis atas data yang tenggelam dalam noise?",
      ],
      tasks: [
        { id: "t1", text: "Hitung FRiP ATAC-seq" },
        { id: "t2", text: "Hitung total kontak Hi-C" },
        { id: "t3", text: "Hitung persen cis dan persen trans" },
      ],
      expected: "frip_persen=15.0\ntotal_kontak=120000000\ncis_persen=80.0\ntrans_persen=20.0",
      hints: [
        "FRiP persen = read di peak dibagi total read, dikali 100.",
        "Total kontak = cis ditambah trans.",
        "Persen cis = cis dibagi total kontak, dikali 100.",
        "Gunakan angka mentah (juta) — 4,5 dan 30, atau 4.500.000 dan 30.000.000, hasilnya sama.",
      ],
      code: {
        starter: `# Pemeriksa QC ATAC-seq + Hi-C.\ntotal_read = 30000000\nread_di_peak = 4500000\nkontak_cis = 96000000\nkontak_trans = 24000000\n\n# TULIS KODEMU: hitung empat angka QC di bawah ini.\n# Cetak, per baris: frip_persen, total_kontak, cis_persen,\n# trans_persen.\n\n\npemeriksa_qc(total_read, read_di_peak, kontak_cis, kontak_trans)`,
        lockLines: 4,
        solution: `# Pemeriksa QC ATAC-seq + Hi-C.\ntotal_read = 30000000\nread_di_peak = 4500000\nkontak_cis = 96000000\nkontak_trans = 24000000\n\n\ndef pemeriksa_qc(total_read, read_di_peak, kontak_cis, kontak_trans):\n    frip_persen = read_di_peak / total_read * 100\n    total_kontak = kontak_cis + kontak_trans\n    cis_persen = kontak_cis / total_kontak * 100\n    trans_persen = kontak_trans / total_kontak * 100\n    print(f"frip_persen={frip_persen}")\n    print(f"total_kontak={total_kontak}")\n    print(f"cis_persen={cis_persen}")\n    print(f"trans_persen={trans_persen}")\n\n\npemeriksa_qc(total_read, read_di_peak, kontak_cis, kontak_trans)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "frip_persen=15.0", label: "FRiP 15 persen", msg: "4,5 / 30 x 100 = 15 persen. Sehat — di atas ambang 5 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "total_kontak=120000000", label: "Total kontak 120 juta", msg: "96 + 24 = 120 juta kontak." },
          { kind: "stdout_matches", task: "t3", pattern: "cis_persen=80.0", label: "Cis 80 persen", msg: "96 / 120 x 100 = 80 persen. Dominan cis — sesuai teritori kromosom." },
          { kind: "stdout_matches", task: "t3", pattern: "trans_persen=20.0", label: "Trans 20 persen", msg: "24 / 120 x 100 = 20 persen. Normal — di bawah ambang curiga 40 persen." },
        ],
      },
      reference: "FRiP 15 persen; total kontak 120 juta; cis 80 persen; trans 20 persen.",
    },
    {
      id: "menghubungkan",
      eyebrow: "Langkah 6 · Teori",
      title: "Menghubungkan enhancer ke gen: bukti 3D",
      prose: [
        "Alur kerja yang menggabungkan keduanya: (1) ATAC-seq menemukan wilayah terbuka — kandidat enhancer; (2) RNA-seq menunjukkan gen mana yang berubah; (3) Hi-C menunjukkan enhancer mana yang ber-loop ke promoter gen mana — menghubungkan kandidat ke target. Tanpa langkah ketiga, enhancer dan gen hanya berdekatan di daftar — dengan langkah ketiga, keduanya terhubung oleh bukti fisik.",
        "Contoh nyata dari cerita pembuka: enhancer 500 kb dari gen X terbuka hanya di sel yang mengekspresikan X (ATAC-seq), dan loop Hi-C menghubungkan enhancer itu ke promoter X hanya di sel yang sama. Dua bukti independen — aksesibilitas dan kontak — yang sama-sama spesifik sel. Itulah standar bukti yang meyakinkan: bukan satu data, melainkan dua data yang bercerita sama.",
        "Tiga jebakan. Pertama, kedekatan linear bukan bukti: enhancer biasanya mengatur gen TERDEKAT, tetapi 'biasanya' bukan 'selalu' — sekitar 30 persen enhancer melewati gen terdekat menuju gen yang lebih jauh (angka ilustrasi dari literatur — persentasenya bervariasi menurut jaringan dan metode; jangan jadikan patokan tetap). Kedua, korelasi aksesibilitas bukan kausalitas: enhancer terbuka saat gen aktif bisa berarti enhancer mengaktifkan gen — atau gen aktif membuka kromatin di sekitarnya. Pembuktian kausal butuh perturbasi (CRISPRi pada enhancer). Ketiga, TAD boundary: enhancer hampir tidak pernah melewati batas TAD — bila loop yang kamu klaim melompati batas TAD, curigai artefak.",
      ],
      tasks: [],
      note: {
        title: "Satu TAD, satu cerita",
        body: "Aturan praktis yang menyelamatkan banyak analisis: gen dan enhancer-nya hampir selalu berada dalam satu TAD yang sama. Bila kandidat enhancer dan gen target berada di TAD berbeda, kemungkinan besar hubungan itu salah — atau TAD boundary-nya perlu diperiksa ulang. TAD adalah unit regulasi; menghormatinya menghemat banyak jalan buntu.",
      },
      reference: "Alur: ATAC (kandidat) + RNA (target) + Hi-C (bukti loop). Enhancer melewati gen terdekat ~30 persen (ilustrasi, bervariasi menurut jaringan); jarang melewati batas TAD — yang bersifat probabilistik, bukan absolut.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: varian GWAS yang tidak mengenai gen apa pun",
      prose: [
        "Sebuah varian GWAS terkait diabetes terletak di daerah non-coding — 500 kb dari gen terdekat — dan selama dua tahun tidak ada yang tahu cara kerjanya. Tim multi-omics memeriksa: ATAC-seq menunjukkan wilayah itu terbuka hanya di sel beta pankreas; Hi-C menunjukkan loop dari wilayah itu ke promoter gen pengatur insulin; CRISPRi pada enhancer itu menurunkan ekspresi gen tersebut 60 persen.",
        "Varian itu berada di dalam enhancer — mengubah afinitas ikatan faktor transkripsi, melemahkan loop, menurunkan ekspresi gen. Tanpa data 3D, varian itu tetap 'tidak mengenai gen apa pun' selamanya. Dengan data 3D, ia menjadi mekanisme penyakit yang bisa diuji — dan target terapi yang bisa dikejar.",
        "Tiga hal yang membuat kasus ini berhasil. Pertama, pertanyaan yang tepat: bukan 'gen apa yang dekat', melainkan 'gen apa yang terhubung'. Kedua, dua bukti independen (ATAC + Hi-C) sebelum klaim. Ketiga, validasi kausal (CRISPRi) sebelum kesimpulan. Data 3D tidak menggantikan validasi — ia menunjukkan KE MANA validasi harus diarahkan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: sebagian besar varian GWAS berada di daerah non-coding — dan tanpa genomik 3D, mereka tidak bisa ditafsirkan. ATAC-seq dan Hi-C adalah alat yang mengubah 'varian tanpa gen' menjadi 'varian dengan mekanisme'. Bila kamu bekerja dengan GWAS, kedua data ini bukan pelengkap — melainkan syarat.",
      },
      reference: "Enhancer 500 kb dari gen; loop ke promoter; CRISPRi menurunkan ekspresi 60 persen. Varian non-coding menjadi mekanisme.",
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
        "ATAC-seq: Tn5 memotong kromatin terbuka — tanpa antibodi, sel sedikit.",
        "QC: FRiP 15 persen; TSS enrichment 8,2; artefak mitokondria dan duplikat.",
        "Hi-C: matriks kontak; cis 80 persen, trans 20 persen; kompartemen, TAD, loop.",
        "Lab: FRiP 15 persen; total kontak 120 juta; cis 80 persen; trans 20 persen.",
        "Enhancer ke gen: ATAC + RNA + Hi-C, lalu validasi CRISPRi.",
      ],
      next: { label: "BI30 — Platform Galaxy: Analisis Genomik Tanpa Baris Perintah", href: "/v2/learn/bi30-galaxy" },
      quiz: [
        {
          q: "ATAC-seq: 30 juta read, 4,5 juta di dalam peak. Hi-C: 96 juta kontak cis, 24 juta trans. Berapa FRiP, total kontak, cis, dan trans?",
          options: [
            { text: "FRiP 15 persen; total 120 juta; cis 80 persen; trans 20 persen", why: "Tepat: 4,5/30 = 15 persen; 96+24 = 120 juta; 96/120 = 80 persen; 24/120 = 20 persen.", correct: true },
            { text: "FRiP 6,7 persen; total 120 juta; cis 80 persen; trans 20 persen", why: "Salah: 6,7 persen adalah 30/4,5 — terbalik. FRiP adalah read di peak DIBAGI total." },
            { text: "FRiP 15 persen; total 72 juta; cis 80 persen; trans 20 persen", why: "Salah: total kontak adalah 96 + 24 = 120 juta, bukan 96 - 24." },
            { text: "FRiP 15 persen; total 120 juta; cis 20 persen; trans 80 persen", why: "Salah: cis dan trans tertukar — cis (dalam kromosom sama) yang mendominasi, 80 persen." },
          ],
        },
        {
          q: "Apa yang diukur ATAC-seq — dan apa yang TIDAK diukurnya?",
          options: [
            { text: "Mengukur aksesibilitas kromatin (wilayah terbuka); tidak mengidentifikasi faktor transkripsi apa yang terikat", why: "Tepat: ATAC-seq menemukan kandidat enhancer; identitas pengikatnya butuh footprint atau ChIP-seq.", correct: true },
            { text: "Mengukur di mana protein X terikat — sama seperti ChIP-seq", why: "Salah: itu ChIP-seq. ATAC-seq tanpa antibodi tidak tahu protein apa yang terikat." },
            { text: "Mengukur urutan DNA — sama seperti WGS", why: "Salah: ATAC-seq mengukur keterbukaan, bukan urutan. Fragmentnya berasal dari wilayah terbuka saja." },
            { text: "Mengukur ekspresi gen — sama seperti RNA-seq", why: "Salah: ekspresi diukur RNA-seq. ATAC-seq mengukur aksesibilitas — yang mendahului ekspresi, bukan ekspresinya." },
          ],
        },
        {
          q: "Hi-C menunjukkan trans 45 persen. Apa vonis yang benar?",
          options: [
            { text: "Normal — trans memang mendominasi", why: "Salah: cis yang seharusnya mendominasi (sekitar 80 persen). Trans 45 persen berarti ada masalah." },
            { text: "Curigai kontaminasi ligasi atau pemetaan buruk — periksa library sebelum analisis lanjut", why: "Tepat: trans di atas 40 persen adalah sinyal masalah, bukan biologi.", correct: true },
            { text: "Bagus — banyak kontak trans berarti banyak interaksi antar-kromosom yang menarik", why: "Salah: interaksi trans memang ada, tetapi 45 persen jauh di atas yang diharapkan — kemungkinan besar artefak." },
            { text: "Abaikan rasio — yang penting jumlah total kontak", why: "Salah: rasio cis/trans adalah pemeriksaan kewarasan pertama. Total besar dengan rasio salah tetap data buruk." },
          ],
        },
        {
          q: "Enhancer 500 kb dari gen X ber-loop ke promoter X. Apa yang bisa dan tidak bisa disimpulkan?",
          options: [
            { text: "Bisa disimpulkan enhancer mengatur X; tidak perlu validasi", why: "Salah: loop adalah bukti kontak, bukan bukti kausal. Validasi CRISPRi tetap dibutuhkan." },
            { text: "Loop adalah bukti kontak fisik yang menghubungkan kandidat ke target — tetapi kausalitas butuh perturbasi (CRISPRi)", why: "Tepat: 3D memberi bukti hubungan; kausalitas dibuktikan dengan mematikan enhancer dan melihat ekspresi.", correct: true },
            { text: "Tidak bisa disimpulkan apa-apa — 500 kb terlalu jauh", why: "Salah: jarak linear tidak menentukan — loop 3D-lah yang menentukan. Enhancer 500 kb yang ber-loop adalah bukti, bukan keraguan." },
            { text: "Bisa disimpulkan gen terdekatlah yang diatur enhancer itu", why: "Salah: sekitar 30 persen enhancer melewati gen terdekat (angka ilustrasi, bervariasi menurut jaringan). Yang diatur adalah gen yang terhubung loop, bukan yang terdekat." },
          ],
        },
        {
          q: "FRiP 4 persen dan TSS enrichment 3,1. Apa keputusan yang benar?",
          options: [
            { text: "Lanjutkan analisis — angkanya masih bisa dipakai", why: "Salah: FRiP di bawah 5 persen dan TSS di bawah 5 berarti sinyal tenggelam dalam noise." },
            { text: "Gagal QC — ulangi library prep; memaksakan analisis berarti menganalisis noise", why: "Tepat: kedua metrik di bawah ambang adalah vonis gagal QC, bukan tantangan analisis.", correct: true },
            { text: "Naikkan ambang peak calling agar peak lebih banyak", why: "Salah: mengubah ambang untuk meloloskan data buruk adalah manipulasi — peak tambahan itu noise." },
            { text: "Buang data ATAC dan pakai ChIP-seq saja", why: "Salah: ChIP-seq menjawab pertanyaan berbeda. Keputusan yang benar adalah ulangi ATAC, bukan ganti pertanyaan." },
          ],
        },
      ],
    },
  ],
};
