import type { V2Lesson } from "../lib/types";

const FIG_HEAT = `<svg viewBox="0 0 600 360" role="img" aria-label="Heatmap korelasi 6 kandidat: satu blok merah klaster reversal, sisanya hijau.">
<g font-family="var(--font-ui)">
<text x="20" y="28" font-size="14" fill="var(--chart-text)" font-weight="bold">Korelasi antar-kandidat: 6 baris, 2 klaster</text>
<g font-size="11" fill="var(--chart-text)" text-anchor="end">
<text x="118" y="80">rev-a</text>
<text x="118" y="112">rev-b</text>
<text x="118" y="144">rev-c</text>
<text x="118" y="176">rev-d</text>
<text x="118" y="208">vol-a</text>
<text x="118" y="240">fnd-a</text>
</g>
<g font-size="11" fill="var(--chart-text)" text-anchor="middle">
<text x="152" y="56">rev-a</text>
<text x="200" y="56">rev-b</text>
<text x="248" y="56">rev-c</text>
<text x="296" y="56">rev-d</text>
<text x="344" y="56">vol-a</text>
<text x="392" y="56">fnd-a</text>
</g>
<g font-size="11" text-anchor="middle">
<rect x="128" y="64" width="48" height="28" fill="#1a7f4e"/><text x="152" y="82" fill="#fff">1,00</text>
<rect x="176" y="64" width="48" height="28" fill="#e5484d"/><text x="200" y="82" fill="#fff">0,91</text>
<rect x="224" y="64" width="48" height="28" fill="#e5484d"/><text x="248" y="82" fill="#fff">0,87</text>
<rect x="272" y="64" width="48" height="28" fill="#e5484d"/><text x="296" y="82" fill="#fff">0,83</text>
<rect x="320" y="64" width="48" height="28" fill="#1a7f4e"/><text x="344" y="82" fill="#fff">0,18</text>
<rect x="368" y="64" width="48" height="28" fill="#1a7f4e"/><text x="392" y="82" fill="#fff">0,09</text>
<rect x="128" y="96" width="48" height="28" fill="#e5484d"/><text x="152" y="114" fill="#fff">0,91</text>
<rect x="176" y="96" width="48" height="28" fill="#1a7f4e"/><text x="200" y="114" fill="#fff">1,00</text>
<rect x="224" y="96" width="48" height="28" fill="#e5484d"/><text x="248" y="114" fill="#fff">0,89</text>
<rect x="272" y="96" width="48" height="28" fill="#e5484d"/><text x="296" y="114" fill="#fff">0,85</text>
<rect x="320" y="96" width="48" height="28" fill="#1a7f4e"/><text x="344" y="114" fill="#fff">0,22</text>
<rect x="368" y="96" width="48" height="28" fill="#1a7f4e"/><text x="392" y="114" fill="#fff">0,14</text>
<rect x="128" y="128" width="48" height="28" fill="#e5484d"/><text x="152" y="146" fill="#fff">0,87</text>
<rect x="176" y="128" width="48" height="28" fill="#e5484d"/><text x="200" y="146" fill="#fff">0,89</text>
<rect x="224" y="128" width="48" height="28" fill="#1a7f4e"/><text x="248" y="146" fill="#fff">1,00</text>
<rect x="272" y="128" width="48" height="28" fill="#e5484d"/><text x="296" y="146" fill="#fff">0,90</text>
<rect x="320" y="128" width="48" height="28" fill="#1a7f4e"/><text x="344" y="146" fill="#fff">0,11</text>
<rect x="368" y="128" width="48" height="28" fill="#1a7f4e"/><text x="392" y="146" fill="#fff">0,16</text>
<rect x="128" y="160" width="48" height="28" fill="#e5484d"/><text x="152" y="178" fill="#fff">0,83</text>
<rect x="176" y="160" width="48" height="28" fill="#e5484d"/><text x="200" y="178" fill="#fff">0,85</text>
<rect x="224" y="160" width="48" height="28" fill="#e5484d"/><text x="248" y="178" fill="#fff">0,90</text>
<rect x="272" y="160" width="48" height="28" fill="#1a7f4e"/><text x="296" y="178" fill="#fff">1,00</text>
<rect x="320" y="160" width="48" height="28" fill="#1a7f4e"/><text x="344" y="178" fill="#fff">0,25</text>
<rect x="368" y="160" width="48" height="28" fill="#1a7f4e"/><text x="392" y="178" fill="#fff">0,07</text>
<rect x="128" y="192" width="48" height="28" fill="#1a7f4e"/><text x="152" y="210" fill="#fff">0,18</text>
<rect x="176" y="192" width="48" height="28" fill="#1a7f4e"/><text x="200" y="210" fill="#fff">0,22</text>
<rect x="224" y="192" width="48" height="28" fill="#1a7f4e"/><text x="248" y="210" fill="#fff">0,11</text>
<rect x="272" y="192" width="48" height="28" fill="#1a7f4e"/><text x="296" y="210" fill="#fff">0,25</text>
<rect x="320" y="192" width="48" height="28" fill="#1a7f4e"/><text x="344" y="210" fill="#fff">1,00</text>
<rect x="368" y="192" width="48" height="28" fill="#1a7f4e"/><text x="392" y="210" fill="#fff">0,19</text>
<rect x="128" y="224" width="48" height="28" fill="#1a7f4e"/><text x="152" y="242" fill="#fff">0,09</text>
<rect x="176" y="224" width="48" height="28" fill="#1a7f4e"/><text x="200" y="242" fill="#fff">0,14</text>
<rect x="224" y="224" width="48" height="28" fill="#1a7f4e"/><text x="248" y="242" fill="#fff">0,16</text>
<rect x="272" y="224" width="48" height="28" fill="#1a7f4e"/><text x="296" y="242" fill="#fff">0,07</text>
<rect x="320" y="224" width="48" height="28" fill="#1a7f4e"/><text x="344" y="242" fill="#fff">0,19</text>
<rect x="368" y="224" width="48" height="28" fill="#1a7f4e"/><text x="392" y="242" fill="#fff">1,00</text>
</g>
<text x="440" y="110" font-size="12" fill="#e5484d">blok merah 4&times;4:</text>
<text x="440" y="128" font-size="12" fill="#e5484d">klaster reversal</text>
<text x="440" y="146" font-size="11" fill="var(--chart-text)">0,83&ndash;0,91 = satu taruhan</text>
<text x="440" y="180" font-size="12" fill="#1a7f4e">vol-a &amp; fnd-a hijau</text>
<text x="440" y="198" font-size="11" fill="var(--chart-text)">terhadap semua: 0,07&ndash;0,25</text>
<text x="440" y="216" font-size="11" fill="var(--chart-text)">= taruhan yang berbeda</text>
<text x="20" y="290" font-size="12" fill="var(--chart-text)">Cara membaca: merah = korelasi tinggi (kembar), hijau = rendah (asing).</text>
<text x="20" y="308" font-size="12" fill="var(--chart-text)">Interpretasi: 4 varian reversal = 1 taruhan; vol-a + fnd-a = 2 taruhan baru.</text>
<text x="20" y="330" font-size="11" fill="var(--chart-text)">Enam baris &rarr; tiga slot submit: 1 reversal terbaik + vol-a + fnd-a.</text>
</g>
</svg>`;

export const wqb15: V2Lesson = {
  slug: "wqb15-korelasi-klaster",
  track: "WorldQuant Brain",
  module: "Praktik & Diagnosis",
  title: "WQB15 — Korelasi Antar-Alpha: Berpikir Klaster, Bukan Baris",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua puluh baris, satu taruhan",
      prose: [
        "Tim itu bangga dengan spreadsheet-nya: 20 varian slow-reversal, semuanya Sharpe > 1,4, semuanya lolos enam IS checks pertama. 'Kita punya 20 kandidat submit,' kata koordinatornya. Mereka memasukkan semuanya ke antrean self-correlation check — dan 19 di antaranya gugur. Korelasi antar-varian: 0,83–0,95. Dua puluh baris spreadsheet ternyata satu taruhan yang ditulis dua puluh kali dengan kata yang sedikit berbeda.",
        "Di sudut spreadsheet yang sama ada satu baris yang hampir terhapus: varian volatilitas dengan Sharpe 'hanya' 1,31 — tidak masuk 10 besar tim. Korelasinya terhadap semua varian reversal: 0,11–0,25. Ia lolos self-corr dalam sekali jalan. Akhir kuartal: dari 20+1 kandidat, yang disubmit = 1 reversal terbaik + 1 volatilitas. Yang 'terbaik' kedua puluh varian itu 19 di antaranya tidak pernah keluar dari spreadsheet.",
        "Twist-nya: tim mengira mereka mendiversifikasi karena punya BANYAK. Diversifikasi bukan soal jumlah baris — soal jumlah taruhan independen. Dua puluh kembar = satu taruhan; dua orang asing = dua taruhan. Spreadsheet 20 baris mereka bukan portofolio — ia satu foto yang dicetak 20 kali.",
        "Konteks singkat. Korelasi antar-alpha = korelasi return antara kandidat-kandidatmu (bukan vs yang sudah disubmit — itu WQB13; ini vs sesama kandidat). Klaster/family = kelompok alpha berlogika sejenis: reversal, momentum, volatilitas, volume, gap, fundamental. Family ortogonal = family yang logikanya tidak berhubungan (reversal vs volatilitas), sehingga korelasinya rendah secara struktural. Prasyarat: kamu bisa menghitung korelasi Pearson dan memahami ambang self-corr 0,7 — di sini ambang yang sama dipakai untuk memetakan kekerabatan. Setelah lesson ini kamu bisa: (1) membaca matriks korelasi dan mengidentifikasi klaster; (2) menghitung 'taruhan efektif' dari sekumpulan kandidat; (3) memutuskan kapan menambah varian vs membuka family baru; (4) merancang portofolio submit yang terdiversifikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Kasus 20 varian slow-reversal di atas adalah kasus nyata yang dianonimkan. Polanya berulang di setiap tim: varian termudah dibuat (tweak parameter family yang sama) = varian paling berkorelasi = varian paling tidak berguna untuk submit. Kemudahan membuat berbanding terbalik dengan nilai submit.",
      },
      reference: "Banyak baris ≠ banyak taruhan. Satu family = satu taruhan.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Matriks korelasi: peta kekerabatan",
      prose: [
        "Matriks korelasi = tabel N×N berisi korelasi tiap pasangan kandidat. Diagonal selalu 1,00 (korelasi dengan diri sendiri); matriks simetris. Yang dibaca: blok-blok berwarna. Blok merah 4×4 (korelasi 0,83–0,91) = empat kandidat yang saling kembar = satu klaster = satu taruhan. Sel hijau (0,07–0,25) = pasangan asing = taruhan berbeda.",
        "Konsep 'taruhan efektif': jumlah taruhan independen ≈ jumlah klaster, BUKAN jumlah kandidat. Empat varian reversal berkorelasi 0,87 rata-rata = 1 taruhan efektif. Tambah vol-a (korelasi 0,18 terhadap klaster) = 2 taruhan efektif. Tambah fnd-a (0,12) = 3. Rumus kasarnya: tiap kandidat baru menambah '1 taruhan' hanya jika korelasi maksimumnya terhadap semua yang sudah ada < 0,5; jika 0,5–0,7 menambah 'setengah taruhan'; jika > 0,7 menambah nol — ia kembar.",
        "Kenapa satu family = satu taruhan? Karena varian satu family berbagi logika inti yang sama — mereka untung dan rugi pada kondisi pasar yang sama. Saat reversal gagal (mis. pasar trending kuat searah berhari-hari), SEMUA varian reversal gagal bersamaan — tidak peduli delay-nya 1 atau 3, decay-nya linear atau eksponensial. Korelasi 0,9 = mereka tenggelam di kapal yang sama. Diversifikasi sejati = kapal yang berbeda: volatilitas untung saat pasar panik (ketika reversal babak belur), fundamental bergerak pada frekuensi laporan kuartalan (ketika sinyal teknikal noise).",
        "Contoh angka dari figur: klaster reversal (rev-a…rev-d) korelasi internal 0,83–0,91 → 1 taruhan. vol-a vs klaster: 0,11–0,25 → taruhan ke-2. fnd-a vs semuanya: 0,07–0,19 → taruhan ke-3. Enam kandidat, tiga taruhan efektif — dan tiga slot submit diisi persis oleh tiga taruhan itu: rev terbaik + vol-a + fnd-a.",
      ],
      formula: String.raw`\text{taruhan efektif} \approx \sum_{i} \begin{cases} 1 & \max_j \rho_{ij} < 0{,}5 \\ 0{,}5 & 0{,}5 \le \max_j \rho_{ij} < 0{,}7 \\ 0 & \max_j \rho_{ij} \ge 0{,}7 \end{cases}`,
      formulaNote: "ρ_ij = korelasi kandidat baru i terhadap kandidat lama j (yang sudah dipilih). Kandidat yang asing (< 0,5) terhadap semua = 1 taruhan penuh; yang mirip (≥ 0,7) = 0 (kembar, tidak menambah diversifikasi). Contoh: 4 reversal (saling 0,87) = 1; + vol-a (maks 0,25) = 2; + fnd-a (maks 0,19) = 3.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kami sudah diversifikasi — ada 20 kandidat.” Jumlah kandidat tanpa matriks korelasi = klaim tanpa bukti. Minta siapa pun yang berkata 'terdiversifikasi' menunjukkan matriksnya; bila blok merah mendominasi, itu konsentrasi yang menyamar sebagai diversifikasi.",
      },
      hints: [
        "Baca matriks per BLOK, bukan per sel: blok merah = klaster = satu taruhan.",
        "Taruhan efektif ≈ jumlah klaster, bukan jumlah baris.",
      ],
      reference: "Satu family = satu kapal. Diversifikasi = kapal berbeda, bukan kursi berbeda di kapal sama.",
    },
    {
      id: "figur",
      eyebrow: "Langkah 3 · Figur",
      title: "Heatmap: melihat klaster dalam sekejap",
      prose: [
        "Cara membaca figur: tiap sel = korelasi sepasang kandidat; merah = tinggi (kembar), hijau = rendah (asing); diagonal hijau tua 1,00 = diri sendiri. Interpretasi: blok merah 4×4 di kiri atas langsung terlihat — rev-a sampai rev-d saling berkorelasi 0,83–0,91. Itulah klaster reversal: satu blok, satu taruhan. Baris/kolom vol-a dan fnd-a seluruhnya hijau (0,07–0,25) — dua kandidat ini asing terhadap semua orang, termasuk satu sama lain (0,19).",
        "Latihan mata: dalam 3 detik, berapa taruhan efektif? Jawab: 3 — satu blok merah + dua baris hijau mandiri. Inilah kekuatan heatmap: ia mengubah 36 angka menjadi 1 gambar yang bisa dibaca lebih cepat dari spreadsheet. Di meja riset, heatmap ini ditempel di dinding — setiap kandidat baru harus 'mencari tempatnya' di peta: menempel di blok merah yang ada (kembar — tolak) atau membuka wilayah hijau baru (diterima).",
        "Perhatikan juga yang TIDAK ada: tidak ada blok merah parsial (mis. hanya rev-a & rev-b). Klaster di dunia nyata biasanya utuh seperti ini — karena varian satu family memang berbagi logika inti. Kalau kamu melihat blok merah, jangan tanya 'varian mana yang dibuang' — tanya 'satu perwakilan terbaiknya siapa', karena hanya satu yang bisa lolos self-corr nanti.",
      ],
      figure: {
        svg: FIG_HEAT,
        alt: "Heatmap 6×6: blok merah klaster reversal 4×4, vol-a dan fnd-a hijau terhadap semua.",
        caption: "Blok merah = satu klaster = satu taruhan. Enam kandidat → tiga taruhan efektif.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Heatmap adalah tes kejujuran portofolio. Tim yang 'merasa' terdiversifikasi tapi heatmap-nya merah semua sedang berhalusinasi — dan halusinasi diversifikasi lebih berbahaya daripada konsentrasi yang disadari, karena yang disadari masih bisa di-hedge.",
      },
      reference: "Tempel heatmap di dinding. Kandidat baru: cari bloknya — merah menempel = tolak.",
    },
    {
      id: "lab-klaster",
      eyebrow: "Langkah 4 · Lab",
      title: "Deteksi klaster dari matriks korelasi",
      prose: [
        "Bangun sendiri logika pembaca heatmap. Diberikan matriks korelasi 6×6 (mensimulasikan figur: 4 reversal + 1 volatilitas + 1 fundamental), tugasmu: untuk tiap kandidat, hitung korelasi maksimum terhadap kandidat LAIN, lalu kelompokkan — kandidat dengan korelasi ≥ 0,7 terhadap 'wakil' klaster = anggota klaster itu; yang < 0,5 terhadap semua = klaster mandiri.",
        "Sederhanakan dengan aturan serakah (greedy): urut kandidat; kandidat pertama membuka klaster 1; kandidat berikutnya masuk klaster yang wakilnya berkorelasi ≥ 0,7 dengannya, atau membuka klaster baru bila tidak ada. Cetak anggota tiap klaster + taruhan efektif. Setelah selesai, coba ubah ambang menjadi 0,8 dan lihat apa yang berubah — klaster bisa pecah, dan itulah kenapa ambang harus konsisten dengan ambang submit (0,7).",
      ],
      tasks: [
        { id: "t1", text: "Kelompokkan 6 kandidat menjadi klaster (ambang 0,7)" },
        { id: "t2", text: "Jalankan: pastikan klaster + taruhan efektif tercetak" },
      ],
      expected: "Klaster 1: ['rev-a', 'rev-b', 'rev-c', 'rev-d']\nKlaster 2: ['vol-a']\nKlaster 3: ['fnd-a']\nTaruhan efektif: 3 dari 6 kandidat",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“rev-d korelasi 0,83 dengan rev-a tapi 0,65 dengan vol-a — jadi ia jembatan dua klaster?” Tidak ada 'jembatan': aturan keanggotaan memakai korelasi terhadap WAKIL klaster (yang pertama). 0,83 ≥ 0,7 → ia anggota klaster reversal, titik. Korelasi 0,65 dengan vol-a tidak memindahkannya — ia hanya menjelaskan kenapa vol-a 'terasa dekat' tapi tetap taruhan berbeda.",
      },
      hints: [
        "wakil klaster = anggota pertama klaster itu.",
        "Untuk kandidat baru: cari klaster dengan corr(wakil) >= 0.7; bila tidak ada → klaster baru.",
      ],
      code: {
        starter: "# Matriks korelasi 6 kandidat (JANGAN UBAH). Urutan: rev-a, rev-b, rev-c, rev-d, vol-a, fnd-a.\nnama = [\"rev-a\", \"rev-b\", \"rev-c\", \"rev-d\", \"vol-a\", \"fnd-a\"]\nC = [[1.00, 0.91, 0.87, 0.83, 0.18, 0.09],\n     [0.91, 1.00, 0.89, 0.85, 0.22, 0.14],\n     [0.87, 0.89, 1.00, 0.90, 0.11, 0.16],\n     [0.83, 0.85, 0.90, 1.00, 0.25, 0.07],\n     [0.18, 0.22, 0.11, 0.25, 1.00, 0.19],\n     [0.09, 0.14, 0.16, 0.07, 0.19, 1.00]]\n\n# TULIS KODEMU: greedy clustering, ambang 0.7\nklaster = []  # list of list nama\n\nfor j, k in enumerate(klaster, 1):\n    print(f\"Klaster {j}: {k}\")\nprint(f\"Taruhan efektif: {len(klaster)} dari {len(nama)} kandidat\")\n",
        lockLines: 11,
        solution: "# Matriks korelasi 6 kandidat (JANGAN UBAH). Urutan: rev-a, rev-b, rev-c, rev-d, vol-a, fnd-a.\nnama = [\"rev-a\", \"rev-b\", \"rev-c\", \"rev-d\", \"vol-a\", \"fnd-a\"]\nC = [[1.00, 0.91, 0.87, 0.83, 0.18, 0.09],\n     [0.91, 1.00, 0.89, 0.85, 0.22, 0.14],\n     [0.87, 0.89, 1.00, 0.90, 0.11, 0.16],\n     [0.83, 0.85, 0.90, 1.00, 0.25, 0.07],\n     [0.18, 0.22, 0.11, 0.25, 1.00, 0.19],\n     [0.09, 0.14, 0.16, 0.07, 0.19, 1.00]]\n\n# TULIS KODEMU: greedy clustering, ambang 0.7\nklaster = []  # list of list nama\nfor i, nm in enumerate(nama):\n    masuk = False\n    for k in klaster:\n        wakil = nama.index(k[0])\n        if C[i][wakil] >= 0.7:\n            k.append(nm); masuk = True; break\n    if not masuk:\n        klaster.append([nm])\n\nfor j, k in enumerate(klaster, 1):\n    print(f\"Klaster {j}: {k}\")\nprint(f\"Taruhan efektif: {len(klaster)} dari {len(nama)} kandidat\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Klaster 1 = 4 reversal", msg: "Blok merah terdeteksi.", pattern: "Klaster 1: \\['rev-a', 'rev-b', 'rev-c', 'rev-d'\\]" },
          { kind: "stdout_matches", task: "t2", label: "3 klaster total", msg: "vol-a dan fnd-a mandiri.", pattern: "Klaster 3: \\['fnd-a'\\]" },
          { kind: "stdout_matches", task: "t2", label: "Taruhan efektif 3/6", msg: "Enam baris = tiga taruhan.", pattern: "Taruhan efektif: 3 dari 6 kandidat" }
        ],
      },
      reference: "Greedy clustering ambang 0,7: 6 kandidat → 3 klaster → 3 taruhan efektif.",
    },
    {
      id: "lab-pilih",
      eyebrow: "Langkah 5 · Lab",
      title: "Pilih portofolio submit: maksimal 3 slot",
      prose: [
        "Kamu punya 3 slot submit dan 6 kandidat (dengan Sharpe masing-masing). Aturan: tiap klaster hanya boleh diwakili SATU kandidat (yang lain pasti gugur di self-corr), dan yang dipilih = Sharpe tertinggi di klasternya. Tugasmu: gabungkan info klaster dari lab sebelumnya dengan Sharpe, pilih 3 pemenang.",
        "Data Sharpe: rev-a 1,62; rev-b 1,71; rev-c 1,55; rev-d 1,68; vol-a 1,31; fnd-a 1,44. Perhatikan jebakannya: rev-b Sharpe tertinggi keseluruhan (1,71) — tapi ia 'hanya' mewakili klaster reversal. vol-a Sharpe terendah (1,31) — tapi ia satu-satunya wakil klaster volatilitas dan TETAP dipilih. Pelajaran: seleksi submit memilih perwakilan klaster, bukan ranking Sharpe global.",
      ],
      tasks: [
        { id: "t1", text: "Pilih 1 kandidat per klaster (Sharpe tertinggi)" },
        { id: "t2", text: "Jalankan: pastikan 3 pilihan tercetak" },
      ],
      expected: "Slot 1 (klaster ['rev-a', 'rev-b', 'rev-c', 'rev-d']): rev-b (Sharpe 1.71)\nSlot 2 (klaster ['vol-a']): vol-a (Sharpe 1.31)\nSlot 3 (klaster ['fnd-a']): fnd-a (Sharpe 1.44)",
      note: {
        title: "Intuisi",
        body: "vol-a (Sharpe 1,31) mengalahkan rev-d (1,68) untuk slot submit — bukan karena lebih bagus, melainkan karena lebih BERBEDA. Inilah seleksi klaster: kamu tidak memilih 3 kandidat terbaik, kamu memilih 3 TARUHAN terbaik. Ranking Sharpe global adalah cara yang salah untuk mengisi slot terbatas.",
      },
      hints: [
        "Gunakan hasil klaster lab sebelumnya (tulis ulang daftarnya).",
        "max(klaster, key=lambda nm: sharpe[nm]).",
      ],
      code: {
        starter: "# Klaster (dari lab sebelumnya) + Sharpe tiap kandidat (JANGAN UBAH).\nklaster = [[\"rev-a\", \"rev-b\", \"rev-c\", \"rev-d\"], [\"vol-a\"], [\"fnd-a\"]]\nsharpe = {\"rev-a\": 1.62, \"rev-b\": 1.71, \"rev-c\": 1.55,\n          \"rev-d\": 1.68, \"vol-a\": 1.31, \"fnd-a\": 1.44}\n\n# TULIS KODEMU: satu wakil per klaster = Sharpe tertinggi\nfor j, k in enumerate(klaster, 1):\n    wakil = \n    print(f\"Slot {j} (klaster {k}): {wakil} (Sharpe {sharpe[wakil]:.2f})\")\n",
        lockLines: 4,
        solution: "# Klaster (dari lab sebelumnya) + Sharpe tiap kandidat (JANGAN UBAH).\nklaster = [[\"rev-a\", \"rev-b\", \"rev-c\", \"rev-d\"], [\"vol-a\"], [\"fnd-a\"]]\nsharpe = {\"rev-a\": 1.62, \"rev-b\": 1.71, \"rev-c\": 1.55,\n          \"rev-d\": 1.68, \"vol-a\": 1.31, \"fnd-a\": 1.44}\n\n# TULIS KODEMU: satu wakil per klaster = Sharpe tertinggi\nfor j, k in enumerate(klaster, 1):\n    wakil = max(k, key=lambda nm: sharpe[nm])\n    print(f\"Slot {j} (klaster {k}): {wakil} (Sharpe {sharpe[wakil]:.2f})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Slot 1 = rev-b 1,71", msg: "Sharpe tertinggi klaster reversal.", pattern: "Slot 1 \\(klaster \\['rev-a', 'rev-b', 'rev-c', 'rev-d'\\]\\): rev-b \\(Sharpe 1\\.71\\)" },
          { kind: "stdout_matches", task: "t2", label: "Slot 2 = vol-a 1,31", msg: "Wakil tunggal klaster volatilitas.", pattern: "Slot 2 \\(klaster \\['vol-a'\\]\\): vol-a \\(Sharpe 1\\.31\\)" },
          { kind: "stdout_matches", task: "t2", label: "Slot 3 = fnd-a 1,44", msg: "Wakil tunggal klaster fundamental.", pattern: "Slot 3 \\(klaster \\['fnd-a'\\]\\): fnd-a \\(Sharpe 1\\.44\\)" }
        ],
      },
      reference: "Isi slot per klaster, bukan per ranking Sharpe. vol-a 1,31 > rev-d 1,68 untuk slot.",
    },
    {
      id: "varian-vs-family",
      eyebrow: "Langkah 6 · Praktik",
      title: "Kapan menambah varian, kapan membuka family baru",
      prose: [
        "Pertanyaan alokasi waktu paling penting di busur ini. Tambah varian (tweak dalam family yang sama) bila: klaster masih kecil (< 4 anggota), korelasi antar-varian masih < 0,7 (masih ada ruang diferensiasi), dan family belum menyentuh plafon (slope 15 terakhir ≥ 0,002). Varian baru di kondisi ini murah (pola pikir sudah ada) dan berpotensi menambah setengah taruhan.",
        "Buka family baru bila: klaster sudah jenuh (4+ varian saling ≥ 0,7), plafon tercapai (WQB14), atau semua kandidatmu hidup di 1–2 family (konsentrasi taruhan). Family ortogonal yang terbukti: volatilitas (sinyal dari pergerakan besaran, bukan arah — hidup saat pasar panik), volume (partisipasi & likuiditas — frekuensi berbeda dari harga), gap ( overnight vs intraday — sumber return berbeda), fundamental (laporan keuangan — frekuensi kuartalan, logika ekonomi berbeda). Masing-masing hampir dijamin berkorelasi rendah dengan family teknikal-mu — diversifikasi struktural, bukan kebetulan.",
        "Dua tips. Pertama, alokasikan waktu riset per klaster, bukan per kandidat: mis. 60% waktu untuk family baru (eksplorasi), 40% untuk merawat klaster existing (satu wakil terbaik per klaster). Kedua, rayakan 'kandidat jelek yang unik': Sharpe 1,31 dari family baru sering lebih berharga dari Sharpe 1,7 varian ke-21 family lama — karena yang pertama menambah taruhan, yang kedua menambah baris.",
        "Miskonsepsi kedua: 'korelasi rendah sekali = selamanya rendah.' Korelasi antar-family bisa naik saat regime berubah (krisis 2020 membuat hampir semua sinyal teknikal berkorelasi). Karena itu heatmap bukan dokumen sekali buat — ia dihitung ulang tiap kuartal, dan taruhan efektif dipantau seperti metrik risiko.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Family baru terlalu sulit — saya perdalam saja reversal yang sudah dikuasai.” Kenyamanan adalah musuh diversifikasi. Family yang dikuasai = family yang plafonnya sudah kamu sentuh = tempat return waktu terendah. Ketidaknyamanan family baru adalah harga satu taruhan tambahan.",
      },
      hints: [
        "Varian baru: klaster < 4 anggota, korelasi < 0,7, belum plafon.",
        "Family baru: klaster jenuh, plafon tercapai, atau konsentrasi 1–2 family.",
      ],
      reference: "Alokasi per klaster: 60% eksplorasi family baru, 40% rawat wakil terbaik.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta alokasi riset",
      prose: [
        "Satu: kandidat baru korelasi < 0,5 terhadap semua klaster → TERIMA sebagai taruhan baru; alokasikan slot submit. Dua: korelasi 0,5–0,7 dengan satu klaster → TERIMA BERSYARAT: boleh dikembangkan, tapi targetnya harus menembus < 0,5 (diferensiasi aktif) atau ia hanya setengah taruhan. Tiga: korelasi ≥ 0,7 → TOLAK sebagai kandidat independen; pilihannya: buang, atau jadikan 'cadangan klaster' (arsip bila wakil utama pensiun). Empat: satu klaster berisi > 50% seluruh kandidatmu → DARURAT DIVERSIFIKASI: bekukan varian baru di klaster itu, alihkan 100% waktu ke family ortogonal sampai tidak ada klaster > 40%.",
        "Lima: family baru menghasilkan kandidat pertama dengan Sharpe ≥ 1,25 dan korelasi < 0,5 → GANDAKAN TARUHAN: alokasikan 2 slot eksplorasi tambahan ke family itu kuartal ini — family yang terbukti ortogonal DAN produktif adalah temuan langka, eksploitasi selagi panas.",
        "Aturan praktis 10 detik: 'kandidat baru ini menambah taruhan ke-berapa?' — kalau jawabannya bukan nomor baru, ia tidak menambah apa-apa.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Peta ini mengubah pertanyaan 'apakah kandidat ini bagus?' menjadi 'apakah portofoliku lebih baik DENGAN kandidat ini?' — dan 'lebih baik' diukur dari taruhan efektif, bukan dari Sharpe. Portofolio 3 taruhan @1,4 mengalahkan 20 baris @1,7 yang satu taruhan.",
      },
      reference: "Korelasi < 0,5 = taruhan baru; ≥ 0,7 = tolak; klaster > 50% = darurat diversifikasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Lima kandidat, tiga slot",
      prose: [
        "Data: 5 kandidat lolos semua IS checks individual. Sharpe: m1 1,83; m2 1,77; m3 1,69; m4 1,52; m5 1,38. Matriks korelasi: m1–m2 0,91; m1–m3 0,86; m2–m3 0,88 (klaster momentum); m4 vs semua momentum 0,21–0,33; m5 vs semua momentum 0,14–0,27; m4–m5 0,31. Slot submit tersedia: 3. Tugas: pilih 3.",
        "Pembahasan: klasterisasi ambang 0,7 → Klaster 1: {m1, m2, m3} (momentum, saling ≥ 0,86); Klaster 2: {m4} (volume); Klaster 3: {m5} (gap). Taruhan efektif = 3 = tepat 3 slot. Wakil tiap klaster = Sharpe tertinggi: m1 (1,83), m4 (1,52), m5 (1,38). Keputusan: submit m1 + m4 + m5; arsipkan m2, m3 sebagai cadangan klaster momentum.",
        "Perhatikan yang dibuang: m2 (1,77) dan m3 (1,69) — keduanya Sharpe LEBIH TINGGI dari m4 dan m5 yang dipilih. Analis junior akan protes: 'masa 1,38 dipilih mengalahkan 1,77?!' Jawabannya: 1,77 yang kembar = 0 taruhan baru; 1,38 yang asing = 1 taruhan baru. Kamu tidak sedang memilih murid terpintar — kamu sedang menyusun tim.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "m2 dan m3 yang diarsipkan bukan sampah — mereka 'cadangan klaster': bila m1 pensiun (decay di live) atau gagal check di kuartal berikut, cadangan naik tanpa perlu riset ulang. Arsip klaster = bangku cadangan tim. Tim tanpa bangku cadangan panik setiap ada yang cedera.",
      },
      reference: "Pilih m1 + m4 + m5 (3 taruhan). m2, m3 = cadangan klaster, bukan sampah.",
    },
    {
          id: "gap-r9-taruhan-efektif",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P9-G4)",
          title: "Dari korelasi pairwise ke risiko portofolio: taruhan efektif",
          prose: [
            "Lab Langkah 6 mengelompokkan 6 kandidat menjadi 3 klaster — tetapi belum menghitung BERAPA taruhan independen yang sebenarnya kamu pegang. Tiga alpha yang masing-masing berkorelasi 0,9 satu sama lain BUKAN tiga taruhan: mereka satu taruhan yang sama lewat faktor pasar umum (mis. ketiganya long beta pasar). Rumus taruhan efektif (untuk korelasi berpasangan seragam ρ): n_efektif = n / (1 + (n−1)·ρ).",
            "Contoh angka: n = 3 alpha, ρ = 0,9 → n_efektif = 3 / (1 + 2×0,9) = 3/2,8 ≈ 1,07 — tiga alpha ≈ SATU taruhan. Bandingkan dengan ρ = 0: n_efektif = 3 (tiga taruhan sungguhan). Dan ρ = 0,5: n_efektif = 3/2 = 1,5. Inilah jembatan dari matriks korelasi pairwise ke risiko portofolio gabungan: varians portofolio (bobot sama) = σ²·(1 + (n−1)ρ)/n — dengan ρ = 0,9, diversifikasi hampir tidak mengurangi risiko (varians 0,93σ² vs 0,33σ² bila independen).",
            "Kaitan ke lab: greedy clustering di Langkah 6 adalah VERSI OPERASIONAL dari ide ini — klaster = taruhan. Aturan: laporkan SELALU taruhan efektif bersama jumlah alpha; '20 alpha' dengan taruhan efektif 1,2 adalah satu taruhan yang dibungkus 20 kali.",
          ],
          formula: String.raw`n_{efektif} = \frac{n}{1 + (n-1)\\rho}`,
          formulaNote: "Taruhan efektif: n_efektif = n/(1+(n−1)ρ). Contoh angka: n=3, ρ=0,9 → 3/2,8 ≈ 1,07 (tiga alpha ≈ satu taruhan); ρ=0 → 3; ρ=0,5 → 1,5. Varians portofolio = σ²(1+(n−1)ρ)/n.",
          tasks: [
            { id: "t1", text: "Hitung `n_efektif` (n=3, rho=0,9)" },
            { id: "t2", text: "Cetak n_efektif" },
          ],
          expected: "n_efektif=1.07",
          hints: [
            "n_efektif = n / (1 + (n−1) × rho).",
            "Perhatikan kurungnya.",
          ],
          code: {
            starter: `n, rho = 3, 0.9\n\n# TULIS KODEMU: taruhan efektif (korelasi berpasangan rho)\nn_efektif = \n\nprint(f"n_efektif={n_efektif:.2f}")`,
            lockLines: 3,
            solution: `n, rho = 3, 0.9\n\n# TULIS KODEMU: taruhan efektif (korelasi berpasangan rho)\nn_efektif = n / (1 + (n - 1) * rho)\n\nprint(f"n_efektif={n_efektif:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "n_efektif", value: 1.07, tol: 0.01, label: "`n_efektif` seharusnya 1,07", msg: "3/(1+2×0,9) = 3/2,8 ≈ 1,07." },
              { kind: "stdout_matches", task: "t2", pattern: "n_efektif=1.07", label: "`print` menampilkan n_efektif", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Kamu punya 20 alpha; taruhan efektifnya 1,2. Apa artinya untuk sizing?",
              options: [
                { text: "Satu taruhan yang dibungkus 20 kali — sizing seperti 1 alpha, bukan 20", why: "Benar: risiko portofolio ditentukan taruhan efektif, bukan jumlah alpha.", correct: true },
                { text: "20 taruhan independen — sizing bisa dibagi 20", why: "Salah: itulah yang terjadi bila ρ=0; dengan taruhan efektif 1,2, diversifikasinya ilusi." },
                { text: "Tidak ada artinya — jumlah alpha yang penting", why: "Salah: jumlah alpha tanpa korelasi adalah vanity metric." },
              ],
            },
          ],
          reference: "n_efektif = n/(1+(n−1)ρ); klaster = taruhan; laporkan taruhan efektif bersama jumlah alpha.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Satu gagasan: hitung taruhan, bukan baris.",
      ],
      tasks: [],
      summary: [
        "Matriks korelasi dibaca per blok: blok merah = klaster = satu taruhan.",
        "Taruhan efektif ≈ jumlah klaster; kandidat baru < 0,5 vs semua = 1 taruhan baru.",
        "Satu family = satu kapal: variannya tenggelam bersama saat kondisi berbalik.",
        "Family ortogonal: volatilitas, volume, gap, fundamental — diversifikasi struktural.",
        "Isi slot submit per klaster (wakil terbaik), bukan per ranking Sharpe global.",
      ],
      quiz: [
        {
          q: "20 varian slow-reversal saling berkorelasi 0,83–0,95. Berapa taruhan efektif?",
          options: [
            { text: "1 — satu klaster = satu taruhan", why: "Benar. 20 baris, satu blok merah, satu taruhan. Inilah tragedi spreadsheet 20 baris.", correct: true },
            { text: "20 — tiap varian dihitung", why: "Salah. Baris ≠ taruhan. 20 kembar tidak lebih terdiversifikasi dari 1." },
            { text: "10 — setengahnya pasti beda", why: "Salah. Korelasi 0,83–0,95 = praktis identik; tidak ada 'setengah beda'." }
          ],
        },
        {
          q: "Kandidat vol-a Sharpe 1,31 dipilih mengalahkan rev-d 1,68 untuk slot submit. Alasannya?",
          options: [
            { text: "vol-a taruhan baru (asing vs semua); rev-d kembar klaster reversal", why: "Benar. Slot diisi per klaster: 1,31 yang asing > 1,68 yang kembar.", correct: true },
            { text: "Sharpe 1,31 sebenarnya lebih baik dari 1,68", why: "Salah. 1,68 > 1,31 — tapi Sharpe bukan mata uang seleksi slot." },
            { text: "rev-d gagal IS checks", why: "Tidak ada info itu — rev-d lolos checks; masalahnya redundansi, bukan kualitas." }
          ],
        },
        {
          q: "Kapan waktu yang tepat membuka family baru?",
          options: [
            { text: "Klaster jenuh (4+ varian ≥ 0,7) atau plafon tercapai atau konsentrasi 1–2 family", why: "Benar. Tiga pemicu dari peta: jenuh, plafon, konsentrasi.", correct: true },
            { text: "Setelah semua varian family lama mencapai Sharpe 2,0", why: "Salah. Menunggu sempurna di satu family = menggosok plafon (WQB14)." },
            { text: "Tidak pernah — perdalam yang dikuasai saja", why: "Salah. Kenyamanan = musuh diversifikasi; itu jalan menuju 20 baris satu taruhan." }
          ],
        },
        {
          q: "Heatmap kuartal ini menunjukkan blok merah membesar di family momentum. Artinya?",
          options: [
            { text: "Konsentrasi naik — bekukan varian momentum, alihkan ke family ortogonal", why: "Benar. Respons skenario empat: darurat diversifikasi bila satu klaster > 50%.", correct: true },
            { text: "Bagus — family momentum semakin kuat", why: "Salah. Blok merah membesar = kembar bertambah = taruhan tidak bertambah." },
            { text: "Hapus heatmap — datanya pasti salah", why: "Menolak data karena tidak suka = dosa paling mahal di meja riset." }
          ],
        },
        {
          q: "Mana pernyataan yang BENAR tentang diversifikasi alpha?",
          options: [
            { text: "Dua puluh kembar = satu taruhan; dua orang asing = dua taruhan", why: "Benar. Inti lesson ini dalam satu kalimat.", correct: true },
            { text: "Korelasi rendah sekali = selamanya rendah", why: "Salah. Korelasi antar-family bisa naik saat regime berubah — heatmap dihitung ulang tiap kuartal." },
            { text: "Diversifikasi = punya banyak kandidat", why: "Salah. Banyak kandidat tanpa matriks korelasi = klaim tanpa bukti." }
          ],
        }
      ],
      reference: "Berpikir klaster, bukan baris. Hitung taruhan, bukan kandidat.",
    },
  ],
};
