import Quiz from "@/components/Quiz";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A11Page() {
  const scaleData = [
    {
      x: ["Nominal", "Ordinal", "Interval", "Rasio"],
      y: [1, 2, 3, 4],
      type: "bar",
      marker: { color: ["#e8a838", "#e8a838", "#2a7de1", "#2a7de1"] },
      text: ["Kategori saja", "+ Urutan", "+ Jarak sama", "+ Nol absolut"],
      textposition: "auto",
    },
  ];

  const skewData = [
    {
      x: [1, 2, 2, 3, 3, 3, 4, 4, 5, 15],
      type: "histogram",
      name: "Right skew (pendapatan)",
      marker: { color: "#e8a838" },
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.1 — Statistika Deskriptif</span>
        <h1 className="display-title">Tipe Data: Salah Skala, Salah Semua</h1>
        <p className="meta">45–60 menit • 2 lab • 1 kalkulator • 6 quiz • 1 mini-case</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: "Rata-Rata Kolektibilitas 1,5 — Sangat Sehat!"</a></li>
          <li><a href="#nominal">Nominal — Si Pemberi Nama yang Buta Angka</a></li>
          <li><a href="#ordinal">Ordinal — Si Penjaga Urutan yang Pelit Jarak</a></li>
          <li><a href="#interval">Interval — Si Pengukur Jarak dengan Nol Palsu</a></li>
          <li><a href="#rasio">Rasio — Si Angka Sejati</a></li>
          <li><a href="#grain">Grain Data: Satu Baris = Apa?</a></li>
          <li><a href="#lab1">🔬 Lab 1: Buktikan Rata-Rata Rating Menipu</a></li>
          <li><a href="#lab2">🔬 Lab 2: Jebakan Angka Berkedok (Nominal)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Skala Apa Dataku?</a></li>
          <li><a href="#case">📋 Mini-Case: KPI "Rata-Rata Kolektibilitas" yang Menutupi 10% Macet</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mengklasifikasikan kolom data ke skala nominal / ordinal / interval / rasio — termasuk angka yang <em>berkedok</em> kategori.</li>
          <li>Menentukan operasi matematika dan ukuran ringkasan yang <strong>valid</strong> untuk tiap skala (kapan mean dilarang).</li>
          <li>Membuktikan dengan angka bahwa rata-rata pada data ordinal bisa menyesatkan keputusan kredit.</li>
          <li>Menetapkan <strong>grain</strong> ("satu baris = ___") sebelum menghitung apa pun dari sebuah tabel.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: "Rata-Rata Kolektibilitas 1,5 — Sangat Sehat!"</h2>
      <div className="story">
        <p>
          Bank Maju Jaya bangga memamerkan dashboard cabangnya ke direksi. KPI-nya sederhana:
          rata-rata <strong>kolektibilitas</strong> debitur, dengan skor 1 = lancar sampai 5 = macet.
          Cabang Surabaya mencetak <strong>1,5</strong> — "sangat sehat", kata slide presentasinya.
        </p>
        <p>
          Tiga bulan kemudian, tim audit turun. Di balik angka 1,5 yang cantik itu: 80% debitur memang
          lancar (skor 1), 10% kurang lancar (skor 2)… dan <strong>10% sudah macet total (skor 5)</strong>.
          Hitungannya benar: (80×1 + 10×2 + 10×5) / 100 = 1,5. Matematikanya tidak salah —
          tapi <strong>maknanya salah total</strong>. Skor kolektibilitas adalah <em>peringkat</em>,
          bukan angka sungguhan: jarak dari 1 ke 2 (masih bayar) tidak ada apa-apanya dibanding
          jarak dari 4 ke 5 (jatuh ke macet). Merata-ratakannya seperti merata-ratakan
          "panas, hangat, dingin" lalu menyimpulkan "suam-suam kuku".
        </p>
        <p>
          Pelajaran hari ini: <strong>sebelum menghitung apa pun, tanyakan dulu — data ini sebenarnya apa?</strong>
        </p>
      </div>

      <h2 id="nominal">1. Nominal — Si Pemberi Nama yang Buta Angka</h2>
      <p><strong>Definisi.</strong> Data nominal hanya <em>label</em> untuk membedakan kategori. Tidak ada "lebih besar" atau "lebih kecil" — hanya "sama" atau "beda".</p>
      <p><strong>Contoh:</strong> Jenis kelamin, kode cabang (JKT-01, SBY-02), status perkawinan, jenis kartu (debit/kredit).</p>
      <p><strong>Operasi yang valid:</strong> <Tex math={String.raw`=, \neq`} /> saja — sama atau tidak sama.</p>
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`=`} />: dua data berada di kategori yang <em>sama</em> ("cabang JKT-01 = cabang JKT-01")</li>
        <li><Tex math={String.raw`\neq`} />: dua data berada di kategori yang <em>berbeda</em> ("debit <Tex math={String.raw`\neq`} /> kredit")</li>
        <li>Yang <strong>tidak ada</strong>: <Tex math={String.raw`<, >, +, -, \times, \div`} /> — semuanya tidak bermakna untuk label.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: modus jenis keluhan fraud</summary>
        <p>Data 10 laporan: [phising, phising, skimming, phising, social-engineering, phising, skimming, phising, phising, skimming].</p>
        <p><strong>Langkah 1</strong> — hitung frekuensi tiap label: phising = 6, skimming = 3, social-engineering = 1.<br />
        <strong>Langkah 2</strong> — ambil yang terbanyak: <strong>modus = phising</strong>.</p>
        <p>Itulah satu-satunya "rata-rata" yang valid untuk nominal: <strong>modus</strong> (kategori tersering). Mean dan median tidak punya arti di sini.</p>
      </details>

      <p><strong>Kepribadian Nominal:</strong> dia si pemberi nama — tugasnya menempelkan label, dan dia <em>buta angka total</em>. Tunjukkan "10110" padanya, dia tidak melihat sepuluh ribu seratus sepuluh; dia melihat "wilayah Menteng". Justru karena buta angka inilah dia jujur: dia tidak pernah berpura-pura bisa dihitung.</p>
      <p><strong>Kapan memakai:</strong> setiap kali datamu adalah kategori — jenis produk, kode wilayah, status, label fraud. Ringkas dengan <strong>frekuensi dan modus</strong>.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Kodenya angka, jadi bisa dihitung."</p>
        <p><strong>Yang benar:</strong> kode pos "10110" <em>terlihat</em> seperti angka, tapi itu label wilayah. Rata-rata kode pos = omong kosong. <strong>Tesnya:</strong> kalau kodenya diganti nama kota ("Menteng", "Surabaya") tanpa mengubah makna analisismu — itu nominal, berapa pun bentuknya.</p>
      </div>

      <h2 id="ordinal">2. Ordinal — Si Penjaga Urutan yang Pelit Jarak</h2>
      <p><strong>Definisi.</strong> Data ordinal punya <em>urutan</em> yang bermakna, tapi <strong>jarak antar level tidak diketahui sama</strong>.</p>
      <p><strong>Contoh:</strong> Rating kredit AAA &gt; AA &gt; A &gt; BBB, tingkat kepuasan 1–5, kolektibilitas 1–5.</p>
      <p><strong>Operasi yang valid:</strong> <Tex math={String.raw`<, >, =, \neq`} /> — boleh dibandingkan urutannya, tidak boleh dijumlahkan.</p>
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`<, >`} />: urutan bermakna — <Tex math={String.raw`\text{rating A} > \text{rating B}`} /> artinya A lebih baik dari B.</li>
        <li><Tex math={String.raw`=, \neq`} />: kesamaan kategori, seperti nominal.</li>
        <li>Yang <strong>tidak ada</strong>: <Tex math={String.raw`+`} /> — "A + B" tidak punya arti, jadi rata-rata pun tidak punya arti.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: median rating 7 nasabah</summary>
        <p>Rating: [B, A, C, B, A, D, B] → ubah ke urutan: [A, A, B, B, B, C, D].</p>
        <p><strong>Langkah 1</strong> — urutkan dari terbaik ke terburuk.<br />
        <strong>Langkah 2</strong> — ambil nilai tengah (data ke-4 dari 7): <strong>median = B</strong>.</p>
        <p>Median valid karena hanya memakai <em>urutan</em> — tanpa pernah mengasumsikan jarak A→B sama dengan B→C.</p>
      </details>

      <p><strong>Kepribadian Ordinal:</strong> dia penjaga antrean yang taat — dia tahu persis siapa di depan siapa, tapi <em>pelit soal jarak</em>: dia tidak akan pernah memberitahumu seberapa jauh A dari B. Begitu kamu memaksanya bicara jarak ("rata-rata rating = 2,3"), dia mengarang — dan karangannya bisa membunuh keputusan kredit.</p>
      <p><strong>Kapan memakai:</strong> rating, survei kepuasan, level risiko. Ringkas dengan <strong>median atau modus</strong> — bukan mean.</p>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = empat skala dari kiri ke kanan, tinggi batang = "level" kemampuan operasi. Warna kuning = hanya kategori/urutan; biru = sudah bisa operasi aritmetika.</p>
        <PlotlyChart
          data={scaleData}
          title="Hierarki Skala Pengukuran"
          layout={{ yaxis: { title: "Level" }, xaxis: { title: "Skala" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> setiap naik satu tingkat, kamu <em>mewarisi</em> semua kemampuan tingkat di bawahnya plus satu kemampuan baru. Nominal hanya bisa dibedakan; ordinal bisa diurutkan; interval bisa dihitung selisihnya; rasio bisa dikalikan/dibagi. <strong>Aturan emas:</strong> analisis yang valid di tingkat bawah tetap valid di atas — tapi tidak sebaliknya.</p>
      </div>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Rating A=1, B=2, C=3, D=4 — rata-ratanya 2,5, jadi kualitasnya 'B/C'."</p>
        <p><strong>Yang benar:</strong> angka 1–4 itu <em>buatanmu sendiri</em>, bukan sifat datanya. Jarak A→B (masih investment grade, PD naik 0,5%) jauh lebih kecil dari C→D (jatuh ke gagal bayar, PD naik 15%). Rata-rata 2,5 menyamakan dua jurang yang beda dalam. Kalau analisismu runtuh saat mapping diganti 1,2,3,4 menjadi 1,3,9,27 — analisismu memang tidak valid dari awal. (Buktikan sendiri di Lab 1.)</p>
      </div>

      <div className="tip">
        <p><strong>💡 Tes ganti angka (ordinal detector):</strong> curiga sebuah kolom ordinal diperlakukan sebagai angka? Ganti mappingnya (misal 1,2,3,4 → 1,4,9,16) lalu hitung ulang kesimpulanmu. Kalau kesimpulan <em>berubah</em>, berarti kesimpulanmu bergantung pada angka buatan — buang dan pakai median.</p>
      </div>

      <h2 id="interval">3. Interval — Si Pengukur Jarak dengan Nol Palsu</h2>
      <p><strong>Definisi.</strong> Jarak antar nilai <em>bermakna dan sama</em>, tapi angka <strong>nol-nya arbitrer</strong> — nol bukan berarti "tidak ada".</p>
      <p><strong>Contoh:</strong> Suhu Celsius, skor IQ, tahun kalender.</p>
      <p><strong>Operasi yang valid:</strong> <Tex math={String.raw`+, -`} /> — selisih bermakna. <strong>Tidak valid:</strong> <Tex math={String.raw`\times, \div`} />.</p>
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`+`} /> / <Tex math={String.raw`-`} />: selisih bermakna — "40°C − 20°C = 20°C" artinya beda suhunya 20 derajat, titik.</li>
        <li><Tex math={String.raw`\times`} /> / <Tex math={String.raw`\div`} />: <strong>dilarang</strong> — "40°C = 2 × 20°C" salah, karena 0°C bukan "tidak ada panas". (Dalam Kelvin: 313K vs 293K — rasionya 1,07, bukan 2!)</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: kenapa 40°C bukan "2x" 20°C</summary>
        <p><strong>Langkah 1</strong> — konversi ke Kelvin (nol absolut): 40°C = 313K, 20°C = 293K.<br />
        <strong>Langkah 2</strong> — hitung rasio yang benar: 313 / 293 ≈ <strong>1,07</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan dengan klaim "2x": jauh meleset.</p>
        <p>Klaim rasio hanya valid terhadap <em>nol yang sesungguhnya</em>. Nol Celsius itu "nol palsu" — titik beku air yang dipilih manusia.</p>
      </details>

      <p><strong>Kepribadian Interval:</strong> dia penggaris yang akurat mengukur jarak — tapi garis nolnya digambar <em>sesukanya</em>. Selama kamu hanya bertanya soal jarak ("selisihnya berapa?"), dia bisa dipercaya penuh. Begitu kamu bertanya soal kelipatan ("berapa kali lipat?"), nol palsunya mengkhianatimu.</p>
      <p><strong>Kapan memakai:</strong> suhu, skor tes terstandar, tahun. Mean dan SD <strong>valid</strong> — tapi jangan pernah membuat klaim rasio.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "40°C dua kali lebih panas dari 20°C."</p>
        <p><strong>Yang benar:</strong> yang "dua kali" hanya <em>angkanya</em>, bukan panasnya. Energi termal diukur dari nol absolut (Kelvin): 313K vs 293K — hanya 1,07x. Ini bukan soal fisika; ini soal <strong>setiap klaim "N kali lipat" butuh nol absolut</strong>, termasuk di bisnis.</p>
      </div>

      <h2 id="rasio">4. Rasio — Si Angka Sejati</h2>
      <p><strong>Definisi.</strong> Seperti interval, tapi angka <strong>nol berarti "tidak ada sama sekali"</strong> (nol absolut).</p>
      <p><strong>Contoh:</strong> Pendapatan (Rp 0 = tidak berpenghasilan), DPD, jumlah transaksi, durasi, saldo.</p>
      <p><strong>Operasi yang valid:</strong> semuanya — <Tex math={String.raw`+, -, \times, \div`} />. Rp 10 juta <em>memang</em> 2x Rp 5 juta.</p>
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`+`} /> / <Tex math={String.raw`-`} />: selisih bermakna, seperti interval.</li>
        <li><Tex math={String.raw`\times`} /> / <Tex math={String.raw`\div`} />: <strong>baru di sini valid</strong> — karena 0 berarti ketiadaan, "2x" punya makna fisik/bisnis yang sesungguhnya.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: DPD 60 vs DPD 30</summary>
        <p>DPD (<em>days past due</em>): 0 = tidak menunggak sama sekali → nol absolut → skala rasio.</p>
        <p><strong>Langkah 1</strong> — rasio: 60 / 30 = <strong>2</strong>.<br />
        <strong>Langkah 2</strong> — interpretasi: nasabah DPD 60 menunggak <em>dua kali</em> lebih lama dari DPD 30. Klaim ini valid.</p>
        <p>Bandingkan dengan kolektibilitas "skor 4 vs skor 2" — di sana klaim "2x lebih macet" tidak bermakna, karena skornya ordinal.</p>
      </details>

      <p><strong>Kepribadian Rasio:</strong> dia satu-satunya yang jujur penuh — nolnya sungguhan, jaraknya sungguhan, kelipatannya sungguhan. Mean, SD, rasio, persen perubahan: semua boleh. Tapi justru karena paling "enak" dipakai, dia paling sering <em>dipalsukan</em>: banyak kolom berkedok angka (kode, tahun, skor) menyamar jadi dia.</p>
      <p><strong>Kapan memakai:</strong> kapan pun nolnya bermakna "tidak ada" — uang, waktu, jumlah, DPD. Inilah rumahnya mean dan SD.</p>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = pendapatan (juta Rp), tinggi batang = jumlah orang. Perhatikan di mana massa data menumpuk dan ke mana ekornya memanjang.</p>
        <PlotlyChart
          data={skewData}
          title="Pendapatan: Skala Rasio dengan Ekor Kanan Panjang"
          layout={{ xaxis: { title: "Juta Rp" }, yaxis: { title: "Frekuensi" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> pendapatan adalah skala rasio (Rp 0 = tidak ada; 15 juta memang 3x lipat 5 juta) — tapi <em>distribusinya</em> miring kanan: kebanyakan menumpuk di 1–5 juta, satu orang di 15 juta. Skala menentukan <strong>operasi apa yang valid</strong>; bentuk distribusi menentukan <strong>ukuran ringkasan apa yang jujur</strong> (di sini median, bukan mean — detail di A1.2/A1.4).</p>
      </div>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Semua kolom berisi angka otomatis skala rasio."</p>
        <p><strong>Yang benar:</strong> angka hanyalah <em>tampilan</em>. Tahun "2026" adalah interval (tahun 0 bukan ketiadaan waktu). Nomor punggung "10" adalah nominal. Skor kepuasan "4" adalah ordinal. <strong>Tanya maknanya, bukan bentuknya.</strong></p>
      </div>

      <h2>Tabel Ringkasan</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>Skala</th><th>Urutan</th><th>Jarak Sama</th><th>Nol Absolut</th><th>Contoh</th><th>Ukuran Tepat</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Nominal</strong></td><td>❌</td><td>❌</td><td>❌</td><td>Jenis kelamin</td><td>Modus</td></tr>
            <tr><td><strong>Ordinal</strong></td><td>✅</td><td>❌</td><td>❌</td><td>Rating kredit</td><td>Median, modus</td></tr>
            <tr><td><strong>Interval</strong></td><td>✅</td><td>✅</td><td>❌</td><td>Suhu °C</td><td>Mean, SD</td></tr>
            <tr><td><strong>Rasio</strong></td><td>✅</td><td>✅</td><td>✅</td><td>Pendapatan</td><td>Mean, SD, rasio</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="grain">Grain Data: Satu Baris = Apa?</h2>
      <p><strong>Grain</strong> adalah level detail satu baris data. Pertanyaan terpenting sebelum analisis — dan ia menentukan skala apa yang sedang kamu hadapi (apakah kolom "jumlah" itu rasio per transaksi atau agregat per nasabah?).</p>
      <div className="callout">
        <p><strong>Contoh:</strong> Tabel 3 baris transaksi (2 nasabah). <code className="inline">COUNT(*)</code> = 3 = jumlah <strong>transaksi</strong>, BUKAN nasabah!</p>
        <p><strong>Aturan emas:</strong> Tulis satu kalimat: "Satu baris = ___." Kalau tidak bisa jawab, jangan lanjutkan.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Grain mengubah skala kolom yang sama:</strong> kolom <code className="inline">total_transaksi</code> di tabel ber-grain "satu baris = satu transaksi" hanyalah angka 1 berulang (tak informatif). Di tabel ber-grain "satu baris = satu nasabah per bulan", kolom yang sama menjadi skala rasio yang bermakna. <strong>Kolom tidak punya skala — pasangan (kolom, grain) yang punya.</strong></p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Buktikan Rata-Rata Rating Menipu</h2>
      <p>
        Portofolio 100 debitur: 70 rating A, 20 rating B, 8 rating C, 2 rating D.
        Kode buatan: A=1, B=2, C=3, D=4. Tapi PD (<em>probability of default</em>) riil tiap rating
        tidak berjarak sama: A=0,2%, B=1%, C=5%, D=20%.
        Bandingkan "rata-rata rating" dengan <em>expected loss</em> yang sebenarnya.
      </p>
      <PyodideLab
        title="Lab 1 — Rata-rata ordinal vs risiko riil"
        hint="Coba ubah komposisi (misal D jadi 10 orang). Pada titik berapa 'rata-rata rating 2,0' menyembunyikan expected loss 2x lipat dari kesan 'B'-nya?"
        defaultCode={`# Komposisi portofolio: jumlah debitur per rating
komposisi = {"A": 70, "B": 20, "C": 8, "D": 2}   # <-- ubah sesukamu
kode   = {"A": 1, "B": 2, "C": 3, "D": 4}        # angka BUATAN
pd_riil = {"A": 0.002, "B": 0.01, "C": 0.05, "D": 0.20}  # PD sebenarnya

n = sum(komposisi.values())
rata_rating = sum(komposisi[r] * kode[r] for r in komposisi) / n
el_riil = sum(komposisi[r] * pd_riil[r] for r in komposisi) / n

print(f"Rata-rata rating (kode buatan) : {rata_rating:.2f}  -> terbaca 'A/B, aman'")
print(f"Expected loss riil (rata2 PD)   : {el_riil*100:.2f}%")
print(f"Kesan dari rating 'B' (PD~1%)   : meremehkan {el_riil/0.01:.1f}x lipat!")
print()
print("Kesimpulan: rata-rata ordinal memberi rasa aman yang palsu,")
print("karena 2 debitur rating D (PD 20%) 'tenggelam' di antara 70 debitur A.")`}
      />

      <h2 id="lab2">🔬 Lab 2: Jebakan Angka Berkedok (Nominal)</h2>
      <p>
        Tiga cabang berkode "101", "102", "103". Seorang junior menghitung "rata-rata kode cabang = 102"
        lalu melaporkannya. Jalankan lab ini: ganti label kodenya, lalu lihat apa yang terjadi pada "rata-rata" itu.
      </p>
      <PyodideLab
        title="Lab 2 — Rata-rata label tidak punya makna"
        hint="Coba ganti kode jadi ['JKT','SBY','MDN'] lalu jalankan lagi. Apa yang terjadi? Itulah bukti 'rata-rata kode' tidak pernah punya makna."
        defaultCode={`kode_cabang = ["101", "102", "103"]   # <-- ganti sesukamu, misal ["JKT","SBY","MDN"]

# Cara 'junior': paksa jadi angka lalu rata-ratakan
try:
    rata2 = sum(int(k) for k in kode_cabang) / len(kode_cabang)
    print(f"'Rata-rata kode cabang' = {rata2}")
    print("Maknanya? Tidak ada. Cabang '102' tidak berada di antara cabang lain.")
except ValueError:
    print("ERROR: tidak bisa dirata-rata — karena memang LABEL, bukan angka.")

# Cara benar: hitung frekuensi (modus)
from collections import Counter
print()
print("Frekuensi (cara benar):", dict(Counter(kode_cabang)))`}
      />

      <h2>Simulasi: Coba Sendiri</h2>
      <p>
        Masukkan data rating (1-5) atau pendapatan dan lihat bagaimana mean/median/mode berperilaku.
        Coba masukkan outlier dan perhatikan mean yang "tertipu".
      </p>
      <StatsCalculator defaultValues="3, 4, 4, 5, 3" title="🧮 Simulasi Skala Ordinal vs Rasio" />

      <h2 id="peta">🗺️ Peta Keputusan: Skala Apa Dataku?</h2>
      <p>Alur 10 detik: tanyakan tiga pertanyaan berurutan — <strong>ada urutan? → jarak sama? → nol absolut?</strong> — lalu ikuti kartunya.</p>

      <div className="decision-card">
        <h3>1. Kolomnya angka, tapi sebenarnya label → <strong>Nominal</strong></h3>
        <p><strong>Kondisi:</strong> kode pos, ID nasabah, nomor punggung, kode cabang. Tes ganti label: diganti nama kota tanpa mengubah makna.</p>
        <p><strong>Pakai:</strong> frekuensi / modus. <strong>Jangan:</strong> mean, median, SD, "rata-rata kode".</p>
        <p><strong>Contoh nyata:</strong> "rata-rata kode pos 15.112" di laporan — hapus, ganti dengan distribusi wilayah.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ada peringkat, jaraknya tak pasti → <strong>Ordinal</strong></h3>
        <p><strong>Kondisi:</strong> rating kredit, skor kepuasan 1–5, kolektibilitas 1–5, level risiko (rendah/sedang/tinggi).</p>
        <p><strong>Pakai:</strong> median / modus / distribusi per level. <strong>Jangan:</strong> mean skor.</p>
        <p><strong>Contoh nyata:</strong> "rata-rata kepuasan 3,7" → ganti "median 4; 62% memberi skor 4–5". Untuk risiko: petakan tiap level ke PD riil dulu (Lab 1), baru hitung.</p>
      </div>

      <div className="decision-card">
        <h3>3. Selisih bermakna, tapi nolnya arbitrer → <strong>Interval</strong></h3>
        <p><strong>Kondisi:</strong> suhu °C/°F, tahun kalender, skor IQ/tes terstandar.</p>
        <p><strong>Pakai:</strong> mean, SD, selisih. <strong>Jangan:</strong> klaim "2x lipat" / persen perubahan dari nol.</p>
        <p><strong>Contoh nyata:</strong> "suhu naik 2x" → salah; "suhu naik 8°C" → benar.</p>
      </div>

      <div className="decision-card">
        <h3>4. Nol berarti "tidak ada" → <strong>Rasio</strong></h3>
        <p><strong>Kondisi:</strong> pendapatan, saldo, DPD, durasi, jumlah transaksi, loss dalam rupiah.</p>
        <p><strong>Pakai:</strong> semua operasi — mean, SD, rasio, growth %. Inilah rumahnya statistik parametrik.</p>
        <p><strong>Contoh nyata:</strong> "DPD 60 = 2x DPD 30" valid; "NPL turun 30% YoY" valid.</p>
      </div>

      <div className="decision-card">
        <h3>5. Belum yakin grain-nya → <strong>Berhenti dulu</strong></h3>
        <p><strong>Kondisi:</strong> kamu tidak bisa menulis "satu baris = ___" dalam satu kalimat.</p>
        <p><strong>Pakai:</strong> tulis grain-nya dulu, baru tentukan skala tiap kolom. Salah grain = salah agregasi = salah skala.</p>
        <p><strong>Contoh nyata:</strong> <code className="inline">AVG(saldo)</code> di tabel transaksi = "rata-rata saldo per transaksi" (aneh) — yang kamu mau mungkin "rata-rata saldo per nasabah".</p>
      </div>

      <div className="callout">
        <p><strong>🧭 Aturan praktis 10 detik</strong></p>
        <ol>
          <li><strong>Tes label:</strong> bisa diganti nama tanpa mengubah makna? → Nominal. Stop.</li>
          <li><strong>Tes urutan:</strong> ada peringkat tapi jaraknya misterius? → Ordinal. Median saja.</li>
          <li><strong>Tes nol:</strong> nol = "tidak ada"? Ya → Rasio (bebas). Tidak → Interval (dilarang klaim ×/÷).</li>
          <li><strong>Tes grain:</strong> tulis "satu baris = ___" sebelum query agregasi apa pun.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: KPI "Rata-Rata Kolektibilitas" yang Menutupi 10% Macet</h2>
      <div className="callout">
        <p>Kamu analis di Bank Maju Jaya. Dua cabang melaporkan rata-rata skor kolektibilitas (1=lancar … 5=macet):</p>
        <ul>
          <li><strong>Cabang Surabaya:</strong> 80% skor 1, 10% skor 2, 10% skor 5 → rata-rata = <strong>1,5</strong></li>
          <li><strong>Cabang Medan:</strong> 60% skor 1, 40% skor 2 → rata-rata = <strong>1,4</strong></li>
        </ul>
        <p>Direksi menyimpulkan: "Medan sedikit lebih baik, keduanya sangat sehat." Kamu diminta verifikasi sebelum laporan ke regulator.</p>
        <p><strong>Pertanyaan:</strong> (a) Apa yang salah dari kesimpulan direksi? (b) Metrik apa yang jujur untuk laporan kesehatan portofolio? (c) Untuk perhitungan CKPN (cadangan kerugian), apa yang harus dipakai — bukan rata-rata skor?</p>
        <details>
          <summary>💡 Pembahasan</summary>
          <p>(a) <strong>Dua kesalahan.</strong> Pertama, skor kolektibilitas itu <em>ordinal</em> — rata-rata 1,5 vs 1,4 tidak bermakna. Kedua, dan lebih fatal: <strong>Surabaya menyembunyikan 10% debitur macet total (skor 5)</strong> di balik rata-rata yang "cantik". Medan dengan rata-rata 1,4 justru <em>jauh lebih sehat</em> — tidak ada satu pun debitur macet. Satu angka menutupi perbedaan risiko yang sangat besar.</p>
          <p>(b) Untuk direksi/regulator: laporkan <strong>distribusi per bucket</strong> (%, bukan rata-rata) + <strong>% skor 3–5 (NPL ratio)</strong>: Surabaya NPL = 10%, Medan NPL = 0%. Itu angka yang jujur.</p>
          <p>(c) Untuk CKPN: bukan soal mean/median skor — petakan tiap bucket ke <strong>PD riil</strong> (seperti Lab 1), lalu hitung <em>expected loss = Σ exposure × PD × LGD</em> per bucket. Skor 5 dengan PD ~100% tidak boleh "diencerkan" oleh skor 1.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <Quiz
        question="Kolom kode_pos berisi '10110', '20112', '30114'. Skala apa ini?"
        options={[
          "Ordinal — karena angkanya berurutan",
          "Nominal — karena hanya label wilayah",
          "Interval — karena selisihnya bermakna",
          "Rasio — karena bisa dihitung rata-rata",
        ]}
        correct={1}
        explanation="Kode pos hanya label wilayah. '20112' tidak 'lebih besar' dari '10110' secara bermakna. Jangan tertipu karena terlihat seperti angka — pakai tes ganti label!"
      />

      <Quiz
        question="Bank mencatat DPD (days past due): 0, 15, 30, 90. Skala apa?"
        options={["Nominal", "Ordinal", "Interval", "Rasio"]}
        correct={3}
        explanation="DPD = 0 berarti tidak menunggak sama sekali (nol absolut). DPD 60 memang dua kali DPD 30. Semua operasi valid — inilah skala rasio."
      />

      <Quiz
        question="Tabel 10.000 baris, setiap kombinasi bulan+nasabah muncul tepat sekali. Apa grain-nya?"
        options={[
          "Satu baris = satu transaksi",
          "Satu baris = satu nasabah per bulan",
          "Satu baris = satu bulan",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Ini pola snapshot bulanan — setiap nasabah punya satu baris per bulan. COUNT(*) = jumlah snapshot, bukan jumlah nasabah unik."
      />

      <Quiz
        question="Survei kepuasan (1–5) dirata-rata jadi 3,7 lalu dilaporkan 'nasabah puas'. Apa masalah utamanya?"
        options={[
          "Tidak ada — 3,7 di atas 3 jadi memang puas",
          "Skor kepuasan ordinal: jarak 1→2 belum tentu sama dengan 4→5, jadi mean 3,7 tidak bermakna",
          "Sampelnya kurang besar",
          "Harusnya pakai standar deviasi juga",
        ]}
        correct={1}
        explanation="Tepat: skala ordinal dilarang dirata-rata. Laporkan median + % skor 4–5. Mean 3,7 memberi presisi palsu atas jarak yang tidak pernah diukur."
      />

      <Quiz
        question="Suhu naik dari 20°C ke 40°C. Pernyataan mana yang BENAR?"
        options={[
          "Suhu menjadi 2x lipat lebih panas",
          "Suhu naik 20°C — klaim kelipatan tidak valid untuk skala interval",
          "Suhu naik 100% dalam skala Kelvin",
          "Tidak bisa dibandingkan sama sekali",
        ]}
        correct={1}
        explanation="Benar: 40°C bukan 2x 20°C (dalam Kelvin hanya 313K/293K ≈ 1,07x). Skala interval mengizinkan selisih, melarang klaim rasio — nol Celsius itu nol palsu."
      />

      <Quiz
        question="Nomor punggung pemain: 7, 10, 11. Rata-rata = 9,33. Apa makna angka ini?"
        options={[
          "Nomor punggung rata-rata tim",
          "Tidak ada maknanya — nomor punggung nominal, rata-rata tidak valid",
          "Median nomor punggung lebih tepat",
          "Harus dibulatkan jadi 9",
        ]}
        correct={1}
        explanation="Benar: nomor punggung adalah label (nominal). 'Rata-rata 9,33' tidak menunjuk pemain mana pun dan tidak bermakna. Yang valid hanya frekuensi — misal nomor 10 paling populer."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Nominal</strong> = label buta angka → hanya modus/frekuensi. <em>Jangan pakai:</em> mean/median/SD apa pun yang berbentuk angka.</li>
          <li><strong>Ordinal</strong> = urutan tanpa jarak pasti → median/modus. <em>Jangan pakai:</em> mean skor — mapping angkanya buatanmu.</li>
          <li><strong>Interval</strong> = jarak sama, nol palsu → mean/SD valid, selisih bermakna. <em>Jangan pakai:</em> klaim "N kali lipat".</li>
          <li><strong>Rasio</strong> = nol absolut → semua operasi valid. <em>Jangan pakai:</em> asumsi otomatis — pastikan kolom angka bukan berkedok (kode, tahun, skor).</li>
          <li><strong>Grain:</strong> "satu baris = ___" ditulis dulu; pasangan (kolom, grain) yang menentukan skala, bukan kolom sendirian.</li>
          <li><strong>Tes 10 detik:</strong> tes label → tes urutan → tes nol → tes grain.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a12-pemusatan" className="btn btn-primary btn-sm">Next: A1.2 →</Link>
      </div>
    </div>
  );
}
