import type { V2Lesson } from "../lib/types";

// Ilustrasi: jam kerja per laporan vs kesalahan faktual per laporan (3 pendekatan).
const BARS_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Diagram batang: manual 6 jam 0,2 salah; chatbot 3 jam 2,4 salah; agen 0,5 jam 0,4 salah.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="16" x2="456" y2="16"/><line x1="56" y1="56" x2="456" y2="56"/><line x1="56" y1="96" x2="456" y2="96"/><line x1="56" y1="136" x2="456" y2="136"/><line x1="56" y1="176" x2="456" y2="176"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="20">8</text><text x="50" y="60">6</text><text x="50" y="100">4</text><text x="50" y="140">2</text><text x="50" y="180">0</text></g>
<text x="20" y="100" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 20 100)">jam / laporan</text>
<g>
<rect x="90" y="56" width="56" height="120" fill="var(--c1)"/><text x="118" y="196" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Manual</text><text x="118" y="50" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">6,0 j</text>
<rect x="196" y="116" width="56" height="60" fill="var(--c1)"/><text x="224" y="196" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Chatbot</text><text x="224" y="110" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">3,0 j</text>
<rect x="302" y="166" width="56" height="10" fill="var(--c1)"/><text x="330" y="196" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Agen</text><text x="330" y="160" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">0,5 j</text>
</g>
<g fill="var(--c4)">
<circle cx="118" cy="172" r="7"/><text x="118" y="146" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">0,2 salah</text>
<circle cx="224" cy="52" r="7"/><text x="224" y="26" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">2,4 salah</text>
<circle cx="330" cy="164" r="7"/><text x="330" y="138" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">0,4 salah</text>
</g>
<text x="410" y="60" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">● kesalahan faktual</text>
<text x="410" y="80" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">  per laporan</text>
</svg>`;

export const aai1: V2Lesson = {
  slug: "aai1-lanskap",
  track: "Agentic AI Engineer",
  module: "Fondasi Agen",
  title: "AAI1 — Dari Chatbot ke Agen",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan Senin pagi yang hampir menjatuhkan Dina",
      prose: [
        "Dina, analis risiko di sebuah fintech Jakarta, dapat tugas rutin: setiap Senin pukul 08.00, satu halaman ringkasan risiko pasar untuk direksi — IHSG, kurs USD/IDR, harga emas, dan satu paragraf implikasi untuk portofolio kredit.",
        "Pekan lalu ia mencoba jalan pintas. Ia mengetik ke chatbot: \u201Cbuatkan ringkasan risiko pasar pekan ini.\u201D Tiga puluh detik kemudian keluar teks yang rapi: angka IHSG, kurs, bahkan kutipan \u201Cdata BI\u201D. Dina mengirimkannya nyaris tanpa membaca ulang.",
        "Senin siang direksi bertanya: \u201Ckatanya cadangan devisa naik? Bukankah BI baru mengumumkan turun?\u201D Dina mengecek. Chatbot itu mengambil angka dari masa training-nya — dua bulan basi — dan satu angka ia balik logikanya. Tidak ada satu pun kalimat \u201Csaya tidak tahu\u201D di teks itu.",
        "Twist-nya: chatbot tidak gagal karena bodoh. Ia berhasil melakukan TUGAS YANG SALAH — menyelesaikan kalimat, bukan menyelesaikan pekerjaan. Tidak ada yang menyuruhnya memverifikasi angka, membuka sumber, atau mengaku tidak tahu. Ia tidak punya tujuan selain \u201Cterdengar meyakinkan\u201D.",
        "Pekan ini Dina mencoba pendekatan berbeda: sebuah agen. Ia memberi TUJUAN (\u201Cringkasan akurat per Senin 08.00\u201D) dan TOOLS (pencari web, kalkulator, penulis file). Agen itu mencari data IHSG, menghitung perubahan kurs sendiri, lalu menulis: \u201CData cadangan devisa BI belum rilis — bagian ini saya kosongkan.\u201D Butuh 4 menit, bukan 30 detik. Tapi tidak ada angka karangan.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga pembeda agen vs chatbot: otonomi, tools, tujuan; (2) memetakan sebuah tugas ke spektrum chatbot–copilot–agen; (3) menghitung dekomposisi peluang keberhasilan sebuah agen; (4) menjalankan simulasi loop agen-vs-chatbot memakai mock tools tanpa API key.",
        "Daftar isi: 1) Cerita Dina · 2) Tiga pembeda agen · 3) Lab: simulasi agen vs chatbot · 4) Peta keputusan: kapan pakai apa · 5) Mini-case: hitung biaya kesalahan · 6) Checkpoint.",
        "Tiga hari kemudian, bom kedua meledak. Direksi memakai ringkasan Dina untuk menaikkan limit kredit UMKM Rp2 miliar — dengan asumsi “cadangan devisa naik, rupiah menguat”. Asumsinya datang dari angka basi chatbot itu. Ketika data BI yang benar rilis (cadangan devisa TURUN), limit sudah telanjur disetujui komite. Biaya klarifikasi Rp70.800 per kesalahan tiba-tiba terlihat murah: satu angka yang LOLOS ke keputusan berbiaya ratusan juta. Pelajaran yang tidak tertulis di laporan mana pun: kecepatan tanpa verifikasi bukan efisiensi — ia hanya memindahkan biaya ke kolom yang lebih mahal.",
        "Bandingkan tiga timeline untuk tugas yang sama. Chatbot: 30 detik, 2,4 kesalahan per laporan. Agen: 4 menit — search 45 detik, hitung 30 detik, tulis 2 menit, verifikasi silang 45 detik — 0,4 kesalahan. Manual: 6 jam, 0,2 kesalahan. Agen tidak mengalahkan analis manusia dalam akurasi mentah; ia mengalahkan manusia dalam WAKTU dengan akurasi yang masih bisa dipertanggungjawabkan. Itulah proposisi nilai agen yang jujur: bukan “lebih pintar dari manusia”, melainkan “cukup benar, 72 kali lebih cepat”.",
        "Enam bulan kemudian, Dina memimpin “tim” 3 agen: satu riset, satu hitung, satu tulis — dengan dirinya sebagai L3 (otonomi, lapor berkala). Nol insiden angka dalam 26 pekan. Yang berubah bukan modelnya — masih model yang sama. Yang berubah adalah kebiasaannya: tidak ada angka yang lolos ke laporan tanpa sumber tercatat; tidak ada tugas tanpa tujuan yang bisa diuji; tidak ada loop tanpa anggaran. Agen yang baik ternyata 20% teknologi, 80% disiplin. Lesson ini memberimu 20%-nya; 80%-nya adalah kebiasaan yang kamu bawa pulang.",
        "Tiga aturan yang Dina wariskan ke setiap analis baru di timnya — ditempel di dinding, bukan di wiki. (1) “Tidak ada angka tanpa sumber tercatat.” Setiap angka di laporan punya jejak: sumber, tanggal akses, siapa memverifikasi. (2) “Tidak ada tugas tanpa cara mengujinya.” Sebelum agen dijalankan, tulis dulu bagaimana kamu tahu ia berhasil. (3) “Tidak ada loop tanpa anggaran.” Setiap agen punya max_steps dan max_rupiah — tertulis, bukan “nanti saja”. Tiga kalimat, nol jargon — dan insiden angka di timnya turun ke nol dalam 26 pekan. Disiplin mengalahkan kecerdasan, setiap saat.",
      ],
      note: {
        title: "💡 Intuisi: bedakan “langkah selesai” dari “tugas tercapai”",
        body: "run_agent di lab melaporkan tool_calls=3 bahkan ketika semua bukti berisi “tidak ditemukan”. Metrik proses (langkah dieksekusi) selalu terlihat bagus; metrik hasil (tugas benar-benar selesai) yang menentukan nilai. Kebiasaan ini — mengukur hasil, bukan aktivitas — adalah fondasi AAI8 dan pembeda insinyur agen junior vs senior.",
      },

      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga hal yang membuat sebuah sistem disebut \u201Cagen\u201D",
      prose: [
        "Definisi kerja yang dipakai industri: agen adalah sistem yang (1) menerima TUJUAN, bukan sekadar prompt; (2) memilih TINDAKAN sendiri — termasuk memanggil tools di dunia luar; (3) MENGOBSERVASI hasil tindakannya; (4) mengulang siklus itu sampai tujuan tercapai atau ia menyerah secara eksplisit.",
        "Tiga pembeda dari chatbot biasa. OTONOMI: chatbot menunggu giliran bicara; agen memutuskan langkah berikutnya sendiri — search dulu atau hitung dulu? TOOLS: chatbot hanya punya kata-kata; agen bisa mengeksekusi kode, query database, memanggil API. TUJUAN: chatbot mengoptimalkan \u201Crespons yang bagus\u201D; agen mengoptimalkan \u201Ctugas selesai dengan benar\u201D.",
        "Kepribadiannya: chatbot itu seperti konsultan yang pandai bicara tetapi tidak boleh menyentuh apa pun di kantormu. Agen adalah pegawai magang yang boleh membuka laci, menelepon, dan mengecek ulang — tetapi tetap magang: perlu diawasi.",
        "Peluang keberhasilan sebuah agen bisa didekomposisi menjadi tiga tahap yang berantai. Rumus di bawah ini menjelaskan kenapa agen yang \u201Cpintar merencanakan\u201D tetap bisa gagal total.",
        "Contoh angka rantai untuk tiga desain. Desain A (tanpa verifikasi): P(rencana)=0,9, P(tool|rencana)=0,8, P(verifikasi)=0 — karena tidak ada tahap verifikasi sama sekali, P(berhasil)=0. Nol. Bukan kecil — nol, karena tidak ada yang menangkap kesalahan. Desain B (dengan verifikasi 0,9): 0,9 × 0,8 × 0,9 = 0,648. Desain C (tambah validasi argumen tool, P(tool) naik ke 0,95): 0,9 × 0,95 × 0,9 = 0,77. Menaikkan satu mata rantai sebesar 15 poin menaikkan sistem 12 poin — perkalian membuat perbaikan di mata TERLEMAH paling berharga.",
        "Uji ekstremnya: agen dengan planner terbaik di dunia — P(rencana)=0,99, P(tool)=0,99 — tetapi tanpa verifikasi yang serius, P(verifikasi)=0,5. Hasil: 0,99 × 0,99 × 0,5 = 0,49. Kurang dari setengah tugas berhasil. Inilah jebakan “upgrade model”: perusahaan mengganti model yang lebih mahal untuk memperbaiki agen yang gagal, padahal yang rusak adalah mata rantai verifikasi. Diagnosis yang benar selalu dimulai dari mengukur ketiga faktor secara terpisah — bukan dari menebak.",
        "Otonomi bukan biner — ia spektrum lima level. L0 chatbot: menjawab, tidak bertindak. L1 kopilot: menyarankan, manusia mengeksekusi. L2 agen terpandu: menyusun rencana, manusia ACC tiap langkah berisiko. L3 agen otonom: bertindak sendiri, melapor berkala. L4 agen penuh: bertindak, manusia hanya membaca audit trail. Kebanyakan kegagalan agen produksi adalah lompatan dari L1 langsung ke L4 — melewati L2/L3 tempat organisasi belajar mempercayai sistem. Aturan praktis: naik satu level per kuartal, bukan per pekan.",
        "Tujuan yang ambigu adalah bug yang belum meledak. “Buatkan ringkasan yang bagus” tidak bisa diuji — bagus menurut siapa? Bandingkan: “Ringkasan 1 halaman; setiap angka terverifikasi dari sumber berumur ≤7 hari; bagian yang tak terverifikasi dikosongkan dan ditandai.” Tujuan kedua bisa DIEVALUASI oleh mesin (AAI8): cek umur sumber, cek bagian kosong. Prinsipnya: jika kamu tidak bisa menulis cara menguji tujuan itu, agenmu tidak punya tujuan — ia punya harapan.",
        "Biaya verifikasi itu sendiri — dan mengapa ia tetap murah. Verifikasi silang 45 detik × Rp85.000/jam = Rp1.063 per laporan. Tanpa verifikasi: 2,4 kesalahan × Rp70.800 = Rp169.920 ekspektasi kerugian per laporan. Rasio: 1 : 160. Verifikasi membayar dirinya 160× lipat. Aturan umumnya: verifikasi worth it selama P(salah tanpa verifikasi) × dampak > biaya verifikasi. Untuk hampir semua pekerjaan analis, ketimpangan ini berlaku — yang berarti “tidak sempat verifikasi” hampir selalu berarti “tidak sempat berpikir”.",
        "Kapan rumus rantai perkalian BOHONG: ia mengasumsikan tiga tahap independen. Kenyataannya berkorelasi — planner yang buruk cenderung menghasilkan argumen tool yang buruk juga (P(tool|rencana) aktual < P(tool) marginal). Artinya 0,648 dari contoh adalah BATAS ATAS yang optimis; P(berhasil) empiris biasanya 10–30% lebih rendah. Jangan pakai rumus ini untuk menjanjikan angka ke direksi — pakai untuk DIAGNOSIS (mata rantai mana terlemah), lalu ukur yang sebenarnya dengan evaluasi (AAI8).",
        "Latihan terstruktur: hitung P(berhasil) untuk agen Dina versi produksi. Asumsi realistis: P(rencana benar)=0,85 (tugas mingguan yang polanya dikenal), P(tool benar|rencana)=0,90 (tool teruji, format stabil), P(verifikasi lolos)=0,95 (verifikasi silang dua sumber). P(berhasil) = 0,85 × 0,90 × 0,95 = 0,727. Sekarang dua opsi perbaikan. Opsi X — naikkan verifikasi ke 0,99 (tambah sumber ketiga): 0,85 × 0,90 × 0,99 = 0,757 (+3 poin). Opsi Y — upgrade model (P(rencana) 0,85 → 0,95): 0,95 × 0,90 × 0,95 = 0,812 (+8,5 poin). Opsi Y menang di angka — TETAPI biayanya: upgrade model = Rp15 juta/bulan (selisih tier API × volume), opsi X = Rp1.063 × 12 laporan = Rp12.756/bulan. Rasio biaya-manfaat: X memberikan 3 poin per Rp12,8 ribu; Y memberikan 8,5 poin per Rp15 juta. Keputusan dewasa = hitung keduanya, bukan pilih yang angkanya terbesar.",
      ],
      formula: String.raw`P(\text{berhasil}) = P(\text{rencana benar}) \times P(\text{tool benar} \mid \text{rencana}) \times P(\text{verifikasi lolos} \mid \text{tool})`,
      formulaNote: "P(berhasil) = peluang tugas selesai dengan benar. P(rencana benar) = peluang langkah yang disusun masuk akal; P(tool benar | rencana) = peluang tiap tool dieksekusi dengan argumen yang tepat; P(verifikasi lolos | tool) = peluang hasil dicek sebelum dipakai. Ketiganya dikalikan karena kegagalan di satu tahap menggugurkan seluruh rantai.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Cagen = chatbot yang lebih pintar\u201D",
        type: "pitfall",
        body: "Yang benar: bedanya adalah ARSITEKTUR, bukan ukuran model. GPT yang sama bisa jadi chatbot (jawab langsung) atau jadi agen (diberi loop + tools + tujuan). Perusahaan yang \u201Cupgrade model\u201D untuk memperbaiki agen yang gagal sering salah diagnosis — yang rusak biasanya desain loop-nya, bukan otaknya.",
      },
      hints: [
        "Intuisi: kalau tugasmu selesai dalam SATU jawaban, itu wilayah chatbot. Kalau butuh 5+ langkah dengan cek hasil di tengah jalan, itu wilayah agen.",
        "Intuisi: setiap tool yang kamu berikan ke agen adalah \u201Ctangan\u201D baru sekaligus \u201Cpermukaan serangan\u201D baru. Daftar tools = daftar hal yang bisa salah.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: simulasi loop agen vs chatbot (mock, tanpa API key)",
      prose: [
        "Di lab ini kamu membangun dua sistem di atas \u201CLLM\u201D tiruan (fungsi Python biasa — tidak ada API key, tidak ada internet). `mock_llm_rencana` mengembalikan DAFTAR LANGKAH, bukan jawaban jadi. `mock_search` dan `mock_calc` adalah tools-nya. `mock_chatbot` menjawab langsung tanpa verifikasi apa pun.",
        "Tugasmu: implementasikan `run_agent`. Ia harus (1) meminta rencana ke mock LLM, (2) mengeksekusi tiap langkah dengan tool yang tepat (`search:` → `mock_search`, `calc:` → `mock_calc`), (3) mengembalikan kamus berisi jumlah tool call dan bukti yang terkumpul.",
        "Coba eksplorasi: ubah `mock_search` agar mengembalikan \u201Ctidak ditemukan\u201D untuk satu query. Apa yang terjadi pada agen? (Petunjuk: agen versi ini belum tahu cara menangani kegagalan tool — itu materi AAI3.)",
        "Eksperimen wajib setelah lab selesai: ubah `mock_search` agar query “kurs usd-idr” mengembalikan “tidak ditemukan”. Jalankan ulang. `run_agent` tetap melaporkan tool_calls=3 dan bukti=3 — tiga “bukti” yang salah satunya berbunyi “tidak ditemukan”. Agen versi ini tidak memeriksa ISI bukti; ia hanya menghitung langkah. Inilah perbedaan “selesai menjalankan langkah” vs “selesai mengerjakan tugas” — dan inilah alasan AAI8 (evaluasi) mengukur hasil, bukan aktivitas.",
        "Variasi kedua: tambah langkah keempat “verify:bandingkan-dua-sumber” ke `mock_llm_rencana`, lalu pikirkan tool verifikasi seperti apa yang masuk akal — misalnya memanggil `mock_search` kedua dengan query berbeda dan membandingkan angkanya. Di AAI3 kamu belajar membuat tool yang gagal dengan elegan; di AAI9 kamu belajar kapan agen boleh percaya pada hasil tool. Lab ini adalah fondasinya: loop tanpa verifikasi hanyalah chatbot yang lebih lambat.",
        "Jebakan mock yang terlalu baik: `mock_search` selalu mengembalikan jawaban benar, sehingga agenmu terlihat sempurna. Ingat — lab ini membuktikan ARSITEKTUR (loop bekerja), bukan KEANDALAN (loop bekerja di dunia nyata). Jangan pernah mendemokan mock ke direksi sebagai “agen yang sudah jadi”; itu seperti mendemokan mobil-mobilan dan mengklaim sudah punya armada. Bedakan selalu: apa yang dibuktikan lab vs apa yang masih asumsi.",
        "Dari mock ke nyata — tiga langkah yang menjembatani lab ini ke produksi. (1) Ganti `mock_search` dengan API sungguhan (satu fungsi, kontrak sama): agenmu langsung “hidup” karena ia hanya tahu kontrak, bukan implementasi. (2) Tambah `verify(hasil)` yang membandingkan dua sumber independen: lab mengajarkan loop, langkah ini mengajarkan KEPERCAYAAN. (3) Bungkus semuanya dengan anggaran (max 10 langkah, max Rp5.000): mock tidak punya tagihan, produksi punya. Tiga langkah ini = 80% jarak dari “lab yang jalan” ke “sistem yang boleh disentuh uang”.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `run_agent(tugas)` yang mengeksekusi tiap langkah rencana dengan tool yang tepat" },
        { id: "t2", text: "Pastikan `tool_calls` = 3 dan jalankan `print` sesuai format" },
      ],
      expected: "agen_tool_calls=3\nagen_bukti=3\nchatbot_verifikasi=0",
      note: {
        title: "Miskonsepsi: \u201CLLM di dalam agen harus cerdas dulu\u201D",
        type: "pitfall",
        body: "Yang benar: mock di lab ini membuktikan arsitektur loop-lah yang penting. Bahkan \u201CLLM\u201D berupa kamus Python bisa menjadi agen selama ada loop rencana → eksekusi → observasi. Kecerdasan model menaikkan kualitas rencana; loop-lah yang membuatnya menjadi agen.",
      },
      hints: [
        "Pisahkan langkah dengan `langkah.split(\":\", 1)` menjadi aksi dan argumen.",
        "Untuk `calc:`, ambil bagian setelah titik dua lalu teruskan ke `mock_calc`.",
        "Kembalikan `{\"tool_calls\": len(rencana), \"bukti\": bukti}`.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\ndef mock_llm_rencana(tugas):\n    return ["search:ihsg pekan ini", "search:kurs usd-idr", "calc:(16050-15800)/15800*100"]\n\ndef mock_search(langkah):\n    db = {"search:ihsg pekan ini": "IHSG 7412 (+0,8% sepekan)",\n          "search:kurs usd-idr": "USD/IDR 16050"}\n    return db.get(langkah, "tidak ditemukan")\n\ndef mock_calc(ekspresi):\n    return round(eval(ekspresi, {"__builtins__": {}}, {}), 2)\n\ndef mock_chatbot(tugas):\n    return "Ringkasan: IHSG menguat, rupiah stabil. (tanpa verifikasi)"\n\n# ===== TULIS KODEMU =====\ndef run_agent(tugas):\n    rencana = mock_llm_rencana(tugas)\n    bukti = []\n    # ... eksekusi tiap langkah dengan tool yang tepat ...\n    return {"tool_calls": 0, "bukti": bukti}\n\ntugas = "ringkasan risiko pasar mingguan"\nagen = run_agent(tugas)\ntool_calls = agen["tool_calls"]\nprint(f"agen_tool_calls={tool_calls}")\nprint(f"agen_bukti={len(agen['bukti'])}")\nprint(f"chatbot_verifikasi=0")`,
        lockLines: 16,
        solution: `# ===== MOCK — jangan diubah =====\ndef mock_llm_rencana(tugas):\n    return ["search:ihsg pekan ini", "search:kurs usd-idr", "calc:(16050-15800)/15800*100"]\n\ndef mock_search(langkah):\n    db = {"search:ihsg pekan ini": "IHSG 7412 (+0,8% sepekan)",\n          "search:kurs usd-idr": "USD/IDR 16050"}\n    return db.get(langkah, "tidak ditemukan")\n\ndef mock_calc(ekspresi):\n    return round(eval(ekspresi, {"__builtins__": {}}, {}), 2)\n\ndef mock_chatbot(tugas):\n    return "Ringkasan: IHSG menguat, rupiah stabil. (tanpa verifikasi)"\n\n# ===== TULIS KODEMU =====\ndef run_agent(tugas):\n    rencana = mock_llm_rencana(tugas)\n    bukti = []\n    for langkah in rencana:\n        aksi, arg = langkah.split(":", 1)\n        if aksi == "search":\n            bukti.append(mock_search(langkah))\n        elif aksi == "calc":\n            bukti.append(str(mock_calc(arg)))\n    return {"tool_calls": len(rencana), "bukti": bukti}\n\ntugas = "ringkasan risiko pasar mingguan"\nagen = run_agent(tugas)\ntool_calls = agen["tool_calls"]\nprint(f"agen_tool_calls={tool_calls}")\nprint(f"agen_bukti={len(agen['bukti'])}")\nprint(f"chatbot_verifikasi=0")`,
        checks: [
          { kind: "defined", task: "t1", name: "run_agent", label: "`run_agent` terdefinisi", msg: "Definisikan fungsi run_agent(tugas) di area editable." },
          { kind: "equal", task: "t2", name: "tool_calls", value: 3, tol: 1e-9, label: "`tool_calls` = 3", msg: "Rencana mock berisi 3 langkah. Kembalikan len(rencana) sebagai tool_calls." },
          { kind: "stdout_matches", task: "t2", pattern: "agen_tool_calls=3\\nagen_bukti=3\\nchatbot_verifikasi=0", label: "output tiga baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "str.split(\":\", 1), dict.get(kunci, default), eval dibatasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: chatbot, agen, atau skrip biasa?",
      prose: [
        "Tidak semua tugas butuh agen. Peta ini memetakan empat skenario tipikal ke pilihan yang tepat — salah pilih = bayar mahal untuk kemampuan yang tidak dipakai, atau gagal karena kemampuan yang kurang.",
        "Skenario 1 — FAQ produk yang jawabannya statis → CHATBOT (atau bahkan halaman bantuan). Tidak ada langkah, tidak ada verifikasi, tidak ada alasan membayar loop.",
        "Skenario 2 — laporan mingguan dari sumber yang berubah-ubah → AGEN. Langkahnya tidak bisa di-hardcode karena datanya bergerak; butuh search + hitung + tulis tiap pekan.",
        "Skenario 3 — hitung Value-at-Risk portofolio tiap malam → SKRIP BIASA (cron + Python). Deterministik, tidak butuh judgment bahasa. Agen di sini hanya menambah biaya dan risiko halusinasi.",
        "Skenario 4 — triase email nasabah prioritas dengan keputusan \u201Ceskalasi atau balas otomatis\u201D → AGEN + HUMAN GATE. Butuh judgment, tetapi keputusan final di tangan manusia (materi AAI9).",
        "Cara membaca: sumbu X = tiga pendekatan; tinggi batang biru = jam kerja manusia per laporan; titik oranye = rata-rata kesalahan faktual per laporan (angka ilustrasi dari pengalaman tim, bukan benchmark universal).",
        "Interpretasi: chatbot memangkas waktu menjadi setengah tetapi kesalahan melonjak 12× — total biaya (waktu + koreksi) justru naik. Agen memangkas waktu 12× DENGAN kesalahan tetap rendah: inilah zona di mana otonomi + tools + verifikasi membayar.",
        "Aturan praktis 10 detik: (1) Tugas 1 langkah? Chatbot. (2) Langkah pasti & berulang? Skrip. (3) Langkah tak pasti + butuh cek dunia nyata? Agen. (4) Ada keputusan berisiko? Agen + manusia.",
        "Skenario 5 — tanya-jawab di atas 200 halaman SOP internal: CHATBOT + RAG (jawab dengan sitasi), bukan agen penuh. Tidak ada aksi dunia nyata, tidak ada langkah tak pasti — hanya “temukan dan kutip”. Memberi agen otonom untuk tugas ini seperti menyewa supir pribadi untuk perjalanan yang bisa ditempuh dengan ojek online: bisa, tetapi biayanya 10× untuk nilai yang sama.",
        "Kuantifikasi aturan 10 detik untuk 100 tugas per bulan. Asumsi biaya per tugas: chatbot Rp500, agen Rp2.000 (token loop), skrip Rp50 (komputasi). Tugas deterministik 90×: skrip = Rp4.500 vs agen = Rp180.000 — agen 40× lebih mahal untuk hasil yang SAMA persis. Tugas tak pasti 10×: chatbot = Rp50.000 + biaya koreksi kesalahan (10 × 2,4 × Rp70.800 = Rp1,7 juta!) vs agen = Rp20.000 + koreksi (10 × 0,4 × Rp70.800 = Rp283 ribu). Total: skrip+agen campuran ≈ Rp308 ribu vs semua-chatbot ≈ Rp1,75 juta. Arsitektur yang tepat = 5,7× lebih murah.",
        "Skenario 6 — tugas SEKALI tetapi kritis (due diligence akuisisi Rp50 miliar): AGEN + VERIFIKASI MANUSIA 100%. Di sini biayanya bukan token — taruhannya adalah keputusan. Aturannya terbalik dari skenario rutin: untuk tugas kritis, otonomi DITURUNKAN (L2, bukan L3), verifikasi DINAIKKAN. “Kapan pakai agen” tidak hanya soal frekuensi dan biaya, tetapi juga soal TARUHAN: taruhan besar = manusia tetap di loop, apa pun efisiensinya.",
        "Checklist 60 detik sebelum memilih pendekatan — jawab jujur, lima pertanyaan. (1) Berapa LANGKAH? Satu → chatbot. (2) Apakah langkahnya PASTI dan BERULANG? Ya → skrip. (3) Apakah butuh FAKTA DUNIA NYATA yang berubah? Ya → butuh tools. (4) Apakah ada KEPUTUSAN BERISIKO (uang, data, reputasi)? Ya → butuh human gate. (5) Berapa TARUHANNYA jika salah? >Rp10 juta → turunkan otonomi satu level dari insting pertamamu. Lima pertanyaan, satu keputusan — dan keputusanmu kini punya alasan tertulis, bukan firasat.",
      ],
      note: {
        title: "💡 Intuisi: otonomi tanpa akuntabilitas = delegasi buta",
        body: "Setiap tingkat otonomi yang kamu berikan ke agen harus dibayar dengan satu mekanisme akuntabilitas: L2 dibayar dengan approval, L3 dengan audit trail yang dibaca manusia, L4 dengan kill switch + kemampuan rollback. Tim yang memberi L4 tetapi hanya punya akuntabilitas L1 tidak membangun agen — ia membangun insiden yang terjadwal.",
      },

      figure: {
        svg: BARS_SVG,
        alt: "Diagram batang: manual 6 jam 0,2 salah; chatbot 3 jam 2,4 salah; agen 0,5 jam 0,4 salah.",
        caption: "Ilustrasi trade-off waktu vs kesalahan: chatbot cepat tetapi ceroboh; agen cepat DAN terverifikasi.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: berapa harga satu angka karangan?",
      prose: [
        "Tim Dina: 3 analis, masing-masing membuat 1 laporan per pekan (4 laporan/bulan per orang = 12 laporan/bulan tim). Gaji analis Rp15 juta/bulan ≈ Rp85.000/jam (asumsi 176 jam kerja).",
        "Pendekatan chatbot: 1 jam membuat + rata-rata 2,4 kesalahan faktual per laporan. Setiap kesalahan butuh 50 menit klarifikasi ke direksi (Rp85.000 × 0,83 jam ≈ Rp70.800). Biaya per laporan = 1 × 85.000 + 2,4 × 70.800 = Rp254.920. Per bulan: 12 × 254.920 = Rp3.059.040.",
        "Pendekatan agen: 0,5 jam supervisi + 0,4 kesalahan per laporan. Biaya per laporan = 0,5 × 85.000 + 0,4 × 70.800 = Rp70.820. Per bulan: 12 × 70.820 = Rp849.840.",
        "Selisihnya Rp2,2 juta/bulan — dan itu BELUM menghitung biaya reputasi saat direksi menangkap kesalahan. Pelajaran angkanya: kecepatan tanpa verifikasi bukan efisiensi; ia hanya memindahkan biaya ke kolom \u201Cklarifikasi\u201D.",
        "Pembahasan: perhatikan bahwa perhitungan ini mengasumsikan kesalahan selalu tertangkap. Satu kesalahan yang LOLOS ke keputusan direksi (misal salah baca arah cadangan devisa) bisa berbiaya jutaan kali lipat. Itulah kenapa AAI8 (evaluasi) dan AAI9 (guardrail) ada di track ini.",
        "Analisis sensitivitas: bagaimana jika chatbot Dina “hanya” membuat 1,2 kesalahan per laporan (bukan 2,4)? Biaya chatbot = Rp85.000 + 1,2 × Rp70.800 = Rp169.960 per laporan — masih 2,4× lebih mahal dari agen (Rp70.820). Titik impasnya: kesalahan chatbot harus turun ke 0,37 per laporan agar biayanya menyamai agen. Chatbot tanpa verifikasi tidak akan pernah mencapai 0,37 — itu di bawah kemampuan arsitekturnya. Kesimpulan ini TAHAN terhadap variasi asumsi: agen menang bukan karena angkanya pas, melainkan karena strukturnya benar.",
        "Dan ingat: Rp2,2 juta per bulan adalah BATAS BAWAH — ia hanya menghitung kesalahan yang TERTANGKAP. Satu kesalahan yang lolos ke keputusan direksi (seperti kasus limit Rp2 miliar di cerita) berbiaya ratusan juta sekali kejadian. Jika peluang lolos 1 per 50 laporan dan dampaknya Rp200 juta, expected loss tambahannya = Rp4 juta per bulan — hampir 2× lipat total yang dihitung. Inilah mengapa AAI9 (guardrail) ada: menurunkan P(lolos), bukan sekadar P(salah).",
        "Skenario alternatif — tim 10 analis (bukan 3): 40 laporan/bulan per tim? Hitung ulang: 10 analis × 4 laporan = 40 laporan/bulan. Hemat per laporan Rp184.100 (254.920 − 70.820) × 40 = Rp7,36 juta/bulan. Keputusan arsitektur berskala LINEAR dengan volume — yang berarti analisis “worth it atau tidak” harus dihitung pada skala 12 bulan ke depan, bukan skala hari ini. Agen yang “kemahalan” untuk tim 3 orang bisa jadi “wajib” untuk tim 30 orang.",
        "Payback period investasi: membangun agen seperti ini ≈ 20 hari insinyur × Rp1,5 juta = Rp30 juta (lihat AAI12). Hemat Rp2,2 juta/bulan → payback 13,6 bulan — TANPA menghitung reputasi. Dengan expected loss reputasi Rp4 juta/bulan (satu kesalahan lolos per 50 laporan × Rp200 juta dampak): hemat total Rp6,2 juta/bulan → payback 4,8 bulan. Pelajaran presentasi ke direksi: jangan pernah ajukan investasi agen hanya dengan “hemat waktu” — sertakan “risiko yang dihindari”, karena itulah yang membuat payback masuk akal.",
        "Tabel keputusan tiga skenario dalam satu pandangan. Skenario RUTIN (tugas mingguan, taruhan rendah): chatbot Rp254.920/laporan vs agen Rp70.820 — agen menang 3,6×. Skenario KRITIS (tugas kuartalan, taruhan Rp200 juta): chatbot = Rp254.920 + (1/50 × Rp200 juta)/laporan = Rp4,25 juta ekspektasi; agen + verifikasi manusia = Rp70.820 + Rp42.500 (30 menit review) + (1/500 × Rp200 juta) = Rp513 ribu — agen menang 8,3×. Skenario SEKALI (tugas satu kali, 2 jam manual = Rp170 ribu): chatbot Rp500 + risiko vs manual Rp170 ribu — MANUAL menang; jangan bangun agen untuk tugas sekali. Tiga skenario, tiga pemenang berbeda — “agen selalu terbaik” adalah slogan, bukan strategi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risk reporting, biaya kesalahan bukan linear. Satu angka salah di laporan risiko bisa memicu keputusan limit yang salah — expected loss-nya = P(lolos) × dampak. Agen menurunkan P(lolos) lewat verifikasi tool, bukan lewat \u201Clebih pintar\u201D.",
      },
    },    {
      id: "lab-rantai-dua-desain",
      eyebrow: "Langkah 6 · Lab rantai peluang",
      title: "Lab: dua desain, satu rantai — berapa selisihnya?",
      prose: [
        "Desain D (agen Dina hari ini): P(rencana)=0,8, P(tool)=0,9, P(verifikasi)=0,95. Desain E (tambah sumber ketiga untuk verifikasi): P(verifikasi) naik ke 0,99, sisanya sama. Tugasmu: hitung P(berhasil) keduanya dan selisihnya — lalu jawab: apakah kenaikan 3 poin itu sepadan dengan biaya sumber ketiga?",
        "Ingat pelajaran Langkah 2: perkalian membuat perbaikan di mata terlemah paling berharga — tetapi di sini mata terlemahnya bukan verifikasi (0,95 sudah tinggi), melainkan rencana (0,8). Hitung dulu, baru berdebat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_d` dan `p_e` (P berhasil tiap desain, 3 desimal)" },
        { id: "t2", text: "Hitung `selisih` = p_e - p_d dan cetak ketiganya" },
      ],
      expected: "p_d=0.684\np_e=0.713\nselisih=0.029",
      note: {
        title: "💡 Intuisi",
        body: "Selisihnya hanya 0,029 — karena rantai dikali, menaikkan mata yang sudah 0,95 ke 0,99 hanya menambah sedikit. Bila sumber ketiga berharga Rp12.756/bulan (AAI1), keputusan membelinya harus membandingkan 0,029 dengan harga itu — bukan dengan perasaan.",
      },
      hints: [
        "p = p_rencana * p_tool * p_verifikasi.",
        "Bulatkan 3 desimal: round(x, 3).",
      ],
      code: {
        starter: `# DATA — jangan diubah
P_RENCANA, P_TOOL = 0.8, 0.9
P_VER_D, P_VER_E = 0.95, 0.99

# TULIS KODEMU
p_d = ...
p_e = ...
selisih = ...

print(f"p_d={p_d:.3f}")
print(f"p_e={p_e:.3f}")
print(f"selisih={selisih:.3f}")`,
        lockLines: 5,
        solution: `# DATA — jangan diubah
P_RENCANA, P_TOOL = 0.8, 0.9
P_VER_D, P_VER_E = 0.95, 0.99

# TULIS KODEMU
p_d = round(P_RENCANA * P_TOOL * P_VER_D, 3)
p_e = round(P_RENCANA * P_TOOL * P_VER_E, 3)
selisih = round(p_e - p_d, 3)

print(f"p_d={p_d:.3f}")
print(f"p_e={p_e:.3f}")
print(f"selisih={selisih:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_d", value: 0.684, tol: 0.001, label: "`p_d` = 0.684", msg: "0,8 x 0,9 x 0,95 = 0,684." },
          { kind: "equal", task: "t1", name: "p_e", value: 0.713, tol: 0.001, label: "`p_e` = 0.713", msg: "0,8 x 0,9 x 0,99 = 0,7128 -> 0,713." },
          { kind: "equal", task: "t2", name: "selisih", value: 0.029, tol: 0.001, label: "`selisih` = 0.029", msg: "0,713 - 0,684 = 0,029." },
          { kind: "stdout_matches", task: "t2", pattern: "p_d=0\\.684\\np_e=0\\.713\\nselisih=0\\.029", label: "output tiga baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Rantai dikali: perbaikan di mata yang sudah kuat menambah sedikit.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi menjelaskan alasannya — baca yang salah juga, di situlah jebakannya.",
      ],
      tasks: [],
      summary: [
        "Agen = tujuan + otonomi memilih tindakan + tools + observasi hasil dalam loop.",
        "Chatbot mengoptimalkan respons yang meyakinkan; agen mengoptimalkan tugas yang selesai benar.",
        "P(berhasil) = P(rencana) × P(tool|rencana) × P(verifikasi) — rantai sekuat mata terlemahnya.",
        "Tidak semua tugas butuh agen: 1 langkah → chatbot; deterministik → skrip; tak pasti + verifikasi → agen.",
        "Kecepatan tanpa verifikasi memindahkan biaya ke klarifikasi — hitung total cost, bukan waktu mentah.",
      ],
      next: { label: "AAI18 — Fondasi API LLM untuk Agen", href: "/v2/learn/aai18-fondasi-api-llm" },
      quiz: [
        {
          q: "Apa pembeda UTAMA agen dari chatbot?",
          options: [
            { text: "Model bahasa yang lebih besar", why: "Ukuran model tidak menentukan. Model yang sama bisa berperan sebagai chatbot atau agen tergantung arsitekturnya.", },
            { text: "Loop otonom: tujuan + pilihan tindakan + tools + observasi", why: "Tepat. Arsitektur loop inilah yang membuat sistem bisa menyelesaikan tugas multi-langkah.", correct: true },
            { text: "Bisa menjawab dalam Bahasa Indonesia", why: "Itu kemampuan bahasa, bukan keagenan. Chatbot biasa pun bisa.", },
            { text: "Dilatih dengan lebih banyak data", why: "Data training memengaruhi pengetahuan, bukan kemampuan bertindak otonom.", },
          ],
        },
        {
          q: "Sebuah agen punya P(rencana benar)=0,9, P(tool benar|rencana)=0,8, P(verifikasi lolos)=0,9. Perkiraan P(berhasil)?",
          options: [
            { text: "0,90 (mengikuti yang tertinggi)", why: "Rantai perkalian tidak mengikuti mata terkuat — justru sebaliknya.", },
            { text: "0,65", why: "0,9 × 0,8 × 0,9 = 0,648 ≈ 0,65. Tiga tahap \u201Ccukup baik\u201D menghasilkan sistem yang hanya berhasil 2 dari 3 kali.", correct: true },
            { text: "0,80 (rata-rata)", why: "Peluang berantai dikalikan, bukan dirata-rata.", },
            { text: "2,60 (dijumlahkan)", why: "Peluang tidak bisa dijumlahkan melebihi 1.", },
          ],
        },
        {
          q: "Tugas: hitung VaR portofolio tiap malam dari data yang sama. Pilihan TEPAT?",
          options: [
            { text: "Agen otonom penuh", why: "Berlebihan: tugas deterministik dan berulang tidak butuh judgment bahasa — hanya menambah biaya dan risiko.", },
            { text: "Skrip terjadwal (cron + Python)", why: "Tepat. Deterministik, teraudit, murah. Agen adalah solusi untuk ketidakpastian, bukan untuk rutinitas pasti.", correct: true },
            { text: "Chatbot yang ditanya tiap malam", why: "Manual, tidak teraudit, dan rawan salah salin angka.", },
            { text: "Multi-agent dengan 5 peran", why: "Over-engineering untuk perhitungan yang rumusnya tetap.", },
          ],
        },
        {
          q: "Kenapa mock \u201CLLM\u201D berupa kamus Python di lab tetap bisa disebut agen?",
          options: [
            { text: "Karena kodenya panjang", why: "Panjang kode tidak relevan dengan definisi agen.", },
            { text: "Karena ada loop rencana → eksekusi tool → observasi", why: "Tepat. Keagenan datang dari arsitektur loop, bukan dari kecerdasan model di dalamnya.", correct: true },
            { text: "Karena memakai eval()", why: "eval hanyalah implementasi kalkulator mock — bukan syarat agen.", },
            { text: "Karena outputnya selalu benar", why: "Kebenaran output adalah hasil evaluasi, bukan definisi.", },
          ],
        },
        {
          q: "Twist cerita Dina: apa kegagalan sebenarnya dari chatbot itu?",
          options: [
            { text: "Ia tidak bisa berbahasa Indonesia dengan baik", why: "Bahasa bukan masalahnya — teksnya justru rapi dan meyakinkan.", },
            { text: "Ia mengoptimalkan kalimat yang meyakinkan, bukan tugas yang benar", why: "Tepat. Tanpa tujuan, tools, dan verifikasi, ia \u201Cberhasil\u201D pada metrik yang salah.", correct: true },
            { text: "Ia terlalu lambat menjawab", why: "Ia justru terlalu cepat — 30 detik tanpa verifikasi.", },
            { text: "Ia menolak menjawab pertanyaan", why: "Sebaliknya: ia menjawab dengan percaya diri meski datanya basi.", },
          ],
        },
        {
          q: "Desain D: 0,8 x 0,9 x 0,95 = 0,684. Desain E menaikkan verifikasi ke 0,99. P(berhasil) E dan selisihnya?",
          options: [
            { text: "0,713 — selisih 0,029", why: "Benar: 0,8 x 0,9 x 0,99 = 0,7128. Perbaikan kecil karena verifikasi sudah kuat — mata terlemahnya rencana (0,8).", correct: true },
            { text: "0,99 — mengikuti mata terkuat", why: "Rantai dikali, bukan mengikuti yang tertinggi.", },
            { text: "0,684 — tidak berubah", why: "Berubah: verifikasi naik 0,04 poin, hasilnya naik 0,029.", },
            { text: "1,00 — verifikasi sempurna berarti sistem sempurna", why: "Verifikasi 0,99 bukan 1,00 — dan dua mata lain tetap di bawah 1.", },
          ],
        },
        {
          q: "Mata rantai mana yang paling berharga diperbaiki bila P(rencana)=0,8, P(tool)=0,9, P(verifikasi)=0,95?",
          options: [
            { text: "Verifikasi — naikkan ke 0,99", why: "Itu hanya menambah 0,029 — mata yang sudah kuat.", },
            { text: "Rencana — mata terlemah (0,8); tiap poin di sana mengalikan seluruh rantai", why: "Benar: perkalian membuat perbaikan di mata terlemah paling berharga.", correct: true },
            { text: "Tool — karena di tengah", why: "Posisi di rantai tidak menentukan — nilainya yang menentukan.", },
            { text: "Ketiganya sama berharganya", why: "Tidak: turunan P(berhasil) terhadap tiap faktor berbeda — terhadap rencana 0,855, terhadap verifikasi 0,72.", },
          ],
        },
      ],
    },
  ],
};
