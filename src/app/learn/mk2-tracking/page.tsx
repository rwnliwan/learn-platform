"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk2TrackingPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK2 — Marketing Data Analytics</span>
        <h1 className="display-title">Tracking:<br/>Sampah Masuk, Sampah Keluar</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Promo 11.11 yang 'Sukses' — Menurut Data yang Salah</a></li>
<li><a href="#event">Event Schema & Taxonomy</a></li>
<li><a href="#utm">UTM, First-Party Data & Server-Side</a></li>
<li><a href="#identity">Identity Resolution & Pipeline</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Tiga Lapisan Kepercayaan Data</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Misteri ROAS 8,2</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Audit Tracking 11.11 dalam 5 Hari</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Tracking</a></li>
<li><a href="#playbook">📋 Playbook: Tracking Plan 1 Halaman</a></li>
<li><a href="#utm2">🔬 Bedah Mendalam: UTM yang Menyelamatkan Attribution</a></li>
<li><a href="#serverside">📊 Server-Side Tracking: Masa Depan</a></li>
<li><a href="#checklist">🔍 Checklist Tracking</a></li>
<li><a href="#tambahan-faq">❓ FAQ Tracking</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Kopi Nusantara 30 Hari</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Merancang event schema & taxonomy yang konsisten (naming, properties wajib, identify).</li>
<li>Memakai parameter UTM dengan disiplin dan menjelaskan kenapa 'direct/none' membengkak.</li>
<li>Menjelaskan perbedaan first-party vs third-party data dan kapan memakai server-side tracking.</li>
<li>Membedakan identity resolution deterministik vs probabilistik dan memilih yang tepat.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Promo 11.11 yang 'Sukses' — Menurut Data yang Salah</h2>
      <div className="story">
        <p>E-commerce <em>&ldquo;BelanjaYuk&rdquo;</em> merayakan promo 11.11: dashboard GA4 menunjukkan <strong>ROAS 8,2</strong> — fantastis. Budget tahun depan digeser besar-besaran ke channel yang &ldquo;menang&rdquo;. Tiga bulan kemudian, finance protes: revenue tidak naik seperti yang diklaim dashboard.</p>
<p>Twist-nya: <strong>41% traffic tercatat sebagai &ldquo;direct/none&rdquo;</strong> karena tim tidak disiplin UTM; event <em>purchase</em> dikirim dua kali (client + server) tanpa deduplikasi sehingga revenue double-count; dan &ldquo;pengguna baru&rdquo; ternyata pelanggan lama yang ganti HP (identity tidak ter-resolve). Dashboard-nya rapi. Datanya sampah. Keputusan budget Rp2 miliar diambil dari sampah itu. Lesson ini tentang fondasi yang tidak terlihat tapi menentukan segalanya.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="event">Event Schema — Bahasa yang Disepakati Semua Tim</h2>
<p><strong>Definisi.</strong> Setiap aksi pengguna direkam sebagai <strong>event</strong>: <em>siapa</em> (user_id/device_id), <em>kapan</em> (timestamp), <em>apa</em> (event_name), <em>detailnya</em> (properties). <strong>Taxonomy</strong> adalah kamus resmi: daftar event yang boleh dikirim, nama pastinya, dan properties wajib tiap event. Tanpa taxonomy, tim A kirim <code className="inline">purchase</code>, tim B kirim <code className="inline">Purchase_Success</code>, tim C kirim <code className="inline">bayar_berhasil</code> — analis yang menderita.</p>
<p>Tiga jenis panggilan standar (Segment-style): <strong>identify</strong> (siapa user ini: user_id + traits), <strong>track</strong> (aksi: <code className="inline">order_completed</code>), <strong>screen/page</strong> (halaman dilihat). Aturan penamaan: <code className="inline">snake_case</code>, kata kerja lampau (<code className="inline">order_completed</code> bukan <code className="inline">complete_order</code>), satu bahasa (pilih Inggris, konsisten).</p>
<p><strong>Kepribadian/intuisi:</strong> Taxonomy adalah <strong>kontrak</strong> antara tim produk dan tim data. Seperti kontrak API: kalau satu pihak ganti nama field diam-diam, pihak lain rusak. Review taxonomy = code review untuk data.</p>
<p><strong>Kapan dipakai:</strong> Sebelum instrumentasi fitur baru apa pun. Event tanpa taxonomy = utang data yang bunganya dibayar analis tiap minggu.</p>
<details className="worked">
<summary>📐 Contoh: Taxonomy checkout e-commerce (klik untuk buka)</summary>
<p><strong>Event:</strong> <code className="inline">checkout_started</code> — properties wajib: <code className="inline">cart_id</code>, <code className="inline">cart_value</code>, <code className="inline">currency</code>, <code className="inline">item_count</code>.</p>
<p><strong>Event:</strong> <code className="inline">order_completed</code> — properties wajib: <code className="inline">order_id</code> (unik!), <code className="inline">revenue</code>, <code className="inline">payment_method</code>, <code className="inline">coupon_code</code> (boleh null).</p>
<p><strong>Aturan:</strong> <code className="inline">order_id</code> unik dipakai untuk <strong>deduplikasi</strong> (kasus BelanjaYuk: purchase terkirim 2x). <code className="inline">revenue</code> selalu dalam satuan terkecil (sen) + <code className="inline">currency</code> — jangan campur rupiah dan dollar.</p>
</details>
<PlotlyChart
  data={[{x: ["Q1", "Q2", "Q3", "Q4"], y: [12, 18, 9, 3], name: "Event duplikat / inkonsisten (%)", type: "bar", marker: {color: ["#ef4444","#ef4444","#e8a838","#2a7de1"]}, text: ["12%","18%","9%","3%"], textposition: "outside"}]}
  title={"Event bermasalah sebelum vs sesudah taxonomy"}
  layout={{yaxis: {title: "% event bermasalah"}, xaxis: {title: "Q1-Q2: tanpa taxonomy → Q3-Q4: taxonomy + QA"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = kuartal, tinggi batang = % event yang duplikat/salah nama/salah tipe. Warna merah = parah, biru = sehat.</p>
<p><strong>Interpretasi:</strong> Setelah taxonomy + QA checklist diterapkan (Q3), event bermasalah turun dari 18% ke 3%. Pola umum: masalah tracking <strong>naik</strong> dulu saat traffic naik (Q2) kalau tidak ada governance. Governance data = investasi yang return-nya sunyi tapi besar.</p>
</div>
<h2 id="utm">UTM & First-Party — Dari Mana Orang Ini Datang?</h2>
<p><strong>Definisi.</strong> <strong>UTM</strong> adalah lima parameter di URL iklan yang memberi tahu analytics &ldquo;klik ini dari mana&rdquo;: <code className="inline">utm_source</code> (mis. google, newsletter), <code className="inline">utm_medium</code> (cpc, email, social), <code className="inline">utm_campaign</code> (nama kampanye), <code className="inline">utm_content</code> (varian kreatif), <code className="inline">utm_term</code> (keyword). Tanpa UTM yang disiplin, traffic jatuh ke bucket <strong>&ldquo;direct/none&rdquo;</strong> — kuburan atribusi.</p>
<p><strong>First-party data</strong> = data yang kamu kumpulkan sendiri dari interaksinmu (transaksi, CRM, event situs). <strong>Third-party data</strong> = data pihak lain (cookie iklan lintas situs) — sekarat karena regulasi &amp; browser (Safari/Firefox blokir, Chrome mengetatkan). <strong>Server-side tracking</strong> = event dikirim dari server-mu ke platform (mis. Meta CAPI), bukan dari browser user — lebih tahan ad-blocker &amp; cookie-killer, wajib deduplikasi dengan event browser.</p>
<p><strong>Kepribadian/intuisi:</strong> UTM adalah <strong>plat nomor</strong> tiap klik iklan. Iklan tanpa UTM = mobil tanpa plat: sampai tujuan, tapi tidak ada yang tahu dari mana. Dan &lsquo;direct/none&rsquo; yang membengkak = parkiran penuh mobil tanpa plat — di situlah budget salah alamat.</p>
<p><strong>Kapan dipakai:</strong> UTM wajib di SEMUA link kampanye (iklan, email, influencer, QR). Server-side untuk event uang (purchase, lead) — event yang kalau hilang/hilang-ganda, keputusannya salah.</p>
<details className="worked">
<summary>📐 Contoh: URL UTM yang benar vs salah (klik untuk buka)</summary>
<p><strong>Benar:</strong> <code className="inline">toko.id/promo?utm_source=instagram&amp;utm_medium=cpc&amp;utm_campaign=11_11_flash&amp;utm_content=video_30s</code> — tiap parameter terisi, konsisten lowercase, campaign bisa diagregasi.</p>
<p><strong>Salah:</strong> <code className="inline">toko.id/promo?utm_source=IG&amp;utm_medium=CPC&amp;utm_campaign=Promo11.11!!</code> — &lsquo;IG&rsquo; vs &lsquo;instagram&rsquo; pecah jadi dua source; spasi/tanda seru merusak parsing. <strong>Salah fatal:</strong> tidak pakai UTM sama sekali di iklan TikTok → 100% traffic jadi &lsquo;direct/none&rsquo;.</p>
<p>Aturan: satu <strong>spreadsheet/konvensi UTM</strong> yang dipakai semua tim; validasi otomatis saat deploy (lihat Lab 1).</p>
</details>
<PlotlyChart
  data={[{x: ["Tanpa disiplin UTM", "Dengan disiplin UTM"], y: [41, 9], name: "direct/none", type: "bar", marker: {color: "#ef4444"}}, {x: ["Tanpa disiplin UTM", "Dengan disiplin UTM"], y: [59, 91], name: "ter-atribusi", type: "bar", marker: {color: "#2a7de1"}}]}
  title={"Proporsi traffic 'direct/none' — kasus BelanjaYuk"}
  layout={{barmode: "stack", yaxis: {title: "% traffic"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang stacked: kiri = sebelum disiplin UTM, kanan = sesudah. Merah = direct/none (tidak diketahui asalnya), biru = ter-atribusi ke channel.</p>
<p><strong>Interpretasi:</strong> Direct/none susut dari 41% ke 9% — artinya keputusan alokasi budget kini berdiri di atas 91% data yang jelas asalnya, bukan 59%. Sisa 9% wajar (bookmark, ketik langsung). Target realistis: direct/none &lt; 15%.</p>
</div>
<h2 id="identity">Identity Resolution — Satu Orang, Banyak Jejak</h2>
<p><strong>Definisi.</strong> Pengguna yang sama muncul sebagai banyak identitas: cookie browser, device_id HP, email, nomor HP, akun login. <strong>Identity resolution</strong> menggabungkannya jadi satu profil. Dua pendekatan: <strong>deterministik</strong> — cocokkan kunci pasti (email, nomor HP, user_id login); presisi tinggi, coverage terbatas. <strong>Probabilistik</strong> — cocokkan pola (device fingerprint, IP + perilaku); coverage luas, ada risiko salah gabung.</p>
<p>Hasilnya disimpan di <strong>CRM/CDP</strong> (<em>Customer Data Platform</em>: profil pelanggan terpadu). Data mengalir lewat <strong>pipeline ETL/ELT</strong> ke warehouse — dan di tiap tahap butuh <strong>QA otomatis</strong>: cek volume (event turun 50% = alarm), null rate, duplikat, schema drift (field baru/hilang).</p>
<Tex math={String.raw`\text{Match rate} = \frac{\text{identitas berhasil digabung}}{\text{total identitas mentah}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Match rate deterministik tipikal: 30–60% (hanya yang login/memberi email)</li>
<li>Match rate + probabilistik: 70–90%, tapi dengan false-match 2–5% — jangan dipakai untuk hal sensitif (tagih-menagih, kesehatan)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Identity resolution seperti <strong>menyatukan KTP, SIM, dan paspor</strong> jadi satu orang. Deterministik = cocokkan NIK (pasti). Probabilistik = cocokkan foto + nama (kadang salah orang). Untuk kirim promo, salah gabung = malu-maluin. Untuk analisis agregat, masih oke.</p>
<p><strong>Kapan dipakai:</strong> Deterministik untuk komunikasi personal &amp; transaksi. Probabilistik untuk analisis &amp; iklan. Keduanya butuh aturan retensi &amp; consent (lihat MK18).</p>
<details className="worked">
<summary>📐 Contoh: Kasus 'pengguna baru' palsu (klik untuk buka)</summary>
<p>BelanjaYuk menghitung &ldquo;pengguna baru&rdquo; dari device_id. Pelanggan ganti HP → device_id baru → tercatat sebagai pengguna baru, CAC terlihat naik, retention terlihat turun.</p>
<p><strong>Fix deterministik:</strong> saat login, gabungkan device_id lama + baru ke user_id yang sama (tabel mapping). &ldquo;Pengguna baru&rdquo; didefinisikan ulang = user_id pertama kali muncul, bukan device_id pertama kali.</p>
<p>Hasil: pengguna baru &ldquo;turun&rdquo; 22% (angka jujur), CAC terkoreksi, dan retention naik — bukan karena produk membaik, tapi karena pengukuran berhenti berbohong.</p>
</details>
<PlotlyChart
  data={[{x: ["Deterministik saja", "+ Probabilistik"], y: [45, 82], type: "bar", marker: {color: ["#2a7de1", "#e8a838"]}, text: ["45%", "82%"], textposition: "outside"}]}
  title={"Match rate: deterministik vs kombinasi"}
  layout={{yaxis: {title: "% identitas ter-resolve"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = % identitas mentah yang berhasil digabung jadi satu profil pelanggan.</p>
<p><strong>Interpretasi:</strong> Deterministik saja hanya me-resolve 45% (yang login). Tambah probabilistik → 82%, tapi ingat harganya: 2–5% salah gabung. Pilih berdasarkan use case: komunikasi personal = deterministik saja; analisis &amp; targeting iklan = kombinasi boleh.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Tiga Lapisan Kepercayaan Data</h2>
<p>Semua analisis MK1–MK19 berdiri di atas satu asumsi rapuh: <strong>datanya benar</strong>. Bagian ini mengasah tiga intuisi yang membedakan analis yang datanya bisa dipercaya dari yang spreadsheet-nya indah tapi fondasinya pasir: (1) schema sebagai <strong>kontrak</strong>, bukan dokumentasi; (2) UTM sebagai <strong>bahasa</strong>, bukan tempelan; (3) identitas sebagai <strong>tebakan berbiaya</strong>, bukan fakta.</p>
<h3>1. Schema sebagai Kontrak — Bukan Dokumentasi</h3>
<p><strong>Definisi.</strong> <em>Event schema</em> = perjanjian tertulis: event <code>checkout_started</code> <strong>wajib</strong> membawa <code>cart_value</code> (angka, &gt; 0) dan <code>currency</code> (string, 3 huruf). Bedanya dengan dokumentasi: <strong>kontrak ditegakkan otomatis</strong> — event yang melanggar ditolak/di-log, bukan diam-diam masuk lalu meracuni dashboard 3 bulan kemudian.</p>
<p><strong>Kepribadian/intuisi:</strong> Bayangkan schema seperti <strong>spesifikasi colokan listrik</strong>: 220V, 2 pin. Pabrik alat elektronik tidak perlu menelepon PLN setiap bikin produk baru — spesifikasinya <em>ditegakkan</em> oleh fisika. Tanpa schema contract, tim engineering &ldquo;mengganti colokan&rdquo; seenaknya: rename <code>purchase</code> jadi <code>order_completed</code> di rilis Jumat malam, dan Senin pagi funnel revenue-mu nol — bukan karena bisnis mati, tapi karena <strong>kabelnya dicabut</strong>.</p>
<p><strong>Kapan dipakai:</strong> Setiap ada event baru atau perubahan app. Aturan praktis: <strong>tidak ada event yang masuk warehouse tanpa schema terdaftar + contract test di CI</strong>.</p>
<Tex math={String.raw`\text{Data loss} = \frac{\text{event ditolak schema}}{\text{event dikirim}} \quad;\quad \text{target sehat } < 1\%`} block />
<p><strong>Artinya tiap simbol:</strong> event ditolak schema = yang melanggar kontrak (tipe salah, field wajib hilang); event dikirim = total dari client. Data loss &gt; 5% = sirene: ada rilis yang merusak kontrak.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Rename yang membunuh funnel (klik untuk buka)</summary>
<p>Jumat 17:00, tim app rename event <code>add_to_cart</code> → <code>cart_add</code> &ldquo;agar konsisten&rdquo;. Tanpa contract test.</p>
<p><strong>Langkah 1 — Senin pagi:</strong> dashboard funnel &ldquo;Kunjung → Keranjang&rdquo; menunjukkan conversion turun 100% → 0%. Tim growth panik: &ldquo;server down?&rdquo;</p>
<p><strong>Langkah 2 — Investigasi:</strong> event <code>cart_add</code> mengalir deras (data ada!), tapi definisi funnel masih mencari <code>add_to_cart</code> (data nol). <strong>Bisnis sehat, pengukuran mati.</strong></p>
<p><strong>Langkah 3 — Biaya:</strong> 3 hari analis + 2 hari engineer + 1 keputusan promo yang ditunda = ~Rp50jt biaya langsung, belum termasuk kepercayaan direksi yang retak.</p>
<p><strong>Langkah 4 — Perbaikan kontrak:</strong> (a) schema registry: rename = versi baru (v2), bukan ganti diam-diam; (b) contract test di CI menolak merge jika event terdaftar berubah tanpa migrasi; (c) definisi funnel membaca <strong>alias</strong> (&ldquo;keranjang&rdquo; = v1 ATAU v2), bukan nama mentah. Sejak itu, rename serupa tertangkap <strong>sebelum</strong> merge — biaya: 10 menit review.</p>
</details>
<h3>2. Taksonomi UTM — Bahasa yang Tidak Berbohong</h3>
<p><strong>Definisi.</strong> Lima parameter UTM (<code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>, <code>utm_term</code>, <code>utm_content</code>) + <strong>aturan penamaan yang ditegakkan</strong> = taksonomi. Tanpa aturan, kamu dapat 47 varian &ldquo;instagram&rdquo;: <code>IG</code>, <code>ig</code>, <code>Instagram</code>, <code>insta</code>, <code>instagram.com</code> — dan laporan channel-mu terpecah menjadi 47 baris yang tidak bisa digabung tanpa kamus manual.</p>
<p><strong>Kepribadian/intuisi:</strong> UTM tanpa taksonomi seperti <strong>47 orang memberi nama jalan yang sama dengan ejaan berbeda-beda</strong> — ambulans (budget) tidak akan sampai ke alamat yang benar. Aturan penamaan (lowercase, underscore, daftar source tertutup) adalah <strong>rambu lalu lintasnya</strong>: membosankan, tidak glamor, dan menyelamatkan nyawa (budget).</p>
<p><strong>Kapan dipakai:</strong> Sebelum kampanye apa pun diluncurkan. Sediakan <strong>UTM builder</strong> (form, bukan ketik manual) — manusia tidak bisa dipercaya mengetik konsisten, tapi bisa dipercaya mengisi form.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Membangun taksonomi anti-rusak (klik untuk buka)</summary>
<p><strong>Langkah 1 — Daftar tertutup source:</strong> <code>google, meta, tiktok, email, affiliate, referral, direct</code>. Selain ini = ditolak builder. Tidak ada &ldquo;Google&rdquo; vs &ldquo;google&rdquo;.</p>
<p><strong>Langkah 2 — Pola campaign:</strong> <code>[tahun][kuartal]_[tujuan]_[nama]</code> → <code>2026q4_acq_1111</code>. Dari namanya saja kamu tahu: kapan, untuk apa, kampanye apa — tanpa buka spreadsheet.</p>
<p><strong>Langkah 3 — Content untuk varian:</strong> <code>2026q4_acq_1111</code> + <code>utm_content=video15_vs_karusel</code> → A/B test kreatif terlacak otomatis di laporan.</p>
<p><strong>Langkah 4 — Validasi otomatis (Lab 1 lesson ini):</strong> setiap URL kampanye dicek regex: lowercase? pola campaign benar? source ada di daftar? Yang lolos &lt; 100% = kampanye belum boleh jalan.</p>
<p><strong>Hasil di lapangan:</strong> perusahaan yang menerapkan ini memangkas waktu &ldquo;bersih-bersih channel&rdquo; dari 3 hari/bulan menjadi 15 menit — dan untuk pertama kalinya ROAS per channel bisa dibandingkan apel-dengan-apel.</p>
</details>
<h3>3. Identity Resolution — Satu Orang, Banyak Jejak (dan Tebakan Berbiaya)</h3>
<p><strong>Definisi.</strong> <em>Identity resolution</em> = menggabungkan jejak (HP tanpa login, laptop login, tablet) menjadi <strong>satu profil</strong>. Dua pendekatan: <strong>deterministik</strong> (cocok persis: email/ID sama → pasti orang sama; presisi tinggi, jangkauan rendah) dan <strong>probabilistik</strong> (cocok pola: device + lokasi + perilaku mirip → <em>kemungkinan</em> orang sama; jangkauan tinggi, ada salah gabung).</p>
<Tex math={String.raw`\text{Match rate} = \frac{\text{jejak berhasil digabung}}{\text{total jejak}} \quad;\quad \text{False merge} = \text{dua orang digabung jadi satu}`} block />
<p><strong>Artinya tiap simbol:</strong> match rate = seberapa banyak jejak yang bisa disatukan (deterministik tipikal 20–40%, probabilistik 60–80%). False merge = dosa probabilistik: menggabungkan orang yang berbeda → CLV salah, targeting salah, <strong>dan pelanggaran privasi potensial</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Deterministik seperti <strong>sidik jari</strong>: pasti, tapi tidak semua orang mau memberikannya. Probabilistik seperti <strong>sketsa wajah dari saksi</strong>: menjangkau lebih banyak orang, tapi kadang menangkap orang yang salah — dan &ldquo;salah tangkap&rdquo; di data berarti kamu mengirim promo popok ke mahasiswa lajang karena algoritma menggabungkannya dengan ibunya yang sekamar kos beda lantai. <strong>Setiap poin match rate probabilistik dibayar dengan risiko false merge.</strong></p>
<p><strong>Kapan dipakai:</strong> Deterministik untuk pengukuran uang (atribusi, CLV — harus benar). Probabilistik untuk jangkauan (lookalike, frekuensi iklan — boleh sedikit salah).</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Harga sebuah false merge (klik untuk buka)</summary>
<p>Toko dengan 1 juta jejak/bulan. Vendor A: match rate 75% (probabilistik agresif), false merge 8%. Vendor B: match rate 45% (konservatif), false merge 1%.</p>
<p><strong>Langkah 1 — Jejak tergabung:</strong> A: 750rb; B: 450rb.</p>
<p><strong>Langkah 2 — False merge absolut:</strong> A: 8% × 750rb = <strong>60.000 profil &ldquo;campuran&rdquo;</strong>; B: 1% × 450rb = <strong>4.500</strong>.</p>
<p><strong>Langkah 3 — Dampak bisnis:</strong> 60.000 profil campuran → CLV salah hitung → batas CAC salah (MK1!) → budget salah alokasi. Jika tiap profil campuran menyebabkan salah target Rp10rb, kerugian = <strong>Rp600jt/bulan</strong> — jauh lebih mahal dari &ldquo;kehilangan&rdquo; 300rb jejak tak tergabung.</p>
<p><strong>Keputusan:</strong> untuk pengukuran (CLV, atribusi): pilih B. Untuk jangkauan iklan: A boleh, dengan flag &ldquo;probabilistik&rdquo;. <strong>Satu vendor untuk semua kebutuhan = jebakan.</strong></p>
</details>
<PlotlyChart
  data={[{x: ["Deterministik", "Probabilistik konservatif", "Probabilistik agresif"], y: [30, 55, 75], name: "Match rate %", type: "bar", marker: {color: "#2a7de1"}}, {x: ["Deterministik", "Probabilistik konservatif", "Probabilistik agresif"], y: [0.1, 1, 8], name: "False merge %", type: "bar", marker: {color: "#ef4444"}, yaxis: "y2"}]}
  title={"Trade-off identity resolution: jangkauan vs ketepatan"}
  layout={{yaxis: {title: "Match rate (%)"}, yaxis2: {title: "False merge (%)", overlaying: "y", side: "right"}, showlegend: true, barmode: "group"}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang biru (sumbu kiri) = % jejak yang berhasil digabung; batang merah (sumbu kanan) = % gabungan yang salah orang. Keduanya naik ke kanan — tidak ada makan siang gratis.</p>
<p><strong>Interpretasi:</strong> Melompat dari konservatif ke agresif menaikkan jangkauan 20 poin tapi melipatgandakan false merge 8x. Keputusan &ldquo;vendor mana&rdquo; = keputusan &ldquo;berapa banyak salah orang yang sanggup kita bayar&rdquo; — dan jawabannya beda untuk pengukuran vs jangkauan.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;GA4 / dashboard default sudah cukup — tinggal baca angkanya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tool default <strong>tidak tahu definisi bisnismu</strong>: apa itu &lsquo;pengguna aktif&rsquo;? Kapan &lsquo;purchase&rsquo; dihitung (klik tombol atau pembayaran sukses)? Tanpa taxonomy &amp; definisi yang disepakati, dua orang baca dashboard yang sama bisa simpulkan hal berlawanan. Dashboard tanpa definisi = ramalan cuaca tanpa satuan.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Last-click attribution = kebenaran: channel terakhir sebelum beli yang berjasa.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Last-click memberi <strong>semua kredit ke penutup</strong> (biasanya search/brand) dan nol ke pembuka (video, influencer, display). Hasilnya: budget dipotong dari channel pembuka → pipeline kering 2 bulan kemudian. Last-click itu <em>satu</em> sudut pandang, bukan kebenaran (lihat MK12 untuk atribusi yang adil).</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Event uang wajib server-side + deduplikasi.</strong> Purchase/lead yang dikirim dari browser bisa hilang (ad-blocker) atau ganda (refresh). Kirim dari server dengan ID unik (order_id) dan deduplicate di warehouse. Event baca artikel? Client-side cukup.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>QA tracking = unit test untuk data.</strong> Setiap deploy: cek volume event (±20% dari baseline = alarm), null rate field wajib, dan schema drift. Satu jam QA menghemat satu minggu debat &lsquo;datanya aneh&rsquo;.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Validator UTM Otomatis</h2>
<p>Fungsi ini mem-parse URL kampanye dan memberi nilai kelayakan tracking. Ubah URL contohnya — coba URL tanpa UTM, UTM berantakan, dan UTM rapi.</p>
<PyodideLab
  title={"Lab 1 — Validator UTM"}
  hint={"Coba: hapus utm_campaign, atau ganti utm_source=IG vs instagram. Lihat skor berubah. Aturan apa yang paling sering dilanggar tim?"}
  defaultCode={"from urllib.parse import urlparse, parse_qs\n\ndef nilai_utm(url):\n    q = parse_qs(urlparse(url).query)\n    get = lambda k: q.get(k, [\"\"])[0]\n    masalah = []\n    for k in [\"utm_source\", \"utm_medium\", \"utm_campaign\"]:\n        if not get(k):\n            masalah.append(f\"Wajib tapi kosong: {k}\")\n    for k in [\"utm_source\", \"utm_medium\", \"utm_campaign\"]:\n        v = get(k)\n        if v != v.lower().replace(\" \", \"_\") and v:\n            masalah.append(f\"Tidak konsisten (pakai lowercase_underscore): {k}={v}\")\n    skor = max(0, 100 - 30 * len(masalah))\n    return skor, masalah\n\ncontoh = [\n    \"https://toko.id/promo?utm_source=instagram&utm_medium=cpc&utm_campaign=11_11\",\n    \"https://toko.id/promo?utm_source=IG&utm_medium=CPC&utm_campaign=Promo 11.11!!\",\n    \"https://toko.id/promo\",\n]\nfor u in contoh:\n    s, m = nilai_utm(u)\n    print(f\"skor {s:3d} | {u[:70]}\")\n    for x in m:\n        print(f\"           - {x}\")\n    print()\n"}
/>
<h2 id="lab2">🔬 Lab 2: Identity Resolution Deterministik</h2>
<p>Gabungkan tabel web (cookie) + tabel app (device) lewat email yang sama. Lihat berapa identitas menyusut — dan siapa yang tidak bisa digabung (butuh probabilistik).</p>
<PyodideLab
  title={"Lab 2 — Merge Identitas Deterministik"}
  hint={"Ubah beberapa email jadi None — lihat match rate turun. Itulah batas deterministik: yang tidak login tidak ter-resolve."}
  defaultCode={"# Tabel mentah: (identitas, email)\nweb = [(\"cookie_1\", \"ani@mail.id\"), (\"cookie_2\", \"budi@mail.id\"),\n       (\"cookie_3\", None), (\"cookie_4\", \"ani@mail.id\")]   # ani buka 2 browser\napp = [(\"dev_9\", \"ani@mail.id\"), (\"dev_3\", None), (\"dev_7\", \"cici@mail.id\")]\n\ndef resolve(*tabels):\n    profil, belum = {}, []\n    for t in tabels:\n        for ident, email in t:\n            if email:\n                profil.setdefault(email, []).append(ident)\n            else:\n                belum.append(ident)\n    return profil, belum\n\nprofil, belum = resolve(web, app)\ntotal = len(web) + len(app)\nprint(f\"Identitas mentah : {total}\")\nprint(f\"Profil ter-resolve: {len(profil)}\")\nfor email, idents in profil.items():\n    print(f\"  {email} <- {idents}\")\nprint(f\"Tidak ter-resolve (butuh probabilistik): {belum}\")\nter = total - len(belum)\nprint(f\"Match rate deterministik: {ter}/{total} = {ter/total:.0%} (sisanya butuh login / probabilistik)\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Event bernilai uang (purchase, lead, langganan) → <strong>Server-side + ID unik + deduplikasi</strong></h3>
<p><strong>Kenapa:</strong> Hilang = revenue tidak tercatat; ganda = revenue double-count. Keduanya merusak ROAS & LTV.</p>
<p><strong>Contoh nyata:</strong> Meta Conversions API / TikTok Events API dengan order_id sebagai event_id.</p>
</div>
<div className="decision-card">
<h3>2. Event perilaku ringan (scroll, view_item) → <strong>Client-side (browser) cukup</strong></h3>
<p><strong>Kenapa:</strong> Volume besar, nilai per-event kecil. Kehilangan 5% tidak mengubah keputusan.</p>
<p><strong>Contoh nyata:</strong> GA4 otomatis + enhanced measurement.</p>
</div>
<div className="decision-card">
<h3>3. Butuh kirim pesan personal / hitung LTV per orang → <strong>Identity deterministik (email/HP/login)</strong></h3>
<p><strong>Kenapa:</strong> Salah gabung = kirim promo orang lain / salah tagih. Presisi &gt; coverage.</p>
<p><strong>Contoh nyata:</strong> CDP: gabungkan hanya yang match email terverifikasi.</p>
</div>
<div className="decision-card">
<h3>4. Butuh analisis agregat & targeting iklan → <strong>Deterministik + probabilistik</strong></h3>
<p><strong>Kenapa:</strong> Coverage penting, salah gabung 2–5% masih bisa ditoleransi di level agregat.</p>
<p><strong>Contoh nyata:</strong> Segmentasi audiens lookalike untuk prospekting.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Semua link kampanye pakai UTM</strong> — tanpa kecuali.</li><li><strong>Event uang = server-side + ID unik.</strong></li><li><strong>Definisi disepakati tertulis</strong> sebelum dashboard dibaca.</li><li><strong>QA otomatis</strong> tiap deploy: volume, null, duplikat.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: &ldquo;Direct Traffic&rdquo; 40% yang Ternyata Iklan Termahalmu</h3>
<p>Marketplace &ldquo;BelanjaYuk&rdquo; melihat 40% transaksinya berlabel <code>direct/(none)</code> — orang yang &ldquo;datang sendiri&rdquo;. Tim brand mengklaim ini bukti brand awareness kuat. Analis curiga: brand search mereka kecil, tidak mungkin 40%.</p>
<p>Audit menemukan tiga sumber &ldquo;direct&rdquo; palsu: (1) <strong>iklan TikTok tanpa UTM</strong> — agensi lupa pasang di 30% materi; app TikTok membuka browser in-app yang menghapus referrer; (2) <strong>link WhatsApp</strong> dari KOL — tidak ada UTM, tercatat direct; (3) <strong>email</strong> dengan UTM typo (<code>utm_medim</code>). Total: dari 40% &ldquo;direct&rdquo;, hanya ~8% yang benar-benar direct.</p>
<p>Setelah diperbaiki (UTM builder wajib + audit mingguan Lab 1): atribusi TikTok naik dari 5% → <strong>22%</strong> dari revenue. Channel yang tadinya &ldquo;tidak terbukti&rdquo; dan hampir dipotong ternyata <strong>mesin akuisisi terbesar kedua</strong>. <strong>Pelajaran:</strong> &ldquo;direct&rdquo; yang besar bukan kabar baik — ia kuburan massal atribusi yang salah label. Setiap &ldquo;direct&rdquo; di atas 15% = pekerjaan rumah tracking.</p>
<h3>Kisah 2: iOS ATT Memotong 60% Atribusi — yang Selamat Punya Server-Side</h3>
<p>Sejak Apple ATT (2021), opt-in tracking iOS &lt; 30%: click ID iklan hilang, atribusi aplikasi jebol. Brand fashion yang 100% mengandalkan SDK iklan melihat ROAS &ldquo;anjlok&rdquo; 60% dalam sebulan — padahal revenue naik. Mereka hampir memotong budget yang sebenarnya bekerja.</p>
<p>Yang selamat melakukan tiga hal: (1) <strong>server-side tracking</strong> (Conversion API): event dikirim dari server sendiri — tidak bisa diblokir ad-blocker/ATT; (2) <strong>first-party data</strong>: login + email sebagai identitas deterministik (MK2!); (3) <strong>geo-experiment</strong> (MK10) sebagai kebenaran kalibrasi saat atribusi user-level mati. Hasil: kesenjangan atribusi vs eksperimen menyempit dari 60% ke ~15%.</p>
<p><strong>Pelajaran:</strong> tracking client-side adalah <strong>aset yang terdepresiasi</strong> — nilainya turun setiap tahun (ATT, cookie mati, ad-blocker). Investasi tracking yang benar hari ini = server-side + first-party + eksperimen. Analis yang masih 100% mengandalkan pixel browser sedang membangun di atas pasir yang surut.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Tracking = pasang pixel, selesai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Pixel hanyalah <strong>pengirim surat</strong>. Yang menentukan surat sampai dan terbaca = kontrak schema (isinya benar), taksonomi UTM (alamatnya benar), identity resolution (penerimanya benar), dan server-side (kurirnya tidak dicegat). Empat lapis, bukan satu — dan setiap lapis yang bolong = keputusan bisnis dari data yang berbohong.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Misteri ROAS 8,2 BelanjaYuk</h2>
<div className="callout">
<p>Dashboard: ROAS kampanye &ldquo;Flash Sale&rdquo; = <strong>8,2</strong>. Finance: revenue naik cuma 12%. Investigasi menemukan: (1) 41% traffic &ldquo;direct/none&rdquo;; (2) event purchase terkirim 2x untuk 18% order (refresh halaman sukses); (3) &ldquo;new user&rdquo; dihitung dari device_id.</p>
<p><strong>Pertanyaan:</strong> (a) Koreksi apa saja yang harus dilakukan sebelum angka dipercaya? (b) Setelah koreksi, ROAS &lsquo;sebenarnya&rsquo; kemungkinan naik atau turun — kenapa? (c) Satu proses agar tidak terulang?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tiga koreksi:</strong> (1) disiplin UTM + reklasifikasi direct/none (survei &ldquo;darimana tahu kami&rdquo; untuk sampel); (2) deduplikasi purchase by order_id di warehouse; (3) definisi new user = user_id pertama kali (bukan device_id).</p>
<p>(b) <strong>Turun.</strong> Double-count menggelembungkan revenue tercatat (±18% order), dan sebagian &ldquo;new user&rdquo; adalah pelanggan lama. ROAS 8,2 kemungkinan aslinya 5–6 — masih bagus, tapi tidak sefantastis itu. Keputusan &ldquo;geser semua budget&rdquo; jadi perlu dikalibrasi ulang.</p>
<p>(c) <strong>Tracking QA checklist</strong> yang dijalankan tiap deploy kampanye: validator UTM otomatis (Lab 1), test purchase end-to-end cek duplikat, dan definisi metrik tertulis yang ditandatangani marketing + finance + data.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Data loss.</strong> App mengirim 2.000.000 event/hari. Schema menolak 3% (field wajib hilang pasca-rilis). (a) Berapa event hilang per hari? (b) Jika funnel dihitung dari event yang lolos, dan event yang hilang <strong>tidak acak</strong> (terkonsentrasi di Android versi lama = segmen termurah), apa biasnya pada CAC per segmen?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>(a) 3% × 2.000.000 = <strong>60.000 event/hari</strong> — setara satu kota kecil yang &ldquo;tidak ada&rdquo; di datamu.</p>
<p>(b) <strong>Bias seleksi.</strong> Segmen termurah (Android lama) under-counted → conversion-nya terlihat lebih buruk dari aslinya → CAC-nya terlihat lebih mahal → kamu memotong channel yang sebenarnya paling efisien. Data loss yang tidak acak <strong>selalu</strong> menghasilkan keputusan yang salah arah — bukan sekadar &ldquo;kurang presisi&rdquo;.</p>
</details>
<p><strong>Soal 2 — Audit UTM.</strong> Dari 1.000 URL kampanye: 120 uppercase source, 80 typo parameter, 200 tanpa utm_campaign, sisanya benar. (a) % URL valid? (b) Jika tiap URL invalid butuh 10 menit perbaikan manual, berapa jam kerja terbuang per 1.000 URL? (c) Solusi strukturalnya?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>(a) Invalid = 120 + 80 + 200 = 400 → valid <strong>60%</strong>.</p>
<p>(b) 400 × 10 menit = 4.000 menit ≈ <strong>67 jam</strong> — 8 hari kerja orang untuk 1.000 URL. Dan ini <em>berulang setiap bulan</em>.</p>
<p>(c) <strong>UTM builder</strong> (form dengan daftar tertutup + pola otomatis) + <strong>validasi di CI/CD</strong> halaman kampanye. Manusia tidak diperbaiki dengan &ldquo;lebih hati-hati&rdquo; — sistem yang membuat kesalahan <em>mustahil</em>, bukan <em>dilarang</em>.</p>
</details>
<p><strong>Soal 3 — Match rate.</strong> 500.000 jejak/bulan. Deterministik menggabung 35% dengan false merge ~0%. Probabilistik menggabung tambahan 30% dari sisa, dengan false merge 6% dari yang digabung probabilistik. (a) Total profil tergabung? (b) Berapa profil &ldquo;campuran&rdquo; (false merge)? (c) Untuk perhitungan CLV, data mana yang dipakai?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>(a) Deterministik: 175.000. Sisa 325.000 × 30% = 97.500. Total = <strong>272.500 profil</strong> (match rate gabungan 54,5%).</p>
<p>(b) 6% × 97.500 = <strong>5.850 profil campuran</strong>.</p>
<p>(c) <strong>Hanya deterministik (175.000)</strong> untuk CLV/atribusi — uang menuntut kepastian. Probabilistik dipakai untuk <strong>jangkauan</strong> (lookalike, capping frekuensi) dengan flag jelas. Mencampur keduanya dalam satu angka CLV = membangun keputusan budget di atas 5.850 kebohongan kecil.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga angka kesehatan tracking yang harus ada di dashboard-mu setiap Senin pagi: data loss &lt; 1%, URL UTM valid = 100%, dan &ldquo;direct&rdquo; &lt; 15%. Satu saja merah = minggu itu kamu memperbaiki pipa, bukan menganalisis air.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. 41% traffic tercatat 'direct/none'. Penyebab paling mungkin?"}
  options={
    ["Bot menguasai situs",
    "Link kampanye tidak pakai UTM yang disiplin",
    "GA4 error",
    "User memang mengetik URL manual semua"]
  }
  correct={1}
  explanation={"Benar: direct/none membengkak = klik datang tanpa parameter asal. Penyebab klasik: iklan/influencer/email tanpa UTM. Solusinya governance UTM, bukan ganti tool analytics."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Event purchase dikirim dari browser DAN server. Risiko terbesar?"}
  options={
    ["Data terlalu lengkap",
    "Double-counting revenue jika tanpa deduplikasi",
    "Server kelebihan beban",
    "Tidak ada risiko"]
  }
  correct={1}
  explanation={"Benar: dua sumber = dua kiriman untuk satu pembelian nyata. Wajib satu ID unik (order_id) + deduplikasi di warehouse. Redundansi itu bagus untuk ketahanan, tapi harus di-dedup."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Untuk menghitung LTV per pelanggan dan kirim promo personal, metode identity resolution yang tepat?"}
  options={
    ["Probabilistik saja (coverage luas)",
    "Deterministik (email/HP/login terverifikasi)",
    "Tidak perlu resolve",
    "Tebak dari IP"]
  }
  correct={1}
  explanation={"Benar: hal personal butuh presisi. Salah gabung probabilistik (2–5%) berarti promo/tagihan nyasar ke orang lain — risiko komplain & privasi. Coverage luas berguna untuk analisis agregat, bukan komunikasi personal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Manakah praktik taxonomy yang BENAR?"}
  options={
    ["Tiap tim bebas menamai event sesukanya",
    "snake_case, kata kerja lampau, satu bahasa, terdokumentasi",
    "Pakai nama Indonesia campur Inggris biar lokal",
    "Event cukup satu: 'user_action' dengan properties bebas"]
  }
  correct={1}
  explanation={"Benar: konsistensi penamaan + dokumentasi = kontrak antar tim. 'purchase', 'Purchase_Success', 'bayar_berhasil' sebagai tiga event berbeda adalah mimpi buruk analis."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kenapa third-party cookie sekarat dan apa penggantinya?"}
  options={
    ["Tidak sekarat, masih baik-baik saja",
    "Dibatasi browser & regulasi; gantinya first-party data + server-side tracking",
    "Diganti iklan TV",
    "Tidak ada pengganti"]
  }
  correct={1}
  explanation={"Benar: Safari/Firefox memblokir, Chrome mengetatkan, regulasi (UU PDP/GDPR) menuntut consent. Strategi bertahan: kumpulkan first-party data (login, transaksi, event sendiri) + kirim server-side."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Audit Tracking 11.11 dalam 5 Hari</h2>
<p>Promo 11.11 tinggal 5 hari. Tahun lalu ROAS &ldquo;8,2&rdquo; ternyata salah ukur (mini-case lesson ini). Tahun ini kamu — analisnya — diminta memastikan angkanya bisa dipercaya <strong>sebelum</strong> budget Rp5 miliar dibakar. Ini rencana auditmu, hari per hari.</p>
<h3>Hari 1 — Kontrak: daftarkan semua event promo</h3>
<p>List event yang dipakai funnel 11.11: <code>banner_view</code>, <code>promo_click</code>, <code>add_to_cart</code>, <code>checkout_started</code>, <code>payment_success</code>. Untuk tiap event: daftarkan schema (field wajib + tipe) di registry, pasang contract test di CI. Temuan hari 1: <code>promo_click</code> tidak membawa <code>promo_id</code> di app versi lama — 22% traffic tidak bisa diatribusikan ke promo spesifik. Perbaikan: fallback <code>promo_id</code> dari konteks halaman (server-side), deploy hari itu juga. <strong>Aturan: event tanpa schema = tidak ada di laporan resmi.</strong></p>
<h3>Hari 2 — UTM: kunci semua pintu masuk</h3>
<p>Semua materi kampanye (1.400 URL: iklan, KOL, email, push) lewat UTM builder + validator otomatis. Temuan: 180 URL agensi tanpa UTM (13%), 90 URL dengan <code>utm_source=tiktok</code> vs <code>tik_tok</code> ganda. Perbaikan: daftar source tertutup + pola campaign <code>2026q4_acq_1111_[nama]</code>. Sisa invalid: 0. <strong>Aturan: URL invalid = materi tidak tayang.</strong> Kedengarannya keras — tapi 13% materi tanpa UTM tahun lalu = Rp650jt spend yang atribusinya tebak-tebakan.</p>
<h3>Hari 3 — Identitas: pisahkan pengukuran dari jangkauan</h3>
<p>Keputusan arsitektur: <strong>pengukuran</strong> (funnel, ROAS, CLV) hanya dari identitas deterministik (login + order_id). <strong>Jangkauan</strong> (retargeting, lookalike) boleh probabilistik. Temuan: dashboard lama mencampur keduanya — ROAS 8,2 tahun lalu terinflasi double-counting tamu yang login belakangan (satu orang dihitung dua). Setelah dedup deterministik: ROAS terkoreksi <strong>8,2 → 5,1</strong>. Pahit — tapi 5,1 yang benar jauh lebih berguna dari 8,2 yang fantasi.</p>
<h3>Hari 4 — Server-side: pasang kurir cadangan</h3>
<p>Aktifkan Conversion API untuk <code>payment_success</code>: event dikirim dari server, membawa order_id sebagai kunci dedup dengan pixel browser. Hasil uji: browser menangkap 78% transaksi iOS, server-side menangkap 97%. Aturan dedup: <strong>order_id sama = satu transaksi</strong>, browser menang untuk atribut, server menang untuk keberadaan. Tanpa ini, iOS = lubang hitam 22%.</p>
<h3>Hari 5 — Rekonsiliasi: tiga sumber harus akur</h3>
<p>Uji akhir: (1) total <code>payment_success</code> (tracking) vs (2) order di database vs (3) revenue di payment gateway. Selisih toleransi: &lt; 2%. Temuan: selisih 1,3% (refund yang belum ter-handle di event) — diterima, dicatat sebagai catatan kaki laporan. <strong>Angka 11.11 tahun ini: ROAS 4,8 — lebih kecil dari &ldquo;8,2&rdquo; tahun lalu, dan untuk pertama kalinya bisa dipertanggungjawabkan.</strong></p>
<div className="tip">
<p><strong>💡 Template audit 5 hari ini bisa dipakai untuk setiap momen besar (12.12, Lebaran, launching). Intinya: kontrak → UTM → identitas → server-side → rekonsiliasi. Urutannya penting — tidak ada gunanya memperbaiki atribusi jika event-nya sendiri salah.</strong></p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Tracking</h2>
<h3>Jebakan 1: &ldquo;Event-nya ada&rdquo; = &ldquo;event-nya benar&rdquo;</h3>
<p>Dashboard funnel penuh angka — tapi <code>payment_success</code> ter-fire dua kali untuk pembayaran cicilan (satu per cicilan). Revenue terlihat 2x. <strong>Deteksi:</strong> bandingkan count event vs order_id unik. Selisih &gt; 0 = ada double-fire. Aturan: <strong>satu event bisnis = satu baris fakta</strong>, dedup by idempoten key.</p>
<h3>Jebakan 2: Timezone &ldquo;seadanya&rdquo;</h3>
<p>Event pakai waktu device (WIB/WITA/WIT campur + device yang jamnya salah), server pakai UTC. Kohor &ldquo;11.11&rdquo; jadi bocor ke 10 &amp; 12 November. <strong>Deteksi:</strong> plot distribusi event per jam — lonjakan di tengah malam = timezone bocor. Aturan: <strong>selalu simpan event_time (UTC, server) + device_time (info saja)</strong>; analisis pakai server.</p>
<h3>Jebakan 3: Bot = pelanggan</h3>
<p>15% &ldquo;visitor&rdquo; ternyata scraper harga kompetitor + bot monitoring sendiri. Conversion terlihat rendah, tim menyalahkan UX. <strong>Deteksi:</strong> filter user-agent + pola non-manusia (100 halaman/detik). Aturan: <strong>funnel bisnis tidak pernah dihitung dari traffic mentah</strong> — selalu dari traffic terfilter.</p>
<h3>Jebakan 4: Consent banner = data hilang diam-diam</h3>
<p>UU PDP: tanpa consent, tidak boleh tracking. 35% pengguna menolak — dan mereka <strong>tidak acak</strong> (lebih tua, lebih privacy-aware = segmen bernilai tinggi!). Funnel dari &ldquo;yang consent&rdquo; saja = bias ke pengguna muda. <strong>Deteksi:</strong> bandingkan profil consenter vs non-consenter (dari data agregat server). Aturan: laporkan <strong>consent rate per segmen</strong> sebagai catatan kaki setiap analisis.</p>
<h3>Jebakan 5: &ldquo;Sudah server-side&rdquo; tapi tanpa dedup key</h3>
<p>Conversion API aktif, pixel aktif — tapi tanpa order_id sebagai kunci, keduanya dihitung sebagai <strong>dua transaksi</strong>. ROAS terlihat 2x lipat. Ini versi modern jebakan 1, dan ironisnya menimpa tim yang <em>sudah</em> niat memperbaiki tracking. <strong>Deteksi:</strong> event server-side wajib membawa key yang sama dengan client. Aturan: <strong>tidak ada key = tidak ada dedup = tidak ada angka.</strong></p>
<div className="tip">
<p><strong>💡 Lima jebakan, satu akar: menganggap data &ldquo;apa adanya&rdquo;. Analis tracking yang baik berasumsi data <em>berbohong sampai terbukti jujur</em> — dan punya checklist pembuktian: dedup key, timezone, bot filter, consent bias, rekonsiliasi tiga sumber.</strong></p>
</div>

      <h2 id="playbook">📋 Playbook: Tracking Plan 1 Halaman</h2>
<p>Teori tanpa artefak = tidak jalan. Ini template <strong>tracking plan 1 halaman</strong> yang bisa kamu copy untuk produkmu — lengkap dengan contoh terisi untuk e-commerce.</p>
<h3>Tabel event inti (contoh terisi)</h3>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Event</th><th>Trigger</th><th>Field wajib</th><th>Pemilik</th></tr></thead>
<tbody>
<tr><td><code>view_item</code></td><td>Halaman produk tampil &gt; 1 detik</td><td><code>item_id</code>, <code>price</code>, <code>currency</code></td><td>Tim Web</td></tr>
<tr><td><code>add_to_cart</code></td><td>Tombol &ldquo;+ Keranjang&rdquo; diklik</td><td><code>item_id</code>, <code>qty</code>, <code>cart_value</code></td><td>Tim Web</td></tr>
<tr><td><code>checkout_started</code></td><td>Masuk halaman checkout</td><td><code>cart_id</code>, <code>cart_value</code>, <code>items_count</code></td><td>Tim App</td></tr>
<tr><td><code>payment_success</code></td><td>Gateway konfirmasi (server-side)</td><td><code>order_id</code> (dedup key), <code>revenue</code>, <code>currency</code>, <code>payment_method</code></td><td>Tim Backend</td></tr>
<tr><td><code>promo_click</code></td><td>Klik banner promo</td><td><code>promo_id</code>, <code>slot</code></td><td>Tim Web</td></tr>
</tbody>
</table>
</div>
<p><strong>Cara membaca tabel ini:</strong> kolom Trigger = definisi operasional (kapan <em>tepatnya</em> event dikirim — &ldquo;tampil &gt; 1 detik&rdquo; bukan &ldquo;dilihat&rdquo;); Field wajib = kontrak schema; Pemilik = siapa yang dihubungi saat event rusak. Tanpa kolom Pemilik, event yatim piatu — rusak berbulan-bulan tanpa ada yang merasa bertanggung jawab.</p>
<h3>Checklist rilis event baru (7 langkah)</h3>
<div className="callout">
<ol>
<li><strong>Schema terdaftar</strong> — nama, versi, field wajib + tipe. Tidak ada = tidak merge.</li>
<li><strong>Contract test hijau</strong> — CI menolak payload yang melanggar.</li>
<li><strong>UTM terisi</strong> — jika event terkait kampanye, builder sudah dipakai.</li>
<li><strong>Dedup key ada</strong> — untuk event uang: <code>order_id</code>/<code>transaction_id</code> unik.</li>
<li><strong>Timezone benar</strong> — <code>event_time</code> UTC dari server.</li>
<li><strong>Consent dihormati</strong> — tidak dikirim jika pengguna menolak (UU PDP).</li>
<li><strong>Dashboard verifikasi</strong> — 24 jam pasca-rilis: volume wajar? field terisi &gt; 99%? bandingkan dengan sumber kebenaran (database).</li>
</ol>
</div>
<h3>Aturan kepemilikan (RACI mini)</h3>
<p><strong>Engineering</strong> mengirim event sesuai kontrak. <strong>Analytics</strong> memiliki definisi (apa arti &ldquo;aktif&rdquo;?) dan memonitor data loss. <strong>Growth/Marketing</strong> memakai UTM builder — tidak boleh bikin URL manual. <strong>Data platform</strong> menjaga pipeline &amp; dedup. Rapat 30 menit/bulan: review 3 angka kesehatan (data loss, UTM valid, direct %). Rapat ini membosankan — dan justru itu tandanya tracking-mu sehat.</p>
<details className="worked">
<summary>📐 Contoh: Mengisi tracking plan untuk fitur baru (klik untuk buka)</summary>
<p>Fitur: &ldquo;live shopping&rdquo;. Event baru: <code>live_join</code>, <code>live_purchase</code>.</p>
<p><strong>Langkah 1 — Trigger presisi:</strong> <code>live_join</code> = stream terbuka &gt; 3 detik (bukan &ldquo;klik thumbnail&rdquo; — klik ≠ nonton). <code>live_purchase</code> = checkout dari sesi live (bawa <code>live_session_id</code>).</p>
<p><strong>Langkah 2 — Field wajib:</strong> <code>live_join</code>: <code>session_id</code>, <code>host_id</code>. <code>live_purchase</code>: <code>order_id</code>, <code>session_id</code>, <code>revenue</code>. Relasi <code>session_id</code> memungkinkan funnel &ldquo;nonton → beli&rdquo; per host — metrik yang menentukan host mana yang dipertahankan.</p>
<p><strong>Langkah 3 — Jebakan yang dihindari:</strong> tanpa <code>session_id</code>, kamu tahu &ldquo;live menghasilkan RpX&rdquo; tapi tidak tahu <em>host mana</em> — keputusan &ldquo;pertahankan host A, lepas host B&rdquo; tidak bisa dibuat. <strong>Field relasi (ID penghubung) adalah yang paling sering dilupakan dan paling mahal akibatnya.</strong></p>
<p><strong>Langkah 4 — Verifikasi 24 jam:</strong> <code>live_purchase</code> tanpa <code>live_join</code> sebelumnya = anomali (orang beli tanpa nonton?) → ternyata tombol &ldquo;beli&rdquo; di replay juga memicu event yang sama. Perbaiki trigger: hanya dari sesi live aktif. Menangkap ini di hari pertama menghemat 3 bulan data tercemar.</p>
</details>
<div className="tip">
<p><strong>💡 Tracking plan yang baik muat di 1 halaman dan dibaca 5 menit oleh engineer baru. Kalau dokumen tracking-mu 40 halaman, tidak ada yang membacanya — dan <em>itulah</em> kenapa tracking-mu rusak. Satu halaman, tujuh checklist, tiga angka kesehatan mingguan.</strong></p>
</div>


      <h2 id="utm">🔬 Bedah Mendalam: UTM yang Menyelamatkan Attribution</h2>
<p><strong>UTM</strong> (Urchin Tracking Module!) = <strong>parameter</strong> URL yang <strong>memberi tahu</strong> analytics &ldquo;<strong>dari mana</strong> traffic ini?&rdquo; <strong>Tanpa</strong> UTM = <strong>buta</strong> (&ldquo;direct/none&rdquo;!). <strong>Dengan</strong> UTM = <strong>melihat</strong>.</p>
<h3>Lima parameter wajib</h3>
<p><strong>utm_source</strong> (dari <strong>mana</strong>? — google! newsletter!), <strong>utm_medium</strong> (via <strong>apa</strong>? — cpc! email!), <strong>utm_campaign</strong> (kampanye <strong>apa</strong>? — lebaran2026!), <strong>utm_term</strong> (keyword <strong>apa</strong>? — untuk <strong>paid search</strong>!), <strong>utm_content</strong> (varian <strong>apa</strong>? — untuk <strong>A/B test</strong>!).</p>
<p><strong>Contoh:</strong> <code>https://toko.com/?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=lebaran2026&amp;utm_content=cta-merah</code></p>
<p><strong>Aturan:</strong> <strong>konsisten</strong> (huruf <strong>kecil</strong>! <strong>underscore</strong> bukan <strong>spasi</strong>!). <strong>Jangan</strong> untuk <strong>internal</strong> link (<strong>menimpa</strong> source asli!).</p>
<details className="worked">
<summary>📐 Contoh: UTM yang buruk vs baik (klik untuk buka)</summary>
<p><strong>Buruk:</strong> <code>?utm_source=Newsletter&amp;utm_medium=Email&amp;utm_campaign=Lebaran 2026</code> (<strong>kapital</strong>! <strong>spasi</strong>! — <strong>terpecah</strong> jadi <strong>3</strong> campaign!).</p>
<p><strong>Baik:</strong> <code>?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=lebaran2026</code> (<strong>konsisten</strong>!).</p>
<p><strong>Dampak:</strong> <strong>buruk</strong> = <strong>laporan</strong> berantakan (<strong>tidak</strong> bisa <strong>agregat</strong>!). <strong>Baik</strong> = <strong>bersih</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>konvensi</strong> = <strong>investasi</strong>. <strong>Tulis</strong> SOP!</p>
</details>
<div className="tip">
<p><strong>💡 UTM = <em>mata</em> attribution. <em>Tanpa</em> UTM = <em>buta</em>. <em>Konsisten</em> = <em>melihat jelas</em>.</strong></p>
</div>

      <h2 id="serverside">📊 Server-Side Tracking: Masa Depan</h2>
<p><strong>Cookie</strong> = <strong>mati</strong> (browser <strong>blokir</strong>!). <strong>Server-side</strong> = <strong>solusi</strong> (data <strong>dari</strong> server, <strong>bukan</strong> browser!).</p>
<h3>Mengapa pindah?</h3>
<p><strong>Client-side</strong> (browser!): <strong>diblokir</strong> (adblock!), <strong>dihapus</strong> (cookie!), <strong>tidak</strong> akurat. <strong>Server-side</strong>: <strong>kontrol</strong> penuh, <strong>akurat</strong>, <strong>privasi</strong> (data <strong>tidak</strong> ke pihak ketiga!).</p>
<h3>Cara kerja</h3>
<p><strong>Browser</strong> → <strong>server kamu</strong> → <strong>analytics</strong>. <strong>Server</strong> = <strong>perantara</strong> (<strong>filter</strong>! <strong>kaya</strong>kan! <strong>kirim</strong>!).</p>
<p><strong>Contoh:</strong> <strong>GTM</strong> server-side. <strong>Biaya:</strong> server (<strong>Rp500rb/bulan</strong>!). <strong>Worth it</strong> jika <strong>data</strong> = <strong>uang</strong>.</p>
<div className="tip">
<p><strong>💡 <em>Server-side</em> = <em>masa depan</em> tracking. <em>Investasi</em> sekarang.</strong></p>
</div>

      <h2 id="checklist">🔍 Checklist Tracking</h2>
<p><strong>Sebelum</strong> launch kampanye, <strong>cek</strong>:</p>
<p><strong>☐ UTM</strong> lengkap? (source! medium! campaign!) <strong>☐ Pixel</strong> terpasang? (test!) <strong>☐ Conversion</strong> terdefinisi? (apa yang <strong>diukur</strong>?) <strong>☐ Server-side</strong> siap? (jika <strong>butuh</strong>!) <strong>☐ Dokumentasi</strong> lengkap? (SOP!)</p>
<p><strong>5</strong> checklist = <strong>tracking</strong> yang <strong>benar</strong>.</p>
<div className="tip">
<p><strong>💡 <em>Checklist</em> = <em>jangan</em> lupa.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-faq">❓ FAQ: Jawaban Cepat untuk Masalah Tracking yang Paling Sering Muncul</h2>
<p>Enam pertanyaan yang paling sering membuat analis tracking begadang — dengan jawaban yang bisa langsung dipakai, bukan teori.</p>
<h3>1. &ldquo;Cookie pihak ketiga mati — apakah GA4 ikut mati?&rdquo;</h3>
<p><strong>Tidak.</strong> GA4 memakai <em>first-party</em> cookie (<code className="inline">_ga</code>) yang diset oleh domain-mu sendiri — ia tidak diblokir sebagai third-party cookie. Yang benar-benar mati: kemampuan mengaitkan pengguna <strong>lintas situs</strong> (mis. user klik iklan di situs A, beli di situs B). Dampaknya terasa di atribusi lintas perangkat dan remarketing di jaringan iklan pihak ketiga, bukan di pengukuran dasar situsmu sendiri. Respons yang benar: <strong>server-side tagging</strong> (event GA4 dikirim dari server-mu, bukan browser user — tidak bisa diblokir ad-blocker) + <strong>first-party identifier</strong> (user_id saat login sebagai jangkar identitas).</p>
<h3>2. &ldquo;Angka revenue di dashboard analytics beda dengan laporan finance. Mana yang benar?&rdquo;</h3>
<p><strong>Keduanya bisa &ldquo;benar&rdquo; dengan definisi berbeda</strong> — dan di situlah masalahnya. Analytics mencatat saat event <code className="inline">purchase</code> ter-fire (bisa double-count, belum dikurangi refund/batal); finance mencatat saat uang benar-benar masuk (setelah refund, fee gateway, pajak). Selisih 1–3% = normal dan sehat. Selisih &gt; 5% = investigasi: biasanya double-fire event, refund tidak di-track sebagai event negatif, atau currency campur. Aturan main yang disepakati semua tim: <strong>&ldquo;revenue resmi&rdquo; = angka finance</strong>; dashboard analytics = angka operasional <em>dengan catatan kaki definisinya</em>. Jangan pernah biarkan dua tim presentasi dengan dua angka revenue tanpa menjelaskan bedanya.</p>
<h3>3. &ldquo;Berapa lama data mentah (raw event) harus disimpan?&rdquo;</h3>
<p><strong>Raw event: minimal 13–25 bulan</strong> — kamu butuh perbandingan year-over-year plus satu siklus bisnis penuh untuk backfill dan audit. <strong>Agregat (harian/mingguan): selamanya</strong> — murah dan cukup untuk tren jangka panjang. Setelah periode retensi, raw boleh diarsipkan ke cold storage atau dihapus, asal agregatnya utuh. Catatan penting UU PDP: data pribadi tidak boleh disimpan selamanya tanpa tujuan yang jelas — tetapkan <strong>retention policy tertulis</strong> (mis. raw 25 bulan, lalu anonimisasi) dan patuhi.</p>
<h3>4. &ldquo;Ad-blocker memblokir GA4 — seberapa besar masalahnya?&rdquo;</h3>
<p><strong>Besar, dan bias.</strong> Estimasi 15–30% pengguna Indonesia memakai ad-blocker (lebih tinggi di desktop dan segmen tech-savvy). Mereka <strong>tidak acak</strong>: cenderung lebih muda, urban, dan berpendapatan lebih tinggi — justru segmen bernilai. Artinya funnel yang dihitung murni dari client-side <strong>bias sistematis</strong>: conversion terlihat lebih rendah di segmen premium, dan kamu bisa salah menyimpulkan &ldquo;segmen premium tidak tertarik&rdquo; padahal mereka hanya tidak ter-track. Solusi: <strong>server-side tracking untuk event uang</strong> + kalibrasi rutin dengan data server (database order = kebenaran).</p>
<h3>5. &ldquo;Kapan butuh CDP, kapan cukup GA4 + warehouse?&rdquo;</h3>
<p>Cukup GA4 + warehouse saat: channel masih 1–2, traffic di bawah ~1 juta event/bulan, dan identitas sederhana (kebanyakan login). Butuh <strong>CDP</strong> saat: banyak sumber identitas yang harus digabung, butuh personalisasi real-time (mis. rekomendasi saat user browsing), atau tim marketing ingin bikin segmen sendiri tanpa antre ke tim data. Peringatan jujur: <strong>CDP bukan sulap</strong> — ia hanya sebagus kontrak schema-mu. Perusahaan yang tracking-nya berantakan lalu beli CDP mahal biasanya hanya memindahkan kekacauan ke tempat yang lebih mahal.</p>
<h3>6. &ldquo;Kenapa angka iOS dan Android selalu beda?&rdquo;</h3>
<p>Karena <strong>aturannya beda</strong>. iOS (sejak ATT 2021): tanpa opt-in pengguna, tidak ada IDFA → atribusi user-level mati, tersisa agregat/SKAdNetwork. Android: GAID masih tersedia tapi makin dibatasi dan bisa di-reset user. Praktik yang benar: <strong>laporkan iOS dan Android terpisah</strong> — jangan bandingkan ROAS keduanya apel-dengan-apel. Untuk iOS, andalkan server-side event + eksperimen geo sebagai kalibrasi (MK10), bukan atribusi klik yang sudah mati.</p>
<div className="tip">
<p><strong>💡 Pola dari enam FAQ ini: hampir semua masalah tracking berakar di tiga hal — identitas yang tidak lengkap, definisi yang tidak disepakati, dan asumsi bahwa data &ldquo;apa adanya&rdquo;. Analis senior tidak menghafal jawaban FAQ; ia menghafal pola akarnya.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Kopi Nusantara — Membangun Tracking dari Nol dalam 30 Hari</h2>
<p><em>Kopi Nusantara</em> (nama disamarkan): jaringan 40 gerai kopi di Jawa, baru meluncurkan aplikasi pesan-antar. CMO-nya frustrasi: &ldquo;Kami bakar Rp300jt/bulan untuk iklan, tapi tidak tahu rupiah mana yang kembali.&rdquo; Kamu dikontrak 30 hari untuk membangun tracking dari nol. Ini yang terjadi.</p>
<h3>Minggu 1 — Audit: menemukan puing-puing (Hari 1–7)</h3>
<p><strong>Temuan audit:</strong></p>
<ul>
<li><strong>Tiga nama untuk satu aksi:</strong> tim web kirim <code className="inline">order_success</code>, tim app kirim <code className="inline">OrderCompleted</code>, tim backend kirim <code className="inline">pembayaran_ok</code>. Dashboard &ldquo;total order&rdquo; menjumlah ketiganya → order terlihat <strong>3x lipat</strong> dari aslinya.</li>
<li><strong>UTM = 0%:</strong> tidak satu pun link iklan ber-UTM. Semua traffic iklan tercatat <code className="inline">direct/none</code> (62%!).</li>
<li><strong>Tidak ada user_id:</strong> aplikasi mengandalkan device_id. Pelanggan ganti HP = pelanggan &ldquo;baru&rdquo;. Retention 30 hari terlihat 4% — angka yang membuat investor panik, padahal salah ukur.</li>
<li><strong>Event uang dari browser saja:</strong> tidak ada server-side; ad-blocker + koneksi putus = ~12% order tidak tercatat.</li>
</ul>
<h3>Minggu 2–3 — Membangun ulang (Hari 8–21)</h3>
<p><strong>Langkah 1 — Taxonomy tunggal:</strong> satu dokumen, satu bahasa Inggris, <code className="inline">snake_case</code>. Event uang baku: <code className="inline">order_completed</code> dengan <code className="inline">order_id</code> wajib unik. Ketiga nama lama di-<em>alias</em>-kan ke nama baru selama 30 hari masa transisi, lalu dimatikan.</p>
<p><strong>Langkah 2 — UTM builder:</strong> form internal (bukan ketik manual) dengan daftar source tertutup: <code className="inline">google, meta, tiktok, whatsapp, email, offline_qr</code>. Aturan keras: materi tanpa UTM valid tidak boleh tayang — agensi protes 2 hari, lalu terbiasa.</p>
<p><strong>Langkah 3 — Identity deterministik:</strong> nomor HP sebagai kunci (semua order butuh nomor HP untuk diantar). Mapping device_id → phone_number saat login/OTP. Definisi ulang: &ldquo;pelanggan baru&rdquo; = nomor HP pertama kali muncul.</p>
<p><strong>Langkah 4 — Server-side untuk order:</strong> backend kirim <code className="inline">order_completed</code> dengan <code className="inline">order_id</code> sebagai dedup key; pixel browser tetap jalan sebagai cadangan. Aturan dedup: order_id sama = satu order.</p>
<h3>Minggu 4 — Hasil: angka jujur pertama (Hari 22–30)</h3>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Metrik</th><th>Sebelum (salah ukur)</th><th>Sesudah (terkoreksi)</th><th>Implikasi</th></tr></thead>
<tbody>
<tr><td>Order/bulan tercatat</td><td>18.400</td><td>6.900</td><td>Angka lama 2,7x lipat (triple-fire)</td></tr>
<tr><td>Direct/none</td><td>62%</td><td>11%</td><td>TikTok ternyata 28% order (dulu &ldquo;direct&rdquo;)</td></tr>
<tr><td>Retention 30 hari</td><td>4%</td><td>31%</td><td>Bisnis sebenarnya sehat; yang sakit pengukurannya</td></tr>
<tr><td>Order tidak tercatat</td><td>~12%</td><td>&lt; 1%</td><td>Server-side menutup lubang ad-blocker</td></tr>
<tr><td>CAC blended</td><td>Rp43.500</td><td>Rp18.200</td><td>Ternyata akuisisi 2,4x lebih murah dari yang dikira</td></tr>
</tbody>
</table>
</div>
<p><strong>Keputusan yang berubah:</strong> sebelum koreksi, direksi hampir <strong>menutup channel TikTok</strong> (&ldquo;tidak terbukti menghasilkan&rdquo; — karena semua ordernya tercatat direct). Sesudah koreksi, TikTok justru <strong>dapat budget 2x lipat</strong> sebagai channel akuisisi termurah. Satu keputusan budget Rp300jt/bulan berbalik 180 derajat — hanya karena tracking diperbaiki.</p>
<details className="worked">
<summary>📐 Worked example: Menghitung biaya &ldquo;direct/none&rdquo; (klik untuk buka)</summary>
<p>Asumsi Kopi Nusantara: spend iklan Rp300jt/bulan, 62% order tercatat direct/none, margin kontribusi per order Rp25.000.</p>
<p><strong>Langkah 1 — Order yang atribusinya buta:</strong> 6.900 order × 62% = <strong>4.278 order/bulan</strong> tanpa asal channel yang jelas.</p>
<p><strong>Langkah 2 — Nilai keputusan yang dipertaruhkan:</strong> 4.278 × Rp25.000 = <strong>Rp107jt margin/bulan</strong> yang alokasi channel-nya ditentukan oleh tebak-tebakan.</p>
<p><strong>Langkah 3 — Biaya kesalahan alokasi:</strong> jika 30% dari budget salah alamat ke channel yang 20% lebih tidak efisien: 30% × Rp300jt × 20% = <strong>Rp18jt/bulan terbuang</strong> — Rp216jt/tahun. Biaya membangun tracking yang benar: ~Rp40jt sekali (konsultan 30 hari). <strong>Payback: 2,5 bulan.</strong></p>
<p><strong>Pelajaran:</strong> tracking bukan cost center — ia asuransi atas setiap rupiah budget marketing. Perusahaan yang &ldquo;menghemat&rdquo; dengan tidak membangun tracking sedang berjudi dengan seluruh budget iklannya.</p>
</details>
<div className="tip">
<p><strong>💡 Urutan kerja Kopi Nusantara = template universal: (1) audit & temukan kebohongan terbesar, (2) taxonomy + UTM dulu (murah, dampak besar), (3) identitas deterministik, (4) server-side untuk event uang, (5) rekonsiliasi tiga sumber. Jangan dibalik — memperbaiki atribusi sebelum event-nya benar = memoles bangkai.</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Event schema</strong>: (siapa, kapan, apa, detail). <strong>Taxonomy</strong> = kamus resmi event; tanpa itu, nama berantakan dan analis menderita.</li>
<li><strong>UTM</strong> (source/medium/campaign/content/term) = plat nomor tiap klik; tanpa disiplin UTM, traffic tenggelam di &lsquo;direct/none&rsquo;.</li>
<li><strong>First-party data</strong> (milikmu) &gt; third-party (sekarat). <strong>Server-side tracking</strong> untuk event uang — tahan ad-blocker, wajib deduplikasi.</li>
<li><strong>Identity resolution</strong>: deterministik (presisi, untuk hal personal) vs probabilistik (coverage, untuk agregat/iklan).</li>
<li><strong>Pipeline + QA</strong>: cek volume, null rate, duplikat, schema drift tiap deploy — unit test untuk data.</li>
<li><strong>Kapan TIDAK cukup dashboard default</strong>: selalu — definisikan dulu &lsquo;aktif&rsquo;, &lsquo;purchase&rsquo;, &lsquo;new user&rsquo; secara tertulis.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk1-funnel-aarrr" className="btn btn-secondary btn-sm">← MK1</Link>
        <Link href="/learn/mk3-deskriptif" className="btn btn-primary btn-sm">MK3 →</Link>
      </div>
    </div>
  );
}
