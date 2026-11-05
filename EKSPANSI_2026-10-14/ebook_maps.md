# Peta Ebook → Topik Lesson (Bedah Ebook per Role)

**Tanggal:** 2026-10-14 · **Sifat:** read-only, dari halaman publik penerbit/penjual resmi + pratinjau resmi. Tidak mengunduh/membajak buku.
**Aturan bukti:** setiap klaim isi bab dilacak ke URL yang dicantumkan. Judul bab = fakta, bukan kutipan isi buku.
**Cakupan role:** Credit Risk Analyst, Fraud/AML Analyst, Market Risk Analyst, Risk Reporting/Data.

## Konteks yang sudah ditetapkan (JANGAN diduplikat)

15 topik riset terpisah — status "DI 15 TOPIK", slug terkunci:
aml12 bribery & corruption · aml13 cybercrime-enabled laundering · aml14 RegTech/AI/pKYC ·
aml15 sanctions evasion · aml16 grey list FATF Indonesia · aml17 fraud-AML-cyber fusion center ·
cr26 private credit · cr27 credit risk fintech lending 2026 · cr28 climate risk kredit ·
mr20 model risk management SR 11-7 → AI governance · mr21 crypto market risk ·
mr22 geopolitical risk & scenario design ·
rr19 laporan likuiditas LCR/NSFR · rr20 sustainability/ISSB reporting · rr21 operational risk reporting RCSA.

Nomor lanjut yang dipakai di bawah: cr29+, mr23+, aml18+, rr22+.
Cek duplikasi dilakukan via `grep -ril` pada `~/workspace/learn-platform/src/app/v2/content/` per kandidat (bukan dari ingatan).

**Legenda status:** SUDAH ADA (slug) · DI 15 TOPIK · KANDIDAT BARU (slug) · DILEWATI (alasan)

---

## Sumber 1 — John C. Hull, *Risk Management and Financial Institutions*

- **Edisi:** 6th Edition (edisi terbaru yang halamannya ditemukan) · **Penerbit:** Wiley (Wiley Finance)
- **Tahun:** Februari 2023 · **ISBN-13:** 9781119932482 · **Halaman:** 832
- **URL TOC (pratinjau resmi/penjual):**
  - https://www.wiley-vch.de/en/areas-interest/finance-economics-law/risk-management-and-financial-institutions-978-1-119-93248-2 (situs resmi Wiley — memuat daftar isi penuh)
  - https://www.antoineonline.com/intr/en/p/Risk%20Management%20and%20Financial%20Institutions%20%20Sixth%20Edition-Hull%20%20J/9781119932482 (koroborasi)
  - https://coopzone.ca/produit/1603851-risk-management-and-financial-institutions-6th-edition (koroborasi)
- **Catatan:** halaman produk wiley.com langsung menolak akses bot (HTTP 403) — tidak diulang; TOC diambil dari wiley-vch.de (milik Wiley) yang memuat daftar isi identik.

| Bab | Topik | Status |
|---|---|---|
| 1. Introduction: Risk-Return Trade-offs | Dasar risk-return | DILEWATI (terlalu dasar untuk analis) |
| 2. Banks | Anatomi bank | DILEWATI (konteks umum; produk bank sudah di cr1) |
| 3. Insurance Companies and Pension Plans | Asuransi & pensiun | DILEWATI (di luar fokus 4 role) |
| 4. Fund Managers | Manajer dana | DILEWATI (di luar fokus 4 role) |
| 5. Financial Instruments | Instrumen keuangan | SUDAH ADA (mr1-trading-book) |
| 6. The OTC Derivatives Market | Pasar derivatif OTC, clearing, margin | **KANDIDAT BARU (mr23)** — grep "initial margin"/"SIMM"/"central counterparty" = nol |
| 7. Securitization and the Global Financial Crisis | Sekuritisasi, tranche, krisis 2008 | **KANDIDAT BARU (cr29)** — grep "securitisasi"/"securitization" = nol |
| 8. Volatility | Volatilitas | SUDAH ADA (mr2-volatilitas) |
| 9. Correlations and Copulas | Korelasi & kopula | SUDAH ADA (b10-copula; mr2) |
| 10. Valuation and Scenario Analysis | Valuasi & skenario | SUDAH ADA sebagian (mr7; mr15) — DILEWATI |
| 11. Value at Risk and Expected Shortfall | VaR & ES | SUDAH ADA (mr3; mr4; mr5) |
| 12. Historical Simulation and Extreme Value Theory | Simulasi historis & EVT | SUDAH ADA (mr4; b16-heavy-tails-evt) |
| 13. Model-Building Approach | Pendekatan model-building VaR | SUDAH ADA (mr4-var-lanjut) |
| 14. Interest Rate Risk | Risiko suku bunga | SUDAH ADA (mr8-risiko-suku-bunga) |
| 15. Derivatives Risk | Risiko derivatif (Greeks) | SUDAH ADA (mr11-options-risk; Greeks di e11/pm-b6) |
| 16. Scenario Analysis and Stress Testing | Stress testing | SUDAH ADA (mr7-stress-test; cr16) |
| 17. Estimating Default Probabilities | Estimasi PD | SUDAH ADA (cr10-pd-modeling) |
| 18. xVAs | CVA/DVA/FVA | SUDAH ADA (mr14-counterparty-risk) |
| 19. Credit Value at Risk | Credit VaR | SUDAH ADA (cr15-risiko-portofolio) |
| 20. Operational Risk | Risiko operasional | DI 15 TOPIK (rr21, jalur pelaporan) — DILEWATI |
| 21. Liquidity Risk | Risiko likuiditas | SUDAH ADA (mr13); DI 15 TOPIK (rr19 LCR/NSFR) |
| 22. Model Risk Management | Model risk | DI 15 TOPIK (mr20) |
| 23. Climate Risk, ESG, and Sustainability | Risiko iklim/ESG | DI 15 TOPIK (cr28) |
| 24. Enterprise Risk Management | ERM | **KANDIDAT BARU (rr22)** — grep "enterprise risk management" = nol |
| 25. Basel I, Basel II, and Solvency II | Basel I/II | SUDAH ADA (cr4a-basel-rwa-kpmm) |
| 26. Basel II.5, Basel III, and Other Post-Crisis Changes | Basel III | SUDAH ADA (cr4a-basel-rwa-kpmm) |
| 27. Fundamental Review of the Trading Book | FRTB | SUDAH ADA (mr16-regulasi-frtb) |
| 28. Economic Capital and RAROC | Modal ekonomi & RAROC | SUDAH ADA sebagian (RAROC di cr4a/cr15/cr21; "modal ekonomi" di cr21) — DILEWATI |
| 29. Financial Innovation | Inovasi keuangan/fintech | DILEWATI (jalur fintech = cr27, DI 15 TOPIK) |
| 30. Risk Management Mistakes to Avoid | Kesalahan manajemen risiko | DILEWATI (bukan materi analis) |

---

## Sumber 2 — Philippe Jorion, *Value at Risk: The New Benchmark for Managing Financial Risk*

- **Edisi:** 3rd Edition · **Penerbit:** McGraw-Hill · **Tahun:** 2007 · **ISBN-13:** 9780071464956
- **URL TOC (penerbit resmi + katalog):**
  - https://www.mheducation.com.au/ebook-value-at-risk-the-new-benchmark-for-managing-financial-risk-3e-9781307199963-aus (McGraw-Hill Australia — memuat daftar isi per Part)
  - http://libopac.iimv.ac.in/cgi-bin/koha/opac-detail.pl?biblionumber=6036&shelfbrowse_itemnumber=2752 (katalog IIM Visakhapatnam)
  - http://obnb.uk/p13610072-value-at-risk-the-new-benchmark-for-managing-financial-risk (katalog OBNB)

| Bab | Topik | Status |
|---|---|---|
| 1. The Need for Risk Management | Motivasi manajemen risiko | DILEWATI (terlalu dasar) |
| 2. Lessons from Financial Disasters | Pelajaran bencana finansial | DILEWATI (naratif umum) |
| 3. VAR-Based Regulatory Capital | Modal regulasi berbasis VaR | SUDAH ADA (cr4a; mr16) |
| 4. Tools for Measuring Risk | Perangkat ukur risiko | SUDAH ADA (mr2 dkk.) |
| 5. Computing VAR | Komputasi VaR | SUDAH ADA (mr3; mr4) |
| 6. Backtesting VAR | Backtesting | SUDAH ADA (mr6-backtesting) |
| 7. Portfolio Risk: Analytical Methods | Metode analitik risiko portofolio | SUDAH ADA sebagian (mr4) — DILEWATI |
| 8. Multivariate Models | Model multivariat | DILEWATI (tercakup track statistik b9/b10) |
| 9. Forecasting Risk and Correlations | Peramalan risiko & korelasi | SUDAH ADA sebagian (mr2) — DILEWATI |
| 10. VAR Methods | Metode VaR | SUDAH ADA (mr3; mr4) |
| 11. VAR Mapping | Pemetaan faktor risiko (risk factor mapping) | **KANDIDAT BARU (mr24)** — grep "risk factor mapping" = nol |
| 12. Monte Carlo Methods | Monte Carlo | SUDAH ADA (mr4; b12-monte-carlo) |
| 13. Liquidity Risk | Risiko likuiditas / LVaR | SUDAH ADA (mr13-risiko-likuiditas) |
| 14. Stress Testing | Stress testing | SUDAH ADA (mr7-stress-test) |
| 15. Using VAR to Measure and Control Risk | VaR untuk limit & kontrol | SUDAH ADA (mr17-limit-laporan) |
| 16. Using VAR for Active Risk Management | VaR aktif | DILEWATI (terlalu manajerial umum) |
| 17. VAR and Risk Budgeting in Investment Management | Risk budgeting | SUDAH ADA (pm-c4-portfolio-construction) |
| 18. Credit Risk Management | Manajemen risiko kredit | SUDAH ADA (track cr) |
| 19. Operational Risk Management | Manajemen risiko operasional | DI 15 TOPIK (rr21, jalur pelaporan) — DILEWATI |
| 20. Integrated Risk Management | Manajemen risiko terintegrasi | **KANDIDAT BARU (rr22)** — digabung dengan Hull ch.24; grep = nol |
| 21. Risk Management Guidelines and Pitfalls | Pedoman & jebakan | DILEWATI (bukan materi analis) |
| 22. Conclusions | Kesimpulan | DILEWATI |

## Sumber 3 — Bart Baesens, Daniel Rösch & Harald Scheule, *Credit Risk Analytics*

- **Subjudul:** Measurement Techniques, Applications, and Examples in SAS · **Penerbit:** Wiley (Wiley and SAS Business Series)
- **Tahun:** 2016 · **ISBN-13:** 9781119143987
- **URL TOC (penjual resmi + situs penulis):**
  - https://www.ecampus.com/credit-risk-analytics-measurement/bk/9781119143987 (memuat daftar isi per bab)
  - https://www.cede.ch/en/books/?view=detail&id=196246632 (koroborasi daftar isi)
  - https://www.bartbaesens.com/book/6/credit-risk-analytics (situs resmi penulis — metadata buku)

| Bab | Topik | Status |
|---|---|---|
| 1. Introduction to Credit Risk Analytics | Pengantar | SUDAH ADA (cr3-pd-lgd-ead) |
| 2. Introduction to SAS Software | Perangkat SAS | DILEWATI (spesifik tool; platform pakai Python) |
| 3. Exploratory Data Analysis | EDA | SUDAH ADA (track a: a11–a19) |
| 4. Data Preprocessing for Credit Risk Modeling | Preprocessing | SUDAH ADA sebagian (track a/dm; cr7a/b) — DILEWATI |
| 5. Credit Scoring | Credit scoring | SUDAH ADA (cr7a; cr7b) |
| 6. PD: Discrete-Time Hazard Models | Model hazard waktu-diskrit | SUDAH ADA sebagian (cr10-pd-modeling) — DILEWATI |
| 7. PD: Continuous-Time Hazard Models | Model hazard waktu-kontinu | SUDAH ADA sebagian (cr10) — DILEWATI |
| 8. Low Default Portfolios | Portofolio minim default (Pluto-Tasche) | **KANDIDAT BARU (cr31)** — grep "low default" = nol |
| 9. Default Correlations and Credit Portfolio Risk | Korelasi default & risiko portofolio | SUDAH ADA (cr15-risiko-portofolio; b13-vasicek) |
| 10. Loss Given Default (LGD) and Recovery Rates | LGD & recovery | SUDAH ADA (cr12-lgd) |
| 11. Exposure at Default (EAD) and Adverse Selection | EAD & adverse selection | SUDAH ADA (cr13-ead-ccf) |
| 12. Bayesian Methods for Credit Risk Modeling | Metode Bayesian untuk risiko kredit | **KANDIDAT (digabung ke cr31)** — Bayesian umum ada (a212), aplikasi kredit belum |
| 13. Model Validation | Validasi model | SUDAH ADA (cr19-validasi-model) |
| 14. Stress Testing | Stress testing | SUDAH ADA (cr16-stress-testing) |
| 15. Concluding Remarks | Penutup | DILEWATI |

---

## Sumber 4 — Basel Committee on Banking Supervision (bis.org, dokumen publik)

- **URL kerangka resmi:** https://www.bis.org/basel_framework/chapter/CRE/20.htm?inforce=20220101&published=20191215 (bab CRE20 — Standardised approach)
- **URL ringkasan kerangka:** https://www.bis.org/fsi/fsisummaries/rcrf.pdf (revised credit risk framework — SA vs IRB)
- **URL kerangka penuh:** https://bis.org/committees/bcbs/basel-framework/basel-framework.pdf (127 bab, 14 standar)

| Dokumen/Bab | Topik | Status |
|---|---|---|
| CRE20–CRE22 — Standardised approach (individual exposures, ECAI, CRM) | Bobot risiko standar | SUDAH ADA (cr4a-basel-rwa-kpmm) |
| CRE30–CRE36 — IRB approach; specialised lending & supervisory slotting | Specialised lending (project/object/commodities finance, IPRE, HVCRE) + slotting | **KANDIDAT BARU (cr30)** — grep "specialised lending"/"project finance"/"slotting" = nol |
| CRE40–CRE44 — Securitisation framework (SEC-IRBA/ERBA/SA) | Sekuritisasi regulasi | **KANDIDAT (digabung ke cr29)** — sudut pandang regulasi melengkapi Hull ch.7 |
| Output floor 72,5% (phase-in 2023–2027) | Batas bawah RWA model internal | SUDAH ADA (disebut di cr4a) — DILEWATI |
| OPE — Standardised Measurement Approach (SMA) | Pengukuran risiko operasional | DILEWATI (jalur op risk = rr21, DI 15 TOPIK) |
| MAR — FRTB (SA & IMA), CVA framework (MAR50) | FRTB & CVA | SUDAH ADA (mr16-regulasi-frtb; CVA di mr14) |
| SCO — Prudential treatment of cryptoasset exposures | Perlakuan modal aset kripto | DI 15 TOPIK (mr21 crypto market risk) |
| LCR / NSFR | Rasio likuiditas | DI 15 TOPIK (rr19) |
| LEX — Large exposures | Eksposur besar / BMPK | SUDAH ADA sebagian (disebut di cr15/cr21/cr23) — DILEWATI |
| DIS — Disclosure requirements (Pillar 3, 19 bab template) | Keterbukaan Pilar 3 | **KANDIDAT BARU (rr23)** — grep "Pillar 3" = nol |

---

## Sumber 5 — FATF (fatf-gafi.org, publikasi publik)

- **URL daftar publikasi:** https://www.fatf-gafi.org/en/publications.html?hf=10&b=0&s=desc%28fatf_releasedate%29
- **URL berita/publikasi terkini:** https://www.fatf-gafi.org/content/fatf-gafi/en/the-fatf/news.html

| Publikasi | Topik | Status |
|---|---|---|
| Targeted Report on Regulatory Challenges from Decentralised Finance (20 Jul 2026) — melengkapi 2021 Updated Guidance on VAs/VASPs; DeFi dieksploitasi fraudster, ransomware, jaringan pencucian uang profesional, pelaku proliferation financing | Pencucian uang via DeFi (DEX non-kustodian, cross-chain bridge, mixer) | **KANDIDAT BARU (aml18)** — aml9 hanya menyentuh "DeFi" 1x; sudut FATF-2026 belum ada |
| 7th Targeted Update on Implementation of FATF Standards on VAs/VASPs — kepatuhan R.15 lintas yurisdiksi | Travel rule & pengawasan VASP | SUDAH ADA (aml9-virtual-assets; bcd10/bcd11) |
| Risks of Gaming and Gambling (8 Sep 2026) — risiko kasino, platform online, kanal pembayaran, operator ilegal | ML via gaming/judi online | **KANDIDAT BARU (aml19)** — grep "gambling"/"judi online" = nol |
| Underground banking & hawala as key channels for professional money launderers (3 Sep 2026) | Hawala/underground banking | DILEWATI (diprioritaskan di bawah aml18/aml19; batas 9 slot) |
| Public Consultation — Complex Proliferation Financing & Sanctions Evasion Schemes (Feb 2025; amandemen R.1/R.2 INR soal PF risk assessment Okt 2020) | Tipologi proliferation financing & sanctions evasion | DILEWATI (overlap aml15 sanctions evasion, DI 15 TOPIK) |
| FATF Recommendations — INR.15 (new technologies), R.15 VASP licensing/registration | Kerangka VA/VASP | SUDAH ADA (aml9) |

---

## Sumber 6 — OJK & BI (regulasi kredit & APU-PPT 2024–2026, nomor persis)

| Regulasi | Isi pokok | Status |
|---|---|---|
| POJK No. 8 Tahun 2023 — Penerapan Program APU, PPT, dan PPPSPM di Sektor Jasa Keuangan (mencabut POJK 12/POJK.01/2017 jo. 23/POJK.01/2019) | Kewajiban program APU-PPT-PPPSPM bagi PJK, termasuk wali amanat & penyelenggara ITSK | SUDAH ADA sebagian (aml2-kyc-cdd; aml3-edd; aml7-sar) — bahan pendukung aml |
| PBI No. 10 Tahun 2024 — Penerapan APU, PPT, dan PPPSPM bagi Pihak yang Diatur dan Diawasi BI (sumber: https://www.bi.go.id/id/publikasi/peraturan/Pages/PBI_102024.aspx) | 5 pilar kewajiban: direksi/komisaris, KPT, manajemen risiko, SDM, pengendalian internal; CDD & beneficial owner; penerapan pada kelompok usaha | Bahan pendukung aml (khas sistem pembayaran/KUPVA non-bank) |
| PADG No. 15 Tahun 2025 — Pelaksana PBI 10/2024 (efektif 30 Juni 2025; sumber: https://www.bi.go.id/id/publikasi/peraturan/Pages/PADG_152025.aspx) | KPT, proses manajemen risiko, CDD, pengawasan & sanksi administratif | Bahan pendukung aml |
| PADK No. 4 Tahun 2026 — Pedoman Penerapan Program APU, PPT, PPPSPM bagi Wali Amanat (sumber: https://ojk.go.id — FAQ resmi OJK) | Pedoman teknis berbasis risiko bagi wali amanat | Bahan pendukung aml |
| POJK No. 40 Tahun 2024 — LPBBTI (fintech P2P lending); draft amandemen 2026 mewajibkan pooling funds/cadangan pengembalian dana lender (sumber: Kontan via id.tradingview.com, 13 Okt 2026) | Tata kelola & perlindungan lender pindar | DI 15 TOPIK (cr27 credit risk fintech lending 2026) |
| SEOJK No. 19 Tahun 2025 — penyesuaian aturan P2P lending: pelonggaran batas 3 platform bila TWP90 agregat ≤ 5% (sumber: Kontan via tradersunion.com, Sep 2026) | Kualitas analisis pembiayaan & TWP90 | DI 15 TOPIK (cr27) |
| POJK No. 12 Tahun 2026 — EBA-SP untuk pembiayaan perumahan (efektif 17 Sep 2026; mencabut POJK 23/POJK.04/2014 & 20/POJK.04/2017; sumber: OJK via fortuneidn.com) | Fleksibilitas aset & struktur EBA-SP, tata kelola, pelaporan kualitas aset | **Bahan pendukung cr29** (sekuritisasi Indonesia) |
| POJK No. 28 Tahun 2025 — Penerapan Manajemen Risiko bagi Perusahaan Perasuransian, Lembaga Penjamin, dan Dana Pensiun (efektif 1 Jan 2026; sumber: peraturan.go.id) | 4 pilar manajemen risiko PPDP | Konteks rr (bukan topik baru) |
| POJK No. 30 Tahun 2025 — Tata kelola & manajemen risiko ITSK (efektif 1 Jul 2026; sumber: validnews.id) | Risiko strategis/operasional/siber/hukum/kepatuhan/reputasi; laporan profil risiko semesteran | Konteks aml14 (RegTech), DI 15 TOPIK |

---

## Daftar Final — 9 Kandidat Terbaik (maksimal, seimbang antar role)

**Kredit (3):**

1. **Sekuritisasi & risiko kredit terstruktur → cr29** — Belum ada lesson kredit yang membahas sekuritisasi: grep "securitisasi"/"securitization" nol, dan "tranche"/"waterfall"/"MBS" hanya muncul di track portfolio/fixed-income, bukan dari sudut risiko kredit. Padahal ini materi standar analis kredit: struktur SPV, tranching & waterfall pembayaran, credit enhancement, risiko retensi, dan pelajaran krisis 2008 (Hull ch.7; kerangka sekuritisasi Basel CRE40–44) — plus relevansi Indonesia 2026 lewat POJK 12/2026 tentang EBA-SP untuk pembiayaan perumahan. Kedalaman 45–60 menit mudah dicapai lewat studi kasus waterfall + perhitungan subordination.

2. **Specialised lending & supervisory slotting → cr30** — Nol liputan: "specialised lending", "project finance", dan "slotting" tidak ditemukan di seluruh konten. Basel CRE30–36 mengatur project finance, object finance, commodities finance, IPRE, dan HVCRE dengan pendekatan slotting bila PD/LGD tak bisa diestimasi — persis keahlian yang diminta lowongan corporate/project-finance credit analyst Indonesia (infrastruktur, energi). Analitis dan dalam: kriteria slotting, bobot risiko per kategori, studi kasus proyek infrastruktur.

3. **Low default portfolios: estimasi PD dengan data default minim → cr31** — Belum ada ("low default" nol di seluruh konten). Portofolio sovereign, bank, dan large corporate punya data default sangat sedikit sehingga PD tak bisa diestimasi dengan cara biasa — Baesens ch.8 (+ ch.12 Bayesian) membahas pendekatan konservatif Pluto-Tasche dan estimasi Bayesian. Topik ini melatih analis berpikir tentang ketidakpastian estimasi, sangat cocok untuk lesson 45–60 menit yang kuantitatif.

**Market (2):**

4. **Pasar derivatif OTC: clearing, margin & risiko CCP → mr23** — Belum ada: grep "initial margin", "SIMM", dan "central counterparty" semuanya nol. Hull ch.6 membahas arsitektur pasar OTC pasca-krisis: bilateral vs central clearing, variation/initial margin, SIMM, dan default waterfall CCP. Relevan untuk market risk analyst yang berurusan dengan risiko counterparty (melengkapi mr14-counterparty-risk) dan wajib memahami infrastruktur pasar tempat portofolionya diperdagangkan.

5. **Risk factor mapping untuk VaR → mr24** — Belum ada ("risk factor mapping" nol). Jorion ch.11: teknik memetakan posisi — obligasi ke arus kas, opsi ke delta-gamma — menjadi faktor risiko agar VaR bisa dihitung. Ini keterampilan praktis inti analis risiko pasar yang bekerja dengan risk engine, teknis dan dalam, pas untuk 45–60 menit dengan contoh perhitungan mapping.

**Fraud/AML (2):**

6. **Pencucian uang melalui DeFi → aml18** — aml9-virtual-assets hanya menyentuh "DeFi" satu kali; laporan FATF Juli 2026 ("Targeted Report on Regulatory Challenges from Decentralised Finance") menegaskan DeFi — DEX non-kustodian, cross-chain bridge, mixer — makin dieksploitasi fraudster, operator ransomware, jaringan pencucian uang profesional, dan pelaku proliferation financing. Analis AML Indonesia perlu memahami red flags dan tantangan pengawasannya; topik segar 2026 yang belum tercakup di track mana pun.

7. **Risiko pencucian uang gaming & judi online → aml19** — Nol liputan: "gambling" dan "judi online" tidak ditemukan di seluruh konten. Laporan FATF September 2026 ("Risks of Gaming and Gambling") memetakan risiko kasino, platform game online, kanal pembayaran, dan operator ilegal beserta indikator risikonya — sangat relevan dengan konteks Indonesia dan kebutuhan analis AML memonitor kanal pembayaran.

**Risk Reporting (2):**

8. **Enterprise risk management & pelaporan risiko terintegrasi → rr22** — Nol liputan ("enterprise risk management" tidak ditemukan). Hull ch.24 + Jorion ch.20 (integrated risk management): agregasi risiko lintas silo, efek diversifikasi, dan rantai risk appetite → limit → laporan terintegrasi. Ini inti peran risk reporting/data analyst — menyusun dashboard dan narasi risiko tingkat perusahaan — dan melengkapi rr15-risk-appetite serta rr7-dashboard yang sudah ada.

9. **Pillar 3 disclosure & transparency reporting → rr23** — Belum ada ("Pillar 3" nol; hanya disinggung sepintas sebagai "pilar 3" di cr4a/rr4). Basel DIS mengatur template disclosure kuantitatif dan kualitatif untuk semua jenis risiko — pekerjaan nyata analis risk reporting: menyusun dan merekonsiliasi laporan publikasi bank dengan laporan keuangan dan ketentuan transparansi OJK. Dalam dan prosedural, cocok untuk lesson 45–60 menit.

---

## Batasan jujur & catatan metodologi

- Lesson nantinya dibangun dari **ringkasan/parafrase dan fakta/rumus** di peta ini — bukan salinan teks buku.
- Halaman produk wiley.com menolak akses otomatis (HTTP 403); TOC Hull 6th ed. diambil dari **wiley-vch.de** (situs resmi Wiley) dan dikoroborasi dua penjual independen — daftar isi ketiganya identik.
- Untuk Baesens tidak ditemukan edisi ke-2 yang mapan di sumber resmi; yang dipakai edisi 2016 (satu-satunya edisi yang terverifikasi di situs penulis & penjual).
- Regulasi OJK/BI 2026 (POJK 12/2026, PADK 4/2026, draft amandemen POJK 40/2024) diverifikasi lewat pemberitaan (Kontan/FortuneIDN/ValidNews) yang mengutip siaran resmi OJK/BI; nomor peraturan dicatat persis.
- Topik yang dilewati karena keterbatasan 9 slot namun valid: underground banking/hawala (FATF Sep 2026), proliferation financing typologies (overlap parsial aml15), op-risk SMA (jalur rr21 sudah ada), Basel III endgame/output floor (disebut di cr4a).
