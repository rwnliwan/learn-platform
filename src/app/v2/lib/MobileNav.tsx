// Bottom tab bar for dashboard pages on mobile: the sidenav is display:none
// below 820px, so without this there is NO navigation at all on phones.
// F2 fix (2026-11-05): max 5 primary tabs + "Lainnya" bottom sheet.
// 16 tabs in one row was unreadable at 390px.
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "./icons";

const PRIMARY = [
  { href: "/v2", label: "Beranda", icon: "home" },
  { href: "/v2/learn", label: "Kurikulum", icon: "layers" },
  { href: "/v2/review", label: "Tinjau", icon: "refresh" },
  { href: "/v2/misi", label: "Misi", icon: "flag" },
  { href: "/v2/karier", label: "Karier", icon: "target" },
] as const;

const MORE = [
  { href: "/v2/mulai", label: "Mulai", icon: "play" },
  { href: "/v2/warisan", label: "Warisan", icon: "book" },
  { href: "/v2/kebingungan", label: "Kebingungan", icon: "bulb" },
  { href: "/v2/lab-bebas", label: "Lab", icon: "chart" },
  // Additive 2026-10-16: /v2/peta (Gelombang J — Knowledge Graph).
  { href: "/v2/peta", label: "Peta", icon: "db" },
  // Additive 2026-10-16: /v2/portofolio (Gelombang K — Portfolio Generator).
  { href: "/v2/portofolio", label: "Portofolio", icon: "briefcase" },
  // Additive 2026-10-17: /v2/pengaturan-ai (Gelombang M — AI runtime foundation).
  { href: "/v2/pengaturan-ai", label: "AI", icon: "bot" },
  // Additive 2026-10-17: /v2/mentor (Gelombang P — Silent Mentor Network).
  { href: "/v2/mentor", label: "Mentor", icon: "brain-circuit" },
  // Additive 2026-10-17: /v2/wawancara (Gelombang Q — Interview Simulator).
  { href: "/v2/wawancara", label: "Wawancara", icon: "megaphone" },
  { href: "/v2/catatan", label: "Catatan", icon: "note" },
  { href: "/v2/pengaturan", label: "Pengaturan", icon: "gear" },
] as const;

export default function MobileNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const moreActive = MORE.some((it) => path.startsWith(it.href));

  function tab(it: { href: string; label: string; icon: string }) {
    const active = it.href === "/v2" ? path === "/v2" : path.startsWith(it.href);
    return (
      <Link key={it.href} href={it.href} prefetch={it.href === "/v2/learn" || it.href === "/v2/misi" ? false : undefined} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
        <Icon name={it.icon} />
        <span>{it.label}</span>
      </Link>
    );
  }

  return (
    <>
      <nav className="mnav" aria-label="Navigasi utama">
        {PRIMARY.map(tab)}
        <button
          type="button"
          className="mnav-more"
          aria-expanded={open}
          aria-current={moreActive ? "page" : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name="menu" />
          <span>Lainnya</span>
        </button>
      </nav>
      {open && (
        <div className="mnav-sheet-wrap" onClick={() => setOpen(false)}>
          <div className="mnav-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menu lainnya">
            <div className="mnav-sheet-h">
              <b>Menu lainnya</b>
              <button type="button" className="mnav-sheet-x" onClick={() => setOpen(false)} aria-label="Tutup">✕</button>
            </div>
            <div className="mnav-sheet-list">
              {MORE.map((it) => {
                const active = path.startsWith(it.href);
                return (
                  <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                    <Icon name={it.icon} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
