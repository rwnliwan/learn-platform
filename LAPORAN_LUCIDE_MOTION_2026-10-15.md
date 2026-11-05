# LAPORAN PAKET LUCIDE + MOTION — Learn v2 (2026-10-15)

Paket referensi Septian: `lucide-icons/lucide` (ISC) + `motiondivision/motion` (MIT, eks Framer Motion).
**Tidak ada deploy** — parent deploy setelah gerbang. rr19 / Guided Projects / konten lesson-misi tidak disentuh.

---

## BAGIAN A — LUCIDE

### Sumber ikon (verifikasi, bukan gambar sendiri)
- Paket resmi `lucide-static` **v1.57.0** diunduh via `npm pack` ke `/tmp/lm20261015` (tidak masuk repo).
- Semua 33 ikon dipilih lalu **nama file SVG-nya diverifikasi ada** di paket sebelum dipakai; path disalin verbatim, atribut kebab → camelCase (`stroke-width` → `strokeWidth`).
- **Atribusi ISC** ditambahkan di header comment `src/app/v2/lib/icons.tsx` (proyek Lucide, © Lucide contributors).

### Pemetaan ikon per track (25, final)
| Track | Ikon Lucide | Track | Ikon Lucide |
|---|---|---|---|
| Statistika | `chart-column` | Business Intelligence | `pie-chart` |
| Probabilitas | `dices` | Marketing Analytics | `megaphone` |
| SQL | `database` | Financial Markets | `chart-candlestick` |
| Python | `terminal` | Portfolio Management | `briefcase` |
| Credit Risk | `shield` | Machine Learning Engineer | `cpu` |
| Fraud & AML Analytics | `radar` | Deep Learning Engineer | `brain-circuit` |
| Market Risk | `trending-up` | MLOps | `server-cog` |
| Risk Reporting | `file-text` | LLMOps | `bot` |
| Health Data Science | `heart-pulse` | AI Engineering | `sparkles` |
| Bioinformatika | `dna` | Agentic AI Engineer | `waypoints` |
| Blockchain Data Scientist | `blocks` | — | — |
| WorldQuant Brain | `brain` | — | — |
| Data Management | `database-backup` | — | — |
| Data Engineer | `workflow` | — | — |
| Database Administrator | `server` | — | — |

Alias nama lama dipetakan: `"Fraud/AML"` → radar, `"Agentic AI"` → waypoints. Helper baru `trackIconFor(track)` di `icons.tsx` (fallback: `layers`).

### Ikon elemen Misi (8, di `icons.tsx` dengan prefix `m-`)
`m-briefing`→scroll-text · `m-dataroom`→folder-open · `m-decision`→git-branch · `m-impostor`→eye-off · `m-deliverable`→file-check · `m-debrief`→message-square · `m-lab`→flask-conical · `m-quiz`→list-checks.

### Pemasangan
- **Kurikulum** (`learn/TrackAccordion.tsx`): ikon track di header tiap akordeon (class `tacc-ic`, 20px, warna aksen).
- **Dashboard** (`lib/DashboardLive.tsx` TrackTable): ikon track sebelum nama track di tiap baris.
- **Galeri Misi** (`misi/MissionGallery.tsx`): ikon track di header kartu (eyebrow). Ikon *elemen* misi tidak dipasang di metadata kartu — metadata berisi durasi/langkah/XP yang tidak memetakan bersih ke 8 elemen; pemasangan track-icon sudah memberi identitas visual yang diminta.
- **Ikon nav existing tidak diubah.**
- CSS baru di `v2.css`: `.i.ti` (20px), `.tacc-ic`, `.tacc-anim`, `.fpitem .i.ti`, `.card-h .eyebrow` inline-flex.

---

## BAGIAN B — MOTION

Paket resmi `motion` **v14.2.0** terinstal (`motion/react`). Semua titik: durasi ≤250ms, `easeOut`, tanpa spring.

### Titik terpasang (3/3, tanpa fallback)
1. **Akordeon Kurikulum** (`TrackAccordion.tsx`): `AnimatePresence` + `motion.div` animasi `height: 0 ↔ auto` + opacity, 250ms. Wrapper `tacc-anim` (overflow hidden) membungkus `tblwrap` yang sudah ada.
2. **Kartu FocusPanel** (`lib/FocusPanel.tsx`): wrapper lokal `FpCard` — fade-in + slide 6px saat mount, stagger 40ms/kartu (delay = index × 0.04), durasi 200ms. Plus ikon track di kartu "Progres track".
3. **Runner lesson & misi** (`learn/[slug]/Workspace.tsx`, dipakai juga runner `/v2/misi/[slug]`): komponen baru `lib/StepAnim.tsx` — `AnimatePresence mode="wait"`, fade + slide 12px, 200ms, **hanya pada kontainer langkah** (`className="scroll prose"` diteruskan agar layout flex tidak berubah).

### Pagar keras (terpenuhi)
- `prefers-reduced-motion`: TrackAccordion & FocusPanel pakai `useReducedMotion()` → render div biasa; StepAnim cek `matchMedia` sebelum lazy-load → fallback div.
- **Lazy di runner**: StepAnim `import("motion/react")` dinamis di `useEffect` (tanpa `next/dynamic`, tanpa static import di Workspace) — motion tidak masuk chunk awal rute runner.
- Sidebar tetap transisi CSS existing (tidak diubah). Tidak ada layout shift (kelas layout diteruskan). Logika gating/progres tidak disentuh.

---

## Tambahan dari temuan Septian (screenshot galeri, layar lebar)
1. **Varian lebar**: `.v2 .main-in.wide{max-width:1400px}` di `v2.css`; diterapkan di halaman galeri `/v2/misi`. Grid `auto-fill minmax(300px,1fr)` tidak diubah → otomatis 4 kolom di layar lebar. Halaman teks/lesson (termasuk Kurikulum `/v2/learn`) tetap 1000px — akordeon adalah tabel teks padat, tidak diuntungkan layout lebar.
2. **Label header galeri**: `"75 misi pilot"` → `"75 misi"` (`misi/page.tsx`).

---

## Verifikasi mandiri

| Cek | Hasil |
|---|---|
| `npx tsc --noEmit` | **0 error** |
| `npx next build` | **exit 0** |
| Pola `\${` di semua file yang disentuh | **0** |
| Prosa | tidak ada prosa konten yang disentuh (hanya JSX struktur/atribut + 1 label UI) |
| Browser (server lokal :3111, build produksi) | 9/9 PASS, **0 pageerror**: 25 ikon header akordeon · toggle buka/tutup animasi (aria-expanded benar) · 25 ikon TrackTable dashboard · 75 ikon header kartu galeri · 4/4 kartu FocusPanel render dengan style motion · transisi ganti langkah runner · runner misi render (teks 4335) |
| Galeri dev (`next dev` :3112) | `main-in wide` ter-render, label "75 misi", 75 kartu |

Catatan jujur: satu cek FocusPanel sempat FAIL di run pertama (cards=0) — **artefak timing** (dicek 1,5 dtk setelah load, sebelum `ready` async). Verifikasi ulang dengan `networkidle` + 2 dtk: 4/4 kartu tampil dengan `opacity:1; transform:none` (animasi selesai), 0 pageerror.

### Delta bundle (build produksi, sebelum → sesudah)
| Rute | Sebelum | Sesudah | Delta |
|---|---|---|---|
| `/v2` | 2.32 kB / First Load 4.5 MB | 2.34 kB / 4.57 MB | +0.02 kB rute, +0.07 MB FL |
| `/v2/misi` | 878 B / 4.5 MB | 912 B / 4.57 MB | +34 B rute, +0.07 MB FL |
| `/v2/misi/[slug]` | 142 B / 205 kB | 142 B / 208 kB | **+3 kB** (StepAnim shell; motion ter-lazy) |
| Shared JS | 102 kB | 102 kB | 0 |

Kenaikan ~70 kB first-load di rute dashboard/galeri = `motion/react` (statis di TrackAccordion + FocusPanel, sesuai brief — hanya runner yang wajib lazy). First load 4.5 MB didominasi shared chunk existing (Pyodide dkk.), bukan paket ini.

---

## File yang diubah
- `src/app/v2/lib/icons.tsx` (+33 ikon, atribusi ISC, `trackIconFor`)
- `src/app/v2/lib/StepAnim.tsx` (baru)
- `src/app/v2/learn/TrackAccordion.tsx` (ikon + animasi akordeon)
- `src/app/v2/lib/DashboardLive.tsx` (ikon TrackTable)
- `src/app/v2/misi/MissionGallery.tsx` (ikon header kartu)
- `src/app/v2/lib/FocusPanel.tsx` (FpCard stagger + ikon track)
- `src/app/v2/learn/[slug]/Workspace.tsx` (StepAnim di kontainer langkah)
- `src/app/v2/v2.css` (`.ti`, `.tacc-ic`, `.tacc-anim`, `.main-in.wide`, dsb.)
- `src/app/v2/misi/page.tsx` (`main-in wide` + label "75 misi")
- `package.json` / `package-lock.json` (motion 14.2.0)

**Siap untuk gerbang + deploy parent.**
