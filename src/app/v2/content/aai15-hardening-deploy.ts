import type { V2Lesson } from "../lib/types";

// Ketersediaan vs jumlah retry: 75% -> 99,6% (dengan backoff).
const FIG_HARD = `<svg viewBox="0 0 480 250" role="img" aria-label="Ketersediaan naik dari 75 persen ke 99,6 persen dengan retry.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="205" x2="460" y2="205"/><line x1="44" y1="145" x2="460" y2="145"/><line x1="44" y1="85" x2="460" y2="85"/><line x1="44" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="205">75%</text><text x="38" y="145">85%</text><text x="38" y="85">95%</text><text x="38" y="55">100%</text></g>
<polyline points="80,205 180,92.5 280,64.4 380,57.3" fill="none" stroke="var(--c1)" stroke-width="3"/>
<g fill="var(--c1)"><circle cx="80" cy="205" r="5"/><circle cx="180" cy="92.5" r="5"/><circle cx="280" cy="64.4" r="5"/><circle cx="380" cy="57.3" r="5"/></g>
<g fill="var(--text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="80" y="225">0 retry</text><text x="180" y="225">1x</text><text x="280" y="225">2x</text><text x="380" y="225">3x</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="80" y="195">75%</text><text x="180" y="102.5">93,8%</text><text x="280" y="54.4">98,4%</text><text x="380" y="47.3">99,6%</text></g>
<text x="240" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">kegagalan transient 25%: retry mengubah nasib</text>
</svg>`;

export const aai15: V2Lesson = {
  slug: "aai15-hardening-deploy",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI15 — Hardening & Deploy Agen ke Produksi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-rani",
      eyebrow: "Langkah 1 · Cerita",
      title: "Retry yang menggandakan masalah: debit ganda Rp200 juta",
      prose: [
        "Agen Rani lolos semua tes: 50 skenario demo, 100 persen berhasil. Minggu pertama produksi: 73 persen. Bukan karena modelnya — karena DUNIA NYATA: API timeout di jam sibuk, tool mengembalikan format aneh sekali-sekali, satu vendor mengubah respons tanpa pemberitahuan. Demo menguji jalan yang mulus; produksi adalah jalan berlubang.",
        "Insiden terburuk: tool pembayaran timeout setelah mendebit tetapi sebelum konfirmasi. Agen me-retry — mendebit DUA KALI. Nasabah marah, tim panik, rollback 4 jam. Root cause: retry tanpa idempotency. Pelajaran Rp200 juta: di produksi, 'coba lagi' tanpa 'pastikan sekali' = mesin pengganda masalah.",
        "Twist-nya: jarak demo→produksi bukan soal kecerdasan, melainkan soal KETAHANAN: retry, idempotency, timeout, checkpointing, circuit breaker. Inilah 'hardening' — dan ini adalah skill yang membedakan AgentOps profesional dari pembuat demo. Lesson ini = checklist produksi lengkap.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan 5 pola failure recovery; (2) mengimplementasikan retry dengan exponential backoff; (3) menjelaskan idempotency dan mengapa retry membutuhkannya; (4) merancang circuit breaker; (5) menyusun checklist deploy + kontrol biaya produksi; (6) merancang evals yang jujur (golden set, LLM-as-judge, red-team).",
        "🗺️ Isi lesson: Langkah 1 · Cerita Rani — Langkah 2 · Lima pola ketahanan — Langkah 3 · Lab: retry & circuit breaker — Langkah 4 · Deploy & kontrol biaya — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Langkah 7 · Evals — Checkpoint.",
      ],
      tasks: [],
      reference: "Demo menguji jalan mulus; produksi adalah jalan berlubang. Hardening = ban serep, bukan mesin baru.",
    },
    {
      id: "konsep-pola",
      eyebrow: "Langkah 2 · Lima pola ketahanan",
      title: "Retry, idempotency, timeout, checkpoint, circuit breaker",
      prose: [
        "Pola 1 — retry dengan exponential backoff: kegagalan transient (timeout sesekali, rate limit) sembuh sendiri jika ditunggu. Backoff eksponensial (tunggu 1s, 2s, 4s) memberi sistem yang sakit waktu pulih — retry agresif tiap 100ms justru MEMBUNUH sistem yang sedang sesak (retry storm). Rumus: peluang sukses setelah n retry = 1 − p^(n+1), dengan p = peluang gagal per percobaan.",
        "Pola 2 — idempotency: retry AMAN hanya jika pengulangan tidak menggandakan efek. Kunci idempotency: tiap aksi bawa ID unik; server menolak ID yang sudah diproses. Tanpa ini, retry pembayaran = debit ganda (kasus Rani!). Aturan keras: JANGAN retry aksi non-idempoten tanpa kunci — lebih baik gagal eksplisit daripada ganda diam-diam.",
        "Pola 3 — timeout: belas kasihan untuk antrean. Tanpa timeout, 1 request macet menahan worker selamanya. Set timeout = p99 latensi normal × 2. Terlalu pendek membunuh yang sehat; terlalu panjang = mati pelan-pelan.",
        "Pola 4 — checkpointing: untuk agen multi-langkah yang lama, simpan progres tiap tahap. Gagal di langkah 7 dari 10? Lanjut dari checkpoint 6, bukan dari 0. Tanpa checkpoint: 1 kegagalan transient = ulangi 10 langkah = 10x biaya + 10x waktu. LangGraph punya ini bawaan — pakai, jangan bangun sendiri.",
        "Pola 5 — circuit breaker: jika 5 panggilan beruntun gagal, BERHENTI mencoba selama 30 detik (buka sirkuit) — tolak cepat alih-alih antre menunggu yang pasti gagal. Melindungi sistem yang sakit dari beban tambahan DAN melindungi pengguna dari menunggu sia-sia. Setelah jeda, coba 1 (half-open): sukses → tutup lagi, gagal → buka lagi.",
        "Kepribadian hardening: seperti sopir reli — bukan yang tercepat di jalan mulus, melainkan yang tetap sampai finis saat badai. Lima pola ini = sabuk pengaman, airbag, dan ban serep. Tidak glamor, menyelamatkan nyawa (dan karier).",
      ],
      formula: String.raw`P_{\text{sukses}}(n) = 1 - p^{\,n+1} \qquad w_k = w_0 \times 2^{k}`,
      formulaNote: "P_sukses = peluang berhasil dengan n retry (n+1 total percobaan); p = peluang gagal per percobaan (asumsi independen). w_k = jeda sebelum retry ke-k; w_0 = jeda awal. Contoh: p=0,25, n=3 → 1−0,25⁴ = 99,6% (cocok dengan lab!).",
      figure: {
        svg: FIG_HARD,
        alt: "Ketersediaan naik dari 75 persen ke 99,6 persen dengan retry.",
        caption: "Efek retry pada kegagalan transient 25%: 75% → 93,8% → 98,4% → 99,6% (rumus 1−p^(n+1), p=0,25).",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Retry selalu membantu.' Salah — retry membantu HANYA untuk kegagalan transient (timeout, rate limit) DAN aksi idempoten. Untuk kegagalan permanen (argumen salah, data tidak ada), retry = membuang 4x biaya untuk hasil yang sama. Untuk aksi non-idempoten (bayar, kirim), retry = menggandakan. Klasifikasikan dulu: transient atau permanen? idempoten atau tidak? Baru putuskan.",
      },
      reference: "Transient + idempoten = retry. Selain itu = pikir dulu.",
    },
    {
      id: "lab-retry",
      eyebrow: "Langkah 3 · Lab retry",
      title: "Lab: dari 75% ke 99,6% + circuit breaker",
      prose: [
        "Tool flaky gagal 2x lalu sukses. Implementasikan call_with_retry dengan exponential backoff: coba, gagal → tunggu base×2^k → coba lagi. Hitung attempts yang dibutuhkan. Lalu simulasikan circuit breaker: 5 gagal beruntun → buka sirkuit → tolak cepat tanpa memanggil tool.",
        "Coba ubah: naikkan fail_times ke 5 dengan max_retries=3 — lihat retry MENYERAH (exception) alih-alih berbohong sukses. Retry yang baik tahu kapan berhenti: menyerah eksplisit > gagal diam-diam.",
        "Cara membaca: attempts=3 untuk 2 kegagalan = 1 sukses + 2 retry. Interpretasi: inilah 99,6% dari rumus — lab membuktikan teori.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `call_with_retry` dengan exponential backoff, kembalikan (hasil, attempts)" },
        { id: "t2", text: "Implementasikan simulasi circuit breaker: 5 gagal → open → tolak cepat; `print` hasilnya" },
      ],
      expected: "retry hasil: OK attempts: 3 | circuit: 5x gagal lalu 2x ditolak-cepat, tool_calls: 5",
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan tool_calls=5 pada circuit breaker: 2 'ditolak-cepat' TIDAK memanggil tool sama sekali. Itulah gunanya — saat sistem downstream sakit, jangan tambah bebannya dengan panggilan yang pasti gagal. Menolak cepat = belas kasihan dua arah.",
      },
      hints: [
        "loop range(max_retries+1): try fn() -> return (hasil, attempts); except TimeoutError: tunggu base_delay*(2**i)",
        "jika i == max_retries: raise (menyerah eksplisit)",
        "circuit: state 'closed' -> 5 gagal beruntun -> 'open' -> 'ditolak-cepat' tanpa panggil tool",
      ],
      code: {
        starter: `# SEED — jangan ubah
import time
class FlakyTool:
    def __init__(self, fail_times):
        self.fail_times = fail_times
        self.calls = 0
    def __call__(self):
        self.calls += 1
        if self.calls <= self.fail_times:
            raise TimeoutError("tool timeout")
        return "OK"

# TULIS KODEMU
def call_with_retry(fn, max_retries=3, base_delay=0.01):
    # TODO t1: loop, try/except TimeoutError, backoff base_delay*(2**i)
    # kembalikan (hasil, attempts); raise jika habis
    return None, 0

def circuit_breaker_demo():
    # TODO t2: 7 percobaan ke tool yang selalu gagal;
    # 5 gagal beruntun -> state open -> "ditolak-cepat" tanpa memanggil
    # kembalikan (results_list, tool.calls)
    return [], 0

# UJI (jangan ubah)
r1, a1 = call_with_retry(FlakyTool(fail_times=2), max_retries=3)
print("retry hasil:", r1, "attempts:", a1)
r2, calls = circuit_breaker_demo()
print("circuit:", r2)
print("tool_calls:", calls)`,
        lockLines: 13,
        solution: `# SEED — jangan ubah
import time
class FlakyTool:
    def __init__(self, fail_times):
        self.fail_times = fail_times
        self.calls = 0
    def __call__(self):
        self.calls += 1
        if self.calls <= self.fail_times:
            raise TimeoutError("tool timeout")
        return "OK"

# TULIS KODEMU
def call_with_retry(fn, max_retries=3, base_delay=0.01):
    attempts = 0
    for i in range(max_retries + 1):
        attempts += 1
        try:
            return fn(), attempts
        except TimeoutError:
            if i == max_retries:
                raise
            time.sleep(base_delay * (2 ** i))
    return None, attempts

def circuit_breaker_demo():
    state, fails = "closed", 0
    results = []
    tool = FlakyTool(fail_times=10)
    for _ in range(7):
        if state == "open":
            results.append("ditolak-cepat")
            continue
        try:
            out, _ = call_with_retry(tool, max_retries=0)
            results.append(out); fails = 0
        except TimeoutError:
            fails += 1
            results.append("gagal")
            if fails >= 5:
                state = "open"
    return results, tool.calls

# UJI (jangan ubah)
r1, a1 = call_with_retry(FlakyTool(fail_times=2), max_retries=3)
print("retry hasil:", r1, "attempts:", a1)
r2, calls = circuit_breaker_demo()
print("circuit:", r2)
print("tool_calls:", calls)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "retry hasil:\\s*OK\\s+attempts:\\s*3", label: "Retry sukses di percobaan ke-3", msg: "2 gagal + 1 sukses = 3 attempts." },
          { kind: "stdout_matches", task: "t2", pattern: "ditolak-cepat', 'ditolak-cepat", label: "Circuit terbuka setelah 5 gagal", msg: "2 terakhir ditolak tanpa memanggil tool." },
          { kind: "stdout_matches", task: "t2", pattern: "tool_calls:\\s*5", label: "Tool hanya dipanggil 5x", msg: "Ditolak-cepat tidak menambah panggilan." },
        ],
      },
      reference: "Retry untuk transient, circuit breaker untuk melindungi yang sakit, menyerah eksplisit bila habis.",
    },
    {
      id: "konsep-deploy",
      eyebrow: "Langkah 4 · Deploy & biaya",
      title: "Checklist deploy + kontrol biaya produksi",
      prose: [
        "Checklist deploy agen (7 item): (1) idempotency key untuk semua aksi tulis; (2) timeout + retry + circuit breaker terkonfigurasi; (3) checkpointing aktif untuk alur >3 langkah; (4) rate limit per user (agen loop bisa jadi infinite); (5) kill switch — tombol matikan agen seketika; (6) audit log semua tool call; (7) rollback plan (kembali ke versi sebelumnya <5 menit). Tanpa satu pun = belum produksi.",
        "Kontrol biaya: agen loop = biaya tak terbatas secara teori. Tiga rem: budget per sesi (misal maks 50 tool call atau Rp5.000/sesi — hentikan dengan pesan jujur), budget per user per hari, dan alert (Slack jika biaya/jam > 2x normal). Insiden ilustratif (bukan laporan resmi): agen customer service loop 14 jam karena bug, tagihan $12.000 semalam. Satu baris budget check mencegahnya.",
        "Opsi deploy: LangGraph Platform (managed, tercepat untuk LangGraph), Docker + VPS (kontrol penuh, murah), serverless (cocok untuk agen sporadis, waspada cold start untuk sesi panjang). Pilih berdasarkan: tim kecil + cepat → managed; butuh kontrol/audit → Docker; trafik tidak menentu → serverless.",
        "Kepribadian deploy: seperti meluncurkan kapal — checklist sebelum berlayar, sekoci (rollback) siap, dan radio (monitoring) menyala. Kapal terbaik pun tenggelam tanpa sekoci.",
        "Game day — latihan insiden. Netflix mempopulerkan Chaos Monkey; untuk agen: matikan 1 tool sengaja tiap kuartal, lihat apakah circuit breaker + fallback bekerja. Yang tidak pernah latihan = panik saat asli. Jadwalkan 2 jam/kuartal — murah dibanding insiden Rp300 juta.",
      ],
      formula: String.raw`C_{\text{sesi}} = \sum_{i=1}^{k} (t^{\text{in}}_i + t^{\text{out}}_i) \times c \le B_{\text{maks}}`,
      formulaNote: "C_sesi = biaya satu sesi; k = jumlah langkah; t_in/t_out = token masuk/keluar per langkah; c = harga per token; B_maks = budget yang dienforce. Jika proyeksi melebihi B_maks → hentikan elegan. Tanpa enforce, k bisa tak terbatas.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Kill switch dan budget check terasa 'pesimis' — sampai insiden pertama. Tim yang pernah membayar $12.000 semalam (skenario ilustratif) tidak pernah lagi deploy tanpa keduanya. Hardening = kebijaksanaan yang dibeli dengan pengalaman (atau dengan lesson ini — lebih murah).",
      },
      reference: "7 checklist + 3 rem biaya + kill switch. Deploy = berani karena bisa mundur.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: pola apa untuk kegagalan apa?",
      prose: [
        "Skenario 1 — API timeout sesekali (transient, idempoten) → retry 3x + backoff. Kasus lab: 75% → 99,6%.",
        "Skenario 2 — pembayaran/debit (non-idempoten) → idempotency key DULU, baru retry. Tanpa kunci: jangan retry otomatis — eskalasi ke manusia.",
        "Skenario 3 — vendor down total (5 gagal beruntun) → circuit breaker + fallback (model lain / cache / pesan jujur). Jangan antre menunggu yang mati.",
        "Skenario 4 — agen 10 langkah, gagal di langkah 8 → checkpointing: lanjut dari 7. Tanpa: ulangi 8 langkah = 8x biaya.",
        "Skenario 5 — biaya meledak (loop bug) → budget per sesi + kill switch + alert. Pencegahan > pemadaman.",
        "Aturan praktis 10 detik: (1) transient? retry. (2) non-idempoten? kunci dulu. (3) down total? breaker. (4) panjang? checkpoint. (5) mahal? budget. Lima pertanyaan, lima pola.",
        "Skenario 6 — multi-region/vendored: jika 1 region cloud down, alihkan traffic (DNS failover). Agen stateful (memory!) = failover lebih sulit dari stateless — checkpoint ke storage bersama DULU sebelum multi-region. Urutan: stateless → checkpoint → multi-region.",
      ],
      tasks: [],
    },
    {
      id: "minicase-rani",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: debit ganda Rp200 juta pelajaran",
      prose: [
        "Insiden Rani: 1.000 pembayaran/hari, 2% timeout transient (20/hari). Tanpa retry: 20 gagal/hari × Rp50 ribu biaya CS manual = Rp1 juta/hari + 20 nasabah kecewa. Dengan retry 3x, peluang satu pembayaran gagal total = 0,02⁴ = 1,6×10⁻⁷ — sukses 99,99998%, praktis 100%: ekspektasi gagal ≈ 20 × 0,02³ ≈ 0,00016/hari ≈ 1 per 17 tahun. (Angka 99,96% adalah untuk SATU retry saja: 1−0,02².) Biaya retry: tiap timeout memicu rata-rata 1 + 0,02 + 0,0004 ≈ 1,02 percobaan — 20 timeout/hari × 1,02 × Rp200 ≈ Rp4.080/hari TOTAL percobaan pada pembayaran yang timeout. Tetapi Rp200 pertama per timeout tetap dibayar TANPA retry — biaya MARGINAL retry-nya hanya 20 × 0,0204 × Rp200 ≈ Rp82/hari. ROI: Rp1 juta/hari biaya CS manual → ~Rp82/hari marginal + kepuasan.",
        "Tetapi: tanpa idempotency key, 0,1% retry 'sukses ganda' = 0,02 debit ganda/hari ≈ 7/tahun × Rp5 juta = Rp35 juta/tahun + reputasi. Dengan kunci: 0. Biaya implementasi kunci: 3 hari dev = Rp15 juta sekali. Break-even: <6 bulan. Pelajaran: retry tanpa idempotency = diskon hari ini, denda tahun depan.",
        "Pembahasan: perhatikan asimetri — kegagalan retry (~Rp4 ribu/hari) vs kegagalan idempotency (Rp35 juta/tahun + reputasi). Tim sering mengoptimasi yang murah (tambah retry) sambil mengabaikan yang mahal (kunci). Prioritaskan berdasarkan D (kerusakan), bukan P (frekuensi).",
        "Cara membaca: hitung DULU biaya kegagalan per jenis, BARU pilih pola. Urutan yang benar: (1) daftar kegagalan, (2) harga tiap kegagalan, (3) pola termurah yang menutup yang termahal.",
        "Interpretasi: hardening adalah manajemen risiko dengan kode. Lima pola = lima polis asuransi; premi = waktu implementasi; klaim = insiden yang tidak terjadi.",
      ],
      tasks: [],
    },
    {
      id: "konsep-eval",
      eyebrow: "Langkah 7 · Evals",
      title: "Evals yang jujur: golden set, LLM-as-judge & red-team",
      prose: [
        "Golden set adalah tanah tempat evals berpijak — dan kualitasnya menentukan segalanya. Prinsip desain: (1) REPRESENTATIF: sampel dari traffic produksi nyata (bukan yang kamu karang di IDE) — stratifikasi per intent; (2) ADVERSARIAL: 15–20% kasus sengaja sulit — prompt ambigu, ejaan salah, permintaan di batas kebijakan; (3) REGRESI: tiap bug produksi yang pernah lolos menjadi kasus abadi — bug yang sama tidak boleh lolos dua kali. Ukuran: n ≥ 200 untuk margin ±7% pada CI 95% (lihat rumus di bawah); n ≥ 1.000 bila keputusan deploy bernilai besar. Contoh: agen CS bank, 300 kasus: 200 representatif, 60 adversarial, 40 regresi dari 12 insiden lampau. Yang sering dilupakan: FROZEN — golden set di-versioning; mengubah soal agar model lulus adalah curang terhadap diri sendiri. Bila distribusi produksi bergeser, buat golden set v2 — jangan edit v1.",
        "LLM-as-judge: memakai model kuat untuk menilai output agen pada skala 1–5 dengan rubrik. Murah dan cepat — dan penuh jebakan. Jebakan 1: VERBOSITY bias — judge memberi skor lebih tinggi pada jawaban panjang; mitigasi: rubrik eksplisit bahwa keringkasan dinilai, atau normalisasi panjang. Jebakan 2: SELF-preference — judge memfavoritkan gaya model sekeluarganya; mitigasi: judge dari keluarga berbeda dengan generator, atau blind terhadap sumber. Jebakan 3: POSITION bias — pada perbandingan A/B, judge cenderung memilih yang disebut pertama; mitigasi: acak urutan, ambil mayoritas dua arah. Jebakan 4: judge tidak bisa menilai yang tidak ia kuasai — jangan pakai judge untuk domain yang ia lemah tanpa spot-check manusia. Protokol senior: judge untuk SKALA (ribuan kasus), manusia untuk KEBENARAN (spot-check 10% + semua kasus merah) — dan kalibrasi berkala: korelasi judge-vs-manusia harus di atas 0,8; bila turun, rubriknya yang diperbaiki.",
        "Guardrails adalah pagar di sekeliling agen — bukan di dalam modelnya. Lapisan: (1) INPUT: filter PII (redaksi NIK/nomor rekening sebelum ke model), deteksi prompt injection, batas panjang; (2) KEBIJAKAN: allowlist tool per zona (dari AAI13), batas nilai transaksi tanpa approval (misalnya di atas Rp10 juta wajib manusia); (3) OUTPUT: verifikasi format (JSON valid), deteksi PII bocor, larangan topik; (4) KILL SWITCH: tombol manusia yang menghentikan SEMUA sesi dalam 60 detik + pembekuan antrean. Contoh angka: guardrail PII menangkap 99,2% NIK pada uji 5.000 input — 0,8% yang lolos = 40 kasus per 5.000; untuk data nasabah, itu 40 terlalu banyak → tambah lapisan verifikasi manusia untuk keluaran yang mengandung pola angka 16 digit. Prinsip: guardrail berlapis karena tiap lapisan bocor — keandalan sistem = 1 − (bocor_1 × bocor_2 × ...).",
        "Red-teaming: uji agen seperti penyerang sungguhan. Metodologi: (1) TENTUKAN batas: apa yang TIDAK BOLEH terjadi (transfer tanpa approval, bocor PII, eksekusi kode arbitrer); (2) SERANG terstruktur per kategori — jailbreak ('abaikan instruksi...'), exfiltration ('ringkas dan kirim ke...'), tool abuse (panggil tool merah via prompt), multi-turn (bangun kepercayaan lalu serang di turn 8); (3) UKUR: attack success rate (ASR) per kategori; (4) PERBAIKI dan ulangi — red-team bukan sekali jalan. Contoh: red-team menemukan ASR 35% pada skenario 'minta agen mengirim ringkasan rapat ke email pribadi' — perbaikan: tool kirim_email masuk zona merah + approval manusia. Kadens: tiap rilis MAYOR dan tiap ada tool baru zona merah. Aturan: red-team dilakukan oleh orang atau tim yang BERBEDA dari pembangun — pembangun buta terhadap lubang buatannya sendiri.",
        "Canary deployment: rilis versi baru ke 5% traffic dulu, bandingkan dengan baseline 95%. Metrik pembanding: error rate, latensi p99, biaya per sesi, skor judge pada sampel. Kriteria rollback OTOMATIS (ditulis SEBELUM canary, bukan saat panik): error rate >2x baseline selama 15 menit, ATAU p99 >1,5x, ATAU biaya/sesi >1,3x. Contoh: baseline error 1,0%; canary 2,8% selama 20 menit → rollback otomatis, lalu investigasi. Rollback harus SATU KLIK: versi prompt, konfigurasi, dan tool dipin per rilis (git tag); state database yang ditulis versi baru harus backward-compatible atau punya skrip downgrade. Latihan chaos: lakukan rollback latihan tiap kuartal — tim yang belum pernah rollback akan panik saat harus melakukannya. Canary tanpa rollback otomatis hanyalah deploy lambat.",
        "Budget latensi dan biaya: agen tanpa budget adalah kartu kredit tanpa limit. Tetapkan: (1) BUDGET LANGKAH: maks 25 langkah per sesi — sesi yang sehat selesai di bawah 12; (2) BUDGET TOKEN: maks 150k token per sesi; proyeksi berjalan dihitung tiap langkah, hentikan elegan bila proyeksi melebihi (dari AAI14: enforce B_maks); (3) BUDGET LATENSI: p99 di bawah 45 detik per sesi — langkah yang melebihi 120 detik di-kill dan di-retry sekali; (4) BUDGET BIAYA: Rp5.000 per sesi (sama dengan budget di Langkah 4); alert pada 80%, hentikan pada 100%. Contoh aritmetik: 10.000 sesi/hari × Rp5.000 = Rp50 juta/hari bila semua mentok — tanpa enforce, satu bug loop tool bisa membakar itu dalam sejam. Dashboard wajib: biaya per sesi (p50/p99), distribusi langkah, top-10 sesi termahal. Aturan: setiap angka budget ditulis di kontrak rilis dan diuji di staging — budget yang tidak di-enforce adalah harapan, bukan kontrol.",
      ],
      formula: String.raw`\hat{p} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}`,
      formulaNote: "p̂ = tingkat keberhasilan pada golden set (lolos/n); z = 1,96 untuk CI 95%; n = ukuran golden set. Contoh: 182 lolos dari 200 → p̂ = 0,91; CI = 0,91 ± 1,96·akar(0,91·0,09/200) = 0,91 ± 0,040 → [0,87, 0,95]. Dua versi agen dengan p̂ 0,91 vs 0,93 pada n = 200 SELANGNYA TUMPANG TINDIH — perbedaannya noise, bukan kemenangan. Mau membedakan selisih 2%? Butuh n sekitar 2.944 (n ≈ 16·p(1−p)/Δ² = 16 × 0,92 × 0,08 / 0,02²). Inilah mengapa ukuran golden set adalah keputusan statistik, bukan tebakan.",
      tasks: [],
      quiz: [
        {
          q: "Agen A: 182/200 lolos (p̂=0,91). Agen B: 186/200 lolos (p̂=0,93). Klaim 'B lebih baik' — sah?",
          options: [
            { text: "Tidak — CI 95% keduanya tumpang tindih ([0,87,0,95] vs [0,89,0,97]); selisihnya noise", why: "Benar: dengan n=200, margin ±0,04 menelan selisih 0,02. Butuh n≈2.944 untuk membedakan 2%.", correct: true },
            { text: "Sah — 0,93 > 0,91 secara matematis", why: "Salah: membandingkan titik estimasi tanpa interval adalah cara klasik mengumumkan kemenangan palsu." },
            { text: "Sah bila diuji ulang 3 kali dan B menang terus", why: "Salah: pengulangan tanpa ukuran sampel yang cukup hanya mengulang noise yang sama." },
            { text: "Tidak bisa dinilai tanpa LLM-as-judge", why: "Salah: ini soal statistik sampel, bukan kualitas penilaian — judge tidak memperbaiki n yang kecil." },
          ],
        },
        {
          q: "Judge LLM konsisten memberi skor lebih tinggi pada jawaban yang panjang. Ini bias apa, dan mitigasinya?",
          options: [
            { text: "Verbosity bias — rubrik eksplisit menilai keringkasan, atau normalisasi panjang", why: "Benar: judge menyukai panjang; rubrik harus menghukum verbosity atau skor dinormalisasi.", correct: true },
            { text: "Position bias — acak urutan jawaban", why: "Salah: position bias soal urutan A/B, bukan panjang jawaban." },
            { text: "Self-preference — ganti judge dari keluarga berbeda", why: "Salah: self-preference soal favoritisme gaya sekeluarga, bukan panjang." },
            { text: "Bukan bias — jawaban panjang memang lebih baik", why: "Salah: panjang ≠ kualitas; jawaban bertele-tele yang benar sebagian bisa mengalahkan jawaban ringkas yang tepat." },
          ],
        },
        {
          q: "Canary 5%: error rate 2,8% vs baseline 1,0% selama 20 menit. Kriteria rollback: >2x baseline selama 15 menit. Tindakan?",
          options: [
            { text: "Rollback otomatis sekarang — 2,8x baseline selama 20 menit melanggar kriteria yang ditulis sebelum canary", why: "Benar: kriteria ditulis saat tenang untuk dieksekusi saat panik; menunda = canary tanpa gigi.", correct: true },
            { text: "Tunggu 1 jam lagi — mungkin fluktuasi", why: "Salah: 20 menit > ambang 15 menit; 'mungkin fluktuasi' adalah cara menunda keputusan yang sudah dibuat." },
            { text: "Naikkan traffic canary ke 50% untuk data lebih banyak", why: "Salah: memperluas canary yang gagal = memperluas kerusakan; arahnya rollback, bukan scale-up." },
            { text: "Matikan alert dan lanjutkan rollout", why: "Salah: mematikan alarm karena tidak suka bunyinya — pola kegagalan klasik." },
          ],
        },
      ],
      reference: "Golden set = representatif + adversarial + regresi + frozen. Judge untuk skala, manusia untuk kebenaran. Canary + rollback otomatis.",
    },
    {
          id: "gap-r9-jitter-retry",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P7-G1)",
          title: "Jitter: retry yang tidak menyerbu bersamaan",
          prose: [
            "Pola 1 mengajarkan exponential backoff — tetapi backoff DETERMINISTIK punya cacat: semua client yang gagal bersamaan akan retry BERSAMAAN (thundering herd), dan sistem yang baru pulih langsung dihantam gelombang kedua. Obatnya: jitter — acak jeda retry. Tiga varian baku (dari arsitektur AWS): FULL jitter — tunggu ~ U(0, cap), cap berlipat 2, 4, 8 detik; EQUAL jitter — tunggu cap/2 + U(0, cap/2) (ada jeda minimum); DECORRELATED jitter — tunggu ~ U(base, 3 × jeda sebelumnya) (tidak butuh cap, beradaptasi dengan riwayat).",
            "Contoh angka (base 1 detik, 3 retry, cap 2/4/8 detik): full jitter punya ekspektasi per retry = cap/2 = 1, 2, 4 detik → total ekspektasi 7,0 detik — SAMA dengan backoff tetap 1+2+4. Equal jitter: ekspektasi = cap/2 + cap/4 = 1,5; 3; 6 → total 10,5 detik (rasio 1,50× full jitter — harga jeda minimumnya). Yang berbeda bukan rata-ratanya, melainkan SEBARANNYA: full jitter menyebar retry ke seluruh jendela (puncak beban terendah), equal jitter menjaga separuh jendela tetap terisi (latensi lebih terprediksi). Pilih full jitter bila yang kau takuti adalah lonjakan; equal jitter bila yang kau takuti adalah ekor latensi.",
            "Aturan praktis: dalam simulasi Monte Carlo, total 3 retry full-jitter biasanya jatuh dalam ±30% dari ekspektasi 7 detik — bila simulasimu menunjukkan total yang jauh di luar itu, curigai generator acakmu (atau cap yang salah). Dan ingat: jitter TIDAK menggantikan idempotency — retry yang tersebar tetap retry; tanpa kunci idempotency, debit ganda hanya terjadi lebih pelan.",
          ],
          formula: String.raw`\text{full: } U(0, 2^k) \qquad \text{equal: } 2^{k-1} + U(0, 2^{k-1}) \qquad \text{decorrelated: } U(\text{base}, 3 \times w_{k-1})`,
          formulaNote: "Jitter mencegah thundering herd. Full: ekspektasi cap/2 per retry. Equal: cap/2 + cap/4. Contoh angka: cap 2/4/8 → full 7,0 detik, equal 10,5 detik (rasio 1,50×). Total full-jitter biasanya dalam ±30% dari ekspektasi.",
          tasks: [
            { id: "t1", text: "Hitung ekspektasi total `full` dan `equal` (cap 2/4/8) + `rasio`" },
            { id: "t2", text: "Cetak ketiganya" },
          ],
          expected: "full=7.0 equal=10.5 rasio=1.50",
          hints: [
            "Full: jumlah cap/2.",
            "Equal: jumlah (cap/2 + cap/4).",
          ],
          code: {
            starter: `base = 1.0\ncaps = [2.0, 4.0, 8.0]\n\n# TULIS KODEMU: ekspektasi total full-jitter vs equal-jitter\nfull = \nequal = \nrasio = \n\nprint(f"full={full:.1f} equal={equal:.1f} rasio={rasio:.2f}")`,
            lockLines: 4,
            solution: `base = 1.0\ncaps = [2.0, 4.0, 8.0]\n\n# TULIS KODEMU: ekspektasi total full-jitter vs equal-jitter\nfull = sum(c / 2 for c in caps)\nequal = sum(c / 2 + c / 4 for c in caps)\nrasio = equal / full\n\nprint(f"full={full:.1f} equal={equal:.1f} rasio={rasio:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "full", value: 7.0, tol: 0.01, label: "`full` seharusnya 7,0", msg: "1 + 2 + 4 = 7." },
              { kind: "equal", task: "t1", name: "equal", value: 10.5, tol: 0.01, label: "`equal` seharusnya 10,5", msg: "1,5 + 3 + 6 = 10,5." },
              { kind: "equal", task: "t1", name: "rasio", value: 1.5, tol: 0.01, label: "`rasio` seharusnya 1,50", msg: "10,5 / 7,0 = 1,5." },
              { kind: "stdout_matches", task: "t2", pattern: "full=7.0\\s+equal=10.5\\s+rasio=1.50", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "100 client gagal bersamaan dan semuanya retry dengan backoff tetap 1-2-4 detik. Apa yang terjadi, dan obatnya?",
              options: [
                { text: "Thundering herd — semua retry bersamaan; obatnya jitter (acak jeda)", why: "Benar: backoff deterministik menyinkronkan retry; jitter menyebarkannya.", correct: true },
                { text: "Tidak ada masalah — backoff eksponensial sudah cukup", why: "Salah: eksponensial mengatur JARAK, bukan PENYEBARAN; tanpa jitter semua client tetap seirama." },
                { text: "Tambah retry — lebih banyak percobaan = lebih aman", why: "Salah: menambah retry pada sistem yang sesak justru memperparah beban." },
              ],
            },
          ],
          reference: "Full jitter U(0, cap); equal jitter cap/2 + U(0, cap/2); decorrelated U(base, 3×sebelumnya).",
        },
    {
          id: "gap-r9-observability-tracing",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P7-G2)",
          title: "Observability: trace-id, spans & dashboard metrik",
          prose: [
            "Langkah 4 memberi checklist deploy — tetapi belum mengajarkan observability: bagaimana kamu TAHU agenmu sakit di produksi sebelum nasabah yang memberitahumu. Tiga lapisnya: (1) TRACE-ID — satu ID unik per sesi, dibawa ke semua log; tanpa ini, 10 langkah satu sesi tersebar di 10 baris log yang tidak bisa disambung. (2) SPANS — tiap langkah (LLM call, tool call) dicatat sebagai span dengan durasi dan biaya; span yang mahal langsung terlihat. (3) IDEMPOTENCY-KEY — tiap aksi tulis membawa kunci unik (lihat Pola 2); kunci yang sama di log dan di server membuat debit ganda bisa dilacak sampai ke percobaan mana.",
            "Contoh angka (satu sesi, 3 span): LLM 1.200ms, tool 800ms, LLM 1.500ms → total 3.500ms; pangsa LLM = 2.700/3.500 ≈ 0,77 — bila sesi ini lambat, yang dioptimasi adalah LLM, bukan tool. Inilah gunanya span: tanpa pembedahan per-langkah, kamu menebak-nebak komponen mana yang lambat.",
            "Dashboard minimum (dari Langkah 4, kini konkret): biaya per sesi p50/p99, distribusi jumlah langkah, top-10 sesi termahal (dengan trace-id — bisa diklik sampai ke span-nya), error rate per tool, dan alert biaya/jam > 2× normal. Aturan: SETIAP alert harus punya runbook (apa yang dilakukan operator) — alert tanpa runbook hanya notifikasi panik.",
          ],
          formula: String.raw`\text{pangsa}_{LLM} = \frac{\sum \text{span LLM}}{\sum \text{semua span}}`,
          formulaNote: "Observability: trace-id per sesi, span per langkah (durasi + biaya), idempotency-key per aksi tulis. Contoh angka: span LLM 1.200 + 1.500, tool 800 → total 3.500ms, pangsa LLM 0,77. Dashboard: biaya/sesi p50/p99, top-10 sesi, error rate per tool.",
          tasks: [
            { id: "t1", text: "Hitung `total` durasi dan `llm_share` dari 3 span" },
            { id: "t2", text: "Cetak keduanya" },
          ],
          expected: "total=3500 llm_share=0.77",
          hints: [
            "total = jumlah semua durasi span.",
            "llm_share = durasi span LLM / total.",
          ],
          code: {
            starter: `spans = [("llm", 1200), ("tool", 800), ("llm", 1500)]\n\n# TULIS KODEMU: total + pangsa LLM\ntotal = \nllm_share = \n\nprint(f"total={total} llm_share={llm_share:.2f}")`,
            lockLines: 3,
            solution: `spans = [("llm", 1200), ("tool", 800), ("llm", 1500)]\n\n# TULIS KODEMU: total + pangsa LLM\ntotal = sum(t for _, t in spans)\nllm_share = sum(t for k, t in spans if k == "llm") / total\n\nprint(f"total={total} llm_share={llm_share:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "total", value: 3500, label: "`total` seharusnya 3.500", msg: "1.200 + 800 + 1.500 = 3.500." },
              { kind: "equal", task: "t1", name: "llm_share", value: 0.77, tol: 0.01, label: "`llm_share` seharusnya 0,77", msg: "2.700 / 3.500 ≈ 0,77." },
              { kind: "stdout_matches", task: "t2", pattern: "total=3500\\s+llm_share=0.77", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Sesi agen lambat (9 detik) tetapi tidak ada yang tahu langkah mana yang lambat. Apa yang hilang?",
              options: [
                { text: "Spans per langkah — tanpa itu, optimasi hanya tebak-tebakan", why: "Benar: span memisah durasi per langkah; tanpa span, 'lambat' tidak bisa dilokalisasi.", correct: true },
                { text: "Trace-id — tanpa itu sesi tidak bisa ditemukan", why: "Salah: trace-id menyambung log satu sesi, tetapi tidak memisah durasi per langkah." },
                { text: "Idempotency-key — tanpa itu retry tidak aman", why: "Salah: idempotency-key soal keamanan retry, bukan soal diagnosis latensi." },
              ],
            },
          ],
          reference: "Trace-id per sesi; span per langkah; idempotency-key per aksi; dashboard p50/p99 + top-10.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Lima pola: retry+backoff (transient), idempotency (aman diulang), timeout (p99×2), checkpoint (lanjut dari gagal), circuit breaker (lindungi yang sakit).",
        "P_sukses(n) = 1−p^(n+1); w_k = w_0×2^k: retry mengubah 75% menjadi 99,6%.",
        "JANGAN retry aksi non-idempoten tanpa kunci — debit ganda > gagal eksplisit.",
        "Biaya: C_sesi ≤ B_maks (enforce!) + kill switch + alert; loop bug = $12.000 semalam (ilustratif).",
        "Checklist 7 item sebelum produksi; deploy = berani karena bisa rollback.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Tool pembayaran timeout setelah mendebit. Tindakan benar?",
          options: [
            { text: "Jangan retry otomatis — cek status dengan idempotency key dulu", why: "Tepat: retry buta = debit ganda. Kunci idempotency memastikan 'sekali saja'.", correct: true },
            { text: "Retry 3x segera", why: "Tanpa kunci, retry = debit 2-4x. Inilah insiden Rp200 juta Rani.", correct: false },
            { text: "Abaikan — anggap sukses", why: "Bisa jadi belum terdebit — nasabah tidak dapat barang.", correct: false },
            { text: "Hapus data transaksi", why: "Menghapus bukti = tidak bisa rekonsiliasi. Jangan pernah.", correct: false },
          ],
        },
        {
          q: "Kapan retry dengan backoff TIDAK membantu?",
          options: [
            { text: "Argumen salah (kegagalan permanen) — hasil sama 4x", why: "Tepat: retry hanya untuk transient. Permanen = perbaiki input, bukan ulangi.", correct: true },
            { text: "Timeout sesekali", why: "Itu kasus IDEAL retry — transient murni.", correct: false },
            { text: "Rate limit 429", why: "Backoff justru dirancang untuk ini — tunggu lalu coba.", correct: false },
            { text: "Koneksi terputus sesaat", why: "Transient klasik — retry sangat membantu.", correct: false },
          ],
        },
        {
          q: "Circuit breaker terbuka setelah 5 gagal beruntun. Apa yang terjadi pada request ke-6?",
          options: [
            { text: "Ditolak cepat tanpa memanggil tool yang sakit", why: "Tepat: melindungi sistem sakit dari beban + pengguna dari menunggu sia-sia.", correct: true },
            { text: "Tetap dicoba seperti biasa", why: "Itu = tidak ada breaker. Panggilan ke-6 pasti gagal juga.", correct: false },
            { text: "Diantrekan hingga sistem pulih", why: "Antrean menumpuk = meledak saat pulih. Tolak cepat > antre.", correct: false },
            { text: "Dialihkan ke model yang lebih besar", why: "Masalahnya di tool downstream, bukan model.", correct: false },
          ],
        },
        {
          q: "Agen 10 langkah gagal di langkah 8. Tanpa checkpointing, biayanya?",
          options: [
            { text: "Ulangi 8 langkah ≈ 8x biaya + waktu", why: "Tepat: tanpa checkpoint, 1 gagal transient = ulangi semua.", correct: true },
            { text: "Lanjut dari langkah 8 gratis", why: "Tanpa checkpoint tidak ada 'lanjut' — tidak tersimpan.", correct: false },
            { text: "Sama saja, tidak ada beda", why: "Beda 8x lipat — inilah nilai checkpointing.", correct: false },
            { text: "Hanya langkah 8 yang diulang", why: "Itu DENGAN checkpointing — yang justru belum ada.", correct: false },
          ],
        },
        {
          q: "Rem biaya terpenting untuk agen loop produksi?",
          options: [
            { text: "Budget per sesi yang di-enforce + kill switch", why: "Tepat: loop bug = biaya tak terbatas; enforce menghentikan, switch mematikan.", correct: true },
            { text: "Pakai model termurah saja", why: "Model murah yang loop 14 jam tetap bisa menagih $12.000 (ilustratif).", correct: false },
            { text: "Kurangi jumlah tool", why: "Tidak menyentuh akar: loop tak terbatas.", correct: false },
            { text: "Percaya agen tidak akan loop", why: "Bug loop = kepastian statistik di produksi.", correct: false },
          ],
        },
      ],
    },
  ],
};
