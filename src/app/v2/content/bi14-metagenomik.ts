import type { V2Lesson } from "../lib/types";

export const bi14: V2Lesson = {
  slug: "bi14-metagenomik",
  track: "Bioinformatika",
  module: "Metagenomik",
  title: "BI14 · Metagenomik: 16S & Komposisi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "99% tak bisa dibiakkan",
      prose: [
        "Selama seabad, mikrobiologi = biakkan di cawan. Masalah: 99% mikroba tidak bisa dibiakkan — kita buta terhadap hampir semua penghuni tubuh. Lalu datang sekuensing langsung dari sampel: usus manusia ternyata dihuni 1.000+ spesies yang tak pernah terlihat di cawan.",
        "Metagenomik = sensus tanpa cawan: sekuensing DNA langsung dari lingkungan. Twist-nya: data mikrobiom adalah komposisional — dan ini menipu hampir semua orang. Karena sekuensing mengukur proporsi (bukan jumlah absolut), naiknya satu bakteri otomatis menurunkan persentase yang lain, bahkan jika jumlah aslinya tidak berubah. Ratusan paper “bakteri X berkurang pada penyakit Y” runtuh begitu dianalisis dengan benar.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa 99% mikroba tak terlihat di cawan" },
        { id: "t2", text: "Jelaskan jebakan komposisional dengan contoh" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpulkan “mikrobiom menyebabkan penyakit” dari studi asosiasi cross-sectional. Asosiasi ≠ kausalitas: mikrobiom berubah karena penyakit, obat, diet — arah bisa terbalik. Kausalitas butuh intervensi (RCT), longitudinal, atau model hewan.",
      },
      reference: "Metagenomik = sensus tanpa cawan. Data persen = jebakan komposisi.",
    },
    {
      id: "lensa",
      eyebrow: "Langkah 2 · Dua lensa",
      title: "16S vs shotgun",
      prose: [
        "16S rRNA: sekuensing satu gen penanda bakteri — murah, taksonomi level genus, tanpa info fungsi. Buta terhadap virus/jamur. Shotgun: sekuensing SEMUA DNA — spesies/strain + fungsi (gen apa yang dibawa), mahal, butuh komputasi besar.",
        "Analoginya: 16S seperti sensus pakai KTP — tahu siapa (genus) tapi tidak tahu kerja apa. Shotgun seperti wawancara mendalam — tahu siapa sampai strain DAN pekerjaannya.",
        "Strategi hemat: 16S untuk skrining 500 sampel, shotgun untuk 100 sampel ekstrem — taksonomi + fungsi dengan budget terkendali. Catatan: daerah 16S yang dipilih (V3-V4 vs V4 saja) mengubah hasil!",
      ],
      tasks: [
        { id: "t1", text: "Untuk survei 500 feses budget terbatas, pilih lensanya" },
        { id: "t2", text: "Untuk mencari gen resistensi antibiotik, pilih lensanya" },
      ],
      reference: "16S = siapa (murah) · shotgun = siapa + ngapain (mahal).",
    },
    {
      id: "lab-komposisi",
      eyebrow: "Langkah 3 · Lab",
      title: "Korelasi palsu komposisional",
      prose: [
        "Simulasi 10 takson dengan abundansi ABSOLUT independen: takson 0 naik (efek), takson 1 dan 2 murni noise independen. Ubah menjadi persen (komposisi) — saksikan korelasi palsu muncul dari ketiadaan.",
        "Lalu terapkan CLR (centered log-ratio): bagi tiap takson dengan rata-rata geometrik, lalu log. Korelasi palsu lenyap — kembali ~0. Jangan pernah korelasikan proporsi mentah.",
      ],
      formula: String.raw`clr(x_i) = \ln\frac{x_i}{g(x)}`,
      formulaNote: "g(x) = rata-rata geometrik semua takson. CLR memutus belenggu “total 100%”.",
      tasks: [
        { id: "t1", text: "Hitung korelasi B-C pada data absolut (harus ~0)" },
        { id: "t2", text: "Hitung korelasi B-C pada persen (muncul palsu!)" },
        { id: "t3", text: "Hitung korelasi B-C setelah CLR (kembali ~0)" },
      ],
      expected: "absolut ~0 · persen +0.35 PALSU · CLR ~0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan korelasi Pearson/Spearman pada persen mikrobiom. Total 100% memaksa ketergantungan matematis — seperti survei “persen waktu harian”: tidur naik otomatis berarti aktivitas lain turun, bukan karena malas. CLR dulu, atau pakai SparCC/ANCOM.",
      },
      hints: [
        "Korelasi Pearson = kovarians / (sd_x * sd_y).",
        "Persen: total per sampel = jumlah semua takson; bagi tiap takson.",
        "CLR: log(nilai / rata-rata geometrik).",
      ],
      code: {
        starter: `import random, math, statistics as st\nrandom.seed(9)\nN_TAXA = 10\ntakson = [[100 + i*10 + random.gauss(0,5) for i in range(20)]]\nfor _ in range(N_TAXA-1):\n    takson.append([50 + random.gauss(0,5) for _ in range(20)])\n\ndef kor(x, y):\n    mx, my = st.mean(x), st.mean(y)\n    return sum((a-mx)*(b-my) for a,b in zip(x,y)) / \\\n        (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\n\nB, C = takson[1], takson[2]\nprint(f'korelasi ABSOLUT B-C: {kor(B,C):+.2f} (independen ~ 0)')\n\n# TULIS KODEMU: ubah jadi persen, hitung korelasi\ntot = \npB = \npC = \nprint(f'korelasi PERSEN   B-C: {kor(pB,pC):+.2f} <- PALSU!')\n\n# TULIS KODEMU: CLR lalu korelasi\ndef clr_row(vals):\n    g = \n    return [math.log(v/g) for v in vals]\ncB = [clr_row([takson[j][i] for j in range(N_TAXA)])[1] for i in range(20)]\ncC = [clr_row([takson[j][i] for j in range(N_TAXA)])[2] for i in range(20)]\nprint(f'korelasi CLR      B-C: {kor(cB,cC):+.2f} (kembali ~0)')`,
        lockLines: 12,
        solution: `import random, math, statistics as st\nrandom.seed(9)\nN_TAXA = 10\ntakson = [[100 + i*10 + random.gauss(0,5) for i in range(20)]]\nfor _ in range(N_TAXA-1):\n    takson.append([50 + random.gauss(0,5) for _ in range(20)])\n\ndef kor(x, y):\n    mx, my = st.mean(x), st.mean(y)\n    return sum((a-mx)*(b-my) for a,b in zip(x,y)) / \\\n        (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\n\nB, C = takson[1], takson[2]\nprint(f'korelasi ABSOLUT B-C: {kor(B,C):+.2f} (independen ~ 0)')\n\n# TULIS KODEMU: ubah jadi persen, hitung korelasi\ntot = [sum(takson[j][i] for j in range(N_TAXA)) for i in range(20)]\npB = [B[i]/tot[i]*100 for i in range(20)]\npC = [C[i]/tot[i]*100 for i in range(20)]\nprint(f'korelasi PERSEN   B-C: {kor(pB,pC):+.2f} <- PALSU!')\n\n# TULIS KODEMU: CLR lalu korelasi\ndef clr_row(vals):\n    g = math.exp(sum(math.log(v) for v in vals)/len(vals))\n    return [math.log(v/g) for v in vals]\ncB = [clr_row([takson[j][i] for j in range(N_TAXA)])[1] for i in range(20)]\ncC = [clr_row([takson[j][i] for j in range(N_TAXA)])[2] for i in range(20)]\nprint(f'korelasi CLR      B-C: {kor(cB,cC):+.2f} (kembali ~0)')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "korelasi ABSOLUT B-C: [+-]0\\.\\d+", label: "korelasi absolut ~0", msg: "B dan C independen → korelasi mendekati 0." },
          { kind: "stdout_matches", task: "t2", pattern: "korelasi PERSEN   B-C: \\+0\\.3\\d", label: "korelasi persen positif palsu", msg: "Persen: B dan C sama-sama “turun” saat takson 0 naik → korelasi positif palsu." },
          { kind: "stdout_matches", task: "t3", pattern: "korelasi CLR      B-C: [+-]0\\.\\d+", label: "korelasi CLR ~0", msg: "CLR memakai rata-rata geometrik sebagai referensi internal." },
        ],
      },
      reference: "Jangan korelasi persen mentah. CLR/SparCC/ANCOM untuk data komposisional.",
    },
    {
      id: "lab-diversitas",
      eyebrow: "Langkah 4 · Lab",
      title: "Indeks Shannon dan jarak Bray-Curtis",
      prose: [
        "Alfa (dalam sampel): indeks Shannon — menggabungkan kekayaan dan kemerataan. 0 = satu takson dominan total; makin banyak & merata → makin tinggi. Beta (antar sampel): Bray-Curtis — seberapa beda komunitas; diuji dengan PERMANOVA.",
        "Hitung keduanya untuk 3 sampel (2 sehat, 1 sakit). Pola klasik dysbiosis: diversitas turun + komposisi bergeser.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `shannon`" },
        { id: "t2", text: "Lengkapi fungsi `bray`" },
        { id: "t3", text: "Interpretasikan: mana lebih beragam, seberapa beda" },
      ],
      expected: "sakit1 Shannon terendah · jarak ke sehat terbesar",
      hints: [
        "Shannon = -jumlah (p * ln(p)) untuk tiap takson.",
        "Bray-Curtis = jumlah|a-b| / jumlah(a+b).",
        "Abaikan takson dengan count 0 (log 0 tak terdefinisi).",
      ],
      code: {
        starter: `import math\nsampel = {'sehat1': [30,25,20,15,10],\n          'sehat2': [28,26,21,14,11],\n          'sakit1': [80,5,5,5,5]}\n\ndef shannon(counts):\n    # TULIS KODEMU\n    tot = sum(counts)\n    return \n\ndef bray(a, b):\n    # TULIS KODEMU\n    return \n\nprint('alfa (Shannon):')\nfor s, c in sampel.items():\n    print(f'  {s}: {shannon(c):.2f}')\nprint('beta (Bray-Curtis):')\nss = list(sampel)\nfor i in range(len(ss)):\n    for j in range(i+1, len(ss)):\n        print(f'  {ss[i]} vs {ss[j]}: {bray(sampel[ss[i]], sampel[ss[j]]):.2f}')`,
        lockLines: 4,
        solution: `import math\nsampel = {'sehat1': [30,25,20,15,10],\n          'sehat2': [28,26,21,14,11],\n          'sakit1': [80,5,5,5,5]}\n\ndef shannon(counts):\n    # TULIS KODEMU\n    tot = sum(counts)\n    return -sum((c/tot)*math.log(c/tot) for c in counts if c > 0)\n\ndef bray(a, b):\n    # TULIS KODEMU\n    return sum(abs(x-y) for x,y in zip(a,b))/sum(x+y for x,y in zip(a,b))\n\nprint('alfa (Shannon):')\nfor s, c in sampel.items():\n    print(f'  {s}: {shannon(c):.2f}')\nprint('beta (Bray-Curtis):')\nss = list(sampel)\nfor i in range(len(ss)):\n    for j in range(i+1, len(ss)):\n        print(f'  {ss[i]} vs {ss[j]}: {bray(sampel[ss[i]], sampel[ss[j]]):.2f}')`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "sakit1: 0\\.78", label: "Shannon sakit1 = 0.78", msg: "sakit1 didominasi satu takson (80/100) → Shannon rendah." },
          { kind: "stdout_matches", task: "t3", pattern: "sehat1 vs sakit1: 0\\.50", label: "Bray-Curtis sehat1-sakit1 = 0.50", msg: "Jarak sakit vs sehat harus jauh lebih besar dari sehat vs sehat." },
        ],
      },
      note: {
        title: "Intuisi: mikrobiom adalah data komposisi — perlakukan seperti itu",
        body: "Praktisi metagenomik menyimpan lima heuristik yang menyelamatkan mereka dari paper yang memalukan. Satu: jangan pernah menghitung korelasi atau uji-t pada proporsi mentah — karena totalnya selalu 100%, naiknya satu takson otomatis menurunkan yang lain dan menciptakan korelasi palsu. Pakai transformasi komposisional (CLR) atau tool khusus (ANCOM, ALDEx2) sebelum percaya angka apa pun. Dua: sampel low-biomass (darah, plasenta, paru) adalah ladang kontaminasi — reagen kit membawa DNA-nya sendiri (“kitome”), dan pada sampel encer kontaminan bisa mendominasi sinyal. Selalu sertakan blank ekstraksi dan kontrol negatif; takson yang lebih sering muncul di kontrol daripada di sampel adalah tersangka kontaminan, bukan temuan. Tiga: pilih lensa sesuai pertanyaan — 16S murah untuk “siapa di sana” (skrining ratusan sampel), shotgun mahal untuk “siapa + apa yang mereka lakukan” (gen fungsional, strain). Memakai 16S lalu mengklaim fungsi = melampaui data. Empat: sebelum mengaitkan mikroba dengan penyakit, saring confounder obat dan diet — metformin, antibiotik, dan pola makan mengubah mikrobiom lebih kuat daripada kebanyakan penyakit yang diteliti. Lima: database referensi bias ke mikroba Barat — mikroba Indonesia banyak yang tak terwakili, jadi “tak terklasifikasi” bisa berarti baru, bukan tidak penting. Heuristik gabungannya: setiap klaim mikrobiom harus lolos tiga saringan — metodenya komposisional-benar, confoundernya terkontrol, dan temuannya tereplikasi di kohort independen.",
      },
      reference: "Alfa = dalam sampel (Shannon) · beta = antar sampel (Bray-Curtis + PERMANOVA).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: lensa dan metode apa untuk mikrobiom?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Survei cepat “siapa ada di sana”. → 16S rRNA. Alasan: murah, cukup untuk taksonomi level genus. Contoh nyata: skrining 500 sampel feses untuk pola umum.",
        "Skenario 2 — Butuh fungsi dan resolusi strain. → Shotgun metagenomik. Alasan: sekuensing semua DNA — tahu siapa sampai strain DAN gen apa yang dibawa. Contoh nyata: melacak gen resistensi antibiotik, bukan cuma genus pembawanya.",
        "Skenario 3 — Taksonomi cepat untuk spesies yang sudah dikenal. → Kraken2/MetaPhlAn (mazhab referensi). Alasan: jutaan read per menit dengan database yang ada. Contoh nyata: profil mikrobiom klinis dalam hitungan jam.",
        "Skenario 4 — Mencari bakteri yang belum pernah dibiakkan. → De novo (MEGAHIT/metaSPAdes) + binning MAG. Alasan: referensi tidak punya yang belum dikenal; rakitan de novo menemukannya dari komputasi murni. Contoh nyata: MAG baru dari sedimen laut dalam.",
        "Skenario 5 — Sampel low-biomass (darah, plasenta). → Kontrol negatif wajib di setiap batch. Alasan: DNA kontaminan kit (“kitome”) mendominasi sinyal saat biomassa rendah. Contoh nyata: “mikrobiom plasenta” yang ternyata mikrobiom kit ekstraksi.",
        "Aturan praktis 10 detik: 16S = siapa (genus); shotgun = siapa + kerja apa; low-biomass tanpa kontrol negatif = membaca kit, bukan sampel."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengklaim spesies langka dari 16S tanpa mempertimbangkan kontaminasi reagen — pada sampel low-biomass, “temuan langka” paling sering adalah DNA dari kit ekstraksi, bukan biologi sampel.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "“Probiotik diabetes” dari data cross-sectional",
      prose: [
        "Studi 200 orang: genus X lebih rendah pada diabetes (p=0,001, uji-t pada persen). Startup langsung jual probiotik X “klinis terbukti”. Kamu diminta review. Temuan: uji-t pada persen = melanggar asumsi komposisional; 80% pasien diabetes minum metformin — yang DIKETAHUI mengubah mikrobiom; tanpa validasi kohort independen.",
        "Rerun dengan ANCOM + kontrol metformin: sinyal genus X LENYAP — yang tersisa hanya efek obat. Rekomendasi: tarik klaim “klinis terbukti”; butuh RCT probiotik X vs plasebo dengan outcome glikemik.",
        "Pelajaran: rantai kegagalan klasik mikrobiom — metode salah → confounder → overklaim komersial. Tiga cek (komposisional? confounder? replikasi?) membatalkan sebagian hype probiotik.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga cacat studi ini" },
        { id: "t2", text: "Tulis rekomendasi untuk startup" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Klaim “klinis terbukti” tanpa RCT = risiko hukum dan reputasi; konsumen membayar untuk manfaat yang tidak ada buktinya. Di risiko produk, tiga cek (metode, confounder, replikasi) adalah uji tuntas sebelum klaim kesehatan dipublikasikan.",
      },
      reference: "Asosiasi ≠ kausalitas. Kontrol obat/diet. Klaim kausal butuh RCT.",
    },
    {
      id: "denovo-kontaminasi",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "De novo vs referensi, kontaminan, dan surveilans",
      prose: [
        "Dua mazhab membaca metagenom. Mazhab referensi (Kraken2, MetaPhlAn): cocokkan tiap read ke database genom yang sudah dikenal — cepat (jutaan read per menit), murah komputasi, dan memberi profil taksonomi yang rapi. Kelemahannya fatal untuk wilayah yang belum dipetakan: yang tidak ada di database tidak akan pernah ditemukan. Database besar dibangun dari mikroba Barat dan lingkungan lab — mikroba usus orang Indonesia, tanah sawah, atau laut tropis banyak yang tak terwakili. Hasilnya: 30–60% read “tak terklasifikasi” yang sebenarnya bukan sampah, melainkan kegelapan database.",
        "Mazhab de novo (MEGAHIT, metaSPAdes + binning MetaBAT2): rakit read menjadi contig, kelompokkan menjadi MAG (metagenome-assembled genome) — genom bakteri yang belum pernah dibiakkan, ditemukan murni dari komputasi. Kelebihannya: menemukan yang baru. Biayanya: butuh kedalaman sekuensing besar (puluhan Gb per sampel), komputasi berat, dan MAG yang tidak lengkap bisa menyesatkan — cek kelengkapan dengan CheckM (di atas 90% lengkap dan di bawah 5% kontaminasi = MAG berkualitas tinggi). Aturan keputusan: survei cepat ratusan sampel dengan budget terbatas → reference-based; eksplorasi keanekaragaman atau berburu spesies baru → de novo. Studi terbaik memakai keduanya: referensi untuk yang dikenal, de novo untuk sisanya.",
        "Kontaminasi adalah pembunuh diam-diam, terutama pada sampel low-biomass. Kit ekstraksi DNA mengandung DNA bakteri dari proses manufaktur (“kitome”); air, reagen PCR, bahkan udara lab ikut menyumbang. Pada sampel feses (high-biomass) ini hanya noise kecil; pada darah atau plasenta (low-biomass), kontaminan bisa menjadi MAYORITAS read — studi “mikrobiom plasenta” yang terkenal runtuh total begitu kontrol negatif diperiksa: “mikrobiom”-nya identik dengan kitome. Pertahanan berlapis: (1) sertakan blank ekstraksi (tabung tanpa sampel, diproses identik) dan kontrol negatif PCR di SETIAP batch; (2) pakai decontam — takson yang prevalensinya lebih tinggi di kontrol daripada di sampel, atau yang konsentrasinya berkorelasi negatif dengan jumlah DNA input, ditandai kontaminan; (3) laporkan hasil dengan dan tanpa penyaringan kontaminan. Aturan: studi tanpa kontrol negatif = tidak bisa dinilai, bukan “bersih”.",
        "Angka kerja decontam: dalam satu batch 96 sampel dengan 4 blank ekstraksi, takson yang muncul di ≥3 blank dengan abundansi relatif di atas 1% ditandai kontaminan — pada studi low-biomass nyata, 15–40% “takson sampel” gugur di saringan ini. Dua uji statistiknya: uji prevalensi (Fisher — lebih sering di kontrol daripada di sampel?) dan uji frekuensi (apakah konsentrasi takson berkorelasi negatif dengan konsentrasi DNA total? — ciri khas kontaminan yang terencerkan saat DNA sampel banyak). Keduanya otomatis di paket decontam — tetapi ingat: ia alat bantu keputusan, bukan vonis; takson patogen sejati pada sampel low-biomass bisa terlihat seperti kontaminan bila blank-nya terkontaminasi silang. Selalu periksa blank-nya dulu sebelum memercayai saringannya.",
        "Taksonomi menjawab “siapa di sana”; fungsional menjawab “apa yang mereka lakukan”. Dari shotgun, tool seperti HUMAnN memetakan read ke pathway metabolik: dua komunitas dengan komposisi taksonomi yang SAMA SEKALI berbeda bisa punya profil fungsional identik — redundansi fungsional. Spesies boleh berganti, pekerjaannya tetap. Untuk pertanyaan mekanisme (“kenapa metabolit X naik?”), profil fungsional (gen resistensi antibiotik, pathway fermentasi) jauh lebih informatif daripada daftar nama Latin. Jebakan: mengklaim fungsi dari 16S via prediksi (PICRUSt) — itu tebakan berbasis kekerabatan, bukan pengukuran; untuk klaim fungsi yang serius, butuh shotgun.",
        "Di Indonesia, metagenomik punya misi khusus: surveilans patogen. Sekuensing limbah rumah sakit atau sampel klinik bisa mendeteksi wabah dan gen resistensi antibiotik (AMR) sebelum menyebar — contoh nyata: pelacakan varian SARS-CoV-2 dari air limbah. Tetapi tiga catatan: (1) database AMR (CARD, ResFinder) bias ke patogen klinis Barat — patogen tropis lokal kurang terwakili; (2) deteksi gen resistensi tidak sama dengan resistensi klinis — butuh uji fenotip (kultur + MIC) untuk konfirmasi; (3) data patogen adalah dual-use — sekuens patogen berbahaya butuh tata kelola akses, bukan repositori publik bebas. Analis metagenomik Indonesia yang baik membangun database lokal sambil menghormati batas etika.",
        "Catatan khusus untuk analis Indonesia: bias database bukan sekadar masalah akademis — ia memengaruhi keputusan klinis. Panel patogen berbasis referensi Barat bisa melewatkan varian lokal; sebaliknya, MAG dari de novo assembly adalah kontribusi nyata ke katalog global — banyak MAG dari sampel Indonesia belum terdeskripsi. Inisiatif sekuensing mikrobiom nusantara bukan “nice to have”: ia prasyarat agar tool referensi bekerja untuk populasi kita. Praktiknya: untuk studi Indonesia, selalu laporkan proporsi read tak terklasifikasi sebagai metrik kualitas database, bukan sebagai kegagalan eksperimen — dan perlakukan fraksi itu sebagai kandidat temuan (rakit de novo), bukan sampah. Database yang baik untuk Indonesia dibangun oleh analis Indonesia, satu MAG dalam satu waktu.",
        "Contoh kerja: survei 300 sampel feses. Strategi hemat: 16S untuk semua (Rp300 ribu/sampel = Rp90 juta), shotgun untuk 40 sampel ekstrem (Rp3 juta/sampel = Rp120 juta) — total Rp210 juta vs Rp900 juta bila shotgun semua. Dari shotgun, 25% read tak terklasifikasi → rakit de novo → 12 MAG berkualitas tinggi (CheckM di atas 90%), 3 di antaranya genus yang belum pernah dideskripsi. Blank ekstraksi menunjukkan kitome 2% read — disaring dengan decontam. Hasil akhir: profil taksonomi 300 sampel + profil fungsional + 3 kandidat spesies baru — dengan seperempat budget.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kapan memakai reference-based vs de novo assembly" },
        { id: "t2", text: "Sebutkan tiga lapisan pertahanan terhadap kontaminasi" },
      ],
      quiz: [
        {
          q: "Sampel darah (low-biomass): takson dominan juga dominan di blank ekstraksi. Kesimpulan?",
          options: [
            { text: "Temuan mikrobiom darah baru — publikasikan", why: "Takson yang dominan di kontrol negatif adalah definisi kontaminan, bukan temuan." },
            { text: "Kontaminan kitome — saring dengan decontam, jangan klaim sebagai biologi", why: "Pada low-biomass, kontrol negatif adalah wasitnya; abaikan wasit = klaim palsu.", correct: true },
            { text: "Sekuensing lebih dalam untuk memastikan", why: "Kedalaman tidak membedakan kontaminan dari sinyal — kontrol negatif yang membedakan." },
            { text: "Transformasi CLR akan mengatasinya", why: "CLR mengatasi komposisionalitas, bukan kontaminasi fisik dari reagen." },
          ],
        },
        {
          q: "Dua komunitas: taksonomi beda total, profil pathway metabolik identik. Interpretasi?",
          options: [
            { text: "Salah satu analisis pasti salah", why: "Keduanya bisa benar — taksonomi dan fungsi adalah dua sumbu berbeda." },
            { text: "Redundansi fungsional — spesies berganti, pekerjaan tetap", why: "Ekosistem memilih fungsi, bukan nama Latin; inilah kenapa profil fungsional penting.", correct: true },
            { text: "Butuh lebih banyak sampel", why: "Bukan soal jumlah sampel — polanya konsisten dan bermakna." },
            { text: "Cukup pakai 16S saja lain kali", why: "16S justru tidak bisa melihat redundansi fungsional — ia buta terhadap fungsi." },
          ],
        },
      ],
      reference: "Referensi = cepat tapi buta terhadap yang baru · de novo = berburu MAG · kontrol negatif = wajib.",
    },
    {
          id: "gap-r9-dada2-rarefaction",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P8-G1)",
          title: "DADA2 & ASV: dari read mentah ke tabel yang bisa dibandingkan",
          prose: [
            "Langkah 2 membandingkan 16S vs shotgun — tetapi belum mengajarkan PIPELINE 16S-nya: dari read mentah ke tabel hitung yang bisa dibandingkan antar-sampel. Dua langkah kuncinya: (1) DENOISING (DADA2): read mentah mengandung error sekuensing — DADA2 memodelkan error itu dan menyimpulkan sekuens ASLI (Amplicon Sequence Variant, ASV) di baliknya, sekaligus membuang chimera (read hibrida dari dua organisme). Beda dengan OTU lama yang mengelompokkan pada kemiripan 97%: ASV membedakan dua organisme yang berbeda SATU nukleotida — resolusi yang mustahil bagi OTU. (2) NORMALISASI KEDALAMAN (rarefaction): sampel dengan 12.000 read vs 5.000 read TIDAK bisa dibandingkan mentah-mentah — sampel yang lebih dalam selalu tampak lebih beragam. Rarefaction = subsample semua sampel ke kedalaman TERKECIL (di sini 5.000), sehingga perbandingan menjadi adil.",
            "Contoh angka: 10.000 read mentah → setelah DADA2 tersisa 8.500 (retensi 0,85 — 15% dibuang sebagai error/chimera). Tiga sampel berkedalaman 12.000, 8.000, 5.000 → depth rarefaction = 5.000 (minimum); sampel terdalam membuang 12.000 − 5.000 = 7.000 read. Harga rarefaction: data dibuang — sampel yang dalam kehilangan informasi. Alternatifnya (dan perdebatan yang jujur): normalisasi proporsi atau transformasi CLR seperti lab Langkah 3 — yang TIDAK membuang data tetapi mengubah skala. McMurdie & Holmes (2014) terkenal menolak rarefaction karena membuang data; banyak praktisi tetap memakainya karena sederhana dan adil untuk indeks diversitas. Pilih dengan sadar, dan LAPORKAN pilihanmu.",
            "Aturan praktis: laporkan SELALU tiga angka pipeline-mu — read mentah, read setelah denoising (retensi), dan depth rarefaction — karena ketiganya mengubah SEMUA angka hilir (Shannon, Bray-Curtis, korelasi CLR). Studi yang tidak melaporkannya tidak bisa direproduksi.",
          ],
          formula: String.raw`\text{retensi} = \frac{\text{read bersih}}{\text{read mentah}} \qquad \text{depth} = \min(\text{kedalaman sampel})`,
          formulaNote: "DADA2: denoising + buang chimera → ASV (resolusi 1 nukleotida, bukan OTU 97%). Rarefaction: subsample ke kedalaman minimum. Contoh angka: 10.000 → 8.500 read (retensi 0,85); depth [12.000, 8.000, 5.000] → 5.000; sampel terdalam membuang 7.000 read.",
          tasks: [
            { id: "t1", text: "Hitung `retensi` (8.500/10.000) dan `depth` (minimum 3 sampel)" },
            { id: "t2", text: "Hitung `buang` (12.000 − depth) dan cetak ketiganya" },
          ],
          expected: "retensi=0.85 depth=5000 buang=7000",
          hints: [
            "retensi = bersih / mentah.",
            "depth = min(kedalaman); buang = 12.000 − depth.",
          ],
          code: {
            starter: `mentah, bersih = 10000, 8500\nkedalaman = [12000, 8000, 5000]\n\n# TULIS KODEMU: retensi DADA2 + depth rarefaction\nretensi = \ndepth = \nbuang = \n\nprint(f"retensi={retensi:.2f} depth={depth} buang={buang}")`,
            lockLines: 4,
            solution: `mentah, bersih = 10000, 8500\nkedalaman = [12000, 8000, 5000]\n\n# TULIS KODEMU: retensi DADA2 + depth rarefaction\nretensi = bersih / mentah\ndepth = min(kedalaman)\nbuang = max(kedalaman) - depth\n\nprint(f"retensi={retensi:.2f} depth={depth} buang={buang}")`,
            checks: [
              { kind: "equal", task: "t1", name: "retensi", value: 0.85, tol: 0.01, label: "`retensi` seharusnya 0,85", msg: "8.500/10.000 = 0,85." },
              { kind: "equal", task: "t1", name: "depth", value: 5000, label: "`depth` seharusnya 5.000", msg: "Minimum dari [12.000, 8.000, 5.000]." },
              { kind: "equal", task: "t2", name: "buang", value: 7000, label: "`buang` seharusnya 7.000", msg: "12.000 − 5.000 = 7.000." },
              { kind: "stdout_matches", task: "t2", pattern: "retensi=0.85\\s+depth=5000\\s+buang=7000", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Dua ASV berbeda 1 nukleotida. Dengan OTU 97%, apa yang terjadi — dan mengapa ASV lebih baik?",
              options: [
                { text: "OTU menggabungkannya (kemiripan >97%) — dua organisme berbeda jadi satu; ASV memisahkannya", why: "Benar: resolusi ASV adalah 1 nukleotida; OTU mengaburkan perbedaan strain yang bisa bermakna klinis.", correct: true },
                { text: "OTU memisahkannya — 97% terlalu ketat", why: "Salah: 97% justru LONGGAR — sekuens yang 99% sama tetap digabung." },
                { text: "Tidak ada bedanya — keduanya menghitung hal yang sama", why: "Salah: ASV dan OTU memberi jumlah taksa yang berbeda dan kesimpulan yang bisa berbeda." },
              ],
            },
          ],
          reference: "DADA2 → ASV (1 nukleotida); rarefaction ke depth minimum; laporkan retensi + depth.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Metagenomik = sensus tanpa cawan; 99% tak terbaca konvensional.",
        "16S: murah, taksonomi; shotgun: fungsi + strain, mahal.",
        "Data komposisional: jangan korelasi persen — pakai CLR/ANCOM.",
        "Alfa (Shannon): dalam sampel; beta (Bray-Curtis): antar sampel + PERMANOVA.",
        "Asosiasi ≠ kausalitas; kontrol obat/diet.",
        "Strain menentukan (probiotik vs patogen).",
      ],
      next: { label: "BI15 · Proteomik & Multi-Omics", href: "/v2/learn/bi15-proteomik" },
      quiz: [
        {
          q: "Kapan shotgun dipilih atas 16S?",
          options: [
            { text: "Selalu", why: "Shotgun mahal; untuk survei murah 16S cukup." },
            { text: "Butuh fungsi gen / resolusi strain / non-bakteri", why: "KTP vs wawancara. Fungsi & strain butuh semua DNA.", correct: true },
            { text: "Tidak pernah", why: "Untuk resistome dan strain, shotgun tak tergantikan." },
            { text: "Hanya untuk virus", why: "Shotgun justru paling kuat untuk bakteri + fungsi." },
          ],
        },
        {
          q: "Bahaya korelasi pada data persen mikrobiom?",
          options: [
            { text: "Tidak ada", why: "Ada: korelasi palsu dari ketergantungan matematis." },
            { text: "Korelasi palsu: total 100% memaksa ketergantungan matematis", why: "Hari cuma 24 jam. CLR/SparCC/ANCOM solusinya.", correct: true },
            { text: "Terlalu lambat", why: "Kecepatan bukan masalahnya." },
            { text: "Hanya untuk 16S", why: "Berlaku untuk semua data komposisional, termasuk shotgun." },
          ],
        },
        {
          q: "Diversitas alfa (Shannon) mengukur…",
          options: [
            { text: "Perbedaan antar sampel", why: "Itu diversitas beta." },
            { text: "Kekayaan & kemerataan DALAM satu sampel", why: "Dalam vs antar = alfa vs beta. Jangan tertukar.", correct: true },
            { text: "Jumlah read", why: "Jumlah read adalah kedalaman sekuensing, bukan diversitas." },
            { text: "p-value", why: "Tidak ada kaitan." },
          ],
        },
        {
          q: "PERMANOVA menguji…",
          options: [
            { text: "Satu gen", why: "PERMANOVA multivariat untuk komunitas." },
            { text: "Perbedaan KOMUNITAS antar kelompok dari matriks jarak beta", why: "Juri “beda komunitas ini nyata?” dari Bray-Curtis/UniFrac.", correct: true },
            { text: "Normalitas", why: "Itu uji Shapiro-Wilk, bukan PERMANOVA." },
            { text: "Korelasi", why: "Korelasi diuji terpisah; ini uji perbedaan kelompok." },
          ],
        },
        {
          q: "Confounder klasik studi mikrobiom-diabetes?",
          options: [
            { text: "Warna mata", why: "Tidak memengaruhi mikrobiom usus." },
            { text: "Metformin & diet — mengubah mikrobiom langsung", why: "Obat adalah confounder #1. Tanpa kontrol obat, temuan = efek farmasi.", correct: true },
            { text: "Golongan darah", why: "Efeknya kecil dibanding obat dan diet." },
            { text: "Tidak ada", why: "Ada banyak: obat, diet, usia, geografi." },
          ],
        },
      ],
    },
  ],
};
