import type { V2Lesson } from "../lib/types";

// Bar: komposisi context window — riwayat menumpuk hingga mendorong instruksi keluar.
const MEM_SVG = `<svg viewBox="0 0 480 240" role="img" aria-label="Tiga batang memori: awal rapi, tengah penuh, akhir instruksi terdorong keluar.">
<g font-size="12" font-family="var(--font-ui)" fill="var(--text)" text-anchor="middle">
<text x="90" y="20">Langkah 1</text><text x="240" y="20">Langkah 15</text><text x="390" y="20">Langkah 30</text>
</g>
<g>
<rect x="40" y="36" width="100" height="180" rx="6" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<rect x="44" y="40" width="92" height="26" fill="var(--c1)" opacity="0.55"/><text x="90" y="57" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">instruksi</text>
<rect x="44" y="70" width="92" height="26" fill="var(--c2)" opacity="0.55"/><text x="90" y="87" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">tools</text>
<rect x="44" y="100" width="92" height="40" fill="var(--c3)" opacity="0.55"/><text x="90" y="124" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">riwayat</text>
<rect x="44" y="144" width="92" height="68" fill="var(--chart-grid)" opacity="0.35"/>
<rect x="190" y="36" width="100" height="180" rx="6" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<rect x="194" y="40" width="92" height="18" fill="var(--c1)" opacity="0.55"/>
<rect x="194" y="62" width="92" height="18" fill="var(--c2)" opacity="0.55"/>
<rect x="194" y="84" width="92" height="128" fill="var(--c3)" opacity="0.55"/><text x="240" y="152" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">riwayat</text><text x="240" y="166" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">menumpuk</text>
<rect x="340" y="36" width="100" height="180" rx="6" fill="none" stroke="var(--c5)" stroke-width="2"/>
<rect x="344" y="8" width="92" height="24" fill="var(--c5)" opacity="0.4"/><text x="390" y="24" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">instruksi ✕</text>
<rect x="344" y="40" width="92" height="14" fill="var(--c2)" opacity="0.55"/>
<rect x="344" y="58" width="92" height="154" fill="var(--c3)" opacity="0.55"/><text x="390" y="140" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">riwayat</text><text x="390" y="154" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">penuh</text>
</g>
<text x="240" y="232" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">B_riwayat tumbuh tiap langkah — instruksi awal jadi korban pertama</text>
</svg>`;

export const aai4: V2Lesson = {
  slug: "aai4-memory",
  track: "Agentic AI Engineer",
  module: "Arsitektur",
  title: "AAI4 — Memory: Ingatan Jangka Pendek & Panjang",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen support yang lupa siapa bosnya",
      prose: [
        "Tim Dina menguji agen support internal. Di awal percakapan, manajer menulis: \u201CSaya Rina, Kepala Divisi. Prioritaskan laporan saya di atas yang lain.\u201D Agen menjawab sopan: \u201CBaik, Bu Rina.\u201D",
        "Empat puluh pesan kemudian — setelah diskusi panjang soal template laporan — seseorang bertanya: \u201Csiapa yang prioritas?\u201D Agen menjawab: \u201CBudi dari tim marketing, karena ia paling sering chat di sini.\u201D Rina menatap layar. Agen baru saja \u201Cmemilih\u201D bos berdasarkan frekuensi chat.",
        "Twist-nya: tim mencoba solusi \u201Cgampang\u201D — pindah ke model dengan context window 4× lebih besar. Masalah tetap terjadi, hanya lebih lambat. Karena masalahnya bukan KAPASITAS, melainkan PERHATIAN: di tumpukan 40 pesan, fakta penting di awal sama terbenamnya dengan di window kecil — fenomena \u201Clost in the middle\u201D. Jendela besar tanpa strategi = gudang besar tanpa sistem katalog.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan short-term memory, ringkasan, dan long-term vector memory; (2) menghitung skor retrieval gabungan kemiripan + kebaruan; (3) mengenali kapan memory membantu vs meracuni; (4) mengimplementasikan memory beranggaran token dengan ringkasan otomatis.",
        "Daftar isi: 1) Cerita agen support · 2) Tiga lapis memory · 3) Lab: memory + ringkasan otomatis · 4) Peta keputusan strategi memory · 5) Mini-case: biaya ingatan penuh vs ringkas · 6) Checkpoint.",
        "Dampak nyatanya: selama 2 hari, Budi dari marketing mendapat prioritas tertinggi — 14 laporan tertunda, termasuk satu komplain nasabah prioritas yang telat ditangani 36 jam. Ketika Rina (Kepala Divisi yang sebenarnya) bertanya mengapa laporannya antre, agen menjawab dengan percaya diri: “Sesuai prioritas yang tercatat.” Keyakinan palsu + ingatan salah = keputusan salah yang terlihat benar. Satu fakta yang terkompresi hilang berbiaya 2 hari keputusan salah arah.",
        "Mengapa short-term memory gagal di sini? Hitung: 40 pesan × ~400 token per pesan = 16.000 token riwayat. Jika context window 8.000 (atau anggaran riwayat dibatasi 12.000), pesan-pesan AWAL — termasuk “Saya Rina, Kepala Divisi” — terdorong keluar. Ini bukan bug; ini aritmetika. Ingatan yang tak beranggaran PASTI meluap; pertanyaannya hanya kapan dan fakta apa yang jadi korban pertama. Biasanya: fakta penting dari awal sesi.",
        "Solusi Dina: dua tier (PIN + biasa) + aturan konflik + tombol “koreksi ingatan” di dasbor yang bisa dipakai analis. Hasil: 2 pekan tanpa insiden prioritas, dan — yang lebih penting — ketika analis mengoreksi satu fakta, koreksinya TERCATAT dengan sumber dan timestamp. Ingatan agen berubah dari “kotak hitam yang kadang benar” menjadi “buku catatan yang bisa diaudit”. Kepercayaan bukan dibangun dari “tidak pernah salah”, melainkan dari “salahnya bisa dilacak dan diperbaiki”.",
        "Alur “koreksi ingatan” di dasbor Dina — yang membuat ingatan bisa dipercaya. Analis melihat fakta yang salah → klik koreksi → tulis yang benar + sumber → fakta lama DITANDAI (bukan dihapus — audit trail!) → fakta baru masuk PIN sementara 7 hari. Tiga prinsip: (1) koreksi lebih mudah daripada laporan bug; (2) yang lama tidak hilang (forensik); (3) yang baru diawasi dulu (masa percobaan). Hasil: analis berani mengoreksi (friksi rendah), dan ingatan membaik tiap pekan — compound interest untuk pengetahuan. Ingatan yang tidak bisa dikoreksi = ingatan yang tidak bisa dipercaya.",
      ],
      note: {
        title: "💡 Intuisi: yang diringkas harus fakta, bukan narasi",
        body: "“Diskusi panjang soal template laporan” → “Rina = Kepala Divisi, prioritas tertinggi”. Ringkasan yang menyimpan NARASI (gaya bicara, basa-basi, urutan kejadian) membuang 90% anggarannya untuk hal yang tak pernah dipakai mengambil keputusan. Ekstrak hanya tiga jenis: entitas + relasi, larangan, preferensi keputusan. Buang sisanya tanpa ampun.",
      },

      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga lapis ingatan agen",
      prose: [
        "SHORT-TERM (working memory): isi context window saat ini — prompt, riwayat, observasi terakhir. Cepat, persis, tetapi TERBATAS dan VOLATIL: hilang saat sesi berakhir, terdorong keluar saat penuh.",
        "RINGKASAN (compressed memory): riwayat lama diringkas menjadi fakta kunci (\u201CRina = Kepala Divisi, prioritas tertinggi\u201D). Menghemat 10–50× token dibanding riwayat mentah. Harganya: detail hilang, dan ringkasan yang buruk = ingatan palsu yang dipercaya agen.",
        "LONG-TERM / VECTOR MEMORY: fakta disimpan sebagai embedding di vector store, diambil via similarity search saat relevan. Kapasitas praktis tak terbatas, tetapi retrieval bisa salah sasaran — mengambil fakta mirip yang salah konteks.",
        "Kepribadian: short-term itu papan tulis — cepat ditulis, mudah terhapus. Ringkasan itu catatan rapat — ringkas tetapi tergantung siapa yang mencatat. Vector memory itu arsip raksasa dengan petugas yang kadang salah mengambilkan map.",
        "Kapan memory MERACUNI? Tiga racun klasik: (1) FAKTA BASI — \u201Ckurs 15.800\u201D dari pekan lalu dipakai hari ini; (2) KONTEKS SALAH — fakta benar untuk nasabah A diterapkan ke nasabah B; (3) RINGKASAN PALSU — detail penting hilang saat kompresi (\u201Cjangan buka folder NASABAH\u201D lenyap dari ringkasan Arsiparis).",
        "Rumus retrieval menggabungkan kemiripan semantik dengan kebaruan — karena fakta lama yang mirip belum tentu fakta yang benar hari ini.",
        "Contoh angka tuning α. Tiga dokumen kandidat untuk query “laporan Rina”: A (sim=0,9, recency=0,1 — sangat mirip, 6 bulan lalu), B (sim=0,6, recency=0,9 — cukup mirip, kemarin), C (sim=0,5, recency=0,5). Dengan α=0,7: A=0,7×0,9+0,3×0,1=0,66; B=0,7×0,6+0,3×0,9=0,69; C=0,5. Pemenang: B — fakta baru yang cukup relevan. Dengan α=0,3: A=0,34; B=0,81; C=0,5 — B menang telak. α adalah KEBIJAKAN PERUSAHAAN dalam satu angka: α tinggi = “kami percaya arsip”, α rendah = “kami percaya kabar terbaru”. Pilih berdasarkan domain, bukan firasat.",
        "Rasio kompresi dalam angka: riwayat 16.000 token diringkas menjadi 400 token = 40×. Penghematan per langkah: 15.600 token × Rp150/1.000 = Rp2.340 per panggilan LLM. Untuk 6.000 panggilan per hari (200 percakapan × 30 langkah): hemat Rp14 juta per hari. HARGANYA: nuansa hilang. “Rina = Kepala Divisi, prioritas TERTINGGI” selamat; “jangan ganggu Rina sebelum jam 10 pagi” hilang; “Rina lebih suka tabel daripada narasi” hilang. Ringkasan adalah kompresi LOSSY — putuskan apa yang boleh hilang SEBELUM ia hilang.",
        "Kapan vector store, kapan ringkasan? Vector store = ingat BANYAK fakta yang JARANG dipakai: 10.000 fakta × 100 token = 1 juta token — mustahil di ringkasan, sepele di vector DB. Ringkasan = ingat SEDIKIT fakta yang SELALU dipakai: identitas, peran, larangan — dibaca tiap langkah tanpa retrieval. Arsitektur yang benar = keduanya: ringkasan untuk “siapa dan apa yang penting”, vector untuk “di mana detailnya”. Satu lapis saja = ingatan yang pincang.",
        "Bahaya yang jarang dibahas: MEMORY POISONING. Fakta salah yang masuk ringkasan menjadi “kebenaran” permanen — setiap langkah berikutnya membacanya sebagai fakta. Contoh: jika ringkasan mencatat “Budi = prioritas tertinggi” (salah), agen akan mempertahankannya selama berminggu-minggu. Obatnya: (1) sumber tercatat per fakta (siapa bilang, kapan); (2) mekanisme koreksi/forget — fakta bisa dicabut; (3) fakta kritis butuh konfirmasi dua sumber. Ingatan tanpa mekanisme lupa = dogma.",
        "Fakta punya UMUR SIMPAN — dan recency yang naif tidak mengetahuinya. Kurs USD/IDR: basi dalam 1 hari. Kebijakan cuti perusahaan: basi dalam 1 tahun. “Rina = Kepala Divisi”: basi saat ada mutasi. Formula recency(d) yang baik = exp(−umur / umur_simpan_jenis_fakta), bukan sekadar “kemarin = 1”. Tanpa umur simpan per jenis, agenmu memperlakukan kurs 2019 sama segarnya dengan SOP kemarin — dan keduanya salah dengan cara berbeda.",
        "Konflik fakta: memory berisi “limit Rp50 juta” (SOP 2023) dan “limit Rp75 juta” (email direksi kemarin). Mana yang menang? Tanpa aturan konflik eksplisit, yang menang = yang terakhir dibaca (acak). Aturan yang benar: (1) sumber berotoritas menang (direksi > SOP lama); (2) yang baru menang JIKA otoritas setara; (3) konflik tak teresolusi = tandai AMBIGU, jangan pilih diam-diam. Ingatan yang tidak bisa menangani kontradiksi = ingatan yang berbohong dengan percaya diri.",
        "Worked α untuk tiga domain — satu formula, tiga kebijakan. (1) SUPPORT PELANGGAN: fakta “promo bulan ini” basi dalam 30 hari; α=0,3 (recency menang) — pelanggan tidak peduli promo 2023. (2) RISET HUKUM: putusan MA 2015 masih mengikat; α=0,8 (similarity menang) — kebenaran lama > kabar baru. (3) BERITA KEUANGAN: α=0,5 — seimbang. Tiga domain, tiga α — yang berarti α BUKAN konstanta universal melainkan KONFIGURASI per deployment. Dan α yang salah = kebijakan yang salah: support dengan α=0,8 akan mengutip promo basi dengan percaya diri.",
      ],
      formula: String.raw`\text{skor}(q, d) = \alpha \cdot \text{sim}(q, d) + (1 - \alpha) \cdot \text{recency}(d)`,
      formulaNote: "skor(q,d) = skor relevansi dokumen d untuk query q; sim(q,d) = kemiripan semantik (0–1); recency(d) = kesegaran waktu (1 = baru, 0 = basi); α (alpha) = bobot trade-off 0–1. α=1 berarti “hanya yang mirip”, α=0 berarti “hanya yang baru”. Memilih α = memilih kebijakan perusahaan: arsip vs kabar terbaru.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Ccontext window besar = masalah memory selesai\u201D",
        type: "pitfall",
        body: "Yang benar: window besar menunda, bukan menyelesaikan. Penelitian \u201Clost in the middle\u201D menunjukkan model kesulitan memakai informasi di tengah context panjang — fakta di posisi 40% sering terlewat. Strategi (ringkasan, retrieval selektif) tetap wajib; window besar hanya memberi ruang bernapas.",
      },
      hints: [
        "Intuisi: perlakukan memory seperti anggaran (AAI2): setiap fakta yang disimpan harus \u201Cmembayar sewa\u201D berupa kegunaan. Fakta tak terpakai 10 langkah = kandidat hapus.",
        "Intuisi: recency(d) biasanya dihitung sebagai 1/(1+umur_hari) atau peluruhan eksponensial — fakta kemarin hampir penuh, fakta sebulan lalu mendekati nol.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: memory beranggaran dengan ringkasan otomatis",
      prose: [
        "Kamu membangun `Memory` — ingatan agen yang punya anggaran token (`budget`). Setiap `ingat(fakta, token)` menambahkan fakta; jika total melebihi budget, fakta-fakta TERLAMA otomatis diringkas menjadi satu baris \u201CRINGKASAN: n fakta lama…\u201D (simulasi summarizer).",
        "Tugasmu: (1) implementasikan `ingat` — tambah fakta, hitung total token, panggil `ringkas()` saat over budget; (2) implementasikan `ringkas` — gabungkan semua kecuali 2 fakta terbaru menjadi satu entri ringkasan; (3) implementasikan `skor` — hitung α·sim + (1−α)·recency memakai `kemiripan` (mock: jumlah kata sama) dan umur.",
        "Fakta uji memakai α = 0,3 (recency dominan). Query \u201Climit kartu Rina\u201D: fakta \u201Climit kartu Rina 50 juta\u201D (umur 1 hari, 3 kata sama) vs \u201Climit kartu Budi 10 juta\u201D (umur 0 hari, 2 kata sama). Mana yang menang? Hitung: Rina 0,3×3 + 0,7×(1/2) = 1,25; Budi 0,3×2 + 0,7×1 = 1,30. Budi menang karena recency mendominasi — padahal query menyebut Rina!",
        "Coba eksplorasi: ubah α menjadi 0,95. Siapa menang sekarang? Itulah trade-off kemiripan vs kebaruan yang harus kamu setel per kasus.",
        "Eksperimen: kecilkan `budget` sampai fakta “Rina = Kepala Divisi” ikut teringkas. Pada budget berapa ia hilang? Itulah BAHAYA budget seragam: fakta kritis diperlakukan sama dengan basa-basi. Solusi produksi: dua tier — FAKTA PIN (identitas, larangan, prioritas) yang tidak pernah diringkas, dan fakta biasa yang boleh dikompresi. PIN 5 fakta × 50 token = 250 token — premi kecil untuk asuransi ingatan.",
        "Hubungkan ke AAI2: `memory` di lab ini adalah STATE yang dibawa antar iterasi loop sense–plan–act–observe. Tanpa memory, planner buta terhadap masa lalu; dengan memory tak beranggaran, planner tenggelam di masa lalu. Desain loop dan desain memory adalah SATU keputusan: berapa langkah agen boleh hidup (AAI2) × berapa token per langkah boleh diingat (AAI4) = total biaya ingatan.",
        "Serangan racun: tambahkan fakta salah (“Budi = Kepala Divisi”) di awal, jalankan 20 langkah dengan ringkasan berkala, lalu tanya “siapa kepala divisi?”. Tanpa mekanisme forget/koreksi, kebohongan itu ABADI — ia masuk ringkasan sebagai fakta dan dipertahankan selamanya. Lab ini tanpa disadari adalah mesin dogma. Pelajaran produksi: setiap fakta butuh (1) sumber tercatat, (2) tombol cabut. Ingatan tanpa mekanisme lupa = keyakinan tanpa mekanisme koreksi.",
        "Spesifikasi PIN — 5 fakta yang TIDAK BOLEH diringkas di lab ini: (1) “Rina = Kepala Divisi” (identitas), (2) “Prioritas: Rina > direksi > lainnya” (kebijakan), (3) “JANGAN ungkap data nasabah ke pihak luar” (larangan), (4) “Format laporan: tabel, bukan narasi” (preferensi), (5) “Budget: Rp10.000 per sesi” (batas). Total ±250 token — premi tetap yang murah. Aturan PIN: fakta masuk PIN hanya lewat jalur eksplisit (perintah manusia atau konfigurasi), TIDAK PERNAH lewat ringkasan otomatis. Yang otomatis meringkas = yang otomatis melupakan; yang PIN = yang dijaga manusia.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `ingat` dan `ringkas` dengan anggaran `budget=25` token" },
        { id: "t2", text: "Implementasikan `skor` lalu cetak pemenang retrieval untuk query uji" },
      ],
      expected: "total_token=17\npemenang=Budi:limit kartu Budi 10 juta",
      note: {
        title: "Miskonsepsi: \u201Cmemory selalu membantu agen\u201D",
        type: "pitfall",
        body: "Yang benar: contoh di lab membuktikan retrieval bisa MENYESATKAN — fakta Budi menang hanya karena lebih baru, padahal query menyebut Rina. Inilah \u201Cracun kebaruan\u201D. Solusinya: bobot α disetel per domain (data identitas → α tinggi; data pasar → recency tinggi), plus filter kata kunci sebelum skor.",
      },
      hints: [
        "ingat: self.fakta.append(...); self.total += token; jika self.total > self.budget: self.ringkas().",
        "ringkas: pisahkan 2 terakhir; gabungkan sisanya jadi (\"RINGKASAN: ...\", token secukupnya).",
        "skor = alpha * kemiripan(query, teks) + (1-alpha) * (1/(1+umur)).",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nclass Memory:\n    def __init__(self, budget):\n        self.budget = budget\n        self.fakta = []  # list of (teks, token, umur_hari)\n        self.total = 0\n\n    def ingat(self, teks, token, umur=0):\n        ...\n\n    def ringkas(self):\n        ...\n\ndef kemiripan(query, teks):\n    q = set(query.lower().split())\n    t = set(teks.lower().split())\n    return len(q & t)\n\n# ===== TULIS KODEMU =====\nmem = Memory(budget=25)\nmem.ingat("Rina Kepala Divisi prioritas", 8, umur=5)\nmem.ingat("template laporan v2 dipakai", 7, umur=3)\nmem.ingat("limit kartu Rina 50 juta", 7, umur=1)\nmem.ingat("limit kartu Budi 10 juta", 7, umur=0)\ntotal_token = mem.total\nn_fakta = len(mem.fakta)\n\ndef skor(query, teks, umur, alpha=0.7):\n    ...\n\nquery = "limit kartu Rina"\nkandidat = [("Rina", "limit kartu Rina 50 juta", 1), ("Budi", "limit kartu Budi 10 juta", 0)]\npemenang = max(kandidat, key=lambda k: skor(query, k[1], k[2], 0.3))\nprint(f"total_token={total_token}")\nprint(f"pemenang={pemenang[0]}:{pemenang[1]}")`,
        lockLines: 17,
        solution: `# ===== MOCK — jangan diubah =====\nclass Memory:\n    def __init__(self, budget):\n        self.budget = budget\n        self.fakta = []  # list of (teks, token, umur_hari)\n        self.total = 0\n\n    def ingat(self, teks, token, umur=0):\n        self.fakta.append((teks, token, umur))\n        self.total += token\n        if self.total > self.budget:\n            self.ringkas()\n\n    def ringkas(self):\n        lama = self.fakta[:-2]\n        baru = self.fakta[-2:]\n        n = len(lama)\n        tok_lama = sum(t for _, t, _ in lama)\n        self.fakta = [(f"RINGKASAN: {n} fakta lama", max(1, tok_lama // 4), 99)] + baru\n        self.total = sum(t for _, t, _ in self.fakta)\n\ndef kemiripan(query, teks):\n    q = set(query.lower().split())\n    t = set(teks.lower().split())\n    return len(q & t)\n\n# ===== TULIS KODEMU =====\nmem = Memory(budget=25)\nmem.ingat("Rina Kepala Divisi prioritas", 8, umur=5)\nmem.ingat("template laporan v2 dipakai", 7, umur=3)\nmem.ingat("limit kartu Rina 50 juta", 7, umur=1)\nmem.ingat("limit kartu Budi 10 juta", 7, umur=0)\ntotal_token = mem.total\nn_fakta = len(mem.fakta)\n\ndef skor(query, teks, umur, alpha=0.7):\n    return alpha * kemiripan(query, teks) + (1 - alpha) * (1 / (1 + umur))\n\nquery = "limit kartu Rina"\nkandidat = [("Rina", "limit kartu Rina 50 juta", 1), ("Budi", "limit kartu Budi 10 juta", 0)]\npemenang = max(kandidat, key=lambda k: skor(query, k[1], k[2], 0.3))\nprint(f"total_token={total_token}")\nprint(f"pemenang={pemenang[0]}:{pemenang[1]}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_token", value: 17, tol: 1e-9, label: "`total_token` = 17 setelah ringkasan", msg: "8+7+7+7=29 > 25, ringkas: 2 fakta lama (15 token) jadi ringkasan 3 token + 7 + 7 = 17." },
          { kind: "equal", task: "t1", name: "n_fakta", value: 3, tol: 1e-9, label: "`n_fakta` = 3 (1 ringkasan + 2 terbaru)", msg: "Setelah ringkas, fakta = [RINGKASAN, 2 fakta terbaru]." },
          { kind: "stdout_matches", task: "t2", pattern: "total_token=17\\npemenang=Budi:limit kartu Budi 10 juta", label: "output dua baris sesuai format", msg: "Skor Budi (1,70) mengalahkan Rina (1,55) karena recency. Samakan format print." },
        ],
      },
      reference: "list slicing [:-2], sum() generator, max() dengan key.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: pilih strategi memory",
      prose: [
        "Skenario 1 — percakapan pendek (<20 langkah), fakta sedikit → SHORT-TERM SAJA. Jangan bayar kompleksitas vector store untuk yang muat di papan tulis.",
        "Skenario 2 — sesi panjang berulang (support multi-hari) → SHORT-TERM + RINGKASAN BERKALA. Ringkas tiap N langkah atau saat 70% budget tercapai; simpan fakta kunci terstruktur (nama, peran, larangan).",
        "Skenario 3 — pengetahuan luas lintas sesi (arsip SOP 10.000 dokumen) → VECTOR MEMORY + retrieval. Jangan masukkan arsip ke prompt; ambil yang relevan saja per langkah.",
        "Skenario 4 — fakta cepat basi (kurs, harga, status) → TTL + RECENCY TINGGI. Setiap fakta bawa stempel waktu; fakta basi dihapus otomatis, bukan menunggu tertimpa.",
        "Cara membaca: tiga batang = kondisi memory pada langkah 1, 15, dan 30 tanpa strategi. Biru = instruksi, ungu = definisi tools, oranye = riwayat yang menumpuk, abu-abu = ruang kosong.",
        "Interpretasi: pada langkah 30, riwayat menelan seluruh window dan instruksi (kotak merah di atas) TERDORONG KELUAR — visualisasi persis dari insiden Arsiparis dan agen support. Tanpa ringkasan/retrieval, ini takdir setiap sesi panjang.",
        "Aturan praktis 10 detik: (1) <20 langkah → short-term cukup. (2) Sesi panjang → ringkas berkala. (3) Arsip besar → vector + retrieval. (4) Fakta basi → TTL. (5) Instruksi kritis (larangan!) → simpan TERPISAH dari riwayat yang bisa terkompresi.",
        "Skenario tambahan — agen riset proyek 2 pekan (multi-sesi, multi-topik): TIGA LAPIS PENUH. Short-term untuk sesi berjalan, ringkasan harian untuk konteks proyek (“klien X sensitif soal Y”), vector store untuk 500 dokumen sumber. Masing-masing lapis punya TTL berbeda: sesi = jam, ringkasan = hari, vector = bulan. Ingatan yang baik punya STRUKTUR WAKTU — seperti manusia: yang kemarin detail, yang bulan lalu garis besar, yang tahun lalu arsip.",
        "Ekonomi ingatan: vector store (misal Rp500 ribu/bulan untuk 1 juta vektor) vs token ringkasan (Rp150/1.000 token × dibaca tiap langkah). Untuk fakta yang dibaca 6.000× per hari: simpan di ringkasan (400 token × 6.000 × Rp150/1.000 = Rp360 ribu/hari — MAHAL!). Tunggu — justru untuk fakta super-sering, PIN di system prompt lebih murah daripada dibaca ulang? Tidak: system prompt JUGA dibayar per langkah. Pelajaran sebenarnya: tidak ada ingatan gratis; pilih lapis dengan biaya-per-baca terendah untuk frekuensi fakta itu.",
        "Skenario customer-facing: memory ANTAR-SESI = personalisasi (“nasabah ini selalu tanya KPR”). Syaratnya tiga: CONSENT eksplisit (nasabah setuju diingat), TTL (fakta kedaluwarsa otomatis), dan HAPUS (permintaan “lupakan saya” dieksekusi <24 jam). Personaliasi tanpa ketiganya bukan fitur — ia liabilitas hukum. Aturan: ingatan tentang ORANG diatur lebih ketat daripada ingatan tentang DOKUMEN.",
        "Tabel TTL (time-to-live) per jenis fakta — ingatan yang baik punya tanggal kedaluwarsa. Kurs/fakta pasar: 1 hari. Status proyek: 7 hari. Kebijakan perusahaan: 90 hari (atau sampai ada revisi). Identitas orang: sampai ada koreksi eksplisit. Preferensi: 30 hari tanpa pemakaian → arsip. Fakta tanpa TTL = fakta yang suatu hari akan basi diam-diam dan meracuni keputusan. Implementasi: setiap fakta menyimpan `berlaku_sampai`; retrieval memfilter yang kedaluwarsa OTOMATIS. Sederhana, tetapi membedakan ingatan profesional dari tumpukan catatan.",
      ],
      note: {
        title: "💡 Intuisi: ingatan agen = anggaran, bukan gudang",
        body: "Setiap fakta yang disimpan membayar “sewa” token di tiap langkah. Fakta yang 30 hari tak pernah dipakai = sewa terbuang. Lakukan audit memory berkala: fakta apa yang tak tersentuh sebulan? Arsipkan atau hapus. Agen yang pelupa tetapi terkurasi mengalahkan agen penghafal yang berantakan — dalam biaya DAN ketepatan.",
      },

      figure: {
        svg: MEM_SVG,
        alt: "Tiga batang memori: awal rapi, tengah penuh, akhir instruksi terdorong keluar.",
        caption: "Tanpa strategi, riwayat menumpuk dan mendorong instruksi keluar dari window.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: harga mengingat semuanya",
      prose: [
        "Agen support Dina memproses 200 percakapan/hari, rata-rata 30 langkah per percakapan. Tanpa ringkasan, tiap langkah membawa SELURUH riwayat: rata-rata 12.000 token per panggilan LLM. Dengan ringkasan berkala: rata-rata 2.500 token per panggilan. Harga model: Rp150 per 1.000 token.",
        "Tanpa ringkasan: 200 × 30 × 12.000 = 72.000.000 token/hari → 72.000 × Rp150 = Rp10.800.000/hari. Dengan ringkasan: 200 × 30 × 2.500 = 15.000.000 token → Rp2.250.000/hari. Hemat Rp8.550.000/hari — Rp256 juta/bulan.",
        "Tetapi ada biaya tersembunyi: ringkasan buruk yang menghilangkan \u201CRina = prioritas\u201D menyebabkan 3% percakapan salah prioritas; tiap insiden butuh 1 jam eskalasi manajer (Rp200.000). 200 × 3% = 6 insiden/hari → Rp1.200.000/hari. Total dengan ringkasan: Rp3.450.000/hari — tetap hemat Rp7,35 juta/hari dibanding tanpa ringkasan.",
        "Pembahasan: pelajaran angkanya — optimasi memory adalah optimasi BIAYA dengan risiko kualitas. Jangan hanya hitung token; hitung juga \u201Cpajak ringkasan\u201D (insiden akibat informasi hilang). Aturannya: ringkas FAKTA DERIVATIF (isi chat basi), jangan pernah ringkas FAKTA KRITIS (identitas, larangan, prioritas) — simpan yang kritis di slot terpisah yang tak terkompresi.",
        "Sensitivitas kualitas ringkasan: jika ringkasan 5.000 token (bukan 2.500 — ringkasan malas yang menyimpan narasi), biaya = 200 × 30 × 5.000 × Rp150/1.000 = Rp4,5 juta/hari. Hemat turun dari Rp8,55 juta menjadi Rp6,3 juta per hari — Rp67,5 juta per bulan HILANG karena ringkasan yang tidak disiplin. Kualitas ringkasan = uang tunai; “cukup bagus” dalam kompresi = bocor Rp67 juta/bulan.",
        "Titik impas: kapan ringkasan TIDAK worth it? Percakapan 5 langkah × 400 token = 2.000 token — muat di short-term tanpa ringkasan. Overhead membangun ringkasan (1 panggilan LLM ekstra ~1.000 token = Rp150) > penghematan (0). Aturan: ringkas hanya jika (langkah × token_rata) > 50% budget DAN sesi diprediksi berlanjut. Jangan bayar arsitektur untuk masalah yang tidak ada.",
        "Biaya vector store vs token — angka jujur. 1 juta vektor × 768 dimensi ≈ 3 GB storage ≈ Rp500 ribu/bulan (managed). Retrieval 6.000×/hari ≈ gratis (komputasi kecil). Bandingkan menyimpan 10.000 fakta di ringkasan: 10.000 × 100 token × 6.000 baca × Rp150/1.000 = Rp900 juta/hari — MUSTAHIL. Vector store bukan “alternatif”; untuk ingatan besar ia SATU-SATUNYA pilihan yang waras. Ringkasan untuk yang sering dibaca, vector untuk yang banyak jumlahnya.",
        "Skenario pesimis: ringkasan buruk dengan akurasi fakta 70% (30% fakta terdistorsi). Jika tiap keputusan salah berbiaya Rp1 juta dan 6.000 keputusan/hari × 30% = 1.800 salah: Rp1,8 miliar/hari — vs hemat token Rp8,55 juta/hari. Rasio bencana 210:1. Kualitas ringkasan BUKAN optimasi — ia adalah risk management. Evaluasi akurasi ringkasan (sampel 100, cek manual) adalah premi asuransi termurah di arsitektur ini.",
        "Tabel tiga skala ingatan. KECIL (50 fakta, dibaca tiap langkah): ringkasan 5.000 token × 6.000 baca × Rp150/1.000 = Rp4,5 juta/hari — MAHAL; solusinya PIN 10 fakta kritis (500 token) = Rp450 ribu/hari. SEDANG (10.000 fakta, dibaca sesekali): vector store Rp500 ribu/bulan + retrieval murah — JELAS menang. BESAR (1 juta fakta): vector store Rp2 juta/bulan; ringkasan MUSTAHIL (100 juta token). Pola: makin besar ingatan, makin wajib vector; makin sering dibaca, makin wajib PIN/ringkas. Tidak ada satu arsitektur untuk semua skala — ada TITIK PATAH di mana arsitektur harus berganti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di fraud monitoring, \u201Cprioritas Rina\u201D versi risk-nya adalah daftar watchlist. Jika ringkasan menghilangkan nama dari watchlist, transaksi mencurigakan lolos. Fakta kritis kepatuhan = slot memory permanen, bukan kandidat ringkasan.",
      },
    },    {
      id: "lab-recall-vektor",
      eyebrow: "Langkah 6 · Lab recall vektor",
      title: "Lab: recall top-2 dari memori vektor (Jaccard)",
      prose: [
        "Memori jangka panjang agen menyimpan 5 cuplikan. Pengguna bertanya: “berapa suku bunga BI sekarang”. Tugasmu: hitung skor Jaccard (irisan dibagi gabungan kata) tiap cuplikan terhadap query, lalu tentukan top-2 yang akan dimuat ke konteks.",
        "Perhatikan: cuplikan s1 berbagi 3 kata dengan query (“suku”, “bunga”, “BI”) dari gabungan 7 kata — skor 0,429. Cuplikan s5 berbagi 2 kata dari gabungan 8 — skor 0,25. Tiga cuplikan lain berbagi 0 kata — recall yang buruk bukan karena memorinya kosong, melainkan karena query dan cuplikan tidak berbagi kosakata.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `jaccard(a, b)` dan hitung skor tiap cuplikan" },
        { id: "t2", text: "Tentukan `top1` dan `top2` beserta skornya, lalu cetak" },
      ],
      expected: "top1=s1 skor=0.429\ntop2=s5 skor=0.250",
      note: {
        title: "💡 Intuisi",
        body: "Recall memori vektor bukan soal “apakah jawabannya tersimpan”, melainkan “apakah query dan simpanan berbagi kosakata”. Agen yang bertanya dengan kata yang berbeda dari kata saat menyimpan tidak akan menemukan apa pun — itulah kenapa ringkasan (AAI4) ditulis dengan kata-kata yang akan dipakai saat recall.",
      },
      hints: [
        "Jaccard = len(irisan) / len(gabungan).",
        "Normalisasi: lowercase + split spasi.",
        "Urutkan menurun berdasarkan skor; seri dipecah oleh urutan cuplikan.",
      ],
      code: {
        starter: `# DATA — jangan diubah
CUPLIKAN = {
    "s1": "suku bunga BI 6,25 persen",
    "s2": "IHSG 7412 naik 0,8 persen",
    "s3": "cadangan devisa turun 2 miliar dolar",
    "s4": "kurs USD IDR 16050",
    "s5": "suku bunga acuan bank sentral",
}
QUERY = "berapa suku bunga BI sekarang"

# TULIS KODEMU
def jaccard(a, b):
    ...

skor = {}
for cid, teks in CUPLIKAN.items():
    ...

peringkat = sorted(skor, key=skor.get, reverse=True)
top1, top2 = peringkat[0], peringkat[1]
print(f"top1={top1} skor={skor[top1]:.3f}")
print(f"top2={top2} skor={skor[top2]:.3f}")`,
        lockLines: 11,
        solution: `# DATA — jangan diubah
CUPLIKAN = {
    "s1": "suku bunga BI 6,25 persen",
    "s2": "IHSG 7412 naik 0,8 persen",
    "s3": "cadangan devisa turun 2 miliar dolar",
    "s4": "kurs USD IDR 16050",
    "s5": "suku bunga acuan bank sentral",
}
QUERY = "berapa suku bunga BI sekarang"

# TULIS KODEMU
def jaccard(a, b):
    sa, sb = set(a.lower().split()), set(b.lower().split())
    return len(sa & sb) / len(sa | sb)

skor = {}
for cid, teks in CUPLIKAN.items():
    skor[cid] = round(jaccard(QUERY, teks), 3)

peringkat = sorted(skor, key=skor.get, reverse=True)
top1, top2 = peringkat[0], peringkat[1]
print(f"top1={top1} skor={skor[top1]:.3f}")
print(f"top2={top2} skor={skor[top2]:.3f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "jaccard", label: "`jaccard` terdefinisi", msg: "Definisikan jaccard(a, b) = irisan / gabungan." },
          { kind: "equal", task: "t1", name: "skor", value: {"s1": 0.429, "s2": 0.0, "s3": 0.0, "s4": 0.0, "s5": 0.25}, label: "skor tiap cuplikan benar", msg: "s1: 3/7 = 0,429; s5: 2/8 = 0,25; sisanya 0." },
          { kind: "equal", task: "t2", name: "top1", value: "s1", label: "`top1` = s1", msg: "Skor tertinggi 0,429." },
          { kind: "stdout_matches", task: "t2", pattern: "top1=s1 skor=0\\.429\\ntop2=s5 skor=0\\.250", label: "output dua baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Jaccard = irisan / gabungan kata. Recall gagal bila query dan simpanan tak berbagi kosakata.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Waspadai opsi yang benar \u201Csecara umum\u201D tetapi salah untuk kasusnya.",
        "Refleksi memory: ingatan = anggaran dengan tanggal kedaluwarsa. Empat keputusan: (1) LAPIS apa? (short/vector/ringkas — sesuai skala). (2) α berapa? (kebijakan arsip vs kabar). (3) TTL berapa per jenis fakta? (4) Bagaimana KOREKSI? (sumber + tombol cabut). Empat jawaban tertulis = arsitektur memory. Tanpa tulisan = tumpukan harapan. Dan satu prinsip: fakta tentang ORANG diatur lebih ketat (consent + hapus) daripada fakta tentang DOKUMEN — selalu.",
      ],
      tasks: [],
      summary: [
        "Tiga lapis: short-term (papan tulis), ringkasan (catatan rapat), vector memory (arsip + retrieval).",
        "Window besar menunda masalah, bukan menyelesaikan — \u201Clost in the middle\u201D tetap butuh strategi.",
        "skor = α·sim + (1−α)·recency: setel α per domain; waspadai racun kebaruan.",
        "Tiga racun memory: fakta basi, konteks salah, ringkasan palsu.",
        "Fakta kritis (identitas, larangan, prioritas) disimpan terpisah — jangan pernah jadi kandidat ringkasan.",
      ],
      next: { label: "AAI5 — RAG sebagai Tool", href: "/v2/learn/aai5-rag-agent" },
      quiz: [
        {
          q: "Agen support salah prioritas karena fakta \u201CRina = Kepala Divisi\u201D terbenam di 40 pesan. Solusi PALING tepat?",
          options: [
            { text: "Pindah ke model window 4× lebih besar", why: "Menunda masalah; fakta di tengah context panjang tetap berisiko terlewat (lost in the middle).", },
            { text: "Simpan fakta kritis (identitas, prioritas) di slot terpisah yang tak terkompresi", why: "Tepat. Fakta kritis tidak boleh bersaing dengan riwayat chat untuk ruang memory.", correct: true },
            { text: "Hapus seluruh riwayat tiap 10 pesan", why: "Menghapus konteks yang mungkin masih dibutuhkan — solusi kasar.", },
            { text: "Minta pengguna mengulang identitasnya tiap pesan", why: "Beban ke pengguna; masalah arsitektur diselesaikan dengan arsitektur.", },
          ],
        },
        {
          q: "α = 0,7; query \u201Climit kartu Rina\u201D. Fakta A: sim=2, umur=1 hari. Fakta B: sim=2, umur=0 hari. Mana menang dan kenapa ini masalah?",
          options: [
            { text: "A menang — tidak ada masalah", why: "Hitung: A = 0,7×2+0,3×0,5 = 1,55; B = 0,7×2+0,3×1 = 1,70. B yang menang.", },
            { text: "B menang karena recency — berpotensi salah karena query menyebut Rina", why: "Tepat. Inilah racun kebaruan: fakta Budi menang padahal query meminta Rina.", correct: true },
            { text: "Seri — diambil acak", why: "Skornya berbeda (1,55 vs 1,70), tidak seri.", },
            { text: "Keduanya ditolak", why: "Retrieval mengambil skor tertinggi, bukan menolak.", },
          ],
        },
        {
          q: "Arsip 10.000 SOP, diambil seperlunya tiap langkah. Strategi memory?",
          options: [
            { text: "Masukkan semua SOP ke prompt sistem", why: "Tidak muat di window mana pun dan mahal luar biasa.", },
            { text: "Vector memory + retrieval selektif", why: "Tepat. Arsip besar = ambil yang relevan saja per langkah.", correct: true },
            { text: "Hafalkan lewat fine-tuning tiap pekan", why: "Mahal, lambat, dan fakta tetap bisa basi.", },
            { text: "Short-term saja, pengguna akan mengulang", why: "Tidak realistis untuk arsip sebesar itu.", },
          ],
        },
        {
          q: "Apa itu \u201Cringkasan palsu\u201D sebagai racun memory?",
          options: [
            { text: "Ringkasan yang terlalu panjang", why: "Panjang bukan masalahnya — hilangnya detail kritis yang masalah.", },
            { text: "Detail kritis hilang saat kompresi sehingga agen percaya versi yang salah", why: "Tepat. Contoh: larangan \u201Cjangan buka NASABAH\u201D lenyap dari ringkasan.", correct: true },
            { text: "Ringkasan dalam bahasa asing", why: "Bukan definisi racun memory.", },
            { text: "Ringkasan yang tidak disimpan", why: "Itu bukan ringkasan sama sekali.", },
          ],
        },
        {
          q: "Kapan recency sebaiknya diberi bobot TINGGI (α kecil)?",
          options: [
            { text: "Data identitas pengguna", why: "Identitas stabil — butuh α tinggi (kemiripan), bukan recency.", },
            { text: "Harga pasar / kurs / status terkini", why: "Tepat. Fakta cepat basi: yang kemarin lebih benar daripada yang mirip tetapi sebulan lalu.", correct: true },
            { text: "Aturan kepatuhan perusahaan", why: "Aturan stabil — kemiripan lebih penting dari kebaruan.", },
            { text: "Definisi istilah teknis", why: "Definisi tidak basi — α tinggi.", },
          ],
        },
        {
          q: "Query “berapa suku bunga BI sekarang” vs cuplikan “suku bunga BI 6,25 persen”. Skor Jaccard-nya?",
          options: [
            { text: "0,429 — irisan 3 kata dibagi gabungan 7 kata", why: "Benar: irisan {suku, bunga, BI} = 3; gabungan 5 + 5 − 3 = 7; 3/7 = 0,429.", correct: true },
            { text: "0,6 — 3 dari 5 kata query", why: "Itu recall sepihak, bukan Jaccard — penyebutnya gabungan, bukan query saja.", },
            { text: "0,5 — 3 dari 6 kata cuplikan", why: "Itu juga sepihak — Jaccard memakai gabungan kedua himpunan.", },
            { text: "1,0 — semua kata query ada di cuplikan", why: "Salah: “berapa” dan “sekarang” tidak ada di cuplikan.", },
          ],
        },
        {
          q: "Kenapa ringkasan memori harus ditulis dengan kata-kata yang akan dipakai saat recall?",
          options: [
            { text: "Agar ringkasannya pendek", why: "Panjang bukan intinya — kecocokan kosakata yang menentukan recall.", },
            { text: "Karena recall berbasis kesamaan kata: ringkasan dengan kosakata berbeda tidak akan ditemukan query", why: "Benar: recall gagal bukan karena memorinya kosong, melainkan karena query dan simpanan tidak berbagi kosakata.", correct: true },
            { text: "Agar model lebih cepat membaca", why: "Kecepatan bukan soal ini — keteremuan yang dipertaruhkan.", },
            { text: "Tidak perlu — embedding memahami semua sinonim", why: "Embedding membantu, tetapi tidak sempurna — kosakata yang sama tetap jauh lebih mudah ditemukan.", },
          ],
        },
      ],
    },
  ],
};
