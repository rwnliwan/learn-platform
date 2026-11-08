#!/usr/bin/env python3
"""QA Learn — regresi angka yang pernah salah (guard permanen, 2026-11-07).

Kasus: builder Ronde 2 CFA L1 salah hitung waterfall CDO di pm-a7c (memakai
detachment point sebagai notional tranche: senior "tersisa 95", mezzanine
"tersisa 12"). Eksekusi lab TIDAK menangkapnya karena kesalahannya di prose +
quiz, bukan lab. Pelajaran: angka prose/quiz wajib dihitung ulang manual
independen — dan angka yang sudah dikoreksi dikunci di sini sebagai fixture
regresi, supaya kesalahan yang sama tidak kembali lewat edit berikutnya.

Fixture: (file, wajib ADA, wajib TIDAK ADA).
Jalankan: python3 qa_learn_numbers.py
Keluar 0 = lolos; 1 = gagal.
"""
import sys
from pathlib import Path

ROOT = Path.home() / "workspace/learn-platform/src/app/v2/content"

# Waterfall CDO kanonis: pool 100; equity 0-5 (notional 5), mezz 5-15 (10),
# senior 15-100 (85). Kerugian 3 -> (2, 10, 85); 8 -> (0, 7, 85); 20 -> (0, 0, 80).
FIXTURES = [
    (
        "pm-a7c-kredit-sekuritisasi.ts",
        ["Equity 2, mezzanine 10, senior 85",
         "Equity 0, mezzanine 7, senior 85",
         "Equity 0, mezzanine 0, senior 80"],
        ["senior tersisa 95", "mezzanine tersisa 12",
         "senior 95 (notional", "mezzanine 12 (notional"],
    ),
    (
        "pm-a6b-valuasi-lanjutan.ts",
        ["8.412"],  # DDM dua tahap: 1.221,75 + 7.190,90 = 8.412,65
        [],
    ),
    (
        "pm-a8b-harga-opsi.ts",
        ["10,45"],  # Black-Scholes: d1 0,35, d2 0,15 -> call 10,45
        [],
    ),
    (
        "pm-a10b-IPS-risiko.ts",
        ["33 juta", "46,6"],  # VaR95 33 juta / VaR99 46,6 juta (sigma 20 juta)
        [],
    ),
    (
        "pm-a3b-kebijakan-siklus.ts",
        ["16.152", "16.157"],  # IRP 16.000 x 1,06/1,05 = 16.152 (lab);
        # PPP 16.000 x 1,03/1,02 = 16.157 (quiz) — dua konteks berbeda, keduanya benar.
        [],
    ),
    # --- Build gap 13 track non-spec, 2026-11-07 (69 item) ---
    # Group D (WQB/FDP).
    ("fdp7-penyimpanan.ts", ["gross_margin=39.71", "net_margin=9.93"], []),
    (
        "fdp9-market-data.ts",
        ["pe=23.52", "saham=46189233557", "mcap_triliun=76.21"],
        ["76212235469050"],  # mcap salah Rp100.000.000 (sudah diperbaiki)
    ),
    (
        "fdp8-otomasi-penjadwalan.ts",
        ["run1: jalan=12 | sukses=12 | retry=1 | gagal=0 | percobaan=13"],
        [],
    ),
    (
        "wqb30-capstone-akhir.ts",
        ["C5: TAHAN-MARGIN", "C6: TAHAN-OS", "C7: SUBMIT-ATOM",
         "C8: SUBMIT-POWERPOOL", "C9: SUBMIT-PYRAMID"],
        [],
    ),
    (
        "wqb31-operator-lanjutan.ts",
        ["winsor_sum=159", "ts_argmax5=4", "gr_A_20=0.667"],
        [],
    ),
    ("wqb21-capstone.ts", ["Capstone Tengah (Review Wave)"], []),
    (
        "wqb28-portfolio-alpha.ts",
        ["pool = kumpulan alpha milikmu sendiri"],
        ["milikmu maupun pool"],
    ),
    ("fdp6-capstone.ts", [], ["Semua 6 lesson dibaca sampai akhir"]),
    # Group C (BZ/RP/DB/BC).
    (
        "rr33-sql-risk-reporting.ts",
        ["Waterfall: 340 + 45 - 20 - 15 = 350 (NPL 3.40% -> 3.47%, +0.07pp)"],
        # "0,24 pp" SENGAJA tidak jadi must-not: ia distractor kuis yang
        # ditandai salah (selisih angka bulat) — kehadirannya benar.
        # "0,04 pp" (putaran 2): proyeksi NPL yang salah — benar ~0,004 pp.
        ["0,04 pp"],
    ),
    (
        "rr14-capstone.ts",
        ["Dashboard: NPL total 2.86% | Coverage 83.9% | Terburuk: UKM 4.00%"],
        [],
    ),
    (
        "biz14-capstone.ts",
        ["TES GAGAL: 4 dari 4", "TERDAMPAK: dashboard_eksekutif"],
        [],
    ),
    (
        "bcd29-mikrostruktur-pasar.ts",
        ["funding=10.00 USD/8jam, 30.00 USD/hari, 10.95%/tahun | "
         "basis=200 USD (0.30%)"],
        # "0,01%" SENGAJA tidak jadi must-not: itu funding rate per interval
        # yang benar; yang salah hanya "0,01% per tahun".
        ["0,01% per tahun"],
    ),
    (
        "bcd30-keamanan-smart-contract.ts",
        ["Skor audit LendKu: 75/100",
         "Verdict: BELUM LULUS (gagal: oracle, upgrade)"],
        ["85/100"],
    ),
    (
        "bcd4-defi.ts",
        ["Utilisasi 75.0% | HF: A=1.20 B=0.90 C=1.78 | Terlikuidasi: B | "
         "Harga likuidasi: 2500 USD"],
        ["B=1,20", "B 1,20"],
    ),
    (
        "bcd12-capstone.ts",
        ["Dashboard LendKu: Utilisasi 75.0% (WASPADA) | HF: A=1.20 B=0.90 "
         "C=1.78 | At-risk: 100 ribu USD"],
        [],
    ),
    (
        "dba12-capstone.ts",
        ["PITR: loss 7 mnt (RPO<=15: LOLOS) | RTO 37 mnt (RTO<=60: LOLOS)"],
        [],
    ),
    # Group A (ME/DE/MO/LO).
    (
        "mle1-lanskap.ts",
        ["hemat_vs_rule=Rp486.400.000", "layak=True"],
        ["Rp1.034,000,000"],  # format koma (bug: ribuan harus titik)
    ),
    (
        "mle4-evaluasi.ts",
        ["mcnemar_chi2=4.84", "p=0.0278", "wilson_B=(0.805, 0.901)"],
        ["p=0.05"],
    ),
    (
        "mle20-recommender-systems.ts",
        ["cost_b=Rp330.000", "w_pos=65.67"],
        ["pilihan=A"],
    ),
    (
        "mlops7-monitoring.ts",
        ["burn_jam1=4.5x -> PAGE", "burn_jam2=1.2x -> TIKET"],
        [],
    ),
    (
        "llmops6-cost.ts",
        ["gabung=6.0jt", "hemat=87.50%"],
        ["gabung=1.5jt"],
    ),
    (
        "llmops12-capstone.ts",
        ["ci_gate=4/4 lolos", "verdict=LULUS", "margin_faithfulness=0.02"],
        [],
    ),
    ("llmops5-guardrail.ts", ["temuan=2", "verdict=ROTASI_SEGERA"], []),
    # Group B (AE/AG/DL).
    (
        "aai12-capstone.ts",
        ["langkah=5", "macet=3", "npl=20.0", "skor=1.0", "trace=4",
         "kirim_tanpa_izin=ditolak", "kirim_dengan_izin=terkirim",
         "tools=2", "macet_mcp=3", "unknown=ditolak"],
        [],
    ),
    (
        "aie12-capstone.ts",
        ["total=1500000", "$0,00105 per request; $157,50 per bulan"],
        [],
    ),
    ("aie17-visual-retrieval.ts", ["cer_rata=0.108", "lolos=1/3"], []),
    ("aai10-framework.ts", ["llamaindex=4.0", "pemenang=llamaindex"], []),
    ("aai1-lanskap.ts", ["p_d=0.684", "p_e=0.713", "selisih=0.029"], []),
    ("aai8-evaluasi.ts", ["ci_bawah=0.738", "ci_atas=0.942"], []),
    ("aai4-memory.ts", ["top1=s1 skor=0.429", "top2=s5 skor=0.250"], []),
    (
        "dle12-capstone.ts",
        ["probe_train=0.917", "lora_train=1.000", "test=0.833",
         "param_latih=51", "TP=2 TN=3 FP=0 FN=1", "precision=1.000",
         "recall=0.667", "cer_rata=0.108", "lolos=1/3",
         "keputusan=review manual"],
        [],
    ),
    ("dle1-lanskap.ts", ["onehot=976", "embedding=372", "hemat=604"], []),
    ("dle2-nn.ts", ["w_baru=0.7689"], []),
    ("dle5-transformer.ts", ["bobot_diag=0.452"], []),
    ("dle27-fondasi-representasi.ts", ["loss=0.479"], []),
    (
        "aai17-a2a-protocol.ts",
        ["23 Jun 2025"],  # donasi A2A ke Linux Foundation (bukan 2026)
        ["Linux Foundation (2026)"],
    ),
    # --- Build G2 + G3 + G4 (PM), 2026-11-08 (ACC Septian 01:32-01:33) ---
    (
        "pm-cfa-mock-exam-2.ts",
        ["Taylor 5,75%", "15.514,71", "15.221,67",
         "WACC 11,62%", "8.240", "7.255,81",
         "14,4%", "TVPI 1,375x", "1.500 miliar"],
        # "DPI 1,375x" SENGAJA tidak jadi must-not: ia distractor kuis yang
        # ditandai salah (urutan metrik PE tertukar) — kehadirannya benar.
        ["15.514,71 — AUR diperkirakan menguat"],
    ),
    (
        "pm-a1c-ethics-vii.ts",
        ["VII(A)", "VII(B)", "I(D)"],
        [],
    ),
    (
        "pm-a1d-ethics-basis-suitability.ts",
        ["r_butuh=9.2%", "shortfall_a=1.68pp", "loss_b_2sd=-740",
         "layak_b=False"],
        [],
    ),
    (
        "pm-capstone.ts",
        ["E[R]=8.4%", "SD=11.02%", "Sharpe=0.49", "cushion=1.4pp",
         "108,38%", "alloc=+0.25%", "selec=-0.25%", "inter=-0.15%",
         "jual_saham=128.16", "beli_alt=128.16"],
        ["funded status 109,09% (dari 109,09%)"],
    ),
    # --- Fix putaran 2 (Kimi K3/glm-5.3), 2026-11-08 ---
    # LLMOps10: binomial P(X>=4|p=0,02,n=50) = 1,78% (bukan 13%); lab seed 42
    # = 6 error = 12% (bukan 4 error). "8% (4 error)" SENGAJA tidak jadi
    # must-not: 4/50 = 8% benar sebagai deskripsi skenario; yang salah hanya
    # klaim peluang 13% + argumen noise-nya.
    (
        "llmops10-deploy.ts",
        ["1,8%: BUKTI KUAT", "6 error (12%)"],
        ["13%: KOINTOS"],
    ),
    # AAI15: 1-p^(n+1) dgn p=0,25 -> 93,75/98,4/99,6%; n = 2.944.
    (
        "aai15-hardening-deploy.ts",
        ["93,8%", "2.944"],
        ["n sekitar 2.000"],
    ),
    # CR13: lab-utilisasi n 5.000 -> 200.000 (seed 77): nilai empiris kini
    # cocok analitik 1,32%/4,34%/3,30; klaim "32%" -> 18,9% (14/74).
    (
        "cr13-ead-ccf.ts",
        ["rendah=1.30 tinggi=4.34 rasio=3.3"],
        ["rendah=0.66 tinggi=6.15 rasio=9.3", "32% dari EAD"],
    ),
    # BCD14: 90 hari = 648.000 blok x ~200 tx = ~130 jt tx (bukan 1,5 M);
    # scan ~3,6 jam (bukan 42 jam).
    (
        "bcd14-indexing-skala-besar.ts",
        ["130 juta", "3,6 jam"],
        ["1,5 miliar", "42 jam"],
    ),
    # FR11: net saving -Rp394 jt/bulan (biaya FP per HARI, bukan per bulan).
    # "113,5" SENGAJA tidak jadi must-not: ia muncul di kalimat yang
    # secara eksplisit MENCABUT klaim lama ("klaim ... runtuh").
    (
        "fr11-threshold.ts",
        ['−Rp619 juta/bulan', '69,0%', '307/445', '84,9%', 'Rp750 juta/bulan'],
        ['net −Rp394 juta/bulan'],
    ),
    # DLE27: tau=0,2 -> loss TURUN ke 0,106 (bukan naik).
    (
        "dle27-fondasi-representasi.ts",
        ["loss TURUN menjadi 0,106"],
        ["turunkan suhu ke 0,2 dan loss naik"],
    ),
    # MK10: minicase SegarSari — efek Rp2jt TIDAK TERDETEKSI (MDE Rp28,3jt).
    (
        "mk10-incrementality.ts",
        ["TIDAK TERDETEKSI"],
        [],
    ),
    # --- Build gap Coursera Grup A (Fondasi), 2026-11-08 ---
    # D23: Kartu 1,5%+2.500 -> 32.500+5.000; Transfer 12 jt gratis, 3 jt 6.500;
    # QRIS 1 jt cap 5.000, 400 rb 2.800. Total 56.800. VA 5 jt -> 9.000.
    (
        "d23-oop-formal.ts",
        ["Total 56.800 = 32.500 + 10.000 + 0 + 6.500 + 5.000 + 2.800",
         "5.000.000 berarti biaya 4.000 ditambah 5.000 = 9.000"],
        [],
    ),
    # D24: 5 produk, harga 85.000+32.000+45.000+21.000+145.000 = 328.000;
    # rata-rata 328.000/5 = 65.600.
    (
        "d24-web-scraping.ts",
        ["85.000 tambah 32.000 tambah 45.000 tambah 21.000 tambah 145.000 sama dengan 328.000",
         "dibagi 5 sama dengan 65.600"],
        [],
    ),
    # C27: lab 1 -> 4 baris, total 39.750.000; lab 2 audit: id 4 UKM
    # 15.750.000 -> 1.575.000 (satu nol hilang).
    (
        "c27-ddl-dml.ts",
        ["39.750.000", "15.750.000, saldo baru 1.575.000"],
        [],
    ),
    # DM28: hilang 40 baris (Ritel 30, UKM 5, Korporat 5); selisih saldo
    # 40.000.000; rata-rata 1.000.000; match rate 99,9968 persen;
    # cutover 24,47 + validasi 10 + buffer 15 = 49,47 menit (~50).
    (
        "dm28-migrasi-data.ts",
        ["99,9968 persen", "49,47 menit", "40.000.000"],
        [],
    ),
    # --- Build gap Coursera Grup B (Data Infra / BI), 2026-11-08 ---
    # DBA26: 240 baris, 237 sel redundan (98,75%); denormalisasi 6.000.000
    # tulis/hari; rebuild 12 mnt/jam = 288 mnt = 4,8 jam/hari.
    (
        "dba26-normalisasi-dba.ts",
        ["sel_redundan=237", "redundan_persen=98.75", "tulis_tambahan=6000000"],
        [],
    ),
    # DBA27: pool 12,0 GB; hit ratio 96,0%; mysqldump 120,0 mnt; XtraBackup 36,0 mnt.
    (
        "dba27-administrasi-mysql.ts",
        ["pool_gb=12.0", "hit_ratio=96.0", "dump_menit=120.0", "xtra_menit=36.0"],
        [],
    ),
    # DBA28: WAL 13.824,0 MB/hari; bloat 70,0%; autovacuum trigger 12.000.050;
    # sisa waktu insiden ~57 menit (544/576 jam = 0,94 jam — BUKAN 54 menit,
    # itu artefak pembulatan ganda, dikoreksi koordinator 8 Nov).
    (
        "dba28-administrasi-postgresql.ts",
        ["wal_hari_mb=13824.0", "bloat_persen=70.0", "autovacuum_trigger=12000050"],
        [],
    ),
    # DBA29: total tunggu 26,0 dtk; rantai 24,7 dtk; sesi paling lama s5;
    # 45/47 deadlock sukses retry pertama = 95,7%.
    (
        "dba29-transaksi-konkurensi-dba.ts",
        ["total_tunggu=26.0", "tunggu_rantai=24.7", "sesi_paling_lama=s5"],
        [],
    ),
    # MK29: part-worth harga +1,83/0/−1,83 (eksak 25/3, 14/3 → rentang 11/3);
    # importance harga 55,0%; prediksi profil baru 8,0; WTP kamera Rp2.181.818
    # = 24.000.000/11; WTP baterai Rp1.090.909 = 12.000.000/11.
    # Fix R3: kombinasi Rp3jt–6000–108MP diprediksi 9,83 (bukan "tertinggi 8,0").
    (
        "mk29-conjoint-analysis.ts",
        ["harga_range=3.67", "penting_harga=55.0", "prediksi=8.0", "Rp2.181.818",
         "9,83"],
        ["TERTINGGI dari semua kombinasi"],
    ),
    # MK30: n = 385 (384,16 → ceil); response rate 19,25%; NPS 34 (52−18);
    # kepuasan tertimbang 3,78.
    # Fix R3: margin 3% -> ceil(1067,11) = 1.068 (bukan 1.067).
    (
        "mk30-riset-pasar-survei.ts",
        ["n=385", "response_rate=19.25", "nps=34.0", "kepuasan_tertimbang=3.78",
         "menjadi 1.068"],
        ["menjadi 1.067"],
    ),
    # MK31: baris bersih 45.550 (91,1%); GA4 selisih 4,2%; Facebook 24,4%
    # → 1,7% setelah dedup.
    (
        "mk31-kualitas-data-rekonsiliasi.ts",
        ["baris_bersih=45550", "bersih_persen=91.1", "fb_selisih=24.4", "fb_bersih_selisih=1.7"],
        [],
    ),
    # --- Build gap Coursera Grup C (AI/ML), 2026-11-08 ---
    # MLE29: lag-OLS 2-lag (lag 1 + lag 4) MAE 2,50; naive 9,00; musiman 20,00.
    # Tren 16 minggu = 5,05 (bukan 5,11 — itu slope 12 minggu pertama).
    (
        "mle29-time-series-ml.ts",
        ["lag-OLS MAE=2.50", "naive MAE 9,0", "seasonal naive MAE 20,0", "tren naik 5,05"],
        ["lag-OLS MAE=0.37"],
    ),
    # DLE28: kernel [0,5;0,3;0,2] -> conv 105,5..134,4; MAE 3,60; RF 31.
    (
        "dle28-sequence-forecasting.ts",
        ["MAE 3,60", "134,4, lalu 134,8, lalu 135,7", "rf=31"],
        [],
    ),
    # DLE29: 2,5 dtk @16 kHz = 248 frame; WER 20,00%.
    # Fix R3: 39.600/160 = 247,5 TIDAK habis dibagi — total 248 via CEILING.
    (
        "dle29-speech-audio.ts",
        ["frames=248", "wer=20.00%", "ceil(247,5) = 248"],
        ["39.600 habis dibagi 160"],
    ),
    # MLOps23: backoff 60/120/240 (total 420 dtk); terburuk 27 mnt; backfill 189 mnt.
    (
        "mlops23-airflow-orkestrasi.ts",
        ["terburuk=27 menit", "backfill=189 menit"],
        [],
    ),
    # LLMOps22: delta (argumen sigmoid) 0,05 -> loss DPO 0,6685; bias panjang 60,00%.
    (
        "llmops22-rlhf-dpo-ops.ts",
        ["loss 0,6685", "gerbang=LOLOS", "bias panjang 60,00 persen"],
        [],
    ),
    # AAI22: routing hemat 46,67% (bukan 38,15% — itu skenario lab AAI11).
    # Fix R3: eksperimen harga kecil Rp100 -> hemat 23,33% (bukan 26,67%);
    # mini-case 80/20 -> hemat 53,33% (bukan 46,67%). Lab 46,67% BENAR.
    (
        "aai22-pola-desain-agen.ts",
        ["hemat_routing=46.67%", "react=Rp2700", "routing=Rp16000",
         "23,33 persen", "53,33 persen"],
        ["hemat_routing=38.15%", "26,67%"],
    ),
    # --- Build gap Coursera Grup D (Finance/Risk), 2026-11-08 ---
    # E30: fee QRIS 210 rb + transfer 5,2 jt + kartu 2,6 jt = 8.010.000 (5,34%).
    (
        "e30-fintech.ts",
        ["total_fee=8010000", "efektif=5.34 persen"],
        [],
    ),
    # PM-C12: RBSA grid search -> LV 0,50 / LG 0,10 / SV 0,30 / SG 0,10; R2 0,949.
    (
        "pm-c12-style-analysis.ts",
        ["LV=0.50 LG=0.10 SV=0.30 SG=0.10", "R2=0.95"],
        [],
    ),
    # PM-C13: fee 2% -> Rp17,91 M; fee 0,5% -> Rp20,61 M; drag Rp2,70 M.
    # Fix R3: skor kapasitas C 5 -> 2 ("kapasitasnya nyaris penuh") -> C = 3,25.
    (
        "pm-c13-manager-selection.ts",
        ["skor A=3.50 B=4.40 C=3.25", "drag=2.70 miliar"],
        ["C=3.55"],
    ),
    # CR41: Merton r=3%: A d2 2,08 PD 1,89%; B d2 0,27 PD 39,45%.
    # Fix R3: V=99 -> PD 53,33% (d1 0,22, d2 -0,08) — jauh dari "hampir pasti".
    (
        "cr41-merton-kmv.ts",
        ["A: d2=2.08 PD=1.89 persen", "B: d2=0.27 PD=39.45 persen",
         "PD naik menjadi 53,33 persen"],
        ["default hampir pasti"],
    ),
    # CR42: Altman Z sehat 2,633 (abu-abu) / rapuh 0,648 (distress).
    (
        "cr42-altman-zscore.ts",
        ["Z sehat=2.633 (abu-abu) PD=4.5 persen", "Z rapuh=0.648 (distress) PD=22.0 persen"],
        [],
    ),
    # FDP10: NI 163,8; CFO 195,8; kas akhir 150,28; selisih neraca 0,00.
    (
        "fdp10-model-tiga-laporan.ts",
        ["laba_bersih=163.80  kas_akhir=150.28  selisih_neraca=0.00"],
        [],
    ),
    # WQB32: log-price OLS beta 0,8462; z 2,14; rho AR(1) 0,572; half-life 1,24.
    (
        "wqb32-pairs-trading.ts",
        ["beta=0.85 z_last=2.14 rho=0.57 half_life=1.24 hari"],
        [],
    ),
    # WQB33: VWAP 100,7677; IS 76,77 bps; partisipasi 30,77%; impact 34,62 bps.
    (
        "wqb33-eksekusi.ts",
        ["vwap=100.77 is=76.77 bps", "impact_model=34.62 bps"],
        [],
    ),
    # --- Build gap Coursera Grup E (Domain), 2026-11-08 ---
    # BCD31: avalanche 62/64 hex; Merkle root 8 tx; RSA sig 2746 (123^2753 mod 3233).
    (
        "bcd31-kriptografi.ts",
        ["root=8c7f265871b5605623de3cdfcfa68f8a7ac3865e2ad0fca9e9d67cd2ac7601e3", "sig=2746", "beda=62"],
        [],
    ),
    # BI25: BWT(BANANA$) = ANNB$AA; ANA = 2 (tumpang tindih; str.count memberi 1).
    # Fix R3: 3x10^9 x 150 = 4,5x10^11 = 450 miliar (bukan triliun).
    (
        "bi25-indeks-aligner.ts",
        ["bwt=ANNB$AA", "ANA=2", "450 miliar"],
        ["ANA=1", "450 triliun"],
    ),
    # BI26: size factor median-of-ratios [0,71; 1,41; 0,71; 1,41]; g4 FC 3,0, log2FC 1,58.
    (
        "bi26-bioconductor.ts",
        ["sf=[0.71, 1.41, 0.71, 1.41]", "log2fc_g4=1.58"],
        [],
    ),
    # BI27: hipergeometrik N=20.000, n=500; respirasi p 8,218e-20; signifikan FDR 3.
    (
        "bi27-enrichment.ts",
        ["p_respirasi=8.218e-20", "signifikan=3"],
        [],
    ),
    # HD33: 8 pasien; BMI 27,12 (27,125, pembulatan Python); selisih sistolik 33,0.
    # Fix R3: usia eksperimen (416+40)/9 = 50,67 -> 50,7 (bukan 51,8).
    (
        "hd33-fondasi-r.ts",
        ["prev=62.5", "selisih=33.0", "menjadi 50,7"],
        ["51,8"],
    ),
    # HD34: dense 129.024; LSTM 6.272; ambang 0,19 (mean 0,05 + 2xSD 0,07).
    # Fix R3: growth-16 total 9x16x352 = 50.688 = 39,3% (bukan 64.512/separuh).
    (
        "hd34-deep-learning-kesehatan.ts",
        ["dense=129024", "lstm=6272", "ambang=0.19", "50.688", "39,3 persen"],
        ["64.512", "tepat separuh"],
    ),
    # HD35: komposit 84,2 (rata-rata 90/81/80/80/90); vonis LAYAK (min 80,0).
    (
        "hd35-surveilans-end-to-end.ts",
        ["komposit=84.2", "vonis=LAYAK"],
        [],
    ),
    # --- Fix putaran 3 (Kimi K3), 2026-11-08 ---
    # B12: sigma pi-hat = 4 x 0,4106 = 1,6422 (bukan 0,4106) -> N ~10,4 juta.
    (
        "b12-monte-carlo.ts",
        ["N \u2248 10,4 juta"],
        ["N \u2248 650 ribu"],
    ),
    # PM-B6: swap terima-tetap V = PV(fixed) - PV(floating) = +632.759;
    # solusi lab v = pv_fixed - pv_float (bukan kebalikannya).
    (
        "pm-b6-valuasi-derivatif.ts",
        ["632.759", "v = pv_fixed - pv_float"],
        ["pv_float - pv_fixed"],
    ),
    # --- Build nice-to-have Coursera, 2026-11-08 (115 lesson) ---
    # Angka kunci baru, semua hitung ulang manual independen (koordinator/finisher).
    (
        "e34-swap-valuasi.ts",
        ["10.094.131.684", "94.131.684"],  # PV fixed 700/1,06+10.700/1,065^2; swap -94.131.684
        [],
    ),
    (
        "cr44-model-portofolio-kredit.ts",
        ["12,86", "64,30", "54,30"],  # Vasicek z=-1,1330 -> PD 12,86%; VaR99 64,30; UL 54,30
        [],
    ),
    (
        "mr37-evt-var-es.ts",
        ["4,76", "5,68"],  # VaR99,9 4,76%; ES 5,68%
        [],
    ),
    (
        "fr25-fraud-triangle-fraud-tree.ts",
        ["31.250", "44,8"],  # 86x125+26x250+8x1750=31.250; 14.000/31.250=44,8%
        [],
    ),
    (
        "wqb35-treynor-jensen.ts",
        ["11,25", "4,2"],  # Treynor 11,25%; Jensen 4,2%
        [],
    ),
    (
        "mle30-deep-rl-terapan.ts",
        ["17,65", "0,63"],  # Bellman 10+0,9x8,5=17,65; epsilon eps100=0,63
        [],
    ),
    (
        "de31-scd-type-1-2-3.ts",
        ["10 baris"],  # Type 2: 4+2+1+0+3=10 baris
        [],
    ),
    (
        "bcd32-smart-contract-dapp.ts",
        ["1.934"],  # batching harian 1.934 dolar (pernah salah tulis 1.893)
        ["1.893"],
    ),
    (
        "dm29-inmon-vs-kimball.ts",
        ["75 persen", "29,4 persen"],
        [],
    ),
    (
        "hd38-mimic-iii.ts",
        ["13,2 persen"],
        [],
    ),
    (
        "fdp11-variance-analysis-budgeting.ts",
        ["8.000.000"],
        ["Rp36 jt"],  # R4: "Rp40jt - Rp4jt = Rp36jt favourable" SALAH; benar +Rp8jt
    ),
    (
        "e32-konvensi-obligasi.ts",
        ["2.000.000"],  # accrued interest
        [],
    ),
    (
        "rr37-economic-capital-raroc.ts",
        ["26,3 persen"],
        [],
    ),
    (
        "mk36-regresi-marketing.ts",
        ["R-kuadrat 0,6"],
        [],
    ),
    (
        "dle30-neural-style-transfer.ts",
        ["6,5 (alpha=1, beta=100)"],
        [],
    ),
    (
        "llmops26-safety-score-berkelanjutan.ts",
        ["95,2"],
        [],
    ),
    # --- Review Ronde 4 Terra (fix), 2026-11-08 ---
    # DBA33: 40.000 MB / 600 MB per detik = 66,7 DETIK (bukan menit).
    (
        "dba33-data-pump-sqlloader-flashback.ts",
        ["66,7 detik", "33,3 detik"],
        ["sama dengan 66,7 menit"],
    ),
    # cr45: 10 miliar + 0,36 juta = Rp10,00036 miliar (bukan 10,36).
    (
        "cr45-cva-kredit.ts",
        ["10,00036", "nilai_wajar=9999.64228"],
        ["10,36 miliar"],
    ),
    # FDP11: varians laba +Rp8jt favourable (bukan total 36jt).
    (
        "fdp11-variance-analysis-budgeting.ts",
        ["laba_var=8000000"],
        ["total_var=36000000"],
    ),
    # FR33 eksperimen: >12.000 = 10, selisih 12 (hitungan utama 22/15 benar).
    # (String eksperimen dicek via lab regression; fixture prose di sini.)
    # LLMOps26: skenario mustahil diganti — komposit maks 94,6 / 89,5.
    (
        "llmops26-safety-score-berkelanjutan.ts",
        ["Skor 95,2 tetapi PII 84"],
        ["Skor 96 tetapi PII 82"],
    ),
    # LLMOps24: hemat 768.000/3.328.000 = 23,1% (bukan 30%).
    (
        "llmops24-pipeline-sft.ts",
        ["23,1 persen dari total tanpa packing"],
        [],
    ),
    # MLE32: paritas = maks 0,01 DAN rata-rata < 0,002.
    (
        "mle32-edge-ml-onnx-tflite.ts",
        ["rata-rata di bawah 0,002"],
        [],
    ),
    # AAI26 ToT: 27 = daun; total 39 node; beam evaluasi 21.
    (
        "aai26-penalaran-agen.ts",
        ["node_maks=39", "node_evaluasi=21"],
        ["node_maks=27", "node_evaluasi=9"],
    ),
    # DLE31: tabel emisi HMM valid; Viterbi NVN = 0,0350.
    (
        "dle31-nlp-klasik.ts",
        ["0,0350"],
        [],
    ),
    # BCD33: ambang 4 -> total sah 6, down 1 (bukan 16/5).
    (
        "bcd33-fabric-corda.ts",
        ["total sah menjadi 6"],
        [],
    ),
    # RR35: aturan ATAU (dampak>=4 ATAU keuangan>=4) -> 7 topik material.
    (
        "rr35-gri-csrd.ts",
        ["7 topik"],
        ["Skor topik adalah perkalian keduanya"],
    ),
    # AAI27: hemat total operasi 77,0% (bukan 94,0% sebagai total).
    (
        "aai27-ekonomi-operasi-agen.ts",
        ["77,0 persen total operasi"],
        ["Angka ini jujur karena kegagalan sudah masuk hitungan"],
    ),
    # AIE27: konvensi 10.000 query/BULAN (C $25.000/bulan).
    (
        "aie27-pemilihan-model-benchmarking.ts",
        ["10.000 query/bulan"],
        ["10.000 query/hari"],
    ),
    # MLOps27: rata-rata latensi 78,5 ms (jumlah 1.570 ms; bukan 75,9 / 85,1).
    (
        "mlops27-load-testing-serving.ts",
        ["78,5"],
        ["75,9"],
    ),
    # E35 Taylor: inflasi 5,5% -> 8,0% (bukan 6,5%).
    (
        "e35-kebijakan-moneter.ts",
        ["8,0"],
        [],
    ),
    # FR25: pangsa FSF 48,1% (bukan 47,1%).
    (
        "fr25-fraud-triangle-fraud-tree.ts",
        ["48,1"],
        ["47,1"],
    ),
    # --- Review Ronde 5 Terra (fix), 2026-11-08 ---
    # Angka lama yang masih muncul HANYA di paragraf koreksi yang secara
    # eksplisit mencabutnya ("rumus lama SALAH", "BUKAN Rp851 juta") SENGAJA
    # tidak jadi must-not — kehadirannya benar sebagai penanda koreksi.
    # AIE10: teoretis 1-0,25^3 = 98,44% (bukan 0,5% kegagalan); 99,5% =
    # hasil empiris satu seed (199/200).
    (
        "aie10-deploy.ts",
        ['1 − 0,256³ ≈ 98,3%', '199/200 = 99,5 persen'],
        ['1 − 0,25³ = 98,44 persen', 'dilipatgandakan menjadi 0,5'],
    ),
    # AAI10: checkpoint 14/0,9 = 15,6 menit, hemat 27% (bukan 14,4 / 32%);
    # lab crash node 3 -> total 18 menit; expected node_dieksekusi 3.
    (
        "aai10-framework.ts",
        ["14 / 0,9 = 15,6 menit", "node_dieksekusi=3"],
        [],
    ),
    # B4: posterior eksak 0,0902 (9,02%) — bukan 9,09% (itu 1/11 dari frekuensi
    # yang dibulatkan; check lab menegaskan 0,99/10,98 ≈ 0,0902).
    (
        "b4-bayes.ts",
        ['p=9.02%', 'posterior=0.0902', 'POSTERIOR — hasil setelah melihat pintu 3 dibuka', 'prior pintu 2 tetap 1/3'],
        ['p=9.09%', '(peluang 2/3), ia dipaksa'],
    ),
    # BCD10: taint G = 15% x (15/50) = 4,5%; dusting 0,008 ETH.
    (
        "bcd10-graph.ts",
        ['4,5%', '0,008 ETH', 'syarat PERLU, bukan syarat CUKUP'],
        ['jalur dengan jam adalah bukti'],
    ),
    # CR10: KPMM 14/1,30 = 10,8%; ECL lifetime 5,21% (2,00+1,764+1,443).
    (
        "cr10-pd-modeling.ts",
        ['10,8%', '5,21%', 'PD-nya sudah 100%', '5,20754%'],
        ['ECL Stage 2/3', 'Satu-satunya cara yang benar'],
    ),
    # DE10: salting dua tahap; maks per sub-key 30; bottleneck 3,0x (bukan 28 / 3,2x).
    (
        "de10-spark.ts",
        ['maks_subkey=30', 'rasio_partisi=3.0x'],
        ['maks_dengan=28', '3.2x', 'bottleneck_menyusut'],
    ),
    # DLE10: parameter kanonis 109.386 (bukan 109.486).
    (
        "dle10-deploy.ts",
        ['109386', '400 juta parameter FP32 = 1,6 GB', '1,6 GB menjadi 400 MB', '50 MB (32x!)'],
        ['109486', '1,7 GB', '425 MB'],
    ),
    # E10: basis = 16.700-16.620 = Rp80 (bukan Rp120 — itu futures-forward);
    # PV(K) 94,18; arbitrase paritas 7,82.
    (
        "e10-derivatif.ts",
        ["Rp80 per dolar", "94,18", "7,82"],
        ["bocor Rp120 per dolar"],
    ),
    # DBA33: rescue 16:39-16:40 via flashback AS OF 16:39:59 (baris itu ikut
    # terhapus DELETE); transaksi SETELAH 16:40 via SELECT tabel SAAT INI.
    (
        "dba33-data-pump-sqlloader-flashback.ts",
        ['SELECT dari tabel SAAT INI', '16:39:59'],
        [],
    ),
    # CR45: DVA MENURUNKAN nilai wajar liabilitas.
    (
        "cr45-cva-kredit.ts",
        ['MENURUNKAN nilai wajar liabilitas', 'Yang salah BUKAN pemisahannya'],
        ['menambah nilai liabilitas', 'ECL dan CVA dihitung secara TERPISAH'],
    ),
    # FDP15: overlap 50 kata -> langkah efektif 200 -> ≈500 chunk
    # ((100.000-250)/200+1); 400 = hitungan TANPA overlap (korpus contoh).
    (
        "fdp15-riset-filings-ai.ts",
        ['≈ 500 chunk', 'hitungan TANPA overlap', '40 persen item relevan tidak pernah sampai ke LLM'],
        ['40 persen bukti tidak pernah sampai', 'tidak akan pernah mengutip karangan'],
    ),
    # DM10: hemat 40x3x52x(45-40/60) mnt = 4.610,67 jam x Rp87 ribu
    # = Rp401 jt/tahun (bukan Rp851 jt); ROI tahun pertama 1,0-1,7x.
    (
        "dm10-metadata-lineage.ts",
        ["Rp401 juta", "4.610,67", "1,0 sampai 1,7"],
        [],
    ),
    # BIZ10: math.ceil(n) (bukan int(n)+1); n_20=3528, n_10=14112.
    (
        "biz10-eksperimen.ts",
        ["math.ceil(n)", "n_20=3528", "n_10=14112"],
        ["int(n) + 1"],
    ),
    # AAI26: guard mayoritas ketat >50% (pluralitas 2/5 bukan mayoritas).
    (
        "aai26-penalaran-agen.ts",
        ["terbanyak > len(voting) / 2"],
        ["terbanyak > 1"],
    ),
    # AAI27: $2.000 = penurunan biaya pengerjaan ulang (bukan hemat kas terpisah).
    (
        "aai27-ekonomi-operasi-agen.ts",
        ["PENURUNAN BIAYA PENGERJAAN ULANG"],
        ["Total hemat $2.000+"],
    ),
    # LLMOps24: hemat tagihan 23,1% hanya sebagai ESTIMASI (asumsi throughput
    # + tarif tetap, overhead packing diabaikan).
    (
        "llmops24-pipeline-sft.ts",
        ["adalah ESTIMASI"],
        [],
    ),
    # RR35: CSRD berlaku untuk perusahaan yang MASUK CAKUPANNYA (kategori +
    # ambang hukum), bukan semua yang beroperasi di Eropa.
    (
        "rr35-gri-csrd.ts",
        ["MASUK CAKUPANNYA"],
        ["untuk perusahaan yang beroperasi di Eropa."],
    ),
    # PM-C14: MC independen salah perkirakan sebaran dua arah (autokorelasi
    # positif memperlebar, mean reversion mempersempit).
    (
        "pm-c14-wealth-planning-multitahun.ts",
        ["MEMPERLEBAR sebaran terminal", "MEMPERSERPIT"],
        ["MC yang mengabaikan korelasi melebih-lebihkan"],
    ),
    # MLE32: paritas lolos bila KEDUA ambang (maks 0,01 DAN rata-rata 0,002);
    # LLM 7B tidak muat di HP 2 jutaan bukan vonis absolut.
    (
        "mle32-edge-ml-onnx-tflite.ts",
        ["KEDUA ambang lolos", "BUKAN vonis absolut"],
        [],
    ),
    # DLE31: contoh ambiguitas memakai kata YANG SAMA ("bisa"), bukan token
    # berbeda ("berbisa").
    (
        "dle31-nlp-klasik.ts",
        ["ular itu memiliki bisa"],
        ["ular berbisa"],
    ),
    # AIE25: $1,36 = biaya komponen prompt (tanpa query/output/tarif beda);
    # Persona + Template = dua pola Vanderbilt + satu teknik few-shot.
    (
        "aie25-katalog-pola-prompt.ts",
        ["BIAYA KOMPONEN PROMPT", "DUA pola Vanderbilt"],
        ["tiga pola, satu prompt"],
    ),
    # MLOps27: 20 worker BELUM TENTU berarti antrean tumbuh (tergantung
    # waktu layanan, kapasitas, arrival rate).
    (
        "mlops27-load-testing-serving.ts",
        ["BELUM TENTU berarti antrean tumbuh"],
        ["hanya punya 20 worker, antrean tumbuh"],
    ),
    # LLMOps26: skor dekat ambang = "lolos bersyarat" + uji ulang; insiden
    # kritis selalu eskalasi.
    (
        "llmops26-safety-score-berkelanjutan.ts",
        ["lolos bersyarat", "insiden kritis"],
        [],
    ),
    # --- Review Ronde 6 Terra (fix), 2026-11-08 ---
    (
        "a11-tipe-data.ts",
        ['Rata-rata PD berbobotnya 1,14%', 'pd_rata2=1.14', 'proporsi HEADCOUNT, bukan NPL ratio', 'median di antara 3 dan 4'],
        ['Expected loss sebenarnya 1,14%', 'el_riil', 'Surabaya NPL = 10%', 'Mediannya 3,5 —', 'PD naik 0,5%'],
    ),
    (
        "b10-copula.ts",
        ['1,2%. Clayton', '14x independen!', 'ASYMPTOTIC independence'],
        ['0,9%. Clayton', '2,5%', '(hampir) independen'],
    ),
    (
        "a31-regresi-ols.ts",
        ['Kerugian = 5,2 + 2,77 x DPD', 'pred=88.3'],
        ['LGD = 5,2 + 2,77', 'LGD = minus Rp2,1 juta', 'LGD naik rata-rata Rp2.770'],
    ),
    (
        "a35-metrik-klasifikasi.ts",
        ['DENGAN ASUMSI probabilitas awalnya sudah terkalibrasi'],
        [],
    ),
    (
        "a39-time-series.ts",
        ['nilai kritis 5% ASIMTOTIK', 'ADF (intersep, tanpa tren; asimtotik 5%)'],
        [],
    ),
    (
        "aai11-debugging.ts",
        ['Rp607', 'Rp25.500', 'R = 2/5', 'Rp3.035', 'Rp306.000', '2/10 = 0,20'],
        ['R = 4/8 = 0,5', 'Rp24.000 per insiden'],
    ),
    (
        "aie11-ux.ts",
        ['x1="60" y1="128" x2="440" y2="20"', 'cx="320" cy="87"', 'Biaya transfer Rp10.000', 'Rp32,5 juta'],
        ['Biaya transfer Rp6.500'],
    ),
    (
        "cr11-forward-looking.ts",
        ['364,5', 'Rp 21 M', '0/50/50', '16,8%'],
        ['wajib beberapa skenario'],
    ),
    (
        "cr12-lgd.ts",
        ['35,6%', '322'],
        ['Total kembali bersih: Rp 390 juta'],
    ),
    (
        "cr14b-ecl-perhitungan.ts",
        ['opt=6.0', '11,3', '26%'],
        ['12,2 jt', '25,4 jt'],
    ),
    (
        "cr21-pricing-risiko.ts",
        ['9,29%', '4,18%', '14,82%'],
        ['PD sisa portofolio naik menjadi 10,5%'],
    ),
    (
        "e11-black-scholes.ts",
        ['Merton', 'dividend yield'],
        [],
    ),
    (
        "fdp12-dashboard-visualisasi.ts",
        ['umur_data_menit=47', 'umur data 47 menit'],
        ['Lag 47 menit'],
    ),
    (
        "dba11-cloud.ts",
        ['breakeven_util=0.342', '$900'],
        ['$2.600 di muka'],
    ),
    (
        "de11-cost.ts",
        ['994.397', 'Rp999 ribu'],
        ['hemat Rp989 ribu'],
    ),
    (
        "mle11-cost.ts",
        ['$16.500', '$6.900'],
        ['Hemat $28.800'],
    ),
    (
        "mlops11-k8s.ts",
        ['29/32', 'job 6/4/4/4/4/3', 'jumlah tak terjadwal 25 GPU', 'Rp109 jt', 'Rp119.000'],
        ['sisa 1+1+1+1 GPU'],
    ),
    (
        "llmops11-feedback.ts",
        ['5.230', '3.040', '69,6%'],
        ['600 → 90/minggu'],
    ),
    (
        "bi11-single-cell.ts",
        ['Curigai doublet DULU'],
        ['Sel mati/stres — buang'],
    ),
    (
        "hd11-wrangling-ehr.ts",
        ['ILUSTRATIF', 'O24'],
        [],
    ),
    (
        "biz11-governance.ts",
        ['2025-11-30', 'tanggal yang benar 2025-11-30'],
        [],
    ),
]

def main() -> int:
    ok = True
    for fname, must_have, must_not in FIXTURES:
        text = (ROOT / fname).read_text()
        for s in must_have:
            if s not in text:
                print(f"FAIL {fname}: angka kanonis hilang: {s!r}")
                ok = False
        for s in must_not:
            if s in text:
                print(f"FAIL {fname}: angka salah muncul kembali: {s!r}")
                ok = False
    print("PASS" if ok else "FAIL")
    return 0 if ok else 1

if __name__ == "__main__":
    sys.exit(main())
