#!/usr/bin/env python3
"""Build snapshot dataset untuk 3 misi M1 grup DATA-SAINTEK (2026-10-15).

Misi B (edge): data lebih kotor/ambigu dibanding pilot.
- misi-audit-imunisasi-who : WHO GHO (DTP3 WUENIC + MCV2 + U5MR), 12 negara, 2000-2024
- misi-kontaminasi-platform  : SEQC ROC (MGP/NYU/SQW), A/B x 2 replika, + 92 ERCC
- misi-orakel-buta-blockchain : BitcoinHeist 2016-2017 (19.117 ransomware) + white sample + OFAC XBT join

Output: ~/workspace/learn-platform/public/misi/<slug>/ + METODE.md per misi.
Seed tetap = 42. Injeksi impostor HANYA di file *_audit.csv, didokumentasikan.
"""
import csv, json, os, random
from collections import defaultdict

SEED = 42
random.seed(SEED)
OUT = os.path.expanduser("~/workspace/learn-platform/public/misi")
os.makedirs(OUT, exist_ok=True)
COUNTRIES = ["IDN", "MYS", "THA", "PHL", "VNM", "SGP", "IND", "BGD", "BRA", "NGA", "KEN", "ETH"]

# ═══════════════════════════════════════════════════════════════════════
# 1. WHO GHO — misi-audit-imunisasi-who
# Sumber: WHO Global Health Observatory OData API (diunduh 2026-10-15,
# https://ghoapi.azureedge.net/api/{WHS4_100,MCV2,MDG_0000000007}).
# Lisensi: ketentuan WHO — bundel kecil untuk keperluan public health
# diperbolehkan dengan atribusi (lihat C5 dokumen dataset).
# ═══════════════════════════════════════════════════════════════════════
def build_who():
    d = os.path.join(OUT, "misi-audit-imunisasi-who"); os.makedirs(d, exist_ok=True)

    def load(code):
        with open(f"/tmp/gho_{code}.json") as f:
            return json.load(f)["value"]

    dtp3 = load("dtp3")      # WHS4_100 — DTP3 WUENIC
    mcv2 = load("mcv2")      # MCV2 WUENIC (by locally recommended age)
    u5mr = load("u5mr")      # MDG_0000000007 — U5MR UN IGME

    rows = []
    # DTP3 + MCV2: satu baris per negara-tahun
    for code, ind in (("WHS4_100", "DTP3"), ("MCV2", "MCV2")):
        for r in (dtp3 if code == "WHS4_100" else mcv2):
            if r.get("SpatialDim") not in COUNTRIES: continue
            y = r.get("TimeDim")
            if not (2000 <= (y or 0) <= 2024): continue
            v = r.get("NumericValue")
            if v is None: continue
            rows.append({"negara": r["SpatialDim"], "tahun": y, "indikator": ind,
                         "nilai": round(v, 1), "sumber": "WUENIC",
                         "catatan": "usia rekomendasi lokal" if ind == "MCV2" else ""})
    # U5MR: nasional (TOTL) + kuintil termiskin/terkaya, both sexes
    for r in u5mr:
        if r.get("SpatialDim") not in COUNTRIES: continue
        if r.get("Dim1") != "SEX_BTSX": continue
        q = r.get("Dim3")
        if q not in ("WEALTHQUINTILE_TOTL", "WEALTHQUINTILE_WQ1", "WEALTHQUINTILE_WQ5"): continue
        y = r.get("TimeDim")
        if not (2000 <= (y or 0) <= 2024): continue
        v = r.get("NumericValue")
        if v is None: continue
        qlbl = {"WEALTHQUINTILE_TOTL": "nasional", "WEALTHQUINTILE_WQ1": "WQ1-termiskin",
                "WEALTHQUINTILE_WQ5": "WQ5-terkaya"}[q]
        rows.append({"negara": r["SpatialDim"], "tahun": y, "indikator": "U5MR",
                     "nilai": round(v, 2), "sumber": "UN-IGME",
                     "catatan": f"{qlbl}; interval [{round(r.get('Low') or 0,1)}-{round(r.get('High') or 0,1)}]"})
    rows.sort(key=lambda r: (r["negara"], r["indikator"], r["tahun"]))
    F = ["negara", "tahun", "indikator", "nilai", "sumber", "catatan"]
    with open(os.path.join(d, "who_imunisasi.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=F); w.writeheader(); w.writerows(rows)
    print(f"WHO bersih: {len(rows)} baris")

    # ── file audit: injeksi terdokumentasi ──
    audit = [dict(r) for r in rows]
    inj = []
    # I1: source swap — DTP3 IDN 2022: WUENIC 91 diganti 96 ("country-reported"), sumber tetap ditulis WUENIC
    for r in audit:
        if r["negara"] == "IDN" and r["tahun"] == 2022 and r["indikator"] == "DTP3":
            r["nilai"] = 96.0; r["catatan"] = ""
            inj.append("I1-source-swap: IDN 2022 DTP3 91->96, sumber tetap 'WUENIC'"); break
    # I2: revision ghost — duplikat baris U5MR IDN 2020 nasional dengan nilai berbeda, tanpa catatan revisi
    base_u5 = [r for r in rows if r["negara"] == "IDN" and r["tahun"] == 2020 and r["indikator"] == "U5MR" and "nasional" in r["catatan"]]
    if base_u5:
        ghost = dict(base_u5[0]); ghost["nilai"] = round(ghost["nilai"] + 2.5, 2)
        ghost["catatan"] = "nasional; interval [..]"
        audit.append(ghost); inj.append(f"I2-revision-ghost: duplikat IDN 2020 U5MR nasional {base_u5[0]['nilai']} vs {ghost['nilai']}")
    # I3: fabricated trend point — IDN 2024 DTP3 diganti 97 (proyeksi), seolah observasi
    for r in audit:
        if r["negara"] == "IDN" and r["tahun"] == 2024 and r["indikator"] == "DTP3":
            r["nilai"] = 97.0
            inj.append("I3-fabricated-point: IDN 2024 DTP3 diobservasi->97 (proyeksi)"); break
    audit.sort(key=lambda r: (r["negara"], r["indikator"], r["tahun"]))
    with open(os.path.join(d, "who_imunisasi_audit.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=F); w.writeheader(); w.writerows(audit)
    print(f"WHO audit: {len(audit)} baris; injeksi: {inj}")

    # ── angka kunci untuk lab (dihitung dari file BERSIH) ──
    def get(neg, ind, y, q=""):
        for r in rows:
            if r["negara"] == neg and r["indikator"] == ind and r["tahun"] == y and q in r["catatan"]:
                return r["nilai"]
        return None
    print("KUNCI LAB [who]:")
    print("  idn_dtp3_2019 =", get("IDN", "DTP3", 2019), "| idn_dtp3_2021 =", get("IDN", "DTP3", 2021))
    print("  idn_mcv2_2021 =", get("IDN", "MCV2", 2021))
    print("  idn_u5mr_2000 =", get("IDN", "U5MR", 2000, "nasional"), "| idn_u5mr_2024 =", get("IDN", "U5MR", 2024, "nasional"))
    print("  idn_wq1_2024 =", get("IDN", "U5MR", 2024, "WQ1"), "| idn_wq5_2024 =", get("IDN", "U5MR", 2024, "WQ5"))
    # negara dengan penurunan DTP3 2019->2021 terbesar
    drops = {}
    for neg in COUNTRIES:
        a, b = get(neg, "DTP3", 2019), get(neg, "DTP3", 2021)
        if a and b: drops[neg] = round(a - b, 1)
    print("  max DTP3 drop 2019-2021:", max(drops.items(), key=lambda x: x[1]))

    metode = f"""# Metode Snapshot — Misi Audit Imunisasi WHO

Sumber: WHO Global Health Observatory OData API, diunduh 2026-10-15:
- WHS4_100 — DTP3 immunization coverage among 1-year-olds (%), WUENIC
- MCV2 — Measles-containing-vaccine second-dose coverage by the locally recommended age (%), WUENIC
- MDG_0000000007 — Under-five mortality rate per 1000 live births, UN IGME (Dim1=SEX_BTSX; Dim3=WEALTHQUINTILE_TOTL/WQ1/WQ5)
Endpoint: https://ghoapi.azureedge.net/api/{{kode}} — diakses {__import__('datetime').date.today()}.

Lisensi/ketentuan: teks halaman terms WHO — "WHO grants the royalty-free, worldwide, non-exclusive right to use, reproduce, extract, download, copy, distribute, display or include the Datasets for public health purposes" + atribusi wajib. Snapshot kecil ini dipakai untuk pendidikan/audit kesehatan masyarakat (public health purposes). Atribusi: "Data: WHO Global Health Observatory, diakses 2026-10-15".

## Seleksi
- 12 negara: IDN, MYS, THA, PHL, VNM, SGP, IND, BGD, BRA, NGA, KEN, ETH.
- Tahun 2000–2024. Nilai = NumericValue API (1 desimal imunisasi, 2 desimal U5MR).
- Kolom: negara, tahun, indikator, nilai, sumber, catatan (jadwal usia lokal utk MCV2; interval ketidakpastian utk U5MR).
- Hasil: {len(rows)} baris.

## Kejujuran data
- MCV2 "by the locally recommended age": JADWAL BERBEDA antar negara — perbandingan lintas negara mentah TIDAK VALID (jebakan desain misi).
- U5MR adalah ESTIMASI MODEL UN IGME dengan interval ketidakpastian lebar — bukan hitungan sensus.
- DTP3/MCV2 WUENIC = estimasi WHO/UNICEF, BUKAN angka laporan negara (yang sering lebih tinggi).
- `who_imunisasi.csv` = data bersih apa adanya dari API.
- `who_imunisasi_audit.csv` = data yang diaudit pelajar; memuat 3 injeksi terdokumentasi:
  I1 source-swap (IDN 2022 DTP3 91->96, sumber tetap ditulis WUENIC);
  I2 revision-ghost (duplikat baris U5MR IDN 2020 nasional tanpa catatan revisi);
  I3 fabricated-point (IDN 2024 DTP3 diobservasi->97).
"""
    open(os.path.join(d, "METODE.md"), "w").write(metode)

# ═══════════════════════════════════════════════════════════════════════
# 2. SEQC ROC — misi-kontaminasi-platform
# Sumber: Bioconductor seqc 1.46.0, ROC_refseq_gene_{MGP,NYU,SQW}.rda
# (diunduh 2026-10-15 dari bioconductor.org; GPL-3).
# Kolom impostor platform: ILM_aceview_gene_BGI.rda (sampel A, dipetakan via EntrezID).
# ═══════════════════════════════════════════════════════════════════════
def build_seqc_roc():
    import pyreadr
    import numpy as np
    d = os.path.join(OUT, "misi-kontaminasi-platform"); os.makedirs(d, exist_ok=True)
    W = os.path.expanduser("~/workspace/learn-platform/misi-data/work/seqc/data")

    mats, meta = {}, []
    for center in ["MGP", "NYU", "SQW"]:
        r = pyreadr.read_r(f"{W}/ROC_refseq_gene_{center}.rda")
        df = r[f"ROC_refseq_gene_{center}"]
        sc = [c for c in df.columns if c not in ("EntrezID", "Symbol", "GeneLength", "IsERCC")]
        mats[center] = df
        for c in sc:
            label = c.split("_")[0]  # A / B
            meta.append({"sample": f"{center}_{c}", "center": center, "label": label,
                         "replicate": c, "platform": "ROC"})
    base = mats["MGP"][["EntrezID", "Symbol", "IsERCC"]].copy()
    X = np.column_stack([mats[c][[m["replicate"] for m in meta if m["center"] == c]].values
                         for c in ["MGP", "NYU", "SQW"]])
    assert X.shape[1] == 12
    # seleksi gen: top 3000 variansi (log1p) + semua ERCC
    lv = np.log1p(X).var(axis=1)
    is_ercc = base["IsERCC"].values == 1
    order = np.argsort(-lv)
    keep = np.zeros(len(base), dtype=bool)
    n = 0
    for i in order:
        if not is_ercc[i] and n < 3000:
            keep[i] = True; n += 1
    keep = keep | is_ercc
    print(f"ROC: {keep.sum()} gen terpilih ({n} variabel + {is_ercc.sum()} ERCC)")
    genes = base[keep].reset_index(drop=True)
    Xk = X[keep]
    samp_names = [m["sample"] for m in meta]

    # file bersih
    cc = genes[["EntrezID", "Symbol", "IsERCC"]].copy()
    for j, s in enumerate(samp_names):
        cc[s] = Xk[:, j].astype(int)
    cc.to_csv(os.path.join(d, "counts.csv"), index=False)
    import pandas as pd
    pd.DataFrame(meta)[["sample", "center", "label", "replicate", "platform"]].to_csv(
        os.path.join(d, "samples.csv"), index=False)
    libsize = Xk.sum(axis=0)
    ercc_frac = Xk[genes["IsERCC"].values == 1].sum(axis=0) / libsize
    pd.DataFrame({"sample": samp_names, "library_size": libsize.astype(int),
                  "ercc_fraction": np.round(ercc_frac, 4)}).to_csv(
        os.path.join(d, "ercc_qc.csv"), index=False)
    print("ROC bersih: 12 sampel;",
          {s: int(v) for s, v in zip(samp_names, libsize)})

    # ── file audit: 4 injeksi ──
    Xa = Xk.copy(); meta_a = [dict(m) for m in meta]
    inj = []
    # I1: label center salah — NYU_B_R01 diklaim sebagai MGP
    i_nyu_b1 = samp_names.index("NYU_B_1_R01")
    meta_a[i_nyu_b1]["sample"] = "MGP_B_1_R01x"
    meta_a[i_nyu_b1]["center"] = "MGP"
    inj.append("I1-wrong-center: NYU_B_1_R01 -> diklaim MGP")
    # I2: ERCC failure — SQW_A_R02: semua count ERCC di-nol-kan
    i_sqw_a2 = samp_names.index("SQW_A_1_R02")
    Xa[genes["IsERCC"].values == 1, i_sqw_a2] = 0
    inj.append("I2-ercc-failure: SQW_A_1_R02 ERCC di-nol-kan")
    # I3: kontaminasi platform — kolom ILM (aceview BGI, sampel A) dilabeli SQW_B_R03
    r_ilm = pyreadr.read_r(f"{W}/ILM_aceview_gene_BGI.rda")
    ilm = r_ilm["ILM_aceview_gene_BGI"]
    id2row = {str(e): i for i, e in enumerate(ilm["EntrezID"].values) if str(e) != "nan"}
    col = []
    for e in genes["EntrezID"].values:
        col.append(ilm["A_1_L01_FlowCellA"].values[id2row[str(e)]] if str(e) in id2row else 0)
    col = np.array(col)
    Xa = np.column_stack([Xa, col])
    meta_a.append({"sample": "SQW_B_1_R03", "center": "SQW", "label": "B",
                   "replicate": "B_1_R03", "platform": "ROC"})
    inj.append(f"I3-platform-contam: kolom ILM A_1_L01_FlowCellA ({int(col.sum())} reads) dilabeli SQW_B_1_R03")
    # I4: replika terlalu sempurna — MGP_B_R02 disalin + jitter 1% sebagai MGP_B_R03
    i_mgp_b2 = samp_names.index("MGP_B_1_R02")
    rng = np.random.RandomState(SEED)
    dup = (Xa[:, i_mgp_b2] * (1 + rng.normal(0, 0.01, Xa.shape[0]))).astype(int).clip(min=0)
    Xa = np.column_stack([Xa, dup])
    meta_a.append({"sample": "MGP_B_1_R03", "center": "MGP", "label": "B",
                   "replicate": "B_1_R03", "platform": "ROC"})
    inj.append("I4-jittered-dup: MGP_B_R02 disalin + noise 1% sebagai MGP_B_R03")
    print("ROC audit injeksi:", inj)

    samp_names_a = [m["sample"] for m in meta_a]
    cca = genes[["EntrezID", "Symbol", "IsERCC"]].copy()
    for j, s in enumerate(samp_names_a):
        cca[s] = Xa[:, j].astype(int)
    cca.to_csv(os.path.join(d, "counts_audit.csv"), index=False)
    pd.DataFrame(meta_a)[["sample", "center", "label", "replicate", "platform"]].to_csv(
        os.path.join(d, "samples_audit.csv"), index=False)

    # ── kunci lab (dari file BERSIH) ──
    med_lib = {}
    for c in ["MGP", "NYU", "SQW"]:
        idx = [j for j, m in enumerate(meta) if m["center"] == c]
        med_lib[c] = float(np.median(libsize[idx]))
    med_ercc = {}
    for c in ["MGP", "NYU", "SQW"]:
        idx = [j for j, m in enumerate(meta) if m["center"] == c]
        med_ercc[c] = float(np.median(ercc_frac[idx]))
    # korelasi: tetangga terdekat tiap sampel (apakah selalu se-center?)
    import numpy as np
    L = np.log1p(Xk); Lc = L - L.mean(axis=0)
    corr = (Lc.T @ Lc) / np.sqrt((Lc ** 2).sum(axis=0))[:, None] / np.sqrt((Lc ** 2).sum(axis=0))[None, :]
    np.fill_diagonal(corr, -1)
    nn_same = 0
    for j in range(12):
        nn = int(np.argmax(corr[j]))
        if meta[nn]["center"] == meta[j]["center"]:
            nn_same += 1
    print("KUNCI LAB [roc]:")
    print("  median libsize:", {k: int(v) for k, v in med_lib.items()})
    print("  median ercc_frac:", {k: round(v, 4) for k, v in med_ercc.items()})
    print("  sampel dg tetangga-terdekat se-center:", nn_same, "/12")
    print("  max libsize sample:", samp_names[int(np.argmax(libsize))], int(libsize.max()))
    print("  n_genes:", int(keep.sum()))

    metode = f"""# Metode Snapshot — Misi Kontaminasi Platform (SEQC ROC)

Sumber: Bioconductor experiment data package `seqc` 1.46.0, diunduh 2026-10-15
dari https://bioconductor.org/packages/release/data/experiment/src/contrib/seqc_1.46.0.tar.gz.
File: ROC_refseq_gene_{{MGP,NYU,SQW}}.rda (platform ROC/Roche 454, anotasi RefSeq);
kolom impostor platform dari ILM_aceview_gene_BGI.rda (platform ILM/Illumina).
Lisensi: **GPL-3** (tabel Details halaman Bioconductor seqc).

## Seleksi
- Platform ROC, 3 center (MGP, NYU, SQW) × sampel A (UHRR)/B (HBRR) × 2 replika = 12 sampel.
- Gen: top 3000 variansi (log1p) lintas 12 sampel + 92 ERCC spike-in = {int(keep.sum())} gen.
- File: counts.csv (gen × 12 sampel), samples.csv (metadata), ercc_qc.csv
  (library size + fraksi ERCC per sampel — tabel QC ground truth).

## Kejujuran data
- Matriks count ROC asli tidak diubah di file bersih. ERCC adalah spike-in
  sintetik dengan konsentrasi diketahui — perilakunya adalah "kebenaran"
  teknis independen dari biologi sampel.
- `counts_audit.csv` / `samples_audit.csv` memuat 4 injeksi terdokumentasi:
  I1 wrong-center (NYU_B_1_R01 diklaim sebagai MGP);
  I2 ercc-failure (seluruh count ERCC SQW_A_1_R02 di-nol-kan);
  I3 platform-contam (satu kolom ILM BGI, {int(col.sum())} reads, dilabeli SQW_B_1_R03);
  I4 jittered-dup (MGP_B_R02 disalin + noise 1% sebagai replika baru MGP_B_R03).
"""
    open(os.path.join(d, "METODE.md"), "w").write(metode)


# ═══════════════════════════════════════════════════════════════════════
# 3. BitcoinHeist 2016-2017 + OFAC — misi-orakel-buta-blockchain
# Sumber: UCI BitcoinHeist Ransomware Address Dataset (CC BY 4.0),
#   https://archive.ics.uci.edu/dataset/526/bitcoinheist+ransomware+address+dataset
# Orakel: OFAC sanctioned XBT addresses, branch `lists`, di-pin 2026-10-15
#   (data OFAC = public domain, 17 U.S.C. §105; tool MIT).
# ═══════════════════════════════════════════════════════════════════════
def build_orakel():
    import zipfile
    import pandas as pd
    import numpy as np
    d = os.path.join(OUT, "misi-orakel-buta-blockchain"); os.makedirs(d, exist_ok=True)
    W = os.path.expanduser("~/workspace/learn-platform/misi-data/work")
    ofac = set(l.strip() for l in open(f"{W}/ofac_XBT.txt") if l.strip())

    z = zipfile.ZipFile(f"{W}/bh.zip")
    COLS = ["address", "year", "label", "length", "weight", "count", "looped",
            "neighbors", "income"]
    rans_parts, white_sanc_parts, white_pool = [], [], []
    rng = random.Random(SEED)
    for c in pd.read_csv(z.open("BitcoinHeistData.csv"), usecols=COLS, chunksize=400000):
        c = c.copy()
        c["is_sanctioned"] = c["address"].isin(ofac).astype(int)
        r = c[(c["year"].isin([2016, 2017])) & (c["label"] != "white")]
        rans_parts.append(r)
        ws = c[c["is_sanctioned"] == 1]
        white_sanc_parts.append(ws[ws["label"] == "white"])
        wp = c[(c["year"].isin([2016, 2017])) & (c["label"] == "white") & (c["is_sanctioned"] == 0)]
        if len(wp):
            white_pool.append(wp.sample(n=min(len(wp), 1200), random_state=SEED))
    rans = pd.concat(rans_parts, ignore_index=True)
    wsanc = pd.concat(white_sanc_parts, ignore_index=True).drop_duplicates("address")
    wpool = pd.concat(white_pool, ignore_index=True)
    # stratified white sample 5000
    wpool = wpool.sample(n=min(5000, len(wpool)), random_state=SEED)
    base = pd.concat([rans, wsanc, wpool], ignore_index=True)
    base = base.sort_values(["year", "label", "address"]).reset_index(drop=True)
    base.to_csv(os.path.join(d, "entitas.csv"), index=False)
    n_rans, n_wsanc = len(rans), len(wsanc)
    print(f"Orakel bersih: {len(base)} baris (ransomware 2016-17: {n_rans}, white-sanctioned: {n_wsanc}, white sample: {len(wpool)})")

    # ── kunci lab (dari file BERSIH) ──
    sig = base.groupby(["weight", "count", "neighbors", "looped"]).size().reset_index(name="n")
    top = sig.sort_values("n", ascending=False).iloc[0]
    top_sig = (int(top["weight"]), int(top["count"]), int(top["neighbors"]), int(top["looped"]))
    overlap = 0
    sanc_sigs = set(zip(wsanc["weight"], wsanc["count"], wsanc["neighbors"], wsanc["looped"]))
    rans_sigs = set(zip(rans["weight"], rans["count"], rans["neighbors"], rans["looped"]))
    overlap = len(sanc_sigs & rans_sigs)
    med_inc_wsanc = int(wsanc["income"].median())
    print("KUNCI LAB [orakel]:")
    print(f"  n_sanctioned_white = {n_wsanc}")
    print(f"  top_sig = {top_sig} n = {int(top['n'])}")
    print(f"  overlap_sanc_rans_sig = {overlap}")
    print(f"  median income sanctioned-white = {med_inc_wsanc}")
    print(f"  sanctioned share white = {n_wsanc}/{len(base[base['is_sanctioned']==1])}")

    # ── file audit: injeksi terdokumentasi ──
    audit = base.copy()
    inj = []
    # I1: label tampering — 3 princetonLocky -> white
    locky = audit[audit["label"] == "princetonLocky"].head(3).index
    audit.loc[locky, "label"] = "white"
    inj.append("I1-label-tamper: 3 princetonLocky -> 'white'")
    # I2: income inflation — 5 white-sanctioned income x10
    ws_idx = audit[audit["is_sanctioned"] == 1].head(5).index
    audit.loc[ws_idx, "income"] = audit.loc[ws_idx, "income"] * 10
    inj.append("I2-income-x10: 5 alamat sanctioned income dikali 10")
    # I3: ghost duplicate — 4 alamat muncul 2x dengan label berbeda
    dup_rows = audit[audit["label"] == "princetonLocky"].head(4).copy()
    dup_rows["label"] = "white"
    audit = pd.concat([audit, dup_rows], ignore_index=True)
    inj.append("I3-ghost-dup: 4 alamat ganda (princetonLocky + white)")
    # I4: oracle suppression — 2 sanctioned -> is_sanctioned=0
    sup_idx = audit[audit["is_sanctioned"] == 1].head(2).index
    audit.loc[sup_idx, "is_sanctioned"] = 0
    inj.append("I4-oracle-suppress: 2 alamat sanctioned di-nol-kan flagnya")
    audit = audit.sort_values(["year", "label", "address"]).reset_index(drop=True)
    audit.to_csv(os.path.join(d, "entitas_audit.csv"), index=False)
    print("Orakel audit injeksi:", inj)

    # ofac snapshot beku
    with open(os.path.join(d, "ofac_sanctioned_xbt.txt"), "w") as fh:
        fh.write("\n".join(sorted(ofac)) + "\n")

    metode = f"""# Metode Snapshot — Misi Orakel Buta (BitcoinHeist + OFAC)

Sumber primer: BitcoinHeist Ransomware Address Dataset, UCI ML Repository
(https://archive.ics.uci.edu/dataset/526/bitcoinheist+ransomware+address+dataset),
diunduh 2026-10-15. Lisensi: **CC BY 4.0** — "sharing and adaptation for any
purpose, provided that the appropriate credit is given."
Atribusi: "Data: Akcora et al., BitcoinHeist, UCI ML Repository, CC BY 4.0".

Orakel: OFAC sanctioned digital currency addresses (XBT), branch `lists`,
repo 0xB10C/ofac-sanctioned-digital-currency-addresses, di-pin 2026-10-15
({len(ofac)} alamat; commit tercatat di repo). Data OFAC = karya pemerintah
federal AS (public domain, 17 U.S.C. §105); tool repo MIT.

## Seleksi (seed 42)
- Semua baris berlabel ransomware tahun 2016–2017: {n_rans} baris
  (era gelombang Locky/Cerber: princetonLocky, princetonCerber dominan).
- SEMUA alamat berlabel `white` yang cocok daftar OFAC (semua tahun): {n_wsanc} alamat.
- Sampel `white` non-sanksi tahun 2016–2017: 5.000 baris acak (stratified per chunk).
- Kolom: address, year, label, length, weight, count, looped, neighbors, income,
  is_sanctioned (1 bila cocok daftar OFAC XBT per 2026-10-15).
- Total: {len(base)} baris.

## Kejujuran data
- TEMUAN KUNCI (bukan injeksi): {n_wsanc} alamat berlabel `white` cocok daftar
  sanksi OFAC; 0 alamat berlabel ransomware yang cocok. Label `white` di dataset
  riset BUKAN penilaian risiko dunia nyata.
- Daftar OFAC adalah snapshot 2026; transaksi dataset 2011–2018 — ketidakcocokan
  temporal ini AMBIGUITAS NYATA (alamat disanksi 2022 bisa jadi "bersih" pada 2016,
  atau label white memang salah sejak awal; data ini tidak bisa memutuskan).
- Signature perilaku (weight,count,neighbors,looped) ber Kardinalitas rendah:
  6 signature dipakai bersama alamat sanksi & ribuan alamat ransomware
  (terbesar: 7.072 baris) — clustering naif = false-positive massal.
- `entitas.csv` = data bersih. `entitas_audit.csv` memuat 4 injeksi terdokumentasi:
  I1 label-tamper (3 princetonLocky -> white); I2 income-x10 (5 sanctioned);
  I3 ghost-dup (4 alamat ganda beda label); I4 oracle-suppress (2 flag sanksi di-nol-kan).
"""
    open(os.path.join(d, "METODE.md"), "w").write(metode)


if __name__ == "__main__":
    build_who()
    build_seqc_roc()
    build_orakel()
