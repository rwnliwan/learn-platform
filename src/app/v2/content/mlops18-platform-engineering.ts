import type { V2Lesson } from "../lib/types";

// Biaya bulanan waktu menunggu: tiket infra Rp378 jt vs self-service Rp48,375 jt (lab Langkah 6).
const FIG_BIAYA = `<svg viewBox="0 0 480 230" role="img" aria-label="Biaya bulanan waktu menunggu: tiket infra Rp378 juta, self-service Rp48,4 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="200" y1="30" x2="200" y2="180"/></g>
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">
<text x="192" y="84">Tiket infra (dunia A)</text><text x="192" y="154">Self-service (dunia B)</text>
</g>
<rect x="200" y="60" width="250" height="30" rx="3" fill="var(--c4)"/>
<text x="456" y="80" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">Rp378 jt/bln</text>
<rect x="200" y="130" width="32" height="30" rx="3" fill="var(--c1)"/>
<text x="244" y="150" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp48,4 jt/bln</text>
<text x="340" y="205" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">biaya bulanan waktu menunggu 10 data scientist — 7,8x lebih murah</text>
</svg>`;

export const mlops18: V2Lesson = {
  slug: "mlops18-platform-engineering",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps18 — Platform Engineering untuk ML",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Platform 8 bulan yang dipakai 2 dari 40 orang",
      prose: [
        "Januari 2026. SinarLog, perusahaan logistik dengan 40 data scientist, punya masalah klasik: tiap kali butuh GPU untuk eksperimen, tiket ke tim infra antre 2–3 minggu. CTO-nya memutuskan solusi berani: bentuk tim platform 4 engineer, bangun Internal Developer Platform (IDP) khusus ML — provisioning GPU sekali klik, template training, monitoring terpasang otomatis. Delapan bulan. Anggaran Rp1,44 miliar. Launch day tiba dengan demo yang mulus dan tepuk tangan.",
        "Tiga bulan kemudian, audit pemakaian keluar: 2 dari 40 data scientist yang memakai platform. Dua. Sisanya tetap dengan cara lama: pinjam GPU teman, sewa instance sendiri pakai kartu kredit pribadi, atau antre tiket seperti biasa. Tim platform bingung: `platformnya kan lebih bagus?` — dan memang, secara teknis, platformnya bagus. Kode rapi, arsitektur modern, semua best practice tercentang.",
        "Twist-nya: tim audit mewawancarai 12 data scientist dan menemukan tiga hal yang tidak pernah terpikir tim platform. Satu: onboarding platform butuh 3 hari membaca dokumentasi 40 halaman — sementara `jalan tikus` butuh 20 menit. Dua: golden path-nya dirancang untuk use case `ideal` yang tidak dimiliki siapa pun; 9 dari 10 eksperimen nyata tidak muat di template. Tiga — dan ini yang paling menyakitkan: selama 8 bulan pembangunan, tim platform TIDAK PERNAH mewawancarai satu pun data scientist. Mereka membangun untuk pengguna imajiner.",
        "Prasyarat lesson ini (ringkas, 3 kalimat): kamu perlu paham alur kerja ML dasar (eksperimen → training → deploy — ringkasan MLOps1) dan konsep CI/CD (kode di-review lalu di-deploy otomatis; ringkasan MLOps5). Tidak perlu pengalaman membangun platform. Semua istilah platform engineering dijelaskan dari nol dengan angka konkret.",
        "⚠️ PEMBEDA SUDUT (anti-tumpang-tindih): lesson ini TENTANG platform SEBAGAI PRODUK — golden path, self-service, metrik tim platform, kapan membangun vs membeli. Ia BUKAN tentang teknologi spesifiknya — Terraform, Kubernetes, dan FinOps di sini adalah alat, bukan produknya. Lesson ini bertanya `platform seperti apa yang benar-benar dipakai orang — dan kapan sebaiknya tidak membangunnya`.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung pajak inovasi (biaya menunggu infra) untuk tim; (2) menjelaskan konsep golden path dan kapan jalan tikus tetap sah; (3) merancang guardrails untuk self-service (kuota, budget, auto-destroy); (4) memilih metrik keberhasilan tim platform; (5) mengidentifikasi tiga jebakan membangun platform; (6) memutuskan bangun vs beli vs tunda dengan peta keputusan.",
        "Durasi 65 menit · 1 lab kalkulator · 6 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita SinarLog · 2) Pajak inovasi · 3) Golden path · 4) Self-service dengan guardrails · 5) Tim platform sebagai produk · 6) Lab: hitung pajak menunggumu · 7) Tiga jebakan · 8) Peta keputusan · 9) Mini-case: audit KlinikData · 10) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `platform gagal = teknologinya kurang bagus`",
        type: "pitfall",
        body: "Platform SinarLog secara teknis BAGUS — dan tetap gagal. Kegagalan platform hampir tidak pernah soal teknologi; ia soal ADOPSI: apakah lebih mudah dari cara lama? Platform yang dipakai 2 dari 40 orang bukan platform — ia monumen. Ukuran keberhasilan platform bukan `selesai dibangun`, melainkan `dipakai tanpa disuruh`.",
      },
      reference: "Platform yang tidak dipakai = monumen, bukan platform.",
    },
    {
      id: "pajak-menunggu",
      eyebrow: "Langkah 2 · Konsep",
      title: "Pajak inovasi: kenapa menunggu itu mahal",
      prose: [
        "PAJAK INOVASI (innovation tax) = biaya tersembunyi yang dibayar tim setiap kali pekerjaan tertahan menunggu infra: data scientist idle 2 minggu menunggu GPU, eksperimen tertunda, model basi sebelum rilis. Tidak ada yang menagih pajak ini — ia tidak muncul di invoice cloud — tapi ia nyata: 10 data scientist × 7 hari tunggu × Rp225 ribu/jam = Rp126 juta untuk SATU putaran permintaan. Ulangi tiap bulan.",
        "LEAD TIME EKSPERIMEN = waktu dari `ada ide` sampai `eksperimen berjalan`. Di dunia tiket infra SinarLog: 2–3 minggu (tiket → antre → approval → provisioning manual). Di dunia self-service yang baik: 30 menit. Rasio 112x. Lead time panjang tidak cuma membuang gaji — ia membunuh eksperimen: ide yang butuh 3 minggu untuk diuji biasanya mati sebelum diuji. Inovasi yang tidak pernah dicoba = inovasi yang tidak ada.",
        "Tiga komponen pajak inovasi: (1) BIAYA LANGSUNG — gaji × jam idle (bisa dihitung, lihat lab); (2) BIAYA MODEL BASI — model fraud yang telat 3 minggu di tengah lonjakan transaksi = kerugian yang jauh lebih besar dari gaji (tidak bisa dihitung presisi, tapi selalu lebih besar dari komponen 1); (3) BIAYA TALENTA — data scientist terbaik pergi duluan karena `di sini ngapa-ngapain nunggu`. Komponen 3 tidak ada angkanya di spreadsheet, tapi ada di surat resign.",
        "Cara membaca chart: sumbu X = rupiah per bulan (biaya waktu menunggu 10 data scientist); panjang batang = besar biaya. Interpretasi: dunia tiket (Rp378 jt/bln) 7,8x lebih mahal dari dunia self-service (Rp48,4 jt/bln — sudah termasuk biaya platform). Selisih Rp329,6 jt/bln = pajak inovasi yang dibayar tiap bulan tanpa disadari. Chart ini memakai angka lab Langkah 6 — kamu akan menghitungnya sendiri.",
      ],
      figure: {
        svg: FIG_BIAYA,
        alt: "Diagram batang: biaya bulanan waktu menunggu tiket infra Rp378 juta vs self-service Rp48,4 juta.",
        caption: "Pajak inovasi bulanan 10 data scientist: tiket infra vs self-service (angka dari lab Langkah 6).",
      },
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `menunggu itu gratis karena gaji tetap dibayar`",
        type: "pitfall",
        body: "Gaji tetap dibayar = biaya tetap keluar TANPA hasil. Itu definisi pemborosan, bukan penghematan. Analogi: membayar sopir taksi yang parkir 7 jam karena kamu lupa bawa kunci mobil — argonya jalan terus. Bedanya, `kunci mobil` di sini = GPU yang tidak kunjung datang.",
      },
      reference: "Pajak inovasi = gaji × jam idle + model basi + talenta yang pergi.",
    },
    {
      id: "golden-path",
      eyebrow: "Langkah 3 · Konsep",
      title: "Golden path: jalan resmi yang paling mudah",
      prose: [
        "GOLDEN PATH (paved road) = jalur resmi yang DIBUAT PALING MUDAH: template training job (GPU + logging + checkpointing terpasang), template serving (endpoint + autoscaling + monitoring), template eksperimen (notebook → job terjadwal). Kuncinya: golden path harus LEBIH MUDAH dari jalan tikus. Kalau onboarding-nya 3 hari dan docs-nya 40 halaman (SinarLog!), ia bukan golden path — ia jalan tol yang gerbangnya dikunci.",
        "Anatomi golden path yang benar: (1) TEMPLATE — `satu perintah` dari nol ke jalan (contoh: `ml new training-job` menghasilkan repo siap pakai); (2) DEFAULT AMAN — monitoring, logging, versioning, dan kuota TERPASANG OTOMATIS, bukan checklist yang harus diingat; (3) ESCAPE HATCH — jalan tikus TETAP BOLEH untuk use case eksotis (GPU langka, riset aneh) — platform yang memaksa 100% use case lewat satu jalur akan dibenci dan ditinggalkan.",
        "Aturan 80/20 platform: golden path melayani 80% use case umum (training standar, serving standar, batch standar) dengan sangat baik; 20% eksotis dibiarkan lewat jalan tikus TANPA DIHUKUM. SinarLog gagal di sini: golden path mereka dirancang untuk use case ideal yang tidak dimiliki siapa pun, dan jalan tikus dilarang oleh policy — hasilnya 38 orang memilih `melanggar policy diam-diam` daripada memakai platform.",
        "Uji golden path dalam 1 jam: ambil engineer yang BELUM PERNAH memakai platform, minta ia menjalankan training job dari nol TANPA bertanya ke siapa pun. Kalau >1 jam atau ia menyerah = golden path-mu gagal, tidak peduli sebagus apa arsitekturnya. Platform diukur dari pengalaman pengguna pertamanya, bukan dari diagram arsitekturnya.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: golden path = jalan tol, jalan tikus = gang",
        body: "Jalan tol yang bagus = orang MEMILIH lewat sana karena lebih cepat, bukan karena gangnya ditembok. SinarLog menembok semua gang TAPI gerbang tolnya macet 3 hari — wajar orang menerobos. Platform yang sehat: tolnya lancar (onboarding <1 jam) DAN gangnya tetap ada untuk yang tahu jalan pintas.",
      },
      reference: "Golden path = paling mudah + default aman + escape hatch. Uji 1 jam oleh orang baru.",
    },
    {
      id: "self-service",
      eyebrow: "Langkah 4 · Konsep",
      title: "Self-service dengan guardrails",
      prose: [
        "SELF-SERVICE = data scientist bisa provisioning sendiri (GPU, environment, endpoint) TANPA tiket dan TANPA menunggu manusia. Inilah yang memangkas lead time dari 3 minggu jadi 30 menit. Tapi self-service TANPA ATURAN = mimpi buruk FinOps: GPU lupa dimatikan menagih tiap bulan, instance raksasa untuk eksperimen mainan, data sensitif di bucket publik. Kebebasan tanpa guardrails = tagihan liar.",
        "GUARDRAILS = aturan otomatis yang menjaga kebebasan tetap aman. Empat yang wajib: (1) KUOTA — tiap tim punya jatah GPU/budget per bulan; melewati kuota = butuh approval, bukan penolakan buta; (2) BUDGET ALERT — notifikasi di 80% pemakaian, hard stop opsional di 100%; (3) AUTO-DESTROY — environment eksperimen punya TTL (mis. 7 hari); lewat TTL = dihancurkan otomatis dengan peringatan 24 jam sebelumnya; (4) POLICY AS CODE — aturan tertulis sebagai kode dan dicek otomatis (contoh: `GPU tanpa label proyek = ditolak`, `bucket tanpa enkripsi = ditolak`).",
        "Prinsipnya: guardrails MENCEGAH BENCANA, bukan mengatur detail. Bedakan `dilarang` vs `perlu approval`: GPU 8×A100 untuk training LLM = perlu approval (mahal tapi sah); bucket publik berisi data nasabah = dilarang keras (risiko hukum). Guardrail yang baik terasa seperti sabuk pengaman — tidak terasa saat normal, menyelamatkan saat kecelakaan. Guardrail yang buruk terasa seperti borgol.",
        "Contoh konkret alur self-service yang sehat: Rina butuh 2 GPU untuk eksperimen 3 hari → portal internal → pilih template `training-job` → isi nama proyek + estimasi durasi → sistem cek kuota tim (tersisa 60%) → GPU jalan dalam 12 menit → budget alert menyala di hari ke-2 (80%) → job selesai → environment auto-destroy di hari ke-7. Total sentuhan manusia: NOL. Total waktu tunggu: 12 menit, bukan 3 minggu.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `self-service = semua orang boleh apa saja`",
        type: "pitfall",
        body: "Itu namanya anarki, bukan self-service. Self-service yang benar = kebebasan DALAM PAGAR: kamu bebas memilih apa pun di dalam pagar (template, ukuran GPU dalam kuota, durasi dalam TTL), pagarnya (kuota, budget, policy) dijaga mesin — bukan manusia yang harus dihubungi. Tanpa pagar: tagihan Rp200 juta untuk GPU yang lupa dimatikan. Dengan pagar yang terlalu rapat: orang kembali antre tiket — dan kamu kembali ke masalah awal.",
      },
      reference: "Self-service = kebebasan dalam pagar. Pagar = kuota + budget + TTL + policy as code.",
    },
    {
      id: "tim-platform",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tim platform: produk yang penggunanya engineer",
      prose: [
        "MINDSET SHIFT: tim platform BUKAN tim infra yang menunggu tiket — mereka TIM PRODUK yang penggunanya = engineer internal. Bedanya fundamental: tim tiket mengukur `tiket selesai`; tim produk mengukur `pengguna bahagia dan produktif`. SinarLog membangun dengan mindset tiket (teknologi bagus, tiket selesai) padahal yang dibutuhkan mindset produk (apakah DS mau pakai?).",
        "Empat metrik keberhasilan tim platform: (1) LEAD TIME — median waktu ide → eksperimen berjalan (target: jam, bukan minggu); trennya harus TURUN; (2) ADOPTION RATE — % engineer yang memakai golden path secara sukarela (target sehat >70%; SinarLog = 5% = gagal total); (3) KEPUASAN INTERNAL — survei/NPS singkat tiap kuartal (`seberapa mudah memakai platform?`); (4) TIKET SUPPORT — volume tiket infra manual harus TURUN seiring adopsi naik; kalau platform bagus tapi tiket tetap banyak = platformnya tidak menyelesaikan masalah yang benar.",
        "PLATFORM SLA = janji layanan tim platform ke penggunanya: mis. `provisioning GPU <30 menit 95% kasus`, `template training job selalu bisa jalan (99,5% success rate)`, `respons bug kritikal <4 jam`. SLA memaksa tim platform berpikir seperti penyedia layanan — dan memberi pengguna alasan mempercayai platform. Tanpa SLA, `platform` = proyek sampingan yang boleh rusak kapan saja.",
        "DOGFOODING & RISET PENGGUNA: tim platform WAJIB memakai platformnya sendiri untuk pekerjaan nyata dan mewawancarai pengguna tiap sprint (bukan sekali setahun). Aturan SinarLog yang seharusnya: tidak ada fitur platform yang dibangun tanpa 3 wawancara pengguna dulu; tidak ada rilis tanpa uji 1 jam oleh orang baru. Platform adalah produk — dan produk tanpa riset pengguna = tebak-tebakan mahal.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: tim platform = restoran, bukan dapur katering",
        body: "Tim tiket = dapur katering: kamu pesan, mereka masak, kamu tunggu — tidak peduli kamu suka menunya atau tidak. Tim platform = restoran: mereka merancang menu (golden path), memastikan pelayanan cepat (SLA), dan kalau sepi pengunjung mereka bertanya `menunya kurang apa?` — bukan menyalahkan pengunjung yang `tidak paham masakan enak`.",
      },
      reference: "Ukur: lead time ↓, adopsi >70%, kepuasan ↑, tiket ↓. Tanpa riset pengguna = tebak-tebakan.",
    },
    {
      id: "lab-leadtime",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: hitung pajak menunggumu",
      prose: [
        "SIMULASI — kalkulator pajak inovasi untuk tim fiktif 10 data scientist. Dua dunia dibandingkan: DUNIA A (tiket infra: tiap permintaan GPU antre 7 hari kerja = 56 jam) vs DUNIA B (self-service: 30 menit per permintaan + biaya platform Rp45 jt/bln untuk amortisasi build dan operasional). Tugasmu: implementasikan rumusnya dan lihat siapa yang menang.",
        "Rumus yang dipakai lab (KaTeX di bawah): R_plat = rasio penghematan bersih per bulan. Cara membaca output: tiap baris menampilkan jam tunggu dan biaya per dunia; baris terakhir menampilkan hemat bersih dan faktor percepatan lead time. Interpretasi: hemat_bersih > 0 = platform menghemat uang; faktor_lead = berapa kali lead time menyusut (112x di skenario ini).",
        "Coba eksplorasi: ubah `tunggu_tiket_jam` dari 56 jadi 16 (tiket yang lumayan cepat, 2 hari) — apakah platform masih menang? (Petunjuk: hemat menyusut tapi tetap positif karena biaya platformnya tetap.) Ubah `ds` jadi 3 (tim kecil) — pada titik berapa hemat_bersih jadi negatif? Itulah jawaban kuantitatif untuk `kapan sebaiknya TIDAK membangun platform` — simpan angkanya untuk Peta Keputusan.",
      ],
      formula: String.raw`R_{plat} = \frac{C_{tiket} - C_{ss}}{C_{ss}}`,
      formulaNote: "R_plat = rasio penghematan bersih per bulan (tanpa satuan; >0 artinya platform menghemat, <0 artinya platform lebih mahal); C_tiket = biaya menunggu bulanan di dunia tiket infra (Rp/bln) = jam tunggu × tarif per jam; C_ss = biaya total bulanan dunia self-service (Rp/bln) = biaya menunggu yang tersisa + biaya platform. Contoh lab: C_tiket = Rp378 jt, C_ss = Rp48,375 jt → R_plat = (378 − 48,375)/48,375 ≈ 6,81 = 681%. Artinya: tiap Rp1 yang dibelanjakan untuk platform mengembalikan Rp6,8 dalam bentuk waktu yang diselamatkan — SEBELUM menghitung model yang tidak basi dan talenta yang tidak resign.",
      tasks: [
        { id: "t1", text: "Hitung `jam_tunggu_A` dan `jam_tunggu_B`: total jam menunggu per bulan = permintaan per bulan × jam tunggu per permintaan" },
        { id: "t2", text: "Hitung `biaya_A` (jam_tunggu_A × tarif) dan `biaya_B` (jam_tunggu_B × tarif + biaya platform)" },
        { id: "t3", text: "Hitung `hemat_bersih` (biaya_A − biaya_B) dan `faktor_lead` (tunggu_tiket_jam / tunggu_ss_jam), lalu cocokkan output" },
      ],
      expected: "Dunia A: jam_tunggu=1680 biaya=378000000 · Dunia B: jam_tunggu=15 biaya=48375000 · hemat_bersih=329625000 faktor_lead=112x",
      note: {
        title: "💡 Intuisi: kalkulator ini = senjata negosiasi anggaran",
        body: "`Kami butuh Rp1,44 M untuk platform` terdengar mahal — sampai kamu menunjukkan pajak inovasi Rp329,6 jt PER BULAN yang dibayar tanpa platform. Payback period = 1.440 / 329,6 ≈ 4,4 bulan. CTO tidak membeli teknologi; CTO membeli angka. Lab ini memberimu angka itu.",
      },
      hints: [
        "minta = ds * minta_per_ds (30 permintaan/bln).",
        "jam_tunggu_A = minta * tunggu_tiket_jam; jam_tunggu_B = minta * tunggu_ss_jam.",
        "Cetak dengan int() agar cocok dengan pola checks.",
      ],
      code: {
        starter: `# DATA SKENARIO (jangan ubah)\nds = 10               # jumlah data scientist\nminta_per_ds = 3      # permintaan environment GPU per DS per bulan\ntunggu_tiket_jam = 56 # 7 hari kerja x 8 jam per permintaan (dunia tiket)\ntunggu_ss_jam = 0.5   # self-service: 30 menit per permintaan\ntarif_jam = 225000    # Rp per jam (gaji Rp40 jt/bln / 176 jam)\nbiaya_platform_bln = 45000000  # amortisasi build + operasional (Rp/bln)\n\n# TULIS KODEMU\nminta = ...\njam_tunggu_A = ...\njam_tunggu_B = ...\nbiaya_A = ...\nbiaya_B = ...\nhemat_bersih = ...\nfaktor_lead = ...\n\n# CETAK (jangan ubah)\nprint(f"Dunia A (tiket): jam_tunggu={int(jam_tunggu_A)} biaya={int(biaya_A)}")\nprint(f"Dunia B (self-service): jam_tunggu={int(jam_tunggu_B)} biaya={int(biaya_B)}")\nprint(f"hemat_bersih={int(hemat_bersih)} faktor_lead={int(faktor_lead)}x")`,
        lockLines: 9,
        solution: `# DATA SKENARIO (jangan ubah)\nds = 10               # jumlah data scientist\nminta_per_ds = 3      # permintaan environment GPU per DS per bulan\ntunggu_tiket_jam = 56 # 7 hari kerja x 8 jam per permintaan (dunia tiket)\ntunggu_ss_jam = 0.5   # self-service: 30 menit per permintaan\ntarif_jam = 225000    # Rp per jam (gaji Rp40 jt/bln / 176 jam)\nbiaya_platform_bln = 45000000  # amortisasi build + operasional (Rp/bln)\n\n# TULIS KODEMU\nminta = ds * minta_per_ds\njam_tunggu_A = minta * tunggu_tiket_jam\njam_tunggu_B = minta * tunggu_ss_jam\nbiaya_A = jam_tunggu_A * tarif_jam\nbiaya_B = jam_tunggu_B * tarif_jam + biaya_platform_bln\nhemat_bersih = biaya_A - biaya_B\nfaktor_lead = tunggu_tiket_jam / tunggu_ss_jam\n\n# CETAK (jangan ubah)\nprint(f"Dunia A (tiket): jam_tunggu={int(jam_tunggu_A)} biaya={int(biaya_A)}")\nprint(f"Dunia B (self-service): jam_tunggu={int(jam_tunggu_B)} biaya={int(biaya_B)}")\nprint(f"hemat_bersih={int(hemat_bersih)} faktor_lead={int(faktor_lead)}x")`,
        checks: [
          { kind: "equal", task: "t1", label: "jam tunggu dunia A", name: "jam_tunggu_A", value: 1680, msg: "jam_tunggu_A = 30 permintaan × 56 jam = 1680." },
          { kind: "equal", task: "t2", label: "biaya dunia A", name: "biaya_A", value: 378000000, msg: "biaya_A = 1680 × Rp225.000 = Rp378.000.000." },
          { kind: "equal", task: "t2", label: "biaya dunia B", name: "biaya_B", value: 48375000, msg: "biaya_B = 15 × Rp225.000 + Rp45.000.000 = Rp48.375.000." },
          { kind: "equal", task: "t3", label: "hemat bersih", name: "hemat_bersih", value: 329625000, msg: "hemat_bersih = 378.000.000 − 48.375.000 = 329.625.000." },
          { kind: "stdout_matches", task: "t3", label: "baris hemat di stdout", msg: "Cetak baris hemat_bersih=329625000 faktor_lead=112x.", pattern: "hemat_bersih=329625000 faktor_lead=112x" },
        ],
      },
      reference: "R_plat = (C_tiket − C_ss)/C_ss. Lab: hemat Rp329,6 jt/bln, lead time 112x lebih cepat.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Tiga jebakan membangun platform",
      prose: [
        "JEBAKAN 1 — OVER-ENGINEERING SEBELUM ADA PENGGUNA. SinarLog membangun untuk 40 orang selama 8 bulan sebelum satu pun memakainya. Pola yang benar: mulai dari 1 TIM PILOT (3–5 engineer yang paling menderita), bangun versi minimal yang menyelesaikan rasa sakit MEREKA dalam 4–6 minggu, lalu perluas. Platform yang tumbuh dari pengguna nyata = fitur yang dibutuhkan nyata. Platform yang dirancang di ruang rapat = fitur imajiner.",
        "JEBAKAN 2 — TANPA DOKUMENTASI & ONBOARDING. Golden path yang butuh 3 hari membaca docs = bukan golden path. Standar: quickstart 15 menit (dari nol ke job berjalan), tutorial 1 jam (kasus nyata end-to-end), referensi lengkap untuk kasus tepi. Dan yang paling penting: UJI onboarding dengan orang baru tiap rilis besar — dokumentasi yang tidak pernah diuji dengan orang baru = dokumentasi yang tidak ada.",
        "JEBAKAN 3 — MEMAKSA 100% USE CASE LEWAT PLATFORM. Selalu ada eksperimen aneh: GPU langka, framework baru, riset yang butuh akses mentah. Platform yang melarang jalan tikus tidak menghilangkan jalan tikus — ia membuatnya SEMBUNYI (shadow IT: kartu kredit pribadi, akun cloud bayangan). Biaya shadow IT: tidak terpantau, tidak aman, tidak bisa diaudit. Biarkan 20% eksotis lewat jalan tikus TERANG (tercatat, dengan guardrails minimal) daripada 20% lewat jalan tikus GELAP.",
        "Ketiga jebakan punya akar yang sama: membangun platform SEBAGAI PROYEK TEKNOLOGI, bukan sebagai produk untuk pengguna. Obatnya juga sama: riset pengguna dulu, pilot kecil dulu, ukur adopsi — bukan ukur `selesai dibangun`. Platform 8 bulan yang dipakai 2 orang = Rp1,44 miliar untuk monumen. Platform 6 minggu untuk 1 tim pilot yang dipakai tiap hari = fondasi yang bisa tumbuh.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `platform sukses = semua orang dipaksa memakainya`",
        type: "pitfall",
        body: "Pemaksaan menghasilkan angka adopsi PALSU (orang klik sekali agar tidak dimarahi, lalu kembali ke jalan tikus). Adopsi yang jujur = orang memakai karena LEBIH MUDAH. Kalau kamu harus memaksa, itu sinyal platformnya yang bermasalah — bukan penggunanya yang bandel. Perbaiki golden path-nya, bukan tambah policy-nya.",
      },
      reference: "Pilot 1 tim (4–6 minggu) → ukur adopsi → perluas. Jangan bangun 8 bulan untuk pengguna imajiner.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: bangun, beli, atau jangan?",
      prose: [
        "SKENARIO 1 — Tim kecil (<5 data scientist), 1–2 model produksi. KEPUTUSAN: JANGAN bangun platform. Pakai managed service (SageMaker, Vertex AI, atau cloud console + Terraform). Alasannya: pajak inovasimu kecil (hitung dengan lab: ds=3 sering membuat hemat_bersih negatif), dan 4 engineer platform = hampir seluruh timmu. Aturan: tim platform baru masuk akal saat `pajak inovasi > 2x biaya tim platform`.",
        "SKENARIO 2 — Tim 10–40 DS, permintaan infra berulang dan pola mirip (training GPU, serving API, batch). KEPUTUSAN: BANGUN golden path RINGAN. Mulai dari 1 tim pilot, 4–6 minggu: template training + self-service GPU dengan kuota + auto-destroy. Jangan bangun IDP penuh dulu. Alasannya: 80% rasa sakit terselesaikan dengan 20% usaha; IDP penuh bisa menyusul setelah adopsi >70%.",
        "SKENARIO 3 — Enterprise, banyak tim, regulasi ketat (bank, asuransi). KEPUTUSAN: BANGUN IDP PENUH dengan tim platform dedicated. Guardrails bukan opsional di sini: audit trail, policy as code, isolasi tenant, data residency. Alasannya: di skala ini, shadow IT = risiko hukum, bukan sekadar inefisiensi. Platform = alat kepatuhan sekaligus produktivitas.",
        "SKENARIO 4 — Use case eksotis (1 dari 40: riset arsitektur baru, hardware khusus). KEPUTUSAN: BIARKAN JALAN TIKUS (tercatat). Jangan paksakan ke golden path — biaya memaksa (frustasi + shadow IT) lebih besar dari manfaat standardisasi. Alasannya: platform melayani yang umum; yang langka butuh kebebasan. Catat pemakaiannya untuk bahan evaluasi kuartal berikutnya.",
        "ATURAN PRAKTIS 10 DETIK: (1) Hitung pajak inovasi dengan lab Langkah 6 — negatif? berhenti, jangan bangun. (2) Ada ≥10 engineer dengan rasa sakit BERULANG yang sama? lanjut. (3) Mulai dari 1 tim pilot, 4–6 minggu, bukan 8 bulan. (4) Uji golden path dengan orang baru <1 jam. (5) Ukur adopsi sukarela, bukan kepatuhan paksa.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: platform = asuransi, bukan lotre",
        body: "Orang membeli asuransi karena risiko nyata dan terukur — bukan karena brosurnya bagus. Keputusan membangun platform juga begitu: hitung dulu pajak inovasinya (risiko), bandingkan dengan biaya tim platform (premi). Kalau preminya lebih mahal dari risikonya, jangan beli asuransinya. Lab Langkah 6 adalah kalkulator preminya.",
      },
      reference: "Bangun bila: pajak inovasi > 2x biaya tim platform + rasa sakit berulang + ≥10 engineer.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: audit platform KlinikData",
      prose: [
        "KlinikData, healthtech dengan 25 data scientist, membangun platform ML selama 6 bulan dengan 3 engineer (biaya: 6 × 3 × Rp45 jt = Rp810 jt). Data audit kuartal pertama: (a) adoption rate 12% (3 dari 25 DS memakai golden path sukarela); (b) lead time median ide→eksperimen: 9 hari (target platform: <1 hari); (c) tiket infra manual TURUN hanya 8% (dari 50 ke 46 tiket/bln); (d) survei kepuasan: 2,1 dari 5 (`dokumentasi membingungkan, template tidak cocok untuk data citra medis kami`); (e) onboarding rata-rata: 2,5 hari.",
        "Pertanyaan 1 — Diagnosis: dari 5 data di atas, apa TIGA akar masalah platform KlinikData? (Petunjuk: bandingkan dengan tiga jebakan Langkah 7 dan metrik Langkah 5.) Pertanyaan 2 — Hitungan: dengan 25 DS, tiap DS 2 permintaan/bln, tunggu 9 hari kerja (= 72 jam), tarif Rp225 rb/jam — berapa pajak inovasi bulanannya? Apakah Rp810 jt build cost terbayar dalam setahun bila platform bekerja ideal (asumsikan dunia B seperti lab: 0,5 jam + Rp45 jt/bln biaya platform)? Pertanyaan 3 — Rekomendasi: sebagai konsultan, apa 3 langkah 90 hari untuk menyelamatkan platform ini? (Petunjuk: jangan `bangun ulang dari nol` — pikirkan pilot, riset pengguna, dan golden path untuk citra medis dulu.)",
        "Pembahasan — P1: (i) Over-engineering tanpa riset pengguna — template generik tidak cocok untuk citra medis (mayoritas workload mereka); dibangun 6 bulan tanpa pilot. (ii) Onboarding 2,5 hari + docs membingungkan = golden path gagal uji 1 jam. (iii) Adopsi paksa tersirat — 12% sukarela + tiket manual nyaris tidak turun = orang kembali ke cara lama. P2: permintaan = 25 × 2 = 50/bln; jam tunggu = 50 × 72 = 3.600 jam; pajak = 3.600 × 225.000 = Rp810 jt/bln. Dunia B ideal: 50 × 0,5 = 25 jam × 225.000 = Rp5,625 jt + Rp45 jt = Rp50,625 jt/bln. Hemat = Rp759,375 jt/bln × 12 = Rp9,11 M/tahun — build cost Rp810 jt terbayar dalam ~1,1 bulan JIKA platformnya dipakai. Masalah KlinikData bukan ekonomi — platformnya menguntungkan secara teori — melainkan adopsi.",
        "Pembahasan — P3 (contoh jawaban yang baik): (1) Bekukan fitur baru 30 hari; wawancara 10 DS (fokus tim citra medis) + uji onboarding dengan 3 orang baru — catat semua titik gagal. (2) Bangun SATU golden path khusus citra medis dalam 4 minggu bersama 1 tim pilot (training + serving + monitoring untuk workload mereka), target: onboarding <1 jam, adopsi pilot 100%. (3) Tetapkan metrik publik: adoption rate, lead time, NPS internal — review bulanan dengan CTO; fitur baru hanya bila metrik naik. Yang TIDAK boleh: menambah fitur generik lagi sebelum adopsi >50%.",
      ],
      tasks: [
        { id: "t1", text: "Tulis diagnosis 3 akar masalah KlinikData (kaitkan ke data a–e)" },
        { id: "t2", text: "Hitung pajak inovasi bulanan KlinikData dan payback period build cost-nya" },
        { id: "t3", text: "Susun rencana 90 hari (3 langkah) untuk menyelamatkan platform" },
      ],
      expected: "P1: over-engineering tanpa riset pengguna (template tak cocok citra medis) + onboarding gagal uji 1 jam + adopsi paksa (12% sukarela). P2: pajak Rp810 jt/bln; hemat ideal Rp759,375 jt/bln → payback ~1,1 bulan. P3: bekukan fitur + riset pengguna → 1 golden path citra medis dgn tim pilot → metrik publik bulanan.",
      note: {
        title: "🚨 Mitos: `platform KlinikData gagal karena kurang fitur`",
        type: "pitfall",
        body: "Data berkata sebaliknya: masalahnya BUKAN kurang fitur — lead time 9 hari dan adopsi 12% menunjukkan fitur yang ada TIDAK DIPAKAI. Menambah fitur ke platform yang tidak dipakai = menambah monumen. Obatnya: kurangi, fokuskan, uji dengan pengguna nyata. Platform diselamatkan dengan MENGHAPUS ambisi, bukan menambahnya.",
      },
      reference: "Diagnosis dulu (data a–e), hitung dulu (pajak vs payback), baru resep (pilot + metrik).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Apa yang dimaksud `pajak inovasi` dalam konteks lesson ini?",
          options: [
            { text: "Pajak pemerintah atas perusahaan teknologi", why: "Tidak ada pajak seperti itu di lesson ini. `Pajak` di sini metafora untuk biaya tersembunyi." },
            { text: "Biaya tersembunyi menunggu infra: gaji × jam idle + model basi + talenta yang pergi", why: "Tepat. Tiga komponennya: biaya langsung (dihitung di lab), model basi (lebih besar, tak presisi), dan talenta yang resign karena frustasi.", correct: true },
            { text: "Biaya lisensi software ML per tahun", why: "Itu biaya eksplisit yang muncul di invoice — kebalikan dari `tersembunyi`. Pajak inovasi justru tidak muncul di invoice mana pun." },
            { text: "Denda keterlambatan proyek dari klien", why: "Itu konsekuensi kontrak, bukan pajak inovasi. Pajak inovasi dibayar ke `ketidakefisienan internal`, bukan ke klien." },
          ],
        },
        {
          q: "Ciri golden path yang SEHAT?",
          options: [
            { text: "Semua use case wajib lewat satu jalur, tanpa kecuali", why: "Itu jebakan #3: memaksa 100% = jalan tikus sembunyi (shadow IT). Golden path sehat punya escape hatch." },
            { text: "Dokumentasi 40 halaman yang lengkap dan detail", why: "Docs 40 halaman = onboarding 3 hari = golden path gagal. Standar: quickstart 15 menit, uji 1 jam oleh orang baru." },
            { text: "Jalur resmi yang paling mudah (onboarding <1 jam), default aman otomatis, dan jalan tikus tetap boleh untuk kasus eksotis", why: "Tepat. Tiga anatominya: template sekali perintah, guardrails terpasang otomatis, escape hatch untuk 20% eksotis.", correct: true },
            { text: "Dibangun 8 bulan agar fiturnya lengkap sebelum diluncurkan", why: "Itu jebakan #1 SinarLog: 8 bulan untuk pengguna imajiner. Mulai dari 1 tim pilot dalam 4–6 minggu." },
          ],
        },
        {
          q: "Dari lab Langkah 6: tim 10 DS, tiap DS 3 permintaan/bln, tunggu 56 jam per permintaan, tarif Rp225 rb/jam. Berapa biaya menunggu dunia A per bulan?",
          options: [
            { text: "Rp126 juta", why: "Itu contoh angka di Langkah 2 untuk skenario berbeda (10 DS × 7 hari × tarif, satu putaran) — bukan hitungan lab." },
            { text: "Rp378 juta (1.680 jam × Rp225 ribu)", why: "Tepat. 30 permintaan × 56 jam = 1.680 jam; × Rp225.000 = Rp378.000.000. Inilah C_tiket di rumus R_plat.", correct: true },
            { text: "Rp48,375 juta", why: "Itu biaya dunia B (self-service + platform), bukan dunia A. Jangan tertukar." },
            { text: "Rp329,625 juta", why: "Itu HEMAT BERSIH (A − B), bukan biaya dunia A." },
          ],
        },
        {
          q: "Tim platform melaporkan `99,9% uptime server dan 200 tiket selesai`. Kenapa ini BUKAN bukti platform sukses?",
          options: [
            { text: "Karena uptime 99,9% terlalu rendah untuk platform", why: "99,9% uptime itu bagus. Masalahnya bukan angkanya — melainkan METRIKNYA mengukur hal yang salah." },
            { text: "Karena metrik yang benar adalah adopsi sukarela, lead time, kepuasan internal, dan tiket yang MENURUN — bukan tiket yang selesai", why: "Tepat. `Tiket selesai` = mindset tim tiket. Platform sukses = orang tidak perlu bikin tiket (tiket turun) + memakai golden path sukarela + lead time turun.", correct: true },
            { text: "Karena 200 tiket terlalu sedikit untuk tim platform", why: "Jumlah tiket bukan ukuran keberhasilan. 200 tiket selesai dengan adopsi 5% = platform gagal yang sibuk." },
            { text: "Karena metrik harus selalu dalam bentuk persen", why: "Bentuk metrik tidak masalah; yang masalah = APA yang diukur. Uptime server ≠ pengalaman pengguna platform." },
          ],
        },
        {
          q: "Self-service GPU tanpa guardrails apa pun. Risiko terbesarnya?",
          options: [
            { text: "Data scientist jadi malas karena terlalu mudah", why: "Tidak ada bukti kemudahan membuat malas; yang ada = eksperimen bertambah (itu tujuan platform)." },
            { text: "Tagihan liar (GPU lupa dimatikan), keamanan longgar, dan shadow IT yang tak terpantau", why: "Tepat. Kebebasan tanpa pagar = GPU Rp200 juta lupa dimatikan + bucket tak terenkripsi. Guardrails (kuota, budget alert, TTL, policy as code) adalah pagarnya.", correct: true },
            { text: "Tim platform kehilangan pekerjaan", why: "Sebaliknya: tanpa guardrails, tim platform sibuk memadamkan kebakaran tagihan dan insiden — pekerjaan mereka justru bertambah." },
            { text: "GPU menjadi lebih lambat karena dipakai bersama", why: "Itu masalah isolasi/kuota komputasi, bukan risiko utama self-service tanpa guardrails. Risiko terbesarnya finansial dan keamanan." },
          ],
        },
        {
          q: "Kapan keputusan yang TEPAT adalah TIDAK membangun platform?",
          options: [
            { text: "Saat tim hanya 3 data scientist dengan 1–2 model (pajak inovasi < biaya tim platform)", why: "Tepat. Skenario 1 peta keputusan: hitung dulu dengan lab — bila hemat_bersih negatif, managed service + Terraform sudah cukup.", correct: true },
            { text: "Saat perusahaan adalah enterprise bank dengan regulasi ketat", why: "Terbalik: itu skenario 3 — justru WAJIB bangun (shadow IT = risiko hukum)." },
            { text: "Saat data scientist meminta GPU setiap hari", why: "Itu sinyal rasa sakit BERULANG — justru alasan membangun (skenario 2), bukan menunda." },
            { text: "Tidak pernah — platform selalu menguntungkan", why: "Lab membuktikan sebaliknya: dengan ds=3, hemat_bersih bisa negatif. Platform adalah investasi yang harus dihitung, bukan dogma." },
          ],
        },
      ],
      summary: [
        "Pajak inovasi = biaya tersembunyi menunggu infra (gaji × idle + model basi + talenta pergi); hitung dulu sebelum memutuskan membangun.",
        "Golden path = jalur resmi yang PALING MUDAH (onboarding <1 jam oleh orang baru), default aman otomatis, plus escape hatch untuk 20% kasus eksotis.",
        "Self-service = provisioning mandiri TANPA tiket; guardrails wajib: kuota, budget alert, auto-destroy (TTL), policy as code.",
        "Tim platform = tim produk (penggunanya engineer): ukur lead time ↓, adoption rate (>70%), kepuasan internal, tiket support ↓ — bukan `tiket selesai`.",
        "Tiga jebakan: over-engineering sebelum ada pengguna → mulai 1 tim pilot 4–6 minggu; tanpa dokumentasi/onboarding → uji 1 jam; memaksa 100% → biarkan jalan tikus terang.",
        "Keputusan: JANGAN bangun bila tim kecil & hemat_bersih negatif (pakai managed service); bangun ringan untuk tim 10–40; IDP penuh untuk enterprise teregulasi.",
        "R_plat = (C_tiket − C_ss)/C_ss; lab: hemat Rp329,6 jt/bln, lead time 112x lebih cepat — angka untuk negosiasi anggaran.",
      ],
      next: { label: "MLOps19 — LLMOps End-to-End: Dari Prompt ke Produksi", href: "/learn/mlops19-llmops-end-to-end" },
    },
  ],
};
