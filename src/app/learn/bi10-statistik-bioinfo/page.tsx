"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi10StatistikBioinfoPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi10FdrData = [{"x": ["Tanpa koreksi", "Bonferroni", "FDR (BH)"], "y": [1000, 2, 95], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1", "#2a7de1"]}, "text": ["~1000", "2", "95 (5% palsu)"], "textposition": "outside"}];
  const bi10FdrDataLayout = {"xaxis": {"title": "Metode"}, "yaxis": {"title": "Jumlah klaim"}, "showlegend": false};

  const lab1Code = "import random\nrandom.seed(77)\nm, n_sinyal = 1000, 50\npvals = []\nfor i in range(m):\n    if i < n_sinyal:\n        pvals.append((True, random.betavariate(0.5, 8)))  # sinyal: p kecil\n    else:\n        pvals.append((False, random.random()))            # noise: uniform\ndef evaluasi(lolos):\n    benar = sum(1 for i in lolos if pvals[i][0])\n    return benar, len(lolos)-benar\n# tanpa koreksi\nl1 = [i for i,(s,p) in enumerate(pvals) if p < 0.05]\n# Bonferroni\nl2 = [i for i,(s,p) in enumerate(pvals) if p < 0.05/m]\n# BH\nurut = sorted(range(m), key=lambda i: pvals[i][1])\nkmax = max([k for k,(i) in enumerate(urut,1) if pvals[i][1] <= k/m*0.05] or [0])\nl3 = urut[:kmax]\nfor nama, l in [('tanpa koreksi',l1),('Bonferroni',l2),('BH-FDR',l3)]:\n    b, f = evaluasi(l)\n    print(f'{nama:<14}: {len(l):>4} klaim = {b} benar + {f} PALSU')\nprint()\nprint('Tanpa koreksi: banjir palsu. Bonferroni: aman tapi buta.')\nprint('BH: menemukan sinyal dengan 5% palsu terkontrol.')";

  const lab2Code = "import random, statistics as st\nrandom.seed(88)\nEFEK_BATCH = 2.0  # ubah: 0.5 vs 2.0\nsampel = []\nfor b in ['A','B']:\n    for k in ['kontrol','kasus']:\n        for r in range(3):\n            expr = [random.gauss(0,1) + (EFEK_BATCH if b=='B' else 0)\n                    + (0.8 if k=='kasus' and i<10 else 0) for i in range(100)]\n            sampel.append((f'{b}-{k}{r}', b, k, expr))\ndef kor(a, b):\n    ma, mb = st.mean(a), st.mean(b)\n    atas = sum((x-ma)*(y-mb) for x,y in zip(a,b))\n    bawah = (sum((x-ma)**2 for x in a)*sum((y-mb)**2 for y in b))**0.5\n    return atas/bawah\n# rata-rata korelasi dalam-batch vs dalam-kondisi\nkb = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[1]==b[1]]\nkk = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[2]==b[2]]\nprint(f'korelasi rata2 dalam-BATCH   : {st.mean(kb):.2f}')\nprint(f'korelasi rata2 dalam-KONDISI : {st.mean(kk):.2f}')\nprint()\nif st.mean(kb) > st.mean(kk):\n    print('BATCH mendominasi! -> cek desain, koreksi, atau ulangi.')\nelse:\n    print('Kondisi mendominasi -> aman, lanjutkan analisis.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI10 &mdash; Bioinformatics</span>
        <h1 className="display-title">FDR &amp; Batch Effect:<br />Statistik yang Menyelamatkanmu</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 1.000 Penemuan Palsu</a></li>
          <li><a href="#fdr">Multiple Testing: Bonferroni vs FDR</a></li>
          <li><a href="#batch">Batch Effect — Si Pembunuh Diam-diam</a></li>
          <li><a href="#reduksi">PCA/UMAP, Clustering &amp; Power</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bonferroni vs BH</a></li>
          <li><a href="#lab2">🔬 Lab 2: Deteksi Batch Effect via PCA</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Manajemen Kesalahan yang Jujur</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: GWAS Chip 500.000 SNP</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>FWER (Bonferroni) vs FDR (BH)</strong> dan memilih yang tepat.</li>
          <li>Mengenali <strong>batch effect</strong> dari plot dan merancang koreksinya.</li>
          <li>Menggunakan <strong>PCA/UMAP + clustering</strong> untuk QC dan eksplorasi.</li>
          <li>Menghitung <strong>power &amp; ukuran sampel</strong> untuk eksperimen genomik.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 1.000 Penemuan Palsu</h2>
      <div className="story">
        <p>Sebuah lab menguji 20.000 gen untuk asosiasi dengan penyakit, memakai p&lt;0,05 tanpa koreksi. Hasil: 1.200 “gen penemuan”. Konferensi pers disiapkan. Lalu statistikawan menghitung: 20.000 × 0,05 = <strong>1.000 false positive ekspektasi</strong> — hampir semua “penemuan” adalah noise. Konferensi pers dibatalkan.</p>
      <p>Di bioinformatika, kamu tidak melakukan SATU uji — kamu melakukan RIBUAN sekaligus. Tanpa koreksi multiple testing, p-value adalah mesin produksi penemuan palsu. Lesson ini adalah sabuk pengaman statistik seluruh track.</p>
      <p>Twist-nya: koreksi yang terlalu ketat sama berbahayanya dengan tidak koreksi sama sekali. Bonferroni pada 20.000 gen menuntut p &lt; 2,5×10<sup>-6</sup> — penemuan nyata dengan efek sedang ikut mati, lab membuang kandidat obat yang valid. <strong>False negative juga punya biaya.</strong> FDR adalah kompromi yang jujur: bukan “nol kesalahan”, tapi “dari 100 klaimku, ~5 boleh salah” — cukup longgar untuk menemukan, cukup ketat untuk dipercaya. Statistik di sini bukan soal kemurnian; soal <strong>manajemen kesalahan yang transparan</strong>.</p>
      </div>

      <h2 id="fdr">Multiple Testing: Bonferroni vs FDR</h2>
      <p><strong>Definisi.</strong> <strong>Bonferroni</strong>: ambang = alpha/m (kontrol peluang SATU pun false positive — FWER). <strong>FDR (Benjamini-Hochberg)</strong>: kontrol <em>proporsi</em> false discovery di antara yang diklaim — jauh lebih powerful untuk eksplorasi.</p>
      <Tex math={String.raw`p_{(k)} \leq \frac{k}{m}\alpha \quad \text{(tolak semua } H_{(1)}..H_{(k)}\text{ terbesar yang memenuhi)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`p_{(k)}`} />: p-value terurut ke-k terkecil</li>
          <li><Tex math={String.raw`m`} />: total uji</li>
          <li><Tex math={String.raw`\alpha`} />: level FDR target (mis. 0,05)</li>
      </ul>
      <p><strong>Interpretasi:</strong> BH: urutkan p-value, cari titik potong garis (k/m)*alpha. Dari 100 klaim pada FDR 5%, ekspektasi hanya 5 yang palsu — vs Bonferroni yang hampir tidak mengklaim apa pun pada m besar.</p>
      <details className="worked">
        <summary>📐 Contoh: 10.000 uji GWAS</summary>
        <p><strong>Bonferroni</strong>: ambang = 5e-8 (standar GWAS!). Hanya sinyal raksasa lolos — aman tapi buta untuk efek sedang.<br /><strong>BH FDR 5%</strong>: ratusan sinyal lolos dengan 5% false — cocok untuk eksplorasi hipotesis.<br />Pilih: klaim final/regulasi → Bonferroni; eksplorasi/penemuan → FDR. Jangan tertukar!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Bonferroni itu seperti satpam super-ketat: tidak ada satu pun penyusup boleh lolos — tapi tamu sah pun sulit masuk. FDR itu seperti satpam realistis: “5% yang masuk boleh jadi penyusup, asal 95% tamu asli” — cocok untuk pesta besar (20.000 gen).</p>
      <p><strong>Kapan memakai:</strong> GWAS final, klaim diagnostik → Bonferroni. RNA-seq eksplorasi, screening → FDR.</p>

      <PlotlyChart
        data={bi10FdrData}
        title="Klaim Signifikan dari 20.000 Uji (ilustratif)"
        layout={bi10FdrDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiga pendekatan pada 20.000 uji dengan 100 sinyal sejati. Kuning = tanpa koreksi (banjir).</p>
        <p><strong>Interpretasi:</strong> Tanpa koreksi: 1.000 klaim palsu. Bonferroni: hanya 2 lolos (aman tapi buta — 98 sinyal sejati hilang!). FDR: 95 klaim dengan ~5 palsu — keseimbangan untuk penemuan. Pilih sesuai misi: bukti final vs eksplorasi.</p>
      </div>

      <h2 id="batch">Batch Effect — Si Pembunuh Diam-diam</h2>
      <p><strong>Definisi.</strong> <strong>Batch effect</strong>: variasi teknis sistematis (tanggal, teknisi, reagen, mesin) yang mengacaukan sinyal biologis. Ia adalah confounder paling umum di genomik — dan paling sering diabaikan.</p>
      <details className="worked">
        <summary>📐 Contoh: deteksi &amp; koreksi</summary>
        <p><strong>Deteksi:</strong> PCA — sampel mengelompok per tanggal sekuensing, bukan per kondisi → batch effect confirmed.<br /><strong>Pencegahan (terbaik):</strong> acak sampel ke batch (interleaved); jangan sekuensing semua kontrol Januari, semua kasus Maret.<br /><strong>Koreksi:</strong> masukkan batch ke desain (~batch + kondisi) atau ComBat. <strong>Tapi:</strong> bila batch = kondisi (confounded total), TIDAK ADA koreksi yang valid — ulangi eksperimen.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Batch effect itu seperti noda kopi di lensa mikroskop: kamu mengira melihat pola biologis, padahal melihat noda. Yang mengerikan: nodanya konsisten, sehingga terlihat seperti “temuan”.</p>
      <p><strong>Kapan memakai:</strong> Setiap eksperimen multi-batch: rancang interleaved, catat metadata batch, cek PCA, koreksi (ComBat/limma) atau masukkan ke desain.</p>
      <div className="callout callout-warning"><strong>Aturan emas:</strong> batch effect yang confounded total dengan kondisi TIDAK BISA dikoreksi secara statistik. Koreksi butuh variasi batch DI DALAM tiap kondisi. Desain &gt; analisis, selalu.</div>

      <h2 id="reduksi">PCA/UMAP, Clustering &amp; Power</h2>
      <p><strong>Definisi.</strong> <strong>PCA</strong>: proyeksi linear variansi maksimal — untuk QC &amp; struktur global. <strong>UMAP</strong>: non-linear, menjaga tetangga lokal — untuk visualisasi klaster (single-cell). <strong>Clustering hierarkis</strong>: dendrogram hubungan sampel. <strong>Power</strong>: peluang mendeteksi efek yang ada — tentukan n SEBELUM eksperimen.</p>
      <Tex math={String.raw`\text{Power} = 1 - \beta = P(\text{tolak } H_0 | H_1 \text{ benar})`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\beta`} />: peluang false negative (tipe II)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Power 80% = dari 100 efek nyata, 80 terdeteksi. n kecil + efek kecil + m besar (multiple testing!) = power ambyar. Hitung n dengan mempertimbangkan koreksi multiple testing — bukan n untuk satu uji.</p>
      <details className="worked">
        <summary>📐 Contoh: baca PCA QC</summary>
        <p>PCA 12 sampel RNA-seq: PC1 (40% variansi) memisahkan batch A vs B; PC2 (15%) memisahkan kondisi.<br />Bacaan: batch mendominasi kondisi → waspada! Cek: apakah batch seimbang antar kondisi? Jika ya → masukkan ke desain. Jika tidak → masalah.<br /><strong>UMAP</strong> untuk single-cell: tiap titik = sel; klaster = tipe sel (lihat BI11). Jangan overinterpretasi jarak antar-klaster UMAP — ia tidak bermakna kuantitatif!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> PCA itu seperti melihat hutan dari helikopter: pola besar terlihat (batch, kondisi), detail hilang. UMAP itu seperti peta wisata: klaster jelas, tapi jarak antar kota tidak sesuai skala. Power itu seperti menyiapkan jala: terlalu kecil = ikan besar pun lolos.</p>
      <p><strong>Kapan memakai:</strong> QC pertama SETIAP analisis omics: PCA + label batch/kondisi. Power: sebelum grant/eksperimen, dengan m terkoreksi.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;p-value yang sudah dikoreksi tidak perlu FDR lagi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> p-value mentah dari 20.000 uji BUKAN 20.000 bukti — ia 20.000 kesempatan false positive. “Sudah signifikan p&lt;0,05” tanpa koreksi = tidak berarti apa-apa di skala genomik. Koreksi bukan opsional, ia adalah uji itu sendiri.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Batch effect bisa selalu dikoreksi dengan ComBat&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Hanya bila batch tidak confounded total dengan kondisi. Bila semua kasus di batch A dan semua kontrol di batch B, ComBat akan “mengoreksi” sinyal biologisnya juga — atau gagal total. Pencegahan (desain interleaved) &gt; koreksi.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;UMAP menunjukkan jarak biologis antar klaster&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> UMAP mengorbankan jarak global demi struktur lokal. Dua klaster yang berjauhan di UMAP belum tentu berjauhan secara biologis. Jangan ukur “kedekatan” dari plot UMAP — gunakan jarak di ruang asli.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Jadikan <strong>PCA berlabel batch</strong> sebagai gambar pertama setiap analisis. 30 detik ini mencegah 30 hari analisis sia-sia.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk multiple testing: laporkan <strong>metode + ambang + jumlah uji</strong> (“BH FDR 5%, m=20.000”). “Signifikan” tanpa ketiganya = tidak informatif.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Hitung <strong>power dengan m terkoreksi</strong>: n untuk satu uji-t ≠ n untuk 20.000 uji dengan Bonferroni. Konsultasi statistik SEBELUM sekuensing, bukan sesudah.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bonferroni vs BH — Hitung Sendiri</h2>
      <p>Simulasikan 1.000 uji (50 sinyal sejati + 950 noise). Terapkan tanpa koreksi, Bonferroni, dan BH. Bandingkan temuan benar vs palsu.</p>
      <PyodideLab
        title="🔬 Lab 1: Bonferroni vs BH — Hitung Sendiri"
        hint="Ubah jumlah sinyal sejati 50 → 10. Lihat Bonferroni makin buta sementara BH tetap menemukan sebagian. Itulah power untuk penemuan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Deteksi Batch Effect dari Matriks Jarak</h2>
      <p>Simulasikan ekspresi 100 gen × 12 sampel (2 kondisi × 2 batch). Hitung korelasi antar-sampel dan lihat pengelompokan: batch atau kondisi?</p>
      <PyodideLab
        title="🔬 Lab 2: Deteksi Batch Effect dari Matriks Jarak"
        hint="Ubah efek batch dari 2.0 → 0.5. Pada titik berapa kondisi mengalahkan batch? Itulah ambang desainmu harus di atasnya."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Klaim final / regulasi → Bonferroni (FWER)</h3>
        <p><strong>Kondisi:</strong> Satu false positive pun mahal.</p>
        <p><strong>Kenapa:</strong> Kontrol peluang ada-nya false positive.</p>
        <p><strong>Contoh nyata:</strong> Ambang GWAS 5e-8; klaim diagnostik.</p>
      </div>
      <div className="decision-card">
        <h3>2. Eksplorasi / penemuan → FDR (BH)</h3>
        <p><strong>Kondisi:</strong> Boleh ada sebagian palsu; butuh power.</p>
        <p><strong>Kenapa:</strong> Kontrol proporsi, bukan eksistensi.</p>
        <p><strong>Contoh nyata:</strong> RNA-seq screening; proteomik.</p>
      </div>
      <div className="decision-card">
        <h3>3. Dugaan batch → PCA + desain/koreksi</h3>
        <p><strong>Kondisi:</strong> Multi-batch; metadata tersedia.</p>
        <p><strong>Kenapa:</strong> Deteksi visual cepat; koreksi bila tidak confounded.</p>
        <p><strong>Contoh nyata:</strong> ComBat atau ~batch + kondisi.</p>
      </div>
      <div className="decision-card">
        <h3>4. Rancang eksperimen → Power + interleaved batch</h3>
        <p><strong>Kondisi:</strong> Sebelum keluar uang sekuensing.</p>
        <p><strong>Kenapa:</strong> n yang benar + desain anti-batch.</p>
        <p><strong>Contoh nyata:</strong> Hitung n untuk 20k uji, acak batch.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>20.000 uji → koreksi wajib (BH/FWER).</li>
          <li>PCA berlabel batch = gambar pertama.</li>
          <li>Batch confounded total = tidak terselamatkan.</li>
          <li>Jangan ukur jarak dari UMAP.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Signature 50 Gen” yang Ternyata Signature Mesin</h2>
      <div className="callout">
        <p>Paper mengklaim signature 50 gen untuk prognosis kanker (n=200). Perusahaan ingin lisensi. Kamu diminta due diligence.</p>
      <p>Temuan: 100 sampel baik disekuensing di mesin NovaSeq (2023), 100 buruk di HiSeq (2021). “Signature” = gen-gen yang ekspresinya beda antar mesin. Tanpa koreksi multiple testing yang benar (p&lt;0,05 mentah dari 20.000 gen).</p>
        <p><strong>Pertanyaan:</strong> Putusanmu untuk perusahaan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>TOLAK. Dua cacat fatal independen: (1) batch (mesin+tahun) confounded total dengan outcome — signature = artefak teknis; (2) tanpa koreksi multiple testing, 1.000 false positive ekspektasi — 50 gen bisa semuanya noise. Tidak ada analisis ulang yang bisa menyelamatkan desain ini; butuh kohort baru dengan desain interleaved + validasi independen. Pelajaran: due diligence bioinformatika = cek batch + cek multiple testing SEBELUM baca hasilnya. Dua cek ini membatalkan sebagian “penemuan” di literatur.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Manajemen Kesalahan yang Jujur</h2>
      <p>Statistik bioinformatika bukan tentang “tidak pernah salah” — itu mustahil pada 20.000 uji. Ia tentang <strong>memilih jenis kesalahan mana yang bisa ditoleransi, dan mengukurnya dengan jujur</strong>. Pendalaman ini tentang tiga alat dan kapan masing-masing berbohong.</p>

      <h3>1. Bonferroni vs FDR: dua filosofi kesalahan</h3>
      <Tex math={String.raw`p_{\text{Bonferroni}} = \min(1, \, m \times p) \quad;\quad \text{FDR: urutkan } p_{(1)} \le \cdots \le p_{(m)}, \text{ tolak } p_{(k)} \le \frac{k}{m} q`} block />
      <p><strong>Artinya tiap simbol:</strong> m = jumlah uji; p = p-value mentah; q = level FDR yang ditarget (mis. 0,05); p<sub>(k)</sub> = p-value terkecil ke-k setelah diurutkan (prosedur Benjamini-Hochberg).</p>
      <details className="worked">
        <summary>📐 Contoh: 20.000 gen, satu angka mengubah segalanya</summary>
        <p>Uji 20.000 gen, tanpa koreksi pada α = 0,05: false positive ekspektasi = 20.000 × 0,05 = <strong>1.000</strong> (cerita pembuka).<br />
        <strong>Bonferroni:</strong> ambang = 0,05/20.000 = 2,5×10<sup>−6</sup>. Jika 50 gen benar-benar terkait penyakit dengan efek sedang (p ~ 10<sup>−4</sup>), <strong>semua 50 mati</strong> — nol penemuan. Aman dari false positive, buta terhadap kebenaran.<br />
        <strong>FDR q = 0,05:</strong> mis. 80 gen lolos → ekspektasi false discovery = 80 × 0,05 = <strong>~4</strong>. Kita menerima 4 kesalahan demi 76 penemuan — dan <strong>kita tahu</strong> ada ~4 yang salah.<br />
        <strong>Interpretasi:</strong> Bonferroni = “saya tidak boleh salah sama sekali” (cocok untuk klaim tunggal mahal, mis. persetujuan obat). FDR = “saya boleh salah 5%, dan saya melaporkannya” (cocok untuk eksplorasi penemuan). Pilih filosofi sesuai <strong>biaya kesalahan</strong>, bukan kebiasaan.</p>
      </details>

      <h3>2. p-hacking: cara “menemukan” apa pun</h3>
      <p>Dengan 20.000 gen, strategi nakal selalu berhasil: coba 10 normalisasi × 5 uji × 3 cutoff = 150 analisis, laporkan yang “signifikan”. Peluang ≥1 false positive pada α=0,05 dari 150 analisis ≈ 1 − 0,95<sup>150</sup> ≈ <strong>99,95%</strong> — “penemuan” dijamin tanpa satu pun biologi nyata.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Pradaftarkan analisismu</strong></p>
        <p>Sebelum menyentuh data: tulis <strong>rencana analisis</strong> (uji apa, koreksi apa, cutoff apa) — simpan bertanggal (Git commit!). Analisis eksplorasi tambahan boleh, tapi <strong>beri label “eksplorasi”</strong> di laporan. Pembaca berhak tahu mana hipotesis yang diuji, mana yang ditemukan sambil jalan. Ini bukan birokrasi — ini pembeda sains dari <em>storytelling</em> dengan p-value.</p>
      </div>

      <h3>3. Batch effect &amp; confounding: statistik tidak menyelamatkan desain buruk</h3>
      <p>Jika semua sampel penyakit diproses di lab A dan kontrol di lab B, <strong>tidak ada</strong> metode statistik yang bisa memisahkan “efek penyakit” dari “efek lab” — keduanya terikat sempurna (<em>confounded</em>). Koreksi batch (ComBat, kovariat) hanya bekerja jika batch <strong>tercampur</strong> antar kondisi.</p>
      <details className="worked">
        <summary>📐 Contoh: PCA sebagai detektor kebohongan</summary>
        <p>Sebelum uji apa pun, plot PCA dari data ternormalisasi, warnai titik per batch dan per kondisi.<br />
        Skenario sehat: titik mengelompok per <strong>kondisi</strong> (kanker vs normal terpisah di PC1), batch tercampur di dalamnya.<br />
        Skenario sakit: titik mengelompok per <strong>batch</strong> (semua batch-1 di kiri, batch-2 di kanan) tanpa peduli kondisi → <strong>berhenti</strong>. Jangan lanjut ke DE; perbaiki desain atau akui data tidak bisa menjawab pertanyaan.<br />
        Aturan: <strong>PCA dulu, p-value kemudian.</strong> 5 menit PCA menghemat 5 minggu mengejar artefak.</p>
      </details>

      <h3>4. Power: “tidak signifikan” ≠ “tidak ada efek”</h3>
      <p>Dengan 3 vs 3 sampel, power mendeteksi fold-change 1,5x pada gen dispersi tinggi bisa &lt; 30% — artinya 70% efek nyata <strong>terlewat</strong>. “Tidak ada gen signifikan” pada studi kecil bukan bukti “tidak ada perbedaan biologi”; ia bukti “kita tidak cukup melihat”.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Baca “negatif” dengan curiga</strong></p>
        <p>Hasil negatif yang jujur selalu disertai <strong>power analysis</strong>: “dengan n ini, kami bisa mendeteksi efek sebesar X dengan power 80%”. Tanpa itu, “tidak signifikan” = “tidak tahu”, bukan “tidak ada”. Reviewer yang baik menanyakan ini; analis yang baik menyediakannya duluan.</p>
      </div>

      <h2 id="kasus2">🏥 Kasus Lapangan: GWAS Chip 500.000 SNP</h2>
      <p>Kamu menerima data GWAS: 5.000 kasus diabetes, 5.000 kontrol, 500.000 SNP. Sebelum satu pun uji asosiasi, ada <strong>ritual QC</strong> yang memisahkan analis profesional dari pemula. Ikuti:</p>

      <h3>QC berlapis (urutan penting!)</h3>
      <ul>
        <li><strong>Sampel:</strong> call rate &lt; 95% → buang (120 sampel). Heterozigositas ekstrem → kontaminasi (15 sampel). Duplikat/kerabat (IBD &gt; 0,2) → simpan satu (80 sampel). PCA: 45 outlier populasi → buang/stratifikasi.</li>
        <li><strong>SNP:</strong> call rate &lt; 95% (8.000 SNP), MAF &lt; 1% (60.000 SNP — chip tidak punya power untuk yang langka), deviasi HW p &lt; 10<sup>−6</sup> di kontrol (1.200 SNP — error genotyping).</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: aritmetika QC</summary>
        <p>Sampel: 10.000 → <strong>9.740</strong> (2,6% dibuang — normal).<br />
        SNP: 500.000 → <strong>~430.000</strong> (14% dibuang).<br />
        Uji asosiasi: 430.000 → ambang genome-wide 5×10<sup>−8</sup> (bukan 0,05/430.000 = 1,2×10<sup>−7</sup> — ambang 5×10<sup>−8</sup> adalah standar komunitas untuk ~1 juta SNP independen).<br />
        Hasil: 42 SNP &gt; ambang, mengelompok di <strong>8 lokus</strong> (SNP bertetangga dalam LD = satu sinyal, bukan 42 penemuan!).<br />
        <strong>Interpretasi:</strong> “42 SNP signifikan” → “8 lokus independen” — LD (<em>linkage disequilibrium</em>) membuat SNP tetangga berkorelasi. Melaporkan 42 sebagai 42 penemuan = menggandakan klaim. <strong>Clumping</strong> (ambil SNP top per blok LD) adalah langkah wajib.</p>
      </details>

      <h3>Diagnosis inflasi: λ dan QQ plot</h3>
      <p>λ = 1,08 → sedikit inflasi. QQ plot: titik mengikuti garis diagonal lalu <strong>melengkung naik di ujung</strong> = pola sehat (sedikit sinyal sejati di tengah poligenisitas). Jika <strong>seluruh garis</strong> terangkat sejak awal = stratifikasi → kembali ke PCA, tambah kovariat.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Poligenisitas vs stratifikasi</strong></p>
        <p>Keduanya menaikkan λ! Bedakan dengan <strong>LD score regression</strong>: intercept ≈ 1 → inflasi dari poligenisitas sejati (aman); intercept &gt; 1,1 → ada confounding (bahaya). Satu analisis, dua nasib paper. Jangan pernah hanya melaporkan λ tanpa intercept.</p>
      </div>

      <h3>Replikasi: ujian sebenarnya</h3>
      <p>8 lokus → cek di kohort independen (n = 20.000): 6 replikasi (p &lt; 0,05, arah efek sama), 2 tidak. Laporan akhir: <strong>6 lokus terkonfirmasi</strong>. Dua yang gagal bukan “dibuang diam-diam” — dilaporkan sebagai tidak terreplikasi (mungkin false positive, mungkin heterogenitas populasi — keduanya informatif).</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dari 20.000 uji tanpa koreksi pada alpha 0,05, ekspektasi false positive?"
        options={["0",
          "~1.000",
          "5",
          "20.000"]}
        correct={1}
        explanation="Benar: 20.000 × 0,05. Inilah mesin penemuan palsu tanpa koreksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kapan Bonferroni dipilih atas FDR?"
        options={["Selalu",
          "Klaim final di mana satu false positive pun mahal (GWAS, diagnostik)",
          "Eksplorasi",
          "Tidak pernah"]}
        correct={1}
        explanation="Benar: FWER vs FDR = bukti final vs penemuan. Pilih sesuai harga kesalahan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. PCA menunjukkan sampel mengelompok per tanggal sekuensing, bukan kondisi. Artinya?"
        options={["Normal",
          "Batch effect mendominasi — investigasi desain sebelum lanjut",
          "Kondisi tidak berpengaruh",
          "PCA salah"]}
        correct={1}
        explanation="Benar: gambar pertama setiap analisis. Batch > kondisi = lampu merah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Batch confounded total dengan kondisi (semua kasus batch A). Solusi?"
        options={["ComBat",
          "Tidak ada koreksi valid — ulangi dengan desain benar",
          "Tambah sampel",
          "Ganti metode"]}
        correct={1}
        explanation="Benar: statistik tidak bisa memisahkan yang tidak terpisahkan di desain. Pencegahan > koreksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Jarak antar klaster di plot UMAP…"
        options={["Bermakna kuantitatif",
          "Tidak bermakna — UMAP mengorbankan jarak global",
          "Sama dengan PCA",
          "Harus diukur"]}
        correct={1}
        explanation="Benar: UMAP untuk struktur lokal/klaster. Jangan ukur “kedekatan biologis” darinya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Power 80% artinya…"
        options={["80% hasil signifikan",
          "Peluang 80% mendeteksi efek yang benar-benar ada",
          "80% data benar",
          "Tidak ada arti"]}
        correct={1}
        explanation="Benar: 1−beta. Hitung SEBELUM eksperimen, dengan m terkoreksi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Multiple testing</strong>: tanpa koreksi = banjir false positive.</li>
          <li><strong>Bonferroni</strong> (FWER) untuk klaim final; <strong>FDR/BH</strong> untuk penemuan.</li>
          <li><strong>Batch effect</strong>: deteksi via PCA; cegah via desain interleaved.</li>
          <li>Batch confounded total = <strong>tidak terselamatkan</strong>.</li>
          <li><strong>PCA</strong> untuk QC/struktur global; <strong>UMAP</strong> untuk klaster (jarak antar-klaster tak bermakna).</li>
          <li><strong>Power</strong>: hitung sebelum eksperimen dengan m terkoreksi.</li>
          <li>Laporkan: metode koreksi + ambang + m.</li>
          <li>Dua cek due diligence: <strong>batch + multiple testing</strong> sebelum percaya hasil.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi9-rna-seq" className="btn btn-secondary btn-sm">← BI9</Link>
        <Link href="/learn/bi11-single-cell" className="btn btn-primary btn-sm">BI11 →</Link>
      </div>
    </div>
  );
}
