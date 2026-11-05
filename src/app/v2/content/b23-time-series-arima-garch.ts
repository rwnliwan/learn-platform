import type { V2Lesson } from "../lib/types";

// -- Figure: return AR(1) + pita volatilitas kondisional GARCH (data lab) --
const B23_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Deret return AR(1) dengan pita volatilitas kondisional GARCH"><g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="234.1" x2="520" y2="234.1"/><line x1="60" y1="189.5" x2="520" y2="189.5"/><line x1="60" y1="145.0" x2="520" y2="145.0"/><line x1="60" y1="100.5" x2="520" y2="100.5"/><line x1="60" y1="55.9" x2="520" y2="55.9"/></g><polygon points="60.0,96.5 61.5,99.5 63.1,102.0 64.6,104.3 66.2,104.5 67.7,106.2 69.2,105.9 70.8,108.0 72.3,105.9 73.8,107.4 75.4,108.4 76.9,109.7 78.5,111.1 80.0,112.6 81.5,112.3 83.1,113.7 84.6,114.0 86.2,111.9 87.7,112.9 89.2,107.7 90.8,105.9 92.3,100.3 93.8,102.8 95.4,101.1 96.9,103.5 98.5,105.7 100.0,107.7 101.5,97.0 103.1,99.1 104.6,101.8 106.2,104.3 107.7,100.9 109.2,102.8 110.8,102.7 112.3,103.4 113.8,102.9 115.4,103.6 116.9,105.9 118.5,106.1 120.0,107.3 121.5,109.2 123.1,110.9 124.6,112.5 126.2,110.9 127.7,112.5 129.2,110.3 130.8,107.1 132.3,107.3 133.8,109.2 135.4,110.0 136.9,103.8 138.5,104.6 140.0,103.3 141.5,105.6 143.1,106.9 144.6,108.8 146.2,109.6 147.7,111.3 149.2,111.8 150.8,109.3 152.3,110.0 153.8,111.5 155.4,112.6 156.9,113.9 158.5,112.5 160.0,113.2 161.5,114.5 163.1,114.1 164.6,112.9 166.2,110.9 167.7,111.1 169.2,111.8 170.8,105.8 172.3,107.4 173.8,109.3 175.4,107.6 176.9,108.4 178.5,110.0 180.0,111.4 181.5,112.7 183.1,109.7 184.6,111.0 186.2,112.4 187.7,113.5 189.2,114.7 190.8,115.8 192.3,114.6 193.8,115.8 195.4,116.4 196.9,115.0 198.5,115.3 200.0,116.4 201.5,116.5 203.1,117.2 204.6,116.2 206.2,117.2 207.7,117.4 209.2,115.5 210.8,116.3 212.3,112.6 213.8,106.5 215.4,108.3 216.9,108.3 218.5,110.1 220.0,102.0 221.5,102.7 223.1,104.0 224.6,106.2 226.2,107.7 227.7,109.5 229.2,111.1 230.8,111.6 232.3,112.5 233.8,111.8 235.4,113.3 236.9,114.5 238.5,113.7 240.0,114.8 241.5,114.5 243.1,113.9 244.6,115.1 246.2,116.2 247.7,116.5 249.2,117.4 250.8,112.1 252.3,111.0 253.8,112.2 255.4,105.4 256.9,105.8 258.5,101.0 260.0,102.0 261.5,102.5 263.1,103.4 264.6,105.7 266.2,102.3 267.7,100.7 269.2,97.8 270.8,100.7 272.3,103.0 273.8,105.4 275.4,105.2 276.9,104.4 278.5,105.9 280.0,108.0 281.5,108.4 283.1,109.3 284.6,107.6 286.2,105.9 287.7,107.9 289.2,107.7 290.8,109.6 292.3,110.2 293.8,111.6 295.4,112.5 296.9,113.9 298.5,114.8 300.0,115.8 301.5,113.5 303.1,113.5 304.6,109.8 306.2,110.5 307.7,109.8 309.2,111.2 310.8,108.8 312.3,106.0 313.8,108.0 315.4,108.9 316.9,104.3 318.5,105.1 320.0,107.3 321.5,109.2 323.1,109.7 324.6,110.9 326.2,111.9 327.7,113.3 329.2,112.2 330.8,110.7 332.3,108.7 333.8,109.9 335.4,111.4 336.9,112.9 338.5,113.8 340.0,114.6 341.5,115.0 343.1,115.9 344.6,116.8 346.2,117.7 347.7,116.2 349.2,116.4 350.8,117.0 352.3,117.4 353.8,115.1 355.4,114.5 356.9,114.0 358.5,115.1 360.0,115.7 361.5,115.6 363.1,115.4 364.6,114.9 366.2,115.6 367.7,112.7 369.2,111.1 370.8,111.1 372.3,112.1 373.8,112.0 375.4,106.8 376.9,103.8 378.5,102.8 380.0,98.2 381.5,99.1 383.1,98.9 384.6,101.7 386.2,102.3 387.7,98.0 389.2,89.0 390.8,92.5 392.3,95.9 393.8,98.7 395.4,101.5 396.9,102.0 398.5,98.7 400.0,101.4 401.5,101.4 403.1,97.0 404.6,99.2 406.2,101.9 407.7,103.9 409.2,103.8 410.8,104.9 412.3,104.7 413.8,104.9 415.4,107.0 416.9,107.5 418.5,109.2 420.0,110.6 421.5,104.3 423.1,101.8 424.6,102.2 426.2,104.7 427.7,106.9 429.2,104.1 430.8,105.8 432.3,106.6 433.8,108.6 435.4,110.4 436.9,111.8 438.5,110.6 440.0,112.2 441.5,104.9 443.1,105.8 444.6,99.3 446.2,78.0 447.7,81.4 449.2,78.9 450.8,83.5 452.3,82.5 453.8,83.3 455.4,82.6 456.9,86.8 458.5,90.6 460.0,94.2 461.5,97.4 463.1,98.4 464.6,100.3 466.2,102.8 467.7,102.4 469.2,104.1 470.8,105.2 472.3,104.4 473.8,102.7 475.4,105.1 476.9,107.3 478.5,105.2 480.0,100.5 481.5,97.5 483.1,99.7 484.6,100.8 486.2,102.9 487.7,90.0 489.2,93.4 490.8,96.7 492.3,99.6 493.8,99.1 495.4,101.7 496.9,104.1 498.5,102.8 500.0,104.9 501.5,107.1 503.1,103.9 504.6,105.4 506.2,107.1 507.7,101.9 509.2,98.1 510.8,98.2 512.3,98.6 513.8,100.1 515.4,102.8 516.9,105.0 518.5,107.1 520.0,108.9 520.0,181.1 518.5,182.9 516.9,185.0 515.4,187.2 513.8,189.9 512.3,191.4 510.8,191.8 509.2,191.9 507.7,188.1 506.2,182.9 504.6,184.6 503.1,186.1 501.5,182.9 500.0,185.1 498.5,187.2 496.9,185.9 495.4,188.3 493.8,190.9 492.3,190.4 490.8,193.3 489.2,196.6 487.7,200.0 486.2,187.1 484.6,189.2 483.1,190.3 481.5,192.5 480.0,189.5 478.5,184.8 476.9,182.7 475.4,184.9 473.8,187.3 472.3,185.6 470.8,184.8 469.2,185.9 467.7,187.6 466.2,187.2 464.6,189.7 463.1,191.6 461.5,192.6 460.0,195.8 458.5,199.4 456.9,203.2 455.4,207.4 453.8,206.7 452.3,207.5 450.8,206.5 449.2,211.1 447.7,208.6 446.2,212.0 444.6,190.7 443.1,184.2 441.5,185.1 440.0,177.8 438.5,179.4 436.9,178.2 435.4,179.6 433.8,181.4 432.3,183.4 430.8,184.2 429.2,185.9 427.7,183.1 426.2,185.3 424.6,187.8 423.1,188.2 421.5,185.7 420.0,179.4 418.5,180.8 416.9,182.5 415.4,183.0 413.8,185.1 412.3,185.3 410.8,185.1 409.2,186.2 407.7,186.1 406.2,188.1 404.6,190.8 403.1,193.0 401.5,188.6 400.0,188.6 398.5,191.3 396.9,188.0 395.4,188.5 393.8,191.3 392.3,194.1 390.8,197.5 389.2,201.0 387.7,192.0 386.2,187.7 384.6,188.3 383.1,191.1 381.5,190.9 380.0,191.8 378.5,187.2 376.9,186.2 375.4,183.2 373.8,178.0 372.3,177.9 370.8,178.9 369.2,178.9 367.7,177.3 366.2,174.4 364.6,175.1 363.1,174.6 361.5,174.4 360.0,174.3 358.5,174.9 356.9,176.0 355.4,175.5 353.8,174.9 352.3,172.6 350.8,173.0 349.2,173.6 347.7,173.8 346.2,172.3 344.6,173.2 343.1,174.1 341.5,175.0 340.0,175.4 338.5,176.2 336.9,177.1 335.4,178.6 333.8,180.1 332.3,181.3 330.8,179.3 329.2,177.8 327.7,176.7 326.2,178.1 324.6,179.1 323.1,180.3 321.5,180.8 320.0,182.7 318.5,184.9 316.9,185.7 315.4,181.1 313.8,182.0 312.3,184.0 310.8,181.2 309.2,178.8 307.7,180.2 306.2,179.5 304.6,180.2 303.1,176.5 301.5,176.5 300.0,174.2 298.5,175.2 296.9,176.1 295.4,177.5 293.8,178.4 292.3,179.8 290.8,180.4 289.2,182.3 287.7,182.1 286.2,184.1 284.6,182.4 283.1,180.7 281.5,181.6 280.0,182.0 278.5,184.1 276.9,185.6 275.4,184.8 273.8,184.6 272.3,187.0 270.8,189.3 269.2,192.2 267.7,189.3 266.2,187.7 264.6,184.3 263.1,186.6 261.5,187.5 260.0,188.0 258.5,189.0 256.9,184.2 255.4,184.6 253.8,177.8 252.3,179.0 250.8,177.9 249.2,172.6 247.7,173.5 246.2,173.8 244.6,174.9 243.1,176.1 241.5,175.5 240.0,175.2 238.5,176.3 236.9,175.5 235.4,176.7 233.8,178.2 232.3,177.5 230.8,178.4 229.2,178.9 227.7,180.5 226.2,182.3 224.6,183.8 223.1,186.0 221.5,187.3 220.0,188.0 218.5,179.9 216.9,181.7 215.4,181.7 213.8,183.5 212.3,177.4 210.8,173.7 209.2,174.5 207.7,172.6 206.2,172.8 204.6,173.8 203.1,172.8 201.5,173.5 200.0,173.6 198.5,174.7 196.9,175.0 195.4,173.6 193.8,174.2 192.3,175.4 190.8,174.2 189.2,175.3 187.7,176.5 186.2,177.6 184.6,179.0 183.1,180.3 181.5,177.3 180.0,178.6 178.5,180.0 176.9,181.6 175.4,182.4 173.8,180.7 172.3,182.6 170.8,184.2 169.2,178.2 167.7,178.9 166.2,179.1 164.6,177.1 163.1,175.9 161.5,175.5 160.0,176.8 158.5,177.5 156.9,176.1 155.4,177.4 153.8,178.5 152.3,180.0 150.8,180.7 149.2,178.2 147.7,178.7 146.2,180.4 144.6,181.2 143.1,183.1 141.5,184.4 140.0,186.7 138.5,185.4 136.9,186.2 135.4,180.0 133.8,180.8 132.3,182.7 130.8,182.9 129.2,179.7 127.7,177.5 126.2,179.1 124.6,177.5 123.1,179.1 121.5,180.8 120.0,182.7 118.5,183.9 116.9,184.1 115.4,186.4 113.8,187.1 112.3,186.6 110.8,187.3 109.2,187.2 107.7,189.1 106.2,185.7 104.6,188.2 103.1,190.9 101.5,193.0 100.0,182.3 98.5,184.3 96.9,186.5 95.4,188.9 93.8,187.2 92.3,189.7 90.8,184.1 89.2,182.3 87.7,177.1 86.2,178.1 84.6,176.0 83.1,176.3 81.5,177.7 80.0,177.4 78.5,178.9 76.9,180.3 75.4,181.6 73.8,182.6 72.3,184.1 70.8,182.0 69.2,184.1 67.7,183.8 66.2,185.5 64.6,185.7 63.1,188.0 61.5,190.5 60.0,193.5" fill="var(--c2)" opacity="0.25"/><polyline points="60.0,145.0 61.5,138.2 63.1,146.8 64.6,164.2 66.2,165.7 67.7,176.7 69.2,162.8 70.8,130.9 72.3,146.2 73.8,157.4 75.4,143.5 76.9,137.8 78.5,138.9 80.0,156.4 81.5,152.3 83.1,138.5 84.6,161.9 86.2,162.7 87.7,186.2 89.2,193.8 90.8,210.3 92.3,189.4 93.8,198.4 95.4,171.1 96.9,157.4 98.5,156.1 100.0,198.5 101.5,190.1 103.1,173.2 104.6,159.4 106.2,184.8 107.7,179.4 109.2,186.3 110.8,186.9 112.3,148.1 113.8,163.8 115.4,157.0 116.9,134.9 118.5,150.3 120.0,150.3 121.5,146.2 123.1,144.6 124.6,164.7 126.2,155.5 127.7,129.2 129.2,162.4 130.8,139.1 132.3,139.2 133.8,153.0 135.4,114.8 136.9,111.2 138.5,148.9 140.0,145.8 141.5,134.1 143.1,142.1 144.6,130.9 146.2,137.7 147.7,129.4 149.2,111.8 150.8,137.1 152.3,136.7 153.8,147.8 155.4,144.6 156.9,163.2 158.5,165.3 160.0,160.3 161.5,140.5 163.1,124.6 164.6,154.0 166.2,164.0 167.7,145.4 169.2,178.4 170.8,174.1 172.3,164.3 173.8,134.1 175.4,125.6 176.9,139.3 178.5,148.1 180.0,151.0 181.5,124.1 183.1,140.0 184.6,147.2 186.2,140.5 187.7,144.2 189.2,147.5 190.8,162.8 192.3,155.8 193.8,158.0 195.4,136.1 196.9,129.9 198.5,136.3 200.0,130.2 201.5,141.0 203.1,128.0 204.6,134.9 206.2,130.8 207.7,154.3 209.2,145.5 210.8,169.5 212.3,192.6 213.8,179.5 215.4,182.2 216.9,164.3 218.5,117.4 220.0,146.3 221.5,159.0 223.1,149.2 224.6,137.9 226.2,144.1 227.7,148.1 229.2,135.0 230.8,130.3 232.3,153.0 233.8,151.1 235.4,148.1 236.9,162.9 238.5,151.7 240.0,162.0 241.5,140.4 243.1,139.2 244.6,140.2 246.2,150.6 247.7,150.1 249.2,175.6 250.8,182.0 252.3,161.0 253.8,189.5 255.4,154.9 256.9,185.2 258.5,152.4 260.0,167.7 261.5,142.1 263.1,140.5 264.6,172.5 266.2,134.8 267.7,107.0 269.2,123.7 270.8,138.3 272.3,144.3 273.8,163.9 275.4,134.5 276.9,149.7 278.5,148.8 280.0,162.0 281.5,166.6 283.1,180.8 284.6,142.9 286.2,146.8 287.7,128.2 289.2,134.7 290.8,151.1 292.3,154.3 293.8,159.9 295.4,153.8 296.9,156.1 298.5,156.2 300.0,171.9 301.5,173.8 303.1,136.3 304.6,151.6 306.2,167.1 307.7,152.3 309.2,125.6 310.8,159.7 312.3,157.9 313.8,164.4 315.4,188.4 316.9,156.1 318.5,152.1 320.0,147.9 321.5,160.2 323.1,146.1 324.6,154.8 326.2,153.3 327.7,167.5 329.2,178.4 330.8,142.2 332.3,152.5 333.8,144.4 335.4,145.2 336.9,152.2 338.5,157.2 340.0,142.8 341.5,148.2 343.1,149.1 344.6,147.2 346.2,130.2 347.7,126.4 349.2,128.3 350.8,142.9 352.3,162.8 353.8,141.5 355.4,128.2 356.9,137.1 358.5,132.2 360.0,125.8 361.5,121.3 363.1,117.1 364.6,135.1 366.2,116.8 367.7,148.2 369.2,132.3 370.8,129.0 372.3,121.0 373.8,99.6 375.4,89.4 376.9,135.2 378.5,174.7 380.0,143.7 381.5,167.5 383.1,158.8 384.6,135.1 386.2,174.2 387.7,212.1 389.2,178.0 390.8,163.6 392.3,162.2 393.8,154.4 395.4,169.4 396.9,192.1 398.5,177.1 400.0,185.5 401.5,205.1 403.1,168.9 404.6,160.8 406.2,145.7 407.7,165.7 409.2,171.0 410.8,180.6 412.3,184.2 413.8,164.6 415.4,171.7 416.9,154.3 418.5,144.5 420.0,109.9 421.5,152.3 423.1,130.2 424.6,138.0 426.2,141.1 427.7,170.3 429.2,169.6 430.8,145.2 432.3,146.7 433.8,144.5 435.4,149.8 436.9,128.7 438.5,135.6 440.0,175.5 441.5,177.2 443.1,202.8 444.6,254.0 446.2,228.1 447.7,152.5 449.2,147.9 450.8,182.8 452.3,197.1 453.8,141.4 455.4,137.9 456.9,139.3 458.5,143.1 460.0,142.9 461.5,124.5 463.1,119.8 464.6,125.1 466.2,155.0 467.7,140.1 469.2,156.1 470.8,129.9 472.3,161.7 473.8,157.9 475.4,152.9 476.9,174.7 478.5,128.6 480.0,102.7 481.5,130.6 483.1,118.9 484.6,121.0 486.2,185.5 487.7,162.4 489.2,157.0 490.8,150.2 492.3,172.6 493.8,167.7 495.4,162.5 496.9,131.2 498.5,129.7 500.0,135.9 501.5,110.6 503.1,135.8 504.6,147.2 506.2,180.7 507.7,132.6 509.2,115.0 510.8,105.5 512.3,105.8 513.8,119.0 515.4,124.9 516.9,138.0 518.5,144.6 520.0,143.8" fill="none" stroke="var(--c1)" stroke-width="1.2"/><text x="520" y="24" text-anchor="end" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">pita = ±2·σ_t (volatilitas kondisional)</text></svg>`;

export const b23: V2Lesson = {
  slug: "b23-time-series-arima-garch",
  track: "Probabilitas",
  module: "Deret Waktu",
  title: "Time-Series Terapan: Stationarity, ARIMA, dan GARCH",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rata-rata nol, risiko tidak nol — model yang buta volatilitas",
      prose: [
        "Meja risiko sebuah sekuritas memakai model sederhana untuk return harian portofolio: return besok = rata-rata historis (mendekati nol) + noise dengan volatilitas KONSTAN 1,2% per hari. Value-at-Risk 99% pun dihitung dari angka itu: konstan, rapi, menenangkan. Lalu datang dua minggu di mana pasar bergejolak — return harian melompat ±3–4%. Model tetap berkata 'VaR aman', karena volatilitasnya konstan 1,2% — ia tidak punya konsep 'pasar sedang panik'. Kerugian menembus VaR 6 kali dalam 10 hari. Sesuatu yang 'seharusnya' terjadi sekali per 100 hari terjadi 6 kali dalam 2 minggu.",
        "Twist-nya: rata-rata return memang tetap nol — model tidak salah soal rata-rata. Yang salah adalah asumsi yang tak pernah ditulis: bahwa noise-nya berperilaku SAMA setiap hari. Kenyataannya volatilitas BERGEROMBOL: hari tenang diikuti hari tenang, hari panik diikuti hari panik. Model merata-ratakan masa tenang dan masa panik menjadi satu angka 1,2% — kebohongan rapi yang sama seperti di lesson HMM, tetapi kali ini solusinya bukan rezim diskret melainkan volatilitas yang berevolusi kontinu: GARCH.",
        "Lesson ini tentang tiga fondasi deret waktu terapan: stationarity (syarat agar statistik masa lalu relevan untuk masa depan), ARIMA (memodelkan LEVEL deret: tren dan memori), dan GARCH (memodelkan VOLATILITAS yang bergerombol). Tiga serangkai yang wajib dikuasai sebelum menyentuh data keuangan berfrekuensi harian — karena hampir semua deret keuangan melanggar asumsi 'identik' dari statistik klasik.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "VaR, expected shortfall, dan margin semuanya fungsi dari volatilitas. Volatilitas konstan = risiko yang salah ukur tepat saat pengukuran paling dibutuhkan (krisis). GARCH adalah cara industri membuat estimasi risiko ADAPTIF: ia membesar otomatis saat pasar panik dan mengecil saat tenang — tanpa perlu ada yang menekan tombol.",
      },
      reference: "Volatilitas bergerombol → asumsi konstan runtuh → butuh model volatilitas kondisional (GARCH).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan stationarity lemah dan menguji indikasinya; (2) melakukan differencing untuk deret bertren; (3) membaca ACF/PACF untuk mengusulkan order AR/MA; (4) menaksir AR(1) via OLS dan menginterpretasikan φ; (5) menghitung varians kondisional GARCH(1,1) secara rekursif dan menjelaskan volatility clustering.",
        "Rutenya: cerita, bekal ringkas, tiga konsep (stationarity & differencing; ARIMA & ACF/PACF; GARCH), lab Pyodide (uji stasioneritas + fit AR(1) + rekursi GARCH pada 300 return sintetis), chart deret + pita volatilitas dengan panduan baca, peta keputusan, mini-case VaR, kuis, rangkuman. Estimasi 58 menit; lab-nya sekitar 15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Proses stokastik (dari B15): deret waktu = satu realisasi dari proses acak; mean μ_t = E[y_t] dan varians bisa BERUBAH terhadap t. OLS: menaksir koefisien dengan meminimalkan jumlah kuadrat residual — dipakai di lab untuk AR(1). Intuisi yang dibawa: bila sifat statistik deret berubah-ubah terhadap waktu, maka rata-rata historis bukan ramalan yang sah untuk besok.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: stationarity = 'aturan main tidak berubah'. Melempar dadu adil 1000x = stasioner (peluang tiap sisi tetap 1/6). Harga saham yang tren naik = tidak stasioner (rata-ratanya berjalan). Semua statistik klasik mengasumsikan dadu, bukan harga saham — maka langkah pertama analisis deret waktu SELALU: stasionerkah ini?",
      ],
      reference: "Bekal: proses stokastik (B15) + OLS. Pertanyaan pertama deret waktu: stasioner atau tidak?",
    },
    {
      id: "konsep-stasioner",
      eyebrow: "Langkah 3 · Konsep",
      title: "Stationarity — Si Penjaga Aturan Main",
      prose: [
        "Definisi: deret STASIONER LEMAH bila tiga hal KONSTAN terhadap waktu: (1) mean E[y_t] = μ; (2) varians Var(y_t) = σ²; (3) autokovarians Cov(y_t, y_{t−k}) hanya tergantung lag k, bukan t. Intinya: statistik yang kamu hitung dari masa lalu tetap berlaku untuk masa depan — syarat agar 'belajar dari data historis' menjadi sah.",
        "Kepribadiannya: stationarity seperti wasit yang memastikan pertandingan dimainkan dengan aturan yang sama dari menit pertama sampai akhir. Deret bertren = wasit yang diam-diam menggeser gawang tiap 10 menit; deret dengan volatilitas meledak = wasit yang mengganti bola dengan bola api di babak kedua. Statistik apa pun yang kamu hitung dari 'pertandingan' seperti itu — rata-rata, korelasi, VaR — adalah rata-rata dari hal-hal yang tidak sebanding. Uji stasioneritas = mengecek wasitnya jujur sebelum mempercayai papan skor.",
        "Kapan memakai & apa obatnya: SELALU cek dulu sebelum modeling. Obat deret tak-stasioner: DIFFERENCING — analisis Δy_t = y_t − y_{t−1} (perubahan), bukan y_t (level). Harga saham tak-stasioner (random walk) → return (differencing) ≈ stasioner. Contoh angka: harga 100, 102, 101, 105 → return 2%, −0,98%, +3,96%. Aturan praktis: tren linear → differencing sekali (d=1, itu huruf 'I' pada ARIMA: Integrated); tren kuadratik → dua kali. Jangan over-differencing: mendifferensiasi deret yang SUDAH stasioner justru menyuntikkan autokorelasi negatif artifisial.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: korelasi tinggi dua deret tak-stasioner = hubungan nyata",
        type: "pitfall",
        body: "Yang benar: dua random walk independen yang sama-sama tren naik akan BERKORELASI TINGGI secara spurious (regresi palsu Granger-Newbold) — korelasinya nyata secara angka, palsu secara makna. Obatnya: uji kointegrasi bila memang ada teori hubungan jangka panjang, atau bekerjalah pada differencing-nya. Korelasi tanpa stationarity = fatamorgana.",
      },
      hints: [
        "💡 Intuisi: uji cepat 'kantong' sebelum uji formal (ADF): belah deret jadi dua paruh, bandingkan mean dan varians. Beda jauh = tidak stasioner (inilah yang dilakukan lab). Uji formal ADF/KPSS menyusul setelah indikasi — jangan langsung percaya satu angka uji tanpa melihat plotnya.",
      ],
      reference: "Stasioner lemah: mean, varians, autokovarians konstan. Tak-stasioner → differencing (d).",
    },
    {
      id: "konsep-arima",
      eyebrow: "Langkah 4 · Konsep",
      title: "ARIMA & ACF/PACF — Si Pembaca Memori Pasar",
      prose: [
        "Definisi: ARIMA(p,d,q) = AutoRegressive (p: y_t dipengaruhi p nilai masa lalunya) + Integrated (d: differencing agar stasioner) + Moving Average (q: y_t dipengaruhi q guncangan masa lalu). AR(1) murni: y_t = c + φ·y_{t−1} + ε_t. Syarat stasioner AR(1): |φ| < 1 — memori MELURUH; φ = 1 = random walk (tak-stasioner); |φ| > 1 = meledak.",
        "Kepribadiannya: ARIMA seperti detektif yang menginterogasi MASA LALU deret. ACF (autocorrelation function) = 'apakah hari ini mirip 5 hari lalu?' untuk tiap lag. PACF (partial ACF) = 'apakah kemiripan itu LANGSUNG, atau hanya lewat perantara hari-hari di antaranya?' Pola sidik jarinya terkenal: AR(p) → PACF terputus setelah lag p, ACF meluruh perlahan; MA(q) → sebaliknya. Membaca ACF/PACF = membaca sidik jari sebelum memilih senjata.",
        "Kapan memakai: memodelkan LEVEL deret yang stasioner (atau sudah di-differencing): suku bunga, spread kredit, inflasi inti. Contoh angka: AR(1) dengan φ = 0,6, c = 0 pada return: ramalan 1-langkah y_{t+1} = 0,6·y_t. Bila hari ini +2%, ramalan besok +1,2% — memori 60% bertahan sehari, lalu meluruh: dua hari lagi 0,72%, tiga hari 0,43%... Inilah arti φ: KECEPATAN LUPA pasar. φ dekat 1 = pasar pendendam (guncangan awet); φ dekat 0 = pasar pelupa.",
      ],
      formula: String.raw`y_t = c + \phi_1 y_{t-1} + \cdots + \phi_p y_{t-p} + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \cdots + \theta_q \varepsilon_{t-q}`,
      formulaNote: "y_t = nilai deret; φ_i = koefisien autoregressive (pengaruh masa lalu y); θ_j = koefisien moving average (pengaruh guncangan masa lalu ε); ε_t = guncangan tak terduga (white noise); d = berapa kali differencing (tidak tampil di rumus, dilakukan dulu). Contoh AR(1): y_t = 0,6·y_{t−1} + ε_t — ramalan besok = 60% dari hari ini. Syarat stasioner: |φ| < 1.",
      tasks: [],
      note: {
        title: "🚨 Mitos: order (p,d,q) bisa ditebak dari R² training",
        type: "pitfall",
        body: "Yang benar: menambah p/q SELALU memperbaiki fit training (parameter lebih banyak) — R² training bukan penilai model deret waktu. Pilih order dengan AIC/BIC (menghukum kompleksitas) + validasi out-of-sample bergulir (rolling forecast). ARIMA(5,1,5) yang 'sempurna' di training dan hancur di validasi = overfitting berjas rapi.",
      },
      hints: [
        "💡 Intuisi: mulai dari yang sederhana — AR(1) atau ARMA(1,1) sering mengalahkan monster berparameter banyak di data keuangan. Prinsip parsimoni deret waktu: 'model terbaik adalah yang paling sederhana yang residualnya sudah white noise'. Cek residual dengan Ljung-Box, bukan dengan R².",
      ],
      reference: "AR(p): PACF cut-off di p. MA(q): ACF cut-off di q. Pilih order via AIC/BIC + rolling forecast.",
    },
    {
      id: "konsep-garch",
      eyebrow: "Langkah 5 · Konsep",
      title: "GARCH — Si Penjaga yang Tidak Pernah Tidur",
      prose: [
        "Definisi: GARCH(1,1) memodelkan VARIANS KONDISIONAL (volatilitas yang berlaku HARI INI, bukan rata-rata historis): σ²_t = ω + α·r²_{t−1} + β·σ²_{t−1}. Tiga suku: ω = lantai volatilitas; α = reaksi terhadap GUNCANGAN kemarin (r² besar → volatilitas hari ini melonjak); β = PERSISTENSI (volatilitas kemarin terbawa ke hari ini). Syarat stasioner: α + β < 1.",
        "Kepribadiannya: GARCH seperti satpam mal yang menyesuaikan kewaspadaan. ARIMA mengatur 'berapa ramalan penjualannya' (level); GARCH mengatur 'berapa satpam disiagakan' (risiko). Setelah keributan kemarin (r² besar), satpam menambah personel hari ini (α). Bila mal memang rawan (β besar), kewaspadaan turun perlahan — butuh berminggu-minggu kembali normal. ω adalah jumlah satpam minimum yang selalu jaga walau mal sepi. Model volatilitas konstan = mal dengan jumlah satpam yang sama setiap hari, entah sedang ada konser atau tidak.",
        "Kapan memakai: deret dengan VOLATILITY CLUSTERING — return saham, FX, kripto, komoditas. Hampir semua deret keuangan harian menunjukkan ini (efek ARCH ditemukan Engle 1982 pada inflasi Inggris; Bollerslev menggeneralisasi 1986). Contoh angka (parameter lab): ω = 0,02, α = 0,12, β = 0,85. Varians jangka panjang = ω/(1−α−β) = 0,02/0,03 ≈ 0,67. Setelah guncangan r² = 4 (return ±2): σ² besok = 0,02 + 0,12×4 + 0,85×0,67 ≈ 1,07 — naik 60% dalam sehari! Lalu meluruh dengan kecepatan (α+β) = 0,97 per hari — half-life ≈ ln(0,5)/ln(0,97) ≈ 23 hari. Tiga minggu untuk tenang kembali — mirip perilaku krisis sungguhan.",
      ],
      formula: String.raw`\sigma^2_t = \omega + \alpha r^2_{t-1} + \beta \sigma^2_{t-1}, \qquad \alpha + \beta < 1`,
      formulaNote: "σ²_t = varians kondisional hari t (risiko yang BERLAKU hari ini); ω = komponen konstan (lantai); α = bobot guncangan kemarin r²_{t−1} (reaktivitas); β = bobot varians kemarin (persistensi); syarat α+β<1 agar varians tak meledak. Contoh: ω=0,02, α=0,12, β=0,85 → setelah r²=4: σ² = 0,02+0,48+0,57 ≈ 1,07 (naik 60% sehari); half-life ≈ 23 hari.",
      tasks: [],
      note: {
        title: "🚨 Mitos: GARCH meramal ARAH pasar",
        type: "pitfall",
        body: "Yang benar: GARCH memodelkan BESAR guncangan, bukan ARAHNYA. Ia berkata 'besok berisik' — bukan 'besok naik'. Memakai GARCH untuk directional trading = memakai termometer sebagai kompas. Pasangannya yang benar: ARIMA (arah/level) + GARCH (lebar/risiko) — dua model untuk dua pertanyaan berbeda.",
      },
      hints: [
        "💡 Intuisi: α + β mengukur 'daya ingat' volatilitas. α+β = 0,5 → pasar cepat lupa (tenang dalam hitungan hari); 0,97 → pasar pendendam (krisis membekas berminggu-minggu); = 1 → IGARCH, guncangan permanen (awas: mungkin tanda model salah spesifikasi).",
      ],
      reference: "GARCH = volatilitas kondisional: ω lantai + α·guncangan² kemarin + β·volatilitas kemarin. Syarat α+β<1.",
    },
    {
      id: "lab-deret",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bedah deret sampai ke volatilitasnya",
      prose: [
        "Waktunya jadi analis deret waktu. Data di bawah mensimulasikan 300 return harian: AR(1) dengan φ = 0,6 dan inovasi GARCH(1,1) (ω = 0,02, α = 0,12, β = 0,85). Tugasmu tiga lapis: (t1) uji indikasi stasioneritas — bandingkan mean dan varians dua paruh; (t2) taksir φ via OLS (regresi y_t pada y_{t−1}); (t3) hitung varians kondisional GARCH secara rekursif dari RESIDUAL AR(1)-mu (bukan dari inovasi sejati yang tak terlihat!).",
        "Coba: setelah lolos, ubah φ pembangkit dari 0,6 menjadi 1,0 (random walk). Apa yang terjadi pada uji paruh dan phi_hat? Itulah beda deret stasioner vs random walk — terlihat langsung di angka, bukan sekadar teori.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `m1`, `m2`, `v1`, `v2` (mean/varians dua paruh) dan flag `stasioner`" },
        { id: "t2", text: "Taksir `phi_hat` via OLS: Σ(y_t·y_{t−1}) / Σ(y_{t−1}²)" },
        { id: "t3", text: "Hitung `s2` (varians kondisional GARCH) rekursif dari residual AR(1)" },
      ],
      requires: ["numpy"],
      expected: "m1=-0.2386 m2=-0.1879 v1=0.4218 v2=0.6706\nstasioner_indikasi=True\nphi_hat=0.6308\ns2_last=0.3676",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(7)
T = 300
omega, alpha, beta = 0.02, 0.12, 0.85
# Bangkitkan return AR(1) dengan inovasi GARCH(1,1) (JANGAN UBAH)
sig2 = np.empty(T); r = np.empty(T)
sig2[0] = omega / (1 - alpha - beta)
r[0] = np.sqrt(sig2[0]) * rng.normal()
for t in range(1, T):
    sig2[t] = omega + alpha * r[t - 1] ** 2 + beta * sig2[t - 1]
    r[t] = np.sqrt(sig2[t]) * rng.normal()
y = np.empty(T); y[0] = r[0]
for t in range(1, T):
    y[t] = 0.6 * y[t - 1] + r[t]

# TULIS KODEMU
m1 = ...
m2 = ...
v1 = ...
v2 = ...
stasioner = ...
phi_hat = ...
resid = ...
s2 = ...
s2[0] = ...
for t in range(1, T - 1):
    s2[t] = ...
s2_last = ...
print(f"m1={m1:.4f} m2={m2:.4f} v1={v1:.4f} v2={v2:.4f}")
print(f"stasioner_indikasi={stasioner}")
print(f"phi_hat={phi_hat:.4f}")
print(f"s2_last={s2[-1]:.4f}")`,
        lockLines: 15,
        solution: `import numpy as np
rng = np.random.default_rng(7)
T = 300
omega, alpha, beta = 0.02, 0.12, 0.85
# Bangkitkan return AR(1) dengan inovasi GARCH(1,1) (JANGAN UBAH)
sig2 = np.empty(T); r = np.empty(T)
sig2[0] = omega / (1 - alpha - beta)
r[0] = np.sqrt(sig2[0]) * rng.normal()
for t in range(1, T):
    sig2[t] = omega + alpha * r[t - 1] ** 2 + beta * sig2[t - 1]
    r[t] = np.sqrt(sig2[t]) * rng.normal()
y = np.empty(T); y[0] = r[0]
for t in range(1, T):
    y[t] = 0.6 * y[t - 1] + r[t]

# TULIS KODEMU
m1 = float(y[:T // 2].mean())
m2 = float(y[T // 2:].mean())
v1 = float(y[:T // 2].var())
v2 = float(y[T // 2:].var())
stasioner = abs(m1 - m2) < 0.3 and 0.5 < v1 / v2 < 2.0
phi_hat = float((y[1:] * y[:-1]).sum() / (y[:-1] ** 2).sum())
resid = y[1:] - phi_hat * y[:-1]
s2 = np.empty(T - 1)
s2[0] = resid.var()
for t in range(1, T - 1):
    s2[t] = omega + alpha * resid[t - 1] ** 2 + beta * s2[t - 1]
s2_last = float(s2[-1])
print(f"m1={m1:.4f} m2={m2:.4f} v1={v1:.4f} v2={v2:.4f}")
print(f"stasioner_indikasi={stasioner}")
print(f"phi_hat={phi_hat:.4f}")
print(f"s2_last={s2[-1]:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "m1", value: -0.2386, tol: 0.005, label: "`m1` ≈ −0,24", msg: "Mean paruh pertama deret." },
          { kind: "equal", task: "t1", name: "v2", value: 0.6706, tol: 0.005, label: "`v2` ≈ 0,67", msg: "Varians paruh kedua deret." },
          { kind: "stdout_matches", task: "t1", label: "Indikasi stasioner", msg: "Mean/varians dua paruh cukup dekat.", pattern: "stasioner_indikasi=True" },
          { kind: "equal", task: "t2", name: "phi_hat", value: 0.6308, tol: 0.02, label: "`phi_hat` ≈ 0,63", msg: "OLS AR(1): Σ(y_t·y_{t−1})/Σ(y_{t−1}²). Dekat nilai sejati 0,6." },
          { kind: "defined", task: "t3", name: "s2", label: "`s2` terdefinisi", msg: "Varians kondisional GARCH dari residual." },
          { kind: "equal", task: "t3", name: "s2_last", value: 0.3676, tol: 0.01, label: "`s2_last` ≈ 0,37", msg: "Nilai terakhir rekursi GARCH(1,1)." },
        ],
      },
      hints: [
        "💡 Residual untuk GARCH = y[1:] − phi_hat·y[:-1] — sisa yang TIDAK dijelaskan AR(1). Memakai inovasi sejati 'r' adalah curang: di dunia nyata r tidak pernah terlihat. GARCH selalu dipasang pada residual model mean.",
        "💡 s2[0] diinisialisasi dengan varians residual (unconditional) — pilihan standar yang jujur. Jangan inisialisasi 0: ia membuat awal rekursi bias rendah secara artifisial.",
      ],
      reference: "Uji paruh → indikasi; OLS → φ; residual → rekursi GARCH σ²_t = ω + α·r²_{t−1} + β·σ²_{t−1}.",
    },
    {
      id: "chart-band",
      eyebrow: "Langkah 7 · Chart",
      title: "Melihat volatilitas yang bergerombol",
      prose: [
        "Chart di bawah memplot 300 return lab-mu (garis) beserta pita ±2·σ_t — dua kali volatilitas kondisional GARCH sejati (area).",
        "Cara membaca: garis = return harian (level, berosilasi di sekitar nol); lebar pita vertikal = ketidakpastian yang BERLAKU hari itu. Perhatikan pita TIDAK sejajar: ada episode pita menyempit (hari-hari tenang beruntun) dan episode pita melebar (setelah guncangan besar) — inilah volatility clustering yang terlihat mata telanjang.",
        "Interpretasi: model volatilitas konstan akan menggambar pita SEJAJAR dengan lebar = 2×1,2% setiap hari — ia buta terhadap pengelompokan ini. Akibatnya: di masa tenang ia terlalu konservatif (VaR kelebaran, modal menganggur), di masa panik ia terlalu berani (VaR kesempitan, jebol beruntun seperti di cerita pembuka). Pita GARCH menyelesaikan keduanya sekaligus: menyempit saat tenang, melebar otomatis setelah guncangan — tanpa ada yang menekan tombol. Pelajaran chart: untuk data keuangan, yang penting bukan hanya DI MANA garisnya, melainkan SEBERAPA LEBAR pitanya hari ini.",
      ],
      figure: {
        svg: B23_SVG,
        alt: "Deret return 300 hari dengan pita volatilitas kondisional yang melebar setelah guncangan besar dan menyempit saat tenang.",
        caption: "Return AR(1)-GARCH: pita ±2σ_t melebar setelah guncangan, menyempit saat tenang (data sintetis lab).",
      },
      tasks: [],
      reference: "Pita sejajar = volatilitas konstan (buta rezim). Pita adaptif = GARCH.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Model apa untuk deret apa?",
      prose: [
        "Empat skenario pemilihan model:",
        "Skenario 1 — Deret bertren/drift (harga saham, GDP nominal). → Differencing dulu (d≥1), baru ARMA pada return/perubahan. Alasan: memodelkan level yang random walk = regresi palsu; yang bisa dimodelkan adalah perubahannya.",
        "Skenario 2 — Deret stasioner dengan memori pada LEVEL (suku bunga, spread, inflasi inti). → AR/ARMA. Alasan: pertanyaannya 'besok berapa' — model mean yang tepat; volatilitas nomor dua.",
        "Skenario 3 — Return aset keuangan: mean ≈ 0 tetapi volatilitas bergerombol. → GARCH untuk risiko (sering tanpa AR, atau AR(1)+GARCH seperti lab). Alasan: yang bisa diprediksi dari return bukanlah arahnya, melainkan LEBAR kisarannya — dan itulah yang dibutuhkan VaR.",
        "Skenario 4 — Musiman kuat (penjualan ritel, trafik). → SARIMA / dekomposisi musiman dulu. Alasan: pola kalender mendominasi autokorelasi; ARIMA non-musiman akan 'menemukan' memori palsu yang sebenarnya musiman.",
        "Aturan praktis 10 detik: tren → differencing; memori di level → AR; berisik bergerombol → GARCH; musiman → tangani musimnya dulu. Selalu: plot dulu, uji stasioner, baru pilih senjata.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: ARIMA untuk meramal return saham harian",
        type: "pitfall",
        body: "Return harian ≈ white noise untuk LEVEL-nya (φ ≈ 0) — ARIMA tidak menemukan apa-apa karena memang tidak ada yang bisa ditemukan pada arahnya. Yang bisa dimodelkan adalah VOLATILITASNYA (GARCH). Memaksa ARIMA(5,1,5) pada return = overfitting pada noise, lalu heran kenapa live trading hancur. Tanyakan dulu: 'apa yang bisa diprediksi dari deret ini?' — untuk return, jawabannya hampir selalu 'risikonya, bukan arahnya'.",
      },
      reference: "Level bermemori → AR; volatilitas bergerombol → GARCH; return harian → jangan harapkan AR.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "VaR yang jebol 6 kali dalam 10 hari",
      prose: [
        "Skenario (sintetis, untuk latihan): Desk trading memakai VaR 99% 1-hari dari volatilitas konstan σ = 1,2% (dari 250 hari historis). Posisi Rp100 miliar → VaR = 2,33 × 1,2% × Rp100 M ≈ Rp2,8 M. Dua minggu pasar bergejolak: kerugian harian −Rp3,1 M, −Rp4,2 M, −Rp2,9 M... total 6 pelanggaran dalam 10 hari. Ekspektasi: 1% × 10 = 0,1 pelanggaran. Tim kuantitatif mengusulkan GARCH(1,1): setelah guncangan pertama, σ_t naik ke 2,6% → VaR hari berikutnya Rp6,1 M. Pertanyaan analisis: (1) Mengapa VaR konstan jebol beruntun? (2) Apakah GARCH 'menyelamatkan' — buktikan dengan angka. (3) Apa yang TIDAK diselesaikan GARCH?",
        "Pembahasan: (1) Volatilitas bergerombol: setelah hari −3%, distribusi besok BUKAN distribusi historis rata-rata — ia distribusi 'masa panik' dengan σ ≈ 2,5–3%. VaR konstan mengasumsikan setiap hari diundi dari topi yang sama; krisis mengganti topinya. (2) Dengan σ_t = 2,6%, VaR = 2,33 × 2,6% × Rp100 M ≈ Rp6,1 M — kerugian −Rp4,2 M TIDAK lagi pelanggaran. Dari 6 pelanggaran menjadi ~1 (yang −Rp3,1 M di hari pertama sebelum GARCH sempat bereaksi — lag 1 hari adalah harga yang wajar). Backtest: pelanggaran turun dari 60% ke ~10% harian... masih di atas 1%, tetapi sudah dalam orde yang benar dan — penting — TIDAK BERGEROMBOL. (3) GARCH tidak meramal ARAH dan tidak menangkap LOMPATAN (jump): bila pasar gap −8% overnight karena berita, tidak ada model volatilitas kontinu yang memprediksinya. Untuk itu butuh stress test & skenario — VaR (apa pun modelnya) bukan alat untuk ekor ekstrem.",
        "Catatan: angka Rp2,8 M vs Rp6,1 M menunjukkan fungsi GARCH yang sebenarnya — bukan 'model lebih akurat', melainkan 'rem yang mengencang otomatis saat jalan licin'. Desk yang memakai VaR adaptif tidak perlu rapat darurat untuk menaikkan limit manual setiap kali pasar panik; modelnya sudah melakukannya semalam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator (Basel) mewajibkan backtesting VaR dengan 'traffic light': terlalu banyak pelanggaran = penalti modal (multiplier naik). VaR konstan di masa krisis = lampu merah = modal terkunci lebih besar tepat saat modal paling mahal. GARCH bukan soal elegansi statistik — ia soal modal yang tidak dibuang percuma dan pelanggaran yang tidak bergerombol.",
      },
      reference: "VaR adaptif = σ_t dari GARCH × kuantil. Backtest: pelanggaran sedikit DAN tidak bergerombol.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Stasioner lemah = mean, varians, autokovarians konstan; tak-stasioner → differencing (d).",
        "AR(p): PACF terputus di lag p; MA(q): ACF terputus di lag q; pilih order via AIC/BIC + rolling forecast.",
        "AR(1) stasioner bila |φ| < 1; φ = kecepatan lupa pasar; ramalan = φ × nilai kini.",
        "GARCH(1,1): σ²_t = ω + α·r²_{t−1} + β·σ²_{t−1}; α+β < 1; GARCH memodelkan LEBAR (risiko), bukan ARAH.",
        "Return harian: jangan harapkan AR pada arahnya; VaR adaptif = kuantil × σ_t GARCH; ekor ekstrem butuh stress test.",
      ],
      quiz: [
        {
          q: "Deret harga saham menunjukkan tren naik jelas selama 2 tahun. Langkah pertama yang benar sebelum ARMA?",
          options: [
            { text: "Differencing (d=1): model return/perubahannya, bukan levelnya", why: "Benar: level harga ≈ random walk (tak-stasioner); return-nya yang bisa dimodelkan.", correct: true },
            { text: "Langsung ARMA(2,2) pada level harga", why: "Salah: ARMA mengasumsikan stasioner; pada random walk ia menghasilkan regresi palsu." },
            { text: "Ambil logaritma saja, cukup", why: "Salah: log menstabilkan VARIANS, bukan menghilangkan TREN — tren log-harga tetap tak-stasioner." },
            { text: "Buang tren dengan regresi linear terhadap waktu lalu ARMA pada residual", why: "Salah (untuk harga): detrending cocok untuk tren DETERMINISTIK; tren harga bersifat STOKASTIK — differencing yang tepat." },
          ],
        },
        {
          q: "ACF meluruh perlahan (eksponensial) dan PACF terputus tajam setelah lag 1. Model yang diusulkan?",
          options: [
            { text: "AR(1) — sidik jari klasik: PACF cut-off di p=1, ACF tail-off", why: "Benar: inilah pola identifikasi Box-Jenkins untuk AR(1).", correct: true },
            { text: "MA(1) — kebalikannya", why: "Salah: MA(1) justru ACF yang terputus di lag 1 dan PACF yang meluruh." },
            { text: "White noise — tidak ada pola", why: "Salah: ACF yang meluruh perlahan = ada memori; white noise ACF-nya nol di semua lag." },
            { text: "Random walk — perlu differencing", why: "Salah: random walk punya ACF ≈ 1 di banyak lag (sangat persisten), bukan meluruh eksponensial." },
          ],
        },
        {
          q: "GARCH(1,1) terestimasi: ω=0,02, α=0,12, β=0,85. Berapa varians jangka panjang dan half-life guncangan?",
          options: [
            { text: "σ²_∞ = 0,67; half-life ≈ 23 hari — volatilitas sangat persisten", why: "Benar: 0,02/(1−0,97) = 0,67; ln(0,5)/ln(0,97) ≈ 23 hari.", correct: true },
            { text: "σ²_∞ = 0,02; half-life 1 hari", why: "Salah: 0,02 adalah ω (komponen konstan), bukan varians jangka panjang — lupa membagi (1−α−β)." },
            { text: "Model tidak stasioner karena α+β=0,97 dekat 1", why: "Salah: syaratnya < 1, dan 0,97 < 1 — stasioner, hanya persisten. Dekat 1 ≠ melanggar." },
            { text: "σ²_∞ = 0,99; half-life tak terdefinisi", why: "Salah: 0,99 adalah α+β (persistensi), bukan varians; half-life terdefinisi selama α+β<1." },
          ],
        },
        {
          q: "phi_hat = 0,63 dari OLS AR(1) pada return. Interpretasi yang tepat?",
          options: [
            { text: "Stasioner (|φ|<1); ~63% guncangan hari ini terbawa ke besok; ramalan 1-langkah = 0,63 × return hari ini", why: "Benar: |0,63|<1 → stasioner; φ = kecepatan ingat/lupa pasar.", correct: true },
            { text: "Tidak stasioner karena φ > 0,5", why: "Salah: ambang stasioneritas adalah 1, bukan 0,5 — 0,63 < 1 berarti memori meluruh." },
            { text: "Besok pasti naik 63% dari hari ini", why: "Salah: 0,63 adalah koefisien autoregresif, bukan return; dan ramalan ≠ kepastian (ada ε_t)." },
            { text: "Model buruk — φ seharusnya mendekati 1", why: "Salah: φ→1 = random walk (tak-stasioner); 0,63 justru model yang sehat dan terinterpretasi." },
          ],
        },
        {
          q: "Desk memakai VaR konstan dan jebol 6x dalam 10 hari saat krisis. Setelah pasang GARCH, pelanggaran turun dan tidak bergerombol. Apa yang TIDAK diperbaiki GARCH?",
          options: [
            { text: "Lompatan (jump) semalam dan arah pasar — GARCH hanya mengatur lebar distribusi, bukan ekor ekstrem diskontinu", why: "Benar: untuk gap berita butuh stress test/skenario; VaR — model apa pun — bukan alat ekor ekstrem.", correct: true },
            { text: "Tidak ada — GARCH menyelesaikan semua masalah VaR", why: "Salah: tidak ada model volatilitas yang menangkap jump discontinu; klaim ini berbahaya." },
            { text: "GARCH justru memperburuk backtest karena lag 1 hari", why: "Salah: lag 1 hari adalah harga wajar; backtest membaik dramatis (60% → ~10% harian, tidak bergerombol)." },
            { text: "GARCH hanya untuk return, tidak untuk VaR", why: "Salah: VaR = kuantil × σ_t — GARCH justru dipasang untuk VaR adaptif." },
          ],
        },
      ],
      next: {
        label: "B24 — Backtesting & Monitoring Model Probabilistik",
        href: "/learn/b24-backtesting-monitoring-model",
      },
    },
  ],
};
