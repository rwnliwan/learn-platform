import type { V2Lesson } from "../lib/types";

// Batang biaya: chatbot AI vs manusia per 1.000 sesi.
const FIG_BIAYA = `<svg viewBox="0 0 480 240" role="img" aria-label="Biaya per 1.000 sesi: chatbot AI Rp350 ribu vs CS manusia Rp4 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="110" x2="460" y2="110"/><line x1="44" y1="65" x2="460" y2="65"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0</text><text x="38" y="159">Rp1 jt</text><text x="38" y="114">Rp2 jt</text><text x="38" y="69">Rp3 jt</text><text x="38" y="24">Rp4 jt</text></g>
<rect x="120" y="183" width="100" height="17" fill="var(--c1)"/>
<rect x="300" y="20" width="100" height="180" fill="var(--c4)"/>
<g fill="var(--text)" font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="170" y="176">Rp350 rb</text><text x="350" y="12">Rp4 jt</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="222">chatbot AI</text><text x="350" y="222">CS manusia</text></g>
<text x="240" y="238" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">biaya API + review manusia untuk chatbot vs gaji per 1.000 sesi</text>
</svg>`;

export const aie18: V2Lesson = {
  slug: "aie18-governance-produk",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE18 — Governance & Produk AI",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Fitur AI yang sukses bukan yang demonya paling memukau, melainkan yang bertahan hidup di produksi: aman, terdokumentasi, diawasi manusia, dan ekonominya masuk akal. Lesson ini membahas sisi yang jarang ada di tutorial — governance (siapa bertanggung jawab saat AI salah?) dan produk (apakah fitur AI ini layak dibuat?).",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mengklasifikasikan use case AI ke tier risiko dan menentukan kontrol yang sebanding; (2) merancang human oversight dan audit trail keputusan; (3) menulis system card untuk aplikasi LLM; (4) menghitung metrik produk AI: task success, containment, dan cost per resolved task; (5) memutuskan build vs buy vs API dan kapan fitur AI TIDAK layak dibuat; (6) menyusun rencana incident response khusus AI.",
        "🗺️ Isi lesson: Langkah 1 · Peta — Langkah 2 · Cerita insiden tanpa pemilik — Langkah 3 · Risk tiering — Langkah 4 · Lab: skoring tier — Langkah 5 · Human oversight & audit trail — Langkah 6 · Dokumentasi & kepatuhan — Langkah 7 · Metrik produk AI — Langkah 8 · Ekonomi & incident response — Langkah 9 · Peta keputusan — Langkah 10 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Governance = aturan main saat AI salah. Produk = memastikan fitur AI layak dibuat dan ekonominya sehat.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Insiden yang tidak punya pemilik",
      prose: [
        "Chatbot layanan bank 'Bantu' lolos semua review: akurasi 94 persen di evaluasi, demo memukau direksi, launch tepat waktu. Tiga minggu kemudian, tangkapan layar viral: chatbot menjanjikan nasabah kompensasi Rp2 juta atas keterlambatan transfer — padahal kebijakan bank tidak mengenal kompensasi itu. Ratusan nasabah menuntut janji yang dibuat AI.",
        "Rapat darurat digelar. Tim produk: 'Modelnya lolos evaluasi.' Tim data: 'Prompt-nya sudah direview.' Tim legal: 'Siapa yang menyetujui chatbot boleh bicara soal kompensasi?' Hening. Semua orang melakukan pekerjaannya dengan benar — tetapi tidak ada satu pun artefak yang menjawab pertanyaan paling dasar: siapa pemilik keputusan ini, batas wewenang chatbot apa, dan siapa yang harus menekan tombol berhenti.",
        "Twist-nya: kegagalannya BUKAN teknis. Modelnya bekerja persis seperti yang dilatih — terlalu membantu, terlalu percaya diri. Kegagalannya adalah governance: tidak ada risk tiering (apakah chatbot boleh menyentuh topik uang?), tidak ada human oversight untuk klaim sensitif, tidak ada audit trail (prompt versi berapa yang dipakai malam itu?), dan tidak ada rencana rollback. Semua lolos review, semua tidak bersalah, perusahaan tetap rugi.",
        "Inilah pola yang berulang di industri: tim AI mengukur akurasi, tetapi insiden AI hampir selalu soal akuntabilitas. Lesson ini memberimu kerangkanya: tiering risiko, oversight manusia, dokumentasi, metrik produk, dan incident response — sebelum kamu menjadi bintang di rapat darurat berikutnya.",
      ],
      tasks: [],
      reference: "Insiden AI jarang soal akurasi; hampir selalu soal siapa bertanggung jawab dan apa batas wewenangnya.",
    },
    {
      id: "risk-tiering",
      eyebrow: "Langkah 3 · Risk tiering",
      title: "Kontrol harus sebanding dengan risiko",
      prose: [
        "Tidak semua fitur AI butuh governance yang sama. Chatbot peringkas berita internal dan penilai kredit otomatis tidak boleh diperlakukan setara — yang satu salah ketik tanggal, yang satu menolak pengajuan KPR seseorang. Risk tiering adalah cara mengelompokkan use case berdasarkan risikonya, lalu memasangkan kontrol yang sebanding: ringan untuk risiko rendah, berat untuk risiko tinggi.",
        "Empat tier yang praktis. Tier 1 · Rendah: dampak kecil, mudah dibatalkan (ringkas artikel, draft email). Kontrol: log dasar, pemilik terdaftar. Tier 2 · Sedang: menyentuh pelanggan atau data pribadi (chatbot FAQ, rekomendasi produk). Kontrol: human on-the-loop, audit trail, evaluasi berkala. Tier 3 · Tinggi: keputusan berdampak finansial/hukum dengan manusia sebagai peninjau (deteksi fraud dengan blokir, skrining awal kredit). Kontrol: human in-the-loop, red team, system card. Tier 4 · Kritis: keputusan otonom yang sulit dibatalkan atas hidup orang (persetujuan kredit final, penegakan hukum). Kontrol: persetujuan manusia per keputusan, audit independen — dan seringkali jawabannya adalah JANGAN diotomatisasi penuh.",
        "Empat atribut penentu tier: dampak (berapa besar kerugian satu kesalahan?), otonomi (apakah AI bertindak sendiri atau mengusulkan?), reversibilitas (bisakah keputusan dibatalkan?), dan data (apakah menyentuh data pribadi?). Aturan jempolnya: satu atribut ekstrem saja sudah cukup menaikkan tier — penilai kredit yang 'hanya mengusulkan' tetap Tier 3 ke atas karena dampaknya.",
        "Kepribadian tiering: ia seperti sabuk pengaman yang ukurannya menyesuaikan kecepatan. Di jalan komplek (Tier 1) sabuk biasa cukup; di sirkuit balap (Tier 4) kamu butuh roll cage, helm, dan tim medis siaga. Memasang roll cage untuk jalan komplek = birokrasi; tidak memakai sabuk di sirkuit = bunuh diri. Governance yang baik bukan yang paling ketat — melainkan yang proporsional.",
      ],
      formula: String.raw`\text{Skor risiko} = D + O + P + I`,
      formulaNote: "Skor risiko = penjumlahan empat atribut, masing-masing dinilai 0–2. D = Dampak (0 kecil, 1 sedang, 2 besar/keuangan-hukum). O = Otonomi (0 mengusulkan ke manusia, 1 bertindak dengan persetujuan, 2 bertindak sendiri). P = data Pribadi (0 tidak ada, 1 ada tetapi teragregasi, 2 data pribadi individual). I = Irreversibilitas (0 mudah dibatalkan, 1 bisa dibatalkan dengan biaya, 2 sulit/tidak bisa dibatalkan). Total 0–2 = Tier 1; 3–4 = Tier 2; 5–6 = Tier 3; 7–8 = Tier 4. Ini heuristik kerja, bukan rumus fisika — nilainya untuk memaksa diskusi eksplisit, bukan menggantikan penilaian manusia.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Governance = memperlambat inovasi.' Salah arah. Yang memperlambat adalah insiden: rollback darurat, investigasi tanpa audit trail, dan kepercayaan yang runtuh. Tiering yang proporsional justru MEMPERCEPAT Tier 1–2 (jalur ringan, jelas) sambil melindungi perusahaan di Tier 3–4. Tanpa tiering, semuanya diperlakukan seperti Tier 4 — itulah yang benar-benar memperlambat.",
      },
      reference: "Dampak × otonomi × reversibilitas × data pribadi → tier → kontrol yang sebanding. Satu atribut ekstrem menaikkan tier.",
    },
    {
      id: "lab-tiering",
      eyebrow: "Langkah 4 · Lab tiering",
      title: "Lab: skoring tier enam use case",
      prose: [
        "Enam use case nyata dengan empat atribut masing-masing (skala 0–2). Tugasmu: implementasikan fungsi `skor()` dan `tier()`, hitung skor tiap use case, dan cetak tier + kontrol wajibnya. Perhatikan `skor kredit otomatis` — atributnya ekstrem di mana-mana.",
        "Coba ubah: turunkan otonomi chatbot CS dari 2 menjadi 1 (chatbot hanya mengusulkan jawaban ke agen manusia) — lihat tier-nya turun dan kontrolnya berubah. Itulah inti governance sebagai desain: satu keputusan arsitektur bisa memindahkan risiko satu tier penuh.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `skor(u)` dan `tier(s)`, hitung `skor_semua` untuk keenam use case" },
        { id: "t2", text: "Hitung `n_kritis` (jumlah Tier 4) dan cetak tiap use case: nama, tier, kontrol" },
      ],
      expected: "skor_semua=[2, 3, 8, 5, 6, 4]  n_kritis=1",
      note: {
        title: "💡 Intuisi",
        body: "Skor ini sengaja kasar — dan itu tidak apa-apa. Tujuannya bukan presisi matematis, melainkan memaksa tim menjawab empat pertanyaan sulit secara eksplisit SEBELUM launch, bukan saat rapat darurat. Use case yang 'terasa aman' sering berubah tier begitu atributnya ditulis jujur.",
      },
      hints: [
        "skor(u) = u['dampak'] + u['otonomi'] + u['pribadi'] + u['irreversibel']",
        "tier(s): s<=2 → 'Tier 1', s<=4 → 'Tier 2', s<=6 → 'Tier 3', selain itu 'Tier 4'",
        "n_kritis = sum(1 for s in skor_semua if tier(s) == 'Tier 4')",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah
USE_CASES = [
    {"nama": "Ringkas artikel berita", "dampak": 0, "otonomi": 1, "pribadi": 0, "irreversibel": 1},
    {"nama": "Draft email marketing", "dampak": 1, "otonomi": 1, "pribadi": 1, "irreversibel": 0},
    {"nama": "Skor kredit otomatis", "dampak": 2, "otonomi": 2, "pribadi": 2, "irreversibel": 2},
    {"nama": "Chatbot CS jawab FAQ", "dampak": 1, "otonomi": 2, "pribadi": 1, "irreversibel": 1},
    {"nama": "Deteksi fraud, blokir otomatis", "dampak": 2, "otonomi": 2, "pribadi": 1, "irreversibel": 1},
    {"nama": "Rekomendasi investasi personal", "dampak": 1, "otonomi": 1, "pribadi": 2, "irreversibel": 0},
]

KONTROL = {
    "Tier 1": "log dasar",
    "Tier 2": "human on-the-loop + audit trail",
    "Tier 3": "human in-the-loop + red team + system card",
    "Tier 4": "persetujuan manusia per keputusan + audit independen",
}

def skor(u):
    return

def tier(s):
    return

# TULIS KODEMU
skor_semua =
n_kritis =

for u, s in zip(USE_CASES, skor_semua):
    print(f"{u['nama']}: {tier(s)} - {KONTROL[tier(s)]}")`,
        lockLines: 17,
        solution: `# DATA SEED — jangan ubah
USE_CASES = [
    {"nama": "Ringkas artikel berita", "dampak": 0, "otonomi": 1, "pribadi": 0, "irreversibel": 1},
    {"nama": "Draft email marketing", "dampak": 1, "otonomi": 1, "pribadi": 1, "irreversibel": 0},
    {"nama": "Skor kredit otomatis", "dampak": 2, "otonomi": 2, "pribadi": 2, "irreversibel": 2},
    {"nama": "Chatbot CS jawab FAQ", "dampak": 1, "otonomi": 2, "pribadi": 1, "irreversibel": 1},
    {"nama": "Deteksi fraud, blokir otomatis", "dampak": 2, "otonomi": 2, "pribadi": 1, "irreversibel": 1},
    {"nama": "Rekomendasi investasi personal", "dampak": 1, "otonomi": 1, "pribadi": 2, "irreversibel": 0},
]

KONTROL = {
    "Tier 1": "log dasar",
    "Tier 2": "human on-the-loop + audit trail",
    "Tier 3": "human in-the-loop + red team + system card",
    "Tier 4": "persetujuan manusia per keputusan + audit independen",
}

def skor(u):
    return u["dampak"] + u["otonomi"] + u["pribadi"] + u["irreversibel"]

def tier(s):
    if s <= 2:
        return "Tier 1"
    if s <= 4:
        return "Tier 2"
    if s <= 6:
        return "Tier 3"
    return "Tier 4"

# TULIS KODEMU
skor_semua = [skor(u) for u in USE_CASES]
n_kritis = sum(1 for s in skor_semua if tier(s) == "Tier 4")

for u, s in zip(USE_CASES, skor_semua):
    print(f"{u['nama']}: {tier(s)} - {KONTROL[tier(s)]}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor_semua", value: [2, 3, 8, 5, 6, 4], label: "`skor_semua` harus [2, 3, 8, 5, 6, 4]", msg: "Skor kredit otomatis = 2+2+2+2 = 8; ringkas artikel = 0+1+0+1 = 2." },
          { kind: "equal", task: "t2", name: "n_kritis", value: 1, tol: 1e-9, label: "`n_kritis` seharusnya 1", msg: "Hanya skor kredit otomatis yang mencapai Tier 4." },
          { kind: "stdout_matches", task: "t2", pattern: "Skor kredit otomatis: Tier 4", label: "Baris Tier 4 tercetak", msg: "Format: {nama}: {tier} - {kontrol}." },
          { kind: "stdout_matches", task: "t2", pattern: "Ringkas artikel berita: Tier 1", label: "Baris Tier 1 tercetak", msg: "Skor 2 → Tier 1." },
        ],
      },
      reference: "Skor = D + O + P + I; tier menentukan kontrol. Ubah arsitektur (turunkan otonomi) untuk menurunkan tier.",
    },
    {
      id: "oversight",
      eyebrow: "Langkah 5 · Human oversight",
      title: "Manusia di loop, mesin di log",
      prose: [
        "Tiga tingkat keterlibatan manusia. Human-in-the-loop: AI mengusulkan, manusia memutuskan — setiap keputusan penting menunggu persetujuan (contoh: analis menyetujui tiap blokir fraud). Human-on-the-loop: AI bertindak sendiri, manusia memantau dasbor dan bisa mengintervensi (contoh: operator chatbot melihat antrean sesi berisiko). Human-out-of-the-loop: AI jalan penuh otomatis — hanya boleh untuk Tier 1.",
        "Aturannya sederhana: makin tinggi tier, makin dekat manusia ke keputusan. Tier 4 = in-the-loop per keputusan, tanpa kecuali. Kesalahan klasik adalah menaruh manusia 'on-the-loop' untuk sistem Tier 3 lalu memberinya 500 keputusan per hari untuk dipantau — itu bukan oversight, itu teater.",
        "Eskalasi: definisikan kapan AI WAJIB menyerah ke manusia. Empat pemicu baku: (1) kepercayaan model rendah; (2) topik sensitif (uang, kesehatan, hukum); (3) nilai di atas ambang (mis. transaksi > Rp10 juta); (4) permintaan di luar wewenang yang didefinisikan. Eskalasi yang tidak didefinisikan = tidak akan pernah terjadi saat dibutuhkan.",
        "Inventaris sistem AI: daftar hidup semua sistem AI yang berjalan di produksi — nama, pemilik, tier risiko, versi model dan prompt, tanggal review terakhir. Kamu tidak bisa mengatur apa yang tidak kamu ketahui. Audit menemukan 'tiga chatbot yang tidak ada yang mengaku memilikinya' adalah temuan klasik di perusahaan besar.",
        "Audit trail: setiap keputusan penting mencatat LIMA hal — siapa (id pengguna), apa (ringkasan input dan output), kapan (timestamp), dengan apa (versi model + versi prompt), dan putusan manusia (setuju / tolak / ubah + alasannya). Tanpa ini, investigasi insiden adalah arkeologi: menggali dari ingatan orang. Dengan ini, investigasi adalah membaca log.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Sudah ada human in-the-loop, jadi aman.' Belum tentu. Jika manusia hanya mengeklik 'setuju' 500 kali sehari tanpa waktu, insentif, atau informasi yang cukup untuk menilai — itu rubber stamping, bukan oversight. Oversight yang nyata butuh tiga hal: beban kerja manusiawi, informasi yang cukup untuk menilai, dan insentif untuk menolak (menolak usulan AI tidak boleh 'merepotkan').",
      },
      reference: "Tier tinggi = manusia dekat ke keputusan. Eskalasi didefinisikan eksplisit. Audit trail: siapa-apa-kapan-dengan apa-putusan manusia.",
    },
    {
      id: "dokumentasi",
      eyebrow: "Langkah 6 · Dokumentasi dan kepatuhan",
      title: "System card: paspor aplikasi AI",
      prose: [
        "System card adalah dokumen hidup untuk SATU aplikasi AI — gabungan model card, dokumentasi data, dan batasan operasional. Isinya: tujuan dan batasan penggunaan, arsitektur (model, versi prompt, tools, guardrails), data (sumber, retensi, perlakuan PII), evaluasi (metrik, hasil red team, tanggal), risiko per tier dan mitigasinya, pemilik dan kontak darurat, serta riwayat insiden.",
        "Aturan versi: setiap perubahan prompt atau model = versi baru + changelog satu baris + evaluasi ulang singkat. 'Prompt diubah Jumat sore tanpa catatan' adalah kalimat pembuka dari terlalu banyak postmortem. Rollback hanya mungkin jika kamu tahu versi mana yang terakhir aman — dan itu hanya ada di catatan.",
        "Kepatuhan privasi (UU PDP Indonesia) — prinsip umumnya: kumpulkan data seminimal mungkin untuk tujuan yang dinyatakan; beri tahu pengguna data apa yang dipakai untuk apa; jaga keamanannya; hormati hak subjek data (akses, koreksi, penghapusan). Praktiknya untuk AI engineer: JANGAN mengirim data pribadi mentah ke API pihak ketiga tanpa dasar yang jelas dan perlindungan (masking atau anonimisasi dulu); tetapkan masa retensi log percakapan dan hapus sesuai jadwal.",
        "Konteks sektor keuangan butuh kehati-hatian ekstra: keputusan AI yang berdampak ke nasabah (persetujuan kredit, pemblokiran rekening) harus bisa DIJELASKAN dengan bahasa yang dipahami nasabah — 'ditolak oleh sistem' bukan penjelasan. Sediakan jalur sanggahan/banding yang nyata, dan pastikan manusia yang bisa dimintai pertanggungjawaban, bukan sekadar 'keputusan AI'. Regulator mengawasi area ini dengan ketat; dokumentasi yang rapi adalah tamengmu.",
        "Kepribadian system card: ia seperti paspor. Kamu bisa bepergian tanpanya sampai ada masalah di perbatasan — dan saat masalah datang, tidak ada pengganti untuk dokumen resmi yang lengkap dan mutakhir.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dokumentasi yang kedaluwarsa lebih berbahaya daripada tidak ada dokumentasi — ia memberi rasa aman palsu. Tetapkan pemilik system card dan jadwal review (mis. tiap rilis dan tiap kuartal). System card tanpa pemilik = brosur, bukan kontrol.",
      },
      reference: "System card = tujuan, arsitektur, data, evaluasi, risiko, pemilik, riwayat insiden. Prompt/model berversi + changelog. PDP: minimal, transparan, aman, hormati hak subjek data.",
    },
    {
      id: "metrik-produk",
      eyebrow: "Langkah 7 · Metrik produk",
      title: "Tiga angka yang menentukan nasib fitur AI",
      prose: [
        "Task success rate: proporsi tugas yang diselesaikan DENGAN BENAR. Bukan 'sesi selesai', melainkan 'masalah pengguna benar-benar terpecahkan' — diukur lewat evaluasi sampel, survei, atau verifikasi tindak lanjut. Chatbot yang menjawab cepat tetapi salah bukanlah sukses.",
        "Containment rate: proporsi sesi yang selesai TANPA campur tangan manusia. Angka favorit manajemen karena langsung diterjemahkan ke penghematan biaya — dan justru karena itu paling sering disalahgunakan. Containment 95 persen tidak berarti apa-apa jika task success-nya 40 persen; artinya AI rajin menyelesaikan sesuatu yang salah.",
        "Cost per resolved task: total biaya (API + review manusia + evaluasi) dibagi tugas yang benar-benar selesai. Inilah metrik ekonomi yang jujur: ia menghukum jawaban salah (tidak dihitung sebagai 'resolved') dan menghukum proses mahal. Fitur AI yang 'murah per request' bisa mahal per tugas selesai bila separuh jawabannya harus diperbaiki manusia.",
        "Pasangan metrik wajib: containment SELALU dibaca bersama task success; biaya SELALU per tugas selesai, bukan per request; kecepatan SELALU bersama kualitas. Metrik tunggal adalah undangan untuk gaming — tim akan mengoptimalkan angka yang diukur dan mengorbankan yang tidak.",
      ],
      formula: String.raw`\text{Containment} = \frac{n_{\text{tanpa manusia}}}{n_{\text{total sesi}}} \quad\text{dan}\quad \text{Biaya per tugas selesai} = \frac{\text{biaya API} + \text{biaya review manusia}}{n_{\text{tugas selesai benar}}}`,
      formulaNote: "Containment: n_tanpa manusia = sesi yang selesai tanpa eskalasi ke agen manusia; n_total sesi = semua sesi. Biaya per tugas selesai: pembilang = SEMUA biaya (token API, jam review manusia, evaluasi berkala); penyebut = hanya tugas yang terverifikasi selesai dengan benar — bukan semua sesi. Contoh: biaya Rp10 juta/bulan, 8.000 dari 10.000 sesi selesai benar → Rp1.250 per tugas selesai, BUKAN Rp1.000.",
      figure: {
        svg: FIG_BIAYA,
        alt: "Biaya per 1.000 sesi: chatbot AI Rp350 ribu vs CS manusia Rp4 juta.",
        caption: "Cara membaca: tinggi batang = biaya per 1.000 sesi; sumbu Y Rp0–4 juta. Batang chatbot = biaya API per sesi (Rp350) × 1.000. Interpretasi: chatbot ~11x lebih murah per sesi — inilah yang menjual proyek AI ke direksi. TETAPI ini biaya per sesi, bukan per tugas SELESAI: jika task success chatbot 70 persen dan 30 persen sisanya tetap butuh manusia, biaya riilnya naik. Selalu hitung ulang dengan cost per resolved task sebelum mengklaim penghematan.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Metrik produk AI menjawab pertanyaan bisnis ('apakah ini menghemat uang dan memuaskan pelanggan?'), bukan pertanyaan teknis ('berapa akurasinya?'). Akurasi 94 persen yang tidak diterjemahkan ke task success dan biaya adalah angka pajangan — indah di slide, tidak berguna di P&L.",
      },
      reference: "Ukur berpasangan: containment + task success; biaya per tugas SELESAI, bukan per request.",
    },
    {
      id: "ekonomi",
      eyebrow: "Langkah 8 · Ekonomi dan insiden",
      title: "Build vs buy vs API — dan kapan tidak membangun sama sekali",
      prose: [
        "Tiga jalur membangun fitur AI. Build sendiri (open-source/self-host): kontrol penuh atas data dan perilaku, tetapi kamu membayar tim, infrastruktur, evaluasi, dan maintenance selamanya. Buy (vendor): tercepat ke pasar, tetapi lock-in, datamu keluar, dan kustomisasi terbatas. API (model pihak ketiga): fleksibel dan tanpa modal awal, tetapi biaya per token yang membengkak saat skala dan ketergantungan pada roadmap vendor.",
        "Unit economics per request: hitung biaya SATU request (token in/out × harga + overhead review manusia yang proporsional) lalu kali volume bulanan — dan tambahkan 'biaya tak terlihat': evaluasi berkala, red team, penanganan insiden, dan review manusia untuk eskalasi. Proyek AI yang 'murah' di 1.000 request sering kaget di 1 juta request.",
        "Kapan fitur AI TIDAK layak dibuat — empat lampu merah: (1) nilai tambahnya kecil dibanding biaya total (aturan sederhana atau template sudah cukup); (2) volume terlalu rendah untuk menutup biaya tetap governance; (3) risikonya (Tier 3–4) lebih besar dari nilai bisnisnya; (4) tidak ada pemilik yang jelas — fitur tanpa pemilik = insiden tanpa penanggung jawab, seperti cerita di Langkah 2.",
        "Incident response khusus AI — lima langkah. Satu, deteksi: alert anomali output, laporan pengguna, pantauan media sosial (viral lebih cepat dari dasbormu). Dua, hentikan pendarahan: kill switch — matikan fitur, fallback ke mode aman (mis. hanya FAQ statis), atau batasi ke use case sempit. Tiga, investigasi: buka audit trail — prompt versi berapa yang aktif malam itu? Empat, perbaikan: rollback prompt/model ke versi terakhir yang aman (inilah gunanya pencatatan versi di Langkah 6). Lima, komunikasi & postmortem: jujur ke pengguna terdampak, perbaiki tanpa menyalahkan individu.",
        "Kepribadian kill switch: ia seperti rem darurat kereta — kamu berharap tidak pernah memakainya, tetapi kereta tanpa rem darurat tidak boleh beroperasi. Setiap fitur AI Tier 2 ke atas WAJIB punya cara dimatikan dalam hitungan menit oleh manusia yang jelas siapa.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Incident AI = bug, jadi perbaikannya = patch kode.' Seringkali bukan. Output berbahaya yang viral biasanya berasal dari prompt, data, atau konfigurasi — bukan bug kode. Itulah mengapa rollback PROMPT/MODEL (bukan deploy ulang kode) adalah langkah perbaikan utama, dan mengapa versi prompt harus dicatat seperti versi kode.",
      },
      reference: "Build = kontrol, mahal tetap. Buy = cepat, lock-in. API = fleksibel, biaya skala. Lampu merah: nilai kecil, volume rendah, risiko > nilai, tanpa pemilik. Insiden: deteksi → kill switch → audit trail → rollback prompt/model → postmortem.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: governance untuk tiap situasi",
      prose: [
        "Satu, Tier 1 internal (ringkas dokumen tim) — jalur ringan: daftarkan di inventaris, log dasar, pemilik jelas. Jangan bebani dengan komite; kecepatan adalah fiturnya. Dua, Tier 2 menghadap pelanggan (chatbot FAQ) — human on-the-loop, audit trail, evaluasi sampel mingguan, kill switch teruji.",
        "Tiga, Tier 3 finansial/sensitif (skrining kredit, blokir fraud) — human in-the-loop untuk keputusan, system card lengkap, red team sebelum launch, eskalasi terdefinisi. Empat, Tier 4 kritis (keputusan final atas hidup orang) — AI hanya mengusulkan, manusia memutuskan dan menandatangani; pertimbangkan serius untuk TIDAK mengotomatisasi.",
        "Lima, memakai vendor/API pihak ketiga — due diligence: ke mana datamu pergi? Bagaimana retensinya? Apa SLA-nya? Dan siapkan exit plan: bisakah kamu pindah vendor dalam 30 hari jika mereka naik harga atau bocor? Ketergantungan tanpa exit plan adalah risiko konsentrasi.",
        "Aturan praktis 10 detik — sebelum launch, jawab tiga baris: (1) tier risikonya apa? (2) siapa pemiliknya (nama orang, bukan tim)? (3) bagaimana cara mematikannya dalam 5 menit? Tidak bisa menjawab ketiganya = belum siap launch.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Governance terbaik terasa seperti sabuk pengaman: tidak kamu pikirkan saat semua lancar, dan satu-satunya hal yang penting saat kecelakaan. Tiga baris aturan 10 detik di atas adalah sabuk pengaman minimum — murah dipasang, mahal jika tidak ada.",
      },
      reference: "Tier 1 = ringan. Tier 2 = on-the-loop + kill switch. Tier 3 = in-the-loop + system card + red team. Tier 4 = manusia memutuskan. Vendor = due diligence + exit plan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: chatbot hemat Rp49 juta — sampai ia berjanji Rp600 juta",
      prose: [
        "Bank Nusa meluncurkan chatbot CS: 20.000 sesi per bulan. Biaya API Rp350 per sesi = Rp7 juta per bulan. Containment 70 persen → 6.000 sesi dieskalasi ke agen manusia @Rp4.000 = Rp24 juta. Total Rp31 juta per bulan vs Rp80 juta jika semua ditangani manusia (20.000 × Rp4.000). Hemat Rp49 juta per bulan — slide direksi penuh senyum.",
        "Lalu insiden Langkah 2 terjadi: chatbot menjanjikan kompensasi Rp2 juta ke 300 nasabah = eksposur Rp600 juta + liputan media. Satu insiden menghapus penghematan 12 bulan (12 × Rp49 juta = Rp588 juta). Ekonominya jungkir balik bukan karena teknologinya gagal, melainkan karena wewenangnya tidak dibatasi.",
        "Perbaikan governance-nya: (1) chatbot DILARANG membahas nominal/kompensasi — topik uang otomatis eskalasi ke manusia (aturan eskalasi eksplisit); (2) human on-the-loop memantau antrean sesi berisiko; (3) kill switch: dalam 5 menit chatbot kembali ke mode FAQ statis; (4) audit trail mencatat prompt versi berapa yang aktif malam insiden; (5) system card diperbarui dengan batasan wewenang yang baru.",
        "Hitung ulang pasca-perbaikan: eskalasi naik (containment turun ke 60 persen) → biaya manusia naik ke Rp32 juta; total Rp39 juta vs Rp80 juta — masih hemat Rp41 juta per bulan, tetapi sekarang dengan risiko tail yang terkendali. Pelajarannya: governance bukan biaya yang menggerogoti margin; ia adalah asuransi yang membuat margin itu bisa bertahan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ini adalah analisis risiko operasional klasik: expected value terlihat bagus (hemat Rp49 juta/bulan), tetapi distribusinya punya tail — satu insiden Rp600 juta. Keputusan yang benar tidak membatalkan proyek, melainkan memangkas tail-nya dengan kontrol yang murah (eskalasi topik uang, kill switch) sambil mempertahankan sebagian besar nilai.",
      },
      reference: "Hemat Rp49 juta/bulan vs eksposur tail Rp600 juta. Solusi: batasi wewenang + eskalasi + kill switch. Governance = asuransi margin.",
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
        "Risk tiering: kelompokkan use case (Tier 1–4) dari dampak, otonomi, data pribadi, dan reversibilitas; kontrol harus sebanding — proporsional, bukan maksimal.",
        "Human oversight: Tier tinggi = manusia dekat ke keputusan (in-the-loop); eskalasi didefinisikan eksplisit; rubber stamping bukan oversight.",
        "Audit trail mencatat siapa, apa, kapan, dengan model/prompt versi berapa, dan putusan manusia — fondasi investigasi insiden.",
        "System card = paspor aplikasi AI; setiap perubahan prompt/model berversi + changelog agar rollback mungkin.",
        "Metrik produk dibaca berpasangan: containment + task success; biaya dihitung per tugas SELESAI, bukan per request.",
        "Ekonomi: hitung unit economics + biaya tak terlihat; lampu merah = nilai kecil, volume rendah, risiko > nilai, tanpa pemilik. Insiden AI: deteksi → kill switch → audit trail → rollback prompt/model → postmortem.",
      ],
      quiz: [
        {
          q: "Apa tujuan utama risk tiering dalam governance AI?",
          options: [
            { text: "Memasangkan kontrol yang sebanding dengan risiko tiap use case", why: "Tepat: Tier 1 jalur ringan, Tier 4 kontrol berat — proporsional, bukan seragam.", correct: true },
            { text: "Memberi peringkat model dari yang terbaik sampai terburuk", why: "Tiering mengelompokkan RISIKO use case, bukan kualitas model.", correct: false },
            { text: "Memperlambat semua proyek AI agar aman", why: "Kebalikannya: tiering mempercepat Tier 1–2 dengan jalur ringan yang jelas.", correct: false },
            { text: "Menghapus kebutuhan human oversight", why: "Tiering justru menentukan SEBERAPA dekat manusia harus ke keputusan.", correct: false },
          ],
        },
        {
          q: "Kapan AI WAJIB eskalasi ke manusia? (pilih yang paling lengkap)",
          options: [
            { text: "Kepercayaan rendah, topik sensitif, nilai di atas ambang, atau di luar wewenang", why: "Tepat: keempat pemicu baku harus didefinisikan eksplisit sebelum launch.", correct: true },
            { text: "Hanya saat pengguna memintanya", why: "Menunggu diminta = insiden sudah terjadi; eskalasi harus proaktif.", correct: false },
            { text: "Hanya saat sistem error", why: "Output 'lancar' yang salah (seperti janji kompensasi palsu) justru kasus utamanya.", correct: false },
            { text: "Tidak perlu eskalasi jika akurasinya tinggi", why: "Akurasi tinggi tidak menghapus tail risk; cerita Langkah 2: akurasi 94 persen, tetap insiden.", correct: false },
          ],
        },
        {
          q: "Mengapa 'human in-the-loop' bisa gagal total sebagai kontrol?",
          options: [
            { text: "Manusia hanya mengeklik setuju ratusan kali sehari tanpa waktu menilai — rubber stamping", why: "Tepat: oversight butuh beban manusiawi, informasi cukup, dan insentif untuk menolak.", correct: true },
            { text: "Manusia terlalu lambat dibanding AI", why: "Kecepatan bukan masalahnya; masalahnya kualitas penilaian yang tidak mungkin dilakukan.", correct: false },
            { text: "AI tidak bisa menampilkan usulan ke manusia", why: "Secara teknis bisa; ini soal desain proses, bukan keterbatasan teknis.", correct: false },
            { text: "Regulator melarang manusia terlibat", why: "Kebalikannya: untuk keputusan berdampak, keterlibatan manusia justru dituntut.", correct: false },
          ],
        },
        {
          q: "Apa isi minimum audit trail untuk keputusan AI yang penting?",
          options: [
            { text: "Siapa, apa, kapan, versi model/prompt, dan putusan manusia", why: "Tepat: lima elemen ini yang membuat investigasi insiden menjadi membaca log, bukan arkeologi.", correct: true },
            { text: "Cukup timestamp dan nama model", why: "Tanpa versi prompt dan putusan manusia, kamu tidak tahu konfigurasi apa yang aktif dan siapa menyetujuinya.", correct: false },
            { text: "Cukup log error saja", why: "Insiden AI sering tanpa error teknis — outputnya 'sukses' tetapi salah.", correct: false },
            { text: "Tidak perlu, akurasi sudah cukup", why: "Akurasi tidak menjawab 'prompt versi berapa yang dipakai malam itu?'", correct: false },
          ],
        },
        {
          q: "Mengapa containment rate harus selalu dibaca bersama task success rate?",
          options: [
            { text: "Containment tinggi bisa berarti AI menolak eskalasi padahal seharusnya — false containment", why: "Tepat: 95 persen containment dengan 40 persen task success = AI rajin menyelesaikan yang salah.", correct: true },
            { text: "Keduanya mengukur hal yang persis sama", why: "Berbeda: containment = tanpa manusia; task success = benar-benar selesai dengan benar.", correct: false },
            { text: "Task success tidak bisa diukur", why: "Bisa, lewat evaluasi sampel, survei, atau verifikasi tindak lanjut.", correct: false },
            { text: "Containment tidak ada hubungannya dengan biaya", why: "Containment langsung memengaruhi biaya (sesi tanpa manusia lebih murah) — justru itu yang membuatnya berbahaya sendirian.", correct: false },
          ],
        },
        {
          q: "Langkah pertama saat output AI berbahaya viral?",
          options: [
            { text: "Hentikan pendarahan: kill switch / fallback ke mode aman", why: "Tepat: batasi kerusakan dulu — matikan atau persempit fitur dalam hitungan menit — baru investigasi.", correct: true },
            { text: "Langsung perbaiki prompt dan deploy", why: "Memperbaiki tanpa menghentikan penyebaran = insiden terus membesar selama kamu mengetik.", correct: false },
            { text: "Tunggu sampai viral reda sendiri", why: "Viral tidak reda sendiri; setiap jam menambah korban dan tangkapan layar.", correct: false },
            { text: "Hapus semua log agar tidak panik", why: "Menghapus log menghancurkan audit trail — investigasi menjadi mustahil dan ini memperburuk masalah hukum.", correct: false },
          ],
        },
      ],
    },
  ],
};
