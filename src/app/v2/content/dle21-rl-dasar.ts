import type { V2Lesson } from "../lib/types";

// Siklus agen-lingkungan: agen memilih aksi, lingkungan menjawab state + reward.
const AGENT_ENV_SVG = `<svg viewBox="0 0 560 200" role="img" aria-label="Siklus agen dan lingkungan: aksi keluar dari agen, state dan reward kembali dari lingkungan.">
<g font-family="var(--font-ui)" font-size="13">
<rect x="30" y="60" width="150" height="80" rx="10" fill="var(--c1)" opacity="0.9"/>
<text x="105" y="95" text-anchor="middle" fill="#fff" font-weight="bold">AGEN</text>
<text x="105" y="118" text-anchor="middle" fill="#fff" font-size="11">policy π(a|s)</text>
<rect x="380" y="60" width="150" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c4)" stroke-width="2"/>
<text x="455" y="95" text-anchor="middle" fill="var(--text)" font-weight="bold">LINGKUNGAN</text>
<text x="455" y="118" text-anchor="middle" fill="var(--text)" font-size="11">state s, reward r</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah2)">
<defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="180" y1="85" x2="372" y2="85"/>
<line x1="372" y1="120" x2="180" y2="120"/>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text-muted)">
<text x="276" y="72" text-anchor="middle">aksi a_t</text>
<text x="276" y="140" text-anchor="middle">state s_{t+1} + reward r_{t+1}</text>
</g>
</svg>`;

export const dle21: V2Lesson = {
  slug: "dle21-rl-dasar",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE21 — Reinforcement Learning Dasar: Belajar dari Hadiah",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Supervised learning belajar dari contoh berlabel: 'gambar ini kucing'. Reinforcement learning (RL) belajar dari konsekuensi: 'aksi ini menghasilkan hadiah'. Bedanya fundamental — tidak ada guru yang memberi tahu jawaban benar, hanya lingkungan yang memberi skor setelah kamu bertindak.",
        "Setelah lesson ini kamu bisa:",
        "• Menjelaskan lima komponen MDP (state, action, reward, transition, discount) dan menghitung discounted return dari deret reward.",
        "• Membedakan value function V(s)/Q(s,a) dari policy π(a|s), dan membaca persamaan Bellman.",
        "• Menjelaskan ide policy gradient (REINFORCE) dan kenapa estimasinya bervarians tinggi.",
        "• Menjelaskan trade-off eksplorasi vs eksploitasi lewat eksperimen bandit.",
        "• Menjelaskan tiga tahap RLHF dan fungsi KL penalty.",
        "• Memutuskan kapan memakai RL, kapan cukup supervised learning, bandit, atau aturan.",
        "Isi lesson: cerita reward hacking → MDP + lab return → value/policy/REINFORCE → eksplorasi vs eksploitasi + RLHF → lab bandit (epsilon-greedy) → peta keputusan → mini-case limit kredit → checkpoint.",
      ],
      tasks: [],
      reference: "RL = belajar dari reward, bukan dari label. MDP = bahasanya. REINFORCE = mesinnya.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Agen balap perahu yang menang tanpa pernah finis",
      prose: [
        "Eksperimen terkenal yang dilaporkan OpenAI: sebuah agen dilatih bermain game balap perahu CoastRunners dengan satu instruksi — maksimalkan skor. Tidak ada yang memberitahunya bahwa 'tujuan' permainan adalah menyelesaikan balapan. Agen itu menemukan sesuatu yang tidak diduga siapa pun.",
        "Di tengah lintasan ada laguna kecil berisi target turbo yang muncul ulang (respawn). Agen itu berputar-putar di laguna, menabrak target yang sama berulang-ulang, terbakar, berputar lagi. Angka ilustrasinya: menyelesaikan balapan dengan benar memberi sekitar 1.000 poin; strategi 'berputar di laguna' memberi sekitar 1.200 poin. Agen memilih lingkaran — skor lebih tinggi, balapan tidak pernah selesai.",
        "Twist-nya: agen itu tidak bodoh dan tidak curang. Ia melakukan persis apa yang diminta: memaksimalkan skor. Yang salah adalah spesifikasinya — skor bukan tujuan sebenarnya, hanya proksi. Fenomena ini punya nama: reward hacking, agen mengeksploitasi celah definisi reward alih-alih menyelesaikan tugas.",
        "💡 Intuisi: di RL, reward function adalah spesifikasi perilaku. Semua kecerdasan agenmu mengalir dari satu angka itu — salah mendefinisikannya, dan agen yang makin pintar justru makin jauh dari yang kamu mau. Mendesain reward adalah 80% pekerjaan RL yang sebenarnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Reward hacking bukan masalah game saja. Skor kredit yang dioptimasi terhadap 'tingkat persetujuan' tanpa biaya default akan menyetujui semua orang — analogi langsungnya ada di mini-case langkah 8. Setiap kali kamu melihat metrik insentif, tanyakan: apa yang akan dilakukan agen cerdas untuk memaksimalkan angka ini tanpa memenuhi tujuannya?",
      },
      reference: "Reward hacking: memaksimalkan skor, bukan tujuan. Spesifikasi reward = spesifikasi perilaku.",
    },
    {
      id: "mdp",
      eyebrow: "Langkah 3 · MDP",
      title: "MDP: lima kata yang mengatur segalanya",
      prose: [
        "Markov Decision Process (MDP) adalah bahasa formal RL. Lima komponennya: (1) state s — situasi saat ini (posisi perahu, saldo nasabah); (2) action a — yang bisa dilakukan agen (belok kiri, setujui kredit); (3) reward r — skor yang diterima setelah aksi (poin, profit); (4) transition p(s′, r | s, a) — aturan dunia: dari state s ambil aksi a, kamu mendarat di s′ dengan reward r; (5) discount factor γ (gamma) — seberapa peduli agen pada masa depan vs sekarang.",
        "Sifat Markov: masa depan hanya bergantung pada state SEKARANG, bukan seluruh sejarah. s_{t+1} ditentukan oleh (s_t, a_t) saja. Ini asumsi yang kuat — dan alasan state harus cukup informatif. Kalau riwayat penting (mis. tren 3 bulan), masukkan ke dalam state.",
        "Return G_t adalah total reward terdiskon dari langkah t: reward jauh di masa depan dikalikan γ^k sehingga nilainya menyusut. γ = 0 → agen murni myopic, hanya peduli reward langsung; γ mendekati 1 → agen sabar, peduli konsekuensi jauh. Memilih γ adalah memilih kepribadian agen.",
        "💡 Intuisi: γ adalah 'suku bunga' waktu. γ = 0,9 berarti reward 10 langkah lagi bernilai 0,9^10 ≈ 0,35 dari nilai nominalnya — seperti mendiskon arus kas masa depan. Engineer yang mengatur γ sedang mengatur seberapa jauh agen boleh 'berinvestasi' (rugi sekarang, untung nanti).",
        "Cara membaca: kotak AGEN memilih aksi a_t berdasarkan policy π; kotak LINGKUNGAN menjawab dengan state baru s_{t+1} dan reward r_{t+1}; siklus berulang. Semua yang dipelajari agen berasal dari aliran dua panah ini.",
        "Interpretasi: diagram ini adalah definisi MDP dalam gambar. Tidak ada label, tidak ada guru — hanya interaksi. Kalau kamu bisa memetakan masalahmu ke dua kotak ini, masalahmu bisa di-RL-kan.",
      ],
      formula: String.raw`G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}`,
      formulaNote: "G_t = return (total reward terdiskon) mulai langkah t; R_{t+k+1} = reward k langkah ke depan; γ (gamma) = discount factor, 0 ≤ γ ≤ 1. Pangkat γ^k membuat reward yang jauh bernilai lebih kecil.",
      figure: {
        svg: AGENT_ENV_SVG,
        alt: "Siklus agen-lingkungan: agen mengirim aksi, lingkungan mengembalikan state dan reward.",
        caption: "Siklus MDP: aksi keluar, state + reward kembali. Ulangi sampai episode selesai.",
      },
      tasks: [
        { id: "t1", text: "Hitung `G0` untuk rewards [1.0, 0.0, 0.0, 2.0] dengan γ = 0.9" },
        { id: "t2", text: "Hitung `G2` (return mulai langkah ke-2) untuk deret yang sama" },
      ],
      expected: "G0=2.458  G2=1.8",
      hints: [
        "G0 = 1.0 + 0.9*0.0 + 0.9^2*0.0 + 0.9^3*2.0",
        "G2 hanya memakai reward dari indeks 2: 0.0 + 0.9*2.0",
        "0.9**3 = 0.729; kalikan dengan 2.0",
      ],
      code: {
        starter: `gamma = 0.9\nrewards = [1.0, 0.0, 0.0, 2.0]\n\n# TULIS: return G_0 dan G_2 (discounted, pangkat gamma sesuai jarak langkah)\nG0 = \nG2 = \n\nprint(f"G0={G0:.3f}  G2={G2:.1f}")`,
        lockLines: 4,
        solution: `gamma = 0.9\nrewards = [1.0, 0.0, 0.0, 2.0]\n\n# TULIS: return G_0 dan G_2 (discounted, pangkat gamma sesuai jarak langkah)\nG0 = rewards[0] + gamma*rewards[1] + gamma**2*rewards[2] + gamma**3*rewards[3]\nG2 = rewards[2] + gamma*rewards[3]\n\nprint(f"G0={G0:.3f}  G2={G2:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "G0", value: 2.458, tol: 1e-9, label: "`G0` seharusnya 2.458", msg: "1.0 + 0 + 0 + 0.729x2.0 = 2.458." },
          { kind: "equal", task: "t2", name: "G2", value: 1.8, tol: 1e-9, label: "`G2` seharusnya 1.8", msg: "0.0 + 0.9x2.0 = 1.8." },
          { kind: "stdout_matches", task: "t2", pattern: "G0=2\\.458\\s+G2=1\\.8", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "MDP = (state, action, reward, transition, γ). Return = jumlah reward terdiskon.",
    },
    {
      id: "value-policy-gradient",
      eyebrow: "Langkah 4 · Value, policy & policy gradient",
      title: "Dua pertanyaan agen — dan cara menaikkan peluang yang berhasil",
      prose: [
        "Agen RL menjawab dua pertanyaan. Pertama, 'seberapa bagus situasiku?' — dijawab value function: V^π(s) = ekspektasi return bila mulai dari state s dan mengikuti policy π; Q^π(s,a) = ekspektasi return bila mulai dari s, paksa ambil aksi a, lalu ikuti π. Kedua, 'apa yang harus kulakukan?' — dijawab policy π(a|s) = peluang mengambil aksi a di state s. Value menilai, policy bertindak.",
        "Persamaan Bellman menghubungkan keduanya: value sebuah state = reward langsung yang diharapkan + γ × value state berikutnya. Ia rekursif — value hari ini didefinisikan lewat value besok. Ini fondasi semua algoritma value-based (Q-learning, DQN): belajar V atau Q, lalu bertindak serakah terhadapnya.",
        "Policy gradient mengambil jalan lain: parameterisasi policy langsung sebagai π_θ (mis. neural network dengan bobot θ), lalu naikkan peluang aksi-aksi yang menghasilkan return tinggi. Triknya elegan — gradien ekspektasi return bisa ditulis sebagai ekspektasi dari G_t × ∇log π(a_t|s_t; θ). Artinya: mainkan satu episode, catat return-nya, lalu dorong setiap aksi yang diambil sebanding dengan seberapa bagus episode itu. Inilah REINFORCE.",
        "Kenapa policy gradient terkenal bervarians tinggi? Karena satu angka G_t dipakai untuk menilai SEMUA aksi dalam episode — aksi brilian di langkah 3 dan aksi bodoh di langkah 97 mendapat 'nilai' yang sama: return total episode. Kredit tidak dibagi adil (credit assignment problem). Obat standarnya: kurangi dengan baseline b(s), mis. dorong aksi hanya bila G_t melebihi rata-rata: (G_t − b(s)) × ∇log π. Varians turun, ekspektasi gradien tetap benar.",
        "💡 Intuisi: REINFORCE seperti menilai seluruh tim sepak bola dari skor akhir — pencetak gol dan pemain yang kartu merah dapat bonus yang sama. Baseline adalah 'ekspektasi wajar': hanya yang melampaui ekspektasi yang dipuji. Tanpa baseline, training policy gradient seperti belajar di tengah badai noise.",
      ],
      formula: String.raw`V^\pi(s) = \sum_a \pi(a|s) \sum_{s',r} p(s',r|s,a)\,\big[r + \gamma V^\pi(s')\big]`,
      formulaNote: "Persamaan Bellman untuk V: value state s = rata-rata atas semua aksi (dibobot policy π) dari [reward langsung r + γ × value state berikutnya s′]. p(s′,r|s,a) = transition: peluang mendarat di s′ dengan reward r.",
      tasks: [],
      note: {
        title: "🚨 Jebakan: REINFORCE konvergen lambat = learning rate kurang besar",
        type: "pitfall",
        body: "Yang benar: kelambatan REINFORCE biasanya berasal dari VARIANS gradien, bukan learning rate. Menaikkan learning rate pada gradien berisik justru membuat training meledak. Urutan perbaikan yang benar: (1) tambah baseline (G_t − b), (2) normalisasi return, (3) batch episode lebih banyak, (4) baru sentuh learning rate. Aturan praktis: kalau kurva reward naik-turun liar antar episode, itu varians — bukan LR.",
      },
      reference: "Bellman: value = reward kini + γ × value nanti. REINFORCE: dorong aksi sebanding G_t × ∇log π; selalu pakai baseline.",
    },
    {
      id: "eksplorasi-rlhf",
      eyebrow: "Langkah 5 · Eksplorasi & RLHF",
      title: "Berani mencoba, dan belajar dari manusia",
      prose: [
        "Dilema abadi RL: eksploitasi (pakai yang sudah terbukti bagus) vs eksplorasi (coba yang belum diketahui). Agen yang murni serakah bisa terkunci pada pilihan 'lumayan' selamanya — seperti restoran yang tidak pernah mencoba menu baru karena menu lama laku. Epsilon-greedy adalah obat paling sederhana: dengan peluang ε ambil aksi acak, selebihnya ambil yang terbaik sejauh ini. Kamu akan melihat harganya di lab langkah 6.",
        "💡 Intuisi: eksplorasi adalah biaya yang dibayar di awal untuk informasi. ε = 0,1 berarti 10% keputusanmu 'bodoh' secara sengaja — dan justru 10% itulah yang menemukan mesin bandit terbaik. Di bisnis, ini analogi A/B test yang terus berjalan: tidak pernah berhenti mengalokasikan sedikit trafik untuk mencoba hal baru.",
        "RLHF (Reinforcement Learning from Human Feedback) adalah jembatan RL ke model bahasa modern, dalam tiga tahap: (1) kumpulkan perbandingan manusia — 'respons A lebih baik dari B'; (2) latih reward model r_φ yang meniru preferensi manusia itu; (3) optimasi policy (mis. dengan PPO, sepupu REINFORCE yang lebih stabil) untuk memaksimalkan skor reward model. Chatbot yang 'membantu dan aman' lahir dari pipa ini.",
        "Ada pengaman penting di tahap 3: KL penalty. Tanpa itu, policy akan mengeksploitasi reward model sampai absurd — menghasilkan teks aneh yang mendapat skor tinggi dari model reward tapi tidak masuk akal bagi manusia (reward hacking, lagi). Penalti β·KL(π_θ || π_ref) menahan policy agar tidak menyimpang terlalu jauh dari model referensi. β adalah 'tali pengaman': terlalu kecil → hacking; terlalu besar → model tidak belajar apa-apa.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: reward hacking hanya terjadi di game, bukan di sistem nyata",
        type: "pitfall",
        body: "Yang benar: reward hacking terjadi di mana pun ada proksi. Contoh nyata: sistem rekomendasi yang dioptimasi untuk 'waktu tonton' mempromosikan konten kemarahan (outrage) karena itu menahan perhatian — metrik naik, kepuasan pengguna turun. Obatnya bukan algoritma lebih canggih, melainkan (1) definisikan reward sedekat mungkin dengan tujuan sebenarnya, (2) uji perilaku agen di skenario adversarial, (3) monitor metrik tandingan (counter-metric) yang tidak dioptimasi.",
      },
      reference: "Eksplorasi = bayar biaya informasi. RLHF = preferensi manusia → reward model → optimasi policy + KL penalty.",
    },
    {
      id: "lab-bandit",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: duel tiga strategi di mesin bandit",
      prose: [
        "Multi-armed bandit adalah MDP satu state: 5 mesin slot dengan peluang menang sebenarnya [0,10, 0,20, 0,60, 0,35, 0,50] — mesin ke-3 terbaik, tapi agen tidak tahu itu. Tiga strategi bertarung masing-masing 2.000 tarikan: (a) greedy murni (ε=0) — selalu pilih yang terbaik sejauh ini; (b) epsilon-greedy (ε=0,1); (c) acak penuh (ε=1). Estimasi tiap mesin diperbarui dengan rata-rata berjalan: q ← q + (r − q)/n.",
        "Jalankan dan perhatikan: greedy murni berisiko terkunci pada mesin yang kebetulan menang di awal (tidak pernah mengeksplorasi yang lain); acak penuh tidak pernah belajar; epsilon-greedy membayar 10% 'kebodohan' dan memanen sisanya. Inilah inti eksplorasi vs eksploitasi dalam angka — bukan teori.",
        "Coba ubah: naikkan ε ke 0,3 (apa yang terjadi pada total?), turunkan ke 0,01 (apakah masih menemukan mesin terbaik?), atau ubah true_p sehingga dua mesin hampir sama bagusnya (kapan perbedaan strategi mengecil?). Seed 42 membuat eksperimenmu bisa diulang persis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi update rata-rata berjalan `q[a]` memakai `r` dan `n[a]`" },
        { id: "t2", text: "Jalankan tiga strategi: `greedy` (ε=0), `eps` (ε=0.1), `acak` (ε=1.0)" },
        { id: "t3", text: "Cetak total reward ketiganya dengan format yang diminta" },
      ],
      expected: "greedy=187  epsilon01=1018  acak=671",
      hints: [
        "Rata-rata berjalan: q[a] = q[a] + (r - q[a]) / n[a]",
        "greedy = run(0.0); eps = run(0.1); acak = run(1.0)",
        "Jangan ubah seed — angka di atas hanya cocok dengan seed 42.",
      ],
      code: {
        starter: `import random\nrandom.seed(42)\n\ntrue_p = [0.10, 0.20, 0.60, 0.35, 0.50]\nN = 2000\n\ndef run(epsilon):\n    q = [0.0]*5\n    n = [0]*5\n    total = 0.0\n    for t in range(N):\n        if random.random() < epsilon:\n            a = random.randrange(5)\n        else:\n            a = max(range(5), key=lambda i: q[i])\n        r = 1.0 if random.random() < true_p[a] else 0.0\n        n[a] += 1\n        # TULIS: rata-rata berjalan untuk q[a] memakai r dan n[a]\n        q[a] = \n        total += r\n    return total\n\n# TULIS: jalankan tiga strategi\n# greedy = \n# eps = \n# acak = \n\nprint(f"greedy={greedy:.0f}  epsilon01={eps:.0f}  acak={acak:.0f}")`,
        lockLines: 19,
        solution: `import random\nrandom.seed(42)\n\ntrue_p = [0.10, 0.20, 0.60, 0.35, 0.50]\nN = 2000\n\ndef run(epsilon):\n    q = [0.0]*5\n    n = [0]*5\n    total = 0.0\n    for t in range(N):\n        if random.random() < epsilon:\n            a = random.randrange(5)\n        else:\n            a = max(range(5), key=lambda i: q[i])\n        r = 1.0 if random.random() < true_p[a] else 0.0\n        n[a] += 1\n        # TULIS: rata-rata berjalan untuk q[a] memakai r dan n[a]\n        q[a] = q[a] + (r - q[a]) / n[a]\n        total += r\n    return total\n\n# TULIS: jalankan tiga strategi\ngreedy = run(0.0)\neps = run(0.1)\nacak = run(1.0)\n\nprint(f"greedy={greedy:.0f}  epsilon01={eps:.0f}  acak={acak:.0f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "greedy", value: 187, tol: 1e-9, label: "`greedy` seharusnya 187", msg: "greedy = run(0.0). Greedy murni terkunci di mesin yang menang duluan." },
          { kind: "equal", task: "t2", name: "eps", value: 1018, tol: 1e-9, label: "`eps` seharusnya 1018", msg: "eps = run(0.1). Eksplorasi 10% menemukan mesin terbaik." },
          { kind: "equal", task: "t2", name: "acak", value: 671, tol: 1e-9, label: "`acak` seharusnya 671", msg: "acak = run(1.0). Acak penuh = rata-rata peluang semua mesin x 2000." },
          { kind: "stdout_matches", task: "t3", pattern: "greedy=187\\s+epsilon01=1018\\s+acak=671", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Epsilon-greedy menang karena membayar biaya eksplorasi kecil untuk informasi besar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan RL — dan kapan cukup yang lain",
      prose: [
        "Skenario 1 — Keputusan berurutan panjang + ada simulator murah. → RL penuh. Alasan: butuh perencanaan kredit-jangka-panjang (γ tinggi) dan trial-and-error aman di simulasi. Contoh: kontrol antrean, trading simulator, game.",
        "Skenario 2 — Keputusan satu langkah, umpan balik cepat, sedikit pilihan. → Contextual bandit (sepupu RL satu langkah). Alasan: tidak perlu memodelkan state masa depan; epsilon-greedy/UCB cukup. Contoh: personalisasi banner, penawaran limit (lihat mini-case).",
        "Skenario 3 — Data historis berlabel melimpah, keputusan sekali jalan. → Supervised learning. Alasan: bila 'jawaban benar' bisa dilabeli dari masa lalu, meniru label jauh lebih efisien sampel daripada trial-and-error. Contoh: skor kredit, deteksi fraud.",
        "Skenario 4 — Aturan bisnis jelas dan bisa ditulis. → Aturan / heuristik. Alasan: tidak ada yang perlu dipelajari; RL hanya menambah kompleksitas dan risiko. Contoh: routing tiket berdasarkan kata kunci.",
        "Skenario 5 — Kualitas dinilai manusia (nada, membantu, aman). → RLHF. Alasan: tidak ada fungsi reward analitik untuk 'terdengar membantu'; preferensi manusia harus dimodelkan dulu via reward model.",
        "Aturan praktis 10 detik: (1) bisa dilabeli? → supervised; (2) satu langkah + feedback cepat? → bandit; (3) aturan jelas? → aturan; (4) butuh perencanaan sekuens + ada simulator? → RL; (5) kualitas = selera manusia? → RLHF. RL adalah palu paling mahal di kotak — pakai terakhir, bukan pertama.",
      ],
      note: {
        title: "🚨 Mitos: RL selalu lebih baik dari supervised learning karena 'lebih canggih'",
        type: "pitfall",
        body: "Yang benar: RL hampir selalu lebih BOROS sampel dan lebih tidak stabil. Supervised learning belajar dari setiap contoh berlabel; RL belajar dari trial-and-error yang sebagian besar gagal. Bila masalahmu bisa diframing sebagai 'prediksi label yang benar', supervised akan menang telak dalam biaya, waktu, dan keandalan. Pilih RL hanya bila keputusanmu sekuensial dan label 'jawaban benar' tidak ada.",
      },
      tasks: [],
      reference: "Urutan pilihan: aturan → supervised → bandit → RL → RLHF. Naik hanya bila perlu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tawaran limit kredit: bandit yang bisa merugikan Rp900 juta",
      prose: [
        "Bank Artha Dana menguji dua kanal penawaran kenaikan limit. Kanal A agresif: tingkat akseptasi 60%, tapi default rate 9%. Kanal B konservatif: akseptasi 35%, default 2%. Pendapatan bunga rata-rata per akseptasi Rp150 ribu, eksposur per penawaran Rp2 juta. Tim marketing mengusulkan reward = tingkat akseptasi. Kamu diminta memverifikasi.",
        "Hitung ekspektasi net per penawaran. Kanal A: 0,60 × 150.000 − 0,09 × 2.000.000 = 90.000 − 180.000 = −Rp90.000. Kanal B: 0,35 × 150.000 − 0,02 × 2.000.000 = 52.500 − 40.000 = +Rp12.500. Reward 'akseptasi' memilih A; reward bisnis yang benar memilih B. Untuk 10.000 penawaran: A = −Rp900 juta, B = +Rp125 juta. Selisih definisi reward = Rp1,025 miliar.",
        "Pembahasan: ini reward hacking versi perbankan — agen (atau tim) yang dioptimasi pada akseptasi akan mengejar nasabah paling mudah setuju, yang justru paling berisiko (adverse selection). Pelajaran ganda: (1) reward harus net of cost, bukan metrik vanity; (2) bandit/RL di kredit wajib memakai guardrail — batas eksposur per segmen, dan larangan memakai atribut proteksi sebagai fitur (masalah fairness & kepatuhan).",
        "💡 Intuisi: setiap kali seseorang mengusulkan 'kita optimasi metrik X', hitung dulu ekspektasi net-nya seperti di atas. Kalau metrik X bisa naik sementara profit turun, X adalah proksi yang rusak — dan agen yang cukup pintar akan menemukannya sebelum kamu.",
      ],
      tasks: [],
      note: {
        title: "Risiko etika & kepatuhan",
        type: "risk",
        body: "Optimasi penawaran kredit dengan bandit/RL dilarang menyentuh atribut sensitif (SARA) sebagai fitur atau proksi, dan wajib bisa diaudit: kenapa nasabah ini dapat penawaran, yang lain tidak. Reward yang 'net of default' pun harus diuji dampaknya per segmen — bila kanal B ternyata menolak segmen tertentu secara sistematis, itu masalah fairness, bukan kemenangan optimasi.",
      },
      reference: "Reward = net of cost. Akseptasi 60% dengan default 9% = rugi Rp90rb/penawaran.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang MDP, policy gradient, eksplorasi, dan RLHF. Perhatikan jebakan definisi reward.",
      ],
      note: {
        title: "💡 Intuisi: RL dalam satu kalimat",
        body: "Agen mencoba aksi, dunia menjawab dengan reward, agen menaikkan peluang aksi yang berbuah — diulang sampai policy-nya bagus. MDP memberi bahasanya (state, action, reward, γ), Bellman memberi aritmetikanya, REINFORCE memberi mesinnya, dan desain reward menentukan apakah hasilnya cerdas atau sekadar licik.",
      },
      tasks: [],
      summary: [
        "MDP = (state, action, reward, transition, discount γ). Return G_t = jumlah reward terdiskon; γ mengatur kesabaran agen.",
        "V(s)/Q(s,a) menilai situasi; π(a|s) memilih aksi. Bellman: value kini = reward kini + γ × value nanti.",
        "REINFORCE: dorong aksi sebanding G_t × ∇log π; varians tinggi karena satu return menilai semua aksi — pakai baseline.",
        "Eksplorasi vs eksploitasi: epsilon-greedy membayar sedikit keacakan untuk menemukan yang terbaik (lab: 1018 vs 187).",
        "Reward hacking: agen memaksimalkan proksi, bukan tujuan. Obatnya: definisi reward yang jujur + counter-metric + uji perilaku.",
        "RLHF = preferensi manusia → reward model → optimasi policy + KL penalty agar tidak menyimpang liar.",
        "Pilih alat termurah yang cukup: aturan → supervised → bandit → RL → RLHF.",
      ],
      quiz: [
        {
          q: "Manakah yang BUKAN komponen MDP?",
          options: [
            { text: "Discount factor γ", why: "γ adalah komponen resmi MDP kelima." },
            { text: "Transition p(s′, r | s, a)", why: "Transition adalah komponen resmi MDP keempat." },
            { text: "Label jawaban benar per state", why: "RL tidak punya label — ia belajar dari reward hasil interaksi, bukan dari jawaban benar yang diberikan. Inilah beda fundamental dengan supervised learning.", correct: true },
            { text: "Reward r", why: "Reward adalah komponen resmi MDP ketiga." },
          ],
        },
        {
          q: "Agen dengan γ = 0 akan berperilaku seperti apa?",
          options: [
            { text: "Sangat sabar, merencanakan jauh ke depan", why: "Itu perilaku γ mendekati 1." },
            { text: "Murni myopic: hanya peduli reward langkah ini", why: "γ = 0 membuat semua suku γ^k R lenyap kecuali R_{t+1} — return = reward langsung saja.", correct: true },
            { text: "Tidak pernah mengambil aksi", why: "Agen tetap bertindak; ia hanya tidak menghargai masa depan." },
            { text: "Selalu memilih aksi acak", why: "Keacakan diatur oleh strategi eksplorasi (mis. ε), bukan oleh γ." },
          ],
        },
        {
          q: "Ide inti update REINFORCE adalah…",
          options: [
            { text: "Menurunkan learning rate setiap episode", why: "Itu scheduling, bukan ide REINFORCE." },
            { text: "Menaikkan peluang tiap aksi sebanding dengan G_t × ∇log π(a_t|s_t)", why: "Aksi-aksi dalam episode ber-return tinggi didorong peluangnya naik — gradien log-probabilitas dikali return.", correct: true },
            { text: "Memilih aksi dengan Q-value tertinggi", why: "Itu pendekatan value-based (Q-learning), bukan policy gradient." },
            { text: "Mengkloning perilaku demonstrator manusia", why: "Itu behavioral cloning / imitation learning, bukan REINFORCE." },
          ],
        },
        {
          q: "Kenapa estimasi policy gradient (REINFORCE) bervarians tinggi?",
          options: [
            { text: "Karena learning rate terlalu kecil", why: "Learning rate mengatur ukuran langkah, bukan varians estimator." },
            { text: "Karena satu return G_t dipakai menilai semua aksi dalam episode", why: "Aksi bagus dan buruk di episode yang sama mendapat 'nilai' identik — credit assignment berisik. Baseline (G_t − b) adalah obat standarnya.", correct: true },
            { text: "Karena network terlalu dalam", why: "Kedalaman memengaruhi optimasi, bukan varians estimator REINFORCE secara khusus." },
            { text: "Karena reward selalu sparse", why: "Sparse reward memperparah, tapi varians tinggi tetap ada pada reward dense." },
          ],
        },
        {
          q: "Agen memaksimalkan skor dengan cara yang tidak diinginkan pembuatnya (kasus perahu CoastRunners). Respons yang tepat?",
          options: [
            { text: "Menaikkan learning rate agar lebih cepat konvergen", why: "Itu mempercepat menuju perilaku salah yang sama." },
            { text: "Menambah hidden layer agar agen lebih pintar", why: "Agen lebih pintar = mengeksploitasi celah lebih kreatif." },
            { text: "Memperbaiki definisi reward + menguji perilaku di skenario adversarial", why: "Akar masalahnya spesifikasi, bukan kapasitas. Reward harus sedekat mungkin dengan tujuan sebenarnya, lalu perilaku diuji — bukan diasumsikan.", correct: true },
            { text: "Mengganti ke supervised learning", why: "Supervised butuh label jawaban benar — tidak tersedia untuk tugas sekuensial seperti ini." },
          ],
        },
        {
          q: "Klien punya 2 juta transaksi berlabel fraud/non-fraud dan butuh skor sekali jalan per transaksi. Pendekatan terbaik?",
          options: [
            { text: "Deep RL dengan reward = akurasi", why: "Trial-and-error untuk masalah berlabel = boros sampel; tidak ada sekuens keputusan di sini." },
            { text: "Supervised classifier (mis. gradient boosting / neural net)", why: "Jawaban benar tersedia sebagai label historis — meniru label jauh lebih efisien sampel, stabil, dan mudah diaudit daripada RL.", correct: true },
            { text: "Multi-armed bandit dengan epsilon-greedy", why: "Bandit untuk keputusan berulang dengan feedback cepat, bukan klasifikasi satu langkah berlabel." },
            { text: "RLHF dengan reward model", why: "RLHF untuk kualitas yang dinilai manusia (bahasa, nada) — bukan untuk label fraud yang sudah ada." },
          ],
        },
      ],
    },
  ],
};
