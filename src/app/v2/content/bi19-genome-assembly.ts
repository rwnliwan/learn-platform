import type { V2Lesson } from "../lib/types";

// ── Figure: jalur Euler pada graf de Bruijn (k=3) ─────────────────────────
const DEBRUIJN_SVG = `<svg viewBox="0 0 600 230" role="img" aria-label="Jalur Euler pada graf de Bruijn: AT TT TG GC CA lalu kembali ke AT dan ke TG">
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--text)"/></marker></defs>
<line x1="96" y1="90" x2="149" y2="90" stroke="var(--text)" stroke-width="1.6" marker-end="url(#ah)"/>
<text x="122" y="76" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">1</text>
<line x1="201" y1="90" x2="254" y2="90" stroke="var(--text)" stroke-width="1.6" marker-end="url(#ah)"/>
<text x="227" y="76" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">2</text>
<line x1="306" y1="90" x2="359" y2="90" stroke="var(--text)" stroke-width="1.6" marker-end="url(#ah)"/>
<text x="332" y="76" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">3</text>
<line x1="411" y1="90" x2="464" y2="90" stroke="var(--text)" stroke-width="1.6" marker-end="url(#ah)"/>
<text x="437" y="76" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">4</text>
<path d="M 464,90 C 400,190 140,190 96,90" fill="none" stroke="var(--text)" stroke-width="1.6" marker-end="url(#ah)"/>
<text x="280" y="196" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">5</text>
<path d="M 96,106 C 150,160 200,160 254,106" fill="none" stroke="var(--text)" stroke-width="1.6" marker-end="url(#ah)"/>
<text x="175" y="160" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)" font-weight="600">6</text>
<circle cx="70" cy="90" r="26" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="70" y="95" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">AT</text>
<circle cx="175" cy="90" r="26" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="175" y="95" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">TT</text>
<circle cx="280" cy="90" r="26" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="280" y="95" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">TG</text>
<circle cx="385" cy="90" r="26" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="385" y="95" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">GC</text>
<circle cx="490" cy="90" r="26" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="490" y="95" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">CA</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="12" y="14">jalur Euler (sisi bernomor 1–6) = genom ATTGCATG; sisi 5–6 mengunjungi ulang simpul</text></g></svg>`;

export const bi19: V2Lesson = {
  slug: "bi19-genome-assembly",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "Genome Assembly: Merakit Genom dari Kepingan Puzzle",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Buku yang disobek jadi 3 miliar confetti",
      prose: [
        "Mesin sequencer modern tidak membaca genom seperti membaca buku halaman per halaman. Ia menyobek “buku” 3 miliar huruf itu menjadi ratusan juta potongan acak sepanjang 150 huruf — reads — lalu menyerahkan tumpukan confetti itu kepadamu tanpa gambar referensi di sampulnya. Tugas genome assembly: susun kembali bukunya. Pendekatan naifnya — coba semua susunan potongan — bahkan untuk genom bakteri kecil butuh waktu lebih lama dari umur alam semesta.",
        "Twist-nya datang dari tahun 1736. Leonhard Euler, memecahkan teka-teki jembatan Königsberg, membuktikan bahwa menemukan jalur yang melewati setiap JEMBATAN tepat sekali adalah masalah yang mudah — sementara melewati setiap TITIK tepat sekali adalah masalah yang (kita tahu sekarang) sangat sulit. Para perakit genom memutar masalahnya: jangan jadikan bacaan sebagai titik yang harus dikunjungi (sulit!), jadikan bacaan sebagai JEMBATAN yang harus dilewati (mudah!). Potong setiap read menjadi k-mer kecil, bangun graf de Bruijn, dan cari jalur Euler — masalah “mustahil” berubah menjadi masalah yang solusinya ditemukan tiga abad lalu.",
        "Itulah fondasi perakitan de novo modern, dari algoritma klasik Compeau & Pevzner (yang kodenya dipelajari ribuan mahasiswa bioinformatika lewat repositori bioinformaticsalgorithms) hingga assembler produksi seperti SPAdes dan Flye. Di lesson ini kamu membangun sendiri mesinnya dalam skala mainan: dari 6 k-mer menjadi genom utuh — lalu memahami kenapa dunia nyata jauh lebih berantakan (repeat, error, dan N50 yang menipu).",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini pekerjaan data, bukan cuma pekerjaan biologi",
        type: "risk",
        body: "Setiap keputusan assembly adalah keputusan algoritmik atas data ber-noise: k terlalu kecil → graf kusut oleh repeat; k terlalu besar → graf terputus oleh error sekuensing. Assembly yang salah (misassembly) merambat ke semua analisis hilir — anotasi gen, variant calling, filogenetika. Memahami grafnya berarti memahami di mana ia bisa berbohong.",
      },
      reference: "Assembly = ubah masalah susun-titik (sulit) menjadi masalah lewati-sisi (mudah) via graf de Bruijn + jalur Euler.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan perbedaan assembly de novo vs berbasis referensi dan kapan memakai masing-masing; (2) membangun graf de Bruijn dari k-mer dan menemukan jalur Euler untuk merakit sekuens; (3) menghitung dan menafsirkan N50 — termasuk cara ia bisa dimanipulasi; (4) menjelaskan tiga musuh assembly (repeat, error sekuensing, cakupan tak merata) dan strategi menghadapinya.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep inti (OLC, graf de Bruijn, contig/N50) → lab Pyodide (rakit genom mainan) → chart jalur Euler dengan panduan baca → peta keputusan → mini-case bakteri fiktif → kuis → rangkuman. Estimasi 50 menit; lab-nya ±15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari biologi molekuler: DNA adalah untai huruf A/C/G/T; genom adalah seluruh “buku” instruksi satu organisme; dogma sentral (DNA → RNA → protein) menjelaskan kenapa urutan hurufnya penting — salah satu huruf bisa mengubah protein. Kedua, dari alignment sekuens: alignment mencocokkan read ke GENOM REFERENSI yang sudah ada (dengan BLAST atau mapper) — cepat dan akurat bila referensinya ada. Assembly de novo adalah kebalikannya: TIDAK ada referensi, genom dirakit dari nol hanya dari overlap antar-read. Pilih alignment bila referensi dekat tersedia; pilih de novo bila organisme baru, genom sangat berbeda, atau kamu memang memburu struktur yang hilang dari referensi.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: alignment = menyusun puzzle DENGAN gambar di sampul kotak; assembly de novo = menyusun TANPA gambar, hanya dari kecocokan antar-keping. Keduanya keterampilan berbeda dengan jebakan berbeda.",
      ],
      reference: "Bekal: (1) DNA = huruf A/C/G/T; urutan menentukan fungsi; (2) alignment butuh referensi; assembly de novo merakit dari nol.",
    },
    {
      id: "konsep-olc",
      eyebrow: "Langkah 3 · Konsep",
      title: "OLC — Si Tukang Puzzle Klasik",
      prose: [
        "Definisi: Overlap-Layout-Consensus (OLC) adalah strategi assembly klasik dalam tiga tahap: Overlap — cari semua pasangan read yang saling tumpang tindih; Layout — susun read berdasarkan overlap menjadi urutan; Consensus — untuk tiap posisi, ambil huruf mayoritas dari read yang menutupinya (mengoreksi error sekuensing). Ini cara “alami” merakit puzzle: cari keping yang tepinya cocok.",
        "Kepribadiannya: OLC adalah tukang puzzle yang teliti tetapi lambat dan mudah terkecoh pola berulang. Mencari overlap semua-pasangan berbiaya kuadratik — untuk jutaan read, mustahil tanpa heuristik. Dan musuh terbesarnya adalah repeat: bila genom punya dua salinan urutan identik sepanjang 5.000 huruf sementara read-mu cuma 150 huruf, tidak ada informasi yang bisa memutuskan salinan mana milik siapa — tukang puzzle ini akan menggabungkan keduanya menjadi satu (kolaps repeat) atau menyusunnya terbalik.",
        "Kapan memakai: OLC masih dipakai untuk read PANJANG (PacBio, Oxford Nanopore — ribuan hingga jutaan huruf per read) karena read panjang melompati repeat; assembler seperti Canu dan Flye memakai varian OLC. Untuk read PENDEK Illumina (150 huruf, jutaan jumlahnya), OLC tidak ekonomis — di sinilah graf de Bruijn mengambil alih.",
      ],
      formula: String.raw`\text{jumlah pasangan overlap} = \frac{n(n-1)}{2}`,
      formulaNote: "n = jumlah read. Untuk n = 1 juta read, pasangan yang harus diperiksa ≈ 5×10¹¹ — setengah triliun perbandingan. Inilah alasan OLC butuh heuristik (k-mer seeding, indexing) sebelum bisa dipakai pada data nyata. Interpretasi: biaya kuadratik adalah vonis mati untuk pendekatan naif — setiap assembler modern pada dasarnya adalah cara cerdik menghindari perbandingan semua-pasangan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Makin banyak read (coverage tinggi) pasti assembly makin bagus”",
        type: "pitfall",
        body: "Yang benar: coverage membantu sampai titik tertentu (mengoreksi error via consensus), tetapi TIDAK menyelesaikan repeat — 1000× coverage dari read 150 huruf tetap tidak bisa membedakan dua repeat identik sepanjang 5.000 huruf. Untuk repeat, yang dibutuhkan bukan LEBIH BANYAK read, melainkan read yang LEBIH PANJANG.",
      },
      hints: [
        "💡 Intuisi: bedakan dua jenis kesulitan — ERROR (huruf salah, diobati dengan coverage/konsensus) vs REPEAT (struktur berulang, hanya diobati dengan read panjang). Kebanyakan kegagalan assembly adalah repeat, bukan error.",
      ],
      reference: "OLC = overlap semua pasangan (mahal) → cocok untuk read panjang; repeat adalah musuh abadinya.",
    },
    {
      id: "konsep-debruijn",
      eyebrow: "Langkah 4 · Konsep",
      title: "Graf de Bruijn — Si Pemecah Kebuntuan",
      prose: [
        "Definisi: graf de Bruijn memotong setiap read menjadi k-mer (potongan sepanjang k), lalu membangun graf: SIMPUL = (k−1)-mer (awalan dan akhiran tiap k-mer), SISI = k-mer yang menghubungkan awalan ke akhirannya. Contoh: k-mer ATG menjadi sisi dari simpul AT ke simpul TG. Assembly kemudian menjadi: temukan jalur yang melewati SETIAP SISI tepat sekali — jalur Euler — dan baca hurufnya berurutan.",
        "Kepribadiannya: graf de Bruijn adalah penerjemah jenius yang mengubah masalah. Masalah aslinya — “kunjungi setiap READ tepat sekali” (jalur Hamilton) — adalah NP-hard: tidak ada algoritma cepat yang diketahui. Setelah diterjemahkan menjadi “lewati setiap SISI tepat sekali” (jalur Euler), masalahnya menjadi linear — algoritma Hierholzer menyelesaikannya dalam sekejap. Triknya bukan bekerja lebih keras, melainkan merumuskan ulang masalahnya. Repeat tetap terlihat — sebagai simpul bercabang banyak (simpul dengan banyak sisi masuk/keluar) — tetapi kini ia EKSPLISIT di graf, bukan jebakan tersembunyi.",
        "Kapan memakai: graf de Bruijn adalah mesin standar assembler read-pendek (SPAdes, Velvet, MEGAHIT untuk metagenom). Syarat jalur Euler ada: pada graf berarah, setiap simpul harus seimbang (sisi masuk = sisi keluar), kecuali maksimal satu simpul awal (keluar = masuk + 1) dan satu simpul akhir. Parameter k adalah tuas utama: k kecil → graf kusut (banyak cabang palsu dari repeat pendek); k besar → graf terputus (k-mer mengandung error jadi tidak cocok). Assembler modern mencoba beberapa k (multi-k).",
      ],
      formula: String.raw`n_{\text{k-mer}} = L - k + 1 \qquad\text{(per read sepanjang }L\text{)}`,
      formulaNote: "L = panjang read; k = ukuran k-mer. Read sepanjang 150 dengan k = 31 menghasilkan 120 k-mer. Total sisi graf = total k-mer dari semua read (sebelum deduplikasi). Interpretasi: k mengendalikan resolusi — seperti memilih ukuran keping puzzle. Praktiknya: k ≈ 1/2–2/3 panjang read adalah titik awal yang wajar untuk eksperimen.",
      tasks: [],
      hints: [
        "💡 Intuisi: hafalkan pasangan ini — Hamilton = kunjungi TITIK (sulit, NP-hard), Euler = lewati SISI (mudah, linear). Seluruh keajaiban assembly modern adalah memindahkan masalah dari kategori pertama ke kategori kedua.",
      ],
      reference: "de Bruijn: simpul=(k−1)-mer, sisi=k-mer, assembly=jalur Euler. k kecil→kusut, k besar→terputus.",
    },
    {
      id: "konsep-n50",
      eyebrow: "Langkah 5 · Konsep",
      title: "Contig, Scaffold & N50 — Si Juri yang Bisa Disuap",
      prose: [
        "Definisi: CONTIG adalah urutan kontigu yang berhasil dirakit tanpa gap (satu jalur Euler yang utuh). SCAFFOLD adalah rangkaian contig yang urutannya diketahui (mis. dari read berpasangan / mate-pair) tetapi dipisahkan gap berisi N (huruf tak diketahui). N50 adalah metrik kualitas: urutkan contig dari terpanjang, lalu N50 = panjang contig terpendek di antara himpunan contig terbesar yang totalnya mencakup ≥ 50% panjang assembly. Artinya: “separuh genommu ada di potongan minimal sepanjang N50”.",
        "Kepribadiannya: N50 adalah juri lomba yang bisa disuap. Ia hanya mengukur KONTINUITAS (panjang potongan), bukan KEBENARAN (apakah potongannya benar). Assembler nakal bisa menaikkan N50 dengan menggabungkan contig secara agresif walau buktinya tipis — menghasilkan potongan panjang yang SALAH (misassembly). Karena itu N50 selalu dibaca bersama metrik kebenaran: jumlah misassembly (dicek dengan memetakan kembali ke referensi dekat / gen konservasi) dan kelengkapan gen (BUSCO — persentase gen universal yang ditemukan utuh).",
        "Kapan memakai: N50 untuk membandingkan PARAMETER pada data yang sama (k=31 vs k=55 — mana lebih kontinu?). JANGAN memakai N50 untuk membandingkan assembly dari spesies/genom berbeda, atau sebagai satu-satunya bukti “assembly bagus”. Laporan assembly yang jujur: N50 + jumlah contig + total panjang + BUSCO + estimasi misassembly.",
      ],
      formula: String.raw`N_{50} = \min\{|c| : c \in S\}, \quad S = \text{himpunan contig terbesar dengan }\sum_{c \in S}|c| \geq \tfrac{1}{2}\sum_{\text{semua}}|c|`,
      formulaNote: "|c| = panjang contig c. Contoh: contig [8, 4] → total 12, setengahnya 6; himpunan terbesar mencakup ≥6 adalah {8} → N50 = 8. Contoh lain: contig [10, 9, 8, 2, 1] → total 30, setengah 15; {10, 9} = 19 ≥ 15 → N50 = 9 (contig terpendek di himpunan itu). Interpretasi: N50 menjawab “seberapa panjang potongan medannya?” — bukan “seberapa benar potongannya?”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “N50 5 Mb pasti lebih baik dari N50 1 Mb”",
        type: "pitfall",
        body: "Yang benar: belum tentu — N50 5 Mb dengan 200 misassembly lebih buruk dari N50 1 Mb yang bersih. N50 mengukur panjang, bukan kebenaran; ia bisa “digelembungkan” oleh penggabungan agresif. Selalu minta pendampingnya: BUSCO dan jumlah misassembly.",
      },
      hints: [
        "💡 Intuisi: N50 itu seperti menilai puzzle dari “rata-rata ukuran keping yang berhasil disatukan” — mengesankan, tetapi tidak bilang apakah gambarnya benar. Juri yang baik menilai gambarnya juga.",
      ],
      reference: "Laporan jujur: N50 + jumlah contig + total panjang + BUSCO + misassembly. N50 saja = setengah cerita.",
    },
    {
      id: "lab-assembly",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Rakit genom dari 6 k-mer",
      prose: [
        "Waktunya jadi assemblernya. Di bawah ada 6 k-mer (k=3) dari sebuah genom mainan — tanpa diberi tahu genomnya. Tugasmu: tulis empat fungsi — `build_graph` (k-mer → dict sisi), `eulerian_trail` (Hierholzer: mulai dari simpul dengan keluar−masuk = 1, selalu ambil sisi PERTAMA dengan pop(0) agar deterministik), `assemble` (rangkai simpul jalur menjadi string), dan `n50` — lalu rakit genomnya dan hitung N50 dari [contig-mu, contig 4-huruf].",
        "Coba: setelah lolos, ganti urutan `reads` (acak daftarnya). Apa yang terjadi pada contig? Seharusnya TIDAK berubah — graf tidak peduli urutan input. Itulah keindahan pendekatan graf: ia kebal terhadap keacakan urutan sekuensing.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `build_graph(reads, k)`: dict {(k−1)-mer → list (k−1)-mer tujuan}" },
        { id: "t2", text: "Lengkapi `eulerian_trail(g)`: Hierholzer dengan `pop(0)`, kembalikan list simpul" },
        { id: "t3", text: "Lengkapi `assemble(path)`: `path[0]` + huruf terakhir tiap simpul berikut" },
        { id: "t4", text: "Lengkapi `n50(lengths)`: definisi N50, kembalikan integer" },
        { id: "t5", text: "Jalankan dan pastikan dua baris ringkasan tercetak" },
      ],
      expected: "contig=ATTGCATG panjang=8\nN50=8",
      hints: [
        "build_graph: untuk tiap read, `g.setdefault(read[:k-1], []).append(read[1:])`.",
        "Hierholzer: hitung selisih keluar−masuk tiap simpul → mulai dari yang selisihnya 1; tumpuk (stack): selama simpul teratas punya sisi, ambil sisi pertama dan dorong tujuannya; bila buntu, pindahkan ke jalur. Balik hasilnya.",
        "assemble: `path[0] + \"\".join(p[-1] for p in path[1:])`.",
        "n50: urutkan menurun, akumulasi sampai ≥ setengah total, kembalikan panjang contig terakhir yang ditambahkan.",
      ],
      code: {
        starter: `# 6 k-mer (k=3) dari sebuah genom mainan — SINTETIS untuk latihan
reads = ["ATT", "TTG", "TGC", "GCA", "CAT", "ATG"]
K = 3

# TULIS KODEMU: empat fungsi di bawah ini
def build_graph(reads, k):
    return

def eulerian_trail(g):
    return

def assemble(path):
    return

def n50(lengths):
    return

g = build_graph(reads, K)
trail = eulerian_trail(g)
contig = assemble(trail)
print(f"contig={contig} panjang={len(contig)}")
n = n50([len(contig), 4])
print(f"N50={n}")`,
        lockLines: 3,
        solution: `# 6 k-mer (k=3) dari sebuah genom mainan — SINTETIS untuk latihan
reads = ["ATT", "TTG", "TGC", "GCA", "CAT", "ATG"]
K = 3

# TULIS KODEMU: empat fungsi di bawah ini
def build_graph(reads, k):
    g = {}
    for r in reads:
        g.setdefault(r[:k-1], []).append(r[1:])
    return g

def eulerian_trail(g):
    from collections import Counter
    gg = {u: list(v) for u, v in g.items()}
    outd, ind = Counter(), Counter()
    for u, vs in gg.items():
        outd[u] += len(vs)
        for v in vs:
            ind[v] += 1
    start = next(iter(gg))
    for u in outd:
        if outd[u] - ind[u] == 1:
            start = u
            break
    stack, path = [start], []
    while stack:
        v = stack[-1]
        if gg.get(v):
            stack.append(gg[v].pop(0))
        else:
            path.append(stack.pop())
    path.reverse()
    return path

def assemble(path):
    return path[0] + "".join(p[-1] for p in path[1:])

def n50(lengths):
    s = sorted(lengths, reverse=True)
    total = sum(s)
    acc = 0
    for x in s:
        acc += x
        if acc >= total / 2:
            return x

g = build_graph(reads, K)
trail = eulerian_trail(g)
contig = assemble(trail)
print(f"contig={contig} panjang={len(contig)}")
n = n50([len(contig), 4])
print(f"N50={n}")`,
        checks: [
          { kind: "equal", task: "t3", name: "contig", value: "ATTGCATG", label: "`contig` harus ATTGCATG", msg: "Jalur Euler AT→TT→TG→GC→CA→AT→TG dirangkai menjadi ATTGCATG." },
          { kind: "equal", task: "t4", name: "n", value: 8, tol: 0, label: "`n` (N50) harus 8", msg: "Contig [8,4]: total 12, setengah 6, {8} sudah ≥ 6 → N50 = 8." },
          { kind: "stdout_matches", task: "t5", pattern: "contig=ATTGCATG panjang=8", label: "Baris contig tercetak benar", msg: "Format: contig=<sekuens> panjang=<n>." },
          { kind: "stdout_matches", task: "t5", pattern: "N50=8", label: "Baris N50 tercetak benar", msg: "N50 dari [8, 4] adalah 8." },
        ],
      },
      note: {
        title: "Intuisi: assembly yang bagus diukur dari kebenaran, bukan dari panjang",
        body: "Praktisi assembly menyimpan lima heuristik yang tidak ada di manual assembler. Satu: N50 menjawab “seberapa panjang potongannya”, bukan “seberapa benar potongannya” — assembler agresif bisa menaikkan N50 dengan menggabungkan contig tanpa bukti; selalu baca N50 bersama estimasi misassembly. Dua: BUSCO mengukur kelengkapan gen INTI universal — BUSCO 98% tidak menjamin gen aksesori (resistensi antibiotik di plasmid, gen virulensi) terakit; untuk pertanyaan tentang gen non-inti, BUSCO adalah jawaban untuk pertanyaan yang salah. Tiga: repeat yang lebih panjang dari read-mu adalah tembok yang tidak bisa ditembus coverage — menaikkan kedalaman dari 50x ke 200x tidak membantu bila repeat-nya 5 kb dan read-mu 150 bp; satu-satunya jalan adalah read yang lebih panjang dari repeat-nya. Empat: bandingkan parameter (k, assembler) hanya pada DATA yang sama — N50 antar-spesies atau antar-dataset tidak bisa dibandingkan karena genomnya beda. Lima: plasmid dan kromosom adalah dua proyek assembly berbeda — plasmid penuh repeat dan copy-number bervariasi; assembly kromosom yang “bagus” bisa sepenuhnya kehilangan plasmid, dan di klinik (wabah resistensi) plasmid itulah yang paling penting dilacak. Heuristik gabungannya: laporan assembly yang jujur selalu menyebut lima angka — N50, jumlah contig, total panjang, BUSCO, dan estimasi misassembly; bila satu angka disembunyikan, curigai kenapa.",
      },
      reference: "k-mer → graf de Bruijn → jalur Euler → contig. N50 = juri kontinuitas, bukan kebenaran.",
    },
    {
      id: "chart-debruijn",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca jalur Euler seperti assembler",
      prose: [
        "Diagram di bawah adalah graf de Bruijn dari lab-mu: simpul = (k−1)-mer, sisi bernomor = k-mer dalam urutan jalur Euler.",
        "Cara membaca: ikuti sisi bernomor 1→6. Sisi 1–4 berjalan lurus (AT→TT→TG→GC→CA). Sisi 5 melengkung jauh kembali ke AT — inilah kunjungan ULANG simpul (repeat dalam skala mainan: k-mer ATG muncul sebagai sisi kedua dari AT). Sisi 6 melengkung pendek dari AT ke TG. Setiap sisi dilewati tepat sekali — itulah syarat Euler.",
        "Interpretasi: membaca hurufnya berurutan — A dari AT, lalu huruf terakhir tiap sisi (T, G, C, A, T, G) — menghasilkan ATTGCATG, genom mainannya. Perhatikan apa yang TIDAK ada: tidak ada percabangan. Pada data nyata, simpul repeat punya banyak sisi keluar — assembler harus memilih cabang, dan pilihan yang salah = misassembly. Diagram mainan ini adalah kasus termudah; setiap cabang tambahan adalah satu keputusan berisiko.",
      ],
      figure: {
        svg: DEBRUIJN_SVG,
        alt: "Graf de Bruijn lima simpul dengan jalur Euler bernomor 1-6: AT→TT→TG→GC→CA, kembali ke AT, lalu ke TG. Merangkai menjadi ATTGCATG.",
        caption: "Jalur Euler (sisi 1–6) pada graf de Bruijn k=3 — merangkai menjadi ATTGCATG.",
      },
      tasks: [],
      reference: "Jalur Euler = tiap sisi tepat sekali. Cabang pada simpul = repeat = keputusan berisiko.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Strategi assembly apa untuk proyek apa?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Bakteri baru, read pendek Illumina, tanpa referensi dekat. → De novo dengan graf de Bruijn (SPAdes/MEGAHIT), coba beberapa k (multi-k). Alasan: tidak ada referensi → de novo wajib; read pendek → de Bruijn ekonomis.",
        "Skenario 2 — Genom manusia, tersedia referensi GRCh38. → JANGAN de novo dari nol — pakai reference-guided (atau pangenome graph). Alasan: merakit 3 miliar huruf de novo mahal dan berisiko; referensi yang baik menghemat bulan komputasi. De novo hanya untuk yang hilang dari referensi (structural variant besar).",
        "Skenario 3 — Repeat panjang dicurigai (mis. region CRISPR, plasmid). → Tambah read panjang (Nanopore/PacBio) + assembler OLC (Flye/Canu). Alasan: hanya read yang LEBIH PANJANG dari repeat yang bisa melewatinya — bukan coverage lebih tinggi.",
        "Skenario 4 — Dua parameter memberi N50 5 Mb vs 1 Mb. → Pilih berdasarkan BUSCO + misassembly, bukan N50. Alasan: N50 bisa disuap oleh penggabungan agresif; juri yang jujur menilai kebenaran juga.",
        "Skenario 5 — Metagenom (ratusan spesies campur, coverage sangat tak merata). → Assembler metagenom khusus (MEGAHIT/metaSPAdes) yang toleran terhadap coverage tak merata. Alasan: asumsi “satu genom, coverage seragam” runtuh — spesies langka (coverage 2×) dan dominan (1000×) hidup berdampingan; de Bruijn standar akan membuang yang langka sebagai “error”.",
        "Aturan praktis 10 detik: ada referensi dekat? → pakai. Read pendek? → de Bruijn + multi-k. Repeat panjang? → read panjang. Bandingkan parameter? → N50 + BUSCO + misassembly.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih k terlalu besar “agar spesifik” pada data ber-error tinggi — grafnya terputus-putus menjadi ribuan contig mungil, lalu disimpulkan “datanya jelek”. Padahal dengan k lebih kecil grafnya tersambung. Selalu coba beberapa k sebelum menyalahkan data.",
      },
      reference: "Referensi dekat → pakai. De novo → de Bruijn (pendek) / OLC (panjang). Nilai dengan N50+BUSCO+misassembly.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Bakteri RS dan plasmid yang hilang",
      prose: [
        "Skenario (sintetis, untuk latihan): RS melaporkan wabah Klebsiella pneumoniae resisten antibiotik. Tim merakit genom isolat dengan SPAdes dari read Illumina 150 bp: N50 = 180 kb, 63 contig, BUSCO 98,2% — terlihat bagus. Tetapi gen resistensi bla_KPC yang terdeteksi via PCR tidak ditemukan utuh di assembly — ia terpotong di ujung dua contig berbeda. Plasmid pembawanya (dikenal dari literatur: ~120 kb, penuh repeat IS26) tidak terakit.",
        "Pertanyaan analisis: (1) Kenapa gennya terpotong padahal N50 dan BUSCO bagus? (2) Apa strategi assembly yang benar untuk kasus ini? (3) Metrik apa yang seharusnya membuat tim curiga sejak awal?",
        "Pembahasan: (1) BUSCO mengukur gen UNIVERSAL inti — gen resistensi plasmid bukan gen inti, jadi BUSCO 98% tidak menjaminnya. Repeat IS26 (±820 bp, banyak salinan identik) lebih panjang dari read 150 bp → graf de Bruijn kolaps di repeat → contig terputus tepat di gen bla_KPC. N50 180 kb mengukur kontinuitas kromosom, bukan plasmid. (2) Tambah sekuensing read panjang (Nanopore): satu read 20 kb melompati seluruh repeat IS26; rakit hibrida (mis. Unicycler: de Bruijn pendek + OLC panjang) atau long-read-only (Flye). (3) Jumlah contig (63) untuk genom bakteri 5,5 Mb sebenarnya biasa saja — yang seharusnya dicurigai: gen target PCR-positif tetapi tidak utuh di assembly (inkonsistensi antar-bukti), dan tidak adanya plasmid sirkular utuh padahal fenotipe resistensinya plasmid-mediated. Pelajaran: metrik global tidak menggantikan pertanyaan biologis spesifik.",
        "Kaitan ke klinik: plasmid yang tidak terakit = rute transmisi resistensi antar-pasien tidak terlacak — wabahnya “terlihat” selesai padahal plasmidnya terus menyebar diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko analitik di sini: laporan “assembly berkualitas tinggi (N50 180 kb, BUSCO 98%)” memberi rasa aman palsu sementara gen resistensinya hilang dari data. Keputusan infeksi RS berbasis laporan itu bisa salah menilai sumber wabah. Selalu validasi gen/pertanyaan SPESIFIK proyek — metrik global bukan pengganti.",
      },
      reference: "Repeat > panjang read → butuh read panjang. Validasi pertanyaan spesifik, bukan cuma metrik global.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Assembly de novo merakit genom tanpa referensi; pilih alignment bila referensi dekat tersedia — keduanya keterampilan berbeda.",
        "OLC (overlap semua pasangan, biaya kuadratik) cocok untuk read panjang; graf de Bruijn (k-mer, jalur Euler linear) adalah mesin read pendek.",
        "Trik de Bruijn: ubah “kunjungi tiap read” (Hamilton, NP-hard) menjadi “lewati tiap sisi” (Euler, mudah) — repeat muncul sebagai simpul bercabang.",
        "Contig = tanpa gap; scaffold = contig berurutan dengan gap N; N50 = juri kontinuitas yang bisa disuap — selalu pasangkan dengan BUSCO + misassembly.",
        "Musuh assembly: repeat (obatnya read panjang, bukan coverage), error (obatnya konsensus), coverage tak merata (obatnya assembler khusus).",
      ],
      quiz: [
        {
          q: "Kenapa graf de Bruijn mengubah assembly dari masalah sulit menjadi mudah?",
          options: [
            { text: "Ia mengubah masalah jalur Hamilton (kunjungi tiap titik, NP-hard) menjadi jalur Euler (lewati tiap sisi, linear)", why: "Benar: dengan menjadikan k-mer sebagai SISI bukan titik, pencarian assembly menjadi Hierholzer yang linear — trik perumusan ulang, bukan komputer yang lebih cepat.", correct: true },
            { text: "Karena k-mer lebih pendek sehingga komputer memprosesnya lebih cepat", why: "Salah: kecepatan bukan intinya — kompleksitas masalahnya yang berubah kelas (NP-hard → linear). k-mer pendek tanpa trik graf tidak menyelesaikan apa-apa." },
            { text: "Karena graf de Bruijn menghilangkan semua repeat", why: "Salah: repeat tetap ada — sebagai simpul bercabang. Graf membuatnya eksplisit, bukan menghilangkannya." },
            { text: "Karena tidak perlu mencari overlap antar-read lagi", why: "Salah: overlap tetap dicari — hanya dilakukan implisit lewat k-mer yang sama, bukan perbandingan semua pasangan." },
          ],
        },
        {
          q: "Read 150 bp, k = 31. Berapa k-mer per read, dan apa risiko k = 120?",
          options: [
            { text: "120 k-mer; k = 120 membuat graf terputus karena tiap k-mer hampir pasti mengandung error", why: "Benar: 150−31+1 = 120. k mendekati panjang read → sedikit k-mer per read dan tiap k-mer besar peluang mengandung error → sisi tidak cocok → graf fragmentasi.", correct: true },
            { text: "31 k-mer; k = 120 membuat graf terlalu kusut", why: "Salah: 150−31+1 = 120, bukan 31. Dan k besar membuat graf TERPUTUS (bukan kusut) — kusut adalah gejala k terlalu kecil." },
            { text: "120 k-mer; k = 120 selalu lebih baik karena lebih spesifik", why: "Salah: “lebih spesifik” ada harganya — sensitivitas runtuh saat ada error. k optimal adalah kompromi, bukan maksimum." },
            { text: "181 k-mer; k tidak berpengaruh pada konektivitas graf", why: "Salah: 150−31+1 = 120. Dan k adalah tuas utama konektivitas graf (kecil→kusut, besar→terputus)." },
          ],
        },
        {
          q: "Contig [10, 9, 8, 2, 1] (kb). N50-nya?",
          options: [
            { text: "9 kb", why: "Benar: total 30, setengah = 15; himpunan terbesar ≥ 15 adalah {10, 9} = 19; contig terpendek di himpunan itu = 9.", correct: true },
            { text: "10 kb", why: "Salah: itu contig terpanjang, bukan N50. N50 adalah contig TERPENDEK di himpunan yang mencakup setengah assembly." },
            { text: "8 kb", why: "Salah: {10, 9, 8} = 27 memang ≥ 15, tetapi himpunan TERKECIL yang mencapai setengah adalah {10, 9} — N50 memakai himpunan minimal itu." },
            { text: "6 kb (rata-rata)", why: "Salah: N50 bukan rata-rata (30/5 = 6). Rata-rata tidak menjawab “separuh genom ada di potongan minimal sepanjang apa?”." },
          ],
        },
        {
          q: "Assembly A: N50 5 Mb, 200 misassembly. Assembly B: N50 1 Mb, 5 misassembly. Mana lebih baik?",
          options: [
            { text: "B — N50 mengukur kontinuitas, bukan kebenaran; 200 misassembly berarti potongan panjangnya banyak yang salah sambung", why: "Benar: N50 bisa disuap oleh penggabungan agresif. 200 misassembly = 200 kebohongan terstruktur; B lebih jujur walau lebih terfragmentasi.", correct: true },
            { text: "A — N50 lima kali lipat tidak bisa dikalahkan", why: "Salah: N50 tanpa metrik kebenaran adalah angka kosong — inilah tepatnya mitos “N50 besar = bagus”." },
            { text: "Tidak bisa dibandingkan tanpa tahu spesiesnya", why: "Salah: keduanya assembly yang sama-sama diklaim untuk dibandingkan (konteks: parameter berbeda, data sama) — dan prinsipnya umum: kebenaran di atas kontinuitas." },
            { text: "Seri — keduanya punya kelebihan", why: "Salah: 200 vs 5 misassembly bukan “kelebihan masing-masing” — itu jurang kualitas. Diplomasinya salah tempat." },
          ],
        },
        {
          q: "Genom bakteri penuh repeat IS26 (±820 bp, banyak salinan). Data: Illumina 150 bp, 500× coverage. Masalahnya dan solusinya?",
          options: [
            { text: "Repeat lebih panjang dari read → coverage tak membantu; solusinya read panjang (Nanopore/PacBio) yang melompati repeat", why: "Benar: tidak ada informasi dalam read 150 bp yang membedakan salinan repeat identik 820 bp — 500× dari “tidak cukup panjang” tetap tidak cukup panjang.", correct: true },
            { text: "Coverage kurang — naikkan ke 2000×", why: "Salah: menambah coverage menambah salinan dari masalah yang sama. Repeat diselesaikan oleh PANJANG, bukan JUMLAH." },
            { text: "Pakai k lebih kecil pada de Bruijn", why: "Salah: k lebih kecil justru memperparah repeat (lebih banyak k-mer yang sama persis) — graf makin kusut." },
            { text: "Ganti ke assembly berbasis referensi", why: "Salah: bila repeatnya juga ada di referensi dengan susunan berbeda (strain berbeda), reference-guided justru memaksakan struktur yang salah." },
          ],
        },
      ],
    },
  ],
};
