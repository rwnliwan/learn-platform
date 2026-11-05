import type { V2Lesson } from "../lib/types";

export const mle7: V2Lesson = {
  slug: "mle7-testing",
  track: "Machine Learning Engineer",
  module: "Serving & Operasi",
  title: "MLE7 — Testing untuk ML",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Software biasa diuji dengan 'input X → output Y'. ML menambah dimensi: data bisa salah, model bisa 'benar secara kode tetapi salah secara makna'. Lesson ini membangun jaring pengaman berlapis.",
        "Tujuan lesson ini:",
        "• Menjelaskan piramida testing ML: data, pipeline, model, sistem.",
        "• Menulis data validation checks (skema, range, missing) dari nol.",
        "• Menguji invariant model (monotonisitas) dan metamorphic testing.",
        "• Membedakan testing offline vs shadow/canary di produksi.",
        "• Memutuskan test apa yang wajib untuk 4 skenario risiko berbeda.",
        "Isi lesson: cerita pipeline hijau yang memprediksi nol → piramida testing + lab validasi data → invariant + lab monotonisitas → test di produksi → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Pipeline hijau yang memprediksi nol untuk semua orang",
      prose: [
        "CI sebuah fintech hijau semua: 120 unit test lolos. Deploy berjalan mulus. Tiga hari kemudian, tim risiko menemukan model credit scoring memprediksi skor 0 — untuk SEMUA pengajuan. 4.200 keputusan dibuat berdasarkan angka nol.",
        "Twist-nya: semua test hanya memeriksa 'apakah kode berjalan tanpa error'. Tidak satu pun memeriksa 'apakah outputnya masuk akal'. Bug-nya sepele: perubahan nama kolom membuat feature engineering menghasilkan NaN, dan NaN di-cast menjadi 0 diam-diam. Kode 'berhasil' — hasilnya sampah.",
        "Inilah perbedaan testing ML vs software biasa: di ML, kegagalan paling mahal bukan crash (yang berisik dan cepat ketahuan), melainkan silent failure — sistem berjalan sempurna sambil menghasilkan keputusan salah.",
        "Pelajaran: test untuk ML harus menguji TIGA hal: kode (seperti biasa), data (apakah input waras?), dan perilaku model (apakah output masuk akal?).",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'CI hijau = aman deploy'",
        type: "pitfall",
        body: "Yang benar: CI tradisional hanya menguji kode. Untuk ML, butuh lapisan tambahan: validasi data, invariant model, dan evaluasi metrik dengan quality gate. Tanpa ketiganya, CI hijau adalah rasa aman yang palsu.",
      },
    },
    {
      id: "piramida",
      eyebrow: "Langkah 3 · Piramida testing ML",
      title: "Data, pipeline, model: tiga lapisan jaring",
      prose: [
        "Lapisan 1 — Data validation: skema (kolom & tipe benar?), range (usia 17–70, bukan −5 atau 250), missing rate (< ambang), distribusi (tidak bergeser tiba-tiba). Dijalankan SETIAP batch data masuk — training maupun serving.",
        "Lapisan 2 — Pipeline test: unit test tiap fungsi transformasi dengan input-output yang diketahui; integration test end-to-end pipeline dengan data kecil; determinisme test (run 2x hasil sama).",
        "Lapisan 3 — Model test: invariant (properti yang HARUS selalu benar, mis. skor naik saat penghasilan naik), metamorphic (input yang diubah sedikit → output berubah sedikit), dan quality gate metrik (AUC ≥ 0,80).",
        "Aturan: test yang murah dan cepat (validasi data) dijalankan paling sering; test yang mahal (evaluasi penuh) di gate penting. Seperti asuransi berlapis — bukan satu test raksasa.",
        "Lab: validasi satu batch 500 pengajuan. Ditemukan: 2 usia di luar range, 1 gaji negatif, missing 0,2%. Verdict: GAGAL — batch ditolak sebelum menyentuh model.",
        "Biaya bug per lapisan — alasan ekonomi piramida. Bug tertangkap di unit test: 10 menit dev = Rp25.000. Di integration: 2 jam = Rp300.000. Di shadow: 1 hari analisis = Rp1,2 juta. Di produksi (kasus SehatQ): Rp187 juta. Rasio 1 : 12 : 48 : 7.480. Setiap lapisan yang dilewati = pengali 10–150×. “Nanti saja diuji di produksi” = memilih pengali termahal. Piramida testing = bukan best practice abstrak, melainkan ARITMETIKA.",
        "Cara membaca: sumbu vertikal = lapisan deteksi (atas = paling awal); panjang batang = biaya rata-rata satu bug yang tertangkap di lapisan itu; angka di kanan batang = nominalnya. Perhatikan: skala batang disederhanakan (tidak linear penuh) agar yang kecil tetap terlihat — angka aslinya jauh lebih ekstrem.",
        "Interpretasi: dari Rp25 ribu ke Rp187 juta = pengali 7.480×. Batang “produksi” 8× lebih panjang dari “shadow” — dan itulah insiden SehatQ. Setiap lapisan testing yang kamu lewati = memilih pengali yang lebih mahal. Investasi testing = membeli hak untuk membayar Rp25 ribu, bukan Rp187 juta.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Biaya rata-rata satu bug per lapisan deteksi">
<text x="240" y="20" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Biaya rata-rata satu bug per lapisan deteksi</text>
<text x="142" y="64" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Unit test</text>
<rect x="150" y="52" width="36" height="22" fill="var(--c1)" rx="4"/>
<text x="194" y="68" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rp25 rb</text>
<text x="142" y="108" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Integration test</text>
<rect x="150" y="96" width="96" height="22" fill="var(--c1)" rx="4"/>
<text x="254" y="112" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rp300 rb</text>
<text x="142" y="152" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Shadow deploy</text>
<rect x="150" y="140" width="168" height="22" fill="var(--c1)" rx="4"/>
<text x="326" y="156" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rp1,2 jt</text>
<text x="142" y="196" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Produksi (insiden)</text>
<rect x="150" y="184" width="300" height="22" fill="var(--c1)" rx="4"/>
<text x="458" y="200" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rp187 jt</text>
</svg>`,
        alt: "Diagram batang: biaya bug naik dari Rp25 ribu di unit test hingga Rp187 juta di produksi.",
        caption: "Biaya bug naik eksponensial per lapisan yang dilewati — alasan ekonomi piramida testing.",
      },
      tasks: [
        { id: "t1", text: "Hitung `pelanggaran_usia`: usia di luar 17–70" },
        { id: "t2", text: "Hitung `gaji_negatif` dan `missing` (% gaji None)" },
        { id: "t3", text: "Tentukan `lolos` dan cetak semua hasil" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: validasi data adalah test termurah dengan ROI tertinggi",
        body: "Satu fungsi 20 baris yang menolak batch anomali mencegah insiden Rp4,7 miliar seperti di MLE6. Tidak ada test lain yang semurah ini dengan dampak sebesar ini.",
      },
      hints: [
        "pelanggaran = sum(1 for u in usia if not (17 <= u <= 70)).",
        "gaji None = missing; gaji < 0 (dan bukan None) = negatif.",
        "lolos = pelanggaran_usia==0 and gaji_negatif==0 and missing < 1.0.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(41)
n = 500
usia = [random.randint(17, 70) for _ in range(n)]
tenor = [random.choice([6,12,24,36]) for _ in range(n)]
gaji = [round(random.gauss(8, 3), 1) for _ in range(n)]
usia[10] = -5; usia[20] = 250   # anomali suntikan
gaji[30] = -100; gaji[40] = None
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: data validation
pelanggaran_usia = 
gaji_negatif = 
missing = 
lolos = 

print(f"pelanggaran_usia={pelanggaran_usia}  gaji_negatif={gaji_negatif}  missing={missing:.1f}%  lolos={lolos}")`,
        lockLines: 10,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(41)
n = 500
usia = [random.randint(17, 70) for _ in range(n)]
tenor = [random.choice([6,12,24,36]) for _ in range(n)]
gaji = [round(random.gauss(8, 3), 1) for _ in range(n)]
usia[10] = -5; usia[20] = 250   # anomali suntikan
gaji[30] = -100; gaji[40] = None
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: data validation
pelanggaran_usia = sum(1 for u in usia if not (17 <= u <= 70))
gaji_negatif = sum(1 for g in gaji if g is not None and g < 0)
missing = sum(1 for g in gaji if g is None) / n * 100
lolos = pelanggaran_usia == 0 and gaji_negatif == 0 and missing < 1.0

print(f"pelanggaran_usia={pelanggaran_usia}  gaji_negatif={gaji_negatif}  missing={missing:.1f}%  lolos={lolos}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`pelanggaran_usia` = 2",
            "name": "pelanggaran_usia",
            "value": 2,
            "tol": 1e-09,
            "msg": "Dua anomali suntikan: -5 dan 250.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`gaji_negatif` = 1",
            "name": "gaji_negatif",
            "value": 3,
            "tol": 1e-09,
            "msg": "Satu gaji -100 (None tidak dihitung negatif).",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis GAGAL",
            "pattern": "lolos=False",
            "msg": "Ada pelanggaran → batch ditolak.",
          },
        ],
      },
      reference: "None menandai missing. Validasi selalu sebelum model melihat data.",
    },
    {
      id: "invariant",
      eyebrow: "Langkah 4 · Invariant model",
      title: "Properti yang harus selalu benar",
      prose: [
        "Invariant adalah janji perilaku: 'untuk input X yang lebih besar, output tidak boleh lebih kecil'. Contoh: skor kredit HARUS monoton naik terhadap penghasilan (ceteris paribus). Jika tidak, ada yang salah — entah bug fitur atau model belajar pola aneh.",
        "Metamorphic testing: hubungan antar output. 'Naikkan penghasilan 10% → skor tidak turun.' 'Duplikat data dengan nama berbeda → prediksi sama' (fairness check sederhana). Tidak butuh label — hanya butuh akal sehat domain.",
        "Lab: model skor dengan bug tersembunyi — di segmen penghasilan Rp40–50 juta, skor ANJLOK 25 poin karena salah skala fitur. Test monotonisitas menangkap 1 pelanggaran tepat di perbatasan segmen. Tanpa test ini, bug hanya ketahuan dari komplain nasabah.",
        "Kunci: invariant ditulis oleh DOMAIN EXPERT, bukan oleh programmer model. Hanya orang yang paham bisnis yang tahu 'seharusnya' seperti apa.",
        "Katalog invariant untuk credit scoring — contoh siap pakai. (1) Monotonisitas: penghasilan ↑ → skor tidak turun. (2) Batas: 300 ≤ skor ≤ 850, selalu. (3) Stabilitas: input identik → output identik (determinisme). (4) Non-negativitas: premi ≥ 0 (kasus SehatQ!). (5) Konsistensi: duplikat dengan nama berbeda → prediksi sama. Lima baris assert = Rp187 juta. Tulis invariant SEBELUM model — ia adalah spesifikasi perilaku yang bisa dieksekusi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pelanggaran`: pasangan berurutan dengan skor turun" },
        { id: "t2", text: "Tentukan `verdict`: 'GAGAL' jika ada pelanggaran" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'model sudah divalidasi metriknya, tidak perlu test perilaku'",
        type: "pitfall",
        body: "Yang benar: metrik agregat (AUC 0,85) bisa menyembunyikan perilaku absurd di segmen kecil. Invariant menangkap 'model yang benar secara statistik tetapi salah secara akal sehat'.",
      },
      hints: [
        "penghasilan = list(range(10, 81, 5)) — sudah terurut naik.",
        "Bandingkan skor(b) < skor(a) untuk pasangan berurutan.",
        "zip(penghasilan, penghasilan[1:]) untuk pasangan.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
def skor(penghasilan_jt):
    s = 30 + penghasilan_jt * 1.5
    if 40 <= penghasilan_jt <= 50:  # BUG: salah skala fitur di segmen ini
        s = s - 25
    return s
penghasilan = list(range(10, 81, 5))
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: test monotonisitas
pelanggaran = 
verdict = 

print(f"pelanggaran_monotonik={pelanggaran}  verdict={verdict}")`,
        lockLines: 7,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
def skor(penghasilan_jt):
    s = 30 + penghasilan_jt * 1.5
    if 40 <= penghasilan_jt <= 50:  # BUG: salah skala fitur di segmen ini
        s = s - 25
    return s
penghasilan = list(range(10, 81, 5))
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: test monotonisitas
pelanggaran = sum(1 for a, b in zip(penghasilan, penghasilan[1:]) if skor(b) < skor(a))
verdict = "GAGAL" if pelanggaran > 0 else "LOLOS"

print(f"pelanggaran_monotonik={pelanggaran}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`pelanggaran` = 1",
            "name": "pelanggaran",
            "value": 1,
            "tol": 1e-09,
            "msg": "Skor turun di transisi 35→40 juta (bug segmen).",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis GAGAL",
            "pattern": "verdict=GAGAL",
            "msg": "1 pelanggaran → verdict GAGAL.",
          },
        ],
      },
      reference: "Invariant = properti domain yang selalu benar. Tulis sebelum model selesai.",
    },
    {
      id: "produksi",
      eyebrow: "Langkah 5 · Test di produksi",
      title: "Shadow dan canary: test dengan dunia nyata",
      prose: [
        "Test offline tidak pernah mencakup 100% realitas produksi. Dua teknik menutup celah: shadow deployment (model baru menerima salinan traffic, hasilnya dicatat tetapi tidak dipakai) dan canary (5% traffic nyata ke model baru, metrik dibandingkan).",
        "Yang diuji di produksi bukan akurasi — melainkan: latency p99, error rate, distribusi output, dan biaya. Model yang 'lebih akurat' tetapi 3x lebih lambat akan ketahuan di sini, bukan di notebook.",
        "Golden rule rilis: tidak ada model yang langsung 100% traffic. Bertahap: shadow → canary 5% → 25% → 100%, dengan kriteria promosi eksplisit di tiap tahap. Rollback harus satu tombol, bukan satu sprint.",
        "Canary yang benar — angka. 5% traffic ke model baru selama 1 jam, bandingkan: error rate, p99 latency, distribusi output (PSI vs champion), dan metrik bisnis (konversi). Kriteria promosi TERTULIS sebelum canary: “error rate ≤ champion + 0,1%, p99 ≤ +10%”. Tanpa kriteria tertulis, canary = “lihat-lihat dulu” = keputusan berdasarkan perasaan. Canary tanpa kriteria = teater keamanan jilid 2.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: produksi adalah test terakhir yang tidak bisa dipalsukan",
        body: "Data produksi selalu mengandung kejutan yang tidak ada di data historis. Perlakukan setiap rilis sebagai eksperimen — dengan hipotesis, metrik, dan kriteria berhenti yang jelas.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Test apa untuk risiko apa",
      prose: [
        "Skenario 1 — Model rekomendasi konten (risiko rendah) → validasi data dasar + quality gate metrik. Alasan: kesalahan = rekomendasi kurang relevan, bukan kerugian finansial.",
        "Skenario 2 — Credit scoring (risiko finansial + regulasi) → semua lapisan: validasi data ketat, invariant monotonisitas, metamorphic, quality gate, shadow wajib. Alasan: satu bug = miliaran rupiah + temuan audit.",
        "Skenario 3 — Fraud real-time (risiko + latency) → ditambah load test dan chaos test (matikan satu worker — apakah sistem bertahan?). Alasan: fraud tidak menunggu sistem pulih.",
        "Skenario 4 — Model eksperimental internal → validasi data + smoke test. Alasan: jangan over-engineer test untuk model yang mungkin mati minggu depan; tetapi validasi data tetap wajib (murah).",
        "Aturan praktis 10 detik: kalikan probabilitas bug × biaya kegagalan. Hasil besar → test berlapis. Hasil kecil → validasi data + smoke test cukup.",
        "Skenario 3 — model pricing asuransi (kasus SehatQ, risiko TINGGI) → SEMUA lapisan + LARANGAN deploy Jumat + invariant di SERVING (runtime assert, bukan hanya CI). Alasan: runtime assert menangkap apa yang lolos CI — ia adalah jaring terakhir sebelum uang bergerak. Biaya: 1ms latency. Manfaat: Rp187 juta. Jaring terakhir = yang paling murah per rupiah yang dilindungi.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Asuransi SehatQ: premi Rp0 untuk semua polis",
      prose: [
        "Model pricing asuransi SehatQ lolos semua unit test dan deploy Jumat sore. Senin pagi: 312 polis terjual dengan premi Rp0. Kerugian langsung Rp187 juta sebelum sistem dimatikan.",
        "Root cause: kolom `usia` tertukar dengan `kode_pos` di pipeline (keduanya integer). Model menerima kode pos 10110 sebagai 'usia', feature engineering me-cap di 100, dan formula premi menghasilkan 0 untuk 'usia' ekstrem. Tidak ada test yang memeriksa 'apakah premi dalam range wajar?'",
        "Pertanyaan: (a) Lapisan test mana yang seharusnya menangkap ini? (b) Tulis invariant-nya dalam satu kalimat. (c) Kenapa unit test tidak menangkapnya?",
        "Pembahasan: (a) Data validation (range usia 0–120 akan menolak 10110) DAN invariant model ('premi per polis ∈ [Rp50rb, Rp50jt]'). Dua lapisan, dua-duanya absen. (b) 'Premi yang dihasilkan model harus dalam [batas_bawah, batas_atas] yang ditentukan aktuaria.' (c) Unit test menguji fungsi dengan input BENAR; bug ini adalah input SALAH yang lolos — ranah validasi data dan invariant, bukan unit test.",
        "Mengapa SEMUA test lolos tetapi premi Rp0? Karena test menguji KODE (“apakah berjalan?”), bukan PERILAKU (“apakah masuk akal?”). Unit test: fungsi premi(usia=10110) berjalan tanpa error ✓ (tidak ada yang bilang usia 10110 itu tidak masuk akal!). Integration test: pipeline selesai ✓. Yang hilang: VALIDASI DATA (usia ≤ 100?) + INVARIANT (premi ≥ 0?). Dua baris yang tidak ditulis = Rp187 juta. Pelajaran: test yang tidak memeriksa MAKNA = teater keamanan.",
        "Perbaikan sistemik — bukan sekadar “perbaiki kolom”. (1) Schema test: usia 17–100, tolak di luar itu. (2) Invariant: premi ≥ 0, assert di serving (bukan hanya di test!). (3) Distribusi monitor: rata-rata usia tiba-tiba 5000 = alarm. (4) Deploy Jumat sore DILARANG (aturan tim: tidak ada deploy berisiko sebelum libur). Empat lapis — karena bug ini punya 4 pintu masuk. Satu pintu ditutup = 3 masih terbuka.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi: testing ML = testing SOFTWARE + testing DATA + testing PERILAKU. Tiga dimensi, tidak bisa saling menggantikan. Unit test tidak menangkap distribusi bergeser; validasi data tidak menangkap logika premi yang salah; invariant tidak menangkap latency. Piramida yang lengkap = ketiganya. Dan satu prinsip: test yang tidak pernah GAGAL = test yang tidak menguji apa-apa — chaos engineering kecil (tukar 2 kolom di staging) memverifikasi jaringmu benar-benar ada.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "CI hijau, tetapi model memprediksi 0 untuk semua. Pelajaran utama?",
          options: [
            {
              text: "Tambah lebih banyak unit test",
              why: "Unit test sudah 120 dan hijau — masalahnya bukan jumlah, melainkan jenis test.",
            },
            {
              text: "Test harus mencakup data dan perilaku model, bukan cuma kode",
              why: "Tepat: silent failure hanya tertangkap validasi data + invariant output.",
              correct: true,
            },
            {
              text: "Jangan deploy Jumat sore",
              why: "Waktu deploy (Jumat vs Senin) bukan akar masalahnya — akarnya adalah TIDAK ADA test yang memeriksa makna output. Deploy Senin dengan test yang sama = insiden Senin. Perbaiki yang ditest, bukan harinya (meski aturan “no Friday deploy” tetap bijak sebagai pengaman tambahan).",
            },
            {
              text: "Modelnya terlalu sederhana",
              why: "Kompleksitas model tidak relevan dengan bug pipeline.",
            },
          ],
        },
        {
          q: "Batch 500 pengajuan: 2 usia invalid, 1 gaji negatif. Keputusan?",
          options: [
            {
              text: "Loloskan, cuma 3 dari 500",
              why: "3 anomali bisa jadi gejala bug sistemik; validasi ada untuk ditaati.",
            },
            {
              text: "Tolak batch, investigasi sumber anomali",
              why: "Tepat: quality gate data melindungi semua tahap berikutnya.",
              correct: true,
            },
            {
              text: "Hapus 3 baris diam-diam",
              why: "Menghapus tanpa investigasi menyembunyikan kemungkinan bug pipeline.",
            },
            {
              text: "Naikkan ambang toleransi",
              why: "Mengubah ambang agar lolos = menonaktifkan pengaman.",
            },
          ],
        },
        {
          q: "Skor kredit turun saat penghasilan naik (ceteris paribus). Ini melanggar…",
          options: [
            {
              text: "Unit test",
              why: "Unit test menguji fungsi, bukan properti domain.",
            },
            {
              text: "Invariant monotonisitas",
              why: "Tepat: properti domain yang harus selalu benar.",
              correct: true,
            },
            {
              text: "Akurasi",
              why: "Akurasi agregat bisa tetap tinggi meski invariant dilanggar di segmen kecil.",
            },
            {
              text: "Latency SLO",
              why: "Tidak berhubungan dengan kecepatan eksekusi — yang diuji adalah KEBENARAN perilaku (invariant), bukan throughput. Model yang cepat tetapi memprediksi 0 untuk semua = cepat menuju bencana. Pisahkan concern: kecepatan diuji di load test, kebenaran di invariant test.",
            },
          ],
        },
        {
          q: "Fungsi shadow deployment yang paling tepat?",
          options: [
            {
              text: "Menggandakan throughput",
              why: "Shadow menambah beban, bukan throughput untuk pengguna.",
            },
            {
              text: "Validasi model baru dengan traffic produksi tanpa risiko pengguna",
              why: "Tepat: shadow deployment memakai DATA PRODUKSI NYATA (bukan sintetis) sehingga perilakunya realistis, tetapi hasilnya TIDAK DIPAKAI untuk keputusan — dampak nol jika modelnya buruk. Kombinasi “realistis + aman” inilah yang membuatnya jaring pengaman ideal sebelum canary.",
              correct: true,
            },
            {
              text: "Backup database",
              why: "Tidak berhubungan dengan pertanyaan: opsi ini membahas topik lain. Kembali ke inti — untuk setiap skenario, tanya: lapisan test apa yang menangkap bug ini PALING MURAH? Jawab itu, bukan yang lain.",
            },
            {
              text: "Mengurangi biaya training",
              why: "Benar — shadow = biaya serving tambahan (2× compute selama periode shadow). Tetapi bandingkan: 2× compute 1 pekan (Rp jutaan) vs insiden Rp187 juta. Shadow = premi asuransi termurah untuk model berisiko tinggi. Untuk model risiko rendah, skip — premi harus proporsional.",
            },
          ],
        },
        {
          q: "Premi Rp0 untuk 312 polis lolos semua test. Test apa yang paling murah untuk mencegahnya?",
          options: [
            {
              text: "Load test 1 juta request",
              why: "Mahal dan tidak menangkap logika premi yang salah.",
            },
            {
              text: "Invariant range: premi ∈ [batas aktuaria]",
              why: "Tepat: satu baris check menolak output absurd sebelum merugikan.",
              correct: true,
            },
            {
              text: "Test warna UI",
              why: "Tidak relevan dengan keputusan testing: opsi ini tidak mengidentifikasi lapisan pengaman mana pun. Setiap jawaban yang baik menyebut lapisan spesifik (validasi data? invariant? shadow?) dan alasannya. Tanpa itu = tebakan.",
            },
            {
              text: "Review kode manual tiap deploy",
              why: "Tidak scalable dan tidak menangkap data tertukar.",
            },
          ],
        },
      ],
      summary: [
        "Kegagalan termahal ML adalah silent failure — kode jalan, hasil salah.",
        "Tiga lapisan: validasi data, test pipeline, invariant + quality gate model.",
        "Validasi data (skema, range, missing) = test termurah ROI tertinggi.",
        "Invariant ditulis domain expert: properti yang HARUS selalu benar.",
        "Shadow/canary menguji dengan realitas produksi sebelum 100% traffic.",
        "Tingkat testing mengikuti risiko: biaya kegagalan × probabilitas bug.",
      ],
      next: { label: "MLE8 — Versioning: Data, Model, Code", href: "/v2/learn/mle8-versioning" },
    },
  ],
};
