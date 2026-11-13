#!/usr/bin/env python3
"""Fill gap Luna M7 — M7.3: G9 (counterfactual) + G7 (adverse-action workflow + Lab 3).
Insert G9+G7 after 'explainability-untuk-fairness' (steps 11-12), Lab 3 after lab2;
renumber eyebrows (labs 13-14, checkpoint 15); Peta; estMinutes 70->85;
2 checkpoint quizzes; summary bullets. TS + .md mirror.
Counterfactual numbers are REAL: qa-learn/m7g9_counterfactual_calc.py
(baseline reproduced exactly: LR 0,7187 / GBM 0,8599 / cal 0,8492).
"""
import re
from pathlib import Path

TS = Path("src/app/v2/content/mlf-m73-explainability-shap-lime.ts")
MD = Path("content/mlf-m73-explainability-shap-lime.md")

G9_BLOCK = '''    {
      id: "counterfactual",
      eyebrow: "Langkah 11 · Counterfactual",
      title: "Counterfactual: «apa yang harus berubah» — bukan «apa penyebabnya»",
      prose: [
        "Tiga jenis penjelasan yang sering dicampuradukkan — dan mencampurkannya adalah kesalahan yang mahal. DESCRIPTIVE: «fitur apa yang mendorong keputusan ini?» — SHAP menjawabnya (PAY_MAX +1,1368, PAY_0 +0,9280 untuk nasabah 858, langkah 6). Ia mendeskripsikan PENALARAN MODEL. COUNTERFACTUAL: «perubahan input minimal apa yang membalikkan keputusan?» — «seandainya riwayat bayar 858 sempurna, apakah ia disetujui?» Ia tetap pertanyaan tentang MODEL — what-if atas inputnya. CAUSAL: «PAY_MAX MENYEBABKAN default» — klaim tentang DUNIA, bukan tentang model. Klaim kausal butuh intervensi atau eksperimen — sesuatu yang lesson ini tidak pernah lakukan. SHAP yang besar tidak pernah membuktikan kausalitas: ia hanya berkata «model ini mengandalkan fitur itu», bukan «fitur itu menyebabkan hasilnya».",
        "Nilai [notebook] — counterfactual nasabah 858, dihitung ulang dari data (bukan ditebak). Baseline: GBM terkalibrasi 0,8492 — ditolak (threshold 0,10). CF-A, «seandainya enam bulan terakhir semuanya dibayar tepat waktu» (PAY_0..6 = −1, PAY_AMT tetap 0): LR 0,1382, GBM mentah 0,3707, GBM terkalibrasi 0,3325 — TETAP DITOLAK. CF-B, ditambah «dibayar penuh tiap bulan» (PAY_AMT1..6 = BILL_AMT): LR 0,1456, GBM mentah 0,1406, GBM terkalibrasi 0,1535 — TETAP DITOLAK. Bahkan riwayat yang SEMPURNA pun tidak membalikkan keputusan: limit NT$20.000 yang sangat rendah dan fitur-fitur lain tetap mendorong skor di atas 0,10. Dan perhatikan kejutan kecilnya: membayar penuh justru MENAIKKAN probabilitas LR (0,1382 → 0,1456) — arah counterfactual tidak bisa ditebak, ia harus dihitung ulang. Inilah gunanya counterfactual sebagai DIAGNOSIS: ia mengukur seberapa jauh keputusan ini dari ambang — dan jawabannya di sini: jauh.",
        "Baik atau buruk: counterfactual itu bagus bila dipakai sebagai diagnosis model — «seberapa besar perubahan yang dibutuhkan untuk membalikkan keputusan?» adalah pertanyaan yang sah dan terukur. Buruk bila dijual sebagai RENCANA AKSI untuk nasabah: nasabah 858 TIDAK BISA mengubah riwayat PAY_0..6-nya — enam bulan itu sudah terjadi. «Turunkan PAY_MAX-mu menjadi 0» bukan saran — itu manipulasi fitur: PAY_MAX adalah fitur TURUNAN (maksimum dari enam kolom PAY), bukan tombol yang bisa diputar. Dan buruk bila dibaca sebagai klaim kausal: «PAY_MAX yang menyebabkan penolakan» terdengar seperti fakta dunia, padahal yang ditunjukkan hanyalah «model ini sensitif terhadap PAY_MAX». Tiga aturan feasibility sebelum counterfactual apa pun ditulis sebagai saran: (1) fitur sensitif TIDAK PERNAH diubah — «jadi perempuan» atau «jadi 10 tahun lebih muda» bukan tindakan; (2) fitur historis tidak bisa diubah mundur — counterfactual atas masa lalu adalah diagnosis, bukan rencana; (3) hanya perilaku MASA DEPAN yang bisa disarankan — «bayar tepat waktu di bulan-bulan ke depan» — dan itu pun harus jujur: model ini menilai enam bulan TERAKHIR, jadi perbaikan perilaku baru terlihat di penilaian MENDATANG, bukan di keputusan hari ini.",
        "Mitigasi: setiap counterfactual yang kamu tulis wajib membawa TIGA label — modelnya (GBM terkalibrasi? LR?), perubahan eksaknya (kolom apa, dari berapa ke berapa), dan statusnya («what-if model, bukan janji» — keputusan masa depan memakai data masa depan). Jangan pernah menulis counterfactual tanpa ketiganya. Dan bila counterfactual-mu bahkan tidak membalikkan keputusan (seperti CF-A dan CF-B di sini), LAPORKAN itu apa adanya: «bahkan dengan riwayat sempurna, model ini tetap menolak» adalah informasi yang jauh lebih jujur — dan lebih berguna — daripada counterfactual yang dipilih-pilih sampai menemukan satu yang berhasil.",
      ],
      tasks: [],
    },
'''

G7_BLOCK = '''    {
      id: "adverse-action-workflow",
      eyebrow: "Langkah 12 · Alur komunikasi keputusan",
      title: "Dari penjelasan ke surat penolakan: alur komunikasi keputusan (adverse action)",
      prose: [
        "Penjelasan yang benar belum tentu surat penolakan yang baik. Nasabah 858 tidak butuh waterfall SHAP — ia butuh surat yang berkata, dalam bahasa yang ia mengerti, KENAPA ia ditolak, APA yang bisa ia lakukan, dan KEPADA SIAPA ia bisa banding. Alur komunikasi keputusan (adverse action) punya ENAM gerbang, dan penjelasan model hanya gerbang pertamanya: (1) keputusan: ditolak, skor GBM terkalibrasi 0,8492 ≥ threshold 0,10; (2) reason codes top-3 — DENGAN label model asalnya; (3) terjemahan ke bahasa awam; (4) langkah yang bisa dilakukan nasabah; (5) reviewer manusia yang memeriksa surat itu sebelum dikirim; (6) suratnya sendiri: keputusan, alasan, tindakan, jangka waktu banding, dan cara banding.",
        "Nilai [notebook] — template surat untuk nasabah 858. Keputusan: ditolak — probabilitas default prediksi 0,8492, di atas threshold 0,10. Tiga reason codes teratas (dari LR, ROC-AUC 0,7426): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir». Langkah yang bisa dilakukan: bayar tepat waktu di bulan-bulan ke depan; bayar penuh bila memungkinkan; ajukan peninjauan limit setelah riwayat membaik. Yang TIDAK BOLEH tertulis: «ubah jenis kelaminmu», «ubah riwayat pembayaranmu» — keduanya bukan tindakan (langkah 11). Reviewer: nama peninjau manusia + tanggal. Banding: jangka waktu dan caranya, tertulis eksplisit. Dan footer-nya wajib: «reason codes ini dari model LR pendamping (ROC-AUC 0,7426), bukan dari GBM keputusan (0,7823)» — karena reason codes dari model lain tanpa label adalah penjelasan yang menyesatkan (langkah 8).",
        "Baik atau buruk: alur ini bagus karena ia memisahkan DUA dokumen yang sering dicampur: PENJELASAN (untuk analis dan auditor — waterfall SHAP, dekomposisi LR, permutation) dan SURAT PENOLAKAN (untuk nasabah — top-3 reason codes bahasa awam + tindakan + banding). Buruk bila keduanya dicampur: surat yang berisi waterfall SHAP lengkap (base −1,555, jumlah SHAP 3,3699, lima kontribusi terbesar) bukan surat yang baik — ia dokumen analis yang salah alamat. Dan buruk bila reason codes LR dan SHAP GBM dicampur tanpa label: top-3 LR adalah PAY_DELAY_COUNT, PAY_MAX, PAY_0 — top-3 SHAP GBM lokal adalah PAY_MAX, PAY_0, PAY_AMT3. Keduanya sepakat dua dari tiga — tapi PAY_DELAY_COUNT hanya ada di LR, PAY_AMT3 hanya ada di SHAP GBM. Surat yang menulis ketiganya seolah-olah dari satu model adalah surat yang berbohong soal sumbernya.",
        "Mitigasi: jadikan alur ini PROSEDUR OPERASIONAL, bukan kebiasaan. Setiap surat penolakan wajib lolos TIGA pemeriksaan sebelum dikirim: (1) apakah tiap reason code menyebut MODEL asalnya? (2) apakah tiap langkah yang disarankan BENAR-BENAR bisa dilakukan nasabah (uji feasibility langkah 11 — sensitif dan historis tidak lolos)? (3) apakah suratnya berisi reviewer, tanggal, dan cara banding? Satu pemeriksaan gagal berarti surat dikembalikan ke draf. Dan simpan salinan suratnya bersama model version dan threshold policy-nya (M7.4, langkah 12) — bila nasabah banding setahun kemudian, yang dibuka adalah surat DAN template tata kelolanya, bukan ingatan seseorang.",
      ],
      tasks: [],
    },
'''

LAB3_BLOCK = '''    {
      id: "lab3",
      eyebrow: "Langkah 14 · Lab 3",
      title: "Lab: dari fitur kanonis ke bahasa pelanggan — reason codes untuk nasabah 858",
      prose: [
        "Lab ketiga mengubah angka kanonis menjadi surat. LR top-3 untuk nasabah 858 [notebook]: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532 (log-odds 0,9378; probabilitas 0,7187). SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553 (base −1,555; jumlah SHAP 3,3699; log-odds 1,8148). GBM terkalibrasi 0,8492 — ditolak, threshold 0,10. Tugasmu: terjemahkan top-3 LR ke bahasa awam, hitung berapa yang tumpang tindih dengan top-3 SHAP GBM, dan tandai tiap usulan tindakan sebagai feasible atau tidak — dengan aturan feasibility langkah 11.",
        "Hasil yang diharapkan [lab]: reason_lr_1=Jumlah bulan dengan keterlambatan pembayaran; reason_lr_2=Keterlambatan pembayaran terburuk dalam 6 bulan terakhir; reason_lr_3=Status pembayaran bulan terakhir; overlap_lr_shap=2; feasible_bayar_tepat_waktu=True; feasible_ubah_sex=False; feasible_ubah_riwayat_pay=False. Perhatikan tiga hal: pertama, reason codes LR dan SHAP GBM sepakat dua dari tiga (PAY_MAX, PAY_0) — PAY_DELAY_COUNT hanya di LR, PAY_AMT3 hanya di SHAP GBM — jadi label model di surat TIDAK BOLEH dihilangkan. Kedua, «bayar tepat waktu di bulan-bulan ke depan» feasible karena ia perilaku MASA DEPAN — sementara «ubah riwayat PAY» tidak, karena riwayat sudah terjadi. Ketiga, reason code yang baik tidak menyebut nama fitur mentahnya: nasabah tidak tahu apa itu PAY_MAX — ia tahu «keterlambatan pembayaran terburuk dalam 6 bulan terakhir».",
        "Setelah lab jalan, bandingkan dengan langkah 12: surat penolakan yang baik berisi KETIGA reason codes ini dalam bahasa awam + langkah yang bisa dilakukan + reviewer + jangka waktu banding — dan footer yang menyebut model asalnya (LR, ROC-AUC 0,7426). Bila satu pun dari ketiganya hilang, surat itu belum siap dikirim.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi reason_lr_1..3: terjemahan bahasa awam untuk top-3 LR (PAY_DELAY_COUNT, PAY_MAX, PAY_0)" },
        { id: "t2", text: "Lengkapi overlap_lr_shap: jumlah fitur yang ada di top-3 LR DAN top-3 SHAP GBM" },
        { id: "t3", text: "Lengkapi tiga flag feasibility: bayar tepat waktu (masa depan), ubah SEX, ubah riwayat PAY" },
      ],
      expected: "reason_lr_1=Jumlah bulan dengan keterlambatan pembayaran\\nreason_lr_2=Keterlambatan pembayaran terburuk dalam 6 bulan terakhir\\nreason_lr_3=Status pembayaran bulan terakhir\\noverlap_lr_shap=2\\nfeasible_bayar_tepat_waktu=True\\nfeasible_ubah_sex=False\\nfeasible_ubah_riwayat_pay=False",
      hints: [
        "Terjemahan kanonis (langkah 8): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir».",
        "Top-3 LR: PAY_DELAY_COUNT, PAY_MAX, PAY_0. Top-3 SHAP GBM lokal: PAY_MAX, PAY_0, PAY_AMT3. Yang sama: PAY_MAX dan PAY_0 — jadi overlap = 2.",
        "Feasibility (langkah 11): perilaku masa depan (bayar tepat waktu bulan depan) = True; atribut sensitif (SEX) = False; riwayat (PAY_0..6) = False — masa lalu tidak bisa diubah mundur.",
      ],
      code: {
        starter: `# Reason codes untuk nasabah 858 — dari fitur kanonis ke bahasa pelanggan
# LR top-3: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532
# SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553
# GBM terkalibrasi: 0,8492 (ditolak, threshold 0,10); LR: 0,7187
LR_TOP3 = ["PAY_DELAY_COUNT", "PAY_MAX", "PAY_0"]
SHAP_TOP3 = ["PAY_MAX", "PAY_0", "PAY_AMT3"]
PLAIN = {
    "PAY_DELAY_COUNT": "Jumlah bulan dengan keterlambatan pembayaran",
    "PAY_MAX": "Keterlambatan pembayaran terburuk dalam 6 bulan terakhir",
    "PAY_0": "Status pembayaran bulan terakhir",
    "PAY_AMT3": "Jumlah yang dibayar 3 bulan lalu",
}

reason_lr_1 = ""  # TODO: PLAIN[LR_TOP3[0]]
reason_lr_2 = ""  # TODO: PLAIN[LR_TOP3[1]]
reason_lr_3 = ""  # TODO: PLAIN[LR_TOP3[2]]
overlap_lr_shap = 0  # TODO: jumlah fitur yang ada di LR_TOP3 DAN SHAP_TOP3
feasible_bayar_tepat_waktu = None  # TODO: True — perilaku masa depan yang bisa dilakukan
feasible_ubah_sex = None  # TODO: False — atribut sensitif tidak diubah
feasible_ubah_riwayat_pay = None  # TODO: False — riwayat tidak bisa diubah mundur
print(f"reason_lr_1={reason_lr_1}")
print(f"reason_lr_2={reason_lr_2}")
print(f"reason_lr_3={reason_lr_3}")
print(f"overlap_lr_shap={overlap_lr_shap}")
print(f"feasible_bayar_tepat_waktu={feasible_bayar_tepat_waktu}")
print(f"feasible_ubah_sex={feasible_ubah_sex}")
print(f"feasible_ubah_riwayat_pay={feasible_ubah_riwayat_pay}")`,
        lockLines: 13,
        solution: `# Reason codes untuk nasabah 858 — dari fitur kanonis ke bahasa pelanggan
# LR top-3: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532
# SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553
# GBM terkalibrasi: 0,8492 (ditolak, threshold 0,10); LR: 0,7187
LR_TOP3 = ["PAY_DELAY_COUNT", "PAY_MAX", "PAY_0"]
SHAP_TOP3 = ["PAY_MAX", "PAY_0", "PAY_AMT3"]
PLAIN = {
    "PAY_DELAY_COUNT": "Jumlah bulan dengan keterlambatan pembayaran",
    "PAY_MAX": "Keterlambatan pembayaran terburuk dalam 6 bulan terakhir",
    "PAY_0": "Status pembayaran bulan terakhir",
    "PAY_AMT3": "Jumlah yang dibayar 3 bulan lalu",
}

reason_lr_1 = PLAIN[LR_TOP3[0]]
reason_lr_2 = PLAIN[LR_TOP3[1]]
reason_lr_3 = PLAIN[LR_TOP3[2]]
overlap_lr_shap = len(set(LR_TOP3) & set(SHAP_TOP3))
feasible_bayar_tepat_waktu = True
feasible_ubah_sex = False
feasible_ubah_riwayat_pay = False
print(f"reason_lr_1={reason_lr_1}")
print(f"reason_lr_2={reason_lr_2}")
print(f"reason_lr_3={reason_lr_3}")
print(f"overlap_lr_shap={overlap_lr_shap}")
print(f"feasible_bayar_tepat_waktu={feasible_bayar_tepat_waktu}")
print(f"feasible_ubah_sex={feasible_ubah_sex}")
print(f"feasible_ubah_riwayat_pay={feasible_ubah_riwayat_pay}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "reason_lr_1=Jumlah bulan dengan keterlambatan pembayaran", label: "Output menampilkan reason_lr_1 dalam bahasa awam", msg: "Reason code pertama LR: «Jumlah bulan dengan keterlambatan pembayaran» (PAY_DELAY_COUNT +2,5175)." },
          { kind: "stdout_matches", task: "t1", pattern: "reason_lr_2=Keterlambatan pembayaran terburuk dalam 6 bulan terakhir", label: "Output menampilkan reason_lr_2 dalam bahasa awam", msg: "Reason code kedua LR: «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir» (PAY_MAX +1,3426)." },
          { kind: "stdout_matches", task: "t1", pattern: "reason_lr_3=Status pembayaran bulan terakhir", label: "Output menampilkan reason_lr_3 dalam bahasa awam", msg: "Reason code ketiga LR: «Status pembayaran bulan terakhir» (PAY_0 +0,6532)." },
          { kind: "equal", task: "t2", name: "overlap_lr_shap", value: 2, tol: 0, label: "`overlap_lr_shap` seharusnya 2", msg: "Top-3 LR dan top-3 SHAP GBM sepakat dua dari tiga (PAY_MAX, PAY_0) — PAY_DELAY_COUNT hanya di LR, PAY_AMT3 hanya di SHAP GBM." },
          { kind: "stdout_matches", task: "t3", pattern: "feasible_bayar_tepat_waktu=True", label: "Output menampilkan feasible_bayar_tepat_waktu=True", msg: "Bayar tepat waktu di bulan-bulan ke depan adalah perilaku masa depan — feasible." },
          { kind: "stdout_matches", task: "t3", pattern: "feasible_ubah_sex=False", label: "Output menampilkan feasible_ubah_sex=False", msg: "Atribut sensitif (SEX) tidak pernah diubah dalam counterfactual — bukan tindakan." },
          { kind: "stdout_matches", task: "t3", pattern: "feasible_ubah_riwayat_pay=False", label: "Output menampilkan feasible_ubah_riwayat_pay=False", msg: "Riwayat PAY_0..6 sudah terjadi — tidak bisa diubah mundur; counterfactual atasnya adalah diagnosis, bukan rencana." },
        ],
      },
    },
'''

G9_QUIZ = '''        {
          q: "Seorang analis menulis saran untuk nasabah 858: «Turunkan PAY_MAX-mu menjadi 0». Apakah saran itu actionable atau manipulasi fitur?",
          options: [
            { text: "Manipulasi fitur — PAY_MAX adalah fitur turunan (maksimum enam kolom PAY) atas riwayat yang sudah terjadi; yang actionable adalah perilaku masa depan («bayar tepat waktu di bulan-bulan ke depan»)", why: "Benar: PAY_MAX bukan tombol yang bisa diputar — ia dihitung dari PAY_0..6, dan keenam bulan itu sudah terjadi. «Turunkan PAY_MAX» meminta nasabah mengubah angka di dalam model, bukan perilakunya. Versi yang jujur: «bayar tepat waktu ke depan, sehingga PAY_MAX di penilaian mendatang turun» — dan itu pun harus jujur bahwa model ini menilai enam bulan TERAKHIR, jadi perbaikan baru terlihat di penilaian mendatang. Counterfactual CF-A/CF-B membuktikan diagnosisnya: bahkan riwayat sempurna pun tetap ditolak (0,3325 / 0,1535).", correct: true },
            { text: "Actionable — PAY_MAX adalah fitur yang bisa diubah, dan menurunkannya adalah cara paling langsung membalikkan keputusan", why: "Salah: PAY_MAX adalah fitur TURUNAN dari riwayat — tidak ada tindakan nasabah yang «menurunkan PAY_MAX» secara langsung. Yang bisa diubah adalah perilaku masa depan; riwayatnya tidak." },
            { text: "Keduanya benar — tergantung modelnya: untuk LR ia actionable, untuk GBM ia manipulasi", why: "Salah: actionable vs manipulasi bukan sifat model — ia sifat SARANnya. Saran yang meminta nasabah mengubah angka turunan atas riwayat adalah manipulasi fitur di model mana pun." },
            { text: "Bukan keduanya — counterfactual bukan saran sama sekali, jadi pertanyaannya tidak berlaku", why: "Salah arah: benar bahwa counterfactual BUKAN saran otomatis — tapi saran «turunkan PAY_MAX» tetap bisa dinilai, dan vonisnya manipulasi fitur. Aturan feasibility ada justru untuk menyaring saran yang lahir dari counterfactual." },
          ],
        },
'''

G7_QUIZ = '''        {
          q: "Surat penolakan untuk nasabah 858 berisi waterfall SHAP lengkap (base −1,555, jumlah SHAP 3,3699, lima kontribusi terbesar). Apakah itu adverse-action notice yang baik?",
          options: [
            { text: "Tidak — notice yang baik berisi top-3 reason codes dalam bahasa awam + langkah yang bisa dilakukan + reviewer + jangka waktu banding; waterfall SHAP adalah penjelasan untuk analis, bukan surat untuk nasabah", why: "Benar: penjelasan dan surat penolakan adalah DUA dokumen yang berbeda. Waterfall SHAP menjawab «mengapa model memutuskan begitu» untuk analis/auditor; surat penolakan harus menjawab «kenapa saya ditolak, apa yang bisa saya lakukan, kepada siapa saya banding» dalam bahasa nasabah. Surat yang berisi base value dan jumlah SHAP adalah dokumen analis yang salah alamat — dan ia tidak berisi satu pun dari tiga hal yang dibutuhkan nasabah.", correct: true },
            { text: "Ya — semakin lengkap penjelasannya, semakin baik suratnya; nasabah berhak tahu semua angka", why: "Salah: lengkap tidak sama dengan bisa dipakai. Nasabah tidak bisa bertindak berdasarkan «base −1,555» — ia bisa bertindak berdasarkan «keterlambatan pembayaran terburuk dalam 6 bulan terakhir» + «bayar tepat waktu ke depan» + cara banding." },
            { text: "Ya — SHAP adalah penjelasan yang paling akurat, jadi surat berbasis SHAP adalah surat yang paling benar", why: "Salah: akurasi penjelasan tidak membuatnya menjadi surat yang baik. SHAP lokal 858 memang benar (aksioma efisiensi terverifikasi) — tapi kebenaran untuk analis bukan kebenaran untuk nasabah." },
            { text: "Tidak — karena SHAP salah untuk nasabah ini (LIME yang benar)", why: "Salah alasan: SHAP TIDAK salah untuk nasabah 858 — dekomposisinya menjumlah tepat (galat 0,0). Yang salah adalah LIME (top-1 BILL_AMT1). Masalah surat itu bukan kebenaran angkanya, melainkan BENTUKnya: waterfall bukan notice." },
          ],
        },
'''

def renumber_eyebrows(text):
    """Renumber all `eyebrow: "Langkah N ..."` sequentially in file order."""
    n = [0]

    def repl(m):
        n[0] += 1
        return f'eyebrow: "Langkah {n[0]}{m.group(1)}"'

    return re.sub(r'eyebrow: "Langkah \d+([^"]*)"', repl, text), n[0]


def main():
    ts = TS.read_text(encoding="utf-8")

    # 1) Insert G9+G7 before lab1 (steps 1-10 do NOT shift; only labs/checkpoint).
    anchor_lab1 = '    {\n      id: "lab1",'
    assert anchor_lab1 in ts, "anchor lab1 hilang"
    ts = ts.replace(anchor_lab1, G9_BLOCK + G7_BLOCK + anchor_lab1, 1)

    # 2) Insert Lab 3 before checkpoint.
    anchor_cp = '    {\n      id: "checkpoint",'
    assert anchor_cp in ts, "anchor checkpoint hilang"
    ts = ts.replace(anchor_cp, LAB3_BLOCK + anchor_cp, 1)

    # 3) Renumber eyebrows sequentially.
    ts, n_steps = renumber_eyebrows(ts)
    assert n_steps == 16, f"steps M7.3 harus 16, dapat {n_steps}"

    # 4) Peta lesson.
    old_peta = ("→ explainability untuk fairness: apa yang bisa dan tidak bisa "
                "dijawab penjelasan → 2 lab → checkpoint.")
    new_peta = ("→ explainability untuk fairness: apa yang bisa dan tidak bisa "
                "dijawab penjelasan → counterfactual: descriptive vs counterfactual "
                "vs causal — dengan contoh nasabah 858 yang dihitung ulang → alur "
                "komunikasi keputusan (adverse action): dari reason codes ke surat "
                "penolakan → 3 lab → checkpoint.")
    assert old_peta in ts
    ts = ts.replace(old_peta, new_peta, 1)

    # 5) estMinutes 70 -> 85.
    ts = ts.replace("estMinutes: 70,", "estMinutes: 85,", 1)

    # 6) Two checkpoint quizzes (before summary).
    anchor_q = "      ],\n      summary: ["
    assert anchor_q in ts
    ts = ts.replace(anchor_q, G9_QUIZ + G7_QUIZ + anchor_q, 1)

    # 7) Summary bullets: insert before Lab bullet.
    anchor_lab = '        "Lab: permutation + PDP + SHAP sepakat PAY_MAX nomor satu GBM'
    assert anchor_lab in ts
    new_bullets = (
        '        "Counterfactual [notebook]: seandainya riwayat 858 sempurna '
        '(PAY_0..6 = −1), GBM terkalibrasi 0,3325 — tetap ditolak; ditambah bayar '
        'penuh 0,1535 — tetap ditolak. Counterfactual adalah diagnosis model, bukan '
        'rencana aksi dan bukan klaim kausal; aturan feasibility: sensitif tidak '
        'diubah, historis tidak diubah mundur, hanya perilaku masa depan yang '
        'disarankan.",\n'
        '        "Adverse action: surat penolakan berisi top-3 reason codes bahasa awam '
        '(PAY_DELAY_COUNT, PAY_MAX, PAY_0 — dari LR, ROC-AUC 0,7426) + langkah yang '
        'bisa dilakukan + reviewer + jangka waktu banding; waterfall SHAP adalah '
        'penjelasan untuk analis, bukan surat untuk nasabah; overlap top-3 LR vs '
        'SHAP GBM = 2 dari 3.",\n'
    )
    ts = ts.replace(anchor_lab, new_bullets + anchor_lab, 1)

    # 8) Append two sentences to the checkpoint Rangkuman prose (first occurrence
    # of the exact tail = prose[0], before the summary array).
    anchor_rangk = "LIME gagal uji silang (lime_ok=False).\","
    assert anchor_rangk in ts
    ts = ts.replace(
        anchor_rangk,
        "LIME gagal uji silang (lime_ok=False). Counterfactual [notebook]: seandainya "
        "riwayat 858 sempurna pun (PAY_0..6 = −1), GBM terkalibrasi tetap 0,3325 — "
        "tetap ditolak; counterfactual adalah diagnosis model, bukan rencana aksi. "
        "Adverse action: surat penolakan berisi reason codes top-3 bahasa awam + "
        "langkah yang bisa dilakukan + reviewer + jangka waktu banding — bukan "
        "waterfall SHAP.\",", 1)

    TS.write_text(ts, encoding="utf-8")
    print(f"M7.3 TS: 13 -> {n_steps} steps, est 85, +2 quiz, +Lab 3, +2 summary")

    # ---- .md mirror ----
    md = MD.read_text(encoding="utf-8")
    anchor_md_lab = "## Lab 1:"
    assert anchor_md_lab in md
    g9_md = """## 11. Counterfactual: «Apa yang Harus Berubah» — Bukan «Apa Penyebabnya»

Tiga jenis penjelasan yang sering dicampuradukkan. DESCRIPTIVE: «fitur apa yang mendorong keputusan ini?» — SHAP menjawabnya (PAY_MAX +1,1368, PAY_0 +0,9280 untuk nasabah 858). COUNTERFACTUAL: «perubahan input minimal apa yang membalikkan keputusan?» — tetap pertanyaan tentang MODEL. CAUSAL: «PAY_MAX MENYEBABKAN default» — klaim tentang DUNIA, yang butuh intervensi atau eksperimen. SHAP yang besar tidak pernah membuktikan kausalitas.

**Counterfactual nasabah 858, dihitung ulang dari data [notebook]:** baseline GBM terkalibrasi 0,8492 — ditolak. CF-A, «seandainya enam bulan terakhir semuanya dibayar tepat waktu» (PAY_0..6 = −1, PAY_AMT tetap 0): LR 0,1382, GBM mentah 0,3707, GBM terkalibrasi 0,3325 — TETAP DITOLAK. CF-B, ditambah «dibayar penuh tiap bulan»: LR 0,1456, GBM mentah 0,1406, GBM terkalibrasi 0,1535 — TETAP DITOLAK. Bahkan riwayat yang SEMPURNA pun tidak membalikkan keputusan. Dan membayar penuh justru MENAIKKAN probabilitas LR (0,1382 → 0,1456) — arah counterfactual tidak bisa ditebak, ia harus dihitung ulang.

**Baik/buruk:** counterfactual bagus sebagai diagnosis model — «seberapa jauh keputusan ini dari ambang?» Buruk bila dijual sebagai RENCANA AKSI: nasabah 858 TIDAK BISA mengubah riwayat PAY_0..6-nya. «Turunkan PAY_MAX-mu menjadi 0» bukan saran — itu manipulasi fitur: PAY_MAX adalah fitur TURUNAN dari enam kolom PAY. Dan buruk bila dibaca sebagai klaim kausal.

**Mitigasi:** tiga aturan feasibility — (1) fitur sensitif TIDAK PERNAH diubah; (2) fitur historis tidak bisa diubah mundur — counterfactual atas masa lalu adalah diagnosis, bukan rencana; (3) hanya perilaku MASA DEPAN yang bisa disarankan. Setiap counterfactual wajib membawa tiga label: modelnya, perubahan eksaknya, dan statusnya («what-if model, bukan janji»).

---

"""
    g7_md = """## 12. Alur Komunikasi Keputusan: Dari Penjelasan ke Surat Penolakan

Penjelasan yang benar belum tentu surat penolakan yang baik. Nasabah 858 tidak butuh waterfall SHAP — ia butuh surat yang berkata, dalam bahasa yang ia mengerti, KENAPA ia ditolak, APA yang bisa ia lakukan, dan KEPADA SIAPA ia bisa banding. Alur adverse action punya ENAM gerbang: (1) keputusan: ditolak, skor 0,8492 ≥ threshold 0,10; (2) reason codes top-3 — DENGAN label model asalnya; (3) terjemahan ke bahasa awam; (4) langkah yang bisa dilakukan nasabah; (5) reviewer manusia; (6) suratnya sendiri: keputusan, alasan, tindakan, jangka waktu banding, cara banding.

**Template surat untuk nasabah 858 [notebook]:** tiga reason codes teratas (dari LR, ROC-AUC 0,7426): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir». Langkah yang bisa dilakukan: bayar tepat waktu di bulan-bulan ke depan; bayar penuh bila memungkinkan; ajukan peninjauan limit setelah riwayat membaik. Footer wajib: «reason codes ini dari model LR pendamping (ROC-AUC 0,7426), bukan dari GBM keputusan (0,7823)».

**Baik/buruk:** alur ini bagus karena ia memisahkan PENJELASAN (untuk analis/auditor) dan SURAT PENOLAKAN (untuk nasabah). Buruk bila dicampur: surat berisi waterfall SHAP lengkap bukan surat yang baik — ia dokumen analis yang salah alamat. Dan buruk bila reason codes LR dan SHAP GBM dicampur tanpa label: top-3 LR adalah PAY_DELAY_COUNT, PAY_MAX, PAY_0 — top-3 SHAP GBM lokal adalah PAY_MAX, PAY_0, PAY_AMT3; keduanya sepakat dua dari tiga.

**Mitigasi:** jadikan alur ini PROSEDUR OPERASIONAL — setiap surat lolos TIGA pemeriksaan: (1) tiap reason code menyebut MODEL asalnya? (2) tiap langkah yang disarankan BENAR-BENAR bisa dilakukan nasabah? (3) surat berisi reviewer, tanggal, dan cara banding? Simpan salinan surat bersama model version dan threshold policy-nya (M7.4, langkah 12).

---

"""
    md = md.replace(anchor_md_lab, g9_md + g7_md + anchor_md_lab, 1)
    # Lab 3 before Guided Task.
    anchor_guided = "## Guided Task di Colab"
    assert anchor_guided in md
    lab3_md = """## Lab 3: Dari Fitur Kanonis ke Bahasa Pelanggan — Reason Codes untuk Nasabah 858

Lab ketiga mengubah angka kanonis menjadi surat. LR top-3 untuk nasabah 858 [notebook]: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532. SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553. Terjemahkan top-3 LR ke bahasa awam, hitung tumpang tindihnya dengan top-3 SHAP GBM (overlap = 2), dan tandai tiap usulan tindakan sebagai feasible atau tidak: bayar tepat waktu di bulan-bulan ke depan = feasible; ubah SEX = tidak; ubah riwayat PAY = tidak.

---

"""
    md = md.replace(anchor_guided, lab3_md + anchor_guided, 1)
    # Renumber "## N." headings sequentially (labs unnumbered, untouched).
    nums = [0]

    def renum_md(m):
        nums[0] += 1
        return f"## {nums[0]}. {m.group(2)}"

    md = re.sub(r"^## (\d+)\. (.*)$", renum_md, md, flags=re.M)
    # Rangkuman bullets.
    anchor_rangk_md = "- Lab: permutation + PDP + SHAP sepakat PAY_MAX nomor satu GBM"
    assert anchor_rangk_md in md
    md = md.replace(
        anchor_rangk_md,
        "- Counterfactual [notebook]: seandainya riwayat 858 sempurna (PAY_0..6 = −1), GBM terkalibrasi 0,3325 — tetap ditolak; ditambah bayar penuh 0,1535 — tetap ditolak. Counterfactual adalah diagnosis model, bukan rencana aksi dan bukan klaim kausal.\n"
        "- Adverse action: surat penolakan berisi top-3 reason codes bahasa awam (dari LR) + langkah yang bisa dilakukan + reviewer + jangka waktu banding; waterfall SHAP adalah penjelasan untuk analis, bukan surat untuk nasabah.\n"
        + anchor_rangk_md, 1)
    MD.write_text(md, encoding="utf-8")
    print(f"M7.3 MD: sections renumbered to {nums[0]}")


if __name__ == "__main__":
    main()
