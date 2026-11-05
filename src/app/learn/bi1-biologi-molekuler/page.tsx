"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi1BiologiMolekulerPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi1DogmaData = [{"x": ["Genom (DNA)", "Transkriptom (RNA)", "Proteom (protein)"], "y": [1, 15, 100], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["1 set", "~15 rb gen aktif", ">100 rb proteoform"], "textposition": "outside"}];
  const bi1DogmaDataLayout = {"xaxis": {"title": "Lapisan"}, "yaxis": {"title": "Keberagaman (skala konseptual)", "type": "log"}, "showlegend": false};

  const lab1Code = "kodon = {'AUG':'Met','UUU':'Phe','UUC':'Phe','CCC':'Pro','UAA':'STOP',\n         'UAG':'STOP','UGA':'STOP','GGG':'Gly','AAA':'Lys','CGU':'Arg'}\ndna = 'ATGTTTCCCTAA'  # ubah sesukamu (kelipatan 3!)\nmrna = dna.replace('T', 'U')\nprotein = []\nfor i in range(0, len(mrna), 3):\n    k = mrna[i:i+3]\n    aa = kodon.get(k, '?')\n    protein.append(aa)\n    if aa == 'STOP': break\nprint(f'DNA     : {dna}')\nprint(f'mRNA    : {mrna}')\nprint(f'Protein : {\"-\".join(protein)}')\nprint()\nprint('Coba: dna = ATGTTTCCCTAA -> ganti T kedua jadi G (missense)')\nprint('Coba: sisipkan A setelah ATG (frameshift) -> protein hancur')";

  const lab2Code = "seq = 'ATGCGCGCGCATATATATGCGC'  # ubah sesukamu\nseq = seq.upper()\ngc = (seq.count('G') + seq.count('C')) / len(seq) * 100\nkomp = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'}\nkomplemen = ''.join(komp[b] for b in seq)\nrev_komp = komplemen[::-1]\nprint(f'sekuens      : {seq}')\nprint(f'panjang      : {len(seq)} basa')\nprint(f'GC content   : {gc:.1f}%')\nprint(f'komplemen    : {komplemen}')\nprint(f'reverse komp : {rev_komp}  <- untai ganda DNA')\nprint()\nprint('Aturan: G-C = 3 ikatan H (kuat), A-T = 2 (lemah).')\nprint('GC% tinggi -> DNA sulit dibuka -> PCR butuh suhu lebih tinggi.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI1 &mdash; Bioinformatics</span>
        <h1 className="display-title">DNA, RNA, Protein:<br />Central Dogma untuk Data Person</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 3 Miliar Huruf, 4 Huruf Saja</a></li>
          <li><a href="#dogma">Central Dogma — Si Alur Pabrik</a></li>
          <li><a href="#varian">Varian: SNP, Indel, Struktural</a></li>
          <li><a href="#genom">Genom Manusia dalam Angka</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Transkripsi &amp; Translasi (Live)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Hitung GC Content &amp; Komplemen</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Dari Huruf ke Keputusan</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Dari 3 Miliar Huruf ke Satu Diagnosis</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>central dogma</strong> (DNA → RNA → protein) dan apa yang diukur tiap teknologi omics.</li>
          <li>Membedakan <strong>SNP, indel, varian struktural</strong> dan dampaknya terhadap protein.</li>
          <li>Melakukan <strong>transkripsi + translasi</strong> manual pada sekuens pendek (kodon → asam amino).</li>
          <li>Menyebutkan <strong>angka kunci genom manusia</strong> (3 miliar basa, ~20 ribu gen) dan implikasinya untuk analisis.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 3 Miliar Huruf, 4 Huruf Saja</h2>
      <div className="story">
        <p>Bayangkan buku 3 miliar huruf — tapi alfabetnya cuma 4: A, T, G, C. Itulah genommu. Dari 3 miliar huruf itu, hanya ~1,5% yang menjadi “kalimat bermakna” (gen penyandi protein). Sisanya dulu disebut “sampah” — sampai kita sadar ia berisi saklar, pengatur volume, dan arsip evolusi.</p>
      <p>Bioinformatika adalah ilmu membaca buku raksasa ini dengan komputer. Lesson pertama memastikan kamu paham bahasanya dulu: apa itu gen, bagaimana ia dibaca sel, dan di mana “typo” (varian) bisa mengubah cerita. Tanpa fondasi ini, semua pipeline NGS hanyalah tombol yang ditekan buta.</p>
      <p>Twist-nya: angka “hanya 1,5%” itu justru jebakan paling terkenal di genomik. Proyek ENCODE menunjukkan ~80% genom punya aktivitas biokimia (enhancer, promoter, RNA non-coding) — “sampah” itu ternyata panel kontrolnya. Dan central dogma tidak sesederhana panahnya: satu gen bisa menghasilkan puluhan protein berbeda lewat <em>splicing</em> alternatif. Lesson ini bukan sekadar menghafal ATCG — ini fondasi memilih <strong>teknologi omics yang benar</strong> untuk pertanyaanmu: ukur RNA untuk varian bawaan, dan kamu menjawab pertanyaan yang salah dengan data yang benar.</p>
      </div>

      <h2 id="dogma">Central Dogma — Si Alur Pabrik</h2>
      <p><strong>Definisi.</strong> <strong>Central dogma</strong>: DNA (arsip) → ditranskripsi jadi RNA (fotokopi kerja) → ditranslasi jadi protein (mesin kerja). Tiap teknologi omics mengukur satu tahap: genomik = DNA, transkriptomik = RNA, proteomik = protein.</p>
      <details className="worked">
        <summary>📐 Contoh: translasi manual</summary>
        <p>DNA template (3'→5'): TAC AAA GGG ATT → mRNA (5'→3'): <strong>AUG UUU CCC UAA</strong>.<br />Kodon → asam amino: AUG = Met (start), UUU = Phe, CCC = Pro, UAA = <strong>stop</strong>.<br />Protein: <strong>Met-Phe-Pro</strong> (berhenti di UAA).<br />Inilah yang dilakukan ribosom jutaan kali per detik — dan yang disimulasikan di Lab 1.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> DNA itu arsip nasional yang tidak boleh keluar gedung; RNA itu fotokopi yang dibawa ke lapangan; protein itu pekerja yang membangun. Analis genomik membaca arsip; analis RNA-seq menghitung fotokopi yang beredar (lihat BI9) — jumlah fotokopi ≈ seberapa giat gen itu bekerja.</p>
      <p><strong>Kapan memakai:</strong> Pilih teknologi sesuai pertanyaan: varian bawaan → DNA; gen aktif saat ini → RNA; fungsi aktual → protein. Jangan ukur RNA untuk pertanyaan varian bawaan.</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">DNA (arsip)      : 5'-ATG TTT CCC TAA-3'
   | transkripsi
mRNA (fotokopi)  : 5'-AUG UUU CCC UAA-3'
   | translasi (kodon -&gt; asam amino)
Protein (pekerja): Met-Phe-Pro  [STOP]</pre>

      <PlotlyChart
        data={bi1DogmaData}
        title="Kompleksitas Bertingkat: DNA → RNA → Protein"
        layout={bi1DogmaDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiga lapisan central dogma. Sumbu Y logaritmik: tiap garis = 10x lipat. Baca kenaikannya.</p>
        <p><strong>Interpretasi:</strong> Satu genom menghasilkan ribuan transkrip aktif, yang menghasilkan ratusan ribu varian protein (splicing + modifikasi). Kompleksitas meledak di tiap tahap — inilah kenapa proteomik jauh lebih sulit dari genomik, dan kenapa tiap omics butuh statistiknya sendiri.</p>
      </div>

      <h2 id="varian">Varian: SNP, Indel, Struktural — Si Typo</h2>
      <p><strong>Definisi.</strong> <strong>SNP</strong>: 1 huruf berubah. <strong>Indel</strong>: sisipan/hapusan sedikit huruf. <strong>Varian struktural</strong>: hapusan/duplikasi/inversi besar (ribuan–jutaan basa). Dampaknya tergantung <em>di mana</em>: synonymous (diam), missense (ganti asam amino), nonsense/frameshift (merusak).</p>
      <Tex math={String.raw`\text{Jarak genetik} \approx \frac{\text{jumlah posisi berbeda}}{\text{panjang sekuens}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{jumlah posisi berbeda}`} />: posisi dengan huruf berbeda antar dua sekuens</li>
          <li><Tex math={String.raw`\text{panjang sekuens}`} />: total basa yang dibandingkan</li>
      </ul>
      <p><strong>Interpretasi:</strong> Dua manusia beda ~0,1% (1 per 1.000 basa) → ~3 juta perbedaan. Kecil persennya, besar jumlahnya — dan di situlah varian penyebab penyakit bersembunyi.</p>
      <details className="worked">
        <summary>📐 Contoh: tiga typo, tiga nasib</summary>
        <p>Sekuens normal: ATG TTT CCC TAA → Met-Phe-Pro-STOP.<br /><strong>Synonymous:</strong> TTT→TTC (tetap Phe) — protein sama, biasanya aman.<br /><strong>Missense:</strong> TTT→TGT (Phe→Cys) — satu asam amino beda; bisa fatal (mis. sickle cell: Glu→Val di hemoglobin).<br /><strong>Frameshift:</strong> sisipkan 1 basa setelah ATG → semua kodon bergeser — protein hancur total.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Varian itu typo di buku 3 miliar huruf: satu huruf salah ketik di bab resep (synonymous) = tidak masalah; satu huruf di bab instruksi mesin (missense) = mesin aneh; halaman robek (frameshift) = bab hancur total.</p>
      <p><strong>Kapan memakai:</strong> Klasifikasi varian adalah langkah pertama setiap analisis: saring yang merusak (nonsense/frameshift di gen penting) dari yang diam.</p>

      <h2 id="genom">Genom Manusia dalam Angka — Si Peta Skala</h2>
      <p><strong>Definisi.</strong> Angka kunci: <strong>3,2 miliar basa</strong>, <strong>~20.000 gen</strong> penyandi protein, <strong>~1,5%</strong> genom menyandi protein, <strong>~3 juta</strong> perbedaan antar dua individu.</p>
      <details className="worked">
        <summary>📐 Contoh: aritmetika ukuran file</summary>
        <p>1 basa = 1 byte (teks). Genom = 3,2 GB teks.<br />Tapi data sekuensing menyimpan <strong>kualitas per basa + bacaan ganda (coverage 30x)</strong> → ~100 GB per sampel WGS (FASTQ).<br />1.000 sampel = 100 TB. Inilah kenapa BI4 (command line, HPC, cloud) bukan opsional — laptop menyerah di sampel ke-2.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Genom itu perpustakaan raksasa dengan 20 ribu buku resep di antara 3 miliar huruf arsip. Analis yang tidak paham skalanya akan meminta komputer “baca semuanya” tanpa strategi — dan menunggu seminggu.</p>
      <p><strong>Kapan memakai:</strong> Desain analisis: WGS (semua) vs WES (hanya 1,5% coding, 50x lebih murah) vs panel gen — pilih sesuai pertanyaan dan budget (lihat BI8).</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;“Gen untuk X” berarti satu gen menentukan satu sifat&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Sifat kompleks (tinggi, diabetes, kecerdasan) dipengaruhi ratusan–ribuan varian kecil (poligenik, lihat BI12) + lingkungan. “Gen untuk X” adalah penyederhanaan media. Satu gen → satu penyakit hanya untuk penyakit Mendel langka.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;DNA sampah (non-coding) tidak penting&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 98,5% non-coding berisi saklar pengatur (enhancer, promoter), RNA non-coding fungsional, dan arsip evolusi. Varian GWAS terbanyak justru di daerah non-coding (lihat BI12) — mereka mengatur <em>kapan dan seberapa kuat</em> gen menyala.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Mutasi selalu buruk&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kebanyakan netral; sebagian merugikan; sedikit menguntungkan (resistensi malaria pada sickle-cell carrier). Evolusi = seleksi atas varian. Dalam analisis, jangan asumsikan varian = penyakit — buktikan dengan frekuensi populasi (gnomAD, BI2) dan prediksi dampak.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu tanya <strong>“lapisan omics apa?”</strong> sebelum analisis: DNA (varian bawaan), RNA (aktivitas saat ini), protein (fungsi). Salah lapisan = salah interpretasi.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Hafalkan <strong>3M–20K–1,5%</strong>: 3 miliar basa, 20 ribu gen, 1,5% coding. Tiga angka ini menjangkarkan semua estimasi ukuran dan biaya.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk varian: cek dulu <strong>frekuensi di populasi</strong> (gnomAD). Varian penyebab penyakit langka tidak mungkin umum di populasi sehat — filter termurah dan terkuat.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Transkripsi &amp; Translasi Otomatis</h2>
      <p>Tulis sekuens DNA, kode melakukan transkripsi (T→U) dan translasi (kodon → asam amino) dengan tabel kodon lengkap. Coba mutasi dan lihat efeknya.</p>
      <PyodideLab
        title="🔬 Lab 1: Transkripsi &amp; Translasi Otomatis"
        hint="Ubah satu basa pada kodon kedua (missense) vs sisipkan satu basa (frameshift). Bandingkan kerusakan proteinnya — frameshift jauh lebih destruktif."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: GC Content &amp; Komplemen</h2>
      <p>Hitung GC content (stabilitas) dan komplemen reverse dari sekuens. GC tinggi = ikatan lebih kuat (3 ikatan hidrogen) = titik leleh lebih tinggi.</p>
      <PyodideLab
        title="🔬 Lab 2: GC Content &amp; Komplemen"
        hint="Bandingkan sekuens AT-rich vs GC-rich. Dalam PCR, primer GC 40–60% ideal — terlalu tinggi menempel terlalu kuat, terlalu rendah lepas."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Cari varian bawaan → Sekuensing DNA (WGS/WES/panel)</h3>
        <p><strong>Kondisi:</strong> Pertanyaan tentang perbedaan genetik antar individu.</p>
        <p><strong>Kenapa:</strong> DNA stabil, tidak berubah antar jaringan/waktu.</p>
        <p><strong>Contoh nyata:</strong> Skrining pembawa thalassemia; diagnosis penyakit langka.</p>
      </div>
      <div className="decision-card">
        <h3>2. Cari gen yang aktif → RNA-seq</h3>
        <p><strong>Kondisi:</strong> Pertanyaan tentang aktivitas gen saat ini / respons.</p>
        <p><strong>Kenapa:</strong> RNA mencerminkan ekspresi real-time per kondisi.</p>
        <p><strong>Contoh nyata:</strong> Gen apa yang menyala pada kanker vs normal (BI9).</p>
      </div>
      <div className="decision-card">
        <h3>3. Cari fungsi aktual → Proteomik</h3>
        <p><strong>Kondisi:</strong> RNA tidak selalu = protein (regulasi pasca-transkripsi).</p>
        <p><strong>Kenapa:</strong> Protein adalah pelaku akhir; modifikasinya penting.</p>
        <p><strong>Contoh nyata:</strong> Fosforilasi protein sinyal kanker (BI15).</p>
      </div>
      <div className="decision-card">
        <h3>4. Budget terbatas, fokus coding → WES/panel, bukan WGS</h3>
        <p><strong>Kondisi:</strong> 85% varian penyakit Mendel ada di 1,5% coding.</p>
        <p><strong>Kenapa:</strong> 50x lebih murah dengan hasil klinis sebanding untuk kasus Mendel.</p>
        <p><strong>Contoh nyata:</strong> Diagnosis penyakit langka anak (lihat BI8).</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Tanya lapisan omics dulu: DNA/RNA/protein.</li>
          <li>3M basa, 20K gen, 1,5% coding — jangkar skala.</li>
          <li>Varian umum di populasi sehat ≠ penyebab penyakit langka.</li>
          <li>Non-coding ≠ tidak penting.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Bayi dengan Penyakit Misterius</h2>
      <div className="callout">
        <p>Bayi 8 bulan: kejang, keterlambatan perkembangan. Panel metabolik normal. Dokter meminta whole exome sequencing (WES). Ditemukan 20.000 varian.</p>
      <p>Tim memfilter: (1) frekuensi &lt;1% di gnomAD → tersisa 400; (2) prediksi merusak (nonsense/missense konservatif) → 12; (3) cocok pola gejala + resesif (butuh 2 kopi) → 1 kandidat: mutasi nonsense di gen SCN1A-like.</p>
        <p><strong>Pertanyaan:</strong> Jelaskan logika tiap filter dan mengapa WES (bukan WGS) dipilih.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) Frekuensi: penyakit langka → varian penyebab harus langka di populasi sehat (prinsip BI1). (2) Dampak: nonsense/frameshift diutamakan karena merusak protein (vs synonymous yang diam). (3) Kesesuaian klinis + pola pewarisan: menyatukan genetik dengan fenotipe. WES dipilih karena: 85% mutasi penyakit Mendel ada di coding region, biaya 1/50 WGS, dan waktu analisis jauh lebih cepat — kritis untuk bayi yang memburuk. Pelajaran: diagnosis genomik = penyaringan bertingkat logis, bukan “temukan mutasi ajaib”. Tiap filter punya alasan biologis.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Dari Huruf ke Keputusan Klinis</h2>
      <p>Central dogma yang kamu pelajari di atas adalah versi poster dinding. Versi lapangannya lebih berantakan — dan justru di sanalah analis yang baik dibayar. Tiga pendalaman ini mengubah “hafalan ATCG” menjadi intuisi kerja.</p>

      <h3>1. “Sampah” genom ternyata panel kontrol</h3>
      <p>Dulu 98,5% non-coding disebut <em>junk DNA</em>. Proyek ENCODE (2012) mengukur aktivitas biokimia di seluruh genom dan menemukan ~80% genom menunjukkan setidaknya satu tanda fungsi: ditempeli protein regulator, ditranskripsi jadi RNA non-coding, atau terbuka sebagai kromatin aktif. Angka 80% sempat kontroversial (definisi “fungsi” yang longgar), tapi pesannya bertahan: non-coding bukan sampah — ia adalah <strong>panel kontrol</strong> yang menentukan kapan, di mana, dan seberapa kuat tiap gen dibaca.</p>
      <p>Implikasi praktisnya besar: mayoritas temuan GWAS (studi asosiasi genom, BI12) jatuh di daerah <strong>non-coding</strong>. Varian “di tengah antah berantah” itu sering merusak <em>enhancer</em> — saklar jarak jauh yang mengatur gen target ratusan ribu basa jauhnya. Analis yang hanya melihat 1,5% coding akan melewatkan sebagian besar biologi penyakit kompleks.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Aturan praktis varian</strong></p>
        <p>Varian di daerah coding ≠ pasti penting; varian di non-coding ≠ pasti tidak penting. Yang menentukan adalah <strong>fungsi yang terganggu</strong>, bukan alamatnya. Selalu anotasi varian terhadap elemen regulasi (ENCODE, Roadmap Epigenomics), bukan cuma terhadap gen terdekat.</p>
      </div>

      <h3>2. Satu gen, puluhan protein: splicing alternatif</h3>
      <p>Gen manusia rata-rata punya ~8–9 ekson. Saat transkripsi, intron dibuang dan ekson disambung — tapi penyambungannya bisa bervariasi: ekson dilewati, dipendekkan, atau dipertahankan sebagian. Hasilnya: <strong>~95% gen multi-ekson manusia mengalami <em>alternative splicing</em></strong>, menghasilkan puluhan isoform protein dari satu gen.</p>
      <p>Contoh konkret: gen <em>DSCAM</em> pada lalat buah bisa menghasilkan 38.016 isoform berbeda dari satu gen lewat splicing alternatif — lebih banyak dari jumlah total gennya. Pada manusia, gen <em>TTN</em> (titin, protein otot) punya 363 ekson; kombinasi splicing-nya menentukan isoform otot jantung vs otot rangka.</p>
      <details className="worked">
        <summary>📐 Contoh: aritmetika kombinatorial splicing</summary>
        <p>Gen mainan dengan 5 ekson, tiap ekson bisa disertakan atau dilewati secara independen (ekson 1 dan 5 wajib sebagai ujung).<br />
        Kombinasi = 2<sup>3</sup> = <strong>8 isoform</strong> dari 1 gen.<br />
        Gen manusia tipikal (~9 ekson, 7 opsional): 2<sup>7</sup> = <strong>128 isoform potensial</strong> — sebelum modifikasi pasca-translasi.<br />
        Inilah kenapa “20.000 gen” berubah menjadi “&gt;100.000 proteoform”: kompleksitas meledak secara kombinatorial, dan RNA-seq (BI9) harus menghitung <em>isoform</em>, bukan cuma gen.</p>
      </details>

      <h3>3. Synonymous tidak selalu diam</h3>
      <p>Dogma lama: mutasi synonymous (tidak mengganti asam amino) = netral. Tiga mekanisme membatalkannya:</p>
      <ul>
        <li><strong>Codon usage bias:</strong> sel punya stok tRNA tak seimbang. Kodon “langka” diterjemahkan lambat → protein melipat berbeda → fungsi berubah. Mutasi synonymous pada gen <em>MDR1</em> mengubah pelipatan P-glikoprotein tanpa mengganti satu pun asam amino.</li>
        <li><strong>Gangguan splicing:</strong> sekuens ekson mengandung sinyal <em>splicing enhancer</em>. Satu huruf synonymous bisa menghapus sinyal itu → ekson terlewati → protein terpotong.</li>
        <li><strong>Stabilitas mRNA:</strong> struktur lipatan RNA berubah → mRNA lebih cepat didegradasi → jumlah protein turun.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: peluang acak SNP itu synonymous</summary>
        <p>Dari 64 kodon, 3 adalah stop; 61 menyandi asam amino. Sebuah SNP acak di posisi kodon ketiga sering synonymous (degenerasi kode genetik terpusat di basa ketiga), sedangkan SNP di basa pertama/kedua hampir selalu missense/nonsense.<br />
        Aturan kasar: ~25–30% SNP acak di daerah coding bersifat synonymous — tapi “synonymous” ≠ “aman”, seperti ditunjukkan tiga mekanisme di atas.<br />
        Pelajaran kerja: jangan pernah memfilter varian hanya berdasarkan “synonymous = buang”. Anotasi dulu (SnpEff/VEP), nilai dulu, baru putuskan.</p>
      </details>

      <h3>Kasus nyata: satu huruf, satu diagnosis</h3>
      <p>Anemia sel sabit: SNP tunggal A→T di gen <em>HBB</em> mengubah kodon GAG (Glu) menjadi GTG (Val) — satu asam amino dari 146. Hemoglobin mutan menggumpal saat oksigen rendah, sel darah melengkung seperti sabit. Satu huruf → penyakit turunan yang diderita jutaan orang. Inilah skala yang kamu hadapi: <strong>3 miliar huruf, dan satu saja bisa mengubah hidup seseorang</strong>. Ketelitian bukan sifat baik analis genomik — ia adalah syarat minimum.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Pilih omics sesuai pertanyaan</strong></p>
        <p>Sebelum menyentuh data, tulis pertanyaan dalam satu kalimat, lalu petakan ke lapisan dogma: “varian bawaan apa yang…” → DNA; “gen apa yang aktif saat…” → RNA; “protein apa yang berubah setelah obat…” → protein. 30 detik ini menghemat 3 bulan analisis yang salah sasaran.</p>
      </div>

      <h2 id="kasus2">🏥 Kasus Lapangan: Dari 3 Miliar Huruf ke Satu Diagnosis</h2>
      <p>Bayi 8 bulan, kejang berulang, keterlambatan perkembangan. Panel metabolik normal. Dokter memesan <strong>trio whole-exome sequencing</strong> (bayi + ayah + ibu). Tugasmu sebagai analis: dari ~3 miliar huruf menjadi <strong>satu varian</strong> yang menjelaskan semuanya. Ini adalah pekerjaan nyata analis genomik klinis — dan ia memakai semua yang kamu pelajari di lesson ini.</p>

      <h3>Langkah 1: Saring dari jutaan menjadi ratusan</h3>
      <p>Eksom bayi: ~60.000 varian vs referensi. Filter berlapis:</p>
      <ul>
        <li><strong>Frekuensi populasi</strong> (gnomAD): buang varian umum (MAF &gt; 1%) — penyakit langka &amp; berat tidak mungkin umum. Tersisa ~1.500.</li>
        <li><strong>Dampak prediksi</strong>: simpan missense/nonsense/frameshift/splice-site (BI1: yang merusak protein). Tersisa ~300.</li>
        <li><strong>Pewarisan</strong>: cari <em>de novo</em> (ada di bayi, tidak di kedua orang tua — mutasi baru) atau resesif (kedua orang tua pembawa). Tersisa <strong>~5 kandidat</strong>.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: aritmetika penyaringan</summary>
        <p>60.000 varian awal.<br />
        Setelah MAF &lt; 1%: 60.000 × 2,5% ≈ <strong>1.500</strong>.<br />
        Setelah filter dampak protein: 1.500 × 20% ≈ <strong>300</strong>.<br />
        Setelah model pewarisan (de novo + resesif): ≈ <strong>5</strong>.<br />
        <strong>Interpretasi:</strong> tiap filter membuang 80–97% kandidat — dan tiap filter adalah <strong>asumsi biologi</strong> (penyakit langka → varian langka; gejala berat → protein rusak). Salah asumsi (mis. penyakit ternyata dominan diwariskan) = varian penyebab terbuang di langkah 3. Filter = hipotesis; dokumentasikan!</p>
      </details>

      <h3>Langkah 2: Satu kandidat, tiga pertanyaan</h3>
      <p>Kandidat teratas: varian <strong>de novo missense</strong> di gen <em>KCNQ2</em> (kanal kalium otak), mengubah arginin → triptofan di domain pore. Tiga pertanyaan sebelum lapor:</p>
      <ul>
        <li><strong>Apakah gen ini cocok dengan gejala?</strong> OMIM: mutasi <em>KCNQ2</em> → epilepsi neonatal + keterlambatan perkembangan. <strong>Cocok.</strong></li>
        <li><strong>Apakah varian ini merusak?</strong> Arginin (bermuatan +) → triptofan (besar, hidrofobik) di pore kanal — prediksi SIFT/PolyPhen: merusak. <strong>Ya.</strong></li>
        <li><strong>Apakah ada bukti independen?</strong> ClinVar: 12 pasien dengan varian <em>di posisi yang sama</em>, fenotip sama. <strong>Ada.</strong></li>
      </ul>
      <p>Diagnosis: <em>KCNQ2-related epilepsy</em>. Terapi: hindari obat yang memperburuk (mis. carbamazepine pada beberapa kasus), pertimbangkan retigabine/pengatur kanal kalium. <strong>Satu huruf → diagnosis → terapi.</strong></p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: VUS — jawaban tersulit</strong></p>
        <p>Separuh kasus tidak sebersih ini: kandidatnya <strong>VUS</strong> (<em>variant of uncertain significance</em>) — tidak cukup bukti. Aturan profesional: <strong>laporkan sebagai VUS, jangan dipaksa jadi “patogenik”</strong>. Diagnosis yang salah lebih berbahaya daripada “belum tahu” — terapi yang salah bisa mencelakakan. Ketidakpastian yang jujur adalah hasil yang valid.</p>
      </div>

      <h3>Angka yang perlu diingat</h3>
      <p>Trio WGS klinis: biaya ~Rp15–30 juta per keluarga (2026), waktu analisis 2–6 minggu, <em>diagnostic yield</em> ~35–40% (lebih dari separuh tetap tanpa diagnosis — keterbatasan yang wajib disampaikan ke keluarga <strong>sebelum</strong> tes). Central dogma yang kamu pelajari bukan teori abstrak — ia adalah <strong>jalur produksi diagnosis</strong>, dan setiap analis di jalur itu memegang sebagian nasib pasien.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Urutan central dogma yang benar?"
        options={["Protein → RNA → DNA",
          "DNA → RNA → protein",
          "RNA → DNA → protein",
          "DNA → protein → RNA"]}
        correct={1}
        explanation="Benar: arsip (DNA) → fotokopi (RNA) → pekerja (protein). Tiap omics mengukur satu tahap."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. RNA-seq mengukur…"
        options={["Varian bawaan",
          "Tingkat aktivitas gen (jumlah transkrip) saat ini",
          "Struktur protein",
          "Jumlah kromosom"]}
        correct={1}
        explanation="Benar: menghitung fotokopi yang beredar ≈ seberapa giat gen bekerja. Untuk varian bawaan pakai DNA."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mutasi nonsense (kodon stop prematur) umumnya…"
        options={["Tidak berpengaruh",
          "Merusak protein (terpotong) — kandidat kuat penyebab penyakit",
          "Menguntungkan selalu",
          "Hanya di non-coding"]}
        correct={1}
        explanation="Benar: stop prematur = protein buntung = biasanya loss-of-function. Prioritas dalam filter varian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dua manusia berbeda sekitar…"
        options={["50% genomnya",
          "0,1% (~3 juta basa)",
          "10%",
          "Tidak ada beda"]}
        correct={1}
        explanation="Benar: 1 per 1.000 basa. Kecil persennya, tapi 3 juta perbedaan = tempat bersembunyi varian penyakit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk diagnosis penyakit langka anak dengan budget terbatas, pilihan terbaik?"
        options={["WGS selalu",
          "WES/panel gen — 85% mutasi Mendel di coding, 50x lebih murah",
          "RNA-seq saja",
          "Tidak perlu sekuensing"]}
        correct={1}
        explanation="Benar: ekonomi + kecepatan. WGS bila WES negatif atau diduga varian struktural/non-coding."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Varian dengan frekuensi 30% di gnomAD (populasi sehat) diklaim penyebab penyakit langka. Tanggapan?"
        options={["Masuk akal",
          "Mustahil — penyakit langka tidak mungkin disebabkan varian umum di populasi sehat",
          "Perlu WGS",
          "Tergantung"]}
        correct={1}
        explanation="Benar: filter frekuensi adalah logika pertama diagnosis genomik. Umum ≠ patogenik untuk penyakit langka."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Central dogma</strong>: DNA → RNA → protein; tiap omics mengukur satu tahap.</li>
          <li><strong>Varian</strong>: SNP, indel, struktural; dampak: synonymous &lt; missense &lt; nonsense/frameshift.</li>
          <li><strong>3M basa, 20K gen, 1,5% coding</strong>; antar manusia beda 0,1%.</li>
          <li>Non-coding penuh saklar pengatur — bukan sampah.</li>
          <li>Filter diagnosis: <strong>frekuensi populasi → dampak → kesesuaian klinis</strong>.</li>
          <li>Pilih teknologi sesuai pertanyaan + budget (WGS/WES/panel/RNA-seq).</li>
          <li>Sifat poligenik: satu gen → satu sifat hanya untuk penyakit Mendel.</li>
          <li>Fondasi untuk seluruh track: BI2 (database) memakai istilah ini terus.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd20-capstone-readmission" className="btn btn-secondary btn-sm">← HD20</Link>
        <Link href="/learn/bi2-database" className="btn btn-primary btn-sm">BI2 →</Link>
      </div>
    </div>
  );
}
