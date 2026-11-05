import type { V2Lesson } from "../lib/types";

// Perbandingan biaya tiga arsitektur (skala linear — arsitektur A mendominasi).
const COST_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang biaya bulanan tiga arsitektur: A $9051.60, B $474.37, C $49.71.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="70" y1="20" x2="70" y2="200"/><line x1="70" y1="200" x2="530" y2="200"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="62" y="204" text-anchor="end">0</text>
<text x="70" y="216">Arsitektur A (tanpa optimasi)</text>
<text x="250" y="216">B (partisi + lifecycle)</text>
<text x="410" y="216">C (B + Parquet)</text>
</g>
<rect x="90" y="36" width="70" height="164" fill="var(--c1)" opacity="0.85" rx="4"/>
<text x="125" y="28" font-size="12" font-weight="600" fill="var(--text)" text-anchor="middle" font-family="var(--font-ui)">$9.051,60</text>
<rect x="270" y="192" width="70" height="8" fill="var(--c2)" opacity="0.85" rx="4"/>
<text x="305" y="184" font-size="12" font-weight="600" fill="var(--text)" text-anchor="middle" font-family="var(--font-ui)">$474,37</text>
<rect x="450" y="198" width="70" height="2" fill="var(--c3)" opacity="0.9" rx="2"/>
<text x="485" y="184" font-size="12" font-weight="600" fill="var(--text)" text-anchor="middle" font-family="var(--font-ui)">$49,71</text>
<text x="300" y="242" font-size="11" fill="var(--error)" font-family="var(--font-ui)" text-anchor="middle">skala linear — batang A 182x batang C</text>
</svg>`;

// Zona pemilihan compute berdasar utilisasi.
const COMPUTE_SVG = `<svg viewBox="0 0 600 190" role="img" aria-label="Zona pemilihan compute: utilisasi rendah cocok serverless, menengah VM on-demand, tinggi VM reserved atau managed.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="110" x2="560" y2="110"/>
<line x1="60" y1="104" x2="60" y2="116"/><line x1="560" y1="104" x2="560" y2="116"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="60" y="130" text-anchor="middle">0%</text><text x="560" y="130" text-anchor="middle">100%</text>
<text x="310" y="148" text-anchor="middle">utilisasi (seberapa sibuk mesin dalam sebulan)</text>
</g>
<rect x="60" y="60" width="150" height="50" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="1.5" rx="8"/>
<rect x="210" y="60" width="170" height="50" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="1.5" rx="8"/>
<rect x="380" y="60" width="180" height="50" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="1.5" rx="8"/>
<g font-family="var(--font-ui)" font-size="12" font-weight="600" fill="var(--text)" text-anchor="middle">
<text x="135" y="80">Serverless</text><text x="295" y="80">VM on-demand</text><text x="470" y="80">Reserved / managed</text>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--text-muted)" text-anchor="middle">
<text x="135" y="98">sporadis, pendek</text><text x="295" y="98">tak menentu</text><text x="470" y="98">stabil 24/7</text>
</g>
<text x="300" y="176" font-size="11" fill="var(--error)" font-family="var(--font-ui)" text-anchor="middle">zona salah = membayar kemewahan yang tidak dipakai</text>
</svg>`;

export const de23: V2Lesson = {
  slug: "de23-cloud-platform",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE23 — Cloud Data Platform: Satu Platform, Dipahami Betul",
  estMinutes: 65,
  steps: [
    {
      id: "tujuan",
      eyebrow: "Langkah 1 · Peta & Tujuan",
      title: "Peta lesson & tujuan",
      prose: [
        "Lesson ini menutup satu lubang yang sering dilewati kurikulum data engineering: cloud-nya sendiri. Kamu sudah bisa merancang pipeline (DE2), menulis SQL (DE3), dan mengorkestrasi semuanya (DE7) — tetapi semua itu berjalan DI ATAS infrastruktur yang menyewa per detik, menagih per gigabyte, dan menghukum kelalaian lewat tagihan. Lesson ini membangun intuisi cloud khusus untuk data engineer: identitas, jaringan, penyimpanan, compute, dan — yang paling menentukan karier — kontrol biaya.",
        "Kita memakai satu platform sebagai contoh konkret di seluruh lesson: AWS (S3, EC2, EMR, Lambda, VPC, IAM). Konsepnya dipetakan ke platform lain saat relevan: S3 ↔ Cloud Storage (GCS) ↔ Blob Storage, EC2 ↔ Compute Engine, EMR ↔ Dataproc, Lambda ↔ Cloud Functions, Athena ↔ BigQuery. Pelajari polanya, bukan hafalan nama produknya.",
        "Setelah lesson ini, kamu bisa:",
        "(1) Merancang IAM dengan prinsip least privilege: membedakan user, role, dan service account, serta menjelaskan kenapa access key abadi adalah utang;",
        "(2) Menjelaskan VPC, subnet public vs private, dan kenapa warehouse tidak boleh punya IP publik;",
        "(3) Memilih storage class dan lifecycle rule yang tepat untuk data panas vs dingin;",
        "(4) Memilih VM, managed cluster, atau serverless berdasar pola beban — bukan berdasar tren;",
        "(5) Menghitung tagihan dari tiga suku biaya (simpan + pindai + kirim) dan memasang pengaman: tagging, budget alert, dan batasan teknis.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tagihan $8.260 untuk 'query 40% lebih cepat'",
      prose: [
        "Dara, data engineer di fintech 'DanaKilat', memindahkan data lake 2 TB dari server kantor ke cloud. Bulan pertama tagihan: $540 (sekitar Rp8,6 juta dengan kurs ilustrasi Rp16.000/USD) — masuk akal, disetujui finance. Timnya merayakan satu angka: 'query dashboard 40% lebih cepat!'",
        "Bulan kedua tagihan: $8.260 — sekitar Rp132 juta. Lima belas kali lipat. Tidak ada data baru yang masuk. Tidak ada fitur baru yang diluncurkan. Tidak ada yang mengaku mengubah apa pun. Rapat darurat dipanggil.",
        "Twist-nya: angka '40% lebih cepat' itu benar secara matematis — dan salah total secara makna. Kecepatannya datang dari mesin query yang memindai 2 TB penuh setiap kali dashboard di-refresh, 900 kali sebulan. Yang dirayakan sebagai kemenangan performa ternyata adalah mesin pembakar uang. Ditambah tiga dosa pendamping: cluster yang tidak pernah dimatikan sejak demo ('nanti dimatikan, lupa'), hasil query yang diunduh ke laptop tiap pagi (egress = kiriman data keluar cloud, ditagih per GB), dan tiga tahun data mentah menumpuk di storage termahal tanpa lifecycle rule.",
        "Lesson ini adalah bedah mayat tagihan itu — dan cara memastikan tagihanmu tidak pernah jadi mayat berikutnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: pindah ke cloud otomatis lebih murah",
        type: "pitfall",
        body: "Cloud bukan 'server yang lebih murah' — cloud adalah 'sewa per detik'. Server kantor yang nganggur tetap dibayar sekali; cloud yang nganggur tetap menagih setiap detik ia nyala. Tanpa disiplin biaya (yang diajarkan di Langkah 7), cloud hampir selalu LEBIH MAHAL dari server sendiri. Yang membuat cloud murah adalah arsitektur yang mematikannya saat tidak dipakai.",
      },
      reference: "Kecepatan query bukan kemenangan bila dibayar dengan memindai segalanya. Tagihan cloud = cermin arsitekturmu.",
    },
    {
      id: "iam",
      eyebrow: "Langkah 3 · IAM",
      title: "IAM — Si Penjaga Gerbang: siapa boleh apa",
      prose: [
        "IAM (Identity and Access Management) adalah sistem 'siapa boleh melakukan apa terhadap resource mana'. Tiga aktornya: user (manusia, mis. Dara), role (identitas sementara yang bisa 'dipakai' manusia atau mesin), dan service account / instance role (identitas untuk mesin — pipeline Airflow, bukan manusia). Kepribadiannya: satpam gedung yang memegang daftar tamu, bukan gembok yang kuncinya dibagi ke semua orang.",
        "Aturan mainnya ditulis dalam policy: dokumen yang menyatakan Allow atau Deny atas aksi (mis. `s3:GetObject`) terhadap resource (mis. bucket `laporan-*`). Prinsipnya: least privilege — beri izin sesempit mungkin yang masih memungkinkan pekerjaan selesai. Pipeline yang hanya membaca tabel penjualan tidak butuh izin menghapus bucket.",
        "Bedakan dua cara mesin mendapat identitas. Cara utang: access key abadi (sepasang kunci yang tidak kedaluwarsa) dibenamkan di kode atau file konfigurasi. Cara benar: role sementara — mesin 'meminjam' identitas yang kedaluwarsa otomatis dalam hitungan jam. Kalau kunci sementara bocor, jendelanya kecil; kalau kunci abadi bocor, pintunya terbuka selamanya.",
        "💡 Intuisi: setiap access key abadi adalah bom waktu dengan timer yang tidak terlihat. Praktisi senior menghitungnya bukan 'kapan dipakai' melainkan 'kapan bocor'.",
        "💡 Intuisi: Deny selalu menang atas Allow. Saat debugging 'kenapa akses ditolak padahal policy sudah Allow', cari policy Deny yang menimpanya — biasanya di level organisasi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: access key di repo 'biar gampang'",
        type: "pitfall",
        body: "Kunci akses yang ter-commit ke Git (apalagi repo publik) dipindai bot dalam hitungan menit — ada kasus nyata tagihan puluhan ribu dolar dari aktivitas mining dalam semalam. 'Biar gampang' hari ini = insiden keamanan bulan depan. Mesin tidak butuh kunci abadi: beri role sementara (instance profile / workload identity). Kunci statis hanya untuk kasus yang benar-benar tidak mendukung role — dan wajib dirotasi terjadwal.",
      },
      reference: "Manusia = user. Mesin = role sementara. Access key abadi = utang yang menagih lewat insiden.",
    },
    {
      id: "jaringan",
      eyebrow: "Langkah 4 · Jaringan",
      title: "Jaringan — Si Arsitek Tembok: VPC & subnet",
      prose: [
        "VPC (Virtual Private Cloud) adalah jaringan privat virtual milikmu di dalam cloud publik: sebidang tanah berpagar dengan alamat IP sendiri. Di dalamnya ada subnet — kavling-kavling. Subnet public punya rute ke internet (lewat internet gateway); subnet private tidak — penghuninya hanya bisa dihubungi dari dalam.",
        "Aturan emas data engineering: warehouse dan database tinggal di subnet PRIVATE. Mereka tidak butuh — dan tidak boleh — punya IP publik. Internet memindai port database (3306, 5432, 5439) dua puluh empat jam sehari; database dengan IP publik dan password lemah adalah undangan tertulis. Yang boleh di public hanya gerbang yang memang melayani dunia: load balancer, bastion yang dijaga ketat.",
        "Security group adalah 'daftar tamu' tiap mesin: port berapa boleh masuk, dari alamat mana. Database hanya menerima port 5432 dari subnet aplikasi — bukan dari `0.0.0.0/0` (seluruh internet). Satu baris `0.0.0.0/0` yang salah tempat = tembok yang punya pintu belakang.",
        "Pemetaan lintas platform: konsepnya identik di mana-mana — AWS VPC, GCP VPC, Azure VNet; security group (AWS) ≈ firewall rules (GCP). Yang berbeda hanya nama tombolnya.",
        "💡 Intuisi: gambar arsitektur jaringan dari sudut pandang penyerang, bukan dari sudut pandangmu. Tanya: 'kalau saya orang asing di internet, resource apa yang bisa saya sapa?' Jawaban yang benar: hampir tidak ada.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membuka security group ke 0.0.0.0/0 'sementara untuk debugging' lalu lupa menutupnya. 'Sementara' di cloud = permanen sampai ada yang ingat. Aturan praktis: debugging pakai bastion/SSM session ke subnet private, bukan membuka pintu ke internet. Dan audit security group berkala — cari 0.0.0.0/0 seperti mencari kebocoran gas.",
      },
      reference: "Data di private, gerbang di public. 0.0.0.0/0 ke database = pintu belakang yang lupa ditutup.",
    },
    {
      id: "storage",
      eyebrow: "Langkah 5 · Object Storage",
      title: "Object Storage — Si Gudang Bertingkat: bucket & storage class",
      prose: [
        "Object storage (S3, GCS, Blob) adalah gudang tak terbatas untuk file: setiap file = object di dalam bucket (wadah), lengkap dengan metadata. Tidak ada folder beneran — 'folder' hanyalah awalan nama (prefix). Kepribadiannya: gudang raksasa yang sewanya murah, tapi ongkos 'mengambil barang' dan 'mengeluarkan barang dari gudang' dihitung terpisah.",
        "Gudang ini bertingkat — storage class: Standard untuk data panas (diakses tiap hari), Infrequent Access untuk data hangat (diakses bulanan), dan Archive/Glacier untuk data dingin (hampir tidak pernah disentuh, tapi wajib disimpan untuk audit/regulator). Kelas dingin bisa 5–6x lebih murah per GB — dengan harga: mengambilnya lambat (jam) dan kadang kena biaya pengambilan.",
        "Lifecycle rule adalah pegawai gudang yang otomatis: 'object berumur > 90 hari pindah ke kelas dingin; berumur > 3 tahun hapus'. Tanpa pegawai ini, data 3 tahun menumpuk di lantai termahal — persis dosa keempat Dara di cerita pembuka.",
        "💡 Intuisi: biaya storage = GB × kelas × bulan. Tiga tuas, bukan satu. Data yang tidak pernah dibaca tapi disimpan di kelas panas = membayar sewa apartemen untuk barang di gudang.",
        "💡 Intuisi: versioning (menyimpan versi lama tiap object ditimpa) adalah asuransi — dan asuransi menagih premi per versi. Nyalakan untuk data kritis, matikan atau batasi untuk data sementara pipeline.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Fokus menghemat storage sampai lupa bahwa storage biasanya HANYA 1–5% dari tagihan yang meledak. Di kasus Dara, storage 2 TB cuma ~$47/bulan — sementara pemindaian query $9.000/bulan. Optimasi storage itu baik, tetapi jangan sampai menutupi dua pembunuh senyap yang sebenarnya: scan dan egress (Langkah 7).",
      },
      reference: "Panas di Standard, dingin di Archive, dan biarkan lifecycle rule yang memindahkannya — otomatis.",
    },
    {
      id: "compute",
      eyebrow: "Langkah 6 · Compute",
      title: "Compute — Tiga Koki: VM, managed, serverless",
      prose: [
        "Tiga cara menyewa dapur komputasi. VM (EC2, Compute Engine) = menyewa dapur sendiri: kamu atur kompornya (OS, library), bayar per detik nyala, matikan saat selesai. Managed cluster (EMR, Dataproc) = katering: kamu pesan 'Spark untuk 2 jam', penyedia mengurus node-nya. Serverless / functions (Lambda, Cloud Functions) = pesan antar: kamu kirim satu fungsi, bayar per eksekusi + durasi, tanpa mikir server sama sekali.",
        "Pilih berdasar pola beban, bukan tren. Beban stabil 24/7 (pipeline batch harian yang selalu jalan) → VM atau managed dengan harga committed/reserved — termurah per jam. Beban sporadis dan pendek (ETL yang jalan 10 menit tiap jam, webhook) → serverless — kamu tidak membayar waktu nganggur. Beban kustom/GPU/driver khusus → VM, karena serverless membatasi runtime dan memorinya.",
        "Cara membaca: sumbu X = utilisasi (seberapa sibuk mesin dalam sebulan). Tiga zona: kiri (rendah/sporadis) = serverless; tengah = VM on-demand; kanan (tinggi/stabil) = reserved/managed. Teks merah di bawah adalah peringatannya.",
        "Interpretasi: zona yang salah = membayar kemewahan yang tidak dipakai. Serverless untuk job 24/7 = membayar harga premium per detik tanpa henti. VM on-demand yang nyala terus untuk job 10 menit sehari = membayar 23 jam 50 menit nganggur.",
      ],
      figure: {
        svg: COMPUTE_SVG,
        alt: "Zona pemilihan compute berdasar utilisasi: serverless untuk rendah, VM on-demand untuk menengah, reserved untuk tinggi.",
        caption: "Pilih compute dari utilisasi: sporadis → serverless, stabil 24/7 → reserved/managed.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: serverless selalu murah",
        type: "pitfall",
        body: "Serverless murah saat IDLE — karena nol eksekusi = nol tagihan. Tetapi harga per detiknya adalah harga premium. Job yang jalan 24/7 di serverless bisa 3–10x lebih mahal daripada VM yang sama. 'Tanpa server' bukan berarti 'tanpa tagihan' — artinya tagihan mengikuti pola pakai. Cocokkan pola pakai dengan zona harganya (lihat diagram di atas), jangan cocokkan dengan tren.",
      },
      reference: "Sporadis → serverless. Stabil 24/7 → reserved/managed. Kustom → VM. Pola beban dulu, teknologi kemudian.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 7 · Biaya",
      title: "Kontrol Biaya — Si Bendahara: tag, budget, dan dua pembunuh senyap",
      prose: [
        "Tagihan cloud punya tiga suku — dan hanya tiga: C_total = C_storage + C_scan + C_egress. Menyimpan data, memindai data (query), mengirim data keluar. Setiap dolar tagihanmu jatuh ke salah satu dari tiga ember ini. Bedahnya selalu mulai dari sini: ember mana yang penuh?",
        "Dua pembunuh senyapnya adalah scan dan egress. Scan: mesin query analitik (Athena, BigQuery) menagih per TB data yang DIPINDAI, bukan per TB yang kamu butuhkan. Query `SELECT *` ke tabel 2 TB tanpa partisi = membayar 2 TB penuh untuk menjawab pertanyaan 5 GB. Egress: data yang keluar dari cloud (diunduh ke laptop, dikirim antar-region) ditagih per GB — murah per GB, mahal dalam volume dan kebiasaan.",
        "Tiga pengaman wajib. Satu — tagging: tempel label (tim, proyek, environment) ke tiap resource; tanpa tag, tagihan adalah satu angka misterius yang tidak bisa ditagih ke siapa pun. Dua — budget alert: alarm di 50%, 80%, 100% dari anggaran; Dara akan selamat bila alarmnya berbunyi di minggu pertama, bukan di invoice. Tiga — batasan teknis: lifecycle rule, auto-shutdown cluster, dan kuota — karena disiplin manusia kalah konsisten dari aturan mesin.",
        "Cara membaca: tiga batang skala linear — A = tanpa optimasi, B = tambah partisi + lifecycle, C = tambah format columnar (Parquet, 10x lebih kecil). Angka di atas tiap batang = biaya per bulan.",
        "Interpretasi: dari A ke C = 182x lebih murah untuk DATA DAN QUERY YANG SAMA. Tidak ada yang dikorbankan kecuali kebiasaan buruk: scan penuh, storage panas untuk data dingin, dan egress yang tidak perlu. Inilah mengapa Langkah 7 ini menentukan karier: insinyur yang bisa membaca tagihan adalah insinyur yang dipercaya memegang budget.",
      ],
      formula: String.raw`C_{total} = C_{storage} + C_{scan} + C_{egress}`,
      formulaNote: "C_total = tagihan bulanan (USD); C_storage = GB × harga/GB kelasnya (mis. 2048 GB × $0,023); C_scan = TB dipindai × harga/TB (mis. 1800 TB × $5); C_egress = GB keluar × harga/GB (mis. 50 GB × $0,09). Angka harga = ilustrasi orde besaran dari harga publik — cek kalkulator resmi untuk angka final.",
      figure: {
        svg: COST_SVG,
        alt: "Diagram batang biaya bulanan: arsitektur A $9051.60, B $474.37, C $49.71.",
        caption: "Data dan query yang sama, tiga arsitektur: tanpa optimasi vs partisi+lifecycle vs tambah Parquet. Selisih 182x.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi kunci: tagihan adalah cermin arsitektur",
        body: "Setiap baris tagihan yang mengejutkan bisa dilacak ke satu keputusan arsitektur: scan penuh = tidak ada partisi; egress besar = hasil diunduh bukan dibaca di tempat; cluster mahal = tidak ada auto-shutdown. Jangan 'menghemat cloud' secara umum — bedah tiga embernya (simpan, pindai, kirim), lalu perbaiki ember yang penuh. Insinyur senior membaca invoice seperti dokter membaca lab darah.",
      },
      reference: "Tiga ember: simpan + pindai + kirim. Pengaman: tagging, budget alert, aturan mesin (lifecycle, auto-shutdown).",
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab: kalkulator biaya tiga arsitektur",
      prose: [
        "Lab ini menghitung ulang bedah mayat tagihan Dara dengan angka konkret. Datanya: 2 TB log (2048 GB), 900 query per bulan (30/hari), 50 GB egress ke kantor. Harga = ilustrasi orde besaran dari harga publik (cek kalkulator resmi untuk angka final): storage Standard $0,023/GB-bulan, Glacier $0,004/GB-bulan, scan $5/TB, egress $0,09/GB.",
        "Tiga arsitektur: A = tanpa optimasi (semua Standard, scan penuh 2 TB/query). B = A + partisi tanggal (scan 5% = 0,1 TB/query) + lifecycle (70% data dingin ke Glacier). C = B + data disimpan sebagai Parquet (10x lebih kecil), egress nol (hasil dibaca di dalam region).",
        "Cara membaca output: empat baris — biaya tiap arsitektur + rasio penghematan A vs C. Kalau angkamu cocok dengan ekspektasi di bawah, pemahaman tiga ember biayanya sudah benar.",
        "Coba: ubah persentase partisi dari 5% menjadi 20% — pada titik berapa arsitektur B berhenti menarik? Ubah egress menjadi 500 GB — arsitektur mana yang paling sensitif?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_a`: storage semua Standard + scan penuh 2 TB/query + egress 50 GB" },
        { id: "t2", text: "Hitung `biaya_b`: 70% Glacier + 30% Standard, scan 5% (0,1 TB/query), egress 50 GB" },
        { id: "t3", text: "Hitung `biaya_c`: data Parquet 10x lebih kecil, scan 5% dari data kecil, egress 0" },
        { id: "t4", text: "Hitung `hemat` = rasio biaya_a / biaya_c (1 desimal), cetak keempatnya" },
      ],
      expected: "arsitektur_a=USD 9051.60 | arsitektur_b=USD 474.37 | arsitektur_c=USD 49.71 | hemat_ac=182.1x",
      note: {
        title: "Sering salah",
        body: "Lupa mengonversi GB ke TB untuk biaya scan (scan ditagih per TB). 0,1 TB = 102,4 GB — kalau kamu mengalikan 102,4 × $5, hasilnya 20x terlalu besar. Selalu samakan satuannya dulu: GB untuk storage & egress, TB untuk scan.",
      },
      hints: [
        "storage_a = 2048 × 0,023. scan_a = 900 query × 2 TB × $5.",
        "storage_b = (0,7 × 2048 × 0,004) + (0,3 × 2048 × 0,023). scan_b = 900 × 0,1 × 5.",
        "Data Parquet = 2048 / 10 GB. scan_c = 900 × (0,05 × 0,2 TB) × 5. egress_c = 0.",
        "hemat = round(biaya_a / biaya_c, 1). Cetak dengan format f-string seperti contoh.",
      ],
      code: {
        starter: `# Harga publik (ilustrasi USD — cek harga resmi terbaru)\nHARGA_STORAGE_STANDARD = 0.023   # USD/GB-bulan\nHARGA_STORAGE_GLACIER  = 0.004   # USD/GB-bulan\nHARGA_SCAN  = 5.0                # USD/TB data dipindai\nHARGA_EGRESS = 0.09              # USD/GB keluar cloud\n\ndata_gb = 2048            # 2 TB log\nquery_per_bulan = 900     # 30 query/hari x 30 hari\negress_gb = 50            # unduhan hasil ke kantor\n\n# TULIS KODEMU: arsitektur A (tanpa optimasi)\nstorage_a = \nscan_a = \negress_a = \nbiaya_a = round(storage_a + scan_a + egress_a, 2)\n\n# TULIS KODEMU: arsitektur B (partisi 5% + lifecycle 70% dingin)\nstorage_b = \nscan_b = \negress_b = \nbiaya_b = round(storage_b + scan_b + egress_b, 2)\n\n# TULIS KODEMU: arsitektur C (Parquet 10x kecil + scan 5% + egress 0)\nstorage_c = \nscan_c = \negress_c = \nbiaya_c = round(storage_c + scan_c + egress_c, 2)\n\n# TULIS KODEMU: rasio penghematan\nhemat = \n\nprint(f"arsitektur_a=USD {biaya_a:.2f}")\nprint(f"arsitektur_b=USD {biaya_b:.2f}")\nprint(f"arsitektur_c=USD {biaya_c:.2f}")\nprint(f"hemat_ac={hemat}x")`,
        lockLines: 8,
        solution: `# Harga publik (ilustrasi USD — cek harga resmi terbaru)\nHARGA_STORAGE_STANDARD = 0.023   # USD/GB-bulan\nHARGA_STORAGE_GLACIER  = 0.004   # USD/GB-bulan\nHARGA_SCAN  = 5.0                # USD/TB data dipindai\nHARGA_EGRESS = 0.09              # USD/GB keluar cloud\n\ndata_gb = 2048            # 2 TB log\nquery_per_bulan = 900     # 30 query/hari x 30 hari\negress_gb = 50            # unduhan hasil ke kantor\n\n# TULIS KODEMU: arsitektur A (tanpa optimasi)\nstorage_a = data_gb * HARGA_STORAGE_STANDARD\nscan_a = query_per_bulan * 2 * HARGA_SCAN\negress_a = egress_gb * HARGA_EGRESS\nbiaya_a = round(storage_a + scan_a + egress_a, 2)\n\n# TULIS KODEMU: arsitektur B (partisi 5% + lifecycle 70% dingin)\nstorage_b = (0.7 * data_gb * HARGA_STORAGE_GLACIER) + (0.3 * data_gb * HARGA_STORAGE_STANDARD)\nscan_b = query_per_bulan * 0.1 * HARGA_SCAN\negress_b = egress_gb * HARGA_EGRESS\nbiaya_b = round(storage_b + scan_b + egress_b, 2)\n\n# TULIS KODEMU: arsitektur C (Parquet 10x kecil + scan 5% + egress 0)\nstorage_c = (data_gb / 10) * HARGA_STORAGE_STANDARD\nscan_c = query_per_bulan * 0.01 * HARGA_SCAN\negress_c = 0\nbiaya_c = round(storage_c + scan_c + egress_c, 2)\n\n# TULIS KODEMU: rasio penghematan\nhemat = round(biaya_a / biaya_c, 1)\n\nprint(f"arsitektur_a=USD {biaya_a:.2f}")\nprint(f"arsitektur_b=USD {biaya_b:.2f}")\nprint(f"arsitektur_c=USD {biaya_c:.2f}")\nprint(f"hemat_ac={hemat}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_a", value: 9051.6, tol: 0.01, label: "`biaya_a` = 9051.6", msg: "47,104 + 9000 + 4,5 = 9051,6. Cek satuan: scan per TB." },
          { kind: "equal", task: "t2", name: "biaya_b", value: 474.37, tol: 0.01, label: "`biaya_b` = 474.37", msg: "19,8656 + 450 + 4,5 = 474,37. Lifecycle: 70% × 2048 × 0,004." },
          { kind: "equal", task: "t3", name: "biaya_c", value: 49.71, tol: 0.01, label: "`biaya_c` = 49.71", msg: "4,7104 + 45 + 0 = 49,71. Data Parquet = 2048/10 GB." },
          { kind: "equal", task: "t4", name: "hemat", value: 182.1, tol: 0.05, label: "`hemat` = 182.1", msg: "9051,6 / 49,71 ≈ 182,1. Dibulatkan 1 desimal." },
          { kind: "stdout_matches", task: "t4", pattern: "arsitektur_a=USD 9051\\.60", label: "`print` arsitektur_a=USD 9051.60", msg: "Baris pertama harus arsitektur_a=USD 9051.60." },
          { kind: "stdout_matches", task: "t4", pattern: "hemat_ac=182\\.1x", label: "`print` hemat_ac=182.1x", msg: "Baris terakhir harus hemat_ac=182.1x." },
        ],
      },
      reference: "Tiga ember: simpan (GB × kelas) + pindai (TB × $5) + kirim (GB × $0,09). Optimasi terbesar hampir selalu di 'pindai'.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: arsitektur cloud apa untuk siapa?",
      prose: [
        "Skenario 1 — Startup, pipeline ETL 10 menit tiap jam, tim 2 orang. Kondisi: beban sporadis, tidak ada yang jaga malam. Keputusan: serverless (functions) + object storage + query engine pay-per-scan. Alasan: nol waktu nganggur yang dibayar; tidak ada cluster untuk dioperasi. Contoh nyata: Dara versi bijak di bulan pertama.",
        "Skenario 2 — Perusahaan mapan, batch harian 6 jam tiap malam, pola stabil 2 tahun. Kondisi: utilisasi tinggi dan terprediksi. Keputusan: managed cluster atau VM dengan harga committed/reserved + auto-shutdown di luar jam batch. Alasan: harga per jam termurah untuk beban yang pasti jalan; yang dihemat adalah jam nganggur.",
        "Skenario 3 — Data lake 5 tahun untuk audit & regulator. Kondisi: ditulis sekali, dibaca hampir tidak pernah. Keputusan: object storage kelas Archive + lifecycle otomatis + versioning terbatas. Alasan: membayar sewa gudang termurah untuk barang yang tidak disentuh; kelas panas untuk arsip = donasi ke provider cloud.",
        "Skenario 4 — Dashboard direksi, 50 orang refresh tiap pagi. Kondisi: query berulang atas data yang sama. Keputusan: partisi + format columnar + hasil agregat di-cache (materialized), bukan query mentah tiap refresh. Alasan: memindai 2 TB untuk menjawab pertanyaan 5 GB adalah definisi pemborosan yang bisa dihitung.",
        "Aturan praktis 10 detik: (1) Siapa identitasnya? — mesin pakai role, bukan kunci abadi. (2) Di mana datanya? — database di subnet private, selalu. (3) Ember mana yang penuh? — bedah simpan/pindai/kirim sebelum menghemat. (4) Pola bebannya apa? — sporadis = serverless, stabil = reserved. (5) Apa yang mematikan cluster ini otomatis? — kalau jawabannya 'saya, manual', itu bom waktu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih arsitektur dari presentasi vendor ('serverless = masa depan') lalu memaksa semua beban ke dalamnya. Vendor menjual kemudahan, bukan tagihanmu. Pola beban adalah satu-satunya penasihat yang jujur: gambar utilisasimu selama sebulan, lalu cocokkan ke zona diagram Langkah 6.",
      },
      reference: "Identitas → jaringan → tiga ember biaya → pola beban. Urutan ini tidak boleh dibalik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: PT ArusData dan tiga penawaran",
      prose: [
        "PT ArusData: data 5 TB (5120 GB), 200 query/hari (6000/bulan), 300 GB egress per bulan ke kantor cabang. Tiga opsi di meja direksi. Opsi X (status quo): semua di Standard, query tanpa partisi memindai 5 TB penuh. Opsi Y (perbaikan): partisi (scan 2% = 0,1 TB/query) + lifecycle 60% ke Glacier + hasil dikompres sehingga egress tinggal 30 GB. Opsi Z (Y + harga committed): scan dapat diskon 30%.",
        "Tugasmu: hitung biaya bulanan ketiganya dengan rumus tiga ember, pilih yang termurah, dan tulis satu trade-off opsi pilihanmu sebagai komentar (mis. apa yang dikorbankan atau dijaga).",
        "Interpretasi yang diharapkan: selisih X vs Z sekitar 69x — dan 'termurah' bukan selalu 'terbaik' bila trade-off-nya (mis. waktu tunggu data dingin, kompleksitas partisi) tidak cocok dengan kebutuhan bisnis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_x`: 5120 GB Standard + 6000 query × 5 TB × $5 + 300 GB egress" },
        { id: "t2", text: "Hitung `biaya_y`: lifecycle 60% Glacier + scan 0,1 TB/query + egress 30 GB" },
        { id: "t3", text: "Hitung `biaya_z`: seperti Y tetapi scan diskon 30%" },
        { id: "t4", text: "Cetak ketiganya; tulis pilihan + satu trade-off sebagai komentar" },
      ],
      expected: "biaya_x=USD 150144.76 | biaya_y=USD 3062.09 | biaya_z=USD 2162.09",
      hints: [
        "biaya_x: storage = 5120 × 0,023; scan = 6000 × 5 × 5; egress = 300 × 0,09.",
        "biaya_y: storage = (0,6 × 5120 × 0,004) + (0,4 × 5120 × 0,023); scan = 6000 × 0,1 × 5; egress = 30 × 0,09.",
        "biaya_z: scan_z = scan_y × 0,7; storage & egress sama seperti Y.",
      ],
      code: {
        starter: `# PT ArusData: 5 TB, 6000 query/bln, egress 300 GB\nHARGA_STORAGE_STANDARD = 0.023\nHARGA_STORAGE_GLACIER  = 0.004\nHARGA_SCAN  = 5.0\nHARGA_EGRESS = 0.09\n\n# TULIS KODEMU: opsi X (status quo)\nbiaya_x = round(, 2)\n\n# TULIS KODEMU: opsi Y (partisi + lifecycle + egress dikompres)\nbiaya_y = round(, 2)\n\n# TULIS KODEMU: opsi Z (Y + diskon scan 30%)\nbiaya_z = round(, 2)\n\nprint(f"biaya_x=USD {biaya_x:.2f}")\nprint(f"biaya_y=USD {biaya_y:.2f}")\nprint(f"biaya_z=USD {biaya_z:.2f}")\n# Pilihanmu + satu trade-off (tulis sbg komentar):`,
        lockLines: 5,
        solution: `# PT ArusData: 5 TB, 6000 query/bln, egress 300 GB\nHARGA_STORAGE_STANDARD = 0.023\nHARGA_STORAGE_GLACIER  = 0.004\nHARGA_SCAN  = 5.0\nHARGA_EGRESS = 0.09\n\n# TULIS KODEMU: opsi X (status quo)\nbiaya_x = round(5120 * HARGA_STORAGE_STANDARD + 6000 * 5 * HARGA_SCAN + 300 * HARGA_EGRESS, 2)\n\n# TULIS KODEMU: opsi Y (partisi + lifecycle + egress dikompres)\nbiaya_y = round((0.6 * 5120 * HARGA_STORAGE_GLACIER + 0.4 * 5120 * HARGA_STORAGE_STANDARD) + 6000 * 0.1 * HARGA_SCAN + 30 * HARGA_EGRESS, 2)\n\n# TULIS KODEMU: opsi Z (Y + diskon scan 30%)\nbiaya_z = round((0.6 * 5120 * HARGA_STORAGE_GLACIER + 0.4 * 5120 * HARGA_STORAGE_STANDARD) + 6000 * 0.1 * HARGA_SCAN * 0.7 + 30 * HARGA_EGRESS, 2)\n\nprint(f"biaya_x=USD {biaya_x:.2f}")\nprint(f"biaya_y=USD {biaya_y:.2f}")\nprint(f"biaya_z=USD {biaya_z:.2f}")\n# Pilihan: Z — termurah. Trade-off: diskon committed mengunci komitmen pemakaian;\n# bila beban turun drastis, komitmen menjadi biaya hangus. Jaga fleksibilitas bila beban belum stabil.`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_x", value: 150144.76, tol: 0.01, label: "`biaya_x` = 150144.76", msg: "117,76 + 150.000 + 27 = 150.144,76." },
          { kind: "equal", task: "t2", name: "biaya_y", value: 3062.09, tol: 0.01, label: "`biaya_y` = 3062.09", msg: "59,392 + 3.000 + 2,7 = 3.062,09." },
          { kind: "equal", task: "t3", name: "biaya_z", value: 2162.09, tol: 0.01, label: "`biaya_z` = 2162.09", msg: "59,392 + 2.100 + 2,7 = 2.162,09." },
          { kind: "stdout_matches", task: "t4", pattern: "biaya_z=USD 2162\\.09", label: "`print` menampilkan biaya_z", msg: "Baris ketiga: biaya_z=USD 2162.09." },
        ],
      },
      reference: "Hitung tiga ember per opsi. Termurah ≠ terbaik — tulis trade-off-nya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran: IAM, jaringan, storage, compute, dan biaya. Perhatikan jebakan 'yang terdengar benar'.",
      ],
      tasks: [],
      summary: [
        "IAM: manusia = user, mesin = role sementara; access key abadi adalah utang keamanan; prinsipnya least privilege.",
        "Jaringan: VPC + subnet private untuk database/warehouse; security group = daftar tamu; 0.0.0.0/0 ke database = pintu belakang.",
        "Object storage: bucket + storage class (panas/dingin) + lifecycle rule otomatis; versioning = asuransi berbayar.",
        "Compute: sporadis → serverless, stabil 24/7 → reserved/managed, kustom → VM; serverless tidak selalu murah.",
        "Biaya = simpan + pindai + kirim; dua pembunuh senyap = scan tanpa partisi dan egress; pengaman = tagging, budget alert, aturan mesin.",
        "Tagihan cloud adalah cermin arsitektur: bedah ember yang penuh, bukan menghemat secara umum.",
      ],
      quiz: [
        {
          q: "Pipeline Airflow butuh membaca bucket laporan tiap jam. Cara memberi identitas yang benar?",
          options: [
            { text: "Buat access key untuk user Dara, tempel di file konfigurasi Airflow", why: "Salah: kunci abadi milik manusia dipakai mesin = tidak bisa diaudit per-mesin dan tidak kedaluwarsa. Inilah pola yang menyebabkan insiden di cerita pembuka." },
            { text: "Beri role sementara (instance role) pada mesin Airflow dengan policy baca bucket itu saja", why: "Tepat: identitas mesin = role sementara (least privilege, kedaluwarsa otomatis), bukan kunci abadi.", correct: true },
            { text: "Buka bucket menjadi public agar tidak perlu identitas", why: "Berbahaya: data internal terekspos ke internet. Jangan pernah menyelesaikan masalah IAM dengan menghilangkan IAM." },
            { text: "Pakai password database yang sama untuk semua pipeline", why: "Salah: password bersama = tidak ada akuntabilitas; satu kebocoran mematikan semua pipeline." },
          ],
        },
        {
          q: "Di mana seharusnya database warehouse berjalan?",
          options: [
            { text: "Subnet public dengan IP publik agar mudah diakses dari rumah", why: "Berbahaya: internet memindai port database 24 jam. Kemudahan ini = undangan tertulis untuk penyerang." },
            { text: "Subnet private, hanya menerima koneksi dari subnet aplikasi via security group", why: "Tepat: data di private, gerbang di public. Security group membatasi port & sumber.", correct: true },
            { text: "Di laptop data engineer, disinkron tiap pagi", why: "Bukan arsitektur cloud sama sekali — dan menimbulkan egress tiap hari." },
            { text: "Subnet public tetapi passwordnya panjang", why: "Password panjang tidak menolong bila port-nya terbuka ke seluruh internet; serangan brute-force dan exploit tidak peduli password." },
          ],
        },
        {
          q: "Data audit 4 tahun lalu wajib disimpan regulator, hampir tidak pernah dibaca. Penyimpanan yang tepat?",
          options: [
            { text: "Storage Standard agar cepat saat dibutuhkan", why: "Boros: membayar sewa termahal untuk barang yang tidak disentuh — dosa keempat Dara." },
            { text: "Kelas Archive (Glacier) dengan lifecycle rule otomatis", why: "Tepat: 5–6x lebih murah; keterlambatan pengambilan jam-an tidak masalah untuk audit.", correct: true },
            { text: "Hapus saja — regulator tidak akan mengecek", why: "Berisiko hukum: kewajiban retensi bukan opsional. Jangan menghemat dengan melanggar kepatuhan." },
            { text: "Simpan di database warehouse agar mudah di-query", why: "Termahal dari semua opsi: warehouse menagih storage + compute premium untuk data yang tidak dianalisis." },
          ],
        },
        {
          q: "Job ETL berjalan 10 menit tiap jam, tidak ada pola lain. Compute termurah?",
          options: [
            { text: "VM on-demand yang nyala 24 jam", why: "Boros: membayar 50 menit nganggur setiap jam — 83% tagihannya adalah waktu idle." },
            { text: "Serverless (functions) — bayar per eksekusi", why: "Tepat: zona utilisasi rendah/sporadis = serverless. Nol eksekusi = nol tagihan.", correct: true },
            { text: "Cluster managed dengan 10 node reserved 1 tahun", why: "Berlebihan: reserved mengunci kapasitas untuk beban yang 83% nganggur. Reserved untuk beban stabil, bukan sporadis." },
            { text: "Serverless pasti salah karena tidak ada server", why: "'Tidak ada server' ≠ 'tidak ada tagihan' — tetapi untuk pola ini serverless memang yang termurah. Argumennya harus pola beban, bukan slogan." },
          ],
        },
        {
          q: "Tagihan query membengkak. Setelah dibedah: tiap refresh dashboard memindai 2 TB penuh padahal jawabannya cuma 5 GB. Perbaikan paling tepat?",
          options: [
            { text: "Naikkan memori mesin query", why: "Tidak menyentuh akar: yang ditagih = TB dipindai, bukan RAM. Mesin lebih besar = tagihan lebih besar untuk pemborosan yang sama." },
            { text: "Partisi tabel + format columnar (Parquet) agar scan hanya menyentuh yang dibutuhkan", why: "Tepat: menyerang ember 'pindai' — dari 2 TB menjadi 0,1 TB atau kurang per query.", correct: true },
            { text: "Pindahkan data ke storage Archive", why: "Salah sasaran: archive memperlambat query dan tidak mengubah volume scan. Ini obat untuk ember 'simpan', bukan 'pindai'." },
            { text: "Kurangi jumlah refresh dashboard", why: "Mengurangi gejala, bukan penyakit — dan mengorbankan kegunaan dashboard. Perbaiki dulu arsitekturnya." },
          ],
        },
        {
          q: "Manakah pernyataan yang BENAR tentang kontrol biaya cloud?",
          options: [
            { text: "Egress antar-region dan ke internet gratis seperti transfer internal", why: "Salah: inilah 'pajak tak terlihat' — egress ditagih per GB dan sering luput dari perhitungan." },
            { text: "Tagging resource + budget alert + aturan mesin (lifecycle, auto-shutdown) adalah tiga pengaman wajib", why: "Tepat: tag = tagihan bisa ditelusur, alert = tahu sebelum invoice, aturan mesin = disiplin yang tidak bergantung ingatan manusia.", correct: true },
            { text: "Storage selalu menjadi komponen tagihan terbesar", why: "Mitos yang dibantah lab lesson ini: storage 2 TB cuma ~$47/bulan vs scan $9.000/bulan. Bedah dulu, baru simpulkan." },
            { text: "Budget alert cukup — tidak perlu aturan otomatis", why: "Alert tanpa aturan otomatis = tahu ada kebakaran tapi tidak punya pemadam. Disiplin manusia kalah konsisten dari lifecycle & auto-shutdown." },
          ],
        },
      ],
    },
  ],
};
