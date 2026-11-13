# GAP LUNA M9 — Laporan Chief (verifikasi induk)

**Tanggal:** 13 Nov 2026 ~23:55 WITA. Model: `gpt-6-luna` via Kelontong (1 panggilan, prompt `review-prompts/gap_m9_luna_prompt.txt` 514.977 B). Mentah: `review/gap_luna_m9.txt` (15.487 B, exit 0, ~100 dtk).

**Catatan prompt:** meniru struktur M8, dengan pelajaran noise M8 diterapkan — kanonik PENUH M4 + M6 + M8 + M9 (bukan ringkasan) + appendix M7.5 terpilih (hanya angka yang dikutip M9: chunk ROC 0,7449/0,7428/0,8138/0,8041/0,8006, roc_spread 0,0710, roc_drop 0,0388).

## Ringkasan: 10 gap — 10/10 TERVERIFIKASI BENAR, 0 noise

| No. | Severity | Status | Isi |
|---|---|---|---|
| G1 | must | HILANG | Pipeline M8 → M9: champion tervalidasi → exposure/loss distribution → VaR/ES → limit (tidak ada langkah penghubung) |
| G2 | must | TIPIS | Pemilihan generator MC: GBM normal satu-satunya yang di-lab-kan; EWMA/GARCH/FHS hanya disebut sebagai opsi |
| G3 | must | HILANG | Backtesting Expected Shortfall / severity exceedance (Kupiec + Christoffersen hanya jumlah + urutan) |
| G4 | must | TIPIS | P&L engine skenario: likuiditas, biaya, leverage, margin call disebut tapi tidak pernah dihitung |
| G5 | should | HILANG | Kerangka horizon / frequency / unit observasi lintas metode (risk horizon vs estimation window vs backtest window vs HS window) |
| G6 | should | HILANG | Uncertainty propagation: ketidakpastian parameter diteruskan ke distribusi output (nested re-estimasi + re-simulasi) |
| G7 | should | TIPIS | Diagnosis/validasi bootstrap: pemilihan panjang blok, kapan CI bootstrap tidak dapat dipercaya |
| G8 | should | HILANG | Artefak keputusan lintas-metode: risk register / model card untuk hasil M9 (asumsi → bukti → verdict → remediasi) |
| G9 | should | HILANG | Sintesis penutup M9: operating loop "pakai semua alat bersama-sama" (bukan daftar modul) |
| G10 | nice | HILANG | Roadmap setelah track: jalur upgrade konkret pasca-M9 |

## Verifikasi Chief (grep atas 5 lesson TS pasca-fix + kanonik)

- **G1 BENAR:** "champion"/"challenger" = 0× di seluruh M9; "calibration"/"kalibrasi"/"terkalibrasi" = 0× di M9.3; "pipeline" = 0×; "EAD" = 0×. Kutipan Luna TEPAT: "validasi MC adalah conceptual soundness [M8.1]" (M9.1 langkah 7); "model VaR baru (rolling 250-hari VaR95...)" (M9.3:156). Nuansa untuk fill: koneksi M8→M9 TIDAK nol — M9.4 memakai angka kredit M8 (LGD 0,45, margin 0,05, threshold 0,10, profit NT$8.214.000, agregat [turunan] dari m8_tiering) dan M9.5 menyitir CI M8.1 — yang hilang adalah LANGKAH pipeline-nya (probability → loss distribution → VaR/ES → limit), bukan semua sitasi. Fill WAJIB membangun di atas angka M9.4 itu, bukan menduplikasi.
- **G2 BENAR:** "filtered historical"/"memilih generator" = 0× (satu hit "decision tree" di M9.3:99 adalah model ML 0,5188, bukan pohon keputusan generator). "GARCH" 5× di M9.1 — semuanya sebutan opsi ("Model yang menangkap ini adalah EWMA dan GARCH [M4.3], bukan GBM dengan σ konstan"; mini-case: "ganti σ konstan dengan GARCH [M4.3]") — tanpa prosedur estimasi/pembandingan dan tanpa lab pembanding generator. Status TIPIS tepat, bukan HILANG.
- **G3 BENAR:** "Acerbi"/"severity"/"kedalaman exceedance" = 0×. "Expected Shortfall" 5× di M9.3 — SELALU sebagai pelengkap/batas Kupiec ("Besaran kerugian saat exceedance adalah tugas Expected Shortfall [M4.2], bukan Kupiec"; "pelengkap Expected Shortfall [M4.2]"), bukan prosedur uji. Hari 212 (−13,98%, ≈4,9× VaR) dihitung sebagai 1 exceedance — tepat seperti yang Luna katakan.
- **G4 BENAR:** "transaction cost"/"biaya transaksi"/"haircut"/"forced sale"/"likuidasi paksa" = 0×; "margin call" 1× (M9.2:128, di paragraf batas mini-case). Kutipan Luna VERBATIM: "2 × Rp7.432.406 = Rp14.864.812" (M9.2:127); "Tiga batasnya... LIKUIDITAS... BIAYA... KORELASI" + "bila posisi 2× itu memakai leverage... ada bunga dan margin call" (M9.2:128). Tidak ada hitungan biaya/haircut/forced sale. Status TIPIS tepat.
- **G5 BENAR:** "estimation window"/"jendela estimasi" = 0× di seluruh M9. "horizon" hanya 3× di M9.1 (horizon 10-hari) + 4× di M9.5 (generik: "VaR berapa pun horizonnya", "horizon pendek/panjang") — tidak ada tabel desain yang membedakan risk horizon vs estimation window vs backtest window vs HS window vs unit bootstrap. HILANG tepat.
- **G6 BENAR:** "propagat"/"nested simul"/"parameter uncertainty"/"ketidakpastian parameter" = 0×. M9.4 kuis (:541) membedakan sensitivitas vs ketidakpastian persis seperti parafrasa Luna ("Sensitivitas = «bila input salah sekian, output salah sekian»...; ketidakpastian = «seberapa salah input itu»"), tapi tidak ada prosedur nested (bootstrap → estimasi ulang parameter → simulasi ulang → distribusi output). HILANG tepat.
- **G7 BENAR:** Kutipan Luna VERBATIM: "Panjang blok 10 di sini adalah pilihan [kebijakan lesson ini] — bukan hukum alam: blok yang terlalu pendek hampir sama dengan iid, blok yang terlalu panjang membuat terlalu sedikit blok yang berbeda" (M9.5:113); "block bootstrap menjaga dependensi JARAK PENDEK... tetapi ia tidak menjaga pergeseran REZIM" (M9.5:116, :233). "blok 10" 10×. Lesson SENDIRI menyatakan angka blok 5 vs 10 vs 20 "tidak dihitung di lesson ini, dan jangan mengarangnya" (M9.5:116) — jadi fill butuh hitungan [notebook] baru, bukan kutip. "circular"/"stationary bootstrap" = 0×. Status TIPIS tepat.
- **G8 BENAR:** "risk register"/"model card" = 0× di seluruh M9. M9.4 punya "tiga baris yang wajib ada di setiap laporan sensitivitas" (:467–469) — hanya untuk sensitivitas, bukan artefak keputusan lintas-metode. Nuansa: M8.3 SUDAH punya template model card (untuk model kredit) — fill WAJIB cross-ref/perluas M8.3, bukan menduplikasi; yang baru = artefak verdict M9 (backtest + bootstrap + sensitivitas + stress → verdict → remediasi).
- **G9 BENAR:** "Penutup track" M9.5:468 VERBATIM: daftar modul L0–M9 + "tanyakan tiga hal — metode apa, jendela (atau asumsi) apa, dan berapa pitanya" + "hitung ulang ketiganya". Tidak ada workflow/operating loop yang menggabungkan 5 alat M9 + M8. HILANG tepat (penutup sebagai paragraf ADA; workflow TIDAK ADA). G9 berbeda dari G1: G1 = jembatan konten M8→M9, G9 = urutan kerja dalam M9 — fill boleh menempatkan keduanya di M9.5 tapi sebagai dua artefak berbeda (figure pipeline vs figure operating loop).
- **G10 BENAR:** "tidak ada M10" + "Yang tersisa bukan modul berikutnya — ... kebiasaan" (M9.5:468) VERBATIM. Tidak ada roadmap kompetensi/skills berikutnya. HILANG tepat. Catatan: isi roadmap yang diusulkan Luna (FHS, EVT, liquidity) tumpang tindih dengan opsi generator G2 — wajar, karena G10 adalah peta, bukan lesson; fill cukup merujuk G2, jangan mengajar ulang.

## Noise: 0

Tidak ada gap yang noise. Semua 10 gap terverifikasi BENAR terhadap lesson pasca-fix + kanonik.

## Koreksi atas catatan Luna (bukan gap — catatan penutup laporannya)

- **Klaim Luna yang SALAH (1):** catatan "Koneksi M8 → M9" menyatakan "M9.3 menyebut calibration, champion-challenger, dan monitoring-related evidence dari M8/M7.5" — **"calibration"/"champion"/"challenger" = 0× di M9.3** (dan 0× di seluruh M9). Yang benar: M9.3 menyitir [M7.5] (chunk ROC) dan [M8.1] (validation halves = split acak, bukan walk-forward) — tapi TIDAK menyebut calibration maupun champion-challenger. Kesalahan ini justru MEMPERKUAT G1 (jembatan lebih tipis dari yang Luna kira), tapi kalimatnya sendiri salah dan TIDAK boleh dikutip di fill.
- **Klaim lain di catatan itu BENAR:** M9.1 menyebut conceptual soundness [M8.1]; M9.4 merujuk profit/LGD/margin/threshold M8; M9.5 merujuk CI bad rate/ECE/profit M8.1.

## Catatan untuk ronde fill

- G1/G9/G5: ketiganya bermuara di M9.5 (penutup) — tempatkan sebagai 3 artefak berbeda: figure pipeline M8→M9 (G1), tabel desain horizon/window (G5), figure operating loop (G9). Jangan gabung jadi satu langkah raksasa.
- G2: lab pembanding generator butuh angka baru [notebook] (GBM vs empiris/block vs GARCH — hitung dari data, label [turunan]/[notebook]); larangan Luna "jangan pilih generator dari hasil backtest yang sama" = aturan keras, samakan dengan jebakan backtest M9.3 langkah 7.
- G3: angka severity baru (rata-rata kerugian exceedance aktual vs ES forecast) dihitung dari data kanonis (n=230, 15 exceedance) — label [turunan]; jangan pakai uji Acerbi-Szekely penuh bila butuh angka di luar kanonik — cukup perbandingan severity deskriptif + kuis verdict.
- G4: komponen market loss pakai angka kanonis yang sudah ada; komponen biaya/leverage baru = [ilustrasi] (Luna sendiri mengusulkan begitu) — JANGAN disajikan sebagai angka data.
- G6: prosedur nested butuh simulasi baru — angka [notebook]; bedakan DUA sumber variasi (parameter/sampling vs MC error) seperti M9.1 langkah 6.
- G7: hitungan blok 5/10/20 = [notebook] baru (lesson sendiri menyatakan belum dihitung); circular/stationary bootstrap cukup disebut sebagai alternatif + kapan dipakai, tanpa lab penuh bila tidak ada angka.
- G8: template satu halaman di M9.5 checkpoint; cross-ref template model card M8.3 (jangan duplikasi field yang sama).
- G10: roadmap di M9.5 "Setelah track ini" — cukup daftar jalur + matriks "gap → skill → artefak"; merujuk G2 untuk FHS/EVT, jangan mengajar ulang.
- Struktur akhir yang diharapkan (indikasi): M9.1 + G2; M9.2 + G4; M9.3 + G3; M9.4 + G6; M9.5 + G1, G5, G7, G8, G9, G10. Koordinator fill boleh menyesuaikan penempatan bila ada alasan yang dicatat.
- Prose baru fill WAJIB lewat prose-level review DeepSeek (aturan AGENTS.md — gate tidak membaca prose) SEBELUM deploy.
