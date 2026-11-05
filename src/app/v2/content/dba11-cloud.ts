import type { V2Lesson } from "../lib/types";

// Shared responsibility: vendor (fisik, hypervisor, patching engine) vs kamu (data, akses, query, parameter).
const SHARED_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Diagram shared responsibility: vendor mengurus mesin, kamu mengurus perilaku.">
<g font-family="var(--font-ui)">
<text x="130" y="24" text-anchor="middle" font-size="13" fill="var(--chart-text)" font-weight="700">VENDOR (cloud)</text>
<text x="350" y="24" text-anchor="middle" font-size="13" fill="var(--chart-text)" font-weight="700">KAMU</text>
<g font-size="11">
<rect x="30" y="38" width="200" height="28" rx="6" fill="var(--c3)" opacity="0.5"/><text x="130" y="56" text-anchor="middle" fill="var(--text)">Fisik &amp; network</text>
<rect x="30" y="72" width="200" height="28" rx="6" fill="var(--c3)" opacity="0.5"/><text x="130" y="90" text-anchor="middle" fill="var(--text)">Patching engine DB</text>
<rect x="30" y="106" width="200" height="28" rx="6" fill="var(--c3)" opacity="0.5"/><text x="130" y="124" text-anchor="middle" fill="var(--text)">Backup otomatis (file)</text>
<rect x="30" y="140" width="200" height="28" rx="6" fill="var(--c3)" opacity="0.5"/><text x="130" y="158" text-anchor="middle" fill="var(--text)">Failover infrastruktur</text>
<rect x="250" y="38" width="200" height="28" rx="6" fill="var(--c1)" opacity="0.4"/><text x="350" y="56" text-anchor="middle" fill="var(--text)">Data &amp; skema</text>
<rect x="250" y="72" width="200" height="28" rx="6" fill="var(--c1)" opacity="0.4"/><text x="350" y="90" text-anchor="middle" fill="var(--text)">User, role, least privilege</text>
<rect x="250" y="106" width="200" height="28" rx="6" fill="var(--c1)" opacity="0.4"/><text x="350" y="124" text-anchor="middle" fill="var(--text)">Indeks, query plan, tuning</text>
<rect x="250" y="140" width="200" height="28" rx="6" fill="var(--c1)" opacity="0.4"/><text x="350" y="158" text-anchor="middle" fill="var(--text)">Parameter &amp; capacity</text>
<rect x="250" y="174" width="200" height="28" rx="6" fill="var(--c4)" opacity="0.5"/><text x="350" y="192" text-anchor="middle" fill="var(--text)">Uji restore &amp; RPO/RTO</text>
</g>
<text x="240" y="208" text-anchor="middle" font-size="10" fill="var(--text-muted)">Garis batas: vendor menjaga MESIN, kamu menjaga PERILAKU</text>
</g></svg>`;

export const dba11: V2Lesson = {
  slug: "dba11-cloud",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA11 — Managed Database di Cloud",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-rds-down",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sudah di RDS, tetap down 2 jam",
      prose: [
        "TokoKita (DBA1) akhirnya pindah ke managed database. \u201CSekarang urusan database beres,\u201D kata CTO, membubarkan \u201Ctim database\u201D (satu orang). Tiga bulan kemudian: checkout lambat 30 detik, lalu timeout massal. Penyebab? Sama persis seperti DBA1: max_connections default + query tanpa indeks. RDS tidak mengubah parameter sendiri; ia tidak tahu workload-mu.",
        "Twist-nya: mereka membayar 3x lipat dari server lama untuk masalah yang sama — karena membeli managed service sambil membuang orang yang mengerti database. Managed database mengotomasi PEKERJAAN, bukan PENGETAHUAN. Tanpa pengetahuan, kamu hanya mengotomasi kegagalan dengan harga lebih mahal.",
        "Vendor cloud punya nama resmi untuk ini: shared responsibility — tanggung jawab bersama. Lesson ini memetakan garis batasnya: apa yang benar-benar diurus vendor, dan apa yang tetap menjadi tanggung jawabmu (spoiler: lebih banyak dari yang dikira marketing).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CManaged = tidak butuh orang database\u201D",
        body: "Managed menghilangkan install, patching OS, dan backup file dasar. Ia TIDAK menghilangkan: memilih ukuran instance, tuning parameter, membuat indeks, membaca query plan, merancang skema, mengatur akses, menguji restore, dan merencanakan kapasitas. Itu 80% pekerjaan DBA — yang tersisa justru bagian yang butuh otak.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menghitung TCO jujur managed vs self-hosted.",
        "(1) Menghitung TCO self-hosted: server + lisensi + (yang sering dilupakan) biaya orang;",
        "(2) Menghitung titik impas reserved instance dari biaya muka dan selisih tarif;",
        "(3) Menjelaskan garis shared responsibility: apa yang masih tanggung jawabmu di managed;",
        "(4) Memilih managed/self-hosted/hybrid berdasar beban kerja — bukan berdasar hype.",
      ],
      tasks: [],
    },

    {
      id: "shared-responsibility",
      eyebrow: "Langkah 3 · Tanggung jawab",
      title: "Shared responsibility: garis batas yang jujur",
      prose: [
        "Cara membaca diagram: kolom kiri = vendor (RDS/Cloud SQL/AlloyDB): fisik, network, patching engine database, file backup otomatis, failover infrastruktur. Kolom kanan = KAMU: data & skema, user/role/least privilege (DBA7), indeks & query plan (DBA6), parameter & capacity (DBA3, DBA9), dan — yang paling sering dilupakan — menguji restore & memenuhi RPO/RTO (DBA4).",
        "Interpretasi: vendor menjaga MESIN tetap hidup; kamu menjaga PERILAKU tetap benar. Database yang lambat karena indeks hilang (DBA6), down karena koneksi jenuh (DBA1), atau bocor karena superuser di aplikasi (DBA7) — semuanya di sisi kanan garis. Tidak ada tombol \u201Cmanaged\u201D yang memperbaikinya.",
        "💡 Intuisi: tanya \u201Csiapa yang disalahkan jika ini gagal?\u201D untuk tiap komponen. Jika jawabannya \u201Cvendor\u201D — bagus, itu yang kamu bayar. Jika \u201Ckami\u201D — pastikan ada orang & runbook-nya. Kebanyakan kekecewaan managed database berasal dari komponen yang dikira vendor, ternyata \u201Ckami\u201D.",
      ],
      figure: {
        svg: SHARED_SVG,
        alt: "Diagram shared responsibility: vendor mengurus mesin, kamu mengurus perilaku database.",
        caption: "Garis batas: vendor = mesin hidup; kamu = perilaku benar. Sisi kanan tetap butuh keahlian DBA.",
      },
      tasks: [],
    },
    {
      id: "fitur-managed",
      eyebrow: "Langkah 4 · Fitur",
      title: "Yang memang enak dari managed (pakai dengan benar)",
      prose: [
        "Tiga fitur yang genuinely menghemat waktu. **Automated backup + PITR**: backup harian + WAL archiving dikelola vendor, restore ke titik waktu via klik. Tetapi: uji restore tetap tugasmu (DBA4), dan retensi default (7 hari) sering kurang untuk compliance — naikkan sesuai kebutuhan.",
        "**Multi-AZ failover**: standby sinkron di zona berbeda, failover otomatis 1–2 menit. Tetapi: failover-nya failover INFRASTRUKTUR — lag aplikasi, DNS caching, dan split-brain (DBA5) tetap perlu kamu rancang. Dan \u201Cotomatis\u201D bukan \u201Cinstan\u201D: 2 menit masih downtime.",
        "**Read replica sekali klik + auto-scaling storage**: replica untuk beban baca (DBA5, DBA9) tanpa operasi manual; storage membesar otomatis. Tetapi: auto-scale hanya ke ATAS (tidak mengecil — tagihan tidak turun), dan IOPS/throughput tetap perlu kamu ukur.",
        "💡 Intuisi: managed unggul di hal REPETITIF dan INFRASTRUKTUR; lemah di hal yang butuh KONTEKS BISNIS (berapa RPO kita? query mana kritis?). Beli managed untuk yang pertama, pertahankan keahlian untuk yang kedua.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CAuto-scaling = auto-hemat\u201D",
        body: "Storage managed auto-scale ke atas tetapi jarang ke bawah — tagihan mengikuti puncak, bukan rata-rata. Banyak tim kaget tagihan 3x setelah lonjakan sekali. Set alert budget + pahami apa yang scale otomatis dan apa yang tidak.",
        type: "pitfall",
      },
    },
    {
      id: "lab-tco",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: TCO jujur — servernya murah, orangnya mahal",
      prose: [
        "Startup 20 orang, tanpa DBA penuh waktu. Opsi A (self-hosted): server $400/bln + konsultan DBA 20 jam × $50 untuk operasi + backup storage 500 GB @ $0,023/GB. Opsi B (managed): instance $0,35/jam × 730 jam + storage 100 GB @ $0,115/GB + backup 500 GB @ $0,023/GB.",
        "Tugasmu: hitung TCO bulanan keduanya + selisihnya. Interpretasi: $1.412 vs $278 — managed 5x lebih murah?! Kuncinya: $1.000 dari $1.412 adalah WAKTU MANUSIA. Pelajaran TCO: biaya server jarang menjadi penentu; biaya orang (atau risiko tanpa orang) yang menentukan.",
        "Tetapi baca juga sisi sebaliknya: di skala 50 instance dengan tim DBA in-house 3 orang (biaya tetap), self-hosted bisa berbalik lebih murah — karena biaya orangnya sudah tenggelam (sunk). Coba eksplorasi: jika jam konsultan = 0 (ada tim in-house), berapa TCO self-hosted? Kapan kurvanya berbalik? Inilah aritmetika \u201Ckapan pindah ke managed\u201D yang sebenarnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tco_self` ($/bln)" },
        { id: "t2", text: "Hitung `tco_managed` ($/bln)" },
        { id: "t3", text: "Hitung `selisih` = tco_self − tco_managed" },
      ],
      expected: "tco_self=1412  tco_managed=278  selisih=1134",
      note: {
        title: "Sering salah",
        body: "Lupa mengalikan $/jam dengan 730 jam/bulan, atau lupa komponen backup storage. TCO = semua komponen, bukan cuma \u201Charga instance\u201D yang dipajang di marketing.",
      },
      hints: [
        "tco_self = 400 + 20*50 + 0.023*500.",
        "tco_managed = 0.35*730 + 0.115*100 + 0.023*500.",
        "Bulatkan ke dolar terdekat dengan round().",
      ],
      code: {
        starter: `# Kalkulator TCO bulanan\n# Baris ini disiapkan (jangan diubah)\njam_per_bulan = 730\n\n# TULIS KODEMU: TCO self-hosted vs managed ($/bln, bulatkan)\ntco_self = \ntco_managed = \nselisih = \n\nprint(f"tco_self={tco_self}  tco_managed={tco_managed}  selisih={selisih}")`,
        lockLines: 3,
        solution: `# Kalkulator TCO bulanan\n# Baris ini disiapkan (jangan diubah)\njam_per_bulan = 730\n\n# TULIS KODEMU: TCO self-hosted vs managed ($/bln, bulatkan)\ntco_self = round(400 + 20*50 + 0.023*500)\ntco_managed = round(0.35*jam_per_bulan + 0.115*100 + 0.023*500)\nselisih = tco_self - tco_managed\n\nprint(f"tco_self={tco_self}  tco_managed={tco_managed}  selisih={selisih}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tco_self", value: 1412, tol: 1, label: "`tco_self` = $1412", msg: "400 + 1000 + 11,5 = 1411,5 → 1412." },
          { kind: "equal", task: "t2", name: "tco_managed", value: 278, tol: 1, label: "`tco_managed` = $278", msg: "255,5 + 11,5 + 11,5 = 278,5 → 278." },
          { kind: "equal", task: "t3", name: "selisih", value: 1134, tol: 1, label: "`selisih` = $1134", msg: "1412 − 278 = 1134." },
          { kind: "stdout_matches", task: "t3", pattern: "tco_self=1412\\s+tco_managed=278\\s+selisih=1134", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "TCO = server + orang + storage + backup. $/jam × 730.",
    },    {
      id: "lab2-breakeven-reserved",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: titik impas reserved instance",
      prose: [
        "Reserved instance lebih murah — JIKA dipakai cukup. Tugasmu: hitung biaya bulanan on-demand vs reserved pada utilisasi 100%, lalu cari titik impas: utilisasi berapa keduanya sama?",
        "Titik impas ~0,34: di atas 34% utilisasi, reserved menang. Database produksi yang jalan 24/7 (utilisasi ~1,0) hampir selalu menang dengan reserved — tetapi database dev yang hidup 8 jam sehari kalah.",
        "Coba juga: bagaimana jika workload musiman (100% di siang hari, 10% di malam hari)? Rata-rata utilisasi menipu lagi — hitung per jam, bukan per bulan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_od` dan `biaya_ri` bulanan pada utilisasi 1,0" },
        { id: "t2", text: "Hitung `breakeven_util`: u saat biaya sama (3 desimal)" },
      ],
      expected: "biaya_od=365.0  biaya_ri=221.0",
      note: {
        title: "Sering salah",
        body: "Membandingkan tarif per jam saja ($0,50 vs $0,20) dan lupa $2.600 di muka. Biaya muka dibagi 12 bulan = $216,67/bulan yang harus 'dibayar' oleh selisih tarif.",
      },
      hints: [
        "biaya_ri(u) = 2600/12 + 0.20*730*u; biaya_od(u) = 0.50*730*u.",
        "Samakan: u = (2600/12) / ((0.50-0.20)*730).",
        "Bulatkan 3 desimal.",
      ],
      code: {
        starter: `# On-demand $0,50/jam. Reserved 1 tahun: $900 di muka + $0,20/jam.\n# Beban: 730 jam/bulan × utilisasi.\nOD_JAM, RI_MUKA, RI_JAM, JAM_BLN = 0.50, 900, 0.20, 730\n# TULIS KODEMU: biaya_od, biaya_ri, breakeven_util\nbiaya_od, biaya_ri = 0.0, 0.0\nbreakeven_util = 0.0\n`,
        lockLines: 3,
        solution: `# On-demand $0,50/jam. Reserved 1 tahun: $900 di muka + $0,20/jam.\n# Beban: 730 jam/bulan × utilisasi.\nOD_JAM, RI_MUKA, RI_JAM, JAM_BLN = 0.50, 900, 0.20, 730\n\n# TULIS KODEMU: biaya_od, biaya_ri, breakeven_util\ndef biaya_od(u): return OD_JAM * JAM_BLN * u\ndef biaya_ri(u): return RI_MUKA / 12 + RI_JAM * JAM_BLN * u\n# cari u saat biaya_ri == biaya_od\nbreakeven_util = round((RI_MUKA / 12) / ((OD_JAM - RI_JAM) * JAM_BLN), 3)\nbiaya_od = round(biaya_od(1.0), 2)\nbiaya_ri = round(biaya_ri(1.0), 2)\n\nprint(f"biaya_od={biaya_od}  biaya_ri={biaya_ri}")\nprint(f"breakeven_util={breakeven_util}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_od", value: 365.0, tol: 0.01, label: "`biaya_od` = 365", msg: "0,50×730." },
          { kind: "equal", task: "t1", name: "biaya_ri", value: 221.0, tol: 0.01, label: "`biaya_ri` = 221", msg: "900/12 + 0,20×730." },
          { kind: "equal", task: "t2", name: "breakeven_util", value: 0.342, tol: 0.001, label: "`breakeven_util` = 0,342", msg: "Titik impas." },
        ],
      },
      reference: "Breakeven reserved: biaya muka / (selisih tarif × jam).",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 'Servernya murah, orangnya mahal': TCO self-hosted yang lupa menghitung gaji DBA on-call = fiksi. Hitung orangnya — seringkali ia 3-5x lipat biaya servernya.",
        "💡 Reserved instance adalah taruhan pada stabilitas workload-mu. Beli untuk baseline yang pasti jalan 24/7; biarkan on-demand untuk spike. Campuran keduanya > salah satu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tagihan cloud adalah dashboard yang wajib dibuka tiap Senin",
        body: "Di cloud, tagihan adalah metrik operasional — perlakukan seperti CPU. DBA on-premise memonitor disk; DBA cloud WAJIB memonitor dolar, dengan urgensi yang sama. Heuristik praktisinya: buka dashboard biaya tiap Senin pagi, seperti membuka dashboard monitoring. Atur budget alert di 50%, 80%, 100% — plus satu anomaly alert untuk lonjakan harian di atas 30%. Tagihan $4.800 yang \"tiba-tiba\" tidak pernah tiba-tiba; ia tumbuh sedikit demi sedikit selama 3 bulan sementara tidak ada yang melihat. Jebakan klasiknya ada empat: read replica yang lupa dimatikan setelah testing, snapshot lama yang menumpuk (setiap snapshot = tagihan bulanan), instance dev yang hidup 24/7 padahal dipakai jam kerja saja, dan — favorit sepanjang masa — data transfer antar region yang tidak disadari. Aturan \"tiga label\": setiap resource wajib punya tag owner, project, dan environment — resource tanpa owner = kandidat hapus Jumat sore. Uji hemat termurahnya: jadwalkan instance non-prod mati di luar jam kerja (cron stop/start) — menghemat sekitar 65% biaya dev/staging tanpa pengorbanan apa pun. Dan untuk workload stabil 24/7, reserved atau savings plan untuk baseline + on-demand untuk spike — campuran keduanya hampir selalu lebih murah daripada salah satu. Cloud tidak mahal; cloud yang tidak dimonitor yang mahal. Orang yang sama yang panik saat CPU 90% harus panik saat burn rate naik 90% — keduanya adalah sistem yang meminta perhatian.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: managed, self-hosted, atau hybrid?",
      prose: [
        "Skenario 1 — Tim < 20 orang, tanpa DBA. → Managed penuh. Alasan: TCO manusia mendominasi; $278 vs $1.412 bukan perbandingan yang dekat.",
        "Skenario 2 — 50+ instance, tim platform ada. → Hybrid: managed untuk beban standar, self-hosted untuk beban khusus (butuh extension/custom). Alasan: skala membalik aritmetika TCO; kontrol penuh untuk kasus eksotis.",
        "Skenario 3 — Data harus di data center sendiri (regulasi). → Self-hosted / on-prem — atau managed di region yang comply. Alasan: kepatuhan mengalahkan TCO; tetapi hitung denda vs biaya dengan jujur.",
        "Skenario 4 — \u201CKita pakai managed agar tidak perlu belajar database.\u201D → Ditolak mentah-mentah: tetap butuh pengetahuan DBA (indeks, parameter, RPO). Alasan: managed mengotomasi pekerjaan, bukan pengetahuan — TokoKita membayar mahal untuk pelajaran ini.",
        "Aturan praktis 10 detik: managed = beli waktu manusia; self-hosted = beli kontrol. Pilih berdasar mana yang lebih mahal bagimu: waktu atau kontrol.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: tagihan $4.800 yang \u201Ctiba-tiba\u201D",
      prose: [
        "SaaSKita pindah ke managed: bulan 1 tagihan $290 (sesuai lab). Bulan 4: $4.800. Forensik: (1) auto-scale storage naik 100 GB → 2 TB setelah viral sesaat — tidak pernah turun; (2) 6 read replica dibuat saat load test — tidak pernah dihapus; (3) backup retensi 35 hari × 2 TB.",
        "Hitung: storage 2 TB @ $0,115 = $230; 6 replica @ $255 = $1.530; backup 2 TB × 35 hari prorata ≈ $1.600; sisanya IOPS. Total menjelaskan $4.800. Solusi 1 jam: hapus 5 replica tak terpakai (−$1.275), turunkan retensi ke 14 hari (−$960), snapshot + shrink storage terjadwal (−$150). Tagihan kembali ~$1.400 — dan alert budget dipasang.",
        "Pembahasan: managed tidak mahal — managed yang TIDAK DIKELOLA yang mahal. Pelajaran: (1) auto-scale butuh batas & alert; (2) sumber daya sementara butuh tanggal kedaluwarsa (ingat temporary grant DBA7 — pola yang sama!); (3) review tagihan bulanan adalah pekerjaan DBA cloud, sama wajibnya dengan review GRANT.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang managed database dan shared responsibility.",
      ],
      tasks: [],
      summary: [
        "Managed mengotomasi pekerjaan, bukan pengetahuan — sisi kanan garis (perilaku) tetap butuh DBA.",
        "Vendor: mesin hidup. Kamu: data, akses, indeks, parameter, capacity, uji restore.",
        "TCO jujur memasukkan biaya manusia — itulah yang biasanya menentukan.",
        "Auto-scale butuh batas + alert budget; sumber daya sementara butuh kedaluwarsa.",
        "Managed = beli waktu manusia; self-hosted = beli kontrol.",
      ],
      next: { label: "DBA12 — Capstone: Operasional Database Produksi", href: "/v2/learn/dba12-capstone" },
      quiz: [
        {
          q: "Sudah di RDS tetapi down karena max_connections default + tanpa indeks. Kesimpulan?",
          options: [
            { text: "RDS-nya rusak", why: "RDS sehat; yang salah konfigurasi & indeks — sisi kanan garis." },
            { text: "Shared responsibility: parameter & indeks tetap tanggung jawabmu; managed tak memperbaikinya otomatis", why: "Vendor menjaga mesin, bukan perilaku. Pengetahuan DBA tetap wajib.", correct: true },
            { text: "Harus pindah vendor", why: "Semua vendor managed punya garis batas yang sama." },
            { text: "Naikkan instance 10x", why: "Membayar 10x untuk masalah konfigurasi = TokoKita jilid 2." },
          ],
        },
        {
          q: "Mana yang menjadi tanggung jawab VENDOR dalam shared responsibility?",
          options: [
            { text: "Membuat indeks yang tepat", why: "Itu sisi kamu (perilaku)." },
            { text: "Patching engine database & failover infrastruktur", why: "Inilah yang kamu bayar: mesin tetap hidup & mutakhir.", correct: true },
            { text: "Menguji restore backup-mu", why: "Backup file-nya vendor sediakan; validitasnya kamu buktikan." },
            { text: "Menentukan RPO/RTO bisnis", why: "Keputusan bisnis — hanya kamu yang tahu biaya downtime-mu." },
          ],
        },
        {
          q: "Self-hosted $1.412 vs managed $278. Komponen penentu selisihnya?",
          options: [
            { text: "Harga server", why: "$400 vs $255 — selisih kecil." },
            { text: "Biaya manusia: 20 jam × $50 konsultan DBA = $1.000", why: "TCO ditentukan orang, bukan server. Inilah inti lab.", correct: true },
            { text: "Harga storage", why: "Komponen kecil di kedua sisi." },
            { text: "Biaya network", why: "Tidak dihitung di model ini." },
          ],
        },
        {
          q: "Tagihan managed meledak 16x dalam 3 bulan. Penyebab paling mungkin?",
          options: [
            { text: "Vendor menaikkan harga diam-diam", why: "Jarang; biasanya pemakaian tak terkelola." },
            { text: "Sumber daya tak terkelola: auto-scale tak turun, replica lupa dihapus, retensi berlebihan", why: "Pola klasik: managed yang tidak dikelola. Solusinya batas + alert + review.", correct: true },
            { text: "Managed memang selalu mahal", why: "Bulan 1 hanya $290 — mahalnya dari kelalaian, bukan modelnya." },
            { text: "Harus kembali on-prem", why: "Reaksi emosional; perbaiki pengelolaan dulu." },
          ],
        },
        {
          q: "Tim 50+ instance dengan tim platform. Strategi tepat?",
          options: [
            { text: "Semua managed, lupakan database", why: "Mitos DBA11: pengetahuan tetap dibutuhkan." },
            { text: "Hybrid: managed untuk standar, self-hosted untuk khusus; TCO dihitung ulang per skala", why: "Skala membalik aritmetika; kontrol untuk kasus eksotis.", correct: true },
            { text: "Semua self-hosted agar hemat", why: "Mengabaikan biaya manusia & operasional di skala besar." },
            { text: "Pilih yang hype", why: "Bukan kriteria engineering." },
          ],
        },
        {
          q: "Database dev hidup 8 jam/hari, 5 hari/minggu. Seseorang mengusulkan reserved 1 tahun 'karena lebih murah'. Tanggapanmu?",
          options: [
            { text: "Setuju — reserved selalu lebih murah", why: "'Selalu' salah: utilisasi dev ≈ (8×5)/(24×7) ≈ 24% < breakeven 34%. Di bawah titik impas, reserved LEBIH MAHAL. Reserved adalah taruhan pada utilisasi tinggi." },
            { text: "Tolak — utilisasi ~24% di bawah breakeven 34%; pakai on-demand/spot", why: "Tepat: hitung dulu, beli kemudian. Breakeven 34% adalah garisnya; dev di 24% kalah dengan reserved. On-demand (atau stop saat tidak dipakai — penghematan terbesar!) adalah jawabannya.", correct: true },
            { text: "Beli reserved untuk jaga-jaga", why: "'Jaga-jaga' = membayar $900 untuk keyakinan. Keyakinan tidak butuh dibayar; yang butuh = utilisasi." },
            { text: "Pindah ke server fisik", why: "Mengganti model bisnis tidak menjawab pertanyaan utilisasi. Fisik dengan utilisasi 24% = lebih boros lagi." },
          ],
        },
      ],
    },
  ],
};
