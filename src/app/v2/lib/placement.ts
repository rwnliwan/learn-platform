// Tes penempatan "Mulai dari Sini" (Gelombang A, 2026-10-16).
// 15 soal elementer BARU (4 Statistika, 4 Probabilitas, 4 SQL, 3 Python) —
// ditulis untuk tes ini, bukan diambil dari lesson, agar bebas konteks prasyarat.
// Skor per area >= 75% = area dikuasai → blok lesson dasar area itu ditandai
// "terlewati via tes" (disimpan di localStorage v2:skipped, BUKAN sebagai selesai).

export type PlacementArea = "statistika" | "probabilitas" | "sql" | "python";

export interface PlacementOption {
  text: string;
  why: string;
}

export interface PlacementQuestion {
  area: PlacementArea;
  q: string;
  options: PlacementOption[];
  /** index jawaban benar */
  correct: number;
}

export const AREA_LABEL: Record<PlacementArea, string> = {
  statistika: "Statistika",
  probabilitas: "Probabilitas",
  sql: "SQL",
  python: "Python",
};

export const AREA_ORDER: PlacementArea[] = ["statistika", "probabilitas", "sql", "python"];

const O = (text: string, why: string): PlacementOption => ({ text, why });

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ── Statistika (4) ──────────────────────────────────────────────────
  {
    area: "statistika",
    q: "Nilai ujian satu kelas: 55, 60, 62, 65, 100. Ukuran pemusatan mana yang paling mewakili 'nilai tipikal' kelas ini?",
    options: [
      O("Rata-rata = 68,4", "Rata-rata memakai semua data, tapi tertarik ke atas oleh outlier 100 — kurang mewakili mayoritas siswa."),
      O("Median = 62", "Benar. Median adalah nilai tengah setelah data diurutkan; ia tahan terhadap outlier sehingga mewakili mayoritas kelas."),
      O("Modus", "Tidak ada nilai yang berulang di data ini, jadi modus tidak terdefinisi — tidak bisa dipakai."),
      O("Range = 45", "Range adalah ukuran sebaran (maks − min), bukan ukuran pemusatan."),
    ],
    correct: 1,
  },
  {
    area: "statistika",
    q: "Dua kelompok data punya rata-rata yang sama, tetapi standar deviasi A = 2 dan B = 12. Apa artinya?",
    options: [
      O("Data B lebih tersebar di sekitar rata-ratanya dibanding data A", "Benar. Standar deviasi mengukur sebaran di sekitar rata-rata — makin besar, makin lebar penyebarannya."),
      O("Rata-rata data B pasti lebih besar", "Salah. Rata-rata keduanya sama menurut soal; standar deviasi tidak mengubah rata-rata."),
      O("Data A pasti mengandung outlier", "Salah. Sebaran kecil justru menandakan data A rapat di sekitar rata-rata."),
      O("Tidak bisa disimpulkan apa-apa", "Salah. Standar deviasi justru memberi informasi sebaran yang jelas."),
    ],
    correct: 0,
  },
  {
    area: "statistika",
    q: "Korelasi Pearson r = 0,85 antara jam belajar dan nilai ujian. Pernyataan yang tepat adalah:",
    options: [
      O("Ada hubungan linear positif yang kuat antara keduanya", "Benar. |r| dekat 1 = kuat, tanda positif = searah. Korelasi hanya bicara asosiasi linear."),
      O("Setiap tambahan 1 jam belajar menaikkan nilai 0,85 poin", "Salah. r bukan koefisien regresi — ia tidak memberi satuan 'poin per jam'."),
      O("Jam belajar terbukti menyebabkan nilai naik", "Salah. Korelasi tidak membuktikan kausalitas; bisa ada faktor ketiga."),
      O("Nilai r yang tinggi menjamin tidak ada outlier", "Salah. Outlier justru bisa menggelembungkan r."),
    ],
    correct: 0,
  },
  {
    area: "statistika",
    q: "Sebuah survei mengambil 500 responden dari populasi 50 juta penduduk. Agar hasilnya bisa digeneralisasi, hal yang paling menentukan adalah:",
    options: [
      O("500 responden sudah cukup banyak", "Salah. Besar sampel membantu presisi, tapi tanpa keterwakilan, 500 ribu pun bisa bias."),
      O("Responden menjawab dengan jujur", "Penting, tapi kejujuran tidak memperbaiki sampel yang tidak representatif."),
      O("Sampel diambil secara acak dan mewakili keragaman populasi", "Benar. Representativitas adalah syarat generalisasi; metode sampling mengalahkan ukuran mentah."),
      O("Survei dilakukan secara tatap muka", "Salah. Mode pengumpulan tidak menentukan keterwakilan sampel."),
    ],
    correct: 2,
  },
  // ── Probabilitas (4) ────────────────────────────────────────────────
  {
    area: "probabilitas",
    q: "Peluang hujan hari ini 0,3 dan peluang jalanan macet 0,4. Jika keduanya independen, peluang hujan DAN macet adalah:",
    options: [
      O("0,7", "Salah. Itu hasil penjumlahan — untuk 'dan' pada kejadian independen, peluangnya dikalikan, bukan dijumlah."),
      O("0,35", "Salah. Itu rata-rata keduanya — tidak ada aturan peluang seperti itu."),
      O("0,12", "Benar. Untuk kejadian independen, P(A dan B) = P(A) × P(B) = 0,3 × 0,4 = 0,12."),
      O("0,5", "Salah. Tidak ada dasar perhitungannya."),
    ],
    correct: 2,
  },
  {
    area: "probabilitas",
    q: "Notasi P(A|B) dibaca sebagai:",
    options: [
      O("Peluang A terjadi DENGAN SYARAT B sudah terjadi", "Benar. Garis tegak '|' artinya 'diberi/dengan syarat' — peluang bersyarat."),
      O("Peluang A atau B terjadi", "Salah. 'Atau' ditulis P(A ∪ B), peluang gabungan."),
      O("Peluang A dan B terjadi bersamaan", "Salah. Itu peluang irisan, ditulis P(A ∩ B)."),
      O("Peluang B terjadi setelah A", "Salah. Urutan waktu tidak ada dalam notasi ini."),
    ],
    correct: 0,
  },
  {
    area: "probabilitas",
    q: "Sebuah tes penyakit akurat 99%, dan 1 dari 1.000 orang mengidap penyakit itu. Seseorang hasil tesnya positif. Kesimpulan yang benar:",
    options: [
      O("Peluang ia benar-benar sakit adalah 99%", "Salah. Ini jebakan base rate: karena penyakitnya sangat langka, sebagian besar hasil positif justru false positive."),
      O("Tesnya pasti salah", "Salah. Tes 99% akurat tetap informatif — ia menaikkan peluang sakit dari 0,1% menjadi jauh lebih tinggi, hanya saja tidak sampai 99%."),
      O("Peluangnya jauh lebih kecil dari 99% karena penyakitnya langka", "Benar. Aturan Bayes: base rate 0,1% menarik hasil akhir turun — intuisi '99% akurat = 99% sakit' keliru."),
      O("Harus dites ulang 99 kali untuk memastikan", "Salah. Pengulangan tidak memperbaiki kesalahan penalaran tentang base rate."),
    ],
    correct: 2,
  },
  {
    area: "probabilitas",
    q: "Sebuah dadu adil (6 sisi) dilempar sekali. Nilai harapan (expected value) hasilnya adalah:",
    options: [
      O("3", "Salah. 3 adalah median, bukan rata-rata tertimbang dari semua sisi."),
      O("3,5", "Benar. (1+2+3+4+5+6)/6 = 3,5 — rata-rata tertimbang peluang tiap sisi."),
      O("6", "Salah. Itu nilai maksimum, bukan harapan."),
      O("1/6", "Salah. Itu peluang munculnya satu sisi tertentu, bukan nilai harapan."),
    ],
    correct: 1,
  },
  // ── SQL (4) ─────────────────────────────────────────────────────────
  {
    area: "sql",
    q: "Query mana yang mengambil kolom nama dan gaji dari tabel karyawan yang gajinya di atas 10 juta?",
    options: [
      O("SELECT nama, gaji FROM karyawan WHERE gaji > 10000000", "Benar. Urutan baku: SELECT kolom → FROM tabel → WHERE filter baris."),
      O("SELECT * FROM karyawan WHERE gaji < 10000000", "Salah. Tanda < mengambil gaji di BAWAH 10 juta, dan * mengambil semua kolom."),
      O("SELECT nama, gaji WHERE gaji > 10000000 FROM karyawan", "Salah. Urutan klausa salah — WHERE tidak boleh mendahului FROM."),
      O("FROM karyawan SELECT nama, gaji HAVING gaji > 10000000", "Salah. HAVING dipakai untuk filter hasil agregasi (GROUP BY), bukan filter baris mentah."),
    ],
    correct: 0,
  },
  {
    area: "sql",
    q: "Untuk menghitung jumlah transaksi per bulan dari tabel transaksi, klausa yang wajib ada adalah:",
    options: [
      O("ORDER BY bulan", "Salah. ORDER BY hanya mengurutkan tampilan, tidak mengelompokkan perhitungan."),
      O("GROUP BY bulan", "Benar. Agregasi 'per bulan' butuh GROUP BY agar COUNT/SUM dihitung per kelompok bulan."),
      O("DISTINCT bulan", "Salah. DISTINCT hanya menghilangkan duplikat baris, tidak menghitung per kelompok."),
      O("WHERE COUNT(*) > 0", "Salah. Fungsi agregat tidak boleh dipakai di WHERE — itu tugas HAVING."),
    ],
    correct: 1,
  },
  {
    area: "sql",
    q: "Kamu ingin SEMUA baris tabel pelanggan tetap muncul di hasil, walau pelanggan itu belum pernah bertransaksi. JOIN yang tepat:",
    options: [
      O("INNER JOIN", "Salah. INNER JOIN hanya menyimpan baris yang cocok di kedua tabel — pelanggan tanpa transaksi hilang."),
      O("CROSS JOIN", "Salah. CROSS JOIN mengawinkan setiap baris dengan setiap baris — hasilnya meledak, bukan yang diminta."),
      O("LEFT JOIN", "Benar. LEFT JOIN mempertahankan semua baris tabel kiri (pelanggan); kolom transaksi yang tidak ada menjadi NULL."),
      O("RIGHT JOIN dari sisi transaksi", "Salah. Ini justru mempertahankan semua baris transaksi, bukan pelanggan."),
    ],
    correct: 2,
  },
  {
    area: "sql",
    q: "Kenapa `WHERE email = NULL` tidak pernah mengembalikan baris?",
    options: [
      O("Karena NULL sama dengan string kosong", "Salah. NULL bukan string kosong — ia berarti 'nilai tidak diketahui'."),
      O("Karena kolom email tidak boleh NULL", "Salah. Boleh tidaknya NULL diatur skema, bukan alasan query ini kosong."),
      O("Karena NULL berarti 'tidak diketahui', sehingga perbandingan = tidak pernah TRUE — pakai IS NULL", "Benar. Perbandingan dengan NULL hasilnya UNKNOWN, bukan TRUE; SQL memfilter baris yang tidak TRUE."),
      O("Karena harus memakai LIKE, bukan =", "Salah. LIKE pun tidak cocok dengan NULL."),
    ],
    correct: 2,
  },
  // ── Python (3) ──────────────────────────────────────────────────────
  {
    area: "python",
    q: "Perbedaan utama list dan tuple di Python adalah:",
    options: [
      O("List hanya boleh berisi angka", "Salah. List boleh berisi tipe apa pun, termasuk campuran."),
      O("List bisa diubah isinya (mutable), tuple tidak bisa (immutable)", "Benar. Inilah perbedaan fundamentalnya — tuple dipakai untuk data yang tidak boleh berubah."),
      O("Tuple selalu lebih lambat dari list", "Salah. Justru tuple biasanya sedikit lebih ringan dan cepat."),
      O("Tidak ada perbedaan yang berarti", "Salah. Mutability memengaruhi keamanan data & bisa tidaknya dipakai sebagai kunci dict."),
    ],
    correct: 1,
  },
  {
    area: "python",
    q: "Kode: `data = {'a': 1}` lalu `data['b']`. Apa yang terjadi?",
    options: [
      O("Mengembalikan None", "Salah. Itu perilaku dict.get('b') — akses kurung siku tidak selembut itu."),
      O("Menimbulkan KeyError", "Benar. Akses kunci yang tidak ada dengan [] melempar KeyError."),
      O("Otomatis menambah kunci 'b' dengan nilai 0", "Salah. Dict tidak menambah kunci sendiri saat dibaca."),
      O("Mengembalikan string kosong", "Salah. Tidak ada konversi otomatis seperti itu."),
    ],
    correct: 1,
  },
  {
    area: "python",
    q: "Hasil dari `[x*2 for x in [1, 2, 3]]` adalah:",
    options: [
      O("[1, 2, 3, 1, 2, 3]", "Salah. Itu hasil [1,2,3]*2 — pengulangan list, bukan perkalian tiap elemen."),
      O("12", "Salah. List comprehension menghasilkan list baru, bukan menjumlahkan."),
      O("[2, 4, 6]", "Benar. Setiap elemen dikali 2: 1→2, 2→4, 3→6."),
      O("Error karena sintaks salah", "Salah. Sintaks list comprehension-nya valid."),
    ],
    correct: 2,
  },
];

/* ── cakupan: blok lesson dasar yang dianggap dikuasai per area ──────────
   Urutan = urutan registry (lessonSortKey). startSlug = lesson pertama
   SETELAH blok yang dilewati = rekomendasi titik mulai area itu. */

export interface AreaCoverage {
  /** slug lesson dasar yang ditandai 'terlewati via tes' bila area dikuasai */
  masteredSlugs: string[];
  /** rekomendasi titik mulai bila area dikuasai */
  startSlug: string;
}

export const AREA_COVERAGE: Record<PlacementArea, AreaCoverage> = {
  statistika: {
    masteredSlugs: [
      "a11-tipe-data","a12-pemusatan","a13-sebaran","a14-skewness-kurtosis",
      "a15-kuantil-outlier","a16-korelasi","a17-missing-data","a18-visualisasi",
      "a19-eda-end-to-end",
    ],
    startSlug: "a21-sampling-bias",
  },
  probabilitas: {
    masteredSlugs: [
      "b1-aksioma-peluang","b2-kombinatorik","b3-peluang-bersyarat","b4-bayes",
      "b5-variabel-acak-ekspektasi","b6-distribusi-diskret-1","b6-distribusi-diskret-2",
      "b7-distribusi-kontinu-1","b7-distribusi-kontinu-2","b8-fitting-distribusi",
    ],
    startSlug: "b9-joint-kovarians",
  },
  sql: {
    masteredSlugs: [
      "c1-select-dasar","c2-null-logika","c3-agregasi-groupby",
      "c4-fungsi-tanggal-string","c5-join","c6-subquery","c7-cte","c8-union-set",
    ],
    startSlug: "c9-window-functions-1",
  },
  python: {
    masteredSlugs: [
      "d1-python-dasar","d2-struktur-data","d3-numpy","d4-pandas-dasar",
      "d5-data-cleaning","d6-wrangling",
    ],
    startSlug: "d7-datetime-timeseries",
  },
};

export const MASTER_THRESHOLD = 0.75;

export interface AreaResult {
  area: PlacementArea;
  correct: number;
  total: number;
  pct: number;
  mastered: boolean;
  skippedSlugs: string[];
  startSlug: string | null;
}

export interface PlacementResult {
  areas: Record<PlacementArea, AreaResult>;
  /** gabungan semua skippedSlugs dari area yang dikuasai */
  skippedSlugs: string[];
  masteredCount: number;
}

export function placementResult(
  scores: Record<PlacementArea, { correct: number; total: number }>,
): PlacementResult {
  const areas = {} as Record<PlacementArea, AreaResult>;
  const skipped: string[] = [];
  let masteredCount = 0;
  for (const area of AREA_ORDER) {
    const { correct, total } = scores[area];
    const pct = total ? correct / total : 0;
    const mastered = pct >= MASTER_THRESHOLD;
    const cov = AREA_COVERAGE[area];
    const skippedSlugs = mastered ? [...cov.masteredSlugs] : [];
    if (mastered) {
      masteredCount += 1;
      skipped.push(...skippedSlugs);
    }
    areas[area] = {
      area,
      correct,
      total,
      pct: Math.round(pct * 100),
      mastered,
      skippedSlugs,
      startSlug: mastered ? cov.startSlug : null,
    };
  }
  return { areas, skippedSlugs: skipped, masteredCount };
}
