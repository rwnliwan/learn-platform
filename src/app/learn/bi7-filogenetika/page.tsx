"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi7FilogenetikaPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi7TreeData = [{"x": [0, 0.5, 0.5, 1.0, 0, 0.5, 1.0], "y": [0, 0, 1, 1, 2, 2, 2], "type": "scatter", "mode": "lines", "line": {"color": "#2a7de1", "width": 2}, "showlegend": false}, {"x": [1.0, 1.0, 1.0], "y": [0, 1, 2], "type": "scatter", "mode": "markers+text", "marker": {"color": "#e8a838", "size": 10}, "text": ["A", "B", "C"], "textposition": "right", "showlegend": false}];
  const bi7TreeDataLayout = {"xaxis": {"title": "Jarak evolusi"}, "yaxis": {"title": "", "showticklabels": false}, "showlegend": false};

  const lab1Code = "# UPGMA sederhana untuk 4 taksa\njarak = {('A','B'):0.2, ('A','C'):0.6, ('A','D'):0.7,\n         ('B','C'):0.6, ('B','D'):0.7, ('C','D'):0.3}\ndef d(x, y):\n    return jarak.get((x,y), jarak.get((y,x), 0))\nklaster = ['A','B','C','D']\npohon = {k:k for k in klaster}\nwhile len(klaster) > 1:\n    # cari pasangan terdekat\n    pas = min(((d(a,b),a,b) for i,a in enumerate(klaster)\n               for b in klaster[i+1:]))\n    _, a, b = pas\n    baru = f'({pohon[a]},{pohon[b]})'\n    print(f'gabung {a}+{b} (jarak {pas[0]}) -> {baru}')\n    # jarak rata-rata ke klaster lain\n    for k in klaster:\n        if k not in (a,b):\n            jarak[(baru,k)] = (d(a,k)+d(b,k))/2\n    klaster = [k for k in klaster if k not in (a,b)] + [baru]\n    pohon[baru] = baru\nprint(f'\\nPohon Newick: {baru};')";

  const lab2Code = "import math, itertools\ndef profil_kmer(s, k):\n    prof = {}\n    for i in range(len(s)-k+1):\n        w = s[i:i+k]\n        prof[w] = prof.get(w, 0)+1\n    return prof\ndef jarak_kmer(a, b, k):\n    pa, pb = profil_kmer(a,k), profil_kmer(b,k)\n    semua = set(pa)|set(pb)\n    return math.sqrt(sum((pa.get(w,0)-pb.get(w,0))**2 for w in semua))\nA = 'ATGCGATCGATCGATCGATCG'\nB = 'ATGCGATCGATCGATCGATCG'  # identik\nC = 'ATGCGATCGTTCGATCGATCG'  # 1 mutasi\nD = 'AAAAAAAAAAAAAAAAAAAAA'  # beda total\nfor k in [2, 3, 5]:\n    print(f'k={k}: d(A,B)={jarak_kmer(A,B,k):.1f} '\n          f'd(A,C)={jarak_kmer(A,C,k):.1f} d(A,D)={jarak_kmer(A,D,k):.1f}')\nprint()\nprint('Tanpa alignment, tanpa DP O(n^2). Untuk jutaan sekuens,')\nprint('ini satu-satunya yang praktis (Kraken, Mash).')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI7 &mdash; Bioinformatics</span>
        <h1 className="display-title">Filogenetika &amp; k-mer:<br />Pohon Kehidupan dari Data</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Virus Punya Silsilah</a></li>
          <li><a href="#pohon">Pohon Filogenetik — Si Silsilah</a></li>
          <li><a href="#metode">Metode: Jarak, Parsimoni, Likelihood</a></li>
          <li><a href="#kmer">k-mer &amp; HMM Pengantar</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: UPGMA dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Jarak k-mer Tanpa Alignment</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Membaca Pohon Seperti Detektif</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Melacak Sumber Outbreak</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membaca <strong>pohon filogenetik</strong>: klad, node, panjang cabang, outgroup, bootstrap.</li>
          <li>Membedakan metode <strong>jarak (NJ/UPGMA), parsimoni, maximum likelihood</strong>.</li>
          <li>Menghitung <strong>jarak k-mer</strong> sebagai alternatif alignment-free.</li>
          <li>Menjelaskan konsep <strong>HMM</strong> untuk pemodelan sekuens (profil HMM).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Virus Punya Silsilah</h2>
      <div className="story">
        <p>Di ruang sidang, jaksa menunjukkan pohon filogenetik: virus HIV terdakwa <strong>bersarang di dalam klad</strong> virus korban — bukti transmisi yang dipakai di pengadilan nyata. Di sisi lain dunia, pohon SARS-CoV-2 yang diupdate harian melacak varian baru menyebar antar benua.</p>
      <p>Pohon filogenetik adalah silsilah yang direkonstruksi dari mutasi: makin mirip sekuens, makin dekat kekerabatan. Lesson ini mengajarkan cara membaca dan membangun silsilah molekuler — plus dua senjata modern: k-mer (tanpa alignment!) dan HMM.</p>
      <p>Twist-nya: pohon di ruang sidang itu kuat bukan karena gambarnya meyakinkan — gambar pohon bisa dibuat untuk data apa pun. Kekuatannya ada pada angka yang menyertainya: <strong>bootstrap support</strong> dan model evolusi yang tepat. Pohon tanpa ukuran ketidakpastian = opini berbaju sains. Dan ada ironi manis di lesson ini: metode “kasar” k-mer yang tidak melakukan alignment sama sekali justru mengalahkan alignment klasik saat datanya jutaan sekuens — presisi yang dikorbankan sedikit, kecepatan yang didapat ribuan kali lipat.</p>
      </div>

      <h2 id="pohon">Pohon Filogenetik — Si Silsilah</h2>
      <p><strong>Definisi.</strong> <strong>Pohon filogenetik</strong>: graf yang merepresentasikan hubungan evolusi — daun = sekuens saat ini, node dalam = leluhur, panjang cabang = jarak evolusi (substitusi per situs). <strong>Klad</strong> = kelompok monofiletik (leluhur + semua keturunannya).</p>
      <details className="worked">
        <summary>📐 Contoh: membaca pohon 4 virus</summary>
        <p>((A,B),(C,D)): A dan B bersaudara (klad), C dan D bersaudara; dua klad bertemu di akar.<br /><strong>Panjang cabang</strong> A=0,01 = 1 substitusi per 100 situs sejak leluhur AB.<br /><strong>Outgroup</strong> (virus jauh) menentukan arah waktu (akar).<br /><strong>Bootstrap 95</strong> pada node AB = 95% pohon resampling mendukung klad ini → percaya diri.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Pohon filogeni itu seperti silsilah keluarga yang dibuat dari kemiripan wajah (sekuens): sepupu mirip, sepupu jauh beda. Tapi ingat: ini <em>rekonstruksi hipotesis</em>, bukan foto keluarga — metode beda bisa memberi pohon beda.</p>
      <p><strong>Kapan memakai:</strong> Lacak asal wabah, identifikasi spesies, studi evolusi gen, forensik transmisi.</p>

      <PlotlyChart
        data={bi7TreeData}
        title="Pohon Filogenetik Sederhana (kladogram)"
        layout={bi7TreeDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Garis horizontal = panjang cabang (jarak evolusi); vertikal hanya pemisah. Titik kuning = daun (sekuens).</p>
        <p><strong>Interpretasi:</strong> A dan B berbagi cabang (klad) — lebih dekat satu sama lain daripada ke C. Panjang cabang A→leluhur pendek = sedikit mutasi. Inilah cara membaca semua pohon: cari klad (siapa bersaudara), lalu panjang cabang (seberapa jauh).</p>
      </div>

      <h2 id="metode">Metode: Jarak, Parsimoni, Likelihood — Tiga Filosofi</h2>
      <p><strong>Definisi.</strong> <strong>UPGMA/NJ</strong>: dari matriks jarak → gabungkan yang terdekat (cepat). <strong>Parsimoni</strong>: pohon dengan mutasi paling sedikit (Occam). <strong>Maximum likelihood</strong>: pohon yang memaksimalkan peluang data di bawah model evolusi (paling prinsipil, paling lambat).</p>
      <Tex math={String.raw`d_{JC} = -\frac{3}{4}\ln\left(1 - \frac{4p}{3}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`d_{JC}`} />: jarak Jukes-Cantor (koreksi substitusi ganda)</li>
          <li><Tex math={String.raw`p`} />: proporsi situs berbeda yang teramati</li>
      </ul>
      <p><strong>Interpretasi:</strong> Jarak mentah meremehkan evolusi jauh: situs bisa bermutasi 2x (A→T→G) tapi terlihat 1 beda. Koreksi JC memperbaiki — makin besar p, koreksi makin penting.</p>
      <details className="worked">
        <summary>📐 Contoh: kapan UPGMA gagal</summary>
        <p>UPGMA mengasumsikan <strong>jam molekuler</strong> (laju mutasi sama di semua cabang).<br />Virus A bermutasi 10x lebih cepat dari B → UPGMA menempatkan A salah (long-branch attraction).<br /><strong>NJ</strong> tidak mengasumsikan jam → lebih robust. <strong>ML</strong> dengan model laju-bervariasi → terbaik untuk kasus sulit.<br />Aturan: eksplorasi cepat → NJ; publikasi → ML + bootstrap.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> UPGMA itu seperti menebak silsilah dari foto: cepat tapi buta perbedaan usia. Parsimoni itu detektif hemat: “penjelasan tersederhana biasanya benar”. ML itu ilmuwan teliti: menghitung peluang tiap skenario di bawah model — lambat tapi paling bisa dipertahankan.</p>
      <p><strong>Kapan memakai:</strong> Eksplorasi/ribuan sekuens → NJ. Klaim evolusi serius → ML + model selection + bootstrap ≥70.</p>

      <h2 id="kmer">k-mer &amp; HMM — Si Tanpa-Alignment dan Si Penjaga Pola</h2>
      <p><strong>Definisi.</strong> <strong>k-mer</strong>: potongan sekuens panjang k; profil k-mer = vektor hitungan. Jarak antar profil ≈ jarak evolusi — <strong>tanpa alignment</strong>. <strong>HMM (Hidden Markov Model)</strong>: model probabilistik dengan state tersembunyi — untuk profil protein (Pfam), gene finding, alignment.</p>
      <Tex math={String.raw`D_{kmer}(A,B) = \sqrt{\sum_{w}(f_A(w) - f_B(w))^2}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`f_A(w)`} />: frekuensi k-mer w di sekuens A</li>
      </ul>
      <p><strong>Interpretasi:</strong> Jarak Euclidean profil k-mer: 0 = komposisi identik. Makin besar k, makin spesifik tapi makin sensitif terhadap error. k=21–31 umum untuk genom bakteri.</p>
      <details className="worked">
        <summary>📐 Contoh: k-mer untuk identifikasi cepat</summary>
        <p>Sampel misterius: hitung semua 4-mer (256 kemungkinan). Bandingkan profilnya dengan database via jarak Euclidean.<br />Kecocokan terbaik: <em>E. coli</em> (jarak 0,02) vs <em>Salmonella</em> (0,15) → identifikasi dalam detik, tanpa alignment.<br /><strong>HMM Pfam:</strong> profil HMM domain “ABC transporter” discan ke proteom baru → temukan 30 anggota, termasuk yang identitasnya cuma 25% (BLAST gagal, HMM berhasil — karena HMM memakai pola posisi-spesifik).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> k-mer itu seperti membandingkan dua buku dari frekuensi kata-katanya, tanpa membaca berurutan — kasar tapi super cepat untuk jutaan sekuens. HMM itu seperti penjaga pola: ia tahu “domain kinase biasanya terlihat seperti ini (dengan variasi)” dan mengenali versi barunya.</p>
      <p><strong>Kapan memakai:</strong> k-mer: clustering metagenomik (BI14), estimasi cepat kemiripan, assembly. HMM: cari domain protein (Pfam), prediksi gen, anotasi.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pohon filogenetik = kebenaran evolusi yang pasti&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Pohon adalah <em>estimasi</em> di bawah model dan data tertentu. Bootstrap &lt;70 atau metode beda → pohon beda = jangan overklaim. Laporkan selalu: metode, model, bootstrap. Pohon tanpa ukuran ketidakpastian = opini bergambar.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin mirip sekuens pasti makin dekat kekerabatan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Konvergensi (sifat sama evolusi independen), transfer gen horizontal (bakteri!), dan laju mutasi beda bisa menipu. Satu gen ≠ sejarah spesies — untuk spesies, pakai banyak gen (phylogenomics).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;k-mer terlalu kasar untuk dipakai serius&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> k-mer adalah fondasi Kraken (klasifikasi metagenomik), Mash (jarak genom), dan assembler modern. Kasar ≠ tidak berguna — untuk skala jutaan sekuens, kasar-dan-cepat mengalahkan presisi-dan-mustahil.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu sertakan <strong>outgroup</strong> untuk mengakar pohon. Pohon tak berakar = silsilah tanpa arah waktu — setengah informasi hilang.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Jangan percaya klad dengan <strong>bootstrap &lt;70</strong>. Runtuhkan (collapse) menjadi politomi — kejujuran lebih baik dari resolusi palsu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk data besar: <strong>k-mer/ML cepat dulu untuk eksplorasi</strong>, ML penuh untuk klad yang penting. Alokasikan komputasi ke pertanyaan, bukan ke semua cabang.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: UPGMA dari Nol</h2>
      <p>Implementasi UPGMA: dari matriks jarak, gabungkan pasangan terdekat berulang. Lihat pohon Newick terbentuk.</p>
      <PyodideLab
        title="🔬 Lab 1: UPGMA dari Nol"
        hint="Ubah jarak D-c agar laju tidak seragam (jam rusak). Lihat UPGMA salah menempatkan — itulah long-branch attraction."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Jarak k-mer Tanpa Alignment</h2>
      <p>Hitung profil 3-mer dua sekuens dan jarak Euclidean. Bandingkan dengan jarak edit sederhana — lihat korelasinya.</p>
      <PyodideLab
        title="🔬 Lab 2: Jarak k-mer Tanpa Alignment"
        hint="Coba k=2 vs k=5 pada sekuens mirip-tapi-bermutasi. k kecil = robust, k besar = spesifik. Pilih k sesuai pertanyaan."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Eksplorasi cepat / ribuan sekuens → NJ atau k-mer</h3>
        <p><strong>Kondisi:</strong> Butuh gambaran cepat kekerabatan.</p>
        <p><strong>Kenapa:</strong> Cepat; cukup untuk hipotesis awal.</p>
        <p><strong>Contoh nyata:</strong> Clustering 10.000 genom bakteri.</p>
      </div>
      <div className="decision-card">
        <h3>2. Klaim evolusi publikasi → Maximum likelihood + bootstrap</h3>
        <p><strong>Kondisi:</strong> Pohonnya adalah hasil utama.</p>
        <p><strong>Kenapa:</strong> Prinsipil; ketidakpastian terkuantifikasi.</p>
        <p><strong>Contoh nyata:</strong> Asal-usul varian virus baru.</p>
      </div>
      <div className="decision-card">
        <h3>3. Cari domain protein jauh → Profil HMM (Pfam)</h3>
        <p><strong>Kondisi:</strong> Identitas &lt;30% tapi fungsi diduga sama.</p>
        <p><strong>Kenapa:</strong> HMM menangkap pola posisi-spesifik; BLAST gagal di twilight zone.</p>
        <p><strong>Contoh nyata:</strong> Anotasi domain protein novel.</p>
      </div>
      <div className="decision-card">
        <h3>4. Data metagenomik besar → k-mer classifier (Kraken)</h3>
        <p><strong>Kondisi:</strong> Jutaan read, butuh klasifikasi cepat.</p>
        <p><strong>Kenapa:</strong> Alignment per read mustahil; k-mer praktis.</p>
        <p><strong>Contoh nyata:</strong> Profil taksonomi sampel usus (BI14).</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Baca klad + panjang cabang + bootstrap.</li>
          <li>Outgroup untuk akar; bootstrap &lt;70 = runtuhkan.</li>
          <li>NJ untuk cepat, ML untuk klaim.</li>
          <li>k-mer untuk skala; HMM untuk pola jauh.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Wabah di RS: Transmisi atau Kebetulan?</h2>
      <div className="callout">
        <p>5 pasien ICU terinfeksi bakteri sama dalam 2 minggu. Manajemen curiga transmisi nosokomial. Sekuensing: 5 genom bakteri.</p>
      <p>Pohon: 4 genom membentuk klad rapat (beda 2–5 SNP), 1 genom jauh (beda 200 SNP, klad lain). Bootstrap klad-4 = 99.</p>
        <p><strong>Pertanyaan:</strong> Interpretasi dan tindakan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>4 kasus = transmisi terkait (klaster klonal; ambang tipikal &lt;10 SNP untuk bakteri ini) — investigasi PPI: tangan petugas, alat, ruangan. 1 kasus = infeksi komunitas kebetulan, bukan bagian wabah. Tindakan: fokus pada 4 (isolasi kohort, audit kebersihan), bukan lockdown seluruh ICU. Tanpa pohon, kelimanya akan diperlakukan sama — buang sumber daya + panik. Pelajaran: filogenetika mengubah “5 kasus” menjadi “1 wabah + 1 sporadis” — presisi yang menghemat intervensi.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Membaca Pohon Seperti Detektif</h2>
      <p>Pohon filogenetik terlihat seperti gambar — padahal ia adalah <strong>hipotesis statistik</strong> dengan asumsi, ketidakpastian, dan cara gagal yang spesifik. Pendalaman ini melatihmu membaca pohon seperti detektif membaca TKP: apa yang diklaim, seberapa yakin, dan apa yang bisa salah.</p>

      <h3>1. Panjang cabang ≠ waktu (kecuali asumsi dipenuhi)</h3>
      <p>Kesalahan paling umum: “cabang panjang = berevolusi lama”. Panjang cabang = <strong>jumlah substitusi per situs</strong> = laju × waktu. Virus RNA bermutasi ~1.000x lebih cepat dari mamalia — cabang virus yang “panjang” bisa mewakili hitungan bulan, sementara cabang mamalia yang “pendek” mewakili jutaan tahun.</p>
      <details className="worked">
        <summary>📐 Contoh: jam molekuler SARS-CoV-2</summary>
        <p>Laju mutasi SARS-CoV-2 ≈ 1×10<sup>−3</sup> substitusi/situs/tahun; genom 30.000 basa.<br />
        Mutasi per genom per tahun = 30.000 × 10<sup>−3</sup> = <strong>~30 mutasi/tahun ≈ 2–3 per bulan</strong>.<br />
        Dua sampel berbeda 6 mutasi → perkiraan divergensi ≈ 6 / 2,5 ≈ <strong>2,4 bulan</strong> lalu (asumsi jam molekuler konstan).<br />
        Inilah cara Nextstrain memperkirakan kapan varian muncul — bukan dari tanggal sampel saja, tapi dari <strong>aritmetika mutasi</strong>. Tapi ingat: seleksi alam (mis. tekanan imun pada spike) mempercepat cabang tertentu → jam tidak selalu konstan → UPGMA (yang mengasumsikan jam konstan) bisa salah topologi.</p>
      </details>

      <h3>2. Bootstrap: angka kepercayaan yang wajib dibaca</h3>
      <p>Pohon tanpa nilai dukungan cabang = klaim tanpa bukti. <strong>Bootstrap</strong>: acak-ulang kolom alignment 1.000x, bangun ulang pohon tiap kali, hitung seberapa sering tiap cabang muncul. Cabang dengan bootstrap 98 = “98% resampling setuju cabang ini ada”; bootstrap 45 = “jangan percaya cabang ini”.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Aturan praktis bootstrap</strong></p>
        <p>&gt;90: percaya. 70–90: tentatif (butuh data/marker tambahan). &lt;70: anggap politomi (tidak terselesaikan) — jangan membuat klaim biologis dari cabang ini. Di ruang sidang cerita pembuka, jaksa yang jujur menunjukkan cabang <strong>dengan bootstrap tinggi</strong>; tanpa itu, “bukti” pohon = gambar.</p>
      </div>

      <h3>3. Long-branch attraction: jebakan klasik</h3>
      <p>Dua garis evolusi yang berevolusi <strong>cepat tapi tidak berkerabat</strong> bisa tampak berkerabat karena kebetulan mengalami mutasi yang sama di posisi yang sama (homoplasi). Metode sederhana (parsimoni, UPGMA) tertipu dan mengelompokkan keduanya — <em>long-branch attraction</em>. Solusinya: model evolusi eksplisit (maximum likelihood dengan model GTR+Gamma) yang memperhitungkan laju berbeda antar situs.</p>
      <details className="worked">
        <summary>📐 Contoh: kapan curiga LBA</summary>
        <p>Pohon menempatkan dua virus “aneh” (cabang sangat panjang) sebagai saudara, bootstrap 52.<br />
        Checklist curiga: (1) keduanya cabang terpanjang di pohon, (2) bootstrap rendah, (3) metode = parsimoni/UPGMA.<br />
        Tindakan: ulangi dengan maximum likelihood + model GTR+Gamma + 1.000 bootstrap. Jika “persaudaraan” hilang → itu artefak LBA, bukan biologi.<br />
        Pelajaran: <strong>metode filogenetika bukan netral</strong> — tiap metode membawa asumsi, dan asumsi yang salah menghasilkan “fakta” yang salah.</p>
      </details>

      <h3>4. k-mer: ketika “kasar” mengalahkan “teliti”</h3>
      <p>Untuk 10 juta read metagenomik, alignment klasik butuh berminggu-minggu. Pendekatan k-mer (pecah sekuens jadi potongan panjang-k, hitung komposisi) mengklasifikasi dalam hitungan jam dengan akurasi ~95% di level genus. Kraken memakai <em>exact k-mer match</em> ke database — tanpa alignment sama sekali.</p>
      <p>Trade-off yang jujur: k-mer butuh database referensi lengkap (organisme baru tanpa referensi = tidak terdeteksi) dan resolusi strain terbatas. Tapi untuk pertanyaan “apa isi sampel ini, cepat?”, ia adalah jawaban industri standar. <strong>Ketelitian yang tidak selesai tepat waktu = tidak berguna.</strong></p>

      <h3>Kasus nyata: pohon yang melacak pandemi</h3>
      <p>Nextstrain membangun pohon SARS-CoV-2 dari jutaan genom, diupdate harian. Dari pohon itu: varian Alpha terdeteksi menyebar dari satu klad di Inggris (cabang panjang + banyak mutasi spike = sinyal seleksi), Omicron dikenali sebagai garis yang <strong>sangat divergen</strong> (bukan turunan Delta — implikasi besar untuk imunitas). Setiap keputusan karantina/vaksin 2020–2022 sebagian dibaca dari pohon-pohon ini. Filogenetika bukan hobi akademik — ia adalah <strong>radar evolusi</strong> kesehatan masyarakat.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Melacak Sumber Outbreak</h2>
      <p>12 kasus infeksi virus baru di 3 kota dalam 2 minggu. Dinkes bertanya: <strong>satu sumber atau tiga outbreak terpisah?</strong> Kamu menerima 12 genom virus lengkap. Pohon filogenetik + jam molekuler akan menjawabnya — begini caranya:</p>

      <h3>Langkah 1: bangun pohon (dengan model yang benar)</h3>
      <p>Alignment 12 genom (30.000 basa) → maximum likelihood, model GTR+Gamma, 1.000 bootstrap. Hasil: 12 sampel membentuk <strong>satu klad monofiletik</strong> (satu nenek moyang bersama), bootstrap 99 — <strong>satu sumber</strong>, bukan tiga.</p>

      <h3>Langkah 2: baca jam molekuler</h3>
      <details className="worked">
        <summary>📐 Contoh: kapan transmisi dimulai</summary>
        <p>Laju virus ≈ 2 mutasi/genom/bulan. Jarak maksimum antar 12 sampel: <strong>4 mutasi</strong>.<br />
        tMRCA (nenek moyang bersama terakhir) ≈ 4 / 2 = <strong>~2 bulan lalu</strong>.<br />
        Kasus pertama terdeteksi 2 minggu lalu → virus <strong>bersirkulasi diam-diam ~6 minggu</strong> sebelum terdeteksi!<br />
        <strong>Interpretasi:</strong> respons “12 kasus” sebenarnya respons terhadap outbreak 6 minggu. Dinkes memperluas pelacakan kontak ke belakang — dan menemukan klaster tak terdeteksi di pasar kota A. <strong>Pohon tidak hanya menjawab “satu atau tiga” — ia mengoreksi timeline seluruh respons.</strong></p>
      </details>

      <h3>Langkah 3: peta geografi di atas pohon</h3>
      <p>Warnai ujung pohon per kota: sampel kota B dan C <strong>bersarang di dalam</strong> keragaman kota A (parafiletik terhadap A). Artinya: virus berasal dari A, menyebar ke B dan C — <strong>bukan</strong> sebaliknya. Intervensi difokuskan ke A (sumber), bukan dibagi rata.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Batas inferensi arah</strong></p>
        <p>Pohon menunjukkan <strong>kekerabatan</strong>, bukan arah transmisi antar individu (“A menulari B”) — untuk itu butuh data epidemiologi (kontak, waktu). Klaim “pasien X menulari Y dari pohon saja” adalah <strong>overclaim klasik</strong> yang pernah dipakai salah di pengadilan. Pohon = siapa berkerabat dengan siapa; arah = butuh bukti tambahan.</p>
      </div>

      <h3>Yang dilaporkan ke Dinkes</h3>
      <p>“Satu outbreak, sumber probable kota A, sirkulasi ~6 minggu sebelum deteksi, rekomendasi: lacak mundur kontak 6 minggu + surveilans pasar A.” Keputusan operasional — dari 12 string huruf. <strong>Filogenetika sebagai radar kesehatan masyarakat</strong>, persis seperti janji lesson ini.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bootstrap 95 pada suatu node artinya…"
        options={["95% mutasi benar",
          "95% pohon resampling mendukung klad itu — keyakinan tinggi",
          "95 basa",
          "Pohon 95% benar"]}
        correct={1}
        explanation="Benar: ukuran dukungan, bukan kebenaran mutlak. <70 = jangan percaya kladnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. UPGMA gagal ketika…"
        options={["Data sedikit",
          "Laju mutasi tidak seragam antar cabang (jam molekuler rusak)",
          "Sekuens pendek",
          "Selalu gagal"]}
        correct={1}
        explanation="Benar: asumsi jam molekuler. Long-branch attraction menempatkan cabang cepat secara salah. Pakai NJ/ML."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Fungsi outgroup dalam pohon?"
        options={["Hiasan",
          "Mengakar pohon — menentukan arah waktu evolusi",
          "Mempercepat",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: tanpa akar, tidak tahu mana leluhur mana keturunan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Keunggulan k-mer atas alignment?"
        options={["Lebih akurat selalu",
          "Skala: jutaan sekuens tanpa DP O(n²) — kasar tapi praktis",
          "Tidak ada",
          "Hanya untuk protein"]}
        correct={1}
        explanation="Benar: trade-off presisi vs skala. Fondasi Kraken/Mash/assembler."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Profil HMM (Pfam) mengalahkan BLAST ketika…"
        options={["Sekuens identik",
          "Homologi jauh (<30% identitas) — pola posisi-spesifik masih terdeteksi",
          "Tidak pernah",
          "Database kecil"]}
        correct={1}
        explanation="Benar: HMM memakai konservasi per posisi, bukan identitas global. Twilight zone = habitat HMM."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Transfer gen horizontal pada bakteri menyebabkan…"
        options={["Tidak ada masalah",
          "Pohon satu gen bisa beda dari sejarah spesies — butuh banyak gen",
          "Pohon selalu benar",
          "Mutasi berhenti"]}
        correct={1}
        explanation="Benar: gen melompat antar spesies. Phylogenomics (banyak gen) untuk klaim spesies."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Pohon = <strong>hipotesis evolusi</strong>: baca klad, cabang, bootstrap, outgroup.</li>
          <li><strong>NJ</strong> cepat; <strong>ML</strong> prinsipil untuk klaim; parsimoni = hemat.</li>
          <li>Koreksi jarak (<strong>Jukes-Cantor</strong>) untuk substitusi ganda.</li>
          <li><strong>k-mer</strong>: kemiripan tanpa alignment — skala metagenomik.</li>
          <li><strong>HMM</strong>: pola posisi-spesifik untuk homologi jauh.</li>
          <li>Bootstrap &lt;70 = runtuhkan; satu gen ≠ sejarah spesies.</li>
          <li>Aplikasi: lacak wabah, forensik transmisi, anotasi domain.</li>
          <li>Fondasi untuk BI14 (metagenomik) dan BI12 (struktur populasi).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi6-alignment" className="btn btn-secondary btn-sm">← BI6</Link>
        <Link href="/learn/bi8-ngs-pipeline" className="btn btn-primary btn-sm">BI8 →</Link>
      </div>
    </div>
  );
}
