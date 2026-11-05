// Registry MISI — terpisah dari registry lesson (src/app/v2/lib/registry.ts).
//
// Keputusan desain (pilot 2026-10-15, didokumentasikan di LAPORAN_MISI_PILOT):
// misi TIDAK di-spread ke REGISTRY lesson agar hitungan "550 lesson" di
// dashboard /v2 tidak berubah dan route /v2/learn tidak tercampur.
// Galeri + runner misi hidup di /v2/misi dengan registry sendiri,
// mengikuti pola REG_* yang sama (aditif murni).
import type { V2Mission } from "./types";
import { REG_MISI } from "./reg-misi";

export function getMission(slug: string): V2Mission | null {
  return REG_MISI[slug] ?? null;
}

export function missionSlugs(): string[] {
  return Object.keys(REG_MISI);
}

export function allMissions(): V2Mission[] {
  return Object.values(REG_MISI);
}
