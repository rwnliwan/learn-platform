import type { V2Mission } from "../lib/types";

// ── MISI CAPSTONE #8: Dari VCF ke Laporan Program ─────────────────────────
// Bioinformatika x Health Data Science — translational: dari file VCF/varian
// menjadi laporan yang bisa dipakai pengambil keputusan program kesehatan
// masyarakat. Dataset SINTETIS 100% (generator Python, seed 42): 8 varian
// fiktif (V1-V8) pada 4 gen fiktif (FIC1-FIC4), 61 kolom sampel di VCF,
// tabel annotasi_varian.csv, metadata_kohort.csv (60 peserta).
// File: public/misi/misi-gabung-vcf-ke-laporan/ + METODE.md.

const BASE = "/misi/misi-gabung-vcf-ke-laporan";

export const misiGabungVcfLaporan: V2Mission = {
  slug: "misi-gabung-vcf-ke-laporan",
  track: "Bioinformatika",
  module: "Misi",
  title: "Misi Translational: Dari VCF ke Laporan Program",
  estMinutes: 200,
  role: "Bioinformatician — penerjemah data genomik untuk program kesehatan masyarakat",
  client:
    "Kepala Dinas Kesehatan — program skrining genetik populasi (fiktif). File VCF 60 peserta sudah di tangan; dua minggu lagi laporan program harus di meja: varian apa yang prioritas, siapa ditindaklanjuti, dan apa yang TIDAK boleh diklaim",
  xp: 750,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Jangan kirim saya daftar varian — kirim saya keputusan",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca cerita dan catat 4 objectives — apa yang harus bisa kamu buktikan di akhir misi" },
        { id: "t2", text: "Tulis satu kalimat: apa bedanya 'analisis varian' dengan 'laporan program' menurut briefing ini" },
      ],
      briefing: {
        role: "Bioinformatician di program skrining genetik populasi — kamu jembatan antara lab dan pengambil keputusan",
        client:
          "Kepala Dinas Kesehatan. Program skrining genetik populasi (fiktif) baru menyelesaikan pengumpulan sampel 60 peserta. Analis sebelumnya sudah menyerahkan 'draf laporan' yang katanya final — tapi Kepala Dinas tidak percaya begitu saja: 'Draf itu penuh label patogenik. Saya tidak mau menakuti 60 orang berdasarkan label yang belum diverifikasi. Kamu audit datanya, hitung ulang dari mentah, lalu tulis laporan yang berani saya bacakan di depan publik.' Tenggat: dua minggu.",
        story: [
          "Senin, 08:12. Email dari Kepala Dinas — subjeknya satu baris: 'VCF skrining — butuh laporan yang jujur.' Lampirannya tiga file: skrining_vcf.vcf (8 varian, 61 kolom sampel), annotasi_varian.csv, dan draf laporan analis sebelumnya yang di bagian rekomendasi menulis 'skrining lanjutan untuk 56 pembawa varian patogenik' dan 'skrining lanjutan untuk 12 pembawa'.",
          "Kamu mengerutkan dahi. 56 pembawa 'patogenik' dari 60 peserta? Itu berarti hampir semua orang membawa varian patogenik — secara biologis sangat tidak masuk akal untuk varian yang benar-benar patogenik. Entah program ini menemukan sesuatu yang luar biasa, atau draf ini salah membaca datanya sendiri.",
          "'Jangan kirim saya daftar varian,' tulis Kepala Dinas di paragraf terakhir. 'Kirim saya keputusan: siapa yang perlu ditindaklanjuti, siapa yang tidak, dan apa yang tidak boleh kita klaim ke publik.'",
          "Misi ini memakai data sintetis 100% (varian dan gen fiktif — FIC1 sampai FIC4), tapi masalahnya nyata: analis yang menghitung dari klaim, bukan dari genotipe; annotasi yang salah; sampel yang terhitung dua kali; dan label 'patogenik' yang ditempel tanpa bukti. Pekerjaanmu: buktikan semuanya dengan angka, lalu terjemahkan menjadi bahasa yang bisa dipakai seorang Kepala Dinas.",
        ],
        objectives: [
          "Mem-parse file VCF skrining dan menghitung frekuensi alel serta jumlah pembawa tiap varian LANGSUNG dari genotipe (kolom GT) — bukan dari klaim kolom INFO.",
          "Mengklasifikasikan 8 varian berbasis bukti berlapis (konsekuensi, dampak, frekuensi referensi, prediksi) dan menguji seberapa sensitif klasifikasi itu terhadap pilihan ambang frekuensi alel.",
          "Menemukan minimal 3 masalah kualitas data di draf laporan analis sebelumnya, masing-masing dengan bukti baris/kolom yang bisa ditunjuk.",
          "Menyusun rekomendasi program bertingkat (skrining lanjutan vs konseling vs surveilans rutin) dengan komunikasi risiko yang jujur untuk audiens non-ahli.",
        ],
        prereqSummary:
          "VCF adalah format file standar untuk varian genetik: tiap baris satu varian (kromosom, posisi, alel referensi REF dan alternatif ALT), tiap kolom satu sampel dengan genotipe — 0/0 (tidak membawa), 0/1 (pembawa satu salinan), 1/1 (dua salinan). Frekuensi alel (AF) = proporsi alel ALT di seluruh sampel, dihitung dari genotipe — kolom INFO di VCF boleh saja salah, jadi selalu hitung ulang. Klasifikasi varian (jinak / VUS / kemungkinan patogenik / patogenik) adalah penilaian berbasis BUKTI berlapis, bukan vonis — dan VUS (varian yang signifikansinya belum diketahui) artinya 'belum tahu', bukan 'hampir patogenik'.",
        datasetNote:
          "SINTETIS 100% — data sintetis orisinal untuk misi ini (generator Python, seed 42). 8 varian FIKTIF (V1–V8) pada 4 gen FIKTIF (FIC1–FIC4; bukan simbol gen manusia nyata — tidak ada klaim klinis yang berlaku di dunia nyata). File: skrining_vcf.vcf (61 kolom sampel), annotasi_varian.csv (annotasi DRAF analis sebelumnya — belum tentu benar), metadata_kohort.csv (60 peserta). BUKAN data genom manusia nyata. Metode: file METODE.md di folder yang sama.\nPeringatan jujur: dataset ini SENGAJA mengandung masalah kualitas data — menemukan dan menanganinya adalah bagian dari misi, bukan kecelakaan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, satu draf yang terlalu percaya diri",
      prose: [
        "Tiga file menunggumu di folder misi. `skrining_vcf.vcf`: 8 baris varian (V1–V8, kromosom 1) × 61 kolom sampel (S001–S061), kolom FORMAT hanya GT. Ini kebenaran mentahmu — semua angka di misi ini dihitung dari sini.",
        "`annotasi_varian.csv`: konsekuensi, dampak, frekuensi referensi (fiktif), prediksi, klasifikasi DRAF, dan rekomendasi DRAF per varian. Ingat: ini klaim analis sebelumnya, bukan kebenaran. Di langkah audit kamu akan mengadilinya baris per baris.",
        "`metadata_kohort.csv`: 60 peserta (S001–S060) dengan usia, jenis kelamin, puskesmas, dan tanggal skrining. Ini kebenaran jumlah pesertamu — simpan angka 60 baik-baik, kamu akan membutuhkannya.",
        "Aturan main: (1) frekuensi alel dihitung dari kolom GT, bukan dibaca dari kolom INFO; (2) klasifikasi draf diperlakukan sebagai klaim yang harus diverifikasi, bukan fakta; (3) setiap rekomendasi program harus bisa ditelusuri kembali ke angka mentah.",
      ],
      tasks: [
        { id: "t1", text: "Buka `skrining_vcf.vcf`: hitung manual jumlah kolom sampel di baris header #CHROM" },
        { id: "t2", text: "Buka `annotasi_varian.csv`: catat varian mana yang klasifikasinya 'Patogenik' dan apa rekomendasinya" },
        { id: "t3", text: "Buka `metadata_kohort.csv`: catat jumlah baris peserta — bandingkan dengan jumlah kolom sampel di VCF" },
      ],
      note: {
        title: "Miskonsepsi #1: 'patogenik' di laporan = vonis penyakit",
        type: "pitfall",
        body: "Label 'patogenik' pada varian BUKAN diagnosis penyakit pada pembawanya. Klasifikasi varian adalah penilaian bukti molekuler + populasi — apakah varian ini MERUSAK fungsi gen dan JARANG di populasi umum. Apakah pembawa akan sakit, kapan, dan seberapa parah adalah pertanyaan klinis yang butuh data klinis, bukan sekadar label varian. Di level program, menempel label 'patogenik' ke 56 orang tanpa bukti berlapis bukan temuan — itu potensi kepanikan massal.",
      },
      reference:
        "skrining_vcf.vcf (mentah: 8 varian × 61 kolom sampel) vs annotasi_varian.csv (klaim draf) vs metadata_kohort.csv (60 peserta — kebenaran jumlah orang).",
    },
    {
      id: "lab-vcf",
      eyebrow: "Langkah 3 · Lab 1 — Parse VCF & frekuensi alel",
      title: "Hitung dari genotipe, bukan dari klaim",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Parse VCF: lewati baris `##`, ambil nama sampel dari baris `#CHROM`, lalu untuk tiap varian hitung frekuensi alel dari kolom GT — tiap `0/1` menyumbang 1 alel ALT, tiap `1/1` menyumbang 2, dibagi total alel (2 × jumlah sampel).",
        "Tugasmu juga: hitung jumlah PEMBAWA (genotipe bukan 0/0) per varian, cari varian tanpa pembawa sama sekali, dan uji satu hal penting — apakah AF di kolom INFO cocok dengan AF yang kamu hitung dari genotipe? Analis sebelumnya tidak pernah mengecek ini.",
      ],
      tasks: [
        { id: "t1", text: "Parse VCF; hitung `n_sampel` dan `n_varian`" },
        { id: "t2", text: "Hitung `af` (dict varian → frekuensi alel) dan `n_pembawa` (dict varian → jumlah pembawa)" },
        { id: "t3", text: "Temukan `varian_tanpa_pembawa`; bandingkan AF terhitung vs AF kolom INFO (`info_cocok_v8`)" },
      ],
      expected:
        "n_sampel=61, n_varian=8; AF: V1 0,0820, V2 0,0246, V3 0,0164, V4 0,3934, V5 0,0574, V6 0,4590, V7 0,0082, V8 0,0000; pembawa: V8 = 0 (tanpa pembawa); INFO V8 (0,30) TIDAK cocok dengan hitungan (0,0)",
      formula: String.raw`AF = \frac{2\,n_{1/1} + n_{0/1}}{2N}`,
      formulaNote:
        "n_{1/1} = jumlah sampel homozigot alternatif (dua salinan ALT), n_{0/1} = jumlah heterozigot (satu salinan ALT), N = jumlah sampel. AF adalah proporsi alel ALT dari seluruh 2N alel. Contoh: V2 punya 3 heterozigot dari 61 sampel → AF = 3 / 122 = 0,0246. Angka ini artinya: sekitar 2,5% alel di kohort ini adalah versi alternatif V2.",
      hints: [
        "Muat file: `from pyodide.http import open_url`, lalu `.read()` — hasilnya bisa bytes, decode dulu bila perlu.",
        "Baris `##` dilewati; baris `#CHROM` di-split tab — nama sampel mulai kolom ke-10 (indeks 9).",
        "Genotipe ada di kolom 9 sampai akhir tiap baris varian; kolom INFO (indeks 7) bentuknya `AF=...`.",
        "Varian tanpa pembawa: semua genotipenya `0/0`. INFO cocok: selisih AF terhitung vs AF INFO < 0,001.",
      ],
      code: {
        starter: [
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-vcf-ke-laporan/skrining_vcf.vcf\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "raw = open_url(URL).read()",
          "text = raw.decode(\"utf-8\") if isinstance(raw, bytes) else raw",
          "",
          "samples = ...       # list nama sampel dari baris #CHROM",
          "variants = ...      # list dict: id, info_af, gt (list genotipe)",
          "",
          "n_sampel = ...",
          "n_varian = ...",
          "",
          "af = ...            # dict: varian -> frekuensi alel dari GT",
          "n_pembawa = ...     # dict: varian -> jumlah sampel dengan GT != 0/0",
          "",
          "af_v2 = ...",
          "af_v6 = ...",
          "af_v8 = ...",
          "n_pembawa_v5 = ...",
          "varian_tanpa_pembawa = ...   # list varian dengan 0 pembawa",
          "info_cocok_v8 = ...         # True/False: AF INFO V8 cocok hitungan?",
          "",
          "print(\"sampel:\", n_sampel, \"| varian:\", n_varian)",
          "for vid in sorted(af):",
          "    print(vid, \"AF=\", round(af[vid], 4), \"| pembawa:\", n_pembawa[vid])",
          "print(\"tanpa pembawa:\", varian_tanpa_pembawa, \"| INFO V8 cocok:\", info_cocok_v8)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-vcf-ke-laporan/skrining_vcf.vcf\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "raw = open_url(URL).read()",
          "text = raw.decode(\"utf-8\") if isinstance(raw, bytes) else raw",
          "",
          "samples = []",
          "variants = []",
          "for line in text.splitlines():",
          "    if line.startswith(\"##\"):",
          "        continue",
          "    f = line.split(\"\\t\")",
          "    if line.startswith(\"#CHROM\"):",
          "        samples = f[9:]",
          "        continue",
          "    variants.append({\"id\": f[2], \"info_af\": float(f[7].split(\"=\")[1]), \"gt\": f[9:]})",
          "",
          "n_sampel = len(samples)",
          "n_varian = len(variants)",
          "",
          "af = {}",
          "n_pembawa = {}",
          "for v in variants:",
          "    alt = sum(1 if g == \"0/1\" else 2 if g == \"1/1\" else 0 for g in v[\"gt\"])",
          "    af[v[\"id\"]] = alt / (2 * n_sampel)",
          "    n_pembawa[v[\"id\"]] = sum(1 for g in v[\"gt\"] if g != \"0/0\")",
          "",
          "af_v2 = round(af[\"V2\"], 4)",
          "af_v6 = round(af[\"V6\"], 4)",
          "af_v8 = round(af[\"V8\"], 4)",
          "n_pembawa_v5 = n_pembawa[\"V5\"]",
          "varian_tanpa_pembawa = sorted([vid for vid, n in n_pembawa.items() if n == 0])",
          "info_af_v8 = [v[\"info_af\"] for v in variants if v[\"id\"] == \"V8\"][0]",
          "info_cocok_v8 = abs(info_af_v8 - af[\"V8\"]) < 0.001",
          "",
          "print(\"sampel:\", n_sampel, \"| varian:\", n_varian)",
          "for vid in sorted(af):",
          "    print(vid, \"AF=\", round(af[vid], 4), \"| pembawa:\", n_pembawa[vid])",
          "print(\"tanpa pembawa:\", varian_tanpa_pembawa, \"| INFO V8 cocok:\", info_cocok_v8)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`samples` terparse", name: "samples", msg: "samples harus list nama sampel dari baris #CHROM." },
          { kind: "defined", task: "t2", label: "`af` terhitung", name: "af", msg: "af harus dict varian -> frekuensi alel." },
          { kind: "equal", task: "t1", label: "`n_sampel` = 61", name: "n_sampel", value: 61, msg: "VCF punya 61 kolom sampel (S001-S061). Catat angka ini — metadata hanya kenal 60 orang." },
          { kind: "equal", task: "t1", label: "`n_varian` = 8", name: "n_varian", value: 8, msg: "VCF punya 8 baris varian (V1-V8)." },
          { kind: "equal", task: "t2", label: "`af_v2` ≈ 0,0246", name: "af_v2", value: 0.0246, tol: 0.001, msg: "3 heterozigot / 122 alel = 0,0246." },
          { kind: "equal", task: "t2", label: "`af_v6` ≈ 0,4590", name: "af_v6", value: 0.459, tol: 0.001, msg: "56 heterozigot / 122 alel = 0,4590. Varian umum — ingat angka ini." },
          { kind: "equal", task: "t2", label: "`n_pembawa_v5` = 7", name: "n_pembawa_v5", value: 7, msg: "V5: 7 heterozigot, 0 homozigot alternatif." },
          { kind: "equal", task: "t3", label: "`varian_tanpa_pembawa` = ['V8']", name: "varian_tanpa_pembawa", value: ["V8"], msg: "Semua 61 genotipe V8 adalah 0/0." },
          { kind: "equal", task: "t3", label: "`af_v8` = 0,0", name: "af_v8", value: 0.0, tol: 0.0001, msg: "AF terhitung V8 = 0 — bukan 0,30 seperti klaim INFO." },
          { kind: "equal", task: "t3", label: "`info_cocok_v8` = False", name: "info_cocok_v8", value: false, msg: "INFO V8 (0,30) tidak cocok dengan hitungan genotipe (0,0). Analis sebelumnya tidak pernah mengecek ini." },
        ],
      },
    },
    {
      id: "konsep-annotasi",
      eyebrow: "Langkah 4 · Konsep — Membaca annotasi",
      title: "Lima lapis bukti sebelum berani bilang 'patogenik'",
      prose: [
        "Klasifikasi varian yang bertanggung jawab berdiri di atas lima lapis bukti. Satu: KONSEKUENSI — apa yang dilakukan varian pada protein? synonymous (tidak mengubah asam amino), missense (mengubah satu asam amino), frameshift (menggeser bingkai baca — biasanya merusak). Dua: DAMPAK — HIGH (frameshift, stop-gain), MODERATE (missense), LOW (synonymous). Tiga: FREKUENSI REFERENSI — varian yang umum di populasi (>1–5%) hampir tidak mungkin menjadi penyebab penyakit langka yang berat. Empat: PREDIKSI komputasional — hanya pendukung, bukan vonis. Lima: KLASIFIKASI — jinak, kemungkinan jinak, VUS, kemungkinan patogenik, patogenik.",
        "Aturan praktisnya: label 'patogenik' butuh BUKTI BERLAPIS yang saling menguatkan (dampak HIGH/MODERATE + jarang di populasi + prediksi mendukung). Satu lapis bukti tidak cukup — dan label draf analis sebelumnya ('V6 patogenik') akan kamu uji satu per satu di langkah audit.",
        "Chart di bawah membandingkan AF kohort (hitunganmu dari Lab 1) dengan AF referensi (fiktif) per varian. Cara membaca: sumbu X = delapan varian; tinggi batang = frekuensi alel; dua warna = AF kohort (terhitung) vs AF referensi (fiktif). Interpretasi: V1, V4, V6 adalah varian UMUM — batangnya tinggi di kedua sisi, artinya variasinya wajar di populasi dan bukan sinyal bahaya. V2, V3, V5, V7 jarang di kedua sisi — kandidat prioritas. Dan V8? Tidak punya batang kohort sama sekali: nol pembawa. Ingat-ingat ini saat membaca klaim '12 pembawa' di draf.",
      ],
      tasks: [
        { id: "t1", text: "Untuk V5 dan V6, tulis lima lapis buktinya masing-masing dari annotasi_varian.csv" },
        { id: "t2", text: "Jelaskan dengan kata-katamu: kenapa V6 yang 'umum' tidak bisa diprioritaskan walau draf bilang patogenik" },
      ],
      echart: {
        option: {
          title: { text: "Frekuensi alel: kohort vs referensi (data fiktif)", left: "center", textStyle: { fontSize: 13 } },
          tooltip: { trigger: "axis" },
          legend: { data: ["AF kohort (terhitung)", "AF referensi (fiktif)"], bottom: 0 },
          xAxis: { type: "category", data: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"] },
          yAxis: { type: "value", name: "frekuensi alel", max: 0.5 },
          series: [
            { name: "AF kohort (terhitung)", type: "bar", data: [0.082, 0.0246, 0.0164, 0.3934, 0.0574, 0.459, 0.0082, 0] },
            { name: "AF referensi (fiktif)", type: "bar", data: [0.08, 0.001, 0.0001, 0.41, 0.002, 0.45, 0.0002, 0.0005] },
          ],
        },
        caption:
          "Cara membaca: sumbu X = delapan varian; tinggi batang = frekuensi alel; batang gelap = AF kohort hasil hitungan Lab 1, batang terang = AF referensi (fiktif). Interpretasi: V1/V4/V6 umum di kedua sisi (bukan sinyal bahaya); V2/V3/V5/V7 jarang (kandidat prioritas); V8 tidak punya batang kohort — nol pembawa, kontras dengan klaim '12 pembawa' di draf.",
      },
      note: {
        title: "Miskonsepsi #2: varian langka = pasti berbahaya",
        type: "pitfall",
        body: "Kelangkaan MENAIKKAN prioritas, tapi bukan BUKTI patogenisitas. Genom manusia penuh varian langka yang tidak berbahaya — setiap orang membawa puluhan ribu varian yang jarang. Yang menentukan adalah bukti berlapis: konsekuensi yang merusak + jarang di populasi + prediksi mendukung. V7 (AF 0,0082) itu langka TAPI klasifikasinya tetap VUS — 'belum diketahui', bukan 'berbahaya'. Jangan biarkan kelangkaan sendirian memutuskan.",
      },
      reference:
        "Lima lapis: konsekuensi → dampak → frekuensi referensi → prediksi → klasifikasi. Label 'patogenik' = semua lapis menguatkan, bukan satu lapis teriak.",
    },
    {
      id: "lab-ambang",
      eyebrow: "Langkah 5 · Lab 2 — Uji sensitivitas ambang",
      title: "Ambang 1% atau 5%? Rekomendasimu ikut berubah",
      prose: [
        "Program harus memutuskan: varian 'jarang' itu yang AF-nya di bawah berapa? 1%? 5%? 10%? Tidak ada hukum alam yang menjawab — ini pilihan KEBIJAKAN. Dan pilihan itu mengubah daftar prioritas. Lab ini menguji seberapa rapuh rekomendasimu terhadap pilihan ambang.",
        "Aturan prioritas berbasis bukti (tanpa memakai klaim draf): varian punya pembawa (n > 0) DAN prediksi 'Tidak pasti'/'Kemungkinan patogenik' DAN AF referensi < 0,01 DAN AF kohort < ambang t. Jalankan untuk t = 0,01, 0,05, 0,10. Perhatikan dua hal: varian mana yang TIDAK PERNAH masuk daftar (kokoh bukan prioritas), dan varian mana yang SELALU masuk (kokoh prioritas).",
      ],
      tasks: [
        { id: "t1", text: "Muat ulang VCF (hitung AF dari GT) + annotasi_varian.csv" },
        { id: "t2", text: "Terapkan aturan prioritas untuk t = 0,01, 0,05, 0,10; simpan `n_prio_001`, `n_prio_005`, `n_prio_010`" },
        { id: "t3", text: "Tentukan `v6_tidak_pernah` dan `v7_selalu`; tulis kesimpulan satu kalimat" },
      ],
      expected:
        "t=0,01 → [V7] (n=1); t=0,05 → [V2, V3, V7] (n=3); t=0,10 → [V2, V3, V5, V7] (n=4). V6 TIDAK PERNAH prioritas (kokoh jinak); V7 SELALU prioritas (kokoh dipantau).",
      hints: [
        "Fungsi baca file sama seperti Lab 1 — salin polanya (open_url + decode bila bytes).",
        "Annotasi: `csv.DictReader(io.StringIO(teks))` — kolom prediksi_fiktif, af_referensi_fiktif.",
        "AF kohort pakai hasil hitungan dari GT (variabel af), BUKAN kolom af_kohort_draf.",
        "V8 otomatis gugur karena n_pembawa = 0 — walau AF-nya 0 < ambang.",
      ],
      code: {
        starter: [
          "from pyodide.http import open_url",
          "import csv, io",
          "",
          "VCF_URL = \"/misi/misi-gabung-vcf-ke-laporan/skrining_vcf.vcf\"",
          "ANO_URL = \"/misi/misi-gabung-vcf-ke-laporan/annotasi_varian.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "def baca(url):",
          "    raw = open_url(url).read()",
          "    return raw.decode(\"utf-8\") if isinstance(raw, bytes) else raw",
          "",
          "af = ...          # dict varian -> AF dari GT (salin logika Lab 1)",
          "n_pembawa = ...   # dict varian -> jumlah pembawa",
          "rows = ...        # list dict dari annotasi_varian.csv",
          "",
          "def prioritas(t):",
          "    out = ...",
          "    return sorted(out)",
          "",
          "n_prio_001 = ...",
          "n_prio_005 = ...",
          "n_prio_010 = ...",
          "v6_tidak_pernah = ...",
          "v7_selalu = ...",
          "",
          "for t in (0.01, 0.05, 0.10):",
          "    print(\"ambang\", t, \"->\", prioritas(t))",
          "print(\"V6 tidak pernah prioritas:\", v6_tidak_pernah)",
          "print(\"V7 selalu prioritas:\", v7_selalu)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "from pyodide.http import open_url",
          "import csv, io",
          "",
          "VCF_URL = \"/misi/misi-gabung-vcf-ke-laporan/skrining_vcf.vcf\"",
          "ANO_URL = \"/misi/misi-gabung-vcf-ke-laporan/annotasi_varian.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "def baca(url):",
          "    raw = open_url(url).read()",
          "    return raw.decode(\"utf-8\") if isinstance(raw, bytes) else raw",
          "",
          "samples = []",
          "variants = []",
          "for line in baca(VCF_URL).splitlines():",
          "    if line.startswith(\"##\"):",
          "        continue",
          "    f = line.split(\"\\t\")",
          "    if line.startswith(\"#CHROM\"):",
          "        samples = f[9:]",
          "        continue",
          "    variants.append({\"id\": f[2], \"gt\": f[9:]})",
          "n_sampel = len(samples)",
          "af = {}",
          "n_pembawa = {}",
          "for v in variants:",
          "    alt = sum(1 if g == \"0/1\" else 2 if g == \"1/1\" else 0 for g in v[\"gt\"])",
          "    af[v[\"id\"]] = alt / (2 * n_sampel)",
          "    n_pembawa[v[\"id\"]] = sum(1 for g in v[\"gt\"] if g != \"0/0\")",
          "rows = list(csv.DictReader(io.StringIO(baca(ANO_URL))))",
          "",
          "def prioritas(t):",
          "    out = []",
          "    for r in rows:",
          "        vid = r[\"varian_id\"]",
          "        if n_pembawa[vid] == 0:",
          "            continue",
          "        if r[\"prediksi_fiktif\"] not in (\"Tidak pasti\", \"Kemungkinan patogenik\"):",
          "            continue",
          "        if float(r[\"af_referensi_fiktif\"]) >= 0.01:",
          "            continue",
          "        if af[vid] < t:",
          "            out.append(vid)",
          "    return sorted(out)",
          "",
          "n_prio_001 = len(prioritas(0.01))",
          "n_prio_005 = len(prioritas(0.05))",
          "n_prio_010 = len(prioritas(0.10))",
          "v6_tidak_pernah = all(\"V6\" not in prioritas(t) for t in (0.01, 0.05, 0.10))",
          "v7_selalu = all(\"V7\" in prioritas(t) for t in (0.01, 0.05, 0.10))",
          "",
          "for t in (0.01, 0.05, 0.10):",
          "    print(\"ambang\", t, \"->\", prioritas(t))",
          "print(\"V6 tidak pernah prioritas:\", v6_tidak_pernah)",
          "print(\"V7 selalu prioritas:\", v7_selalu)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t2", label: "`prioritas` terdefinisi", name: "prioritas", msg: "prioritas(t) harus fungsi yang mengembalikan list varian." },
          { kind: "equal", task: "t2", label: "`n_prio_001` = 1", name: "n_prio_001", value: 1, msg: "Ambang 1%: hanya V7 (AF 0,0082) yang lolos." },
          { kind: "equal", task: "t2", label: "`n_prio_005` = 3", name: "n_prio_005", value: 3, msg: "Ambang 5%: V2, V3, V7 — V5 (AF 0,0574) belum lolos." },
          { kind: "equal", task: "t2", label: "`n_prio_010` = 4", name: "n_prio_010", value: 4, msg: "Ambang 10%: V2, V3, V5, V7." },
          { kind: "equal", task: "t3", label: "`v6_tidak_pernah` = True", name: "v6_tidak_pernah", value: true, msg: "V6 (prediksi 'Jinak') tidak pernah prioritas di semua ambang — kokoh BUKAN prioritas, apa pun kata draf." },
          { kind: "equal", task: "t3", label: "`v7_selalu` = True", name: "v7_selalu", value: true, msg: "V7 prioritas di semua ambang — kokoh dipantau." },
        ],
      },
      note: {
        title: "Ambang adalah kebijakan, bukan kebenaran alam",
        body: "Tidak ada teorema yang bilang 'varian jarang = AF < 1%'. Ambang 1% vs 5% vs 10% adalah pilihan program — dan pilihan itu mengubah siapa yang ditindaklanjuti (1 vs 3 vs 4 varian). Karena itu rekomendasi yang jujur SELALU menyebut ambang yang dipakai dan menunjukkan uji sensitivitasnya, seperti yang baru kamu lakukan. 'Prioritas' tanpa ambang yang dinyatakan = keputusan yang tidak bisa diaudit.",
      },
    },
    {
      id: "kuis",
      eyebrow: "Langkah 6 · Kuis — Dari angka ke manusia",
      title: "Angkanya benar; komunikasinya?",
      prose: [
        "Analisis varian selesai. Sekarang sisi translational-nya: temuan ini akan dibaca manusia — peserta skrining, konselor, Kepala Dinas, wartawan. Empat soal tentang menerjemahkan angka menjadi komunikasi yang tidak menyesatkan.",
      ],
      tasks: [
        { id: "t1", text: "Jawab 4 soal — baca 'why' tiap opsi sebelum lanjut" },
      ],
      quiz: [
        {
          q: "V6: synonymous, AF kohort 45,9% ≈ AF referensi 45%, prediksi 'Jinak' — tapi draf mengklasifikasikannya 'Patogenik' dengan rekomendasi 'skrining lanjutan 56 pembawa'. Respons yang tepat?",
          options: [
            { text: "Setujui draf — analis sebelumnya pasti punya alasan yang tidak tertulis", why: "Salah: 'pasti punya alasan' bukan bukti. Tiga lapis bukti (synonymous, umum di populasi, prediksi jinak) semuanya menolak klaim patogenik. Mempercayai label tanpa verifikasi adalah cara draf ini dibuat.", correct: false },
            { text: "Koreksi klasifikasi menjadi jinak dan batalkan rekomendasi skrining lanjutan untuk V6", why: "Benar: bukti berlapis semuanya bilang jinak — tidak ada satu pun bukti pro-patogenik. Merekomendasikan skrining lanjutan untuk 56 orang atas dasar ini berarti menakuti 56 orang tanpa dasar.", correct: true },
            { text: "Naikkan ambang AF di Lab 2 sampai V6 ikut terprioritas, agar konsisten dengan draf", why: "Salah: ini memanipulasi metode agar cocok dengan kesimpulan yang diinginkan — kebalikan dari sains. Ambang dipilih sebelum melihat hasil, bukan disetel agar V6 'lolos'.", correct: false },
            { text: "Abaikan saja — toh peserta tidak akan membaca laporan teknis", why: "Salah: rekomendasi 'skrining lanjutan 56 pembawa' akan menjadi surat undangan nyata ke 56 orang nyata. Laporan teknis selalu bermuara pada tindakan nyata.", correct: false },
          ],
        },
        {
          q: "V2 dan V7 berstatus VUS. Seorang peserta bertanya: 'Apakah saya positif membawa penyakit?' Jawaban yang jujur?",
          options: [
            { text: "'Belum tentu — VUS artinya kami belum tahu apakah varian ini berbahaya; yang bisa kami tawarkan adalah konseling, bukan diagnosis'", why: "Benar: VUS = variant of uncertain significance. Jujur soal ketidaktahuan + tawarkan jalur yang tepat (konseling) adalah komunikasi risiko yang benar.", correct: true },
            { text: "'Ya, varian Anda terdeteksi prioritas — sebaiknya anggap positif sampai terbukti sebaliknya'", why: "Salah: membalik beban bukti. 'Prioritas untuk dipantau' bukan 'positif penyakit'. Ini cara tercepat menciptakan kecemasan yang tidak berdasar.", correct: false },
            { text: "'Tidak, VUS itu pada dasarnya jinak — lupakan saja hasilnya'", why: "Salah: VUS bukan jinak. Menenangkan palsu sama berbahayanya dengan menakuti palsu — keduanya merusak kepercayaan saat kebenaran muncul.", correct: false },
            { text: "'Tunggu 5 tahun sampai sains memastikannya, jangan tanya-tanya dulu'", why: "Salah: menunda tanpa penjelasan bukan komunikasi. Peserta berhak tahu statusnya SEKARANG — bahwa statusnya adalah 'belum diketahui' — plus apa yang bisa dilakukan hari ini.", correct: false },
          ],
        },
        {
          q: "Lab 2 menunjukkan daftar prioritas berubah (1 → 3 → 4 varian) saat ambang digeser 1% → 5% → 10%. Apa makna terpentingnya untuk laporan program?",
          options: [
            { text: "Pilih ambang 10% agar daftar prioritas paling lengkap — makin banyak makin aman", why: "Salah: 'makin banyak makin aman' mengabaikan biaya dan kecemasan tiap tindak lanjut. Ambang longgar = lebih banyak orang dipanggil tanpa dasar yang lebih kuat.", correct: false },
            { text: "Ambang adalah pilihan kebijakan yang mengubah siapa ditindaklanjuti — jadi laporan wajib menyatakan ambang yang dipakai + hasil uji sensitivitasnya", why: "Benar: justru karena tidak ada ambang 'alami', kejujuran metodologis mewajibkan transparansi. Keputusan yang tidak menyebut ambangnya tidak bisa diaudit.", correct: true },
            { text: "Gunakan ambang 1% saja karena paling ketat — yang ketat pasti paling benar", why: "Salah: ketat bukan benar. Ambang 1% melewatkan V2/V3/V5 yang bukti lainnya menandai prioritas. Ketat meminimalkan alarm palsu tapi memaksimalkan yang terlewat.", correct: false },
            { text: "Rata-ratakan saja ketiga hasil — 2,67 varian prioritas", why: "Salah: merata-ratakan keputusan kebijakan tidak bermakna. Yang dibutuhkan adalah SATU ambang yang dinyatakan + alasan pemilihannya, bukan kompromi aritmetika.", correct: false },
          ],
        },
        {
          q: "VCF punya 61 kolom sampel tapi metadata hanya mengenal 60 peserta (S001–S060). Jika ini lolos tanpa terdeteksi, apa dampaknya?",
          options: [
            { text: "Tidak ada — satu kolom ekstra tidak mengubah apa-apa", why: "Salah: n yang salah menggeser SEMUA frekuensi alel (pembagi 122 vs 120) dan satu orang terhitung dua kali di setiap statistik.", correct: false },
            { text: "n membengkak, semua AF sedikit terdilusi, dan satu peserta terhitung dua kali — semua angka sedikit salah + ada masalah pendaftaran ganda", why: "Benar: duplikat pendaftaran adalah pola klasik program skrining. Dampak statistiknya kecil di sini, tapi pola masalahnya besar: data yang sama dihitung dua kali.", correct: true },
            { text: "Hanya memengaruhi V8 karena V8 yang bermasalah", why: "Salah: duplikat memengaruhi SEMUA varian (pembagi n berubah untuk semua AF). Jangan mengaitkan dua masalah independen menjadi satu.", correct: false },
            { text: "VCF otomatis menolak kolom ke-61 saat di-parse", why: "Salah: VCF tidak tahu berapa peserta 'seharusnya'. File tidak memvalidasi dirinya sendiri — itulah pekerjaanmu.", correct: false },
          ],
        },
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Tiga skenario, tiga tingkat respons",
      prose: [
        "Sebelum memilih rekomendasi program, petakan dulu logikanya. Tidak semua temuan varian pantas mendapat respons yang sama — program yang baik merespons PROPORSIONAL terhadap kekuatan bukti.",
        "Skenario A — Bukti kuat, pembawa teridentifikasi (contoh: V5, kemungkinan patogenik, 7 pembawa): rujuk ke KONSELING GENETIK. Bukan skrining massal — konseling: sesi tatap muka menjelaskan arti temuan, riwayat keluarga, dan pilihan tindak lanjut medis. Alasannya: label 'kemungkinan patogenik' butuh konteks klinis individual yang hanya bisa diberikan konselor, bukan surat massal.",
        "Skenario B — Bukti belum pasti (contoh: V2/V7, VUS): KOMUNIKASIKAN KETIDAKPASTIAN, tawarkan konseling bila diminta. Jangan umumkan sebagai 'temuan positif', jangan juga disembunyikan. Alasannya: VUS bisa berubah status saat sains berkembang — yang kamu bangun hari ini adalah KEPERCAYAAN, bukan kepastian palsu.",
        "Skenario C — Bukti menolak (contoh: V1/V4/V6, umum dan jinak): TIDAK ADA tindakan individual; catat di surveilans rutin. Alasannya: memanggil 56 orang untuk varian umum yang jinak membakar anggaran, waktu konselor, dan — yang paling mahal — kepercayaan publik.",
        "Mini-case: Puskes Maju melaporkan Ibu S (34 tahun, pembawa V5) yang bertanya 'apakah anak saya pasti sakit?' Jawaban satu kalimat yang jujur: 'Tidak pasti — varian ini TERKAIT risiko (bukan vonis), dan konselor genetik akan menjelaskan apa artinya untuk keluarga Ibu secara spesifik.' Perhatikan: tidak ada kata 'patogenik' yang dilontarkan tanpa konteks, tidak ada kepastian palsu, ada jalur tindakan yang jelas.",
        "Aturan praktis 10 detik: (1) AF umum (>5%) + bukti jinak = bukan prioritas, apa pun kata draf; (2) VUS ≠ diagnosis — jangan umumkan sebagai temuan positif; (3) klaim 'patogenik' butuh bukti berlapis, bukan satu kolom di spreadsheet; (4) tiap rekomendasi massal wajib menyebut ambang yang dipakai.",
      ],
      tasks: [
        { id: "t1", text: "Petakan V1–V8 ke skenario A/B/C — tulis alasan satu baris per varian" },
        { id: "t2", text: "Tulis jawabanmu sendiri untuk Ibu S (maks 2 kalimat), lalu bandingkan dengan contoh" },
      ],
      note: {
        title: "Proporsionalitas adalah etika program",
        body: "Respons yang berlebihan (skrining massal untuk varian jinak) dan respons yang kurang (mendiamkan varian HIGH yang terlewat) SAMA-SAMA kegagalan — yang satu membakar kepercayaan, yang satu membiarkan risiko. Tugas translational bukan 'menemukan sebanyak-banyaknya', melainkan 'merespons seproporsional mungkin dengan bukti yang ada'.",
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 8 · Checkpoint keputusan",
      title: "Tingkat rekomendasi apa yang kamu ajukan?",
      prose: [
        "Semua angka di tangan — kecuali satu hal: kamu BELUM mengaudit draf analis sebelumnya. Keputusan ini harus kamu buat sekarang, seperti Kepala Dinas yang harus memutuskan sebelum audit selesai. Tiap opsi mengubah apa yang terjadi berikutnya, dan semuanya membawa konsekuensi nyata.",
      ],
      tasks: [
        { id: "t1", text: "Pilih SATU tingkat rekomendasi — tulis alasan 2 kalimat sebelum mengklik" },
      ],
      decision: {
        prompt:
          "Rekomendasi tingkat program apa yang kamu ajukan ke Kepala Dinas atas hasil skrining ini? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-skrining",
            label: "Skrining lanjutan terarah — undang pembawa prioritas + keluarga inti",
            rationale:
              "Temuan harus ditindaklanjuti maksimal: 7 pembawa V5 plus keluarga inti diundang skrining lanjutan; VUS (V2/V7) ikut dipanggil untuk pemantauan. Mumpung momentum program masih hangat.",
            nextStepId: "temuan-skrining",
            consequenceNote:
              "Dinas menyetujui. Surat undangan dikirim — termasuk ke 56 'pembawa V6' dan 12 'pembawa V8' sesuai draf yang belum kamu audit. Tiga minggu kemudian seorang wartawan bertanya: 'Atas dasar apa 68 orang dilabeli pembawa varian patogenik?' Kamu belum punya jawaban yang sudah diaudit.",
          },
          {
            id: "opt-konseling",
            label: "Rujukan konseling genetik — tanpa skrining massal",
            rationale:
              "Proporsional: pembawa V5/V2/V7 dirujuk ke konselor genetik untuk penjelasan individual; tidak ada surat massal, tidak ada label publik. Varian jinak (V1/V4/V6) tidak ditindaklanjuti.",
            nextStepId: "temuan-konseling",
            consequenceNote:
              "Dinas menyetujui. Tapi daftar rujukanmu masih memakai klasifikasi draf — termasuk '56 pembawa V6 patogenik'. Konselor pertama yang menerima daftar meneleponmu: 'V6 ini synonymous dengan AF 46% — kenapa dirujuk sebagai patogenik?' Kamu terdiam: kamu belum mengaudit drafnya.",
          },
          {
            id: "opt-surveilans",
            label: "Surveilans rutin — tidak ada tindak lanjut individual untuk sekarang",
            rationale:
              "Hemat dan hati-hati: bukti belum cukup kuat untuk tindakan individual massal. Perkuat surveilans rutin, kumpulkan data keluarga, putuskan lagi 12 bulan ke depan dengan bukti lebih banyak.",
            nextStepId: "temuan-surveilans",
            consequenceNote:
              "Dinas memilih hemat. Delapan bulan kemudian, keluarga salah satu pembawa V5 bertanya kenapa mereka tidak pernah diberi tahu. 'Kami menunggu kepastian,' jawabmu — tapi V3, varian frameshift yang draf tulis sebagai 'synonymous', bahkan tidak masuk daftar pantauanmu.",
          },
        ],
      },
    },
  ],
};

export default misiGabungVcfLaporan;

// ── lanjutan misiGabungVcfLaporan: langkah 9–15 ───────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_CAP8: V2Step[] = [
  {
    id: "temuan-skrining",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: skrining lanjutan terarah",
    prose: [
      "Dinas menyetujui — dan mesin program bergerak cepat. Surat undangan skrining lanjutan dikirim ke 7 pembawa V5 dan keluarganya. Hasilnya menggembirakan di permukaan: 12 pembawa tambahan V5 ditemukan di keluarga inti, dua di antaranya dirujuk ke layanan klinis. Kepala Dinas memujimu di rapat koordinasi.",
      "Tapi surat yang sama juga dikirim ke 56 'pembawa V6' dan 12 'pembawa V8' — angka yang kamu ambil mentah-mentah dari draf yang belum diaudit. Tiga minggu kemudian, telepon dari seorang wartawan kesehatan: 'Kami mewawancarai tiga keluarga yang menerima surat berlabel varian patogenik. Atas dasar apa 68 orang dilabeli begitu?' Kamu membuka draf analis sebelumnya — dan untuk pertama kalinya benar-benar MEMBACANYA baris per baris. Perutmu mulas.",
      "Pelajaran yang mahal: kecepatan tanpa verifikasi bukan ketegasan — itu kecerobohan yang rapi. Skrining lanjutan adalah alat yang benar untuk temuan yang benar; untuk temuan yang belum diverifikasi, ia adalah mesin penyebar label yang salah.",
    ],
    tasks: [
      { id: "t1", text: "Tulis: bagian mana dari keputusanmu yang didukung angka Lab 1–2, dan bagian mana yang hanya mengandalkan draf" },
    ],
    note: {
      title: "Rekomendasi di atas draf yang belum diaudit = rumah di atas pasir",
      body: "Keputusanmu memakai dua fondasi: hitunganmu sendiri (kokoh) dan klaim draf (belum diverifikasi). Di langkah audit berikutnya, kamu akan tahu persis berapa banyak dari 68 surat itu yang seharusnya tidak pernah dikirim.",
    },
  },
  {
    id: "temuan-konseling",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: rujukan konseling genetik",
    prose: [
      "Dinas menyetujui jalur proporsional: daftar rujukan konseling untuk pembawa V5, V2, dan V7. Tidak ada surat massal, tidak ada label publik — pendekatan yang elegan dan hemat. Kamu merasa sudah mengambil jalan tengah yang bijak.",
      "Sampai telepon dari konselor genetik pertama yang menerima daftar. 'Saya lihat ada 56 rujukan dengan label varian patogenik V6,' katanya. 'Tapi ini synonymous dengan frekuensi alel 46% — di populasi umum pun segitu. Atas dasar apa ini dirujuk sebagai patogenik?' Kamu membuka annotasi_varian.csv. Kolom klasifikasi_draf memang menulis 'Patogenik' — dan kamu tidak pernah mempertanyakannya sebelum mengirim daftar.",
      "Konselor itu menyelamatkanmu dari kesalahan yang lebih besar: ia menahan 56 rujukan itu dan memintamu mengaudit ulang. Pelajaran yang mahal tapi murah dibanding alternatifnya: rantai verifikasi (analis → konselor → peserta) hanya sekuat mata rantai yang paling tidak kritis. Hari itu, mata rantai itu adalah kamu.",
    ],
    tasks: [
      { id: "t1", text: "Tulis: satu pertanyaan verifikasi yang seharusnya kamu ajukan ke draf SEBELUM mengirim daftar rujukan" },
    ],
    note: {
      title: "Jalan tengah tetap butuh fondasi yang diaudit",
      body: "Konseling adalah respons yang tepat untuk temuan yang tepat. Tapi 'tepat' ditentukan oleh bukti, bukan oleh nada bicara yang tenang. Daftar rujukan yang tenang dengan isi yang salah tetap salah — hanya lebih sopan.",
    },
  },
  {
    id: "temuan-surveilans",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: surveilans rutin",
    prose: [
      "Dinas memilih opsi hemat: tidak ada tindak lanjut individual, surveilans rutin diperkuat, keputusan ditinjau 12 bulan lagi. Anggaran aman, tidak ada kepanikan, tidak ada surat yang salah kirim. Di atas kertas, ini keputusan paling 'bersih'.",
      "Delapan bulan kemudian, keluarga salah satu pembawa V5 datang ke puskesmas. Mereka mendengar dari kerabat bahwa 'ada program genetik' dan bertanya kenapa mereka tidak pernah diberi tahu tentang hasil skrining. 'Kami menunggu kepastian sebelum bertindak,' jawab petugas — kalimat yang kamu tulis di memo. Keluarga itu mengangguk, tapi di perjalanan pulang mereka bertanya-tanya: kepastian apa yang ditunggu, dan siapa yang menunggu untuk mereka?",
      "Dan ada yang lebih mengganggu: V3 — varian yang draf tulis sebagai 'synonymous, tidak ada tindakan' — bahkan tidak masuk daftar pantauan surveilansmu. Kamu tidak tahu bahwa annotasinya salah. Surveilans yang memantau daftar yang salah bukan kehati-hatian — itu ketenangan yang buta.",
    ],
    tasks: [
      { id: "t1", text: "Tulis: apa bedanya 'menunggu kepastian' dengan 'mengabaikan sambil menunggu' — di mana posisimu?" },
    ],
    note: {
      title: "Tidak bertindak juga sebuah tindakan — yang butuh bukti",
      body: "'Surveilans rutin' terdengar netral, tapi ia adalah keputusan aktif untuk TIDAK memberi tahu 7 pembawa V5 selama 12 bulan. Keputusan pasif butuh justifikasi sekuat keputusan aktif: bukti apa yang membuatmu yakin menunggu itu aman?",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Dossier 12 baris: draf 'final' yang siap dikirim itu bohong",
    prose: [
      "Waktunya mengadili draf analis sebelumnya. Di bawah ini Tabel 1 dari draf laporan program — diklaim 'final, siap dikirim ke Kepala Dinas'. Seseorang menyuntikkan 4 masalah ke dalamnya (atau analisnya yang membuatnya — untukmu sama saja: buktikan dengan data).",
      "Senjatamu: AF terhitung dari Lab 1 (bukan dari INFO), lima lapis bukti dari Langkah 4, hasil uji sensitivitas Lab 2, dan metadata 60 peserta. Bandingkan setiap sel draf dengan kebenaran mentah — angka tidak bisa berbohong dua kali.",
    ],
    tasks: [
      { id: "t1", text: "Tandai baris-baris yang kamu curigai SEBELUM membuka debrief — tulis nomor baris + alasan satu kalimat" },
      { id: "t2", text: "Untuk tiap baris curiga, tulis bukti verifikasinya (file + kolom + angka)" },
    ],
    auditDossier: {
      version: "vcf-laporan-cap8-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Tabel 1 draf laporan program skrining genetik ('final, siap dikirim ke Kepala Dinas') yang disusun analis sebelumnya.",
      columns: ["Varian", "Gen", "Konsekuensi (draf)", "AF kohort (draf)", "AF referensi", "Klasifikasi draf", "Rekomendasi draf"],
      rows: [
        { rowId: 1, cells: { "Varian": "V1", "Gen": "FIC1", "Konsekuensi (draf)": "missense", "AF kohort (draf)": "0,0820", "AF referensi": "0,080", "Klasifikasi draf": "Kemungkinan jinak", "Rekomendasi draf": "Tidak ada tindakan" }, claims: [{ label: "Status draf", value: "Final" }] },
        { rowId: 2, cells: { "Varian": "V2", "Gen": "FIC1", "Konsekuensi (draf)": "missense", "AF kohort (draf)": "0,0246", "AF referensi": "0,001", "Klasifikasi draf": "VUS", "Rekomendasi draf": "Konseling bila diminta" }, claims: [{ label: "Status draf", value: "Final" }] },
        // ── I1: annotasi V3 salah ──
        { rowId: 3, cells: { "Varian": "V3", "Gen": "FIC2", "Konsekuensi (draf)": "synonymous", "AF kohort (draf)": "0,0164", "AF referensi": "0,0001", "Klasifikasi draf": "VUS", "Rekomendasi draf": "Tidak ada tindakan" }, claims: [{ label: "Status draf", value: "Final" }] },
        { rowId: 4, cells: { "Varian": "V4", "Gen": "FIC2", "Konsekuensi (draf)": "synonymous", "AF kohort (draf)": "0,3934", "AF referensi": "0,410", "Klasifikasi draf": "Jinak", "Rekomendasi draf": "Tidak ada tindakan" }, claims: [{ label: "Status draf", value: "Final" }] },
        { rowId: 5, cells: { "Varian": "V5", "Gen": "FIC3", "Konsekuensi (draf)": "missense", "AF kohort (draf)": "0,0574", "AF referensi": "0,002", "Klasifikasi draf": "Kemungkinan patogenik", "Rekomendasi draf": "Rujuk konseling genetik" }, claims: [{ label: "Status draf", value: "Final" }] },
        // ── I3: V6 jinak diklaim patogenik ──
        { rowId: 6, cells: { "Varian": "V6", "Gen": "FIC3", "Konsekuensi (draf)": "synonymous", "AF kohort (draf)": "0,4590", "AF referensi": "0,450", "Klasifikasi draf": "Patogenik", "Rekomendasi draf": "Skrining lanjutan 56 pembawa" }, claims: [{ label: "Status draf", value: "Final" }] },
        { rowId: 7, cells: { "Varian": "V7", "Gen": "FIC4", "Konsekuensi (draf)": "missense", "AF kohort (draf)": "0,0082", "AF referensi": "0,0002", "Klasifikasi draf": "VUS", "Rekomendasi draf": "Konseling bila diminta" }, claims: [{ label: "Status draf", value: "Final" }] },
        // ── I4: AF V8 dari INFO tak cocok genotipe ──
        { rowId: 8, cells: { "Varian": "V8", "Gen": "FIC4", "Konsekuensi (draf)": "missense", "AF kohort (draf)": "0,30 (INFO)", "AF referensi": "0,0005", "Klasifikasi draf": "VUS", "Rekomendasi draf": "Skrining lanjutan 12 pembawa" }, claims: [{ label: "Status draf", value: "Final" }] },
        // ── I2: sampel duplikat ──
        { rowId: 9, cells: { "Varian": "Total sampel", "Gen": "—", "Konsekuensi (draf)": "—", "AF kohort (draf)": "61 kolom VCF", "AF referensi": "—", "Klasifikasi draf": "—", "Rekomendasi draf": "n=61 (final)" }, claims: [{ label: "Status draf", value: "Final" }] },
        // ── I4 pendukung: metode AF dari INFO ──
        { rowId: 10, cells: { "Varian": "Metode AF", "Gen": "—", "Konsekuensi (draf)": "—", "AF kohort (draf)": "dari kolom INFO", "AF referensi": "—", "Klasifikasi draf": "—", "Rekomendasi draf": "Sesuai SOP" }, claims: [{ label: "Status draf", value: "Final" }] },
        // ── I2 pendukung: QC duplikat bohong ──
        { rowId: 11, cells: { "Varian": "QC duplikat", "Gen": "—", "Konsekuensi (draf)": "—", "AF kohort (draf)": "tidak ditemukan", "AF referensi": "—", "Klasifikasi draf": "—", "Rekomendasi draf": "QC lolos" }, claims: [{ label: "Status draf", value: "Final" }] },
        { rowId: 12, cells: { "Varian": "Keputusan draf", "Gen": "—", "Konsekuensi (draf)": "—", "AF kohort (draf)": "—", "AF referensi": "—", "Klasifikasi draf": "—", "Rekomendasi draf": "Skrining lanjutan V6+V8; V3 aman" }, claims: [{ label: "Status draf", value: "Final — siap dikirim" }] },
      ],
      injections: [
        { key: "annotasi-salah", rowIds: [3], title: "Annotasi V3 salah: delesi frameshift ditulis synonymous", clue: "Buka VCF baris V3: REF=CT, ALT=C — satu basa terdelesi. Delesi di daerah coding menggeser bingkai baca (frameshift), tidak mungkin synonymous. Dampak yang benar HIGH, bukan LOW.", danger: "Varian HIGH-impact hilang dari daftar prioritas — 2 pembawanya tidak pernah ditindaklanjuti, dan 'V3 aman' di baris 12 berdiri di atas annotasi yang salah." },
        { key: "sampel-duplikat", rowIds: [9, 11], title: "S061 adalah duplikat S017; metadata hanya kenal 60 orang", clue: "Bandingkan vektor genotipe S061 vs S017: identik di 8/8 varian. metadata_kohort.csv hanya memuat S001–S060 — S061 tidak dikenal. Klaim 'QC lolos' di baris 11 bohong.", danger: "n membengkak 61 vs 60: semua frekuensi alel terdilusi, satu orang terhitung dua kali. Pendaftaran ganda adalah pola klasik program skrining — dan QC yang mengklaim 'lolos' tanpa mengecek adalah QC boneka." },
        { key: "benign-diklaim-patogenik", rowIds: [6], title: "V6 yang jinak diklaim patogenik", clue: "Tiga lapis bukti menolak klaim: (1) synonymous — tidak mengubah protein; (2) AF kohort 0,459 ≈ AF referensi 0,450 — varian umum; (3) prediksi fiktif 'Jinak'. Tidak ada satu pun bukti pro-patogenik.", danger: "56 orang menerima label 'pembawa varian patogenik' yang salah — kecemasan massal, rujukan konseling yang sia-sia, dan saat kesalahan terbongkar, kepercayaan publik pada program runtuh. Ini overclaim paling berbahaya di dossier ini." },
        { key: "info-tak-cocok", rowIds: [8, 10], title: "AF V8 dari INFO (0,30) tidak cocok dengan genotipe (0,0)", clue: "Hitung dari kolom GT seperti Lab 1: 61/61 genotipe V8 adalah 0/0 → AF terhitung 0. Baris 10 mengaku AF diambil dari kolom INFO — metode yang salah: nilai INFO bisa disalin dari mana saja tanpa verifikasi.", danger: "Rekomendasi 'skrining lanjutan 12 pembawa' dibuat untuk 12 orang yang TIDAK ADA. Keputusan program di atas angka yang tidak diverifikasi — pelajaran Lab 1 yang diabaikan analis sebelumnya." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Laporan program untuk Kepala Dinas",
    prose: [
      "Semua bukti di tangan — termasuk yang memalukan. Tulis laporan program satu dokumen untuk Kepala Dinas: artefak portofoliomu sebagai bioinformatician translational. Laporan yang baik bukan yang paling meyakinkan, melainkan yang paling JUJUR tentang apa yang diketahui, apa yang belum, dan apa yang tidak boleh diklaim.",
      "Mini-case untuk melatih nada: tulis paragraf 'Komunikasi ke peserta' untuk Ibu S (pembawa V5, 34 tahun) — maksimal 5 kalimat, tanpa kata 'patogenik' yang berdiri sendiri tanpa konteks, tanpa kepastian palsu, dengan jalur tindakan yang jelas.",
    ],
    tasks: [
      { id: "t1", text: "Tulis draf laporan mengikuti 6 bagian template" },
      { id: "t2", text: "Tulis paragraf 'Komunikasi ke peserta' untuk Ibu S (maks 5 kalimat)" },
      { id: "t3", text: "Nilai drafmu sendiri dengan rubrik — bagian mana yang masih di bawah level 3?" },
    ],
    deliverable: {
      template: [
        "Ringkasan eksekutif (5 kalimat): berapa peserta/varian, temuan prioritas (V5/V2/V3/V7 dengan statusnya), rekomendasi tingkat program, dan satu kalimat batas utama.",
        "Metode (jujur): AF dihitung dari genotipe (bukan INFO); ambang prioritas yang dipakai + hasil uji sensitivitas (1→3→4 varian); data sintetis — tidak ada klaim klinis dunia nyata.",
        "Temuan varian: tabel 8 varian dengan lima lapis bukti masing-masing; bedakan FAKTA (hitungan) dari KLASIFIKASI (penilaian).",
        "Temuan audit kualitas data: 4 masalah di draf sebelumnya — bukti baris/kolom masing-masing + koreksi angkanya (n=60, V3 frameshift/HIGH, V6 jinak, V8 nol pembawa).",
        "Rekomendasi bertingkat: siapa dirujuk konseling (V5/V2/V7), siapa tidak ditindaklanjuti (V1/V4/V6), apa yang dipantau (surveilans + ambang tinjauan 12 bulan) — tiap rekomendasi menyebut ambang dan buktinya.",
        "Batas & yang tidak boleh diklaim: VUS bukan diagnosis; AF dihitung dari 60 orang (bukan populasi); gen fiktif — tidak ada implikasi klinis nyata; daftar eksplisit 'kalimat yang dilarang' di komunikasi publik.",
      ],
      rubric: [
        { criterion: "Kebenaran analisis varian", weight: 25, levels: ["AF/klasifikasi salah atau dari klaim INFO", "Sebagian benar, sebagian dari draf", "AF dari genotipe, 8 varian terklasifikasi berbasis lima lapis bukti — semua tepat"] },
        { criterion: "Deteksi masalah kualitas data", weight: 20, levels: ["Tidak menyebut masalah", "Menyebut sebagian tanpa bukti baris", "Keempat masalah disebut dengan bukti (VCF baris/kolom, metadata) + angka koreksinya"] },
        { criterion: "Rekomendasi program proporsional", weight: 25, levels: ["Satu tingkat untuk semua / tanpa ambang", "Bertingkat tapi ambang kabur", "Bertingkat (konseling/VUS/surveilans) + ambang eksplisit + uji sensitivitas dirujuk"] },
        { criterion: "Komunikasi risiko untuk non-ahli", weight: 15, levels: ["Jargon varian tanpa terjemahan / menakuti", "Sebagian diterjemahkan", "Paragraf Ibu S: jujur, tanpa kepastian palsu, ada jalur tindakan, tanpa label telanjang"] },
        { criterion: "Kejujuran batas data", weight: 15, levels: ["Mengklaim temuan berlaku umum/klinis", "Menyebut sebagian batas", "Sintetis, n=60, VUS≠diagnosis, dan 'kalimat yang dilarang' dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat masalah di draf analis sebelumnya:",
      "1) **Annotasi V3 salah** (baris 3): REF=CT → ALT=C adalah delesi satu basa — frameshift, dampak HIGH. Draf menulis 'synonymous'/'LOW' dan menyimpulkan 'V3 aman' (baris 12). Akibatnya: varian HIGH-impact dengan 2 pembawa hilang dari semua tindak lanjut. Annotasi adalah fondasi klasifikasi — fondasi yang salah meruntuhkan semuanya.",
      "2) **Sampel duplikat** (baris 9, 11): S061 = salinan persis S017 di 8/8 varian; metadata hanya mengenal S001–S060. 'QC lolos' di baris 11 adalah klaim tanpa pengecekan. Akibatnya: n=61 vs 60 yang benar — semua AF sedikit terdilusi dan satu orang terhitung dua kali. Kecil di sini, fatal di kohort besar.",
      "3) **V6 jinak diklaim patogenik** (baris 6): synonymous + AF 45,9% ≈ referensi 45% + prediksi 'Jinak' — tiga lapis bukti menolak, nol lapis mendukung. Tapi draf merekomendasikan 'skrining lanjutan 56 pembawa'. Ini overclaim paling berbahaya: 56 orang hampir menerima label patogenik yang salah.",
      "4) **AF V8 dari INFO tak cocok** (baris 8, 10): INFO menulis AF=0,30; genotipe menunjukkan 61/61 adalah 0/0 → AF=0. Analis memakai kolom INFO tanpa menghitung — persis yang Lab 1 melatihmu untuk tidak dilakukan. 'Skrining lanjutan 12 pembawa' ditujukan untuk 12 orang yang tidak ada.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel 'final'. Dan ingat keputusanmu di Langkah 8: apa pun opsi yang kamu pilih, ia dibangun di atas draf yang belum diaudit — skrining lanjutan mengirim 68 surat yang salah, konseling merujuk 56 orang yang salah, surveilans memantau daftar yang salah. Tidak ada opsi yang gratis dari keharusan mengaudit DULU.",
      "Bahaya nyata terakhir — di luar misi ini: label 'patogenik' yang salah di program nyata berarti kecemasan massal, stigmatisasi keluarga, biaya konseling yang terbakar, dan — yang paling sulit diperbaiki — runtuhnya kepercayaan publik pada program skrining berikutnya. Sebaliknya, varian HIGH yang terlewat (seperti V3) berarti pembawa yang seharusnya ditolong tidak pernah tahu. Translational bioinformatics bukan soal pipeline tercepat — ini soal label yang kamu tempel pada manusia.",
    ],
    tasks: [
      { id: "t1", text: "Hitung skor deteksimu (x/4) — baris mana yang kamu tandai benar di Langkah 10?" },
      { id: "t2", text: "Tulis: jika kamu bisa mengulang Langkah 8, apa yang berubah dari keputusanmu?" },
    ],
    note: {
      title: "Miskonsepsi #3: VUS = hampir patogenik",
      type: "risk",
      body: "VUS (variant of uncertain significance) artinya 'belum diketahui' — titik. Bukan 'kemungkinan patogenik lite', bukan 'tunggu saja pasti patogenik'. Di klinik nyata, sebagian besar VUS akhirnya direklasifikasi menjadi JINAK seiring data bertambah. Memperlakukan VUS sebagai 'hampir patogenik' adalah cara halus untuk berbohong dengan label yang benar.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tulis ulang 6 poin di bawah dengan kata-katamu sendiri — tanpa melihat lagi" },
    ],
    summary: [
      "Translational = dari genotipe ke keputusan: AF selalu dihitung dari kolom GT (VCF), bukan dibaca dari INFO — INFO V8 (0,30) vs hitungan (0,0) adalah buktinya.",
      "Klasifikasi varian butuh lima lapis bukti (konsekuensi, dampak, frekuensi referensi, prediksi, klasifikasi) — label 'patogenik' tanpa bukti berlapis adalah overclaim, seperti V6 (synonymous, AF 46%, prediksi jinak).",
      "Ambang frekuensi adalah pilihan kebijakan: 1% → 1 varian, 5% → 3, 10% → 4 prioritas. Laporan yang jujur menyatakan ambangnya + hasil uji sensitivitas; V6 kokoh bukan prioritas, V7 kokoh dipantau.",
      "Empat pola masalah kualitas data: annotasi salah (V3 frameshift ditulis synonymous), sampel duplikat (S061=S017, n 61 vs 60), benign diklaim patogenik (V6), angka tak terverifikasi (V8). Semuanya terdeteksi dengan membandingkan klaim vs data mentah.",
      "Rekomendasi program harus proporsional: konseling untuk bukti kuat (V5), komunikasikan ketidakpastian untuk VUS (V2/V7), tidak ada tindakan untuk yang jinak (V1/V4/V6) — dan tidak ada opsi yang bebas dari keharusan mengaudit draf dulu.",
      "Data: SINTETIS 100% orisinal untuk misi ini (generator Python, seed 42) — 8 varian fiktif pada gen fiktif FIC1–FIC4, 61 kolom sampel VCF, metadata 60 peserta. BUKAN data genom manusia nyata; tidak ada klaim klinis dunia nyata.",
    ],
  },
];

(misiGabungVcfLaporan.steps as V2Step[]).push(...LANJUTAN_CAP8);
