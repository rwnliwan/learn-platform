#!/usr/bin/env python3
"""Fill gap Luna M7 — M7.5: G4 (matured cohort) + G5 (attribution drift) + G1
(fairness monitoring) + Lab 3 (G1) + Lab 4 (G5 ringkas) + 1 quiz (G4).
Insert G5 after 'psi-skor' (step 6), G4 before 'decay' (step 7),
G1 after 'alerting' (step 12); labs 3-4 after lab2; checkpoint 17.
'langkah N' refs shift: orig 6->7, 7->9, 8->10, 9->11, 10->13, '9-10'->'11-13'.
Peta; estMinutes 70->90; +1 quiz; summary bullets. TS + .md mirror.
Numbers: chunk kanonis M7.5 [waktu semu]; AIR per-periode = [simulasi] (kanonik
tak punya AIR per chunk); attribution drift = [simulasi] atas SHAP kanonis M7.3.
"""
import re
from pathlib import Path

TS = Path("src/app/v2/content/mlf-m75-monitoring-drift.ts")
MD = Path("content/mlf-m75-monitoring-drift.md")

G5_BLOCK = '''    {
      id: "attribution-drift",
      eyebrow: "Langkah 6 · Attribution drift",
      title: "Attribution drift: ketika alasannya berubah — walau skornya tidak",
      prose: [
        "PSI skor memberitahumu populasi bergeser; PSI per fitur memberitahumu fitur mana yang bergeser. Tapi ada pergeseran ketiga yang tidak ditangkap keduanya: ALASAN model bergeser. Attribution drift adalah perubahan pada penjelasan model dari waktu ke waktu — fitur yang dulu menjadi pendorong utama kini bukan lagi, atau sebaliknya — sementara skor dan metrik performa bisa tampak stabil. Model yang sama, data yang mirip, keputusan yang mirip — tapi alasan yang berbeda. Bila alasan berubah, yang berubah adalah CARA model memutuskan — dan itu layak diselidiki, walau metriknya belum berteriak.",
        "Nilai: monitor DUA hal, keduanya [simulasi] atas SHAP kanonis M7.3 (GBM mentah, mean |SHAP| global atas test 6.000). Pertama, proporsi top reason codes per periode: di baseline, lima besar mean |SHAP| adalah PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892. Di periode [simulasi] yang baru, PAY_MAX turun ke 0,2500 (−0,2446) sementara UTILIZATION naik ke 0,3100 (+0,1526) — top-1 BERGANTI dari PAY_MAX ke UTILIZATION. Kedua, jarak distribusi (PSI) atas mean |SHAP| per fitur atau per keluarga: keluarga PAY (PAY_MAX, PAY_0, PAY_MEAN) vs keluarga LIMIT/BILL — bila PSI keluarga PAY melewati 0,10 sementara PSI skor diam, modelmu sedang memutuskan dengan alasan yang berbeda dari alasan yang kamu validasi. Dan monitor per grup: reason codes per grup (SEX/EDUCATION) — bila top-3 reason codes laki-laki dan perempuan berbeda secara sistematis, itu sinyal untuk audit fairness M7.2, bukan sekadar «modelnya berubah».",
        "Baik atau buruk: monitoring atribusi bagus karena ia menangkap perubahan yang tidak terlihat di metrik performa — model bisa tetap akurat sambil mengubah alasannya (misalnya limit naik di populasi, S1 di langkah 10, membuat UTILIZATION lebih menentukan). Buruk bila dibaca sebagai BUKTI KAUSAL: «UTILIZATION kini menyebabkan default» adalah klaim tentang dunia — yang ditunjukkan hanyalah «model ini kini lebih mengandalkan UTILIZATION». Attribution drift adalah DIAGNOSIS — ia berkata «selidiki», bukan «ini penyebabnya». Dan buruk bila dipakai tanpa pembanding: mean |SHAP| berayun antar-periode kecil (n = 1.200) seperti metrik lainnya — satu periode yang berbeda bukan vonis; dua periode berturut-turut dengan arah yang sama barulah sinyal (aturan yang sama seperti langkah 11).",
        "Mitigasi: tambahkan TIGA baris ke dashboard monitoring-mu — (1) top-3 reason codes per periode (global dan per grup); (2) PSI mean |SHAP| per keluarga fitur (PAY, BILL, LIMIT, PAY_AMT); (3) selisih mean |SHAP| top-1 antar-periode. Aturan alert-nya sama seperti alerting (langkah 11): satu periode = WASPADA, dua periode berturut-turut = selidiki; dan bila top-1 berganti, tuliskan alasannya di log keputusan — bukan karena aturannya memintanya, melainkan karena audit setahun kemudian akan menanyakan «kapan alasan model ini berubah, dan apakah ada yang memperhatikan?».",
      ],
      tasks: [],
    },
'''

G4_BLOCK = '''    {
      id: "matured-cohort",
      eyebrow: "Langkah 7 · Matured cohort",
      title: "Matured cohort: label yang belum matang tidak boleh dipakai untuk menilai",
      prose: [
        "Semua metrik performa — ROC-AUC, PR-AUC, bad rate, dan semua metrik fairness — butuh LABEL. Dan label butuh WAKTU. Di dataset ini, labelnya adalah «default bulan depan» — jendela observasi 1 bulan. Nasabah yang aplikasinya 2 minggu lalu BELUM PUNYA label: bulan observasinya belum lewat. Periode terbaru selalu terdiri dari label yang belum matang — dan metrik yang dihitung di atasnya adalah metrik atas data yang belum lengkap. Inilah jebakan yang tidak ditangkap PSI: PSI, approval rate, dan distribusi skor bisa dihitung TANPA label — tapi ROC-AUC, bad rate, dan AIR tidak bisa.",
        "Nilai: garis waktunya empat titik — aplikasi (bulan 0) → skor/keputusan (saat itu juga) → jendela observasi (1 bulan) → label tersedia (matang). Cohort MATANG adalah aplikasi yang jendela observasinya sudah lewat: hanya cohort inilah yang boleh dipakai untuk ROC-AUC, PR-AUC, bad rate, dan metrik fairness. Cohort BELUM MATANG (jendela belum lewat) hanya boleh dimonitor TANPA label: PSI, approval rate, distribusi skor, dan proporsi label matang itu sendiri. Metrik yang harus kamu laporkan per periode: «proporsi label matang» — berapa persen aplikasi periode itu yang jendelanya sudah lewat. Bila proporsinya 0% (periode berjalan), tidak ada metrik berlabel yang boleh dilaporkan — tulis «belum matang», bukan 0. Bila proporsinya 60%, metriknya adalah metrik atas 60% itu — dan 60% itu BUKAN sampel acak: nasabah yang default cenderung ketahuan lebih dulu daripada yang tidak, jadi bad rate atas cohort yang belum matang cenderung BUKAN estimasi yang jujur.",
        "Baik atau buruk: pemisahan ini bagus karena ia membuat satu pertanyaan yang tajam — «periode ini boleh dipakai untuk metrik apa?» — dan jawabannya selalu bisa ditulis dalam satu baris. Buruk bila dibaca sebagai «jadi periode terbaru tidak berguna»: periode terbaru justru yang paling penting untuk monitoring TANPA label — PSI dan approval rate-nya adalah alarm pertamamu. Dan buruk bila «proporsi label matang» tidak pernah dilaporkan: dashboard yang menampilkan bad rate 4,1% untuk periode 2 minggu lalu TANPA menyebut bahwa hanya 30% labelnya yang matang adalah dashboard yang berbohong dengan angka yang benar.",
        "Mitigasi: di dashboard-mu, pisahkan DUA kolom untuk setiap periode — «monitoring tanpa label» (PSI, approval, distribusi skor — selalu tersedia) dan «monitoring dengan label» (ROC-AUC, bad rate, fairness — hanya untuk cohort matang). Dan tulis aturan ini di samping tabel alert-mu: periode yang belum matang TIDAK PERNAH menaikkan level alert berbasis label — ia hanya boleh menyalakan alert berbasis PSI/approval. Bila seseorang membawakanmu «bad rate periode terbaru 4,1%, turun dari 6,67% — model membaik!», tanyakan dulu: «berapa persen labelnya yang sudah matang?» — bila jawabannya bukan 100%, kabar baik itu belum terbukti.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 210" role="img" aria-label="Garis waktu label: aplikasi bulan nol, skor dan keputusan saat itu juga, jendela observasi satu bulan, lalu label tersedia dan cohort matang">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Label butuh waktu: jendela observasi 1 bulan</text>
<line x1="30" y1="90" x2="450" y2="90" stroke="var(--chart-text)" stroke-width="2"/>
<circle cx="60" cy="90" r="7" fill="var(--c1)"/>
<circle cx="170" cy="90" r="7" fill="var(--c4)"/>
<circle cx="290" cy="90" r="7" fill="var(--c2)"/>
<circle cx="420" cy="90" r="7" fill="var(--c3)"/>
<text x="60" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Aplikasi</text>
<text x="60" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">bulan 0</text>
<text x="170" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skor / keputusan</text>
<text x="170" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">saat itu juga</text>
<text x="290" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Jendela observasi</text>
<text x="290" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1 bulan</text>
<text x="420" y="70" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Label tersedia</text>
<text x="420" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">(matang)</text>
<line x1="420" y1="100" x2="420" y2="130" stroke="var(--c3)" stroke-width="2" stroke-dasharray="4 3"/>
<text x="240" y="122" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Cohort BELUM matang: monitoring TANPA label saja (PSI, approval, distribusi skor)</text>
<text x="240" y="140" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Cohort MATANG: ROC-AUC, PR-AUC, bad rate, dan metrik fairness BOLEH dihitung</text>
<text x="240" y="172" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Periode terbaru (jendela belum lewat) tidak pernah menaikkan alert berbasis label.</text>
<text x="240" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Laporkan «proporsi label matang» per periode — bila 0%, tulis «belum matang», bukan 0.</text>
</svg>`,
        alt: "Garis waktu label: aplikasi bulan nol, skor dan keputusan saat itu juga, jendela observasi satu bulan, lalu label tersedia dan cohort matang. Cohort belum matang hanya dimonitor tanpa label.",
        caption: "Cara membaca: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat. Cohort yang jendelanya belum lewat hanya boleh dimonitor tanpa label (PSI, approval rate, distribusi skor); ROC-AUC, bad rate, dan metrik fairness hanya dihitung pada cohort matang — dan «proporsi label matang» dilaporkan per periode.",
      },
      tasks: [],
    },
'''

G1_BLOCK = '''    {
      id: "fairness-monitoring",
      eyebrow: "Langkah 12 · Fairness monitoring",
      title: "Fairness monitoring: overall yang stabil bisa menyembunyikan ketidakadilan yang bergerak",
      prose: [
        "Monitoring yang kamu bangun sejauh ini memonitor POPULASI — PSI, ROC-AUC, approval rate, bad rate — semuanya angka OVERALL. Fairness monitoring memonitor hal yang berbeda: apakah model ini tetap adil UNTUK SETIAP GRUP, di setiap periode. Keduanya bisa bergerak berlawanan arah: overall stabil sementara fairness memburuk — dan dashboard yang hanya menampilkan overall tidak akan pernah memberitahumu. Inilah kelas kesalahan yang sama dengan aggregation bias M7.2 (satu angka global, lima cerita berbeda) — hanya saja kini ia terjadi dari WAKTU KE WAKTU, bukan dari grup ke grup.",
        "Nilai: dashboard fairness per periode/grup punya LIMA baris per grup (SEX, EDUCATION, AGE, MARRIAGE): approval rate, AIR (terhadap grup acuan), gap TPR, gap FPR/FNR, dan ECE/Brier per grup — masing-masing dengan n dan label matang-nya (langkah 7). Aturan alert-nya meminjam tabel alerting (langkah 11) dengan SATU tambahan: alert fairness menyala bila AIR grup mana pun jatuh di bawah 0,80 selama 2 periode berturut-turut, ATAU gap TPR/FPR melewati 0,05 dan bertahan 2 periode — dan alert itu TIDAK PERNAH digabung dengan alert overall: «overall AMAN, fairness WASPADA» adalah dua baris yang berbeda, bukan satu baris yang dirata-rata. Gambar dua panelnya menunjukkan kenapa: approval overall per chunk [waktu semu] berayun 25,17%–33,67% tanpa tren (ROC-AUC 0,7428–0,8138, juga tanpa tren) — sementara AIR SEX [simulasi] bergerak 0,869 → 0,710 → 0,830 → 0,910 → 0,940, dan chunk 2 (0,710) jatuh DI BAWAH 0,80. Overall diam. Fairness bergerak. Dashboard yang hanya punya panel kiri tidak akan pernah melihat panel kanan.",
        "Baik atau buruk: dashboard ini bagus karena ia membuat ketidakadilan yang bergerak menjadi TERLIHAT — dan karena ia memisahkan alert fairness dari alert overall, sehingga yang satu tidak menutupi yang lain. Buruk bila dibaca sebagai «jadi monitoring overall tidak penting»: overall tetap alarm pertamamu untuk data drift dan decay — fairness monitoring adalah LAPISAN TAMBAHAN, bukan pengganti. Dan buruk bila AIR per-periode dihitung tanpa n dan tanpa label matang: AIR chunk dengan n kecil atau label belum matang (langkah 7) adalah angka yang goyah — tulis n-nya dan proporsi label matangnya di samping AIR-nya, atau jangan laporkan AIR itu sama sekali.",
        "Mitigasi: tambahkan fairness monitoring ke dashboard-mu SEBELUM model live — bukan sesudah ada yang bertanya «apakah model ini masih adil?». Lima baris per grup, per periode; alert fairness terpisah dari alert overall; dan satu aturan keras: keputusan retrain atau rollback (langkah 13) yang dipicu alert fairness DITINJAU oleh manusia — bukan dieksekusi otomatis — karena alert fairness adalah awal penyelidikan (apakah ini drift nyata, noise periode-kecil, atau perubahan komposisi grup?), bukan vonis.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Dua panel: approval overall per chunk berayun tanpa tren, sementara AIR SEX simulasi bergerak dan jatuh di bawah 0,80 pada chunk 2">
<text x="120.0" y="16" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Overall: approval berayun, tanpa tren</text>
<text x="360.0" y="16" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fairness [simulasi]: AIR SEX bergerak</text>
<rect x="40" y="163" width="28" height="37" fill="var(--c1)" opacity="0.7"/>
<rect x="80" y="162" width="28" height="38" fill="var(--c1)" opacity="0.7"/>
<rect x="120" y="172" width="28" height="28" fill="var(--c1)" opacity="0.7"/>
<rect x="160" y="127" width="28" height="73" fill="var(--c1)" opacity="0.7"/>
<rect x="200" y="149" width="28" height="51" fill="var(--c1)" opacity="0.7"/>
<line x1="30" y1="200" x2="236" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="54" y="152" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">26,9</text>
<text x="94" y="151" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">27,2</text>
<text x="134" y="161" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">25,2</text>
<text x="174" y="116" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">33,7</text>
<text x="214" y="138" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">29,6</text>
<text x="54" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C1</text>
<text x="94" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C2</text>
<text x="134" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C3</text>
<text x="174" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C4</text>
<text x="214" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C5</text>
<line x1="260" y1="120" x2="460" y2="120" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="452" y="114" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,80</text>
<polyline points="280,92 320,156 360,108 400,76 440,64" fill="none" stroke="var(--c4)" stroke-width="2"/>
<circle cx="280" cy="92" r="4" fill="var(--c4)"/>
<circle cx="320" cy="156" r="4" fill="var(--c4)"/>
<circle cx="360" cy="108" r="4" fill="var(--c4)"/>
<circle cx="400" cy="76" r="4" fill="var(--c4)"/>
<circle cx="440" cy="64" r="4" fill="var(--c4)"/>
<text x="280" y="80" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,869</text>
<text x="320" y="172" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,710</text>
<text x="360" y="96" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,830</text>
<text x="400" y="64" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,910</text>
<text x="440" y="52" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,940</text>
<text x="280" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C1</text>
<text x="320" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C2</text>
<text x="360" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C3</text>
<text x="400" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C4</text>
<text x="440" y="214" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">C5</text>
<text x="240" y="244" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Overall diam. Fairness bergerak. Panel kiri saja tidak akan pernah melihat panel kanan.</text>
</svg>`,
        alt: "Dua panel: approval overall per chunk berayun tanpa tren, sementara AIR SEX simulasi bergerak dan jatuh di bawah 0,80 pada chunk 2.",
        caption: "Cara membaca: panel kiri = approval overall per chunk [waktu semu] (25,17%–33,67%, tanpa tren; ROC-AUC 0,7428–0,8138 juga tanpa tren). Panel kanan = AIR SEX per chunk [simulasi] (0,869 → 0,710 → 0,830 → 0,910 → 0,940) dengan garis ambang 0,80 — chunk 2 jatuh di bawah ambang. Kanonik tidak punya AIR per chunk; angka panel kanan adalah [simulasi] untuk mengilustrasikan pola «overall stabil, fairness bergerak».",
      },
      tasks: [],
    },
'''

LAB3_BLOCK = '''    {
      id: "lab3",
      eyebrow: "Langkah 14 · Lab 3",
      title: "Lab: monitoring overall vs per-grup — mana yang berteriak duluan?",
      prose: [
        "Lab ketiga membandingkan dua dashboard pada chunk yang sama [waktu semu]. Approval overall per chunk: C1 26,92%, C2 27,17%, C3 25,17%, C4 33,67%, C5 29,58% — berayun 8,50 poin persen tanpa tren; ROC-AUC 0,7428–0,8138, juga tanpa tren. AIR SEX per chunk [simulasi]: C1 0,869, C2 0,710, C3 0,830, C4 0,910, C5 0,940 — berayun 0,230 dan chunk 2 jatuh di bawah 0,80. Kanonik tidak punya AIR per chunk — angka AIR per-periode di sini adalah [simulasi] untuk mengilustrasikan pola «overall stabil, fairness bergerak», bukan angka yang dihitung dari data.",
        "Hasil yang diharapkan [lab]: overall_swing_pp=8.50; air_swing=0.2300; fairness_flag=True. Bacalah ketiganya berdampingan: ayunan overall 8,50 poin persen adalah NOISE periode-kecil (n = 1.200, tanpa tren, chunk 3 membaik setelah chunk 2) — sementara AIR 0,710 di chunk 2 adalah FLAG yang harus diselidiki, walau overall-nya diam. Dashboard yang hanya menampilkan panel kiri akan melaporkan «semua stabil» pada chunk 2 — dan melewatkan satu-satunya sinyal yang penting.",
        "Setelah lab jalan, bandingkan dengan langkah 12: alert fairness TIDAK PERNAH digabung dengan alert overall — «overall AMAN, fairness WASPADA» adalah dua baris yang berbeda. Dan ingat langkah 7: AIR per-periode hanya dilaporkan dengan n dan proporsi label matangnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi overall_swing_pp: ayunan approval overall (maks − min, poin persen)" },
        { id: "t2", text: "Lengkapi air_swing: ayunan AIR SEX [simulasi] (maks − min)" },
        { id: "t3", text: "Lengkapi fairness_flag: True bila AIR minimum di bawah 0,80" },
      ],
      expected: "overall_swing_pp=8.50\\nair_swing=0.2300\\nfairness_flag=True",
      hints: [
        "Approval overall: 26,92; 27,17; 25,17; 33,67; 29,58 — maks 33,67, min 25,17, ayunan 8,50 poin persen.",
        "AIR SEX [simulasi]: 0,869; 0,710; 0,830; 0,910; 0,940 — maks 0,940, min 0,710, ayunan 0,230.",
        "AIR minimum 0,710 di bawah ambang 0,80 — jadi fairness_flag = True (flag yang harus diselidiki, bukan vonis).",
      ],
      code: {
        starter: `# Lab 3 — monitoring overall vs per-grup [simulasi untuk AIR per-periode]
# Approval overall per chunk [waktu semu, kanonis M7.5]: C1..C5
# AIR SEX per chunk = [simulasi] — kanonik tak punya AIR per chunk
OVERALL_APPROVAL = [26.92, 27.17, 25.17, 33.67, 29.58]  # persen, chunk 1..5
AIR_SEX_SIM = [0.869, 0.710, 0.830, 0.910, 0.940]  # [simulasi], chunk 1..5

overall_swing_pp = 0.0  # TODO: max - min OVERALL_APPROVAL (poin persen)
air_swing = 0.0  # TODO: max - min AIR_SEX_SIM
fairness_flag = None  # TODO: True bila AIR minimum di bawah 0,80
print(f"overall_swing_pp={overall_swing_pp:.2f}")
print(f"air_swing={air_swing:.4f}")
print(f"fairness_flag={fairness_flag}")`,
        lockLines: 6,
        solution: `# Lab 3 — monitoring overall vs per-grup [simulasi untuk AIR per-periode]
# Approval overall per chunk [waktu semu, kanonis M7.5]: C1..C5
# AIR SEX per chunk = [simulasi] — kanonik tak punya AIR per chunk
OVERALL_APPROVAL = [26.92, 27.17, 25.17, 33.67, 29.58]  # persen, chunk 1..5
AIR_SEX_SIM = [0.869, 0.710, 0.830, 0.910, 0.940]  # [simulasi], chunk 1..5

overall_swing_pp = max(OVERALL_APPROVAL) - min(OVERALL_APPROVAL)
air_swing = max(AIR_SEX_SIM) - min(AIR_SEX_SIM)
fairness_flag = min(AIR_SEX_SIM) < 0.80
print(f"overall_swing_pp={overall_swing_pp:.2f}")
print(f"air_swing={air_swing:.4f}")
print(f"fairness_flag={fairness_flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "overall_swing_pp", value: 8.5, tol: 0.01, label: "`overall_swing_pp` seharusnya 8.50", msg: "Ayunan approval overall: 33,67 − 25,17 = 8,50 poin persen — noise periode-kecil tanpa tren." },
          { kind: "equal", task: "t2", name: "air_swing", value: 0.23, tol: 0.0005, label: "`air_swing` seharusnya 0.2300", msg: "Ayunan AIR SEX [simulasi]: 0,940 − 0,710 = 0,230 — fairness bergerak sementara overall diam." },
          { kind: "stdout_matches", task: "t3", pattern: "fairness_flag=True", label: "Output menampilkan fairness_flag=True", msg: "AIR minimum 0,710 di bawah ambang 0,80 — flag yang harus diselidiki, bukan vonis." },
        ],
      },
    },
'''

LAB4_BLOCK = '''    {
      id: "lab4",
      eyebrow: "Langkah 15 · Lab 4",
      title: "Lab (ringkas): attribution drift — top-1 berganti, apa artinya?",
      prose: [
        "Lab keempat mengukur attribution drift [simulasi] atas SHAP kanonis M7.3. Baseline mean |SHAP| global (GBM mentah, test 6.000): PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892. Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100 — top-1 BERGANTI dari PAY_MAX ke UTILIZATION. Angka periode baru adalah [simulasi] untuk mengilustrasikan pola «alasan berubah», bukan angka yang dihitung dari data.",
        "Hasil yang diharapkan [lab]: shift_pay_max=-0.2446; shift_utilization=0.1526; top1_baru=UTILIZATION; drift_flag=True. Bacalah dengan saksama: top-1 yang berganti adalah DIAGNOSIS — ia berkata «selidiki» (apakah limit naik di populasi? apakah komposisi grup berubah?), bukan «UTILIZATION kini menyebabkan default». Attribution drift bukan bukti kausal.",
        "Setelah lab jalan, bandingkan dengan langkah 6: tambahkan top-3 reason codes per periode dan PSI mean |SHAP| per keluarga ke dashboard-mu — dan bila top-1 berganti, tuliskan alasannya di log keputusan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi shift_pay_max dan shift_utilization: nilai baru dikurangi baseline" },
        { id: "t2", text: "Lengkapi top1_baru: fitur dengan mean |SHAP| terbesar di periode baru" },
        { id: "t3", text: "Lengkapi drift_flag: True bila top-1 berubah dari baseline" },
      ],
      expected: "shift_pay_max=-0.2446\\nshift_utilization=0.1526\\ntop1_baru=UTILIZATION\\ndrift_flag=True",
      hints: [
        "PAY_MAX: 0,2500 − 0,4946 = −0,2446. UTILIZATION: 0,3100 − 0,1574 = +0,1526.",
        "Periode baru [simulasi]: PAY_MAX 0,2500 vs UTILIZATION 0,3100 — yang terbesar adalah UTILIZATION.",
        "Baseline top-1 adalah PAY_MAX (0,4946); periode baru top-1 adalah UTILIZATION — berubah, jadi drift_flag = True.",
      ],
      code: {
        starter: `# Lab 4 — attribution drift [simulasi] atas SHAP kanonis M7.3
# Baseline mean |SHAP| global (GBM mentah, test 6.000): PAY_MAX 0,4946; UTILIZATION 0,1574
# Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100
BASE_SHAP = {"PAY_MAX": 0.4946, "UTILIZATION": 0.1574}
NEW_SHAP = {"PAY_MAX": 0.2500, "UTILIZATION": 0.3100}  # [simulasi]

shift_pay_max = 0.0  # TODO: NEW_SHAP["PAY_MAX"] - BASE_SHAP["PAY_MAX"]
shift_utilization = 0.0  # TODO: NEW_SHAP["UTILIZATION"] - BASE_SHAP["UTILIZATION"]
top1_baru = ""  # TODO: fitur dengan mean |SHAP| terbesar di NEW_SHAP
drift_flag = None  # TODO: True bila top-1 berubah dari baseline
print(f"shift_pay_max={shift_pay_max:.4f}")
print(f"shift_utilization={shift_utilization:.4f}")
print(f"top1_baru={top1_baru}")
print(f"drift_flag={drift_flag}")`,
        lockLines: 6,
        solution: `# Lab 4 — attribution drift [simulasi] atas SHAP kanonis M7.3
# Baseline mean |SHAP| global (GBM mentah, test 6.000): PAY_MAX 0,4946; UTILIZATION 0,1574
# Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100
BASE_SHAP = {"PAY_MAX": 0.4946, "UTILIZATION": 0.1574}
NEW_SHAP = {"PAY_MAX": 0.2500, "UTILIZATION": 0.3100}  # [simulasi]

shift_pay_max = NEW_SHAP["PAY_MAX"] - BASE_SHAP["PAY_MAX"]
shift_utilization = NEW_SHAP["UTILIZATION"] - BASE_SHAP["UTILIZATION"]
top1_baru = max(NEW_SHAP, key=NEW_SHAP.get)
drift_flag = top1_baru != max(BASE_SHAP, key=BASE_SHAP.get)
print(f"shift_pay_max={shift_pay_max:.4f}")
print(f"shift_utilization={shift_utilization:.4f}")
print(f"top1_baru={top1_baru}")
print(f"drift_flag={drift_flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "shift_pay_max", value: -0.2446, tol: 0.0005, label: "`shift_pay_max` seharusnya -0.2446", msg: "Mean |SHAP| PAY_MAX turun 0,4946 → 0,2500 (selisih −0,2446) [simulasi]." },
          { kind: "equal", task: "t1", name: "shift_utilization", value: 0.1526, tol: 0.0005, label: "`shift_utilization` seharusnya 0.1526", msg: "Mean |SHAP| UTILIZATION naik 0,1574 → 0,3100 (selisih +0,1526) [simulasi]." },
          { kind: "stdout_matches", task: "t2", pattern: "top1_baru=UTILIZATION", label: "Output menampilkan top1_baru=UTILIZATION", msg: "Top-1 berganti dari PAY_MAX ke UTILIZATION [simulasi] — alasan model berubah." },
          { kind: "stdout_matches", task: "t3", pattern: "drift_flag=True", label: "Output menampilkan drift_flag=True", msg: "Top-1 yang berganti adalah diagnosis — selidiki, bukan bukti kausal." },
        ],
      },
    },
'''

G4_QUIZ = '''        {
          q: "Periode terbaru (aplikasi 2 minggu lalu, jendela label 1 bulan) menunjukkan bad rate 4,1% — turun dari 6,67% baseline. Bolehkah periode ini dipakai untuk menyimpulkan «model membaik»?",
          options: [
            { text: "Tidak — label belum matang (jendela 1 bulan belum lewat); bad rate atas cohort belum matang bukan estimasi yang jujur; yang boleh dimonitor untuk periode ini hanya PSI, approval, dan distribusi skor", why: "Benar: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat. Periode 2 minggu lalu proporsi label matangnya 0% — bad rate 4,1% itu dihitung atas label yang belum lengkap, dan nasabah yang default cenderung ketahuan lebih dulu, jadi angka itu bukan estimasi yang jujur. Yang boleh dilaporkan untuk periode ini: «belum matang» + monitoring tanpa label (PSI, approval).", correct: true },
            { text: "Boleh — bad rate turun dari 6,67% ke 4,1% adalah kabar baik, laporkan saja apa adanya", why: "Salah: «apa adanya» tanpa label matang adalah angka yang menyesatkan — 4,1% itu bukan bad rate periode itu, melainkan bad rate atas sebagian label yang kebetulan sudah terlihat. Melaporkannya sebagai «model membaik» adalah vonis atas data yang belum lengkap." },
            { text: "Boleh, asal bad rate-nya dikalikan proporsi label matang — 4,1% × 0,5 = 2,05% bila setengah label sudah matang", why: "Salah: mengalikan dengan proporsi tidak memperbaiki bias seleksi — label yang matang lebih dulu bukan sampel acak dari periode itu. Tidak ada faktor koreksi sederhana untuk cohort yang belum matang; yang benar adalah menunggu cohort matang." },
            { text: "Tidak boleh — karena n periode terbaru terlalu kecil untuk vonis apa pun", why: "Salah alasan: masalahnya bukan n — masalahnya label yang BELUM MATANG. Periode dengan n = 1.200 yang labelnya sudah matang boleh dipakai; periode dengan n berapa pun yang labelnya belum matang tidak boleh dipakai untuk metrik berlabel." },
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

    # 1) 'langkah N' refs: G5 (+1 for orig >= 6) + G4 (+1 for orig >= 7)
    #    + G1 (+1 for orig 10 only, inserted after alerting).
    #    Net: orig 6->7, 7->9, 8->10, 9->11, 10->13; range '9-10'->'11-13'.
    #    Order: range first, then descending singles.
    ts = ts.replace("langkah 9–10", "langkah 11–13")
    ts = re.sub(r"langkah 10\b", "langkah 13", ts)
    ts = re.sub(r"langkah 9\b", "langkah 11", ts)
    ts = re.sub(r"langkah 8\b", "langkah 10", ts)
    ts = re.sub(r"langkah 7\b", "langkah 9", ts)
    ts = re.sub(r"langkah 6\b", "langkah 7", ts)

    # 2) Insert G5 before waktu-semu, G4 before decay, G1 before retraining.
    anchor_waktu = '    {\n      id: "waktu-semu",'
    assert anchor_waktu in ts, "anchor waktu-semu hilang"
    ts = ts.replace(anchor_waktu, G5_BLOCK + anchor_waktu, 1)
    anchor_decay = '    {\n      id: "decay",'
    assert anchor_decay in ts, "anchor decay hilang"
    ts = ts.replace(anchor_decay, G4_BLOCK + anchor_decay, 1)
    anchor_retrain = '    {\n      id: "retraining",'
    assert anchor_retrain in ts, "anchor retraining hilang"
    ts = ts.replace(anchor_retrain, G1_BLOCK + anchor_retrain, 1)

    # 3) Insert Lab 3 + Lab 4 before checkpoint.
    anchor_cp = '    {\n      id: "checkpoint",'
    assert anchor_cp in ts, "anchor checkpoint hilang"
    ts = ts.replace(anchor_cp, LAB3_BLOCK + LAB4_BLOCK + anchor_cp, 1)

    # 4) Renumber eyebrows sequentially.
    ts, n_steps = renumber_eyebrows(ts)
    assert n_steps == 18, f"steps M7.5 harus 18, dapat {n_steps}"

    # 5) Peta lesson.
    old_peta = ("→ PSI skor prediksi → stabilitas populasi dari waktu ke waktu "
                "[waktu semu] → decay performa dan bedanya dengan noise → dua "
                "simulasi geser [simulasi] → alerting: siapa bertindak → pemicu "
                "retraining dan kapan JANGAN retrain → 2 lab → checkpoint.")
    new_peta = ("→ PSI skor prediksi → attribution drift: ketika alasannya berubah "
                "→ stabilitas populasi dari waktu ke waktu [waktu semu] → matured "
                "cohort: label yang belum matang → decay performa dan bedanya "
                "dengan noise → dua simulasi geser [simulasi] → alerting: siapa "
                "bertindak → fairness monitoring: overall stabil vs ketidakadilan "
                "yang bergerak → pemicu retraining dan kapan JANGAN retrain → 4 lab "
                "→ checkpoint.")
    assert old_peta in ts
    ts = ts.replace(old_peta, new_peta, 1)

    # 6) estMinutes 70 -> 90.
    ts = ts.replace("estMinutes: 70,", "estMinutes: 90,", 1)

    # 7) G4 quiz before summary.
    anchor_q = "      ],\n      summary: ["
    assert anchor_q in ts
    ts = ts.replace(anchor_q, G4_QUIZ + anchor_q, 1)

    # 8) Summary bullets: insert 3 before Lab bullet.
    anchor_lab = '        "Lab: PSI parsial 3 bin UTILIZATION = 0,0006'
    assert anchor_lab in ts
    new_bullets = (
        '        "Attribution drift [simulasi]: mean |SHAP| PAY_MAX 0,4946 → 0,2500 '
        '(−0,2446), UTILIZATION 0,1574 → 0,3100 (+0,1526) — top-1 berganti; monitor '
        'top-3 reason codes per periode + PSI mean |SHAP| per keluarga; drift atribusi '
        'adalah diagnosis, bukan bukti kausal.",\n'
        '        "Matured cohort: label «default bulan depan» baru tersedia setelah '
        'jendela observasi 1 bulan; ROC-AUC, bad rate, dan fairness hanya dihitung '
        'pada cohort matang; periode terbaru hanya dimonitor tanpa label (PSI, '
        'approval); laporkan «proporsi label matang» per periode.",\n'
        '        "Fairness monitoring: dashboard per periode/grup (approval, AIR, gap '
        'TPR/FPR/FNR, ECE/Brier per grup + n + label matang) dengan alert fairness '
        'terpisah dari alert overall; approval overall 25,17%–33,67% tanpa tren '
        'sementara AIR SEX [simulasi] 0,710 di chunk 2 — overall diam, fairness '
        'bergerak.",\n'
    )
    ts = ts.replace(anchor_lab, new_bullets + anchor_lab, 1)

    # 9) Append to the checkpoint Rangkuman prose (its tail sentence).
    anchor_rangk = "S2 kritis (2) retrain 1.\","
    assert anchor_rangk in ts
    ts = ts.replace(
        anchor_rangk,
        "S2 kritis (2) retrain 1. Attribution drift [simulasi]: top-1 mean |SHAP| "
        "berganti dari PAY_MAX ke UTILIZATION — diagnosis, bukan bukti kausal. "
        "Matured cohort: metrik berlabel hanya untuk cohort yang jendelanya sudah "
        "lewat. Fairness monitoring: AIR SEX [simulasi] 0,710 di chunk 2 — overall "
        "diam, fairness bergerak.\",", 1)

    TS.write_text(ts, encoding="utf-8")
    print(f"M7.5 TS: 13 -> {n_steps} steps, est 90, +1 quiz, +Lab 3/4, +3 summary")

    # ---- .md mirror ----
    md = MD.read_text(encoding="utf-8")
    # Insert G5 section after "## 5. PSI Skor" and G4 after "## 6. Waktu Semu"
    # (numbering fixed by the renumber pass at the end).
    anchor_md5 = "## 5. PSI Skor: Satu Angka yang Merangkum Semua Fitur Sekaligus"
    assert anchor_md5 in md
    # find end of section 5 = start of "## 6."
    idx6 = md.index("## 6. Waktu Semu")
    g5_md = """## 6. Attribution Drift: Ketika Alasannya Berubah — Walau Skornya Tidak

PSI skor memberitahumu populasi bergeser; PSI per fitur memberitahumu fitur mana yang bergeser. Attribution drift adalah perubahan pada PENJELASAN model dari waktu ke waktu — fitur yang dulu menjadi pendorong utama kini bukan lagi — sementara skor dan metrik performa bisa tampak stabil.

**Monitor dua hal [simulasi atas SHAP kanonis M7.3]:** proporsi top reason codes per periode (baseline mean |SHAP|: PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892; periode baru: PAY_MAX 0,2500, UTILIZATION 0,3100 — top-1 BERGANTI) dan PSI atas mean |SHAP| per keluarga fitur. Dan monitor per grup: reason codes per grup (SEX/EDUCATION).

**Baik/buruk:** monitoring atribusi bagus karena menangkap perubahan yang tidak terlihat di metrik performa. Buruk bila dibaca sebagai BUKTI KAUSAL: «UTILIZATION kini menyebabkan default» adalah klaim tentang dunia — yang ditunjukkan hanyalah «model ini kini lebih mengandalkan UTILIZATION». Attribution drift adalah DIAGNOSIS.

**Mitigasi:** tambahkan tiga baris ke dashboard — (1) top-3 reason codes per periode (global dan per grup); (2) PSI mean |SHAP| per keluarga fitur; (3) selisih mean |SHAP| top-1 antar-periode. Aturan alert sama seperti alerting: satu periode = WASPADA, dua periode berturut-turut = selidiki.

---

"""
    md = md[:idx6] + g5_md + md[idx6:]
    # G4 after Waktu Semu section (now "## 7. Waktu Semu" after renumber? No —
    # renumber happens later; currently "## 6. Waktu Semu" is followed by G5 insert
    # shifting it: after G5 insert, Waktu Semu is still "## 6." textually; find it.
    idx_decay = md.index("## 7. Decay Performa")
    g4_md = """## 7. Matured Cohort: Label yang Belum Matang Tidak Boleh Dipakai untuk Menilai

Semua metrik performa — ROC-AUC, PR-AUC, bad rate, dan semua metrik fairness — butuh LABEL. Dan label butuh WAKTU. Label di dataset ini adalah «default bulan depan» — jendela observasi 1 bulan. Nasabah yang aplikasinya 2 minggu lalu BELUM PUNYA label. Garis waktunya: aplikasi (bulan 0) → skor/keputusan (saat itu juga) → jendela observasi (1 bulan) → label tersedia (matang).

**Nilai:** cohort MATANG adalah aplikasi yang jendela observasinya sudah lewat — hanya cohort inilah yang boleh dipakai untuk ROC-AUC, PR-AUC, bad rate, dan metrik fairness. Cohort BELUM MATANG hanya boleh dimonitor TANPA label: PSI, approval rate, distribusi skor, dan proporsi label matang itu sendiri. Laporkan «proporsi label matang» per periode: bila 0%, tulis «belum matang», bukan 0. Bila 60%, metriknya adalah metrik atas 60% itu — dan 60% itu BUKAN sampel acak (default cenderung ketahuan lebih dulu).

**Baik/buruk:** pemisahan ini bagus karena ia membuat satu pertanyaan tajam — «periode ini boleh dipakai untuk metrik apa?» Buruk bila dibaca sebagai «jadi periode terbaru tidak berguna»: periode terbaru justru yang paling penting untuk monitoring TANPA label.

**Mitigasi:** pisahkan DUA kolom per periode — «monitoring tanpa label» (selalu tersedia) dan «monitoring dengan label» (hanya cohort matang). Periode yang belum matang TIDAK PERNAH menaikkan level alert berbasis label.

---

"""
    md = md[:idx_decay] + g4_md + md[idx_decay:]
    # G1 after Alerting section (before "## 10. Kapan Retrain").
    idx_retrain = md.index("## 10. Kapan Retrain")
    g1_md = """## 11. Fairness Monitoring: Overall yang Stabil Bisa Menyembunyikan Ketidakadilan yang Bergerak

Monitoring sejauh ini memonitor POPULASI — PSI, ROC-AUC, approval, bad rate — semuanya OVERALL. Fairness monitoring memonitor apakah model ini tetap adil UNTUK SETIAP GRUP, di setiap periode. Keduanya bisa bergerak berlawanan arah: overall stabil sementara fairness memburuk.

**Nilai:** dashboard fairness per periode/grup — lima baris per grup (SEX, EDUCATION, AGE, MARRIAGE): approval rate, AIR, gap TPR, gap FPR/FNR, ECE/Brier per grup — masing-masing dengan n dan label matangnya. Aturan alert: AIR grup mana pun di bawah 0,80 selama 2 periode berturut-turut, ATAU gap TPR/FPR melewati 0,05 dan bertahan 2 periode — dan alert itu TIDAK PERNAH digabung dengan alert overall. Gambar dua panelnya: approval overall per chunk [waktu semu] berayun 25,17%–33,67% tanpa tren, sementara AIR SEX [simulasi] bergerak 0,869 → 0,710 → 0,830 → 0,910 → 0,940, dan chunk 2 (0,710) jatuh DI BAWAH 0,80.

**Baik/buruk:** dashboard ini bagus karena membuat ketidakadilan yang bergerak menjadi TERLIHAT. Buruk bila AIR per-periode dihitung tanpa n dan tanpa label matang — tulis keduanya di samping AIR-nya, atau jangan laporkan AIR itu sama sekali.

**Mitigasi:** tambahkan fairness monitoring SEBELUM model live — lima baris per grup, per periode; alert fairness terpisah dari alert overall; keputusan retrain/rollback yang dipicu alert fairness DITINJAU manusia.

---

"""
    md = md[:idx_retrain] + g1_md + md[idx_retrain:]
    # Lab 3 + Lab 4 before Guided Task.
    anchor_guided = "## Guided Task di Colab"
    assert anchor_guided in md
    labs_md = """## Lab 3: Monitoring Overall vs Per-Grup — Mana yang Berteriak Duluan?

Approval overall per chunk [waktu semu]: C1 26,92%, C2 27,17%, C3 25,17%, C4 33,67%, C5 29,58% — ayunan 8,50 poin persen tanpa tren. AIR SEX per chunk [simulasi]: 0,869, 0,710, 0,830, 0,910, 0,940 — ayunan 0,230, chunk 2 di bawah 0,80. Ayunan overall adalah NOISE periode-kecil; AIR 0,710 adalah FLAG yang harus diselidiki.

---

## Lab 4 (ringkas): Attribution Drift — Top-1 Berganti, Apa Artinya?

Baseline mean |SHAP| global (GBM mentah): PAY_MAX 0,4946; UTILIZATION 0,1574. Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100 — top-1 BERGANTI. Selisih: PAY_MAX −0,2446, UTILIZATION +0,1526. Top-1 yang berganti adalah DIAGNOSIS — selidiki, bukan bukti kausal.

---

"""
    md = md.replace(anchor_guided, labs_md + anchor_guided, 1)
    # Renumber "## N." headings sequentially (labs unnumbered, untouched).
    nums = [0]

    def renum_md(m):
        nums[0] += 1
        return f"## {nums[0]}. {m.group(2)}"

    md = re.sub(r"^## (\d+)\. (.*)$", renum_md, md, flags=re.M)
    # Rangkuman bullets.
    anchor_rangk_md = "- Lab: PSI parsial 3 bin UTILIZATION = 0,0006"
    assert anchor_rangk_md in md
    md = md.replace(
        anchor_rangk_md,
        "- Attribution drift [simulasi]: mean |SHAP| PAY_MAX 0,4946 → 0,2500, UTILIZATION 0,1574 → 0,3100 — top-1 berganti; drift atribusi adalah diagnosis, bukan bukti kausal.\n"
        "- Matured cohort: label baru tersedia setelah jendela observasi 1 bulan; metrik berlabel hanya untuk cohort matang; periode terbaru hanya dimonitor tanpa label.\n"
        "- Fairness monitoring: dashboard per periode/grup dengan alert fairness terpisah; AIR SEX [simulasi] 0,710 di chunk 2 — overall diam, fairness bergerak.\n"
        + anchor_rangk_md, 1)
    MD.write_text(md, encoding="utf-8")
    print(f"M7.5 MD: sections renumbered to {nums[0]}")


if __name__ == "__main__":
    main()
