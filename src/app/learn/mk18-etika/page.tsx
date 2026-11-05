"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk18EtikaPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK18 — Marketing Data Analytics</span>
        <h1 className="display-title">Etika & Storytelling:<br/>Dipercaya dan Didengar</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Targeting 'Cerdas' yang Diskriminatif</a></li>
<li><a href="#pdp">Consent & UU PDP</a></li>
<li><a href="#fairness">Fairness dalam Targeting</a></li>
<li><a href="#story">Storytelling Analis</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Batas-Batas Analitik Pemasaran</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Kode Pos PinjamBaik</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bukusaku">📜 Buku Saku Etika Analis Data</a></li>
<li><a href="#kisahdilema">📖 Kisah Nyata: Dilema Etika Sang Analis</a></li>
<li><a href="#tambahan-audit">📊 Studi Kasus: Audit Fairness PinjamanKu</a></li>
<li><a href="#tambahan-pdp">📜 Pendalaman: UU PDP Praktis</a></li>
<li><a href="#tambahan-faq">❓ FAQ Etika</a></li>
<li><a href="#tambahan-kasus2">📊 Studi Kasus: Iklan yang Terlalu Tepat</a></li>
<li><a href="#tambahan-simulasi">💬 Simulasi: Menolak yang Tidak Etis</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan prinsip consent, purpose limitation, dan minimisasi di UU PDP.</li>
<li>Menghitung disparate impact ratio dan mengidentifikasi proxy discrimination.</li>
<li>Menjelaskan kenapa 'data anonim' belum tentu aman (re-identifikasi).</li>
<li>Menyusun narasi 'what–so what–now what' dari temuan analisis.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Targeting 'Cerdas' yang Diskriminatif</h2>
      <div className="story">
        <p>Fintech <em>&ldquo;PinjamBaik&rdquo;</em> memakai model &ldquo;cerdas&rdquo; untuk targeting iklan pinjaman: hindari 'kode pos berisiko'. Hasilnya efisien — CPA turun 30%. Lalu audit menemukan: <strong>kode pos = proxy ras/etnis</strong> — iklan pinjaman berbunga tinggi hanya tampil di wilayah minoritas. Viral. Denda regulator. Boikot.</p>
<p>Twist-nya: <strong>tidak ada yang berniat diskriminatif</strong> — model hanya mengoptimasi CPA. Tapi 'tidak berniat' bukan pembelaan: <strong>dampaknya diskriminatif</strong>, dan di banyak yurisdiksi itu cukup untuk melanggar hukum. Lesson ini: dua sisi yang membuat analis <em>bertahan lama</em> — <strong>etika</strong> (agar tidak menghancurkan perusahaan) dan <strong>storytelling</strong> (agar yang benar didengar).</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="pdp">UU PDP — Aturan Main Data Pribadi</h2>
<p><strong>Definisi.</strong> <strong>UU PDP Indonesia (UU No. 27/2022)</strong>: data pribadi = info tentang individu teridentifikasi/teridentifikasi-kan. Prinsip kunci: <strong>consent</strong> (persetujuan yang sah untuk tujuan spesifik), <strong>purpose limitation</strong> (pakai hanya untuk tujuan yang disetujui), <strong>minimisasi</strong> (kumpulkan seperlunya), <strong>hak subjek</strong> (akses, koreksi, hapus, tarik consent, portabilitas).</p>
<p>Implikasi marketing: <strong>tidak boleh</strong> memakai data newsletter untuk targeting iklan tanpa consent baru; <strong>wajib</strong> sediakan opt-out yang mudah; <strong>retensi</strong> terbatas (hapus/anonymize setelah tujuan tercapai). Denda & pidana = nyata.</p>
<p><strong>Kepribadian/intuisi:</strong> UU PDP seperti <strong>aturan bertamu</strong>: izin masuk untuk 'minum teh' (consent spesifik) ≠ izin menggeledah lemari (purpose limitation); jangan bawa koper besar untuk bertamu 10 menit (minimisasi); tuan rumah boleh memintamu pulang kapan saja (tarik consent).</p>
<p><strong>Kapan dipakai:</strong> Setiap pengumpulan & pemakaian data pribadi. Libatkan legal/DPO sejak desain (privacy by design), bukan setelah viral.</p>
<details className="worked">
<summary>📐 Contoh: Audit consent newsletter (klik untuk buka)</summary>
<p>Database 500.000 email dari 'newsletter'. Tim ads ingin pakai untuk custom audience.</p>
<p><strong>Cek:</strong> (1) Apakah form newsletter menyebut 'iklan tertarget'? Tidak → <strong>tidak boleh</strong> (purpose limitation). (2) Opt-out tersedia? Ya, tapi tersembunyi → perbaiki. (3) Retensi: email 5 tahun tidak aktif → hapus/anonymize.</p>
<p><strong>Solusi:</strong> kampanye re-consent ('mau dapat promo personal? klik di sini') — dapat 120.000 consent baru yang <em>sah</em>. Lebih sedikit tapi legal & engaged (malah convert lebih baik).</p>
</details>
<h2 id="fairness">Fairness — Diskriminasi Tanpa Niat</h2>
<p><strong>Definisi.</strong> <strong>Proxy discrimination</strong>: fitur 'netral' (kode pos, nama, device) berkorelasi dengan atribut dilindungi (ras, agama, gender) → model diskriminatif tanpa pernah 'melihat' atributnya. <strong>Disparate impact</strong>: kebijakan netral tapi dampaknya timpang antar-grup. Ukur dengan <strong>disparate impact ratio</strong> = rate grup minoritas / rate grup mayoritas (&lt; 0,8 = red flag, aturan 4/5).</p>
<p>Mitigasi: audit fitur (korelasi dengan proxy), uji per grup, <em>fairness through awareness</em> (ukur, jangan buta), dan batasi atribut sensitif + proxy-nya.</p>
<Tex math={String.raw`\text{DI Ratio} = \frac{\text{rate}_{\text{minoritas}}}{\text{rate}_{\text{mayoritas}}} \quad (\text{red flag jika } < 0{,}8)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\text{rate}`} />: mis. % yang dapat penawaran baik / % di-target</li>
<li>0,8 = aturan 4/5 (EEOC): di bawah ini = bukti awal disparate impact</li>
<li>Bukan satu-satunya metrik (ada equalized odds, dll.) — tapi yang paling mudah dijelaskan</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Proxy discrimination seperti <strong>rekrutmen 'buta nama' tapi filter kode pos</strong> — kode pos 'netral', tapi peta tidak berbohong. Model tidak rasis; <strong>datanya</strong> yang membawa sejarah. Tugas analis: menjadi 'auditor peta'.</p>
<p><strong>Kapan dipakai:</strong> Setiap model targeting/skoring yang berdampak ke akses (kredit, pekerjaan, harga, layanan). Audit sebelum deploy, monitor berkala.</p>
<details className="worked">
<summary>📐 Contoh: Audit PinjamBaik (klik untuk buka)</summary>
<p>Penawaran bunga rendah: wilayah A (mayoritas) 40% dapat, wilayah B (minoritas) 18% dapat. DI ratio = 18/40 = <strong>0,45 &lt; 0,8</strong> → red flag.</p>
<p><strong>Investigasi:</strong> fitur 'kode pos' + 'riwayat device' = proxy kuat. <strong>Mitigasi:</strong> hapus kode pos granular (pakai kota saja), tambah fairness constraint, atau — paling bersih — <strong>samakan penawaran</strong> (bunga by risiko kredit individual yang sah, bukan wilayah).</p>
<p>Hasil: CPA naik 8% (lebih mahal), tapi lolos audit & tidak viral. <strong>Etika = asuransi termurah.</strong></p>
</details>
<PlotlyChart
  data={[{x: ["Wilayah A (mayoritas)", "Wilayah B (minoritas)"], y: [40, 18], type: "bar", marker: {color: ["#2a7de1","#ef4444"]}, text: ["40%","18%"], textposition: "outside"}]}
  title={"Penawaran bunga rendah per wilayah"}
  layout={{yaxis: {title: "% dapat penawaran"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = % yang dapat penawaran baik per wilayah.</p>
<p><strong>Interpretasi:</strong> DI ratio = 18/40 = 0,45 — jauh di bawah 0,8. Visual ini = bukti satu slide untuk direksi: 'model kita diskriminatif'. Tanpa audit, angka ini tersembunyi di balik 'CPA turun 30%' yang dirayakan.</p>
</div>
<h2 id="story">Storytelling — Benar Saja Tidak Cukup</h2>
<p><strong>Definisi.</strong> <strong>Storytelling analis</strong> = menyampaikan temuan agar <em>diingat & dieksekusi</em>. Struktur <strong>'what – so what – now what'</strong>: WHAT (temuan: 'retention cohort baru 18%'), SO WHAT (implikasi: 'kualitas akuisisi memburuk; scale = bakar uang'), NOW WHAT (aksi: 'perbaiki onboarding 7 hari; tahan budget sampai 30%'). <strong>Pyramid principle</strong>: kesimpulan dulu, baru pendukung — bukan sebaliknya.</p>
<p><strong>Experiment readout culture</strong> (dari riset lowongan): tiap eksperimen punya <strong>katalog</strong> — hipotesis, desain, hasil, keputusan (scale/iterate/stop) — yang bisa dibaca siapa pun. Organisasi yang tidak mencatat = mengulang kesalahan yang sama tiap kuartal.</p>
<p><strong>Kepribadian/intuisi:</strong> Analisis tanpa storytelling seperti <strong>obat yang tidak diminum</strong>: mujarab tapi tidak bekerja. 'What–so what–now what' = sendoknya: what (ini obatnya), so what (tanpa ini kamu sakit), now what (minum 2x sehari). Analis hebat = apoteker yang pasiennya mau minum obat.</p>
<p><strong>Kapan dipakai:</strong> Setiap presentasi, dashboard, dan laporan. Satu slide = satu pesan (ingat A1.8!).</p>
<details className="worked">
<summary>📐 Contoh: Slide yang didengar (klik untuk buka)</summary>
<p><strong>Judul slide (kesimpulan dulu):</strong> 'Hentikan scale — perbaiki onboarding dulu'</p>
<p><strong>WHAT:</strong> Cohort Jun M3 = 18% vs Jan 45% (chart cohort table).</p>
<p><strong>SO WHAT:</strong> Tiap 1.000 user baru 'bernilai' setengah dari tahun lalu; LTV:CAC turun ke 1,8.</p>
<p><strong>NOW WHAT:</strong> (1) Tahan budget akuisisi 1 bulan; (2) sprint onboarding 7-hari; (3) target: M3 cohort ≥ 30% sebelum scale.</p>
<p>Bandingkan dengan slide 'Analisis Retention Q2' berisi 12 chart tanpa kesimpulan — yang mana dieksekusi direksi?</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Batas-Batas Analitik Pemasaran</h2>
<p><strong>Data</strong> = <strong>kekuatan</strong>. <strong>Kekuatan</strong> = <strong>tanggung jawab</strong>. <strong>Analitik pemasaran</strong> bisa <strong>memanipulasi</strong> (dark patterns!), <strong>mendiskriminasi</strong> (bias!), <strong>melanggar</strong> privasi (UU PDP!). Tiga pendalaman: (1) UU PDP; (2) fairness; (3) storytelling jujur.</p>
<h3>1. UU PDP — Hukum Privasi Indonesia</h3>
<p><strong>Definisi.</strong> <strong>UU PDP</strong> (No. 27/2022!) = <strong>hukum</strong> perlindungan data pribadi <strong>Indonesia</strong>. <strong>Prinsip:</strong> <strong>consent</strong> (izin!), <strong>tujuan</strong> (jelas!), <strong>minimasi</strong> (seperlunya!), <strong>keamanan</strong> (lindungi!), <strong>hak</strong> (akses! hapus! tarik!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>aturan</strong> bertamu: <strong>ketuk</strong> dulu (consent!), <strong>jelaskan</strong> maksud (tujuan!), <strong>jangan</strong> geledah lemari (minimasi!), <strong>jaga</strong> rahasia (keamanan!), <strong>boleh</strong> disuruh pulang (tarik!).</p>
<p><strong>Sanksi:</strong> <strong>denda</strong> 2% <strong>revenue</strong>! (<strong>Bukan</strong> main-main!). <strong>Pidana</strong> (penjara!). <strong>Reputasi</strong> (hancur!).</p>
<p><strong>Untuk</strong> marketing: <strong>cookie</strong> = <strong>butuh</strong> consent! <strong>Retargeting</strong> = <strong>jelaskan</strong>! <strong>Beli</strong> data = <strong>pastikan</strong> consent! <strong>Hapus</strong> jika <strong>diminta</strong>!</p>
<p><strong>Kapan dipakai:</strong> <strong>Selalu</strong>! <strong>Sebelum</strong> kumpulkan data, <strong>tanya</strong>: &ldquo;<strong>izinnya</strong> mana? <strong>tujuannya</strong> apa? <strong>perlu</strong> nggak?&rdquo;</p>
<details className="worked">
<summary>📐 Contoh 1: Audit PDP (klik untuk buka)</summary>
<p><strong>Praktik:</strong> beli <strong>database</strong> 100.000 email (Rp5jt!). <strong>Kirim</strong> promo.</p>
<p><strong>Audit:</strong> <strong>Consent?</strong> <strong>Tidak</strong>! (Beli ≠ <strong>izin</strong>!). <strong>Tujuan?</strong> <strong>Tidak</strong> jelas! <strong>Minat?</strong> <strong>Melanggar</strong>!</p>
<p><strong>Risiko:</strong> <strong>denda</strong> 2% revenue (Rp100M → <strong>Rp2M</strong>!). <strong>Lapor</strong> 1 orang = <strong>investigasi</strong>!</p>
<p><strong>Solusi:</strong> <strong>bangun</strong> sendiri (opt-in!). <strong>Mahal</strong> (waktu!), tapi <strong>aman</strong>. <strong>Beli</strong> data = <strong>beli</strong> masalah.</p>
<p><strong>Pelajaran:</strong> <strong>murah</strong> (Rp5jt!) = <strong>mahal</strong> (Rp2M!). <strong>Hitung</strong> risiko!</p>
</details>
<h3>2. Fairness — Jangan Diskriminasi</h3>
<p><strong>Definisi.</strong> <strong>Fairness</strong> = model <strong>tidak</strong> mendiskriminasi (<strong>ras</strong>! <strong>gender</strong>! <strong>agama</strong>!). <strong>Tiga</strong> metrik: <strong>demographic parity</strong> (hasil <strong>sama</strong> antar grup!), <strong>equalized odds</strong> (error <strong>sama</strong>!), <strong>calibration</strong> (skor <strong>arti</strong> sama!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>wasit</strong> yang <strong>tidak</strong> boleh <strong>memihak</strong>. <strong>Model</strong> yang <strong>menolak</strong> kredit <strong>perempuan</strong> lebih <strong>sering</strong> = <strong>wasit curang</strong> (walau <strong>tidak</strong> sengaja!).</p>
<p><strong>Sumber</strong> bias: <strong>data</strong> (historis <strong>diskriminatif</strong>!), <strong>fitur</strong> (proxy! — <strong>kode pos</strong> = <strong>ras</strong>!), <strong>label</strong> (target <strong>bias</strong>!).</p>
<p><strong>Solusi:</strong> <strong>audit</strong> (ukur <strong>per grup</strong>!), <strong>perbaiki</strong> (reweight! <strong>hapus</strong> proxy!), <strong>monitor</strong> (terus!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> model yang <strong>berdampak</strong> (kredit! hiring! <strong>targeting</strong>!). <strong>Untuk</strong> marketing: <strong>jangan</strong> target by <strong>ras/gender</strong>! <strong>Audit</strong> propensity!</p>
<details className="worked">
<summary>📐 Contoh 2: Audit fairness (klik untuk buka)</summary>
<p><strong>Model:</strong> propensity <strong>beli</strong>. <strong>Grup:</strong> A (1.000!), B (1.000!).</p>
<p><strong>Hasil:</strong> A: <strong>300</strong> ditarget (30%!). B: <strong>100</strong> ditarget (10%!). <strong>Demographic parity:</strong> <strong>30% vs 10%</strong> = <strong>tidak</strong> adil!</p>
<p><strong>Investigasi:</strong> <strong>fitur</strong> &ldquo;kode pos&rdquo; = <strong>proxy</strong> grup! <strong>Solusi:</strong> <strong>hapus</strong> kode pos. <strong>Hasil baru:</strong> A 22%, B 20% (<strong>adil</strong>!). <strong>Akurasi:</strong> turun <strong>1%</strong> (<strong>worth it</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>1%</strong> akurasi &lt; <strong>keadilan</strong>. <strong>Audit</strong> = <strong>wajib</strong>.</p>
</details>
<h3>3. Storytelling Jujur — Jangan Menipu dengan Chart</h3>
<p><strong>Definisi.</strong> <strong>Storytelling</strong> = <strong>komunikasi</strong> insight. <strong>Jujur</strong> = <strong>tidak</strong> memanipulasi (<strong>sumbu</strong> dipotong! <strong>cherry-pick</strong>! <strong>korelasi</strong> = kausal!).</p>
<p><strong>Tiga</strong> dosa: <strong>(a) Sumbu</strong> menipu (0–100 vs 90–100! — <strong>beda</strong> terlihat <strong>besar</strong>!). <strong>(b) Cherry-pick</strong> (pilih <strong>periode</strong> yang <strong>bagus</strong>!). <strong>(c) Kausal</strong> palsu (&ldquo;iklan <strong>naik</strong>, penjualan <strong>naik</strong>&rdquo; = <strong>belum tentu</strong> sebab!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>jurnalis</strong> vs <strong>propagandis</strong>. <strong>Jurnalis</strong> = <strong>fakta</strong> lengkap. <strong>Propagandis</strong> = <strong>fakta</strong> dipilih. <strong>Pilih</strong> jadi <strong>jurnalis</strong>.</p>
<p><strong>Aturan:</strong> <strong>(1)</strong> Sumbu dari <strong>nol</strong> (kecuali <strong>alasan</strong>!). <strong>(2)</strong> Tunjukkan <strong>ketidakpastian</strong> (interval!). <strong>(3)</strong> <strong>Jangan</strong> klaim <strong>kausal</strong> dari <strong>korelasi</strong>! <strong>(4)</strong> <strong>Akui</strong> keterbatasan!</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> presentasi! <strong>Kepercayaan</strong> = <strong>mata uang</strong>. <strong>Sekali</strong> menipu = <strong>hilang</strong> selamanya.</p>
<details className="worked">
<summary>📐 Contoh 3: Chart menipu (klik untuk buka)</summary>
<p><strong>Data:</strong> penjualan 100 → 105 (+5%!).</p>
<p><strong>Chart menipu:</strong> sumbu 95–106. <strong>Terlihat:</strong> <strong>naik</strong> 50%! (<strong>Wow</strong>!).</p>
<p><strong>Chart jujur:</strong> sumbu 0–110. <strong>Terlihat:</strong> <strong>naik</strong> sedikit (5%!).</p>
<p><strong>Pelajaran:</strong> <strong>sama</strong> data, <strong>beda</strong> kesan. <strong>Pilih</strong> jujur. <strong>Kepercayaan</strong> &gt; <strong>kagum</strong> sesaat.</p>
</details>
<PlotlyChart
  data={[{x: ["Q1", "Q2"], y: [100, 105], type: "bar", marker: {color: "#2a7de1"}}]}
  title={"Chart jujur: sumbu dari nol (+5% terlihat wajar)"}
  layout={{yaxis: {title: "Penjualan", range: [0, 110]}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu dari <strong>nol</strong>. <strong>Kenaikan</strong> 5% = <strong>terlihat</strong> proporsional.</p>
<p><strong>Interpretasi:</strong> <strong>Jujur</strong> = <strong>tidak</strong> melebihkan. <strong>Audiens</strong> = <strong>percaya</strong>. <strong>Kepercayaan</strong> = <strong>pengaruh</strong> jangka panjang.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Data sudah dianonimkan (nama dihapus) = aman & bebas aturan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Re-identifikasi</strong> itu mudah: kode pos + tanggal lahir + gender = unik untuk 87% populasi AS (penelitian Latanya). 'Anonim' tanpa teknik (k-anonymity, agregasi, noise) = nama yang disamarkan, bukan hilang. UU PDP tetap berlaku untuk data yang <em>dapat</em> diidentifikasi kembali.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Etika & compliance menghambat bisnis — makin patuh makin lambat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Kasus PinjamBaik: 'efisiensi' 30% → denda + boikot + biaya krisis 100x lipat. <strong>Etika = asuransi termurah.</strong> Dan consent yang benar justru memberi data <em>lebih berkualitas</em> (120rb consent aktif &gt; 500rb email mati). Kepatuhan yang didesain baik = keunggulan kompetitif (kepercayaan).</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Privacy by design, bukan by panic.</strong> Libatkan legal/DPO saat merancang tracking (MK2), bukan setelah dashboard jadi. Pertanyaan desain: 'data apa yang TIDAK perlu kita kumpulkan?' — jawaban yang bagus menghemat storage, risiko, dan denda.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Tulis readout 1 halaman untuk tiap eksperimen.</strong> Hipotesis → desain → hasil → keputusan (scale/iterate/stop). Katalog ini = memori organisasi. Tanpa itu, tim mengulang test yang sama 2 tahun kemudian — dan 'belajar' hal yang sama dua kali.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Audit Fairness: Disparate Impact</h2>
<p>Hitung DI ratio dari data penawaran per grup. Ubah angka — lihat kapan red flag menyala.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Disparate Impact"}
  hint={"Ubah rate minoritas 18 → 35. DI ratio naik ke 0,875 — lolos 0,8. Berapa 'harga' fairness dalam CPA?"}
  defaultCode={"# Kalkulator disparate impact ratio\n# % mendapat penawaran baik per grup\ngrup = {\n    \"Wilayah A (mayoritas)\": 40,\n    \"Wilayah B (minoritas)\": 18,   # ubah sesukamu\n    \"Wilayah C\": 35,\n}\nmayor = max(grup.values())\nprint(f\"{'grup':<24}{'rate':>6}  DI ratio\")\nfor g, r in grup.items():\n    di = r / mayor\n    flag = \"RED FLAG\" if di < 0.8 else \"ok\"\n    print(f\"{g:<24}{r:>5}%  {di:.2f}  {flag}\")\nprint(\"\\nAturan 4/5: DI < 0.8 = bukti awal disparate impact.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Cek K-Anonymity</h2>
<p>Uji apakah dataset 'anonim'-mu benar-benar anonim: hitung ukuran tiap kelompok quasi-identifier.</p>
<PyodideLab
  title={"Lab 2 — Cek K-Anonymity"}
  hint={"Tambahkan baris dengan kombinasi unik (mis. kode pos langka + umur aneh). Lihat k=1 — ia teridentifikasi!"}
  defaultCode={"from collections import Counter\n# data 'anonim' (nama dihapus): (kodepos, umur, gender)\ndata = [\n    (\"10110\", 34, \"P\"), (\"10110\", 34, \"P\"), (\"10110\", 35, \"P\"),\n    (\"10110\", 34, \"L\"), (\"20212\", 41, \"L\"), (\"20212\", 41, \"L\"),\n    (\"99999\", 87, \"P\"),  # kombinasi langka!\n]\nc = Counter(data)\nk = min(c.values())\nprint(f\"k-anonymity = {k}  (syarat umum: k >= 5)\")\nprint(\"\\nKelompok terkecil:\")\nfor combo, n in c.most_common()[::-1][:3]:\n    print(f\"  {combo}: {n} orang\" + (\"  <- TERIDENTIFIKASI!\" if n == 1 else \"\"))\nprint(\"\\nHapus nama TIDAK cukup. Butuh generalisasi/supresi.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Mau pakai data untuk tujuan baru → <strong>Cek consent & purpose limitation dulu</strong></h3>
<p><strong>Kenapa:</strong> Hukum + kepercayaan. Re-consent lebih murah dari denda.</p>
<p><strong>Contoh nyata:</strong> Newsletter → custom audience: re-consent.</p>
</div>
<div className="decision-card">
<h3>2. Model berdampak ke akses/harga/layanan → <strong>Audit fairness (DI ratio + proxy check)</strong></h3>
<p><strong>Kenapa:</strong> Diskriminasi tanpa niat tetap diskriminasi.</p>
<p><strong>Contoh nyata:</strong> Targeting kredit, hiring, pricing.</p>
</div>
<div className="decision-card">
<h3>3. Rilis data 'anonim' ke pihak ketiga → <strong>K-anonymity ≥ 5 + agregasi</strong></h3>
<p><strong>Kenapa:</strong> Nama dihapus ≠ anonim (re-identifikasi mudah).</p>
<p><strong>Contoh nyata:</strong> Data riset, dashboard publik.</p>
</div>
<div className="decision-card">
<h3>4. Presentasi ke direksi → <strong>What–so what–now what + 1 pesan/slide</strong></h3>
<p><strong>Kenapa:</strong> Benar tapi tidak didengar = tidak bekerja.</p>
<p><strong>Contoh nyata:</strong> Slide 'Hentikan scale' di atas.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Consent spesifik</strong> — bukan 'sekali untuk semua'.</li><li><strong>Audit fairness</strong> sebelum deploy model berdampak.</li><li><strong>'Anonim' harus dibuktikan</strong> (k-anonymity).</li><li><strong>Ceritakan</strong>: what → so what → now what.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Denda PDP yang Menghancurkan</h3>
<p>Startup &ldquo;CepatKirim&rdquo;: <strong>scrape</strong> 500.000 nomor (tanpa <strong>izin</strong>!). <strong>Blast</strong> WA promo. <strong>Dilapor</strong> 10 orang. <strong>Investigasi</strong> Kominfo. <strong>Denda:</strong> <strong>Rp1,5M</strong>! (<strong>Hampir</strong> bangkrut!).</p>
<p><strong>Pelajaran:</strong> <strong>growth hacking</strong> = <strong>bunuh diri</strong> jika <strong>langgar</strong> PDP. <strong>Bangun</strong> organik (<strong>lambat</strong>! <strong>aman</strong>!).</p>
<h3>Kisah 2: Chart yang Menghancurkan Karier</h3>
<p>Analis &ldquo;Andi&rdquo;: <strong>potong</strong> sumbu (&ldquo;biar <strong>terlihat</strong> bagus!&rdquo;). <strong>Direksi</strong> = <strong>kagum</strong>. <strong>Tapi:</strong> <strong>CFO</strong> = <strong>curiga</strong> (cek <strong>data</strong>!). <strong>Ketahuan</strong>! <strong>Kepercayaan</strong> = <strong>hilang</strong>. <strong>Karier</strong> = <strong>mandek</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>sekali</strong> menipu = <strong>selamanya</strong> dicurigai. <strong>Jujur</strong> = <strong>investasi</strong> karier.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Etika = menghambat bisnis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Etika</strong> = <strong>melindungi</strong> bisnis (<strong>denda</strong>! <strong>reputasi</strong>!). <strong>Kepercayaan</strong> = <strong>aset</strong>. <strong>Pelanggaran</strong> = <strong>liabilitas</strong>. <strong>Hitung</strong> risiko!</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Kode Pos yang 'Netral'</h2>
<div className="callout">
<p>PinjamBaik: targeting by kode pos → CPA turun 30%. Audit: DI ratio 0,45 (bunga rendah: A 40%, B 18%). Kode pos = proxy. Viral, denda, boikot.</p>
<p><strong>Pertanyaan:</strong> (a) Kenapa 'tidak berniat' bukan pembelaan? (b) Tiga mitigasi konkret? (c) Bagaimana storytelling yang benar ke direksi SEBELUM viral?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Disparate impact</strong> menilai <em>dampak</em>, bukan niat. Di banyak yurisdiksi, dampak timpang = pelanggaran terlepas niat. 'Model hanya optimasi CPA' = pengakuan, bukan pembelaan.</p>
<p>(b) <strong>(1)</strong> Hapus kode pos granular (kota saja) + uji proxy tiap fitur. <strong>(2)</strong> Fairness constraint/gate di pipeline (DI ≥ 0,8 sebelum deploy). <strong>(3)</strong> Samakan penawaran berbasis risiko individual yang sah — bukan wilayah.</p>
<p>(c) <strong>Slide 1 halaman SEBELUM deploy:</strong> WHAT: 'model efisien tapi DI 0,45'. SO WHAT: 'risiko viral + denda &gt; hemat CPA 30%'. NOW WHAT: 'tunda deploy 2 minggu untuk mitigasi'. Analis yang bersuara <em>sebelum</em> = pahlawan; yang diam = ikut tenggelam.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — PDP.</strong> Mau <strong>retargeting</strong> 50.000 pengunjung. Apa <strong>syarat</strong> PDP? Jika <strong>tidak</strong> ada consent?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>Syarat:</strong> <strong>consent</strong> cookie (<strong>banner</strong>! opt-in!). <strong>Tujuan</strong> jelas (&ldquo;untuk <strong>iklan</strong>!&rdquo;). <strong>Hak</strong> tarik (<strong>mudah</strong>!).</p>
<p><strong>Tidak</strong> ada consent = <strong>jangan</strong> retargeting! (<strong>Denda</strong>! <strong>Lapor</strong>!). <strong>Bangun</strong> consent dulu!</p>
</details>
<p><strong>Soal 2 — Fairness.</strong> Model <strong>targeting</strong>: grup X 40% ditarget, grup Y 15%. <strong>Adil</strong>? <strong>Aksi</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>Tidak</strong> adil (40% vs 15%!). <strong>Aksi:</strong> <strong>audit</strong> fitur (<strong>proxy</strong>?), <strong>perbaiki</strong> (<strong>hapus</strong>! reweight!), <strong>monitor</strong>.</p>
<p><strong>Jika</strong> <strong>alasan</strong> bisnis (<strong>daya beli</strong> beda!): <strong>dokumentasikan</strong>! (<strong>Bukan</strong> diskriminasi <strong>ilegal</strong> jika <strong>alasan</strong> sah!).</p>
</details>
<p><strong>Soal 3 — Chart.</strong> Data: 50, 51, 52. Buat <strong>2</strong> chart (menipu &amp; jujur!). <strong>Bedanya</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Menipu:</strong> sumbu 49–53. <strong>Terlihat:</strong> <strong>naik</strong> drastis!</p>
<p><strong>Jujur:</strong> sumbu 0–55. <strong>Terlihat:</strong> <strong>naik</strong> 4% (kecil!).</p>
<p><strong>Pelajaran:</strong> <strong>pilih</strong> jujur. <strong>Selalu</strong>.</p>
</details>
<p><strong>Soal 4 — Dilema.</strong> Bos minta <strong>&ldquo;percantik&rdquo;</strong> chart. <strong>Apa</strong> yang kamu lakukan?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Tolak</strong> (<strong>sopan</strong>!). <strong>Alasan:</strong> &ldquo;<strong>Kepercayaan</strong> = <strong>aset</strong> saya. <strong>Sekali</strong> ketahuan = <strong>hilang</strong>. <strong>Mari</strong> cari <strong>cerita jujur</strong> yang <strong>menarik</strong>.&rdquo;</p>
<p><strong>Alternatif:</strong> <strong>highlight</strong> yang <strong>benar-benar</strong> bagus (<strong>bukan</strong> menipu!). <strong>Integritas</strong> &gt; <strong>kagum</strong> sesaat.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga prinsip etika: (1) <em>izin</em> dulu (PDP!); (2) <em>adil</em> untuk semua (fairness!); (3) <em>jujur</em> dalam cerita (no manipulasi!). Tiga prinsip = analis yang dipercaya.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Penawaran baik: mayoritas 40%, minoritas 18%. DI ratio dan artinya?"}
  options={
    ["0,45 — red flag (&lt; 0,8)",
    "2,2 — aman",
    "0,8 — pas",
    "Tidak bisa dihitung"]
  }
  correct={0}
  explanation={"Benar: 18/40 = 0,45 &lt; 0,8 → bukti awal disparate impact. 'Tidak berniat' bukan pembelaan — yang dinilai dampak."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Dataset 'anonim' (nama dihapus) punya 1 orang dengan (kodepos, umur, gender) unik. Status?"}
  options={
    ["Aman — tanpa nama",
    "Teridentifikasi (k=1) — butuh generalisasi/supresi",
    "Cukup hapus kodepos",
    "Tidak masalah"]
  }
  correct={1}
  explanation={"Benar: k=1 = unik = teridentifikasi. Penelitian: 3 quasi-identifier cukup untuk 87% populasi. 'Anonim' harus dibuktikan (k≥5), bukan diasumsikan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Tim ingin pakai data newsletter untuk custom audience iklan. Syarat?"}
  options={
    ["Langsung pakai — kan data sendiri",
    "Cek consent: jika tak mencakup iklan tertarget → re-consent",
    "Cukup opt-out",
    "Tidak ada syarat"]
  }
  correct={1}
  explanation={"Benar: purpose limitation — consent newsletter ≠ consent iklan. Re-consent memberi 120rb yang sah & engaged (malah convert lebih baik)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Struktur presentasi analis yang dieksekusi?"}
  options={
    ["Metodologi dulu, 20 chart",
    "Kesimpulan dulu (pyramid) + what–so what–now what",
    "Data mentah saja",
    "Tanpa rekomendasi"]
  }
  correct={1}
  explanation={"Benar: direksi memutuskan dari kesimpulan, bukan metodologi. 'Hentikan scale — perbaiki onboarding dulu' + 3 aksi &gt; 12 chart tanpa pesan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Fitur 'kode pos' berkorelasi kuat dengan etnis. Tindakan?"}
  options={
    ["Tetap pakai — kan netral",
    "Audit: uji proxy, hapus/batasi, atau samakan perlakuan",
    "Sembunyikan dari laporan",
    "Tambah bobotnya"]
  }
  correct={1}
  explanation={"Benar: proxy discrimination = diskriminasi via perantara. 'Netral' di nama ≠ netral di dampak. Ukur, mitigasi, dokumentasikan."}
/>

      <h2 id="bukusaku">📜 Buku Saku Etika Analis Data</h2>
<p><strong>Etika</strong> = <strong>kompas</strong> analis. <strong>Buku saku</strong> lengkap: <strong>prinsip</strong>, <strong>kasus</strong>, <strong>keputusan</strong>.</p>
<h3>Prinsip 1: Jangan Merugikan (Non-maleficence!)</h3>
<p><strong>Artinya:</strong> <strong>analisis</strong> tidak boleh <strong>merugikan</strong> individu atau <strong>masyarakat</strong>. <strong>Contoh:</strong> <strong>jangan</strong> buat model yang <strong>mendiskriminasi</strong>! <strong>jangan</strong> <strong>bocorkan</strong> data pribadi!</p>
<p><strong>Uji:</strong> &ldquo;Jika <strong>hasil</strong> ini <strong>dipublikasikan</strong>, apakah ada yang <strong>dirugikan</strong>?&rdquo; <strong>Jika</strong> ya → <strong>jangan</strong>!</p>
<p><strong>Kasus:</strong> Model <strong>prediksi</strong> kehamilan (Target!). <strong>Merugikan?</strong> <strong>Ya</strong> (privasi!). <strong>Solusi:</strong> <strong>jangan</strong> kirim <strong>iklan</strong> bayi ke <strong>remaja</strong>!</p>
<h3>Prinsip 2: Berbuat Baik (Beneficence!)</h3>
<p><strong>Artinya:</strong> <strong>analisis</strong> harus <strong>bermanfaat</strong>. <strong>Contoh:</strong> <strong>deteksi</strong> fraud (<strong>lindungi</strong> nasabah!). <strong>personalisasi</strong> (<strong>bantu</strong> temukan yang <strong>dibutuhkan</strong>!).</p>
<p><strong>Uji:</strong> &ldquo;Siapa yang <strong>diuntungkan</strong>? Apakah <strong>sepadan</strong> dengan <strong>risiko</strong>?&rdquo;</p>
<h3>Prinsip 3: Otonomi (Hormati Pilihan!)</h3>
<p><strong>Artinya:</strong> <strong>individu</strong> berhak <strong>memilih</strong>. <strong>Contoh:</strong> <strong>opt-in</strong> (bukan <strong>opt-out</strong>!). <strong>jelaskan</strong> (bukan <strong>sembunyikan</strong>!). <strong>izinkan</strong> tarik (bukan <strong>jebak</strong>!).</p>
<p><strong>Uji:</strong> &ldquo;Apakah <strong>mereka</strong> tahu? Apakah <strong>mereka</strong> setuju? Bisakah <strong>mereka</strong> berhenti?&rdquo;</p>
<p><strong>Kasus:</strong> <strong>Dark patterns</strong> (<strong>tombol</strong> &ldquo;batal&rdquo; <strong>disembunyikan</strong>!). <strong>Melanggar?</strong> <strong>Ya</strong> (otonomi!). <strong>Solusi:</strong> <strong>permudah</strong> berhenti!</p>
<h3>Prinsip 4: Keadilan (Fairness!)</h3>
<p><strong>Artinya:</strong> <strong>jangan</strong> diskriminasi. <strong>Contoh:</strong> <strong>audit</strong> model per <strong>grup</strong>! <strong>perbaiki</strong> bias!</p>
<p><strong>Uji:</strong> &ldquo;Apakah <strong>hasil</strong> sama untuk <strong>semua</strong> grup? Jika <strong>tidak</strong>, apakah <strong>alasannya</strong> sah?&rdquo;</p>
<h3>Prinsip 5: Transparansi</h3>
<p><strong>Artinya:</strong> <strong>jujur</strong> tentang <strong>metode</strong> &amp; <strong>keterbatasan</strong>. <strong>Contoh:</strong> <strong>akui</strong> jika <strong>data</strong> bias! <strong>tunjukkan</strong> interval!</p>
<p><strong>Uji:</strong> &ldquo;Bisakah <strong>saya</strong> jelaskan ini ke <strong>nenek</strong> saya? Apakah <strong>saya</strong> <strong>nyaman</strong> jika <strong>diaudit</strong>?&rdquo;</p>
<h3>Prinsip 6: Akuntabilitas</h3>
<p><strong>Artinya:</strong> <strong>bertanggung jawab</strong>. <strong>Contoh:</strong> <strong>dokumentasikan</strong> keputusan! <strong>siap</strong> dijelaskan!</p>
<p><strong>Uji:</strong> &ldquo;Jika <strong>salah</strong>, siapa yang <strong>bertanggung jawab</strong>? Apakah <strong>saya</strong> siap?&rdquo;</p>
<details className="worked">
<summary>📐 Studi kasus: 6 prinsip (klik untuk buka)</summary>
<p><strong>Kasus:</strong> Model <strong>targeting</strong> pinjaman.</p>
<p><strong>Non-maleficence:</strong> <strong>Jangan</strong> tolak <strong>berdasarkan</strong> ras! (<strong>Audit</strong>!).</p>
<p><strong>Beneficence:</strong> <strong>Bantu</strong> yang <strong>layak</strong> dapat <strong>akses</strong>!</p>
<p><strong>Otonomi:</strong> <strong>Jelaskan</strong> mengapa <strong>ditolak</strong>! (<strong>Hak</strong>!).</p>
<p><strong>Fairness:</strong> <strong>Hasil</strong> sama antar <strong>grup</strong>!</p>
<p><strong>Transparansi:</strong> <strong>Dokumentasikan</strong> model!</p>
<p><strong>Akuntabilitas:</strong> <strong>Siap</strong> diaudit <strong>OJK</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>6</strong> prinsip = <strong>checklist</strong>. <strong>Lolos</strong> semua = <strong>aman</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 <em>Enam prinsip</em> = <em>kompas</em>. <em>Hafalkan</em>! <em>Terapkan</em>!</strong></p>
</div>

      <h2 id="kisahdilema">📖 Kisah Nyata: Dilema Etika Sang Analis</h2>
<p>Di sebuah perusahaan fintech di Jakarta, ada seorang analis data muda bernama Andi. Ia sangat pintar dan ambisius. Suatu hari, atasannya, Pak Budi, memanggilnya ke ruangan. &ldquo;Andi, saya punya tugas khusus untukmu,&rdquo; katanya dengan nada serius. &ldquo;Kita ingin meningkatkan penjualan produk pinjaman. Bisakah kamu membuat model yang memprediksi siapa yang paling mungkin mengambil pinjaman?&rdquo;</p>
<p>Andi mengangguk antusias. Ini adalah proyek yang menarik! Ia segera mulai bekerja. Ia mengumpulkan data: riwayat transaksi, usia, pekerjaan, lokasi, bahkan data dari media sosial! Ia membangun model machine learning yang sangat akurat — AUC 0,85!</p>
<p>Namun, saat ia menganalisis hasil model, ia menemukan sesuatu yang mengganggu. Model tersebut secara sistematis memberikan skor rendah kepada perempuan dan kepada orang dari daerah tertentu. Bukan karena mereka tidak layak, tetapi karena data historis menunjukkan bias!</p>
<p>Andi bingung. Ia pergi ke Pak Budi. &ldquo;Pak, modelnya akurat, tetapi tidak adil. Ia mendiskriminasi perempuan dan orang dari daerah X.&rdquo; Pak Budi mengangkat bahu. &ldquo;Tapi akurat, kan? Yang penting bisnis jalan. Jangan terlalu idealis.&rdquo;</p>
<p>Andi tidak bisa tidur malam itu. Ia memikirkan prinsip fairness dari MK18. Ia tahu bahwa menggunakan model yang diskriminatif adalah salah, bahkan jika &ldquo;akurat&rdquo;. Ia juga memikirkan UU PDP — apakah pengumpulan data media sosial sudah mendapatkan consent yang benar?</p>
<p>Keesokan harinya, Andi kembali ke Pak Budi dengan proposal. &ldquo;Pak, saya bisa memperbaiki modelnya. Saya akan menghapus fitur yang menjadi proxy untuk gender dan daerah. Akurasinya akan turun sedikit, dari 0,85 ke 0,83, tetapi akan adil.&rdquo;</p>
<p>Pak Budi mengerutkan kening. &ldquo;Dua persen? Itu berarti kita kehilangan potensi revenue!&rdquo; Andi menjawab dengan tenang. &ldquo;Pak, jika kita ketahuan mendiskriminasi, dendanya bisa 2% dari revenue perusahaan. Itu jauh lebih besar dari 2% akurasi. Dan reputasi kita akan hancur.&rdquo;</p>
<p>Pak Budi terdiam. Ia tidak memikirkan risiko hukum. &ldquo;Baiklah,&rdquo; katanya akhirnya. &ldquo;Perbaiki modelnya. Tapi pastikan tetap profitable.&rdquo;</p>
<p>Andi memperbaiki model. Ia menghapus kode pos (proxy untuk daerah!), ia melakukan reweighting untuk menyeimbangkan gender, ia memastikan bahwa data yang digunakan sudah mendapatkan consent yang benar. Hasilnya: akurasi 0,83 (turun sedikit!), tetapi fairness meningkat drastis. Tingkat persetujuan untuk perempuan naik dari 15% menjadi 28% (mendekati 30% untuk laki-laki!).</p>
<p>Namun, masalah belum selesai. Beberapa minggu kemudian, tim marketing meminta Andi untuk &ldquo;mempercantik&rdquo; chart untuk presentasi ke direksi. &ldquo;Buat yang menunjukkan peningkatan yang dramatis,&rdquo; kata mereka. &ldquo;Potong sumbunya biar terlihat besar!&rdquo;</p>
<p>Andi menolak. &ldquo;Itu menipu,&rdquo; katanya. &ldquo;Saya tidak akan melakukannya.&rdquo; Tim marketing marah. &ldquo;Kamu terlalu kaku! Semua orang melakukannya!&rdquo;</p>
<p>Andi tetap pada pendiriannya. Ia membuat chart yang jujur, dengan sumbu dari nol. Peningkatannya terlihat kecil (hanya 5%!), tetapi itu adalah kebenaran. Saat presentasi, direksi awalnya kecewa melihat angka yang kecil. Tetapi CFO, Ibu Ratna, justru terkesan. &ldquo;Saya suka analis yang jujur,&rdquo; katanya. &ldquo;Angka kecil yang benar lebih baik dari angka besar yang menipu.&rdquo;</p>
<p>Setahun kemudian, perusahaan diaudit oleh OJK. Banyak perusahaan fintech lain kena denda karena model diskriminatif dan pelanggaran PDP. Tetapi perusahaan Andi lolos dengan bersih, karena Andi sudah memastikan semuanya sesuai aturan sejak awal.</p>
<p>Pak Budi memanggil Andi. &ldquo;Terima kasih,&rdquo; katanya. &ldquo;Kamu menyelamatkan perusahaan dari denda miliaran rupiah. Dan kamu benar tentang chart itu — kejujuran membangun kepercayaan.&rdquo;</p>
<p>Andi dipromosikan menjadi Head of Data Ethics. Ia kini memastikan bahwa semua model di perusahaan adil, transparan, dan sesuai hukum.</p>
<div className="callout">
<p><strong>What:</strong> Model diskriminatif → diperbaiki (adil!). Chart menipu → ditolak (jujur!). Audit OJK → lolos! Promosi!</p>
<p><strong>So what:</strong> <strong>Etika</strong> = <strong>melindungi</strong> bisnis. <strong>Kejujuran</strong> = <strong>investasi</strong> karier.</p>
<p><strong>Now what:</strong> (1) <strong>Audit</strong> fairness! (2) <strong>Tolak</strong> manipulasi! (3) <strong>Patuhi</strong> hukum! (4) <strong>Bangun</strong> kepercayaan!</p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-audit">📊 Studi Kasus: &ldquo;PinjamanKu&rdquo; — Audit Fairness yang Menggagalkan Launching</h2>
<p><em>PinjamanKu</em> (nama disamarkan): fintech lending, 2 juta pendaftar/tahun. Tim data membangun model skor kredit ML (AUC 0,81 — &ldquo;bagus!&rdquo;). Sehari sebelum launching, compliance meminta <strong>audit fairness</strong>. Hasilnya menghentikan segalanya — dan menyelamatkan perusahaan dari bencana.</p>
<h3>Temuan 1 — Disparate impact tersembunyi</h3>
<p>Aturan praktis (EEOC 80% rule): tingkat persetujuan kelompok minoritas ≥ 80% dari kelompok mayoritas. Hasil audit:</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Kelompok (proxy: kode pos)</th><th>Tingkat persetujuan</th><th>Rasio vs tertinggi</th></tr></thead>
<tbody>
<tr><td>Kode pos A (perkotaan maju)</td><td>62%</td><td>100%</td></tr>
<tr><td>Kode pos B (campuran)</td><td>51%</td><td>82% ✓</td></tr>
<tr><td>Kode pos C (daerah tertinggal)</td><td>38%</td><td><strong>61% ✗</strong></td></tr>
</tbody>
</table>
</div>
<p>Model tidak memakai &ldquo;suku&rdquo; atau &ldquo;agama&rdquo; — tapi memakai <strong>kode pos, jenis HP, dan jam aktif</strong>, yang <strong>berkorelasi</strong> dengan kelompok rentan. Inilah <strong>diskriminasi via proxy</strong>: niatnya netral, hasilnya tidak. &ldquo;Kami tidak input SARA&rdquo; <strong>bukan</strong> pembelaan — yang diukur adalah <em>dampak</em>, bukan <em>niat</em>.</p>
<h3>Temuan 2 — Akurasi yang menutupi ketidakadilan</h3>
<p>AUC 0,81 global. Per kelompok: A = 0,84, B = 0,80, <strong>C = 0,68</strong> — model <strong>lebih buruk</strong> memprediksi kelompok C (data historis mereka lebih sedikit &amp; berisik). Akibat ganda: ditolak lebih sering <strong>dan</strong> penilaiannya lebih ngawur. &ldquo;Akurasi tinggi&rdquo; yang dilaporkan = rata-rata yang didominasi kelompok mayoritas.</p>
<h3>Perbaikan (6 minggu)</h3>
<ul>
<li><strong>Buang proxy berisiko:</strong> kode pos &amp; jenis HP dikeluarkan; diganti fitur perilaku keuangan langsung (riwayat transaksi, rasio cicilan).</li>
<li><strong>Threshold per kelompok yang dikalibrasi:</strong> bukan &ldquo;skor 600 untuk semua&rdquo;, melainkan threshold yang menyamakan <strong>false negative rate</strong> (jangan sampai kelompok C lebih sering ditolak padahal layak).</li>
<li><strong>Human-in-the-loop untuk penolakan:</strong> 10% skor borderline → review manual. Mahal, tapi untuk keputusan yang mengubah hidup orang, otomatisasi penuh = tidak bertanggung jawab.</li>
<li><strong>Monitoring bulanan:</strong> disparate impact dihitung tiap bulan; alarm jika rasio &lt; 80%.</li>
</ul>
<p><strong>Hasil:</strong> AUC turun 0,81 → 0,79 (sedikit). Disparate impact: 61% → <strong>88%</strong> ✓. NPL (kredit macet) <strong>tidak naik</strong> — karena fitur pengganti ternyata sama prediktifnya tanpa biasnya. <strong>Pelajaran mahal:</strong> fairness dan akurasi <strong>bukan</strong> trade-off abadi — sering, bias justru menutupi fitur yang lebih baik.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Model itu objektif karena matematika tidak punya prasangka.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Model mewarisi prasangka <strong>data historisnya</strong> (siapa yang dulu disetujui?) dan <strong>pilihan fiturnya</strong> (proxy apa yang dipakai?). Objektivitas bukan sifat bawaan model — ia <strong>hasil audit</strong>. Model yang tidak diaudit = prasangka yang diotomasi.</p>
</div>

      <h2 id="tambahan-pdp">📜 Pendalaman: UU PDP untuk Analis Marketing — Yang Praktis, Bukan Teoritis</h2>
<p>UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP) berlaku penuh. Ini <strong>bukan</strong> kuliah hukum — ini checklist operasional untuk analis marketing: apa yang harus berubah dalam kerja harianmu.</p>
<h3>1. Dasar pemrosesan: consent bukan satu-satunya, tapi yang paling relevan</h3>
<p>UU PDP mengenal beberapa dasar hukum (kontrak, kewajiban hukum, kepentingan sah, dll.). Untuk <strong>marketing</strong>: kirim promo, profiling untuk targeting, share data ke platform iklan — dasarnya hampir selalu <strong>persetujuan (consent)</strong>. Syarat consent yang sah: <strong>spesifik</strong> (&ldquo;untuk promo via WhatsApp&rdquo; — bukan &ldquo;untuk segala keperluan&rdquo;), <strong>terinformasi</strong> (jelas, bukan paragraf 50), <strong>dapat ditarik</strong> kapan pun semudah memberikannya. <strong>Pre-ticked checkbox = tidak sah.</strong></p>
<h3>2. Hak subjek data yang memengaruhi pipeline-mu</h3>
<ul>
<li><strong>Hak hapus:</strong> pelanggan minta data dihapus → kamu harus bisa menghapus dari <strong>semua</strong> sistem (warehouse, CDP, platform iklan, backup). Jika datamu tersebar tanpa katalog — kamu tidak bisa comply. <strong>Data catalog = syarat comply.</strong></li>
<li><strong>Hak akses/portabilitas:</strong> &ldquo;data apa yang kalian punya tentang saya?&rdquo; — harus bisa dijawab dalam waktu wajar.</li>
<li><strong>Menarik consent:</strong> unsubscribe harus <strong>1 klik</strong>, berlaku maksimal hitungan hari — bukan &ldquo;kirim email ke cs@...&rdquo; lalu menunggu 14 hari.</li>
</ul>
<h3>3. Profiling &amp; keputusan otomatis: zona merah</h3>
<p>UU PDP memberi perhatian khusus pada <strong>pengambilan keputusan otomatis</strong> yang berdampak hukum/signifikan (skor kredit, penolakan layanan). Untuk marketing: <strong>segmentasi iklan biasa</strong> = risiko rendah; <strong>scoring yang menentukan siapa dapat penawaran</strong> = risiko sedang-tinggi → sediakan <strong>jalur review manusia</strong> dan <strong>penjelasan</strong> (&ldquo;kenapa saya tidak dapat promo ini?&rdquo; harus bisa dijawab, bukan &ldquo;algoritma berkata begitu&rdquo;).</p>
<h3>4. Sanksi: kenapa ini bukan &ldquo;nanti saja&rdquo;</h3>
<p>Sanksi administratif: peringatan, penghentian pemrosesan, <strong>denda hingga 2% pendapatan tahunan</strong>. Plus sanksi pidana untuk pelanggaran berat. Tapi risiko terbesar bagi kebanyakan perusahaan bukan denda — melainkan <strong>reputasi</strong> (&ldquo;data 2 juta pelanggan bocor&rdquo; = headline) dan <strong>kehilangan kepercayaan</strong> yang butuh bertahun-tahun dibangun. Budget compliance Rp200 juta/tahun vs 1 insiden = <strong>tidak sebanding</strong>.</p>
<div className="callout">
<h3>🧭 Checklist UU PDP untuk analis (tempel di meja)</h3>
<ol><li>Setiap data pribadi yang kuproses: <strong>consent-nya tercatat?</strong> (kapan, untuk apa, bisa dibuktikan?)</li><li>Bisa kuhapus <strong>1 orang dari semua sistem</strong> dalam 30 hari? (tidak → bangun data catalog)</li><li>Unsubscribe/opt-out: <strong>1 klik</strong>? (tidak → perbaiki sekarang)</li><li>Data yang dishare ke platform iklan (Meta/Google): <strong>ada consent-nya?</strong> (CAPI + custom audience = transfer data!)</li><li>Retention: ada <strong>jadwal hapus</strong>? (data 2019 masih ada &ldquo;buat jaga-jaga&rdquo; = pelanggaran)</li><li>Anak di bawah umur: ada <strong>verifikasi &amp; consent orang tua</strong>? (zona merah khusus)</li></ol>
</div>
<div className="tip">
<p><strong>💡 Intuisi: UU PDP bukan &ldquo;hambatan marketing&rdquo; — ia <em>filter kualitas</em>. Perusahaan yang hanya bisa marketing via spam &amp; data gelap memang <em>seharusnya</em> kesulitan. Yang punya consent jelas, data rapi, dan targeting jujur justru <strong>diuntungkan</strong>: kepercayaan = konversi.</strong></p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Etika Analitik</h2>
<h3>1. &ldquo;Data anonim — masih perlu consent?&rdquo;</h3>
<p><strong>Tergantung seberapa anonim.</strong> Anonimisasi sejati (tidak bisa diidentifikasi ulang dengan cara apa pun yang wajar) = bukan data pribadi lagi. Tapi <strong>pseudonimisasi</strong> (user_id acak yang <em>bisa</em> dihubungkan kembali) = <strong>tetap data pribadi</strong> menurut UU PDP. Dan &ldquo;anonim&rdquo; yang ternyata bisa di-de-anonimkan (riset menunjukkan 4 titik lokasi-waktu cukup mengidentifikasi 95% orang!) = bom waktu. Aturan: jika ragu, perlakukan sebagai data pribadi.</p>
<h3>2. &ldquo;Bolehkah beli database nomor HP untuk blast promo?&rdquo;</h3>
<p><strong>Tidak.</strong> UU PDP: pemrosesan butuh dasar hukum — &ldquo;beli dari broker&rdquo; bukan dasar hukum, dan consent yang diberikan ke pihak lain <strong>tidak otomatis</strong> berlaku untukmu. Plus UU ITE &amp; aturan BRTI soal spam. Praktik ini = <strong>pelanggaran berlapis</strong> dengan denda nyata. Bangun list sendiri (lead magnet, event, program loyalitas) — lambat tapi sah &amp; konversinya justru lebih tinggi.</p>
<h3>3. &ldquo;Modelku bias — apakah harus dimatikan?&rdquo;</h3>
<p><strong>Tidak selalu — tapi harus diungkap &amp; dimitigasi.</strong> Hierarki respons: (a) <strong>ukur</strong> dulu (berapa besar disparitasnya?); (b) <strong>perbaiki</strong> (buang proxy, kalibrasi threshold, tambah data kelompok minoritas); (c) jika tidak bisa diperbaiki memadai → <strong>batasi scope</strong> (human-in-the-loop) atau <strong>matikan</strong>. Yang tidak boleh: tahu bias tapi diam karena &ldquo;angkanya bagus&rdquo;. Itu bukan keputusan teknis — itu <strong>keputusan moral</strong> yang akan ditagih.</p>
<h3>4. &ldquo;Storytelling — di mana batas antara &lsquo;menyederhanakan&rsquo; dan &lsquo;menyesatkan&rsquo;?&rdquo;</h3>
<p><strong>Uji tiga hal:</strong> (a) <strong>sumbu tidak dipotong</strong> menipu (grafik batang mulai dari 0 kecuali ada alasan kuat &amp; dinyatakan); (b) <strong>cherry-picking</strong> — menampilkan 1 segmen yang mendukung narasi sambil menyembunyikan 3 yang tidak; (c) <strong>korelasi disajikan sebagai kausalitas</strong> tanpa disclaimer. Aturan praktis: &ldquo;apakah kesimpulan audiens akan <em>berbeda</em> jika mereka melihat data lengkapnya?&rdquo; Jika ya — kamu menyesatkan, seberapa pun indahnya slidenya.</p>
<h3>5. &ldquo;Atasan memintaku &lsquo;mempercantik&rsquo; angka. Bagaimana?&rdquo;</h3>
<p><strong>Jangan — dan dokumentasikan.</strong> Tawarkan alternatif jujur: &ldquo;Saya tidak bisa mengubah angkanya, tapi saya bisa bantu menjelaskan <em>konteksnya</em> (&lsquo;turun 5% tapi di atas rata-rata industri 12%&rsquo;).&rdquo; Jika dipaksa: minta <strong>instruksi tertulis</strong> (email) — 90% permintaan tidak etis mati saat harus ditulis. Jika tetap dipaksa: itu <strong>whistleblowing situation</strong> — lindungi dirimu (simpan bukti di luar kantor), konsultasi ke compliance/hukum. Karier yang dibangun di atas angka palsu = <strong>bom waktu pribadi</strong>.</p>
<h3>6. &ldquo;Dark pattern di UX (tombol &lsquo;terima semua&rsquo; besar, &lsquo;tolak&rsquo; kecil) — masalah analis?&rdquo;</h3>
<p><strong>Ya, masalahmu juga.</strong> Consent yang didapat via dark pattern = <strong>tidak sah</strong> (tidak bebas &amp; terinformasi) → seluruh pemrosesan di atasnya = <strong>ilegal</strong> → analis yang memakai datanya ikut bermasalah. Plus: data dari consent paksa = <strong>bias</strong> (yang &ldquo;setuju&rdquo; = yang menyerah, bukan yang mau). Suarakan ke tim produk: consent yang jujur = data yang <strong>lebih bersih &amp; lebih sah</strong>.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: etika analitik bukan &ldquo;pelajaran moral&rdquo; — ia <em>manajemen risiko</em> + <em>kualitas data</em>. Praktik tidak etis hampir selalu menghasilkan data yang lebih buruk (consent paksa = bias, angka dipercantik = keputusan salah) DAN risiko hukum. Berbuat benar = strategi yang menguntungkan, bukan pengorbanan.</strong></p>
</div>

            <h2 id="tambahan-kasus2">📊 Studi Kasus: Iklan yang &ldquo;Terlalu Tepat&rdquo; — Ketika Targeting Menjadi Manipulasi</h2>
<p><em>SehatQita</em> (nama disamarkan): platform produk kesehatan. Tim growth menemukan segmen <strong>super-responsif</strong>: pengguna yang baru mencari &ldquo;gejala penyakit X&rdquo; di malam hari (cemas, rentan) → CTR iklan suplemen 4x lipat, conversion 3x lipat. ROAS fantastis. Lalu seorang analis bertanya di rapat: <strong>&ldquo;Kita menolong orang cemas — atau mengeksploitasinya?&rdquo;</strong> Ruangan hening.</p>
<h3>Anatomi dilema: tiga lapis masalah</h3>
<p><strong>Lapis 1 — Kerentanan (vulnerability).</strong> Targeting orang yang <strong>takut sakit di tengah malam</strong> = menargetkan kondisi psikologis, bukan kebutuhan rasional. Beda dengan targeting &ldquo;ibu-ibu yang suka masak&rdquo; (preferensi netral). <strong>Uji:</strong> &ldquo;apakah targetku sedang dalam kondisi <em>tidak bisa berpikir jernih</em>?&rdquo; Jika ya — kamu di zona eksploitasi, bukan persuasi.</p>
<p><strong>Lapis 2 — Klaim yang tidak bisa diverifikasi pembeli.</strong> Iklan bilang &ldquo;membantu daya tahan tubuh&rdquo; — klaim <strong>ambigu</strong> yang tidak bisa dibuktikan salah oleh pembeli cemas. Kombinasi <em>audience rentan</em> + <em>klaim tak terverifikasi</em> = resep penipuan, bahkan jika produknya &ldquo;lumayan&rdquo;. Bandingkan: iklan sepatu &ldquo;nyaman dipakai lari&rdquo; — pembeli bisa verifikasi dalam 1 minggu.</p>
<p><strong>Lapis 3 — Skala &amp; presisi yang baru.</strong> &ldquo;Dulu juga ada iklan obat di TV&rdquo; — benar, tapi TV tidak tahu <em>kamu baru saja panik mencari gejala jam 2 pagi</em>. <strong>Presisi = kekuasaan</strong>, dan kekuasaan atas orang rentan menuntut <strong>standar lebih tinggi</strong>, bukan sama. Analogi: pisau dapur vs pisau bedah — alat yang lebih presisi butuh lisensi lebih ketat.</p>
<h3>Keputusan perusahaan: framework 3 pertanyaan</h3>
<p>SehatQita tidak menutup targeting — mereka memasang <strong>filter etika</strong> yang kini dipakai semua kampanye:</p>
<div className="callout">
<ol><li><strong>Uji kerentanan:</strong> apakah segmen ini sedang takut/sakit/berduka/terdesak finansial? Jika ya → <strong>wajib</strong> review etik + batasi frekuensi (maks 2x/minggu) + larangan klaim absolut (&ldquo;menyembuhkan&rdquo;, &ldquo;dijamin&rdquo;).</li><li><strong>Uji verifikasi:</strong> bisakah pembeli <em>sendiri</em> menilai klaim kita dalam waktu wajar? Jika tidak → klaim harus <strong>konservatif &amp; bersumber</strong> (studi, bukan testimoni).</li><li><strong>Uji koran + keluarga:</strong> &ldquo;berani tidak strategi ini dijelaskan ke ibumu — dan ibumu tetap bangga?&rdquo; Jika ada rasa tidak nyaman → jangan.</li></ol>
</div>
<h3>Hasil bisnis (yang mengejutkan skeptis)</h3>
<p>Segmen &ldquo;cemas malam hari&rdquo; <strong>dihentikan</strong> (diganti targeting &ldquo;pencari info kesehatan umum&rdquo; di jam normal). Prediksi tim growth: revenue -15%. Realita 6 bulan:</p>
<ul>
<li>Revenue segmen: <strong>-8%</strong> (lebih kecil dari prediksi — ternyata banyak pembeli &ldquo;cemas&rdquo; yang convert = <strong>buyer&rsquo;s remorse</strong> → refund &amp; chargeback tinggi!).</li>
<li>Refund rate: 11% → <strong>4%</strong>. Net revenue <strong>naik 3%</strong>.</li>
<li>Rating Play Store: 3,9 → <strong>4,5</strong> (ulasan &ldquo;ketipu iklan&rdquo; hilang).</li>
<li>Bonus: tim CS melaporkan <strong>penurunan 60%</strong> komplain &ldquo;produk tidak seperti iklannya&rdquo;.</li>
</ul>
<p><strong>Pelajaran:</strong> eksploitasi kerentanan terlihat menguntungkan di <strong>dashboard conversion</strong> — tapi merugi di <strong>neraca lengkap</strong> (refund, reputasi, CS cost, risiko hukum). Perusahaan yang menghitung <em>semua</em> biaya menemukan: <strong>etika = profitabilitas jangka panjang</strong>.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Selama legal &amp; conversion naik, targeting apa pun boleh.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Legal = <strong>batas bawah</strong>, bukan standar. &ldquo;Boleh secara hukum&rdquo; tidak menjawab &ldquo;apakah ini eksploitasi?&rdquo; — dan pasar menghukum eksploitasi lewat mekanisme yang tidak ada di dashboard: refund, ulasan bintang 1, dan <strong>kehilangan kepercayaan yang tidak bisa dibeli kembali dengan iklan</strong>.</p>
</div>
<div className="tip">
<p><strong>💡 Framework 3 pertanyaan SehatQita (kerentanan → verifikasi → koran) = alat paling praktis dari lesson ini. Tempel di dinding tim growth-mu. Setiap kampanye baru lewat 3 pertanyaan itu dalam 5 menit — yang gagal, diperbaiki atau dibatalkan. Etika yang tidak dioperasionalkan = dekorasi.</strong></p>
</div>

            <h2 id="tambahan-simulasi">💬 Simulasi Rapat: Menolak Permintaan Tidak Etis — Tanpa Kehilangan Pekerjaan</h2>
<p>Etika paling sulit bukan saat soalnya jelas-jahat — melainkan saat <strong>atasan yang kamu hormati</strong> meminta hal yang <strong>abu-abu</strong>, dengan <strong>deadline besok</strong>. Simulasi ini melatih kalimat-kalimatnya — karena di momen nyata, kamu tidak punya waktu menyusun argumen.</p>
<div className="story">
<p><strong>Situasi:</strong> Head of Growth memintamu &ldquo;mempercantik&rdquo; laporan campaign: &ldquo;Angka churn-nya <em>sesuaikan</em> dikit lah — direksi mau lihat 5%, bukan 9%. Kan definisinya bisa diatur.&rdquo; Kamu tahu: definisi churn sudah disepakati &amp; diaudit. Mengubahnya = memalsukan.</p>
<p><strong>❌ Respons yang gagal:</strong> &ldquo;Itu tidak etis, saya menolak!&rdquo; (benar secara moral, bunuh diri secara karier — kamu dicap &ldquo;susah diatur&rdquo;).</p>
<p><strong>❌ Respons yang gagal juga:</strong> &ldquo;Ya, Pak.&rdquo; (kamu baru saja menjadi pemalsu data — dan sekarang ia punya leverage atasmu selamanya).</p>
<p><strong>✅ Respons berlapis:</strong></p>
<p><strong>Lapis 1 — Tawarkan jalan jujur:</strong> &ldquo;Saya tidak bisa mengubah definisinya, Pak — itu sudah diaudit. Tapi saya bisa bantu <em>menjelaskan konteksnya</em>: churn 9% ini termasuk segmen promo-hunter yang memang kita rencanakan untuk lepas. Kalau kita tampilkan churn <em>organik</em> (pelanggan reguler), angkanya 4,2% — dan itu cerita yang <em>lebih kuat</em> untuk direksi.&rdquo; (Kamu menolak <em>cara</em>, menawarkan <em>hasil</em> yang lebih baik.)</p>
<p><strong>Lapis 2 — Jika didesak (&ldquo;pokoknya ubah!&rdquo;):</strong> &ldquo;Baik, Pak — boleh saya minta instruksinya via email? Saya perlu catatan tertulis untuk perubahan definisi metrik yang sudah diaudit, supaya tim audit tidak mempertanyakan.&rdquo; (90% permintaan abu-abu <strong>mati di sini</strong> — orang berani meminta lisan, takut menulis.)</p>
<p><strong>Lapis 3 — Jika tetap dipaksa tertulis:</strong> lakukan <strong>dengan catatan kaki jujur</strong> di laporan (&ldquo;definisi diubah atas instruksi tanggal X&rdquo;) + simpan semua bukti di luar sistem kantor + konsultasi ke compliance. Ini <strong>zona whistleblowing</strong> — lindungi dirimu dulu.</p>
</div>
<h3>Empat kalimat ajaib untuk situasi abu-abu</h3>
<ul>
<li><strong>&ldquo;Saya bisa bantu mencapai <em>tujuan</em> Bapak dengan cara yang <em>tidak merusak kepercayaan data</em> — begini alternatifnya&hellip;&rdquo;</strong> (pisahkan tujuan dari cara)</li>
<li><strong>&ldquo;Boleh saya minta tertulis? Untuk keperluan audit.&rdquo;</strong> (filter 90% permintaan bermasalah)</li>
<li><strong>&ldquo;Kalau angka ini ditanya auditor/tim lain, penjelasan resminya apa, Pak?&rdquo;</strong> (paksa konsekuensi ke permukaan)</li>
<li><strong>&ldquo;Saya khawatir ini merusak <em>kredibilitas tim kita</em> di mata direksi jika ketahuan.&rdquo;</strong> (bingkai sebagai risiko <em>mereka</em>, bukan moralitas <em>kamu</em>)</li>
</ul>
<h3>Kenapa ini penting untuk analis junior</h3>
<p>Tekanan etik <strong>paling sering</strong> menimpa analis junior (yang &ldquo;disuruh&rdquo;) bukan analis senior (yang &ldquo;memutuskan&rdquo;). Tiga pertahanan struktural: (a) <strong>definisi metrik tertulis &amp; diaudit</strong> — semakin formal definisimu, semakin sulit &ldquo;disesuaikan&rdquo;; (b) <strong>reputasi &ldquo;analis yang datanya bisa dipercaya&rdquo;</strong> — bangun sebelum krisis, pakai saat krisis; (c) <strong>mentor/aliansi</strong> — satu orang senior yang bisa kamu tanya &ldquo;ini normal tidak?&rdquo; sebelum bertindak.</p>
<div className="tip">
<p><strong>💡 Intuisi: integritas analis = <em>aset karier</em>, bukan beban moral. Analis yang sekali ketahuan memalsukan angka tidak akan pernah dipercaya lagi — oleh siapa pun, di perusahaan mana pun. Sebaliknya, analis yang terkenal &ldquo;datanya jujur walau pahit&rdquo; menjadi orang yang <em>pertama</em> ditanya saat keputusan besar. Pilih reputasi yang mana?</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>UU PDP</strong>: consent spesifik, purpose limitation, minimisasi, hak subjek (akses/koreksi/hapus/tarik).</li>
<li><strong>Proxy discrimination</strong>: fitur 'netral' bisa jadi perantara atribut dilindungi — audit DI ratio (red flag &lt; 0,8).</li>
<li><strong>'Anonim' harus dibuktikan</strong>: k-anonymity ≥ 5; re-identifikasi mudah dengan 3 quasi-identifier.</li>
<li><strong>Etika = asuransi termurah</strong>: biaya kepatuhan &lt; biaya viral + denda.</li>
<li><strong>Storytelling</strong>: what → so what → now what; pyramid principle; 1 slide 1 pesan.</li>
<li><strong>Readout culture</strong>: katalog eksperimen (hipotesis/desain/hasil/keputusan) = memori organisasi.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk17-text-analytics" className="btn btn-secondary btn-sm">← MK17</Link>
        <Link href="/learn/mk19-capstone" className="btn btn-primary btn-sm">MK19 →</Link>
      </div>
    </div>
  );
}
