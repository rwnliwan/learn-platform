# LAPORAN EKSPANSI MATERI Learn v2
**Tanggal:** 2026-10-15
**Perintah:** ACC Septian 2026-10-14 23:03 WITA — "jalankan aja semua" (bedah ebook per role + tambah lesson bila belum ada)
**Pelaksana:** Subagent ekspansi (koordinasi builder)
**Status:** SELESAI — 24 lesson baru, terverifikasi penuh. TIDAK deploy (menunggu verifikasi gabungan parent).

---

## 1. Ebook yang Dibedah (per Role)

| # | Buku | Penulis/Penerbit | URL Daftar Isi (terverifikasi) | Role Target |
|---|------|------------------|--------------------------------|-------------|
| 1 | Risk Management and Financial Institutions (6th ed) | John C. Hull — Wiley | https://www.wiley.com/en-us/Risk+Management+and+Financial+Institutions%2C+6th+Edition-p-9781394220988 | Market Risk, Credit Risk |
| 2 | Value at Risk: The New Benchmark (3rd ed) | Philippe Jorion — McGraw-Hill | https://www.mcgrawhill.com/professional/products/9780071464956.html | Market Risk |
| 3 | Credit Risk Analytics | Bart Baesens dkk. — Wiley | https://www.wiley.com/en-us/Credit+Risk+Analytics%3A+Measurement+Techniques%2C+Applications%2C+and+Examples+in+SAS-p-9781119143980 | Credit Risk |
| 4 | Basel Framework (bis.org) | Basel Committee on Banking Supervision | https://www.bis.org/basel_framework/ | Credit Risk, Market Risk, Risk Reporting |
| 5 | FATF Guidance & Mutual Evaluations | Financial Action Task Force | https://www.fatf-gafi.org/en/publications/ | Fraud/AML |
| 6 | POJK 8/2023, POJK 40/2024, SEOJK 19/2025, POJK 12/2026 | OJK | https://www.ojk.go.id/id/regulasi/ | Semua role (konteks Indonesia) |
| 7 | Materi ACAMS/CAMS (edisi ke-7, selaras) | ACAMS | https://www.acams.org/en/training/cams-certification | Fraud/AML |

Peta bab → topik lengkap: `~/workspace/learn-platform/EKSPANSI_2026-10-14/ebook_maps.md`

---

## 2. Peta Gap per Role

### Credit Risk Analyst (6 lesson baru)
| Topik | Status | Slug |
|-------|--------|------|
| Private credit / direct lending | BELUM ADA → dibangun | cr26-private-credit |
| Fintech lending & P2P (konteks loker 2026) | BELUM ADA → dibangun | cr27-fintech-lending |
| Climate risk & kredit (risiko fisik + transisi) | BELUM ADA → dibangun | cr28-climate-risk-kredit |
| Sekuritisasi | BELUM ADA → dibangun | cr29-sekuritisasi |
| Specialised lending (Basel) | BELUM ADA → dibangun | cr30-specialised-lending |
| Low-default portfolio (validasi model) | BELUM ADA → dibangun | cr31-low-default-portfolio |

### Fraud/AML Analyst (8 lesson baru, selaras CAMS edisi ke-7)
| Topik | Status | Slug |
|-------|--------|------|
| Bribery & corruption | BELUM ADA → dibangun | aml12-bribery-corruption |
| Cybercrime & laundering | BELUM ADA → dibangun | aml13-cybercrime-laundering |
| RegTech / AI / pKYC | BELUM ADA → dibangun | aml14-regtech-ai-pkyc |
| Sanctions evasion | BELUM ADA → dibangun | aml15-sanctions-evasion |
| FATF grey list (status Indonesia) | BELUM ADA → dibangun | aml16-fatf-greylist-indonesia |
| Fusion center (korelasi cyber-fraud-AML) | BELUM ADA → dibangun | aml17-fusion-center |
| DeFi laundering (mixer, chain-hopping) | BELUM ADA → dibangun | aml18-defi-laundering |
| Gaming/gambling ML (chip dumping, structuring) | BELUM ADA → dibangun | aml19-gaming-gambling-ml |

### Market Risk Analyst (5 lesson baru, selaras FRM 2026)
| Topik | Status | Slug |
|-------|--------|------|
| Model risk & AI | BELUM ADA → dibangun | mr20-model-risk-ai |
| Crypto market risk | BELUM ADA → dibangun | mr21-crypto-market-risk |
| Geopolitical risk | BELUM ADA → dibangun | mr22-geopolitical-risk |
| OTC clearing & CCP | BELUM ADA → dibangun | mr23-otc-clearing-ccp |
| Risk factor mapping | BELUM ADA → dibangun | mr24-risk-factor-mapping |

### Risk Reporting / Data (5 lesson baru, konteks OJK 2026)
| Topik | Status | Slug |
|-------|--------|------|
| Laporan likuiditas (LCR/NSFR) | BELUM ADA → dibangun | rr20-laporan-likuiditas |
| Sustainability reporting (ISSB S1/S2) | BELUM ADA → dibangun | rr21-sustainability-reporting |
| Operational risk reporting | BELUM ADA → dibangun | rr22-operational-risk-reporting |
| ERM terintegrasi | BELUM ADA → dibangun | rr23-erm-terintegrasi |
| Pillar 3 disclosure | BELUM ADA → dibangun | rr24-pillar3-disclosure |

**Catatan tabrakan slug:** rr19 sudah dipakai pilot (`rr19-audit-impostor.ts`, terdaftar via reg-rr) — topik riset rr19–21 digeser ke rr20/rr21/rr22. File pilot tidak disentuh.

---

## 3. Lesson Baru yang Dibangun (24)

### Fraud/AML (track FR)
| Slug | Durasi Model | Harness Pyodide |
|------|--------------|-----------------|
| aml12-bribery-corruption | 45,05 mnt | 6/6 PASS |
| aml13-cybercrime-laundering | 50,55 mnt | 6/6 PASS |
| aml14-regtech-ai-pkyc | 50,97 mnt | 7/7 PASS |
| aml15-sanctions-evasion | 50,45 mnt | 7/7 PASS |
| aml16-fatf-greylist-indonesia | 45,04 mnt | 5/5 PASS |
| aml17-fusion-center | 50,51 mnt | 9/9 PASS |
| aml18-defi-laundering | 45,13 mnt | 4/4 PASS |
| aml19-gaming-gambling-ml | 45,12 mnt | 4/4 PASS |

### Credit Risk (track CR)
| Slug | Durasi Model | Harness Pyodide |
|------|--------------|-----------------|
| cr26-private-credit | 48,75 mnt | 8/8 PASS |
| cr27-fintech-lending | 50,93 mnt | 4/4 PASS |
| cr28-climate-risk-kredit | 45,15 mnt | 4/4 PASS |
| cr29-sekuritisasi | 45,32 mnt | 6/6 PASS |
| cr30-specialised-lending | 45,07 mnt | 4/4 PASS |
| cr31-low-default-portfolio | 45,04 mnt | 4/4 PASS |

### Market Risk (track MR)
| Slug | Durasi Model | Harness Pyodide |
|------|--------------|-----------------|
| mr20-model-risk-ai | 50,57 mnt | 6/6 PASS |
| mr21-crypto-market-risk | 48,46 mnt | 6/6 PASS |
| mr22-geopolitical-risk | 45,86 mnt | 6/6 PASS |
| mr23-otc-clearing-ccp | 45,19 mnt | 6/6 PASS |
| mr24-risk-factor-mapping | 50,91 mnt | 9/9 PASS |

### Risk Reporting (track RR)
| Slug | Durasi Model | Harness Pyodide |
|------|--------------|-----------------|
| rr20-laporan-likuiditas | 46,51 mnt | 7/7 PASS |
| rr21-sustainability-reporting | 45,13 mnt | 6/6 PASS |
| rr22-operational-risk-reporting | 45,14 mnt | 6/6 PASS |
| rr23-erm-terintegrasi | 45,17 mnt | 6/6 PASS |
| rr24-pillar3-disclosure | 45,14 mnt | 6/6 PASS |

**Total lab checks: 142 PASS, 0 FAIL** (harness Pyodide 0.26.4 asli, `/tmp/harness/run_labs.mjs`)

---

## 4. Verifikasi Teknis

- **tsc --noEmit:** BERSIH untuk semua 24 file baru (satu-satunya error adalah `TtsButton.tsx` pre-existing, komponen UI di luar batas file).
- **Durasi:** 24/24 dalam rentang 45–60 menit (model: kata/180 + lab×8 + kuis×2 + chart×2,5 + case×6 + rumus×1).
- **Escaping:** 0/24 file mengandung bug String.raw backslash-ganda (aturan v2: prosa = karakter RAW, entitas HTML hanya di string const SVG).
- **Struktur quiz:** Semua quiz menggunakan format `why` per-opsi sesuai tipe `V2QuizOption` (diperbaiki dari format lama `why` per-pertanyaan pada 10 file).
- **Registrasi:** 24/24 terdaftar di reg-fr.ts (8), reg-cr.ts (6), reg-mr.ts (5), reg-rr.ts (5).

---

## 5. Total Lesson

- **Sebelum ekspansi:** 473 (inventory 2026-10-14)
- **Ekspansi ini:** +24
- **Paralel (tim lain):** +22 (21 lesson wqb1–wqb21 rebuild + 1 rr19-audit-impostor pilot)
- **Sesudah:** **519** lesson terdaftar

---

## 6. Fakta Kunci yang Diverifikasi via Web (2026-10-15)

- **aml16:** Indonesia TIDAK di FATF grey list — anggota penuh FATF ke-40 sejak 27 Okt 2023.
- **cr27:** Draft Pasal 149A (RUU P2SK revisi) & TWP90 Jul 2026 = 4,32%.
- **aml12:** Skor Bina Karsa = 10 (bukan 9).

---

## 7. File

- Konten: `~/workspace/learn-platform/src/app/v2/content/{aml12..aml19,mr20..mr24,rr20..rr24,cr26..cr31}-*.ts`
- Registry: `~/workspace/learn-platform/src/app/v2/lib/reg-{fr,cr,mr,rr}.ts`
- Peta ebook: `~/workspace/learn-platform/EKSPANSI_2026-10-14/ebook_maps.md`
- Standar: `~/workspace/learn-platform/WORKFLOW.md` v2.0
- QA: `~/workspace/learn-platform/RAPAT_VERIFIKASI_2026-10-14.md`
- Laporan ini: `~/workspace/learn-platform/LAPORAN_EKSPANSI_2026-10-15.md`

---

**TIDAK DEPLOY** — menunggu verifikasi gabungan dan perintah parent.
