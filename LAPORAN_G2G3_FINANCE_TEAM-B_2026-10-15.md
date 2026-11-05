# LAPORAN G2/G3 — Finance Team-B (Klaster Financial Markets)
Tanggal: 2026-10-15 · Koordinator: Team-B (subagent) · Parent: koordinator klaster finance/risk

## Daftar slug yang dibangun (4 file BARU)
| # | Slug | Judul | Steps | Quiz | Lab | Myth |
|---|------|-------|-------|------|-----|------|
| 1 | `e19-real-estate-reit` | E19. Real Estate & REIT: Properti sebagai Aset Investasi | 8 | 6 | 1 | 2 |
| 2 | `e20-asuransi-dana-pensiun` | E20. Asuransi & Dana Pensiun: Bisnis yang Menjual Perlindungan | 8 | 6 | 2 | 2 |
| 3 | `e21-investment-banking` | E21. Investment Banking: IPO, Underwriting & M&A | 9 | 6 | 2 | 3 |
| 4 | `e22-reksa-dana-etf` | E22. Reksa Dana & ETF: Memilih Kendaraan Investasi | 8 | 6 | 2 | 2 |

Registrasi: `src/app/v2/lib/reg-e.ts` — tambah 4 import + 4 entry (format meniru entry existing).
Tidak menyentuh: registry.ts, Workspace.tsx, reg file lain, lesson existing mana pun.

## F2 mitigasi (a) — ringkasan prasyarat inline 2–3 kalimat, tanpa "lihat lesson X"
- e19: ringkas e3 (TVM/present value → harga wajar = PV NOI masa depan) di langkah 2; ringkas e6 (saham = klaim sisa; harga = ekspektasi arus kas masa depan) di langkah 3 (REIT).
- e20: ringkas e2 (instrumen = kontrak klaim arus kas masa depan: saham/obligasi/polis) di langkah 2.
- e21: ringkas e6 + e2 (saham/klaim sisa; pasar primer vs sekunder) di langkah 1, dalam satu note "Kilasan kilat prasyarat".
- e22: ringkas e2 (tiga bahan baku: pasar uang/obligasi/saham; kemasan ≠ isi) + e7 (return = kompensasi risiko; biaya pasti, return tidak) di langkah 1. pm-a6/a10 TIDAK dirujuk (sudut FM mandiri).

## Hasil verifikasi per file
Skrip: `~/workspace/learn-platform/verify_g2_teamB.py` (cek: tasks di semua langkah, summary ada,
quiz ≥4 opsi & tepat 1 correct & why spesifik, frasa F1, pola "lihat lesson X", compile() solution,
EKSEKUSI solution asli hasil ekstrak dari .ts + uji pola `stdout_matches` terhadap output nyata).

| File | tsc error | tasks/step | summary | quiz | F1 | lab compile+run | pola stdout vs output nyata |
|------|-----------|-----------|---------|------|----|-----------------|------------------------------|
| e19 | 0 | 8/8 OK | ada (checkpoint) | 6 soal, tiap soal 4 opsi/1 benar | bersih | 1/1 OK | semua cocok |
| e20 | 0 | 8/8 OK | ada (checkpoint) | 6 soal, tiap soal 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |
| e21 | 0 | 9/9 OK | ada (checkpoint) | 6 soal, tiap soal 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |
| e22 | 0 | 8/8 OK | ada (checkpoint) | 6 soal, tiap soal 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |

- `npx tsc --noEmit`: **0 error di ke-4 file + reg-e.ts**. Error pre-existing di file tim lain
  (`a317-quantile-regression.ts`, `dm20-reference-data.ts`) — TIDAK disentuh, hanya dicatat.
- Komponen wajib per lesson: R+T+M+D+C+L+Q terpenuhi (cerita+twist, ≥2 myth, ≥2 tips 💡,
  peta keputusan 4 skenario + aturan 10 detik, mini-case angka konkret + pembahasan,
  lab Pyodide editable + instruksi eksplorasi, chart SVG + "Cara membaca" + "Interpretasi",
  quiz dengan feedback why + score tracking via komponen Quiz).
- Prosa RAW (`<`, `>`, `&` apa adanya); entitas HTML hanya di string const SVG;
  KaTeX selalu `String.raw` backslash tunggal; lab memakai `{var}` polos (patuh aturan
  `\${` di `~/workspace/AGENTS.md` 2026-10-15).

## Catatan
1. Repo ini BUKAN git repository (`git status` tidak bisa dijalankan). Verifikasi cakupan
   perubahan: aksi tulis/edit saya hanya pada 4 file lesson + `reg-e.ts` (+ skrip verifikasi
   dan file laporan ini). File lain dengan mtime baru adalah pekerjaan paralel tim lain.
2. Angka lab & mini-case dihitung dan dieksekusi lokal sebelum ditulis (bukan estimasi):
   NOI Rp113 jt / cap 5,65% / CoC −6,36%; combined ratio A 90% / B 101,7%→total +6 via float;
   underpricing 150% / left-on-table Rp150 M; EPS gabungan 1272 akretif / sinergi impas Rp6 M;
   fee drag 20 thn: Rp614 jt vs Rp939 jt (selisih Rp325 jt); tracking error 0,34%.
3. Mini-case e21: valuasi Rp600 M untuk laba Rp40 M (= 15× earnings) → DILUTIF meski sinergi
   Rp50 M (impas butuh Rp110 M) — sengaja dibuat sebagai jebakan "akretif ≠ bagus".
4. e22 `next` mengarah ke `/learn/e1-struktur-pasar` (slug valid, awal track); e19→e20→e21→e22 berantai.
5. Perhatikan pelajaran baru di `~/workspace/AGENTS.md` (2026-10-15): pola `stdout_matches`
   WAJIB diuji terhadap stdout dari string yang diekstrak langsung dari .ts — sudah dipatuhi
   via eksekusi solution hasil ekstrak node di skrip verifikasi.
