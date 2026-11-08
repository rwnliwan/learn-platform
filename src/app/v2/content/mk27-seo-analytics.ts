import type { V2Lesson } from "../lib/types";

const FIG_CTR_CURVE = `<svg viewBox="0 0 560 340" role="img" aria-label="Kurva CTR per posisi hasil pencarian dari data lab.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">CTR per posisi: peringkat 1 vs peringkat 6</text>
<line x1="60" y1="290" x2="540" y2="290" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="290" x2="60" y2="40" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="295" font-size="9" fill="var(--chart-text)">0%</text>
<text x="14" y="228" font-size="9" fill="var(--chart-text)">10%</text>
<text x="14" y="166" font-size="9" fill="var(--chart-text)">20%</text>
<text x="14" y="104" font-size="9" fill="var(--chart-text)">30%</text>
<line x1="60" y1="225" x2="540" y2="225" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="160" x2="540" y2="160" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="95" x2="540" y2="95" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<polyline points="100,100 180,180 260,199 340,242 420,242 500,260" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="100" cy="100" r="6" fill="var(--c1)"/>
<circle cx="180" cy="180" r="6" fill="var(--c1)"/>
<circle cx="260" cy="199" r="6" fill="var(--c1)"/>
<circle cx="340" cy="242" r="6" fill="var(--c1)"/>
<circle cx="420" cy="242" r="6" fill="var(--c1)"/>
<circle cx="500" cy="260" r="6" fill="var(--c1)"/>
<text x="100" y="120" font-size="10" fill="var(--c1)" font-weight="bold">30%</text>
<text x="500" y="280" font-size="10" fill="var(--c1)" font-weight="bold">3%</text>
<text x="100" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Pos 1</text>
<text x="180" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Pos 2</text>
<text x="260" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Pos 3</text>
<text x="340" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Pos 4</text>
<text x="420" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Pos 5</text>
<text x="500" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Pos 6</text>
<text x="300" y="60" font-size="10" fill="var(--chart-text)">turun 10× lipat dari posisi 1 ke 6</text>
</g>
</svg>`;

export const mk27: V2Lesson = {
  slug: "mk27-seo-analytics",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK27 — SEO Analytics: Mengukur Mesin Organik",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Traffic organik +200%, revenue organik datar",
      prose: [
        "Agensi \"NaikPeringkat\" merayakan kemenangan terbesarnya: dalam 6 bulan, traffic organik klien skincare \"Murni\" naik 200% — dari 40 ribu ke 120 ribu kunjungan per bulan. Slide keberhasilannya viral di LinkedIn. Tiga bulan kemudian klien menelepon dengan nada berbeda: 'traffic naik, kenapa revenue organik saya datar saja?'",
        "Audit Search Console mengungkap jawabannya: 78% traffic baru datang dari query informasional — \"cara menghilangkan jerawat\", \"urutan skincare yang benar\" — artikel blog yang dibaca lalu ditutup, tanpa pernah menyentuh halaman produk. Sementara itu query transaksional (\"beli serum vitamin c\") malah DILAYANI DUA HALAMAN sekaligus — halaman produk dan halaman kategori berebut peringkat untuk query yang sama, saling mencuri klik. Agensi telah mengoptimalkan yang MUDAH diukur (traffic), bukan yang penting (revenue).",
        "Twist-nya: SEO yang 'berhasil' menurut dashboard bisa GAGAL menurut laporan keuangan — karena peringkat adalah vanity metric bila query-nya salah. Lesson ini tentang mengukur SEO seperti analis: funnel organik query → impresi → klik → konversi, CTR per posisi, perbedaan branded vs non-branded, dan cara menghubungkan Search Console ke revenue. Karena traffic yang tidak menghasilkan uang hanyalah biaya server yang dibungkus prestasi.",
      ],
      tasks: [],
      note: {
        title: "Konteks pasar",
        type: "risk",
        body: "Riset lowongan 2026: SEO analytics diminta eksplisit di JD analis marketing/growth — dengan frasa 'mampu menghubungkan performa organik ke revenue, bukan sekadar traffic'. Skill yang dinilai: membaca Search Console + GA4 sebagai SATU cerita, bukan dua dashboard terpisah.",
      },
      reference: "Peringkat tanpa query yang tepat = vanity metric berbayar server.",
    },
    {
      id: "konsep-funnel",
      eyebrow: "Langkah 2 · Konsep",
      title: "Funnel organik: query → impresi → klik → konversi",
      prose: [
        "Si Penjual Sunyi — ia bekerja tanpa membayar per klik, tetapi bukan tanpa biaya. Funnel organik punya 4 gerbang: QUERY (apa yang diketik orang — niatnya), IMPRESI (berapa kali halamanmu MUNCUL di hasil), KLIK (berapa yang mengeklik), KONVERSI (berapa yang membeli). Tiap gerbang punya metriknya: volume & intent di query, rata-rata posisi di impresi, CTR di klik, dan revenue di konversi.",
        "Kesalahan klasik analis junior: melompat dari impresi langsung ke traffic tanpa memeriksa CTR — 'impresi naik 50%!' padahal CTR anjlok karena judul (title tag) tidak menarik. Atau melompat dari klik ke revenue tanpa memeriksa intent — 'klik naik 2×!' padahal query-nya informasional. Funnel memaksamu bertanya di gerbang yang TEPAT: impresi naik tapi klik datar → masalah CTR (judul/deskripsi); klik naik tapi konversi datar → masalah intent (query salah) atau landing page.",
        "Satu angka jembatan yang wajib dihafal: expected traffic = impresi × CTR posisi. Bila halamanmu di posisi 6 dengan 9.000 impresi dan CTR posisi 6 ≈ 3%, ekspektasinya 270 klik — persis angka lab. Naik ke posisi 3 (CTR ≈ 12%) = 1.080 klik, 4× lipat TANPA menambah satu impresi pun. Inilah mengapa analis SEO terobsesi pada 'posisi', bukan pada 'traffic'.",
        "🚨 Mitos: 'SEO = bikin konten sebanyak-banyaknya.' Yang benar: 50 artikel untuk query yang salah < 5 artikel untuk query transaksional yang tepat. Volume konten tanpa peta intent = menumpuk biaya penulis untuk traffic yang tidak membeli.",
      ],
      tasks: [],
      formula: String.raw`\text{CTR} = \frac{\text{klik}}{\text{impresi}} \quad ; \quad T = \sum_i \text{impresi}_i \times \text{CTR}_{pos_i}`,
      formulaNote: "CTR (click-through rate) = klik / impresi — proporsi orang yang melihat hasilmu lalu mengeklik. T = ekspektasi traffic total = jumlah atas semua query dari impresi × CTR pada posisinya. Contoh lab: query 'harga sunscreen' posisi 6, impresi 9.000, CTR 0,03 → T = 270 klik. Interpretasi: CTR mengukur daya tarik SNIPPET-mu (judul + deskripsi), BUKAN kualitas konten — konten terbaik di dunia dengan judul membosankan tetap sepi klik.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan CTR antar-query tanpa memperhatikan INTENT: query branded ('murni skincare') CTR-nya 45% karena pencari SUDAH berniat ke tokomu; query non-branded ('skincare untuk kulit kering') CTR 8% padahal itu justru kemenangan besar (mencuri perhatian dari kompetitor). Bandingkan CTR hanya dalam KELAS intent yang sama.",
      },
      reference: "Diagnosis per gerbang: impresi→CTR, klik→intent, konversi→landing page.",
    },
    {
      id: "konsep-branded",
      eyebrow: "Langkah 3 · Konsep",
      title: "Branded vs non-branded: dua perang yang berbeda",
      prose: [
        "Si Kembar Beda Nasib. Query BRANDED menyebut merekmu ('murni serum') — pencari sudah memutuskan, CTR 30–50%, konversi tinggi. Query NON-BRANDED tidak menyebut merek ('serum vitamin c terbaik') — pencari masih membandingkan, CTR 3–10%, tetapi di sinilah pelanggan BARU berasal. Agensi yang melaporkan 'CTR organik 25%' tanpa memisahkan keduanya biasanya sedang menyembunyikan bahwa 90% traffic-nya branded — alias memanen orang yang memang sudah mau beli.",
        "Implikasi analisnya tajam: (1) KPI SEO yang jujur SELALU dipisah branded/non-branded — pertumbuhan non-branded = pertumbuhan pasar, pertumbuhan branded = pertumbuhan merek (atau sekadar musim); (2) strategi konten berbeda — branded butuh halaman produk yang sempurna, non-branded butuh konten pembanding/edukasi yang memenangkan kepercayaan; (3) saat bos bertanya 'kenapa traffic turun bulan ini?', jawaban pertama yang dicek: apakah yang turun branded (masalah merek/PR) atau non-branded (masalah peringkat)?",
        "Jebakan musiman: query branded melonjak saat kampanye iklan TV/influencer berjalan — analis yang tidak memisahkan akan mengklaim 'SEO membaik' padahal yang bekerja adalah budget iklan. Selalu anotasi dashboard organik dengan kalender kampanye berbayar.",
        "🚨 Mitos: 'Naik peringkat untuk nama brand sendiri = prestasi SEO.' Yang benar: peringkat #1 untuk brand-mu sendiri adalah HAK, bukan prestasi — Google hampir selalu menaruh pemilik brand di atas. Prestasi SEO yang nyata hanya diukur di arena non-branded.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Rasio branded : non-branded adalah 'sidik jari' strategi: startup baru yang sehat ≈ 30:70 (banyak pelanggan baru dari non-branded); brand mapan ≈ 60:40. Bila rasio startup-mu 90:10, SEO-mu bukan mesin akuisisi — ia cuma papan nama digital. Angka ini bercerita lebih jujur daripada total traffic.",
      },
      reference: "Pisahkan branded/non-branded di SEMUA laporan organik; prestasi = arena non-branded.",
    },
    {
      id: "konsep-kanibal",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kanibalisasi: dua halaman, satu query, nol pemenang",
      prose: [
        "Si Kembar Berebut — dua halamanmu saling jegal di hasil pencarian. Kanibalisasi terjadi saat >1 halaman dari situsmu muncul untuk query yang SAMA: Google bingung mana yang paling relevan, CTR terpecah, dan keduanya peringkatnya lebih rendah daripada bila hanya satu yang 'dijagokan'. Di lab: query 'beli serum vitamin c' dilayani halaman produk (posisi 1, CTR 30%) DAN halaman kategori (posisi 4, CTR 5%) — halaman kategori mencuri 6.000 impresi yang seharusnya terkonsentrasi di halaman produk.",
        "Cara mendeteksinya (persis lab): kelompokkan data Search Console per query → cari query dengan >1 URL → bandingkan CTR-nya. Yang kalah (CTR lebih rendah) adalah kandidat untuk: (a) di-canonical-kan ke pemenang, (b) di-noindex bila duplikat, atau (c) ditulis ulang agar menargetkan query BERBEDA (misal kategori menargetkan 'jenis serum', bukan 'beli serum').",
        "Yang sering disalahpahami: kanibalisasi BUKAN soal 'halaman jelek' — halaman kategori Murni sebenarnya bagus, hanya saja ia menjawab intent yang salah untuk query transaksional. Solusinya bukan menghapus, melainkan MEMBAGI intent dengan jelas: satu query = satu juara.",
        "🚨 Mitos: 'Makin banyak halaman yang ranking untuk satu keyword makin bagus (mendominasi SERP).' Yang benar: mendominasi SERP hanya bagus bila halaman-halamannya menjawab INTENT BERBEDA (satu informasional, satu transaksional). Dua halaman dengan intent sama = kanibalisasi, bukan dominasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memperbaiki kanibalisasi dengan menghapus halaman yang kalah: halaman kategori itu punya backlink dan traffic dari query lain — menghapusnya membuang aset. Urutan yang benar: (1) cek query lain yang dilayani halaman itu, (2) canonical/redirect HANYA bila memang duplikat, (3) bila tidak, tulis ulang untuk intent berbeda. Hapus adalah opsi terakhir, bukan pertama.",
      },
      reference: "Satu query = satu juara; deteksi via group-by query, eksekusi via canonical/tulis-ulang.",
    },
    {
      id: "visual-ctr",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca kurva CTR: mengapa posisi 1 vs 6 adalah dunia berbeda",
      prose: [
        "Diagram menampilkan CTR per posisi dari data lab: posisi 1 = 30%, posisi 2 = 15%, posisi 3 = 12%, posisi 4–5 = 5%, posisi 6 = 3%. Kurvanya jatuh CURAM di 3 posisi pertama lalu mendatar — inilah hukum besi SEO.",
        "Implikasi praktisnya brutal: naik dari posisi 6 ke 3 melipatgandakan traffic 4× (3% → 12%) dengan impresi yang SAMA; tetapi naik dari posisi 3 ke 2 hanya menambah 25% relatif. Analis yang cerdas mengalokasikan effort ke halaman di posisi 4–10 yang 'hampir menang' (low-hanging fruit), bukan ke halaman posisi 50 yang butuh keajaiban.",
      ],
      figure: {
        svg: FIG_CTR_CURVE,
        alt: "Kurva CTR per posisi hasil pencarian dari data lab.",
        caption: "Cara membaca: sumbu X = posisi peringkat, sumbu Y = CTR; tiap titik = CTR agregat query di posisi itu dari data lab. Interpretasi: CTR jatuh 10× lipat dari posisi 1 (30%) ke posisi 6 (3%) — halaman di posisi 4–10 adalah kandidat terbaik untuk optimasi (naik 2–3 peringkat = traffic 2–4× lipat), sementara halaman di posisi 30+ butuh strategi berbeda (bukan sekadar 'optimasi judul'). Keputusan: prioritaskan query bervolume tinggi yang nangkring di posisi 4–10.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "CTR per posisi BUKAN konstanta universal — ia bergeser dengan jenis SERP: bila hasil pencarian penuh fitur (featured snippet, video, iklan), CTR organik posisi 1 bisa anjlok ke 15%. Jangan menghafal angka kurva ini sebagai kitab suci; hitung ulang dari data Search Console-mu sendiri tiap kuartal.",
      },
      reference: "Fokus effort di posisi 4–10 bervolume tinggi; CTR organik tergantung fitur SERP.",
    },
    {
      id: "lab-seo",
      eyebrow: "Langkah 6 · Lab",
      title: "Agregasi Search Console: CTR per posisi & deteksi kanibalisasi",
      prose: [
        "Data: 6 baris (query, page, posisi, impresi, klik) meniru ekspor Search Console. Tugasmu: (t1) agregasi CTR = klik/impresi per posisi; (t2) deteksi query yang dilayani >1 halaman (kanibalisasi); (t3) untuk tiap query kanibal, tentukan halaman yang KALAH (CTR lebih rendah) dan cetak ringkasannya. Hasil yang benar: CTR posisi 1 = 0,30; 2 query kanibal; halaman kalah = /blog/tips-kulit-kering dan /kategori/serum. Eksplorasi: apa yang terjadi pada CTR posisi 2 bila baris blog dihapus dari data? Mengapa agregasi per posisi sensitif terhadap komposisi query?",
      ],
      tasks: [
        { id: "t1", text: "Hitung CTR (klik/impresi) per posisi dari agregat" },
        { id: "t2", text: "Deteksi query dengan lebih dari 1 halaman (kanibalisasi)" },
        { id: "t3", text: "Tentukan halaman kalah per query kanibal (CTR terendah) lalu cetak" },
      ],
      expected: "ctr_pos1=0.30 kanibal=2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung CTR per posisi sebagai RATA-RATA CTR baris (mean of ratios): (0.30+0.15+...)/6 — salah, karena baris ber-impresi besar harus berbobot lebih. Yang benar: sum(klik)/sum(impresi) per posisi (ratio of sums). Di data ini bedanya kecil; di data nyata dengan 10 ribu baris, bedanya bisa membalik kesimpulan.",
      },
      hints: [
        "t1: butuh pandas — g = df.groupby('posisi')[['klik','impresi']].sum(); ctr = g['klik']/g['impresi'].",
        "t2: df.groupby('query')['page'].nunique() > 1.",
        "t3: untuk tiap query kanibal, hitung ctr per baris, ambil page dengan ctr terkecil.",
        "Cetak: f\"ctr_pos1={ctr_pos.loc[1]:.2f} kanibal={len(kanibal)}\".",
      ],
      code: {
        starter: "# DATA — JANGAN UBAH\ndata = [\n    {\"query\":\"skincare untuk kulit kering\",\"page\":\"/produk/pelembab\",\"posisi\":2,\"impresi\":12000,\"klik\":1800},\n    {\"query\":\"skincare untuk kulit kering\",\"page\":\"/blog/tips-kulit-kering\",\"posisi\":5,\"impresi\":8000,\"klik\":400},\n    {\"query\":\"cara menghilangkan jerawat\",\"page\":\"/blog/jerawat\",\"posisi\":3,\"impresi\":20000,\"klik\":2400},\n    {\"query\":\"beli serum vitamin c\",\"page\":\"/produk/serum-vitc\",\"posisi\":1,\"impresi\":5000,\"klik\":1500},\n    {\"query\":\"beli serum vitamin c\",\"page\":\"/kategori/serum\",\"posisi\":4,\"impresi\":6000,\"klik\":300},\n    {\"query\":\"harga sunscreen\",\"page\":\"/produk/sunscreen\",\"posisi\":6,\"impresi\":9000,\"klik\":270},\n]\n\n# TULIS KODEMU (pandas tersedia)\nimport pandas as pd\ndf = pd.DataFrame(data)\nctr_pos = \nctr_pos1 = \nkanibal = \nkalah = \n\nprint(f\"ctr_pos1={ctr_pos1:.2f} kanibal={len(kanibal)}\")\n",
        lockLines: 13,
        solution: "# DATA — JANGAN UBAH\ndata = [\n    {\"query\":\"skincare untuk kulit kering\",\"page\":\"/produk/pelembab\",\"posisi\":2,\"impresi\":12000,\"klik\":1800},\n    {\"query\":\"skincare untuk kulit kering\",\"page\":\"/blog/tips-kulit-kering\",\"posisi\":5,\"impresi\":8000,\"klik\":400},\n    {\"query\":\"cara menghilangkan jerawat\",\"page\":\"/blog/jerawat\",\"posisi\":3,\"impresi\":20000,\"klik\":2400},\n    {\"query\":\"beli serum vitamin c\",\"page\":\"/produk/serum-vitc\",\"posisi\":1,\"impresi\":5000,\"klik\":1500},\n    {\"query\":\"beli serum vitamin c\",\"page\":\"/kategori/serum\",\"posisi\":4,\"impresi\":6000,\"klik\":300},\n    {\"query\":\"harga sunscreen\",\"page\":\"/produk/sunscreen\",\"posisi\":6,\"impresi\":9000,\"klik\":270},\n]\n\n# TULIS KODEMU (pandas tersedia)\nimport pandas as pd\ndf = pd.DataFrame(data)\ng = df.groupby(\"posisi\")[[\"klik\", \"impresi\"]].sum()\nctr_pos = g[\"klik\"] / g[\"impresi\"]\nctr_pos1 = round(float(ctr_pos.loc[1]), 2)\nkanibal = sorted(df.groupby(\"query\")[\"page\"].nunique().pipe(lambda s: s[s > 1].index.tolist()))\nkalah = []\nfor q in kanibal:\n    sub = df[df[\"query\"] == q].copy()\n    sub[\"ctr\"] = sub[\"klik\"] / sub[\"impresi\"]\n    kalah.append(sub.sort_values(\"ctr\").iloc[0][\"page\"])\nkalah = sorted(kalah)\n\nprint(f\"ctr_pos1={ctr_pos1:.2f} kanibal={len(kanibal)}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "ctr_pos1", value: 0.30, tol: 0.01, label: "ctr posisi 1 = 0,30", msg: "1500/5000 = 0,30." },
          { kind: "equal", task: "t2", name: "kanibal", value: ["beli serum vitamin c", "skincare untuk kulit kering"], label: "2 query kanibal terdeteksi", msg: "Keduanya dilayani 2 halaman." },
          { kind: "equal", task: "t3", name: "kalah", value: ["/blog/tips-kulit-kering", "/kategori/serum"], label: "halaman kalah tepat", msg: "CTR terendah per query kanibal." },
          { kind: "stdout_matches", task: "t3", pattern: "kanibal=2", label: "print menampilkan kanibal=2", msg: "Format: kanibal=..." },
        ],
      },
      requires: ["pandas"],
      reference: "Agregat = ratio of sums; kanibal = group-by query; yang kalah = CTR terendah.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan SEO apa",
      prose: [
        "Skenario satu — impresi naik, klik datar: masalah CTR → optimasi title tag & meta description (bukan bikin konten baru). Ukur: CTR per query sebelum/sesudah.",
        "Skenario dua — klik naik, konversi datar: masalah intent → audit: query-nya informasional atau transaksional? Bila informasional, jangan paksa jualan — bangun jalur nurturing (email capture) alih-alih mengharap checkout.",
        "Skenario tiga — query dilayani >1 halaman: kanibalisasi → tentukan satu juara per query (canonical/tulis ulang), JANGAN hapus membabi buta.",
        "Skenario empat — traffic turun tiba-tiba: cek DULU: (a) musiman? (b) update algoritma? (c) masalah teknis (halaman ter-deindex)? — baru salahkan konten. 80% 'tragedi SEO' adalah salah satu dari tiga ini.",
        "Skenario lima — bos minta 'ranking #1 untuk 100 keyword bulan depan': tolak dengan kurva CTR — tunjukkan 10 query posisi 4–10 bervolume tinggi; naik 3 peringkat di sana > ranking #1 untuk 100 keyword tanpa volume.",
        "Aturan praktis 10 detik: (1) pisahkan branded/non-branded; (2) diagnosis per gerbang funnel; (3) effort ke posisi 4–10; (4) satu query = satu juara.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Melaporkan 'traffic organik naik' sebagai KPI tunggal ke direksi. Yang benar: laporkan TIGA angka — traffic non-branded, CTR rata-rata tertimbang, dan revenue organik. Satu angka = satu kebohongan yang nyaman.",
      },
      reference: "Diagnosis per gerbang; effort di posisi 4–10; laporkan 3 angka, bukan 1.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Murni setelah audit: dari 200% traffic ke revenue",
      prose: [
        "Pasca-audit, Murni merombak strategi: (1) 12 artikel informasional terbaik diberi CTA email capture (bukan dipaksa jualan) — menghasilkan 8.400 subscriber/bulan; (2) kanibalisasi 'beli serum vitamin c' diselesaikan: halaman kategori di-canonical ke halaman produk → CTR gabungan naik dari 19% ke 31%, revenue query itu +63%; (3) effort difokuskan ke 14 query posisi 4–10 bervolume tinggi — 9 di antaranya naik ke halaman 1 dalam 4 bulan. Hasil 6 bulan: traffic 'hanya' +40% dari baseline audit (bukan +200%), tetapi revenue organik +112%.",
        "Pertanyaan: (a) mengapa traffic tumbuh LEBIH LAMBAT tetapi revenue tumbuh LEBIH CEPAT? (b) apa risiko strategi barunya? Pembahasan: (a) Karena traffic yang dikejar sekarang adalah traffic BERNIAT BELI (non-branded transaksional) — konversinya 8× lipat traffic informasional; kualitas mengalahkan kuantitas. (b) Risiko: ketergantungan pada sedikit query juara — bila satu query juara turun peringkat (update algoritma), revenue terpukul; mitigasi: diversifikasi ke 30+ query transaksional dan jangan berhenti membangun topik baru.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Pelajaran Murni: SEO yang baik justru sering MENURUNKAN angka traffic mentah (konten informasional tak relevan dipangkas) sambil MENAIKKAN revenue. Analis yang berani melaporkan 'traffic turun 15%, revenue naik 40%' — dan bisa menjelaskannya — adalah analis yang dipercaya direksi.",
      },
      reference: "Kejar intent transaksional non-branded; diversifikasi query juara.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "Funnel organik: query (intent) → impresi (posisi) → klik (CTR) → konversi (revenue); diagnosis di gerbang yang tepat.",
        "CTR = klik/impresi; ekspektasi traffic = impresi × CTR posisi; kurva CTR jatuh curam — effort terbaik di posisi 4–10 bervolume tinggi.",
        "Pisahkan branded vs non-branded di semua laporan; prestasi SEO = arena non-branded.",
        "Kanibalisasi: >1 halaman untuk 1 query → tentukan satu juara (canonical/tulis ulang), jangan hapus membabi buta.",
        "Agregat CTR = sum(klik)/sum(impresi) per posisi (bukan rata-rata CTR baris).",
      ],
      quiz: [
        {
          q: "Impresi naik 50% tetapi klik datar. Diagnosis pertama yang benar?",
          options: [
            { text: "Masalah CTR — optimasi title tag & meta description", why: "Benar: gerbang impresi→klik yang macet = snippet tidak menarik.", correct: true },
            { text: "Buat 20 artikel baru", why: "Impresi sudah naik — konten bukan masalahnya." },
            { text: "Beli backlink sebanyak-banyaknya", why: "Backlink menaikkan posisi/impresi, bukan CTR." },
            { text: "Ganti CMS website", why: "Tidak ada kaitannya dengan gerbang yang macet." },
          ],
        },
        {
          q: "Agensi melaporkan 'CTR organik 25%'. Mengapa analis harus curiga?",
          options: [
            { text: "Angka itu bisa didominasi query branded yang CTR-nya memang tinggi", why: "Benar: tanpa pemisahan branded/non-branded, angka agregat menyesatkan.", correct: true },
            { text: "CTR 25% mustahil secara matematis", why: "Mungkin saja untuk query branded; masalahnya bukan kemustahilan." },
            { text: "CTR bukan metrik SEO", why: "CTR adalah metrik inti gerbang impresi→klik." },
            { text: "Agensi selalu berbohong", why: "Sinis tanpa dasar; yang benar: minta datanya dipisah." },
          ],
        },
        {
          q: "Query 'beli serum vitamin c' dilayani halaman produk (CTR 30%) dan halaman kategori (CTR 5%). Tindakan yang benar?",
          options: [
            { text: "Tentukan satu juara — canonical kategori ke produk atau tulis ulang kategori untuk intent berbeda", why: "Benar: satu query = satu juara; eksekusi bertahap, bukan hapus.", correct: true },
            { text: "Hapus halaman kategori segera", why: "Halaman kategori punya backlink & traffic query lain — hapus = buang aset." },
            { text: "Biarkan saja, dua-duanya ranking kan bagus", why: "Itu kanibalisasi: keduanya peringkatnya tertekan dan CTR terpecah." },
            { text: "Duplikat konten produk ke halaman kategori", why: "Memperparah duplikasi — kebalikan dari solusi." },
          ],
        },
        {
          q: "Menghitung CTR per posisi sebagai rata-rata CTR tiap baris (mean of ratios). Apa masalahnya?",
          options: [
            { text: "Baris ber-impresi besar harusnya berbobot lebih — yang benar sum(klik)/sum(impresi)", why: "Benar: ratio of sums, bukan mean of ratios.", correct: true },
            { text: "Tidak ada masalah, hasilnya identik", why: "Hanya identik bila semua baris impresinya sama — praktis tidak pernah." },
            { text: "Rata-rata selalu lebih besar", why: "Arah biasnya tidak pasti — itulah masalahnya." },
            { text: "CTR tidak boleh dihitung per posisi", why: "Justru itu agregat standar analisis Search Console." },
          ],
        },
        {
          q: "Halamanmu di posisi 8 untuk query bervolume 50 ribu/bulan. Strategi paling efisien?",
          options: [
            { text: "Optimasi halaman itu (judul, konten, internal link) — naik ke posisi 4-5 melipatgandakan traffic", why: "Benar: posisi 4–10 bervolume tinggi = low-hanging fruit kurva CTR.", correct: true },
            { text: "Buat 10 artikel baru untuk keyword lain", why: "Mengabaikan aset yang hampir menang demi lotre keyword baru." },
            { text: "Fokus ke keyword posisi 50+", why: "Butuh keajaiban; ROI effort jauh lebih kecil." },
            { text: "Beli iklan untuk keyword itu saja", why: "Iklan tidak memperbaiki peringkat organik; itu dua saluran berbeda." },
          ],
        },
      ],
      next: { label: "MK28 — MMP & Atribusi Mobile Pasca-ATT", href: "/v2/learn/mk28-mmp-mobile-attribution" },
    },
  ],
};
