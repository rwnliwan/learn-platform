# LAPORAN — Panel Fokus Sidebar (2026-10-15)

Perintah: Septian via parent — "design panel lengkapnya" di sidebar dashboard (ditunda sampai gelombang Misi tuntas; dikerjakan sebagai tahap pasca-Capstone).
Status: **SELESAI & terverifikasi. TIDAK ada deploy** (gerbang + deploy di tangan parent).

## File yang diubah/dibuat

| File | Aksi |
|---|---|
| `src/app/v2/lib/FocusPanel.tsx` | BARU — client component, 4 kartu ringkas |
| `src/app/v2/lib/DashboardNav.tsx` | tambah `<FocusPanel />` di antara nav utama dan nav foot (+ import) |
| `src/app/v2/v2.css` | tambah blok `.focuspanel/.fpcard/...` + `display:none` di mode rail |

Murni aditif: order/item nav tidak berubah, rr19/Guided Projects tidak disentuh, MobileNav tidak berubah, perilaku minimize tidak berubah.

## Sumber data per kartu

1. **Lanjutkan** — progres server `GET /api/progress` (union dengan `v2:done:*` lokal + `v2:activity` kunjungan terakhir): aktivitas terbaru → track-nya → item pertama di track itu yang belum selesai (urutan registry; misi ikut via `REG_MISI`). Bila belum ada progres sama sekali: fallback ajakan mulai — lesson pertama dari track terbesar. Link: `/v2/learn/<slug>` atau `/v2/misi/<slug>`.
2. **Review** — `getStats()` dari `lib/fsrs.ts` (localStorage `v2:fsrs:*`, `due <= now`): tampilkan jumlah kartu due + link `/v2/review`; bila 0 → teks netral "Belum ada review jatuh tempo."
3. **Progres track** — track dari aktivitas terakhir: x selesai / y total (lesson + misi dalam track) + progress bar tipis (solid `var(--accent)`, tanpa gradient).
4. **Sorotan misi** — misi yang belum selesai, prioritas capstone `misi-gabung-*`, rotasi deterministik `dayOfYear % pool`; tampilkan judul + track + estMinutes + link runner.

Aturan: tanpa endpoint/API baru, tanpa skema DB baru. Semua baca async; render tidak terblokir (skeleton teks "Memuat ringkasan…"); error per kartu → kartu disembunyikan, tidak ada error mentah.

## Perilaku rail & mobile (terverifikasi browser)

- Mode expanded: section `.focuspanel` tampil dengan 4 kartu (state kosong: Lanjutkan→CTA lesson pertama track terbesar, Review→netral, Progres→0/y, Sorotan→capstone rotasi hari ini).
- Mode rail (`data-collapsed="true"`): CSS `display:none` — SEMBUNYI TOTAL. Mobile (≤820px): Sidenav `display:none` (existing) — panel ikut hilang; MobileNav tidak berubah.
- Dark theme: warna dari var (--text/--text-muted/--text-faint/--border/--accent); tanpa gradient; spacing basis 8px; teks judul ellipsis tanpa overflow horizontal (dites 1280px).

## Verifikasi

- `npx tsc --noEmit`: **0 error** (repo-wide).
- Pola `\${`: **0** di file baru.
- Playwright lokal (server :3111, build produksi fresh):
  - Expanded + state kosong: 4 kartu ter-render benar, 0 pageerror.
  - Rail: `display:none` terkonfirmasi.
  - State terisi (2 lesson selesai + 1 FSRS due): Lanjutkan → "CR3 — PD, LGD, EAD" (Credit Risk, link lesson), Review → "1 kartu jatuh tempo" + link /v2/review, Progres → "Credit Risk 2/41 selesai", Sorotan → capstone "Misi Tool: Agen yang Membuka Pintu yang Salah". 0 pageerror.
