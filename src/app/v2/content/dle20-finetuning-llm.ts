import type { V2Lesson } from "../lib/types";

// LoRA: matriks beku W0 (4-bit) paralel dengan adapter A->B yang dilatih.
const LORA_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram LoRA: input mengalir lewat matriks beku W0 dan lewat adapter A lalu B, hasilnya dijumlahkan.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="20" y="100" width="90" height="44" rx="8" fill="var(--c1)" opacity="0.9"/><text x="65" y="127" fill="#fff" font-weight="600">input x</text>
<rect x="170" y="36" width="150" height="48" rx="8" fill="var(--bg-panel)" stroke="var(--chart-grid)" stroke-dasharray="6 4"/><text x="245" y="56" fill="var(--text-muted)">W0 beku (4-bit)</text><text x="245" y="72" fill="var(--text-muted)" font-size="11">tidak dilatih</text>
<rect x="170" y="106" width="70" height="40" rx="8" fill="var(--c2)" opacity="0.9"/><text x="205" y="130" fill="#fff" font-size="11">A (r x k)</text>
<rect x="262" y="106" width="70" height="40" rx="8" fill="var(--c3)" opacity="0.9"/><text x="297" y="130" fill="#fff" font-size="11">B (d x r)</text>
<text x="251" y="166" fill="var(--text-muted)" font-size="11">adapter: dilatih, presisi penuh</text>
<circle cx="402" cy="122" r="22" fill="var(--bg-panel)" stroke="var(--c4)" stroke-width="2"/><text x="402" y="128" fill="var(--text)" font-size="16">+</text>
<rect x="452" y="100" width="92" height="44" rx="8" fill="var(--c4)" opacity="0.9"/><text x="498" y="127" fill="#fff" font-size="11" font-weight="600">h = W0x+BAx</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ahL)">
<defs><marker id="ahL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="110" y1="112" x2="166" y2="62"/><line x1="110" y1="132" x2="166" y2="126"/>
<line x1="240" y1="126" x2="262" y2="126"/><line x1="332" y1="126" x2="380" y2="122"/>
<line x1="320" y1="60" x2="386" y2="106"/><line x1="424" y1="122" x2="450" y2="122"/>
</g>
</svg>`;

export const dle20: V2Lesson = {
  slug: "dle20-finetuning-llm",
  track: "Deep Learning Engineer",
  module: "Arsitektur Modern",
  title: "DLE20 — Fine-Tuning LLM: SFT, LoRA & Preferensi",
  estMinutes: 60,
  steps: [
    {
      id: "peta-lesson",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Pretrained LLM sudah pintar berbahasa; fine-tuning memutuskan perilaku apa yang ia tunjukkan saat bekerja untukmu. Lesson ini memetakan lima keputusan berurutan: (1) SFT — mengajari format dan gaya lewat pasangan instruksi-respons; (2) LoRA/QLoRA — melatih 0,1 persen parameter dengan matematika low-rank agar muat di GPU kecil; (3) preference optimization — dari RLHF yang berat ke DPO yang langsung belajar dari pasangan 'dipilih vs ditolak'; (4) kurasi data — karena fine-tune mengabadikan data, termasuk kebisingannya; (5) evaluasi — golden set, uji regresi, dan pengukuran catastrophic forgetting.",
        "Anggap kamu sudah tahu arsitektur Transformer (attention, training loop) dari lesson sebelumnya. Tidak ada prasyarat tool: semua hitungan di lesson ini memakai aritmetika biasa dan satu lab Python stdlib.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan perbedaan SFT, instruction tuning, LoRA/QLoRA, RLHF, dan DPO beserta kapan memakai masing-masing; (2) menghitung jumlah parameter terlatih LoRA untuk rank dan ukuran model berapa pun; (3) menghitung kebutuhan VRAM dan biaya eksperimen full fine-tune vs QLoRA; (4) merancang pipeline kurasi data (dedup, dekontaminasi, konsistensi format); (5) merancang evaluasi golden set + uji regresi yang menangkap catastrophic forgetting.",
        "Keputusan kapan fine-tune (vs RAG) diajarkan sebagai modul bersama di AIE5 — Fine-Tuning (track AI Engineering); lesson ini mendalami caranya: SFT, LoRA, dan preference optimization.",
      ],
      tasks: [],
      reference: "SFT = format. LoRA = murah. DPO = selera. Data = segalanya. Eval = bukti.",
    },
    {
      id: "cerita-finetune",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Rp61 juta untuk tiga poin — yang kalah dari Rp15 juta",
      prose: [
        "Tim data NusaBank (6 orang) punya masalah konkret: chatbot CS menjawab 40 persen tiket dengan format salah — jawabannya benar, tapi tidak mengikuti template eskalasi, sehingga agen manusia harus mengetik ulang. VP Engineering menyetujui fine-tune penuh model 7B pada 50 ribu tiket historis: 8×A100 80GB, 3 run eksperimen, 52 jam klaster, tagihan $3.744 — sekitar Rp61 juta. Hasilnya: kepatuhan format naik dari 61 persen ke 64 persen. Tiga poin. Rp61 juta.",
        "Sementara itu tim tetangga mengerjakan masalah yang sama: RAG di atas SOP produk + 40 contoh few-shot di system prompt. Biaya $900 — sekitar Rp15 juta. Kepatuhan format: 61 persen ke 89 persen.",
        "Twist-nya: fine-tune NusaBank tidak gagal karena modelnya bodoh — ia gagal karena terlalu patuh. Audit data menemukan 31 persen dari 50 ribu tiket berlabel salah: agen-agen lama sendiri salah paham template eskalasi. SFT tidak menambah kepintaran; ia mengabadikan apa pun yang ada di data — termasuk kebisingan. Lebih pahit lagi: skor ringkasan dokumen (tugas lama model) turun dari 4,1 ke 3,6 dari 5. Model belajar format baru sambil melupakan kemampuan lama: catastrophic forgetting, dibayar Rp61 juta.",
        "Lesson ini memberimu aritmetika agar tidak mengulanginya: kapan fine-tune adalah jawabannya, kapan RAG atau prompt engineering menang, dan bagaimana melakukannya murah (LoRA/QLoRA) serta benar (kurasi + evaluasi).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fine-tune pada data tiket mentah = model menghafal data pelanggan (nama, NIK, nomor rekening). Di bawah UU PDP, itu kebocoran yang direncanakan. Kurasi data bukan soal kualitas model saja — ini kontrol kepatuhan.",
      },
      reference: "Fine-tune mengabadikan data — termasuk kebisingannya. Kurasi dulu, latih kemudian.",
    },
    {
      id: "sft-instruction",
      eyebrow: "Langkah 3 · SFT & instruction tuning",
      title: "SFT: mengajari format, bukan pengetahuan",
      prose: [
        "Supervised fine-tuning = training lanjutan dengan pasangan (instruksi, respons) berlabel. Format datanya sederhana, biasanya JSONL: {\"instruction\": \"Ringkas keluhan ini dalam 2 kalimat\", \"input\": \"...teks tiket...\", \"response\": \"...ringkasan...\"}. Model dilatih memprediksi token respons — dan hanya respons: loss dihitung pada token respons saja (loss masking), token instruksi tidak ikut dihukum. Tujuannya presisi: model tidak boleh 'belajar' mengarang instruksi, hanya menjawabnya.",
        "Instruction tuning adalah SFT dalam skala dan keragaman instruksi (ratusan jenis tugas: ringkas, klasifikasi, ekstraksi, tanya-jawab). Efeknya: model menjadi mengikuti instruksi secara umum, bukan hanya satu template. Inilah lompatan dari 'model bahasa' menjadi 'asisten'.",
        "💡 Intuisi: pretraining mengajari pengetahuan dan bahasa; SFT mengajari perilaku dan format. Analoginya: pretraining = kuliah 4 tahun, SFT = training orientasi 2 minggu di perusahaanmu. Jangan harapkan orientasi 2 minggu mengajari fisika kuantum — jangan harapkan SFT mengajari fakta produk baru. Fakta baru = RAG atau pretraining lanjutan.",
        "Kapan SFT membantu: (1) format output harus konsisten (template, JSON, gaya bahasa); (2) domain bahasanya khas (istilah perbankan, singkatan internal); (3) ada 1–50 ribu contoh berkualitas. Kapan SFT tidak membantu: (1) model butuh fakta baru — ia akan mengarang dengan percaya diri (halusinasi); (2) contoh sedikit tapi berisik — lihat cerita NusaBank; (3) masalahnya sebenarnya retrieval — pakai RAG.",
        "Contoh langkah-demi-langkah (mini): 3 contoh tiket → format JSONL → training 3 epoch, learning rate 2e-5 (10–100× lebih kecil dari pretraining — bobot sudah bagus, jangan dirusak) → evaluasi pada 200 tiket yang TIDAK ada di training. Aturan praktis: bila loss training turun tapi skor golden set stagnan setelah 1–2 epoch, hentikan — model mulai menghafal, bukan belajar.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: fine-tune menambah pengetahuan model",
        type: "pitfall",
        body: "Yang benar: SFT mengubah distribusi perilaku (gaya, format, kepatuhan instruksi), bukan basis pengetahuan. Memaksa fakta baru lewat SFT pada sedikit contoh menghasilkan model yang mengarang fakta dengan percaya diri — lebih berbahaya dari model yang mengaku tidak tahu. Pengetahuan baru yang faktual = RAG di atas sumber tepercaya, atau pretraining lanjutan pada korpus domain.",
      },
      reference: "SFT = pasangan instruksi-respons, loss hanya pada respons. Format ya, fakta baru tidak.",
    },
    {
      id: "lora-qlora",
      eyebrow: "Langkah 4 · LoRA & QLoRA",
      title: "LoRA: latih 0,1 persen, dapat 99 persen",
      prose: [
        "Full fine-tune 7B butuh 8×A100 80GB. Bukan karena bobotnya (14 GB dalam fp16) — melainkan karena optimizer Adam menyimpan dua state per parameter dalam fp32 (momentum m dan variansi v): 7 miliar × 8 byte = 56 GB, plus gradien fp32 28 GB. Total ~98 GB sebelum aktivasi. LoRA memotong masalah ini di akarnya: bekukan semua bobot pretrained, latih hanya adapter kecil yang disisipkan.",
        "Matematikanya: untuk matriks bobot W₀ (d×k), LoRA tidak mengubah W₀ — ia melatih dua matriks kecil B (d×r) dan A (r×k) dengan r ≪ d,k, lalu W' = W₀ + BA. Update ΔW = BA punya rank maksimal r: model hanya boleh bergerak dalam subruang berdimensi-r. Parameter terlatih per matriks = r(d+k), bukan d×k.",
        "Contoh angka (ini yang dihitung di lab): matriks attention 4096×4096 = 16.777.216 parameter. LoRA r=8: 8×(4096+4096) = 65.536 — 0,39 persen. Untuk 7B penuh (32 lapis × 4 matriks q,k,v,o): 65.536×128 = 8.388.608 parameter = 0,12 persen dari 7 miliar. Optimizer Adam kini hanya menyimpan state untuk 8,4 juta parameter (~0,2 GB), bukan 7 miliar.",
        "💡 Intuisi: kenapa rank kecil cukup? Karena update fine-tuning punya 'intrinsic rank' rendah — adaptasi ke tugas baru tidak butuh mengubah seluruh ruang bobot, hanya sedikit arah penting (temuan Aghajanyan dkk., 2020). Analoginya: menyetel radio tidak butuh merakit ulang pesawat; cukup putar beberapa kenop. r=8–64 sudah cukup untuk mayoritas tugas; r=128+ jarang menambah apa-apa selain biaya.",
        "QLoRA melangkah lebih jauh: bobot beku W₀ dikuantisasi ke 4-bit (NF4, 0,5 byte per parameter) — 7B menjadi 3,5 GB. Adapter A,B tetap dilatih dalam presisi penuh (fp16/bf16) dengan teknik double quantization dan paged optimizer. Hasilnya: fine-tune 7B muat di 1×A100 40GB (bahkan RTX 4090 24GB); paper aslinya fine-tune 65B di satu GPU 48GB. Kualitasnya menyamai full fine-tune 16-bit pada mayoritas benchmark.",
        "Cara membaca: kotak kiri = input x; jalur atas putus-putus = W₀ beku (tidak dilatih, 4-bit di QLoRA); jalur bawah = A lalu B, satu-satunya yang menerima gradien; lingkaran + = menjumlahkan kedua jalur menjadi h = W₀x + BAx. Saat inference, BA bisa digabung permanen ke W₀ — tanpa biaya tambahan.",
        "Interpretasi: LoRA memisahkan pengetahuan (W₀, beku) dari adaptasi (BA, dilatih). QLoRA menambahkan kompresi pada pengetahuan agar muat di GPU kecil. Keduanya menjawab pertanyaan biaya di cerita pembuka: eksperimen yang tadinya $1.248 per run menjadi belasan dolar.",
      ],
      formula: String.raw`\mathbf{W}' = \mathbf{W}_0 + \mathbf{B}\mathbf{A}, \qquad P_{\text{LoRA}} = r\,(d + k) \ll d \times k = P_{\text{full}}`,
      formulaNote: "W₀ = bobot pretrained (d×k), dibekukan; B = matriks d×r, A = matriks r×k, keduanya dilatih; r = rank (biasanya 8–64), jauh lebih kecil dari d dan k; P = jumlah parameter terlatih. Tanda ≪ dibaca 'jauh lebih kecil dari'.",
      figure: {
        svg: LORA_SVG,
        alt: "Diagram LoRA: input mengalir lewat matriks beku W0 dan lewat adapter A lalu B; kedua hasil dijumlahkan.",
        caption: "LoRA: bekukan pengetahuan (W₀), latih hanya adapter kecil (B×A).",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: rank LoRA makin besar makin bagus",
        type: "pitfall",
        body: "Yang benar: r=8 vs r=64 sering memberi skor akhir yang sama — kapasitas tambahannya tidak dipakai tugas. Rank besar = lebih banyak parameter = training lebih lambat + risiko overfitting pada data kecil. Mulai dari r=8 atau 16; naikkan hanya bila kurva validasi menunjukkan underfit yang jelas. Rank adalah kenop biaya, bukan kenop kualitas.",
      },
      reference: "W' = W0 + BA; latih 0,1% parameter. QLoRA = W0 4-bit + adapter presisi penuh.",
    },
    {
      id: "preferensi-dpo",
      eyebrow: "Langkah 5 · Preference optimization",
      title: "Dari RLHF ke DPO: mengajari selera, bukan jawaban",
      prose: [
        "SFT mengajari satu jawaban benar per instruksi. Tapi banyak tugas tidak punya jawaban tunggal — yang ada adalah preferensi: respons A lebih sopan / lebih ringkas / lebih aman dari B. RLHF (reinforcement learning from human feedback) adalah pipeline klasik untuk ini: (1) SFT dulu; (2) latih reward model dari pasangan (dipilih, ditolak) — model yang memprediksi skor 'kesukaan manusia'; (3) optimasi policy dengan PPO agar memaksimalkan reward. Berhasil (inilah yang membuat ChatGPT terasa 'nurut'), tapi berat: 4 model di memori (policy, referensi, reward, value), PPO tidak stabil, tuning-nya mahal.",
        "DPO (direct preference optimization) memotong rantai itu: tanpa reward model, tanpa PPO. Idenya — reward implisit sebenarnya sudah terkandung dalam rasio policy vs model referensi. Loss DPO langsung menaikkan peluang respons yang dipilih (y_w, winner) dan menurunkan yang ditolak (y_l, loser), relatif terhadap model referensi π_ref. Satu training loop, stabil seperti supervised learning biasa.",
        "💡 Intuisi: SFT = 'ini jawaban yang benar, tiru'; DPO = 'dari dua jawaban ini, yang kiri lebih kusukai — bergeserlah ke sana'. SFT mengajari isi, DPO mengajari selera. Karena itu urutannya selalu SFT dulu (bisa menjawab), baru DPO (menjawab dengan selera yang tepat). DPO pada model yang belum SFT = mengajari selera pada model yang belum bisa bicara.",
        "β (beta) adalah kenop paling penting: ia mengatur seberapa jauh policy boleh menyimpang dari model referensi (penalti KL implisit). β kecil = bebas berubah banyak (risiko melupakan SFT); β besar = perubahan konservatif. Nilai umum 0,1–0,5. Data preferensi butuh kualitas yang sama fanatiknya dengan SFT: pasangan (dipilih, ditolak) yang ambigu atau tidak konsisten melatih selera yang acak.",
        "Kapan DPO: (1) model sudah cukup pintar tapi gayanya salah — terlalu panjang, terlalu kaku, kurang sopan; (2) ada 5–50 ribu pasangan preferensi; (3) ingin perbaikan perilaku tanpa pipeline RLHF. Kapan JANGAN: butuh kemampuan baru (pakai SFT), butuh fakta baru (pakai RAG), atau pasangan preferensinya tidak bisa didefinisikan dengan jelas.",
      ],
      formula: String.raw`\mathcal{L}_{\mathrm{DPO}} = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\mathrm{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\mathrm{ref}}(y_l \mid x)} \right) \right]`,
      formulaNote: "x = instruksi; y_w = respons yang dipilih manusia (winner); y_l = respons yang ditolak (loser); π_θ = model yang dilatih; π_ref = model referensi (biasanya hasil SFT, dibekukan); β = kekuatan penalti agar tidak menyimpang jauh dari referensi; σ = sigmoid. Loss turun ketika model memberi peluang relatif lebih besar pada y_w dibanding y_l.",
      tasks: [],
      note: {
        title: "💡 Intuisi: DPO = RLHF tanpa drama",
        body: "RLHF butuh reward model + PPO + 4 model di memori + tuning yang rewel. DPO membuktikan reward-nya bisa implisit — cukup pasangan preferensi dan satu loss. Untuk 90 persen kebutuhan 'perilaku lebih baik', DPO memberi 90 persen manfaat RLHF dengan 20 persen kerumitan. Mulai dari DPO; naik ke RLHF hanya bila DPO terbukti tidak cukup.",
      },
      reference: "SFT dulu (bisa menjawab), DPO kemudian (selera). β = rem agar tidak lupa SFT.",
    },
    {
      id: "kurasi-data",
      eyebrow: "Langkah 6 · Kurasi data",
      title: "1.000 contoh bersih mengalahkan 100.000 contoh kotor",
      prose: [
        "Cerita NusaBank adalah pelajaran kurasi: 31 persen label salah → model mempelajari kesalahan dengan setia. Paper LIMA (2023) menunjukkan 1.000 contoh yang dikurasi fanatik mengalahkan puluhan ribu contoh biasa untuk alignment. Fine-tuning adalah pengeras suara data: sinyal bagus dikuatkan, kebisingan juga dikuatkan. Tidak ada teknik training yang menyelamatkan data buruk.",
        "Checklist kurasi sebelum training apa pun: (1) dedup — contoh duplikat membuat model menghafal, bukan menggeneralisasi; (2) dekontaminasi — pastikan TIDAK ADA contoh evaluasi (golden set) yang bocor ke training; kebocoran = skor palsu yang runtuh saat dipakai nyata; (3) konsistensi format — template, panjang, gaya bahasa seragam; (4) diversitas — cakup variasi instruksi, bukan 10 ribu varian dari 3 pola; (5) untuk DPO — pasangan (dipilih, ditolak) harus benar-benar berbeda kualitasnya; pasangan ambigu melatih selera acak.",
        "💡 Intuisi: anggap setiap contoh training sebagai 'guru les privat' model. 1.000 guru hebat > 100.000 guru yang 31 persennya salah paham materi. Waktu yang kamu hemat dengan melewatkan kurasi akan dibayar 10× lipat saat debugging model yang 'tiba-tiba aneh'.",
        "Alur kerja yang realistis: ambil 500 contoh → kurasi manual sampai sempurna (ini menjadi 'standar emas' gaya) → pakai model/aturan untuk memfilter 50 ribu sisanya terhadap standar itu → sampling audit 5 persen hasil filter. Kurasi bukan 'baca semua data'; kurasi adalah 'definisikan standar, lalu tegakkan dengan mesin + audit manusia'.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: makin banyak data training makin bagus",
        type: "pitfall",
        body: "Yang benar: kurva kualitas-vs-kuantitas mendatar cepat setelah contohnya representatif — penambahan data berisik justru menurunkan kualitas (NusaBank: 50 ribu tiket, 31 persen salah label). Aturannya: tambah data hanya bila menambah DIVERSITAS yang belum tercakup, dan setiap batch baru lolos audit kualitas. 1.000 contoh bersih > 100.000 contoh kotor — ini temuan empiris, bukan slogan.",
      },
      reference: "Dedup, dekontaminasi, konsistensi format, diversitas. Definisikan standar emas, tegakkan dengan mesin.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 7 · Evaluasi",
      title: "Evaluasi: golden set, regresi, dan lupa yang mahal",
      prose: [
        "Skor training turun bukan bukti apa-apa. Evaluasi fine-tune butuh tiga lapis: (1) golden set — 200–1.000 contoh yang diverifikasi manusia, DIKUNCI versinya, tidak pernah masuk training (dekontaminasi). Ini 'tanah' tempat semua klaim berpijak; (2) uji regresi — jalankan ulang evaluasi tugas LAMA (ringkasan, klasifikasi, kepatuhan format versi sebelumnya). Inilah yang menangkap catastrophic forgetting seperti di NusaBank (4,1→3,6); (3) evaluasi manusia/A-B pada sampel nyata — metrik otomatis buta terhadap 'terasa aneh'.",
        "Catastrophic forgetting layak diukur eksplisit, bukan dirasakan: simpan skor baseline tiap kemampuan sebelum fine-tune (tabel: tugas × skor), lalu bandingkan pasca-fine-tune. Penurunan > 5 persen relatif pada tugas penting = sinyal hentikan atau tambahkan replay (campur sedikit data tugas lama ke training). Mitigasi lain: learning rate kecil, epoch sedikit, dan LoRA (parameter yang bergerak sedikit = lupa sedikit — keunggulan tersembunyi adapter).",
        "💡 Intuisi: golden set adalah kontrak, bukan sekadar test set. Test set biasa boleh diganti tiap eksperimen; golden set justru TIDAK BOLEH berubah — karena fungsinya membandingkan 'model Januari vs model Maret' secara adil. Versikan seperti kode: golden-set v3, hasil model A vs B di atasnya.",
        "Jebakan LLM-as-judge: memakai model besar sebagai juri itu murah tapi bias — position bias (cenderung memilih jawaban pertama), verbosity bias (cenderung memilih yang panjang). Kalibrasi dengan sampel yang dinilai manusia; bila kesepakatan juri-vs-manusia < 80 persen, juri tidak boleh dipakai sendirian.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: akurasi naik di test set = fine-tune berhasil",
        type: "pitfall",
        body: "Yang benar: satu metrik naik tidak membuktikan apa-apa bila (a) test set bocor ke training (dekontaminasi!), (b) tugas lama tidak diuji ulang (forgetting!), atau (c) metriknya tidak mengukur yang pengguna rasakan. Fine-tune dinyatakan berhasil hanya bila: golden set naik/tetap + uji regresi tidak ada penurunan berarti + evaluasi manusia/A-B mengonfirmasi. Tiga lapis, bukan satu angka.",
      },
      reference: "Golden set dikunci + uji regresi tugas lama + evaluasi manusia. Satu metrik tidak cukup.",
    },
    {
      id: "lab-lora",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab: aritmetika LoRA vs full fine-tune",
      prose: [
        "Hitung sendiri angka-angka di lesson ini untuk model 7B (d=4096, 32 lapis, 4 matriks q,k,v,o per lapis, rank r=8). Asumsi biaya: full fine-tune butuh 8×A100 80GB × 12 jam × $3/jam — karena optimizer Adam menyimpan 2 state fp32 per parameter (56 GB untuk 7B) + gradien 28 GB + bobot 14 GB, total ~98 GB, tidak muat di 1 GPU. QLoRA: base 4-bit 3,5 GB + adapter 8,4 juta parameter → muat di 1×A100 40GB × 8 jam × $2/jam.",
        "Lengkapi 7 variabel: parameter LoRA per matriks, total parameter LoRA, rasionya terhadap 7 miliar (persen), biaya satu run full vs QLoRA (USD), dan berapa run eksperimen yang bisa dibeli dengan budget $1.000 untuk masing-masing. Angka terakhir adalah inti ceritanya: yang mahal bukan satu run-nya, melainkan berapa kali kamu boleh mencoba.",
        "Coba: ubah r menjadi 64 — berapa persen sekarang, dan apakah biayanya berubah? (Petunjuk: biaya GPU tidak berubah, yang berubah hanya memori adapter.) Lalu ubah ke model 70B (d=8192, 80 lapis): pada r berapa total adapter melewati 1 persen model? Rasakan mengapa 'rank kecil' adalah default yang rasional.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lora_params` total untuk 7B (r=8)" },
        { id: "t2", text: "Hitung `rasio` persen terhadap 7 miliar parameter" },
        { id: "t3", text: "Hitung `biaya_full` dan `biaya_qlora` per run (USD)" },
        { id: "t4", text: "Hitung `run_full` dan `run_qlora`: berapa run untuk budget $1.000" },
      ],
      expected: "lora_params=8388608  rasio=0.12%  biaya_full_usd=288  biaya_qlora_usd=16  run_1000=3v62",
      hints: [
        "Per matriks: r * (d + d). Total: kali matriks per lapis, kali jumlah lapis.",
        "rasio = lora_params / total_param_model * 100; tampilkan 2 desimal.",
        "biaya_full = 8 * 12 * 3; biaya_qlora = 1 * 8 * 2.",
        "run = 1000 // biaya (pembagian bulat).",
      ],
      code: {
        starter: `# Model 7B: d=4096, 32 lapis, 4 matriks per lapis (q,k,v,o), rank r=8\nd, lapis, matriks, r = 4096, 32, 4, 8\ntotal_param_model = 7_000_000_000\n\n# TULIS KODEMU: lengkapi 7 variabel di bawah\nlora_per_matriks = \nlora_params = \nrasio = \nbiaya_full = \nbiaya_qlora = \nrun_full = \nrun_qlora = \n\nprint(f"lora_params={lora_params}  rasio={rasio:.2f}%  biaya_full_usd={biaya_full}  biaya_qlora_usd={biaya_qlora}  run_1000={run_full}v{run_qlora}")`,
        lockLines: 5,
        solution: `# Model 7B: d=4096, 32 lapis, 4 matriks per lapis (q,k,v,o), rank r=8\nd, lapis, matriks, r = 4096, 32, 4, 8\ntotal_param_model = 7_000_000_000\n\n# TULIS KODEMU: lengkapi 7 variabel di bawah\nlora_per_matriks = r * (d + d)\nlora_params = lora_per_matriks * matriks * lapis\nrasio = lora_params / total_param_model * 100\nbiaya_full = 8 * 12 * 3\nbiaya_qlora = 1 * 8 * 2\nrun_full = 1000 // biaya_full\nrun_qlora = 1000 // biaya_qlora\n\nprint(f"lora_params={lora_params}  rasio={rasio:.2f}%  biaya_full_usd={biaya_full}  biaya_qlora_usd={biaya_qlora}  run_1000={run_full}v{run_qlora}")`,
        checks: [
          { kind: "defined", task: "t1", name: "lora_params", label: "`lora_params` terdefinisi", msg: "Simpan total parameter LoRA di lora_params." },
          { kind: "equal", task: "t1", name: "lora_params", value: 8388608, tol: 1, label: "`lora_params` seharusnya 8388608", msg: "65536 per matriks x 4 matriks x 32 lapis = 8388608." },
          { kind: "equal", task: "t2", name: "rasio", value: 0.12, tol: 0.005, label: "`rasio` sekitar 0.12%", msg: "8388608 / 7 miliar x 100 = 0.1198... persen." },
          { kind: "equal", task: "t3", name: "biaya_full", value: 288, tol: 1e-9, label: "`biaya_full` seharusnya 288", msg: "8 GPU x 12 jam x $3 = $288 per run." },
          { kind: "equal", task: "t3", name: "biaya_qlora", value: 16, tol: 1e-9, label: "`biaya_qlora` seharusnya 16", msg: "1 GPU x 8 jam x $2 = $16 per run." },
          { kind: "equal", task: "t4", name: "run_full", value: 3, tol: 1e-9, label: "`run_full` seharusnya 3", msg: "1000 // 288 = 3 run." },
          { kind: "equal", task: "t4", name: "run_qlora", value: 62, tol: 1e-9, label: "`run_qlora` seharusnya 62", msg: "1000 // 16 = 62 run." },
          { kind: "stdout_matches", task: "t4", pattern: "lora_params=8388608\\s+rasio=0\\.12%\\s+biaya_full_usd=288\\s+biaya_qlora_usd=16\\s+run_1000=3v62", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "0,12% parameter, 1/18 biaya, 20x run eksperimen. Itulah ekonomi LoRA.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: prompt, RAG, LoRA, full FT, atau DPO?",
      prose: [
        "Skenario 1 — Butuh format/gaya konsisten, ada 1–50 ribu contoh berkualitas. → SFT dengan LoRA/QLoRA. Alasan: perilaku dan format adalah yang SFT kuasai; LoRA memberi 99 persen manfaat dengan 1 persen biaya.",
        "Skenario 2 — Model butuh fakta produk yang berubah-ubah (harga, SOP, promo). → RAG, bukan fine-tune. Alasan: fakta di data training membusuk; fakta di dokumen yang bisa di-retrieve selalu segar. Fine-tune untuk fakta = halusinasi yang mahal.",
        "Skenario 3 — Budget 1 GPU 24GB, model 7–13B. → QLoRA (r=8–16). Alasan: base 4-bit + adapter kecil muat di GPU konsumen; kualitas setara full fine-tune untuk mayoritas tugas adaptasi.",
        "Skenario 4 — Model sudah pintar tapi 'seleranya' salah: terlalu panjang, tidak sopan, tidak mengikuti nuansa brand. → SFT dulu, lalu DPO dengan 5–50 ribu pasangan preferensi. Alasan: DPO mengajari selera tanpa pipeline RLHF yang berat.",
        "Skenario 5 — Perilaku inti harus berubah total (bahasa baru yang minim di pretraining, domain sangat khusus). → Full fine-tune atau pretraining lanjutan — dan siapkan budget 10–50× lipat. Alasan: adapter rank-rendah tidak cukup untuk pergeseran distribusi yang besar; ini kasus langka, verifikasi dulu skenario 1–4 benar-benar tidak cukup.",
        "Aturan praktis 10 detik: (1) fakta baru = RAG; (2) format/gaya = SFT+LoRA; (3) selera = DPO setelah SFT; (4) mulai dari r=8 dan QLoRA sebelum menyentuh full fine-tune; (5) tidak ada training sebelum checklist kurasi dan golden set siap.",
      ],
      note: {
        title: "💡 Intuisi: urutan yang benar",
        body: "Pretrained → SFT (bisa menjawab) → DPO (selera) → evaluasi (bukti). RAG berjalan paralel sebagai 'pengetahuan', bukan pengganti training. Kebanyakan kegagalan fine-tune di industri = melompat ke training sebelum kurasi, atau memakai fine-tune untuk masalah retrieval.",
      },
      tasks: [],
      reference: "Fakta=RAG. Format=SFT+LoRA. Selera=DPO. Budget kecil=QLoRA.",
    },
    {
      id: "minicase-arus",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Bank Arus: 12.000 tiket per hari, tiga tawaran di meja",
      prose: [
        "Bank Arus memproses 12.000 tiket CS per hari. Target: jawaban mengikuti template eskalasi (format) DAN menyebutkan promo yang benar (fakta). Tiga vendor mengajukan proposal. Vendor A: full fine-tune 13B — 8×A100 80GB × 20 jam × $3 = $480 per run, estimasi 5 run tuning = $2.400, janji 'model hafal semua promo'. Vendor B: QLoRA r=16 pada 13B — 1×A100 40GB × 10 jam × $2 = $20 per run, 10 run = $200, untuk format jawaban. Vendor C: RAG di atas basis pengetahuan promo — setup $300 + biaya inference 12.000×30 hari × $0,002 = $720 per bulan.",
        "Keputusanmu sebagai lead: tolak A, ambil B + C. Alasannya memakai peta langkah 9: promo adalah fakta yang berubah tiap bulan → skenario 2, wajib RAG (janji 'model hafal promo' dari vendor A justru red flag: promo Desember akan dijawab dengan promo Oktober). Format template adalah perilaku → skenario 1, QLoRA cukup ($200 vs $2.400 untuk hasil yang setara pada tugas format).",
        "Pembahasan: total biaya tahun pertama B+C ≈ $200 + $300 + 12×$720 = $9.140 vs A $2.400 — A terlihat lebih murah! Tapi A membayar dengan risiko: promo basi (halusinasi faktual), forgetting, dan setiap update promo butuh re-training. B+C membayar $720/bulan untuk fakta yang selalu segar + format yang patuh. Dalam risk: jawaban promo yang salah = mis-selling = denda regulator. Arsitektur yang benar bukan yang termurah di invoice pertama.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Chatbot yang 'menghafal' promo lewat fine-tune akan menjawab promo kadaluarsa dengan percaya diri — itu mis-selling. Regulator tidak peduli modelnya canggih; yang dinilai adalah kontrol: sumber fakta tunggal (RAG), jejak audit jawaban, dan evaluasi regresi tiap rilis.",
      },
      reference: "Fakta berubah = RAG. Format tetap = QLoRA. Jangan bayar training untuk masalah retrieval.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang SFT, LoRA/QLoRA, DPO, kurasi, dan evaluasi. Perhatikan jebakan 'pengetahuan vs perilaku'.",
      ],
      note: {
        title: "💡 Intuisi: satu kalimat per teknik",
        body: "SFT = 'tirulah format ini'. LoRA = 'ubah sedikit, dengan murah'. QLoRA = 'bekukan pengetahuan dalam 4-bit, latih adapter kecil'. DPO = 'yang kiri lebih kusukai'. Kurasi = 'guru yang buruk melahirkan murid yang buruk'. Golden set = 'kontrak yang tidak boleh berubah'. Enam kalimat ini adalah 80 persen lesson ini.",
      },
      tasks: [],
      summary: [
        "SFT mengajari format dan perilaku lewat pasangan instruksi-respons (loss hanya pada respons); pengetahuan faktual baru bukan pekerjaannya.",
        "LoRA: W' = W₀ + BA — bekukan bobot, latih adapter rank-r; 0,12 persen parameter untuk 7B pada r=8.",
        "QLoRA: base 4-bit beku + adapter presisi penuh → fine-tune 7B di 1 GPU 40GB, 65B di 48GB.",
        "DPO belajar langsung dari pasangan (dipilih, ditolak) tanpa reward model/PPO; urutan: SFT dulu, DPO kemudian; β = rem KL.",
        "Kurasi menentukan segalanya: dedup, dekontaminasi, konsistensi format, diversitas — 1.000 contoh bersih > 100.000 kotor.",
        "Evaluasi tiga lapis: golden set terkunci + uji regresi tugas lama (catastrophic forgetting) + evaluasi manusia/A-B.",
      ],
      next: { label: "DLE12 — Capstone: Proyek DL End-to-End", href: "/v2/learn/dle12-capstone" },
      quiz: [
        {
          q: "Apa yang sebenarnya dipelajari model saat supervised fine-tuning?",
          options: [
            { text: "Pengetahuan faktual baru tentang dunia", why: "Salah: SFT mengubah perilaku, bukan basis pengetahuan. Fakta baru yang dipaksa lewat SFT menjadi halusinasi yang percaya diri." },
            { text: "Format, gaya, dan kepatuhan terhadap instruksi", why: "Benar: SFT mengajari perilaku dan format lewat pasangan instruksi-respons; pengetahuan datang dari pretraining.", correct: true },
            { text: "Kemampuan reasoning yang benar-benar baru", why: "Salah: reasoning muncul dari skala pretraining; SFT hanya mengaktifkan dan mengarahkan kemampuan yang sudah ada." },
            { text: "Bobot di-reset lalu dilatih dari nol", why: "Salah: SFT melanjutkan dari bobot pretrained dengan learning rate kecil." },
          ],
        },
        {
          q: "LoRA dengan r=8 pada matriks bobot 4096×4096 melatih berapa parameter?",
          options: [
            { text: "16.777.216 (seluruh matriks)", why: "Itu jumlah parameter full fine-tune: 4096×4096." },
            { text: "65.536", why: "Benar: r×(d+k) = 8×8192 = 65.536 — hanya 0,39 persen matriks.", correct: true },
            { text: "131.072", why: "Itu untuk r=16, bukan r=8." },
            { text: "8 (sama dengan rank)", why: "Rank bukan jumlah parameter; parameter = r×(d+k)." },
          ],
        },
        {
          q: "Mengapa QLoRA bisa fine-tune model 7B di GPU 24GB?",
          options: [
            { text: "Ukuran model diperkecil menjadi 1B", why: "Salah: base model tetap 7B penuh, hanya dikuantisasi." },
            { text: "Bobot base dibekukan dalam 4-bit dan hanya adapter kecil yang dilatih", why: "Benar: 7B→3,5 GB (4-bit) + adapter 8,4 juta parameter; optimizer hanya menyimpan state untuk adapter.", correct: true },
            { text: "Training dilakukan tanpa menghitung gradien", why: "Salah: gradien tetap dihitung — hanya untuk parameter adapter." },
            { text: "Data training-nya jauh lebih sedikit", why: "Salah: jumlah data tidak menentukan kebutuhan VRAM model." },
          ],
        },
        {
          q: "Perbedaan utama DPO dibanding RLHF klasik?",
          options: [
            { text: "DPO tidak membutuhkan data preferensi manusia", why: "Salah: DPO justru belajar dari pasangan (dipilih, ditolak) — data preferensi tetap wajib." },
            { text: "DPO menghilangkan reward model dan PPO, belajar langsung dari pasangan preferensi", why: "Benar: satu training loop yang stabil; reward-nya implisit dalam rasio policy vs referensi.", correct: true },
            { text: "DPO hanya dipakai untuk pretraining", why: "Salah: DPO adalah tahap alignment setelah SFT." },
            { text: "DPO tidak memakai model referensi", why: "Salah: π_ref justru inti loss DPO; β mengatur penalti penyimpangan darinya." },
          ],
        },
        {
          q: "Risiko terbesar fine-tune pada 50 ribu tiket CS mentah tanpa kurasi?",
          options: [
            { text: "Tagihan GPU terlalu mahal", why: "Itu masalah biaya, bukan risiko terbesar terhadap kualitas dan kepatuhan." },
            { text: "Model menghafal kebisingan label dan data pribadi pelanggan", why: "Benar: SFT mengabadikan data apa adanya — label salah dipelajari (kasus NusaBank) dan PII bisa dimuntahkan kembali (risiko UU PDP).", correct: true },
            { text: "Model menjadi terlalu kecil untuk dipakai", why: "Ukuran model tidak berubah saat fine-tuning." },
            { text: "Tidak ada risiko selama loss turun", why: "Loss turun justru menutupi masalah: menghafal kebisingan juga menurunkan loss." },
          ],
        },
        {
          q: "Golden set yang dikunci versinya + uji regresi terutama menangkap?",
          options: [
            { text: "Overfitting ke data training", why: "Itu ditangkap validasi biasa; golden set + regresi punya target berbeda." },
            { text: "Catastrophic forgetting — degradasi kemampuan lama setelah fine-tune", why: "Benar: uji regresi menjalankan ulang evaluasi tugas lama; penurunan berarti = model melupakan.", correct: true },
            { text: "Kecepatan inference yang melambat", why: "Kecepatan tidak berubah oleh fine-tune (arsitektur sama)." },
            { text: "Jumlah parameter yang bertambah", why: "Fine-tune tidak menambah parameter (kecuali adapter yang bisa digabung)." },
          ],
        },
      ],
    },
  ],
};
