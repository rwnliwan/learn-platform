import type { V2Lesson } from "../lib/types";

// Pipeline indexing: OCR multi-tahap (Unstructured) vs ColPali visual langsung.
// Angka latensi per halaman dari paper ColPali (arXiv 2407.01449), tabel B.4.
const FIG_PIPELINE = `<svg viewBox="0 0 560 300" role="img" aria-label="Perbandingan pipeline indexing OCR vs ColPali: 7,22 detik vs 0,39 detik per halaman.">
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">
<text x="140" y="20">Pipeline OCR + teks</text><text x="420" y="20">ColPali (visual langsung)</text>
</g>
<g font-family="var(--font-ui)" font-size="10" text-anchor="middle">
<rect x="20" y="40" width="240" height="34" rx="6" fill="var(--c4)" opacity="0.5"/><text x="140" y="61" fill="var(--text)">Layout detection · 0,81 dtk</text>
<rect x="20" y="80" width="240" height="34" rx="6" fill="var(--c4)" opacity="0.6"/><text x="140" y="101" fill="var(--text)">OCR · 2,67 dtk</text>
<rect x="20" y="120" width="240" height="34" rx="6" fill="var(--c4)" opacity="0.7"/><text x="140" y="141" fill="var(--text)">Captioning · 3,71 dtk</text>
<rect x="20" y="160" width="240" height="34" rx="6" fill="var(--c4)" opacity="0.85"/><text x="140" y="181" fill="var(--text)">Page encoding · 0,03 dtk</text>
<rect x="300" y="40" width="240" height="154" rx="6" fill="var(--c1)"/><text x="420" y="100" fill="var(--text)">Halaman → gambar → PaliGemma</text><text x="420" y="118" fill="var(--text)">1024 vektor patch × 128-dim</text><text x="420" y="150" fill="var(--text)">Page encoding · 0,39 dtk</text>
</g>
<g font-family="var(--font-ui)" font-size="11">
<rect x="20" y="212" width="361" height="26" rx="4" fill="var(--c4)"/><text x="28" y="230" fill="var(--text)">total 7,22 dtk/halaman</text>
<rect x="20" y="242" width="20" height="26" rx="4" fill="var(--c1)"/><text x="48" y="260" fill="var(--text)">total 0,39 dtk/halaman ≈ 18× lebih cepat</text>
</g>
<text x="280" y="292" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">latensi indexing per halaman (paper ColPali, tabel B.4 · GPU NVIDIA L4)</text>
</svg>`;

// Recall@1 di ViDoRe: baseline bi-encoder (atas teks hasil parsing) vs ColPali (+late interaction).
// Angka dari paper, tabel 4 (Recall@1): BiPali (+LLM) avg 45,6 vs ColPali (+Late Inter.) avg 72,7.
const FIG_VIDORE = `<svg viewBox="0 0 560 320" role="img" aria-label="Recall@1 ViDoRe: baseline 45,6 vs ColPali 72,7 rata-rata.">
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="280" y="18">Recall@1 · ViDoRe (10 dataset)</text></g>
<g font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">
<text x="120" y="52">ArxivQ</text><text x="120" y="82">DocVQA</text><text x="120" y="112">InfoVQA</text><text x="120" y="142">TabF</text><text x="120" y="172">TAT-DQA</text><text x="120" y="202">Shift</text><text x="120" y="232">AI</text><text x="120" y="262">Energy</text>
</g>
<g font-family="var(--font-ui)">
<rect x="130" y="38" width="177" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="38" width="276" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="68" width="76" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="68" width="174" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="98" width="208" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="98" width="284" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="128" width="241" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="128" width="287" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="158" width="78" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="158" width="202" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="188" width="129" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="188" width="209" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="218" width="224" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="218" width="354" height="14" rx="3" fill="none" stroke="var(--c1)"/>
<rect x="130" y="248" width="171" height="14" rx="3" fill="var(--c4)" opacity="0.55"/><rect x="130" y="248" width="323" height="14" rx="3" fill="none" stroke="var(--c1)"/>
</g>
<g font-size="11" font-family="var(--font-ui)"><rect x="130" y="284" width="12" height="12" fill="var(--c4)" opacity="0.55"/><text x="148" y="294" fill="var(--text-muted)">baseline BiPali (teks)</text><rect x="300" y="284" width="12" height="12" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="318" y="294" fill="var(--text-muted)">ColPali (late interaction)</text></g>
<text x="470" y="294" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">avg 45,6 → 72,7 (+27,1)</text>
</svg>`;

export const aie17: V2Lesson = {
  slug: "aie17-visual-retrieval",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE17 — Visual Retrieval: ColPali & Dokumen Multimodal",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-scan-gagal",
      eyebrow: "Langkah 1 · Cerita",
      title: "RAG Tanpa OCR: retrieval langsung dari gambar dokumen",
      prose: [
        "Februari 2026. Tim data sebuah perusahaan asuransi meluncurkan RAG di atas 1,2 juta halaman dokumen klaim: formulir scan, laporan medis, tabel biaya rumah sakit, grafik tren klaim. Pipeline-nya standar dan rapi: OCR → chunking → embedding → cosine similarity. Demo ke direksi berjalan mulus — sampai seseorang bertanya: 'Berapa total klaim rawat inap Q3 di tabel halaman 214?' RAG menjawab dengan percaya diri: 'Rp4,2 miliar.' Angka yang benar, menurut tabelnya: Rp14,2 miliar. OCR membaca '1' sebagai noise dan membuangnya; chunking memotong tabel jadi dua; embedding tidak pernah melihat grafiknya.",
        "Tim mencoba memperbaiki seperti biasa: OCR yang lebih mahal, chunking yang lebih pintar, reranker yang lebih besar. Recall@5 naik dari 58% ke 63% — lalu mentok. Masalahnya bukan di kualitas tiap komponen, melainkan di ARSITEKTURNYA: mengubah dokumen visual menjadi teks DULU berarti membuang semua yang membuat dokumen itu bermakna — posisi sel di tabel, warna batang grafik, layout formulir. Informasi visual yang hilang di langkah pertama tidak bisa dipulihkan oleh model secanggih apa pun di langkah kelima.",
        "Twist-nya datang dari paper Juli 2024: 'ColPali: Efficient Document Retrieval with Vision Language Models' (Faysse et al. — arXiv 2407.01449). Idenya radikal dan sederhana: JANGAN ubah halaman menjadi teks. Render tiap halaman sebagai GAMBAR, masukkan ke vision-language model (PaliGemma 3B), dan simpan embedding multi-vektor per halaman — satu vektor per patch gambar. Query teks dicocokkan dengan late interaction ala ColBERT: tiap token query mencari patch yang paling mirip, skornya dijumlahkan. Tanpa OCR. Tanpa chunking teks. Hasil di benchmark ViDoRe: Recall@1 rata-rata 72,7 vs 45,6 untuk pipeline teks — selisih 27,1 poin. Indexing per halaman: 0,39 detik vs 7,22 detik pipeline OCR.",
        "📝 Poin inti lesson ini (panel 'Poin penting' merangkum seluruhnya di akhir): (1) pipeline OCR→teks membuang informasi visual yang tidak bisa dipulihkan; (2) ColPali meng-embed halaman sebagai gambar menjadi 1024 vektor patch (multi-vector), query dicocokkan dengan late interaction MaxSim; (3) ViDoRe: +27,1 poin Recall@1 dan indexing ~18× lebih cepat; (4) multi-vector = index besar (±256KB/halaman) — ada harganya; (5) col-retrieval menang di dokumen visual, kalah telak di korpus teks murni dari sisi biaya.",
        "Bekal kilat (agar lesson ini mandiri, 3 kalimat): embedding = vektor angka yang mewakili makna teks; dua vektor yang maknanya mirip menunjuk ke arah yang sama, diukur dengan cosine similarity (1 = identik, 0 = tidak berhubungan). Retrieval klasik menyimpan SATU vektor per dokumen lalu mencari tetangga terdekat dari vektor query. (Di track Deep Learning, dle16 membahas CLIP sebagai MODEL vision-language — lesson ini tidak membahas modelnya, hanya sudut RETRIEVAL: kapan dan mengapa retrieval dari gambar mengalahkan OCR+RAG.)",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa pipeline OCR→teks gagal pada dokumen visual; (2) mendeskripsikan arsitektur ColPali (VLM → patch vectors → proyeksi 128-dim → late interaction); (3) menulis rumus MaxSim dan menghitungnya; (4) membaca hasil benchmark ViDoRe; (5) memutuskan kapan col-retrieval dipakai vs OCR+RAG vs gabungan.",
        "🗺️ Isi lesson (⏱ 65 mnt · 2 lab · 6 kuis · 2 chart · 1 mini-case): Langkah 1 · Cerita — Langkah 2 · Late interaction — Langkah 3 · Anatomi ColPali — Langkah 4 · Benchmark ViDoRe — Langkah 5 · Lab MaxSim — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case asuransi — Langkah 8 · Parsing klasik & OCR — Langkah 9 · Audio STT & TTS — Checkpoint.",
      ],
      tasks: [],
      reference: "Jangan ubah gambar jadi teks dulu — retrieve langsung dari gambarnya.",
    },
    {
      id: "konsep-late-interaction",
      eyebrow: "Langkah 2 · Konsep",
      title: "Late interaction: biarkan token bicara satu per satu",
      prose: [
        "Retrieval klasik (bi-encoder) memampatkan SELURUH dokumen menjadi satu vektor, dan seluruh query menjadi satu vektor, lalu mengukur cosine similarity keduanya. Ini seperti menilai kecocokan dua orang dari SATU angka rata-rata kepribadian — cepat, tapi detailnya hilang. Kalau dokumenmu adalah halaman laporan dengan tabel, grafik, dan tiga paragraf, satu vektor harus 'mengingat' semuanya sekaligus. Ia tidak bisa.",
        "Late interaction (diperkenalkan ColBERT, 2020) menolak pemampatan dini: simpan BANYAK vektor per dokumen — satu per token — dan banyak vektor per query. Interaksinya 'terlambat' (late): baru terjadi saat scoring, bukan saat encoding. Skornya disebut MaxSim: untuk SETIAP token query, cari token dokumen yang PALING mirip (dot product maksimum), lalu jumlahkan semua kemenangan itu. Dokumen yang punya 'jawaban' untuk tiap token query menang — bukan dokumen yang rata-ratanya mirip.",
        "Kepribadiannya: seperti juri lomba masak yang menilai tiap hidangan satu per satu (MaxSim) vs juri yang hanya mencicipi 'rata-rata semua masakan dicampur' (bi-encoder). Yang pertama bisa berkata 'supnya luar biasa meski dessert-nya gagal'; yang kedua hanya tahu 'rasanya lumayan'. Untuk dokumen visual, tiap 'hidangan' = satu patch gambar: sel tabel, batang grafik, judul.",
        "Contoh angka konkret. Query 3 token: q1·d terbaik = 0,9; q2·d terbaik = 0,7; q3·d terbaik = 0,8 → skor MaxSim = 2,4. Dokumen pengecoh yang hanya cocok di q1 (0,95) tetapi gagal di q2 (0,1) dan q3 (0,2) → skor 1,25. Bi-encoder bisa tertipu oleh satu kecocokan kuat yang mendominasi rata-rata; MaxSim menuntut bukti per token. Inilah mengapa MaxSim tahan terhadap 'keyword stuffing' — halaman yang mengulang satu kata sepuluh kali tidak bisa menang atas halaman yang menjawab semua token query.",
        "Cara membaca rumus di bawah: S(q,d) = skor relevansi query q terhadap dokumen d; N_q = jumlah token query; N_d = jumlah token/patch dokumen; q_i, d_j = vektor embedding token ke-i dan patch ke-j; Σ = jumlahkan; max = ambil yang terbesar. Interpretasi: 'untuk tiap kata di pertanyaanmu, temukan bagian halaman yang paling menjawab kata itu, lalu totalkan.' Angka 2,4 vs 1,25 di atas = selisih keyakinan, bukan probabilitas.",
      ],
      formula: String.raw`\mathrm{S}(q,d) = \sum_{i=1}^{N_q} \max_{j=1}^{N_d} \, \mathbf{q}_i \cdot \mathbf{d}_j`,
      formulaNote: "S(q,d) = skor relevansi; N_q = jumlah token query (mis. 16); N_d = jumlah patch halaman (mis. 1024); q_i, d_j = vektor embedding; · = dot product (bukan cosine — vektor dinormalisasi saat training). Contoh: query 3 token dengan max per token 0,9/0,7/0,8 → S = 2,4. Dokumen pengecoh 0,95/0,1/0,2 → S = 1,25. MaxSim menuntut bukti PER token — satu kecocokan kuat tidak bisa menutupi dua kegagalan.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Bi-encoder = 'apakah dokumen ini SECARA KESELURUHAN mirip pertanyaanku?' MaxSim = 'apakah SETIAP KATA di pertanyaanku terjawab oleh suatu bagian halaman ini?' Pertanyaan spesifik ('total klaim Q3 di tabel') butuh jawaban per kata — bukan kesan keseluruhan. Itulah keunggulan struktural late interaction untuk dokumen kompleks.",
      },
      reference: "MaxSim: tiap token query mencari patch terbaiknya, skor dijumlahkan.",
    },
    {
      id: "anatomi-colpali",
      eyebrow: "Langkah 3 · Arsitektur",
      title: "Anatomi ColPali: dari gambar halaman ke 1024 vektor",
      prose: [
        "Arsitektur ColPali, empat tahap. (1) Render: tiap halaman dokumen di-render sebagai gambar (resolusi tinggi — teks kecil harus terbaca oleh vision encoder). (2) Encode: gambar masuk ke PaliGemma 3B (vision-language model: vision encoder SigLIP + language model Gemma); keluarannya = 1024 vektor patch, satu per wilayah gambar — patch yang menutupi sel tabel 'mengandung' makna sel itu, patch grafik 'mengandung' trennya. (3) Proyeksi: tiap vektor diproyeksikan ke 128 dimensi (kecil! untuk hemat storage) dan dilatih dengan contrastive loss ala ColBERT. (4) Query: query TEKS di-encode oleh model yang sama menjadi ~16-32 vektor token, lalu MaxSim melawan 1024 vektor halaman.",
        "Poin yang sering disalahpahami: ColPali TIDAK membaca teks dari gambar seperti OCR. Ia tidak menghasilkan string 'Rp14,2 miliar'. Ia menghasilkan vektor-vektor yang 'tahu' bahwa di wilayah gambar itu ada angka 14,2 miliar dalam konteks tabel klaim Q3 — pengetahuan yang tersimpan sebagai geometri, bukan karakter. Retrieval-nya bekerja pada geometri itu. (Menjawab dari gambar = tugas VLM generatif terpisah; ColPali hanya menemukan HALAMAN yang tepat.)",
        "Matematika index yang jujur: 1024 patch × 128 dimensi × 2 byte (fp16) = 262.144 byte ≈ 256KB per halaman. Untuk 1,2 juta halaman asuransi = ~300GB sebelum kompresi — vs index teks yang mungkin hanya 2-5GB. Paper-nya membahas teknik kompresi untuk ini, dan varian ringan (ColSmol 500M) memangkas biaya. Multi-vector = akurasi dibayar dengan storage. Tidak ada makan siang gratis; yang ada adalah makan siang yang harganya jelas.",
        "Keluarga col-retrieval (agar tidak kaget di lapangan): ColPali (2024, PaliGemma) → ColQwen2 (Qwen2-VL 2B) → ColQwen2.5 → ColSmol-500M (ringan) → varian Nomic dan NVIDIA (nemoretriever-colembed). Polanya sama: VLM + multi-vector + MaxSim. Bedanya di backbone dan efisiensi. Saat membaca leaderboard ViDoRe, bandingkan 'keluarga', bukan hanya satu model.",
        "Cara membaca diagram: dua kolom = dua arsitektur indexing. Kiri: empat tahap berurutan OCR (layout 0,81 + OCR 2,67 + captioning 3,71 + encoding 0,03 = 7,22 detik/halaman). Kanan: satu tahap ColPali (0,39 detik/halaman). Interpretasi: ColPali ~18× lebih cepat BUKAN karena modelnya lebih ringan — melainkan karena ia menghapus tiga tahap preprocessing. Kecepatan adalah efek samping arsitektur, bukan tujuan utamanya.",
      ],
      figure: {
        svg: FIG_PIPELINE,
        alt: "Perbandingan pipeline indexing OCR multi-tahap vs ColPali visual langsung.",
        caption: "Indexing per halaman: pipeline OCR 7,22 dtk vs ColPali 0,39 dtk (paper ColPali, tabel B.4).",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'ColPali = OCR yang lebih pintar.' Bukan. OCR menghasilkan TEKS; ColPali menghasilkan VEKTOR dari gambar dan tidak pernah mengeluarkan satu karakter pun. Konsekuensinya: ColPali tidak bisa dipakai untuk 'tampilkan teks halaman ini' atau sitasi verbatim untuk compliance — untuk itu kamu tetap butuh OCR/parsing di sisi answering. ColPali = mesin pencari halaman, bukan mesin pembaca.",
      },
      reference: "Halaman → gambar → 1024 vektor patch × 128-dim. Query teks → MaxSim. Tanpa OCR.",
    },
    {
      id: "benchmark-vidore",
      eyebrow: "Langkah 4 · Bukti",
      title: "ViDoRe: bukti angka, bukan janji",
      prose: [
        "Bersamaan dengan modelnya, tim ColPali merilis ViDoRe (Visual Document Retrieval Benchmark) — 10 dataset dokumen visual realistis: paper akademik (ArxivQ), dokumen VQA (DocVQA, InfoVQA), tabel (TabF, TAT-DQA), hingga dokumen industri (Shift, AI, Energy, Government, Healthcare). Mengapa benchmark baru penting: benchmark retrieval lama mengukur di atas TEKS bersih — di sanalah pipeline OCR terlihat bagus, karena soalnya tidak pernah menguji informasi yang hilang saat parsing.",
        "Hasil kuncinya (Recall@1, tabel 4 paper): baseline bi-encoder di atas teks hasil parsing (BiPali + LLM) rata-rata 45,6; ColPali dengan late interaction rata-rata 72,7 — selisih 27,1 poin. Lihat di mana selisihnya PALING besar: TAT-DQA (tabel: 20,4 → 53,1, +32,7), Energy (45,0 → 85,0, +40,0), Healthcare (56,0 → 88,0, +32,0). Polanya jelas: semakin visual dan terstruktur dokumennya (tabel, laporan industri), semakin besar keunggulan retrieval dari gambar. Di sinilah OCR paling banyak merusak — dan di sinilah ColPali paling bersinar.",
        "Dua catatan jujur. Pertama, baseline-nya adalah pipeline teks yang WAJAR (bukan yang sengaja dilemahkan) — tim paper juga menguji agar hasilnya tidak 'terdongkrak' secara tidak adil. Kedua, NDCG@5 (peringkat, bukan hanya top-1) menunjukkan pola yang sama: ColPali (Best) rata-rata 81,3. Angka-angka ini BUKAN berarti 'ColPali selalu menang' — melainkan 'di dokumen visual, selisihnya sebesar ini'.",
        "Cara membaca chart: tiap baris = satu dataset; batang penuh = skor baseline (teks), bingkai = skor ColPali. Interpretasi: bingkai selalu lebih panjang — tetapi PERHATIKAN panjang selisihnya: di DocVQA selisihnya sedang (20,0 → 45,6), di Energy selisihnya raksasa (45,0 → 85,0). Selisih = 'pajak visual' yang kamu bayar bila tetap memakai pipeline teks di dataset itu. Pajak terbesar ada di dokumen industri bertabel — tepat jenis dokumen asuransi di cerita pembuka.",
      ],
      figure: {
        svg: FIG_VIDORE,
        alt: "Recall@1 ViDoRe: baseline bi-encoder teks vs ColPali dengan late interaction.",
        caption: "Recall@1 rata-rata: 45,6 (baseline teks) → 72,7 (ColPali), +27,1 poin (arXiv 2407.01449).",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "ViDoRe mengukur apa yang benchmark lama tidak ukur: informasi yang HILANG saat dokumen diubah jadi teks. Pipeline OCR tidak 'bodoh' — ia hanya buta terhadap apa yang ia buang. Benchmark yang tepat = cermin yang jujur; benchmark teks untuk dokumen visual = cermin yang menyanjung.",
      },
      reference: "ViDoRe: +27,1 poin Recall@1; keunggulan terbesar di tabel & dokumen industri.",
    },
    {
      id: "lab-maxsim",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: MaxSim mengalahkan rata-rata",
      prose: [
        "SIMULASI — dua halaman, satu query 6 token ('pendapatan Q3 tabel grafik laba bersih'). Halaman A (BENAR): teks + patch tabel + patch grafik. Halaman B (PENGECOH): teks 'pendapatan/laba/bersih' berulang-ulang tanpa bukti visual — keyword stuffing versi dokumen. Vektor 3-dimensi tiruan mensimulasikan ruang embedding.",
        "Tugasmu: implementasikan `maxsim` (tiap token query → dot maksimum ke semua patch → jumlahkan) dan `baseline` (rata-rata semua vektor query vs rata-rata semua vektor halaman → cosine). Prediksi dulu SEBELUM run: menurutmu mana yang menang di tiap metode? Tulis prediksimu di komentar — lab ini tentang menguji intuisi, bukan sekadar dapat angka hijau.",
        "Cara membaca output: `maxsim_A/B` = skor late interaction; `baseline_A/B` = skor single-vector; `winner_*` = pemenangnya; `margin` = selisih keyakinan MaxSim. Interpretasi yang diharapkan: baseline (rata-rata) memilih B — pengecoh menang karena pengulangan kata mendominasi rata-rata; MaxSim memilih A dengan margin 1,35 — karena token 'tabel' dan 'grafik' menemukan bukti visual HANYA di A. Inilah mekanisme kemenangan ColPali dalam bentuk paling telanjang.",
        "Coba eksplorasi: (1) hapus token 'tabel'/'grafik' dari Q — apakah MaxSim masih memilih A? (2) tambah 4 patch teks ke B — seberapa jauh margin menyusut? (3) ganti baseline menjadi max-pooling, bukan mean — apa yang berubah? Pertanyaan refleksi: di korpus teks MURNI tanpa visual, apakah MaxSim masih seberharga ini? (Petunjuk: lihat langkah 6.)",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `maxsim(q_vecs, page_vecs)`: untuk tiap token query, dot maksimum ke semua patch, lalu jumlahkan" },
        { id: "t2", text: "Implementasikan `baseline(q_vecs, page_vecs)`: rata-rata vektor query & halaman, kembalikan cosine similarity" },
        { id: "t3", text: "Jalankan, bandingkan winner_maxsim vs winner_baseline, catat margin" },
      ],
      expected: "winner_maxsim: A (halaman benar) · winner_baseline: B (pengecoh menang) · margin: 1.35",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Lab ini membuktikan MaxSim selalu lebih baik dari single-vector.' Tidak. Vektor 3-dimensi di sini hanya ilustrasi MEKANISME — bukti keunggulan yang sebenarnya ada di ViDoRe (langkah 4): +27,1 poin Recall@1 di dokumen visual. Di korpus teks bersih, bi-encoder modern sering setara dengan biaya jauh lebih murah. Lab = intuisi, benchmark = bukti, dompet = penentu.",
      },
      hints: [
        "dot(a, b) dan mean() sudah disediakan — pakai langsung",
        "maxsim: sum(max(dot(q, p) for p in page_vecs) for q in q_vecs)",
        "baseline: cosine(mean(q_vecs), mean(page_vecs))",
      ],
      code: {
        starter: `# SEED — jangan ubah
Q = [  # 6 token query: "pendapatan Q3 tabel grafik laba bersih"
    [1.0, 0.1, 0.0],
    [0.9, 0.2, 0.1],
    [0.2, 0.9, 0.1],
    [0.1, 1.0, 0.0],
    [1.0, 0.0, 0.1],
    [0.95, 0.1, 0.0],
]
PAGE_A = [  # halaman BENAR: teks + tabel + grafik
    [1.0, 0.0, 0.0],
    [0.0, 0.9, 0.2],
    [0.1, 0.8, 0.3],
    [0.2, 0.1, 0.9],
]
PAGE_B = [  # halaman PENGECOH: teks berulang, tanpa bukti visual
    [1.0, 0.0, 0.0],
    [0.95, 0.05, 0.0],
    [0.9, 0.02, 0.05],
    [0.85, 0.02, 0.05],
]

def dot(a, b):
    return sum(x*y for x, y in zip(a, b))

def mean(vecs):
    return [sum(c)/len(vecs) for c in zip(*vecs)]

def cosine(a, b):
    na = sum(x*x for x in a) ** 0.5
    nb = sum(x*x for x in b) ** 0.5
    return dot(a, b)/(na*nb)

# TULIS KODEMU (di bawah garis ini)
def maxsim(q_vecs, page_vecs):
    # TODO t1: tiap token query -> dot maksimum ke semua patch -> jumlahkan
    return 0.0

def baseline(q_vecs, page_vecs):
    # TODO t2: cosine(mean(query), mean(halaman))
    return 0.0

# UJI (jangan ubah)
sA, sB = maxsim(Q, PAGE_A), maxsim(Q, PAGE_B)
bA, bB = baseline(Q, PAGE_A), baseline(Q, PAGE_B)
print("maxsim_A:", round(sA, 4), "maxsim_B:", round(sB, 4))
print("winner_maxsim:", "A" if sA > sB else "B")
print("baseline_A:", round(bA, 4), "baseline_B:", round(bB, 4))
print("winner_baseline:", "A" if bA > bB else "B")
print("margin:", round(sA - sB, 4))`,
        lockLines: 33,
        solution: `# SEED — jangan ubah
Q = [  # 6 token query: "pendapatan Q3 tabel grafik laba bersih"
    [1.0, 0.1, 0.0],
    [0.9, 0.2, 0.1],
    [0.2, 0.9, 0.1],
    [0.1, 1.0, 0.0],
    [1.0, 0.0, 0.1],
    [0.95, 0.1, 0.0],
]
PAGE_A = [  # halaman BENAR: teks + tabel + grafik
    [1.0, 0.0, 0.0],
    [0.0, 0.9, 0.2],
    [0.1, 0.8, 0.3],
    [0.2, 0.1, 0.9],
]
PAGE_B = [  # halaman PENGECOH: teks berulang, tanpa bukti visual
    [1.0, 0.0, 0.0],
    [0.95, 0.05, 0.0],
    [0.9, 0.02, 0.05],
    [0.85, 0.02, 0.05],
]

def dot(a, b):
    return sum(x*y for x, y in zip(a, b))

def mean(vecs):
    return [sum(c)/len(vecs) for c in zip(*vecs)]

def cosine(a, b):
    na = sum(x*x for x in a) ** 0.5
    nb = sum(x*x for x in b) ** 0.5
    return dot(a, b)/(na*nb)

# TULIS KODEMU (di bawah garis ini)
def maxsim(q_vecs, page_vecs):
    return sum(max(dot(q, p) for p in page_vecs) for q in q_vecs)

def baseline(q_vecs, page_vecs):
    return cosine(mean(q_vecs), mean(page_vecs))

# UJI (jangan ubah)
sA, sB = maxsim(Q, PAGE_A), maxsim(Q, PAGE_B)
bA, bB = baseline(Q, PAGE_A), baseline(Q, PAGE_B)
print("maxsim_A:", round(sA, 4), "maxsim_B:", round(sB, 4))
print("winner_maxsim:", "A" if sA > sB else "B")
print("baseline_A:", round(bA, 4), "baseline_B:", round(bB, 4))
print("winner_baseline:", "A" if bA > bB else "B")
print("margin:", round(sA - sB, 4))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "maxsim_A: 5\\.58 maxsim_B: 4\\.23", label: "Skor MaxSim terhitung benar", msg: "A=5,58 vs B=4,23 — bukti per token terakumulasi." },
          { kind: "stdout_matches", task: "t3", pattern: "winner_maxsim: A", label: "MaxSim memilih halaman benar (A)", msg: "Token 'tabel'/'grafik' menemukan bukti visual hanya di A." },
          { kind: "stdout_matches", task: "t3", pattern: "winner_baseline: B", label: "Baseline rata-rata tertipu pengecoh (B)", msg: "Pengulangan kata mendominasi rata-rata — kelemahan single-vector." },
          { kind: "stdout_matches", task: "t3", pattern: "margin: 1\\.35", label: "Margin MaxSim 1,35", msg: "Kemenangan meyakinkan, bukan kebetulan." },
        ],
      },
      reference: "MaxSim menuntut bukti per token; rata-rata bisa ditipu pengulangan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: kapan col-retrieval menang?",
      prose: [
        "Skenario 1 — korpus dominan visual (scan, PDF laporan, slide, formulir, screenshot): → col-retrieval (ColPali/ColQwen2). Ini habitat aslinya; ViDoRe membuktikan +27,1 poin. OCR di sini = pajak 27 poin yang kamu bayar tiap query.",
        "Skenario 2 — korpus teks bersih (Wikipedia, dokumentasi, ebook): → TETAP dense text + hybrid (aie13/aie14). Col-retrieval tidak menambah sinyal — hanya menambah 256KB/halaman dan GPU inference. Kemenangan termahal adalah kemenangan yang tidak dibutuhkan.",
        "Skenario 3 — korpus campuran (mis. Confluence + PDF laporan): → DUAL pipeline. Route per dokumen: halaman visual → index ColPali; teks bersih → index teks; gabungkan dengan RRF (pelajaran dari aie13). Jangan paksa satu arsitektur untuk dua dunia.",
        "Skenario 4 — butuh sitasi verbatim / compliance (audit, regulasi): → col-retrieval untuk TEMU halaman + OCR/parsing untuk KUTIP teks. ColPali menemukan 'halaman 214'; OCR membacakan angkanya untuk sitasi. Retrieve visual, cite textual.",
        "Skenario 5 — budget ketat (index > 10 juta halaman, latensi < 200ms): → pertimbangkan varian ringan (ColSmol-500M), kompresi token (pooling), atau single-vector visual (BiPali/SigLIP) sebagai pre-filter + MaxSim hanya untuk rerank top-50. Pola 'murah dulu, mahal kemudian' berlaku juga di sini.",
        "Aturan praktis 10 detik: (1) >30% dokumenmu visual? Evaluasi col-retrieval. (2) Butuh teks verbatim? OCR tetap wajib di sisi answering. (3) Hitung storage DULU: halaman × 256KB — kejutan 300GB di tengah proyek itu menyakitkan. (4) Selalu bandingkan dengan baseline teks di benchmark-mu sendiri — angka paper = undangan, bukan jaminan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pilih retrieval seperti memilih kacamata: untuk dokumen visual, ColPali = kacamata yang akhirnya fokus; untuk teks bersih, ia = kacamata hitam di dalam ruangan — menggelapkan tanpa menambah jelas. Sifat korpus menentukan alatnya, bukan tren papernya.",
      },
      reference: "Visual → col-retrieval. Teks bersih → dense biasa. Campuran → dual + RRF.",
    },
    {
      id: "minicase-asuransi",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 1,2 juta halaman klaim asuransi",
      prose: [
        "Situasi: perusahaan asuransi, 1,2 juta halaman dokumen klaim (formulir scan, tabel biaya RS, grafik tren). Baseline OCR+RAG: recall@5 = 58% → 42% query (504rb/hari dari 1,2 juta query) tidak menemukan halaman yang benar; analis menghabiskan 15 menit/query untuk verifikasi manual = 126rb jam/hari — mustahil, jadi mereka hanya verifikasi sampel dan sisanya 'percaya'.",
        "Pilot col-retrieval (angka ilustrasi berbasis pola ViDoRe): 100rb halaman paling visual di-index ColPali. Recall@5 di segmen itu: 58% → 81% (+23 poin). Storage: 100rb × 256KB = 25,6GB (vs index teks 400MB — 64× lipat, tetapi di SSD 1TB = 2,5% kapasitas). Indexing: 100rb × 0,39 dtk = 10,8 jam GPU (vs 7,22 dtk × 100rb = 200 jam pipeline OCR — 8,3 hari).",
        "Keputusan arsitekturnya (pembahasan): TIDAK mengganti total. Dual pipeline: 100rb halaman visual → ColPali; 1,1 juta halaman teks → dense biasa; RRF menggabungkan. Alasannya: (a) 92% korpus adalah teks bersih — ColPali di sana = biaya tanpa hasil; (b) compliance butuh sitasi verbatim → OCR tetap jalan di sisi answering untuk halaman terpilih; (c) storage 25,6GB terkendali, 300GB untuk semua halaman tidak. Pelajaran desainnya: col-retrieval adalah SENJATA PRESISI untuk segmen visual, bukan pengganti artileri teks.",
        "Konversi ke rupiah (pembahasan lanjutan): verifikasi manual 15 menit/query × Rp50rb/jam analis = Rp12.500/query yang gagal. Pengurangan gagal 23% × 504rb query/hari × Rp12.500 = Rp1,45 miliar/hari potensi hemat — angka yang membuat direksi berhenti bertanya 'kenapa GPU mahal' dan mulai bertanya 'kapan selesai'. Persentase menipu; rupiah jujur — sama seperti lesson aie14.",
      ],
      tasks: [],
      reference: "Col-retrieval = senjata presisi untuk segmen visual, bukan pengganti pipeline teks.",
    },
    {
      id: "parsing-ocr-klasik",
      eyebrow: "Langkah 8 · Parsing klasik",
      title: "Parsing dokumen klasik & OCR: sebelum multimodal",
      prose: [
        "Kembali ke perusahaan asuransi di cerita pembuka — tapi ke 80% korpusnya yang MEMBOSANKAN: faktur digital-born, polis PDF yang diunduh dari sistem, laporan yang di-generate komputer. Untuk dokumen seperti ini, mengirim semuanya ke ColPali = memakai meriam untuk membunuh lalat: mahal, lambat, dan tidak menambah apa-apa. Di sinilah pipeline KLASIK masih raja — murah, cepat, dan untuk dokumen rapi, akurat.",
        "Triase pertama bukan soal model, melainkan soal jenis file: PDF digital-born punya LAPISAN TEKS tertanam — ekstraksi = gratis, instan, dan persis 100% (tidak ada yang 'dibaca', teksnya memang ada di file). Hasil scan/foto = sekumpulan piksel — tidak ada teks sama sekali sampai OCR bekerja. Aturan praktis: cek dulu apakah halaman punya text layer; bila ya, jangan sentuh OCR. Banyak pipeline produksi gagal di sini — mereka OCR semuanya, termasuk file yang teksnya sudah tersedia.",
        "Pipeline OCR klasik, tiga tahap: (1) preprocessing — deskew (meluruskan halaman miring), denoise, binarisasi, penajaman kontras; dokumen scan miring 3 derajat tanpa deskew bisa menurunkan akurasi 10+ poin; (2) engine — Tesseract dan sejenisnya: deteksi baris → segmentasi karakter → pengenalan → language model menebak kata yang masuk akal; (3) post-correction — kamus, regex format (tanggal, NPWP, nomor polis), aturan domain. Tiap tahap punya error rate sendiri, dan kesalahan BERANTAI: preprocessing buruk → engine menebak → post-correction 'memperbaiki' menjadi kata yang salah tapi masuk akal.",
        "Tabel adalah kuburan OCR teks polos. Menarik teks dari tabel menghancurkan struktur baris-kolom: angka '14,2' di baris TOTAL vs baris SUBTOTAL menjadi tidak bisa dibedakan, sel gabungan (merged cells) membuat kolom bergeser. Parser tabel khusus (pendekatan Camelot/Tabula: membaca garis grid atau whitespace alignment) memulihkan strukturnya — tetapi butuh garis yang bersih; tabel tanpa garis batas tetap menjadi tebakan. Pelajaran desainnya: ekstraksi tabel = masalah STRUKTUR, bukan masalah pengenalan huruf.",
        "OCR memberi confidence per kata — dan di sinilah jebakan terbesarnya: confidence itu soal BENTUK HURUF, bukan kebenaran isi. '1' yang dibaca sebagai '7' bisa punya confidence 0,98 — mesinnya yakin pada bentuknya, padahal isinya salah. Karena itu field kritis (angka uang, tanggal, nomor rekening, nama) WAJIB divalidasi di luar OCR: checksum, aturan format, konsistensi antar-field (total = subtotal + pajak), dan review manusia di atas ambang risiko. Satu digit salah di field uang = bencana; OCR tidak tahu mana digit yang 'penting'.",
        "💡 Intuisi: OCR klasik = buruh yang rajin tapi buta makna — ia membaca HURUF, bukan dokumen. Kekuatannya: kecepatan dan biaya untuk dokumen rapi bervolume (ribuan faktur per jam di CPU biasa). Kelemahannya: ia tidak tahu kapan ia salah, dan kesalahannya menumpuk tepat di angka dan nama. Keputusan arsitekturnya: dokumen rapi digital-born → ekstraksi teks langsung; scan rapi bervolume → OCR klasik + validasi field kritis; tabel kompleks/scan rusak/handwriting → parsing terstruktur atau multimodal seperti ColPali. Tiga rute, bukan satu.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 3 perbedaan PDF digital-born vs hasil scan yang menentukan pilihan pipeline" },
        { id: "t2", text: "Jelaskan mengapa ekstraksi tabel membutuhkan lebih dari sekadar OCR teks polos" },
        { id: "t3", text: "Tentukan rute untuk: (a) 500rb faktur digital-born rapi, (b) 20rb formulir scan miring bertabel — OCR klasik, ColPali, atau gabungan? Beri alasan" },
      ],
      expected: "(a) Ekstraksi teks langsung — teksnya sudah ada, OCR = biaya sia-sia. (b) Gabungan: OCR klasik + parser tabel terstruktur untuk yang rapi; segmen yang rusak/miring parah di-route ke pipeline visual.",
      note: {
        title: "🚨 Mitos: OCR modern 99% akurat, jadi cukup untuk semua dokumen",
        type: "pitfall",
        body: "Yang benar: 99% itu akurasi per KARAKTER pada dokumen bersih. Satu halaman 2.000 karakter → ~20 kesalahan per halaman. Dan kesalahan tidak tersebar acak: ia menumpuk di angka, tanggal, dan nama asing — tepat field yang paling kritis. OCR juga tidak tahu kapan ia salah: confidence 0,98 pada '7' yang seharusnya '1' tetap angka yang salah. Akurasi karakter ≠ akurasi dokumen ≠ akurasi field kritis.",
      },
      reference: "OCR klasik = cepat & murah untuk dokumen rapi bervolume; tabel/scan rusak = butuh parsing terstruktur atau multimodal.",
    },
    {
      id: "audio-stt-tts",
      eyebrow: "Langkah 9 · Audio",
      title: "Audio untuk aplikasi AI: STT & TTS",
      prose: [
        "Dokumen bukan satu-satunya 'teks yang belum jadi teks'. Call center sebuah bank menghasilkan 10.000 jam rekaman per bulan; regulasi mewajibkan setiap persetujuan nasabah bisa ditemukan kembali. Mendengarkan manual = mustahil; solusinya = speech-to-text (STT): mengubah audio menjadi transkrip yang bisa di-search, dirangkum LLM, dan diaudit. Aplikasi suara adalah RAG yang inputnya gelombang suara.",
        "Cara menilai STT: Word Error Rate (WER) — fraksi kata yang salah, dihitung dari tiga jenis kesalahan terhadap transkrip referensi: S = substitusi (kata diganti, 'daya'→'saya'), D = deletion/penghapusan (kata hilang, 'rupiah' tak terdengar), I = insertion/penyisipan (kata tambahan, 'sekarang' yang tak diucapkan). Rumusnya di bawah. Interpretasi: WER 12,5% = 1 dari 8 kata salah. Manusia mencapai ~5% pada audio bersih; realitas call center (noise, aksen, istilah domain) = 15–30%. WER BISA melebihi 100% bila penyisipan banyak — ini rasio kesalahan, bukan probabilitas.",
        "Transkrip tanpa 'siapa bicara' = setengah berguna. Diarization memisahkan pembicara ('agen:' vs 'nasabah:') — tanpanya, kalimat 'ya, saya setuju' tidak bisa diatribusikan ke siapa pun dan tidak sah sebagai bukti persetujuan. Tiga musuh STT di Indonesia: noise latar (jalan, warung), aksen daerah & code-switching, dan istilah domain ('rekening', 'asuransi', nama produk bank) yang tidak ada di model umum — solusinya adaptasi kosakata, bukan model yang lebih besar.",
        "Arah sebaliknya: text-to-speech (TTS) — suara otomatis untuk aksesibilitas (nasabah tunanetra), notifikasi IVR ('pembayaran Anda jatuh tempo besok'), dan asisten suara. Dimensi kualitasnya: intelligibility (bisa dipahami), naturalness (tidak seperti robot 2005), dan latensi. Trade-off-nya jujur: TTS neural terdengar manusiawi tetapi butuh GPU; TTS klasik murah tetapi terdengar seperti mesin — pilih sesuai konteks (pengumuman darurat vs brand voice).",
        "💡 Intuisi: WER mengukur KATA, bukan MAKNA. 'BCA' menjadi 'bri' hanyalah 1 substitusi dari 8 kata (WER 12,5% — terlihat kecil), tetapi mengubah TUJUAN transfer — makna hancur total. Sebaliknya 'saya akan transfer' menjadi 'aku mau transfer' = 3 substitusi (WER 37,5%) tetapi maknanya utuh. Inilah mengapa field kritis (bank tujuan, nominal, tanggal) tidak pernah dinilai dengan WER mentah: mereka butuh validasi terpisah, sama seperti angka OCR di langkah 8. Metrik yang buta makna menuntut pendamping yang melek makna.",
        "Arsitektur aplikasi suara = rantai tiga hop: STT → LLM → TTS, dan latensi BERANTAI (tiap hop menambah; solusinya streaming/interim result). Evaluasinya berlapis: WER untuk STT, uji dengar manusia (skor MOS) untuk TTS, dan task success end-to-end ('apakah nasabah menyelesaikan tujuannya?'). Risikonya nyata: rekaman = data pribadi sensitif (consent, batas retensi, kontrol akses), dan kloning suara membuka penyalahgunaan (telepon 'darurat' palsu) — verifikasi identitas tidak boleh mengandalkan suara saja.",
      ],
      formula: String.raw`\mathrm{WER} = \frac{S + D + I}{N}`,
      formulaNote: "WER = word error rate (fraksi kata salah); S = substitusi (kata diganti); D = deletion, kata referensi yang hilang di hipotesis; I = insertion, kata tambahan di hipotesis; N = jumlah kata di referensi (bukan hipotesis). Contoh dari lab: kasus-1 → (0+1+0)/8 = 12,5%; kasus-3 → (0+0+1)/2 = 50,0%. WER bisa > 100% bila penyisipan banyak — bukan probabilitas, melainkan rasio kesalahan.",
      tasks: [
        { id: "t1", text: "Implementasikan `wer_detail(ref, hyp)`: edit distance per KATA (Levenshtein) + traceback, kembalikan `[S, D, I, N]`" },
        { id: "t2", text: "Jalankan ketiga kasus, catat S/D/I dan WER masing-masing" },
        { id: "t3", text: "Jawab: pada kasus mana WER paling menipu (skor terlihat kecil tapi makna berubah fatal)? Mengapa?" },
      ],
      expected: "kasus-1: 12.5% (D=1, kata 'rupiah' hilang) · kasus-2: 25.0% (S=1, daya→saya) · kasus-3: 50.0% (I=1, 'sekarang' tambahan). Paling menipu: kasus-2 — satu kata berubah ('daya'→'saya') tetapi bila itu nama bank tujuan, transaksinya salah alamat.",
      note: {
        title: "🚨 Mitos: WER 5% berarti transkripsi bisa dipakai apa adanya",
        type: "pitfall",
        body: "Yang benar: kesalahan STT menumpuk di nama, angka, dan istilah asing — tepat field yang paling kritis. WER 5% pada 1.000 kata = 50 kata salah, dan 50 itu bukan kata acak: ia adalah nama nasabah, nominal, dan tanggal. Untuk field kritis, WER mentah tidak cukup — butuh skor confidence per kata + aturan format + review manusia, persis seperti validasi angka OCR.",
      },
      hints: [
        "Levenshtein per kata: dp[i][j] = min(hapus, sisip, ganti) — sama seperti edit distance karakter, unitnya kata",
        "Traceback dari (n, m): cocok -> mundur diagonal; dp[i][j]==dp[i-1][j]+1 -> penghapusan; ==dp[i][j-1]+1 -> penyisipan; selain itu substitusi",
        "Kembalikan [s, d, ins, n] sebagai list (bukan tuple) agar cocok dengan check",
      ],
      code: {
        starter: `# SEED — jangan ubah: 3 pasangan (referensi, hipotesis) dari transkripsi STT
REF1 = "saya transfer lima juta rupiah ke rekening bca"
HYP1 = "saya transfer lima juta ke rekening bca"
REF2 = "aktifkan mode hemat daya"
HYP2 = "aktifkan mode hemat saya"
REF3 = "buka aplikasi"
HYP3 = "buka aplikasi sekarang"

# TULIS KODEMU (di bawah garis ini)
def wer_detail(ref, hyp):
    # TODO t1: edit distance per KATA (Levenshtein) + traceback
    # kembalikan [S, D, I, N]: substitusi, penghapusan, penyisipan, jumlah kata referensi
    # urutan traceback: cocok -> penghapusan -> penyisipan -> substitusi
    return [0, 0, 0, 0]

# UJI (jangan ubah)
w1 = wer_detail(REF1, HYP1)
w2 = wer_detail(REF2, HYP2)
w3 = wer_detail(REF3, HYP3)
for nama, w in [("kasus-1", w1), ("kasus-2", w2), ("kasus-3", w3)]:
    s, d, ins, n = w
    print(f"{nama}: S={s} D={d} I={ins} N={n} -> WER={(s+d+ins)/n:.1%}")`,
        lockLines: 9,
        solution: `# SEED — jangan ubah: 3 pasangan (referensi, hipotesis) dari transkripsi STT
REF1 = "saya transfer lima juta rupiah ke rekening bca"
HYP1 = "saya transfer lima juta ke rekening bca"
REF2 = "aktifkan mode hemat daya"
HYP2 = "aktifkan mode hemat saya"
REF3 = "buka aplikasi"
HYP3 = "buka aplikasi sekarang"

# TULIS KODEMU (di bawah garis ini)
def wer_detail(ref, hyp):
    r, h = ref.split(), hyp.split()
    n, m = len(r), len(h)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        dp[i][0] = i
    for j in range(1, m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if r[i - 1] == h[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    i, j = n, m
    s = d = ins = 0
    while i > 0 or j > 0:
        if i > 0 and j > 0 and r[i - 1] == h[j - 1] and dp[i][j] == dp[i - 1][j - 1]:
            i -= 1; j -= 1
        elif i > 0 and dp[i][j] == dp[i - 1][j] + 1:
            d += 1; i -= 1
        elif j > 0 and dp[i][j] == dp[i][j - 1] + 1:
            ins += 1; j -= 1
        else:
            s += 1; i -= 1; j -= 1
    return [s, d, ins, n]

# UJI (jangan ubah)
w1 = wer_detail(REF1, HYP1)
w2 = wer_detail(REF2, HYP2)
w3 = wer_detail(REF3, HYP3)
for nama, w in [("kasus-1", w1), ("kasus-2", w2), ("kasus-3", w3)]:
    s, d, ins, n = w
    print(f"{nama}: S={s} D={d} I={ins} N={n} -> WER={(s+d+ins)/n:.1%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "wer_detail", label: "Fungsi wer_detail terdefinisi", msg: "Definisikan fungsi wer_detail(ref, hyp) di bawah garis TULIS KODEMU." },
          { kind: "equal", task: "t2", name: "w1", value: [0, 1, 0, 8], label: "Kasus 1: 1 penghapusan ('rupiah' hilang)", msg: "w1 harus [S=0, D=1, I=0, N=8] — hipotesis kehilangan kata 'rupiah'." },
          { kind: "equal", task: "t2", name: "w2", value: [1, 0, 0, 4], label: "Kasus 2: 1 substitusi (daya → saya)", msg: "w2 harus [S=1, D=0, I=0, N=4] — 'daya' diganti 'saya'." },
          { kind: "equal", task: "t2", name: "w3", value: [0, 0, 1, 2], label: "Kasus 3: 1 penyisipan ('sekarang' tambahan)", msg: "w3 harus [S=0, D=0, I=1, N=2] — hipotesis menambah kata 'sekarang'." },
          { kind: "stdout_matches", task: "t2", pattern: "kasus-1: S=0 D=1 I=0 N=8 -> WER=12\\.5%", label: "WER kasus-1 = 12,5%", msg: "Output harus memuat WER=12.5% untuk kasus-1." },
          { kind: "stdout_matches", task: "t2", pattern: "kasus-3: S=0 D=0 I=1 N=2 -> WER=50\\.0%", label: "WER kasus-3 = 50,0%", msg: "Output harus memuat WER=50.0% untuk kasus-3." },
        ],
      },
      reference: "Suara = STT → LLM → TTS; WER mengukur kata bukan makna — field kritis tetap divalidasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan dari semua langkah. Setiap opsi menjelaskan alasan benar/salahnya.",
      ],
      tasks: [],
      summary: [
        "Pipeline OCR→teks membuang informasi visual (layout tabel, grafik) yang tidak bisa dipulihkan — di sinilah RAG visual gagal secara struktural.",
        "ColPali: halaman di-render sebagai gambar → PaliGemma menghasilkan 1024 vektor patch (proyeksi 128-dim) → query teks dicocokkan dengan late interaction MaxSim. Tanpa OCR.",
        "MaxSim: S(q,d) = Σ max dot per token query — menuntut bukti PER token, tahan terhadap keyword stuffing yang menipu single-vector.",
        "ViDoRe: Recall@1 rata-rata 45,6 → 72,7 (+27,1 poin); indexing 7,22 → 0,39 dtk/halaman (~18×). Keunggulan terbesar di tabel & dokumen industri.",
        "Harga multi-vector: ±256KB/halaman (~300GB per 1,2 juta halaman) — akurasi dibayar dengan storage.",
        "Peta keputusan: visual → col-retrieval; teks bersih → dense biasa; campuran → dual + RRF; butuh sitasi verbatim → OCR tetap di sisi answering.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Mengapa pipeline OCR→teks gagal secara STRUKTURAL pada dokumen visual (bukan sekadar 'OCR-nya kurang bagus')?",
          options: [
            { text: "Informasi visual (posisi sel tabel, bentuk grafik) dibuang di langkah pertama dan tidak bisa dipulihkan langkah berikutnya", why: "Tepat: ini kegagalan arsitektur, bukan kualitas komponen. OCR sempurna pun tetap membuang layout.", correct: true },
            { text: "OCR terlalu lambat sehingga timeout", why: "Lambat iya (7,22 dtk), tapi itu masalah biaya — bukan sebab struktural kegagalan akurasi.", correct: false },
            { text: "Embedding model tidak cukup besar", why: "Model lebih besar tidak mengembalikan informasi yang sudah dibuang di parsing.", correct: false },
            { text: "Chunking memotong kalimat di tengah", why: "Itu masalah nyata tapi sekunder; masalah primernya = konversi gambar→teks itu sendiri.", correct: false },
          ],
        },
        {
          q: "Apa peran 'late interaction' (MaxSim) dalam ColPali?",
          options: [
            { text: "Tiap token query mencari patch halaman yang paling mirip; skor = jumlah semua kecocokan terbaik", why: "Tepat: S(q,d) = Σ max dot — interaksi 'terlambat' terjadi saat scoring, bukan encoding.", correct: true },
            { text: "Query dan halaman di-encode bersama dalam satu forward pass", why: "Itu cross-encoder (mahal, tidak bisa pre-index). ColPali memisahkan encoding.", correct: false },
            { text: "Menunda retrieval sampai user mengklik hasil", why: "'Late' merujuk pada interaksi vektor, bukan interaksi user.", correct: false },
            { text: "Melatih model setelah indexing selesai", why: "Training terjadi sebelum indexing; late interaction = mekanisme scoring.", correct: false },
          ],
        },
        {
          q: "Halaman B mengulang kata 'pendapatan' 10× tanpa tabel. Mengapa MaxSim (lab) tetap memilih halaman A yang hanya menyebutnya 2×?",
          options: [
            { text: "Karena tiap token query butuh bukti sendiri — token 'tabel'/'grafik' tidak menemukan kecocokan di B", why: "Tepat: MaxSim menuntut bukti per token; pengulangan satu kata tidak menutupi kegagalan token lain.", correct: true },
            { text: "Karena MaxSim menghukum dokumen yang panjang", why: "MaxSim tidak punya penalti panjang eksplisit; ia kalah karena token tak terjawab.", correct: false },
            { text: "Karena halaman A punya lebih banyak patch", why: "Kedua halaman punya 4 patch; jumlah patch sama.", correct: false },
            { text: "Karena cosine similarity selalu memilih yang pendek", why: "MaxSim memakai dot product per token, bukan cosine global — dan alasannya bukan panjang.", correct: false },
          ],
        },
        {
          q: "Di dataset ViDoRe mana keunggulan ColPali atas baseline teks PALING besar, dan apa artinya?",
          options: [
            { text: "TAT-DQA/Energy/Healthcare (tabel & laporan industri) — di sanalah OCR paling banyak merusak informasi", why: "Tepat: TAT-DQA +32,7; Energy +40,0; Healthcare +32,0 poin Recall@1. Pajak visual terbesar di dokumen terstruktur.", correct: true },
            { text: "ArxivQ — karena paper akademik paling sulit", why: "ArxivQ selisihnya +26,0 — besar tapi bukan yang terbesar.", correct: false },
            { text: "DocVQA — karena pertanyaannya paling banyak", why: "Banyak soal ≠ selisih terbesar; DocVQA +25,6.", correct: false },
            { text: "Semua dataset sama besarnya", why: "Salah: selisih bervariasi 12,1–40,0 poin — variasinya justru informatif.", correct: false },
          ],
        },
        {
          q: "Berapa perkiraan storage index ColPali untuk 1,2 juta halaman, dan dari mana angkanya?",
          options: [
            { text: "~300GB: 1024 patch × 128 dim × 2 byte (fp16) ≈ 256KB per halaman", why: "Tepat: 1,2jt × 256KB = 307GB. Inilah 'harga' multi-vector yang harus dihitung dulu.", correct: true },
            { text: "~5GB: sama seperti index teks biasa", why: "Itu index single-vector teks. Multi-vector 1024× lipat lebih besar.", correct: false },
            { text: "~1TB: karena gambar halaman disimpan juga", why: "Yang disimpan = vektor patch, bukan gambarnya; 256KB/halaman sudah mencakup itu.", correct: false },
            { text: "Tidak bisa diperkirakan tanpa menjalankan modelnya", why: "Bisa: dimensinya arsitektural (1024 × 128), bukan hasil empiris.", correct: false },
          ],
        },
        {
          q: "Tim compliance butuh sitasi angka VERBATIM dari tabel ('Rp14,2 miliar'). Arsitektur apa yang tepat?",
          options: [
            { text: "ColPali untuk menemukan halaman + OCR/parsing untuk mengutip teksnya", why: "Tepat: retrieve visual, cite textual. ColPali tidak mengeluarkan karakter.", correct: true },
            { text: "ColPali saja — ia sudah 'membaca' angkanya", why: "Salah: ColPali menyimpan geometri makna, bukan string. Tidak bisa sitasi verbatim.", correct: false },
            { text: "OCR saja — ColPali tidak berguna di sini", why: "OCR saja = kembali ke recall 58%. ColPali tetap berguna untuk menemukan halaman.", correct: false },
            { text: "LLM menebak angka dari deskripsi halaman", why: "Menebak angka compliance = malpraktik. Angka harus dikutip dari sumber.", correct: false },
          ],
        },
      ],
    },
  ],
};
