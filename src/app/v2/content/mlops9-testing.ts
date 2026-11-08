import type { V2Lesson } from "../lib/types";

// Piramida testing ML: basis terluas = data tests, tengah = model tests, puncak = system tests.
const PYRAMID_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Piramida testing ML: data tests di basis, model tests di tengah, system tests di puncak.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<polygon points="240,18 360,150 120,150" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<line x1="180" y1="84" x2="300" y2="84" stroke="var(--chart-grid)" stroke-width="2"/>
<line x1="150" y1="117" x2="330" y2="117" stroke="var(--chart-grid)" stroke-width="2"/>
<text x="240" y="52" fill="var(--text)" font-weight="600">system tests</text>
<text x="240" y="70" fill="var(--text-muted)" font-size="11">end-to-end, kontrak API</text>
<text x="240" y="103" fill="var(--text)" font-weight="600">model tests</text>
<text x="240" y="136" fill="var(--text)" font-weight="600">data tests</text>
<text x="240" y="152" fill="var(--text-muted)" font-size="11">skema, rentang, distribusi</text>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)">
<text x="375" y="60">sedikit,</text><text x="375" y="76">mahal,</text><text x="375" y="92">lambat</text>
<text x="30" y="140">banyak,</text><text x="30" y="156">murah,</text><text x="30" y="172">cepat</text>
</g>
<text x="240" y="196" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">kegagalan ML paling sering lahir di basis piramida (data)</text>
</svg>`;

const MLOPS9_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Biaya bug data: Rp50 ribu di validasi, Rp8 juta di training, Rp7,5 miliar di produksi."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Rp50rb</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Rp8jt</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Rp7,5M</text><rect x="72.5" y="180.0" width="86.4" height="0.0" rx="3" fill="var(--c1)"/><text x="115.7" y="174.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp50 rb</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Validasi</text><rect x="211.8" y="179.8" width="86.4" height="0.2" rx="3" fill="var(--c3)"/><text x="255.0" y="173.8" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp8 jt</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Training</text><rect x="351.1" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c4)"/><text x="394.3" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp7,5 M</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Produksi</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">skala logaritmik</text></svg>`;

export const mlops9: V2Lesson = {
  slug: "mlops9-testing",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps9 — Testing: Data & Model Validation",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua puluh lima yang tidak menimbulkan error",
      prose: [
        "Upstream Bank Mini meng-update sistem input: kolom 'usia' yang tadinya integer kini kadang berisi string — 'dua puluh lima' untuk nasabah yang menolak menyebut angka. Pipeline tidak error: pandas membaca kolom sebagai object, model menerima array tanpa komplain, API tetap 200 OK.",
        "Selama 11 hari, 5% aplikasi dengan usia string mendapat skor dari... entah apa. Preprocessing mengubah string tak dikenal menjadi NaN, imputer mengisi dengan median 34 — nasabah 25 tahun dinilai sebagai 34 tahun. Keputusan limit meleset sistematis untuk segmen itu. Tidak ada exception. Tidak ada alert. Hanya kerugian yang tenang.",
        "Twist-nya: bug paling berbahaya di ML adalah yang TIDAK menimbulkan error. Software crash = ketahuan dalam detik. Data korup yang 'lolos' = model tetap menjawab dengan percaya diri penuh atas sampah. Testing ML ada untuk menangkap apa yang tidak bisa di-crash-kan.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa 25 test hijau tidak menjamin data benar; (2) menghitung biaya bug data dengan aturan 1:10:100 per lapisan; (3) merancang kontrak data (schema + distribusi) untuk satu fitur; (4) menempatkan jenis test yang tepat di lapisan pipeline yang tepat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Kalau pipeline jalan tanpa error, datanya pasti benar'",
        type: "pitfall",
        body: "'Berjalan' ≠ 'benar'. Sistem ML sangat pandai menelan sampah dan mengeluarkan jawaban yang tampak meyakinkan. Tanpa assertion eksplisit pada data (tipe, rentang, distribusi), kamu mengandalkan keberuntungan — dan keberuntungan bukan strategi testing.",
      },
      reference: "Bug ML paling berbahaya = yang tidak menimbulkan error.",
    },
    {
      id: "data-tests",
      eyebrow: "Langkah 2 · Data tests",
      title: "Kontrak untuk data",
      prose: [
        "Data tests = assertion otomatis pada data di tiap tahap pipeline. Empat jenis: skema (kolom & tipe sesuai kontrak — menangkap 'dua puluh lima'), rentang (usia 17–100, penghasilan ≥ 0 — menangkap bug sensor), distribusi (PSI vs baseline — menangkap pergeseran diam-diam), kelengkapan (missing rate < ambang — menangkap upstream yang berhenti kirim).",
        "Prinsip: gagalkan pipeline PAGI-PAGI (fail fast). Batch yang melanggar kontrak harus DITOLAK sebelum mencapai training/serving — bukan 'diperbaiki diam-diam' oleh imputer. Imputasi senyap mengubah bug data menjadi bias model yang tak terlacak.",
        "Data tests ditulis dari DUA sumber: ekspektasi bisnis ('usia nasabah 17–100') dan perilaku historis ('missing rate kolom X biasanya < 2%'). Keduanya penting: yang pertama menangkap hal mustahil, yang kedua menangkap hal tidak biasa.",
        "💡 Intuisi: seperti QC di pabrik makanan. Bahan baku (data) diperiksa SEBELUM masuk produksi — bukan setelah jadi sosis. Sekali bahan busuk masuk adonan, tidak ada QC produk jadi yang bisa memisahkannya kembali.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Imputer/preprocessing akan menangani data kotor'",
        type: "pitfall",
        body: "Preprocessing menangani data kotor yang DIKENAL dan TERUKUR (missing 2% → imputasi median). Ia tidak boleh menjadi tempat sampah untuk bug (tipe berubah, rentang mustahil). Bedakan 'kotor alami' vs 'rusak': yang pertama diimputasi, yang kedua MENOLAK batch + alert.",
      },
      reference: "4 jenis: skema, rentang, distribusi, kelengkapan. Tolak batch rusak, jangan imputasi diam-diam.",
    },
    {
      id: "model-tests",
      eyebrow: "Langkah 3 · Model tests",
      title: "Menguji perilaku, bukan cuma angka",
      prose: [
        "Metrik agregat (AUC 0,87) tidak cukup. Model tests menguji PERILAKU: invariansi ('ubah nama nasabah, skor tidak boleh berubah'), monotonicity ('penghasilan naik, risiko tidak boleh naik' — jika itu aturan bisnis), slice ('performa segmen nasabah baru tidak jatuh > 5pp dari global'), dan robustness ('noise kecil pada input → perubahan skor kecil').",
        "Dua teknik andalan. Metamorphic testing: tanpa tahu jawaban benar, kita tahu HUBUNGAN yang harus berlaku — 'skor(A) ≤ skor(B) jika A dominan lebih baik di semua fitur'. Adversarial/sensitivity: goyang input sedikit, pastikan output tidak melompat liar — model yang 'gugup' = tidak robust.",
        "Golden dataset: 50–200 kasus 'kebenaran' yang dikurasi manusia (termasuk edge case historis). Setiap versi model HARUS lolos semuanya. Ini 'ujian nasional' model — gagal satu soal kritis = tidak lulus, berapa pun AUC-nya.",
      ],
      figure: {
        svg: PYRAMID_SVG,
        alt: "Piramida testing ML: data tests di basis, model tests di tengah, system tests di puncak.",
        caption: "Piramida testing ML: basis terluas = data tests (murah, cepat, banyak). Kegagalan lahir paling sering di basis. Cara membaca: piramida 3 lapis; lapis bawah (terluas) = data tests, tengah = model tests, puncak = integration tests. Interpretasi: alokasikan test terbanyak di lapisan termurah — kebanyakan tim terbalik (banyak integration test mahal, sedikit data test murah) dan membayarnya dengan bug Rp7,5 miliar.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Hanya menguji di data yang 'bersih dan nyaman'. Golden dataset HARUS berisi edge case menyakitkan: format aneh, nilai batas, segmen minoritas. Model yang hanya diuji di jalan tol akan mogok di jalan desa — dan jalan desa adalah tempat nasabahmu tinggal.",
      },
      reference: "Uji perilaku: invariansi, slice, robustness + golden dataset berisi edge case.",
    },
    {
      id: "lab-validator",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: validator batch 200 aplikasi",
      prose: [
        "Batch 200 aplikasi kredit dari upstream semalam — dengan 3 jenis kerusakan yang disuntikkan: usia string (5%), penghasilan negatif (3%), kode pos kependekan (4%).",
        "Tugasmu: implementasikan tiga fungsi cek — `cek_skema` (tipe benar), `cek_rentang` (usia 17–100 & penghasilan ≥ 0), `cek_format` (kode pos = 5 digit). Batch dengan pelanggaran apa pun = DITOLAK.",
        "Cara membaca: tiap baris = jumlah baris melanggar per jenis. Interpretasi: total 37 pelanggaran dari 200 = batch ini 'terlihat normal' bagi pipeline tanpa test, tapi validator menangkapnya dalam milidetik. Inilah fail fast.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `cek_skema`, `cek_rentang`, `cek_format`" },
        { id: "t2", text: "Jalankan; baca jumlah pelanggaran" },
        { id: "t3", text: "Verifikasi vonis batch = DITOLAK" },
      ],
      expected: "skema 11 · rentang 20 · format 6 · DITOLAK (37)",
      note: {
        title: "💡 Intuisi: validator seperti satpam gerbang tol",
        body: "Satpam tidak memperbaiki mobil yang rusak — ia MENOLAK masuk. Validator data sama: tugasnya bukan membersihkan (itu preprocessing untuk kotor alami), melainkan menolak batch rusak + membunyikan alarm. Membersihkan bug = menyembunyikan bukti.",
      },
      hints: [
        "cek_skema: isinstance usia int, penghasilan (int,float), kode_pos str.",
        "cek_rentang: 17 <= usia <= 100 dan penghasilan >= 0 (cek tipe dulu agar string tidak lolos).",
        "cek_format: len(kode_pos)==5 dan isdigit().",
      ],
      code: {
        starter: `import random\nrandom.seed(99)\n\nbatch = []\nfor i in range(200):\n    usia = random.randint(21, 60)\n    gaji = round(random.gauss(12_000_000, 4_000_000))\n    pos  = f"{random.randint(10000, 99999)}"\n    r = random.random()\n    if r < 0.05:\n        usia = "dua puluh lima"\n    elif r < 0.08:\n        gaji = -abs(gaji)\n    elif r < 0.12:\n        pos = pos[:3]\n    batch.append({"usia": usia, "penghasilan": gaji, "kode_pos": pos})\n\n# TULIS KODEMU: tiga fungsi cek\ndef cek_skema(r):\n    \n\ndef cek_rentang(r):\n    \n\ndef cek_format(r):\n    \n\npelanggaran = {"skema": 0, "rentang": 0, "format": 0}\nfor r in batch:\n    if not cek_skema(r):   pelanggaran["skema"] += 1\n    if not cek_rentang(r): pelanggaran["rentang"] += 1\n    if not cek_format(r):  pelanggaran["format"] += 1\n\nprint(f"Batch: {len(batch)} baris")\nfor k, v in pelanggaran.items():\n    print(f"  pelanggaran {k}: {v} baris")\ntotal = sum(pelanggaran.values())\nprint(f"Verdict batch: {'DITOLAK' if total else 'DITERIMA'} ({total} pelanggaran)")`,
        lockLines: 18,
        solution: `import random\nrandom.seed(99)\n\nbatch = []\nfor i in range(200):\n    usia = random.randint(21, 60)\n    gaji = round(random.gauss(12_000_000, 4_000_000))\n    pos  = f"{random.randint(10000, 99999)}"\n    r = random.random()\n    if r < 0.05:\n        usia = "dua puluh lima"\n    elif r < 0.08:\n        gaji = -abs(gaji)\n    elif r < 0.12:\n        pos = pos[:3]\n    batch.append({"usia": usia, "penghasilan": gaji, "kode_pos": pos})\n\n# TULIS KODEMU: tiga fungsi cek\ndef cek_skema(r):\n    return isinstance(r["usia"], int) and isinstance(r["penghasilan"], (int, float)) and isinstance(r["kode_pos"], str)\n\ndef cek_rentang(r):\n    return (isinstance(r["usia"], int) and 17 <= r["usia"] <= 100\n            and isinstance(r["penghasilan"], (int, float)) and r["penghasilan"] >= 0)\n\ndef cek_format(r):\n    return isinstance(r["kode_pos"], str) and len(r["kode_pos"]) == 5 and r["kode_pos"].isdigit()\n\npelanggaran = {"skema": 0, "rentang": 0, "format": 0}\nfor r in batch:\n    if not cek_skema(r):   pelanggaran["skema"] += 1\n    if not cek_rentang(r): pelanggaran["rentang"] += 1\n    if not cek_format(r):  pelanggaran["format"] += 1\n\nprint(f"Batch: {len(batch)} baris")\nfor k, v in pelanggaran.items():\n    print(f"  pelanggaran {k}: {v} baris")\ntotal = sum(pelanggaran.values())\nprint(f"Verdict batch: {'DITOLAK' if total else 'DITERIMA'} ({total} pelanggaran)")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "pelanggaran skema: 11 baris", label: "Skema: 11", msg: "11 baris usia string tertangkap cek skema." },
          { kind: "stdout_matches", task: "t2", pattern: "pelanggaran rentang: 20 baris", label: "Rentang: 20", msg: "20 baris melanggar rentang (termasuk string yang gagal cek tipe)." },
          { kind: "stdout_matches", task: "t3", pattern: "Verdict batch: DITOLAK \\(37 pelanggaran\\)", label: "DITOLAK (37)", msg: "Total 37 pelanggaran -> batch ditolak + alert." },
        ],
      },
      reference: "isinstance dulu, bandingkan kemudian. Tolak + alert, jangan imputasi diam-diam.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Test apa yang wajib di mana?",
      prose: [
        "**Skenario 1 — Di pipeline training (tiap run).** WAJIB: skema + rentang + kelengkapan pada data masuk; metrik minimum + slice test pada model keluar. Ini gerbang MLOps5 — murah karena otomatis.",
        "**Skenario 2 — Di serving (tiap request/batch).** WAJIB: validasi input ringan (skema, rentang) dengan mode 'tolak atau fallback'. Tidak boleh berat (latensi!) — cek distribusi dilakukan asinkron sampling, bukan per request.",
        "**Skenario 3 — Berkala (harian/mingguan).** WAJIB: distribusi (PSI) semua fitur penting, golden dataset untuk model production, invariansi. Ini 'medical check-up' rutin model.",
        "**Skenario 4 — Sebelum deploy mayor.** WAJIB: semuanya + adversarial/sensitivity + review manusia. Ditambah shadow/canary (MLOps5). Tidak ada diskon untuk perubahan besar.",
        "Aturan praktis 10 detik: 'test apa yang jika gagal akan membuatku bersyukur ketahuan SEKARANG?' — tulis itu dulu. Mulai dari rasa takutmu yang paling nyata.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: test adalah kemarahan yang direncanakan",
        body: "Test yang baik lahir dari membayangkan hal terburuk lalu menulis assertion-nya SEBELUM terjadi. 'Bagaimana jika upstream mengirim string?' → tulis cek_skema hari ini. Kemarahan yang direncanakan = insiden yang tidak terjadi.",
      },
      reference: "Training: kontrak penuh. Serving: ringan + fallback. Berkala: distribusi + golden. Mayor: semua + manusia.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Sebelas hari tanpa error",
      prose: [
        "Bedah angka Bank Mini: 5% dari 1.200 aplikasi/hari = 60 aplikasi/hari × 11 hari = 660 keputusan salah segmen. Selisih limit rata-rata Rp8 juta × 660 = Rp5,28 M eksposur salah alokasi. Ditambah biaya investigasi: 2 engineer × 2 minggu × Rp15 jt = Rp60 jt. Total ≈ Rp5,34 M.",
        "Biaya membangun validator (cek skema + rentang, 3 hari kerja): ≈ Rp9 jt sekali. Rasio: 593x.",
        "**Pertanyaan:** (1) Kenapa bug ini tidak tertangkap monitoring API (uptime/latensi)? (2) Di lapis piramida mana bug ini seharusnya tertangkap? (3) Apa beda respons 'tolak batch' vs 'imputasi diam-diam' dalam kasus ini?",
        "**Pembahasan:** (1) API sehat — bug ada di SEMANTIK data, bukan infrastruktur. Monitoring lapis 1 (skema input) yang absen. (2) Basis piramida: data tests — skema. Termurah dan tercepat. (3) Tolak batch = 200 aplikasi ditahan 1 hari + alert → investigasi 1 hari. Imputasi diam-diam = 660 keputusan salah + ketahuan 11 hari kemudian. 'Memperbaiki' bug = menyembunyikan bukti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan limit berbasis usia yang salah imputasi = potensi pelanggaran prinsip kehati-hatian (prudential). Jika segmen yang dirugikan berkorelasi dengan kelompok dilindungi, ini menjadi masalah fairness/regulasi — bukan sekadar 'bug kecil'.",
      },
      reference: "Rp5,34 M vs Rp9 jt. Bug semantik tidak tertangkap monitoring infra.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Aturan 1:10:100: harga bug tergantung di mana ia tertangkap",
      prose: [
        "Cerita lesson ini: bug `umur` bernilai 25 lolos 25 test. Mari beri harga pada tiap lapisan tempat ia BISA tertangkap. Lapisan validasi data (Great Expectations / check sederhana): test `expect_column_values_to_be_between('umur', 0, 120)` — biaya menulis 10 menit, biaya jalan Rp500 per run. Total: ~Rp50 ribu. Lapisan training: bug tertangkap saat evaluasi aneh (`kenapa fitur umur tidak prediktif?`) — 2 hari investigasi engineer (Rp4 juta) + 1x retrain sia-sia (Rp4 juta) = Rp8 juta. Lapisan produksi: model live 3 minggu dengan fitur rusak — 50 ribu keputusan salah × Rp150 ribu ≈ Rp7,5 miliar. Rasio: 1 : 160 : 150.000. Inilah aturan 1:10:100 versi ML — bedanya, di ML pengalinya bisa 1:100:100.000.",
        "Kenapa 25 test tidak menangkapnya? Karena test-nya menguji KODE (`apakah fungsi jalan?`), bukan DATA (`apakah datanya waras?`). Test kode: `assert predict(df) is not None` — hijau walau df-nya sampah. Test data: `assert df['umur'].between(0, 120).all()` — merah dalam 1 detik. Dua jenis test yang berbeda, dan kebanyakan pipeline ML hanya punya yang pertama. Analoginya: menguji bahwa printer MENYALA (test kode) vs menguji bahwa yang tercetak ADALAH dokumen yang benar (test data).",
        "Kontrak data adalah cara sistematis menulis test data. Untuk tiap fitur, kontrak berisi TIGA klaim: (1) SKEMA — tipe, rentang, nullability (`umur: int, 0–120, tidak boleh null`); (2) DISTRIBUSI — mean/std dalam batas (`mean 32–45, std 8–15`); (3) RELASI — antar-kolom (`tanggal_lahir` konsisten dengan `umur` ± 1 tahun). Klaim ditulis sebagai kode, dijalankan tiap batch data masuk. Pelanggaran = pipeline BERHENTI sebelum training, bukan peringatan yang di-scroll lewat.",
        "Contoh kontrak konkret untuk fitur `tenor_bulan`: skema — integer, 1–60, null dilarang; distribusi — mean 24–36, tidak boleh ada nilai > 60 (outlier = bug input); relasi — `tenor_bulan <= (plafon / angsuran_min)` secara matematis. Saat upstream mengubah tenor maksimum menjadi 72 TANPA pemberitahuan, kontrak distribusi langsung merah: mean naik ke 41, nilai 72 muncul. Pipeline berhenti, engineer upstream dihubungi, model tidak pernah melihat data aneh itu. Biaya: Rp500. Alternatifnya: Rp7,5 miliar.",
        "Kontrak juga melindungi dari perubahan DIAM-DIAM yang paling berbahaya: perubahan SEMANTIK tanpa perubahan skema. Contoh: kolom `status` yang tadinya berisi `lancar/macet` diubah upstream menjadi `0/1` — tipe masih string, rentang masih 2 nilai unik, test skema HIJAU. Yang menangkap: test relasi/distribusi `proporsi 'macet' 3–8%` — tiba-tiba 0% karena nilainya jadi `1`. Inilah mengapa kontrak butuh 3 klaim, bukan 1: skema menangkap kerusakan kasar, distribusi menangkap pergeseran, relasi menangkap perubahan makna.",
        "Siapa menulis kontrak? BUKAN tim ML sendirian — kontrak adalah PERJANJIAN dua pihak: produsen data (upstream) dan konsumen (tim ML). Saat kontrak merah, pertanyaannya bukan `siapa yang salah?` melainkan `apakah upstream berubah (mereka perbaiki/umumkan) atau ekspektasi kita kedaluwarsa (kita update kontrak)?`. Keduanya jawaban valid — yang tidak valid adalah tidak ada yang tahu. Kontrak mengubah bug diam-diam menjadi percakapan eksplisit.",
        "Terapkan aturan 1:10:100 sebagai prioritas: minggu ini, tulis kontrak untuk 5 fitur TERPENTING (bukan 200 fitur sekaligus). Lima kontrak × 10 menit = < 1 jam kerja untuk mengasuransikan lapisan termurah. Fitur dipilih dari feature importance model + dampak bisnis. Sisanya menyusul tiap sprint. Testing ML yang baik bukan yang paling lengkap — melainkan yang paling dulu menangkap bug termahal.",
        "Kontrak data juga butuh masa tenggang saat pertama dipasang. Jika langsung blocking di hari pertama, 30 kontrak baru akan merah semua — banyak ekspektasi awal salah kalibrasi — dan tim upstream akan membenci sistemnya sebelum merasakan manfaatnya. Praktik yang benar: 2 minggu mode observasi. Kontrak berjalan, pelanggaran dicatat, TAPI tidak menghentikan pipeline. Setelah 2 minggu, kalibrasi ambang dari data observasi (mean aktual ± 3σ), baru aktifkan mode blocking. Kontrak yang dikalibrasi dari data nyata menghasilkan ~5% false positive; kontrak dari firasat menghasilkan ~40% dan dibenci semua orang. Sama seperti alert (MLOps7): presisi dulu, baru keberanian.",
      ],
      formula: String.raw`C_{lapis} = c_0 \times 10^{lapis}`,
      formulaNote: "C_lapis = biaya bug jika tertangkap di lapisan itu; c_0 = biaya di lapisan validasi data (~Rp50 ribu); lapis 0 = validasi, 1 = training, 2 = produksi. Di ML, pangkatnya bisa lebih besar dari 10 — itulah mengapa test data adalah investasi termurah.",
      figure: {
        svg: MLOPS9_DEEP_SVG,
        alt: "Diagram batang biaya bug: Rp50 ribu di lapisan validasi, Rp8 juta di training, Rp7,5 miliar di produksi.",
        caption: "Cara membaca: tinggi batang = biaya SATU bug data yang sama jika tertangkap di tiap lapisan (skala logaritmik — jarak visual dikompresi). Interpretasi: bug yang sama harganya Rp50 ribu atau Rp7,5 miliar tergantung DI MANA ia tertangkap. Test data 10 menit di lapisan validasi adalah premi termurah di MLOps.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: uji datanya, bukan cuma kodenya",
        body: "25 test hijau yang semuanya menguji kode = 0 perlindungan terhadap data sampah. Untuk setiap fitur penting, tulis 3 klaim kontrak: skema, distribusi, relasi. Test yang membuat pipeline BERHENTI saat data aneh — bukan yang memberi peringatan kuning yang diabaikan.",
      },
      reference: "Kontrak data = perjanjian tertulis produsen-konsumen. Mulai dari 5 fitur terpenting minggu ini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Bug ML paling berbahaya = yang tidak menimbulkan error; 'berjalan' ≠ 'benar'.",
        "Data tests: skema, rentang, distribusi, kelengkapan — gagalkan batch pagi-pagi.",
        "Bedakan kotor alami (imputasi) vs rusak (tolak + alert).",
        "Model tests: invariansi, slice, robustness + golden dataset berisi edge case.",
        "Piramida: basis terluas = data tests; kegagalan lahir paling sering di basis.",
      ],
      next: { label: "MLOps10 — Governance: Audit & Lineage", href: "/v2/learn/mlops10-governance" },
      quiz: [
        {
          q: "Kasus 'dua puluh lima': kenapa tidak ada error padahal data rusak?",
          options: [
            { text: "Pandas dan model menelan tipe campuran tanpa komplain — sampah diproses diam-diam", why: "Kolom jadi object, string → NaN → diimputasi median. Semua 'berhasil', semua salah.", correct: true },
            { text: "Pipeline-nya memang dirancang menerima string", why: "Tidak — itu bug upstream, bukan fitur." },
            { text: "Modelnya terlalu pintar", why: "Model tidak 'pintar mengatasi'; ia buta terhadap arti data." },
            { text: "Error-nya disembunyikan engineer", why: "Tidak ada yang disembunyikan — memang tidak ada error yang muncul." },
          ],
        },
        {
          q: "Batch dengan 37 pelanggaran dari 200 baris. Respons benar?",
          options: [
            { text: "Imputasi semua lalu lanjutkan — jangan perlambat pipeline", why: "Imputasi diam-diam = menyembunyikan bug upstream. 18,5% rusak bukan 'kotor alami'." },
            { text: "TOLAK batch + alert ke pemilik upstream", why: "Fail fast: hentikan sebelum mencapai model, dan beri tahu sumber masalahnya.", correct: true },
            { text: "Buang 37 baris diam-diam, pakai 163 sisanya", why: "Membuang diam-diam = bias seleksi tanpa catatan. Jika dibuang, catat dan laporkan." },
            { text: "Turunkan ambang test agar lolos", why: "Mengubah test agar lolos = memalsukan QC. Jangan pernah." },
          ],
        },
        {
          q: "Model lolos AUC tapi skor berubah saat nama nasabah diubah. Test apa yang gagal?",
          options: [
            { text: "Uji skema", why: "Skema soal struktur data, bukan perilaku model." },
            { text: "Uji invariansi — atribut irrelevan tidak boleh mengubah keputusan", why: "Nama tidak boleh memengaruhi skor kredit. Ini juga red flag fairness.", correct: true },
            { text: "Uji latensi", why: "Latensi soal kecepatan, bukan konsistensi keputusan." },
            { text: "Uji distribusi", why: "Distribusi soal data masuk, bukan perilaku model." },
          ],
        },
        {
          q: "Di mana cek distribusi (PSI) sebaiknya dijalankan untuk request serving?",
          options: [
            { text: "Per request, sinkron — biar teliti", why: "Terlalu berat untuk latensi ms; akan membunuh SLA." },
            { text: "Asinkron via sampling + agregat berkala", why: "Distribusi butuh banyak sampel; sampling 1–5% + job berkala memberi sinyal tanpa membebani request.", correct: true },
            { text: "Tidak perlu — cukup di training", why: "Drift terjadi DI PRODUKSI; hanya diukur di sana." },
            { text: "Manual tiap kuartal", why: "Terlalu jarang — drift 3 bulan = PayLancar berdarah." },
          ],
        },
        {
          q: "Golden dataset sebaiknya berisi apa?",
          options: [
            { text: "Kasus mudah yang pasti lolos — biar hijau", why: "Test yang selalu lolos = dekorasi, bukan pengaman." },
            { text: "50–200 kasus kurasi manusia TERMASUK edge case menyakitkan & historis", why: "'Ujian nasional' model: gagal satu soal kritis = tidak lulus, berapa pun AUC-nya.", correct: true },
            { text: "Seluruh data training", why: "Itu validasi biasa — golden harus KURASI, fokus pada yang kritis." },
            { text: "Data acak tiap run", why: "Acak = tidak reproducible; golden harus stabil sebagai pembanding antar versi." },
          ],
        },
        {
          q: "Upstream mengubah kolom `status` dari `lancar/macet` menjadi `0/1` tanpa pemberitahuan. Test mana yang MENANGKAP ini?",
          options: [
            { text: "Test skema: tipe string, 2 nilai unik", why: "Tipe masih string dan nilai unik masih 2 — test skema HIJAU. Perubahan semantik lolos dari test skema." },
            { text: "Test kode: `assert predict(df) is not None`", why: "Test kode hanya memastikan fungsi jalan — ia hijau bahkan jika seluruh isi df sampah. Ini test yang paling tidak relevan." },
            { text: "Test distribusi/relasi: proporsi `macet` harus 3–8%", why: "Tepat. Nilai `macet` tiba-tiba 0% karena berubah menjadi `1` — klaim distribusi/relasi langsung merah. Inilah mengapa kontrak butuh 3 klaim, bukan cuma skema.", correct: true },
            { text: "Tidak ada test yang bisa menangkap perubahan diam-diam", why: "Salah — test distribusi dan relasi dirancang persis untuk ini. `Tidak bisa ditest` biasanya berarti `belum ditulis testnya`." },
          ],
        },
      ],
    },
  ],
};
