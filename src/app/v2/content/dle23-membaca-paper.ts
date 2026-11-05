import type { V2Lesson } from "../lib/types";

// Tiga putaran membaca paper: skim cepat -> struktur -> detail. Hanya paper
// yang lolos putaran awal yang layak dibayar dengan waktu putaran akhir.
const PUTARAN_SVG = `<svg viewBox=\"0 0 560 300\" role=\"img\" aria-label=\"Diagram tiga putaran membaca paper: skim, struktur, detail, dengan gerbang keputusan.\">
<g font-family=\"var(--font-ui)\" font-size=\"12\" text-anchor=\"middle\">
<rect x=\"30\" y=\"40\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.9\"/><text x=\"100\" y=\"63\" fill=\"#fff\" font-weight=\"600\">Putaran 1 · Skim</text><text x=\"100\" y=\"82\" fill=\"#fff\" font-size=\"11\">10 menit</text>
<rect x=\"210\" y=\"40\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.9\"/><text x=\"280\" y=\"63\" fill=\"#fff\" font-weight=\"600\">Putaran 2 · Struktur</text><text x=\"280\" y=\"82\" fill=\"#fff\" font-size=\"11\">40 menit</text>
<rect x=\"390\" y=\"40\" width=\"140\" height=\"60\" rx=\"8\" fill=\"var(--c3)\" opacity=\"0.9\"/><text x=\"460\" y=\"63\" fill=\"#fff\" font-weight=\"600\">Putaran 3 · Detail</text><text x=\"460\" y=\"82\" fill=\"#fff\" font-size=\"11\">1–3 jam</text>
<rect x=\"30\" y=\"150\" width=\"140\" height=\"70\" rx=\"8\" fill=\"var(--bg-panel)\" stroke=\"var(--border)\"/><text x=\"100\" y=\"172\" fill=\"var(--text)\" font-size=\"11\">abstract, gambar,</text><text x=\"100\" y=\"188\" fill=\"var(--text)\" font-size=\"11\">tabel hasil, kesimpulan</text><text x=\"100\" y=\"206\" fill=\"var(--text-muted)\" font-size=\"11\">layak lanjut?</text>
<rect x=\"210\" y=\"150\" width=\"140\" height=\"70\" rx=\"8\" fill=\"var(--bg-panel)\" stroke=\"var(--border)\"/><text x=\"280\" y=\"172\" fill=\"var(--text)\" font-size=\"11\">metode, setup eksperimen,</text><text x=\"280\" y=\"188\" fill=\"var(--text)\" font-size=\"11\">baseline, metrik</text><text x=\"280\" y=\"206\" fill=\"var(--text-muted)\" font-size=\"11\">pahami tanpa bukti</text>
<rect x=\"390\" y=\"150\" width=\"140\" height=\"70\" rx=\"8\" fill=\"var(--bg-panel)\" stroke=\"var(--border)\"/><text x=\"460\" y=\"172\" fill=\"var(--text)\" font-size=\"11\">turunkan rumus kunci,</text><text x=\"460\" y=\"188\" fill=\"var(--text)\" font-size=\"11\">cek tabel per baris</text><text x=\"460\" y=\"206\" fill=\"var(--text-muted)\" font-size=\"11\">eksperimen pikiran</text>
</g>
<g stroke=\"var(--chart-grid)\" stroke-width=\"1.5\" marker-end=\"url(#ahp)\">
<defs><marker id=\"ahp\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L8,4 L0,8 z\" fill=\"var(--chart-grid)\"/></marker></defs>
<line x1=\"170\" y1=\"70\" x2=\"205\" y2=\"70\"/><line x1=\"350\" y1=\"70\" x2=\"385\" y2=\"70\"/>
<line x1=\"100\" y1=\"100\" x2=\"100\" y2=\"145\"/><line x1=\"280\" y1=\"100\" x2=\"280\" y2=\"145\"/><line x1=\"460\" y1=\"100\" x2=\"460\" y2=\"145\"/>
</g>
<g font-family=\"var(--font-ui)\" font-size=\"12\" fill=\"var(--text-muted)\" text-anchor=\"middle\">
<text x=\"280\" y=\"262\">waktu mahal hanya untuk paper yang lolos gerbang murah</text>
</g>
</svg>`;

export const dle23: V2Lesson = {
  slug: "dle23-membaca-paper",
  track: "Deep Learning Engineer",
  module: "Praktik Riset",
  title: "DLE23 — Membaca Paper & Mereproduksi Hasil",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Ribuan paper deep learning terbit tiap bulan; sebagian klaimnya tidak bertahan saat diuji ulang oleh tim lain. Lesson ini bukan tentang cara menulis paper — melainkan keterampilan yang lebih langka dan lebih mahal harganya: membaca paper secara kritis dan memutuskan mana yang layak diadopsi, sebelum kamu membayarnya dengan minggu kerja.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedah paper menjadi klaim, metode, dan bukti, lalu membacanya dalam 3 putaran sesuai budget waktu; (2) menginterogasi tabel hasil dengan 5 pertanyaan (baseline adil? error bar? cherry-picking?); (3) menjalankan checklist 7 item reproduksi sebelum mempercayai angka; (4) menilai apakah hasil paper berlaku di konteks datamu sendiri (domain shift, skala, biaya); (5) memutuskan jalur adopsi: baca saja, reproduksi mini, atau implementasi penuh.",
        "Prasyarat yang diringkas di sini (lesson ini self-contained): AUC = luas area di bawah kurva ROC, 1,0 = sempurna, 0,5 = tebakan acak — dipakai menilai ranking model; precision@k = dari k prediksi teratas, berapa persen yang benar-benar positif — relevan untuk fraud yang hanya bisa ditindaklanjuti sebagian; seed = angka awal generator acak yang menentukan inisialisasi bobot dan urutan data — seed berbeda bisa memberi hasil berbeda.",
        "Isi lesson: cerita kegagalan adopsi paper (angka 92,4% yang lenyap) → anatomi paper & metode 3 putaran → interogasi tabel hasil → checklist reproduksi → lab audit reproduksi dengan Python → peta keputusan adopsi → mini-case tim fraud → checkpoint.",
      ],
      tasks: [],
      reference: "Paper = klaim + metode + bukti. Bayar waktumu hanya untuk bukti yang lolos interogasi.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model 92,4% yang lenyap saat seed diganti",
      prose: [
        "Tim fraud sebuah perusahaan paylater menemukan paper metode baru deteksi fraud: klaim AUC 0,924, mengalahkan baseline gradient boosting 0,903. Selisih 2,1 poin — di dunia fraud, itu bernilai miliaran rupiah pencegahan kerugian. CTO memberi lampu hijau: adopsi dalam satu sprint.",
        "Dua minggu kemudian, engineer menjalankan kode resmi dari repo penulis. Hasilnya: AUC 0,886 — di BAWAH baseline 0,903. Bukan 2,1 poin di atas, melainkan 1,7 poin di bawah. Sprint hangus, kepercayaan ke paper runtuh, dan tim kembali ke model lama.",
        "Investigasi menemukan tiga hal. Pertama, penulis menjalankan 20 seed berbeda dan melaporkan seed terbaik sebagai hasil tunggal — seed hacking. Kedua, preprocessing menormalisasi fitur memakai mean dan standar deviasi dari data train DAN test yang digabung — kebocoran data. Ketiga, baseline GBM dijalankan dengan parameter default tanpa tuning, sementara metode baru di-tune 50 trial — pertandingan tidak adil.",
        "Twist-nya: angka 0,924 itu benar secara matematis — di laptop penulis, dengan seed itu, dengan kebocoran itu, memang keluar 0,924. Yang salah adalah asumsi tim: bahwa angka di paper = angka yang bisa dipegang orang lain. Paper tidak berbohong; paper hanya tidak bercerita lengkap. Lesson ini mengajarkan cara membaca cerita yang tidak ditulis itu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mengadopsi model dari paper tanpa verifikasi = model risk. Di industri teregulasi, model yang tidak bisa direproduksi tidak bisa diaudit — dan model yang tidak bisa diaudit tidak boleh menentukan keputusan kredit atau fraud.",
      },
      reference: "Angka paper benar di mesin penulis ≠ angka yang bisa dipegang timmu.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 3 · Anatomi paper",
      title: "Klaim, metode, bukti — dan cara membaca 3 putaran",
      prose: [
        "Setiap paper deep learning terdiri dari tiga komponen. Klaim: apa yang dijanjikan (biasanya di abstract dan kesimpulan — “metode kami mengungguli SOTA sebesar X”). Metode: bagaimana caranya (arsitektur, loss, trik training). Bukti: angka yang mendukung klaim (tabel hasil, ablation, grafik). Pembaca pemula membaca berurutan dari halaman 1; pembaca profesional memisahkan ketiganya dan menguji masing-masing.",
        "Putaran 1 — skim, 10 menit. Baca abstract, gambar arsitektur, tabel hasil utama, dan kesimpulan. Satu pertanyaan: apakah klaimnya cukup menarik dan angkanya cukup meyakinkan untuk lanjut? Sekitar 8 dari 10 paper gugur di sini — dan itu kabar baik, kamu baru menghabiskan 10 menit.",
        "Putaran 2 — struktur, 40 menit. Baca bagian metode dan setup eksperimen: dataset apa, split bagaimana, baseline siapa, metrik apa, berapa seed. Tujuannya memahami tanpa membuktikan — kamu ingin tahu APA yang dilakukan, belum menilai BENAR atau tidak.",
        "Putaran 3 — detail, 1–3 jam, hanya untuk paper yang lolos putaran 2. Turunkan rumus kunci dengan tangan, cek tabel hasil baris per baris, dan lakukan eksperimen pikiran: “jika saya ganti komponen X, apa yang seharusnya terjadi?” Putaran ini mahal — jangan bayar untuk paper yang belum lolos gerbang murah.",
        "💡 Intuisi: baca tabel hasil SEBELUM metode. Kalau angkanya tidak meyakinkan (tanpa error bar, baseline lemah), metode sebagus apa pun tidak mengubah keputusan. Tabel adalah gerbang termurah; metode adalah ruangan termahal.",
        "💡 Intuisi: appendix dan kode resmi adalah bagian paper yang tidak dicetak. Klaim hidup di halaman utama; kebenaran sering tinggal di appendix (detail tuning, seed, preprocessing) dan di repo (config default yang berbeda dari paper).",
        "Cara membaca: tiga kotak atas = tiga putaran dengan budget waktunya; tiga kotak bawah = yang dibaca di tiap putaran; panah antar putaran = gerbang keputusan “layak lanjut?”.",
        "Interpretasi: alirannya seperti corong seleksi — waktu mahal (putaran 3) hanya dialokasikan untuk paper yang lolos saringan murah (putaran 1–2). Kebanyakan kegagalan adopsi paper berasal dari melompat langsung ke putaran 3 tanpa gerbang.",
      ],
      figure: {
        svg: PUTARAN_SVG,
        alt: "Diagram tiga putaran membaca paper: skim 10 menit, struktur 40 menit, detail 1-3 jam, dengan gerbang keputusan antar putaran.",
        caption: "Corong 3 putaran: waktu mahal hanya untuk paper yang lolos gerbang murah.",
      },
      tasks: [],
      reference: "Skim 10 mnt → struktur 40 mnt → detail 1–3 jam. Tabel hasil dibaca sebelum metode.",
    },
    {
      id: "tabel-kritis",
      eyebrow: "Langkah 4 · Tabel hasil",
      title: "Menginterogasi tabel hasil: 5 pertanyaan",
      prose: [
        "Contoh kasus: paper fraud mengklaim precision@100 = 0,78 melawan baseline 0,71 — selisih 7 poin persentase. Sebelum terkesan, ajukan lima pertanyaan berikut. Setiap pertanyaan punya contoh angka agar kamu bisa merasakan kapan tabel jujur dan kapan tidak.",
        "Pertanyaan 1 — baseline adil? Baseline GBM paper memakai parameter default (0,71). Tim independen men-tune GBM yang sama 30 trial: 0,745. Selisih “7 pp” menyusut jadi 3,5 pp sebelum metode baru dinilai. Aturan: baseline harus mendapat budget tuning yang setara — kalau tidak ditulis, asumsikan tidak adil.",
        "Pertanyaan 2 — ada error bar? Paper melaporkan 0,78 dari 5 seed dengan std ±0,045; baseline 0,71 ±0,038. Intervalnya tumpang tindih (0,735–0,825 vs 0,672–0,748). Selisih 7 pp berada dalam rentang noise — belum terbukti lebih baik, apalagi dengan 5 seed. Aturan: tanpa std dari beberapa seed, selisih kecil = belum ada klaim.",
        "Pertanyaan 3 — cherry-picking? Tabel utama menampilkan 1 dataset; appendix (halaman 14) menunjukkan 3 dataset lain dengan hasil imbang atau kalah. Aturan: cek SEMUA dataset yang diuji, bukan yang dipilih untuk tabel utama. Satu kemenangan dari empat percobaan = tidak ada kemenangan.",
        "Pertanyaan 4 — ablation? Paper mengklaim komponen X sebagai sumber keunggulan. Tabel ablation: tanpa X, hasil 0,775 — kontribusi X hanya 0,005 dari total kenaikan 0,07. Kenaikan datang dari tempat lain (tuning, augmentasi), bukan dari ide yang dijual. Aturan: ablation yang jujur memisahkan “ide inti” dari “trik pendukung”.",
        "Pertanyaan 5 — signifikansi praktis? Bahkan jika 7 pp itu nyata secara statistik, tanyakan biaya: butuh GPU 4× lebih besar dan latensi 3× lipat untuk 7 pp di metrik yang std-nya 4,5 pp? Aturan: angka tanpa konteks biaya = angka yang belum bisa dipakai memutuskan.",
        "Ukur kesenjangan reproduksi dengan satu angka: Δ = M_klaim − M_rerun. Δ mendekati nol dan konsisten lintas seed = terverifikasi; Δ besar atau berubah tanda antar seed = klaim tidak bertahan.",
      ],
      formula: String.raw`\Delta = M_{\text{klaim}} - M_{\text{rerun}}`,
      formulaNote: "Δ (delta) = kesenjangan reproduksi; M_klaim = metrik yang dilaporkan paper; M_rerun = metrik dari eksekusi independen. Δ ≈ 0 dan stabil lintas seed berarti klaim terverifikasi; |Δ| besar berarti klaim tidak bertahan di luar kondisi penulis.",
      tasks: [],
      note: {
        title: "🚨 Mitos: SOTA di abstract = metode terbaik, adopsi saja",
        type: "pitfall",
        body: "Yang benar: gelar SOTA bisa lahir dari seed luck (20 seed, laporkan yang terbaik), budget tuning tak seimbang dengan baseline, atau dataset yang dipilih. Yang dinilai dari paper adalah desain eksperimen dan kekuatan bukti — bukan mahkota di abstract. Tanyakan lima pertanyaan di atas sebelum satu baris kode pun ditulis.",
      },
      reference: "Baseline adil? Error bar? Cherry-picking? Ablation? Biaya? — lima pertanyaan sebelum terkesan.",
    },
    {
      id: "checklist",
      eyebrow: "Langkah 5 · Checklist reproduksi",
      title: "Checklist 7 item sebelum mempercayai angka",
      prose: [
        "Setelah tabel lolos interogasi, verifikasi bahwa angka itu bisa dipegang orang lain. Tujuh item berikut adalah penyebab paling umum kegagalan reproduksi — urut dari yang paling sering menggagalkan.",
        "Item 1 — data: versi dataset persis, split train/val/test yang sama, dan preprocessing yang identik. Jebakan klasik: normalisasi memakai statistik train+test gabungan (bocor), atau split acak tanpa seed sehingga “test set” berbeda tiap run.",
        "Item 2 — seed & determinisme: seed dilaporkan? Hasil stabil lintas 3–5 seed? Jika hasil hanya muncul di satu seed, itu bukan temuan — itu lotre.",
        "Item 3 — hyperparameter lengkap: termasuk yang “tidak penting” seperti learning rate schedule, weight decay, batch size, jumlah epoch, dan early stopping patience. Paper sering menulis 5 hyperparameter utama dan menyembunyikan 15 lainnya di kode.",
        "Item 4 — compute & environment: versi library (hasil bisa bergeser antar versi cuDNN!), tipe GPU, dan presisi (FP32 vs mixed). “Kode sama” di GPU berbeda kadang memberi angka berbeda.",
        "Item 5 — kode resmi vs reimplementasi: menjalankan repo penulis dan mendapat angka sama = verifikasi artefak, BUKAN reproduksi. Reproduksi sejati berarti hasil bertahan saat diimplementasi ulang secara independen atau dijalankan di luar kondisi penulis — termasuk asumsi tersembunyi yang ikut terbawa di kode.",
        "Item 6 — asumsi tersembunyi: baca appendix dan kode, bukan cuma paper. Config default di repo kadang berbeda dari yang ditulis di paper (kasus nyata: paper menulis seed 42, config default repo seed 7).",
        "Item 7 — budget tuning setara: baseline dan metode baru mendapat jumlah trial yang sama. Kemenangan dengan 50 trial melawan baseline 1 trial adalah kemenangan anggaran, bukan kemenangan ide.",
        "Langkah terakhir: tanyakan apakah hasil berlaku di konteksMU. Domain shift — data paper (transaksi kartu kredit AS) vs datamu (paylater Indonesia): distribusi fraud-nya beda. Skala — paper memakai 10 juta sampel, kamu punya 200 ribu: metode yang haus data bisa runtuh. Biaya — latensi inferensi dan kebutuhan GPU: kenaikan 2 pp tidak worth it jika butuh GPU 4× lipat untuk scoring real-time.",
        "💡 Intuisi: reproduksi punya dua level. Level 1 (murah, 1–2 hari): jalankan kode resmi di subset datamu — menguji transferabilitas. Level 2 (mahal, 1–3 minggu): implementasi ulang independen — menguji kebenaran klaim. Kebanyakan keputusan adopsi cukup berhenti di level 1.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: ablation tidak penting, yang penting angka akhirnya tinggi",
        type: "pitfall",
        body: "Yang benar: tanpa ablation kamu tidak tahu komponen mana yang bekerja. Kasus nyata di lesson ini: komponen X yang dijual paper ternyata hanya menyumbang 0,005 dari kenaikan 0,07 — sisanya dari tuning dan augmentasi. Mengadopsi buta berarti membayar kompleksitas arsitektur baru tanpa manfaatnya. Ablation yang jujur adalah peta bagian mana yang boleh dibuang.",
      },
      reference: "Data, seed, hyperparameter, environment, kode vs reimplementasi, asumsi tersembunyi, budget setara — lalu cek konteks sendiri.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: audit reproduksi klaim vs rerun",
      prose: [
        "Waktunya praktik. Kamu diberi dua tabel: klaim dari paper (AUC dan precision@100 untuk tiga varian model) dan hasil menjalankan kode resmi penulis. Tugasmu: tulis skrip audit yang membandingkan keduanya, menghitung selisih, dan menandai tiap klaim sebagai OK (selisih dalam toleransi), GAGAL (selisih melewati toleransi), atau TIDAK TERVERIFIKASI (hasil rerun tidak ada — skripnya memang tidak ada di repo).",
        "Perhatikan baris “ours”: paper mengklaim AUC 0,924, tetapi repo penulis tidak menyertakan skrip training untuk varian itu. Klaim tanpa artefak = tidak bisa diverifikasi, dan skripmu harus menandainya secara eksplisit — bukan diam-diam melewatkannya.",
        "Cara membaca output: tiap baris = satu pasangan (model, metrik) dengan nilai klaim, nilai rerun, selisih absolut, dan status. Baris terakhir = ringkasan hitungan. Toleransi: AUC 0,01 dan precision@100 0,02 — selisih di atas itu dianggap GAGAL karena melebihi variasi wajar antar run.",
        "Interpretasi: hasil yang benar adalah 2 OK, 2 GAGAL, 2 TIDAK TERVERIFIKASI. Artinya: baseline terverifikasi, GBM tidak bertahan (selisih 0,019 dan 0,030 — kemungkinan tuning tak setara), dan varian “ours” tidak bisa dinilai sama sekali. Keputusan adopsi yang rasional: jangan adopsi sebelum dua masalah ini terjawab.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `laporan`: list berisi tuple `(model, metrik, klaim, rerun, delta, status)` untuk tiap pasangan — status `TIDAK TERVERIFIKASI` bila data rerun tidak ada" },
        { id: "t2", text: "Hitung `ok`, `gagal`, `hilang` = banyaknya baris berstatus OK, GAGAL, TIDAK TERVERIFIKASI" },
        { id: "t3", text: "Cetak tiap baris laporan lalu baris ringkasan dengan format persis seperti contoh" },
      ],
      expected: "baseline  auc   klaim=0.871 rerun=0.869 delta=0.002 OK … Terverifikasi: 2 | Gagal: 2 | Tidak terverifikasi: 2",
      hints: [
        "Ambil nilai rerun dengan rerun.get(model, {}).get(metrik) — hasilnya None bila tidak ada.",
        "delta = round(abs(klaim - rerun), 3); status OK bila delta <= TOL[metrik].",
        "Untuk nilai yang None, cetak tanda -, bukan angka.",
      ],
      code: {
        starter: `# Klaim dari paper: AUC dan Precision@100 untuk tiga varian model
klaim = {
    "baseline": {"auc": 0.871, "p100": 0.64},
    "gbm":      {"auc": 0.903, "p100": 0.71},
    "ours":     {"auc": 0.924, "p100": 0.78},
}
# Hasil menjalankan kode resmi (catatan: skrip 'ours' tidak ada di repo!)
rerun = {
    "baseline": {"auc": 0.869, "p100": 0.63},
    "gbm":      {"auc": 0.884, "p100": 0.68},
}
TOL = {"auc": 0.01, "p100": 0.02}  # toleransi selisih yang masih wajar

# TULIS KODEMU di bawah baris ini
laporan = ...
ok = ...
gagal = ...
hilang = ...

for ...:
    print(...)

print(f"Terverifikasi: {ok} | Gagal: {gagal} | Tidak terverifikasi: {hilang}")`,
        lockLines: 13,
        solution: `# Klaim dari paper: AUC dan Precision@100 untuk tiga varian model
klaim = {
    "baseline": {"auc": 0.871, "p100": 0.64},
    "gbm":      {"auc": 0.903, "p100": 0.71},
    "ours":     {"auc": 0.924, "p100": 0.78},
}
# Hasil menjalankan kode resmi (catatan: skrip 'ours' tidak ada di repo!)
rerun = {
    "baseline": {"auc": 0.869, "p100": 0.63},
    "gbm":      {"auc": 0.884, "p100": 0.68},
}
TOL = {"auc": 0.01, "p100": 0.02}  # toleransi selisih yang masih wajar

# TULIS KODEMU di bawah baris ini
laporan = []
for model, met in klaim.items():
    for metrik, nilai_klaim in met.items():
        r = rerun.get(model, {}).get(metrik)
        if r is None:
            laporan.append((model, metrik, nilai_klaim, None, None, "TIDAK TERVERIFIKASI"))
        else:
            delta = round(abs(nilai_klaim - r), 3)
            status = "OK" if delta <= TOL[metrik] else "GAGAL"
            laporan.append((model, metrik, nilai_klaim, r, delta, status))

ok = sum(1 for b in laporan if b[5] == "OK")
gagal = sum(1 for b in laporan if b[5] == "GAGAL")
hilang = sum(1 for b in laporan if b[5] == "TIDAK TERVERIFIKASI")

for model, metrik, k, r, d, s in laporan:
    rs = f"{r:.3f}" if r is not None else "-"
    ds = f"{d:.3f}" if d is not None else "-"
    print(f"{model:9} {metrik:5} klaim={k:.3f} rerun={rs} delta={ds} {s}")

print(f"Terverifikasi: {ok} | Gagal: {gagal} | Tidak terverifikasi: {hilang}")`,
        checks: [
          { kind: "defined", task: "t1", name: "laporan", label: "`laporan` terdefinisi", msg: "Simpan hasil audit sebagai list di variabel laporan." },
          { kind: "equal", task: "t2", name: "ok", value: 2, label: "`ok` seharusnya 2", msg: "Dua baris baseline: delta 0,002 dan 0,010 — dalam toleransi." },
          { kind: "equal", task: "t2", name: "gagal", value: 2, label: "`gagal` seharusnya 2", msg: "Dua baris gbm: delta 0,019 (> 0,01) dan 0,030 (> 0,02)." },
          { kind: "equal", task: "t2", name: "hilang", value: 2, label: "`hilang` seharusnya 2", msg: "Dua baris ours: tidak ada data rerun di repo." },
          { kind: "stdout_matches", task: "t3", pattern: "Terverifikasi: 2 \\| Gagal: 2 \\| Tidak terverifikasi: 2", label: "Baris ringkasan tercetak benar", msg: "Samakan formatnya dengan baris print terakhir di starter." },
          { kind: "stdout_matches", task: "t3", pattern: "gbm\\s+auc\\s+klaim=0\\.903\\s+rerun=0\\.884\\s+delta=0\\.019\\s+GAGAL", label: "Baris GAGAL terdeteksi", msg: "gbm/auc: klaim 0,903 vs rerun 0,884, delta 0,019 > toleransi 0,01." },
          { kind: "stdout_matches", task: "t3", pattern: "ours\\s+auc\\s+klaim=0\\.924\\s+rerun=-\\s+delta=-\\s+TIDAK TERVERIFIKASI", label: "Baris tak terverifikasi terdeteksi", msg: "ours tidak ada di rerun — cetak tanda - dan status TIDAK TERVERIFIKASI." },
        ],
      },
      reference: "Bandingkan klaim vs rerun per (model, metrik); tandai OK / GAGAL / TIDAK TERVERIFIKASI.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: baca saja, reproduksi mini, atau implementasi penuh?",
      prose: [
        "Skenario 1 — ide menarik, bukti lemah (tanpa error bar, baseline tak adil, tanpa ablation). → Baca saja, catat idenya di bank ide. Alasan: mengimplementasikan klaim yang belum terbukti = membayar riset orang lain dengan waktumu.",
        "Skenario 2 — bukti kuat, kode resmi tersedia, tetapi konteksmu berbeda (skala data, latensi, distribusi). → Reproduksi mini 1–2 hari di subset datamu sendiri. Alasan: ini tes transferabilitas termurah — gagal di sini berarti gagal juga di implementasi penuh, dengan biaya sepersepuluhnya.",
        "Skenario 3 — reproduksi mini lolos DAN cocok konteks (skala, latensi, biaya compute masuk akal). → Implementasi penuh dengan evaluasi di data sendiri, lengkap dengan baseline yang di-tune setara. Alasan: sekarang risikonya terukur dan keputusannya bisa dipertanggungjawabkan.",
        "Skenario 4 — klaim tak terverifikasi (kode tidak ada, angka tak bertahan) atau biaya tak masuk akal (GPU 4× untuk 2 pp). → Tolak dengan alasan tertulis satu paragraf. Alasan: penolakan yang didokumentasikan menghemat tim berikutnya dari mengulang interogasi yang sama.",
        "Skenario 5 — butuh pembanding yang kuat untuk model internal, bukan adopsi. → Reimplementasi minimal sebagai baseline internal. Alasan: paper terbaik pun berguna sebagai tongkat ukur — kamu tidak harus membeli idenya untuk memakainya sebagai pembanding.",
        "Aturan praktis 10 detik: (1) cek error bar dulu — tanpa std, selisih kecil = noise; (2) cek baseline adil — budget tuning setara; (3) cek ablation — komponen yang diklaim harus terbukti berkontribusi; (4) tidak ada yang lolos → jangan bayar dengan minggu implementasi.",
      ],
      note: {
        title: "💡 Intuisi: keputusan adopsi = manajemen risiko, bukan pemilihan juara",
        body: "Pertanyaannya bukan “paper mana yang terbaik?” melainkan “berapa biaya jika klaim ini salah, dan berapa biaya untuk memastikannya benar?”. Reproduksi mini adalah premi asuransi termurah terhadap risiko adopsi buta.",
      },
      tasks: [],
      reference: "Lemah → baca saja. Kuat tapi beda konteks → reproduksi mini. Lolos mini → implementasi penuh.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tim fraud menilai paper untuk diadopsi",
      prose: [
        "Tim fraud sebuah paylater punya satu sprint (2 minggu) untuk menaikkan precision@100 modelnya dari 0,71. Seorang engineer mengusulkan paper metode baru: klaim 0,78 — kenaikan 7 poin persentase. CTO bertanya: adopsi penuh, atau tidak?",
        "Tim menerapkan lesson ini. Putaran 1–2: klaim menarik, metode masuk akal, tabel utama meyakinkan. Reproduksi mini (level 1, 2 hari): menjalankan kode resmi di 10% data internal → 0,73, bukan 0,78. Selisih 5 pp dari klaim — lampu kuning.",
        "Tim menggali ablation di paper: tanpa komponen X yang dijual sebagai inovasi, hasil paper 0,775 — kontribusi X hanya 0,005. Lalu mereka men-tune baseline GBM sendiri 30 trial (paper memakai default): baseline naik dari 0,71 ke 0,745. Rekonstruksi kenaikan “7 pp”: 3,5 pp dari tuning baseline yang tidak adil + 0,5 pp dari komponen X + sisanya noise antar seed.",
        "Keputusan: adopsi parsial. Terapkan tuning 30 trial + augmentasi data ke model lama (3 hari kerja, biaya ±Rp9 juta) → precision@100 naik ke ~0,75 di data sendiri. Tolak arsitektur baru (hemat 3 minggu kerja ±Rp45 juta + risiko latensi produksi). Pembahasan: tim tidak “kalah” dari paper — mereka membeli 4 pp yang nyata dengan Rp9 juta, alih-alih membayar Rp45 juta untuk 7 pp yang semu. Itulah gunanya membaca paper seperti auditor, bukan seperti penggemar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan adopsi model adalah keputusan model risk. Dokumentasikan interogasi (baseline, error bar, ablation, biaya) sebagai artefak — auditor dan regulator menanyakan tepat hal-hal ini saat model menentukan keputusan kredit atau fraud.",
      },
      reference: "Beli kenaikan yang nyata dan murah; tolak kenaikan semu yang mahal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang membaca paper dan mereproduksi hasil — dari urutan baca sampai keputusan adopsi.",
      ],
      tasks: [],
      summary: [
        "Paper = klaim + metode + bukti; baca dalam 3 putaran (skim 10 mnt → struktur 40 mnt → detail 1–3 jam), tabel hasil dibaca sebelum metode.",
        "Interogasi tabel dengan 5 pertanyaan: baseline adil? error bar? cherry-picking? ablation? signifikansi praktis?",
        "Kesenjangan reproduksi Δ = M_klaim − M_rerun; menjalankan kode resmi = verifikasi artefak, bukan reproduksi.",
        "Checklist 7 item: data, seed, hyperparameter, environment, kode vs reimplementasi, asumsi tersembunyi, budget tuning setara — lalu cek transferabilitas ke konteks sendiri.",
        "Keputusan adopsi: bukti lemah → baca saja; kuat tapi beda konteks → reproduksi mini 1–2 hari; lolos mini → implementasi penuh.",
      ],
      next: { label: "DLE24 — RAG End-to-End: Implementasi & Evaluasi Retrieval", href: "/learn/dle24-rag-implementasi" },
      quiz: [
        {
          q: "Urutan membaca paper yang benar menurut metode 3 putaran?",
          options: [
            { text: "Detail dulu (rumus), baru skim abstract", why: "Putaran 3 paling mahal — jangan bayar sebelum paper lolos gerbang murah putaran 1." },
            { text: "Skim (abstract, tabel, gambar) → struktur (metode, setup) → detail (cek baris per baris)", why: "Corong seleksi: 10 menit memutuskan lanjut, 40 menit memahami, 1–3 jam memverifikasi — hanya untuk yang lolos.", correct: true },
            { text: "Baca berurutan dari halaman 1 sampai akhir seperti novel", why: "Paper bukan novel; membaca linear membuang jam pada paper yang tabelnya tidak meyakinkan." },
            { text: "Cukup baca abstract dan kesimpulan", why: "Itu tempat klaim tinggal — tanpa bukti (tabel, ablation), klaim = marketing." },
          ],
        },
        {
          q: "Paper klaim precision@100 0,78 vs baseline 0,71; std 5 seed masing-masing ±0,045 dan ±0,038. Kesimpulan yang tepat?",
          options: [
            { text: "Terbukti lebih baik 7 poin persentase", why: "Interval 0,735–0,825 vs 0,672–0,748 tumpang tindih — selisih 7 pp berada dalam rentang noise." },
            { text: "Selisihnya dalam noise — belum terbukti lebih baik", why: "Dengan std sebesar itu dari 5 seed, klaim keunggulan belum didukung bukti; butuh seed lebih banyak atau selisih lebih besar.", correct: true },
            { text: "Baseline-nya pasti buruk", why: "Tidak ada informasi budget tuning baseline dari angka ini saja — itu pertanyaan terpisah." },
            { text: "Satu seed sudah cukup untuk memastikan", why: "Satu seed justru menyembunyikan variansi; masalahnya di sini adalah variansi yang besar." },
          ],
        },
        {
          q: "Kamu menjalankan kode resmi penulis dan mendapat angka yang sama dengan paper. Artinya?",
          options: [
            { text: "Reproduksi berhasil, paper terbukti benar", why: "Menjalankan repo = memakai kondisi penulis (termasuk asumsi tersembunyi dan potensi kebocoran yang sama)." },
            { text: "Verifikasi artefak — belum reproduksi; reproduksi butuh hasil bertahan di luar kondisi penulis", why: "Reproduksi sejati = implementasi independen atau kondisi berbeda tetap memberi hasil sejalan.", correct: true },
            { text: "Tidak perlu memeriksa apa pun lagi", why: "Asumsi tersembunyi (preprocessing, seed pilihan) ikut terbawa saat menjalankan kode resmi." },
            { text: "Paper pasti bebas dari kebocoran data", why: "Kode resmi bisa mengandung kebocoran yang sama dengan yang dipakai penulis — kode tidak mengaudit dirinya sendiri." },
          ],
        },
        {
          q: "Item checklist yang paling sering menggagalkan reproduksi independen?",
          options: [
            { text: "Versi Python yang dipakai", why: "Berpengaruh kecil dibanding detail eksperimen yang tidak ditulis." },
            { text: "Detail preprocessing & hyperparameter yang tidak ditulis (normalisasi, LR schedule)", why: "Inilah yang paling sering hilang: 5 hyperparameter ditulis, 15 lainnya tersembunyi di kode atau tidak didokumentasikan.", correct: true },
            { text: "Nama penulis pertama", why: "Tidak relevan dengan kemampuan mereproduksi angka." },
            { text: "Jumlah halaman paper", why: "Panjang paper tidak berkorelasi dengan kelengkapan detail reproduksi." },
          ],
        },
        {
          q: "Ablation menunjukkan: tanpa komponen X, akurasi turun 0,2 pp dari total kenaikan 3 pp atas baseline. Artinya?",
          options: [
            { text: "Komponen X tidak berguna sama sekali", why: "0,2 pp tetap kontribusi — kecil, tapi bukan nol. Kesimpulannya soal proporsi, bukan eksistensi." },
            { text: "Kenaikan utama datang dari faktor lain (tuning, baseline lemah) — bukan dari X yang diklaim", why: "2,8 pp dari 3 pp tidak dijelaskan oleh X; ide yang dijual bukan mesin utama kenaikan.", correct: true },
            { text: "Paper terbukti hebat dan layak diadopsi penuh", why: "Justru sebaliknya: klaim inti paper lemah menurut buktinya sendiri." },
            { text: "Ablation tidak penting untuk keputusan", why: "Inilah tepat gunanya ablation: memisahkan ide inti dari trik pendukung sebelum kamu membayar kompleksitasnya." },
          ],
        },
        {
          q: "Kapan jalur “reproduksi mini” 1–2 hari adalah keputusan tepat?",
          options: [
            { text: "Selalu implementasi penuh langsung — lebih cepat", why: "Implementasi penuh yang gagal menghanguskan minggu kerja; reproduksi mini adalah asuransi murahnya." },
            { text: "Bukti paper kuat, tetapi konteksmu berbeda (skala, latensi, distribusi) — uji murah sebelum komitmen", why: "Reproduksi mini menguji transferabilitas dengan biaya sepersepuluh implementasi penuh.", correct: true },
            { text: "Tidak pernah — buang waktu saja", why: "Melewatkan validasi murah = mengambil risiko mahal secara buta." },
            { text: "Hanya untuk paper dari konferensi top", why: "Venue bukan bukti; prosedur verifikasi yang sama berlaku untuk semua paper." },
          ],
        },
      ],
    },
  ],
};
