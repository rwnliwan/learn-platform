import { redirect } from "next/navigation";

// Sejak 2026-10-16 (ACC Septian): pintu depan domain diarahkan ke v2.
// Indeks legacy v1 (daftar datar ±295 kartu, sebagian judul rusak) digantikan
// redirect ini. Halaman /learn/* lama tetap hidup bila URL-nya dibuka langsung.
// Backup komponen indeks lama: backup_root_page_legacy_2026-10-16.tsx.bak
export default function Home() {
  redirect("/v2");
}
