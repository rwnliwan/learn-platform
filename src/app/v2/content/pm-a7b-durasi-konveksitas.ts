import type { V2Lesson } from "../lib/types";

export const pma7b: V2Lesson = {
  slug: "pm-a7b-durasi-konveksitas",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A7B Fixed Income: Durasi, Konveksitas & Kurva Yield",
  estMinutes: 60,
  steps: [
    {
      id: "tiga-duration",
      eyebrow: "Langkah 1 · Tiga Duration",
      title: "Macaulay, modified, effective: tiga jawaban untuk satu pertanyaan",
      prose: [
        "PM-A7 memperkenalkan duration sebagai pengukur nyeri suku bunga: obligasi 20 tahun Pak Hendra dengan D_mod 14 kehilangan sekitar 14 persen harga setiap 1 persen kenaikan yield. Lesson ini memperdalam: ternyata ada tiga duration, dan memakai yang salah pada obligasi yang salah adalah cara cepat kehilangan uang dengan percaya diri. Fixed Income berbobot sekitar 10 sampai 12 persen di CFA Level 1 (rentang yang umum dipublikasikan) — dan duration adalah topik yang paling sering diuji di dalamnya.",
        "Macaulay duration adalah rata-rata tertimbang waktu arus kas: setiap kupon dan principal ditimbang oleh nilai kini-nya, lalu dirata-rata. Satuannya tahun, dan ia menjawab pertanyaan kapan, secara rata-rata, uangmu kembali. Modified duration adalah Macaulay dibagi satu ditambah yield: satuannya persen per persen, dan ia menjawab pertanyaan berapa persen harga berubah bila yield bergerak 1 persen. Effective duration adalah versi empiris: geser kurva yield naik dan turun sedikit, ukur perubahan harga yang sesungguhnya, lalu hitung sensitivitasnya dari harga itu.",
        "Untuk obligasi biasa tanpa opsi, ketiganya berdekatan dan modified sudah cukup. Tetapi untuk obligasi callable, putable, atau MBS — yang arus kasnya berubah saat yield bergerak — hanya effective duration yang jujur, karena ia mengukur apa yang benar-benar terjadi pada harga, bukan apa yang diasumsikan rumus. Aturan praktisnya: Macaulay untuk memahami waktu, modified untuk obligasi polos, effective untuk obligasi beropsi.",
      ],
      formula: String.raw`D_{Mac} = \frac{\sum t \cdot PV(CF_t)}{P} \quad;\quad D_{mod} = \frac{D_{Mac}}{1+y} \quad;\quad D_{eff} = \frac{P_{-} - P_{+}}{2 \cdot P_0 \cdot \Delta y}`,
      formulaNote: "D_Mac = Macaulay duration dalam tahun (rata-rata tertimbang waktu arus kas); D_mod = modified duration (sensitivitas harga per 1 persen perubahan yield); D_eff = effective duration dari harga aktual setelah yield digeser naik (P_+) dan turun (P_-) sebesar Δy. Contoh angka (ilustratif): obligasi 5 tahun kupon 6 persen, harga 100 pada YTM 6 persen — Macaulay 4,47 tahun, modified 4,21, effective 4,21. Ketiganya berdekatan karena obligasi ini polos, tanpa opsi.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai modified duration untuk obligasi callable. Saat yield turun, emiten memanggil obligasi dan arus kas berhenti — harga tidak naik sebesar prediksi modified. Untuk obligasi beropsi, pakai effective duration.",
      },
      reference: "Macaulay = waktu rata-rata uang kembali. Modified = sensitivitas harga (obligasi polos). Effective = sensitivitas dari harga aktual (obligasi beropsi).",
    },
    {
      id: "lab-tiga-duration",
      eyebrow: "Langkah 2 · Lab: Hitung Ketiganya",
      title: "Satu obligasi, tiga duration — hitung sendiri",
      prose: [
        "Obligasi ilustratif kita: tenor 5 tahun, kupon 6 per tahun, nilai nominal 100, YTM 6 persen — obligasi par, harga 100. Macaulay duration-nya adalah 4,47 tahun: rata-rata tertimbang waktu arus kas, dengan kupon-kupon awal berbobot kecil dan principal di tahun ke-5 berbobot besar. Modified duration adalah 4,47 dibagi 1,06 sama dengan 4,21.",
        "Effective duration dihitung dengan cara yang berbeda: geser yield 50 basis poin ke atas dan ke bawah, lalu ukur harga yang sesungguhnya. Pada yield 6,5 persen harga menjadi 97,92; pada yield 5,5 persen harga menjadi 102,14. Effective duration sama dengan 102,14 dikurangi 97,92, dibagi dua kali 100 kali 0,005 — hasilnya 4,21. Sama dengan modified, persis seperti teori: untuk obligasi polos tanpa opsi, effective sama dengan modified.",
        "Kesamaan ini adalah hasil yang harus kamu harapkan, bukan kebetulan yang mengejutkan. Bila lab-mu menghasilkan effective yang jauh dari modified untuk obligasi polos, ada yang salah di perhitungan harga — cek rumus PV-mu. Sebaliknya, bila suatu hari kamu menghitung obligasi callable dan effective jauh lebih kecil dari modified, itulah sinyal bahwa opsi sedang bekerja: harga tidak bisa naik bebas karena emiten akan memanggil.",
      ],
      formula: String.raw`D_{eff} = \frac{102,14 - 97,92}{2 \times 100 \times 0,005} = 4,21`,
      formulaNote: "Harga pada yield 5,5 persen adalah 102,14 dan pada yield 6,5 persen adalah 97,92 (ilustratif, obligasi 5 tahun kupon 6 persen). Interpretasi: effective duration 4,21 berarti harga berubah sekitar 4,21 persen per 1 persen perubahan yield — sama dengan modified 4,21 karena obligasi ini polos tanpa opsi.",
      tasks: [
        { id: "t1", text: "Hitung `p_up` = harga pada yield 6,5 persen dan `p_dn` = harga pada yield 5,5 persen (kupon 6, tenor 5, nominal 100)" },
        { id: "t2", text: "Hitung `effdur` = (p_dn dikurangi p_up) dibagi (2 dikali 100 dikali 0,005), cetak 2 desimal" },
      ],
      expected: "effdur=4.21",
      hints: [
        "Harga = jumlah PV kupon ditambah PV principal pada yield yang bersangkutan.",
        "p_up memakai yield 0,065; p_dn memakai yield 0,055.",
        "Gunakan loop atau rumus anuitas: kupon dikali (1 dikurangi (1+y) pangkat minus n) dibagi y, ditambah nominal dibagi (1+y) pangkat n.",
      ],
      code: {
        starter: `kupon, n, face = 6, 5, 100\n\ndef harga(y):\n    return kupon * (1 - (1+y)**-n) / y + face / (1+y)**n\n\n# TULIS KODEMU\np_up = \np_dn = \neffdur = \n\nprint(f"effdur={effdur:.2f}")`,
        lockLines: 5,
        solution: `kupon, n, face = 6, 5, 100\n\ndef harga(y):\n    return kupon * (1 - (1+y)**-n) / y + face / (1+y)**n\n\n# TULIS KODEMU\np_up = harga(0.065)\np_dn = harga(0.055)\neffdur = (p_dn - p_up) / (2 * 100 * 0.005)\n\nprint(f"effdur={effdur:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_up", value: 97.92, tol: 0.05, label: "`p_up` sekitar 97.92", msg: "Harga pada yield 6,5 persen: anuitas 5 tahun plus principal terdiskon = 97,92." },
          { kind: "equal", task: "t1", name: "p_dn", value: 102.14, tol: 0.05, label: "`p_dn` sekitar 102.14", msg: "Harga pada yield 5,5 persen = 102,14." },
          { kind: "equal", task: "t2", name: "effdur", value: 4.21, tol: 0.05, label: "`effdur` sekitar 4.21", msg: "(102,14 dikurangi 97,92) dibagi 1,0 = 4,21 — sama dengan modified untuk obligasi polos." },
          { kind: "stdout_matches", task: "t2", pattern: "effdur=4\\.21", label: "`print` menampilkan effective duration", msg: "Format 2 desimal: effdur=4.21." },
        ],
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membagi dengan 2 dikali P0 dikali Δy tetapi lupa bahwa Δy adalah 0,005 (50 basis poin), bukan 50. Basis poin dibagi 10.000 untuk menjadi desimal: 50bp = 0,005.",
      },
      quiz: [
        {
          q: "Obligasi callable: modified duration 6,0 tetapi effective duration 3,5. Penjelasan yang benar?",
          options: [
            { text: "Perhitungan salah — keduanya harus selalu sama", why: "Salah: keduanya sama hanya untuk obligasi polos. Opsi mengubah arus kas saat yield bergerak." },
            { text: "Opsi call membatasi kenaikan harga saat yield turun, sehingga sensitivitas harga sesungguhnya lebih kecil", why: "Benar: saat yield turun emiten memanggil obligasi, harga tertahan di dekat harga call — effective menangkap itu, modified tidak.", correct: true },
            { text: "Effective duration selalu lebih kecil karena rumusnya memakai harga", why: "Salah: effective bisa sama dengan modified (obligasi polos) — selisihnya berasal dari opsi, bukan dari rumus." },
            { text: "Modified duration yang benar adalah 3,5", why: "Salah: modified 6,0 tetap benar sebagai rumus — hanya saja ia menjawab pertanyaan yang salah untuk obligasi beropsi." },
          ],
        },
      ],
      reference: "Effective = (P bawah dikurangi P atas) dibagi (2 dikali P0 dikali Δy). Polos: effective = modified. Beropsi: effective yang jujur.",
    },
    {
      id: "konveksitas-menyesatkan",
      eyebrow: "Langkah 3 · Konveksitas",
      title: "Kapan duration saja menyesatkan",
      prose: [
        "Duration adalah garis singgung: aproksimasi linear pada kurva yang sebenarnya melengkung. Untuk perubahan yield kecil, garis singgung menempel pada kurva dan tebakannya akurat. Untuk perubahan yield besar, garis singgung meleset — dan arah melesetnya selalu merugikan tebakanmu bila kamu hanya memakai duration: harga aktual selalu lebih tinggi dari prediksi linear, ke dua arah.",
        "Obligasi ilustratif kita membuktikannya dengan angka. Yield naik 1 persen: harga sesungguhnya 95,90, tebakan linear 95,79 — meleset hanya 0,11. Yield naik 2 persen: harga sesungguhnya 92,01, tebakan linear 91,58 — meleset 0,44, empat kali lipat. Yield turun 2 persen: harga sesungguhnya 108,90, tebakan linear 108,42 — meleset 0,48. Polanya jelas: kesalahan linear membesar sebanding kuadrat perubahan yield, karena itulah sifat suku koreksi convexity.",
        "Inilah alasan convexity disebut asuransi dua arah: saat yield naik, ia mengurangi kerugianmu dibanding tebakan linear; saat yield turun, ia menambah keuntunganmu. Convexity 22,92 pada obligasi ilustratif kita terdengar teknis, tetapi artinya konkret: pada pergerakan 2 persen, ia menyelamatkan sekitar 0,46 poin harga. Makin panjang duration, makin besar convexity — dan makin mahal harga yang bersedia dibayar pasar untuknya.",
      ],
      formula: String.raw`\frac{\Delta P}{P} \approx -D_{mod} \times \Delta y + \frac{1}{2} C (\Delta y)^2`,
      formulaNote: "ΔP/P = persentase perubahan harga; D_mod = modified duration (4,21); Δy = perubahan yield desimal; C = convexity (22,92 — kelengkungan hubungan harga-yield). Interpretasi: suku kedua selalu positif karena Δy dikuadratkan — convexity selalu menguntungkan pemegang obligasi. Contoh angka (ilustratif): Δy naik 2 persen → −4,21 dikali 0,02 ditambah 0,5 dikali 22,92 dikali 0,0004 = −8,42 persen ditambah 0,46 persen = −7,96 persen, harga sekitar 92,04 vs harga eksak 92,01.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hedging berbasis duration saja (duration-neutral) masih terekspos convexity: bila yield bergerak besar, portofolio yang dikira netral ternyata untung atau rugi dari selisih convexity. Cek convexity mismatch sebelum menyatakan hedge selesai.",
      },
      reference: "Kesalahan duration membesar sebanding kuadrat Δy. Convexity = koreksi yang selalu menguntungkan pemegang.",
    },
    {
      id: "lab-dua-suku",
      eyebrow: "Langkah 4 · Lab: Aproksimasi Dua Suku",
      title: "Linear vs dua suku: ukur sendiri selisihnya",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Obligasi yang sama — 5 tahun, kupon 6 persen, harga 100, D_mod 4,21, convexity 22,92 — dan skenario yield naik 2 persen. Tebakan linear: harga turun 4,21 dikali 2 persen = 8,42 persen, sehingga harga menjadi 91,58. Tebakan dua suku menambahkan koreksi convexity: 0,5 dikali 22,92 dikali 0,02 kuadrat = 0,46 persen, sehingga harga menjadi 92,04.",
        "Harga eksak dari rumus PV adalah 92,01. Tebakan linear meleset 0,44; tebakan dua suku meleset 0,03. Empat belas kali lebih akurat, dengan satu suku tambahan. Inilah mengapa CFA menguji aproksimasi dua suku: ia bukan hiasan teori, melainkan alat kerja saat yield bergerak besar — persis saat keputusan paling mahal.",
        "Perhatikan juga simetrinya: bila yield turun 2 persen, tebakan linear memberi 108,42, dua suku memberi 108,88, dan harga eksak 108,90. Koreksi convexity yang sama besarnya — 0,46 poin — kini menambah keuntungan, bukan mengurangi kerugian. Satu rumus, dua arah keuntungan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `linear` = harga awal dikali (1 dikurangi D_mod dikali Δy)" },
        { id: "t2", text: "Hitung `dua_suku` = harga awal dikali (1 dikurangi D_mod dikali Δy ditambah 0,5 dikali convexity dikali Δy kuadrat), cetak keduanya" },
      ],
      expected: "linear=91.58  dua_suku=92.04",
      hints: [
        "D_mod = 4,21; convexity = 22,92; Δy = 0,02; harga awal = 100.",
        "Suku convexity: 0,5 dikali 22,92 dikali 0,02 pangkat 2 = 0,0046 (0,46 persen).",
        "linear = 100 * (1 - 4.21 * 0.02)\ndua_suku = 100 * (1 - 4.21 * 0.02 + 0.5 * 22.92 * 0.02**2)",
      ],
      code: {
        starter: `harga0, dmod, conv, dy = 100, 4.21, 22.92, 0.02\n\n# TULIS KODEMU\nlinear = \ndua_suku = \n\nprint(f"linear={linear:.2f}  dua_suku={dua_suku:.2f}")`,
        lockLines: 1,
        solution: `harga0, dmod, conv, dy = 100, 4.21, 22.92, 0.02\n\n# TULIS KODEMU\nlinear = harga0 * (1 - dmod * dy)\ndua_suku = harga0 * (1 - dmod * dy + 0.5 * conv * dy**2)\n\nprint(f"linear={linear:.2f}  dua_suku={dua_suku:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "linear", value: 91.58, tol: 0.05, label: "`linear` sekitar 91.58", msg: "100 dikali (1 dikurangi 0,0842) = 91,58. Harga eksak 92,01 — meleset 0,44." },
          { kind: "equal", task: "t2", name: "dua_suku", value: 92.04, tol: 0.05, label: "`dua_suku` sekitar 92.04", msg: "Tambah koreksi 0,46 → 92,04. Harga eksak 92,01 — meleset hanya 0,03." },
          { kind: "stdout_matches", task: "t2", pattern: "linear=91\\.58\\s+dua_suku=92\\.04", label: "`print` menampilkan keduanya", msg: "Format: linear=...  dua_suku=... ." },
        ],
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira koreksi convexity mengurangi harga saat yield turun. Suku koreksi memakai Δy kuadrat — selalu positif, ke dua arah: mengurangi rugi saat yield naik, menambah untung saat yield turun.",
      },
      reference: "Linear meleset 0,44 pada Δy 2 persen; dua suku meleset 0,03. Convexity = asuransi dua arah.",
    },
    {
      id: "key-rate-duration",
      eyebrow: "Langkah 5 · Key Rate Duration",
      title: "Yield tidak bergerak serentak: ukur per titik kurva",
      prose: [
        "Modified duration berasumsi seluruh kurva yield bergeser naik atau turun secara paralel — semua tenor bergerak sama besar. Kenyataannya kurva yield hampir tidak pernah bergerak paralel: Bank Indonesia bisa menaikkan tenor pendek sementara tenor panjang diam, atau kurva bisa mendatar sementara levelnya tetap. Portofolio yang duration-nya netral terhadap pergeseran paralel bisa tetap babak belur oleh perubahan bentuk kurva.",
        "Key rate duration memecah sensitivitas itu per titik kurva: berapa persen harga berubah bila hanya yield 2 tahun yang naik 1 persen, sementara titik lain diam — lalu ulangi untuk 5 tahun, 10 tahun, dan seterusnya. Jumlah semua key rate duration sama dengan effective duration: ia adalah effective duration yang diurai per tenor. Obligasi 5 tahun didominasi key rate 5 tahun; obligasi 30 tahun didominasi key rate 30 tahun.",
        "Implikasi praktisnya langsung: dua portofolio dengan duration total sama bisa memiliki key rate duration yang sangat berbeda. Portofolio A terkonsentrasi di tenor 10 tahun, portofolio B tersebar merata — saat kurva berputar (tenor pendek naik, panjang turun), A dan B bergerak berlawanan arah meski duration totalnya identik. Manajer yang hanya melaporkan duration total menyembunyikan risiko bentuk kurva; manajer yang melaporkan key rate duration menunjukkan di mana tepatnya ia bertaruh.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hedge yang duration-neutral tetapi key-rate-mismatch bukan hedge: pergeseran paralel aman, tetapi twist kurva (pendek naik, panjang turun) membuka kerugian. Selalu cek key rate duration sebelum menyatakan posisi netral.",
      },
      quiz: [
        {
          q: "Dua portofolio memiliki effective duration sama (5,0). Portofolio A terkonsentrasi di tenor 10 tahun, B tersebar merata di semua tenor. Kurva ber-twist: tenor pendek naik 1 persen, tenor panjang turun 1 persen. Apa yang terjadi?",
          options: [
            { text: "Keduanya bergerak sama — duration totalnya sama", why: "Salah: duration total hanya mengukur pergeseran paralel. Twist adalah perubahan bentuk, bukan level." },
            { text: "A dan B bisa bergerak berlawanan arah — key rate duration mereka berbeda meski totalnya sama", why: "Benar: jumlah key rate duration sama dengan effective duration, tetapi distribusinya per tenor berbeda — dan twist menyerang distribusi itu.", correct: true },
            { text: "B pasti rugi lebih besar karena tersebar", why: "Salah: tersebar justru berarti paparan per titik lebih kecil — tidak ada alasan B pasti rugi lebih besar." },
            { text: "Tidak ada yang bergerak — twist bukan perubahan yield", why: "Salah: twist adalah perubahan yield per tenor — harga obligasi pasti merespons." },
          ],
        },
      ],
      reference: "Key rate duration = sensitivitas harga per titik kurva. Jumlahnya = effective duration. Duration total buta terhadap bentuk kurva.",
    },
    {
      id: "strategi-kurva",
      eyebrow: "Langkah 6 · Strategi Kurva",
      title: "Bullet, barbell, ladder — dan menunggangi kurva",
      prose: [
        "Tiga cara menyusun portofolio di sepanjang kurva. Bullet: konsentrasikan semua di satu tenor menengah, misalnya seluruhnya obligasi 5 tahun. Barbell: bagi dua ekstrem — obligasi 1 tahun dan 10 tahun — tanpa tenor menengah sama sekali. Ladder: bagi rata ke semua tenor 1 sampai 5 tahun, dan gulirkan (roll) yang jatuh tempo ke ujung panjang. Ketiganya bisa dibuat dengan duration total yang sama, tetapi perilaku mereka berbeda.",
        "Perbedaan kuncinya adalah convexity. Contoh ilustratif dengan zero-coupon: bullet 5 tahun punya convexity 26,70, sedangkan barbell yang dirancang ber-duration sama (55,6 persen di 1 tahun, 44,4 persen di 10 tahun — duration keduanya 5,0) punya convexity 44,50. Barbell jauh lebih melengkung — ia untung lebih besar dari pergerakan yield besar ke arah mana pun. Harganya: yield barbell biasanya lebih rendah, karena pasar menagih premi untuk convexity itu. Tidak ada makan siang gratis — convexity dibayar dengan yield.",
        "Riding the yield curve adalah strategi berbeda: bukan soal bentuk portofolio, melainkan soal memanfaatkan kemiringan kurva. Bila kurva menanjak (yield panjang lebih tinggi dari yield pendek), beli obligasi 5 tahun di yield 5 persen (harga 104,33, ilustratif), pegang setahun hingga ia menjadi obligasi 4 tahun — dan bila kurva tidak berubah, ia kini dihargai pada yield 4 tahun sebesar 4,5 persen (harga 105,38). Total return setahun: kupon 6 ditambah capital gain 1,05, dibagi 104,33 = 6,76 persen — di atas YTM awal 5 persen. Kelebihan 1,76 poin itu adalah roll-down return. Syaratnya: kurva harus tetap menanjak dan tidak bergeser naik — bila seluruh kurva naik 1 persen, roll-down tertelan kerugian harga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira barbell selalu lebih baik karena convexity-nya lebih tinggi. Convexity dibayar dengan yield yang lebih rendah — barbell menang hanya bila volatilitas yield terealisasi lebih besar dari yang diantisipasi pasar.",
      },
      quiz: [
        {
          q: "Bullet 5 tahun vs barbell (1 tahun + 10 tahun) dengan duration total sama. Convexity barbell 44,50 vs bullet 26,70 (ilustratif). Mana yang benar?",
          options: [
            { text: "Barbell lebih untung dari pergerakan yield besar ke arah mana pun, tetapi yield-nya biasanya lebih rendah", why: "Benar: convexity lebih tinggi = asuransi dua arah lebih besar, dan pasar menagih premi berupa yield lebih rendah.", correct: true },
            { text: "Bullet selalu lebih baik karena lebih sederhana", why: "Salah: kesederhanaan bukan ukuran — bullet kalah convexity dan kalah saat volatilitas tinggi." },
            { text: "Keduanya identik karena duration-nya sama", why: "Salah: duration sama tidak berarti perilaku sama — convexity dan key rate duration mereka berbeda." },
            { text: "Barbell lebih baik tanpa biaya apa pun", why: "Salah: convexity dibayar dengan yield — tidak ada makan siang gratis." },
          ],
        },
        {
          q: "Riding the yield curve: beli obligasi 5 tahun di yield 5 persen (harga 104,33), setahun kemudian menjadi obligasi 4 tahun di yield 4,5 persen (harga 105,38), kupon 6 (ilustratif). Total return setahun?",
          options: [
            { text: "5 persen — sama dengan YTM awal", why: "Salah: itu return bila obligasi dipegang sampai maturity pada yield tetap — di sini ada roll-down gain." },
            { text: "Sekitar 6,76 persen — kupon ditambah roll-down gain mengalahkan YTM awal", why: "Benar: (105,38 ditambah 6) dibagi 104,33 dikurangi 1 = 6,76 persen. Kelebihan 1,76 poin adalah roll-down return.", correct: true },
            { text: "4,5 persen — sama dengan yield akhir", why: "Salah: 4,5 persen adalah yield obligasi 4 tahun setelah setahun, bukan return yang kamu terima." },
            { text: "11 persen — kupon ditambah capital gain penuh", why: "Salah: hitung ulang — (105,38 + 6) / 104,33 − 1 = 6,76 persen, bukan 11 persen." },
          ],
        },
      ],
      reference: "Bullet = satu tenor. Barbell = dua ekstrem, convexity tertinggi, yield terendah. Ladder = tersebar, digulirkan. Riding = manfaatkan roll-down saat kurva menanjak.",
    },
    {
      id: "jebakan-duration-sama",
      eyebrow: "Langkah 7 · Jebakan",
      title: "Duration sama, konveksitas beda: jebakan yang paling mahal",
      prose: [
        "Bayangkan dua obligasi, keduanya modified duration 4,21. Obligasi pertama adalah obligasi ilustratif kita: 5 tahun, kupon 6 persen, convexity 22,92. Obligasi kedua adalah obligasi callable dengan kupon lebih tinggi tetapi opsi call yang aktif — duration-nya juga 4,21, tetapi convexity-nya negatif: saat yield turun, harganya tertahan di harga call dan tidak ikut naik. Catatan: durasi callable umumnya lebih pendek dari obligasi polos sebanding — angka 4,21 di sini ilustratif, dipakai agar jebakan \u201cduration sama, risiko beda\u201d terlihat jelas. Laporan risiko yang hanya menampilkan duration menyatakan keduanya setara. Laporan itu salah — dan salahnya mahal.",
        "Saat yield naik 2 persen, obligasi pertama jatuh ke 92,01 (convexity menyelamatkan 0,44 dari tebakan linear). Obligasi callable kedua jatuh lebih dalam dari tebakan linearnya — negative convexity berarti kurva melengkung ke arah yang merugikan: rugi diperbesar saat yield naik, untung dipangkas saat yield turun. Pemegangnya membayar mahal untuk kupon yang lebih tinggi dengan mata uang yang tidak terlihat di laporan duration: ia menjual convexity kepada emiten.",
        "Peta keputusan penutup: pertama, jangan pernah membandingkan dua obligasi hanya dari duration — minta convexity dan effective duration. Kedua, duration panjang tanpa convexity yang sepadan adalah posisi rapuh: ia untung kecil saat benar, rugi besar saat salah. Ketiga, barbell mengalahkan bullet saat kamu yakin volatilitas akan tinggi tetapi tidak tahu arahnya — dan bullet mengalahkan barbell saat kamu yakin volatilitas akan rendah, karena kamu dibayar yield lebih tinggi untuk convexity yang tidak kamu butuhkan. Duration menjawab berapa besar nyerinya; convexity menjawab seberapa adil nyeri itu dibagi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Negative convexity (callable, MBS) adalah risiko yang tidak terlihat di duration: harga jatuh lebih dalam dari prediksi saat yield naik dan naik lebih sedikit dari prediksi saat yield turun. Selalu tanyakan convexity sebelum membeli yield tinggi.",
      },
      quiz: [
        {
          q: "Dua obligasi sama-sama D_mod 4,21. Obligasi A convexity +22,92; obligasi B (callable) convexity negatif. Yield bergerak besar 2 persen ke arah mana pun. Mana yang benar?",
          options: [
            { text: "Keduanya berperilaku sama — duration-nya sama", why: "Salah: duration hanya suku pertama. Convexity menentukan siapa yang diuntungkan pergerakan besar." },
            { text: "A selalu lebih baik dari prediksi linear; B selalu lebih buruk dari prediksi linear", why: "Benar: convexity positif selalu menguntungkan pemegang, negative convexity selalu merugikan — ke dua arah.", correct: true },
            { text: "B lebih baik karena kuponnya lebih tinggi", why: "Salah: kupon lebih tinggi adalah kompensasi untuk opsi yang dijual ke emiten — bukan keuntungan gratis." },
            { text: "A lebih buruk saat yield turun", why: "Salah: saat yield turun convexity positif menambah keuntungan di atas tebakan linear." },
          ],
        },
      ],
      reference: "Duration sama bukan berarti risiko sama. Minta convexity + effective duration. Negative convexity = rugi diperbesar, untung dipangkas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: tiga duration, convexity, key rate, strategi kurva, dan jebakan duration sama.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Obligasi 5 tahun kupon 6 persen, harga 100 pada YTM 6 persen (ilustratif). Macaulay, modified, dan effective duration-nya?",
          options: [
            { text: "Macaulay 4,47; modified 4,21; effective 4,21", why: "Benar: Macaulay 4,47 tahun dibagi 1,06 = modified 4,21; effective dari harga aktual juga 4,21 karena obligasi polos.", correct: true },
            { text: "Ketiganya 5,0 — sama dengan maturity", why: "Salah: duration sama dengan maturity hanya untuk zero-coupon. Obligasi berkupon selalu lebih pendek." },
            { text: "Macaulay 4,21; modified 4,47; effective 5,0", why: "Salah: urutannya tertukar — Macaulay selalu lebih besar dari modified (dibagi 1+y)." },
            { text: "Macaulay 6,0; modified 6,0; effective 6,0", why: "Salah: 6,0 adalah kupon, bukan duration — jangan tertukar." },
          ],
        },
        {
          q: "Yield naik 2 persen pada obligasi D_mod 4,21, convexity 22,92, harga 100 (ilustratif). Tebakan linear vs dua suku vs harga eksak?",
          options: [
            { text: "Linear 91,58; dua suku 92,04; eksak 92,01", why: "Benar: linear meleset 0,44; dua suku meleset 0,03 — empat belas kali lebih akurat.", correct: true },
            { text: "Linear 92,01; dua suku 91,58; eksak 92,04", why: "Salah: tertukar — harga eksak 92,01, dan dua suku (92,04) lebih dekat ke eksak daripada linear (91,58)." },
            { text: "Ketiganya 91,58 — convexity tidak berpengaruh", why: "Salah: koreksi convexity 0,46 poin — justru itulah yang membedakan tebakan bagus dari tebakan buruk." },
            { text: "Linear 92,04; dua suku 91,58; eksak 91,58", why: "Salah: dua suku selalu lebih dekat ke harga eksak daripada linear — koreksinya selalu ke arah yang benar." },
          ],
        },
        {
          q: "Kapan modified duration saja sudah cukup, dan kapan wajib effective duration?",
          options: [
            { text: "Modified cukup untuk obligasi polos; effective wajib untuk obligasi beropsi (callable, putable, MBS)", why: "Benar: opsi mengubah arus kas saat yield bergerak — hanya effective yang mengukur harga aktual.", correct: true },
            { text: "Modified selalu cukup — effective hanya versi lama", why: "Salah: effective justru yang lebih umum dan jujur untuk obligasi beropsi." },
            { text: "Effective wajib untuk semua obligasi", why: "Salah: untuk obligasi polos keduanya sama — modified lebih praktis dan sudah cukup." },
            { text: "Keduanya tidak pernah bisa dipakai bersamaan", why: "Salah: keduanya saling melengkapi — bandingkan keduanya untuk mendeteksi efek opsi." },
          ],
        },
        {
          q: "Barbell vs bullet dengan duration sama. Pernyataan yang benar?",
          options: [
            { text: "Barbell punya convexity lebih tinggi (44,50 vs 26,70, ilustratif) tetapi yield biasanya lebih rendah", why: "Benar: convexity dibayar dengan yield — barbell menang saat volatilitas terealisasi tinggi.", correct: true },
            { text: "Bullet punya convexity lebih tinggi karena terpusat", why: "Salah: justru penyebaran ke ekstrem yang menciptakan kelengkungan lebih besar." },
            { text: "Keduanya identik dalam segala hal", why: "Salah: duration sama, convexity dan key rate duration berbeda." },
            { text: "Barbell selalu menang tanpa biaya", why: "Salah: tidak ada makan siang gratis — premi convexity dibayar lewat yield lebih rendah." },
          ],
        },
        {
          q: "Manajer melaporkan portofolio duration-neutral. Risiko apa yang masih tersembunyi?",
          options: [
            { text: "Tidak ada — duration-neutral berarti kebal terhadap semua perubahan yield", why: "Salah: duration-neutral hanya kebal terhadap pergeseran paralel kecil — twist kurva dan pergerakan besar tetap menyerang." },
            { text: "Risiko bentuk kurva (key rate mismatch) dan risiko convexity mismatch", why: "Benar: twist kurva menyerang distribusi key rate, pergerakan besar menyerang selisih convexity.", correct: true },
            { text: "Hanya risiko gagal bayar", why: "Salah: itu risiko kredit, bukan risiko suku bunga — dan bukan satu-satunya yang tersisa." },
            { text: "Hanya risiko likuiditas", why: "Salah: likuiditas adalah risiko terpisah — risiko kurva dan convexity tetap ada meski likuiditas sempurna." },
          ],
        },
      ],
      summary: [
        "Macaulay = waktu rata-rata uang kembali; modified = sensitivitas harga obligasi polos; effective = sensitivitas dari harga aktual, wajib untuk obligasi beropsi.",
        "Duration adalah garis singgung: akurat untuk Δy kecil, meleset sebanding kuadrat Δy untuk pergerakan besar — convexity adalah koreksinya, dan selalu menguntungkan pemegang.",
        "Key rate duration mengurai sensitivitas per titik kurva; jumlahnya = effective duration. Duration total buta terhadap twist kurva.",
        "Bullet = satu tenor; barbell = dua ekstrem, convexity tertinggi, yield terendah; ladder = tersebar dan digulirkan. Riding the yield curve memanfaatkan roll-down saat kurva menanjak.",
        "Duration sama bukan berarti risiko sama: selalu minta convexity dan effective duration — negative convexity berarti rugi diperbesar, untung dipangkas.",
      ],
      next: { label: "PM-A7C — Fixed Income: Analisis Kredit & Sekuritisasi", href: "/v2/learn/pm-a7c-kredit-sekuritisasi" },
    },
  ],
};
