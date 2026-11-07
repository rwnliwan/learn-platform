import type { V2Lesson } from "../lib/types";

const RR33_SCHEMA = `CREATE TABLE kredit (
  id INTEGER PRIMARY KEY,
  segmen TEXT,
  dpd INTEGER,
  baki_debet INTEGER,
  status TEXT
);
CREATE TABLE npl_bulanan (
  bulan TEXT PRIMARY KEY,
  total INTEGER,
  bermasalah INTEGER
);`;

const RR33_SEED = `INSERT INTO kredit VALUES (1, 'Korporasi', 0, 1200, 'lancar');
INSERT INTO kredit VALUES (2, 'Korporasi', 15, 800, 'lancar');
INSERT INTO kredit VALUES (3, 'Korporasi', 45, 500, 'macet');
INSERT INTO kredit VALUES (4, 'UKM', 0, 600, 'lancar');
INSERT INTO kredit VALUES (5, 'UKM', 35, 400, 'lancar');
INSERT INTO kredit VALUES (6, 'UKM', 95, 300, 'macet');
INSERT INTO kredit VALUES (7, 'UKM', 120, 200, 'macet');
INSERT INTO kredit VALUES (8, 'Konsumer', 0, 900, 'lancar');
INSERT INTO kredit VALUES (9, 'Konsumer', 75, 150, 'macet');
INSERT INTO kredit VALUES (10, 'Konsumer', 10, 350, 'lancar');
INSERT INTO npl_bulanan VALUES ('2026-08', 9800, 304);
INSERT INTO npl_bulanan VALUES ('2026-09', 9900, 320);
INSERT INTO npl_bulanan VALUES ('2026-10', 10100, 350);`;

export const rr33: V2Lesson = {
  slug: "rr33-sql-risk-reporting",
  track: "Risk Reporting",
  module: "Fondasi Pelaporan",
  title: "RR33 — SQL untuk Risk Reporting",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua laporan, dua angka NPL, satu rapat yang panas",
      prose: [
        "Bank Artha Dana mengadakan rapat komite risiko. Analis A melaporkan NPL Oktober 3,47 persen. Analis B — dari tim yang sama, data yang sama — melaporkan 3,23 persen. Keduanya yakin angkanya benar, karena keduanya memang benar menurut query masing-masing. Bedanya: A memakai snapshot per 31 Oktober, B memakai data yang ditarik tanggal 5 November tanpa filter tanggal as-of — lima hari transaksi baru ikut masuk ke pembilang dan penyebut dengan cara yang berbeda.",
        "Twist-nya: tidak ada yang salah hitung. Yang salah adalah tidak adanya tanggal as-of yang disepakati dan ditulis di query. Laporan risiko tanpa as-of adalah laporan tanpa tanggal kadaluarsa: angkanya berubah setiap kali query dijalankan ulang, dan tidak ada yang bisa merekonsiliasinya. Lesson ini mengajarkan SQL sebagai alat kerja risk reporting: tanggal as-of dan snapshot, agregasi eksposur, bucketing DPD, period-over-period, waterfall pergerakan, dan query rekonsiliasi.",
        "Setelah lesson ini kamu bisa: (1) menulis query as-of yang bisa direproduksi siapa pun; (2) mengagregasi eksposur per segmen dan mem-bucket DPD; (3) menghitung perubahan period-over-period dalam poin persentase; (4) menjelaskan pergerakan NPL dengan waterfall; (5) menulis query rekonsiliasi antar sumber.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Angka yang tidak bisa direproduksi = angka yang tidak bisa dipertahankan. Saat direksi bertanya 'angka mana yang benar?', jawaban yang benar bukan 'punya saya', melainkan 'ini query-nya, ini tanggal as-of-nya, jalankan ulang dan hasilnya sama'. SQL di lesson ini adalah alat pembuktian, bukan sekadar alat hitung.",
      },
      reference: "Tanpa as-of, dua query jujur bisa menghasilkan dua angka berbeda. As-of dulu, hitung kemudian.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) cerita dua angka NPL; (2) peta ini; (3) tanggal as-of dan tabel snapshot; (4) bucketing DPD; (5) agregasi eksposur per segmen; (6) lab SQL 1: bucketing DPD; (7) lab SQL 2: as-of dan period-over-period; (8) lab Python: waterfall pergerakan NPL; (9) query rekonsiliasi; (10) peta keputusan: kapan SQL cukup, kapan butuh pipeline; (11) mini-case: NPL naik — dari mana?; (12) checkpoint.",
        "Bekal yang diringkas agar lesson ini mandiri: SELECT memilih kolom, WHERE menyaring baris, GROUP BY + SUM/COUNT merangkum per kelompok, CASE membuat kolom bersyarat, dan JOIN menggabungkan dua tabel. Semua teknik di lesson ini dibangun dari lima pola itu — tidak ada sintaks eksotis, hanya disiplin pemakaian.",
        "Satu konvensi di seluruh lesson: semua angka contoh adalah ilustratif (bank dan debitur fiktif), kecuali ambang regulasi yang dirujuk dari lesson lain — batas internal NPL 3,0 persen di sini adalah contoh batas internal, bukan ketentuan regulator. Yang kanonis bukan angkanya, melainkan metodenya.",
      ],
      tasks: [],
      reference: "Rute: as-of → bucketing → agregasi → lab SQL → waterfall → rekonsiliasi.",
    },
    {
      id: "as-of-snapshot",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tanggal as-of dan tabel snapshot: laporan yang bisa diulang",
      prose: [
        "Tanggal as-of adalah tanggal posisi yang dilaporkan: 'NPL per 31 Oktober 2026' berarti semua transaksi sampai dan termasuk 31 Oktober, tidak satu pun sesudahnya. Tanpa as-of yang eksplisit, query yang sama menghasilkan angka berbeda tiap kali dijalankan — persis insiden di cerita pembuka. Aturan pertama SQL risk reporting: setiap query laporan WAJIB punya filter tanggal as-of yang terlihat, misalnya WHERE tanggal <= '2026-10-31'.",
        "Tabel snapshot adalah penerapan as-of secara sistematis: tiap akhir periode, salin posisi (saldo, status, DPD) ke tabel berekor tanggal, misalnya snapshot_kredit_20261031. Keuntungannya tiga: (1) laporan bulan lalu bisa dihitung ulang kapan pun tanpa bergantung pada data operasional yang terus berubah; (2) tren period-over-period membandingkan apel dengan apel — snapshot yang sama strukturnya tiap bulan; (3) audit trail: regulator dan auditor internal bisa menelusur angka laporan ke snapshot yang tepat.",
        "Dua jebakan snapshot. Satu: snapshot yang diambil sebelum proses akhir bulan selesai (misalnya sebelum write-off dicatat) — solusinya: snapshot diambil SETELAH cut-off resmi, dan jam pengambilannya dicatat. Dua: snapshot tanpa versi definisi — definisi 'macet' berubah dari DPD di atas 90 menjadi di atas 60, tetapi snapshot lama tidak mencatat definisi yang dipakai. Solusi: tiap snapshot menyimpan versi kamus definisi (misalnya kamus v3.2, seperti di RR14). Snapshot tanpa versi definisi = foto tanpa tanggal.",
        "Pola query as-of yang aman: selalu filter pada kolom tanggal posisi, bukan tanggal tarik data. WHERE posisi_tanggal <= as_of jauh lebih benar daripada WHERE tanggal_tarik = hari_ini. Dan di header laporan, tulis as-of dengan huruf besar: 'POSISI PER 31 OKT 2026'. Pembaca harus melihat tanggalnya sebelum melihat angkanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Data saya tarik hari ini, jadi ini posisi hari ini.” Bukan — data yang ditarik hari ini berisi transaksi sampai hari ini, tetapi laporan bulan Oktober harus berhenti di 31 Oktober. Filter as-of-lah yang menentukan posisi, bukan tanggal kamu menjalankan query.",
      },
      hints: [
        "Uji reproduksibilitas: jalankan query-mu minggu depan. Jika hasilnya berubah padahal as-of sama, query-mu bocor — ada filter tanggal yang hilang.",
        "Snapshot = bekukan posisi di akhir periode + catat versi kamus definisinya.",
      ],
      reference: "As-of eksplisit di WHERE + snapshot berversi = laporan yang bisa diulang siapa pun.",
    },
    {
      id: "bucketing-dpd",
      eyebrow: "Langkah 4 · Konsep",
      title: "Bucketing DPD: dari hari tunggakan ke cerita risiko",
      prose: [
        "DPD (days past due) adalah jumlah hari tunggakan. Angka mentahnya — 0, 15, 47, 120 — terlalu granular untuk laporan: direksi tidak bisa membaca 10.000 angka DPD. Bucketing mengelompokkannya ke keranjang yang bermakna: 0 (lancar), 1–30 (terlambat ringan), 31–60 (waspada), 61–90 (memburuk), di atas 90 (macet). Keranjangnya mengikuti cara bank mengelola: 1–30 ditelepon, 31–60 dikunjungi, 61–90 direstrukturisasi, di atas 90 dicadangkan penuh.",
        "Di SQL, bucketing ditulis dengan CASE: CASE WHEN dpd = 0 THEN '0' WHEN dpd <= 30 THEN '1-30' WHEN dpd <= 60 THEN '31-60' WHEN dpd <= 90 THEN '61-90' ELSE '>90' END. Tiga aturan penulisan: (1) batas bucket harus menempel tanpa celah dan tanpa tumpang tindih — DPD 30 dan 31 harus jatuh ke bucket berbeda yang jelas; (2) bucket yang sama dipakai di semua laporan dan semua bulan, supaya tren bisa dibandingkan; (3) bucket 'macet' (di atas 90) harus sama dengan definisi NPL di kamus — bila kamus berubah, bucket ikut berubah dan perubahannya dicatat.",
        "Yang dibaca dari tabel bucket bukan totalnya, melainkan MIGRASINYA: berapa baki yang pindah dari bucket 1–30 ke 31–60 bulan ini? Migrasi yang membesar di bucket 31–60 adalah peringatan dini NPL tiga bulan ke depan — debitur tidak meloncat dari lancar ke macet, mereka berjalan melewati bucket satu per satu. Laporan bucketing yang baik menampilkan tabel bulan ini DAN panah migrasinya.",
        "Contoh ilustratif dari data lab: total baki Rp5.400 juta tersebar sebagai berikut — bucket 0: Rp2.700 juta (3 debitur), 1–30: Rp1.150 juta (2), 31–60: Rp900 juta (2), 61–90: Rp150 juta (1), di atas 90: Rp500 juta (2). Dua debitur di atas 90 dengan baki Rp500 juta adalah inti NPL; dua debitur di 31–60 dengan baki Rp900 juta adalah antrean masalah berikutnya. Angka ini akan kamu hitung sendiri di lab.",
      ],
      tasks: [],
      formula: String.raw`\text{bucket}(d) = \begin{cases} 0 & d = 0 \\ 1\text{-}30 & 1 \le d \le 30 \\ 31\text{-}60 & 31 \le d \le 60 \\ 61\text{-}90 & 61 \le d \le 90 \\ >90 & d > 90 \end{cases}`,
      formulaNote: "d = DPD dalam hari. Contoh: DPD 45 jatuh ke bucket 31-60; DPD 95 jatuh ke bucket di atas 90 (macet). Interpretasi: bucket adalah bahasa manajemen — tiap bucket punya tindakan yang berbeda.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Bucket 30 hari = 1 bulan, jadi batasnya boleh kira-kira.” Tidak boleh: DPD 30 vs 31 adalah batas dua bucket, dan satu hari selisih memindahkan Rp miliar antar bucket. Tulis batas dengan angka eksplisit (<= 30, <= 60) dan uji dengan DPD tepat di batas.",
      },
      reference: "CASE WHEN untuk bucketing; batas menempel, definisi sama dengan kamus, baca migrasinya.",
    },
    {
      id: "agregasi-eksposur",
      eyebrow: "Langkah 5 · Konsep",
      title: "Agregasi eksposur: dari baris ke portofolio",
      prose: [
        "Laporan risiko hampir tidak pernah menampilkan baris per debitur — ia menampilkan agregasi: total baki per segmen, NPL per segmen, konsentrasi per debitur terbesar. Polanya selalu sama: GROUP BY segmen, lalu SUM(baki_debet) untuk eksposur, SUM(CASE WHEN dpd > 90 THEN baki_debet ELSE 0 END) untuk baki bermasalah, dan rasionya untuk NPL segmen. Satu query, tiga angka — dan ketiganya harus konsisten: jumlah NPL segmen harus sama dengan NPL total.",
        "Dua pemeriksaan agregasi yang wajib ada di setiap query laporan. Satu: uji total — SUM per segmen harus sama dengan total tanpa GROUP BY; selisih satu rupiah pun berarti ada baris yang lolos dari pengelompokan (misalnya segmen NULL). Dua: uji rasio — NPL segmen dihitung dari angka agregat (baki bermasalah dibagi total baki segmen), BUKAN rata-rata dari NPL per debitur; rata-rata rasio adalah kesalahan klasik yang membuat segmen kecil berbobot sama dengan segmen besar.",
        "Contoh ilustratif dari data lab: total baki Rp5.400 juta, baki bermasalah (DPD di atas 90) Rp500 juta — NPL portofolio contoh ini 9,26 persen. Itu angka contoh dari data lab yang kecil dan sengaja bermasalah, bukan angka bank nyata. Yang penting: 500 dibagi 5.400 — bukan rata-rata NPL tiap debitur. Per segmen, dengan definisi macet yang sama (DPD di atas 90): Korporasi 0 dari Rp2.500 juta (0 persen — debitur Korporasi dengan DPD 45 belum macet), UKM Rp500 juta dari Rp1.500 juta (33,3 persen), Konsumer 0 dari Rp1.400 juta (0 persen — DPD 75 belum macet). Jumlahnya klop: 0 + 500 + 0 = 500. Pelajaran di dalam pelajaran: DPD 75 terasa bermasalah, tetapi menurut definisi ia belum macet — definisi yang diterapkan konsisten lebih penting daripada perasaan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“NPL portofolio = rata-rata NPL segmen.” Salah: rata-rata memberi bobot sama pada segmen kecil dan besar. NPL portofolio = total bermasalah dibagi total baki. Selalu agregasi dulu, rasio kemudian.",
      },
      reference: "GROUP BY + SUM, lalu rasio dari angka agregat. Uji total selalu: jumlah segmen = total.",
    },
    {
      id: "lab-sql-bucketing",
      eyebrow: "Langkah 6 · Lab SQL",
      title: "Lab SQL 1 — Bucketing DPD dan total baki per bucket",
      prose: [
        "Data lab: 10 debitur (ilustratif) di tabel kredit dengan kolom segmen, DPD, dan baki_debet (Rp juta). Tugasmu: kelompokkan ke bucket DPD (0, 1–30, 31–60, 61–90, di atas 90), hitung jumlah debitur dan total baki per bucket, urutkan dari bucket terkecil.",
        "Hasil yang diharapkan: bucket 0 berisi 3 debitur dengan baki Rp2.700 juta; 1–30 berisi 2 debitur Rp1.150 juta; 31–60 berisi 2 debitur Rp900 juta; 61–90 berisi 1 debitur Rp150 juta; di atas 90 berisi 2 debitur Rp500 juta. Jumlahkan: 2.700 + 1.150 + 900 + 150 + 500 = Rp5.400 juta — sama dengan total baki keseluruhan. Itu uji totalmu: bila jumlahmu bukan 5.400, ada baris yang hilang atau terhitung ganda.",
        "Perhatian: urutan bucket harus mengikuti urutan DPD, bukan urutan abjad (secara abjad, '0' dan '1-30' dan '31-60' memang berurutan, tetapi '>90' akan melompat ke depan). Pakai ORDER BY MIN(dpd) supaya urutannya mengikuti angka, bukan teks.",
      ],
      tasks: [
        { id: "t1", text: "Tulis SELECT dengan CASE untuk bucket, COUNT(*) dan SUM(baki_debet), GROUP BY bucket, ORDER BY MIN(dpd)" },
      ],
      sqlLab: {
        task: "Kelompokkan 10 debitur ke bucket DPD (0, 1-30, 31-60, 61-90, >90). Tampilkan kolom bucket, n (jumlah debitur), dan baki (total baki_debet). Urutkan bucket dari DPD terkecil (ORDER BY MIN(dpd)).",
        schema: RR33_SCHEMA,
        seedData: RR33_SEED,
        starter: "SELECT\n",
        solution: "SELECT CASE WHEN dpd = 0 THEN '0' WHEN dpd <= 30 THEN '1-30' WHEN dpd <= 60 THEN '31-60' WHEN dpd <= 90 THEN '61-90' ELSE '>90' END AS bucket, COUNT(*) AS n, SUM(baki_debet) AS baki FROM kredit GROUP BY bucket ORDER BY MIN(dpd)",
        expectedColumns: ["bucket", "n", "baki"],
        expectedRows: [["0", 3, 2700], ["1-30", 2, 1150], ["31-60", 2, 900], ["61-90", 1, 150], [">90", 2, 500]],
        orderMatters: true,
      },
      reference: "CASE WHEN untuk bucket; COUNT + SUM per bucket; ORDER BY MIN(dpd); uji total = 5.400.",
    },
    {
      id: "lab-sql-asof",
      eyebrow: "Langkah 7 · Lab SQL",
      title: "Lab SQL 2 — As-of dan period-over-period",
      prose: [
        "Tabel npl_bulanan menyimpan snapshot bulanan: tiap baris adalah satu bulan dengan total kredit dan baki bermasalah (Rp miliar, ilustratif). Agustus: total 9.800, bermasalah 304 → NPL 3,10 persen. September: 9.900 dan 320 → 3,23 persen. Oktober: 10.100 dan 350 → 3,47 persen.",
        "Tugasmu: untuk bulan Oktober (as-of '2026-10'), tampilkan NPL bulan itu dan selisihnya terhadap September dalam poin persentase. Perhatikan: selisih dihitung dari angka TAK BULAT (3,4653 persen dikurangi 3,2323 persen = 0,23 pp), bukan dari angka yang sudah dibulatkan (3,47 dikurangi 3,23 = 0,24 pp — salah 0,01 pp). Aturan emas: bulatkan HANYA di tampilan akhir, jangan pernah di tengah perhitungan.",
        "Kueri memakai self-join: tabel Oktober di-join ke baris September pada bulan yang diketahui. Di produksi, join-nya memakai bulan sebelumnya secara dinamis; di lab ini bulan ditulis eksplisit supaya fokusmu pada aritmetika pp, bukan pada sintaks tanggal.",
      ],
      tasks: [
        { id: "t1", text: "Tulis SELECT bulan, NPL Oktober (ROUND, 2 desimal), dan selisih pp vs September dari angka tak bulat" },
      ],
      sqlLab: {
        task: "Untuk as-of '2026-10', tampilkan bulan, npl_pct (bermasalah*100/total, bulatkan 2 desimal), dan mom_pp (selisih NPL Oktober vs September dalam poin persentase, dari angka tak bulat, bulatkan 2 desimal). Pakai self-join ke baris '2026-09'.",
        schema: RR33_SCHEMA,
        seedData: RR33_SEED,
        starter: "SELECT\n",
        solution: "SELECT a.bulan, ROUND(a.bermasalah * 100.0 / a.total, 2) AS npl_pct, ROUND(a.bermasalah * 100.0 / a.total - b.bermasalah * 100.0 / b.total, 2) AS mom_pp FROM npl_bulanan a JOIN npl_bulanan b ON b.bulan = '2026-09' WHERE a.bulan = '2026-10'",
        expectedColumns: ["bulan", "npl_pct", "mom_pp"],
        expectedRows: [["2026-10", 3.47, 0.23]],
        orderMatters: true,
      },
      reference: "Self-join bulan berjalan ke bulan lalu; selisih pp dari angka tak bulat; ROUND hanya di akhir.",
    },
    {
      id: "lab-waterfall",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab — Waterfall pergerakan NPL: dari mana kenaikan itu datang?",
      prose: [
        "NPL naik dari 3,40 persen ke 3,47 persen — naik 0,07 pp. Direksi bertanya: dari mana? Waterfall menjawab dengan mengurai pergerakan baki bermasalah dari saldo awal ke saldo akhir, komponen demi komponen. Data ilustratif: saldo awal (September) Rp340 miliar dari total Rp10.000 miliar; selama Oktober ada kredit baru bermasalah Rp45 miliar, pemulihan (debitur kembali lancar) Rp20 miliar, dan write-off Rp15 miliar.",
        "Hitung: saldo akhir = 340 + 45 − 20 − 15 = Rp350 miliar. Total kredit akhir Rp10.100 miliar, sehingga NPL akhir = 350 dibagi 10.100 = 3,47 persen. Kenaikan 0,07 pp itu ternyata gabungan tiga arah: pendorong naik (kredit baru bermasalah +45), penahan (pemulihan −20 dan write-off −15). Tanpa waterfall, direksi hanya tahu 'naik 0,07 pp'; dengan waterfall, mereka tahu pendorongnya adalah kredit baru bermasalah — dan itu yang harus ditindaklanjuti, bukan write-off-nya.",
        "Catatan kejujuran: write-off MENURUNKAN baki bermasalah di waterfall, tetapi ia bukan perbaikan kualitas — ia penghapusan (lihat RR1 soal NPL kosmetik). Waterfall yang jujur menampilkan write-off sebagai komponen terpisah dengan labelnya, bukan menyembunyikannya di dalam 'lain-lain'. Komponen 'lain-lain' yang besar adalah tanda waterfall yang malas: tiap komponen di atas ambang materialitas (contoh internal: Rp10 miliar) harus bernama.",
      ],
      formula: String.raw`\text{Saldo}_{\text{akhir}} = \text{Saldo}_{\text{awal}} + \text{Baru} - \text{Pulih} - \text{Write-off}`,
      formulaNote: "Semua angka ilustratif (Rp miliar): saldo awal 340, baru 45, pulih 20, write-off 15, saldo akhir 350. Total kredit awal 10.000, akhir 10.100. Interpretasi: NPL awal 340/10.000 = 3,40%; NPL akhir 350/10.100 = 3,47%; kenaikan 0,07 pp. Komponen terbesar pendorong = kredit baru bermasalah.",
      tasks: [
        { id: "t1", text: "Hitung `saldo_akhir`, `npl_awal`, `npl_akhir`, dan `delta_pp`" },
        { id: "t2", text: "Cetak waterfall satu baris sesuai format yang diharapkan" },
      ],
      expected: "Waterfall: 340 + 45 - 20 - 15 = 350 (NPL 3.40% -> 3.47%, +0.07pp)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“NPL naik 0,07 pp — kecil, abaikan.” Kecil di level portofolio bisa besar di level pendorong: +45 baru bermasalah ditahan oleh −35 pemulihan+write-off. Bila pemulihan berhenti bulan depan, kenaikan berikutnya bukan 0,07 pp melainkan 0,45 pp. Waterfall membaca masa depan, bukan hanya masa lalu.",
      },
      hints: [
        "saldo_akhir = 340 + 45 - 20 - 15.",
        "npl_awal = 340 / 10000 * 100; npl_akhir = saldo_akhir / 10100 * 100.",
        "delta_pp = npl_akhir - npl_awal (angka tak bulat, format 2 desimal).",
      ],
      code: {
        starter: `# Data ilustratif (Rp miliar). JANGAN UBAH baris ini.\nsaldo_awal, baru, pulih, wo = 340, 45, 20, 15\ntotal_awal, total_akhir = 10000, 10100\n\n# TULIS KODEMU: waterfall NPL\nsaldo_akhir =\nnpl_awal =\nnpl_akhir =\ndelta_pp =\n\nprint(f"Waterfall: {saldo_awal} + {baru} - {pulih} - {wo} = {saldo_akhir} (NPL {npl_awal:.2f}% -> {npl_akhir:.2f}%, {delta_pp:+.2f}pp)")`,
        lockLines: 2,
        solution: `# Data ilustratif (Rp miliar). JANGAN UBAH baris ini.\nsaldo_awal, baru, pulih, wo = 340, 45, 20, 15\ntotal_awal, total_akhir = 10000, 10100\n\n# TULIS KODEMU: waterfall NPL\nsaldo_akhir = saldo_awal + baru - pulih - wo\nnpl_awal = saldo_awal / total_awal * 100\nnpl_akhir = saldo_akhir / total_akhir * 100\ndelta_pp = npl_akhir - npl_awal\n\nprint(f"Waterfall: {saldo_awal} + {baru} - {pulih} - {wo} = {saldo_akhir} (NPL {npl_awal:.2f}% -> {npl_akhir:.2f}%, {delta_pp:+.2f}pp)")`,
        checks: [
          { kind: "equal", task: "t1", name: "saldo_akhir", value: 350, tol: 1e-9, label: "`saldo_akhir` = 350", msg: "340 + 45 − 20 − 15 = 350." },
          { kind: "equal", task: "t1", name: "npl_awal", value: 3.4, tol: 1e-9, label: "`npl_awal` = 3.40", msg: "340 / 10.000 × 100 = 3,40%." },
          { kind: "equal", task: "t1", name: "npl_akhir", value: 3.4653465346534658, tol: 0.01, label: "`npl_akhir` sekitar 3.47", msg: "350 / 10.100 × 100 = 3,4653%." },
          { kind: "equal", task: "t1", name: "delta_pp", value: 0.06534653465346585, tol: 0.01, label: "`delta_pp` sekitar +0.07", msg: "3,4653 − 3,40 = 0,0653 pp." },
          { kind: "stdout_matches", task: "t2", pattern: "Waterfall: 340 \\+ 45 - 20 - 15 = 350 \\(NPL 3\\.40% -> 3\\.47%, \\+0\\.07pp\\)", label: "Waterfall tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Waterfall = saldo awal + baru − pulih − write-off. Tiap komponen bernama; write-off bukan perbaikan.",
    },
    {
      id: "rekonsiliasi",
      eyebrow: "Langkah 9 · Konsep",
      title: "Query rekonsiliasi: dua sumber, satu kebenaran",
      prose: [
        "Laporan risiko mengambil data dari dua sumber atau lebih: core banking dan data warehouse, atau warehouse dan file tim kredit. Rekonsiliasi adalah query yang membuktikan keduanya cocok — sebelum angka naik ke laporan. Polanya: hitung COUNT dan SUM dari kedua sumber dengan filter as-of yang SAMA, lalu tampilkan selisihnya. Selisih nol = lolos; selisih bukan nol = investigasi, bukan pembulatan.",
        "Contoh ilustratif: sumber A (core banking) mencatat 1.250 rekening kredit per 31 Oktober; sumber B (warehouse) mencatat 1.247. Selisih 3 rekening (0,24 persen). Tiga rekening itu harus dicari satu per satu — biasanya: rekening baru yang belum masuk proses ETL malam itu, rekening yang tutup di tengah bulan, atau rekening dengan segmen NULL yang lolos dari GROUP BY. Rekonsiliasi yang berhenti di 'selisih 3, kecil' adalah rekonsiliasi yang gagal: kecil hari ini, besar saat ETL-nya rusak.",
        "Tiga query rekonsiliasi yang wajib ada di setiap paket laporan: (1) jumlah baris per sumber (COUNT); (2) total nilai per sumber (SUM baki); (3) daftar kunci yang hanya ada di satu sumber (LEFT JOIN + IS NULL — anti-join). Yang ketiga paling berharga: ia menyebutkan NAMA rekening yang hilang, bukan hanya jumlahnya. Ambang toleransi (contoh internal: selisih di bawah 0,1 persen boleh jalan dengan catatan) harus tertulis — bukan dirasakan.",
        "Rujuk silang: rekonsiliasi di level konsep diajarkan di RR4 (kualitas data) dan RR31 (Python); lesson ini menambahkan bentuk SQL-nya — anti-join dan perbandingan agregat — supaya kamu bisa menuliskannya langsung di database, tanpa menunggu script Python.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Selisih 3 dari 1.250 = 0,24 persen, abaikan saja.” Selisih kecil yang tidak dijelaskan adalah ETL yang mulai bocor. Hari ini 3 rekening, bulan depan 30. Rekonsiliasi bukan soal besar selisihnya — soal apakah selisihnya bisa DIJELASKAN.",
      },
      hints: [
        "Anti-join: SELECT kunci FROM A LEFT JOIN B ON A.kunci = B.kunci WHERE B.kunci IS NULL — kunci yang hanya ada di A.",
        "Selalu samakan filter as-of kedua sumber sebelum membandingkan; selisih karena as-of berbeda bukan selisih data.",
      ],
      reference: "Rekonsiliasi = COUNT + SUM + anti-join, as-of sama. Selisih harus dijelaskan, bukan dibulatkan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Kapan SQL cukup, kapan butuh pipeline?",
      prose: [
        "Satu: laporan sekali jalan, data di bawah 1 juta baris, satu sumber → SQL ad-hoc cukup; simpan query-nya dengan as-of tertulis. Dua: laporan berulang bulanan dengan definisi yang sama → simpan sebagai view (lihat C-track soal view) atau stored query berversi; jangan salin-ulang query tiap bulan. Tiga: multi-sumber + rekonsiliasi + jadwal terbit → pipeline terjadwal (RR8/RR14): extract, transform, gerbang QA, lalu terbit. Empat: data di atas 100 juta baris atau butuh window function berat → pastikan ada indeks pada kolom tanggal as-of dan kunci join; query tanpa indeks di data besar = laporan yang tidak pernah selesai.",
        "Aturan praktis: bila query-mu disalin ke lebih dari 3 tempat, ia sudah bukan query — ia definisi yang butuh satu rumah (view). Bila laporanmu gagal karena satu orang cuti, ia sudah bukan proses — ia kebiasaan yang butuh pipeline. SQL di lesson ini membawamu sampai ke gerbang itu; RR8 dan RR14 membawamu melewatinya. Dasar view diajarkan sebagai modul bersama di C19 — Views (track SQL).",
      ],
      tasks: [],
      reference: "Ad-hoc → view berversi → pipeline terjadwal. Salinan ke-3 = tanda butuh view.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "NPL naik — dari mana? Jawab dalam 10 menit",
      prose: [
        "Komite bertanya: NPL naik dari 3,40 persen ke 3,47 persen bulan ini. Kamu punya 10 menit sebelum rapat. Jawaban yang benar memakai tiga alat lesson ini: (1) cek as-of — pastikan kedua angka memakai as-of yang sama (31 Sep vs 31 Okt, bukan tanggal tarik); (2) buka waterfall — pendorongnya kredit baru bermasalah Rp45 miliar, ditahan pemulihan dan write-off; (3) buka bucketing — berapa baki yang migrasi dari 31–60 ke 61–90 bulan ini, karena itu antrean NPL bulan depan.",
        "Jawaban 10 menit yang jujur: 'NPL naik 0,07 pp ke 3,47 persen (as-of 31 Okt). Pendorongnya kredit baru bermasalah Rp45 miliar; pemulihan Rp20 miliar dan write-off Rp15 miliar menahan kenaikan. Perhatian: bucket 31–60 berisi Rp900 juta — bila separuhnya migrasi bulan depan, NPL naik lagi sekitar 0,04 pp.' Tiga kalimat, tiga alat, satu keputusan yang bisa diambil. Itulah SQL untuk risk reporting.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jawaban 'NPL naik 0,07 pp' tanpa waterfall dan bucketing = jawaban yang benar tetapi tidak berguna. Komite tidak butuh angka — ia butuh pendorong dan antrean. SQL yang baik menghasilkan ketiganya dalam satu tarikan napas.",
      },
      reference: "As-of → waterfall → migrasi bucket. Tiga alat, satu jawaban 10 menit.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: as-of, bucketing, agregasi, waterfall, dan rekonsiliasi.",
      ],
      tasks: [],
      summary: [
        "As-of eksplisit + snapshot berversi = laporan yang bisa direproduksi siapa pun.",
        "Bucketing DPD (CASE WHEN) mengubah hari tunggakan menjadi bahasa manajemen; baca migrasinya.",
        "Agregasi dulu, rasio kemudian — NPL portofolio bukan rata-rata NPL segmen.",
        "Waterfall mengurai pergerakan: saldo awal + baru − pulih − write-off = saldo akhir.",
        "Rekonsiliasi = COUNT + SUM + anti-join; selisih harus dijelaskan, bukan dibulatkan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Dua analis melaporkan NPL berbeda dari data yang sama. Penyebab paling mungkin menurut lesson ini?",
          options: [
            { text: "Salah satunya salah rumus NPL", why: "Mungkin, tetapi insiden di cerita ini bukan rumus — keduanya benar menurut query masing-masing." },
            { text: "Tidak ada tanggal as-of yang disepakati di query", why: "Benar: tanpa as-of, query yang sama menghasilkan angka berbeda tiap kali dijalankan.", correct: true },
            { text: "Datanya memang selalu berubah-ubah", why: "Data operasional berubah — justru karena itu as-of dan snapshot dibutuhkan." },
            { text: "Salah satu memakai Excel, satunya SQL", why: "Alatnya bukan masalah; tanggal posisinya yang tidak disepakati." },
          ],
        },
        {
          q: "Dari data lab bucketing: bucket mana yang berisi baki terbesar kedua, dan berapa?",
          options: [
            { text: "1–30, Rp1.150 juta", why: "Benar: 0 = 2.700, lalu 1–30 = 1.150, 31–60 = 900, >90 = 500, 61–90 = 150.", correct: true },
            { text: "31–60, Rp900 juta", why: "Itu terbesar ketiga, bukan kedua." },
            { text: ">90, Rp500 juta", why: "Itu terbesar keempat." },
            { text: "61–90, Rp150 juta", why: "Itu yang terkecil." },
          ],
        },
        {
          q: "NPL Oktober 3,47% vs September 3,23% (angka bulat). Selisih MoM yang benar menurut lab?",
          options: [
            { text: "0,24 pp (3,47 − 3,23)", why: "Salah: itu selisih angka yang sudah dibulatkan. Selisih benar dihitung dari angka tak bulat." },
            { text: "0,23 pp (dari 3,4653% − 3,2323%)", why: "Benar: bulatkan hanya di tampilan akhir, bukan di tengah perhitungan.", correct: true },
            { text: "0,07 pp", why: "Itu delta waterfall September→Oktober pada contoh lain (340→350 dari total berbeda). Jangan campur contoh." },
            { text: "Tidak bisa dihitung tanpa data mentah", why: "Bisa: lab menghitungnya dari total dan bermasalah tiap bulan." },
          ],
        },
        {
          q: "Waterfall ilustratif: saldo awal 340, baru 45, pulih 20, write-off 15. Saldo akhir dan NPL akhir (total akhir 10.100)?",
          options: [
            { text: "350 dan 3,47%", why: "Benar: 340 + 45 − 20 − 15 = 350; 350 / 10.100 = 3,47%.", correct: true },
            { text: "360 dan 3,56%", why: "Salah: write-off mengurangi saldo, bukan menambah." },
            { text: "330 dan 3,27%", why: "Salah: pemulihan dan write-off sudah dikurangi; periksa tanda tiap komponen." },
            { text: "350 dan 3,50%", why: "Salah: penyebutnya 10.100, bukan 10.000." },
          ],
        },
        {
          q: "Sumber A mencatat 1.250 rekening, sumber B 1.247. Tindakan yang benar?",
          options: [
            { text: "Abaikan — selisih 0,24% terlalu kecil", why: "Salah: selisih kecil yang tak dijelaskan adalah ETL yang mulai bocor." },
            { text: "Cari 3 rekening itu dengan anti-join dan jelaskan penyebabnya", why: "Benar: rekonsiliasi menuntut penjelasan, bukan pembulatan.", correct: true },
            { text: "Pakai angka sumber A saja karena lebih besar", why: "Salah: lebih besar bukan lebih benar — buktikan dulu." },
            { text: "Rata-ratakan kedua sumber", why: "Salah: merata-rata dua sumber menyembunyikan kebocoran ETL." },
          ],
        },
      ],
    },
  ],
};
