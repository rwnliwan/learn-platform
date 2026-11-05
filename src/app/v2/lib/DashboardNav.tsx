"use client";
import Link from "next/link";
import Icon from "./icons";
import Sidenav from "./Sidenav";
import MobileNav from "./MobileNav";
import FocusPanel from "./FocusPanel";

// Shared dashboard sidenav for /v2, /v2/learn, /v2/review, /v2/karier, /v2/warisan.
// Links only point to routes that actually exist; features not yet built
// (projects, notes, datasets, settings) are shown disabled with
// "Segera hadir" instead of fake links.
export default function DashboardNav({ active }: { active: "beranda" | "mulai" | "kurikulum" | "tinjau" | "karier" | "warisan" | "kebingungan" | "labbebas" | "peta" | "portofolio" | "ai" | "mentor" | "wawancara" | "buku" | "catatan" | "pengaturan" | "proyek" }) {
  function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* noop */
    }
  }
  return (
    <>
      <Sidenav>
        <nav className="nav" aria-label="Utama">
        <Link href="/v2" aria-current={active === "beranda" ? "page" : undefined} title="Beranda">
          <Icon name="home" />
          <span className="nlbl">Beranda</span>
        </Link>
        {/* Additive 2026-10-16: /v2/mulai (Gelombang A — jalur belajar + tes penempatan). */}
        <Link href="/v2/mulai" aria-current={active === "mulai" ? "page" : undefined} title="Mulai dari sini">
          <Icon name="play" />
          <span className="nlbl">Mulai</span>
        </Link>
        {/* prefetch={false} on /v2/learn + /v2/misi below: their RSC payloads are ~20MB / ~3MB (full lesson/misi index) — prefetching them on every dashboard view kills slow networks (2026-11-05). */}
        <Link prefetch={false} href="/v2/learn" aria-current={active === "kurikulum" ? "page" : undefined} title="Kurikulum">
          <Icon name="layers" />
          <span className="nlbl">Kurikulum</span>
        </Link>
        {/* Additive 2026-10-14: /v2/karier (ITEM 5+7 program upgrade). */}
        <Link href="/v2/karier" aria-current={active === "karier" ? "page" : undefined} title="Kesiapan karier">
          <Icon name="target" />
          <span className="nlbl">Kesiapan karier</span>
        </Link>
        <Link href="/v2/review" aria-current={active === "tinjau" ? "page" : undefined} title="Tinjau ulang">
          <Icon name="refresh" />
          <span className="nlbl">Tinjau ulang</span>
        </Link>
        {/* Additive 2026-10-16: /v2/warisan (Gelombang F — Legacy Mode). */}
        <Link href="/v2/warisan" aria-current={active === "warisan" ? "page" : undefined} title="Warisan pengetahuan: proyeksi retensi jangka panjang">
          <Icon name="book" />
          <span className="nlbl">Warisan</span>
        </Link>
        {/* Additive 2026-10-16: /v2/kebingungan (Gelombang G — Confusion Index). */}
        <Link href="/v2/kebingungan" aria-current={active === "kebingungan" ? "page" : undefined} title="Peta Kebingungan: titik rapuh dan intervensi terkecil">
          <Icon name="bulb" />
          <span className="nlbl">Kebingungan</span>
        </Link>
        {/* Additive 2026-10-16: /v2/lab-bebas (Gelombang I — Lab Bebas). */}
        <Link href="/v2/lab-bebas" aria-current={active === "labbebas" ? "page" : undefined} title="Lab Bebas: ruang eksperimen eksploratif dengan engine yang sama seperti Misi">
          <Icon name="chart" />
          <span className="nlbl">Lab Bebas</span>
        </Link>
        {/* Additive 2026-10-16: /v2/peta (Gelombang J — Knowledge Graph). */}
        <Link href="/v2/peta" aria-current={active === "peta" ? "page" : undefined} title="Peta Pengetahuan: jembatan antar konsep, lesson pembuka, dan bottleneck dari data kurikulum">
          <Icon name="db" />
          <span className="nlbl">Peta</span>
        </Link>
        {/* Additive 2026-10-16: /v2/portofolio (Gelombang K — Portfolio Generator). */}
        <Link href="/v2/portofolio" aria-current={active === "portofolio" ? "page" : undefined} title="Portofolio: 7 proyek flagship sebagai studi kasus siap bagikan">
          <Icon name="briefcase" />
          <span className="nlbl">Portofolio</span>
        </Link>
        {/* Additive 2026-10-17: /v2/pengaturan-ai (Gelombang M — AI runtime foundation). */}
        <Link href="/v2/pengaturan-ai" aria-current={active === "ai" ? "page" : undefined} title="Pengaturan AI: sambungkan provider AI untuk fitur AI Learn v2">
          <Icon name="bot" />
          <span className="nlbl">AI</span>
        </Link>
        {/* Additive 2026-10-17: /v2/mentor (Gelombang P — Silent Mentor Network). */}
        <Link href="/v2/mentor" aria-current={active === "mentor" ? "page" : undefined} title="Mentor Senyap: jaringan mentor AI yang menulis catatan hanya saat kamu meminta">
          <Icon name="brain-circuit" />
          <span className="nlbl">Mentor</span>
        </Link>
        {/* Additive 2026-10-17: /v2/wawancara (Gelombang Q — Interview Simulator). */}
        <Link href="/v2/wawancara" aria-current={active === "wawancara" ? "page" : undefined} title="Simulator Wawancara: latihan wawancara kerja dengan AI pewawancara">
          <Icon name="megaphone" />
          <span className="nlbl">Wawancara</span>
        </Link>
        {/* Additive 2026-10-17: /v2/buku (Gelombang 1 Bedah Buku — Rak Buku + paket Bab 1–3). */}
        <Link href="/v2/buku" aria-current={active === "buku" ? "page" : undefined} title="Bedah Buku: bedah The Elements of Quantitative Investing per bab">
          <Icon name="table" />
          <span className="nlbl">Buku</span>
        </Link>
        <Link href="/v2/proyek" aria-current={active === "proyek" ? "page" : undefined} title="Proyek terpandu: audit portofolio alpha">
          <Icon name="flask" />
          <span className="nlbl">Proyek</span>
        </Link>
        {/* Additive 2026-10-15: galeri Misi (pilot 3 misi; rollout bertahap ke 75). */}
        <Link prefetch={false} href="/v2/misi" title="Misi: proyek end-to-end dengan dataset publik asli">
          <Icon name="flag" />
          <span className="nlbl">Misi</span>
        </Link>
        <Link href="/v2/catatan" aria-current={active === "catatan" ? "page" : undefined} title="Catatan pribadi">
          <Icon name="note" />
          <span className="nlbl">Catatan</span>
        </Link>
        <hr />
        <div className="grp">Track</div>
        <Link prefetch={false} href="/v2/learn" title="Semua track">
          <Icon name="chart" />
          <span className="nlbl">Semua track</span>
        </Link>
      </nav>
      {/* Additive 2026-10-15: Panel Fokus — sembunyi total di mode rail & mobile. */}
      <FocusPanel />
      <nav className="nav foot" aria-label="Pengaturan">
        <button type="button" className="navbtn" onClick={toggleTheme} title="Ganti tema" aria-label="Ganti tema">
          <Icon name="moon" />
          <span className="nlbl">Tema</span>
        </button>
        <Link href="/v2/pengaturan" aria-current={active === "pengaturan" ? "page" : undefined} title="Pengaturan">
          <Icon name="gear" />
          <span className="nlbl">Pengaturan</span>
        </Link>
      </nav>
    </Sidenav>
      <MobileNav />
    </>
  );
}
