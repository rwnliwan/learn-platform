"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR3Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const signalData = [
    {
      x: ["Nominal", "Velocity", "Device baru", "Lokasi anomali", "Jam aneh", "Kategori baru", "Alamat mismatch", "Email baru"],
      y: [0.42, 0.61, 0.55, 0.48, 0.31, 0.28, 0.52, 0.44],
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  const coverageData = [
    {
      x: ["Transaksi", "Device", "Sesi/login", "Perilaku", "Geolokasi", "Graph relasi"],
      y: [100, 82, 74, 45, 58, 30],
      type: "bar",
      marker: { color: ["#7bc96f", "#7bc96f", "#e8a838", "#e05252", "#e8a838", "#e05252"] },
      text: ["100%", "82%", "74%", "45%", "58%", "30%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Bangun 'sidik jari' transaksi: gabungkan 5 sinyal jadi satu skor risiko
# Data sintetis: 8 transaksi e-wallet
trx = [
    # (nominal_jt, device_baru, jam, lokasi_baru, velocity_1h)
    (0.2, 0, 14, 0, 2),
    (1.5, 1,  3, 1, 9),   # <- mencurigakan?
    (0.5, 0, 20, 0, 3),
    (3.0, 1,  2, 1, 12),  # <- sangat mencurigakan?
    (0.1, 0, 10, 0, 1),
    (0.8, 0, 15, 0, 4),
    (2.0, 0,  4, 1, 7),
    (0.3, 1, 11, 0, 2),
]

def skor(nominal, device_baru, jam, lokasi_baru, vel):
    s = 0
    s += min(nominal / 2.0, 1.0) * 25        # nominal (maks 25)
    s += device_baru * 20                    # device baru (20)
    s += (1 if (jam < 5 or jam > 23) else 0) * 15   # jam aneh (15)
    s += lokasi_baru * 20                    # lokasi baru (20)
    s += min(vel / 10.0, 1.0) * 20           # velocity (maks 20)
    return s

for i, t in enumerate(trx):
    s = skor(*t)
    flag = "🚨 TAHAN" if s >= 60 else ("⚠️ review" if s >= 35 else "✅ lolos")
    print(f"trx-{i+1}: skor={s:5.1f}  {flag}")
print()
print("COBA UBAH: bobot 'jam aneh' 15 -> 40.")
print("Lihat trx mana yang berubah status. Pelajaran: skor = OPINI yang dikuantifikasi.")
print("Bobot yang kamu pilih menentukan siapa yang ditahan — dan siapa yang marah.")`;

  const lab2Code = `# Device fingerprint sederhana: seberapa 'baru' sebuah device?
# Fingerprint = gabungan atribut; di sini disederhanakan jadi string
import hashlib

def fingerprint(os, browser, resolusi, bahasa, timezone):
    mentah = f"{os}|{browser}|{resolusi}|{bahasa}|{timezone}"
    return hashlib.md5(mentah.encode()).hexdigest()[:10]

dikenal = {
    fingerprint("Android 14", "Chrome 120", "1080x2400", "id-ID", "WITA"),
    fingerprint("Android 14", "Chrome 121", "1080x2400", "id-ID", "WITA"),
}

percobaan = [
    ("Android 14", "Chrome 120", "1080x2400", "id-ID", "WITA"),   # device lama
    ("Android 14", "Chrome 122", "1080x2400", "id-ID", "WITA"),   # update browser
    ("iOS 17", "Safari 17", "1170x2532", "en-US", "WIB"),          # device asing
]

for p in percobaan:
    fp = fingerprint(*p)
    status = "dikenal ✅" if fp in dikenal else "BARU ⚠️"
    print(f"{fp}  {status}   {p[0]}, {p[1]}")
print()
print("COBA UBAH: ganti 'Chrome 122' -> 'Chrome 120' pada baris 2.")
print("Pelajaran nyata: fingerprint yang terlalu kaku (exact match) akan")
print("menandai 'update browser rutin' sebagai device baru -> false positive.")
print("Sistem produksi memakai FUZZY matching (mis. 4 dari 5 atribut cocok).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR3 — Fraud / ML Analytics</span>
        <h1 className="display-title">Data Fraud: 6 Sumber Sinyal<br />dari Transaksi sampai Graph</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Transaksi Rp50 Ribu yang &ldquo;Bersih&rdquo; tapi Kotor</a></li>
          <li><a href="#enam">6 Sumber Sinyal: Anatomi Satu Transaksi</a></li>
          <li><a href="#device">Device Fingerprint: KTP-nya Sebuah HP</a></li>
          <li><a href="#sinyal">Kekuatan Sinyal: Tidak Semua Bukti Sama Kuat</a></li>
          <li><a href="#gabung">Menggabungkan Sinyal: Rumus Skor Risiko</a></li>
          <li><a href="#lab1">🔬 Lab 1: Rakit Skor Risiko dari 5 Sinyal</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Device Fingerprint</a></li>
          <li><a href="#worked">📐 Worked Example: Membangun Fitur Velocity dari Log Mentah</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Data Exhaust — Jejak yang Tak Terhindarkan</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Sinyal Mana untuk Kasus Apa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Sumber Data Mana Dulu?</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: ATO via Social Engineering OTP</a></li>

          <li><a href="#case">📋 Mini-Case: 4 Transaksi, 1 Penipu — Temukan Dia</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Data Fraud</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyebutkan <strong>6 sumber sinyal fraud</strong> (transaksi, device, sesi, perilaku, geolokasi, graph) beserta contoh atribut tiap sumber.</li>
          <li>Menjelaskan cara kerja <strong>device fingerprinting</strong> dan jebakan exact-match-nya.</li>
          <li>Menggabungkan beberapa sinyal menjadi <strong>skor risiko</strong> tertimbang dengan rumus eksplisit.</li>
          <li>Memilih kombinasi sinyal yang tepat untuk tiap tipe fraud (card, ATO, mule).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Transaksi Rp50 Ribu yang &ldquo;Bersih&rdquo; tapi Kotor</h2>
      <div className="story">
        <p>Tim fraud &ldquo;DanaKita&rdquo; punya rule sederhana: tahan transaksi di atas Rp1 juta dari device baru. Suatu pagi, 40 transaksi <strong>Rp50 ribu</strong> lolos mulus — di bawah ambang, nominal kecil, tidak ada yang ditahan. Tiga hari kemudian: 40 akun itu masing-masing menarik Rp5 juta. Total Rp200 juta hilang.</p>
        <p>Yang terjadi: penyerang melakukan <strong>&ldquo;warming&rdquo;</strong> — transaksi kecil yang terlihat normal untuk membangun riwayat, lalu menyerang besar. Rule yang hanya melihat <em>nominal transaksi ini</em> buta total. Yang bisa menangkapnya? <strong>Sinyal di luar nominal</strong>: 40 akun dibuat di hari yang sama, dari 3 device yang sama, login jam 2–4 pagi, lalu semuanya &ldquo;aktif&rdquo; bersamaan.</p>
        <p>Twist-nya: data untuk menangkap pola ini <strong>sudah ada semua</strong> di log mereka — device ID, timestamp, IP. Mereka hanya tidak pernah <em>menggabungkannya</em>. Lesson ini: fraud detection bukan soal data yang kurang, tapi soal <strong>sinyal yang belum dirakit</strong>.</p>
      </div>

      <h2 id="enam">6 Sumber Sinyal: Anatomi Satu Transaksi</h2>
      <p>Satu kali tap &ldquo;bayar&rdquo; menghasilkan 6 lapisan data. Analis junior hanya melihat lapisan 1; analis senior membaca semuanya:</p>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>#</th><th>Sumber</th><th>Contoh atribut</th><th>&ldquo;Kepribadian&rdquo;</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>Transaksi</strong></td><td>nominal, merchant/kategori, channel, timestamp</td><td>Si Terus Terang — yang paling mudah dibaca, tapi paling mudah dimanipulasi</td></tr>
            <tr><td>2</td><td><strong>Device</strong></td><td>fingerprint, OS/browser, rooted/jailbreak, emulator</td><td>Si KTP — sulit dipalsukan total, tapi bisa &ldquo;dipinjam&rdquo;</td></tr>
            <tr><td>3</td><td><strong>Sesi / login</strong></td><td>IP, ASN, login sukses/gagal, durasi sesi, perubahan kredensial</td><td>Si Penjaga Pintu — tahu siapa masuk dari mana</td></tr>
            <tr><td>4</td><td><strong>Perilaku</strong></td><td>kecepatan ketik, pola navigasi, waktu di tiap layar, copy-paste</td><td>Si Pengamat Gerak-gerik — bot ketahuan di sini</td></tr>
            <tr><td>5</td><td><strong>Geolokasi</strong></td><td>GPS, kota, jarak dari lokasi biasa, impossible travel</td><td>Si Tukang Geledah — &ldquo;katanya di Makassar, kok IP-nya di Surabaya 10 menit lalu?&rdquo;</td></tr>
            <tr><td>6</td><td><strong>Graph relasi</strong></td><td>device dipakai N akun, akun berbagi nomor HP/alamat</td><td>Si Detektif Jaringan — melihat yang tak terlihat dari satu transaksi</td></tr>
          </tbody>
        </table>
      </div>

      <PlotlyChart
        data={coverageData}
        title="Ketersediaan Data per Sumber Sinyal di Perusahaan Tipikal (%)"
        layout={{ xaxis: { title: "Sumber sinyal" }, yaxis: { title: "% perusahaan yang punya datanya" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = sumber sinyal, tinggi batang = persen perusahaan fintech/bank tipikal yang datanya sudah tersedia dan siap pakai.</p>
        <p><strong>Interpretasi:</strong> data transaksi ada di mana-mana (100%), tapi sinyal paling diskriminatif — perilaku (45%) dan graph (30%) — justru paling jarang siap. <strong>Pelajaran karir:</strong> analis yang bisa membangun pipeline sinyal perilaku/graph adalah yang paling langka dan paling dicari (lihat hasil riset lowongan: &ldquo;investigate fraud cases and networks&rdquo;).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak data = makin bagus deteksinya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> data yang <strong>tidak digabungkan</strong> = beban, bukan aset. DanaKita punya semua data warming attack tapi tetap kebobolan Rp200 juta. Yang membedakan bukan volume data, melainkan <strong>apakah sinyal-sinyal itu dirakit menjadi fitur yang bisa dibaca model</strong> (itulah FR6).</p>
      </div>

      <h2 id="device">Device Fingerprint: KTP-nya Sebuah HP</h2>
      <p><strong>Definisi.</strong> Device fingerprint adalah identitas probabilistik sebuah perangkat, dirakit dari puluhan atribut: OS + versi, browser + versi, resolusi layar, bahasa, timezone, font terinstal, canvas rendering, hingga sensor.</p>
      <p><strong>Kenapa penting:</strong> akun bisa ganti, nomor HP bisa ganti, tapi device fisik sulit diganti massal. Satu device yang dipakai 40 akun baru = sinyal warming/farming yang sangat kuat (kasus DanaKita!).</p>
      <p><strong>Jebakannya (penting!):</strong> fingerprint yang <em>exact match</em> akan menandai &ldquo;Chrome update dari v120 ke v121&rdquo; sebagai device baru → banjir false positive. Sistem produksi memakai <strong>fuzzy matching</strong>: &ldquo;4 dari 5 atribut inti cocok = device yang sama&rdquo;. Trade-off abadi: terlalu kaku = berisik, terlalu longgar = penipu lolos dengan spoofing ringan.</p>

      <details className="worked">
        <summary>📐 Contoh: kapan fingerprint menyelamatkan, kapan menipu</summary>
        <p><strong>Menyelamatkan:</strong> 40 akun baru, semua dari 2 fingerprint yang sama → farming terdeteksi sebelum serangan besar. Tanpa fingerprint, 40 akun itu terlihat sebagai 40 orang berbeda.</p>
        <p><strong>Menipu:</strong> warnet/kantor dengan 50 karyawan memakai 5 PC yang sama → 50 akun &ldquo;berbagi device&rdquo;. Tanpa konteks (IP kantor, jam kerja), rule &ldquo;1 device = maks 3 akun&rdquo; akan memblokir karyawan yang tidak bersalah.</p>
      </details>

      <h2 id="sinyal">Kekuatan Sinyal: Tidak Semua Bukti Sama Kuat</h2>
      <p>Setiap sinyal punya <strong>kekuatan bukti</strong> berbeda, diukur dari seberapa baik ia memisahkan fraud dari normal (mis. via information value atau lift — detail di FR9). Ilustrasi kekuatan relatif:</p>

      <PlotlyChart
        data={signalData}
        title="Kekuatan Diskriminatif Tiap Sinyal (ilustrasi, information value)"
        layout={{ xaxis: { title: "Sinyal" }, yaxis: { title: "Information value" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = sinyal, tinggi batang = information value (semakin tinggi = semakin baik memisahkan fraud vs normal). Angka ilustrasi pola umum industri.</p>
        <p><strong>Interpretasi:</strong> <strong>velocity</strong> (0,61) dan <strong>device baru</strong> (0,55) adalah raja — perilaku &ldquo;cepat &amp; asing&rdquo; adalah inti hampir semua serangan. Nominal saja (0,42) kalah kuat — sesuai cerita DanaKita: penipu sengaja mengecilkan nominal. <strong>Pelajaran:</strong> jangan bangun pertahanan di atas sinyal terlemah (nominal) saja.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sinyal terkuat selalu tentang <strong>perubahan dan kecepatan</strong>, bukan nilai statis. &ldquo;Device baru + 9 transaksi/jam + jam 3 pagi&rdquo; jauh lebih mencurigakan daripada &ldquo;transaksi Rp10 juta&rdquo; sendirian. Fraud adalah <em>perilaku menyimpang</em>, bukan <em>angka besar</em>.</p>
      </div>

      <h2 id="gabung">Menggabungkan Sinyal: Rumus Skor Risiko</h2>
      <p>Skor risiko paling sederhana = jumlah tertimbang sinyal:</p>
      <Tex math={String.raw`S = \sum_{i=1}^{k} w_i \cdot s_i \quad \text{dengan} \quad \sum w_i = 100`} block />
      <ul>
        <li><Tex math={String.raw`s_i`} />: skor sinyal ke-<Tex math={String.raw`i`} /> (dinormalisasi 0–1).</li>
        <li><Tex math={String.raw`w_i`} />: bobot — <strong>opini analis yang dikuantifikasi</strong>. Bobot besar = &ldquo;saya percaya sinyal ini&rdquo;.</li>
        <li><Tex math={String.raw`S`} />: skor total 0–100, dibandingkan dengan threshold (FR11).</li>
      </ul>
      <p><strong>Contoh:</strong> nominal 25 + device baru 20 + jam aneh 15 + lokasi baru 20 + velocity 20 = 100. Transaksi dengan S ≥ 60 ditahan, 35–60 direview manual.</p>
      <p><strong>Yang harus dipahami:</strong> skor ini bukan &ldquo;kebenaran&rdquo; — ia adalah <strong>hipotesis analis yang bisa diuji</strong>. Kalau bobot &ldquo;jam aneh&rdquo; terlalu besar, nasabah shift malam akan protes (false positive). Tuning bobot dari data = champion-challenger (FR5).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Skor 85 berarti 85% kemungkinan fraud.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> skor 85 hanyalah &ldquo;85 dari 100 poin kecurigaan menurut bobot yang <em>kita</em> tentukan&rdquo;. Ia <strong>bukan probabilitas</strong> kecuali sudah dikalibrasi (kalibrasi = memastikan skor 85 benar-benar fraud 85% dari waktu — topik FR9/FR17). Skor tanpa kalibrasi = peringkat, bukan peluang.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Rakit Skor Risiko dari 5 Sinyal</h2>
      <p>Lihat bagaimana bobot menentukan nasib transaksi.</p>
      <PyodideLab
        title="Lab 1 — Skor Risiko Tertimbang (5 Sinyal)"
        hint="Ubah bobot tiap sinyal. Transaksi mana yang tadinya lolos jadi ditahan? Itulah kekuatan (dan bahaya) subjektivitas analis."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Device Fingerprint</h2>
      <PyodideLab
        title="Lab 2 — Fingerprint: Exact Match vs Realita"
        hint="Ubah atribut device dan lihat statusnya. Pikirkan: berapa banyak 'device baru' palsu yang dihasilkan tiap update browser massal?"
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Dari Log Mentah ke Fitur Siap Model</h2>
      <p>Data tidak datang dalam bentuk fitur — ia datang sebagai log berantakan. Dua contoh cara analis mengubahnya menjadi sinyal.</p>

      <details className="worked">
        <summary>📐 Contoh 1: fitur velocity_1h dari 8 baris log</summary>
        <p>Log kartu X (waktu, nominal): 09.02 Rp150rb; 09.15 Rp200rb; 09.31 Rp175rb; 09.44 Rp2,8jt; 09.47 Rp3,1jt; 09.52 Rp2,5jt; 10.20 Rp120rb; 11.05 Rp90rb.</p>
        <p><strong>Langkah 1 — definisikan fitur:</strong> <em>velocity_1h</em> = jumlah transaksi kartu ini dalam 60 menit ke belakang (termasuk transaksi saat ini).</p>
        <p><strong>Langkah 2 — hitung per transaksi.</strong> 09.02 → 1; 09.15 → 2; 09.31 → 3; 09.44 → 4; 09.47 → 5; 09.52 → 6; 10.20 → 4 (09.02 &amp; 09.15 sudah keluar jendela); 11.05 → 1.</p>
        <p><strong>Langkah 3 — baca polanya.</strong> Ada <em>dua rezim</em>: 09.02–09.31 (3 transaksi kecil, nominal wajar — seperti belanja normal) lalu 09.44–09.52 (3 transaksi besar beruntun, total Rp8,4 juta dalam 8 menit). Fitur tambahannya: <em>amount_velocity_1h</em> = Rp8,4 jt pada 09.52 vs rata-rata historis kartu ini Rp180rb/hari.</p>
        <p><strong>Interpretasi:</strong> pola klasik &ldquo;test kecil lalu gas&rdquo; — pencuri mengetes kartu masih aktif dengan nominal kecil, lalu menguras. Satu fitur velocity tidak cukup; <strong>kombinasi count-velocity + amount-velocity + perubahan rezim</strong> yang menjadi sinyal kuat. Inilah kenapa FR6 (feature engineering) adalah lesson tersendiri.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: memilih window — 1 jam vs 24 jam (trade-off nyata)</summary>
        <p>Kasus: deteksi ATO dengan fitur &ldquo;login dari device baru&rdquo;. Dua kandidat window:</p>
        <p><strong>Window 1 jam:</strong> dari data historis, menangkap 62% ATO dalam 1 jam pertama (recall 62%), tapi juga mem-flag 0,8% login normal (misal orang ganti HP dan langsung belanja). Dengan 500.000 login/hari → 4.000 flag/hari, 3 dari 4 adalah false positive.</p>
        <p><strong>Window 24 jam:</strong> recall naik ke 81% (menangkap ATO yang &ldquo;tidur&rdquo; dulu 12 jam sebelum beraksi — pola umum!), tapi flag normal naik ke 2,1% → 10.500 flag/hari.</p>
        <p><strong>Keputusan:</strong> tidak ada jawaban universal — tergantung <strong>kapasitas review</strong> (FR11). Tim dengan 20 investigator memakai window 1 jam + skor model untuk memprioritaskan; tim dengan otomasi blokir memakai 24 jam untuk recall. Pelajaran: window agregasi bukan pilihan teknis murni — ia <strong>kontrak antara akurasi dan kapasitas operasional</strong>.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Data Exhaust — Jejak yang Tak Terhindarkan</h2>
      <p>Setiap transaksi meninggalkan <strong>data exhaust</strong> — asap knalpot digital: timestamp, device, IP, nominal. Penjahat bisa memalsukan <em>identitas</em>, tapi ia <strong>tidak bisa bertransaksi tanpa meninggalkan exhaust</strong>. Inilah asimetri fundamental yang membuat pertahanan mungkin: <em>penyerang butuh 1 keberhasilan; pembela butuh 1 jejak</em> — dan jejak selalu ada.</p>
      <p>Intuisi kedua: <strong>kualitas &gt; kuantitas, dan konteks &gt; keduanya</strong>. 10 kolom yang akurat (timestamp presisi detik, device fingerprint stabil, nominal benar) mengalahkan 100 kolom yang setengah rusak. Dan 1 kolom <em>dengan konteks waktu yang benar</em> (timezone UTC, bukan waktu server yang ngawur) mengalahkan semuanya. Sebagian besar &ldquo;model buruk&rdquo; sebenarnya adalah <strong>data buruk yang dimodelkan dengan baik</strong>.</p>
      <p><strong>Kapan pengumpulan data ini TIDAK berguna:</strong> (1) data tanpa <em>timestamp yang bisa dipercaya</em> — velocity dari jam yang salah = fiksi; (2) data yang tidak bisa dihitung <em>ulang</em> dengan konsisten (fitur training vs serving beda rumus = model hancur); (3) data yang melanggar privasi tanpa dasar hukum — di Indonesia, UU PDP berlaku; <em>data minimization</em> bukan sekadar etika, tapi kewajiban. Kumpulkan yang <strong>perlu &amp; legal</strong>, bukan yang <em>bisa</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum meminta data baru, tanyakan: <strong>&ldquo;jejak apa yang <em>terpaksa</em> ditinggalkan penjahat di kasus ini?&rdquo;</strong> Jawabannya = spesifikasi datamu. Data yang dikumpulkan dari keterpaksaan musuh selalu lebih berharga daripada data yang dikumpulkan karena &ldquo;bagus untuk dimiliki&rdquo;.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Sinyal Mana untuk Kasus Apa</h2>

      <div className="decision-card">
        <h3>1. Card fraud (kartu curian belanja online) → <strong>transaksi + geolokasi + device</strong></h3>
        <p><strong>Kondisi:</strong> nominal besar, kategori berisiko (elektronik/emas), pertama kali.</p>
        <p><strong>Sinyal kunci:</strong> alamat kirim ≠ alamat tagihan, lokasi jauh dari biasa, device baru. Kombinasi ketiganya = presisi tinggi.</p>
        <p><strong>Contoh nyata:</strong> kartu terbit di Jakarta, dipakai beli iPhone Rp18 jt dengan pengiriman ke kota lain dari device baru → tahan.</p>
      </div>

      <div className="decision-card">
        <h3>2. ATO (akun dibajak) → <strong>sesi + perilaku + device</strong></h3>
        <p><strong>Kondisi:</strong> login dari IP/ASN baru, lalu transaksi menyimpang.</p>
        <p><strong>Sinyal kunci:</strong> perubahan kredensial baru-baru ini + device asing + kecepatan navigasi tidak wajar (bot) atau terlalu ragu (penipu manusia membaca-baca).</p>
        <p><strong>Contoh nyata:</strong> ganti email 10 menit lalu + login dari emulator + langsung transfer maksimal → tahan + verifikasi ulang.</p>
      </div>

      <div className="decision-card">
        <h3>3. Mule / farming (jaringan) → <strong>graph + device + sesi</strong></h3>
        <p><strong>Kondisi:</strong> banyak akun, masing-masing terlihat &ldquo;normal&rdquo; sendirian.</p>
        <p><strong>Sinyal kunci:</strong> N akun berbagi 1 device, dibuat berdekatan, aktif bersamaan. Tidak ada sinyal tunggal yang cukup — harus <strong>agregat lintas akun</strong>.</p>
        <p><strong>Contoh nyata:</strong> kasus DanaKita — 40 akun, 3 device, jam 2–4 pagi. Graph menangkapnya dalam 1 query.</p>
      </div>

      <div className="decision-card">
        <h3>4. APP scam (korban transfer sukarela) → <strong>perilaku + edukasi (bukan sinyal teknis)</strong></h3>
        <p><strong>Kondisi:</strong> device benar, OTP benar, lokasi benar — semua sinyal teknis &ldquo;bersih&rdquo;.</p>
        <p><strong>Sinyal kunci:</strong> keraguan perilaku (bolak-balik layar konfirmasi, mengetik-menghapus nomor rekening) + rekening tujuan baru. Senjata utama: <strong>friction</strong> (jeda + peringatan), bukan blokir.</p>
        <p><strong>Contoh nyata:</strong> pop-up &ldquo;Rekening ini baru pertama kali menerima darimu. Yakin? Tunggu 30 detik.&rdquo;</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Satu sinyal = gosip; <strong>tiga sinyal independen = bukti</strong>. Jangan tahan transaksi dari 1 sinyal.</li>
          <li>Sinyal terkuat = <strong>perubahan + kecepatan</strong> (device baru, velocity, lokasi aneh).</li>
          <li>Kasus jaringan (mule/farming) <strong>tidak bisa</strong> dilihat dari satu transaksi — butuh agregat lintas akun.</li>
          <li>Skor = opini terkuantifikasi. Kalibrasi dan uji sebelum percaya (FR9).</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Membangun Pipa Data</h2>
      <p>Setelah tahu <em>jenis</em> datanya, pertanyaan berikutnya: <strong>urutan membangunnya</strong>. Tiga skenario prioritas:</p>
      <p><strong>Skenario A — startup e-wallet baru, data minim.</strong> Mulai dari yang murah &amp; sudah ada: <strong>log transaksi + data device dasar</strong> (device ID, IP, jam). Ini menangkap 60–70% pola umum (velocity, device baru, jam aneh) tanpa investasi infra. Behavioral biometrics dan graph menyusul di tahun kedua. Aturan: <em>data yang kamu punya hari ini &gt; data ideal yang butuh 6 bulan dibangun</em>.</p>
      <p><strong>Skenario B — real-time vs batch feature.</strong> Fitur &ldquo;jumlah transaksi 1 jam terakhir&rdquo; untuk keputusan blokir <em>harus</em> real-time (dihitung dalam &lt; 50ms saat transaksi masuk). Fitur &ldquo;rata-rata 30 hari&rdquo; cukup batch harian. Aturan praktis: <strong>window ≤ 24 jam → real-time; window &gt; 24 jam → batch</strong>. Memaksakan semua real-time = biaya infra 10× untuk gain akurasi 2%.</p>
      <p><strong>Skenario C — data pihak ketiga (device intelligence, blacklist).</strong> Beli jika: (1) kamu tidak punya skala untuk membangunnya sendiri (butuh jutaan device untuk reputasi device yang bermakna), (2) fraud-mu lintas-merchant (kartu curian dipakai di banyak toko — satu merchant tidak melihat polanya). Jangan beli jika datamu sendiri sudah kaya dan fraud-mu spesifik internal (first-party) — vendor generik tidak membantu.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> fitur terbaik bukan yang paling canggih — tapi yang <strong>paling stabil dihitung ulang setiap hari</strong>. Fitur eksotis yang rusak tiap ada perubahan skema database lebih merugikan daripada fitur sederhana yang tidak pernah down. Dalam fraud, reliabilitas pipa data <em>adalah</em> akurasi model.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Pembajakan Akun via &ldquo;Kurir Paket&rdquo;</h2>
      <p>Modus yang marak 2023–2025: korban menerima telepon/WA dari &ldquo;kurir&rdquo; yang tahu nama &amp; alamatnya (data bocor), diminta menyebutkan kode OTP &ldquo;untuk verifikasi paket&rdquo;. Dalam 10 menit: akun e-commerce/e-wallet diambil alih, alamat kirim diganti ke kos-kosan, checkout barang elektronik pakai saldo &amp; paylater korban.</p>
      <p><strong>Jejak data yang ditinggalkan</strong> (inilah yang harus ditangkap pipa datamu):</p>
      <ol>
        <li><strong>Device baru + login sukses pertama kali</strong> — device fingerprint belum pernah terlihat untuk akun ini.</li>
        <li><strong>Ganti alamat kirim</strong> dalam &lt; 30 menit setelah login device baru.</li>
        <li><strong>Velocity checkout:</strong> 3–5 transaksi nominal besar dalam 15 menit, padahal histori akun: 2 transaksi/bulan nominal &lt; Rp300rb.</li>
        <li><strong>Jam tidak wajar</strong> relatif terhadap pola akun (02.00 dini hari untuk akun yang selalu belanja siang).</li>
        <li><strong>Cash-out pattern:</strong> barang digital/voucher — tidak perlu alamat fisik valid.</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> dari 10.000 kasus ATO terkonfirmasi di satu platform, 7.300 (73%) menunjukkan kombinasi device-baru + ganti-alamat + velocity. Artinya: <strong>tiga fitur sederhana menangkap hampir tiga perempat kasus</strong> — tanpa ML canggih. Pelajaran untuk analis data: sebelum membangun model deep learning, pastikan tiga fitur murah ini sudah dihitung dengan benar dan real-time.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Kalau pakai OTP, akun aman dari ATO.&rdquo;<br /><strong>Yang benar:</strong> OTP mengamankan <em>kanal teknis</em>, bukan <em>manusia</em>. Social engineering mem-bypass OTP dengan meminta korbannya sendiri yang membacakan kodenya. Data menunjukkan mayoritas ATO Indonesia 2023–2025 melibatkan OTP yang &ldquo;sah&rdquo; secara teknis tapi diberikan secara sukarela. Pertahanan harus berlapis: OTP + behavioral + device — karena penyerang hanya butuh satu lapisan yang lengah.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 4 Transaksi, 1 Penipu — Temukan Dia</h2>
      <div className="callout">
        <p>Empat transaksi e-wallet pagi ini (semua nominal wajar, tidak ada yang &gt;Rp1 juta):</p>
        <ul>
          <li><strong>T1:</strong> Rp400 rb, device dikenal, jam 09:12, lokasi biasa, 2 trx/jam</li>
          <li><strong>T2:</strong> Rp750 rb, device baru, jam 03:40, lokasi baru (beda pulau), 11 trx/jam, akun dibuat 2 hari lalu</li>
          <li><strong>T3:</strong> Rp900 rb, device dikenal, jam 13:05, lokasi biasa, 1 trx/jam</li>
          <li><strong>T4:</strong> Rp600 rb, device baru, jam 10:20, lokasi biasa, 3 trx/jam, akun 3 tahun</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Urutkan T1–T4 dari paling mencurigakan, (b) sinyal apa yang paling menentukan urutanmu, (c) T4 — tahan atau tidak?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>T2 &gt; T4 &gt; T3 &gt; T1.</strong> T2 mengumpulkan LIMA sinyal merah sekaligus (device baru + jam aneh + lokasi aneh + velocity tinggi + akun baru) — ini pola warming/farming klasik. T1 bersih total.</p>
          <p>(b) Bukan nominal (semuanya &lt;Rp1 juta!) — melainkan <strong>kombinasi perubahan + kecepatan + umur akun</strong>. Satu sinyal merah = waspada; lima = tahan.</p>
          <p>(c) <strong>Jangan tahan otomatis — review ringan.</strong> T4 hanya punya 1 sinyal merah (device baru) pada akun tua 3 tahun — pola khas &ldquo;ganti HP&rdquo;. Menahannya = false positive yang bikin nasabah marah. Respons tepat: step-up authentication (minta OTP/biometrik), bukan blokir.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Data Fraud</h2>
      <details className="worked">
        <summary>Q1: Kalau budget terbatas, data apa yang dikumpulkan duluan?</summary>
        <p><strong>Urutan ROI:</strong> (1) log transaksi lengkap + timestamp presisi (gratis — sudah ada); (2) device fingerprint dasar (murah, menangkap 60%+ ATO); (3) histori per entitas untuk baseline (butuh storage, bukan teknologi mahal); (4) baru kemudian: behavioral biometrics, data vendor. Aturan: <em>maksimalkan yang gratis dulu</em> — kebanyakan tim belum memeras habis log yang sudah mereka miliki sebelum belanja tool baru.</p>
      </details>
      <details className="worked">
        <summary>Q2: Kapan layak beli data dari vendor (device intelligence, blacklist)?</summary>
        <p>Jika <strong>dua syarat</strong> terpenuhi: (a) fraud-mu <em>lintas-merchant</em> (kartu curian dipakai di banyak toko — kamu tidak melihat polanya sendirian), dan (b) skala-mu terlalu kecil untuk membangun reputasi device sendiri (butuh jutaan device agar skor reputasi bermakna). Jika fraud-mu <em>internal</em> (first-party, insider) — vendor generik hampir tidak membantu; investasikan di data internal.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana dengan privasi — UU PDP membatasi apa?</summary>
        <p>Prinsipnya: <strong>kumpulkan minimal yang diperlukan</strong> untuk tujuan pencegahan fraud yang sah, <strong>amankan</strong> (enkripsi, akses terbatas), dan <strong>beri dasar hukum</strong> (persetujuan + kepentingan sah + kewajiban regulasi). Yang dilarang: mengumpulkan data di luar tujuan (misal memakai data fraud untuk marketing tanpa izin), menyimpan selamanya tanpa retensi, dan membagikan ke pihak ketiga tanpa dasar. <em>Privacy by design</em> = arsitek data yang baik sejak awal, bukan tambalan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Seberapa &ldquo;real-time&rdquo; data harus tersedia?</summary>
        <p>Tergantung <em>keputusan</em> yang diambil (FR13): blokir saat transaksi = butuh &lt; 50ms (Redis/feature store); review manual 15 menit kemudian = cukup batch 5-menit; analisis jaringan mingguan = cukup batch harian. <strong>Real-time adalah spektrum, bukan saklar.</strong> Kesalahan mahal: memaksakan semua data real-time (biaya 10×) atau menganggap batch harian cukup untuk blokir (kebocoran total).</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 40 akun baru dari 3 device yang sama, aktif jam 2–4 pagi. Sinyal apa yang PALING menentukan ini serangan terkoordinasi?"
        options={[
          "Nominal transaksi",
          "Graph relasi (banyak akun ↔ sedikit device) + sesi (jam)",
          "Kategori merchant",
          "Warna aplikasi",
        ]}
        correct={1}
        explanation="Benar: graph + sesi. Tiap akun sendirian terlihat normal (nominal kecil). Polanya baru muncul saat agregat lintas akun: 40 akun berbagi 3 device."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa fingerprint exact-match berbahaya di produksi?"
        options={[
          "Terlalu lambat",
          "Update browser/OS rutin akan terdeteksi sebagai 'device baru' → banjir false positive",
          "Tidak bisa dihitung",
          "Melanggar privasi",
        ]}
        correct={1}
        explanation="Benar: atribut device berubah rutin (update Chrome, ganti bahasa). Exact match menandai semuanya sebagai baru. Solusi: fuzzy matching."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Skor risiko 85 dari rule tertimbang berarti…"
        options={[
          "85% kemungkinan fraud",
          "85 poin kecurigaan menurut bobot analis — BUKAN probabilitas, kecuali sudah dikalibrasi",
          "Pasti fraud",
          "Tidak ada artinya",
        ]}
        correct={1}
        explanation="Benar: skor = opini terkuantifikasi. Tanpa kalibrasi ia hanya peringkat. Menganggapnya probabilitas adalah kesalahan klasik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Sinyal dengan information value tertinggi untuk fraud umumnya…"
        options={[
          "Nominal transaksi",
          "Velocity dan device baru — perubahan + kecepatan",
          "Hari dalam seminggu",
          "Jenis kelamin",
        ]}
        correct={1}
        explanation="Benar: velocity + device baru. Fraud adalah perilaku menyimpang yang cepat dan asing — bukan sekadar angka besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Transaksi APP scam (korban transfer sukarela karena ditipu). Sinyal teknis (device/IP/lokasi) semuanya bersih. Respons terbaik?"
        options={[
          "Blokir semua transfer ke rekening baru",
          "Friction: jeda + peringatan + sinyal keraguan perilaku — karena tidak ada anomali teknis yang bisa diandalkan",
          "Naikkan limit transfer",
          "Abaikan",
        ]}
        correct={1}
        explanation="Benar: friction + edukasi. Tidak ada sinyal teknis yang bisa membedakan 'transfer sukarela normal' dari 'transfer sukarela karena ditipu'. Blokir total = membunuh bisnis."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>6 sumber sinyal</strong>: transaksi, device, sesi, perilaku, geolokasi, graph — analis senior membaca semuanya, bukan cuma nominal.</li>
          <li><strong>Device fingerprint</strong> = KTP-nya HP; pakai fuzzy matching, bukan exact match.</li>
          <li><strong>Sinyal terkuat</strong> = perubahan + kecepatan (velocity, device baru, lokasi aneh), bukan nominal.</li>
          <li><strong>Skor risiko</strong> <Tex math={String.raw`S = \sum w_i s_i`} /> = opini analis yang dikuantifikasi — kalibrasi sebelum dianggap probabilitas.</li>
          <li>Satu sinyal = gosip; <strong>tiga sinyal independen = bukti</strong>.</li>
          <li>Kasus jaringan tidak terlihat dari satu transaksi — butuh agregat lintas akun (graph).</li>
          <li>Kapan TIDAK mengandalkan sinyal teknis: APP scam — pakai friction + edukasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr2-fraud-vs-aml" className="btn btn-secondary btn-sm">← FR2</Link>
        <Link href="/learn/fr4-label-fraud" className="btn btn-primary btn-sm">Next: FR4 →</Link>
      </div>
    </div>
  );
}
