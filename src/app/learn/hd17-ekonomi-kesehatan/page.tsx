"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd17EkonomiKesehatanPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd17QalyData = [{"x": ["Vaksinasi anak", "Pengobatan TB", "Obat hipertensi", "Obat kanker baru"], "y": [0.05, 0.1, 0.3, 7.5], "type": "bar", "marker": {"color": ["#2a7de1", "#2a7de1", "#2a7de1", "#e8a838"]}, "text": ["0,05", "0,1", "0,3", "7,5"], "textposition": "outside"}];
  const hd17QalyDataLayout = {"xaxis": {"title": "Intervensi"}, "yaxis": {"title": "Rp miliar per QALY"}, "showlegend": false};

  const lab1Code = "# profil: [(utilitas, tahun)]\nstandar = [(0.7, 5)]\nbaru = [(0.75, 5.5)]\nbiaya_standar, biaya_baru = 50_000_000, 200_000_000\nTHR = 500_000_000  # threshold Rp per QALY\nqaly = lambda prof: sum(u*t for u, t in prof)\nE0, E1 = qaly(standar), qaly(baru)\nICER = (biaya_baru-biaya_standar)/(E1-E0)\nprint(f'QALY standar = {E0:.2f}, QALY baru = {E1:.2f} (selisih {E1-E0:.2f})')\nprint(f'ICER = Rp{ICER:,.0f} per QALY')\nprint(f'Threshold = Rp{THR:,.0f} -> {\"COST-EFFECTIVE ✓\" if ICER < THR else \"TIDAK cost-effective ✗\"}')\n# harga maksimal agar tetap cost-effective\nmaks = biaya_standar + THR*(E1-E0)\nprint(f'Harga maks obat baru agar layak: Rp{maks:,.0f}')";

  const lab2Code = "import random\nrandom.seed(30)\ndef simulasi(tiba_per_jam, layani_per_jam, jam=24*30):\n    t, antre, tunggu, dilayani = 0.0, 0, [], 0\n    sibuk_sampai = 0.0\n    while t < jam:\n        t += random.expovariate(tiba_per_jam)\n        if t >= jam: break\n        mulai = max(t, sibuk_sampai)\n        tunggu.append(mulai - t)\n        sibuk_sampai = mulai + random.expovariate(layani_per_jam)\n        dilayani += 1\n    return sum(tunggu)/len(tunggu)*60\nlayani = 10  # kapasitas: 10 pasien/jam\nfor tiba in [7, 9, 9.5]:\n    rho = tiba/layani\n    w = simulasi(tiba, layani)\n    print(f'utilisasi {rho:.0%}: rata-rata tunggu {w:.0f} menit')\nprint()\nprint('70% -> 90%: tunggu naik ~4x. 90% -> 95%: naik ~2x lagi.')\nprint('Antrean eksponensial di dekat 100%. Target BOR 100% = target macet.')";

  const hd17QueueData = [{"x": [50, 60, 70, 80, 90, 95], "y": [12, 18, 28, 48, 108, 228], "type": "scatter", "mode": "lines+markers", "name": "Waktu tunggu (m)", "line": {"color": "#e8a838"}}];
  const hd17QueueDataLayout = {"xaxis": {"title": "Utilisasi (%)"}, "yaxis": {"title": "Tunggu rata-rata (menit)"}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD17 &mdash; Health Data Scientist</span>
        <h1 className="display-title">QALY &amp; ICER:<br />Harga Sebuah Tahun Hidup Sehat</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp1,5 Miliar untuk Satu Pasien?</a></li>
          <li><a href="#qaly">QALY — Si Mata Uang Kesehatan</a></li>
          <li><a href="#icer">ICER &amp; Cost-Effectiveness</a></li>
          <li><a href="#operasi">Operasi RS: LOS, Readmission &amp; Antrean</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung QALY &amp; ICER</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Antrean IGD</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Cost-Effectiveness Plane</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Biaya, Diskon, dan ICER</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Defisit BPJS</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Membaca ICER seperti Komite Formularium</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung <strong>QALY</strong> dari profil utilitas dan durasi.</li>
          <li>Menghitung <strong>ICER</strong> dan menafsirkannya terhadap <strong>threshold</strong> (WTP).</li>
          <li>Membaca <strong>cost-effectiveness plane</strong> dan mengidentifikasi strategi dominan/didominasi.</li>
          <li>Menganalisis <strong>LOS, readmission, dan antrean</strong> sebagai masalah operasi RS.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp1,5 Miliar untuk Satu Pasien?</h2>
      <div className="story">
        <p>Obat baru kanker: Rp1,5 miliar per pasien per tahun, memperpanjang hidup rata-rata <strong>4 bulan</strong> dengan kualitas hidup sedang. BPJS ditanya: tanggung atau tidak? Dana terbatas — Rp1,5 miliar yang sama bisa memvaksin 30.000 anak atau mengobati 500 pasien TB sampai sembuh.</p>
      <p>Tidak ada jawaban yang tidak menyakitkan. Tapi ada cara <em>transparan</em> untuk memutuskan: <strong>ekonomi kesehatan</strong>. Ia tidak menjawab “nyawa berapa harganya” — ia menjawab “dengan dana terbatas, mana yang menyelamatkan kesehatan TERBANYAK”. Lesson ini tentang matematika keputusan tersulit di kesehatan.</p>
      <p><strong>Twist-nya:</strong> tidak ada pilihan yang “benar” di cerita ini — dan <em>itulah</em> poinnya. Ekonomi kesehatan tidak menghapus rasa sakit keputusan; ia <strong>memindahkan keputusan dari lobi tertutup ke meja transparan</strong>: siapa mendapat apa, dengan mengorbankan siapa, dan berapa biayanya per tahun hidup berkualitas. Tanpa kerangka ini, keputusan yang sama tetap dibuat — hanya saja diam-diam, oleh siapa yang paling berkuasa. <strong>Matematika ini bukan tentang menghargai nyawa; ia tentang menolak keputusan yang tidak bisa dipertanggungjawabkan.</strong></p>
      </div>

      <h2 id="qaly">QALY — Si Mata Uang Kesehatan</h2>
      <p><strong>Definisi.</strong> <strong>QALY (Quality-Adjusted Life Year)</strong>: 1 tahun hidup sempurna = 1 QALY; 1 tahun dengan kualitas 0,6 = 0,6 QALY; meninggal = 0. Menggabungkan <em>panjang</em> dan <em>kualitas</em> hidup dalam satu angka.</p>
      <Tex math={String.raw`QALY = \sum_{t} u_t \times \Delta t`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`u_t`} />: utilitas (kualitas hidup 0–1) pada periode t</li>
          <li><Tex math={String.raw`\Delta t`} />: durasi periode t (tahun)</li>
      </ul>
      <p><strong>Interpretasi:</strong> QALY memungkinkan apel-vs-jeruk: vaksin (panjang hidup) vs obat nyeri (kualitas hidup) bisa dibandingkan dalam mata uang sama. Utilitas diukur via kuesioner standar (EQ-5D).</p>
      <details className="worked">
        <summary>📐 Contoh: QALY obat kanker cerita pembuka</summary>
        <p>Obat menambah 4 bulan (1/3 tahun) hidup dengan utilitas 0,6.<br />QALY gained = 0,6 × (1/3) = <strong>0,2 QALY</strong>.<br />Biaya Rp1,5 M untuk 0,2 QALY → Rp7,5 M per QALY.<br />Bandingkan: vaksinasi anak ~Rp50 juta per QALY. Dana yang sama menyelamatkan 150x lipat QALY bila untuk vaksin. Inilah opportunity cost yang dibuat eksplisit.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> QALY itu seperti rupiah untuk kesehatan: ia memaksa semua intervensi — dari vaksin sampai obat kanker — dinilai dengan mata uang yang sama. Kejam? Ya. Tapi alternatifnya (keputusan tanpa angka) lebih kejam: yang bersuara paling keras yang menang, bukan yang paling membutuhkan.</p>
      <p><strong>Kapan memakai:</strong> Perbandingan lintas program/penyakit untuk alokasi anggaran: formularium, paket manfaat JKN, prioritas Dinkes.</p>

      <PlotlyChart
        data={hd17QalyData}
        title="Biaya per QALY (Rp miliar) — Ilustratif"
        layout={hd17QalyDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = biaya untuk membeli 1 QALY via tiap intervensi. Makin pendek makin efisien.</p>
        <p><strong>Interpretasi:</strong> Obat kanker (kuning) 150x lebih mahal per QALY dari vaksin. Ini BUKAN vonis “jangan obati kanker” — melainkan peta opportunity cost: setiap rupiah punya harga dalam nyawa yang tak tertolong di tempat lain. Threshold (mis. 1–3x PDB per kapita per QALY, ala WHO) mengubah peta ini menjadi keputusan.</p>
      </div>

      <h2 id="icer">ICER &amp; Cost-Effectiveness — Si Wasit Anggaran</h2>
      <p><strong>Definisi.</strong> <strong>ICER</strong> = selisih biaya / selisih efek antara dua strategi. <strong>Cost-effective</strong> bila ICER di bawah <strong>threshold</strong> (willingness-to-pay, mis. 1–3× PDB per kapita per QALY).</p>
      <Tex math={String.raw`ICER = \frac{C_1 - C_0}{E_1 - E_0}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`C_1 - C_0`} />: selisih biaya (strategi baru minus pembanding)</li>
          <li><Tex math={String.raw`E_1 - E_0`} />: selisih efek dalam QALY (atau life-year)</li>
      </ul>
      <p><strong>Interpretasi:</strong> ICER = Rp300 juta/QALY dengan threshold Rp500 juta → cost-effective (layak). Strategi <strong>dominan</strong>: lebih murah DAN lebih efektif — langsung pilih. <strong>Didominasi</strong>: lebih mahal dan lebih buruk — langsung buang.</p>
      <details className="worked">
        <summary>📐 Contoh: skrining DM vs tidak skrining</summary>
        <p>Tanpa skrining: biaya Rp10 jt, efek 8,0 QALY. Dengan skrining: biaya Rp16 jt, efek 8,04 QALY.<br />ICER = (16−10)jt / (8,04−8,0) = 6 jt / 0,04 = <strong>Rp150 juta/QALY</strong>.<br />Threshold Rp500 jt → <strong>cost-effective</strong>. Keputusan: skrining layak didanai.<br />Catatan: ICER selalu RELATIF terhadap pembanding — ganti pembanding, ganti ICER.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> ICER itu seperti harga per porsi di kantin: bukan “mahal atau murah” absolut, melainkan “worth it dibanding opsi lain?” Threshold adalah budget kantinmu — di atas itu, seenak apapun, tidak dibeli.</p>
      <p><strong>Kapan memakai:</strong> Keputusan formularium, paket manfaat, investasi program — selalu dengan analisis sensitivitas (hasil berubah bila asumsi berubah?).</p>

      <h2 id="operasi">Operasi RS: LOS, Readmission &amp; Antrean</h2>
      <p><strong>Definisi.</strong> <strong>LOS</strong> (length of stay): lama rawat. <strong>Readmission</strong>: rawat ulang &lt;30 hari (proksi kualitas). <strong>Teori antrean</strong>: waktu tunggu meledak saat utilisasi mendekati 100% (bukan linear!).</p>
      <Tex math={String.raw`W_q \approx \frac{\rho}{1-\rho} \times \text{(faktor layanan)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`W_q`} />: waktu tunggu antrean rata-rata</li>
          <li><Tex math={String.raw`\rho`} />: utilisasi (0–1): sibuknya sistem</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus intuisi: ρ=0,5 → faktor 1; ρ=0,9 → faktor 9; ρ=0,95 → faktor 19. Menaikkan utilisasi dari 90% ke 95% <strong>menggandakan antrean</strong> — inilah kenapa IGD “penuh” tiba-tiba macet total.</p>
      <details className="worked">
        <summary>📐 Contoh: bed RS dan BOR</summary>
        <p>RS 100 bed, BOR (okupansi) 95%. Waktu tunggu IGD untuk bed: 8 jam.<br />Tambah 10 bed (utilisasi turun ke ~86%): waktu tunggu anjlok ke ~2 jam.<br />Bukan karena 10 bed itu ajaib — tapi karena keluar dari zona ρ→1 di mana antrean eksponensial.<br /><strong>Readmission:</strong> RS dengan readmission 20% vs 10% — bedakan yang <em>avoidable</em> (pulang terlalu cepat, LOS ditekan) dari yang tak terhindarkan (lihat HD20).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Antrean itu seperti balon: ditiup sampai 90% masih kalem, lewat itu menggelembung liar. Manajer yang menarget BOR 100% sedang menargetkan kekacauan — efisiensi semu yang dibayar dengan waktu tunggu pasien.</p>
      <p><strong>Kapan memakai:</strong> Perencanaan kapasitas (bed, dokter jaga), evaluasi efisiensi vs kualitas (LOS pendek + readmission naik = false economy).</p>

      <h2 id="pendalaman">🔍 Pendalaman: Membaca ICER seperti Komite Formularium</h2>
      <details className="worked">
        <summary>📐 Worked example: IVA vs HPV-DNA untuk skrining kanker serviks (klik untuk buka)</summary>
        <p>Dinkes provinsi memilih program skrining untuk 100.000 perempuan usia 30–50. Dua opsi:</p>
        <p><strong>Langkah 1 — Hitung biaya &amp; efek tiap opsi (per 100.000).</strong> IVA (inspeksi visual asam asetat): biaya Rp8 miliar, mendeteksi 400 lesi pra-kanker, menghasilkan 1.200 QALY. HPV-DNA: biaya Rp20 miliar, mendeteksi 700 lesi, menghasilkan 2.100 QALY.</p>
        <p><strong>Langkah 2 — ICER inkremental.</strong> ICER = (20 − 8) miliar / (2.100 − 1.200) QALY = Rp12 miliar / 900 = <strong>Rp13,3 juta per QALY</strong> gained.</p>
        <p><strong>Langkah 3 — Bandingkan dengan threshold.</strong> Threshold implisit Indonesia sering dirujuk 1× PDB per kapita per QALY (≈ Rp70–80 juta). Rp13,3 juta &lt;&lt; threshold → HPV-DNA <strong>cost-effective</strong> dibanding IVA.</p>
        <p><strong>Langkah 4 — Tapi cek kelayakan anggaran (budget impact).</strong> Cost-effective ≠ terjangkau: tambahan Rp12 miliar mungkin melebihi pagu Dinkes. Di sinilah <strong>analisis dampak anggaran 5 tahun</strong> masuk — dan opsi hibrida (HPV-DNA untuk 30–40 tahun, IVA untuk sisanya) bisa jadi kompromi.</p>
        <p><strong>Langkah 5 — Analisis sensitivitas.</strong> Jika harga tes HPV-DNA turun 30% (skala nasional), ICER → Rp9,3 juta/QALY. Jika cakupan IVA hanya 40% (realita lapangan), efektivitas IVA anjlok dan HPV-DNA makin dominan. <strong>Keputusan yang tidak diuji sensitivitasnya adalah tebakan.</strong></p>
        <p><strong>Pelajaran:</strong> ICER menjawab “apakah <em>worth it</em>”, budget impact menjawab “apakah <em>mampu</em>”. Kebijakan butuh keduanya — analis yang hanya memberi satu sedang menyembunyikan separuh kebenaran.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — QALY punya politiknya sendiri:</strong> QALY = tahun hidup × bobot kualitas (1 = sehat sempurna, 0 = meninggal). Tapi siapa menentukan bobot “kualitas hidup dengan kursi roda = 0,5”? <strong>Penilaian masyarakat umum</strong> (bukan pasiennya!) — dan penyandang disabilitas sering menilai kualitas hidupnya <em>lebih tinggi</em> dari penilaian orang sehat. Akibatnya QALY bisa <strong>sistematis meremehkan</strong> intervensi untuk disabilitas (kritik “QALY diskriminatif”). Analis yang baik tahu batas alatnya: pakai QALY untuk perbandingan, tapi <strong>laporkan juga outcome natural</strong> (kasus dicegah, kematian dihindari) agar keputusan tidak buta terhadap apa yang tidak tertangkap QALY.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — antrean IGD dan “biaya” yang tak terlihat:</strong> Lab 2 lesson ini mensimulasikan antrean meledak saat utilisasi &gt;85% — fenomena nyata IGD RS Indonesia saat musim DBD. Ekonomi kesehatan operasional menghitung <strong>biaya tunggu</strong>: tiap jam tunggu pasien kritis = risiko perburukan yang bisa dikuantifikasi (mis. tiap jam keterlambatan antibiotik sepsis menaikkan mortalitas ~8%). Investasi “tidak glamor” — 2 perawat triase tambahan, sistem rujukan berjenjang — sering punya <strong>ICER jauh lebih baik</strong> dibanding alat canggih, karena memotong waktu tunggu untuk <em>semua</em> pasien. Analis RS yang bisa menghitung ini mengubah percakapan direksi dari “beli alat apa” menjadi “selamatkan nyawa termurah di mana”.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Tiga Konsep yang Sering Disalahpahami</h2>
      <p><strong>1. “Biaya” ≠ “harga” ≠ “tarif”.</strong> Tiga angka berbeda: <strong>biaya</strong> (sumber daya riil: jam perawat, obat, listrik), <strong>harga</strong> (yang dibayar: tarif INA-CBG), <strong>tarif</strong> (kesepakatan administratif). Analisis ekonomi yang benar memakai <strong>biaya opportunity</strong> (nilai alternatif terbaik yang dikorbankan) — bukan tarif. Contoh: tarif INA-CBG operasi Rp10 juta, tapi biaya riil RS Rp14 juta (RS “nombok”) — untuk keputusan <em>nasional</em>, yang relevan adalah Rp14 juta (sumber daya masyarakat), bukan Rp10 juta (transfer administratif). <strong>Perspektif menentukan definisi biaya</strong>: perspektif <em>BPJS</em> (yang dibayar), <em>RS</em> (yang dikeluarkan), <em>masyarakat</em> (semua, termasuk waktu pasien &amp; keluarga). Selalu nyatakan perspektifmu — tanpanya, angka biayamu tidak bermakna.</p>
      <p><strong>2. Discounting: Rp1 miliar tahun depan ≠ Rp1 miliar hari ini.</strong> Biaya &amp; manfaat kesehatan masa depan di-<strong>diskon</strong> (biasanya 3%/tahun): QALY yang didapat 10 tahun lagi “bernilai” 0,74 QALY hari ini. Kontroversial? Ya — mendiskon <em>kesehatan</em> terasa tidak etis. Tapi <strong>tidak</strong> mendiskon lebih aneh: ia menyamakan nyawa tahun depan dengan nyawa hari ini, mengabaikan bahwa sumber daya hari ini bisa <em>diinvestasikan</em>. Praktik standar: diskon biaya &amp; efek dengan <em>rate sama</em>, dan <strong>uji sensitivitas</strong> 0% vs 5% — untuk intervensi pencegahan jangka panjang (vaksinasi anak), pilihan rate bisa <strong>membalik</strong> kesimpulan.</p>
      <p><strong>3. ICER bukan harga — ia rasio.</strong> ICER Rp13 juta/QALY <strong>bukan</strong> “harga satu QALY” — ia adalah <em>biaya tambahan per unit manfaat tambahan</em> dibanding alternatif spesifik. Ganti pembandingnya, berubah ICER-nya. Dan ICER <strong>tidak</strong> menjawab “mampu bayar?” (budget impact) atau “adil?” (distribusi). Analis yang menyajikan ICER tanpa <strong>pembanding yang eksplisit</strong>, <strong>dampak anggaran</strong>, dan <strong>analisis ekuitas</strong> menyajikan sepertiga kebenaran.</p>
      <div className="callout">
        <p><strong>Checklist analisis ekonomi yang lengkap:</strong> ① Perspektif dinyatakan. ② Pembanding = <em>praktik saat ini</em> (bukan “tidak melakukan apa-apa” yang fiktif). ③ Horizon waktu cukup panjang menangkap semua konsekuensi. ④ Discounting + sensitivitas. ⑤ ICER + budget impact + ekuitas. — Lima ini = analisis yang bisa dipertahankan di depan komite.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;QALY menilai nyawa orang cacat lebih rendah sehingga diskriminatif&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kritik ini nyata dan diperdebatkan etikawan. Praktik terbaik: QALY untuk <em>perbandingan intervensi</em>, bukan penilaian <em>nilai manusia</em>; banyak pedoman menambahkan bobot keadilan (severity, kelompok rentan). Analis harus tahu kontroversinya — bukan memakai QALY secara buta.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Intervensi cost-effective pasti harus didanai&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Cost-effectiveness adalah SATU kriteria. Keadilan (siapa yang diuntungkan), kelayakan anggaran total (budget impact), dan nilai sosial ikut menentukan. ICER di bawah threshold = “layak dipertimbangkan”, bukan “wajib”.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;LOS makin pendek selalu makin efisien&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> LOS pendek + readmission naik = memindahkan biaya ke masa depan (false economy). Efisiensi sejati = outcome per rupiah sepanjang episode, bukan LOS semata. Ukur keduanya bersamaan.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Membaca Cost-Effectiveness Plane</h2>
      <details className="worked">
        <summary>📐 Worked example: 1.000 simulasi, satu keputusan (klik untuk buka)</summary>
        <p>Analisis probabilistik (PSA): 1.000 simulasi Monte Carlo untuk HPV-DNA vs IVA, tiap simulasi mengambil parameter dari distribusinya (sensitivitas tes, biaya, progresi lesi). Hasil diplot: sumbu X = selisih QALY, sumbu Y = selisih biaya.</p>
        <p><strong>Langkah 1 — Baca kuadrannya.</strong> Kuadran NE (tenggara): lebih mahal + lebih efektif — <strong>mayoritas titik (82%)</strong> di sini. Kuadran SE: lebih murah + lebih efektif (<strong>dominan</strong>) — 12% titik. Kuadran NW/SW: 6% — HPV-DNA kalah. <strong>Artinya:</strong> dalam 94% skenario, HPV-DNA minimal tidak didominasi.</p>
        <p><strong>Langkah 2 — Kurva akseptabilitas (CEAC).</strong> Pada threshold Rp75 juta/QALY: <strong>91% simulasi</strong> cost-effective. Pada threshold ketat Rp25 juta/QALY: 68%. Sajikan sebagai: “pada threshold yang umum dipakai Indonesia, probabilitas HPV-DNA worth-it adalah <strong>9 dari 10</strong>.” — Bahasa probabilitas, bukan kepastian palsu.</p>
        <p><strong>Langkah 3 — Tornado diagram: parameter apa yang paling menggerakkan?</strong> Tiga teratas: (1) <strong>harga tes HPV-DNA</strong> (jika turun 30%, ICER membaik 40%), (2) <strong>cakupan IVA</strong> (jika cakupan IVA riil hanya 40% bukan 70% asumsi, HPV-DNA makin dominan), (3) <strong>sensitivitas IVA</strong> (rentang literatur lebar). <strong>Keputusan riset:</strong> negosiasi harga + studi cakupan lapangan — bukan debat model.</p>
        <p><strong>Langkah 4 — Value of Information (VOI).</strong> EVPI (expected value of perfect information) = Rp4,2 miliar — <strong>nilai</strong> menghilangkan semua ketidakpastian. Jika studi cakupan IVA biayanya Rp500 juta (&lt; EVPI), <strong>studi itu worth-it</strong> sebelum memutuskan. Inilah cara <em>menghitung nilai riset itu sendiri</em> — meta-analisis yang elegan.</p>
        <p><strong>Langkah 5 — Sampaikan ke pengambil keputusan.</strong> “HPV-DNA cost-effective dengan keyakinan 91% pada threshold kita. Ketidakpastian terbesar: harga tes &amp; cakupan IVA riil. Rekomendasi: <strong>negosiasi harga dulu + pilot ukur cakupan</strong>, baru roll-out nasional.” — Analisis yang <em>menghasilkan rencana</em>, bukan sekadar angka.</p>
        <p><strong>Pelajaran:</strong> ICER titik = <strong>cuaca hari ini</strong>; PSA = <strong>prakiraan musim</strong>. Pengambil keputusan butuh prakiraan — dengan jujur tentang awannya.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap ICER tanpa analisis sensitivitas adalah <strong>tebakan berjas</strong>. Tanyakan selalu: “parameter apa yang kalau berubah 20% membalik kesimpulanmu?” — Jika analisnya tidak tahu, analisnya belum selesai.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu sajikan <strong>budget impact</strong> bersama ICER. “Cost-effective tapi butuh Rp2 triliun” adalah informasi yang mengubah keputusan.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Lakukan <strong>analisis sensitivitas</strong> (tornado diagram): parameter apa yang paling menggoyang kesimpulan? Jika threshold dilampaui dalam skenario plausibel, katakan.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk operasi RS: ukur <strong>utilisasi</strong> sebelum menambah kapasitas. Seringkali masalahnya bukan kurang bed, tapi distribusi jadwal operasi yang menumpuk di hari yang sama.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Kalkulator QALY &amp; ICER</h2>
      <p>Hitung QALY dua strategi dari profil utilitas, lalu ICER dan keputusan terhadap threshold. Ubah utilitas/biaya dan lihat keputusan berbalik.</p>
      <PyodideLab
        title="🔬 Lab 1: Kalkulator QALY &amp; ICER"
        hint="Naikkan biaya obat baru sampai ICER melewati threshold Rp500jt. Itulah harga maksimal yang “masuk akal” — dasar negosiasi harga yang kuat."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Antrean Meledak di Utilisasi Tinggi</h2>
      <p>Simulasikan IGD sederhana: pasien datang acak, dilayani acak. Naikkan utilisasi 70%→90%→95% dan lihat waktu tunggu — tidak linear!</p>
      <PyodideLab
        title="🔬 Lab 2: Antrean Meledak di Utilisasi Tinggi"
        hint="Inilah alasan BOR 100% adalah target yang buruk. Coba tambah 1 dokter (kapasitas naik) pada utilisasi 95% — efeknya dramatis."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Defisit BPJS dan Matematika Keberlanjutan</h2>
      <p>BPJS Kesehatan sempat mengalami <strong>defisit kronis</strong> (miliaran rupiah per tahun sebelum penyesuaian iuran 2020). Di balik angka defisit ada <strong>matematika asuransi</strong> yang setiap analis kesehatan Indonesia wajib paham.</p>
      <p><strong>Anatomi defisit:</strong> (1) <strong>Adverse selection</strong> — yang mendaftar mandiri (PBPU) cenderung yang <em>sudah sakit</em> (butuh berobat), sementara yang sehat menunda daftar → <em>risk pool</em> lebih sakit dari populasi. (2) <strong>Klaim &gt; iuran</strong> — utilisasi naik (akses membaik — <em>tujuan</em> JKN!) tapi iuran tidak menyesuaikan. (3) <strong>Fraud &amp; moral hazard</strong> — klaim fiktif, upcoding, rujukan tidak perlu. Ketiganya adalah <strong>masalah aktuaria + perilaku</strong>, bukan sekadar “kurang dana”.</p>
      <p><strong>Peran analis:</strong> (a) <strong>Deteksi fraud</strong> — anomali klaim (lihat HD1): RS dengan pola “selalu kode termahal di grupnya”, dokter dengan volume tidak wajar. (b) <strong>Penyesuaian risiko kapitasi</strong> — puskesmas dengan populasi tua/sakit butuh kapitasi lebih tinggi; formula kapitasi buta = <strong>menghukum yang melayani yang paling butuh</strong>. (c) <strong>Evaluasi paket manfaat</strong> — dengan ICER (lesson ini!): manfaat apa yang <em>worth-it</em> dipertahankan saat dana terbatas? (d) <strong>Proyeksi aktuaria</strong> — model microsimulasi: dengan tren utilisasi &amp; demografi ini, iuran berapa yang <em>sustainable</em> 10 tahun ke depan?</p>
      <p><strong>Pelajaran kebijakan:</strong> defisit BPJS <strong>bukan</strong> bukti “JKN gagal” — ia adalah <strong>persamaan yang belum seimbang</strong>: cakupan ↑ (bagus!), iuran → (tetap), efisiensi → (perlu kerja analis!). Setiap poin efisiensi yang ditemukan analis (fraud −X%, rujukan tepat −Y%) adalah <strong>ruang fiskal</strong> untuk mempertahankan cakupan semesta. <strong>Analis kesehatan Indonesia adalah penjaga matematika JKN.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi karier:</strong> “Aktuaria kesehatan + data” adalah <strong>kombinasi langka</strong> di Indonesia: BPJS, asuransi swasta, Kemenkes, konsultan — semuanya butuh, sedikit yang bisa. Kuasai ICER + deteksi fraud + proyeksi, dan kamu memegang <strong>tiga kunci</strong> industri ini.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Banding lintas program → QALY + ICER vs threshold</h3>
        <p><strong>Kondisi:</strong> Alokasi anggaran antar penyakit/program.</p>
        <p><strong>Kenapa:</strong> Mata uang sama; transparan soal opportunity cost.</p>
        <p><strong>Contoh nyata:</strong> Vaksin vs obat kanker vs TB dalam satu pagu.</p>
      </div>
      <div className="decision-card">
        <h3>2. Satu penyakit, banyak opsi → Dominance check dulu</h3>
        <p><strong>Kondisi:</strong> Pilih strategi terbaik untuk kondisi spesifik.</p>
        <p><strong>Kenapa:</strong> Buang yang didominasi sebelum hitung ICER.</p>
        <p><strong>Contoh nyata:</strong> Tiga regimen TB: satu dominan (murah+efektif).</p>
      </div>
      <div className="decision-card">
        <h3>3. Klaim “efisien” → Cek LOS + readmission bersamaan</h3>
        <p><strong>Kondisi:</strong> Evaluasi efisiensi RS.</p>
        <p><strong>Kenapa:</strong> LOS pendek saja bisa false economy.</p>
        <p><strong>Contoh nyata:</strong> RS A LOS 3 hari + readmit 18% vs RS B LOS 5 hari + readmit 8%.</p>
      </div>
      <div className="decision-card">
        <h3>4. IGD/bed penuh → Analisis utilisasi &amp; antrean</h3>
        <p><strong>Kondisi:</strong> Waktu tunggu meledak.</p>
      <PlotlyChart
        data={hd17QueueData}
        title="Waktu Tunggu vs Utilisasi — Ledakan di Ujung"
        layout={hd17QueueDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu X = utilisasi sistem, Y = waktu tunggu rata-rata hasil simulasi. Perhatikan bentuk kurva.</p>
        <p><strong>Interpretasi:</strong> Sampai 80% kurva landai; setelah 90% meledak. Inilah visual dari W_q ∝ ρ/(1−ρ): 5 poin utilisasi terakhir jauh lebih mahal dari 20 poin pertama. Manajer yang bangga BOR 98% sedang memamerkan antrean.</p>
      </div>
        <p><strong>Kenapa:</strong> Solusi sering bukan tambah bed, tapi ratakan jadwal/kurangi ρ.</p>
        <p><strong>Contoh nyata:</strong> Jadwal operasi elektif menumpuk Senin → ratakan.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Bandingkan dengan mata uang sama (QALY).</li>
          <li>ICER selalu relatif terhadap pembanding + threshold.</li>
          <li>Sajikan budget impact + sensitivitas.</li>
          <li>Utilisasi ~95%+ = zona ledakan antrean.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Skrining Kanker Serviks: IVA vs HPV-DNA</h2>
      <div className="callout">
        <p>Dinkes memilih metode skrining: <strong>IVA</strong> (murah, Rp50rb, sens 60%) vs <strong>HPV-DNA</strong> (Rp400rb, sens 95%). Anggaran tetap: Rp2 miliar/tahun.</p>
      <p>Analisis: IVA menjangkau 40.000 wanita; HPV-DNA hanya 5.000. Kasus terdeteksi: IVA ~ kasus lebih banyak karena jangkauan 8x lipat, walau sens lebih rendah.</p>
        <p><strong>Pertanyaan:</strong> Mana yang dipilih? Tunjukkan cara berpikirnya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Hitung efek populasi, bukan sens individu: IVA: 40.000 × prevalensi × 60%; HPV-DNA: 5.000 × prevalensi × 95%. Dengan prevalensi lesi 2%: IVA → 480 terdeteksi; HPV-DNA → 95 terdeteksi. IVA memenangkan <strong>efek populasi</strong> 5x lipat dengan anggaran sama — walau “tesnya lebih jelek”. Inilah pelajaran ekonomi kesehatan: tes terbaik × jangkauan kecil bisa kalah dari tes cukup-baik × jangkauan massal. (Ideal: strategi hybrid — HPV-DNA untuk yang IVA positif/risiko tinggi.) Jangan biarkan perfeksionisme tes mengalahkan aritmetika populasi.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 1 QALY artinya…"
        options={["1 tahun hidup berapa pun kualitasnya",
          "1 tahun hidup dalam kesehatan sempurna (atau ekuivalennya)",
          "1 juta rupiah",
          "1 pasien sembuh"]}
        correct={1}
        explanation="Benar: 2 tahun dengan utilitas 0,5 = 1 QALY. Menggabungkan panjang DAN kualitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. ICER = Rp150jt/QALY, threshold Rp500jt. Kesimpulan?"
        options={["Tidak layak",
          "Cost-effective — di bawah willingness-to-pay",
          "Harus gratis",
          "Tidak bisa dinilai"]}
        correct={1}
        explanation="Benar: di bawah threshold = nilai yang baik untuk uang. Tapi tetap cek budget impact + keadilan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Strategi A: biaya Rp10jt, 8,0 QALY. B: Rp12jt, 7,9 QALY. Maka B…"
        options={["Cost-effective",
          "Didominasi (lebih mahal, kurang efektif) — buang",
          "Dominan",
          "Perlu ICER"]}
        correct={1}
        explanation="Benar: didominasi = kalah di kedua sisi. Tidak perlu hitung ICER — langsung eliminasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Utilisasi IGD naik 90% → 95%. Waktu tunggu…"
        options={["Naik sedikit (linear)",
          "Naik ~2x lipat (eksponensial di dekat 100%)",
          "Turun",
          "Tetap"]}
        correct={1}
        explanation="Benar: W_q ∝ ρ/(1−ρ). 0,9/0,1=9 vs 0,95/0,05=19. Inilah kenapa BOR 100% = target macet."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. LOS turun tapi readmission naik tajam. Interpretasi?"
        options={["Makin efisien",
          "False economy — biaya dipindah ke masa depan; ukur episode, bukan LOS",
          "Pasien makin sehat",
          "Tidak terkait"]}
        correct={1}
        explanation="Benar: efisiensi semu. Pulang terlalu cepat = readmit. Ukur outcome per rupiah sepanjang episode."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kritik valid terhadap QALY?"
        options={["Tidak ada",
          "Bisa merugikan kelompok dengan disabilitas kronis bila dipakai buta — butuh bobot keadilan",
          "Terlalu sederhana",
          "Tidak bisa dihitung"]}
        correct={1}
        explanation="Benar: kontroversi etiknya nyata. Analis profesional tahu batas alatnya — pakai dengan penyesuaian keadilan."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>QALY</strong> = Σ utilitas × waktu — mata uang pembanding lintas program.</li>
          <li><strong>ICER</strong> = Δbiaya/Δefek; cost-effective bila &lt; threshold WTP.</li>
          <li>Cek <strong>dominansi</strong> dulu sebelum ICER.</li>
          <li>Sajikan <strong>budget impact + sensitivitas</strong> bersama ICER.</li>
          <li>Tes “terj ele k” × jangkauan kecil bisa kalah dari tes cukup-baik × massal.</li>
          <li><strong>Antrean meledak</strong> di utilisasi ~95%+: W_q ∝ ρ/(1−ρ).</li>
          <li><strong>LOS pendek + readmit naik</strong> = false economy.</li>
          <li>QALY punya kontroversi etik — pakai transparan dengan bobot keadilan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd16-surveilans-wabah" className="btn btn-secondary btn-sm">← HD16</Link>
        <Link href="/learn/hd18-privasi-etika" className="btn btn-primary btn-sm">HD18 →</Link>
      </div>
    </div>
  );
}
