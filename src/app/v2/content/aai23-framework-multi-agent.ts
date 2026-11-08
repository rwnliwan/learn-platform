import type { V2Lesson } from "../lib/types";

export const aai23: V2Lesson = {
  slug: "aai23-framework-multi-agent",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI23 — Framework Multi-Agent di Luar LangChain: CrewAI, AG2 & BeeAI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga agen, tiga framework — dan satu yang 2,12x lebih cepat karena paralel",
      prose: [
        "Tim NusaBank membangun agen riset dokumen dengan tiga agen: pencari, peringkas, dan pemeriksa. Di LangChain, ketiganya jalan berurutan: 1.200 + 900 + 1.500 ms = 3.600 ms per tugas. Di CrewAI dengan eksekusi paralel, pencari dan peringkas jalan bersamaan: maks(1.200, 900, 1.500) + overhead 200 ms = 1.700 ms — 2,12x lebih cepat. Bukan karena CrewAI 'lebih baik' — melainkan karena tugasnya paralel dan framework-nya mendukungnya secara native. Framework yang tepat adalah yang cocok dengan BENTUK tugasmu.",
        "Lesson ini mengajarkan framework multi-agent di luar LangChain secara hands-on: CrewAI (peran + delegasi), AG2/AutoGen (percakapan antar agen), dan BeeAI (orkestrasi ringan + standar). AAI10 membandingkan framework dari sudut konsep (loop, state, checkpoint) — lesson ini turun ke praktik: kapan tiap framework menang, berapa biayanya, dan bagaimana mereka dieksekusi.",
        "Setelah lesson ini kamu bisa: (1) membedakan model eksekusi CrewAI, AG2, dan BeeAI; (2) menghitung latensi sekuensial vs paralel; (3) menghitung biaya token multi-agent per tugas; (4) memilih framework dari bentuk tugas; (5) menjelaskan kapan kode polos mengalahkan semua framework.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AAI10 membahas LangChain/LangGraph vs CrewAI dari sudut KONSEP (perbandingan, biaya migrasi Rp27 juta, aturan 80 persen konsep) dan menyebut AG2/AutoGen/BeeAI 0 kali. Lesson ini membangun sisi HANDS-ON-nya: model eksekusi tiap framework, perhitungan latensi paralel vs sekuensial, biaya token per tugas, dan panduan pemilihan — dengan lab yang menghitung speedup dan biaya dari angka mentah.",
      },
      reference: "Sekuensial 3.600 ms vs paralel 1.700 ms (2,12x); $0,0171 per agen; $0,0513 per tugas; $513 per 10.000 tugas.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu memilih framework multi-agent dari bentuk tugas — bukan dari tren.",
        "(1) Menjelaskan model eksekusi CrewAI (peran), AG2 (percakapan), BeeAI (orkestrasi);",
        "(2) Menghitung latensi sekuensial vs paralel;",
        "(3) Menghitung biaya token per agen dan per tugas;",
        "(4) Memilih framework dari bentuk tugas (delegasi, debat, pipeline);",
        "(5) Menjelaskan kapan kode polos lebih baik dari framework apa pun.",
      ],
      tasks: [],
    },
    {
      id: "tiga-framework",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga framework, tiga bentuk pikiran",
      prose: [
        "CrewAI berpikir dalam PERAN: tiap agen punya role, goal, dan backstory ('Kamu peneliti senior yang...'), dan tugas didelegasikan manajer ke agen yang tepat. Kekuatannya: delegasi yang mudah dibaca manusia dan eksekusi paralel bawaan untuk tugas independen. Kelemahannya: overhead peran (tiap agen membawa prompt peran yang panjang = token) dan delegasi yang kaku bila tugas berubah di tengah jalan.",
        "AG2 (dulu AutoGen) berpikir dalam PERCAKAPAN: agen-agen berbicara satu sama lain dalam putaran (turn) sampai konsensus atau batas putaran tercapai. Kekuatannya: debat dan kritik silang — agen pemeriksa bisa menantang agen penulis sampai 3 putaran. Kelemahannya: percakapan bisa berputar tanpa ujung (butuh batas putaran + kriteria berhenti yang tegas) dan biaya token membengkak tiap putaran (tiap agen membaca seluruh riwayat).",
        "BeeAI berpikir dalam ORKESTRASI RINGAN: agen sebagai servis dengan protokol standar (A2A), bisa digabung tanpa framework berat. Kekuatannya: interoperabilitas — agen dari vendor berbeda bisa bekerja sama lewat protokol yang sama. Kelemahannya: ekosistem lebih muda, tooling lebih sedikit. Aturan AAI10 tetap berlaku: 80 persen waktu belajar ke konsep (loop, state, checkpoint), 20 persen ke API — framework berganti tiap 2 tahun, konsepnya abadi.",
      ],
      tasks: [],
      note: {
        title: "Biaya peran yang tersembunyi",
        body: "Tiap agen CrewAI membawa prompt peran + goal + backstory (sering 300-500 token) yang dikirim di SETIAP panggilan. Tiga agen x 400 token = 1.200 token overhead per tugas — sebelum satu kata tugas pun diproses. Hitung overhead ini dalam anggaran; framework yang 'mudah dibaca' bisa menjadi framework yang mahal dibayar.",
      },
      reference: "CrewAI = peran + delegasi; AG2 = percakapan + debat; BeeAI = orkestrasi ringan + A2A.",
    },
    {
      id: "angka",
      eyebrow: "Langkah 4 · Teori",
      title: "Angka yang memutuskan: latensi dan biaya",
      prose: [
        "Latensi: tiga agen dengan waktu 1.200, 900, dan 1.500 ms. Sekuensial = 1.200 + 900 + 1.500 = 3.600 ms. Paralel = maks(1.200, 900, 1.500) + overhead koordinasi 200 ms = 1.700 ms. Speedup = 3.600 / 1.700 = 2,12x. Paralel hanya menang bila tugas independen — bila peringkas butuh hasil pencari, tidak ada paralelisme yang bisa menyelamatkanmu; rantai tetap sekuensial.",
        "Biaya: tiap agen memakai 2.500 token masuk ($0,003/1.000) + 800 token keluar ($0,012/1.000). Per agen = 2,5 x 0,003 + 0,8 x 0,012 = 0,0075 + 0,0096 = $0,0171. Tiga agen = $0,0513 per tugas. Untuk 10.000 tugas/bulan = $513. Bandingkan agen tunggal yang mengerjakan semuanya: 1 agen x $0,0171 = $0,0171 per tugas — 3x lebih murah. Multi-agent HARUS membenarkan biayanya dengan kualitas: bila 3 agen hanya 2 poin lebih baik dari 1 agen, $342/bulan ekstra itu membeli apa?",
        "Aturan pemilihan: tugas independen + butuh kecepatan → CrewAI paralel. Tugas butuh debat/kritik → AG2 dengan batas 3 putaran. Tugas lintas vendor/protokol → BeeAI/A2A. Tugas sederhana (1-2 langkah) → kode polos — framework adalah overhead yang tidak dibayar kembali. Dan selalu ukur: multi-agent yang tidak diukur biayanya akan ditagih di akhir bulan.",
      ],
      tasks: [],
      note: {
        title: "Putaran AG2 tanpa batas adalah tagihan tanpa batas",
        body: "Dua agen yang berdebat tanpa kriteria berhenti bisa berputar 20 putaran — tiap putaran membaca seluruh riwayat (token membengkak kuadratik). Selalu tetapkan: maks 3 putaran + kriteria berhenti eksplisit ('setuju' atau 'pemeriksa menyetujui'). Tanpa itu, AG2 adalah loop tak terbatas yang memakai kartu kreditmu.",
      },
      reference: "Paralel 1.700 ms (2,12x); $0,0513/tugas; $513/10.000 tugas.",
    },
    {
      id: "lab-framework",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: speedup paralel dan biaya multi-agent",
      prose: [
        "Lab ini menghitung ekonomi framework multi-agent dari angka mentah: latensi sekuensial vs paralel, speedup, dan biaya per tugas.",
        "Hitung dulu di kepala. Sekuensial: 1.200 + 900 + 1.500 = 3.600 ms. Paralel: 1.500 + 200 = 1.700 ms. Speedup: 3.600 / 1.700 = 2,12x. Per agen: 2,5 x 0,003 + 0,8 x 0,012 = $0,0171. Per tugas (3 agen): $0,0513. Per 10.000 tugas: $513.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: sekuensial, paralel, speedup, per_tugas, per_10k. Lima angka ini adalah neraca framework — dengan ini 'framework X lebih cepat' menjadi klaim yang bisa dihitung.",
        "Setelah lolos, coba eksperimen: ubah overhead paralel menjadi 800 ms dan lihat speedup turun menjadi 1,57x — lalu tanyakan: pada overhead berapa paralel berhenti sepadan?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sekuensial` dan `paralel` (overhead 200 ms)" },
        { id: "t2", text: "Hitung `speedup` paralel vs sekuensial" },
        { id: "t3", text: "Hitung `per_tugas` (3 agen) dan `per_10k` dalam dolar" },
      ],
      expected: "sekuensial=3600\nparalel=1700\nspeedup=2.12\nper_tugas=0.0513\nper_10k=513.0",
      hints: [
        "Sekuensial = jumlah ketiga waktu; paralel = maks + overhead.",
        "Speedup = sekuensial / paralel; bulatkan 2 desimal.",
        "Per agen = 2,5 x 0,003 + 0,8 x 0,012.",
      ],
      code: {
        starter: `# Ekonomi framework multi-agent: latensi + biaya.\nwaktu = [1200, 900, 1500]\noverhead = 200\ntoken_in, token_out = 2.5, 0.8  # ribu token\ntarif_in, tarif_out = 0.003, 0.012\nn_agen, n_tugas = 3, 10000\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nsekuensial = \nparalel = \nspeedup = \nper_tugas = \nper_10k = \n\nprint(f"sekuensial={sekuensial}")\nprint(f"paralel={paralel}")\nprint(f"speedup={round(speedup, 2)}")\nprint(f"per_tugas={round(per_tugas, 4)}")\nprint(f"per_10k={per_10k}")`,
        lockLines: 5,
        solution: `# Ekonomi framework multi-agent: latensi + biaya.\nwaktu = [1200, 900, 1500]\noverhead = 200\ntoken_in, token_out = 2.5, 0.8  # ribu token\ntarif_in, tarif_out = 0.003, 0.012\nn_agen, n_tugas = 3, 10000\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nsekuensial = sum(waktu)\nparalel = max(waktu) + overhead\nspeedup = sekuensial / paralel\nper_tugas = n_agen * (token_in * tarif_in + token_out * tarif_out)\nper_10k = per_tugas * n_tugas\n\nprint(f"sekuensial={sekuensial}")\nprint(f"paralel={paralel}")\nprint(f"speedup={round(speedup, 2)}")\nprint(f"per_tugas={round(per_tugas, 4)}")\nprint(f"per_10k={per_10k}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sekuensial", value: 3600, tol: 1e-9, label: "`sekuensial` seharusnya 3600", msg: "1.200+900+1.500 = 3.600 ms." },
          { kind: "equal", task: "t1", name: "paralel", value: 1700, tol: 1e-9, label: "`paralel` seharusnya 1700", msg: "1.500+200 = 1.700 ms." },
          { kind: "equal", task: "t2", name: "speedup", value: 2.12, tol: 0.01, label: "`speedup` seharusnya 2.12", msg: "3.600/1.700 = 2,12x." },
          { kind: "equal", task: "t3", name: "per_tugas", value: 0.0513, tol: 0.0001, label: "`per_tugas` seharusnya 0.0513", msg: "3 x $0,0171 = $0,0513." },
          { kind: "equal", task: "t3", name: "per_10k", value: 513.0, tol: 0.01, label: "`per_10k` seharusnya 513.0", msg: "$0,0513 x 10.000 = $513." },
        ],
      },
      reference: "3.600 vs 1.700 ms (2,12x); $0,0513/tugas; $513/10.000 tugas.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: framework apa, kapan",
      prose: [
        "Skenario 1 — Tugas independen, butuh kecepatan, peran jelas. → CrewAI paralel. Alasan: delegasi + paralel bawaan.",
        "Skenario 2 — Butuh debat dan kritik silang (penulis vs pemeriksa). → AG2, maks 3 putaran + kriteria berhenti. Alasan: percakapan adalah fitur, bukan bug — bila dibatasi.",
        "Skenario 3 — Agen dari vendor berbeda harus bekerja sama. → BeeAI / A2A. Alasan: protokol standar mengalahkan integrasi kustom.",
        "Skenario 4 — Tugas 1-2 langkah, sederhana. → Kode polos. Alasan: framework adalah overhead yang tidak dibayar kembali.",
        "Skenario 5 — Sudah di LangChain dan tim menguasainya. → Tetap LangChain/LangGraph (AAI10) — jangan pindah demi tren. Alasan: biaya migrasi Rp27 juta (AAI10) hanya sepadan bila bentuk tugas berubah.",
        "Aturan praktis: pilih dari BENTUK tugas, bukan dari popularitas. Dan ingat AAI10: yang dipindahkan saat ganti framework adalah pemahaman konsep — bukan hafalan API.",
      ],
      tasks: [],
      note: {
        title: "Framework hopping adalah pajak",
        body: "Tim yang ganti framework 3x setahun membayar 3 x 3 pekan x Rp1,5 juta x 2 orang = Rp27 juta/tahun (AAI10) — untuk kemampuan yang sama. Tetapkan framework per proyek, evaluasi tiap 6 bulan, dan pindah hanya bila bentuk tugas berubah — bukan bila ada framework baru yang viral.",
      },
      reference: "CrewAI untuk paralel; AG2 untuk debat; BeeAI untuk lintas vendor; polos untuk sederhana.",
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
        "CrewAI = peran + delegasi; AG2 = percakapan + debat; BeeAI = orkestrasi + A2A.",
        "Sekuensial 3.600 ms vs paralel 1.700 ms — speedup 2,12x.",
        "Biaya: $0,0171 per agen; $0,0513 per tugas; $513 per 10.000 tugas.",
        "AG2 butuh maks putaran + kriteria berhenti.",
        "Pilih dari bentuk tugas; jangan framework hopping.",
      ],
      next: { label: "AAI24 — Evaluasi Agen: Benchmark & Taksonomi Kegagalan", href: "/v2/learn/aai24-evaluasi-agen-benchmark" },
      quiz: [
        {
          q: "Tiga agen 1.200, 900, 1.500 ms + overhead paralel 200 ms. Berapa speedup paralel?",
          options: [
            { text: "2,12x", why: "Tepat: sekuensial 3.600; paralel 1.700; 3.600/1.700 = 2,12.", correct: true },
            { text: "3x — tiga agen berarti 3x lebih cepat", why: "Salah: speedup dibatasi agen terlambat (1.500) + overhead; tidak pernah 3x penuh." },
            { text: "1,5x — hanya agen terlambat yang dihitung", why: "Salah: itu bukan speedup; speedup = sekuensial/paralel." },
            { text: "1x — paralel tidak membantu multi-agent", why: "Salah: paralel membantu bila tugas independen; 2,12x di kasus ini." },
          ],
        },
        {
          q: "Kapan paralel TIDAK membantu multi-agent?",
          options: [
            { text: "Bila tugas dependen — peringkas butuh hasil pencari", why: "Tepat: rantai dependensi tetap sekuensial; tidak ada paralelisme yang bisa menyelamatkan.", correct: true },
            { text: "Bila agennya lebih dari 2", why: "Salah: jumlah agen bukan penentu; dependensi yang menentukan." },
            { text: "Bila memakai CrewAI", why: "Salah: CrewAI justru mendukung paralel bawaan." },
            { text: "Bila overhead 0", why: "Salah: overhead 0 membuat paralel MAKSIMAL, bukan tidak membantu." },
          ],
        },
        {
          q: "Tiga agen @ $0,0171 per tugas. Berapa biaya 10.000 tugas?",
          options: [
            { text: "$513", why: "Tepat: 3 x 0,0171 = 0,0513; x 10.000 = $513.", correct: true },
            { text: "$171 — satu agen saja", why: "Salah: itu biaya 1 agen; tugas ini memakai 3 agen." },
            { text: "$1.710 — tarif dikali 100", why: "Salah: perkalian yang salah; 0,0513 x 10.000 = 513." },
            { text: "$51,30 — lupa satu nol", why: "Salah: 0,0513 x 10.000 = 513, bukan 51,30." },
          ],
        },
        {
          q: "Dua agen AG2 berdebat tanpa batas putaran. Apa risikonya?",
          options: [
            { text: "Tidak ada — debat selalu membaik", why: "Salah: debat tanpa ujung membengkakkan token kuadratik dan tagihan." },
            { text: "Loop tak terbatas + token membengkak (tiap putaran membaca seluruh riwayat)", why: "Tepat: butuh maks 3 putaran + kriteria berhenti eksplisit.", correct: true },
            { text: "Agen akan setuju terlalu cepat", why: "Salah: masalahnya kebalikan — tidak pernah berhenti." },
            { text: "Framework akan crash", why: "Salah: AG2 tidak crash; ia hanya terus berjalan dan menagih." },
          ],
        },
        {
          q: "Tugas 1-2 langkah sederhana. Framework apa?",
          options: [
            { text: "CrewAI — selalu terbaik", why: "Salah: untuk tugas sederhana, framework adalah overhead yang tidak dibayar kembali." },
            { text: "Kode polos", why: "Tepat: 1-2 langkah tidak butuh orkestrasi.", correct: true },
            { text: "AG2 — debat selalu membantu", why: "Salah: debat untuk tugas sederhana adalah pemborosan token." },
            { text: "BeeAI — protokol standar", why: "Salah: standar lintas vendor tidak relevan untuk tugas internal sederhana." },
          ],
        },
      ],
    },
  ],
};
