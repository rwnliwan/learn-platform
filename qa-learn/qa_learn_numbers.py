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
import re
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
    # PM-B6: swap terima-tetap V = PV(fixed) - PV(floating) = +55.716;
    # kupon 6% tahunan dibayar per semester = 300rb (bukan 600rb);
    # PV fixed = 300rb/1,025 + 10,3M/1,055 = 10.055.716.
    # solusi lab v = pv_fixed - pv_float (bukan kebalikannya).
    (
        "pm-b6-valuasi-derivatif.ts",
        ["55.716", "v = pv_fixed - pv_float"],
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
        ['Rp607', 'Rp25.500', 'R = 2/5', 'Rp3.035', 'Rp306.000', '2/10 = 0,20',
         # R7: total tanpa detektor 47x607 = Rp28.529 (bukan Rp25.500 — itu HEMAT);
         # hemat bln 1 Rp1,95jt, bln 2+ Rp2,55jt; 25 tugas Rp713.225, selisih Rp637rb;
         # ROI tahun 1 Rp44,1jt; alert tau=0,15 tetap di langkah 5 (aturan >=2x).
         'Rp28.529', 'Rp1,95 juta', 'Rp2,55 juta/bulan', 'Rp713.225',
         'Rp637 ribu', 'Rp44,1 juta', 'alert di langkah 5 (R = 2/5'],
        ['R = 4/8 = 0,5', 'Rp24.000 per insiden',
         'Rp1,65 juta', 'Rp2,25 juta/bulan',
         'alert di langkah 4 (R=0,25 > 0,15)'],
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
    # --- Review Ronde 7 Terra (fix), 2026-11-08 ---
    # Semua angka di bawah dihitung ulang independen (python3 / eksekusi lab)
    # sebelum dijadikan fixture; derivasi lengkap di qa_r7_recompute.py.
    # Must-not HANYA untuk angka lama yang SUDAH tidak muncul lagi — angka lama
    # yang masih muncul di paragraf koreksi yang eksplisit mencabutnya
    # ("hitungan lama ... salah") SENGAJA tidak jadi must-not.
    # B13: Vasicek n=500, PD=2%, rho=0,15 -> joint 0,000877, korelasi indikator
    # 0,0243, SD = 11,35 (vs binomial 3,13; rasio 3,63x). Angka lesson 27,26
    # = penyalahgunaan rho sebagai korelasi indikator.
    (
        "b13-vasicek.ts",
        ["SD ≈ 11,35", "≈11,35 vs 3,13"],
        ["27,26"],
    ),
    # LLMOps13: break-even 8450/0,0048 = 1.760.417/bln (bukan 833rb — angka
    # lama memakai GPU-only $4.000); NusaBank (11x2jt+10jt)x$0,005 = $160.000
    # (bukan $120.000); hybrid hemat $66.000 = 41,25%. "833rb" SENGAJA tidak
    # jadi must-not: ia muncul di paragraf koreksi yang mencabutnya.
    (
        "llmops13-inference-selfhosted.ts",
        ["1.760.417", "$160.000/tahun", "41,25", "12,5 GiB"],
        ["120.000"],
    ),
    # CR13: EAD yang terhapus = 700M undrawn x CCF 60% = Rp 420 M (bukan 700M);
    # penghematan modal 8%x700M = Rp56M tanpa dasar RWA.
    (
        "cr13-ead-ccf.ts",
        ["Rp 420 M"],
        ["Rp56"],
    ),
    # CR15: Vasicek q99,9 PD=2%: rho=24% -> 26,79%; rho=12% -> 14,73%.
    # Angka lesson lama (1,9T/1,2T) mengimplikasikan LGD tak konsisten (0,71/0,82).
    (
        "cr15-risiko-portofolio.ts",
        ["q_99,9% = 26,79%", "q_99,9% = 14,73%"],
        ["1,9T"],
    ),
    # CR16: titik mati KPMM 8%: (5200-30000d)/(40000(1+3d)) = 8% -> d = 5,05pp
    # -> NPL = 2,5% + 5,05% = 7,55% ~ 7,6%.
    (
        "cr16-stress-testing.ts",
        ["≈7,6%"],
        [],
    ),
    # AML1: 5 analis x Rp15jt / 4.500 review = Rp16.667/review; review-all
    # 36.000 x Rp16.667 = Rp600jt; Rp126M = BATAS ATAS, rasio 1:210 (bukan 1:778).
    # "Rp4.500" SENGAJA tidak jadi must-not: ia muncul di "bukan Rp4.500
    # (angka lama...)" yang mencabutnya.
    (
        "aml1-triage-alert.ts",
        ["Rp16.667", "rasio 1 : 210"],
        ["1:778"],
    ),
    # MLE12: FNR grup B 60% vs grup A 15% -> 4,0x lebih mungkin terlewat
    # (bukan 2x).
    (
        "mle12-fairness.ts",
        ["4,0×"],
        ["2x lebih mungkin"],
    ),
    # WQB13: rho=0,94 -> rho^2 = 0,8836 (88,36% variasi sampel dijelaskan
    # regresi linear sederhana) — BUKAN "94% gerakannya sama". Frasa lama
    # SENGAJA tidak jadi must-not: ia muncul di "BUKAN ..." yang mencabutnya.
    (
        "wqb13-self-correlation.ts",
        ["0,8836"],
        [],
    ),
    # MK13: all-in +Rp100jt (eksekusi fungsi lab): TV +Rp47,65jt, Digital
    # +Rp112,17jt — marginal satu titik tidak memutuskan alokasi all-in.
    (
        "mk13-mmm.ts",
        ["47,65", "112,17"],
        [],
    ),
    # RR11: CKPN memperkuat COVERAGE, bukan jarak NPL gross; "0,4 pp" tanpa
    # penyebut/data. FIG fan: ujung garis baseline 216, adverse 168, severe
    # 120 (skala y=240->3,0%; 60px/pp) — dikunci di qa_r7_recompute.py
    # (parse SVG), bukan di sini (string ber-escape).
    (
        "rr11-stress.ts",
        ["memperkuat COVERAGE"],
        ["jarak severe menjadi 0,4 pp"],
    ),
    # BIZ12: panggilan tanpa filter mengekspos agregat SEMUA tenant:
    # merchant_terdampak = [M-101, M-102, M-103] (bukan [M-101]).
    # "seharusnya melihat 60" SENGAJA tidak jadi must-not: ia substring dari
    # "seharusnya melihat 600" yang benar — must-not-nya "bukan 60 miliknya".
    (
        "biz12-embedded.ts",
        ['M-102", "M-103'],
        ["bukan 60 miliknya"],
    ),
    # HD12: baseline konstan prevalensi 4% = 0,04x0,96 = 0,0384 — Brier 0,09
    # LEBIH BURUK dari baseline; prediksi 60% yang salah (outcome 0) = 0,36.
    (
        "hd12-prediksi-klinis.ts",
        ["0,0384", "0,6² = 0,36"],
        ["0,25 = tidak informatif"],
    ),
    # AIE13: rerank +Rp100/query (50xRp2), bukan Rp30/query; hemat
    # 20.000x0,06xRp500 = Rp600 ribu/hari (bukan Rp80 ribu) = persis impas.
    # "Rp30/query" dan "hemat Rp80 ribu" SENGAJA tidak jadi must-not: keduanya
    # muncul di "(Hitungan lama ... keduanya salah ...)" yang mencabutnya.
    (
        "aie13-hybrid-search-reranking.ts",
        ["Rp600 ribu/hari", "Rp100/query"],
        [],
    ),
    # PM-A2: klaim "mengalahkan pasar" hanya bisa diuji pada EXCESS return
    # (strategi - benchmark), bukan return mentah vs nol.
    (
        "pm-a2-quant-methods.ts",
        ["EXCESS return"],
        [],
    ),
    # FR11: ambang Rp500 ribu = CONTOH ILUSTRATIF, bukan kutipan regulasi —
    # ambang nyata bergantung yurisdiksi/jenis transaksi.
    (
        "fr11-threshold.ts",
        ["CONTOH ILUSTRATIF"],
        [],
    ),
    # MLE11: p50 nearest-rank 23 ms; median konvensional (23+24)/2 = 23,5 ms;
    # hanya 1/24 = 4,2% request yang melebihi 150 ms (150 = nilai p95).
    (
        "mle11-cost.ts",
        ["23,5 ms", "4,2%"],
        ["5% request menembus 150 ms"],
    ),
    # A31: R^2 in-sample CENDERUNG (bukan "selalu") terlihat bagus — model
    # bisa buruk bahkan in-sample.
    (
        "a31-regresi-ols.ts",
        ["CENDERUNG terlihat bagus"],
        ["ia selalu terlihat bagus"],
    ),
    # E13: nearest-rank — persentil 5% dari 1000 data = data ke-50 dari yang
    # terkecil (indeks 49): var_hist = -rs[k-1].
    (
        "e13-market-risk.ts",
        ["rs[k-1]", "indeks 49"],
        [],
    ),
    # MR3: minicase VaR 99% 1-hari Rp200 JUTA (bukan miliar); kelipatan 22,11x.
    (
        "mr3-var.ts",
        ["Rp200 juta"],
        ["Rp200 miliar"],
    ),
    # MR4: Cornish-Fisher S=-0,8, z=-2,33 -> |z_CF| ~ 3,39, VaR ~ Rp8,13 juta
    # (basis Rp200jt, dari Rp5,59jt) — CF bisa di bawah VaR normal bila skew
    # dominan; klaim "CF harus >= VaR normal" salah.
    (
        "mr4-var-lanjut.ts",
        ["Rp8,13 juta"],
        ["Rp6,8 M"],
    ),
    # AML2: dua bulan merah berturut-turut selesai akhir bulan ke-3 (~hari
    # ke-90), bukan hari ke-60. "hari ke-60" SENGAJA tidak jadi must-not: ia
    # muncul di "bukan hari ke-60" yang mencabutnya.
    (
        "aml2-kyc-cdd.ts",
        ["hari ke-90"],
        [],
    ),
    # FR12: 8 node (S,B,C,D,E,A,F,G), 11 baris transfer (4+4+2+1).
    (
        "fr12-graph-analytics.ts",
        ["Delapan node"],
        [],
    ),
    # C13: NPL dari plafon = 180/775 = 23,23% (rasio PLAFON — NPL produksi
    # memakai baki debet).
    (
        "c13-risiko-dpd-rollrate.ts",
        ["23,23%"],
        [],
    ),
    # AAI13: 80 koneksi / 24 = 3,33x (bukan 4x); N=M=2 -> N*M = N+M = 4.
    (
        "aai13-mcp.ts",
        ["3,33"],
        ["4x lebih sedikit"],
    ),
    # B12: lab VaR/ES — se_mean = SD(P&L)/sqrt(N) ~ 2,8 (setiap estimasi MC
    # wajib ditemani SE-nya).
    (
        "b12-monte-carlo.ts",
        ["se_mean≈2.8"],
        [],
    ),
    # --- Ronde 8 Terra (2026-11-09, GG-2: angka hitung/pembulatan/satuan) ---
    # Angka kanonis R8; hitung ulang independen di qa_r8_recompute.py.
    # KETERBATASAN (aturan Septian 00:53): fixture ini string-level per
    # angka — kelas "angka prose" secara umum hanya terkunci bila angkanya
    # punya parameter pertama yang bisa dihitung ulang (qa_r8_recompute.py);
    # angka benchmark tanpa sumber dikunci daftar terlarang di
    # qa_absolute_claims.py + prompt review ronde berikut.
    (
        "b14-markov-chain.ts",
        ["(0,86; 0,07; 0,07)", "88% lancar, 7% telat, 5% macet"],
        ["(0,72; 0,13; 0,15)", "86% lancar, 8% telat, 6% macet"],
    ),
    (
        "b16-heavy-tails-evt.ts",
        ["Rp43,7 juta", "0,33%"],
        ["Rp43,8 M", "0,36%"],
    ),
    (
        "b17-bayesian-praktis.ts",
        ["konsentrasi 1.000"],
        ["(5.000+3)/(100.000+10)"],
    ),
    (
        "pm-a3-economics.ts",
        ["Rp57.143", "markup = 12,5%"],
        ["Rp11.429", "menggandakan harga jual"],
    ),
    (
        "fr13-realtime.ts",
        ["Rp1,33 per transaksi", "Rp0,133 per transaksi"],
        ["Rp1.333 per transaksi", "Rp133 per transaksi"],
    ),
    (
        "mk14-pricing.ts",
        ["15% dari unit promo"],
        ["Kanibalisasi 62,5%"],
    ),
    (
        "d9-eda.ts",
        ["Medan 0%"],
        ["Medan 8% tertinggi"],
    ),
    (
        "bi13-epigenomik.ts",
        ["α=100 → beta = 850/1100 = 0,7727"],
        [],
    ),
    # --- Build gap ronde 8 Terra, 2026-11-09 (37 langkah gap-r8) ---
    # Kelas: angka langkah gap yang dihitung ulang dari parameter pertama.
    (
        "a15-kuantil-outlier.ts",
        ["q1_n1p=22.5", "q1_linear=27.5", "q3_n1p=67.5", "q3_linear=62.5"],
        ["Q1 = 10,25"],  # draf awal yang salah: Q1 linear data gaji = 10,0, bukan 10,25
    ),
    (
        "a16-korelasi.ts",
        ["ci4_lo=0.66", "ci30_lo=0.98"],
        [],
    ),
    (
        "b17-bayesian-praktis.ts",
        ["post_lemah=7.27", "post_tanpa=33.33"],
        [],
    ),
    (
        "cr17a-corporate-credit-1.ts",
        ["dscr_cfads=1.07", "dscr_cfads_lease=0.96", "icr_lease=2.25",
         "ocf=-80.0"],
        [],
    ),
    (
        "cr18-industry-country-risk.ts",
        ["skor=3.05"],
        [],
    ),
    (
        "cr19-validasi-model.ts",
        ["psi_kecil=0.13", "psi_besar=0.0007", "di=0.67"],
        [],
    ),
    (
        "mr6-backtesting.ts",
        ["unexplained +2", "lr=0.77", "peluang_lolos_2pct=43.9"],
        [],
    ),
    (
        "fr13-realtime.ts",
        ["bersih=9", "selisih_pct=33.3", "event_time=6"],
        [],
    ),
    (
        "aml3-edd.ts",
        ["60% × 50% = 30%", "pilihan=12"],
        [],
    ),
    (
        "c14-fraud-velocity.ts",
        ["kec_andi=1400.0", "kec_pesawat=466.67", "n_flag=1"],
        [],
    ),
    (
        "d9-eda.ts",
        ["npl_mar=75.0", "miss_mar=25.0", "shrink_jkt=51.9"],
        [],
    ),
    (
        "mle15-ml-klasik.ts",
        ["brier=0.1705", "cost05=6.0", "cost03=2.0"],
        [],
    ),
    (
        "aai14-context-engineering.ts",
        ["eksposur_tanpa_kunci=1000000", "retensi=84.2", "retensi_fakta=83.3"],
        [],
    ),
    (
        "hd13-fairness-kesehatan.ts",
        ["tpr_validasi=75.0", "tpr_test=60.0", "optimism_gap=15.0"],
        [],
    ),
    (
        "biz13-ai.ts",
        ["b85_lo=15.0", "b95_lo=37.6", "satu_jawaban=25.0"],
        [],
    ),
    # --- Build gap ronde 7 Terra (2026-11-09, 23 langkah baru gap-r7-*) ---
    # Angka kunci tiap lab gap, semua hitung ulang independen di
    # qa_r7_recompute.py (bagian "gap R7"). Needle diambil dari field
    # `expected` langkah gap — satu-satunya sumber angka yang dieksekusi.
    (
        "a12-pemusatan.ts",
        ["modus=[8, 9]", "n_modus=2"],
        [],
    ),
    (
        "b11-lln-clt.ts",
        ["cakupan=191/200", "cakupan_pct=95.5"],
        [],
    ),
    (
        "a13-sebaran.ts",
        ["mad=0.0", "pagar_atas=125.0"],
        [],
    ),
    (
        "b12-monte-carlo.ts",
        ["dengan_koreksi=0.00605", "ess=29", "var95=321.4", "es95=407.7"],
        [],
    ),
    (
        "cr13-ead-ccf.ts",
        ["ccf_kartu=35", "ccf_pendek=20", "ead_pendek=20.0"],
        [],
    ),
    # P3-G3: pasangan VaR lama "Rp 18 M / Rp 32 M" TIDAK terreproduksi
    # (asumsi tak pernah dinyatakan) — diganti pasangan reproduksibel
    # Rp36 jt vs Rp63-97 jt (binomial 36,0; Vasicek rho12 62,8; rho24 96,7).
    (
        "cr15-risiko-portofolio.ts",
        ["var_indep=36.0", "var_rho12=62.8", "var_rho24=96.7",
         "pd_m2=0.0294", "pd_lifetime=0.0874", "lgd_benar=71.49"],
        ["Rp 18 M", "Rp 32 M"],
    ),
    (
        "mr4-var-lanjut.ts",
        ["var_total=45.08", "comp_a=22.54",
         "var95_dengan_vega=19.18", "rasio=1.94"],
        [],
    ),
    (
        "aml1-triage-alert.ts",
        ["miss_rate=4.0", "keputusan=TUNDA"],
        [],
    ),
    (
        "fr12-graph-analytics.ts",
        ["nom_benar=45", "nom_bocor=155"],
        [],
    ),
    (
        "aml2-kyc-cdd.ts",
        ["selisih_a=8", "rasio_b=7.0"],
        [],
    ),
    (
        "mle12-fairness.ts",
        ["rate_a=64.0", "di_baru=1.0"],
        [],
    ),
    (
        "c13-risiko-dpd-rollrate.ts",
        ["rr_1_30=34.9", "cure_31_60=70.6"],
        [],
    ),
    (
        "aie13-hybrid-search-reranking.ts",
        ["skor_d1=0.8", "pemenang=1"],
        [],
    ),
    (
        "llmops13-inference-selfhosted.ts",
        ["terima_2=6", "tolak_2=4"],
        [],
    ),
    (
        "hd12-prediksi-klinis.ts",
        ["brier=0.1705", "ece=0.1"],
        [],
    ),
    (
        "biz12-embedded.ts",
        ["skor_scoping=66.7", "tenant_terekspos=3"],
        [],
    ),
    (
        "mk13-mmm.ts",
        ["roi_tv_8mgg=0.4", "roi_tv_6bln=1.8"],
        [],
    ),
    (
        "rr11-stress.ts",
        ["coverage_baru=51.6", "npl_gross_setelah_cap=4.98"],
        [],
    ),
    (
        "wqb13-self-correlation.ts",
        ["ci_lo=0.92", "r_naif=0.02"],
        [],
    ),
    # --- Fix ronde 9 (2026-11-09): angka kanonis yang dikoreksi ---
    # b15 GBM (GG-5 — fix konten mendesak, kelas dieskalasi): E[S_t] tumbuh
    # mu=8%, median tumbuh 6% (mu-1/2 sigma^2).
    (
        "b15-proses-stokastik.ts",
        ["ekspektasi harga tumbuh 8%/tahun", "median yang tumbuh 6%/tahun",
         "Rp10.565"],
        ["ekspektasi harga tumbuh 6%/tahun, BUKAN 8%", "Rp10.566"],
    ),
    # mr7/mr8: 1000x + hedge.
    (
        "mr7-stress-test.ts",
        ["Rp195 juta"],
        ["Rp195 miliar"],
    ),
    (
        "mr8-risiko-suku-bunga.ts",
        ["Rp77 M", "+Rp32 M", "4,42"],
        ["untung Rp12 M", "rugi Rp33 M", "Duration bersih = 0"],
    ),
    # cr22: rantai 10x + kunjungan.
    (
        "cr22-collection-recovery.ts",
        ["Rp3,3 miliar/bulan", "440×", "Rp980.000"],
        ["Rp330 juta", "ROI 44×", "Kunjungan RUGI"],
    ),
    # aml4/aml5: K4 + fixture + 1000x.
    (
        "aml4-sanctions.ts",
        ["0,8125", "40×"],
        # "lolos di kedua ambang" SENGAJA bukan must-not: kemunculan di
        # mini-case :214 BENAR (ambang 0,85/0,90, keduanya > 0,82);
        # regresi :126 dikunci qa_r9_recompute secara kontekstual.
        ["13× lebih mahal", "Rp150 jt"],
    ),
    (
        "aml5-structuring.ts",
        ["14,4 juta kali"],
        ["14 miliar kali"],
    ),
    # d11: prose basi vs lab (t/p/d, shapiro, chi2 x10 agar expected>=5).
    (
        "d11-scipy-statsmodels.ts",
        ["chi2=16.00"],
        ["t=4.234", "p=0.000046", "d=0.78", "p=0.948", "chi2=4.43"],
    ),
    # mle16: successive halving 405 vs 6561 (16,2x).
    (
        "mle16-hyperparameter-tuning.ts",
        ["405", "6.561", "16,2×"],
        ["324 epoch", "2.187", "7x hemat"],
    ),
    # a18: sumbu dipindah ke 475 agar klaim 3x/LF 49 konsisten (opsi verifier);
    # rasio batang Q2/Q1 = 2,58x (bukan 3x).
    (
        "a18-visualisasi.ts",
        ["Rp475 M", "2,58 kali lipat"],
        ["Rp480 M", "menjulang tiga kali lipat"],
    ),
    # mk15: Q* 460 (skenario B, Cu 8rb/Co 3rb -> 72,7%).
    (
        "mk15-forecasting.ts",
        ["72,7%", "460"],
        ["120 → 120 → 123"],
    ),
    # --- Track Machine Learning Finance, M1 (2026-11-12) ---
    # Angka kanonis SPEC-MLF-M1 §3.3 (notebook credit scoring Septian,
    # terverifikasi dari file .ipynb): dataset UCI 30.000, base rate 0,2212,
    # test 6.000; LR ROC-AUC 0,7426 / PR-AUC 0,5049; GBM 0,7823 / 0,5597;
    # GBM terkalibrasi 0,7816 / 0,5558; train GBM 0,8469 vs test 0,7823
    # (gap 0,0646); threshold 0,10; hemat biaya notebook 45,2% vs 0,5 dan
    # 59,8% vs approve-all.
    (
        "mlf1-tiga-tipe-satu-alur.ts",
        ["ROC-AUC 0,7823", "ROC-AUC 0,7426", "default rate 0,2212"],
        ["ROC-AUC 0,7824", "ROC-AUC 0,7427"],
    ),
    (
        "mlf2-membaca-angka.ts",
        ["0,9657", "[0,2108, 0,2318]", "[0,1500, 0,3107]"],
        ["PPV 0,9900"],
    ),
    (
        "mlf3-evaluasi-model.ts",
        ["PR-AUC 0,5597", "2,53", "0,1342", "45,2 persen", "59,8 persen"],
        ["PR-AUC 0,5598"],
    ),
    (
        "mlf4-overfitting-underfitting.ts",
        ["0,8469", "gap 0,0646", "CV MSE 1,4998"],
        ["gap 0,646", "gap 0,00646"],
    ),
    # --- Track Machine Learning Finance, L0 (2026-11-12) ---
    # Angka kanonis L0, terverifikasi dari notebook L0 yang sudah dieksekusi
    # (/tmp/l0_numbers.py) + notebook credit scoring cell 10.
    (
        "mlf-l01-data-cleaning.ts",
        ["3 dibagi 20 sama dengan 15 persen", "1,15 persen", "0,18 persen",
         "3 dari 100 sama dengan 3 persen", "4 dari 10 sama dengan 40 persen",
         "49 vs 52 baris"],
        ["1,16 persen", "16 persen"],
    ),
    (
        "mlf-l02-missing-data-imputasi.ts",
        ["3,4833", "2,7000", "20,0 persen", "62,5 persen", "8,3 persen", "menjadi 2,6000",
         "9 dari 12", "rata-rata 3,48 juta", "2, 5, 3, 1, 0, 1", "2, 5, 6, 1, 0, 1",
         "5 sampai 10 persen laporkan",
         "2,3000", "0,4000", "2,3375", "0,1998", "0,1332", "33,3 persen",
         "konsisten dengan MAR"],
        ["3,4834", "20,1 persen", "Median tidak bergerak", "11 dari 12",
         "lebih dari 10 persen, laporkan",
         "mekanismenya MAR", "barulah MCAR", "kesimpulan: MAR"],
    ),
    (
        "mlf-l03-distribusi-outlier.ts",
        ["0,068", "0,9988", "2,386", "1,068", "285,0", "2,80", "2,27",
         "9 dari 12", "11 dari 16", "di bawah 2 biasa",
         "nilai absolut di bawah 1 wajar",
         "W 0,998", "W 0,586", "W 0,816", "0,905", "0,874", "0,887",
         "pagar atas 960", "pagar atas 772,5", "pagar atas 8.450"],
        ["2,387", "0,9989", "11 dari 12", "sampai 2 biasa"],
    ),
    (
        "mlf-l04-data-wrangling.ts",
        ["180.000 baris", "18 baris", "3.990",
         "8 baris (6 → 8)", "150,0", "210,0", "satu per nasabah id 2–6"],
        ["180.001 baris", "inner: 6 baris"],
    ),
    (
        "mlf-l05-ab-testing.ts",
        ["0,0992", "1,6489", "2.884", "0,378", "22,6 persen", "0,01",
         "50 sampai di bawah 80 persen lemah", "SE pooled yang sama dengan uji-z",
         "kuantil eksak 2.887",
         "2,68", "0,0073", "1.060 vs 940", "Rp15 juta", "Rp150 juta",
         "−Rp23,5 juta sampai Rp273,5 juta"],
        ["0,0993", "2.885", "50 sampai 80 persen lemah"],
    ),
    # --- Track Machine Learning Finance, M2 (2026-11-12) ---
    # Angka kanonis M2, terverifikasi dari notebook M2 yang sudah dieksekusi
    # (colab/mlf-m2*-guided-task.ipynb, 25 check lolos, 0 error).
    (
        "mlf-m21-supervised-logistic-regression.ts",
        ["ROC-AUC 0,7426", "0,6443", "0,7153", "0,6955",
         # Fix DeepSeek M2 (2026-11-12): F7 enam koefisien, F15 empat
         # setengah kali lipat, F12 telat ≤ 1 bulan.
         "enam koefisien", "empat setengah kali lipat", "telat ≤ 1 bulan",
         # Fill gap Luna M2 (2026-11-12): G1 IV train/test + cutoff Juli,
         # G3 PAY_0 counts, G11 PR-AUC + balanced accuracy.
         "0,8881", "0,8363", "0,6922", "0,5049", "0,5558", "0,0646",
         "2.759", "14.737"],
        ["ROC-AUC 0,7427", "0,6444",
         "sembilan koefisien", "empat kali lipat", "tidak telat"],
    ),
    (
        "mlf-m22-scorecard-woe-iv.ts",
        ["IV 0,8761", "500 + 13 + 8 + 3 = 524", "0,6993",
         # Fix DeepSeek M2 (2026-11-12): F2 band IV half-open, F6 tiga
         # dari empat default, F9 PDO implisit, F14 bin half-open.
         "0,02 ≤ IV < 0,1", "0,1 ≤ IV < 0,3", "0,3 ≤ IV < 0,5", "IV ≥ 0,5",
         "tiga dari empat nasabah di bin ini default (0,7578)",
         "PDO implisit ≈ 13,9", ">50–100 ribu", ">60",
         # Fill gap Luna M2 (2026-11-12): G4 AIR + fairness, G5/G7
         # konstruksi standar, G8 Wilson.
         "1,1502", "0,3424", "0,6798", "0,7181", "28,8539", "487,1229",
         "513,9", "0,5012", "0,6299", "0,7842"],
        ["0,8762", "IV 0,8760",
         "hampir pasti bermasalah", "points-to-double-odds",
         "Monoton berarti bin-nya benar", "0,02–0,1 lemah", "60+"],
    ),
    (
        "mlf-m23-pd-lgd-ead-expected-loss.ts",
        ["0,1345", "NT$78.675.378", "0,9141", "NT$8.214.000",
         # Fix DeepSeek M2 (2026-11-12): F4 PD 1 bulan sebagai proksi,
         # F11 hanya 0,0181 yang tertelusur (0,0252 dihapus).
         "PD 1 bulan dipakai sebagai proksi",
         "selisih desil terbesar terkalibrasi 0,0181",
         # Concept gate M2 (2026-11-12): bad rate +67% (lebih lambat dari
         # approval +128%); EL +181% yang naik lebih cepat.
         "EL naik lebih cepat (+181%)", "bad rate ikut naik (+67%)",
         # Fill gap Luna M2 (2026-11-12): G2 LGD/CCF, G6 survival,
         # G12 champion-challenger, G13 policy matrix.
         "0,5163", "0,7248", "7.243.723", "0,2828", "0,3415", "0,1500",
         "0,850", "0,0118"],
        ["0,1346", "NT$78.675.379",
         "0,0252", "PD 12 bulan", "12 bulan ke depan",
         "bad rate dan EL naik lebih cepat"],
    ),
    (
        "mlf-m24-vintage-rollrate-ifrs9.ts",
        ["0,9388", "NT$457.366.208", "0,1867",
         # Fix DeepSeek M2 (2026-11-12): F1 150.000 transisi, F3 91+ DPD,
         # F4 PD/ECL 1 bln, F10 PD eksak, F19 NT$, F20 0,4258.
         "150.000 transisi", "91 hari ke atas", "91+ DPD",
         "PD 1 bln 0,1659", "PD 1 bln 0,6986", "Total ECL 1 bulan",
         "2.088/2.989", "0,4258 ke bucket 1", "ECL/nasabah=NT$13031",
         # Fill gap Luna M2 (2026-11-12): G8 Wilson, G9 PSI (koreksi
         # share PAY_0 = 2: 8,89%, bukan 4,9%).
         "0,0104", "0,0292", "0,8985", "8,89%", "0,6576"],
        ["0,9389", "NT$457.366.209",
         "150.798", "PD 12m 0,1659", "PD 12m 0,6986", "Total ECL 12 bulan",
         "ECL 12m", "90 hari ke atas", "90+ DPD", "5 bulan", "ECL/nasabah=Rp"],
    ),
    (
        "mlf-m25-reject-inference.ts",
        ["0,2337", "0,2804", "0,3938", "0,000875",
         # Fix DeepSeek M2 (2026-11-12): F5 bobot jinak, clip tak aktif.
         "min 1,00 / median 1,02 / maks 4,27", "clip 0,05 tidak pernah aktif",
         # Fill gap Luna M2 (2026-11-12): G10 alokasi per band, G12
         # scorecard ≥ 520, G14 checklist, G15 scorecard card.
         "0,0437", "0,0421", "0,0465", "3.135", "2.205", "2.793", "1.590"],
        ["0,2338", "0,2805",
         # Fill gap Luna M2 (2026-11-12): kuis baru memakai
         # "bobot 20 / varians meledak / P(approve) = 0,05" sebagai contoh
         # HIPOTETIS eksplisit (bukan simulasi UCI) — jadi jarum F5 harus
         # sempit (klaim yang sama tentang simulasi UCI), plus tiga jarum
         # yang menangkap rumusan F5 ASLI tanpa menabrak kuis hipotetis
         # (dicek: ketiganya 0 hit di file M2 saat ini).
         "bobot 20 di simulasi", "varians meledak di simulasi",
         "P(approve) = 0,05 pada simulasi",
         "bobot maksimal 20", "tanpa clip, varians",
         "P(approve) = 0,05 mendapat bobot"],
    ),
    # --- Track Machine Learning Finance, M3 (2026-11-12) ---
    # Angka kanonis M3, terverifikasi dari notebook M3 yang sudah dieksekusi
    # (colab/mlf-m3*-guided-task.ipynb, 0 error).
    # M3.1: silhouette FULL sample 0,3969 (bukan subsample 0,3913);
    # M3.3: bill jump definisi bersih (baseline positif saja, 1.512 keluar).
    (
        "mlf-m31-unsupervised-clustering-anomaly.ts",
        ["0,3969", "0,6318", "0,4367", "0,2099", "9,87 persen",
         "1.500 nasabah", "655 dari 6.636", "[0,26; 0,50]"],
        ["0,3913", "0,71–1,00", "0,51–0,70", "0,26–0,50",
         "0,25 ke bawah"],
    ),
    (
        "mlf-m32-network-link-analysis.ts",
        ["0,6387", "0,8204", "0,1817", "10,42", "5,12",
         "62 dari 72", "0,2877", "modularitas"],
        ["Community adalah component yang lebih rapat",
         "degree tiap anggota ring sama dengan jumlah anggota ring "
         "dikurangi satu"],
    ),
    (
        "mlf-m33-velocity-benford.ts",
        ["0,3799", "0,1593", "0,2261", "92,3", "995,5", "0,0226",
         "28.488", "1.512", "0,1761"],
        ["4.561", "0,1662", "0,2311", "ditetapkan R = 0",
         "masuk R ≥ 2"],
    ),
    (
        "mlf-m34-behavioral-peer-group.ts",
        ["0,3607", "0,2520", "6,67", "0,2640", "73,60%",
         "3,257", "0,5551", "1,1454", "BILL_TREND"],
        ["VELOCITY", "1,1466"],
    ),
    (
        "mlf-m35-alert-triage-economics.ts",
        ["0,7807", "0,8600", "0,7260", "0,6060", "NT$61.911",
         "22.373.572", "0,986", "t_close = 0,010", "t_esc = 0,135",
         "0,6888", "0,5985", "61.910,67", "6.747.320"],
        ["22.373.693", "dekat dengan ekspektasi",
         "4x lebih bernilai dari acak", "Selisih precision@500"],
    ),
    # --- Fill gap Luna M3 (2026-11-12) ---
    # Kelas baru: angka [ilustrasi] (sintetis/contoh, dihitung skrip
    # qa-learn/m3_gap_fill_calc.py) disalahbaca sebagai angka notebook.
    # must-have mengunci angka [ilustrasi] kuncinya ada; must-not menangkap
    # pelabelan "[notebook]" yang salah pada angka itu, plus nilai truncasi
    # yang salah (EV k=1000 = 37.317.865, bukan 37.317.864).
    (
        "mlf-m31-unsupervised-clustering-anomaly.ts",
        ["0,4500", "0,1755", "0,4354"],
        ["0,4509 [notebook]", "0,4500 [notebook]", "0,1755 [notebook]",
         "0,4354 [notebook]"],
    ),
    (
        "mlf-m32-network-link-analysis.ts",
        ["0,4088", "0,8210", "0,0006"],
        ["0,4088 [notebook]", "0,8210 [notebook]"],
    ),
    (
        "mlf-m33-velocity-benford.ts",
        ["139.233", "0,0005", "0,0010"],
        ["139.233 [notebook]"],
    ),
    (
        "mlf-m35-alert-triage-economics.ts",
        ["0,8577", "0,8397", "1.527.767", "0,4137", "80.955.456",
         "2.845", "18.473.201", "8.750.000", "9.723.201"],
        ["0,8577 [notebook]", "0,8397 [notebook]", "0,4137 [notebook]",
         "37.317.864", "Rp1"],
    ),
    # --- Track Machine Learning Finance, M4 (2026-11-12) ---
    # Angka kanonis M4, terverifikasi dari qa-learn/m4_canonical.json
    # (skrip m4_canonical_calc.py, data pin data/m4_prices.csv 2026-11-12)
    # dan notebook M4 yang sudah dieksekusi (0 error).
    # M4.1: model pohon bergeser +-1-2pp antar unduhan yfinance live
    # (revisi adjusted close ~1e-7); must-not "0,5063" mengunci varian
    # live RF walk-forward agar tidak menggantikan kanonis 0,5250.
    (
        "mlf-m41-random-forest-ensembles.ts",
        ["0,5250", "0,5688", "0,5062", "0,5326", "0,6000", "0,5261",
         "1,0000", "0,4750", "0,2084", "0,5761", "0,4196", "0,5625",
         "0,5188",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G8: threshold 0,60 akurasi 0,6125 / presisi 0,6176, NET
         # +10,06% di 0,50. G9: Wilson LR [0,4913; 0,6430]; prob
         # rata-rata model 0,4842.
         "0,6125", "0,6176", "10,06%", "0,4913", "0,6430", "0,4842"],
        ["0,5250 di atas naive", "RF mengalahkan naive",
         "random split lebih baik", "train accuracy 0,5250",
         "walk-forward RF 0,5326", "RF 0,5063",
         # --- Review DeepSeek M4.1 (2026-11-12, terverifikasi induk) ---
         # M1: TIGA titik bandel (x=7 label 1). M2: leakage bukan jaminan
         # batas atas. S6: titik jenuh 300 pohon tak terukur. S7: klaim
         # hafalan noise GBM tak terukur. N10: bar naive y=63,0 (bukan 62,6).
         # "0,5063" SENGAJA bukan must-not lagi: fix N9 mendokumentasikan
         # range live 0,5063-0,5188 secara eksplisit; yang dikunci adalah
         # pola substitusi "RF 0,5063" (nilai live menggantikan kanonis).
         "dua titik bandel", "batas ATAS yang optimistis",
         "300 pohon sudah jauh melewati titik jenuh",
         "menghafal noise lebih cepat", "62.6",
         # --- Concept gate ronde fix M4 (2026-11-12) ---
         # K1: patokan walk-forward = naive WF 0,5625 (90/160), bukan
         # 58,04% keseluruhan (267/460) — sisa pola S4 di note pitfall.
         "Patokan yang benar adalah naive-majority, bukan 0,50",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G8/G9: akurasi kanonis LR 0,5688 (91/160) — "0,5687" adalah
         # artefak pembulatan float (91/160 = 0,56875), JANGAN pernah muncul.
         # Threshold 0,60: akurasi 0,6125 / presisi 0,6176, NET +10,06%
         # di 0,50; Wilson LR [0,4913; 0,6430]; prob rata-rata 0,4842.
         "0,5687"],
    ),
    (
        "mlf-m42-var-expected-shortfall.ts",
        ["0,0286", "0,0445", "0,0328", "0,0410", "0,0336", "0,0424",
         "0,0479", "0,0775", "2.856.323", "4.451.285", "0,0903",
         "0,0290", "0,0380", "0,0438", "0,028563",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G3: worked example Rp100 jt — VaR99 0,0479 -> Rp4.792.081,
         # ES99 0,0775 -> Rp7.750.165.
         "4.792.081", "7.750.165"],
        ["VaR95 0,0445", "ES95 0,0286", "VaR 10-hari 0,0286",
         "Monte Carlo 0,0286", "0,0286 (Rp4.451.285)",
         "0,0286 × √10 ≈ 0,0903",
         # --- Review DeepSeek M4.2 (2026-11-12, terverifikasi induk 7/7) ---
         # M1: ES95 0,1200 dari SATU observasi (-0,12); msg "rata-rata
         # dua hari crash" (= 0,10) kontradiksi dgn angka yg ditegaskan.
         # S1: tambah 1 obs -0,08 ke n=20 -> VaR95 +23,5% (0,0405->0,0500),
         # bukan "nyaris tidak bergerak". N2: 22,56% dibulatkan jadi ~23%,
         # bukan 22%. N4: ES99 = rata-rata ekor, bukan kerugian 1 hari.
         "rata-rata dua hari crash", "nyaris tidak bergerak",
         "22 persen lebih rendah", "termasuk 0,0775 (ES99 historis)"],
    ),
    (
        "mlf-m43-var-backtesting-volatility.ts",
        ["1,0000", "0,3108", "0,3079", "GREEN", "0,1043", "0,0366",
         "0,0601", "0,8602", "4,6 hari", "0,0225", "0,0334", "0,0472",
         "0,0184", "0,2113", "0,6489",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G1: Christoffersen VaR95 LR_ind 6,6456 / LR_cc 7,7056,
         # pi11 0,2667. G4: EWMA LR_ind 5,7259, GARCH LR_ind 4,8068,
         # VaR95 maks GARCH 0,1439; VaR95 hari terakhir EWMA 0,0490,
         # GARCH 0,0315.
         "6,6456", "7,7056", "0,2667", "5,7259", "4,8068", "0,1439",
         "0,0490", "0,0315"],
        ["model VaR sempurna", "Kupiec in-sample membuktikan",
         "p = 1,0000 berarti", "zona Basel MERAH",
         "VaR tak-kondisional 0,0601", "VaR95 kondisional 0,0372",
         # --- Review DeepSeek M4.3 (2026-11-12, terverifikasi induk) ---
         # M1: forecast 0,0203 DI BAWAH 0,0225 dan 0,0231 (bukan di antara).
         # S2: bukan "ditarik menuju level jangka panjang". N1: 0,034.
         # N3: half-life 4,6 hari = "sekitar 4-5 hari".
         "di antara volatilitas terakhir", "hampir seminggu",
         "0,94^9 ≈ 0,035", "ditarik kembali ke level jangka panjang",
         "ditarik ke bawah menuju level jangka panjang"],
    ),
    (
        "mlf-m44-greeks-risk-decomposition.ts",
        ["388,03", "0,5665", "0,000460", "14,9867", "2,3801",
         "9,8214", "43,17", "0,6011", "0,0324", "0,2532", "0,3370",
         "0,4098", "7.619,38",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G2: perubahan SEBENARNYA S+1% = $44,49 (repricing), BUKAN
         # $43,17 (itu perkiraan delta saja); gabungan sebenarnya 67,23
         # vs Taylor 66,93; skenario BESAR sebenarnya 286,82 vs 292,12.
         # Must-not: 43,17 disajikan sebagai perubahan sebenarnya, dan
         # "43,17 + 1,34 = 44,50" (jumlah suku bulat = 44,51; 44,50
         # adalah jumlah tak-bulat, pakai ≈).
         "44,49", "66,93", "67,23", "286,82", "292,12"],
        ["delta awal 0,6011", "theta 2,3801", "harga call 388,30",
         # --- Review DeepSeek M4.4 (2026-11-12, terverifikasi induk) ---
         # S2: vega puncak di jangka PANJANG (bukan menengah). N1: "persis"
         # bertentangan dgn "≈". S3: dua himpunan korelasi berbeda. N2:
         # jumlah VaR tanpa bobot bukan pembanding equal-weight.
         # K2 (concept gate ronde fix): jual-beli mengubah bobot, BUKAN
         # matriks korelasi return (korelasi = sifat return, bukan bobot).
         "jangka menengah", "persis perkiraan delta",
         "korelasi yang sama dengan yang dipakai dekomposisi",
         "jauh lebih besar dari 0,0324",
         "mengubah bobot portofolio dan matriks korelasinya",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G2: 43,17 = perkiraan delta SAJA — dilarang disajikan sebagai
         # perubahan harga sebenarnya (yang benar $44,49).
         "call naik $43,17", "call +$43,17",
         "43,17 + 1,34 = 44,50"],
    ),
    (
        "mlf-m45-drawdown-regime-stress.ts",
        ["-0,4973", "-0,5791", "-0,4925", "-0,4363", "-0,1890",
         "77,40%", "0,3316", "0,3752", "0,2775", "0,0262", "1,3530",
         "1,0169", "0,0431", "0,0438", "478 hari",
         # --- Fill gap Luna M4 (2026-11-12) ---
         # G5: gabungan VaR95 0,0646 / VaR99 0,0914 / ES95 0,0811.
         # G6: kesepakatan real-time 94,46%; vol esok hari HIGH 0,0192
         # vs LOW 0,0191. G11: ES95 high-vol 0,0609, ES99 0,1139.
         "0,0646", "0,0914", "0,0811", "94,46%", "0,0192", "0,0191",
         "0,1139", "0,0609"],
        ["portofolio sudah pulih", "PORT pulih", "korelasi 1,0000",
         "diversifikasi tetap utuh", "max drawdown -0,3528",
         # --- Review DeepSeek M4.5 (2026-11-12, terverifikasi induk) ---
         # M1: persen dari LOG return = exp(r)-1: -14,8/-14,6/-12,6/-8,5
         # (bukan -16,0/-15,7/-13,4/-8,9). S1: korelasi regime high 0,3752,
         # bukan "mendekati 1". S3: ">2 tahun dari puncak", bukan ">1 tahun".
         # N3: +33,0%/+35,5% dari angka tampil (bukan +33,1%/+35,3%).
         "(sekitar −16,0%)", "(−15,7%)", "(−13,4%)", "(sekitar −8,9%)",
         "korelasi antar saham mendekati 1",
         "belum pulih setelah lebih dari 1 tahun",
         "+33,1%", "+35,3%"],
    ),
    # --- Build M5 (2026-11-12, kanonis dari qa-learn/m5_canonical.json) ---
    # M5.1: GD mangkuk x^2+10y^2 dari (4,4), 10 langkah.
    (
        "mlf-m51-gradient-descent-optimization.ts",
        ["12,5264", "1,9452", "2,1469", "133869,2748",
         "0,1701", "0,2319", "0,5193", "0,4807", "0,1005", "0,0994",
         "0,6565", "0,3435", "0,0957", "2,2950", "0,6256", "0,5518",
         "terhadap y adalah 20y",
         # --- Review DeepSeek M5.1 S1: f langkah-11 eta 0,05 = 1,5756
         # (bukan 1,9452 langkah-10).
         "1,5756"],
        ["η = 0,12 konvergen", "renormalisasi mentah menuju GMV",
         "SGD konvergen ke titik",
         # --- Review DeepSeek M5.1 (2026-11-13, terverifikasi induk) ---
         # S1: f langkah-11 eta 0,05 = 1,5756 (bukan 1,9452 langkah-10).
         # N1: 133869/180 = 744x (bukan 700x). N2: korelasi bukan fraksi
         # waktu searah. N4: LR/GBM bukan semata GD.
         "bergerak searah sepertiga waktu", "700 kali di atas skala", "700× skala gambar", "1,3838 vs 1,9452 di langkah ke-10", "dioptimasi dengan GD atau keturunannya"],
    ),
    # M5.2: Lagrange/KKT + max-Sharpe tak-terkendala ILL-POSED.
    (
        "mlf-m52-constrained-optimization-lagrange.ts",
        ["0,1913", "0,6565", "0,3435",
         "[0,5518; 0,2698; 0,1785]", "[0,5523; 0,2699; 0,1777]",
         "0,6718", "1,0517", "−2,7279", "−1,0517", "[0; 0; 1]",
         "0,0590", "0,7273", "0,0636", "0,09566", "0,9283",
         # --- Review DeepSeek M5.2: return closed-form -0,1900
         # (vs SLSQP -0,1903).
         "−0,1900",
         # --- Gap fill Luna M5.2 G4/G10 (2026-11-13, terverifikasi induk)
         # G4: eigenvalue 0,088937/0,151142/0,310986, cond 3,5,
         # det 0,004180. G10: cap vol 0,3026, kardinalitas 0,3093.
         "0,088937", "0,151142", "0,310986", "3,5", "0,004180",
         "0,3026", "0,3093", "0,3048",
         # --- Concept gate M5 run 5 RAGU (2026-11-12): titik berhenti
         # SLSQP ditampilkan SATU desimal — bentuk bulat [−11004; ...]
         # jumlahnya 0, bukan 1 (artefak pembulatan).
         "−3154,7", "−11003,8", "−3415,7", "−4554,6"],
        # --- Concept gate M5 run 1 (2026-11-12): rantai "2 × 0,0957 =
        # 0,1913" SALAH di 4 desimal (2 × 0,0957 = 0,1914; λ = 0,1913
        # hanya dari varians tak-dibulatkan 0,09566) — kelas gate 26.
        ["bobot optimal [−3154", "Sharpe 0,6697 merupakan maksimum",
         "2 × 0,0957 = 0,1913", "[−11004; −12513; 23517]",
         "[−4555; −9499; 14054]", "[−3154; −3786; 6941]",
         # --- Review DeepSeek M5.2 (2026-11-13, terverifikasi induk) ---
         # M1: Sharpe TIDAK homogen bila rf != 0 (S([0;0;1])=0,0590 vs
         # S(2.[0;0;1])=0,1089). M2: lambda menaikkan varians (+0,0019).
         # S1: return closed-form -0,1900 vs SLSQP -0,1903. N1: basis %.
         "Sharpe ratio adalah HOMOGEN derajat nol", "pembilang dan penyebut sama-sama diskalakan", "menurunkan varians sekitar", "Keduanya sepakat pada return −0,1903", "di bawah 0,1 persen",
         # --- Gap fill Luna M5.2 G4/G10 (2026-11-13) — pasangan angka
         # yang salah: eigenvalue terkecil BUKAN 0,310986; kardinalitas
         # BUKAN vol cap (0,3026); min holding BUKAN vol kardinalitas.
         "eigenvalue terkecil 0,310986", "kardinalitas ≤ 2 → vol 0,3026",
         "minimum holding 0,10 → vol 0,3093", "Σ lesson ini hampir singular"],
    ),
    # M5.3: Markowitz/frontier dari data pin (SIMPLE return, 480 hari).
    (
        "mlf-m53-markowitz-efficient-frontier.ts",
        ["0,5523", "−0,1903", "0,2966", "0,0796", "0,5014", "0,0590",
         "−0,1406", "0,3114", "0,3056", "0,0058", "0,0648", "0,2507",
         "0,3488", "480 hari", "SIMPLE return",
         # --- Fill gap Luna M5.3 (2026-11-13, terverifikasi induk) ---
         # G1 turnover/biaya, G2 drift, G8 sisa kas, G9 downside-dev/ES95,
         # G5 shrinkage delta 0,5.
         "0,4380", "4,38bp", "0,3048", "0,0228", "Rp550.000", "0,2343",
         "0,0429", "[0,4147; 0,3213; 0,2640]"],
        ["frontier menjanjikan return", "frontier akan memberi return",
         "frontier seluruhnya positif",
         # --- Review DeepSeek M5.3 (2026-11-13, terverifikasi induk) ---
         # M1: TIGA titik frontier positif (0,0025; 0,0410; 0,0796),
         # bukan satu. S1: DUA titik aset tunggal (BBCA, KLBF).
         "hanya satu titik frontier yang berada di atasnya", "hanya ujung UNVR yang berada di atas return 0", "seluruhnya berada di return negatif, kecuali ujung tertingginya", "Tiga titik aset tunggal (BBCA, KLBF)",
         # --- Fill gap Luna M5.3 (2026-11-13) ---
         # Biaya dari L1 PENUH (bukan L1/2); downside selalu lebih baik;
         # ambang 2pp "3x bulanan" (yang benar ~2x: 9,85 vs 5,07);
         # skala vol seragam mengubah GMV (yang benar: tidak).
         "L1 × 20bp", "downside optimization selalu lebih baik",
         "ambang 2pp tiga kali lebih mahal",
         "GMV berubah bila semua vol dikali 1,1"],
    ),
    # M5.4: risk parity / risk budgeting + jembatan component VaR M4.4.
    (
        "mlf-m54-risk-parity-budgeting.ts",
        ["0,398", "0,3212", "0,2808", "[0,3333; 0,3333; 0,3333]",
         "−0,1575", "0,3037", "−0,6833", "0,5526", "0,4137",
         "0,0324", "0,0082", "0,0109", "0,0133", "0,4098", "0,5157",
         # --- Concept gate M5 run 6 (2026-11-12): dengan Sigma diagonal
         # & vol sama, w_i ∝ √r_i — target [0,5;0,3;0,2] memberi bobot
         # [0,4154; 0,3218; 0,2628], BUKAN [0,5; 0,3; 0,2].
         "0,4154"],
        ["bobot risk parity sama rata", "0,0324 lebih kecil dari 0,3037",
         "equal-weight return −0,1575", "barulah keduanya berimpit",
         # --- Review DeepSeek M5.4 (2026-11-13, terverifikasi induk) ---
         # M1: Max-Sharpe 100% > GMV 55,26% (GMV bukan 'paling').
         # M2: GMV lebih timpang (0,3752) dari EW (0,1638). S1: MC =
         # turunan parsial, bobot lain TETAP. S2: risk_contrib lab
         # tak-ternormalisasi (tanpa /sigma_p).
         "paling terkonsentrasi", "paling timpang", "dengan bobot lain menyesuaikan", "RC_i = w_i * (Sigma w)_i untuk tiap aset"],
    ),
    # M5.5: Black-Litterman + shrinkage; estimation error / optimizer's curse.
    (
        "mlf-m55-black-litterman-shrinkage.ts",
        ["0,4831", "−0,8780", "0,0955", "0,7671", "−0,6178",
         # --- Review DeepSeek M5.5 S1: w.M (excess) = 0,2354;
         # return posterior 0,2854 = 0,2354 + rf.
         "0,2354",
         "−0,4760", "[0,3147; 0; 0,6853]", "[0,2007; 0,2084; 0,2971]",
         "−0,3272", "4/6",
         "[0,4173; 0,2493; 0,3334]", "0,5807", "0,83",
         "[0,196; 0,2175; 0,298]", "[0,1817; 0,2447; 0,3009]"],
        ["BL memperbaiki return OOS", "posterior adalah ramalan",
         # --- Gap fill M5.5 ronde Luna G3/G6/G7 (2026-11-13, terverifikasi
         # induk dari m5_gap_fill_numbers.json) ---
         # G6: tau sendirian TIDAK mengubah M (konvensi He-Litterman);
         # G3: worst-case GMV −0,4760 TERBURUK (bukan terbaik);
         # G7: walk-forward TIDAK membalikkan vonis split 240/240.
         "tau 0,20 mengubah posterior", "GMV adalah yang terbaik secara worst-case",
         "walk-forward membuktikan kemenangan GMV",
         # --- Concept gate M5 run 6 (2026-11-12): Sharpe OOS MS −0,8780
         # adalah yang TERTINGGI (bukan "terburuk kedua") — semua Sharpe
         # OOS negatif, yang paling negatif (−1,3278 EW) yang terburuk.
         "delta 0,0955 berarti 95,5%", "terburuk kedua setelah risk parity",
         # --- Review DeepSeek M5.5 (2026-11-13, terverifikasi induk) ---
         # M1: kode max_sharpe_w pakai Sigma^-1.Mu TANPA (mu-rf) -> rf=0.
         # N1: SE UNVR 0,5807 LEBIH BESAR dari estimasi 0,4831. N2:
         # delta shrinkage vs delta risk-aversion dibedakan.
         "rf = 0,05, rumus tertutup dinormalisasi", "SE-nya sebesar estimasinya sendiri", "Nilai: delta = 0,0955 pada window penuh", "Di sini delta = 2,5, tau = 0,05"],
    ),
    # --- Build M6 (2026-11-13, kanonis dari qa-learn/m6_canonical.json) ---
    # M6.1: grid/random/shrinking GBM + LR grid C; optimism 0,0042.
    (
        "mlf-m61-hyperparameter-tuning.ts",
        ["0,7865", "0,7866", "0,7869", "0,7581", "54 fits", "81 fits",
         "0,0042", "0,7827", "BUKAN Bayesian optimization",
         "0,78613 vs 0,78517"],  # fill G4: rata-rata kelompok tak-dibulatkan
        # --- Review finisher M6.1: grid terbaik 0,7865 (bukan 0,7866 —
         # itu random search); 18×3 = 54 fits (bukan 162); optimism
         # 0,7865 − 0,7823 = 0,0042 (bukan 0,0025).
         # --- Review DeepSeek M6.1 (2026-11-13, 40 temuan, 0 noise):
         # "SAMA PERSIS" hanya untuk ROC-AUC + Brier (PR-AUC naik
         # 0,0001); "6 terbawah" salah peringkat (null = peringkat
         # 12–17); "(seed 43)" DIPULIHKAN Chief (kanonis: m61_shrinking_random_search.seed = 43; notebook default_rng(SEED+1), SEED=42).
         # --- Fill gap Luna M6.1 (2026-11-13, terverifikasi Chief):
         # selisih antar-kelompok WAJIB dari nilai penuh, bukan angka
         # tampil yang dibulatkan (kelas gate 89): 0,7861 vs 0,7852
         # memberi 0,0009, bukan 0,0010; 0,7856 − 0,7841 = 0,0015,
         # bukan 0,0016.
         ["grid terbaik 0,7866", "Grid GBM: 162 fits", "optimism 0,0025",
          "jumlah pohon GBM adalah n_estimators",
          "SAMA PERSIS dengan GBM default",
          "mengisi 6 terbawah", "hampir 0,02 di bawah fold terbaik",
          "batangnya tampak hampir sama tinggi",
          "paling jujur dan paling mahal",
          "Selisih CV terbaik vs test-nya sendiri",
          "membiaskan skor ke atas (di sini +0,0042",
          "0,7861 vs 0,7852", "0,0015 di bawah depth 5"],
    ),
    # M6.2: nested CV 0,7858; bias leakage menurut rumus 0,0000.
    (
        "mlf-m62-cross-validation-nested-cv.ts",
        ["0,7858", "0,7560", "0,7840", "0,5516", "1.327", "0,0000",
         "125 kali latih", "275 kali latih",
         "14.400 dari 19.200", "0,0030", "[0,7799; 0,7918]"],  # fill G5
        # --- Concept gate M6 run 1 (2026-11-13, terverifikasi induk):
         # −0,0035 adalah selisih ANTAR-PROTOKOL (single-split minus
         # nested), BUKAN bias leakage menurut rumus s_test(λ̂_test) −
         # s_test(λ̂_CV) = 0,7823 − 0,7823 = 0,0000 — kelas gate 81.
         # Biaya 275 latih = grid PENUH kanonis; notebook memakai
         # subset 8 konfigurasi = 125 latih — kelas gate 82.
         # --- Review DeepSeek M6.2 (2026-11-13, 40 temuan, 0 noise):
         # 5 konfigurasi unik (bukan 4); pemicu leakage = kandidat
         # SETARA + noise besar (bukan selisih besar); "55× lipat"
         # tanpa pembanding; 480 return → 460 observasi (warm-up 20).
         # --- Fill gap Luna M6.2 (2026-11-13, terverifikasi Chief):
         # dua training set berbagi 14.400 dari 19.200 baris (bukan
         # "18.000 dari 24.000"); SE = sd/√5 ≈ 0,0030, CI naif
         # [0,7799; 0,7918] — kelas gate 93.
         ["GBM bias −0,0035", "bias vs nested jujur",
          "bias terhadap nested yang jujur",
          "bias optimis»-nya justru minus",
          "nested − single-split = −0,0035",
          "empat konfigurasi berbeda",
          "selisih antar-konfigurasi BESAR",
          "selisih antar-konfigurasi besar",
          "makin besar selisih antar-konfigurasi",
          "noise pengukurannya kecil dibanding selisih antar-konfigurasi",
          "55× lipat — itulah mengapa",
          "480 return SIMPLE harian, target",
          "(125 kali latih) dan membandingkan",
          "subset 8 konfigurasi dari grid kanonis 18",
          "sekitar sepertiga sd",
          "31 fitur (23 mentah + 8 turunan)",
          "18.000 dari 24.000"],
    ),
    # M6.3: early stopping 50 pohon; L1 C=0,1 men-zero-kan 7 koefisien.
    (
        "mlf-m63-regularization-early-stopping.ts",
        ["0,7823", "0,7638", "0,2128", "0,0159", "0,7418", "7 koefisien",
         "0,0015", "0,7797", "0,9766"],
        # --- Review finisher M6.3: TANPA early stopping test 400 pohon
         # 0,7638 (bukan 0,7823 — itu DENGAN early stopping); L1
         # men-zero-kan 7 (C=0,1), bukan 0; gap 0,0646 milik kurva
         # DENGAN early stopping (flat), bukan tanpa.
        # --- Review DeepSeek M6.3 (2026-11-13, 40 temuan, 0 noise):
        # selisih 0,0026 bukan keunggulan mekanisme ES (fit terpisah,
        # di bawah sd 0,0059); C = 1/λ hingga faktor ½ pada suku L2.
        ["tanpa early stopping test 0,7823",
         "L1 men-zero-kan 0 koefisien",
         "gap 0,0646 pada 400 pohon tanpa early stopping",
         "memilih puncaknya dari TEST — dan tetap kalah",
         "memakai default (aktif), sehingga max_iter 100",
         "punya train dan test yang sama-sama buruk",
         "batas sinyal yang tersedia — rem lebih keras",
         "Di sklearn, C = 1/λ."],
    ),
    # M6.4: kalibrasi GBM mentah terbaik; threshold 0,10 profit-max.
    (
        "mlf-m64-calibration-threshold-selection.ts",
        ["0,1342", "0,0073", "0,1345", "0,0087", "8.214.000",
         "18.994.456", "11.989.453", "0,0198", "0,0025",
         "HASIL ILUSTRASI PROTOKOL LESSON", "8.430.500", "49,88%"],  # fill G2+G6
        # --- Review finisher M6.4: Platt TIDAK memperbaiki Brier/ECE
         # (0,1345/0,0087 vs mentah 0,1342/0,0073); profit-max di
         # threshold 0,10 (bukan 0,50); ambang min-expected-loss ≠
         # ambang profit-max bila cost ≠ profit.
        # --- Review DeepSeek M6.4 (2026-11-13, 40 temuan, 0 noise):
        # tabel threshold dihitung pada probabilitas Platt (Brier
        # 0,1345) — label "GBM terkalibrasi" WAJIB sebut varian
        # (Platt/sigmoid); bin [0,5–0,6) BUKAN penyimpangan terbesar.
        # --- Fill gap Luna M6.4 (2026-11-13, terverifikasi Chief):
        # angka threshold lesson ini WAJIB berlabel "hasil ilustrasi
        # protokol lesson" (kontradiksi internal vs larangan M6.5
        # memakai test untuk memilih threshold — kelas gate 90);
        # pilihan-dengan-constraint approval ≥50% adalah 0,20
        # (harga NT$8.430.500 vs profit-max) — kelas gate 92.
        ["Platt memperbaiki Brier", "profit-max 0,50",
         "min-expected-loss adalah threshold terbaik",
         "penyimpangan TERBESAR",
         "GBM terkalibrasi, test 6.000",
         "Threshold (GBM terkalibrasi)",
         "hanya 52 yang benar-benar default. Skor 0,8",
         "Dengan base rate 0,2212, kelompok tambahan itu terlalu berisiko",
         "menyumbang 0,0040 sisanya",
         "jadi urutannya tetap.",
         "dengan cv=3 [notebook]",
         "menjadi 20% atau margin menjadi 15%"],
    ),
    # M6.5: winner's curse 0,0042; McNemar LR vs GBM p=0,0003.
    (
        "mlf-m65-automl-selection-bias.ts",
        ["0,0042", "0,0003", "0,5383", "0,7858", "0,0397", "13,1601",
         "0,3788", "0,0018", "54 konfigurasi", "0,7849"],  # fill G7+G8
        # --- Review finisher M6.5: p=0,5383 TIDAK signifikan (GBM
         # tertala vs default); winner's curse 0,0042 (bukan 0,0000);
         # optimism 0,7865 − 0,7823 = 0,0042 (bukan 0,0025).
        # --- Review DeepSeek M6.5 (2026-11-13, 40 temuan, 0 noise):
        # optimisme terkecil 0,0014 hanya DUA konfigurasi (it100 +
        # it200; it50 = 0,0015); 0,0042 = gap protokol CV-vs-holdout
        # (bukan estimasi eksklusif curse); "terbaik" = terbaik di
        # antara 27 konfigurasi random search (0,7866 < shrinking
        # 0,7869); p-value χ² df=1 punya bentuk tertutup (erfc).
        # --- Fill gap Luna M6.5 (2026-11-13, terverifikasi Chief):
        # registry lintas sesi = 54 konfigurasi + 1 run gagal
        # (bukan "satu pencarian, 18 kandidat" — kelas gate 91).
        # --- Concept gate fill M6 (2026-11-13, 3 KONTRADIKSI, kelas
        # gate 93): "0,7858 ± 0,0068" dilarang sebagai error bar
        # estimasi — sd antar-fold BUKAN ketidakpastian mean (SE ≈
        # 0,0030); tulis "(sd antar-fold 0,0068)".
        ["p = 0,5383 signifikan", "GBM tertala menang signifikan",
          "winner's curse 0,0000", "0,7865 − 0,7823 = 0,0025",
          "tiga konfigurasi max_depth tanpa batas",
          "juga 0,0042 (terkecil 0,0014, terbesar 0,0066) — curse KECIL",
          "p-value dari χ² tidak bisa dihitung dengan rumus sederhana",
          "menemukan yang terbaik 0,7866",
          "terbaik 0,7866 — hanya 0,0001 di atas grid",
          "skor CV 3-fold di train",
          "sama dengan sang juara CV",
          "satu-satunya estimasi di lesson ini yang tidak tercemar seleksi",
          "Di sini biasnya 0,0042",
          "Di sini curse kecil (0,0042)",
          "VARIASI skor antar lipatan (0,7799–0,7974)",
          "0,7858 ± 0,0068 adalah pemenang ranking",
          "hanyalah nested CV (0,7858 ± 0,0068)",
          "0,7858 ± 0,0068 adalah estimasi yang jujur"],
    ),
    # --- Fix review DeepSeek M7 (2026-11-13, 25 temuan, 0 noise) ---
    # M7.1: premis "model tidak memakai SEX" SALAH (kelas GG-5) —
    # flagship MEMAKAI SEX/EDUCATION/MARRIAGE/AGE (LR SEX −0,0626,
    # SHAP 0,0314); drop kolom sensitif MENURUNKAN AIR 0,8694 →
    # 0,9211 (bukan "hanya menyembunyikan"); AIR SEX diseragamkan
    # ke 0,8693 (0,8694 pada deret threshold = dari rate tak
    # dibulatkan); FPR 0,6585 = "sekitar dua pertiga (65,85%)".
    (
        "mlf-m71-fairness-metrics.ts",
        ["0,8693", "−0,0626", "0,8694 → 0,9211", "0,6261",
         "sekitar dua pertiga (65,85%)"],
        ["tidak memakai SEX", "tidak pernah «melihat» kolom",
         "hanya menyembunyikannya dari daftar fitur",
         "dua dari tiga nasabah LANCAR ditolak",
         "0,2614 / 0,3007 = 0,869 —", "model ini tidak memakainya"],
    ),
    # M7.2: premis yang sama + Q6 diperbaiki (jawaban benar =
    # campuran efek langsung + perbedaan risiko + proxy; distraktor
    # B "pipeline tidak menyertakan SEX" SALAH); label (M6.4) pada
    # angka threshold 0,50 (843 default, bad rate 15,96% — ada di
    # m6_canonical.json, diverifikasi Chief).
    # Gate ronde fix (5 KONTRADIKSI, semua terverifikasi BENAR):
    # G1 superlatif "paling tidak bisa dipercaya" WAJIB bercakupan
    # (ECE 60+ 0,1208 > SMA 0,0362); G2 uji-z + CI bukan "dua bukti
    # independen" (SE sama); G3 "hanya sama bila distribusi sama"
    # salah logika (syarat cukup, bukan perlu).
    (
        "mlf-m72-bias-audit-sources.ts",
        ["−0,0626", "0,8694 → 0,9211", "0,6261",
         "sekitar dua pertiga (65,85%)", "(bad rate 15,96%, M6.4)",
         "paling tidak bisa dipercaya di antara grup besar EDUCATION (ECE 0,0362)",
         "DUA CARA MEMBACA bukti yang sama",
         "TIDAK membuktikan distribusi fiturnya sama"],
        ["tidak memakai SEX", "hanya menyembunyikannya dari daftar fitur",
         "tidak menyertakan SEX/EDUCATION/AGE sebagai fitur",
         "31 fitur dari kolom transaksi dan perilaku",
         "bukan dari kolom SEX-nya",
         "dua dari tiga nasabah LANCAR ditolak",
         "dua bukti independen",
         "hanya sama bila distribusi fitur"],
    ),
    # M7.3: label temporal PAY (PAY_0→PAY_6 = terbaru→terlama);
    # "bukan threshold-nya" absolut → threshold per grup TERBUKTI
    # memperbaiki AIR (M7.4: 0,8694→0,9999); PDP 2D "mengecil
    # sedikit" → "sekitar sepertiga"; LIME 2.000 sampel [notebook]
    # (terverifikasi di colab/mlf-m73-guided-task.ipynb, n_samp =
    # 2000); arah AIR dinyatakan eksplisit.
    # Gate ronde fix G4: transformasi monoton (Platt) menjaga
    # ranking PREDIKSI nasabah, BUKAN urutan SHAP antar fitur —
    # "ranking dan fitur teratasnya sama" SALAH (3 spot TS + 1 .md).
    (
        "mlf-m73-explainability-shap-lime.ts",
        ["tiga bulan terbaru 3, 2, 2", "tiga bulan tertua 7, 7, 7",
         "0,8694→0,9999", "0,8693 = laki-laki/perempuan",
         "mengecil sekitar sepertiga (0,0714→0,0487)",
         "ranking PREDIKSI nasabahnya sama"],
        ["tiga bulan terakhir bahkan tidak membayar",
         "bukan threshold-nya",
         "mengecil sedikit saat fitur pasangannya sudah tinggi",
         "ranking dan fitur teratasnya sama"],
    ),
    # M7.4: interpolasi Pareto λ=0,62 → biaya ≈ NT$32.899.000
    # (bukan 32.895.000); lab expected air_female_over_male =
    # 1.1503 (solusi membagi approval yang ditampilkan 0,3007 /
    # 0,2614; hitungan penuh 1,1502); "1/0,869 = 1,151" →
    # "1/0,8693 ≈ 1,150".
    (
        "mlf-m74-fairness-mitigation.ts",
        ["32.899.000", "air_female_over_male=1.1503",
         "1/0,8693 ≈ 1,150"],
        ["32.895.000", "air_female_over_male=1.1502",
         "1/0,869 = 1,151", "0,3007 / 0,2614 = 1,1502"],
    ),
    # M7.5: alert chunk 2 disatukan ke WASPADA (1) — langkah 9,
    # lab2, checkpoint, rangkuman; ROC-AUC mentah vs terkalibrasi
    # dilabeli; prior shift = under-predict (approval cenderung
    # NAIK); PSI 0,0161 = chunk 1 vs chunk 5 (bukan chunk 2);
    # default per chunk 230–295 (chunk 3 = 294).
    # Gate ronde fix G5: pitfall step 1 juga menyebut dua ROC-AUC
    # test tanpa label varian (kelas 99, spot terlewat) — dilabeli
    # (GBM mentah) 0,7823 dan (GBM terkalibrasi) 0,7816.
    (
        "mlf-m75-monitoring-drift.ts",
        ["alert_A=1", "GBM mentah 0,7823",
         "under-predict peluang default", "chunk 1 vs chunk 5",
         "230–295 default per chunk",
         "ROC-AUC test-mu (GBM mentah) tetap 0,7823",
         "ROC-AUC (GBM terkalibrasi) hanya turun"],
        ["alert_A=2", "alert chunk 2 = kritis (2)",
         "menolak lebih banyak orang",
         "PSI skor 0,0161, terkonfirmasi",
         "230–290 default per chunk",
         "ROC-AUC test-mu tetap 0,7823"],
    ),
    # --- Fill gap Luna M7 (2026-11-13, 10 gap, 0 noise) ---
    # G2/G3/G8 dihitung dari data (m7_gap_fill_numbers.json);
    # G9 counterfactual dihitung ulang (m7g9_counterfactual_calc.py);
    # G1/G4/G5 memakai [simulasi] di mana kanonik tak punya angka.
    # M7.2: irisan L×SMA AIR 0,2655 (global 0,8693 menyembunyikan
    # −0,6038); bootstrap CI (1.000 ulangan, seed 42); kualitas
    # data 30.000 baris (missing 0; EDU invalid 345; BILL_AMT
    # negatif 1.930).
    (
        "mlf-m72-bias-audit-sources.ts",
        ["0,2655", "0,6038", "73,72%", "1,15%", "6,43%",
         "[−0,0498; 0,0110]", "tidak signifikan ≠ tidak ada gap",
         "1.000 ulangan", "menaikkan AIR (0,8694 → 0,9211",
         "29,85% (n = 1.791) vs terkalibrasi 28,50% (n = 1.710)"],
        ["gap TPR sudah tertutup", "menurunkan AIR (0,8694",
         "hampir tidak mengubah approval"],
    ),
    # M7.3: counterfactual 858 dihitung ulang — riwayat sempurna
    # pun tetap ditolak (CF-A cal 0,3325; CF-B cal 0,1535);
    # counterfactual = diagnosis, bukan rencana aksi/kausal;
    # overlap top-3 LR vs SHAP GBM = 2.
    (
        "mlf-m73-explainability-shap-lime.ts",
        ["0,3325", "0,1535", "0,1382",
         "counterfactual adalah diagnosis model",
         "overlap_lr_shap=2", "menaikkan AIR (0,8694→0,9999"],
        ["counterfactual adalah rencana aksi", "menurunkan AIR (0,8694"],
    ),
    # M7.4: protokol validasi (pilih di validation, laporkan di
    # test) — angka mitigasi = HASIL ILUSTRASI PROTOKOL LESSON;
    # template tata kelola 10 kolom + rollback v2 = threshold
    # tunggal 0,10.
    (
        "mlf-m74-fairness-mitigation.ts",
        ["HASIL ILUSTRASI PROTOKOL LESSON", "0,1058/0,0965",
         "Rollback version: threshold tunggal 0,10 (v1)",
         "probabilitas model (terkalibrasi) tetap 0,7816"],
        ["λ = 1 adalah titik terbaik",
         "angka mitigasi ini adalah evaluasi final",
         "probabilitas mentah tetap 0,7816",
         "ROC-AUC mentah 0,7816"],
    ),
    # M7.5: fairness monitoring terpisah dari overall (AIR SEX
    # [simulasi] 0,710 di chunk 2); matured cohort (jendela 1
    # bulan); attribution drift [simulasi] (PAY_MAX 0,2500,
    # UTILIZATION 0,3100) = diagnosis, bukan kausal.
    (
        "mlf-m75-monitoring-drift.ts",
        ["0,710", "proporsi label matang", "0,2500", "0,3100",
         "Cohort MATANG"],
        ["label belum matang = 0", "fairness_flag=False"],
    ),
]


def _decode(raw: str) -> str:
    # File lesson menyimpan non-ASCII sebagai escape \uXXXX; needle
    # ditulis dengan karakter aslinya — decode dulu sebelum membandingkan.
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda m: chr(int(m.group(1), 16)), raw)


def main() -> int:
    ok = True
    for fname, must_have, must_not in FIXTURES:
        text = _decode((ROOT / fname).read_text())
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
