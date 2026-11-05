import type { V2Lesson } from "../lib/types";

// Kurva U: biaya total vs frekuensi rebalance — jarang = tracking error besar,
// sering = biaya transaksi besar. Optimum di tengah.
const UCURVE_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Kurva U: biaya total minimum di frekuensi rebalance tengah; biaya transaksi naik saat sering, tracking error naik saat jarang.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="540" y2="20"/><line x1="60" y1="80" x2="540" y2="80"/><line x1="60" y1="140" x2="540" y2="140"/><line x1="60" y1="200" x2="540" y2="200"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">mahal</text><text x="54" y="204">murah</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="100" y="240">jarang</text><text x="300" y="240">frekuensi rebalance</text><text x="500" y="240">sering</text></g>
<path d="M70,200 C180,195 220,190 260,150 S340,60 500,30" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="470" y="55" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">biaya transaksi</text>
<path d="M70,40 C200,60 280,120 340,170 S460,195 500,198" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="95" y="60" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">tracking error (risiko drift)</text>
<path d="M70,150 C170,145 230,120 300,105 S430,105 500,140" fill="none" stroke="var(--c1)" stroke-width="3"/>
<circle cx="300" cy="105" r="6" fill="var(--c1)"/>
<text x="300" y="88" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">optimum: biaya total min</text>
<text x="300" y="135" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">band ±5% / tahunan</text>
</svg>`;

export const pmd10: V2Lesson = {
  slug: "pm-d10-rebalancing",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D10 — Rebalancing: Kalender, Threshold & Tax-Aware",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-drift",
      eyebrow: "Langkah 1 · Cerita",
      title: "Investor yang “tidak ngapa-ngapain” selama 12 tahun",
      prose: [
        "2010. Seorang investor menetapkan portofolio 60/40 dengan disiplin ala buku teks — lalu... tidak menyentuhnya lagi. Bukan malas, katanya: “biaya transaksi itu musuh return.” 2010–2021 menjadi dekade emas saham: tanpa disadari, porsi sahamnya merangkak dari 60% → 68% → 75% → 82%. Setiap laporan tahunan terlihat indah. Ia merasa strateginya “berhasil”.",
        "2022 datang: saham −18%, obligasi −13% (tahun terburuk obligasi dalam sejarah modern). Portofolio yang “60/40” itu — yang sebenarnya sudah 82% saham — jatuh jauh lebih dalam dari yang direncanakan 12 tahun lalu. Ia menelepon penasihatnya dengan panik: “Bukankah saya investor moderat?” Penasihat menjawab pelan: “Dulu. Portofoliomu sudah lama bukan moderat — kamu hanya tidak melihatnya berubah.”",
        "Twist-nya: “tidak melakukan apa-apa” BUKAN keputusan netral — ia adalah keputusan aktif untuk membiarkan risiko melayang. Drift itu diam-diam mengubah profil risikomu setiap hari pasar bergerak; rebalancing adalah satu-satunya cara mengembalikan kemudi ke tanganmu. Ironisnya, biaya transaksi yang ia hindari selama 12 tahun (mungkin 1–2% total) dibayar lunas oleh satu tahun drawdown berlebih (belasan persen). Lesson penutup Tier D ini: cara merawat portofolio agar tetap menjadi portofolio yang kamu janjikan pada dirimu sendiri.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan rebalancing kalender vs threshold (tolerance band) dan menghitung kapan band terpicu; (2) mensimulasikan trade-off biaya transaksi vs tracking error dan menemukan frekuensi optimum; (3) menerapkan rebalancing via arus kas (setoran/dividen) sebagai alternatif gratis; (4) menghitung manfaat tax-loss harvesting dan memilih asset location yang tepat; (5) memutuskan strategi rebalancing untuk kasus kena pajak vs tidak kena pajak.",
        "Daftar isi: 1) Cerita drift 12 tahun · 2) Modal dasar: alokasi & rebalancing (ringkas) · 3) Kalender vs threshold · 4) Lab: simulasi drift vs rebalance · 5) Tax-aware: panen rugi & lokasi aset · 6) Lab: hitung penghematan pajak · 7) Peta keputusan · 8) Mini-case: Rp10M · 9) Checkpoint — penutup Tier D.",
        "Metadata: ±55 menit · 2 lab Python · 1 chart · 5 kuis · 1 mini-case. Prasyarat: tidak ada — semua modal diringkas di Langkah 2.",
      ],
      tasks: [],
      reference: "Drift = risiko yang berubah tanpa izinmu. Rebalancing = mengambil kembali kemudi.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Satu fondasi yang dibawa masuk — tanpa perlu buka lesson lain",
      prose: [
        "Fondasi — alokasi aset & rebalancing. Alokasi aset strategis (SAA) adalah portofolio kebijakan jangka panjang yang diturunkan dari tujuan investor, ekspektasi pasar modal, dan optimisasi — ia menjelaskan sebagian besar variasi return antar investor. Alokasi taktis (TAA) adalah tilt sementara ±5–10% yang harus terdokumentasi dan disiplin kembali, kalau tidak ia merosot menjadi market timing emosional. Untuk dana pensiun ada LDI: funded ratio sebagai objektif, dengan portofolio lindung-menstabilkan dan portofolio growth-menutup defisit.",
        "Dua peringatan dari fondasi ini yang menjadi nyawa lesson ini. Pertama: 60/40 ≈ 88% risikonya dari saham — jadi ukur kontribusi risiko, bukan bobot nominal (logika alokasi berbasis kontribusi risiko: ukur porsi risiko tiap aset, bukan porsi modalnya). Kedua, yang terpenting: rebalancing = contrarian OTOMATIS (jual yang mahal, beli yang murah) — dan drift yang dibiarkan adalah risiko diam-diam yang mengubah profil portofolio tanpa persetujuanmu. Lesson ini menjawab pertanyaan lanjutannya: seberapa sering, dengan aturan apa, dan bagaimana agar tidak dimakan pajak & biaya?",
        "Dengan fondasi ini kamu tidak butuh apa-apa lagi: SAA memberi “rumah” yang harus dijaga, rebalancing memberi logikanya (contrarian otomatis), dan lesson ini memberi tekniknya — kalender, threshold, arus kas, dan pajak.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: rebalancing = memaksa “beli murah, jual mahal”",
        body: "Aset yang naik porsinya TERJUAL (ambil untung), aset yang turun porsinya DIBELI (borong diskon) — tanpa perlu prediksi apa pun. Ini satu-satunya “market timing” yang terbukti bekerja, justru karena ia bukan timing: ia aturan mekanis yang melawan emosi.",
      },
      reference: "SAA = rumahmu. Drift = rumah yang bergeser. Rebalancing = pulang.",
    },
    {
      id: "konsep-kalender-threshold",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Kalender vs threshold: dua tukang kebun",
      prose: [
        "Definisi: rebalancing KALENDER = kembalikan ke target pada jadwal tetap (kuartalan/semester/tahunan) — sederhana, terdokumentasi, mudah diaudit. Rebalancing THRESHOLD (tolerance band) = kembalikan HANYA jika |w_i − w_i*| > δ — mis. δ = 5 poin persentase absolut, atau 25% relatif terhadap target. Hibrida = cek tiap kuartal, eksekusi hanya jika band terpicu — praktik terbaik kebanyakan institusi.",
        "Kepribadiannya: tukang kebun kalender memangkas setiap Minggu pagi — rapi, tetapi kadang memangkas yang belum liar (buang biaya) dan telat memangkas yang liar di tengah minggu. Tukang kebun threshold hanya memangkas yang melewati garis pagar — efisien, tetapi butuh pagar yang terpasang (monitoring) dan bisa kaget saat badai membuat semua tanaman liar serentak. Hibrida = cek tiap Minggu, pangkas hanya yang melewati pagar.",
        "Rumus picunya:",
      ],
      formula: String.raw`\text{Rebalance jika } |w_i - w_i^*| > \delta \quad \text{untuk aset } i \text{ mana pun}`,
      formulaNote:
        "w_i = bobot aktual aset-i; w_i* = bobot target (dari SAA); δ = lebar tolerance band (mis. 0,05 = 5 poin persentase, atau 25% relatif: δ = 0,25 × w_i*). Contoh: target saham 60%, δ = 5pp → rebalance jika saham < 55% atau > 65%. Band absolut sederhana; band relatif lebih sensitif untuk aset berbobot kecil.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Rebalancing selalu menaikkan return”",
        type: "pitfall",
        body: "Yang benar: di pasar TRENDING kuat (saham naik 10 tahun), rebalancing = menjual pemenang terlalu dini = RETURN DRAG. Manfaat utamanya adalah KONTROL RISIKO (menjaga profil janji), bukan dongkrak return. “Rebalancing bonus” hanya muncul di pasar sideways bergejolak (mean-reversion). Jangan jual rebalancing sebagai mesin return — jual sebagai mesin disiplin.",
      },
      reference: "Contoh: saham 68% vs target 60%, δ=5pp → 8pp > 5pp → REBALANCE (jual 8% portofolio).",
    },
    {
      id: "lab-simulasi-rebalance",
      eyebrow: "Langkah 4 · Lab",
      title: "Drift vs kalender vs threshold: adu simulasi",
      prose: [
        "Simulasikan 5 tahun: saham return [+25%, +18%, −10%, +30%, +12%], obligasi +4% flat. Bandingkan tiga strategi: (1) biarkan drift, (2) rebalance tahunan ke 60/40, (3) threshold δ=5pp. Hitung bobot saham akhir & total turnover (proxy biaya). Coba ubah δ menjadi 2pp: turnover meledak — itulah harga pagar yang terlalu rapat.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `w_drift` (tanpa rebalance) 5 tahun" },
        { id: "t2", text: "Simulasikan `w_tahunan` dan `w_band`, hitung `turnover_band`" },
      ],
      expected: "Drift: saham 70.4% | Tahunan: 60.0% (turnover 18%) | Band 5pp: 60.0% (turnover 7%)",
      hints: [
        "Tiap tahun: w_saham_baru = ws*(1+rs) / (ws*(1+rs) + wo*(1+ro)).",
        "Tahunan: setelah hitung, set ws=0.6; turnover += |ws_baru - 0.6|.",
        "Band: hanya reset ke 0.6 jika |ws - 0.6| > 0.05; turnover hanya saat reset.",
      ],
      code: {
        starter: `# Adu strategi rebalance 60/40 selama 5 tahun
rs = [0.25, 0.18, -0.10, 0.30, 0.12]
ro = [0.04]*5
target, delta = 0.6, 0.05

def akhir_tahun(ws, i):
    return ws*(1+rs[i]) / (ws*(1+rs[i]) + (1-ws)*(1+ro[i]))

# TULIS KODEMU
w_drift =
w_tahunan, turn_tahunan =
w_band, turn_band =

for i in range(5):
    w_drift = akhir_tahun(w_drift, i)
    w_tahunan = akhir_tahun(w_tahunan, i)
    turn_tahunan += abs(w_tahunan - target); w_tahunan = target
    w_band = akhir_tahun(w_band, i)
    if abs(w_band - target) > delta:
        turn_band += abs(w_band - target); w_band = target

print(f"Drift: saham {w_drift:.1%} | Tahunan: {target:.1%} (turnover {turn_tahunan:.0%}) | Band 5pp: {target:.1%} (turnover {turn_band:.0%})")
print("Coba: delta=0.02 — turnover band menyalip tahunan!")`,
        lockLines: 8,
        solution: `# Adu strategi rebalance 60/40 selama 5 tahun
rs = [0.25, 0.18, -0.10, 0.30, 0.12]
ro = [0.04]*5
target, delta = 0.6, 0.05

def akhir_tahun(ws, i):
    return ws*(1+rs[i]) / (ws*(1+rs[i]) + (1-ws)*(1+ro[i]))

# TULIS KODEMU
w_drift = target
w_tahunan, turn_tahunan = target, 0.0
w_band, turn_band = target, 0.0

for i in range(5):
    w_drift = akhir_tahun(w_drift, i)
    w_tahunan = akhir_tahun(w_tahunan, i)
    turn_tahunan += abs(w_tahunan - target); w_tahunan = target
    w_band = akhir_tahun(w_band, i)
    if abs(w_band - target) > delta:
        turn_band += abs(w_band - target); w_band = target

print(f"Drift: saham {w_drift:.1%} | Tahunan: {target:.1%} (turnover {turn_tahunan:.0%}) | Band 5pp: {target:.1%} (turnover {turn_band:.0%})")
print("Coba: delta=0.02 — turnover band menyalip tahunan!")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_drift", value: 0.7044, tol: 0.01, label: "`w_drift` ≈ 70,4%", msg: "Tanpa rebalance, saham merangkak ke 70% — profil risiko berubah." },
          { kind: "equal", task: "t2", name: "turn_tahunan", value: 0.1781, tol: 0.02, label: "`turn_tahunan` ≈ 18%", msg: "Jumlah |drift| tiap tahun sebelum direset." },
          { kind: "equal", task: "t2", name: "turn_band", value: 0.0717, tol: 0.02, label: "`turn_band` ≈ 7%", msg: "Band hanya terpicu 1-2 kali — jauh lebih hemat." },
          { kind: "stdout_matches", task: "t2", pattern: "Drift: saham 70\\.4%", label: "`print` menampilkan drift 70,4%", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Band 5pp: risiko terkendali dengan turnover ~40% dari kalender tahunan.",
    },
    {
      id: "tax-aware",
      eyebrow: "Langkah 5 · Konsep + chart",
      title: "Tax-aware: rebalance yang tidak dimakan pajak",
      prose: [
        "Tiga senjata tax-aware. Pertama, rebalance VIA ARUS KAS: setoran baru, dividen, dan kupon dialokasikan ke aset yang KURANG bobot — rebalance gratis tanpa menjual (tanpa pajak, tanpa spread). Dana pensiun dengan iuran rutin nyaris tidak pernah perlu menjual. Kedua, TAX-LOSS HARVESTING: jual aset yang rugi untuk merealisasikan capital loss, pakai untuk mengoffset capital gain (hemat = rugi × tarif pajak), lalu beli aset SEJENIS (bukan identik — awas aturan wash-sale di AS: 30 hari). Ketiga, ASSET LOCATION: taruh aset tidak efisien pajak (obligasi — kupon kena pajak penuh) di akun pajak-tangguh (dana pensiun), dan aset efisien pajak (saham growth — gain ditunda) di akun kena pajak.",
        "Cara membaca chart: sumbu X = frekuensi rebalance (jarang → sering). Tiga kurva: biaya transaksi (naik saat sering), tracking error/risiko drift (naik saat jarang), dan biaya total = jumlah keduanya (kurva U). Titik terendah = optimum.",
        "Interpretasi: jarang rebalance terlihat “hemat” tetapi membayar mahal dalam risiko drift (cerita 2010–2022!); terlalu sering terlihat “disiplin” tetapi membakar biaya. Optimum kebanyakan portofolio: cek kuartalan + band ±5pp, atau tahunan untuk akun kecil. Dan ingat: kurva ini GESER ke kanan (lebih jarang) untuk akun kena pajak — karena tiap penjualan membayar pajak, bukan cuma spread.",
      ],
      figure: {
        svg: UCURVE_SVG,
        alt: "Kurva U biaya total: minimum di frekuensi tengah; biaya transaksi naik saat sering, tracking error naik saat jarang.",
        caption: "Optimum rebalance = titik terendah kurva U. Pajak menggeser optimum ke arah lebih jarang.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: urutan rebalance yang benar",
        body: "Jangan langsung jual! Urutan hemat: (1) arahkan arus kas baru/dividen ke yang kurang bobot; (2) panen rugi pajak (jual yang rugi = dapat “diskon pajak”); (3) baru jual pemenang bila masih perlu — dan pertimbangkan menunda ke tahun pajak berikutnya. Setiap langkah yang dilewati = uang dibakar.",
      },
      reference: "Rebalance via arus kas = satu-satunya rebalance yang benar-benar gratis.",
    },
    {
      id: "lab-pajak",
      eyebrow: "Langkah 6 · Lab",
      title: "Hitung rupiah penghematan tax-loss harvesting",
      prose: [
        "Portofolio Rp100M: satu posisi saham rugi Rp10jt (belum direalisasi), satu posisi reksa dana untung Rp25jt. Hitung pajak jika rebalance dengan menjual pemenang saja, vs menjual pemenang + memanen rugi (tarif pajak gain 10%). Coba ubah rugi menjadi Rp30jt: kapan harvesting tidak lagi cukup mengoffset?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pajak_tanpa` (jual pemenang saja)" },
        { id: "t2", text: "Hitung `pajak_dengan` (pemenang + panen rugi) dan `hemat`" },
      ],
      expected: "Pajak tanpa harvesting: Rp2,500rb | Dengan harvesting: Rp1,500rb | Hemat: Rp1,000rb",
      hints: [
        "pajak_tanpa = gain × tarif.",
        "pajak_dengan = max(0, gain - rugi) × tarif; hemat = pajak_tanpa - pajak_dengan.",
        "Semua angka dalam Rp ribu agar mudah dibaca.",
      ],
      code: {
        starter: `# Tax-loss harvesting: rupiah penghematan
gain, rugi, tarif = 25_000, 10_000, 0.10   # Rp ribu; coba rugi=30_000!

# TULIS KODEMU
pajak_tanpa =
pajak_dengan =
hemat =

print(f"Pajak tanpa harvesting: Rp{pajak_tanpa:,.0f}rb | Dengan harvesting: Rp{pajak_dengan:,.0f}rb | Hemat: Rp{hemat:,.0f}rb")
print("Tanya: rugi 30jt > gain 25jt — sisa rugi 5jt bisa dibawa ke tahun depan (carry forward).")`,
        lockLines: 2,
        solution: `# Tax-loss harvesting: rupiah penghematan
gain, rugi, tarif = 25_000, 10_000, 0.10   # Rp ribu; coba rugi=30_000!

# TULIS KODEMU
pajak_tanpa = gain * tarif
pajak_dengan = max(0, gain - rugi) * tarif
hemat = pajak_tanpa - pajak_dengan

print(f"Pajak tanpa harvesting: Rp{pajak_tanpa:,.0f}rb | Dengan harvesting: Rp{pajak_dengan:,.0f}rb | Hemat: Rp{hemat:,.0f}rb")
print("Tanya: rugi 30jt > gain 25jt — sisa rugi 5jt bisa dibawa ke tahun depan (carry forward).")`,
        checks: [
          { kind: "equal", task: "t1", name: "pajak_tanpa", value: 2500, tol: 1, label: "`pajak_tanpa` = Rp2.500rb", msg: "25.000 × 10%." },
          { kind: "equal", task: "t2", name: "pajak_dengan", value: 1500, tol: 1, label: "`pajak_dengan` = Rp1.500rb", msg: "(25.000 − 10.000) × 10%." },
          { kind: "equal", task: "t2", name: "hemat", value: 1000, tol: 1, label: "`hemat` = Rp1.000rb", msg: "Rugi Rp10jt × tarif 10% = penghematan langsung." },
          { kind: "stdout_matches", task: "t2", pattern: "Hemat: Rp1,000rb", label: "`print` menampilkan hemat Rp1.000rb", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Rp1jt hemat dari satu keputusan jual — harvesting adalah “return” tanpa risiko pasar.",
    },
    {
      id: "peta-keputusan-rebalance",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Strategi rebalance untuk tiap dompet",
      prose: [
        "Skenario 1 — Akun pensiun (tidak kena pajak), iuran rutin. → Rebalance via arus kas + cek kuartalan band ±5pp. Alasan: setoran baru = rebalance gratis; tanpa pajak, penjualan murah bila masih diperlukan.",
        "Skenario 2 — Akun kena pajak, portofolio besar. → Band LEBAR (±7–10pp) + harvesting tiap akhir tahun + asset location. Alasan: tiap penjualan = pajak; geser kurva U ke kanan — lebih jarang, lebih hemat pajak. Jangan rebalance kalender ketat di akun kena pajak!",
        "Skenario 3 — Pasar trending kuat multi-tahun (saham reli). → Threshold, BUKAN kalender ketat. Alasan: kalender tahunan memotong pemenang terlalu sering (return drag); threshold membiarkan tren berjalan sampai benar-benar liar.",
        "Skenario 4 — Dana institusi dengan IPS & komite. → Hibrida terdokumentasi: cek kuartalan, eksekusi jika band terpicu, catat alasannya. Alasan: audit trail untuk governance; “kami rebalance karena band” > “kami rebalance karena feeling”.",
        "Aturan praktis 10 detik: (1) arus kas dulu, jual belakangan; (2) akun kena pajak = band lebar + harvesting; (3) trending = threshold, sideways = kalender boleh; (4) tulis aturannya di IPS — rebalance diskresioner = market timing; (5) cek kuartalan, eksekusi hanya bila perlu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Rebalancing = market timing”",
        type: "pitfall",
        body: "Yang benar: market timing = prediksi arah pasar lalu bertaruh. Rebalancing = aturan mekanis tanpa prediksi — ia justru MELAWAN timing emosional (membeli saat takut, menjual saat euforia). Bedanya ada di niat: timing mengejar return, rebalancing menjaga janji risiko.",
      },
      reference: "Rebalance yang tidak tertulis di IPS = keputusan diskresioner = timing berkedok disiplin.",
    },
    {
      id: "minicase-10m",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Rp10M: jual, tunggu, atau alihkan kas?",
      prose: [
        "Klien: portofolio Rp10M, target 60/40, akun KENA pajak (tarif gain 10%), biaya transaksi 0,2%. Setelah reli saham, posisi kini 68% saham / 32% obligasi. Band IPS: ±5pp. Setoran rutin Rp50jt/bulan tersedia. Saham yang akan dijual punya gain belum direalisasi Rp1,2M; ada satu posisi obligasi rugi Rp200jt (bisa dipanen).",
        "Pertanyaan: (a) Apakah band terpicu? (b) Hitung biaya tiga opsi: jual langsung 8pp; alihkan 6 bulan setoran ke obligasi; kombinasi. (c) Keputusan terbaik?",
        "Pembahasan. (a) Ya: |68% − 60%| = 8pp > 5pp → wajib rebalance menurut IPS. (b) Opsi jual langsung: jual Rp800jt saham → biaya transaksi Rp1,6jt + pajak atas gain proporsional (Rp800jt/ Rp6,8M × Rp1,2M ≈ Rp141jt gain → pajak Rp14,1jt) − harvesting Rp200jt rugi (hemat Rp20jt... terbatas offset) → total “biaya” ≈ Rp1,6jt + Rp14,1jt − hemat harvesting. Opsi arus kas: 6 × Rp50jt = Rp300jt ke obligasi → saham turun ke ~65,9% — BELUM cukup (masih > 65%)! Perlu ~16 bulan setoran untuk kembali ke 65% — terlalu lama, risiko drift berlanjut. (c) Kombinasi: panen rugi Rp200jt SEKARANG (hemat pajak Rp20jt, tanpa biaya berarti), alihkan setoran 6 bulan ke obligasi, lalu jual SISANYA (~Rp500jt) — pajak lebih kecil karena sebagian gain dioffset harvesting. Pelajaran umum: tidak ada opsi gratis di akun kena pajak — yang ada hanya urutan yang meminimalkan luka: kas → panen rugi → jual secukupnya. Dan IPS yang baik menulis urutan ini SEBELUM dibutuhkan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: pajak membuat “rebalance sempurna” menjadi musuh",
        body: "Mengejar bobot TEPAT 60,00% di akun kena pajak bisa menghabiskan pajak yang lebih besar dari manfaat risikonya. Band ±5pp memberi “zona toleransi” — manfaatkan: rebalance ke TEPI band (65%), bukan ke tengah (60%), untuk menghemat penjualan. Presisi itu mahal; toleransi itu murah.",
      },
      reference: "Rebalance ke tepi band, bukan ke target — hemat pajak, risiko tetap dalam janji.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan penutup Tier D",
      prose: ["Lima pertanyaan campuran dari semua langkah — dari rumus band hingga urutan tax-aware. Tier D (Kuantitatif Terapan) selesai di sini: dari data harga hingga perawatan portofolio."],
      tasks: [],
      summary: [
        "Kalender = jadwal tetap (sederhana, terdokumentasi); threshold = |w_i − w_i*| > δ (efisien, butuh monitoring); hibrida = cek rutin + eksekusi bila terpicu.",
        "Trade-off = kurva U: jarang → tracking error/drift; sering → biaya transaksi; optimum tengah (cek kuartalan, band ±5pp).",
        "Rebalancing = contrarian otomatis; manfaat utamanya kontrol risiko, bukan dongkrak return (waspada return drag di pasar trending).",
        "Tax-aware: urutan = arus kas → panen rugi (tax-loss harvesting) → jual secukupnya; asset location menaruh aset boros-pajak di akun pajak-tangguh.",
        "Akun kena pajak = band lebih lebar + rebalance ke tepi band; tulis SEMUA aturan di IPS — rebalance diskresioner = market timing.",
      ],
      next: { label: "D11 — Terminal & VBA: Mesin Harian Analis Portofolio", href: "/learn/pm-d11-tooling-vendor-vba" },
      quiz: [
        {
          q: "Target saham 60%, band ±5pp absolut. Bobot aktual 66%. Tindakan?",
          options: [
            { text: "Rebalance — |66−60|=6pp > 5pp", why: "Tepat: band terpicu. Jual kelebihan hingga kembali ke dalam band.", correct: true },
            { text: "Tunggu hingga 70%", why: "Salah: menunggu = membiarkan drift; band ada untuk dipatuhi, bukan dinegosiasi." },
            { text: "Tidak perlu — masih di bawah 70%", why: "Salah: 70% bukan aturannya; aturannya 65%. Mengarang ambang = diskresi." },
            { text: "Ubah target menjadi 66%", why: "Salah: mengubah target agar sesuai drift = menyerah pada drift (rationalization)." },
          ],
        },
        {
          q: "Kenapa akun kena pajak sebaiknya memakai band LEBIH lebar?",
          options: [
            { text: "Agar lebih sering trading", why: "Salah: band lebar = lebih JARANG terpicu, bukan lebih sering." },
            { text: "Tiap penjualan memicu pajak — band lebar mengurangi frekuensi kena pajak", why: "Tepat: pajak menggeser kurva U ke kanan; toleransi lebih besar = luka pajak lebih kecil.", correct: true },
            { text: "Pajak membuat drift tidak masalah", why: "Salah: drift tetap mengubah profil risiko — hanya biaya koreksinya yang lebih mahal." },
            { text: "Band lebar menaikkan return", why: "Salah: band soal biaya & risiko, bukan mesin return." },
          ],
        },
        {
          q: "Dana pensiun dengan iuran rutin Rp1M/bulan, saham kurang bobot 3%. Langkah pertama?",
          options: [
            { text: "Jual obligasi Rp300jt lalu beli saham", why: "Salah: menjual = bayar spread (dan pajak bila kena) — padahal ada cara gratis." },
            { text: "Alihkan iuran 1–2 bulan ke saham (rebalance via arus kas)", why: "Tepat: arus kas = rebalance gratis tanpa menjual. Jual hanya bila arus kas tidak cukup.", correct: true },
            { text: "Biarkan — 3% tidak masalah", why: "Salah: 3% < 5pp memang belum picu band — tetapi mengarahkan arus kas tetap benar & gratis." },
            { text: "Ubah target SAA", why: "Salah: mengubah target karena malas rebalance = drift berkedok kebijakan." },
          ],
        },
        {
          q: "Harvesting: rugi Rp10jt, tarif pajak 10%, ada gain Rp25jt. Penghematan?",
          options: [
            { text: "Rp1jt", why: "Tepat: Rp10jt × 10% = Rp1jt — “return” tanpa risiko pasar (lab langkah 6).", correct: true },
            { text: "Rp2,5jt", why: "Salah: itu pajak atas SELURUH gain tanpa harvesting (Rp25jt × 10%)." },
            { text: "Rp10jt", why: "Salah: Rp10jt adalah ruginya — penghematan = rugi × tarif, bukan ruginya." },
            { text: "Rp0 — rugi tidak berguna", why: "Salah: rugi yang direalisasikan mengoffset gain — justru sangat berguna." },
          ],
        },
        {
          q: "Pernyataan TEPAT tentang rebalancing vs market timing?",
          options: [
            { text: "Keduanya sama — menebak arah pasar", why: "Salah: rebalancing tidak menebak apa pun; ia aturan mekanis." },
            { text: "Rebalancing = aturan mekanis tanpa prediksi yang menjaga janji risiko; timing = taruhan berdasar prediksi", why: "Tepat: bedanya di niat & mekanisme — menjaga janji vs mengejar return.", correct: true },
            { text: "Rebalancing hanya untuk pasar turun", why: "Salah: ia bekerja dua arah — jual yang naik, beli yang turun." },
            { text: "Market timing lebih disiplin", why: "Salah: timing diskresioner = emosi berkedok analisis; rebalancing tertulis di IPS = disiplin." },
          ],
        },
      ],
    },
  ],
};
