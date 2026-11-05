"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR6Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const featureGainData = [
    {
      x: ["Nominal saja", "+ velocity", "+ device age", "+ baseline deviasi", "+ impossible travel", "+ graph (shared device)"],
      y: [0.62, 0.74, 0.81, 0.87, 0.90, 0.93],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["0,62", "0,74", "0,81", "0,87", "0,90", "0,93"],
      textposition: "outside",
    },
  ];

  const windowData = [
    {
      x: ["10 mnt", "1 jam", "24 jam", "7 hari", "30 hari"],
      y: [0.31, 0.52, 0.68, 0.74, 0.71],
      type: "bar",
      marker: { color: "#e8a838" },
      text: ["0,31", "0,52", "0,68", "0,74", "0,71"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Feature engineering: window agregat + deviasi dari baseline
# Riwayat 1 user: 20 transaksi normal, lalu 3 transaksi 'serangan'
import statistics as st

riwayat = [0.3, 0.5, 0.2, 0.8, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4,
           0.2, 0.6, 0.5, 0.3, 0.8, 0.4, 0.5, 0.6, 0.3, 0.4]  # juta Rp
baru = [0.5, 4.5, 6.0]  # 3 transaksi terakhir (2 di antaranya serangan)

mu = st.mean(riwayat)
sd = st.stdev(riwayat)
print(f"Baseline user: mean={mu:.2f} jt, sd={sd:.2f} jt")
print()
for i, nominal in enumerate(baru):
    z = (nominal - mu) / sd if sd > 0 else 0
    # velocity: transaksi dalam 1 jam terakhir (simulasi)
    flag = "🚨 ANOMALI" if abs(z) > 3 else "✅ normal"
    print(f"trx baru {i+1}: Rp{nominal:.1f} jt  z={z:+.1f}  {flag}")
print()
print("COBA UBAH: ganti baseline jadi [5.0]*20 (user kaya, biasa 5 jt).")
print("Transaksi 4.5 jt yang tadi 'anomali' jadi normal!")
print("Pelajaran: anomali SELALU relatif terhadap baseline SIAPA.")`;

  const lab2Code = `# Impossible travel: bisakah orang ini berpindah secepat itu?
# Rumus: kecepatan = jarak / selisih waktu. Batas wajar ~ 900 km/jam (pesawat).
import math

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1); dl = math.radians(lon2 - lon1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))

# (kota, lat, lon, jam)
makassar = ("Makassar", -5.1477, 119.4327, 10.0)
surabaya = ("Surabaya", -7.2575, 112.7521, 10.5)   # 30 mnt kemudian!
jakarta  = ("Jakarta",  -6.2088, 106.8456, 14.0)   # 4 jam kemudian

for a, b in [(makassar, surabaya), (makassar, jakarta)]:
    jarak = haversine_km(a[1], a[2], b[1], b[2])
    dt = b[3] - a[3]
    kec = jarak / dt
    status = "🚨 IMPOSSIBLE" if kec > 900 else "✅ wajar"
    print(f"{a[0]} -> {b[0]}: {jarak:.0f} km dalam {dt:.1f} jam = {kec:.0f} km/jam  {status}")
print()
print("COBA UBAH: jam Surabaya 10.5 -> 13.0 (2.5 jam kemudian).")
print("Status berubah! Pelajaran: impossible travel = fitur FISIKA, bukan statistik.")
print("Tidak bisa 'di-tune' penipu — kecuali mereka menemukan teleportasi.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR6 — Fraud / ML Analytics</span>
        <h1 className="display-title">Feature Engineering:<br />Mengubah Jejak Menjadi Senjata</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Fitur yang Menemukan Rp1,2 Miliar</a></li>
          <li><a href="#window">Window Agregat: Melihat Pola, Bukan Titik</a></li>
          <li><a href="#baseline">Baseline per User: Anomali Itu Relatif</a></li>
          <li><a href="#travel">Impossible Travel: Fitur Fisika yang Tak Bisa Dibohongi</a></li>
          <li><a href="#recency">Recency &amp; Device: Umur Itu Sinyal</a></li>
          <li><a href="#lab1">🔬 Lab 1: Window Agregat + Deviasi Baseline</a></li>
          <li><a href="#lab2">🔬 Lab 2: Impossible Travel</a></li>
          <li><a href="#worked">📐 Worked Example: Velocity &amp; Travel Impossibility</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Fitur adalah Teori tentang Penjahat</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Fitur Apa untuk Serangan Apa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Desain Fitur</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Pinjol — KTP yang &ldquo;Hidup&rdquo; di 40 Pengajuan</a></li>

          <li><a href="#case">📋 Mini-Case: Rancang 8 Fitur untuk Serangan Warming</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Feature Engineering</a></li>

          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membangun <strong>window agregat</strong> (count/sum/distinct) pada berbagai horizon waktu dan memilih window yang tepat.</li>
          <li>Menghitung <strong>deviasi dari baseline per user</strong> (z-score personal) dan menjelaskan mengapa ini mengalahkan ambang absolut.</li>
          <li>Menghitung <strong>impossible travel</strong> dari dua titik geolokasi (haversine + kecepatan).</li>
          <li>Merancang fitur <strong>recency</strong> (umur akun/device) untuk menangkap warming/farming.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Fitur yang Menemukan Rp1,2 Miliar</h2>
      <div className="story">
        <p>Tim fraud &ldquo;KreditGo&rdquo; sudah punya model ML dengan 40 fitur. Performanya stagnan 8 bulan. Seorang analis junior — baru 3 bulan kerja — bertanya polos: <em>&ldquo;Kenapa fitur kita cuma lihat transaksi ini? Kenapa nggak lihat <strong>umur device-nya</strong>?&rdquo;</em></p>
        <p>Mereka menambahkan satu fitur: <code className="inline">device_age_days</code>. AUC naik dari 0,81 ke <strong>0,89</strong> dalam seminggu. Fitur tunggal itu menemukan ring farming Rp1,2 miliar yang lolos 8 bulan — 200 akun &ldquo;berumur&rdquo; 3–5 hari dengan pola identik, yang selama ini terlihat sebagai 200 orang berbeda.</p>
        <p>Twist-nya: bukan modelnya yang bodoh — <strong>datanya yang buta</strong>. 40 fitur semuanya menjawab &ldquo;bagaimana transaksi ini?&rdquo;; tidak satu pun menjawab &ldquo;<strong>seberapa baru pelaku di baliknya?</strong>&rdquo;. Lesson ini: dalam fraud ML, <strong>feature engineering mengalahkan tuning model 10 banding 1</strong>. Model hanyalah mesin; fitur adalah bahan bakarnya.</p>
      </div>

      <h2 id="window">Window Agregat: Melihat Pola, Bukan Titik</h2>
      <p><strong>Definisi.</strong> Window agregat = ringkasan perilaku dalam jendela waktu ke belakang: <code className="inline">count_1h</code>, <code className="inline">sum_24h</code>, <code className="inline">distinct_merchant_7d</code>, <code className="inline">max_single_30d</code>. Satu transaksi tidak bercerita; <strong>20 transaksi terakhir bercerita</strong>.</p>
      <p><strong>Tiga jenis agregat yang wajib ada:</strong></p>
      <ul>
        <li><strong>Count:</strong> berapa kali? → <code className="inline">trx_10m</code>, <code className="inline">trx_1h</code>, <code className="inline">trx_24h</code> (menangkap carding &amp; warming).</li>
        <li><strong>Sum/avg/max:</strong> seberapa besar? → <code className="inline">sum_24h</code>, <code className="inline">max_7d</code> (menangkap pengurasan).</li>
        <li><strong>Distinct:</strong> ke berapa pihak? → <code className="inline">distinct_counterparty_1h</code> (menangkap fan-out mule).</li>
      </ul>

      <PlotlyChart
        data={windowData}
        title="Kekuatan Prediktif Fitur Count per Window (ilustrasi, information value)"
        layout={{ xaxis: { title: "Window" }, yaxis: { title: "Information value" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = panjang window, tinggi batang = kekuatan memisahkan fraud vs normal.</p>
        <p><strong>Interpretasi:</strong> window <strong>10 menit terlalu pendek</strong> (noise — satu transaksi ganda karena double-tap ikut kehitung), <strong>30 hari terlalu panjang</strong> (sinyal serangan terkubur riwayat normal). Sweet spot: <strong>1 jam–7 hari</strong>. <strong>Pelajaran:</strong> window bukan &ldquo;makin panjang makin bagus&rdquo; — ia harus <strong>selaras dengan tempo serangan</strong> (warming = jam, bust-out = hari).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pilih window dengan bertanya <em>&ldquo;berapa lama serangan ini berlangsung?&rdquo;</em> Carding: menit. Warming: jam–hari. Bust-out synthetic: minggu. Window yang salah = memotret dengan shutter speed yang salah — terlalu cepat (blur noise) atau terlalu lambat (gerakan tak terlihat).</p>
      </div>

      <h2 id="baseline">Baseline per User: Anomali Itu Relatif</h2>
      <p><strong>Definisi.</strong> Baseline per user = profil &ldquo;normal&rdquo;-nya <em>orang ini</em>: rata-rata &amp; sebaran nominal, jam aktif biasa, merchant langganan. Anomali diukur sebagai <strong>deviasi dari baseline-nya sendiri</strong>:</p>
      <Tex math={String.raw`z_{\text{user}} = \frac{x - \mu_{\text{user}}}{\sigma_{\text{user}}}`} block />
      <ul>
        <li><Tex math={String.raw`x`} />: nilai transaksi saat ini.</li>
        <li><Tex math={String.raw`\mu_{\text{user}}`} />: rata-rata historis user itu (mis. 30 hari terakhir).</li>
        <li><Tex math={String.raw`\sigma_{\text{user}}`} />: standar deviasi historisnya.</li>
        <li><Tex math={String.raw`z_{\text{user}}`} />: &ldquo;berapa standar deviasi menyimpangnya?&rdquo; — <Tex math={String.raw`|z|>3`} /> = anomali personal.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah</summary>
        <p>Bu Ani: 20 transaksi terakhir rata-rata Rp400 rb, SD Rp150 rb. Hari ini transfer Rp4,5 juta.</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`z = (4.500.000 - 400.000)/150.000 = 27{,}3`} />.<br />
        <strong>Langkah 2</strong> — |z| = 27,3 &gt;&gt; 3 → <strong>anomali ekstrem</strong> untuk Bu Ani.<br />
        <strong>Langkah 3</strong> — bandingkan: untuk Pak Budi (pengusaha, rata-rata Rp40 juta), transaksi Rp4,5 juta punya z negatif → normal.</p>
        <p>Transaksi yang <em>sama persis</em>, vonis berlawanan — karena baselinenya beda. Inilah kenapa ambang absolut (FR5) kalah dari baseline personal.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Fitur nominal mentah cukup — model akan belajar sendiri.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> nominal mentah tanpa baseline = angka tanpa konteks. Rp4,5 juta tidak berarti apa-apa sampai kamu tahu <em>milik siapa</em>. Model bisa &ldquo;belajar&rdquo; konteks hanya jika diberi fitur baseline-nya (user_id embedding, rata-rata historis). Tanpa itu, model buta — persis seperti analis yang menilai tanpa kenal nasabahnya.</p>
      </div>

      <h2 id="travel">Impossible Travel: Fitur Fisika yang Tak Bisa Dibohongi</h2>
      <p><strong>Definisi.</strong> Impossible travel = dua transaksi dari lokasi yang <strong>tidak mungkin</strong> ditempuh manusia dalam selisih waktunya. Dihitung dengan:</p>
      <Tex math={String.raw`v = \frac{\text{jarak haversine}(loc_1, loc_2)}{\Delta t} > v_{\text{maks}} \approx 900 \text{ km/jam}`} block />
      <ul>
        <li>Jarak dihitung dengan <strong>haversine</strong> (jarak lingkaran besar di permukaan bumi).</li>
        <li><Tex math={String.raw`v_{\text{maks}}`} /> ≈ 900 km/jam (kecepatan pesawat komersial). Di atas itu = mustahil = dua orang/device berbeda memakai satu akun.</li>
      </ul>
      <p><strong>Kenapa istimewa:</strong> ini fitur <strong>fisika, bukan statistik</strong>. Penipu bisa meniru pola statistik (kecilkan nominal, tiru jam), tapi tidak bisa memalsukan hukum fisika — kecuali memakai VPN, yang justru meninggalkan jejak lain (ASN datacenter, IP tidak konsisten dengan GPS).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> fitur terbaik adalah yang <strong>tidak bisa di-tune oleh penipu</strong>. Statistik bisa dipelajari dan ditiru; fisika tidak. Saat merancang fitur, tanyakan: <em>&ldquo;bisakah penipu mengubah ini tanpa biaya?&rdquo;</em> Nominal: ya (gratis). Lokasi mustahil: tidak (butuh teleportasi).</p>
      </div>

      <h2 id="recency">Recency &amp; Device: Umur Itu Sinyal</h2>
      <p>Fitur <strong>recency</strong> mengukur &ldquo;seberapa baru&rdquo; entitas — dan kebaruan adalah bau khas fraud:</p>
      <ul>
        <li><code className="inline">account_age_days</code>: akun 2 hari yang langsung transaksi besar = warming/farming.</li>
        <li><code className="inline">device_age_days</code>: device baru + akun baru + transaksi besar = trifecta serangan.</li>
        <li><code className="inline">days_since_credential_change</code>: ganti email/password &lt;1 jam lalu lalu transaksi = ATO.</li>
        <li><code className="inline">days_since_first_seen_ip</code>: IP baru untuk akun lama = sesi asing.</li>
      </ul>
      <p><strong>Pola &ldquo;umur&rdquo; yang paling berbahaya:</strong> <em>baru + agresif</em>. Akun baru yang kalem (1 transaksi kecil/minggu) = nasabah baru normal. Akun baru yang agresif (10 transaksi/jam di hari pertama) = farming. Fitur recency hampir selalu dipakai <strong>berpasangan dengan velocity</strong> — umur menjawab &ldquo;siapa&rdquo;, velocity menjawab &ldquo;bagaimana&rdquo;.</p>

      <PlotlyChart
        data={featureGainData}
        title="Kenaikan AUC Saat Fitur Ditambahkan Satu per Satu (ilustrasi)"
        layout={{ xaxis: { title: "Fitur ditambahkan" }, yaxis: { title: "AUC", range: [0.55, 1.0] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = AUC model setelah fitur ke-n ditambahkan (kumulatif).</p>
        <p><strong>Interpretasi:</strong> lompatan terbesar datang dari <strong>velocity</strong> (+0,12) dan <strong>baseline deviasi</strong> (+0,06) — fitur perilaku, bukan fitur statis. <strong>Pelajaran karir:</strong> analis yang bisa menemukan &ldquo;satu fitur yang menaikkan 0,08&rdquo; (seperti analis junior KreditGo) lebih berharga daripada yang bisa tuning hyperparameter menaikkan 0,005.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Feature engineering sudah mati — deep learning bisa belajar fitur sendiri.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> untuk data tabular fraud, <strong>gradient boosting + fitur pakar masih raja</strong> (bahkan di 2026). Deep learning butuh data masif dan tetap butuh window agregat yang dihitung manual. Klaim &ldquo;end-to-end&rdquo; valid untuk gambar/teks — untuk tabel transaksi, fitur pakar menang telak dan jauh lebih explainable (FR17).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Window Agregat + Deviasi Baseline</h2>
      <p>Hitung z-score personal dan lihat anomali berubahตาม pemiliknya.</p>
      <PyodideLab
        title="Lab 1 — Z-Score Personal vs Ambang Absolut"
        hint="Ubah baseline jadi [5.0]*20 (user kaya). Transaksi yang tadi anomali jadi normal — buktikan bahwa 'anomali' adalah kata ganti, bukan kata benda."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Impossible Travel</h2>
      <PyodideLab
        title="Lab 2 — Fisika Melawan Penipu (Haversine)"
        hint="Ubah jam/waktu antar kota. Pada selisih berapa jam Makassar→Surabaya jadi 'wajar'? Itulah batas yang dipakai sistem produksi."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Membangun Dua Fitur Klasik</h2>
      <p>Fitur bukan ditemukan — ia <strong>dibangun</strong> dari log mentah dengan keputusan desain di tiap langkah. Dua contoh lengkapnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: fitur velocity dari log mentah (langkah demi langkah)</summary>
        <p>Log kartu B, 12 Oktober: 20.01 Rp120rb (Jakarta); 20.09 Rp95rb (Jakarta); 20.14 Rp110rb (Jakarta); 20.19 Rp4,2jt (Jakarta); 20.21 Rp3,8jt (Surabaya?) — lokasi dari IP merchant.</p>
        <p><strong>Langkah 1 — pilih jendela.</strong> Kita bangun <em>count_15m</em> (jumlah transaksi 15 menit ke belakang) dan <em>amt_15m</em> (total nominal 15 menit ke belakang).</p>
        <p><strong>Langkah 2 — hitung untuk transaksi 20.21.</strong> count_15m: transaksi 20.09, 20.14, 20.19, 20.21 = <strong>4</strong> (20.01 sudah keluar jendela). amt_15m = 95rb + 110rb + 4,2jt + 3,8jt = <strong>Rp8,195 juta</strong>.</p>
        <p><strong>Langkah 3 — bandingkan dengan baseline nasabah.</strong> Rata-rata harian kartu B: 1,2 transaksi, Rp210rb. Rasio: count 4 vs ekspektasi 15-menit normal (≈0,02) = <strong>200× lipat</strong>; amount Rp8,2jt vs Rp210rb = <strong>39× lipat</strong>.</p>
        <p><strong>Langkah 4 — keputusan desain.</strong> Fitur mentah (4 dan 8,2jt) kurang bermakna lintas nasabah — normalisasi menjadi <strong>rasio terhadap baseline</strong>: <em>count_ratio_15m = 200</em>, <em>amt_ratio_15m = 39</em>. Inilah &ldquo;feature engineering&rdquo; yang sesungguhnya: bukan sekadar agregasi, tapi <strong>agregasi yang dinormalisasi terhadap perilaku individu</strong> sehingga model bisa membandingkan apel dengan apel.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: travel impossibility — membuktikan fisikanya mustahil</summary>
        <p>Dua transaksi kartu C: 20.19 di Jakarta (IP merchant Jakarta), 20.21 di Surabaya (IP merchant Surabaya). Jarak Jakarta–Surabaya ±780 km, selisih waktu 2 menit.</p>
        <p><strong>Langkah 1 — hitung kecepatan implisit.</strong> 780 km / 2 menit = 390 km/menit = <strong>23.400 km/jam</strong> — 19× kecepatan suara. Secara fisik mustahil untuk manusia berpindah.</p>
        <p><strong>Langkah 2 — rancang fitur.</strong> <em>implied_speed_kmh</em> = jarak haversine antar lokasi berurutan / selisih waktu. Threshold: &gt; 1.000 km/jam = mustahil (pesawat komersial ±900 km/jam).</p>
        <p><strong>Langkah 3 — tangani jebakan.</strong> (a) <strong>VPN/proxy:</strong> IP tidak selalu = lokasi fisik — beri bobot lebih rendah untuk IP datacenter. (b) <strong>Transaksi online:</strong> lokasi merchant ≠ lokasi pemegang kartu — fitur ini hanya valid untuk transaksi <em>fisik</em> (EDC/ATM). (c) <strong>Zona waktu &amp; presisi:</strong> pastikan timestamp UTC dan koordinat cukup presisi. Fitur brilian yang dihitung dari data kotor = alarm palsu yang brilian.</p>
        <p><strong>Pelajaran:</strong> fitur terbaik sering kali adalah <strong>hukum fisika yang diterjemahkan ke angka</strong> — sederhana, bisa dijelaskan ke siapa pun, dan sulit diakali penjahat (mereka tidak bisa memperlambat waktu).</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Fitur adalah Teori tentang Penjahat</h2>
      <p>Setiap fitur yang kamu buat adalah <strong>kalimat hipotesis</strong>: &ldquo;saya percaya penjahat <em>terpaksa</em> bertransaksi cepat&rdquo; (velocity), &ldquo;saya percaya penjahat <em>terpaksa</em> memakai ulang device&rdquo; (device sharing). Feature engineering yang hebat bukan soal matematika — ia soal <strong>kriminalogi terapan</strong>: memahami keterbatasan musuh, lalu mengukurnya.</p>
      <p>Intuisi kedua: <strong>fitur terbaik adalah yang <em>stabil maknanya</em> saat dunia berubah</strong>. &ldquo;Nominal transaksi&rdquo; berubah artinya saat inflasi; &ldquo;rasio terhadap baseline nasabah&rdquo; tetap bermakna. &ldquo;Jumlah transaksi&rdquo; berubah saat promo; &ldquo;deviasi dari pola musiman&rdquo; tetap bermakna. Desain fitur yang dinormalisasi terhadap <em>konteks individu</em> = fitur yang tahan drift (FR10) — investasi sekali, panen bertahun-tahun.</p>
      <p><strong>Kapan feature engineering ini TIDAK cukup / berbahaya:</strong> (1) <strong>leakage</strong> — fitur yang memakai informasi dari <em>masa depan</em> (misal &ldquo;apakah transaksi ini di-chargeback?&rdquo; sebagai fitur training) = model terlihat sempurna, hancur di produksi. Uji: &ldquo;apakah fitur ini tersedia <em>saat keputusan dibuat</em>?&rdquo; Jika tidak → buang. (2) fitur yang <strong>tidak bisa dihitung di serving</strong> (butuh join 800ms untuk budget 50ms) = fiksi notebook. (3) fitur yang <strong>berkorelasi dengan atribut dilindungi</strong> (etnis, agama via proxy lokasi) = bom hukum &amp; etika — audit fairness berkala.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum menambah fitur ke-31, tanyakan: <strong>&ldquo;hipotesis kriminal apa yang diwakili fitur ini — dan apakah 30 fitur lama belum mewakilinya?&rdquo;</strong> Fitur tanpa hipotesis = angka tanpa jiwa; fitur duplikat = biaya tanpa manfaat.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Fitur Apa untuk Serangan Apa</h2>

      <div className="decision-card">
        <h3>1. Carding / warming (serangan cepat, massal) → <strong>window pendek + velocity</strong></h3>
        <p><strong>Fitur:</strong> <code className="inline">count_10m</code>, <code className="inline">count_1h</code>, <code className="inline">distinct_merchant_1h</code>.</p>
        <p><strong>Kenapa:</strong> serangan berlangsung menit–jam; window panjang mengubur sinyalnya.</p>
      </div>

      <div className="decision-card">
        <h3>2. ATO (akun legit dibajak) → <strong>deviasi baseline + recency kredensial</strong></h3>
        <p><strong>Fitur:</strong> <code className="inline">z_user</code>, <code className="inline">days_since_credential_change</code>, <code className="inline">new_device_flag</code>.</p>
        <p><strong>Kenapa:</strong> ATO = perubahan dari normal-nya <em>orang ini</em>; hanya baseline personal yang bisa melihatnya.</p>
      </div>

      <div className="decision-card">
        <h3>3. Farming / mule ring (banyak akun) → <strong>recency + graph agregat</strong></h3>
        <p><strong>Fitur:</strong> <code className="inline">account_age_days</code>, <code className="inline">device_age_days</code>, <code className="inline">accounts_per_device_7d</code>.</p>
        <p><strong>Kenapa:</strong> tiap akun sendirian normal; polanya ada di <em>kebaruan massal</em> + <em>berbagi device</em>.</p>
      </div>

      <div className="decision-card">
        <h3>4. Bust-out synthetic (lambat, besar) → <strong>window panjang + tren</strong></h3>
        <p><strong>Fitur:</strong> <code className="inline">sum_30d</code>, <code className="inline">trend_90d</code> (kemiringan), <code className="inline">credit_age_vs_activity</code>.</p>
        <p><strong>Kenapa:</strong> serangan 6 bulan tidak terlihat di window 1 jam; butuh lensa telefoto, bukan mikroskop.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Window selaras dengan <strong>tempo serangan</strong> — bukan default 30 hari untuk semua.</li>
          <li>Selalu sertakan <strong>baseline per user</strong> untuk fitur nominal.</li>
          <li>Prioritaskan fitur yang <strong>tidak bisa di-tune penipu</strong> (fisika &gt; statistik).</li>
          <li>Recency + velocity = pasangan wajib untuk serangan akun baru.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Trade-off Desain Fitur</h2>
      <p>Setiap fitur adalah kompromi. Tiga trade-off yang paling sering menentukan menang-kalahnya model:</p>
      <p><strong>Skenario A — window pendek vs panjang.</strong> Window 15 menit: sensitif terhadap serangan kilat, tapi berisik (satu kesalahan hitung = false positive). Window 7 hari: stabil, tapi buta terhadap serangan yang selesai dalam 1 jam. Praktik terbaik: <strong>pakai keduanya</strong> (fitur multi-window: 15m, 1h, 24h, 7d) dan biarkan model memilih — dengan harga komputasi 4×. Jika latensi ketat, prioritaskan window yang sesuai <em>durasi serangan dominan</em> di datamu.</p>
      <p><strong>Skenario B — recency vs frekuensi.</strong> Dua nasabah sama-sama 20 transaksi/bulan. Nasabah P: 20 transaksi tersebar merata. Nasabah Q: 19 transaksi 29 hari lalu + 1 transaksi 5 menit lalu. Fitur &ldquo;frekuensi bulanan&rdquo; menyamakan keduanya — padahal Q jauh lebih mencurigakan untuk ATO. Solusi: fitur <strong>recency-weighted</strong> (transaksi baru diberi bobot lebih) atau fitur eksplisit <em>time_since_last_txn</em>. Aturan: untuk deteksi <em>pengambilalihan</em>, recency &gt; frekuensi.</p>
      <p><strong>Skenario C — fitur mahal (join lintas sistem).</strong> Fitur &ldquo;apakah device ini dipakai 5 rekening lain&rdquo; butuh join ke tabel device global — 80ms. Di budget 50ms real-time, ini tidak muat. Pilihan: (1) <strong>precompute</strong> ke feature store tiap 5 menit (data sedikit basi tapi cepat), (2) hitung <em>asinkron</em> — keputusan awal tanpa fitur ini, lalu review susulan jika fitur mahal menyala, (3) buang fitur. Aturan: <strong>fitur yang tidak bisa dihitung dalam budget latensi = fitur yang tidak ada</strong>, sebagus apa pun akurasinya di notebook.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Makin banyak fitur, makin bagus model.&rdquo;<br /><strong>Yang benar:</strong> tiap fitur adalah <strong>liabilitas operasional</strong>: harus dihitung selamanya, bisa rusak saat skema berubah, bisa bocor (leakage). Studi internal banyak tim menunjukkan 15–30 fitur yang <em>terawat</em> mengalahkan 300 fitur yang setengah mati. Disiplin membuang fitur sama pentingnya dengan kepintaran membuatnya.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Satu KTP, 40 Pengajuan Pinjol</h2>
      <p>Pola yang ditemukan tim risk beberapa P2P lending Indonesia: satu nomor KTP muncul di puluhan pengajuan pinjaman dari <em>nama &amp; wajah berbeda</em> — KTP asli (hasil beli/jual data atau &ldquo;sewa identitas&rdquo; Rp300–500rb) dipasangkan dengan foto selfie hasil edit/AI atau wajah joki.</p>
      <p><strong>Fitur-fitur yang menangkapnya</strong> (semuanya murah dihitung):</p>
      <ol>
        <li><strong>ktp_reuse_count_30d:</strong> berapa pengajuan memakai KTP ini 30 hari terakhir. Normal = 1. Kasus ini = <strong>40</strong>.</li>
        <li><strong>device_sharing_count:</strong> berapa KTP berbeda diajukan dari device ini. Normal = 1–2 (keluarga). Kasus ini = <strong>23</strong>.</li>
        <li><strong>selfie_similarity:</strong> skor kemiripan wajah antar pengajuan dengan KTP sama — rendah padahal seharusnya identik.</li>
        <li><strong>velocity_pengajuan:</strong> 40 pengajuan dalam 72 jam dari 3 device — pola &ldquo;pabrik pengajuan&rdquo;.</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> satu KTP × 40 pengajuan × Rp3 juta rata-rata pinjaman = <strong>Rp120 juta eksposur</strong> dari satu identitas curian. Dengan 500 KTP &ldquo;produktif&rdquo; per bulan, satu sindikat bisa menggerogoti <strong>Rp60 miliar/tahun</strong> dari industri — sebelum bunga &amp; biaya collection.</p>
      <p><strong>Pelajaran desain fitur:</strong> tidak satu pun fitur di atas &ldquo;canggih&rdquo; — semuanya <em>counting</em> sederhana. Yang membuatnya powerful adalah <strong>pemilihan entitas agregasi yang tepat</strong> (KTP, device) dan <strong>window yang tepat</strong> (30 hari). Feature engineering fraud = 20% matematika, 80% memahami <em>bagaimana penjahat bekerja</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum bertanya &ldquo;fitur apa yang prediktif?&rdquo;, tanyakan <strong>&ldquo;jejak apa yang <em>terpaksa</em> ditinggalkan penjahat?&rdquo;</strong> Penjahat bisa ganti nama, tapi untuk mengajukan 40 pinjaman ia <em>terpaksa</em> memakai ulang KTP/device — dan keterpaksaan itulah yang menjadi fitur. Desain dari keterpaksaan, bukan dari ketersediaan kolom.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Rancang 8 Fitur untuk Serangan Warming</h2>
      <div className="callout">
        <p>Marketplace &ldquo;TokoMaju&rdquo; diserang warming (FR1): 200 akun baru, transaksi kecil 2–3 hari, lalu serentak belanja besar. Data yang tersedia: tabel transaksi (id, user_id, nominal, timestamp, merchant), tabel device (user_id, fingerprint, first_seen), tabel user (created_at).</p>
        <p><strong>Pertanyaan:</strong> rancang tepat 8 fitur (nama + definisi + window) yang menangkap serangan ini. Tidak boleh &ldquo;nominal transaksi&rdquo; mentah.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>8 fitur yang defensibel:</strong></p>
          <ol>
            <li><code className="inline">account_age_days</code> — umur akun saat transaksi (menangkap &ldquo;baru&rdquo;).</li>
            <li><code className="inline">device_age_days</code> — umur device (menangkap device farming).</li>
            <li><code className="inline">count_72h</code> — jumlah transaksi 72 jam terakhir (warming = ramai mendadak).</li>
            <li><code className="inline">sum_72h / sum_30d</code> — rasio aktivitas baru vs lama (warming = rasio tinggi).</li>
            <li><code className="inline">avg_ticket_72h / avg_ticket_hist</code> — lompatan nilai rata-rata (fase &ldquo;serangan besar&rdquo;).</li>
            <li><code className="inline">accounts_per_device_7d</code> — berapa akun berbagi device ini (farming terkoordinasi).</li>
            <li><code className="inline">distinct_merchant_24h</code> — warming sering uji banyak merchant.</li>
            <li><code className="inline">days_since_first_txn</code> — &ldquo;baru aktif + langsung agresif&rdquo; = pola inti warming.</li>
          </ol>
          <p><strong>Yang dinilai:</strong> tiap fitur menjawab <em>aspek serangan yang berbeda</em> (umur, tempo, skala, koordinasi) — bukan 8 varian nominal. Dan semuanya bisa dihitung dari 3 tabel yang ada (realistis!).</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Feature Engineering</h2>
      <details className="worked">
        <summary>Q1: Berapa banyak fitur yang ideal?</summary>
        <p><strong>15–40 fitur terawat</strong> mengalahkan 300 fitur setengah mati — konsisten di banyak tim. Tanda kelebihan: training lambat, debugging sulit, tidak ada yang paham separuh fitur. Praktik: mulai dari 20 fitur &ldquo;wajib&rdquo; (velocity, amount ratio, device, recency, baseline), tambah hanya jika <em>ablation test</em> membuktikan manfaatnya. <strong>Fitur adalah liabilitas</strong> — setiap tambahan = dihitung selamanya.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bukankah deep learning bisa &ldquo;belajar fitur sendiri&rdquo;?</summary>
        <p>Bisa — untuk data <em>mentah berstruktur kompleks</em> (urutan klik, teks). Tapi untuk data tabular fraud: (1) butuh <strong>jauh lebih banyak data</strong>, (2) hasilnya <strong>tidak bisa dijelaskan</strong> ke investigator/regulator, (3) GBM + fitur manual masih menang di kebanyakan benchmark tabular. Auto-feature = alat untuk <em>eksplorasi</em>, bukan pengganti pemahaman domain. Yang tahu <em>kenapa</em> velocity penting akan selalu mengalahkan yang hanya tahu <em>cara</em> memanggil AutoML.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana menangani fitur kategorikal (merchant, kota)?</summary>
        <p><strong>Target encoding dengan regularisasi</strong> (rata-rata fraud rate per kategori + smoothing) adalah standar industri — tapi <em>hitung dari data training saja</em> (leakage jika pakai seluruh data!) dan <em>bekukan</em> mapping-nya untuk serving. Untuk kategori baru di produksi (merchant baru): fallback ke rata-rata global. One-hot untuk ratusan ribu merchant = matriks raksasa yang lambat &amp; boros — hindari.</p>
      </details>
      <details className="worked">
        <summary>Q4: Fitur harus dinormalisasi? Model tree kan tidak butuh.</summary>
        <p>Benar, tree/GBM tidak butuh normalisasi untuk <em>training</em> — tapi normalisasi tetap berguna untuk: (1) <strong>interpretasi</strong> (rasio 200× lebih bermakna dari angka mentah 4), (2) <strong>threshold rule</strong> yang konsisten lintas segmen, (3) <strong>model linear/neural</strong> jika dipakai, (4) <strong>monitoring drift</strong> (PSI lebih stabil di fitur ternormalisasi). Normalisasi = investasi keterbacaan, bukan kebutuhan algoritma.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bu Ani (rata-rata Rp400 rb, SD Rp150 rb) transfer Rp4,5 juta. Berapa z-score personalnya?"
        options={[
          "z = 3,0",
          "z ≈ 27,3 — anomali ekstrem untuk Bu Ani",
          "z = 0,5 — normal",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: (4.500.000 − 400.000)/150.000 = 27,3. Jauh di atas ambang 3 — untuk BU ANI ini anomali ekstrem, walau untuk pengusaha Rp4,5 juta adalah normal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Transaksi di Makassar jam 10:00, lalu di Surabaya jam 10:30 (±800 km). Kesimpulan?"
        options={[
          "Normal — bisa naik pesawat",
          "Impossible travel — 1.600 km/jam > 900 km/jam, mustahil untuk satu orang",
          "Butuh data lagi",
          "Wajar jika pakai VPN",
        ]}
        correct={1}
        explanation="Benar: 800 km / 0,5 jam = 1.600 km/jam > batas pesawat 900 km/jam. Ini dua device/orang berbeda memakai satu akun — sinyal ATO kuat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Untuk serangan warming (akun baru, ramai 2-3 hari, lalu serangan besar), window fitur yang TEPAT…"
        options={[
          "30 hari — makin panjang makin bagus",
          "10 menit — sependek mungkin",
          "1–72 jam — selaras dengan tempo serangan (fase ramai = jam–hari)",
          "Tidak butuh window",
        ]}
        correct={2}
        explanation="Benar: window harus selaras tempo serangan. 10 menit terlalu berisik, 30 hari mengubur sinyal fase warming. 1–72 jam menangkap 'ramai mendadak'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa 'device_age_days' menaikkan AUC 0,81 → 0,89 di cerita KreditGo?"
        options={[
          "Karena device age berkorelasi dengan nominal",
          "Karena ia menjawab pertanyaan yang tak ditanyakan 40 fitur lain: 'seberapa baru pelaku di baliknya?' — menangkap farming",
          "Karena deep learning",
          "Kebetulan",
        ]}
        correct={1}
        explanation="Benar: fitur itu membawa INFORMASI BARU (dimensi umur/identitas pelaku), bukan varian dari info lama. Kenaikan besar selalu datang dari sudut pandang baru, bukan tuning."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Fitur mana yang PALING sulit di-tune oleh penipu?"
        options={[
          "Nominal transaksi (bisa dikecilkan)",
          "Jam transaksi (bisa diubah)",
          "Impossible travel (fisika — tidak bisa teleportasi; mengakalinya butuh VPN yang meninggalkan jejak lain)",
          "Kategori merchant (bisa diganti)",
        ]}
        correct={2}
        explanation="Benar: fisika > statistik. Penipu bisa mengubah semua fitur statistik tanpa biaya, tapi tidak bisa melanggar kecepatan cahaya — eh, kecepatan pesawat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. 'Feature engineering sudah mati karena deep learning.' Pernyataan ini untuk data tabular fraud…"
        options={[
          "Benar — pakai deep learning saja",
          "Salah — gradient boosting + fitur pakar masih raja untuk tabel; deep learning butuh data masif dan tetap butuh agregat manual",
          "Benar untuk semua kasus",
          "Tidak relevan",
        ]}
        correct={1}
        explanation="Benar: salah. Klaim end-to-end valid untuk gambar/teks. Untuk tabel transaksi fraud, fitur pakar (window, baseline, fisika) menang telak + lebih explainable ke regulator."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Window agregat</strong> (count/sum/distinct) — pilih window selaras <strong>tempo serangan</strong>, bukan default.</li>
          <li><strong>Baseline per user</strong>: <Tex math={String.raw`z_{\text{user}} = (x - \mu_{\text{user}})/\sigma_{\text{user}}`} /> — anomali itu relatif, bukan absolut.</li>
          <li><strong>Impossible travel</strong> = fitur fisika (haversine/Δt &gt; 900 km/jam) — tak bisa di-tune penipu.</li>
          <li><strong>Recency</strong> (umur akun/device/kredensial) + velocity = pasangan wajib lawan warming/farming.</li>
          <li>Kenaikan performa besar datang dari <strong>sudut pandang baru</strong>, bukan tuning — satu fitur tepat &gt; 40 fitur basi.</li>
          <li>Untuk tabel fraud: <strong>fitur pakar + GBM masih raja</strong>; deep learning bukan jawaban otomatis.</li>
          <li>Kapan TIDAK pakai fitur kompleks: saat latency real-time tidak memungkinkan (FR13) — sederhanakan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr5-rule-based" className="btn btn-secondary btn-sm">← FR5</Link>
        <Link href="/learn/fr7-supervised-ml" className="btn btn-primary btn-sm">Next: FR7 →</Link>
      </div>
    </div>
  );
}
