# HD10: Target Trial & Propensity: Kausalitas dari Data Observasional

## Tujuan
- Menjelaskan confounding by indication dan mengapa ia merajalela di data EHR/klaim.
- Merancang target trial emulation: eligibility, time zero, dan perlakuan yang jelas.
- Menjelaskan logika propensity score, matching, dan IPTW serta asumsi no-unmeasured-confounding.
- Mengenali immortal time bias dan collider bias dari DAG.

## Ringkasan
- Confounding by indication: obat diberikan ke yang paling sakit — vonis palsu default data observasional.
- Target trial emulation: tulis protokol RCT hipotetis dulu (eligibility, time zero sinkron, perlakuan jelas).
- Propensity/matching/IPTW: seimbangkan yang terukur; cek SMD < 0,1.
- Asumsi tak teruji: unconfoundedness + positivity — argumenkan, lalu E-value.
- DAG: kontrol confounder; JANGAN sentuh mediator (efek total) dan collider.
- Immortal time bias: definisi kelompok dari masa depan = waktu hantu.
- Triangulasi (multi-metode + kontrol negatif) untuk argumen kebijakan.
- Fondasi untuk HD12 (evaluasi model) dan membaca literatur observasional apa pun.
