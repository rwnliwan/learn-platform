import type { V2Lesson } from "../lib/types";

// Funnel verifikasi: 6 klaim draf AI → 3 terdukung sumber → 3 tak terdukung (dibuang/ditulis ulang).
const KLAIM_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram batang: dari 6 klaim draf AI, 3 terdukung sumber dan 3 tak terdukung.">
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<g><rect x="70" y="60" width="100" height="180" fill="var(--c1)"/><text x="120" y="50" fill="var(--chart-text)">Klaim draf AI</text><text x="120" y="150" fill="#fff" font-size="16" font-weight="600">6</text></g>
<g><rect x="230" y="150" width="100" height="90" fill="var(--c2)"/><text x="280" y="140" fill="var(--chart-text)">Terdukung sumber</text><text x="280" y="196" fill="#fff" font-size="16" font-weight="600">3</text></g>
<g><rect x="390" y="150" width="100" height="90" fill="#e11d48"/><text x="440" y="140" fill="var(--chart-text)">Tak terdukung</text><text x="440" y="196" fill="#fff" font-size="16" font-weight="600">3</text></g>
</g>
<line x1="40" y1="250" x2="540" y2="250" stroke="var(--chart-text)" stroke-width="1"/>
<text x="280" y="272" font-size="13" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)" font-weight="600">Setengah memo Dita adalah fiksi yang rapi</text>
<text x="280" y="290" font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">Tiga klaim dibuang atau ditulis ulang sebelum memo sampai ke komite.</text>
</svg>`;

export const pmE1: V2Lesson = {
  slug: "pm-e1-ai-tools-analis",
  track: "Portfolio Management",
  module: "Praktik Profesional",
  title: "PME1 — AI Tools untuk Analis: Workflow, Verifikasi, Batas",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-memo",
      eyebrow: "Langkah 1 · Cerita",
      title: "Memo 20 menit — dan angka yang tidak pernah ada",
      prose: [
        "Dita, analis junior di sebuah manajer investasi, diminta menyiapkan memo rekomendasi saham untuk komite investasi keesokan paginya. Ia mengunggah laporan tahunan 120 halaman plus transkrip earnings call ke sebuah LLM, lalu meminta: “buatkan memo investasi 8 halaman.” Dua puluh menit kemudian memo itu jadi — rapi, bernada profesional, lengkap dengan tabel. Salah satu kalimatnya berbunyi meyakinkan: “Margin EBITDA 2024 mencapai 34%, tertinggi dalam lima tahun.”",
        "Komite hampir menyetujui rekomendasi BELI. Malam sebelum rapat, Dita — gelisah tanpa alasan jelas — membuka laporan tahunan asli dan mencari angka itu. Tidak ada. Margin EBITDA sebenarnya 21%. Angka 34% tidak pernah ditulis di dokumen mana pun; AI merangkainya karena “terdengar” seperti kelanjutan yang masuk akal dari kalimat-kalimat sebelumnya.",
        "Twist-nya: AI tidak berbohong — ia tidak punya konsep benar/salah, hanya “kata berikutnya yang paling mungkin”. Yang hampir salah adalah Dita: ia memperlakukan output AI seperti kutipan dari laporan, padahal ia adalah DRAF yang setiap angkanya wajib diverifikasi. Lesson ini tentang workflow profesional memakai AI: di titik mana ia menghemat waktu, bagaimana memverifikasi setiap klaim angka, dan garis merah yang tidak boleh dilewati.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memetakan titik-titik workflow analis di mana LLM membantu vs di mana ia berbahaya; (2) menghitung tingkat dukungan klaim sebuah draf AI terhadap dokumen sumber; (3) menjalankan audit angka atas draf memo dengan pola “klaim → sumber”; (4) menjelaskan tiga batas kepatuhan penggunaan AI (data sensitif, keputusan final, akuntabilitas); (5) memutuskan kapan memakai AI vs mengerjakannya manual.",
        "Daftar isi: 1) Cerita memo 20 menit · 2) Modal dasar: peta workflow AI · 3) Konsep: halusinasi angka · 4) Rumus tingkat dukungan · 5) Lab: audit draf memo AI · 6) Chart klaim · 7) Peta keputusan · 8) Mini-case: screening 50 emiten · 9) Checkpoint.",
        "Metadata: ±60 menit · 1 lab Python · 1 chart · 6 kuis · 1 mini-case. Prasyarat: tidak ada.",
      ],
      tasks: [],
      reference: "AI menyusun, manusia memutuskan — setiap angka diverifikasi.",
    },
    {
      id: "modal-workflow",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Peta workflow: di mana AI membantu, di mana ia berbahaya",
      prose: [
        "Fondasi — tiga zona kerja analis. ZONA HIJAU (AI sangat membantu): ekstraksi informasi dari dokumen panjang (“sebutkan semua panduan manajemen tentang belanja modal”), peringkasan, draf awal memo, dan brainstorming sudut analisis. ZONA KUNING (AI membantu dengan verifikasi wajib): angka, kutipan, dan klaim faktual apa pun — setiap butirnya harus dilacak ke sumber. ZONA MERAH (jangan serahkan ke AI): keputusan investasi final, penilaian yang menjadi dasar rekomendasi, dan data sensitif (posisi portofolio, data nasabah) yang diunggah ke tool publik.",
        "Prinsip payungnya: AI adalah analis junior yang super cepat TETAPI tidak pernah bisa dimintai pertanggungjawaban. Semua yang ia hasilkan adalah draf — dan draf yang tidak diverifikasi sama berbahayanya dengan analisis yang tidak dikerjakan.",
        "Lesson ini menjawab: bagaimana memakai AI tanpa menjadi Dita — workflow verifikasi yang konkret, bukan sekadar “hati-hati”.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: perlakukan output AI seperti rumor",
        body: "Rumor bisa benar dan bisa salah — analis profesional tidak pernah mengutip rumor tanpa konfirmasi. Output LLM persis begitu: bahan mentah yang nilainya NOL sampai terverifikasi, dan bernilai TINGGI setelah lolos verifikasi karena ia menghemat jam kerja.",
      },
      reference: "Hijau: ekstraksi & draf. Kuning: angka (verifikasi). Merah: keputusan & data sensitif.",
    },
    {
      id: "konsep-halusinasi",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Halusinasi angka: Si Perangkai Meyakinkan",
      prose: [
        "Definisi: halusinasi angka adalah klaim numerik yang dihasilkan LLM dan terdengar masuk akal tetapi tidak didukung dokumen sumber. Mekanismenya sederhana: model memprediksi kata berikutnya berdasarkan pola statistik, bukan dengan “membaca tabel lalu menyalin angkanya”. Angka 34% di cerita pembuka muncul karena di konteksnya, angka belasan-puluhan persen memang sering muncul di kalimat tentang margin.",
        "Tiga pola halusinasi yang paling sering menjebak analis. Pertama, ANGKA CAMPURAN: menggabungkan dua angka nyata menjadi satu angka palsu (pendapatan 2023 + pertumbuhan 2024 = “pendapatan 2024”). Kedua, PRESISI PALSU: “Rp4.812.550.000.000” — angka yang sangat spesifik terasa kredibel, padahal presisi bukan bukti kebenaran. Ketiga, KLAIM NEGATIF: “perusahaan tidak memiliki utang” — sulit diverifikasi karena ketiadaan memang tidak tertulis di mana-mana.",
        "Kepribadiannya: halusinasi angka adalah SI PERANGKAI MEYAKINKAN — ia tidak pernah ragu, tidak pernah berkata “saya tidak tahu”, dan selalu menyajikan angka dengan format yang paling meyakinkan. Lawan satu-satunya: kebiasaan memaksa setiap angka menunjukkan KTP-nya — “angka ini dari halaman berapa?”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “AI tidak berhalusinasi kalau prompt-nya bagus”",
        type: "pitfall",
        body: "Yang benar: prompt yang baik MENGURANGI halusinasi, tidak menghilangkannya. Model yang sama, dengan prompt yang sama, bisa memberi angka berbeda di dua percobaan — karena sifatnya probabilistik. Satu-satunya penangkal yang andal adalah verifikasi terhadap sumber, bukan prompt yang lebih canggih.",
      },
      reference: "Angka spesifik ≠ angka benar. Tanya KTP setiap angka.",
    },
    {
      id: "konsep-dukungan",
      eyebrow: "Langkah 4 · Konsep inti + rumus",
      title: "Tingkat dukungan: satu angka untuk kejujuran draf",
      prose: [
        "Sebelum sebuah draf AI boleh diteruskan, ukur dulu TINGKAT DUKUNGAN-nya — proporsi klaim faktual dalam draf yang bisa dilacak ke dokumen sumber:",
      ],
      formula: String.raw`\text{Dukungan} = \frac{N_{\text{terverifikasi}}}{N_{\text{total}}}`,
      formulaNote:
        "N_total = jumlah klaim faktual (angka, tanggal, kutipan) dalam draf — bukan jumlah kalimat opini. N_terverifikasi = klaim yang cocok dengan dokumen sumber (nilai sama, atau dalam toleransi pembulatan yang wajar). Contoh: draf Dita memuat 6 klaim angka; 3 cocok dengan laporan tahunan → Dukungan = 3/6 = 50%. Aturan praktis tim yang disiplin: draf dengan dukungan di bawah 80% ditulis ulang, bukan diperbaiki tambal-sulam.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “data internal aman dimasukkan ke chatbot publik — kan cuma teks”",
        type: "pitfall",
        body: "Yang benar: teks yang diunggah ke layanan publik bisa dipakai untuk training model atau bocor lewat prompt pengguna lain — posisi portofolio, pipeline deal, dan data nasabah TIDAK BOLEH masuk ke tool yang tidak dikontrak secara enterprise. Untuk data sensitif, pakai deployment privat/enterprise atau jangan pakai AI sama sekali.",
      },
      reference: "Dukungan < 80% = tulis ulang, bukan tambal sulam.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 5 · Lab",
      title: "Audit draf memo AI — temukan tiga klaim fiktif",
      prose: [
        "Lab ini mensimulasikan audit memo Dita: tabel `sumber` berisi angka resmi dari laporan tahunan, dan `klaim` berisi enam klaim angka dari draf AI. Tugasmu: untuk setiap klaim, cek apakah nama metriknya ada di sumber DAN nilainya sama persis — jika tidak, masukkan ke daftar tak terdukung.",
        "Perhatikan tiga jebakan yang disengaja: `margin_ebitda` 0,34 vs 0,21 di sumber (angka campuran), `kas` 900 miliar vs 650 miliar (presisi palsu yang meyakinkan), dan `dividen_yield` yang tidak ada sama sekali di sumber (klaim negatif terselubung).",
        "Coba: ubah satu nilai klaim menjadi sama dengan sumber, lalu jalankan ulang — lihat `dukungan` naik dan daftar tak terdukung menyusut. Itulah sensasi “membersihkan” draf sebelum ke komite.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `terverifikasi` (klaim yang nama & nilainya cocok sumber) dan `dukungan = terverifikasi / jumlah klaim`" },
        { id: "t2", text: "Kumpulkan `tak_terdukung`: daftar nama klaim yang tidak cocok atau tidak ada di sumber; cetak ringkasan persis format contoh" },
      ],
      expected: "Dukungan=50%  Tak terdukung: ['margin_ebitda', 'kas', 'dividen_yield']",
      code: {
        starter: `# Angka resmi dari laporan tahunan (Rp)
sumber = {
    "pendapatan_2025": 4_800_000_000_000,
    "margin_ebitda": 0.21,
    "utang_bersih": 1_200_000_000_000,
    "roe": 0.14,
    "kas": 650_000_000_000,
}

# Klaim angka dari draf memo AI: (nama_metrik, nilai_klaim)
klaim = [
    ("pendapatan_2025", 4_800_000_000_000),
    ("margin_ebitda", 0.34),
    ("utang_bersih", 1_200_000_000_000),
    ("roe", 0.14),
    ("kas", 900_000_000_000),
    ("dividen_yield", 0.05),
]

# TULIS KODEMU
terverifikasi =
tak_terdukung =
dukungan =

print(f"Dukungan={dukungan:.0%}  Tak terdukung: {tak_terdukung}")`,
        lockLines: 18,
        solution: `# Angka resmi dari laporan tahunan (Rp)
sumber = {
    "pendapatan_2025": 4_800_000_000_000,
    "margin_ebitda": 0.21,
    "utang_bersih": 1_200_000_000_000,
    "roe": 0.14,
    "kas": 650_000_000_000,
}

# Klaim angka dari draf memo AI: (nama_metrik, nilai_klaim)
klaim = [
    ("pendapatan_2025", 4_800_000_000_000),
    ("margin_ebitda", 0.34),
    ("utang_bersih", 1_200_000_000_000),
    ("roe", 0.14),
    ("kas", 900_000_000_000),
    ("dividen_yield", 0.05),
]

# TULIS KODEMU
terverifikasi = 0
tak_terdukung = []
for nama, nilai in klaim:
    if nama in sumber and sumber[nama] == nilai:
        terverifikasi += 1
    else:
        tak_terdukung.append(nama)
dukungan = terverifikasi / len(klaim)

print(f"Dukungan={dukungan:.0%}  Tak terdukung: {tak_terdukung}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dukungan", value: 0.5, tol: 1e-9, label: "`dukungan` = 0,5 (50%)", msg: "3 dari 6 klaim cocok dengan sumber." },
          { kind: "equal", task: "t2", name: "tak_terdukung", value: ["margin_ebitda", "kas", "dividen_yield"], label: "tiga klaim fiktif tertangkap", msg: "margin_ebitda (angka salah), kas (angka salah), dividen_yield (tidak ada di sumber)." },
          { kind: "stdout_matches", task: "t2", pattern: "Dukungan=50%  Tak terdukung: \\['margin_ebitda', 'kas', 'dividen_yield'\\]", label: "`print` menampilkan ringkasan audit", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Setiap klaim angka wajib menunjukkan KTP-nya.",
    },
    {
      id: "chart-klaim",
      eyebrow: "Langkah 6 · Konsep + chart",
      title: "Visual audit: setengah memo adalah fiksi yang rapi",
      prose: [
        "Chart di bawah merangkum hasil lab: dari 6 klaim angka dalam draf AI, hanya 3 yang terdukung dokumen sumber — setengahnya fiksi. Inilah alasan aturan “dukungan < 80% = tulis ulang”.",
        "Cara membaca chart: batang pertama = total klaim dalam draf; batang kedua = klaim yang cocok dengan sumber; batang merah = klaim yang harus dibuang atau ditulis ulang sebelum memo diteruskan.",
        "Interpretasi: chart ini BUKAN tentang AI yang buruk — draf 20 menit dengan 50% kebenaran masih jauh lebih cepat daripada menulis dari nol. Ia tentang WORKFLOW: nilai AI ada di kecepatan draf, nilai analis ada di verifikasi. Memo yang sampai ke komite harus 100% terdukung — tidak ada negosiasi.",
      ],
      figure: { svg: KLAIM_SVG, alt: "Diagram batang: 6 klaim draf AI, 3 terdukung sumber, 3 tak terdukung.", caption: "Audit Dita: setengah klaim draf AI tidak punya sumber." },
      tasks: [],
      reference: "Nilai AI = kecepatan draf. Nilai analis = verifikasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan memakai AI, kapan tidak",
      prose: [
        "Skenario 1 — Ekstraksi dari dokumen panjang (mis. “sebutkan semua panduan belanja modal”) → PAKAI AI, lalu verifikasi sampling 20% hasilnya. Alasan: tugas mekanis, kesalahan mudah dideteksi.",
        "Skenario 2 — Draf memo atau email analisis → PAKAI AI sebagai draf, lalu audit angka 100% dengan pola klaim → sumber. Alasan: kecepatan draf nyata, risiko terkonsentrasi di angka.",
        "Skenario 3 — Angka final untuk komite investasi → JANGAN andalkan AI; hitung/ambil dari sumber primer. Alasan: satu angka salah di depan komite merusak kredibilitas analis bertahun-tahun.",
        "Skenario 4 — Data sensitif (posisi portofolio, data nasabah) → JANGAN masukkan ke tool publik; pakai deployment enterprise atau kerjakan manual. Alasan: kebocoran tidak bisa di-undo.",
        "Skenario 5 — Screening awal 50 emiten menjadi 10 kandidat → PAKAI AI sebagai hipotesis, bukan vonis; 10 kandidat tetap dianalisis manual penuh. Alasan: AI bagus menemukan pola, buruk menilai pengecualian.",
        "Aturan praktis 10 detik: sebelum memakai AI, jawab tiga pertanyaan — (1) apakah outputnya akan diverifikasi? (2) apakah datanya boleh keluar? (3) siapa yang bertanggung jawab jika salah? Jika jawaban (3) adalah “AI-nya”, jangan pakai.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai AI untuk “mempercepat” lalu melewatkan verifikasi karena tenggat mepet — persis saat verifikasi paling dibutuhkan. Disiplin yang benar: alokasikan 30% waktu yang dihemat AI khusus untuk audit angka.",
      },
      reference: "Tiga pertanyaan sebelum pakai AI: verifikasi, data, akuntabilitas.",
    },
    {
      id: "minicase-screening",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Screening 50 emiten dalam satu sore",
      prose: [
        "Kasus: Tim analis memakai LLM untuk screening awal 50 emiten: “tandai emiten dengan pertumbuhan pendapatan >15% dan utang bersih/EBITDA < 2x”. AI mengembalikan 8 kandidat dalam 10 menit. Audit manual menemukan: 3 dari 8 memakai angka pendapatan yang salah tahun (2023 diklaim sebagai 2024 — pola angka campuran), sehingga tidak memenuhi kriteria. Kandidat valid yang tersisa: 5.",
        "Pertanyaan 1: Berapa tingkat dukungan draf screening ini, dan apakah ia lolos ambang 80%?",
        "Pertanyaan 2: Apakah screening ini “gagal”? Apa keputusan workflow yang tepat berikutnya?",
        "Pembahasan: (1) Dukungan = 5/8 = 62,5% — di bawah 80%, jadi drafnya ditulis ulang (dalam arti: 3 kandidat dibuang, bukan seluruh proses diulang). (2) Tidak gagal — screening menghemat waktu menyaring 50 → 8, dan audit menangkap 3 kesalahan sebelum menjadi rekomendasi. Workflow yang tepat: AI untuk penyaringan kasar + audit penuh atas kandidat yang lolos. Kesalahan terbesar justru jika analis mempercayai 8 kandidat mentah-mentah.",
      ],
      tasks: [],
      reference: "AI menyaring, manusia memutuskan — 62,5% berarti buang 3, bukan buang prosesnya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran — dari zona workflow hingga audit klaim."],
      tasks: [],
      summary: [
        "Tiga zona: hijau (ekstraksi, draf), kuning (angka — verifikasi wajib), merah (keputusan final, data sensitif).",
        "Halusinasi angka: angka campuran, presisi palsu, klaim negatif — semuanya dilawan dengan pola klaim → sumber.",
        "Dukungan = N_terverifikasi / N_total; di bawah 80% = tulis ulang.",
        "Nilai AI ada di kecepatan draf; nilai analis ada di verifikasi — memo ke komite harus 100% terdukung.",
      ],
      next: { label: "PME2 — ESG dalam Praktik: Skor, Greenwashing, Integrasi", href: "/v2/learn/pm-e2-esg-praktis" },
      quiz: [
        {
          q: "Dita menemukan angka 34% di memo AI yang tidak ada di laporan. Ini contoh dari…",
          options: [
            { text: "Prompt yang buruk", why: "Salah: prompt bisa diperbaiki, tetapi sifat probabilistik model tetap bisa menghasilkan angka fiktif." },
            { text: "Halusinasi angka — model merangkai angka yang paling mungkin secara statistik", why: "Tepat: LLM memprediksi kata berikutnya, bukan menyalin dari tabel.", correct: true },
            { text: "Bug pada model", why: "Salah: ini perilaku yang diharapkan dari cara kerja model, bukan bug." },
            { text: "Data training yang kedaluwarsa", why: "Salah: masalahnya bukan umur data, melainkan angka yang tidak ada di sumber mana pun." },
          ],
        },
        {
          q: "Draf memuat 10 klaim faktual, 9 terverifikasi. Tingkat dukungan dan tindakannya?",
          options: [
            { text: "90% — teruskan langsung", why: "Salah: 90% ≥ 80% memang lolos tulis-ulang, tetapi 1 klaim yang tak terdukung tetap harus dibuang/diperbaiki — bukan diteruskan mentah." },
            { text: "90% — perbaiki 1 klaim yang tak terdukung, lalu teruskan", why: "Tepat: di atas ambang 80% sehingga tidak perlu tulis ulang total, namun setiap klaim tak terdukung tetap wajib dibereskan.", correct: true },
            { text: "90% — tulis ulang total", why: "Salah: tulis ulang total hanya untuk dukungan di bawah 80%." },
            { text: "10% — draf gagal total", why: "Salah: 9/10 = 90%, bukan 10%." },
          ],
        },
        {
          q: "Manakah yang MASUK zona merah (jangan serahkan ke AI)?",
          options: [
            { text: "Meringkas transkrip earnings call 60 halaman", why: "Salah: ini zona hijau — ekstraksi dengan verifikasi sampling." },
            { text: "Membuat draf awal memo investasi", why: "Salah: ini zona hijau/kuning — draf selalu diaudit." },
            { text: "Mengunggah daftar posisi portofolio ke chatbot publik untuk dianalisis", why: "Tepat: data sensitif ke tool publik = risiko kebocoran yang tidak bisa di-undo.", correct: true },
            { text: "Brainstorming sudut analisis untuk emiten baru", why: "Salah: ini zona hijau — ide, bukan angka final." },
          ],
        },
        {
          q: "“Presisi palsu” sebagai pola halusinasi maksudnya…",
          options: [
            { text: "AI menulis angka sangat spesifik sehingga terasa kredibel, padahal tidak didukung sumber", why: "Tepat: presisi adalah soal format, bukan bukti kebenaran.", correct: true },
            { text: "AI membulatkan angka sehingga tidak akurat", why: "Salah: itu masalah pembulatan biasa, bukan halusinasi." },
            { text: "AI menolak memberi angka pasti", why: "Salah: itu kehati-hatian, bukan halusinasi." },
            { text: "AI mengutip halaman yang salah", why: "Salah: itu soal atribusi, bukan presisi palsu." },
          ],
        },
        {
          q: "Tiga pertanyaan sebelum memakai AI menurut aturan 10 detik adalah…",
          options: [
            { text: "Cepat, murah, dan mudah?", why: "Salah: itu kriteria efisiensi, bukan akuntabilitas." },
            { text: "Apakah output diverifikasi? Apakah data boleh keluar? Siapa bertanggung jawab jika salah?", why: "Tepat: verifikasi, kerahasiaan data, dan akuntabilitas — ketiganya harus terjawab sebelum pakai.", correct: true },
            { text: "Model apa? Versi berapa? Berapa token?", why: "Salah: itu detail teknis, bukan keputusan pemakaian." },
            { text: "Atasan setuju? Klien tahu? Regulator izin?", why: "Salah: berlebihan untuk pemakaian sehari-hari; yang kritis adalah tiga pertanyaan akuntabilitas." },
          ],
        },
        {
          q: "Screening AI menghasilkan 8 kandidat, audit menemukan 3 tidak valid. Kesimpulan workflow yang tepat?",
          options: [
            { text: "AI tidak berguna untuk screening — kembali manual penuh", why: "Salah: 50 → 8 dalam 10 menit adalah penghematan nyata; yang dibuang hanya 3 kandidat, bukan prosesnya." },
            { text: "AI untuk penyaringan kasar + audit penuh atas kandidat lolos; 3 kandidat dibuang", why: "Tepat: nilai AI di kecepatan, nilai analis di verifikasi — workflow gabungan, bukan salah satu.", correct: true },
            { text: "Terima 8 kandidat karena mayoritas (5) valid", why: "Salah: 3 rekomendasi berbasis angka salah bisa menjadi keputusan investasi yang salah." },
            { text: "Ulangi screening dengan prompt lebih panjang", why: "Salah: prompt lebih baik tidak menggantikan audit kandidat." },
          ],
        },
      ],
    },
  ],
};
