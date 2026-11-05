# DM12: Keamanan & Privasi Data — Benteng di Sekeliling Harta Karun

## Masalah: 270 Juta Baris di Forum Gelap
Bukan peretasan canggih — melainkan akses berlebihan yang dibiarkan: analis junior download massal tanpa approval, backup tak terenkripsi. Keamanan jebol karena pintu tak dikunci.

## 1. RBAC vs ABAC
**RBAC**: dari peran — sederhana, 80% kasus. **ABAC**: dari atribut — presisi, untuk "kecuali" yang menumpuk. Prinsip **least privilege** + akses berkedaluwarsa + review berkala.

## 2. Lima Teknik Perlindungan
**Masking** (samarkan) → **tokenisasi** (vault) → **pseudonymisasi** (bisa join, sweet spot analis) → **anonymisasi** (irreversibel, harus dibuktikan!) → **enkripsi**. "Hapus nama" ≠ anonym — quasi-identifier bisa identifikasi ulang 87% orang!

## 3. Enkripsi & Defense in Depth
TLS (in-transit) + AES-256 (at-rest) + kunci di KMS (bukan di kode!). Lapisan: akses + teknik + enkripsi + audit — tiap lapis untuk ancaman berbeda.

## 4. Retensi & Regulasi
Data punya masa berlaku; hak hapus harus tereksekusi di semua salinan (butuh lineage!). **UU PDP No. 27/2022** (hak subjek, sanksi) & **GDPR** (minimisasi, denda 4% omzet). Privacy by design sejak arsitektur.

## Kesimpulan
1. Least privilege; akses = kontrak sementara.
2. Pilih teknik dari pemakai; anonym = klaim yang dibuktikan.
3. Desain untuk dihapus sejak awal.

**Next:** DM13 — Data untuk Risiko & Regulasi
