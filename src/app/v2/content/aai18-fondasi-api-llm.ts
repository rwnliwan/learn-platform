import type { V2Lesson } from "../lib/types";

// Ilustrasi: biaya per 1.000 panggilan agen — konteks ramping vs konteks bengkak.
const BIAYA_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Biaya per 1.000 panggilan: konteks ramping Rp210 ribu vs konteks bengkak Rp3,36 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="16" x2="456" y2="16"/><line x1="56" y1="56" x2="456" y2="56"/><line x1="56" y1="96" x2="456" y2="96"/><line x1="56" y1="136" x2="456" y2="136"/><line x1="56" y1="176" x2="456" y2="176"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="20">3,5 jt</text><text x="50" y="60">2,6 jt</text><text x="50" y="100">1,75 jt</text><text x="50" y="140">0,9 jt</text><text x="50" y="180">0</text></g>
<text x="20" y="100" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 20 100)">Rp / 1.000 call</text>
<rect x="110" y="164" width="80" height="12" fill="var(--c1)"/><text x="150" y="196" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Ramping</text><text x="150" y="158" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Rp210 rb</text>
<rect x="290" y="28" width="80" height="148" fill="var(--c4)"/><text x="330" y="196" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Bengkak</text><text x="330" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Rp3,36 jt</text>
<text x="150" y="216" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">2k in + 0,5k out</text>
<text x="330" y="216" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">32k in + 0,5k out</text>
</svg>`;

export const aai18: V2Lesson = {
  slug: "aai18-fondasi-api-llm",
  track: "Agentic AI Engineer",
  module: "Fondasi Agen",
  title: "AAI18 — Fondasi API LLM untuk Agen",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Sebelum agen bisa berpikir dalam loop, ia harus bisa BERBICARA dengan mesin. Lesson ini adalah fondasi teknisnya: bagaimana agenmu memanggil model bahasa lewat API, kenapa keluarannya harus terstruktur, dan di mana tagihan sembunyi.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan anatomi satu panggilan API LLM: peran pesan, token, dan parameter pengendali; (2) menerapkan keluaran terstruktur (JSON mode & skema) agar agen tidak berkomunikasi lewat prosa bebas; (3) menjelaskan tool calling sebagai kontrak — model memilih, kode kamulah yang mengeksekusi; (4) merancang ketahanan panggilan: streaming, retry ber-backoff, dan idempotensi untuk panggilan berbiaya; (5) menghitung biaya panggilan dari token input/output dan mendeteksi kebocoran konteks.",
        "Daftar isi: 1) Peta · 2) Cerita: agen pintar yang kehilangan 40% pesanan · 3) Anatomi panggilan API · 4) Keluaran terstruktur · 5) Tool calling sebagai kontrak · 6) Lab: parser ketat & skema · 7) Streaming, kesalahan & ketahanan · 8) Biaya: konteks yang membengkak · 9) Peta keputusan · 10) Mini-case · 11) Checkpoint.",
        "Bekal ringkas (self-contained): kamu sudah tahu dari AAI1 bahwa agen bekerja dalam loop rencana → eksekusi tool → observasi. Setiap putaran loop itu = satu atau beberapa panggilan API. Lesson ini mengupas panggilan itu sampai ke baut-bautnya. Tidak ada prasyarat lain.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Agen yang pintar, tetapi tuli terhadap sistem sendiri",
      prose: [
        "TokoNusa, sebuah ritel online di Surabaya, membangun agen pemesanan lewat chat. Modelnya kuat, promptnya rapi, demonya memukau: pelanggan mengetik “2 kopi susu”, agen menjawab dengan ramah dan — katanya — meneruskan pesanan ke sistem. Manajemen puas. Lalu minggu pertama operasional: 40% pesanan tidak pernah masuk sistem.",
        "Tim teknis panik. Log model menunjukkan agen “menjawab dengan benar” — ia menulis “Baik, pesanan 2 kopi susu @ Rp15.000 dicatat, terima kasih!”. Tapi jembatan antara agen dan sistem pemesanan — sebuah skrip parser sederhana — mengharapkan JSON seperti `{\"item\": \"kopi susu\", \"qty\": 2}`. Agen justru menulis prosa bebas yang indah, sopan, dan… tidak bisa diparse. Kadang ia menulis “2 kopi susu”, kadang “dua cangkir Kopi Susu”, kadang menyelipkan “(promo: gratis gula aren!)”. Parser gagal diam-diam. Pesanan hilang.",
        "Twist-nya: kegagalannya bukan di modelnya. Model itu melakukan persis yang ia dilatih lakukan: menghasilkan teks yang terdengar meyakinkan. Yang rusak adalah KONTRAKNYA — tidak ada perjanjian tertulis tentang bentuk keluaran. Tim itu memperlakukan model seperti pegawai yang “paham maksud”, padahal ia adalah mesin teks tanpa memori tentang format yang kamu harapkan kemarin.",
        "Perbaikannya memakan dua hari, bukan dua bulan: mereka mengaktifkan JSON mode dengan skema tertulis, menambahkan validasi di sisi kode, dan — yang paling penting — mengubah aturan main: keluaran yang gagal validasi DITOLAK dan diminta ulang, bukan diteruskan dengan harapan. Tingkat kegagalan parse turun dari 40% ke 0,4%. Pelajarannya: agen yang hebat bukan yang paling pintar berbicara, melainkan yang paling bisa dipercaya mesin lain untuk dibaca.",
        "Tiga pola yang akan kamu kenali di lesson ini — dan di setiap kegagalan agen di dunia nyata. Pola 1: prosa bebas sebagai antarmuka (cerita TokoNusa). Pola 2: model “memilih” tool tetapi argumennya ngawur karena kontrak tool tidak tertulis. Pola 3: tagihan meledak karena setiap panggilan membawa seluruh riwayat percakapan. Ketiganya punya akar yang sama: memperlakukan API seperti manusia, bukan seperti mesin.",
      ],
      note: {
        title: "💡 Intuisi: API adalah mesin vending, bukan resepsionis",
        body: "Resepsionis bisa kamu ajak ngobrol dan ia “paham maksudmu”. Mesin vending hanya merespons kombinasi tombol yang tepat — masukkan koin salah, tidak keluar apa-apa. Panggilan API LLM lebih mirip mesin vending: ia menerima struktur persis (pesan, parameter, skema) dan mengembalikan struktur. “Paham maksud” adalah ilusi yang mahal; kontrak yang tertulis adalah kenyataan yang murah.",
      },
      tasks: [],
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi satu panggilan API LLM",
      prose: [
        "Satu panggilan API LLM terdiri dari tiga bahan. Pertama, DAFTAR PESAN: setiap pesan punya `role` — `system` (instruksi tetap, mis. “kamu asisten pemesanan”), `user` (masukan pelanggan), `assistant` (jawaban model sebelumnya), dan `tool` (hasil eksekusi tool yang kamu kembalikan). Model tidak “ingat” apa-apa di antara panggilan; yang ia lihat hanyalah daftar pesan yang kamu kirim SEKARANG. Inilah kenapa konteks membengkak: setiap putaran loop, daftar pesan tumbuh.",
        "Kedua, TOKEN: satuan tagihan dan satuan batas. Satu token ≈ ¾ kata Inggris (≈ 1–2 kata Indonesia). Setiap model punya jendela konteks — mis. 128 ribu token — yang mencakup SEMUA pesan masuk PLUS keluaran yang dihasilkan. Panggilan gagal bukan hanya karena “kepanjangan”, tetapi karena biaya dan latensi naik sebanding dengan token yang dikirim.",
        "Ketiga, PARAMETER pengendali — dua yang paling menentukan. `temperature`: seberapa acak pilihan kata berikutnya. 0 = deterministik (selalu pilih yang paling mungkin — cocok untuk ekstraksi data dan agen), 1+ = kreatif/variatif (cocok untuk brainstorming, berbahaya untuk agen yang butuh konsistensi). `max_tokens`: batas panjang keluaran — pemotong darurat agar model tidak menulis esai saat kamu minta satu angka.",
        "Kepribadiannya: API LLM itu seperti koki katering yang buta terhadap dapurmu. Kamu kirim daftar belanja lengkap (pesan) + catatan cara masak (parameter); ia mengembalikan hidangan. Ia tidak tahu apa yang kamu masak kemarin kecuali kamu kirim ulang resepnya. Setiap panggilan = mulai dari nol dengan semua bahan di tangan.",
        "Kapan memakai apa: `temperature` rendah (0–0,2) untuk semua langkah agen yang menentukan tindakan — parsing, pilihan tool, argumen. `temperature` lebih tinggi hanya untuk langkah yang memang butuh variasi (draf pesan ke pelanggan). `max_tokens` kecil untuk klasifikasi/ekstraksi; besar hanya untuk penulisan dokumen. Aturan praktis: parameter adalah bagian dari desain, bukan setelan “nanti saja”.",
      ],
      note: {
        title: "Miskonsepsi: “Model mengingat percakapan kita”",
        type: "pitfall",
        body: "Yang benar: API tidak punya memori antar panggilan. “Ingatan” percakapanmu adalah kamu (atau framework-mu) yang mengirim ulang SELURUH riwayat setiap kali. Konsekuensinya: (1) setiap putaran loop agen makin mahal karena riwayat makin panjang; (2) kalau kamu lupa menyertakan instruksi system di satu panggilan, model berperilaku seolah instruksi itu tidak pernah ada. Ingatan = data yang kamu kirim ulang, bukan sifat model.",
      },
      tasks: [],
      reference: "Panggilan = daftar pesan + token + parameter. Tidak ada memori antar panggilan — konteks adalah data yang kamu kirim ulang.",
    },
    {
      id: "terstruktur",
      eyebrow: "Langkah 4 · Konsep",
      title: "Keluaran terstruktur: berhenti bicara, mulai berkontrak",
      prose: [
        "Agen tidak butuh model yang fasih; ia butuh model yang BISA DIBACA MESIN. Keluaran terstruktur berarti respons model mengikuti SKEMA yang kamu tetapkan — mis. JSON dengan field wajib `item` (string), `qty` (integer > 0). JSON mode memaksa model menghasilkan JSON valid; skema (JSON Schema) memaksa field dan tipenya benar. Bedanya: JSON valid belum tentu BENAR — `{\"qty\": \"dua\"}` adalah JSON valid tetapi gagal skema.",
        "Kenapa ini fondasi agen, bukan sekadar kerapian? Karena setiap langkah agen adalah rantai: keluaran langkah 1 = masukan langkah 2. Satu keluaran berformat bebas di tengah rantai = seluruh rantai berikutnya menebak-nebak. TokoNusa kehilangan 40% pesanan bukan karena modelnya bodoh, melainkan karena satu mata rantai berkomunikasi lewat prosa.",
        "Kegagalan parse punya tiga wajah — dan tiga penanganan. (1) Bukan JSON sama sekali (prosa bebas): tolak, minta ulang dengan instruksi lebih tegas. (2) JSON tetapi melanggar skema (field hilang, tipe salah): tolak, sertakan pesan kesalahan validasi dalam permintaan ulang — model cukup pandai memperbaiki diri bila diberi tahu SALAHNYA DI MANA. (3) JSON valid & lolos skema tetapi isinya ngawur (qty = 9999): ini bukan kegagalan parse, melainkan kegagalan VALIDASI BISNIS — tangani dengan aturan domain (batas wajar), bukan dengan skema.",
        "Kepribadiannya: skema adalah formulir, bukan esai. Esai dinilai dari keindahan; formulir dinilai dari kelengkapan kotak yang benar. Meminta model mengisi formulir (JSON + skema) mengubahnya dari penulis menjadi petugas administrasi — dan petugas administrasi yang membosankan itulah yang kamu butuhkan di tengah loop agen.",
        "Kapan JSON mode tidak cukup: ketika kamu butuh model MEMILIH TINDAKAN, bukan sekadar mengisi field — di situlah tool calling (langkah berikutnya) mengambil alih. JSON mode = “isi formulir ini”. Tool calling = “pilih salah satu pekerjaan berikut dan isi detailnya”.",
      ],
      note: {
        title: "Miskonsepsi: “JSON mode = keluaran selalu benar”",
        type: "pitfall",
        body: "Yang benar: JSON mode hanya menjamin BENTUK (kurung kurawal pada tempatnya), bukan ISI. Model tetap bisa mengarang `{\"qty\": -3}` atau `{\"item\": \"unicorn\"}`. Selalu lapisi dengan validasi skema di kode (tipe, rentang, field wajib) DAN validasi bisnis (apakah nilainya masuk akal). Tiga lapis: bentuk → skema → bisnis. Melewatkan satu lapis = membiarkan satu kelas kesalahan lolos.",
      },
      tasks: [],
      reference: "Tiga lapis pertahanan keluaran: JSON valid → lolos skema → masuk akal secara bisnis. Kegagalan di tiap lapis punya penanganan berbeda.",
    },
    {
      id: "tool-calling",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tool calling: model memilih, kodemu yang mengeksekusi",
      prose: [
        "Tool calling adalah kontrak kerja antara model dan kodemu. Kamu mendaftarkan TOOLS — masing-masing dengan nama, deskripsi (“cari produk di katalog”), dan skema argumen (`query`: string, `limit`: integer). Model membaca daftar itu, lalu dalam responsnya ia tidak menjawab langsung — ia mengusulkan: “panggil `cari_produk` dengan argumen `{\"query\": \"kopi susu\", \"limit\": 5}`”.",
        "Poin yang paling sering disalahpahami: MODEL TIDAK MENGEKSEKUSI APA PUN. Ia hanya mengusulkan panggilan dalam format terstruktur. Kodemu yang menerima usulan itu, memvalidasi argumennya, mengeksekusi fungsi sungguhan, lalu mengembalikan hasilnya sebagai pesan ber-`role: \"tool\"`. Model “melihat” hasil itu di panggilan berikutnya dan melanjutkan. Agen = loop usulan → eksekusi → observasi.",
        "Kenapa ini lebih aman daripada “model menulis kode lalu dijalankan”? Karena kontraknya eksplisit dan terbatas: model hanya bisa mengusulkan tool yang terdaftar, dengan argumen yang lolos skema. Ia tidak bisa tiba-tiba memanggil fungsi hapus-database — kecuali KAMU yang mendaftarkannya (dan itu salahmu, bukan salah model). Permukaan serangan agen = daftar tool yang kamu daftarkan. Daftarkan sedikit, deskripsikan presisi.",
        "Kegagalan khas tool calling — dan obatnya. (1) Model memilih tool yang salah: perbaiki DESKRIPSI tool (model memilih berdasarkan deskripsi, bukan namanya). (2) Argumen ngawur: perketat skema + beri contoh di deskripsi. (3) Model menjawab langsung padahal seharusnya memanggil tool: tegaskan di system prompt kapan tool WAJIB dipakai (“jangan menjawab dari ingatan untuk harga — selalu panggil cek_harga”).",
        "Kepribadiannya: tool calling seperti memesan lewat pramusaji dengan menu tertulis. Kamu (model) tidak masuk dapur; kamu menulis pesanan di kertas (usulan terstruktur), pramusaji (kodemu) yang membawanya ke dapur dan kembali dengan hidangan (hasil tool). Kalau kertasnya salah tulis, yang disalahkan bukan dapurnya — melainkan siapa yang menulis kertas dan siapa yang memeriksa sebelum dikirim.",
      ],
      note: {
        title: "Miskonsepsi: “Memberi tool ke model = model bisa melakukan apa saja”",
        type: "pitfall",
        body: "Yang benar: model hanya bisa MENGUSULKAN tool yang terdaftar — eksekusi 100% di tangan kodemu. Ini kabar baik sekaligus tanggung jawab: kamu memegang kendali penuh atas apa yang benar-benar terjadi di dunia (kirim email, potong saldo, hapus data). Desain yang dewasa: tool berisiko butuh konfirmasi manusia; tool baca-saja boleh otomatis. Jangan pernah mendaftarkan tool destruktif tanpa gerbang persetujuan.",
      },
      tasks: [],
      reference: "Kontrak tool calling: model mengusulkan (nama + argumen terstruktur), kode memvalidasi & mengeksekusi, hasil kembali sebagai pesan tool.",
    },
    {
      id: "lab-parser",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: parser ketat dengan skema",
      prose: [
        "Sekarang kamu membangun pertahanan TokoNusa: sebuah `validasi(teks)` yang mengklasifikasikan setiap keluaran model menjadi tiga kelas. `ok` = JSON valid DAN lolos skema (field `nama` string, `jumlah` integer > 0, `harga` integer > 0; field tambahan diabaikan). `parse_gagal` = bukan JSON sama sekali. `skema_gagal` = JSON tetapi field hilang atau nilainya tidak valid.",
        "Data sudah tertanam: 6 keluaran mencakup ketiga kelas — JSON valid, JSON rusak (koma menggantung), prosa bebas, field hilang, dan jumlah nol. Tugasmu: tulis fungsi validasi, kelompokkan ID ke dict `hasil`, lalu cetak ringkasannya.",
        "Coba eksplorasi setelah selesai: ubah satu keluaran menjadi `{\"nama\": \"Kopi\", \"jumlah\": 2, \"harga\": -5000}`. Kelas apa yang benar? (Petunjuk: harga negatif lolos JSON dan lolos “ada field-nya” — tetapi gagal aturan bisnis `> 0`. Inilah beda skema vs validasi bisnis dari langkah 4.)",
        "Eksperimen kedua: tambahkan field `diskon` opsional ke satu keluaran valid. Apakah klasifikasinya berubah? Seharusnya tidak — skema yang baik mengabaikan field tambahan. Kalau validasimu menolaknya, skemamu terlalu kaku untuk dunia nyata.",
      ],
      tasks: [
        { id: "t1", text: "Definisikan `validasi(teks)` yang mengembalikan tepat satu dari: \"ok\", \"parse_gagal\", \"skema_gagal\"" },
        { id: "t2", text: "Isi dict `hasil` dengan daftar ID per kelas, lalu cetak ringkasan sesuai format" },
      ],
      expected: "ok=2 parse_gagal=2 skema_gagal=2",
      note: {
        title: "Kaitan ke produksi",
        type: "risk",
        body: "Di produksi, pola ini menjadi middleware: setiap keluaran model melewati validasi SEBELUM diteruskan ke langkah berikut. Yang `parse_gagal`/`skema_gagal` tidak dibuang diam-diam — mereka diminta ulang (retry) dengan pesan kesalahan validasi dilampirkan, maksimal 2 kali, lalu eskalasi ke manusia. Tanpa middleware ini, kamu membangun TokoNusa jilid dua.",
      },
      hints: [
        "Gunakan `json.loads` di dalam `try/except json.JSONDecodeError` untuk membedakan parse_gagal.",
        "Setelah lolos parse, cek `isinstance(data, dict)` dulu sebelum mengakses field.",
        "Cek tipe dengan `isinstance(..., int)` — hati-hati, di Python `bool` adalah subclass `int`.",
      ],
      code: {
        starter: `# ===== DATA keluaran model — jangan diubah =====
keluaran = [
    {"id": "O1", "teks": '{"nama": "Kopi Susu", "jumlah": 2, "harga": 15000}'},
    {"id": "O2", "teks": '{"nama": "Roti Bakar", "jumlah": 1}'},
    {"id": "O3", "teks": '{"nama": "Teh Manis", "jumlah": 3, "harga": 8000}, '},
    {"id": "O4", "teks": "Pesanan: 2 Kopi Susu seharga Rp15.000 per cangkir"},
    {"id": "O5", "teks": '{"nama": "Es Cokelat", "jumlah": 0, "harga": 12000}'},
    {"id": "O6", "teks": '{"nama": "Pisang Goreng", "jumlah": 4, "harga": 20000, "catatan": "panas"}'},
]
# TULIS KODEMU: definisikan validasi(teks) -> "ok" | "parse_gagal" | "skema_gagal",
# lalu isi dict hasil = {"ok": [...], "parse_gagal": [...], "skema_gagal": [...]}
# dan cetak: ok=X parse_gagal=Y skema_gagal=Z`,
        lockLines: 10,
        solution: `# ===== DATA keluaran model — jangan diubah =====
keluaran = [
    {"id": "O1", "teks": '{"nama": "Kopi Susu", "jumlah": 2, "harga": 15000}'},
    {"id": "O2", "teks": '{"nama": "Roti Bakar", "jumlah": 1}'},
    {"id": "O3", "teks": '{"nama": "Teh Manis", "jumlah": 3, "harga": 8000}, '},
    {"id": "O4", "teks": "Pesanan: 2 Kopi Susu seharga Rp15.000 per cangkir"},
    {"id": "O5", "teks": '{"nama": "Es Cokelat", "jumlah": 0, "harga": 12000}'},
    {"id": "O6", "teks": '{"nama": "Pisang Goreng", "jumlah": 4, "harga": 20000, "catatan": "panas"}'},
]
# TULIS KODEMU: definisikan validasi(teks) -> "ok" | "parse_gagal" | "skema_gagal",
# lalu isi dict hasil = {"ok": [...], "parse_gagal": [...], "skema_gagal": [...]}
# dan cetak: ok=X parse_gagal=Y skema_gagal=Z
import json

def validasi(teks):
    try:
        data = json.loads(teks)
    except json.JSONDecodeError:
        return "parse_gagal"
    if not isinstance(data, dict):
        return "parse_gagal"
    if not isinstance(data.get("nama"), str):
        return "skema_gagal"
    if not isinstance(data.get("jumlah"), int) or data["jumlah"] <= 0:
        return "skema_gagal"
    if not isinstance(data.get("harga"), int) or data["harga"] <= 0:
        return "skema_gagal"
    return "ok"

hasil = {"ok": [], "parse_gagal": [], "skema_gagal": []}
for k in keluaran:
    hasil[validasi(k["teks"])].append(k["id"])

print(f"ok={len(hasil['ok'])} parse_gagal={len(hasil['parse_gagal'])} skema_gagal={len(hasil['skema_gagal'])}")`,
        checks: [
          { kind: "defined", task: "t1", name: "validasi", label: "`validasi` terdefinisi", msg: "Definisikan fungsi validasi(teks) di area editable." },
          { kind: "equal", task: "t1", name: "hasil", value: { "ok": ["O1", "O6"], "parse_gagal": ["O3", "O4"], "skema_gagal": ["O2", "O5"] }, label: "klasifikasi 6 keluaran tepat", msg: "O1 & O6 valid; O3 (koma menggantung) & O4 (prosa) = parse_gagal; O2 (harga hilang) & O5 (jumlah 0) = skema_gagal." },
          { kind: "stdout_matches", task: "t2", pattern: "ok=2 parse_gagal=2 skema_gagal=2", label: "ringkasan tercetak sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Validasi berlapis: parse dulu (JSON?), lalu skema (field & tipe?), lalu bisnis (> 0?). Setiap lapis punya kelas kegagalannya sendiri.",
    },
    {
      id: "ketahanan",
      eyebrow: "Langkah 7 · Konsep",
      title: "Streaming, kesalahan, dan ketahanan panggilan",
      prose: [
        "Dua hal tentang WAKTU. Pertama, STREAMING: alih-alih menunggu respons lengkap, API bisa mengirim token per token saat dihasilkan. Yang dirasakan pengguna bukan total waktu, melainkan waktu-ke-token-pertama. Agen chat yang streaming terasa “hidup” dalam 0,5 detik meski jawaban lengkapnya butuh 8 detik. Untuk langkah agen yang hasilnya dibaca mesin (bukan manusia), streaming tidak ada gunanya — matikan saja dan hemat kompleksitas.",
        "Kedua, KESALAHAN — API bisa gagal dengan cara yang bisa diprediksi. `429 rate limit`: kamu memanggil terlalu cepat — obatnya bukan mengulang seketika, melainkan menunggu lalu mengulang (retry dengan backoff: tunggu 1 dtk, lalu 2, lalu 4…). `timeout`: model tidak menjawab dalam batas waktu — bedakan timeout BACA (respons lambat) dari kegagalan total. `5xx`: masalah di sisi provider — retry layak dicoba; `4xx` (selain 429): permintaanmu yang salah — retry tidak akan membantu, perbaiki dulu.",
        "IDEMPOTENSI: untuk panggilan BERBIAYA atau BERDAMPAK (potong saldo, kirim email, buat pesanan), retry buta berbahaya — percobaan kedua yang “berhasil” bisa mengeksekusi dua kali. Solusinya: kunci idempotensi — setiap operasi membawa ID unik; server menolak mengeksekusi ID yang sama dua kali. Aturan: baca = retry bebas; tulis/aksi = retry hanya dengan idempotency key.",
        "Kepribadiannya: ketahanan API seperti mengemudi di jalan berlubang. Kamu tidak bisa menghilangkan lubangnya (provider akan down, limit akan kena), tetapi kamu bisa memilih suspensi yang tepat: backoff untuk lubang kecil (429), putar balik untuk jalan buntu (400), dan sabuk pengaman idempotensi agar tabrakan tidak terjadi dua kali.",
        "Kapan retry, kapan menyerah: retry untuk 429/5xx/timeout baca (maksimal 3x dengan backoff eksponensial + jitter agar tidak semua klien menyerbu bersamaan). JANGAN retry untuk 400/401/404 — itu bug di permintaanmu. Dan untuk loop agen: kegagalan tool di satu langkah bukan akhir dunia — catat sebagai observasi (“tool X gagal: rate limit”) dan biarkan model memutuskan langkah alternatif. Agen yang baik memperlakukan kegagalan sebagai DATA, bukan sebagai kiamat.",
      ],
      note: {
        title: "💡 Intuisi: backoff itu antrean yang sopan",
        body: "Ketika server berkata “terlalu cepat” (429) lalu kamu langsung mengulang seketika, itu seperti mengetuk pintu yang baru saja dibanting — kamu hanya memperpanjang penolakan. Backoff eksponensial (1s → 2s → 4s) memberi server ruang bernapas; jitter (acak ±30%) mencegah seribu klien yang menunggu bersamaan menyerbu di detik yang sama. Kesopanan yang dihitung dengan matematika.",
      },
      tasks: [],
      reference: "Retry hanya untuk 429/5xx/timeout (maks 3x, backoff + jitter). Tulis/aksi berbiaya wajib idempotency key.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 8 · Konsep",
      title: "Biaya: konteks yang membengkak adalah tagihan yang membengkak",
      prose: [
        "Rumus tagihannya sederhana — dan kejam:",
        "Setiap panggilan membayar token MASUK (semua pesan yang kamu kirim, termasuk riwayat yang dikirim ulang) dan token KELUAR (yang dihasilkan model), dengan tarif berbeda. Contoh tarif ilustratif: Rp1.500 per 1 juta token input, Rp6.000 per 1 juta token output. Satu panggilan agen dengan konteks 32 ribu token input + 500 token output = (32.000/1.000.000 × 1.500) + (500/1.000.000 × 6.000) = Rp48 + Rp3 = Rp51. Kelihatan kecil — sampai kamu kali 1.000 panggilan sehari × 30 hari.",
        "Cara membaca bagan: dua batang = biaya per 1.000 panggilan agen. “Ramping” (2 ribu token input per panggilan) = Rp210 ribu. “Bengkak” (32 ribu token input — riwayat penuh + dokumen besar yang ditempel tiap panggilan) = Rp3,36 juta. Interpretasi: 16× lipat biaya untuk TUGAS YANG SAMA — selisihnya murni dari kebiasaan mengirim ulang konteks yang tidak dibutuhkan. Konteks adalah uang tunai yang kamu bakar setiap panggilan.",
        "Tiga kebocoran konteks yang paling umum. (1) Riwayat penuh tanpa batas: setiap putaran loop membawa seluruh percakapan — solusinya ringkas riwayat (summarization) atau simpan hanya N langkah terakhir + fakta kunci. (2) Dokumen raksasa ditempel mentah: solusinya retrieval (ambil potongan relevan saja, bukan seluruh PDF). (3) System prompt yang menggelembung: setiap aturan “tambahan” yang ditempel ke system prompt dibayar di SETIAP panggilan — audit isinya berkala.",
        "Kepribadiannya: konteks seperti koper untuk perjalanan dinas. Kamu bisa membawa seluruh lemari (32k token) — nyaman, tapi bayar bagasi mahal setiap penerbangan. Atau membawa tas kabin yang dikurasi (2k token) — butuh disiplin memilih, tetapi 16× lebih murah. Agen yang ekonomis bukan yang pelit informasi, melainkan yang tahu persis apa yang dibutuhkan langkah INI.",
      ],
      formula: String.raw`C = \frac{T_{in}}{10^6} \cdot c_{in} + \frac{T_{out}}{10^6} \cdot c_{out}`,
      formulaNote: "C = biaya satu panggilan (Rupiah). T_in = jumlah token input (semua pesan yang dikirim); c_in = tarif per 1 juta token input. T_out = token keluaran yang dihasilkan; c_out = tarif per 1 juta token output (biasanya 3–4× tarif input). Contoh: T_in=32.000, T_out=500, c_in=1.500, c_out=6.000 → C = 48 + 3 = Rp51.",
      figure: {
        svg: BIAYA_SVG,
        alt: "Biaya per 1.000 panggilan: konteks ramping Rp210 ribu vs konteks bengkak Rp3,36 juta.",
        caption: "Cara membaca: tinggi batang = total biaya 1.000 panggilan; label bawah = komposisi token per panggilan. Interpretasi: tugas yang sama berharga 16× lipat hanya karena kebiasaan konteks — audit konteks adalah penghematan termurah.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: “Konteks besar = agen lebih pintar”",
        type: "pitfall",
        body: "Yang benar: konteks besar = agen lebih MAHAL, belum tentu lebih pintar. Penelitian dan praktik menunjukkan model justru kehilangan fokus di tengah konteks raksasa (“lost in the middle”). Agen yang baik bekerja dengan konteks MINIMAL yang cukup untuk langkah saat ini — ringkas, ambil potongan relevan, buang sisanya. “Beri semua data, biar model yang memilih” adalah strategi termahal sekaligus sering terburuk.",
      },
      reference: "Audit konteks berkala: ringkas riwayat, retrieval untuk dokumen, jaga system prompt tetap ramping.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Memilih pola integrasi yang tepat",
      prose: [
        "Skenario 1 — Keluaran dibaca mesin lain (pesanan, tiket, database): WAJIB JSON mode + skema + validasi di kode. Prosa bebas di sini = TokoNusa. Tidak ada pengecualian.",
        "Skenario 2 — Model harus MEMILIH tindakan (cari, hitung, kirim): pakai tool calling dengan kontrak tertulis. Jangan biarkan model “menjawab” kapan seharusnya ia “bertindak” — tegaskan di system prompt.",
        "Skenario 3 — Pengguna manusia menunggu di depan layar: aktifkan streaming untuk waktu-ke-token-pertama yang cepat. Untuk langkah internal antar-mesin: matikan streaming, kurangi kompleksitas.",
        "Skenario 4 — Panggilan berbiaya/berdampak (bayar, kirim, hapus): idempotency key wajib + konfirmasi manusia untuk yang tak terbalikkan. Retry tanpa idempotensi = bom ganda.",
        "Skenario 5 — Tagihan naik tanpa volume naik: audit konteks. Ukur token input rata-rata per panggilan per minggu; bila tren naik, cari pelakunya (riwayat tak teringkas? dokumen ditempel mentah?).",
        "Aturan praktis 10 detik sebelum setiap panggilan API: (1) Apakah keluarannya dibaca mesin? → skema. (2) Apakah model harus bertindak? → tool calling. (3) Apakah aksinya berbiaya? → idempotency key. (4) Apakah konteks ini minimal? → pangkas. Empat pertanyaan, nol kejutan.",
      ],
      tasks: [],
      reference: "Empat pertanyaan 10 detik: dibaca mesin? harus bertindak? berbiaya? konteks minimal?",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Tagihan Rp47 juta yang “tidak ada yang salah”",
      prose: [
        "KlinikSehat memakai agen penjadwalan: pasien chat, agen mengecek jadwal dokter, memesan slot. Bulan pertama tagihan API: Rp47 juta — 8× dari estimasi Rp6 juta. Investigasi menemukan tiga kebocoran sekaligus. (1) Setiap panggilan membawa SELURUH riwayat chat pasien (rata-rata 18 ribu token) padahal yang dibutuhkan hanya slot yang diminta. (2) System prompt berisi 40 contoh format (“few-shot”) seberat 9 ribu token — dibayar di setiap panggilan. (3) Loop retry tanpa backoff: saat rate limit kena, agen mengulang seketika 5× — setiap pengulangan membawa konteks penuh.",
        "Pertanyaan analisis. (a) Hitung pemborosan: bila tarif Rp1.500/juta token input dan ada 20 ribu panggilan/bulan, berapa biaya input dari 27 ribu token “sampah” per panggilan? (b) Tiga perbaikan mana yang paling berdampak — dan urutannya? (c) Retry tanpa backoff merugikan dua kali — jelaskan dua kerugiannya.",
        "Pembahasan. (a) 27.000 × 20.000 = 540 juta token = 540 × Rp1.500 = Rp810 ribu… tunggu, itu terlalu kecil. Hitung ulang: 540.000.000/1.000.000 = 540 unit × Rp1.500 = Rp810.000. Hmm — tidak menjelaskan Rp47 juta. Berarti tarif ilustratif ini terlalu murah ATAU volume/konteks aktual jauh lebih besar. Pelajaran pertama mini-case ini: selalu hitung dengan angka NYATAmu — tarif dan volume nyatamu, bukan contoh lesson. Dengan tarif nyata kelas model besar (mis. 10× lipat) dan 27 ribu token × 20 ribu panggilan, angkanya menjadi Rp8,1 juta — masih belum 47. Sisanya? Kemungkinan: output panjang + model tier mahal + retry berlipat. Tagihan adalah teka-teki dengan BANYAK tersangka — ukur per komponen.",
        "Pembahasan (b): urutan perbaikan by dampak. Pertama, ringkas riwayat (potong 18 ribu token → 2 ribu): sekali implementasi, menghemat di SEMUA panggilan selamanya. Kedua, pangkas few-shot 40 → 5 contoh terbaik: hemat 8 ribu token per panggilan. Ketiga, perbaiki retry (backoff + batas): menghentikan penggandaan tagihan saat insiden. Prinsipnya: perbaiki yang berulang dulu (konteks), baru yang insidental (retry).",
        "Pembahasan (c): dua kerugian retry tanpa backoff. Kerugian 1: setiap retry membawa konteks penuh — membayar tagihan untuk panggilan yang SUDAH DITOLAK server. Kerugian 2: retry seketika memperparah rate limit (server makin terbebani → menolak lebih lama) — seperti berteriak pada orang yang meminta tenang. Backoff menyelesaikan keduanya: menunggu = tidak membayar + memberi server pulih.",
      ],
      tasks: [],
      note: {
        title: "Pelajaran mini-case",
        type: "risk",
        body: "Tagihan API tidak pernah punya satu penyebab — ia punya tersangka berlapis: konteks, tarif tier, volume, retry. Kebiasaan yang menyelamatkan: dashboard biaya per komponen (input vs output, per fitur) sejak hari pertama, dan alert saat token-per-panggilan naik 20% minggu-ke-minggu. Rp47 juta selalu dimulai dari Rp47 ribu yang tidak dimonitor.",
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
        "API LLM stateless: setiap panggilan = daftar pesan + parameter; “ingatan” adalah riwayat yang kamu kirim ulang.",
        "Keluaran untuk mesin wajib terstruktur: JSON mode + skema + validasi tiga lapis (bentuk → skema → bisnis).",
        "Tool calling = kontrak: model mengusulkan, kodemu memvalidasi & mengeksekusi; permukaan serangan = daftar tool.",
        "Ketahanan: retry hanya untuk 429/5xx/timeout (backoff + jitter); aksi berbiaya wajib idempotency key.",
        "Biaya = token in × tarif + token out × tarif; konteks yang membengkak = tagihan yang membengkak — audit berkala.",
        "Aturan 10 detik: dibaca mesin? harus bertindak? berbiaya? konteks minimal?",
      ],
      next: { label: "AAI2 — Anatomi Agen", href: "/v2/learn/aai2-anatomi" },
      quiz: [
        {
          q: "Agen TokoNusa kehilangan 40% pesanan. Akar masalahnya?",
          options: [
            { text: "Modelnya terlalu lemah untuk tugas pemesanan", why: "Model menjawab dengan benar secara bahasa — yang gagal adalah kontrak keluarannya, bukan kecerdasannya.", correct: false },
            { text: "Tidak ada kontrak keluaran: prosa bebas tidak bisa diparse sistem", why: "Tepat — parser mengharapkan JSON, model menulis prosa. Bentuk keluaran yang tak disepakati = data hilang.", correct: true },
            { text: "Server pemesanan down seminggu", why: "Tidak ada bukti itu; log menunjukkan agen “menjawab benar” tetapi parser gagal.", correct: false },
            { text: "Temperature terlalu tinggi", why: "Temperature memengaruhi variasi, bukan format. Masalahnya struktural: tidak ada skema.", correct: false },
          ],
        },
        {
          q: "Respons model: `{\"qty\": \"dua\"}`. JSON mode aktif. Apa yang terjadi?",
          options: [
            { text: "Lolos — JSON-nya valid", why: "JSON valid ≠ benar. Skema meminta integer; string “dua” gagal validasi skema.", correct: false },
            { text: "Gagal di lapis skema: tipe qty salah — tolak dan minta ulang dengan pesan kesalahan", why: "Tepat — inilah gunanya lapis kedua pertahanan: bentuk lolos, skema menolak.", correct: true },
            { text: "Gagal di lapis parse", why: "Parse berhasil — kurung kurawalnya sah. Yang gagal adalah isi vs skema.", correct: false },
            { text: "Diteruskan saja, nanti juga dipahami", why: "“Nanti dipahami” adalah cara TokoNusa kehilangan 40% pesanan.", correct: false },
          ],
        },
        {
          q: "Dalam tool calling, siapa yang MENGEKSEKUSI tool?",
          options: [
            { text: "Model — ia memanggil API langsung", why: "Salah total dan berbahaya bila dipercaya: model tidak mengeksekusi apa pun.", correct: false },
            { text: "Kodemu — model hanya mengusulkan nama tool + argumen terstruktur", why: "Tepat — inilah kenapa kamu memegang kendali penuh atas dampak di dunia nyata.", correct: true },
            { text: "Provider LLM di server mereka", why: "Provider hanya menjalankan model; eksekusi tool terjadi di infrastrukturmu.", correct: false },
            { text: "Framework otomatis tanpa kode", why: "Framework hanya membungkus pola yang sama: usulan → validasi → eksekusi di kodemu.", correct: false },
          ],
        },
        {
          q: "Panggilan mengembalikan 429. Tindakan yang benar?",
          options: [
            { text: "Ulangi seketika, maksimal 10 kali", why: "Retry seketika memperparah rate limit dan membayar tagihan untuk panggilan yang ditolak.", correct: false },
            { text: "Retry dengan backoff eksponensial + jitter, maksimal ~3 kali", why: "Tepat — memberi server ruang pulih dan menghindari serbuan serentak.", correct: true },
            { text: "Jangan pernah retry 429 — langsung gagalkan tugas", why: "429 adalah sinyal “coba lagi nanti”, bukan kegagalan permanen.", correct: false },
            { text: "Naikkan temperature lalu ulangi", why: "Temperature tidak ada hubungannya dengan rate limit.", correct: false },
          ],
        },
        {
          q: "Agen mengirim 30 ribu token input per panggilan padahal yang dibutuhkan 3 ribu. Dampaknya?",
          options: [
            { text: "Tidak ada — token berlebih diabaikan model", why: "Setiap token input ditagih dan diproses; tidak ada yang “diabaikan gratis”.", correct: false },
            { text: "Biaya ±10× lipat untuk tugas yang sama, plus risiko “lost in the middle”", why: "Tepat — tagihan naik sebanding token, dan model justru kehilangan fokus di konteks raksasa.", correct: true },
            { text: "Hanya latensi naik, biaya tetap", why: "Biaya dihitung per token — latensi dan biaya naik bersama.", correct: false },
            { text: "Agen menjadi 10× lebih akurat", why: "Konteks berlebih sering MENURUNKAN kualitas fokus model.", correct: false },
          ],
        },
        {
          q: "Operasi “potong saldo Rp500 ribu” perlu dipanggil ulang setelah timeout. Syarat amannya?",
          options: [
            { text: "Cukup ulangi — timeout berarti tidak tereksekusi", why: "Berbahaya: timeout berarti “tidak tahu hasilnya”, bukan “tidak tereksekusi”. Server mungkin sudah memotong.", correct: false },
            { text: "Ulangi dengan idempotency key yang sama agar eksekusi ganda ditolak server", why: "Tepat — kunci idempotensi mengubah “tidak tahu” menjadi aman untuk diulang.", correct: true },
            { text: "Tunggu 1 jam lalu ulangi tanpa kunci", why: "Menunggu tidak mengubah ketidakpastian hasil panggilan pertama.", correct: false },
            { text: "Jangan pernah ulangi operasi uang", why: "Terlalu kaku — dengan idempotency key, retry operasi uang adalah praktik standar yang aman.", correct: false },
          ],
        },
      ],
    },
  ],
};
