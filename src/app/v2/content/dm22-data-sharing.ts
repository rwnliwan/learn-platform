import type { V2Lesson } from "../lib/types";

// ── Figure: risiko vs nilai 4 pola berbagi data ───────────────────────────
const SHARE_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Diagram sebar empat pola berbagi data berdasarkan risiko dan nilai kolaborasi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="70" y1="20" x2="70" y2="210"/><line x1="70" y1="210" x2="530" y2="210"/>
<line x1="70" y1="162" x2="530" y2="162"/><line x1="70" y1="115" x2="530" y2="115"/>
<line x1="70" y1="67" x2="530" y2="67"/>
<line x1="185" y1="20" x2="185" y2="210"/><line x1="300" y1="20" x2="300" y2="210"/>
<line x1="415" y1="20" x2="415" y2="210"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="64" y="213" text-anchor="end">rendah</text><text x="64" y="118" text-anchor="end">risiko</text>
<text x="64" y="30" text-anchor="end">tinggi</text>
<text x="76" y="228">rendah</text><text x="524" y="228" text-anchor="end">tinggi</text>
<text x="290" y="228" text-anchor="middle">nilai kolaborasi →</text>
</g>
<g font-family="var(--font-ui)">
<circle cx="150" cy="180" r="26" fill="var(--chart-text)" opacity="0.5"/>
<text x="150" y="184" text-anchor="middle" font-size="10" fill="var(--text)">Kirim file</text>
<circle cx="360" cy="140" r="26" fill="var(--c2)" opacity="0.85"/>
<text x="360" y="144" text-anchor="middle" font-size="10" fill="#fff">API</text>
<circle cx="250" cy="80" r="30" fill="var(--c1)" opacity="0.9"/>
<text x="250" y="76" text-anchor="middle" font-size="10" fill="#fff">Clean room</text>
<text x="250" y="90" text-anchor="middle" font-size="10" fill="#fff">+ agregat</text>
<circle cx="460" cy="60" r="26" fill="var(--c2)" opacity="0.85"/>
<text x="460" y="64" text-anchor="middle" font-size="10" fill="#fff">Data marketplace</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="70" y="246">risiko kebocoran vs nilai kolaborasi (ilustrasi; posisi clean room = risiko rendah, nilai sedang-tinggi)</text>
</g>
</svg>`;

export const dm22: V2Lesson = {
  slug: "dm22-data-sharing",
  track: "Data Management",
  module: "Keamanan & Risiko",
  title: "Berbagi Data & Clean Room: Kolaborasi Tanpa Menyerahkan Data",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua kompetitor yang ingin bekerja sama — tanpa saling percaya",
      prose: [
        "Dua bank bersaing ingin tahu: berapa banyak nasabah yang punya kartu kredit di KEDUA bank — untuk mengukur risiko over-leverage. Masalahnya: tidak ada yang mau menyerahkan daftar nasabahnya ke kompetitor. Kirim file Excel? Itu bunuh diri kompetitif. Berbagi database? Bagian legal langsung menolak. Proyek macet enam bulan — sampai tim data mengusulkan clean room: kedua daftar nasabah di-hash dan dimasukkan ke lingkungan komputasi netral yang tidak bisa diakses siapa pun. Yang keluar bukan data nasabah, melainkan SATU angka: 18,4% overlap. Twist-nya: kedua bank mendapatkan jawaban yang mereka butuhkan TANPA pernah melihat data satu sama lain. Kolaborasi terjadi justru karena datanya tidak dibagikan.",
        "Itulah paradoks data sharing modern: nilai terbesar justru terbuka ketika data mentahnya tidak berpindah tangan. Polanya bermacam-macam — dari API terkontrol, data marketplace, sampai clean room dengan privacy-enhancing technologies (PETs) seperti hashing, agregasi, dan differential privacy. Tren industri 2024–2026 jelas: kolaborasi data antar organisasi naik (periklanan, deteksi fraud lintas bank, riset kesehatan), tetapi regulasi privasi makin ketat — jadi teknik “berbagi tanpa menyerahkan” menjadi keterampilan inti.",
        "Di lesson ini kamu belajar empat pola berbagi data, anatomi clean room, dan cara memilih pola yang tepat — termasuk kapan jawabannya adalah “jangan berbagi”.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini keterampilan data management, bukan cuma legal",
        type: "risk",
        body: "Keputusan pola sharing menentukan arsitektur: API butuh gateway dan kontrak; clean room butuh lingkungan komputasi netral dan definisi query yang disepakati; kirim file butuh... doa. Tim data yang hanya bisa bilang “tanya legal” akan selalu kalah cepat dari tim yang bisa mengusulkan pola teknis yang aman.",
      },
      reference: "Berbagi data ≠ memindahkan data. Nilai kolaborasi bisa didapat tanpa data mentah berpindah tangan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membedakan empat pola berbagi data (kirim file, API, clean room, marketplace) beserta risiko tiap pola; (2) menjelaskan anatomi clean room: data masuk terenkripsi, query disepakati, yang keluar hanya agregat; (3) memilih teknik privasi yang tepat (hashing, agregasi, k-anonymity, differential privacy) untuk tiap kebutuhan; (4) menghitung risiko re-identifikasi sederhana dan menafsirkannya.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (pola sharing; clean room & PETs) → lab Python (simulasi clean room: hash + agregat + cek k-anonymity) → chart risiko vs nilai → peta keputusan → mini-case fraud lintas bank → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari keamanan & privasi data: data diklasifikasikan berdasar sensitivitas (publik, internal, rahasia, sangat rahasia) — klasifikasi ini menentukan pola sharing apa yang boleh dipakai; data nasabah bank tidak pernah boleh “dikirim file via email”. Prinsipnya: minimisasi (hanya bagikan yang diperlukan), purpose limitation (dipakai hanya untuk tujuan yang disepakati), dan jejak audit (siapa mengakses apa, kapan). Clean room adalah implementasi teknis dari ketiga prinsip itu sekaligus.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: tanya selalu “apa pertanyaan bisnisnya?” SEBELUM “data apa yang dibagi?”. Kalau jawabannya cuma satu angka (overlap, rata-rata, hitung), kamu hampir tidak pernah butuh data baris mentah.",
      ],
      reference: "Bekal: (1) klasifikasi sensitivitas menentukan pola sharing; (2) minimisasi + purpose limitation + audit trail.",
    },
    {
      id: "konsep-pola",
      eyebrow: "Langkah 3 · Konsep",
      title: "Empat Pola Berbagi — Si Kurir, Si Resepsionis, Si Ruang Kedap, Si Pasar",
      prose: [
        "Definisi: pola berbagi data adalah cara teknis data berpindah (atau tidak berpindah) antar pihak. Empat pola utama: (1) Kirim file — data mentah dikirim (email, SFTP, shared folder); (2) API terkontrol — konsumen memanggil endpoint, pemilik mengontrol apa yang keluar; (3) Clean room — data dari banyak pihak dimasukkan ke lingkungan komputasi netral, hanya hasil agregat yang keluar; (4) Data marketplace/exchange — platform terpusat tempat dataset didaftar, dibeli, atau dibagikan dengan lisensi.",
        "Kepribadiannya: si Kurir (kirim file) — cepat, murah, dan tidak bisa ditarik kembali; sekali file terkirim, kendali hilang total. Si Resepsionis (API) — sopan dan terkontrol; tamu hanya boleh ke ruangan yang diizinkan, setiap kunjungan tercatat. Si Ruang Kedap (clean room) — para pihak menitipkan barang di brankas netral, petugas independen menghitung, yang keluar hanya rekapnya. Si Pasar (marketplace) — etalase data dengan harga dan lisensi; praktis, tetapi kualitas dan legalitasnya harus diverifikasi sendiri.",
        "Kapan memakai: kirim file hanya untuk data non-sensitif dan sekali pakai (dan tetap lebih baik dihindari); API untuk kolaborasi operasional berkelanjutan dengan mitra terpercaya; clean room untuk kolaborasi antar pihak yang TIDAK saling percaya penuh (kompetitor, lintas industri) atau data sangat sensitif; marketplace untuk data yang memang diniatkan sebagai produk. Aturan emas: sensitivitas data menentukan pola — bukan kenyamanan tim.",
      ],
      formula: String.raw`\text{risiko pola} \propto \text{salinan data mentah} \times \text{pihak yang memegangnya}`,
      formulaNote: "Bukan rumus eksak, melainkan kompas: risiko berbanding lurus dengan jumlah salinan data mentah dikali jumlah pihak yang memegangnya. Kirim file = salinan penuh × tiap penerima (risiko tertinggi). Clean room = nol salinan mentah di tangan pihak lain (risiko terendah untuk kolaborasi). Setiap kali seseorang mengusulkan “kirim saja filenya”, hitung perkalian ini dulu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sudah tanda tangan NDA, jadi aman kirim data mentah”",
        type: "pitfall",
        body: "Yang benar: NDA adalah obat hukum SETELAH kebocoran terjadi — ia tidak mencegah kebocoran. NDA tidak mengenkripsi file, tidak mencatat siapa mengakses apa, dan tidak menghapus salinan di laptop penerima. Kontrol teknis (API/clean room) mencegah; NDA menghukum. Keduanya dibutuhkan, tetapi jangan tukar perannya.",
      },
      hints: [
        "💡 Intuisi: uji “penarikan kembali” — kalau kerja sama berakhir besok, bisakah kamu menarik kembali datamu? Kirim file: tidak. API: ya (cabut akses). Clean room: tidak perlu (datamu tidak pernah keluar). Marketplace: tergantung lisensi.",
      ],
      reference: "Pilih pola dari sensitivitas data, bukan dari kenyamanan. NDA ≠ kontrol teknis.",
    },
    {
      id: "konsep-cleanroom",
      eyebrow: "Langkah 4 · Konsep",
      title: "Clean Room & PETs — Si Ruang Interogasi Kedap Suara",
      prose: [
        "Definisi: data clean room adalah lingkungan komputasi netral tempat banyak pihak memasukkan data (terenkripsi/pseudonim) untuk dianalisis bersama — dengan aturan keras: tidak ada pihak yang bisa melihat data mentah pihak lain, dan yang keluar hanya hasil agregat yang disepakati. Privacy-Enhancing Technologies (PETs) adalah tekniknya: hashing/Pseudonymisation (identitas diganti token), agregasi (hanya statistik keluar), k-anonymity (setiap kombinasi quasi-identifier muncul ≥ k kali), differential privacy (noise matematis yang melindungi individu).",
        "Kepribadiannya: clean room seperti ruang interogasi kedap suara di film — para saksi (data) masuk lewat pintu terpisah, penyidik independen (mesin) mengajukan pertanyaan yang sudah disepakati, dan yang keluar ke publik hanya ringkasan kesaksian. Tidak ada saksi yang bertemu satu sama lain. Kuncinya ada tiga: (1) query disepakati SEBELUM data masuk — tidak ada eksplorasi bebas; (2) output diperiksa — agregat dengan sel terlalu kecil ditahan (aturan k-anonymity); (3) semua aktivitas diaudit — siapa menjalankan query apa, kapan.",
        "Kapan memakai: ketika nilai kolaborasi tinggi tetapi kepercayaan rendah atau regulasi melarang data mentah berpindah — overlap nasabah antar kompetitor, atribusi iklan (pengiklan + publisher), deteksi fraud lintas bank, riset kesehatan multi-rumah sakit. Kapan TIDAK: ketika pertanyaannya butuh eksplorasi bebas data baris — clean room bukan data lake bersama; ia menjawab pertanyaan spesifik, bukan “coba lihat-lihat”.",
        "Pendalaman: differential privacy memberi angka pada seberapa anonim. Parameternya epsilon: semakin kecil, semakin besar noise yang ditambahkan, semakin kuat privasinya. Epsilon 0,1 berarti sangat ketat \u2014 cocok untuk data kesehatan; epsilon 1 berarti seimbang \u2014 umum untuk analitik; epsilon 10 berarti longgar \u2014 nyaris tanpa perlindungan. Intuisinya: epsilon adalah anggaran privasi \u2014 setiap query menghabiskan sebagian; anggaran habis berarti tidak ada query lagi, karena tiap jawaban membocorkan sedikit informasi. Aturan praktisnya: tetapkan budget epsilon per proyek per kuartal dan catat konsumsinya seperti anggaran uang. Tanpa budget, klaim kami pakai differential privacy hanyalah label \u2014 dan label tidak melindungi siapa pun saat audit datang.",
      ],
      formula: String.raw`k\text{-anonymity terpenuhi} \iff \min(\text{ukuran tiap grup quasi-identifier}) \geq k`,
      formulaNote: "Quasi-identifier = atribut yang bila digabung bisa mengidentifikasi orang (kode pos + tanggal lahir + jenis kelamin). Syarat: setiap kombinasi nilai quasi-identifier harus muncul minimal k kali dalam output. Contoh: k=5, maka tidak boleh ada sel agregat “perempuan, lahir 1990, kode pos 10110” yang hanya berisi 2 orang — sel itu ditahan/disembunyikan. Interpretasi: k adalah “kerumunan minimal” tempat individu bisa bersembunyi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Data sudah di-hash, berarti anonim dan aman dibagikan”",
        type: "pitfall",
        body: "Yang benar: hashing BUKAN anonimisasi — ia pseudonimisasi yang reversibel bila penyerang tahu domain nilainya (daftar NIK, misalnya, bisa di-hash satu per satu lalu dicocokkan — serangan kamus). Data hash tetap data pribadi menurut banyak regulasi. Anonimisasi butuh kombinasi teknik (agregasi + k-anonymity + noise), bukan satu fungsi hash.",
      },
      hints: [
        "💡 Intuisi: anggap setiap teknik PET sebagai satu lapis baju — hashing = kaus, agregasi = jaket, k-anonymity = mantel, differential privacy = jas hujan. Satu lapis tidak cukup untuk badai regulasi; lapisi sesuai cuaca (sensitivitas).",
      ],
      reference: "Clean room: data masuk terpisah, query disepakati dulu, keluar hanya agregat yang lolos ambang privasi.",
    },
    {
      id: "lab-cleanroom",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Simulasi clean room mini",
      prose: [
        "Waktunya jadi operator clean room-nya. Di bawah ada dua “bank” (sintetis) dengan daftar nasabah. Tugasmu: (1) hash identitas nasabah tiap bank (pseudonimisasi); (2) hitung overlap — berapa hash yang muncul di KEDUA bank — tanpa pernah membandingkan nama asli; (3) terapkan aturan k-anonymity sederhana: overlap hanya boleh dilaporkan bila ≥ k (k=3), atau ditahan.",
        "Coba: setelah lolos, turunkan k menjadi 1 dan perhatikan apa yang berubah. Lalu tanya: overlap = 2 dari 10.000 nasabah — apakah angka itu sendiri sudah membocorkan sesuatu? (Petunjuk: pikirkan serangan kamus pada hash.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `hash_id(nama)`: kembalikan SHA-256 hex dari nama (lowercase, tanpa spasi)" },
        { id: "t2", text: "Hitung `overlap` = jumlah hash yang ada di kedua bank" },
        { id: "t3", text: "Hitung `boleh_rilis` = True bila overlap >= K" },
        { id: "t4", text: "Hitung `persen` = overlap / total_unik * 100 (total_unik = gabungan unik kedua bank)" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "overlap: 3 nasabah\nrilis diizinkan (k=3): True\noverlap: 30.0% dari total unik",
      code: {
        starter: `import hashlib

# Dua bank, daftar nasabah (SINTETIS — nama fiktif)
bank_a = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fajar", "Gita"]
bank_b = ["Citra", "Dewi", "Eko", "Hadi", "Irma", "Joko"]
K = 3  # ambang k-anonymity clean room

# TULIS KODEMU DI BAWAH INI
def hash_id(nama):
    return

hash_a = set()  # TODO: {hash_id(n) for n in bank_a}
hash_b = set()  # TODO: {hash_id(n) for n in bank_b}

overlap = 0  # TODO: |hash_a irisan hash_b|

boleh_rilis = False  # TODO: overlap >= K

total_unik = 0  # TODO: |hash_a gabung hash_b|
persen = 0.0  # TODO: overlap / total_unik * 100

print(f"overlap: {overlap} nasabah")
print(f"rilis diizinkan (k={K}): {boleh_rilis}")
print(f"overlap: {persen:.1f}% dari total unik")`,
        lockLines: 7,
        solution: `import hashlib

# Dua bank, daftar nasabah (SINTETIS — nama fiktif)
bank_a = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fajar", "Gita"]
bank_b = ["Citra", "Dewi", "Eko", "Hadi", "Irma", "Joko"]
K = 3  # ambang k-anonymity clean room

# TULIS KODEMU DI BAWAH INI
def hash_id(nama):
    bersih = nama.lower().replace(" ", "")
    return hashlib.sha256(bersih.encode()).hexdigest()

hash_a = {hash_id(n) for n in bank_a}
hash_b = {hash_id(n) for n in bank_b}

overlap = len(hash_a & hash_b)

boleh_rilis = overlap >= K

total_unik = len(hash_a | hash_b)
persen = overlap / total_unik * 100

print(f"overlap: {overlap} nasabah")
print(f"rilis diizinkan (k={K}): {boleh_rilis}")
print(f"overlap: {persen:.1f}% dari total unik")`,
        checks: [
          { kind: "equal", task: "t2", name: "overlap", value: 3, tol: 0, label: "`overlap` harus 3", msg: "Citra, Dewi, Eko ada di kedua bank." },
          { kind: "equal", task: "t3", name: "boleh_rilis", value: true, tol: 0, label: "`boleh_rilis` harus True", msg: "overlap=3 >= K=3 — tepat di ambang." },
          { kind: "equal", task: "t4", name: "persen", value: 30.0, tol: 0.01, label: "`persen` harus 30,0", msg: "3/10 × 100 = 30,0% (7+6-3=10 unik)." },
          { kind: "uses", task: "t1", token: "sha256", label: "Memakai SHA-256", msg: "Pseudonimisasi memakai fungsi hash kriptografis (hashlib.sha256)." },
          { kind: "stdout_matches", task: "t5", pattern: "overlap: 3 nasabah", label: "Ringkasan overlap tercetak", msg: "Baris pertama: 'overlap: 3 nasabah'." },
          { kind: "stdout_matches", task: "t5", pattern: "rilis diizinkan \\(k=3\\): True", label: "Keputusan rilis tercetak", msg: "Baris kedua: 'rilis diizinkan (k=3): True'." },
        ],
      },
      note: {
        title: "Intuisi: balik urutan pertanyaannya",
        body: "Cara berpikir yang membuat clean room terasa natural: ia membalik urutan pertanyaan. Biasanya orang bertanya data apa yang boleh keluar. Di clean room pertanyaannya adalah query apa yang boleh masuk. Heuristik desainnya: tulis dulu daftar query yang diizinkan beserta ambang minimum tiap output \u2014 sebelum satu byte data masuk. Kalau sebuah pertanyaan belum ada di daftar, jawabannya otomatis tidak \u2014 tidak ada eksplorasi dadakan, tidak ada coba-coba. Disiplin ini terasa kaku, tetapi justru kekakuan inilah yang membuat pihak yang tidak saling percaya mau menitipkan data: mereka tidak perlu percaya padamu, cukup percaya pada daftar query yang mereka setujui. Dan ingat pelajaran lab ini: ambang k bukan hiasan \u2014 ia garis yang memisahkan agregat yang aman dari sel yang membocorkan individu.",
      },
      reference: "Clean room mini: hash → irisan → cek ambang k → rilis agregat. Nama asli tidak pernah dibandingkan.",
    },
    {
      id: "chart-risiko",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca peta risiko vs nilai",
      prose: [
        "Chart di bawah memetakan empat pola berbagi data pada dua sumbu: risiko kebocoran (vertikal) vs nilai kolaborasi (horizontal).",
        "Cara membaca: sumbu Y = risiko (atas = tinggi); sumbu X = nilai kolaborasi (kanan = tinggi). Tiap lingkaran = satu pola. Posisi menentukan trade-off-nya.",
        "Interpretasi: “Kirim file” duduk di kiri-atas — risiko tinggi, nilai kolaborasi rendah (datanya mentah tetapi tidak terkontrol, tidak tercatat, tidak bisa ditarik). “API” di tengah-kanan — risiko sedang, nilai tinggi untuk kolaborasi operasional. “Clean room + agregat” di kiri-tengah — risiko rendah dengan nilai sedang-tinggi: pola inilah yang memungkinkan kolaborasi antar pihak yang tidak saling percaya. “Data marketplace” di kanan-atas — nilai tinggi tetapi risiko juga tinggi bila governance pembeli lemah. Pelajaran chart ini: tidak ada pola yang “terbaik” — ada pola yang risikonya sepadan dengan nilainya. Tugas arsitek data adalah menempatkan tiap kerja sama di titik yang benar.",
      ],
      figure: {
        svg: SHARE_SVG,
        alt: "Diagram sebar: kirim file (risiko tinggi, nilai rendah), API (risiko sedang, nilai tinggi), clean room (risiko rendah, nilai sedang-tinggi), marketplace (risiko tinggi, nilai tinggi).",
        caption: "Trade-off empat pola berbagi data: risiko vs nilai kolaborasi (ilustrasi).",
      },
      tasks: [],
      reference: "Tempatkan tiap kerja sama di titik risiko-nilai yang benar — jangan default ke kirim file.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Mitra meminta data — pola apa yang kamu tawarkan?",
      prose: [
        "Empat skenario keputusan sharing:",
        "Skenario 1 — Startup fintech meminta data transaksi mentah “untuk riset bersama”. → Tawarkan clean room dengan query disepakati, bukan data mentah. Alasan: “riset bersama” yang butuh baris mentah hampir selalu bisa dirumuskan ulang sebagai pertanyaan agregat; bila tidak bisa, itu sinyal tujuan sebenarnya belum jelas.",
        "Skenario 2 — Mitra logistik butuh status pengiriman real-time untuk dashboard mereka. → API terkontrol dengan scope minimal + rate limit + audit log. Alasan: kebutuhan operasional berkelanjutan, data tidak terlalu sensitif, dan akses bisa dicabut kapan pun.",
        "Skenario 3 — Kompetitor mengajak kolaborasi deteksi fraud lintas bank. → Clean room multi-pihak: masing-masing setor hash + fitur, model dilatih di dalam, yang keluar hanya skor/model agregat. Alasan: kepercayaan rendah, sensitivitas tinggi, nilai kolaborasi tinggi — tepat di titik clean room pada chart.",
        "Skenario 4 — Tim internal divisi lain meminta “dump database nasabah untuk analisis”. → Jangan kirim dump; sediakan akses via data warehouse dengan RBAC + masking kolom sensitif. Alasan: ancaman terbesar kebocoran seringkali internal — “internal” bukan alasan melewati kontrol.",
        "Skenario 5 \u2014 membeli dataset dari marketplace: verifikasi dulu tiga hal \u2014 provenance (dari mana data ini dikumpulkan dan dengan consent apa), freshness (kapan terakhir di-update; dataset demografi 2019 untuk scoring 2026 adalah racun), dan lisensi (boleh dipakai untuk apa; beberapa dataset melarang penggunaan komersial atau scoring kredit). Minta data sampel plus kamus data sebelum bayar; dataset tanpa kamus data seperti membeli kucing dalam karung \u2014 harganya murah di depan, mahal saat dibersihkan.",
        "Aturan praktis 10 detik: permintaan data? → (1) apa tepatnya pertanyaan bisnisnya? (2) bisakah dijawab agregat? → ya = clean room/API agregat; (3) butuh baris mentah? → klasifikasi + kontrak + kontrol akses; (4) tidak jelas tujuannya? → tolak/minta klarifikasi dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjawab “bisa” sebelum tahu pertanyaannya. Berbagi data yang baik dimulai dari menolak permintaan yang kabur — “minta data nasabah untuk analisis” tanpa pertanyaan spesifik adalah undangan untuk penyalahgunaan, sengaja atau tidak.",
      },
      reference: "Mulai dari pertanyaan bisnis, bukan dari data. Kabur = tolak dulu, klarifikasi kemudian.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Konsorsium 3 bank vs sindikat fraud",
      prose: [
        "Skenario (sintetis, untuk latihan): tiga bank menengah menemukan pola fraud yang sama — rekening “keledai” yang dipakai bergantian. Masing-masing bank hanya melihat sebagian pola. Mereka ingin membangun daftar hitam bersama, tetapi: (a) dilarang membagikan data nasabah mentah ke kompetitor; (b) daftar hitam yang bocor ke publik bisa digugat; (c) satu bank khawatir dua lainnya “menumpang” tanpa berkontribusi.",
        "Pertanyaan analisis: (1) Pola sharing apa yang tepat, dan kenapa bukan kirim file/API biasa? (2) Bagaimana menangani kekhawatiran “penumpang gelap”? (3) Apa yang keluar dari clean room — dan apa yang TIDAK boleh keluar?",
        "Pembahasan: (1) Clean room multi-pihak: tiap bank menyetor hash identitas + fitur transaksi (frekuensi, nilai, pola jam) ke lingkungan netral; model/aturan fraud dijalankan di dalam; yang keluar hanya daftar hash rekening berisiko + skor — tanpa nama, tanpa saldo, tanpa riwayat. Kirim file melanggar (a); API biasa tidak menyelesaikan (b) karena data mentah tetap terlihat. (2) “Penumpang gelap” diatasi dengan aturan kontribusi: hanya bank yang menyetor data minimal (mis. 1.000 rekening berlabel) yang boleh mengambil hasil — insentif diselaraskan, bukan mengandalkan niat baik. (3) Yang keluar: hash + skor risiko + aturan agregat. Yang TIDAK boleh keluar: identitas nasabah, detail transaksi individu, dan sel agregat di bawah ambang k-anonymity (mis. “1 rekening dengan pola X di Bank C” = bocor).",
        "Operasional konsorsiumnya: clean room bukan proyek sekali jalan \u2014 ia butuh operator netral (pihak ketiga atau entitas bersama), jadwal refresh data (setor ulang tiap minggu agar daftar hitam tidak basi), dan aturan keluar-masuk anggota (bank yang keluar harus membuktikan datanya dimusnahkan dari lingkungan netral). Tanpa operator dan jadwal, clean room menjadi server mahal yang datanya basi dalam sebulan \u2014 dan daftar hitam basi lebih berbahaya daripada tidak ada daftar: ia memblokir nasabah yang sudah bersih.",
        "Catatan implementasi: query dan ambang disepakati SEBELUM data masuk — termasuk definisi “rekening berisiko” dan k minimal. Clean room tanpa aturan main yang disepakati hanyalah server bersama yang mahal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Daftar hitam bersama adalah senjata bermata dua: ia menangkap fraud lintas bank, tetapi satu kesalahan (false positive yang bocor) bisa menghancurkan nasabah yang tidak bersalah dan menyeret konsorsium ke pengadilan. Itulah kenapa output clean room harus agregat berambang — bukan daftar mentah yang bisa disalahgunakan.",
      },
      reference: "Konsorsium fraud: setor hash+fitur, proses di dalam, keluar skor agregat. Aturan main disepakati dulu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Empat pola berbagi: kirim file (risiko tertinggi), API terkontrol, clean room (kolaborasi tanpa data mentah berpindah), marketplace — pilih berdasar sensitivitas, bukan kenyamanan.",
        "Clean room: data masuk terpisah ke lingkungan netral, query disepakati dulu, keluar hanya agregat yang lolos ambang privasi.",
        "PETs berlapis: hashing (pseudonim, bukan anonim), agregasi, k-anonymity (kerumunan minimal k), differential privacy (noise matematis).",
        "Risiko pola sebanding dengan salinan data mentah × pihak yang memegangnya; uji penarikan kembali sebelum memilih pola.",
        "Mulai dari pertanyaan bisnis — bila jawabannya agregat, data baris mentah tidak perlu dibagikan.",
      ],
      quiz: [
        {
          q: "Dua kompetitor ingin tahu overlap nasabah tanpa saling melihat data. Pola yang tepat?",
          options: [
            { text: "Clean room: setor hash ke lingkungan netral, yang keluar hanya angka agregat", why: "Benar: kebutuhan = satu angka agregat; kepercayaan = rendah. Clean room menjawab tanpa data mentah berpindah.", correct: true },
            { text: "Kirim file Excel via email dengan NDA", why: "Salah: NDA tidak mencegah kebocoran; file yang terkirim tidak bisa ditarik. Risiko tertinggi untuk nilai yang sebenarnya kecil." },
            { text: "Buka API database nasabah untuk kompetitor", why: "Salah: API ke data nasabah mentah oleh kompetitor = memberikan kunci brankas. Scope API tidak menyelesaikan masalah kepercayaan." },
            { text: "Batalkan — kolaborasi antar kompetitor mustahil", why: "Salah: mustahil bila polanya kirim file; sangat mungkin bila polanya clean room. Menyerah adalah kegagalan arsitektur, bukan hukum alam." },
          ],
        },
        {
          q: "“Data sudah di-hash SHA-256, jadi anonim dan bebas dibagikan.” Kesalahannya?",
          options: [
            { text: "Hashing itu pseudonimisasi reversibel via serangan kamus — bukan anonimisasi; butuh lapisan PET lain", why: "Benar: bila domain nilai diketahui (daftar NIK/nama), penyerang tinggal hash satu per satu dan cocokkan. Satu lapis tidak cukup.", correct: true },
            { text: "SHA-256 terlalu lambat untuk data besar", why: "Salah: kecepatan bukan masalahnya; masalahnya asumsi “hash = anonim” yang keliru." },
            { text: "Hash tidak bisa dipakai untuk join antar pihak", why: "Salah: justru itu kegunaan hash di clean room — join tanpa membuka identitas. Masalahnya privasi, bukan fungsi." },
            { text: "Tidak ada kesalahan — hash memang anonim", why: "Salah: ini mitos yang paling berbahaya di data sharing. Banyak regulasi tetap menganggap data hash sebagai data pribadi." },
          ],
        },
        {
          q: "Output clean room menunjukkan sel “2 nasabah pola X”. Tindakan yang benar?",
          options: [
            { text: "Tahan sel tersebut — di bawah ambang k-anonymity, risiko re-identifikasi terlalu tinggi", why: "Benar: sel kecil = kerumunan terlalu sedikit untuk bersembunyi. Aturan k ada untuk ditegakkan, bukan dihias.", correct: true },
            { text: "Rilis saja — hanya 2 orang, dampaknya kecil", why: "Salah: “hanya 2 orang” justru masalahnya — semakin kecil sel, semakin mudah mengidentifikasi individunya." },
            { text: "Rilis dengan nama disamarkan", why: "Salah: menyamarkan nama pada sel 2 orang tidak membantu — quasi-identifier lain (pola transaksi) sudah cukup." },
            { text: "Hapus ambang k agar laporan lengkap", why: "Salah: menghapus pengaman demi kelengkapan laporan adalah cara cepat menghancurkan kepercayaan pada clean room." },
          ],
        },
        {
          q: "Mitra meminta “dump database nasabah untuk analisis” tanpa pertanyaan spesifik. Respons pertama yang benar?",
          options: [
            { text: "Tolak/minta klarifikasi pertanyaan bisnisnya dulu — permintaan kabur tidak dilayani", why: "Benar: tanpa pertanyaan spesifik tidak bisa ditentukan minimisasi, pola, maupun kontrol yang tepat. Kabur = risiko.", correct: true },
            { text: "Kirim dump dengan NDA", why: "Salah: NDA bukan kontrol teknis; dan “analisis” tanpa definisi adalah tujuan yang tidak bisa diaudit." },
            { text: "Kirim sebagian kecil sebagai sampel", why: "Salah: sampel data nasabah mentah tetap data nasabah mentah — masalahnya bukan volume, melainkan ketiadaan tujuan jelas." },
            { text: "Minta atasan menyetujui via email", why: "Salah: persetujuan atasan tidak mengubah permintaan kabur menjadi aman — ia hanya memindahkan tanggung jawab." },
          ],
        },
        {
          q: "Kapan clean room TIDAK cocok?",
          options: [
            { text: "Ketika tim butuh eksplorasi bebas atas data baris untuk menemukan pola yang belum diketahui", why: "Benar: clean room menjawab pertanyaan spesifik yang disepakati — ia bukan data lake bersama untuk eksplorasi bebas.", correct: true },
            { text: "Ketika para pihak tidak saling percaya", why: "Salah: justru itu kasus terbaik clean room — ketidakpercayaan adalah alasan ia ada." },
            { text: "Ketika datanya sangat sensitif", why: "Salah: sensitivitas tinggi + kebutuhan kolaborasi = alasan utama memakai clean room." },
            { text: "Ketika output yang dibutuhkan hanya agregat", why: "Salah: output agregat adalah kasus ideal clean room — bukan batasannya." },
          ],
        },
      ],
    },
  ],
};
