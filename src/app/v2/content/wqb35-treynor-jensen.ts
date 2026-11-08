import type { V2Lesson } from "../lib/types";

export const wqb35: V2Lesson = {
  slug: "wqb35-treynor-jensen",
  track: "WorldQuant Brain",
  module: "Strategi & Riset",
  title: "WQB35 — Treynor & Jensen's Alpha: Sharpe Tidak Sendiri",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Portofolio 14 persen yang ternyata biasa saja",
      prose: [
        "Sebuah portofolio menghasilkan return 14 persen dengan volatilitas 12 persen dan beta 0,8 terhadap pasar. Risk-free rate 5 persen, pasar naik 11 persen. Sharpe-nya: (14 dikurangi 5) dibagi 12 sama dengan 0,75 — lumayan. Tetapi saat diukur dengan Treynor: (14 dikurangi 5) dibagi 0,8 sama dengan 11,25 persen per unit beta. Dan Jensen's alpha: 14 dikurangi (5 ditambah 0,8 dikali (11 dikurangi 5)) sama dengan 14 dikurangi 9,8 sama dengan 4,2 persen — return di atas yang seharusnya diberikan beta-nya.",
        "Tiga angka itu bercerita tentang hal yang berbeda — dan peneliti yang hanya mengenal Sharpe akan salah membaca portofolio ini. Lesson ini mengajarkan dua metrik klasik yang melengkapi Sharpe: Treynor, yang mengukur return per unit risiko sistematis; dan Jensen's alpha, yang mengukur return di atas ekspektasi CAPM. WQB3 mengajarkan Sharpe sendirian; lesson ini melengkapi kotak peralatannya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "WQB3 mengajarkan Sharpe ratio dari nol — rumus, gerbang 1,25, dan jebakan satuan — tetapi tidak menyebut Treynor atau Jensen sama sekali (pencarian di WQB3 menghasilkan nol; keduanya hanya muncul di PM-C5 dari sudut evaluasi manajer portofolio). Lesson ini membangun keduanya dari sudut peneliti alpha: kapan Sharpe menipu, dan apa yang ditambahkan Treynor dan Jensen.",
      },
      reference: "Return 14 persen, rf 5 persen, beta 0,8, pasar 11 persen, vol 12 persen. Sharpe 0,75; Treynor 11,25 persen; Jensen 4,2 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur portofolio dengan tiga metrik dan tahu kapan tiap metrik berbohong.",
        "(1) Menghitung Treynor ratio dan Jensen's alpha dari data;",
        "(2) Menjelaskan perbedaan risiko total (Sharpe) dan risiko sistematis (Treynor);",
        "(3) Menjelaskan Jensen's alpha sebagai return di atas ekspektasi CAPM;",
        "(4) Menjelaskan kapan Sharpe menipu: diversifikasi yang buruk dan beta yang rendah;",
        "(5) Memilih metrik yang benar untuk membandingkan dua alpha.",
      ],
      tasks: [],
    },
    {
      id: "treynor",
      eyebrow: "Langkah 3 · Teori",
      title: "Treynor: return per unit beta",
      prose: [
        "Treynor ratio sama dengan (return portofolio dikurangi risk-free) dibagi beta. Dalam data cerita pembuka: (14 dikurangi 5) dibagi 0,8 sama dengan 11,25 persen. Artinya: tiap unit risiko sistematis (beta) menghasilkan 11,25 persen excess return. Bandingkan dengan pasar: (11 dikurangi 5) dibagi 1,0 sama dengan 6,0 persen — portofolio ini menghasilkan hampir dua kali lipat per unit beta dibanding pasar.",
        "Perbedaan dengan Sharpe ada di pembagi: Sharpe membagi dengan volatilitas total (risiko sistematis ditambah risiko spesifik), Treynor membagi dengan beta saja (risiko sistematis). Bila portofolio sudah terdiversifikasi dengan baik, risiko spesifiknya kecil — dan Sharpe serta Treynor akan bercerita sama. Bila portofolio terkonsentrasi pada sedikit saham, risiko spesifiknya besar — Sharpe akan terlihat buruk sementara Treynor terlihat bagus. Treynor yang bagus dengan Sharpe yang buruk adalah tanda portofolio yang tidak terdiversifikasi.",
        "Untuk peneliti alpha, Treynor berguna saat membandingkan alpha yang akan digabung ke portofolio besar: risiko spesifik alpha akan terdiversifikasi di portofolio, sehingga yang penting adalah return per unit beta — bukan per unit volatilitas total. Alpha dengan Treynor tinggi dan Sharpe biasa-biasa saja bisa menjadi tambahan portofolio yang sangat baik, asalkan korelasinya rendah dengan alpha yang sudah ada (lihat WQB15 dan WQB28).",
      ],
      tasks: [],
      note: {
        title: "Beta negatif membalik Treynor",
        body: "Bila beta negatif, Treynor menjadi negatif meskipun excess return positif — dan perbandingannya rusak. Treynor hanya bermakna untuk beta positif. Alpha dengan beta negatif (hedge murni) dinilai dengan Jensen, bukan Treynor.",
      },
      reference: "Treynor 11,25 persen vs pasar 6,0 persen. Treynor bagus + Sharpe buruk berarti kurang diversifikasi.",
    },
    {
      id: "jensen",
      eyebrow: "Langkah 4 · Teori",
      title: "Jensen's alpha: return di atas ekspektasi CAPM",
      prose: [
        "Jensen's alpha sama dengan return aktual dikurangi return yang diharapkan CAPM: return aktual dikurangi (risk-free ditambah beta dikali (return pasar dikurangi risk-free)). Dalam data cerita pembuka: 14 dikurangi (5 ditambah 0,8 dikali 6) sama dengan 14 dikurangi 9,8 sama dengan 4,2 persen. Artinya: portofolio ini menghasilkan 4,2 persen LEBIH dari yang seharusnya diberikan oleh beta 0,8-nya. Itulah 'alpha' dalam arti CAPM — dan Jensen adalah definisi formal dari kata yang dipakai setiap hari di WorldQuant Brain.",
        "Jensen positif berarti manajer atau sinyal menambah nilai di atas risiko yang diambilnya; Jensen nol berarti ia hanya dibayar sesuai risikonya; Jensen negatif berarti ia menghancurkan nilai — return-nya lebih kecil dari yang seharusnya diberikan beta-nya. Perhatikan: Jensen 4,2 persen di sini konsisten dengan Treynor 11,25 persen yang di atas pasar 6,0 persen — keduanya berkata hal yang sama dengan bahasa yang berbeda. Bila keduanya bertentangan, periksa beta-nya: beta yang diestimasi dengan salah merusak keduanya.",
        "Keterbatasan Jensen yang harus diingat: ia bergantung pada CAPM — dan CAPM bergantung pada pasar yang benar dan beta yang stabil. Bila 'pasar' yang dipakai bukan pasar yang relevan (misalnya memakai indeks Amerika untuk alpha Indonesia), Jensen-nya tidak berarti apa-apa. Dan beta yang diestimasi dari 252 hari bisa bergeser — Jensen yang dihitung dari beta basi adalah alpha yang basi.",
      ],
      tasks: [],
      note: {
        title: "Sharpe, Treynor, Jensen: satu keluarga, tiga pertanyaan",
        body: "Sharpe bertanya 'berapa return per unit risiko total?' Treynor bertanya 'berapa return per unit risiko pasar?' Jensen bertanya 'berapa return di atas yang seharusnya?' Ketiganya memakai angka yang sama — return, risk-free, pasar, beta, volatilitas — tetapi menjawab pertanyaan yang berbeda. Peneliti yang baik memakai ketiganya, bukan memilih satu favorit.",
      },
      reference: "Jensen 4,2 persen: return di atas ekspektasi CAPM. Positif berarti menambah nilai; negatif berarti menghancurkan nilai.",
    },
    {
      id: "lab-treynor-jensen",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung Sharpe, Treynor, dan Jensen",
      prose: [
        "Lab ini menghitung tiga metrik dari data cerita pembuka: Sharpe, Treynor, dan Jensen's alpha. Hitung dulu di kepala. Sharpe: (14 dikurangi 5) dibagi 12 sama dengan 0,75. Treynor: (14 dikurangi 5) dibagi 0,8 sama dengan 11,25. Jensen: 14 dikurangi (5 ditambah 0,8 dikali (11 dikurangi 5)) sama dengan 14 dikurangi 9,8 sama dengan 4,2.",
        "Tugas lab: isi tiga variabel — sharpe, treynor, jensen — lalu cetak ketiganya. Tiga angka ini adalah kartu metrik portofolio: satu untuk risiko total, satu untuk risiko sistematis, satu untuk nilai tambah.",
        "Setelah lolos, coba eksperimen: naikkan beta menjadi 1,2 dan lihat Treynor jatuh ke 7,5 dan Jensen menjadi 1,8 — lalu tanyakan: apakah portofolio itu tiba-tiba menjadi buruk? Jawabannya: tidak — return-nya sama, tetapi ia mengambil risiko pasar yang lebih besar untuk mendapatkannya. Itulah yang diukur Treynor dan Jensen: bukan return-nya, melainkan harga risikonya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung Sharpe ratio" },
        { id: "t2", text: "Hitung Treynor ratio dalam persen" },
        { id: "t3", text: "Hitung Jensen's alpha dalam persen" },
      ],
      expected: "sharpe=0.75\ntreynor=11.25\njensen=4.2",
      hints: [
        "Sharpe = (return - risk-free) / volatilitas.",
        "Treynor = (return - risk-free) / beta.",
        "Jensen = return - (risk-free + beta x (pasar - risk-free)).",
      ],
      code: {
        starter: "# Portofolio (persen). JANGAN UBAH.\nret, rf, beta, pasar, vol = 14, 5, 0.8, 11, 12\n\n# TULIS KODEMU: Sharpe, Treynor, Jensen\nsharpe = \ntreynor = \njensen = \nprint(f\"sharpe={round(sharpe, 2)}\")\nprint(f\"treynor={round(treynor, 2)}\")\nprint(f\"jensen={round(jensen, 2)}\")",
        lockLines: 4,
        solution: "# Portofolio (persen). JANGAN UBAH.\nret, rf, beta, pasar, vol = 14, 5, 0.8, 11, 12\n\n# TULIS KODEMU: Sharpe, Treynor, Jensen\nsharpe = (ret - rf) / vol\ntreynor = (ret - rf) / beta\njensen = ret - (rf + beta * (pasar - rf))\nprint(f\"sharpe={round(sharpe, 2)}\")\nprint(f\"treynor={round(treynor, 2)}\")\nprint(f\"jensen={round(jensen, 2)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "sharpe=0.75", label: "Sharpe 0,75", msg: "(14 - 5) / 12 = 0,75. Lumayan — tetapi bukan cerita lengkap." },
          { kind: "stdout_matches", task: "t2", pattern: "treynor=11.25", label: "Treynor 11,25 persen", msg: "(14 - 5) / 0,8 = 11,25. Hampir dua kali pasar (6,0 persen per unit beta)." },
          { kind: "stdout_matches", task: "t3", pattern: "jensen=4.2", label: "Jensen 4,2 persen", msg: "14 - (5 + 0,8 x 6) = 4,2. Return di atas ekspektasi CAPM." },
        ],
      },
      reference: "Sharpe 0,75; Treynor 11,25 persen; Jensen 4,2 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: dua alpha, satu slot",
      prose: [
        "Dua alpha bersaing untuk satu slot di portofolio. Alpha A: Sharpe 1,6, beta 0,9, Jensen 2,1 persen. Alpha B: Sharpe 1,35, beta 0,3, Jensen 3,8 persen, Treynor 13,3 persen. Bila hanya melihat Sharpe, A menang. Tetapi portofolio sudah penuh dengan alpha ber-beta tinggi — dan B, dengan beta 0,3, menambah diversifikasi yang tidak dimiliki A. Jensen B yang lebih tinggi berkata B menambah nilai LEBIH BESAR di atas ekspektasi CAPM-nya — Jensen adalah selisih absolut dalam persen, BUKAN 'per unit risiko': ia tidak dibagi beta atau volatilitas apa pun, jadi jangan membacanya sebagai ukuran efisiensi per unit risiko.",
        "Keputusan: B yang dipilih. Enam bulan kemudian, saat pasar jatuh 8 persen, portofolio dengan B jatuh 2 persen lebih sedikit daripada yang akan terjadi dengan A — beta 0,3 itu membayar. Sharpe A yang lebih tinggi ternyata adalah Sharpe dari risiko pasar yang dibungkus sebagai alpha — dan risiko pasar itu tidak dibayar saat pasar jatuh.",
        "Pelajaran yang dicatat: membandingkan alpha dengan satu metrik adalah seperti membandingkan mobil dengan satu angka — kecepatan tanpa rem. Sharpe berkata tentang risiko total; Treynor dan Jensen berkata tentang berapa dari return itu yang benar-benar alpha, bukan beta yang menyamar.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, tiga metrik dibaca bersama, bukan satu. Kedua, beta portofolio yang sudah ada dipertimbangkan — diversifikasi adalah konteks. Ketiga, Jensen dipakai sebagai ukuran nilai tambah, bukan Sharpe semata.",
      },
      reference: "A: Sharpe 1,6, Jensen 2,1 persen. B: Sharpe 1,35, Jensen 3,8 persen, beta 0,3. B dipilih.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Sharpe: excess return per unit volatilitas total.",
        "Lab: Sharpe 0,75; Treynor 11,25 persen; Jensen 4,2 persen.",
        "Treynor: excess return per unit beta — risiko sistematis saja.",
        "Jensen: return di atas ekspektasi CAPM — definisi formal alpha.",
        "Treynor bagus + Sharpe buruk berarti portofolio kurang terdiversifikasi.",
      ],
      next: { label: "WQB36 — Survivorship & Look-Ahead Bias: Kuburan dan Masa Depan yang Bocor", href: "/v2/learn/wqb36-survivorship-lookahead-bias" },
      quiz: [
        {
          q: "Return 14 persen, rf 5 persen, beta 0,8, pasar 11 persen, vol 12 persen. Berapa Treynor dan Jensen?",
          options: [
            { text: "Treynor 11,25 persen; Jensen 4,2 persen", why: "Tepat: (14-5)/0,8 = 11,25; 14 - (5 + 0,8 x 6) = 4,2.", correct: true },
            { text: "Treynor 0,75; Jensen 4,2 persen", why: "Salah: 0,75 adalah Sharpe, bukan Treynor." },
            { text: "Treynor 11,25 persen; Jensen 9,8 persen", why: "Salah: 9,8 adalah return ekspektasi CAPM, bukan Jensen. Jensen = 14 - 9,8 = 4,2." },
            { text: "Treynor 6,0 persen; Jensen 3,0 persen", why: "Salah: 6,0 adalah excess return pasar, bukan Treynor portofolio." },
          ],
        },
        {
          q: "Portofolio punya Treynor tinggi tetapi Sharpe rendah. Apa diagnosisnya?",
          options: [
            { text: "Portofolio sangat baik di semua ukuran", why: "Salah: Sharpe rendah berarti ada masalah — risiko totalnya besar." },
            { text: "Portofolio kurang terdiversifikasi — risiko spesifiknya besar", why: "Tepat: Treynor mengabaikan risiko spesifik; Sharpe tidak. Kesenjangan keduanya MENANDAKAN risiko spesifik yang besar — tetapi selisih angkanya BUKAN ukuran risiko spesifik itu sendiri: satuannya berbeda (Treynor persen per unit beta, Sharpe tanpa satuan), jadi tidak bisa dibaca sebagai 'selisih = risiko spesifik'.", correct: true },
            { text: "Beta-nya pasti negatif", why: "Salah: beta negatif membalik Treynor menjadi negatif, bukan tinggi." },
            { text: "Risk-free rate-nya salah", why: "Salah: rf yang salah memengaruhi ketiganya secara sama, bukan selisih Treynor-Sharpe." },
          ],
        },
        {
          q: "Jensen's alpha sebuah alpha adalah minus 2,0 persen. Apa artinya?",
          options: [
            { text: "Alpha itu menghasilkan 2 persen di atas pasar", why: "Salah: Jensen negatif berarti DI BAWAH ekspektasi CAPM, bukan di atas pasar." },
            { text: "Alpha itu menghancurkan nilai — return-nya di bawah yang seharusnya diberikan beta-nya", why: "Tepat: Jensen negatif berarti manajer dibayar lebih dari yang ia hasilkan.", correct: true },
            { text: "Alpha itu tidak punya risiko", why: "Salah: Jensen tidak berkata apa-apa tentang ada-tidaknya risiko." },
            { text: "Alpha itu harus segera di-leverage", why: "Salah: leverage memperbesar return DAN risiko — ia tidak memperbaiki Jensen yang negatif." },
          ],
        },
        {
          q: "Kenapa beta yang diestimasi dengan salah merusak Jensen's alpha?",
          options: [
            { text: "Karena Jensen tidak memakai beta", why: "Salah: Jensen memakai beta di ekspektasi CAPM-nya." },
            { text: "Karena ekspektasi CAPM dihitung dari beta — beta salah berarti ekspektasi salah, berarti Jensen salah", why: "Tepat: Jensen adalah selisih terhadap ekspektasi; ekspektasi yang salah membuat selisihnya tidak berarti.", correct: true },
            { text: "Karena beta hanya memengaruhi Sharpe", why: "Salah: beta memengaruhi Treynor dan Jensen, bukan Sharpe (Sharpe memakai volatilitas)." },
            { text: "Beta tidak pernah salah — ia dihitung dari data", why: "Salah: beta diestimasi dari sampel dan bisa bergeser; beta basi menghasilkan Jensen basi." },
          ],
        },
        {
          q: "Alpha A: Sharpe 1,6, beta 0,9, Jensen 2,1 persen. Alpha B: Sharpe 1,35, beta 0,3, Jensen 3,8 persen. Portofolio sudah penuh alpha ber-beta tinggi. Mana yang dipilih?",
          options: [
            { text: "A — Sharpe lebih tinggi selalu menang", why: "Salah: Sharpe A sebagian adalah beta yang menyamar; portofolio butuh diversifikasi beta rendah." },
            { text: "B — Jensen lebih tinggi dan beta rendah menambah diversifikasi", why: "Tepat: B menambah nilai absolut lebih besar di atas ekspektasi CAPM-nya dan beta rendahnya menyeimbangkan portofolio.", correct: true },
            { text: "Keduanya — selalu ambil keduanya", why: "Salah: hanya ada satu slot; dan keduanya bersama mungkin berkorelasi." },
            { text: "Tidak satu pun — Sharpe keduanya di bawah 2", why: "Salah: gerbang Sharpe 1,25 di WQB3, bukan 2. Keduanya lolos gerbang (A 1,6; B 1,35)." },
          ],
        },
      ],
    },
  ],
};
