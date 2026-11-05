import type { V2Lesson } from "../lib/types";

// Ilustrasi: biaya per 1.000 tugas agen (durasi rata-rata 40 menit) di tiga pola deployment.
const BIAYA_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Biaya per 1.000 tugas: function Rp6 juta dengan 0 tugas selesai, container always-on Rp36 juta, worker autoscale Rp26 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="4" x2="456" y2="4"/><line x1="56" y1="54" x2="456" y2="54"/><line x1="56" y1="104" x2="456" y2="104"/><line x1="56" y1="154" x2="456" y2="154"/><line x1="56" y1="200" x2="456" y2="200"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="8">40 jt</text><text x="50" y="58">30 jt</text><text x="50" y="108">20 jt</text><text x="50" y="158">10 jt</text><text x="50" y="204">0</text></g>
<text x="20" y="110" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 20 110)">Rp / 1.000 tugas</text>
<rect x="80" y="170" width="80" height="30" fill="var(--c4)"/><text x="120" y="162" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Rp6 jt</text><text x="120" y="222" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Function</text><text x="120" y="236" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="middle">0 tugas selesai!</text>
<rect x="200" y="20" width="80" height="180" fill="var(--c1)"/><text x="240" y="12" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Rp36 jt</text><text x="240" y="222" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Container 24/7</text>
<rect x="320" y="70" width="80" height="130" fill="var(--c2)"/><text x="360" y="62" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Rp26 jt</text><text x="360" y="222" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Worker autoscale</text>
</svg>`;

export const aai19: V2Lesson = {
  slug: "aai19-cloud-deployment-agen",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI19 — Cloud Deployment Agen: Dari Laptop ke Produksi",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Agen yang brilian di laptop bisa mati konyol di cloud — bukan karena logikanya salah, melainkan karena “rumah” barunya tidak cocok dengan kebiasaannya. Lesson ini tentang memilih rumah yang tepat: anatomi deployment agen, pilihan platform, jebakan cold start dan timeout, serta observability.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menguraikan empat komponen deployment agen (runtime, state eksternal, secrets, antrean) dan menjelaskan kenapa state tidak boleh tinggal di memori proses; (2) memilih antara serverless function, container service, dan worker autoscale berdasarkan durasi dan pola beban tugas; (3) menjelaskan cold start dan timeout serta kenapa retry tidak memperbaiki ketidakcocokan platform; (4) menghitung biaya deployment dari durasi tugas, tarif, dan pola retry dengan rumus yang tepat; (5) merancang observability minimum: log terstruktur, trace per run, dan alert biaya.",
        "Daftar isi: 1) Peta · 2) Cerita: agen 45 menit yang dibunuh di menit ke-15 · 3) Anatomi deployment agen · 4) Memilih platform: function vs container vs worker · 5) Cold start, timeout, dan retry yang sia-sia · 6) Lab: simulasi antrean dengan timeout · 7) Observability: melihat agen yang tidak terlihat · 8) Peta keputusan · 9) Mini-case · 10) Checkpoint.",
        "Bekal ringkas (self-contained): kamu tahu agen bekerja dalam loop dan setiap putaran memakan token (biaya). Di lesson ini satu putaran loop bisa berarti satu TUGAS yang berjalan 45 menit — dan platform cloud punya pendapat sendiri tentang berapa lama sebuah “panggilan” boleh hidup. Tidak ada prasyarat lain.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Agen 45 menit yang dibunuh di menit ke-15",
      prose: [
        "RuangKerja, startup HR di Jakarta, membangun agen riset kandidat: diberi nama dan peran, agen itu menjelajah web, membaca puluhan profil, lalu menyusun laporan perbandingan. Di laptop developer, satu tugas tuntas dalam 45 menit dengan hasil yang mengesankan. Manajemen memberi lampu hijau: “Deploy ke cloud, kita butuh 200 laporan per hari.”",
        "Tim memilih serverless function — murah, tanpa server, “bayar hanya saat jalan”. Tugas pertama di cloud: mati di menit ke-15. Tugas kedua: mati di menit ke-15. Kedua ratus tugas hari itu: semuanya mati di menit ke-15, masing-masing ditagih penuh. Platformnya punya batas: tidak ada eksekusi boleh hidup lebih dari 15 menit. Agen yang butuh 45 menit tidak pernah punya kesempatan.",
        "Twist-nya: tim lalu mengaktifkan “retry otomatis” — dan tagihan menjadi dua kali lipat untuk hasil yang sama: nol. Retry mengulang tugas yang sama ke platform yang sama dengan batas yang sama. Kegagalannya bukan transient (gangguan sesaat) melainkan STRUKTURAL: workload long-running dipaksa tinggal di rumah yang hanya menerima tamu 15 menit.",
        "Perbaikannya bukan di kode agen — satu baris pun tidak diubah. Mereka memindahkan agen ke worker dengan antrean: tugas masuk antrean, worker menarik satu per satu, berjalan sampai selesai tanpa batas 15 menit. 200 laporan selesai dalam semalam. Pelajarannya: sebelum mengoptimalkan agen, pastikan dulu platformnya tidak sedang membunuhnya.",
        "Dua pola yang akan kamu kenali di lesson ini. Pola 1: batas platform (timeout, memori, durasi) yang tidak cocok dengan karakteristik tugas agen. Pola 2: retry yang mengobati gejala — membayar dua kali untuk kegagalan yang pasti terulang. Keduanya punya akar yang sama: memilih rumah sebelum mengukur penghuninya.",
      ],
      note: {
        title: "💡 Intuisi: agen itu penyewa jangka panjang, bukan tamu hotel",
        body: "Serverless function dirancang untuk tamu hotel: datang sebentar, pergi cepat, bayar per malam. Agen dengan tugas 45 menit adalah penyewa kontrakan: butuh tempat tinggal yang tidak mengusirnya di tengah malam. Memaksa penyewa tinggal di hotel bukan mustahil — hanya saja setiap malam ia diusir (timeout) dan kamu tetap membayar kamarnya (tagihan penuh). Pilih kontrak sesuai durasi tinggal.",
      },
      tasks: [],
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi deployment agen: empat komponen yang tidak boleh hilang",
      prose: [
        "Deployment agen yang sehat terdiri dari empat komponen — hilangkan satu, dan kamu membangun RuangKerja jilid dua. Pertama, RUNTIME: tempat kode agen dieksekusi (container, function, VM). Runtime itu fana — ia bisa mati, restart, dan diganti kapan saja tanpa pemberitahuan.",
        "Kedua, STATE EKSTERNAL: riwayat percakapan, checkpoint langkah, dan hasil antara WAJIB tinggal di luar runtime — di database, object storage, atau antrean. Agen yang menyimpan “sudah sampai langkah berapa” di memori proses akan lupa segalanya saat container restart, lalu mengulang dari nol (dan menagih token dua kali). Aturannya: proses boleh mati, ingatan tidak boleh.",
        "Ketiga, SECRETS: API key model, kredensial database, token pihak ketiga. Secrets tinggal di layanan khusus (secret manager / environment terenkripsi), BUKAN di kode, BUKAN di image Docker, dan BUKAN di log. Satu API key yang bocor di image publik = tagihan LLM orang lain atas namamu.",
        "Keempat, ANTREAN PEKERJAAN: untuk tugas yang lebih lama dari beberapa menit, jangan panggil agen langsung — masukkan tugas ke antrean, biarkan worker menarik dan mengeksekusinya. Antrean memberi tiga hal gratis: ketahanan (tugas tidak hilang saat worker mati), keterlihatan (kamu bisa melihat 47 tugas menunggu), dan kendali laju (tidak menyerbu API sekaligus lalu kena rate limit).",
        "Kepribadiannya: deployment agen seperti katering untuk 200 tamu. Runtime adalah dapur sewaan (bisa pindah), state eksternal adalah buku resep (tidak boleh ikut terbakar kalau dapur tutup), secrets adalah kunci brankas (tidak ditempel di pintu), dan antrean adalah daftar pesanan (tanpa daftar, koki memasak berdasarkan teriakan). Dapur boleh berganti — resep, kunci, dan daftar pesanan harus abadi.",
        "Kapan tiap komponen menjadi kritis: state eksternal wajib sejak tugas > 5 menit atau multi-langkah; antrean wajib sejak volume > puluhan tugas per hari atau ada risiko rate limit; secret manager wajib sejak ada lebih dari satu environment (dev/staging/prod).",
      ],
      note: {
        title: "Miskonsepsi: “Agenku stateful karena kodenya menyimpan variabel”",
        type: "pitfall",
        body: "Yang benar: variabel di memori proses = ingatan yang hilang saat restart. Stateful yang sesungguhnya berarti state tersimpan di tempat yang bertahan melewati kematian proses: database untuk checkpoint, object storage untuk artefak, antrean untuk tugas tertunda. Uji dengan pertanyaan kejam: “kalau saya matikan container-nya sekarang juga, apa yang hilang?” Jawaban yang benar: tidak ada — hanya waktu yang sudah berjalan.",
      },
      tasks: [],
      reference: "Empat komponen: runtime (fana) + state eksternal (abadi) + secrets (terpisah) + antrean (untuk tugas panjang).",
    },
    {
      id: "platform",
      eyebrow: "Langkah 4 · Konsep",
      title: "Memilih platform: function, container, atau worker autoscale",
      prose: [
        "Tiga pola deployment, tiga kepribadian. SERVERLESS FUNCTION (Lambda, Cloud Functions): kamu kirim kode, provider menjalankan per kejadian, bayar per milidetik jalan. Kuat untuk tugas pendek (< 5 menit) dan sporadis. Lemah untuk agen: timeout keras (biasanya 15 menit), cold start, dan tidak ada proses yang “menunggu” antar panggilan.",
        "CONTAINER ALWAYS-ON (Cloud Run, Fargate, App Runner): kontainermu hidup terus, menerima request kapan saja. Kuat untuk layanan yang selalu siaga dan tugas menengah. Lemah: kamu membayar jam idle — kontainer yang menunggu tugas tetap menagih. Cocok bila beban merata sepanjang hari.",
        "WORKER AUTOSCALE + ANTREAN: worker ditarik naik saat antrean penuh, diturunkan saat sepi. Kuat untuk tugas panjang dan beban tidak merata (siang ramai, malam sepi) — bayar nyaris hanya untuk kerja nyata. Lemah: butuh antrean dan sedikit rekayasa lebih banyak di awal.",
        "Cara membaca bagan: tiga batang = biaya per 1.000 tugas agen berdurasi rata-rata 40 menit. “Function” hanya Rp6 juta — TETAPI dengan label merah: 0 tugas selesai, karena semua tugas melebihi timeout 15 menit (masing-masing ditagih 2×15 menit akibat retry). “Container 24/7” Rp36 juta: semua selesai, tetapi membayar jam sepi. “Worker autoscale” Rp26 juta: semua selesai, bayar nyaris hanya saat bekerja. Interpretasi: harga termurah yang tidak menyelesaikan tugas = harga termahal.",
        "Kapan memakai apa: function untuk webhook ringan dan tugas < 5 menit; container always-on untuk API agen yang harus siaga 24/7 dengan beban merata; worker autoscale untuk tugas agen yang panjang (> 15 menit) atau beban berfluktuasi. Aturan praktis: ukur dulu distribusi durasi tugasmu (rata-rata DAN p95) sebelum memilih — RuangKerja gagal karena tidak pernah mengukur 45 menit itu.",
      ],
      figure: {
        svg: BIAYA_SVG,
        alt: "Biaya per 1.000 tugas: function Rp6 juta dengan 0 tugas selesai, container always-on Rp36 juta, worker autoscale Rp26 juta.",
        caption: "Cara membaca: tinggi batang = total biaya 1.000 tugas; label merah = peringatan. Interpretasi: function termurah per menit tetapi tidak menyelesaikan satu pun tugas 40 menit — biaya termurah untuk hasil nol adalah pemborosan termahal.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: “Serverless selalu paling murah karena bayar per pakai”",
        type: "pitfall",
        body: "Yang benar: serverless murah per MILIDETIK, tetapi agen yang gagal karena timeout membayar milidetik untuk hasil nol — lalu retry membayarnya lagi. “Bayar per pakai” hanya murah bila pakainya BERHASIL. Untuk tugas 40 menit di platform timeout-15-menit, serverless bukan hemat — ia adalah mesin pembakar uang tercepat.",
      },
      reference: "Ukur durasi tugas (rata-rata + p95) dulu, baru pilih platform. Timeout platform harus > durasi p95 tugasmu.",
    },
    {
      id: "cold-start",
      eyebrow: "Langkah 5 · Konsep",
      title: "Cold start, timeout, dan retry yang sia-sia",
      prose: [
        "COLD START: saat tidak ada instance yang hidup, platform harus menyalakan runtime baru — menarik image, memuat model, membuka koneksi — sebelum tugasmu mulai. Untuk agen yang memuat dependensi berat, cold start bisa 10–60 detik. Ia bukan bug; ia harga dari “scale to zero”. Mitigasinya: minimum instance hangat (bayar siaga), atau terima untuk tugas yang tidak sensitif latensi.",
        "TIMEOUT: pemutus paksa — platform membunuh eksekusi yang melewati batas, apapun kondisinya. Timeout ada di BANYAK lapisan: function (15 menit), load balancer (60 detik), client HTTP (30 detik), database statement. Kegagalan RuangKerja adalah timeout di lapisan function; tetapi timeout di lapisan client sama mematikannya (lihat AAI20).",
        "RETRY: mengulang tugas yang gagal. Retry adalah obat mujarab untuk kegagalan TRANSIENT — rate limit sesaat, jaringan tersendat, 503 satu kali. Retry adalah racun untuk kegagalan STRUKTURAL — timeout platform, bug logika, kuota habis: ia mengulang kepastian gagal dan menagih setiap pengulangan. Sebelum mengaktifkan retry, tanyakan: “apakah pengulangan ini punya peluang berhasil yang berbeda dari percobaan pertama?”",
        "Rumus biaya tugas dengan timeout dan retry:",
        "Contoh dari lab langkah 6: tugas J2 berdurasi 22 menit di platform timeout 15 menit, tarif Rp150/menit, 1× retry. Tiap percobaan membayar min(22, 15) = 15 menit → Rp2.250; dua percobaan → Rp4.500 untuk NOL hasil. Tugas J1 (8 menit) membayar 8 × 150 = Rp1.200 dan selesai. Rumus ini kejam tapi jujur: ia menunjukkan persis di mana uangmu terbakar.",
        "Kepribadiannya: timeout seperti penjaga kos yang mengunci pintu jam 10 malam. Tamu yang pulang jam 9 aman; tamu yang pulang jam 11 terkunci di luar — dan retry seperti menyuruhnya pulang jam 11 lagi besok, berharap pintunya ajaib terbuka. Solusinya bukan mengulang, melainkan pindah kos (platform) atau pulang lebih awal (pecah tugas).",
      ],
      formula: String.raw`C_{total} = \sum_{i=1}^{N} \min(d_i, T) \cdot c \cdot (1 + r_i)`,
      formulaNote: "C_total = total biaya semua tugas (Rp). d_i = durasi tugas ke-i (menit); T = timeout platform (menit) — percobaan yang melebihi T hanya ditagih T menit lalu dibunuh; c = tarif per menit jalan; r_i = jumlah retry tugas ke-i (0 bila sukses sekali jalan, 1 bila gagal lalu diulang). Contoh: J2: min(22,15) × 150 × 2 = Rp4.500, hasil: gagal.",
      tasks: [],
      note: {
        title: "Miskonsepsi: “Retry = ketahanan, makin banyak makin aman”",
        type: "pitfall",
        body: "Yang benar: retry hanya menyembuhkan kegagalan transient. Untuk timeout struktural, tiap retry = membayar penuh untuk kegagalan yang dijamin. Ketahanan yang benar berlapis: (1) pilih platform yang timeout-nya > durasi p95; (2) pecah tugas panjang menjadi checkpoint yang bisa dilanjut; (3) retry hanya untuk error yang ditandai retryable (429/503/timeout baca), dengan backoff dan batas.",
      },
      reference: "Retry untuk transient, bukan untuk struktural. Timeout platform harus lebih besar dari durasi p95 tugas.",
    },
    {
      id: "lab-antrean",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: simulasi antrean tugas dengan timeout",
      prose: [
        "Kamu menjadi platformnya: 4 tugas agen dengan durasi berbeda, timeout 15 menit, tarif Rp150/menit, dan 1× retry otomatis. Tugas yang durasinya ≤ timeout selesai dalam satu percobaan; yang lebih lama gagal, diulang sekali, lalu gagal permanen — dan SETIAP percobaan tetap ditagih.",
        "Tugasmu: tulis loop simulasi yang mengisi `selesai` (list ID), `gagal` (list ID), dan `total_biaya` (integer Rupiah), lalu cetak ringkasannya. Perhatikan: biaya satu percobaan = min(durasi, TIMEOUT) × TARIF, dan percobaan gagal tetap membayar penuh.",
        "Coba eksplorasi setelah selesai: ubah TIMEOUT menjadi 60. Berapa tugas yang kini selesai, dan berapa total biayanya? Bandingkan dengan biaya “platform yang cocok”. Eksperimen kedua: naikkan MAKS_RETRY menjadi 3 dengan TIMEOUT tetap 15 — apakah ada tugas tambahan yang selesai? (Seharusnya tidak — dan biayanya naik. Inilah bukti retry tidak memperbaiki ketidakcocokan struktural.)",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan tiap job: percobaan membayar min(durasi, TIMEOUT) × TARIF; sukses bila durasi ≤ TIMEOUT" },
        { id: "t2", text: "Isi `selesai`, `gagal`, `total_biaya`, lalu cetak ringkasan sesuai format" },
      ],
      expected: "selesai=2 gagal=2 biaya=Rp12000",
      note: {
        title: "Kaitan ke produksi",
        type: "risk",
        body: "Di produksi, simulasi ini menjadi dasar capacity planning: ganti angka contoh dengan distribusi durasi tugas NYATAmu (rata-rata + p95 dari log), lalu bandingkan total biaya antar platform SEBELUM menandatangani apa pun. Keputusan deployment yang diambil dari “rasanya murah” hampir selalu kalah dari yang dihitung.",
      },
      hints: [
        "Satu job = (1 + MAKS_RETRY) percobaan; berhenti lebih awal (break) begitu sukses.",
        "Gunakan min(dur, TIMEOUT) untuk biaya tiap percobaan — percobaan yang sukses membayar durasi penuh.",
        "total_biaya adalah integer: semua angka di lab ini bulat, tidak perlu pembulatan.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====
jobs = [("J1", 8), ("J2", 22), ("J3", 45), ("J4", 12)]  # (id, durasi_menit)
TIMEOUT = 15      # menit: platform memutus tugas lebih lama dari ini
TARIF = 150       # Rp per menit jalan
MAKS_RETRY = 1    # coba ulang sekali bila gagal
# TULIS KODEMU di bawah garis ini.
# Untuk tiap job: jalankan sampai min(durasi, TIMEOUT); bila durasi > TIMEOUT
# tandai gagal dan ulangi MAKS_RETRY kali (setiap percobaan membayar
# min(durasi, TIMEOUT) * TARIF). Isi: selesai (list id), gagal (list id),
# total_biaya (int). Cetak: selesai=X gagal=Y biaya=RpZ
# =================================`,
        lockLines: 11,
        solution: `# ===== DATA — jangan diubah =====
jobs = [("J1", 8), ("J2", 22), ("J3", 45), ("J4", 12)]  # (id, durasi_menit)
TIMEOUT = 15      # menit: platform memutus tugas lebih lama dari ini
TARIF = 150       # Rp per menit jalan
MAKS_RETRY = 1    # coba ulang sekali bila gagal
# TULIS KODEMU di bawah garis ini.
# Untuk tiap job: jalankan sampai min(durasi, TIMEOUT); bila durasi > TIMEOUT
# tandai gagal dan ulangi MAKS_RETRY kali (setiap percobaan membayar
# min(durasi, TIMEOUT) * TARIF). Isi: selesai (list id), gagal (list id),
# total_biaya (int). Cetak: selesai=X gagal=Y biaya=RpZ
# =================================
selesai, gagal = [], []
total_biaya = 0
for jid, dur in jobs:
    bayar = 0
    ok = False
    for _ in range(1 + MAKS_RETRY):
        bayar += min(dur, TIMEOUT) * TARIF
        if dur <= TIMEOUT:
            ok = True
            break
    total_biaya += bayar
    (selesai if ok else gagal).append(jid)
print(f"selesai={len(selesai)} gagal={len(gagal)} biaya=Rp{total_biaya}")`,
        checks: [
          { kind: "defined", task: "t1", name: "selesai", label: "`selesai` terdefinisi", msg: "Buat list selesai berisi ID tugas yang sukses." },
          { kind: "defined", task: "t1", name: "gagal", label: "`gagal` terdefinisi", msg: "Buat list gagal berisi ID tugas yang gagal permanen." },
          { kind: "equal", task: "t1", name: "selesai", value: ["J1", "J4"], label: "J1 & J4 selesai", msg: "Hanya tugas berdurasi ≤ 15 menit yang selesai: J1 (8) dan J4 (12)." },
          { kind: "equal", task: "t1", name: "gagal", value: ["J2", "J3"], label: "J2 & J3 gagal", msg: "J2 (22) dan J3 (45) melebihi timeout — gagal meski di-retry." },
          { kind: "equal", task: "t2", name: "total_biaya", value: 12000, label: "total biaya Rp12.000", msg: "J1: 8×150=1.200; J2 & J3: masing-masing 2×15×150=4.500; J4: 12×150=1.800. Total 12.000." },
          { kind: "stdout_matches", task: "t2", pattern: "selesai=2 gagal=2 biaya=Rp12000", label: "ringkasan tercetak sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Biaya = Σ min(durasi, timeout) × tarif × percobaan. Percobaan gagal tetap ditagih penuh.",
    },
    {
      id: "observability",
      eyebrow: "Langkah 7 · Konsep",
      title: "Observability: melihat agen yang tidak terlihat",
      prose: [
        "Agen di cloud itu seperti karyawan remote yang tidak pernah ikut standup: kalau kamu tidak merancang cara melihatnya, kamu baru tahu ada masalah saat tagihan datang. Observability minimum untuk deployment agen ada tiga lapis.",
        "Lapis 1 — LOG TERSTRUKTUR: setiap run mencatat JSON satu baris: run_id, tugas, waktu mulai/selesai, jumlah langkah loop, token in/out, dan status akhir. Log prosa bebas (“mulai…”, “selesai…”) tidak bisa diagregasi; log JSON bisa ditanya: “rata-rata durasi tugas minggu ini?”",
        "Lapis 2 — TRACE PER RUN: satu run agen = puluhan panggilan API + eksekusi tool. Trace menghubungkannya dalam satu pohon: run → langkah → panggilan. Saat satu tugas gagal di langkah ke-31, kamu tidak membaca 31 log terpisah — kamu membuka satu trace dan melihat persis di mana ia belok.",
        "Lapis 3 — METRIK & ALERT: tiga angka yang dipantau terus: durasi per tugas (p50/p95 — naiknya p95 tanpa naiknya volume = degradasi), biaya per tugas (token × tarif — naik 20% minggu-ke-minggu = kebocoran konteks), dan tingkat kegagalan per jenis error (lonjakan timeout = platform tidak cocok; lonjakan 429 = butuh antrean laju). Alert yang benar berbunyi SEBELUM tagihan, bukan sesudahnya.",
        "Kepribadiannya: observability seperti CCTV dapur katering. Tanpa CCTV, kamu tahu ada yang salah saat tamu keracunan (tagihan meledak). Dengan CCTV, kamu melihat kokinya menjatuhkan sendok ke kuah di menit ke-12 (langkah ke-31 yang gagal) — dan kamu bisa memperbaiki sebelum 200 porsi berikutnya.",
        "Kapan tiap lapis menjadi wajib: log terstruktur sejak hari pertama (murah, tak ternilai saat insiden); trace sejak agen multi-langkah (> 5 langkah); alert biaya sejak tagihan bulanan melewati angka yang membuatmu tidak nyaman.",
      ],
      note: {
        title: "Miskonsepsi: “Nanti saja observability-nya, yang penting jalan dulu”",
        type: "pitfall",
        body: "Yang benar: agen tanpa observability adalah kotak hitam yang menagih. Insiden pertamamu (dan ia PASTI datang) akan butuh jawaban atas “tugas mana, langkah ke berapa, kenapa” — tanpa log terstruktur dan trace, kamu menebak dalam gelap sambil meteran berjalan. Observability bukan fitur tambahan; ia adalah cara kamu MELIHAT produkmu sendiri.",
      },
      tasks: [],
      reference: "Tiga lapis: log terstruktur (JSON per run) → trace (pohon langkah) → metrik & alert (durasi, biaya, error).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Memilih rumah untuk agenmu",
      prose: [
        "Skenario 1 — Tugas < 5 menit, sporadis (webhook, ringkasan cepat): serverless function. Timeout bukan masalah, cold start bisa diterima, bayar nyaris nol saat sepi.",
        "Skenario 2 — API agen yang harus siaga 24/7, beban merata: container always-on. Bayar jam idle, tetapi tidak ada cold start dan tidak ada timeout 15 menit.",
        "Skenario 3 — Tugas > 15 menit ATAU beban berfluktuasi tajam: worker autoscale + antrean. Satu-satunya pola yang selamat untuk agen long-running seperti RuangKerja.",
        "Skenario 4 — Tugas 5–15 menit dengan lonjakan tak terduga: function dengan timeout dimaksimalkan + antrean di depan + DLQ (dead-letter queue) untuk yang gagal. Jangan biarkan lonjakan langsung menghantam function.",
        "Skenario 5 — Data sensitif / regulasi ketat: VM atau Kubernetes privat di region yang ditentukan, secret manager wajib, log terenkripsi. Kenyamanan serverless tidak sebanding dengan denda kepatuhan.",
        "Aturan praktis 10 detik sebelum memilih platform: (1) Berapa durasi p95 tugasku? → timeout platform harus lebih besar. (2) Di mana state tinggal bila proses mati? → harus di luar runtime. (3) Apa yang terjadi pada retry ke-2? → hanya untuk transient. (4) Berapa biaya 1.000 tugas dihitung, bukan dirasa? → pakai rumus langkah 5. Empat pertanyaan, nol RuangKerja.",
      ],
      tasks: [],
      reference: "p95 durasi < timeout platform; state di luar runtime; retry hanya transient; biaya dihitung.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "PortalKlaim: 500 tugas sehari, tiga penawaran",
      prose: [
        "PortalKlaim memproses klaim asuransi dengan agen pembaca dokumen: 500 tugas per hari (15.000 per bulan), durasi rata-rata 40 menit. Tiga penawaran di meja. (A) Serverless function: Rp200/menit, timeout 15 menit, retry otomatis 1×. (B) 18 container always-on: Rp50.000 per container per jam. (C) Worker autoscale + antrean: Rp650 per menit kerja.",
        "Pertanyaan analisis. (a) Hitung biaya bulanan masing-masing — dan berapa tugas yang SELESAI di opsi A? (b) Hitung utilisasi opsi B. (c) Opsi mana yang kamu pilih, dan apa satu risiko yang tersisa dari pilihanmu?",
        "Pembahasan. (a) Opsi A: semua tugas 40 menit > timeout 15 menit → 0 tugas selesai. Biaya = 15.000 × 2 percobaan × 15 × 200 = Rp90.000.000 untuk NOL hasil. Opsi B: 18 × 720 × 50.000 = Rp648.000.000. Opsi C: 15.000 × 40 × 650 = Rp390.000.000. (b) Kerja total = 15.000 × 40 menit = 600.000 menit = 10.000 jam; kapasitas = 18 × 720 = 12.960 jam; utilisasi = 10.000 / 12.960 ≈ 77%. (c) Pilih C: termurah di antara yang menyelesaikan tugas (Rp390 jt < Rp648 jt), dan otomatis mengikuti fluktuasi. Satu risiko tersisa: antrean menumpuk saat lonjakan — mitigasinya autoscale policy + alert panjang antrean + DLQ.",
        "Pelajaran yang lebih dalam: opsi A terlihat “modern dan murah” tetapi membayar Rp90 juta untuk kegagalan sempurna — bukti bahwa metrik “biaya per menit” tidak berarti tanpa metrik “tugas selesai per rupiah”. Selalu hitung BIAYA PER TUGAS SELESAI, bukan biaya per menit.",
      ],
      tasks: [],
      note: {
        title: "Pelajaran mini-case",
        type: "risk",
        body: "Keputusan deployment yang diambil dari brosur (“serverless itu murah”) kalah dari yang dihitung dengan rumus. Kebiasaan yang menyelamatkan: spreadsheet satu halaman — volume × durasi (rata-rata + p95) × tarif × pola retry — untuk SETIAP opsi, sebelum tanda tangan. Rp90 juta untuk nol hasil selalu dimulai dari “kayaknya murah”.",
      },
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
        "Deployment agen = runtime (fana) + state eksternal (abadi) + secrets (terpisah) + antrean (tugas panjang).",
        "Pilih platform dari durasi p95: function untuk < 5 menit, container untuk siaga merata, worker autoscale untuk tugas panjang/fluktuatif.",
        "Timeout membunuh eksekusi apa pun kondisinya; retry hanya untuk kegagalan transient — bukan struktural.",
        "Biaya = Σ min(durasi, timeout) × tarif × (1 + retry); percobaan gagal tetap ditagih penuh.",
        "Observability tiga lapis: log terstruktur → trace per run → metrik & alert (durasi, biaya, error).",
        "Aturan 10 detik: p95 vs timeout? state di luar runtime? retry untuk transient? biaya per tugas selesai?",
      ],
      next: { label: "AAI20 — Melayani Agen sebagai Service", href: "/learn/aai20-agen-sebagai-service" },
      quiz: [
        {
          q: "Agen RuangKerja mati di menit ke-15 di semua 200 tugas. Akar masalahnya?",
          options: [
            { text: "Kode agennya buggy sehingga crash di menit ke-15", why: "Semua tugas mati di TITIK yang sama — pola seragam menandakan batas platform, bukan bug acak di kode.", correct: false },
            { text: "Timeout platform 15 menit < durasi tugas 45 menit — ketidakcocokan struktural", why: "Tepat — tidak ada kode yang bisa “memperbaiki” batas platform; yang salah adalah pilihan rumahnya.", correct: true },
            { text: "Model LLM-nya terlalu lambat", why: "Di laptop tugas yang sama selesai 45 menit — modelnya sama, yang berbeda hanya platformnya.", correct: false },
            { text: "Kurang instance — perlu scale up", why: "Scale menambah kapasitas paralel, bukan memperpanjang batas durasi satu eksekusi.", correct: false },
          ],
        },
        {
          q: "Container agen restart tengah malam. Apa yang BOLEH hilang?",
          options: [
            { text: "Tidak ada — hanya waktu yang sudah berjalan; state wajib di luar proses", why: "Tepat — checkpoint, riwayat, dan artefak tinggal di database/storage; proses boleh mati.", correct: true },
            { text: "Riwayat percakapan — nanti juga dibangun ulang", why: "Membangun ulang = mengulang token yang sudah dibayar; state adalah uang yang sudah dikeluarkan.", correct: false },
            { text: "API key — nanti diminta lagi ke developer", why: "API key tidak boleh hilang-pasang manual; ia tinggal di secret manager, bukan di memori.", correct: false },
            { text: "Semua boleh hilang asal ada retry otomatis", why: "Retry tanpa state = mengulang dari nol dan membayar dua kali.", correct: false },
          ],
        },
        {
          q: "Tugas J2 (22 menit) di platform timeout 15 menit, tarif Rp150/mnt, retry 1×. Biayanya?",
          options: [
            { text: "Rp3.300 (22 × 150)", why: "Itu biaya bila tidak ada timeout — tetapi platform membunuh di menit ke-15.", correct: false },
            { text: "Rp4.500 — dua percobaan × 15 menit × Rp150, hasil nol", why: "Tepat — min(22,15)=15 per percobaan, dua percobaan, keduanya gagal.", correct: true },
            { text: "Rp2.250 — satu percobaan saja yang ditagih", why: "Retry otomatis berarti percobaan kedua juga berjalan dan ditagih.", correct: false },
            { text: "Rp0 — tugas gagal tidak ditagih", why: "Platform menagih waktu komputasi yang dipakai, bukan keberhasilan.", correct: false },
          ],
        },
        {
          q: "Kapan retry otomatis AMAN diaktifkan?",
          options: [
            { text: "Selalu — retry tidak pernah merugikan", why: "Retry untuk kegagalan struktural (timeout platform) = membayar kepastian gagal berulang kali.", correct: false },
            { text: "Hanya untuk kegagalan transient (429/503/timeout baca) dengan backoff dan batas", why: "Tepat — retry menyembuhkan yang sesaat; untuk yang struktural ia hanya menggandakan tagihan.", correct: true },
            { text: "Hanya untuk tugas di bawah 1 menit", why: "Durasi bukan kriterianya — sifat kegagalan (transient vs struktural) yang menentukan.", correct: false },
            { text: "Tidak pernah — retry selalu pemborosan", why: "Terlalu kaku — retry untuk rate limit sesaat adalah praktik standar yang benar.", correct: false },
          ],
        },
        {
          q: "Beban tugasmu: siang sangat ramai, malam nyaris nol. Pola termurah yang menyelesaikan tugas?",
          options: [
            { text: "Serverless function", why: "Hanya bila tugas < timeout — untuk agen 40 menit, function = Rp6 juta untuk nol hasil.", correct: false },
            { text: "Container always-on 24/7", why: "Semua selesai, tetapi membayar jam-jam sepi di malam hari.", correct: false },
            { text: "Worker autoscale + antrean", why: "Tepat — scale mengikuti beban: bayar nyaris hanya untuk kerja nyata.", correct: true },
            { text: "Satu VM besar yang dijalankan manual tiap pagi", why: "Manual = tidak ada ketahanan saat lonjakan dan rawan lupa; bukan pola produksi.", correct: false },
          ],
        },
        {
          q: "Alert biaya yang PALING berguna untuk deployment agen?",
          options: [
            { text: "Alert saat tagihan bulanan sudah terbit", why: "Terlambat — tagihan adalah vonis, bukan peringatan.", correct: false },
            { text: "Alert saat biaya per tugas naik 20% minggu-ke-minggu", why: "Tepat — menangkap kebocoran (konteks membengkak, retry liar) saat masih kecil.", correct: true },
            { text: "Alert setiap ada tugas yang gagal", why: "Terlalu berisik — kegagalan individual adalah hal biasa; yang penting adalah TREN.", correct: false },
            { text: "Tidak perlu alert — cek dashboard tiap akhir bulan", why: "Sebulan tanpa pantauan = sebulan kebocoran berjalan tanpa rem.", correct: false },
          ],
        },
      ],
    },
  ],
};
