# METODE.md — misi-gabung-biaya-agen

**PERNYATAAN SINTETIS:** Seluruh data di folder ini 100% SINTETIS — hasil generator
acak (seed 42), BUKAN data produksi siapa pun, BUKAN tagihan LLM asli, dan TIDAK
berhubungan dengan perusahaan, tiket pelanggan, atau rekening mana pun. Angka
dibuat agar menyerupai pola nyata (retry loop, context bloat, salah atribusi tier)
untuk keperluan latihan.

## Generator

Skrip: `/tmp/cap7-biayaagen-gen.py` (seed `random.seed(42)`).

1. 60 tiket (`TKT-001`–`TKT-060`). Tiap tiket diberi satu tier model untuk semua
   langkahnya: 55% `pro`, 30% `flash`, 15% `nano` (hasil aktual: pro 33, flash 17,
   nano 10).
2. Tiap tiket punya 4–9 langkah sukses. Token input tiap langkah tumbuh linear:
   `input = base(2200–3200) + bloat(2200–3000) × langkah_ke + noise` — mensimulasikan
   prompt yang menempel SELURUH histori percakapan di setiap langkah (context bloat).
3. 75% tiket terkena retry loop yang gagal: tambahan `round(n/2)` langkah dengan
   `retry=1`, masing-masing ±1,45× semahal ekor langkah sukses (mengulang bagian
   termahal + tool calls). Hasil aktual: 45 tiket punya retry, 145 langkah retry.
4. `cache_hit = 0` untuk SEMUA 552 baris — mensimulasikan prompt yang menyisipkan
   `ts=<unix timestamp>` sehingga cache key tidak pernah sama (cache tidak pernah hit).
5. **Kalibrasi jujur:** seluruh token dikali faktor skala S = 7,2243 agar rata-rata
   biaya per tiket TEPAT $4,20 (target narasi misi). Porsi biaya retry 40,8%
   adalah hasil konstruksi parameter di atas (bukan kebetulan), agar sesuai premis
   "40% biaya dari retry yang gagal".

## File

- `trace_tiket.csv` (552 baris + header) — jejak mentah per langkah.
  Kolom: `tiket_id`, `langkah_ke`, `model` (pro/flash/nano), `input_tokens`,
  `output_tokens`, `tool_calls`, `retry` (1 = langkah retry yang gagal),
  `cache_hit` (selalu 0 — disengaja, lihat sabotase #4).
- `harga_model.csv` — tarif USD per 1K token per tier:
  pro 0,005/0,025 · flash 0,0005/0,0015 · nano 0,0001/0,0004.

## Statistik aktual (seed 42)

- 60 tiket · 552 langkah · total $252,00 · rata-rata $4,20/tiket
- Porsi biaya retry: 40,8% · porsi biaya input token: 83,0%
- 70,9% token input adalah bloat (di atas token langkah pertama tiap tiket)
- Tiket termahal: TKT-025 ($13,45 · 13 langkah · 4 retry · tier pro)
- Rata-rata input token: langkah ke-1 ≈ 37,6k → langkah ke-13 ≈ 273,8k (7,3×)

## Dossier audit (langkah audit misi)

Angka di dossier "Laporan Efisiensi Agen" DIBUAT-BUAT agar terlihat mencapai target
$0,30/tiket — bukan hasil formula apa pun. Empat sabotase yang disuntikkan:

1. **Tier salah** — biaya diatribusikan ke tier `nano` padahal 33/60 tiket memakai
   `pro` (50× lebih mahal untuk input).
2. **Retry jadi tiket** — langkah retry dihitung sebagai tiket tersendiri
   (penyebut 60 → 96), sehingga rata-rata runtuh dan porsi retry "4%".
3. **Context bloat disembunyikan** — input tumbuh 7,3× antar langkah, dossier
   menampilkan rata-rata flat 3.100.
4. **Cache fiktif** — dossier mengklaim hit rate 35%, padahal `cache_hit = 0`
   di semua baris karena timestamp di prompt.

## Batas jujur

- Tarif model disederhanakan (satu angka per tier; tarif asli bervariasi per vendor).
- Retry selalu "gagal total" — di produksi ada retry yang sebagian berguna.
- Tidak ada biaya tool-call eksternal / infrastruktur — hanya token LLM.
- Ambang, target $0,30, dan dossier adalah fiksi latihan.
