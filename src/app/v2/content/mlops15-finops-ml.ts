import type { V2Lesson } from "../lib/types";

// Biaya vs waste per job: total biaya (terang) dengan porsi waste (gelap) — train-churn paling boros.
const FIG_WASTE = `<svg viewBox="0 0 480 250" role="img" aria-label="Biaya dan waste per job GPU: train-churn paling boros.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="28" x2="150" y2="208"/></g>
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">
<text x="142" y="62">train-churn</text><text x="142" y="102">train-reco</text>
<text x="142" y="142">serve-ocr</text><text x="142" y="182">serve-embed</text>
</g>
<rect x="150" y="48" width="260" height="20" rx="3" fill="var(--c1)" opacity="0.35"/>
<rect x="150" y="48" width="213" height="20" rx="3" fill="var(--c4)"/>
<text x="418" y="63" font-size="11" fill="var(--text)" font-family="var(--font-ui)">21,6jt (waste 82%)</text>
<rect x="150" y="88" width="181" height="20" rx="3" fill="var(--c1)" opacity="0.35"/>
<rect x="150" y="88" width="69" height="20" rx="3" fill="var(--c4)"/>
<text x="339" y="103" font-size="11" fill="var(--text)" font-family="var(--font-ui)">15jt (waste 38%)</text>
<rect x="150" y="128" width="52" height="20" rx="3" fill="var(--c1)" opacity="0.35"/>
<rect x="150" y="128" width="47" height="20" rx="3" fill="var(--c4)"/>
<text x="210" y="143" font-size="11" fill="var(--text)" font-family="var(--font-ui)">4,3jt (waste 91%)</text>
<rect x="150" y="168" width="29" height="20" rx="3" fill="var(--c1)" opacity="0.35"/>
<rect x="150" y="168" width="13" height="20" rx="3" fill="var(--c4)"/>
<text x="187" y="183" font-size="11" fill="var(--text)" font-family="var(--font-ui)">2,4jt (waste 45%)</text>
<rect x="150" y="216" width="14" height="10" fill="var(--c4)"/><text x="170" y="225" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">waste (GPU dibayar tapi menganggur)</text>
<rect x="330" y="216" width="14" height="10" fill="var(--c1)" opacity="0.35"/><text x="350" y="225" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">biaya termanfaatkan</text>
</svg>`;

export const mlops15: V2Lesson = {
  slug: "mlops15-finops-ml",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps15 — FinOps untuk ML: Mengendalikan Biaya GPU",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tagihan Rp300 juta yang tidak ada pemiliknya",
      prose: [
        "April 2026. NusaPay, startup pembayaran Indonesia, menerima tagihan cloud: Rp300 juta untuk satu bulan — naik 3x dari bulan lalu. CFO memanggil head of ML, Rudi, ke ruangannya: `GPU siapa yang membakar Rp200 juta ekstra?` Rudi menatap dashboard billing: satu baris raksasa bertuliskan `Compute Engine — GPU`. Tidak ada nama tim. Tidak ada nama model. Tidak ada nama eksperimen. Tagihan itu tidak punya pemilik.",
        "Investigasi manual 2 minggu menemukan pelakunya — jamak: (1) eksperimen training PhD intern yang lupa dimatikan: 3×A100 jalan 24 hari tanpa henti (Rp155 juta); (2) cluster serving OCR dengan utilisasi 9% tapi 8 GPU on-demand penuh (Rp35 juta); (3) 40 snapshot disk training yang tidak pernah dihapus sejak Januari (Rp12 juta). Tidak ada yang `salah` secara teknis — semua job berjalan normal. Yang salah: tidak ada yang MENGAWASI.",
        "Twist-nya: Rudi tidak memotong anggaran — ia menerapkan FinOps. Tiga bulan kemudian tagihan stabil di Rp170 juta/bulan DENGAN throughput training naik 40%: tagging wajib di semua resource (tagihan kini punya pemilik), idle detector mematikan job sepi otomatis, training fault-tolerant pindah ke spot (diskon 70%), dan tiap tim dapat laporan showback mingguan. Pelajaran: biaya GPU bukan `takdir` — ia perilaku yang bisa diukur dan diubah.",
        "Prasyarat lesson ini (ringkas, 3 kalimat): kamu perlu paham konsep dasar cloud billing (bayar per jam pemakaian, bukan beli putus) dan jenis instance GPU (on-demand vs spot — yang kedua murah tapi bisa direbut kapan saja). Tidak perlu pengalaman FinOps. Framework-nya dijelaskan dari nol dengan contoh angka ML Indonesia.",
        "⚠️ BATAS SUDUT (anti-tumpang-tindih): lesson llmops6 membahas token economics untuk LLM API (biaya per token ke vendor), dan mle11 menyentuh sudut training cost dari sisi eksperimen. Lesson ini BERBEDA: framework FinOps (Inform–Optimize–Operate dari finops.org) untuk SELURUH workload ML — tagging, showback/chargeback, right-sizing GPU, spot/preemptible, idle detection. Keduanya dirujuk seperlunya, tidak diulang.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan 6 prinsip FinOps dalam bahasa ML; (2) menjalankan fase Inform–Optimize–Operate; (3) merancang skema tagging + laporan showback; (4) menghitung waste GPU dengan rumus (1−U)×C; (5) memilih strategi beli (on-demand/spot/reserved) per workload; (6) menetapkan unit economics ($ per 1.000 prediksi).",
        "Durasi 52 menit · 1 lab analyzer · 6 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita NusaPay · 2) 6 prinsip FinOps · 3) Inform: tagihan harus punya pemilik · 4) Optimize: matikan yang menganggur · 5) Operate: budget, alert & unit economics · 6) Lab: cost analyzer · 7) Peta keputusan · 8) Mini-case: Rp300jt → Rp170jt · 9) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `FinOps = disuruh hemat oleh finance`",
        type: "pitfall",
        body: "FinOps BUKAN pemotongan anggaran — ia disiplin memaksimalkan VALUE per rupiah cloud. NusaPay memangkas 43% tagihan sambil throughput training NAIK 40%: yang dibuang = waste (GPU menganggur), bukan kapasitas produktif. Prinsip resmi finops.org: `decisions are driven by the business value of cloud` — keputusan berdasar nilai bisnis, bukan berdasar siapa teriak paling keras. FinOps yang benar membuat tim ML LEBIH cepat, bukan lebih pelit.",
      },
      reference: "Rp300jt tanpa pemilik → Rp170jt dengan throughput +40%. FinOps = value, bukan potongan.",
    },
    {
      id: "prinsip",
      eyebrow: "Langkah 2 · Konsep",
      title: "6 prinsip FinOps, diterjemahkan ke bahasa ML",
      prose: [
        "FinOps Framework (finops.org, refresh 2026 kini punya kategori khusus AI/ML) berdiri di atas 6 prinsip. Diterjemahkan ke dunia ML: (1) TIM BERKOLABORASI — finance, engineering, dan tim ML melihat data biaya yang SAMA (bukan finance menebak, ML membela diri); (2) SEMUA BERTANGGUNG JAWAB — pemilik eksperimen = pemilik tagihannya, bukan `tanggung jawab DevOps`;",
        "(3) TIM TERPUSAT MENDORONG — satu tim/platform FinOps menyediakan tooling (dashboard, tagging policy, idle detector) agar tim ML tidak membangun sendiri-sendiri; (4) LAPORAN AKSESIBEL & TEPAT WAKTU — showback mingguan ke tiap tim, bukan laporan kuartalan yang basi; (5) KEPUTUSAN BERDASAR NILAI BISNIS — training Rp50 juta yang menaikkan fraud detection 2% = worth it; eksperimen Rp50 juta yang tidak pernah dibaca = waste;",
        "(6) MANFAATKAN MODEL BIAYA VARIABEL — cloud = bayar per jam: matikan saat tidak dipakai, pakai spot untuk yang fault-tolerant, commit untuk baseline yang stabil. Prinsip 6 adalah `kunci` untuk GPU: GPU on-demand 24/7 untuk eksperimen sporadis = menyewa mobil dengan supir siaga untuk perjalanan seminggu sekali.",
        "Tiga FASE framework: INFORM (visibilitas — tagging, alokasi, showback: `siapa membakar apa`), OPTIMIZE (efisiensi — right-sizing, spot, idle shutdown: `bagaimana membakar lebih sedikit`), OPERATE (tata kelola — budget, alert, review rutin: `bagaimana mempertahankannya`). Urutannya WAJIB: optimize tanpa inform = memotong buta (bisa memotong training yang menghasilkan revenue); operate tanpa keduanya = birokrasi tanpa data.",
        "Kategori AI/ML di refresh 2026 mengakui realita baru: workload ML punya pola UNIK — training burst (butuh 100 GPU 3 hari, lalu 0), inference steady (butuh 8 GPU 24/7), eksperimen chaotic (pola tak terduga). Satu strategi beli untuk ketiganya = salah dua. FinOps untuk ML = memetakan tiap pola ke strategi beli yang tepat — itulah isi Langkah 7.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: FinOps = akuntansi yang bisa menyetir",
        body: "Akuntansi biasa = mencatat ke mana uang pergi (lagging). FinOps = akuntansi yang duduk di kursi pengemudi: melihat speedometer (real-time cost), tahu kapan injak rem (idle shutdown), kapan ambil jalan tol murah (spot), dan kapan isi bensin full (reserved). NusaPay tidak butuh akuntan baru — ia butuh speedometer yang bisa dibaca tim ML.",
      },
      reference: "6 prinsip + 3 fase (Inform → Optimize → Operate). Urutan fase tidak boleh dibalik.",
    },
    {
      id: "inform",
      eyebrow: "Langkah 3 · Konsep",
      title: "Inform: setiap rupiah harus punya pemilik",
      prose: [
        "TAGGING = fondasi segalanya. Setiap resource GPU wajib tag: `team` (fraud/reco/nlp), `project` (eksperimen vs produksi), `owner` (email), `env` (dev/staging/prod), `cost-center`. Tanpa tag, tagihan = satu baris `GPU` raksasa seperti NusaPay. Dengan tag, tagihan = tabel per tim per model — dan `misteri Rp200 juta` selesai dalam 5 menit, bukan 2 minggu. Aturan keras: resource tanpa tag WAJIB = otomatis dimatikan setelah 24 jam (policy, bukan imbauan).",
        "SHOWBACK vs CHARGEBACK: showback = laporan `tim fraud membakar Rp95jt bulan ini` (visibilitas, tanpa transfer anggaran) — untuk membangun kesadaran. Chargeback = biaya BENAR-BENAR dibebankan ke budget tim (akuntansi internal) — untuk akuntabilitas penuh. Mulai dari showback (NusaPay: 2 bulan pertama), naik ke chargeback setelah tim percaya datanya. Chargeback sebelum data akurat = perang antar tim.",
        "ALOKASI BIAYA BERSAMA: cluster training dipakai 3 tim? Bagi berdasar GPU-hours per tim (dari scheduler log: Kubernetes/Slurm mencatat siapa memakai apa). Jangan bagi rata — bagi rata menghukum tim yang efisien dan mensubsidi yang boros. Shared cost yang tidak dialokasikan = insentif untuk boros (`toh bayarnya bareng`).",
        "ANOMALY DETECTION: tagihan harian naik 40% tiba-tiba? Alert ke owner tag + tim FinOps DALAM hitungan jam, bukan saat invoice akhir bulan. Kasus NusaPay: intern lupa mematikan job — dengan anomaly alert, ketahuan di hari ke-2 (rugi Rp10jt), bukan hari ke-24 (Rp155jt). Deteksi = asuransi termurah.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Tagging = kerjaan admin, nanti saja`",
        type: "pitfall",
        body: "`Nanti saja` = tidak pernah. Tagging retroaktif untuk 500 resource = 2 minggu kerja manual yang dibenci semua orang; tagging saat provisioning (via Terraform! — lihat MLOps14) = 5 baris kode sekali tulis. NusaPay menegakkannya sebagai policy: pipeline CI menolak resource tanpa tag wajib. Tagging bukan admin — ia INSTRUMENTASI, sama pentingnya dengan logging.",
      },
      reference: "Tag wajib → showback mingguan → chargeback bertahap. Shared cost dibagi per pemakaian, bukan rata.",
    },
    {
      id: "optimize",
      eyebrow: "Langkah 4 · Konsep",
      title: "Optimize: buru waste, bukan kapasitas",
      prose: [
        "WASTE GPU punya rumus sederhana: W = (1 − U) × C — waste = porsi menganggur dikali biaya. U = utilisasi (0–1), C = biaya. Contoh train-churn NusaPay: U = 0,18, C = Rp21,6jt/bulan → W = 0,82 × 21,6jt = Rp17,7jt/bulan DIBUANG. Empat job, total waste Rp28,4jt dari Rp43,3jt = 65,6%! Angka ini (bukan `tagihan naik`) yang membuat CFO dan tim ML akhirnya sepakat: musuhnya waste, bukan satu sama lain.",
        "IDLE DETECTION: utilisasi GPU < 20% selama 7 hari berturut-turut = kandidat matikan/turunkan. serve-ocr NusaPay: U = 9% di 8 GPU — solusinya bukan `beli GPU lebih kecil` saja, melainkan gabungkan dengan serve-embed di GPU yang sama (bin-packing, seperti MLOps11) ATAU pindah ke autoscaling-to-zero (scale to 0 saat tidak ada request, cold start 30 detik — boleh untuk OCR batch, tidak boleh untuk fraud real-time).",
        "SPOT / PREEMPTIBLE (diskon 60–90%): GPU yang bisa direbut kapan saja — COCOK untuk training fault-tolerant (checkpoint tiap epoch → lanjutkan saat direbut) dan batch inference; TIDAK COCOK untuk serving real-time dan training tanpa checkpoint. train-churn + train-reco NusaPay (fault-tolerant, checkpoint tiap 30 menit) pindah ke spot: hemat 70% × Rp36,6jt = Rp25,6jt/bulan. Satu baris konfigurasi scheduler, penghematan terbesar.",
        "RIGHT-SIZING: training di A100 tapi utilisasi memori 30%? Turun ke L4/A10 (setengah harga, cukup). Serving butuh latensi p99 < 100ms? Mungkin TETAP butuh A100 — right-sizing bukan `selalu turun`, melainkan `cocokkan dengan kebutuhan`. Ukur dulu (profiling 1 hari), baru putuskan — menebak = memindahkan waste, bukan menghilangkannya.",
        "COMMITMENT / RESERVED (diskon 30–60% untuk komitmen 1–3 tahun): untuk BASELINE yang stabil — cluster serving produksi yang 24/7 setahun penuh. Jangan commit untuk eksperimen (pola chaotic) atau training burst (selesai 3 hari). Aturan: commit = max 70% dari baseline terendah 3 bulan terakhir; sisanya on-demand/spot untuk fleksibilitas. Commit 100% = membayar GPU yang menganggur di muka.",
      ],
      formula: String.raw`W = (1 - U) \times C`,
      formulaNote: "W = waste (rupiah per periode); U = utilisasi GPU (0 sampai 1 — fraksi waktu GPU benar-benar komputasi, bukan idle); C = biaya GPU pada periode yang sama. Contoh: U=0,18, C=Rp21,6jt → W = 0,82 × 21,6jt = Rp17,7jt/bulan terbuang. Interpretasi: W/C > 50% = alarm merah; 20–50% = kuning (optimasi); < 20% = sehat. Rumus ini bekerja per job, per tim, per cluster.",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: GPU = taksi argo, bukan mobil pribadi",
        body: "On-demand 24/7 untuk job sporadis = beli mobil + supir siaga untuk dipakai seminggu sekali. Spot = taksi online (murah, tapi bisa dibatalkan — cocok kalau kamu tidak buru-buru dan bawa `payung` checkpoint). Reserved = langganan antar-jemput (murah untuk rute harian yang pasti). Pilih moda sesuai perjalanan — bukan satu moda untuk semua.",
      },
      reference: "W = (1−U)×C. Idle <20% = matikan. Spot = training fault-tolerant. Commit ≤70% baseline.",
    },
    {
      id: "operate",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Operate: budget, alert & unit economics",
      prose: [
        "BUDGET + ALERT: tiap tim punya budget GPU bulanan (dari data 3 bulan terakhir + rencana). Alert BERLAPIS: 50% (info ke owner), 80% (peringatan ke lead), 100% (freeze provisioning baru sampai review). Budget tanpa enforcement = saran; enforcement tanpa data akurat = konflik. NusaPay: budget tim fraud Rp100jt; saat menyentuh 80% di tanggal 20, lead memutuskan: eksperimen non-kritis pindah ke spot, training kritis jalan terus. Keputusan 10 menit, bukan rapat darurat akhir bulan.",
        "UNIT ECONOMICS — metrik FinOps paling dewasa: biaya per unit NILAI. Untuk ML: Rp per 1.000 prediksi (serving), Rp per training run hingga konvergen (training), Rp per 1% kenaikan metrik bisnis (eksperimen). Contoh: serve-ocr Rp4,32jt/bulan ÷ 2,88 juta prediksi = Rp1.500 per 1.000 prediksi. Setelah optimasi (gabung GPU + autoscale): Rp900 per 1.000 prediksi. Sekarang CFO bisa bertanya dengan benar: `apakah Rp900/1k prediksi worth it untuk revenue yang dihasilkannya?` — bukan `kenapa GPU mahal?`.",
        "REVIEW RUTIN: 30 menit tiap 2 minggu — tim ML + FinOps melihat: top 5 waste, anomali, progress vs budget, keputusan beli berikutnya. Bukan sidang — melainkan standup. Yang dibahas: `idle detector mematikan 12 job minggu ini (hemat Rp8jt)`, `usulan commit 10 GPU untuk serving baru`. Ritme > intensitas: 30 menit rutin mengalahkan audit 3 hari tiap kuartal.",
        "KULTUR: rayakan penghematan seperti merayakan launch. NusaPay memberi `waste hunter of the month` untuk engineer yang menemukan waste terbesar — hadiahnya GPU hours gratis untuk eksperimen pribadinya. Insentif yang selaras: hemat = dapat resource lebih untuk riset. FinOps gagal saat ia terasa seperti polisi; berhasil saat ia terasa seperti cheat code.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tanpa operate, optimasi MELAYU dalam 3 bulan (job idle muncul lagi, spot kembali on-demand `biar aman`). Risiko nyata: budget freeze yang buta bisa mematikan training model fraud di tengah lonjakan transaksi — mitigasinya alert berlapis + pengecualian untuk workload kritis bisnis. FinOps = kontrol risiko biaya, bukan sekadar hemat.",
      },
      reference: "Budget berlapis (50/80/100%). Unit economics: Rp per 1.000 prediksi. Review 30 menit/2 minggu.",
    },
    {
      id: "lab-cost",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: cost analyzer — dari tagihan ke keputusan",
      prose: [
        "SIMULASI — lab ini mensimulasikan FASE INFORM + OPTIMIZE FinOps dalam Python murni: 4 job GPU NusaPay (nama, jam, utilisasi, tarif, fault-tolerant atau tidak). Tugasmu: hitung biaya, waste, deteksi idle, dan estimasi hemat spot.",
        "Cara membaca: tiap baris showback = biaya vs waste per job + flag idle (YA/tidak). Baris ringkasan = total biaya, total waste + persentasenya, daftar job idle, estimasi hemat spot. Interpretasi: waste 65,6% = fase INFORM selesai (masalah terukur); idle + spot = rekomendasi OPTIMIZE yang konkret (fase berikutnya). Inilah artefak yang dibawa Rudi ke CFO — bukan keluhan, melainkan angka + rencana.",
        "Coba eksplorasi: naikkan util train-churn jadi 0,85 — bagaimana waste dan flag idle berubah? (Petunjuk: ia keluar dari daftar idle.) Ubah serve-ocr menjadi fault_tolerant=True — apa efeknya ke hemat_spot? (Petunjuk: spot hanya untuk yang fault-tolerant.) Inilah `what-if` yang dilakukan tim FinOps sebelum mengubah strategi beli.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `cost(j)` = hours × rate, dan `rp(x)` sudah disediakan" },
        { id: "t2", text: "Implementasikan `waste(j)` = (1−util) × cost, dan `idle(j)` = util < 0,20" },
        { id: "t3", text: "Implementasikan `spot_saving(j)` = 70% × cost bila fault-tolerant; jalankan agregasi" },
      ],
      expected: "total_biaya=Rp43.320.000 · total_waste=Rp28.423.200 (65,6%) · idle: train-churn, serve-ocr · hemat_spot=Rp25.620.000",
      note: {
        title: "💡 Intuisi: analyzer = kaca pembesar sebelum pisau bedah",
        body: "Dokter tidak mengoperasi sebelum rontgen. Cost analyzer = rontgen tagihan: ia TIDAK mematikan apa pun — ia menunjukkan di mana waste-nya, seberapa besar, dan apa obatnya. Rudi tidak datang ke CFO dengan `kita harus hemat`; ia datang dengan `waste Rp28,4jt/bulan, obatnya: matikan 2 job idle + pindahkan 2 training ke spot = hemat Rp25,6jt + Rp8jt`. Angka dulu, keputusan kemudian.",
      },
      hints: [
        "cost: kembalikan j[\"hours\"] * j[\"rate\"].",
        "waste: (1 - j[\"util\"]) * cost(j). idle: j[\"util\"] < 0.20.",
        "spot_saving: 0.70 * cost(j) jika j[\"fault_tolerant\"], else 0.",
      ],
      code: {
        starter: `JOBS = [\n    {"name": "train-churn", "gpu": "a100", "hours": 720, "util": 0.18, "rate": 30000, "fault_tolerant": True},\n    {"name": "train-reco", "gpu": "a100", "hours": 500, "util": 0.62, "rate": 30000, "fault_tolerant": True},\n    {"name": "serve-ocr", "gpu": "t4", "hours": 720, "util": 0.09, "rate": 6000, "fault_tolerant": False},\n    {"name": "serve-embed", "gpu": "t4", "hours": 400, "util": 0.55, "rate": 6000, "fault_tolerant": False},\n]\n\ndef rp(x):\n    return "Rp" + f"{x:,.0f}".replace(",", ".")\n\n# TULIS KODEMU\ndef cost(j):\n    ...\n\ndef waste(j):\n    ...\n\ndef idle(j):\n    ...\n\ndef spot_saving(j):\n    ...\n\n# AGREGASI (jangan ubah)\nfor j in JOBS:\n    print(f"showback: {j['name']} biaya={rp(cost(j))} waste={rp(waste(j))} idle={'YA' if idle(j) else 'tidak'}")\ntotal = sum(cost(j) for j in JOBS)\ntw = sum(waste(j) for j in JOBS)\nidles = [j["name"] for j in JOBS if idle(j)]\nss = sum(spot_saving(j) for j in JOBS)\nprint(f"total_biaya={rp(total)}")\nprint(f"total_waste={rp(tw)} ({f'{tw/total*100:.1f}'.replace('.', ',')}%)")\nprint(f"idle: {', '.join(idles)}")\nprint(f"hemat_spot={rp(ss)}")`,
        lockLines: 10,
        solution: `JOBS = [\n    {"name": "train-churn", "gpu": "a100", "hours": 720, "util": 0.18, "rate": 30000, "fault_tolerant": True},\n    {"name": "train-reco", "gpu": "a100", "hours": 500, "util": 0.62, "rate": 30000, "fault_tolerant": True},\n    {"name": "serve-ocr", "gpu": "t4", "hours": 720, "util": 0.09, "rate": 6000, "fault_tolerant": False},\n    {"name": "serve-embed", "gpu": "t4", "hours": 400, "util": 0.55, "rate": 6000, "fault_tolerant": False},\n]\n\ndef rp(x):\n    return "Rp" + f"{x:,.0f}".replace(",", ".")\n\n# TULIS KODEMU\ndef cost(j):\n    return j["hours"] * j["rate"]\n\ndef waste(j):\n    return (1 - j["util"]) * cost(j)\n\ndef idle(j):\n    return j["util"] < 0.20\n\ndef spot_saving(j):\n    return 0.70 * cost(j) if j["fault_tolerant"] else 0\n\n# AGREGASI (jangan ubah)\nfor j in JOBS:\n    print(f"showback: {j['name']} biaya={rp(cost(j))} waste={rp(waste(j))} idle={'YA' if idle(j) else 'tidak'}")\ntotal = sum(cost(j) for j in JOBS)\ntw = sum(waste(j) for j in JOBS)\nidles = [j["name"] for j in JOBS if idle(j)]\nss = sum(spot_saving(j) for j in JOBS)\nprint(f"total_biaya={rp(total)}")\nprint(f"total_waste={rp(tw)} ({f'{tw/total*100:.1f}'.replace('.', ',')}%)")\nprint(f"idle: {', '.join(idles)}")\nprint(f"hemat_spot={rp(ss)}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "total biaya", msg: "Total biaya 4 job harus Rp43.320.000.", pattern: "total_biaya=Rp43\\.320\\.000" },
          { kind: "stdout_matches", task: "t3", label: "total waste 65,6%", msg: "Total waste harus Rp28.423.200 (65,6%).", pattern: "total_waste=Rp28\\.423\\.200 \\(65,6%\\)" },
          { kind: "stdout_matches", task: "t3", label: "job idle", msg: "Job idle harus train-churn dan serve-ocr.", pattern: "idle: train-churn, serve-ocr" },
          { kind: "stdout_matches", task: "t3", label: "hemat spot", msg: "Hemat spot harus Rp25.620.000 (70% dari 2 training).", pattern: "hemat_spot=Rp25\\.620\\.000" },
        ],
      },
      reference: "Simulasi fase Inform+Optimize (bukan billing asli). Waste 65,6% = masalah terukur.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "On-demand, spot, reserved, atau serverless?",
      prose: [
        "**Skenario 1 — Training eksperimen, fault-tolerant (checkpoint tiap epoch).** → Spot/preemptible (diskon 60–90%). Direbut = lanjutkan dari checkpoint. Hemat terbesar, risiko terkecil.",
        "**Skenario 2 — Serving produksi 24/7, pola stabil setahun.** → Reserved/commitment untuk baseline (diskon 30–60%, commit ≤70% baseline) + on-demand untuk spike. Jangan commit 100%.",
        "**Skenario 3 — Serving sporadis (OCR batch malam hari).** → Autoscaling to zero / serverless GPU. Bayar hanya saat ada request; cold start 30 detik bisa diterima untuk batch.",
        "**Skenario 4 — Training kritis deadline ketat (model fraud sebelum Lebaran).** → On-demand. Kepastian > diskon; preemption di tengah deadline = bencana. Ini `asuransi` yang worth it.",
        "**Skenario 5 — Eksperimen data scientist yang tak terduga polanya.** → On-demand + idle detector agresif (matikan <20% dalam 24 jam) + budget per orang. Fleksibilitas dengan rem.",
        "**Skenario 6 — Tagihan naik tiba-tiba, penyebab belum jelas.** → JANGAN langsung potong! Kembali ke INFORM: tagging, showback, anomaly alert. Memotong buta = memotong yang menghasilkan revenue.",
        "Aturan praktis 10 detik: `bisa direbut tanpa nangis?` → spot. `24/7 setahun?` → reserved (≤70%). `kadang-kadang?` → autoscale-to-zero. `deadline mati?` → on-demand. `tidak tahu siapa bakar?` → inform dulu.",
      ],
      figure: {
        svg: FIG_WASTE,
        alt: "Biaya dan waste per job GPU: train-churn paling boros.",
        caption: "Cara membaca: tiap baris = 1 job; panjang batang penuh = total biaya/bulan; segmen gelap = waste (1−U)×C; label kanan = biaya + % waste. Interpretasi: train-churn (82% waste) dan serve-ocr (91% waste) = target OPTIMIZE pertama — keduanya idle. train-reco (38%) = kandidat spot, bukan dimatikan (masih produktif). Jangan baca chart ini sebagai `matikan yang batangnya panjang` — baca sebagai `obati sesuai diagnosis`.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: strategi beli = strategi parkir",
        body: "On-demand = parkir valet (mahal, selalu ada tempat). Spot = parkir liar murah (bisa digusur kapan saja — cocok kalau mobilmu bisa pindah sendiri = checkpoint). Reserved = sewa slot tahunan (murah untuk mobil yang tiap hari di situ). Serverless = ojek (bayar per trip, tidak punya mobil). Pilih sesuai seberapa sering dan sepenting apa perjalananmu.",
      },
      reference: "Fault-tolerant → spot. 24/7 stabil → reserved ≤70%. Sporadis → scale-to-zero. Deadline → on-demand.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Hitungan NusaPay: Rp300 juta jadi Rp170 juta?",
      prose: [
        "Baseline: Rp300jt/bulan. Rincian temuan: eksperimen intern lupa mati Rp155jt + serving OCR over-provision Rp35jt + snapshot yatim Rp12jt + baseline sehat Rp98jt. Target: Rp170jt (hemat Rp130jt = 43%) TANPA memotong kapasitas produktif.",
        "Rencana optimize: (a) Idle detector + policy tag: eksperimen intern mati di hari ke-2 jika terulang (hemat Rp145jt dari Rp155jt — sisakan Rp10jt untuk 2 hari wajar); (b) serve-ocr: gabung GPU + autoscale, 8→3 GPU (hemat Rp22jt dari Rp35jt); (c) hapus snapshot >90 hari + lifecycle policy (hemat Rp12jt); (d) 2 training fault-tolerant ke spot: 70% × Rp36,6jt = hemat Rp25,6jt. Total hemat = 145+22+12+25,6 = Rp204,6jt?? — melebihi target karena (a) dan (d) tumpang tindih (eksperimen intern termasuk training). Hitung bersih: Rp300jt − Rp130jt = Rp170jt/bulan. Pelajaran: ukur dulu per kategori, baru jumlahkan — jangan double-count.",
        "Unit economics sesudah: serving OCR Rp4,32jt → Rp2,1jt/bulan untuk 2,88 juta prediksi = Rp729 per 1.000 prediksi (dari Rp1.500). Training fraud: Rp98jt → Rp72jt/bulan dengan throughput +40% (spot memungkinkan eksperimen 2x lebih banyak dengan budget sama). CFO kini melihat: biaya per prediksi TURUN 51%, kapasitas NAIK — FinOps sebagai growth enabler, bukan cost center.",
        "Pembahasan: (1) 70% penghematan datang dari 3 aksi: matikan yang lupa, kecilkan yang over-provision, pindahkan yang fault-tolerant ke spot — semuanya butuh INFORM dulu (tagging + analyzer lab ini); (2) jangan kejar Rp0 — targetnya waste ≈ 0, bukan biaya ≈ 0; (3) operate (budget + review 2 mingguan) yang menjaga angka ini tidak melar lagi dalam 3 bulan.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko terbesar FinOps = optimasi buta: memindahkan training fraud ke spot TANPA checkpoint = preemption di tengah deadline = model basi saat dibutuhkan. Mitigasi NusaPay: klasifikasi fault-tolerant WAJIB di tag (field di lab!), workload kritis dikecualikan dari spot via policy. Hemat Rp25jt tidak sebanding risiko Rp450jt fraud lolos.",
      },
      reference: "Rp300jt → Rp170jt (hemat 43%). 70% dari: matikan lupa + right-size + spot. Jangan double-count.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Tagihan NusaPay Rp300jt `tidak punya pemilik`. Langkah pertama yang BENAR menurut framework?",
          options: [
            { text: "Langsung matikan job terbesar — pasti itu pelakunya", why: "Memotong buta = bisa mematikan training yang menghasilkan revenue. Tanpa data, ini judi." },
            { text: "INFORM: tagging wajib + showback + anomaly detection — ukur dulu siapa membakar apa", why: "Tepat. Urutan fase WAJIB: Inform → Optimize → Operate. Optimize tanpa inform = memotong buta.", correct: true },
            { text: "Minta finance menambah budget 3x lipat", why: "Menambah budget tanpa visibilitas = mensubsidi waste. Masalahnya bukan jumlah budget." },
            { text: "Pindahkan semua ke spot sekaligus", why: "Spot untuk SEMUA = serving real-time ikut bisa direbut = outage. Strategi beli harus per pola workload." },
          ],
        },
        {
          q: "Job: U = 0,18, C = Rp21,6jt/bulan. Waste dan statusnya?",
          options: [
            { text: "W = Rp3,9jt — sehat, biarkan", why: "Salah hitung: (1−0,18) = 0,82, bukan 0,18. 0,18 × 21,6jt = Rp3,9jt adalah porsi TERM ANFAATKAN, bukan waste." },
            { text: "W = Rp17,7jt (82%) — alarm merah, kandidat idle/shutdown atau pindah spot", why: "Tepat. W = (1−U)×C = 0,82 × 21,6jt. W/C > 50% = merah; U < 20% = flag idle.", correct: true },
            { text: "W = Rp21,6jt — seluruhnya waste", why: "18% termanfaatkan = bukan waste. Seluruhnya waste hanya jika U = 0." },
            { text: "Tidak bisa dihitung tanpa tahu tim pemiliknya", why: "Waste adalah soal TEKNIS (utilisasi × biaya); pemilik = soal akuntabilitas. Keduanya penting, tapi waste terhitung tanpa nama tim." },
          ],
        },
        {
          q: "Training fault-tolerant dengan checkpoint tiap 30 menit, deadline longgar. Strategi beli?",
          options: [
            { text: "On-demand 24/7 — paling aman", why: "Aman tapi 3x lebih mahal tanpa alasan: fault-tolerant + deadline longgar = preemption bukan bencana." },
            { text: "Reserved 3 tahun — diskon terbesar", why: "Reserved untuk baseline STABIL 24/7; training eksperimen polanya chaotic — commit = membayar GPU menganggur di muka." },
            { text: "Spot/preemptible (diskon 60–90%) — direbut = lanjutkan dari checkpoint", why: "Tepat. Inilah kasus ideal spot: fault-tolerant + tidak deadline-kritis. Hemat Rp25,6jt/bulan di NusaPay.", correct: true },
            { text: "Serverless GPU — bayar per request", why: "Serverless untuk inference sporadis, bukan training berjam-jam. Model billing-nya tidak cocok." },
          ],
        },
        {
          q: "Bedakan showback vs chargeback, dan kapan naik tingkat?",
          options: [
            { text: "Sama saja — keduanya memotong budget tim", why: "Beda: showback = visibilitas TANPA transfer anggaran; chargeback = biaya benar-benar dibebankan. Disamakan = konflik." },
            { text: "Showback dulu (kesadaran, 2 bulan); chargeback setelah tim percaya datanya (akuntabilitas)", why: "Tepat. Chargeback sebelum data akurat = perang antar tim soal `angka ini salah`. Kepercayaan dulu, akuntabilitas kemudian.", correct: true },
            { text: "Chargeback langsung hari pertama — efek kejut", why: "Efek kejut dengan data yang belum dipercaya = tim menghabiskan waktu membantah angka, bukan menghemat." },
            { text: "Hanya chargeback yang berguna; showback buang waktu", why: "Showback = fondasi kepercayaan. NusaPay 2 bulan showback membuat chargeback berjalan tanpa protes." },
          ],
        },
        {
          q: "Unit economics `Rp729 per 1.000 prediksi` lebih berguna dari `tagihan Rp2,1jt` karena?",
          options: [
            { text: "Angkanya lebih kecil sehingga terlihat murah", why: "Bukan soal terlihat murah — Rp729/1k bisa MAHAL jika revenue per prediksi lebih kecil. Ini soal rasio, bukan kosmetik." },
            { text: "Menghubungkan biaya ke NILAI: CFO bisa menilai worth it tidaknya per unit output bisnis", why: "Tepat. `Rp2,1jt` = biaya mentah (naik/turun tidak bermakna); `Rp729/1k prediksi` = efisiensi yang bisa dibandingkan antar periode dan vs revenue.", correct: true },
            { text: "Menghilangkan kebutuhan tagging", why: "Terbalik: unit economics BUTUH alokasi biaya yang benar — yang datang dari tagging. Tanpa tag, angkanya fiktif." },
            { text: "Membuat finance tidak perlu dilibatkan lagi", why: "FinOps = kolaborasi (prinsip 1). Unit economics justru BAHASA BERSAMA finance dan ML." },
          ],
        },
        {
          q: "Batas sudut lesson ini vs llmops6 dan mle11?",
          options: [
            { text: "Sama — ketiganya tentang biaya training", why: "Salah: llmops6 = token economics LLM API (bayar per token ke vendor); mle11 = sudut training cost dari eksperimen. Lesson ini = framework FinOps untuk seluruh workload ML." },
            { text: "Lesson ini = framework FinOps (Inform–Optimize–Operate, tagging, showback, right-sizing, spot, idle) untuk workload ML; llmops6/mle11 hanya dirujuk seperlunya", why: "Tepat. Inilah batas sudut yang ditulis eksplisit di Langkah 1: FinOps sebagai disiplin, bukan satu jenis biaya.", correct: true },
            { text: "Lesson ini menggantikan keduanya", why: "Tidak menggantikan — melengkapi. Token economics dan training cost tetap punya lesson sendiri." },
            { text: "Tidak ada batas — tumpang tindih tidak masalah", why: "Tumpang tindih = pelajar membayar dua kali untuk konten sama. Batas sudut menjaga tiap lesson punya wilayah sendiri." },
          ],
        },
      ],
      summary: [
        "FinOps = disiplin value per rupiah cloud (bukan pemotongan): NusaPay Rp300jt → Rp170jt dengan throughput +40%.",
        "6 prinsip (kolaborasi, ownership, tim terpusat, laporan aksesibel, keputusan berdasar nilai bisnis, manfaatkan biaya variabel) + 3 fase berurutan: Inform → Optimize → Operate.",
        "Inform: tagging wajib (policy, bukan imbauan), showback dulu baru chargeback, shared cost dibagi per pemakaian, anomaly alert dalam hitungan jam.",
        "Optimize: W = (1−U)×C; idle <20% = matikan; spot (60–90%) untuk fault-tolerant; right-size ukur-dulu; commit ≤70% baseline.",
        "Operate: budget berlapis 50/80/100%, unit economics (Rp per 1.000 prediksi), review 30 menit/2 minggu, rayakan penghematan.",
        "Strategi beli per pola: fault-tolerant → spot; 24/7 stabil → reserved; sporadis → scale-to-zero; deadline → on-demand; tak tahu pemilik → inform dulu.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
