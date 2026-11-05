"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi14MetagenomikPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi14StackData = [{"x": ["Sehat", "Sehat", "Diabetes", "Diabetes"], "y": [45, 45, 25, 25], "type": "bar", "name": "Bacteroides", "marker": {"color": "#2a7de1"}}, {"x": ["Sehat", "Sehat", "Diabetes", "Diabetes"], "y": [30, 30, 20, 20], "type": "bar", "name": "Firmicutes lain", "marker": {"color": "#7fb3f0"}}, {"x": ["Sehat", "Sehat", "Diabetes", "Diabetes"], "y": [25, 25, 55, 55], "type": "bar", "name": "Proteobacteria", "marker": {"color": "#e8a838"}}];
  const bi14StackDataLayout = {"barmode": "stack", "xaxis": {"title": "Sampel"}, "yaxis": {"title": "Abundansi relatif (%)"}, "showlegend": true};

  const lab1Code = "import random, math, statistics as st\nrandom.seed(9)\n# abundansi ABSOLUT: A naik (efek), B & C independen (noise)\nA = [100 + i*10 + random.gauss(0,5) for i in range(20)]\nB = [50 + random.gauss(0,5) for _ in range(20)]\nC = [50 + random.gauss(0,5) for _ in range(20)]\ndef kor(x, y):\n    mx, my = st.mean(x), st.mean(y)\n    return sum((a-mx)*(b-my) for a,b in zip(x,y)) / \\\n        (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\nprint(f'korelasi ABSOLUT B-C: {kor(B,C):+.2f} (independen ~ 0)')\n# ubah jadi persen (komposisi)\ntot = [a+b+c for a,b,c in zip(A,B,C)]\npB = [b/t*100 for b,t in zip(B,tot)]\npC = [c/t*100 for c,t in zip(C,tot)]\nprint(f'korelasi PERSEN   B-C: {kor(pB,pC):+.2f} <- PALSU!')\n# CLR\ndef clr(vals):\n    g = math.exp(sum(math.log(v) for v in vals)/len(vals))\n    return [math.log(v/g) for v in vals]\ncB = [clr([a,b,c])[1] for a,b,c in zip(A,B,C)]\ncC = [clr([a,b,c])[2] for a,b,c in zip(A,B,C)]\nprint(f'korelasi CLR      B-C: {kor(cB,cC):+.2f} (kembali ~0)')\nprint()\nprint('Persen menciptakan korelasi dari ketiadaan. CLR memperbaikinya.')";

  const lab2Code = "import math\n# count 5 takson x 3 sampel\nsampel = {'sehat1': [30,25,20,15,10],\n          'sehat2': [28,26,21,14,11],\n          'sakit1': [80,5,5,5,5]}\ndef shannon(counts):\n    tot = sum(counts)\n    return -sum((c/tot)*math.log(c/tot) for c in counts if c > 0)\ndef bray(a, b):\n    return sum(abs(x-y) for x,y in zip(a,b))/sum(x+y for x,y in zip(a,b))\nprint('alfa (Shannon):')\nfor s, c in sampel.items():\n    print(f'  {s}: {shannon(c):.2f}')\nprint('beta (Bray-Curtis):')\nss = list(sampel)\nfor i in range(len(ss)):\n    for j in range(i+1, len(ss)):\n        print(f'  {ss[i]} vs {ss[j]}: {bray(sampel[ss[i]], sampel[ss[j]]):.2f}')\nprint()\nprint('sakit1: Shannon rendah (dominan 1 takson) & jauh dari sehat.')\nprint('Ini pola klasik: dysbiosis = diversitas turun + komposisi bergeser.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI14 &mdash; Bioinformatics</span>
        <h1 className="display-title">16S &amp; Komposisi:<br />Metagenomik: Siapa Tinggal di Sini</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 99% Tak Bisa Dibiakkan</a></li>
          <li><a href="#pendekatan">16S vs Shotgun: Dua Lensa</a></li>
          <li><a href="#komposisi">Data Komposisional — Si Jebakan</a></li>
          <li><a href="#diversitas">Diversitas &amp; Uji Asosiasi</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Jebakan Korelasi Komposisional</a></li>
          <li><a href="#lab2">🔬 Lab 2: Indeks Shannon &amp; PCoA Mini</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Statistik untuk Dunia Komposisional</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Memburu Patogen Keracunan Makanan</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>metagenomik</strong> dan dua pendekatan: <strong>16S vs shotgun</strong>.</li>
          <li>Menjelaskan sifat <strong>komposisional</strong> data mikrobiom dan jebakannya.</li>
          <li>Menghitung <strong>diversitas alfa/beta</strong> dan memilih uji yang tepat.</li>
          <li>Merancang analisis <strong>asosiasi mikrobiom-penyakit</strong> yang valid.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 99% Tak Bisa Dibiakkan</h2>
      <div className="story">
        <p>Selama seabad, mikrobiologi = biakkan di cawan. Masalah: <strong>99% mikroba tidak bisa dibiakkan</strong> — kita buta terhadap hampir semua penghuni tubuh. Lalu datang sekuensing langsung dari sampel: usus manusia ternyata dihuni 1.000+ spesies yang tak pernah terlihat di cawan.</p>
      <p>Metagenomik = sensus tanpa cawan: sekuensing DNA langsung dari lingkungan. Lesson ini mengajarkan dua lensanya (16S vs shotgun), jebakan statistiknya yang unik (komposisional!), dan cara menghubungkan mikrobiom dengan penyakit — bidang yang meledak dan penuh klaim berlebihan.</p>
      <p>Twist-nya: data mikrobiom adalah <strong>komposisional</strong> — dan ini menipu hampir semua orang. Karena sekuensing mengukur proporsi (bukan jumlah absolut), naiknya satu bakteri <em>otomatis</em> menurunkan persentase yang lain, bahkan jika jumlah aslinya tidak berubah. Ratusan paper “bakteri X berkurang pada penyakit Y” runtuh begitu dianalisis dengan benar: yang berubah hanya <strong>relatifnya</strong>. Ditambah confounding diet, antibiotik, dan geografi — headline “mikrobiom menyebabkan obesitas” biasanya adalah artefak statistik berbaju press release. Lesson ini mengajarkan skeptisisme yang tepat sasaran.</p>
      </div>

      <h2 id="pendekatan">16S vs Shotgun — Si KTP vs Si Wawancara</h2>
      <p><strong>Definisi.</strong> <strong>16S rRNA</strong>: sekuensing satu gen penanda bakteri — murah, taksonomi genus, tanpa fungsi. <strong>Shotgun</strong>: sekuensing SEMUA DNA — spesies/strain + fungsi (gen), mahal, butuh komputasi besar.</p>
      <details className="worked">
        <summary>📐 Contoh: memilih untuk studi usus-diabetes</summary>
        <p>500 sampel feses, budget terbatas.<br />Tahap 1: <strong>16S</strong> semua sampel → temukan genus berbeda.<br />Tahap 2: <strong>shotgun</strong> 100 sampel ekstrem → pathway butirat menurun + strain spesifik.<br />Hasil: taksonomi (siapa) + fungsi (ngapain) dengan budget terkendali.<br /><strong>Catatan:</strong> 16S buta terhadap virus/jamur (butuh ITS/shotgun); daerah V3-V4 vs V4 saja = hasil beda!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> 16S itu seperti sensus pakai KTP: tahu siapa (genus) tapi tidak tahu kerja apa. Shotgun itu seperti wawancara mendalam: tahu siapa sampai strain DAN pekerjaannya (gen apa yang dibawa).</p>
      <p><strong>Kapan memakai:</strong> Survei cepat/murah banyak sampel → 16S. Fungsi/strain/resistome → shotgun. Ingin keduanya: 16S untuk skrining, shotgun untuk subset.</p>

      <PlotlyChart
        data={bi14StackData}
        title="Komposisi Mikrobiom: Sehat vs Diabetes (ilustratif)"
        layout={bi14StackDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Stacked bar: tiap batang = 100%. Warna = takson. Bandingkan pola sehat vs diabetes.</p>
        <p><strong>Interpretasi:</strong> Diabetes: Proteobacteria meledak (kuning), Bacteroides menyusut. Tapi INGAT sifat komposisional: karena total 100%, naiknya satu OTOMATIS menurunkan yang lain — belum tentu Bacteroides benar-benar berkurang jumlahnya! (Lihat konsep komposisi.)</p>
      </div>

      <h2 id="komposisi">Data Komposisional — Si Jebakan Persen</h2>
      <p><strong>Definisi.</strong> Data mikrobiom adalah <strong>komposisi</strong> (jumlah = 100%): naiknya satu takson MEMAKSA turunnya yang lain secara matematis — menciptakan <strong>korelasi palsu</strong>. Solusi: <strong>CLR transform</strong> (centered log-ratio) atau metode komposisional (ALDEx2, ANCOM).</p>
      <Tex math={String.raw`clr(x_i) = \ln\left(\frac{x_i}{g(x)}\right), \quad g(x) = \text{rata-rata geometrik}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`x_i`} />: abundansi takson i</li>
          <li><Tex math={String.raw`g(x)`} />: rata-rata geometrik semua takson (pembagi referensi)</li>
      </ul>
      <p><strong>Interpretasi:</strong> CLR: bagi tiap takson dengan rata-rata geometrik lalu log. Ini memutus belenggu “total 100%” — nilai CLR bisa diuji dengan statistik standar. Sederhana tapi menyelamatkan dari banjir korelasi palsu.</p>
      <details className="worked">
        <summary>📐 Contoh klasik: korelasi palsu</summary>
        <p>Tiga takson, total dibatasi 100%. Takson A meledak karena antibiotik membunuh B dan C.<br /><strong>Persen mentah:</strong> B dan C “berkorelasi positif” (sama-sama turun) — PALSU, mereka tidak berinteraksi!<br /><strong>CLR:</strong> korelasi lenyap → benar: yang berubah hanya A.<br />Ratusan paper mikrobiom awal tercemar korelasi palsu ini. Jangan jadi paper ke-101.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Data komposisional itu seperti survei “persen waktu harian”: tidur naik 10% OTOMATIS berarti aktivitas lain turun 10% — bukan karena kamu malas berolahraga, tapi karena hari cuma 24 jam. Korelasi antar persen = ilusi jam.</p>
      <p><strong>Kapan memakai:</strong> Setiap analisis korelasi/DE mikrobiom: JANGAN korelasi Pearson pada persen mentah. Pakai CLR/ANCOM/ALDEx2.</p>

      <h2 id="diversitas">Diversitas &amp; Uji Asosiasi</h2>
      <p><strong>Definisi.</strong> <strong>Alfa</strong>: diversitas DALAM sampel (Shannon, Chao1) — “berapa macam &amp; merata?” <strong>Beta</strong>: perbedaan ANTAR sampel (Bray-Curtis, UniFrac) — divisualkan PCoA, diuji PERMANOVA. <strong>Asosiasi</strong>: takson beda antar kondisi via ANCOM/ALDEx2/DESeq2-Phyloseq.</p>
      <Tex math={String.raw`H = -\sum_i p_i \ln p_i`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`H`} />: indeks Shannon (alfa)</li>
          <li><Tex math={String.raw`p_i`} />: proporsi takson i</li>
      </ul>
      <p><strong>Interpretasi:</strong> Shannon: 0 = satu takson dominan total; makin banyak &amp; merata → makin tinggi. Usus sehat umumnya Shannon tinggi; antibiotik/diabetes menurunkannya. Tapi DIVERSITAS SAJA bukan diagnosis — konteks!</p>
      <details className="worked">
        <summary>📐 Contoh: alur asosiasi</summary>
        <p>50 diabetes vs 50 sehat (16S).<br />1. <strong>Alfa:</strong> Shannon diabetes lebih rendah (p=0,01).<br />2. <strong>Beta:</strong> PCoA memisahkan kelompok; PERMANOVA p=0,001 → komunitas beda.<br />3. <strong>Takson:</strong> ANCOM → genus X menurun (W&gt;threshold).<br />4. <strong>Kontrol confounder:</strong> diet, obat (metformin mengubah mikrobiom!), usia — masukkan ke model.<br />Tanpa langkah 4, “temuan” bisa = efek metformin, bukan diabetes.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Alfa itu seperti menilai restoran: berapa variasi menu &amp; seimbang? Beta itu seperti membandingkan dua restoran: seberapa beda menunya? PERMANOVA adalah juri yang memutuskan “beda ini nyata atau kebetulan”.</p>
      <p><strong>Kapan memakai:</strong> Alfa/beta = langkah 1 setiap studi. Asosiasi takson = langkah 2 dengan metode komposisional. Confounder = selalu.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Mikrobiom “menyebabkan” penyakit dari studi asosiasi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Asosiasi ≠ kausalitas (HD10!). Mikrobiom berubah karena penyakit, obat, diet — arah bisa terbalik. Kausalitas butuh: intervensi (FMT/probiotik RCT), longitudinal, atau model hewan. “Bakteri X menyebabkan diabetes” dari cross-sectional = overklaim.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Satu bakteri baik/buruk&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Konteks menentukan: strain sama bisa komensal di usus, patogen di darah. <em>E. coli</em> Nissle = probiotik; <em>E. coli</em> O157 = mematikan. Taksonomi kasar (genus) menyembunyikan perbedaan strain yang menentukan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Hasil 16S = kebenaran mutlak komunitas&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Bias PCR primer (melewatkan takson!), copy number 16S beda per bakteri, resolusi genus. 16S = lensa buram yang berguna — bukan foto. Shotgun pun punya bias (ekstraksi DNA, database).</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Jangan pernah <strong>korelasi Pearson/Spearman pada persen</strong>. CLR dulu atau pakai SparCC. Satu baris transform menghemat satu paper memalukan.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Catat <strong>metadata lengkap</strong>: diet, obat, usia, metode sampling. Confounder mikrobiom SANGAT banyak — tanpa metadata, data tidak terinterpretasi.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk klaim kausal: rancang <strong>longitudinal atau intervensi</strong> sejak awal. Cross-sectional hanya untuk hipotesis — tulis begitu di paper.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Korelasi Palsu Komposisional</h2>
      <p>Simulasikan 3 takson absolut (independen!), ubah jadi persen, lalu hitung korelasi. Saksikan korelasi palsu muncul dari ketiadaan.</p>
      <PyodideLab
        title="🔬 Lab 1: Korelasi Palsu Komposisional"
        hint="Ubah jadi CLR lalu korelasi ulang: korelasi palsu hilang. Inilah satu transformasi yang memisahkan analisis amatir vs profesional."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Shannon & Jarak Bray-Curtis</h2>
      <p>Hitung diversitas alfa (Shannon) dua sampel dan jarak beta (Bray-Curtis). Interpretasikan: mana lebih beragam, seberapa beda?</p>
      <PyodideLab
        title="🔬 Lab 2: Shannon & Jarak Bray-Curtis"
        hint="Coba sampel dengan 10 takson merata vs 2 takson dominan. Shannon menangkap keduanya (kekayaan + kemerataan) dalam satu angka."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Survei cepat banyak sampel → 16S</h3>
        <p><strong>Kondisi:</strong> Budget terbatas; butuh taksonomi genus.</p>
        <p><strong>Kenapa:</strong> Murah; cukup untuk pola besar.</p>
        <p><strong>Contoh nyata:</strong> Skrining 500 feses.</p>
      </div>
      <div className="decision-card">
        <h3>2. Fungsi/strain/resistome → Shotgun</h3>
        <p><strong>Kondisi:</strong> Butuh gen &amp; resolusi strain.</p>
        <p><strong>Kenapa:</strong> Semua DNA; fungsional.</p>
        <p><strong>Contoh nyata:</strong> Gen resistensi antibiotik.</p>
      </div>
      <div className="decision-card">
        <h3>3. Uji beda takson → ANCOM/ALDEx2 (komposisional)</h3>
        <p><strong>Kondisi:</strong> Data persen/count komposisi.</p>
        <p><strong>Kenapa:</strong> Bebas korelasi palsu.</p>
        <p><strong>Contoh nyata:</strong> Takson beda diabetes vs sehat.</p>
      </div>
      <div className="decision-card">
        <h3>4. Klaim kausal → Longitudinal/intervensi</h3>
        <p><strong>Kondisi:</strong> Butuh arah sebab-akibat.</p>
        <p><strong>Kenapa:</strong> Cross-sectional tak cukup.</p>
        <p><strong>Contoh nyata:</strong> RCT probiotik; FMT.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>99% mikroba tak terbaca tanpa metagenomik.</li>
          <li>16S = siapa; shotgun = siapa + ngapain.</li>
          <li>Jangan korelasi persen mentah — CLR!</li>
          <li>Confounder (obat/diet) selalu dicatat.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Probiotik Diabetes” dari Data Cross-sectional</h2>
      <div className="callout">
        <p>Studi 200 orang: genus X lebih rendah pada diabetes (p=0,001, uji-t pada persen). Startup langsung jual probiotik X “klinis terbukti”. Kamu diminta review.</p>
      <p>Temuan: (1) uji-t pada persen = melanggar asumsi komposisional; (2) 80% pasien diabetes minum metformin — yang DIKETAHUI mengubah mikrobiom; (3) tanpa validasi kohort independen.</p>
        <p><strong>Pertanyaan:</strong> Putusanmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tiga cacat: statistik salah (komposisi), confounder fatal (metformin), tanpa replikasi. Rerun dengan ANCOM + kontrol metformin: sinyal genus X LENYAP — yang tersisa hanya efek obat. Rekomendasi: tarik klaim “klinis terbukti”; butuh RCT probiotik X vs plasebo dengan outcome glikemik. Pelajaran: rantai kegagalan klasik mikrobiom — metode salah → confounder → overklaim komersial. Tiga cek (komposisional? confounder? replikasi?) membatalkan sebagian hype probiotik.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Statistik untuk Dunia Komposisional</h2>
      <p>Data mikrobiom bukan data biasa: ia <strong>komposisional</strong> (proporsi yang jumlahnya 100%), jarang (<em>sparse</em>), dan berdimensi ribuan. Metode statistik standar — yang mengasumsikan data bebas dan kontinu — <strong>gagal diam-diam</strong> di sini. Pendalaman ini tentang kegagalan itu dan cara yang benar.</p>

      <h3>1. Jebakan komposisional: matematika yang mengkhianati</h3>
      <details className="worked">
        <summary>📐 Contoh: “penurunan” yang tidak pernah terjadi</summary>
        <p>Usus pasien sebelum antibiotik (jumlah absolut, sel/mL): Bakteri A = 10<sup>9</sup>, B = 10<sup>9</sup> (total 2×10<sup>9</sup>) → relatif: A 50%, B 50%.<br />
        Setelah antibiotik: A = 10<sup>9</sup> (tidak berubah!), B = 10<sup>7</sup> (mati 99%) → total 1,01×10<sup>9</sup> → relatif: A <strong>99%</strong>, B 1%.<br />
        Analisis naif: “Bakteri A <strong>meningkat 2x lipat</strong> pada pasien!” — padahal jumlah absolut A <strong>tidak berubah sama sekali</strong>. Yang terjadi: B mati.<br />
        <strong>Interpretasi:</strong> setiap klaim “takson X naik/turun” dari data relatif harus ditanya: naik absolut, atau hanya karena yang lain turun? Tanpa kuantifikasi absolut (qPCR, spike-in), jawabannya <strong>tidak diketahui</strong> — dan sebagian besar headline mikrobiom tidak menanyakannya.</p>
      </details>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Solusi komposisional</strong></p>
        <p>Metode yang benar memakai <strong>log-ratio</strong>: bandingkan takson terhadap referensi (ALR) atau rata-rata geometrik semua takson (CLR — <em>centered log-ratio</em>). Korelasi Pearson pada data relatif menghasilkan korelasi negatif palsu; pada data CLR, korelasinya jujur. Aturan: <strong>jangan pernah korelasikan proporsi mentah</strong> — transformasi dulu, atau pakai tool komposisional (ALDEx2, ANCOM-BC).</p>
      </div>

      <h3>2. Diversitas: alfa, beta, dan apa yang mereka sembunyikan</h3>
      <ul>
        <li><strong>Alfa</strong> (dalam satu sampel): berapa jenis &amp; seberapa merata. Shannon index menggabungkan keduanya; “diversitas rendah” dikaitkan dengan berbagai penyakit — tapi juga dengan diet rendah serat, antibiotik, usia. Korelasi ≠ mekanisme.</li>
        <li><strong>Beta</strong> (antar sampel): seberapa beda komunitas. Bray-Curtis (komposisi) vs UniFrac (komposisi + <strong>jarak filogenetik</strong> — dua sampel dengan spesies beda tapi berkerabat dianggap lebih mirip).</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: membaca PCoA mikrobiom</summary>
        <p>PCoA Bray-Curtis 200 sampel usus: sumbu 1 (25% variansi) memisahkan <strong>negara</strong> (Indonesia vs AS), bukan penyakit yang diteliti! Penyakit hanya terlihat di sumbu 3 (8%).<br />
        <strong>Interpretasi:</strong> geografi/diet mendominasi sinyal mikrobiom — efek penyakit kecil di tengahnya. Tanpa mengontrol geografi (PERMANOVA dengan kovariat), “mikrobiom penyakit” yang ditemukan mungkin sebenarnya “mikrobiom kota”. Selalu plot &amp; uji confounder dulu (mirip PCA di BI10).</p>
      </details>

      <h3>3. 16S vs shotgun: dua lensa, dua harga</h3>
      <ul>
        <li><strong>16S rRNA</strong> (amplikon): murah (~Rp500rb/sampel), hanya bakteri/arkea, resolusi genus (spesies sering tidak!), bias primer (sebagian takson tidak teramplifikasi = tidak terlihat).</li>
        <li><strong>Shotgun</strong>: mahal (~Rp5jt/sampel), semua organisme + <strong>fungsi</strong> (gen apa yang dibawa komunitas — mis. gen resistensi antibiotik!), resolusi strain, tapi 90%+ read bisa jadi DNA manusia (inang) yang harus dibuang.</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Pilih lensa sesuai pertanyaan</strong></p>
        <p>“Siapa saja yang ada?” (survei luas, n besar) → 16S. “Mereka bisa apa? strain mana yang membawa gen resisten?” → shotgun. “Apakah mikrobiom <strong>menyebabkan</strong> penyakit?” → <strong>keduanya tidak cukup</strong>; butuh intervensi (FMT, probiotik RCT) atau Mendelian randomization. Sekuensing mengamati; ia tidak membuktikan sebab-akibat.</p>
      </div>

      <h3>Kasus nyata: dari hype ke terapi nyata</h3>
      <p>Di tengah lautan klaim berlebihan, ada kemenangan nyata: <strong>FMT</strong> (<em>fecal microbiota transplant</em>) untuk infeksi <em>Clostridioides difficile</em> berulang — efikasi ~90%, kini menjadi terapi standar (bahkan versi pil kapsul, FDA 2023). Bedanya dengan hype: <strong>uji klinis RCT</strong>, mekanisme jelas (restorasi kompetisi komunitas menekan patogen), dan efek besar yang konsisten. Standar bukti ini — bukan jumlah paper observasional — yang memisahkan terapi dari tren. Saat membaca klaim mikrobiom berikutnya, tanya: “di mana RCT-nya?”</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Memburu Patogen Keracunan Makanan</h2>
      <p>80 orang keracunan setelah festival kuliner. Kultur konvensional: negatif (patogen tidak tumbuh di media standar — ingat 99%!). Kamu menerima sampel feses 10 pasien untuk <strong>shotgun metagenomik</strong>. Misi: temukan penyebabnya dalam 48 jam.</p>

      <h3>Langkah 1: singkirkan 95% noise manusia</h3>
      <p>Dari 50 juta read per sampel, <strong>~47 juta = DNA manusia</strong> (sel usus terkelupas)! Mapping ke genom manusia → buang. Tersisa 3 juta read mikroba. (Pelajarannya: untuk sampel klinis, sekuensing lebih dalam dari perkiraan — atau pakai <em>host depletion</em> saat ekstraksi.)</p>

      <h3>Langkah 2: siapa yang berlimpah abnormal?</h3>
      <details className="worked">
        <summary>📐 Contoh: dari relatif ke tersangka</summary>
        <p>Komposisi genus (relatif): <em>Salmonella</em> 35%, <em>Escherichia</em> 20%, sisanya normal.<br />
        <strong>AWAS jebakan komposisional</strong> (BI14!): 35% relatif belum tentu berarti banyak absolut. Cek: qPCR 16S total load = 10<sup>11</sup>/g (normal ~10<sup>11</sup>) → <em>Salmonella</em> absolut ≈ 3,5×10<sup>10</sup>/g — <strong>sangat tinggi</strong> (patogen biasanya &lt; 10<sup>6</sup> pada orang sehat).<br />
        Assembly: genom <em>Salmonella</em> hampir lengkap dari metagenom (MAG!) → MLST: <em>S. enterica</em> serovar Enteritidis.<br />
        <strong>Gen resistensi</strong> terdeteksi: <em>blaTEM</em> (ampisilin-R), <em>tetA</em> (tetrasiklin-R) → panduan antibiotik jika pasien memburuk.<br />
        <strong>Interpretasi:</strong> bukan sekadar “siapa” (taksonomi) tapi “bisa apa” (resistensi, virulensi) — keunggulan shotgun atas 16S yang menentukan tindakan klinis.</p>
      </details>

      <h3>Langkah 3: lacak sumbernya</h3>
      <p>Strain dari 10 pasien: <strong>0–2 SNP berbeda</strong> (klonal — satu sumber!). Bandingkan ke database pangan nasional: cocok dengan strain dari <strong>telur peternakan X</strong> (3 SNP beda). Dinkes menarik produk telur X. Outbreak berhenti.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Resolusi strain menyelamatkan</strong></p>
        <p>“<em>Salmonella</em>” saja tidak cukup — <em>Salmonella</em> ada di mana-mana. Yang melacak sumber adalah <strong>strain</strong> (0–2 SNP = sama; &gt; 20 SNP = beda sumber). Metagenomik + filogenetik strain (BI7!) = forensik pangan modern. Tanpa resolusi ini, peternakan X tidak pernah teridentifikasi.</p>
      </div>

      <h3>Waktu &amp; dampak</h3>
      <p>Total: 48 jam dari sampel ke penarikan produk (kultur butuh 5–7 hari, dan gagal total di sini). <strong>Metagenomik bukan sekadar riset — ia adalah alat respons outbreak</strong> yang memutus rantai penularan. Inilah argumen ROI-nya ke pembuat kebijakan.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kapan shotgun dipilih atas 16S?"
        options={["Selalu",
          "Butuh fungsi gen / resolusi strain / non-bakteri",
          "Tidak pernah",
          "Hanya untuk virus"]}
        correct={1}
        explanation="Benar: KTP vs wawancara. Fungsi & strain butuh semua DNA."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bahaya korelasi pada data persen mikrobiom?"
        options={["Tidak ada",
          "Korelasi palsu: total 100% memaksa ketergantungan matematis",
          "Terlalu lambat",
          "Hanya untuk 16S"]}
        correct={1}
        explanation="Benar: hari cuma 24 jam. CLR/SparCC/ANCOM solusinya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Rumus CLR membagi dengan…"
        options={["Total",
          "Rata-rata geometrik semua takson",
          "Maksimum",
          "100"]}
        correct={1}
        explanation="Benar: geometric mean sebagai referensi internal — memutus belenggu komposisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Diversitas alfa (Shannon) mengukur…"
        options={["Perbedaan antar sampel",
          "Kekayaan & kemerataan DALAM satu sampel",
          "Jumlah read",
          "p-value"]}
        correct={1}
        explanation="Benar: dalam vs antar = alfa vs beta. Jangan tertukar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. PERMANOVA menguji…"
        options={["Satu gen",
          "Perbedaan KOMUNITAS antar kelompok dari matriks jarak beta",
          "Normalitas",
          "Korelasi"]}
        correct={1}
        explanation="Benar: juri “beda komunitas ini nyata?” dari Bray-Curtis/UniFrac."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Confounder klasik studi mikrobiom-diabetes?"
        options={["Warna mata",
          "Metformin & diet — mengubah mikrobiom langsung",
          "Golongan darah",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: obat adalah confounder #1. Tanpa kontrol obat, temuan = efek farmasi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Metagenomik = sensus tanpa cawan; <strong>99%</strong> tak terbaca konvensional.</li>
          <li><strong>16S</strong>: murah, taksonomi; <strong>shotgun</strong>: fungsi + strain, mahal.</li>
          <li>Data <strong>komposisional</strong>: jangan korelasi persen — pakai <strong>CLR/ANCOM</strong>.</li>
          <li><strong>Alfa</strong> (Shannon): dalam sampel; <strong>beta</strong> (Bray-Curtis): antar sampel + PERMANOVA.</li>
          <li>Asosiasi ≠ kausalitas; kontrol <strong>obat/diet</strong>.</li>
          <li>Strain menentukan (probiotik vs patogen).</li>
          <li>Bias: primer 16S, copy number, database.</li>
          <li>Klaim kausal butuh <strong>longitudinal/intervensi</strong>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi13-epigenomik" className="btn btn-secondary btn-sm">← BI13</Link>
        <Link href="/learn/bi15-proteomik" className="btn btn-primary btn-sm">BI15 →</Link>
      </div>
    </div>
  );
}
