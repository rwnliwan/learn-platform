import type { V2Lesson } from "../lib/types";

// Speedup terukur dari lab (K=5, eps=8%): baseline 1.00x, ngram 1.40x, draft-model 1.69x, eagle 2.06x, eagle-3 3.21x.
const FIG_SPEEDUP = `<svg viewBox="0 0 480 290" role="img" aria-label="Speedup decode: baseline 1x, ngram 1,40x, draft model 1,69x, EAGLE 2,06x, EAGLE-3 3,21x.">
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">
<text x="142" y="44">baseline</text><text x="142" y="84">ngram</text><text x="142" y="124">draft model</text><text x="142" y="164">EAGLE</text><text x="142" y="204">EAGLE-3</text>
</g>
<rect x="150" y="30" width="93" height="18" rx="3" fill="var(--c5)"/><text x="251" y="44" font-size="11" fill="var(--text)" font-family="var(--font-ui)">1,00x</text>
<rect x="150" y="70" width="131" height="18" rx="3" fill="var(--c4)"/><text x="289" y="84" font-size="11" fill="var(--text)" font-family="var(--font-ui)">1,40x</text>
<rect x="150" y="110" width="158" height="18" rx="3" fill="var(--c3)"/><text x="316" y="124" font-size="11" fill="var(--text)" font-family="var(--font-ui)">1,69x</text>
<rect x="150" y="150" width="192" height="18" rx="3" fill="var(--c2)"/><text x="350" y="164" font-size="11" fill="var(--text)" font-family="var(--font-ui)">2,06x</text>
<rect x="150" y="190" width="300" height="18" rx="3" fill="var(--c1)"/><text x="458" y="204" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">3,21x</text>
<text x="305" y="232" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">speedup vs tanpa spec-decode (K=5, overhead 8%) — dari lab langkah 4</text>
<text x="305" y="248" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">dunia nyata: 2–3x (acceptance traffic produksi &lt; lab)</text>
</svg>`;

export const llmops16: V2Lesson = {
  slug: "llmops16-speculative-decoding",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps16 — Speculative Decoding: EAGLE & Draft Model",
  estMinutes: 54,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "GPU $4/jam yang 90% menganggur",
      prose: [
        "Maret 2026. Tim serving Kirana AI menatap dashboard GPU dengan perasaan campur aduk: 8× H100 disewa $32/jam, utilisasi compute (SM activity) hanya 11%. Tagihan berjalan penuh, kerja yang keluar sepertiganya. `Kita membayar Ferrari untuk dipakai antar-jemput anak sekolah,` gerutu lead infra-nya, Sinta. Model mereka — 70B parameter — melayani chatbot dengan TPOT 42ms. Setiap token yang keluar mengharuskan GPU membaca 140 GB bobot dari memori, lalu unit komputasinya menganggur menunggu bacaan selesai.",
        "Masalahnya bukan modelnya, bukan kodenya — melainkan FISIKA decode autoregresif: satu token per forward pass, dan forward pass itu didominasi membaca memori, bukan menghitung. Sinta menghitung: kalau saja GPU bisa `menebak` 5 token sekaligus lalu memverifikasi semuanya dalam SATU kali baca memori, throughput bisa 3x lipat — dengan GPU yang sama, tagihan yang sama, kualitas yang sama persis.",
        "Teknik itu ada, namanya speculative decoding, dan tahun 2026 ia berubah dari trik riset menjadi komoditas produksi: EAGLE-3 di vLLM 0.7 memberikan 2,5–3x throughput di traffic nyata. Tiga bulan setelah menyalakannya, utilisasi compute Kirana naik ke 34%, TPOT turun dari 42ms ke 15ms, dan mereka mengembalikan 3 dari 8 GPU — hemat $14.600/bulan. Lesson ini membedah cara kerjanya: dari ide draft-and-verify, draft model klasik, sampai EAGLE-3.",
        "Prasyarat ringkas (2 kalimat): decoding autoregresif = LLM mengeluarkan token satu per satu, tiap token bergantung pada semua token sebelumnya — persis seperti mengetik tanpa bisa melompat ke depan. Karena itu decode bersifat sekuensial dan memory-bound: GPU membaca seluruh bobot model dari memori untuk SETIAP token (lesson LLMOps15: inilah TPOT). Speculative decoding mengakali sekuensialitas ini tanpa mengubah hasilnya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mekanisme draft-and-verify dan kenapa ia tidak mengubah output model; (2) membedakan draft model klasik, EAGLE/EAGLE-3, dan ngram dari sisi acceptance rate; (3) menghitung speedup ekspektasi dari K, alpha, dan overhead; (4) membaca metrik acceptance vLLM dan tahu kapan spec-decode harus DIMATIKAN; (5) memilih strategi untuk skenario produksi. Durasi 54 menit · 1 lab simulasi acceptance · 6 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita Kirana · 2) Fisika decode & ide draft-verify · 3) Draft model vs EAGLE-3 · 4) Lab: simulator acceptance · 5) Operasional: metrik & jebakan · 6) Peta keputusan · 7) Mini-case: hitungan Kirana · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Speculative decoding = model jadi lebih pintar / output berubah`",
        type: "pitfall",
        body: "Salah total — dan ini kabar baiknya. Speculative decoding dijamin matematis menghasilkan DISTRIBUSI yang identik dengan model target tanpa spec-decode (pada greedy decoding, output-nya sama karakter per karakter — sudah diverifikasi empiris). Ia murni optimasi KECEPATAN, bukan kualitas. Kalau ada yang bilang outputnya `sedikit beda tapi lebih cepat`, itu bukan spec-decode yang benar — itu bug.",
      },
      reference: "Kirana: utilisasi compute 11% → spec-decode → TPOT 42ms jadi 15ms, 3 GPU dikembalikan.",
    },
    {
      id: "fisika-decode",
      eyebrow: "Langkah 2 · Konsep",
      title: "Kenapa decode lambat — dan celah yang dimanfaatkan",
      prose: [
        "Angka yang menjelaskan segalanya: pada H100 yang menjalankan Llama 70B, setiap token yang di-decode memaksa GPU membaca ~140 GB bobot dari HBM — dan hanya itu. Unit komputasi (tensor core) hampir menganggur selama decode; bottleneck-nya adalah BANDWIDTH MEMORI, bukan kecepatan hitung. Membaca 140 GB butuh ~40ms; menghitungnya butuh ~2ms. Kamu membayar 40ms untuk 2ms kerja.",
        "Celahnya: biaya membaca bobot HAMPIR SAMA apakah kamu memverifikasi 1 token atau 5 token sekaligus — karena bobotnya dibaca sekali, lalu dipakai untuk 5 posisi sekaligus dalam satu forward pass yang di-batch. Inilah ide draft-and-verify dalam tiga langkah: (1) DRAFT — model kecil/murah menebak K token berikutnya dengan cepat (murah karena kecil); (2) VERIFY — model target memeriksa K tebakan itu dalam SATU forward pass (biaya ≈ 1 forward biasa); (3) TERIMA semua tebakan benar berurutan dari depan + 1 bonus token yang dihasilkan target saat verifikasi.",
        "Contoh konkret K=3: draft menebak [`saya`, `suka`, `kopi`]. Target memverifikasi sekaligus: `saya` ✓, `suka` ✓, `kopi` ✗ (seharusnya `teh`). Hasil: 2 token diterima + 1 bonus token koreksi (`teh`) = 3 token dari 1 forward target. Tanpa spec-decode, 3 token butuh 3 forward. Kecepatan naik 3x untuk langkah itu — dengan output yang dijamin sama.",
        "Dua metrik yang mengendalikan segalanya: ALPHA (acceptance rate) = peluang tiap tebakan diterima — ditentukan seberapa `mirip` distribusi draft dengan target. Dan EPSILON = overhead (waktu draft + verifikasi vs forward biasa). Rumus speedup ekspektasi: S = (1 + K·alpha) / (1 + epsilon). K=5, alpha=0,7, epsilon=0,1 → (1+3,5)/1,1 = 4,1x secara teori; dunia nyata 2–3x karena alpha traffic produksi jarang setinggi itu dan epsilon membengkak saat batch besar.",
        "Intuisi satu kalimat: spec-decode mengubah `1 token per 1 bacaan memori mahal` menjadi `beberapa token per 1 bacaan memori mahal` — ia tidak mempercepat GPU, ia membuat setiap bacaan memori menghasilkan lebih banyak token.",
      ],
      formula: String.raw`S = \frac{1 + K\alpha}{1 + \epsilon}`,
      formulaNote: "S = speedup vs tanpa spec-decode; K = jumlah token draft per langkah; alpha = acceptance rate (0–1); epsilon = overhead draft+verifikasi. Contoh: K=5, alpha=0,7, epsilon=0,1 → 4,1x teori, 2–3x di produksi. Tuasmu: naikkan alpha (draft lebih mirip target), tekan epsilon (draft ringan).",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: ujian pilihan ganda dengan kunci jawaban",
        body: "Bayangkan murid (draft) mengerjakan 5 soal dulu dengan cepat, lalu guru (target) memeriksa semuanya sekaligus dengan kunci jawaban — jauh lebih cepat daripada guru mendikte jawaban satu per satu sambil murid menunggu. Syaratnya: murid harus cukup pintar agar tebakannya sering benar (alpha tinggi). Murid yang asbun (alpha 0,2) malah membuang waktu guru.",
      },
      reference: "1 forward target ≈ 1 bacaan memori — verifikasi K token sekaligus nyaris gratis.",
    },
    {
      id: "draft-vs-eagle",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga generasi drafter: ngram, draft model, EAGLE-3",
      prose: [
        "GENERASI 1 — NGRAM: tanpa model sama sekali. Tebak token berikutnya dari pola yang sering muncul (`terima` → `kasih`). Acceptance 0,30–0,60 (lumayan di prompt repetitif seperti kode). Harga: NOL — tanpa training, tanpa GPU tambahan. Ini baseline gratis yang sering diremehkan.",
        "GENERASI 2 — DRAFT MODEL KLASIK: model kecil dari keluarga yang sama menjadi drafter (mis. 1B men-draft untuk 70B). Masalahnya: distribusi model kecil DIVERGEN dari target — ia menebak dengan `logat` berbeda. Acceptance tipikal 0,40–0,70. Bekerja, tapi seperti murid yang belajar dari buku berbeda dengan gurunya.",
        "GENERASI 3 — EAGLE, EAGLE-2, EAGLE-3: lompatan konseptual. Alih-alih model kecil independen, EAGLE melatih KEPALA DRAFT RINGAN langsung di atas hidden states model target itu sendiri — drafter `melihat` apa yang dipikirkan target. Hasilnya distribusi draft menempel ketat ke target: acceptance 0,60–0,92 (EAGLE-3: 0,75–0,92 di steady state). Ibarat murid yang boleh mengintip catatan guru saat mengerjakan tebakan.",
        "Data nyata EAGLE-3 (benchmark 11 domain): rata-rata acceptance length 2,80 token per langkah verifikasi — terkuat di konten terstruktur (coding 3,32; math 3,14; RAG 3,12), terlemah di tulisan terbuka/kreatif (2,01–2,33 — tebakan kreatif memang sulit). Per posisi pada K=3: posisi 1 diterima 76%, posisi 2 56%, posisi 3 43% — acceptance MELURUH dengan posisi, karena tebakan ke-3 bergantung pada tebakan ke-2 yang mungkin salah. Inilah kenapa K=5 tidak 5x lebih baik dari K=1: ekornya makin tidak bisa dipercaya.",
        "Catatan anti-tumpang-tindih: LLMOps13 membahas vLLM sebagai server inference (instalasi, config dasar). Di sini vLLM hanya disebut sebagai TEMPAT spec-decode dinyalakan (satu flag config) — bukan tutorial serving. Fokus lesson ini: matematika dan operasional spec-decode itu sendiri, yang berlaku di vLLM, SGLang, maupun TensorRT-LLM.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `K lebih besar selalu lebih cepat`",
        type: "pitfall",
        body: "K=10 dengan alpha 0,5 ≈ membuang-buang verifikasi: peluang 10 tebakan berurutan benar = 0,5^10 ≈ 0,1%. Draft yang panjang tapi ngawur hanya menambah epsilon tanpa menambah token diterima. K optimal biasanya 3–5 untuk EAGLE-3 — diukur dari acceptance length aktual di traffic-mu, bukan dari teori.",
      },
      reference: "ngram 0,3–0,6 · draft model 0,4–0,7 · EAGLE-3 0,75–0,92. Acceptance meluruh per posisi.",
    },
    {
      id: "lab-acceptance",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulator acceptance & speedup",
      prose: [
        "SIMULASI — jujur: lab ini mensimulasikan PENERIMAAN draft (accept/reject deterministik per posisi, berhenti di reject pertama) dalam Python murni. Ini BUKAN vLLM asli — tidak ada model yang berjalan — melainkan laboratorium untuk merasakan hubungan alpha → acceptance length → speedup SEBELUM menyentuh flag config.",
        "Skenario: K=5 token draft, overhead epsilon 8%, 2.000 langkah simulasi. Empat drafter: ngram (alpha 0,40), draft-model (0,55), eagle (0,70), eagle-3 (0,82). Setiap posisi diterima bila hash deterministik < alpha — dan PENTING: simulasi berhenti di reject pertama (seperti verifikasi asli: token setelah reject pertama tidak dihitung).",
        "Cara membaca: `teori` = 1 + K·alpha (batas atas bila tiap posisi independen sempurna); `terukur` = acceptance length rata-rata aktual — SELALU lebih kecil dari teori karena reject menghentikan rantai (efek peluruhan posisi dari langkah 3!). `speedup` = terukur / 1,08. Interpretasi: gap teori-vs-terukur adalah harga sekuensialitas — dan gap inilah yang membuat K besar tidak berguna.",
        "Baris terakhir menerjemahkan ke TPOT: baseline 30ms/token dibagi speedup eagle-3 = TPOT efektif. Coba eksplorasi: ubah K 5 → 8 untuk eagle-3. Speedup naik — tapi coba K=12: kenaikannya mengecil (ekor tak terpercaya). Lalu turunkan alpha eagle-3 ke 0,45 (traffic kreatif): lihat speedup runtuh di bawah ngram — inilah kenapa alpha harus diukur di traffic SENDIRI.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `theory_al(k, alpha)` = 1 + k·alpha dan `speedup(al)` = al / 1,08" },
        { id: "t2", text: "Implementasikan `measured_al(k, alpha)` — loop posisi, berhenti di reject pertama" },
        { id: "t3", text: "Jalankan agregasi untuk 4 drafter + hitung TPOT efektif, baca output" },
      ],
      expected: "draft-model: 3.75→1.83 (1.69x) · eagle: 4.50→2.23 (2.06x) · eagle-3: 5.10→3.47 (3.21x) · ngram: 3.00→1.51 (1.40x) · TPOT 30.0ms → 9.3ms",
      note: {
        title: "💡 Intuisi: rantai yang sekuat mata terlemahnya",
        body: "Acceptance bekerja seperti rantai: 5 tebakan benar berurutan = 5 mata rantai harus utuh. Satu reject di posisi 2 = posisi 3–5 hangus walau tebakannya benar. Karena itu acceptance length tumbuh SUB-linear terhadap K — dan drafter yang `sedikit lebih akurat di posisi awal` jauh lebih berharga daripada yang akurat di ekor.",
      },
      hints: [
        "theory_al: 1.0 + k * alpha. speedup: al / (1.0 + EPS).",
        "measured_al: untuk tiap rid, acc=0; untuk pos in range(k): bila accept(rid, pos, alpha) -> acc+=1 else break; total += 1 + acc; kembalikan total / N.",
        "accept sudah disediakan: ((rid*7919 + pos*104729) % 100) < alpha*100.",
      ],
      code: {
        starter: `EPS = 0.08\nK = 5\nN = 2000\nCONFIGS = {"draft-model": 0.55, "eagle": 0.70, "eagle-3": 0.82, "ngram": 0.40}\n\ndef accept(rid, pos, alpha):\n    return ((rid * 7919 + pos * 104729) % 100) < alpha * 100\n\n# TULIS KODEMU: theory_al, measured_al, speedup\ndef theory_al(k, alpha):\n    ...\n\ndef measured_al(k, alpha):\n    ...\n\ndef speedup(al):\n    ...\n\n# AGREGASI (jangan ubah)\nfor name, alpha in CONFIGS.items():\n    th = theory_al(K, alpha)\n    me = measured_al(K, alpha)\n    print(f"{name}: teori={th:.2f} terukur={me:.2f} speedup={speedup(me):.2f}x")\nal3 = measured_al(K, CONFIGS["eagle-3"])\nprint(f"tpot_eagle3={30.0 / speedup(al3):.1f}ms tpot_baseline=30.0ms")`,
        lockLines: 8,
        solution: `EPS = 0.08\nK = 5\nN = 2000\nCONFIGS = {"draft-model": 0.55, "eagle": 0.70, "eagle-3": 0.82, "ngram": 0.40}\n\ndef accept(rid, pos, alpha):\n    return ((rid * 7919 + pos * 104729) % 100) < alpha * 100\n\n# TULIS KODEMU: theory_al, measured_al, speedup\ndef theory_al(k, alpha):\n    return 1.0 + k * alpha\n\ndef measured_al(k, alpha):\n    total = 0\n    for rid in range(N):\n        acc = 0\n        for pos in range(K):\n            if accept(rid, pos, alpha):\n                acc += 1\n            else:\n                break\n        total += 1 + acc\n    return total / N\n\ndef speedup(al):\n    return al / (1.0 + EPS)\n\n# AGREGASI (jangan ubah)\nfor name, alpha in CONFIGS.items():\n    th = theory_al(K, alpha)\n    me = measured_al(K, alpha)\n    print(f"{name}: teori={th:.2f} terukur={me:.2f} speedup={speedup(me):.2f}x")\nal3 = measured_al(K, CONFIGS["eagle-3"])\nprint(f"tpot_eagle3={30.0 / speedup(al3):.1f}ms tpot_baseline=30.0ms")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "draft-model 1.69x", msg: "Baris draft-model harus: teori=3.75 terukur=1.83 speedup=1.69x — cek break di reject pertama.", pattern: "draft-model: teori=3\\.75 terukur=1\\.83 speedup=1\\.69x" },
          { kind: "stdout_matches", task: "t3", label: "eagle 2.06x", msg: "Baris eagle harus: teori=4.50 terukur=2.23 speedup=2.06x.", pattern: "eagle: teori=4\\.50 terukur=2\\.23 speedup=2\\.06x" },
          { kind: "stdout_matches", task: "t3", label: "eagle-3 3.21x", msg: "Baris eagle-3 harus: teori=5.10 terukur=3.47 speedup=3.21x.", pattern: "eagle-3: teori=5\\.10 terukur=3\\.47 speedup=3\\.21x" },
          { kind: "stdout_matches", task: "t3", label: "ngram 1.40x", msg: "Baris ngram harus: teori=3.00 terukur=1.51 speedup=1.40x.", pattern: "ngram: teori=3\\.00 terukur=1\\.51 speedup=1\\.40x" },
          { kind: "stdout_matches", task: "t3", label: "TPOT 9.3ms", msg: "tpot_eagle3 harus 9.3ms (30 / speedup).", pattern: "tpot_eagle3=9\\.3ms" },
        ],
      },
      reference: "Simulasi matematika (bukan vLLM asli). Gap teori-vs-terukur = harga sekuensialitas.",
    },
    {
      id: "operasional",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Operasional: menyalakan, mengukur, dan kapan mematikan",
      prose: [
        "MENYALAKAN — di vLLM, spec-decode adalah OPT-IN eksplisit: tanpa flag, tidak ada akselerasi. Untuk EAGLE-3: `--speculative-config '{\"method\":\"eagle3\",\"model\":\"<draft-head>\",\"num_speculative_tokens\":3}'`. Draft head harus selaras dengan target (tokenizer sama, dilatih pada hidden states target itu). Salah pasang draft = acceptance anjlok = lebih lambat dari tanpa spec-decode. Aturan emas: nyalakan di staging, ukur, baru produksi.",
        "MENGUKUR — vLLM mengekspor empat counter Prometheus: jumlah draft, jumlah token draft, jumlah token diterima, dan penerimaan per posisi. Acceptance rate = token_diterima / token_draft; mean acceptance length = 1 + token_diterima / jumlah_draft. Dashboard wajib: acceptance rate (alert bila < 0,50 — tanda divergensi drafter, tokenizer mismatch, atau temperature drift), acceptance per posisi (waspadai ekor yang jatuh bebas), dan p99 latensi pada beberapa ukuran batch.",
        "KAPAN MEMATIKAN — tiga lampu merah: (1) TAIL LATENCY MEMBURUK: saat reject, langkah itu membayar full draft + verifikasi untuk 1 token — lebih mahal dari tanpa spec-decode. Bila p99 naik setelah dinyalakan, matikan. (2) ALPHA RENDAH DI TRAFFIC-MU: lab memakai alpha 0,82; traffic kreatif/temperature tinggi bisa 0,3 — di bawah 0,5, spec-decode merugikan. (3) BATCH SUDAH BESAR: pada batch raksasa, GPU sudah jenuh (compute-bound) — tidak ada `bacaan memori menganggur` untuk dimanfaatkan; epsilon membengkak, speedup menguap. Spec-decode bersinar di batch kecil–sedang dengan latensi ketat.",
        "Dua jebakan operasional dari lapangan: (a) acceptance DRIFT mengikuti distribusi traffic — model yang 0,8 di ShareGPT bisa 0,5 di data domain-mu; ukur di traffic sendiri, bukan di benchmark publik. (b) Jangan kejar K besar untuk menutupi alpha kecil — perbaiki drafter-nya (latih ulang head / ganti draft model), bukan K-nya.",
        "Posisi dalam strategi optimasi: spec-decode menyerang TPOT (decode). Ia komplementer dengan kuantisasi (memperkecil bobot → bacaan memori lebih cepat) dan orthogonal terhadap scaling GPU (LLMOps15). Urutan optimasi yang sehat: ukur TTFT/TPOT → kuantisasi bila mampu → spec-decode untuk TPOT → scale GPU untuk kapasitas.",
      ],
      figure: {
        svg: FIG_SPEEDUP,
        alt: "Speedup decode: baseline 1x, ngram 1,40x, draft model 1,69x, EAGLE 2,06x, EAGLE-3 3,21x.",
        caption: "Cara membaca: panjang batang = speedup vs tanpa spec-decode dari lab langkah 4 (K=5, overhead 8%). Interpretasi: EAGLE-3 ~2x lipat dari draft model klasik — inilah nilai `mengintip hidden states target`. Tapi angka lab adalah BATAS ATAS: dunia nyata 2–3x karena alpha traffic produksi < alpha lab dan overhead membengkak di batch besar. Jangan janjikan 3,21x ke manajemen — janjikan `ukur di traffic kita`.",
      },
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Spec-decode yang dinyalakan buta (tanpa ukur alpha) adalah risiko ekor latensi: p99 bisa NAIK sementara rata-rata turun — dashboard yang hanya memantau rata-rata akan melaporkan `membaik` sementara 1% pelanggan menderita timeout. Mitigasi: gate deployment pada p99 + acceptance rate, bukan pada throughput rata-rata. Optimasi yang tidak diukur = judi dengan uang perusahaan.",
      },
      reference: "Opt-in eksplisit. Alert alpha < 0,50. Gate di p99, bukan rata-rata. Ukur di traffic sendiri.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Drafter mana untuk siapa?",
      prose: [
        "**Skenario 1 — Chatbot real-time di vLLM, traffic campur, SLO TPOT ketat.** → EAGLE-3 (alpha 0,6–0,8, speedup 2–3x). Nyalakan di staging, ukur acceptance di traffic sendiri 1 minggu, gate di p99. Jangan: langsung produksi tanpa baseline.",
        "**Skenario 2 — Model fine-tuned custom, tidak ada draft head EAGLE yang selaras.** → Draft model kecil sekeluarga (alpha 0,4–0,7) atau latih head EAGLE sendiri bila volume membenarkan. Jangan: pasang head EAGLE milik model lain (tokenizer/hidden mismatch = acceptance runtuh).",
        "**Skenario 3 — Budget training NOL, butuh cepat.** → ngram (gratis, tanpa training, 1,3–1,6x di teks repetitif). Jangan: berharap keajaiban di teks kreatif — ngram buta di sana.",
        "**Skenario 4 — Batch job semalam, throughput sudah tinggi via batching besar.** → Matikan/abaikan spec-decode; batch besar sudah menjenuhkan GPU. Fokus ke kuantisasi. Jangan: menambah epsilon tanpa manfaat.",
        "**Skenario 5 — Output kreatif, temperature tinggi (storytelling, marketing copy).** → Ukur alpha DULU — kemungkinan < 0,5. Bila rendah, jangan pakai; bila tetap mau, turunkan K. Jangan: asumsi alpha benchmark berlaku di sini.",
        "Aturan praktis 10 detik: `Ada draft head selaras?` → EAGLE-3. `Tidak ada?` → draft model kecil / ngram. `Alpha < 0,5 di traffic-mu?` → matikan. `Batch sudah raksasa?` → tidak butuh. `Ragu?` → ngram dulu (gratis), ukur, baru investasi training head.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: memilih asisten",
        body: "ngram = asisten magang gratis (kadang benar, sering salah, tapi gratis). Draft model = asisten junior (lumayan, perlu digaji GPU kecil). EAGLE-3 = asisten yang duduk di sebelahmu dan melihat layarmu (paling akurat, tapi harus dilatih khusus untuk caramu bekerja). Pilih sesuai seberapa mahal kesalahan tebakannya — yaitu seberapa mahal 1 forward target-mu.",
      },
      reference: "Head selaras → EAGLE-3. Tidak ada → draft kecil/ngram. Alpha < 0,5 → matikan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Hitungan Kirana: berapa GPU yang kembali?",
      prose: [
        "Kirana pasca-keputusan: 8× H100, target 40 QPS, respons rata-rata 80 token. Baseline: TTFT 300ms, TPOT 25ms → latensi = 300 + 25 × 80 = 2.300ms = 2,3 detik. Satu GPU menangani 8 request konkuren dalam SLO.",
        "Hitung: (a) concurrency & GPU yang dibutuhkan TANPA spec-decode; (b) dengan EAGLE-3 speedup 2,6x (angka konservatif dunia nyata, bukan 3,21x lab); (c) penghematan bulanan @ $4/jam/GPU; (d) apa yang harus dimonitor pasca-penyalaan. **Pembahasan:** (a) Little's Law: 40 × 2,3 = 92 concurrency → ceil(92/8) = 12 GPU. Mereka hanya punya 8 — INILAH kenapa p95 mereka jebol sebelum optimasi! (b) Speedup 2,6x → TPOT efektif 25/2,6 ≈ 9,6ms → latensi = 300 + 9,6 × 80 = 1.068ms ≈ 1,07 detik → concurrency = 40 × 1,07 ≈ 43 → ceil(43/8) = 6 GPU. (c) Dari 12 (kebutuhan) ke 6 = hemat 6 GPU × $4 × 730 ≈ $17.520/bulan. Bahkan vs 8 yang dimiliki: kembalikan 2 GPU = $5.840/bulan. (d) Acceptance rate (alert < 0,50), acceptance per posisi, p99 latensi per batch size, dan drift alpha mingguan mengikuti perubahan distribusi traffic.",
        "Pelajaran Kirana dalam satu kalimat: mereka tidak butuh GPU ke-9 dan ke-10 — mereka butuh membuat 8 GPU yang ada menghasilkan 2,6x token per bacaan memori.",
        "Kaitan antar-lesson: LLMOps15 memberi tahu BERAPA GPU yang kamu butuhkan; lesson ini memberi tahu cara MENGURANGI angka itu tanpa membeli apa-apa.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Angka (b) memakai speedup 2,6x — konservatif, di bawah 3,21x lab. Godaan terbesar mini-case seperti ini adalah memakai angka lab untuk business case, lalu kecewa di produksi. Selalu diskon 20–30% dari angka benchmark untuk business case, dan gate realisasi di metrik minggu pertama. Optimisme yang tidak didiskon = risiko anggaran.",
      },
      reference: "40 QPS: 12 GPU → 6 GPU dengan EAGLE-3. Hemat ≈ $17.520/bulan. Monitor: alpha, p99, drift.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Kenapa decode autoregresif lambat di GPU modern?",
          options: [
            { text: "GPU terlalu lambat berhitung untuk model 70B", why: "Terbalik: tensor core hampir MENGANGGUR saat decode. Perhitungannya cuma ~2ms; yang 40ms adalah membaca 140 GB bobot dari memori." },
            { text: "Decode memory-bound: tiap token membaca seluruh bobot dari HBM", why: "Tepat. Bottleneck = bandwidth memori, bukan compute. Inilah fisika yang dieksploitasi spec-decode: satu bacaan memori untuk banyak token.", correct: true },
            { text: "Tokenizer terlalu lambat memecah teks", why: "Tokenisasi adalah overhead kecil di CPU, bukan penentu TPOT. Mengoptimasi tokenizer tidak menyentuh 40ms bacaan memori." },
            { text: "Model 70B terlalu besar untuk H100", why: "70B muat di H100 (dengan kuantisasi/Tensor Parallel). Masalahnya bukan muat-tidaknya, melainkan biaya membaca bobot BERULANG tiap token." },
          ],
        },
        {
          q: "K=4, alpha=0,6, epsilon=0,1. Speedup ekspektasi teori?",
          options: [
            { text: "3,09x — (1 + 4×0,6) / 1,1", why: "Tepat: (1+2,4)/1,1 = 3,4/1,1 ≈ 3,09x. Ingat ini BATAS ATAS teori — terukur selalu lebih rendah karena reject menghentikan rantai.", correct: true },
            { text: "4x — sama dengan K", why: "K=4 hanya tercapai bila alpha=1 (semua tebakan benar) dan epsilon=0 — mustahil. Alpha < 1 selalu memangkas hasil." },
            { text: "2,4x — K × alpha saja", why: "Kamu lupa +1 (bonus token dari verifikasi) dan pembagi (1+epsilon) untuk overhead. Rumus lengkapnya (1+K·alpha)/(1+epsilon)." },
            { text: "0,6x — sama dengan alpha", why: "Alpha adalah peluang per tebakan, bukan speedup. Speedup selalu > 1 bila alpha cukup tinggi — alpha 0,6 dengan K=4 memberi ~3x." },
          ],
        },
        {
          q: "Mengapa EAGLE-3 mencapai acceptance 0,75–0,92, jauh di atas draft model klasik (0,4–0,7)?",
          options: [
            { text: "Karena EAGLE-3 adalah model yang lebih besar", why: "Terbalik: kepala draft EAGLE justru RINGAN. Keunggulannya bukan ukuran, melainkan akses ke hidden states target." },
            { text: "Kepala draft dilatih di atas hidden states target itu sendiri, distribusinya menempel ketat", why: "Tepat. Drafter `mengintip` representasi internal target — tebakannya berlogat sama dengan target, bukan logat model kecil lain.", correct: true },
            { text: "Karena EAGLE-3 memakai K yang lebih besar", why: "K besar tanpa alpha tinggi malah merugikan (ekor tak terpercaya). Kenaikan acceptance EAGLE datang dari kualitas tebakan, bukan jumlahnya." },
            { text: "Karena EAGLE-3 mengubah output agar lebih mudah ditebak", why: "Berbahaya dan salah: spec-decode DIJAMIN tidak mengubah distribusi output. Yang berubah hanya kecepatan, bukan isi." },
          ],
        },
        {
          q: "Setelah menyalakan spec-decode, throughput rata-rata naik 2x TAPI p99 latensi naik 15%. Keputusan?",
          options: [
            { text: "Pertahankan — rata-rata naik 2x adalah kemenangan", why: "Inilah judi yang diperingatkan langkah 5: 1% pelangganmu sekarang timeout. Rata-rata yang membaik + ekor yang memburuk = SLO breach yang tersembunyi." },
            { text: "Matikan / investigasi — gate di p99, bukan rata-rata", why: "Tepat. Reject membayar full draft+verifikasi untuk 1 token — ekornya mahal. Turunkan K, cek alpha, atau matikan bila p99 tidak pulih.", correct: true },
            { text: "Naikkan K untuk menutup kenaikan p99", why: "K lebih besar = verifikasi lebih mahal saat reject = p99 makin buruk. Ini menambah bensin ke kebakaran." },
            { text: "Tambah GPU agar p99 turun", why: "p99 di sini disebabkan mekanisme reject, bukan kapasitas. Tambah GPU = bayar untuk masalah yang salah." },
          ],
        },
        {
          q: "Traffic-mu didominasi penulisan kreatif dengan temperature 1,2. Alpha EAGLE-3 terukur 0,35. Tindakan tepat?",
          options: [
            { text: "Tetap pakai — EAGLE-3 selalu membantu", why: "Alpha 0,35 < 0,5 = di bawah ambang manfaat. `Selalu membantu` adalah mitos; spec-decode butuh tebakan yang cukup akurat." },
            { text: "Matikan spec-decode untuk workload ini (atau turunkan temperature/K bila memungkinkan)", why: "Tepat. Teks kreatif sulit ditebak siapa pun — drafter pun manusiawi. Overhead verifikasi > manfaatnya. Ukur, bukan asumsi.", correct: true },
            { text: "Naikkan K ke 10 untuk kompensasi alpha rendah", why: "Peluang 10 tebakan berurutan benar pada alpha 0,35 ≈ 0. K besar + alpha kecil = verifikasi mahal untuk hasil nol." },
            { text: "Ganti ke ngram — pasti lebih baik", why: "ngram alpha 0,3–0,6 juga akan rendah di teks kreatif. Masalahnya distribusi traffic, bukan jenis drafter." },
          ],
        },
        {
          q: "Batch inference semalam (1 juta dokumen) dengan batch size raksasa. Spec-decode?",
          options: [
            { text: "Wajib — semua workload butuh spec-decode", why: "Batch raksasa sudah menjenuhkan GPU (compute-bound): tidak ada bacaan memori menganggur untuk dimanfaatkan. Epsilon naik, speedup menguap." },
            { text: "Tidak prioritas — batch besar sudah maksimalkan throughput; fokus ke kuantisasi", why: "Tepat. Spec-decode bersinar di batch kecil–sedang dengan SLO latensi. Di batch raksasa, ia hanya menambah overhead.", correct: true },
            { text: "Ya, dengan K=10 untuk throughput maksimal", why: "Dua kesalahan sekaligus: batch raksasa tidak butuh spec-decode, dan K=10 boros verifikasi. Lihat opsi yang benar." },
            { text: "Hanya bila memakai EAGLE-3, bukan draft model", why: "Jenis drafter bukan masalahnya — rezim batch-nya. EAGLE-3 pun tidak membantu GPU yang sudah jenuh." },
          ],
        },
      ],
      summary: [
        "Decode lambat karena memory-bound (baca 140 GB bobot per token); spec-decode membuat 1 bacaan memori menghasilkan banyak token via draft-and-verify.",
        "Output dijamin identik dengan target (verifikasi empiris: sama karakter per karakter pada greedy) — ini optimasi kecepatan, bukan kualitas.",
        "Tiga generasi drafter: ngram (0,3–0,6, gratis), draft model klasik (0,4–0,7), EAGLE-3 (0,75–0,92, kepala draft di hidden states target).",
        "Rumus: S = (1 + K·alpha)/(1 + epsilon); terukur selalu < teori karena reject menghentikan rantai — K optimal 3–5.",
        "Operasional: opt-in eksplisit di vLLM; monitor acceptance rate (alert < 0,50), acceptance per posisi, p99 per batch size; gate di p99 bukan rata-rata.",
        "Jangan pakai saat: alpha < 0,5 di traffic-mu, batch sudah raksasa, atau p99 memburuk — ukur di traffic sendiri, diskon 20–30% dari angka benchmark.",
      ],
      next: { label: "LLMOps17 — Governance & Kepatuhan LLM", href: "/v2/learn/llmops17-governance-kepatuhan" },
    },
  ],
};
