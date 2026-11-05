import type { V2Lesson } from "../lib/types";

export const bi2: V2Lesson = {
  slug: "bi2-database",
  track: "Bioinformatika",
  module: "Fondasi",
  title: "BI2 · NCBI, Ensembl, UniProt: Perpustakaan Data Biologi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Gen yang punya 5 nama",
      prose: [
        "Gen p53 — penjaga genom terkenal — punya nama resmi TP53, nama lama p53, ID Ensembl ENSG00000141510, ID UniProt P04637, dan ID NCBI Gene 7157. Analis junior menggabungkan dua dataset: satu pakai “p53”, satu pakai “TP53”. Hasilnya: gen terhitung dua kali, analisis berantakan.",
        "Database biologi lahir untuk kekacauan penamaan ini. Tapi ada belasan database besar, masing-masing dengan filosofi beda: arsip mentah di lantai 1, pengetahuan kurasi di lantai 2, katalog variasi di lantai 3.",
        "Twist-nya: database yang resmi pun bisa bertentangan. RefSeq dan Ensembl mendefinisikan transkrip berbeda untuk gen yang sama, dan ClinVar pernah mengubah klasifikasi varian dari patogenik menjadi tidak pasti setelah bukti baru masuk — mengubah rekomendasi klinis pasien. Database bukan kitab suci; ia adalah konsensus sementara dengan jejak versi.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 3 ID stabil untuk gen p53/TP53 manusia" },
        { id: "t2", text: "Jelaskan kenapa nama gen tidak boleh jadi identifier" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira nama gen cukup sebagai identifier. Nama berubah (p53 → TP53), ambigu antar spesies — trp53 adalah gen tikus, bukan manusia! Nama untuk manusia, ID stabil untuk mesin.",
      },
      reference: "Nama untuk manusia, ID stabil (aksesi) untuk mesin.",
    },
    {
      id: "lab-id",
      eyebrow: "Langkah 2 · Lab",
      title: "Simulasi query ID gen",
      prose: [
        "Kamu mensimulasikan mapping nama → ID stabil seperti yang dilakukan NCBI Gene. Perhatikan apa yang terjadi pada query ambigu seperti “p53” dan “trp53” tanpa ID spesies.",
        "Di dunia nyata, query seperti ini dilakukan via NCBI E-utilities atau Ensembl REST API — programatik, bukan klik manual, agar reproducible.",
      ],
      tasks: [
        { id: "t1", text: "Petakan tiap query ke nama resmi + ID stabil" },
        { id: "t2", text: "Hitung berapa query yang AMBIGU/tidak ditemukan" },
        { id: "t3", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "5 query diproses · 1 ambigu (genX) · trp53 = tikus!",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menggabungkan dataset lintas spesies tanpa kolom taksonomi. trp53 (tikus) dan TP53 (manusia) terlihat mirip di tabel — tanpa ID spesies, analisis lintas-spesies tercampur diam-diam.",
      },
      hints: [
        "Nama resmi = alias.get(q, q); info = genedb.get(nama_resmi).",
        "ID hanya ada jika info tidak None; kalau tidak, tandai AMBIGU.",
        "Hitung yang ambigu dengan kondisi info is None.",
      ],
      code: {
        starter: `genedb = {\n    'TP53': {'id': 7157, 'ensembl': 'ENSG00000141510', 'uniprot': 'P04637'},\n    'BRCA1': {'id': 672, 'ensembl': 'ENSG00000012048', 'uniprot': 'P38398'},\n}\nalias = {'p53': 'TP53', 'trp53': 'TP53 (tikus!)', 'brca1': 'BRCA1'}\n\n# TULIS KODEMU: petakan tiap query ke nama resmi + ID stabil\nquery = ['p53', 'TP53', 'trp53', 'BRCA1', 'genX']\nterpetakan = 0\nambigu = 0\nfor q in query:\n    resmi = \n    info = \n    if info:\n        terpetakan += 1\n        print(f'{q} -> {resmi} | NCBI:{info["id"]} {info["ensembl"]}')\n    else:\n        ambigu += 1\n        print(f'{q} -> TIDAK DITEMUKAN / AMBIGU (bahaya!)')\nprint(f'terpetakan={terpetakan} ambigu={ambigu}')`,
        lockLines: 5,
        solution: `genedb = {\n    'TP53': {'id': 7157, 'ensembl': 'ENSG00000141510', 'uniprot': 'P04637'},\n    'BRCA1': {'id': 672, 'ensembl': 'ENSG00000012048', 'uniprot': 'P38398'},\n}\nalias = {'p53': 'TP53', 'trp53': 'TP53 (tikus!)', 'brca1': 'BRCA1'}\n\n# TULIS KODEMU: petakan tiap query ke nama resmi + ID stabil\nquery = ['p53', 'TP53', 'trp53', 'BRCA1', 'genX']\nterpetakan = 0\nambigu = 0\nfor q in query:\n    resmi = alias.get(q, q)\n    info = genedb.get(resmi)\n    if info:\n        terpetakan += 1\n        print(f'{q} -> {resmi} | NCBI:{info["id"]} {info["ensembl"]}')\n    else:\n        ambigu += 1\n        print(f'{q} -> TIDAK DITEMUKAN / AMBIGU (bahaya!)')\nprint(f'terpetakan={terpetakan} ambigu={ambigu}')`,
        checks: [
          { kind: "equal", task: "t1", name: "terpetakan", value: 3, label: "`terpetakan` = 3", msg: "p53, TP53, BRCA1 terpetakan. trp53 → 'TP53 (tikus!)' tidak ada di genedb; genX tidak ada." },
          { kind: "equal", task: "t2", name: "ambigu", value: 2, label: "`ambigu` = 2", msg: "trp53 dan genX tidak ditemukan. Cek logika alias.get dan genedb.get." },
          { kind: "stdout_matches", task: "t3", pattern: "terpetakan=3 ambigu=2", label: "`print` menampilkan ringkasan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "alias.get(q, q) untuk nama; genedb.get untuk ID. ID stabil = kunci merge.",
    },
    {
      id: "tiga-lantai",
      eyebrow: "Langkah 3 · Tiga lantai",
      title: "Arsip mentah, kurasi, dan katalog variasi",
      prose: [
        "Lantai 1 — arsip mentah: INSDC (GenBank/ENA/DDBJ) menyimpan semua sekuens yang disubmit, sinkron harian; SRA menyimpan bacaan mentah NGS; GEO menyimpan data ekspresi. Seperti arsip nasional: menyimpan semua dokumen yang masuk tanpa menilai benar-salah.",
        "Lantai 2 — kurasi: Ensembl (anotasi genom), UniProt (protein), PDB (struktur 3D), GO/KEGG (fungsi dan pathway). Trade-off abadi: UniProt Swiss-Prot (kurasi manual, sekitar 570 ribu entri) sangat dipercaya tapi kecil; TrEMBL (otomatis, 250 juta+) lengkap tapi berisik. Eksplorasi boleh dari kiri, kesimpulan harus didukung dari kanan.",
        "Lantai 3 — variasi dan populasi: gnomAD (frekuensi varian di 800 ribu+ orang — filter patogenik!), ClinVar (interpretasi klinis dari lab dunia), TCGA (atlas kanker multi-omics), dbSNP (katalog — arsip, bukan vonis).",
      ],
      tasks: [
        { id: "t1", text: "Pasangkan: butuh data mentah → lantai 1; butuh arti biologis → lantai 2; butuh vonis varian → lantai 3" },
        { id: "t2", text: "Jelaskan trade-off Swiss-Prot vs TrEMBL" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap rsID di dbSNP sebagai vonis patogenik. dbSNP hanya nomor arsip — varian terdaftar di sana bisa jinak, patogenik, atau belum jelas. Vonis butuh ClinVar + frekuensi + bukti (ACMG).",
      },
      reference: "Primer = arsip · kurasi = pengetahuan · gnomAD + ClinVar = dua pilar vonis varian.",
    },
    {
      id: "lab-filter",
      eyebrow: "Langkah 4 · Lab",
      title: "Filter varian ala gnomAD + ClinVar",
      prose: [
        "Diberikan 10 varian (frekuensi gnomAD + vonis ClinVar), terapkan pipeline diagnosis standar: buang yang terlalu umum (frekuensi ≥ 1%), buang yang jinak, simpan sisanya sebagai kandidat.",
        "VUS dan konflik butuh kurasi manual + bukti fungsional — tidak ada filter otomatis yang bisa memvonisnya.",
      ],
      tasks: [
        { id: "t1", text: "Terapkan filter frekuensi dan vonis ke tiap varian" },
        { id: "t2", text: "Kumpulkan `kandidat` yang lolos" },
        { id: "t3", text: "Cetak status tiap varian" },
      ],
      expected: "kandidat=['rs2', 'rs3', 'rs4', 'rs6', 'rs8', 'rs10']",
      hints: [
        "Buang jika frekuensi >= 0.01 (THR) ATAU vonis 'jinak'.",
        "Sisanya append ke list kandidat.",
        "Status: 'BUANG (terlalu umum)', 'BUANG (jinak)', atau 'KANDIDAT'.",
      ],
      code: {
        starter: `varian = [\n    ('rs1', 0.30, 'jinak'), ('rs2', 0.0001, 'patogenik'),\n    ('rs3', 0.005, 'VUS'), ('rs4', 0.00001, 'patogenik'),\n    ('rs5', 0.02, 'konflik'), ('rs6', 0.0005, 'kemungkinan patogenik'),\n    ('rs7', 0.15, 'jinak'), ('rs8', 0.0002, 'VUS'),\n    ('rs9', 0.001, 'jinak'), ('rs10', 0.00005, 'patogenik'),\n]\nTHR = 0.01\n\n# TULIS KODEMU: filter diagnosis\nkandidat = []\nfor rs, f, cv in varian:\n    if :\n        status = 'BUANG (terlalu umum)'\n    elif :\n        status = 'BUANG (jinak)'\n    else:\n        status = 'KANDIDAT'\n        kandidat.append(rs)\n    print(f'{rs}: {status}')\nprint(f'kandidat={kandidat}')`,
        lockLines: 7,
        solution: `varian = [\n    ('rs1', 0.30, 'jinak'), ('rs2', 0.0001, 'patogenik'),\n    ('rs3', 0.005, 'VUS'), ('rs4', 0.00001, 'patogenik'),\n    ('rs5', 0.02, 'konflik'), ('rs6', 0.0005, 'kemungkinan patogenik'),\n    ('rs7', 0.15, 'jinak'), ('rs8', 0.0002, 'VUS'),\n    ('rs9', 0.001, 'jinak'), ('rs10', 0.00005, 'patogenik'),\n]\nTHR = 0.01\n\n# TULIS KODEMU: filter diagnosis\nkandidat = []\nfor rs, f, cv in varian:\n    if f >= THR:\n        status = 'BUANG (terlalu umum)'\n    elif cv == 'jinak':\n        status = 'BUANG (jinak)'\n    else:\n        status = 'KANDIDAT'\n        kandidat.append(rs)\n    print(f'{rs}: {status}')\nprint(f'kandidat={kandidat}')`,
        checks: [
          { kind: "equal", task: "t2", name: "kandidat", value: ["rs2", "rs3", "rs4", "rs6", "rs8", "rs10"], label: "`kandidat` berisi 6 varian", msg: "rs1/rs7 buang (terlalu umum); rs5 buang (0.02 ≥ 0.01); rs9 buang (jinak). Sisanya kandidat." },
          { kind: "stdout_matches", task: "t3", pattern: "rs1: BUANG", label: "`print` menampilkan status rs1", msg: "Cetak status tiap varian dengan format rsX: STATUS." },
        ],
      },
      reference: "Filter: frekuensi <1%, bukan jinak. VUS/konflik = kandidat untuk kurasi manual.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Varian “patogenik” yang ternyata umum di Papua",
      prose: [
        "Lab melaporkan varian “patogenik” (ClinVar, 2 submitter) pada pasien Indonesia timur. Dokter panik. Kamu cek gnomAD: frekuensi global 0,0001 — tapi tidak ada data Papua di gnomAD.",
        "Kamu sekuensing 200 kontrol sehat lokal: frekuensi varian 8% — umum dan tidak terkait penyakit di populasi ini. Vonis patogenik berdasarkan populasi Eropa tidak berlaku universal; varian ini polimorfisme lokal yang jinak.",
        "Pelajarannya ganda. Pertama, database global bias Eropa; Indonesia butuh referensi genomik sendiri. Kedua, frekuensi populasi LOKAL adalah filter yang lebih relevan daripada vonis impor. Untuk pasien Indonesia timur, “tidak ada di gnomAD” bisa berarti “tidak disampling” — bukan “langka”.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa vonis ClinVar 2 submitter runtuh di kasus ini" },
        { id: "t2", text: "Sebutkan dua pelajaran untuk analis bioinformatika Indonesia" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Vonis impor yang salah memicu kepanikan klinis dan terapi yang tidak perlu — biaya medis dan psikologis nyata. Di risiko operasional, bias representasi database adalah sumber false positive sistematis yang harus dimodelkan, bukan diabaikan.",
      },
      reference: "Bias representasi = isu validitas dan keadilan. Butuh referensi genomik lokal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Database mana untuk pertanyaan apa",
      prose: [
        "Butuh sekuens atau data mentah (analisis ulang, download besar) → NCBI/SRA/GEO. Arsip primer terlengkap dengan metadata.",
        "Butuh arti biologis (anotasi fungsi, pathway, struktur) → Ensembl/UniProt/GO/KEGG/PDB. Kurasi yang bisa dipertanggungjawabkan.",
        "Interpretasi varian klinis → gnomAD + ClinVar. Dua pilar: frekuensi populasi dan interpretasi lab.",
        "Riset kanker multi-omics → TCGA (+ cBioPortal). Atlas terkurasi dengan data klinis.",
        "Aturan 10 detik: ID stabil bukan nama gen; catat versi database + tanggal akses; primer untuk eksplorasi, kurasi untuk kesimpulan; rsID bukan vonis.",
      ],
      tasks: [
        { id: "t1", text: "Untuk anotasi gen kandidat GWAS, pilih databasenya" },
        { id: "t2", text: "Untuk cek frekuensi varian di populasi sehat, pilih databasenya" },
      ],
      reference: "Eksplorasi dari arsip, kesimpulan dari kurasi. Catat versi + tanggal selalu.",
    },
    {
      id: "adv-rilis-versi",
      eyebrow: "Langkah 7 · Advanced",
      title: "Rilis, versi, dan koordinat yang berpindah",
      prose: [
        "Database biologi adalah arsip hidup: Ensembl merilis versi baru sekitar 3 kali setahun, dan tiap rilis bisa mengubah anotasi gen — batas ekson bergeser, transkrip kanonis diganti, bahkan gen “hilang” karena reklasifikasi. NCBI RefSeq memakai versioning eksplisit pada aksesi: NM_000059.3 menjadi NM_000059.4 ketika sekuens referensinya dikoreksi. ID gen (ENSG00000141510) stabil, tapi ID transkrip berversi mengikuti sekuensnya. Analis yang tidak mencatat versi anotasi sedang membangun di atas pasir.",
        "Assembly genom pun berversi: manusia GRCh38 punya patch (GRCh38.p14) dan aksesi assembly GCA_000001405.28. Koordinat varian dari paper lama (hg19/GRCh37) TIDAK sama dengan koordinat hg38/GRCh38 — chr17:7.579.472 di hg19 menunjuk basa yang berbeda di hg38. Mode kegagalan klasik: meng-intersect posisi varian hg19 dengan file BED hg38, mendapat 0 hasil, tanpa satu pun error. Solusinya adalah liftover/remap: NCBI Remap, Ensembl Assembly Converter, atau chain file UCSC.",
        "Aturan praktisi ada tiga. Pertama, catat assembly + versi anotasi + tanggal akses di setiap methods — “GRCh38, Ensembl 112” bukan “genom manusia terbaru”. Kedua, untuk reproduksibilitas jangka panjang, pin ke arsip berversi (mis. grch37.rest.ensembl.org) alih-alih endpoint “current”. Ketiga, saat menerima koordinat dari kolaborator, pertanyaan pertamamu selalu: “assembly apa?” — sebelum pertanyaan lain apa pun.",
        "Trade-off-nya nyata: memakai rilis terbaru memberi anotasi terbaik, tapi merusak reproduksibilitas analisis lama bila tidak didokumentasikan. Laboratorium yang serius menyimpan snapshot database (atau setidaknya nomor versinya) untuk tiap publikasi — karena reviewer yang teliti akan menanyakannya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa intersect varian hg19 dengan BED hg38 bisa memberi 0 hasil tanpa error" },
        { id: "t2", text: "Sebutkan tiga hal yang wajib dicatat di methods terkait versi database" },
      ],
      reference: "ID gen stabil, transkrip berversi · koordinat hg19 ≠ hg38 · catat assembly + versi + tanggal.",
    },
    {
      id: "adv-api",
      eyebrow: "Langkah 8 · Advanced",
      title: "Akses programatik: E-utilities & Ensembl REST tanpa kena blokir",
      prose: [
        "Analisis serius tidak mengklik website 10.000 kali — ia memakai API. NCBI E-utilities (ESearch, EFetch, ESummary) adalah gerbang programatik ke PubMed, GenBank, dan ClinVar. Aturan mainnya keras: tanpa API key (gratis, dari akun NCBI) batasnya 3 request per detik; dengan key, 10 per detik. Selalu sertakan parameter email dan tool — NCBI memakainya untuk menghubungimu sebelum memblokir, bukan sesudahnya.",
        "Ensembl REST (rest.ensembl.org) melayani anotasi, sekuens region, dan overlap fitur lewat endpoint seperti /sequence/region dan /overlap/region, dengan batas sekitar 15 request per detik. Untuk query besar, pola yang benar adalah batch + jeda: kirim dalam kelompok, beri sleep antar batch, dan implementasikan backoff (tunggu makin lama tiap gagal). Mode kegagalan klasik: script burst 100 query per detik tanpa jeda → IP kena throttle, lalu analis menyalahkan “server down”.",
        "Dua aturan reproduksibilitas. Pertama, cache respons API secara lokal (file JSON per ID): jangan menembak 10.000 ID yang sama setiap kali pipeline dijalankan — selain lambat, hasil “live” bisa berubah diam-diam antar run. Kedua, pin versi arsip untuk publikasi (endpoint arsip Ensembl per rilis), karena anotasi “current” hari ini belum tentu sama bulan depan.",
        "Trade-off: API live memberi data paling mutakhir tapi tidak reproduksibel; snapshot lokal reproduksibel tapi bisa basi. Praktisi memakai keduanya: snapshot berversi untuk analisis final, API live hanya untuk eksplorasi awal — dan mencatat tanggal snapshot-nya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa respons API wajib di-cache lokal untuk pipeline produksi" },
        { id: "t2", text: "Sebutkan batas rate NCBI tanpa dan dengan API key" },
      ],
      reference: "NCBI: 3/detik tanpa key, 10/detik dengan key · batch + sleep + backoff · cache + pin versi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Delapan pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: database adalah arsip yang berpendapat",
        body: "Empat heuristik praktisi untuk memakai database biologi tanpa tertipu. Pertama, bedakan tiga peran: arsip (menyimpan semua yang masuk — GenBank, SRA), kurasi (menilai dan merapikan — Swiss-Prot, Ensembl), dan vonis (menginterpretasi — ClinVar). Eksplorasi boleh mulai dari arsip, tapi kesimpulan klinis tidak boleh berdiri di atasnya. Kedua, nama gen untuk manusia, ID untuk mesin: nama berubah, ambigu antar spesies, dan penuh alias — hanya aksesi stabil yang boleh jadi kunci merge. Ketiga, tidak ada di database bukan berarti tidak ada di alam: “tidak ada di gnomAD” untuk sampel Papua berarti “tidak disampling”, bukan “langka”. Bedakan absence of evidence dari evidence of absence — terutama untuk populasi yang kurang terwakili. Keempat, perlakukan setiap database sebagai snapshot berpendapat: ia punya versi, tanggal, bias populasi, dan kebijakan kurasi. Catat ketiganya di methods, pin versinya untuk publikasi, dan curigai vonis yang hanya didukung satu submitter.",
      },
      summary: [
        "Primer (INSDC, SRA, GEO): arsip mentah; kurasi (Ensembl, UniProt, PDB): pengetahuan tepercaya.",
        "Selalu pakai ID stabil (aksesi), catat versi + tanggal akses.",
        "Interpretasi varian = gnomAD (frekuensi) + ClinVar (vonis) + bukti fungsional.",
        "rsID bukan vonis patogenik. Konflik ClinVar = butuh kurasi manual.",
        "Waspadai bias populasi database global untuk pasien Indonesia.",
        "Anotasi fungsional standar: posisi → protein → pathway → struktur.",
      ],
      next: { label: "BI3 · Format File Genomik", href: "/learn/bi3-format-data" },
      quiz: [
        {
          q: "Paper 2015 melaporkan varian patogenik di chr17:7.579.472 (hg19). Kamu intersect langsung dengan data hg38 dan dapat 0 hasil. Diagnosis paling mungkin?",
          options: [
            { text: "Varian tersebut tidak ada di hg38", why: "Varian tidak hilang antar assembly — yang bergeser adalah sistem koordinatnya." },
            { text: "Koordinat hg19 ≠ hg38 — perlu liftover/remap dulu", why: "Assembly berbeda = peta berbeda. Pakai NCBI Remap / chain file sebelum intersect.", correct: true },
            { text: "File BED-nya pasti rusak", why: "Mungkin, tapi diagnosis pertama untuk 0-hasil-tanpa-error adalah mismatch assembly." },
            { text: "Varian sudah direklasifikasi jadi jinak", why: "Reklasifikasi tidak menghapus posisi; ini masalah koordinat, bukan vonis." },
          ],
        },
        {
          q: "Script E-utilities tanpa API key menembak 100 query/detik ke NCBI. Yang terjadi?",
          options: [
            { text: "Berjalan normal — NCBI tidak membatasi", why: "Salah: batasnya 3 req/detik tanpa key, 10/detik dengan key." },
            { text: "IP kena throttle/blokir sementara", why: "Burst tanpa jeda = pola abuse. Solusinya: API key + batch + sleep + backoff.", correct: true },
            { text: "Akun NCBI dihapus permanen", why: "Tidak ada akun yang terlibat; yang diblokir adalah IP-nya, sementara." },
            { text: "Hasil query-nya menjadi salah", why: "Hasilnya benar — yang rusak adalah aksesnya, bukan datanya." },
          ],
        },
        {
          q: "Pipeline produksi mengambil anotasi dari Ensembl “live” setiap run tanpa cache dan tanpa catat versi. Risiko terbesar?",
          options: [
            { text: "Tidak ada — data live selalu yang terbaik", why: "Live = berubah diam-diam; run bulan depan bisa memberi hasil beda tanpa perubahan kode." },
            { text: "Hasil tidak reproduksibel — anotasi bisa berubah antar run", why: "Solusinya: cache respons + pin versi arsip + catat versi/tanggal di methods.", correct: true },
            { text: "Pipeline menjadi lebih cepat", why: "Justru lebih lambat: 10.000 query ulang setiap run vs baca cache lokal." },
            { text: "NCBI akan memblokir IP", why: "Ini Ensembl, bukan NCBI — dan masalahnya reproduksibilitas, bukan rate limit." },
          ],
        },
        {
          q: "Untuk ID gen yang stabil lintas analisis, pakai…",
          options: [
            { text: "Nama umum (p53)", why: "Nama berubah dan ambigu antar spesies." },
            { text: "Aksesi ID (ENSG00000141510 / 7157)", why: "ID stabil lintas waktu dan database. Nama untuk manusia, ID untuk mesin.", correct: true },
            { text: "Nama panggilan lab", why: "Hanya berlaku di satu lab; tidak ada standar." },
            { text: "Nomor urut di spreadsheet", why: "Berubah setiap kali baris diurut ulang." },
          ],
        },
        {
          q: "Varian punya rsID di dbSNP. Artinya…",
          options: [
            { text: "Pasti patogenik", why: "dbSNP adalah katalog, bukan pengadilan." },
            { text: "Terdaftar di katalog — BUKAN vonis klinis", why: "rsID = nomor arsip. Vonis butuh ClinVar + frekuensi + bukti + ACMG.", correct: true },
            { text: "Pasti jinak", why: "Banyak varian patogenik juga punya rsID." },
            { text: "Tidak ada arti", why: "Ada arti administratif: ia terdaftar dan bisa dirujuk." },
          ],
        },
        {
          q: "Filter PERTAMA paling kuat untuk varian penyakit langka?",
          options: [
            { text: "Warna mata pasien", why: "Tidak relevan dengan kausalitas varian." },
            { text: "Frekuensi di gnomAD (harus langka di populasi sehat)", why: "Penyakit langka ≠ varian umum. Filter frekuensi memangkas 99% kandidat seketika.", correct: true },
            { text: "Panjang gen", why: "Panjang gen tidak menentukan patogenisitas varian." },
            { text: "Jumlah ekson", why: "Jumlah ekson tidak menyaring kandidat secara bermakna." },
          ],
        },
        {
          q: "ClinVar: 3 lab patogenik, 2 lab VUS untuk satu varian. Sikap?",
          options: [
            { text: "Ikut mayoritas", why: "Agregat bukan kebenaran; kualitas bukti tiap submitter beda." },
            { text: "Konflik = butuh kurasi manual + bukti tambahan, jangan vonis buta", why: "Cek bintang review, tanggal, dan bukti pendukung sebelum menyimpulkan.", correct: true },
            { text: "Abaikan variannya", why: "Mengabaikan = kehilangan kandidat; yang dibutuhkan adalah kurasi." },
            { text: "Pilih yang terbaru saja", why: "Tanggal penting tapi bukan satu-satunya penentu; bukti yang dinilai." },
          ],
        },
        {
          q: "gnomAD minim data Indonesia timur. Implikasinya?",
          options: [
            { text: "Tidak masalah", why: "Masalah besar: vonis berbasis Eropa bisa salah total di populasi lain." },
            { text: "“Tidak ada di gnomAD” bisa berarti tak disampling — butuh referensi lokal", why: "Bias representasi = isu validitas dan keadilan. Indonesia butuh data genomik sendiri.", correct: true },
            { text: "Jangan pakai gnomAD sama sekali", why: "gnomAD tetap berguna; yang dibutuhkan adalah kewaspadaan, bukan penolakan." },
            { text: "Semua varian jadi patogenik", why: "Tidak ada hubungan logis antara minim data dan patogenisitas." },
          ],
        },
      ],
    },
  ],
};
