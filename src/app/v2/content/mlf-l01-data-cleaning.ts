import type { V2Lesson } from "../lib/types";

export const mlfL01: V2Lesson = {
  slug: "mlf-l01-data-cleaning",
  track: "Machine Learning Finance",
  module: "Data Foundations — prasyarat M1",
  title: "L0.1 — Data Cleaning: Hapus, Perbaiki, atau Biarkan?",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model tidak pernah lebih bersih dari datanya. Lesson ini mengajarkan audit data: menghitung masalahnya dulu — nilai kosong, duplikat, tipe salah, kode tak dikenal — lalu memutuskan tiap masalah: hapus, perbaiki, atau biarkan dengan dokumentasi.",
        "Tujuan lesson ini:",
        "• Menghitung empat jenis masalah data (missing, duplikat, tipe salah, kode inkonsisten) pada satu file.",
        "• Memakai aturan keputusan untuk tiap masalah: kapan hapus, kapan perbaiki, kapan biarkan.",
        "• Membedakan duplikat persis dari duplikat yang tampak sama tapi sah.",
        "• Memutuskan nasib kode tak terdokumentasi dengan angka, bukan firasat.",
        "Isi lesson: cerita file 20 pengajuan → nilai kosong → duplikat → tipe salah → kode tak dikenal → 2 lab → peta keputusan → mini-case notebook → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari audit nyata notebook credit scoring Septian (cell 10): 30.000 nasabah, nilai kosong 0, baris duplikat 0, EDUCATION tak terdokumentasi (0, 5, 6) sebanyak 345 baris, MARRIAGE sama dengan 0 sebanyak 54 baris.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "File 20 pengajuan yang tidak bisa langsung dipakai",
      prose: [
        "Seorang analis kredit menerima file 20 pengajuan. Sepintas file itu rapi: 20 baris, 5 kolom (nama, income, keterlambatan, pendidikan, kota). Begitu dibuka, masalahnya bermunculan: tiga income kosong, dua baris kembar persis, income tertulis '1.700.000', kota tertulis 'jakarta', 'JAKARTA ', dan 'Jkt' untuk kota yang sama.",
        "Godaan pertama: langsung hapus semua yang bermasalah. Godaan kedua: langsung isi yang kosong dengan rata-rata. Keduanya salah bila dilakukan sebelum menghitung. Menghapus 3 dari 20 baris berarti membuang 15 persen data — dan yang dibuang mungkin justru nasabah yang paling penting. Mengisi rata-rata tanpa tahu kenapa kosong berarti menciptakan data yang tidak pernah ada.",
        "Lesson ini memakai file 20 baris itu sebagai pasien: diaudit dulu, dihitung masalahnya, lalu tiap masalah diputuskan satu per satu. Di akhir lesson, file yang sama menjadi 18 baris bersih — dan kamu tahu persis kenapa tiap keputusan diambil.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: data kotor berarti data rusak",
        type: "pitfall",
        body: "Yang benar: 'kotor' adalah empat hal yang berbeda — kosong, duplikat, tipe salah, dan kode tak dikenal — dan masing-masing punya obat yang berbeda. Nilai kosong bukan kerusakan bila polanya acak; duplikat belum tentu salah catat; kode tak dikenal belum tentu salah. Audit dulu, vonis belakangan.",
      },
    },
    {
      id: "missing",
      eyebrow: "Langkah 3 · Nilai kosong",
      title: "Nilai kosong: hitung dulu, putuskan belakangan",
      prose: [
        "Nilai kosong adalah sel yang tidak terisi. Pertanyaan pertamanya bukan 'diisi apa?', melainkan 'berapa banyak dan kenapa?'. Dua angka yang menentukan: jumlah kosong dan persentasenya terhadap total baris.",
        "Nilai: file 20 pengajuan — income kosong 3 baris, yaitu 3 dibagi 20 sama dengan 15 persen [lab]. Band keputusannya kontinu tanpa lubang: di bawah 5 persen dan polanya acak (MCAR) — hapus barisnya masih aman; 5 sampai 30 persen — jangan hapus diam-diam, imputasi dengan metode yang didokumentasikan (mekanismenya di L0.2); di atas 30 persen atau polanya tidak acak (MNAR) — selidiki dulu, jangan pakai kolom itu mentah-mentah. File ini 15 persen — masuk band tengah: jangan hapus, jangan isi sembarangan.",
        "Gambar di bawah adalah hasil audit file itu: lima batang untuk lima jenis masalah. Batang tertinggi bukan missing — melainkan kota yang tidak konsisten (6 baris). Audit mengubah firasat menjadi daftar kerja: masalah terbesarnya bukan yang pertama terlihat.",
        "Baik atau buruk: missing di bawah 5 persen dan acak baik untuk dihapus — kerugiannya kecil dan tidak bias. Missing 15 persen buruk bila dihapus diam-diam — seperenam data hilang dan yang hilang mungkin bukan acak. Missing buruk bila diisi rata-rata tanpa memeriksa skew — rata-rata dari data miring bukan wakil yang jujur (buktinya di L0.2).",
        "Mitigasi: laporkan selalu dua angka — jumlah dan persen — lalu periksa pola kosongnya: apakah baris yang kosong punya ciri yang sama (misal semuanya terlambat)? Bila ya, itu sinyal mekanisme missing (MAR/MNAR), dan pengisiannya harus memakai mekanisme itu — bukan rata-rata global. Prosedur lengkapnya di L0.2.",
        "Missing punya tiga level hitungan — dan ketiganya bisa bercerita berbeda. Per kolom: income kosong 3 dari 20, yaitu 15 persen [lab]; nama, keterlambatan, pendidikan, dan kota masing-masing 0 dari 20, yaitu 0 persen [lab] — keputusan membuang atau mengimputasi dibuat per kolom, bukan dari satu angka global. Per baris: 3 baris punya minimal satu sel kosong (Dewi, Hana, Niko) — 3 dari 20 sama dengan 15 persen [lab]. Per sel: 3 sel kosong dari 100 sel (20 baris × 5 kolom) — 3 dari 100 sama dengan 3 persen [lab]. Di file ini ketiganya kebetulan dekat — tapi itu kebetulan: contoh [ilustrasi] 10 baris dengan income kosong di baris 1, 2, 3 dan kota kosong di baris 3, 4 memberi per-kolom income 3 dari 10 sama dengan 30 persen dan kota 2 dari 10 sama dengan 20 persen, per-baris 4 dari 10 sama dengan 40 persen (baris 1, 2, 3, 4), dan per-sel 5 dari 50 sama dengan 10 persen — satu angka global 10 persen menyembunyikan bahwa 40 persen baris terdampak dan income 30 persen kosong. Selalu laporkan ketiganya, dan dokumentasikan keputusan di level kolom dan baris: kolom mana yang diimputasi, baris mana yang dihapus, dan kenapa.",
        "Band keputusan di lesson ini adalah heuristik — titik awal, bukan hukum. Perbedaannya: persentase (missing income 15 persen — masuk band tengah 5–30 persen); jumlah absolut (3 baris dari 20 — kecil, tapi seperlima data); mekanisme (belum diketahui — pola kosongnya harus dicek dulu, L0.2); dampak bisnis/model (hapus diam-diam berarti membuang 15 persen data; isi buta berarti menciptakan data); keputusan akhir + alasan (selidiki pola dulu, jangan hapus, jangan isi sembarangan — karena 15 persen cukup besar untuk membiaskan dan 3 baris cukup kecil untuk diselidiki satu per satu). Band yang sama berlaku sebaliknya: EDUCATION tak dikenal 345 dari 30.000 (1,15 persen) vs 2 dari 20 (10 persen) — persentasenya berbeda jauh, tapi jumlah absolutnya 345 vs 2: persentase menentukan band, jumlah absolut menentukan biaya dan cara memeriksanya. Dan batas band bukan tebing: missing 4,9 persen vs 5,2 persen [ilustrasi] pada file 1.000 baris (49 vs 52 baris) — beda 3 baris — tidak boleh menghasilkan keputusan yang berlawanan; keduanya dekat batas, keduanya dicek polanya dan didokumentasikan. Bila dua angka di sisi berlawanan sebuah batas memberi keputusan yang sama, itulah tanda band itu dipakai sebagai heuristik, bukan sebagai hukum.",
      ],
      formula: String.raw`\text{missing rate (per baris)} = \frac{\text{jumlah baris dengan } \geq 1 \text{ sel kosong}}{\text{total baris}}`,
      formulaNote: "Missing rate (per baris): jumlah baris yang punya minimal satu sel kosong dibagi total baris — definisi inilah yang dipakai band keputusan di lesson ini (di bawah 5 persen, 5–30 persen, di atas 30 persen). Dipakai bersama pola missing-nya — angka tanpa pola tidak cukup untuk memutuskan.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Lima batang: masalah data di file 20 baris; kota tidak konsisten tertinggi 6">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Audit file 20 pengajuan: masalah per jenis</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="166.0" x2="52" y2="166.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="169.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="48" y1="126.0" x2="52" y2="126.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="129.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="48" y1="86.0" x2="52" y2="86.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="89.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">jenis masalah</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">jumlah baris</text>
<rect x="70.7" y="146.0" width="45.5" height="60.0" fill="var(--c1)"/>
<text x="93.4" y="140.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3</text>
<text x="93.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Missing</text>
<rect x="153.5" y="166.0" width="45.5" height="40.0" fill="var(--c1)"/>
<text x="176.2" y="160.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2</text>
<text x="176.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Duplikat</text>
<rect x="236.3" y="146.0" width="45.5" height="60.0" fill="var(--c1)"/>
<text x="259.0" y="140.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3</text>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Tipe salah</text>
<rect x="319.1" y="86.0" width="45.5" height="120.0" fill="var(--c4)"/>
<text x="341.8" y="80.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6</text>
<text x="341.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Kota</text>
<rect x="401.9" y="166.0" width="45.5" height="40.0" fill="var(--c1)"/>
<text x="424.6" y="160.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2</text>
<text x="424.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Kode</text>
</svg>`,
        alt: "Lima batang: masalah data di file 20 baris; kota tidak konsisten tertinggi 6.",
        caption: "Cara membaca: tinggi bar = jumlah baris bermasalah per jenis; skala 20px per baris. Interpretasi: masalah terbesar file ini adalah kota yang tidak konsisten (6 baris), bukan missing (3 baris) — audit menentukan urutan kerja. Audit dihitung pada 20 baris mentah, sebelum dedup — setelah dedup, kota non-kanonik menjadi 5.",
      },
      tasks: [],
      note: {
        title: "Tip: audit selalu dua angka",
        body: "Untuk tiap kolom, laporkan jumlah kosong DAN persentasenya. '3 kosong' tidak bercerita; '3 dari 20, yaitu 15 persen' langsung menempatkan masalah pada band keputusan. Notebook credit scoring melaporkan keduanya: 0 kosong dari 30.000, yaitu 0 persen.",
      },
    },
    {
      id: "duplikat",
      eyebrow: "Langkah 4 · Duplikat",
      title: "Duplikat: persis sama belum tentu salah catat",
      prose: [
        "Duplikat ada dua jenis, dan obatnya berlawanan. Duplikat persis: semua kolom sama — itu pencatatan ganda, hapus satu salinannya. Duplikat dekat: hampir sama tapi ada yang beda — itu mungkin dua kejadian yang sah, dan menghapusnya berarti menghapus data nyata.",
        "Nilai: file 20 pengajuan — 2 baris duplikat persis [lab]: 'Andi, 2,4, 1, 2, Jakarta' muncul dua kali dan 'Budi, 1,7, 2, 3, jakarta' muncul dua kali. Setelah dihapus satu salinan tiap pasang, tersisa 18 baris unik. Perhatikan: kedua baris 'Budi' tertulis 'jakarta' kecil di keduanya — pasangan ini sudah identik persis sebelum standardisasi, jadi standardisasi kota tidak diperlukan untuk menemukannya.",
        "Baik atau buruk: duplikat persis buruk bila dibiarkan — satu nasabah dihitung dua kali, dan model mengira pola itu dua kali lebih umum dari kenyataannya. Duplikat dekat buruk bila dihapus tanpa memeriksa — dua pengajuan dari nasabah yang sama di bulan berbeda adalah dua observasi yang sah, bukan satu kesalahan.",
        "Mitigasi: hapus duplikat persis dengan aturan yang tertulis (seluruh kolom sama). Untuk duplikat dekat, pakai kunci identitas: bila dua baris punya KTP yang sama tapi tanggal pengajuan berbeda, itu dua pengajuan — simpan keduanya dan catat alasannya. Bila tidak ada kunci identitas, bandingkan semua kolom dan tanyakan ke pemilik data sebelum menghapus.",
        "Duplikat dekat butuh aturan kerja, bukan firasat — namanya entity resolution. Tiga pasangan yang sering muncul [ilustrasi]: (a) nama sama, tanggal pengajuan berbeda — dua pengajuan yang sah bila KTP-nya sama dan tanggalnya memang berbeda; (b) nama beda ejaan ('Budi' vs 'Budhi') tapi ID nasabah sama — satu orang, ejaannya yang salah; (c) ID sama muncul dua kali pada periode berbeda — bisa dua pengajuan sah, bisa pencatatan ganda, tergantung apakah periodenya memang berbeda. Aturannya: tentukan candidate key dulu (kombinasi kolom yang seharusnya unik, misal KTP + tanggal pengajuan) dan business key (kolom yang bermakna bisnis, misal nomor pengajuan) — bila dua baris punya business key yang sama, itu satu kejadian; bila candidate key-nya sama tapi business key berbeda, itu dua kejadian. Bila tidak ada kunci yang bisa memutuskan — nama sama, ID tidak ada, tanggal dekat — eskalasi ke pemilik data: jangan hapus, jangan gabung, tandai sebagai 'perlu verifikasi' dan dokumentasikan. Menghapus pasangan ambigu tanpa eskalasi sama bahayanya dengan membiarkan duplikat persis.",
      ],
      tasks: [
        { id: "t1", text: "Putuskan: dua baris 'Budi Santoso' dengan KTP sama tapi tanggal pengajuan berbeda 2 bulan — satu kejadian atau dua? (Dua pengajuan yang sah.)" },
        { id: "t2", text: "Putuskan: 'Budi' vs 'Budhi' dengan ID nasabah yang sama — satu orang atau dua? (Satu orang, ejaan salah — gabung setelah verifikasi.)" },
        { id: "t3", text: "Putuskan: ID sama muncul dua kali pada periode berbeda tanpa tanggal yang jelas — hapus, gabung, atau eskalasi? (Eskalasi ke pemilik data, tandai 'perlu verifikasi'.)" },
      ],
      note: {
        title: "Tip: dedup setelah standardisasi",
        body: "Urutan penting: standardisasi dulu (kota, huruf besar-kecil, spasi), baru cari duplikat. Seandainya salah satu baris tertulis 'Jakarta' dan yang lain 'jakarta', keduanya baru ketahuan kembar setelah standardisasi — di file ini kedua duplikat sudah identik byte-per-byte, jadi standardisasi tidak diperlukan untuk menemukannya. Notebook credit scoring tidak punya masalah ini: 0 baris duplikat dari 30.000 [notebook].",
      },
    },
    {
      id: "tipe",
      eyebrow: "Langkah 5 · Tipe salah",
      title: "Tipe salah: parsing eksplisit, jangan tebak",
      prose: [
        "Tipe salah berarti nilai yang benar tapi tersimpan dengan tipe yang salah: angka sebagai teks ('1.700.000'), angka sebagai string ('2'), tanggal sebagai teks bebas. Komputer tidak bisa menghitung teks — dan yang lebih berbahaya, kadang ia menghitungnya salah tanpa memberi tahu.",
        "Nilai: file 20 pengajuan — 3 tipe salah [lab]: income '1.700.000' dan '3.000.000' (teks dengan titik ribuan) serta keterlambatan '2' (teks). Setelah parsing eksplisit — buang titik ribuan, bagi dengan 1.000.000 — nilainya 1,7 dan 3,0 juta per bulan. Keterlambatan '2' menjadi angka 2. Parsing yang gagal harus dihitung dan dilaporkan, bukan dilewati diam-diam.",
        "Baik atau buruk: parsing eksplisit dengan format yang dinyatakan baik — hasilnya bisa diuji ulang oleh siapa pun. Parsing diam-diam (misal fungsi yang menebak-nebak format tanggal) buruk — '12/03/2025' bisa berarti 12 Maret atau 3 Desember, dan tebakan yang salah meracuni seluruh kolom tanpa jejak.",
        "Mitigasi: tulis formatnya di code ('%d.%m.%Y' untuk tanggal, hapus titik ribuan untuk rupiah), hitung berapa baris yang gagal diparsing, dan bila ada yang gagal, jangan paksa — kembalikan ke pemilik data. Satu kolom tanggal yang setengah terbalik bulan dan harinya lebih buruk dari kolom yang kosong.",
        "Tabel operasionalnya — nilai mentah → tafsir → validasi: '1.700.000' → 1.700.000 rupiah (titik = pemisah ribuan, format Indonesia) atau 1,7 (titik pertama dibaca sebagai desimal) — validasi: cek metadata satuan dan rentang (income 1,7 juta masuk akal; 1.700.000 juta tidak). '12/03/2025' → 12 Maret (format DD/MM, Indonesia) atau 3 Desember (format MM/DD, Amerika) — validasi: cek locale metadata dan silang dengan tanggal lain di file yang sama (bila ada '25/03/2025', formatnya pasti DD/MM karena 25 tidak bisa jadi bulan). Persen vs desimal: '12%' vs 0,12 — validasi: cek rentang (0 sampai 1 berarti desimal; 0 sampai 100 berarti persen). Mata uang berbeda: 'Rp1.700.000' vs '$1.700' — validasi: cek metadata mata uang dan orde magnitudenya. Tanda negatif: BILL_AMT −165.580 [notebook] — bukan error, melainkan saldo kredit (kelebihan bayar) — validasi: cek arti bisnisnya, bukan tandanya. Aturannya: jangan pernah menebak format — cek metadata, cek rentang, dan cek sampel hasil parsing sebelum memakai kolom itu.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: komputer tahu maksudmu",
        type: "pitfall",
        body: "Yang benar: '1.700.000' bisa dibaca sebagai 1.700.000 rupiah (titik = pemisah ribuan, format Indonesia) atau sebagai 1,7 (titik pertama dibaca sebagai desimal — salah parsing yang umum). Dua tafsir yang berbeda sejuta kali lipat. Selalu nyatakan format parsingmu secara eksplisit di code, dan verifikasi hasilnya pada beberapa baris pertama.",
      },
    },
    {
      id: "kode",
      eyebrow: "Langkah 6 · Kode tak dikenal",
      title: "Kode tak dikenal: kecil boleh dibiarkan, besar harus diputuskan",
      prose: [
        "Kode tak dikenal adalah nilai kategorikal yang tidak ada di kamus: EDUCATION 0, 5, 6 padahal kamusnya hanya 1 sampai 4; MARRIAGE 0 padahal kamusnya 1 sampai 3. Pertanyaannya bukan 'apakah ini salah?', melainkan 'seberapa besar dan apa risikonya bila dibiarkan?'.",
        "Nilai: notebook credit scoring — EDUCATION tak terdokumentasi 345 baris dari 30.000, yaitu 345 dibagi 30.000 sama dengan 1,15 persen [notebook]; MARRIAGE sama dengan 0 sebanyak 54 baris, yaitu 0,18 persen [notebook]. Keputusan notebook: biarkan apa adanya dan catat di model card — jumlahnya kecil, dan model tree-based menanganinya sendiri. Band keputusannya: di bawah 2 persen — biarkan + dokumentasi; 2 sampai 10 persen — jadikan kategori 'unknown' yang eksplisit; di atas 10 persen — selidiki sumbernya, mungkin kamusnya yang kedaluwarsa. File 20 baris punya 2 dari 20, yaitu 10 persen — tepat di batas atas band tengah (2–10 persen): jadikan 'unknown', jangan dibiarkan sebagai angka 0 dan 5 yang tampak seperti jenjang pendidikan.",
        "Baik atau buruk: membiarkan 1,15 persen baik bila didokumentasikan — biayanya kecil dan jejaknya jelas. Membiarkan 10 persen sebagai angka mentah buruk — model linear akan membaca 0 dan 5 sebagai jenjang pendidikan yang nyata, dan '5' akan tampak lebih berpendidikan dari '4'. Menghapus 10 persen baris juga buruk — itu sepersepuluh data yang hilang karena kamus.",
        "Mitigasi: bila kodenya sedikit, biarkan + dokumentasi di model card (apa kodenya, berapa baris, kenapa dibiarkan). Bila banyak, buat kategori 'unknown' yang eksplisit — model lalu belajar bahwa 'unknown' adalah kelompoknya sendiri, bukan jenjang. Bila kodenya mendominasi, kembali ke pemilik data: kamusnya mungkin berubah dan tidak ada yang memberi tahu.",
      ],
      tasks: [],
      note: {
        title: "Tip: angka mentah bukan kategori",
        body: "EDUCATION 0 bukan 'di bawah 1' — ia 'tidak diketahui'. Begitu kode tak dikenal dibiarkan sebagai angka, model linear memperlakukannya sebagai urutan. Selalu pisahkan 'tidak diketahui' dari skala — entah sebagai kategori sendiri, atau dengan dokumentasi yang jelas bila jumlahnya kecil.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab 1 — Audit file 20 pengajuan",
      prose: [
        "Kerjakan auditnya sendiri: hitung lima jenis masalah pada file 20 pengajuan — missing income, duplikat, tipe salah, kota non-kanonik, kode edu tak dikenal. Data di starter adalah file yang sama dengan cerita di awal lesson: 20 baris dengan nama, income (juta per bulan), keterlambatan 90 hari, pendidikan, dan kota.",
        "Empat tugas: hitung income kosong; hitung baris yang sudah muncul sebelumnya; hitung nilai bertipe string dan kode edu di luar 1 sampai 4; dan hitung missing di tiga level — per kolom, per baris, dan per sel. Untuk kota: bentuk kanoniknya 'Jakarta', 'Bandung', 'Surabaya', 'Medan' — bandingkan setelah huruf kecil dan spasi di ujung dibersihkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung missing: berapa income yang None, dan berapa persen dari 20 baris." },
        { id: "t2", text: "Hitung duplikat: berapa baris yang salinan persis dari baris sebelumnya (bandingkan seluruh kolom)." },
        { id: "t3", text: "Hitung tipe salah (income atau late bertipe string), kota non-kanonik (6 baris), dan kode edu tak dikenal (0, 5, atau 6)." },
        { id: "t4", text: "Hitung missing di tiga level: per kolom (income kosong berapa?), per baris (berapa baris punya minimal satu sel kosong?), dan per sel (berapa sel kosong dari 100 sel?)." },
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Matriks missingness: income kosong pada Dewi, Hana, Niko; kolom lain lengkap">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Matriks missingness file 20 pengajuan (contoh 5 baris)</text>
<text x="150" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">nama</text>
<text x="215" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">income</text>
<text x="280" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">late</text>
<text x="345" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">edu</text>
<text x="410" y="52" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">kota</text>
<text x="130" y="84" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Dewi</text>
<rect x="130" y="69" width="40" height="22" fill="var(--c1)"/>
<rect x="195" y="69" width="40" height="22" fill="var(--c4)"/>
<text x="215" y="84" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">✕</text>
<rect x="260" y="69" width="40" height="22" fill="var(--c1)"/>
<rect x="325" y="69" width="40" height="22" fill="var(--c1)"/>
<rect x="390" y="69" width="40" height="22" fill="var(--c1)"/>
<text x="130" y="112" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Hana</text>
<rect x="130" y="97" width="40" height="22" fill="var(--c1)"/>
<rect x="195" y="97" width="40" height="22" fill="var(--c4)"/>
<text x="215" y="112" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">✕</text>
<rect x="260" y="97" width="40" height="22" fill="var(--c1)"/>
<rect x="325" y="97" width="40" height="22" fill="var(--c1)"/>
<rect x="390" y="97" width="40" height="22" fill="var(--c1)"/>
<text x="130" y="140" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Niko</text>
<rect x="130" y="125" width="40" height="22" fill="var(--c1)"/>
<rect x="195" y="125" width="40" height="22" fill="var(--c4)"/>
<text x="215" y="140" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">✕</text>
<rect x="260" y="125" width="40" height="22" fill="var(--c1)"/>
<rect x="325" y="125" width="40" height="22" fill="var(--c1)"/>
<rect x="390" y="125" width="40" height="22" fill="var(--c1)"/>
<text x="130" y="168" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Andi</text>
<rect x="130" y="153" width="40" height="22" fill="var(--c1)"/>
<rect x="195" y="153" width="40" height="22" fill="var(--c1)"/>
<rect x="260" y="153" width="40" height="22" fill="var(--c1)"/>
<rect x="325" y="153" width="40" height="22" fill="var(--c1)"/>
<rect x="390" y="153" width="40" height="22" fill="var(--c1)"/>
<text x="130" y="196" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Cici</text>
<rect x="130" y="181" width="40" height="22" fill="var(--c1)"/>
<rect x="195" y="181" width="40" height="22" fill="var(--c1)"/>
<rect x="260" y="181" width="40" height="22" fill="var(--c1)"/>
<rect x="325" y="181" width="40" height="22" fill="var(--c1)"/>
<rect x="390" y="181" width="40" height="22" fill="var(--c1)"/>
<text x="240.0" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">per kolom: income 3/20 (15%), lainnya 0 · per baris: 3/20 (15%) · per sel: 3/100 (3%)</text>
<text x="240.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3 baris dengan missing + 2 baris lengkap sebagai contoh (matriks penuh 20×5 berpola sama)</text>
</svg>`,
        alt: "Matriks missingness: income kosong pada Dewi, Hana, Niko; kolom lain lengkap.",
        caption: "Cara membaca: tiap sel = satu nilai; sel merah (✕) = kosong. Interpretasi: hanya kolom income yang punya missing (3 dari 20) — per kolom 15 persen, per baris 15 persen (3 baris), per sel 3 persen (3 dari 100). Satu angka global tidak cukup — ketiganya harus dilaporkan.",
      },
      expected: "missing income: 3 (15%)\nduplikat: 2\ntipe salah: 3\nkota non-kanonik: 6\nkode edu tak dikenal: 2\nkolom income kosong: 3 (15%)\nbaris dengan >=1 kosong: 3 (15%)\nsel kosong: 3 (3%)",
      code: {
        starter: `# File 20 pengajuan kredit (nama, income_jt, late_90, edu, city)
# income None = kosong; income string = tipe salah ("1.700.000" = Rp1.700.000)
rows = [
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
    ("Cici", 4.2, 0, 1, "Jakarta"),
    ("Dewi", None, 0, 2, "Bandung"),
    ("Eko", "1.700.000", 3, 2, "Surabaya"),
    ("Fani", 3.1, 1, 0, "Jakarta"),
    ("Gani", 2.0, 2, 4, "JAKARTA "),
    ("Hana", None, 1, 3, "Medan"),
    ("Irfan", 5.5, 0, 1, "Jakarta"),
    ("Jaka", 2.8, "2", 2, "jakarta"),
    ("Kiki", 3.6, 0, 5, "Bandung"),
    ("Lina", 1.9, 4, 3, "Jkt"),
    ("Mira", 2.2, 2, 2, "Jakarta"),
    ("Niko", None, 3, 4, "Surabaya"),
    ("Oki", 4.8, 0, 1, "Jakarta"),
    ("Putri", 3.3, 1, 2, "Bandung"),
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Rudi", 2.6, 1, 2, "Jakarta"),
    ("Sari", "3.000.000", 0, 1, "jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
]
canon = {"jakarta": "Jakarta", "jkt": "Jakarta",
         "bandung": "Bandung", "surabaya": "Surabaya", "medan": "Medan"}
missing = 0  # TODO: hitung income None
dups = 0  # TODO: hitung baris yang salinan persis baris sebelumnya
wrongtype = 0  # TODO: hitung income/late bertipe string
noncanon = 0  # TODO: hitung kota yang tidak sama dengan bentuk kanoniknya
unknown = 0  # TODO: hitung edu 0, 5, atau 6
col_inc = 0  # TODO: jumlah income None (kolom income)
rows_miss = 0  # TODO: jumlah baris dengan >=1 sel None
cells_miss = 0  # TODO: jumlah sel None dari 100 sel
print(f"missing income: {missing} ({missing / len(rows) * 100:.0f}%)")
print(f"duplikat: {dups}")
print(f"tipe salah: {wrongtype}")
print(f"kota non-kanonik: {noncanon}")
print(f"kode edu tak dikenal: {unknown}")
print(f"kolom income kosong: {col_inc} ({col_inc / len(rows) * 100:.0f}%)")
print(f"baris dengan >=1 kosong: {rows_miss} ({rows_miss / len(rows) * 100:.0f}%)")
print(f"sel kosong: {cells_miss} ({cells_miss / (len(rows) * 5) * 100:.0f}%)")`,
        lockLines: 26,
        solution: `# File 20 pengajuan kredit (nama, income_jt, late_90, edu, city)
# income None = kosong; income string = tipe salah ("1.700.000" = Rp1.700.000)
rows = [
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
    ("Cici", 4.2, 0, 1, "Jakarta"),
    ("Dewi", None, 0, 2, "Bandung"),
    ("Eko", "1.700.000", 3, 2, "Surabaya"),
    ("Fani", 3.1, 1, 0, "Jakarta"),
    ("Gani", 2.0, 2, 4, "JAKARTA "),
    ("Hana", None, 1, 3, "Medan"),
    ("Irfan", 5.5, 0, 1, "Jakarta"),
    ("Jaka", 2.8, "2", 2, "jakarta"),
    ("Kiki", 3.6, 0, 5, "Bandung"),
    ("Lina", 1.9, 4, 3, "Jkt"),
    ("Mira", 2.2, 2, 2, "Jakarta"),
    ("Niko", None, 3, 4, "Surabaya"),
    ("Oki", 4.8, 0, 1, "Jakarta"),
    ("Putri", 3.3, 1, 2, "Bandung"),
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Rudi", 2.6, 1, 2, "Jakarta"),
    ("Sari", "3.000.000", 0, 1, "jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
]
canon = {"jakarta": "Jakarta", "jkt": "Jakarta",
         "bandung": "Bandung", "surabaya": "Surabaya", "medan": "Medan"}
missing = sum(1 for r in rows if r[1] is None)
seen = set()
dups = 0
for r in rows:
    if r in seen:
        dups += 1
    seen.add(r)
wrongtype = sum(1 for r in rows if isinstance(r[1], str) or isinstance(r[2], str))
noncanon = sum(1 for r in rows if r[4] != canon[r[4].strip().lower()])
unknown = sum(1 for r in rows if r[3] in (0, 5, 6))
col_inc = sum(1 for r in rows if r[1] is None)
rows_miss = sum(1 for r in rows if any(v is None for v in r))
cells_miss = sum(1 for r in rows for v in r if v is None)
print(f"missing income: {missing} ({missing / len(rows) * 100:.0f}%)")
print(f"duplikat: {dups}")
print(f"tipe salah: {wrongtype}")
print(f"kota non-kanonik: {noncanon}")
print(f"kode edu tak dikenal: {unknown}")
print(f"kolom income kosong: {col_inc} ({col_inc / len(rows) * 100:.0f}%)")
print(f"baris dengan >=1 kosong: {rows_miss} ({rows_miss / len(rows) * 100:.0f}%)")
print(f"sel kosong: {cells_miss} ({cells_miss / (len(rows) * 5) * 100:.0f}%)")`,
        checks: [
          { kind: "equal", task: "missing income = 3", value: 3, name: "missing", label: "`missing` seharusnya 3", msg: "missing income = 3" },
          { kind: "equal", task: "duplikat = 2", value: 2, name: "dups", label: "`dups` seharusnya 2", msg: "duplikat = 2" },
          { kind: "equal", task: "tipe salah = 3", value: 3, name: "wrongtype", label: "`wrongtype` seharusnya 3", msg: "tipe salah = 3" },
          { kind: "equal", task: "kota non-kanonik = 6", value: 6, name: "noncanon", label: "`noncanon` seharusnya 6", msg: "kota non-kanonik = 6" },
          { kind: "equal", task: "kode edu tak dikenal = 2", value: 2, name: "unknown", label: "`unknown` seharusnya 2", msg: "kode edu tak dikenal = 2" },
          { kind: "equal", task: "kolom income kosong = 3", value: 3, name: "col_inc", label: "`col_inc` seharusnya 3", msg: "kolom income kosong = 3" },
          { kind: "equal", task: "baris dengan >=1 kosong = 3", value: 3, name: "rows_miss", label: "`rows_miss` seharusnya 3", msg: "baris dengan >=1 kosong = 3" },
          { kind: "equal", task: "sel kosong = 3", value: 3, name: "cells_miss", label: "`cells_miss` seharusnya 3", msg: "sel kosong = 3" },
          { kind: "stdout_matches", task: "laporan audit lengkap tercetak", pattern: "missing income: 3 \\(15%\\)\\nduplikat: 2\\ntipe salah: 3\\nkota non-kanonik: 6\\nkode edu tak dikenal: 2\\nkolom income kosong: 3 \\(15%\\)\\nbaris dengan >=1 kosong: 3 \\(15%\\)\\nsel kosong: 3 \\(3%\\)", label: "Output menampilkan missing income: 3 (15%)", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Untuk duplikat: simpan baris yang sudah dilihat dalam set; bila baris sudah ada di set, itu duplikat.",
        "Untuk kota: bersihkan dulu dengan .strip().lower(), lalu bandingkan dengan kamus kanonik.",
        "Untuk kode edu: yang tak dikenal adalah 0, 5, dan 6 — kamusnya hanya 1 sampai 4.",
      ],
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab 2 — Bersihkan file itu",
      prose: [
        "Sekarang perbaiki file yang sama: parsing tipe yang salah, standardisasi kota, jadikan kode edu tak dikenal sebagai 'unknown' (0), lalu buang duplikat persis — urutan itu penting: dedup dilakukan SETELAH parsing dan standardisasi, supaya baris yang hanya berbeda pada kapitalisasi ikut ketahuan kembar. Untuk file ini urutan tidak mengubah hasil (tetap 18 baris) karena kedua duplikat sudah identik. Missing income dibiarkan dulu — imputasi adalah urusan L0.2.",
        "Tiga tugas: lengkapi parsing income string (buang titik ribuan, bagi 1.000.000); lengkapi recode edu 0, 5, 6 menjadi 0; jalankan dan baca hasil audit ulang. Hasil akhirnya: 18 baris, tipe salah 0, kota non-kanonik 0, kode edu unknown 2.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi parsing: income string '1.700.000' menjadi 1,7 (juta) — buang titik ribuan, bagi 1.000.000." },
        { id: "t2", text: "Lengkapi recode: edu 0, 5, atau 6 menjadi 0 (unknown); late string diubah ke int." },
        { id: "t3", text: "Jalankan dan baca audit ulang: baris 18, missing tetap 3, tipe salah 0, kota non-kanonik 0, edu unknown 2." },
      ],
      expected: "baris: 18\nmissing income: 3\ntipe salah: 0\nkota non-kanonik: 0\nkode edu unknown: 2\nincome Eko: 1.7\nincome Sari: 3.0",
      code: {
        starter: `# Bersihkan file 20 pengajuan (data sama dengan Lab 1)
rows = [
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
    ("Cici", 4.2, 0, 1, "Jakarta"),
    ("Dewi", None, 0, 2, "Bandung"),
    ("Eko", "1.700.000", 3, 2, "Surabaya"),
    ("Fani", 3.1, 1, 0, "Jakarta"),
    ("Gani", 2.0, 2, 4, "JAKARTA "),
    ("Hana", None, 1, 3, "Medan"),
    ("Irfan", 5.5, 0, 1, "Jakarta"),
    ("Jaka", 2.8, "2", 2, "jakarta"),
    ("Kiki", 3.6, 0, 5, "Bandung"),
    ("Lina", 1.9, 4, 3, "Jkt"),
    ("Mira", 2.2, 2, 2, "Jakarta"),
    ("Niko", None, 3, 4, "Surabaya"),
    ("Oki", 4.8, 0, 1, "Jakarta"),
    ("Putri", 3.3, 1, 2, "Bandung"),
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Rudi", 2.6, 1, 2, "Jakarta"),
    ("Sari", "3.000.000", 0, 1, "jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
]
canon = {"jakarta": "Jakarta", "jkt": "Jakarta",
         "bandung": "Bandung", "surabaya": "Surabaya", "medan": "Medan"}
clean = []
seen = set()
for r in rows:
    name, inc, late, edu, city = r
    if isinstance(inc, str):
        inc = 1.0  # TODO: parsing "1.700.000" -> 1.7 (juta)
    late = int(late)
    if edu in (0, 5, 6):
        pass  # TODO: recode edu tak dikenal -> 0 (unknown)
    city = canon[city.strip().lower()]
    t = (name, inc, late, edu, city)
    if t in seen:
        continue
    seen.add(t)
    clean.append(t)
n_clean = len(clean)
eko_income = [r[1] for r in clean if r[0] == "Eko"][0]
sari_income = [r[1] for r in clean if r[0] == "Sari"][0]
print(f"baris: {n_clean}")
print(f"missing income: {sum(1 for r in clean if r[1] is None)}")
print(f"tipe salah: {sum(1 for r in clean if isinstance(r[1], str) or isinstance(r[2], str))}")
print(f"kota non-kanonik: {sum(1 for r in clean if r[4] not in ('Jakarta', 'Bandung', 'Surabaya', 'Medan'))}")
print(f"kode edu unknown: {sum(1 for r in clean if r[3] == 0)}")
print(f"income Eko: {eko_income}")
print(f"income Sari: {sari_income}")`,
        lockLines: 33,
        solution: `# Bersihkan file 20 pengajuan (data sama dengan Lab 1)
rows = [
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
    ("Cici", 4.2, 0, 1, "Jakarta"),
    ("Dewi", None, 0, 2, "Bandung"),
    ("Eko", "1.700.000", 3, 2, "Surabaya"),
    ("Fani", 3.1, 1, 0, "Jakarta"),
    ("Gani", 2.0, 2, 4, "JAKARTA "),
    ("Hana", None, 1, 3, "Medan"),
    ("Irfan", 5.5, 0, 1, "Jakarta"),
    ("Jaka", 2.8, "2", 2, "jakarta"),
    ("Kiki", 3.6, 0, 5, "Bandung"),
    ("Lina", 1.9, 4, 3, "Jkt"),
    ("Mira", 2.2, 2, 2, "Jakarta"),
    ("Niko", None, 3, 4, "Surabaya"),
    ("Oki", 4.8, 0, 1, "Jakarta"),
    ("Putri", 3.3, 1, 2, "Bandung"),
    ("Andi", 2.4, 1, 2, "Jakarta"),
    ("Rudi", 2.6, 1, 2, "Jakarta"),
    ("Sari", "3.000.000", 0, 1, "jakarta"),
    ("Budi", 1.7, 2, 3, "jakarta"),
]
canon = {"jakarta": "Jakarta", "jkt": "Jakarta",
         "bandung": "Bandung", "surabaya": "Surabaya", "medan": "Medan"}
clean = []
seen = set()
for r in rows:
    name, inc, late, edu, city = r
    if isinstance(inc, str):
        inc = int(inc.replace(".", "")) / 1000000
    late = int(late)
    if edu in (0, 5, 6):
        edu = 0  # unknown
    city = canon[city.strip().lower()]
    t = (name, inc, late, edu, city)
    if t in seen:
        continue
    seen.add(t)
    clean.append(t)
n_clean = len(clean)
eko_income = [r[1] for r in clean if r[0] == "Eko"][0]
sari_income = [r[1] for r in clean if r[0] == "Sari"][0]
print(f"baris: {n_clean}")
print(f"missing income: {sum(1 for r in clean if r[1] is None)}")
print(f"tipe salah: {sum(1 for r in clean if isinstance(r[1], str) or isinstance(r[2], str))}")
print(f"kota non-kanonik: {sum(1 for r in clean if r[4] not in ('Jakarta', 'Bandung', 'Surabaya', 'Medan'))}")
print(f"kode edu unknown: {sum(1 for r in clean if r[3] == 0)}")
print(f"income Eko: {eko_income}")
print(f"income Sari: {sari_income}")`,
        checks: [
          { kind: "equal", task: "baris bersih = 18", value: 18, name: "n_clean", label: "`n_clean` seharusnya 18", msg: "baris bersih = 18" },
          { kind: "equal", task: "income Eko terparsing = 1,7", value: 1.7, name: "eko_income", label: "`eko_income` seharusnya 1.7", msg: "income Eko terparsing = 1,7" },
          { kind: "equal", task: "income Sari terparsing = 3,0", value: 3.0, name: "sari_income", label: "`sari_income` seharusnya 3.0", msg: "income Sari terparsing = 3,0" },
          { kind: "stdout_matches", task: "laporan bersih lengkap tercetak", pattern: "baris: 18\\nmissing income: 3\\ntipe salah: 0\\nkota non-kanonik: 0\\nkode edu unknown: 2\\nincome Eko: 1.7\\nincome Sari: 3.0", label: "Output menampilkan baris: 18", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "'1.700.000' -> buang titiknya dengan .replace('.', ''), ubah ke int, lalu bagi 1.000.000.",
        "Perhatikan: inc None tidak bertipe string, jadi blok parsing tidak menyentuhnya — missing tetap 3.",
        "Dedup dilakukan SETELAH parsing dan standardisasi: tiap baris diparsing dan distandardisasi dulu, baru dicek apakah bentuk bersihnya sudah pernah muncul. Untuk file ini urutan tidak mengubah hasil (tetap 18 baris) karena kedua duplikat sudah identik.",
      ],
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan cleaning",
      prose: [
        "Empat masalah, empat aturan — dan semuanya memakai angka yang sudah dihitung di audit, bukan firasat:",
        "• Nilai kosong — di bawah 5 persen dan acak: hapus barisnya. 5 sampai 30 persen: imputasi dengan metode yang didokumentasikan (L0.2). Di atas 30 persen atau tidak acak: selidiki dulu, jangan pakai kolom itu mentah-mentah.",
        "• Duplikat — seluruh kolom sama persis: hapus satu salinan. Hampir sama tapi ada yang beda: periksa kunci identitas dulu; jangan hapus tanpa bukti.",
        "• Tipe salah — parsing eksplisit dengan format yang dinyatakan di code; hitung berapa yang gagal diparsing; yang gagal dikembalikan ke pemilik data.",
        "• Kode tak dikenal — di bawah 2 persen: biarkan + dokumentasi di model card. 2 sampai 10 persen: jadikan kategori 'unknown' yang eksplisit. Di atas 10 persen: selidiki sumbernya, kamusnya mungkin kedaluwarsa.",
        "Dua aturan yang mengikat semuanya: pertama, audit dulu baru putuskan — keputusan tanpa angka adalah tebakan. Kedua, tiap keputusan meninggalkan jejak: berapa baris yang berubah, kenapa, dan di mana catatannya.",
        "Koneksi ke modul berikutnya: cleaning adalah fondasi input validation dan data preparation — di M1, audit seperti ini yang menentukan apakah feature preparation bisa dipercaya; di M2, aturan yang sama dipakai saat menyiapkan data credit scoring (dan reject inference di M2 justru bermula dari data yang tidak bersih: pelamar yang ditolak tidak pernah masuk tabel); di M6, keputusan cleaning yang didokumentasikan di sini menjadi bagian dari sensitivity analysis — bagaimana kesimpulan berubah bila aturan cleaning-nya diubah. Peta lengkap L0 → M1–M9 ada di L0.5.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Peta keputusan cleaning: audit dulu, lalu aturan per jenis masalah">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Peta keputusan cleaning</text>
<rect x="52" y="30" width="376" height="26" rx="6" fill="var(--c1)"/>
<text x="240.0" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1. Audit dulu: hitung jumlah + persen tiap masalah</text>
<line x1="240" y1="56" x2="240" y2="70" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="52" y="70" width="376" height="26" rx="6" fill="var(--c2)"/>
<text x="240.0" y="87" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2. Missing: &lt;5% hapus · 5–30% imputasi · &gt;30% selidiki</text>
<line x1="240" y1="96" x2="240" y2="110" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="52" y="110" width="376" height="26" rx="6" fill="var(--c2)"/>
<text x="240.0" y="127" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3. Duplikat persis: hapus · dekat: cek kunci identitas</text>
<line x1="240" y1="136" x2="240" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="52" y="150" width="376" height="26" rx="6" fill="var(--c2)"/>
<text x="240.0" y="167" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">4. Tipe salah: parsing eksplisit + hitung yang gagal</text>
<line x1="240" y1="176" x2="240" y2="190" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="52" y="190" width="376" height="26" rx="6" fill="var(--c2)"/>
<text x="240.0" y="207" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5. Kode tak dikenal: &lt;2% biarkan · 2–10% unknown · &gt;10% selidiki</text>
</svg>`,
        alt: "Peta keputusan cleaning: audit dulu, lalu aturan per jenis masalah.",
        caption: "Cara membaca: ikuti dari atas ke bawah; tiap kotak adalah satu keputusan dengan ambangnya. Interpretasi: semua aturan memakai angka audit — tanpa audit, peta ini tidak bisa dipakai.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case — Audit notebook credit scoring",
      prose: [
        "Sekarang terapkan peta keputusan pada audit nyata: cell 10 notebook credit scoring (dataset UCI Default of Credit Card Clients, Taiwan 2005, 30.000 nasabah). Hasil auditnya: nilai kosong 0 dari 30.000; baris duplikat 0; EDUCATION tak terdokumentasi (0, 5, 6) sebanyak 345 baris; MARRIAGE sama dengan 0 sebanyak 54 baris; PAY negatif (bayar lebih awal / tidak ada tagihan) — PAY_0 8.445 baris, PAY_2 9.832, PAY_3 10.023, PAY_4 10.035, PAY_5 10.085, PAY_6 10.635.",
        "Keputusan notebook, menurut peta lesson ini: nilai kosong 0 persen — tidak ada yang perlu dilakukan. Duplikat 0 — tidak ada yang perlu dilakukan. EDUCATION 1,15 persen — di bawah 2 persen: biarkan + dokumentasi di model card (itulah yang dilakukan notebook). MARRIAGE 0,18 persen — sama, biarkan + dokumentasi. PAY negatif — bukan masalah sama sekali: nilai negatif di sini sah secara bisnis (kode −2 = bayar lebih awal, −1 = lunas), bukan error.",
        "Perhatikan perbedaan skala dengan file 20 baris: di file kecil, 2 kode tak dikenal dari 20 adalah 10 persen — masuk band 'unknown'. Di notebook, 345 dari 30.000 adalah 1,15 persen — masuk band 'biarkan'. Keputusan yang sama (kode tak dikenal) menghasilkan obat yang berbeda karena persentasenya berbeda. Itulah kenapa audit selalu melaporkan persen, bukan hanya jumlah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung: 345 dibagi 30.000 sama dengan berapa persen? 54 dibagi 30.000 sama dengan berapa persen? Cocokkan dengan band peta keputusan." },
        { id: "t2", text: "Jelaskan kenapa PAY negatif (8.445 baris di PAY_0) BUKAN masalah cleaning — apa arti bisnis kode negatif itu?" },
      ],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab — Audit 60 pengajuan sintetis",
      prose: [
        "Di Colab, kamu mengaudit file yang lebih besar: 60 pengajuan sintetis (seed 42) dengan masalah yang disuntikkan pada laju yang diketahui — missing income 15 persen, 3 duplikat persis, tipe salah, varian kota, dan kode edu tak dikenal. Tugasmu: audit, bersihkan, dan bandingkan laju masalahmu dengan laju yang disuntikkan — bila auditmu benar, angkanya cocok.",
        "Notebook ini juga menguji satu hal yang tidak ada di lab web: apakah auditmu stabil bila datanya diganti? Di akhir notebook ada refleksi: aturan keputusan mana yang berubah bila missing naik dari 15 persen ke 40 persen?",
        "Buka di Colab: https://colab.research.google.com/drive/1wTFfmxfaTUfBO7Zec0rCAiEML-tePTC9",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint — 9 soal",
      prose: [
        "Sembilan soal menutup lesson ini. Bila ada yang salah, kembali ke langkah yang dirujuk di 'why' — jawabannya ada di angka audit, bukan di hafalan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "File 20 pengajuan: income kosong 3 baris (15 persen). Apa langkah pertama yang benar?",
          options: [
            { text: "Langsung hapus ketiga baris itu — 3 baris tidak berarti", why: "Salah: 15 persen terlalu besar untuk dihapus diam-diam, dan yang hilang mungkin bukan acak. Band keputusan: 5–30 persen masuk imputasi dengan metode yang didokumentasikan.", correct: false },
            { text: "Langsung isi dengan rata-rata income yang ada", why: "Salah: mengisi tanpa tahu polanya menciptakan data yang tidak pernah ada. Pola missing harus diperiksa dulu (L0.2).", correct: false },
            { text: "Selidiki polanya dulu — apakah yang kosong punya ciri yang sama — lalu putuskan", why: "Benar: 15 persen masuk band tengah (5–30 persen), dan keputusan yang tepat tergantung mekanisme missing-nya.", correct: true },
            { text: "Biarkan kosong dan latih model apa adanya", why: "Salah: sebagian besar model tidak menerima nilai kosong — dan yang menerimanya pun memperlakukan kosong dengan caranya sendiri, bukan caramu.", correct: false },
          ],
        },
        {
          q: "Notebook credit scoring: EDUCATION tak terdokumentasi (0, 5, 6) sebanyak 345 dari 30.000 baris (1,15 persen). Apa keputusan notebook?",
          options: [
            { text: "Hapus 345 baris itu", why: "Salah: menghapus 345 baris karena kamus tidak lengkap membuang data yang sah.", correct: false },
            { text: "Biarkan apa adanya dan catat di model card", why: "Benar: 1,15 persen di bawah 2 persen — masuk band 'biarkan + dokumentasi'; model tree-based menanganinya sendiri.", correct: true },
            { text: "Isi dengan modus EDUCATION", why: "Salah: mengisi kode tak dikenal dengan modus mengubah arti data — 'tidak diketahui' bukan 'paling umum'.", correct: false },
            { text: "Ubah semua menjadi 4 (others)", why: "Salah: 0, 5, 6 belum tentu 'others' — menebak arti kode yang tidak terdokumentasi adalah asumsi tanpa bukti.", correct: false },
          ],
        },
        {
          q: "Dua baris identik persis (nama, income, late, edu, kota sama). Apa yang dilakukan?",
          options: [
            { text: "Hapus satu salinannya", why: "Benar: duplikat persis adalah pencatatan ganda — satu nasabah dihitung dua kali bila dibiarkan.", correct: true },
            { text: "Biarkan keduanya — mungkin dua pengajuan yang sah", why: "Salah: dua pengajuan yang sah punya tanggal atau nilai yang berbeda. Seluruh kolom sama persis berarti satu kejadian yang tercatat dua kali.", correct: false },
            { text: "Rata-ratakan nilai keduanya", why: "Salah: tidak ada yang perlu dirata-ratakan — nilainya sudah identik.", correct: false },
            { text: "Hapus keduanya — data kembar tidak bisa dipercaya", why: "Salah: menghapus keduanya membuang satu observasi yang sah.", correct: false },
          ],
        },
        {
          q: "Income tertulis '1.700.000' di kolom yang satuannya juta per bulan. Nilai benar setelah parsing?",
          options: [
            { text: "1.700.000", why: "Salah: itu nilai mentah dalam rupiah, bukan juta.", correct: false },
            { text: "1,7", why: "Benar: buang titik ribuan menjadi 1.700.000 rupiah, lalu bagi 1.000.000 menjadi 1,7 juta.", correct: true },
            { text: "17", why: "Salah: 17 adalah hasil salah parsing (titik dibaca sebagai desimal).", correct: false },
            { text: "170", why: "Salah: tidak ada pembagian yang menghasilkan 170 dari 1.700.000 dengan satuan juta.", correct: false },
          ],
        },
        {
          q: "Kota tertulis 'jakarta', 'JAKARTA ', 'Jkt', dan 'Jakarta' di file 20 baris. Berapa baris yang perlu distandardisasi?",
          options: [
            { text: "3 baris", why: "Salah: 'jakarta' saja sudah 4 baris.", correct: false },
            { text: "6 baris", why: "Benar: 'jakarta' 4 baris, 'JAKARTA ' 1 baris, 'Jkt' 1 baris — semuanya bukan bentuk kanonik 'Jakarta'.", correct: true },
            { text: "4 baris", why: "Salah: itu hanya 'jakarta' kecil — 'JAKARTA ' dan 'Jkt' juga bukan kanonik.", correct: false },
            { text: "20 baris — semua kota harus distandardisasi", why: "Salah: baris yang sudah 'Jakarta' tidak perlu diubah.", correct: false },
          ],
        },
        {
          q: "PAY negatif (misal −2) di notebook credit scoring. Artinya?",
          options: [
            { text: "Error input — nilai negatif tidak mungkin untuk keterlambatan", why: "Salah: kode negatif punya arti bisnis yang terdokumentasi.", correct: false },
            { text: "Sah: bayar lebih awal atau tidak ada tagihan — bukan error", why: "Benar: PAY_0 negatif ada di 8.445 baris; kode −2 berarti bayar lebih awal dan −1 berarti lunas. Membersihkannya justru menghapus informasi.", correct: true },
            { text: "Missing yang dikodekan sebagai negatif", why: "Salah: missing di notebook ini 0 — kode negatif adalah nilai yang sah, bukan pengganti kosong.", correct: false },
            { text: "Outlier yang harus dihapus sebelum modelling", why: "Salah: 8.445 dari 30.000 baris bukan outlier — itu sepertiga data dengan arti bisnis yang jelas.", correct: false },
          ],
        },
        {
          q: "Dua baris: 'Budi Santoso, KTP 123, pengajuan 3 Maret' dan 'Budi Santoso, KTP 123, pengajuan 12 Mei'. Apa yang dilakukan?",
          options: [
            { text: "Simpan keduanya — KTP sama tapi tanggal pengajuan berbeda: dua pengajuan yang sah", why: "Benar: candidate key (KTP + tanggal) berbeda — business key-nya (nomor pengajuan) juga berbeda. Menghapus salah satunya berarti menghapus data nyata.", correct: true },
            { text: "Hapus satu — nama dan KTP-nya sama", why: "Salah: nama dan KTP sama belum berarti satu kejadian — tanggal pengajuan yang berbeda berarti dua pengajuan.", correct: false },
            { text: "Gabung menjadi satu baris dengan income dirata-rata", why: "Salah: dua pengajuan yang sah tidak boleh digabung — rata-ratanya bukan pengajuan siapa pun.", correct: false },
            { text: "Tandai 'perlu verifikasi' dan eskalasi ke pemilik data", why: "Salah di sini: kuncinya sudah cukup untuk memutuskan (KTP + tanggal berbeda) — eskalasi hanya bila kuncinya tidak bisa memutuskan.", correct: false },
          ],
        },
        {
          q: "Tanggal '12/03/2025' di file pengajuan Indonesia. Bagaimana cara memastikannya 12 Maret, bukan 3 Desember?",
          options: [
            { text: "Cek metadata locale dan silang dengan tanggal lain di file — bila ada '25/03/2025', formatnya pasti DD/MM", why: "Benar: 25 tidak bisa jadi bulan — satu tanggal lain yang unambiguous membuktikan format seluruh kolom.", correct: true },
            { text: "Tebak saja DD/MM karena filenya dari Indonesia", why: "Salah: menebak format — meski tebakannya mungkin benar — tidak meninggalkan jejak audit; bila salah, seluruh kolom terbalik tanpa jejak.", correct: false },
            { text: "Ubah semua tanggal menjadi teks dan biarkan", why: "Salah: tanggal sebagai teks tidak bisa dihitung — dan masalahnya tetap ada.", correct: false },
            { text: "Hapus baris dengan tanggal ambigu", why: "Salah: menghapus baris karena format tanggal membuang data yang sah — formatnya yang harus dipastikan, bukan barisnya.", correct: false },
          ],
        },
        {
          q: "File 1.000 baris: income kosong 49 baris (4,9 persen) di satu file dan 52 baris (5,2 persen) di file lain [ilustrasi]. Apa keputusan yang benar?",
          options: [
            { text: "Keputusan yang sama untuk keduanya — cek pola missing-nya dan dokumentasikan; beda 3 baris tidak boleh membalik keputusan", why: "Benar: 4,9 persen vs 5,2 persen berbeda 3 baris dari 1.000 — band 5 persen adalah titik awal (heuristik), bukan tebing. Yang menentukan adalah mekanisme dan dampaknya, bukan sisi mana dari batas itu angkanya jatuh.", correct: true },
            { text: "File pertama hapus barisnya, file kedua imputasi — band berkata begitu", why: "Salah: memakai band secara mekanis di batasnya menghasilkan dua keputusan berlawanan untuk dua file yang hampir identik.", correct: false },
            { text: "Keduanya dihapus saja — di bawah 10 persen aman", why: "Salah: 10 persen bukan band missing — dan menghapus 5 persen data tanpa cek pola tetap berisiko bias.", correct: false },
            { text: "Keduanya diselidiki sebagai MNAR", why: "Salah: belum ada bukti MNAR — persentasenya saja tidak membuktikan mekanisme; cek pola dulu (L0.2).", correct: false },
          ],
        },
      ],
      summary: [
        "Audit dulu, putuskan belakangan: tiap masalah dihitung jumlah dan persennya sebelum ada yang dihapus atau diisi.",
        "Missing: di bawah 5 persen dan acak boleh dihapus; 5–30 persen imputasi; di atas 30 persen atau tidak acak selidiki dulu.",
        "Duplikat persis dihapus satu salinannya; duplikat dekat diperiksa kunci identitasnya dulu.",
        "Tipe salah diparsing eksplisit dengan format yang dinyatakan; yang gagal diparsing dikembalikan ke pemilik data.",
        "Kode tak dikenal: di bawah 2 persen biarkan + dokumentasi; 2–10 persen jadikan 'unknown'; di atas 10 persen selidiki sumbernya.",
        "File 20 baris: 3 missing (15 persen), 2 duplikat, 3 tipe salah, 6 kota non-kanonik, 2 kode tak dikenal — menjadi 18 baris bersih dengan missing tetap 3 (imputasi di L0.2).",
        "Missing punya tiga level hitungan (per kolom, per baris, per sel) — dan band keputusan adalah heuristik, bukan hukum: persentase, jumlah absolut, mekanisme, dan dampak harus dibaca bersama.",
      ],
      next: { label: "Lanjut ke L0.2 — Missing Data & Imputasi", href: "/v2/learn/mlf-l02-missing-data-imputasi" },
    },
  ],
};
