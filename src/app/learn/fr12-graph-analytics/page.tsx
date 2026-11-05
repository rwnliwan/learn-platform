"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR12Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const ringData = [
    {
      x: ["Ukuran 2-5", "Ukuran 6-15", "Ukuran 16-50", "Ukuran 51+"],
      y: [45, 30, 17, 8],
      type: "bar",
      marker: { color: "#b06fc9" },
      text: ["45%", "30%", "17%", "8%"],
      textposition: "outside",
    },
  ];

  const featureData = [
    {
      x: ["Derajat", "Ukuran komponen", "Rasio fan-out", "Jarak ke fraud known", "Clustering coef", "PageRank"],
      y: [0.38, 0.52, 0.61, 0.58, 0.44, 0.49],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["0,38", "0,52", "0,61", "0,58", "0,44", "0,49"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Temukan 'mule ring': connected components pada graph transfer
# Node = rekening, edge = transfer. Ring = komponen dengan pola fan-out.
from collections import defaultdict, deque

# (pengirim, penerima, nominal_jt)
transfer = [
    ("A", "B", 5), ("B", "C", 5), ("B", "D", 5), ("B", "E", 5),  # B fan-out!
    ("C", "F", 4), ("D", "F", 4),
    ("X", "Y", 2), ("Y", "Z", 2),   # rantai normal kecil
    ("P", "Q", 50),                  # transaksi besar tunggal
    ("M", "N", 3), ("N", "O", 3), ("O", "M", 3),  # <- siklus! (mencurigakan)
]

g = defaultdict(set)
for a, b, _ in transfer:
    g[a].add(b); g[b].add(a)

def komponen(start):
    lihat, antri = {start}, deque([start])
    while antri:
        n = antri.popleft()
        for t in g[n]:
            if t not in lihat: lihat.add(t); antri.append(t)
    return lihat

sudah = set()
print(f"{'Komponen':22s} {'Ukuran':>6s}  Sinyal")
for n in g:
    if n in sudah: continue
    k = komponen(n); sudah |= k
    # sinyal: ada siklus? fan-out (node dgn derajat >=3)?
    derajat = {x: len(g[x]) for x in k}
    fanout = sum(1 for d in derajat.values() if d >= 3)
    skor = len(k) * 2 + fanout * 5
    flag = "🚨 RING?" if skor >= 10 else "✅ wajar"
    print(f"{str(sorted(k)):22s} {len(k):6d}  {flag} (fan-out node: {fanout})")
print()
print("COBA UBAH: tambah ('O','P',3) — dua komponen MENYAMBUNG.")
print("Pelajaran: satu edge baru bisa menggabungkan dua ring kecil")
print("jadi satu jaringan besar. Inilah kenapa graph dihitung ULANG berkala.")`;

  const lab2Code = `# Entity resolution: '7 identitas' yang ternyata 1 orang
# Aturan: dua akun = entitas sama jika berbagi >=2 atribut kuat.
from collections import defaultdict

akun = [
    # (id, nama, no_hp, alamat, device_fp)
    ("A1", "Budi S.",  "0811", "Jl. Mawar 1",  "fp_X"),
    ("A2", "B. Santoso","0811", "Jl. Mawar 1",  "fp_Y"),  # nama beda, hp+alamat sama
    ("A3", "Budi S.",  "0822", "Jl. Melati 9", "fp_X"),  # device sama
    ("A4", "Andi",     "0833", "Jl. Kenanga 3","fp_Z"),  # bersih
    ("A5", "B. S.",    "0811", "Jl. Mawar 1",  "fp_X"),  # hp+alamat+device!
]

def cocok(a, b):
    skor = 0
    if a[2] == b[2]: skor += 2   # no_hp sama (kuat)
    if a[3] == b[3]: skor += 2   # alamat sama (kuat)
    if a[4] == b[4]: skor += 2   # device sama (kuat)
    return skor >= 4  # butuh >=2 atribut kuat

induk = {a[0]: a[0] for a in akun}
def find(x):
    while induk[x] != x: x = induk[x]
    return x
for i in range(len(akun)):
    for j in range(i+1, len(akun)):
        if cocok(akun[i], akun[j]):
            induk[find(akun[j][0])] = find(akun[i][0])

grup = defaultdict(list)
for a in akun: grup[find(a[0])].append(a[0])
for r, anggota in grup.items():
    flag = "🚨 1 ORANG?" if len(anggota) > 1 else "✅ unik"
    print(f"Entitas {r}: {anggota}  {flag}")
print()
print("COBA UBAH: ambang cocok >= 4 -> >= 2 (1 atribut cukup).")
print("A4 ikut terseret? Pelajaran: entity resolution = trade-off")
print("false merge (orang beda digabung) vs missed link (penipu lolos).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR12 — Fraud / ML Analytics</span>
        <h1 className="display-title">Graph Analytics: Melihat Jaringan<br />yang Tak Terlihat</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 200 Rekening, 1 Otak</a></li>
          <li><a href="#model">Model Graph: Node, Edge, dan Maknanya</a></li>
          <li><a href="#komponen">Connected Components: Menemukan Ring</a></li>
          <li><a href="#fitur">Fitur Graph untuk Model ML</a></li>
          <li><a href="#entity">Entity Resolution: 7 Identitas, 1 Orang</a></li>
          <li><a href="#gnn">GNN: Pengantar (dan Batasnya)</a></li>
          <li><a href="#lab1">🔬 Lab 1: Temukan Mule Ring</a></li>
          <li><a href="#lab2">🔬 Lab 2: Entity Resolution</a></li>
          <li><a href="#worked">📐 Worked Example: Menemukan Ring dari 6 Node</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Kejahatan itu Sosial</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Teknik Graph untuk Kasus Apa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Graph Dibutuhkan</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Sindikat Pinjol Ilegal &amp; Graph Device</a></li>

          <li><a href="#case">📋 Mini-Case: 1.000 Rekening, 48 Jam</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Graph Analytics</a></li>

          <li><a href="#latihan">Latihan Mandiri: Membaca Jaringan</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Memodelkan data fraud sebagai <strong>graph</strong> (node, edge, atribut) untuk 3 skenario.</li>
          <li>Menggunakan <strong>connected components</strong> untuk menemukan mule ring.</li>
          <li>Menghitung <strong>fitur graph</strong> (derajat, ukuran komponen, fan-out, jarak ke fraud) untuk model ML.</li>
          <li>Menjelaskan <strong>entity resolution</strong> dan trade-off false merge vs missed link.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 200 Rekening, 1 Otak</h2>
      <div className="story">
        <p>PPATK meneruskan laporan ke sebuah bank: &ldquo;Ada aliran dana mencurigakan Rp4,2 miliar.&rdquo; Tim fraud bank memeriksa 200 rekening yang disebut — <strong>semuanya terlihat normal</strong>. Riwayat wajar, nominal tidak ekstrem, tidak ada yang masuk daftar hitam. Investigasi buntu 3 minggu.</p>
        <p>Lalu seorang analis memplot semuanya sebagai graph: 200 rekening sebagai node, transfer sebagai edge. Polanya <strong>melompat keluar layar</strong>: 200 rekening itu membentuk <strong>3 komponen raksasa</strong> — masing-masing berpusat pada 2–3 rekening &ldquo;hub&rdquo; yang tidak pernah disebut di laporan. Dana mengalir: hub → 60 kaki tangan → 200 rekening → keluar negeri. Tiap kaki tangan sendirian &ldquo;normal&rdquo;; <strong>jaringannya</strong> yang kriminal.</p>
        <p>Twist-nya: 3 rekening hub itu adalah <strong>rekening yang &ldquo;bersih&rdquo;</strong> — tidak pernah transfer mencurigakan secara langsung. Mereka hanya <em>menerima</em> dan <em>meneruskan</em> dalam pola yang hanya terlihat dari ketinggian graph. Lesson ini: <strong>ada kejahatan yang tidak ada di level transaksi — ia hanya ada di level jaringan</strong>.</p>
      </div>

      <h2 id="model">Model Graph: Node, Edge, dan Maknanya</h2>
      <p><strong>Definisi.</strong> Graph <Tex math={String.raw`G = (V, E)`} />: <Tex math={String.raw`V`} /> = himpunan node (entitas), <Tex math={String.raw`E`} /> = himpunan edge (relasi). Untuk fraud, tiga pemodelan standar:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Graph</th><th>Node</th><th>Edge</th><th>Menangkap</th></tr></thead>
          <tbody>
            <tr><td><strong>Transfer graph</strong></td><td>Rekening</td><td>Transfer (arah + nominal + waktu)</td><td>Mule ring, layering, fan-out</td></tr>
            <tr><td><strong>Identity graph</strong></td><td>Akun, device, no HP, alamat, KTP</td><td>&ldquo;Memakai/membagikan&rdquo;</td><td>Synthetic identity, farming (1 device = N akun)</td></tr>
            <tr><td><strong>Bipartite trx</strong></td><td>User + merchant</td><td>Transaksi</td><td>Merchant fraud, kolusi, carding terpusat</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Kepribadian graph:</strong> ia adalah <em>pandangan dari ketinggian</em>. Tabel transaksi = melihat pohon; graph = melihat hutan. Pola yang tak terlihat dari 1 juta baris tabel bisa jelas dalam 1 gambar.</p>

      <h2 id="komponen">Connected Components: Menemukan Ring</h2>
      <p><strong>Definisi.</strong> Connected component = kelompok node yang saling terhubung (lewat edge apa pun). Algoritmanya sederhana (BFS/DFS) tapi hasilnya dahsyat:</p>
      <ul>
        <li><strong>Komponen raksasa + fan-out</strong> (1 node → 60 node) = kandidat mule ring.</li>
        <li><strong>Siklus</strong> (A→B→C→A) = dana berputar — klasik layering/pencucian.</li>
        <li><strong>Komponen yang tumbuh cepat</strong> (10 → 200 node dalam seminggu) = jaringan sedang dibangun.</li>
      </ul>

      <PlotlyChart
        data={ringData}
        title="Distribusi Ukuran Mule Ring yang Terdeteksi (ilustrasi)"
        layout={{ xaxis: { title: "Ukuran ring (jumlah rekening)" }, yaxis: { title: "% ring" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = ukuran ring, tinggi batang = % ring yang terdeteksi berukuran segitu.</p>
        <p><strong>Interpretasi:</strong> 45% ring berukuran kecil (2–5) — <strong>jangan hanya berburu raksasa</strong>. Ring kecil = sel yang baru dibentuk atau sengaja dipecah agar lolos deteksi &ldquo;komponen besar&rdquo;. <strong>Pelajaran:</strong> deteksi harus multi-skala; ambang &ldquo;komponen &gt;50&rdquo; akan meloloskan 92% ring.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> penjahat tahu kamu mencari &ldquo;jaringan besar&rdquo; — maka mereka memecah jadi sel-sel kecil (counter-surveillance). Graph analytics yang dewasa mencari <strong>pola hubungan</strong> (fan-out, siklus, pertumbuhan), bukan sekadar <strong>ukuran</strong>.</p>
      </div>

      <h2 id="fitur">Fitur Graph untuk Model ML</h2>
      <p>Graph tidak hanya untuk visualisasi — ia menghasilkan <strong>fitur paling kuat</strong> untuk model supervised (FR7):</p>
      <ul>
        <li><code className="inline">degree</code>: jumlah koneksi node — hub vs kaki tangan.</li>
        <li><code className="inline">component_size</code>: ukuran komponennya — sendirian vs berjaringan.</li>
        <li><code className="inline">fanout_ratio</code>: keluar ÷ masuk — mule punya fan-out tinggi.</li>
        <li><code className="inline">dist_to_known_fraud</code>: jarak (hop) ke node fraud terkonfirmasi — &ldquo;guilt by association&rdquo;.</li>
        <li><code className="inline">clustering_coef</code>: seberapa &ldquo;kompak&rdquo; tetangganya — ring cenderung kompak.</li>
        <li><code className="inline">pagerank</code>: &ldquo;pengaruh&rdquo; node — hub punya PageRank tinggi.</li>
      </ul>

      <PlotlyChart
        data={featureData}
        title="Kekuatan Fitur Graph (ilustrasi, information value)"
        layout={{ xaxis: { title: "Fitur graph" }, yaxis: { title: "Information value" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kekuatan satu fitur graph memisahkan fraud vs normal.</p>
        <p><strong>Interpretasi:</strong> <strong>fan-out ratio (0,61)</strong> dan <strong>jarak ke fraud (0,58)</strong> adalah jawaranya — &ldquo;bagaimana uang mengalir darimu&rdquo; dan &ldquo;seberapa dekat kamu dengan penjahat&rdquo; lebih bercerita daripada &ldquo;berapa banyak koneksimu&rdquo; (derajat, 0,38). <strong>Pelajaran:</strong> fitur graph terbaik = yang menangkap <em>perilaku aliran</em>, bukan sekadar <em>topologi statis</em>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Guilt by association = tuduh semua yang terhubung dengan penjahat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> jarak graph adalah <strong>sinyal, bukan vonis</strong>. Tukang sayur yang menerima transfer dari mule (jarak 1 hop!) adalah korban, bukan komplotan. Fitur <code className="inline">dist_to_known_fraud</code> menaikkan skor risiko — keputusan tetap butuh investigasi (arah aliran, nominal, pola). Graph yang dipakai sebagai vonis otomatis = memenjarakan orang yang salah alamat.</p>
      </div>

      <h2 id="entity">Entity Resolution: 7 Identitas, 1 Orang</h2>
      <p><strong>Definisi.</strong> Entity resolution = menentukan <em>kapan dua catatan berbeda merujuk ke orang/entitas yang sama</em>. Senjata utama melawan synthetic identity (FR1): 7 &ldquo;identitas&rdquo; dengan nama beda tapi no HP + alamat + device sama = 1 orang.</p>
      <p><strong>Aturan praktis:</strong> cocokkan pada <strong>atribut kuat yang sulit diganti massal</strong> (no HP, device fingerprint, alamat) — bukan nama (mudah divariasi: &ldquo;Budi S.&rdquo; vs &ldquo;B. Santoso&rdquo;). Butuh ≥2 atribut kuat yang cocok untuk menggabungkan.</p>
      <p><strong>Trade-off abadi:</strong></p>
      <ul>
        <li><strong>False merge</strong> (terlalu agresif): dua orang beda digabung — mis. satu keluarga berbagi alamat + device. Akibat: nasabah legit dituduh.</li>
        <li><strong>Missed link</strong> (terlalu ketat): penipu lolos karena &ldquo;tidak cukup bukti&rdquo;.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> entity resolution adalah <strong>detektif identitas</strong>, bukan hakim. Outputnya = &ldquo;kandidat entitas sama dengan skor keyakinan&rdquo; — bukan vonis. Di produksi, hasil merge di atas ambang tertentu masuk antrian review manusia (FR11), bukan auto-block.</p>
      </div>

      <h2 id="gnn">GNN: Pengantar (dan Batasnya)</h2>
      <p><strong>Definisi singkat.</strong> Graph Neural Network mempelajari representasi node dengan <strong>mengumpulkan informasi dari tetangganya</strong> berulang-ulang (message passing):</p>
      <Tex math={String.raw`h_v^{(k+1)} = \sigma\left(W \cdot \text{AGG}\left(\{h_u^{(k)} : u \in N(v)\} \cup \{h_v^{(k)}\}\right)\right)`} block />
      <ul>
        <li><Tex math={String.raw`h_v^{(k)}`} />: representasi node <Tex math={String.raw`v`} /> di lapisan ke-<Tex math={String.raw`k`} />.</li>
        <li><Tex math={String.raw`N(v)`} />: tetangga-tetangga <Tex math={String.raw`v`} />.</li>
        <li><strong>Intuisi:</strong> &ldquo;kamu adalah rata-rata teman-temanmu&rdquo; — direpresentasikan secara matematis, bertingkat.</li>
      </ul>
      <p><strong>Kapan GNN layak:</strong> graph besar + pola relasional kompleks + tim ML kuat. <strong>Batas jujurnya:</strong> (1) butuh <strong>label node</strong> yang banyak (mahal!); (2) <strong>sulit dijelaskan</strong> ke auditor (kotak hitam — FR17); (3) untuk banyak kasus, <strong>fitur graph + GBM</strong> (bagian &ldquo;Fitur Graph&rdquo; di atas) mencapai 90% manfaat dengan 10% kerumitan. <strong>Rekomendasi praktis:</strong> kuasai fitur graph dulu; GNN adalah upgrade belakangan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Graph analytics = harus pakai GNN/deep learning.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 80% nilai graph datang dari <strong>teknik klasik</strong>: connected components, derajat, fan-out, entity resolution — semuanya bisa dengan SQL + Python standar. GNN adalah 20% sisanya dengan biaya 10× lipat. Jangan beli traktor untuk mencabut rumput.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Temukan Mule Ring</h2>
      <p>Bangun detektor ring dengan connected components.</p>
      <PyodideLab
        title="Lab 1 — Connected Components: Berburu Ring"
        hint="Tambah edge ('O','P',3) dan lihat dua komponen menyambung. Pikirkan: seberapa sering graph produksi harus dihitung ulang?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Entity Resolution</h2>
      <PyodideLab
        title="Lab 2 — 7 Identitas, 1 Orang?"
        hint="Ubah ambang cocok ≥4 → ≥2. Amati trade-off false merge vs missed link secara langsung."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menghitung Sinyal Graph dengan Tangan</h2>
      <p>Graph analytics terdengar canggih sampai kamu menghitungnya manual untuk 6 node — lalu polanya menjadi intuisi permanen.</p>

      <details className="worked">
        <summary>📐 Contoh 1: shared-device — 6 rekening, 2 device</summary>
        <p>Data: rekening R1–R6. Device D1 dipakai R1, R2, R3. Device D2 dipakai R4, R5, R6. R2 juga pernah login dari D2.</p>
        <p><strong>Langkah 1 — bangun graph bipartit.</strong> Node: 6 rekening + 2 device. Edge: R1–D1, R2–D1, R3–D1, R4–D2, R5–D2, R6–D2, R2–D2.</p>
        <p><strong>Langkah 2 — hitung fitur.</strong> <em>device_count(R)</em>: R1=1, R3=1, R4=1, R5=1, R6=1, <strong>R2=2</strong> (jembatan!). <em>device_sharing(D)</em>: D1 dipakai 3 rekening, D2 dipakai 4 rekening.</p>
        <p><strong>Langkah 3 — baca polanya.</strong> R2 adalah <strong>jembatan</strong> antara dua cluster — dalam investigasi nyata, ini pola &ldquo;operator&rdquo; yang mengelola dua batch rekening mule. Tanpa graph, R2 terlihat seperti nasabah biasa dengan 2 device (wajar!). Dengan graph, ia penghubung dua komunitas mencurigakan.</p>
        <p><strong>Langkah 4 — skor risiko.</strong> Aturan sederhana: <em>risk(R) = jumlah tetangga-berisiko / total tetangga</em>. Jika R4, R5, R6 sudah terkonfirmasi mule, maka risk(R2) = 3/4 = <strong>0,75</strong> — R2 &ldquo;ketularan&rdquo; risiko dari jaringannya. Inilah <strong>guilt by association</strong>: bukan bukti pengadilan, tapi prioritas investigasi yang sangat efektif.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: satu iterasi label propagation</summary>
        <p>Graph rantai pencucian: A(terkonfirmasi jahat) → B → C → D, plus E (nasabah biasa) → C (kebetulan transfer ke C untuk jual-beli motor).</p>
        <p><strong>Langkah 1 — inisialisasi.</strong> Label: A=1 (jahat), E=0 (bersih), B/C/D = belum tahu (0,5).</p>
        <p><strong>Langkah 2 — iterasi 1 (rata-rata tetangga).</strong> B = rata-rata(A=1) = 1,0. C = rata-rata(B=0,5, E=0) = 0,25. D = rata-rata(C=0,5) = 0,5.</p>
        <p><strong>Langkah 3 — iterasi 2.</strong> B = 1,0 (tetap). C = rata-rata(B=1,0, E=0) = <strong>0,5</strong>. D = rata-rata(C=0,25) = 0,25.</p>
        <p><strong>Interpretasi:</strong> risiko &ldquo;mengalir&rdquo; dari A ke D tetapi <strong>melemah dengan jarak</strong> (1,0 → 0,5 → 0,25) — dan E yang bersih <em>menarik turun</em> skor C. Inilah kenapa label propagation butuh <strong>iterasi terbatas + damping</strong>: tanpa itu, seluruh graph akan &ldquo;ketularan&rdquo; dan E yang tidak bersalah ikut tercemar. Pelajaran praktis: batasi propagasi 2–3 hop dan selalu gabungkan dengan fitur tabular — graph memberi <em>konteks</em>, bukan vonis.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Kejahatan itu Sosial</h2>
      <p>Kejahatan terorganisir — menurut definisinya — <strong>melibatkan organisasi</strong>: orang-orang yang saling kenal, berbagi resource, berkoordinasi. Dan organisasi <em>selalu</em> meninggalkan struktur: device yang dipakai bersama, rekening yang saling transfer, jam operasi yang sama. <strong>Graph analytics bukan teknik canggih — ia adalah pengakuan bahwa musuhmu bekerja tim.</strong> Melawan sindikat dengan model per-transaksi = melawan tim sepak bola dengan 11 duel satu lawan satu.</p>
      <p>Intuisi kedua: <strong>jaringan adalah hal termahal yang diganti penjahat</strong>. Ganti nama = gratis. Ganti KTP = Rp300rb. Ganti device = Rp1jt. Tapi <strong>membangun ulang jaringan 500 mule yang terpercaya</strong> = berbulan-bulan + risiko pengkhianatan. Setiap kali kamu membongkar satu ring via graph, kamu tidak hanya menangkap kasus — kamu <strong>menaikkan biaya operasi musuh</strong>. Itulah kemenangan strategis, bukan sekadar taktis.</p>
      <p><strong>Kapan graph TIDAK dibutuhkan:</strong> (1) <strong>fraud individual oportunis</strong> — tidak ada jaringan, tidak ada gunanya; (2) <strong>data relasi tidak ada</strong> — graph dari 1 hop = tabel biasa yang mahal; (3) <strong>keputusan real-time &lt; 50ms</strong> — query graph dalam = lambat; pakai <em>fitur graph yang di-precompute</em> (FR13); (4) <strong>tanpa analis yang bisa membaca graph</strong> — visualisasi jaringan yang tidak dipahami = seni abstrak.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> mulai graph dari <strong>pertanyaan investigasi</strong>, bukan dari teknologi: &ldquo;rekening ini terhubung ke siapa?&rdquo; → 1-hop query. &ldquo;Ada komunitas tersembunyi?&rdquo; → community detection. <strong>Teknologi mengikuti pertanyaan</strong> — bukan sebaliknya.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Teknik Graph untuk Kasus Apa</h2>

      <div className="decision-card">
        <h3>1. Dugaan mule ring / layering → <strong>transfer graph + connected components + fan-out</strong></h3>
        <p><strong>Kenapa:</strong> pola aliran dana hanya terlihat di level jaringan.</p>
        <p><strong>Contoh nyata:</strong> kasus 200 rekening — 3 komponen raksasa + hub.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dugaan synthetic identity / farming → <strong>identity graph + entity resolution</strong></h3>
        <p><strong>Kenapa:</strong> 1 orang = N identitas; hanya atribut bersama yang membongkarnya.</p>
        <p><strong>Contoh nyata:</strong> 7 &ldquo;identitas&rdquo;, 1 no HP, 1 device.</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh fitur untuk model supervised → <strong>fitur graph (fan-out, jarak ke fraud, PageRank)</strong></h3>
        <p><strong>Kenapa:</strong> 90% manfaat graph dengan 10% kerumitan GNN.</p>
      </div>

      <div className="decision-card">
        <h3>4. Graph raksasa + pola kompleks + tim kuat → <strong>GNN (upgrade)</strong></h3>
        <p><strong>Kenapa:</strong> message passing menangkap pola relasional dalam.</p>
        <p><strong>Syarat:</strong> label node cukup + siap menjelaskan keterbatasannya ke auditor.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Mulai dari <strong>teknik klasik</strong> (components, fan-out, entity resolution) — bukan GNN.</li>
          <li>Cari <strong>pola hubungan</strong> (fan-out, siklus), bukan sekadar ukuran.</li>
          <li>Graph = <strong>sinyal, bukan vonis</strong> — guilt by association butuh investigasi.</li>
          <li>Hitung ulang graph <strong>berkala</strong> — satu edge baru bisa mengubah segalanya.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Graph vs Tabular</h2>
      <p>Graph itu mahal (infra, komputasi, keahlian). Tiga skenario kapan ia layak — dan kapan tidak:</p>
      <p><strong>Skenario A — layak: fraud terorganisir (sindikat).</strong> Ciri: banyak entitas, berbagi resource (device, rekening, alamat), pola fan-in/fan-out. Contoh: 500 KTP dari 3 device (FR6), jaringan mule judol (FR1). Di sini graph bukan opsional — <strong>tanpa graph kamu hanya melihat daun, bukan hutannya</strong>. ROI: satu ring yang terbongkar = ratusan kasus sekaligus.</p>
      <p><strong>Skenario B — tidak layak: fraud individual oportunis.</strong> Kartu curian dipakai satu orang untuk belanja pribadi — tidak ada jaringan. Graph tidak menambah apa-apa selain biaya komputasi. Model tabular + velocity sudah cukup. Aturan: <strong>jangan bayar harga graph untuk masalah yang tidak punya struktur jaringan</strong>.</p>
      <p><strong>Skenario C — real-time graph query vs batch.</strong> Query &ldquo;apakah device ini dipakai 10 rekening lain?&rdquo; butuh graph database (Neo4j/Memgraph) untuk &lt; 50ms. Tapi <em>community detection</em> &amp; label propagation cukup batch harian — hasilnya disimpan sebagai fitur di feature store (FR13). Praktik terbaik: <strong>online untuk lookup 1–2 hop, batch untuk analisis komunitas</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> penjahat bisa ganti <em>identitas</em> (nama, KTP, nomor HP) dalam sehari — tapi sulit mengganti <em>jaringannya</em> (device, rekening penampung, pola aliran). Graph menyerang <strong>hal yang paling mahal diganti musuh</strong>. Itulah kenapa ia senjata anti-sindikat terbaik.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Membongkar &ldquo;Pabrik Pengajuan&rdquo; Pinjol</h2>
      <p>Temuan tim risk P2P lending (pola umum 2023–2025): aplikasi pinjaman diserbu ribuan pengajuan yang <em>terlihat</em> independen — nama berbeda, KTP berbeda, selfie berbeda. Model tabular memberi skor rendah karena tiap pengajuan individual &ldquo;wajar&rdquo;.</p>
      <p><strong>Yang ditemukan analisis graph:</strong> 2.300 pengajuan dalam 30 hari terhubung ke hanya <strong>41 device</strong> — rata-rata 56 pengajuan per device. Lebih dalam: device-device itu berbagi pola: jam pengajuan sama (09.00–17.00, &ldquo;jam kerja&rdquo; sindikat), versi aplikasi sama, dan 80% KTP-nya berasal dari 3 kabupaten yang sama.</p>
      <p><strong>Angka ilustratif:</strong> 2.300 × Rp2,5jt = <strong>Rp5,75 miliar</strong> eksposur dari satu &ldquo;pabrik&rdquo;. Setelah device-device itu di-blacklist + graph query real-time (&ldquo;tolak jika device pernah dipakai &gt; 5 KTP berbeda&rdquo;), pengajuan dari pola ini turun 94% dalam 2 minggu — sindikat pindah ke platform lain yang belum punya pertahanan graph.</p>
      <p><strong>Pelajaran:</strong> tiap pengajuan <em>individual</em> lolos semua rule tabular — karena sindikat tahu cara terlihat &ldquo;normal&rdquo; satu per satu. Yang tidak bisa mereka sembunyikan: <strong>mereka berbagi infrastruktur</strong>. Graph adalah satu-satunya lensa yang melihat <em>kolektivitas</em> — dan kolektivitas adalah definisi sindikat.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Graph analytics butuh GNN deep learning.&rdquo;<br /><strong>Yang benar:</strong> 80% nilai graph di fraud datang dari <strong>fitur sederhana</strong>: degree, shared-device count, 2-hop risk propagation (seperti contoh di atas). GNN baru dibutuhkan untuk pola sangat kompleks — dan butuh data + keahlian besar. Mulai dari graph feature engineering; naik ke GNN hanya jika fitur sederhana mentok.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 1.000 Rekening, 48 Jam</h2>
      <div className="callout">
        <p>PPATK: &ldquo;1.000 rekening terindikasi menampung dana judi online Rp12 miliar. Bantu petakan jaringannya dalam 48 jam.&rdquo; Data: 1.000 rekening + 8.000 transfer (30 hari). Tidak ada label &ldquo;mana yang inti&rdquo;.</p>
        <p><strong>Pertanyaan:</strong> langkah analisis 48 jam (spesifik: teknik apa, urutan apa, output apa untuk penyidik)?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Jam 0–6:</strong> bangun transfer graph; hitung connected components → dapat peta &ldquo;pulau-pulau&rdquo;. <strong>Jam 6–18:</strong> per komponen, hitung fan-out ratio + ukuran + total aliran; ranking komponen by &ldquo;skor ring&rdquo; (ukuran × fan-out × % dana keluar negeri). <strong>Jam 18–30:</strong> PageRank per komponen → identifikasi hub (otak); cek siklus (layering).</p>
          <p><strong>Jam 30–42:</strong> entity resolution pada hub + kaki tangan (apakah 50 &ldquo;orang&rdquo; = 5 orang?) — ini yang membedakan &ldquo;jaringan kriminal&rdquo; dari &ldquo;kebetulan&rdquo;. <strong>Jam 42–48:</strong> laporan penyidik: peta visual per komponen + daftar hub terurut + bukti pola (bukan vonis!).</p>
          <p><strong>Yang TIDAK dilakukan:</strong> melatih GNN (tidak ada waktu, tidak ada label), menuduh dari jarak 1-hop (butuh verifikasi). <strong>Pelajaran:</strong> dalam krisis, teknik klasik yang cepat &gt; teknik canggih yang lambat.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Graph Analytics</h2>
      <details className="worked">
        <summary>Q1: Butuh graph database (Neo4j) atau cukup SQL?</summary>
        <p><strong>Mulai dari SQL</strong> — 1–2 hop query (device sharing, fan-out) bisa ditulis dengan join/window function (FR21, kasus mule ring). <strong>Naik ke graph DB saat:</strong> butuh multi-hop real-time (&lt; 100ms), community detection rutin, atau visualisasi investigasi interaktif. Aturan: <em>buktikan nilainya dengan SQL dulu</em> — graph DB adalah investasi infra yang harus dibayar dengan temuan.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bisakah graph dipakai real-time?</summary>
        <p><strong>Lookup dangkal (1–2 hop): ya</strong> — &ldquo;device ini dipakai berapa rekening?&rdquo; bisa &lt; 50ms dengan index tepat. <strong>Analisis dalam (community, propagation): tidak</strong> — itu batch harian, hasilnya disimpan sebagai <em>fitur</em> di feature store. Arsitektur: <strong>online untuk yang dangkal, batch untuk yang dalam</strong> (FR13 skenario C).</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana dengan privasi — graph kan menghubungkan orang?</summary>
        <p><strong>Justru di sinilah risiko terbesar.</strong> Graph bisa menghubungkan orang yang tidak bersalah (E di worked example 2 — korban/penerima biasa). Prinsip: (1) <strong>skor graph = prioritas investigasi, bukan vonis</strong>; (2) batasi hop propagation (2–3); (3) <strong>jangan simpan graph sosial</strong> di luar tujuan fraud yang sah (UU PDP); (4) audit berkala: berapa &ldquo;tertular&rdquo; yang ternyata bersih? <em>Kekuatan graph menuntut tanggung jawab proporsional.</em></p>
      </details>
      <details className="worked">
        <summary>Q4: Kapan butuh GNN (Graph Neural Network)?</summary>
        <p><strong>Jarang.</strong> 80% nilai graph di fraud = fitur sederhana (degree, shared count, 2-hop risk). GNN baru relevan saat: pola relasional <em>sangat kompleks</em> (multi-tipe node/edge), data <em>sangat besar</em>, dan tim <em>sangat mampu</em> mengoperasikannya. <strong>Urutannya: fitur graph → label propagation → GNN.</strong> Melompat langsung ke GNN = membayar harga tertinggi untuk masalah yang mungkin selesai dengan COUNT(*).</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Membaca Jaringan</h2>
      <p><strong>1.</strong> 8 rekening memakai 2 device: D1 dipakai R1-R5, D2 dipakai R4-R8. Rekening mana yang &ldquo;jembatan&rdquo;? Jika R1, R2, R3 terkonfirmasi mule, hitung risk(R4) dengan guilt-by-association sederhana.</p>
      <p><strong>2.</strong> Satu iterasi label propagation: A=1 (jahat) → B → C; D=0 (bersih) → C. Hitung skor B dan C setelah 1 iterasi. Apa yang terjadi jika iterasi dilanjutkan tanpa damping?</p>
      <p><strong>3.</strong> Kasus carding individual (1 kartu, 1 orang, belanja pribadi). Perlukah graph analytics? Jelaskan 2 kalimat.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> <strong>R4 jembatan</strong> (memakai D1 dan D2). Tetangga R4: via D1 → R1,R2,R3 (jahat), R5; via D2 → R6,R7,R8. Risk = 3/7 ≈ <strong>0,43</strong> — prioritas investigasi menengah-tinggi, bukan vonis.</p>
        <p><strong>2.</strong> B = 1,0; C = rata-rata(0,5; 0) = <strong>0,25</strong>. Tanpa damping, iterasi berlanjut akan <strong>menaikkan skor D yang bersih</strong> (tercemar balik) — makanya batasi 2-3 hop + damping.</p>
        <p><strong>3.</strong> <strong>Tidak.</strong> Tidak ada struktur jaringan — graph tidak menambah sinyal selain biaya. Model tabular + velocity cukup. <em>Bayar harga graph hanya untuk masalah berjaringan.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 200 rekening masing-masing 'normal', tapi membentuk 3 komponen raksasa dengan hub fan-out. Kesimpulan?"
        options={[
          "Tidak ada masalah — tiap rekening normal",
          "Kandidat mule ring — kejahatannya ada di level jaringan, tak terlihat di level transaksi",
          "Hapus datanya",
          "Kebetulan",
        ]}
        correct={1}
        explanation="Benar: pola jaringan (fan-out massal, komponen raksasa) adalah sinyal yang tak bisa dilihat dari tabel transaksi. Tiap node 'normal' adalah kamuflase."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa 'ukuran komponen besar' SAJA bukan detektor ring yang baik?"
        options={[
          "Komponen besar selalu normal",
          "Penjahat memecah jadi sel-sel kecil (2-5 rekening) — 45% ring berukuran kecil; cari pola hubungan (fan-out, siklus), bukan ukuran",
          "Ukuran tidak bisa dihitung",
          "Graph tidak berguna",
        ]}
        correct={1}
        explanation="Benar: counter-surveillance. Ambang 'komponen >50' meloloskan 92% ring. Deteksi harus multi-skala dan berbasis pola."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Fitur graph dengan information value tertinggi untuk mule?"
        options={[
          "Derajat (jumlah koneksi)",
          "Fan-out ratio & jarak ke fraud known — perilaku aliran > topologi statis",
          "Warna node",
          "ID rekening",
        ]}
        correct={1}
        explanation="Benar: fan-out (0,61) & jarak ke fraud (0,58) mengalahkan derajat (0,38). 'Bagaimana uang mengalir' lebih bercerita daripada 'berapa koneksimu'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Tukang sayur menerima transfer dari mule (jarak 1 hop). Apakah ia komplotan?"
        options={[
          "Ya — guilt by association",
          "Belum tentu — jarak graph = sinyal, bukan vonis; butuh investigasi arah aliran & pola. Ia mungkin korban/penerima biasa",
          "Tidak mungkin",
          "Blokir langsung",
        ]}
        correct={1}
        explanation="Benar: sinyal ≠ vonis. Graph yang dipakai sebagai vonis otomatis = menuduh orang yang salah alamat. Investigasi memverifikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan GNN layak dipakai (vs fitur graph + GBM)?"
        options={[
          "Selalu — lebih canggih",
          "Graph raksasa + pola relasional kompleks + label node cukup + tim kuat — dan sadar 90% manfaat sering dicapai fitur klasik dengan 10% kerumitan",
          "Tidak pernah",
          "Hanya untuk skripsi",
        ]}
        correct={1}
        explanation="Benar: GNN = upgrade, bukan fondasi. Syaratnya berat (label, explainability, kompleksitas). Kuasai teknik klasik dulu."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Graph</strong> <Tex math={String.raw`G=(V,E)`} />: transfer graph (mule), identity graph (synthetic), bipartite (merchant fraud).</li>
          <li><strong>Connected components</strong> + fan-out + siklus = detektor ring klasik.</li>
          <li><strong>Fitur graph</strong> (fan-out ratio, jarak ke fraud, PageRank) = 90% manfaat dengan 10% kerumitan GNN.</li>
          <li><strong>Entity resolution</strong>: ≥2 atribut kuat cocok = kandidat 1 orang; trade-off false merge vs missed link.</li>
          <li><strong>GNN</strong>: message passing <Tex math={String.raw`h_v^{(k+1)}`} /> — upgrade belakangan, bukan fondasi.</li>
          <li>Graph = <strong>sinyal, bukan vonis</strong>. Cari pola hubungan, bukan sekadar ukuran.</li>
          <li>Kapan TIDAK pakai graph: kasus tunggal tanpa relasi — tabel biasa cukup.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr11-threshold" className="btn btn-secondary btn-sm">← FR11</Link>
        <Link href="/learn/fr13-realtime" className="btn btn-primary btn-sm">Next: FR13 →</Link>
      </div>
    </div>
  );
}
