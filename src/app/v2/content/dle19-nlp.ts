import type { V2Lesson } from "../lib/types";

// Alur BPE: korpus kecil -> hitung pasangan -> merge tersering -> tokenisasi kata baru.
const BPE_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram alur BPE: hitung pasangan simbol, gabung yang tersering, tokenisasi kata baru.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="20" y="30" width="110" height="60" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="75" y="52" fill="var(--text)" font-weight="600">korpus</text>
<text x="75" y="70" fill="var(--text-muted)" font-size="11">makan, makanan,</text>
<text x="75" y="84" fill="var(--text-muted)" font-size="11">memakan, pemakan</text>
<rect x="170" y="30" width="110" height="60" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="225" y="52" fill="#fff" font-weight="600">hitung pasangan</text>
<text x="225" y="70" fill="#fff" font-size="11">(a,n) = 5</text>
<text x="225" y="84" fill="#fff" font-size="11">terbanyak!</text>
<rect x="320" y="30" width="110" height="60" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="375" y="52" fill="#fff" font-weight="600">merge</text>
<text x="375" y="70" fill="#fff" font-size="11">a + n -&gt; "an"</text>
<text x="375" y="84" fill="#fff" font-size="11">token baru</text>
<rect x="470" y="30" width="70" height="60" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="505" y="52" fill="#fff" font-weight="600">token</text>
<text x="505" y="70" fill="#fff" font-size="11">d i m a k</text>
<text x="505" y="84" fill="#fff" font-size="11">"an" &lt;/w&gt;</text>
<rect x="170" y="130" width="260" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="300" y="152" fill="var(--text)">"dimakan" -&gt; d i m a k "an" &lt;/w&gt;</text>
<text x="300" y="168" fill="var(--text-muted)" font-size="11">kata BARU ikut terpotong rapi</text>
<rect x="170" y="200" width="260" height="52" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="300" y="222" fill="var(--text)">token &#8800; kata: 7 token utk 1 kata</text>
<text x="300" y="238" fill="var(--text-muted)" font-size="11">anggaran konteks dlm TOKEN, bukan kata</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ahb)">
<defs><marker id="ahb" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="130" y1="60" x2="168" y2="60"/><line x1="280" y1="60" x2="318" y2="60"/><line x1="430" y1="60" x2="468" y2="60"/>
<line x1="300" y1="90" x2="300" y2="128"/><line x1="300" y1="182" x2="300" y2="198"/>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text-muted)" text-anchor="middle">
<text x="300" y="278">BPE = kompresi serakah: pasangan tersering digabung, diulang sampai vocab penuh.</text>
</g>
</svg>`;

export const dle19: V2Lesson = {
  slug: "dle19-nlp",
  track: "Deep Learning Engineer",
  module: "Arsitektur Modern",
  title: "DLE19 — NLP: Dari Token ke Makna",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model bahasa tidak membaca kata — ia membaca token. Satu kata Indonesia berimbuhan bisa pecah menjadi 6 token, dan setiap token adalah baris dalam matriks raksasa yang dipelajari dari miliaran kalimat. Lesson ini menelusuri tiga lapis NLP modern: (1) tokenisasi BPE — cara mesin memotong teks; (2) embedding — cara potongan itu menjadi angka bermakna; (3) fine-tuning — cara satu model dasar disulap menjadi tiga pekerja berbeda (klasifikasi, NER, seq2seq), plus catatan sumber daya bahasa Indonesia.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjalankan algoritma BPE dengan tangan pada korpus kecil dan menjelaskan mengapa merge yang terpilih masuk akal; (2) menghitung anggaran konteks dalam token (bukan kata) untuk teks Indonesia berimbuhan; (3) membedakan embedding statis vs kontekstual dan menjelaskan peran cosine similarity; (4) memilih arsitektur fine-tuning yang tepat untuk klasifikasi teks, NER, dan seq2seq; (5) menyebut sumber daya bahasa Indonesia yang lazim dipakai komunitas beserta cara memverifikasinya.",
        "Isi lesson: cerita chatbot yang kehabisan konteks → BPE langkah demi langkah → embedding & cosine → tiga kepala fine-tuning → lab BPE dari nol → peta keputusan → mini-case 12.000 keluhan nasabah → checkpoint.",
      ],
      tasks: [],
      reference: "Token -> embedding -> tugas. Tiga lapis, satu alur.",
    },
    {
      id: "cerita-chatbot-token",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Chatbot yang kehabisan napas di tengah kalimat",
      prose: [
        "Bank meluncurkan chatbot CS dengan jendela konteks 8.192 token. Tim produk menghitung kebutuhan dengan cara yang terasa masuk akal: instruksi sistem 400 kata + riwayat 1.500 kata + jawaban 500 kata = 2.400 kata, jauh di bawah 8.192. Aman, kata mereka.",
        "Minggu kedua, seorang nasabah menulis keluhan panjang dengan kata-kata seperti “mempertanggungjawabkannya” dan “ketidakberdayaan”. Chatbot menjawab — lalu di tengah jawaban menyebut nominal denda yang justru dilarang disebut oleh instruksi sistem. Instruksi itu terpotong dari konteks. Keluhan nasabah viral: 120 ribu views dalam 2 hari, tim CS lembur 3 hari menangani 400+ tiket susulan.",
        "Twist-nya: modelnya tidak bodoh dan instruksinya tidak salah tulis. Tim menghitung dalam kata, model menghitung dalam token. Kata berimbuhan Indonesia pecah menjadi 5–7 token; rasio token-per-kata mencapai 1,7. Instruksi 400 kata = 680 token, riwayat 1.500 kata = 2.550 token — masih aman. Tetapi keluhan nasabah yang “hanya” 3.000 kata = 5.100 token, dan total menyentuh 8.192 tepat di tengah instruksi keamanan. Satu asumsi satuan yang salah, satu kegagalan produksi.",
        "Lesson ini memastikan kamu tidak mengulangi kesalahan satuan itu — dan memahami tiga lapis yang membuat model bahasa bekerja: tokenisasi, embedding, dan fine-tuning per tugas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Instruksi kepatuhan yang terpotong dari konteks = risiko operasional dan reputasi. Aturan praktis: anggarkan SELALU dalam token, dan untuk teks Indonesia berimbuhan kalikan estimasi kata dengan 1,7 sebelum menjanjikan kapasitas ke stakeholder.",
      },
      reference: "Model menghitung token, bukan kata. Salah satuan = konteks terpotong.",
    },
    {
      id: "tokenisasi-bpe",
      eyebrow: "Langkah 3 · Tokenisasi",
      title: "BPE: mesin yang menemukan imbuhan tanpa diajari",
      prose: [
        "Byte-Pair Encoding (BPE) adalah kompresi serakah. Mulai dari alfabet karakter, ulangi: hitung semua pasangan simbol bersebelahan di korpus, gabung pasangan tersering menjadi token baru. Berhenti saat vocabulary mencapai ukuran target (mis. 50.272). Tidak ada kamus, tidak ada aturan bahasa — hanya frekuensi.",
        "Contoh nyata dari lab lesson ini. Korpus: makan, makanan, memakan, pemakan. Pasangan dihitung: (a,n) muncul 5 kali — terbanyak. Merge pertama: a + n → “an”. Perhatikan: BPE baru saja “menemukan” akhiran -an bahasa Indonesia tanpa pernah diajari morfologi. Itulah kekuatan dan keterbatasannya: ia menemukan pola statistik, bukan makna.",
        "Merge kedua (imbang di angka 4, diambil yang pertama ditemui): m + a → “ma”. Kata “makan” kini terwakili 3 token: “ma”, “k”, “an” — bukan 1 kata, bukan 5 karakter. Kata baru “dimakan” yang TIDAK ADA di korpus tetap bisa ditokenisasi: d, i, m, a, k, “an”, </w>. Tidak ada kata yang benar-benar “asing” bagi BPE — paling buruk ia jatuh kembali ke karakter per karakter.",
        "Konsekuensi praktisnya tiga. Pertama, token ≠ kata: “mempertanggungjawabkannya” bisa menjadi 6–7 token — anggaran konteks, biaya API per token, dan latensi semuanya mengikuti token. Kedua, bahasa berimbuhan seperti Indonesia sistematis lebih “mahal” tokennya dibanding Inggris untuk makna yang sama. Ketiga, teks di luar distribusi training (kode, bahasa daerah, istilah medis) terpotong menjadi token-token kecil yang nyaris tanpa makna — model buta terhadapnya.",
        "Cara membaca: empat kotak atas = alur BPE (korpus → hitung pasangan → merge → token); dua kotak bawah = pelajaran gandanya (kata baru tetap tertangani; token tidak sama dengan kata).",
        "Interpretasi: BPE adalah kompromi elegan antara vocabulary tertutup (tidak bisa menangani kata baru) dan karakter murni (sekuens terlalu panjang). Harganya: satuan hitung yang tidak intuitif bagi manusia.",
        "💡 Intuisi: BPE menemukan morfologi sebagai efek samping frekuensi. Akhiran -an, awalan me- dan pe- sering muncul → sering di-merge → menjadi token. Tokenizer Inggris yang dilatih dominan di korpus Inggris akan memotong kata Indonesia secara “canggung” — itulah alasan model multilingual/bahasa Indonesia memakai tokenizer yang dilatih dengan porsi korpus Indonesia memadai.",
      ],
      figure: {
        svg: BPE_SVG,
        alt: "Diagram alur BPE: dari korpus kecil dihitung pasangan tersering, di-merge menjadi token baru, lalu dipakai memotong kata baru.",
        caption: "BPE: hitung pasangan → gabung yang tersering → tokenisasi kata apa pun.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 8.192 token ≈ 8.192 kata",
        type: "pitfall",
        body: "Yang benar: untuk teks Indonesia berimbuhan, 8.192 token ≈ 4.800 kata (aturan praktis ÷1,7). Tim yang menganggarkan kapasitas, biaya, atau SLA dalam “kata” akan kelebihan janji sekitar 70%. Selalu konversi ke token dengan tokenizer yang SAMA dengan model yang dipakai — tokenizer berbeda, hitungan berbeda.",
      },
      reference: "BPE = gabung pasangan tersering, ulang sampai vocab penuh. Token bukan kata.",
    },
    {
      id: "embedding",
      eyebrow: "Langkah 4 · Embedding",
      title: "Embedding: makna menjadi angka, konteks menjadi makna",
      prose: [
        "Setiap token di vocabulary mendapat satu baris dalam matriks embedding E (vocab × d): token “bank” = vektor 768 angka. Awalnya acak; training menggesernya sehingga token yang muncul di konteks mirip menjadi vektor yang berdekatan. “Bank” (lembaga keuangan) dan “kredit” berakhir bertetangga; “bank” dan “kursi” berjauhan.",
        "Kedekatan diukur dengan cosine similarity: cosinus sudut antara dua vektor. Nilai 1 = arah sama persis, 0 = tegak lurus (tidak terkait), −1 = berlawanan. Inilah matematika di balik “kata mirip” di semua sistem retrieval modern.",
        "Masalahnya: satu token, satu vektor — padahal “bisa” berarti “dapat” dalam “saya bisa datang” dan “racun” dalam “ular berbisa”. Embedding statis (word2vec era lama) gagal di sini. Embedding kontekstual (Transformer) menghitung ulang representasi tiap token dari SELURUH kalimat lewat attention: “bisa” setelah “saya” mendapat vektor berbeda dari “bisa” setelah “ular ber-”. Makna bukan milik kata — milik kata-dalam-kalimat.",
        "Contoh angka cosine — 2 dimensi. v(bank) = [0,9, 0,2], v(kredit) = [0,8, 0,35], v(kursi) = [0,1, 0,95]. cos(bank, kredit) = (0,72+0,07)/(0,922×0,873) = 0,79/0,805 ≈ 0,98 — sangat mirip. cos(bank, kursi) = (0,09+0,19)/(0,922×0,955) = 0,28/0,880 ≈ 0,32 — jauh. Satu angka merangkum “seberapa mirip dua makna” — dan seluruh industri vector search berdiri di atasnya.",
        "💡 Intuisi: embedding adalah peta, cosine adalah penggarisnya. Training = menggambar ulang peta jutaan kali sampai kota-kota yang sering disebut bersamaan menjadi bertetangga. Attention = lensa yang menggambar ulang peta untuk tiap kalimat spesifik.",
      ],
      formula: String.raw`\mathrm{cos}(u, v) = \frac{u \cdot v}{\|u\|\,\|v\|} = \frac{\sum_{i=1}^{d} u_i v_i}{\sqrt{\sum_i u_i^2}\,\sqrt{\sum_i v_i^2}}`,
      formulaNote: "u, v = dua vektor embedding (dimensi d); u·v = dot product (jumlah perkalian per komponen); ||u|| = panjang vektor (norma). Hasil di rentang −1 sampai 1: 1 = arah makna sama, 0 = tidak terkait.",
      tasks: [],
      note: {
        title: "🚨 Mitos: cosine tinggi = sinonim, pasti bisa ditukar",
        type: "pitfall",
        body: "Yang benar: cosine mengukur kedekatan distribusional (sering muncul di konteks mirip), bukan kesepadanan makna. “Murah” dan “mahal” bisa ber-cosine tinggi karena sama-sama kata sifat harga — tertukar dalam chatbot bank = bencana. Jangan pakai ambang cosine mentah sebagai kebenaran semantik tanpa evaluasi pada data tugasmu.",
      },
      reference: "Satu token satu vektor (statis) vs vektor per konteks (kontekstual). Cosine = penggaris makna.",
    },
    {
      id: "finetuning-tugas",
      eyebrow: "Langkah 5 · Fine-tuning",
      title: "Satu tubuh, tiga kepala: klasifikasi, NER, seq2seq",
      prose: [
        "Pretrained model adalah tubuh serbaguna; fine-tuning memasang kepala khusus per tugas. Tiga pola mencakup sebagian besar pekerjaan NLP industri.",
        "Kepala 1 — klasifikasi teks. Ambil representasi kalimat (rata-rata token atau token khusus [CLS]), lewatkan ke lapisan linear + softmax menjadi distribusi peluang atas K kelas. Contoh: keluhan nasabah → {tagihan, layanan, aplikasi}. Rumusnya: peluang kelas c = softmax(z)_c. Training memakai cross-entropy: model dihukum berat saat yakin pada jawaban salah.",
        "Kepala 2 — NER (Named Entity Recognition). Klasifikasi PER TOKEN, bukan per kalimat, dengan skema BIO: B-NOMINAL (awal entitas), I-NOMINAL (lanjutan), O (bukan entitas). Kalimat “Denda Rp250.000 dibayar Budi” → Denda/O Rp250.000/B-NOMINAL dibayar/O Budi/B-NAMA. Outputnya span terstruktur — fondasi ekstraksi dokumen, redaksi PII, dan audit.",
        "Kepala 3 — sequence-to-sequence. Input sekuens → output sekuens: terjemahan, ringkasan, chatbot. Dua arsitektur: encoder-decoder (encoder membaca seluruh input, decoder menulis output sambil “melihat” encoder via cross-attention — presisi, klasik untuk terjemahan) vs decoder-only (satu tumpukan yang membaca prompt lalu melanjutkan tulisan — sederhana, dominan di era LLM). Pilih encoder-decoder saat alignment input-output penting; decoder-only saat fleksibilitas generatif lebih utama.",
        "Catatan sumber daya bahasa Indonesia — dibaca sebagai peta, bukan vonis. Komunitas memakai rangkaian benchmark IndoNLU (kumpulan tugas evaluasi bahasa Indonesia: sentimen, NER, dan lainnya) untuk mengukur model secara adil. Model pretrained bahasa Indonesia (mis. varian IndoBERT) tersedia publik sebagai titik awal fine-tuning. Angka benchmark berubah tiap rilis — verifikasi ke dokumentasi resmi model/dataset sebelum mengutipnya ke stakeholder, jangan mengandalkan ingatan atau slide lama.",
        "💡 Intuisi: fine-tuning = sekolah kejuruan setelah universitas. Pretraining memberi pemahaman bahasa umum dari miliaran kata; fine-tuning 5–50 ribu sampel berlabel mengarahkannya ke satu pekerjaan. Kebalikannya (latih dari nol untuk satu tugas) membuang “universitas”-nya — mahal dan hampir selalu kalah.",
      ],
      formula: String.raw`P(y = c \mid x) = \frac{e^{z_c}}{\sum_{k=1}^{K} e^{z_k}}, \qquad \mathcal{L} = -\log P(y = c^* \mid x)`,
      formulaNote: "x = representasi kalimat; z_c = skor (logit) kelas c dari lapisan linear; K = jumlah kelas; e^z = eksponensial; P(y=c|x) = peluang model untuk kelas c (jumlah semua kelas = 1); c* = label benar; L = cross-entropy loss — makin yakin pada jawaban salah, makin besar hukumannya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: fine-tune sedikit data selalu aman",
        type: "pitfall",
        body: "Yang benar: fine-tuning agresif pada 500–2.000 sampel bisa memicu catastrophic forgetting — model “lupa” kemampuan umum pretraining-nya sambil menghafal data kecilmu. Gejalanya: akurasi training 99%, validasi anjlok, dan model gagal pada kalimat yang sedikit berbeda. Obatnya: learning rate kecil, early stopping, dan uji pada data yang benar-benar baru (bukan parafrase data training).",
      },
      reference: "Klasifikasi = kepala per kalimat; NER = kepala per token (BIO); seq2seq = kepala generatif.",
    },
    {
      id: "lab-bpe",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: BPE mini dari nol",
      prose: [
        "Sekarang giliranmu menjalankan BPE seperti di Langkah 3 — tanpa library, hanya Python standar. Korpusnya empat kata Indonesia: makan, makanan, memakan, pemakan.",
        "Tugasmu dua: (t1) hitung semua pasangan simbol bersebelahan (tiap kata diakhiri penanda </w>) dan temukan pasangan tersering best_pair; (t2) lakukan satu merge pasangan itu, lalu tokenisasi kata BARU “dimakan” yang tidak ada di korpus.",
        "Hasil yang diharapkan: merge_1=an dan token_dimakan=['d', 'i', 'm', 'a', 'k', 'an', '</w>']. Perhatikan — “an” yang di-merge adalah akhiran bahasa Indonesia yang ditemukan murni dari frekuensi, dan kata asing “dimakan” tetap tertangani.",
      ],
      tasks: [
        { id: "t1", text: "Hitung pasangan simbol tiap kata (akhiri dengan `</w>`), simpan pasangan tersering di `best_pair` (sebagai list)" },
        { id: "t2", text: "Merge `best_pair` sekali, lalu tokenisasi kata baru “dimakan” → `token_dimakan`" },
      ],
      expected: "merge_1=an  token_dimakan=['d', 'i', 'm', 'a', 'k', 'an', '</w>']",
      hints: [
        "Pasangan bersebelahan: zip(simbol, simbol[1:]); hitung dengan dict.",
        "Pasangan tersering: list(max(hitung, key=hitung.get)) — simpan sebagai list.",
        "Merge: geser dengan while; saat simbol[i],simbol[i+1] cocok dengan pasangan → gabung, lompat 2.",
      ],
      code: {
        starter: `korpus = ["makan", "makanan", "memakan", "pemakan"]

# TULIS KODEMU: hitung pasangan, temukan yang tersering
def pasangan_semua(kata_list):
    hitung = {}
    for w in kata_list:
        simbol = list(w) + ["</w>"]
        for a, b in zip(simbol, simbol[1:]):
            hitung[(a, b)] = hitung.get((a, b), 0) + 1
    return hitung

hitung = 
best_pair = 

# TULIS KODEMU: merge best_pair, lalu tokenisasi "dimakan"
def terapkan(kata, pas):
    a, b = pas
    simbol = list(kata) + ["</w>"]
    baru, i = [], 0
    while i < len(simbol):
        if i < len(simbol) - 1 and simbol[i] == a and simbol[i + 1] == b:
            baru.append(a + b)
            i += 2
        else:
            baru.append(simbol[i])
            i += 1
    return baru

token_dimakan = 

print(f"merge_1={''.join(best_pair)}")
print(f"token_dimakan={token_dimakan}")`,
        lockLines: 11,
        solution: `korpus = ["makan", "makanan", "memakan", "pemakan"]

# TULIS KODEMU: hitung pasangan, temukan yang tersering
def pasangan_semua(kata_list):
    hitung = {}
    for w in kata_list:
        simbol = list(w) + ["</w>"]
        for a, b in zip(simbol, simbol[1:]):
            hitung[(a, b)] = hitung.get((a, b), 0) + 1
    return hitung

hitung = pasangan_semua(korpus)
best_pair = list(max(hitung, key=hitung.get))

# TULIS KODEMU: merge best_pair, lalu tokenisasi "dimakan"
def terapkan(kata, pas):
    a, b = pas
    simbol = list(kata) + ["</w>"]
    baru, i = [], 0
    while i < len(simbol):
        if i < len(simbol) - 1 and simbol[i] == a and simbol[i + 1] == b:
            baru.append(a + b)
            i += 2
        else:
            baru.append(simbol[i])
            i += 1
    return baru

token_dimakan = terapkan("dimakan", best_pair)

print(f"merge_1={''.join(best_pair)}")
print(f"token_dimakan={token_dimakan}")`,
        checks: [
          { kind: "defined", task: "t1", name: "best_pair", label: "`best_pair` terdefinisi", msg: "Simpan pasangan tersering di best_pair." },
          { kind: "equal", task: "t1", name: "best_pair", value: ["a", "n"], label: "`best_pair` seharusnya ['a', 'n']", msg: "Pasangan (a,n) muncul 5 kali — terbanyak. Hitung per kata: makan=1, makanan=2, memakan=1, pemakan=1." },
          { kind: "defined", task: "t2", name: "token_dimakan", label: "`token_dimakan` terdefinisi", msg: "Tokenisasi kata 'dimakan' dengan best_pair." },
          { kind: "equal", task: "t2", name: "token_dimakan", value: ["d", "i", "m", "a", "k", "an", "</w>"], label: "`token_dimakan` seharusnya ['d','i','m','a','k','an','</w>']", msg: "Hanya pasangan a+n yang digabung; sisanya tetap per karakter." },
          { kind: "stdout_matches", task: "t2", pattern: "merge_1=an", label: "`print` menampilkan merge_1", msg: "Format: merge_1=an." },
          { kind: "stdout_matches", task: "t2", pattern: "token_dimakan=\\['d', 'i', 'm', 'a', 'k', 'an', '</w>'\\]", label: "`print` menampilkan token_dimakan", msg: "Samakan format list dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "🚨 Mitos: BPE selalu menemukan morfologi yang “benar”",
        type: "pitfall",
        body: "Yang benar: BPE itu serakah dan buta makna — ia menggabung yang tersering, bukan yang benar secara linguistik. Di korpus ini “an” beruntung berupa akhiran asli; di korpus lain ia bisa menggabung “ng” + “a” menjadi token tanpa arti morfologis. Jangan membaca struktur bahasa dari vocabulary tokenizer — baca dari frekuensinya.",
      },
      reference: "Satu merge BPE = pasangan tersering digabung. Kata baru tidak pernah benar-benar asing.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: arsitektur apa untuk tugas bahasamu?",
      prose: [
        "Skenario 1 — Keluhan/sentimen/deteksi topik (output = label). → Fine-tune encoder + kepala klasifikasi. Alasan: satu label per dokumen; butuh pemahaman, bukan generasi. 5–20 ribu sampel berlabel cukup.",
        "Skenario 2 — Ekstraksi dari dokumen (nama, nominal, tanggal). → NER token-level dengan skema BIO. Alasan: butuh posisi presisi per kata; klasifikasi kalimat tidak memberi tahu DI MANA entitasnya.",
        "Skenario 3 — Ringkasan, terjemahan, chatbot. → Seq2seq: encoder-decoder bila alignment penting (terjemahan kontrak), decoder-only bila fleksibilitas generatif utama (chatbot). Alasan: outputnya teks bebas, bukan label.",
        "Skenario 4 — Bahasa Indonesia domain spesifik (medis, hukum) dengan data kecil. → Mulai dari pretrained multilingual/Indonesia + fine-tune; ukur dengan benchmark sekelas IndoNLU sebelum klaim. Alasan: pretraining = pengetahuan bahasa gratis; latih dari nol = buang-buang compute dan hampir pasti kalah.",
        "Skenario 5 — Latensi ketat atau budget token terbatas. → Model kecil + hitung token-per-kata 1,7 untuk Indonesia + pertimbangkan distilasi. Alasan: biaya dan latensi mengikuti token, dan teks Indonesia “lebih panjang” dalam token.",
        "Aturan praktis 10 detik: (1) tentukan dulu outputnya — label, span, atau teks bebas; (2) cari pretrained yang cocok sebelum latih dari nol; (3) anggarkan konteks dalam token (×1,7 untuk Indonesia); (4) verifikasi angka benchmark ke sumber resmi, bukan ingatan.",
      ],
      note: {
        title: "💡 Intuisi: output menentukan arsitektur",
        body: "Satu pertanyaan memangkas kebingungan: apa bentuk jawabannya? Label tunggal → klasifikasi. Potongan teks → NER. Teks baru → seq2seq. Tiga kepala di Langkah 5 bukan teori — ia adalah taksonomi keputusan.",
      },
      tasks: [],
      reference: "Label → klasifikasi; span → NER; teks bebas → seq2seq. Pretrained dulu, token selalu.",
    },
    {
      id: "minicase-keluhan",
      eyebrow: "Langkah 8 · Mini-case",
      title: "12.000 keluhan nasabah: dari keyword ke fine-tune",
      prose: [
        "Bank memiliki 12.000 keluhan nasabah setahun, 3 kategori: tagihan, layanan, aplikasi. Baseline keyword: daftar 40 kata kunci per kategori → akurasi 61%. Masalahnya: “bisa” (dapat) vs “berbisa” lolos; “tidak bisa login” vs “bisa login tapi lambat” salah kategori — keyword buta konteks.",
        "Solusi: fine-tune encoder pretrained bahasa Indonesia pada 8.000 keluhan berlabel (4.000 validasi, sisanya 4.000 untuk uji akhir yang belum pernah dilihat). Hasil: akurasi 89% pada uji akhir. Biaya pelabelan: 8.000 × Rp2.500 = Rp20 juta sekali bayar. Penghematan: triase manual 15 menit → 2 menit per keluhan; 12.000 keluhan × 13 menit × Rp50 ribu/jam ≈ Rp130 juta/tahun.",
        "Pembahasan: kemenangan ini bukan “AI ajaib” — ia adalah tiga lapis lesson ini yang bekerja. Tokenisasi menangani kata berimbuhan (“ketidakmampuan” tetap terpotong rapi); embedding kontekstual membedakan “bisa” per kalimat; kepala klasifikasi mengubah pemahaman menjadi keputusan. Angka 61% → 89% adalah ilustrasi pola yang umum terjadi, bukan janji — replikasikan pengukurannya di datamu sendiri sebelum mempresentasikan ROI.",
        "Jebakan yang dihindari tim ini: mereka TIDAK mengklaim angka benchmark publik dari ingatan, mereka mengukur di data sendiri; mereka TIDAK melatih dari nol (8.000 sampel tidak cukup); mereka menganggarkan inference dalam token saat menghitung biaya serving.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: ukur di datamu, bukan di paper orang",
        type: "risk",
        body: "Angka benchmark publik (termasuk yang sekelas IndoNLU) mengukur model di distribusi orang lain. Keputusan bisnis — Rp20 juta pelabelan, Rp130 juta penghematan — hanya sah dari pengukuran di distribusi keluhanmu sendiri. Paper = petunjuk arah; datamu = vonis.",
      },
      reference: "61% keyword → 89% fine-tune: ilustrasi pola umum. Replikasikan di datamu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang tokenisasi, embedding, dan fine-tuning.",
      ],
      tasks: [],
      summary: [
        "BPE = gabung pasangan simbol tersering, diulang sampai vocab penuh; ia menemukan pola frekuensi (kadang berupa imbuhan), bukan makna.",
        "Token ≠ kata: anggarkan konteks, biaya, dan latensi dalam token — aturan praktis ×1,7 token per kata Indonesia.",
        "Embedding mengubah token menjadi vektor; cosine similarity mengukur kedekatan makna; embedding kontekstual memberi tiap token vektor berbeda per kalimat.",
        "Satu tubuh pretrained, tiga kepala: klasifikasi (label per kalimat), NER (label per token, skema BIO), seq2seq (teks bebas; encoder-decoder vs decoder-only).",
        "Untuk bahasa Indonesia: mulai dari pretrained yang sesuai, ukur dengan benchmark sekelas IndoNLU, verifikasi angka ke sumber resmi.",
        "Fine-tuning data kecil berisiko catastrophic forgetting — learning rate kecil, early stopping, uji di data benar-benar baru.",
      ],
      quiz: [
        {
          q: "BPE memilih pasangan simbol untuk di-merge berdasarkan?",
          options: [
            { text: "Kebenaran morfologis menurut kamus", why: "BPE tidak punya kamus — ia buta linguistik.", },
            { text: "Frekuensi kemunculan tertinggi di korpus", why: "Definisi algoritmanya: pasangan tersering digabung, diulang. Morfologi yang muncul hanyalah efek samping frekuensi.", correct: true },
            { text: "Urutan alfabetis pasangan", why: "Alfabet tidak berperan dalam pemilihan merge.", },
            { text: "Panjang kata asalnya", why: "BPE bekerja pada level pasangan simbol, bukan panjang kata.", },
          ],
        },
        {
          q: "Kata “mempertanggungjawabkannya” menjadi 6–7 token. Implikasi untuk batas konteks 8.192?",
          options: [
            { text: "Tidak masalah, 8.192 kata cukup untuk apa pun", why: "Batasnya 8.192 token, bukan kata.", },
            { text: "Anggarkan kapasitas dalam token (≈ ÷1,7 untuk teks Indonesia), bukan kata", why: "Rasio token-per-kata Indonesia berimbuhan ≈1,7 — hitungan kata kelebihan janji ~70%.", correct: true },
            { text: "Ganti tokenizer agar 1 kata = 1 token", why: "Itu mengembalikan masalah vocabulary tak terbatas yang justru dipecahkan BPE.", },
            { text: "Potong semua kata berimbuhan sebelum input", why: "Merusak makna; solusinya akuntansi token yang benar, bukan merusak input.", },
          ],
        },
        {
          q: "Mengapa embedding kontekstual memisahkan “bisa” (=dapat) dari “bisa” (=racun)?",
          options: [
            { text: "Karena keduanya token yang berbeda di vocabulary", why: "Tokennya sama persis — “bisa” satu entri.", },
            { text: "Karena representasi tiap token dihitung ulang dari seluruh kalimat via attention", why: "Konteks “saya … datang” vs “ular ber- …” menggeser vektornya ke wilayah makna berbeda.", correct: true },
            { text: "Karena cosine similarity-nya selalu 1", why: "Cosine 1 berarti identik — justru yang ingin dihindari di sini.", },
            { text: "Karena BPE memotongnya berbeda", why: "Pemotongannya sama; yang berbeda adalah representasi kontekstualnya.", },
          ],
        },
        {
          q: "Tugas: ekstraksi nama nasabah dan nominal dari dokumen. Kepala fine-tuning yang tepat?",
          options: [
            { text: "Klasifikasi satu label per dokumen", why: "Label dokumen tidak memberi tahu posisi entitas di dalam teks.", },
            { text: "Klasifikasi per token dengan skema BIO", why: "NER = label tiap token (B-NAMA/I-NOMINAL/O) sehingga span entitas terlokalisasi presisi.", correct: true },
            { text: "Seq2seq generatif tanpa batasan", why: "Generasi bebas berisiko halusinasi nominal — untuk ekstraksi presisi, label per token lebih terkontrol.", },
            { text: "Tanpa fine-tuning, keyword saja", why: "Keyword buta konteks dan variasi penulisan — baseline 61% di mini-case.", },
          ],
        },
        {
          q: "Meringkas dokumen hukum 10 halaman ke 1 halaman — arsitektur yang tepat?",
          options: [
            { text: "Klasifikasi teks", why: "Output yang dibutuhkan teks ringkasan, bukan label.", },
            { text: "NER", why: "NER mengekstrak span, bukan menulis ringkasan koheren.", },
            { text: "Seq2seq generatif (encoder-decoder atau decoder-only)", why: "Input sekuens → output sekuens teks bebas adalah definisi tugas seq2seq.", correct: true },
            { text: "Regresi linear", why: "Bukan masalah prediksi angka kontinu.", },
          ],
        },
        {
          q: "Fine-tune model besar pada 800 sampel tanpa early stopping. Risiko utama?",
          options: [
            { text: "Model menjadi terlalu cepat", why: "Kecepatan inference tidak dipengaruhi jumlah data fine-tuning.", },
            { text: "Catastrophic forgetting + overfitting: akurasi training tinggi, validasi anjlok, kemampuan umum memudar", why: "Data kecil + training agresif = menghafal sampel sambil merusak pengetahuan pretraining.", correct: true },
            { text: "Vocabulary bertambah otomatis", why: "Vocabulary ditentukan tokenizer, tidak berubah oleh fine-tuning standar.", },
            { text: "Tidak ada risiko pada data kecil", why: "Justru data kecil + model besar = kombinasi paling rawan overfitting.", },
          ],
        },
      ],
    },
  ],
};
