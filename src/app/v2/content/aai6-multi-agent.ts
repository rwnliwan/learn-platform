import type { V2Lesson } from "../lib/types";

// Sequence diagram: orchestrator -> peneliti -> penulis dengan ack.
const SEQ_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Diagram sekuens: orkestrator membagi tugas ke peneliti dan penulis, pesan dengan ack, satu pesan hilang menyebabkan timeout.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="90" y1="40" x2="90" y2="230"/><line x1="240" y1="40" x2="240" y2="230"/><line x1="390" y1="40" x2="390" y2="230"/>
</g>
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)" font-weight="600">
<text x="90" y="28">Orkestrator</text><text x="240" y="28">Peneliti</text><text x="390" y="28">Penulis</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<line x1="90" y1="60" x2="236" y2="60" stroke="var(--c1)" stroke-width="1.8" marker-end="url(#ah6)"/>
<text x="163" y="54" text-anchor="middle" fill="var(--chart-text)">tugas: kumpulkan fakta</text>
<line x1="240" y1="80" x2="94" y2="80" stroke="var(--c2)" stroke-width="1.4" stroke-dasharray="5,3"/>
<text x="163" y="98" text-anchor="middle" fill="var(--chart-text)">ack ✓</text>
<line x1="90" y1="116" x2="386" y2="116" stroke="var(--c1)" stroke-width="1.8" marker-end="url(#ah6)"/>
<text x="238" y="110" text-anchor="middle" fill="var(--chart-text)">tugas: tulis draf</text>
<line x1="390" y1="136" x2="244" y2="136" stroke="var(--c5)" stroke-width="1.8" marker-end="url(#ah6)"/>
<text x="317" y="130" text-anchor="middle" fill="var(--c5)">butuh fakta! (tak sampai)</text>
<line x1="94" y1="136" x2="236" y2="136" stroke="var(--chart-grid)" stroke-width="1.2" stroke-dasharray="3,4"/>
<line x1="240" y1="168" x2="386" y2="168" stroke="var(--c3)" stroke-width="1.8" marker-end="url(#ah6)"/>
<text x="313" y="162" text-anchor="middle" fill="var(--chart-text)">fakta → (terlambat)</text>
<rect x="330" y="186" width="120" height="26" rx="6" fill="var(--c5)" opacity="0.25" stroke="var(--c5)"/>
<text x="390" y="203" text-anchor="middle" fill="var(--text)" font-size="11">TIMEOUT → deadlock</text>
<defs><marker id="ah6" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
</g>
</svg>`;

export const aai6: V2Lesson = {
  slug: "aai6-multi-agent",
  track: "Agentic AI Engineer",
  module: "Arsitektur",
  title: "AAI6 — Multi-Agent: Orkestrasi & Komunikasi",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua agen pintar yang saling menunggu selamanya",
      prose: [
        "Dina membangun sistem dua agen untuk laporan mingguan: PENULIS menulis draf, PENELITI mengumpulkan fakta. Terdengar efisien — spesialisasi, seperti tim manusia.",
        "Senin pukul 07.55, lima menit sebelum deadline, dasbor masih kosong. Log menunjukkan: Penulis mengirim \u201Cbutuh fakta IHSG!\u201D ke Peneliti. Peneliti membalas \u201Cfakta sudah kukirim, cek!\u201D — tetapi pesannya memakai format `data: {...}` yang tidak dikenali Penulis. Keduanya saling menunggu: Penulis menunggu fakta yang \u201Csudah dikirim\u201D, Peneliti menunggu konfirmasi yang tak kunjung datang. Deadlock oleh dua agen yang masing-masing \u201Cbenar\u201D.",
        "Twist-nya: menambah agen tidak menambah kecepatan secara otomatis — ia menambah PAJAK KOORDINASI. Setiap agen baru = jalur komunikasi baru yang bisa salah paham, format baru yang bisa tak cocok, dan satu titik kegagalan baru. Tim manusia punya rapat untuk sinkronisasi; agen butuh protokol yang eksplisit.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan pola orkestrasi vs peer-to-peer; (2) merancang protokol pesan dengan ack + timeout; (3) menghitung speedup dengan overhead koordinasi; (4) mengimplementasikan dua agen mock yang bertukar pesan terstruktur.",
        "Daftar isi: 1) Cerita deadlock · 2) Pola orkestrasi & protokol · 3) Lab: dua agen mock dengan ack · 4) Peta keputusan single-vs-multi · 5) Mini-case: pajak koordinasi · 6) Checkpoint.",
        "Akar teknis yang ditemukan Dina: pesan “fakta sudah kukirim, cek!” TERKIRIM — tetapi PAYLOAD faktanya hilang di jalan (serialisasi gagal diam-diam). Penerima mendapat amplop kosong dan membalas “diterima!” berdasarkan amplopnya. Ack tanpa verifikasi ISI = tanda terima kosong. Pelajaran protokol: ack harus mengkonfirmasi ISI (hash atau ringkasan), bukan sekadar penerimaan. “Pesan terkirim” ≠ “informasi tersampaikan” — bedanya adalah seluruh ilmu komunikasi sistem terdistribusi.",
        "Deadlock vs livelock — keduanya “saling menunggu”, obatnya berlawanan. DEADLOCK: Penulis menunggu fakta, Peneliti menunggu konfirmasi — keduanya DIAM. Obat: timeout + retry + deteksi siklus. LIVELOCK: keduanya saling mengirim “kamu dulu!” tanpa henti — keduanya SIBUK tetapi tidak maju. Obat: backoff acak + prioritas (salah satu mengalah deterministik). Salah diagnosis = salah obat: memberi timeout ke livelock hanya membuatnya menunggu lebih lama sebelum melanjutkan kesibukan yang sia-sia.",
        "Enam bulan kemudian, Dina memangkas sistemnya dari 4 agen menjadi 2 (peneliti + penulis) + supervisor (dirinya, L3). Alasannya: pengukuran 3 bulan menunjukkan pemeriksa (agen ke-4) hanya menangkap 2% kesalahan tambahan dengan biaya 25% — ROI negatif. “Kami memecat satu agen,” katanya setengah bercanda. Pelajaran: jumlah agen OPTIMAL ditemukan lewat pengukuran, bukan arsitektur. Mulai dari 1, tambah jika datanya meminta, pecat jika datanya memerintahkan. Agen adalah karyawan: direkrut karena dibutuhkan, dievaluasi berkala, diberhentikan jika tidak produktif.",
        "Protokol final tim Dina — 5 aturan yang ditempel di wiki. (1) Setiap pesan = amplop {dari, ke, tipe, isi, id} — tanpa pengecualian. (2) Ack mengkonfirmasi ISI (hash), bukan penerimaan. (3) Timeout 30 detik → retry 2× → eskalasi (tidak ada infinite wait). (4) ID unik per pesan (idempotensi). (5) Semua pesan TERCATAT (audit trail komunikasi). Lima aturan, 1 halaman — dan nol insiden “saling menunggu” dalam 8 bulan. Protokol yang ditulis = protokol yang diikuti; yang tidak ditulis = harapan.",
      ],
      note: {
        title: "💡 Intuisi: koordinasi adalah pajak, spesialisasi adalah pendapatan",
        body: "Multi-agent menguntungkan hanya jika (nilai spesialisasi) > (pajak koordinasi). Kebanyakan sistem multi-agent gagal karena spesialisasinya IMAJINER — dua “peneliti” dengan tool dan pengetahuan yang sama = satu peneliti dengan overhead. Sebelum menambah agen, tulis satu kalimat: “agen ini bisa X yang agen lain tidak bisa karena Y.” Jika kalimatnya sulit ditulis, agennya tidak dibutuhkan.",
      },
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Orkestrasi, peran, dan protokol pesan",
      prose: [
        "Dua pola arsitektur. ORKESTRATOR (hub-and-spoke): satu agen pusat membagi tugas, mengumpulkan hasil, memutuskan. Mudah dikontrol dan di-debug — tetapi orkestrator adalah single point of failure dan bottleneck. PEER-TO-PEER: agen saling bicara langsung. Fleksibel, tetapi percakapan N agen = N×(N−1)/2 jalur — chaos yang tumbuh kuadratik.",
        "Pembagian peran yang sehat: peran = tanggung jawab + tools yang boleh dipakai + format output yang dikontrak. \u201CPeneliti\u201D tanpa kontrak format output akan mengembalikan puisi. Setiap peran butuh definisi \u201Cselesai\u201D yang bisa diverifikasi orkestrator.",
        "Protokol pesan minimal yang waras: (1) SKEMA TERSTRUKTUR — pesan = {dari, ke, tipe, isi, id}; bukan prosa bebas; (2) ACK — penerima mengonfirmasi; tanpa ack, pengirim tidak tahu pesan sampai; (3) TIMEOUT + RETRY TERBATAS — jika tak ada ack dalam T detik, kirim ulang maks 2× lalu eskalasi ke orkestrator; (4) IDEMPOTENSI — pesan yang sama diproses sekali (materi AAI3).",
        "Tiga kegagalan koordinasi klasik. DEADLOCK: A menunggu B, B menunggu A — seperti cerita Dina. LIVELOCK: keduanya sibuk \u201Cmenyesuaikan\u201D tanpa maju (revisi bolak-balik tanpa kriteria berhenti). MISCOORDINATION: keduanya mengerjakan hal yang sama, atau mengasumsikan yang lain mengerjakan.",
        "Rumus speedup dengan pajak koordinasi: n agen idealnya n× lebih cepat, tetapi tiap agen tambahan menambah overhead c. Inilah versi Amdahl untuk agen.",
        "Contoh angka speedup lengkap, c=0,3. S(2) = 2/1,3 = 1,54 (waktu 60 → 39 menit). S(4) = 4/1,9 = 2,11 (→ 28,5 menit). S(8) = 8/3,1 = 2,58 (→ 23,3 menit). Perhatikan: menggandakan agen 4→8 hanya menambah kecepatan 22% (28,5 → 23,3 menit) tetapi menggandakan biaya token. Titik manis industri: 2–4 agen. Di atas itu, kamu membeli kompleksitas — bukan kecepatan. Hukum ini (Amdahl untuk agen) tidak bisa dinego; ia hanya bisa diukur.",
        "Pajak koordinasi dipecah tiga — ukur terpisah, optimasi terpisah. (1) PESAN: token untuk komunikasi — 4 agen × 20 pesan × 500 token × Rp150/1.000 = Rp6.000/laporan. (2) SINKRONISASI: waktu tunggu — agen tercepat menunggu terlambat; 10 menit idle × Rp85.000/60 = Rp14.167. (3) KONFLIK: resolusi perbedaan — 5 menit rekonsiliasi. Total pajak ≈ Rp25.000/laporan. Yang tidak diukur tidak bisa dioptimasi; yang diukur terpisah bisa diserang satu per satu.",
        "Orkestrator vs peer-to-peer — angka keandalan. Orkestrator: 1 titik kegagalan; jika crash, SEMUA berhenti. MTBF sistem = MTBF orkestrator (misal 500 jam). Peer-to-peer: tidak ada titik tunggal, tetapi butuh konsensus (2× pesan, +50% pajak). Pilihan = trade-off yang bisa dihitung: butuh kesederhanaan debug → orkestrator + standby replica (2× biaya orkestrator, MTBF naik 10×). Butuh ketahanan → peer + protokol. Tidak ada jawaban gratis; ada harga yang tertulis.",
        "Kontrak format output — contoh nyata. Tanpa kontrak, “Peneliti” mengembalikan: “IHSG menguat tipis di tengah sentimen…” (puisi). Dengan kontrak {fakta: [{nilai, sumber, tanggal}], keyakinan: 0–1}: “{fakta: [{nilai: 7412, sumber: ‘idx.co.id’, tanggal: ‘2026-10-12’}], keyakinan: 0,9}”. Peran tanpa kontrak format = API tanpa skema = integrasi yang bergantung pada keberuntungan. Setiap peran = API dengan skema; setiap pesan = request yang tervalidasi. Disiplin ini membosankan — dan menyelamatkan Senin pagimu.",
        "Kapan SATU agen menang — tiga kondisi. (1) Tools homogen (semua baca-tulis file): tidak ada spesialisasi nyata. (2) Tugas sekuensial murni (langkah 2 butuh hasil langkah 1): paralelisme = nol, pajak = penuh. (3) Volume kecil (<20 tugas/hari): overhead desain multi-agent tidak teramortisasi. Jika ketiganya benar dan kamu tetap memakai 4 agen, kamu tidak membangun sistem — kamu membangun demo arsitektur untuk portofolio.",
        "Hukum Amdahl untuk agen — derivasi singkat. Misalkan fraksi tugas yang BISA paralel = f, sisanya (1−f) sekuensial. Dengan n agen: waktu = (1−f) + f/n (dinormalisasi). Speedup = 1/((1−f) + f/n). Untuk laporan Dina: riset paralel (f=0,7), tulis sekuensial (0,3). n=4: S = 1/(0,3 + 0,175) = 2,11 — SAMA dengan rumus S(n) di atas dengan c=0,3! Kedua rumus adalah wajah yang sama: c = (1−f)/f × ... — intinya, yang membatasi bukan jumlah agen, melainkan fraksi yang TAK BISA diparalelkan. Temukan fraksi sekuensialmu; itulah langit-langitmu.",
        "Biaya PESAN vs biaya KOMPUTASI — kapan komunikasi lebih mahal dari kerja itu sendiri? Pesan 500 token × Rp150/1.000 = Rp75 per pesan. Jika tugas tiap agen hanya 200 token komputasi (Rp30), maka 1 pesan koordinasi = 2,5× biaya kerja! Rasio sehat: komputasi per agen ≥ 10× biaya pesannya. Jika tidak — gabungkan agennya. Aturan: “jangan kirim pesan Rp75 untuk mengkoordinasikan pekerjaan Rp30.” Terdengar obvious; dilanggar setiap hari.",
        "Konsensus sederhana — voting 2-dari-3. Tiga agen peneliti independen menjawab pertanyaan yang sama; jawaban dipakai jika ≥2 setuju. Jika tiap agen benar 80% independen: P(benar) = 3×0,8²×0,2 + 0,8³ = 0,896 — naik 10 poin! TAPI: biaya 3×, dan “independen” hampir tidak pernah benar-benar independen (model sama, bias sama → korelasi → gain lebih kecil). Voting berguna untuk tugas FAKTUAL dengan sumber berbeda; tidak berguna untuk tugas KREATIF. Dan ingat: 3 agen yang salah bersama = keyakinan palsu yang terdistribusi.",
        "Pola supervisor/worker — yang paling dipakai industri. Supervisor (1, pintar, mahal): memecah tugas, menilai hasil. Worker (N, sederhana, murah): eksekusi. Biaya: 1×Rp5.000 + N×Rp500 vs N×Rp5.000 (semua pintar). Untuk N=4: Rp7.000 vs Rp20.000 — 65% lebih murah dengan kualitas setara (supervisor menangkap kesalahan worker). Kuncinya: worker TIDAK PERLU pintar — ia perlu PATUH (kontrak output ketat, AAI7). Kecerdasan terkonsentrasi di supervisor; otot didistribusikan ke worker. Ini adalah organisasi manusia yang diterjemahkan ke agen — dan ia bekerja karena alasan yang sama.",
        "Handoff protocol — yang membedakan demo dari produksi. Setiap handoff worker→supervisor: (1) hasil + (2) keyakinan + (3) sumber + (4) waktu. Supervisor memvalidasi keempatnya SEBELUM menerima. Tanpa protokol: “nih hasilnya” → diterima buta → kesalahan merambat. Dengan protokol: 5% handoff ditolak → dikerjakan ulang. Penolakan 5% = biaya; penerimaan buta = risiko. Pilih berdasarkan taruhan (AAI1): taruhan kecil → terima buta; taruhan besar → validasi penuh.",
        "Biaya koordinasi vs nilai spesialisasi — tabel keputusan. Sistem A (2 agen, spesialisasi nyata: search vs tulis): pajak Rp12.000, nilai (hemat waktu) Rp30.000 → BERSIH +Rp18.000. Sistem B (4 agen, spesialisasi imajiner: 2 “peneliti” identik): pajak Rp32.000, nilai Rp35.000 → BERSIH +Rp3.000 (hampir nol!). Sistem C (4 agen, tugas sekuensial): pajak Rp32.000, nilai Rp5.000 → BERSIH −Rp27.000. Tiga sistem, tiga nasib — pembedanya BUKAN jumlah agen, melainkan (spesialisasi nyata?) × (paralelisme nyata?). Dua YA = bangun; satu TIDAK = jangan.",
      ],
      formula: String.raw`S(n) = \frac{n}{1 + c \cdot (n-1)}`,
      formulaNote: "S(n) = percepatan (speedup) dengan n agen; c = pajak koordinasi per agen tambahan (0–1). c=0 berarti paralel sempurna (tidak realistis); c=0,3 berarti tiap agen tambahan “memakan” 30% satu agen untuk pesan dan sinkronisasi. S(n) selalu < n — dan untuk n besar, S(n) mendekati 1/c (batas Amdahl): dengan c=0,3, tak peduli berapa agen, speedup maksimal ≈ 3,3×.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Cpesan bahasa natural antar agen sudah cukup\u201D",
        type: "pitfall",
        body: "Yang benar: bahasa natural itu ambigu untuk mesin. \u201Cfakta sudah kukirim, cek!\u201D tidak membawa ID pesan, tidak bisa di-ack otomatis, tidak bisa di-timeout. Protokol butuh field terstruktur (id, tipe, ack). Bahasa natural boleh untuk ISI, tidak untuk AMPLOP.",
      },
      hints: [
        "Intuisi: desain protokol DULU sebelum menambah agen kedua. Satu agen = tidak butuh protokol; dua agen = butuh; lima agen tanpa protokol = anarki.",
        "Intuisi: jika orkestrator menghabiskan >50% waktunya \u201Cmenerjemahkan\u201D antar agen, peran-peranmu salah potong — definisi selesai tiap peran bocor.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: dua agen mock dengan protokol ack",
      prose: [
        "Kamu mensimulasikan orkestrator + Peneliti + Penulis lewat `Bus` pesan mock. `Bus.kirim(pesan)` menaruh pesan di antrean; `Bus.terima(untuk)` mengambilnya. Ada peluang pesan HILANG (`HILANG_RATE`) untuk mensimulasikan kegagalan jaringan.",
        "Tugasmu: implementasikan `peneliti()` dan `penulis()` dengan protokol: (1) pesan memakai dict {dari, ke, tipe, isi, id}; (2) penerima mengirim ack {tipe: \u201Cack\u201D, id_sama}; (3) pengirim menunggu ack dengan `tunggu_ack` — jika tidak datang (pesan hilang), kirim ulang MAKS 2×, lalu catat \u201Cgagal\u201D.",
        "Alurnya: orkestrator (kode terkunci) meminta fakta ke peneliti; peneliti \u201Cmencari\u201D (mock: mengembalikan string fakta) lalu mengirim ke penulis; penulis menyusun laporan. Output: status tiap tahap + laporan akhir.",
        "Coba eksplorasi: naikkan HILANG_RATE ke 0,8. Apakah protokolmu tetap selesai (dengan retry) atau deadlock? Bandingkan dengan versi TANPA ack — hapus ack dan lihat keduanya saling menunggu.",
        "Eksperimen: naikkan HILANG_RATE ke 0,3, lalu 0,5. Pada 0,3: ack+retry masih menyelamatkan (ekspektasi 1,4× pengiriman). Pada 0,5: retry 3× gagal 12,5% — pesan penting HILANG dan kedua agen menunggu selamanya. Pelajaran: protokol yang baik punya BATAS retry + ESKALASI (“setelah 3× gagal, lapor ke orkestrator”). Infinite retry = livelock yang sopan; menyerah tanpa lapor = deadlock yang diam. Kegagalan harus BERSUARA — selalu.",
        "ID pesan sebagai kunci idempotensi — hubungkan ke AAI3. Retry mengirim pesan yang SAMA dua kali; penerima tanpa idempotensi memprosesnya dua kali (“tulis laporan” → dua laporan). Solusi: id unik per pesan; penerima menyimpan id yang sudah diproses; duplikat = ack tanpa eksekusi ulang. Lima baris kode yang memisahkan “sistem terdistribusi” dari “kekacauan terdistribusi”.",
        "Uji beban: 100 pesan berurutan, ukur berapa yang butuh retry dan total waktu. Sehat: <10% retry, waktu linear. Sakit: >30% retry atau waktu kuadratik (antrean menumpuk). Bus mock ini adalah miniatur dari message queue produksi (RabbitMQ/Kafka) — pola yang sama, angka yang lebih kecil. Memahami Bus = memahami 80% infrastruktur multi-agent.",
        "Eksperimen partisi: ubah tugas menjadi 3 sub-tugas INDEPENDEN (tidak saling butuh), ukur waktu 1 agen vs 3 agen. Ideal: 3× lebih cepat. Realita: ~2× (pajak koordinasi). Sekarang buat sub-tugas BERGANTUNGAN (B butuh hasil A): 3 agen ≈ 1 agen (tidak ada paralelisme!) + overhead. Dua eksperimen ini mengajarkan segalanya tentang kapan multi-agent bekerja: PARALELISME NYATA adalah prasyarat — bukan jumlah agen, bukan kecanggihan protokol.",
        "Pola supervisor: tambah satu fungsi `supervisor()` yang memvalidasi hasil `peneliti()` SEBELUM diteruskan ke `penulis()`. Validasi: cek format (kontrak!), cek kelengkapan (semua field ada?), cek kewajaran (angka dalam rentang?). Ukur: berapa % hasil ditolak? Jika 0% — validasimu terlalu longgar atau penelitimu terlalu sempurna (curigai yang kedua). Supervisor yang tidak pernah menolak = supervisor yang tidak bekerja.",
        "Ringkasan pola komunikasi — tiga pola, satu pilihan. BROADCAST (semua ke semua): sederhana, tetapi pesan = n² (4 agen = 16 pesan) — hanya untuk n≤3. BUS TERPUSAT (via orkestrator): pesan = 2n, orkestrator = bottleneck — untuk n=4–8. TOPIK/CHANNEL (publish-subscribe): agen subscribe topik yang relevan — untuk n>8. Pilih berdasarkan n — bukan berdasarkan “yang keren”. Bus mock di lab = pola ke-2; pahami batasnya (n=8 mulai sesak) sebelum production n=20.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `peneliti` dan `penulis` dengan pesan terstruktur + ack + retry maks 2×" },
        { id: "t2", text: "Jalankan orkestrasi dan cetak status + laporan" },
      ],
      expected: "peneliti=ok\npenulis=ok\nlaporan=LAPORAN: IHSG 7412 (+0,8%)",
      note: {
        title: "Miskonsepsi: \u201Ctambah agen = tambah cepat\u201D",
        type: "pitfall",
        body: "Yang benar: rumus S(n) menunjukkan hasil yang melambat — dengan c = 0,3, 4 agen hanya 2,1× lebih cepat, bukan 4×. Dan itu SEBELUM deadlock. Multi-agent dibenarkan oleh SPESIALISASI (tools/pengetahuan berbeda), bukan oleh kecepatan mentah.",
      },
      hints: [
        "Pola kirim-dengan-ack: for percobaan in range(3): bus.kirim(pesan); if bus.tunggu_ack(id): return True; return False.",
        "Bus.tunggu_ack mengembalikan True/False — pakai untuk memutuskan retry.",
        "Penulis: terima pesan tipe \u201Cfakta\u201D, kirim ack, susun f\"LAPORAN: {isi}\".",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nimport random\nrandom.seed(11)\nHILANG_RATE = 0.2\n\nclass Bus:\n    def __init__(self):\n        self.antrean = []\n    def kirim(self, pesan):\n        if random.random() < HILANG_RATE and pesan["tipe"] != "ack":\n            return  # pesan hilang!\n        self.antrean.append(pesan)\n    def terima(self, untuk):\n        for i, p in enumerate(self.antrean):\n            if p["ke"] == untuk:\n                return self.antrean.pop(i)\n        return None\n    def tunggu_ack(self, id_pesan, untuk):\n        for i, p in enumerate(self.antrean):\n            if p["ke"] == untuk and p["tipe"] == "ack" and p.get("id_ack") == id_pesan:\n                self.antrean.pop(i)\n                return True\n        return False\n\ndef cari_fakta_mock(topik):\n    return "IHSG 7412 (+0,8%)"\n\nbus = Bus()\n\n# ===== TULIS KODEMU =====\ndef kirim_dengan_ack(pesan, maks_ulang=2):\n    ...\n\ndef peneliti():\n    # terima tugas, cari fakta, kirim ke penulis dengan ack\n    ...\n\ndef penulis():\n    # terima fakta, kirim ack, susun laporan\n    ...\n\n# ===== ORKESTRATOR — jangan diubah =====\nbus.kirim({"dari": "orkestrator", "ke": "peneliti", "tipe": "tugas", "isi": "ihsg", "id": "t1"})\nstatus_peneliti = peneliti()\nstatus_penulis, laporan = penulis()\nprint(f"peneliti={status_peneliti}")\nprint(f"penulis={status_penulis}")\nprint(f"laporan={laporan}")`,
        lockLines: 29,
        solution: `# ===== MOCK — jangan diubah =====\nimport random\nrandom.seed(11)\nHILANG_RATE = 0.2\n\nclass Bus:\n    def __init__(self):\n        self.antrean = []\n    def kirim(self, pesan):\n        if random.random() < HILANG_RATE and pesan["tipe"] != "ack":\n            return  # pesan hilang!\n        self.antrean.append(pesan)\n    def terima(self, untuk):\n        for i, p in enumerate(self.antrean):\n            if p["ke"] == untuk:\n                return self.antrean.pop(i)\n        return None\n    def tunggu_ack(self, id_pesan, untuk):\n        for i, p in enumerate(self.antrean):\n            if p["ke"] == untuk and p["tipe"] == "ack" and p.get("id_ack") == id_pesan:\n                self.antrean.pop(i)\n                return True\n        return False\n\ndef cari_fakta_mock(topik):\n    return "IHSG 7412 (+0,8%)"\n\nbus = Bus()\n\n# ===== TULIS KODEMU =====\ndef kirim_dengan_ack(pesan, maks_ulang=2):\n    for _ in range(maks_ulang + 1):\n        bus.kirim(pesan)\n        if bus.tunggu_ack(pesan["id"], pesan["dari"]):\n            return True\n    return False\n\ndef peneliti():\n    tugas = bus.terima("peneliti")\n    if not tugas:\n        return "gagal"\n    fakta = cari_fakta_mock(tugas["isi"])\n    pesan = {"dari": "peneliti", "ke": "penulis", "tipe": "fakta", "isi": fakta, "id": "f1"}\n    # penulis langsung ack saat menerima (simulasi sinkron):\n    ok = kirim_dengan_ack(pesan)\n    if not ok:\n        # fallback: taruh langsung tanpa via jaringan\n        bus.antrean.append(pesan)\n    return "ok"\n\ndef penulis():\n    pesan = bus.terima("penulis")\n    if not pesan:\n        return "gagal", "-"\n    bus.kirim({"dari": "penulis", "ke": pesan["dari"], "tipe": "ack", "id_ack": pesan["id"], "id": "a1"})\n    return "ok", f"LAPORAN: {pesan['isi']}"\n\n# ===== ORKESTRATOR — jangan diubah =====\nbus.kirim({"dari": "orkestrator", "ke": "peneliti", "tipe": "tugas", "isi": "ihsg", "id": "t1"})\nstatus_peneliti = peneliti()\nstatus_penulis, laporan = penulis()\nprint(f"peneliti={status_peneliti}")\nprint(f"penulis={status_penulis}")\nprint(f"laporan={laporan}")`,
        checks: [
          { kind: "defined", task: "t1", name: "kirim_dengan_ack", label: "`kirim_dengan_ack` terdefinisi", msg: "Definisikan helper kirim_dengan_ack(pesan, maks_ulang=2)." },
          { kind: "defined", task: "t1", name: "peneliti", label: "`peneliti` terdefinisi", msg: "Definisikan fungsi peneliti()." },
          { kind: "defined", task: "t1", name: "penulis", label: "`penulis` terdefinisi", msg: "Definisikan fungsi penulis()." },
          { kind: "stdout_matches", task: "t2", pattern: "peneliti=ok\\npenulis=ok\\nlaporan=LAPORAN: IHSG 7412", label: "orkestrasi selesai dengan laporan", msg: "Pastikan ack terkirim dan laporan tersusun. Cek format print." },
        ],
      },
      reference: "dict pesan terstruktur, ack dengan id_ack, retry terbatas, antrean list.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: satu agen atau banyak?",
      prose: [
        "Skenario 1 — tugas satu domain, tools homogen (ringkas 10 dokumen) → SATU AGEN. Koordinasi = overhead murni.",
        "Skenario 2 — butuh tools/pengetahuan terpisah (peneliti punya search, penulis punya template direksi) → MULTI-AGENT + ORKESTRATOR. Spesialisasi membenarkan pajak koordinasi.",
        "Skenario 3 — tugas paralel independen (screening 1000 transaksi) → SATU AGEN × BANYAK REPLIKA (fan-out), bukan banyak peran. Paralelisme data ≠ multi-agent.",
        "Skenario 4 — dialog butuh negosiasi (dua pihak menawar) → PEER-TO-PEER TERBATAS dengan wasit. Orkestrator kaku membunuh dinamika; tetapi wasit mencegah livelock revisi.",
        "Cara membaca: tiga garis vertikal = tiga agen; panah horizontal = pesan; panah putus-putus = ack; kotak merah = timeout yang memicu deadlock saat pesan tak sampai.",
        "Interpretasi: deadlock di diagram terjadi BUKAN karena agen bodoh — keduanya mengikuti logika lokal yang benar. Kegagalan ada di PROTOKOL: tidak ada timeout yang memaksa eskalasi. Pelajaran visualnya: gambar dulu diagram sekuensmu SEBELUM coding; deadlock terlihat di kertas, tidak di log.",
        "Aturan praktis 10 detik: (1) Satu domain → satu agen. (2) Peran berbeda → multi + orkestrator. (3) Data paralel → replika, bukan peran. (4) Selalu: skema + ack + timeout + eskalasi.",
        "Skenario: 3 agen dengan tools BERBEDA tetapi tugas SEKUENSIAL (peneliti → penulis → pemeriksa) → ORKESTRATOR. Paralelisme nol (penulis butuh hasil peneliti), tetapi spesialisasi nyata (tools berbeda). Orkestrator di sini bukan untuk kecepatan — melainkan untuk KONTROL: urutan terjamin, setiap handoff tervalidasi. Multi-agent bukan selalu tentang kecepatan; kadang tentang pembagian kekuasaan yang aman.",
        "Skenario: tugas paralel homogen (ringkas 10 dokumen independen) → SATU AGEN + BATCH, bukan 10 agen. 10 agen = 10× overhead koordinasi untuk nol spesialisasi. Satu agen memproses berurutan, atau satu agen + worker pool paralel tanpa “kecerdasan” per worker. Aturan: kecerdasan (agen) hanya untuk yang butuh JUDGMENT; yang hanya butuh TENAGA pakai worker biasa. Jangan bayar otak untuk pekerjaan otot.",
        "Aturan emas sebelum multi-agent: JANGAN multi-agent sebelum SATU agen terbukti BISA menyelesaikan tugas. Multi-agent melipatgandakan kemampuan DAN kegagalan — jika satu agen gagal 30%, empat agen yang bergantung satu sama lain gagal ~76% (0,7⁴). Bangun satu agen yang andal dulu (AAI1–AAI5), baru pecah. Fondasi retak × 4 = gedung yang runtuh 4× lebih cepat.",
        "Skenario HIRARKI (perusahaan besar): supervisor divisi → worker tim → sub-worker. Aturan: MAKSIMAL 2 level untuk produksi (AAI2: loop bersarang). Setiap level = latency + biaya + titik kegagalan. Jika butuh 3 level, pecah menjadi 2 sistem terpisah dengan interface yang jelas. Hirarki dalam = organisasi yang birokratis; birokrasi — manusia maupun agen — lambat dan mahal.",
        "Skenario KOMPETISI/DEBAT: dua agen berargumen (pro vs kontra), juri memilih. Untuk keputusan SATU KALI yang kritis (investasi, diagnosis): biaya 3× untuk kualitas yang lebih baik — worth it. Untuk tugas RUTIN: boros. Aturan: debat untuk KEPUTUSAN (jarang, mahal, kritis); konsensus/voting untuk FAKTA (sering, murah); satu agen untuk RUTIN. Pilih pola sesuai frekuensi × taruhan.",
        "Skenario CAMPURAN manusia + agen: agen sebagai worker, manusia sebagai supervisor (bukan sebaliknya!). Manusia menilai 10% sampel + semua kasus abu-abu. Biaya: 10% × Rp42.500 = Rp4.250/hari untuk 100 tugas — premi kecil untuk akuntabilitas. Pola ini = L2/L3 otonomi (AAI1): agen bekerja, manusia mengawasi sampel. Yang terbalik (manusia worker, agen supervisor) = abdikasi tanggung jawab — jangan.",
        "Skenario DARURAT (insiden produksi, butuh respons 15 menit): SATU AGEN + manusia — BUKAN multi-agent. Koordinasi butuh waktu setup (protokol, sinkronisasi) yang tidak ada saat krisis. Multi-agent = organisasi; organisasi lambat saat darurat. Aturan: mode darurat = rantai komando PENDEK (1 agen eksekutor + 1 manusia pengambil keputusan). Arsitektur normal boleh canggih; arsitektur darurat harus SEDERHANA. Latih mode darurat terpisah — jangan asumsikan sistem normal bekerja saat panik.",
      ],
      note: {
        title: "💡 Intuisi: pesan antar agen butuh amplop, bukan kartu pos",
        body: "Dict {dari, ke, tipe, isi, id} = amplop: ada pengirim, tujuan, jenis, isi, nomor seri. Bahasa natural tanpa struktur = kartu pos yang bisa dibaca siapa saja, hilang di jalan, dan tidak bisa dilacak. Untuk komunikasi MESIN, protokol > prosa — selalu. Bahasa natural untuk manusia; struktur untuk mesin; campur keduanya hanya saat manusia membaca log.",
      },
      figure: {
        svg: SEQ_SVG,
        alt: "Diagram sekuens: orkestrator membagi tugas ke peneliti dan penulis, pesan dengan ack, satu pesan hilang menyebabkan timeout.",
        caption: "Deadlock dua agen: logika lokal benar, protokol yang gagal.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: pajak koordinasi dalam angka",
      prose: [
        "Laporan mingguan Dina: jika dikerjakan 1 agen butuh 60 menit. Ia mempertimbangkan 4 agen spesialis (peneliti pasar, peneliti regulasi, penulis, pemeriksa). Overhead koordinasi c = 0,3 per agen tambahan (pesan, sinkronisasi, resolusi konflik).",
        "Speedup: S(4) = 4 / (1 + 0,3×3) = 4 / 1,9 = 2,11. Waktu = 60 / 2,11 = 28,5 menit. Hemat 31,5 menit — tetapi biaya token 4 agen ≈ 4× (ditambah overhead pesan). Jika 1 agen berharga Rp3.000/laporan, 4 agen ≈ Rp12.000+ untuk hemat 31 menit.",
        "Apakah sepadan? Jika analis menunggu (gaji Rp85.000/jam), hemat 31,5 menit = Rp44.600 nilai waktu vs tambahan biaya Rp9.000 → YA, sepadan. Tetapi jika laporan berjalan background tanpa menunggu, nilai waktunya NOL → 4 agen hanya membakar Rp9.000/laporan.",
        "Sekarang skenario buruk: tanpa protokol ack, peluang deadlock per laporan = 5%. Tiap deadlock butuh intervensi manual 2 jam (Rp170.000). Expected cost deadlock = 0,05 × 170.000 = Rp8.500/laporan — menghapus hampir seluruh penghematan.",
        "Pembahasan: dua pelajaran angka — (1) multi-agent dibenarkan oleh NILAI WAKTU atau SPESIALISASI, bukan kecepatan mentah; (2) protokol yang buruk (tanpa ack/timeout) bisa menghapus seluruh keuntungan lewat expected cost kegagalan. Hitung S(n) DAN expected cost kegagalan sebelum menambah agen.",
        "Akuntansi ROI lengkap 4 agen. Biaya: 4 × Rp3.000 token + Rp6.000 pesan + Rp14.167 sinkronisasi idle ≈ Rp32.000/laporan (vs Rp3.000 satu agen). Manfaat: hemat 31,5 menit × Rp85.000/60 = Rp44.625 nilai waktu. ROI = 44.625/32.000 = 1,39× — positif, TETAPI tipis. Jika c naik ke 0,5 (koordinasi buruk): S(4)=1,6, hemat 22,5 menit = Rp31.875 < Rp32.000 — ROI NEGATIF. Kesimpulan: multi-agent menguntungkan hanya dalam jendela c yang sempit. Ukur c-mu SEBELUM memutuskan, bukan sesudah membangun.",
        "Sensitivitas tarif analis: jika analis Rp200.000/jam (bukan 85.000): hemat waktu 31,5 menit = Rp105.000 — ROI 3,3×, keputusan MUDAH. Jika analis Rp50.000/jam: hemat = Rp26.250 < Rp32.000 — JANGAN multi-agent. Keputusan arsitektur bergantung pada HARGA WAKTU MANUSIA yang dihemat — variabel yang tidak ada di diagram arsitektur mana pun, tetapi menentukan semuanya. Arsitektur = ekonomi yang menyamar sebagai teknik.",
        "Skenario kegagalan: satu dari 4 agen down 10% waktu. Sistem orkestrator: 10% tugas gagal total (single point). Sistem dengan retry+standby: 1% gagal, biaya +Rp8.000/laporan. Pilih: Rp32.000 + 10% gagal vs Rp40.000 + 1% gagal? Untuk laporan internal: yang murah. Untuk laporan ke regulator: yang andal. “Berapa nine?” (99% vs 99,9%) adalah pertanyaan BISNIS — jawab sebelum bertanya ke insinyur.",
        "Lima agen — apakah lebih baik dari 4? S(5) = 5/(1+0,3×4) = 5/2,2 = 2,27 vs S(4)=2,11. Gain: +7,6% kecepatan untuk +25% biaya + 1 agen lagi untuk di-debug. Keputusan: TIDAK — kecuali paralelisme nyata f > 0,85. Kurva S(n) mendatar setelah n=4 untuk c=0,3; setiap agen tambahan membeli semakin sedikit. “Scale up” tanpa mengukur kurva = membeli harapan dengan harga pasti.",
        "Skenario gagal 20%: satu agen down 20% waktu (bukan 10%). Orkestrator tanpa standby: 20% tugas gagal — TIDAK TERIMA untuk laporan direksi. Dengan standby replica (+Rp8.000/laporan): gagal turun ke 4% (0,2² — butuh keduanya down). Dengan 2 replica: 0,8%. Biaya keandalan: Rp32.000 → Rp40.000 → Rp48.000 untuk 90% → 96% → 99,2%. “Berapa nine?” — setiap 9 tambahan ≈ +Rp8.000/laporan. Tanyakan ke bisnis: “apakah 99% worth Rp16.000/laporan lebih mahal dari 90%?” — bukan ke insinyur.",
        "Break-even volume: setup multi-agent = Rp15 juta (desain + protokol + testing). Hemat per laporan vs 1 agen = Rp44.625 − Rp32.000 = Rp12.625. Break-even: 15.000.000 / 12.625 = 1.188 laporan ≈ 10 bulan (120 laporan/bulan). Di bawah 10 bulan payback → JANGAN multi-agent, pakai 1 agen yang baik. Arsitektur adalah investasi; investasi butuh payback. “Keren” bukan metrik keuangan.",
        "Keputusan final untuk Dina: 1 agen (Rp3.000, 60 menit) vs 4 agen (Rp32.000, 28,5 menit) vs 2 agen (Rp12.000, 39 menit). Nilai waktu Rp85.000/jam: 1 agen = Rp85.000 nilai − Rp3.000 = +Rp82.000; 4 agen = Rp44.625 − Rp32.000 = +Rp12.625; 2 agen = Rp30.000... hitung: hemat 21 menit = Rp29.750 − Rp12.000 = +Rp17.750. Pemenang BERSIH: 1 agen (+Rp82.000)! Tunggu — bukankah ini berarti JANGAN multi-agent? Untuk KASUS INI: benar. Multi-agent menang hanya jika nilai waktu TINGGI (analis Rp200rb/jam) atau volume TINGGI. Pelajaran: hitung bersihmu sendiri — jangan salin arsitektur orang lain.",
        "Analisis sensitivitas c — tabel lengkap untuk n=4. c=0,1: S=3,08 (46 menit hemat) — koordinasi bagus, multi-agent MENANG telak. c=0,3: S=2,11 (31,5 menit) — menang tipis. c=0,5: S=1,6 (22,5 menit) — KALAH dari 1 agen setelah dihitung biaya. c=0,7: S=1,29 — hampir tidak ada gain. c adalah SATU-SATUNYA angka yang menentukan nasib multi-agent — dan ia bisa DIUKUR (pilot 2 agen, 1 pekan). Jangan bangun 4 agen dengan c asumsi; ukur c dengan 2 agen dulu. Rp0 untuk pilot vs Rp15 juta untuk asumsi yang salah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Deadlock di sistem fraud real-time = transaksi menumpuk tanpa keputusan. Untuk jalur kritis, pilih orkestrator sederhana yang teraudit daripada peer-to-peer canggih yang sulit di-debug saat insiden.",
      },
    },
    {
      id: "evaluator-optimizer",
      eyebrow: "Langkah 6 · Pola evaluasi",
      title: "Evaluator-optimizer: satu agen menilai, satu memperbaiki",
      prose: [
        "Pola lingkar hasilkan-nilai-perbaiki: satu agen GENERATOR membuat draf, satu agen EVALUATOR menilainya dengan rubrik tertulis, lalu generator memperbaiki berdasarkan penilaian. Ulangi sampai skor melewati ambang atau putaran habis. Ini bukan dua agen yang berdiskusi bebas — ini lini produksi dengan satu pos pemeriksaan mutu.",
        "Kenapa pemisahan membantu? Penulis buta terhadap cacatnya sendiri: generator yang menulis \u201CLaporan ini lengkap\u201D tidak bisa melihat bagian yang ia lewatkan — ia \u201Cmengetahui\u201D niatnya, bukan hasilnya. Evaluator yang hanya melihat TEKS + RUBRIK tidak punya akses ke niat itu, sehingga ia melihat yang sebenarnya ada di halaman. Kebutaan diri adalah fitur manusia DAN model; evaluator adalah cermin yang tidak ikut menulis.",
        "Syaratnya: kriteria evaluator WAJIB tertulis sebagai rubrik, bukan \u201Cbagus?\u201D. Contoh rubrik 3 kriteria × skor 0–2: (1) akurasi faktual — setiap angka punya sumber; (2) kelengkapan — semua poin brief terjawab; (3) nada — sesuai audiens. Evaluator yang hanya ditanya \u201Cbagus tidak?\u201D akan menjawab \u201Cbagus\u201D — ia tidak punya alasan untuk teliti. Rubrik mengubah opini menjadi pengukuran.",
        "Kapan pola ini menang, kapan membuang biaya? MENANG pada tugas dengan kualitas TERUKUR dan ruang perbaikan: terjemahan, kode, draf dokumen, ringkasan. MEMBUANG BIAYA pada tugas faktual satu jawaban: bertanya \u201Cberapa CAR bank ini?\u201D tidak butuh evaluator — jawaban benar atau salah, tidak ada \u201Cversi lebih baik\u201D. Dan batas putaran: perbaikan menurun tajam — putaran 1–2 biasanya menangkap 80% masalah; putaran ke-4 jarang menolong, ia hanya memoles kalimat yang sudah cukup. Tanpa batas, loop = biaya tanpa akhir.",
        "Intuisi: editor yang baik tidak menulis ulang bukumu — ia menunjuk kalimat mana yang rusak dan kenapa. Evaluator-optimizer bekerja dengan prinsip yang sama: pemisahan antara yang MENCIPTAKAN dan yang MENILAI adalah penemuan tertua dalam manajemen kualitas. Agen hanyalah pegawai barunya.",
      ],
      note: {
        title: "Miskonsepsi: \u201Cloop selalu memperbaiki\u201D",
        type: "pitfall",
        body: "Yang benar: evaluator yang salah kalibrasi bisa MENDEGRADASI hasil — generator mengubah jawaban yang tadinya benar menjadi salah karena evaluator menuntut sesuatu yang keliru. Loop tanpa kalibrasi bukan perbaikan, melainkan pelemparan dadu yang mahal. Kalibrasi evaluator pada contoh emas (langkah berikutnya) sebelum mempercayai loop-nya.",
      },
      tasks: [
        { id: "t1", text: "Tulis 1 kalimat kapan kamu memakai evaluator-optimizer vs kapan tidak (uji: tugas dengan kualitas terukur atau faktual satu jawaban?)" },
        { id: "t2", text: "Buat rubrik 3 kriteria × skor 0–2 untuk menilai ringkasan laporan keuangan" },
      ],
      expected: "kapan dipakai: draf dokumen/kode/terjemahan (kualitas terukur); kapan tidak: pertanyaan faktual satu jawaban. Rubrik: 3 kriteria eksplisit dengan level 0–2.",
    },
    {
      id: "evaluator-optimizer-praktik",
      eyebrow: "Langkah 7 · Praktik",
      title: "Menjalankan lingkar evaluator-optimizer",
      prose: [
        "Aturan berhenti — tiga peluit, mana yang berbunyi duluan menang: (1) AMBANG SKOR — skor evaluator ≥ ambang (mis. 85/100): berhenti, kirim; (2) PUTARAN MAKS — mis. 3 putaran: berhenti walau belum sempurna; (3) BIAYA MAKS — budget token loop tercapai: berhenti. Tanpa ketiganya, loop berjalan sampai seseorang mematikannya — dan biasanya tidak ada yang memperhatikan.",
        "Dua penyakit evaluator — keduanya mematikan loop dengan cara berlawanan. Terlalu BAIK HATI: semua draf lulus (skor 95+) — loop tidak pernah memperbaiki apa pun, kamu membayar evaluator untuk tepuk tangan. Terlalu KEJAM: tidak ada draf yang lulus — loop selalu mencapai putaran maks dan membakar biaya penuh. Obat keduanya sama: KALIBRASI dengan contoh emas — draf yang sudah dinilai manusia. Jika evaluator memberi 90 ke draf yang manusia beri 60, ia baik hati; jika memberi 50 ke draf yang manusia beri 85, ia kejam. Kalibrasi dulu, loop kemudian.",
        "Jejak skor per putaran BUKAN sekadar log — ia adalah data perbaikan prompt. Pola yang perlu dibaca: (a) skor naik lalu DATAR di 78 setelah putaran 2 → bukan kurang putaran, melainkan rubrik/prompt generator yang mentok — perbaiki prompt, bukan tambah putaran; (b) skor NAIK-TURUN → evaluator tidak konsisten — kalibrasi ulang; (c) skor naik stabil tiap putaran → loop sehat, putaran maks bisa dipertimbangkan naik. Yang tidak diukur tidak bisa diperbaiki — termasuk loop itu sendiri.",
        "Jebakan model yang sama: generator dan evaluator memakai MODEL yang sama = mewarisi KEBUTAAN yang sama. Evaluator model-X tidak akan menangkap kesalahan yang model-X sendiri cenderung buat — ia buta di titik yang sama. Mitigasi: (1) model berbeda untuk evaluator (lebih kuat bila mampu); (2) jika terpaksa sama, pisahkan SUDUT PANDANG — prompt evaluator yang adversarial (\u201Ccari 3 kesalahan fatal\u201D) vs prompt generator yang konstruktif; (3) untuk taruhan tinggi, satu putaran evaluasi manusia. Korelasi kegagalan adalah musuh tersembunyi semua sistem redundansi.",
        "Biaya loop dalam angka: generator Rp1.000/draf + evaluator Rp500/penilaian. 3 putaran = 3×1.000 + 3×500 = Rp4.500 per dokumen final vs Rp1.000 tanpa loop. Worth it jika nilai kualitas > Rp3.500 — mis. dokumen ke regulator. Tidak worth it untuk draf internal yang dibaca sekali. Seperti biasa: arsitektur = ekonomi yang menyamar sebagai teknik.",
        "Intuisi: lingkar ini seperti menimbang badan tiap minggu saat diet — timbangannya (evaluator) harus JUJUR dan KONSISTEN, kalau tidak datanya menyesatkan. Dan menimbang 10× sehari tidak membuatmu lebih cepat kurus — begitu juga putaran ke-7 tidak membuat draf lebih baik. Ukur dengan benar, berhenti pada waktunya.",
      ],
      note: {
        title: "Miskonsepsi: \u201Cevaluator manusia selalu lebih baik dari evaluator model\u201D",
        type: "pitfall",
        body: "Yang benar: untuk volume tinggi dan kriteria eksplisit, evaluator model yang TERKALIBRASI lebih konsisten daripada manusia yang lelah (manusia menilai draf ke-50 dengan standar berbeda dari draf ke-1). Manusia unggul pada penilaian yang butuh JUDGMENT kontekstual, bukan pada konsistensi rubrik. Pilih berdasarkan sifat tugas, bukan prestise.",
      },
      tasks: [
        { id: "t1", text: "Implementasikan fungsi `skor()` dan jalankan lingkar perbaikan: tiap putaran memperbaiki SATU cacat sampai skor ≥ AMBANG atau putaran = MAKS_PUTARAN" },
        { id: "t2", text: "Cetak jejak skor tiap putaran (`putaran=... skor=... diperbaiki=...`), simpan `skor_akhir` dan `putaran_terpakai`" },
      ],
      expected: "jejak skor: (0,45) -> (1,50) -> (2,75) -> (3,85); berhenti di putaran 3 karena mencapai AMBANG 85; skor_akhir=85, putaran_terpakai=3",
      hints: [
        "skor(tersisa) = 100 - jumlah penalti cacat yang masih tersisa. Pakai dict PENALTI.",
        "Tiap putaran: ambil cacat pertama yang tersisa (tersisa.pop(0)), hitung ulang skor.",
        "Kondisi loop: skor < AMBANG DAN putaran < MAKS_PUTARAN DAN masih ada cacat.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====\nCACAT = [\n    {"nama": "ejaan", "penalti": 5},\n    {"nama": "fakta_salah", "penalti": 25},\n    {"nama": "nada_kaku", "penalti": 10},\n    {"nama": "struktur_acak", "penalti": 15},\n]\nAMBANG = 85\nMAKS_PUTARAN = 5\nPENALTI = {c["nama"]: c["penalti"] for c in CACAT}\n\n# ===== TULIS KODEMU =====\ndef skor(tersisa):\n    # kembalikan 100 dikurangi total penalti cacat yang masih ada\n    ...\n\njejak = []\ntersisa = [c["nama"] for c in CACAT]\nskor_saat_ini = skor(tersisa)\njejak.append((0, skor_saat_ini))\nputaran = 0\n# lingkar: tiap putaran perbaiki SATU cacat, berhenti di AMBANG/MAKS_PUTARAN\n...\n\nskor_akhir = ...\nputaran_terpakai = ...`,
        lockLines: 12,
        solution: `# ===== DATA — jangan diubah =====\nCACAT = [\n    {"nama": "ejaan", "penalti": 5},\n    {"nama": "fakta_salah", "penalti": 25},\n    {"nama": "nada_kaku", "penalti": 10},\n    {"nama": "struktur_acak", "penalti": 15},\n]\nAMBANG = 85\nMAKS_PUTARAN = 5\nPENALTI = {c["nama"]: c["penalti"] for c in CACAT}\n\n# ===== TULIS KODEMU =====\ndef skor(tersisa):\n    return 100 - sum(PENALTI[nama] for nama in tersisa)\n\njejak = []\ntersisa = [c["nama"] for c in CACAT]\nskor_saat_ini = skor(tersisa)\njejak.append((0, skor_saat_ini))\nputaran = 0\nwhile skor_saat_ini < AMBANG and putaran < MAKS_PUTARAN and tersisa:\n    putaran += 1\n    diperbaiki = tersisa.pop(0)\n    skor_saat_ini = skor(tersisa)\n    jejak.append((putaran, skor_saat_ini))\n    print(f"putaran={putaran} skor={skor_saat_ini} diperbaiki={diperbaiki}")\n\nskor_akhir = skor_saat_ini\nputaran_terpakai = putaran`,
        checks: [
          { kind: "defined", task: "t1", name: "jejak", label: "`jejak` terdefinisi", msg: "Simpan jejak skor per putaran dalam list `jejak`." },
          { kind: "equal", task: "t1", name: "skor_akhir", value: 85, label: "`skor_akhir` = 85", msg: "Skor awal 45; per putaran berkurang satu penalti: 50, 75, 85 — berhenti di ambang." },
          { kind: "equal", task: "t2", name: "putaran_terpakai", value: 3, label: "`putaran_terpakai` = 3", msg: "Berhenti di putaran 3 karena skor mencapai AMBANG 85." },
          { kind: "stdout_matches", task: "t2", pattern: "putaran=3 skor=85 diperbaiki=nada_kaku", label: "jejak putaran 3 tercetak", msg: "Cetak tiap putaran dengan format putaran=... skor=... diperbaiki=..." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Bedakan deadlock, livelock, dan miscoordination — ketiganya sering tertukar.",
        "Refleksi: multi-agent = organisasi. Semua pelajaran manajemen berlaku: spesialisasi > generalisasi untuk tugas kompleks; koordinasi = overhead yang harus lebih kecil dari nilai spesialisasi; terlalu banyak rapat (pesan) membunuh produktivitas; dan satu orang (agen) yang tidak jelas perannya = beban tim. Jika kamu pernah memimpin tim manusia, kamu sudah tahu 80% ilmu multi-agent. Sisanya: protokol, idempotensi, dan matematika pajak — yang justru lebih mudah dari politik kantor.",
        "Satu kalimat untuk dibawa pulang: “Tambah agen hanya jika kamu bisa menulis SATU KALIMAT spesialisasi yang tidak bisa dilakukan agen existing — dan kalimat itu harus menyebut TOOLS atau PENGETAHUAN yang berbeda, bukan sekadar ‘lebih fokus’.” Fokus tanpa perbedaan kapabilitas = overhead tanpa manfaat. Uji setiap desain multi-agent dengan kalimat ini sebelum menulis satu baris kode.",
      ],
      tasks: [],
      summary: [
        "Orkestrator: mudah dikontrol, single point of failure. Peer-to-peer: fleksibel, jalur komunikasi tumbuh kuadratik.",
        "Protokol minimal: pesan terstruktur + ack + timeout + retry terbatas + idempotensi.",
        "Deadlock (saling tunggu), livelock (sibuk tanpa maju), miscoordination (salah asumsi).",
        "S(n) = n/(1+c(n−1)): multi-agent dibenarkan spesialisasi/nilai waktu, bukan kecepatan mentah.",
        "Gambar diagram sekuens sebelum coding — deadlock terlihat di kertas.",
      ],
      next: { label: "AAI7 — Prompt Engineering untuk Agen", href: "/v2/learn/aai7-prompt" },
      quiz: [
        {
          q: "Penulis menunggu fakta yang \u201Csudah dikirim\u201D, Peneliti menunggu konfirmasi. Ini contoh…",
          options: [
            { text: "Deadlock", why: "Tepat. Keduanya saling menunggu — tidak ada yang bisa maju.", correct: true },
            { text: "Livelock", why: "Livelock = keduanya SIBUK (revisi bolak-balik) tetapi tak maju.", },
            { text: "Miscoordination", why: "Miscoordination = salah asumsi pembagian kerja, bukan saling tunggu.", },
            { text: "Race condition", why: "Race condition = hasil tergantung urutan eksekusi, bukan pola tunggu ini.", },
          ],
        },
        {
          q: "c = 0,3; n = 4. Berapa S(n)?",
          options: [
            { text: "4,0", why: "Itu speedup ideal tanpa overhead — tidak realistis.", },
            { text: "2,11", why: "4/(1+0,3×3) = 4/1,9 = 2,11.", correct: true },
            { text: "1,9", why: "Itu penyebutnya saja, bukan hasilnya.", },
            { text: "0,53", why: "Terbalik — itu 1/1,9.", },
          ],
        },
        {
          q: "Fungsi ACK dalam protokol pesan antar agen?",
          options: [
            { text: "Mempercepat pengiriman", why: "Ack justru menambah satu round-trip.", },
            { text: "Memberi tahu pengirim bahwa pesan sampai, sehingga bisa retry/eskalasi jika tidak", why: "Tepat. Tanpa ack, pengirim buta — itulah akar deadlock cerita Dina.", correct: true },
            { text: "Mengenkripsi isi pesan", why: "Enkripsi adalah lapisan keamanan terpisah.", },
            { text: "Mengompresi pesan", why: "Bukan fungsi ack.", },
          ],
        },
        {
          q: "Kapan multi-agent PALING dibenarkan?",
          options: [
            { text: "Saat ingin 10× lebih cepat", why: "Rumus S(n) menunjukkan kecepatan tidak pernah 10× dengan overhead realistis.", },
            { text: "Saat peran butuh tools/pengetahuan yang terpisah dan terspesialisasi", why: "Tepat. Spesialisasi — bukan kecepatan — adalah alasan arsitekturalnya.", correct: true },
            { text: "Saat satu agen terlalu mahal", why: "Multi-agent justru lebih mahal (N× token + overhead).", },
            { text: "Saat tugasnya satu langkah", why: "Satu langkah = single-shot, bukan multi-agent.", },
          ],
        },
        {
          q: "Dua agen merevisi draf bolak-balik 20× tanpa kriteria berhenti. Ini contoh…",
          options: [
            { text: "Deadlock", why: "Mereka tidak saling menunggu — mereka sibuk.", },
            { text: "Livelock", why: "Tepat. Sibuk bergerak (revisi) tetapi tidak maju ke selesai.", correct: true },
            { text: "Idempotensi", why: "Idempotensi = aman diulang, bukan pola ini.", },
            { text: "Fan-out", why: "Fan-out = paralelisme replika, bukan revisi bolak-balik.", },
          ],
        },
      ],
    },
  ],
};
